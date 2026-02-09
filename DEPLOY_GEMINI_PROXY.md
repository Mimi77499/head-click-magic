Deploying the `gemini-proxy` Supabase Function

This project includes a Supabase Edge Function at `supabase/functions/gemini-proxy` that proxies requests to the Google Gemini API (via the configured AI gateway) so your API key remains server-side.

1) Environment variables
- Set one of the following environment variables in your Supabase project (or the environment you deploy to):
  - `GEMINI_API_KEY` (preferred)
  - or `LOVABLE_API_KEY` (if using the gateway)

2) Deploy the function
- From the `supabase` directory, use the Supabase CLI to deploy the function:

```bash
cd supabase/functions/gemini-proxy
supabase functions deploy gemini-proxy --project <your-project-ref>
```

3) Local testing
- If you run the Supabase local emulator, functions are available at `http://localhost:54321/functions/v1/<name>` by default.
- The frontend expects the proxy under `/supabase/functions/v1/gemini-proxy` by default. You can override this during build with `VITE_GEMINI_PROXY_URL`.

4) Frontend configuration
- Set `VITE_GEMINI_PROXY_URL` in your Vite env or deployment settings to point to the deployed function URL if it differs from the default.

5) Security notes
- Keep the API key secret. Do NOT commit keys to source.
- The function uses CORS allowing `*` for quick testing; tighten origins for production.

If you want, I can also add a small server-side test script and CI step that pings the function after deploy to verify it returns valid JSON.
