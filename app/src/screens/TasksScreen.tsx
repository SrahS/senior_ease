import React, { useState } from 'react';
import { ActivityIndicator, View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { useHistory } from '../hooks/useHistory';
import { usePreferences } from '../hooks/usePreferences';
import { Feather } from '@expo/vector-icons';
import type { Task } from '../../../shared/domain/task';
import { ConfirmationModal } from '../components/ConfirmationModal';

interface TasksScreenProps {
  onViewChange: (view: 'criar_tarefa') => void;
  tasks: Task[];
  completedCount: number;
  isLoading: boolean;
  error: string | null;
  onToggleTask: (taskId: string) => Promise<void>;
}

export function TasksScreen({
  onViewChange,
  tasks,
  completedCount,
  isLoading,
  error,
  onToggleTask,
}: TasksScreenProps) {
  const { appendHistory } = useHistory();
  const { preferences } = usePreferences(); 
  const [isTogglingTask, setIsTogglingTask] = useState(false);
  const [taskAwaitingConfirmation, setTaskAwaitingConfirmation] = useState<Task | null>(null);

  const isAmplo = preferences.spacing === 'amplo';
  const isAltoContraste = preferences.contrast === 'alto';
  const isSimplificado = preferences.simplifiedMode;
  const isFeedback = preferences.visualFeedback;
  const isLembretes = preferences.reminders;

  const completeToggle = async (
    taskId: string,
    taskTitle: string,
    isCurrentlyCompleted: boolean,
  ) => {
    setIsTogglingTask(true);

    try {
      await onToggleTask(taskId);
      const nextStatus = isCurrentlyCompleted ? 'reaberta' : 'concluída';
      appendHistory('Tarefa atualizada', `A tarefa '${taskTitle}' foi ${nextStatus}.`);
    } catch {
      // The persistence error is exposed by the shared task state.
    } finally {
      setIsTogglingTask(false);
    }
  };

  const handleToggleTask = async (task: Task) => {
    if (task.important && !task.completed && preferences.extraConfirmation) {
      setTaskAwaitingConfirmation(task);
      return;
    }

    await completeToggle(task.id, task.title, task.completed);
  };

  const confirmTaskCompletion = async () => {
    if (!taskAwaitingConfirmation) {
      return;
    }

    const task = taskAwaitingConfirmation;
    setTaskAwaitingConfirmation(null);
    await completeToggle(task.id, task.title, task.completed);
  };

  return (
    <>
      <View style={[
        styles.card, 
        isAmplo && styles.cardAmplo, 
        isAltoContraste && styles.cardAltoContraste
      ]}>
        <View style={[styles.statsRow, isAmplo && { marginBottom: 24 }]}>
          <View style={[styles.statCard, isAltoContraste && styles.statCardAlto]}>
            <Text style={[styles.statValue, isAltoContraste && styles.textAltoContraste]}>{completedCount}</Text>
            <Text style={[styles.statLabel, isAltoContraste && styles.textAltoContraste]}>Concluídas</Text>
          </View>
          <View style={[styles.statCard, isAltoContraste && styles.statCardAlto]}>
            <Text style={[styles.statValue, isAltoContraste && styles.textAltoContraste]}>{tasks.length}</Text>
            <Text style={[styles.statLabel, isAltoContraste && styles.textAltoContraste]}>Total</Text>
          </View>
        </View>

        {isLoading && <ActivityIndicator size="large" color="#2563eb" />}

        {error && (
          <Text accessibilityRole="alert" style={styles.errorText}>
            {error}
          </Text>
        )}

        {tasks.map(task => (
          <View key={task.id} style={[
            styles.taskItem, 
            isAmplo && styles.taskItemAmplo,
            task.completed && styles.taskDone,
            task.completed && isAltoContraste && styles.taskDoneAltoContraste,
            isFeedback && styles.taskItemFeedback
          ]}>
            <View style={styles.taskTextBlock}>
              <Text style={[
                styles.taskTitle, 
                isAltoContraste && styles.textAltoContraste,
                task.completed && styles.taskDoneTitle,
                task.completed && isAltoContraste && { color: '#000000' }
              ]}>
                {task.title}
              </Text>
              {task.important && (
                <View
                  accessibilityLabel="Tarefa importante"
                  style={[styles.importantBadge, isAltoContraste && styles.importantBadgeAltoContraste]}
                >
                  <Feather name="alert-circle" size={16} color={isAltoContraste ? '#000000' : '#92400e'} />
                  <Text style={[styles.importantBadgeText, isAltoContraste && styles.textAltoContraste]}>
                    Importante
                  </Text>
                </View>
              )}
              
              {!isSimplificado && (
                <Text style={[styles.cardText, isAltoContraste && styles.textAltoContraste]}>
                  {task.detail}
                </Text>
              )}
            </View>
            
            <TouchableOpacity 
              style={[
                styles.smallButton, 
                task.completed ? styles.smallButtonDone : styles.smallButtonPending,
                isAmplo && { paddingVertical: 12, paddingHorizontal: 16 },
                isAltoContraste && { borderWidth: 2, borderColor: '#000000' }
              ]} 
              onPress={() => handleToggleTask(task)}
              disabled={isTogglingTask}
            >
              <Text style={[styles.smallButtonText, isAltoContraste && styles.textAltoContraste]}>
                {task.completed ? 'Reabrir' : 'Concluir'}
              </Text>
            </TouchableOpacity>
          </View>
        ))}
      </View>

      {isLembretes && tasks.length > completedCount && (
        <View style={[styles.lembreteCard, isAmplo && styles.cardAmplo, isAltoContraste && styles.cardAltoContraste]}>
          <Text style={[styles.cardTitle, isAltoContraste && styles.textAltoContraste]}>Lembrete de Tarefa</Text>
          <Text style={[styles.cardText, isAltoContraste && styles.textAltoContraste, { marginBottom: 0 }]}>
            Foque em concluir uma tarefa de cada vez. Quando terminar, aperte "Concluir" ao lado dela.
          </Text>
        </View>
      )}

      {/* Botão FAB Funcional e Seguro agora */}
      <TouchableOpacity 
        style={styles.fab} 
        onPress={() => onViewChange('criar_tarefa')}
      >
        <Feather name="plus" size={32} color="#ffffff" />
      </TouchableOpacity> 
      <ConfirmationModal
        visible={taskAwaitingConfirmation !== null}
        title="Concluir tarefa importante?"
        message={`Deseja marcar "${taskAwaitingConfirmation?.title ?? ''}" como concluída?`}
        onConfirm={confirmTaskCompletion}
        onCancel={() => setTaskAwaitingConfirmation(null)}
      />
    </>
  );
}

const styles = StyleSheet.create({
  card: { backgroundColor: '#ffffff', borderRadius: 20, padding: 18, marginTop: 12, borderWidth: 1, borderColor: '#e2e8f0' },
  lembreteCard: { backgroundColor: '#eff6ff', borderRadius: 20, padding: 18, marginTop: 16, borderWidth: 1, borderColor: '#bfdbfe' },
  
  cardAmplo: { padding: 32, marginTop: 24 },
  cardAltoContraste: { borderColor: '#000000', borderWidth: 2, backgroundColor: '#ffffff' },
  textAltoContraste: { color: '#000000', fontWeight: '900' },
  
  cardText: { fontSize: 15, color: '#475569', marginTop: 6 },
  cardTitle: { fontSize: 18, fontWeight: '700', color: '#0f172a' },
  errorText: { color: '#991b1b', fontWeight: '700', marginBottom: 12 },
  
  statsRow: { flexDirection: 'row', gap: 10, marginBottom: 16 },
  statCard: { flex: 1, backgroundColor: '#f8fafc', borderRadius: 16, padding: 12, alignItems: 'center' },
  statCardAlto: { backgroundColor: '#ffffff', borderWidth: 2, borderColor: '#000' },
  statValue: { fontSize: 22, fontWeight: '700', color: '#0f172a' },
  statLabel: { fontSize: 13, color: '#64748b', marginTop: 4 },
  
  taskItem: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingVertical: 10, marginBottom: 12 },
  taskItemAmplo: { paddingVertical: 16, marginBottom: 16 },
  taskItemFeedback: { borderBottomWidth: 1, borderBottomColor: '#cbd5e1', paddingBottom: 16 },
  taskTextBlock: { flex: 1, paddingRight: 12 },
  taskTitle: { fontSize: 15, color: '#0f172a', fontWeight: '600' },
  importantBadge: { alignSelf: 'flex-start', flexDirection: 'row', alignItems: 'center', gap: 4, backgroundColor: '#fef3c7', borderWidth: 1, borderColor: '#fbbf24', borderRadius: 999, paddingVertical: 4, paddingHorizontal: 8, marginTop: 8 },
  importantBadgeAltoContraste: { backgroundColor: '#ffffff', borderColor: '#000000', borderWidth: 2 },
  importantBadgeText: { color: '#92400e', fontSize: 13, fontWeight: '700' },
  
  taskDone: { backgroundColor: '#dcfce7', borderRadius: 16, padding: 12 },
  taskDoneAltoContraste: { backgroundColor: '#e5e7eb', borderWidth: 2, borderColor: '#000' },
  taskDoneTitle: { textDecorationLine: 'line-through', color: '#166534' },
  
  smallButton: { paddingVertical: 8, paddingHorizontal: 12, borderRadius: 999 },
  smallButtonPending: { backgroundColor: '#e0f2fe' },
  smallButtonDone: { backgroundColor: '#d1fae5' },
  smallButtonText: { color: '#0f172a', fontWeight: '700' },
  fab: {
    position: 'absolute',
    bottom: 24,
    right: 24,
    backgroundColor: '#2563eb',
    width: 64,
    height: 64,
    borderRadius: 32,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 6, 
    shadowColor: '#000', 
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
  },
});