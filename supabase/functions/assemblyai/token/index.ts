// supabase/functions/assemblyai/token/index.ts
// Edge Function that returns the AssemblyAI API key as a token for client use.
// The client will request this endpoint to obtain a temporary token for streaming.

import { serve } from "https://deno.land/std@0.224.0/http/server.ts";

serve(() => {
    const apiKey = Deno.env.get("ASSEMBLYAI_API_KEY");
    if (!apiKey) {
        return new Response(JSON.stringify({ error: "ASSEMBLYAI_API_KEY not configured" }), { status: 500, headers: { "Content-Type": "application/json" } });
    }
    // Return the key in JSON; client will use it as token query param.
    return new Response(JSON.stringify({ token: apiKey }), { status: 200, headers: { "Content-Type": "application/json" } });
});
