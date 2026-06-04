import { createContext, useContext, useEffect, useState, ReactNode } from "react";
import { Session, User } from "@supabase/supabase-js";
import {
  fetchUserProfileAndRoles,
  getSession,
  onAuthStateChange,
  signOut as authSignOut,
} from "@/services/auth/authService";
import type { Profile, Role } from "@/types/auth";

interface AuthContextValue {
  session: Session | null;
  user: User | null;
  profile: Profile | null;
  roles: Role[];
  isManager: boolean;
  loading: boolean;
  signOut: () => Promise<void>;
  refreshProfile: () => Promise<void>;
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [session, setSession] = useState<Session | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [roles, setRoles] = useState<Role[]>([]);
  const [loading, setLoading] = useState(true);

  const loadProfile = async (uid: string) => {
    const { profile: p, roles: r } = await fetchUserProfileAndRoles(uid);
    setProfile(p);
    setRoles(r);
  };

  useEffect(() => {
    const { data: { subscription } } = onAuthStateChange(async (evt, sess) => {
      // Handle expired refresh token
      if (evt === "TOKEN_REFRESHED" && !sess) {
        console.warn("Refresh token expired, forcing sign out");
        await authSignOut();
        setSession(null);
        setUser(null);
        setProfile(null);
        setRoles([]);
        window.location.href = "/auth?expired=true";
        return;
      }
      setSession(sess);
      setUser(sess?.user ?? null);
      if (sess?.user) {
        setTimeout(() => loadProfile(sess.user.id), 0);
      } else {
        setProfile(null);
        setRoles([]);
      }
    });

    getSession().then(({ data: { session: sess } }) => {
      setSession(sess);
      setUser(sess?.user ?? null);
      if (sess?.user) loadProfile(sess.user.id).finally(() => setLoading(false));
      else setLoading(false);
    });

    return () => subscription.unsubscribe();
  }, []);

  const signOut = async () => {
    await authSignOut();
  };

  const refreshProfile = async () => {
    if (user) await loadProfile(user.id);
  };

  return (
    <AuthContext.Provider value={{
      session, user, profile, roles,
      isManager: roles.includes("manager") || roles.includes("admin"),
      loading, signOut, refreshProfile,
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
};
