import React, { useEffect, useMemo, useState } from 'react';
import { ScrollView, StyleSheet, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { onAuthStateChanged } from 'firebase/auth';
import { auth } from '../shared/firebase/config';

import { PreferencesProvider, usePreferences } from './src/hooks/usePreferences';

import { NavigationBar } from './src/components/NavigationBar';
import { DashboardScreen } from './src/screens/DashboardScreen';
import { TasksScreen } from './src/screens/TasksScreen';
import { CreateTaskScreen } from './src/screens/CreateTaskScreen';
import { ProfileScreen } from './src/screens/ProfileScreen';
import { SettingsScreen } from './src/screens/SettingsScreen';
import { HelpScreen } from './src/screens/HelpScreen';
import { AuthScreen } from './src/screens/AuthScreen';
import { FirebaseTaskAdapter } from '../shared/adapters/firebaseTaskAdapter';
import { useTasks } from './src/hooks/useTasks';

export type ActiveView = 'painel' | 'tarefas' | 'criar_tarefa' | 'perfil' | 'configuracoes' | 'ajuda';

function MainApp() {
  const [activeView, setActiveView] = useState<ActiveView>('painel');
  const { preferences } = usePreferences();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [userId, setUserId] = useState<string | null>(null);
  const taskRepository = useMemo(
    () => (userId ? new FirebaseTaskAdapter() : null),
    [userId],
  );
  const {
    tasks,
    completedCount,
    isLoading: areTasksLoading,
    error: tasksError,
    createTask,
    toggleTask,
    deleteTask,
  } = useTasks({ userId, repository: taskRepository });

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setIsAuthenticated(!!user);
      setUserId(user?.uid ?? null);
      
      if (!user) {
        setActiveView('painel');
      }
    });
    
    return () => unsubscribe();
  }, []);

  const renderScreen = () => {
    switch (activeView) {
      case 'painel':
        return <DashboardScreen completedCount={completedCount} />;
      case 'tarefas':
        return (
          <TasksScreen
            tasks={tasks}
            completedCount={completedCount}
            isLoading={areTasksLoading}
            error={tasksError}
            onToggleTask={toggleTask}
            onDeleteTask={deleteTask}
            onViewChange={setActiveView}
          />
        );
      case 'criar_tarefa':
        return (
          <CreateTaskScreen
            onBack={() => setActiveView('tarefas')}
            onSave={createTask}
          />
        );
      case 'perfil':
        return <ProfileScreen />;
      case 'configuracoes':
        return <SettingsScreen />;
      default:
        return <HelpScreen />;
    }
  };

  if (!isAuthenticated) {
    return <AuthScreen onLogin={() => setIsAuthenticated(true)} />
  }

  return (
    <SafeAreaView style={[styles.safeArea, preferences.warmMode && styles.warmSafeArea]}>
      <View style={styles.navigationContainer}>
        <NavigationBar
          activeView={activeView === 'criar_tarefa' ? 'tarefas' : activeView}
          onViewChange={(view) => setActiveView(view)}
        />
      </View>
      {activeView === 'tarefas' ? (
        renderScreen()
      ) : (
        <ScrollView contentContainerStyle={styles.container} showsVerticalScrollIndicator={false}>
          {renderScreen()}
        </ScrollView>
      )}
    </SafeAreaView>
  );
}

export default function App() {
  return (
    <GestureHandlerRootView style={styles.root}>
      <PreferencesProvider>
        <MainApp />
      </PreferencesProvider>
    </GestureHandlerRootView>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1 },
  safeArea: { flex: 1, backgroundColor: '#f2f7ff' },
  warmSafeArea: { backgroundColor: '#fff7ed' },
  navigationContainer: { paddingHorizontal: 24, paddingTop: 24 },
  container: { paddingHorizontal: 24, paddingBottom: 48 },
});