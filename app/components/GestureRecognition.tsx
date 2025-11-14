'use client';

import React, { useRef, useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Webcam from 'react-webcam';
import * as tf from '@tensorflow/tfjs';
import * as handpose from '@tensorflow-models/handpose';

interface GestureRecognitionProps {
  onGesture: (gesture: 'thumbs-up' | 'thumbs-down' | 'swipe-left' | 'swipe-right') => void;
  isEnabled: boolean;
  onToggle: () => void;
}

const GestureRecognition: React.FC<GestureRecognitionProps> = ({ onGesture, isEnabled, onToggle }) => {
  const webcamRef = useRef<Webcam>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  const [model, setModel] = useState<handpose.HandPose | null>(null);
  const [isModelLoading, setIsModelLoading] = useState(false);
  const [detectedGesture, setDetectedGesture] = useState<string | null>(null);
  const [lastGestureTime, setLastGestureTime] = useState(0);
  const [handHistory, setHandHistory] = useState<Array<{ x: number, y: number, time: number }>>([]);
  const [cameraError, setCameraError] = useState<string | null>(null);
  
  // Load the handpose model when enabled
  useEffect(() => {
    if (!isEnabled || model) return;
    
    const loadModel = async () => {
      setIsModelLoading(true);
      setCameraError(null);
      console.log('Loading handpose model...');
      
      try {
        await tf.ready();
        const handposeModel = await handpose.load();
        console.log('Handpose model loaded successfully');
        setModel(handposeModel);
      } catch (error) {
        console.error('Failed to load handpose model:', error);
        setCameraError('Failed to load gesture recognition model');
      } finally {
        setIsModelLoading(false);
      }
    };

    loadModel();
  }, [isEnabled, model]);

  // Detect hand gestures
  const detectGestures = useCallback(async () => {
    if (!model || !webcamRef.current || !canvasRef.current || !isEnabled) return;

    const webcam = webcamRef.current;
    const canvas = canvasRef.current;
    const context = canvas.getContext('2d');
    
    if (!context) return;

    const video = webcam.video;
    if (!video || video.readyState !== 4) return;

    try {
      // Set canvas dimensions to match video
      canvas.width = video.videoWidth || 640;
      canvas.height = video.videoHeight || 480;
      
      const hands = await model.estimateHands(video);
      
      // Clear canvas
      context.clearRect(0, 0, canvas.width, canvas.height);
      
      if (hands.length > 0) {
        const hand = hands[0];
        
        // Draw hand landmarks
        drawHandLandmarks(hand, context);
        
        // Get palm center for swipe detection
        const palmCenter = calculatePalmCenter(hand);
        if (palmCenter) {
          updateHandHistory(palmCenter);
        }
        
        // Detect static gestures (thumbs up/down)
        const staticGesture = interpretStaticGesture(hand);
        
        // Detect swipe gestures
        const swipeGesture = detectSwipeGesture();
        
        const detectedGestureNow = swipeGesture || staticGesture;
        
        if (detectedGestureNow && detectedGestureNow !== detectedGesture) {
          const now = Date.now();
          // Different cooldowns for different gesture types
          const cooldownTime = detectedGestureNow.includes('swipe') ? 1000 : 1500;
          
          if (now - lastGestureTime > cooldownTime) {
            console.log(`Detected gesture: ${detectedGestureNow}`);
            setLastGestureTime(now);
            setDetectedGesture(detectedGestureNow);
            onGesture(detectedGestureNow as any);
            
            // Clear gesture after showing feedback
            setTimeout(() => setDetectedGesture(null), 1000);
            
            // Clear hand history after swipe detection to prevent false positives
            if (detectedGestureNow.includes('swipe')) {
              setHandHistory([]);
            }
          }
        }
      } else {
        setDetectedGesture(null);
      }
    } catch (error) {
      console.error('Error in hand detection:', error);
    }
  }, [model, isEnabled, detectedGesture, lastGestureTime, onGesture, handHistory]);

  // Start/stop gesture detection
  useEffect(() => {
    if (isEnabled && model && !intervalRef.current) {
      intervalRef.current = setInterval(detectGestures, 100); // 10 FPS
    } else if (!isEnabled && intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
    
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    };
  }, [isEnabled, model, detectGestures]);

  // Update hand position history for swipe detection
  const updateHandHistory = (position: { x: number, y: number }) => {
    const now = Date.now();
    setHandHistory(prev => {
      const updated = [...prev, { ...position, time: now }];
      // Keep only last 15 positions from last 3 seconds for better swipe detection
      return updated.filter(pos => now - pos.time < 3000).slice(-15);
    });
  };

  // Detect swipe gestures from hand movement
  const detectSwipeGesture = () => {
    if (handHistory.length < 3) return null;
    
    // Look for swipe in recent history
    const recent = handHistory.slice(-8); // Use more points for better detection
    if (recent.length < 3) return null;
    
    const start = recent[0];
    const end = recent[recent.length - 1];
    
    const dx = end.x - start.x;
    const dy = end.y - start.y;
    const distance = Math.sqrt(dx * dx + dy * dy);
    const timeSpan = end.time - start.time;
    
    console.log(`Swipe detection: dx=${dx.toFixed(1)}, dy=${dy.toFixed(1)}, distance=${distance.toFixed(1)}, time=${timeSpan}ms`);
    
    // More lenient swipe detection parameters
    if (distance > 50 && timeSpan > 200 && timeSpan < 1500) {
      // Ensure horizontal movement is dominant
      if (Math.abs(dx) > Math.abs(dy) * 0.7) {
        const gesture = dx > 0 ? 'swipe-right' : 'swipe-left';
        console.log(`Detected swipe: ${gesture}`);
        return gesture;
      }
    }
    
    return null;
  };

  // Calculate center of palm from landmarks
  const calculatePalmCenter = (hand: any) => {
    if (!hand.landmarks) return null;
    
    // Use wrist and base of fingers for palm center
    const palmLandmarks = [0, 5, 9, 13, 17]; // wrist + finger bases
    let sumX = 0, sumY = 0;
    
    palmLandmarks.forEach(idx => {
      sumX += hand.landmarks[idx][0];
      sumY += hand.landmarks[idx][1];
    });
    
    return {
      x: sumX / palmLandmarks.length,
      y: sumY / palmLandmarks.length
    };
  };

  // Detect thumbs up/down gestures
  const interpretStaticGesture = (hand: any) => {
    if (!hand.landmarks) return null;
    
    const landmarks = hand.landmarks;
    
    // Thumb landmarks
    const thumbTip = landmarks[4];
    const thumbBase = landmarks[1];
    
    // Index finger landmarks  
    const indexTip = landmarks[8];
    const indexMCP = landmarks[5];
    
    // Middle finger landmarks
    const middleTip = landmarks[12];
    const middleMCP = landmarks[9];
    
    // Check if index and middle fingers are curled (tips below bases)
    const indexCurled = indexTip[1] > indexMCP[1] + 20;
    const middleCurled = middleTip[1] > middleMCP[1] + 20;
    
    if (indexCurled && middleCurled) {
      // Thumbs up: thumb tip above thumb base
      if (thumbTip[1] < thumbBase[1] - 40) {
        return 'thumbs-up';
      }
      // Thumbs down: thumb tip below thumb base  
      if (thumbTip[1] > thumbBase[1] + 40) {
        return 'thumbs-down';
      }
    }
    
    return null;
  };

  // Draw hand landmarks on canvas
  const drawHandLandmarks = (hand: any, ctx: CanvasRenderingContext2D) => {
    if (!hand.landmarks) return;

    // Draw landmarks as circles
    hand.landmarks.forEach((landmark: number[], i: number) => {
      const [x, y] = landmark;
      ctx.beginPath();
      ctx.arc(x, y, 4, 0, 2 * Math.PI);
      ctx.fillStyle = i === 4 ? '#ff0000' : '#00ff00'; // Thumb tip in red
      ctx.fill();
    });

    // Draw connections
    const connections = [
      [0, 1], [1, 2], [2, 3], [3, 4], // Thumb
      [0, 5], [5, 6], [6, 7], [7, 8], // Index
      [0, 9], [9, 10], [10, 11], [11, 12], // Middle  
      [0, 13], [13, 14], [14, 15], [15, 16], // Ring
      [0, 17], [17, 18], [18, 19], [19, 20], // Pinky
      [5, 9], [9, 13], [13, 17] // Palm connections
    ];

    ctx.strokeStyle = '#ffffff';
    ctx.lineWidth = 2;
    connections.forEach(([start, end]) => {
      const [x1, y1] = hand.landmarks[start];
      const [x2, y2] = hand.landmarks[end];
      ctx.beginPath();
      ctx.moveTo(x1, y1);
      ctx.lineTo(x2, y2);
      ctx.stroke();
    });
  };

  if (cameraError) {
    return (
      <div className="p-4 bg-red-900/20 rounded-lg border border-red-500/30">
        <p className="text-red-400 text-sm">{cameraError}</p>
        <button 
          onClick={() => {
            setCameraError(null);
            setModel(null);
          }}
          className="mt-2 px-3 py-1 bg-red-500/20 text-red-400 rounded text-xs hover:bg-red-500/30 transition-colors"
        >
          Retry
        </button>
      </div>
    );
  }

  return (
    <div className="relative">
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-white font-medium">Gesture Control</h3>
        <button
          onClick={onToggle}
          className={`px-3 py-1 rounded-full text-xs transition-all ${
            isEnabled 
              ? 'bg-green-500/20 text-green-400 border border-green-500/30' 
              : 'bg-gray-700/50 text-gray-400 border border-gray-600/30'
          }`}
        >
          {isEnabled ? 'ON' : 'OFF'}
        </button>
      </div>

      <AnimatePresence>
        {isEnabled && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="space-y-3"
          >
            {isModelLoading ? (
              <div className="flex items-center justify-center p-8 bg-gray-800/50 rounded-lg">
                <div className="animate-spin w-6 h-6 border-2 border-purple-500 border-t-transparent rounded-full mr-3"></div>
                <span className="text-white text-sm">Loading AI model...</span>
              </div>
            ) : (
              <div className="relative">
                <div className="relative rounded-lg overflow-hidden bg-black">
                  <Webcam
                    ref={webcamRef}
                    audio={false}
                    screenshotFormat="image/jpeg"
                    videoConstraints={{ facingMode: "user" }}
                    className="w-full h-48 object-cover"
                    onUserMediaError={(error) => {
                      console.error('Camera error:', error);
                      setCameraError('Camera access denied or unavailable');
                    }}
                  />
                  <canvas
                    ref={canvasRef}
                    className="absolute top-0 left-0 w-full h-full"
                  />
                </div>
                
                {/* Gesture Feedback */}
                <AnimatePresence>
                  {detectedGesture && (
                    <motion.div
                      initial={{ opacity: 0, scale: 0.8, y: 10 }}
                      animate={{ opacity: 1, scale: 1, y: 0 }}
                      exit={{ opacity: 0, scale: 0.8, y: -10 }}
                      className="absolute top-2 right-2 px-3 py-2 bg-black/80 rounded-lg"
                    >
                      <div className="flex items-center space-x-2">
                        <span className="text-2xl">
                          {detectedGesture === 'thumbs-up' && '👍'}
                          {detectedGesture === 'thumbs-down' && '👎'}
                          {detectedGesture === 'swipe-left' && '👈'}
                          {detectedGesture === 'swipe-right' && '👉'}
                        </span>
                        <span className="text-white text-sm font-medium">
                          {detectedGesture === 'thumbs-up' && 'Save Job'}
                          {detectedGesture === 'thumbs-down' && 'Next Job'}
                          {detectedGesture === 'swipe-left' && 'Next Job'}
                          {detectedGesture === 'swipe-right' && 'Save Job'}
                        </span>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            )}

            {/* Instructions */}
            <div className="p-3 bg-white/5 backdrop-blur rounded-lg border border-white/10">
              <h4 className="text-white text-sm font-medium mb-2">Gesture Controls:</h4>
              <div className="space-y-1 text-xs text-white/70">
                <div className="flex items-center">
                  <span className="mr-2">👍</span>
                  <span>Thumbs up → Save current job</span>
                </div>
                <div className="flex items-center">
                  <span className="mr-2">👎</span>
                  <span>Thumbs down → Skip to next job</span>
                </div>
                <div className="flex items-center">
                  <span className="mr-2">👉</span>
                  <span>Swipe right → Save current job</span>
                </div>
                <div className="flex items-center">
                  <span className="mr-2">👈</span>
                  <span>Swipe left → Skip to next job</span>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default GestureRecognition;
