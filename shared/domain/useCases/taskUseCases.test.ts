import { describe, expect, it } from 'vitest';
import type { CreateTaskInput, Task } from '../task';
import type { TaskRepository } from '../repositories/taskRepository';
import { CreateTaskUseCase } from './createTaskUseCase';
import { ListTasksUseCase } from './listTasksUseCase';
import { SetTaskCompletionUseCase } from './setTaskCompletionUseCase';

class FakeTaskRepository implements TaskRepository {
  private tasksByUser = new Map<string, Task[]>();
  shouldFailToCreate = false;
  lastCreateUserId: string | null = null;
  lastCompletionChange: { userId: string; taskId: string; completed: boolean } | null = null;

  async create(userId: string, input: CreateTaskInput): Promise<Task> {
    this.lastCreateUserId = userId;

    if (this.shouldFailToCreate) {
      throw new Error('Falha ao persistir.');
    }

    const now = new Date();
    const task: Task = {
      id: `${userId}-${this.tasksByUser.get(userId)?.length ?? 0}`,
      title: input.title,
      detail: input.detail,
      completed: false,
      important: input.important,
      createdAt: now,
      updatedAt: now,
    };
    const userTasks = this.tasksByUser.get(userId) ?? [];
    this.tasksByUser.set(userId, [...userTasks, task]);
    return task;
  }

  async list(userId: string): Promise<Task[]> {
    return this.tasksByUser.get(userId) ?? [];
  }

  async setCompleted(userId: string, taskId: string, completed: boolean): Promise<void> {
    this.lastCompletionChange = { userId, taskId, completed };
  }
}

describe('task use cases', () => {
  it('creates a valid task associated with the authenticated user', async () => {
    const repository = new FakeTaskRepository();
    const useCase = new CreateTaskUseCase(repository);

    const task = await useCase.execute('user-a', {
      title: '  Tomar remédio  ',
      detail: '  Às 15h  ',
      important: true,
    });

    expect(task.title).toBe('Tomar remédio');
    expect(task.detail).toBe('Às 15h');
    expect(task.important).toBe(true);
    expect(repository.lastCreateUserId).toBe('user-a');
  });

  it('creates an unmarked task as not important', async () => {
    const repository = new FakeTaskRepository();
    const useCase = new CreateTaskUseCase(repository);

    const task = await useCase.execute('user-a', {
      title: 'Ler um livro',
      detail: '',
      important: false,
    });

    expect(task.important).toBe(false);
  });

  it('rejects an empty title without persisting a task', async () => {
    const repository = new FakeTaskRepository();
    const useCase = new CreateTaskUseCase(repository);

    await expect(useCase.execute('user-a', { title: '   ', detail: '', important: false }))
      .rejects.toThrow('O título da tarefa é obrigatório.');
    expect(repository.lastCreateUserId).toBeNull();
  });

  it('propagates a persistence failure', async () => {
    const repository = new FakeTaskRepository();
    repository.shouldFailToCreate = true;
    const useCase = new CreateTaskUseCase(repository);

    await expect(useCase.execute('user-a', { title: 'Pagar conta', detail: '', important: false }))
      .rejects.toThrow('Falha ao persistir.');
  });

  it('changes completion for the correct user and task', async () => {
    const repository = new FakeTaskRepository();
    const useCase = new SetTaskCompletionUseCase(repository);

    await useCase.execute('user-a', 'task-1', true);

    expect(repository.lastCompletionChange).toEqual({
      userId: 'user-a',
      taskId: 'task-1',
      completed: true,
    });
  });

  it('lists tasks isolated by user', async () => {
    const repository = new FakeTaskRepository();
    const createTask = new CreateTaskUseCase(repository);
    const listTasks = new ListTasksUseCase(repository);
    await createTask.execute('user-a', { title: 'Tarefa da Ana', detail: '', important: false });
    await createTask.execute('user-b', { title: 'Tarefa do Bruno', detail: '', important: false });

    await expect(listTasks.execute('user-a')).resolves.toMatchObject([
      { title: 'Tarefa da Ana' },
    ]);
    await expect(listTasks.execute('user-b')).resolves.toMatchObject([
      { title: 'Tarefa do Bruno' },
    ]);
  });
});
