# AchievingCoach

Professional coaching SaaS platform for executive coaching processes (Coaching Ejecutivo - CE).

![Next.js](https://img.shields.io/badge/Next.js-14-black)
![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue)
![Firebase](https://img.shields.io/badge/Firebase-12.6-orange)
![TailwindCSS](https://img.shields.io/badge/TailwindCSS-3.4-cyan)

## 🎯 Overview

AchievingCoach is a comprehensive coaching platform that enables coaches to manage their executive coaching programs following a structured 9-phase methodology. The platform supports the complete coaching lifecycle from initial assessments to final reports.

**Live Site:** [https://achievingcoach.com](https://achievingcoach.com)

## ✨ Features

### For Coaches
- **Client Management** - Track and manage all coachees
- **Coaching Programs** - Full 9-phase executive coaching process
- **Session Management** - Schedule, conduct, and document sessions
- **Assessment Tools** - ICF Simulator, DISC, Resilience Scale, Wheel of Life, etc.
- **Auto-Generated Reports** - Process and final reports with AI assistance
- **Analytics Dashboard** - Track progress and engagement metrics

### For Coachees
- **Program Dashboard** - View assigned programs and progress
- **Digital Signatures** - Accept coaching agreements electronically
- **Session Access** - View scheduled sessions and resources
- **Self-Assessment Tools** - Complete assigned coaching tools
- **Goal Tracking** - Monitor personal development goals

### Executive Coaching Process (9 Phases)
1. **Antecedentes** - Background information
2. **Reunión Tripartita** - Tripartite meeting with sponsor/HR
3. **Acuerdo de Coaching** - Digital coaching agreement with signatures
4. **Calendarización** - Session scheduling
5. **Sesiones 1-3** - Initial coaching sessions
6. **Reporte de Proceso** - Auto-generated mid-process report
7. **Sesión Observada** - Observed meeting session
8. **Sesiones 5-6** - Final coaching sessions
9. **Informe Final** - Auto-generated final report

## 🛠 Tech Stack

- **Frontend:** Next.js 14 (App Router), TypeScript, TailwindCSS
- **Backend:** Express.js API
- **Database:** Firebase Firestore
- **Authentication:** Firebase Auth
- **Hosting:** Google Cloud Run
- **CI/CD:** GitHub Actions → Cloud Build
- **Analytics:** Google Analytics 4, Search Console

## 📁 Project Structure
```
frontend/
├── src/
│   ├── app/                    # Next.js App Router pages
│   │   ├── (dashboard)/        # Protected dashboard routes
│   │   │   ├── coach/          # Coach-specific pages
│   │   │   ├── programs/       # Coachee program views
│   │   │   ├── sessions/       # Session management
│   │   │   ├── tools/          # Coaching tools
│   │   │   └── ...
│   │   ├── admin/              # Admin pages (SEO, analytics)
│   │   ├── blog/               # Blog with Firestore CMS
│   │   └── ...
│   ├── components/             # Reusable React components
│   ├── contexts/               # React contexts (Auth, Notifications)
│   ├── lib/                    # Utilities and services
│   │   ├── firebase.ts         # Firebase config
│   │   └── coachingService.ts  # Coaching CRUD operations
│   └── types/                  # TypeScript type definitions
│       └── coaching.ts         # Complete CE process types
├── public/                     # Static assets
└── ...
```

## 🚀 Getting Started

### Prerequisites
- Node.js 18+
- npm or yarn
- Firebase project
- Google Cloud project

### Installation
```bash
# Clone the repository
git clone https://github.com/eduardoandreslobos-sys/achieving-coach.git
cd achieving-coach/frontend

# Install dependencies
npm install

# Set up environment variables
cp .env.example .env.local
# Edit .env.local with your Firebase credentials

# Run development server
npm run dev
```

### Environment Variables
```env
NEXT_PUBLIC_FIREBASE_API_KEY=your_api_key
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_auth_domain
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_project_id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your_storage_bucket
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
NEXT_PUBLIC_FIREBASE_APP_ID=your_app_id
```

## 📊 Deployment

The project uses automatic CI/CD via GitHub Actions:
```bash
# Push to main branch triggers automatic deployment
git push origin main

# Check deployment status
gcloud run revisions list --service=achieving-coach --region=us-central1 --limit=3
```

## 🔐 User Roles

| Role | Description |
|------|-------------|
| `coach` | Can create programs, manage clients, conduct sessions |
| `coachee` | Can view programs, sign agreements, complete tools |
| `admin` | Full access including SEO dashboard and analytics |

## 📈 Key Metrics

- **PageSpeed Score:** Desktop 100/100, Mobile 62/100
- **SEO Score:** 100/100
- **Accessibility:** WCAG 2.1 compliant

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📄 License

This project is proprietary software owned by Eduardo Lobos.

## 👤 Author

**Eduardo Lobos**
- Website: [achievingcoach.com](https://achievingcoach.com)
- GitHub: [@eduardoandreslobos-sys](https://github.com/eduardoandreslobos-sys)
