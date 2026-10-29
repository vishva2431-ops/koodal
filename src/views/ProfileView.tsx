import React, { useState } from 'react';
import { 
  User, 
  MapPin, 
  Mail, 
  Phone, 
  Globe, 
  Github, 
  Linkedin, 
  Briefcase, 
  GraduationCap, 
  Code2, 
  Save, 
  CheckCircle2, 
  Plus, 
  Trash2,
  AlertCircle
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { UserProfile, WorkArrangement, EmploymentType } from '../types';

export const ProfileView: React.FC = () => {
  const { profile, updateProfile } = useApp();

  const [formData, setFormData] = useState<UserProfile>(profile);
  const [savedSuccess, setSavedSuccess] = useState(false);

  // Quick inputs for skills
  const [newSkill, setNewSkill] = useState('');
  const [newRole, setNewRole] = useState('');
  const [newLocation, setNewLocation] = useState('');

  const handleTextChange = (field: keyof UserProfile, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    await updateProfile(formData);
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 3000);
  };

  // Add/remove array items
  const addSkill = () => {
    if (newSkill.trim() && !formData.skills?.includes(newSkill.trim())) {
      setFormData(prev => ({
        ...prev,
        skills: [...(prev.skills || []), newSkill.trim()],
      }));
      setNewSkill('');
    }
  };

  const removeSkill = (skill: string) => {
    setFormData(prev => ({
      ...prev,
      skills: (prev.skills || []).filter(s => s !== skill),
    }));
  };

  const addRole = () => {
    if (newRole.trim() && !formData.preferredRoles?.includes(newRole.trim())) {
      setFormData(prev => ({
        ...prev,
        preferredRoles: [...(prev.preferredRoles || []), newRole.trim()],
      }));
      setNewRole('');
    }
  };

  const removeRole = (role: string) => {
    setFormData(prev => ({
      ...prev,
      preferredRoles: (prev.preferredRoles || []).filter(r => r !== role),
    }));
  };

  const addLocation = () => {
    if (newLocation.trim() && !formData.preferredLocations?.includes(newLocation.trim())) {
      setFormData(prev => ({
        ...prev,
        preferredLocations: [...(prev.preferredLocations || []), newLocation.trim()],
      }));
      setNewLocation('');
    }
  };

  const removeLocation = (loc: string) => {
    setFormData(prev => ({
      ...prev,
      preferredLocations: (prev.preferredLocations || []).filter(l => l !== loc),
    }));
  };

  return (
    <div className="p-4 md:p-8 max-w-5xl mx-auto space-y-8 animate-in fade-in duration-150">
      {/* Header & Completeness Bar */}
      <div className="bg-white rounded-xl p-6 border border-slate-200 shadow-2xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold text-indigo-700 uppercase tracking-wider mb-1">
            <span>Verified Candidate Profile</span>
          </div>
          <h2 className="text-xl font-bold text-slate-900">
            Personal & Professional Profile
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            This verified data powers automated matching and assisted application generation across Tamil Nadu job boards.
          </p>
        </div>

        <div className="flex items-center gap-4 shrink-0">
          <div className="text-right">
            <span className="text-[11px] text-slate-500 block">Profile Completeness</span>
            <span className="text-2xl font-bold font-mono text-indigo-600 tabular-nums">
              {profile.completenessScore || 0}%
            </span>
          </div>
          <button
            onClick={handleSave}
            className="inline-flex items-center gap-1.5 px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg text-xs font-semibold transition-colors shadow-xs"
          >
            <Save className="w-3.5 h-3.5" />
            <span>Save Profile</span>
          </button>
        </div>
      </div>

      {savedSuccess && (
        <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-xl text-xs text-emerald-800 flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
          <span>Profile changes successfully validated and saved to backend repository.</span>
        </div>
      )}

      <form onSubmit={handleSave} className="space-y-6">
        {/* Section 1: Personal Information */}
        <div className="bg-white rounded-xl border border-slate-200 p-6 space-y-4">
          <div className="flex items-center gap-2 border-b border-slate-100 pb-3">
            <User className="w-4 h-4 text-indigo-600" />
            <h3 className="text-sm font-bold text-slate-900">Personal Information</h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
            <div>
              <label className="font-semibold text-slate-700 block mb-1">Full Name</label>
              <input
                type="text"
                required
                value={formData.fullName || ''}
                onChange={e => handleTextChange('fullName', e.target.value)}
                className="w-full p-2 bg-slate-50 border border-slate-200 rounded-md focus:bg-white focus:ring-1 focus:ring-indigo-500"
              />
            </div>

            <div>
              <label className="font-semibold text-slate-700 block mb-1">Email Address</label>
              <input
                type="email"
                required
                value={formData.email || ''}
                onChange={e => handleTextChange('email', e.target.value)}
                className="w-full p-2 bg-slate-50 border border-slate-200 rounded-md font-mono focus:bg-white focus:ring-1 focus:ring-indigo-500"
              />
            </div>

            <div>
              <label className="font-semibold text-slate-700 block mb-1">Phone Number</label>
              <input
                type="tel"
                value={formData.phone || ''}
                onChange={e => handleTextChange('phone', e.target.value)}
                className="w-full p-2 bg-slate-50 border border-slate-200 rounded-md font-mono focus:bg-white focus:ring-1 focus:ring-indigo-500"
              />
            </div>

            <div>
              <label className="font-semibold text-slate-700 block mb-1">Current Location</label>
              <input
                type="text"
                value={formData.currentLocation || ''}
                onChange={e => handleTextChange('currentLocation', e.target.value)}
                className="w-full p-2 bg-slate-50 border border-slate-200 rounded-md focus:bg-white focus:ring-1 focus:ring-indigo-500"
              />
            </div>

            <div>
              <label className="font-semibold text-slate-700 block mb-1">Portfolio Website URL</label>
              <input
                type="url"
                value={formData.portfolioUrl || ''}
                onChange={e => handleTextChange('portfolioUrl', e.target.value)}
                className="w-full p-2 bg-slate-50 border border-slate-200 rounded-md font-mono focus:bg-white focus:ring-1 focus:ring-indigo-500"
              />
            </div>

            <div>
              <label className="font-semibold text-slate-700 block mb-1">GitHub Profile URL</label>
              <input
                type="url"
                value={formData.gitHubUrl || ''}
                onChange={e => handleTextChange('gitHubUrl', e.target.value)}
                className="w-full p-2 bg-slate-50 border border-slate-200 rounded-md font-mono focus:bg-white focus:ring-1 focus:ring-indigo-500"
              />
            </div>

            <div className="md:col-span-2">
              <label className="font-semibold text-slate-700 block mb-1">LinkedIn Profile URL</label>
              <input
                type="url"
                value={formData.linkedInUrl || ''}
                onChange={e => handleTextChange('linkedInUrl', e.target.value)}
                className="w-full p-2 bg-slate-50 border border-slate-200 rounded-md font-mono focus:bg-white focus:ring-1 focus:ring-indigo-500"
              />
            </div>
          </div>
        </div>

        {/* Section 2: Career Preferences & Tamil Nadu Targeting */}
        <div className="bg-white rounded-xl border border-slate-200 p-6 space-y-4">
          <div className="flex items-center gap-2 border-b border-slate-100 pb-3">
            <Briefcase className="w-4 h-4 text-indigo-600" />
            <h3 className="text-sm font-bold text-slate-900">Career Preferences & Tamil Nadu Geo Scope</h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
            <div>
              <label className="font-semibold text-slate-700 block mb-1">Experience Level</label>
              <select
                value={formData.experienceLevel}
                onChange={e => handleTextChange('experienceLevel', e.target.value)}
                className="w-full p-2 bg-slate-50 border border-slate-200 rounded-md"
              >
                <option value="EXPERIENCED">Experienced</option>
                <option value="FRESHER">Fresher (Entry Level)</option>
                <option value="INTERN">Internship</option>
              </select>
            </div>

            <div>
              <label className="font-semibold text-slate-700 block mb-1">Years of Experience</label>
              <input
                type="number"
                step="0.5"
                min="0"
                max="30"
                value={formData.experienceYears ?? 2.5}
                onChange={e => handleTextChange('experienceYears', parseFloat(e.target.value))}
                className="w-full p-2 bg-slate-50 border border-slate-200 rounded-md font-mono"
              />
            </div>

            <div>
              <label className="font-semibold text-slate-700 block mb-1">Work Arrangement</label>
              <select
                value={formData.workArrangement}
                onChange={e => handleTextChange('workArrangement', e.target.value as WorkArrangement)}
                className="w-full p-2 bg-slate-50 border border-slate-200 rounded-md"
              >
                <option value="HYBRID">Hybrid</option>
                <option value="REMOTE">Remote</option>
                <option value="ON_SITE">On-Site</option>
              </select>
            </div>

            <div>
              <label className="font-semibold text-slate-700 block mb-1">Expected Salary Min (₹ LPA)</label>
              <input
                type="number"
                min="1"
                max="100"
                value={formData.expectedSalaryMin ?? 6}
                onChange={e => handleTextChange('expectedSalaryMin', parseInt(e.target.value))}
                className="w-full p-2 bg-slate-50 border border-slate-200 rounded-md font-mono"
              />
            </div>

            <div>
              <label className="font-semibold text-slate-700 block mb-1">Expected Salary Max (₹ LPA)</label>
              <input
                type="number"
                min="1"
                max="100"
                value={formData.expectedSalaryMax ?? 12}
                onChange={e => handleTextChange('expectedSalaryMax', parseInt(e.target.value))}
                className="w-full p-2 bg-slate-50 border border-slate-200 rounded-md font-mono"
              />
            </div>

            <div>
              <label className="font-semibold text-slate-700 block mb-1">Notice Period (Days)</label>
              <input
                type="number"
                min="0"
                max="120"
                value={formData.noticePeriodDays ?? 30}
                onChange={e => handleTextChange('noticePeriodDays', parseInt(e.target.value))}
                className="w-full p-2 bg-slate-50 border border-slate-200 rounded-md font-mono"
              />
            </div>
          </div>

          {/* Preferred Roles Array */}
          <div className="pt-2 text-xs">
            <label className="font-semibold text-slate-700 block mb-1.5">Preferred Job Titles</label>
            <div className="flex flex-wrap gap-1.5 mb-2">
              {(formData.preferredRoles || []).map(role => (
                <span
                  key={role}
                  className="inline-flex items-center gap-1 px-2.5 py-1 bg-indigo-50 border border-indigo-200 text-indigo-800 rounded-md text-xs font-medium"
                >
                  <span>{role}</span>
                  <button
                    type="button"
                    onClick={() => removeRole(role)}
                    className="hover:text-rose-600 transition-colors"
                  >
                    ×
                  </button>
                </span>
              ))}
            </div>
            <div className="flex gap-2 max-w-sm">
              <input
                type="text"
                placeholder="Add role (e.g. Next.js Developer)..."
                value={newRole}
                onChange={e => setNewRole(e.target.value)}
                onKeyDown={e => e.key === 'Enter' && (e.preventDefault(), addRole())}
                className="flex-1 p-2 bg-slate-50 border border-slate-200 rounded-md text-xs"
              />
              <button
                type="button"
                onClick={addRole}
                className="px-3 py-1.5 bg-slate-800 text-white rounded-md text-xs font-medium hover:bg-slate-700"
              >
                Add
              </button>
            </div>
          </div>

          {/* Preferred Tamil Nadu Locations */}
          <div className="pt-2 text-xs">
            <label className="font-semibold text-slate-700 block mb-1.5">Target Locations in Tamil Nadu</label>
            <div className="flex flex-wrap gap-1.5 mb-2">
              {(formData.preferredLocations || []).map(loc => (
                <span
                  key={loc}
                  className="inline-flex items-center gap-1 px-2.5 py-1 bg-slate-100 border border-slate-200 text-slate-800 rounded-md text-xs font-medium"
                >
                  <MapPin className="w-3 h-3 text-slate-400" />
                  <span>{loc}</span>
                  <button
                    type="button"
                    onClick={() => removeLocation(loc)}
                    className="hover:text-rose-600 transition-colors"
                  >
                    ×
                  </button>
                </span>
              ))}
            </div>
            <div className="flex gap-2 max-w-sm">
              <input
                type="text"
                placeholder="Add city (e.g. Erode, Tirunelveli)..."
                value={newLocation}
                onChange={e => setNewLocation(e.target.value)}
                onKeyDown={e => e.key === 'Enter' && (e.preventDefault(), addLocation())}
                className="flex-1 p-2 bg-slate-50 border border-slate-200 rounded-md text-xs"
              />
              <button
                type="button"
                onClick={addLocation}
                className="px-3 py-1.5 bg-slate-800 text-white rounded-md text-xs font-medium hover:bg-slate-700"
              >
                Add
              </button>
            </div>
          </div>
        </div>

        {/* Section 3: Technical Skills & Stack */}
        <div className="bg-white rounded-xl border border-slate-200 p-6 space-y-4">
          <div className="flex items-center gap-2 border-b border-slate-100 pb-3">
            <Code2 className="w-4 h-4 text-indigo-600" />
            <h3 className="text-sm font-bold text-slate-900">Technical Skills & Stacks</h3>
          </div>

          <div className="text-xs">
            <div className="flex flex-wrap gap-1.5 mb-3">
              {(formData.skills || []).map(skill => (
                <span
                  key={skill}
                  className="inline-flex items-center gap-1 px-2.5 py-1 bg-emerald-50 border border-emerald-200 text-emerald-900 rounded-md text-xs font-mono font-medium"
                >
                  <span>{skill}</span>
                  <button
                    type="button"
                    onClick={() => removeSkill(skill)}
                    className="hover:text-rose-600 transition-colors"
                  >
                    ×
                  </button>
                </span>
              ))}
            </div>

            <div className="flex gap-2 max-w-md">
              <input
                type="text"
                placeholder="Add skill (e.g. GraphQL, Zustand, Vitest)..."
                value={newSkill}
                onChange={e => setNewSkill(e.target.value)}
                onKeyDown={e => e.key === 'Enter' && (e.preventDefault(), addSkill())}
                className="flex-1 p-2 bg-slate-50 border border-slate-200 rounded-md text-xs font-mono"
              />
              <button
                type="button"
                onClick={addSkill}
                className="px-3 py-1.5 bg-indigo-600 text-white rounded-md text-xs font-medium hover:bg-indigo-700"
              >
                Add Skill
              </button>
            </div>
          </div>
        </div>

        {/* Bottom Save Action */}
        <div className="flex items-center justify-end gap-3 pt-4">
          <button
            type="submit"
            className="inline-flex items-center gap-1.5 px-6 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg text-xs font-bold transition-colors shadow-xs"
          >
            <Save className="w-4 h-4" />
            <span>Save Profile Information</span>
          </button>
        </div>
      </form>
    </div>
  );
};
