import { beforeEach, describe, expect, it } from 'vitest';
import { fireEvent, render, screen } from '@testing-library/react';
import App from './App';

describe('SeniorEase app', () => {
  beforeEach(() => {
    window.localStorage.clear();
  });

  it('renderiza as seções de perfil e ajusta as preferências', () => {
    render(<App />);


    fireEvent.click(screen.getByRole('button', { name: 'Perfil' }));

    expect(screen.getByText('Perfil do usuário')).toBeInTheDocument();
    expect(screen.getByText('Modo de navegação')).toBeInTheDocument();


    fireEvent.click(screen.getByRole('button', { name: 'Ajustes' }));

    expect(screen.getByText('Painel de personalização')).toBeInTheDocument();
  });

  it('completa o checklist de boas-vindas ao visitar a aba de Ajuda', () => {
    render(<App />);


    expect(screen.getByText('Primeiros passos')).toBeInTheDocument();


    fireEvent.click(screen.getByRole('button', { name: 'Ajuda' }));
    

    expect(screen.getByRole('heading', { name: 'Como usar o aplicativo?' })).toBeInTheDocument();


    fireEvent.click(screen.getByRole('button', { name: 'Início' }));



    expect(screen.getAllByText('✓').length).toBeGreaterThan(0);
  });

  it('atualiza o checklist do dia ao concluir uma tarefa', () => {
    render(<App />);


    fireEvent.click(screen.getByRole('button', { name: 'Tarefas' }));
    

    const concludeButtons = screen.getAllByRole('button', { name: 'Concluir' });
    fireEvent.click(concludeButtons[0]);


    fireEvent.click(screen.getByRole('button', { name: 'Início' }));


    expect(screen.getByText('Checklist do dia')).toBeInTheDocument();
    expect(screen.getByText('Concluir uma tarefa')).toBeInTheDocument();
  });

  it('navega para a tela de criação, adiciona uma nova tarefa e volta para a lista', () => {
    render(<App />);


    fireEvent.click(screen.getByRole('button', { name: 'Tarefas' }));
    

    fireEvent.click(screen.getByRole('button', { name: 'Criar nova tarefa' }));


    expect(screen.getByRole('heading', { name: 'Nova Tarefa' })).toBeInTheDocument();


    const titleInput = screen.getByLabelText('O que você precisa fazer?');
    fireEvent.change(titleInput, { target: { value: 'Tomar remédio das 15h' } });


    fireEvent.click(screen.getByRole('button', { name: 'Salvar Tarefa' }));



    expect(screen.getByText('Tomar remédio das 15h')).toBeInTheDocument();
  });
});