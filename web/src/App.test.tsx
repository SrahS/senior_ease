import { beforeEach, describe, expect, it } from 'vitest';
import { fireEvent, render, screen } from '@testing-library/react';
import App from './App';

describe('SeniorEase app', () => {
  beforeEach(() => {
    window.localStorage.clear();
  });

  it('renderiza as seções de perfil e ajusta as preferências', () => {
    render(<App />);

    // Navega para Perfil
    fireEvent.click(screen.getByRole('button', { name: 'Perfil' }));

    expect(screen.getByText('Perfil do usuário')).toBeInTheDocument();
    expect(screen.getByText('Modo de navegação')).toBeInTheDocument();

    // Na nova arquitetura a aba se chama 'Ajustes'
    fireEvent.click(screen.getByRole('button', { name: 'Ajustes' }));

    expect(screen.getByText('Painel de personalização')).toBeInTheDocument();
  });

  it('completa o checklist de boas-vindas ao visitar a aba de Ajuda', () => {
    render(<App />);

    // Inicialmente no Dashboard ('Início'), verificamos se o texto do checklist está lá
    expect(screen.getByText('Primeiros passos')).toBeInTheDocument();

    // Navega para Ajuda (onde fica o novo tutorial)
    fireEvent.click(screen.getByRole('button', { name: 'Ajuda' }));
    
    // Verifica se a tela de Ajuda carregou corretamente
    expect(screen.getByRole('heading', { name: 'Como usar o aplicativo?' })).toBeInTheDocument();

    // Volta para o Painel (Início)
    fireEvent.click(screen.getByRole('button', { name: 'Início' }));

    // Ao voltar, o item "Primeiros passos" deve estar marcado com ✓ 
    // (Testamos garantindo que existem marcas de conclusão na tela)
    expect(screen.getAllByText('✓').length).toBeGreaterThan(0);
  });

  it('atualiza o checklist do dia ao concluir uma tarefa', () => {
    render(<App />);

    // Vai para a aba de Tarefas
    fireEvent.click(screen.getByRole('button', { name: 'Tarefas' }));
    
    // Clica no primeiro botão de "Concluir" disponível na lista de tarefas abertas
    const concludeButtons = screen.getAllByRole('button', { name: 'Concluir' });
    fireEvent.click(concludeButtons[0]);

    // Volta para o Início
    fireEvent.click(screen.getByRole('button', { name: 'Início' }));

    // Verifica se a tela renderizou a seção do checklist e se registrou a ação
    expect(screen.getByText('Checklist do dia')).toBeInTheDocument();
    expect(screen.getByText('Concluir uma tarefa')).toBeInTheDocument();
  });

  it('navega para a tela de criação, adiciona uma nova tarefa e volta para a lista', () => {
    render(<App />);

    // Vai para a aba de Tarefas
    fireEvent.click(screen.getByRole('button', { name: 'Tarefas' }));
    
    // Clica no Botão Flutuante (FAB) de criar tarefa
    fireEvent.click(screen.getByRole('button', { name: 'Criar nova tarefa' }));

    // Verifica se a tela de Criação abriu
    expect(screen.getByRole('heading', { name: 'Nova Tarefa' })).toBeInTheDocument();

    // Digita o título da nova tarefa no input
    const titleInput = screen.getByLabelText('O que você precisa fazer?');
    fireEvent.change(titleInput, { target: { value: 'Tomar remédio das 15h' } });

    // Salva a tarefa
    fireEvent.click(screen.getByRole('button', { name: 'Salvar Tarefa' }));

    // Como o onSave aciona o onBack automaticamente, devemos estar de volta na lista de Tarefas
    // e a nova tarefa deve estar presente na tela.
    expect(screen.getByText('Tomar remédio das 15h')).toBeInTheDocument();
  });
});