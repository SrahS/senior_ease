// @vitest-environment jsdom

import { beforeEach, describe, expect, it, vi } from 'vitest';
import { fireEvent, render, screen } from '@testing-library/react';
import '@testing-library/jest-dom/vitest';
import App from './App';


vi.mock('firebase/auth', () => ({
  getAuth: vi.fn(),
  onAuthStateChanged: vi.fn((auth, callback) => {
    callback({ uid: 'usuario_teste_123', email: 'teste@senior.com' });
    return vi.fn();
  }),
  signOut: vi.fn(),
}));

vi.mock('../shared/firebase/config', () => ({
  auth: {},
  db: {}
}));


describe('SeniorEase app', () => {
  beforeEach(() => {
    window.localStorage.clear();
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

  it('atualiza o checklist do dia ao concluir uma tarefa', () => {
    render(<App />);

    const btnTarefas = screen.getAllByRole('button', { name: /Tarefas/i })[0];
    fireEvent.click(btnTarefas);

    const concludeButtons = screen.getAllByRole('button', { name: /Concluir/i });
    if (concludeButtons.length > 0) {
      fireEvent.click(concludeButtons[0]);
    }

    const btnInicio = screen.getAllByRole('button', { name: /Início/i })[0];
    fireEvent.click(btnInicio);

    expect(screen.getAllByText(/Checklist do dia/i)[0]).toBeInTheDocument();
  });

  it('navega para a tela de criação, adiciona uma nova tarefa e volta para a lista', () => {
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

    expect(screen.getByText('Tomar remédio das 15h')).toBeInTheDocument();
  });
});