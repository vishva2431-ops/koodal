export type UserRole = 'ROLE_USER' | 'ROLE_ADMIN';

export interface UserAccount {
  id: string;
  email: string;
  roles: UserRole[];
  isEmailVerified: boolean;
  createdAt: string;
  lastLoginAt?: string;
}

export interface AuthState {
  user: UserAccount | null;
  token: string | null;
  isAuthenticated: boolean;
  isAdmin: boolean;
}

export type WorkArrangement = 'REMOTE' | 'HYBRID' | 'ON_SITE';

export type EmploymentType = 'FULL_TIME' | 'PART_TIME' | 'CONTRACT' | 'INTERNSHIP';

export type PortalSource = 'NAUKRI' | 'LINKEDIN' | 'INDEED' | 'COMPANY_CAREER' | 'AUTHORIZED_FEED';

export type ApplicationStatus = 
  | 'READY'
  | 'IN_PROGRESS'
  | 'SUBMITTED'
  | 'BLOCKED'
  | 'FAILED'
  | 'SUBMISSION_UNKNOWN';

export type TemplateType = 'EMAIL' | 'WHATSAPP' | 'FOLLOW_UP' | 'COVER_LETTER';

export interface ResumeVersion {
  id: string;
  name: string;
  fileName: string;
  fileSize: number;
  uploadedAt: string;
  extractedText: string;
  parsedSkills: string[];
  isDefault: boolean;
}

export interface EducationEntry {
  degree: string;
  institution: string;
  graduationYear: string;
  score?: string;
}

export interface ProjectEntry {
  title: string;
  description: string;
  technologies: string[];
  liveUrl?: string;
  repoUrl?: string;
}

export interface WorkExperienceEntry {
  company: string;
  role: string;
  duration: string;
  description: string;
}

export interface UserProfile {
  id: string;
  userId?: string;
  fullName: string;
  email: string;
  phone: string;
  currentLocation: string;
  linkedInUrl: string;
  gitHubUrl: string;
  portfolioUrl: string;
  preferredRoles: string[];
  preferredLocations: string[];
  workArrangement: WorkArrangement;
  experienceLevel: 'FRESHER' | 'INTERN' | 'EXPERIENCED';
  experienceYears: number;
  expectedSalaryMin: number; // in LPA (Lakhs per annum)
  expectedSalaryMax: number;
  noticePeriodDays: number;
  employmentType: EmploymentType;
  preferredIndustries: string[];
  education: EducationEntry[];
  skills: string[];
  programmingLanguages: string[];
  frameworksAndTools: string[];
  projects: ProjectEntry[];
  workExperience: WorkExperienceEntry[];
  certifications: string[];
  languagesKnown: string[];
  resumes: ResumeVersion[];
  activeResumeId?: string;
  completenessScore: number;
  updatedAt: string;
}

export interface JobListing {
  id: string;
  title: string;
  company: string;
  location: string;
  state: string; // Tamil Nadu
  description: string;
  requiredSkills: string[];
  experienceMin: number;
  experienceMax: number;
  salaryMin?: number; // in LPA
  salaryMax?: number;
  salaryDisplay?: string;
  employmentType: EmploymentType;
  workArrangement: WorkArrangement;
  source: PortalSource;
  originalUrl: string;
  directApplicationUrl?: string;
  dateDiscovered: string;
  applicationMethod: 'DIRECT_URL' | 'AUTHORIZED_API' | 'EMAIL';
  isDemoData: boolean;
  isOpen: boolean;
  selectedForApplication: boolean;
  contactEmail?: string;
  contactPhone?: string;
  companyWebsite?: string;
}

export interface MatchScoreBreakdown {
  overallScore: number; // 0 - 100
  matchingSkills: string[];
  missingSkills: string[];
  skillScore: number;
  locationScore: number;
  experienceScore: number;
  workArrangementScore: number;
  roleMatchScore: number;
  explanation: string;
  isEligible: boolean;
}

export interface ApplicationRecord {
  id: string;
  userId?: string;
  jobId: string;
  jobTitle: string;
  company: string;
  source: PortalSource;
  jobUrl: string;
  status: ApplicationStatus;
  appliedDate: string;
  resumeVersionId?: string;
  resumeName?: string;
  coverLetterUsed?: string;
  confirmationReference?: string;
  notes: string;
  followUpDate?: string;
  submissionMethod: 'ASSISTED' | 'AUTHORIZED_API';
  isResolved: boolean;
  updatedAt: string;
}

export interface ErrorLogRecord {
  id: string;
  applicationId: string;
  jobId: string;
  jobTitle: string;
  company: string;
  source: PortalSource;
  timestamp: string;
  stage: 'PREREQUISITE_CHECK' | 'FORM_NAVIGATION' | 'DOCUMENT_UPLOAD' | 'SUBMISSION_VERIFICATION' | 'PORTAL_AUTH';
  errorCode: string;
  errorMessage: string;
  evidence: string;
  rootCauseConfirmed: boolean;
  causeDescription: string;
  recoveryAction: string;
  isSafeToRetry: boolean;
  status: ApplicationStatus;
}

export interface MessageTemplate {
  id: string;
  userId?: string;
  name: string;
  type: TemplateType;
  subject?: string;
  body: string;
  isDefault: boolean;
  lastModified: string;
}

export interface SourceIntegrationStatus {
  source: PortalSource;
  displayName: string;
  hasOfficialApi: boolean;
  apiAccessStatus: 'PERMITTED_URL_GENERATOR' | 'AUTHORIZED_FEED' | 'RESTRICTED_ENTERPRISE_ONLY';
  permittedMethod: string;
  termsComplianceStatement: string;
  searchUrlTemplate: string;
  sampleCount: number;
  lastSyncedAt?: string;
  healthStatus: 'HEALTHY' | 'RESTRICTED' | 'MANUAL_ONLY';
}

export interface SystemHealthStatus {
  status: 'UP' | 'DOWN';
  uptimeSeconds: number;
  activeUsers: number;
  totalJobs: number;
  totalApplications: number;
  unresolvedErrors: number;
  environment: string;
  database: {
    connected: boolean;
    type: 'MongoDB Atlas' | 'In-Memory Preview Engine';
  };
  sources: SourceIntegrationStatus[];
}
