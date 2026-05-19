---
name: testing-otris-ai
description: Test the OTRIS AI/LACITA chat app locally, including AI provider fallback and Supabase-backed chat history.
---

## Devin Secrets Needed

- `GROQ_API_KEY` — primary Groq provider key.
- `OPENAI_API_KEY` — OpenAI fallback provider key.
- `SUPABASE_URL` — Supabase project URL.
- `SUPABASE_KEY` — Supabase anon/public key used by the backend.

Do not print secret values. Check presence only with shell conditionals or `list_secrets`.

## Local Setup

From the repo root:

```bash
npm install
(cd client && npm install)
```

Start services in separate shells:

```bash
npm start
```

```bash
cd client
npm run dev -- --host 0.0.0.0
```

The frontend runs on `http://localhost:5173`; Vite proxies `/api` to the backend at `http://localhost:3000`.

## Useful Checks

```bash
node --check server.js
node --check routes/slots.js
npm run lint --prefix client
npm run build --prefix client
npm audit --prefix . --audit-level=moderate
npm audit --prefix client --audit-level=moderate
```

Backend service status:

```bash
curl -sS http://localhost:3000/api/status
```

Expected healthy status when all secrets are available:

```json
{"status":"ok","services":{"groq":true,"openai":true,"supabase":true},"fallback":false}
```

## OpenAI Fallback Test

Use this when verifying changes to `server.js` AI provider logic.

1. Ensure backend logs are visible.
2. Use a Groq key state that triggers fallback, such as an invalid key returning `401`, or temporarily start the backend with `GROQ_API_KEY=` while keeping `OPENAI_API_KEY` set.
3. Send a deterministic chat prompt through the UI or API, for example `Jawab singkat: 2+2 berapa?`.
4. Confirm backend logs include:

```text
Groq failed, falling back to OpenAI
```

5. Confirm the response is a real OpenAI answer with `provider: "openai"` and `fallback: false`, not the static fallback reply.

Example API check with a disposable session:

```bash
SESSION_ID="openai_fallback_test_$(date +%s)"
curl -sS -X POST http://localhost:3000/api/chat \
  -H 'Content-Type: application/json' \
  --data "{\"messages\":[{\"role\":\"user\",\"content\":\"Jawab singkat: 2+2 berapa?\"}],\"mode\":\"belajar\",\"session_id\":\"$SESSION_ID\"}"
curl -sS "http://localhost:3000/api/history?session_id=$SESSION_ID"
curl -sS -X DELETE "http://localhost:3000/api/history/clear?session_id=$SESSION_ID"
```

## UI Flow to Record

1. Open `http://localhost:5173`.
2. Click **Mulai Chat Sekarang**.
3. Verify **LACITA AI EDU Chat**, **New Chat**, **Clear Chat**, and the welcome message are visible.
4. Type `Jawab singkat: 2+2 berapa?` in the textbox with placeholder `Ketik pertanyaan Anda...` and click **Kirim**.
5. Verify the response contains `4` and does not show either:
   - `Maaf, layanan AI sedang tidak bisa dihubungi. Saya tetap siap membantu; coba lagi sebentar lagi atau periksa konfigurasi API.`
   - `Maaf, koneksi terputus. Silakan coba lagi.`
6. Refresh the page, click **Mulai Chat Sekarang**, and verify the same user message and AI reply reload from Supabase history.
7. Click **New Chat** and verify only the welcome message remains.

When recording, annotate the precondition, OpenAI fallback response, backend log evidence, Supabase history reload, and New Chat reset.

## Notes

- Refresh returns the React app to the landing page; click **Mulai Chat Sekarang** again before checking loaded chat history.
- The backend saves chat rows with `message`, `user_message`, `ai_reply`, `mode`, and `session_id`; Supabase schemas requiring `message` need that field present.
- If Groq is valid, the primary provider may return `provider: "groq"`; use a controlled Groq failure only when specifically testing OpenAI fallback.
