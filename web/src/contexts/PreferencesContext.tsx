import { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { defaultPreferences, storageKey, type AccessibilityPreferences } from '../../../shared/preferences';
import { LocalStoragePreferencesAdapter } from '../../../shared/adapters/preferencesStorage';
import { LoadPreferencesUseCase } from '../../../shared/domain/useCases/loadPreferencesUseCase';
import { SavePreferencesUseCase } from '../../../shared/domain/useCases/savePreferencesUseCase';

const preferencesStorage = new LocalStoragePreferencesAdapter(window.localStorage);
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
    const loadPreferences = async () => {
      const loaded = await loadPreferencesUseCase.execute(storageKey);
      setPreferences(loaded);
    };
    void loadPreferences();
  }, []);

  useEffect(() => {
    const savePreferences = async () => {
      await savePreferencesUseCase.execute(storageKey, preferences);
    };
    void savePreferences();
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

export const usePreferences = () => useContext(PreferencesContext);