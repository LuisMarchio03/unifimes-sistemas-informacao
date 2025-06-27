// "use client"

// import { useState, useRef, useEffect } from "react"
// import Link from "next/link"
// import { Button } from "@/components/ui/button"
// import { Input } from "@/components/ui/input"
// import { useRealtime } from "@/lib/hooks/use-realtime"
// import { useProjectTasks } from "@/lib/hooks/use-project-tasks"
// import { TaskStatus, Task } from "@/lib/types/task"
// import { Column, ColumnMap, DragEvent } from "@/lib/types/kanban"
// import { TaskFilters, SortConfig } from "@/lib/types/filters"
// import { TaskFiltersPanel } from "@/components/tasks/task-filters"
// import { UserAssignment } from "@/components/user-assignment"
// import { ArrowLeft, Plus, Search, Filter, Tag, X } from "lucide-react"
// import { toast } from "sonner"

// const priorityColors = {
//   high: "border-red-500",
//   medium: "border-yellow-500",
//   low: "border-green-500",
// } as const

// export default function KanbanPage({ params }: { params: { id: string } }) {
//   const projectIdRef = useRef<string>(params.id)
  
//   const {
//     tasks,
//     isLoading,
//     addTask,
//     updateTask,
//     moveTask,
//     getTasksByStatus,
//     getTaskById,
//     searchTasks
//   } = useProjectTasks(projectIdRef.current)

//   const [draggingTaskId, setDraggingTaskId] = useState<string | null>(null)
//   const [dragOverColumnId, setDragOverColumnId] = useState<TaskStatus | null>(null)
//   const [showNewTaskForm, setShowNewTaskForm] = useState(false)
//   const [newTaskColumn, setNewTaskColumn] = useState<TaskStatus>("todo")
//   const [searchQuery, setSearchQuery] = useState("")
//   const [newTask, setNewTask] = useState({
//     title: "",
//     description: "",
//     priority: "medium" as Task["priority"],
//     dueDate: "",
//     assignees: [] as string[],
//     tags: [] as string[],
//     effort: 8,
//   })
//   const [newTagInput, setNewTagInput] = useState("")
//   const [columns, setColumns] = useState<ColumnMap>({
//     todo: { id: "todo", title: "A Fazer", taskIds: [] },
//     "in-progress": { id: "in-progress", title: "Em Progresso", taskIds: [] },
//     review: { id: "review", title: "Em Revisão", taskIds: [] },
//     completed: { id: "completed", title: "Concluído", taskIds: [] },
//   } as ColumnMap)
//   const [tasksMap, setTasksMap] = useState<Record<string, Task>>({})

//   // Estados para filtros e ordenação
//   const [filters, setFilters] = useState<TaskFilters>({})
//   const [sortConfig, setSortConfig] = useState<SortConfig>({
//     by: "created",
//     direction: "asc"
//   })

//   const { subscribeToRoom, unsubscribeFromRoom, sendMessage } = useRealtime()

//   // Join project room
//   useEffect(() => {
//     if (projectIdRef.current) {
//       subscribeToRoom(`project:${projectIdRef.current}`)
//       return () => unsubscribeFromRoom(`project:${projectIdRef.current}`)
//     }
//     return undefined
//   }, [subscribeToRoom, unsubscribeFromRoom])

//   // Atualizar colunas e tasksMap quando as tarefas mudam
//   useEffect(() => {
//     if (!isLoading) {
//       try {
//         if (!tasks) {
//           throw new Error("Nenhuma tarefa disponível")
//         }

//         const statusColumns = getTasksByStatus()
//         setColumns(statusColumns)
        
//         const taskMap: Record<string, Task> = {}
//         tasks.forEach(task => {
//           if (task && task.id) {
//             taskMap[task.id] = task
//           }
//         })
//         setTasksMap(taskMap)
//       } catch (error) {
//         console.error("Erro ao atualizar colunas do Kanban:", error)
//         toast.error("Erro ao carregar as tarefas. Por favor, recarregue a página.")
//       }
//     }
//   }, [tasks, getTasksByStatus, isLoading])

//   // Atualizar busca e filtragem
//   useEffect(() => {
//     try {
//       if (!searchQuery.trim()) {
//         const columns = getTasksByStatus()
//         setColumns(columns)
//         return
//       }
      
//       const filteredTasks = searchTasks(searchQuery)
//       const filteredColumns: ColumnMap = {
//         todo: { id: "todo", title: "A Fazer", taskIds: [] },
//         "in-progress": { id: "in-progress", title: "Em Progresso", taskIds: [] },
//         review: { id: "review", title: "Em Revisão", taskIds: [] },
//         completed: { id: "completed", title: "Concluído", taskIds: [] },
//       } as ColumnMap
      
//       // Organizar tarefas filtradas nas colunas
//       filteredTasks.forEach(task => {
//         if (task && task.status && filteredColumns[task.status]) {
//           const status = task.status as keyof ColumnMap
//           filteredColumns[status].taskIds.push(task.id)
//         }
//       })
      
//       setColumns(filteredColumns)
//     } catch (error) {
//       console.error("Erro ao filtrar tarefas:", error)
//       toast.error("Erro ao buscar tarefas. Por favor, tente novamente.")
//     }
//   }, [searchQuery, tasks, getTasksByStatus])

//   // Função para ordenar tarefas
//   const getSortedTaskIds = (taskIds: string[]) => {
//     return [...taskIds].sort((a, b) => {
//       const taskA = tasksMap[a]
//       const taskB = tasksMap[b]
      
//       if (!taskA || !taskB) return 0

//       switch (sortConfig.by) {
//         case "priority": {
//           const priorityValues = { high: 3, medium: 2, low: 1 }
//           const valueA = priorityValues[taskA.priority] || 0
//           const valueB = priorityValues[taskB.priority] || 0
//           return sortConfig.direction === "desc" ? valueB - valueA : valueA - valueB
//         }
        
//         case "dueDate": {
//           if (!taskA.dueDate && !taskB.dueDate) return 0
//           if (!taskA.dueDate) return sortConfig.direction === "desc" ? -1 : 1
//           if (!taskB.dueDate) return sortConfig.direction === "desc" ? 1 : -1
//           const dateA = new Date(taskA.dueDate).getTime()
//           const dateB = new Date(taskB.dueDate).getTime()
//           return sortConfig.direction === "desc" ? dateB - dateA : dateA - dateB
//         }
        
//         case "title":
//           return sortConfig.direction === "desc" 
//             ? taskB.title.localeCompare(taskA.title)
//             : taskA.title.localeCompare(taskB.title)
        
//         case "created":
//         default: {
//           const createdA = taskA.createdAt || 0
//           const createdB = taskB.createdAt || 0
//           return sortConfig.direction === "desc" ? createdB - createdA : createdA - createdB
//         }
//       }
//     })
//   }
  
//   // Atualizar colunas com ordenação
//   useEffect(() => {
//     if (!isLoading && tasks) {
//       try {
//         const statusColumns = getTasksByStatus()
        
//         // Aplicar ordenação em cada coluna
//         (Object.keys(statusColumns) as TaskStatus[]).forEach((columnId) => {
//           const column = statusColumns[columnId]
//           column.taskIds = getSortedTaskIds(column.taskIds)
//         })
        
//         setColumns(statusColumns)
//       } catch (error) {
//         console.error("Erro ao ordenar tarefas:", error)
//         toast.error("Erro ao ordenar tarefas. Por favor, recarregue a página.")
//       }
//     }
//   }, [tasks, sortConfig, tasksMap])

//   // Controles de ordenação na UI
//   const renderSortControls = () => (
//     <div className="flex items-center gap-2">
//       <select
//         className="rounded-lg border border-white/10 bg-black/80 px-3 py-2 text-sm"
//         value={sortConfig.by}
//         onChange={(e) => setSortConfig({ ...sortConfig, by: e.target.value as typeof sortConfig.by })}
//       >
//         <option value="created">Data de Criação</option>
//         <option value="priority">Prioridade</option>
//         <option value="dueDate">Data de Entrega</option>
//         <option value="title">Título</option>
//       </select>
//       <Button 
//         variant="ghost" 
//         size="sm"
//         onClick={() => setSortConfig(prev => ({ ...prev, direction: prev.direction === "asc" ? "desc" : "asc" }))}
//       >
//         {sortConfig.direction === "asc" ? "↑" : "↓"}
//       </Button>
//     </div>
//   )

//   const handleDragStart = (taskId: string) => {
//     requestAnimationFrame(() => {
//       setDraggingTaskId(taskId)
//     })
//   }

//   const handleDragOver = (e: DragEvent, columnId: TaskStatus) => {
//     e.preventDefault()
//     if (dragOverColumnId !== columnId) {
//       setDragOverColumnId(columnId)
//     }
//   }

//   const handleDrop = async (e: DragEvent, columnId: TaskStatus) => {
//     e.preventDefault()

//     if (!draggingTaskId || !projectIdRef.current) return

//     // Armazenar estado original
//     const originalTask = getTaskById(draggingTaskId)
//     if (!originalTask) return

//     try {
//       // Atualizar localmente
//       moveTask(draggingTaskId, columnId)

//       // Enviar atualização em tempo real
//       await sendMessage({
//         type: "task_updated",
//         payload: {
//           taskId: draggingTaskId,
//           projectId: projectIdRef.current,
//           changes: { status: columnId },
//           updatedBy: "current_user",
//         },
//         roomId: `project:${projectIdRef.current}`,
//       })

//       toast.success("Tarefa movida com sucesso!")
//     } catch (error) {
//       console.error("Erro ao mover tarefa:", error)
//       toast.error("Erro ao mover tarefa. Por favor, tente novamente.")
      
//       // Reverter para estado original em caso de erro
//       moveTask(draggingTaskId, originalTask.status)
//     } finally {
//       setDraggingTaskId(null)
//       setDragOverColumnId(null)
//     }
//   }

//   const handleAddTag = () => {
//     // Validar tag
//     const tag = newTagInput.trim()
//     if (!tag) {
//       toast.error("A tag não pode estar vazia")
//       return
//     }
    
//     if (tag.length < 2) {
//       toast.error("A tag deve ter pelo menos 2 caracteres")
//       return
//     }

//     if (tag.length > 20) {
//       toast.error("A tag deve ter no máximo 20 caracteres")
//       return
//     }
    
//     // Verificar se a tag já existe
//     if (newTask.tags.includes(tag)) {
//       toast.error("Esta tag já foi adicionada")
//       setNewTagInput("")
//       return
//     }

//     // Limitar número máximo de tags
//     if (newTask.tags.length >= 5) {
//       toast.error("Limite máximo de 5 tags por tarefa")
//       return
//     }
    
//     try {
//       setNewTask({
//         ...newTask,
//         tags: [...newTask.tags, tag],
//       })
//       setNewTagInput("")
//     } catch (error) {
//       console.error("Erro ao adicionar tag:", error)
//       toast.error("Erro ao adicionar tag. Por favor, tente novamente.")
//     }
//   }

//   const handleRemoveTag = (tagToRemove: string) => {
//     try {
//       if (!newTask.tags.includes(tagToRemove)) {
//         toast.error("Tag não encontrada")
//         return
//       }

//       setNewTask({
//         ...newTask,
//         tags: newTask.tags.filter(tag => tag !== tagToRemove),
//       })
//     } catch (error) {
//       console.error("Erro ao remover tag:", error)
//       toast.error("Erro ao remover tag. Por favor, tente novamente.")
//     }
//   }

//   const handleCreateTask = async () => {
//     // Validação dos campos obrigatórios
//     if (!newTask.title.trim()) {
//       toast.error("O título da tarefa é obrigatório")
//       return
//     }
    
//     if (newTask.title.length < 3) {
//       toast.error("O título da tarefa deve ter pelo menos 3 caracteres")
//       return
//     }

//     if (newTask.description && newTask.description.length > 500) {
//       toast.error("A descrição deve ter no máximo 500 caracteres")
//       return
//     }

//     if (newTask.effort <= 0 || newTask.effort > 100) {
//       toast.error("O esforço deve estar entre 1 e 100 horas")
//       return
//     }

//     try {
//       // Criar tarefa
//       const task = addTask({
//         ...newTask,
//         status: newTaskColumn,
//         subtasks: [],
//       })

//       // Enviar atualização em tempo real
//       await sendMessage({
//         type: "task_created",
//         payload: {
//           taskId: task.id,
//           projectId: projectIdRef.current,
//           changes: task,
//           updatedBy: "current_user",
//         },
//         roomId: `project:${projectIdRef.current}`,
//       })

//       // Limpar formulário e fechar
//       setShowNewTaskForm(false)
//       setNewTask({
//         title: "",
//         description: "",
//         priority: "medium",
//         dueDate: "",
//         assignees: [],
//         tags: [],
//         effort: 8,
//       })
      
//       toast.success("Tarefa criada com sucesso!")
//     } catch (error) {
//       console.error("Erro ao criar tarefa:", error)
//       toast.error("Erro ao criar tarefa. Por favor, tente novamente.")
//     }
//   }

//   const handleAssignUser = async (taskId: string, userId: string) => {
//     const task = getTaskById(taskId)
//     if (!task) {
//       toast.error("Tarefa não encontrada")
//       return
//     }

//     // Verificar se o usuário já está atribuído
//     if (task.assignees.includes(userId)) {
//       toast.error("Usuário já está atribuído a esta tarefa")
//       return
//     }

//     // Guardar estado original
//     const originalAssignees = [...task.assignees]

//     try {
//       // Atualizar localmente
//       updateTask(taskId, {
//         assignees: [...task.assignees, userId]
//       })
      
//       // Enviar atualização em tempo real
//       await sendMessage({
//         type: "task_updated",
//         payload: {
//           taskId,
//           projectId: projectIdRef.current,
//           changes: { assignees: [...task.assignees, userId] },
//           updatedBy: "current_user",
//         },
//         roomId: `project:${projectIdRef.current}`,
//       })

//       toast.success("Usuário atribuído com sucesso!")
//     } catch (error) {
//       console.error("Erro ao atribuir usuário:", error)
//       toast.error("Erro ao atribuir usuário. Por favor, tente novamente.")
      
//       // Reverter mudança local em caso de erro
//       updateTask(taskId, { assignees: originalAssignees })
//     }
//   }

//   const handleUnassignUser = async (taskId: string, userId: string) => {
//     const task = getTaskById(taskId)
//     if (!task) {
//       toast.error("Tarefa não encontrada")
//       return
//     }

//     // Verificar se o usuário está atribuído
//     if (!task.assignees.includes(userId)) {
//       toast.error("Usuário não está atribuído a esta tarefa")
//       return
//     }

//     // Guardar estado original
//     const originalAssignees = [...task.assignees]

//     try {
//       // Atualizar localmente
//       updateTask(taskId, {
//         assignees: task.assignees.filter(id => id !== userId)
//       })
      
//       // Enviar atualização em tempo real
//       await sendMessage({
//         type: "task_updated",
//         payload: {
//           taskId,
//           projectId: projectIdRef.current,
//           changes: { assignees: task.assignees.filter(id => id !== userId) },
//           updatedBy: "current_user",
//         },
//         roomId: `project:${projectIdRef.current}`,
//       })

//       toast.success("Usuário removido com sucesso!")
//     } catch (error) {
//       console.error("Erro ao remover usuário:", error)
//       toast.error("Erro ao remover usuário. Por favor, tente novamente.")
      
//       // Reverter mudança local em caso de erro
//       updateTask(taskId, { assignees: originalAssignees })
//     }
//   }

//   // Função para aplicar filtros
//   const filterTasks = (tasks: Task[]) => {
//     return tasks.filter(task => {
//       // Filtrar por prioridade
//       if (filters.priority?.length && !filters.priority.includes(task.priority)) {
//         return false;
//       }

//       // Filtrar por responsável
//       if (filters.assignee?.length && !task.assignees.some(id => filters.assignee?.includes(id))) {
//         return false;
//       }

//       // Filtrar por data de entrega
//       if (filters.hasDueDate !== undefined) {
//         const hasDueDate = Boolean(task.dueDate);
//         if (filters.hasDueDate !== hasDueDate) {
//           return false;
//         }
//       }

//       // Filtrar por atraso
//       if (filters.overdue) {
//         const dueDate = task.dueDate ? new Date(task.dueDate) : null;
//         if (!dueDate || dueDate > new Date()) {
//           return false;
//         }
//       }

//       // Filtrar por subtarefas
//       if (filters.hasSubtasks !== undefined) {
//         const hasSubtasks = task.subtasks?.length > 0;
//         if (filters.hasSubtasks !== hasSubtasks) {
//           return false;
//         }
//       }

//       // Filtrar por esforço
//       if (filters.minEffort !== undefined && task.effort < filters.minEffort) {
//         return false;
//       }
//       if (filters.maxEffort !== undefined && task.effort > filters.maxEffort) {
//         return false;
//       }

//       return true;
//     });
//   };

//   // Aplicar filtros sempre que as tarefas ou os filtros mudam
//   useEffect(() => {
//     if (!isLoading && tasks) {
//       try {
//         // Filtrar tarefas
//         const filteredTasks = filterTasks(tasks)

//         const statusColumns = getTasksByStatus()
        
//         // Atualizar colunas com tarefas filtradas
//         (Object.keys(statusColumns) as TaskStatus[]).forEach((columnId) => {
//           const column = statusColumns[columnId]
//           column.taskIds = filteredTasks
//             .filter(task => task.status === columnId)
//             .map(task => task.id)
//         })
        
//         setColumns(statusColumns)
//       } catch (error) {
//         console.error("Erro ao aplicar filtros:", error)
//         toast.error("Erro ao aplicar filtros. Por favor, recarregue a página.")
//       }
//     }
//   }, [tasks, filters, isLoading])

//   if (isLoading) {
//     return <div className="flex min-h-screen items-center justify-center">Carregando...</div>
//   }

//   return (
//     <div className="flex min-h-screen flex-col px-4 py-6">
//       <header className="mb-6 flex items-center justify-between">
//         <div className="flex items-center">
//           <Link href={`/projetos/${params.id}`} className="mr-4">
//             <ArrowLeft className="h-6 w-6" />
//           </Link>
//           <h1 className="text-xl font-bold">Quadro Kanban</h1>
//         </div>
//         <div className="flex items-center gap-2">
//           <Button variant="outline" size="sm">
//             <Link href={`/projetos/${params.id}/tarefas`}>Ver Lista</Link>
//           </Button>
//         </div>
//       </header>

//       {/* Search and Add Task */}
//       <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
//         <div className="flex flex-1 items-center gap-2">
//           <div className="flex-1">
//             <Input 
//               placeholder="Buscar tarefas..." 
//               className="border-white/10" 
//               value={searchQuery}
//               onChange={(e) => setSearchQuery(e.target.value)}
//             />
//           </div>
//           <div className="flex items-center gap-2">
//             <Button variant="outline" size="sm">
//               <Search className="h-4 w-4" />
//             </Button>
            
//             <TaskFiltersPanel 
//               filters={filters}
//               sortConfig={sortConfig}
//               onFiltersChange={setFilters}
//               onSortChange={setSortConfig}
//             />
//             {/* Controles de ordenação */}
//             {renderSortControls()}
//           </div>
//         </div>
//         <Button onClick={() => setShowNewTaskForm(true)}>
//           <Plus className="mr-2 h-4 w-4" />
//           Nova Tarefa
//         </Button>
//       </div>

//       {/* New Task Form */}
//       {showNewTaskForm && (
//         <div className="mb-6 rounded-lg border border-white/10 bg-white/5 p-4">
//           <div className="mb-4 flex items-center justify-between">
//             <h2 className="text-lg font-semibold">Nova Tarefa</h2>
//             <Button variant="ghost" size="sm" onClick={() => setShowNewTaskForm(false)}>
//               <X className="h-4 w-4" />
//             </Button>
//           </div>

//           <div className="space-y-4">
//             <div>
//               <label htmlFor="task-title" className="mb-1 block text-sm text-gray-400">
//                 Título
//               </label>
//               <Input
//                 id="task-title"
//                 placeholder="Título da tarefa"
//                 className="border-white/10"
//                 value={newTask.title}
//                 onChange={(e) => setNewTask({ ...newTask, title: e.target.value })}
//               />
//             </div>

//             <div>
//               <label htmlFor="task-description" className="mb-1 block text-sm text-gray-400">
//                 Descrição
//               </label>
//               <Input
//                 id="task-description"
//                 placeholder="Descrição breve da tarefa"
//                 className="border-white/10"
//                 value={newTask.description}
//                 onChange={(e) => setNewTask({ ...newTask, description: e.target.value })}
//               />
//             </div>

//             <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
//               <div>
//                 <label htmlFor="task-column" className="mb-1 block text-sm text-gray-400">
//                   Coluna
//                 </label>
//                 <select
//                   id="task-column"
//                   value={newTaskColumn}
//                   onChange={(e) => setNewTaskColumn(e.target.value as TaskStatus)}
//                   className="w-full rounded-lg border border-white/10 bg-black/80 px-3 py-2 text-base"
//                 >
//                   <option value="todo">A Fazer</option>
//                   <option value="in-progress">Em Progresso</option>
//                   <option value="review">Em Revisão</option>
//                   <option value="completed">Concluído</option>
//                 </select>
//               </div>

//               <div>
//                 <label htmlFor="task-priority" className="mb-1 block text-sm text-gray-400">
//                   Prioridade
//                 </label>
//                 <select
//                   id="task-priority"
//                   value={newTask.priority}
//                   onChange={(e) => setNewTask({ ...newTask, priority: e.target.value as Task["priority"] })}
//                   className="w-full rounded-lg border border-white/10 bg-black/80 px-3 py-2 text-base"
//                 >
//                   <option value="high">Alta</option>
//                   <option value="medium">Média</option>
//                   <option value="low">Baixa</option>
//                 </select>
//               </div>
//             </div>

//             <div>
//               <label htmlFor="task-due-date" className="mb-1 block text-sm text-gray-400">
//                 Data de Entrega
//               </label>
//               <Input
//                 id="task-due-date"
//                 type="date"
//                 className="border-white/10"
//                 value={newTask.dueDate}
//                 onChange={(e) => setNewTask({ ...newTask, dueDate: e.target.value })}
//               />
//             </div>

//             <div>
//               <label htmlFor="task-effort" className="mb-1 block text-sm text-gray-400">
//                 Esforço (horas)
//               </label>
//               <Input
//                 id="task-effort"
//                 type="number"
//                 min="1"
//                 max="100"
//                 className="border-white/10"
//                 value={newTask.effort}
//                 onChange={(e) => setNewTask({ ...newTask, effort: parseInt(e.target.value) || 8 })}
//               />
//             </div>

//             {/* Tags Input */}
//             <div>
//               <label htmlFor="task-tags" className="mb-1 block text-sm text-gray-400">
//                 Tags
//               </label>
//               <div className="mb-2 flex flex-wrap gap-1">
//                 {newTask.tags.map((tag, index) => (
//                   <div 
//                     key={index} 
//                     className="flex items-center gap-1 rounded-full bg-white/10 px-3 py-1"
//                   >
//                     <span className="text-sm">{tag}</span>
//                     <button type="button" onClick={() => handleRemoveTag(tag)}>
//                       <X className="h-3 w-3" />
//                     </button>
//                   </div>
//                 ))}
//               </div>
//               <div className="flex gap-2">
//                 <Input
//                   id="task-tags"
//                   value={newTagInput}
//                   onChange={(e) => setNewTagInput(e.target.value)}
//                   placeholder="Adicionar tag..."
//                   className="border-white/10"
//                   onKeyPress={(e) => {
//                     if (e.key === 'Enter') {
//                       e.preventDefault()
//                       handleAddTag()
//                     }
//                   }}
//                 />
//                 <Button 
//                   type="button" 
//                   variant="outline" 
//                   size="sm"
//                   onClick={handleAddTag}
//                 >
//                   <Tag className="h-4 w-4" />
//                 </Button>
//               </div>
//             </div>

//             {/* User Assignment */}
//             <div>
//               <UserAssignment
//                 assignedUsers={newTask.assignees}
//                 onAssign={(userId) => setNewTask({ ...newTask, assignees: [...newTask.assignees, userId] })}
//                 onUnassign={(userId) => setNewTask({ ...newTask, assignees: newTask.assignees.filter(id => id !== userId) })}
//                 size="sm"
//                 maxDisplayed={3}
//               />
//             </div>

//             <div className="flex gap-2 pt-2">
//               <Button variant="outline" onClick={() => setShowNewTaskForm(false)} className="flex-1">
//                 Cancelar
//               </Button>
//               <Button onClick={handleCreateTask} className="flex-1">
//                 Criar Tarefa
//               </Button>
//             </div>
//           </div>
//         </div>
//       )}

//       {/* Kanban Board */}
//       <div className="flex flex-1 flex-col gap-6 overflow-x-auto pb-6 md:flex-row md:items-start">
//         {(Object.entries(columns) as [TaskStatus, Column][]).map(([columnId, column]) => {
//           const isOver = dragOverColumnId === columnId
          
//           return (
//             <div
//               key={columnId}
//               className={`flex w-full flex-col rounded-lg border border-white/10 bg-white/5 p-3 transition-colors md:w-80 
//                 ${isOver ? 'border-blue-500' : ''}`}
//               onDragOver={(e) => handleDragOver(e, columnId as TaskStatus)}
//               onDrop={(e) => handleDrop(e, columnId as TaskStatus)}
//             >
//               <div className="mb-3 flex items-center justify-between">
//                 <h3 className="text-sm font-medium">{column.title}</h3>
//                 <span className="rounded-full bg-white/10 px-2 py-0.5 text-xs">
//                   {column.taskIds.length}
//                 </span>
//               </div>

//               <div className="flex-1 space-y-3 overflow-y-auto p-3" style={{ maxHeight: "calc(100vh - 250px)" }}>
//                 {column.taskIds.map((taskId) => {
//                   const task = tasksMap[taskId]
//                   if (!task) return null
                  
//                   const isDragging = draggingTaskId === taskId
//                   const priorityColor = priorityColors[task.priority]
                  
//                   return (
//                     <div
//                       key={taskId}
//                       className={`cursor-grab rounded-lg border-l-4 bg-white/5 p-3 transition-opacity 
//                         ${isDragging ? 'opacity-50' : 'opacity-100'} 
//                         ${priorityColor}`}
//                       draggable
//                       onDragStart={() => handleDragStart(taskId)}
//                     >
//                       <div className="mb-2 flex items-start justify-between">
//                         <h4 className="font-medium">{task.title}</h4>
//                       </div>

//                       <p className="mb-2 line-clamp-2 text-xs text-gray-400">{task.description}</p>

//                       <div className="mb-2 flex flex-wrap gap-1">
//                         {task.tags.map((tag, index) => (
//                           <span key={index} className="rounded-full bg-white/10 px-2 py-0.5 text-xs">
//                             {tag}
//                           </span>
//                         ))}
//                       </div>

//                       <div className="flex items-center justify-between text-xs text-gray-400">
//                         <span className="flex items-center gap-1">
//                           {task.dueDate ? new Date(task.dueDate).toLocaleDateString("pt-BR") : "Sem data"}
//                         </span>

//                         <UserAssignment
//                           assignedUsers={task.assignees || []}
//                           onAssign={(userId) => handleAssignUser(taskId, userId)}
//                           onUnassign={(userId) => handleUnassignUser(taskId, userId)}
//                           size="sm"
//                           maxDisplayed={2}
//                         />
//                       </div>
//                     </div>
//                   )
//                 })}
                
//                 {column.taskIds.length === 0 && (
//                   <div className="flex h-20 items-center justify-center rounded-lg border border-dashed border-white/10 p-4">
//                     <p className="text-center text-sm text-gray-400">Arraste tarefas para esta coluna</p>
//                   </div>
//                 )}
//               </div>

//               <Button
//                 variant="ghost"
//                 size="sm"
//                 className="w-full border border-dashed border-white/10 text-gray-400"
//                 onClick={() => {
//                   setShowNewTaskForm(true)
//                   setNewTaskColumn(columnId)
//                 }}
//               >
//                 <Plus className="mr-2 h-4 w-4" />
//                 Adicionar Tarefa
//               </Button>
//             </div>
//           )
//         })}
//       </div>
//     </div>
//   )
// }
