import React from 'react';
import { View, Text, Switch, TouchableOpacity, StyleSheet, ScrollView } from 'react-native';
import { usePreferences } from '../hooks/usePreferences';

export function SettingsScreen() {
  const { preferences, updatePreference } = usePreferences();


  const isAmplo = preferences.spacing === 'amplo';
  const isAltoContraste = preferences.contrast === 'alto';
  const isSimplificado = preferences.simplifiedMode;
  const isFeedback = preferences.visualFeedback;
  const isLembretes = preferences.reminders;

  return (
    <ScrollView showsVerticalScrollIndicator={false}>
      <View style={[
        styles.card, 
        isAmplo && styles.cardAmplo, 
        isAltoContraste && styles.cardAltoContraste
      ]}>
        <Text style={[styles.cardTitle, isAltoContraste && styles.textAltoContraste]}>
          Painel de personalização
        </Text>
        
        {}
        {!isSimplificado && (
          <Text style={[styles.cardText, isAltoContraste && styles.textAltoContraste]}>
            Adapte o espaço, a leitura e a segurança para o seu ritmo.
          </Text>
        )}
        
        {}
        <Text style={[styles.sectionLabel, isAltoContraste && styles.textAltoContraste]}>
          Contraste
        </Text>
        <View style={styles.chipRow}>
          {(['padrão', 'alto'] as const).map(option => (
            <TouchableOpacity 
              key={option} 
              style={[
                styles.chip, 
                isAmplo && styles.chipAmplo,
                preferences.contrast === option && styles.chipSelected,
                preferences.contrast === option && isAltoContraste && styles.chipSelectedAlto,

                isFeedback && preferences.contrast === option && styles.chipFeedbackAtivo
              ]} 
              onPress={() => updatePreference('contrast', option)}
            >
              <Text style={[
                styles.chipText, 
                preferences.contrast === option && styles.chipTextSelected,
                isAltoContraste && !preferences.contrast && styles.textAltoContraste
              ]}>
                {option === 'alto' ? 'Alto contraste' : 'Padrão'}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        {}
        <Text style={[styles.sectionLabel, isAltoContraste && styles.textAltoContraste]}>
          Espaçamento
        </Text>
        <View style={styles.chipRow}>
          {(['compacto', 'amplo'] as const).map(option => (
            <TouchableOpacity 
              key={option} 
              style={[
                styles.chip, 
                isAmplo && styles.chipAmplo,
                preferences.spacing === option && styles.chipSelected,
                isAltoContraste && preferences.spacing === option && styles.chipSelectedAlto,

                isFeedback && preferences.spacing === option && styles.chipFeedbackAtivo
              ]} 
              onPress={() => updatePreference('spacing', option)}
            >
              <Text style={[
                styles.chipText, 
                preferences.spacing === option && styles.chipTextSelected
              ]}>
                {option === 'amplo' ? 'Espaçado' : 'Compacto'}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        <View style={styles.divider} />

        {}
        <View style={[styles.row, isAmplo && styles.rowAmplo, isFeedback && styles.rowFeedback]}>
          <Text style={[styles.label, isAltoContraste && styles.textAltoContraste]}>Modo simplificado</Text>
          <View style={styles.switchContainer}>
            {isFeedback && <Text style={styles.feedbackText}>{preferences.simplifiedMode ? 'LIGADO' : 'DESLIGADO'}</Text>}
            <Switch 
              value={preferences.simplifiedMode} 
              onValueChange={(value) => updatePreference('simplifiedMode', value)} 
              trackColor={isAltoContraste ? { false: '#767577', true: '#000000' } : undefined}
            />
          </View>
        </View>

        <View style={[styles.row, isAmplo && styles.rowAmplo, isFeedback && styles.rowFeedback]}>
          <Text style={[styles.label, isAltoContraste && styles.textAltoContraste]}>Feedback visual reforçado</Text>
          <View style={styles.switchContainer}>
            {isFeedback && <Text style={styles.feedbackText}>{preferences.visualFeedback ? 'LIGADO' : 'DESLIGADO'}</Text>}
            <Switch 
              value={preferences.visualFeedback} 
              onValueChange={(value) => updatePreference('visualFeedback', value)} 
              trackColor={isAltoContraste ? { false: '#767577', true: '#000000' } : undefined}
            />
          </View>
        </View>

        <View style={[styles.row, isAmplo && styles.rowAmplo, isFeedback && styles.rowFeedback]}>
          <Text style={[styles.label, isAltoContraste && styles.textAltoContraste]}>Lembretes</Text>
          <View style={styles.switchContainer}>
            {isFeedback && <Text style={styles.feedbackText}>{preferences.reminders ? 'LIGADO' : 'DESLIGADO'}</Text>}
            <Switch 
              value={preferences.reminders} 
              onValueChange={(value) => updatePreference('reminders', value)} 
              trackColor={isAltoContraste ? { false: '#767577', true: '#000000' } : undefined}
            />
          </View>
        </View>

        <View style={[styles.row, isAmplo && styles.rowAmplo, isFeedback && styles.rowFeedback]}>
          <Text style={[styles.label, isAltoContraste && styles.textAltoContraste]}>Confirmações extras</Text>
          <View style={styles.switchContainer}>
            {isFeedback && <Text style={styles.feedbackText}>{preferences.extraConfirmation ? 'LIGADO' : 'DESLIGADO'}</Text>}
            <Switch
              value={preferences.extraConfirmation}
              onValueChange={(value) => updatePreference('extraConfirmation', value)}
              trackColor={isAltoContraste ? { false: '#767577', true: '#000000' } : undefined}
              accessibilityLabel="Confirmações extras"
              accessibilityHint="Pede confirmação antes de concluir tarefas importantes."
            />
          </View>
        </View>

        <View style={[styles.row, isAmplo && styles.rowAmplo, isFeedback && styles.rowFeedback]}>
          <Text style={[styles.label, isAltoContraste && styles.textAltoContraste]}>Modo acolhedor</Text>
          <View style={styles.switchContainer}>
            {isFeedback && <Text style={styles.feedbackText}>{preferences.warmMode ? 'LIGADO' : 'DESLIGADO'}</Text>}
            <Switch 
              value={preferences.warmMode} 
              onValueChange={(value) => updatePreference('warmMode', value)} 
              trackColor={isAltoContraste ? { false: '#767577', true: '#000000' } : undefined}
            />
          </View>
        </View>
      </View>

      {}
      {isLembretes && (
        <View style={[
          styles.lembreteCard, 
          isAmplo && styles.cardAmplo,
          isAltoContraste && styles.cardAltoContraste
        ]}>
          <Text style={[styles.cardTitle, isAltoContraste && styles.textAltoContraste]}>Lembrete Ativo</Text>
          <Text style={[styles.cardText, isAltoContraste && styles.textAltoContraste, { marginBottom: 0 }]}>
            Suas alterações são salvas automaticamente assim que você clica. Você não precisa procurar um botão de salvar.
          </Text>
        </View>
      )}

    </ScrollView>
  );
}

const styles = StyleSheet.create({
  card: { backgroundColor: '#ffffff', borderRadius: 20, padding: 18, marginTop: 12, borderWidth: 1, borderColor: '#e2e8f0' },
  lembreteCard: { backgroundColor: '#eff6ff', borderRadius: 20, padding: 18, marginTop: 16, borderWidth: 1, borderColor: '#bfdbfe' },
  
  cardAmplo: { padding: 32, marginTop: 24 }, 
  cardAltoContraste: { borderColor: '#000000', borderWidth: 2, backgroundColor: '#ffffff' }, 
  textAltoContraste: { color: '#000000', fontWeight: '900' }, 
  chipAmplo: { paddingVertical: 14, paddingHorizontal: 20 }, 
  rowAmplo: { marginTop: 24 }, 
  chipSelectedAlto: { backgroundColor: '#000000' }, 
  

  chipFeedbackAtivo: { borderWidth: 3, borderColor: '#1d4ed8' },
  rowFeedback: { backgroundColor: '#f8fafc', padding: 12, borderRadius: 12, marginBottom: 8 },
  switchContainer: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  feedbackText: { fontSize: 12, fontWeight: '700', color: '#64748b' },

  divider: { height: 1, backgroundColor: '#e2e8f0', marginVertical: 16 },

  cardTitle: { fontSize: 18, fontWeight: '700', color: '#0f172a' },
  cardText: { fontSize: 15, color: '#475569', marginTop: 6, marginBottom: 12 },
  sectionLabel: { fontSize: 15, color: '#0f172a', fontWeight: '700', marginTop: 12 },
  chipRow: { flexDirection: 'row', flexWrap: 'wrap', marginTop: 8, gap: 8 },
  chip: { paddingVertical: 8, paddingHorizontal: 12, borderRadius: 999, backgroundColor: '#e2e8f0' },
  chipSelected: { backgroundColor: '#2563eb' },
  chipText: { color: '#334155', fontWeight: '700' },
  chipTextSelected: { color: '#ffffff' },
  row: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginTop: 16 },
  label: { fontSize: 15, color: '#0f172a', flex: 1, marginRight: 12 },
});