import { useState } from 'react';
import { usePreferences } from '../contexts/PreferencesContext';
import { Task } from '../hooks/useTasks';

interface TasksScreenProps {
  tasks: Task[];
  completedCount: number;
  totalCount: number;
  onToggle: (id: number) => void;
  onNavigate: (tab: 'criar_tarefa') => void;
}

export function TasksScreen({ tasks, completedCount, totalCount, onToggle, onNavigate }: TasksScreenProps) {
  const { preferences } = usePreferences();
  const [confirmId, setConfirmId] = useState<number | null>(null);

  const handleTaskClick = (task: Task) => {
    if (task.title.includes('água') && preferences.extraConfirmation && !task.completed) {
      setConfirmId(task.id);
    } else {
      onToggle(task.id);
    }
  };

  const confirmCriticalAction = () => {
    if (confirmId !== null) {
      onToggle(confirmId);
      setConfirmId(null);
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

      {confirmId && (
        <section className="panel confirmation-card" style={{backgroundColor: '#fef3c7', borderColor: '#fbbf24', marginBottom: '2rem'}}>
          <h2>Confirmar ação</h2>
          <p>Deseja realmente marcar esta tarefa importante como concluída?</p>
          <div className="hero-actions">
            <button className="primary-btn" style={{backgroundColor: '#16a34a'}} onClick={confirmCriticalAction}>Sim, confirmar</button>
            <button className="secondary-btn" onClick={() => setConfirmId(null)}>Cancelar</button>
          </div>
        </section>
      )}

      <ul className="task-list">
        {tasks.map(task => (
          <li key={task.id} className={`task-item ${task.completed ? 'done' : ''} ${preferences.visualFeedback ? 'feedback-active' : ''}`}>
            <div>
              <h3>{task.title}</h3>
              {!preferences.simplifiedMode && <p>{task.detail}</p>}
            </div>
            <button className="secondary-btn" onClick={() => handleTaskClick(task)}>
              {task.completed ? 'Reabrir' : 'Concluir'}
            </button>
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
    </section>
  );
}