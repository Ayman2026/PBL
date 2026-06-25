# 🎓 PBL Program Intelligence & Grant Reporting Assistant

[![Next.js](https://img.shields.io/badge/Next.js-16.2.9-black?logo=next.js)](https://nextjs.org/)
[![React](https://img.shields.io/badge/React-19.2.4-blue?logo=react)](https://reactjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.9.3-blue?logo=typescript)](https://www.typescriptlang.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-4.3.1-38bdf8?logo=tailwind-css)](https://tailwindcss.com/)

> A full-stack application for analyzing PBL implementation data and automatically generating grant reports with complete traceability.

**Live Demo:** [Add your Vercel URL here]

---

## 🚀 Features

### Program Dashboard
- **Multi-Filter Analytics** - Filter by month, district, block, grade, and subject
- **Real-Time KPIs** - Participation rate, evidence submission, attendance tracking
- **Trend Analysis** - Month-over-month changes with visual indicators
- **Geographic Performance** - Priority-ranked tables by district and block
- **Risk Classification** - Color-coded badges (On Track, Behind, At Risk, Critical)

### Grant Reporting
- **Automated Report Generation** - Fact-based narratives with full traceability
- **Budget Tracking** - Utilization by budget line with visual progress bars
- **Evidence Management** - Photos, news clips, and recognition certificates
- **Monthly Reviews** - Achievements, risks, and action items
- **Export Ready** - Copy-to-clipboard for donor submissions

---

## 🛠️ Tech Stack

- **Framework:** Next.js 16 with App Router
- **UI:** React 19, TypeScript, Tailwind CSS
- **Data Processing:** Papa Parse (CSV parsing)
- **Deployment:** Vercel-ready with Docker support
- **Performance:** In-memory caching, server-side rendering

---

## 📦 Installation

```bash
# Clone the repository
git clone https://github.com/Ayman2026/PBL.git
cd PBL

# Install dependencies
npm install

# Run development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## 🚀 Deployment

### Deploy to Vercel (Recommended)

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/Ayman2026/PBL)

1. Click the button above or go to [vercel.com](https://vercel.com)
2. Import this repository
3. Add environment variables (see below)
4. Deploy!

### Environment Variables

```env
DATA_DIR_PBL=public/data/02_Primary_PBL_Data/csv_exports
DATA_DIR_GRANT=public/data/03_Grant_Reporting_Evidence
CACHE_TTL_MINUTES=5
ENABLE_AI_NARRATIVE=false
```

### Docker Deployment

```bash
# Build image
docker build -t pbl-dashboard .

# Run container
docker run -p 3000:3000 pbl-dashboard
```

See [DEPLOYMENT_GUIDE.md](DEPLOYMENT_GUIDE.md) for detailed instructions.

---

## 📊 Data Structure

The application works with two main datasets:

### PBL School Response Data
- Monthly survey responses from schools
- Tracks participation, evidence submission, attendance
- Fields: School code, district, block, grade, subject, enrollment, etc.

### Grant Reporting Data
- **Finance:** Budget utilization by line item
- **Performance:** Completion rates and evidence tracking
- **Evidence Index:** Photos, news clips, recognition certificates

All data files are in `public/data/` directory.

---

## 🎯 Key Metrics

### Calculated Metrics
- **Participation Rate** = Schools running PBL ÷ Total schools
- **Evidence Rate** = Schools submitting evidence ÷ Schools running PBL
- **Attendance Rate** = Total attendance ÷ Total enrollment
- **Month-over-Month Change** = Current - Previous (percentage points)

### Risk Classification
- 🟢 **On Track:** ≥75%
- 🟡 **Behind:** 60-74.99%
- 🟠 **At Risk:** 35-59.99%
- 🔴 **Critical:** <35%

---

## 📁 Project Structure

```
code/
├── src/
│   ├── app/                 # Next.js pages (routing)
│   │   ├── page.tsx         # Dashboard
│   │   └── grant/
│   │       └── page.tsx     # Grant Reporting
│   ├── components/          # React components
│   │   ├── ProgramDashboard.tsx
│   │   ├── GrantReportAssistant.tsx
│   │   └── ...
│   └── lib/                 # Business logic (server-side)
│       ├── data-loader.ts   # CSV parsing
│       ├── analytics.ts     # Metrics calculation
│       ├── narrative.ts     # Report generation
│       └── risk.ts          # Risk classification
├── public/
│   └── data/                # CSV files and images
├── DEPLOYMENT_GUIDE.md      # Detailed deployment docs
└── package.json
```

---

## 🔧 Development

### Available Scripts

```bash
npm run dev      # Start development server
npm run build    # Build for production
npm start        # Run production server
npm run lint     # Run ESLint
```

### Adding New Features

1. **New Metrics:** Update `src/lib/analytics.ts`
2. **New Filters:** Modify `src/components/ProgramFiltersBar.tsx`
3. **New Pages:** Add to `src/app/` directory
4. **Data Sources:** Update `src/lib/data-loader.ts`

---

## 📈 Performance

- **Build Time:** ~3.6s
- **Cold Start:** ~455ms
- **Page Load:** <1s (with caching)
- **Bundle Size:** 0.83 MB static assets

---

## 🧪 Testing

```bash
# Run tests (when configured)
npm test

# Check types
npx tsc --noEmit

# Lint code
npm run lint
```

---

## 🔒 Security

- ✅ TypeScript strict mode enabled
- ✅ No hardcoded secrets
- ✅ Environment variables for sensitive data
- ✅ Dependencies regularly audited
- ⚠️ No authentication layer (add if needed for production)

---

## 📝 Documentation

- [DEPLOYMENT_GUIDE.md](DEPLOYMENT_GUIDE.md) - Deployment options (Vercel, Docker, VPS)
- [DEPLOYMENT_CHECK_RESULTS.md](DEPLOYMENT_CHECK_RESULTS.md) - Pre-deployment verification
- [GIT_DEPLOYMENT_STEPS.md](GIT_DEPLOYMENT_STEPS.md) - Git and Vercel setup
- [AI_INTEGRATION.md](AI_INTEGRATION.md) - Optional AI narrative generation

---

## 🤝 Contributing

This is a portfolio/assignment project, but suggestions are welcome!

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

---

## 📄 License

This project is created for educational/demonstration purposes.

---

## 🙏 Acknowledgments

- **Built for:** Mantra4Change pre-interview assignment
- **Data:** Synthetic data created for demonstration
- **Inspired by:** Real-world program monitoring and grant reporting needs

---

## 🐛 Known Issues

- Debug console logs in `src/lib/paths.ts` (optional cleanup)
- PostCSS security advisory (low impact, monitored)
- No authentication system (add if needed)

See [DEPLOYMENT_CHECK_RESULTS.md](DEPLOYMENT_CHECK_RESULTS.md) for full details.

---

## 📞 Contact

**Developer:** Ayman  
**GitHub:** [@Ayman2026](https://github.com/Ayman2026)  
**Project:** [PBL Dashboard](https://github.com/Ayman2026/PBL)

---

## ⭐ Show Your Support

If this project helped you, please give it a ⭐!

---

**Made with ❤️ and Next.js**
