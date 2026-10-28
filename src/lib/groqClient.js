// src/lib/groqClient.js
// Helper to call Groq Edge Function via Supabase Functions

export async function callGroq(payload) {
    const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
    const resp = await fetch(`${supabaseUrl}/functions/v1/groq`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
    });
    if (!resp.ok) {
        const err = await resp.text();
        console.error('Groq Edge Function error', resp.status, err);
        throw new Error('Failed to call Groq function');
    }
    return await resp.json();
}
