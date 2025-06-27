"use client"

import { useRealtimeMessages } from "@/lib/hooks/use-realtime"
import type { WSMessage } from "@/lib/websocket/types"
import { formatDistanceToNow } from "date-fns"
import { ptBR } from "date-fns/locale"
import { CheckCircle, Users, FileText, UserPlus, Activity, Clock } from "lucide-react"

interface LiveActivityFeedProps {
  roomId?: string
  limit?: number
}

export function LiveActivityFeed({ roomId, limit = 10 }: LiveActivityFeedProps) {
  const allMessages = useRealtimeMessages()

  // Filter messages by room if specified
  const messages = roomId ? allMessages.filter((msg) => msg.roomId === roomId) : allMessages

  // Get recent activity messages (exclude heartbeat and connection messages)
  const activityMessages = messages
    .filter((msg) => !["heartbeat", "connection", "disconnection"].includes(msg.type))
    .slice(-limit)
    .reverse()

  const getActivityIcon = (type: string) => {
    switch (type) {
      case "task_updated":
      case "task_created":
        return <CheckCircle className="h-4 w-4 text-blue-500" />
      case "team_member_joined":
      case "team_member_left":
        return <Users className="h-4 w-4 text-green-500" />
      case "project_updated":
        return <FileText className="h-4 w-4 text-purple-500" />
      case "user_online":
      case "user_offline":
        return <UserPlus className="h-4 w-4 text-yellow-500" />
      default:
        return <Activity className="h-4 w-4 text-gray-500" />
    }
  }

  const getActivityDescription = (message: WSMessage) => {
    switch (message.type) {
      case "task_updated":
        return `Tarefa "${message.payload.taskId}" foi atualizada`
      case "task_created":
        return `Nova tarefa "${message.payload.changes?.title || "sem título"}" foi criada`
      case "team_member_joined":
        return `Novo membro entrou na equipe`
      case "team_member_left":
        return `Membro saiu da equipe`
      case "project_updated":
        return `Projeto foi atualizado`
      case "user_online":
        return `${message.payload.userId} ficou online`
      case "user_offline":
        return `${message.payload.userId} ficou offline`
      case "notification":
        return message.payload.message
      default:
        return `Atividade: ${message.type}`
    }
  }

  if (activityMessages.length === 0) {
    return (
      <div className="rounded-lg border border-white/10 bg-white/5 p-4">
        <div className="flex items-center gap-2 mb-3">
          <Activity className="h-4 w-4" />
          <h3 className="font-medium">Atividade em Tempo Real</h3>
        </div>
        <p className="text-sm text-gray-400">Nenhuma atividade recente</p>
      </div>
    )
  }

  return (
    <div className="rounded-lg border border-white/10 bg-white/5 p-4">
      <div className="flex items-center gap-2 mb-3">
        <Activity className="h-4 w-4" />
        <h3 className="font-medium">Atividade em Tempo Real</h3>
        <div className="h-2 w-2 bg-green-500 rounded-full animate-pulse" />
      </div>

      <div className="space-y-3">
        {activityMessages.map((message) => (
          <div key={message.id} className="flex items-start gap-3">
            {getActivityIcon(message.type)}
            <div className="flex-1 min-w-0">
              <p className="text-sm text-gray-300">{getActivityDescription(message)}</p>
              <div className="flex items-center gap-1 mt-1">
                <Clock className="h-3 w-3 text-gray-500" />
                <span className="text-xs text-gray-500">
                  {formatDistanceToNow(message.timestamp, {
                    addSuffix: true,
                    locale: ptBR,
                  })}
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
