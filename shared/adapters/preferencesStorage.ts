export interface PreferencesStoragePort {
  getItem(key: string): string | null | Promise<string | null>;
  setItem(key: string, value: string): void | Promise<void>;
}

export class LocalStoragePreferencesAdapter implements PreferencesStoragePort {
  constructor(private storage: Storage) {}

  getItem(key: string) {
    return this.storage.getItem(key);
  }

  setItem(key: string, value: string) {
    this.storage.setItem(key, value);
  }
}

export class AsyncStoragePreferencesAdapter implements PreferencesStoragePort {
  constructor(private storage: { getItem: (key: string) => Promise<string | null> | string | null; setItem: (key: string, value: string) => Promise<void> | void }) {}

  async getItem(key: string) {
    return this.storage.getItem(key);
  }

  async setItem(key: string, value: string) {
    await this.storage.setItem(key, value);
  }
}
