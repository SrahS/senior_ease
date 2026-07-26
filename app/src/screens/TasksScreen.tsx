import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { useTasks } from '../hooks/useTasks';
import { useHistory } from '../hooks/useHistory';
import { usePreferences } from '../hooks/usePreferences';
import { Feather } from '@expo/vector-icons';

export function TasksScreen() {
  const { tasks, toggleTask, completedCount } = useTasks();
  const { appendHistory } = useHistory();
  const { preferences } = usePreferences(); 

  const isAmplo = preferences.spacing === 'amplo';
  const isAltoContraste = preferences.contrast === 'alto';
  const isSimplificado = preferences.simplifiedMode;
  const isFeedback = preferences.visualFeedback;
  const isLembretes = preferences.reminders;

  const handleToggleTask = (taskId: number, taskTitle: string, isCurrentlyCompleted: boolean) => {
    toggleTask(taskId);
    const nextStatus = isCurrentlyCompleted ? 'reaberta' : 'concluída';
    appendHistory('Tarefa atualizada', `A tarefa '${taskTitle}' foi ${nextStatus}.`);
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
                task.completed && isAltoContraste && { color: '#000000' } // Em alto contraste, o verde vira preto
              ]}>
                {task.title}
              </Text>
              
              {/* Oculta os detalhes para não sobrecarregar a tela se o modo for simplificado */}
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

      {/* Lembrete extra caso a pessoa não saiba o que fazer */}
      {isLembretes && tasks.length > completedCount && (
        <View style={[styles.lembreteCard, isAmplo && styles.cardAmplo, isAltoContraste && styles.cardAltoContraste]}>
          <Text style={[styles.cardTitle, isAltoContraste && styles.textAltoContraste]}>Lembrete de Tarefa</Text>
          <Text style={[styles.cardText, isAltoContraste && styles.textAltoContraste, { marginBottom: 0 }]}>
            Foque em concluir uma tarefa de cada vez. Quando terminar, aperte "Concluir" ao lado dela.
          </Text>
        </View>
      )}
  <TouchableOpacity 
    style={styles.fab} 
    onPress={() => onViewChange('criar_tarefa')}
  >
    <Feather name="plus" size={32} color="#ffffff" />
  </TouchableOpacity> 
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
  
  statsRow: { flexDirection: 'row', gap: 10, marginBottom: 16 },
  statCard: { flex: 1, backgroundColor: '#f8fafc', borderRadius: 16, padding: 12, alignItems: 'center' },
  statCardAlto: { backgroundColor: '#ffffff', borderWidth: 2, borderColor: '#000' },
  statValue: { fontSize: 22, fontWeight: '700', color: '#0f172a' },
  statLabel: { fontSize: 13, color: '#64748b', marginTop: 4 },
  
  taskItem: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingVertical: 10, marginBottom: 12 },
  taskItemAmplo: { paddingVertical: 16, marginBottom: 16 },
  taskItemFeedback: { borderBottomWidth: 1, borderBottomColor: '#cbd5e1', paddingBottom: 16 }, // Linha separadora forte
  taskTextBlock: { flex: 1, paddingRight: 12 },
  taskTitle: { fontSize: 15, color: '#0f172a', fontWeight: '600' },
  
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