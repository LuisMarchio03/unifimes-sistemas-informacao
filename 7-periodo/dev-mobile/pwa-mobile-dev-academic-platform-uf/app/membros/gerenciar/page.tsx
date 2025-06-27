"use client"

import React from "react"

import { useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { mockUsers } from "@/components/user-assignment"
import {
  ArrowLeft,
  Search,
  Filter,
  UserPlus,
  MoreHorizontal,
  Mail,
  Calendar,
  Clock,
  Briefcase,
  Users,
  Settings,
  Download,
  Shield,
  Crown,
} from "lucide-react"

// Extended mock user data with additional fields
const mockMembers = mockUsers.map((user, index) => ({
  ...user,
  joinDate: new Date(Date.now() - Math.random() * 365 * 24 * 60 * 60 * 1000).toISOString().split("T")[0],
  lastActive: new Date(Date.now() - Math.random() * 7 * 24 * 60 * 60 * 1000).toISOString().split("T")[0],
  projectsCount: Math.floor(Math.random() * 10) + 1,
  teamsCount: Math.floor(Math.random() * 5) + 1,
  hoursContributed: Math.floor(Math.random() * 200) + 50,
  status: ["active", "inactive", "pending"][Math.floor(Math.random() * 3)] as "active" | "inactive" | "pending",
  permissions: ["admin", "moderator", "member"][Math.floor(Math.random() * 3)] as "admin" | "moderator" | "member",
  skills: ["React", "TypeScript", "Node.js", "Python", "UI/UX", "Testing", "DevOps"].slice(
    0,
    Math.floor(Math.random() * 5) + 2,
  ),
  university: "UNIFIMES",
  course: ["Ciência da Computação", "Sistemas de Informação", "Engenharia de Software"][Math.floor(Math.random() * 3)],
  semester: Math.floor(Math.random() * 8) + 1,
}))

const statusColors = {
  active: { bg: "bg-green-500/10", text: "text-green-500", label: "Ativo" },
  inactive: { bg: "bg-gray-500/10", text: "text-gray-500", label: "Inativo" },
  pending: { bg: "bg-yellow-500/10", text: "text-yellow-500", label: "Pendente" },
}

const permissionColors = {
  admin: { bg: "bg-red-500/10", text: "text-red-500", label: "Admin", icon: Crown },
  moderator: { bg: "bg-blue-500/10", text: "text-blue-500", label: "Moderador", icon: Shield },
  member: { bg: "bg-gray-500/10", text: "text-gray-500", label: "Membro", icon: Users },
}

export default function GerenciarMembrosPage() {
  const [members, setMembers] = useState(mockMembers)
  const [searchQuery, setSearchQuery] = useState("")
  const [statusFilter, setStatusFilter] = useState<string | null>(null)
  const [permissionFilter, setPermissionFilter] = useState<string | null>(null)
  const [sortBy, setSortBy] = useState<"name" | "joinDate" | "activity" | "projects">("name")
  const [selectedMembers, setSelectedMembers] = useState<string[]>([])
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid")

  // Filter and sort members
  const filteredMembers = members
    .filter((member) => {
      const matchesSearch =
        member.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        member.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
        member.role.toLowerCase().includes(searchQuery.toLowerCase()) ||
        member.course.toLowerCase().includes(searchQuery.toLowerCase())

      const matchesStatus = !statusFilter || member.status === statusFilter
      const matchesPermission = !permissionFilter || member.permissions === permissionFilter

      return matchesSearch && matchesStatus && matchesPermission
    })
    .sort((a, b) => {
      if (sortBy === "name") return a.name.localeCompare(b.name)
      if (sortBy === "joinDate") return new Date(b.joinDate).getTime() - new Date(a.joinDate).getTime()
      if (sortBy === "activity") return new Date(b.lastActive).getTime() - new Date(a.lastActive).getTime()
      if (sortBy === "projects") return b.projectsCount - a.projectsCount
      return 0
    })

  // Calculate statistics
  const stats = members.reduce(
    (acc, member) => {
      acc.total++
      acc[member.status as keyof typeof acc]++
      acc.totalProjects += member.projectsCount
      acc.totalHours += member.hoursContributed
      return acc
    },
    { total: 0, active: 0, inactive: 0, pending: 0, totalProjects: 0, totalHours: 0 },
  )

  const handleSelectMember = (memberId: string) => {
    setSelectedMembers((prev) => (prev.includes(memberId) ? prev.filter((id) => id !== memberId) : [...prev, memberId]))
  }

  const handleSelectAll = () => {
    if (selectedMembers.length === filteredMembers.length) {
      setSelectedMembers([])
    } else {
      setSelectedMembers(filteredMembers.map((member) => member.id))
    }
  }

  const handleBulkAction = (action: "activate" | "deactivate" | "promote" | "remove") => {
    // In a real app, you would perform the bulk action
    console.log(`Bulk action: ${action}`, selectedMembers)
    setSelectedMembers([])
  }

  const handleUpdatePermission = (memberId: string, newPermission: "admin" | "moderator" | "member") => {
    setMembers(members.map((member) => (member.id === memberId ? { ...member, permissions: newPermission } : member)))
  }

  const handleUpdateStatus = (memberId: string, newStatus: "active" | "inactive" | "pending") => {
    setMembers(members.map((member) => (member.id === memberId ? { ...member, status: newStatus } : member)))
  }

  return (
    <div className="flex min-h-screen flex-col px-4 py-6">
      <header className="mb-6 flex items-center justify-between">
        <div className="flex items-center">
          <Link href="/equipes" className="mr-4">
            <ArrowLeft className="h-6 w-6" />
          </Link>
          <h1 className="text-xl font-bold">Gerenciar Membros</h1>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm">
            <Download className="mr-2 h-4 w-4" />
            Exportar
          </Button>
          <Button size="sm" asChild>
            <Link href="/convites/gerenciar">
              <UserPlus className="mr-2 h-4 w-4" />
              Convidar
            </Link>
          </Button>
        </div>
      </header>

      {/* Statistics */}
      <div className="mb-6 grid grid-cols-2 gap-4 md:grid-cols-5">
        <div className="rounded-lg border border-white/10 bg-white/5 p-4 text-center">
          <p className="text-2xl font-bold">{stats.total}</p>
          <p className="text-sm text-gray-400">Total</p>
        </div>
        <div className="rounded-lg border border-white/10 bg-green-500/10 p-4 text-center">
          <p className="text-2xl font-bold text-green-500">{stats.active}</p>
          <p className="text-sm text-gray-400">Ativos</p>
        </div>
        <div className="rounded-lg border border-white/10 bg-yellow-500/10 p-4 text-center">
          <p className="text-2xl font-bold text-yellow-500">{stats.pending}</p>
          <p className="text-sm text-gray-400">Pendentes</p>
        </div>
        <div className="rounded-lg border border-white/10 bg-blue-500/10 p-4 text-center">
          <p className="text-2xl font-bold text-blue-500">{stats.totalProjects}</p>
          <p className="text-sm text-gray-400">Projetos</p>
        </div>
        <div className="rounded-lg border border-white/10 bg-purple-500/10 p-4 text-center">
          <p className="text-2xl font-bold text-purple-500">{stats.totalHours}</p>
          <p className="text-sm text-gray-400">Horas</p>
        </div>
      </div>

      {/* Filters and Search */}
      <div className="mb-6 space-y-4">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex flex-1 items-center gap-2">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
              <Input
                placeholder="Buscar por nome, email, curso ou função..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="border-white/10 pl-10"
              />
            </div>
            <Button variant="outline" size="sm">
              <Filter className="h-4 w-4" />
            </Button>
          </div>

          <div className="flex items-center gap-2">
            <div className="flex rounded-lg border border-white/10 overflow-hidden">
              <button
                className={`px-3 py-1.5 text-sm ${viewMode === "grid" ? "bg-white/10" : ""}`}
                onClick={() => setViewMode("grid")}
              >
                Grade
              </button>
              <button
                className={`px-3 py-1.5 text-sm ${viewMode === "list" ? "bg-white/10" : ""}`}
                onClick={() => setViewMode("list")}
              >
                Lista
              </button>
            </div>
            <select
              className="rounded-lg border border-white/10 bg-black/80 px-3 py-1.5 text-sm"
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as any)}
            >
              <option value="name">Nome</option>
              <option value="joinDate">Data de Ingresso</option>
              <option value="activity">Última Atividade</option>
              <option value="projects">Projetos</option>
            </select>
          </div>
        </div>

        {/* Filter Buttons */}
        <div className="flex flex-wrap items-center gap-2">
          <p className="text-sm text-gray-400">Filtrar por:</p>

          {/* Status Filters */}
          <Button
            variant="outline"
            size="sm"
            className={statusFilter === "active" ? "bg-green-500/10 text-green-500" : ""}
            onClick={() => setStatusFilter(statusFilter === "active" ? null : "active")}
          >
            Ativos
          </Button>
          <Button
            variant="outline"
            size="sm"
            className={statusFilter === "pending" ? "bg-yellow-500/10 text-yellow-500" : ""}
            onClick={() => setStatusFilter(statusFilter === "pending" ? null : "pending")}
          >
            Pendentes
          </Button>
          <Button
            variant="outline"
            size="sm"
            className={statusFilter === "inactive" ? "bg-gray-500/10 text-gray-500" : ""}
            onClick={() => setStatusFilter(statusFilter === "inactive" ? null : "inactive")}
          >
            Inativos
          </Button>

          <div className="h-4 w-px bg-white/10" />

          {/* Permission Filters */}
          <Button
            variant="outline"
            size="sm"
            className={permissionFilter === "admin" ? "bg-red-500/10 text-red-500" : ""}
            onClick={() => setPermissionFilter(permissionFilter === "admin" ? null : "admin")}
          >
            Admins
          </Button>
          <Button
            variant="outline"
            size="sm"
            className={permissionFilter === "moderator" ? "bg-blue-500/10 text-blue-500" : ""}
            onClick={() => setPermissionFilter(permissionFilter === "moderator" ? null : "moderator")}
          >
            Moderadores
          </Button>
          <Button
            variant="outline"
            size="sm"
            className={permissionFilter === "member" ? "bg-gray-500/10 text-gray-500" : ""}
            onClick={() => setPermissionFilter(permissionFilter === "member" ? null : "member")}
          >
            Membros
          </Button>

          {(statusFilter || permissionFilter) && (
            <Button
              variant="ghost"
              size="sm"
              onClick={() => {
                setStatusFilter(null)
                setPermissionFilter(null)
              }}
            >
              Limpar Filtros
            </Button>
          )}
        </div>
      </div>

      {/* Bulk Actions */}
      {selectedMembers.length > 0 && (
        <div className="mb-4 flex items-center justify-between rounded-lg border border-white/10 bg-white/5 p-3">
          <p className="text-sm">
            <span className="font-medium">{selectedMembers.length}</span> membros selecionados
          </p>
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" onClick={() => handleBulkAction("activate")}>
              Ativar
            </Button>
            <Button variant="outline" size="sm" onClick={() => handleBulkAction("promote")}>
              Promover
            </Button>
            <Button variant="outline" size="sm" onClick={() => handleBulkAction("deactivate")}>
              Desativar
            </Button>
            <Button variant="destructive" size="sm" onClick={() => handleBulkAction("remove")}>
              Remover
            </Button>
          </div>
        </div>
      )}

      {/* Members List/Grid */}
      <div className="space-y-4">
        {/* Header */}
        <div className="flex items-center gap-3 rounded-lg border border-white/10 bg-white/5 p-3">
          <input
            type="checkbox"
            checked={selectedMembers.length === filteredMembers.length && filteredMembers.length > 0}
            onChange={handleSelectAll}
            className="rounded"
          />
          <p className="text-sm font-medium">Selecionar todos</p>
        </div>

        {filteredMembers.length > 0 ? (
          viewMode === "grid" ? (
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
              {filteredMembers.map((member) => (
                <div key={member.id} className="rounded-lg border border-white/10 bg-white/5 p-4">
                  <div className="mb-3 flex items-start justify-between">
                    <input
                      type="checkbox"
                      checked={selectedMembers.includes(member.id)}
                      onChange={() => handleSelectMember(member.id)}
                      className="rounded"
                    />
                    <div className="flex items-center gap-2">
                      <span
                        className={`rounded-full px-2 py-0.5 text-xs font-medium ${
                          statusColors[member.status].bg
                        } ${statusColors[member.status].text}`}
                      >
                        {statusColors[member.status].label}
                      </span>
                      <Button variant="ghost" size="sm" className="h-6 w-6 p-0">
                        <MoreHorizontal className="h-3 w-3" />
                      </Button>
                    </div>
                  </div>

                  <div className="mb-3 flex items-center gap-3">
                    <div className={`h-12 w-12 rounded-full ${member.color} flex items-center justify-center`}>
                      <span className="text-lg font-bold text-white">{member.avatar}</span>
                    </div>
                    <div className="flex-1">
                      <h3 className="font-semibold">{member.name}</h3>
                      <p className="text-sm text-gray-400">{member.role}</p>
                    </div>
                  </div>

                  <div className="mb-3 space-y-1 text-xs text-gray-400">
                    <p>
                      {member.course} • {member.semester}º semestre
                    </p>
                    <p>{member.email}</p>
                    <p>Membro desde {new Date(member.joinDate).toLocaleDateString("pt-BR")}</p>
                  </div>

                  <div className="mb-3 grid grid-cols-3 gap-2 text-center">
                    <div className="rounded-lg bg-white/5 p-2">
                      <p className="text-xs text-gray-400">Projetos</p>
                      <p className="font-semibold">{member.projectsCount}</p>
                    </div>
                    <div className="rounded-lg bg-white/5 p-2">
                      <p className="text-xs text-gray-400">Equipes</p>
                      <p className="font-semibold">{member.teamsCount}</p>
                    </div>
                    <div className="rounded-lg bg-white/5 p-2">
                      <p className="text-xs text-gray-400">Horas</p>
                      <p className="font-semibold">{member.hoursContributed}</p>
                    </div>
                  </div>

                  <div className="mb-3">
                    <div className="mb-1 flex items-center justify-between">
                      <p className="text-xs text-gray-400">Permissão</p>
                      <select
                        className="rounded border border-white/10 bg-black/80 px-2 py-0.5 text-xs"
                        value={member.permissions}
                        onChange={(e) => handleUpdatePermission(member.id, e.target.value as any)}
                      >
                        <option value="member">Membro</option>
                        <option value="moderator">Moderador</option>
                        <option value="admin">Admin</option>
                      </select>
                    </div>
                    <div className="flex items-center gap-1">
                      {React.createElement(permissionColors[member.permissions].icon, {
                        className: `h-3 w-3 ${permissionColors[member.permissions].text}`,
                      })}
                      <span className={`text-xs ${permissionColors[member.permissions].text}`}>
                        {permissionColors[member.permissions].label}
                      </span>
                    </div>
                  </div>

                  <div className="mb-3">
                    <p className="mb-1 text-xs text-gray-400">Habilidades</p>
                    <div className="flex flex-wrap gap-1">
                      {member.skills.slice(0, 3).map((skill, index) => (
                        <span key={index} className="rounded-full bg-white/10 px-2 py-0.5 text-xs">
                          {skill}
                        </span>
                      ))}
                      {member.skills.length > 3 && (
                        <span className="rounded-full bg-white/10 px-2 py-0.5 text-xs">
                          +{member.skills.length - 3}
                        </span>
                      )}
                    </div>
                  </div>

                  <div className="flex gap-2">
                    <Button variant="outline" size="sm" className="flex-1">
                      <Mail className="mr-2 h-3 w-3" />
                      Contatar
                    </Button>
                    <Button variant="outline" size="sm" className="flex-1">
                      <Settings className="mr-2 h-3 w-3" />
                      Editar
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="space-y-2">
              {filteredMembers.map((member) => (
                <div key={member.id} className="rounded-lg border border-white/10 bg-white/5 p-4">
                  <div className="flex items-center gap-3">
                    <input
                      type="checkbox"
                      checked={selectedMembers.includes(member.id)}
                      onChange={() => handleSelectMember(member.id)}
                      className="rounded"
                    />

                    <div className={`h-10 w-10 rounded-full ${member.color} flex items-center justify-center`}>
                      <span className="font-bold text-white">{member.avatar}</span>
                    </div>

                    <div className="flex-1">
                      <div className="flex items-center justify-between">
                        <div>
                          <h3 className="font-semibold">{member.name}</h3>
                          <p className="text-sm text-gray-400">{member.email}</p>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className="text-sm">{member.course}</span>
                          <span
                            className={`rounded-full px-2 py-0.5 text-xs font-medium ${
                              statusColors[member.status].bg
                            } ${statusColors[member.status].text}`}
                          >
                            {statusColors[member.status].label}
                          </span>
                          <span
                            className={`rounded-full px-2 py-0.5 text-xs font-medium ${
                              permissionColors[member.permissions].bg
                            } ${permissionColors[member.permissions].text}`}
                          >
                            {permissionColors[member.permissions].label}
                          </span>
                        </div>
                      </div>
                      <div className="mt-2 flex items-center gap-4 text-xs text-gray-400">
                        <span className="flex items-center gap-1">
                          <Briefcase className="h-3 w-3" />
                          {member.projectsCount} projetos
                        </span>
                        <span className="flex items-center gap-1">
                          <Users className="h-3 w-3" />
                          {member.teamsCount} equipes
                        </span>
                        <span className="flex items-center gap-1">
                          <Clock className="h-3 w-3" />
                          {member.hoursContributed}h
                        </span>
                        <span className="flex items-center gap-1">
                          <Calendar className="h-3 w-3" />
                          Ativo em {new Date(member.lastActive).toLocaleDateString("pt-BR")}
                        </span>
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <Button variant="outline" size="sm">
                        <Mail className="mr-2 h-3 w-3" />
                        Contatar
                      </Button>
                      <Button variant="outline" size="sm">
                        <Settings className="mr-2 h-3 w-3" />
                        Editar
                      </Button>
                      <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )
        ) : (
          <div className="flex flex-col items-center justify-center rounded-lg border border-white/10 bg-white/5 p-8">
            <Users className="mb-3 h-12 w-12 text-gray-400" />
            <h3 className="mb-1 font-medium">Nenhum membro encontrado</h3>
            <p className="text-center text-sm text-gray-400">
              {searchQuery || statusFilter || permissionFilter
                ? "Tente ajustar os filtros de busca"
                : "Ainda não há membros cadastrados"}
            </p>
          </div>
        )}
      </div>
    </div>
  )
}
