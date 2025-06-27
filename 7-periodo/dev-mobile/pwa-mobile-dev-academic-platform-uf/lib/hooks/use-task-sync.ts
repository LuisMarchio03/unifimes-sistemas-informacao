// Hook para lidar com estados locais e sincronização com o servidor
import { useState, useEffect } from 'react';
import { Task, TaskStatus } from '@/lib/types/task';
import { useRealtime } from './use-realtime';
import { useLocalStorage } from './use-local-storage';

interface TaskSyncState {
  tasks: Task[];
  localChanges: Record<string, Partial<Task>>;
  isLoading: boolean;
  error: Error | null;
}

export function useTaskSync(projectId: string) {
  const [state, setState] = useState<TaskSyncState>({
    tasks: [],
    localChanges: {},
    isLoading: true,
    error: null,
  });

  const { getStoredValue, setStoredValue } = useLocalStorage();
  const { sendMessage } = useRealtime();

  // Carregar tarefas do localStorage
  useEffect(() => {
    const loadTasks = async () => {
      try {
        const storedTasks = getStoredValue<Task[]>(`tasks_${projectId}`) || [];
        setState(prev => ({ ...prev, tasks: storedTasks, isLoading: false }));
      } catch (error) {
        setState(prev => ({ ...prev, error: error as Error, isLoading: false }));
      }
    };

    loadTasks();
  }, [projectId, getStoredValue]);

  // Salvar tarefas no localStorage quando houver mudanças
  useEffect(() => {
    if (state.tasks.length > 0) {
      setStoredValue(`tasks_${projectId}`, state.tasks);
    }
  }, [projectId, state.tasks, setStoredValue]);

  // Função para aplicar mudanças localmente e enviar atualização
  const updateTask = async (taskId: string, changes: Partial<Task>) => {
    setState(prev => ({
      ...prev,
      tasks: prev.tasks.map(task =>
        task.id === taskId ? { ...task, ...changes } : task
      ),
      localChanges: {
        ...prev.localChanges,
        [taskId]: { ...(prev.localChanges[taskId] || {}), ...changes },
      },
    }));

    // Enviar atualização via WebSocket
    sendMessage({
      type: 'task_updated',
      payload: {
        taskId,
        projectId,
        changes,
        updatedBy: 'current_user',
      },
      roomId: `project:${projectId}`,
    });
  };

  // Função para criar nova tarefa
  const createTask = async (task: Omit<Task, 'id'>) => {
    const newTask: Task = {
      ...task,
      id: crypto.randomUUID(),
      createdAt: Date.now(),
      updatedAt: Date.now(),
    };

    setState(prev => ({
      ...prev,
      tasks: [...prev.tasks, newTask],
    }));

    // Enviar via WebSocket
    sendMessage({
      type: 'task_created',
      payload: {
        taskId: newTask.id,
        projectId,
        changes: newTask,
        updatedBy: 'current_user',
      },
      roomId: `project:${projectId}`,
    });

    return newTask;
  };
  // Função para excluir tarefa
  const deleteTask = async (taskId: string) => {
    setState(prev => {
      const newLocalChanges = { ...prev.localChanges };
      delete newLocalChanges[taskId];
      
      return {
        ...prev,
        tasks: prev.tasks.filter(task => task.id !== taskId),
        localChanges: newLocalChanges,
      };
    });

    // Enviar via WebSocket
    sendMessage({
      type: 'task_deleted',
      payload: {
        taskId,
        projectId,
        changes: {},
        updatedBy: 'current_user',
      },
      roomId: `project:${projectId}`,
    });
  };

  // Função para mover tarefa entre status
  const moveTask = async (taskId: string, newStatus: TaskStatus) => {
    setState(prev => ({
      ...prev,
      tasks: prev.tasks.map(task =>
        task.id === taskId ? { ...task, status: newStatus } : task
      ),
      localChanges: {
        ...prev.localChanges,
        [taskId]: { ...(prev.localChanges[taskId] || {}), status: newStatus },
      },
    }));

    // Enviar via WebSocket
    sendMessage({
      type: 'task_moved',
      payload: {
        taskId,
        projectId,
        changes: { status: newStatus },
        updatedBy: 'current_user',
      },
      roomId: `project:${projectId}`,
    });
  };

  return {
    tasks: state.tasks,
    isLoading: state.isLoading,
    error: state.error,
    updateTask,
    createTask,
    deleteTask,
    moveTask,
  };
}
