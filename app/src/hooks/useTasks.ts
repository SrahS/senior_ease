import { useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Task } from '../types';

const TASKS_STORAGE_KEY = 'seniorease.mobile.tasks';

const starterTasks: Task[] = [
  { id: 1, title: 'Ler e-mail da faculdade', detail: 'Abrir confirmação e responder', completed: false },
  { id: 2, title: 'Pagar conta da água', detail: 'Confirmar valor antes de pagar', completed: true },
  { id: 3, title: 'Entrar no encontro virtual', detail: 'Abrir link e entrar 10 minutos antes', completed: false },
];

export function useTasks() {
  const [tasks, setTasks] = useState<Task[]>(starterTasks);

  useEffect(() => {
    const loadTasks = async () => {
      const stored = await AsyncStorage.getItem(TASKS_STORAGE_KEY);
      if (stored) setTasks(JSON.parse(stored));
    };
    loadTasks();
  }, []);

  useEffect(() => {
    AsyncStorage.setItem(TASKS_STORAGE_KEY, JSON.stringify(tasks));
  }, [tasks]);

  const toggleTask = (taskId: number) => {
    setTasks(prev => prev.map(item => 
      item.id === taskId ? { ...item, completed: !item.completed } : item
    ));
  };

  const completedCount = tasks.filter(t => t.completed).length;

  return { tasks, toggleTask, completedCount };
}