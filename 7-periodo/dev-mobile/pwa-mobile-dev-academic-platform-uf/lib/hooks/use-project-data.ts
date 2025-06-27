"use client";

import { useState, useEffect } from 'react';
import { Project, Task, User, addTask, updateTask, deleteTask, getProjectTasks, projects } from '@/lib/data/mock-data';
import { toast } from 'sonner';

interface UseProjectDataReturn {
  project: Project | null;
  tasks: Task[];
  members: User[];
  isLoading: boolean;
  error: Error | null;
  addNewTask: (task: Omit<Task, 'id'>) => void;
  updateTaskStatus: (taskId: string, status: Task['status']) => void;
  updateTaskAssignees: (taskId: string, assignees: string[]) => void;
  removeTask: (taskId: string) => void;
  updateProjectDetails: (updates: Partial<Project>) => void;
}

export function useProjectData(projectId: string): UseProjectDataReturn {
  const [project, setProject] = useState<Project | null>(null);
  const [tasks, setTasks] = useState<Task[]>([]);
  const [members, setMembers] = useState<User[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    const loadProjectData = async () => {
      try {
        setIsLoading(true);
        
        // Simular delay de rede
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        // Carregar dados do projeto
        const projectData = projects.find(p => p.id === projectId);
        if (!projectData) {
          throw new Error('Projeto não encontrado');
        }
        
        const projectTasks = getProjectTasks(projectId);
        
        setProject(projectData);
        setTasks(projectTasks);
        setMembers(projectData.members || []);
        
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : 'Erro ao carregar dados do projeto';
        setError(err instanceof Error ? err : new Error(errorMessage));
        toast.error(errorMessage);
      } finally {
        setIsLoading(false);
      }
    };

    loadProjectData();
  }, [projectId]);

  const addNewTask = (taskData: Omit<Task, 'id'>) => {
    try {
      const newTask = addTask({ ...taskData, projectId });
      setTasks(current => [...current, newTask]);
      toast.success('Tarefa adicionada com sucesso');
    } catch (err) {
      const errorMessage = 'Erro ao adicionar tarefa';
      setError(err instanceof Error ? err : new Error(errorMessage));
      toast.error(errorMessage);
    }
  };

  const updateTaskStatus = (taskId: string, status: Task['status']) => {
    try {
      const updatedTask = updateTask(taskId, { status });
      if (updatedTask) {
        setTasks(current =>
          current.map(task => (task.id === taskId ? updatedTask : task))
        );
        toast.success('Status da tarefa atualizado');
      }
    } catch (err) {
      const errorMessage = 'Erro ao atualizar status da tarefa';
      setError(err instanceof Error ? err : new Error(errorMessage));
      toast.error(errorMessage);
    }
  };

  const updateTaskAssignees = (taskId: string, assignees: string[]) => {
    try {
      const updatedTask = updateTask(taskId, { assignees });
      if (updatedTask) {
        setTasks(current =>
          current.map(task => (task.id === taskId ? updatedTask : task))
        );
        toast.success('Responsáveis atualizados');
      }
    } catch (err) {
      const errorMessage = 'Erro ao atualizar responsáveis da tarefa';
      setError(err instanceof Error ? err : new Error(errorMessage));
      toast.error(errorMessage);
    }
  };

  const removeTask = (taskId: string) => {
    try {
      const success = deleteTask(taskId);
      if (success) {
        setTasks(current => current.filter(task => task.id !== taskId));
        toast.success('Tarefa removida com sucesso');
      }
    } catch (err) {
      const errorMessage = 'Erro ao remover tarefa';
      setError(err instanceof Error ? err : new Error(errorMessage));
      toast.error(errorMessage);
    }
  };

  const updateProjectDetails = (updates: Partial<Project>) => {
    try {
      if (!project) throw new Error('Projeto não encontrado');
      
      const updatedProject = { ...project, ...updates };
      setProject(updatedProject);
      
      // Em uma aplicação real, aqui você faria uma chamada à API
      // para persistir as alterações
      
      toast.success('Projeto atualizado com sucesso');
    } catch (err) {
      const errorMessage = 'Erro ao atualizar projeto';
      setError(err instanceof Error ? err : new Error(errorMessage));
      toast.error(errorMessage);
    }
  };

  return {
    project,
    tasks,
    members,
    isLoading,
    error,
    addNewTask,
    updateTaskStatus,
    updateTaskAssignees,
    removeTask,
    updateProjectDetails,
  };
}
