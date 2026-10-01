# zachGPT

An interactive AI portfolio for **Zachary Edelstein** — Analytics, Business
Intelligence & Data Governance.

The idea is *"talk to my experience."* It works as a conventional portfolio a
recruiter can read in 30–60 seconds, and as a retrieval-grounded assistant they
can interrogate before an interview. The conventional portfolio is fully usable
with the AI layer switched off.

## Design

A Statcast-style read: dark navy chrome over light, data-dense surfaces, with a
saturated categorical palette and monospaced stat readouts. Colour encodes
rather than decorates —

- **Career timeline** bars take their hue from the role's industry, with a legend.
- **Capability matrix** rows are coloured on a diverging coverage scale, the way
  a percentile bar reads: cool for role-specific, hot for capabilities that span
  the whole career. Reading down the matrix, Data Visualization and Stakeholder
  Reporting run 7/7 red, SQL 6/7, Healthcare Analytics cool at 2/7.
- **Technology map** chips take their group's hue; `listed`-tier entries stay
  dashed and grey so they can't be mistaken for documented experience.
- **Work samples** are keyed to their category colour, thumbnails included.

The whole mapping lives in [`lib/theme.ts`](lib/theme.ts), which is what keeps
the three charts from drifting into different palettes.

## Quick start

```bash
npm install
cp .env.example .env.local   # add ANTHROPIC_API_KEY
npm run dev
```

Without an API key the site still runs end to end: every page renders, and the
assistant falls back to retrieval-only answers that show the matching portfolio
evidence instead of fabricating a reply.

| Variable | Required | Purpose |
|---|---|---|
| `ANTHROPIC_API_KEY` | For the assistant | Powers chat and job-description matching. |
| `OWNER_DASHBOARD_PASSWORD` | Before deploying | Protects `/dashboard`. Unset = open (local dev only). |
| `NEXT_PUBLIC_SITE_URL` | For production | Canonical origin for metadata, sitemap and robots. |
| `DATA_DIR` | Optional | Where the analytics JSONL is written. Defaults to `./.data`. |

## Architecture

```
content/        Single source of truth — roles, case studies, skills, samples
   │
   ├──────────► app/          Server-rendered portfolio (static HTML)
   │
   └──────────► lib/kb/       Chunked + metadata-tagged knowledge base
                   │
                   └────────► app/api/chat    retrieval → Claude → NDJSON stream
                              app/api/match   whole KB → structured output
```

The assistant reads the **same objects** the pages render. There is no second
copy of the resume to drift out of sync — fix a fact in `content/` and the page,
the resume, the case studies and the assistant's answers all change together.

### Retrieval

`lib/kb/build.ts` compiles the content modules into ~69 single-topic chunks,
each tagged with company, industry, skills, role ids, case studies,
technologies and capabilities. `lib/kb/retrieve.ts` scores them with BM25 over a
normalized token stream, plus a metadata-match bonus, query-side synonym
expansion and a per-case-study diversity cap. No embedding service, no vector
database, no network call on the retrieval path — the corpus is ~10k tokens, and
lexical retrieval over it is both faster and easier to debug.

```bash
npm run kb:check    # what the retriever selects for a set of probe questions
```

Use that when tuning the synonym table — if the right chunk isn't in the top
few, the assistant won't have it either.

### Conversational visualizations

Asking *"Where has Zach used Tableau?"* highlights the five roles that document
Tableau on the career timeline, lights up the Tableau entry in the technology
map, and opens its evidence rail — while dimming the roles that don't.

The highlight payload is derived **from the retrieved chunks' metadata**, not
from the model's output (`focusFrom()` in `lib/kb/retrieve.ts`). The model can
word an answer however it likes; it cannot make the timeline point at a role the
evidence doesn't support. The payload streams ahead of the first token, so the
charts are already correct while the answer is still being written.

### Grounding

`lib/prompts.ts` holds the rules, and they are strict by design:

- Answer only from supplied evidence; otherwise say *"I don't have enough
  information in Zach's portfolio to answer that accurately."*
- Never invent revenue, percentages, team sizes, outcomes, technologies,
  employers, certifications, responsibilities or client names.
- Every technology carries an evidence tier. `documented` is described as
  experience; `listed` is described as *in the skills inventory with no
  role-level evidence*, with the nearest transferable evidence named instead.
  A Looker question gets an honest answer about Tableau and Power BI.
- Separate evidence from interpretation. No advocacy, no "great fit" claims.
- Cite inline `[S1]` markers; the UI renders them as links into the portfolio.

Every answer expands into an **Evidence** list — the exact sections behind it,
each one a link. That is what makes the assistant a navigation system rather
than a black box.

### Job-description matching

`/api/match` sends the **entire** knowledge base, not a retrieved slice.
"Not documented" is a claim about absence, and absence can't be judged from a
top-k retrieval. Results come back as three buckets — relevant / related /
not documented — via structured outputs, with adjacent tools explicitly barred
from the first bucket.

### Personalised interview pages

`/interview/[company]` renders a curated config from `content/interviews.ts`
(see `/interview/example`). Generate a new one from a real job description:

```bash
npm run interview:new -- path/to/job-description.txt acme-health
```

It prints a config block to review and paste. Pages stay static, so a recruiter
never waits on a model call and nothing unreviewed reaches their screen. An
unknown slug falls back to the portfolio's strongest documented evidence rather
than 404-ing or inventing role-specific claims.

## Analytics

The analytics portfolio is instrumented as an analytics product. `/dashboard`
shows sessions, an engagement funnel, questions asked, and which case studies,
technologies and work samples get opened.

What is **not** collected: IP addresses, user-agent strings, names, emails, or
any cross-session identifier. The session id is generated in the visitor's own
tab, stored in `sessionStorage`, discarded when the tab closes, and hashed again
server-side. Stored events are `{timestamp, event name, hashed session id,
coarse device class, short label}` and nothing else.

Events land in `.data/events.jsonl` (gitignored). On an ephemeral serverless
filesystem those writes won't persist — point `DATA_DIR` at a mounted volume, or
replace `lib/analytics/store.ts`, which is the only module that touches storage.

## Performance & accessibility

- Every portfolio route is static HTML (`○`/`●` in the build output). The
  dynamic routes are the three API endpoints and the private dashboard.
- No webfonts, no icon library, no chart library, no CDN requests. Charts are
  CSS and inline SVG; the case-study diagrams and sample thumbnails ship zero
  client JavaScript.
- Keyboard navigable with a visible focus ring, a skip link, real `<table>`
  semantics for the matrix, `prefers-reduced-motion` honoured, and
  `scroll-padding` so anchors don't land under the sticky header.
- JSON-LD `Person`, sitemap and robots. Interview pages and the dashboard are
  `noindex`.

## Before you deploy

Read **[`content/REVIEW.md`](content/REVIEW.md)**. Several earlier-role employer
names and dates are placeholders that need your confirmation — they render as
"Employer to confirm" rather than as invented employers, and the file lists
each one.

Then set `OWNER_DASHBOARD_PASSWORD` and `NEXT_PUBLIC_SITE_URL`.

## Scripts

| Command | What it does |
|---|---|
| `npm run dev` | Development server |
| `npm run build` / `npm start` | Production build and serve |
| `npm run typecheck` | `tsc --noEmit` |
| `npm run kb:check` | Retrieval smoke test over probe questions |
| `npm run interview:new -- <file> [slug]` | Draft an interview page from a job description |
