"use client"

import { AlertTriangle } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"

interface Template {
  id: string
  name: string
  usageCount: number
}

interface DeleteTemplateDialogProps {
  template: Template | null
  open: boolean
  onOpenChange: (open: boolean) => void
  onConfirm: () => void
}

export function DeleteTemplateDialog({ template, open, onOpenChange, onConfirm }: DeleteTemplateDialogProps) {
  if (!template) return null

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle className="flex items-center space-x-2">
            <AlertTriangle className="h-5 w-5 text-destructive" />
            <span>Excluir Template</span>
          </DialogTitle>
          <DialogDescription>Tem certeza que deseja excluir o template "{template.name}"?</DialogDescription>
        </DialogHeader>

        <div className="py-4">
          <div className="rounded-lg border border-destructive/20 bg-destructive/10 p-4">
            <h4 className="font-semibold text-destructive mb-2">Atenção!</h4>
            <ul className="space-y-1 text-sm text-gray-300">
              <li>• Esta ação não pode ser desfeita</li>
              <li>• O template foi usado em {template.usageCount} projetos</li>
              <li>• Projetos existentes não serão afetados</li>
              <li>• O template não estará mais disponível para novos projetos</li>
            </ul>
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancelar
          </Button>
          <Button variant="destructive" onClick={onConfirm}>
            Excluir Template
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
