import React, { useState, useEffect } from 'react';
import DashboardLayout from '../layouts/DashboardLayout';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import { studentAPI } from '../services/api';
import {
  User,
  School,
  FileText,
  Sparkles,
  Upload,
  Plus,
  Trash2,
  ExternalLink,
  Code2,
  Globe,
  MapPin,
  Phone,
  Mail,
  Loader2,
  Award,
  BookOpen,
  CheckCircle2
} from 'lucide-react';

const StudentProfile = () => {
  const { user, refreshUser } = useAuth();
  const { success, error } = useToast();

  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [resumeUploading, setResumeUploading] = useState(false);

  // Edit form state
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    college: '',
    degree: '',
    branch: '',
    graduation_year: '',
    cgpa: '',
    location: '',
    bio: '',
    github_url: '',
    linkedin_url: ''
  });

  // Modals
  const [showEduModal, setShowEduModal] = useState(false);
  const [eduForm, setEduForm] = useState({
    institution: '',
    degree: '',
    field_of_study: '',
    start_year: 2022,
    end_year: 2026,
    score_or_grade: ''
  });

  const [showProjModal, setShowProjModal] = useState(false);
  const [projForm, setProjForm] = useState({
    title: '',
    description: '',
    technologies: '',
    project_url: '',
    github_repo: ''
  });

  const [showCertModal, setShowCertModal] = useState(false);
  const [certForm, setCertForm] = useState({
    title: '',
    issuing_organization: '',
    issue_date: '',
    credential_id: '',
    credential_url: ''
  });

  const fetchProfile = async () => {
    try {
      const res = await studentAPI.getProfile();
      if (res.success) {
        setProfile(res.data);
        setFormData({
          name: res.data.name || '',
          phone: res.data.phone || '',
          college: res.data.college || '',
          degree: res.data.degree || '',
          branch: res.data.branch || '',
          graduation_year: res.data.graduation_year || '',
          cgpa: res.data.cgpa || '',
          location: res.data.location || '',
          bio: res.data.bio || '',
          github_url: res.data.github_url || '',
          linkedin_url: res.data.linkedin_url || ''
        });
      }
    } catch (err) {
      error('Failed to load profile.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProfile();
  }, []);

  const handleInputChange = (e) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSaveProfile = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      await studentAPI.updateProfile(formData);
      success('Profile details saved successfully!');
      fetchProfile();
      refreshUser();
    } catch (err) {
      error(err.message || 'Failed to update profile.');
    } finally {
      setSaving(false);
    }
  };

  const handleResumeUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const data = new FormData();
    data.append('resume', file);

    setResumeUploading(true);
    try {
      const res = await studentAPI.uploadResume(data);
      success('Resume uploaded successfully!');
      fetchProfile();
    } catch (err) {
      error(err.message || 'Failed to upload resume.');
    } finally {
      setResumeUploading(false);
    }
  };

  const handleAddEducation = async (e) => {
    e.preventDefault();
    try {
      await studentAPI.addEducation(eduForm);
      success('Education entry added.');
      setShowEduModal(false);
      setEduForm({ institution: '', degree: '', field_of_study: '', start_year: 2022, end_year: 2026, score_or_grade: '' });
      fetchProfile();
    } catch (err) {
      error(err.message || 'Failed to add education.');
    }
  };

  const handleDeleteEducation = async (id) => {
    try {
      await studentAPI.deleteEducation(id);
      success('Education entry removed.');
      fetchProfile();
    } catch (err) {
      error('Failed to delete education.');
    }
  };

  const handleAddProject = async (e) => {
    e.preventDefault();
    try {
      await studentAPI.addProject(projForm);
      success('Project added to portfolio.');
      setShowProjModal(false);
      setProjForm({ title: '', description: '', technologies: '', project_url: '', github_repo: '' });
      fetchProfile();
    } catch (err) {
      error(err.message || 'Failed to add project.');
    }
  };

  const handleDeleteProject = async (id) => {
    try {
      await studentAPI.deleteProject(id);
      success('Project removed.');
      fetchProfile();
    } catch (err) {
      error('Failed to delete project.');
    }
  };

  const handleAddCertification = async (e) => {
    e.preventDefault();
    try {
      await studentAPI.addCertification(certForm);
      success('Certification added.');
      setShowCertModal(false);
      setCertForm({ title: '', issuing_organization: '', issue_date: '', credential_id: '', credential_url: '' });
      fetchProfile();
    } catch (err) {
      error(err.message || 'Failed to add certification.');
    }
  };

  const handleDeleteCertification = async (id) => {
    try {
      await studentAPI.deleteCertification(id);
      success('Certification removed.');
      fetchProfile();
    } catch (err) {
      error('Failed to delete certification.');
    }
  };

  if (loading) {
    return (
      <DashboardLayout>
        <div className="py-20 flex flex-col items-center justify-center">
          <Loader2 className="w-10 h-10 text-indigo-600 animate-spin mb-3" />
          <p className="text-sm font-medium text-slate-500">Loading student profile...</p>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="space-y-6">

        {/* Top Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
          <div className="flex items-center gap-4">
            <img
              src={profile?.avatar_url || `https://ui-avatars.com/api/?name=${encodeURIComponent(profile?.name || 'Student')}`}
              alt={profile?.name}
              className="w-16 h-16 rounded-2xl object-cover ring-4 ring-indigo-50"
            />
            <div>
              <h1 className="text-xl font-bold text-slate-900">{profile?.name}</h1>
              <p className="text-xs text-slate-500">{profile?.email} • {profile?.college || 'National Institute'}</p>
              <div className="flex items-center gap-2 mt-1">
                <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-indigo-100 text-indigo-700">
                  {profile?.degree || 'B.Tech'} - {profile?.branch || 'Computer Science'}
                </span>
                {profile?.cgpa && (
                  <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-100 text-emerald-800">
                    CGPA: {profile?.cgpa}
                  </span>
                )}
              </div>
            </div>
          </div>

          {/* Resume Quick Widget */}
          <div className="flex flex-col sm:items-end gap-2">
            <div className="flex items-center gap-2">
              <label className="cursor-pointer px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold flex items-center gap-2 transition shadow-sm shadow-indigo-200">
                {resumeUploading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Upload className="w-4 h-4" />}
                <span>{profile?.resume_url ? 'Replace Resume' : 'Upload Resume'}</span>
                <input type="file" accept=".pdf,.doc,.docx" onChange={handleResumeUpload} className="hidden" />
              </label>
              {profile?.resume_url && (
                <a
                  href={`http://localhost:5000${profile.resume_url}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-3 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold flex items-center gap-1.5 transition"
                >
                  <FileText className="w-4 h-4 text-slate-500" /> View Resume
                </a>
              )}
            </div>
            <p className="text-[11px] text-slate-400">Supported formats: PDF, DOC, DOCX (Max 10MB)</p>
          </div>
        </div>

        {/* Profile Details Edit Form */}
        <form onSubmit={handleSaveProfile} className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-6">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <div>
              <h2 className="text-base font-bold text-slate-900">Personal & Academic Details</h2>
              <p className="text-xs text-slate-500">Keep this up-to-date so recruiters find your profile</p>
            </div>
            <button
              type="submit"
              disabled={saving}
              className="px-5 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold transition disabled:opacity-50 flex items-center gap-2"
            >
              {saving ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <CheckCircle2 className="w-3.5 h-3.5" />}
              Save Changes
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Full Name</label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border rounded-xl text-xs focus:ring-2 focus:ring-indigo-500 outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Phone Number</label>
              <input
                type="text"
                name="phone"
                value={formData.phone}
                onChange={handleInputChange}
                placeholder="+91 98765 43210"
                className="w-full px-3 py-2 border rounded-xl text-xs focus:ring-2 focus:ring-indigo-500 outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Location</label>
              <input
                type="text"
                name="location"
                value={formData.location}
                onChange={handleInputChange}
                placeholder="e.g. Bengaluru, India"
                className="w-full px-3 py-2 border rounded-xl text-xs focus:ring-2 focus:ring-indigo-500 outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase mb-1">College / University</label>
              <input
                type="text"
                name="college"
                value={formData.college}
                onChange={handleInputChange}
                placeholder="e.g. National Institute of Technology"
                className="w-full px-3 py-2 border rounded-xl text-xs focus:ring-2 focus:ring-indigo-500 outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Degree</label>
              <input
                type="text"
                name="degree"
                value={formData.degree}
                onChange={handleInputChange}
                placeholder="e.g. B.Tech, M.Tech, MCA"
                className="w-full px-3 py-2 border rounded-xl text-xs focus:ring-2 focus:ring-indigo-500 outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Branch / Major</label>
              <input
                type="text"
                name="branch"
                value={formData.branch}
                onChange={handleInputChange}
                placeholder="e.g. Computer Science and Engineering"
                className="w-full px-3 py-2 border rounded-xl text-xs focus:ring-2 focus:ring-indigo-500 outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Graduation Year</label>
              <input
                type="number"
                name="graduation_year"
                value={formData.graduation_year}
                onChange={handleInputChange}
                placeholder="2026"
                className="w-full px-3 py-2 border rounded-xl text-xs focus:ring-2 focus:ring-indigo-500 outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase mb-1">CGPA / Percentage</label>
              <input
                type="number"
                step="0.01"
                name="cgpa"
                value={formData.cgpa}
                onChange={handleInputChange}
                placeholder="e.g. 8.92"
                className="w-full px-3 py-2 border rounded-xl text-xs focus:ring-2 focus:ring-indigo-500 outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase mb-1">GitHub Profile URL</label>
              <input
                type="url"
                name="github_url"
                value={formData.github_url}
                onChange={handleInputChange}
                placeholder="https://github.com/username"
                className="w-full px-3 py-2 border rounded-xl text-xs focus:ring-2 focus:ring-indigo-500 outline-none"
              />
            </div>

            <div className="sm:col-span-2 lg:col-span-3">
              <label className="block text-xs font-bold text-slate-700 uppercase mb-1">LinkedIn Profile URL</label>
              <input
                type="url"
                name="linkedin_url"
                value={formData.linkedin_url}
                onChange={handleInputChange}
                placeholder="https://linkedin.com/in/username"
                className="w-full px-3 py-2 border rounded-xl text-xs focus:ring-2 focus:ring-indigo-500 outline-none"
              />
            </div>

            <div className="sm:col-span-2 lg:col-span-3">
              <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Professional Bio</label>
              <textarea
                name="bio"
                rows="3"
                value={formData.bio}
                onChange={handleInputChange}
                placeholder="A short summary of your career objectives, technical focus, and aspirations..."
                className="w-full px-3 py-2 border rounded-xl text-xs focus:ring-2 focus:ring-indigo-500 outline-none"
              />
            </div>
          </div>
        </form>

        {/* Education Section */}
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <div className="flex items-center gap-2">
              <School className="w-5 h-5 text-indigo-600" />
              <h2 className="text-base font-bold text-slate-900">Education Background</h2>
            </div>
            <button
              type="button"
              onClick={() => setShowEduModal(true)}
              className="px-3 py-1.5 rounded-lg bg-indigo-50 hover:bg-indigo-100 text-indigo-700 text-xs font-bold flex items-center gap-1 transition"
            >
              <Plus className="w-3.5 h-3.5" /> Add Education
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {profile?.education?.map((edu) => (
              <div key={edu.id} className="p-4 rounded-xl border border-slate-200/80 flex justify-between items-start">
                <div>
                  <h4 className="text-sm font-bold text-slate-900">{edu.institution}</h4>
                  <p className="text-xs text-slate-600 font-medium">{edu.degree} {edu.field_of_study ? `in ${edu.field_of_study}` : ''}</p>
                  <p className="text-[11px] text-slate-400 mt-1">
                    {edu.start_year} - {edu.end_year || 'Present'} • {edu.score_or_grade}
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => handleDeleteEducation(edu.id)}
                  className="text-slate-400 hover:text-rose-600 p-1"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* Projects Section */}
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <div className="flex items-center gap-2">
              <BookOpen className="w-5 h-5 text-indigo-600" />
              <h2 className="text-base font-bold text-slate-900">Projects & Portfolios</h2>
            </div>
            <button
              type="button"
              onClick={() => setShowProjModal(true)}
              className="px-3 py-1.5 rounded-lg bg-indigo-50 hover:bg-indigo-100 text-indigo-700 text-xs font-bold flex items-center gap-1 transition"
            >
              <Plus className="w-3.5 h-3.5" /> Add Project
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {profile?.projects?.map((proj) => (
              <div key={proj.id} className="p-4 rounded-xl border border-slate-200/80 flex flex-col justify-between">
                <div>
                  <div className="flex items-start justify-between">
                    <h4 className="text-sm font-bold text-slate-900">{proj.title}</h4>
                    <button
                      type="button"
                      onClick={() => handleDeleteProject(proj.id)}
                      className="text-slate-400 hover:text-rose-600 p-1"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                  <p className="text-xs text-slate-600 mt-1 leading-relaxed">{proj.description}</p>
                  {proj.technologies && (
                    <p className="text-[11px] font-semibold text-indigo-600 mt-2">
                      Stack: {proj.technologies}
                    </p>
                  )}
                </div>
                <div className="flex items-center gap-3 mt-3 pt-3 border-t border-slate-100">
                  {proj.github_repo && (
                    <a href={proj.github_repo} target="_blank" rel="noreferrer" className="text-xs text-slate-600 hover:text-slate-900 flex items-center gap-1">
                      <Code2 className="w-3.5 h-3.5" /> Code Repo
                    </a>
                  )}
                  {proj.project_url && (
                    <a href={proj.project_url} target="_blank" rel="noreferrer" className="text-xs text-indigo-600 hover:text-indigo-800 flex items-center gap-1 font-semibold">
                      <ExternalLink className="w-3.5 h-3.5" /> Live Demo
                    </a>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Certifications Section */}
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <div className="flex items-center gap-2">
              <Award className="w-5 h-5 text-indigo-600" />
              <h2 className="text-base font-bold text-slate-900">Certifications</h2>
            </div>
            <button
              type="button"
              onClick={() => setShowCertModal(true)}
              className="px-3 py-1.5 rounded-lg bg-indigo-50 hover:bg-indigo-100 text-indigo-700 text-xs font-bold flex items-center gap-1 transition"
            >
              <Plus className="w-3.5 h-3.5" /> Add Certification
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {profile?.certifications?.map((cert) => (
              <div key={cert.id} className="p-4 rounded-xl border border-slate-200/80 flex justify-between items-start">
                <div>
                  <h4 className="text-sm font-bold text-slate-900">{cert.title}</h4>
                  <p className="text-xs text-slate-600 font-medium">{cert.issuing_organization}</p>
                  <p className="text-[11px] text-slate-400 mt-1">Issued: {cert.issue_date || 'N/A'}</p>
                  {cert.credential_url && (
                    <a href={cert.credential_url} target="_blank" rel="noreferrer" className="inline-flex items-center gap-1 text-[11px] text-indigo-600 hover:underline mt-1 font-semibold">
                      Verify Credential <ExternalLink className="w-3 h-3" />
                    </a>
                  )}
                </div>
                <button
                  type="button"
                  onClick={() => handleDeleteCertification(cert.id)}
                  className="text-slate-400 hover:text-rose-600 p-1"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>
        </div>

      </div>

      {/* Add Education Modal */}
      {showEduModal && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl space-y-4">
            <h3 className="text-base font-bold text-slate-900">Add Education Entry</h3>
            <form onSubmit={handleAddEducation} className="space-y-3">
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Institution</label>
                <input
                  type="text"
                  required
                  value={eduForm.institution}
                  onChange={(e) => setEduForm({ ...eduForm, institution: e.target.value })}
                  placeholder="e.g. National Institute of Technology"
                  className="w-full px-3 py-2 border rounded-xl text-xs outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Degree</label>
                <input
                  type="text"
                  required
                  value={eduForm.degree}
                  onChange={(e) => setEduForm({ ...eduForm, degree: e.target.value })}
                  placeholder="e.g. Bachelor of Technology"
                  className="w-full px-3 py-2 border rounded-xl text-xs outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Field of Study</label>
                <input
                  type="text"
                  value={eduForm.field_of_study}
                  onChange={(e) => setEduForm({ ...eduForm, field_of_study: e.target.value })}
                  placeholder="e.g. Computer Science"
                  className="w-full px-3 py-2 border rounded-xl text-xs outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Start Year</label>
                  <input
                    type="number"
                    required
                    value={eduForm.start_year}
                    onChange={(e) => setEduForm({ ...eduForm, start_year: e.target.value })}
                    className="w-full px-3 py-2 border rounded-xl text-xs outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase mb-1">End Year</label>
                  <input
                    type="number"
                    value={eduForm.end_year}
                    onChange={(e) => setEduForm({ ...eduForm, end_year: e.target.value })}
                    className="w-full px-3 py-2 border rounded-xl text-xs outline-none"
                  />
                </div>
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Grade / Score</label>
                <input
                  type="text"
                  value={eduForm.score_or_grade}
                  onChange={(e) => setEduForm({ ...eduForm, score_or_grade: e.target.value })}
                  placeholder="e.g. 8.9 CGPA or 92%"
                  className="w-full px-3 py-2 border rounded-xl text-xs outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>
              <div className="flex justify-end gap-2 pt-3">
                <button
                  type="button"
                  onClick={() => setShowEduModal(false)}
                  className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-600 hover:bg-slate-100"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl text-xs font-semibold bg-indigo-600 text-white hover:bg-indigo-700"
                >
                  Add Entry
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Add Project Modal */}
      {showProjModal && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl space-y-4">
            <h3 className="text-base font-bold text-slate-900">Add Project</h3>
            <form onSubmit={handleAddProject} className="space-y-3">
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Project Title</label>
                <input
                  type="text"
                  required
                  value={projForm.title}
                  onChange={(e) => setProjForm({ ...projForm, title: e.target.value })}
                  placeholder="e.g. Real-Time Collaborative Editor"
                  className="w-full px-3 py-2 border rounded-xl text-xs outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Technologies Used</label>
                <input
                  type="text"
                  value={projForm.technologies}
                  onChange={(e) => setProjForm({ ...projForm, technologies: e.target.value })}
                  placeholder="e.g. React.js, Node.js, Express, MySQL"
                  className="w-full px-3 py-2 border rounded-xl text-xs outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Description</label>
                <textarea
                  rows="3"
                  value={projForm.description}
                  onChange={(e) => setProjForm({ ...projForm, description: e.target.value })}
                  placeholder="Briefly explain what problem this solves and key engineering highlights..."
                  className="w-full px-3 py-2 border rounded-xl text-xs outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase mb-1">GitHub Repo URL</label>
                <input
                  type="url"
                  value={projForm.github_repo}
                  onChange={(e) => setProjForm({ ...projForm, github_repo: e.target.value })}
                  placeholder="https://github.com/..."
                  className="w-full px-3 py-2 border rounded-xl text-xs outline-none"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Live Demo URL</label>
                <input
                  type="url"
                  value={projForm.project_url}
                  onChange={(e) => setProjForm({ ...projForm, project_url: e.target.value })}
                  placeholder="https://my-project.vercel.app"
                  className="w-full px-3 py-2 border rounded-xl text-xs outline-none"
                />
              </div>
              <div className="flex justify-end gap-2 pt-3">
                <button
                  type="button"
                  onClick={() => setShowProjModal(false)}
                  className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-600 hover:bg-slate-100"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl text-xs font-semibold bg-indigo-600 text-white hover:bg-indigo-700"
                >
                  Save Project
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Add Certification Modal */}
      {showCertModal && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl space-y-4">
            <h3 className="text-base font-bold text-slate-900">Add Certification</h3>
            <form onSubmit={handleAddCertification} className="space-y-3">
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Certificate Title</label>
                <input
                  type="text"
                  required
                  value={certForm.title}
                  onChange={(e) => setCertForm({ ...certForm, title: e.target.value })}
                  placeholder="e.g. AWS Certified Cloud Practitioner"
                  className="w-full px-3 py-2 border rounded-xl text-xs outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Issuing Organization</label>
                <input
                  type="text"
                  required
                  value={certForm.issuing_organization}
                  onChange={(e) => setCertForm({ ...certForm, issuing_organization: e.target.value })}
                  placeholder="e.g. Amazon Web Services, Meta, Coursera"
                  className="w-full px-3 py-2 border rounded-xl text-xs outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Issue Date</label>
                <input
                  type="date"
                  value={certForm.issue_date}
                  onChange={(e) => setCertForm({ ...certForm, issue_date: e.target.value })}
                  className="w-full px-3 py-2 border rounded-xl text-xs outline-none"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Credential URL</label>
                <input
                  type="url"
                  value={certForm.credential_url}
                  onChange={(e) => setCertForm({ ...certForm, credential_url: e.target.value })}
                  placeholder="https://coursera.org/verify/..."
                  className="w-full px-3 py-2 border rounded-xl text-xs outline-none"
                />
              </div>
              <div className="flex justify-end gap-2 pt-3">
                <button
                  type="button"
                  onClick={() => setShowCertModal(false)}
                  className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-600 hover:bg-slate-100"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl text-xs font-semibold bg-indigo-600 text-white hover:bg-indigo-700"
                >
                  Save Certification
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </DashboardLayout>
  );
};

export default StudentProfile;
