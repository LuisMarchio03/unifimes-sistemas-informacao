"use client";

import React, { createContext, useContext, useReducer, useEffect } from 'react';
import { User } from '@/lib/data/mock-data';

interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: Error | null;
}

type AuthAction =
  | { type: 'LOGIN_START' }
  | { type: 'LOGIN_SUCCESS'; payload: User }
  | { type: 'LOGIN_FAILURE'; payload: Error }
  | { type: 'LOGOUT' }
  | { type: 'UPDATE_USER'; payload: Partial<User> };

const initialState: AuthState = {
  user: null,
  isAuthenticated: false,
  isLoading: true,
  error: null,
};

const AuthContext = createContext<{
  state: AuthState;
  dispatch: React.Dispatch<AuthAction>;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
  updateProfile: (updates: Partial<User>) => Promise<void>;
} | null>(null);

function authReducer(state: AuthState, action: AuthAction): AuthState {
  switch (action.type) {
    case 'LOGIN_START':
      return {
        ...state,
        isLoading: true,
        error: null,
      };
    case 'LOGIN_SUCCESS':
      return {
        ...state,
        isAuthenticated: true,
        user: action.payload,
        isLoading: false,
        error: null,
      };
    case 'LOGIN_FAILURE':
      return {
        ...state,
        isAuthenticated: false,
        user: null,
        isLoading: false,
        error: action.payload,
      };
    case 'LOGOUT':
      return {
        ...state,
        isAuthenticated: false,
        user: null,
        isLoading: false,
        error: null,
      };
    case 'UPDATE_USER':
      return {
        ...state,
        user: state.user ? { ...state.user, ...action.payload } : null,
      };
    default:
      return state;
  }
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [state, dispatch] = useReducer(authReducer, initialState);

  // Simular verificação de sessão existente
  useEffect(() => {
    const checkAuth = async () => {
      try {
        dispatch({ type: 'LOGIN_START' });
        
        // Simular verificação de token/sessão
        const savedSession = localStorage.getItem('user_session');
        if (savedSession) {
          const userData = JSON.parse(savedSession);
          dispatch({ type: 'LOGIN_SUCCESS', payload: userData });
        } else {
          dispatch({ type: 'LOGOUT' });
        }
      } catch (error) {
        dispatch({ 
          type: 'LOGIN_FAILURE', 
          payload: error instanceof Error ? error : new Error('Erro na autenticação') 
        });
      }
    };

    checkAuth();
  }, []);

  const login = async (email: string, password: string) => {
    try {
      dispatch({ type: 'LOGIN_START' });
      
      // Simular chamada de API
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Mock de autenticação - em produção, isso seria uma chamada real à API
      if (email === 'demo@unifimes.edu.br' && password === 'senha123') {
        const userData: User = {
          id: "user1",
          name: "Usuário Demo",
          email: email,
          avatar: "UD",
          role: "Pesquisador",
          color: "bg-blue-500",
          joinDate: new Date().toISOString(),
          department: "Pesquisa",
          projects: [],
          skills: ["Pesquisa", "Análise de Dados"],
          workload: {
            allocated: 0,
            capacity: 40
          },
          stats: {
            completedTasks: 0,
            ongoingTasks: 0,
            totalHours: 0
          }
        };
        
        localStorage.setItem('user_session', JSON.stringify(userData));
        dispatch({ type: 'LOGIN_SUCCESS', payload: userData });
      } else {
        throw new Error('Credenciais inválidas');
      }
    } catch (error) {
      dispatch({ 
        type: 'LOGIN_FAILURE', 
        payload: error instanceof Error ? error : new Error('Erro no login') 
      });
      throw error;
    }
  };

  const logout = () => {
    localStorage.removeItem('user_session');
    dispatch({ type: 'LOGOUT' });
  };

  const updateProfile = async (updates: Partial<User>) => {
    try {
      if (!state.user) throw new Error('Usuário não autenticado');
      
      // Simular atualização na API
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const updatedUser = { ...state.user, ...updates };
      localStorage.setItem('user_session', JSON.stringify(updatedUser));
      dispatch({ type: 'UPDATE_USER', payload: updates });
    } catch (error) {
      throw error instanceof Error ? error : new Error('Erro ao atualizar perfil');
    }
  };

  return (
    <AuthContext.Provider value={{ state, dispatch, login, logout, updateProfile }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
