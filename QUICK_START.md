# Quick Start Guide

## Installation

```bash
cd code
npm install
```

## Development

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

## Production Build

```bash
npm run build
npm start
```

## Project Structure

```
code/
├── src/
│   ├── app/
│   │   ├── page.tsx              # Program Dashboard (/)
│   │   └── grant/page.tsx        # Grant Reports (/grant)
│   ├── components/               # React UI components
│   │   ├── ProgramDashboard.tsx  # Main dashboard with filters
│   │   ├── KpiCard.tsx           # Metric display cards
│   │   ├── GeoPerformanceTable.tsx
│   │   └── GrantReportAssistant.tsx
│   └── lib/                      # Business logic (server-side)
│       ├── data-loader.ts        # CSV parsing
│       ├── analytics.ts          # Metrics & filtering
│       ├── risk.ts               # Risk classification
│       ├── narrative.ts          # Grant report generation
│       ├── review-summary.ts     # Monthly summaries
│       ├── cache.ts              # In-memory caching
│       └── types.ts              # TypeScript types
├── .env                          # Environment config
└── public/                       # Static assets
```

## Key Features

### 1. Program Review Dashboard (/)

**Filters:**
- Reporting month (July, August, September 2025)
- District (All or specific)
- Block (All or specific)
- Grade (All, 6, 7, 8)
- Subject (All, Math, Science)

**KPIs Displayed:**
- Participation rate (% schools conducting PBL)
- Evidence submission rate
- Attendance rate
- Month-over-month deltas
- Risk status badges

**Geographic Tables:**
- District performance (top 5 priority + top 3 performers)
- Block performance (top 5 priority + top 3 performers)

**Monthly Review:**
- Achievements summary
- MoM changes
- Risk explanations
- Priority geographies for follow-up
- Discussion points
- Copy to clipboard

### 2. Grant Reporting Assistant (/grant)

**Selections:**
- Grant (dropdown)
- Reporting month

**Panels:**
- **Fact Panel:** All computed metrics with sources
- **Finance:** Budget lines with utilization rates
- **Evidence:** Linked media with thumbnails
- **Report Preview:** Generated narrative with citations

**Actions:**
- Copy report text
- Copy deterministic summary

## Risk Classification

| Status | Threshold | Color | Action |
|--------|-----------|-------|--------|
| On Track | ≥ 75% | Green | Monitor |
| Behind | 60-74.99% | Yellow | Follow-up recommended |
| At Risk | 35-59.99% | Orange | Priority intervention |
| Critical | < 35% | Red | Immediate action |

## Data Files

Located in parent directory:

```
../02_Primary_PBL_Data/csv_exports/
  ├── PBL_School_Response_Data_July_2025.csv
  ├── PBL_School_Response_Data_August_2025.csv
  └── PBL_School_Response_Data_September_2025.csv

../03_Grant_Reporting_Evidence/
  ├── csv/
  │   ├── 01_Grant_Profile_and_Finance.csv
  │   ├── 02_Grant_Performance_and_Report_Material.csv
  │   └── 03_Evidence_and_Media_Index.csv
  └── images/
      ├── student_project_activity_photo_*.png
      └── synthetic_*.png
```

## Troubleshooting

### "Cannot find module" errors
```bash
npm install
npm run build
```

### Data not loading
- Verify CSV files exist in `../02_Primary_PBL_Data` and `../03_Grant_Reporting_Evidence`
- Check file paths in `src/lib/paths.ts`
- Review console for error messages

### Build fails
```bash
rm -rf node_modules .next
npm install
npm run build
```

### Port 3000 already in use
```bash
# Kill process on port 3000
npx kill-port 3000

# Or use different port
PORT=3001 npm run dev
```

## Testing

Unit tests are located in `src/lib/__tests__/`:

```bash
# Setup Jest (one-time)
npm install --save-dev jest @testing-library/react @testing-library/jest-dom

# Run tests
npm test
```

## Environment Variables

Create `.env` file (see `.env.example`):

```bash
# Data paths
DATA_DIR_PBL=../02_Primary_PBL_Data/csv_exports
DATA_DIR_GRANT=../03_Grant_Reporting_Evidence

# Cache TTL in minutes
CACHE_TTL_MINUTES=5

# Feature flags
ENABLE_AI_NARRATIVE=false
```

## Deployment

### Vercel (Recommended)

```bash
# Install Vercel CLI
npm install -g vercel

# Deploy
cd code
vercel
```

**Important:** Upload CSV files to Vercel's file system or use a database.

### Docker

```dockerfile
FROM node:20-alpine
WORKDIR /app
COPY package*.json ./
RUN npm ci --production
COPY . .
RUN npm run build
EXPOSE 3000
CMD ["npm", "start"]
```

Build and run:
```bash
docker build -t pbl-dashboard .
docker run -p 3000:3000 -v $(pwd)/../02_Primary_PBL_Data:/data/pbl pbl-dashboard
```

## Performance Tips

1. **First load takes ~200ms** (CSV parsing)
2. **Subsequent loads < 5ms** (cached)
3. **Cache expires after 5 minutes** (configurable in `.env`)
4. **Static pages pre-rendered** at build time

To clear cache manually:
```typescript
import { dataCache } from '@/lib/cache';
dataCache.clear();
```

## Common Tasks

### Add a new month of data

1. Add CSV file to `../02_Primary_PBL_Data/csv_exports/`
2. Update `ReportingMonth` type in `src/lib/types.ts`
3. Update `MONTHS` array in `src/lib/analytics.ts`
4. Update `DATA_PATHS` in `src/lib/paths.ts`

### Change risk thresholds

Edit `src/lib/risk.ts`:

```typescript
export const RISK_THRESHOLDS = {
  onTrack: 0.80,    // Change from 0.75
  behind: 0.65,     // Change from 0.60
  atRisk: 0.40,     // Change from 0.35
} as const;
```

### Add a new filter

1. Add to `ProgramFilters` type in `src/lib/types.ts`
2. Update `applyFilters()` in `src/lib/analytics.ts`
3. Add UI control in `components/ProgramFiltersBar.tsx`

## Support

For questions or issues:
1. Check `README.md` for architecture details
2. Review `IMPLEMENTATION_SUMMARY.md` for design decisions
3. See `AI_INTEGRATION.md` for LLM integration guide
4. Check Next.js docs: https://nextjs.org/docs

## License

MIT (assignment code, synthetic data for assessment use only)
