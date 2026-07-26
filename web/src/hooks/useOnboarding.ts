import { useState, useEffect } from 'react';
import { AnnounceActionUseCase } from '../../../shared/domain/useCases/announceActionUseCase';

const onboardingStorageKey = 'seniorease.onboarding.completed';
const announceActionUseCase = new AnnounceActionUseCase();

export function useOnboarding() {
  // Estados do Boas-vindas
  const [showOnboarding, setShowOnboarding] = useState(() => window.localStorage.getItem(onboardingStorageKey) !== 'true');
  const [onboardingStep, setOnboardingStep] = useState(0);

  // Estados do Guia de Tarefas (Guided Flow)
  const [guidedTaskId, setGuidedTaskId] = useState<number | null>(null);
  const [guidedStep, setGuidedStep] = useState(0);

  // Efeito para salvar no localStorage assim que o usuário termina o tutorial
  useEffect(() => {
    window.localStorage.setItem(onboardingStorageKey, showOnboarding ? 'false' : 'true');
  }, [showOnboarding]);

  const handleNextStep = () => {
    if (onboardingStep < 2) {
      setOnboardingStep(prev => prev + 1);
    } else {
      setShowOnboarding(false);
      setOnboardingStep(0);
      announceActionUseCase.execute('Primeira visita encerrada. Você já pode começar a usar o aplicativo.');
    }
  };

  const startGuidedFlow = (id: number, taskTitle: string) => {
    setGuidedTaskId(id);
    setGuidedStep(1);
    announceActionUseCase.execute(`Guia iniciado para a tarefa: ${taskTitle}`);
  };

  const advanceGuidedFlow = () => {
    if (guidedStep < 3) {
      setGuidedStep(prev => prev + 1);
    } else {
      cancelGuidedFlow();
      announceActionUseCase.execute('Guia de tarefa concluído.');
    }
  };

  const cancelGuidedFlow = () => {
    setGuidedTaskId(null);
    setGuidedStep(0);
  };

  return {
    showOnboarding,
    onboardingStep,
    handleNextStep,
    guidedTaskId,
    guidedStep,
    startGuidedFlow,
    advanceGuidedFlow,
    cancelGuidedFlow
  };
}