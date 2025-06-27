// Definições de tipos para tarefas

export type TaskStatus = 'todo' | 'in-progress' | 'review' | 'completed';
export type TaskPriority = 'low' | 'medium' | 'high';

export interface Subtask {
  id: string;
  title: string;
  completed: boolean;
}

export interface Task {
  id: string;
  title: string;
  description: string;
  status: TaskStatus;
  priority: TaskPriority;
  dueDate: string;
  assignees: string[];
  tags: string[];
  effort: number;
  subtasks: Subtask[];
  createdAt: number;
  updatedAt: number;
}
