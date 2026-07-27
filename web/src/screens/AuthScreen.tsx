import { useState } from 'react';
import { usePreferences } from '../contexts/PreferencesContext';
import { signInWithEmailAndPassword, createUserWithEmailAndPassword } from 'firebase/auth';
import { auth } from '../../../shared/firebase/config';

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
      console.error(error);
      if (error.code === 'auth/invalid-credential' || error.code === 'auth/user-not-found' || error.code === 'auth/wrong-password') {
        setErrorMsg('E-mail ou senha incorretos. Tente novamente.');
      } else if (error.code === 'auth/email-already-in-use') {
        setErrorMsg('Esse e-mail já tem uma conta. Tente entrar em vez de criar.');
      } else if (error.code === 'auth/weak-password') {
        setErrorMsg('A senha é muito fraca. Use pelo menos 6 números ou letras.');
      } else {
        setErrorMsg('Ocorreu um erro de conexão. Tente novamente mais tarde.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ maxWidth: '400px', margin: '40px auto', padding: '20px' }}>
      <section className="panel">
        <div className="panel-heading">
          <h2 style={{ fontSize: isAltoContraste ? '1.8rem' : '1.5rem', fontWeight: isAltoContraste ? '900' : '700' }}>
            {isLogin ? 'Bem-vindo(a)!' : 'Criar conta'}
          </h2>
          <p>
            {isLogin
              ? 'Digite seu e-mail e senha para entrar.'
              : 'Preencha os dados abaixo para começar a usar o aplicativo.'}
          </p>
        </div>

        <div className="control-group">
          <label htmlFor="email" style={{ fontWeight: isAltoContraste ? '900' : '600' }}>Seu e-mail</label>
          <input
            id="email"
            type="email"
            className="text-input"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Ex: joao@email.com"
          />
        </div>

        <div className="control-group">
          <label htmlFor="senha" style={{ fontWeight: isAltoContraste ? '900' : '600' }}>Sua senha</label>
          <input
            id="senha"
            type="password"
            className="text-input"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Digite sua senha"
          />
        </div>

        {errorMsg && (
          <div style={{ backgroundColor: '#fee2e2', color: '#991b1b', padding: '12px', borderRadius: '8px', marginBottom: '16px', fontWeight: 'bold' }}>
            {errorMsg}
          </div>
        )}

        <div style={{ display: 'flex', flexDirection: 'column', gap: '24px', marginTop: '32px' }}>
          <button
            className="primary-btn"
            style={{
              width: '100%',
              padding: '16px',
              fontSize: '1.2rem',
              borderRadius: '8px',
              opacity: loading ? 0.7 : 1
            }}
            onClick={handleAuth}
            disabled={loading}
          >
            {loading ? 'Aguarde...' : (isLogin ? 'Entrar no aplicativo' : 'Criar minha conta')}
          </button>

          <button
            onClick={() => { setIsLogin(!isLogin); setErrorMsg(''); }}
            style={{
              width: '100%',
              background: 'transparent',
              border: 'none',
              color: isAltoContraste ? '#000' : '#2563eb',
              fontWeight: 'bold',
              fontSize: '1.1rem',
              cursor: 'pointer',
              padding: '16px',
              textDecoration: 'underline'
            }}
          >
            {isLogin ? 'Não tem uma conta?' : 'Já tem uma conta?'}
          </button>
        </div>
      </section>
    </div>
  );
}