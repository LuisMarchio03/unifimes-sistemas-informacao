"use client"

import { useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { Target, Trophy, Clock, TrendingUp, Plus, CheckCircle } from "lucide-react"
import { useAuthStore } from "@/lib/stores/auth-store"

interface GoalsModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function GoalsModal({ open, onOpenChange }: GoalsModalProps) {
  const { user } = useAuthStore()
  const [activeTab, setActiveTab] = useState<"current" | "completed">("current")

  const getCurrentGoals = () => {
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
        },
      ]
    }
  }

  const getCompletedGoals = () => {
    if (user?.role === "admin") {
      return [
        {
          id: 4,
          title: "Implementar novo sistema",
          description: "Sistema de gestão de projetos",
          completedDate: "15/10/2023",
          category: "Tecnologia",
        },
        {
          id: 5,
          title: "Treinar equipe técnica",
          description: "Capacitação em novas tecnologias",
          completedDate: "30/09/2023",
          category: "Treinamento",
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
        },
        {
          id: 5,
          title: "Organizar workshop",
          description: "Workshop de metodologias ágeis",
          completedDate: "05/10/2023",
          category: "Evento",
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
        },
        {
          id: 5,
          title: "Participar de hackathon",
          description: "Hackathon de inovação tecnológica",
          completedDate: "10/10/2023",
          category: "Competição",
        },
      ]
    }
  }

  const getPriorityColor = (priority: string) => {
    const colors = {
      high: "bg-red-500/20 text-red-400",
      medium: "bg-yellow-500/20 text-yellow-400",
      low: "bg-green-500/20 text-green-400",
    }
    return colors[priority as keyof typeof colors] || "bg-gray-500/20 text-gray-400"
  }

  const getPriorityLabel = (priority: string) => {
    const labels = {
      high: "Alta",
      medium: "Média",
      low: "Baixa",
    }
    return labels[priority as keyof typeof labels] || priority
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Target className="h-5 w-5" />
            Metas e Objetivos
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Tabs */}
          <div className="flex space-x-1 rounded-lg bg-white/5 p-1">
            <button
              onClick={() => setActiveTab("current")}
              className={`flex-1 rounded-md px-3 py-2 text-sm font-medium transition-colors ${
                activeTab === "current" ? "bg-white/10 text-white" : "text-gray-400 hover:text-white"
              }`}
            >
              Metas Atuais
            </button>
            <button
              onClick={() => setActiveTab("completed")}
              className={`flex-1 rounded-md px-3 py-2 text-sm font-medium transition-colors ${
                activeTab === "completed" ? "bg-white/10 text-white" : "text-gray-400 hover:text-white"
              }`}
            >
              Concluídas
            </button>
          </div>

          {/* Current Goals */}
          {activeTab === "current" && (
            <div className="space-y-4">
              {getCurrentGoals().map((goal) => (
                <div key={goal.id} className="rounded-lg border border-white/10 bg-white/5 p-4">
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex-1">
                      <h4 className="font-semibold mb-1">{goal.title}</h4>
                      <p className="text-sm text-gray-300">{goal.description}</p>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className={`rounded-full px-2 py-1 text-xs ${getPriorityColor(goal.priority)}`}>
                        {getPriorityLabel(goal.priority)}
                      </span>
                      <span className="text-xs text-gray-400">{goal.category}</span>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-gray-400">Progresso</span>
                      <span className="font-medium">
                        {goal.current} / {goal.target} ({goal.progress}%)
                      </span>
                    </div>
                    <Progress value={goal.progress} className="h-2" />
                  </div>

                  <div className="flex items-center justify-between mt-3 text-xs text-gray-400">
                    <span className="flex items-center gap-1">
                      <Clock className="h-3 w-3" />
                      Prazo: {goal.deadline}
                    </span>
                    <span className="flex items-center gap-1">
                      <TrendingUp className="h-3 w-3" />
                      {goal.progress >= 75 ? "No prazo" : goal.progress >= 50 ? "Atenção" : "Atrasado"}
                    </span>
                  </div>
                </div>
              ))}

              <Button className="w-full" variant="outline">
                <Plus className="mr-2 h-4 w-4" />
                Nova Meta
              </Button>
            </div>
          )}

          {/* Completed Goals */}
          {activeTab === "completed" && (
            <div className="space-y-4">
              {getCompletedGoals().map((goal) => (
                <div key={goal.id} className="rounded-lg border border-white/10 bg-white/5 p-4">
                  <div className="flex items-start gap-3">
                    <CheckCircle className="h-5 w-5 text-green-400 mt-0.5" />
                    <div className="flex-1">
                      <h4 className="font-semibold mb-1">{goal.title}</h4>
                      <p className="text-sm text-gray-300 mb-2">{goal.description}</p>
                      <div className="flex items-center justify-between text-xs text-gray-400">
                        <span className="flex items-center gap-1">
                          <Trophy className="h-3 w-3" />
                          Concluída em {goal.completedDate}
                        </span>
                        <span>{goal.category}</span>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  )
}
