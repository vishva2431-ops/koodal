import React, { useState } from 'react';
import { X, Plus, AlertCircle, CheckCircle2, ShieldCheck } from 'lucide-react';
import { PortalSource, WorkArrangement, EmploymentType } from '../../types';
import { useApp } from '../../context/AppContext';

interface AddJobModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const TAMIL_NADU_LOCATIONS = [
  'Chennai, Tamil Nadu',
  'Coimbatore, Tamil Nadu',
  'Madurai, Tamil Nadu',
  'Tiruchirappalli (Trichy), Tamil Nadu',
  'Salem, Tamil Nadu',
  'Tirunelveli, Tamil Nadu',
  'Erode, Tamil Nadu',
  'Vellore, Tamil Nadu',
  'Remote (Tamil Nadu)',
];

export const AddJobModal: React.FC<AddJobModalProps> = ({ isOpen, onClose }) => {
  const { addNewJob } = useApp();

  const [title, setTitle] = useState('');
  const [company, setCompany] = useState('');
  const [location, setLocation] = useState('Chennai, Tamil Nadu');
  const [source, setSource] = useState<PortalSource>('COMPANY_CAREER');
  const [workArrangement, setWorkArrangement] = useState<WorkArrangement>('HYBRID');
  const [employmentType, setEmploymentType] = useState<EmploymentType>('FULL_TIME');
  const [experienceMin, setExperienceMin] = useState(2);
  const [experienceMax, setExperienceMax] = useState(5);
  const [salaryMin, setSalaryMin] = useState(8);
  const [salaryMax, setSalaryMax] = useState(14);
  const [skillsString, setSkillsString] = useState('React.js, TypeScript, Tailwind CSS, REST APIs');
  const [originalUrl, setOriginalUrl] = useState('');
  const [description, setDescription] = useState('');
  const [contactEmail, setContactEmail] = useState('');
  const [feedback, setFeedback] = useState<{ isError: boolean; message: string } | null>(null);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setFeedback(null);

    const skills = skillsString
      .split(',')
      .map(s => s.trim())
      .filter(Boolean);

    const res = addNewJob({
      title,
      company,
      location,
      source,
      workArrangement,
      employmentType,
      experienceMin: Number(experienceMin),
      experienceMax: Number(experienceMax),
      salaryMin: Number(salaryMin),
      salaryMax: Number(salaryMax),
      salaryDisplay: `₹${salaryMin} - ₹${salaryMax} LPA`,
      requiredSkills: skills,
      originalUrl: originalUrl.trim() || 'https://google.com',
      directApplicationUrl: originalUrl.trim() || 'https://google.com',
      description: description.trim() || `Position for ${title} at ${company} in ${location}.`,
      contactEmail: contactEmail.trim() || undefined,
    });

    if (res.success) {
      setFeedback({ isError: false, message: res.message });
      setTimeout(() => {
        onClose();
        setFeedback(null);
        // Reset form
        setTitle('');
        setCompany('');
        setOriginalUrl('');
        setDescription('');
      }, 1000);
    } else {
      setFeedback({ isError: true, message: res.message });
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
      <div className="bg-white rounded-xl shadow-xl border border-slate-200 max-w-xl w-full max-h-[90vh] flex flex-col overflow-hidden animate-in fade-in zoom-in-95 duration-150">
        <div className="p-5 border-b border-slate-100 flex items-center justify-between bg-slate-50">
          <div>
            <h2 className="text-base font-bold text-slate-900">
              Quick Capture Job Opportunity
            </h2>
            <p className="text-xs text-slate-500">
              Add a verified job posting from any authorized portal or employer page
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-slate-700 rounded-lg hover:bg-slate-200 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 overflow-y-auto space-y-4 text-xs">
          {feedback && (
            <div
              className={`p-3 rounded-lg flex items-center gap-2 ${
                feedback.isError
                  ? 'bg-rose-50 border border-rose-200 text-rose-800'
                  : 'bg-emerald-50 border border-emerald-200 text-emerald-800'
              }`}
            >
              {feedback.isError ? <AlertCircle className="w-4 h-4 shrink-0" /> : <CheckCircle2 className="w-4 h-4 shrink-0" />}
              <span>{feedback.message}</span>
            </div>
          )}

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="font-semibold text-slate-800 block mb-1">
                Job Title <span className="text-rose-600">*</span>
              </label>
              <input
                type="text"
                required
                placeholder="e.g. React JS Developer"
                value={title}
                onChange={e => setTitle(e.target.value)}
                className="w-full p-2 bg-white border border-slate-300 rounded-md text-xs focus:ring-1 focus:ring-indigo-500"
              />
            </div>

            <div>
              <label className="font-semibold text-slate-800 block mb-1">
                Company Name <span className="text-rose-600">*</span>
              </label>
              <input
                type="text"
                required
                placeholder="e.g. Zoho, Freshworks, Solartis"
                value={company}
                onChange={e => setCompany(e.target.value)}
                className="w-full p-2 bg-white border border-slate-300 rounded-md text-xs focus:ring-1 focus:ring-indigo-500"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="font-semibold text-slate-800 block mb-1">
                Location in Tamil Nadu
              </label>
              <select
                value={location}
                onChange={e => setLocation(e.target.value)}
                className="w-full p-2 bg-white border border-slate-300 rounded-md text-xs"
              >
                {TAMIL_NADU_LOCATIONS.map(loc => (
                  <option key={loc} value={loc}>
                    {loc}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="font-semibold text-slate-800 block mb-1">
                Source Portal
              </label>
              <select
                value={source}
                onChange={e => setSource(e.target.value as PortalSource)}
                className="w-full p-2 bg-white border border-slate-300 rounded-md text-xs font-mono"
              >
                <option value="COMPANY_CAREER">Company Career Portal</option>
                <option value="NAUKRI">Naukri.com</option>
                <option value="LINKEDIN">LinkedIn Jobs</option>
                <option value="INDEED">Indeed India</option>
                <option value="AUTHORIZED_FEED">Authorized Feed / Referral</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <div>
              <label className="font-semibold text-slate-800 block mb-1">Min Exp (Yrs)</label>
              <input
                type="number"
                min="0"
                max="20"
                value={experienceMin}
                onChange={e => setExperienceMin(Number(e.target.value))}
                className="w-full p-2 bg-white border border-slate-300 rounded-md text-xs"
              />
            </div>
            <div>
              <label className="font-semibold text-slate-800 block mb-1">Max Exp (Yrs)</label>
              <input
                type="number"
                min="0"
                max="20"
                value={experienceMax}
                onChange={e => setExperienceMax(Number(e.target.value))}
                className="w-full p-2 bg-white border border-slate-300 rounded-md text-xs"
              />
            </div>
            <div>
              <label className="font-semibold text-slate-800 block mb-1">Min LPA (₹)</label>
              <input
                type="number"
                min="1"
                max="80"
                value={salaryMin}
                onChange={e => setSalaryMin(Number(e.target.value))}
                className="w-full p-2 bg-white border border-slate-300 rounded-md text-xs"
              />
            </div>
            <div>
              <label className="font-semibold text-slate-800 block mb-1">Max LPA (₹)</label>
              <input
                type="number"
                min="1"
                max="80"
                value={salaryMax}
                onChange={e => setSalaryMax(Number(e.target.value))}
                className="w-full p-2 bg-white border border-slate-300 rounded-md text-xs"
              />
            </div>
          </div>

          <div>
            <label className="font-semibold text-slate-800 block mb-1">
              Required Technical Skills (Comma separated)
            </label>
            <input
              type="text"
              placeholder="e.g. React.js, TypeScript, Next.js, Tailwind CSS, REST APIs"
              value={skillsString}
              onChange={e => setSkillsString(e.target.value)}
              className="w-full p-2 bg-white border border-slate-300 rounded-md text-xs"
            />
          </div>

          <div>
            <label className="font-semibold text-slate-800 block mb-1">
              Official Job Posting URL
            </label>
            <input
              type="url"
              placeholder="https://company.com/careers/job-123"
              value={originalUrl}
              onChange={e => setOriginalUrl(e.target.value)}
              className="w-full p-2 bg-white border border-slate-300 rounded-md text-xs font-mono"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="font-semibold text-slate-800 block mb-1">
                Recruiter Contact Email (Optional)
              </label>
              <input
                type="email"
                placeholder="recruitment@company.com"
                value={contactEmail}
                onChange={e => setContactEmail(e.target.value)}
                className="w-full p-2 bg-white border border-slate-300 rounded-md text-xs font-mono"
              />
            </div>

            <div>
              <label className="font-semibold text-slate-800 block mb-1">Work Arrangement</label>
              <select
                value={workArrangement}
                onChange={e => setWorkArrangement(e.target.value as WorkArrangement)}
                className="w-full p-2 bg-white border border-slate-300 rounded-md text-xs"
              >
                <option value="HYBRID">Hybrid</option>
                <option value="REMOTE">Remote</option>
                <option value="ON_SITE">On-Site</option>
              </select>
            </div>
          </div>

          <div>
            <label className="font-semibold text-slate-800 block mb-1">
              Job Description / Key Notes
            </label>
            <textarea
              rows={2}
              placeholder="Paste job description or special recruiter notes..."
              value={description}
              onChange={e => setDescription(e.target.value)}
              className="w-full p-2 bg-white border border-slate-300 rounded-md text-xs"
            />
          </div>

          <div className="p-3 bg-slate-50 rounded-lg border border-slate-200 flex items-center gap-2 text-[11px] text-slate-600">
            <ShieldCheck className="w-4 h-4 text-indigo-600 shrink-0" />
            <span>Automatic duplicate detection compares title, company, and location hash against your catalog.</span>
          </div>

          <div className="pt-2 flex items-center justify-end gap-2.5">
            <button
              type="button"
              onClick={onClose}
              className="px-3 py-2 text-xs font-medium text-slate-700 bg-white border border-slate-300 rounded-lg hover:bg-slate-50 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-700 rounded-lg transition-colors shadow-xs"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Capture & Match</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
