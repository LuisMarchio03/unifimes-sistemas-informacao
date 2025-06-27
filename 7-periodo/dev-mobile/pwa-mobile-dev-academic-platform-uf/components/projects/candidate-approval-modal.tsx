"use client"

import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { useState } from "react"

interface CandidateApprovalModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  candidates: Array<{
    id: string
    name: string
    role?: string
  }>
  projectTitle: string
  onApprove: (candidateId: string) => void
}

export function CandidateApprovalModal({
  open,
  onOpenChange,
  candidates,
  projectTitle,
  onApprove
}: CandidateApprovalModalProps) {
  const [isLoading, setIsLoading] = useState(false)

  const handleApprove = async (candidateId: string) => {
    setIsLoading(true)
    try {
      await onApprove(candidateId)
    } catch (error) {
      console.error("Erro ao aprovar candidato:", error)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px] bg-gray-900 text-white border-white/10">
        <DialogHeader>
          <DialogTitle>Candidaturas Pendentes</DialogTitle>
          <DialogDescription className="text-gray-300">
            Gerencie as candidaturas para o projeto <span className="font-semibold text-white">{projectTitle}</span>.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-3 my-4">
          {candidates.length === 0 ? (
            <div className="text-center text-gray-400 text-sm p-4">
              Não há candidaturas pendentes para este projeto.
            </div>
          ) : (
            candidates.map((candidate) => (
              <div key={candidate.id} className="flex items-center justify-between rounded-lg border border-white/10 bg-white/5 p-3">
                <div>
                  <p className="font-medium text-sm">{candidate.name}</p>
                  {candidate.role && (
                    <p className="text-xs text-gray-400">{candidate.role}</p>
                  )}
                </div>
                <div className="flex gap-2">
                  <Button 
                    variant="default" 
                    size="sm" 
                    onClick={() => handleApprove(candidate.id)} 
                    disabled={isLoading}
                  >
                    Aprovar
                  </Button>
                  <Button 
                    variant="outline" 
                    size="sm"
                    disabled={isLoading}
                  >
                    Ver perfil
                  </Button>
                </div>
              </div>
            ))
          )}
        </div>

        <DialogFooter>
          <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
            Fechar
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
