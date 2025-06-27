// Definições de tipos comuns para o projeto

export type TaskStatus = 'todo' | 'in-progress' | 'review' | 'completed';
export type Priority = 'low' | 'medium' | 'high';
export type DifficultyLevel = 'Iniciante' | 'Intermediário' | 'Avançado';
export type LocationType = 'Remoto' | 'Presencial' | 'Híbrido';

export interface User {
  id: string;
  name: string;
  email: string;
  avatar?: string;
  role?: string;
}

export interface Task {
  id: string;
  projectId: string;
  title: string;
  description: string;
  status: TaskStatus;
  priority: Priority;
  assignees: string[];
  startDate: string;
  dueDate: string;
  completedDate?: string;
  effort: number;
  progress: number;
  tags: string[];
  subtasks: {
    id: string;
    title: string;
    completed: boolean;
  }[];
  comments: {
    id: string;
    userId: string;
    content: string;
    createdAt: string;
  }[];
}

export interface ProjectFilters {
  status?: string;
  category?: string;
  priority?: Priority;
  skills?: string[];
  difficulty?: DifficultyLevel;
  location?: LocationType;
}
