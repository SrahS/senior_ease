import type { TaskRepository } from '../repositories/taskRepository';

export class SoftDeleteTaskUseCase {
  constructor(private repository: TaskRepository) {}

  async execute(userId: string, taskId: string): Promise<void> {
    if (!userId) {
      throw new Error('Usuário não autenticado.');
    }

    await this.repository.softDelete(userId, taskId);
  }
}
