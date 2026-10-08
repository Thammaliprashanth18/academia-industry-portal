import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import DashboardLayout from '../layouts/DashboardLayout';
import { useToast } from '../context/ToastContext';
import { applicationAPI } from '../services/api';
import {
  FileCheck,
  Building2,
  Calendar,
  Clock,
  CheckCircle2,
  AlertCircle,
  XCircle,
  Loader2,
  Trash2,
  ExternalLink,
  MessageSquare,
  Search,
  Filter
} from 'lucide-react';

const Applications = () => {
  const { success, error } = useToast();

  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState('all');
  const [typeFilter, setTypeFilter] = useState('all');
  const [search, setSearch] = useState('');

  const fetchApplications = async () => {
    setLoading(true);
    try {
      const params = {};
      if (statusFilter !== 'all') params.status = statusFilter;
      if (typeFilter !== 'all') params.type = typeFilter;

      const res = await applicationAPI.getMyApplications(params);
      if (res.success) {
        setApplications(res.data || []);
      }
    } catch (err) {
      error('Failed to load applications.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchApplications();
  }, [statusFilter, typeFilter]);

  const handleWithdraw = async (id) => {
    if (!window.confirm('Are you sure you want to withdraw this application?')) return;

    try {
      await applicationAPI.withdraw(id);
      success('Application withdrawn.');
      fetchApplications();
    } catch (err) {
      error(err.message || 'Failed to withdraw application.');
    }
  };

  const filtered = applications.filter((app) => {
    if (!search.trim()) return true;
    const q = search.toLowerCase();
    return (
      app.title?.toLowerCase().includes(q) ||
      app.company_name?.toLowerCase().includes(q) ||
      app.location?.toLowerCase().includes(q)
    );
  });

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
              <h1 className="text-xl font-bold text-slate-900">My Application Tracker</h1>
            </div>
            <p className="text-xs text-slate-500 mt-1">
              Monitor real-time recruiter reviews, interview invitations, and feedback
            </p>
          </div>

          <div className="flex items-center gap-2">
            <Link
              to="/internships"
              className="px-4 py-2 rounded-xl bg-indigo-50 hover:bg-indigo-100 text-indigo-700 text-xs font-semibold transition"
            >
              Browse Internships
            </Link>
            <Link
              to="/jobs"
              className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold transition shadow-sm"
            >
              Browse Placements
            </Link>
          </div>
        </div>

        {/* Filters and Search */}
        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="relative w-full sm:w-64">
            <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search applications..."
              className="w-full pl-8 pr-3 py-1.5 border rounded-lg text-xs outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>

          <div className="flex items-center gap-2 w-full sm:w-auto">
            <select
              value={typeFilter}
              onChange={(e) => setTypeFilter(e.target.value)}
              className="px-3 py-1.5 border rounded-lg text-xs outline-none text-slate-700 font-medium"
            >
              <option value="all">All Types</option>
              <option value="internship">Internships Only</option>
              <option value="job">Placements Only</option>
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
          </div>
        </div>

        {/* Applications List */}
        {loading ? (
          <div className="py-20 flex flex-col items-center justify-center">
            <Loader2 className="w-10 h-10 text-indigo-600 animate-spin mb-3" />
            <p className="text-xs font-semibold text-slate-500">Loading your applications...</p>
          </div>
        ) : filtered.length === 0 ? (
          <div className="py-16 text-center bg-white rounded-2xl border border-slate-200">
            <FileCheck className="w-10 h-10 text-slate-400 mx-auto mb-2" />
            <h3 className="text-base font-bold text-slate-800">No applications found</h3>
            <p className="text-xs text-slate-500 mt-1">
              Apply for internships or placement opportunities to start tracking your progress.
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {filtered.map((app) => (
              <div
                key={app.id}
                className="bg-white p-6 rounded-2xl border border-slate-200/80 hover:shadow-md transition-all space-y-4"
              >
                <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 rounded-xl bg-slate-100 p-2 border border-slate-200 flex items-center justify-center shrink-0">
                      {app.company_logo ? (
                        <img src={app.company_logo} alt={app.company_name} className="max-h-full object-contain" />
                      ) : (
                        <Building2 className="w-6 h-6 text-slate-500" />
                      )}
                    </div>

                    <div>
                      <div className="flex items-center gap-2">
                        <h3 className="text-base font-bold text-slate-900">{app.title}</h3>
                        <span className="px-2 py-0.5 rounded text-[10px] uppercase font-bold bg-slate-100 text-slate-600">
                          {app.opportunity_type}
                        </span>
                      </div>
                      <p className="text-xs font-semibold text-indigo-600">{app.company_name} • {app.location}</p>
                      <p className="text-[11px] text-slate-400 mt-1">
                        Applied on {new Date(app.applied_at).toLocaleDateString()} • {app.compensation}
                      </p>
                    </div>
                  </div>

                  {/* Status Badge */}
                  <div className="flex sm:flex-col items-center sm:items-end justify-between gap-2">
                    <span className={`px-3 py-1 rounded-full text-xs font-extrabold border ${getStatusBadge(app.status)}`}>
                      {app.status}
                    </span>
                    {app.status === 'Applied' && (
                      <button
                        onClick={() => handleWithdraw(app.id)}
                        className="text-xs text-slate-400 hover:text-rose-600 transition flex items-center gap-1"
                      >
                        <Trash2 className="w-3.5 h-3.5" /> Withdraw
                      </button>
                    )}
                  </div>
                </div>

                {/* Recruiter Feedback Banner if available */}
                {app.feedback && (
                  <div className="p-3.5 rounded-xl bg-indigo-50/70 border border-indigo-100 text-xs text-indigo-950 flex items-start gap-2.5">
                    <MessageSquare className="w-4 h-4 text-indigo-600 shrink-0 mt-0.5" />
                    <div>
                      <span className="font-bold block text-indigo-900">Recruiter Feedback / Next Steps:</span>
                      <p className="mt-0.5 text-slate-700 leading-relaxed">{app.feedback}</p>
                    </div>
                  </div>
                )}

                {/* View Original Listing Link */}
                <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-xs">
                  <span className="text-slate-400">
                    Last updated: {new Date(app.updated_at).toLocaleDateString()}
                  </span>
                  <Link
                    to={app.opportunity_type === 'internship' ? `/student/internship/${app.opportunity_id}` : `/jobs/${app.opportunity_id}`}
                    className="text-indigo-600 hover:text-indigo-800 font-semibold inline-flex items-center gap-1"
                  >
                    View Opportunity Details <ExternalLink className="w-3 h-3" />
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}

      </div>
    </DashboardLayout>
  );
};

export default Applications;