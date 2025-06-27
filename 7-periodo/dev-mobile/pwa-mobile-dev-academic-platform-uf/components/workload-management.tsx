"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Slider } from "@/components/ui/slider"
import { mockUsers } from "@/components/user-assignment"
import {
  AlertCircle,
  BarChart3,
  Calendar,
  Clock,
  HelpCircle,
  Info,
  MoreHorizontal,
  RefreshCw,
  UserCheck,
  Users,
  X,
  CheckCircle,
} from "lucide-react"

// Mock data for workload
export const mockWorkloadData = mockUsers.map((user) => {
  // Generate random workload data for demonstration
  const allocatedHours = Math.floor(Math.random() * 30) + 10 // 10-40 hours
  const capacity = 40 // Standard 40-hour work week
  const tasksAssigned = Math.floor(Math.random() * 6) + 1 // 1-6 tasks

  // Generate random task allocations
  const taskAllocations = Array.from({ length: tasksAssigned }, (_, i) => ({
    id: `task_${user.id}_${i}`,
    name: [
      "Desenvolvimento Frontend",
      "Testes de Integração",
      "Design de UI",
      "Documentação",
      "Implementação de API",
      "Correção de Bugs",
      "Revisão de Código",
      "Pesquisa",
    ][Math.floor(Math.random() * 8)],
    hours: Math.floor(Math.random() * 15) + 2, // 2-16 hours
    project: ["Sistema de Gestão", "App Educacional", "Portal Acadêmico", "E-commerce"][Math.floor(Math.random() * 4)],
    priority: ["high", "medium", "low"][Math.floor(Math.random() * 3)],
    dueDate: new Date(Date.now() + (Math.floor(Math.random() * 14) + 1) * 24 * 60 * 60 * 1000)
      .toISOString()
      .split("T")[0],
  }))

  return {
    ...user,
    workload: {
      allocatedHours,
      capacity,
      utilizationRate: (allocatedHours / capacity) * 100,
      tasksAssigned,
      taskAllocations,
      weeklyAvailability: [8, 8, 8, 8, 8, 0, 0], // Hours available per day (Mon-Sun)
      skills: ["React", "TypeScript", "UI/UX", "Node.js", "Testing"].slice(0, Math.floor(Math.random() * 4) + 1),
    },
  }
})

// Priority colors
const priorityColors = {
  high: "text-red-500",
  medium: "text-yellow-500",
  low: "text-blue-500",
}

// Workload status
const getWorkloadStatus = (utilizationRate: number) => {
  if (utilizationRate > 100) return { status: "overallocated", color: "text-red-500", bgColor: "bg-red-500/10" }
  if (utilizationRate > 85) return { status: "high", color: "text-yellow-500", bgColor: "bg-yellow-500/10" }
  if (utilizationRate < 50) return { status: "low", color: "text-blue-500", bgColor: "bg-blue-500/10" }
  return { status: "balanced", color: "text-green-500", bgColor: "bg-green-500/10" }
}

interface WorkloadOverviewProps {
  projectId?: string // Optional - filter by project
  teamId?: string // Optional - filter by team
  onBalanceWorkload?: () => void
}

export function WorkloadOverview({ projectId, teamId, onBalanceWorkload }: WorkloadOverviewProps) {
  const [timeframe, setTimeframe] = useState<"week" | "month">("week")
  const [sortBy, setSortBy] = useState<"name" | "utilization" | "tasks">("utilization")
  const [filterStatus, setFilterStatus] = useState<string | null>(null)

  // Filter users based on project/team if provided
  // In a real app, you would filter based on project/team membership
  const users = mockWorkloadData

  // Sort users based on selected criteria
  const sortedUsers = [...users].sort((a, b) => {
    if (sortBy === "name") return a.name.localeCompare(b.name)
    if (sortBy === "utilization") return b.workload.utilizationRate - a.workload.utilizationRate
    if (sortBy === "tasks") return b.workload.tasksAssigned - a.workload.tasksAssigned
    return 0
  })

  // Filter users based on workload status if filter is applied
  const filteredUsers = filterStatus
    ? sortedUsers.filter((user) => getWorkloadStatus(user.workload.utilizationRate).status === filterStatus)
    : sortedUsers

  // Calculate team statistics
  const teamStats = users.reduce(
    (stats, user) => {
      stats.totalAllocatedHours += user.workload.allocatedHours
      stats.totalCapacity += user.workload.capacity
      stats.totalTasks += user.workload.tasksAssigned
      if (user.workload.utilizationRate > 100) stats.overallocatedMembers++
      return stats
    },
    {
      totalAllocatedHours: 0,
      totalCapacity: 0,
      totalTasks: 0,
      overallocatedMembers: 0,
    },
  )

  const teamUtilizationRate = (teamStats.totalAllocatedHours / teamStats.totalCapacity) * 100

  return (
    <div className="space-y-6">
      {/* Overview Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-xl font-bold">Gerenciamento de Carga de Trabalho</h2>
          <p className="text-sm text-gray-400">
            Visualize e equilibre a carga de trabalho da equipe para otimizar a produtividade
          </p>
        </div>
        <div className="flex items-center gap-2">
          <div className="flex rounded-lg border border-white/10 overflow-hidden">
            <button
              className={`px-3 py-1.5 text-sm ${timeframe === "week" ? "bg-white/10" : ""}`}
              onClick={() => setTimeframe("week")}
            >
              Semanal
            </button>
            <button
              className={`px-3 py-1.5 text-sm ${timeframe === "month" ? "bg-white/10" : ""}`}
              onClick={() => setTimeframe("month")}
            >
              Mensal
            </button>
          </div>
          <Button variant="outline" size="sm" onClick={onBalanceWorkload}>
            <RefreshCw className="mr-2 h-4 w-4" />
            Equilibrar
          </Button>
        </div>
      </div>

      {/* Team Summary */}
      <div className="rounded-lg border border-white/10 bg-white/5 p-4">
        <div className="mb-4 flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/20">
              <Users className="h-6 w-6 text-primary" />
            </div>
            <div>
              <h3 className="font-semibold">Visão Geral da Equipe</h3>
              <p className="text-sm text-gray-400">
                {users.length} membros • {teamStats.totalTasks} tarefas
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <div className="rounded-lg border border-white/10 bg-white/5 px-3 py-1.5">
              <p className="text-xs text-gray-400">Utilização da Equipe</p>
              <p className="font-semibold">{teamUtilizationRate.toFixed(0)}%</p>
            </div>
            <div className="rounded-lg border border-white/10 bg-white/5 px-3 py-1.5">
              <p className="text-xs text-gray-400">Horas Alocadas</p>
              <p className="font-semibold">{teamStats.totalAllocatedHours}h</p>
            </div>
            <div className="rounded-lg border border-white/10 bg-white/5 px-3 py-1.5">
              <p className="text-xs text-gray-400">Capacidade</p>
              <p className="font-semibold">{teamStats.totalCapacity}h</p>
            </div>
          </div>
        </div>

        {/* Team Utilization Bar */}
        <div className="mb-2 flex items-center justify-between">
          <p className="text-sm">Utilização da Equipe</p>
          <p className="text-sm font-medium">{teamUtilizationRate.toFixed(0)}%</p>
        </div>
        <div className="mb-4 h-2 w-full overflow-hidden rounded-full bg-white/10">
          <div
            className={`h-full ${
              teamUtilizationRate > 100 ? "bg-red-500" : teamUtilizationRate > 85 ? "bg-yellow-500" : "bg-green-500"
            }`}
            style={{ width: `${Math.min(teamUtilizationRate, 100)}%` }}
          />
        </div>

        {/* Warning for overallocated members */}
        {teamStats.overallocatedMembers > 0 && (
          <div className="mb-4 flex items-center gap-2 rounded-lg bg-red-500/10 p-3 text-sm">
            <AlertCircle className="h-5 w-5 text-red-500" />
            <p>
              <span className="font-medium text-red-500">{teamStats.overallocatedMembers} membros</span> estão com
              sobrecarga de trabalho e precisam de ajustes.
            </p>
          </div>
        )}

        {/* Filters */}
        <div className="flex flex-wrap items-center gap-2">
          <p className="text-sm text-gray-400">Filtrar por:</p>
          <Button
            variant="outline"
            size="sm"
            className={filterStatus === "overallocated" ? "bg-red-500/10 text-red-500" : ""}
            onClick={() => setFilterStatus(filterStatus === "overallocated" ? null : "overallocated")}
          >
            Sobrecarga
          </Button>
          <Button
            variant="outline"
            size="sm"
            className={filterStatus === "high" ? "bg-yellow-500/10 text-yellow-500" : ""}
            onClick={() => setFilterStatus(filterStatus === "high" ? null : "high")}
          >
            Alta Utilização
          </Button>
          <Button
            variant="outline"
            size="sm"
            className={filterStatus === "balanced" ? "bg-green-500/10 text-green-500" : ""}
            onClick={() => setFilterStatus(filterStatus === "balanced" ? null : "balanced")}
          >
            Equilibrado
          </Button>
          <Button
            variant="outline"
            size="sm"
            className={filterStatus === "low" ? "bg-blue-500/10 text-blue-500" : ""}
            onClick={() => setFilterStatus(filterStatus === "low" ? null : "low")}
          >
            Baixa Utilização
          </Button>

          <div className="ml-auto flex items-center gap-2">
            <p className="text-sm text-gray-400">Ordenar por:</p>
            <select
              className="rounded-lg border border-white/10 bg-black/80 px-2 py-1 text-sm"
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as any)}
            >
              <option value="utilization">Utilização</option>
              <option value="tasks">Número de Tarefas</option>
              <option value="name">Nome</option>
            </select>
          </div>
        </div>
      </div>

      {/* Team Members Workload */}
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
        {filteredUsers.map((user) => (
          <UserWorkloadCard key={user.id} user={user} timeframe={timeframe} />
        ))}
      </div>
    </div>
  )
}

interface UserWorkloadCardProps {
  user: (typeof mockWorkloadData)[0]
  timeframe: "week" | "month"
}

function UserWorkloadCard({ user, timeframe }: UserWorkloadCardProps) {
  const [expanded, setExpanded] = useState(false)
  const workloadStatus = getWorkloadStatus(user.workload.utilizationRate)

  return (
    <div className={`rounded-lg border border-white/10 ${workloadStatus.bgColor}`}>
      {/* User Header */}
      <div className="flex items-center justify-between border-b border-white/10 p-4">
        <div className="flex items-center gap-3">
          <div className={`h-10 w-10 rounded-full ${user.color} flex items-center justify-center text-white`}>
            {user.avatar}
          </div>
          <div>
            <h3 className="font-medium">{user.name}</h3>
            <p className="text-xs text-gray-400">{user.role}</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <span
            className={`rounded-full px-2 py-0.5 text-xs font-medium ${workloadStatus.color} ${workloadStatus.bgColor}`}
          >
            {workloadStatus.status === "overallocated" && "Sobrecarga"}
            {workloadStatus.status === "high" && "Alta"}
            {workloadStatus.status === "balanced" && "Equilibrado"}
            {workloadStatus.status === "low" && "Baixa"}
          </span>
          <Button variant="ghost" size="sm" className="h-8 w-8 p-0" onClick={() => setExpanded(!expanded)}>
            {expanded ? <X className="h-4 w-4" /> : <MoreHorizontal className="h-4 w-4" />}
          </Button>
        </div>
      </div>

      {/* Workload Summary */}
      <div className="p-4">
        <div className="mb-4 grid grid-cols-3 gap-2">
          <div className="rounded-lg bg-white/5 p-2 text-center">
            <p className="text-xs text-gray-400">Utilização</p>
            <p className={`text-lg font-semibold ${workloadStatus.color}`}>
              {user.workload.utilizationRate.toFixed(0)}%
            </p>
          </div>
          <div className="rounded-lg bg-white/5 p-2 text-center">
            <p className="text-xs text-gray-400">Horas</p>
            <p className="text-lg font-semibold">
              {user.workload.allocatedHours}/{user.workload.capacity}h
            </p>
          </div>
          <div className="rounded-lg bg-white/5 p-2 text-center">
            <p className="text-xs text-gray-400">Tarefas</p>
            <p className="text-lg font-semibold">{user.workload.tasksAssigned}</p>
          </div>
        </div>

        {/* Utilization Bar */}
        <div className="mb-1 flex items-center justify-between">
          <p className="text-xs text-gray-400">Carga de Trabalho</p>
          <p className="text-xs font-medium">{user.workload.utilizationRate.toFixed(0)}%</p>
        </div>
        <div className="mb-4 h-2 w-full overflow-hidden rounded-full bg-white/10">
          <div
            className={`h-full ${
              user.workload.utilizationRate > 100
                ? "bg-red-500"
                : user.workload.utilizationRate > 85
                  ? "bg-yellow-500"
                  : user.workload.utilizationRate < 50
                    ? "bg-blue-500"
                    : "bg-green-500"
            }`}
            style={{ width: `${Math.min(user.workload.utilizationRate, 100)}%` }}
          />
        </div>

        {/* Weekly Availability */}
        <div className="mb-4">
          <p className="mb-2 text-xs text-gray-400">Disponibilidade Semanal</p>
          <div className="flex justify-between">
            {["S", "T", "Q", "Q", "S", "S", "D"].map((day, index) => (
              <div key={index} className="flex flex-col items-center">
                <p className="text-xs">{day}</p>
                <div
                  className={`mt-1 h-6 w-4 rounded-sm ${
                    user.workload.weeklyAvailability[index] > 0 ? "bg-primary/20" : "bg-white/5"
                  }`}
                  style={{
                    height: `${Math.max(user.workload.weeklyAvailability[index] * 3, 4)}px`,
                  }}
                />
                <p className="mt-1 text-xs">{user.workload.weeklyAvailability[index]}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Skills */}
        {user.workload.skills.length > 0 && (
          <div className="mb-4">
            <p className="mb-1 text-xs text-gray-400">Habilidades</p>
            <div className="flex flex-wrap gap-1">
              {user.workload.skills.map((skill, index) => (
                <span key={index} className="rounded-full bg-white/10 px-2 py-0.5 text-xs">
                  {skill}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Task Allocations (expanded view) */}
        {expanded && (
          <div className="mt-4 space-y-3 rounded-lg bg-white/5 p-3">
            <h4 className="text-sm font-medium">Tarefas Atribuídas</h4>
            {user.workload.taskAllocations.length > 0 ? (
              user.workload.taskAllocations.map((task, index) => (
                <div key={index} className="rounded-lg border border-white/10 bg-white/5 p-2">
                  <div className="mb-1 flex items-start justify-between">
                    <h5 className="text-sm font-medium">{task.name}</h5>
                    <span className={`text-xs ${priorityColors[task.priority as keyof typeof priorityColors]}`}>
                      {task.priority === "high" ? "Alta" : task.priority === "medium" ? "Média" : "Baixa"}
                    </span>
                  </div>
                  <p className="mb-1 text-xs text-gray-400">{task.project}</p>
                  <div className="flex items-center justify-between text-xs">
                    <span className="flex items-center gap-1">
                      <Clock className="h-3 w-3" />
                      {task.hours}h
                    </span>
                    <span className="flex items-center gap-1">
                      <Calendar className="h-3 w-3" />
                      {new Date(task.dueDate).toLocaleDateString("pt-BR")}
                    </span>
                  </div>
                </div>
              ))
            ) : (
              <p className="text-center text-sm text-gray-400">Nenhuma tarefa atribuída</p>
            )}
          </div>
        )}

        {/* Actions */}
        <div className="mt-4 flex gap-2">
          <Button variant="outline" size="sm" className="flex-1">
            <UserCheck className="mr-2 h-4 w-4" />
            Ajustar
          </Button>
          <Button variant="outline" size="sm" className="flex-1">
            <BarChart3 className="mr-2 h-4 w-4" />
            Detalhes
          </Button>
        </div>
      </div>
    </div>
  )
}

interface WorkloadBalancerProps {
  projectId?: string
  onClose: () => void
}

export function WorkloadBalancer({ projectId, onClose }: WorkloadBalancerProps) {
  const [users, setUsers] = useState(mockWorkloadData)
  const [suggestions, setSuggestions] = useState<
    {
      from: (typeof mockWorkloadData)[0]
      to: (typeof mockWorkloadData)[0]
      task: (typeof mockWorkloadData)[0]["workload"]["taskAllocations"][0]
    }[]
  >([
    // Mock suggestions
    {
      from: mockWorkloadData.find((u) => u.workload.utilizationRate > 100)!,
      to: mockWorkloadData.find((u) => u.workload.utilizationRate < 70)!,
      task: mockWorkloadData.find((u) => u.workload.utilizationRate > 100)!.workload.taskAllocations[0],
    },
    {
      from: mockWorkloadData.find((u) => u.workload.utilizationRate > 90)!,
      to: mockWorkloadData.find((u) => u.workload.utilizationRate < 60)!,
      task: mockWorkloadData.find((u) => u.workload.utilizationRate > 90)!.workload.taskAllocations[1],
    },
  ])

  // Calculate team statistics
  const teamStats = users.reduce(
    (stats, user) => {
      stats.totalAllocatedHours += user.workload.allocatedHours
      stats.totalCapacity += user.workload.capacity
      stats.overallocatedMembers += user.workload.utilizationRate > 100 ? 1 : 0
      stats.underallocatedMembers += user.workload.utilizationRate < 50 ? 1 : 0
      return stats
    },
    {
      totalAllocatedHours: 0,
      totalCapacity: 0,
      overallocatedMembers: 0,
      underallocatedMembers: 0,
    },
  )

  const teamUtilizationRate = (teamStats.totalAllocatedHours / teamStats.totalCapacity) * 100

  // Sort users by utilization rate (descending)
  const sortedUsers = [...users].sort((a, b) => b.workload.utilizationRate - a.workload.utilizationRate)

  // Apply a suggestion
  const applySuggestion = (suggestion: (typeof suggestions)[0]) => {
    // In a real app, you would update the task assignment in the database
    // For this demo, we'll just update the local state
    setUsers(
      users.map((user) => {
        if (user.id === suggestion.from.id) {
          // Remove task from source user
          const updatedTaskAllocations = user.workload.taskAllocations.filter((task) => task.id !== suggestion.task.id)
          const updatedAllocatedHours = user.workload.allocatedHours - suggestion.task.hours

          return {
            ...user,
            workload: {
              ...user.workload,
              taskAllocations: updatedTaskAllocations,
              allocatedHours: updatedAllocatedHours,
              utilizationRate: (updatedAllocatedHours / user.workload.capacity) * 100,
              tasksAssigned: updatedTaskAllocations.length,
            },
          }
        }

        if (user.id === suggestion.to.id) {
          // Add task to target user
          const updatedTaskAllocations = [...user.workload.taskAllocations, suggestion.task]
          const updatedAllocatedHours = user.workload.allocatedHours + suggestion.task.hours

          return {
            ...user,
            workload: {
              ...user.workload,
              taskAllocations: updatedTaskAllocations,
              allocatedHours: updatedAllocatedHours,
              utilizationRate: (updatedAllocatedHours / user.workload.capacity) * 100,
              tasksAssigned: updatedTaskAllocations.length,
            },
          }
        }

        return user
      }),
    )

    // Remove the applied suggestion
    setSuggestions(suggestions.filter((s) => s.task.id !== suggestion.task.id))
  }

  return (
    <div className="rounded-lg border border-white/10 bg-black/95 p-6">
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold">Equilibrar Carga de Trabalho</h2>
          <p className="text-sm text-gray-400">Redistribua tarefas para otimizar a produtividade da equipe</p>
        </div>
        <Button variant="ghost" size="sm" onClick={onClose}>
          <X className="h-5 w-5" />
        </Button>
      </div>

      {/* Team Summary */}
      <div className="mb-6 rounded-lg border border-white/10 bg-white/5 p-4">
        <h3 className="mb-2 font-semibold">Visão Geral da Equipe</h3>

        <div className="mb-4 grid grid-cols-2 gap-4 sm:grid-cols-4">
          <div className="rounded-lg bg-white/5 p-3 text-center">
            <p className="text-xs text-gray-400">Utilização Média</p>
            <p className="text-xl font-semibold">{teamUtilizationRate.toFixed(0)}%</p>
          </div>
          <div className="rounded-lg bg-white/5 p-3 text-center">
            <p className="text-xs text-gray-400">Membros Sobrecarregados</p>
            <p className="text-xl font-semibold text-red-500">{teamStats.overallocatedMembers}</p>
          </div>
          <div className="rounded-lg bg-white/5 p-3 text-center">
            <p className="text-xs text-gray-400">Membros Subutilizados</p>
            <p className="text-xl font-semibold text-blue-500">{teamStats.underallocatedMembers}</p>
          </div>
          <div className="rounded-lg bg-white/5 p-3 text-center">
            <p className="text-xs text-gray-400">Sugestões de Ajuste</p>
            <p className="text-xl font-semibold">{suggestions.length}</p>
          </div>
        </div>

        <div className="flex items-center gap-2 rounded-lg bg-primary/10 p-3 text-sm">
          <Info className="h-5 w-5 text-primary" />
          <p>
            O sistema identificou desequilíbrios na carga de trabalho da equipe. Revise as sugestões abaixo para
            otimizar a distribuição de tarefas.
          </p>
        </div>
      </div>

      {/* Workload Distribution */}
      <div className="mb-6">
        <h3 className="mb-3 font-semibold">Distribuição de Carga de Trabalho</h3>
        <div className="space-y-3">
          {sortedUsers.map((user) => (
            <div key={user.id} className="flex items-center gap-3">
              <div className="flex w-32 items-center gap-2">
                <div className={`h-8 w-8 rounded-full ${user.color} flex items-center justify-center text-white`}>
                  {user.avatar}
                </div>
                <p className="text-sm font-medium truncate">{user.name}</p>
              </div>
              <div className="flex-1">
                <div className="flex items-center justify-between text-xs">
                  <span>
                    {user.workload.allocatedHours}h / {user.workload.capacity}h
                  </span>
                  <span
                    className={`font-medium ${
                      user.workload.utilizationRate > 100
                        ? "text-red-500"
                        : user.workload.utilizationRate > 85
                          ? "text-yellow-500"
                          : user.workload.utilizationRate < 50
                            ? "text-blue-500"
                            : "text-green-500"
                    }`}
                  >
                    {user.workload.utilizationRate.toFixed(0)}%
                  </span>
                </div>
                <div className="mt-1 h-2 w-full overflow-hidden rounded-full bg-white/10">
                  <div
                    className={`h-full ${
                      user.workload.utilizationRate > 100
                        ? "bg-red-500"
                        : user.workload.utilizationRate > 85
                          ? "bg-yellow-500"
                          : user.workload.utilizationRate < 50
                            ? "bg-blue-500"
                            : "bg-green-500"
                    }`}
                    style={{ width: `${Math.min(user.workload.utilizationRate, 100)}%` }}
                  />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Balancing Suggestions */}
      <div className="mb-6">
        <h3 className="mb-3 font-semibold">Sugestões de Redistribuição</h3>

        {suggestions.length > 0 ? (
          <div className="space-y-4">
            {suggestions.map((suggestion, index) => (
              <div key={index} className="rounded-lg border border-white/10 bg-white/5 p-4">
                <div className="mb-3 flex items-center justify-between">
                  <h4 className="font-medium">Transferir Tarefa</h4>
                  <span className="rounded-full bg-primary/20 px-2 py-0.5 text-xs font-medium text-primary">
                    Sugestão {index + 1}
                  </span>
                </div>

                <div className="mb-4 rounded-lg bg-white/5 p-3">
                  <h5 className="mb-1 text-sm font-medium">{suggestion.task.name}</h5>
                  <p className="mb-2 text-xs text-gray-400">{suggestion.task.project}</p>
                  <div className="flex items-center justify-between text-xs">
                    <span className="flex items-center gap-1">
                      <Clock className="h-3 w-3" />
                      {suggestion.task.hours}h
                    </span>
                    <span className="flex items-center gap-1">
                      <Calendar className="h-3 w-3" />
                      {new Date(suggestion.task.dueDate).toLocaleDateString("pt-BR")}
                    </span>
                  </div>
                </div>

                <div className="mb-4 flex items-center gap-3">
                  <div className="flex flex-1 flex-col items-center">
                    <div className="mb-1 flex items-center gap-2">
                      <div
                        className={`h-8 w-8 rounded-full ${suggestion.from.color} flex items-center justify-center text-white`}
                      >
                        {suggestion.from.avatar}
                      </div>
                      <div>
                        <p className="text-sm font-medium">{suggestion.from.name}</p>
                        <p className="text-xs text-red-500">
                          {suggestion.from.workload.utilizationRate.toFixed(0)}% →
                          {(
                            suggestion.from.workload.utilizationRate -
                            (suggestion.task.hours / suggestion.from.workload.capacity) * 100
                          ).toFixed(0)}
                          %
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="flex flex-col items-center">
                    <div className="h-0.5 w-10 bg-white/20"></div>
                    <p className="my-1 text-xs text-gray-400">para</p>
                    <div className="h-0.5 w-10 bg-white/20"></div>
                  </div>

                  <div className="flex flex-1 flex-col items-center">
                    <div className="mb-1 flex items-center gap-2">
                      <div
                        className={`h-8 w-8 rounded-full ${suggestion.to.color} flex items-center justify-center text-white`}
                      >
                        {suggestion.to.avatar}
                      </div>
                      <div>
                        <p className="text-sm font-medium">{suggestion.to.name}</p>
                        <p className="text-xs text-green-500">
                          {suggestion.to.workload.utilizationRate.toFixed(0)}% →
                          {(
                            suggestion.to.workload.utilizationRate +
                            (suggestion.task.hours / suggestion.to.workload.capacity) * 100
                          ).toFixed(0)}
                          %
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1 text-xs text-gray-400">
                    <HelpCircle className="h-3 w-3" />
                    <span>Compatibilidade de habilidades: Alta</span>
                  </div>
                  <div className="flex gap-2">
                    <Button variant="outline" size="sm">
                      Ignorar
                    </Button>
                    <Button size="sm" onClick={() => applySuggestion(suggestion)}>
                      Aplicar
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center rounded-lg border border-white/10 bg-white/5 p-8">
            <div className="mb-3 rounded-full bg-green-500/20 p-3">
              <CheckCircle className="h-6 w-6 text-green-500" />
            </div>
            <h4 className="mb-1 font-medium">Carga de Trabalho Equilibrada</h4>
            <p className="text-center text-sm text-gray-400">
              Não há sugestões de redistribuição no momento. A carga de trabalho da equipe está bem equilibrada.
            </p>
          </div>
        )}
      </div>

      {/* Manual Adjustment */}
      <div className="mb-6 rounded-lg border border-white/10 bg-white/5 p-4">
        <h3 className="mb-3 font-semibold">Ajuste Manual</h3>
        <p className="mb-4 text-sm text-gray-400">
          Defina a capacidade de cada membro da equipe para ajustar manualmente a carga de trabalho.
        </p>

        <div className="space-y-4">
          {sortedUsers.slice(0, 3).map((user) => (
            <div key={user.id} className="flex items-center gap-3">
              <div className="flex w-32 items-center gap-2">
                <div className={`h-8 w-8 rounded-full ${user.color} flex items-center justify-center text-white`}>
                  {user.avatar}
                </div>
                <p className="text-sm font-medium truncate">{user.name}</p>
              </div>
              <div className="flex-1">
                <div className="flex items-center justify-between">
                  <p className="text-xs text-gray-400">Capacidade (horas)</p>
                  <p className="text-xs font-medium">{user.workload.capacity}h</p>
                </div>
                <Slider defaultValue={[user.workload.capacity]} max={60} min={10} step={1} className="py-2" />
              </div>
            </div>
          ))}

          {sortedUsers.length > 3 && (
            <Button variant="ghost" size="sm" className="w-full">
              Ver todos os membros
            </Button>
          )}
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex justify-end gap-2">
        <Button variant="outline" onClick={onClose}>
          Cancelar
        </Button>
        <Button>Salvar Alterações</Button>
      </div>
    </div>
  )
}

interface TaskEffortEstimationProps {
  defaultHours?: number
  onChange?: (hours: number) => void
}

export function TaskEffortEstimation({ defaultHours = 8, onChange }: TaskEffortEstimationProps) {
  const [hours, setHours] = useState(defaultHours)

  const handleChange = (value: number) => {
    setHours(value)
    if (onChange) onChange(value)
  }

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <label className="text-sm text-gray-400">Estimativa de Esforço</label>
        <div className="flex items-center gap-2">
          <Input
            type="number"
            value={hours}
            onChange={(e) => handleChange(Number(e.target.value))}
            className="w-16 border-white/10 text-center"
            min={1}
            max={100}
          />
          <span className="text-sm">horas</span>
        </div>
      </div>

      <Slider value={[hours]} max={40} min={1} step={1} onValueChange={(value) => handleChange(value[0])} />

      <div className="flex justify-between text-xs text-gray-400">
        <span>1h</span>
        <span>8h</span>
        <span>16h</span>
        <span>24h</span>
        <span>40h</span>
      </div>

      <div className="rounded-lg bg-white/5 p-3">
        <div className="mb-2 flex items-center justify-between">
          <p className="text-sm font-medium">Impacto na Carga de Trabalho</p>
          <div className="flex items-center gap-1">
            <span className="text-xs text-gray-400">Dias:</span>
            <span className="text-xs font-medium">{(hours / 8).toFixed(1)}</span>
          </div>
        </div>

        <div className="space-y-2">
          <div className="flex items-center justify-between text-xs">
            <span>Pequeno (1-4h)</span>
            <span>Médio (5-16h)</span>
            <span>Grande (17-40h)</span>
          </div>
          <div className="h-2 w-full rounded-full bg-white/10">
            <div
              className={`h-full rounded-full ${
                hours <= 4 ? "bg-green-500" : hours <= 16 ? "bg-yellow-500" : "bg-red-500"
              }`}
              style={{ width: `${Math.min((hours / 40) * 100, 100)}%` }}
            />
          </div>
        </div>
      </div>
    </div>
  )
}
