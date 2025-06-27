"use client"

import { useState, useEffect } from 'react'

type ConnectionStatus = 'online' | 'offline' | 'unknown'
type SyncStatus = 'idle' | 'syncing' | 'completed' | 'error'

interface UseConnectionReturn {
  isOnline: boolean
  connectionStatus: ConnectionStatus
  syncStatus: SyncStatus
  lastOnline: Date | null
  pendingActions: number
}

export function useConnection(): UseConnectionReturn {
  const [connectionStatus, setConnectionStatus] = useState<ConnectionStatus>('unknown')
  const [syncStatus, setSyncStatus] = useState<SyncStatus>('idle')
  const [lastOnline, setLastOnline] = useState<Date | null>(null)
  const [pendingActions, setPendingActions] = useState<number>(0)

  useEffect(() => {
    // Inicializa o estado com a condição de rede atual
    const updateOnlineStatus = () => {
      const isOnline = typeof navigator !== 'undefined' ? navigator.onLine : false
      
      setConnectionStatus(isOnline ? 'online' : 'offline')
      
      if (isOnline) {
        setLastOnline(new Date())
      }
    }

    // Carrega o número de ações pendentes do localStorage
    const loadPendingActions = () => {
      if (typeof window !== 'undefined') {
        const offlineData = JSON.parse(localStorage.getItem('offlineChanges') || '[]')
        setPendingActions(offlineData.length)
      }
    }

    // Handlers para os eventos de online/offline
    const handleOnline = () => {
      setConnectionStatus('online')
      setLastOnline(new Date())
      setSyncStatus('syncing')
      
      // Simular a conclusão da sincronização após um pequeno delay
      setTimeout(() => {
        setSyncStatus('completed')
        setPendingActions(0)
        // Reset para idle depois de um tempo
        setTimeout(() => setSyncStatus('idle'), 3000)
      }, 2000)
    }

    const handleOffline = () => {
      setConnectionStatus('offline')
    }

    // Handlers para eventos personalizados
    const handleAppOnline = () => handleOnline()
    const handleAppOffline = () => handleOffline()

    // Configurar todos os listeners
    if (typeof window !== 'undefined') {
      updateOnlineStatus()
      loadPendingActions()
      
      window.addEventListener('online', handleOnline)
      window.addEventListener('offline', handleOffline)
      document.addEventListener('app-online', handleAppOnline)
      document.addEventListener('app-offline', handleAppOffline)
      
      // Criar um intervalo para verificar periodicamente as ações pendentes
      const intervalId = setInterval(loadPendingActions, 30000)

      // Cleanup
      return () => {
        window.removeEventListener('online', handleOnline)
        window.removeEventListener('offline', handleOffline)
        document.removeEventListener('app-online', handleAppOnline)
        document.removeEventListener('app-offline', handleAppOffline)
        clearInterval(intervalId)
      }
    }
  }, [])

  return {
    isOnline: connectionStatus === 'online',
    connectionStatus,
    syncStatus,
    lastOnline,
    pendingActions
  }
}

// Helper para salvar dados para sincronização posterior
export function saveForOfflineSync(action: string, data: any): void {
  if (typeof window !== 'undefined') {
    try {
      const offlineChanges = JSON.parse(localStorage.getItem('offlineChanges') || '[]')
      
      offlineChanges.push({
        id: `${Date.now()}-${Math.random().toString(36).substring(2, 9)}`,
        timestamp: new Date().toISOString(),
        action,
        data
      })
      
      localStorage.setItem('offlineChanges', JSON.stringify(offlineChanges))
      
      // Disparar evento para atualizar contadores, etc.
      document.dispatchEvent(new CustomEvent('offline-change-saved'))
      
      // Removido o return true
    } catch (error) {
      console.error('Falha ao salvar dados offline:', error)
      // Removido o return false
    }
  }
  // Removido o return false
}
