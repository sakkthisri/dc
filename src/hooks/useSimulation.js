import { useState, useEffect, useCallback, useRef } from 'react';

export function useSimulation(initialSteps = []) {
  const [steps, setSteps] = useState(initialSteps);
  const [currentStep, setCurrentStep] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [speed, setSpeed] = useState(1);
  const timerRef = useRef(null);

  // Update steps if initialSteps change
  useEffect(() => {
    setSteps(initialSteps);
    setCurrentStep(0);
    setIsPlaying(false);
  }, [initialSteps]);

  const totalSteps = steps.length;
  const isAtEnd = currentStep >= totalSteps - 1;
  const isAtStart = currentStep === 0;

  const activeState = steps[currentStep] || {
    nodes: [],
    messages: [],
    events: [],
    explanation: 'Simulation ready.',
    codeLine: null
  };

  const nextStep = useCallback(() => {
    setCurrentStep(prev => {
      if (prev < totalSteps - 1) return prev + 1;
      setIsPlaying(false);
      return prev;
    });
  }, [totalSteps]);

  const prevStep = useCallback(() => {
    setCurrentStep(prev => (prev > 0 ? prev - 1 : 0));
  }, []);

  const goToStep = useCallback((index) => {
    if (index >= 0 && index < totalSteps) {
      setCurrentStep(index);
    }
  }, [totalSteps]);

  const togglePlay = useCallback(() => {
    if (isAtEnd) {
      setCurrentStep(0);
      setIsPlaying(true);
    } else {
      setIsPlaying(prev => !prev);
    }
  }, [isAtEnd]);

  const pause = useCallback(() => {
    setIsPlaying(false);
  }, []);

  const reset = useCallback(() => {
    setIsPlaying(false);
    setCurrentStep(0);
  }, []);

  // Timer loop for auto playback
  useEffect(() => {
    if (isPlaying) {
      const delay = Math.round(1500 / speed);
      timerRef.current = setInterval(() => {
        setCurrentStep(prev => {
          if (prev < totalSteps - 1) {
            return prev + 1;
          } else {
            setIsPlaying(false);
            return prev;
          }
        });
      }, delay);
    } else {
      if (timerRef.current) clearInterval(timerRef.current);
    }

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [isPlaying, speed, totalSteps]);

  return {
    steps,
    setSteps,
    currentStep,
    totalSteps,
    activeState,
    isPlaying,
    speed,
    setSpeed,
    isAtStart,
    isAtEnd,
    nextStep,
    prevStep,
    goToStep,
    togglePlay,
    pause,
    reset
  };
}
