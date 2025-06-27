"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Mail, Send, Check, X, Loader2 } from "lucide-react"

interface InvitationSenderProps {
  teamId: string
  teamName: string
  inviterName: string
  inviterEmail: string
  onInvitationSent?: (email: string) => void
}

interface InvitationStatus {
  email: string
  status: "sending" | "sent" | "error"
  error?: string
}

export function InvitationSender({
  teamId,
  teamName,
  inviterName,
  inviterEmail,
  onInvitationSent,
}: InvitationSenderProps) {
  const [email, setEmail] = useState("")
  const [message, setMessage] = useState("")
  const [invitations, setInvitations] = useState<InvitationStatus[]>([])
  const [isOpen, setIsOpen] = useState(false)

  const sendInvitation = async () => {
    if (!email.trim()) return

    const invitationData = {
      teamId,
      teamName,
      inviterName,
      inviterEmail,
      memberEmail: email.trim(),
      message: message.trim() || undefined,
    }

    // Add to pending invitations
    setInvitations((prev) => [...prev, { email: email.trim(), status: "sending" }])

    try {
      const response = await fetch("/api/invitations/send", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(invitationData),
      })

      const data = await response.json()

      if (data.success) {
        setInvitations((prev) => prev.map((inv) => (inv.email === email.trim() ? { ...inv, status: "sent" } : inv)))
        onInvitationSent?.(email.trim())
        setEmail("")
        setMessage("")
      } else {
        setInvitations((prev) =>
          prev.map((inv) => (inv.email === email.trim() ? { ...inv, status: "error", error: data.error } : inv)),
        )
      }
    } catch (error) {
      setInvitations((prev) =>
        prev.map((inv) => (inv.email === email.trim() ? { ...inv, status: "error", error: "Erro de conexão" } : inv)),
      )
    }
  }

  const removeInvitation = (emailToRemove: string) => {
    setInvitations((prev) => prev.filter((inv) => inv.email !== emailToRemove))
  }

  if (!isOpen) {
    return (
      <Button variant="outline" size="sm" onClick={() => setIsOpen(true)} className="w-full">
        <Mail className="mr-2 h-4 w-4" />
        Convidar Membros
      </Button>
    )
  }

  return (
    <div className="space-y-4 rounded-lg border border-white/10 bg-white/5 p-4">
      <div className="flex items-center justify-between">
        <h3 className="font-semibold">Convidar Membros</h3>
        <Button variant="ghost" size="sm" onClick={() => setIsOpen(false)}>
          <X className="h-4 w-4" />
        </Button>
      </div>

      <div className="space-y-3">
        <div>
          <label htmlFor="invite-email" className="text-sm text-gray-400">
            Email do membro
          </label>
          <Input
            id="invite-email"
            type="email"
            placeholder="exemplo@email.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="border-white/10"
          />
        </div>

        <div>
          <label htmlFor="invite-message" className="text-sm text-gray-400">
            Mensagem personalizada (opcional)
          </label>
          <Textarea
            id="invite-message"
            placeholder="Adicione uma mensagem pessoal ao convite..."
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            className="min-h-[80px] border-white/10 bg-black/80"
          />
        </div>

        <Button onClick={sendInvitation} disabled={!email.trim()} className="w-full">
          <Send className="mr-2 h-4 w-4" />
          Enviar Convite
        </Button>
      </div>

      {/* Invitation Status List */}
      {invitations.length > 0 && (
        <div className="space-y-2">
          <h4 className="text-sm font-medium text-gray-400">Convites Enviados</h4>
          {invitations.map((invitation, index) => (
            <div key={index} className="flex items-center justify-between rounded-lg bg-white/5 p-3">
              <div className="flex items-center gap-3">
                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-gradient-to-r from-red-500 to-orange-500">
                  {invitation.email.charAt(0).toUpperCase()}
                </div>
                <div>
                  <p className="text-sm font-medium">{invitation.email}</p>
                  {invitation.status === "error" && invitation.error && (
                    <p className="text-xs text-red-400">{invitation.error}</p>
                  )}
                </div>
              </div>

              <div className="flex items-center gap-2">
                {invitation.status === "sending" && <Loader2 className="h-4 w-4 animate-spin text-blue-400" />}
                {invitation.status === "sent" && <Check className="h-4 w-4 text-green-400" />}
                {invitation.status === "error" && <X className="h-4 w-4 text-red-400" />}

                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => removeInvitation(invitation.email)}
                  className="h-6 w-6 p-0"
                >
                  <X className="h-3 w-3" />
                </Button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
