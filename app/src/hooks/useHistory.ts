import { useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { HistoryItem } from '../types';

const HISTORY_STORAGE_KEY = 'seniorease.mobile.history';

const starterHistory: HistoryItem[] = [
  { id: 1, title: 'Olá, Alissin!', detail: 'Seu perfil foi preparado com configurações simples.' },
  { id: 2, title: 'Tarefa concluída', detail: 'Você marcou a conta da água como resolvida.' },
];

export function useHistory() {
  const [history, setHistory] = useState<HistoryItem[]>(starterHistory);

  useEffect(() => {
    const loadHistory = async () => {
      const stored = await AsyncStorage.getItem(HISTORY_STORAGE_KEY);
      if (stored) setHistory(JSON.parse(stored));
    };
    loadHistory();
  }, []);

  useEffect(() => {
    AsyncStorage.setItem(HISTORY_STORAGE_KEY, JSON.stringify(history));
  }, [history]);

  const appendHistory = (title: string, detail: string) => {
    setHistory(prev => [{ id: Date.now(), title, detail }, ...prev].slice(0, 6));
  };

  return { history, appendHistory };
}