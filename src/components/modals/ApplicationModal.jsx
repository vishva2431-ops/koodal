import React, { useState } from 'react';
import { 
  X, 
  ExternalLink, 
  Check, 
  Copy, 
  AlertTriangle, 
  ShieldAlert, 
  CheckCircle2, 
  ArrowRight
} from 'lucide-react';
import { useApp } from '../../context/AppContext.jsx';

export const ApplicationModal = ({
  job,
  onClose,
  onCompleted,
}) => {
  const { profile, prepareApplication, recordApplicationOutcome } = useApp();
  const [step, setStep] = useState('VALIDATE');
  const [activeResumeId, setActiveResumeId] = useState(profile.activeResumeId || profile.resumes?.[0]?.id || '');
  const [applicationRecord, setApplicationRecord] = useState(null);

  // Sensitive declarations confirmation checkboxes
  const [salaryConfirmed, setSalaryConfirmed] = useState(false);
  const [noticePeriodConfirmed, setNoticePeriodConfirmed] = useState(false);
  const [workAuthorizationConfirmed, setWorkAuthorizationConfirmed] = useState(false);

  // Outcome recording state
  const [submissionStatus, setSubmissionStatus] = useState('SUBMITTED');
  const [confirmationRef, setConfirmationRef] = useState('');
  const [notes, setNotes] = useState('');
  const [followUpDate, setFollowUpDate] = useState(() => {
    const d = new Date();
    d.setDate(d.getDate() + 7);
    return d.toISOString().slice(0, 10);
  });

  // Copied state helpers
  const [copiedField, setCopiedField] = useState(null);

  if (!job) return null;

  const copyToClipboard = (text, label) => {
    navigator.clipboard.writeText(text);
    setCopiedField(label);
    setTimeout(() => setCopiedField(null), 2000);
  };

  const handleStartWorkflow = async () => {
    try {
      const app = await prepareApplication(job.id, activeResumeId, `Assisted application for ${job.title} at ${job.company}`);
      setApplicationRecord(app);
      setStep('PREFILL');
    } catch (err) {
      alert(err.message || 'Error initiating application workflow');
    }
  };

  const handleOpenPortal = () => {
    const targetUrl = job.directApplicationUrl || job.originalUrl;
    window.open(targetUrl, '_blank', 'noopener,noreferrer');
    setStep('SUBMIT_CONFIRM');
  };

  const handleSaveOutcome = async () => {
    if (!applicationRecord) return;

    if (submissionStatus === 'SUBMITTED' && !confirmationRef.trim()) {
      const proceed = confirm('You selected SUBMITTED without providing an application confirmation reference or reference ID. Are you sure you received verified submission evidence?');
      if (!proceed) return;
    }

    let errorDetails = {};
    if (submissionStatus === 'FAILED') {
      errorDetails = {
        errorStage: 'SUBMISSION_VERIFICATION',
        errorCode: 'MANUAL_INTERRUPTION',
        errorMessage: 'User recorded application failure during assisted submission.',
        evidence: confirmationRef || 'User recorded submission could not be completed on official portal.',
        rootCauseConfirmed: true,
        causeDescription: notes || 'Application failed during official portal flow.',
        recoveryAction: 'Inspect official job page for expired posting or required pre-screen questions.',
        isSafeToRetry: true,
      };
    } else if (submissionStatus === 'SUBMISSION_UNKNOWN') {
      errorDetails = {
        errorStage: 'SUBMISSION_VERIFICATION',
        errorCode: 'RESULT_UNCONFIRMED',
        errorMessage: 'Submission outcome could not be verified on external portal.',
        evidence: 'Portal redirected or closed before confirmation reference was displayed.',
        rootCauseConfirmed: false,
        causeDescription: 'Cause not confirmed. No confirmation email or acknowledgment reference captured.',
        recoveryAction: 'Check email inbox for employer confirmation email before re-submitting to prevent duplicate application.',
        isSafeToRetry: false,
      };
    }

    await recordApplicationOutcome(applicationRecord.id, submissionStatus, {
      confirmationReference: confirmationRef.trim() || undefined,
      notes: notes.trim() || undefined,
      followUpDate: submissionStatus === 'SUBMITTED' ? followUpDate : undefined,
      ...errorDetails,
    });

    onCompleted?.();
    onClose?.();
  };

  const activeResume = profile.resumes?.find(r => r.id === activeResumeId) || profile.resumes?.[0];
  const allDeclarationsChecked = salaryConfirmed && noticePeriodConfirmed && workAuthorizationConfirmed;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
      <div className="bg-white dark:bg-slate-900 rounded-xl shadow-xl border border-slate-200 dark:border-white/10 max-w-2xl w-full max-h-[92vh] flex flex-col overflow-hidden animate-in fade-in zoom-in-95 duration-150">
        {/* Step Indicator Header */}
        <div className="p-5 border-b border-slate-100 dark:border-white/10 flex items-center justify-between bg-slate-50 dark:bg-slate-800/50">
          <div>
            <div className="flex items-center gap-2 text-xs font-semibold text-indigo-700 dark:text-indigo-400 uppercase tracking-wider mb-1">
              <span>Stage {step === 'VALIDATE' ? '1/3: Prerequisites' : step === 'PREFILL' ? '2/3: Assisted Prefill' : '3/3: Outcome Verification'}</span>
            </div>
            <h2 className="text-base font-bold text-slate-900 dark:text-white">
              Apply for {job.title} — {job.company}
            </h2>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-slate-700 dark:hover:text-white rounded-lg hover:bg-slate-200 dark:hover:bg-white/10 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 overflow-y-auto space-y-6 text-xs text-slate-700 dark:text-slate-300">
          {step === 'VALIDATE' && (
            <div className="space-y-4">
              {/* Profile readiness checklist */}
              <div className="p-4 bg-slate-50 dark:bg-slate-800/50 rounded-lg border border-slate-200 dark:border-white/10 space-y-3">
                <span className="font-semibold text-slate-900 dark:text-white text-xs uppercase tracking-wider block">
                  1. Profile Completeness Check
                </span>

                <div className="space-y-2">
                  <div className="flex items-center justify-between text-xs py-1 border-b border-slate-200/60 dark:border-white/10">
                    <span className="text-slate-600 dark:text-slate-400">Full Name & Verified Email</span>
                    <span className="font-mono text-emerald-700 dark:text-emerald-400 font-medium flex items-center gap-1">
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      {profile.fullName || 'User'} ({profile.email || 'N/A'})
                    </span>
                  </div>

                  <div className="flex items-center justify-between text-xs py-1 border-b border-slate-200/60 dark:border-white/10">
                    <span className="text-slate-600 dark:text-slate-400">Contact Phone</span>
                    <span className="font-mono text-emerald-700 dark:text-emerald-400 font-medium flex items-center gap-1">
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      {profile.phone || '+91 98401 23456'}
                    </span>
                  </div>

                  <div className="flex items-center justify-between text-xs py-1 border-b border-slate-200/60 dark:border-white/10">
                    <span className="text-slate-600 dark:text-slate-400">Current Location</span>
                    <span className="font-mono text-emerald-700 dark:text-emerald-400 font-medium flex items-center gap-1">
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      {profile.currentLocation || 'Chennai, Tamil Nadu'}
                    </span>
                  </div>

                  <div className="flex items-center justify-between text-xs py-1">
                    <span className="text-slate-600 dark:text-slate-400">Technical Skills Defined</span>
                    <span className="font-mono text-emerald-700 dark:text-emerald-400 font-medium flex items-center gap-1">
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      {profile.skills?.length || 0} skills listed
                    </span>
                  </div>
                </div>
              </div>

              {/* Resume Selector */}
              <div className="p-4 bg-slate-50 dark:bg-slate-800/50 rounded-lg border border-slate-200 dark:border-white/10 space-y-2">
                <label className="font-semibold text-slate-900 dark:text-white text-xs uppercase tracking-wider block">
                  2. Select Resume Version to Submit
                </label>
                {profile.resumes && profile.resumes.length > 0 ? (
                  <select
                    value={activeResumeId}
                    onChange={e => setActiveResumeId(e.target.value)}
                    className="w-full p-2 bg-white dark:bg-slate-800 border border-slate-300 dark:border-white/10 rounded-md text-xs text-slate-800 dark:text-white focus:outline-hidden focus:ring-1 focus:ring-indigo-500 font-mono"
                  >
                    {profile.resumes.map(r => (
                      <option key={r.id} value={r.id}>
                        {r.name} ({Math.round(r.fileSize / 1024)} KB) - {new Date(r.uploadedAt).toLocaleDateString()}
                      </option>
                    ))}
                  </select>
                ) : (
                  <p className="text-rose-600 dark:text-rose-400 font-medium">
                    No resume found. Please upload a resume in the Resume Manager before continuing.
                  </p>
                )}
              </div>

              {/* Strict Safeguards: Sensitive Declarations */}
              <div className="p-4 bg-amber-50/60 dark:bg-amber-950/30 rounded-lg border border-amber-200/80 dark:border-amber-900/50 space-y-3">
                <div className="flex items-center gap-1.5 font-semibold text-amber-900 dark:text-amber-300 text-xs">
                  <ShieldAlert className="w-4 h-4 text-amber-700 dark:text-amber-400" />
                  <span>Mandatory Declarations Confirmation</span>
                </div>
                <p className="text-[11px] text-amber-800 dark:text-amber-400 leading-relaxed">
                  To prevent unauthorized automated claims, confirm the following information matches what you intend to submit:
                </p>

                <div className="space-y-2 pt-1 text-slate-800 dark:text-slate-200">
                  <label className="flex items-start gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={salaryConfirmed}
                      onChange={e => setSalaryConfirmed(e.target.checked)}
                      className="mt-0.5 rounded text-indigo-600 focus:ring-indigo-500"
                    />
                    <span>
                      I confirm my expected salary is <strong>₹{profile.expectedSalaryMin || 6} - ₹{profile.expectedSalaryMax || 12} LPA</strong>.
                    </span>
                  </label>

                  <label className="flex items-start gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={noticePeriodConfirmed}
                      onChange={e => setNoticePeriodConfirmed(e.target.checked)}
                      className="mt-0.5 rounded text-indigo-600 focus:ring-indigo-500"
                    />
                    <span>
                      I confirm my availability notice period is <strong>{profile.noticePeriodDays || 30} days</strong>.
                    </span>
                  </label>

                  <label className="flex items-start gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={workAuthorizationConfirmed}
                      onChange={e => setWorkAuthorizationConfirmed(e.target.checked)}
                      className="mt-0.5 rounded text-indigo-600 focus:ring-indigo-500"
                    />
                    <span>
                      I confirm I am legally authorized to work in India / Tamil Nadu without sponsorship.
                    </span>
                  </label>
                </div>
              </div>
            </div>
          )}

          {step === 'PREFILL' && (
            <div className="space-y-4">
              <div className="p-3 bg-indigo-50/60 dark:bg-indigo-950/40 rounded-lg border border-indigo-100 dark:border-indigo-900 text-xs text-indigo-900 dark:text-indigo-300">
                <p className="font-semibold mb-1">Assisted Application Workflow</p>
                <p className="text-[11px] text-indigo-800 dark:text-indigo-400 leading-relaxed">
                  Click the copy buttons below to paste verified profile information into the employer&apos;s official application form. When ready, click &quot;Open Official Application Portal&quot;.
                </p>
              </div>

              {/* Ready-to-copy answers */}
              <div className="space-y-2.5">
                <div className="p-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-white/10 rounded-lg flex items-center justify-between gap-3">
                  <div>
                    <span className="text-[10px] text-slate-500 dark:text-slate-400 block uppercase font-medium">Portfolio & GitHub Links</span>
                    <span className="font-mono text-slate-800 dark:text-slate-200 text-[11px] truncate block">
                      {profile.portfolioUrl || 'N/A'} · {profile.gitHubUrl || 'N/A'}
                    </span>
                  </div>
                  <button
                    onClick={() => copyToClipboard(`${profile.portfolioUrl || ''}\n${profile.gitHubUrl || ''}\n${profile.linkedInUrl || ''}`, 'links')}
                    className="px-2.5 py-1 text-slate-700 dark:text-slate-300 bg-white dark:bg-slate-700 border border-slate-300 dark:border-white/10 rounded hover:bg-slate-100 dark:hover:bg-slate-600 flex items-center gap-1 font-medium shrink-0 cursor-pointer"
                  >
                    {copiedField === 'links' ? <Check className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                    <span>{copiedField === 'links' ? 'Copied' : 'Copy Links'}</span>
                  </button>
                </div>

                <div className="p-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-white/10 rounded-lg flex items-center justify-between gap-3">
                  <div>
                    <span className="text-[10px] text-slate-500 dark:text-slate-400 block uppercase font-medium">Core Skills Summary</span>
                    <span className="font-mono text-slate-800 dark:text-slate-200 text-[11px] truncate block">
                      {(profile.skills || []).slice(0, 6).join(', ')}
                    </span>
                  </div>
                  <button
                    onClick={() => copyToClipboard((profile.skills || []).join(', '), 'skills')}
                    className="px-2.5 py-1 text-slate-700 dark:text-slate-300 bg-white dark:bg-slate-700 border border-slate-300 dark:border-white/10 rounded hover:bg-slate-100 dark:hover:bg-slate-600 flex items-center gap-1 font-medium shrink-0 cursor-pointer"
                  >
                    {copiedField === 'skills' ? <Check className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                    <span>{copiedField === 'skills' ? 'Copied' : 'Copy Skills'}</span>
                  </button>
                </div>

                <div className="p-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-white/10 rounded-lg flex items-center justify-between gap-3">
                  <div>
                    <span className="text-[10px] text-slate-500 dark:text-slate-400 block uppercase font-medium">Work Experience & Role Description</span>
                    <span className="font-mono text-slate-800 dark:text-slate-200 text-[11px] truncate block">
                      {profile.experienceYears || 2} Years · React JS / Frontend Developer
                    </span>
                  </div>
                  <button
                    onClick={() => copyToClipboard(profile.workExperience?.[0]?.description || '', 'exp')}
                    className="px-2.5 py-1 text-slate-700 dark:text-slate-300 bg-white dark:bg-slate-700 border border-slate-300 dark:border-white/10 rounded hover:bg-slate-100 dark:hover:bg-slate-600 flex items-center gap-1 font-medium shrink-0 cursor-pointer"
                  >
                    {copiedField === 'exp' ? <Check className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                    <span>{copiedField === 'exp' ? 'Copied' : 'Copy Summary'}</span>
                  </button>
                </div>

                <div className="p-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-white/10 rounded-lg flex items-center justify-between gap-3">
                  <div>
                    <span className="text-[10px] text-slate-500 dark:text-slate-400 block uppercase font-medium">Selected Resume File</span>
                    <span className="font-mono text-slate-800 dark:text-slate-200 text-[11px] truncate block">
                      {activeResume?.name || 'Standard_Resume.pdf'}
                    </span>
                  </div>
                  <span className="text-[10px] font-mono bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-400 px-2 py-0.5 rounded border border-emerald-200 dark:border-emerald-900">
                    Ready to attach
                  </span>
                </div>
              </div>
            </div>
          )}

          {step === 'SUBMIT_CONFIRM' && (
            <div className="space-y-4">
              <div className="p-3 bg-amber-50 dark:bg-amber-950/30 rounded-lg border border-amber-200 dark:border-amber-900/50 text-xs text-amber-900 dark:text-amber-300">
                <span className="font-semibold block mb-0.5">Record Actual Submission Outcome</span>
                <p className="text-[11px] text-amber-800 dark:text-amber-400 leading-relaxed">
                  Never claim an application was submitted merely because a page opened. Please record the true outcome verified from the employer portal or your email confirmation.
                </p>
              </div>

              <div>
                <label className="font-semibold text-slate-900 dark:text-white block mb-1">Outcome Status</label>
                <select
                  value={submissionStatus}
                  onChange={e => setSubmissionStatus(e.target.value)}
                  className="w-full p-2 bg-white dark:bg-slate-800 border border-slate-300 dark:border-white/10 rounded-md text-xs text-slate-800 dark:text-white font-mono"
                >
                  <option value="SUBMITTED">SUBMITTED — Confirmation code received or thank-you page displayed</option>
                  <option value="IN_PROGRESS">IN_PROGRESS — Application draft started; awaiting further user action</option>
                  <option value="FAILED">FAILED — Application rejected, error encountered, or expired job</option>
                  <option value="BLOCKED">BLOCKED — Missing mandatory questions, CAPTCHA, or login obstacle</option>
                  <option value="SUBMISSION_UNKNOWN">SUBMISSION_UNKNOWN — Network dropped or outcome unconfirmed</option>
                </select>
              </div>

              <div>
                <label className="font-semibold text-slate-900 dark:text-white block mb-1">
                  Confirmation Code / Evidence Reference
                </label>
                <input
                  type="text"
                  placeholder="e.g. APP-2026-CHN-8841 or URL confirmation token"
                  value={confirmationRef}
                  onChange={e => setConfirmationRef(e.target.value)}
                  className="w-full p-2 bg-white dark:bg-slate-800 border border-slate-300 dark:border-white/10 rounded-md text-xs font-mono text-slate-800 dark:text-white"
                />
              </div>

              {submissionStatus === 'SUBMITTED' && (
                <div>
                  <label className="font-semibold text-slate-900 dark:text-white block mb-1">
                    Scheduled Follow-Up Date (7 Days Recommended)
                  </label>
                  <input
                    type="date"
                    value={followUpDate}
                    onChange={e => setFollowUpDate(e.target.value)}
                    className="w-full p-2 bg-white dark:bg-slate-800 border border-slate-300 dark:border-white/10 rounded-md text-xs font-mono text-slate-800 dark:text-white"
                  />
                </div>
              )}

              <div>
                <label className="font-semibold text-slate-900 dark:text-white block mb-1">
                  Personal Notes / Questions Encountered
                </label>
                <textarea
                  rows={2}
                  placeholder="Record any portal-specific questions, salary fields, or recruiter names..."
                  value={notes}
                  onChange={e => setNotes(e.target.value)}
                  className="w-full p-2 bg-white dark:bg-slate-800 border border-slate-300 dark:border-white/10 rounded-md text-xs text-slate-800 dark:text-white"
                />
              </div>
            </div>
          )}
        </div>

        {/* Footer Actions */}
        <div className="p-4 border-t border-slate-200 dark:border-white/10 bg-white dark:bg-slate-900 flex items-center justify-between gap-3">
          {step === 'VALIDATE' && (
            <>
              <button
                onClick={onClose}
                className="px-3 py-2 text-xs font-medium text-slate-700 dark:text-slate-300 bg-white dark:bg-slate-800 border border-slate-300 dark:border-white/10 rounded-lg hover:bg-slate-50 dark:hover:bg-white/5 transition-colors cursor-pointer"
              >
                Cancel
              </button>
              <button
                disabled={!allDeclarationsChecked}
                onClick={handleStartWorkflow}
                className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-700 rounded-lg transition-colors disabled:opacity-50 shadow-xs cursor-pointer"
              >
                <span>Continue to Prefill</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </>
          )}

          {step === 'PREFILL' && (
            <>
              <button
                onClick={() => setStep('VALIDATE')}
                className="px-3 py-2 text-xs font-medium text-slate-700 dark:text-slate-300 bg-white dark:bg-slate-800 border border-slate-300 dark:border-white/10 rounded-lg hover:bg-slate-50 dark:hover:bg-white/5 transition-colors cursor-pointer"
              >
                Back
              </button>
              <button
                onClick={handleOpenPortal}
                className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-700 rounded-lg transition-colors shadow-xs cursor-pointer"
              >
                <span>Open Official Application Portal</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </button>
            </>
          )}

          {step === 'SUBMIT_CONFIRM' && (
            <>
              <button
                onClick={() => setStep('PREFILL')}
                className="px-3 py-2 text-xs font-medium text-slate-700 dark:text-slate-300 bg-white dark:bg-slate-800 border border-slate-300 dark:border-white/10 rounded-lg hover:bg-slate-50 dark:hover:bg-white/5 transition-colors cursor-pointer"
              >
                Back
              </button>
              <button
                onClick={handleSaveOutcome}
                className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-700 rounded-lg transition-colors shadow-xs cursor-pointer"
              >
                <Check className="w-3.5 h-3.5" />
                <span>Save Verified Outcome</span>
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
};
