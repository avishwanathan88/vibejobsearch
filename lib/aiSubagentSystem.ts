import { JobPosting, SearchQuery, JobSearchContext, SubagentTask } from '../types';
import { jobListings } from '../data/jobListings';

export interface SearchResult {
  jobs: JobPosting[];
  totalCount: number;
  searchInsights: string[];
  suggestedRefinements: string[];
}

export interface SubagentResponse {
  taskId: string;
  result: any;
  confidence: number;
  insights: string[];
}

export class AISubagentSystem {
  private activeSubagents: Map<string, SubagentTask> = new Map();

  // Main job search function that uses multiple subagents
  async performIntelligentJobSearch(query: SearchQuery): Promise<SearchResult> {
    const context: JobSearchContext = {
      searchQuery: query,
      availableJobs: jobListings,
      userPreferences: {},
      previousSearches: []
    };

    // Create multiple subagent tasks
    const tasks: SubagentTask[] = [
      {
        id: 'keyword-analyzer',
        type: 'keyword-analysis',
        priority: 1,
        context,
        instructions: 'Analyze search keywords and extract relevant technical skills, job levels, and preferences'
      },
      {
        id: 'job-matcher',
        type: 'job-matching',
        priority: 2,
        context,
        instructions: 'Match jobs based on analyzed keywords and rank by relevance'
      },
      {
        id: 'salary-analyzer',
        type: 'salary-analysis',
        priority: 3,
        context,
        instructions: 'Analyze salary expectations and market trends'
      },
      {
        id: 'location-optimizer',
        type: 'location-analysis',
        priority: 2,
        context,
        instructions: 'Optimize job results based on location preferences and remote work options'
      }
    ];

    // Execute subagent tasks
    const results = await this.executeSubagentTasks(tasks);
    
    // Combine results from all subagents
    return this.combineSubagentResults(results, query);
  }

  private async executeSubagentTasks(tasks: SubagentTask[]): Promise<SubagentResponse[]> {
    const responses: SubagentResponse[] = [];

    for (const task of tasks) {
      this.activeSubagents.set(task.id, task);
      
      try {
        const response = await this.executeSubagentTask(task);
        responses.push(response);
      } catch (error) {
        console.error(`Subagent ${task.id} failed:`, error);
        responses.push({
          taskId: task.id,
          result: null,
          confidence: 0,
          insights: [`Subagent ${task.id} encountered an error`]
        });
      } finally {
        this.activeSubagents.delete(task.id);
      }
    }

    return responses;
  }

  private async executeSubagentTask(task: SubagentTask): Promise<SubagentResponse> {
    // Simulate AI processing with actual logic based on task type
    await new Promise(resolve => setTimeout(resolve, 100 + Math.random() * 200));

    switch (task.type) {
      case 'keyword-analysis':
        return this.performKeywordAnalysis(task);
      
      case 'job-matching':
        return this.performJobMatching(task);
      
      case 'salary-analysis':
        return this.performSalaryAnalysis(task);
      
      case 'location-analysis':
        return this.performLocationAnalysis(task);
      
      default:
        return {
          taskId: task.id,
          result: null,
          confidence: 0,
          insights: ['Unknown task type']
        };
    }
  }

  private performKeywordAnalysis(task: SubagentTask): SubagentResponse {
    const query = task.context.searchQuery;
    const searchText = (query.keywords || '').toLowerCase();
    
    // Extract technical skills
    const techSkills = this.extractTechSkills(searchText);
    
    // Determine experience level
    const experienceLevel = this.determineExperienceLevel(searchText);
    
    // Extract job type preferences
    const jobTypePrefs = this.extractJobTypePreferences(searchText);

    return {
      taskId: task.id,
      result: {
        techSkills,
        experienceLevel,
        jobTypePrefs,
        processedKeywords: searchText.split(' ').filter(word => word.length > 2)
      },
      confidence: 0.85,
      insights: [
        `Identified ${techSkills.length} technical skills`,
        `Experience level: ${experienceLevel}`,
        `Job type preferences: ${jobTypePrefs.join(', ')}`
      ]
    };
  }

  private performJobMatching(task: SubagentTask): SubagentResponse {
    const query = task.context.searchQuery;
    const jobs = task.context.availableJobs;
    const searchText = (query.keywords || '').toLowerCase();

    // Score jobs based on multiple criteria
    const scoredJobs = jobs.map(job => {
      let score = 0;
      const reasons: string[] = [];

      // Title matching
      if (job.title.toLowerCase().includes(searchText) || 
          searchText.split(' ').some(word => job.title.toLowerCase().includes(word))) {
        score += 30;
        reasons.push('Title match');
      }

      // Tag matching
      const matchingTags = job.tags.filter(tag => 
        searchText.includes(tag.toLowerCase()) || 
        tag.toLowerCase().includes(searchText)
      );
      score += matchingTags.length * 15;
      if (matchingTags.length > 0) {
        reasons.push(`${matchingTags.length} skill matches`);
      }

      // Description matching
      if (job.description.toLowerCase().includes(searchText)) {
        score += 10;
        reasons.push('Description match');
      }

      // Location preferences
      if (query.location && job.location.toLowerCase().includes(query.location.toLowerCase())) {
        score += 20;
        reasons.push('Location match');
      }

      // Remote work preference
      if (query.remote !== undefined && job.remote === query.remote) {
        score += 15;
        reasons.push('Remote preference match');
      }

      // Experience level matching
      if (searchText.includes('senior') && job.tags.includes('senior')) {
        score += 25;
        reasons.push('Senior level match');
      } else if (searchText.includes('junior') && job.tags.includes('junior')) {
        score += 25;
        reasons.push('Junior level match');
      }

      return { job, score, reasons };
    });

    // Sort by score and take top matches
    const rankedJobs = scoredJobs
      .filter(item => item.score > 0)
      .sort((a, b) => b.score - a.score);

    return {
      taskId: task.id,
      result: {
        rankedJobs: rankedJobs.slice(0, 10),
        totalMatches: rankedJobs.length
      },
      confidence: 0.9,
      insights: [
        `Found ${rankedJobs.length} relevant jobs`,
        `Top match: ${rankedJobs[0]?.job.title || 'None'} (Score: ${rankedJobs[0]?.score || 0})`,
        `Average relevance score: ${rankedJobs.length > 0 ? Math.round(rankedJobs.reduce((sum, item) => sum + item.score, 0) / rankedJobs.length) : 0}`
      ]
    };
  }

  private performSalaryAnalysis(task: SubagentTask): SubagentResponse {
    const jobs = task.context.availableJobs;
    const query = task.context.searchQuery;

    // Extract salary ranges and analyze
    const salaryData = jobs
      .filter(job => job.salary)
      .map(job => {
        const salaryMatch = job.salary!.match(/\$(\d+,?\d*)\s*-\s*\$(\d+,?\d*)/);
        if (salaryMatch) {
          const min = parseInt(salaryMatch[1].replace(',', ''));
          const max = parseInt(salaryMatch[2].replace(',', ''));
          return { job, min, max, avg: (min + max) / 2 };
        }
        return null;
      })
      .filter(Boolean) as Array<{job: JobPosting, min: number, max: number, avg: number}>;

    const avgSalary = salaryData.reduce((sum, item) => sum + item.avg, 0) / salaryData.length;
    const salaryRange = {
      min: Math.min(...salaryData.map(item => item.min)),
      max: Math.max(...salaryData.map(item => item.max))
    };

    // Filter by salary expectations if provided
    let filteredJobs = jobs;
    if (query.salaryMin) {
      filteredJobs = salaryData
        .filter(item => item.max >= query.salaryMin!)
        .map(item => item.job);
    }

    return {
      taskId: task.id,
      result: {
        averageSalary: Math.round(avgSalary),
        salaryRange,
        filteredJobs,
        salaryInsights: this.generateSalaryInsights(salaryData, query)
      },
      confidence: 0.8,
      insights: [
        `Average salary: $${Math.round(avgSalary).toLocaleString()}`,
        `Salary range: $${salaryRange.min.toLocaleString()} - $${salaryRange.max.toLocaleString()}`,
        `${filteredJobs.length} jobs meet salary expectations`
      ]
    };
  }

  private performLocationAnalysis(task: SubagentTask): SubagentResponse {
    const jobs = task.context.availableJobs;
    const query = task.context.searchQuery;

    // Analyze location distribution
    const locationCounts = jobs.reduce((acc, job) => {
      const location = job.location;
      acc[location] = (acc[location] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    // Analyze remote work options
    const remoteJobs = jobs.filter(job => job.remote);
    const onSiteJobs = jobs.filter(job => !job.remote);

    // Filter by location preference
    let filteredJobs = jobs;
    if (query.location) {
      filteredJobs = jobs.filter(job => 
        job.location.toLowerCase().includes(query.location!.toLowerCase()) ||
        (query.remote === true && job.remote)
      );
    }

    return {
      taskId: task.id,
      result: {
        locationDistribution: locationCounts,
        remoteCount: remoteJobs.length,
        onSiteCount: onSiteJobs.length,
        filteredJobs,
        topLocations: Object.entries(locationCounts)
          .sort(([,a], [,b]) => b - a)
          .slice(0, 5)
      },
      confidence: 0.9,
      insights: [
        `${remoteJobs.length} remote positions available`,
        `Top location: ${Object.entries(locationCounts).sort(([,a], [,b]) => b - a)[0]?.[0]}`,
        `${filteredJobs.length} jobs match location preferences`
      ]
    };
  }

  private combineSubagentResults(responses: SubagentResponse[], originalQuery: SearchQuery): SearchResult {
    // Find the job matching results
    const matchingResponse = responses.find(r => r.taskId === 'job-matcher');
    const salaryResponse = responses.find(r => r.taskId === 'salary-analyzer');
    const locationResponse = responses.find(r => r.taskId === 'location-optimizer');
    const keywordResponse = responses.find(r => r.taskId === 'keyword-analyzer');

    // Get the base job list from matching
    let jobs: JobPosting[] = [];
    if (matchingResponse?.result?.rankedJobs) {
      jobs = matchingResponse.result.rankedJobs.map((item: any) => item.job);
    } else {
      jobs = jobListings.slice(0, 5); // Fallback
    }

    // Apply salary filtering
    if (salaryResponse?.result?.filteredJobs) {
      const salaryFiltered = salaryResponse.result.filteredJobs;
      jobs = jobs.filter(job => salaryFiltered.some((sj: JobPosting) => sj.id === job.id));
    }

    // Apply location filtering
    if (locationResponse?.result?.filteredJobs) {
      const locationFiltered = locationResponse.result.filteredJobs;
      jobs = jobs.filter(job => locationFiltered.some((lj: JobPosting) => lj.id === job.id));
    }

    // Collect insights from all subagents
    const allInsights = responses.flatMap(response => response.insights);

    // Generate refinement suggestions
    const suggestedRefinements = this.generateRefinementSuggestions(responses, originalQuery);

    return {
      jobs: jobs.slice(0, 10), // Limit to top 10 results
      totalCount: jobs.length,
      searchInsights: allInsights,
      suggestedRefinements
    };
  }

  // Helper methods
  private extractTechSkills(searchText: string): string[] {
    const commonTechSkills = [
      'react', 'nodejs', 'typescript', 'javascript', 'python', 'java', 'go',
      'aws', 'azure', 'gcp', 'kubernetes', 'docker', 'terraform',
      'machine-learning', 'ai', 'data-science', 'sql', 'mongodb',
      'frontend', 'backend', 'fullstack', 'devops', 'mobile',
      'react-native', 'ios', 'android', 'security', 'cybersecurity'
    ];

    return commonTechSkills.filter(skill => 
      searchText.includes(skill) || searchText.includes(skill.replace('-', ' '))
    );
  }

  private determineExperienceLevel(searchText: string): string {
    if (searchText.includes('senior') || searchText.includes('lead') || searchText.includes('principal')) {
      return 'senior';
    } else if (searchText.includes('junior') || searchText.includes('entry')) {
      return 'junior';
    } else if (searchText.includes('mid') || searchText.includes('intermediate')) {
      return 'mid';
    }
    return 'any';
  }

  private extractJobTypePreferences(searchText: string): string[] {
    const preferences = [];
    if (searchText.includes('remote')) preferences.push('remote');
    if (searchText.includes('full-time')) preferences.push('full-time');
    if (searchText.includes('part-time')) preferences.push('part-time');
    if (searchText.includes('contract')) preferences.push('contract');
    return preferences;
  }

  private generateSalaryInsights(salaryData: Array<{job: JobPosting, min: number, max: number, avg: number}>, query: SearchQuery): string[] {
    const insights = [];
    
    if (salaryData.length === 0) {
      insights.push('Limited salary data available');
      return insights;
    }

    const sortedBySalary = salaryData.sort((a, b) => b.avg - a.avg);
    const highestPaying = sortedBySalary[0];
    const lowestPaying = sortedBySalary[sortedBySalary.length - 1];

    insights.push(`Highest paying: ${highestPaying.job.title} at ${highestPaying.job.company}`);
    insights.push(`Entry level range: $${lowestPaying.min.toLocaleString()} - $${lowestPaying.max.toLocaleString()}`);

    if (query.salaryMin) {
      const meetingExpectations = salaryData.filter(item => item.max >= query.salaryMin!).length;
      insights.push(`${meetingExpectations}/${salaryData.length} positions meet your salary expectations`);
    }

    return insights;
  }

  private generateRefinementSuggestions(responses: SubagentResponse[], originalQuery: SearchQuery): string[] {
    const suggestions = [];

    const keywordResponse = responses.find(r => r.taskId === 'keyword-analyzer');
    if (keywordResponse?.result?.techSkills?.length === 0) {
      suggestions.push('Try adding specific technical skills (e.g., "React", "Python", "AWS")');
    }

    const matchingResponse = responses.find(r => r.taskId === 'job-matcher');
    if (matchingResponse?.result?.totalMatches < 3) {
      suggestions.push('Broaden your search terms or consider related technologies');
    }

    if (!originalQuery.location) {
      suggestions.push('Specify a preferred location or search for remote positions');
    }

    if (!originalQuery.salaryMin) {
      suggestions.push('Add salary expectations to see more targeted results');
    }

    const locationResponse = responses.find(r => r.taskId === 'location-optimizer');
    if (locationResponse?.result?.remoteCount > 5) {
      suggestions.push('Consider remote positions for more opportunities');
    }

    return suggestions.slice(0, 3); // Limit to top 3 suggestions
  }

  // Public methods for monitoring
  getActiveSubagents(): SubagentTask[] {
    return Array.from(this.activeSubagents.values());
  }

  getSubagentStatus(taskId: string): SubagentTask | undefined {
    return this.activeSubagents.get(taskId);
  }
}

// Export singleton instance
export const aiSubagentSystem = new AISubagentSystem();
