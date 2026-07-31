import { useState } from 'react';
import { usePreferences } from '../contexts/PreferencesContext';
import type { Task } from '../../../shared/domain/task';
import { ConfirmationModal } from '../components/ConfirmationModal';

interface TasksScreenProps {
  tasks: Task[];
  completedCount: number;
  totalCount: number;
  isLoading: boolean;
  error: string | null;
  onToggle: (taskId: string) => Promise<void>;
  onDeleteTask: (taskId: string) => Promise<void>;
  onNavigate: (tab: 'criar_tarefa') => void;
}

export function TasksScreen({
  tasks,
  completedCount,
  totalCount,
  isLoading,
  error,
  onToggle,
  onDeleteTask,
  onNavigate,
}: TasksScreenProps) {
  const { preferences } = usePreferences();
  const [taskAwaitingCompletion, setTaskAwaitingCompletion] = useState<Task | null>(null);
  const [taskAwaitingDeletion, setTaskAwaitingDeletion] = useState<Task | null>(null);
  const [isTogglingTask, setIsTogglingTask] = useState(false);
  const [isDeletingTask, setIsDeletingTask] = useState(false);

  const handleTaskClick = (task: Task) => {
    if (task.important && preferences.extraConfirmation && !task.completed) {
      setTaskAwaitingCompletion(task);
      return;
    }

    void completeToggle(task);
  };

  const completeToggle = async (task: Task) => {
    setIsTogglingTask(true);
    try {
      await onToggle(task.id);
    } catch {
      // The shared task state exposes persistence errors in the task list.
    } finally {
      setIsTogglingTask(false);
    }
  };

  const confirmTaskCompletion = async () => {
    if (!taskAwaitingCompletion || isTogglingTask) {
      return;
    }

    const task = taskAwaitingCompletion;
    setTaskAwaitingCompletion(null);
    await completeToggle(task);
  };

  const confirmTaskDeletion = async () => {
    if (!taskAwaitingDeletion || isDeletingTask) {
      return;
    }

    const task = taskAwaitingDeletion;
    setIsDeletingTask(true);
    try {
      await onDeleteTask(task.id);
      setTaskAwaitingDeletion(null);
    } catch {
      // The shared task state exposes persistence errors in the task list.
    } finally {
      setIsDeletingTask(false);
    }
  };

  return (
    <section className="panel" aria-labelledby="tasks-title" style={{ position: 'relative', paddingBottom: '5rem' }}>
      <div className="panel-heading">
        <h2 id="tasks-title">Organizador simplificado</h2>
        {!preferences.simplifiedMode && <p>Fluxo claro, passos curtos e confirmação antes de concluir.</p>}
      </div>

      <div className="stats-row" style={{marginBottom: '2rem'}}>
        <div className="stat-card">
          <strong>{completedCount}</strong>
          <span>Concluídas</span>
        </div>
        <div className="stat-card">
          <strong>{totalCount}</strong>
          <span>Total</span>
        </div>
      </div>

      {isLoading && <p className="task-status" role="status">Carregando tarefas...</p>}
      {error && <p className="task-error" role="alert">{error}</p>}

      <ul className="task-list">
        {tasks.map(task => (
          <li key={task.id} className={`task-item ${task.completed ? 'done' : ''} ${preferences.visualFeedback ? 'feedback-active' : ''}`}>
            <div>
              <h3>{task.title}</h3>
              {task.important && <span className="important-badge">Importante</span>}
              {!preferences.simplifiedMode && <p>{task.detail}</p>}
            </div>
            <div className="task-actions">
              <button
                className="secondary-btn"
                type="button"
                aria-label={`${task.completed ? 'Reabrir' : 'Concluir'} tarefa ${task.title}`}
                disabled={isTogglingTask || isDeletingTask}
                onClick={() => handleTaskClick(task)}
              >
                {task.completed ? 'Reabrir' : 'Concluir'}
              </button>
              <button
                className="delete-task-btn"
                type="button"
                aria-label={`Excluir tarefa ${task.title}`}
                aria-haspopup="dialog"
                disabled={isDeletingTask}
                onClick={() => setTaskAwaitingDeletion(task)}
              >
                Excluir
              </button>
            </div>
          </li>
        ))}
      </ul>

      <button 
        onClick={() => onNavigate('criar_tarefa')}
        style={{
          position: 'absolute',
          bottom: '24px',
          right: '24px',
          backgroundColor: '#2563eb',
          color: '#ffffff',
          width: '60px',
          height: '60px',
          borderRadius: '50%',
          border: 'none',
          fontSize: '32px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          cursor: 'pointer',
          boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.2), 0 2px 4px -1px rgba(0, 0, 0, 0.1)',
          zIndex: 10
        }}
        aria-label="Criar nova tarefa"
      >
        +
      </button>
      <ConfirmationModal
        visible={taskAwaitingCompletion !== null}
        title="Concluir tarefa importante?"
        message={`Deseja marcar "${taskAwaitingCompletion?.title ?? ''}" como concluída?`}
        isConfirming={isTogglingTask}
        onConfirm={confirmTaskCompletion}
        onCancel={() => !isTogglingTask && setTaskAwaitingCompletion(null)}
      />
      <ConfirmationModal
        visible={taskAwaitingDeletion !== null}
        title="Excluir tarefa?"
        message={`Deseja excluir "${taskAwaitingDeletion?.title ?? ''}"? Esta ação removerá a tarefa da sua lista.`}
        confirmLabel="Sim, excluir"
        confirmVariant="danger"
        isConfirming={isDeletingTask}
        onConfirm={confirmTaskDeletion}
        onCancel={() => !isDeletingTask && setTaskAwaitingDeletion(null)}
      />
    </section>
  );
}