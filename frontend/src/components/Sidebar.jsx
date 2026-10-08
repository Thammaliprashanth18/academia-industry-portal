import React from 'react';
import { NavLink } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import {
  LayoutDashboard,
  User,
  Sparkles,
  Compass,
  Briefcase,
  FileCheck,
  PlusCircle,
  Users,
  Building2,
  ShieldCheck,
  Layers,
  Award,
  BookOpen,
  FolderGit2
} from 'lucide-react';

const Sidebar = () => {
  const { user } = useAuth();
  const role = user?.role;

  const studentLinks = [
    { to: '/student/dashboard', icon: LayoutDashboard, label: 'Dashboard' },
    { to: '/student/profile', icon: User, label: 'Profile & Resume' },
    { to: '/student/skills', icon: Sparkles, label: 'Technical Skills' },
    { to: '/student/skill-gap', icon: Compass, label: 'Skill Gap Analysis' },
    { to: '/student/roadmap', icon: BookOpen, label: 'Learning Roadmap' },
    { to: '/student/internships', icon: Briefcase, label: 'Browse Internships' },
    { to: '/student/jobs', icon: Award, label: 'Browse Placements' },
    { to: '/student/applications', icon: FileCheck, label: 'My Applications' }
  ];

  const companyLinks = [
    { to: '/company/dashboard', icon: LayoutDashboard, label: 'Overview' },
    { to: '/company/internships/new', icon: PlusCircle, label: 'Post Internship' },
    { to: '/company/jobs/new', icon: PlusCircle, label: 'Post Placement / Job' },
    { to: '/company/internships', icon: Layers, label: 'Manage Postings' },
    { to: '/company/applications', icon: FileCheck, label: 'Applicant Review' },
    { to: '/company/students', icon: Users, label: 'Matched Talent Pool' },
    { to: '/company/profile', icon: Building2, label: 'Company Profile' }
  ];

  const adminLinks = [
    { to: '/admin/dashboard', icon: ShieldCheck, label: 'System Overview' },
    { to: '/admin/users', icon: Users, label: 'Manage Users' },
    { to: '/admin/companies', icon: Building2, label: 'Verify Companies' },
    { to: '/admin/postings', icon: Layers, label: 'Moderate Postings' },
    { to: '/admin/skills', icon: Sparkles, label: 'Skills Catalog' }
  ];

  const links = role === 'student' ? studentLinks : role === 'company' ? companyLinks : adminLinks;

  return (
    <aside className="w-64 bg-white border-r border-slate-200 min-h-[calc(100vh-4rem)] p-4 flex flex-col justify-between shrink-0 hidden md:flex">
      <div>
        {/* User Mini Card */}
        <div className="p-3 mb-4 rounded-xl bg-slate-50 border border-slate-200/70 flex items-center gap-3">
          <img
            src={user?.avatar_url || `https://ui-avatars.com/api/?name=${encodeURIComponent(user?.name || 'User')}`}
            alt={user?.name}
            className="w-10 h-10 rounded-full object-cover ring-2 ring-indigo-500/20"
          />
          <div className="overflow-hidden">
            <p className="text-sm font-bold text-slate-800 truncate">{user?.name}</p>
            <span className="inline-block px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider bg-indigo-100 text-indigo-700">
              {role}
            </span>
          </div>
        </div>

        {/* Links navigation */}
        <div className="space-y-1">
          <p className="px-3 text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-2">
            Navigation
          </p>
          {links.map((link) => {
            const Icon = link.icon;
            return (
              <NavLink
                key={link.to}
                to={link.to}
                end={link.to === '/student/dashboard' || link.to === '/company/dashboard' || link.to === '/admin/dashboard'}
                className={({ isActive }) =>
                  `flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition ${
                    isActive
                      ? 'bg-indigo-600 text-white shadow-sm shadow-indigo-200 font-semibold'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                  }`
                }
              >
                <Icon className="w-4 h-4 shrink-0" />
                <span>{link.label}</span>
              </NavLink>
            );
          })}
        </div>
      </div>

      {/* Bottom info banner */}
      <div className="p-3 rounded-xl bg-gradient-to-br from-indigo-50 to-violet-50 border border-indigo-100/80 text-xs text-indigo-950">
        <p className="font-bold flex items-center gap-1 text-indigo-900">
          <Sparkles className="w-3.5 h-3.5 text-indigo-600" /> AI Skill Engine
        </p>
        <p className="text-[11px] text-slate-600 mt-1 leading-normal">
          Real-time matchmaking between academic profiles & industry requirements.
        </p>
      </div>
    </aside>
  );
};

export default Sidebar;
