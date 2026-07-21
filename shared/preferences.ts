export type AccessibilityPreferences = {
  fontScale: number;
  contrast: 'padrão' | 'alto';
  spacing: 'compacto' | 'amplo';
  simplifiedMode: boolean;
  visualFeedback: boolean;
  extraConfirmation: boolean;
  reminders: boolean;
  navigationMode: 'simplificado' | 'padrão';
  notifications: boolean;
  warmMode: boolean;
  userName: string;
  userRole: string;
};

export const defaultPreferences: AccessibilityPreferences = {
  fontScale: 1,
  contrast: 'padrão',
  spacing: 'amplo',
  simplifiedMode: true,
  visualFeedback: true,
  extraConfirmation: true,
  reminders: true,
  navigationMode: 'simplificado',
  notifications: true,
  warmMode: true,
  userName: 'Maria da Silva',
  userRole: 'Estudante',
};

export const storageKey = 'seniorease.preferences';

export function mergePreferences(input: Partial<AccessibilityPreferences>): AccessibilityPreferences {
  return { ...defaultPreferences, ...input };
}
