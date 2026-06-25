# PBL Program Intelligence & Grant Reporting Assistant

This is my submission for the Mantra4Change pre-interview assignment. I built a full-stack application that helps program managers analyze PBL implementation data across schools and automatically generates grant reports for donors.

The challenge was to take raw school survey data (2,000+ rows) and turn it into actionable insights—like figuring out which districts need help, how metrics are trending month-over-month, and assembling grant reports with full traceability to source data.

## Quick Start

```bash
cd code
npm install
npm run dev
```

Then open [http://localhost:3000](http://localhost:3000) in your browser.

**Important:** The app reads CSV files from the parent directory (`../02_Primary_PBL_Data` and `../03_Grant_Reporting_Evidence`), so make sure you keep the `code` folder alongside those data folders.

For production builds:
```bash
npm run build   # creates optimized build
npm start       # runs production server
```

## How It's Built

I organized the code into three clear layers:

```
code/
├── src/
│   ├── app/                  # Pages (Next.js routing)
│   │   ├── page.tsx          # Program Dashboard
│   │   └── grant/page.tsx    # Grant Reporting
│   ├── components/           # React UI components
│   └── lib/                  # Business logic (server-side)
│       ├── data-loader.ts    # Reads & parses CSVs
│       ├── analytics.ts      # Calculates all metrics
│       ├── risk.ts           # Risk classification logic
│       ├── narrative.ts      # Generates grant reports
│       └── review-summary.ts # Monthly review summaries
```

**Tech stack:** Next.js 16 with App Router, TypeScript, React 19, Tailwind CSS. No database yet—CSVs are loaded directly (with caching). For production scale, I'd migrate to PostgreSQL with scheduled imports.

**How data flows:**
1. CSV files get parsed by `data-loader`
2. `analytics` calculates metrics using explicit formulas
3. `risk` classifies everything into On Track/Behind/At Risk/Critical
4. UI displays results with filtering and export options

## Data Structure

The app works with three main data types:

**School Records** (from PBL monthly surveys)  
Each row represents one school's response for one month. Includes basics like school name, district, block, whether they ran PBL that month, if they submitted evidence, enrollment numbers, attendance, etc. I combine three months (July, August, September) into one dataset.

**Grant Data** (for donor reporting)  
- **Finance:** Budget utilization by budget line (approved vs. spent)
- **Performance:** Completion rates, evidence submission, attendance at the grant level
- **Evidence:** Links to photos, news clippings, recognition certificates with metadata

Everything is typed in TypeScript, so I catch data issues early.

## How Metrics Are Calculated

For any filtered set of schools (by month, district, grade, etc.):

**Participation Rate** = Schools that ran PBL ÷ Total schools surveyed  
**Evidence Rate** = Schools that submitted photos/docs ÷ Schools that ran PBL  
**Attendance Rate** = Total student attendance ÷ Total enrollment  
**Month-over-Month Change** = Current month value − Previous month value

For geographic rollups (district/block level), I aggregate schools within each area and calculate the same metrics. The "priority score" ranks areas by how far they are from 100%—basically, the bigger the gaps across all three rates, the higher the priority.

This is all deterministic—no AI, just straightforward math. Every number can be traced back to the source CSV.

## Risk Classification

I used simple, explicit thresholds to classify performance:

- **On Track** (green): ≥ 75% — things are going well
- **Behind** (yellow): 60–74.99% — needs follow-up
- **At Risk** (orange): 35–59.99% — priority intervention
- **Critical** (red): < 35% — immediate action required

These thresholds apply to participation rate, evidence submission rate, and attendance rate. For districts/blocks, I average the three rates to get an overall risk status.

The whole risk engine is just if-else logic—no machine learning involved. You can see exactly why something is marked "At Risk" by looking at the percentage and the threshold.

## Narrative Generation (No AI Required)

The grant reports are generated using templates and structured facts—no LLM calls needed. Here's how it works:

1. I pull all relevant data (performance metrics, budget utilization, evidence links)
2. Build a `sourceFacts` array where every fact has a label and value
3. Fill in narrative templates with those facts
4. Every sentence in the output traces back to a specific CSV field

This means you can audit the report: "Where did that 77.9% come from?" → Look at `sourceFacts` → Find the exact calculation.

I designed it this way because the assignment emphasized deterministic insights and fact traceability. If you want to use an LLM later, the architecture is ready—just pass the `sourceFacts` as context and validate that the AI doesn't make stuff up.

## What I Built

**Core Features (Tier 1 - Required):**
- ✅ Multi-filter dashboard (month, district, block, grade, subject)
- ✅ KPI cards showing participation, evidence, and attendance rates
- ✅ Month-over-month trend indicators (green/red arrows with percentage changes)
- ✅ Geographic performance tables ranked by priority
- ✅ Risk classification with color-coded badges and explanations
- ✅ Grant reporting tool with finance tracking and evidence management
- ✅ Fact-based report generation with full traceability

**Bonus Features (Tier 2):**
- ✅ Monthly review summaries (achievements, risks, priority areas, discussion points)
- ✅ Copy-to-clipboard export for meetings and donor submissions
- ✅ Performance caching to speed up subsequent page loads

## Design Decisions & Assumptions

A few things I decided while building this:

**Data Structure**  
- Each school appears once per month in the PBL CSVs (school code = unique identifier)
- Grade filter looks for "Class 6", "Class 7", "Class 8" in the class field
- Subject filter is case-insensitive substring match (e.g., "Math" matches "Math and Science")

**Calculations**  
- Attendance rate is calculated as: total attendance across all sessions ÷ total enrollment (not average per school)
- Month-over-month deltas are shown as percentage point changes (e.g., 75% → 80% shows as "+5.0 pp")

**Evidence Management**  
- Images might not be included in the submission package (they're large files)
- The app checks if each image file exists and shows availability status
- Metadata (title, caption, filename) is always displayed regardless of image availability

**Data Sources**  
- Grant reports pull from the grant CSVs (authoritative for donor reporting)
- Program review uses PBL school responses (authoritative for implementation tracking)

## Known Limitations

Since this is an assignment prototype, there are some things I didn't build (but could add):

- **No user authentication** — anyone can access the dashboard
- **No database** — CSVs are loaded on each request (though I added caching to help)
- **No PDF export** — you can copy text to clipboard, but not generate PDF directly
- **Images not bundled** — if image files are missing from the package, only metadata is shown
- **Limited testing** — I wrote test files but didn't configure Jest to run them yet

## If This Were Going to Production...

Here's what I'd change to make this production-ready:

**Database Migration**  
Move from CSV files to PostgreSQL. Set up a seed script to import monthly data and add indexes on commonly-filtered fields (month, district, block, school_code). This would handle much larger datasets and enable faster queries.

**Better Caching**  
Right now I cache parsed CSVs in memory for 5 minutes. For production, I'd use Redis with file-watch invalidation so cache stays fresh when new data arrives.

**API Layer**  
Expose REST endpoints like `/api/metrics` and `/api/grant-report` so mobile apps or other tools can consume the data programmatically.

**Authentication**  
Add NextAuth.js for user login. Different roles could see different data (e.g., district coordinators only see their district).

**AI Integration (Optional)**  
If they want LLM-generated narratives, I'd create an API route that sends `sourceFacts` to OpenAI/Anthropic with strict validation to ensure the output doesn't hallucinate.

## What I'd Add Next

If I had more time (or if this becomes a real project):

- **PDF export** — Auto-generate downloadable PDF reports for donor submissions
- **School drill-down** — Click a district/block to see individual school details
- **Upload interface** — Let M&E coordinators upload new monthly CSV files through the UI
- **Recommended actions** — Suggest specific interventions based on risk patterns
- **Real-time AI narratives** — Optional LLM integration with fact validation (see `AI_INTEGRATION.md`)

---

**Note:** All data in this submission is synthetic and created for assessment purposes only.




#   P B L  
 