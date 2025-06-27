"use client"

import { useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  ArrowLeft,
  Search,
  Filter,
  CheckCircle,
  XCircle,
  Clock,
  Users,
  Briefcase,
  Mail,
  Calendar,
  AlertCircle,
  Star,
} from "lucide-react"

// Mock pending invitations for the current user
const mockPendingInvitations = [
  {
    id: "inv_1",
    type: "team",
    teamId: "team_1",
    teamName: "Data Science Masters",
    teamDescription: "Equipe focada em análise de dados e machine learning para projetos acadêmicos.",
    teamLogo: "DS",
    teamCategory: "dados",
    inviterName: "Ana Carolina Silva",
    inviterEmail: "ana.carolina@unifimes.edu.br",
    inviterRole: "Professora",
    message: "Sua experiência em análise de dados seria muito valiosa para nossos projetos de pesquisa.",
    sentAt: "2023-11-10T10:30:00Z",
    expiresAt: "2023-11-17T10:30:00Z",
    membersCount: 8,
    projectsCount: 3,
    skills: ["Python", "Machine Learning", "Data Analysis", "Statistics"],
    isRecommended: true,
  },
  {
    id: "inv_2",
    type: "project",
    projectId: "proj_1",
    projectName: "Sistema de Gestão Acadêmica",
    projectDescription: "Desenvolvimento de um sistema completo para gestão de atividades acadêmicas.",
    inviterName: "Vitor Joáz",
    inviterEmail: "vitor.joaz@unifimes.edu.br",
    inviterRole: "Estudante",
    message: "Precisamos de alguém com suas habilidades em frontend para finalizar o projeto.",
    sentAt: "2023-11-12T14:20:00Z",
    expiresAt: "2023-11-19T14:20:00Z",
    deadline: "2023-12-15",
    hoursEstimated: 40,
    membersCount: 5,
    skills: ["React", "TypeScript", "UI/UX"],
    priority: "high",
    isRecommended: false,
  },
  {
    id: "inv_3",
    type: "team",
    teamId: "team_2",
    teamName: "Mobile Innovation Lab",
    teamDescription: "Laboratório de inovação focado no desenvolvimento de aplicativos móveis.",
    teamLogo: "MI",
    teamCategory: "mobile",
    inviterName: "Carla Mendes",
    inviterEmail: "carla.mendes@unifimes.edu.br",
    inviterRole: "Coordenadora",
    message: "Venha fazer parte do nosso laboratório de inovação em desenvolvimento mobile!",
    sentAt: "2023-11-08T16:45:00Z",
    expiresAt: "2023-11-15T16:45:00Z",
    membersCount: 12,
    projectsCount: 6,
    skills: ["Flutter", "React Native", "iOS", "Android"],
    isRecommended: true,
  },
  {
    id: "inv_4",
    type: "project",
    projectId: "proj_2",
    projectName: "Plataforma de E-learning",
    projectDescription: "Criação de uma plataforma moderna de ensino à distância.",
    inviterName: "Pedro Henrique",
    inviterEmail: "pedro.henrique@unifimes.edu.br",
    inviterRole: "Estudante",
    message: "Seu conhecimento em UX seria fundamental para criar uma experiência incrível.",
    sentAt: "2023-11-11T09:15:00Z",
    expiresAt: "2023-11-18T09:15:00Z",
    deadline: "2024-01-30",
    hoursEstimated: 60,
    membersCount: 4,
    skills: ["UI/UX", "Figma", "User Research"],
    priority: "medium",
    isRecommended: false,
  },
]

const typeColors = {
  team: { bg: "bg-blue-500/10", text: "text-blue-500", label: "Equipe" },
  project: { bg: "bg-purple-500/10", text: "text-purple-500", label: "Projeto" },
}

const priorityColors = {
  high: "text-red-500",
  medium: "text-yellow-500",
  low: "text-blue-500",
}

export default function AceitarConvitesPage() {
  const [invitations, setInvitations] = useState(mockPendingInvitations)
  const [searchQuery, setSearchQuery] = useState("")
  const [typeFilter, setTypeFilter] = useState<string | null>(null)
  const [sortBy, setSortBy] = useState<"date" | "recommended" | "expiry">("date")

  // Filter and sort invitations
  const filteredInvitations = invitations
    .filter((inv) => {
      const matchesSearch =
        (inv.teamName && inv.teamName.toLowerCase().includes(searchQuery.toLowerCase())) ||
        (inv.projectName && inv.projectName.toLowerCase().includes(searchQuery.toLowerCase())) ||
        inv.inviterName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        inv.message.toLowerCase().includes(searchQuery.toLowerCase())

      const matchesType = !typeFilter || inv.type === typeFilter

      return matchesSearch && matchesType
    })
    .sort((a, b) => {
      if (sortBy === "date") return new Date(b.sentAt).getTime() - new Date(a.sentAt).getTime()
      if (sortBy === "recommended") return Number(b.isRecommended) - Number(a.isRecommended)
      if (sortBy === "expiry") return new Date(a.expiresAt).getTime() - new Date(b.expiresAt).getTime()
      return 0
    })

  const handleAcceptInvitation = async (invitationId: string) => {
    // In a real app, you would call the API to accept the invitation
    setInvitations(invitations.filter((inv) => inv.id !== invitationId))
    // Show success message
  }

  const handleDeclineInvitation = async (invitationId: string) => {
    // In a real app, you would call the API to decline the invitation
    setInvitations(invitations.filter((inv) => inv.id !== invitationId))
    // Show success message
  }

  const isExpiringSoon = (expiresAt: string) => {
    const expiryDate = new Date(expiresAt)
    const now = new Date()
    const hoursUntilExpiry = (expiryDate.getTime() - now.getTime()) / (1000 * 60 * 60)
    return hoursUntilExpiry <= 24 && hoursUntilExpiry > 0
  }

  const isExpired = (expiresAt: string) => {
    return new Date(expiresAt) < new Date()
  }

  return (
    <div className="flex min-h-screen flex-col px-4 py-6">
      <header className="mb-6 flex items-center justify-between">
        <div className="flex items-center">
          <Link href="/home" className="mr-4">
            <ArrowLeft className="h-6 w-6" />
          </Link>
          <h1 className="text-xl font-bold">Convites Pendentes</h1>
        </div>
        <div className="flex items-center gap-2">
          <span className="rounded-full bg-primary/20 px-3 py-1 text-sm font-medium text-primary">
            {invitations.length} convites
          </span>
        </div>
      </header>

      {/* Quick Stats */}
      <div className="mb-6 grid grid-cols-2 gap-4 md:grid-cols-4">
        <div className="rounded-lg border border-white/10 bg-white/5 p-4 text-center">
          <p className="text-2xl font-bold">{invitations.length}</p>
          <p className="text-sm text-gray-400">Total</p>
        </div>
        <div className="rounded-lg border border-white/10 bg-blue-500/10 p-4 text-center">
          <p className="text-2xl font-bold text-blue-500">{invitations.filter((inv) => inv.type === "team").length}</p>
          <p className="text-sm text-gray-400">Equipes</p>
        </div>
        <div className="rounded-lg border border-white/10 bg-purple-500/10 p-4 text-center">
          <p className="text-2xl font-bold text-purple-500">
            {invitations.filter((inv) => inv.type === "project").length}
          </p>
          <p className="text-sm text-gray-400">Projetos</p>
        </div>
        <div className="rounded-lg border border-white/10 bg-yellow-500/10 p-4 text-center">
          <p className="text-2xl font-bold text-yellow-500">
            {invitations.filter((inv) => isExpiringSoon(inv.expiresAt)).length}
          </p>
          <p className="text-sm text-gray-400">Expirando</p>
        </div>
      </div>

      {/* Filters and Search */}
      <div className="mb-6 space-y-4">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex flex-1 items-center gap-2">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
              <Input
                placeholder="Buscar convites..."
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
              <option value="recommended">Recomendados</option>
              <option value="expiry">Expirando</option>
            </select>
          </div>
        </div>

        {/* Filter Buttons */}
        <div className="flex flex-wrap items-center gap-2">
          <p className="text-sm text-gray-400">Filtrar por:</p>
          {/* <Button
            variant="outline"
            size="sm"
            className={typeFilter === "team" ? "bg-blue-500/10 text-blue-500" : ""}
            onClick={() => setTypeFilter(typeFilter === "team" ? null : "team")}
          >
            <Users className="mr-2 h-3 w-3" />
            Equipes
          </Button> */}
          <Button
            variant="outline"
            size="sm"
            className={typeFilter === "project" ? "bg-purple-500/10 text-purple-500" : ""}
            onClick={() => setTypeFilter(typeFilter === "project" ? null : "project")}
          >
            <Briefcase className="mr-2 h-3 w-3" />
            Projetos
          </Button>
          <Button variant="outline" size="sm" onClick={() => setSortBy("recommended")}>
            <Star className="mr-2 h-3 w-3" />
            Recomendados
          </Button>

          {typeFilter && (
            <Button variant="ghost" size="sm" onClick={() => setTypeFilter(null)}>
              Limpar Filtros
            </Button>
          )}
        </div>
      </div>

      {/* Invitations List */}
      <div className="space-y-4">
        {filteredInvitations.length > 0 ? (
          filteredInvitations.map((invitation) => (
            <div
              key={invitation.id}
              className={`rounded-lg border border-white/10 bg-white/5 p-6 ${
                isExpired(invitation.expiresAt) ? "opacity-50" : ""
              }`}
            >
              {/* Header */}
              <div className="mb-4 flex items-start justify-between">
                <div className="flex items-center gap-3">
                  {invitation.type === "team" ? (
                    <div className="h-12 w-12 rounded-lg bg-gradient-to-r from-blue-500 to-purple-500 flex items-center justify-center">
                      <span className="text-lg font-bold text-white">{invitation.teamLogo}</span>
                    </div>
                  ) : (
                    <div className="h-12 w-12 rounded-lg bg-gradient-to-r from-purple-500 to-pink-500 flex items-center justify-center">
                      <Briefcase className="h-6 w-6 text-white" />
                    </div>
                  )}
                  <div>
                    <h3 className="text-lg font-bold">
                      {invitation.type === "team" ? invitation.teamName : invitation.projectName}
                    </h3>
                    <p className="text-sm text-gray-400">
                      {invitation.type === "team" ? invitation.teamDescription : invitation.projectDescription}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  {invitation.isRecommended && (
                    <div className="flex items-center gap-1 rounded-full bg-yellow-500/10 px-2 py-1">
                      <Star className="h-3 w-3 text-yellow-500" />
                      <span className="text-xs font-medium text-yellow-500">Recomendado</span>
                    </div>
                  )}
                  <span
                    className={`rounded-full px-2 py-0.5 text-xs font-medium ${
                      typeColors[invitation.type].bg
                    } ${typeColors[invitation.type].text}`}
                  >
                    {typeColors[invitation.type].label}
                  </span>
                </div>
              </div>

              {/* Invitation Details */}
              <div className="mb-4 rounded-lg bg-white/5 p-4">
                <div className="mb-3 flex items-center gap-3">
                  <div className="h-8 w-8 rounded-full bg-gradient-to-r from-red-500 to-orange-500 flex items-center justify-center">
                    <span className="text-sm font-bold text-white">
                      {invitation.inviterName
                        .split(" ")
                        .map((n) => n[0])
                        .join("")}
                    </span>
                  </div>
                  <div>
                    <p className="font-medium">{invitation.inviterName}</p>
                    <p className="text-sm text-gray-400">
                      {invitation.inviterRole} • {invitation.inviterEmail}
                    </p>
                  </div>
                </div>
                <p className="text-gray-300">{invitation.message}</p>
              </div>

              {/* Stats and Info */}
              <div className="mb-4 grid grid-cols-2 gap-4 md:grid-cols-4">
                <div className="rounded-lg bg-white/5 p-3 text-center">
                  <p className="text-xs text-gray-400">Membros</p>
                  <p className="text-lg font-semibold">{invitation.membersCount}</p>
                </div>
                {invitation.type === "team" ? (
                  <div className="rounded-lg bg-white/5 p-3 text-center">
                    <p className="text-xs text-gray-400">Projetos</p>
                    <p className="text-lg font-semibold">{invitation.projectsCount}</p>
                  </div>
                ) : (
                  <div className="rounded-lg bg-white/5 p-3 text-center">
                    <p className="text-xs text-gray-400">Horas Est.</p>
                    <p className="text-lg font-semibold">{invitation.hoursEstimated}h</p>
                  </div>
                )}
                <div className="rounded-lg bg-white/5 p-3 text-center">
                  <p className="text-xs text-gray-400">Enviado</p>
                  <p className="text-sm font-semibold">{new Date(invitation.sentAt).toLocaleDateString("pt-BR")}</p>
                </div>
                <div className="rounded-lg bg-white/5 p-3 text-center">
                  <p className="text-xs text-gray-400">Expira</p>
                  <p
                    className={`text-sm font-semibold ${
                      isExpiringSoon(invitation.expiresAt)
                        ? "text-yellow-500"
                        : isExpired(invitation.expiresAt)
                          ? "text-red-500"
                          : ""
                    }`}
                  >
                    {new Date(invitation.expiresAt).toLocaleDateString("pt-BR")}
                  </p>
                </div>
              </div>

              {/* Skills/Technologies */}
              <div className="mb-4">
                <p className="mb-2 text-sm text-gray-400">Habilidades Relevantes</p>
                <div className="flex flex-wrap gap-2">
                  {invitation.skills.map((skill, index) => (
                    <span key={index} className="rounded-full bg-white/10 px-3 py-1 text-sm">
                      {skill}
                    </span>
                  ))}
                </div>
              </div>

              {/* Project specific info */}
              {invitation.type === "project" && (
                <div className="mb-4 flex items-center gap-4 text-sm text-gray-400">
                  <span className="flex items-center gap-1">
                    <Calendar className="h-3 w-3" />
                    Prazo: {new Date(invitation.deadline!).toLocaleDateString("pt-BR")}
                  </span>
                  <span className={`flex items-center gap-1 ${priorityColors[invitation.priority!]}`}>
                    <AlertCircle className="h-3 w-3" />
                    Prioridade{" "}
                    {invitation.priority === "high" ? "Alta" : invitation.priority === "medium" ? "Média" : "Baixa"}
                  </span>
                </div>
              )}

              {/* Expiry Warning */}
              {isExpiringSoon(invitation.expiresAt) && !isExpired(invitation.expiresAt) && (
                <div className="mb-4 flex items-center gap-2 rounded-lg bg-yellow-500/10 p-3 text-sm">
                  <Clock className="h-5 w-5 text-yellow-500" />
                  <p className="text-yellow-500">
                    <span className="font-medium">Expira em breve!</span> Este convite expira em menos de 24 horas.
                  </p>
                </div>
              )}

              {isExpired(invitation.expiresAt) && (
                <div className="mb-4 flex items-center gap-2 rounded-lg bg-red-500/10 p-3 text-sm">
                  <XCircle className="h-5 w-5 text-red-500" />
                  <p className="text-red-500">
                    <span className="font-medium">Convite expirado</span> Este convite não pode mais ser aceito.
                  </p>
                </div>
              )}

              {/* Actions */}
              <div className="flex gap-3">
                <Button
                  variant="outline"
                  className="flex-1"
                  onClick={() => handleDeclineInvitation(invitation.id)}
                  disabled={isExpired(invitation.expiresAt)}
                >
                  <XCircle className="mr-2 h-4 w-4" />
                  Recusar
                </Button>
                <Button
                  className="flex-1"
                  onClick={() => handleAcceptInvitation(invitation.id)}
                  disabled={isExpired(invitation.expiresAt)}
                >
                  <CheckCircle className="mr-2 h-4 w-4" />
                  Aceitar Convite
                </Button>
                <Button variant="ghost" size="sm">
                  <Link href={`/convites/${invitation.id}`}>Ver Detalhes</Link>
                </Button>
              </div>
            </div>
          ))
        ) : (
          <div className="flex flex-col items-center justify-center rounded-lg border border-white/10 bg-white/5 p-8">
            <Mail className="mb-3 h-12 w-12 text-gray-400" />
            <h3 className="mb-1 font-medium">Nenhum convite pendente</h3>
            <p className="text-center text-sm text-gray-400">
              {searchQuery || typeFilter
                ? "Nenhum convite corresponde aos filtros aplicados"
                : "Você não tem convites pendentes no momento"}
            </p>
            <Button variant="outline" className="mt-4">
              <Link href="/equipes">Explorar Equipes</Link>
            </Button>
          </div>
        )}
      </div>
    </div>
  )
}
