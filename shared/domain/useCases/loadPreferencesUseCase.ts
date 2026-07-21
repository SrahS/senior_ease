import { type AccessibilityPreferences, mergePreferences } from '../../preferences';
import { type PreferencesStoragePort } from '../../adapters/preferencesStorage';

export class LoadPreferencesUseCase {
  constructor(private storage: PreferencesStoragePort) {}

  async execute(key: string): Promise<AccessibilityPreferences> {
    const raw = await this.storage.getItem(key);
    if (!raw) {
      return mergePreferences({});
    }

    const parsed = JSON.parse(raw) as Partial<AccessibilityPreferences>;
    return mergePreferences(parsed);
  }
}
