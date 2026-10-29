import React, { useState, useMemo } from 'react';
import { 
  Mail, 
  MessageSquare, 
  Copy, 
  Check, 
  Edit3, 
  Save, 
  Plus, 
  Trash2, 
  ExternalLink,
  ShieldCheck, 
  AlertTriangle,
  Building2,
  Search,
  UserCheck
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { MessageTemplate, TemplateType, JobListing } from '../types';
import { GlassCard } from '../components/ui/GlassCard';
import { GlassButton } from '../components/ui/GlassButton';
import { GlassInput } from '../components/ui/GlassInput';

export const OutreachPage: React.FC = () => {
  const { templates, saveTemplate, deleteTemplate, profile, jobs } = useApp();

  const [activeTemplateId, setActiveTemplateId] = useState<string>(templates[0]?.id || '');
  const [selectedJobId, setSelectedJobId] = useState<string>(jobs[0]?.id || '');
  const [jobSearch, setJobSearch] = useState('');

  // Editing state
  const [isEditing, setIsEditing] = useState(false);
  const [editSubject, setEditSubject] = useState('');
  const [editBody, setEditBody] = useState('');
  const [editName, setEditName] = useState('');

  // Copy and draft state
  const [copied, setCopied] = useState(false);
  const [customRecipientEmail, setCustomRecipientEmail] = useState('');
  const [customPhone, setCustomPhone] = useState('');

  const currentTemplate = templates.find(t => t.id === activeTemplateId) || templates[0];
  
  // Filtered job list for searchable job selector
  const selectableJobs = useMemo(() => {
    if (!jobSearch.trim()) return jobs;
    const q = jobSearch.toLowerCase();
    return jobs.filter(j => 
      j.title.toLowerCase().includes(q) || 
      j.company.toLowerCase().includes(q) ||
      j.location.toLowerCase().includes(q)
    );
  }, [jobs, jobSearch]);

  const targetJob: JobListing | undefined = jobs.find(j => j.id === selectedJobId) || jobs[0];

  // Dynamic placeholder resolution with tracking of missing candidate or employer fields
  const { resolvedSubject, resolvedBody, missingFields } = useMemo(() => {
    const missing: string[] = [];

    const getVal = (val: string | undefined | number, placeholderName: string, fieldLabel: string): string => {
      if (val !== undefined && val !== null && String(val).trim() !== '' && String(val).trim() !== '0') {
        return String(val);
      }
      missing.push(fieldLabel);
      return `[Missing ${fieldLabel} — Please update in Profile Settings]`;
    };

    const replacePlaceholders = (text: string) => {
      if (!text) return '';
      return text
        .replace(/\{\{yourName\}\}/g, () => getVal(profile.fullName, 'yourName', 'Full Name'))
        .replace(/\{\{email\}\}/g, () => getVal(profile.email, 'email', 'Email Address'))
        .replace(/\{\{phone\}\}/g, () => getVal(profile.phone, 'phone', 'Phone Number'))
        .replace(/\{\{jobTitle\}\}/g, () => targetJob?.title || '[Select a Job]')
        .replace(/\{\{companyName\}\}/g, () => targetJob?.company || '[Target Company]')
        .replace(/\{\{skills\}\}/g, () => {
          if (profile.skills && profile.skills.length > 0) {
            return profile.skills.slice(0, 5).join(', ');
          }
          missing.push('Technical Skills');
          return '[Missing Skills — Add in Profile]';
        })
        .replace(/\{\{location\}\}/g, () => targetJob?.location || profile.currentLocation || '[Location]')
        .replace(/\{\{experience\}\}/g, () => getVal(profile.experienceYears, 'experience', 'Years of Experience'))
        .replace(/\{\{portfolioUrl\}\}/g, () => getVal(profile.portfolioUrl, 'portfolioUrl', 'Portfolio URL'))
        .replace(/\{\{linkedInUrl\}\}/g, () => getVal(profile.linkedInUrl, 'linkedInUrl', 'LinkedIn Profile URL'))
        .replace(/\{\{gitHubUrl\}\}/g, () => getVal(profile.gitHubUrl, 'gitHubUrl', 'GitHub Profile URL'))
        .replace(/\{\{noticePeriod\}\}/g, () => String(profile.noticePeriodDays || 30));
    };

    const subj = replacePlaceholders(currentTemplate?.subject || '');
    const bdy = replacePlaceholders(currentTemplate?.body || '');

    return {
      resolvedSubject: subj,
      resolvedBody: bdy,
      missingFields: Array.from(new Set(missing)),
    };
  }, [currentTemplate, profile, targetJob]);

  const handleCopyPreview = () => {
    const textToCopy = `${resolvedSubject ? 'Subject: ' + resolvedSubject + '\n\n' : ''}${resolvedBody}`;
    navigator.clipboard.writeText(textToCopy);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleOpenMailto = () => {
    const recipient = customRecipientEmail.trim() || targetJob?.contactEmail || '';
    const subjectEncoded = encodeURIComponent(resolvedSubject);
    const bodyEncoded = encodeURIComponent(resolvedBody);
    const mailtoUrl = `mailto:${recipient}?subject=${subjectEncoded}&body=${bodyEncoded}`;
    window.open(mailtoUrl, '_blank');
  };

  const handleOpenWhatsApp = () => {
    const phone = customPhone.replace(/[^0-9]/g, '');
    const textEncoded = encodeURIComponent(resolvedBody);
    const waUrl = phone 
      ? `https://wa.me/${phone}?text=${textEncoded}` 
      : `https://wa.me/?text=${textEncoded}`;
    window.open(waUrl, '_blank', 'noopener,noreferrer');
  };

  const handleStartEdit = () => {
    if (!currentTemplate) return;
    setEditName(currentTemplate.name);
    setEditSubject(currentTemplate.subject || '');
    setEditBody(currentTemplate.body);
    setIsEditing(true);
  };

  const handleSaveEdit = async () => {
    if (!currentTemplate) return;
    await saveTemplate({
      ...currentTemplate,
      name: editName,
      subject: editSubject || undefined,
      body: editBody,
      lastModified: new Date().toISOString(),
    });
    setIsEditing(false);
  };

  const handleCreateNew = async () => {
    const newTpl: MessageTemplate = {
      id: `tpl_custom_${Date.now()}`,
      name: 'Custom Outreach Template',
      type: 'EMAIL',
      subject: 'Application for {{jobTitle}} — {{yourName}}',
      body: `Dear Hiring Team at {{companyName}},\n\nI am applying for {{jobTitle}} in {{location}}.\n\nBest regards,\n{{yourName}}\n{{phone}}\n{{email}}`,
      isDefault: false,
      lastModified: new Date().toISOString(),
    };
    await saveTemplate(newTpl);
    setActiveTemplateId(newTpl.id);
    setIsEditing(true);
    setEditName(newTpl.name);
    setEditSubject(newTpl.subject || '');
    setEditBody(newTpl.body);
  };

  const handleDeleteTemplate = async (id: string) => {
    if (confirm('Are you sure you want to delete this template?')) {
      await deleteTemplate(id);
      if (activeTemplateId === id) {
        setActiveTemplateId(templates[0]?.id || '');
      }
    }
  };

  return (
    <div className="p-4 md:p-8 max-w-7xl mx-auto space-y-6 animate-in fade-in duration-150">
      {/* Header */}
      <GlassCard className="p-6 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold text-indigo-600 dark:text-indigo-400 uppercase tracking-wider mb-1">
            <Mail className="w-4 h-4" />
            <span>Dynamic Company Outreach</span>
          </div>
          <h2 className="text-xl font-bold text-slate-900 dark:text-white">
            Message & Outreach Templates
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            100% data-driven variable substitution. Placeholders resolve from your verified profile and selected opportunity.
          </p>
        </div>

        <GlassButton variant="primary" size="sm" icon={Plus} onClick={handleCreateNew}>
          New Template
        </GlassButton>
      </GlassCard>

      {/* Missing Information Warning Banner */}
      {missingFields.length > 0 && (
        <div className="p-4 rounded-2xl bg-amber-500/10 border border-amber-500/20 text-amber-600 dark:text-amber-400 text-xs flex items-start gap-3">
          <AlertTriangle className="w-4 h-4 shrink-0 mt-0.5" />
          <div className="space-y-1">
            <span className="font-bold block">Incomplete Profile Placeholders Detected:</span>
            <p className="text-[11px] leading-relaxed">
              The following fields are missing from your saved profile and cannot be resolved automatically:{' '}
              <strong>{missingFields.join(', ')}</strong>. You can update them in Profile Settings or edit the text directly before dispatching.
            </p>
          </div>
        </div>
      )}

      {/* Main Grid: Template Selector + Preview and Edit */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column: Template List & Searchable Job Selector */}
        <div className="space-y-4">
          <GlassCard className="p-4 space-y-3">
            <span className="text-xs font-bold text-slate-900 dark:text-white uppercase tracking-wider block">
              Saved Templates ({templates.length})
            </span>
            <div className="space-y-1.5">
              {templates.map(tpl => {
                const isActive = tpl.id === activeTemplateId;
                return (
                  <div
                    key={tpl.id}
                    className={`group p-3 rounded-xl text-left text-xs transition-all flex items-center justify-between gap-2 cursor-pointer border ${
                      isActive
                        ? 'bg-indigo-600 text-white font-semibold border-indigo-500 shadow-xs'
                        : 'bg-white/50 dark:bg-white/5 border-slate-200 dark:border-white/5 text-slate-700 dark:text-slate-300 hover:bg-white dark:hover:bg-white/10'
                    }`}
                    onClick={() => {
                      setActiveTemplateId(tpl.id);
                      setIsEditing(false);
                    }}
                  >
                    <div className="min-w-0 flex-1">
                      <div className="truncate font-medium">{tpl.name}</div>
                      <div className={`text-[10px] font-mono mt-0.5 ${isActive ? 'text-indigo-200' : 'text-slate-400'}`}>
                        {tpl.type} {tpl.isDefault ? '· Default' : ''}
                      </div>
                    </div>
                    {templates.length > 1 && (
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleDeleteTemplate(tpl.id);
                        }}
                        className={`p-1 rounded opacity-0 group-hover:opacity-100 hover:bg-rose-500/20 text-rose-400 transition-opacity`}
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    )}
                  </div>
                );
              })}
            </div>
          </GlassCard>

          {/* Searchable Job Selector */}
          <GlassCard className="p-4 space-y-3 text-xs">
            <label className="font-bold text-slate-900 dark:text-white uppercase tracking-wider block text-[11px]">
              Select Context Job ({jobs.length} Available)
            </label>

            <div className="relative">
              <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-2.5 pointer-events-none" />
              <input
                type="text"
                placeholder="Search jobs for context..."
                value={jobSearch}
                onChange={e => setJobSearch(e.target.value)}
                className="w-full pl-8 pr-2.5 py-1.5 rounded-lg bg-slate-100 dark:bg-white/5 border border-slate-200 dark:border-white/10 text-xs text-slate-900 dark:text-white"
              />
            </div>

            <div className="max-h-48 overflow-y-auto space-y-1">
              {selectableJobs.map(j => (
                <button
                  key={j.id}
                  onClick={() => setSelectedJobId(j.id)}
                  className={`w-full p-2 rounded-lg text-left text-xs transition-colors block ${
                    j.id === selectedJobId
                      ? 'bg-indigo-50 dark:bg-indigo-950/40 text-indigo-600 dark:text-indigo-300 font-semibold border border-indigo-200 dark:border-indigo-500/30'
                      : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-white/5'
                  }`}
                >
                  <div className="font-bold truncate">{j.title}</div>
                  <div className="text-[10px] text-slate-500 truncate">{j.company} · {j.location}</div>
                </button>
              ))}
            </div>
          </GlassCard>

          {/* Compliance & Free Tier Policy */}
          <GlassCard className="p-4 text-xs text-slate-500 dark:text-slate-400 space-y-1.5">
            <div className="flex items-center gap-1.5 font-semibold text-slate-800 dark:text-slate-200">
              <ShieldCheck className="w-4 h-4 text-indigo-500" />
              <span>Zero-Cost Outreach Policy</span>
            </div>
            <p className="text-[11px] leading-relaxed">
              We generate prefilled <code className="font-mono text-indigo-500">mailto:</code> and WhatsApp Web review links for manual confirmation. No unsolicited bulk automation or paid messaging APIs are used.
            </p>
          </GlassCard>
        </div>

        {/* Right 2 Columns: Preview & Edit Panel */}
        <div className="lg:col-span-2 space-y-4">
          <GlassCard className="p-6 space-y-5">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-200 dark:border-white/10 pb-4">
              <div>
                <h3 className="text-base font-bold text-slate-900 dark:text-white">
                  {currentTemplate?.name}
                </h3>
                <span className="text-[11px] text-slate-500 font-mono">
                  Type: {currentTemplate?.type} · Active Job: {targetJob?.company || 'None'}
                </span>
              </div>

              <div className="flex items-center gap-2">
                {!isEditing ? (
                  <>
                    <GlassButton
                      variant="glass"
                      size="sm"
                      icon={copied ? Check : Copy}
                      onClick={handleCopyPreview}
                    >
                      {copied ? 'Copied' : 'Copy Text'}
                    </GlassButton>
                    <GlassButton
                      variant="glass"
                      size="sm"
                      icon={Edit3}
                      onClick={handleStartEdit}
                    >
                      Edit Template
                    </GlassButton>
                  </>
                ) : (
                  <>
                    <GlassButton variant="ghost" size="sm" onClick={() => setIsEditing(false)}>
                      Cancel
                    </GlassButton>
                    <GlassButton variant="primary" size="sm" icon={Save} onClick={handleSaveEdit}>
                      Save Template
                    </GlassButton>
                  </>
                )}
              </div>
            </div>

            {/* Template Body */}
            {isEditing ? (
              <div className="space-y-4 text-xs">
                <GlassInput
                  label="Template Name"
                  value={editName}
                  onChange={e => setEditName(e.target.value)}
                />

                {currentTemplate?.type === 'EMAIL' && (
                  <GlassInput
                    label="Subject Line (Supports placeholders)"
                    value={editSubject}
                    onChange={e => setEditSubject(e.target.value)}
                  />
                )}

                <div className="space-y-1.5 text-left">
                  <label className="block text-xs font-semibold text-slate-300">
                    Template Content (Placeholders: {'{{yourName}}'}, {'{{jobTitle}}'}, {'{{companyName}}'}, {'{{skills}}'}, {'{{phone}}'}, {'{{portfolioUrl}}'})
                  </label>
                  <textarea
                    rows={12}
                    value={editBody}
                    onChange={e => setEditBody(e.target.value)}
                    className="w-full p-3.5 rounded-xl bg-slate-900/50 border border-white/10 font-mono text-xs text-white leading-relaxed focus:outline-hidden focus:ring-2 focus:ring-indigo-500"
                  />
                </div>
              </div>
            ) : (
              <div className="space-y-4 text-xs">
                {currentTemplate?.type === 'EMAIL' && resolvedSubject && (
                  <div className="p-3 rounded-xl bg-slate-100 dark:bg-white/5 border border-slate-200 dark:border-white/5">
                    <span className="text-[10px] uppercase font-bold text-slate-400 block mb-0.5">
                      Subject
                    </span>
                    <p className="font-bold text-slate-900 dark:text-white text-xs">{resolvedSubject}</p>
                  </div>
                )}

                <div className="p-4 rounded-xl bg-slate-100 dark:bg-white/5 border border-slate-200 dark:border-white/5">
                  <span className="text-[10px] uppercase font-bold text-slate-400 block mb-1">
                    Resolved Message
                  </span>
                  <p className="text-slate-800 dark:text-slate-200 leading-relaxed whitespace-pre-line text-xs font-sans">
                    {resolvedBody}
                  </p>
                </div>

                {/* Direct Draft Launchers */}
                <div className="pt-2 border-t border-slate-200 dark:border-white/10 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div className="flex items-center gap-2">
                    <input
                      type="email"
                      placeholder={targetJob?.contactEmail || 'Enter recipient email'}
                      value={customRecipientEmail}
                      onChange={e => setCustomRecipientEmail(e.target.value)}
                      className="p-1.5 rounded-lg bg-slate-100 dark:bg-white/5 border border-slate-200 dark:border-white/10 text-xs font-mono w-48 text-slate-900 dark:text-white"
                    />
                    <GlassButton
                      variant="secondary"
                      size="sm"
                      icon={Mail}
                      onClick={handleOpenMailto}
                    >
                      Open Email Draft
                    </GlassButton>
                  </div>

                  <div className="flex items-center gap-2">
                    <input
                      type="tel"
                      placeholder="Recipient WhatsApp #"
                      value={customPhone}
                      onChange={e => setCustomPhone(e.target.value)}
                      className="p-1.5 rounded-lg bg-slate-100 dark:bg-white/5 border border-slate-200 dark:border-white/10 text-xs font-mono w-36 text-slate-900 dark:text-white"
                    />
                    <GlassButton
                      variant="primary"
                      size="sm"
                      icon={MessageSquare}
                      onClick={handleOpenWhatsApp}
                      className="bg-emerald-600 hover:bg-emerald-500"
                    >
                      Open WhatsApp Draft
                    </GlassButton>
                  </div>
                </div>
              </div>
            )}
          </GlassCard>
        </div>
      </div>
    </div>
  );
};
