import React, { useState, useEffect } from 'react';
import DashboardLayout from '../layouts/DashboardLayout';
import { useToast } from '../context/ToastContext';
import { adminAPI, internshipAPI, jobAPI } from '../services/api';
import {
  ShieldCheck,
  Users,
  Building2,
  Briefcase,
  Award,
  FileCheck,
  Sparkles,
  Trash2,
  CheckCircle2,
  XCircle,
  Search,
  Plus,
  Loader2,
  BarChart3,
  TrendingUp,
  AlertTriangle
} from 'lucide-react';

const AdminDashboard = () => {
  const { success, error } = useToast();

  const [activeTab, setActiveTab] = useState('overview');
  const [stats, setStats] = useState(null);
  const [users, setUsers] = useState([]);
  const [companies, setCompanies] = useState([]);
  const [internships, setInternships] = useState([]);
  const [jobs, setJobs] = useState([]);
  const [skills, setSkills] = useState([]);
  const [loading, setLoading] = useState(true);

  // User search & filters
  const [userSearch, setUserSearch] = useState('');
  const [userRoleFilter, setUserRoleFilter] = useState('all');

  // Add Skill Form
  const [showSkillModal, setShowSkillModal] = useState(false);
  const [newSkillName, setNewSkillName] = useState('');
  const [newSkillCat, setNewSkillCat] = useState('Technical');
  const [skillSubmitting, setSkillSubmitting] = useState(false);

  const fetchAllData = async () => {
    setLoading(true);
    try {
      const [statsRes, usersRes, companiesRes, internRes, jobsRes, skillsRes] = await Promise.all([
        adminAPI.getDashboardStats(),
        adminAPI.getUsers(),
        adminAPI.getCompanies(),
        internshipAPI.getAll(),
        jobAPI.getAll(),
        adminAPI.getSkills()
      ]);

      if (statsRes.success) setStats(statsRes.data);
      if (usersRes.success) setUsers(usersRes.data || []);
      if (companiesRes.success) setCompanies(companiesRes.data || []);
      if (internRes.success) setInternships(internRes.data || []);
      if (jobsRes.success) setJobs(jobsRes.data || []);
      if (skillsRes.success) setSkills(skillsRes.data || []);
    } catch (err) {
      error('Failed to load administrative control center.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAllData();
  }, []);

  const handleToggleUserStatus = async (userId, currentStatus) => {
    const newStatus = currentStatus === 'active' ? 'suspended' : 'active';
    try {
      await adminAPI.updateUserStatus(userId, newStatus);
      success(`User status updated to ${newStatus}.`);
      fetchAllData();
    } catch (err) {
      error(err.message || 'Failed to update user status.');
    }
  };

  const handleDeleteUser = async (userId) => {
    if (!window.confirm('Are you sure you want to permanently delete this user account?')) return;
    try {
      await adminAPI.deleteUser(userId);
      success('User deleted successfully.');
      fetchAllData();
    } catch (err) {
      error(err.message || 'Failed to delete user.');
    }
  };

  const handleVerifyCompany = async (companyId, verification_status) => {
    try {
      await adminAPI.verifyCompany(companyId, verification_status);
      success(`Company status marked as ${verification_status}.`);
      fetchAllData();
    } catch (err) {
      error('Failed to update company verification.');
    }
  };

  const handleDeleteInternship = async (id) => {
    if (!window.confirm('Delete this internship posting as moderator?')) return;
    try {
      await internshipAPI.delete(id);
      success('Internship removed.');
      fetchAllData();
    } catch (err) {
      error('Failed to delete internship.');
    }
  };

  const handleDeleteJob = async (id) => {
    if (!window.confirm('Delete this placement drive as moderator?')) return;
    try {
      await jobAPI.delete(id);
      success('Placement drive removed.');
      fetchAllData();
    } catch (err) {
      error('Failed to delete placement role.');
    }
  };

  const handleAddSkill = async (e) => {
    e.preventDefault();
    if (!newSkillName.trim()) return;

    setSkillSubmitting(true);
    try {
      await adminAPI.addSkill({ name: newSkillName.trim(), category: newSkillCat });
      success('New skill added to platform catalog.');
      setShowSkillModal(false);
      setNewSkillName('');
      fetchAllData();
    } catch (err) {
      error(err.message || 'Failed to add skill.');
    } finally {
      setSkillSubmitting(false);
    }
  };

  const handleDeleteSkill = async (id) => {
    if (!window.confirm('Delete this skill from global catalog?')) return;
    try {
      await adminAPI.deleteSkill(id);
      success('Skill deleted from catalog.');
      fetchAllData();
    } catch (err) {
      error('Failed to delete skill.');
    }
  };

  const filteredUsers = users.filter((u) => {
    const matchesRole = userRoleFilter === 'all' || u.role === userRoleFilter;
    const matchesSearch =
      !userSearch.trim() ||
      u.name?.toLowerCase().includes(userSearch.toLowerCase()) ||
      u.email?.toLowerCase().includes(userSearch.toLowerCase()) ||
      u.college?.toLowerCase().includes(userSearch.toLowerCase()) ||
      u.company_name?.toLowerCase().includes(userSearch.toLowerCase());
    return matchesRole && matchesSearch;
  });

  if (loading) {
    return (
      <DashboardLayout>
        <div className="py-20 flex flex-col items-center justify-center">
          <Loader2 className="w-10 h-10 text-indigo-600 animate-spin mb-3" />
          <p className="text-xs font-semibold text-slate-500">Loading platform admin system...</p>
        </div>
      </DashboardLayout>
    );
  }

  const userStats = stats?.users || { totalUsers: 0, totalStudents: 0, totalCompanies: 0 };
  const appStats = stats?.applications || { totalApplications: 0, selectedCount: 0 };

  return (
    <DashboardLayout>
      <div className="space-y-6">

        {/* Top Header */}
        <div className="bg-gradient-to-r from-slate-950 via-indigo-950 to-slate-900 text-white p-6 sm:p-8 rounded-3xl shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div>
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-violet-500/20 text-violet-300 text-xs font-bold mb-3">
              <ShieldCheck className="w-3.5 h-3.5" /> Institution & System Administration
            </span>
            <h1 className="text-2xl sm:text-3xl font-black">AcademiaSync Central Control</h1>
            <p className="text-xs sm:text-sm text-indigo-200 mt-1">
              Supervise student engagement, verify corporate partners, moderate postings, and manage skills catalog
            </p>
          </div>

          <button
            onClick={() => setShowSkillModal(true)}
            className="px-4 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs flex items-center gap-2 shadow-lg shadow-indigo-600/30 transition shrink-0"
          >
            <Plus className="w-4 h-4" /> Add Catalog Skill
          </button>
        </div>

        {/* Navigation Tabs */}
        <div className="flex flex-wrap items-center gap-2 border-b border-slate-200 pb-2">
          {[
            { key: 'overview', label: 'Overview Analytics', icon: BarChart3 },
            { key: 'users', label: `Manage Users (${users.length})`, icon: Users },
            { key: 'companies', label: `Verify Companies (${companies.length})`, icon: Building2 },
            { key: 'postings', label: `Moderate Postings (${internships.length + jobs.length})`, icon: Briefcase },
            { key: 'skills', label: `Skills Catalog (${skills.length})`, icon: Sparkles }
          ].map((t) => {
            const Icon = t.icon;
            return (
              <button
                key={t.key}
                onClick={() => setActiveTab(t.key)}
                className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition ${
                  activeTab === t.key
                    ? 'bg-indigo-600 text-white shadow-sm'
                    : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-50'
                }`}
              >
                <Icon className="w-4 h-4" /> {t.label}
              </button>
            );
          })}
        </div>

        {/* TAB 1: OVERVIEW */}
        {activeTab === 'overview' && (
          <div className="space-y-6">
            
            {/* 4 Stats Cards */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="p-4 rounded-2xl bg-white border border-slate-200 shadow-sm flex items-center gap-4">
                <div className="w-12 h-12 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center shrink-0">
                  <Users className="w-6 h-6" />
                </div>
                <div>
                  <p className="text-2xl font-black text-slate-900">{userStats.totalStudents || 0}</p>
                  <p className="text-xs text-slate-500 font-medium">Registered Students</p>
                </div>
              </div>

              <div className="p-4 rounded-2xl bg-white border border-slate-200 shadow-sm flex items-center gap-4">
                <div className="w-12 h-12 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0">
                  <Building2 className="w-6 h-6" />
                </div>
                <div>
                  <p className="text-2xl font-black text-slate-900">{userStats.totalCompanies || 0}</p>
                  <p className="text-xs text-slate-500 font-medium">Industry Partners</p>
                </div>
              </div>

              <div className="p-4 rounded-2xl bg-white border border-slate-200 shadow-sm flex items-center gap-4">
                <div className="w-12 h-12 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center shrink-0">
                  <Briefcase className="w-6 h-6" />
                </div>
                <div>
                  <p className="text-2xl font-black text-slate-900">{internships.length + jobs.length}</p>
                  <p className="text-xs text-slate-500 font-medium">Total Opportunities</p>
                </div>
              </div>

              <div className="p-4 rounded-2xl bg-white border border-slate-200 shadow-sm flex items-center gap-4">
                <div className="w-12 h-12 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center shrink-0">
                  <FileCheck className="w-6 h-6" />
                </div>
                <div>
                  <p className="text-2xl font-black text-slate-900">{appStats.totalApplications || 0}</p>
                  <p className="text-xs text-slate-500 font-medium">Total Applications</p>
                </div>
              </div>
            </div>

            {/* Top Demanded Skills & Recent Registrations */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              
              <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-4">
                <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-indigo-600" /> Most Demanded Industry Skills
                </h3>
                <div className="space-y-3">
                  {stats?.topSkills?.map((s, idx) => (
                    <div key={idx} className="flex items-center justify-between p-3 rounded-xl bg-slate-50 border border-slate-100">
                      <div>
                        <span className="font-bold text-xs text-slate-900">{s.name}</span>
                        <span className="text-[10px] text-slate-400 block">{s.category}</span>
                      </div>
                      <span className="px-2 py-0.5 rounded-full text-xs font-bold bg-indigo-100 text-indigo-700">
                        {s.count} Postings
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-4">
                <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
                  <Users className="w-4 h-4 text-indigo-600" /> Recent User Registrations
                </h3>
                <div className="space-y-3">
                  {stats?.recentUsers?.map((u) => (
                    <div key={u.id} className="flex items-center justify-between p-3 rounded-xl bg-slate-50 border border-slate-100">
                      <div className="flex items-center gap-3">
                        <img
                          src={u.avatar_url || `https://ui-avatars.com/api/?name=${encodeURIComponent(u.name)}`}
                          alt={u.name}
                          className="w-8 h-8 rounded-full object-cover"
                        />
                        <div>
                          <p className="font-bold text-xs text-slate-900">{u.name}</p>
                          <p className="text-[10px] text-slate-400">{u.email}</p>
                        </div>
                      </div>
                      <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase bg-slate-200 text-slate-700">
                        {u.role}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

            </div>

          </div>
        )}

        {/* TAB 2: MANAGE USERS */}
        {activeTab === 'users' && (
          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-100">
              <div className="relative w-full sm:w-72">
                <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  value={userSearch}
                  onChange={(e) => setUserSearch(e.target.value)}
                  placeholder="Search by name, email, college..."
                  className="w-full pl-8 pr-3 py-1.5 border rounded-lg text-xs outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>

              <select
                value={userRoleFilter}
                onChange={(e) => setUserRoleFilter(e.target.value)}
                className="px-3 py-1.5 border rounded-lg text-xs outline-none text-slate-700 font-medium"
              >
                <option value="all">All Roles</option>
                <option value="student">Students</option>
                <option value="company">Companies</option>
                <option value="admin">Admins</option>
              </select>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="border-b border-slate-200 text-slate-500 uppercase tracking-wider font-semibold">
                    <th className="pb-3">User</th>
                    <th className="pb-3">Role</th>
                    <th className="pb-3">Affiliation / Entity</th>
                    <th className="pb-3">Joined On</th>
                    <th className="pb-3">Status</th>
                    <th className="pb-3 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {filteredUsers.map((u) => (
                    <tr key={u.id} className="hover:bg-slate-50">
                      <td className="py-3">
                        <div className="flex items-center gap-2.5">
                          <img
                            src={u.avatar_url || `https://ui-avatars.com/api/?name=${encodeURIComponent(u.name)}`}
                            alt={u.name}
                            className="w-7 h-7 rounded-full object-cover"
                          />
                          <div>
                            <p className="font-bold text-slate-900">{u.name}</p>
                            <p className="text-[10px] text-slate-400">{u.email}</p>
                          </div>
                        </div>
                      </td>
                      <td className="py-3">
                        <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
                          u.role === 'student' ? 'bg-indigo-100 text-indigo-700' :
                          u.role === 'company' ? 'bg-emerald-100 text-emerald-700' :
                          'bg-purple-100 text-purple-700'
                        }`}>
                          {u.role}
                        </span>
                      </td>
                      <td className="py-3 text-slate-600">
                        {u.role === 'student' ? (u.college || 'Academic Student') : (u.company_name || 'Industry Recruiter')}
                      </td>
                      <td className="py-3 text-slate-400">{new Date(u.created_at).toLocaleDateString()}</td>
                      <td className="py-3">
                        <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                          u.status === 'active' ? 'bg-emerald-100 text-emerald-800' : 'bg-rose-100 text-rose-800'
                        }`}>
                          {u.status}
                        </span>
                      </td>
                      <td className="py-3 text-right">
                        <div className="flex items-center justify-end gap-2">
                          <button
                            onClick={() => handleToggleUserStatus(u.id, u.status)}
                            className="px-2 py-1 rounded bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold text-[10px]"
                          >
                            {u.status === 'active' ? 'Suspend' : 'Activate'}
                          </button>
                          <button
                            onClick={() => handleDeleteUser(u.id)}
                            className="text-slate-400 hover:text-rose-600 p-1"
                            title="Delete User"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* TAB 3: VERIFY COMPANIES */}
        {activeTab === 'companies' && (
          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-4">
            <h3 className="text-base font-bold text-slate-900">Industry Partner Verifications</h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {companies.map((comp) => (
                <div key={comp.id} className="p-4 rounded-xl border border-slate-200 flex flex-col justify-between space-y-3">
                  <div>
                    <div className="flex items-start justify-between">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-slate-100 p-1.5 border flex items-center justify-center">
                          {comp.logo_url ? (
                            <img src={comp.logo_url} alt={comp.company_name} className="max-h-full object-contain" />
                          ) : (
                            <Building2 className="w-5 h-5 text-slate-400" />
                          )}
                        </div>
                        <div>
                          <h4 className="font-bold text-sm text-slate-900">{comp.company_name}</h4>
                          <p className="text-[11px] text-slate-500">{comp.industry_type} • {comp.location}</p>
                        </div>
                      </div>

                      <span className={`px-2 py-0.5 rounded text-[10px] uppercase font-bold ${
                        comp.verification_status === 'verified' ? 'bg-emerald-100 text-emerald-800' :
                        comp.verification_status === 'rejected' ? 'bg-rose-100 text-rose-800' :
                        'bg-amber-100 text-amber-800'
                      }`}>
                        {comp.verification_status}
                      </span>
                    </div>

                    <p className="text-xs text-slate-600 mt-2 line-clamp-2">{comp.description}</p>
                    <p className="text-[11px] text-slate-400 mt-1">Contact: {comp.contact_email} • {comp.contact_phone}</p>
                  </div>

                  <div className="pt-2 border-t border-slate-100 flex items-center justify-between">
                    <span className="text-[11px] text-slate-500">
                      {comp.internship_count} Internships, {comp.job_count} Jobs
                    </span>

                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => handleVerifyCompany(comp.id, 'verified')}
                        className="px-2.5 py-1 bg-emerald-50 hover:bg-emerald-100 text-emerald-700 text-xs font-bold rounded-lg"
                      >
                        Approve
                      </button>
                      <button
                        onClick={() => handleVerifyCompany(comp.id, 'rejected')}
                        className="px-2.5 py-1 bg-rose-50 hover:bg-rose-100 text-rose-700 text-xs font-bold rounded-lg"
                      >
                        Reject
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TAB 4: MODERATE POSTINGS */}
        {activeTab === 'postings' && (
          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-6">
            <div>
              <h3 className="text-base font-bold text-slate-900 mb-3">All Active Internships ({internships.length})</h3>
              <div className="space-y-2">
                {internships.map((i) => (
                  <div key={i.id} className="p-3 rounded-xl border flex items-center justify-between">
                    <div>
                      <p className="font-bold text-xs text-slate-900">{i.title}</p>
                      <p className="text-[11px] text-slate-500">{i.company_name} • {i.location} • {i.stipend}</p>
                    </div>
                    <button
                      onClick={() => handleDeleteInternship(i.id)}
                      className="text-slate-400 hover:text-rose-600 p-1"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                ))}
              </div>
            </div>

            <div>
              <h3 className="text-base font-bold text-slate-900 mb-3">All Placement Drives ({jobs.length})</h3>
              <div className="space-y-2">
                {jobs.map((j) => (
                  <div key={j.id} className="p-3 rounded-xl border flex items-center justify-between">
                    <div>
                      <p className="font-bold text-xs text-slate-900">{j.title}</p>
                      <p className="text-[11px] text-slate-500">{j.company_name} • {j.salary_package} • {j.location}</p>
                    </div>
                    <button
                      onClick={() => handleDeleteJob(j.id)}
                      className="text-slate-400 hover:text-rose-600 p-1"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* TAB 5: SKILLS CATALOG */}
        {activeTab === 'skills' && (
          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h3 className="text-base font-bold text-slate-900">Platform Skills Catalog</h3>
              <button
                onClick={() => setShowSkillModal(true)}
                className="px-3 py-1.5 rounded-lg bg-indigo-600 text-white text-xs font-bold"
              >
                + Add Skill
              </button>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
              {skills.map((sk) => (
                <div key={sk.id} className="p-3 rounded-xl border border-slate-200 flex items-center justify-between">
                  <div>
                    <h4 className="font-bold text-xs text-slate-900">{sk.name}</h4>
                    <span className="text-[10px] text-slate-400">{sk.category}</span>
                  </div>
                  <button
                    onClick={() => handleDeleteSkill(sk.id)}
                    className="text-slate-400 hover:text-rose-600 p-1"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

      </div>

      {/* Add Catalog Skill Modal */}
      {showSkillModal && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl space-y-4">
            <h3 className="text-base font-bold text-slate-900">Add Skill to Catalog</h3>
            <form onSubmit={handleAddSkill} className="space-y-3">
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Skill Name</label>
                <input
                  type="text"
                  required
                  value={newSkillName}
                  onChange={(e) => setNewSkillName(e.target.value)}
                  placeholder="e.g. Next.js, Rust, Snowflake"
                  className="w-full px-3 py-2 border rounded-xl text-xs outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Category</label>
                <select
                  value={newSkillCat}
                  onChange={(e) => setNewSkillCat(e.target.value)}
                  className="w-full px-3 py-2 border rounded-xl text-xs outline-none font-medium"
                >
                  <option value="Programming">Programming</option>
                  <option value="Web Development">Web Development</option>
                  <option value="Data Science & AI">Data Science & AI</option>
                  <option value="Cloud & DevOps">Cloud & DevOps</option>
                  <option value="Database">Database</option>
                  <option value="Tools & DevOps">Tools & DevOps</option>
                  <option value="Design & UI/UX">Design & UI/UX</option>
                  <option value="Core Engineering">Core Engineering</option>
                </select>
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowSkillModal(false)}
                  className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-600 hover:bg-slate-100"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={skillSubmitting}
                  className="px-4 py-2 rounded-xl text-xs font-bold bg-indigo-600 text-white hover:bg-indigo-700"
                >
                  {skillSubmitting ? 'Saving...' : 'Add to Catalog'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </DashboardLayout>
  );
};

export default AdminDashboard;
