import { useEffect, useMemo, useState } from 'react';
import { defaultPreferences, storageKey, type AccessibilityPreferences } from '../../shared/preferences';
import { LocalStoragePreferencesAdapter } from '../../shared/adapters/preferencesStorage';
import { AnnounceActionUseCase } from '../../shared/domain/useCases/announceActionUseCase';
import { LoadPreferencesUseCase } from '../../shared/domain/useCases/loadPreferencesUseCase';
import { SavePreferencesUseCase } from '../../shared/domain/useCases/savePreferencesUseCase';

type Task = {
  id: number;
  title: string;
  detail: string;
  completed: boolean;
};

type HistoryItem = {
  id: number;
  title: string;
  detail: string;
};

const starterTasks: Task[] = [
  { id: 1, title: 'Ler e-mail da faculdade', detail: 'Abrir confirmação e responder', completed: false },
  { id: 2, title: 'Pagar conta da água', detail: 'Confirmar valor antes de pagar', completed: true },
  { id: 3, title: 'Entrar no encontro virtual', detail: 'Abrir link e entrar 10 minutos antes', completed: false },
];

const starterHistory: HistoryItem[] = [
  { id: 1, title: 'Olá, Alissin!', detail: 'Seu perfil foi preparado com configurações simples.' },
  { id: 2, title: 'Tarefa concluída', detail: 'Você marcou a conta da água como resolvida.' },
];

const onboardingStorageKey = 'seniorease.onboarding.completed';
const preferencesStorage = new LocalStoragePreferencesAdapter(window.localStorage);
const loadPreferencesUseCase = new LoadPreferencesUseCase(preferencesStorage);
const savePreferencesUseCase = new SavePreferencesUseCase(preferencesStorage);
const announceActionUseCase = new AnnounceActionUseCase();

function App() {
  const [preferences, setPreferences] = useState<AccessibilityPreferences>(defaultPreferences);
  const [tasks, setTasks] = useState<Task[]>(starterTasks);
  const [completedCount, setCompletedCount] = useState(1);
  const [savedMessage, setSavedMessage] = useState('Preferências salvas localmente');
  const [activeTab, setActiveTab] = useState<'painel' | 'tarefas' | 'perfil' | 'configuracoes'>('painel');
  const [onboardingStep, setOnboardingStep] = useState(0);
  const [showOnboarding, setShowOnboarding] = useState(() => window.localStorage.getItem(onboardingStorageKey) !== 'true');
  const [history, setHistory] = useState<HistoryItem[]>(starterHistory);
  const [confirmAction, setConfirmAction] = useState<string | null>(null);
  const [reminderMessage, setReminderMessage] = useState('Lembrete: revise sua tarefa antes de continuar.');
  const [guidedTaskId, setGuidedTaskId] = useState<number | null>(null);
  const [guidedStep, setGuidedStep] = useState(0);

  useEffect(() => {
    const loadPreferences = async () => {
      const loaded = await loadPreferencesUseCase.execute(storageKey);
      setPreferences(loaded);
    };

    void loadPreferences();
  }, []);

  useEffect(() => {
    window.localStorage.setItem(onboardingStorageKey, showOnboarding ? 'false' : 'true');
  }, [showOnboarding]);

  useEffect(() => {
    const savePreferences = async () => {
      await savePreferencesUseCase.execute(storageKey, preferences);
      setSavedMessage('Preferências salvas localmente');
    };

    void savePreferences();
  }, [preferences]);

  const stats = useMemo(() => ({
    total: tasks.length,
    done: completedCount,
  }), [tasks.length, completedCount]);

  const toggleTask = (id: number) => {
    const target = tasks.find(task => task.id === id);
    if (target?.title.includes('água') && preferences.extraConfirmation) {
      setConfirmAction(`Deseja concluir a tarefa ${target.title}?`);
      return;
    }

    const updated = tasks.map(task => task.id === id ? { ...task, completed: !task.completed } : task);
    setTasks(updated);
    setCompletedCount(updated.filter(task => task.completed).length);
    setHistory(prev => [{ id: Date.now(), title: 'Tarefa atualizada', detail: 'A tarefa mudou de estado com sucesso.' }, ...prev].slice(0, 4));
    setSavedMessage(announceActionUseCase.execute('Tarefa atualizada'));
  };

  const checklistItems = [
    { id: 'welcome', label: 'Primeiros passos', done: !showOnboarding },
    { id: 'task', label: 'Concluir uma tarefa', done: completedCount > 0 },
    { id: 'profile', label: 'Salvar perfil', done: preferences.userName !== defaultPreferences.userName || preferences.userRole !== defaultPreferences.userRole },
  ];

  const confirmCriticalAction = () => {
    setConfirmAction(null);
    setReminderMessage('Ação confirmada. Tudo pronto para seguir.');
    setSavedMessage(announceActionUseCase.execute('Ação crítica confirmada'));
  };

  const startGuidedFlow = (id: number) => {
    const task = tasks.find(item => item.id === id);
    if (!task) return;

    setGuidedTaskId(id);
    setGuidedStep(1);
    setReminderMessage(`Guia para ${task.title}: siga os passos com calma.`);
    setSavedMessage(announceActionUseCase.execute(`Guia para ${task.title}`));
  };

  const advanceGuidedFlow = () => {
    if (guidedStep < 3) {
      setGuidedStep(prev => prev + 1);
      return;
    }

    setGuidedTaskId(null);
    setGuidedStep(0);
    setReminderMessage('Guia concluído. Você pode seguir para a próxima tarefa.');
  };

  const updatePreference = <K extends keyof AccessibilityPreferences>(key: K, value: AccessibilityPreferences[K]) => {
    setPreferences((prev: AccessibilityPreferences) => ({ ...prev, [key]: value }));
  };

  const handleProfileSave = () => {
    setHistory(prev => [{ id: Date.now(), title: 'Perfil salvo', detail: 'Seu perfil ficou pronto para usar.' }, ...prev].slice(0, 4));
    setSavedMessage(announceActionUseCase.execute('Perfil atualizado'));
  };

  const handleNextStep = () => {
    if (onboardingStep < 2) {
      setOnboardingStep(onboardingStep + 1);
    } else {
      setShowOnboarding(false);
      setOnboardingStep(0);
      setReminderMessage('Primeira visita encerrada. Você já pode começar a usar o SeniorEase.');
    }
  };

  const activeGuidedTask = tasks.find(task => task.id === guidedTaskId);

  return (
    <div className={`app-shell ${preferences.contrast === 'alto' ? 'contrast-high' : ''} ${preferences.spacing === 'compacto' ? 'spacing-compact' : 'spacing-wide'} ${preferences.warmMode ? 'warm-mode' : ''}`}>
      <header className="hero-card">
        <div>
          <p className="eyebrow">SeniorEase</p>
          <h1 style={{ fontSize: `${1.3 + preferences.fontScale * 0.2}rem` }}>Seu dia, mais simples e seguro</h1>
          <p style={{ fontSize: `${1 + preferences.fontScale * 0.08}rem` }}>
            Uma plataforma feita para tornar tarefas, preferências e lembretes mais claros para quem valoriza autonomia.
          </p>
        </div>
        <div className="hero-actions">
          <button className="primary-btn" onClick={() => updatePreference('extraConfirmation', !preferences.extraConfirmation)}>
            {preferences.extraConfirmation ? 'Confirmações ativadas' : 'Confirmações desativadas'}
          </button>
          <button className="secondary-btn" onClick={() => setOnboardingStep(1)}>
            Iniciar ajuda
          </button>
        </div>
      </header>

      <nav className="tab-bar" aria-label="Módulos do SeniorEase">
        {[
          { key: 'painel', label: 'Painel' },
          { key: 'tarefas', label: 'Tarefas' },
          { key: 'perfil', label: 'Perfil' },
          { key: 'configuracoes', label: 'Configurações' },
        ].map(tab => (
          <button key={tab.key} className={`tab-button ${activeTab === tab.key ? 'active' : ''}`} onClick={() => setActiveTab(tab.key as typeof activeTab)}>
            {tab.label}
          </button>
        ))}
      </nav>

      {showOnboarding && (
        <section className="panel onboarding-card" aria-label="Guia inicial">
          <h2>Primeiros passos</h2>
          <p>
            {onboardingStep === 0 && 'Comece escolhendo o modo simplificado para reduzir a quantidade de informação.'}
            {onboardingStep === 1 && 'Depois, confirme suas tarefas com calma e leia os lembretes antes de avançar.'}
            {onboardingStep === 2 && 'Pronto! Você já pode usar o SeniorEase com mais confiança.'}
          </p>
          <div className="progress-dots" aria-label="Progresso do onboarding">
            {[0, 1, 2].map(step => (
              <span key={step} className={`dot ${onboardingStep === step ? 'active' : ''}`} />
            ))}
          </div>
          <button className="primary-btn" onClick={handleNextStep}>
            {onboardingStep === 2 ? 'Começar a usar' : 'Próximo passo'}
          </button>
        </section>
      )}

      {confirmAction && (
        <section className="panel confirmation-card" aria-label="Confirmação necessária">
          <h2>Confirmar ação</h2>
          <p>{confirmAction}</p>
          <div className="hero-actions">
            <button className="primary-btn" onClick={confirmCriticalAction}>Sim, confirmar</button>
            <button className="secondary-btn" onClick={() => setConfirmAction(null)}>Cancelar</button>
          </div>
        </section>
      )}

      <section className="panel reminder-card" aria-label="Lembrete importante">
        <h2>Lembrete</h2>
        <p>{reminderMessage}</p>
      </section>

      <section className="panel checklist-card" aria-label="Checklist do dia">
        <div className="panel-heading">
          <h2>Checklist do dia</h2>
          <p>Veja rapidamente o que já foi concluído.</p>
        </div>
        <ul className="checklist-list">
          {checklistItems.map(item => (
            <li key={item.id} className={`checklist-item ${item.done ? 'done' : ''}`}>
              <span className="checkmark">{item.done ? '✓' : '•'}</span>
              <span>{item.label}</span>
            </li>
          ))}
        </ul>
      </section>

      <main className="content-grid">
        {activeTab === 'perfil' && (
          <section className="panel" aria-labelledby="profile-title">
          <div className="panel-heading">
            <h2 id="profile-title">Perfil do usuário</h2>
            <p>Configure o nome, a função e o modo de navegação com linguagem simples.</p>
          </div>

          <div className="control-group">
            <label htmlFor="user-name">Nome</label>
            <input id="user-name" value={preferences.userName} onChange={(e) => updatePreference('userName', e.target.value)} className="text-input" />
          </div>

          <div className="control-group">
            <label htmlFor="user-role">Função</label>
            <input id="user-role" value={preferences.userRole} onChange={(e) => updatePreference('userRole', e.target.value)} className="text-input" />
          </div>

          <div className="control-group">
            <label>Modo de navegação</label>
            <div className="chip-row">
              {(['simplificado', 'padrão'] as const).map(option => (
                <button key={option} className={`chip ${preferences.navigationMode === option ? 'selected' : ''}`} onClick={() => updatePreference('navigationMode', option)}>
                  {option === 'simplificado' ? 'Simplificado' : 'Padrão'}
                </button>
              ))}
            </div>
          </div>

          <div className="control-group">
            <label className="switch-row">
              <input type="checkbox" checked={preferences.notifications} onChange={(e) => updatePreference('notifications', e.target.checked)} />
              <span>Notificações e lembretes</span>
            </label>
          </div>

          <button className="primary-btn save-btn" onClick={handleProfileSave}>Salvar perfil</button>
          <p className="assistive-text">{savedMessage}</p>
          </section>
        )}

        {activeTab === 'configuracoes' && (
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
            <label className="switch-row">
              <input type="checkbox" checked={preferences.warmMode} onChange={(e) => updatePreference('warmMode', e.target.checked)} />
              <span>Modo acolhedor</span>
            </label>
          </div>
          </section>
        )}

        {activeTab === 'tarefas' && (
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

          <div className="hero-actions" style={{ marginTop: '16px' }}>
            <button className="secondary-btn" onClick={() => startGuidedFlow(tasks[0]?.id ?? 1)}>Ver passos</button>
          </div>

          {guidedTaskId !== null && (
            <section className="panel onboarding-card" aria-label="Passos guiados">
              <h2>Guia de tarefa</h2>
              <p>Etapa {guidedStep} de 3</p>
              <p>
                {guidedStep === 1 && `Comece por ${activeGuidedTask?.title ?? 'a tarefa selecionada'}. Leia o objetivo antes de avançar.`}
                {guidedStep === 2 && 'Depois, confirme se a informação está correta e prossiga com calma.'}
                {guidedStep === 3 && 'Por fim, marque a tarefa como concluída e revise o lembrete.'}
              </p>
              <div className="hero-actions">
                <button className="primary-btn" onClick={advanceGuidedFlow}>{guidedStep === 3 ? 'Fechar guia' : 'Próximo passo'}</button>
                <button className="secondary-btn" onClick={() => { setGuidedTaskId(null); setGuidedStep(0); }}>Cancelar</button>
              </div>
            </section>
          )}

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
        )}

        {activeTab === 'painel' && (
          <section className="panel" aria-labelledby="overview-title">
            <div className="panel-heading">
              <h2 id="overview-title">Resumo do dia</h2>
              <p>Uma visão rápida para quem precisa de clareza e poucas etapas.</p>
            </div>
            <div className="stats-row">
              <div className="stat-card">
                <strong>{stats.done}</strong>
                <span>Tarefas concluídas</span>
              </div>
              <div className="stat-card">
                <strong>{preferences.navigationMode === 'simplificado' ? 'Sim' : 'Não'}</strong>
                <span>Modo simplificado</span>
              </div>
            </div>
            <p className="assistive-text">{preferences.extraConfirmation ? 'Confirmações extras ativas' : 'Confirmações extras desligadas'}</p>

            <div className="history-card">
              <h3>Histórico simples</h3>
              <ul className="task-list">
                {history.map(item => (
                  <li key={item.id} className="task-item">
                    <div>
                      <h3>{item.title}</h3>
                      <p>{item.detail}</p>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          </section>
        )}
      </main>
    </div>
  );
}

export default App;
