"use client"

import type React from "react"

import { useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Plus } from "lucide-react"
import { useAuthStore } from "@/lib/stores/auth-store"
import { toast } from "sonner"

interface AddEventModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  selectedDate: Date
  onEventAdded: (event: any) => void
}

export function AddEventModal({ open, onOpenChange, selectedDate, onEventAdded }: AddEventModalProps) {
  const { user } = useAuthStore()
  const [isLoading, setIsLoading] = useState(false)
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    time: "",
    duration: "",
    location: "",
    type: "",
    participants: "1",
  })

  const getEventTypes = () => {
    if (user?.role === "admin") {
      return [
        { value: "meeting", label: "Reunião" },
        { value: "review", label: "Avaliação" },
        { value: "interview", label: "Entrevista" },
        { value: "planning", label: "Planejamento" },
      ]
    } else if (user?.role === "professor") {
      return [
        { value: "class", label: "Aula" },
        { value: "guidance", label: "Orientação" },
        { value: "project", label: "Projeto" },
        { value: "meeting", label: "Reunião" },
      ]
    } else {
      return [
        { value: "team", label: "Equipe" },
        { value: "deadline", label: "Prazo" },
        { value: "review", label: "Revisão" },
        { value: "study", label: "Estudo" },
      ]
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000))

      // Criar novo evento com ID único
      const newEvent = {
        ...formData,
        id: Date.now().toString(),
        date: selectedDate,
        userId: user?.id,
        participants: parseInt(formData.participants),
      }

      // Aqui você normalmente salvaria no backend
      console.log("New event:", newEvent)

      toast.success("Evento adicionado com sucesso!")
      onEventAdded(newEvent)
      onOpenChange(false)

      // Reset form
      setFormData({
        title: "",
        description: "",
        time: "",
        duration: "",
        location: "",
        type: "",
        participants: "1",
      })
    } catch (error) {
      toast.error("Erro ao adicionar evento")
    } finally {
      setIsLoading(false)
    }
  }

  const formatDate = (date: Date) => {
    return date.toLocaleDateString("pt-BR", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    })
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md sm:max-w-lg md:max-w-xl max-h-[90vh">
        <DialogHeader className="pb-4">
          <DialogTitle className="flex items-center gap-2">
            <Plus className="h-5 w-5" />
            Adicionar Evento
          </DialogTitle>
        </DialogHeader>

        <ScrollArea className="pr-4 max-h-[calc(80vh-120px)]">
          <form onSubmit={handleSubmit} className="space-y-4 px-1">
            <div className="text-sm text-gray-400 capitalize">{formatDate(selectedDate)}</div>

            <div className="space-y-2">
              <Label htmlFor="title">Título do Evento</Label>
              <Input
                id="title"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                placeholder="Digite o título do evento"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Descrição</Label>
              <Textarea
                id="description"
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                placeholder="Descreva o evento"
                rows={3}
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="time">Horário</Label>
                <Input
                  id="time"
                  type="time"
                  value={formData.time}
                  onChange={(e) => setFormData({ ...formData, time: e.target.value })}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="duration">Duração</Label>
                <Select
                  value={formData.duration}
                  onValueChange={(value) => setFormData({ ...formData, duration: value })}
                  required
                >
                  <SelectTrigger id="duration">
                    <SelectValue placeholder="Duração" />
                  </SelectTrigger>
                  <SelectContent position="popper" className="max-h-[200px] overflow-y-auto">
                    <SelectItem value="30min">30 minutos</SelectItem>
                    <SelectItem value="1h">1 hora</SelectItem>
                    <SelectItem value="1h30">1h 30min</SelectItem>
                    <SelectItem value="2h">2 horas</SelectItem>
                    <SelectItem value="3h">3 horas</SelectItem>
                    <SelectItem value="4h">4 horas</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="type">Tipo de Evento</Label>
              <Select 
                value={formData.type} 
                onValueChange={(value) => setFormData({ ...formData, type: value })}
                required
              >
                <SelectTrigger id="type">
                  <SelectValue placeholder="Selecione o tipo" />
                </SelectTrigger>
                <SelectContent position="popper" className="max-h-[200px] overflow-y-auto">
                  {getEventTypes().map((type) => (
                    <SelectItem key={type.value} value={type.value}>
                      {type.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="location">Local</Label>
              <Input
                id="location"
                value={formData.location}
                onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                placeholder="Local do evento"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="participants">Número de Participantes</Label>
              <Input
                id="participants"
                type="number"
                min="1"
                value={formData.participants}
                onChange={(e) => setFormData({ ...formData, participants: e.target.value })}
                required
              />
            </div>

            <div className="flex gap-3 pt-4 pb-2">
              <Button type="button" variant="outline" onClick={() => onOpenChange(false)} className="flex-1">
                Cancelar
              </Button>
              <Button type="submit" disabled={isLoading} className="flex-1">
                {isLoading ? "Salvando..." : "Salvar Evento"}
              </Button>
            </div>
          </form>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  )
}
