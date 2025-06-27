"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Clock, ChevronRight } from "lucide-react"
import { ProjectSummary, ProjectStatus } from "@/lib/types/project"

interface ProjectListProps {
  projects: ProjectSummary[]
  isLoading: boolean
  isAdmin?: boolean
  limit?: number
}

export function ProjectList({ projects, isLoading, isAdmin = false, limit = 2 }: ProjectListProps) {
  // Transformar status interno para exibição
  const getStatusDisplay = (status: ProjectStatus): string => {
    const statusMap: Record<ProjectStatus, string> = {
      'aberto': 'Aberto',
      'em_andamento': 'Em andamento',
      'concluido': 'Concluído',
      'cancelado': 'Cancelado'
    };
    return statusMap[status] || status;
  };
  
  // Determinar cor do status
  const getStatusColor = (status: ProjectStatus): string => {
    const colorMap: Record<ProjectStatus, string> = {
      'aberto': 'bg-green-500',
      'em_andamento': 'bg-blue-500',
      'concluido': 'bg-purple-500',
      'cancelado': 'bg-red-500'
    };
    return colorMap[status] || 'bg-yellow-500';
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold">{isAdmin ? "Projetos Recentes" : "Projetos Ativos"}</h2>
        <Button variant="ghost" size="sm">
          <Link href="/projetos">
            Ver todos
            <ChevronRight className="ml-1 h-4 w-4" />
          </Link>
        </Button>
      </div>

      <div className="space-y-3">
        {isLoading ? (
          <div className="rounded-lg border border-white/10 bg-white/5 p-6 text-center">
            <p className="text-gray-400 text-sm">Carregando projetos...</p>
          </div>
        ) : projects.length === 0 ? (
          <div className="rounded-lg border border-white/10 bg-white/5 p-6 text-center">
            <p className="text-gray-400 text-sm">Você ainda não tem projetos ativos.</p>
          </div>
        ) : (
          projects.slice(0, limit).map(project => (
            <Link key={project.id} href={`/projetos/${project.id}`}>
              <div className="rounded-lg border border-white/10 bg-white/5 p-4 transition-colors hover:bg-white/10">
                <div className="flex items-start justify-between mb-2">
                  <h3 className="font-semibold text-sm">{project.title}</h3>
                  <span className={`rounded-full ${getStatusColor(project.status)} px-2 py-0.5 text-xs font-medium`}>
                    {getStatusDisplay(project.status)}
                  </span>
                </div>
                
                <div className="flex items-center justify-between text-xs text-gray-400">
                  <span className="flex items-center">
                    <Clock className="mr-1 h-3 w-3" />
                    Prazo: {project.deadline}
                  </span>
                  <span>
                    {project.progress}% concluído
                  </span>
                </div>
                
                <div className="mt-2 h-1 bg-white/10 rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-gradient-to-r from-red-500 to-orange-500 rounded-full"
                    style={{ width: `${project.progress}%` }}
                  ></div>
                </div>
              </div>
            </Link>
          ))
        )}
      </div>
    </div>
  );
}
