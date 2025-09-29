import type { Session, User, AuthError } from "@supabase/supabase-js";

export interface AuthCredentials {
    email: string;
    password: string;
    username?: string;
}

export interface Profile {
    username: string | null;
}

export interface AuthContextType {
    session: Session | null;
    user: User | null;
    profile: Profile | null;
    signUp: (credentials: AuthCredentials) => Promise<{ data: { user: User | null; session: Session | null; }; error: AuthError | null; }>;
    signIn: (credentials: AuthCredentials) => Promise<{ data: { user: User | null; session: Session | null; }; error: AuthError | null; }>;
    signOut: () => Promise<{ error: AuthError | null; }>;
    loading: boolean;
    fetchProfile: (userId: string) => void;
}