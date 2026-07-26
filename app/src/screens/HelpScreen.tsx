import React from 'react';
import { View, Text, ScrollView, StyleSheet } from 'react-native';
import { Feather } from '@expo/vector-icons';
import { usePreferences } from '../hooks/usePreferences';

export function HelpScreen() {
  const { preferences } = usePreferences();

  const isAmplo = preferences.spacing === 'amplo';
  const isAltoContraste = preferences.contrast === 'alto';

  const tutoriais = [
    { icone: 'home', titulo: 'Início', texto: 'Aqui você vê o resumo do seu dia e confere se esqueceu de algo importante.' },
    { icone: 'check-square', titulo: 'Tarefas', texto: 'Sua lista de afazeres. Toque em "Concluir" quando terminar algo. Não tenha pressa.' },
    { icone: 'sliders', titulo: 'Ajustes', texto: 'Sinta-se livre para mudar o tamanho, as cores e ligar o modo simplificado se preferir menos informações.' },
    { icone: 'smile', titulo: 'Estamos com você', texto: 'Se errar, não tem problema. Suas informações estão seguras e você sempre pode voltar.' },
  ];

  return (
    <ScrollView showsVerticalScrollIndicator={false}>
      <View style={[styles.card, isAmplo && styles.cardAmplo, isAltoContraste && styles.cardAltoContraste]}>
        <Text style={[styles.title, isAltoContraste && styles.textAltoContraste]}>
          Como usar o aplicativo?
        </Text>
        <Text style={[styles.subtitle, isAltoContraste && styles.textAltoContraste]}>
          Um guia rápido e tranquilo para você aproveitar ao máximo.
        </Text>

        {tutoriais.map((item, index) => (
          <View key={index} style={[styles.tutorialItem, isAmplo && styles.tutorialItemAmplo]}>
            <View style={[styles.iconBox, isAltoContraste && styles.iconBoxAlto]}>
              <Feather name={item.icone as any} size={28} color={isAltoContraste ? '#000000' : '#2563eb'} />
            </View>
            <View style={styles.textContainer}>
              <Text style={[styles.itemTitle, isAltoContraste && styles.textAltoContraste]}>{item.titulo}</Text>
              <Text style={[styles.itemText, isAltoContraste && styles.textAltoContraste]}>{item.texto}</Text>
            </View>
          </View>
        ))}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  card: { backgroundColor: '#ffffff', borderRadius: 24, padding: 20, marginTop: 12, borderWidth: 1, borderColor: '#e2e8f0' },
  cardAmplo: { padding: 32, marginTop: 24 },
  cardAltoContraste: { borderColor: '#000000', borderWidth: 2, backgroundColor: '#ffffff' },
  textAltoContraste: { color: '#000000', fontWeight: '900' },
  
  title: { fontSize: 22, fontWeight: '800', color: '#1e3a8a', marginBottom: 8 },
  subtitle: { fontSize: 16, color: '#475569', marginBottom: 24 },
  
  tutorialItem: { flexDirection: 'row', alignItems: 'center', marginBottom: 20 },
  tutorialItemAmplo: { marginBottom: 32 },
  
  iconBox: { width: 56, height: 56, borderRadius: 16, backgroundColor: '#eff6ff', justifyContent: 'center', alignItems: 'center', marginRight: 16 },
  iconBoxAlto: { backgroundColor: '#e5e7eb', borderWidth: 2, borderColor: '#000000' },
  
  textContainer: { flex: 1 },
  itemTitle: { fontSize: 18, fontWeight: '700', color: '#0f172a', marginBottom: 4 },
  itemText: { fontSize: 15, color: '#475569', lineHeight: 22 },
});