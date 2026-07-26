import { useState } from 'react';

export type HistoryItem = { id: number; title: string; detail: string; };

const starterHistory: HistoryItem[] = [
  { id: 1, title: 'Olá!', detail: 'Seu perfil foi preparado com configurações simples.' },
];

export function useHistory() {
  const [history, setHistory] = useState<HistoryItem[]>(starterHistory);

  const appendHistory = (title: string, detail: string) => {
    setHistory(prev => [{ id: Date.now(), title, detail }, ...prev].slice(0, 4));
  };

  return { history, appendHistory };
}