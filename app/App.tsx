import React from 'react';
import { SafeAreaView, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

export default function App() {
  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView contentContainerStyle={styles.container}>
        <Text style={styles.title}>SeniorEase Mobile</Text>
        <Text style={styles.subtitle}>Acesso simples, feedback claro e rotina guiada.</Text>

        <View style={styles.card}>
          <Text style={styles.cardTitle}>Painel de personalização</Text>
          <Text style={styles.cardText}>Ajuste fonte, contraste e modo simplificado com poucos passos.</Text>
        </View>

        <View style={styles.card}>
          <Text style={styles.cardTitle}>Organizador simplificado</Text>
          <Text style={styles.cardText}>Tarefas com confirmação e lembretes em linguagem direta.</Text>
        </View>

        <TouchableOpacity style={styles.button} accessibilityRole="button">
          <Text style={styles.buttonText}>Começar</Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: '#f2f7ff' },
  container: { padding: 24, gap: 16 },
  title: { fontSize: 28, fontWeight: '700', color: '#0f172a' },
  subtitle: { fontSize: 16, color: '#334155', marginTop: 8 },
  card: { backgroundColor: '#ffffff', borderRadius: 20, padding: 18, marginTop: 12 },
  cardTitle: { fontSize: 18, fontWeight: '700', color: '#0f172a' },
  cardText: { fontSize: 15, color: '#475569', marginTop: 6 },
  button: { marginTop: 20, backgroundColor: '#2563eb', paddingVertical: 14, borderRadius: 999, alignItems: 'center' },
  buttonText: { color: '#ffffff', fontWeight: '700', fontSize: 16 },
});
