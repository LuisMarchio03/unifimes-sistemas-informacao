"use client";

import React, { createContext, useContext, useReducer, useEffect } from 'react';
import { User, Project, Task } from '@/lib/data/mock-data';

interface AppState {
  currentUser: User | null;
  isAuthenticated: boolean;
  projects: Project[];
  notifications: Notification[];
  isLoading: boolean;
  error: Error | null;
}

interface Notification {
  id: string;
  type: 'info' | 'success' | 'warning' | 'error';
  message: string;
  createdAt: Date;
  read: boolean;
}

type AppAction =
  | { type: 'SET_CURRENT_USER'; payload: User }
  | { type: 'SET_AUTHENTICATED'; payload: boolean }
  | { type: 'SET_PROJECTS'; payload: Project[] }
  | { type: 'ADD_PROJECT'; payload: Project }
  | { type: 'UPDATE_PROJECT'; payload: Project }
  | { type: 'REMOVE_PROJECT'; payload: string }
  | { type: 'ADD_NOTIFICATION'; payload: Notification }
  | { type: 'MARK_NOTIFICATION_READ'; payload: string }
  | { type: 'SET_LOADING'; payload: boolean }
  | { type: 'SET_ERROR'; payload: Error | null };

const initialState: AppState = {
  currentUser: null,
  isAuthenticated: false,
  projects: [],
  notifications: [],
  isLoading: false,
  error: null,
};

const AppContext = createContext<{
  state: AppState;
  dispatch: React.Dispatch<AppAction>;
} | null>(null);

function appReducer(state: AppState, action: AppAction): AppState {
  switch (action.type) {
    case 'SET_CURRENT_USER':
      return { ...state, currentUser: action.payload };
    case 'SET_AUTHENTICATED':
      return { ...state, isAuthenticated: action.payload };
    case 'SET_PROJECTS':
      return { ...state, projects: action.payload };
    case 'ADD_PROJECT':
      return { ...state, projects: [...state.projects, action.payload] };
    case 'UPDATE_PROJECT':
      return {
        ...state,
        projects: state.projects.map((p) =>
          p.id === action.payload.id ? action.payload : p
        ),
      };
    case 'REMOVE_PROJECT':
      return {
        ...state,
        projects: state.projects.filter((p) => p.id !== action.payload),
      };
    case 'ADD_NOTIFICATION':
      return {
        ...state,
        notifications: [action.payload, ...state.notifications],
      };
    case 'MARK_NOTIFICATION_READ':
      return {
        ...state,
        notifications: state.notifications.map((n) =>
          n.id === action.payload ? { ...n, read: true } : n
        ),
      };
    case 'SET_LOADING':
      return { ...state, isLoading: action.payload };
    case 'SET_ERROR':
      return { ...state, error: action.payload };
    default:
      return state;
  }
}

export function AppProvider({ children }: { children: React.ReactNode }) {
  const [state, dispatch] = useReducer(appReducer, initialState);

  // Exemplo de efeito para carregar dados iniciais
  useEffect(() => {
    async function loadInitialData() {
      try {
        dispatch({ type: 'SET_LOADING', payload: true });
        // Simular carregamento de dados
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        // Aqui você carregaria dados reais de uma API
        // Por enquanto, vamos usar dados mockados
        const mockUser: User = {
          id: "user1",
          name: "Usuário Teste",
          email: "usuario@teste.com",
          avatar: "UT",
          role: "Desenvolvedor",
          color: "bg-blue-500",
          joinDate: new Date().toISOString(),
          department: "TI",
          projects: [],
          skills: ["React", "TypeScript"],
          workload: { allocated: 0, capacity: 40 },
          stats: { completedTasks: 0, ongoingTasks: 0, totalHours: 0 }
        };

        dispatch({ type: 'SET_CURRENT_USER', payload: mockUser });
        dispatch({ type: 'SET_AUTHENTICATED', payload: true });
        
      } catch (error) {
        dispatch({ 
          type: 'SET_ERROR', 
          payload: error instanceof Error ? error : new Error('Erro ao carregar dados iniciais') 
        });
      } finally {
        dispatch({ type: 'SET_LOADING', payload: false });
      }
    }

    loadInitialData();
  }, []);

  return (
    <AppContext.Provider value={{ state, dispatch }}>
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
}
