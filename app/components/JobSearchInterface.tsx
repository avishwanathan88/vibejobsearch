'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import VoiceInput from './VoiceInput';
import JobCards from './JobCards';
import GestureRecognition from './GestureRecognition';
import SavedJobsView from './SavedJobsView';
import { SearchQuery, JobPosting } from '../../types';
import { aiSubagentSystem, SearchResult } from '../../lib/aiSubagentSystem';
import { VoiceCommand, VoiceCommandContext } from '../../lib/voiceCommandAgent';

const JobSearchInterface: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [searchResult, setSearchResult] = useState<SearchResult | null>(null);
  const [isSearching, setIsSearching] = useState(false);

  const [currentJobIndex, setCurrentJobIndex] = useState(0);
  const [savedJobs, setSavedJobs] = useState<JobPosting[]>([]);
  const [showSavedJobs, setShowSavedJobs] = useState(false);
  const [advancedFilters, setAdvancedFilters] = useState({
    location: '',
    remote: undefined as boolean | undefined,
    salaryMin: undefined as number | undefined,
    jobType: ''
  });

  const handleVoiceResult = (transcript: string) => {
    setSearchQuery(transcript);
  };

  const handleSearch = async (query?: string) => {
    const searchText = query || searchQuery;
    console.log('handleSearch called with:', searchText);
    if (!searchText.trim()) {
      console.log('Empty search text, returning');
      return;
    }

    setIsSearching(true);
    
    try {
      const searchParams: SearchQuery = {
        keywords: searchText,
        location: advancedFilters.location || undefined,
        remote: advancedFilters.remote,
        salaryMin: advancedFilters.salaryMin,
        jobType: advancedFilters.jobType || undefined
      };

      console.log('Search params:', searchParams);

      // Confirm what was heard
      const confirmationText = `I heard you say "${searchText}". Searching now...`;
      speakText(confirmationText);

      console.log('About to call aiSubagentSystem.performIntelligentJobSearch');
      const result = await aiSubagentSystem.performIntelligentJobSearch(searchParams);
      console.log('Search result:', result);
      setSearchResult(result);
      
      // After jobs are loaded, automatically summarize and read the first job
      if (result && result.jobs && result.jobs.length > 0) {
        const firstJob = result.jobs[0];
        setCurrentJobIndex(0);
        
        // Generate and speak summary of first job
        const summary = generateJobSummary(firstJob);
        
        setTimeout(() => {
          speakText(`Found ${result.jobs.length} jobs. Let me tell you about the first one: ${summary}`);
        }, 1500); // Wait 1.5 seconds after confirming search
      } else {
        setTimeout(() => {
          speakText("I couldn't find any jobs matching your criteria. Try a different search.");
        }, 1500);
      }
    } catch (error) {
      console.error('Search failed:', error);
      speakText('Sorry, there was an error searching for jobs. Please try again.');
    } finally {
      setIsSearching(false);
    }
  };

  // Text-to-speech function
  const speakText = (text: string) => {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel(); // Stop any current speech
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.rate = 0.9;
      utterance.pitch = 1.0;
      utterance.volume = 0.8;
      window.speechSynthesis.speak(utterance);
    }
  };

  // Generate AI summary for a job
  const generateJobSummary = (job: any): string => {
    const roleLevel = job.title.toLowerCase().includes('senior') ? 'senior-level' : 
                     job.title.toLowerCase().includes('junior') ? 'entry-level' : 'mid-level';
    
    const workStyle = job.remote ? 'remote' : 'on-site';
    const location = job.location || 'location not specified';
    const company = job.company || 'the company';
    const salary = job.salary || 'salary not disclosed';
    
    // Key requirements/skills (first 3)
    const skills = job.tags && job.tags.length > 0 ? job.tags.slice(0, 3).join(', ') : 'various skills';
    
    return `This is a ${roleLevel} ${job.title} position at ${company} in ${location}. ` +
           `It's a ${workStyle} role offering ${salary}. ` +
           `Key requirements include ${skills}. ` +
           `${job.description ? job.description.substring(0, 100) + '...' : 'More details are available in the job listing.'}`;
  };



  // Save job function
  const saveJob = (job: JobPosting) => {
    const isAlreadySaved = savedJobs.some(
      savedJob => savedJob.title === job.title && savedJob.company === job.company
    );
    
    if (!isAlreadySaved) {
      setSavedJobs(prev => [...prev, job]);
      speakText(`Job saved: ${job.title} at ${job.company}`);
    } else {
      speakText('This job is already saved.');
    }
  };

  // Remove job from saved jobs
  const removeJob = (jobId: string) => {
    setSavedJobs(prev => 
      prev.filter(job => `${job.title}-${job.company}`.replace(/\s+/g, '-') !== jobId)
    );
  };

  // Apply to job (placeholder function)
  const applyToJob = (job: JobPosting) => {
    // In a real app, this would open the application process
    console.log('Applying to job:', job);
    if (job.applyUrl) {
      window.open(job.applyUrl, '_blank');
    } else if (job.url) {
      window.open(job.url, '_blank');
    } else {
      // Fallback - could open company website or job board
      speakText(`Please visit ${job.company}'s website to apply for this position.`);
    }
  };

  // Handle gesture recognition
  const handleGesture = (gesture: 'thumbs-up' | 'thumbs-down' | 'swipe-left' | 'swipe-right') => {
    console.log('Gesture detected:', gesture);
    
    if (!searchResult?.jobs || searchResult.jobs.length === 0) {
      speakText('Please search for jobs first before using gestures.');
      return;
    }

    const currentJob = searchResult.jobs[currentJobIndex];
    
    switch (gesture) {
      case 'thumbs-up':
      case 'swipe-right':
        // Save current job
        if (currentJob) {
          saveJob(currentJob);
        }
        break;
        
      case 'thumbs-down':
      case 'swipe-left':
        // Go to next job
        if (currentJobIndex < searchResult.jobs.length - 1) {
          const nextIndex = currentJobIndex + 1;
          setCurrentJobIndex(nextIndex);
          const nextJob = searchResult.jobs[nextIndex];
          
          // Generate and speak summary of next job
          const summary = generateJobSummary(nextJob);
          setTimeout(() => {
            speakText(`Moving to next job: ${summary}`);
          }, 500);
        } else {
          speakText('You have reached the end of the job list.');
        }
        break;
    }
  };

  // Handle voice commands  
  const handleVoiceCommand = (command: VoiceCommand) => {
    switch (command.intent) {
      case 'search':
        // Search is already handled by onSearchStart
        break;
      
      case 'navigate':
        if (searchResult?.jobs && command.parameters.direction) {
          const direction = command.parameters.direction as string;
          if (direction === 'next' && currentJobIndex < searchResult.jobs.length - 1) {
            const nextIndex = currentJobIndex + 1;
            setCurrentJobIndex(nextIndex);
            const nextJob = searchResult.jobs[nextIndex];
            const summary = generateJobSummary(nextJob);
            speakText(`Moving to next job: ${summary}`);
          } else if (direction === 'previous' && currentJobIndex > 0) {
            const prevIndex = currentJobIndex - 1;
            setCurrentJobIndex(prevIndex);
            const prevJob = searchResult.jobs[prevIndex];
            const summary = generateJobSummary(prevJob);
            speakText(`Moving to previous job: ${summary}`);
          } else if (direction === 'next') {
            speakText('You have reached the end of the job list.');
          } else if (direction === 'previous') {
            speakText('You are at the first job.');
          }
        }
        break;
      
      case 'save':
        if (searchResult?.jobs && searchResult.jobs[currentJobIndex]) {
          const currentJob = searchResult.jobs[currentJobIndex];
          saveJob(currentJob);
        }
        break;
      
      case 'analyze':
      case 'explain':
        // These are handled by the voice command agent and spoken back
        // No additional UI action needed since the response is spoken
        break;
    }
  };

  // Create voice command context
  const voiceCommandContext: VoiceCommandContext = {
    currentJobs: searchResult?.jobs || [],
    currentJobIndex,
    isSearchActive: isSearching,
    lastSearchQuery: {
      keywords: searchQuery,
      location: advancedFilters.location,
      remote: advancedFilters.remote,
      salaryMin: advancedFilters.salaryMin,
      jobType: advancedFilters.jobType
    }
  };

  return (
    <>
      <div className="min-h-screen bg-gradient-to-br from-indigo-900 via-purple-900 to-pink-900">
        {/* Header */}
        <div className="relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-r from-purple-500/20 to-pink-500/20"></div>
          <div className="relative max-w-7xl mx-auto px-6 py-8">
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-center mb-8"
            >
              <h1 className="text-4xl font-bold text-white mb-2 bg-gradient-to-r from-purple-300 to-pink-300 bg-clip-text text-transparent">
                VibeJobSearch
              </h1>
              <p className="text-lg text-white/70 mb-6">
                AI-powered job search with voice input and gesture recognition
              </p>
            </motion.div>

            {/* Ultra Compact Voice Command Bar */}
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="flex justify-center mb-3"
            >
              <div className="bg-white/10 backdrop-blur-lg rounded-lg px-3 py-1.5 shadow-lg border border-white/20 max-w-lg">
                <div className="flex items-center gap-2 text-xs">
                  {/* Voice Input - Ultra Compact */}
                  <div className="flex-1 min-w-0">
                    <VoiceInput 
                      onResult={handleVoiceResult}
                      onSearchStart={(query) => handleSearch(query)}
                      onCommand={handleVoiceCommand}
                      commandContext={voiceCommandContext}
                    />
                  </div>
                  
                  {/* Status & Saved Jobs in one line */}
                  <div className="flex items-center gap-2 whitespace-nowrap">
                    {isSearching ? (
                      <span className="text-yellow-300 text-xs">🔍</span>
                    ) : searchResult ? (
                      <span className="text-green-300 text-xs">
                        ✅ {searchResult.jobs?.length || 0}
                        {searchResult.jobs && searchResult.jobs.length > 0 && (
                          <span className="text-white/60">
                            ({currentJobIndex + 1}/{searchResult.jobs.length})
                          </span>
                        )}
                      </span>
                    ) : (
                      <span className="text-gray-300 text-xs">💬</span>
                    )}

                    {savedJobs.length > 0 && (
                      <button 
                        onClick={() => setShowSavedJobs(true)}
                        className="text-green-200 text-xs hover:text-green-100 cursor-pointer"
                      >
                        💾{savedJobs.length}
                      </button>
                    )}
                  </div>
                </div>
              </div>
            </motion.div>

            {/* Main Content Area: Gesture (25%) + Job (75%) */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="max-w-7xl mx-auto"
            >
              {(isSearching || searchResult) && (
                <div className="grid grid-cols-4 gap-6 min-h-[600px]">
                  {/* LEFT - Gesture Recognition (25% - 1/4 width) */}
                  <div className="col-span-1">
                    <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-4 shadow-2xl border border-white/20 h-full">
                      <GestureRecognition 
                        onGesture={handleGesture}
                        isEnabled={true}
                        onToggle={() => {}}
                        autoStart={true}
                      />
                    </div>
                  </div>

                  {/* RIGHT - Job Posting Display (75% - 3/4 width) */}
                  <div className="col-span-3">
                    <div className="bg-white/10 backdrop-blur-lg rounded-2xl shadow-2xl border border-white/20 p-6 h-full">
                      <JobCards
                        jobs={searchResult?.jobs || []}
                        searchInsights={searchResult?.searchInsights}
                        suggestedRefinements={searchResult?.suggestedRefinements}
                        isLoading={isSearching}
                        currentJobIndex={currentJobIndex}
                        onJobIndexChange={setCurrentJobIndex}
                      />
                    </div>
                  </div>
                </div>
              )}
              
              {/* Welcome State - When No Search Results */}
              {!searchResult && !isSearching && (
                <div className="bg-white/10 backdrop-blur-lg rounded-2xl shadow-2xl border border-white/20 p-8 text-center min-h-[500px] flex items-center justify-center">
                  <div className="max-w-xl mx-auto">
                    <div className="text-6xl mb-6">🎯</div>
                    <h3 className="text-2xl font-bold text-white mb-4">
                      Start Your Search
                    </h3>
                    <p className="text-white/70 mb-6">
                      Use voice commands to find jobs
                    </p>
                    
                    {/* Search Examples */}
                    <div className="bg-gradient-to-r from-purple-500/20 to-pink-500/20 rounded-xl p-4 border border-purple-500/30 inline-block text-left">
                      <h4 className="text-white font-semibold mb-3">Try saying:</h4>
                      <div className="space-y-2 text-sm text-white/80">
                        <p>"Find React developer jobs"</p>
                        <p>"Look for remote Python positions"</p>
                        <p>"Show me data scientist roles"</p>
                      </div>
                    </div>
                    
                    <div className="mt-4 text-sm text-white/60">
                      <p>📖 Read job → 👍 Save or 👎 Skip with gestures</p>
                    </div>
                  </div>
                </div>
              )}
            </motion.div>
          </div>
        </div>
      </div>
      
      {/* Saved Jobs Modal */}
      <SavedJobsView
        savedJobs={savedJobs}
        isOpen={showSavedJobs}
        onClose={() => setShowSavedJobs(false)}
        onRemoveJob={removeJob}
        onApplyToJob={applyToJob}
      />
    </>
  );
};

export default JobSearchInterface;
