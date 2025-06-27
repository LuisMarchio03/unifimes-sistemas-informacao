"use client"

import { useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  ArrowLeft,
  Search,
  Filter,
  Send,
  Clock,
  XCircle,
  MoreHorizontal,
  Mail,
  Calendar,
  Users,
  AlertCircle,
  RefreshCw,
  Download,
  Plus,
} from "lucide-react"

// Mock invitation data
const mockInvitations = [
  {
    id: "inv_1",
    teamId: "team_1",
    teamName: "Dev Web Masters",
    inviterName: "Luís Gabriel",
    inviterEmail: "luis.gabriel@unifimes.edu.br",
    memberEmail: "ana.silva@email.com",
    memberName: "Ana Silva",
    status: "pending",
    sentAt: "2023-11-10T10:30:00Z",
    expiresAt: "2023-11-17T10:30:00Z",
    message: "Gostaríamos de convidá-la para nossa equipe de desenvolvimento web!",
    type: "team",
  },
  {
    id: "inv_2",
    teamId: "team_2",
    teamName: "Data Science",
    inviterName: "Ana Carolina",
    inviterEmail: "ana.carolina@unifimes.edu.br",
    memberEmail: "marcos.oliveira@email.com",
    memberName: "Marcos Oliveira",
    status: "accepted",
    sentAt: "2023-11-08T14:20:00Z",
    expiresAt: "2023-11-15T14:20:00Z",
    respondedAt: "2023-11-09T09:15:00Z",
    message: "Sua experiência em análise de dados seria muito valiosa para nosso projeto.",
    type: "team",
  },
  {
    id: "inv_3",
    projectId: "proj_1",
    projectName: "Sistema de Gestão Integrada",
    inviterName: "Vitor Joáz",
    inviterEmail: "vitor.joaz@unifimes.edu.br",
    memberEmail: "juliana.santos@email.com",
    memberName: "Juliana Santos",
    status: "declined",
    sentAt: "2023-11-05T16:45:00Z",
    expiresAt: "2023-11-12T16:45:00Z",
    respondedAt: "2023-11-06T11:30:00Z",
    message: "Precisamos de alguém com experiência em QA para nosso projeto.",
    type: "project",
  },
  {
    id: "inv_4",
    teamId: "team_3",
    teamName: "Mobile Developers",
    inviterName: "Carla Mendes",
    inviterEmail: "carla.mendes@unifimes.edu.br",
    memberEmail: "pedro.henrique@email.com",
    memberName: "Pedro Henrique",
    status: "expired",
    sentAt: "2023-10-28T12:00:00Z",
    expiresAt: "2023-11-04T12:00:00Z",
    message: "Venha fazer parte da nossa equipe de desenvolvimento mobile!",
    type: "team",
  },
  {
    id: "inv_5",
    projectId: "proj_2",
    projectName: "App Educacional",
    inviterName: "Luís Gabriel",
    inviterEmail: "luis.gabriel@unifimes.edu.br",
    memberEmail: "fernanda.costa@email.com",
    memberName: "Fernanda Costa",
    status: "pending",
    sentAt: "2023-11-12T08:15:00Z",
    expiresAt: "2023-11-19T08:15:00Z",
    message: "Seu conhecimento em educação seria perfeito para este projeto.",
    type: "project",
  },
]

const statusColors = {
  pending: { bg: "bg-yellow-500/10", text: "text-yellow-500", label: "Pendente" },
  accepted: { bg: "bg-green-500/10", text: "text-green-500", label: "Aceito" },
  declined: { bg: "bg-red-500/10", text: "text-red-500", label: "Recusado" },
  expired: { bg: "bg-gray-500/10", text: "text-gray-500", label: "Expirado" },
}

const typeColors = {
  team: { bg: "bg-blue-500/10", text: "text-blue-500", label: "Equipe" },
  project: { bg: "bg-purple-500/10", text: "text-purple-500", label: "Projeto" },
}

export default function GerenciarConvitesPage() {
  const [invitations, setInvitations] = useState(mockInvitations)
  const [searchQuery, setSearchQuery] = useState("")
  const [statusFilter, setStatusFilter] = useState<string | null>(null)
  const [typeFilter, setTypeFilter] = useState<string | null>(null)
  const [sortBy, setSortBy] = useState<"date" | "status" | "type">("date")
  const [selectedInvitations, setSelectedInvitations] = useState<string[]>([])

  // Filter and sort invitations
  const filteredInvitations = invitations
    .filter((inv) => {
      const matchesSearch =
        inv.memberName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        inv.memberEmail.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (inv.teamName && inv.teamName.toLowerCase().includes(searchQuery.toLowerCase())) ||
        (inv.projectName && inv.projectName.toLowerCase().includes(searchQuery.toLowerCase()))

      const matchesStatus = !statusFilter || inv.status === statusFilter
      const matchesType = !typeFilter || inv.type === typeFilter

      return matchesSearch && matchesStatus && matchesType
    })
    .sort((a, b) => {
      if (sortBy === "date") return new Date(b.sentAt).getTime() - new Date(a.sentAt).getTime()
      if (sortBy === "status") return a.status.localeCompare(b.status)
      if (sortBy === "type") return a.type.localeCompare(b.type)
      return 0
    })

  // Calculate statistics
  const stats = invitations.reduce(
    (acc, inv) => {
      acc.total++
      acc[inv.status as keyof typeof acc]++
      return acc
    },
    { total: 0, pending: 0, accepted: 0, declined: 0, expired: 0 },
  )

  const handleSelectInvitation = (invitationId: string) => {
    setSelectedInvitations((prev) =>
      prev.includes(invitationId) ? prev.filter((id) => id !== invitationId) : [...prev, invitationId],
    )
  }

  const handleSelectAll = () => {
    if (selectedInvitations.length === filteredInvitations.length) {
      setSelectedInvitations([])
    } else {
      setSelectedInvitations(filteredInvitations.map((inv) => inv.id))
    }
  }

  const handleBulkAction = (action: "resend" | "cancel" | "delete") => {
    // In a real app, you would perform the bulk action
    console.log(`Bulk action: ${action}`, selectedInvitations)
    setSelectedInvitations([])
  }

  const handleResendInvitation = (invitationId: string) => {
    setInvitations(
      invitations.map((inv) =>
        inv.id === invitationId
          ? {
              ...inv,
              status: "pending" as const,
              sentAt: new Date().toISOString(),
              expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
            }
          : inv,
      ),
    )
  }

  const handleCancelInvitation = (invitationId: string) => {
    setInvitations(invitations.filter((inv) => inv.id !== invitationId))
  }

  return (
    <div className="flex min-h-screen flex-col px-4 py-6">
      <header className="mb-6 flex items-center justify-between">
        <div className="flex items-center">
          <Link href="/equipes" className="mr-4">
            <ArrowLeft className="h-6 w-6" />
          </Link>
          <h1 className="text-xl font-bold">Gerenciar Convites</h1>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm">
            <Download className="mr-2 h-4 w-4" />
            Exportar
          </Button>
          <Button size="sm" asChild>
            <Link href="/equipes/nova">
              <Plus className="mr-2 h-4 w-4" />
              Nova Equipe
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
        <div className="rounded-lg border border-white/10 bg-yellow-500/10 p-4 text-center">
          <p className="text-2xl font-bold text-yellow-500">{stats.pending}</p>
          <p className="text-sm text-gray-400">Pendentes</p>
        </div>
        <div className="rounded-lg border border-white/10 bg-green-500/10 p-4 text-center">
          <p className="text-2xl font-bold text-green-500">{stats.accepted}</p>
          <p className="text-sm text-gray-400">Aceitos</p>
        </div>
        <div className="rounded-lg border border-white/10 bg-red-500/10 p-4 text-center">
          <p className="text-2xl font-bold text-red-500">{stats.declined}</p>
          <p className="text-sm text-gray-400">Recusados</p>
        </div>
        <div className="rounded-lg border border-white/10 bg-gray-500/10 p-4 text-center">
          <p className="text-2xl font-bold text-gray-500">{stats.expired}</p>
          <p className="text-sm text-gray-400">Expirados</p>
        </div>
      </div>

      {/* Filters and Search */}
      <div className="mb-6 space-y-4">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex flex-1 items-center gap-2">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
              <Input
                placeholder="Buscar por nome, email, equipe ou projeto..."
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
            <select
              className="rounded-lg border border-white/10 bg-black/80 px-3 py-1.5 text-sm"
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as any)}
            >
              <option value="date">Data</option>
              <option value="status">Status</option>
              <option value="type">Tipo</option>
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
            className={statusFilter === "pending" ? "bg-yellow-500/10 text-yellow-500" : ""}
            onClick={() => setStatusFilter(statusFilter === "pending" ? null : "pending")}
          >
            Pendentes
          </Button>
          <Button
            variant="outline"
            size="sm"
            className={statusFilter === "accepted" ? "bg-green-500/10 text-green-500" : ""}
            onClick={() => setStatusFilter(statusFilter === "accepted" ? null : "accepted")}
          >
            Aceitos
          </Button>
          <Button
            variant="outline"
            size="sm"
            className={statusFilter === "declined" ? "bg-red-500/10 text-red-500" : ""}
            onClick={() => setStatusFilter(statusFilter === "declined" ? null : "declined")}
          >
            Recusados
          </Button>
          <Button
            variant="outline"
            size="sm"
            className={statusFilter === "expired" ? "bg-gray-500/10 text-gray-500" : ""}
            onClick={() => setStatusFilter(statusFilter === "expired" ? null : "expired")}
          >
            Expirados
          </Button>

          <div className="h-4 w-px bg-white/10" />

          {/* Type Filters */}
          <Button
            variant="outline"
            size="sm"
            className={typeFilter === "team" ? "bg-blue-500/10 text-blue-500" : ""}
            onClick={() => setTypeFilter(typeFilter === "team" ? null : "team")}
          >
            Equipes
          </Button>
          <Button
            variant="outline"
            size="sm"
            className={typeFilter === "project" ? "bg-purple-500/10 text-purple-500" : ""}
            onClick={() => setTypeFilter(typeFilter === "project" ? null : "project")}
          >
            Projetos
          </Button>

          {(statusFilter || typeFilter) && (
            <Button
              variant="ghost"
              size="sm"
              onClick={() => {
                setStatusFilter(null)
                setTypeFilter(null)
              }}
            >
              Limpar Filtros
            </Button>
          )}
        </div>
      </div>

      {/* Bulk Actions */}
      {selectedInvitations.length > 0 && (
        <div className="mb-4 flex items-center justify-between rounded-lg border border-white/10 bg-white/5 p-3">
          <p className="text-sm">
            <span className="font-medium">{selectedInvitations.length}</span> convites selecionados
          </p>
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" onClick={() => handleBulkAction("resend")}>
              <Send className="mr-2 h-4 w-4" />
              Reenviar
            </Button>
            <Button variant="outline" size="sm" onClick={() => handleBulkAction("cancel")}>
              <XCircle className="mr-2 h-4 w-4" />
              Cancelar
            </Button>
            <Button variant="destructive" size="sm" onClick={() => handleBulkAction("delete")}>
              Excluir
            </Button>
          </div>
        </div>
      )}

      {/* Invitations List */}
      <div className="space-y-4">
        {/* Header */}
        <div className="flex items-center gap-3 rounded-lg border border-white/10 bg-white/5 p-3">
          <input
            type="checkbox"
            checked={selectedInvitations.length === filteredInvitations.length && filteredInvitations.length > 0}
            onChange={handleSelectAll}
            className="rounded"
          />
          <p className="text-sm font-medium">Selecionar todos</p>
        </div>

        {filteredInvitations.length > 0 ? (
          filteredInvitations.map((invitation) => (
            <div key={invitation.id} className="rounded-lg border border-white/10 bg-white/5 p-4">
              <div className="flex items-start gap-3">
                <input
                  type="checkbox"
                  checked={selectedInvitations.includes(invitation.id)}
                  onChange={() => handleSelectInvitation(invitation.id)}
                  className="mt-1 rounded"
                />

                <div className="flex-1">
                  <div className="mb-2 flex items-start justify-between">
                    <div>
                      <h3 className="font-semibold">{invitation.memberName}</h3>
                      <p className="text-sm text-gray-400">{invitation.memberEmail}</p>
                    </div>
                    <div className="flex items-center gap-2">
                      <span
                        className={`rounded-full px-2 py-0.5 text-xs font-medium ${
                          statusColors[invitation.status].bg
                        } ${statusColors[invitation.status].text}`}
                      >
                        {statusColors[invitation.status].label}
                      </span>
                      <span
                        className={`rounded-full px-2 py-0.5 text-xs font-medium ${
                          typeColors[invitation.type].bg
                        } ${typeColors[invitation.type].text}`}
                      >
                        {typeColors[invitation.type].label}
                      </span>
                      <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>

                  <div className="mb-3 rounded-lg bg-white/5 p-3">
                    <div className="mb-2 flex items-center gap-2">
                      {invitation.type === "team" ? (
                        <Users className="h-4 w-4 text-blue-500" />
                      ) : (
                        <Calendar className="h-4 w-4 text-purple-500" />
                      )}
                      <h4 className="font-medium">
                        {invitation.type === "team" ? invitation.teamName : invitation.projectName}
                      </h4>
                    </div>
                    <p className="text-sm text-gray-300">{invitation.message}</p>
                  </div>

                  <div className="mb-3 flex items-center justify-between text-xs text-gray-400">
                    <div className="flex items-center gap-4">
                      <span className="flex items-center gap-1">
                        <Mail className="h-3 w-3" />
                        Enviado por {invitation.inviterName}
                      </span>
                      <span className="flex items-center gap-1">
                        <Clock className="h-3 w-3" />
                        {new Date(invitation.sentAt).toLocaleDateString("pt-BR")}
                      </span>
                    </div>
                    <div className="flex items-center gap-1">
                      {invitation.status === "pending" && new Date(invitation.expiresAt) < new Date() && (
                        <AlertCircle className="h-3 w-3 text-red-500" />
                      )}
                      <span>Expira em {new Date(invitation.expiresAt).toLocaleDateString("pt-BR")}</span>
                    </div>
                  </div>

                  {invitation.respondedAt && (
                    <div className="mb-3 text-xs text-gray-400">
                      Respondido em {new Date(invitation.respondedAt).toLocaleDateString("pt-BR")} às{" "}
                      {new Date(invitation.respondedAt).toLocaleTimeString("pt-BR", {
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </div>
                  )}

                  <div className="flex gap-2">
                    {invitation.status === "pending" && (
                      <>
                        <Button variant="outline" size="sm" onClick={() => handleResendInvitation(invitation.id)}>
                          <RefreshCw className="mr-2 h-4 w-4" />
                          Reenviar
                        </Button>
                        <Button variant="outline" size="sm" onClick={() => handleCancelInvitation(invitation.id)}>
                          <XCircle className="mr-2 h-4 w-4" />
                          Cancelar
                        </Button>
                      </>
                    )}
                    {invitation.status === "expired" && (
                      <Button variant="outline" size="sm" onClick={() => handleResendInvitation(invitation.id)}>
                        <Send className="mr-2 h-4 w-4" />
                        Enviar Novo
                      </Button>
                    )}
                    <Button variant="ghost" size="sm" asChild>
                      <Link href={`/convites/${invitation.id}`}>Ver Detalhes</Link>
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className="flex flex-col items-center justify-center rounded-lg border border-white/10 bg-white/5 p-8">
            <Mail className="mb-3 h-12 w-12 text-gray-400" />
            <h3 className="mb-1 font-medium">Nenhum convite encontrado</h3>
            <p className="text-center text-sm text-gray-400">
              {searchQuery || statusFilter || typeFilter
                ? "Tente ajustar os filtros de busca"
                : "Você ainda não enviou nenhum convite"}
            </p>
          </div>
        )}
      </div>
    </div>
  )
}
