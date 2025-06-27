"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { ArrowLeft, MoreVertical, UserPlus, Calendar, Target, Edit, Save, X } from "lucide-react"
import { UserAssignment } from "@/components/user-assignment"
import { useAuthStore } from "@/lib/stores/auth-store"
import { toast } from "sonner"
import { Progress } from "@/components/ui/progress"
import { Slider } from "@/components/ui/slider"

// Definição dos tipos
interface Project {
  id: string
  title: string
  description: string
  status: string
  startDate?: string
  endDate?: string
  deadline?: string
  progress: number
  category?: string
  skills?: string[]
  technologies?: string[]
  workload?: number
  priority?: string
  leader?: {
    id: string
    name: string
    email: string
    role: string
    color: string
    avatar: string
  }
  members?: Array<{
    id: string
    name: string
    email: string
    role: string
    color: string
    avatar: string
  }>
  participants?: number
  tasks?: Array<{
    id: string
    title: string
    description: string
    status: string
    assignedTo: string[]
    startDate: string
    endDate: string
    priority: string
  }>
}

export default function ProjetoDetalhesPage({ params }: { params: { id: string } }) {
  const [project, setProject] = useState<Project | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [editingProgress, setEditingProgress] = useState(false)
  const [newProgress, setNewProgress] = useState(0)
  const [showMemberModal, setShowMemberModal] = useState(false)
  const { user, hasPermission } = useAuthStore()

  useEffect(() => {
    const loadProject = async () => {
      setIsLoading(true)
      // Simular atraso de API
      await new Promise((resolve) => setTimeout(resolve, 500))

      try {
        // Carregar dados globais dos projetos
        const savedProjects = localStorage.getItem(`projects`)
        // Backup: Carregar dos projetos do usuário
        const savedUserProjects = localStorage.getItem(`user_projects_${user?.id}`)
        const savedOpportunities = localStorage.getItem(`opportunities_${user?.id}`)
        
        let foundProject = null
        
        // Verificar primeiro em projetos globais (unificado)
        if (savedProjects) {
          const allProjects = JSON.parse(savedProjects)
          foundProject = allProjects.find((p: Project) => p.id === params.id)
        }
        
        // Se não encontrar, verificar nos projetos do usuário
        if (!foundProject && savedUserProjects) {
          const userProjects = JSON.parse(savedUserProjects)
          foundProject = userProjects.find((p: Project) => p.id === params.id)
        }
        
        // Por último, verificar nas oportunidades
        if (!foundProject && savedOpportunities) {
          const opportunities = JSON.parse(savedOpportunities)
          foundProject = opportunities.find((p: Project) => p.id === params.id)
        }
        
        if (foundProject) {
          // Enriquecer o projeto com dados adicionais se necessário
          const enrichedProject = {
            ...foundProject,
            startDate: foundProject.startDate || new Date().toLocaleDateString("pt-BR"),
            endDate: foundProject.endDate || foundProject.deadline,
            category: foundProject.category || "Desenvolvimento",
            skills: foundProject.skills || foundProject.technologies || ["React", "JavaScript"],
            workload: foundProject.workload || 40,
            priority: foundProject.priority || "medium",
            leader: foundProject.leader || {
              id: user?.id || "1",
              name: user?.name || "Usuário",
              email: user?.email || "usuario@exemplo.com",
              role: "Líder",
              color: "bg-blue-500",
              avatar: user?.name?.substring(0, 2).toUpperCase() || "US",
            },
            members: foundProject.members || [
              {
                id: user?.id || "1",
                name: user?.name || "Usuário",
                email: user?.email || "usuario@exemplo.com",
                role: "Líder",
                color: "bg-blue-500",
                avatar: user?.name?.substring(0, 2).toUpperCase() || "US",
              }
            ],
            tasks: foundProject.tasks || [
              {
                id: "1",
                title: "Iniciar projeto",
                description: "Configuração inicial e planejamento",
                status: "Pendente",
                assignedTo: [user?.id || "1"],
                startDate: new Date().toLocaleDateString("pt-BR"),
                endDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toLocaleDateString("pt-BR"),
                priority: "high",
              }
            ]
          }
          
          setProject(enrichedProject)
          setNewProgress(enrichedProject.progress)
        } else {
          // Fallback para dados mockados
          const mockProject = {
            id: params.id,
            title: "Projeto Exemplo",
            description: "Este é um projeto de exemplo criado automaticamente.",
            status: "Em andamento",
            startDate: new Date().toLocaleDateString("pt-BR"),
            endDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toLocaleDateString("pt-BR"),
            progress: 10,
            category: "Desenvolvimento",
            skills: ["React", "JavaScript", "TypeScript"],
            workload: 40,
            priority: "medium",
            leader: {
              id: user?.id || "1",
              name: user?.name || "Usuário",
              email: user?.email || "usuario@exemplo.com",
              role: "Líder",
              color: "bg-blue-500",
              avatar: user?.name?.substring(0, 2).toUpperCase() || "US",
            },
            members: [
              {
                id: user?.id || "1",
                name: user?.name || "Usuário",
                email: user?.email || "usuario@exemplo.com",
                role: "Líder",
                color: "bg-blue-500",
                avatar: user?.name?.substring(0, 2).toUpperCase() || "US",
              }
            ],
            tasks: [
              {
                id: "1",
                title: "Iniciar projeto",
                description: "Configuração inicial e planejamento",
                status: "Pendente",
                assignedTo: [user?.id || "1"],
                startDate: new Date().toLocaleDateString("pt-BR"),
                endDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toLocaleDateString("pt-BR"),
                priority: "high",
              }
            ]
          }
          
          setProject(mockProject)
          setNewProgress(mockProject.progress)
        }
      } catch (error) {
        console.error("Erro ao carregar projeto:", error)
        toast.error("Erro ao carregar detalhes do projeto")
      } finally {
        setIsLoading(false)
      }
    }

    loadProject()
  }, [params.id, user])

  const canManageProject =
    hasPermission && hasPermission("manage_projects") ||
    (project && user && (project.leader?.id === user.id || project.leader?.email === user.email))

  const updateProjectProgress = () => {
    if (!project) return
    
    // Atualizar o projeto localmente
    const updatedProject = { ...project, progress: newProgress }
    setProject(updatedProject)
    setEditingProgress(false)
    
    // Atualizar no localStorage
    const savedUserProjects = localStorage.getItem(`user_projects_${user?.id}`)
    if (savedUserProjects) {
      const userProjects = JSON.parse(savedUserProjects)
      const updatedProjects = userProjects.map((p: Project) => 
        p.id === project.id ? updatedProject : p
      )
      localStorage.setItem(`user_projects_${user?.id}`, JSON.stringify(updatedProjects))
    }
    
    toast.success("Progresso atualizado com sucesso!")
  }
  
  const handleTaskStatusChange = (taskId: string, newStatus: string) => {
    if (!project) return
    
    // Atualizar o status da tarefa
    const updatedTasks = project.tasks?.map(task => 
      task.id === taskId ? { ...task, status: newStatus } : task
    )
    
    // Calcular novo progresso baseado nas tarefas concluídas
    const completedTasks = updatedTasks?.filter(task => task.status === "Concluído").length || 0
    const totalTasks = updatedTasks?.length || 1
    const calculatedProgress = Math.round((completedTasks / totalTasks) * 100)
    
    // Atualizar o projeto
    const updatedProject = { 
      ...project, 
      tasks: updatedTasks,
      progress: calculatedProgress
    }
    
    setProject(updatedProject)
    setNewProgress(calculatedProgress)
    
    // Atualizar no localStorage
    const savedUserProjects = localStorage.getItem(`user_projects_${user?.id}`)
    if (savedUserProjects) {
      const userProjects = JSON.parse(savedUserProjects)
      const updatedProjects = userProjects.map((p: Project) => 
        p.id === project.id ? updatedProject : p
      )
      localStorage.setItem(`user_projects_${user?.id}`, JSON.stringify(updatedProjects))
    }
    
    toast.success("Tarefa atualizada com sucesso!")
  }
  
  const handleAddMember = (userId: string) => {
    if (!project || !project.members) return
    
    // Verificar se o usuário já é membro
    if (project.members.some(member => member.id === userId)) {
      toast.error("Este usuário já é membro do projeto")
      return
    }
    
    // Encontrar o usuário nos mockUsers do componente UserAssignment
    const mockUsers = require("@/components/user-assignment").mockUsers
    const userToAdd = mockUsers.find((u: any) => u.id === userId)
    
    if (!userToAdd) {
      toast.error("Usuário não encontrado")
      return
    }
    
    // Adicionar o usuário aos membros do projeto
    const updatedMembers = [...project.members, userToAdd]
    const updatedProject = { ...project, members: updatedMembers }
    
    setProject(updatedProject)
    
    // Atualizar no localStorage
    const savedUserProjects = localStorage.getItem(`user_projects_${user?.id}`)
    if (savedUserProjects) {
      const userProjects = JSON.parse(savedUserProjects)
      const updatedProjects = userProjects.map((p: Project) => 
        p.id === project.id ? updatedProject : p
      )
      localStorage.setItem(`user_projects_${user?.id}`, JSON.stringify(updatedProjects))
    }
    
    toast.success("Membro adicionado com sucesso!")
  }
  
  const handleRemoveMember = (userId: string) => {
    if (!project || !project.members) return
    
    // Verificar se é o líder do projeto
    if (project.leader?.id === userId) {
      toast.error("Não é possível remover o líder do projeto")
      return
    }
    
    // Remover o usuário dos membros do projeto
    const updatedMembers = project.members.filter(member => member.id !== userId)
    const updatedProject = { ...project, members: updatedMembers }
    
    setProject(updatedProject)
    
    // Atualizar no localStorage
    const savedUserProjects = localStorage.getItem(`user_projects_${user?.id}`)
    if (savedUserProjects) {
      const userProjects = JSON.parse(savedUserProjects)
      const updatedProjects = userProjects.map((p: Project) => 
        p.id === project.id ? updatedProject : p
      )
      localStorage.setItem(`user_projects_${user?.id}`, JSON.stringify(updatedProjects))
    }
    
    toast.success("Membro removido com sucesso!")
  }

  if (isLoading) {
    return (
      <div className="flex min-h-screen flex-col px-4 py-6">
        <div className="animate-pulse space-y-6">
          <div className="h-8 bg-white/10 rounded"></div>
          <div className="h-64 bg-white/10 rounded"></div>
          <div className="h-32 bg-white/10 rounded"></div>
        </div>
      </div>
    )
  }

  if (!project) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center px-4 py-6">
        <div className="text-center space-y-4">
          <h1 className="text-2xl font-bold">Projeto não encontrado</h1>
          <p className="text-gray-400">O projeto solicitado não existe ou foi removido.</p>
          <Button>
            <Link href="/projetos">Voltar aos Projetos</Link>
          </Button>
        </div>
      </div>
    )
  }

  const getStatusColor = (status: string) => {
    const colors = {
      "Em andamento": "bg-blue-500",
      Aberto: "bg-green-500",
      Concluído: "bg-gray-500",
      Pausado: "bg-yellow-500",
    }
    return colors[status as keyof typeof colors] || "bg-gray-500"
  }

  const getPriorityColor = (priority: string) => {
    const colors = {
      high: "bg-red-500/20 text-red-400",
      medium: "bg-yellow-500/20 text-yellow-400",
      low: "bg-green-500/20 text-green-400",
    }
    return colors[priority as keyof typeof colors] || "bg-gray-500/20 text-gray-400"
  }

  const getTaskStatusColor = (status: string) => {
    const colors = {
      "Em progresso": "bg-blue-500",
      Pendente: "bg-yellow-500",
      Concluído: "bg-green-500",
    }
    return colors[status as keyof typeof colors] || "bg-gray-500"
  }

  return (
    <div className="flex min-h-screen flex-col px-4 py-6">
      <header className="mb-6 flex items-center justify-between">
        <div className="flex items-center">
          <Link href="/projetos" className="mr-4">
            <ArrowLeft className="h-6 w-6" />
          </Link>
          <h1 className="text-xl font-bold">Detalhes do Projeto</h1>
        </div>
        {/* <button>
          <MoreVertical className="h-6 w-6" />
        </button> */}
      </header>

      <div className="space-y-6">
        {/* Project Header */}
        <section className="rounded-lg bg-white/5 p-6">
          <h2 className="mb-2 text-center text-xl font-bold">{project.title}</h2>
          <div className="mb-4 flex justify-center">
            <span className={`rounded-full ${getStatusColor(project.status)} px-4 py-1 text-sm font-medium text-white`}>
              {project.status}
            </span>
          </div>

          {/* Project Stats */}
          <div className="mb-4 grid grid-cols-2 gap-4 border-b border-white/10 pb-4">
            <div>
              <p className="text-sm text-gray-400">Data de início</p>
              <p className="font-medium">{project.startDate}</p>
            </div>
            <div>
              <p className="text-sm text-gray-400">Prazo final</p>
              <p className="font-medium">{project.endDate}</p>
            </div>
          </div>

          {/* Progress Bar */}
          <div className="mb-4 border-b border-white/10 pb-4">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm text-gray-400">Progresso</span>
              <div className="flex items-center gap-2">
                <span className="text-sm font-medium">{editingProgress ? newProgress : project.progress}%</span>
                {canManageProject && (
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    className="h-6 w-6 p-0" 
                    onClick={() => {
                      if (editingProgress) {
                        updateProjectProgress()
                      } else {
                        setEditingProgress(true)
                      }
                    }}
                  >
                    {editingProgress ? <Save className="h-3 w-3" /> : <Edit className="h-3 w-3" />}
                  </Button>
                )}
                {editingProgress && (
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    className="h-6 w-6 p-0 text-red-400" 
                    onClick={() => {
                      setEditingProgress(false)
                      setNewProgress(project.progress)
                    }}
                  >
                    <X className="h-3 w-3" />
                  </Button>
                )}
              </div>
            </div>
            {editingProgress ? (
              <div className="py-2">
                <Slider
                  value={[newProgress]}
                  min={0}
                  max={100}
                  step={1}
                  onValueChange={(value) => setNewProgress(value[0])}
                />
              </div>
            ) : (
              <Progress value={project.progress} className="h-2" />
            )}
          </div>

          {/* Project Info */}
          <div className="mb-4 grid grid-cols-2 gap-4 border-b border-white/10 pb-4">
            <div>
              <p className="text-sm text-gray-400">Categoria</p>
              <p className="font-medium">{project.category}</p>
            </div>
            <div>
              <p className="text-sm text-gray-400">Carga Horária</p>
              <p className="font-medium">{project.workload}h</p>
            </div>
          </div>

          {/* Skills */}
          <div className="mb-4 border-b border-white/10 pb-4">
            <p className="text-sm text-gray-400 mb-2">Tecnologias</p>
            <div className="flex flex-wrap gap-2">
              {project.skills?.map((skill, index) => (
                <span key={index} className="rounded-full bg-blue-500/20 text-blue-400 px-2 py-1 text-xs">
                  {skill}
                </span>
              ))}
            </div>
          </div>

          {/* Priority */}
          <div className="mb-4 border-b border-white/10 pb-4">
            <p className="text-sm text-gray-400 mb-2">Prioridade</p>
            <span className={`rounded-full px-2 py-1 text-xs ${getPriorityColor(project.priority || 'medium')}`}>
              {project.priority === "high" ? "Alta" : project.priority === "medium" ? "Média" : "Baixa"}
            </span>
          </div>

          {/* Leader */}
          <div className="border-b border-white/10 pb-4">
            <h3 className="mb-2 font-medium">Líder do Projeto</h3>
            <div className="flex items-center">
              <div className={`mr-3 h-10 w-10 rounded-full ${project.leader?.color || 'bg-gray-500'} flex items-center justify-center`}>
                <span className="text-sm font-bold text-white">{project.leader?.avatar}</span>
              </div>
              <div>
                <p className="font-medium">{project.leader?.name}</p>
                <p className="text-sm text-gray-400">{project.leader?.email}</p>
                <p className="text-sm text-gray-400">{project.leader?.role}</p>
              </div>
            </div>
          </div>

          {/* Members */}
          <div className="pt-4">
            <div className="mb-2 flex items-center justify-between">
              <h3 className="font-medium">Participantes ({project?.members?.length})</h3>
              {canManageProject && (
                <Button 
                  variant="outline" 
                  size="sm" 
                  className="text-xs"
                  onClick={() => setShowMemberModal(!showMemberModal)}
                >
                  <UserPlus className="mr-2 h-3 w-3" />
                  Gerenciar
                </Button>
              )}
            </div>
            <UserAssignment
              assignedUsers={project.members?.map((m) => m.id) || []}
              onAssign={handleAddMember}
              onUnassign={handleRemoveMember}
              size="md"
              maxDisplayed={5}
              showAddButton={canManageProject ? showMemberModal : false}
            />
          </div>
        </section>

        {/* Action Buttons */}
        <div className="flex gap-2">
          <Button variant="outline" size="lg" className="flex-1">
            <Link href={`/projetos/${params.id}/tarefas`}>
              <Target className="mr-2 h-4 w-4" />
              Tarefas
            </Link>
          </Button>
          {/* <Button variant="outline" size="lg" className="flex-1">
            <Link href={`/projetos/${params.id}/kanban`}>
              <Calendar className="mr-2 h-4 w-4" />
              Kanban
            </Link>
          </Button> */}
        </div>

        {/* Description */}
        <section>
          <h2 className="mb-4 text-xl font-bold">Descrição do Projeto</h2>
          <div className="space-y-4 rounded-lg bg-white/5 p-4">
            <div>
              <h3 className="font-medium">Objetivo Principal</h3>
              <p className="text-sm text-gray-300">{project.description}</p>
            </div>
          </div>
        </section>

        {/* Tasks Section
        <section>
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-xl font-bold">Tarefas ({project.tasks?.length})</h2>
            <Button variant="default" size="sm" className="rounded-full">
              <Link href={`/projetos/${params.id}/tarefas`}>+ Nova Tarefa</Link>
            </Button>
          </div>

          <div className="space-y-4">
            {project.tasks?.map((task) => (
              <div key={task.id} className="flex items-start space-x-3 rounded-lg bg-white/5 p-4">
                <div className="flex h-6 w-6 items-center justify-center rounded-full bg-info text-white text-xs">
                  {task.id}
                </div>
                <div className="flex-1">
                  <div className="mb-1">
                    <h3 className="font-medium">{task.title}</h3>
                    <p className="text-xs text-gray-300 mb-1">{task.description}</p>
                    <p className="text-xs text-gray-400">
                      {task.startDate} - {task.endDate}
                    </p>
                    <div className="mt-1 flex items-center gap-2">
                      <p className="text-xs text-gray-400">Responsáveis:</p>
                      <UserAssignment
                        assignedUsers={task.assignedTo}
                        onAssign={() => {}}
                        onUnassign={() => {}}
                        size="sm"
                        maxDisplayed={3}
                        showAddButton={false}
                      />
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    {canManageProject ? (
                      <select 
                        className="rounded-md bg-transparent border border-white/20 px-2 py-0.5 text-xs"
                        value={task.status}
                        onChange={(e) => handleTaskStatusChange(task.id, e.target.value)}
                      >
                        <option value="Pendente">Pendente</option>
                        <option value="Em progresso">Em progresso</option>
                        <option value="Concluído">Concluído</option>
                      </select>
                    ) : (
                      <span
                        className={`inline-block rounded-md ${getTaskStatusColor(task.status)} px-2 py-0.5 text-xs font-medium text-white`}
                      >
                        {task.status}
                      </span>
                    )}
                    <span className={`inline-block rounded-md px-2 py-0.5 text-xs ${getPriorityColor(task.priority)}`}>
                      {task.priority === "high" ? "Alta" : task.priority === "medium" ? "Média" : "Baixa"}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section> */}
      </div>
    </div>
  )
}
