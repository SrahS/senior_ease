export interface User {
  id: string;
  email: string;
  name: string;
}

export interface IAuthRepository {
  signIn(email: string, password: string): Promise<User>;
  signOut(): Promise<void>;
  getCurrentUser(): Promise<User | null>;
}