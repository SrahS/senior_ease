import type { CreateTaskInput, Task } from '../task';
import type { TaskRepository } from '../repositories/taskRepository';

export class CreateTaskUseCase {
  constructor(private repository: TaskRepository) {}

  async execute(userId: string, input: CreateTaskInput): Promise<Task> {
    const title = input.title.trim();

    if (!userId) {
      throw new Error('Usuário não autenticado.');
    }

    if (!title) {
      throw new Error('O título da tarefa é obrigatório.');
    }

    return this.repository.create(userId, {
      title,
      detail: input.detail.trim(),
      important: input.important,
    });
  }
}
