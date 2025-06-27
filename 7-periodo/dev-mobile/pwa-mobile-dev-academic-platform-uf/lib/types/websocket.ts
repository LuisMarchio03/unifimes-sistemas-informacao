import { Task } from "./task"

export type TaskUpdateType = 
  | "task_created"
  | "task_updated" 
  | "task_deleted"
  | "task_moved"
  | "task_assigned"
  | "task_unassigned"
  | "subtask_added"
  | "subtask_updated"
  | "subtask_deleted"

export type TaskUpdatePayload = {
  taskId: string
  projectId: string
  changes: Partial<Task>
  updatedBy: string
}

export interface TaskUpdateMessage {
  type: TaskUpdateType
  payload: TaskUpdatePayload
  roomId: string
}
