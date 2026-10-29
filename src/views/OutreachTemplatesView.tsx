import React, { useState, useMemo } from 'react';
import { 
  Mail, 
  Send, 
  MessageSquare, 
  Copy, 
  Check, 
  Edit3, 
  Save, 
  Plus, 
  Trash2, 
  ExternalLink,
  ShieldCheck,
  CheckCircle2,
  Building2
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { MessageTemplate, TemplateType, JobListing } from '../types';

export const OutreachTemplatesView: React.FC = () => {
  const { templates, saveTemplate, deleteTemplate, profile, jobs } = useApp();

  const [activeTemplateId, setActiveTemplateId] = useState<string>(templates[0]?.id || '');
  const [selectedJobId, setSelectedJobId] = useState<string>(jobs[0]?.id || '');

  // Editing state
  const [isEditing, setIsEditing] = useState(false);
  const [editSubject, setEditSubject] = useState('');
  const [editBody, setEditBody] = useState('');
  const [editName, setEditName] = useState('');

  // Copy state helper
  const [copied, setCopied] = useState(false);
  const [customRecipientEmail, setCustomRecipientEmail] = useState('');
  const [customPhone, setCustomPhone] = useState('');

  const currentTemplate = templates.find(t => t.id === activeTemplateId) || templates[0];
  const targetJob: JobListing = jobs.find(j => j.id === selectedJobId) || jobs[0] || {
    id: 'sample',
    title: 'React JS Developer',
    company: 'Target Company',
    location: 'Chennai, Tamil Nadu',
    contactEmail: 'talent@targetcompany.com',
  };

  // Safe placeholder replacement
  const renderTemplateText = (templateText: string): string => {
    if (!templateText) return '';
    return templateText
      .replace(/\{\{yourName\}\}/g, profile.fullName || 'Vishva Kumar')
      .replace(/\{\{email\}\}/g, profile.email || 'vishva2431@gmail.com')
      .replace(/\{\{phone\}\}/g, profile.phone || '+91 98401 23456')
      .replace(/\{\{jobTitle\}\}/g, targetJob?.title || 'React JS Developer')
      .replace(/\{\{companyName\}\}/g, targetJob?.company || 'Company Name')
      .replace(/\{\{skills\}\}/g, (profile.skills || []).slice(0, 5).join(', ') || 'React, TypeScript, Tailwind CSS')
      .replace(/\{\{location\}\}/g, targetJob?.location || profile.currentLocation || 'Chennai, Tamil Nadu')
      .replace(/\{\{experience\}\}/g, String(profile.experienceYears || '2.5'))
      .replace(/\{\{portfolioUrl\}\}/g, profile.portfolioUrl || 'https://vishva-portfolio.dev')
      .replace(/\{\{linkedInUrl\}\}/g, profile.linkedInUrl || 'https://linkedin.com/in/vishva')
      .replace(/\{\{noticePeriod\}\}/g, String(profile.noticePeriodDays || 30));
  };

  const previewSubject = renderTemplateText(currentTemplate?.subject || '');
  const previewBody = renderTemplateText(currentTemplate?.body || '');

  const handleCopyPreview = () => {
    navigator.clipboard.writeText(`${previewSubject ? 'Subject: ' + previewSubject + '\n\n' : ''}${previewBody}`);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleOpenMailto = () => {
    const recipient = customRecipientEmail.trim() || targetJob?.contactEmail || '';
    const subjectEncoded = encodeURIComponent(previewSubject);
    const bodyEncoded = encodeURIComponent(previewBody);
    const mailtoUrl = `mailto:${recipient}?subject=${subjectEncoded}&body=${bodyEncoded}`;
    window.open(mailtoUrl, '_blank');
  };

  const handleOpenWhatsApp = () => {
    const phone = customPhone.replace(/[^0-9]/g, '');
    const textEncoded = encodeURIComponent(previewBody);
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
      name: 'Custom Outreach Message',
      type: 'EMAIL',
      subject: 'Application for {{jobTitle}} — {{yourName}}',
      body: `Dear {{companyName}} Hiring Team,\n\nI am applying for {{jobTitle}} in {{location}}.\n\nBest regards,\n{{yourName}}`,
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

  return (
    <div className="p-4 md:p-8 max-w-6xl mx-auto space-y-6 animate-in fade-in duration-150">
      {/* Header */}
      <div className="bg-white rounded-xl p-6 border border-slate-200 shadow-2xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold text-indigo-700 uppercase tracking-wider mb-1">
            <Mail className="w-4 h-4" />
            <span>Company Outreach & Communication</span>
          </div>
          <h2 className="text-xl font-bold text-slate-900">
            Message & Outreach Templates
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Craft tailored emails, follow-ups, cover letters, and WhatsApp drafts with verified placeholders. Opens draft review windows at ₹0 cost.
          </p>
        </div>

        <button
          onClick={handleCreateNew}
          className="inline-flex items-center gap-1.5 px-3.5 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg text-xs font-semibold transition-colors shadow-xs shrink-0"
        >
          <Plus className="w-3.5 h-3.5" />
          <span>New Template</span>
        </button>
      </div>

      {/* Grid: Template Selector + Preview and Edit */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column: Template List */}
        <div className="space-y-4">
          <div className="bg-white rounded-xl border border-slate-200 p-4 space-y-3">
            <span className="text-xs font-bold text-slate-900 uppercase tracking-wider block">
              Saved Templates
            </span>
            <div className="space-y-1.5">
              {templates.map(tpl => {
                const isActive = tpl.id === activeTemplateId;
                return (
                  <button
                    key={tpl.id}
                    onClick={() => {
                      setActiveTemplateId(tpl.id);
                      setIsEditing(false);
                    }}
                    className={`w-full p-3 rounded-lg text-left text-xs transition-colors flex items-center justify-between gap-2 ${
                      isActive
                        ? 'bg-indigo-50 border border-indigo-200 text-indigo-900 font-semibold'
                        : 'bg-slate-50/70 border border-slate-200/80 text-slate-700 hover:bg-slate-100'
                    }`}
                  >
                    <div className="min-w-0">
                      <div className="truncate">{tpl.name}</div>
                      <div className="text-[10px] text-slate-500 font-mono mt-0.5">
                        {tpl.type} {tpl.isDefault ? '· Default' : ''}
                      </div>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Test Target Job Selector for Live Preview */}
          <div className="bg-white rounded-xl border border-slate-200 p-4 space-y-2 text-xs">
            <label className="font-bold text-slate-900 uppercase tracking-wider block text-[11px]">
              Preview Context (Target Job)
            </label>
            <p className="text-[11px] text-slate-500 leading-relaxed">
              Select a job to test real variable substitution into placeholders:
            </p>
            <select
              value={selectedJobId}
              onChange={e => setSelectedJobId(e.target.value)}
              className="w-full p-2 bg-slate-50 border border-slate-200 rounded-md text-xs font-mono"
            >
              {jobs.map(j => (
                <option key={j.id} value={j.id}>
                  {j.title} — {j.company} ({j.location})
                </option>
              ))}
            </select>
          </div>

          {/* Compliance & Zero-Cost Notice */}
          <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 text-xs text-slate-600 space-y-1.5">
            <div className="flex items-center gap-1.5 font-semibold text-slate-800">
              <ShieldCheck className="w-4 h-4 text-indigo-600" />
              <span>Zero-Cost Outreach Policy</span>
            </div>
            <p className="text-[11px] text-slate-500 leading-relaxed">
              We generate prefilled <code className="font-mono text-indigo-700">mailto:</code> and WhatsApp Web drafts for personal manual review. No unsolicited bulk automation or paid SMS/Twilio APIs are used.
            </p>
          </div>
        </div>

        {/* Right 2 Columns: Preview & Edit Panel */}
        <div className="lg:col-span-2 space-y-4">
          <div className="bg-white rounded-xl border border-slate-200 p-6 space-y-5 shadow-2xs">
            {/* Header / Actions toolbar */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-4">
              <div>
                <h3 className="text-base font-bold text-slate-900">
                  {currentTemplate?.name}
                </h3>
                <span className="text-[11px] text-slate-500 font-mono">
                  Type: {currentTemplate?.type} · Variable-Aware
                </span>
              </div>

              <div className="flex items-center gap-2">
                {!isEditing ? (
                  <>
                    <button
                      onClick={handleCopyPreview}
                      className="inline-flex items-center gap-1 px-3 py-1.5 bg-white border border-slate-300 text-slate-700 rounded-lg text-xs font-medium hover:bg-slate-50 transition-colors"
                    >
                      {copied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5 text-slate-400" />}
                      <span>{copied ? 'Copied to Clipboard' : 'Copy Text'}</span>
                    </button>
                    <button
                      onClick={handleStartEdit}
                      className="inline-flex items-center gap-1 px-3 py-1.5 bg-white border border-slate-300 text-slate-700 rounded-lg text-xs font-medium hover:bg-slate-50 transition-colors"
                    >
                      <Edit3 className="w-3.5 h-3.5 text-slate-400" />
                      <span>Edit Template</span>
                    </button>
                  </>
                ) : (
                  <>
                    <button
                      onClick={() => setIsEditing(false)}
                      className="px-3 py-1.5 text-slate-500 hover:text-slate-800 text-xs font-medium"
                    >
                      Cancel
                    </button>
                    <button
                      onClick={handleSaveEdit}
                      className="inline-flex items-center gap-1 px-3.5 py-1.5 bg-indigo-600 text-white rounded-lg text-xs font-semibold hover:bg-indigo-700 shadow-xs"
                    >
                      <Save className="w-3.5 h-3.5" />
                      <span>Save Template</span>
                    </button>
                  </>
                )}
              </div>
            </div>

            {/* Editing Form vs Rendered Preview */}
            {isEditing ? (
              <div className="space-y-4 text-xs">
                <div>
                  <label className="font-semibold text-slate-800 block mb-1">Template Name</label>
                  <input
                    type="text"
                    value={editName}
                    onChange={e => setEditName(e.target.value)}
                    className="w-full p-2 bg-slate-50 border border-slate-200 rounded-md font-semibold text-slate-900"
                  />
                </div>

                {currentTemplate?.type === 'EMAIL' && (
                  <div>
                    <label className="font-semibold text-slate-800 block mb-1">
                      Subject Line (Supports placeholders)
                    </label>
                    <input
                      type="text"
                      value={editSubject}
                      onChange={e => setEditSubject(e.target.value)}
                      className="w-full p-2 bg-slate-50 border border-slate-200 rounded-md font-mono text-xs"
                    />
                  </div>
                )}

                <div>
                  <label className="font-semibold text-slate-800 block mb-1">
                    Message Body (Supports placeholders like {'{{yourName}}'}, {'{{skills}}'}, {'{{companyName}}'})
                  </label>
                  <textarea
                    rows={12}
                    value={editBody}
                    onChange={e => setEditBody(e.target.value)}
                    className="w-full p-3 bg-slate-50 border border-slate-200 rounded-md font-mono text-xs text-slate-800 leading-relaxed"
                  />
                </div>
              </div>
            ) : (
              <div className="space-y-4 text-xs">
                {currentTemplate?.type === 'EMAIL' && previewSubject && (
                  <div className="p-3 bg-slate-50 rounded-lg border border-slate-200">
                    <span className="text-[10px] uppercase font-bold text-slate-400 block mb-0.5">
                      Email Subject
                    </span>
                    <p className="font-bold text-slate-900 text-xs">{previewSubject}</p>
                  </div>
                )}

                <div className="p-4 bg-slate-50 rounded-lg border border-slate-200">
                  <span className="text-[10px] uppercase font-bold text-slate-400 block mb-1">
                    Resolved Message Body
                  </span>
                  <p className="text-slate-800 leading-relaxed whitespace-pre-line font-sans text-xs">
                    {previewBody}
                  </p>
                </div>

                {/* Direct Draft Launchers */}
                <div className="pt-2 border-t border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div className="flex items-center gap-2">
                    <input
                      type="email"
                      placeholder={targetJob?.contactEmail || 'recruiter@company.com'}
                      value={customRecipientEmail}
                      onChange={e => setCustomRecipientEmail(e.target.value)}
                      className="p-1.5 bg-slate-50 border border-slate-200 rounded text-xs font-mono w-48"
                    />
                    <button
                      onClick={handleOpenMailto}
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-slate-900 hover:bg-indigo-600 text-white rounded-lg text-xs font-semibold transition-colors"
                    >
                      <Mail className="w-3.5 h-3.5" />
                      <span>Open in Mail App</span>
                    </button>
                  </div>

                  <div className="flex items-center gap-2">
                    <input
                      type="tel"
                      placeholder="+91 Phone (optional)"
                      value={customPhone}
                      onChange={e => setCustomPhone(e.target.value)}
                      className="p-1.5 bg-slate-50 border border-slate-200 rounded text-xs font-mono w-36"
                    />
                    <button
                      onClick={handleOpenWhatsApp}
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-xs font-semibold transition-colors"
                    >
                      <MessageSquare className="w-3.5 h-3.5" />
                      <span>Open WhatsApp</span>
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
