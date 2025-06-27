"use client"

import dynamic from 'next/dynamic'

// Importação dinâmica do componente para evitar problemas com SSR
const ConnectionStatus = dynamic(
  () => import('@/components/pwa/connection-status').then(mod => mod.ConnectionStatus),
  { ssr: false }
)

export function ConnectionStatusWrapper() {
  return <ConnectionStatus />
}
