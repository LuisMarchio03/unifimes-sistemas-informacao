"use client"

import React, { useState, useRef, useEffect, use } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { useRealtime } from "@/lib/hooks/use-realtime"
import { useProjectTasks } from "@/lib/hooks/use-project-tasks"
import { TaskStatus, Task } from "@/lib/types/task"
import { Column, ColumnMap, DragEvent } from "@/lib/types/kanban"
import { TaskFilters, SortConfig } from "@/lib/types/filters"
import { TaskFiltersPanel } from "@/components/tasks/task-filters"
import { UserAssignment } from "@/components/user-assignment"
import { ArrowLeft, Plus, Search, Filter, Tag, X } from "lucide-react"
import { toast } from "sonner"

const priorityColors = {
  high: "border-red-500",
  medium: "border-yellow-500",
  low: "border-green-500",
} as const

export default function KanbanPage({ params }: { params: { id: string } }) {
  // Usar params diretamente, pois já está tipado nas props
  const projectId = params.id;
  const projectIdRef = useRef<string>(projectId);
  
  const {
    tasks,
    isLoading,
    addTask,
    updateTask,
    moveTask,
    getTasksByStatus,
    getTaskById,
    searchTasks
  } = useProjectTasks(projectIdRef.current)

  const [draggingTaskId, setDraggingTaskId] = useState<string | null>(null)
  const [dragOverColumnId, setDragOverColumnId] = useState<TaskStatus | null>(null)
  const [showNewTaskForm, setShowNewTaskForm] = useState(false)
  const [newTaskColumn, setNewTaskColumn] = useState<TaskStatus>("todo")
  const [searchQuery, setSearchQuery] = useState("")
  const [newTask, setNewTask] = useState({
    title: "",
    description: "",
    priority: "medium" as Task["priority"],
    dueDate: "",
    assignees: [] as string[],
    tags: [] as string[],
    effort: 8,
  })
  const [newTagInput, setNewTagInput] = useState("")
  const [columns, setColumns] = useState<ColumnMap>({
    todo: { id: "todo", title: "A Fazer", taskIds: [] },
    "in-progress": { id: "in-progress", title: "Em Progresso", taskIds: [] },
    review: { id: "review", title: "Em Revisão", taskIds: [] },
    completed: { id: "completed", title: "Concluído", taskIds: [] },
  } as ColumnMap)
  const [tasksMap, setTasksMap] = useState<Record<string, Task>>({})

  // Estados para filtros e ordenação
  const [filters, setFilters] = useState<TaskFilters>({})
  const [sortConfig, setSortConfig] = useState<SortConfig>({
    by: "created",
    direction: "asc"
  })
  const { isConnected, subscribeToRoom, unsubscribeFromRoom, sendMessage } = useRealtime()
  
  // Join project room
  useEffect(() => {
    // Apenas se inscrever quando o WebSocket estiver conectado e temos um projectId
    if (isConnected && projectId) {
      const roomId = `project:${projectId}`
      
      // Usar setTimeout para garantir que isso aconteça fora do ciclo de renderização
      const timer = setTimeout(() => {
        subscribeToRoom(roomId)
      }, 0)
      
      // Cleanup function
      return () => {
        clearTimeout(timer)
        // Usar setTimeout no cleanup também para evitar problemas durante a desmontagem
        setTimeout(() => {
          unsubscribeFromRoom(roomId)
        }, 0)
      }
    }
    return undefined
  }, [projectId, isConnected, subscribeToRoom, unsubscribeFromRoom])

  // Resto do código permanece o mesmo, mas todos os usos de params.id devem ser substituídos por projectId
  // ...

  return (
    <div className="flex min-h-screen flex-col px-4 py-6">
      <header className="mb-6 flex items-center justify-between">
        <div className="flex items-center">
          <Link href={`/projetos/${projectId}`} className="mr-4">
            <ArrowLeft className="h-6 w-6" />
          </Link>
          <h1 className="text-xl font-bold">Quadro Kanban</h1>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm">
            <Link href={`/projetos/${projectId}/tarefas`}>Ver Lista</Link>
          </Button>
        </div>
      </header>
      
      {/* Implementação do Kanban aqui... */}
    </div>
  )
}


