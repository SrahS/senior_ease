import React, { useMemo } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Feather } from '@expo/vector-icons';
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
    { id: 'profile', label: 'Perfil salvo', done: preferences.userName.trim() !== '' },
  ], [completedCount, preferences.userName, showOnboarding]);


  const progresso = checklistItems.filter(item => item.done).length;
  const isTudoPronto = progresso === checklistItems.length;

  return (
    <>
      <View style={[styles.card, isAmplo && styles.cardAmplo, isAltoContraste && styles.cardAltoContraste]}>
        <Text style={[styles.cardTitle, isAltoContraste && styles.textAltoContraste]}>Resumo do dia</Text>
        
        {!isSimplificado && (
          <Text style={[styles.cardText, isAltoContraste && styles.textAltoContraste]}>
            Uma visão rápida para quem precisa de clareza e poucas etapas.
          </Text>
        )}
      </View>

      <View style={[
        styles.card, 
        isAmplo && styles.cardAmplo, 
        isAltoContraste ? styles.cardAltoContraste : (isTudoPronto ? styles.cardSucesso : null)
      ]}>
        <View style={styles.checklistHeader}>
          <Text style={[styles.cardTitle, isAltoContraste && styles.textAltoContraste]}>Checklist do dia</Text>
          <Text style={[
            styles.progressoText, 
            isTudoPronto && styles.progressoPronto,
            isAltoContraste && styles.textAltoContraste
          ]}>
            {progresso} de {checklistItems.length}
          </Text>
        </View>

        {checklistItems.map(item => (
          <View key={item.id} style={[styles.checklistRow, isAmplo && { marginTop: 16 }]}>
            <Feather 
              name={item.done ? 'check-circle' : 'circle'} 
              size={24} 
              color={isAltoContraste ? '#000000' : (item.done ? '#166534' : '#94a3b8')} 
            />
            <Text style={[
              styles.checklistLabel, 
              item.done && styles.checklistDone,
              isAltoContraste && styles.textAltoContraste
            ]}>
              {item.label}
            </Text>
          </View>
        ))}

        {isTudoPronto && (
          <Text style={[styles.sucessoMsg, isAltoContraste && styles.textAltoContraste]}>
            🎉 Muito bem! Você configurou tudo com sucesso.
          </Text>
        )}
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  card: { backgroundColor: '#ffffff', borderRadius: 20, padding: 18, marginTop: 12, borderWidth: 1, borderColor: '#e2e8f0' },
  cardAmplo: { padding: 32, marginTop: 24 },
  cardAltoContraste: { borderColor: '#000000', borderWidth: 2, backgroundColor: '#ffffff' },
  cardSucesso: { backgroundColor: '#dcfce7', borderColor: '#bbf7d0' },
  
  textAltoContraste: { color: '#000000', fontWeight: '900' },
  
  checklistHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 },
  cardTitle: { fontSize: 18, fontWeight: '700', color: '#0f172a' },
  cardText: { fontSize: 15, color: '#475569', marginTop: 6 },
  
  progressoText: { fontSize: 16, fontWeight: '700', color: '#a16207' },
  progressoPronto: { color: '#166534' },
  
  checklistRow: { flexDirection: 'row', alignItems: 'center', marginTop: 12 },
  checklistLabel: { fontSize: 16, color: '#334155', marginLeft: 10, fontWeight: '500' },
  checklistDone: { color: '#166534', fontWeight: '700', textDecorationLine: 'line-through' },
  
  sucessoMsg: { marginTop: 16, color: '#166534', fontWeight: '700', textAlign: 'center', fontSize: 15 },
});