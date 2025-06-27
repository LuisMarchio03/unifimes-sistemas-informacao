"use client"

import { useEffect, useState } from "react"
import { Plus, X, Mail, User, Crown, Shield } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import type { ProjectData } from "@/app/projetos/wizard/page"

interface TeamMember {
  email: string
  role: string
}

const roles = [
  { id: "leader", name: "Líder", icon: Crown, description: "Responsável pela gestão geral" },
  { id: "developer", name: "Desenvolvedor", icon: User, description: "Implementação técnica" },
  { id: "designer", name: "Designer", icon: Shield, description: "Interface e experiência" },
  { id: "researcher", name: "Pesquisador", icon: User, description: "Pesquisa e análise" },
  { id: "analyst", name: "Analista", icon: User, description: "Análise de dados" },
  { id: "coordinator", name: "Coordenador", icon: Shield, description: "Coordenação de atividades" },
]

interface TeamStepProps {
  data: ProjectData
  onUpdate: (data: Partial<ProjectData>) => void
  onValidation: (isValid: boolean) => void
}

export function ProjectTeamStep({ data, onUpdate, onValidation }: TeamStepProps) {
  const [participants, setParticipants] = useState<TeamMember[]>(data.participants || [])
  const [newEmail, setNewEmail] = useState("")
  const [selectedRole, setSelectedRole] = useState("developer")

  useEffect(() => {
    onValidation(participants.length >= 1)
  }, [participants, onValidation])

  useEffect(() => {
    onUpdate({ participants })
  }, [participants, onUpdate])

  const addParticipant = () => {
    if (newEmail.trim() && isValidEmail(newEmail)) {
      const exists = participants.some((p) => p.email === newEmail.trim())
      if (!exists) {
        setParticipants([...participants, { email: newEmail.trim(), role: selectedRole }])
        setNewEmail("")
      }
    }
  }

  const removeParticipant = (index: number) => {
    setParticipants(participants.filter((_, i) => i !== index))
  }

  const updateParticipantRole = (index: number, role: string) => {
    const updated = [...participants]
    updated[index].role = role
    setParticipants(updated)
  }

  const isValidEmail = (email: string) => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)
  }

  const getRoleInfo = (roleId: string) => {
    return roles.find((r) => r.id === roleId) || roles[0]
  }

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-2xl font-bold mb-2">Equipe do Projeto</h2>
        <p className="text-gray-400">Convide membros para participar do seu projeto</p>
      </div>

      <div className="space-y-6">
        {/* Current Team Members */}
        {participants.length > 0 && (
          <div className="space-y-4">
            <h3 className="font-semibold flex items-center space-x-2">
              <User className="h-5 w-5" />
              <span>Membros da Equipe ({participants.length})</span>
            </h3>

            <div className="space-y-3">
              {participants.map((participant, index) => {
                const roleInfo = getRoleInfo(participant.role)
                const RoleIcon = roleInfo.icon

                return (
                  <div key={index} className="group rounded-lg border border-white/10 bg-white/5 p-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <div className="h-10 w-10 rounded-full bg-gradient-to-r from-red-500 to-orange-500 flex items-center justify-center">
                          {participant.email.charAt(0).toUpperCase()}
                        </div>
                        <div>
                          <p className="font-medium">{participant.email}</p>
                          <div className="flex items-center space-x-1 text-sm text-gray-400">
                            <RoleIcon className="h-4 w-4" />
                            <span>{roleInfo.name}</span>
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center space-x-2">
                        <select
                          value={participant.role}
                          onChange={(e) => updateParticipantRole(index, e.target.value)}
                          className="rounded border border-white/10 bg-black/80 px-2 py-1 text-sm"
                        >
                          {roles.map((role) => (
                            <option key={role.id} value={role.id}>
                              {role.name}
                            </option>
                          ))}
                        </select>
                        <button
                          onClick={() => removeParticipant(index)}
                          className="opacity-0 group-hover:opacity-100 transition-opacity text-gray-400 hover:text-red-500"
                        >
                          <X className="h-5 w-5" />
                        </button>
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
        )}

        {/* Add New Member */}
        <div className="space-y-4">
          <h3 className="font-semibold">Adicionar Membro</h3>

          <div className="space-y-3">
            <div className="flex space-x-2">
              <div className="relative flex-1">
                <Mail className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
                <Input
                  placeholder="email@exemplo.com"
                  value={newEmail}
                  onChange={(e) => setNewEmail(e.target.value)}
                  onKeyPress={(e) => e.key === "Enter" && addParticipant()}
                  className="pl-10 border-white/10"
                />
              </div>
              <Button onClick={addParticipant} variant="outline" size="icon">
                <Plus className="h-4 w-4" />
              </Button>
            </div>

            <div className="grid gap-2 md:grid-cols-3">
              {roles.map((role) => {
                const RoleIcon = role.icon
                return (
                  <button
                    key={role.id}
                    onClick={() => setSelectedRole(role.id)}
                    className={`rounded-lg border p-3 text-left transition-all ${
                      selectedRole === role.id
                        ? "border-primary bg-primary/10"
                        : "border-white/10 bg-white/5 hover:bg-white/10"
                    }`}
                  >
                    <div className="flex items-center space-x-2 mb-1">
                      <RoleIcon className="h-4 w-4" />
                      <span className="font-medium text-sm">{role.name}</span>
                    </div>
                    <p className="text-xs text-gray-400">{role.description}</p>
                  </button>
                )
              })}
            </div>
          </div>
        </div>

        {/* Team Guidelines */}
        <div className="rounded-lg border border-warning/20 bg-warning/10 p-4">
          <h4 className="font-semibold text-warning mb-2">Dicas para Formar uma Equipe</h4>
          <ul className="space-y-1 text-sm text-gray-300">
            <li>• Defina papéis claros para cada membro</li>
            <li>• Considere habilidades complementares</li>
            <li>• Mantenha a equipe em tamanho gerenciável</li>
            <li>• Estabeleça canais de comunicação</li>
          </ul>
        </div>
      </div>
    </div>
  )
}
