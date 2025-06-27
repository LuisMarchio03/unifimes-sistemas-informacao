import { Task } from "./task"

export interface TaskFilters {
  priority?: Task["priority"][]
  assignee?: string[]
  hasDueDate?: boolean
  overdue?: boolean
  hasSubtasks?: boolean
  minEffort?: number
  maxEffort?: number
}

export interface SortConfig {
  by: "priority" | "dueDate" | "created" | "title"
  direction: "asc" | "desc"
}
