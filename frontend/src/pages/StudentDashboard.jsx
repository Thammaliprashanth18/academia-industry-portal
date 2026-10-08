import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import DashboardLayout from '../layouts/DashboardLayout';
import { useAuth } from '../context/AuthContext';
import { studentAPI } from '../services/api';
import {
  Sparkles,
  Briefcase,
  Award,
  CheckCircle2,
  Clock,
  ArrowRight,
  TrendingUp,
  FileText,
  AlertCircle,
  Building2,
  Loader2,
  Compass,
  UserCheck
} from 'lucide-react';

const StudentDashboard = () => {
  const { user } = useAuth();
  const [dashboardData, setDashboardData] = useState(null);
  const [profileData, setProfileData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.allSettled([
      studentAPI.getDashboard(),
      studentAPI.getProfile()
    ]).then(([dashRes, profRes]) => {
      if (dashRes.status === 'fulfilled' && dashRes.value.success) {
        setDashboardData(dashRes.value.data);
      }
      if (profRes.status === 'fulfilled' && profRes.value.success) {
        setProfileData(profRes.value.data);
      }
      setLoading(false);
    });
  }, []);

  if (loading) {
    return (
      <DashboardLayout>
        <div className="py-20 flex flex-col items-center justify-center">
          <Loader2 className="w-10 h-10 text-indigo-600 animate-spin mb-3" />
          <p className="text-sm font-medium text-slate-500">Loading your student dashboard...</p>
        </div>
      </DashboardLayout>
    );
  }

  const stats = dashboardData?.stats || {
    totalApplications: 0,
    shortlistedCount: 0,
    interviewCount: 0,
    selectedCount: 0
  };

  const completion = profileData?.completionPercentage || 65;

  return (
    <DashboardLayout>
      <div className="space-y-6">

        {/* Welcome Banner */}
        <div className="p-6 rounded-3xl bg-gradient-to-r from-indigo-900 via-indigo-800 to-slate-900 text-white shadow-xl relative overflow-hidden">
          <div className="absolute right-0 top-0 w-96 h-96 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />
          <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div className="space-y-2">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 text-xs font-semibold text-indigo-200">
                <Sparkles className="w-3.5 h-3.5 text-indigo-300" /> Academic Portal Active
              </div>
              <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
                Welcome back, {user?.name}! 👋
              </h1>
              <p className="text-xs sm:text-sm text-indigo-200 max-w-xl">
                {profileData?.college || 'Add your institution in profile'} • {profileData?.degree || 'B.Tech'} {profileData?.branch ? `(${profileData.branch})` : ''}
              </p>
            </div>

            {/* Profile Completion Bar */}
            <div className="bg-white/10 backdrop-blur-md p-4 rounded-2xl border border-white/15 min-w-[240px]">
              <div className="flex justify-between items-center text-xs font-semibold mb-1.5">
                <span className="text-indigo-200">Profile Strength</span>
                <span className="text-white font-bold">{completion}%</span>
              </div>
              <div className="w-full bg-white/20 rounded-full h-2 overflow-hidden mb-2">
                <div
                  className="bg-gradient-to-r from-emerald-400 to-teal-300 h-full rounded-full transition-all duration-500"
                  style={{ width: `${completion}%` }}
                />
              </div>
              <Link
                to="/student/profile"
                className="text-[11px] text-indigo-200 hover:text-white font-semibold flex items-center gap-1 transition"
              >
                Complete profile for better matches <ArrowRight className="w-3 h-3" />
              </Link>
            </div>
          </div>
        </div>

        {/* 4 Stats Cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="p-4 rounded-2xl bg-white border border-slate-200 shadow-sm flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center shrink-0">
              <FileText className="w-6 h-6" />
            </div>
            <div>
              <p className="text-2xl font-black text-slate-900">{stats.totalApplications || 0}</p>
              <p className="text-xs text-slate-500 font-medium">Total Applied</p>
            </div>
          </div>

          <div className="p-4 rounded-2xl bg-white border border-slate-200 shadow-sm flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center shrink-0">
              <Clock className="w-6 h-6" />
            </div>
            <div>
              <p className="text-2xl font-black text-slate-900">{stats.shortlistedCount || 0}</p>
              <p className="text-xs text-slate-500 font-medium">Shortlisted</p>
            </div>
          </div>

          <div className="p-4 rounded-2xl bg-white border border-slate-200 shadow-sm flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center shrink-0">
              <UserCheck className="w-6 h-6" />
            </div>
            <div>
              <p className="text-2xl font-black text-slate-900">{stats.interviewCount || 0}</p>
              <p className="text-xs text-slate-500 font-medium">Interviews</p>
            </div>
          </div>

          <div className="p-4 rounded-2xl bg-white border border-slate-200 shadow-sm flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0">
              <Award className="w-6 h-6" />
            </div>
            <div>
              <p className="text-2xl font-black text-slate-900">{stats.selectedCount || 0}</p>
              <p className="text-xs text-slate-500 font-medium">Offers / Selected</p>
            </div>
          </div>
        </div>

        {/* Skill Match Recommendations Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

          {/* Top Recommended Internships */}
          <div className="p-6 rounded-2xl bg-white border border-slate-200 shadow-sm flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <Briefcase className="w-5 h-5 text-indigo-600" />
                  <h2 className="text-base font-bold text-slate-900">Recommended Internships</h2>
                </div>
                <Link to="/internships" className="text-xs font-semibold text-indigo-600 hover:text-indigo-800 flex items-center gap-1">
                  View all <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>

              {dashboardData?.recommendedInternships?.length === 0 ? (
                <p className="text-xs text-slate-500 py-6 text-center">No active internships available right now.</p>
              ) : (
                <div className="space-y-3">
                  {dashboardData?.recommendedInternships?.map((item) => (
                    <div
                      key={item.id}
                      className="p-3.5 rounded-xl border border-slate-200/80 hover:border-indigo-300 hover:bg-slate-50/50 transition flex items-center justify-between gap-3"
                    >
                      <div className="min-w-0 flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <span className="font-bold text-sm text-slate-900 truncate">{item.title}</span>
                          <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                            item.skillMatch.matchPercentage >= 70
                              ? 'bg-emerald-100 text-emerald-800'
                              : item.skillMatch.matchPercentage >= 40
                              ? 'bg-amber-100 text-amber-800'
                              : 'bg-slate-100 text-slate-700'
                          }`}>
                            {item.skillMatch.matchPercentage}% Skill Match
                          </span>
                        </div>
                        <p className="text-xs text-slate-500 truncate">{item.company_name} • {item.location} ({item.work_mode})</p>
                        <div className="flex flex-wrap gap-1 mt-2">
                          {item.skillsList?.slice(0, 3).map((sk, idx) => (
                            <span key={idx} className="px-1.5 py-0.5 rounded bg-slate-100 text-[10px] text-slate-600 font-medium">
                              {sk}
                            </span>
                          ))}
                        </div>
                      </div>

                      <Link
                        to={`/student/internship/${item.id}`}
                        className="px-3 py-1.5 rounded-lg bg-indigo-50 hover:bg-indigo-600 hover:text-white text-indigo-700 text-xs font-semibold shrink-0 transition"
                      >
                        Apply
                      </Link>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Top Recommended Jobs */}
          <div className="p-6 rounded-2xl bg-white border border-slate-200 shadow-sm flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <Award className="w-5 h-5 text-indigo-600" />
                  <h2 className="text-base font-bold text-slate-900">Recommended Placement Roles</h2>
                </div>
                <Link to="/jobs" className="text-xs font-semibold text-indigo-600 hover:text-indigo-800 flex items-center gap-1">
                  View all <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>

              {dashboardData?.recommendedJobs?.length === 0 ? (
                <p className="text-xs text-slate-500 py-6 text-center">No active placement roles available right now.</p>
              ) : (
                <div className="space-y-3">
                  {dashboardData?.recommendedJobs?.map((item) => (
                    <div
                      key={item.id}
                      className="p-3.5 rounded-xl border border-slate-200/80 hover:border-indigo-300 hover:bg-slate-50/50 transition flex items-center justify-between gap-3"
                    >
                      <div className="min-w-0 flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <span className="font-bold text-sm text-slate-900 truncate">{item.title}</span>
                          <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                            item.skillMatch.matchPercentage >= 70
                              ? 'bg-emerald-100 text-emerald-800'
                              : item.skillMatch.matchPercentage >= 40
                              ? 'bg-amber-100 text-amber-800'
                              : 'bg-slate-100 text-slate-700'
                          }`}>
                            {item.skillMatch.matchPercentage}% Match
                          </span>
                        </div>
                        <p className="text-xs text-slate-500 truncate">{item.company_name} • {item.salary_package}</p>
                        <div className="flex flex-wrap gap-1 mt-2">
                          {item.skillsList?.slice(0, 3).map((sk, idx) => (
                            <span key={idx} className="px-1.5 py-0.5 rounded bg-slate-100 text-[10px] text-slate-600 font-medium">
                              {sk}
                            </span>
                          ))}
                        </div>
                      </div>

                      <Link
                        to={`/jobs/${item.id}`}
                        className="px-3 py-1.5 rounded-lg bg-indigo-50 hover:bg-indigo-600 hover:text-white text-indigo-700 text-xs font-semibold shrink-0 transition"
                      >
                        Details
                      </Link>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

        </div>

        {/* Recent Applications Tracker */}
        <div className="p-6 rounded-2xl bg-white border border-slate-200 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-base font-bold text-slate-900">Recent Applications</h3>
              <p className="text-xs text-slate-500">Live status updates from recruiting companies</p>
            </div>
            <Link to="/student/applications" className="text-xs font-semibold text-indigo-600 hover:text-indigo-800">
              View All Applications →
            </Link>
          </div>

          {dashboardData?.recentApplications?.length === 0 ? (
            <div className="py-8 text-center bg-slate-50 rounded-xl border border-dashed border-slate-200">
              <FileText className="w-8 h-8 text-slate-400 mx-auto mb-2" />
              <p className="text-xs font-semibold text-slate-600">You haven't submitted any applications yet.</p>
              <Link to="/internships" className="inline-block mt-2 text-xs text-indigo-600 font-bold hover:underline">
                Explore open internships
              </Link>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="border-b border-slate-200 text-slate-500 uppercase tracking-wider font-semibold">
                    <th className="pb-3">Role / Opportunity</th>
                    <th className="pb-3">Company</th>
                    <th className="pb-3">Type</th>
                    <th className="pb-3">Applied On</th>
                    <th className="pb-3">Current Status</th>
                    <th className="pb-3 text-right">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {dashboardData?.recentApplications?.map((app) => (
                    <tr key={app.id} className="hover:bg-slate-50">
                      <td className="py-3 font-semibold text-slate-900">{app.title}</td>
                      <td className="py-3 text-slate-600">{app.company_name}</td>
                      <td className="py-3 uppercase text-[10px] font-bold text-slate-500">{app.opportunity_type}</td>
                      <td className="py-3 text-slate-500">{new Date(app.applied_at).toLocaleDateString()}</td>
                      <td className="py-3">
                        <span className={`px-2.5 py-1 rounded-full text-[11px] font-bold ${
                          app.status === 'Selected' ? 'bg-emerald-100 text-emerald-800' :
                          app.status === 'Interview' ? 'bg-blue-100 text-blue-800' :
                          app.status === 'Shortlisted' ? 'bg-amber-100 text-amber-800' :
                          app.status === 'Rejected' ? 'bg-rose-100 text-rose-800' :
                          'bg-slate-100 text-slate-700'
                        }`}>
                          {app.status}
                        </span>
                      </td>
                      <td className="py-3 text-right">
                        <Link to="/student/applications" className="text-indigo-600 hover:text-indigo-900 font-semibold">
                          Track
                        </Link>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

      </div>
    </DashboardLayout>
  );
};

export default StudentDashboard;