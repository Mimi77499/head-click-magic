import { useEffect, useRef, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useHeadTracking, ClickMethod, ControlMode } from '@/hooks/useHeadTracking';
import { Button } from '@/components/ui/button';
import { Eye, MousePointer, Camera, Check, X, Loader2, EyeOff, Video, ArrowUpDown, Move } from 'lucide-react';

interface HeadTrackingOverlayProps {
  onClose: () => void;
}

const clickMethodLabels: Record<ClickMethod, string> = {
  mouth: 'Mouth',
  blink: 'Blink',
  both: 'Both',
};

const controlModeLabels: Record<ControlMode, string> = {
  cursor: 'Cursor',
  scroll: 'Scroll',
};

export function HeadTrackingOverlay({ onClose }: HeadTrackingOverlayProps) {
  const {
    state,
    initialize,
    startCalibration,
    nextCalibrationStep,
    startTracking,
    stopTracking,
    setClickMethod,
    toggleControlMode,
    getVideoElement,
  } = useHeadTracking();

  const [showWebcam, setShowWebcam] = useState(true);
  const webcamContainerRef = useRef<HTMLDivElement>(null);

  // Mirror the webcam video into our visible container
  useEffect(() => {
    if (!state.isInitialized || !webcamContainerRef.current) return;
    
    const video = getVideoElement();
    if (!video) return;

    // Create a visible copy of the video stream
    const visibleVideo = document.createElement('video');
    visibleVideo.srcObject = video.srcObject;
    visibleVideo.autoplay = true;
    visibleVideo.playsInline = true;
    visibleVideo.muted = true;
    visibleVideo.className = 'w-full h-full object-cover transform scale-x-[-1]';
    
    webcamContainerRef.current.innerHTML = '';
    webcamContainerRef.current.appendChild(visibleVideo);
    visibleVideo.play();

    return () => {
      if (webcamContainerRef.current) {
        webcamContainerRef.current.innerHTML = '';
      }
    };
  }, [state.isInitialized, getVideoElement]);

  const handleStart = async () => {
    if (!state.isInitialized) {
      await initialize();
    }
    startCalibration();
  };

  const handleCalibrationComplete = () => {
    // Step 1 -> Step 2: just advance
    // Step 2 -> Done: nextCalibrationStep will set isCalibrating=false, then start tracking
    if (state.calibrationStep === 2) {
      nextCalibrationStep(); // This completes calibration
      startTracking(); // Start tracking immediately after
    } else {
      nextCalibrationStep();
    }
  };

  const cycleClickMethod = () => {
    const methods: ClickMethod[] = ['both', 'mouth', 'blink'];
    const currentIndex = methods.indexOf(state.clickMethod);
    const nextIndex = (currentIndex + 1) % methods.length;
    setClickMethod(methods[nextIndex]);
  };

  const isClicking = state.isMouthOpen || state.isBlinking;

  return (
    <>
      {/* Webcam Preview */}
      {state.isInitialized && showWebcam && (
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.8 }}
          className="fixed bottom-24 right-6 z-50 overflow-hidden rounded-lg shadow-2xl border-2 border-gold-accent"
          style={{ width: 200, height: 150 }}
        >
          <div ref={webcamContainerRef} className="w-full h-full bg-muted" />
          <button
            onClick={() => setShowWebcam(false)}
            className="absolute top-2 right-2 w-6 h-6 bg-background/80 rounded-full flex items-center justify-center hover:bg-background transition-colors"
          >
            <X className="w-3 h-3" />
          </button>
          {/* Face detection indicator */}
          <div className="absolute bottom-2 left-2 flex items-center gap-1.5">
            <div className={`w-2 h-2 rounded-full ${state.isTracking ? 'bg-green-500 animate-pulse' : 'bg-yellow-500'}`} />
            <span className="text-[10px] text-white bg-black/50 px-1.5 py-0.5 rounded">
              {state.isTracking ? 'Tracking' : 'Ready'}
            </span>
          </div>
        </motion.div>
      )}

      {/* Show webcam button if hidden */}
      {state.isInitialized && !showWebcam && (
        <motion.button
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          onClick={() => setShowWebcam(true)}
          className="fixed bottom-24 right-6 z-50 w-12 h-12 bg-foreground text-background rounded-full flex items-center justify-center shadow-lg hover:bg-foreground/90 transition-colors"
        >
          <Video className="w-5 h-5" />
        </motion.button>
      )}

      {/* Virtual Cursor - only show in cursor mode */}
      {state.isTracking && state.controlMode === 'cursor' && (
        <motion.div
          className="custom-cursor"
          style={{
            width: isClicking ? 60 : 40,
            height: isClicking ? 60 : 40,
            left: state.cursorPosition.x,
            top: state.cursorPosition.y,
            transform: 'translate(-50%, -50%)',
          }}
          animate={{
            scale: isClicking ? 1.5 : 1,
          }}
          transition={{ duration: 0.1 }}
        />
      )}

      {/* Scroll Indicator - show in scroll mode */}
      {state.isTracking && state.controlMode === 'scroll' && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-[9998] pointer-events-none"
        >
          <div className="flex flex-col items-center gap-2">
            <motion.div 
              animate={{ 
                y: state.scrollDirection === 'up' ? -10 : 0,
                opacity: state.scrollDirection === 'up' ? 1 : 0.3 
              }}
              className="w-0 h-0 border-l-[12px] border-r-[12px] border-b-[16px] border-l-transparent border-r-transparent border-b-gold-accent"
            />
            <div className="w-1 h-8 bg-gold-accent/50 rounded-full" />
            <motion.div 
              animate={{ 
                y: state.scrollDirection === 'down' ? 10 : 0,
                opacity: state.scrollDirection === 'down' ? 1 : 0.3 
              }}
              className="w-0 h-0 border-l-[12px] border-r-[12px] border-t-[16px] border-l-transparent border-r-transparent border-t-gold-accent"
            />
          </div>
          {isClicking && (
            <div className="absolute top-full mt-4 left-1/2 -translate-x-1/2 bg-gold-accent text-background px-3 py-1 text-xs uppercase tracking-wider font-medium whitespace-nowrap">
              Click!
            </div>
          )}
        </motion.div>
      )}

      {/* Click Indicator - cursor mode only */}
      <AnimatePresence mode="wait">
        {state.isTracking && state.controlMode === 'cursor' && isClicking && (
          <motion.div
            key="click-indicator"
            initial={{ opacity: 0, scale: 0.5 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.5 }}
            className="fixed z-[9999] pointer-events-none"
            style={{
              left: state.cursorPosition.x,
              top: state.cursorPosition.y - 60,
              transform: 'translateX(-50%)',
            }}
          >
            <div className="bg-gold-accent text-background px-3 py-1 text-xs uppercase tracking-wider font-medium">
              {state.isBlinking ? 'Blink!' : 'Click!'}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Control Panel */}
      <motion.div
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: 50 }}
        className="control-panel flex items-center gap-4 md:gap-6"
      >
        <div className="flex items-center gap-3">
          <Camera className="w-4 h-4" />
          <span className="text-xs uppercase tracking-wider hidden sm:inline">
            {!state.isInitialized && 'Ready'}
            {state.isInitialized && !state.isCalibrating && !state.isTracking && 'Initialized'}
            {state.isCalibrating && `Calibrating (${state.calibrationStep}/2)`}
            {state.isTracking && 'Active'}
          </span>
        </div>

        <div className="w-px h-4 bg-primary-foreground/30" />

        {!state.isTracking && !state.isCalibrating && (
          <Button
            variant="ghost"
            size="sm"
            onClick={handleStart}
            className="text-primary-foreground hover:text-primary-foreground/80 hover:bg-transparent"
          >
            <Eye className="w-4 h-4 mr-2" />
            {state.isInitialized ? 'Calibrate' : 'Start'}
          </Button>
        )}

        {state.isCalibrating && (
          <Button
            variant="ghost"
            size="sm"
            onClick={handleCalibrationComplete}
            className="text-primary-foreground hover:text-primary-foreground/80 hover:bg-transparent"
          >
            <Check className="w-4 h-4 mr-2" />
            {state.calibrationStep === 1 ? 'Set Center' : 'Set Mouth'}
          </Button>
        )}

        {state.isTracking && (
          <>
            {/* Control Mode Toggle (Cursor/Scroll) */}
            <Button
              variant="ghost"
              size="sm"
              onClick={toggleControlMode}
              className="text-primary-foreground hover:text-primary-foreground/80 hover:bg-transparent"
            >
              {state.controlMode === 'cursor' ? (
                <Move className="w-4 h-4 mr-2" />
              ) : (
                <ArrowUpDown className="w-4 h-4 mr-2" />
              )}
              <span className="text-xs">{controlModeLabels[state.controlMode]}</span>
            </Button>

            {/* Click Method Toggle */}
            <Button
              variant="ghost"
              size="sm"
              onClick={cycleClickMethod}
              className="text-primary-foreground hover:text-primary-foreground/80 hover:bg-transparent"
            >
              <EyeOff className="w-4 h-4 mr-2" />
              <span className="text-xs">{clickMethodLabels[state.clickMethod]}</span>
            </Button>

            <div className="w-px h-4 bg-primary-foreground/30" />

            <Button
              variant="ghost"
              size="sm"
              onClick={stopTracking}
              className="text-primary-foreground hover:text-primary-foreground/80 hover:bg-transparent"
            >
              <MousePointer className="w-4 h-4 mr-2" />
              Pause
            </Button>
          </>
        )}

        <Button
          variant="ghost"
          size="icon"
          onClick={onClose}
          className="text-primary-foreground hover:text-primary-foreground/80 hover:bg-transparent"
        >
          <X className="w-4 h-4" />
        </Button>
      </motion.div>

      {/* Calibration Modal */}
      <AnimatePresence mode="wait">
        {state.isCalibrating && (
          <motion.div
            key="calibration-modal"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-foreground/80 backdrop-blur-sm z-40 flex items-center justify-center"
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-background p-12 max-w-md text-center mx-4"
            >
              <div className="mb-8">
                <Loader2 className="w-12 h-12 mx-auto mb-6 animate-spin text-gold-accent" />
                <h3 className="font-display text-2xl mb-4">
                  {state.calibrationStep === 1 
                    ? 'Look Straight Ahead' 
                    : 'Open Your Mouth Wide'}
                </h3>
                <p className="text-muted-foreground">
                  {state.calibrationStep === 1
                    ? 'Keep your head centered and look directly at the camera. This sets your neutral position and eye baseline.'
                    : 'Open your mouth as wide as comfortable. This calibrates the click threshold.'}
                </p>
                {state.calibrationStep === 1 && (
                  <p className="text-muted-foreground/70 text-sm mt-4">
                    Keep your eyes open normally for blink detection calibration.
                  </p>
                )}
              </div>
              <Button variant="hero" onClick={handleCalibrationComplete}>
                <Check className="w-4 h-4 mr-2" />
                Confirm
              </Button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Error Display */}
      {state.error && (
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="fixed top-6 left-1/2 -translate-x-1/2 z-50 bg-destructive text-destructive-foreground px-6 py-3 rounded-sm"
        >
          {state.error}
        </motion.div>
      )}

      {/* Instructions Tooltip - shown when tracking is active */}
      {state.isTracking && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="fixed top-24 left-1/2 -translate-x-1/2 z-40 bg-background/90 backdrop-blur-sm px-6 py-3 text-center max-w-md"
        >
          <p className="text-sm text-muted-foreground">
            {state.controlMode === 'cursor' ? (
              <>
                Move your head to control cursor • {' '}
                {state.clickMethod === 'mouth' && 'Open mouth to click links'}
                {state.clickMethod === 'blink' && 'Blink to click links'}
                {state.clickMethod === 'both' && 'Blink or open mouth to click links'}
              </>
            ) : (
              <>
                Look up/down to scroll • {' '}
                {state.clickMethod === 'mouth' && 'Open mouth to click center element'}
                {state.clickMethod === 'blink' && 'Blink to click center element'}
                {state.clickMethod === 'both' && 'Blink or open mouth to click center element'}
              </>
            )}
          </p>
        </motion.div>
      )}
    </>
  );
}