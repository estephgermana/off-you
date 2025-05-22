import React, { createContext, useContext, useState, useEffect } from 'react';

interface AuthContextType {
  logado: boolean;
  login: (token: string) => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [logado, setLogado] = useState<boolean>(false);

  useEffect(() => {
    const token = localStorage.getItem('token');
    setLogado(!!token);
  }, []);

  const login = (token: string) => {
    localStorage.setItem('token', token);
    setLogado(true);
  };

  const logout = () => {
    localStorage.removeItem('token');
    setLogado(false);
  };

  return (
    <AuthContext.Provider value={{ logado, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth deve ser usado dentro de AuthProvider');
  return context;
};
