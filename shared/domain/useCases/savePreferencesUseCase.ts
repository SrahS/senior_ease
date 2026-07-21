import { type AccessibilityPreferences, mergePreferences } from '../../preferences';
import { type PreferencesStoragePort } from '../../adapters/preferencesStorage';

export class SavePreferencesUseCase {
  constructor(private storage: PreferencesStoragePort) {}

  async execute(key: string, preferences: Partial<AccessibilityPreferences>) {
    const merged = mergePreferences(preferences);
    await this.storage.setItem(key, JSON.stringify(merged));
    return merged;
  }
}
