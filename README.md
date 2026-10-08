# Academia–Industry Collaboration Portal

> **Portal for Academia–Industry Collaboration for Skill Mapping, Internships, and Placement**

A centralized, full-stack enterprise web application engineered to bridge the gap between academic education and industry requirements through **explainable skill mapping**, verified internship pipelines, campus placement drives, and real-time application tracking.

---

## 🚀 Key Features

### 🎓 Student Role
* **Authentication & Profile**: Secure JWT login with bcrypt password hashing. Professional profile including college, degree, branch, CGPA, graduation year, social links, and downloadable PDF resume upload.
* **Academic Portfolios**: Add and manage verified education records, hands-on projects (with GitHub & live links), and industry certifications.
* **Explainable AI Skill Mapping**: Real-time compatibility calculation comparing student competencies with company requirements (displaying exact % match, matching skills, and missing skills).
* **Internship & Placement Marketplace**: Real-time search, multi-criteria filters (work mode, stipend, duration, skill, location), sorting, and detailed view.
* **Application Workflow**: One-click application with custom cover letter and attached resume. Live tracking of recruitment stages (`Applied` ➔ `Under Review` ➔ `Shortlisted` ➔ `Interview` ➔ `Selected` ➔ `Rejected`).
* **Skill Gap Intelligence**: Comparative analytics highlighting the most in-demand market skills missing from the student's profile.
* **Milestone Roadmaps**: Curated learning tracks for Full-Stack Development, AI/ML, and Cloud & DevOps.

### 🏢 Company / Industry Recruiter Role
* **Recruiter Control Center**: Metrics overview for active internships, placement drives, candidate pipeline funnel, and recent applicants.
* **Opportunity Posting Engine**: Create, edit, and moderate internships and full-time placement drives with required skill tagging and eligibility thresholds.
* **Applicant Review Console**: Inspect applicants with CGPA, college details, cover letter, resume preview, and explainable skill fit %.
* **Recruitment Status Pipeline**: Move candidates across recruitment stages (`Shortlisted`, `Interview`, `Selected`, `Rejected`) with optional recruiter feedback notes that instantly notify the student.
* **Candidate Pool Discovery**: Filter and rank the entire student database by skill matching percentage for active job requisitions.

### 🛡️ Admin / Educational Institution Role
* **System Overview**: Platform analytics covering student registrations, corporate partnerships, active postings, and placement conversion rates.
* **User Management**: Search, filter, inspect, and toggle status (`active` / `suspended`) or remove user accounts.
* **Corporate Verification**: Supervise and approve/reject industry partner verification badges.
* **Posting Moderation**: Monitor and moderate active listings across the portal.
* **Skills Catalog Management**: Maintain the standardized industry skill ontology and taxonomy.

---

## 🛠️ Technology Stack

| Layer | Technologies |
|---|---|
| **Frontend** | React.js (Vite), Tailwind CSS v4, React Router v7, Axios, Lucide React |
| **Backend** | Node.js, Express.js, JWT Authentication, bcryptjs, Multer, CORS |
| **Database** | MySQL 8.0+, Relational schema with Foreign Keys, Cascades, and Indexes |
| **Tooling** | VS Code, Git, Postman / REST Client |

---

## 📁 Project Architecture & Structure

```text
AcademiaIndustryPortal/
│
├── frontend/                     # React + Vite Frontend
│   ├── src/
│   │   ├── components/           # Navbar, Sidebar, Footer, ProtectedRoute, Modals
│   │   ├── context/              # AuthContext, ToastContext
│   │   ├── layouts/              # DashboardLayout
│   │   ├── pages/                # Home, Login, Register, Student/Company/Admin Pages
│   │   ├── services/             # Axios API client module
│   │   ├── App.jsx               # Route Registry & Role Protection
│   │   ├── index.css             # Tailwind CSS Configuration
│   │   └── main.jsx              # React Entry Point
│   ├── package.json
│   └── vite.config.js
│
├── backend/                      # Express.js REST API
│   ├── config/
│   │   ├── db.js                 # MySQL Connection Pool
│   │   ├── initDb.js             # Automated Schema & Seed Loader
│   │   └── seedRunner.js         # Standalone Seed CLI Script
│   ├── controllers/              # Auth, Student, Company, Internship, Job, Admin, Skill, Notification
│   ├── middleware/               # JWT Auth, Role Authorizer, Multer File Upload, Error Handler
│   ├── routes/                   # REST API Endpoints
│   ├── utils/                    # Explainable Skill Match Engine
│   ├── uploads/                  # Uploaded resumes and company logos
│   ├── app.js                    # Express App Setup
│   ├── server.js                 # Server Entry Point
│   ├── package.json
│   ├── .env.example
│   └── .env
│
├── database/
│   ├── schema.sql                # Complete 14-table MySQL Schema
│   └── seed.sql                  # Comprehensive realistic demo dataset
│
├── README.md
└── .gitignore
```

---

## 🗄️ Relational Database Schema

The database consists of **14 normalized tables**:

1. `users` — Base authentication table (Student, Company, Admin).
2. `students` — Extended student profile (college, degree, CGPA, graduation year, resume URL).
3. `companies` — Extended company profile (industry, size, website, verification status).
4. `skills` — Standardized skill catalog and ontology.
5. `student_skills` — Many-to-many mapping of students to skills with proficiency ratings.
6. `internships` — Internship postings with stipends, duration, and eligibility criteria.
7. `internship_skills` — Required/optional skills per internship.
8. `jobs` — Campus placement opportunities with salary packages and experience limits.
9. `job_skills` — Required/optional skills per job.
10. `applications` — Multi-stage application workflow tracking candidate submissions and status.
11. `education` — Historical education background records.
12. `certifications` — Student professional credentials and verification links.
13. `projects` — Portfolio showcase with live demos and repository links.
14. `notifications` — Real-time event notifications for status updates and applications.

---

## 🔑 Demo Accounts & Credentials

Use any of the following pre-seeded accounts to explore the portal:

| Role | Email | Password | Details |
|---|---|---|---|
| **Student** | `rahul.sharma@student.edu` | `Password123!` | Full-Stack CS student (9.2 CGPA, 10 skills) |
| **Student** | `priya.patel@student.edu` | `Password123!` | AI & Data Science specialist (9.4 CGPA) |
| **Company** | `recruiter@microsoft.com` | `Password123!` | Microsoft Recruiter (Active SWE listings) |
| **Company** | `talent@google.com` | `Password123!` | Google Recruiter (AI/ML postings) |
| **Admin** | `admin@portal.edu` | `AdminPassword123!` | System Administrator & Institution Manager |

> *Quick Tip:* On the **Login Page**, click the one-click demo credentials buttons for instant access.

---

## ⚡ Setup & Local Installation

### Prerequisites
* **Node.js** (v18 or higher)
* **MySQL Server** (v8.0+ running on port `3306`)

---

### Step 1: Database Setup
Make sure MySQL is running. The server auto-creates tables and seeds data on startup, or you can run the SQL files directly:

```bash
mysql -u root -p < database/schema.sql
mysql -u root -p < database/seed.sql
```

---

### Step 2: Backend Configuration & Start

```bash
cd backend
npm install
```

Ensure `.env` is configured (or copy from `.env.example`):
```env
PORT=5000
DB_HOST=localhost
DB_PORT=3306
DB_USER=root
DB_PASSWORD=root123
DB_NAME=academia_industry
JWT_SECRET=academia_industry_secure_jwt_token_secret_2026
FRONTEND_URL=http://localhost:5173
```

Start the backend server:
```bash
npm run dev
# or: npm start
```

Backend will be active at: `http://localhost:5000`  
API Base Endpoint: `http://localhost:5000/api`

---

### Step 3: Frontend Setup & Start

Open a new terminal:
```bash
cd frontend
npm install
npm run dev
```

Frontend will be running at: `http://localhost:5173`

---

## 📡 REST API Reference

### Authentication (`/api/auth`)
* `POST /api/auth/register` — Register a new student or company account.
* `POST /api/auth/login` — Sign in and receive JWT token.
* `GET /api/auth/me` — Retrieve current authenticated user and profile metadata.
* `PUT /api/auth/update-password` — Change password.

### Student Module (`/api/students`)
* `GET /api/students/profile` — Full profile with education, projects, certifications, and skills.
* `PUT /api/students/profile` — Update personal and academic details.
* `POST /api/students/resume` — Upload PDF/DOC resume file.
* `GET /api/students/skills` — Get mapped skills with proficiency.
* `POST /api/students/skills` — Add skill to student profile.
* `DELETE /api/students/skills/:skillId` — Remove skill.
* `GET /api/students/dashboard` — Live dashboard metrics and skill-matched recommendations.
* `GET /api/students/skill-gap` — Comprehensive market skill gap analysis.

### Opportunities (`/api/internships`, `/api/jobs`)
* `GET /api/internships` — List all internships with keyword search, filters, and dynamic skill match %.
* `GET /api/internships/:id` — Single internship details with matching/missing skills breakdown.
* `POST /api/internships` — Company posts new internship.
* `GET /api/jobs` — List all placement roles with packages and filters.
* `GET /api/jobs/:id` — Single job details.
* `POST /api/jobs` — Company posts new placement drive.

### Application Workflow (`/api/applications`)
* `POST /api/applications/apply` — Student submits application with cover letter.
* `GET /api/applications/my-applications` — Student retrieves all submitted applications.
* `PUT /api/applications/:id/status` — Company updates application status and sends student notification.
* `DELETE /api/applications/:id` — Student withdraws application.

### Company Module (`/api/companies`)
* `GET /api/companies/dashboard-stats` — Recruiter metrics and funnel statistics.
* `GET /api/companies/applicants` — Multi-filtered applicant review console.
* `GET /api/companies/matched-students` — AI candidate discovery matching student skill pool.
* `PUT /api/companies/profile` — Update company profile.

### Admin Module (`/api/admin`)
* `GET /api/admin/dashboard-stats` — Platform-wide analytics.
* `GET /api/admin/users` — Manage and search user accounts.
* `PUT /api/admin/users/:id/status` — Suspend or activate user.
* `PUT /api/admin/companies/:id/verify` — Approve or reject company verification.
* `POST /api/admin/skills` — Add new skill to global catalog.

---

## 🧪 Verified Major Workflows

1. **Student Registration & Skill Mapping**: Create a student account, select technical competencies, upload resume PDF, and inspect the real-time Skill Gap Analysis.
2. **Opportunity Discovery**: Browse internships and placements with live calculated compatibility percentage tags (e.g., `100% Match`, `75% Match`).
3. **Application & Notification**: Apply to an internship; notice the company recruiter immediately sees the candidate in the **Applicant Review Console**.
4. **Recruitment Status Transition**: Recruiter marks applicant as `Shortlisted` or `Interview` with custom notes; student dashboard updates immediately and delivers an in-app notification.
5. **Corporate Talent Discovery**: Recruiter uses the **Matched Talent Pool** to filter students across institutions having $\ge 75\%$ required skill coverage.
6. **Administrative Governance**: Admin monitors real-time statistics, verifies corporate accounts, and maintains the global skills taxonomy.

---

## 📄 License & Academic Attribution
Developed as a production-grade **Major Capstone Project** for Academia–Industry Collaboration, Skill Mapping, Internships, and Placement Pathways.
