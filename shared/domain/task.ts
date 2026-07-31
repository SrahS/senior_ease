export interface Task {
  id: string;
  title: string;
  detail: string;
  completed: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface CreateTaskInput {
  title: string;
  detail: string;
}
