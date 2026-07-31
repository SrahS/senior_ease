import { useCallback, useEffect, useMemo, useState } from 'react';
import type { TaskRepository } from '../../../shared/domain/repositories/taskRepository';
import type { Task } from '../../../shared/domain/task';
import { CreateTaskUseCase } from '../../../shared/domain/useCases/createTaskUseCase';
import { ListTasksUseCase } from '../../../shared/domain/useCases/listTasksUseCase';
import { SetTaskCompletionUseCase } from '../../../shared/domain/useCases/setTaskCompletionUseCase';

type UseTasksOptions = {
  userId: string | null;
  repository: TaskRepository | null;
};

function messageFrom(error: unknown): string {
  return error instanceof Error ? error.message : 'Não foi possível atualizar as tarefas.';
}

export function useTasks({ userId, repository }: UseTasksOptions) {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const useCases = useMemo(
    () =>
      repository
        ? {
            create: new CreateTaskUseCase(repository),
            list: new ListTasksUseCase(repository),
            setCompletion: new SetTaskCompletionUseCase(repository),
          }
        : null,
    [repository],
  );

  useEffect(() => {
    let isCurrent = true;

    if (!userId || !useCases) {
      setTasks([]);
      setError(null);
      setIsLoading(false);
      return () => {
        isCurrent = false;
      };
    }

    setIsLoading(true);
    setError(null);

    useCases.list.execute(userId)
      .then((loadedTasks) => {
        if (isCurrent) {
          setTasks(loadedTasks);
        }
      })
      .catch((loadError: unknown) => {
        if (isCurrent) {
          setError(messageFrom(loadError));
          setTasks([]);
        }
      })
      .finally(() => {
        if (isCurrent) {
          setIsLoading(false);
        }
      });

    return () => {
      isCurrent = false;
    };
  }, [userId, useCases]);

  const createTask = useCallback(async (title: string, detail: string, important: boolean) => {
    if (!userId || !useCases) {
      const authenticationError = new Error('Usuário não autenticado.');
      setError(authenticationError.message);
      throw authenticationError;
    }

    try {
      setError(null);
      const task = await useCases.create.execute(userId, { title, detail, important });
      setTasks((currentTasks) => [task, ...currentTasks]);
      return task;
    } catch (createError) {
      setError(messageFrom(createError));
      throw createError;
    }
  }, [userId, useCases]);

  const toggleTask = useCallback(async (taskId: string) => {
    if (!userId || !useCases) {
      const authenticationError = new Error('Usuário não autenticado.');
      setError(authenticationError.message);
      throw authenticationError;
    }

    const task = tasks.find((currentTask) => currentTask.id === taskId);
    if (!task) {
      const missingTaskError = new Error('Tarefa não encontrada.');
      setError(missingTaskError.message);
      throw missingTaskError;
    }

    try {
      setError(null);
      const completed = !task.completed;
      await useCases.setCompletion.execute(userId, taskId, completed);
      setTasks((currentTasks) =>
        currentTasks.map((currentTask) =>
          currentTask.id === taskId
            ? { ...currentTask, completed, updatedAt: new Date() }
            : currentTask,
        ),
      );
    } catch (toggleError) {
      setError(messageFrom(toggleError));
      throw toggleError;
    }
  }, [tasks, userId, useCases]);

  const completedCount = useMemo(
    () => tasks.filter((task) => task.completed).length,
    [tasks],
  );

  return {
    tasks,
    completedCount,
    totalCount: tasks.length,
    isLoading,
    error,
    createTask,
    toggleTask,
  };
}