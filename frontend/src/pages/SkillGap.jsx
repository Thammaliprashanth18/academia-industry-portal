import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import DashboardLayout from '../layouts/DashboardLayout';
import { studentAPI } from '../services/api';
import {
  Compass,
  Sparkles,
  TrendingUp,
  CheckCircle2,
  AlertTriangle,
  ArrowRight,
  BookOpen,
  Loader2,
  Award,
  BarChart3
} from 'lucide-react';

const SkillGap = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    studentAPI.getSkillGap()
      .then(res => {
        if (res.success) setData(res.data);
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <DashboardLayout>
        <div className="py-20 flex flex-col items-center justify-center">
          <Loader2 className="w-10 h-10 text-indigo-600 animate-spin mb-3" />
          <p className="text-sm font-medium text-slate-500">Calculating industry skill gaps...</p>
        </div>
      </DashboardLayout>
    );
  }

  const mastered = data?.masteredSkills || [];
  const missing = data?.topMissingInDemand || [];
  const totalAnalyzed = data?.totalIndustrySkillsAnalyzed || 0;
  const coverageRate = totalAnalyzed > 0 ? Math.round((mastered.length / totalAnalyzed) * 100) : 0;

  return (
    <DashboardLayout>
      <div className="space-y-6">

        {/* Header */}
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <Compass className="w-5 h-5 text-indigo-600" />
              <h1 className="text-xl font-bold text-slate-900">Industry Skill Gap Analytics</h1>
            </div>
            <p className="text-xs text-slate-500 mt-1">
              Comparative intelligence analyzing real-time requirements from active employer postings
            </p>
          </div>

          <Link
            to="/student/roadmap"
            className="px-4 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold flex items-center gap-2 shadow-sm shadow-indigo-200 transition"
          >
            <BookOpen className="w-4 h-4" /> View Learning Roadmap
          </Link>
        </div>

        {/* Coverage Overview Card */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-sm flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0">
              <CheckCircle2 className="w-6 h-6" />
            </div>
            <div>
              <p className="text-2xl font-black text-slate-900">{mastered.length}</p>
              <p className="text-xs text-slate-500 font-medium">Industry Skills Mastered</p>
            </div>
          </div>

          <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-sm flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center shrink-0">
              <AlertTriangle className="w-6 h-6" />
            </div>
            <div>
              <p className="text-2xl font-black text-slate-900">{missing.length}</p>
              <p className="text-xs text-slate-500 font-medium">High-Demand Skill Gaps</p>
            </div>
          </div>

          <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-sm flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center shrink-0">
              <TrendingUp className="w-6 h-6" />
            </div>
            <div>
              <p className="text-2xl font-black text-slate-900">{coverageRate}%</p>
              <p className="text-xs text-slate-500 font-medium">Market Readiness Score</p>
            </div>
          </div>
        </div>

        {/* Gap Breakdown Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

          {/* Missing in Demand */}
          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div>
                <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
                  <AlertTriangle className="w-4 h-4 text-amber-500" /> High-Impact Missing Skills
                </h3>
                <p className="text-xs text-slate-500">Learning these skills will increase your match score</p>
              </div>
              <Link to="/student/skills" className="text-xs font-semibold text-indigo-600 hover:text-indigo-800">
                + Add to profile
              </Link>
            </div>

            {missing.length === 0 ? (
              <p className="text-xs text-slate-500 py-8 text-center">Great job! You have acquired all active market skills.</p>
            ) : (
              <div className="space-y-3">
                {missing.map((sk) => (
                  <div key={sk.id} className="p-3.5 rounded-xl border border-amber-100 bg-amber-50/40 flex items-center justify-between">
                    <div>
                      <h4 className="text-sm font-bold text-slate-900">{sk.name}</h4>
                      <p className="text-[10px] text-slate-500">{sk.category} • Demanded in {sk.demandCount} postings</p>
                    </div>
                    <span className="px-2.5 py-1 rounded-full text-[10px] font-bold bg-amber-100 text-amber-800">
                      Recommended Focus
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Mastered Skills with Proficiency */}
          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div>
                <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-500" /> Verified Market Alignments
                </h3>
                <p className="text-xs text-slate-500">Skills on your profile that match live postings</p>
              </div>
            </div>

            {mastered.length === 0 ? (
              <p className="text-xs text-slate-500 py-8 text-center">No skills matching active postings yet.</p>
            ) : (
              <div className="space-y-3">
                {mastered.map((sk) => (
                  <div key={sk.id} className="p-3.5 rounded-xl border border-emerald-100 bg-emerald-50/40 flex items-center justify-between">
                    <div>
                      <h4 className="text-sm font-bold text-slate-900">{sk.name}</h4>
                      <p className="text-[10px] text-slate-500">{sk.category} • Demanded in {sk.demandCount} postings</p>
                    </div>
                    <span className="px-2.5 py-1 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800">
                      {sk.proficiency || 'Proficient'}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>

        </div>

      </div>
    </DashboardLayout>
  );
};

export default SkillGap;