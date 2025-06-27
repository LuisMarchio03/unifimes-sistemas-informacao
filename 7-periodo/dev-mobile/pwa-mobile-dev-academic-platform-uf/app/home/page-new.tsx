"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { useAuthStore } from "@/lib/stores/auth-store"
import {
  Plus,
  Calendar,
  Clock,
  TrendingUp,
  Award,
  BookOpen,
  Target,
  ChevronRight,
  Star,
  Users,
  Search,
} from "lucide-react"
import { useRouter } from "next/navigation"
import { toast } from "sonner"
import { useState, useEffect } from "react"
import { AgendaModal } from "@/components/home/agenda-modal"
import { GoalsModal } from "@/components/home/goals-modal"
import { ProjectList } from "@/components/projects/project-list"
import { ProjectOpportunities } from "@/components/projects/project-opportunities"
import { AppLayout } from "@/components/layout/app-layout"
import { useDashboard } from "@/lib/hooks/use-dashboard"

export default function HomePage() {
  const { user, logout, hasPermission } = useAuthStore()
  const router = useRouter()
  
  const [agendaModalOpen, setAgendaModalOpen] = useState(false)
  const [goalsModalOpen, setGoalsModalOpen] = useState(false)
  
  // Usar hook para gerenciar o estado dos dados do dashboard
  const {
    userProjects,
    opportunities,
    tasksDueToday,
    recentActivity,
    upcomingDeadlines,
    totalProjects,
    totalHours,
    isLoading,
    handleApplyToProject
  } = useDashboard()

  const handleLogout = () => {
    logout()
    toast.success("Logout realizado com sucesso!")
    router.push("/")
  }

  if (!user) {
    router.push("/")
    return null
  }

  const canCreateProject = hasPermission("create_project")

  const getRoleDisplay = (role: string) => {
    const roleMap = {
      admin: "Administrador",
      student: "Estudante",
      professor: "Professor",
    }
    return roleMap[role as keyof typeof roleMap] || role
  }

  return (
    <AppLayout title="Início">
      {/* Customização do header com dados do usuário */}
      <header className="border-b border-white/10 px-4 py-4 -mx-4 -mt-6 mb-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="h-10 w-10 rounded-full bg-gradient-to-r from-red-500 to-orange-500 flex items-center justify-center">
              <span className="text-sm font-bold">{user.avatar}</span>
            </div>
            <div>
              <h1 className="text-lg font-bold">Olá, {user.name.split(" ")[0]}!</h1>
              <p className="text-xs text-gray-400">
                {getRoleDisplay(user.role)} • {user.institution}
              </p>
            </div>
          </div>
          <div className="flex items-center space-x-4">
            <button onClick={handleLogout} className="text-gray-400 hover:text-white">
              <Calendar className="h-6 w-6" />
            </button>
          </div>
        </div>
      </header>

      {/* Welcome Card */}
      <div className="relative mb-6">
        <div className="absolute inset-0 bg-gradient-to-r from-red-500/20 to-orange-500/20 blur-xl"></div>
        <div className="relative rounded-lg border border-white/10 bg-black/80 p-6">
          <h2 className="mb-2 text-xl font-bold">Bem-vindo de volta!</h2>
          <p className="mb-4 text-gray-300">
            {user.role === "admin" ? (
              <>
                Você tem <span className="text-orange-500 font-semibold">acesso total</span> ao sistema e pode{" "}
                <span className="text-red-500 font-semibold">gerenciar todos os projetos</span>.
              </>
            ) : user.role === "professor" ? (
              <>
                Você tem <span className="text-orange-500 font-semibold">{userProjects.length} projeto{userProjects.length !== 1 ? 's' : ''} ativo{userProjects.length !== 1 ? 's' : ''}</span> e{" "}
                <span className="text-red-500 font-semibold">{Math.floor(Math.random() * 7) + 3} estudantes</span> sob sua orientação.
              </>
            ) : (
              <>
                Você tem <span className="text-orange-500 font-semibold">{userProjects.length} projeto{userProjects.length !== 1 ? 's' : ''} ativo{userProjects.length !== 1 ? 's' : ''}</span> e{" "}
                <span className="text-red-500 font-semibold">{tasksDueToday.length} tarefa{tasksDueToday.length !== 1 ? 's' : ''}</span> pendente{tasksDueToday.length !== 1 ? 's' : ''} para hoje.
              </>
            )}
          </p>
          <div className="flex gap-3">
            <Button variant="default" size="sm" onClick={() => setAgendaModalOpen(true)}>
              <Calendar className="mr-2 h-4 w-4" />
              Ver agenda
            </Button>
            <Button variant="outline" size="sm" onClick={() => setGoalsModalOpen(true)}>
              <Target className="mr-2 h-4 w-4" />
              Metas
            </Button>
          </div>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-2 gap-4 mb-6">
        <div className="rounded-lg border border-white/10 bg-white/5 p-4">
          <div className="flex items-center justify-between mb-2">
            <div className="h-8 w-8 rounded-lg bg-blue-500/20 flex items-center justify-center">
              <BookOpen className="h-4 w-4 text-blue-400" />
            </div>
            <TrendingUp className="h-4 w-4 text-green-400" />
          </div>
          <p className="text-2xl font-bold">
            {isLoading ? "..." : user.role === "admin" ? totalProjects : userProjects.length}
          </p>
          <p className="text-xs text-gray-400">
            {user.role === "admin" ? "Total de Projetos" : "Projetos Ativos"}
          </p>
        </div>

        <div className="rounded-lg border border-white/10 bg-white/5 p-4">
          <div className="flex items-center justify-between mb-2">
            <div className="h-8 w-8 rounded-lg bg-yellow-500/20 flex items-center justify-center">
              <Award className="h-4 w-4 text-yellow-400" />
            </div>
            <TrendingUp className="h-4 w-4 text-green-400" />
          </div>
          <p className="text-2xl font-bold">
            {isLoading ? "..." : totalHours}h
          </p>
          <p className="text-xs text-gray-400">
            {user.role === "admin" ? "Horas Gerenciadas" : "Horas Complementares"}
          </p>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="space-y-4 mb-6">
        <h2 className="text-lg font-semibold">Ações Rápidas</h2>
        <div className="grid grid-cols-2 gap-4">
          {canCreateProject && (
            <Button variant="outline" className="h-16 flex-col gap-2">
              <Link href="/projetos/novo">
                <Plus className="h-5 w-5" />
                <span className="text-sm">Novo Projeto</span>
              </Link>
            </Button>
          )}
          <Button variant="outline" className="h-16 flex-col gap-2 relative overflow-hidden group">
            <Link href="#" className="flex flex-col items-center justify-center h-full w-full z-10">
              <Users className="h-5 w-5 text-[#444]" />
              <span className="text-sm text-[#444]">{user.role === "admin" ? "Gerenciar Equipes" : "Encontrar Equipe"}</span>
            </Link>

            {/* Overlay "Em breve" */}
            <div className="absolute inset-0 bg-orange-500 bg-opacity-20 flex items-center justify-center z-20 pointer-events-none group-hover:opacity-100 transition-opacity duration-300">
              <span className="text-white font-semibold text-lg">Em breve</span>
            </div>
          </Button>

          {!canCreateProject && (
            <Button variant="outline" className="h-16 flex-col gap-2">
              <Link href="/projetos">
                <Search className="h-5 w-5" />
                <span className="text-sm">Buscar Projetos</span>
              </Link>
            </Button>
          )}
        </div>
      </div>

      {/* Active Projects */}
      <ProjectList 
        projects={userProjects} 
        isLoading={isLoading} 
        isAdmin={user?.role === "admin"} 
        limit={2} 
      />

      {/* Upcoming Deadlines */}
      <div className="space-y-4 my-6">
        <h2 className="text-lg font-semibold">Próximos Prazos</h2>
        <div className="space-y-3">
          {isLoading ? (
            <div className="rounded-lg border border-white/10 bg-white/5 p-6 text-center">
              <p className="text-gray-400 text-sm">Carregando prazos...</p>
            </div>
          ) : upcomingDeadlines.length === 0 ? (
            <div className="rounded-lg border border-white/10 bg-white/5 p-6 text-center">
              <p className="text-gray-400 text-sm">Não há prazos próximos.</p>
            </div>
          ) : (
            upcomingDeadlines.map((task, index) => {
              // Calcular se a tarefa é hoje, amanhã ou mais tarde
              const taskDate = new Date(task.endDate);
              const today = new Date();
              const tomorrow = new Date();
              tomorrow.setDate(today.getDate() + 1);
              
              const isToday = taskDate.toDateString() === today.toDateString();
              const isTomorrow = taskDate.toDateString() === tomorrow.toDateString();
              const dateText = isToday ? "Hoje" : isTomorrow ? "Amanhã" : new Date(task.endDate).toLocaleDateString('pt-BR');
              
              // Determinar a prioridade
              const priorityColor = 
                task.priority === "high" ? "bg-red-500" : 
                task.priority === "medium" ? "bg-yellow-500" : "bg-blue-500";
              
              const priorityText = 
                task.priority === "high" ? "Urgente" : 
                task.priority === "medium" ? "Médio" : "Baixa";
              
              const priorityTextColor = 
                task.priority === "high" ? "text-red-400" : 
                task.priority === "medium" ? "text-yellow-400" : "text-blue-400";
              
              return (
                <div key={index} className="flex items-center gap-3 rounded-lg border border-white/10 bg-white/5 p-3">
                  <div className={`h-2 w-2 rounded-full ${priorityColor}`}></div>
                  <div className="flex-1">
                    <p className="text-sm font-medium">{task.title}</p>
                    <p className="text-xs text-gray-400">{task.projectTitle} • {dateText}</p>
                  </div>
                  <span className={`text-xs ${priorityTextColor} font-medium`}>{priorityText}</span>
                </div>
              );
            })
          )}
        </div>
      </div>

      {/* New Opportunities - Only for students */}
      {user.role === "student" && (
        <ProjectOpportunities 
          opportunities={opportunities} 
          isLoading={isLoading} 
          onApply={(projectId) => handleApplyToProject(projectId)}
          limit={2}
        />
      )}

      {/* Recent Activity */}
      <div className="space-y-4 my-6">
        <h2 className="text-lg font-semibold">Atividade Recente</h2>
        <div className="space-y-3">
          {isLoading ? (
            <div className="rounded-lg border border-white/10 bg-white/5 p-6 text-center">
              <p className="text-gray-400 text-sm">Carregando atividades...</p>
            </div>
          ) : recentActivity.length === 0 ? (
            <div className="rounded-lg border border-white/10 bg-white/5 p-6 text-center">
              <p className="text-gray-400 text-sm">Nenhuma atividade recente.</p>
            </div>
          ) : (
            recentActivity.map((activity, index) => {
              // Formatar o timestamp para exibição
              const activityDate = new Date(activity.timestamp);
              const now = new Date();
              const diffMs = now.getTime() - activityDate.getTime();
              const diffMins = Math.floor(diffMs / 60000);
              const diffHours = Math.floor(diffMins / 60);
              
              let timeAgo;
              if (diffMins < 60) {
                timeAgo = `${diffMins}m atrás`;
              } else if (diffHours < 24) {
                timeAgo = `${diffHours}h atrás`;
              } else {
                timeAgo = activityDate.toLocaleDateString('pt-BR');
              }
              
              // Ícone com base no tipo de atividade
              const getActivityIcon = () => {
                switch (activity.type) {
                  case 'comment':
                    return <div className="h-8 w-8 rounded-full bg-blue-500/20 flex items-center justify-center">
                      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-4 w-4 text-blue-400">
                        <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
                      </svg>
                    </div>;
                  case 'task':
                    return <div className="h-8 w-8 rounded-full bg-green-500/20 flex items-center justify-center">
                      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-4 w-4 text-green-400">
                        <path d="M9 11l3 3L22 4" />
                        <path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11" />
                      </svg>
                    </div>;
                  case 'project':
                    return <div className="h-8 w-8 rounded-full bg-purple-500/20 flex items-center justify-center">
                      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-4 w-4 text-purple-400">
                        <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
                        <polyline points="22 4 12 14.01 9 11.01" />
                      </svg>
                    </div>;
                  default:
                    return <div className="h-8 w-8 rounded-full bg-gray-500/20 flex items-center justify-center">
                      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-4 w-4 text-gray-400">
                        <circle cx="12" cy="12" r="10" />
                        <line x1="12" y1="16" x2="12" y2="12" />
                        <line x1="12" y1="8" x2="12.01" y2="8" />
                      </svg>
                    </div>;
                }
              };
              
              return (
                <Link key={index} href={`/projetos/${activity.projectId}`}>
                  <div className="flex gap-3 rounded-lg border border-white/10 bg-white/5 p-4 transition-colors hover:bg-white/10">
                    {getActivityIcon()}
                    <div className="flex-1">
                      <div className="flex items-start justify-between">
                        <div>
                          <p className="text-sm">
                            <span className="font-semibold">{activity.user}</span> {activity.content}
                          </p>
                          <p className="text-xs text-gray-400">{activity.projectTitle}</p>
                        </div>
                        <span className="text-xs text-gray-400">{timeAgo}</span>
                      </div>
                    </div>
                  </div>
                </Link>
              );
            })
          )}
        </div>
      </div>

      {/* Modals */}
      <AgendaModal open={agendaModalOpen} onOpenChange={setAgendaModalOpen} />
      <GoalsModal open={goalsModalOpen} onOpenChange={setGoalsModalOpen} />
    </AppLayout>
  )
}
