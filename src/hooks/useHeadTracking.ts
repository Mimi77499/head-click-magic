import { useState, useEffect, useRef, useCallback } from 'react';
import * as Human from '@vladmandic/human';
import { OneEuroFilter2D } from '@/lib/oneEuroFilter';

export type ClickMethod = 'mouth' | 'blink' | 'both';

export interface CalibrationData {
  centerYaw: number;
  centerPitch: number;
  sensitivityX: number;
  sensitivityY: number;
  mouthThreshold: number;
  blinkThreshold: number;
}

export interface HeadTrackingState {
  isInitialized: boolean;
  isCalibrating: boolean;
  calibrationStep: number;
  cursorPosition: { x: number; y: number };
  isMouthOpen: boolean;
  isBlinking: boolean;
  isTracking: boolean;
  error: string | null;
  clickMethod: ClickMethod;
}

const defaultConfig: Partial<Human.Config> = {
  modelBasePath: 'https://vladmandic.github.io/human/models/',
  filter: { enabled: true, equalization: false },
  face: {
    enabled: true,
    detector: { rotation: false, maxDetected: 1 },
    mesh: { enabled: true },
    iris: { enabled: true }, // Enable iris for better eye tracking
    emotion: { enabled: false },
    description: { enabled: false },
  },
  body: { enabled: false },
  hand: { enabled: false },
  object: { enabled: false },
  gesture: { enabled: false },
};

// Eye landmark indices for Human.js mesh (MediaPipe Face Mesh)
const EYE_LANDMARKS = {
  // Left eye (user's left, appears on right side of image)
  leftUpper: [159, 158, 157, 173, 155],
  leftLower: [145, 144, 153, 154, 155],
  leftTop: 159,
  leftBottom: 145,
  // Right eye (user's right, appears on left side of image)
  rightUpper: [386, 385, 384, 398, 382],
  rightLower: [374, 373, 380, 381, 382],
  rightTop: 386,
  rightBottom: 374,
};

export function useHeadTracking() {
  const [state, setState] = useState<HeadTrackingState>({
    isInitialized: false,
    isCalibrating: false,
    calibrationStep: 0,
    cursorPosition: { x: window.innerWidth / 2, y: window.innerHeight / 2 },
    isMouthOpen: false,
    isBlinking: false,
    isTracking: false,
    error: null,
    clickMethod: 'both',
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
    blinkThreshold: 0.2,
  });
  const lastClickRef = useRef<number>(0);
  const mouthWasOpenRef = useRef<boolean>(false);
  const eyesWereClosedRef = useRef<boolean>(false);
  const blinkStartTimeRef = useRef<number>(0);
  const calibrationSamplesRef = useRef<{ 
    yaw: number[]; 
    pitch: number[]; 
    mouth: number[];
    eyeOpenness: number[];
  }>({
    yaw: [],
    pitch: [],
    mouth: [],
    eyeOpenness: [],
  });

  const setClickMethod = useCallback((method: ClickMethod) => {
    setState(prev => ({ ...prev, clickMethod: method }));
  }, []);

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
    calibrationSamplesRef.current = { yaw: [], pitch: [], mouth: [], eyeOpenness: [] };
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
        // Also calculate baseline eye openness
        if (samples.eyeOpenness.length > 0) {
          const avgOpenness = samples.eyeOpenness.reduce((a, b) => a + b, 0) / samples.eyeOpenness.length;
          calibrationRef.current.blinkThreshold = avgOpenness * 0.4; // 40% of normal openness = blink
        }
        calibrationSamplesRef.current = { yaw: [], pitch: [], mouth: [], eyeOpenness: [] };
      } else if (prev.calibrationStep === 2) {
        // Save mouth threshold
        const samples = calibrationSamplesRef.current.mouth;
        if (samples.length > 0) {
          const maxMouth = Math.max(...samples);
          calibrationRef.current.mouthThreshold = maxMouth * 0.7;
        }
        calibrationSamplesRef.current = { yaw: [], pitch: [], mouth: [], eyeOpenness: [] };
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

  const calculateEyeOpenness = useCallback((face: Human.FaceResult): number => {
    if (!face.mesh || face.mesh.length < 400) return 1; // Default to open if not enough landmarks
    
    // Calculate average eye openness for both eyes
    const leftTop = face.mesh[EYE_LANDMARKS.leftTop];
    const leftBottom = face.mesh[EYE_LANDMARKS.leftBottom];
    const rightTop = face.mesh[EYE_LANDMARKS.rightTop];
    const rightBottom = face.mesh[EYE_LANDMARKS.rightBottom];
    
    if (!leftTop || !leftBottom || !rightTop || !rightBottom) return 1;
    
    const leftEyeHeight = Math.abs(leftBottom[1] - leftTop[1]);
    const rightEyeHeight = Math.abs(rightBottom[1] - rightTop[1]);
    
    // Average of both eyes
    return (leftEyeHeight + rightEyeHeight) / 2;
  }, []);

  const detectBlink = useCallback((eyeOpenness: number, threshold: number): boolean => {
    const isClosed = eyeOpenness < threshold;
    const now = Date.now();
    
    if (isClosed && !eyesWereClosedRef.current) {
      // Eyes just closed
      blinkStartTimeRef.current = now;
      eyesWereClosedRef.current = true;
    } else if (!isClosed && eyesWereClosedRef.current) {
      // Eyes just opened - check if it was a valid blink
      const blinkDuration = now - blinkStartTimeRef.current;
      eyesWereClosedRef.current = false;
      
      // A blink should be between 100ms and 400ms
      if (blinkDuration >= 100 && blinkDuration <= 400) {
        return true;
      }
    }
    
    return false;
  }, []);

  const triggerClick = useCallback((x: number, y: number, type: 'mouth' | 'blink') => {
    const now = Date.now();
    if (now - lastClickRef.current > 800) {
      lastClickRef.current = now;
      
      setState(prev => ({ 
        ...prev, 
        isMouthOpen: type === 'mouth',
        isBlinking: type === 'blink',
      }));
      
      // Trigger click on element under cursor
      const element = document.elementFromPoint(x, y);
      if (element instanceof HTMLElement) {
        element.click();
      }
      
      setTimeout(() => {
        setState(prev => ({ 
          ...prev, 
          isMouthOpen: false,
          isBlinking: false,
        }));
      }, 200);
    }
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
            
            // Calculate eye openness
            const eyeOpenness = calculateEyeOpenness(face);
            
            // During calibration, collect samples
            if (state.isCalibrating) {
              calibrationSamplesRef.current.yaw.push(yaw);
              calibrationSamplesRef.current.pitch.push(pitch);
              calibrationSamplesRef.current.eyeOpenness.push(eyeOpenness);
              
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
              
              const currentClickMethod = state.clickMethod;
              
              // Check mouth open (if enabled)
              if (currentClickMethod === 'mouth' || currentClickMethod === 'both') {
                const mouthRatio = calculateMouthOpenRatio(face);
                const isMouthOpen = mouthRatio > cal.mouthThreshold;
                
                if (isMouthOpen && !mouthWasOpenRef.current) {
                  triggerClick(filtered.x, filtered.y, 'mouth');
                }
                
                mouthWasOpenRef.current = isMouthOpen;
              }
              
              // Check blink (if enabled)
              if (currentClickMethod === 'blink' || currentClickMethod === 'both') {
                const didBlink = detectBlink(eyeOpenness, cal.blinkThreshold);
                if (didBlink) {
                  triggerClick(filtered.x, filtered.y, 'blink');
                }
              }
            }
          }
        }
      } catch (err) {
        console.error('Detection error:', err);
      }

      animationRef.current = requestAnimationFrame(detect);
    };

    detect();
  }, [state.isInitialized, state.isCalibrating, state.clickMethod, calculateMouthOpenRatio, calculateEyeOpenness, detectBlink, triggerClick]);

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
    setClickMethod,
  };
}
