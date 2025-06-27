"use client"

import { usePathname } from "next/navigation"
import { InstallPrompt } from "./install-prompt"
import { useEffect, useState } from "react"

export function PWAPromptContainer() {
  const pathname = usePathname()
  const [shouldShow, setShouldShow] = useState(false)
  
  useEffect(() => {
    // Não exibir o prompt na página de pwa-landing ou offline
    if (
      pathname === "/pwa-landing" || 
      pathname === "/offline" ||
      pathname === "/"
    ) {
      setShouldShow(false)
      return
    }
    
    // Verificar se é um PWA
    const isPWA = 
      window.matchMedia('(display-mode: standalone)').matches || 
      (window.navigator as any)['standalone'] || 
      document.referrer.includes('android-app://');
    
    // Se já for um PWA, não mostrar o prompt
    if (isPWA) {
      setShouldShow(false)
      return
    }
    
    // Verificar se o prompt já foi dispensado recentemente
    try {
      const lastDismissed = localStorage.getItem('installPromptDismissed')
      if (lastDismissed) {
        const dismissedTime = parseInt(lastDismissed, 10)
        const dayInMs = 24 * 60 * 60 * 1000
        
        if (Date.now() - dismissedTime < dayInMs) {
          // Foi dispensado nas últimas 24h
          setShouldShow(false)
          return
        }
      }
    } catch (error) {
      console.error("Erro ao verificar histórico de dispensa:", error)
    }
    
    // Mostrar o prompt após um delay para não atrapalhar a interação inicial
    const timeoutId = setTimeout(() => {
      setShouldShow(true)
    }, 5000)
    
    return () => clearTimeout(timeoutId)
  }, [pathname])
  
  if (!shouldShow) return null
  
  return <InstallPrompt appearance="minimal" position="bottom" />
}
