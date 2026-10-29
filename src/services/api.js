import axios from 'axios';
import { EMPTY_PROFILE, SAMPLE_DEMO_JOBS, INITIAL_TEMPLATES } from '../data/initialData.js';

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
function getStored(key, fallback) {
  try {
    const raw = localStorage.getItem(key);
    return raw ? JSON.parse(raw) : fallback;
  } catch {
    return fallback;
  }
}

function setStored(key, data) {
  try {
    localStorage.setItem(key, JSON.stringify(data));
  } catch (e) {
    console.warn('LocalStorage save error:', e);
  }
}

export const ApiService = {
  // --- Profile ---
  async getProfile() {
    try {
      const res = await api.get('/profile');
      if (res.data && res.data.fullName !== undefined) {
        setStored(STORAGE_KEYS.PROFILE, res.data);
        return res.data;
      }
    } catch {
      // fallback
    }
    return getStored(STORAGE_KEYS.PROFILE, EMPTY_PROFILE);
  },

  async updateProfile(profile) {
    setStored(STORAGE_KEYS.PROFILE, profile);
    try {
      const res = await api.put('/profile', profile);
      return res.data;
    } catch {
      return profile;
    }
  },

  // --- Jobs ---
  async getJobs() {
    try {
      const res = await api.get('/jobs');
      if (res.data && Array.isArray(res.data) && res.data.length > 0) {
        setStored(STORAGE_KEYS.JOBS, res.data);
        return res.data;
      }
    } catch {
      // fallback
    }
    return getStored(STORAGE_KEYS.JOBS, SAMPLE_DEMO_JOBS);
  },

  async saveJobs(jobs) {
    setStored(STORAGE_KEYS.JOBS, jobs);
    try {
      await api.post('/jobs/batch-sync', { jobs });
    } catch {
      // safe fallback
    }
  },

  // --- Applications ---
  async getApplications() {
    try {
      const res = await api.get('/applications');
      if (res.data && Array.isArray(res.data)) {
        setStored(STORAGE_KEYS.APPLICATIONS, res.data);
        return res.data;
      }
    } catch {
      // fallback
    }
    return getStored(STORAGE_KEYS.APPLICATIONS, []);
  },

  async saveApplications(apps) {
    setStored(STORAGE_KEYS.APPLICATIONS, apps);
    try {
      await api.post('/applications/batch-sync', { applications: apps });
    } catch {
      // safe fallback
    }
  },

  // --- Errors & Recovery ---
  async getErrorLogs() {
    try {
      const res = await api.get('/applications/errors');
      if (res.data && Array.isArray(res.data)) {
        setStored(STORAGE_KEYS.ERRORS, res.data);
        return res.data;
      }
    } catch {
      // fallback
    }
    return getStored(STORAGE_KEYS.ERRORS, []);
  },

  async saveErrorLogs(errors) {
    setStored(STORAGE_KEYS.ERRORS, errors);
    try {
      await api.post('/applications/errors/sync', { errors });
    } catch {
      // safe fallback
    }
  },

  // --- Templates ---
  async getTemplates() {
    try {
      const res = await api.get('/message-templates');
      if (res.data && Array.isArray(res.data) && res.data.length > 0) {
        setStored(STORAGE_KEYS.TEMPLATES, res.data);
        return res.data;
      }
    } catch {
      // fallback
    }
    return getStored(STORAGE_KEYS.TEMPLATES, INITIAL_TEMPLATES);
  },

  async saveTemplates(templates) {
    setStored(STORAGE_KEYS.TEMPLATES, templates);
    try {
      await api.post('/message-templates/batch-sync', { templates });
    } catch {
      // safe fallback
    }
  },

  // --- Gemini AI Career Copilot & Grounding ---
  async chatWithGemini({ messages, prompt, toolMode = 'none', userLocation, candidateContext }) {
    try {
      const res = await api.post('/ai/chat', {
        messages,
        prompt,
        toolMode,
        userLocation,
        candidateContext,
      }, { timeout: 30000 });
      return res.data;
    } catch (err) {
      console.error('Gemini chat error:', err);
      return {
        reply: "Could not reach the Gemini service. Please verify your connection or check your API key in Settings > Secrets.",
        sources: [],
        error: true,
      };
    }
  },
};
