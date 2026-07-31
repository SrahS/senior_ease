import { addDoc, collection, getDocs, orderBy, query, updateDoc, doc } from 'firebase/firestore';
import { db } from '../firebase/config';
import type { CreateTaskInput, Task } from '../domain/task';
import type { TaskRepository } from '../domain/repositories/taskRepository';

type FirestoreTask = {
  title: string;
  detail: string;
  completed: boolean;
  important?: boolean;
  createdAt: unknown;
  updatedAt: unknown;
};

function toDate(value: unknown): Date {
  if (value instanceof Date) {
    return value;
  }

  if (
    typeof value === 'object' &&
    value !== null &&
    'toDate' in value &&
    typeof value.toDate === 'function'
  ) {
    return value.toDate();
  }

  throw new Error('A tarefa armazenada tem uma data inválida.');
}

function toTask(id: string, data: FirestoreTask): Task {
  return {
    id,
    title: data.title,
    detail: data.detail,
    completed: data.completed,
    important: data.important ?? false,
    createdAt: toDate(data.createdAt),
    updatedAt: toDate(data.updatedAt),
  };
}

export class FirebaseTaskAdapter implements TaskRepository {
  async create(userId: string, input: CreateTaskInput): Promise<Task> {
    const now = new Date();
    const taskRef = await addDoc(collection(db, 'users', userId, 'tasks'), {
      title: input.title,
      detail: input.detail,
      completed: false,
      important: input.important,
      createdAt: now,
      updatedAt: now,
    });

    return {
      id: taskRef.id,
      title: input.title,
      detail: input.detail,
      completed: false,
      important: input.important,
      createdAt: now,
      updatedAt: now,
    };
  }

  async list(userId: string): Promise<Task[]> {
    const tasksQuery = query(
      collection(db, 'users', userId, 'tasks'),
      orderBy('createdAt', 'desc'),
    );
    const snapshot = await getDocs(tasksQuery);

    return snapshot.docs.map((taskDocument) =>
      toTask(taskDocument.id, taskDocument.data() as FirestoreTask),
    );
  }

  async setCompleted(userId: string, taskId: string, completed: boolean): Promise<void> {
    await updateDoc(doc(db, 'users', userId, 'tasks', taskId), {
      completed,
      updatedAt: new Date(),
    });
  }
}
