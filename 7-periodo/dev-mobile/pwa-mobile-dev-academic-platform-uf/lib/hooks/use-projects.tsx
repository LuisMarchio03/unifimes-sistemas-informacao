"use client"

import { useState, useEffect, useCallback } from "react"
import { useRouter } from "next/navigation"
import { toast } from "sonner"
import { ProjectSummary, ProjectOpportunity, ProjectStatus, Project, UserProjectRelation } from "../types/project"
import { projectService } from "../services/project-service"
import type { User } from "../types/user"
import type { AuthStore } from "../types/auth-store"
import { useAuthStore } from "../stores/auth-store"

interface ProjectApplication {
  projectId: string;
  userId: string;
  role: string;
  message?: string;
}

export interface ProjectsHookReturn {
  userProjects: ProjectSummary[];
  opportunities: ProjectOpportunity[];
  isLoading: boolean;
  error: Error | null;
  selectedProjectId: string | null;
  showApplicationModal: boolean;
  showNewProjectModal: boolean;
  showApprovalModal: boolean;
  pendingCandidates: {id: string, name: string, role?: string}[];
  selectedProject: Project | null;
  statusFilter: ProjectStatus | 'todos';
  relationFilter: UserProjectRelation | 'todos';
  setStatusFilter: (filter: ProjectStatus | 'todos') => void;
  setRelationFilter: (filter: UserProjectRelation | 'todos') => void;
  getFilteredProjects: (status?: ProjectStatus | 'todos', relation?: UserProjectRelation | 'todos') => ProjectSummary[];
  setShowApplicationModal: (show: boolean) => void;
  setShowNewProjectModal: (show: boolean) => void;
  setShowApprovalModal: (show: boolean) => void;
  handleApplyToProject: (projectId: string) => void;
  handleApplicationSubmit: (applicationData: ProjectApplication) => Promise<void>;
  handleCreateProject: (projectData: Partial<Project>) => Promise<void>;
  handleDeleteProject: (projectId: string) => Promise<void>;
  handleViewProject: (projectId: string) => void;
  handleShowApprovals: (projectId: string) => Promise<void>;
  handleApproveCandidate: (candidateId: string) => Promise<void>;
  loadProjects: () => Promise<void>;
}

export function useProjects(): ProjectsHookReturn {
  const router = useRouter()
  const { user } = useAuthStore() as AuthStore
  const [userProjects, setUserProjects] = useState<ProjectSummary[]>([])
  const [opportunities, setOpportunities] = useState<ProjectOpportunity[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<Error | null>(null)
  const [selectedProjectId, setSelectedProjectId] = useState<string | null>(null)
  const [showApplicationModal, setShowApplicationModal] = useState(false)
  const [showNewProjectModal, setShowNewProjectModal] = useState(false)
  const [showApprovalModal, setShowApprovalModal] = useState(false)
  const [pendingCandidates, setPendingCandidates] = useState<{id: string, name: string, role?: string}[]>([])
  const [selectedProject, setSelectedProject] = useState<Project | null>(null)
  const [statusFilter, setStatusFilter] = useState<ProjectStatus | 'todos'>('todos')
  const [relationFilter, setRelationFilter] = useState<UserProjectRelation | 'todos'>('todos')

  const loadProjects = useCallback(async () => {
    if (!user?.id) return
    
    setIsLoading(true)
    setError(null)
    
    try {
      // Carregar projetos do usuário
      const projectsData = await projectService.getUserProjects(user.id)

      // Mapear projetos para o formato ProjectSummary
      const projectSummaries: ProjectSummary[] = projectsData.map(project => ({
        id: project.id,
        title: project.title,
        description: project.description,
        status: project.status,
        deadline: project.deadline,
        participantsCount: project.participants?.length || 0,
        progress: project.progress,
        technologies: project.technologies,
        difficulty: project.difficulty,
        userRelation: project.participants.find(p => p.id === user.id)?.relation || 'nao_associado'
      }))      
      setUserProjects(projectSummaries)
      
      // Carregar oportunidades de projetos para o usuário
      const projectOpportunities = await projectService.getProjectOpportunities(user.id)
      setOpportunities(projectOpportunities)
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : "Erro ao carregar projetos"
      setError(new Error(errorMessage))
      console.error("Erro ao carregar projetos:", error)
      toast.error(errorMessage)
      
      // Resetar estados em caso de erro
      setUserProjects([])
      setOpportunities([])
    } finally {
      setIsLoading(false)
    }
  }, [user?.id])

  useEffect(() => {
    loadProjects()
  }, [loadProjects])
  const handleApplyToProject = useCallback(async (projectId: string) => {
    try {
      setSelectedProjectId(projectId)
      // Buscar o projeto completo para exibir detalhes na modal
      const projectDetails = await projectService.getProjectById(projectId)
      if (projectDetails) {
        setSelectedProject(projectDetails)
        setShowApplicationModal(true)
      }
    } catch (error) {
      console.error("Erro ao obter dados do projeto:", error)
      toast.error("Não foi possível carregar os detalhes do projeto.")
    }
  }, [])
  
  const handleApplicationSubmit = useCallback(async (applicationData: ProjectApplication) => {
    if (!user?.id || !selectedProjectId) {
      toast.error("Erro ao processar sua candidatura: dados inválidos")
      return
    }
    
    try {
      // Aplicar o usuário ao projeto
      const userName = user?.name || 'Estudante'
      await projectService.applyToProject(selectedProjectId, user.id, userName)
      
      setShowApplicationModal(false)
      setSelectedProjectId(null)
      toast.success("Candidatura enviada com sucesso!")
      await loadProjects()
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : "Erro ao processar candidatura"
      console.error("Erro ao aplicar para o projeto:", error)
      toast.error(errorMessage)
    }  }, [user?.id, selectedProjectId, loadProjects])  

  const handleCreateProject = useCallback(async (projectData: Partial<Project>) => {
    if (!user?.id) {
      toast.error("Erro ao criar projeto: usuário não identificado")
      return
    }
    
    // Verificar se o usuário tem permissão para criar projetos (apenas admin e professor)
    if (user.role !== 'admin' && user.role !== 'professor') {
      toast.error("Você não tem permissão para criar projetos")
      return
    }
    if (user.role !== 'admin' && user.role !== 'professor') {
      toast.error("Você não tem permissão para criar projetos")
      return
    }
    
    try {
      const userName = user?.name || 'Usuário'
      const newProject = await projectService.createProject(
        projectData as Omit<Project, 'id'>,
        user.id,
        userName
      )
      if (newProject) {
        await loadProjects()
        setShowNewProjectModal(false)
        toast.success("Projeto criado com sucesso!")
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : "Erro ao criar projeto"
      console.error("Erro ao criar projeto:", error)
      toast.error(errorMessage)
    }
  }, [user, loadProjects])
  const handleDeleteProject = useCallback(async (projectId: string) => {
    if (!user?.id) {
      toast.error("Erro ao excluir projeto: usuário não identificado")
      return
    }
    
    // Verificar se o usuário tem permissão para excluir projetos (apenas admin e professor)
    if (user.role !== 'admin' && user.role !== 'professor') {
      toast.error("Você não tem permissão para excluir projetos")
      return
    }
    
    if (!confirm("Tem certeza que deseja excluir este projeto?")) return
    
    try {
      await projectService.deleteProject(projectId)
      await loadProjects()
      toast.success("Projeto excluído com sucesso!")
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : "Erro ao excluir projeto"
      console.error("Erro ao excluir projeto:", error)
      toast.error(errorMessage)
    }
  }, [loadProjects])

  const handleViewProject = useCallback((projectId: string) => {
    router.push(`/projetos/${projectId}`)
  }, [router])
  const handleShowApprovals = useCallback(async (projectId: string) => {
    if (!user?.id) return
    
    // Verificar se o usuário tem permissão para gerenciar candidaturas (apenas admin e professor)
    if (user.role !== 'admin' && user.role !== 'professor') {
      toast.error("Você não tem permissão para gerenciar candidaturas")
      return
    }
    
    try {
      const project = await projectService.getProjectById(projectId)
      
      if (!project) {
        throw new Error("Projeto não encontrado")
      }
      
      // Por enquanto, não temos a funcionalidade de aprovação implementada
      // Apenas mostramos um feedback para o usuário
      toast.info("Funcionalidade de aprovação em desenvolvimento")
      
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : "Erro ao carregar candidaturas"
      console.error("Erro ao carregar candidaturas:", error)
      toast.error(errorMessage)
    }
  }, [user?.id])
    const handleApproveCandidate = useCallback(async (candidateId: string) => {
    if (!user?.id || !selectedProject?.id) {
      toast.error("Erro ao processar aprovação: dados inválidos")
      return
    }
    
    // Verificar se o usuário tem permissão para aprovar candidatos (apenas admin e professor)
    if (user.role !== 'admin' && user.role !== 'professor') {
      toast.error("Você não tem permissão para aprovar candidatos")
      return
    }
    
    try {
      // Por enquanto, apenas mostramos um feedback para o usuário
      toast.info("Funcionalidade de aprovação em desenvolvimento")
      
      // TODO: Implementar aprovação quando o backend estiver pronto
      await loadProjects()
      
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : "Erro ao aprovar candidato"
      console.error("Erro ao aprovar candidato:", error)
      toast.error(errorMessage)
    }
  }, [user?.id, selectedProject?.id, loadProjects])

  const getFilteredProjects = useCallback((
    status: ProjectStatus | 'todos' = statusFilter,
    relation: UserProjectRelation | 'todos' = relationFilter
  ) => {
    return userProjects.filter((project: ProjectSummary) => {
      const statusMatch = status === 'todos' || project.status === status
      const relationMatch = relation === 'todos' || project.userRelation === relation
      return statusMatch && relationMatch
    })
  }, [userProjects, statusFilter, relationFilter])

  return {
    userProjects,
    opportunities,
    isLoading,
    error,
    selectedProjectId,
    showApplicationModal,
    showNewProjectModal,
    showApprovalModal,
    pendingCandidates,
    selectedProject,
    statusFilter,
    relationFilter,
    setStatusFilter,
    setRelationFilter,
    getFilteredProjects,
    setShowApplicationModal,
    setShowNewProjectModal,
    setShowApprovalModal,
    handleApplyToProject,
    handleApplicationSubmit,
    handleCreateProject,
    handleDeleteProject,
    handleViewProject,
    handleShowApprovals,
    handleApproveCandidate,
    loadProjects
  }
}
