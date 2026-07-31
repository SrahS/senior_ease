import type { CreateTaskInput, Task } from '../task';

export interface TaskRepository {
  create(userId: string, input: CreateTaskInput): Promise<Task>;
  list(userId: string): Promise<Task[]>;
  setCompleted(userId: string, taskId: string, completed: boolean): Promise<void>;
}
