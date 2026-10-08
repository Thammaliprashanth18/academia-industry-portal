import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import DashboardLayout from '../layouts/DashboardLayout';
import { useAuth } from '../context/AuthContext';
import { companyAPI } from '../services/api';
import {
  Building2,
  Briefcase,
  Award,
  Users,
  CheckCircle2,
  Clock,
  PlusCircle,
  FileCheck,
  TrendingUp,
  ArrowRight,
  Loader2,
  ExternalLink
} from 'lucide-react';

const CompanyDashboard = () => {
  const { user } = useAuth();
  const [stats, setStats] = useState(null);
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.allSettled([
      companyAPI.getDashboardStats(),
      companyAPI.getProfile()
    ]).then(([statsRes, profRes]) => {
      if (statsRes.status === 'fulfilled' && statsRes.value.success) {
        setStats(statsRes.value.data);
      }
      if (profRes.status === 'fulfilled' && profRes.value.success) {
        setProfile(profRes.value.data);
      }
      setLoading(false);
    });
  }, []);

  if (loading) {
    return (
      <DashboardLayout>
        <div className="py-20 flex flex-col items-center justify-center">
          <Loader2 className="w-10 h-10 text-indigo-600 animate-spin mb-3" />
          <p className="text-xs font-semibold text-slate-500">Loading recruiter dashboard...</p>
        </div>
      </DashboardLayout>
    );
  }

  const appStats = stats?.applicantStats || {
    totalApplicants: 0,
    appliedCount: 0,
    underReviewCount: 0,
    shortlistedCount: 0,
    interviewCount: 0,
    selectedCount: 0,
    rejectedCount: 0
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">

        {/* Welcome Header */}
        <div className="bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 text-white p-6 sm:p-8 rounded-3xl shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div>
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-300 text-xs font-bold mb-3">
              <Building2 className="w-3.5 h-3.5" /> Recruiter Control Center
            </span>
            <h1 className="text-2xl sm:text-3xl font-black">{profile?.company_name || user?.name}</h1>
            <p className="text-xs sm:text-sm text-indigo-200 mt-1">
              {profile?.industry_type || 'Software & Technology'} • {profile?.location || 'India'}
            </p>
          </div>

          <div className="flex items-center gap-2.5">
            <Link
              to="/company/internships/new"
              className="px-4 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs flex items-center gap-2 shadow-lg shadow-indigo-600/30 transition"
            >
              <PlusCircle className="w-4 h-4" /> Post Internship
            </Link>
            <Link
              to="/company/jobs/new"
              className="px-4 py-2.5 rounded-xl bg-white/10 hover:bg-white/20 border border-white/20 text-white font-bold text-xs flex items-center gap-2 transition"
            >
              <PlusCircle className="w-4 h-4" /> Post Job Drive
            </Link>
          </div>
        </div>

        {/* 4 Metric Stats Cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="p-4 rounded-2xl bg-white border border-slate-200 shadow-sm flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center shrink-0">
              <Briefcase className="w-6 h-6" />
            </div>
            <div>
              <p className="text-2xl font-black text-slate-900">{stats?.totalInternships || 0}</p>
              <p className="text-xs text-slate-500 font-medium">Active Internships</p>
            </div>
          </div>

          <div className="p-4 rounded-2xl bg-white border border-slate-200 shadow-sm flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-pink-50 text-pink-600 flex items-center justify-center shrink-0">
              <Award className="w-6 h-6" />
            </div>
            <div>
              <p className="text-2xl font-black text-slate-900">{stats?.totalJobs || 0}</p>
              <p className="text-xs text-slate-500 font-medium">Active Job Drives</p>
            </div>
          </div>

          <div className="p-4 rounded-2xl bg-white border border-slate-200 shadow-sm flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center shrink-0">
              <Users className="w-6 h-6" />
            </div>
            <div>
              <p className="text-2xl font-black text-slate-900">{appStats.totalApplicants || 0}</p>
              <p className="text-xs text-slate-500 font-medium">Total Applicants</p>
            </div>
          </div>

          <div className="p-4 rounded-2xl bg-white border border-slate-200 shadow-sm flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0">
              <CheckCircle2 className="w-6 h-6" />
            </div>
            <div>
              <p className="text-2xl font-black text-slate-900">{appStats.selectedCount || 0}</p>
              <p className="text-xs text-slate-500 font-medium">Hired / Selected</p>
            </div>
          </div>
        </div>

        {/* Application Funnel & Status Distribution */}
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <div>
              <h2 className="text-base font-bold text-slate-900">Recruitment Pipeline Funnel</h2>
              <p className="text-xs text-slate-500">Live applicant status stages across all your postings</p>
            </div>
            <Link to="/company/applications" className="text-xs font-semibold text-indigo-600 hover:text-indigo-800">
              Review Applicants →
            </Link>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
            {[
              { label: 'Applied', count: appStats.appliedCount, color: 'bg-slate-50 border-slate-200 text-slate-800' },
              { label: 'Under Review', count: appStats.underReviewCount, color: 'bg-purple-50 border-purple-200 text-purple-800' },
              { label: 'Shortlisted', count: appStats.shortlistedCount, color: 'bg-amber-50 border-amber-200 text-amber-800' },
              { label: 'Interview', count: appStats.interviewCount, color: 'bg-blue-50 border-blue-200 text-blue-800' },
              { label: 'Selected', count: appStats.selectedCount, color: 'bg-emerald-50 border-emerald-200 text-emerald-800' },
              { label: 'Rejected', count: appStats.rejectedCount, color: 'bg-rose-50 border-rose-200 text-rose-800' }
            ].map((stage, idx) => (
              <div key={idx} className={`p-4 rounded-xl border ${stage.color} text-center`}>
                <p className="text-2xl font-black">{stage.count || 0}</p>
                <p className="text-[11px] font-bold uppercase tracking-wider mt-1 opacity-80">{stage.label}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Recent Applicants Quick Review Table */}
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <div>
              <h2 className="text-base font-bold text-slate-900">Recent Candidates</h2>
              <p className="text-xs text-slate-500">Latest applicants across your internships & jobs</p>
            </div>
            <Link to="/company/applications" className="text-xs font-semibold text-indigo-600 hover:text-indigo-800">
              View All Candidates →
            </Link>
          </div>

          {stats?.recentApplicants?.length === 0 ? (
            <div className="py-10 text-center bg-slate-50 rounded-xl border border-dashed border-slate-200">
              <Users className="w-8 h-8 text-slate-400 mx-auto mb-2" />
              <p className="text-xs font-semibold text-slate-600">No applicants yet for your postings.</p>
              <Link to="/company/internships/new" className="inline-block mt-2 text-xs text-indigo-600 font-bold hover:underline">
                Post new opportunity
              </Link>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="border-b border-slate-200 text-slate-500 uppercase tracking-wider font-semibold">
                    <th className="pb-3">Candidate</th>
                    <th className="pb-3">Applied Role</th>
                    <th className="pb-3">College / Degree</th>
                    <th className="pb-3">CGPA</th>
                    <th className="pb-3">Status</th>
                    <th className="pb-3 text-right">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {stats?.recentApplicants?.map((cand) => (
                    <tr key={cand.application_id} className="hover:bg-slate-50">
                      <td className="py-3">
                        <div className="flex items-center gap-2.5">
                          <img
                            src={cand.student_avatar || `https://ui-avatars.com/api/?name=${encodeURIComponent(cand.student_name)}`}
                            alt={cand.student_name}
                            className="w-7 h-7 rounded-full object-cover"
                          />
                          <div>
                            <p className="font-bold text-slate-900">{cand.student_name}</p>
                            <p className="text-[10px] text-slate-400">{cand.student_email}</p>
                          </div>
                        </div>
                      </td>
                      <td className="py-3 font-semibold text-slate-800">{cand.opportunity_title}</td>
                      <td className="py-3 text-slate-600">{cand.college || 'Engineering College'}</td>
                      <td className="py-3 font-bold text-slate-900">{cand.cgpa ? `${cand.cgpa}` : 'N/A'}</td>
                      <td className="py-3">
                        <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                          cand.status === 'Selected' ? 'bg-emerald-100 text-emerald-800' :
                          cand.status === 'Interview' ? 'bg-blue-100 text-blue-800' :
                          cand.status === 'Shortlisted' ? 'bg-amber-100 text-amber-800' :
                          cand.status === 'Rejected' ? 'bg-rose-100 text-rose-800' :
                          'bg-slate-100 text-slate-700'
                        }`}>
                          {cand.status}
                        </span>
                      </td>
                      <td className="py-3 text-right">
                        <Link to="/company/applications" className="text-indigo-600 hover:text-indigo-900 font-bold">
                          Manage
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

export default CompanyDashboard;