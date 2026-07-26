import { usePreferences } from '../contexts/PreferencesContext';
import { useHistory } from '../hooks/useHistory';
import { CheckCircle, Circle } from 'lucide-react';

interface DashboardProps {
  completedCount: number;
  showOnboarding: boolean;
}

export function DashboardScreen({ completedCount, showOnboarding }: DashboardProps) {
  const { preferences } = usePreferences();
  const { history } = useHistory();

  const checklistItems = [
    { id: 'welcome', label: 'Primeiros passos', done: !showOnboarding },
    { id: 'task', label: 'Concluir uma tarefa', done: completedCount > 0 },

    { id: 'profile', label: 'Salvar perfil', done: preferences.userName.trim() !== '' },
  ];


  const progresso = checklistItems.filter(item => item.done).length;
  const isTudoPronto = progresso === checklistItems.length;

  return (
    <section className="panel" aria-labelledby="overview-title">
      <div className="panel-heading">
        <h2 id="overview-title">Resumo do dia</h2>
        {!preferences.simplifiedMode && <p>Uma visão rápida para quem precisa de clareza e poucas etapas.</p>}
      </div>
      
      <div className="stats-row">
        <div className="stat-card">
          <strong>{completedCount}</strong>
          <span>Tarefas concluídas</span>
        </div>
        <div className="stat-card">
          <strong>{preferences.simplifiedMode ? 'Sim' : 'Não'}</strong>
          <span>Modo simplificado</span>
        </div>
      </div>
      
      {preferences.extraConfirmation && (
        <p className="assistive-text" style={{marginTop: '1rem'}}>
          Confirmações extras ativas para sua segurança.
        </p>
      )}

      {}
      <div 
        className="checklist-card panel" 
        style={{
          marginTop: '2rem', 

          backgroundColor: isTudoPronto ? '#dcfce7' : '#fefce8',
          borderColor: isTudoPronto ? '#bbf7d0' : '#fef08a'
        }}
      >
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <h3 id="checklist-heading" style={{ margin: 0 }}>Checklist do dia</h3>
          <span style={{ fontSize: '0.9rem', fontWeight: 'bold', color: isTudoPronto ? '#166534' : '#a16207' }}>
            {progresso} de {checklistItems.length}
          </span>
        </div>
        
        <ul className="checklist-list" aria-labelledby="checklist-heading">
          {checklistItems.map(item => (
            <li key={item.id} className={`checklist-item ${item.done ? 'done' : ''}`} style={{ transition: 'all 0.3s ease' }}>
              
              {}
              {item.done ? (
                <CheckCircle size={22} color="#166534" aria-hidden="true" />
              ) : (
                <Circle size={22} color="#94a3b8" aria-hidden="true" />
              )}
              
              <span style={{ 
                textDecoration: item.done ? 'line-through' : 'none',
                color: item.done ? '#166534' : '#334155',
                fontWeight: item.done ? '700' : '500'
              }}>
                {item.label}
              </span>
            </li>
          ))}
        </ul>

        {}
        {isTudoPronto && (
          <p style={{ marginTop: '16px', marginBottom: 0, color: '#166534', fontWeight: '700', textAlign: 'center' }} role="status">
            🎉 Muito bem! Você configurou tudo com sucesso.
          </p>
        )}
      </div>
      {}

      <div className="history-card" style={{marginTop: '2rem'}}>
        <h3>Histórico simples</h3>
        <ul className="task-list">
          {history.map(item => (
            <li key={item.id} className="task-item" style={{ borderLeft: '4px solid #2563eb', paddingLeft: '1rem' }}>
              <div>
                <h3 style={{fontSize: '1rem', margin: 0}}>{item.title}</h3>
                <p style={{margin: 0, color: '#475569'}}>{item.detail}</p>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}