"use client"

import { useState } from "react"
import { Copy } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
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
}

interface DuplicateTemplateDialogProps {
  template: Template | null
  open: boolean
  onOpenChange: (open: boolean) => void
  onConfirm: (newName: string) => void
}

export function DuplicateTemplateDialog({ template, open, onOpenChange, onConfirm }: DuplicateTemplateDialogProps) {
  const [newName, setNewName] = useState("")

  const handleConfirm = () => {
    if (newName.trim()) {
      onConfirm(newName.trim())
      setNewName("")
    }
  }

  if (!template) return null

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle className="flex items-center space-x-2">
            <Copy className="h-5 w-5" />
            <span>Duplicar Template</span>
          </DialogTitle>
          <DialogDescription>Crie uma cópia do template "{template.name}" com um novo nome.</DialogDescription>
        </DialogHeader>

        <div className="py-4">
          <label className="block text-sm font-medium mb-2">Nome do novo template</label>
          <Input
            value={newName}
            onChange={(e) => setNewName(e.target.value)}
            placeholder={`${template.name} - Cópia`}
            onKeyPress={(e) => e.key === "Enter" && handleConfirm()}
          />
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancelar
          </Button>
          <Button onClick={handleConfirm} disabled={!newName.trim()}>
            Duplicar Template
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
