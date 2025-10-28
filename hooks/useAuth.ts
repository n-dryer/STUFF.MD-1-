import { useState, useEffect } from 'react';
import { auth, provider, signInWithPopup, signOut, onAuthStateChanged, FirebaseUser } from '../services/firebase';

export function useAuth() {
  const [user, setUser] = useState<FirebaseUser | null>(null);
  const [accessToken, setAccessToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      setUser(currentUser);
      if (currentUser) {
        const token = await currentUser.getIdToken();
        setAccessToken(token);
      } else {
        setAccessToken(null);
      }
      setIsLoading(false);
    });
    return () => unsubscribe();
  }, []);

  const login = async () => {
    try {
      await signInWithPopup(auth, provider);
    } catch (error) {
      console.error("Authentication error:", error);
      throw new Error('Login failed. Please try again.');
    }
  };

  const logout = async () => {
    await signOut(auth);
  };

  return { user, accessToken, isLoading, login, logout };
}
