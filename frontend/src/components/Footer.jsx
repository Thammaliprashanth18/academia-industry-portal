import React from 'react';
import { Link } from 'react-router-dom';
import { GraduationCap, Heart, Mail, Phone, MapPin, Globe, Shield, Sparkles } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="bg-slate-900 text-slate-300 pt-12 pb-8 border-t border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8 pb-10 border-b border-slate-800">
          
          {/* Brand & Mission */}
          <div className="lg:col-span-2 space-y-4">
            <Link to="/" className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-indigo-600 flex items-center justify-center text-white shadow-lg shadow-indigo-500/30">
                <GraduationCap className="w-6 h-6" />
              </div>
              <span className="text-xl font-bold text-white tracking-tight">
                Academia<span className="text-indigo-400">Sync</span>
              </span>
            </Link>
            <p className="text-sm text-slate-400 max-w-sm leading-relaxed">
              Bridging academic learning with industry demands through intelligent skill mapping, verified internships, real-world projects, and placement pathways.
            </p>
            <div className="flex items-center gap-4 text-xs text-slate-400">
              <span className="flex items-center gap-1"><Shield className="w-4 h-4 text-indigo-400" /> Verified Companies</span>
              <span className="flex items-center gap-1"><Sparkles className="w-4 h-4 text-indigo-400" /> Explainable Skill Match</span>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-sm font-semibold text-white uppercase tracking-wider mb-4">
              Explore
            </h4>
            <ul className="space-y-2.5 text-sm">
              <li>
                <Link to="/internships" className="hover:text-white transition">
                  Internships Marketplace
                </Link>
              </li>
              <li>
                <Link to="/jobs" className="hover:text-white transition">
                  Placement Opportunities
                </Link>
              </li>
              <li>
                <Link to="/student/skills" className="hover:text-white transition">
                  Skill Assessment
                </Link>
              </li>
              <li>
                <Link to="/student/skill-gap" className="hover:text-white transition">
                  Skill Gap Analytics
                </Link>
              </li>
            </ul>
          </div>

          {/* For Employers & Academia */}
          <div>
            <h4 className="text-sm font-semibold text-white uppercase tracking-wider mb-4">
              For Industry & Colleges
            </h4>
            <ul className="space-y-2.5 text-sm">
              <li>
                <Link to="/register" className="hover:text-white transition">
                  Employer Registration
                </Link>
              </li>
              <li>
                <Link to="/company/dashboard" className="hover:text-white transition">
                  Post Opportunities
                </Link>
              </li>
              <li>
                <Link to="/company/students" className="hover:text-white transition">
                  Candidate Discovery
                </Link>
              </li>
              <li>
                <Link to="/admin/dashboard" className="hover:text-white transition">
                  Institution Portal
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact & Support */}
          <div>
            <h4 className="text-sm font-semibold text-white uppercase tracking-wider mb-4">
              Support
            </h4>
            <ul className="space-y-2.5 text-sm">
              <li className="flex items-center gap-2 text-slate-400">
                <Mail className="w-4 h-4 text-indigo-400 shrink-0" /> support@academiasync.edu
              </li>
              <li className="flex items-center gap-2 text-slate-400">
                <Phone className="w-4 h-4 text-indigo-400 shrink-0" /> +91 80 2345 6789
              </li>
              <li className="flex items-center gap-2 text-slate-400">
                <MapPin className="w-4 h-4 text-indigo-400 shrink-0" /> Innovation Hub, Tech City
              </li>
            </ul>
          </div>

        </div>

        {/* Copyright */}
        <div className="pt-6 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-500 gap-4">
          <p>© {new Date().getFullYear()} AcademiaSync Collaboration Portal. All rights reserved.</p>
          <div className="flex items-center gap-6">
            <span className="hover:text-slate-400 cursor-pointer">Privacy Policy</span>
            <span className="hover:text-slate-400 cursor-pointer">Terms of Service</span>
            <span className="hover:text-slate-400 cursor-pointer">Academic Guidelines</span>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
