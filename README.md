# 🎓 ScholarSphere

![ScholarSphere Banner](https://images.unsplash.com/photo-1523050854058-8df90110c9f1?q=80&w=2070&auto=format&fit=crop)

> **AI-Powered Global Scholarship Discovery & Application Tracker**

ScholarSphere is an intelligent platform designed to help students discover, track, and apply for fully-funded global scholarships. By leveraging AI, it matches your academic profile with thousands of opportunities worldwide, ensuring you never miss a deadline.

## ✨ Features

- **🤖 AI Matching Engine:** Accurately matches your academic background, region, and degree level with high-probability scholarships.
- **🌍 Global Reach:** Tracks over 5,000+ active programs across 120+ countries.
- **📅 Smart Dashboard:** View your personalized funding overview, saved scholarships, and track upcoming deadlines down to the day.
- **✅ Application Tracking:** Mark scholarships as applied, track your progress, and get a confetti celebration when you submit!
- **📋 Global Checklist:** Manage your document readiness (SOPs, LORs, Transcripts) directly from the dashboard.
- **✉️ Automated Alerts:** Weekly personalized email digests for newly added opportunities matching your profile.
- **🎨 Modern UI/UX:** A highly polished, glassmorphism-inspired interface built with Tailwind CSS and Framer Motion for smooth animations.

## 🛠️ Tech Stack

- **Frontend:** React 18, React Router v6, Tailwind CSS
- **Animations:** Framer Motion, Canvas Confetti
- **Icons:** Lucide React
- **Language Support:** i18next (English, Hindi, Spanish)
- **Tooling:** Vite, TypeScript

## 🚀 Getting Started

### Prerequisites
Make sure you have Node.js (v18+) and npm installed.

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/your-username/scholarsphere.git
   cd scholarsphere
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Start the development server**
   ```bash
   npm run dev
   ```

4. **Build for production**
   ```bash
   npm run build
   ```

## ☁️ Deployment Guide

**⚠️ Do NOT deploy this app on Vercel or Netlify by default.**
Because this app uses an Express.js backend, background chron jobs, and a local SQLite database (`better-sqlite3`), it requires a long-running Node.js server. Vercel only supports static sites and Serverless functions (where your database will reset on every click).

**Recommended Platforms for Deployment:**
- **Render.com** (Free tier available - choose "Web Service")
- **Railway.app**
- **Google Cloud Run**

To deploy on Render:
1. Create a new "Web Service" on Render.
2. Connect your GitHub repository.
3. Set the Build Command: `npm install && npm run build`
4. Set the Start Command: `npm start`
5. Add your `GEMINI_API_KEY` to the Environment Variables.

## 🎯 How It Works
1. **Build Your Profile:** Share your academic background, region, and aspirations.
2. **Get Machine Matched:** The AI agent monitors thousands of programs daily to surface only the grants you are highly likely to win.
3. **Never Miss a Deadline:** Handle applications effortlessly with structured checklists and deadline reminders.

## 🤝 Contributing
Contributions, issues, and feature requests are welcome! Feel free to check the [issues page](https://github.com/your-username/scholarsphere/issues).

## 📄 License
This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---
*Built with ❤️ to empower students globally.*
