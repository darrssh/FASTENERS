import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from 'react';
import { fetchMe, getToken, login as apiLogin, setToken } from '../lib/api';

type AuthValue = {
  email: string | null;
  isAdmin: boolean;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
};

const AuthContext = createContext<AuthValue | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [email, setEmail] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  // Validate any stored token on first load.
  useEffect(() => {
    let cancelled = false;
    (async () => {
      if (!getToken()) {
        setLoading(false);
        return;
      }
      try {
        const me = await fetchMe();
        if (!cancelled) setEmail(me.email);
      } catch {
        if (!cancelled) {
          setToken(null);
          setEmail(null);
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  const login = useCallback(async (emailInput: string, password: string) => {
    const res = await apiLogin(emailInput.trim(), password);
    setToken(res.accessToken);
    setEmail(res.email);
  }, []);

  const logout = useCallback(() => {
    setToken(null);
    setEmail(null);
  }, []);

  const value = useMemo<AuthValue>(
    () => ({ email, isAdmin: Boolean(email), loading, login, logout }),
    [email, loading, login, logout],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth(): AuthValue {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used inside AuthProvider');
  return ctx;
}
