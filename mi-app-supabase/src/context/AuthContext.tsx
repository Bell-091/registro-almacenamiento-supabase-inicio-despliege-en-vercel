import {
  createContext,
  useContext,
  useEffect,
  useState,
  useRef,
  type ReactNode,
} from 'react';
import { supabase } from '../lib/supabaseClient';
import type { Session, User } from '@supabase/supabase-js';
import type { AuthCredentials, AuthContextType, Profile } from '../types';

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [session, setSession] = useState<Session | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);
  
  // Refs para rastrear el estado anterior y evitar actualizaciones/loops
  const lastSessionToken = useRef<string | null>(null);
  const lastUserId = useRef<string | null>(null);

  const fetchProfile = async (userId: string) => {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('username')
        .eq('id', userId)
        .maybeSingle();

      if (error) {
        console.error('Error fetching profile:', error);
        return;
      }
      setProfile(data);
    } catch (error) {
      console.error('Error inesperado fetching profile:', error);
    }
  };

  useEffect(() => {
    let mounted = true;

    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (_event, session) => {
        if (!mounted) return;

        const currentToken = session?.access_token ?? null;
        const currentUser = session?.user ?? null;
        const currentUserId = currentUser?.id ?? null;

        // 1. Estabilizar sesión: solo actualizar si el token ha cambiado
        // Esto evita re-renders innecesarios cuando Supabase emite eventos duplicados
        if (currentToken !== lastSessionToken.current) {
          lastSessionToken.current = currentToken;
          setSession(session);
        }

        // 2. Estabilizar usuario: solo actualizar si el ID ha cambiado
        // Esto es CRÍTICO: evita que componentes como TimeDifferenceCalculator
        // vuelvan a ejecutar sus efectos (fetchHistorial) repetidamente.
        if (currentUserId !== lastUserId.current) {
          lastUserId.current = currentUserId;
          setUser(currentUser);

          if (currentUserId) {
            fetchProfile(currentUserId);
          } else {
            setProfile(null);
          }
        }
        
        setLoading(false);
      }
    );

    return () => {
      mounted = false;
      subscription.unsubscribe();
    };
  }, []);

  const value: AuthContextType = {
    session,
    user,
    profile,
    loading,
    fetchProfile,
    signUp: (credentials: AuthCredentials) =>
      supabase.auth.signUp({
        email: credentials.email,
        password: credentials.password,
        options: {
          data: {
            username: credentials.username,
          },
        },
      }),
    signIn: (credentials: AuthCredentials) =>
      supabase.auth.signInWithPassword(credentials),
    signOut: () => supabase.auth.signOut(),
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
