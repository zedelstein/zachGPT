# Content review — read this before the site goes live

Everything the site renders, and everything the portfolio assistant is allowed
to say, comes from the files in this folder. There is no second copy of the
resume for the AI layer, so correcting a fact here corrects it everywhere:
the page, the resume, the case studies and the assistant's answers.

## 1. Placeholders that need your confirmation

The brief supplied the title progression and two employer names, but not a
complete company-and-date history for the earlier roles. Rather than invent
employers or dates, those fields are marked and rendered as "Employer to
confirm" on the site.

In `content/roles.ts`:

| Role id | What needs confirming | Flag |
|---|---|---|
| `analytics-lead` | Employer name and exact dates (currently 2019–2020) | `companyNeedsReview`, `datesNeedReview` |
| `seo-analyst` | Employer name and exact dates (currently 2015–2017) | `companyNeedsReview`, `datesNeedReview` |
| `stella-rising` | Exact dates (currently 2017–2019) | `datesNeedReview` |
| `uhs` | Exact dates (currently 2020–2021) and whether "Analytics Manager" is the correct title | `datesNeedReview` |

To fix one: replace the `company` string and delete the `companyNeedsReview`
flag; replace `dates` plus the numeric `start` / `end` and delete
`datesNeedReview`. The numeric fields are decimal years — June 2025 is `2025.42`
— and position the bars on the career timeline.

## 2. The capability matrix for earlier roles

`capabilities` on each role in `content/roles.ts` drives the capability × role
matrix, and for the four most recent roles it is taken directly from the
documented case studies. For the three earliest roles it was inferred from the
role descriptions you supplied. Worth a read-through — adding or removing one
id changes the matrix, the retrieval metadata and the assistant's answers
together.

## 3. Evidence tiers

In `content/skills.ts` each technology carries a tier:

- `documented` — tied to specific roles; the assistant describes it as experience.
- `listed` — in the skills inventory with no role-level evidence; the assistant
  says so explicitly and points at the nearest transferable evidence instead.

Currently `listed`: **Looker / Looker Studio**, **Python**, **R**,
**Adobe Analytics**. If you have real project evidence for any of them, move the
tier to `documented` and add the `roleIds`. This distinction is doing real work
— it is what stops the assistant claiming Looker experience you don't have.

## 4. Figures

`numbers` in `content/profile.ts` contains only figures the brief substantiated.
There are deliberately no percentage improvements, efficiency gains or revenue
figures anywhere on the site, and the system prompt forbids the assistant from
producing one. If you later have defensible metrics, add them here and they will
flow into the assistant's evidence automatically.

## 5. Work samples

Every item in `content/work-samples.ts` is a recreation built with sample data
and is labelled as such in the UI. Nothing in them is drawn from a real client
deliverable. If you add a sample, keep that true.
