"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { InvitationSender } from "@/components/invitation-sender"
import {
  ArrowLeft,
  MoreVertical,
  MessageSquare,
  Users,
  Briefcase,
  Settings,
  UserPlus,
  Calendar,
  ChevronRight,
  Plus,
} from "lucide-react"
import { LiveActivityFeed } from "@/components/realtime/live-activity-feed"
import { UserPresence } from "@/components/realtime/user-presence"
import { ConnectionStatus } from "@/components/realtime/connection-status"
import { useRealtime } from "@/lib/hooks/use-realtime"
import { useEffect } from "react"

export default function EquipeDetalhesPage() {
  const { subscribeToRoom, unsubscribeFromRoom } = useRealtime()

  useEffect(() => {
    subscribeToRoom("team:team_123")
    return () => unsubscribeFromRoom("team:team_123")
  }, [subscribeToRoom, unsubscribeFromRoom])

  return (
    <div className="flex min-h-screen flex-col px-4 py-6">
      <header className="mb-6 flex items-center justify-between">
        <div className="flex items-center">
          <Link href="/equipes" className="mr-4">
            <ArrowLeft className="h-6 w-6" />
          </Link>
          <h1 className="text-xl font-bold">Detalhes da Equipe</h1>
        </div>
        <button>
          <MoreVertical className="h-6 w-6" />
        </button>
        <ConnectionStatus />
      </header>

      <div className="space-y-6">
        {/* Team Header */}
        <section className="rounded-lg bg-white/5 p-6">
          <div className="flex items-center gap-4">
            <div className="h-16 w-16 rounded-lg bg-gradient-to-r from-red-500 to-orange-500 flex items-center justify-center">
              <span className="text-2xl font-bold">DW</span>
            </div>
            <div className="flex-1">
              <h2 className="text-xl font-bold">Dev Web</h2>
              <p className="text-sm text-gray-400">Equipe de desenvolvimento web</p>
              <div className="mt-2 flex items-center gap-3">
                <span className="rounded-full bg-green-500 px-2 py-0.5 text-xs font-medium">Ativo</span>
                <span className="text-xs text-gray-400">Criado em 15/03/2023</span>
              </div>
            </div>
          </div>

          <div className="mt-6 flex gap-2">
            <Button variant="outline" size="sm" className="flex-1">
              <MessageSquare className="mr-2 h-4 w-4" />
              Chat
            </Button>
            <Button variant="outline" size="sm" className="flex-1">
              <Calendar className="mr-2 h-4 w-4" />
              Agenda
            </Button>
            <Button variant="outline" size="sm" className="flex-1">
              <Settings className="mr-2 h-4 w-4" />
              Configurações
            </Button>
          </div>
        </section>

        {/* Invitation Sender */}
        <section>
          <InvitationSender
            teamId="team_123"
            teamName="Dev Web"
            inviterName="Luís Gabriel"
            inviterEmail="luis.gabriel@unifimes.edu.br"
            onInvitationSent={(email) => {
              console.log("Invitation sent to:", email)
            }}
          />
        </section>

        {/* Team Members */}
        <section className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold">
              <Users className="mr-2 inline-block h-5 w-5" />
              Membros
            </h2>
            <Button variant="outline" size="sm">
              <UserPlus className="mr-2 h-4 w-4" />
              Gerenciar
            </Button>
          </div>

          <div className="space-y-3 rounded-lg bg-white/5 p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-full bg-red-500"></div>
                <div>
                  <p className="font-medium">Luís Gabriel</p>
                  <p className="text-xs text-gray-400">Estudante • Desenvolvedor Frontend</p>
                </div>
              </div>
              <span className="rounded-full bg-purple-500 px-2 py-0.5 text-xs font-medium">Líder</span>
              <UserPresence userId="user1" size="sm" />
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-full bg-blue-500"></div>
                <div>
                  <p className="font-medium">Vitor Joáz</p>
                  <p className="text-xs text-gray-400">Estudante • Desenvolvedor Backend</p>
                </div>
              </div>
              <span className="rounded-full bg-blue-500 px-2 py-0.5 text-xs font-medium">Membro</span>
              <UserPresence userId="user2" size="sm" />
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-full bg-green-500"></div>
                <div>
                  <p className="font-medium">Ana Carolina</p>
                  <p className="text-xs text-gray-400">Professora • Orientadora</p>
                </div>
              </div>
              <span className="rounded-full bg-orange-500 px-2 py-0.5 text-xs font-medium">Mentor</span>
              <UserPresence userId="user3" size="sm" />
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-full bg-yellow-500"></div>
                <div>
                  <p className="font-medium">Marcos Oliveira</p>
                  <p className="text-xs text-gray-400">Estudante • UX/UI Designer</p>
                </div>
              </div>
              <span className="rounded-full bg-blue-500 px-2 py-0.5 text-xs font-medium">Membro</span>
              <UserPresence userId="user4" size="sm" />
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-full bg-purple-500"></div>
                <div>
                  <p className="font-medium">Juliana Santos</p>
                  <p className="text-xs text-gray-400">Estudante • QA Tester</p>
                </div>
              </div>
              <span className="rounded-full bg-blue-500 px-2 py-0.5 text-xs font-medium">Membro</span>
              <UserPresence userId="user5" size="sm" />
            </div>

            <Button variant="ghost" size="sm" className="w-full">
              Ver todos os membros
              <ChevronRight className="ml-1 h-4 w-4" />
            </Button>
          </div>
        </section>

        {/* Team Projects */}
        <section className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold">
              <Briefcase className="mr-2 inline-block h-5 w-5" />
              Projetos
            </h2>
            <Button variant="outline" size="sm">
              <Plus className="mr-2 h-4 w-4" />
              Novo Projeto
            </Button>
          </div>

          <div className="space-y-3">
            <Link href="/projetos/1">
              <div className="rounded-lg border border-white/10 bg-white/5 p-4 transition-colors hover:bg-white/10">
                <div className="flex items-start justify-between mb-2">
                  <h3 className="font-semibold">Sistema de Gestão Integrada</h3>
                  <span className="rounded-full bg-blue-500 px-2 py-0.5 text-xs font-medium">Em andamento</span>
                </div>
                <p className="mb-2 text-sm text-gray-300">
                  Desenvolvimento de um sistema integrado para gestão empresarial.
                </p>
                <div className="flex items-center justify-between text-xs text-gray-400">
                  <span>Prazo: 30/11/2023</span>
                  <span>75% concluído</span>
                </div>
                <div className="mt-2 h-1 bg-white/10 rounded-full overflow-hidden">
                  <div className="h-full w-3/4 bg-gradient-to-r from-red-500 to-orange-500 rounded-full"></div>
                </div>
              </div>
            </Link>

            <Link href="/projetos/3">
              <div className="rounded-lg border border-white/10 bg-white/5 p-4 transition-colors hover:bg-white/10">
                <div className="flex items-start justify-between mb-2">
                  <h3 className="font-semibold">Portal Acadêmico</h3>
                  <span className="rounded-full bg-green-500 px-2 py-0.5 text-xs font-medium">Concluído</span>
                </div>
                <p className="mb-2 text-sm text-gray-300">
                  Desenvolvimento de portal para acesso a informações acadêmicas.
                </p>
                <div className="flex items-center justify-between text-xs text-gray-400">
                  <span>Finalizado: 10/04/2023</span>
                  <span>100% concluído</span>
                </div>
                <div className="mt-2 h-1 bg-white/10 rounded-full overflow-hidden">
                  <div className="h-full w-full bg-green-500 rounded-full"></div>
                </div>
              </div>
            </Link>

            <Link href="/projetos/4">
              <div className="rounded-lg border border-white/10 bg-white/5 p-4 transition-colors hover:bg-white/10">
                <div className="flex items-start justify-between mb-2">
                  <h3 className="font-semibold">E-commerce Responsivo</h3>
                  <span className="rounded-full bg-yellow-500 px-2 py-0.5 text-xs font-medium">Planejamento</span>
                </div>
                <p className="mb-2 text-sm text-gray-300">
                  Desenvolvimento de loja virtual com design responsivo e PWA.
                </p>
                <div className="flex items-center justify-between text-xs text-gray-400">
                  <span>Início: 15/06/2023</span>
                  <span>10% concluído</span>
                </div>
                <div className="mt-2 h-1 bg-white/10 rounded-full overflow-hidden">
                  <div className="h-full w-[10%] bg-gradient-to-r from-red-500 to-orange-500 rounded-full"></div>
                </div>
              </div>
            </Link>
          </div>
        </section>

        {/* Team Skills */}
        <section className="space-y-4">
          <h2 className="text-lg font-semibold">Habilidades da Equipe</h2>

          <div className="flex flex-wrap gap-2 rounded-lg bg-white/5 p-4">
            <span className="rounded-full bg-white/10 px-3 py-1 text-sm">React</span>
            <span className="rounded-full bg-white/10 px-3 py-1 text-sm">Node.js</span>
            <span className="rounded-full bg-white/10 px-3 py-1 text-sm">TypeScript</span>
            <span className="rounded-full bg-white/10 px-3 py-1 text-sm">Next.js</span>
            <span className="rounded-full bg-white/10 px-3 py-1 text-sm">Tailwind CSS</span>
            <span className="rounded-full bg-white/10 px-3 py-1 text-sm">UI/UX Design</span>
            <span className="rounded-full bg-white/10 px-3 py-1 text-sm">MongoDB</span>
            <span className="rounded-full bg-white/10 px-3 py-1 text-sm">PostgreSQL</span>
            <span className="rounded-full bg-white/10 px-3 py-1 text-sm">Git</span>
            <span className="rounded-full bg-white/10 px-3 py-1 text-sm">Figma</span>
          </div>
        </section>

        {/* Live Activity Feed */}
        <section>
          <LiveActivityFeed roomId="team:team_123" limit={5} />
        </section>
      </div>
    </div>
  )
}
