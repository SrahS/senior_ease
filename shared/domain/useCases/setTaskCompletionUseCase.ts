import type { TaskRepository } from '../repositories/taskRepository';

export class SetTaskCompletionUseCase {
  constructor(private repository: TaskRepository) {}

  async execute(userId: string, taskId: string, completed: boolean): Promise<void> {
    if (!userId) {
      throw new Error('Usuário não autenticado.');
    }

    await this.repository.setCompleted(userId, taskId, completed);
  }
}
