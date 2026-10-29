/**
 * Adapter for Naukri.com India
 * Uses official web query parameters with Tamil Nadu location city mapping
 */
export const NaukriAdapter = {
  sourceId: 'NAUKRI',
  displayName: 'Naukri.com India',
  generateCompliantSearchUrl: (query) => {
    const roleSlug = encodeURIComponent((query?.role || '').toLowerCase().replace(/\s+/g, '-'));
    const locSlug = encodeURIComponent((query?.location || '').toLowerCase().replace(/\s+/g, '-'));
    return `https://www.naukri.com/${roleSlug}-jobs-in-${locSlug}?k=${encodeURIComponent(query?.role || '')}&l=${encodeURIComponent(query?.location || '')}&cityTypeGid=9508`;
  },
  getComplianceDetails: () => ({
    isDirectApiAvailable: false,
    authorizedMethod: 'Compliant query constructor with Tamil Nadu geo parameters and assisted browser review.',
    termsConstraint: 'Naukri.com (Info Edge India) terms explicitly prohibit automated headless bots, reverse proxying, and credential scraping. We provide verified official search links and user-guided capture.',
    documentationUrl: 'https://www.naukri.com/termsconditions',
  }),
  validateJobUrl: (url) => {
    if (!url || !url.includes('naukri.com')) {
      return { isValid: false, error: 'URL must belong to the official naukri.com domain' };
    }
    return { isValid: true };
  },
};

/**
 * Adapter for LinkedIn
 * Generates verified boolean queries with Tamil Nadu geoId
 */
export const LinkedInAdapter = {
  sourceId: 'LINKEDIN',
  displayName: 'LinkedIn Jobs',
  generateCompliantSearchUrl: (query) => {
    const keywords = encodeURIComponent(`${query?.role || ''}`);
    const location = encodeURIComponent(`${query?.location || ''}, Tamil Nadu, India`);
    // geoId 105556991 represents Tamil Nadu, India in LinkedIn's taxonomy
    return `https://www.linkedin.com/jobs/search/?keywords=${keywords}&location=${location}&geoId=105556991&f_TPR=r604800`;
  },
  getComplianceDetails: () => ({
    isDirectApiAvailable: false,
    authorizedMethod: 'Official URL deep-linking with targeted boolean parameters, assisted application, and manual outcome confirmation.',
    termsConstraint: 'The LinkedIn Job Application API is restricted strictly to enterprise ATS partners (Workday, Greenhouse, etc.). Personal automated submission bots violate LinkedIn User Agreement.',
    documentationUrl: 'https://learn.microsoft.com/en-us/linkedin/talent/job-postings/api-overview',
  }),
  validateJobUrl: (url) => {
    if (!url || !url.includes('linkedin.com/jobs')) {
      return { isValid: false, error: 'URL must be a valid LinkedIn Jobs link (linkedin.com/jobs/view/...)' };
    }
    return { isValid: true };
  },
};

/**
 * Adapter for Indeed India
 */
export const IndeedAdapter = {
  sourceId: 'INDEED',
  displayName: 'Indeed India',
  generateCompliantSearchUrl: (query) => {
    const q = encodeURIComponent(query?.role || '');
    const l = encodeURIComponent(`${query?.location || ''}, Tamil Nadu`);
    return `https://in.indeed.com/jobs?q=${q}&l=${l}&fromage=14`;
  },
  getComplianceDetails: () => ({
    isDirectApiAvailable: false,
    authorizedMethod: 'Compliant search query builder with location radius and direct application redirection.',
    termsConstraint: 'Indeed prohibits automated scraping and headless browser submission via robots.txt and user terms. Direct links and publisher feeds are the permitted zero-cost mechanism.',
    documentationUrl: 'https://in.indeed.com/legal',
  }),
  validateJobUrl: (url) => {
    if (!url || !url.includes('indeed.com')) {
      return { isValid: false, error: 'URL must belong to Indeed India (in.indeed.com)' };
    }
    return { isValid: true };
  },
};

/**
 * Adapter for Direct Company Career Portals
 */
export const CompanyCareerAdapter = {
  sourceId: 'COMPANY_CAREER',
  displayName: 'Company Career Pages',
  generateCompliantSearchUrl: (query) => {
    return `https://www.google.com/search?q=${encodeURIComponent((query?.role || '') + ' careers ' + (query?.location || '') + ' Tamil Nadu')}`;
  },
  getComplianceDetails: () => ({
    isDirectApiAvailable: true,
    authorizedMethod: 'Direct career portal deep-linking, direct employer contact emails, and structured job data capture.',
    termsConstraint: 'Direct authorized submission via company career forms or direct email outreach.',
  }),
  validateJobUrl: (url) => {
    try {
      new URL(url);
      return { isValid: true };
    } catch {
      return { isValid: false, error: 'Invalid URL format' };
    }
  },
};

export const SOURCE_ADAPTERS = {
  NAUKRI: NaukriAdapter,
  LINKEDIN: LinkedInAdapter,
  INDEED: IndeedAdapter,
  COMPANY_CAREER: CompanyCareerAdapter,
  AUTHORIZED_FEED: CompanyCareerAdapter,
};

/**
 * Generates duplicate detection hash for a job posting
 */
export function generateJobFingerprint(title, company, location) {
  const cleanTitle = (title || '').toLowerCase().replace(/[^a-z0-9]/g, '');
  const cleanCompany = (company || '').toLowerCase().replace(/[^a-z0-9]/g, '');
  const cleanLocation = (location || '').toLowerCase().replace(/[^a-z0-9]/g, '');
  return `${cleanTitle}_${cleanCompany}_${cleanLocation}`;
}

/**
 * Checks if a job already exists in the catalog
 */
export function isDuplicateJob(newJob, existingJobs) {
  if (!newJob || !Array.isArray(existingJobs)) return false;
  if (newJob.originalUrl) {
    const existingByUrl = existingJobs.find(j => j.originalUrl === newJob.originalUrl);
    if (existingByUrl) return true;
  }
  
  if (newJob.title && newJob.company && newJob.location) {
    const newHash = generateJobFingerprint(newJob.title, newJob.company, newJob.location);
    return existingJobs.some(j => generateJobFingerprint(j.title, j.company, j.location) === newHash);
  }

  return false;
}
