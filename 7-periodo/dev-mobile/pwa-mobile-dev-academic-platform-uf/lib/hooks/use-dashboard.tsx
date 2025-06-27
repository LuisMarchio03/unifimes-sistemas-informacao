"use client"

import { useState, useEffect } from "react"
import { useAuthStore } from "../stores/auth-store"
import type { AuthStore } from "../types/auth-store"
import { ProjectSummary, ProjectOpportunity, Project } from "@/lib/types/project"
import { projectService } from "@/lib/services/project-service"

export function useDashboard() {
  const { user } = useAuthStore() as AuthStore
  const [userProjects, setUserProjects] = useState<ProjectSummary[]>([])
  const [opportunities, setOpportunities] = useState<ProjectOpportunity[]>([])
  const [tasksDueToday, setTasksDueToday] = useState<any[]>([])
  const [recentActivity, setRecentActivity] = useState<any[]>([])
  const [upcomingDeadlines, setUpcomingDeadlines] = useState<any[]>([])
  const [totalProjects, setTotalProjects] = useState(0)
  const [totalHours, setTotalHours] = useState(0)
  const [isLoading, setIsLoading] = useState(true)

  const mapProjectToSummary = (project: Project): ProjectSummary => ({
    id: project.id,
    title: project.title,
    description: project.description,
    status: project.status,
    deadline: project.deadline,
    participantsCount: project.participants.length,
    progress: project.progress,
    technologies: project.technologies,
    difficulty: project.difficulty,
    userRelation: project.userRelation
  })

  useEffect(() => {
    const loadDashboardData = async () => {
      setIsLoading(true)
      
      try {
        if (user?.id) {
          // Importar serviço do dashboard
          const { loadDashboardData } = await import("@/lib/services/dashboard-service")
          
          // Inicializar dados de exemplo e carregar projetos do usuário
          await projectService.initializeProjectData(user.id, user.name || 'Usuário')
          
          // Carregar projetos do usuário
          const projects = await projectService.getUserProjects(user.id)
          const projectSummaries = projects.map(mapProjectToSummary)
          setUserProjects(projectSummaries)
          setTotalProjects(projects.length)
          
          // Carregar oportunidades
          const opportunities = await projectService.getProjectOpportunities(user.id)
          setOpportunities(opportunities)
          
          // Carregar dados do dashboard
          const dashboardData = await loadDashboardData(user.id)
          setTasksDueToday(dashboardData.tasksDueToday || [])
          setRecentActivity(dashboardData.recentActivity || [])
          setUpcomingDeadlines(dashboardData.upcomingDeadlines || [])
          setTotalHours(dashboardData.totalHours || 0)
        }
      } catch (error) {
        console.error("Erro ao carregar dados do dashboard:", error)
      } finally {
        setIsLoading(false)
      }
    }
    
    loadDashboardData()
  }, [user?.id])

  const handleApplyToProject = async (projectId: string) => {
    if (!user?.id) return
    
    try {
      const success = await projectService.applyToProject(
        projectId,
        user.id,
        user.name || 'Usuário'
      )
      
      if (success) {
        await loadProjects()
      }
    } catch (error) {
      console.error("Erro ao candidatar-se ao projeto:", error)
    }
  }
  
  const loadProjects = async () => {
    if (!user?.id) return
    
    try {
      // Carregar projetos do usuário
      const projects = await projectService.getUserProjects(user.id)
      const projectSummaries = projects.map(mapProjectToSummary)
      setUserProjects(projectSummaries)
      
      // Carregar oportunidades
      const opportunities = await projectService.getProjectOpportunities(user.id)
      setOpportunities(opportunities)
    } catch (error) {
      console.error("Erro ao recarregar projetos:", error)
    }
  }

  return {
    userProjects,
    opportunities,
    tasksDueToday,
    recentActivity,
    upcomingDeadlines,
    totalProjects,
    totalHours,
    isLoading,
    handleApplyToProject,
    loadProjects
  }
}
