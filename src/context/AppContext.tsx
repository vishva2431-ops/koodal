import React, { createContext, useContext, useState, useEffect, ReactNode, useMemo } from 'react';
import { 
  UserProfile, 
  JobListing, 
  ApplicationRecord, 
  ErrorLogRecord, 
  MessageTemplate, 
  ApplicationStatus,
  PortalSource,
  WorkArrangement,
  EmploymentType,
  MatchScoreBreakdown
} from '../types';
import { ApiService } from '../services/api';
import { calculateJobMatch } from '../services/matchingEngine';
import { isDuplicateJob } from '../services/sourceAdapters';

export interface FilterState {
  search: string;
  location: string;
  role: string;
  source: string;
  workArrangement: string;
  minMatchScore: number;
  status: string;
  isDemoOnly: boolean | null;
}

interface AppContextType {
  profile: UserProfile;
  jobs: JobListing[];
  applications: ApplicationRecord[];
  errorLogs: ErrorLogRecord[];
  templates: MessageTemplate[];
  loading: boolean;
  selectedJobIds: string[];
  filter: FilterState;
  
  // Actions
  updateProfile: (updated: Partial<UserProfile>) => Promise<void>;
  updateFilter: (updated: Partial<FilterState>) => void;
  resetFilter: () => void;
  toggleJobSelection: (jobId: string) => void;
  selectAllFilteredJobs: (jobIds: string[]) => void;
  clearSelection: () => void;
  addNewJob: (newJob: Partial<JobListing>) => { success: boolean; message: string; job?: JobListing };
  refreshJobs: () => Promise<void>;
  prepareApplication: (jobId: string, resumeId?: string, notes?: string) => Promise<ApplicationRecord>;
  recordApplicationOutcome: (
    applicationId: string, 
    status: ApplicationStatus, 
    details: {
      confirmationReference?: string;
      notes?: string;
      followUpDate?: string;
      errorStage?: 'PREREQUISITE_CHECK' | 'FORM_NAVIGATION' | 'DOCUMENT_UPLOAD' | 'SUBMISSION_VERIFICATION' | 'PORTAL_AUTH';
      errorCode?: string;
      errorMessage?: string;
      evidence?: string;
      rootCauseConfirmed?: boolean;
      causeDescription?: string;
      recoveryAction?: string;
      isSafeToRetry?: boolean;
    }
  ) => Promise<void>;
  resolveErrorLog: (errorLogId: string) => Promise<void>;
  saveTemplate: (template: MessageTemplate) => Promise<void>;
  deleteTemplate: (id: string) => Promise<void>;
  exportApplicationsCsv: () => void;
}

const defaultFilter: FilterState = {
  search: '',
  location: 'ALL',
  role: 'ALL',
  source: 'ALL',
  workArrangement: 'ALL',
  minMatchScore: 0,
  status: 'ALL',
  isDemoOnly: null,
};

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [profile, setProfile] = useState<UserProfile>(() => ({} as UserProfile));
  const [jobs, setJobs] = useState<JobListing[]>([]);
  const [applications, setApplications] = useState<ApplicationRecord[]>([]);
  const [errorLogs, setErrorLogs] = useState<ErrorLogRecord[]>([]);
  const [templates, setTemplates] = useState<MessageTemplate[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [selectedJobIds, setSelectedJobIds] = useState<string[]>([]);
  const [filter, setFilter] = useState<FilterState>(defaultFilter);

  // Initialize data on mount
  useEffect(() => {
    async function loadInitialData() {
      setLoading(true);
      try {
        const [profData, jobsData, appsData, errsData, tplsData] = await Promise.all([
          ApiService.getProfile(),
          ApiService.getJobs(),
          ApiService.getApplications(),
          ApiService.getErrorLogs(),
          ApiService.getTemplates(),
        ]);
        setProfile(profData);
        setJobs(jobsData);
        setApplications(appsData);
        setErrorLogs(errsData);
        setTemplates(tplsData);

        // Pre-select jobs flagged in initial data
        const preSelected = jobsData.filter(j => j.selectedForApplication).map(j => j.id);
        setSelectedJobIds(preSelected);
      } catch (err) {
        console.error('Failed to load initial data:', err);
      } finally {
        setLoading(false);
      }
    }
    loadInitialData();
  }, []);

  // Update profile
  const updateProfile = async (updated: Partial<UserProfile>) => {
    const newProfile: UserProfile = {
      ...profile,
      ...updated,
      updatedAt: new Date().toISOString(),
    };

    // Calculate completeness score
    let score = 0;
    if (newProfile.fullName) score += 10;
    if (newProfile.email) score += 10;
    if (newProfile.phone) score += 10;
    if (newProfile.currentLocation) score += 10;
    if (newProfile.linkedInUrl || newProfile.gitHubUrl || newProfile.portfolioUrl) score += 10;
    if (newProfile.preferredRoles && newProfile.preferredRoles.length > 0) score += 10;
    if (newProfile.preferredLocations && newProfile.preferredLocations.length > 0) score += 10;
    if (newProfile.skills && newProfile.skills.length >= 3) score += 15;
    if (newProfile.education && newProfile.education.length > 0) score += 10;
    if (newProfile.resumes && newProfile.resumes.length > 0) score += 5;
    newProfile.completenessScore = Math.min(100, score);

    setProfile(newProfile);
    await ApiService.updateProfile(newProfile);
  };

  const updateFilter = (updated: Partial<FilterState>) => {
    setFilter(prev => ({ ...prev, ...updated }));
  };

  const resetFilter = () => {
    setFilter(defaultFilter);
  };

  const toggleJobSelection = (jobId: string) => {
    setSelectedJobIds(prev => {
      const next = prev.includes(jobId) ? prev.filter(id => id !== jobId) : [...prev, jobId];
      // update job listing selected flag
      setJobs(currJobs => 
        currJobs.map(j => (j.id === jobId ? { ...j, selectedForApplication: next.includes(jobId) } : j))
      );
      return next;
    });
  };

  const selectAllFilteredJobs = (jobIds: string[]) => {
    setSelectedJobIds(prev => {
      const combined = Array.from(new Set([...prev, ...jobIds]));
      setJobs(curr => curr.map(j => ({ ...j, selectedForApplication: combined.includes(j.id) })));
      return combined;
    });
  };

  const clearSelection = () => {
    setSelectedJobIds([]);
    setJobs(curr => curr.map(j => ({ ...j, selectedForApplication: false })));
  };

  const addNewJob = (newJobData: Partial<JobListing>): { success: boolean; message: string; job?: JobListing } => {
    if (!newJobData.title || !newJobData.company || !newJobData.location) {
      return { success: false, message: 'Job title, company, and location are required.' };
    }

    if (isDuplicateJob(newJobData, jobs)) {
      return { success: false, message: 'Duplicate posting detected: This job already exists in your catalog.' };
    }

    const createdJob: JobListing = {
      id: `job_custom_${Date.now()}`,
      title: newJobData.title.trim(),
      company: newJobData.company.trim(),
      location: newJobData.location.trim(),
      state: 'Tamil Nadu',
      description: newJobData.description || 'Discovered opportunity captured for application.',
      requiredSkills: newJobData.requiredSkills || ['React.js', 'JavaScript'],
      experienceMin: newJobData.experienceMin ?? 1,
      experienceMax: newJobData.experienceMax ?? 4,
      salaryMin: newJobData.salaryMin,
      salaryMax: newJobData.salaryMax,
      salaryDisplay: newJobData.salaryDisplay || (newJobData.salaryMin ? `₹${newJobData.salaryMin} - ₹${newJobData.salaryMax || ''} LPA` : 'Not disclosed'),
      employmentType: (newJobData.employmentType as EmploymentType) || 'FULL_TIME',
      workArrangement: (newJobData.workArrangement as WorkArrangement) || 'HYBRID',
      source: (newJobData.source as PortalSource) || 'COMPANY_CAREER',
      originalUrl: newJobData.originalUrl || 'https://google.com',
      directApplicationUrl: newJobData.directApplicationUrl || newJobData.originalUrl,
      dateDiscovered: new Date().toISOString(),
      applicationMethod: 'DIRECT_URL',
      isDemoData: false,
      isOpen: true,
      selectedForApplication: false,
      contactEmail: newJobData.contactEmail,
    };

    const updated = [createdJob, ...jobs];
    setJobs(updated);
    ApiService.saveJobs(updated);
    return { success: true, message: 'Job successfully saved and matched against your profile.', job: createdJob };
  };

  const refreshJobs = async () => {
    setLoading(true);
    try {
      // Re-fetch jobs from server/storage
      const fresh = await ApiService.getJobs();
      setJobs(fresh);
    } finally {
      setLoading(false);
    }
  };

  const prepareApplication = async (jobId: string, resumeId?: string, notes?: string): Promise<ApplicationRecord> => {
    const targetJob = jobs.find(j => j.id === jobId);
    if (!targetJob) {
      throw new Error('Target job listing not found');
    }

    // Check if an application already exists for this job
    const existing = applications.find(a => a.jobId === jobId && a.status !== 'FAILED');
    if (existing) {
      return existing;
    }

    const activeResume = profile.resumes?.find(r => r.id === (resumeId || profile.activeResumeId)) || profile.resumes?.[0];

    const newApp: ApplicationRecord = {
      id: `app_${Date.now()}`,
      jobId: targetJob.id,
      jobTitle: targetJob.title,
      company: targetJob.company,
      source: targetJob.source,
      jobUrl: targetJob.directApplicationUrl || targetJob.originalUrl,
      status: 'IN_PROGRESS',
      appliedDate: new Date().toISOString(),
      resumeVersionId: activeResume?.id,
      resumeName: activeResume?.name,
      notes: notes || 'Assisted application workflow initiated.',
      submissionMethod: 'ASSISTED',
      isResolved: false,
      updatedAt: new Date().toISOString(),
    };

    const updated = [newApp, ...applications];
    setApplications(updated);
    await ApiService.saveApplications(updated);
    return newApp;
  };

  const recordApplicationOutcome = async (
    applicationId: string, 
    status: ApplicationStatus, 
    details: {
      confirmationReference?: string;
      notes?: string;
      followUpDate?: string;
      errorStage?: 'PREREQUISITE_CHECK' | 'FORM_NAVIGATION' | 'DOCUMENT_UPLOAD' | 'SUBMISSION_VERIFICATION' | 'PORTAL_AUTH';
      errorCode?: string;
      errorMessage?: string;
      evidence?: string;
      rootCauseConfirmed?: boolean;
      causeDescription?: string;
      recoveryAction?: string;
      isSafeToRetry?: boolean;
    }
  ) => {
    const updatedApps = applications.map(app => {
      if (app.id === applicationId) {
        return {
          ...app,
          status,
          confirmationReference: details.confirmationReference || app.confirmationReference,
          notes: details.notes ? `${app.notes ? app.notes + ' | ' : ''}${details.notes}` : app.notes,
          followUpDate: details.followUpDate || app.followUpDate,
          isResolved: status === 'SUBMITTED',
          updatedAt: new Date().toISOString(),
        };
      }
      return app;
    });

    setApplications(updatedApps);
    await ApiService.saveApplications(updatedApps);

    // If status is FAILED, BLOCKED, or SUBMISSION_UNKNOWN, create an ErrorLogRecord
    if (['FAILED', 'BLOCKED', 'SUBMISSION_UNKNOWN'].includes(status)) {
      const app = applications.find(a => a.id === applicationId);
      const newError: ErrorLogRecord = {
        id: `err_${Date.now()}`,
        applicationId,
        jobId: app ? app.jobId : 'unknown',
        jobTitle: app ? app.jobTitle : 'Role',
        company: app ? app.company : 'Company',
        source: app ? app.source : 'COMPANY_CAREER',
        timestamp: new Date().toISOString(),
        stage: details.errorStage || 'SUBMISSION_VERIFICATION',
        errorCode: details.errorCode || 'APPLICATION_INTERRUPTED',
        errorMessage: details.errorMessage || 'Application attempt was interrupted or unconfirmed.',
        evidence: details.evidence || 'Recorded user-assisted outcome status.',
        rootCauseConfirmed: details.rootCauseConfirmed ?? false,
        causeDescription: details.causeDescription || (details.rootCauseConfirmed ? 'Identified barrier during application flow.' : 'Cause not confirmed. Investigation required before retry.'),
        recoveryAction: details.recoveryAction || 'Review job portal link, verify contact requirements, and check email before attempting resubmission.',
        isSafeToRetry: details.isSafeToRetry ?? false,
        status,
      };

      const updatedErrors = [newError, ...errorLogs];
      setErrorLogs(updatedErrors);
      await ApiService.saveErrorLogs(updatedErrors);
    }
  };

  const resolveErrorLog = async (errorLogId: string) => {
    const targetError = errorLogs.find(e => e.id === errorLogId);
    if (!targetError) return;

    const updatedErrors = errorLogs.filter(e => e.id !== errorLogId);
    setErrorLogs(updatedErrors);
    await ApiService.saveErrorLogs(updatedErrors);

    // Also mark application as resolved if exists
    if (targetError.applicationId) {
      const updatedApps = applications.map(a => 
        a.id === targetError.applicationId ? { ...a, isResolved: true, status: 'READY' as ApplicationStatus } : a
      );
      setApplications(updatedApps);
      await ApiService.saveApplications(updatedApps);
    }
  };

  const saveTemplate = async (template: MessageTemplate) => {
    const exists = templates.some(t => t.id === template.id);
    let updated: MessageTemplate[];
    if (exists) {
      updated = templates.map(t => (t.id === template.id ? template : t));
    } else {
      updated = [...templates, template];
    }
    setTemplates(updated);
    await ApiService.saveTemplates(updated);
  };

  const deleteTemplate = async (id: string) => {
    const updated = templates.filter(t => t.id !== id);
    setTemplates(updated);
    await ApiService.saveTemplates(updated);
  };

  const exportApplicationsCsv = () => {
    if (applications.length === 0) {
      alert('No application records to export.');
      return;
    }

    const headers = [
      'Application ID',
      'Job Title',
      'Company',
      'Source',
      'Status',
      'Applied Date',
      'Confirmation Reference',
      'Resume Used',
      'Follow-Up Date',
      'Job URL',
      'Notes'
    ];

    const escapeCsv = (str: string | undefined) => {
      if (!str) return '""';
      const clean = str.replace(/"/g, '""');
      return `"${clean}"`;
    };

    const rows = applications.map(a => [
      escapeCsv(a.id),
      escapeCsv(a.jobTitle),
      escapeCsv(a.company),
      escapeCsv(a.source),
      escapeCsv(a.status),
      escapeCsv(a.appliedDate),
      escapeCsv(a.confirmationReference || 'N/A'),
      escapeCsv(a.resumeName || 'Default'),
      escapeCsv(a.followUpDate || 'None'),
      escapeCsv(a.jobUrl),
      escapeCsv(a.notes)
    ].join(','));

    const csvContent = [headers.join(','), ...rows].join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `koodal_applications_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  return (
    <AppContext.Provider
      value={{
        profile,
        jobs,
        applications,
        errorLogs,
        templates,
        loading,
        selectedJobIds,
        filter,
        updateProfile,
        updateFilter,
        resetFilter,
        toggleJobSelection,
        selectAllFilteredJobs,
        clearSelection,
        addNewJob,
        refreshJobs,
        prepareApplication,
        recordApplicationOutcome,
        resolveErrorLog,
        saveTemplate,
        deleteTemplate,
        exportApplicationsCsv,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};
