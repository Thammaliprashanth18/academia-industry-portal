import React, { useState, useEffect, useRef } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import { notificationAPI } from '../services/api';
import {
  GraduationCap,
  Briefcase,
  Layers,
  Bell,
  User,
  LogOut,
  Menu,
  X,
  ChevronDown,
  ShieldCheck,
  FileText,
  Sparkles,
  Building2,
  CheckCircle2,
  ExternalLink
} from 'lucide-react';

const Navbar = () => {
  const { user, isAuthenticated, logout } = useAuth();
  const { info } = useToast();
  const navigate = useNavigate();
  const location = useLocation();

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [profileDropdownOpen, setProfileDropdownOpen] = useState(false);
  const [notifDropdownOpen, setNotifDropdownOpen] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);

  const profileRef = useRef(null);
  const notifRef = useRef(null);

  // Fetch notifications if logged in
  useEffect(() => {
    if (isAuthenticated) {
      notificationAPI.getNotifications()
        .then(res => {
          if (res.success) {
            setNotifications(res.data || []);
            setUnreadCount(res.unreadCount || 0);
          }
        })
        .catch(() => {});
    }
  }, [isAuthenticated, location.pathname]);

  // Close dropdowns on outside click
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (profileRef.current && !profileRef.current.contains(event.target)) {
        setProfileDropdownOpen(false);
      }
      if (notifRef.current && !notifRef.current.contains(event.target)) {
        setNotifDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleLogout = () => {
    logout();
    info('Logged out successfully.');
    navigate('/login');
  };

  const handleMarkAllRead = async () => {
    try {
      await notificationAPI.markAllRead();
      setUnreadCount(0);
      setNotifications(prev => prev.map(n => ({ ...n, is_read: true })));
    } catch (e) {}
  };

  const handleNotifClick = async (notif) => {
    if (!notif.is_read) {
      await notificationAPI.markRead(notif.id).catch(() => {});
      setUnreadCount(prev => Math.max(0, prev - 1));
      setNotifications(prev => prev.map(n => n.id === notif.id ? { ...n, is_read: true } : n));
    }
    setNotifDropdownOpen(false);
    if (notif.link) {
      navigate(notif.link);
    }
  };

  const isActive = (path) => location.pathname === path;

  return (
    <nav className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">
          {/* Brand Logo */}
          <Link to="/" className="flex items-center gap-3 group">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-indigo-600 to-violet-600 flex items-center justify-center text-white shadow-md shadow-indigo-200 group-hover:scale-105 transition-transform">
              <GraduationCap className="w-6 h-6" />
            </div>
            <div>
              <span className="text-lg font-bold bg-gradient-to-r from-slate-900 to-indigo-950 bg-clip-text text-transparent">
                Academia<span className="text-indigo-600">Sync</span>
              </span>
              <span className="block text-[10px] tracking-wider uppercase font-semibold text-slate-500">
                Industry Collaboration Portal
              </span>
            </div>
          </Link>

          {/* Center Navigation Links */}
          <div className="hidden md:flex items-center gap-1">
            <Link
              to="/"
              className={`px-3 py-2 rounded-lg text-sm font-medium transition ${
                isActive('/') ? 'text-indigo-600 bg-indigo-50/80 font-semibold' : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100/70'
              }`}
            >
              Home
            </Link>
            <Link
              to="/internships"
              className={`px-3 py-2 rounded-lg text-sm font-medium transition ${
                isActive('/internships') ? 'text-indigo-600 bg-indigo-50/80 font-semibold' : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100/70'
              }`}
            >
              Internships
            </Link>
            <Link
              to="/jobs"
              className={`px-3 py-2 rounded-lg text-sm font-medium transition ${
                isActive('/jobs') ? 'text-indigo-600 bg-indigo-50/80 font-semibold' : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100/70'
              }`}
            >
              Placements & Jobs
            </Link>

            {/* Role Shortcut based on login */}
            {isAuthenticated && user?.role === 'student' && (
              <Link
                to="/student/dashboard"
                className={`px-3 py-2 rounded-lg text-sm font-medium transition ${
                  location.pathname.startsWith('/student') ? 'text-indigo-600 bg-indigo-50/80 font-semibold' : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100/70'
                }`}
              >
                Student Hub
              </Link>
            )}

            {isAuthenticated && user?.role === 'company' && (
              <Link
                to="/company/dashboard"
                className={`px-3 py-2 rounded-lg text-sm font-medium transition ${
                  location.pathname.startsWith('/company') ? 'text-indigo-600 bg-indigo-50/80 font-semibold' : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100/70'
                }`}
              >
                Recruiter Portal
              </Link>
            )}

            {isAuthenticated && user?.role === 'admin' && (
              <Link
                to="/admin/dashboard"
                className={`px-3 py-2 rounded-lg text-sm font-medium transition ${
                  location.pathname.startsWith('/admin') ? 'text-indigo-600 bg-indigo-50/80 font-semibold' : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100/70'
                }`}
              >
                Admin Control
              </Link>
            )}
          </div>

          {/* Right Action Section */}
          <div className="hidden md:flex items-center gap-3">
            {isAuthenticated ? (
              <>
                {/* Notification Bell */}
                <div className="relative" ref={notifRef}>
                  <button
                    onClick={() => setNotifDropdownOpen(!notifDropdownOpen)}
                    className="p-2 text-slate-600 hover:text-indigo-600 hover:bg-slate-100 rounded-lg relative transition"
                    title="Notifications"
                  >
                    <Bell className="w-5 h-5" />
                    {unreadCount > 0 && (
                      <span className="absolute top-1 right-1 w-4 h-4 bg-rose-500 text-white text-[10px] font-bold rounded-full flex items-center justify-center animate-pulse">
                        {unreadCount > 9 ? '9+' : unreadCount}
                      </span>
                    )}
                  </button>

                  {/* Notification Dropdown Menu */}
                  {notifDropdownOpen && (
                    <div className="absolute right-0 mt-2 w-80 sm:w-96 bg-white rounded-2xl shadow-xl border border-slate-200 overflow-hidden z-50 animate-in fade-in-50 zoom-in-95 duration-150">
                      <div className="px-4 py-3 bg-slate-50 border-b border-slate-100 flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <h4 className="text-sm font-bold text-slate-800">Notifications</h4>
                          {unreadCount > 0 && (
                            <span className="px-2 py-0.5 bg-indigo-100 text-indigo-700 text-xs font-semibold rounded-full">
                              {unreadCount} new
                            </span>
                          )}
                        </div>
                        {unreadCount > 0 && (
                          <button
                            onClick={handleMarkAllRead}
                            className="text-xs text-indigo-600 hover:text-indigo-800 font-medium"
                          >
                            Mark all read
                          </button>
                        )}
                      </div>

                      <div className="max-h-80 overflow-y-auto divide-y divide-slate-100">
                        {notifications.length === 0 ? (
                          <div className="py-8 text-center text-sm text-slate-500">
                            No notifications yet
                          </div>
                        ) : (
                          notifications.map((notif) => (
                            <div
                              key={notif.id}
                              onClick={() => handleNotifClick(notif)}
                              className={`p-3 text-left hover:bg-slate-50 transition cursor-pointer flex gap-3 ${
                                !notif.is_read ? 'bg-indigo-50/40' : ''
                              }`}
                            >
                              <div className="w-2 h-2 rounded-full bg-indigo-600 mt-2 shrink-0 opacity-80" />
                              <div className="flex-1">
                                <p className="text-xs font-semibold text-slate-900">{notif.title}</p>
                                <p className="text-xs text-slate-600 mt-0.5 leading-snug">{notif.message}</p>
                                <span className="text-[10px] text-slate-400 mt-1 block">
                                  {new Date(notif.created_at).toLocaleDateString()}
                                </span>
                              </div>
                            </div>
                          ))
                        )}
                      </div>
                    </div>
                  )}
                </div>

                {/* Profile Dropdown */}
                <div className="relative" ref={profileRef}>
                  <button
                    onClick={() => setProfileDropdownOpen(!profileDropdownOpen)}
                    className="flex items-center gap-2.5 p-1.5 rounded-full hover:bg-slate-100 transition border border-slate-200"
                  >
                    <img
                      src={user?.avatar_url || `https://ui-avatars.com/api/?name=${encodeURIComponent(user?.name || 'User')}`}
                      alt={user?.name}
                      className="w-8 h-8 rounded-full object-cover ring-2 ring-indigo-500/20"
                    />
                    <div className="text-left hidden lg:block pr-1">
                      <p className="text-xs font-semibold text-slate-800 leading-tight">{user?.name?.split(' ')[0]}</p>
                      <span className="text-[10px] font-medium text-indigo-600 uppercase tracking-wider">{user?.role}</span>
                    </div>
                    <ChevronDown className="w-4 h-4 text-slate-500" />
                  </button>

                  {profileDropdownOpen && (
                    <div className="absolute right-0 mt-2 w-56 bg-white rounded-2xl shadow-xl border border-slate-200 py-2 z-50 animate-in fade-in-50 zoom-in-95 duration-150">
                      <div className="px-4 py-2 border-b border-slate-100">
                        <p className="text-sm font-semibold text-slate-900 truncate">{user?.name}</p>
                        <p className="text-xs text-slate-500 truncate">{user?.email}</p>
                        <span className="inline-block mt-1 px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider bg-indigo-100 text-indigo-700">
                          {user?.role} Account
                        </span>
                      </div>

                      {user?.role === 'student' && (
                        <>
                          <Link
                            to="/student/dashboard"
                            onClick={() => setProfileDropdownOpen(false)}
                            className="flex items-center gap-2.5 px-4 py-2 text-sm text-slate-700 hover:bg-slate-50 hover:text-indigo-600 transition"
                          >
                            <Layers className="w-4 h-4 text-slate-400" /> Dashboard
                          </Link>
                          <Link
                            to="/student/profile"
                            onClick={() => setProfileDropdownOpen(false)}
                            className="flex items-center gap-2.5 px-4 py-2 text-sm text-slate-700 hover:bg-slate-50 hover:text-indigo-600 transition"
                          >
                            <User className="w-4 h-4 text-slate-400" /> My Profile & Resume
                          </Link>
                          <Link
                            to="/student/skills"
                            onClick={() => setProfileDropdownOpen(false)}
                            className="flex items-center gap-2.5 px-4 py-2 text-sm text-slate-700 hover:bg-slate-50 hover:text-indigo-600 transition"
                          >
                            <Sparkles className="w-4 h-4 text-slate-400" /> Skill Mapping
                          </Link>
                          <Link
                            to="/student/applications"
                            onClick={() => setProfileDropdownOpen(false)}
                            className="flex items-center gap-2.5 px-4 py-2 text-sm text-slate-700 hover:bg-slate-50 hover:text-indigo-600 transition"
                          >
                            <FileText className="w-4 h-4 text-slate-400" /> My Applications
                          </Link>
                        </>
                      )}

                      {user?.role === 'company' && (
                        <>
                          <Link
                            to="/company/dashboard"
                            onClick={() => setProfileDropdownOpen(false)}
                            className="flex items-center gap-2.5 px-4 py-2 text-sm text-slate-700 hover:bg-slate-50 hover:text-indigo-600 transition"
                          >
                            <Layers className="w-4 h-4 text-slate-400" /> Dashboard
                          </Link>
                          <Link
                            to="/company/profile"
                            onClick={() => setProfileDropdownOpen(false)}
                            className="flex items-center gap-2.5 px-4 py-2 text-sm text-slate-700 hover:bg-slate-50 hover:text-indigo-600 transition"
                          >
                            <Building2 className="w-4 h-4 text-slate-400" /> Company Profile
                          </Link>
                          <Link
                            to="/company/applications"
                            onClick={() => setProfileDropdownOpen(false)}
                            className="flex items-center gap-2.5 px-4 py-2 text-sm text-slate-700 hover:bg-slate-50 hover:text-indigo-600 transition"
                          >
                            <FileText className="w-4 h-4 text-slate-400" /> Candidate Applications
                          </Link>
                        </>
                      )}

                      {user?.role === 'admin' && (
                        <Link
                          to="/admin/dashboard"
                          onClick={() => setProfileDropdownOpen(false)}
                          className="flex items-center gap-2.5 px-4 py-2 text-sm text-slate-700 hover:bg-slate-50 hover:text-indigo-600 transition"
                        >
                          <ShieldCheck className="w-4 h-4 text-slate-400" /> Admin Dashboard
                        </Link>
                      )}

                      <div className="border-t border-slate-100 my-1" />
                      <button
                        onClick={handleLogout}
                        className="w-full flex items-center gap-2.5 px-4 py-2 text-sm text-rose-600 hover:bg-rose-50 transition"
                      >
                        <LogOut className="w-4 h-4" /> Sign Out
                      </button>
                    </div>
                  )}
                </div>
              </>
            ) : (
              <div className="flex items-center gap-2">
                <Link
                  to="/login"
                  className="px-4 py-2 text-sm font-medium text-slate-700 hover:text-indigo-600 hover:bg-slate-100 rounded-lg transition"
                >
                  Sign In
                </Link>
                <Link
                  to="/register"
                  className="px-4 py-2 text-sm font-semibold text-white bg-indigo-600 hover:bg-indigo-700 rounded-lg shadow-sm shadow-indigo-200 transition"
                >
                  Get Started
                </Link>
              </div>
            )}
          </div>

          {/* Mobile menu button */}
          <div className="flex md:hidden items-center gap-2">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 text-slate-600 hover:text-slate-900 rounded-lg hover:bg-slate-100"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-slate-200 bg-white px-4 pt-2 pb-4 space-y-1 shadow-lg">
          <Link
            to="/"
            onClick={() => setMobileMenuOpen(false)}
            className="block px-3 py-2 rounded-lg text-base font-medium text-slate-700 hover:bg-indigo-50 hover:text-indigo-600"
          >
            Home
          </Link>
          <Link
            to="/internships"
            onClick={() => setMobileMenuOpen(false)}
            className="block px-3 py-2 rounded-lg text-base font-medium text-slate-700 hover:bg-indigo-50 hover:text-indigo-600"
          >
            Internships
          </Link>
          <Link
            to="/jobs"
            onClick={() => setMobileMenuOpen(false)}
            className="block px-3 py-2 rounded-lg text-base font-medium text-slate-700 hover:bg-indigo-50 hover:text-indigo-600"
          >
            Placements & Jobs
          </Link>

          {isAuthenticated ? (
            <>
              <div className="border-t border-slate-100 pt-2" />
              {user?.role === 'student' && (
                <>
                  <Link
                    to="/student/dashboard"
                    onClick={() => setMobileMenuOpen(false)}
                    className="block px-3 py-2 rounded-lg text-base font-medium text-slate-700 hover:bg-indigo-50 hover:text-indigo-600"
                  >
                    Student Dashboard
                  </Link>
                  <Link
                    to="/student/profile"
                    onClick={() => setMobileMenuOpen(false)}
                    className="block px-3 py-2 rounded-lg text-base font-medium text-slate-700 hover:bg-indigo-50 hover:text-indigo-600"
                  >
                    My Profile
                  </Link>
                  <Link
                    to="/student/skills"
                    onClick={() => setMobileMenuOpen(false)}
                    className="block px-3 py-2 rounded-lg text-base font-medium text-slate-700 hover:bg-indigo-50 hover:text-indigo-600"
                  >
                    My Skills & Mapping
                  </Link>
                  <Link
                    to="/student/applications"
                    onClick={() => setMobileMenuOpen(false)}
                    className="block px-3 py-2 rounded-lg text-base font-medium text-slate-700 hover:bg-indigo-50 hover:text-indigo-600"
                  >
                    My Applications
                  </Link>
                </>
              )}

              {user?.role === 'company' && (
                <>
                  <Link
                    to="/company/dashboard"
                    onClick={() => setMobileMenuOpen(false)}
                    className="block px-3 py-2 rounded-lg text-base font-medium text-slate-700 hover:bg-indigo-50 hover:text-indigo-600"
                  >
                    Company Dashboard
                  </Link>
                  <Link
                    to="/company/internships"
                    onClick={() => setMobileMenuOpen(false)}
                    className="block px-3 py-2 rounded-lg text-base font-medium text-slate-700 hover:bg-indigo-50 hover:text-indigo-600"
                  >
                    Manage Postings
                  </Link>
                  <Link
                    to="/company/applications"
                    onClick={() => setMobileMenuOpen(false)}
                    className="block px-3 py-2 rounded-lg text-base font-medium text-slate-700 hover:bg-indigo-50 hover:text-indigo-600"
                  >
                    Applicants Review
                  </Link>
                </>
              )}

              {user?.role === 'admin' && (
                <Link
                  to="/admin/dashboard"
                  onClick={() => setMobileMenuOpen(false)}
                  className="block px-3 py-2 rounded-lg text-base font-medium text-slate-700 hover:bg-indigo-50 hover:text-indigo-600"
                >
                  Admin Dashboard
                </Link>
              )}

              <div className="border-t border-slate-100 pt-2" />
              <button
                onClick={() => {
                  setMobileMenuOpen(false);
                  handleLogout();
                }}
                className="w-full text-left px-3 py-2 rounded-lg text-base font-medium text-rose-600 hover:bg-rose-50"
              >
                Sign Out
              </button>
            </>
          ) : (
            <div className="border-t border-slate-100 pt-3 flex flex-col gap-2">
              <Link
                to="/login"
                onClick={() => setMobileMenuOpen(false)}
                className="w-full text-center py-2 text-slate-700 border border-slate-300 rounded-lg font-medium"
              >
                Sign In
              </Link>
              <Link
                to="/register"
                onClick={() => setMobileMenuOpen(false)}
                className="w-full text-center py-2 text-white bg-indigo-600 rounded-lg font-semibold"
              >
                Get Started
              </Link>
            </div>
          )}
        </div>
      )}
    </nav>
  );
};

export default Navbar;