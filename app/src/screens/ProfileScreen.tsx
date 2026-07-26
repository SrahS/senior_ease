import React, { useState } from 'react';
import { View, Text, TextInput, Switch, TouchableOpacity, StyleSheet } from 'react-native';
import { usePreferences } from '../hooks/usePreferences';
import { useHistory } from '../hooks/useHistory';

export function ProfileScreen() {
  const { preferences, updatePreference } = usePreferences();
  const { appendHistory } = useHistory();
  const [savedMessage, setSavedMessage] = useState('');

  const isAmplo = preferences.spacing === 'amplo';
  const isAltoContraste = preferences.contrast === 'alto';
  const isFeedback = preferences.visualFeedback;
  const isLembretes = preferences.reminders;

  const handleProfileSave = () => {
    appendHistory('Perfil salvo', 'O nome e a função foram atualizados com sucesso.');
    setSavedMessage('Perfil atualizado com sucesso');
    setTimeout(() => setSavedMessage(''), 3000); 
  };

  return (
    <>
      <View style={[styles.card, isAmplo && styles.cardAmplo, isAltoContraste && styles.cardAltoContraste]}>
        <Text style={[styles.cardTitle, isAltoContraste && styles.textAltoContraste, { marginBottom: 12 }]}>
          Perfil do usuário
        </Text>
        
        {!preferences.simplifiedMode && (
          <Text style={[styles.cardText, isAltoContraste && styles.textAltoContraste, { marginBottom: 16 }]}>
            Configure o nome, a função e o modo de navegação.
          </Text>
        )}
        
        <Text style={[styles.inputLabel, isAltoContraste && styles.textAltoContraste]}>Nome</Text>
        <TextInput 
          style={[
            styles.input, 
            isAmplo && styles.inputAmplo,
            isAltoContraste && styles.inputAltoContraste,
            isFeedback && styles.inputFeedback
          ]} 
          value={preferences.userName} 
          onChangeText={(value) => updatePreference('userName', value)} 
          placeholder="Ex: João da Silva" 
          placeholderTextColor={isAltoContraste ? '#475569' : '#94a3b8'}
        />
        
        <Text style={[styles.inputLabel, isAltoContraste && styles.textAltoContraste, { marginTop: 16 }]}>Função</Text>
        <TextInput 
          style={[
            styles.input, 
            isAmplo && styles.inputAmplo,
            isAltoContraste && styles.inputAltoContraste,
            isFeedback && styles.inputFeedback
          ]} 
          value={preferences.userRole} 
          onChangeText={(value) => updatePreference('userRole', value)} 
          placeholder="Ex: Aposentado, Voluntário..." 
          placeholderTextColor={isAltoContraste ? '#475569' : '#94a3b8'}
        />
        
        {}
        <Text style={[styles.inputLabel, isAltoContraste && styles.textAltoContraste, { marginTop: 24, marginBottom: 8 }]}>
          Modo de navegação
        </Text>
        <View style={styles.chipRow}>
          <TouchableOpacity 
            style={[
              styles.chip, 
              preferences.simplifiedMode && styles.chipSelected,
              isAltoContraste && styles.chipAltoContraste,
              isAltoContraste && preferences.simplifiedMode && styles.chipSelectedAltoContraste,
              isFeedback && preferences.simplifiedMode && styles.chipFeedback
            ]}
            onClick={() => updatePreference('simplifiedMode', true)}
            onPress={() => updatePreference('simplifiedMode', true)}
          >
            <Text style={[
              styles.chipText, 
              preferences.simplifiedMode && styles.chipTextSelected,
              isAltoContraste && styles.textAltoContraste,
              isAltoContraste && preferences.simplifiedMode && styles.textAltoContrasteBotao
            ]}>
              Simplificado
            </Text>
          </TouchableOpacity>

          <TouchableOpacity 
            style={[
              styles.chip, 
              !preferences.simplifiedMode && styles.chipSelected,
              isAltoContraste && styles.chipAltoContraste,
              isAltoContraste && !preferences.simplifiedMode && styles.chipSelectedAltoContraste,
              isFeedback && !preferences.simplifiedMode && styles.chipFeedback
            ]}
            onPress={() => updatePreference('simplifiedMode', false)}
          >
            <Text style={[
              styles.chipText, 
              !preferences.simplifiedMode && styles.chipTextSelected,
              isAltoContraste && styles.textAltoContraste,
              isAltoContraste && !preferences.simplifiedMode && styles.textAltoContrasteBotao
            ]}>
              Padrão
            </Text>
          </TouchableOpacity>
        </View>
        
        <View style={[styles.row, isAmplo && styles.rowAmplo, isFeedback && styles.rowFeedback]}>
          <Text style={[styles.label, isAltoContraste && styles.textAltoContraste]}>Notificações e lembretes</Text>
          <Switch 
            value={preferences.notifications} 
            onValueChange={(value) => updatePreference('notifications', value)} 
            trackColor={isAltoContraste ? { false: '#767577', true: '#000000' } : undefined}
          />
        </View>
      </View>

      <TouchableOpacity 
        style={[
          styles.button, 
          isAmplo && styles.buttonAmplo,
          isAltoContraste && styles.buttonAltoContraste,
          isFeedback && styles.buttonFeedback
        ]} 
        onPress={handleProfileSave}
      >
        <Text style={[styles.buttonText, isAltoContraste && styles.textAltoContrasteBotao]}>Salvar perfil</Text>
      </TouchableOpacity>

      {savedMessage ? <Text style={[styles.info, isAltoContraste && styles.textAltoContraste]}>{savedMessage}</Text> : null}

      {isLembretes && (
        <View style={[styles.lembreteCard, isAmplo && styles.cardAmplo, isAltoContraste && styles.cardAltoContraste]}>
          <Text style={[styles.cardTitle, isAltoContraste && styles.textAltoContraste]}>Dica</Text>
          <Text style={[styles.cardText, isAltoContraste && styles.textAltoContraste, { marginBottom: 0 }]}>
            Manter seu nome atualizado ajuda o aplicativo a interagir melhor com você no histórico.
          </Text>
        </View>
      )}
    </>
  );
}

const styles = StyleSheet.create({
  card: { backgroundColor: '#ffffff', borderRadius: 20, padding: 18, marginTop: 12, borderWidth: 1, borderColor: '#e2e8f0' },
  lembreteCard: { backgroundColor: '#eff6ff', borderRadius: 20, padding: 18, marginTop: 16, borderWidth: 1, borderColor: '#bfdbfe' },
  cardAmplo: { padding: 32, marginTop: 24 },
  
  cardAltoContraste: { borderColor: '#000000', borderWidth: 2, backgroundColor: '#ffffff' },
  textAltoContraste: { color: '#000000', fontWeight: '900' },
  textAltoContrasteBotao: { color: '#ffffff', fontWeight: '900' }, 
  
  cardTitle: { fontSize: 18, fontWeight: '700', color: '#0f172a' },
  cardText: { fontSize: 15, color: '#475569', marginTop: 6 },
  
  inputLabel: { fontSize: 14, fontWeight: '600', color: '#0f172a', marginBottom: 4 },
  input: { borderWidth: 1, borderColor: '#cbd5e1', borderRadius: 12, padding: 12, fontSize: 16 },
  inputAmplo: { padding: 18, fontSize: 16 },
  inputAltoContraste: { borderColor: '#000000', borderWidth: 2, color: '#000000', fontWeight: '700' },
  inputFeedback: { borderColor: '#1d4ed8', borderWidth: 2 },
  
  
  chipRow: { flexDirection: 'row', gap: 10, flexWrap: 'wrap' },
  chip: { backgroundColor: '#e2e8f0', paddingVertical: 10, paddingHorizontal: 16, borderRadius: 999, minHeight: 44, justifyContent: 'center' },
  chipSelected: { backgroundColor: '#2563eb' },
  chipAltoContraste: { backgroundColor: '#ffffff', borderWidth: 2, borderColor: '#000000' },
  chipSelectedAltoContraste: { backgroundColor: '#000000' },
  chipFeedback: { borderWidth: 3, borderColor: '#1d4ed8' },
  chipText: { fontSize: 15, fontWeight: '700', color: '#334155' },
  chipTextSelected: { color: '#ffffff' },
  
  row: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginTop: 24 },
  rowAmplo: { marginTop: 32 },
  rowFeedback: { backgroundColor: '#f8fafc', padding: 12, borderRadius: 12, borderWidth: 2, borderColor: '#bfdbfe' },
  label: { fontSize: 15, color: '#0f172a', flex: 1, marginRight: 12 },
  
  button: { marginTop: 16, backgroundColor: '#2563eb', paddingVertical: 14, borderRadius: 999, alignItems: 'center' },
  buttonAmplo: { paddingVertical: 20, marginTop: 24 },
  buttonAltoContraste: { backgroundColor: '#000000', borderWidth: 2, borderColor: '#000000' },
  buttonFeedback: { borderWidth: 3, borderColor: '#1e3a8a' },
  buttonText: { color: '#ffffff', fontWeight: '700', fontSize: 16 },
  
  info: { marginTop: 10, color: '#16a34a', fontWeight: '700', textAlign: 'center' },
});