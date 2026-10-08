import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import DashboardLayout from '../layouts/DashboardLayout';
import { useToast } from '../context/ToastContext';
import { internshipAPI, skillAPI } from '../services/api';
import {
  Briefcase,
  Plus,
  X,
  Sparkles,
  Loader2,
  CheckCircle2,
  Calendar,
  MapPin,
  Clock,
  DollarSign
} from 'lucide-react';

const PostInternship = () => {
  const navigate = useNavigate();
  const { success, error } = useToast();

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    responsibilities: '',
    requirements: '',
    location: '',
    work_mode: 'Remote',
    duration: '3 Months',
    stipend: '₹25,000/month',
    eligibility: 'B.Tech/B.E. 2025/2026 Batch',
    openings: 2,
    deadline: ''
  });

  const [catalogSkills, setCatalogSkills] = useState([]);
  const [selectedSkills, setSelectedSkills] = useState([]);
  const [customSkill, setCustomSkill] = useState('');
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    skillAPI.getAll()
      .then(res => {
        if (res.success) setCatalogSkills(res.data || []);
      })
      .catch(() => {});
  }, []);

  const handleChange = (e) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleToggleSkill = (skill) => {
    if (selectedSkills.some(s => s.name.toLowerCase() === skill.name.toLowerCase())) {
      setSelectedSkills(selectedSkills.filter(s => s.name.toLowerCase() !== skill.name.toLowerCase()));
    } else {
      setSelectedSkills([...selectedSkills, skill]);
    }
  };

  const handleAddCustomSkill = (e) => {
    e.preventDefault();
    if (!customSkill.trim()) return;
    if (!selectedSkills.some(s => s.name.toLowerCase() === customSkill.trim().toLowerCase())) {
      setSelectedSkills([...selectedSkills, { name: customSkill.trim(), is_required: true }]);
    }
    setCustomSkill('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.title || !formData.description || !formData.location || !formData.deadline) {
      error('Please complete all required fields.');
      return;
    }

    if (selectedSkills.length === 0) {
      error('Please specify at least one required skill.');
      return;
    }

    setSubmitting(true);
    try {
      await internshipAPI.create({
        ...formData,
        skills: selectedSkills
      });

      success('Internship opportunity posted successfully!');
      navigate('/company/internships');
    } catch (err) {
      error(err.message || 'Failed to post internship.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <DashboardLayout>
      <div className="max-w-4xl mx-auto space-y-6">

        {/* Top Header */}
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex items-center justify-between">
          <div>
            <div className="flex items-center gap-2">
              <Briefcase className="w-5 h-5 text-indigo-600" />
              <h1 className="text-xl font-bold text-slate-900">Post New Internship</h1>
            </div>
            <p className="text-xs text-slate-500 mt-1">
              Create an internship opportunity and define required skills for automated candidate matching
            </p>
          </div>
        </div>

        {/* Form Card */}
        <form onSubmit={handleSubmit} className="bg-white p-6 sm:p-8 rounded-2xl border border-slate-200 shadow-sm space-y-6">
          
          <div className="space-y-4">
            <h2 className="text-sm font-bold text-slate-900 uppercase tracking-wider border-b border-slate-100 pb-2">
              1. Basic Information
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="sm:col-span-2">
                <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                  Internship Title *
                </label>
                <input
                  type="text"
                  name="title"
                  required
                  value={formData.title}
                  onChange={handleChange}
                  placeholder="e.g. Full-Stack Software Engineering Intern"
                  className="w-full px-3 py-2 border rounded-xl text-xs outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                  Location *
                </label>
                <input
                  type="text"
                  name="location"
                  required
                  value={formData.location}
                  onChange={handleChange}
                  placeholder="e.g. Bengaluru, India or Remote"
                  className="w-full px-3 py-2 border rounded-xl text-xs outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                  Work Mode *
                </label>
                <select
                  name="work_mode"
                  value={formData.work_mode}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border rounded-xl text-xs outline-none font-medium"
                >
                  <option value="Remote">Remote</option>
                  <option value="On-site">On-site</option>
                  <option value="Hybrid">Hybrid</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                  Duration *
                </label>
                <input
                  type="text"
                  name="duration"
                  required
                  value={formData.duration}
                  onChange={handleChange}
                  placeholder="e.g. 3 Months, 6 Months"
                  className="w-full px-3 py-2 border rounded-xl text-xs outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                  Monthly Stipend *
                </label>
                <input
                  type="text"
                  name="stipend"
                  required
                  value={formData.stipend}
                  onChange={handleChange}
                  placeholder="e.g. ₹30,000/month or Unpaid"
                  className="w-full px-3 py-2 border rounded-xl text-xs outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                  Number of Openings *
                </label>
                <input
                  type="number"
                  name="openings"
                  min="1"
                  required
                  value={formData.openings}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border rounded-xl text-xs outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                  Application Deadline *
                </label>
                <input
                  type="date"
                  name="deadline"
                  required
                  value={formData.deadline}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border rounded-xl text-xs outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <h2 className="text-sm font-bold text-slate-900 uppercase tracking-wider border-b border-slate-100 pb-2">
              2. Job Descriptions & Responsibilities
            </h2>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                Internship Overview & Mission *
              </label>
              <textarea
                name="description"
                rows="4"
                required
                value={formData.description}
                onChange={handleChange}
                placeholder="Describe what the student will work on, team dynamics, and learning opportunities..."
                className="w-full px-3 py-2 border rounded-xl text-xs outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                Key Responsibilities (Bullet points)
              </label>
              <textarea
                name="responsibilities"
                rows="3"
                value={formData.responsibilities}
                onChange={handleChange}
                placeholder="• Build web microservices&#10;• Collaborate with senior engineers&#10;• Write automated tests"
                className="w-full px-3 py-2 border rounded-xl text-xs outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                Eligibility & Candidate Criteria
              </label>
              <input
                type="text"
                name="eligibility"
                value={formData.eligibility}
                onChange={handleChange}
                placeholder="e.g. B.Tech / MCA with CGPA > 7.5 graduating in 2025 or 2026"
                className="w-full px-3 py-2 border rounded-xl text-xs outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>
          </div>

          {/* Skill Specification Section */}
          <div className="space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-2">
              <h2 className="text-sm font-bold text-slate-900 uppercase tracking-wider">
                3. Required Technical Skills ({selectedSkills.length} selected)
              </h2>
              <span className="text-[11px] text-indigo-600 font-semibold">Powers AI Skill Matching</span>
            </div>

            {/* Selected Skills Tags */}
            <div className="p-4 bg-indigo-50/50 rounded-xl border border-indigo-100 flex flex-wrap gap-2 min-h-[48px] items-center">
              {selectedSkills.length === 0 ? (
                <span className="text-xs text-slate-400">Click skills below or type custom skill to attach</span>
              ) : (
                selectedSkills.map((sk, idx) => (
                  <span
                    key={idx}
                    className="px-3 py-1 rounded-lg bg-indigo-600 text-white text-xs font-semibold flex items-center gap-1.5 shadow-sm"
                  >
                    {sk.name}
                    <button
                      type="button"
                      onClick={() => handleToggleSkill(sk)}
                      className="hover:text-indigo-200"
                    >
                      <X className="w-3.5 h-3.5" />
                    </button>
                  </span>
                ))
              )}
            </div>

            {/* Custom Skill Input */}
            <div className="flex gap-2">
              <input
                type="text"
                value={customSkill}
                onChange={(e) => setCustomSkill(e.target.value)}
                placeholder="Add custom skill if not listed..."
                className="flex-1 px-3 py-1.5 border rounded-xl text-xs outline-none focus:ring-2 focus:ring-indigo-500"
              />
              <button
                type="button"
                onClick={handleAddCustomSkill}
                className="px-4 py-1.5 rounded-xl bg-slate-800 text-white text-xs font-bold hover:bg-slate-700 transition"
              >
                + Add
              </button>
            </div>

            {/* Catalog skills tag chips */}
            <div>
              <p className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">
                Click to add from catalog:
              </p>
              <div className="flex flex-wrap gap-1.5 max-h-36 overflow-y-auto p-1">
                {catalogSkills.map((catSkill) => {
                  const isSelected = selectedSkills.some(s => s.name.toLowerCase() === catSkill.name.toLowerCase());
                  return (
                    <button
                      type="button"
                      key={catSkill.id}
                      onClick={() => handleToggleSkill(catSkill)}
                      className={`px-2.5 py-1 rounded-lg text-xs font-medium border transition ${
                        isSelected
                          ? 'bg-indigo-600 text-white border-indigo-600 font-semibold'
                          : 'bg-white text-slate-700 border-slate-200 hover:border-indigo-300'
                      }`}
                    >
                      {isSelected ? '✓ ' : '+ '}{catSkill.name}
                    </button>
                  );
                })}
              </div>
            </div>
          </div>

          <div className="pt-4 border-t border-slate-100 flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={() => navigate('/company/internships')}
              className="px-5 py-2.5 rounded-xl text-xs font-bold text-slate-600 hover:bg-slate-100 transition"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={submitting}
              className="px-6 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold shadow-md shadow-indigo-200 flex items-center gap-2 disabled:opacity-50 transition"
            >
              {submitting ? <Loader2 className="w-4 h-4 animate-spin" /> : <CheckCircle2 className="w-4 h-4" />}
              Publish Internship
            </button>
          </div>

        </form>

      </div>
    </DashboardLayout>
  );
};

export default PostInternship;