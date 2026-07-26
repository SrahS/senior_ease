import { IAuthRepository, User } from '../domain/repositories/authRepository';
import { getAuth, signInWithEmailAndPassword, signOut } from 'firebase/auth';

export class FirebaseAuthAdapter implements IAuthRepository {
  private auth = getAuth();

  async signIn(email: string, password: string): Promise<User> {
    const credential = await signInWithEmailAndPassword(this.auth, email, password);
    return {
      id: credential.user.uid,
      email: credential.user.email || '',
      name: credential.user.displayName || 'Usuário',
    };
  }

  async signOut(): Promise<void> {
    await signOut(this.auth);
  }

  async getCurrentUser(): Promise<User | null> {
    const user = this.auth.currentUser;
    if (!user) return null;
    return { id: user.uid, email: user.email || '', name: user.displayName || '' };
  }
}