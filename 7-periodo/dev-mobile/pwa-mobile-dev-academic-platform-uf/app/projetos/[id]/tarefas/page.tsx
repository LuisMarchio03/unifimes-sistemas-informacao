"use client"

import React, { useState, useEffect } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { UserAssignment, UserSelector } from "@/components/user-assignment"
import { TaskEffortEstimation } from "@/components/workload-management"
import { useRealtime, useRealtimeMessages } from "@/lib/hooks/use-realtime"
import { useProjectTasks } from "@/lib/hooks/use-project-tasks"
import { Task } from "@/lib/types/task"
import { useAuthStore } from "@/lib/stores/auth-store"
import {
  ArrowLeft,
  Plus,
  Search,
  Filter,
  Calendar,
  CheckCircle2,
  Circle,
  AlertCircle,
  MoreHorizontal,
  ChevronDown,
  ChevronUp,
  X,
} from "lucide-react"
import { toast } from "sonner"
import { useParams } from "next/navigation"

function StatusIcon({ status }: { status: Task["status"] }) {
  switch (status) {
    case "completed":
      return <CheckCircle2 className="h-4 w-4 text-green-500" />
    case "in-progress":
      return <AlertCircle className="h-4 w-4 text-yellow-500" />
    case "review":
      return <AlertCircle className="h-4 w-4 text-blue-500" />
    case "todo":
      return <Circle className="h-4 w-4 text-gray-400" />
  }
}

export default function TarefasPage() {
  const params = useParams()
  // Desempacotar os parâmetros diretamente
  const projectId = params?.id as string;
  const { user } = useAuthStore();

  if (!projectId) {
    return <div className="flex min-h-screen items-center justify-center">Projeto não encontrado</div>
  }
  
  const [expandedTasks, setExpandedTasks] = useState<string[]>([])
  const [showNewTaskForm, setShowNewTaskForm] = useState(false)
  const [searchQuery, setSearchQuery] = useState("")
  const [filteredTasks, setFilteredTasks] = useState<Task[]>([])
  const [newTask, setNewTask] = useState({
    title: "",
    description: "",
    dueDate: "",
    priority: "medium" as Task["priority"],
    assignees: [] as string[],
    tags: [] as string[],
    effort: 8,
  })
  const [newTag, setNewTag] = useState("")
  const [newSubtask, setNewSubtask] = useState("")

  const {
    tasks,
    isLoading,
    addTask,
    updateTask,
    removeTask,
    addSubtask: addTaskSubtask,
    toggleSubtaskStatus,
    statistics
  } = useProjectTasks(projectId)

  const { isConnected, subscribeToRoom, unsubscribeFromRoom, sendMessage } = useRealtime()

  // Join project room on mount
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

  // Update filtered tasks when search changes
  useEffect(() => {
    if (!searchQuery.trim()) {
      setFilteredTasks(tasks)
      return
    }
    
    const query = searchQuery.toLowerCase()
    const filtered = tasks.filter(task => 
      task.title.toLowerCase().includes(query) ||
      task.description.toLowerCase().includes(query) ||
      task.tags.some(tag => tag.toLowerCase().includes(query))
    )
    setFilteredTasks(filtered)
  }, [searchQuery, tasks])

  const toggleTaskExpand = (taskId: string) => {
    setExpandedTasks(prev => 
      prev.includes(taskId) ? prev.filter(id => id !== taskId) : [...prev, taskId]
    )
  }

  const handleAddTag = () => {
    if (newTag.trim() && !newTask.tags.includes(newTag.trim())) {
      setNewTask({ ...newTask, tags: [...newTask.tags, newTag.trim()] })
      setNewTag("")
    }
  }

  const handleRemoveTag = (tag: string) => {
    setNewTask({ ...newTask, tags: newTask.tags.filter(t => t !== tag) })
  }

  const handleAddSubtask = (taskId?: string) => {
    if (!newSubtask.trim()) return

    if (taskId) {
      addTaskSubtask(taskId, newSubtask.trim())
      
      // Enviar atualização em tempo real
      sendMessage({
        type: "task_updated",
        payload: {
          taskId,
          projectId: projectId,
          changes: { subtasks: tasks.find(t => t.id === taskId)?.subtasks || [] },
          updatedBy: "current_user",
        },
        roomId: `project:${projectId}`,
      })
      
      toast.success("Subtarefa adicionada!")
    }
    
    setNewSubtask("")
  }

  const handleCreateTask = () => {
    // Verificar se o usuário tem permissão para criar tarefas (apenas admin e professor)
    if (user?.role !== 'admin' && user?.role !== 'professor') {
      toast.error("Você não tem permissão para criar tarefas")
      return
    }

    if (!newTask.title) {
      toast.error("O título da tarefa é obrigatório")
      return
    }

    const task = addTask({
      ...newTask,
      status: "todo",
      subtasks: [],
    })

    // Send real-time update
    sendMessage({
      type: "task_created",
      payload: {
        taskId: task.id,
        projectId: projectId,
        changes: task,
        updatedBy: "current_user",
      },
      roomId: `project:${projectId}`,
    })

    setShowNewTaskForm(false)
    setNewTask({
      title: "",
      description: "",
      dueDate: "",
      priority: "medium",
      assignees: [],
      tags: [],
      effort: 8,
    })

    toast.success("Tarefa criada com sucesso!")
  }

  const handleEffortChange = (hours: number) => {
    setNewTask({ ...newTask, effort: hours })
  }
  
  const handleDeleteTask = (taskId: string) => {
    if (!window.confirm("Tem certeza que deseja excluir esta tarefa?")) return

    removeTask(taskId)
    
    // Notificar outros usuários sobre a exclusão
    sendMessage({
      type: "task_deleted",
      payload: {
        taskId,
        projectId: projectId,
        changes: {},
        updatedBy: "current_user",
      },
      roomId: `project:${projectId}`,
    })
    
    toast.success("Tarefa excluída com sucesso!")
  }

  const toggleTaskStatus = (taskId: string) => {
    const task = tasks.find(t => t.id === taskId)
    if (!task) return

    const newStatus = task.status === "completed" ? "todo" : 
                     task.status === "todo" ? "in-progress" : 
                     task.status === "in-progress" ? "review" : "completed"

    updateTask(taskId, { status: newStatus })

    // Send real-time update
    sendMessage({
      type: "task_updated",
      payload: {
        taskId,
        projectId: projectId,
        changes: { status: newStatus },
        updatedBy: "current_user",
      },
      roomId: `project:${projectId}`,
    })
  }

  if (isLoading) {
    return <div className="flex min-h-screen items-center justify-center">Carregando...</div>
  }

  return (
    <div className="flex min-h-screen flex-col px-4 py-6">
      <header className="mb-6 flex items-center justify-between">
        <div className="flex items-center">
          <Link href={`/projetos/${projectId}`} className="mr-4">
            <ArrowLeft className="h-6 w-6" />
          </Link>
          <h1 className="text-xl font-bold">Tarefas do Projeto</h1>
        </div>
        {/* <div className="flex items-center gap-2">
          <Button variant="outline" size="sm">
            <Link href={`/projetos/${projectId}/kanban`}>Ver Kanban</Link>
          </Button>
          <Button variant="outline" size="sm">
            <Link href="/projetos/gerenciar/workload">Carga de Trabalho</Link>
          </Button>
        </div> */}
      </header>

      {/* Task Statistics */}
      <div className="mb-6 grid grid-cols-4 gap-4">
        <div className="rounded-lg border border-white/10 bg-white/5 p-4">
          <div className="text-sm text-gray-400">Total de Tarefas</div>
          <div className="text-2xl font-bold">{statistics.total}</div>
        </div>
        <div className="rounded-lg border border-white/10 bg-white/5 p-4">
          <div className="text-sm text-gray-400">Concluídas</div>
          <div className="text-2xl font-bold text-green-500">{statistics.completed}</div>
        </div>
        <div className="rounded-lg border border-white/10 bg-white/5 p-4">
          <div className="text-sm text-gray-400">Em Progresso</div>
          <div className="text-2xl font-bold text-yellow-500">{statistics.inProgress}</div>
        </div>
        <div className="rounded-lg border border-white/10 bg-white/5 p-4">
          <div className="text-sm text-gray-400">Em Revisão</div>
          <div className="text-2xl font-bold text-blue-500">{statistics.review}</div>
        </div>
      </div>

      <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex flex-1 items-center gap-2">
          <Input 
            placeholder="Buscar tarefas..." 
            className="border-white/10" 
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          <Button variant="outline" size="sm">
            <Search className="h-4 w-4" />
          </Button>
          <Button variant="outline" size="sm">
            <Filter className="h-4 w-4" />
          </Button>
        </div>
        {user && (user.role === 'admin' || user.role === 'professor') && (
          <Button onClick={() => setShowNewTaskForm(true)}>
            <Plus className="mr-2 h-4 w-4" />
            Nova Tarefa
          </Button>
        )}
      </div>

      {/* New Task Form */}
      {showNewTaskForm && (
        <div className="mb-6 rounded-lg border border-white/10 bg-white/5 p-4">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-lg font-semibold">Nova Tarefa</h2>
            <Button variant="ghost" size="sm" onClick={() => setShowNewTaskForm(false)}>
              <X className="h-4 w-4" />
            </Button>
          </div>

          <div className="space-y-4">
            <div>
              <label htmlFor="task-title" className="mb-1 block text-sm text-gray-400">
                Título
              </label>
              <Input
                id="task-title"
                value={newTask.title}
                onChange={(e) => setNewTask({ ...newTask, title: e.target.value })}
                placeholder="Título da tarefa"
                className="border-white/10"
              />
            </div>

            <div>
              <label htmlFor="task-description" className="mb-1 block text-sm text-gray-400">
                Descrição
              </label>
              <Textarea
                id="task-description"
                value={newTask.description}
                onChange={(e) => setNewTask({ ...newTask, description: e.target.value })}
                placeholder="Descrição detalhada da tarefa"
                className="min-h-[100px] border-white/10 bg-black/80"
              />
            </div>

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div>
                <label htmlFor="task-due-date" className="mb-1 block text-sm text-gray-400">
                  Data de Entrega
                </label>
                <Input
                  id="task-due-date"
                  type="date"
                  value={newTask.dueDate}
                  onChange={(e) => setNewTask({ ...newTask, dueDate: e.target.value })}
                  className="border-white/10"
                />
              </div>

              <div>
                <label htmlFor="task-priority" className="mb-1 block text-sm text-gray-400">
                  Prioridade
                </label>
                <select
                  id="task-priority"
                  value={newTask.priority}
                  onChange={(e) => setNewTask({ ...newTask, priority: e.target.value as Task["priority"] })}
                  className="w-full rounded-lg border border-white/10 bg-black/80 px-3 py-2 text-base"
                >
                  <option value="high">Alta</option>
                  <option value="medium">Média</option>
                  <option value="low">Baixa</option>
                </select>
              </div>
            </div>

            {/* Task Effort Estimation */}
            <TaskEffortEstimation defaultHours={newTask.effort} onChange={handleEffortChange} />

            {/* User Assignment */}
            <div>
              <UserSelector
                selectedUsers={newTask.assignees}
                onChange={(users) => setNewTask({ ...newTask, assignees: users })}
                label="Atribuir a"
                placeholder="Selecionar responsáveis"
              />
            </div>

            <div>
              <label className="mb-1 block text-sm text-gray-400">Tags</label>
              <div className="flex flex-wrap gap-2">
                {newTask.tags.map((tag, index) => (
                  <div key={index} className="flex items-center gap-1 rounded-full bg-white/10 px-3 py-1">
                    <span className="text-sm">{tag}</span>
                    <button type="button" onClick={() => handleRemoveTag(tag)}>
                      <X className="h-3 w-3" />
                    </button>
                  </div>
                ))}
              </div>
              <div className="mt-2 flex gap-2">
                <Input
                  placeholder="Adicionar tag..."
                  value={newTag}
                  onChange={(e) => setNewTag(e.target.value)}
                  className="border-white/10"
                  onKeyPress={(e) => e.key === "Enter" && (e.preventDefault(), handleAddTag())}
                />
                <Button type="button" onClick={handleAddTag} variant="outline" size="sm">
                  <Plus className="h-4 w-4" />
                </Button>
              </div>
            </div>

            <div className="flex gap-2 pt-2">
              <Button variant="outline" onClick={() => setShowNewTaskForm(false)} className="flex-1">
                Cancelar
              </Button>
              <Button onClick={handleCreateTask} className="flex-1">
                Criar Tarefa
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Tasks List */}
      <div className="space-y-4">
        {filteredTasks.length === 0 ? (
          <div className="rounded-lg border border-white/10 bg-white/5 p-8 text-center">
            <p className="text-gray-400">
              {searchQuery ? "Nenhuma tarefa encontrada para esta pesquisa." : "Não há tarefas neste projeto."}
            </p>
          </div>
        ) : (
          filteredTasks.map((task) => (
            <div key={task.id} className="rounded-lg border border-white/10 bg-white/5 p-4">
              <div className="flex items-start gap-3">
                <button onClick={() => toggleTaskStatus(task.id)}>
                  <StatusIcon status={task.status} />
                </button>

                <div className="flex-1">
                  <div className="mb-2 flex items-start justify-between">
                    <h3 className="font-semibold">{task.title}</h3>
                    <div className="flex items-center gap-2">
                      <span
                        className={`text-xs font-medium ${
                          task.priority === "high" ? "text-red-500" :
                          task.priority === "medium" ? "text-yellow-500" :
                          "text-green-500"
                        }`}
                      >
                        {task.priority === "high" ? "Alta" : task.priority === "medium" ? "Média" : "Baixa"}
                      </span>
                      <Button 
                        variant="ghost" 
                        size="sm" 
                        className="h-8 w-8 p-0 text-red-500 hover:text-red-700" 
                        onClick={() => handleDeleteTask(task.id)}
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>

                  <p className="mb-2 text-sm text-gray-300">{task.description}</p>

                  <div className="mb-3 flex flex-wrap gap-2">
                    {task.tags.map((tag, index) => (
                      <span key={index} className="rounded-full bg-white/10 px-2 py-0.5 text-xs">
                        {tag}
                      </span>
                    ))}
                  </div>

                  <div className="mb-3 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <span className="flex items-center gap-1 text-xs text-gray-400">
                        <Calendar className="h-3 w-3" />
                        {new Date(task.dueDate).toLocaleDateString("pt-BR")}
                      </span>

                      {/* Effort Display */}
                      <span className="flex items-center gap-1 rounded-full bg-white/10 px-2 py-0.5 text-xs">
                        {task.effort}h
                      </span>

                      {/* User Assignment */}
                      <UserAssignment
                        assignedUsers={task.assignees || []}
                        onAssign={(userId) => {
                          updateTask(task.id, {
                            assignees: [...task.assignees, userId]
                          })
                        }}
                        onUnassign={(userId) => {
                          updateTask(task.id, {
                            assignees: task.assignees.filter(id => id !== userId)
                          })
                        }}
                        size="sm"
                      />
                    </div>
                    <button
                      onClick={() => toggleTaskExpand(task.id)}
                      className="flex items-center gap-1 text-xs text-gray-400 hover:text-white"
                    >
                      {task.subtasks.length} subtarefas
                      {expandedTasks.includes(task.id) ? (
                        <ChevronUp className="h-3 w-3" />
                      ) : (
                        <ChevronDown className="h-3 w-3" />
                      )}
                    </button>
                  </div>

                  {/* Subtasks */}
                  {expandedTasks.includes(task.id) && (
                    <div className="mt-3 space-y-2 rounded-lg bg-white/5 p-3">
                      <h4 className="text-xs font-medium text-gray-400">Subtarefas</h4>
                      {task.subtasks.map((subtask) => (
                        <div key={subtask.id} className="flex items-center gap-2">
                          <button onClick={() => toggleSubtaskStatus(task.id, subtask.id)}>
                            {subtask.completed ? (
                              <CheckCircle2 className="h-4 w-4 text-green-500" />
                            ) : (
                              <Circle className="h-4 w-4 text-gray-400" />
                            )}
                          </button>
                          <span
                            className={`text-sm ${subtask.completed ? "text-gray-500 line-through" : "text-gray-300"}`}
                          >
                            {subtask.title}
                          </span>
                        </div>
                      ))}
                      <div className="flex gap-2 pt-2">
                        <Input 
                          placeholder="Nova subtarefa..." 
                          className="border-white/10 text-sm"
                          value={newSubtask}
                          onChange={(e) => setNewSubtask(e.target.value)}
                          onKeyPress={(e) => e.key === "Enter" && (e.preventDefault(), handleAddSubtask(task.id))}
                        />
                        <Button 
                          variant="outline" 
                          size="sm"
                          onClick={() => handleAddSubtask(task.id)}
                        >
                          <Plus className="h-3 w-3" />
                        </Button>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  )
}
