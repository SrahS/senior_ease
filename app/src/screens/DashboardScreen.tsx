import React, { useMemo } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useTasks } from '../hooks/useTasks';
import { usePreferences } from '../hooks/usePreferences';
import { useOnboarding } from '../hooks/useOnboarding';

export function DashboardScreen() {
  const { completedCount } = useTasks();
  const { preferences } = usePreferences();
  const { showOnboarding } = useOnboarding(() => {}); 

  const isAmplo = preferences.spacing === 'amplo';
  const isAltoContraste = preferences.contrast === 'alto';
  const isSimplificado = preferences.simplifiedMode;

  const checklistItems = useMemo(() => [
    { id: 'welcome', label: 'Primeiros passos', done: !showOnboarding },
    { id: 'task', label: 'Concluir uma tarefa', done: completedCount > 0 },
    { id: 'profile', label: 'Perfil salvo', done: preferences.userName !== '' },
  ], [completedCount, preferences.userName, showOnboarding]);

  return (
    <>
      <View style={[styles.card, isAmplo && styles.cardAmplo, isAltoContraste && styles.cardAltoContraste]}>
        <Text style={[styles.cardTitle, isAltoContraste && styles.textAltoContraste]}>Resumo do dia</Text>
        
        {!isSimplificado && (
          <Text style={[styles.cardText, isAltoContraste && styles.textAltoContraste]}>
            Hoje você tem tarefas principais e um lembrete claro para seguir.
          </Text>
        )}
      </View>

      <View style={[styles.card, isAmplo && styles.cardAmplo, isAltoContraste && styles.cardAltoContraste]}>
        <Text style={[styles.cardTitle, isAltoContraste && styles.textAltoContraste]}>Checklist do dia</Text>
        {checklistItems.map(item => (
          <View key={item.id} style={[styles.checklistRow, isAmplo && { marginTop: 16 }]}>
            <Text style={[styles.checkmark, isAltoContraste && styles.textAltoContraste]}>
              {item.done ? '✓' : '•'}
            </Text>
            <Text style={[
              styles.checklistLabel, 
              item.done && styles.checklistDone,
              isAltoContraste && styles.textAltoContraste // Força preto se alto contraste
            ]}>
              {item.label}
            </Text>
          </View>
        ))}
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  card: { backgroundColor: '#ffffff', borderRadius: 20, padding: 18, marginTop: 12, borderWidth: 1, borderColor: '#e2e8f0' },
  cardAmplo: { padding: 32, marginTop: 24 },
  cardAltoContraste: { borderColor: '#000000', borderWidth: 2, backgroundColor: '#ffffff' },
  textAltoContraste: { color: '#000000', fontWeight: '900' },
  
  cardTitle: { fontSize: 18, fontWeight: '700', color: '#0f172a' },
  cardText: { fontSize: 15, color: '#475569', marginTop: 6 },
  
  checklistRow: { flexDirection: 'row', alignItems: 'center', marginTop: 10 },
  checkmark: { fontSize: 18, color: '#2563eb', marginRight: 8, fontWeight: '700' },
  checklistLabel: { fontSize: 15, color: '#334155' },
  checklistDone: { color: '#166534', fontWeight: '700' },
});