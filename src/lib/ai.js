import multilingualAIService from './multilingualAI.js';

// All AI calls are forwarded to the multilingual service which uses Supabase Edge Functions.
// Direct Groq/AssemblyAI SDK usage has been moved server-side.

export const aiService = {
    generateSummary: async (text, targetLanguage = null) => {
        return await multilingualAIService.generateSummary(text, targetLanguage);
    },

    generateQuiz: async (text, targetLanguage = null) => {
        return await multilingualAIService.generateQuiz(text, targetLanguage);
    },

    getTutorResponse: async (context, userQuestion, targetLanguage = null) => {
        return await multilingualAIService.getTutorResponse(context, userQuestion, targetLanguage);
    },

    transcribeAudio: async (audioUrl, targetLanguage = null) => {
        return await multilingualAIService.transcribeAudio(audioUrl, targetLanguage);
    },

    generateFlashcards: async (text, targetLanguage = null) => {
        return await multilingualAIService.generateFlashcards(text, targetLanguage);
    },

    generateEducationalInsights: async (transcript, confusionLevel, targetLanguage = null) => {
        return await multilingualAIService.generateEducationalInsights(transcript, confusionLevel, targetLanguage);
    },

    getSupportedLanguages: () => {
        return multilingualAIService.getSupportedLanguages();
    },

    // Stub kept for backward compatibility; live streaming handled directly in liveTranscription.js
    createRealtimeTranscriber: () => {
        console.warn('createRealtimeTranscriber is deprecated; use startLiveTranscription directly.');
        return null;
    },
};

// Export the multilingual service as default
export default multilingualAIService;