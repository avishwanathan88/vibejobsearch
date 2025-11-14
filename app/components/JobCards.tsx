'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { JobPosting } from '../../types';

interface JobCardsProps {
  jobs: JobPosting[];
  searchInsights?: string[];
  suggestedRefinements?: string[];
  isLoading?: boolean;
  currentJobIndex?: number;
  onJobIndexChange?: (index: number) => void;
}

const JobCards: React.FC<JobCardsProps> = ({ 
  jobs, 
  searchInsights = [], 
  suggestedRefinements = [], 
  isLoading = false,
  currentJobIndex: externalIndex,
  onJobIndexChange
}) => {
  const [internalJobIndex, setInternalJobIndex] = useState(0);
  const [direction, setDirection] = useState(0);
  
  // Use external index if provided, otherwise use internal state
  const currentJobIndex = externalIndex !== undefined ? externalIndex : internalJobIndex;

  const currentJob = jobs[currentJobIndex];

  const changeJobIndex = (newIndex: number) => {
    if (onJobIndexChange) {
      onJobIndexChange(newIndex);
    } else {
      setInternalJobIndex(newIndex);
    }
  };

  const nextJob = () => {
    if (currentJobIndex < jobs.length - 1) {
      setDirection(1);
      changeJobIndex(currentJobIndex + 1);
    }
  };

  const prevJob = () => {
    if (currentJobIndex > 0) {
      setDirection(-1);
      changeJobIndex(currentJobIndex - 1);
    }
  };

  const goToJob = (index: number) => {
    setDirection(index > currentJobIndex ? 1 : -1);
    changeJobIndex(index);
  };

  // Keyboard navigation
  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      if (e.key === 'ArrowRight' || e.key === ' ') {
        e.preventDefault();
        nextJob();
      } else if (e.key === 'ArrowLeft') {
        e.preventDefault();
        prevJob();
      }
    };

    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [currentJobIndex, jobs.length]);

  const slideVariants = {
    enter: (direction: number) => ({
      x: direction > 0 ? 1000 : -1000,
      opacity: 0,
      scale: 0.95
    }),
    center: {
      zIndex: 1,
      x: 0,
      opacity: 1,
      scale: 1
    },
    exit: (direction: number) => ({
      zIndex: 0,
      x: direction < 0 ? 1000 : -1000,
      opacity: 0,
      scale: 0.95
    })
  };

  if (isLoading) {
    return (
      <div className="max-w-6xl mx-auto p-6">
        <div className="flex items-center justify-center min-h-[500px]">
          <div className="text-center">
            <div className="animate-spin w-8 h-8 border-3 border-purple-500 border-t-transparent rounded-full mx-auto mb-4"></div>
            <p className="text-white/70">AI Subagents are analyzing your search...</p>
            <div className="mt-4 space-y-2 text-sm text-white/50">
              <p>🧠 Keyword Analysis Agent</p>
              <p>🎯 Job Matching Agent</p>
              <p>💰 Salary Analysis Agent</p>
              <p>📍 Location Optimizer Agent</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (jobs.length === 0) {
    return (
      <div className="max-w-6xl mx-auto p-6">
        <div className="bg-white/10 backdrop-blur-lg rounded-3xl p-8 text-center">
          <div className="text-6xl mb-4">🔍</div>
          <h3 className="text-2xl font-bold text-white mb-2">No jobs found</h3>
          <p className="text-white/70 mb-6">Try adjusting your search criteria or keywords</p>
          {suggestedRefinements.length > 0 && (
            <div className="space-y-2">
              <p className="text-sm text-white/60 font-semibold">Suggestions:</p>
              {suggestedRefinements.map((suggestion, index) => (
                <p key={index} className="text-sm text-purple-300">• {suggestion}</p>
              ))}
            </div>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto p-6">
      {/* Search Insights */}
      {searchInsights.length > 0 && (
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-6 bg-gradient-to-r from-purple-500/20 to-pink-500/20 backdrop-blur-lg rounded-2xl p-4 border border-white/10"
        >
          <h3 className="text-sm font-semibold text-white/80 mb-2">🤖 AI Insights</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-sm text-white/70">
            {searchInsights.map((insight, index) => (
              <div key={index} className="flex items-center space-x-2">
                <span className="w-1.5 h-1.5 bg-purple-400 rounded-full"></span>
                <span>{insight}</span>
              </div>
            ))}
          </div>
        </motion.div>
      )}

      {/* Main Job Card */}
      <div className="relative h-[600px] overflow-hidden">
        <AnimatePresence initial={false} custom={direction}>
          <motion.div
            key={currentJobIndex}
            custom={direction}
            variants={slideVariants}
            initial="enter"
            animate="center"
            exit="exit"
            transition={{
              x: { type: "spring", stiffness: 300, damping: 30 },
              opacity: { duration: 0.2 },
              scale: { duration: 0.2 }
            }}
            className="absolute inset-0 w-full"
          >
            <div className="bg-white/10 backdrop-blur-lg rounded-3xl p-8 h-full shadow-2xl border border-white/20 overflow-y-auto">
              {/* Header */}
              <div className="flex justify-between items-start mb-6">
                <div className="flex-1">
                  <div className="flex items-center space-x-3 mb-2">
                    <h1 className="text-3xl font-bold text-white">{currentJob.title}</h1>
                    {currentJob.remote && (
                      <span className="px-3 py-1 bg-green-500/20 text-green-300 rounded-full text-sm font-medium">
                        Remote
                      </span>
                    )}
                  </div>
                  <div className="flex items-center space-x-4 text-white/70 mb-4">
                    <span className="text-lg font-medium text-purple-300">{currentJob.company}</span>
                    <span>•</span>
                    <span>{currentJob.location}</span>
                    <span>•</span>
                    <span>{currentJob.type}</span>
                  </div>
                  {currentJob.salary && (
                    <div className="inline-flex items-center px-4 py-2 bg-gradient-to-r from-green-500/20 to-emerald-500/20 rounded-xl">
                      <span className="text-2xl font-bold text-green-300">{currentJob.salary}</span>
                    </div>
                  )}
                </div>
              </div>

              {/* Tags */}
              <div className="flex flex-wrap gap-2 mb-6">
                {currentJob.tags.map((tag, index) => (
                  <span
                    key={index}
                    className="px-3 py-1 bg-purple-500/20 text-purple-300 rounded-lg text-sm font-medium hover:bg-purple-500/30 transition-colors"
                  >
                    {tag}
                  </span>
                ))}
              </div>

              {/* Description */}
              <div className="space-y-6">
                <div>
                  <h3 className="text-xl font-semibold text-white mb-3">About the Role</h3>
                  <div className="text-white/80 leading-relaxed whitespace-pre-line">
                    {currentJob.description}
                  </div>
                </div>

                {/* Requirements */}
                {currentJob.requirements && currentJob.requirements.length > 0 && (
                  <div>
                    <h3 className="text-xl font-semibold text-white mb-3">Requirements</h3>
                    <ul className="space-y-2">
                      {currentJob.requirements.map((req, index) => (
                        <li key={index} className="flex items-start space-x-3 text-white/80">
                          <span className="w-2 h-2 bg-purple-400 rounded-full mt-2 flex-shrink-0"></span>
                          <span>{req}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {/* Benefits */}
                {currentJob.benefits && currentJob.benefits.length > 0 && (
                  <div>
                    <h3 className="text-xl font-semibold text-white mb-3">Benefits</h3>
                    <ul className="space-y-2">
                      {currentJob.benefits.map((benefit, index) => (
                        <li key={index} className="flex items-start space-x-3 text-white/80">
                          <span className="w-2 h-2 bg-green-400 rounded-full mt-2 flex-shrink-0"></span>
                          <span>{benefit}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {/* Application Info */}
                <div className="bg-white/5 rounded-xl p-4 mt-6">
                  <div className="flex items-center justify-between text-sm text-white/60">
                    <span>Posted: {new Date(currentJob.postedDate).toLocaleDateString()}</span>
                    {currentJob.applicationDeadline && (
                      <span>Deadline: {new Date(currentJob.applicationDeadline).toLocaleDateString()}</span>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Navigation Controls */}
      <div className="flex items-center justify-between mt-6">
        {/* Previous Button */}
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={prevJob}
          disabled={currentJobIndex === 0}
          className="flex items-center space-x-2 px-6 py-3 bg-white/10 backdrop-blur-lg rounded-xl border border-white/20 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-white/20 transition-colors"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
          <span className="text-white font-medium">Previous</span>
        </motion.button>

        {/* Job Counter and Dots */}
        <div className="flex flex-col items-center space-y-3">
          <span className="text-white/70 text-sm font-medium">
            {currentJobIndex + 1} of {jobs.length} jobs
          </span>
          
          {/* Pagination Dots */}
          <div className="flex space-x-2">
            {jobs.slice(0, Math.min(jobs.length, 10)).map((_, index) => (
              <motion.button
                key={index}
                whileHover={{ scale: 1.2 }}
                whileTap={{ scale: 0.9 }}
                onClick={() => goToJob(index)}
                className={`w-3 h-3 rounded-full transition-all ${
                  index === currentJobIndex
                    ? 'bg-purple-400 scale-125'
                    : 'bg-white/30 hover:bg-white/50'
                }`}
              />
            ))}
            {jobs.length > 10 && (
              <span className="text-white/50 text-sm ml-2">+{jobs.length - 10} more</span>
            )}
          </div>
        </div>

        {/* Next Button */}
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={nextJob}
          disabled={currentJobIndex === jobs.length - 1}
          className="flex items-center space-x-2 px-6 py-3 bg-white/10 backdrop-blur-lg rounded-xl border border-white/20 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-white/20 transition-colors"
        >
          <span className="text-white font-medium">Next</span>
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </motion.button>
      </div>

      {/* Keyboard Shortcuts Hint */}
      <div className="mt-4 text-center text-xs text-white/40">
        Use ← → arrow keys or spacebar to navigate
      </div>

      {/* Apply Button */}
      <motion.div 
        className="mt-6 text-center"
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
      >
        <button className="px-8 py-4 bg-gradient-to-r from-purple-500 to-pink-500 text-white font-bold rounded-2xl shadow-lg hover:shadow-xl transition-shadow">
          Apply for this position
        </button>
      </motion.div>

      {/* Suggestions */}
      {suggestedRefinements.length > 0 && (
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="mt-8 bg-blue-500/10 backdrop-blur-lg rounded-2xl p-6 border border-blue-500/20"
        >
          <h3 className="text-lg font-semibold text-white mb-4">💡 Refine Your Search</h3>
          <div className="space-y-2">
            {suggestedRefinements.map((suggestion, index) => (
              <div key={index} className="flex items-start space-x-3 text-blue-200">
                <span className="w-2 h-2 bg-blue-400 rounded-full mt-2 flex-shrink-0"></span>
                <span className="text-sm">{suggestion}</span>
              </div>
            ))}
          </div>
        </motion.div>
      )}
    </div>
  );
};

export default JobCards;
