🎓 Student Notification System (SNS)
An end-to-end communication platform designed to bridge the gap between university administration and students. This system provides real-time updates, official announcements, and academic scheduling in a streamlined, cross-platform experience.

🚀 Overview
This project consists of three core modules:

Web Dashboard: A high-performance React application for students to view feeds and admins to manage content.


Backend API: A centralized Node.js server managing authentication, role-based access control, and notification polling.

✨ Key Features
Real-time Feed: Official updates filtered by Faculty, Department, or Global relevance.

Role-Based Access (RBAC): Tiered permissions for SuperAdmin, FacultyAdmin, and DepartmentAdmin.

Smart Scheduling: An integrated academic calendar to track deadlines and events.

Bookmarking: Save important notifications for offline-style quick access.


Optimized Performance: Uses Upstash Redis for fast data management and polling logic to ensure updates are seen instantly.

🛠️ Tech Stack
Frontend (Web)
React 18 (Vite)

Tailwind CSS (Styling)

Lucide React (Iconography)

Axios (API Communication)

Mobile
React Native & Expo

NativeWind (Tailwind for Mobile)

Backend & Database
Node.js & Express

MongoDB (Primary Database)

Upstash Redis (Caching/State)

Cloudinary (Profile Picture & File Storage)

📦 Installation & Setup
1. Clone the Repository
Bash
git clone https://github.com/iyousojo/student-notify.git
cd student-notification-system
2. Backend Setup
Bash
cd backend
npm install
# Create a .env file and add your MONGO_URI, JWT_SECRET, and Cloudinary keys
npm start
3. Frontend Setup
Bash
cd frontend
npm install
npm run dev
4. Mobile Setup
Bash
cd mobile
npm install
npx expo start
🌐 Deployment
Backend: Hosted on Render

Frontend: Deployed via [GitHub Pages / Vercel]

API Base URL: https://student-notification-system-1.onrender.com

🔒 Environment Variables
To run this project, you will need to add the following environment variables to your .env file:

PORT, MONGODB_URI, JWT_SECRET, CLOUDINARY_CLOUD_NAME, CLOUDINARY_API_KEY, CLOUDINARY_API_SECRET, PAYSTACK_SECRET_KEY

🤝 Contributing
Fork the Project

Create your Feature Branch (git checkout -b feature/AmazingFeature)

Commit your Changes (git commit -m 'Add some AmazingFeature')

Push to the Branch (git push origin feature/AmazingFeature)

Open a Pull Request

📄 License
Distributed under the MIT License. See LICENSE for more information.

Built with ❤️ by [solomon johbull Iyoubhebhe]