"use client"

import { useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { ProjectApplicationModal } from "@/components/projects/project-application-modal"
import { AllProjectsModal } from "@/components/projects/all-projects-modal"
import { NewProjectModal } from "@/components/projects/new-project-modal"
import { CandidateApprovalModal } from "@/components/projects/candidate-approval-modal"
import { ProjectFormData } from "@/components/projects/project-form"
import { Plus, Eye, UserCheck, CheckCircle, Clock, Search } from "lucide-react"
import { AppLayout } from "@/components/layout/app-layout"
import { SearchBar } from "@/components/layout/search-bar"
import { useAuthStore } from "@/lib/stores/auth-store"
import { useProjects } from "@/lib/hooks/use-projects"
import { useRouter } from "next/navigation"
import { ProjectOpportunity, ProjectSummary } from "@/lib/types/project"
import { ProjectsHookReturn, ProjectApplication } from "@/lib/types/projects-hook"
import { Input } from "@/components/ui/input"

export default function ProjetosPage() {
  const router = useRouter()
  const { user } = useAuthStore()
  const [searchTerm, setSearchTerm] = useState("")
  const [showAllProjectsModal, setShowAllProjectsModal] = useState(false)
  
  // Usar o hook de projetos para gerenciar o estado
  const { 
    userProjects,
    opportunities,
    isLoading,
    showApplicationModal,
    showNewProjectModal,
    showApprovalModal,
    pendingCandidates,
    selectedProject,
    setShowApplicationModal,
    setShowNewProjectModal,
    setShowApprovalModal,
    handleApplyToProject,
    handleApplicationSubmit,
    handleCreateProject,
    handleShowApprovals,
    handleApproveCandidate,
    handleDeleteProject
  } = useProjects() as ProjectsHookReturn

  // Filter projects based on search
  const filteredUserProjects = userProjects.filter(
    (project) =>
      project.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      project.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (project.technologies && project.technologies.some((tech: string) => tech.toLowerCase().includes(searchTerm.toLowerCase())))
  )

  const filteredOpportunities = opportunities.filter(
    (opportunity: ProjectOpportunity) =>
      opportunity.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      opportunity.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (opportunity.technologies && opportunity.technologies.some((tech: string) => tech.toLowerCase().includes(searchTerm.toLowerCase()))),
  )

  // Navegar para detalhes do projeto
  const handleViewTasks = (projectId: string) => {
    router.push(`/projetos/${projectId}`)
  }

  // Iseligible está sendo usado direto na UI
  const isEligibleForApplication = (opportunity: ProjectOpportunity): boolean => {
    return opportunity.userRelation === 'nao_associado' || opportunity.userRelation === 'convidado';
  }

  // Utilizamos a função de exclusão do hook de projetos

  return (
    <AppLayout title="Projetos" showSearch={false}>
      <main className="flex-1">
        {/* Search Bar */}
        <div className="mb-6">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
            <Input
              placeholder="Buscar projetos..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="border-white/10 pl-10"
            />
          </div>
        </div>

        {/* Welcome Section */}
        <div className="mb-6">
          <div className="relative mb-4">
            <div className="absolute inset-0 bg-gradient-to-r from-red-500/20 to-orange-500/20 blur-xl"></div>
            <div className="relative rounded-lg border border-white/10 bg-black/80 p-6">
              <h2 className="mb-2 text-xl font-bold">Bem-vindo de volta!</h2>
              <p className="mb-4 text-gray-300">
                Você tem {userProjects.length} projetos ativos e {opportunities.length} oportunidades disponíveis.
              </p>
              <div className="flex gap-2">
                {user && (user.role === 'admin' || user.role === 'professor') && (
                  <Button variant="default" onClick={() => setShowNewProjectModal(true)}>
                    <Plus className="mr-2 h-4 w-4" />
                    Novo Projeto
                  </Button>
                )}
                <Button variant="outline" onClick={() => setShowAllProjectsModal(true)}>
                  <Eye className="mr-2 h-4 w-4" />
                  Ver Todos
                </Button>
              </div>
            </div>
          </div>
        </div>

        {/* Your Projects Section */}
        <div className="mb-6">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-xl font-bold">Seus Projetos</h2>
            <div className="flex gap-2">
              <Button variant="outline" size="sm" onClick={() => setShowAllProjectsModal(true)}>
                Ver todos
              </Button>
              {user && (user.role === 'admin' || user.role === 'professor') && (
                <Button variant="default" size="sm" onClick={() => setShowNewProjectModal(true)}>
                  <Plus className="mr-1 h-4 w-4" />
                  Novo
                </Button>
              )}
            </div>
          </div>

          <div className="space-y-4">
            {isLoading ? (
              <div className="py-12">
                <div className="flex justify-center">
                  <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-primary"></div>
                </div>
                <p className="text-center mt-4 text-gray-400">Carregando seus projetos...</p>
              </div>
            ) : (
              filteredUserProjects.map((project) => (
                <div
                  key={project.id}
                  className="rounded-lg border border-white/10 bg-white/5 p-4 transition-colors hover:bg-white/10"
                >
                  <div className="mb-2 flex items-center justify-between">
                    <div>
                      <Link href={`/projetos/${project.id}`}>
                        <h3 className="font-bold hover:text-primary">{project.title}</h3>
                      </Link>
                      
                      <div className="flex items-center gap-2 mt-1">
                        {project.userRelation === 'coordenador' ? (
                          <span className="text-xs bg-amber-500/20 text-amber-300 px-2 py-0.5 rounded">Coordenador</span>  
                        ) : (
                          <span className="text-xs bg-blue-500/20 text-blue-300 px-2 py-0.5 rounded">Membro</span>
                        )}
                        
                        <span
                          className={`rounded px-2 py-0.5 text-xs font-medium ${
                            project.status === 'em_andamento' 
                              ? "bg-info/20 text-info" 
                              : project.status === 'concluido'
                                ? "bg-success/20 text-success"
                                : "bg-warning/20 text-warning"
                          }`}
                        >
                          {project.status === 'em_andamento' 
                            ? "Em andamento" 
                            : project.status === 'concluido'
                              ? "Concluído"
                              : project.status === 'aberto'
                                ? "Aberto"
                                : "Cancelado"}
                        </span>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-2">
                      <Button variant="outline" size="sm" onClick={() => handleViewTasks(project.id)}>
                        Ver Detalhes
                      </Button>
                      {project.userRelation === 'coordenador' && (
                        <>
                          {/* <Button variant="outline" size="sm" onClick={() => handleShowApprovals(project.id)}>
                            <UserCheck className="h-4 w-4" />
                            <span className="ml-1">Candidaturas</span>
                          </Button> */}
                          <Button variant="ghost" size="sm" className="text-red-400" onClick={() => handleDeleteProject(project.id)}>
                            Excluir
                          </Button>
                        </>
                      )}
                    </div>
                  </div>
                  
                  <p className="mb-2 text-sm text-gray-300">{project.description}</p>

                  {/* Progress Bar */}
                  <div className="mb-2">
                    <div className="flex justify-between text-xs text-gray-400 mb-1">
                      <span>Progresso</span>
                      <span>{project.progress}%</span>
                    </div>
                    <div className="w-full bg-gray-700 rounded-full h-2">
                      <div
                        className="bg-primary h-2 rounded-full transition-all duration-300"
                        style={{ width: `${project.progress}%` }}
                      ></div>
                    </div>
                  </div>

                  {/* Tecnologias */}
                  {project.technologies && project.technologies.length > 0 && (
                    <div className="mb-3 flex flex-wrap gap-1">
                      {project.technologies.slice(0, 3).map((tech, index) => (
                        <span key={index} className="rounded bg-white/10 px-2 py-0.5 text-xs">
                          {tech}
                        </span>
                      ))}
                      {project.technologies.length > 3 && (
                        <span className="rounded bg-white/10 px-2 py-0.5 text-xs">
                          +{project.technologies.length - 3}
                        </span>
                      )}
                    </div>
                  )}

                  <div className="flex justify-between text-xs text-gray-400">
                    <span>Prazo: {project.deadline}</span>
                    <span>{project.participantsCount} participantes</span>
                  </div>
                </div>
              ))
            )}

            {filteredUserProjects.length === 0 && searchTerm && (
              <div className="py-8 text-center text-gray-400">
                <p>Nenhum projeto encontrado para "{searchTerm}"</p>
              </div>
            )}

            {filteredUserProjects.length === 0 && !searchTerm && (
              <div className="py-8 text-center text-gray-400">
                <p>Você ainda não tem projetos</p>
                <Button variant="default" className="mt-4" onClick={() => setShowNewProjectModal(true)}>
                  <Plus className="mr-2 h-4 w-4" />
                  Criar Primeiro Projeto
                </Button>
              </div>
            )}
          </div>
        </div>

        {/* Opportunities Section */}
        <div>
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-xl font-bold">Oportunidades</h2>
            <Button variant="outline" size="sm" onClick={() => setShowAllProjectsModal(true)}>
              Ver todas
            </Button>
          </div>

          <div className="space-y-4">
            {isLoading ? (
              <div className="py-12">
                <div className="flex justify-center">
                  <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-primary"></div>
                </div>
                <p className="text-center mt-4 text-gray-400">Carregando oportunidades...</p>
              </div>
            ) : (
              filteredOpportunities.map((opportunity) => (
                <div key={opportunity.id} className="rounded-lg border border-white/10 bg-white/5 p-4">
                  <div className="mb-2 flex items-center justify-between">
                    <h3 className="font-bold">{opportunity.title}</h3>
                    <div>
                      {opportunity.userRelation === 'candidato' ? (
                        <span className="rounded-full bg-yellow-500/20 text-yellow-300 px-3 py-0.5 text-xs font-medium">
                          Candidatura enviada
                        </span>
                      ) : (
                        <span className="rounded-full bg-green-500/20 text-green-300 px-3 py-0.5 text-xs font-medium">
                          Disponível
                        </span>
                      )}
                    </div>
                  </div>
                  <p className="mb-2 text-sm text-gray-300">{opportunity.description}</p>

                  <div className="mb-3 flex flex-wrap gap-2">
                    {opportunity.technologies.map((tech, index) => (
                      <span key={index} className="rounded bg-white/10 px-2 py-0.5 text-xs">
                        {tech}
                      </span>
                    ))}
                  </div>

                  <div className="flex justify-between items-center">
                    <div className="flex flex-col gap-1 text-xs text-gray-400">
                      <div className="flex items-center gap-2">
                        <Clock className="h-3.5 w-3.5" />
                        <span>Duração: {opportunity.duration}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <CheckCircle className="h-3.5 w-3.5" />
                        <span>Dificuldade: {opportunity.difficulty}</span>
                      </div>
                    </div>
                    
                    {opportunity.userRelation === 'nao_associado' ? (
                      <Button variant="outline" size="sm" onClick={() => handleApplyToProject(opportunity.id)}>
                        Candidatar-se
                      </Button>
                    ) : opportunity.userRelation === 'candidato' ? (
                      <Button variant="ghost" size="sm" disabled>
                        Aguardando aprovação
                      </Button>
                    ) : (
                      <Button variant="outline" size="sm" onClick={() => router.push(`/projetos/${opportunity.id}`)}>
                        Ver detalhes
                      </Button>
                    )}
                  </div>
                </div>
              ))
            )}

            {!isLoading && filteredOpportunities.length === 0 && searchTerm && (
              <div className="py-8 text-center text-gray-400">
                <p>Nenhuma oportunidade encontrada para "{searchTerm}"</p>
              </div>
            )}

            {!isLoading && filteredOpportunities.length === 0 && !searchTerm && (
              <div className="py-8 text-center text-gray-400">
                <p>Não há oportunidades disponíveis no momento</p>
              </div>
            )}
          </div>
        </div>
      </main>
    
      {selectedProject && (
        <ProjectApplicationModal
          project={{
            id: selectedProject.id,
            title: selectedProject.title,
            description: selectedProject.description,
            duration: selectedProject.deadline || "",
            technologies: selectedProject.technologies || [],
            difficulty: selectedProject.difficulty || "Intermediário"
          }}
          isOpen={showApplicationModal}
          onClose={() => setShowApplicationModal(false)}
          onSubmit={(application) => {
            const projectApplication: ProjectApplication = {
              projectId: selectedProject.id,
              userId: user?.id || '',
              role: '',
              message:  ''
            };
            void handleApplicationSubmit(projectApplication);
          }}
        />
      )}

      <AllProjectsModal
        isOpen={showAllProjectsModal}
        onClose={() => setShowAllProjectsModal(false)}
        onApply={(project) => handleApplyToProject(project.id)}
        onViewTasks={handleViewTasks}
        projects={[
          ...userProjects.map(project => ({
            ...project,
            duration: project.deadline || "",
            difficulty: project.difficulty || "",
            location: "Remoto",
            technologies: project.technologies || []
          })),
          ...opportunities.map(opportunity => ({
            ...opportunity,
            status: 'Aberto',
            participants: 0,
            maxParticipants: 4
          }))
        ]} // Adaptando os projetos e oportunidades
      />

      <NewProjectModal
        isOpen={showNewProjectModal}
        onClose={() => setShowNewProjectModal(false)}
        onSubmit={handleCreateProject}
      />
      
      {/* Modal de aprovação de candidaturas */}
      {selectedProject && (
        <CandidateApprovalModal
          open={showApprovalModal}
          onOpenChange={setShowApprovalModal}
          candidates={pendingCandidates}
          projectTitle={selectedProject.title}
          onApprove={handleApproveCandidate}
        />
      )}
    </AppLayout>
  )
}
