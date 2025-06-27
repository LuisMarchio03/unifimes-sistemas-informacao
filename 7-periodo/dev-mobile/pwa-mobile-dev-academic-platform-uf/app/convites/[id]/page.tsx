"use client"

import { useState, useEffect } from "react"
import { useParams, useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Users, Mail, Calendar, Clock, CheckCircle, XCircle, AlertCircle, ArrowLeft } from "lucide-react"
import Link from "next/link"

interface Invitation {
  id: string
  teamId: string
  teamName: string
  teamDescription: string
  teamLogo: string
  teamCategory: string
  inviterName: string
  inviterEmail: string
  memberEmail: string
  message?: string
  status: "pending" | "accepted" | "declined" | "expired"
  sentAt: string
  expiresAt: string
}

export default function ConvitePage() {
  const params = useParams()
  const router = useRouter()
  const [invitation, setInvitation] = useState<Invitation | null>(null)
  const [loading, setLoading] = useState(true)
  const [responding, setResponding] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    fetchInvitation()
  }, [params.id])

  const fetchInvitation = async () => {
    try {
      const response = await fetch(`/api/invitations/${params.id}`)
      const data = await response.json()

      if (data.success) {
        setInvitation(data.invitation)
      } else {
        setError("Convite não encontrado")
      }
    } catch (err) {
      setError("Erro ao carregar convite")
    } finally {
      setLoading(false)
    }
  }

  const handleResponse = async (action: "accept" | "decline") => {
    if (!invitation) return

    setResponding(true)
    try {
      const response = await fetch(`/api/invitations/${invitation.id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          action,
          userId: "current_user_id", // In a real app, get from auth
          userName: "Luís Gabriel", // In a real app, get from auth
        }),
      })

      const data = await response.json()

      if (data.success) {
        setInvitation((prev) => (prev ? { ...prev, status: action === "accept" ? "accepted" : "declined" } : null))

        // Redirect after successful response
        setTimeout(() => {
          if (action === "accept") {
            router.push(`/equipes/${invitation.teamId}`)
          } else {
            router.push("/equipes")
          }
        }, 2000)
      } else {
        setError("Erro ao responder convite")
      }
    } catch (err) {
      setError("Erro ao responder convite")
    } finally {
      setResponding(false)
    }
  }

  const isExpired = invitation && new Date(invitation.expiresAt) < new Date()
  const canRespond = invitation && invitation.status === "pending" && !isExpired

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="text-center">
          <div className="h-8 w-8 animate-spin rounded-full border-2 border-primary border-t-transparent mx-auto mb-4"></div>
          <p className="text-gray-400">Carregando convite...</p>
        </div>
      </div>
    )
  }

  if (error || !invitation) {
    return (
      <div className="flex min-h-screen items-center justify-center px-4">
        <div className="text-center max-w-md">
          <AlertCircle className="h-16 w-16 text-red-500 mx-auto mb-4" />
          <h1 className="text-xl font-bold mb-2">Convite não encontrado</h1>
          <p className="text-gray-400 mb-6">Este convite pode ter expirado ou não existe mais.</p>
          <Button asChild>
            <Link href="/equipes">Ver Equipes</Link>
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className="flex min-h-screen flex-col px-4 py-6">
      <header className="mb-6 flex items-center">
        <Link href="/equipes" className="mr-4">
          <ArrowLeft className="h-6 w-6" />
        </Link>
        <h1 className="text-xl font-bold">Convite para Equipe</h1>
      </header>

      <div className="max-w-2xl mx-auto w-full space-y-6">
        {/* Invitation Status */}
        {invitation.status !== "pending" && (
          <div
            className={`rounded-lg border p-4 ${
              invitation.status === "accepted"
                ? "border-green-500/20 bg-green-500/10"
                : invitation.status === "declined"
                  ? "border-red-500/20 bg-red-500/10"
                  : "border-yellow-500/20 bg-yellow-500/10"
            }`}
          >
            <div className="flex items-center gap-3">
              {invitation.status === "accepted" && <CheckCircle className="h-5 w-5 text-green-500" />}
              {invitation.status === "declined" && <XCircle className="h-5 w-5 text-red-500" />}
              {invitation.status === "expired" && <Clock className="h-5 w-5 text-yellow-500" />}
              <p className="font-medium">
                {invitation.status === "accepted" && "Convite aceito com sucesso!"}
                {invitation.status === "declined" && "Convite recusado"}
                {invitation.status === "expired" && "Convite expirado"}
              </p>
            </div>
          </div>
        )}

        {/* Team Information */}
        <div className="relative">
          <div className="absolute inset-0 bg-gradient-to-r from-red-500/20 to-orange-500/20 blur-xl"></div>
          <div className="relative rounded-lg border border-white/10 bg-black/80 p-6">
            <div className="flex items-center gap-4 mb-4">
              <div className="h-16 w-16 rounded-lg bg-gradient-to-r from-red-500 to-orange-500 flex items-center justify-center">
                <span className="text-2xl font-bold">{invitation.teamLogo}</span>
              </div>
              <div className="flex-1">
                <h2 className="text-xl font-bold">{invitation.teamName}</h2>
                <p className="text-sm text-gray-400 capitalize">{invitation.teamCategory}</p>
              </div>
            </div>

            <p className="text-gray-300 mb-4">{invitation.teamDescription}</p>

            <div className="flex items-center gap-4 text-sm text-gray-400">
              <div className="flex items-center gap-2">
                <Users className="h-4 w-4" />
                <span>Equipe</span>
              </div>
              <div className="flex items-center gap-2">
                <Calendar className="h-4 w-4" />
                <span>Enviado em {new Date(invitation.sentAt).toLocaleDateString("pt-BR")}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Invitation Details */}
        <div className="rounded-lg bg-white/5 p-6 space-y-4">
          <h3 className="text-lg font-semibold">Detalhes do Convite</h3>

          <div className="space-y-3">
            <div className="flex items-center gap-3">
              <Mail className="h-5 w-5 text-gray-400" />
              <div>
                <p className="text-sm text-gray-400">Convidado por</p>
                <p className="font-medium">{invitation.inviterName}</p>
                <p className="text-sm text-gray-400">{invitation.inviterEmail}</p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <Clock className="h-5 w-5 text-gray-400" />
              <div>
                <p className="text-sm text-gray-400">Expira em</p>
                <p className="font-medium">
                  {new Date(invitation.expiresAt).toLocaleDateString("pt-BR")} às{" "}
                  {new Date(invitation.expiresAt).toLocaleTimeString("pt-BR", {
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </p>
              </div>
            </div>
          </div>

          {invitation.message && (
            <div className="mt-4 p-4 rounded-lg bg-white/5 border border-white/10">
              <p className="text-sm text-gray-400 mb-2">Mensagem pessoal:</p>
              <p className="text-gray-300">{invitation.message}</p>
            </div>
          )}
        </div>

        {/* Expiration Warning */}
        {isExpired && (
          <div className="rounded-lg border border-yellow-500/20 bg-yellow-500/10 p-4">
            <div className="flex items-center gap-3">
              <AlertCircle className="h-5 w-5 text-yellow-500" />
              <div>
                <p className="font-medium text-yellow-500">Convite Expirado</p>
                <p className="text-sm text-gray-400">
                  Este convite expirou em {new Date(invitation.expiresAt).toLocaleDateString("pt-BR")}
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Action Buttons */}
        {canRespond && (
          <div className="flex gap-4">
            <Button
              variant="outline"
              className="flex-1"
              onClick={() => handleResponse("decline")}
              disabled={responding}
            >
              {responding ? "Processando..." : "Recusar"}
            </Button>
            <Button className="flex-1" onClick={() => handleResponse("accept")} disabled={responding}>
              {responding ? "Processando..." : "Aceitar Convite"}
            </Button>
          </div>
        )}

        {!canRespond && invitation.status === "pending" && isExpired && (
          <div className="text-center">
            <Button variant="outline" asChild>
              <Link href="/equipes">Explorar Outras Equipes</Link>
            </Button>
          </div>
        )}

        {invitation.status === "accepted" && (
          <div className="text-center">
            <Button asChild>
              <Link href={`/equipes/${invitation.teamId}`}>Ir para a Equipe</Link>
            </Button>
          </div>
        )}

        {invitation.status === "declined" && (
          <div className="text-center">
            <Button variant="outline" asChild>
              <Link href="/equipes">Ver Outras Equipes</Link>
            </Button>
          </div>
        )}
      </div>
    </div>
  )
}
