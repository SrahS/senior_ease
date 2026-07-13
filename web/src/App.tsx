import { useEffect, useMemo, useState } from 'react';

type AccessibilityPreferences = {
  fontScale: number;
  contrast: 'padrão' | 'alto';
  spacing: 'compacto' | 'amplo';
  simplifiedMode: boolean;
  visualFeedback: boolean;
  extraConfirmation: boolean;
  reminders: boolean;
};

type Task = {
  id: number;
  title: string;
  detail: string;
  completed: boolean;
};

const defaultPreferences: AccessibilityPreferences = {
  fontScale: 1,
  contrast: 'padrão',
  spacing: 'amplo',
  simplifiedMode: true,
  visualFeedback: true,
  extraConfirmation: true,
  reminders: true,
};

const starterTasks: Task[] = [
  { id: 1, title: 'Ler e-mail da faculdade', detail: 'Abrir confirmação e responder', completed: false },
  { id: 2, title: 'Pagar conta da água', detail: 'Confirmar valor antes de pagar', completed: true },
  { id: 3, title: 'Entrar no encontro virtual', detail: 'Abrir link e entrar 10 minutos antes', completed: false },
];

const storageKey = 'seniorease.preferences';

function App() {
  const [preferences, setPreferences] = useState<AccessibilityPreferences>(defaultPreferences);
  const [tasks, setTasks] = useState<Task[]>(starterTasks);
  const [completedCount, setCompletedCount] = useState(1);

  useEffect(() => {
    const stored = window.localStorage.getItem(storageKey);
    if (stored) {
      const parsed = JSON.parse(stored) as AccessibilityPreferences;
      setPreferences(parsed);
    }
  }, []);

  useEffect(() => {
    window.localStorage.setItem(storageKey, JSON.stringify(preferences));
  }, [preferences]);

  const stats = useMemo(() => ({
    total: tasks.length,
    done: completedCount,
  }), [tasks.length, completedCount]);

  const toggleTask = (id: number) => {
    const updated = tasks.map(task => task.id === id ? { ...task, completed: !task.completed } : task);
    setTasks(updated);
    setCompletedCount(updated.filter(task => task.completed).length);
  };

  const updatePreference = <K extends keyof AccessibilityPreferences>(key: K, value: AccessibilityPreferences[K]) => {
    setPreferences(prev => ({ ...prev, [key]: value }));
  };

  return (
    <div className={`app-shell ${preferences.contrast === 'alto' ? 'contrast-high' : ''} ${preferences.spacing === 'compacto' ? 'spacing-compact' : 'spacing-wide'}`}>
      <header className="hero-card">
        <div>
          <p className="eyebrow">SeniorEase</p>
          <h1 style={{ fontSize: `${1.3 + preferences.fontScale * 0.2}rem` }}>Seu dia, mais simples e seguro</h1>
          <p style={{ fontSize: `${1 + preferences.fontScale * 0.08}rem` }}>
            Uma plataforma feita para tornar tarefas, preferências e lembretes mais claros para quem valoriza autonomia.
          </p>
        </div>
        <button className="primary-btn" onClick={() => updatePreference('extraConfirmation', !preferences.extraConfirmation)}>
          {preferences.extraConfirmation ? 'Confirmações ativadas' : 'Confirmações desativadas'}
        </button>
      </header>

      <main className="content-grid">
        <section className="panel" aria-labelledby="preferences-title">
          <div className="panel-heading">
            <h2 id="preferences-title">Painel de personalização</h2>
            <p>Adapte o espaço, a leitura e a segurança para o seu ritmo.</p>
          </div>

          <div className="control-group">
            <label htmlFor="font-range">Tamanho da fonte: {preferences.fontScale.toFixed(1)}x</label>
            <input id="font-range" type="range" min="0.8" max="1.4" step="0.1" value={preferences.fontScale} onChange={(e) => updatePreference('fontScale', Number(e.target.value))} />
          </div>

          <div className="control-group">
            <label>Contraste</label>
            <div className="chip-row">
              {(['padrão', 'alto'] as const).map(option => (
                <button key={option} className={`chip ${preferences.contrast === option ? 'selected' : ''}`} onClick={() => updatePreference('contrast', option)}>
                  {option === 'alto' ? 'Alto contraste' : 'Padrão'}
                </button>
              ))}
            </div>
          </div>

          <div className="control-group">
            <label>Espaçamento</label>
            <div className="chip-row">
              {(['compacto', 'amplo'] as const).map(option => (
                <button key={option} className={`chip ${preferences.spacing === option ? 'selected' : ''}`} onClick={() => updatePreference('spacing', option)}>
                  {option === 'amplo' ? 'Espaçado' : 'Compacto'}
                </button>
              ))}
            </div>
          </div>

          <div className="control-group">
            <label className="switch-row">
              <input type="checkbox" checked={preferences.simplifiedMode} onChange={(e) => updatePreference('simplifiedMode', e.target.checked)} />
              <span>Modo simplificado</span>
            </label>
            <label className="switch-row">
              <input type="checkbox" checked={preferences.visualFeedback} onChange={(e) => updatePreference('visualFeedback', e.target.checked)} />
              <span>Feedback visual reforçado</span>
            </label>
            <label className="switch-row">
              <input type="checkbox" checked={preferences.reminders} onChange={(e) => updatePreference('reminders', e.target.checked)} />
              <span>Lembretes</span>
            </label>
          </div>
        </section>

        <section className="panel" aria-labelledby="tasks-title">
          <div className="panel-heading">
            <h2 id="tasks-title">Organizador simplificado</h2>
            <p>Fluxo claro, passos curtos e confirmação antes de concluir.</p>
          </div>

          <div className="stats-row">
            <div className="stat-card">
              <strong>{stats.done}</strong>
              <span>Concluídas</span>
            </div>
            <div className="stat-card">
              <strong>{stats.total}</strong>
              <span>Total</span>
            </div>
          </div>

          <ul className="task-list">
            {tasks.map(task => (
              <li key={task.id} className={`task-item ${task.completed ? 'done' : ''}`}>
                <div>
                  <h3>{task.title}</h3>
                  <p>{task.detail}</p>
                </div>
                <button className="secondary-btn" onClick={() => toggleTask(task.id)}>
                  {task.completed ? 'Reabrir' : 'Concluir'}
                </button>
              </li>
            ))}
          </ul>
        </section>
      </main>
    </div>
  );
}

export default App;
