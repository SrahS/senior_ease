import type { Task } from '../task';
import type { TaskRepository } from '../repositories/taskRepository';

export class ListTasksUseCase {
  constructor(private repository: TaskRepository) {}

  async execute(userId: string): Promise<Task[]> {
    if (!userId) {
      throw new Error('Usuário não autenticado.');
    }

    return this.repository.list(userId);
  }
}
