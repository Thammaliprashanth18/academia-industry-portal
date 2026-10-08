import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { internshipAPI, jobAPI, adminAPI } from '../services/api';
import {
  GraduationCap,
  Building2,
  Sparkles,
  Briefcase,
  TrendingUp,
  ArrowRight,
  ShieldCheck,
  Award,
  CheckCircle2,
  Users,
  Compass,
  FileCheck2,
  ExternalLink,
  MapPin,
  Clock
} from 'lucide-react';

const Home = () => {
  const [featuredInternships, setFeaturedInternships] = useState([]);
  const [featuredJobs, setFeaturedJobs] = useState([]);
  const [stats, setStats] = useState({
    students: 1250,
    companies: 85,
    internships: 42,
    jobs: 38
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.allSettled([
      internshipAPI.getAll(),
      jobAPI.getAll(),
      adminAPI.getDashboardStats()
    ]).then(([internshipsRes, jobsRes, statsRes]) => {
      if (internshipsRes.status === 'fulfilled' && internshipsRes.value.success) {
        setFeaturedInternships(internshipsRes.value.data.slice(0, 3));
      }
      if (jobsRes.status === 'fulfilled' && jobsRes.value.success) {
        setFeaturedJobs(jobsRes.value.data.slice(0, 3));
      }
      if (statsRes.status === 'fulfilled' && statsRes.value.success) {
        const d = statsRes.value.data;
        setStats({
          students: d.users?.totalStudents || 0,
          companies: d.users?.totalCompanies || 0,
          internships: d.internships?.totalInternships || 0,
          jobs: d.jobs?.totalJobs || 0
        });
      }
      setLoading(false);
    });
  }, []);

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      <Navbar />

      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-b from-indigo-900 via-slate-900 to-slate-950 text-white py-20 lg:py-28">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_80%_at_50%_-20%,rgba(120,119,198,0.25),rgba(255,255,255,0))]" />
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center max-w-3xl mx-auto">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-indigo-500/20 border border-indigo-400/30 text-indigo-300 text-xs font-semibold uppercase tracking-wider mb-6 animate-pulse">
              <Sparkles className="w-3.5 h-3.5" /> Next-Gen Academia–Industry Gateway
            </div>

            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight leading-tight mb-6">
              Connecting <span className="bg-gradient-to-r from-indigo-400 via-purple-300 to-pink-400 bg-clip-text text-transparent">Academia</span> with <span className="bg-gradient-to-r from-cyan-400 to-indigo-300 bg-clip-text text-transparent">Industry</span>
            </h1>

            <p className="text-lg sm:text-xl text-slate-300 mb-10 leading-relaxed font-normal">
              Empowering students with explainable skill mapping, direct internship pipelines, and placement opportunities tailored to real industry expectations.
            </p>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link
                to="/register"
                className="w-full sm:w-auto px-8 py-3.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-semibold shadow-lg shadow-indigo-600/30 flex items-center justify-center gap-2 transition hover:-translate-y-0.5"
              >
                Get Started <ArrowRight className="w-4 h-4" />
              </Link>
              <Link
                to="/internships"
                className="w-full sm:w-auto px-8 py-3.5 rounded-xl bg-slate-800/80 hover:bg-slate-700/80 border border-slate-700 text-slate-200 font-semibold flex items-center justify-center gap-2 transition hover:-translate-y-0.5"
              >
                Explore Opportunities
              </Link>
              <Link
                to="/register"
                className="w-full sm:w-auto px-8 py-3.5 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-semibold shadow-lg shadow-teal-900/30 flex items-center justify-center gap-2 transition hover:-translate-y-0.5"
              >
                For Companies
              </Link>
            </div>
          </div>

          {/* Database Driven Metric Counters */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-16 max-w-4xl mx-auto pt-8 border-t border-slate-800/80">
            <div className="p-4 rounded-2xl bg-white/5 border border-white/10 text-center backdrop-blur-sm">
              <p className="text-3xl font-extrabold text-white">{stats.students}+</p>
              <p className="text-xs font-medium text-slate-400 mt-1 uppercase tracking-wider">Active Students</p>
            </div>
            <div className="p-4 rounded-2xl bg-white/5 border border-white/10 text-center backdrop-blur-sm">
              <p className="text-3xl font-extrabold text-indigo-400">{stats.companies}+</p>
              <p className="text-xs font-medium text-slate-400 mt-1 uppercase tracking-wider">Partner Companies</p>
            </div>
            <div className="p-4 rounded-2xl bg-white/5 border border-white/10 text-center backdrop-blur-sm">
              <p className="text-3xl font-extrabold text-emerald-400">{stats.internships}+</p>
              <p className="text-xs font-medium text-slate-400 mt-1 uppercase tracking-wider">Internships</p>
            </div>
            <div className="p-4 rounded-2xl bg-white/5 border border-white/10 text-center backdrop-blur-sm">
              <p className="text-3xl font-extrabold text-pink-400">{stats.jobs}+</p>
              <p className="text-xs font-medium text-slate-400 mt-1 uppercase tracking-wider">Placement Roles</p>
            </div>
          </div>
        </div>
      </section>

      {/* Core Platform Pillars */}
      <section className="py-16 bg-white border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <h2 className="text-xs font-bold uppercase tracking-widest text-indigo-600 mb-2">Platform Capabilities</h2>
            <p className="text-3xl font-bold text-slate-900 tracking-tight">Engineered to Close the Academic–Industry Divide</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Pillar 1 */}
            <div className="p-6 rounded-2xl bg-slate-50 border border-slate-200 hover:border-indigo-300 hover:shadow-md transition">
              <div className="w-12 h-12 rounded-xl bg-indigo-100 text-indigo-600 flex items-center justify-center mb-4">
                <Sparkles className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-slate-900 mb-2">Explainable Skill Mapping</h3>
              <p className="text-sm text-slate-600 leading-relaxed">
                Clear match percentages calculated dynamically by comparing student competencies with company requirements. No opaque black boxes.
              </p>
            </div>

            {/* Pillar 2 */}
            <div className="p-6 rounded-2xl bg-slate-50 border border-slate-200 hover:border-indigo-300 hover:shadow-md transition">
              <div className="w-12 h-12 rounded-xl bg-emerald-100 text-emerald-600 flex items-center justify-center mb-4">
                <Briefcase className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-slate-900 mb-2">Direct Internship Pipeline</h3>
              <p className="text-sm text-slate-600 leading-relaxed">
                Students apply directly to curated technical internships with resume attachment, cover letters, and live multi-stage application tracking.
              </p>
            </div>

            {/* Pillar 3 */}
            <div className="p-6 rounded-2xl bg-slate-50 border border-slate-200 hover:border-indigo-300 hover:shadow-md transition">
              <div className="w-12 h-12 rounded-xl bg-violet-100 text-violet-600 flex items-center justify-center mb-4">
                <Award className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-slate-900 mb-2">Campus Placement Marketplace</h3>
              <p className="text-sm text-slate-600 leading-relaxed">
                Full-time campus drives and placement roles with defined salary packages, eligibility thresholds, and skill-ranked candidate shortlisting.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works Workflow */}
      <section className="py-16 bg-slate-50 border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <h2 className="text-xs font-bold uppercase tracking-widest text-indigo-600 mb-2">End-to-End Workflow</h2>
            <p className="text-3xl font-bold text-slate-900 tracking-tight">How AcademiaSync Connects Students & Industry</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-5 gap-4 relative">
            {[
              { step: '01', title: 'Create Profile', desc: 'Register as Student or Industry Partner with verification.' },
              { step: '02', title: 'Add Skills', desc: 'Catalog academic technical skills, projects, and certifications.' },
              { step: '03', title: 'Discover Matches', desc: 'Real-time skill matching algorithms rank relevant openings.' },
              { step: '04', title: 'Apply & Review', desc: 'One-click application with recruiter status updates.' },
              { step: '05', title: 'Connect & Hire', desc: 'Conduct interviews and offer final placements seamlessly.' }
            ].map((item, idx) => (
              <div key={idx} className="p-5 rounded-2xl bg-white border border-slate-200 shadow-sm relative text-center">
                <span className="text-3xl font-black text-indigo-100 block mb-2">{item.step}</span>
                <h4 className="text-sm font-bold text-slate-900 mb-1">{item.title}</h4>
                <p className="text-xs text-slate-500 leading-normal">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Live Opportunities */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
            <div>
              <h2 className="text-2xl font-bold text-slate-900">Featured Active Internships</h2>
              <p className="text-sm text-slate-500">Live listings verified from industry partners</p>
            </div>
            <Link to="/internships" className="inline-flex items-center gap-1.5 text-sm font-semibold text-indigo-600 hover:text-indigo-700">
              View All Internships <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {featuredInternships.map((internship) => (
              <div key={internship.id} className="p-5 rounded-2xl border border-slate-200 bg-white hover:shadow-lg hover:border-indigo-200 transition flex flex-col justify-between">
                <div>
                  <div className="flex items-start justify-between gap-3 mb-3">
                    <div className="w-12 h-12 rounded-xl bg-slate-100 p-2 flex items-center justify-center border border-slate-200 shrink-0">
                      {internship.company_logo ? (
                        <img src={internship.company_logo} alt={internship.company_name} className="max-h-full object-contain" />
                      ) : (
                        <Building2 className="w-6 h-6 text-slate-500" />
                      )}
                    </div>
                    <span className="px-2.5 py-1 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
                      {internship.work_mode}
                    </span>
                  </div>

                  <h3 className="font-bold text-slate-900 text-base mb-1 line-clamp-1">{internship.title}</h3>
                  <p className="text-xs text-indigo-600 font-medium mb-3">{internship.company_name}</p>

                  <div className="flex items-center gap-4 text-xs text-slate-500 mb-4">
                    <span className="flex items-center gap-1"><MapPin className="w-3.5 h-3.5" /> {internship.location}</span>
                    <span className="flex items-center gap-1"><Clock className="w-3.5 h-3.5" /> {internship.duration}</span>
                  </div>

                  {/* Skills tags */}
                  <div className="flex flex-wrap gap-1.5 mb-4">
                    {internship.skillsList?.slice(0, 4).map((sk, idx) => (
                      <span key={idx} className="px-2 py-0.5 rounded bg-slate-100 text-[11px] font-medium text-slate-700">
                        {sk}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
                  <span className="text-xs font-bold text-slate-800">{internship.stipend}</span>
                  <Link
                    to={`/student/internship/${internship.id}`}
                    className="text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-700 px-3 py-1.5 rounded-lg transition"
                  >
                    View Details
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <Footer />
    </div>
  );
};

export default Home;