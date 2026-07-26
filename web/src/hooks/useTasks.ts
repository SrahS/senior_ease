import { useState, useMemo } from 'react';

export type Task = { id: number; title: string; detail: string; completed: boolean; };

const starterTasks: Task[] = [
  { id: 1, title: 'Ler e-mail da faculdade', detail: 'Abrir confirmação e responder', completed: false },
  { id: 2, title: 'Pagar conta da água', detail: 'Confirmar valor antes de pagar', completed: true },
  { id: 3, title: 'Entrar no encontro virtual', detail: 'Abrir link e entrar 10 minutos antes', completed: false },
];

export function useTasks() {
  const [tasks, setTasks] = useState<Task[]>(starterTasks);

  const completedCount = useMemo(() => tasks.filter(t => t.completed).length, [tasks]);
  const totalCount = tasks.length;

  const toggleTaskState = (id: number) => {
    setTasks(prev => prev.map(t => t.id === id ? { ...t, completed: !t.completed } : t));
  };

  const addTask = (title: string, detail: string) => {
    const newTask: Task = {
      id: Date.now(),
      title,
      detail,
      completed: false,
    };
    setTasks(prev => [...prev, newTask]);
  };

  return { tasks, completedCount, totalCount, toggleTaskState, addTask };
}