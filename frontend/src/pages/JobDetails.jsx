import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import { jobAPI, applicationAPI, studentAPI } from '../services/api';
import {
  Award,
  Building2,
  MapPin,
  Clock,
  Calendar,
  DollarSign,
  Users,
  CheckCircle2,
  XCircle,
  Sparkles,
  ArrowLeft,
  Loader2,
  FileText,
  ExternalLink,
  Briefcase
} from 'lucide-react';

const JobDetails = () => {
  const { id } = useParams();
  const { user, isAuthenticated } = useAuth();
  const { success, error } = useToast();
  const navigate = useNavigate();

  const [job, setJob] = useState(null);
  const [loading, setLoading] = useState(true);

  // Apply modal state
  const [showApplyModal, setShowApplyModal] = useState(false);
  const [coverLetter, setCoverLetter] = useState('');
  const [studentResume, setStudentResume] = useState(null);
  const [submitting, setSubmitting] = useState(false);

  const fetchDetails = async () => {
    try {
      const res = await jobAPI.getById(id);
      if (res.success) {
        setJob(res.data);
      }
    } catch (err) {
      error('Failed to load placement details.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDetails();
    if (isAuthenticated && user?.role === 'student') {
      studentAPI.getProfile().then(res => {
        if (res.success) setStudentResume(res.data.resume_url);
      }).catch(() => {});
    }
  }, [id, isAuthenticated]);

  const handleApply = async (e) => {
    e.preventDefault();
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }

    if (user.role !== 'student') {
      error('Only students can apply for placement opportunities.');
      return;
    }

    setSubmitting(true);
    try {
      await applicationAPI.apply({
        opportunityType: 'job',
        opportunityId: id,
        coverLetter,
        resumeUrl: studentResume
      });

      success('Placement application submitted successfully!');
      setShowApplyModal(false);
      fetchDetails();
    } catch (err) {
      error(err.message || 'Failed to submit application.');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 flex flex-col justify-between">
        <Navbar />
        <div className="py-20 flex flex-col items-center justify-center">
          <Loader2 className="w-10 h-10 text-indigo-600 animate-spin mb-3" />
          <p className="text-xs font-semibold text-slate-500">Loading placement details...</p>
        </div>
        <Footer />
      </div>
    );
  }

  if (!job) {
    return (
      <div className="min-h-screen bg-slate-50 flex flex-col justify-between">
        <Navbar />
        <div className="max-w-xl mx-auto py-20 text-center px-4">
          <h2 className="text-xl font-bold text-slate-900">Placement Role Not Found</h2>
          <p className="text-xs text-slate-500 mt-2">This placement opportunity may have expired or been removed.</p>
          <Link to="/jobs" className="inline-block mt-4 text-xs font-bold text-indigo-600 hover:underline">
            Back to All Placements
          </Link>
        </div>
        <Footer />
      </div>
    );
  }

  const match = job.skillMatch || { matchPercentage: 0, matchedSkills: [], missingSkills: [] };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col justify-between">
      <Navbar />

      <main className="max-w-5xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 flex-1 space-y-6">
        
        <Link to="/jobs" className="inline-flex items-center gap-1 text-xs font-bold text-slate-500 hover:text-indigo-600 transition">
          <ArrowLeft className="w-4 h-4" /> Back to Placement Opportunities
        </Link>

        {/* Header Hero */}
        <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200/80 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="flex items-start gap-5">
            <div className="w-16 h-16 rounded-2xl bg-slate-100 p-3 border border-slate-200 flex items-center justify-center shrink-0">
              {job.company_logo ? (
                <img src={job.company_logo} alt={job.company_name} className="max-h-full object-contain" />
              ) : (
                <Building2 className="w-8 h-8 text-slate-500" />
              )}
            </div>

            <div>
              <div className="flex flex-wrap items-center gap-2 mb-1">
                <h1 className="text-xl sm:text-2xl font-black text-slate-900">{job.title}</h1>
                <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-indigo-50 text-indigo-700 border border-indigo-200">
                  {job.work_mode}
                </span>
              </div>
              <p className="text-sm font-semibold text-indigo-600">{job.company_name}</p>
              
              <div className="flex flex-wrap items-center gap-4 text-xs text-slate-500 mt-3">
                <span className="flex items-center gap-1"><MapPin className="w-3.5 h-3.5" /> {job.location}</span>
                <span className="flex items-center gap-1 font-bold text-slate-800"><DollarSign className="w-3.5 h-3.5 text-emerald-600" /> {job.salary_package}</span>
                <span className="flex items-center gap-1"><Briefcase className="w-3.5 h-3.5" /> {job.experience}</span>
                <span className="flex items-center gap-1"><Calendar className="w-3.5 h-3.5" /> Deadline: {new Date(job.deadline).toLocaleDateString()}</span>
              </div>
            </div>
          </div>

          {/* Action / Applied Button */}
          <div className="flex flex-col sm:items-end gap-2 shrink-0">
            {job.hasApplied ? (
              <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-2xl text-center sm:text-right">
                <span className="text-xs font-bold text-emerald-800 flex items-center gap-1 justify-center sm:justify-end">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" /> Application Submitted
                </span>
                <p className="text-[11px] text-emerald-700 font-medium mt-0.5">
                  Status: <span className="font-bold uppercase">{job.applicationData?.status}</span>
                </p>
                <Link to="/student/applications" className="text-[11px] font-bold text-emerald-800 hover:underline block mt-1">
                  Track in Applications →
                </Link>
              </div>
            ) : (
              <button
                onClick={() => {
                  if (!isAuthenticated) navigate('/login');
                  else setShowApplyModal(true);
                }}
                className="px-6 py-3 rounded-2xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-sm shadow-lg shadow-indigo-200 transition"
              >
                Apply for Placement
              </button>
            )}
            <span className="text-[11px] text-slate-400 font-medium">{job.applicant_count || 0} applicants</span>
          </div>
        </div>

        {/* Explainable Skill Match Breakdown */}
        {user?.role === 'student' && (
          <div className="bg-gradient-to-r from-indigo-50 to-violet-50 p-6 rounded-2xl border border-indigo-100 shadow-sm space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <div className="flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-indigo-600" />
                <h3 className="text-base font-bold text-indigo-950">Placement Skill Match Intelligence</h3>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-xs text-indigo-900 font-medium">Profile Fit:</span>
                <span className={`px-3 py-1 rounded-full text-xs font-black ${
                  match.matchPercentage >= 70 ? 'bg-emerald-200 text-emerald-900' :
                  match.matchPercentage >= 40 ? 'bg-amber-200 text-amber-900' :
                  'bg-slate-200 text-slate-900'
                }`}>
                  {match.matchPercentage}% Compatible
                </span>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
              <div className="p-3.5 bg-white/80 rounded-xl border border-indigo-100">
                <p className="text-xs font-bold text-emerald-700 mb-2 flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" /> Matching Skills ({match.matchedSkills?.length || 0})
                </p>
                <div className="flex flex-wrap gap-1.5">
                  {match.matchedSkills?.length === 0 ? (
                    <span className="text-xs text-slate-400">None yet matched</span>
                  ) : (
                    match.matchedSkills.map((sk, idx) => (
                      <span key={idx} className="px-2.5 py-1 rounded-lg bg-emerald-50 text-emerald-800 text-xs font-semibold border border-emerald-200">
                        ✓ {sk}
                      </span>
                    ))
                  )}
                </div>
              </div>

              <div className="p-3.5 bg-white/80 rounded-xl border border-indigo-100">
                <p className="text-xs font-bold text-amber-700 mb-2 flex items-center gap-1.5">
                  <XCircle className="w-4 h-4 text-amber-600" /> Missing Required Skills ({match.missingSkills?.length || 0})
                </p>
                <div className="flex flex-wrap gap-1.5">
                  {match.missingSkills?.length === 0 ? (
                    <span className="text-xs text-emerald-600 font-semibold">Complete skill match!</span>
                  ) : (
                    match.missingSkills.map((sk, idx) => (
                      <span key={idx} className="px-2.5 py-1 rounded-lg bg-amber-50 text-amber-800 text-xs font-semibold border border-amber-200">
                        + {sk}
                      </span>
                    ))
                  )}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Content Details */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
            <div className="bg-white p-6 sm:p-8 rounded-2xl border border-slate-200 shadow-sm space-y-3">
              <h2 className="text-base font-bold text-slate-900">Role Overview</h2>
              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed whitespace-pre-line">
                {job.description}
              </p>
            </div>

            {job.requirements && (
              <div className="bg-white p-6 sm:p-8 rounded-2xl border border-slate-200 shadow-sm space-y-3">
                <h2 className="text-base font-bold text-slate-900">Requirements & Candidate Profile</h2>
                <div className="text-xs sm:text-sm text-slate-600 leading-relaxed whitespace-pre-line">
                  {job.requirements}
                </div>
              </div>
            )}

            <div className="bg-white p-6 sm:p-8 rounded-2xl border border-slate-200 shadow-sm space-y-2">
              <h2 className="text-base font-bold text-slate-900">Eligibility & Experience</h2>
              <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 text-xs space-y-1.5">
                <p><span className="font-bold text-slate-800">Target Degrees:</span> {job.eligibility}</p>
                <p><span className="font-bold text-slate-800">Experience:</span> {job.experience}</p>
                <p><span className="font-bold text-slate-800">Open Vacancies:</span> {job.openings}</p>
              </div>
            </div>
          </div>

          <div className="space-y-6">
            <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-3">
              <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider">Required Skills</h3>
              <div className="flex flex-wrap gap-2">
                {job.skills?.map((sk) => (
                  <span key={sk.id} className="px-3 py-1 rounded-xl bg-slate-100 text-slate-800 text-xs font-semibold">
                    {sk.name}
                  </span>
                ))}
              </div>
            </div>

            <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-3">
              <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider">About Company</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                {job.company_description || 'A verified enterprise recruiting campus talent.'}
              </p>
              {job.company_website && (
                <a
                  href={job.company_website}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-1.5 text-xs font-bold text-indigo-600 hover:text-indigo-800 pt-2"
                >
                  Visit Company Website <ExternalLink className="w-3.5 h-3.5" />
                </a>
              )}
            </div>
          </div>
        </div>

      </main>

      {/* Apply Modal */}
      {showApplyModal && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 sm:p-8 shadow-2xl space-y-4 animate-in fade-in-50 zoom-in-95">
            <h2 className="text-lg font-bold text-slate-900">Apply for {job.title}</h2>
            <p className="text-xs text-slate-500">Your student profile and skills will be submitted directly to {job.company_name}.</p>

            <form onSubmit={handleApply} className="space-y-4 pt-2">
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                  Cover Letter / Introduction Note
                </label>
                <textarea
                  rows="4"
                  value={coverLetter}
                  onChange={(e) => setCoverLetter(e.target.value)}
                  placeholder="Introduce yourself, discuss relevant projects, and explain why you're passionate about this full-time role..."
                  required
                  className="w-full px-3 py-2 border rounded-xl text-xs outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>

              <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 text-xs">
                <span className="font-bold text-slate-700 block mb-1">Attached Resume:</span>
                {studentResume ? (
                  <span className="text-emerald-700 font-semibold flex items-center gap-1">
                    <CheckCircle2 className="w-3.5 h-3.5" /> Profile Resume Attached
                  </span>
                ) : (
                  <span className="text-amber-700 font-semibold">
                    No resume found on profile. You can still apply or upload in Profile.
                  </span>
                )}
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowApplyModal(false)}
                  className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-600 hover:bg-slate-100"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="px-5 py-2.5 rounded-xl text-xs font-bold bg-indigo-600 text-white hover:bg-indigo-700 flex items-center gap-2 disabled:opacity-50"
                >
                  {submitting ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Confirm & Submit Application'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      <Footer />
    </div>
  );
};

export default JobDetails;
