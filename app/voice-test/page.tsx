'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import VoiceInput from '@/app/components/VoiceInput';

export default function VoiceTestPage() {
  const [allTranscripts, setAllTranscripts] = useState<string[]>([]);

  const handleTranscript = (transcript: string) => {
    console.log('New transcript:', transcript);
    setAllTranscripts(prev => [...prev, transcript]);
  };

  const clearHistory = () => {
    setAllTranscripts([]);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-8"
        >
          <h1 className="text-4xl font-bold text-white mb-2">
            Voice Input Test
          </h1>
          <p className="text-white/70 text-lg">
            Test the Web Speech API implementation
          </p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Voice Input Component */}
          <div>
            <VoiceInput 
              onTranscript={handleTranscript}
              className="h-full"
            />
          </div>

          {/* Transcript History */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="p-6"
          >
            <div className="backdrop-blur-lg bg-white/10 border border-white/20 rounded-2xl p-6 shadow-2xl h-full">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-xl font-semibold text-white">Transcript History</h3>
                {allTranscripts.length > 0 && (
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={clearHistory}
                    className="px-4 py-2 bg-red-500/20 hover:bg-red-500/30 border border-red-500/40 rounded-lg text-red-300 text-sm transition-all duration-200"
                  >
                    Clear History
                  </motion.button>
                )}
              </div>

              <div className="space-y-3 max-h-[400px] overflow-y-auto">
                {allTranscripts.length === 0 ? (
                  <div className="text-center py-8">
                    <p className="text-white/50 italic">
                      No transcripts yet. Start speaking to see results here.
                    </p>
                  </div>
                ) : (
                  allTranscripts.map((transcript, index) => (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.1 }}
                      className="backdrop-blur-sm bg-black/20 border border-white/10 rounded-lg p-3"
                    >
                      <div className="flex items-start justify-between mb-1">
                        <span className="text-xs text-white/60">
                          #{index + 1}
                        </span>
                        <span className="text-xs text-white/60">
                          {new Date().toLocaleTimeString()}
                        </span>
                      </div>
                      <p className="text-white leading-relaxed">
                        "{transcript}"
                      </p>
                    </motion.div>
                  ))
                )}
              </div>

              {/* Test Instructions */}
              <div className="mt-6 pt-4 border-t border-white/20">
                <h4 className="text-sm font-semibold text-white mb-2">
                  Test Commands:
                </h4>
                <div className="space-y-1 text-sm text-white/70">
                  <div>• "Hello World"</div>
                  <div>• "This is a test"</div>
                  <div>• "Web Speech API works"</div>
                  <div>• Try speaking longer sentences</div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Instructions */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="mt-8 text-center"
        >
          <div className="backdrop-blur-lg bg-white/5 border border-white/10 rounded-xl p-6 inline-block">
            <h3 className="text-lg font-semibold text-white mb-3">How to Test</h3>
            <div className="text-white/70 space-y-2 text-sm max-w-2xl">
              <p>1. Click the microphone button to start listening</p>
              <p>2. Say "Hello World" or any other phrase</p>
              <p>3. Watch the text appear in real-time</p>
              <p>4. Check the transcript history on the right</p>
              <p>5. Use the speaker button to hear the transcribed text</p>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
