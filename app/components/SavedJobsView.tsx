'use client';

import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { JobPosting } from '../../types';

interface SavedJobsViewProps {
  savedJobs: JobPosting[];
  isOpen: boolean;
  onClose: () => void;
  onRemoveJob: (jobId: string) => void;
  onApplyToJob?: (job: JobPosting) => void;
}

const SavedJobsView: React.FC<SavedJobsViewProps> = ({ 
  savedJobs, 
  isOpen, 
  onClose, 
  onRemoveJob, 
  onApplyToJob 
}) => {
  const speakText = (text: string) => {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.rate = 0.9;
      utterance.pitch = 1.0;
      utterance.volume = 0.8;
      window.speechSynthesis.speak(utterance);
    }
  };

  const handleRemoveJob = (job: JobPosting) => {
    const jobId = `${job.title}-${job.company}`.replace(/\s+/g, '-');
    onRemoveJob(jobId);
    speakText(`Removed ${job.title} at ${job.company} from saved jobs`);
  };

  const handleApplyToJob = (job: JobPosting) => {
    if (onApplyToJob) {
      onApplyToJob(job);
    }
    speakText(`Opening application for ${job.title} at ${job.company}`);
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
          onClick={onClose}
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            className="bg-gradient-to-br from-indigo-900 via-purple-900 to-pink-900 rounded-2xl shadow-2xl border border-white/20 max-w-4xl w-full max-h-[80vh] overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="p-6 border-b border-white/10">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-2xl font-bold text-white mb-1">
                    💾 Saved Jobs
                  </h2>
                  <p className="text-white/70 text-sm">
                    {savedJobs.length} {savedJobs.length === 1 ? 'job' : 'jobs'} saved for later
                  </p>
                </div>
                <button
                  onClick={onClose}
                  className="p-2 text-white/60 hover:text-white hover:bg-white/10 rounded-lg transition-colors"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
            </div>

            {/* Content */}
            <div className="p-6 overflow-y-auto max-h-[calc(80vh-140px)]">
              {savedJobs.length === 0 ? (
                <div className="text-center py-12">
                  <div className="text-6xl mb-4">📋</div>
                  <h3 className="text-xl font-semibold text-white mb-2">
                    No saved jobs yet
                  </h3>
                  <p className="text-white/60">
                    Use voice commands ("save") or gestures (👍) to save jobs while browsing
                  </p>
                </div>
              ) : (
                <div className="space-y-4">
                  {savedJobs.map((job, index) => (
                    <motion.div
                      key={`${job.title}-${job.company}-${index}`}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.1 }}
                      className="bg-white/10 backdrop-blur-lg rounded-xl p-5 border border-white/10 hover:border-white/20 transition-all group"
                    >
                      <div className="flex items-start justify-between mb-4">
                        <div className="flex-1 min-w-0">
                          <h3 className="text-lg font-semibold text-white mb-1 truncate">
                            {job.title}
                          </h3>
                          <p className="text-purple-300 font-medium mb-2">
                            {job.company}
                          </p>
                          <div className="flex flex-wrap items-center gap-3 text-sm text-white/70">
                            <span className="flex items-center">
                              📍 {job.location || 'Remote'}
                            </span>
                            {job.salary && (
                              <span className="flex items-center">
                                💰 {job.salary}
                              </span>
                            )}
                            {job.remote && (
                              <span className="px-2 py-1 bg-green-500/20 text-green-300 rounded-full text-xs">
                                Remote
                              </span>
                            )}
                          </div>
                        </div>
                        
                        <div className="flex items-center space-x-2 ml-4">
                          <button
                            onClick={() => handleApplyToJob(job)}
                            className="px-4 py-2 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-lg text-sm font-medium hover:from-purple-600 hover:to-pink-600 transition-all transform hover:scale-105"
                          >
                            Apply
                          </button>
                          <button
                            onClick={() => handleRemoveJob(job)}
                            className="p-2 text-red-400 hover:text-red-300 hover:bg-red-500/20 rounded-lg transition-colors"
                            title="Remove from saved jobs"
                          >
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                            </svg>
                          </button>
                        </div>
                      </div>

                      {/* Job Description Preview */}
                      {job.description && (
                        <div className="mb-4">
                          <p className="text-white/80 text-sm leading-relaxed">
                            {job.description.length > 200 
                              ? `${job.description.substring(0, 200)}...`
                              : job.description
                            }
                          </p>
                        </div>
                      )}

                      {/* Tags */}
                      {job.tags && job.tags.length > 0 && (
                        <div className="flex flex-wrap gap-2">
                          {job.tags.slice(0, 6).map((tag, tagIndex) => (
                            <span
                              key={tagIndex}
                              className="px-3 py-1 bg-blue-500/20 text-blue-300 rounded-full text-xs"
                            >
                              {tag}
                            </span>
                          ))}
                          {job.tags.length > 6 && (
                            <span className="px-3 py-1 bg-gray-500/20 text-gray-400 rounded-full text-xs">
                              +{job.tags.length - 6} more
                            </span>
                          )}
                        </div>
                      )}
                    </motion.div>
                  ))}
                </div>
              )}
            </div>

            {/* Footer with Voice Commands */}
            <div className="p-6 border-t border-white/10 bg-white/5">
              <div className="flex items-center justify-between">
                <div className="text-xs text-white/60">
                  💡 <strong>Voice commands:</strong> "Show saved jobs" • "Remove [job title]" • "Apply to [job title]"
                </div>
                <button
                  onClick={onClose}
                  className="px-4 py-2 bg-white/10 text-white rounded-lg text-sm hover:bg-white/20 transition-colors"
                >
                  Close
                </button>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default SavedJobsView;
