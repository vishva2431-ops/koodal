/**
 * Clean Empty Profile Template.
 * Personal information is NOT fabricated or hardcoded.
 * It is entered during onboarding by the authenticated user and persisted via backend API.
 */
export const EMPTY_PROFILE = {
  id: '',
  fullName: '',
  email: '',
  phone: '',
  currentLocation: '',
  linkedInUrl: '',
  gitHubUrl: '',
  portfolioUrl: '',
  preferredRoles: [],
  preferredLocations: [],
  workArrangement: 'HYBRID',
  experienceLevel: 'EXPERIENCED',
  experienceYears: 0,
  expectedSalaryMin: 0,
  expectedSalaryMax: 0,
  noticePeriodDays: 30,
  employmentType: 'FULL_TIME',
  preferredIndustries: [],
  education: [],
  skills: [],
  programmingLanguages: [],
  frameworksAndTools: [],
  projects: [],
  workExperience: [],
  certifications: [],
  languagesKnown: [],
  resumes: [],
  completenessScore: 0,
  updatedAt: new Date().toISOString(),
};

/**
 * Sample Demo Opportunities — Explicitly tagged as DEMO DATA.
 * Provided to test matching algorithms and UI filters before live portal sync.
 */
export const SAMPLE_DEMO_JOBS = [
  {
    id: 'demo_chn_01',
    title: '[DEMO DATA] React JS Developer',
    company: 'Demo Tech Labs (Chennai)',
    location: 'Chennai, Tamil Nadu',
    state: 'Tamil Nadu',
    description: 'Sample job listing for testing matching rules and application prefill. Involves modern React hooks, TypeScript, and state management.',
    requiredSkills: ['React.js', 'TypeScript', 'Tailwind CSS', 'RESTful APIs', 'Git'],
    experienceMin: 2,
    experienceMax: 4,
    salaryMin: 8,
    salaryMax: 14,
    salaryDisplay: '₹8 - ₹14 LPA (Demo)',
    employmentType: 'FULL_TIME',
    workArrangement: 'HYBRID',
    source: 'NAUKRI',
    originalUrl: 'https://www.naukri.com/sample-react-job',
    directApplicationUrl: 'https://www.naukri.com/sample-react-job',
    dateDiscovered: new Date(Date.now() - 86400000).toISOString(),
    applicationMethod: 'DIRECT_URL',
    isDemoData: true,
    isOpen: true,
    selectedForApplication: false,
  },
  {
    id: 'demo_cbe_02',
    title: '[DEMO DATA] Frontend Developer (React / Next.js)',
    company: 'Sample Software Systems (Coimbatore)',
    location: 'Coimbatore, Tamil Nadu',
    state: 'Tamil Nadu',
    description: 'Sample demonstration posting for Coimbatore location testing. Clean UI components, Next.js, and design token architecture.',
    requiredSkills: ['React.js', 'Next.js', 'JavaScript (ES6+)', 'Tailwind CSS'],
    experienceMin: 1,
    experienceMax: 3,
    salaryMin: 6,
    salaryMax: 10,
    salaryDisplay: '₹6 - ₹10 LPA (Demo)',
    employmentType: 'FULL_TIME',
    workArrangement: 'HYBRID',
    source: 'LINKEDIN',
    originalUrl: 'https://www.linkedin.com/jobs/view/sample-frontend-cbe',
    directApplicationUrl: 'https://www.linkedin.com/jobs/view/sample-frontend-cbe',
    dateDiscovered: new Date(Date.now() - 172800000).toISOString(),
    applicationMethod: 'DIRECT_URL',
    isDemoData: true,
    isOpen: true,
    selectedForApplication: false,
  },
  {
    id: 'demo_mdu_03',
    title: '[DEMO DATA] Web Application Developer (React)',
    company: 'Demo IT Services (Madurai)',
    location: 'Madurai, Tamil Nadu',
    state: 'Tamil Nadu',
    description: 'Sample job listing for Madurai tech cluster testing. Web application development with React and REST APIs.',
    requiredSkills: ['React.js', 'JavaScript (ES6+)', 'HTML5 / CSS3', 'RESTful APIs'],
    experienceMin: 1,
    experienceMax: 3,
    salaryMin: 5,
    salaryMax: 8,
    salaryDisplay: '₹5 - ₹8 LPA (Demo)',
    employmentType: 'FULL_TIME',
    workArrangement: 'HYBRID',
    source: 'INDEED',
    originalUrl: 'https://in.indeed.com/viewjob?jk=sample-madurai-react',
    dateDiscovered: new Date(Date.now() - 259200000).toISOString(),
    applicationMethod: 'DIRECT_URL',
    isDemoData: true,
    isOpen: true,
    selectedForApplication: false,
  },
];

/**
 * Outreach Templates with Dynamic Placeholders.
 * No hardcoded personal names, phones, or URLs exist here.
 */
export const INITIAL_TEMPLATES = [
  {
    id: 'tpl_email_default',
    name: 'Official Application Email',
    type: 'EMAIL',
    subject: 'Application for {{jobTitle}} — {{yourName}}',
    body: `Dear Hiring Team at {{companyName}},

I am writing to express my interest in the {{jobTitle}} position at {{companyName}}. My background includes {{skills}}, and I would appreciate the opportunity to be considered for this role.

Please find my resume and portfolio for your review. I would be happy to provide any additional information required.

Thank you for your time and consideration.

Best regards,
{{yourName}}
Phone: {{phone}}
Email: {{email}}
Portfolio: {{portfolioUrl}}
LinkedIn: {{linkedInUrl}}`,
    isDefault: true,
    lastModified: new Date().toISOString(),
  },
  {
    id: 'tpl_whatsapp_default',
    name: 'Direct WhatsApp Introduction',
    type: 'WHATSAPP',
    body: `Hi Hiring Team at {{companyName}}, I noticed your opening for {{jobTitle}} in {{location}}. I have {{experience}} years of experience specializing in {{skills}}. Portfolio: {{portfolioUrl}}. I would welcome the opportunity to share my resume. Best regards, {{yourName}} ({{email}}).`,
    isDefault: true,
    lastModified: new Date().toISOString(),
  },
  {
    id: 'tpl_followup_default',
    name: '7-Day Application Follow-Up',
    type: 'FOLLOW_UP',
    subject: 'Following up: Application for {{jobTitle}} — {{yourName}}',
    body: `Dear Hiring Team at {{companyName}},

I hope this message finds you well.

I am writing to briefly follow up on my application for the {{jobTitle}} position submitted earlier. With my background in {{skills}} and enthusiasm for {{companyName}}'s mission, I remain very interested in contributing to your engineering team.

Please let me know if there are any additional details or code samples I can provide to assist in your review.

Thank you once again for your time and consideration.

Warm regards,
{{yourName}}
{{phone}} | {{email}}`,
    isDefault: false,
    lastModified: new Date().toISOString(),
  },
  {
    id: 'tpl_cover_letter_default',
    name: 'Tailored Cover Letter Template',
    type: 'COVER_LETTER',
    subject: 'Cover Letter — {{yourName}} for {{jobTitle}}',
    body: `To the Hiring Manager,
{{companyName}}

RE: Application for {{jobTitle}}

Dear Hiring Manager,

I am writing to formally apply for the {{jobTitle}} role at {{companyName}}. Having tracked {{companyName}}'s engineering growth in Tamil Nadu, I am eager to contribute my technical foundation in {{skills}} to your product development initiatives.

Over the past {{experience}} years, I have specialized in building modern web applications, focusing on scalable component architecture, predictable state flow, and smooth user experiences. In my previous work, I spearheaded key user-facing features, integrated high-throughput REST APIs, and maintained clean, accessible UI standards.

I am particularly excited about this opportunity at {{companyName}} because your engineering standards align with my commitment to crafting dependable software. I am based in {{location}}, open to your hybrid/on-site framework, and available within {{noticePeriod}} days.

Thank you for reviewing my application. I welcome the opportunity to discuss how my skillset can add direct value to your team.

Sincerely,
{{yourName}}
{{email}} | {{phone}}
{{portfolioUrl}}`,
    isDefault: true,
    lastModified: new Date().toISOString(),
  },
];

export const SOURCE_INTEGRATIONS = [
  {
    source: 'NAUKRI',
    displayName: 'Naukri.com India',
    hasOfficialApi: false,
    apiAccessStatus: 'PERMITTED_URL_GENERATOR',
    permittedMethod: 'Compliant query constructor with Tamil Nadu location city IDs (Chennai: 9508, Coimbatore: 9509) and assisted one-click application links. Direct headless automation violates Section 7 of Info Edge Terms of Service.',
    termsComplianceStatement: 'Strict TOS Compliance: No credential storage, no CAPTCHA bypass, no scraper bots. Pre-formats official search URLs and deep application links.',
    searchUrlTemplate: 'https://www.naukri.com/{role}-jobs-in-{location}?k={role}&l={location}',
    sampleCount: 1,
    healthStatus: 'HEALTHY',
    lastSyncedAt: new Date().toISOString(),
  },
  {
    source: 'LINKEDIN',
    displayName: 'LinkedIn Jobs',
    hasOfficialApi: false,
    apiAccessStatus: 'PERMITTED_URL_GENERATOR',
    permittedMethod: 'Official URL deep-linking with targeted boolean parameters (geoId=105556991 for Tamil Nadu), assisted application pre-fill, and manual outcome confirmation. LinkedIn API for job applications is restricted strictly to enterprise ATS partners.',
    termsComplianceStatement: 'Strict TOS Compliance: No unauthorized scraping or automated submission bots. Respects LinkedIn User Agreement.',
    searchUrlTemplate: 'https://www.linkedin.com/jobs/search/?keywords={role}&location={location}',
    sampleCount: 1,
    healthStatus: 'HEALTHY',
    lastSyncedAt: new Date().toISOString(),
  },
  {
    source: 'INDEED',
    displayName: 'Indeed India',
    hasOfficialApi: false,
    apiAccessStatus: 'PERMITTED_URL_GENERATOR',
    permittedMethod: 'Compliant search query builder with location radius, publisher feed support, and direct application redirection. Official Indeed Apply API requires partner agreement and employer approval.',
    termsComplianceStatement: 'Strict TOS Compliance: Follows Indeed Robots.txt and Terms of Service. Directs user to authentic application pages.',
    searchUrlTemplate: 'https://in.indeed.com/jobs?q={role}&l={location}',
    sampleCount: 1,
    healthStatus: 'HEALTHY',
    lastSyncedAt: new Date().toISOString(),
  },
  {
    source: 'COMPANY_CAREER',
    displayName: 'Company Career Portals (Direct)',
    hasOfficialApi: true,
    apiAccessStatus: 'AUTHORIZED_FEED',
    permittedMethod: 'Direct career portal deep-linking, verified employer contacts (email/careers page), structured job data capture with duplicate detection.',
    termsComplianceStatement: 'Direct permitted access to public career postings and employer contact channels.',
    searchUrlTemplate: '{companyUrl}/careers',
    sampleCount: 0,
    healthStatus: 'HEALTHY',
    lastSyncedAt: new Date().toISOString(),
  },
];
