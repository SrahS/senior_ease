import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, ActivityIndicator } from 'react-native';
import { signInWithEmailAndPassword, createUserWithEmailAndPassword } from 'firebase/auth';
import { auth } from '../../../shared/firebase/config';
import { usePreferences } from '../hooks/usePreferences';

interface AuthScreenProps {
  onLogin: () => void;
}

export function AuthScreen({ onLogin }: AuthScreenProps) {
  const { preferences } = usePreferences();
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const isAltoContraste = preferences.contrast === 'alto';
  const isAmplo = preferences.spacing === 'amplo';

  const handleAuth = async () => {
    if (!email || !password) {
      setErrorMsg('Por favor, preencha o e-mail e a senha.');
      return;
    }

    setLoading(true);
    setErrorMsg('');

    try {
      if (isLogin) {
        await signInWithEmailAndPassword(auth, email, password);
      } else {
        await createUserWithEmailAndPassword(auth, email, password);
      }
      onLogin();
    } catch (error: any) {
      if (error.code === 'auth/invalid-credential' || error.code === 'auth/user-not-found' || error.code === 'auth/wrong-password') {
        setErrorMsg('E-mail ou senha incorretos. Tente novamente.');
      } else if (error.code === 'auth/email-already-in-use') {
        setErrorMsg('Esse e-mail já tem conta. Toque em Entrar.');
      } else if (error.code === 'auth/weak-password') {
        setErrorMsg('Senha muito fraca. Use 6 números ou letras.');
      } else {
        setErrorMsg('Erro de conexão. Tente novamente.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={{ flex: 1, justifyContent: 'center', padding: 20, backgroundColor: isAltoContraste ? '#ffffff' : '#f8fafc' }}>
      <View style={[styles.card, isAltoContraste && styles.cardAltoContraste, isAmplo && { padding: 32 }]}>
        
        <Text style={[styles.title, isAltoContraste && styles.textAltoContraste]}>
          {isLogin ? 'Bem-vindo(a)!' : 'Criar nova conta'}
        </Text>
        <Text style={[styles.subtitle, isAltoContraste && styles.textAltoContraste]}>
          {isLogin ? 'Digite seu e-mail e senha para entrar.' : 'Preencha os dados abaixo para começar.'}
        </Text>

        <Text style={[styles.label, isAltoContraste && styles.textAltoContraste]}>Seu e-mail</Text>
        <TextInput 
          style={[styles.input, isAltoContraste && styles.inputAltoContraste, isAmplo && { padding: 16 }]} 
          value={email} 
          onChangeText={setEmail} 
          keyboardType="email-address"
          autoCapitalize="none"
          placeholder="Ex: joao@email.com"
        />

        <Text style={[styles.label, isAltoContraste && styles.textAltoContraste, { marginTop: 16 }]}>Sua senha</Text>
        <TextInput 
          style={[styles.input, isAltoContraste && styles.inputAltoContraste, isAmplo && { padding: 16 }]} 
          value={password} 
          onChangeText={setPassword} 
          secureTextEntry
          placeholder="Digite sua senha"
        />

        {errorMsg ? (
          <View style={styles.errorBox}>
            <Text style={styles.errorText}>{errorMsg}</Text>
          </View>
        ) : null}

        <TouchableOpacity 
          style={[styles.button, isAltoContraste && styles.buttonAltoContraste, isAmplo && { paddingVertical: 18 }]} 
          onPress={handleAuth}
          disabled={loading}
        >
          {loading ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <Text style={styles.buttonText}>{isLogin ? 'Entrar no aplicativo' : 'Criar minha conta'}</Text>
          )}
        </TouchableOpacity>

        <TouchableOpacity onPress={() => { setIsLogin(!isLogin); setErrorMsg(''); }} style={styles.switchButton}>
          <Text style={[styles.switchText, isAltoContraste && styles.textAltoContraste]}>
            {isLogin ? 'Não tem conta?' : 'Já tem conta?'}
          </Text>
        </TouchableOpacity>

      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: { backgroundColor: '#ffffff', borderRadius: 20, padding: 24, borderWidth: 1, borderColor: '#e2e8f0' },
  cardAltoContraste: { borderColor: '#000000', borderWidth: 2 },
  
  title: { fontSize: 24, fontWeight: '700', color: '#0f172a', marginBottom: 8 },
  subtitle: { fontSize: 16, color: '#475569', marginBottom: 24 },
  
  textAltoContraste: { color: '#000000', fontWeight: '900' },
  
  label: { fontSize: 16, fontWeight: '600', color: '#0f172a', marginBottom: 8 },
  input: { borderWidth: 1, borderColor: '#cbd5e1', borderRadius: 12, padding: 14, fontSize: 16, backgroundColor: '#f8fafc' },
  inputAltoContraste: { borderColor: '#000000', borderWidth: 2, color: '#000000', backgroundColor: '#ffffff' },
  
  errorBox: { backgroundColor: '#fee2e2', padding: 12, borderRadius: 8, marginTop: 16 },
  errorText: { color: '#991b1b', fontWeight: '700', fontSize: 15 },
  
  button: { backgroundColor: '#2563eb', paddingVertical: 16, borderRadius: 999, alignItems: 'center', marginTop: 24 },
  buttonAltoContraste: { backgroundColor: '#000000', borderWidth: 2, borderColor: '#000000' },
  buttonText: { color: '#ffffff', fontWeight: '700', fontSize: 18 },
  
  switchButton: { marginTop: 20, alignItems: 'center', padding: 10 },
  switchText: { color: '#2563eb', fontSize: 16, fontWeight: '700' }
});