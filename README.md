# AI ResumeCraft

A full-stack AI-powered resume builder. Users fill structured forms, see a live preview, tweak design settings, and use a Gemini-backed AI assistant to generate professional summaries, enhance experience bullets, suggest skills, extract ATS keywords, score their resume, and write cover letters. Resumes are persisted in MongoDB and auto-saved on every change, with a localStorage fallback when the backend is unreachable.

---

## Features

### Resume Editor
- **10 editable sections** — Personal Info, Summary, Experience, Education, Skills, Projects, Certifications, Languages, References, and Design Settings
- **Drag-and-drop reordering** inside each list section (Experience, Education, Skills, etc.) via Framer Motion's `Reorder` API
- **Per-item duplication and deletion** for every list-based section
- **Live preview** that re-renders instantly on every keystroke — visible as a split-pane on desktop and as a slide-up drawer on mobile
- **Zoomable preview** (60% – 140%) on the desktop layout

### Templates & Design
- **8 selectable resume templates**: Modern, Minimal, Executive, Creative, Corporate, Developer, Elegant, Classic
  - `modern` — header band with two-column bottom grid
  - `minimal` — centered header, sparse whitespace
  - `executive` — dark navy sidebar layout
  - `creative`, `corporate`, `developer` — coloured sidebar layout using the chosen accent
  - `elegant`, `classic` — fall back to the Modern layout renderer
- **6 preset accent colors** — swappable independently of template
- **4 font choices** — Inter, Georgia, Arial, Times New Roman

### AI Assistant (Gemini-powered)
Six tabs, each making a real API call to the Express backend which calls Google Gemini:

| Tab | What it does |
|---|---|
| **Summary** | Generates a 2–3 sentence professional summary from title, experience, and skills |
| **Enhancer** | Rewrites the first experience entry's bullets with strong action verbs and quantified metrics |
| **Skills** | Suggests 8 new skills relevant to the current job title, excluding already-listed skills |
| **ATS Score** | Scores the resume 0–100 with a weighted rubric and returns up to 4 actionable improvement tips |
| **Keywords** | Extracts 8–12 ATS-optimised keywords from title, summary, and experience |
| **Cover Letter** | Generates a structured 3-paragraph cover letter (≤ 200 words) |

Results can be **applied directly to the resume**, copied to clipboard, or regenerated. The Summary, Enhancer, and Skills tabs write results back into resume state; Keywords adds suggestions to the skills list.

### Export / Download
- **PDF export** — clones the rendered `#resume-doc` element into a clean print container (no transforms, no scaling artefacts), then calls `window.print()`. Works for both "PDF Document" and "Print Version" options.
- Progress animation shown during the export preparation delay

### Persistence
- **MongoDB auto-save** — on first visit a resume is created in MongoDB. Every subsequent change triggers a debounced PUT 600 ms after the last keystroke.
- **localStorage fallback** — the full resume JSON is also written to `localStorage` on every save, so the app works even when the backend is offline.
- **Anonymous ownership** — a UUID (`ownerId`) is generated with `crypto.randomUUID()` and stored in localStorage. All resumes are tied to this ID.

### Security (Backend)
- `helmet` sets secure HTTP headers
- `express-mongo-sanitize` strips `$` operators from request bodies to prevent NoSQL injection
- `express-rate-limit` — global limit: **200 req / 15 min**; AI endpoints: **30 req / 15 min**
- JSON body size capped at **10 kb**
- CORS locked to the configured `FRONTEND_URL`
- Error handler masks internal stack traces in production

---

## Tech Stack

| Layer | Technology |
|---|---|
| **Frontend framework** | React 19, Vite 8, plain JavaScript (ES Modules) |
| **Styling** | Tailwind CSS v4 (via `@tailwindcss/vite` plugin) |
| **Animations** | Framer Motion |
| **Icons** | Lucide React |
| **HTTP client** | Axios (30 s timeout, error normalisation interceptor) |
| **Backend framework** | Express.js (Node >= 18) |
| **Database** | MongoDB via Mongoose 8 |
| **AI** | Google Gemini (`gemini-2.0-flash` by default) via `@google/generative-ai` |
| **Security** | Helmet, express-mongo-sanitize, express-rate-limit |

---

## Architecture

```
Browser (React + Vite)
|
|  /api/*  ──────────────>  Vite dev proxy  ──>  Express (port 5000)
|                                                  |
|  localStorage cache <──────────────────────────  |
|  (fallback when API unavailable)                 ├─ /api/resumes  ──>  MongoDB
|                                                  └─ /api/ai       ──>  Google Gemini API
```

In development the Vite dev server proxies all `/api` requests to `localhost:5000`, so the browser never makes cross-origin requests.

---

## Folder Structure

```
Resume-builder-main/
├── index.html
├── vite.config.js            # Vite config — React plugin, Tailwind plugin, /api proxy
├── eslint.config.js          # ESLint config — js/jsx only, react-hooks + react-refresh
├── package.json              # Frontend deps (React, Framer Motion, Axios, etc.)
├── src/
│   ├── App.jsx               # Root — mounts ResumeProvider, switches Home <-> Builder
│   ├── Data.js               # Static data: SAMPLE_RESUME, TEMPLATES, SECTION_LIST, FONT_OPTIONS, etc.
│   ├── main.jsx
│   ├── index.css
│   ├── context/
│   │   └── ResumeContext.jsx # Global state, auto-save effect, MongoDB sync
│   ├── pages/
│   │   ├── Home.jsx          # Landing page (assembles all landing sections)
│   │   └── Builder.jsx       # Main editor page
│   ├── components/
│   │   ├── ai/
│   │   │   └── AIAssistant.jsx   # Modal with 6 AI tabs
│   │   ├── builder/
│   │   │   ├── FormSections.jsx  # All 10 section forms + settings panel
│   │   │   ├── Sidebar.jsx       # Section navigation
│   │   │   ├── DownloadMenu.jsx  # PDF / Print export menu
│   │   │   └── Fields.jsx        # Field + TextArea primitives
│   │   ├── resume/
│   │   │   └── ResumePreview.jsx # Template renderers (Modern, Minimal, Sidebar variants)
│   │   ├── landing/
│   │   │   ├── Navbar.jsx
│   │   │   ├── Hero.jsx
│   │   │   ├── AIShowcase.jsx
│   │   │   └── Sections.jsx      # Companies, Features, Templates, Workflow, Benefits, Testimonials, Pricing, FAQ, CTA, Footer
│   │   └── ui/
│   │       └── primitives.jsx    # Button component
│   ├── services/
│   │   └── api.js            # Axios instance with /api base URL and error interceptor
│   └── utils/
│       ├── printResume.js    # DOM-clone print helper
│       ├── ai.js             # Local AI stubs (not used by the AIAssistant modal)
│       └── cn.js             # clsx + tailwind-merge helper
│
└── backend/
    ├── package.json          # Backend deps (Express, Mongoose, Gemini SDK, Helmet, etc.)
    ├── .env.example
    └── src/
        ├── server.js         # App entry — middleware, routes, error handler
        ├── config/
        │   └── db.js         # Mongoose connect
        ├── routes/
        │   ├── resume.routes.js
        │   └── ai.routes.js
        ├── controllers/
        │   ├── resume.controller.js
        │   └── ai.controller.js
        ├── models/
        │   └── Resume.model.js
        ├── services/
        │   └── GeminiService.js  # All six Gemini methods + retry logic
        ├── middlewares/
        │   ├── rateLimiter.js
        │   └── errorHandler.js
        └── utils/
            ├── AppError.js
            └── asyncHandler.js
```

---

## Installation

### Prerequisites
- Node.js >= 18
- A MongoDB connection string (local or Atlas)
- A Google Gemini API key from [AI Studio](https://aistudio.google.com/app/apikey)

### Backend

```bash
cd backend
npm install
cp .env.example .env
# Edit .env — add MONGODB_URI, GEMINI_API_KEY, FRONTEND_URL
```

### Frontend

```bash
# From the project root
npm install
```

---

## Running the Project

### Backend

```bash
cd backend
npm run dev          # node --watch src/server.js  (auto-restarts on save)
# or
npm start            # node src/server.js
```

The backend starts on `http://localhost:5000` by default.

### Frontend

```bash
# From the project root
npm run dev          # vite dev server → http://localhost:5173
```

Vite automatically proxies `/api/*` to `localhost:5000`, so no CORS configuration is needed in development.

---

## Environment Variables

All variables live in `backend/.env`. See `backend/.env.example` for the template.

| Variable | Required | Description |
|---|---|---|
| `NODE_ENV` | No | `development` (default) or `production`. Controls error detail in API responses. |
| `PORT` | No | Port for the Express server. Defaults to `5000`. |
| `MONGODB_URI` | Yes | Full MongoDB connection string, e.g. an Atlas `mongodb+srv://…` URI. |
| `GEMINI_API_KEY` | Yes | Google Gemini API key. Throws at startup if missing. |
| `GEMINI_MODEL` | No | Gemini model name. Defaults to `gemini-2.0-flash`. |
| `FRONTEND_URL` | No | Allowed CORS origin. Defaults to `http://localhost:5173`. |

There are no frontend `.env` variables required for development. The frontend's API base URL (`VITE_API_BASE_URL`) falls back to `/api`, which is handled by the Vite proxy.

---

## API Endpoints

### Resume CRUD

| Method | Path | Description |
|---|---|---|
| `GET` | `/api/resumes?ownerId=<uuid>` | List all resumes for an owner, sorted newest first |
| `POST` | `/api/resumes` | Create a new resume. Body must include `ownerId`. |
| `GET` | `/api/resumes/:id` | Fetch a single resume by MongoDB `_id` |
| `PUT` | `/api/resumes/:id` | Full update — used by the auto-save debounce |
| `DELETE` | `/api/resumes/:id` | Delete a resume |
| `POST` | `/api/resumes/:id/duplicate` | Clone a resume; appends `" (Copy)"` to the title |

### AI (all `POST`, rate-limited to 30 req / 15 min)

| Method | Path | Request body | Response `result` type |
|---|---|---|---|
| `POST` | `/api/ai/summary` | `{ title, experience[], skills[] }` | `string` |
| `POST` | `/api/ai/enhance` | `{ bullets, role, company }` | `string` (newline-separated bullets) |
| `POST` | `/api/ai/skills` | `{ title, currentSkills[] }` | `string[]` (8 items) |
| `POST` | `/api/ai/keywords` | `{ title, summary, experience[] }` | `string[]` (8–12 items) |
| `POST` | `/api/ai/cover-letter` | `{ name, title, company }` | `string` |
| `POST` | `/api/ai/ats-score` | `{ resume }` | `{ score: number, tips: string[] }` |

### Health

| Method | Path | Description |
|---|---|---|
| `GET` | `/api/health` | Returns `{ success: true, status: "ok", timestamp }` |

All endpoints return `{ success: true, data/result: … }` on success and `{ success: false, message: … }` on error.

---

## AI Features

All AI features call Google Gemini with `responseMimeType: "application/json"` to force valid JSON output. The service uses exponential backoff retries (1 s → 2 s → 4 s) on HTTP 429 and 503 errors.

### Professional Summary (`/api/ai/summary`)
Sends the user's job title, experience entries, and skill names to Gemini. Returns a 2–3 sentence summary of <= 60 words, starting with the title or years of experience and ending with an employer value proposition. The result is written directly into the `summary` field when the user clicks **Apply to resume**.

### Bullet Enhancer (`/api/ai/enhance`)
Sends the bullets, role, and company from the **first experience entry**. Returns 3–5 rewritten bullets, each starting with a strong action verb and including quantified metrics. Applied back to `experience[0].bullets`.

### Skill Suggestions (`/api/ai/skills`)
Sends the job title and current skill names. Returns exactly 8 new skills, ordered by in-demand relevance, excluding any the user already has. Clicking **Apply to resume** appends new skills to the skills list (deduplicated by lowercase name).

### ATS Score (`/api/ai/ats-score`)
Sends a structured snapshot of the resume (presence of fields, counts, metrics flag) — not the raw text. Gemini scores 0–100 using a weighted rubric:

| Criterion | Points |
|---|---|
| Professional summary (80+ chars) | 12 |
| Work experience (2+ entries) | 16 |
| Quantified achievements (numbers in bullets) | 12 |
| Skills (6+ listed) | 12 |
| Education (1+ entry) | 8 |
| Projects (1+ entry) | 8 |
| Complete contact info (email + phone + location) | 10 |
| LinkedIn profile | 6 |
| Website/portfolio | 4 |
| Certifications | 6 |
| Languages section | 3 |
| Multiple bullets per job (3+) | 3 |

Returns `{ score, tips[] }` — up to 4 specific, actionable tips for areas where points were lost. Displayed as an animated circular gauge in the UI.

### ATS Keywords (`/api/ai/keywords`)
Sends title, summary, and truncated experience bullets. Returns 8–12 keywords (technical skills, tools, methodologies, industry terms) optimised to help the resume pass ATS filters. Clicking **Add to skills** appends them to the skills list.

### Cover Letter (`/api/ai/cover-letter`)
Sends the applicant's name, job title, and target company. Returns a <= 200-word, 3-paragraph cover letter with a salutation and sign-off. Result is displayed as copyable text; there is no direct-apply action for this tab.

---

## Database Design

One collection: **resumes**.

### Resume Document

```
{
  _id:       ObjectId (MongoDB auto-generated)
  ownerId:   String   (required, indexed) — browser-generated UUID
  title:     String   (default: "My Resume", maxlength: 100)
  template:  String   (default: "modern")
  accent:    String   (default: "#4F46E5")
  font:      String   (default: "Inter")

  personal: {
    fullName, title, email, phone, location, website, linkedin
  }

  summary:        String
  experience:     [{ id, role, company, location, start, end, bullets }]
  education:      [{ id, degree, school, location, start, end, detail }]
  skills:         [{ id, name }]
  projects:       [{ id, name, link, desc }]
  certifications: [{ id, name, issuer, year }]
  languages:      [{ id, name, level }]
  references:     [{ id, name, relation, contact }]

  createdAt: Date (auto)
  updatedAt: Date (auto)
}
```

**Indexes:**
- `{ ownerId: 1 }` — for fast per-user lookups
- `{ ownerId: 1, updatedAt: -1 }` (compound) — for listing resumes newest-first per user

`ownerId` stores a UUID string for anonymous users. The schema comment notes this field is intentionally string-typed to accommodate a real User `ObjectId` (as string) if authentication is added later without a schema migration.

---

## Screenshots

> _Screenshots will be added here once the UI is captured._

| Page | Description |
|---|---|
| Landing | Hero section with CTA, features grid, template showcase |
| Builder | Split-pane editor (forms left, live preview right) |
| AI Assistant | Modal with 6 AI tabs, animated loading state, result display |
| ATS Score | Circular gauge with score and improvement tips |
| Download Menu | PDF / Print dropdown with progress animation |

---

## Future Improvements

The following capabilities are **not yet implemented** in this codebase:

- **User authentication** — currently all resumes use an anonymous browser-generated UUID. No login, session, or JWT system exists.
- **Resume dashboard** — no multi-resume management UI. Only the most recently updated resume is loaded on each visit.
- **Job Description matching** — `GeminiService.jdMatch()` is implemented in the service layer but not exposed via a route or connected to any UI.
- **Full resume rewrite** — `GeminiService.rewriteResume()` is implemented in the service layer but not exposed via a route or connected to any UI.
- **Drag-and-drop section reordering** — sections themselves (Personal, Experience, etc.) have a fixed order in the sidebar; only items *within* a section can be reordered.
- **Payment / subscription system** — the landing page shows pricing tiers (Free / Pro / Premium) as static marketing copy; no billing or feature gating is implemented.
- **Resume import** — the workflow section mentions importing an existing resume; this feature does not exist.
- **True PDF generation** — export currently clones the DOM and calls `window.print()`; `html2canvas` and `jspdf` are installed as dependencies but are not used.

---

## License

This project does not currently include a license file. All rights are reserved by the author unless a license is added.

---

## Changelog

### TypeScript → JavaScript migration

The frontend was originally scaffolded with the Vite React-TS template. All TypeScript tooling has been removed; the project now runs as a standard JavaScript MERN application.

**Removed**
- `vite.config.ts` → replaced with `vite.config.js`
- `tsconfig.json`, `tsconfig.app.json`, `tsconfig.node.json` — deleted
- `typescript`, `typescript-eslint`, `@types/node`, `@types/react`, `@types/react-dom` — uninstalled

**Updated**
- `package.json` — build script changed from `tsc -b && vite build` to `vite build`
- `eslint.config.js` — removed `typescript-eslint`; file glob changed from `**/*.{ts,tsx}` to `**/*.{js,jsx}`

No source files were renamed or modified — all `.jsx` / `.js` source files were already plain JavaScript.

---

## Author

Built by **Chetan Kumar**.
