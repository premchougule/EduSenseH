// src/lib/groqClient.js
// Helper to call Groq Edge Function via Supabase Functions

export async function callGroq(payload) {
    const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
    const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;
    const resp = await fetch(`${supabaseUrl}/functions/v1/groq`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'apikey': supabaseAnonKey,
            'Authorization': `Bearer ${supabaseAnonKey}`,
        },
        body: JSON.stringify(payload),
    });
    if (!resp.ok) {
        const err = await resp.text();
        console.error('Groq Edge Function error', resp.status, err);
        throw new Error(`Failed to call Groq function: ${resp.status} ${err}`);
    }
    return await resp.json();
}
