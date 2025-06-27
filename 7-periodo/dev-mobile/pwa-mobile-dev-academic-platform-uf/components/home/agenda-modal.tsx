"use client"

import { useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Calendar, Clock, MapPin, Users, Plus, ChevronLeft, ChevronRight } from "lucide-react"
import { useAuthStore } from "@/lib/stores/auth-store"
import { AddEventModal } from "./add-event-modal"

interface AgendaModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function AgendaModal({ open, onOpenChange }: AgendaModalProps) {
  const { user } = useAuthStore()
  const [currentDate, setCurrentDate] = useState(new Date())
  const [addEventModalOpen, setAddEventModalOpen] = useState(false)

  const formatDate = (date: Date) => {
    return date.toLocaleDateString("pt-BR", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    })
  }

  const navigateDate = (direction: "prev" | "next") => {
    const newDate = new Date(currentDate)
    newDate.setDate(newDate.getDate() + (direction === "next" ? 1 : -1))
    setCurrentDate(newDate)
  }

  const getAgendaItems = () => {
    if (user?.role === "admin") {
      return [
        {
          time: "09:00",
          title: "Reunião de Planejamento",
          description: "Revisão dos projetos do semestre",
          location: "Sala de Reuniões",
          type: "meeting",
          participants: 8,
        },
        {
          time: "14:00",
          title: "Avaliação de Projetos",
          description: "Análise de propostas de novos projetos",
          location: "Online",
          type: "review",
          participants: 3,
        },
        {
          time: "16:30",
          title: "Entrevista com Candidatos",
          description: "Seleção para projeto de IA",
          location: "Sala 201",
          type: "interview",
          participants: 2,
        },
      ]
    } else if (user?.role === "professor") {
      return [
        {
          time: "08:00",
          title: "Aula de Programação",
          description: "Estruturas de Dados Avançadas",
          location: "Lab 1",
          type: "class",
          participants: 25,
        },
        {
          time: "10:30",
          title: "Orientação de TCC",
          description: "Reunião com orientandos",
          location: "Gabinete",
          type: "guidance",
          participants: 4,
        },
        {
          time: "15:00",
          title: "Reunião de Projeto",
          description: "Sistema de Gestão Integrada",
          location: "Online",
          type: "project",
          participants: 6,
        },
      ]
    } else {
      return [
        {
          time: "10:00",
          title: "Reunião de Equipe",
          description: "Sistema de Gestão Integrada",
          location: "Lab 2",
          type: "team",
          participants: 5,
        },
        {
          time: "14:00",
          title: "Entrega de Módulo",
          description: "Módulo de vendas - deadline",
          location: "Online",
          type: "deadline",
          participants: 1,
        },
        {
          time: "16:00",
          title: "Revisão de Código",
          description: "App Educacional",
          location: "Lab 3",
          type: "review",
          participants: 3,
        },
      ]
    }
  }

  const getTypeColor = (type: string) => {
    const colors = {
      meeting: "bg-blue-500/20 text-blue-400",
      review: "bg-purple-500/20 text-purple-400",
      interview: "bg-green-500/20 text-green-400",
      class: "bg-orange-500/20 text-orange-400",
      guidance: "bg-yellow-500/20 text-yellow-400",
      project: "bg-red-500/20 text-red-400",
      team: "bg-cyan-500/20 text-cyan-400",
      deadline: "bg-red-500/20 text-red-400",
    }
    return colors[type as keyof typeof colors] || "bg-gray-500/20 text-gray-400"
  }

  const getTypeIcon = (type: string) => {
    switch (type) {
      case "meeting":
      case "team":
        return <Users className="h-4 w-4" />
      case "class":
      case "guidance":
        return <Calendar className="h-4 w-4" />
      default:
        return <Clock className="h-4 w-4" />
    }
  }

  const handleEventAdded = () => {
    // Refresh agenda items or update state
    console.log("Event added, refreshing agenda...")
  }

  return (
    <>
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Calendar className="h-5 w-5" />
              Agenda
            </DialogTitle>
          </DialogHeader>

          <div className="space-y-6">
            {/* Date Navigation */}
            <div className="flex items-center justify-between">
              <Button variant="outline" size="sm" onClick={() => navigateDate("prev")}>
                <ChevronLeft className="h-4 w-4" />
              </Button>
              <h3 className="text-lg font-semibold capitalize">{formatDate(currentDate)}</h3>
              <Button variant="outline" size="sm" onClick={() => navigateDate("next")}>
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>

            {/* Agenda Items */}
            <div className="space-y-4">
              {getAgendaItems().map((item, index) => (
                <div key={index} className="rounded-lg border border-white/10 bg-white/5 p-4">
                  <div className="flex items-start gap-4">
                    <div className="text-sm font-mono text-gray-400 min-w-[50px]">{item.time}</div>
                    <div className="flex-1">
                      <div className="flex items-start justify-between mb-2">
                        <h4 className="font-semibold">{item.title}</h4>
                        <div
                          className={`rounded-full px-2 py-1 text-xs flex items-center gap-1 ${getTypeColor(item.type)}`}
                        >
                          {getTypeIcon(item.type)}
                          {item.type}
                        </div>
                      </div>
                      <p className="text-sm text-gray-300 mb-2">{item.description}</p>
                      <div className="flex items-center gap-4 text-xs text-gray-400">
                        <span className="flex items-center gap-1">
                          <MapPin className="h-3 w-3" />
                          {item.location}
                        </span>
                        <span className="flex items-center gap-1">
                          <Users className="h-3 w-3" />
                          {item.participants} {item.participants === 1 ? "participante" : "participantes"}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Add Event Button */}
            <Button className="w-full" variant="outline" onClick={() => setAddEventModalOpen(true)}>
              <Plus className="mr-2 h-4 w-4" />
              Adicionar Evento
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      <AddEventModal
        open={addEventModalOpen}
        onOpenChange={setAddEventModalOpen}
        selectedDate={currentDate}
        onEventAdded={handleEventAdded}
      />
    </>
  )
}
