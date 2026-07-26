import { beforeEach, describe, expect, it } from 'vitest';
import { act, fireEvent, render, screen } from '@testing-library/react';
import App from './App';

describe('SeniorEase app', () => {
  beforeEach(() => {
    window.localStorage.clear();
  });

  it('renders the profile and persisted preference sections', () => {
    render(<App />);

    fireEvent.click(screen.getByRole('button', { name: 'Perfil' }));

    expect(screen.getByText('Perfil do usuário')).toBeInTheDocument();
    expect(screen.getByText('Modo de navegação')).toBeInTheDocument();
    expect(screen.getByText('Preferências salvas localmente')).toBeInTheDocument();

    fireEvent.click(screen.getByRole('button', { name: 'Configurações' }));

    expect(screen.getByText('Painel de personalização')).toBeInTheDocument();
  });

  it('shows a guided step flow for a task', () => {
    render(<App />);

    fireEvent.click(screen.getByRole('button', { name: 'Tarefas' }));
    fireEvent.click(screen.getByRole('button', { name: 'Ver passos' }));

    expect(screen.getByRole('heading', { name: 'Primeiros passos' })).toBeInTheDocument();

    const onboardingButtons = screen.getAllByRole('button', { name: 'Próximo passo' });
    act(() => {
      fireEvent.click(onboardingButtons[0]);
    });

    expect(screen.getByText('Depois, confirme suas tarefas com calma e leia os lembretes antes de avançar.')).toBeInTheDocument();
  });

  it('shows onboarding only on first visit and hides it after completion', () => {
    render(<App />);

    expect(screen.getByRole('heading', { name: 'Primeiros passos' })).toBeInTheDocument();

    const nextButtons = screen.getAllByRole('button', { name: 'Próximo passo' });
    act(() => {
      fireEvent.click(nextButtons[0]);
    });
    act(() => {
      fireEvent.click(screen.getByRole('button', { name: 'Próximo passo' }));
    });
    act(() => {
      fireEvent.click(screen.getByRole('button', { name: 'Começar a usar' }));
    });

    expect(screen.queryByRole('heading', { name: 'Primeiros passos' })).not.toBeInTheDocument();
    expect(window.localStorage.getItem('seniorease.onboarding.completed')).toBe('true');
  });

  it('renders a visible checklist and updates it after a task is completed', () => {
    render(<App />);

    fireEvent.click(screen.getByRole('button', { name: 'Tarefas' }));
    fireEvent.click(screen.getAllByRole('button', { name: 'Concluir' })[0]);

    expect(screen.getByText('Checklist do dia')).toBeInTheDocument();
    expect(screen.getByText('Concluir uma tarefa')).toBeInTheDocument();
    expect(screen.getByText('✓')).toBeInTheDocument();
  });
});
