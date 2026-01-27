import { useState, useEffect, useRef, useCallback } from 'react';
import * as Human from '@vladmandic/human';
import { OneEuroFilter2D } from '@/lib/oneEuroFilter';

export interface CalibrationData {
  centerYaw: number;
  centerPitch: number;
  sensitivityX: number;
  sensitivityY: number;
  mouthThreshold: number;
}

export interface HeadTrackingState {
  isInitialized: boolean;
  isCalibrating: boolean;
  calibrationStep: number;
  cursorPosition: { x: number; y: number };
  isMouthOpen: boolean;
  isTracking: boolean;
  error: string | null;
}

const defaultConfig: Partial<Human.Config> = {
  modelBasePath: 'https://vladmandic.github.io/human/models/',
  filter: { enabled: true, equalization: false },
  face: {
    enabled: true,
    detector: { rotation: false, maxDetected: 1 },
    mesh: { enabled: true },
    iris: { enabled: false },
    emotion: { enabled: false },
    description: { enabled: false },
  },
  body: { enabled: false },
  hand: { enabled: false },
  object: { enabled: false },
  gesture: { enabled: false },
};

export function useHeadTracking() {
  const [state, setState] = useState<HeadTrackingState>({
    isInitialized: false,
    isCalibrating: false,
    calibrationStep: 0,
    cursorPosition: { x: window.innerWidth / 2, y: window.innerHeight / 2 },
    isMouthOpen: false,
    isTracking: false,
    error: null,
  });

  const humanRef = useRef<Human.Human | null>(null);
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const animationRef = useRef<number | null>(null);
  const filterRef = useRef<OneEuroFilter2D>(new OneEuroFilter2D(0.5, 0.5, 1.0));
  const calibrationRef = useRef<CalibrationData>({
    centerYaw: 0,
    centerPitch: 0,
    sensitivityX: 400,
    sensitivityY: 300,
    mouthThreshold: 0.35,
  });
  const lastClickRef = useRef<number>(0);
  const mouthWasOpenRef = useRef<boolean>(false);
  const calibrationSamplesRef = useRef<{ yaw: number[]; pitch: number[]; mouth: number[] }>({
    yaw: [],
    pitch: [],
    mouth: [],
  });

  const initialize = useCallback(async () => {
    try {
      setState(prev => ({ ...prev, error: null }));
      
      // Initialize Human.js
      humanRef.current = new Human.Human(defaultConfig);
      await humanRef.current.load();
      
      // Request webcam
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { width: 640, height: 480, facingMode: 'user' },
        audio: false,
      });

      // Create video element
      const video = document.createElement('video');
      video.srcObject = stream;
      video.autoplay = true;
      video.playsInline = true;
      video.muted = true;
      video.style.display = 'none';
      document.body.appendChild(video);
      videoRef.current = video;

      await new Promise<void>((resolve) => {
        video.onloadedmetadata = () => {
          video.play();
          resolve();
        };
      });

      setState(prev => ({ ...prev, isInitialized: true }));
    } catch (err) {
      console.error('Failed to initialize head tracking:', err);
      setState(prev => ({ 
        ...prev, 
        error: err instanceof Error ? err.message : 'Failed to initialize camera' 
      }));
    }
  }, []);

  const startCalibration = useCallback(() => {
    calibrationSamplesRef.current = { yaw: [], pitch: [], mouth: [] };
    setState(prev => ({ ...prev, isCalibrating: true, calibrationStep: 1 }));
  }, []);

  const nextCalibrationStep = useCallback(() => {
    setState(prev => {
      const nextStep = prev.calibrationStep + 1;
      
      if (prev.calibrationStep === 1) {
        // Save center position
        const samples = calibrationSamplesRef.current;
        if (samples.yaw.length > 0) {
          calibrationRef.current.centerYaw = samples.yaw.reduce((a, b) => a + b, 0) / samples.yaw.length;
          calibrationRef.current.centerPitch = samples.pitch.reduce((a, b) => a + b, 0) / samples.pitch.length;
        }
        calibrationSamplesRef.current = { yaw: [], pitch: [], mouth: [] };
      } else if (prev.calibrationStep === 2) {
        // Save mouth threshold
        const samples = calibrationSamplesRef.current.mouth;
        if (samples.length > 0) {
          const maxMouth = Math.max(...samples);
          calibrationRef.current.mouthThreshold = maxMouth * 0.7;
        }
        calibrationSamplesRef.current = { yaw: [], pitch: [], mouth: [] };
      } else if (nextStep > 2) {
        filterRef.current.reset();
        return { ...prev, isCalibrating: false, calibrationStep: 0 };
      }
      
      return { ...prev, calibrationStep: nextStep };
    });
  }, []);

  const calculateMouthOpenRatio = useCallback((face: Human.FaceResult): number => {
    if (!face.mesh || face.mesh.length < 14) return 0;
    
    // Mouth landmarks (approximate indices for Human.js mesh)
    const topLip = face.mesh[13]; // Upper lip center
    const bottomLip = face.mesh[14]; // Lower lip center
    const leftCorner = face.mesh[61] || face.mesh[0]; // Left mouth corner
    const rightCorner = face.mesh[291] || face.mesh[16]; // Right mouth corner
    
    if (!topLip || !bottomLip || !leftCorner || !rightCorner) return 0;
    
    const mouthHeight = Math.abs(bottomLip[1] - topLip[1]);
    const mouthWidth = Math.abs(rightCorner[0] - leftCorner[0]);
    
    return mouthWidth > 0 ? mouthHeight / mouthWidth : 0;
  }, []);

  const startTracking = useCallback(() => {
    if (!humanRef.current || !videoRef.current) return;

    setState(prev => ({ ...prev, isTracking: true }));

    const detect = async () => {
      if (!humanRef.current || !videoRef.current || !state.isInitialized) return;

      try {
        const result = await humanRef.current.detect(videoRef.current);
        
        if (result.face && result.face.length > 0) {
          const face = result.face[0];
          const rotation = face.rotation;
          
          if (rotation) {
            const yaw = (rotation.angle?.yaw ?? 0) * (180 / Math.PI);
            const pitch = (rotation.angle?.pitch ?? 0) * (180 / Math.PI);
            
            // During calibration, collect samples
            if (state.isCalibrating) {
              calibrationSamplesRef.current.yaw.push(yaw);
              calibrationSamplesRef.current.pitch.push(pitch);
              
              const mouthRatio = calculateMouthOpenRatio(face);
              calibrationSamplesRef.current.mouth.push(mouthRatio);
            } else {
              // Normal tracking
              const cal = calibrationRef.current;
              const rawX = window.innerWidth / 2 + (yaw - cal.centerYaw) * cal.sensitivityX;
              const rawY = window.innerHeight / 2 + (pitch - cal.centerPitch) * cal.sensitivityY;
              
              // Clamp to screen bounds
              const clampedX = Math.max(0, Math.min(window.innerWidth, rawX));
              const clampedY = Math.max(0, Math.min(window.innerHeight, rawY));
              
              // Apply One-Euro Filter
              const filtered = filterRef.current.filter(clampedX, clampedY);
              
              setState(prev => ({
                ...prev,
                cursorPosition: { x: filtered.x, y: filtered.y },
              }));
              
              // Check mouth open
              const mouthRatio = calculateMouthOpenRatio(face);
              const isMouthOpen = mouthRatio > cal.mouthThreshold;
              
              if (isMouthOpen && !mouthWasOpenRef.current) {
                const now = Date.now();
                if (now - lastClickRef.current > 800) {
                  lastClickRef.current = now;
                  setState(prev => ({ ...prev, isMouthOpen: true }));
                  
                  // Trigger click on element under cursor
                  const element = document.elementFromPoint(filtered.x, filtered.y);
                  if (element instanceof HTMLElement) {
                    element.click();
                  }
                  
                  setTimeout(() => {
                    setState(prev => ({ ...prev, isMouthOpen: false }));
                  }, 200);
                }
              }
              
              mouthWasOpenRef.current = isMouthOpen;
            }
          }
        }
      } catch (err) {
        console.error('Detection error:', err);
      }

      animationRef.current = requestAnimationFrame(detect);
    };

    detect();
  }, [state.isInitialized, state.isCalibrating, calculateMouthOpenRatio]);

  const stopTracking = useCallback(() => {
    if (animationRef.current) {
      cancelAnimationFrame(animationRef.current);
      animationRef.current = null;
    }
    setState(prev => ({ ...prev, isTracking: false }));
  }, []);

  const cleanup = useCallback(() => {
    stopTracking();
    if (videoRef.current) {
      const stream = videoRef.current.srcObject as MediaStream;
      stream?.getTracks().forEach(track => track.stop());
      videoRef.current.remove();
      videoRef.current = null;
    }
    humanRef.current = null;
    setState(prev => ({ ...prev, isInitialized: false }));
  }, [stopTracking]);

  useEffect(() => {
    return () => {
      cleanup();
    };
  }, [cleanup]);

  return {
    state,
    initialize,
    startCalibration,
    nextCalibrationStep,
    startTracking,
    stopTracking,
    cleanup,
  };
}
