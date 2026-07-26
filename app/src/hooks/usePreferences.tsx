import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { defaultPreferences, storageKey, type AccessibilityPreferences } from '../../../shared/preferences';
import { AsyncStoragePreferencesAdapter } from '../../../shared/adapters/preferencesStorage';
import { LoadPreferencesUseCase } from '../../../shared/domain/useCases/loadPreferencesUseCase';
import { SavePreferencesUseCase } from '../../../shared/domain/useCases/savePreferencesUseCase';

const preferencesStorage = new AsyncStoragePreferencesAdapter(AsyncStorage);
const loadPreferencesUseCase = new LoadPreferencesUseCase(preferencesStorage);
const savePreferencesUseCase = new SavePreferencesUseCase(preferencesStorage);


interface PreferencesContextData {
  preferences: AccessibilityPreferences;
  updatePreference: <K extends keyof AccessibilityPreferences>(key: K, value: AccessibilityPreferences[K]) => void;
}


const PreferencesContext = createContext<PreferencesContextData>({} as PreferencesContextData);


export function PreferencesProvider({ children }: { children: ReactNode }) {
  const [preferences, setPreferences] = useState<AccessibilityPreferences>(defaultPreferences);

  useEffect(() => {
    const loadData = async () => {
      const loaded = await loadPreferencesUseCase.execute(storageKey);
      setPreferences(loaded);
    };
    loadData();
  }, []);

  useEffect(() => {
    savePreferencesUseCase.execute(storageKey, preferences);
  }, [preferences]);

  const updatePreference = <K extends keyof AccessibilityPreferences>(key: K, value: AccessibilityPreferences[K]) => {
    setPreferences(prev => ({ ...prev, [key]: value }));
  };

  return (
    <PreferencesContext.Provider value={{ preferences, updatePreference }}>
      {children}
    </PreferencesContext.Provider>
  );
}


export function usePreferences() {
  return useContext(PreferencesContext);
}