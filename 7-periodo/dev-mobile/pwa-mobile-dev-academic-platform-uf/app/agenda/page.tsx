"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Calendar, Clock, MapPin, Users, Plus, ChevronLeft, ChevronRight, ArrowLeft } from "lucide-react"
import { useAuthStore } from "@/lib/stores/auth-store"
import { AddEventModal } from "@/components/agenda/add-event-modal"
import Link from "next/link"

// Definindo a interface para os eventos
interface Event {
  id: string;
  time: string;
  title: string;
  description: string;
  location: string;
  type: string;
  participants: number;
  duration: string;
  date: Date;
}

export default function AgendaPage() {
  const { user } = useAuthStore()
  const [currentDate, setCurrentDate] = useState(new Date())
  const [addEventModalOpen, setAddEventModalOpen] = useState(false)
  const [viewMode, setViewMode] = useState<"day" | "week" | "month">("day")
  const [events, setEvents] = useState<Event[]>([])

  // Carregar eventos do localStorage ao iniciar
  useEffect(() => {
    const storedEvents = localStorage.getItem('events')
    if (storedEvents) {
      try {
        // Converter as strings de data de volta para objetos Date
        const parsedEvents = JSON.parse(storedEvents).map((event: any) => ({
          ...event,
          date: new Date(event.date)
        }))
        setEvents(parsedEvents)
      } catch (error) {
        console.error('Erro ao carregar eventos:', error)
      }
    } else {
      // Inicializar com eventos de exemplo se não houver dados salvos
      setEvents(getInitialEvents())
    }
  }, [])

  // Salvar eventos no localStorage quando mudam
  useEffect(() => {
    if (events.length > 0) {
      localStorage.setItem('events', JSON.stringify(events))
    }
  }, [events])

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
    if (viewMode === "day") {
      newDate.setDate(newDate.getDate() + (direction === "next" ? 1 : -1))
    } else if (viewMode === "week") {
      newDate.setDate(newDate.getDate() + (direction === "next" ? 7 : -7))
    } else {
      newDate.setMonth(newDate.getMonth() + (direction === "next" ? 1 : -1))
    }
    setCurrentDate(newDate)
  }

  // Função para obter eventos iniciais de exemplo
  const getInitialEvents = (): Event[] => {
    const today = new Date()
    const tomorrow = new Date(today)
    tomorrow.setDate(tomorrow.getDate() + 1)
    const dayAfterTomorrow = new Date(today)
    dayAfterTomorrow.setDate(dayAfterTomorrow.getDate() + 2)

    if (user?.role === "admin") {
      return [
        {
          id: '1',
          time: "09:00",
          title: "Reunião de Planejamento",
          description: "Revisão dos projetos do semestre",
          location: "Sala de Reuniões",
          type: "meeting",
          participants: 8,
          duration: "2h",
          date: today,
        },
        {
          id: '2',
          time: "14:00",
          title: "Avaliação de Projetos",
          description: "Análise de propostas de novos projetos",
          location: "Online",
          type: "review",
          participants: 3,
          duration: "1h30",
          date: tomorrow,
        },
        {
          id: '3',
          time: "16:30",
          title: "Entrevista com Candidatos",
          description: "Seleção para projeto de IA",
          location: "Sala 201",
          type: "interview",
          participants: 2,
          duration: "45min",
          date: dayAfterTomorrow,
        },
      ]
    } else if (user?.role === "professor") {
      // ... eventos para professor (similar ao código existente, mas com datas)
      return []
    } else {
      // ... eventos para alunos (similar ao código existente, mas com datas)
      return []
    }
  }

  // Filtrar eventos com base na data atual e no modo de visualização
  const getFilteredEvents = () => {
    return events.filter(event => {
      const eventDate = new Date(event.date)
      
      if (viewMode === "day") {
        // Comparar apenas ano, mês e dia
        return eventDate.getFullYear() === currentDate.getFullYear() &&
               eventDate.getMonth() === currentDate.getMonth() &&
               eventDate.getDate() === currentDate.getDate()
      } else if (viewMode === "week") {
        // Obter o início e fim da semana atual
        const startOfWeek = new Date(currentDate)
        startOfWeek.setDate(currentDate.getDate() - currentDate.getDay())
        const endOfWeek = new Date(startOfWeek)
        endOfWeek.setDate(startOfWeek.getDate() + 6)
        
        return eventDate >= startOfWeek && eventDate <= endOfWeek
      } else { // month
        // Comparar apenas ano e mês
        return eventDate.getFullYear() === currentDate.getFullYear() &&
               eventDate.getMonth() === currentDate.getMonth()
      }
    }).sort((a, b) => {
      // Ordenar por hora
      return a.time.localeCompare(b.time)
    })
  }

  const getTypeColor = (type: string) => {
    const colors = {
      meeting: "bg-blue-500/20 text-blue-400 border-blue-500/30",
      review: "bg-purple-500/20 text-purple-400 border-purple-500/30",
      interview: "bg-green-500/20 text-green-400 border-green-500/30",
      class: "bg-orange-500/20 text-orange-400 border-orange-500/30",
      guidance: "bg-yellow-500/20 text-yellow-400 border-yellow-500/30",
      project: "bg-red-500/20 text-red-400 border-red-500/30",
      team: "bg-cyan-500/20 text-cyan-400 border-cyan-500/30",
      deadline: "bg-red-500/20 text-red-400 border-red-500/30",
    }
    return colors[type as keyof typeof colors] || "bg-gray-500/20 text-gray-400 border-gray-500/30"
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

  const getTypeLabel = (type: string) => {
    const labels = {
      meeting: "Reunião",
      review: "Avaliação",
      interview: "Entrevista",
      class: "Aula",
      guidance: "Orientação",
      project: "Projeto",
      team: "Equipe",
      deadline: "Prazo",
    }
    return labels[type as keyof typeof labels] || type
  }

  const handleEventAdded = (newEvent: Event) => {
    setEvents(prevEvents => [...prevEvents, newEvent])
  }

  const handleDeleteEvent = (eventId: string) => {
    setEvents(prevEvents => prevEvents.filter(event => event.id !== eventId))
  }

  const filteredEvents = getFilteredEvents()

  return (
    <div className="flex min-h-screen flex-col">
      {/* Header */}
      <header className="border-b border-white/10 px-4 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link href="/home">
              <Button variant="ghost" size="sm">
                <ArrowLeft className="h-4 w-4" />
              </Button>
            </Link>
            <div>
              <h1 className="text-xl font-bold">Agenda</h1>
              <p className="text-sm text-gray-400">Gerencie seus eventos e compromissos</p>
            </div>
          </div>
          <Button onClick={() => setAddEventModalOpen(true)}>
            <Plus className="mr-2 h-4 w-4" />
            Novo Evento
          </Button>
        </div>
      </header>

      <main className="flex-1 px-4 py-6 space-y-6">
        {/* View Controls */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Button variant={viewMode === "day" ? "default" : "outline"} size="sm" onClick={() => setViewMode("day")}>
              Dia
            </Button>
            <Button variant={viewMode === "week" ? "default" : "outline"} size="sm" onClick={() => setViewMode("week")}>
              Semana
            </Button>
            <Button
              variant={viewMode === "month" ? "default" : "outline"}
              size="sm"
              onClick={() => setViewMode("month")}
            >
              Mês
            </Button>
          </div>
          <Button variant="outline" size="sm" onClick={() => setCurrentDate(new Date())}>
            Hoje
          </Button>
        </div>

        {/* Date Navigation */}
        <div className="flex items-center justify-between">
          <Button variant="outline" size="sm" onClick={() => navigateDate("prev")}>
            <ChevronLeft className="h-4 w-4" />
            Anterior
          </Button>
          <h2 className="text-lg font-semibold capitalize">{formatDate(currentDate)}</h2>
          <Button variant="outline" size="sm" onClick={() => navigateDate("next")}>
            Próximo
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="rounded-lg border border-white/10 bg-white/5 p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-400">Eventos {viewMode === "day" ? "Hoje" : viewMode === "week" ? "na Semana" : "no Mês"}</p>
                <p className="text-2xl font-bold">{filteredEvents.length}</p>
              </div>
              <Calendar className="h-8 w-8 text-blue-400" />
            </div>
          </div>
          <div className="rounded-lg border border-white/10 bg-white/5 p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-400">Horas Ocupadas</p>
                <p className="text-2xl font-bold">
                  {filteredEvents.reduce((total, item) => {
                    const duration = item.duration;
                    const hours = duration.includes('h') ? parseInt(duration.split('h')[0]) : 0;
                    const minutes = duration.includes('min') ? 
                      parseInt(duration.split('min')[0].includes('h') ? 
                        duration.split('h')[1].trim() : 
                        duration) : 0;
                    return total + hours + (minutes / 60);
                  }, 0).toFixed(1)}h
                </p>
              </div>
              <Clock className="h-8 w-8 text-green-400" />
            </div>
          </div>
          <div className="rounded-lg border border-white/10 bg-white/5 p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-400">Participantes</p>
                <p className="text-2xl font-bold">
                  {filteredEvents.reduce((total, item) => total + item.participants, 0)}
                </p>
              </div>
              <Users className="h-8 w-8 text-purple-400" />
            </div>
          </div>
        </div>

        {/* Events List */}
        <div className="space-y-4">
          <h3 className="text-lg font-semibold">Eventos {viewMode === "day" ? "do Dia" : viewMode === "week" ? "da Semana" : "do Mês"}</h3>
          {filteredEvents.length === 0 ? (
            <div className="text-center py-12">
              <Calendar className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-400 mb-4">Nenhum evento agendado para {viewMode === "day" ? "hoje" : viewMode === "week" ? "esta semana" : "este mês"}</p>
              <Button onClick={() => setAddEventModalOpen(true)}>
                <Plus className="mr-2 h-4 w-4" />
                Adicionar Primeiro Evento
              </Button>
            </div>
          ) : (
            <div className="space-y-3">
              {filteredEvents.map((item) => (
                <div
                  key={item.id}
                  className={`rounded-lg border p-4 transition-colors hover:bg-white/5 ${getTypeColor(item.type)}`}
                >
                  <div className="flex items-start gap-4">
                    <div className="text-sm font-mono text-gray-400 min-w-[60px]">
                      {item.time}
                      <div className="text-xs text-gray-500">{item.duration}</div>
                    </div>
                    <div className="flex-1">
                      <div className="flex items-start justify-between mb-2">
                        <h4 className="font-semibold">{item.title}</h4>
                        <div
                          className={`rounded-full px-3 py-1 text-xs flex items-center gap-1 ${getTypeColor(item.type)}`}
                        >
                          {getTypeIcon(item.type)}
                          {getTypeLabel(item.type)}
                        </div>
                      </div>
                      <p className="text-sm text-gray-300 mb-3">{item.description}</p>
                      <div className="flex items-center gap-6 text-xs text-gray-400">
                        <span className="flex items-center gap-1">
                          <MapPin className="h-3 w-3" />
                          {item.location}
                        </span>
                        <span className="flex items-center gap-1">
                          <Users className="h-3 w-3" />
                          {item.participants} {item.participants === 1 ? "participante" : "participantes"}
                        </span>
                        <span className="flex items-center gap-1">
                          <Clock className="h-3 w-3" />
                          {item.duration}
                        </span>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      {/* <Button variant="ghost" size="sm">
                        Editar
                      </Button> */}
                      <Button 
                        variant="ghost" 
                        size="sm" 
                        className="text-red-400 hover:text-red-300"
                        onClick={() => handleDeleteEvent(item.id)}
                      >
                        Excluir
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Quick Actions */}
        <div className="rounded-lg border border-white/10 bg-white/5 p-6">
          <h3 className="text-lg font-semibold mb-4">Ações Rápidas</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Button variant="outline" className="h-16 flex-col gap-2" onClick={() => setAddEventModalOpen(true)}>
              <Plus className="h-5 w-5" />
              <span className="text-sm">Novo Evento</span>
            </Button>
            {/* <Button variant="outline" className="h-16 flex-col gap-2"> */}
              {/* <Calendar className="h-5 w-5" />
              <span className="text-sm">Sincronizar Calendário</span>
            </Button> */}
          </div>
        </div>
      </main>

      <AddEventModal
        open={addEventModalOpen}
        onOpenChange={setAddEventModalOpen}
        selectedDate={currentDate}
        onEventAdded={handleEventAdded}
      />
    </div>
  )
}
