import { doc, getDoc, setDoc } from 'firebase/firestore';
import { db } from '../firebase/config';

export class FirebasePreferencesAdapter {
  private userId = "usuario_demo_123"; 

  async getItem(key: string): Promise<string | null> {
    try {
      const docRef = doc(db, "users", this.userId);
      const docSnap = await getDoc(docRef);
      
      if (docSnap.exists()) {
        const data = docSnap.data();
        return JSON.stringify(data[key]);
      }
      return null;
    } catch (error) {
      console.error("Erro ao buscar no Firebase:", error);
      return null;
    }
  }

  async setItem(key: string, value: string): Promise<void> {
    try {
      const docRef = doc(db, "users", this.userId);
      await setDoc(docRef, { [key]: JSON.parse(value) }, { merge: true });
    } catch (error) {
      console.error("Erro ao salvar no Firebase:", error);
    }
  }
}