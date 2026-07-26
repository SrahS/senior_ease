import { useState, useEffect } from 'react';
import { PreferencesProvider, usePreferences } from './contexts/PreferencesContext';
import { useTasks } from './hooks/useTasks';


import { Home, CheckSquare, User, Settings, HelpCircle } from 'lucide-react';

import { DashboardScreen } from './screens/DashboardScreen';
import { TasksScreen } from './screens/TasksScreen';
import { ProfileScreen } from './screens/ProfileScreen';
import { SettingsScreen } from './screens/SettingsScreen';
import { HelpScreen } from './screens/HelpScreen';
import { CreateTaskScreen } from './screens/CreateTaskScreen';

type ActiveTab = 'painel' | 'tarefas' | 'perfil' | 'configuracoes' | 'ajuda' | 'criar_tarefa';

function MainApp() {
  const { preferences, updatePreference } = usePreferences();
  const { tasks, completedCount, totalCount, toggleTaskState, addTask } = useTasks(); 
  
  const [activeTab, setActiveTab] = useState<ActiveTab>('painel');
  const [showOnboarding, setShowOnboarding] = useState(true);

  useEffect(() => {
    if (activeTab === 'ajuda') setShowOnboarding(false);
  }, [activeTab]);

  const shellClasses = [
    'app-shell',
    preferences.contrast === 'alto' ? 'contrast-high' : '',
    preferences.spacing === 'compacto' ? 'spacing-compact' : 'spacing-wide',
    preferences.warmMode ? 'warm-mode' : ''
  ].join(' ').trim();


  const navTabs = [
    { key: 'painel', label: 'Início', Icon: Home },
    { key: 'tarefas', label: 'Tarefas', Icon: CheckSquare },
    { key: 'perfil', label: 'Perfil', Icon: User },
    { key: 'configuracoes', label: 'Ajustes', Icon: Settings },
    { key: 'ajuda', label: 'Ajuda', Icon: HelpCircle },
  ] as const;

  return (
    <div className={shellClasses}>
      <header className="hero-card">
        <div>
          <p className="eyebrow">SeniorEase</p>
          <h1 style={{ fontSize: `${1.3 + preferences.fontScale * 0.2}rem` }}>Seu dia, mais simples e seguro</h1>
          <p style={{ fontSize: `${1 + preferences.fontScale * 0.08}rem` }}>
            Uma plataforma feita para tornar tarefas, preferências e lembretes mais claros.
          </p>
        </div>
        <div className="hero-actions">
          <button className="primary-btn" onClick={() => updatePreference('extraConfirmation', !preferences.extraConfirmation)}>
            {preferences.extraConfirmation ? 'Confirmações ativadas' : 'Confirmações desativadas'}
          </button>
        </div>
      </header>

      {}
      <nav className="tab-bar" aria-label="Módulos do SeniorEase">
        {navTabs.map(tab => {
          const isActive = activeTab === tab.key;
          return (
            <button 
              key={tab.key} 
              className={`tab-button ${isActive ? 'active' : ''}`} 
              onClick={() => setActiveTab(tab.key as ActiveTab)}
            >
              <tab.Icon size={24} strokeWidth={isActive ? 2.5 : 2} />
              <span>{tab.label}</span>
            </button>
          )
        })}
      </nav>

      <main className="content-grid">
        {activeTab === 'painel' && <DashboardScreen completedCount={completedCount} showOnboarding={showOnboarding} />}
        
        {activeTab === 'tarefas' && (
          <TasksScreen 
            tasks={tasks} 
            completedCount={completedCount} 
            totalCount={totalCount} 
            onToggle={toggleTaskState} 
            onNavigate={setActiveTab} 
          />
        )}
        
        {activeTab === 'criar_tarefa' && (
          <CreateTaskScreen 
            onBack={() => setActiveTab('tarefas')} 
            onSave={addTask} 
          />
        )}

        {activeTab === 'perfil' && <ProfileScreen />}
        {activeTab === 'configuracoes' && <SettingsScreen />}
        {activeTab === 'ajuda' && <HelpScreen />}
      </main>
    </div>
  );
}

export default function App() {
  return (
    <PreferencesProvider>
      <MainApp />
    </PreferencesProvider>
  );
}