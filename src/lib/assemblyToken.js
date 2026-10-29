// src/lib/assemblyToken.js
// Helper to retrieve AssemblyAI token from Supabase Edge Function

export async function getAssemblyToken() {
    const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
    const resp = await fetch(`${supabaseUrl}/functions/v1/assemblyai-token`);
    if (!resp.ok) {
        console.error('Failed to fetch AssemblyAI token', resp.status);
        throw new Error('Unable to obtain AssemblyAI token');
    }
    const data = await resp.json();
    return data.token;
}
