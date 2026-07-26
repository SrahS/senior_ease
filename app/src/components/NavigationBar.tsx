import React from 'react';
import { View, TouchableOpacity, Text, StyleSheet } from 'react-native';
import { Feather } from '@expo/vector-icons';

// Adicionamos a aba 'ajuda'
export type ActiveView = 'painel' | 'tarefas' | 'perfil' | 'configuracoes' | 'ajuda';

interface NavigationBarProps {
  activeView: ActiveView;
  onViewChange: (view: ActiveView) => void;
}

export function NavigationBar({ activeView, onViewChange }: NavigationBarProps) {
  const tabs = [
    { key: 'painel', label: 'Início', icon: 'home' },
    { key: 'tarefas', label: 'Tarefas', icon: 'check-square' },
    { key: 'perfil', label: 'Perfil', icon: 'user' },
    { key: 'configuracoes', label: 'Ajustes', icon: 'sliders' },
    { key: 'ajuda', label: 'Ajuda', icon: 'help-circle' },
  ] as const;

  return (
    <View style={styles.tabRow}>
      {tabs.map(tab => {
        const isActive = activeView === tab.key;
        return (
          <TouchableOpacity 
            key={tab.key} 
            style={[styles.tab, isActive && styles.activeTab]} 
            onPress={() => onViewChange(tab.key)}
          >
            {/* Ícone maior e acolhedor */}
            <Feather 
              name={tab.icon as any} 
              size={24} 
              color={isActive ? '#ffffff' : '#475569'} 
              style={{ marginBottom: 4 }} 
            />
            <Text style={[styles.tabText, isActive && styles.activeTabText]}>
              {tab.label}
            </Text>
          </TouchableOpacity>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  tabRow: { flexDirection: 'row', justifyContent: 'space-between', backgroundColor: '#ffffff', padding: 12, borderRadius: 24, elevation: 4, shadowColor: '#000', shadowOpacity: 0.1, shadowRadius: 10, marginBottom: 16 },
  tab: { flex: 1, paddingVertical: 10, borderRadius: 16, alignItems: 'center' },
  activeTab: { backgroundColor: '#2563eb' },
  tabText: { fontWeight: '700', color: '#475569', fontSize: 11, textAlign: 'center' },
  activeTabText: { color: '#ffffff' },
});