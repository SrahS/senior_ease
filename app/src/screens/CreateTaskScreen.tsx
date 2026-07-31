import React, { useState } from 'react';
import { ActivityIndicator, View, Text, TextInput, TouchableOpacity, StyleSheet } from 'react-native';
import { Feather } from '@expo/vector-icons';

interface CreateTaskScreenProps {
  onBack: () => void;
  onSave: (title: string, detail: string) => Promise<unknown>;
}

export function CreateTaskScreen({ onBack, onSave }: CreateTaskScreenProps) {
  const [title, setTitle] = useState('');
  const [detail, setDetail] = useState('');
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSave = async () => {
    const normalizedTitle = title.trim();
    if (!normalizedTitle) {
      setError('Informe o que você precisa fazer.');
      return;
    }

    setIsSaving(true);
    setError(null);

    try {
      await onSave(normalizedTitle, detail);
      setTitle('');
      setDetail('');
      onBack();
    } catch {
      setError('Não foi possível salvar a tarefa. Tente novamente.');
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <View style={styles.card}>
      <View style={styles.header}>
        <TouchableOpacity onPress={onBack} style={styles.backButton} disabled={isSaving}>
          <Feather name="arrow-left" size={24} color="#0f172a" />
        </TouchableOpacity>
        <Text style={styles.cardTitle}>Nova Tarefa</Text>
      </View>

      <TextInput 
        style={styles.input} 
        placeholder="O que você precisa fazer?" 
        value={title}
        onChangeText={(value) => {
          setTitle(value);
          if (error) setError(null);
        }}
        editable={!isSaving}
      />
      
      <TextInput 
        style={[styles.input, styles.textArea]} 
        placeholder="Detalhes adicionais (opcional)" 
        multiline
        numberOfLines={4}
        value={detail}
        onChangeText={setDetail}
        editable={!isSaving}
      />

      {error && (
        <Text accessibilityRole="alert" style={styles.errorText}>
          {error}
        </Text>
      )}

      <TouchableOpacity
        style={[styles.button, isSaving && styles.buttonDisabled]}
        onPress={handleSave}
        disabled={isSaving}
        accessibilityState={{ disabled: isSaving, busy: isSaving }}
      >
        {isSaving ? <ActivityIndicator color="#ffffff" /> : <Text style={styles.buttonText}>Salvar Tarefa</Text>}
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
  buttonDisabled: { opacity: 0.65 },
  buttonText: { color: '#ffffff', fontWeight: '700', fontSize: 16 },
  errorText: { color: '#991b1b', fontWeight: '700', marginTop: 16 },
});