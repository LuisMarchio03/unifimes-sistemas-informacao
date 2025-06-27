import { TaskStatus } from "./task";

export type Column = {
  id: TaskStatus;
  title: string;
  taskIds: string[];
}

export type DragEvent = React.DragEvent<HTMLDivElement>;

export type ColumnMap = Record<TaskStatus, Column>;

export type DragState = {
  draggingTaskId: string | null;
  dragOverColumnId: TaskStatus | null;
}
