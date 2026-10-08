import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { ToastProvider } from './context/ToastContext';
import ProtectedRoute from './components/ProtectedRoute';

// Public Pages
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import Internships from './pages/Internships';
import InternshipDetails from './pages/InternshipDetails';
import Jobs from './pages/Jobs';
import JobDetails from './pages/JobDetails';

// Student Pages
import StudentDashboard from './pages/StudentDashboard';
import StudentProfile from './pages/StudentProfile';
import MySkills from './pages/MySkills';
import SkillGap from './pages/SkillGap';
import LearningRoadmap from './pages/LearningRoadmap';
import Applications from './pages/Applications';

// Company Pages
import CompanyDashboard from './pages/CompanyDashboard';
import CompanyProfile from './pages/CompanyProfile';
import PostInternship from './pages/PostInternship';
import PostJob from './pages/PostJob';
import CompanyInternships from './pages/CompanyInternships';
import CompanyApplications from './pages/CompanyApplications';
import MatchedStudents from './pages/MatchedStudents';

// Admin Pages
import AdminDashboard from './pages/AdminDashboard';

function App() {
  return (
    <AuthProvider>
      <ToastProvider>
        <Routes>
          {/* ================= PUBLIC ROUTES ================= */}
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/internships" element={<Internships />} />
          <Route path="/student/internship/:id" element={<InternshipDetails />} />
          <Route path="/jobs" element={<Jobs />} />
          <Route path="/jobs/:id" element={<JobDetails />} />

          {/* ================= STUDENT PROTECTED ROUTES ================= */}
          <Route
            path="/student/dashboard"
            element={
              <ProtectedRoute allowedRoles={['student']}>
                <StudentDashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/student/profile"
            element={
              <ProtectedRoute allowedRoles={['student']}>
                <StudentProfile />
              </ProtectedRoute>
            }
          />
          <Route
            path="/student/skills"
            element={
              <ProtectedRoute allowedRoles={['student']}>
                <MySkills />
              </ProtectedRoute>
            }
          />
          <Route
            path="/student/skill-gap"
            element={
              <ProtectedRoute allowedRoles={['student']}>
                <SkillGap />
              </ProtectedRoute>
            }
          />
          <Route
            path="/student/roadmap"
            element={
              <ProtectedRoute allowedRoles={['student']}>
                <LearningRoadmap />
              </ProtectedRoute>
            }
          />
          <Route
            path="/student/internships"
            element={
              <ProtectedRoute allowedRoles={['student']}>
                <Internships />
              </ProtectedRoute>
            }
          />
          <Route
            path="/student/jobs"
            element={
              <ProtectedRoute allowedRoles={['student']}>
                <Jobs />
              </ProtectedRoute>
            }
          />
          <Route
            path="/student/applications"
            element={
              <ProtectedRoute allowedRoles={['student']}>
                <Applications />
              </ProtectedRoute>
            }
          />

          {/* ================= COMPANY PROTECTED ROUTES ================= */}
          <Route
            path="/company/dashboard"
            element={
              <ProtectedRoute allowedRoles={['company']}>
                <CompanyDashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/company/profile"
            element={
              <ProtectedRoute allowedRoles={['company']}>
                <CompanyProfile />
              </ProtectedRoute>
            }
          />
          <Route
            path="/company/internships/new"
            element={
              <ProtectedRoute allowedRoles={['company']}>
                <PostInternship />
              </ProtectedRoute>
            }
          />
          <Route
            path="/company/jobs/new"
            element={
              <ProtectedRoute allowedRoles={['company']}>
                <PostJob />
              </ProtectedRoute>
            }
          />
          <Route
            path="/company/internships"
            element={
              <ProtectedRoute allowedRoles={['company']}>
                <CompanyInternships />
              </ProtectedRoute>
            }
          />
          <Route
            path="/company/applications"
            element={
              <ProtectedRoute allowedRoles={['company']}>
                <CompanyApplications />
              </ProtectedRoute>
            }
          />
          <Route
            path="/company/students"
            element={
              <ProtectedRoute allowedRoles={['company']}>
                <MatchedStudents />
              </ProtectedRoute>
            }
          />

          {/* ================= ADMIN PROTECTED ROUTES ================= */}
          <Route
            path="/admin/dashboard"
            element={
              <ProtectedRoute allowedRoles={['admin']}>
                <AdminDashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/users"
            element={
              <ProtectedRoute allowedRoles={['admin']}>
                <AdminDashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/companies"
            element={
              <ProtectedRoute allowedRoles={['admin']}>
                <AdminDashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/postings"
            element={
              <ProtectedRoute allowedRoles={['admin']}>
                <AdminDashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/skills"
            element={
              <ProtectedRoute allowedRoles={['admin']}>
                <AdminDashboard />
              </ProtectedRoute>
            }
          />

          {/* ================= FALLBACK CATCH-ALL ================= */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </ToastProvider>
    </AuthProvider>
  );
}

export default App;