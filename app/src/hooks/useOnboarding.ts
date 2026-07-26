import { useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

const ONBOARDING_STORAGE_KEY = 'seniorease.mobile.onboarding';

export function useOnboarding(appendHistory: (title: string, detail: string) => void) {
  const [showOnboarding, setShowOnboarding] = useState(true);
  const [onboardingStep, setOnboardingStep] = useState(0);

  const [guidedTaskId, setGuidedTaskId] = useState<number | null>(null);
  const [guidedStep, setGuidedStep] = useState(0);

  useEffect(() => {
    const loadOnboarding = async () => {
      const stored = await AsyncStorage.getItem(ONBOARDING_STORAGE_KEY);
      if (stored !== null) setShowOnboarding(JSON.parse(stored));
    };
    loadOnboarding();
  }, []);

  useEffect(() => {
    AsyncStorage.setItem(ONBOARDING_STORAGE_KEY, JSON.stringify(showOnboarding));
  }, [showOnboarding]);

  const handleOnboardingNext = () => {
    if (onboardingStep < 2) {
      setOnboardingStep(prev => prev + 1);
    } else {
      setShowOnboarding(false);
      appendHistory('Boas-vindas concluídas', 'O guia inicial foi encerrado com calma.');
    }
  };

  const startGuidedFlow = (taskId: number) => {
    setGuidedTaskId(taskId);
    setGuidedStep(1);
  };

  const advanceGuidedFlow = () => {
    if (guidedStep < 3) {
      setGuidedStep(prev => prev + 1);
    } else {
      cancelGuidedFlow();
    }
  };

  const cancelGuidedFlow = () => {
    setGuidedTaskId(null);
    setGuidedStep(0);
  };

  return {
    showOnboarding,
    onboardingStep,
    handleOnboardingNext,
    guidedTaskId,
    guidedStep,
    startGuidedFlow,
    advanceGuidedFlow,
    cancelGuidedFlow
  };
}