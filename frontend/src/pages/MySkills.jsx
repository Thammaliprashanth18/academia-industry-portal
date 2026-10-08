import React, { useState, useEffect } from 'react';
import DashboardLayout from '../layouts/DashboardLayout';
import { useToast } from '../context/ToastContext';
import { studentAPI, skillAPI } from '../services/api';
import {
  Sparkles,
  Plus,
  Trash2,
  CheckCircle2,
  Layers,
  Search,
  Loader2,
  Award,
  BarChart3
} from 'lucide-react';

const MySkills = () => {
  const { success, error } = useToast();

  const [studentSkills, setStudentSkills] = useState([]);
  const [catalogSkills, setCatalogSkills] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');

  // Add skill form
  const [showAddModal, setShowAddModal] = useState(false);
  const [customSkillName, setCustomSkillName] = useState('');
  const [selectedCatalogSkillId, setSelectedCatalogSkillId] = useState('');
  const [proficiency, setProficiency] = useState('Intermediate');
  const [submitting, setSubmitting] = useState(false);

  const fetchData = async () => {
    try {
      const [skillsRes, catalogRes] = await Promise.all([
        studentAPI.getSkills(),
        skillAPI.getAll()
      ]);

      if (skillsRes.success) setStudentSkills(skillsRes.data || []);
      if (catalogRes.success) setCatalogSkills(catalogRes.data || []);
    } catch (err) {
      error('Failed to load skills.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleAddSkill = async (e) => {
    e.preventDefault();
    if (!selectedCatalogSkillId && !customSkillName.trim()) {
      error('Please select or type a skill.');
      return;
    }

    setSubmitting(true);
    try {
      await studentAPI.addSkill({
        skill_id: selectedCatalogSkillId || undefined,
        skill_name: !selectedCatalogSkillId ? customSkillName.trim() : undefined,
        proficiency
      });
      success('Skill mapped to your profile!');
      setShowAddModal(false);
      setCustomSkillName('');
      setSelectedCatalogSkillId('');
      setProficiency('Intermediate');
      fetchData();
    } catch (err) {
      error(err.message || 'Failed to add skill.');
    } finally {
      setSubmitting(false);
    }
  };

  const handleRemoveSkill = async (skillId) => {
    try {
      await studentAPI.removeSkill(skillId);
      success('Skill removed.');
      fetchData();
    } catch (err) {
      error('Failed to remove skill.');
    }
  };

  const categories = ['all', ...new Set(catalogSkills.map(s => s.category))];

  const studentSkillIdSet = new Set(studentSkills.map(s => s.id));

  const filteredCatalog = catalogSkills.filter(s => {
    const matchesCat = selectedCategory === 'all' || s.category === selectedCategory;
    const matchesSearch = s.name.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCat && matchesSearch && !studentSkillIdSet.has(s.id);
  });

  const getProficiencyBadge = (level) => {
    switch (level) {
      case 'Expert': return 'bg-purple-100 text-purple-800 border-purple-200';
      case 'Advanced': return 'bg-emerald-100 text-emerald-800 border-emerald-200';
      case 'Intermediate': return 'bg-blue-100 text-blue-800 border-blue-200';
      default: return 'bg-slate-100 text-slate-700 border-slate-200';
    }
  };

  if (loading) {
    return (
      <DashboardLayout>
        <div className="py-20 flex flex-col items-center justify-center">
          <Loader2 className="w-10 h-10 text-indigo-600 animate-spin mb-3" />
          <p className="text-sm font-medium text-slate-500">Loading skill inventory...</p>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="space-y-6">

        {/* Top Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
          <div>
            <div className="flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-indigo-600" />
              <h1 className="text-xl font-bold text-slate-900">Technical Skills & Mapping</h1>
            </div>
            <p className="text-xs text-slate-500 mt-1">
              Add all technologies, tools, and languages you have practiced to boost match percentages
            </p>
          </div>

          <button
            onClick={() => setShowAddModal(true)}
            className="px-4 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold flex items-center gap-2 shadow-sm shadow-indigo-200 transition"
          >
            <Plus className="w-4 h-4" /> Add New Skill
          </button>
        </div>

        {/* Current Active Skills */}
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
          <div className="flex items-center justify-between mb-4 pb-3 border-b border-slate-100">
            <h2 className="text-base font-bold text-slate-900">
              My Mapped Skills ({studentSkills.length})
            </h2>
            <span className="text-xs text-slate-500 font-medium">Used for job matching algorithms</span>
          </div>

          {studentSkills.length === 0 ? (
            <div className="py-10 text-center bg-slate-50 rounded-xl border border-dashed border-slate-200">
              <Layers className="w-8 h-8 text-slate-400 mx-auto mb-2" />
              <p className="text-xs font-semibold text-slate-600">No skills added yet.</p>
              <p className="text-[11px] text-slate-400 mt-0.5">Click "Add New Skill" or select from the catalog below.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
              {studentSkills.map((sk) => (
                <div
                  key={sk.id}
                  className="p-3.5 rounded-xl border border-slate-200 bg-slate-50/60 hover:bg-slate-50 transition flex items-center justify-between"
                >
                  <div>
                    <h4 className="text-sm font-bold text-slate-900">{sk.name}</h4>
                    <p className="text-[10px] text-slate-400 uppercase font-semibold">{sk.category}</p>
                    <span className={`inline-block mt-1.5 px-2 py-0.5 rounded-md text-[10px] font-bold border ${getProficiencyBadge(sk.proficiency)}`}>
                      {sk.proficiency}
                    </span>
                  </div>

                  <button
                    onClick={() => handleRemoveSkill(sk.id)}
                    className="text-slate-400 hover:text-rose-600 p-1.5 transition"
                    title="Remove skill"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Skills Catalog Browser */}
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-3 border-b border-slate-100">
            <div>
              <h2 className="text-base font-bold text-slate-900">Industry Skills Catalog</h2>
              <p className="text-xs text-slate-500">Quickly add demanded skills to your profile</p>
            </div>

            <div className="flex items-center gap-2">
              <div className="relative">
                <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Filter catalog..."
                  className="pl-8 pr-3 py-1.5 border rounded-lg text-xs outline-none focus:ring-2 focus:ring-indigo-500 w-44"
                />
              </div>

              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="px-2 py-1.5 border rounded-lg text-xs outline-none text-slate-700 font-medium"
              >
                {categories.map((c) => (
                  <option key={c} value={c}>
                    {c === 'all' ? 'All Categories' : c}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
            {filteredCatalog.map((catSkill) => (
              <div
                key={catSkill.id}
                className="p-3 rounded-xl border border-slate-200/80 hover:border-indigo-300 hover:bg-indigo-50/20 transition flex items-center justify-between"
              >
                <div className="min-w-0 pr-2">
                  <p className="text-xs font-bold text-slate-800 truncate">{catSkill.name}</p>
                  <p className="text-[10px] text-slate-400 truncate">{catSkill.category}</p>
                </div>
                <button
                  type="button"
                  onClick={() => {
                    setSelectedCatalogSkillId(catSkill.id);
                    setShowAddModal(true);
                  }}
                  className="p-1 rounded-md bg-indigo-50 hover:bg-indigo-600 hover:text-white text-indigo-700 transition"
                  title="Add skill"
                >
                  <Plus className="w-3.5 h-3.5" />
                </button>
              </div>
            ))}
          </div>
        </div>

      </div>

      {/* Add Skill Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl space-y-4">
            <h3 className="text-base font-bold text-slate-900">Map Skill to Profile</h3>
            <form onSubmit={handleAddSkill} className="space-y-4">
              
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                  Select from Catalog
                </label>
                <select
                  value={selectedCatalogSkillId}
                  onChange={(e) => {
                    setSelectedCatalogSkillId(e.target.value);
                    if (e.target.value) setCustomSkillName('');
                  }}
                  className="w-full px-3 py-2 border rounded-xl text-xs outline-none focus:ring-2 focus:ring-indigo-500"
                >
                  <option value="">-- Choose existing catalog skill --</option>
                  {catalogSkills.map((s) => (
                    <option key={s.id} value={s.id}>
                      {s.name} ({s.category})
                    </option>
                  ))}
                </select>
              </div>

              <div className="text-center text-xs font-bold text-slate-400">OR</div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                  Enter Custom Skill Name
                </label>
                <input
                  type="text"
                  value={customSkillName}
                  onChange={(e) => {
                    setCustomSkillName(e.target.value);
                    if (e.target.value) setSelectedCatalogSkillId('');
                  }}
                  placeholder="e.g. Next.js, Rust, Snowflake"
                  className="w-full px-3 py-2 border rounded-xl text-xs outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                  Proficiency Level
                </label>
                <select
                  value={proficiency}
                  onChange={(e) => setProficiency(e.target.value)}
                  className="w-full px-3 py-2 border rounded-xl text-xs outline-none focus:ring-2 focus:ring-indigo-500"
                >
                  <option value="Beginner">Beginner (Basic fundamentals)</option>
                  <option value="Intermediate">Intermediate (Used in academic / coursework projects)</option>
                  <option value="Advanced">Advanced (Extensive hands-on practice / internship)</option>
                  <option value="Expert">Expert (Production-ready mastery)</option>
                </select>
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-600 hover:bg-slate-100"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="px-4 py-2 rounded-xl text-xs font-semibold bg-indigo-600 text-white hover:bg-indigo-700 flex items-center gap-1.5"
                >
                  {submitting ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <CheckCircle2 className="w-3.5 h-3.5" />}
                  Save Skill
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </DashboardLayout>
  );
};

export default MySkills;