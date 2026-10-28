// supabase/functions/assemblyai-token/index.ts
// Edge Function that returns the AssemblyAI API key as a token for client-side streaming.
// The client will request this endpoint to obtain a token for AssemblyAI WebSocket auth.

Deno.serve(() => {
    const apiKey = Deno.env.get("ASSEMBLYAI_API_KEY");
    if (!apiKey) {
        return new Response(
            JSON.stringify({ error: "ASSEMBLYAI_API_KEY not configured" }),
            { status: 500, headers: { "Content-Type": "application/json" } }
        );
    }
    return new Response(
        JSON.stringify({ token: apiKey }),
        { status: 200, headers: { "Content-Type": "application/json" } }
    );
});
