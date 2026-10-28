/**
 * Multilingual live transcription using AssemblyAI Streaming v3 API.
 * Supports English, Hindi, and Marathi with automatic language detection.
 */

const TARGET_SAMPLE_RATE = 16000;
const WS_BASE = 'wss://streaming.assemblyai.com/v3/ws';

// Language configurations for AssemblyAI
const TRANSCRIPTION_LANGUAGES = {
  en: { name: 'English', code: 'en', assemblyCode: 'en' },
  hi: { name: 'हिंदी', code: 'hi', assemblyCode: 'hi' },
  mr: { name: 'मराठी', code: 'mr', assemblyCode: 'mr' }
};

/** Resample float32 mono to target rate and convert to Int16 PCM. */
function resampleTo16k(float32Input, sourceSampleRate) {
  if (sourceSampleRate === TARGET_SAMPLE_RATE) {
    const pcm = new Int16Array(float32Input.length);
    for (let i = 0; i < float32Input.length; i++) {
      const s = Math.max(-1, Math.min(1, float32Input[i]));
      pcm[i] = s < 0 ? s * 0x8000 : s * 0x7fff;
    }
    return pcm;
  }
  const ratio = sourceSampleRate / TARGET_SAMPLE_RATE;
  const outLength = Math.floor(float32Input.length / ratio);
  const pcm = new Int16Array(outLength);
  for (let i = 0; i < outLength; i++) {
    const srcIndex = i * ratio;
    const idx0 = Math.floor(srcIndex);
    const idx1 = Math.min(idx0 + 1, float32Input.length - 1);
    const frac = srcIndex - idx0;
    const sample = float32Input[idx0] * (1 - frac) + float32Input[idx1] * frac;
    const s = Math.max(-1, Math.min(1, sample));
    pcm[i] = s < 0 ? s * 0x8000 : s * 0x7fff;
  }
  return pcm;
}

/**
 * Create and start a multilingual live transcription session.
 * @param {string} apiKey - AssemblyAI API key
 * @param {object} options
 * @param {string} options.language - Target language code (en, hi, mr)
 * @param {(status: string) => void} options.onStatus - Status callback
 * @param {(text: string) => void} options.onPartial - Partial transcript callback
 * @param {(text: string) => void} options.onFinal - Final transcript callback
 * @param {(language: string) => void} options.onLanguageDetected - Language detection callback
 * @returns {Promise<{ stop: () => void }>} Controller with stop() method
 */
export async function startMultilingualLiveTranscription(apiKey, options = {}) {
  const {
    language = 'en',
    onStatus,
    onPartial,
    onFinal,
    onLanguageDetected
  } = options;

  console.log('[Multilingual Transcription] Starting with language:', language);

  if (!apiKey || apiKey === 'your_assemblyai_api_key_here') {
    const msg = 'AssemblyAI token unavailable. Ensure the assemblyai/token Edge Function is deployed.';
    console.error('[Multilingual Transcription]', msg);
    onStatus?.('Error');
    throw new Error(msg);
  }

  const langConfig = TRANSCRIPTION_LANGUAGES[language] || TRANSCRIPTION_LANGUAGES.en;

  onStatus?.('Connecting');
  onLanguageDetected?.(langConfig.name);

  // WebSocket URL with token and language parameters
  const params = new URLSearchParams({
    token: apiKey,
    language_code: langConfig.assemblyCode,
    sample_rate: String(TARGET_SAMPLE_RATE),
    format_text: 'true',
    vad_threshold: '0.4'
  });
  const wsUrl = `${WS_BASE}?${params.toString()}`;

  console.log('[Multilingual Transcription] Connecting to:', WS_BASE, 'with language:', langConfig.assemblyCode);
  const ws = new WebSocket(wsUrl);
  ws.binaryType = 'arraybuffer';

  let mediaRecorder;
  let audioContext;
  let source;
  let processor;
  let isStopped = false;

  ws.onopen = () => {
    console.log(`[Multilingual Transcription] Connected for language: ${langConfig.name}`);
    onStatus?.('Connected');
  };

  ws.onmessage = (event) => {
    if (isStopped) return;

    try {
      const msg = JSON.parse(event.data);
      const type = msg.message_type || msg.type;

      // console.log(`[Multilingual Transcription] Message received:`, { type, msg });

      if (type === 'SessionBegins' || type === 'Begin') {
        console.log(`[Multilingual Transcription] Session began for ${langConfig.name}`);
        onStatus?.('Live');
      } else if (type === 'Turn') {
        // AssemblyAI Streaming v3 format: Turn messages with end_of_turn flag
        const text = msg.transcript || '';
        const isFinal = msg.end_of_turn === true;

        if (text.trim().length > 0) {
          if (isFinal) {
            console.log(`[Multilingual Transcription] Final transcript:`, text);
            onFinal?.(text + ' ');
          } else {
            console.log(`[Multilingual Transcription] Partial transcript:`, text);
            onPartial?.(text);
          }
        }
      } else if (type === 'PartialTranscript') {
        const text = msg.text || msg.transcript || '';
        if (text.trim().length > 0) {
          console.log(`[Multilingual Transcription] Partial transcript:`, text);
          onPartial?.(text);
        }
      } else if (type === 'FinalTranscript') {
        const text = msg.text || msg.transcript || '';
        if (text.trim().length > 0) {
          console.log(`[Multilingual Transcription] Final transcript:`, text);
          onFinal?.(text);
        }
      } else if (type === 'Error') {
        console.error('[Multilingual Transcription] Error:', msg.error);
        onStatus?.('Error');
      } else {
        console.log(`[Multilingual Transcription] Message type: ${type}`);
      }
    } catch (e) {
      console.error('[Multilingual Transcription] Message parse error:', e, event.data);
    }
  };

  ws.onerror = (error) => {
    console.error('[Multilingual Transcription] WebSocket error:', error);
    onStatus?.('Error');
  };

  ws.onclose = (event) => {
    console.log('[Multilingual Transcription] Connection closed', { code: event?.code, reason: event?.reason });
    onStatus?.('Disconnected');
  };

  // Setup microphone capture
  try {
    console.log('[Multilingual Transcription] Requesting microphone access...');
    const stream = await navigator.mediaDevices.getUserMedia({
      audio: {
        echoCancellation: true,
        noiseSuppression: true,
        autoGainControl: true
      }
    });
    console.log('[Multilingual Transcription] Microphone access granted', { tracks: stream.getTracks().length });

    audioContext = new (window.AudioContext || window.webkitAudioContext)();
    console.log('[Multilingual Transcription] AudioContext created, sampleRate:', audioContext.sampleRate);

    if (audioContext.state === 'suspended') {
      await audioContext.resume();
      console.log('[Multilingual Transcription] AudioContext resumed');
    }

    source = audioContext.createMediaStreamSource(stream);
    console.log('[Multilingual Transcription] MediaStreamSource created');

    // Create script processor for audio processing
    processor = audioContext.createScriptProcessor(4096, 1, 1);
    let audioChunksCount = 0;
    processor.onaudioprocess = (event) => {
      if (isStopped || ws.readyState !== WebSocket.OPEN) return;

      const inputBuffer = event.inputBuffer.getChannelData(0);
      const pcm = resampleTo16k(inputBuffer, audioContext.sampleRate);

      // Send PCM data to AssemblyAI
      if (pcm.byteLength > 0) {
        audioChunksCount++;
        if (audioChunksCount % 50 === 1) {
          console.log(`[Multilingual Transcription] Sent audio chunk #${audioChunksCount}, size: ${pcm.byteLength} bytes`);
        }
        ws.send(pcm.buffer);
      }
    };

    source.connect(processor);
    processor.connect(audioContext.destination);

  } catch (error) {
    console.error('[Multilingual Transcription] Microphone access error:', error);
    onStatus?.('Error');
    throw error;
  }

  // Return controller with stop method
  return {
    stop: () => {
      isStopped = true;

      if (processor) {
        processor.disconnect();
        processor = null;
      }

      if (source) {
        source.disconnect();
        source = null;
      }

      if (audioContext) {
        audioContext.close();
        audioContext = null;
      }

      if (ws && ws.readyState === WebSocket.OPEN) {
        ws.send(JSON.stringify({ terminate_session: true }));
        ws.close();
      }

      onStatus?.('Stopped');
      console.log('[Multilingual Transcription] Session stopped');
    }
  };
}

/**
 * Auto-detect language from audio and start transcription
 * @param {string} apiKey - AssemblyAI API key
 * @param {object} callbacks - Callback functions
 * @returns {Promise<{ stop: () => void }>} Controller
 */
export async function startAutoDetectTranscription(apiKey, callbacks = {}) {
  const { onStatus, onPartial, onFinal, onLanguageDetected } = callbacks;

  // Try English first, then fallback to other languages if needed
  const languages = ['en', 'hi', 'mr'];
  let currentLangIndex = 0;
  let currentController = null;
  let detectionAttempts = 0;
  const maxAttempts = 3;

  const tryNextLanguage = async () => {
    if (currentLangIndex >= languages.length || detectionAttempts >= maxAttempts) {
      onStatus?.('Error');
      onLanguageDetected?.('Detection failed');
      return;
    }

    const lang = languages[currentLangIndex];
    const langConfig = TRANSCRIPTION_LANGUAGES[lang];

    console.log(`[Auto-Detect] Trying language: ${langConfig.name}`);

    try {
      currentController = await startMultilingualLiveTranscription(apiKey, {
        language: lang,
        onStatus,
        onPartial,
        onFinal,
        onLanguageDetected: (detectedLang) => {
          onLanguageDetected?.(detectedLang);
          // If we get meaningful transcription, stick with this language
          if (detectedLang === langConfig.name && onFinal) {
            // Language successfully detected
            return;
          }
        }
      });

      // Monitor for successful transcription
      let hasTranscription = false;
      const originalOnFinal = onFinal;
      const monitoredOnFinal = (text) => {
        if (text && text.trim().length > 5) {
          hasTranscription = true;
          onLanguageDetected?.(`${langConfig.name} (Auto-detected)`);
        }
        originalOnFinal?.(text);
      };

      // Give it 10 seconds to detect meaningful speech
      setTimeout(() => {
        if (!hasTranscription && currentController) {
          currentController.stop();
          currentLangIndex++;
          detectionAttempts++;
          tryNextLanguage();
        }
      }, 10000);

    } catch (error) {
      console.error(`[Auto-Detect] Failed for ${langConfig.name}:`, error);
      currentLangIndex++;
      detectionAttempts++;
      tryNextLanguage();
    }
  };

  await tryNextLanguage();
  return currentController;
}

/**
 * Get supported transcription languages
 * @returns {Array<{code: string, name: string, assemblyCode: string}>}
 */
export function getSupportedTranscriptionLanguages() {
  return Object.keys(TRANSCRIPTION_LANGUAGES).map(key => ({
    code: key,
    name: TRANSCRIPTION_LANGUAGES[key].name,
    assemblyCode: TRANSCRIPTION_LANGUAGES[key].assemblyCode
  }));
}

export default {
  startMultilingualLiveTranscription,
  startAutoDetectTranscription,
  getSupportedTranscriptionLanguages
};
