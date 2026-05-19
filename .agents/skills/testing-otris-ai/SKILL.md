---
name: testing-otris-ai
description: Test the OTRIS AI / LACITA AI EDU React frontend and Express backend flows locally. Use when validating chat UI, session reset, or backend-backed AI chat changes.
---

# Testing OTRIS AI

## Devin Secrets Needed

For full backend-backed chat testing, these secrets must be available in the repo environment or `.env`:

- `GROQ_API_KEY`
- `SUPABASE_URL`
- `SUPABASE_KEY`

If these are missing, the Express backend may fail to start and frontend tests should be scoped to UI behavior that can be verified without live API responses.

## Local setup

From the repo root:

```bash
npm install
(cd client && npm install)
```

There are no pre-commit or Husky hooks currently present.

## Useful checks

```bash
node --check server.js
node --check routes/slots.js
npm run lint --prefix client
npm run build --prefix client
```

Note: the frontend dependency set may require Node `^20.19.0 || ^22.13.0 || >=24` for some lint packages. Older Node 22 builds can emit EBADENGINE warnings even if lint/build still run.

## Running locally

Full stack when secrets are available:

```bash
node server.js
(cd client && npm run dev -- --host 0.0.0.0)
```

Frontend-only fallback when backend secrets are unavailable:

```bash
(cd client && npm run dev -- --host 0.0.0.0)
```

Open `http://localhost:5173/` in Chrome.

## Chat UI reset flow

Use this flow to verify the New Chat/session-reset behavior:

1. On the landing page, click **Mulai Chat Sekarang**.
2. Verify the chat page shows **LACITA AI EDU Chat** and the **New Chat** button.
3. If the backend is unavailable, type a short message such as `tes koneksi` and click **Kirim**.
4. Verify the UI shows the user message plus the red error **Maaf, koneksi terputus. Silakan coba lagi.**
5. Click **New Chat**.
6. Verify the previous user message/error disappear and only the welcome message remains.

This is useful because a broken `handleNewChat` session-state handler may leave the failed-send state visible or crash instead of resetting the chat.
