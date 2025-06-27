"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { X, Search, Clock, Users, Star, MapPin } from "lucide-react"

interface Project {
  id: string
  title: string
  description: string
  status: string
  duration?: string
  participants?: number
  maxParticipants?: number
  technologies?: string[]
  difficulty?: string
  location?: string
  deadline?: string
}

interface AllProjectsModalProps {
  isOpen: boolean
  onClose: () => void
  onApply: (project: Project) => void
  onViewTasks: (projectId: string) => void
  projects: Project[] // Nova prop para receber os projetos
}

const statusColors: Record<string, string> = {
  open: "bg-green-500",
  "in-progress": "bg-yellow-500",
  completed: "bg-blue-500",
  "Em andamento": "bg-yellow-500",
  "Aberto": "bg-green-500",
  "Concluído": "bg-blue-500",
  "Pausado": "bg-gray-500",
}

const statusLabels: Record<string, string> = {
  open: "Aberto",
  "in-progress": "Em Andamento",
  completed: "Concluído",
  "Em andamento": "Em Andamento",
  "Aberto": "Aberto",
  "Concluído": "Concluído",
  "Pausado": "Pausado",
}

const difficultyColors: Record<string, string> = {
  Iniciante: "text-green-400",
  Intermediário: "text-yellow-400",
  Avançado: "text-red-400",
}

// Função auxiliar para verificar se um projeto é uma oportunidade elegível para candidatura
const isEligibleForApplication = (project: Project) => {
  // Verifica se o projeto tem as propriedades típicas de uma oportunidade
  const isOpportunity = project.duration && project.technologies && project.difficulty;
  
  // Verifica se o status é elegível para candidatura
  const hasEligibleStatus = 
    project.status === "open" || 
    project.status === "Aberto" || 
    project.status === "Novo" || 
    project.status === "Urgente";
    
  return isOpportunity && hasEligibleStatus;
};

export function AllProjectsModal({ isOpen, onClose, onApply, onViewTasks, projects }: AllProjectsModalProps) {
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState<string>("all")
  const [difficultyFilter, setDifficultyFilter] = useState<string>("all")

  const filteredProjects = projects.filter((project) => {
    const matchesSearch =
      project.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      project.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      project.technologies?.some((tech) => tech.toLowerCase().includes(searchTerm.toLowerCase())) || false

    const matchesStatus = statusFilter === "all" || project.status.toLowerCase() === statusFilter.toLowerCase()
    const matchesDifficulty = difficultyFilter === "all" || project.difficulty === difficultyFilter

    return matchesSearch && matchesStatus && matchesDifficulty
  })

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <div className="w-full max-w-6xl rounded-lg border border-white/10 bg-black/90 backdrop-blur-sm">
        <div className="border-b border-white/10 p-6">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-bold">Todos os Projetos</h2>
            <Button variant="ghost" size="sm" onClick={onClose}>
              <X className="h-4 w-4" />
            </Button>
          </div>
        </div>

        <div className="p-6">
          {/* Search and Filters */}
          <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
              <Input
                placeholder="Buscar projetos, tecnologias..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="border-white/10 pl-10"
              />
            </div>

            <div className="flex gap-2">
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="rounded-lg border border-white/10 bg-black/80 px-3 py-2 text-sm"
              >
                <option value="all">Todos os Status</option>
                <option value="aberto">Aberto</option>
                <option value="em andamento">Em Andamento</option>
                <option value="concluído">Concluído</option>
                <option value="pausado">Pausado</option>
              </select>

              <select
                value={difficultyFilter}
                onChange={(e) => setDifficultyFilter(e.target.value)}
                className="rounded-lg border border-white/10 bg-black/80 px-3 py-2 text-sm"
              >
                <option value="all">Todas as Dificuldades</option>
                <option value="Iniciante">Iniciante</option>
                <option value="Intermediário">Intermediário</option>
                <option value="Avançado">Avançado</option>
              </select>
            </div>
          </div>

          {/* Results Count */}
          <div className="mb-4 text-sm text-gray-400">{filteredProjects.length} projeto(s) encontrado(s)</div>

          {/* Projects Grid */}
          <div className="max-h-[60vh] overflow-y-auto">
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {filteredProjects.map((project) => (
                <div key={project.id} className="rounded-lg border border-white/10 bg-white/5 p-4">
                  <div className="mb-3 flex items-start justify-between">
                    <h3 className="font-semibold">{project.title}</h3>
                    <span
                      className={`rounded-full px-2 py-0.5 text-xs font-medium text-white ${statusColors[project.status] || 'bg-gray-500'}`}
                    >
                      {statusLabels[project.status] || project.status}
                    </span>
                  </div>

                  <p className="mb-3 text-sm text-gray-300 line-clamp-2">{project.description}</p>

                  <div className="mb-3 space-y-2">
                    <div className="flex items-center gap-4 text-xs text-gray-400">
                      {project.duration && (
                        <span className="flex items-center gap-1">
                          <Clock className="h-3 w-3" />
                          {project.duration}
                        </span>
                      )}
                      {project.participants !== undefined && project.maxParticipants !== undefined && (
                        <span className="flex items-center gap-1">
                          <Users className="h-3 w-3" />
                          {project.participants}/{project.maxParticipants}
                        </span>
                      )}
                    </div>

                    <div className="flex items-center gap-4 text-xs text-gray-400">
                      {project.difficulty && (
                        <span className="flex items-center gap-1">
                          <Star className="h-3 w-3" />
                          <span className={difficultyColors[project.difficulty] || 'text-gray-400'}>{project.difficulty}</span>
                        </span>
                      )}
                      {project.location && (
                        <span className="flex items-center gap-1">
                          <MapPin className="h-3 w-3" />
                          {project.location}
                        </span>
                      )}
                    </div>
                  </div>

                  {project.technologies && project.technologies.length > 0 && (
                    <div className="mb-3 flex flex-wrap gap-1">
                      {project.technologies.slice(0, 3).map((tech, index) => (
                        <span key={index} className="rounded-full bg-white/10 px-2 py-0.5 text-xs">
                          {tech}
                        </span>
                      ))}
                      {project.technologies.length > 3 && (
                        <span className="rounded-full bg-white/10 px-2 py-0.5 text-xs">
                          +{project.technologies.length - 3}
                        </span>
                      )}
                    </div>
                  )}

                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => onViewTasks(project.id)}
                      className="flex-1 text-xs"
                    >
                      Ver Detalhes
                    </Button>
                    {isEligibleForApplication(project) && (
                      <Button variant="default" size="sm" onClick={() => onApply(project)} className="flex-1 text-xs">
                        Candidatar-se
                      </Button>
                    )}
                  </div>
                </div>
              ))}
            </div>

            {filteredProjects.length === 0 && (
              <div className="py-12 text-center text-gray-400">
                <p>Nenhum projeto encontrado com os filtros aplicados.</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
