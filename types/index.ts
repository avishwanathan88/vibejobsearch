export interface JobPosting {
  id: string;
  title: string;
  company: string;
  companyLogo?: string;
  location: string;
  description: string;
  requirements?: string[];
  responsibilities?: string[];
  salary?: string;
  salaryRange?: {
    min: number;
    max: number;
    currency: string;
  };
  type: 'Full-time' | 'Part-time' | 'Contract' | 'Internship';
  remote: boolean;
  hybrid?: boolean;
  postedDate: string;
  applicationDeadline?: string;
  url?: string;
  applyUrl?: string;
  skills?: string[];
  tags: string[];
  experience?: string;
  benefits?: string[];
  companySize?: string;
  industry?: string;
}

export interface UserProfile {
  id: string;
  name: string;
  email: string;
  skills: string[];
  experience: string[];
  preferences: {
    jobTypes: string[];
    locations: string[];
    remote: boolean;
  };
}

export interface VibeAnalysis {
  score: number;
  matchedSkills: string[];
  cultureFit: number;
  recommendations: string[];
}

// AI Subagent Infrastructure Types
export interface SearchQuery {
  keywords?: string;
  location?: string;
  remote?: boolean;
  salaryMin?: number;
  jobType?: string;
}

export interface JobSearchContext {
  searchQuery: SearchQuery;
  availableJobs: JobPosting[];
  userPreferences: Record<string, any>;
  previousSearches: string[];
}

export interface SubagentTask {
  id: string;
  type: 'keyword-analysis' | 'job-matching' | 'salary-analysis' | 'location-analysis';
  priority: number;
  context: JobSearchContext;
  instructions: string;
}
