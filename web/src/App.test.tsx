// @vitest-environment jsdom

import { beforeEach, describe, expect, it, vi } from 'vitest';
import { cleanup, fireEvent, render, screen, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom/vitest';
import App from './App';

const taskStore = vi.hoisted(() => ({
  tasks: [] as Array<{
    id: string;
    title: string;
    detail: string;
    completed: boolean;
    important: boolean;
    createdAt: Date;
    updatedAt: Date;
    deletedAt: Date | null;
  }>,
  softDeleteError: null as Error | null,
  delayList: false,
}));

vi.mock('firebase/auth', () => ({
  getAuth: vi.fn(),
  onAuthStateChanged: vi.fn((auth, callback) => {
    callback({ uid: 'usuario_teste_123', email: 'teste@senior.com' });
    return vi.fn();
  }),
  signOut: vi.fn(),
}));

vi.mock('../../shared/firebase/config', () => ({
  auth: {},
  db: {}
}));

vi.mock('../../shared/adapters/firebaseTaskAdapter', () => ({
  FirebaseTaskAdapter: class {
    async list() {
      if (taskStore.delayList) {
        await new Promise((resolve) => setTimeout(resolve, 25));
      }
      return taskStore.tasks.filter((task) => task.deletedAt === null);
    }

    async create(_userId: string, input: { title: string; detail: string; important: boolean }) {
      const now = new Date();
      const task = {
        id: `task-${taskStore.tasks.length + 1}`,
        title: input.title,
        detail: input.detail,
        completed: false,
        important: input.important,
        createdAt: now,
        updatedAt: now,
        deletedAt: null,
      };
      taskStore.tasks = [task, ...taskStore.tasks];
      return task;
    }

    async setCompleted(_userId: string, taskId: string, completed: boolean) {
      taskStore.tasks = taskStore.tasks.map((task) =>
        task.id === taskId ? { ...task, completed, updatedAt: new Date() } : task,
      );
    }

    async softDelete(_userId: string, taskId: string) {
      if (taskStore.softDeleteError) {
        throw taskStore.softDeleteError;
      }

      taskStore.tasks = taskStore.tasks.map((task) =>
        task.id === taskId ? { ...task, deletedAt: new Date(), updatedAt: new Date() } : task,
      );
    }
  },
}));


describe('SeniorEase app', () => {
  beforeEach(() => {
    cleanup();
    window.localStorage.clear();
    taskStore.softDeleteError = null;
    taskStore.delayList = false;
    taskStore.tasks = [
      {
        id: 'task-1',
        title: 'Ler e-mail da faculdade',
        detail: 'Abrir confirmação e responder',
        completed: false,
        important: false,
        createdAt: new Date(),
        updatedAt: new Date(),
        deletedAt: null,
      },
      {
        id: 'task-2',
        title: 'Pagar conta da água',
        detail: 'Confirmar valor antes de pagar',
        completed: true,
        important: true,
        createdAt: new Date(),
        updatedAt: new Date(),
        deletedAt: null,
      },
      {
        id: 'deleted-task',
        title: 'Tarefa excluída',
        detail: 'Não deve aparecer',
        completed: false,
        important: false,
        createdAt: new Date(),
        updatedAt: new Date(),
        deletedAt: new Date(),
      },
    ];
  });

  it('renderiza as seções de perfil e ajusta as preferências', () => {
    render(<App />);

    const btnPerfil = screen.getAllByRole('button', { name: /Perfil/i })[0];
    fireEvent.click(btnPerfil);

    expect(screen.getByText('Perfil do usuário')).toBeInTheDocument();
    expect(screen.getByText('Modo de navegação')).toBeInTheDocument();

    const btnAjustes = screen.getAllByRole('button', { name: /Ajustes/i })[0];
    fireEvent.click(btnAjustes);

    expect(screen.getByText('Painel de personalização')).toBeInTheDocument();
  });

  it('completa o checklist de boas-vindas ao visitar a aba de Ajuda', () => {
    render(<App />);

    expect(screen.getByText('Primeiros passos')).toBeInTheDocument();

    const btnAjuda = screen.getAllByRole('button', { name: /Ajuda/i })[0];
    fireEvent.click(btnAjuda);

    expect(screen.getByRole('heading', { name: 'Como usar o aplicativo?' })).toBeInTheDocument();

    const btnInicio = screen.getAllByRole('button', { name: /Início/i })[0];
    fireEvent.click(btnInicio);

    expect(screen.getAllByText(/Seu dia, mais simples e seguro/i)[0]).toBeInTheDocument();
  });

  it('atualiza o checklist do dia ao concluir uma tarefa', async () => {
    render(<App />);

    const btnTarefas = screen.getAllByRole('button', { name: /Tarefas/i })[0];
    fireEvent.click(btnTarefas);

    const concludeButton = await screen.findByRole('button', { name: /Concluir tarefa Ler e-mail da faculdade/i });
    fireEvent.click(concludeButton);

    const btnInicio = screen.getAllByRole('button', { name: /Início/i })[0];
    fireEvent.click(btnInicio);

    expect(screen.getAllByText(/Checklist do dia/i)[0]).toBeInTheDocument();
  });

  it('navega para a tela de criação, adiciona uma nova tarefa e volta para a lista', async () => {
    render(<App />);

    const btnTarefas = screen.getAllByRole('button', { name: /Tarefas/i })[0];
    fireEvent.click(btnTarefas);

    const btnCriar = screen.getAllByRole('button', { name: /Criar nova tarefa/i })[0];
    fireEvent.click(btnCriar);

    expect(screen.getByRole('heading', { name: 'Nova Tarefa' })).toBeInTheDocument();

    const titleInput = screen.getByLabelText('O que você precisa fazer?');
    fireEvent.change(titleInput, { target: { value: 'Tomar remédio das 15h' } });

    const btnSalvar = screen.getAllByRole('button', { name: /Salvar Tarefa/i })[0];
    fireEvent.click(btnSalvar);

    expect(await screen.findByText('Tomar remédio das 15h')).toBeInTheDocument();
  });

  it('validates a required title and clears the validation error when typing', () => {
    render(<App />);

    fireEvent.click(screen.getAllByRole('button', { name: /Tarefas/i })[0]);
    fireEvent.click(screen.getByRole('button', { name: /Criar nova tarefa/i }));
    fireEvent.click(screen.getByRole('button', { name: 'Salvar Tarefa' }));

    expect(screen.getByRole('alert')).toHaveTextContent('Informe o que você precisa fazer.');
    fireEvent.change(screen.getByLabelText('O que você precisa fazer?'), {
      target: { value: 'Tomar remédio' },
    });
    expect(screen.queryByRole('alert')).not.toBeInTheDocument();
  });

  it('marks a task as important and requires confirmation before completing it', async () => {
    render(<App />);

    fireEvent.click(screen.getAllByRole('button', { name: /Tarefas/i })[0]);
    fireEvent.click(screen.getByRole('button', { name: /Criar nova tarefa/i }));
    fireEvent.change(screen.getByLabelText('O que você precisa fazer?'), {
      target: { value: 'Tomar remédio das 15h' },
    });
    fireEvent.click(screen.getByRole('checkbox', { name: 'Marcar como tarefa importante' }));
    fireEvent.click(screen.getByRole('button', { name: 'Salvar Tarefa' }));

    fireEvent.click(await screen.findByRole('button', { name: /Concluir tarefa Tomar remédio das 15h/i }));

    expect(screen.getByRole('dialog', { name: 'Concluir tarefa importante?' })).toBeInTheDocument();
    fireEvent.click(screen.getByRole('button', { name: 'Sim, confirmar' }));

    await waitFor(() => {
      expect(screen.getByRole('button', { name: /Reabrir tarefa Tomar remédio das 15h/i })).toBeInTheDocument();
    });
  });

  it('does not display soft-deleted tasks loaded by the repository', async () => {
    render(<App />);

    fireEvent.click(screen.getAllByRole('button', { name: /Tarefas/i })[0]);

    expect(await screen.findByText('Ler e-mail da faculdade')).toBeInTheDocument();
    expect(screen.queryByText('Tarefa excluída')).not.toBeInTheDocument();
  });

  it('shows loading feedback while the task list is fetched', async () => {
    taskStore.delayList = true;
    render(<App />);

    fireEvent.click(screen.getAllByRole('button', { name: /Tarefas/i })[0]);

    expect(await screen.findByRole('status')).toHaveTextContent('Carregando tarefas...');
    expect(await screen.findByText('Ler e-mail da faculdade')).toBeInTheDocument();
  });

  it('keeps a task when deletion is cancelled and removes it only after confirmation', async () => {
    render(<App />);

    fireEvent.click(screen.getAllByRole('button', { name: /Tarefas/i })[0]);
    const deleteButton = await screen.findByRole('button', { name: /Excluir tarefa Ler e-mail da faculdade/i });
    fireEvent.click(deleteButton);

    expect(screen.getByRole('dialog', { name: 'Excluir tarefa?' })).toBeInTheDocument();
    fireEvent.click(screen.getByRole('button', { name: 'Cancelar' }));
    expect(screen.getByText('Ler e-mail da faculdade')).toBeInTheDocument();

    fireEvent.click(deleteButton);
    fireEvent.click(screen.getByRole('button', { name: 'Sim, excluir' }));

    await waitFor(() => {
      expect(screen.queryByText('Ler e-mail da faculdade')).not.toBeInTheDocument();
    });
  });

  it('preserves the task and presents an error when soft deletion fails', async () => {
    taskStore.softDeleteError = new Error('Falha ao excluir.');
    render(<App />);

    fireEvent.click(screen.getAllByRole('button', { name: /Tarefas/i })[0]);
    fireEvent.click(await screen.findByRole('button', { name: /Excluir tarefa Ler e-mail da faculdade/i }));
    fireEvent.click(screen.getByRole('button', { name: 'Sim, excluir' }));

    expect(await screen.findByRole('alert')).toHaveTextContent('Falha ao excluir.');
    expect(screen.getByText('Ler e-mail da faculdade')).toBeInTheDocument();
  });
});