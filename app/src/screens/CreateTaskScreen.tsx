import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet } from 'react-native';
import { Feather } from '@expo/vector-icons';
// import { useTasks } from '../hooks/useTasks';

export function CreateTaskScreen({ onBack }: { onBack: () => void }) {
  const [title, setTitle] = useState('');
  const [detail, setDetail] = useState('');
  // const { addTask } = useTasks();

  const handleSave = () => {
    if (!title) return;
    // addTask({ title, detail, completed: false });
    onBack(); // Volta para a tela anterior
  };

  return (
    <View style={styles.card}>
      <View style={styles.header}>
        <TouchableOpacity onPress={onBack} style={styles.backButton}>
          <Feather name="arrow-left" size={24} color="#0f172a" />
        </TouchableOpacity>
        <Text style={styles.cardTitle}>Nova Tarefa</Text>
      </View>

      <TextInput 
        style={styles.input} 
        placeholder="O que você precisa fazer?" 
        value={title}
        onChangeText={setTitle}
      />
      
      <TextInput 
        style={[styles.input, styles.textArea]} 
        placeholder="Detalhes adicionais (opcional)" 
        multiline
        numberOfLines={4}
        value={detail}
        onChangeText={setDetail}
      />

      <TouchableOpacity style={styles.button} onPress={handleSave}>
        <Text style={styles.buttonText}>Salvar Tarefa</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  card: { backgroundColor: '#ffffff', borderRadius: 20, padding: 18, marginTop: 12, borderWidth: 1, borderColor: '#e2e8f0' },
  header: { flexDirection: 'row', alignItems: 'center', marginBottom: 24 },
  backButton: { marginRight: 12, padding: 8, backgroundColor: '#f1f5f9', borderRadius: 999 },
  cardTitle: { fontSize: 20, fontWeight: '700', color: '#0f172a' },
  input: { borderWidth: 1, borderColor: '#cbd5e1', borderRadius: 12, padding: 16, marginTop: 12, fontSize: 16 },
  textArea: { height: 100, textAlignVertical: 'top' },
  button: { marginTop: 24, backgroundColor: '#2563eb', paddingVertical: 16, borderRadius: 999, alignItems: 'center' },
  buttonText: { color: '#ffffff', fontWeight: '700', fontSize: 16 },
});