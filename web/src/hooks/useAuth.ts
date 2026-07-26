import { useState, useEffect } from 'react';
import { FirebaseAuthAdapter } from '../../../shared/adapters/firebaseAuthAdapter';
import { User } from '../../../shared/domain/repositories/authRepository';

// Instância do adaptador injetada
const authAdapter = new FirebaseAuthAdapter();

export function useAuth() {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Aqui você também pode configurar um listener onAuthStateChanged do Firebase
    authAdapter.getCurrentUser().then(loggedUser => {
      setUser(loggedUser);
      setIsLoading(false);
    });
  }, []);

  const login = async (email: string, pass: string) => {
    const loggedUser = await authAdapter.signIn(email, pass);
    setUser(loggedUser);
  };

  const logout = async () => {
    await authAdapter.signOut();
    setUser(null);
  };

  return { user, isLoading, login, logout };
}