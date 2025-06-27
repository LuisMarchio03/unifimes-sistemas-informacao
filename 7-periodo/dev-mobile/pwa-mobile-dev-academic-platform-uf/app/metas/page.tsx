"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { Target, Trophy, Clock, TrendingUp, Plus, CheckCircle, Calendar } from "lucide-react"
import { useAuthStore } from "@/lib/stores/auth-store"
import { AddGoalModal } from "@/components/metas/add-goal-modal"
import Link from "next/link"
import { toast } from "sonner"
import { AppLayout } from "@/components/layout/app-layout"

// Definição dos tipos
interface Goal {
  id: number
  title: string
  description: string
  progress: number
  current: number
  target: number
  deadline: string
  priority: string
  category: string
  createdAt: string
  completedDate?: string
}

export default function MetasPage() {
  const { user } = useAuthStore()
  const [activeTab, setActiveTab] = useState<"current" | "completed">("current")
  const [addGoalModalOpen, setAddGoalModalOpen] = useState(false)
  const [currentGoals, setCurrentGoals] = useState<Goal[]>([])
  const [completedGoals, setCompletedGoals] = useState<Goal[]>([])
  
  // Carregar metas do localStorage na inicialização
  useEffect(() => {
    const loadGoals = () => {
      try {
        const savedCurrentGoals = localStorage.getItem(`current_goals_${user?.id}`) 
        const savedCompletedGoals = localStorage.getItem(`completed_goals_${user?.id}`)
        
        if (savedCurrentGoals) {
          setCurrentGoals(JSON.parse(savedCurrentGoals))
        } else {
          // Carregar metas iniciais apenas se não houver dados salvos
          setCurrentGoals(getInitialCurrentGoals())
        }
        
        if (savedCompletedGoals) {
          setCompletedGoals(JSON.parse(savedCompletedGoals))
        } else {
          // Carregar metas concluídas iniciais apenas se não houver dados salvos
          setCompletedGoals(getInitialCompletedGoals())
        }
      } catch (error) {
        console.error("Erro ao carregar metas:", error)
        toast.error("Erro ao carregar metas")
      }
    }
    
    loadGoals()
  }, [user?.id])
  
  // Salvar metas no localStorage quando mudarem
  useEffect(() => {
    if (user?.id && currentGoals.length > 0) {
      localStorage.setItem(`current_goals_${user.id}`, JSON.stringify(currentGoals))
    }
  }, [currentGoals, user?.id])
  
  useEffect(() => {
    if (user?.id && completedGoals.length > 0) {
      localStorage.setItem(`completed_goals_${user.id}`, JSON.stringify(completedGoals))
    }
  }, [completedGoals, user?.id])

  // Funções para obter as metas iniciais (usadas apenas se não houver dados no localStorage)
  const getInitialCurrentGoals = () => {
    if (user?.role === "admin") {
      return [
        {
          id: 1,
          title: "Aprovar 20 novos projetos",
          description: "Meta mensal de aprovação de projetos",
          progress: 75,
          current: 15,
          target: 20,
          deadline: "30/11/2023",
          priority: "high",
          category: "Gestão",
          createdAt: "01/11/2023",
        },
        {
          id: 2,
          title: "Reduzir tempo de aprovação",
          description: "Diminuir tempo médio para 3 dias",
          progress: 60,
          current: 4,
          target: 3,
          deadline: "15/12/2023",
          priority: "medium",
          category: "Eficiência",
          createdAt: "05/11/2023",
        },
        {
          id: 3,
          title: "Capacitar 50 usuários",
          description: "Treinamento no sistema",
          progress: 40,
          current: 20,
          target: 50,
          deadline: "31/12/2023",
          priority: "low",
          category: "Treinamento",
          createdAt: "10/11/2023",
        },
      ]
    } else if (user?.role === "professor") {
      return [
        {
          id: 1,
          title: "Orientar 8 TCCs",
          description: "Meta semestral de orientação",
          progress: 87,
          current: 7,
          target: 8,
          deadline: "20/12/2023",
          priority: "high",
          category: "Orientação",
          createdAt: "01/08/2023",
        },
        {
          id: 2,
          title: "Publicar 3 artigos",
          description: "Publicações em revistas científicas",
          progress: 33,
          current: 1,
          target: 3,
          deadline: "31/12/2023",
          priority: "medium",
          category: "Pesquisa",
          createdAt: "15/09/2023",
        },
        {
          id: 3,
          title: "Coordenar 5 projetos",
          description: "Projetos de extensão ativos",
          progress: 80,
          current: 4,
          target: 5,
          deadline: "15/11/2023",
          priority: "high",
          category: "Extensão",
          createdAt: "20/08/2023",
        },
      ]
    } else {
      return [
        {
          id: 1,
          title: "Completar 240h complementares",
          description: "Horas de atividades complementares",
          progress: 75,
          current: 180,
          target: 240,
          deadline: "30/11/2023",
          priority: "high",
          category: "Acadêmico",
          createdAt: "01/02/2023",
        },
        {
          id: 2,
          title: "Finalizar 3 projetos",
          description: "Projetos de extensão em andamento",
          progress: 66,
          current: 2,
          target: 3,
          deadline: "15/12/2023",
          priority: "medium",
          category: "Projetos",
          createdAt: "15/08/2023",
        },
        {
          id: 3,
          title: "Aprender React Native",
          description: "Curso de desenvolvimento mobile",
          progress: 45,
          current: 45,
          target: 100,
          deadline: "31/12/2023",
          priority: "low",
          category: "Aprendizado",
          createdAt: "01/10/2023",
        },
      ]
    }
  }

  const getInitialCompletedGoals = () => {
    if (user?.role === "admin") {
      return [
        {
          id: 4,
          title: "Implementar novo sistema",
          description: "Sistema de gestão de projetos",
          completedDate: "15/10/2023",
          category: "Tecnologia",
          target: 1,
          current: 1,
          progress: 100,
          priority: "high",
          createdAt: "01/09/2023",
          deadline: "01/10/2023", // Adicionado deadline
        },
        {
          id: 5,
          title: "Treinar equipe técnica",
          description: "Capacitação em novas tecnologias",
          completedDate: "30/09/2023",
          category: "Treinamento",
          target: 10,
          current: 10,
          progress: 100, // Adicionado progress se estiver faltando
          priority: "medium", // Adicionado priority se estiver faltando
          createdAt: "01/08/2023", // Adicionado createdAt se estiver faltando
          deadline: "25/09/2023", // Adicionado deadline
        },
      ]
    } else if (user?.role === "professor") {
      return [
        {
          id: 4,
          title: "Concluir curso de IA",
          description: "Especialização em Inteligência Artificial",
          completedDate: "20/10/2023",
          category: "Capacitação",
          target: 100,
          current: 100,
          progress: 100,
          priority: "medium",
          createdAt: "01/07/2023",
          deadline: "30/10/2023", // Adicionado deadline
        },
        {
          id: 5,
          title: "Organizar workshop",
          description: "Workshop de metodologias ágeis",
          completedDate: "05/10/2023",
          category: "Evento",
          target: 1,
          current: 1,
          progress: 100, // Adicionado progress se estiver faltando
          priority: "high", // Adicionado priority se estiver faltando
          createdAt: "15/09/2023", // Adicionado createdAt se estiver faltando
          deadline: "10/10/2023", // Adicionado deadline
        },
      ]
    } else {
      return [
        {
          id: 4,
          title: "Concluir curso de Python",
          description: "Curso básico de programação",
          completedDate: "25/10/2023",
          category: "Programação",
          target: 100,
          current: 100,
          progress: 100, // Adicionado progress se estiver faltando
          priority: "medium", // Adicionado priority se estiver faltando
          createdAt: "01/09/2023", // Adicionado createdAt se estiver faltando
          deadline: "30/10/2023", // Adicionado deadline
        },
        {
          id: 5,
          title: "Participar de hackathon",
          description: "Hackathon de inovação tecnológica",
          completedDate: "10/10/2023",
          category: "Competição",
          target: 1,
          current: 1,
          progress: 100, // Adicionado progress se estiver faltando
          priority: "high", // Adicionado priority se estiver faltando
          createdAt: "01/10/2023", // Adicionado createdAt se estiver faltando
          deadline: "15/10/2023", // Adicionado deadline
        },
      ]
    }
  }

  const getPriorityColor = (priority: string) => {
    const colors = {
      high: "bg-red-500/20 text-red-400 border-red-500/30",
      medium: "bg-yellow-500/20 text-yellow-400 border-yellow-500/30",
      low: "bg-green-500/20 text-green-400 border-green-500/30",
    }
    return colors[priority as keyof typeof colors] || "bg-gray-500/20 text-gray-400 border-gray-500/30"
  }

  const getPriorityLabel = (priority: string) => {
    const labels = {
      high: "Alta",
      medium: "Média",
      low: "Baixa",
    }
    return labels[priority as keyof typeof labels] || priority
  }

  const getStatusColor = (progress: number) => {
    if (progress >= 75) return "text-green-400"
    if (progress >= 50) return "text-yellow-400"
    return "text-red-400"
  }

  const getStatusLabel = (progress: number) => {
    if (progress >= 75) return "No prazo"
    if (progress >= 50) return "Atenção"
    return "Atrasado"
  }

  // Função para adicionar uma nova meta
  const handleGoalAdded = (newGoal: Omit<Goal, "id" | "progress">) => {
    const id = currentGoals.length > 0 ? Math.max(...currentGoals.map(g => g.id)) + 1 : 1
    
    const goalWithProgress = {
      ...newGoal,
      id,
      progress: Math.round((Number(newGoal.current) / Number(newGoal.target)) * 100),
      createdAt: new Date().toLocaleDateString("pt-BR")
    }
    
    setCurrentGoals([...currentGoals, goalWithProgress])
    toast.success("Meta adicionada com sucesso!")
  }
  
  // Função para atualizar o progresso de uma meta
  const handleUpdateProgress = (id: number, newCurrent: number) => {
    setCurrentGoals(currentGoals.map(goal => {
      if (goal.id === id) {
        const progress = Math.round((newCurrent / goal.target) * 100)
        return { ...goal, current: newCurrent, progress }
      }
      return goal
    }))
    toast.success("Progresso atualizado com sucesso!")
  }
  
  // Função para marcar uma meta como concluída
  const handleCompleteGoal = (id: number) => {
    const goalToComplete = currentGoals.find(goal => goal.id === id)
    
    if (goalToComplete) {
      // Remover da lista de metas atuais
      setCurrentGoals(currentGoals.filter(goal => goal.id !== id))
      
      // Adicionar à lista de metas concluídas
      const completedGoal = {
        ...goalToComplete,
        progress: 100,
        current: goalToComplete.target,
        completedDate: new Date().toLocaleDateString("pt-BR")
      }
      
      setCompletedGoals([...completedGoals, completedGoal])
      toast.success("Meta concluída com sucesso!")
    }
  }
  
  // Função para excluir uma meta
  const handleDeleteGoal = (id: number, isCompleted: boolean = false) => {
    if (isCompleted) {
      setCompletedGoals(completedGoals.filter(goal => goal.id !== id))
    } else {
      setCurrentGoals(currentGoals.filter(goal => goal.id !== id))
    }
    toast.success("Meta excluída com sucesso!")
  }

  // Calcular estatísticas
  const averageProgress = currentGoals.length > 0 
    ? Math.round(currentGoals.reduce((acc, goal) => acc + goal.progress, 0) / currentGoals.length) 
    : 0
  
  const upcomingDeadlines = currentGoals.filter((goal) => goal.progress < 75).length

  return (
    <AppLayout title="Metas e Objetivos">
      <div className="flex items-center justify-between mb-6">
        <p className="text-sm text-gray-400">Acompanhe seu progresso e conquistas</p>
        <Button onClick={() => setAddGoalModalOpen(true)}>
          <Plus className="mr-2 h-4 w-4" />
          Nova Meta
        </Button>
      </div>

      <div className="space-y-6">
        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="rounded-lg border border-white/10 bg-white/5 p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-400">Metas Ativas</p>
                <p className="text-2xl font-bold">{currentGoals.length}</p>
              </div>
              <Target className="h-8 w-8 text-blue-400" />
            </div>
          </div>
          <div className="rounded-lg border border-white/10 bg-white/5 p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-400">Concluídas</p>
                <p className="text-2xl font-bold">{completedGoals.length}</p>
              </div>
              <Trophy className="h-8 w-8 text-green-400" />
            </div>
          </div>
          <div className="rounded-lg border border-white/10 bg-white/5 p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-400">Progresso Médio</p>
                <p className="text-2xl font-bold">{averageProgress}%</p>
              </div>
              <TrendingUp className="h-8 w-8 text-purple-400" />
            </div>
          </div>
          <div className="rounded-lg border border-white/10 bg-white/5 p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-400">Próximos Prazos</p>
                <p className="text-2xl font-bold">{upcomingDeadlines}</p>
              </div>
              <Clock className="h-8 w-8 text-orange-400" />
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex space-x-1 rounded-lg bg-white/5 p-1">
          <button
            onClick={() => setActiveTab("current")}
            className={`flex-1 rounded-md px-3 py-2 text-sm font-medium transition-colors ${
              activeTab === "current" ? "bg-white/10 text-white" : "text-gray-400 hover:text-white"
            }`}
          >
            Metas Atuais ({currentGoals.length})
          </button>
          <button
            onClick={() => setActiveTab("completed")}
            className={`flex-1 rounded-md px-3 py-2 text-sm font-medium transition-colors ${
              activeTab === "completed" ? "bg-white/10 text-white" : "text-gray-400 hover:text-white"
            }`}
          >
            Concluídas ({completedGoals.length})
          </button>
        </div>

        {/* Current Goals */}
        {activeTab === "current" && (
          <div className="space-y-4">
            {currentGoals.length === 0 ? (
              <div className="text-center py-12">
                <Target className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-400 mb-4">Nenhuma meta definida ainda</p>
                <Button onClick={() => setAddGoalModalOpen(true)}>
                  <Plus className="mr-2 h-4 w-4" />
                  Criar Primeira Meta
                </Button>
              </div>
            ) : (
              currentGoals.map((goal) => (
                <div key={goal.id} className="rounded-lg border border-white/10 bg-white/5 p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex-1">
                      <h4 className="font-semibold text-lg mb-2">{goal.title}</h4>
                      <p className="text-sm text-gray-300 mb-3">{goal.description}</p>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className={`rounded-full px-3 py-1 text-xs border ${getPriorityColor(goal.priority)}`}>
                        {getPriorityLabel(goal.priority)}
                      </span>
                      <span className="text-xs text-gray-400 bg-white/5 px-2 py-1 rounded">{goal.category}</span>
                    </div>
                  </div>

                  <div className="space-y-3">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-gray-400">Progresso</span>
                      <span className="font-medium">
                        {goal.current} / {goal.target} ({goal.progress}%)
                      </span>
                    </div>
                    <Progress value={goal.progress} className="h-3" />
                  </div>

                  <div className="flex items-center justify-between mt-4 text-sm">
                    <div className="flex items-center gap-4 text-gray-400">
                      <span className="flex items-center gap-1">
                        <Calendar className="h-3 w-3" />
                        Criada em {goal.createdAt}
                      </span>
                      <span className="flex items-center gap-1">
                        <Clock className="h-3 w-3" />
                        Prazo: {goal.deadline}
                      </span>
                    </div>
                    <span className={`flex items-center gap-1 ${getStatusColor(goal.progress)}`}>
                      <TrendingUp className="h-3 w-3" />
                      {getStatusLabel(goal.progress)}
                    </span>
                  </div>

                  <div className="flex gap-2 mt-4">
                    {/* <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => {
                        // Aqui você pode implementar a lógica para abrir um modal de edição
                        toast.info("Funcionalidade de edição será implementada em breve")
                      }}
                    >
                      Editar
                    </Button> */}
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => {
                        const newCurrent = prompt(`Atualizar progresso (atual: ${goal.current}/${goal.target})`, goal.current.toString())
                        if (newCurrent !== null) {
                          const value = Number(newCurrent)
                          if (!isNaN(value) && value >= 0 && value <= goal.target) {
                            handleUpdateProgress(goal.id, value)
                          } else {
                            toast.error("Valor inválido")
                          }
                        }
                      }}
                    >
                      Atualizar Progresso
                    </Button>
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => handleCompleteGoal(goal.id)}
                    >
                      Concluir
                    </Button>
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      className="text-red-400 hover:text-red-300"
                      onClick={() => {
                        if (confirm("Tem certeza que deseja excluir esta meta?")) {
                          handleDeleteGoal(goal.id)
                        }
                      }}
                    >
                      Excluir
                    </Button>
                  </div>
                </div>
              ))
            )}
          </div>
        )}

        {/* Completed Goals */}
        {activeTab === "completed" && (
          <div className="space-y-4">
            {completedGoals.length === 0 ? (
              <div className="text-center py-12">
                <Trophy className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-400">Nenhuma meta concluída ainda</p>
              </div>
            ) : (
              completedGoals.map((goal) => (
                <div key={goal.id} className="rounded-lg border border-white/10 bg-white/5 p-6">
                  <div className="flex items-start gap-4">
                    <CheckCircle className="h-6 w-6 text-green-400 mt-1 flex-shrink-0" />
                    <div className="flex-1">
                      <div className="flex items-start justify-between mb-2">
                        <h4 className="font-semibold text-lg">{goal.title}</h4>
                        <span className="text-xs text-gray-400 bg-white/5 px-2 py-1 rounded">{goal.category}</span>
                      </div>
                      <p className="text-sm text-gray-300 mb-3">{goal.description}</p>
                      <div className="flex items-center justify-between text-sm text-gray-400">
                        <span className="flex items-center gap-1">
                          <Trophy className="h-3 w-3" />
                          Concluída em {goal.completedDate}
                        </span>
                        <span>
                          {goal.current}/{goal.target} (100%)
                        </span>
                      </div>
                      
                      <div className="mt-4">
                        <Button 
                          variant="ghost" 
                          size="sm" 
                          className="text-red-400 hover:text-red-300"
                          onClick={() => {
                            if (confirm("Tem certeza que deseja excluir esta meta concluída?")) {
                              handleDeleteGoal(goal.id, true)
                            }
                          }}
                        >
                          Excluir
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        )}

        {/* Quick Actions */}
        <div className="rounded-lg border border-white/10 bg-white/5 p-6">
          <h3 className="text-lg font-semibold mb-4">Ações Rápidas</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Button variant="outline" className="h-16 flex-col gap-2" onClick={() => setAddGoalModalOpen(true)}>
              <Plus className="h-5 w-5" />
              <span className="text-sm">Nova Meta</span>
            </Button>
            {/* <Button 
              variant="outline" 
              className="h-16 flex-col gap-2"
              onClick={() => toast.info("Relatório de progresso será implementado em breve")}
            >
              <TrendingUp className="h-5 w-5" />
              <span className="text-sm">Relatório de Progresso</span>
            </Button> */}
            {/* <Button 
              variant="outline" 
              className="h-16 flex-col gap-2"
              onClick={() => toast.info("Metas sugeridas serão implementadas em breve")}
            >
              <Target className="h-5 w-5" />
              <span className="text-sm">Metas Sugeridas</span>
            </Button> */}
          </div>
        </div>
      </div>

      <AddGoalModal open={addGoalModalOpen} onOpenChange={setAddGoalModalOpen} onGoalAdded={handleGoalAdded} />
    </AppLayout>
  )
}
