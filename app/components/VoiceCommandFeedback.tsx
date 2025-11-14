'use client';

import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { VoiceCommand } from '../../lib/voiceCommandAgent';

interface VoiceCommandFeedbackProps {
  command?: VoiceCommand;
  isProcessing: boolean;
}

const VoiceCommandFeedback: React.FC<VoiceCommandFeedbackProps> = ({
  command,
  isProcessing
}) => {
  const [showFeedback, setShowFeedback] = useState(false);

  useEffect(() => {
    if (command || isProcessing) {
      setShowFeedback(true);
    } else {
      setShowFeedback(false);
    }
  }, [command, isProcessing]);

  const getIntentIcon = (intent: string) => {
    switch (intent) {
      case 'search': return '🔍';
      case 'navigate': return '🧭';
      case 'save': return '💾';
      case 'analyze': return '🤖';
      case 'explain': return '💡';
      default: return '❓';
    }
  };

  const getIntentColor = (intent: string) => {
    switch (intent) {
      case 'search': return 'from-blue-500 to-cyan-500';
      case 'navigate': return 'from-purple-500 to-pink-500';
      case 'save': return 'from-green-500 to-emerald-500';
      case 'analyze': return 'from-orange-500 to-red-500';
      case 'explain': return 'from-yellow-500 to-orange-500';
      default: return 'from-gray-500 to-gray-600';
    }
  };

  const getConfidenceColor = (confidence: number) => {
    if (confidence >= 0.8) return 'text-green-400';
    if (confidence >= 0.6) return 'text-yellow-400';
    return 'text-red-400';
  };

  if (!showFeedback) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, y: -20, scale: 0.95 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: -20, scale: 0.95 }}
        className="w-full max-w-md mx-auto mt-4"
      >
        <div className="bg-black/30 backdrop-blur-lg rounded-2xl border border-white/20 shadow-2xl">
          {isProcessing && !command && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="p-4"
            >
              <div className="flex items-center space-x-3">
                <div className="animate-spin w-6 h-6 border-2 border-purple-400 border-t-transparent rounded-full"></div>
                <div>
                  <h3 className="text-white font-medium">Processing Voice Command</h3>
                  <p className="text-white/60 text-sm">AI is analyzing your request...</p>
                </div>
              </div>
            </motion.div>
          )}

          {command && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="p-4 space-y-3"
            >
              {/* Command Header */}
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <span className="text-2xl">{getIntentIcon(command.intent)}</span>
                  <div>
                    <h3 className="text-white font-medium capitalize">
                      {command.intent} Command
                    </h3>
                    <div className="flex items-center space-x-2 text-xs">
                      <span className="text-white/60">Confidence:</span>
                      <span className={getConfidenceColor(command.confidence)}>
                        {Math.round(command.confidence * 100)}%
                      </span>
                    </div>
                  </div>
                </div>
                
                {/* Intent Badge */}
                <div className={`px-3 py-1 rounded-full bg-gradient-to-r ${getIntentColor(command.intent)} text-white text-xs font-medium`}>
                  {command.intent.toUpperCase()}
                </div>
              </div>

              {/* Original Command */}
              <div className="bg-white/5 rounded-xl p-3 border border-white/10">
                <p className="text-white/80 text-sm font-mono">
                  "{command.originalText}"
                </p>
              </div>

              {/* AI Response */}
              <div className="bg-gradient-to-r from-purple-500/10 to-pink-500/10 rounded-xl p-3 border border-purple-500/20">
                <div className="flex items-start space-x-2">
                  <span className="text-purple-400 text-sm">🤖</span>
                  <p className="text-white/90 text-sm leading-relaxed">
                    {command.response}
                  </p>
                </div>
              </div>

              {/* Parameters (if any) */}
              {command.parameters && Object.keys(command.parameters).length > 0 && (
                <div className="space-y-2">
                  <h4 className="text-white/70 text-xs font-medium uppercase tracking-wide">
                    Extracted Parameters:
                  </h4>
                  <div className="flex flex-wrap gap-2">
                    {Object.entries(command.parameters).map(([key, value]) => (
                      value && (
                        <div
                          key={key}
                          className="px-2 py-1 bg-white/10 rounded-lg text-xs text-white/80"
                        >
                          <span className="text-white/60">{key}:</span>{' '}
                          <span className="text-white">{String(value)}</span>
                        </div>
                      )
                    ))}
                  </div>
                </div>
              )}

              {/* Success Indicators */}
              <div className="flex items-center justify-between pt-2 border-t border-white/10">
                <div className="flex items-center space-x-2">
                  <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                  <span className="text-green-400 text-xs font-medium">Command Understood</span>
                </div>
                
                <div className="text-white/40 text-xs">
                  {new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </div>
              </div>
            </motion.div>
          )}
        </div>
      </motion.div>
    </AnimatePresence>
  );
};

export default VoiceCommandFeedback;
