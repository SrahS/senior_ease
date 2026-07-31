export interface Task {
  id: string;
  title: string;
  detail: string;
  completed: boolean;
  important: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface CreateTaskInput {
  title: string;
  detail: string;
  important: boolean;
}
