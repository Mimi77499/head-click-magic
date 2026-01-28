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

export type ControlMode = 'cursor' | 'scroll';

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
  controlMode: ControlMode;
  scrollDirection: 'up' | 'down' | 'none';
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
    controlMode: 'cursor',
    scrollDirection: 'none',
  });

  const controlModeRef = useRef<ControlMode>('cursor');
  const scrollSpeedRef = useRef<number>(8); // pixels per frame

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
  const isCalibratingRef = useRef<boolean>(false);
  const clickMethodRef = useRef<ClickMethod>('both');
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
    clickMethodRef.current = method;
    setState(prev => ({ ...prev, clickMethod: method }));
  }, []);

  const setControlMode = useCallback((mode: ControlMode) => {
    controlModeRef.current = mode;
    setState(prev => ({ ...prev, controlMode: mode }));
  }, []);

  const toggleControlMode = useCallback(() => {
    const newMode = controlModeRef.current === 'cursor' ? 'scroll' : 'cursor';
    controlModeRef.current = newMode;
    setState(prev => ({ ...prev, controlMode: newMode }));
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
      // Keep video accessible but hidden from normal flow
      video.style.position = 'fixed';
      video.style.opacity = '0';
      video.style.pointerEvents = 'none';
      video.style.zIndex = '-1';
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

  const getVideoElement = useCallback((): HTMLVideoElement | null => {
    return videoRef.current;
  }, []);

  const startCalibration = useCallback(() => {
    calibrationSamplesRef.current = { yaw: [], pitch: [], mouth: [], eyeOpenness: [] };
    isCalibratingRef.current = true;
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
        isCalibratingRef.current = false;
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
        // Check if it's a link or button for navigation
        const linkElement = element.closest('a');
        const buttonElement = element.closest('button');
        
        if (linkElement && linkElement.href) {
          // Handle link navigation
          const href = linkElement.getAttribute('href');
          if (href) {
            // For internal links, use the router by clicking
            linkElement.click();
          }
        } else if (buttonElement) {
          buttonElement.click();
        } else {
          element.click();
        }
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
      if (!humanRef.current || !videoRef.current) return;

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
            if (isCalibratingRef.current) {
              calibrationSamplesRef.current.yaw.push(yaw);
              calibrationSamplesRef.current.pitch.push(pitch);
              calibrationSamplesRef.current.eyeOpenness.push(eyeOpenness);
              
              const mouthRatio = calculateMouthOpenRatio(face);
              calibrationSamplesRef.current.mouth.push(mouthRatio);
            } else {
              // Normal tracking
              const cal = calibrationRef.current;
              const currentMode = controlModeRef.current;
              
              if (currentMode === 'cursor') {
                // CURSOR MODE - Move cursor with head
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
                  scrollDirection: 'none',
                }));
                
                const currentClickMethod = clickMethodRef.current;
                
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
              } else {
                // SCROLL MODE - Scroll page with head pitch
                const pitchDelta = pitch - cal.centerPitch;
                const deadZone = 3; // degrees of dead zone
                const scrollSpeed = scrollSpeedRef.current;
                
                let scrollDirection: 'up' | 'down' | 'none' = 'none';
                
                if (pitchDelta > deadZone) {
                  // Looking down - scroll down
                  window.scrollBy(0, scrollSpeed * (pitchDelta - deadZone) * 0.5);
                  scrollDirection = 'down';
                } else if (pitchDelta < -deadZone) {
                  // Looking up - scroll up
                  window.scrollBy(0, scrollSpeed * (pitchDelta + deadZone) * 0.5);
                  scrollDirection = 'up';
                }
                
                setState(prev => ({
                  ...prev,
                  scrollDirection,
                }));
                
                // Still allow clicking in scroll mode
                const currentClickMethod = clickMethodRef.current;
                const cursorX = window.innerWidth / 2;
                const cursorY = window.innerHeight / 2;
                
                if (currentClickMethod === 'mouth' || currentClickMethod === 'both') {
                  const mouthRatio = calculateMouthOpenRatio(face);
                  const isMouthOpen = mouthRatio > cal.mouthThreshold;
                  
                  if (isMouthOpen && !mouthWasOpenRef.current) {
                    triggerClick(cursorX, cursorY, 'mouth');
                  }
                  
                  mouthWasOpenRef.current = isMouthOpen;
                }
                
                if (currentClickMethod === 'blink' || currentClickMethod === 'both') {
                  const didBlink = detectBlink(eyeOpenness, cal.blinkThreshold);
                  if (didBlink) {
                    triggerClick(cursorX, cursorY, 'blink');
                  }
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
  }, [calculateMouthOpenRatio, calculateEyeOpenness, detectBlink, triggerClick]);

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
    setControlMode,
    toggleControlMode,
    getVideoElement,
  };
}
