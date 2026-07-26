import React, { useState } from 'react';
import { ScrollView, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { PreferencesProvider, usePreferences } from './src/hooks/usePreferences';

import { NavigationBar } from './src/components/NavigationBar';
import { DashboardScreen } from './src/screens/DashboardScreen';
import { TasksScreen } from './src/screens/TasksScreen';
import { ProfileScreen } from './src/screens/ProfileScreen';
import { SettingsScreen } from './src/screens/SettingsScreen';
import { HelpScreen } from './src/screens/HelpScreen';

export type ActiveView = 'painel' | 'tarefas' | 'perfil' | 'configuracoes' | 'ajuda';

function MainApp() {
  const [activeView, setActiveView] = useState<ActiveView>('painel');
  const { preferences } = usePreferences();

  const renderScreen = () => {
    switch (activeView) {
      case 'painel':
        return <DashboardScreen />;
      case 'tarefas':
        return <TasksScreen />;
      case 'perfil':
        return <ProfileScreen />;
      case 'configuracoes':
        return <SettingsScreen />;
      default:
        return <HelpScreen />;
    }
  };

  return (
    <SafeAreaView style={[styles.safeArea, preferences.warmMode && styles.warmSafeArea]}>
      <ScrollView contentContainerStyle={styles.container} showsVerticalScrollIndicator={false}>
        
        <NavigationBar activeView={activeView} onViewChange={setActiveView} />
        
        {renderScreen()}

      </ScrollView>
    </SafeAreaView>
  );
}

export default function App() {
  return (
    <PreferencesProvider>
      <MainApp />
    </PreferencesProvider>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: '#f2f7ff' },
  warmSafeArea: { backgroundColor: '#fff7ed' },
  container: { padding: 24, paddingBottom: 48 },
});