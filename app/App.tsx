import React, { useEffect, useMemo, useState } from 'react';
import { Animated, SafeAreaView, ScrollView, StyleSheet, Switch, Text, TextInput, TouchableOpacity, View } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { defaultPreferences, storageKey, type AccessibilityPreferences } from '../shared/preferences';
import { AsyncStoragePreferencesAdapter } from '../shared/adapters/preferencesStorage';
import { LoadPreferencesUseCase } from '../shared/domain/useCases/loadPreferencesUseCase';
import { SavePreferencesUseCase } from '../shared/domain/useCases/savePreferencesUseCase';

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

const preferencesStorage = new AsyncStoragePreferencesAdapter(AsyncStorage);
const loadPreferencesUseCase = new LoadPreferencesUseCase(preferencesStorage);
const savePreferencesUseCase = new SavePreferencesUseCase(preferencesStorage);
const tasksStorageKey = 'seniorease.mobile.tasks';
const historyStorageKey = 'seniorease.mobile.history';
const onboardingStorageKey = 'seniorease.mobile.onboarding';

const starterTasks: Task[] = [
  { id: 1, title: 'Ler e-mail da faculdade', detail: 'Abrir confirmação e responder.', completed: false },
  { id: 2, title: 'Pagar conta da água', detail: 'Confirmar valor antes de pagar.', completed: true },
  { id: 3, title: 'Entrar no encontro virtual', detail: 'Abrir link e entrar 10 minutos antes.', completed: false },
];

const starterHistory: HistoryItem[] = [
  { id: 1, title: 'Olá, Maria!', detail: 'Seu perfil foi preparado com configurações simples.' },
  { id: 2, title: 'Tarefa concluída', detail: 'Você marcou a conta da água como resolvida.' },
];

export default function App() {
  const [preferences, setPreferences] = useState<AccessibilityPreferences>(defaultPreferences);
  const [savedMessage, setSavedMessage] = useState('Preferências salvas localmente');
  const [tasks, setTasks] = useState<Task[]>(starterTasks);
  const [history, setHistory] = useState<HistoryItem[]>(starterHistory);
  const [activeView, setActiveView] = useState<'painel' | 'tarefas' | 'perfil' | 'configuracoes'>('painel');
  const [reminderMessage, setReminderMessage] = useState('Lembrete: revise sua tarefa antes de continuar.');
  const [showOnboarding, setShowOnboarding] = useState(true);
  const [onboardingStep, setOnboardingStep] = useState(0);
  const [confirmAction, setConfirmAction] = useState<string | null>(null);
  const [confirmTaskId, setConfirmTaskId] = useState<number | null>(null);
  const [guidedTaskId, setGuidedTaskId] = useState<number | null>(null);
  const [guidedStep, setGuidedStep] = useState(0);
  const [fadeAnim] = useState(() => new Animated.Value(0));

  useEffect(() => {
    const loadData = async () => {
      const loadedPreferences = await loadPreferencesUseCase.execute(storageKey);
      setPreferences(loadedPreferences);

      const tasksValue = await AsyncStorage.getItem(tasksStorageKey);
      const historyValue = await AsyncStorage.getItem(historyStorageKey);
      const onboardingValue = await AsyncStorage.getItem(onboardingStorageKey);

      if (tasksValue) {
        setTasks(JSON.parse(tasksValue));
      }

      if (historyValue) {
        setHistory(JSON.parse(historyValue));
      }

      if (onboardingValue !== null) {
        setShowOnboarding(JSON.parse(onboardingValue));
      }
    };

    void loadData();
  }, []);

  useEffect(() => {
    const savePreferences = async () => {
      await savePreferencesUseCase.execute(storageKey, preferences);
      setSavedMessage('Preferências salvas localmente');
    };

    void savePreferences();
  }, [preferences]);

  useEffect(() => {
    const storeTasks = async () => {
      await AsyncStorage.setItem(tasksStorageKey, JSON.stringify(tasks));
    };

    void storeTasks();
  }, [tasks]);

  useEffect(() => {
    const storeHistory = async () => {
      await AsyncStorage.setItem(historyStorageKey, JSON.stringify(history));
    };

    void storeHistory();
  }, [history]);

  useEffect(() => {
    const storeOnboarding = async () => {
      await AsyncStorage.setItem(onboardingStorageKey, JSON.stringify(showOnboarding));
    };

    void storeOnboarding();
  }, [showOnboarding]);

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

  const appendHistory = (title: string, detail: string) => {
    setHistory(prev => [{ id: Date.now(), title, detail }, ...prev].slice(0, 6));
  };

  const completedCount = tasks.filter(task => task.completed).length;

  const checklistItems = useMemo(() => [
    { id: 'welcome', label: 'Primeiros passos', done: !showOnboarding },
    { id: 'task', label: 'Concluir uma tarefa', done: completedCount > 0 },
    { id: 'profile', label: 'Salvar perfil', done: preferences.userName !== defaultPreferences.userName || preferences.userRole !== defaultPreferences.userRole },
  ], [completedCount, preferences.userName, preferences.userRole, showOnboarding]);

  const toggleTask = (task: Task, skipConfirmation = false) => {
    if (!skipConfirmation && task.title.includes('água') && preferences.extraConfirmation) {
      setConfirmTaskId(task.id);
      setConfirmAction(`Deseja marcar '${task.title}' como ${task.completed ? 'não concluída' : 'concluída'}?`);
      return;
    }

    const nextCompleted = !task.completed;
    setTasks(prev => prev.map(item => item.id === task.id ? { ...item, completed: nextCompleted } : item));
    appendHistory('Tarefa atualizada', `A tarefa '${task.title}' foi ${nextCompleted ? 'concluída' : 'reaberta'}.`);
    setReminderMessage(`Tarefa ${nextCompleted ? 'concluída' : 'reaberta'} com sucesso.`);
  };

  const confirmTaskToggle = () => {
    if (confirmTaskId === null) return;
    const task = tasks.find(item => item.id === confirmTaskId);
    if (!task) return;

    setConfirmAction(null);
    setConfirmTaskId(null);
    toggleTask(task, true);
  };

  const handleProfileSave = () => {
    appendHistory('Perfil salvo', 'O nome e a função foram atualizados com sucesso.');
    setSavedMessage('Perfil atualizado com sucesso');
  };

  const handleOnboardingNext = () => {
    if (onboardingStep < 2) {
      setOnboardingStep(prev => prev + 1);
      return;
    }

    setShowOnboarding(false);
    appendHistory('Boas-vindas concluídas', 'O guia inicial foi encerrado com calma.');
    setReminderMessage('Tudo pronto! Você pode começar com tranquilidade.');
  };

  const startGuidedFlow = (taskId: number) => {
    const task = tasks.find(item => item.id === taskId);
    if (!task) return;

    setGuidedTaskId(taskId);
    setGuidedStep(1);
    setReminderMessage(`Guia para ${task.title}: siga os passos com calma.`);
    setSavedMessage('Guia iniciado');
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

  const activeGuidedTask = tasks.find(task => task.id === guidedTaskId);

  return (
    <SafeAreaView style={[styles.safeArea, preferences.warmMode && styles.warmSafeArea]}>
      <ScrollView contentContainerStyle={styles.container}>
        {showOnboarding && (
          <Animated.View style={[styles.onboardingCard, { opacity: fadeAnim }]}>
            <Text style={styles.onboardingTitle}>Primeiros passos</Text>
            <Text style={styles.onboardingText}>
              {onboardingStep === 0 && 'Comece por um passo de cada vez. Aqui tudo é mais claro e seguro.'}
              {onboardingStep === 1 && 'Você pode ajustar letras, contraste e lembretes para se sentir mais confortável.'}
              {onboardingStep === 2 && 'Pronto para organizar o seu dia com calma e confiança.'}
            </Text>
            <View style={styles.dotRow}>
              {[0, 1, 2].map(step => (
                <View key={step} style={[styles.dot, onboardingStep === step && styles.dotActive]} />
              ))}
            </View>
            <TouchableOpacity style={styles.button} accessibilityRole="button" onPress={handleOnboardingNext}>
              <Text style={styles.buttonText}>{onboardingStep === 2 ? 'Começar a usar' : 'Próximo passo'}</Text>
            </TouchableOpacity>
          </Animated.View>
        )}

        <Text style={styles.title}>SeniorEase Mobile</Text>
        <Text style={styles.subtitle}>Uma experiência mais simples, segura e acolhedora.</Text>

        <View style={styles.tabRow}>
          {[
            { key: 'painel', label: 'Painel' },
            { key: 'tarefas', label: 'Tarefas' },
            { key: 'perfil', label: 'Perfil' },
            { key: 'configuracoes', label: 'Configurações' },
          ].map(tab => (
            <TouchableOpacity key={tab.key} style={[styles.tab, activeView === tab.key && styles.activeTab]} onPress={() => setActiveView(tab.key as typeof activeView)}>
              <Text style={[styles.tabText, activeView === tab.key && styles.activeTabText]}>{tab.label}</Text>
            </TouchableOpacity>
          ))}
        </View>

        <View style={styles.card}>
          <Text style={styles.cardTitle}>{activeView === 'painel' ? 'Resumo do dia' : activeView === 'tarefas' ? 'Organizador simples' : activeView === 'perfil' ? 'Perfil do usuário' : 'Painel de personalização'}</Text>
          <Text style={styles.cardText}>
            {activeView === 'painel' && 'Hoje você tem tarefas principais e um lembrete claro para seguir.'}
            {activeView === 'tarefas' && 'Conclua uma tarefa por vez com passos curtos e confirmados.'}
            {activeView === 'perfil' && 'Seu nome, função e preferências ficam prontos para usar.'}
            {activeView === 'configuracoes' && 'Adapte o espaço, a leitura e a segurança para o seu ritmo.'}
          </Text>
        </View>

        <View style={styles.card}>
          <Text style={styles.cardTitle}>Checklist do dia</Text>
          {checklistItems.map(item => (
            <View key={item.id} style={styles.checklistRow}>
              <Text style={styles.checkmark}>{item.done ? '✓' : '•'}</Text>
              <Text style={[styles.checklistLabel, item.done && styles.checklistDone]}>{item.label}</Text>
            </View>
          ))}
        </View>

        {activeView === 'perfil' && (
          <View style={styles.card}>
            <TextInput style={styles.input} value={preferences.userName} onChangeText={(value) => updatePreference('userName', value)} placeholder="Nome" />
            <TextInput style={styles.input} value={preferences.userRole} onChangeText={(value) => updatePreference('userRole', value)} placeholder="Função" />
            <Text style={styles.sectionLabel}>Modo de navegação</Text>
            <View style={styles.chipRow}>
              {(['simplificado', 'padrão'] as const).map(option => (
                <TouchableOpacity key={option} style={[styles.chip, preferences.navigationMode === option && styles.chipSelected]} onPress={() => updatePreference('navigationMode', option)}>
                  <Text style={[styles.chipText, preferences.navigationMode === option && styles.chipTextSelected]}>{option === 'simplificado' ? 'Simplificado' : 'Padrão'}</Text>
                </TouchableOpacity>
              ))}
            </View>
            <View style={styles.row}>
              <Text style={styles.label}>Notificações e lembretes</Text>
              <Switch value={preferences.notifications} onValueChange={(value) => updatePreference('notifications', value)} />
            </View>
          </View>
        )}

        {activeView === 'configuracoes' && (
          <View style={styles.card}>
            <Text style={styles.sectionLabel}>Contraste</Text>
            <View style={styles.chipRow}>
              {(['padrão', 'alto'] as const).map(option => (
                <TouchableOpacity key={option} style={[styles.chip, preferences.contrast === option && styles.chipSelected]} onPress={() => updatePreference('contrast', option)}>
                  <Text style={[styles.chipText, preferences.contrast === option && styles.chipTextSelected]}>{option === 'alto' ? 'Alto contraste' : 'Padrão'}</Text>
                </TouchableOpacity>
              ))}
            </View>
            <Text style={styles.sectionLabel}>Espaçamento</Text>
            <View style={styles.chipRow}>
              {(['compacto', 'amplo'] as const).map(option => (
                <TouchableOpacity key={option} style={[styles.chip, preferences.spacing === option && styles.chipSelected]} onPress={() => updatePreference('spacing', option)}>
                  <Text style={[styles.chipText, preferences.spacing === option && styles.chipTextSelected]}>{option === 'amplo' ? 'Espaçado' : 'Compacto'}</Text>
                </TouchableOpacity>
              ))}
            </View>
            <View style={styles.row}>
              <Text style={styles.label}>Modo simplificado</Text>
              <Switch value={preferences.simplifiedMode} onValueChange={(value) => updatePreference('simplifiedMode', value)} />
            </View>
            <View style={styles.row}>
              <Text style={styles.label}>Feedback visual reforçado</Text>
              <Switch value={preferences.visualFeedback} onValueChange={(value) => updatePreference('visualFeedback', value)} />
            </View>
            <View style={styles.row}>
              <Text style={styles.label}>Lembretes</Text>
              <Switch value={preferences.reminders} onValueChange={(value) => updatePreference('reminders', value)} />
            </View>
            <View style={styles.row}>
              <Text style={styles.label}>Modo acolhedor</Text>
              <Switch value={preferences.warmMode} onValueChange={(value) => updatePreference('warmMode', value)} />
            </View>
          </View>
        )}

        {activeView === 'tarefas' && (
          <View style={styles.card}>
            <View style={styles.statsRow}>
              <View style={styles.statCard}>
                <Text style={styles.statValue}>{completedCount}</Text>
                <Text style={styles.statLabel}>Concluídas</Text>
              </View>
              <View style={styles.statCard}>
                <Text style={styles.statValue}>{tasks.length}</Text>
                <Text style={styles.statLabel}>Total</Text>
              </View>
            </View>
            <TouchableOpacity style={[styles.button, styles.secondaryButton]} onPress={() => startGuidedFlow(tasks[0]?.id ?? 1)}>
              <Text style={styles.buttonText}>Ver passos</Text>
            </TouchableOpacity>

            {guidedTaskId !== null && (
              <View style={styles.guidedCard}>
                <Text style={styles.cardTitle}>Guia de tarefa</Text>
                <Text style={styles.cardText}>Etapa {guidedStep} de 3</Text>
                <Text style={styles.cardText}>
                  {guidedStep === 1 && `Comece por ${activeGuidedTask?.title ?? 'a tarefa selecionada'}. Leia o objetivo antes de avançar.`}
                  {guidedStep === 2 && 'Depois, confirme se a informação está correta e prossiga com calma.'}
                  {guidedStep === 3 && 'Por fim, marque a tarefa como concluída e revise o lembrete.'}
                </Text>
                <View style={styles.confirmActions}>
                  <TouchableOpacity style={styles.button} onPress={advanceGuidedFlow}>
                    <Text style={styles.buttonText}>{guidedStep === 3 ? 'Fechar guia' : 'Próximo passo'}</Text>
                  </TouchableOpacity>
                  <TouchableOpacity style={[styles.smallButton, styles.cancelButton]} onPress={() => { setGuidedTaskId(null); setGuidedStep(0); }}>
                    <Text style={styles.smallButtonText}>Cancelar</Text>
                  </TouchableOpacity>
                </View>
              </View>
            )}

            {tasks.map(task => (
              <View key={task.id} style={[styles.taskItem, task.completed && styles.taskDone]}>
                <View style={styles.taskTextBlock}>
                  <Text style={[styles.taskTitle, task.completed && styles.taskDoneTitle]}>{task.title}</Text>
                  <Text style={styles.cardText}>{task.detail}</Text>
                </View>
                <TouchableOpacity style={[styles.smallButton, task.completed ? styles.smallButtonDone : styles.smallButtonPending]} accessibilityRole="button" onPress={() => toggleTask(task)}>
                  <Text style={styles.smallButtonText}>{task.completed ? 'Reabrir' : 'Concluir'}</Text>
                </TouchableOpacity>
              </View>
            ))}
          </View>
        )}

        {activeView === 'painel' && (
          <View style={styles.card}>
            <View style={styles.statsRow}>
              <View style={styles.statCard}>
                <Text style={styles.statValue}>{completedCount}</Text>
                <Text style={styles.statLabel}>Tarefas concluídas</Text>
              </View>
              <View style={styles.statCard}>
                <Text style={styles.statValue}>{preferences.navigationMode === 'simplificado' ? 'Sim' : 'Não'}</Text>
                <Text style={styles.statLabel}>Modo simplificado</Text>
              </View>
            </View>
            <Text style={styles.info}>{preferences.extraConfirmation ? 'Confirmações extras ativas' : 'Confirmações extras desligadas'}</Text>
          </View>
        )}

        {confirmAction && (
          <View style={styles.confirmationCard}>
            <Text style={styles.cardTitle}>Confirmar ação</Text>
            <Text style={styles.cardText}>{confirmAction}</Text>
            <View style={styles.confirmActions}>
              <TouchableOpacity style={[styles.button, styles.confirmButton]} onPress={confirmTaskToggle}>
                <Text style={styles.buttonText}>Sim, confirmar</Text>
              </TouchableOpacity>
              <TouchableOpacity style={[styles.smallButton, styles.cancelButton]} onPress={() => { setConfirmAction(null); setConfirmTaskId(null); }}>
                <Text style={styles.smallButtonText}>Cancelar</Text>
              </TouchableOpacity>
            </View>
          </View>
        )}

        <View style={styles.card}>
          <Text style={styles.cardTitle}>Lembrete</Text>
          <Text style={styles.cardText}>{reminderMessage}</Text>
        </View>

        <View style={styles.historyCard}>
          <Text style={styles.cardTitle}>Histórico de atividades</Text>
          {history.map(item => (
            <View key={item.id} style={styles.historyItem}>
              <Text style={styles.historyItemTitle}>{item.title}</Text>
              <Text style={styles.cardText}>{item.detail}</Text>
            </View>
          ))}
        </View>

        <TouchableOpacity style={styles.button} accessibilityRole="button" onPress={handleProfileSave}>
          <Text style={styles.buttonText}>Salvar perfil</Text>
        </TouchableOpacity>

        <Text style={styles.info}>{savedMessage}</Text>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: '#f2f7ff' },
  warmSafeArea: { backgroundColor: '#fff7ed' },
  container: { padding: 24, paddingBottom: 48 },
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
  label: { fontSize: 15, color: '#0f172a', flex: 1, marginRight: 12 },
  tabRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 8, marginTop: 12 },
  tab: { flexBasis: '48%', paddingVertical: 10, borderRadius: 999, backgroundColor: '#e2e8f0', alignItems: 'center', marginBottom: 8 },
  activeTab: { backgroundColor: '#2563eb' },
  tabText: { fontWeight: '700', color: '#334155' },
  activeTabText: { color: '#ffffff' },
  taskItem: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingVertical: 10, marginBottom: 12 },
  taskTextBlock: { flex: 1, paddingRight: 12 },
  taskTitle: { fontSize: 15, color: '#0f172a', fontWeight: '600' },
  taskDone: { backgroundColor: '#dcfce7', borderRadius: 16, padding: 12 },
  taskDoneTitle: { textDecorationLine: 'line-through', color: '#166534' },
  smallButton: { backgroundColor: '#e0f2fe', paddingVertical: 8, paddingHorizontal: 12, borderRadius: 999 },
  smallButtonPending: { backgroundColor: '#e0f2fe' },
  smallButtonDone: { backgroundColor: '#d1fae5' },
  smallButtonText: { color: '#0f172a', fontWeight: '700' },
  button: { marginTop: 16, backgroundColor: '#2563eb', paddingVertical: 14, borderRadius: 999, alignItems: 'center' },
  secondaryButton: { backgroundColor: '#0f766e' },
  buttonText: { color: '#ffffff', fontWeight: '700', fontSize: 16 },
  info: { marginTop: 10, color: '#2563eb', fontWeight: '600' },
  historyCard: { marginTop: 12, backgroundColor: '#f8fafc', borderRadius: 18, padding: 14 },
  historyTitle: { fontSize: 16, fontWeight: '700', color: '#0f172a' },
  historyItem: { marginTop: 10 },
  historyItemTitle: { fontWeight: '700', color: '#0f172a' },
  confirmationCard: { backgroundColor: '#fef3c7', borderRadius: 20, padding: 18, borderWidth: 1, borderColor: '#fbbf24', marginTop: 16 },
  confirmActions: { flexDirection: 'row', gap: 8, marginTop: 12, flexWrap: 'wrap' },
  cancelButton: { backgroundColor: '#fef2f2' },
  confirmButton: { backgroundColor: '#16a34a' },
  dotRow: { flexDirection: 'row', marginTop: 12, gap: 8 },
  dot: { width: 10, height: 10, borderRadius: 999, backgroundColor: '#bfdbfe' },
  dotActive: { backgroundColor: '#2563eb' },
  sectionLabel: { fontSize: 15, color: '#0f172a', fontWeight: '700', marginTop: 12 },
  chipRow: { flexDirection: 'row', flexWrap: 'wrap', marginTop: 8, gap: 8 },
  chip: { paddingVertical: 8, paddingHorizontal: 12, borderRadius: 999, backgroundColor: '#e2e8f0' },
  chipSelected: { backgroundColor: '#2563eb' },
  chipText: { color: '#334155', fontWeight: '700' },
  chipTextSelected: { color: '#ffffff' },
  checklistRow: { flexDirection: 'row', alignItems: 'center', marginTop: 10 },
  checkmark: { fontSize: 18, color: '#2563eb', marginRight: 8, fontWeight: '700' },
  checklistLabel: { fontSize: 15, color: '#334155' },
  checklistDone: { color: '#166534', fontWeight: '700' },
  statsRow: { flexDirection: 'row', gap: 10, marginBottom: 8 },
  statCard: { flex: 1, backgroundColor: '#f8fafc', borderRadius: 16, padding: 12, alignItems: 'center' },
  statValue: { fontSize: 22, fontWeight: '700', color: '#0f172a' },
  statLabel: { fontSize: 13, color: '#64748b', marginTop: 4 },
  guidedCard: { backgroundColor: '#eff6ff', borderRadius: 18, padding: 14, marginTop: 12, borderWidth: 1, borderColor: '#93c5fd' },
});
