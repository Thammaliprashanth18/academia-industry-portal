import React, { useState, useEffect } from 'react';
import DashboardLayout from '../layouts/DashboardLayout';
import { useToast } from '../context/ToastContext';
import { companyAPI } from '../services/api';
import {
  Users,
  Sparkles,
  Filter,
  CheckCircle2,
  FileText,
  Mail,
  School,
  Loader2,
  ExternalLink,
  Award
} from 'lucide-react';

const MatchedStudents = () => {
  const { error } = useToast();

  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedOpportunity, setSelectedOpportunity] = useState('all');
  const [minMatch, setMinMatch] = useState(0);

  const fetchCandidates = async () => {
    setLoading(true);
    try {
      const params = {};
      if (selectedOpportunity !== 'all') {
        const [type, id] = selectedOpportunity.split(':');
        params.opportunityType = type;
        params.opportunityId = id;
      }
      if (minMatch > 0) params.minMatch = minMatch;

      const res = await companyAPI.getMatchedStudents(params);
      if (res.success) {
        setData(res.data);
      }
    } catch (err) {
      error('Failed to load candidate pool.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCandidates();
  }, [selectedOpportunity, minMatch]);

  const candidates = data?.candidates || [];
  const targetSkills = data?.targetSkills || [];

  return (
    <DashboardLayout>
      <div className="space-y-6">

        {/* Header */}
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <Users className="w-5 h-5 text-indigo-600" />
              <h1 className="text-xl font-bold text-slate-900">Matched Student Talent Pool</h1>
            </div>
            <p className="text-xs text-slate-500 mt-1">
              AI skill matching algorithm actively ranking students in the academic ecosystem based on your job requirements
            </p>
          </div>
          <span className="text-xs font-bold text-slate-500 bg-slate-100 px-3 py-1.5 rounded-xl">
            {candidates.length} Matched Candidates
          </span>
        </div>

        {/* Filter Bar */}
        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="flex flex-wrap items-center gap-3 w-full sm:w-auto">
            <div>
              <label className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block mb-1">
                Match Against Opportunity
              </label>
              <select
                value={selectedOpportunity}
                onChange={(e) => setSelectedOpportunity(e.target.value)}
                className="px-3 py-1.5 border rounded-lg text-xs outline-none text-slate-700 font-medium"
              >
                <option value="all">All Company Job & Internship Skills</option>
                <optgroup label="Internships">
                  {data?.internships?.map((i) => (
                    <option key={`internship:${i.id}`} value={`internship:${i.id}`}>
                      {i.title}
                    </option>
                  ))}
                </optgroup>
                <optgroup label="Placements / Jobs">
                  {data?.jobs?.map((j) => (
                    <option key={`job:${j.id}`} value={`job:${j.id}`}>
                      {j.title}
                    </option>
                  ))}
                </optgroup>
              </select>
            </div>

            <div>
              <label className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block mb-1">
                Minimum Match %
              </label>
              <select
                value={minMatch}
                onChange={(e) => setMinMatch(Number(e.target.value))}
                className="px-3 py-1.5 border rounded-lg text-xs outline-none text-slate-700 font-medium"
              >
                <option value={0}>All Match Percentages (0%+)</option>
                <option value={25}>25% and above</option>
                <option value={50}>50% and above</option>
                <option value={75}>75% and above</option>
                <option value={90}>Top 90%+ Exact Matches</option>
              </select>
            </div>
          </div>

          {targetSkills.length > 0 && (
            <div className="flex flex-wrap items-center gap-1.5 pt-2 sm:pt-0">
              <span className="text-[11px] font-bold text-slate-400 uppercase">Target Skills:</span>
              {targetSkills.slice(0, 5).map((sk, idx) => (
                <span key={idx} className="px-2 py-0.5 rounded bg-indigo-50 text-indigo-700 text-[10px] font-bold">
                  {sk}
                </span>
              ))}
            </div>
          )}
        </div>

        {/* Candidate Cards */}
        {loading ? (
          <div className="py-20 flex flex-col items-center justify-center">
            <Loader2 className="w-10 h-10 text-indigo-600 animate-spin mb-3" />
            <p className="text-xs font-semibold text-slate-500">Ranking candidates across student database...</p>
          </div>
        ) : candidates.length === 0 ? (
          <div className="py-16 text-center bg-white rounded-2xl border border-slate-200">
            <Users className="w-10 h-10 text-slate-400 mx-auto mb-2" />
            <h3 className="text-base font-bold text-slate-800">No candidates found matching threshold</h3>
            <p className="text-xs text-slate-500 mt-1">Lower the minimum match percentage filter to see more profiles.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {candidates.map((cand) => (
              <div
                key={cand.student_id}
                className="bg-white p-6 rounded-2xl border border-slate-200/80 hover:shadow-lg transition flex flex-col justify-between space-y-4"
              >
                <div>
                  <div className="flex items-start justify-between gap-3 mb-3">
                    <div className="flex items-center gap-3">
                      <img
                        src={cand.avatar_url || `https://ui-avatars.com/api/?name=${encodeURIComponent(cand.student_name)}`}
                        alt={cand.student_name}
                        className="w-12 h-12 rounded-xl object-cover ring-2 ring-indigo-100"
                      />
                      <div>
                        <h3 className="text-base font-bold text-slate-900">{cand.student_name}</h3>
                        <p className="text-xs text-slate-500">{cand.college || 'Engineering Institute'}</p>
                        <p className="text-[11px] text-slate-400">
                          {cand.degree} in {cand.branch} • Class of {cand.graduation_year || 2026}
                        </p>
                      </div>
                    </div>

                    <div className="text-right shrink-0">
                      <span className={`px-2.5 py-1 rounded-full text-xs font-black ${
                        cand.skillMatch?.matchPercentage >= 70 ? 'bg-emerald-100 text-emerald-800 border border-emerald-200' :
                        cand.skillMatch?.matchPercentage >= 40 ? 'bg-amber-100 text-amber-800 border border-amber-200' :
                        'bg-slate-100 text-slate-700'
                      }`}>
                        {cand.skillMatch?.matchPercentage}% Match
                      </span>
                      {cand.cgpa && (
                        <p className="text-[10px] font-bold text-slate-600 mt-1">CGPA: {cand.cgpa}</p>
                      )}
                    </div>
                  </div>

                  {/* Skills tags */}
                  <div>
                    <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block mb-1.5">
                      Candidate Skills Inventory:
                    </span>
                    <div className="flex flex-wrap gap-1.5">
                      {cand.skills?.map((sk, idx) => {
                        const isMatched = targetSkills.some(ts => ts.toLowerCase() === sk.toLowerCase());
                        return (
                          <span
                            key={idx}
                            className={`px-2 py-0.5 rounded text-[10px] font-semibold ${
                              isMatched
                                ? 'bg-emerald-100 text-emerald-800 border border-emerald-300 font-bold'
                                : 'bg-slate-100 text-slate-600'
                            }`}
                          >
                            {isMatched ? '✓ ' : ''}{sk}
                          </span>
                        );
                      })}
                    </div>
                  </div>
                </div>

                {/* Footer action */}
                <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
                  <span className="text-slate-400 flex items-center gap-1">
                    <Mail className="w-3.5 h-3.5" /> {cand.student_email}
                  </span>

                  {cand.resume_url && (
                    <a
                      href={`http://localhost:5000${cand.resume_url}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="px-3 py-1.5 rounded-lg bg-indigo-50 hover:bg-indigo-100 text-indigo-700 font-bold flex items-center gap-1 transition"
                    >
                      <FileText className="w-3.5 h-3.5" /> Resume
                    </a>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}

      </div>
    </DashboardLayout>
  );
};

export default MatchedStudents;