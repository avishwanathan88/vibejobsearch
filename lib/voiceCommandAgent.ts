import { JobPosting, SearchQuery } from '../types';
import { aiSubagentSystem } from './aiSubagentSystem';

export interface VoiceCommand {
  intent: 'search' | 'navigate' | 'save' | 'analyze' | 'explain' | 'unknown';
  confidence: number;
  parameters: Record<string, any>;
  originalText: string;
  response: string;
}

export interface VoiceCommandContext {
  currentJobs: JobPosting[];
  currentJobIndex: number;
  isSearchActive: boolean;
  lastSearchQuery?: SearchQuery;
}

export class VoiceCommandAgent {
  private intentPatterns = {
    search: [
      /find\s+jobs?\s+(?:for\s+)?(.+)/i,
      /search\s+(?:for\s+)?(.+)/i,
      /look\s+for\s+(.+)\s+jobs?/i,
      /show\s+me\s+(.+)\s+positions?/i,
      /(.+)\s+jobs?\s+in\s+(.+)/i,
      /remote\s+(.+)\s+jobs?/i,
      /(.+)\s+developer\s+jobs?/i,
      /(.+)\s+engineer\s+positions?/i,
    ],
    navigate: [
      /(?:go\s+to\s+)?next\s+job/i,
      /next/i,
      /(?:go\s+to\s+)?previous\s+job/i,
      /previous/i,
      /prev/i,
      /go\s+back/i,
      /show\s+me\s+the\s+next\s+(?:job|position)/i,
      /show\s+me\s+the\s+previous\s+(?:job|position)/i,
    ],
    save: [
      /save\s+this\s+job/i,
      /save\s+(?:this\s+)?position/i,
      /bookmark\s+this/i,
      /add\s+to\s+favorites/i,
      /remember\s+this\s+job/i,
    ],
    analyze: [
      /analyze\s+this\s+job/i,
      /tell\s+me\s+about\s+this\s+(?:job|position)/i,
      /what\s+do\s+you\s+think\s+about\s+this\s+job/i,
      /analyze\s+(?:this\s+)?position/i,
      /give\s+me\s+insights?\s+(?:about\s+)?(?:this\s+)?job/i,
      /evaluate\s+this\s+(?:job|position)/i,
    ],
    explain: [
      /explain\s+this\s+job/i,
      /what\s+does\s+this\s+job\s+do/i,
      /simplify\s+this\s+(?:job|position)/i,
      /break\s+down\s+this\s+job/i,
      /explain\s+(?:this\s+)?position\s+simply/i,
      /what\s+would\s+I\s+be\s+doing/i,
      /summarize\s+this\s+job/i,
    ],
  };

  async processVoiceCommand(
    text: string, 
    context: VoiceCommandContext
  ): Promise<VoiceCommand> {
    const normalizedText = text.toLowerCase().trim();
    
    // Try to match intent patterns
    for (const [intent, patterns] of Object.entries(this.intentPatterns)) {
      for (const pattern of patterns) {
        const match = normalizedText.match(pattern);
        if (match) {
          return await this.executeIntent(
            intent as VoiceCommand['intent'], 
            match, 
            text, 
            context
          );
        }
      }
    }

    // If no pattern matches, treat as search if it contains job-related keywords
    if (this.isJobSearchQuery(normalizedText)) {
      return await this.executeIntent('search', [normalizedText], text, context);
    }

    return {
      intent: 'unknown',
      confidence: 0.1,
      parameters: {},
      originalText: text,
      response: "I didn't understand that command. Try saying 'find React jobs', 'next job', 'save this job', or 'analyze this position'.",
    };
  }

  private isJobSearchQuery(text: string): boolean {
    const jobKeywords = [
      'developer', 'engineer', 'designer', 'manager', 'analyst', 'scientist',
      'react', 'python', 'java', 'javascript', 'node', 'angular', 'vue',
      'remote', 'frontend', 'backend', 'fullstack', 'devops', 'data',
      'senior', 'junior', 'entry', 'intern', 'lead', 'principal',
      'software', 'web', 'mobile', 'app', 'api', 'database',
      'marketing', 'sales', 'product', 'design', 'ui', 'ux'
    ];

    return jobKeywords.some(keyword => text.includes(keyword));
  }

  private async executeIntent(
    intent: VoiceCommand['intent'],
    match: RegExpMatchArray | string[],
    originalText: string,
    context: VoiceCommandContext
  ): Promise<VoiceCommand> {
    switch (intent) {
      case 'search':
        return await this.handleSearchIntent(match, originalText, context);
      case 'navigate':
        return this.handleNavigateIntent(match, originalText, context);
      case 'save':
        return this.handleSaveIntent(originalText, context);
      case 'analyze':
        return await this.handleAnalyzeIntent(originalText, context);
      case 'explain':
        return await this.handleExplainIntent(originalText, context);
      default:
        return {
          intent: 'unknown',
          confidence: 0.1,
          parameters: {},
          originalText,
          response: "I didn't understand that command.",
        };
    }
  }

  private async handleSearchIntent(
    match: RegExpMatchArray | string[],
    originalText: string,
    context: VoiceCommandContext
  ): Promise<VoiceCommand> {
    let searchQuery = '';
    let location = '';
    
    if (Array.isArray(match) && match.length > 1) {
      if (match.length === 3 && match[2]) {
        // Pattern like "React jobs in New York"
        searchQuery = match[1].trim();
        location = match[2].trim();
      } else {
        searchQuery = match[1].trim();
      }
    } else {
      searchQuery = originalText;
    }

    // Extract additional parameters
    const parameters: SearchQuery = {
      keywords: searchQuery,
    };

    if (location) {
      parameters.location = location;
    }

    // Check for remote preference
    if (originalText.toLowerCase().includes('remote')) {
      parameters.remote = true;
    }

    // Extract salary if mentioned
    const salaryMatch = originalText.match(/(\d+)k?\+?\s*(?:salary|pay|compensation)/i);
    if (salaryMatch) {
      const salary = parseInt(salaryMatch[1]);
      parameters.salaryMin = salary > 1000 ? salary : salary * 1000;
    }

    const responseText = this.generateSearchResponse(parameters, originalText);

    return {
      intent: 'search',
      confidence: 0.9,
      parameters,
      originalText,
      response: responseText,
    };
  }

  private generateSearchResponse(query: SearchQuery, originalText: string): string {
    const parts = [];
    
    if (query.keywords) {
      parts.push(`searching for ${query.keywords} positions`);
    }
    
    if (query.location) {
      parts.push(`in ${query.location}`);
    }
    
    if (query.remote) {
      parts.push(`with remote work options`);
    }
    
    if (query.salaryMin) {
      parts.push(`with minimum salary of $${query.salaryMin.toLocaleString()}`);
    }

    const searchDescription = parts.length > 0 ? parts.join(' ') : 'jobs matching your criteria';
    
    return `I'm ${searchDescription}. Let me analyze the available positions using my AI subagents...`;
  }

  private handleNavigateIntent(
    match: RegExpMatchArray | string[],
    originalText: string,
    context: VoiceCommandContext
  ): VoiceCommand {
    const normalizedText = originalText.toLowerCase();
    const isNext = normalizedText.includes('next') || (!normalizedText.includes('previous') && !normalizedText.includes('back') && !normalizedText.includes('prev'));
    
    if (!context.currentJobs || context.currentJobs.length === 0) {
      return {
        intent: 'navigate',
        confidence: 0.8,
        parameters: { direction: isNext ? 'next' : 'previous' },
        originalText,
        response: "No jobs are currently loaded. Try searching for positions first.",
      };
    }

    const direction = isNext ? 'next' : 'previous';
    const currentIndex = context.currentJobIndex;
    const totalJobs = context.currentJobs.length;

    let response = '';
    if (direction === 'next') {
      if (currentIndex >= totalJobs - 1) {
        response = `You're viewing the last job (${totalJobs} of ${totalJobs}). Try searching for more positions.`;
      } else {
        response = `Moving to the next job (${currentIndex + 2} of ${totalJobs}).`;
      }
    } else {
      if (currentIndex <= 0) {
        response = `You're viewing the first job. There are ${totalJobs} jobs total.`;
      } else {
        response = `Going back to the previous job (${currentIndex} of ${totalJobs}).`;
      }
    }

    return {
      intent: 'navigate',
      confidence: 0.95,
      parameters: { direction },
      originalText,
      response,
    };
  }

  private handleSaveIntent(
    originalText: string,
    context: VoiceCommandContext
  ): VoiceCommand {
    if (!context.currentJobs || context.currentJobIndex >= context.currentJobs.length) {
      return {
        intent: 'save',
        confidence: 0.8,
        parameters: {},
        originalText,
        response: "There's no job currently selected to save.",
      };
    }

    const currentJob = context.currentJobs[context.currentJobIndex];
    
    return {
      intent: 'save',
      confidence: 0.95,
      parameters: { jobId: currentJob.id },
      originalText,
      response: `I've saved the "${currentJob.title}" position at ${currentJob.company} to your favorites.`,
    };
  }

  private async handleAnalyzeIntent(
    originalText: string,
    context: VoiceCommandContext
  ): Promise<VoiceCommand> {
    if (!context.currentJobs || context.currentJobIndex >= context.currentJobs.length) {
      return {
        intent: 'analyze',
        confidence: 0.8,
        parameters: {},
        originalText,
        response: "There's no job currently selected to analyze. Please search for jobs first.",
      };
    }

    const currentJob = context.currentJobs[context.currentJobIndex];
    const analysis = await this.generateJobAnalysis(currentJob);
    
    return {
      intent: 'analyze',
      confidence: 0.9,
      parameters: { jobId: currentJob.id },
      originalText,
      response: analysis,
    };
  }

  private async handleExplainIntent(
    originalText: string,
    context: VoiceCommandContext
  ): Promise<VoiceCommand> {
    if (!context.currentJobs || context.currentJobIndex >= context.currentJobs.length) {
      return {
        intent: 'explain',
        confidence: 0.8,
        parameters: {},
        originalText,
        response: "There's no job currently selected to explain. Please search for jobs first.",
      };
    }

    const currentJob = context.currentJobs[context.currentJobIndex];
    const explanation = await this.generateSimpleExplanation(currentJob);
    
    return {
      intent: 'explain',
      confidence: 0.9,
      parameters: { jobId: currentJob.id },
      originalText,
      response: explanation,
    };
  }

  private async generateJobAnalysis(job: JobPosting): Promise<string> {
    const insights = [];

    // Analyze role level
    if (job.title.toLowerCase().includes('senior') || job.title.toLowerCase().includes('lead')) {
      insights.push("This is a senior-level position requiring significant experience");
    } else if (job.title.toLowerCase().includes('junior') || job.title.toLowerCase().includes('entry')) {
      insights.push("This is an entry-level position perfect for career starters");
    } else {
      insights.push("This appears to be a mid-level position");
    }

    // Analyze salary
    if (job.salary) {
      const salaryMatch = job.salary.match(/\$(\d+,?\d*)\s*-\s*\$(\d+,?\d*)/);
      if (salaryMatch) {
        const minSalary = parseInt(salaryMatch[1].replace(',', ''));
        const maxSalary = parseInt(salaryMatch[2].replace(',', ''));
        const avgSalary = (minSalary + maxSalary) / 2;
        
        if (avgSalary > 150000) {
          insights.push("The compensation is highly competitive, above market average");
        } else if (avgSalary > 100000) {
          insights.push("The salary range is competitive for this role");
        } else {
          insights.push("This position offers entry to mid-level compensation");
        }
      }
    }

    // Analyze work arrangement
    if (job.remote) {
      insights.push("You can work remotely, offering great flexibility");
    } else {
      insights.push("This is an on-site position requiring office presence");
    }

    // Analyze requirements complexity
    if (job.requirements && job.requirements.length > 6) {
      insights.push("This role has extensive requirements, indicating a complex position");
    } else if (job.requirements && job.requirements.length > 3) {
      insights.push("The role has moderate requirements, typical for the level");
    }

    // Analyze tech stack
    const modernTech = ['react', 'typescript', 'kubernetes', 'aws', 'python', 'node.js'];
    const jobTech = job.tags.filter(tag => 
      modernTech.some(tech => tag.toLowerCase().includes(tech.toLowerCase()))
    );
    
    if (jobTech.length >= 3) {
      insights.push("This position uses modern, in-demand technologies");
    } else if (jobTech.length > 0) {
      insights.push("The role includes some current technology stack elements");
    }

    // Company analysis
    if (job.company.toLowerCase().includes('startup') || job.company.toLowerCase().includes('xyz')) {
      insights.push("This appears to be a startup environment with potential for rapid growth");
    } else {
      insights.push("This seems to be an established company offering stability");
    }

    const analysisText = `Here's my analysis of the ${job.title} role at ${job.company}: ${insights.join('. ')}. The position offers ${job.remote ? 'remote work flexibility' : 'on-site collaboration'} and appears to be a ${job.title.toLowerCase().includes('senior') ? 'senior' : job.title.toLowerCase().includes('junior') ? 'junior' : 'mid-level'} opportunity.`;

    return analysisText;
  }

  private async generateSimpleExplanation(job: JobPosting): Promise<string> {
    // Extract the core role
    let roleType = 'professional';
    if (job.title.toLowerCase().includes('developer') || job.title.toLowerCase().includes('engineer')) {
      roleType = 'technical person who builds software';
    } else if (job.title.toLowerCase().includes('designer')) {
      roleType = 'creative person who designs user interfaces';
    } else if (job.title.toLowerCase().includes('data scientist')) {
      roleType = 'analyst who finds insights in data';
    } else if (job.title.toLowerCase().includes('manager')) {
      roleType = 'leader who guides teams and projects';
    }

    // Simplify the main technologies
    const mainTech = job.tags.slice(0, 3).join(', ');
    
    // Determine experience level
    let experienceLevel = 'some experience';
    if (job.title.toLowerCase().includes('senior')) {
      experienceLevel = '5+ years of experience';
    } else if (job.title.toLowerCase().includes('junior') || job.title.toLowerCase().includes('entry')) {
      experienceLevel = 'little to no experience required';
    }

    const explanation = `In simple terms: You'd be a ${roleType} at ${job.company}. ` +
      `${job.remote ? "You can work from home. " : "You'd work in their office. "}` +
      `This role needs ${experienceLevel}${mainTech ? ` and skills in ${mainTech}` : ''}. ` +
      `${job.salary ? `They're offering ${job.salary} per year. ` : ''}` +
      `Your main job would be helping ${job.company} ${this.getCompanyGoal(job.description)}.`;

    return explanation;
  }

  private getCompanyGoal(description: string): string {
    if (description.toLowerCase().includes('user') && description.toLowerCase().includes('product')) {
      return 'build better products for their users';
    } else if (description.toLowerCase().includes('platform') || description.toLowerCase().includes('system')) {
      return 'maintain and improve their technology platform';
    } else if (description.toLowerCase().includes('client') || description.toLowerCase().includes('customer')) {
      return 'serve their clients and customers better';
    } else if (description.toLowerCase().includes('data') || description.toLowerCase().includes('analytics')) {
      return 'make data-driven decisions';
    } else {
      return 'grow their business and achieve their goals';
    }
  }
}

// Export singleton instance
export const voiceCommandAgent = new VoiceCommandAgent();
