'use client';

import React, { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { voiceCommandAgent, VoiceCommand, VoiceCommandContext } from '../../lib/voiceCommandAgent';
import VoiceCommandFeedback from './VoiceCommandFeedback';

interface VoiceInputProps {
  onResult?: (transcript: string) => void;
  onSearchStart?: (query: string) => void;
  onCommand?: (command: VoiceCommand) => void;
  commandContext?: VoiceCommandContext;
}

const VoiceInput: React.FC<VoiceInputProps> = ({ 
  onResult, 
  onSearchStart, 
  onCommand,
  commandContext = {
    currentJobs: [],
    currentJobIndex: 0,
    isSearchActive: false
  }
}) => {
  const [isListening, setIsListening] = useState(false);
  const [isAlwaysListening, setIsAlwaysListening] = useState(false);
  const [transcript, setTranscript] = useState('');
  const [lastProcessedCommand, setLastProcessedCommand] = useState('');
  const [isSupported, setIsSupported] = useState(true);
  const [currentCommand, setCurrentCommand] = useState<VoiceCommand | undefined>();
  const [isProcessingCommand, setIsProcessingCommand] = useState(false);
  
  const recognitionRef = useRef<any>(null);
  const silenceTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const feedbackTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const restartTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const currentTranscriptRef = useRef<string>('');

  useEffect(() => {
    // Check for speech recognition support
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    
    if (!SpeechRecognition) {
      setIsSupported(false);
      return;
    }

    const setupRecognition = () => {
      const recognition = new SpeechRecognition();
      recognition.continuous = true;
      recognition.interimResults = true;
      recognition.lang = 'en-US';
      recognition.maxAlternatives = 1;

      recognition.onstart = () => {
        console.log('Speech recognition started');
        setIsListening(true);
      };

      recognition.onresult = (event: any) => {
        let finalTranscript = '';
        let interimTranscript = '';

        // Process all results
        for (let i = event.resultIndex; i < event.results.length; i++) {
          const result = event.results[i];
          const transcript = result[0].transcript;
          
          if (result.isFinal) {
            finalTranscript += transcript;
          } else {
            interimTranscript += transcript;
          }
        }

        // Build complete transcript
        let completeTranscript = '';
        for (let i = 0; i < event.results.length; i++) {
          if (event.results[i].isFinal) {
            completeTranscript += event.results[i][0].transcript + ' ';
          }
        }
        completeTranscript += interimTranscript;
        completeTranscript = completeTranscript.trim();

        console.log('Complete transcript:', completeTranscript);
        console.log('Final part:', finalTranscript);
        console.log('Interim part:', interimTranscript);

        // Update UI with complete transcript
        setTranscript(completeTranscript);
        currentTranscriptRef.current = completeTranscript;
        
        if (onResult) {
          onResult(completeTranscript);
        }

        // Process command when we have a final result and user paused speaking
        if (finalTranscript.trim().length > 0) {
          console.log('Got final transcript, setting up silence detection');
          
          // Clear any existing timeout
          if (silenceTimeoutRef.current) {
            clearTimeout(silenceTimeoutRef.current);
          }
          
          // Wait for natural pause in speech (3 seconds)
          silenceTimeoutRef.current = setTimeout(() => {
            const fullCommand = completeTranscript.trim();
            console.log('Silence detected, processing command:', fullCommand);
            
            // Only process if this is a new command
            if (fullCommand && fullCommand !== lastProcessedCommand) {
              setLastProcessedCommand(fullCommand);
              processVoiceCommand(fullCommand);
            }
          }, 3000); // 3 seconds of silence indicates end of command
        }
      };

      recognition.onend = () => {
        console.log('Speech recognition ended');
        setIsListening(false);
        
        // If we're in always listening mode, restart recognition
        if (isAlwaysListening && !isProcessingCommand) {
          console.log('Restarting recognition for continuous listening');
          restartTimeoutRef.current = setTimeout(() => {
            if (recognitionRef.current) {
              try {
                recognitionRef.current.start();
              } catch (error) {
                console.error('Error restarting recognition:', error);
              }
            }
          }, 500); // Short delay before restart
        }
      };

      recognition.onerror = (event: any) => {
        console.error('Speech recognition error:', event.error);
        setIsListening(false);
        
        if (event.error === 'not-allowed') {
          setIsSupported(false);
          setIsAlwaysListening(false);
        } else if (event.error === 'network') {
          console.log('Network error, will retry...');
        }
      };

      recognitionRef.current = recognition;
    };

    setupRecognition();

    return () => {
      if (recognitionRef.current) {
        recognitionRef.current.stop();
      }
      if (silenceTimeoutRef.current) {
        clearTimeout(silenceTimeoutRef.current);
      }
      if (feedbackTimeoutRef.current) {
        clearTimeout(feedbackTimeoutRef.current);
      }
      if (restartTimeoutRef.current) {
        clearTimeout(restartTimeoutRef.current);
      }
    };
  }, [isAlwaysListening, isProcessingCommand, lastProcessedCommand]);

  const processVoiceCommand = async (text: string) => {
    console.log('Processing voice command:', text);
    setIsProcessingCommand(true);
    
    // Clear the transcript after processing starts
    setTranscript('');
    currentTranscriptRef.current = '';
    
    try {
      const command = await voiceCommandAgent.processVoiceCommand(text, commandContext);
      setCurrentCommand(command);
      
      // Call the onCommand callback if provided
      if (onCommand) {
        onCommand(command);
      }

      // Handle specific intents - ALWAYS trigger search for search intent
      if (command.intent === 'search') {
        // Use the full original text for search, not just extracted parameters
        if (onSearchStart) {
          onSearchStart(text);
        }
      }

      // Speak the response
      if ('speechSynthesis' in window && command.response) {
        const utterance = new SpeechSynthesisUtterance(command.response);
        utterance.rate = 0.9;
        utterance.pitch = 1.0;
        utterance.volume = 0.8;
        speechSynthesis.speak(utterance);
      }

      // Auto-hide feedback after 8 seconds
      if (feedbackTimeoutRef.current) {
        clearTimeout(feedbackTimeoutRef.current);
      }
      
      feedbackTimeoutRef.current = setTimeout(() => {
        setCurrentCommand(undefined);
      }, 8000);

    } catch (error) {
      console.error('Voice command processing failed:', error);
    } finally {
      setIsProcessingCommand(false);
    }
  };

  const startContinuousListening = () => {
    if (!isSupported) return;
    
    console.log('Starting continuous listening mode');
    setIsAlwaysListening(true);
    setTranscript('');
    setLastProcessedCommand('');
    setCurrentCommand(undefined);
    
    if (recognitionRef.current && !isListening) {
      try {
        recognitionRef.current.start();
      } catch (error) {
        console.error('Error starting recognition:', error);
      }
    }
  };

  const stopContinuousListening = () => {
    console.log('Stopping continuous listening mode');
    setIsAlwaysListening(false);
    
    if (recognitionRef.current) {
      recognitionRef.current.stop();
    }
    
    // Clear all timeouts
    if (silenceTimeoutRef.current) {
      clearTimeout(silenceTimeoutRef.current);
    }
    if (restartTimeoutRef.current) {
      clearTimeout(restartTimeoutRef.current);
    }
  };

  const toggleContinuousListening = () => {
    if (isAlwaysListening) {
      stopContinuousListening();
    } else {
      startContinuousListening();
    }
  };

  if (!isSupported) {
    return (
      <div className="text-center p-6">
        <div className="bg-red-500/10 border border-red-500/20 rounded-xl p-4">
          <p className="text-red-300">
            Voice recognition is not supported in your browser. 
            Please use Chrome or Edge for the best experience.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col space-y-4">
      {/* Main Voice Input Section */}
      <div className="relative">
        {/* Main Voice Button */}
        <motion.button
          onClick={toggleContinuousListening}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className={`relative w-16 h-16 rounded-full flex items-center justify-center transition-all duration-300 ${
            isAlwaysListening
              ? 'bg-gradient-to-r from-green-500 to-emerald-500 shadow-lg shadow-green-500/50'
              : 'bg-gradient-to-r from-purple-500 to-pink-500 hover:shadow-lg hover:shadow-purple-500/50'
          }`}
        >
          {isListening ? (
            <motion.div
              animate={{ scale: [1, 1.2, 1] }}
              transition={{ duration: 1, repeat: Infinity }}
              className="w-6 h-6 bg-white rounded-full"
            />
          ) : isAlwaysListening ? (
            <motion.div
              animate={{ opacity: [0.5, 1, 0.5] }}
              transition={{ duration: 2, repeat: Infinity }}
              className="w-6 h-6 bg-white rounded-full"
            />
          ) : (
            <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z" />
            </svg>
          )}

          {/* Listening Animation */}
          {isListening && (
            <motion.div
              className="absolute inset-0 rounded-full border-2 border-white/30"
              animate={{ scale: [1, 1.5, 2], opacity: [0.5, 0.2, 0] }}
              transition={{ duration: 1.5, repeat: Infinity }}
            />
          )}
        </motion.button>

        {/* Status Text */}
        <div className="mt-4 text-center">
          <p className={`font-medium transition-colors ${
            isListening ? 'text-green-300' : 
            isAlwaysListening ? 'text-emerald-300' :
            'text-white/70'
          }`}>
            {isListening ? 'Listening...' : 
             isAlwaysListening ? 'Always Listening' :
             'Click to start listening'}
          </p>
          
          {transcript && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="mt-3 p-3 bg-white/10 backdrop-blur-lg rounded-xl border border-white/20 max-w-md mx-auto"
            >
              <p className="text-white text-sm">"{transcript}"</p>
            </motion.div>
          )}
        </div>

        {/* Voice Commands Help */}
        <div className="mt-6 text-center">
          <div className="text-xs text-white/40 mb-2">
            {isAlwaysListening ? 'Just speak naturally:' : 'Try saying:'}
          </div>
          <div className="flex flex-wrap justify-center gap-2 text-xs">
            <span className="px-2 py-1 bg-white/5 rounded-lg text-white/60">
              "Find React jobs in New York"
            </span>
            <span className="px-2 py-1 bg-white/5 rounded-lg text-white/60">
              "Next job"
            </span>
            <span className="px-2 py-1 bg-white/5 rounded-lg text-white/60">
              "Analyze this job"
            </span>
            <span className="px-2 py-1 bg-white/5 rounded-lg text-white/60">
              "Save this position"
            </span>
          </div>
        </div>

        {/* Instructions */}
        <div className="mt-4 text-center text-xs text-white/40">
          {isAlwaysListening ? 
            'Speak naturally. I\'ll process your command after you pause.' :
            'Click once to enable continuous listening'
          }
        </div>
      </div>

      {/* Voice Command Feedback - Now positioned below */}
      <div className="relative">
        <VoiceCommandFeedback
          command={currentCommand}
          isProcessing={isProcessingCommand}
        />
      </div>
    </div>
  );
};

export default VoiceInput;
