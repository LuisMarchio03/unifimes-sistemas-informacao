import { useEffect, useState } from "react"
import { Task, TaskStatus } from "@/lib/types/task"
import { useAuthStore } from "../stores/auth-store"
import type { AuthStore } from "../types/auth-store"
import {
  createTask,
  updateTask as updateTaskService,
  loadTasksFromLocalStorage,
  saveTasksToLocalStorage,
  filterTasks,
  sortTasks,
  getTaskStatistics,
} from "@/lib/services/task-service"

export function useProjectTasks(projectId: string) {
  const { user } = useAuthStore() as AuthStore
  const [tasks, setTasks] = useState<Task[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [statistics, setStatistics] = useState(() => getTaskStatistics(tasks))

  // Carregar tarefas do localStorage
  useEffect(() => {
    if (!projectId || !user?.id) return

    setIsLoading(true)
    try {
      const loadedTasks = loadTasksFromLocalStorage(projectId, user.id)
      setTasks(loadedTasks)
    } catch (error) {
      console.error("Erro ao carregar tarefas:", error)
    } finally {
      setIsLoading(false)
    }
  }, [projectId, user?.id])

  // Salvar tarefas no localStorage e atualizar estatísticas
  useEffect(() => {
    if (!tasks.length || !projectId || !user?.id) return
    
    saveTasksToLocalStorage(tasks, projectId, user.id)
    setStatistics(getTaskStatistics(tasks))
  }, [tasks, projectId, user?.id])

  // Adicionar nova tarefa
  const addTask = (newTask: Omit<Task, "id" | "createdAt" | "updatedAt">) => {
    // Verificar se o usuário tem permissão para criar tarefas (apenas admin e professor)
    if (user && user.role !== 'admin' && user.role !== 'professor') {
      throw new Error("Você não tem permissão para criar tarefas")
    }
    
    const task = createTask(newTask)
    setTasks(prev => sortTasks([...prev, task]))
    return task
  }

  // Atualizar tarefa existente
  const updateTask = (taskId: string, updates: Partial<Task>) => {
    setTasks(prev => 
      sortTasks(
        prev.map(task => 
          task.id === taskId 
            ? updateTaskService(task, updates)
            : task
        )
      )
    )
  }

  // Remover tarefa
  const removeTask = (taskId: string) => {
    setTasks(prev => prev.filter(task => task.id !== taskId))
  }

  // Adicionar subtarefa
  const addSubtask = (taskId: string, subtaskTitle: string) => {
    updateTask(taskId, {
      subtasks: [
        ...tasks.find(t => t.id === taskId)?.subtasks || [],
        { id: crypto.randomUUID(), title: subtaskTitle, completed: false }
      ]
    })
  }

  // Atualizar status de subtarefa
  const toggleSubtaskStatus = (taskId: string, subtaskId: string) => {
    const task = tasks.find(t => t.id === taskId)
    if (!task) return

    updateTask(taskId, {
      subtasks: task.subtasks.map(subtask => 
        subtask.id === subtaskId 
          ? { ...subtask, completed: !subtask.completed }
          : subtask
      )
    })
  }

  // Mover tarefa entre colunas (para o quadro Kanban)
  const moveTask = (taskId: string, newStatus: TaskStatus) => {
    updateTask(taskId, { status: newStatus })
  }

  // Definição do tipo ColumnMap para Kanban
  type Column = {
    id: string
    title: string
    taskIds: string[]
  }
  type ColumnMap = {
    [key in TaskStatus]: Column
  }
  
  // Obter tarefas agrupadas por status (para o quadro Kanban)
  const getTasksByStatus = () => {
    const columns: ColumnMap = {
      todo: {
        id: "todo",
        title: "A Fazer",
        taskIds: [],
      },
      "in-progress": {
        id: "in-progress",
        title: "Em Progresso",
        taskIds: [],
      },
      review: {
        id: "review",
        title: "Em Revisão",
        taskIds: [],
      },
      completed: {
        id: "completed",
        title: "Concluído",
        taskIds: [],
      },
    }
  
    // Agrupar tarefas por status
    tasks.forEach((task) => {
      columns[task.status].taskIds.push(task.id)
    })
  
    return columns
  }

  // Obter tarefa por ID
  const getTaskById = (taskId: string) => {
    return tasks.find((task) => task.id === taskId)
  }

  // Pesquisar tarefas
  const searchTasks = (query: string) => {
    return filterTasks(tasks, query)
  }

  return {
    tasks,
    isLoading,
    statistics,
    addTask,
    updateTask,
    removeTask,
    addSubtask,
    toggleSubtaskStatus,
    moveTask,
    getTasksByStatus,
    getTaskById,
    searchTasks,
  }
}