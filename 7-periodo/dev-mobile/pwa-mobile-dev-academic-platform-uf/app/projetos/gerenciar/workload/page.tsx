"use client"

import { useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { WorkloadOverview, WorkloadBalancer } from "@/components/workload-management"
import { ArrowLeft, BarChart3, Calendar, Clock, Download, Filter, RefreshCw, Users } from "lucide-react"

export default function WorkloadManagementPage() {
  const [showBalancer, setShowBalancer] = useState(false)
  const [activeTab, setActiveTab] = useState<"overview" | "team" | "projects">("overview")

  return (
    <div className="flex min-h-screen flex-col px-4 py-6">
      <header className="mb-6 flex items-center justify-between">
        <div className="flex items-center">
          <Link href="/projetos/gerenciar" className="mr-4">
            <ArrowLeft className="h-6 w-6" />
          </Link>
          <h1 className="text-xl font-bold">Gerenciamento de Carga de Trabalho</h1>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm">
            <Filter className="mr-2 h-4 w-4" />
            Filtrar
          </Button>
          <Button variant="outline" size="sm">
            <Download className="mr-2 h-4 w-4" />
            Exportar
          </Button>
        </div>
      </header>

      {/* Tabs */}
      <div className="mb-6 border-b border-white/10">
        <div className="flex space-x-4">
          <button
            className={`border-b-2 px-4 py-2 text-sm font-medium ${
              activeTab === "overview" ? "border-primary text-primary" : "border-transparent text-gray-400"
            }`}
            onClick={() => setActiveTab("overview")}
          >
            <BarChart3 className="mr-2 inline-block h-4 w-4" />
            Visão Geral
          </button>
          <button
            className={`border-b-2 px-4 py-2 text-sm font-medium ${
              activeTab === "team" ? "border-primary text-primary" : "border-transparent text-gray-400"
            }`}
            onClick={() => setActiveTab("team")}
          >
            <Users className="mr-2 inline-block h-4 w-4" />
            Equipe
          </button>
          <button
            className={`border-b-2 px-4 py-2 text-sm font-medium ${
              activeTab === "projects" ? "border-primary text-primary" : "border-transparent text-gray-400"
            }`}
            onClick={() => setActiveTab("projects")}
          >
            <Calendar className="mr-2 inline-block h-4 w-4" />
            Projetos
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1">
        {activeTab === "overview" && <WorkloadOverview onBalanceWorkload={() => setShowBalancer(true)} />}

        {activeTab === "team" && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-bold">Carga de Trabalho da Equipe</h2>
              <Button variant="outline" size="sm" onClick={() => setShowBalancer(true)}>
                <RefreshCw className="mr-2 h-4 w-4" />
                Equilibrar
              </Button>
            </div>

            <div className="rounded-lg border border-white/10 bg-white/5 p-6">
              <h3 className="mb-4 text-lg font-semibold">Disponibilidade da Equipe</h3>

              <div className="space-y-6">
                <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
                  <div className="rounded-lg bg-white/5 p-4 text-center">
                    <Clock className="mx-auto mb-2 h-8 w-8 text-primary" />
                    <p className="text-sm text-gray-400">Horas Disponíveis</p>
                    <p className="text-2xl font-bold">320h</p>
                    <p className="text-xs text-gray-400">Esta semana</p>
                  </div>

                  <div className="rounded-lg bg-white/5 p-4 text-center">
                    <Users className="mx-auto mb-2 h-8 w-8 text-yellow-500" />
                    <p className="text-sm text-gray-400">Membros Ativos</p>
                    <p className="text-2xl font-bold">8</p>
                    <p className="text-xs text-gray-400">De 10 membros</p>
                  </div>

                  <div className="rounded-lg bg-white/5 p-4 text-center">
                    <BarChart3 className="mx-auto mb-2 h-8 w-8 text-green-500" />
                    <p className="text-sm text-gray-400">Utilização Média</p>
                    <p className="text-2xl font-bold">76%</p>
                    <p className="text-xs text-gray-400">Últimos 30 dias</p>
                  </div>
                </div>

                <div className="rounded-lg border border-white/10 bg-white/5 p-4">
                  <h4 className="mb-3 font-medium">Disponibilidade Semanal</h4>

                  <div className="overflow-x-auto">
                    <table className="w-full min-w-[600px] border-collapse">
                      <thead>
                        <tr className="border-b border-white/10">
                          <th className="py-2 text-left text-sm font-medium text-gray-400">Membro</th>
                          <th className="py-2 text-center text-sm font-medium text-gray-400">Seg</th>
                          <th className="py-2 text-center text-sm font-medium text-gray-400">Ter</th>
                          <th className="py-2 text-center text-sm font-medium text-gray-400">Qua</th>
                          <th className="py-2 text-center text-sm font-medium text-gray-400">Qui</th>
                          <th className="py-2 text-center text-sm font-medium text-gray-400">Sex</th>
                          <th className="py-2 text-center text-sm font-medium text-gray-400">Total</th>
                        </tr>
                      </thead>
                      <tbody>
                        {[
                          { name: "Luís Gabriel", avatar: "LG", color: "bg-red-500", hours: [8, 8, 8, 8, 8] },
                          { name: "Ana Carolina", avatar: "AC", color: "bg-green-500", hours: [8, 8, 4, 8, 8] },
                          { name: "Vitor Joáz", avatar: "VJ", color: "bg-blue-500", hours: [8, 8, 8, 8, 4] },
                          { name: "Marcos Oliveira", avatar: "MO", color: "bg-yellow-500", hours: [4, 8, 8, 8, 8] },
                        ].map((member, index) => (
                          <tr key={index} className="border-b border-white/10">
                            <td className="py-3">
                              <div className="flex items-center gap-2">
                                <div
                                  className={`h-8 w-8 rounded-full ${member.color} flex items-center justify-center text-white`}
                                >
                                  {member.avatar}
                                </div>
                                <span className="font-medium">{member.name}</span>
                              </div>
                            </td>
                            {member.hours.map((hours, i) => (
                              <td key={i} className="py-3 text-center">
                                <div className="flex flex-col items-center">
                                  <div
                                    className={`h-6 w-4 rounded-sm ${hours > 0 ? "bg-primary/20" : "bg-white/5"}`}
                                    style={{ height: `${Math.max(hours * 3, 4)}px` }}
                                  />
                                  <span className="mt-1 text-xs">{hours}h</span>
                                </div>
                              </td>
                            ))}
                            <td className="py-3 text-center font-medium">
                              {member.hours.reduce((sum, h) => sum + h, 0)}h
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === "projects" && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-bold">Carga de Trabalho por Projeto</h2>
              <div className="flex items-center gap-2">
                <select className="rounded-lg border border-white/10 bg-black/80 px-3 py-1.5 text-sm">
                  <option>Todos os Projetos</option>
                  <option>Sistema de Gestão</option>
                  <option>App Educacional</option>
                  <option>Portal Acadêmico</option>
                </select>
                <Button variant="outline" size="sm">
                  <Filter className="mr-2 h-4 w-4" />
                  Filtrar
                </Button>
              </div>
            </div>

            <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
              {[
                {
                  name: "Sistema de Gestão",
                  allocatedHours: 120,
                  totalHours: 200,
                  members: 5,
                  tasks: 12,
                  completedTasks: 5,
                  dueDate: "30/11/2023",
                  status: "Em andamento",
                },
                {
                  name: "App Educacional",
                  allocatedHours: 80,
                  totalHours: 160,
                  members: 4,
                  tasks: 10,
                  completedTasks: 3,
                  dueDate: "15/12/2023",
                  status: "Em andamento",
                },
                {
                  name: "Portal Acadêmico",
                  allocatedHours: 160,
                  totalHours: 160,
                  members: 6,
                  tasks: 20,
                  completedTasks: 20,
                  dueDate: "10/04/2023",
                  status: "Concluído",
                },
              ].map((project, index) => (
                <div key={index} className="rounded-lg border border-white/10 bg-white/5 p-4">
                  <div className="mb-3 flex items-center justify-between">
                    <h3 className="font-semibold">{project.name}</h3>
                    <span
                      className={`rounded-full px-2 py-0.5 text-xs font-medium ${
                        project.status === "Concluído"
                          ? "bg-green-500/10 text-green-500"
                          : "bg-blue-500/10 text-blue-500"
                      }`}
                    >
                      {project.status}
                    </span>
                  </div>

                  <div className="mb-4 grid grid-cols-2 gap-3">
                    <div className="rounded-lg bg-white/5 p-2 text-center">
                      <p className="text-xs text-gray-400">Horas Alocadas</p>
                      <p className="text-lg font-semibold">
                        {project.allocatedHours}/{project.totalHours}h
                      </p>
                    </div>
                    <div className="rounded-lg bg-white/5 p-2 text-center">
                      <p className="text-xs text-gray-400">Progresso</p>
                      <p className="text-lg font-semibold">
                        {Math.round((project.completedTasks / project.tasks) * 100)}%
                      </p>
                    </div>
                  </div>

                  <div className="mb-3">
                    <div className="mb-1 flex items-center justify-between text-xs">
                      <span>Utilização de Recursos</span>
                      <span>{Math.round((project.allocatedHours / project.totalHours) * 100)}%</span>
                    </div>
                    <div className="h-1.5 w-full overflow-hidden rounded-full bg-white/10">
                      <div
                        className={`h-full ${
                          project.allocatedHours > project.totalHours
                            ? "bg-red-500"
                            : project.allocatedHours === project.totalHours
                              ? "bg-green-500"
                              : "bg-primary"
                        }`}
                        style={{ width: `${Math.min((project.allocatedHours / project.totalHours) * 100, 100)}%` }}
                      />
                    </div>
                  </div>

                  <div className="mb-4 flex items-center justify-between text-xs text-gray-400">
                    <span className="flex items-center gap-1">
                      <Users className="h-3 w-3" />
                      {project.members} membros
                    </span>
                    <span className="flex items-center gap-1">
                      <Calendar className="h-3 w-3" />
                      {project.dueDate}
                    </span>
                  </div>

                  <Button variant="outline" size="sm" className="w-full">
                    <BarChart3 className="mr-2 h-4 w-4" />
                    Ver Detalhes
                  </Button>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Workload Balancer Modal */}
      {showBalancer && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="max-h-[90vh] w-full max-w-4xl overflow-y-auto">
            <WorkloadBalancer onClose={() => setShowBalancer(false)} />
          </div>
        </div>
      )}
    </div>
  )
}
