import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import DashboardLayout from '../layouts/DashboardLayout';
import { useToast } from '../context/ToastContext';
import { internshipAPI, jobAPI } from '../services/api';
import {
  Briefcase,
  Award,
  PlusCircle,
  Users,
  Calendar,
  Trash2,
  ExternalLink,
  Loader2,
  Clock,
  CheckCircle2,
  MapPin
} from 'lucide-react';

const CompanyInternships = () => {
  const { success, error } = useToast();
  const [tab, setTab] = useState('internships');
  const [internships, setInternships] = useState([]);
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchData = async () => {
    setLoading(true);
    try {
      const [internshipsRes, jobsRes] = await Promise.all([
        internshipAPI.getCompanyInternships(),
        jobAPI.getCompanyJobs()
      ]);

      if (internshipsRes.success) setInternships(internshipsRes.data || []);
      if (jobsRes.success) setJobs(jobsRes.data || []);
    } catch (err) {
      error('Failed to load your postings.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleDeleteInternship = async (id) => {
    if (!window.confirm('Are you sure you want to delete this internship posting?')) return;
    try {
      await internshipAPI.delete(id);
      success('Internship deleted.');
      fetchData();
    } catch (err) {
      error('Failed to delete internship.');
    }
  };

  const handleDeleteJob = async (id) => {
    if (!window.confirm('Are you sure you want to delete this placement posting?')) return;
    try {
      await jobAPI.delete(id);
      success('Placement posting deleted.');
      fetchData();
    } catch (err) {
      error('Failed to delete placement role.');
    }
  };

  const list = tab === 'internships' ? internships : jobs;

  return (
    <DashboardLayout>
      <div className="space-y-6">

        {/* Header */}
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-xl font-bold text-slate-900">Manage Active Opportunities</h1>
            <p className="text-xs text-slate-500 mt-1">
              Track applicant inflow, edit postings, and manage application deadlines
            </p>
          </div>

          <div className="flex items-center gap-2">
            <Link
              to="/company/internships/new"
              className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs flex items-center gap-1.5 shadow-sm shadow-indigo-200 transition"
            >
              <PlusCircle className="w-4 h-4" /> Post Internship
            </Link>
            <Link
              to="/company/jobs/new"
              className="px-4 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs flex items-center gap-1.5 transition"
            >
              <PlusCircle className="w-4 h-4" /> Post Placement
            </Link>
          </div>
        </div>

        {/* Tab Switcher */}
        <div className="flex items-center gap-2 border-b border-slate-200 pb-2">
          <button
            onClick={() => setTab('internships')}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition ${
              tab === 'internships'
                ? 'bg-indigo-600 text-white shadow-sm'
                : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-50'
            }`}
          >
            <Briefcase className="w-4 h-4" /> Posted Internships ({internships.length})
          </button>
          <button
            onClick={() => setTab('jobs')}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition ${
              tab === 'jobs'
                ? 'bg-indigo-600 text-white shadow-sm'
                : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-50'
            }`}
          >
            <Award className="w-4 h-4" /> Posted Placement Drives ({jobs.length})
          </button>
        </div>

        {/* Postings List */}
        {loading ? (
          <div className="py-20 flex flex-col items-center justify-center">
            <Loader2 className="w-10 h-10 text-indigo-600 animate-spin mb-3" />
            <p className="text-xs font-semibold text-slate-500">Loading your postings...</p>
          </div>
        ) : list.length === 0 ? (
          <div className="py-16 text-center bg-white rounded-2xl border border-slate-200">
            <Briefcase className="w-10 h-10 text-slate-400 mx-auto mb-2" />
            <h3 className="text-base font-bold text-slate-800">No {tab} posted yet</h3>
            <p className="text-xs text-slate-500 mt-1">
              Start receiving candidate applications with explainable skill matching.
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {list.map((item) => (
              <div
                key={item.id}
                className="bg-white p-6 rounded-2xl border border-slate-200/80 hover:shadow-md transition-all flex flex-col md:flex-row md:items-center justify-between gap-6"
              >
                <div className="space-y-2 flex-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <h3 className="text-base font-bold text-slate-900">{item.title}</h3>
                    <span className="px-2 py-0.5 rounded text-[10px] uppercase font-bold bg-emerald-100 text-emerald-800">
                      {item.status}
                    </span>
                    <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-indigo-50 text-indigo-700">
                      {item.work_mode}
                    </span>
                  </div>

                  <div className="flex flex-wrap items-center gap-4 text-xs text-slate-500">
                    <span className="flex items-center gap-1"><MapPin className="w-3.5 h-3.5" /> {item.location}</span>
                    <span className="flex items-center gap-1 font-bold text-slate-800">
                      {tab === 'internships' ? `Stipend: ${item.stipend}` : `Package: ${item.salary_package}`}
                    </span>
                    <span className="flex items-center gap-1">
                      <Calendar className="w-3.5 h-3.5" /> Deadline: {new Date(item.deadline).toLocaleDateString()}
                    </span>
                  </div>

                  {/* Skills tags */}
                  <div className="flex flex-wrap gap-1.5 pt-1">
                    {item.skillsList?.map((sk, idx) => (
                      <span key={idx} className="px-2 py-0.5 rounded bg-slate-100 text-[11px] font-medium text-slate-700">
                        {sk}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Right stats and actions */}
                <div className="flex items-center justify-between md:justify-end gap-6 pt-4 md:pt-0 border-t md:border-t-0 border-slate-100">
                  <div className="text-center md:text-right">
                    <span className="text-xl font-black text-indigo-600">{item.applicant_count || 0}</span>
                    <p className="text-[11px] text-slate-400 uppercase font-bold tracking-wider">Applicants</p>
                  </div>

                  <div className="flex items-center gap-2">
                    <Link
                      to={`/company/applications?opportunityType=${tab === 'internships' ? 'internship' : 'job'}&opportunityId=${item.id}`}
                      className="px-3.5 py-2 rounded-xl bg-indigo-50 hover:bg-indigo-100 text-indigo-700 text-xs font-bold transition flex items-center gap-1"
                    >
                      <Users className="w-3.5 h-3.5" /> View Applicants
                    </Link>

                    <button
                      type="button"
                      onClick={() => tab === 'internships' ? handleDeleteInternship(item.id) : handleDeleteJob(item.id)}
                      className="p-2 rounded-xl text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition"
                      title="Delete posting"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

      </div>
    </DashboardLayout>
  );
};

export default CompanyInternships;