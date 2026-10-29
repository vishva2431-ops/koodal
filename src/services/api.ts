import axios from 'axios';
import { UserProfile, JobListing, ApplicationRecord, ErrorLogRecord, MessageTemplate } from '../types';
import { EMPTY_PROFILE, SAMPLE_DEMO_JOBS, INITIAL_TEMPLATES } from '../data/initialData';

const api = axios.create({
  baseURL: '/api',
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 8000,
});

const STORAGE_KEYS = {
  PROFILE: 'koodal_profile_v2',
  JOBS: 'koodal_jobs_v2',
  APPLICATIONS: 'koodal_applications_v2',
  ERRORS: 'koodal_errors_v2',
  TEMPLATES: 'koodal_templates_v2',
};

// Local storage fallback helpers
function getStored<T>(key: string, fallback: T): T {
  try {
    const raw = localStorage.getItem(key);
    return raw ? JSON.parse(raw) : fallback;
  } catch {
    return fallback;
  }
}

function setStored<T>(key: string, data: T): void {
  try {
    localStorage.setItem(key, JSON.stringify(data));
  } catch (e) {
    console.warn('LocalStorage save error:', e);
  }
}

export const ApiService = {
  // --- Profile ---
  async getProfile(): Promise<UserProfile> {
    try {
      const res = await api.get<UserProfile>('/profile');
      if (res.data && res.data.fullName !== undefined) {
        setStored(STORAGE_KEYS.PROFILE, res.data);
        return res.data;
      }
    } catch {
      // fallback
    }
    return getStored<UserProfile>(STORAGE_KEYS.PROFILE, EMPTY_PROFILE);
  },

  async updateProfile(profile: UserProfile): Promise<UserProfile> {
    setStored(STORAGE_KEYS.PROFILE, profile);
    try {
      const res = await api.put<UserProfile>('/profile', profile);
      return res.data;
    } catch {
      return profile;
    }
  },

  // --- Jobs ---
  async getJobs(): Promise<JobListing[]> {
    try {
      const res = await api.get<JobListing[]>('/jobs');
      if (res.data && Array.isArray(res.data) && res.data.length > 0) {
        setStored(STORAGE_KEYS.JOBS, res.data);
        return res.data;
      }
    } catch {
      // fallback
    }
    return getStored<JobListing[]>(STORAGE_KEYS.JOBS, SAMPLE_DEMO_JOBS);
  },

  async saveJobs(jobs: JobListing[]): Promise<void> {
    setStored(STORAGE_KEYS.JOBS, jobs);
    try {
      await api.post('/jobs/batch-sync', { jobs });
    } catch {
      // safe fallback
    }
  },

  // --- Applications ---
  async getApplications(): Promise<ApplicationRecord[]> {
    try {
      const res = await api.get<ApplicationRecord[]>('/applications');
      if (res.data && Array.isArray(res.data)) {
        setStored(STORAGE_KEYS.APPLICATIONS, res.data);
        return res.data;
      }
    } catch {
      // fallback
    }
    return getStored<ApplicationRecord[]>(STORAGE_KEYS.APPLICATIONS, []);
  },

  async saveApplications(apps: ApplicationRecord[]): Promise<void> {
    setStored(STORAGE_KEYS.APPLICATIONS, apps);
    try {
      await api.post('/applications/batch-sync', { applications: apps });
    } catch {
      // safe fallback
    }
  },

  // --- Errors & Recovery ---
  async getErrorLogs(): Promise<ErrorLogRecord[]> {
    try {
      const res = await api.get<ErrorLogRecord[]>('/applications/errors');
      if (res.data && Array.isArray(res.data)) {
        setStored(STORAGE_KEYS.ERRORS, res.data);
        return res.data;
      }
    } catch {
      // fallback
    }
    return getStored<ErrorLogRecord[]>(STORAGE_KEYS.ERRORS, []);
  },

  async saveErrorLogs(errors: ErrorLogRecord[]): Promise<void> {
    setStored(STORAGE_KEYS.ERRORS, errors);
    try {
      await api.post('/applications/errors/sync', { errors });
    } catch {
      // safe fallback
    }
  },

  // --- Templates ---
  async getTemplates(): Promise<MessageTemplate[]> {
    try {
      const res = await api.get<MessageTemplate[]>('/message-templates');
      if (res.data && Array.isArray(res.data) && res.data.length > 0) {
        setStored(STORAGE_KEYS.TEMPLATES, res.data);
        return res.data;
      }
    } catch {
      // fallback
    }
    return getStored<MessageTemplate[]>(STORAGE_KEYS.TEMPLATES, INITIAL_TEMPLATES);
  },

  async saveTemplates(templates: MessageTemplate[]): Promise<void> {
    setStored(STORAGE_KEYS.TEMPLATES, templates);
    try {
      await api.post('/message-templates/batch-sync', { templates });
    } catch {
      // safe fallback
    }
  },
};
