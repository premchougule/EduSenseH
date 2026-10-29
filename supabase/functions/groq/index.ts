// supabase/functions/groq/index.ts
// Edge Function to proxy Groq chat completions.
// Keeps the GROQ_API_KEY server-side; never exposed to the browser.

const corsHeaders = {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
    "Access-Control-Allow-Methods": "POST, OPTIONS",
};

Deno.serve(async (req) => {
    // Handle CORS preflight
    if (req.method === "OPTIONS") {
        return new Response("ok", { headers: corsHeaders });
    }

    try {
        const body = await req.json();
        const apiKey = Deno.env.get("GROQ_API_KEY");
        if (!apiKey) {
            return new Response(
                JSON.stringify({ error: "GROQ_API_KEY not configured" }),
                { status: 500, headers: { "Content-Type": "application/json", ...corsHeaders } }
            );
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
            headers: { "Content-Type": "application/json", ...corsHeaders },
        });
    } catch (e) {
        console.error("Groq function error:", e);
        return new Response(
            JSON.stringify({ error: "Internal server error" }),
            { status: 500, headers: { "Content-Type": "application/json", ...corsHeaders } }
        );
    }
});
