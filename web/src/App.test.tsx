import { describe, expect, it } from 'vitest';
import { fireEvent, render, screen } from '@testing-library/react';
import App from './App';

describe('SeniorEase app', () => {
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

    expect(screen.getByText('Etapa 1 de 3')).toBeInTheDocument();

    fireEvent.click(screen.getByRole('button', { name: 'Próximo passo' }));

    expect(screen.getByText('Etapa 2 de 3')).toBeInTheDocument();
  });
});
