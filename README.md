# 🔔 Student Notification Frontend

A modern React-based web dashboard for university students and admins to access real-time notifications, official announcements, bookmarks, academic schedules, and profile management. Built with Vite for fast development and Tailwind CSS for responsive design. Deployed Vercel-ready.

## 🚀 Features

- **Authentication**: Complete flow with Login, Register, Forgot Password, Reset Password, Email Verification.
- **Dashboard**: Real-time notifications with bookmark checks.
- **Official Announcements**: Filtered feeds with bookmarking support.
- **Bookmarks**: Manage saved notifications and announcements.
- **Academic Schedule**: Calendar view for deadlines and events.
- **User Profile**: Edit profile details, upload avatar (syncs across app via localStorage).
- **Role-Based Access**: Protected/Public routes, Auth/User Contexts for state management.
- **Responsive Navigation**: Desktop/Mobile nav with QuickLinks.
- **Performance**: Axios API services, optimized components (PostCard, Form).

## 🛠️ Tech Stack

- **React 18** + **Vite** (build tool)
- **Tailwind CSS** + **Lucide React** (icons)
- **React Router DOM** (routing)
- **Axios** (API calls)
- **React Context** (AuthContext, UserContext for global state)
- **Vercel** (deployment)

## 📦 Quick Start (Frontend Only)

1. **Clone/Navigate**:
   ```
   cd c:/student-notification-frontend
   ```

2. **Install Dependencies**:
   ```
   npm install
   ```

3. **Run Development Server**:
   ```
   npm run dev
   ```
   Open http://localhost:5173 (or shown port).

4. **Build for Production**:
   ```
   npm run build
   ```

## 🌐 Routes

| Path | Description | Access |
|------|-------------|--------|
| `/` | Landing/Redirect to Login | Public |
| `/login` | User Login | Public |
| `/register` | User Signup | Public |
| `/forgot-password` | Password Recovery | Public |
| `/reset-password` | Password Reset (token) | Public |
| `/verify-email` | Email Verification | Public |
| `/dashboard` | Main Notifications Feed | Protected |
| `/announcements` | Official Announcements | Protected |
| `/bookmarks` | Saved Items | Protected |
| `/schedule` | Academic Calendar | Protected |
| `/profile` | Edit Profile | Protected |

## 🚀 Deployment (Vercel)

1. Install Vercel CLI: `npm i -g vercel`
2. Login: `vercel login`
3. Deploy: `vercel --prod`
   - Config uses `vercel.json` (rewrites, headers).

**Live Demo**: [Update with your Vercel URL after deploy]

## 🔌 API Integration

Assumes external backend API (e.g., Node.js/Express/MongoDB):
- Update base URLs in `src/services/*.js` (notificationService.js, announcementService.js).
- Auth tokens auto-managed via AuthContext.

## 🤝 Contributing

1. Fork the repo.
2. Create branch: `git checkout -b feature/your-feature`.
3. Commit: `git commit -m "feat: add your feature"`.
4. Push/PR: `git push origin feature/your-feature`.

## 📄 License

MIT License - See [LICENSE](LICENSE) (or add if missing).

---

**Built for seamless student-admin communication. Contributions welcome!** 👨‍🎓👩‍🎓

