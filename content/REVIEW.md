# Content review

Everything the site renders, and everything the portfolio assistant is allowed
to say, comes from the files in this folder. There is no second copy of the
resume for the AI layer, so correcting a fact here corrects it everywhere:
the page, the resume, the case studies and the assistant's answers.

## Source

`content/roles.ts` is compiled from nine resume PDFs (eight distinct — two were
byte-identical) plus the SeatGeek cover letter. Companies, titles and date
ranges are verbatim. Responsibilities are a de-duplicated synthesis across the
role-targeted versions of each resume, since each one emphasises different
work in the same job.

**All earlier placeholders are now resolved.** Two inferences in the first
build were wrong and have been corrected:

| Was | Actually |
|---|---|
| Universal Health Services — Analytics Manager, 2020–2021 | **Analytics Lead, Aug 2018 – Aug 2020** |
| Stella Rising — Data Analytics Manager, 2017–2019 | **Analytics Manager, Aug 2020 – Dec 2021** |
| "Data Analytics Manager" at an unknown employer | **Majux Marketing**, Dec 2016 – Aug 2018 |
| "Technical SEO Analyst" at an unknown employer | **Gen3 Marketing**, Dec 2015 – Dec 2016 |
| "Independent" consultancy | **Stratega** |
| Ziff Davis — Director, Analytics & Insights | **Director, Insights & Analytics** |

## 1. The one date still worth confirming

The resumes end the Stratega engagement at **Feb 2025** (one version says
"Present"). The original brief said the Publicis role begins **June 2025**, so
`content/roles.ts` currently runs Stratega to June 2025 to keep the timeline
continuous. If there was a genuine gap, change `dates` and `end` on the
`stratega` role.

The Publicis Groupe role is the only entry **not** sourced from these PDFs —
it came from the project brief. Worth a read-through.

## 2. Figures

`metrics` on each role, and `numbers` in `content/profile.ts`, contain only
figures stated on your own resumes:

- Nine-figure M&A evaluations; $10M+ marketing spend influenced (Ziff Davis)
- 350+ acute and behavioral health facilities (UHS)
- 30% faster analytics turnaround; 20% increase in qualified leads (Stratega)
- 18% landing page conversion lift; 15% conversion increase (Stella Rising)
- 1 manager + 2 analysts (Publicis)

The grounding rules instruct the assistant to quote these exactly and never
extrapolate from them, and still forbid producing any figure that is not here.
The 18% and 15% Stella Rising figures come from different role-targeted
resumes; if they describe the same piece of work, consider keeping one.

## 3. Evidence tiers

In `content/skills.ts` each technology is `documented` (tied to specific roles)
or `listed` (named in a skills inventory with no role-level detail). The
assistant describes the second kind as listed, not demonstrated.

The new resumes promoted most of what used to be `listed` — Looker Studio,
Python and Adobe Analytics all now have role evidence. Still `listed`:
**R** (noted as basic), **TensorFlow**, **NLP**.

## 4. What is deliberately not published

Your resumes carry a street address and phone number. Neither is in this
repository or on the site — contact is the email address and "Brooklyn, NY"
only. Add them to `content/profile.ts` if you want them public, bearing in mind
the repo is public.

Named clients **are** published (Exelon, University of Phoenix), because you
name them on your own resume. Remove them from the `executive-bi-consulting`
case study if that was for a targeted application rather than general use.

## 5. Work samples

Every item in `content/work-samples.ts` is a recreation built with sample data
and is labelled as such in the UI. If you add one, keep that true.
