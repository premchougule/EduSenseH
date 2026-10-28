// supabase/functions/groq/index.ts
// Edge Function to proxy Groq chat completions
// Receives a JSON payload with the same fields as the Groq SDK expects.
// Example request body:
// {
//   "messages": [{"role": "system", "content": "..."}, {"role": "user", "content": "..."}],
//   "model": "openai/gpt-4o-mini",
//   "temperature": 0.7,
//   "max_tokens": 500
// }

import { serve } from "https://deno.land/std@0.224.0/http/server.ts";

serve(async (req) => {
    try {
        const body = await req.json();
        const apiKey = Deno.env.get("GROQ_API_KEY");
        if (!apiKey) {
            return new Response(JSON.stringify({ error: "GROQ_API_KEY not configured" }), { status: 500 });
        }
        const response = await fetch("https://api.groq.com/openai/v1/chat/completions", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${apiKey}`,
            },
            body: JSON.stringify(body),
        });
        const data = await response.json();
        return new Response(JSON.stringify(data), {
            status: response.status,
            headers: { "Content-Type": "application/json" },
        });
    } catch (e) {
        console.error(e);
        return new Response(JSON.stringify({ error: "Internal server error" }), { status: 500 });
    }
});
