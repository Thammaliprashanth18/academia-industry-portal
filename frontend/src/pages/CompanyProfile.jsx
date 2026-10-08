import React, { useState, useEffect } from 'react';
import DashboardLayout from '../layouts/DashboardLayout';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import { companyAPI } from '../services/api';
import {
  Building2,
  Globe,
  Mail,
  Phone,
  MapPin,
  Upload,
  CheckCircle2,
  Loader2,
  ShieldCheck
} from 'lucide-react';

const CompanyProfile = () => {
  const { refreshUser } = useAuth();
  const { success, error } = useToast();

  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [logoUploading, setLogoUploading] = useState(false);

  const [formData, setFormData] = useState({
    company_name: '',
    industry_type: '',
    company_size: '',
    website: '',
    location: '',
    contact_email: '',
    contact_phone: '',
    description: ''
  });

  const fetchProfile = async () => {
    try {
      const res = await companyAPI.getProfile();
      if (res.success) {
        setProfile(res.data);
        setFormData({
          company_name: res.data.company_name || '',
          industry_type: res.data.industry_type || '',
          company_size: res.data.company_size || '',
          website: res.data.website || '',
          location: res.data.location || '',
          contact_email: res.data.contact_email || '',
          contact_phone: res.data.contact_phone || '',
          description: res.data.description || ''
        });
      }
    } catch (err) {
      error('Failed to load company profile.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProfile();
  }, []);

  const handleChange = (e) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      await companyAPI.updateProfile(formData);
      success('Company profile updated successfully!');
      fetchProfile();
      refreshUser();
    } catch (err) {
      error(err.message || 'Failed to update profile.');
    } finally {
      setSaving(false);
    }
  };

  const handleLogoUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const data = new FormData();
    data.append('logo', file);

    setLogoUploading(true);
    try {
      await companyAPI.uploadLogo(data);
      success('Company logo updated!');
      fetchProfile();
      refreshUser();
    } catch (err) {
      error(err.message || 'Failed to upload logo.');
    } finally {
      setLogoUploading(false);
    }
  };

  if (loading) {
    return (
      <DashboardLayout>
        <div className="py-20 flex flex-col items-center justify-center">
          <Loader2 className="w-10 h-10 text-indigo-600 animate-spin mb-3" />
          <p className="text-xs font-semibold text-slate-500">Loading company profile...</p>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="max-w-4xl mx-auto space-y-6">

        {/* Header Hero */}
        <div className="bg-white p-6 sm:p-8 rounded-2xl border border-slate-200 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-6">
          <div className="flex items-center gap-5">
            <div className="w-20 h-20 rounded-2xl bg-slate-100 border border-slate-200 p-2 flex items-center justify-center relative overflow-hidden shrink-0">
              {profile?.logo_url ? (
                <img src={profile.logo_url} alt={profile.company_name} className="max-h-full object-contain" />
              ) : (
                <Building2 className="w-10 h-10 text-slate-400" />
              )}
            </div>

            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-xl font-bold text-slate-900">{profile?.company_name}</h1>
                <span className="px-2 py-0.5 rounded text-[10px] uppercase font-bold bg-emerald-100 text-emerald-800 flex items-center gap-1">
                  <ShieldCheck className="w-3 h-3" /> {profile?.verification_status || 'Verified'}
                </span>
              </div>
              <p className="text-xs text-slate-500 mt-1">{profile?.industry_type} • {profile?.location}</p>
              <p className="text-[11px] text-slate-400 mt-0.5">{profile?.company_size}</p>
            </div>
          </div>

          <div>
            <label className="cursor-pointer px-4 py-2 rounded-xl bg-indigo-50 hover:bg-indigo-100 text-indigo-700 text-xs font-bold flex items-center gap-1.5 transition">
              {logoUploading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Upload className="w-4 h-4" />}
              <span>Upload New Logo</span>
              <input type="file" accept="image/*" onChange={handleLogoUpload} className="hidden" />
            </label>
          </div>
        </div>

        {/* Profile Details Form */}
        <form onSubmit={handleSubmit} className="bg-white p-6 sm:p-8 rounded-2xl border border-slate-200 shadow-sm space-y-6">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <div>
              <h2 className="text-base font-bold text-slate-900">Company Information</h2>
              <p className="text-xs text-slate-500">Provide official details visible to student applicants</p>
            </div>
            <button
              type="submit"
              disabled={saving}
              className="px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold flex items-center gap-2 shadow-sm shadow-indigo-200 disabled:opacity-50 transition"
            >
              {saving ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <CheckCircle2 className="w-3.5 h-3.5" />}
              Save Profile
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Company Name *</label>
              <input
                type="text"
                name="company_name"
                required
                value={formData.company_name}
                onChange={handleChange}
                className="w-full px-3 py-2 border rounded-xl text-xs outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Industry Sector</label>
              <input
                type="text"
                name="industry_type"
                value={formData.industry_type}
                onChange={handleChange}
                placeholder="e.g. Software & Cloud Computing, Fintech"
                className="w-full px-3 py-2 border rounded-xl text-xs outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Company Size</label>
              <input
                type="text"
                name="company_size"
                value={formData.company_size}
                onChange={handleChange}
                placeholder="e.g. 500-1000 employees, 10,000+ employees"
                className="w-full px-3 py-2 border rounded-xl text-xs outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Official Website</label>
              <input
                type="url"
                name="website"
                value={formData.website}
                onChange={handleChange}
                placeholder="https://company.com"
                className="w-full px-3 py-2 border rounded-xl text-xs outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Headquarters / Location</label>
              <input
                type="text"
                name="location"
                value={formData.location}
                onChange={handleChange}
                placeholder="e.g. Bengaluru, India"
                className="w-full px-3 py-2 border rounded-xl text-xs outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Recruitment Contact Email</label>
              <input
                type="email"
                name="contact_email"
                value={formData.contact_email}
                onChange={handleChange}
                placeholder="careers@company.com"
                className="w-full px-3 py-2 border rounded-xl text-xs outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>

            <div className="sm:col-span-2">
              <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Contact Phone</label>
              <input
                type="text"
                name="contact_phone"
                value={formData.contact_phone}
                onChange={handleChange}
                placeholder="+91 80 1234 5678"
                className="w-full px-3 py-2 border rounded-xl text-xs outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>

            <div className="sm:col-span-2">
              <label className="block text-xs font-bold text-slate-700 uppercase mb-1">About Company / Overview</label>
              <textarea
                name="description"
                rows="4"
                value={formData.description}
                onChange={handleChange}
                placeholder="Share your mission, core products, technologies, and what makes your engineering culture special..."
                className="w-full px-3 py-2 border rounded-xl text-xs outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>
          </div>
        </form>

      </div>
    </DashboardLayout>
  );
};

export default CompanyProfile;
