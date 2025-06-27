import { Task, TaskStatus } from "@/lib/types/task"

export const createTask = (task: Omit<Task, "id" | "createdAt" | "updatedAt">): Task => {
  return {
    ...task,
    id: crypto.randomUUID(),
    createdAt: Date.now(),
    updatedAt: Date.now(),
  }
}

export const updateTask = (task: Task, updates: Partial<Task>): Task => {
  return {
    ...task,
    ...updates,
    updatedAt: Date.now()
  }
}

export const getNextStatus = (currentStatus: TaskStatus): TaskStatus => {
  const statusFlow: TaskStatus[] = ['todo', 'in-progress', 'review', 'completed']
  const currentIndex = statusFlow.indexOf(currentStatus)
  const nextIndex = (currentIndex + 1) % statusFlow.length
  return statusFlow[nextIndex]
}

export const filterTasks = (tasks: Task[], searchQuery: string): Task[] => {
  if (!searchQuery.trim()) return tasks
  
  const query = searchQuery.toLowerCase()
  return tasks.filter(task => 
    task.title.toLowerCase().includes(query) ||
    task.description.toLowerCase().includes(query) ||
    task.tags.some(tag => tag.toLowerCase().includes(query))
  )
}

export const sortTasks = (tasks: Task[]): Task[] => {
  return [...tasks].sort((a, b) => {
    // Primeiro por prioridade
    const priorityOrder = { high: 0, medium: 1, low: 2 }
    const priorityDiff = priorityOrder[a.priority] - priorityOrder[b.priority]
    if (priorityDiff !== 0) return priorityDiff
    
    // Depois por data de entrega
    const dateA = new Date(a.dueDate).getTime()
    const dateB = new Date(b.dueDate).getTime()
    if (dateA !== dateB) return dateA - dateB
    
    // Por fim, por data de atualização
    return b.updatedAt - a.updatedAt
  })
}

export const getTaskStatistics = (tasks: Task[]) => {
  return {
    total: tasks.length,
    completed: tasks.filter(t => t.status === 'completed').length,
    inProgress: tasks.filter(t => t.status === 'in-progress').length,
    review: tasks.filter(t => t.status === 'review').length,
    todo: tasks.filter(t => t.status === 'todo').length,
  }
}

export const saveTasksToLocalStorage = (tasks: Task[], projectId: string, userId: string) => {
  const storageKey = `project_tasks_${projectId}_${userId}`
  localStorage.setItem(storageKey, JSON.stringify(tasks))
}

export const loadTasksFromLocalStorage = (projectId: string, userId: string): Task[] => {
  const storageKey = `project_tasks_${projectId}_${userId}`
  const savedTasks = localStorage.getItem(storageKey)
  return savedTasks ? JSON.parse(savedTasks) : []
}

export const generateTaskId = () => crypto.randomUUID();
