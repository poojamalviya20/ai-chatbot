import { createContext, useContext, useState, ReactNode } from 'react';
import { jwtDecode } from 'jwt-decode';

interface User { id: number; name: string; email: string; }
interface AuthContextType {
  user: User | null;
  token: string | null;
  login: (token: string, user: User, rememberMe?: boolean) => void;
  logout: () => void;
}

interface JwtPayload {
  id: number;
  name: string;
  email: string;
}

const AuthContext = createContext<AuthContextType | null>(null);

// Token se user decode karo
const decodeUser = (token: string): User | null => {
  try {
    const decoded = jwtDecode<JwtPayload>(token);
    return { id: decoded.id, name: decoded.name, email: decoded.email };
  } catch {
    return null;
  }
};

export function AuthProvider({ children }: { children: ReactNode }) {
  const [token, setToken] = useState<string | null>(
    localStorage.getItem('token') || sessionStorage.getItem('token')
  );

  // User localStorage se nahi — token se decode hoga
  const [user, setUser] = useState<User | null>(() => {
    const t = localStorage.getItem('token') || sessionStorage.getItem('token');
    return t ? decodeUser(t) : null;
  });

  const login = (token: string, user: User, rememberMe: boolean = false) => {
    localStorage.removeItem('token');
    sessionStorage.removeItem('token');

    if (rememberMe) {
      localStorage.setItem('token', token);
    } else {
      sessionStorage.setItem('token', token);
    }

    setToken(token);
    setUser(user);
  };

  const logout = () => {
    localStorage.removeItem('token');
    sessionStorage.removeItem('token');
    setToken(null);
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, token, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext)!;