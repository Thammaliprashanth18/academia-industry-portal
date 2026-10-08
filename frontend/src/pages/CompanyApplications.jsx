import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import DashboardLayout from '../layouts/DashboardLayout';
import { useToast } from '../context/ToastContext';
import { companyAPI, applicationAPI } from '../services/api';
import {
  FileCheck,
  Search,
  Filter,
  Users,
  CheckCircle2,
  XCircle,
  Clock,
  Sparkles,
  ExternalLink,
  MessageSquare,
  Loader2,
  FileText,
  Building2,
  ChevronDown,
  UserCheck
} from 'lucide-react';

const CompanyApplications = () => {
  const [searchParams] = useSearchParams();
  const { success, error } = useToast();

  const [applicants, setApplicants] = useState([]);
  const [loading, setLoading] = useState(true);

  // Filters
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState(searchParams.get('status') || 'all');
  const [opportunityType, setOpportunityType] = useState(searchParams.get('opportunityType') || 'all');
  const [opportunityId, setOpportunityId] = useState(searchParams.get('opportunityId') || '');

  // Feedback Modal for Status Change
  const [showStatusModal, setShowStatusModal] = useState(false);
  const [selectedApp, setSelectedApp] = useState(null);
  const [targetStatus, setTargetStatus] = useState('');
  const [feedbackNotes, setFeedbackNotes] = useState('');
  const [updating, setUpdating] = useState(false);

  const fetchApplicants = async () => {
    setLoading(true);
    try {
      const params = {};
      if (statusFilter !== 'all') params.status = statusFilter;
      if (opportunityType !== 'all') params.opportunityType = opportunityType;
      if (opportunityId) params.opportunityId = opportunityId;
      if (search.trim()) params.search = search.trim();

      const res = await companyAPI.getApplicants(params);
      if (res.success) {
        setApplicants(res.data || []);
      }
    } catch (err) {
      error('Failed to load applicants.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchApplicants();
  }, [statusFilter, opportunityType, opportunityId]);

  const openStatusModal = (app, status) => {
    setSelectedApp(app);
    setTargetStatus(status);
    setFeedbackNotes(app.feedback || '');
    setShowStatusModal(true);
  };

  const handleUpdateStatus = async (e) => {
    e.preventDefault();
    if (!selectedApp || !targetStatus) return;

    setUpdating(true);
    try {
      await applicationAPI.updateStatus(selectedApp.application_id, {
        status: targetStatus,
        feedback: feedbackNotes.trim() || undefined
      });

      success(`Applicant status changed to "${targetStatus}". Student has been notified.`);
      setShowStatusModal(false);
      fetchApplicants();
    } catch (err) {
      error(err.message || 'Failed to update application status.');
    } finally {
      setUpdating(false);
    }
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case 'Selected':
        return 'bg-emerald-100 text-emerald-800 border-emerald-300';
      case 'Interview':
        return 'bg-blue-100 text-blue-800 border-blue-300';
      case 'Shortlisted':
        return 'bg-amber-100 text-amber-800 border-amber-300';
      case 'Under Review':
        return 'bg-purple-100 text-purple-800 border-purple-300';
      case 'Rejected':
        return 'bg-rose-100 text-rose-800 border-rose-300';
      default:
        return 'bg-slate-100 text-slate-700 border-slate-300';
    }
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">

        {/* Top Header */}
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <FileCheck className="w-5 h-5 text-indigo-600" />
              <h1 className="text-xl font-bold text-slate-900">Applicant Review Console</h1>
            </div>
            <p className="text-xs text-slate-500 mt-1">
              Review candidates, examine explainable skill compatibility, download resumes, and update recruitment status
            </p>
          </div>
          <span className="text-xs font-bold text-slate-500 bg-slate-100 px-3 py-1.5 rounded-xl">
            {applicants.length} Total Applicants
          </span>
        </div>

        {/* Filters */}
        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="relative w-full sm:w-72">
            <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && fetchApplicants()}
              placeholder="Search student, college, branch..."
              className="w-full pl-8 pr-3 py-1.5 border rounded-lg text-xs outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>

          <div className="flex items-center gap-2 w-full sm:w-auto">
            <select
              value={opportunityType}
              onChange={(e) => {
                setOpportunityType(e.target.value);
                setOpportunityId('');
              }}
              className="px-3 py-1.5 border rounded-lg text-xs outline-none text-slate-700 font-medium"
            >
              <option value="all">All Opportunities</option>
              <option value="internship">Internships</option>
              <option value="job">Placements</option>
            </select>

            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="px-3 py-1.5 border rounded-lg text-xs outline-none text-slate-700 font-medium"
            >
              <option value="all">All Statuses</option>
              <option value="Applied">Applied</option>
              <option value="Under Review">Under Review</option>
              <option value="Shortlisted">Shortlisted</option>
              <option value="Interview">Interview</option>
              <option value="Selected">Selected</option>
              <option value="Rejected">Rejected</option>
            </select>

            <button
              onClick={fetchApplicants}
              className="px-3 py-1.5 rounded-lg bg-indigo-600 text-white text-xs font-semibold hover:bg-indigo-700"
            >
              Filter
            </button>
          </div>
        </div>

        {/* Applicants List */}
        {loading ? (
          <div className="py-20 flex flex-col items-center justify-center">
            <Loader2 className="w-10 h-10 text-indigo-600 animate-spin mb-3" />
            <p className="text-xs font-semibold text-slate-500">Loading candidate applications...</p>
          </div>
        ) : applicants.length === 0 ? (
          <div className="py-16 text-center bg-white rounded-2xl border border-slate-200">
            <Users className="w-10 h-10 text-slate-400 mx-auto mb-2" />
            <h3 className="text-base font-bold text-slate-800">No applicants match your criteria</h3>
            <p className="text-xs text-slate-500 mt-1">Try clearing filters or checking other postings.</p>
          </div>
        ) : (
          <div className="space-y-4">
            {applicants.map((app) => (
              <div
                key={app.application_id}
                className="bg-white p-6 rounded-2xl border border-slate-200/80 hover:shadow-lg transition-all space-y-4"
              >
                {/* Candidate Header */}
                <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                  <div className="flex items-start gap-4">
                    <img
                      src={app.student_avatar || `https://ui-avatars.com/api/?name=${encodeURIComponent(app.student_name)}`}
                      alt={app.student_name}
                      className="w-12 h-12 rounded-xl object-cover ring-2 ring-indigo-100 shrink-0"
                    />

                    <div>
                      <div className="flex items-center gap-2">
                        <h3 className="text-base font-bold text-slate-900">{app.student_name}</h3>
                        <span className={`px-2.5 py-0.5 rounded-full text-xs font-extrabold border ${getStatusBadge(app.status)}`}>
                          {app.status}
                        </span>
                      </div>

                      <p className="text-xs text-slate-600 mt-0.5">
                        Applied for <span className="font-bold text-indigo-600">{app.opportunity_title}</span> ({app.opportunity_type})
                      </p>

                      <div className="flex flex-wrap items-center gap-3 text-[11px] text-slate-400 mt-1.5">
                        <span>{app.student_email}</span>
                        {app.phone && <span>• {app.phone}</span>}
                        <span>• {app.college || 'Engineering College'} ({app.degree} {app.branch ? `- ${app.branch}` : ''})</span>
                        {app.cgpa && <span className="font-bold text-slate-700">• CGPA: {app.cgpa}</span>}
                        {app.graduation_year && <span>• Class of {app.graduation_year}</span>}
                      </div>
                    </div>
                  </div>

                  {/* Skill Match Badge & Status Select */}
                  <div className="flex flex-wrap items-center gap-3">
                    <div className="text-right">
                      <span className={`inline-block px-3 py-1 rounded-full text-xs font-black ${
                        app.skillMatch?.matchPercentage >= 70 ? 'bg-emerald-100 text-emerald-800 border border-emerald-200' :
                        app.skillMatch?.matchPercentage >= 40 ? 'bg-amber-100 text-amber-800 border border-amber-200' :
                        'bg-slate-100 text-slate-800 border border-slate-200'
                      }`}>
                        <Sparkles className="w-3 h-3 inline mr-1" />
                        {app.skillMatch?.matchPercentage}% Skill Match
                      </span>
                      <p className="text-[10px] text-slate-400 mt-0.5">
                        {app.skillMatch?.matchedCount} of {app.skillMatch?.totalSkills} skills matched
                      </p>
                    </div>

                    {/* Change Status Action Dropdown */}
                    <div className="relative">
                      <select
                        value={app.status}
                        onChange={(e) => openStatusModal(app, e.target.value)}
                        className="px-3 py-1.5 bg-slate-50 hover:bg-slate-100 border border-slate-300 rounded-xl text-xs font-bold text-slate-800 outline-none cursor-pointer"
                      >
                        <option value="Applied">Applied</option>
                        <option value="Under Review">Under Review</option>
                        <option value="Shortlisted">Shortlisted</option>
                        <option value="Interview">Interview</option>
                        <option value="Selected">Selected</option>
                        <option value="Rejected">Rejected</option>
                      </select>
                    </div>
                  </div>
                </div>

                {/* Candidate Cover Letter */}
                {app.cover_letter && (
                  <div className="p-3 bg-slate-50 rounded-xl border border-slate-100 text-xs text-slate-700 leading-relaxed">
                    <span className="font-bold text-slate-900 block mb-1">Candidate Note:</span>
                    "{app.cover_letter}"
                  </div>
                )}

                {/* Skills Tags Comparison */}
                <div className="p-3 bg-indigo-50/40 rounded-xl border border-indigo-100/70 text-xs flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div className="flex flex-wrap items-center gap-1.5">
                    <span className="text-[11px] font-bold text-indigo-900 mr-1">Matching Skills:</span>
                    {app.skillMatch?.matchedSkills?.length === 0 ? (
                      <span className="text-[11px] text-slate-400">None matched</span>
                    ) : (
                      app.skillMatch.matchedSkills.map((sk, idx) => (
                        <span key={idx} className="px-2 py-0.5 rounded bg-emerald-100 text-emerald-800 text-[10px] font-bold">
                          ✓ {sk}
                        </span>
                      ))
                    )}

                    {app.skillMatch?.missingSkills?.length > 0 && (
                      <>
                        <span className="text-[11px] font-bold text-slate-500 ml-2 mr-1">Missing:</span>
                        {app.skillMatch.missingSkills.map((sk, idx) => (
                          <span key={idx} className="px-2 py-0.5 rounded bg-slate-100 text-slate-600 text-[10px]">
                            {sk}
                          </span>
                        ))}
                      </>
                    )}
                  </div>

                  {/* Resume View / Download */}
                  {app.resume_url && (
                    <a
                      href={`http://localhost:5000${app.resume_url}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="px-3 py-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold flex items-center gap-1.5 shrink-0 transition"
                    >
                      <FileText className="w-3.5 h-3.5" /> View Resume
                    </a>
                  )}
                </div>

                {/* Recruiter notes if existing */}
                {app.feedback && (
                  <div className="text-xs text-slate-500 italic">
                    Recruiter note: "{app.feedback}"
                  </div>
                )}

              </div>
            ))}
          </div>
        )}

      </div>

      {/* Status Change & Feedback Modal */}
      {showStatusModal && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 sm:p-8 shadow-2xl space-y-4 animate-in fade-in-50 zoom-in-95">
            <h3 className="text-lg font-bold text-slate-900">
              Update Status to <span className="text-indigo-600">"{targetStatus}"</span>
            </h3>
            <p className="text-xs text-slate-500">
              Updating status for candidate <span className="font-bold text-slate-800">{selectedApp?.student_name}</span>. An automated notification will be sent to the student.
            </p>

            <form onSubmit={handleUpdateStatus} className="space-y-4 pt-2">
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                  Recruiter Feedback / Interview Notes (Optional)
                </label>
                <textarea
                  rows="3"
                  value={feedbackNotes}
                  onChange={(e) => setFeedbackNotes(e.target.value)}
                  placeholder="e.g. Profile shortlisted for Round 1 Technical Interview on Monday at 11 AM..."
                  className="w-full px-3 py-2 border rounded-xl text-xs outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowStatusModal(false)}
                  className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-600 hover:bg-slate-100"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={updating}
                  className="px-5 py-2.5 rounded-xl text-xs font-bold bg-indigo-600 text-white hover:bg-indigo-700 flex items-center gap-2 disabled:opacity-50"
                >
                  {updating ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Confirm Status Update'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </DashboardLayout>
  );
};

export default CompanyApplications;