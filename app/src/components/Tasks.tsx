import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { useHistory } from '../hooks/useHistory';
import { usePreferences } from '../hooks/usePreferences';
import type { Task } from '../../../shared/domain/task';

interface TasksProps {
  tasks: Task[];
  completedCount: number;
  onToggleTask: (taskId: string) => Promise<void>;
}

export function Tasks({ tasks, completedCount, onToggleTask }: TasksProps) {
  const { appendHistory } = useHistory();
  const { preferences } = usePreferences();


  const isAmplo = preferences.spacing === 'amplo';
  const isAltoContraste = preferences.contrast === 'alto';
  const isSimplificado = preferences.simplifiedMode;

  const handleToggleTask = async (
    taskId: string,
    taskTitle: string,
    isCurrentlyCompleted: boolean,
  ) => {
    try {
      await onToggleTask(taskId);
      const nextStatus = isCurrentlyCompleted ? 'reaberta' : 'concluída';
      appendHistory('Tarefa atualizada', `A tarefa '${taskTitle}' foi ${nextStatus}.`);
    } catch {
      // The parent exposes persistence errors to the user.
    }
  };

  return (
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

      {tasks.map(task => (
        <View key={task.id} style={[
          styles.taskItem, 
          isAmplo && styles.taskItemAmplo,
          task.completed && styles.taskDone,
          task.completed && isAltoContraste && styles.taskDoneAltoContraste
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
            
            {}
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
            onPress={() => handleToggleTask(task.id, task.title, task.completed)}
          >
            <Text style={[styles.smallButtonText, isAltoContraste && styles.textAltoContraste]}>
              {task.completed ? 'Reabrir' : 'Concluir'}
            </Text>
          </TouchableOpacity>
        </View>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  card: { backgroundColor: '#ffffff', borderRadius: 20, padding: 18, marginTop: 12, borderWidth: 1, borderColor: '#e2e8f0' },
  cardAmplo: { padding: 32, marginTop: 24 },
  cardAltoContraste: { borderColor: '#000000', borderWidth: 2, backgroundColor: '#ffffff' },
  textAltoContraste: { color: '#000000', fontWeight: '900' },
  
  cardText: { fontSize: 15, color: '#475569', marginTop: 6 },
  statsRow: { flexDirection: 'row', gap: 10, marginBottom: 16 },
  statCard: { flex: 1, backgroundColor: '#f8fafc', borderRadius: 16, padding: 12, alignItems: 'center' },
  statCardAlto: { backgroundColor: '#ffffff', borderWidth: 2, borderColor: '#000' },
  statValue: { fontSize: 22, fontWeight: '700', color: '#0f172a' },
  statLabel: { fontSize: 13, color: '#64748b', marginTop: 4 },
  
  taskItem: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingVertical: 10, marginBottom: 12 },
  taskItemAmplo: { paddingVertical: 16, marginBottom: 16 },
  taskTextBlock: { flex: 1, paddingRight: 12 },
  taskTitle: { fontSize: 15, color: '#0f172a', fontWeight: '600' },
  
  taskDone: { backgroundColor: '#dcfce7', borderRadius: 16, padding: 12 },
  taskDoneAltoContraste: { backgroundColor: '#e5e7eb', borderWidth: 2, borderColor: '#000' },
  taskDoneTitle: { textDecorationLine: 'line-through', color: '#166534' },
  
  smallButton: { paddingVertical: 8, paddingHorizontal: 12, borderRadius: 999 },
  smallButtonPending: { backgroundColor: '#e0f2fe' },
  smallButtonDone: { backgroundColor: '#d1fae5' },
  smallButtonText: { color: '#0f172a', fontWeight: '700' },
});