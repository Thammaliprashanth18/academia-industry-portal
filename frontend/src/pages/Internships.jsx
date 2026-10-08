import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { useAuth } from '../context/AuthContext';
import { internshipAPI, skillAPI } from '../services/api';
import {
  Briefcase,
  Search,
  MapPin,
  Clock,
  Building2,
  Filter,
  Sparkles,
  ArrowRight,
  Loader2,
  Calendar,
  CheckCircle2
} from 'lucide-react';

const Internships = () => {
  const { user } = useAuth();
  const [internships, setInternships] = useState([]);
  const [loading, setLoading] = useState(true);

  // Filters state
  const [search, setSearch] = useState('');
  const [location, setLocation] = useState('');
  const [workMode, setWorkMode] = useState('all');
  const [duration, setDuration] = useState('all');
  const [selectedSkill, setSelectedSkill] = useState('all');
  const [sort, setSort] = useState('newest');
  const [skillsList, setSkillsList] = useState([]);

  const fetchInternships = async () => {
    setLoading(true);
    try {
      const params = {};
      if (search.trim()) params.search = search.trim();
      if (location.trim()) params.location = location.trim();
      if (workMode !== 'all') params.work_mode = workMode;
      if (duration !== 'all') params.duration = duration;
      if (selectedSkill !== 'all') params.skill = selectedSkill;
      if (sort) params.sort = sort;

      const res = await internshipAPI.getAll(params);
      if (res.success) {
        setInternships(res.data || []);
      }
    } catch (err) {
      console.error('Failed to fetch internships:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    skillAPI.getAll()
      .then(res => {
        if (res.success) setSkillsList(res.data || []);
      })
      .catch(() => {});
  }, []);

  useEffect(() => {
    const delay = setTimeout(() => {
      fetchInternships();
    }, 250);
    return () => clearTimeout(delay);
  }, [search, location, workMode, duration, selectedSkill, sort]);

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col justify-between">
      <Navbar />

      <main className="max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 flex-1">
        
        {/* Banner */}
        <div className="bg-gradient-to-r from-indigo-900 to-slate-900 text-white p-8 rounded-3xl mb-8 shadow-md">
          <div className="max-w-2xl">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-indigo-500/20 text-indigo-300 text-xs font-semibold mb-3">
              <Sparkles className="w-3.5 h-3.5" /> Industry Direct Connect
            </span>
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">Explore Verified Internships</h1>
            <p className="text-xs sm:text-sm text-slate-300 mt-2">
              Apply directly with real-time skill matching algorithms comparing your technical skills against job requirements.
            </p>
          </div>
        </div>

        {/* Filter & Search Bar */}
        <div className="bg-white p-4 sm:p-6 rounded-2xl border border-slate-200 shadow-sm mb-8 space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
            
            {/* Keyword Search */}
            <div className="relative">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search title, tech, company..."
                className="w-full pl-9 pr-3 py-2 border rounded-xl text-xs outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>

            {/* Location filter */}
            <div className="relative">
              <MapPin className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                placeholder="City or location..."
                className="w-full pl-9 pr-3 py-2 border rounded-xl text-xs outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>

            {/* Work Mode */}
            <select
              value={workMode}
              onChange={(e) => setWorkMode(e.target.value)}
              className="w-full px-3 py-2 border rounded-xl text-xs outline-none text-slate-700 font-medium"
            >
              <option value="all">All Work Modes</option>
              <option value="Remote">Remote</option>
              <option value="On-site">On-site</option>
              <option value="Hybrid">Hybrid</option>
            </select>

            {/* Skill Selector */}
            <select
              value={selectedSkill}
              onChange={(e) => setSelectedSkill(e.target.value)}
              className="w-full px-3 py-2 border rounded-xl text-xs outline-none text-slate-700 font-medium"
            >
              <option value="all">Filter by Skill (All)</option>
              {skillsList.map((s) => (
                <option key={s.id} value={s.name}>
                  {s.name}
                </option>
              ))}
            </select>
          </div>

          {/* Quick Sort Tabs */}
          <div className="flex flex-wrap items-center justify-between gap-3 pt-3 border-t border-slate-100 text-xs">
            <span className="text-slate-500 font-medium">Showing {internships.length} internships</span>
            <div className="flex items-center gap-2">
              <span className="text-slate-400 font-medium">Sort by:</span>
              <select
                value={sort}
                onChange={(e) => setSort(e.target.value)}
                className="px-2.5 py-1 border rounded-lg text-xs outline-none font-semibold text-slate-700"
              >
                <option value="newest">Newest First</option>
                <option value="deadline">Application Deadline</option>
                <option value="openings">Openings Count</option>
              </select>
            </div>
          </div>
        </div>

        {/* Listings Grid */}
        {loading ? (
          <div className="py-20 flex flex-col items-center justify-center">
            <Loader2 className="w-10 h-10 text-indigo-600 animate-spin mb-3" />
            <p className="text-xs font-semibold text-slate-500">Searching active internships...</p>
          </div>
        ) : internships.length === 0 ? (
          <div className="py-16 text-center bg-white rounded-2xl border border-slate-200">
            <Briefcase className="w-10 h-10 text-slate-400 mx-auto mb-2" />
            <h3 className="text-base font-bold text-slate-800">No internships match your criteria</h3>
            <p className="text-xs text-slate-500 mt-1">Try broadening your search keywords or removing filters.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {internships.map((item) => (
              <div
                key={item.id}
                className="bg-white rounded-2xl border border-slate-200/80 p-6 hover:shadow-xl hover:border-indigo-200 transition-all flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-start justify-between gap-3 mb-4">
                    <div className="w-12 h-12 rounded-xl bg-slate-100 p-2 border border-slate-200 flex items-center justify-center shrink-0">
                      {item.company_logo ? (
                        <img src={item.company_logo} alt={item.company_name} className="max-h-full object-contain" />
                      ) : (
                        <Building2 className="w-6 h-6 text-slate-500" />
                      )}
                    </div>

                    <div className="flex flex-col items-end gap-1">
                      <span className={`px-2.5 py-0.5 rounded-full text-[11px] font-bold ${
                        item.work_mode === 'Remote' ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' :
                        item.work_mode === 'Hybrid' ? 'bg-indigo-50 text-indigo-700 border border-indigo-200' :
                        'bg-slate-100 text-slate-700 border border-slate-200'
                      }`}>
                        {item.work_mode}
                      </span>
                      {item.hasApplied && (
                        <span className="px-2 py-0.5 rounded bg-emerald-100 text-emerald-800 text-[10px] font-bold">
                          ✓ Applied
                        </span>
                      )}
                    </div>
                  </div>

                  <h3 className="text-base font-bold text-slate-900 line-clamp-1 mb-0.5">{item.title}</h3>
                  <p className="text-xs font-semibold text-indigo-600 mb-3">{item.company_name}</p>

                  <div className="space-y-1.5 text-xs text-slate-500 mb-4">
                    <div className="flex items-center gap-2">
                      <MapPin className="w-3.5 h-3.5 text-slate-400" />
                      <span>{item.location}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Clock className="w-3.5 h-3.5 text-slate-400" />
                      <span>{item.duration} • Stipend: {item.stipend}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Calendar className="w-3.5 h-3.5 text-slate-400" />
                      <span>Deadline: {new Date(item.deadline).toLocaleDateString()}</span>
                    </div>
                  </div>

                  {/* Skills tags */}
                  <div className="flex flex-wrap gap-1.5 mb-4">
                    {item.skillsList?.slice(0, 4).map((sk, idx) => (
                      <span key={idx} className="px-2 py-0.5 rounded bg-slate-100 text-[11px] font-medium text-slate-700">
                        {sk}
                      </span>
                    ))}
                    {item.skillsList?.length > 4 && (
                      <span className="px-1.5 py-0.5 rounded bg-slate-100 text-[10px] text-slate-500">
                        +{item.skillsList.length - 4}
                      </span>
                    )}
                  </div>
                </div>

                {/* Bottom Match Percentage & Link */}
                <div className="pt-4 border-t border-slate-100 flex items-center justify-between">
                  {user?.role === 'student' ? (
                    <div>
                      <span className={`px-2.5 py-1 rounded-full text-xs font-extrabold ${
                        item.skillMatch?.matchPercentage >= 70 ? 'bg-emerald-100 text-emerald-800' :
                        item.skillMatch?.matchPercentage >= 40 ? 'bg-amber-100 text-amber-800' :
                        'bg-slate-100 text-slate-700'
                      }`}>
                        {item.skillMatch?.matchPercentage}% Match
                      </span>
                    </div>
                  ) : (
                    <span className="text-xs text-slate-400 font-medium">{item.openings} Openings</span>
                  )}

                  <Link
                    to={`/student/internship/${item.id}`}
                    className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold shadow-sm shadow-indigo-200 transition"
                  >
                    View Details
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}

      </main>

      <Footer />
    </div>
  );
};

export default Internships;