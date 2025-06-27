"use client"

import { useConnection } from "@/hooks/use-connection"
import { Wifi, WifiOff, RefreshCw } from "lucide-react"
import { useState, useEffect } from "react"
import { cn } from "@/lib/utils"

interface ConnectionStatusProps {
  className?: string
}

export function ConnectionStatus({ className }: ConnectionStatusProps) {
  const { isOnline, connectionStatus, syncStatus, pendingActions } = useConnection()
  const [visible, setVisible] = useState(false)
  const [expanded, setExpanded] = useState(false)

  // Mostrar a barra de status quando mudar para offline ou houver sincronizações pendentes
  useEffect(() => {
    if (!isOnline || syncStatus === 'syncing' || pendingActions > 0) {
      setVisible(true)
      
      // Auto-expandir em caso de sync
      if (syncStatus === 'syncing') {
        setExpanded(true)
      }
      
      // Auto-esconder após sync completa
      if (syncStatus === 'completed' && pendingActions === 0) {
        const timer = setTimeout(() => setVisible(false), 3000)
        return () => clearTimeout(timer)
      }
    } else if (connectionStatus !== 'unknown' && isOnline && pendingActions === 0) {
      // Esconder depois de um delay quando voltar online
      const timer = setTimeout(() => setVisible(false), 3000)
      return () => clearTimeout(timer)
    }
  }, [isOnline, syncStatus, pendingActions, connectionStatus])

  if (!visible) return null

  return (
    <div 
      className={cn(
        "fixed bottom-16 left-0 right-0 mx-auto w-full max-w-md z-50 px-4 transition-all duration-300",
        {
          "translate-y-0 opacity-100": visible,
          "translate-y-20 opacity-0": !visible
        },
        className
      )}
      onClick={() => setExpanded(!expanded)}
    >
      <div className="bg-black border border-gray-800 rounded-lg shadow-lg p-4 flex flex-col">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            {isOnline ? (
              <Wifi className="h-5 w-5 text-green-500" />
            ) : (
              <WifiOff className="h-5 w-5 text-yellow-500" />
            )}
            <span className="font-medium">
              {isOnline ? "Online" : "Trabalhando offline"}
            </span>
          </div>
          
          {syncStatus === 'syncing' && (
            <RefreshCw className="h-4 w-4 text-blue-400 animate-spin" />
          )}
          
          {pendingActions > 0 && isOnline && (
            <span className="text-xs bg-blue-600 text-white px-2 py-0.5 rounded-full">
              Sincronizando {pendingActions} {pendingActions === 1 ? 'item' : 'itens'}
            </span>
          )}
        </div>
        
        {expanded && (
          <div className="mt-3 pt-3 border-t border-gray-800 text-sm text-gray-400">
            {!isOnline ? (
              <div>
                <p>Suas alterações serão salvas localmente e sincronizadas quando você voltar a ficar online.</p>
                {pendingActions > 0 && (
                  <div className="mt-2">
                    <div className="text-yellow-500 font-medium">
                      {pendingActions} {pendingActions === 1 ? 'alteração pendente' : 'alterações pendentes'}
                    </div>
                  </div>
                )}
              </div>
            ) : syncStatus === 'syncing' ? (
              <p>Sincronizando dados... Por favor, aguarde.</p>
            ) : pendingActions > 0 ? (
              <p>Sincronização pendente para {pendingActions} {pendingActions === 1 ? 'item' : 'itens'}.</p>
            ) : (
              <p>Todos os dados estão sincronizados.</p>
            )}
            
            <div className="mt-2 text-xs opacity-70">
              Toque para {expanded ? 'minimizar' : 'expandir'}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
