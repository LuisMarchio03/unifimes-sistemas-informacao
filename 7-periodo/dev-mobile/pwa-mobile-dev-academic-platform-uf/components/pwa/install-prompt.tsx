"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { CheckCircle, Download, X } from "lucide-react"
import { cn } from "@/lib/utils"

interface BeforeInstallPromptEvent extends Event {
  prompt(): Promise<void>
  userChoice: Promise<{ outcome: "accepted" | "dismissed" }>
}

interface InstallPromptProps {
  className?: string
  position?: "top" | "bottom" 
  appearance?: "banner" | "floating" | "minimal"
  autoDismiss?: boolean
  autoDismissDelay?: number
}

export function InstallPrompt({
  className,
  position = "bottom",
  appearance = "floating",
  autoDismiss = true,
  autoDismissDelay = 30000
}: InstallPromptProps) {
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null)
  const [showPrompt, setShowPrompt] = useState(false)
  const [installationStatus, setInstallationStatus] = useState<"idle" | "installing" | "installed" | "dismissed">("idle")

  useEffect(() => {
    // Verificar se já está instalado
    if (typeof window !== 'undefined' && (
      window.matchMedia('(display-mode: standalone)').matches ||
      window.navigator.standalone
    )) {
      return // Já está instalado, não mostrar prompt
    }

    // Verificar se já foi dispensado recentemente
    try {
      const lastDismissed = localStorage.getItem('installPromptDismissed')
      if (lastDismissed) {
        const dismissedTime = parseInt(lastDismissed, 10)
        const dayInMs = 24 * 60 * 60 * 1000
        
        if (Date.now() - dismissedTime < dayInMs) {
          // Foi dispensado nas últimas 24h
          return
        }
      }
    } catch (error) {
      console.error("Erro ao verificar histórico de dispensa:", error)
    }

    // Capturar o evento de BeforeInstallPrompt
    const handleBeforeInstallPrompt = (e: Event) => {
      e.preventDefault()
      setDeferredPrompt(e as BeforeInstallPromptEvent)
      
      // Mostrar após um curto delay para não interferir com a interação inicial
      setTimeout(() => {
        setShowPrompt(true)
      }, 3000)
    }

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt)

    // Auto dismiss
    let dismissTimeout: ReturnType<typeof setTimeout>
    if (autoDismiss) {
      dismissTimeout = setTimeout(() => {
        setShowPrompt(false)
      }, autoDismissDelay)
    }

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt)
      if (dismissTimeout) clearTimeout(dismissTimeout)
    }
  }, [autoDismiss, autoDismissDelay])

  // Após a instalação, capturar o evento 'appinstalled'
  useEffect(() => {
    const handleAppInstalled = () => {
      setInstallationStatus("installed")
      setShowPrompt(false)
      
      // Mostrar mensagem de sucesso brevemente
      setTimeout(() => {
        setInstallationStatus("idle")
      }, 3000)
    }

    window.addEventListener('appinstalled', handleAppInstalled)
    
    return () => {
      window.removeEventListener('appinstalled', handleAppInstalled)
    }
  }, [])

  const handleInstall = async () => {
    if (!deferredPrompt) return
    
    setInstallationStatus("installing")
    
    try {
      await deferredPrompt.prompt()
      const { outcome } = await deferredPrompt.userChoice
      
      if (outcome === "accepted") {
        setInstallationStatus("installed")
        setShowPrompt(false)
        
        // Limpar o deferredPrompt
        setDeferredPrompt(null)
        
        // Esconder após 3s de mostrar o sucesso
        setTimeout(() => {
          setInstallationStatus("idle")
        }, 3000)
      } else {
        setInstallationStatus("dismissed")
        setShowPrompt(false)
        
        // Guardar timestamp de quando foi dispensado
        try {
          localStorage.setItem('installPromptDismissed', Date.now().toString())
        } catch (error) {
          console.error("Erro ao salvar estado de dispensa:", error)
        }
        
        // Voltar ao idle após um breve período
        setTimeout(() => {
          setInstallationStatus("idle")
        }, 2000)
      }
    } catch (error) {
      console.error('Erro ao instalar o aplicativo:', error)
      setInstallationStatus("idle")
    }
  }

  const handleDismiss = () => {
    setShowPrompt(false)
    
    // Guardar timestamp de quando foi dispensado
    try {
      localStorage.setItem('installPromptDismissed', Date.now().toString())
    } catch (error) {
      console.error("Erro ao salvar estado de dispensa:", error)
    }
  }

  // Não mostrar nada se não tiver um prompt disponível ou se não estiver visível
  if (!showPrompt && installationStatus !== "installed" && installationStatus !== "installing") {
    return null
  }

  // Renderizar diferentes aparências
  if (appearance === "minimal") {
    return (
      <div
        className={cn(
          "fixed z-50 p-2 flex items-center",
          position === "top" ? "top-0 inset-x-0" : "bottom-4 right-4",
          className
        )}
      >
        <Button 
          size="sm" 
          variant="outline" 
          onClick={handleInstall}
          disabled={installationStatus !== "idle"}
          className="bg-background/90 backdrop-blur-sm border-gray-700"
        >
          {installationStatus === "installing" ? (
            <span className="flex items-center">Instalando...</span>
          ) : installationStatus === "installed" ? (
            <span className="flex items-center"><CheckCircle className="h-4 w-4 mr-2" /> Instalado</span>
          ) : (
            <span className="flex items-center"><Download className="h-4 w-4 mr-2" /> Instalar App</span>
          )}
        </Button>
      </div>
    )
  }

  if (appearance === "floating") {
    return (
      <div
        className={cn(
          "fixed z-50 m-4 p-4 rounded-lg shadow-lg bg-background/90 backdrop-blur-sm border border-gray-700",
          position === "top" ? "top-0 inset-x-0" : "bottom-0 inset-x-0 sm:bottom-4 sm:right-4 sm:left-auto sm:max-w-md",
          "animate-in slide-in-from-bottom fade-in duration-300",
          className
        )}
      >
        <div className="flex justify-between items-start">
          <div className="flex-1 mr-4">
            <h4 className="font-medium text-lg">Instale o aplicativo</h4>
            <p className="text-muted-foreground text-sm mt-1">
              Instale para acesso offline e experiência completa
            </p>
          </div>
          <Button variant="ghost" size="icon" onClick={handleDismiss} className="h-8 w-8">
            <X className="h-4 w-4" />
          </Button>
        </div>
        <div className="mt-4">
          <Button 
            onClick={handleInstall}
            disabled={installationStatus !== "idle"}
            className="w-full bg-primary"
          >
            {installationStatus === "installing" ? (
              <span className="flex items-center">Instalando...</span>
            ) : installationStatus === "installed" ? (
              <span className="flex items-center"><CheckCircle className="h-4 w-4 mr-2" /> Instalado</span>
            ) : (
              <span className="flex items-center"><Download className="h-4 w-4 mr-2" /> Instalar Agora</span>
            )}
          </Button>
        </div>
      </div>
    )
  }

  // Banner (default)
  return (
    <div
      className={cn(
        "fixed z-50 inset-x-0 p-4 flex items-center justify-between bg-background/90 backdrop-blur-sm border-gray-700",
        position === "top" ? "top-0 border-b" : "bottom-0 border-t",
        "animate-in slide-in-from-bottom fade-in duration-300",
        className
      )}
    >
      <div className="flex-1 mr-4">
        <p className="text-sm font-medium">
          Instale o aplicativo para melhor experiência
        </p>
      </div>
      <div className="flex items-center gap-2">
        <Button variant="ghost" size="sm" onClick={handleDismiss}>
          <X className="h-4 w-4 mr-1" /> Dispensar
        </Button>
        <Button 
          size="sm" 
          onClick={handleInstall}
          disabled={installationStatus !== "idle"}
        >
          {installationStatus === "installing" ? (
            <span className="flex items-center">Instalando...</span>
          ) : installationStatus === "installed" ? (
            <span className="flex items-center"><CheckCircle className="h-4 w-4 mr-2" /> Instalado</span>
          ) : (
            <span className="flex items-center"><Download className="h-4 w-4 mr-2" /> Instalar</span>
          )}
        </Button>
      </div>
    </div>
  )
}
