import React, { useState } from 'react';
import { View, Text, TextInput, Switch, TouchableOpacity, StyleSheet } from 'react-native';
import { usePreferences } from '../hooks/usePreferences';
import { useHistory } from '../hooks/useHistory';

export function ProfileScreen() {
  const { preferences, updatePreference } = usePreferences();
  const { appendHistory } = useHistory();
  const [savedMessage, setSavedMessage] = useState('');

  // Lendo o estado global
  const isAmplo = preferences.spacing === 'amplo';
  const isAltoContraste = preferences.contrast === 'alto';
  const isSimplificado = preferences.simplifiedMode;
  const isFeedback = preferences.visualFeedback;
  const isLembretes = preferences.reminders;

  const handleProfileSave = () => {
    appendHistory('Perfil salvo', 'O nome e a função foram atualizados com sucesso.');
    setSavedMessage('Perfil atualizado com sucesso');
    setTimeout(() => setSavedMessage(''), 3000); 
  };

  return (
    <>
      <View style={[
        styles.card, 
        isAmplo && styles.cardAmplo, 
        isAltoContraste && styles.cardAltoContraste
      ]}>
        <Text style={[styles.cardTitle, isAltoContraste && styles.textAltoContraste, { marginBottom: 12 }]}>
          Perfil do usuário
        </Text>
        
        {/* Oculta explicação se modo simplificado estiver ativo */}
        {!isSimplificado && (
          <Text style={[styles.cardText, isAltoContraste && styles.textAltoContraste, { marginBottom: 16 }]}>
            Preencha seus dados para que a experiência seja personalizada.
          </Text>
        )}
        
        <TextInput 
          style={[
            styles.input, 
            isAmplo && styles.inputAmplo,
            isAltoContraste && styles.inputAltoContraste,
            isFeedback && styles.inputFeedback
          ]} 
          value={preferences.userName} 
          onChangeText={(value) => updatePreference('userName', value)} 
          placeholder="Nome" 
          placeholderTextColor={isAltoContraste ? '#475569' : '#94a3b8'}
        />
        
        <TextInput 
          style={[
            styles.input, 
            isAmplo && styles.inputAmplo,
            isAltoContraste && styles.inputAltoContraste,
            isFeedback && styles.inputFeedback
          ]} 
          value={preferences.userRole} 
          onChangeText={(value) => updatePreference('userRole', value)} 
          placeholder="Função" 
          placeholderTextColor={isAltoContraste ? '#475569' : '#94a3b8'}
        />
        
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

      {/* LEMBRETE: Dica útil se a opção estiver ativada */}
      {isLembretes && (
        <View style={[styles.lembreteCard, isAmplo && styles.cardAmplo, isAltoContraste && styles.cardAltoContraste]}>
          <Text style={[styles.cardTitle, isAltoContraste && styles.textAltoContraste]}>Dica de Perfil</Text>
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
  
  input: { borderWidth: 1, borderColor: '#cbd5e1', borderRadius: 12, padding: 12, marginTop: 8 },
  inputAmplo: { padding: 18, fontSize: 16, marginTop: 12 },
  inputAltoContraste: { borderColor: '#000000', borderWidth: 2, color: '#000000', fontWeight: '700' },
  inputFeedback: { borderColor: '#1d4ed8', borderWidth: 2 },
  
  row: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginTop: 16 },
  rowAmplo: { marginTop: 24 },
  rowFeedback: { backgroundColor: '#f8fafc', padding: 12, borderRadius: 12 },
  
  button: { marginTop: 16, backgroundColor: '#2563eb', paddingVertical: 14, borderRadius: 999, alignItems: 'center' },
  buttonAmplo: { paddingVertical: 20, marginTop: 24 },
  buttonAltoContraste: { backgroundColor: '#000000', borderWidth: 2, borderColor: '#000000' },
  buttonFeedback: { borderWidth: 3, borderColor: '#1e3a8a' },
  
  cardTitle: { fontSize: 18, fontWeight: '700', color: '#0f172a' },
  cardText: { fontSize: 15, color: '#475569', marginTop: 6 },
  label: { fontSize: 15, color: '#0f172a', flex: 1, marginRight: 12 },
  buttonText: { color: '#ffffff', fontWeight: '700', fontSize: 16 },
  info: { marginTop: 10, color: '#2563eb', fontWeight: '600', textAlign: 'center' },
});