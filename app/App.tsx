import React, { useEffect, useMemo, useState } from 'react';
import { Animated, AsyncStorage, SafeAreaView, ScrollView, StyleSheet, Switch, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { defaultPreferences, storageKey, type AccessibilityPreferences } from '../shared/preferences';
import { AsyncStoragePreferencesAdapter } from '../shared/adapters/preferencesStorage';
import { LoadPreferencesUseCase } from '../shared/domain/useCases/loadPreferencesUseCase';
import { SavePreferencesUseCase } from '../shared/domain/useCases/savePreferencesUseCase';

const preferencesStorage = new AsyncStoragePreferencesAdapter(AsyncStorage);
const loadPreferencesUseCase = new LoadPreferencesUseCase(preferencesStorage);
const savePreferencesUseCase = new SavePreferencesUseCase(preferencesStorage);

export default function App() {
  const [preferences, setPreferences] = useState<AccessibilityPreferences>(defaultPreferences);
  const [savedMessage, setSavedMessage] = useState('Preferências salvas localmente');
  const [activeView, setActiveView] = useState<'painel' | 'tarefas' | 'perfil'>('painel');
  const [reminderMessage, setReminderMessage] = useState('Lembrete: siga com calma e confirme cada passo.');
  const [showOnboarding, setShowOnboarding] = useState(true);
  const [onboardingStep, setOnboardingStep] = useState(0);
  const [fadeAnim] = useState(new Animated.Value(0));

  useEffect(() => {
    const loadPreferences = async () => {
      const loaded = await loadPreferencesUseCase.execute(storageKey);
      setPreferences(loaded);
    };

    loadPreferences();
  }, []);

  useEffect(() => {
    const savePreferences = async () => {
      await savePreferencesUseCase.execute(storageKey, preferences);
      setSavedMessage('Preferências salvas localmente');
    };

    savePreferences();
  }, [preferences]);

  useEffect(() => {
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 400,
      useNativeDriver: true,
    }).start();
  }, [fadeAnim]);

  const updatePreference = <K extends keyof AccessibilityPreferences>(key: K, value: AccessibilityPreferences[K]) => {
    setPreferences(prev => ({ ...prev, [key]: value }));
  };

  const tasks = useMemo(() => [
    { id: 1, title: 'Ler e-mail', done: false },
    { id: 2, title: 'Pagar conta', done: true },
  ], []);

  const handleOnboardingNext = () => {
    if (onboardingStep < 2) {
      setOnboardingStep(prev => prev + 1);
      return;
    }

    setShowOnboarding(false);
    setReminderMessage('Tudo pronto! Você pode começar com tranquilidade.');
  };

  return (
    <SafeAreaView style={[styles.safeArea, preferences.warmMode && styles.warmSafeArea]}>
      <ScrollView contentContainerStyle={styles.container}>
        {showOnboarding && (
          <Animated.View style={[styles.onboardingCard, { opacity: fadeAnim }]}>
            <Text style={styles.onboardingTitle}>Bem-vindo ao SeniorEase</Text>
            <Text style={styles.onboardingText}>
              {onboardingStep === 0 && 'Comece por um passo de cada vez. Aqui tudo é mais claro e seguro.'}
              {onboardingStep === 1 && 'Você pode ajustar letras, contraste e lembretes para se sentir mais confortável.'}
              {onboardingStep === 2 && 'Pronto para organizar o seu dia com calma e confiança.'}
            </Text>
            <TouchableOpacity style={styles.button} accessibilityRole="button" onPress={handleOnboardingNext}>
              <Text style={styles.buttonText}>{onboardingStep === 2 ? 'Começar' : 'Próximo'}</Text>
            </TouchableOpacity>
          </Animated.View>
        )}

        <Text style={styles.title}>SeniorEase Mobile</Text>
        <Text style={styles.subtitle}>Acesso simples, feedback claro e rotina guiada.</Text>

        <View style={styles.tabRow}>
          {[
            { key: 'painel', label: 'Painel' },
            { key: 'tarefas', label: 'Tarefas' },
            { key: 'perfil', label: 'Perfil' },
          ].map(tab => (
            <TouchableOpacity key={tab.key} style={[styles.tab, activeView === tab.key && styles.activeTab]} onPress={() => setActiveView(tab.key as typeof activeView)}>
              <Text style={[styles.tabText, activeView === tab.key && styles.activeTabText]}>{tab.label}</Text>
            </TouchableOpacity>
          ))}
        </View>

        <View style={styles.card}>
          <Text style={styles.cardTitle}>{activeView === 'painel' ? 'Resumo do dia' : activeView === 'tarefas' ? 'Organizador simples' : 'Perfil do usuário'}</Text>
          <Text style={styles.cardText}>
            {activeView === 'painel' && 'Hoje você tem duas tarefas principais e um lembrete claro para seguir.'}
            {activeView === 'tarefas' && 'Conclua uma tarefa por vez com passos curtos e confirmados.'}
            {activeView === 'perfil' && 'Seu nome, função e preferências ficam prontos para usar.'}
          </Text>
        </View>

        {activeView === 'perfil' && (
          <View style={styles.card}>
            <TextInput style={styles.input} value={preferences.userName} onChangeText={(value) => updatePreference('userName', value)} placeholder="Nome" />
            <TextInput style={styles.input} value={preferences.userRole} onChangeText={(value) => updatePreference('userRole', value)} placeholder="Função" />
          </View>
        )}

        {activeView === 'tarefas' && (
          <View style={styles.card}>
            {tasks.map(task => (
              <View key={task.id} style={styles.taskItem}>
                <Text style={styles.taskTitle}>{task.title}</Text>
                <TouchableOpacity style={styles.smallButton} accessibilityRole="button">
                  <Text style={styles.smallButtonText}>{task.done ? 'Reabrir' : 'Concluir'}</Text>
                </TouchableOpacity>
              </View>
            ))}
          </View>
        )}

        <View style={styles.card}>
          <Text style={styles.cardTitle}>Preferências</Text>
          <View style={styles.row}>
            <Text style={styles.label}>Modo acolhedor</Text>
            <Switch value={preferences.warmMode} onValueChange={(value) => updatePreference('warmMode', value)} />
          </View>
          <View style={styles.row}>
            <Text style={styles.label}>Notificações</Text>
            <Switch value={preferences.notifications} onValueChange={(value) => updatePreference('notifications', value)} />
          </View>
        </View>

        <View style={styles.card}>
          <Text style={styles.cardTitle}>Lembrete</Text>
          <Text style={styles.cardText}>{reminderMessage}</Text>
        </View>

        <TouchableOpacity style={styles.button} accessibilityRole="button">
          <Text style={styles.buttonText}>Salvar</Text>
        </TouchableOpacity>

        <Text style={styles.info}>{savedMessage}</Text>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: '#f2f7ff' },
  warmSafeArea: { backgroundColor: '#fff7ed' },
  container: { padding: 24, gap: 16 },
  title: { fontSize: 28, fontWeight: '700', color: '#0f172a' },
  subtitle: { fontSize: 16, color: '#334155', marginTop: 8 },
  onboardingCard: { backgroundColor: '#eff6ff', borderRadius: 24, padding: 20, marginBottom: 8, borderWidth: 1, borderColor: '#93c5fd' },
  onboardingTitle: { fontSize: 20, fontWeight: '800', color: '#1d4ed8' },
  onboardingText: { fontSize: 15, color: '#1e3a8a', marginTop: 8, lineHeight: 22 },
  card: { backgroundColor: '#ffffff', borderRadius: 20, padding: 18, marginTop: 12, borderWidth: 1, borderColor: '#e2e8f0' },
  cardTitle: { fontSize: 18, fontWeight: '700', color: '#0f172a' },
  cardText: { fontSize: 15, color: '#475569', marginTop: 6 },
  input: { borderWidth: 1, borderColor: '#cbd5e1', borderRadius: 12, padding: 12, marginTop: 8 },
  row: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginTop: 10 },
  label: { fontSize: 15, color: '#0f172a' },
  tabRow: { flexDirection: 'row', gap: 8, marginTop: 12 },
  tab: { flex: 1, paddingVertical: 10, borderRadius: 999, backgroundColor: '#e2e8f0', alignItems: 'center' },
  activeTab: { backgroundColor: '#2563eb' },
  tabText: { fontWeight: '700', color: '#334155' },
  activeTabText: { color: '#ffffff' },
  taskItem: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingVertical: 10 },
  taskTitle: { fontSize: 15, color: '#0f172a', fontWeight: '600' },
  smallButton: { backgroundColor: '#e0f2fe', paddingVertical: 8, paddingHorizontal: 12, borderRadius: 999 },
  smallButtonText: { color: '#0f172a', fontWeight: '700' },
  button: { marginTop: 20, backgroundColor: '#2563eb', paddingVertical: 14, borderRadius: 999, alignItems: 'center' },
  buttonText: { color: '#ffffff', fontWeight: '700', fontSize: 16 },
  info: { marginTop: 10, color: '#2563eb', fontWeight: '600' },
});
