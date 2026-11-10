# CodePath

CodePath is a vanilla HTML, CSS, and JavaScript learning platform for practical Python education.

## Run locally

Install the project dependencies, then start Vite:

```bash
npm install
npm run dev
```

Open the local URL printed by Vite. CodeMirror is bundled from npm. On the first Python run, the dedicated worker downloads the pinned Pyodide runtime from jsDelivr, so the browser needs network access to `cdn.jsdelivr.net` until those runtime assets are cached.

## Quality checks

```bash
npm run check
npm run build
```

## Python workspace

Each lesson workspace starts from that lesson's first Python example and saves edits in browser `localStorage` under the lesson ID. Python executes in a module Web Worker through Pyodide. The UI enforces a five-second execution limit by terminating the worker; the next run starts a fresh interpreter. Browser worker execution keeps Python off the page thread, but it is not a security boundary.

## AI Python Tutor

The chapter learning flow includes Tutor, Debug, and Challenge modes. The tutor receives the current chapter, stage, learning objectives, recent answers, current task, editor draft, latest Pyodide output, and test results. Chat history is saved locally per chapter. Student code is sent to the configured server-side Gemini provider when a request is submitted.

To enable real replies locally, copy `.env.example` to `.env`, set `GEMINI_API_KEY` to a Gemini API key, and restart `npm run dev`. The key stays in the server process and must never use a `VITE_` prefix. `AI_PROVIDER` selects the provider adapter (currently `gemini`); `GEMINI_MODEL` selects a model available to the project, defaulting to `gemini-3.5-flash-lite`. Vite provides the local `/api/tutor` route, while `api/tutor.js` exposes the same handler for Vercel deployments. Configure the environment variables in the host's server-side settings in production. Without a key, the tutor reports that it is unconfigured; it does not return sample or canned replies.

The endpoint validates request size and shape, trims context, limits output, sets a per-process limit of 18 requests per IP per hour, and never returns the provider key. The in-memory rate limit is suitable for development and a single small instance; use a shared rate-limit store before scaling across multiple serverless instances. Gemini availability and account quotas depend on the configured model and Google account; no unlimited or free quota is guaranteed. Chapter progress, editor drafts, and chat history currently remain in browser localStorage.
