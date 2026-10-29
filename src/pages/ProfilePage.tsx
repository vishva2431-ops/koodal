import React, { useState, useEffect } from 'react';
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
import { useAuth } from '../context/AuthContext';
import { UserProfile, WorkArrangement, EmploymentType } from '../types';
import { GlassCard } from '../components/ui/GlassCard';
import { GlassButton } from '../components/ui/GlassButton';
import { GlassInput } from '../components/ui/GlassInput';

export const ProfilePage: React.FC = () => {
  const { profile, updateProfile } = useApp();
  const { user } = useAuth();

  const [formData, setFormData] = useState<UserProfile>(profile);
  const [savedSuccess, setSavedSuccess] = useState(false);
  const [newSkill, setNewSkill] = useState('');
  const [newRole, setNewRole] = useState('');
  const [newLocation, setNewLocation] = useState('');

  // Keep form data in sync when profile updates
  useEffect(() => {
    if (profile.fullName !== undefined) {
      setFormData(prev => ({
        ...profile,
        email: profile.email || user?.email || '',
      }));
    }
  }, [profile, user]);

  const handleTextChange = (field: keyof UserProfile, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    await updateProfile(formData);
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 3000);
  };

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
    <div className="p-4 md:p-8 max-w-5xl mx-auto space-y-6 animate-in fade-in duration-150">
      {/* Header */}
      <GlassCard className="p-6 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold text-indigo-600 dark:text-indigo-400 uppercase tracking-wider mb-1">
            <User className="w-4 h-4" />
            <span>Profile & Career Preferences</span>
          </div>
          <h2 className="text-xl font-bold text-slate-900 dark:text-white tracking-tight">
            Personal Candidate Profile
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            Your verified profile drives automated matching and placeholder resolution. No data is shared publicly.
          </p>
        </div>

        <div className="flex items-center gap-4 shrink-0">
          <div className="text-right">
            <span className="text-[11px] text-slate-500 block">Completeness</span>
            <span className="text-2xl font-bold font-mono text-indigo-600 dark:text-indigo-400 tabular-nums">
              {profile.completenessScore || 0}%
            </span>
          </div>
          <GlassButton variant="primary" size="sm" icon={Save} onClick={handleSave}>
            Save Changes
          </GlassButton>
        </div>
      </GlassCard>

      {savedSuccess && (
        <div className="p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 shrink-0" />
          <span>Profile changes successfully persisted to backend repository.</span>
        </div>
      )}

      <form onSubmit={handleSave} className="space-y-6">
        {/* Personal Details */}
        <GlassCard className="p-6 space-y-4">
          <div className="flex items-center gap-2 border-b border-slate-200 dark:border-white/10 pb-3">
            <User className="w-4 h-4 text-indigo-500" />
            <h3 className="text-sm font-bold text-slate-900 dark:text-white">Personal Contact Details</h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
            <GlassInput
              label="Full Name"
              required
              placeholder="e.g. Anandha Kumar"
              value={formData.fullName || ''}
              onChange={e => handleTextChange('fullName', e.target.value)}
            />

            <GlassInput
              label="Contact Email"
              type="email"
              required
              placeholder="you@domain.com"
              value={formData.email || ''}
              onChange={e => handleTextChange('email', e.target.value)}
              leftIcon={Mail}
            />

            <GlassInput
              label="Contact Phone"
              type="tel"
              placeholder="+91 98401 23456"
              value={formData.phone || ''}
              onChange={e => handleTextChange('phone', e.target.value)}
              leftIcon={Phone}
            />

            <GlassInput
              label="Current City / Region"
              placeholder="e.g. Chennai, Tamil Nadu"
              value={formData.currentLocation || ''}
              onChange={e => handleTextChange('currentLocation', e.target.value)}
              leftIcon={MapPin}
            />

            <GlassInput
              label="Portfolio Website URL"
              type="url"
              placeholder="https://yourportfolio.dev"
              value={formData.portfolioUrl || ''}
              onChange={e => handleTextChange('portfolioUrl', e.target.value)}
              leftIcon={Globe}
            />

            <GlassInput
              label="GitHub Profile URL"
              type="url"
              placeholder="https://github.com/your-username"
              value={formData.gitHubUrl || ''}
              onChange={e => handleTextChange('gitHubUrl', e.target.value)}
              leftIcon={Github}
            />

            <div className="md:col-span-2">
              <GlassInput
                label="LinkedIn Profile URL"
                type="url"
                placeholder="https://linkedin.com/in/your-profile"
                value={formData.linkedInUrl || ''}
                onChange={e => handleTextChange('linkedInUrl', e.target.value)}
                leftIcon={Linkedin}
              />
            </div>
          </div>
        </GlassCard>

        {/* Career Preferences */}
        <GlassCard className="p-6 space-y-4">
          <div className="flex items-center gap-2 border-b border-slate-200 dark:border-white/10 pb-3">
            <Briefcase className="w-4 h-4 text-indigo-500" />
            <h3 className="text-sm font-bold text-slate-900 dark:text-white">
              Target Roles & Tamil Nadu Geo Preferences
            </h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
            <div>
              <label className="font-semibold text-slate-700 dark:text-slate-300 block mb-1">
                Experience Level
              </label>
              <select
                value={formData.experienceLevel}
                onChange={e => handleTextChange('experienceLevel', e.target.value)}
                className="w-full p-2 rounded-xl bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-white/10 text-xs text-slate-900 dark:text-white"
              >
                <option value="EXPERIENCED">Experienced</option>
                <option value="FRESHER">Fresher / Graduate</option>
                <option value="INTERN">Internship</option>
              </select>
            </div>

            <GlassInput
              label="Years of Experience"
              type="number"
              step="0.5"
              min="0"
              max="30"
              value={formData.experienceYears ?? 0}
              onChange={e => handleTextChange('experienceYears', parseFloat(e.target.value))}
            />

            <div>
              <label className="font-semibold text-slate-700 dark:text-slate-300 block mb-1">
                Work Arrangement
              </label>
              <select
                value={formData.workArrangement}
                onChange={e => handleTextChange('workArrangement', e.target.value as WorkArrangement)}
                className="w-full p-2 rounded-xl bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-white/10 text-xs text-slate-900 dark:text-white"
              >
                <option value="HYBRID">Hybrid</option>
                <option value="REMOTE">Remote</option>
                <option value="ON_SITE">On-Site</option>
              </select>
            </div>

            <GlassInput
              label="Expected Salary Min (₹ LPA)"
              type="number"
              min="0"
              max="100"
              value={formData.expectedSalaryMin ?? 0}
              onChange={e => handleTextChange('expectedSalaryMin', parseInt(e.target.value))}
            />

            <GlassInput
              label="Expected Salary Max (₹ LPA)"
              type="number"
              min="0"
              max="100"
              value={formData.expectedSalaryMax ?? 0}
              onChange={e => handleTextChange('expectedSalaryMax', parseInt(e.target.value))}
            />

            <GlassInput
              label="Notice Period (Days)"
              type="number"
              min="0"
              max="120"
              value={formData.noticePeriodDays ?? 30}
              onChange={e => handleTextChange('noticePeriodDays', parseInt(e.target.value))}
            />
          </div>

          {/* Preferred Roles */}
          <div className="pt-2 text-xs">
            <label className="font-semibold text-slate-700 dark:text-slate-300 block mb-1.5">
              Target Job Titles
            </label>
            <div className="flex flex-wrap gap-1.5 mb-2">
              {(formData.preferredRoles || []).map(r => (
                <span
                  key={r}
                  className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 text-xs font-medium"
                >
                  <span>{r}</span>
                  <button type="button" onClick={() => removeRole(r)} className="hover:text-rose-400">
                    ×
                  </button>
                </span>
              ))}
            </div>
            <div className="flex gap-2 max-w-sm">
              <input
                type="text"
                placeholder="e.g. React JS Developer..."
                value={newRole}
                onChange={e => setNewRole(e.target.value)}
                onKeyDown={e => e.key === 'Enter' && (e.preventDefault(), addRole())}
                className="flex-1 p-2 rounded-xl bg-slate-100 dark:bg-white/5 border border-slate-200 dark:border-white/10 text-xs"
              />
              <GlassButton type="button" variant="glass" size="sm" onClick={addRole}>
                Add
              </GlassButton>
            </div>
          </div>

          {/* Preferred Locations */}
          <div className="pt-2 text-xs">
            <label className="font-semibold text-slate-700 dark:text-slate-300 block mb-1.5">
              Preferred Tamil Nadu Cities
            </label>
            <div className="flex flex-wrap gap-1.5 mb-2">
              {(formData.preferredLocations || []).map(l => (
                <span
                  key={l}
                  className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-slate-100 dark:bg-white/5 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-white/10 text-xs font-medium"
                >
                  <MapPin className="w-3 h-3 text-slate-400" />
                  <span>{l}</span>
                  <button type="button" onClick={() => removeLocation(l)} className="hover:text-rose-400">
                    ×
                  </button>
                </span>
              ))}
            </div>
            <div className="flex gap-2 max-w-sm">
              <input
                type="text"
                placeholder="e.g. Chennai, Coimbatore..."
                value={newLocation}
                onChange={e => setNewLocation(e.target.value)}
                onKeyDown={e => e.key === 'Enter' && (e.preventDefault(), addLocation())}
                className="flex-1 p-2 rounded-xl bg-slate-100 dark:bg-white/5 border border-slate-200 dark:border-white/10 text-xs"
              />
              <GlassButton type="button" variant="glass" size="sm" onClick={addLocation}>
                Add
              </GlassButton>
            </div>
          </div>
        </GlassCard>

        {/* Technical Skills */}
        <GlassCard className="p-6 space-y-4">
          <div className="flex items-center gap-2 border-b border-slate-200 dark:border-white/10 pb-3">
            <Code2 className="w-4 h-4 text-indigo-500" />
            <h3 className="text-sm font-bold text-slate-900 dark:text-white">
              Technical Stack & Skills
            </h3>
          </div>

          <div className="text-xs">
            <div className="flex flex-wrap gap-1.5 mb-3">
              {(formData.skills || []).map(skill => (
                <span
                  key={skill}
                  className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 text-xs font-mono font-medium"
                >
                  <span>{skill}</span>
                  <button type="button" onClick={() => removeSkill(skill)} className="hover:text-rose-400">
                    ×
                  </button>
                </span>
              ))}
            </div>

            <div className="flex gap-2 max-w-md">
              <input
                type="text"
                placeholder="e.g. React.js, TypeScript, Next.js..."
                value={newSkill}
                onChange={e => setNewSkill(e.target.value)}
                onKeyDown={e => e.key === 'Enter' && (e.preventDefault(), addSkill())}
                className="flex-1 p-2 rounded-xl bg-slate-100 dark:bg-white/5 border border-slate-200 dark:border-white/10 text-xs font-mono"
              />
              <GlassButton type="button" variant="primary" size="sm" onClick={addSkill}>
                Add Skill
              </GlassButton>
            </div>
          </div>
        </GlassCard>

        {/* Save button */}
        <div className="flex justify-end pt-2">
          <GlassButton type="submit" variant="primary" size="md" icon={Save}>
            Save Candidate Profile
          </GlassButton>
        </div>
      </form>
    </div>
  );
};
