"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { useConnection } from "@/hooks/use-connection"
import { 
  WifiOff, 
  RefreshCw, 
  Search, 
  ArrowRight, 
  Calendar, 
  FileText, 
  Users, 
  BookOpen
} from "lucide-react"

interface CachedResource {
  url: string
  displayName: string
  icon: React.ReactNode
}

export function OfflinePage() {
  const { isOnline, connectionStatus } = useConnection()
  const [cachedPages, setCachedPages] = useState<CachedResource[]>([])
  const [loading, setLoading] = useState(true)
  const [refreshing, setRefreshing] = useState(false)

  // Grupos de recursos que seriam úteis offline
  const resourceGroups = [
    {
      title: "Projetos",
      icon: <FileText className="h-5 w-5" />,
      links: [
        { name: "Meus Projetos", path: "/projetos" },
        { name: "Gerenciar Projetos", path: "/projetos/gerenciar" },
        { name: "Novo Projeto", path: "/projetos/novo" }
      ]
    },
    {
      title: "Agenda",
      icon: <Calendar className="h-5 w-5" />,
      links: [
        { name: "Minha Agenda", path: "/agenda" },
      ]
    },
    {
      title: "Equipes",
      icon: <Users className="h-5 w-5" />,
      links: [
        { name: "Minhas Equipes", path: "/equipes" },
        { name: "Nova Equipe", path: "/equipes/nova" },
      ]
    },
    {
      title: "Aprendizado",
      icon: <BookOpen className="h-5 w-5" />,
      links: [
        { name: "Metas", path: "/metas" },
        { name: "Documentos Colaborativos", path: "/colaborativo" },
      ]
    },
  ]

  // Checar recursos disponíveis em cache ao carregar
  useEffect(() => {
    async function checkCachedResources() {
      setLoading(true)
      
      try {
        // Se estiver online, não precisamos verificar cache
        if (isOnline) {
          setCachedPages([])
          setLoading(false)
          return
        }
      
        // Caso contrário, vamos verificar o cache do service worker
        const cache = await caches.open('plataforma-academica-v2')
        const keys = await cache.keys()
        
        // Mapear URLs para recursos mais amigáveis
        const resources: CachedResource[] = keys
          .filter(request => {
            // Filtrar apenas URLs que queremos mostrar para o usuário
            const url = new URL(request.url)
            const path = url.pathname
            
            // Ignorar assets e arquivos estáticos
            const isAsset = path.endsWith('.js') || 
                           path.endsWith('.css') || 
                           path.endsWith('.png') || 
                           path.endsWith('.jpg') ||
                           path.endsWith('.svg') ||
                           path.endsWith('.json') ||
                           path.includes('_next/static')
            
            return !isAsset
          })
          .map(request => {
            // Converter para um formato amigável para exibição
            const url = new URL(request.url)
            const path = url.pathname
            
            // Mapear caminhos para exibições amigáveis
            let displayName = "Página"
            let icon = <FileText className="h-5 w-5" />
            
            if (path === "/") {
              displayName = "Página Inicial"
            } else if (path === "/login") {
              displayName = "Login"
            } else if (path.includes("projetos")) {
              displayName = "Projetos"
              icon = <FileText className="h-5 w-5" />
            } else if (path.includes("equipes")) {
              displayName = "Equipes"
              icon = <Users className="h-5 w-5" />
            } else if (path.includes("agenda")) {
              displayName = "Agenda"
              icon = <Calendar className="h-5 w-5" />
            } else if (path.includes("metas")) {
              displayName = "Metas"
            } else if (path.includes("perfil")) {
              displayName = "Perfil"
            }
            
            return {
              url: request.url,
              displayName,
              icon
            }
          })
        
        setCachedPages(resources)
      } catch (error) {
        console.error('Erro ao verificar cache:', error)
        setCachedPages([])
      } finally {
        setLoading(false)
      }
    }
    
    checkCachedResources()
  }, [isOnline, connectionStatus])

  // Função para atualizar a página e tentar reconectar
  const handleRefresh = () => {
    setRefreshing(true)
    window.location.reload()
  }

  // Se estiver online, redirecionamos automaticamente
  if (isOnline) {
    return (
      <div className="min-h-screen bg-black flex flex-col items-center justify-center p-6">
        <div className="w-16 h-16 rounded-full bg-green-500/20 flex items-center justify-center mb-6">
          <RefreshCw className="h-8 w-8 text-green-500 animate-spin" />
        </div>
        <h1 className="text-2xl font-bold text-white mb-2">Conexão detectada!</h1>
        <p className="text-gray-400 mb-8 text-center">
          Você está online novamente. Redirecionando...
        </p>
        <Link href="/home">
          <Button>Ir para Home</Button>
        </Link>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-black">
      {/* Cabeçalho */}
      <header className="p-6 flex flex-col items-center border-b border-gray-800">
        <div className="w-16 h-16 rounded-full bg-orange-500/20 flex items-center justify-center mb-6">
          <WifiOff className="h-8 w-8 text-orange-500" />
        </div>
        <h1 className="text-2xl font-bold text-white mb-2">Você está offline</h1>
        <p className="text-gray-400 mb-6 text-center">
          Não foi possível conectar-se à internet. Você ainda pode acessar conteúdo offline.
        </p>
        <Button 
          onClick={handleRefresh} 
          className="flex items-center"
          disabled={refreshing}
        >
          <RefreshCw className={`h-4 w-4 mr-2 ${refreshing ? 'animate-spin' : ''}`} />
          {refreshing ? 'Atualizando...' : 'Tentar reconectar'}
        </Button>
      </header>

      {/* Busca Offline */}
      <div className="p-6 border-b border-gray-800">
        <div className="relative max-w-md mx-auto">
          <Search className="h-4 w-4 absolute left-3 top-3 text-gray-500" />
          <input 
            type="text" 
            placeholder="Buscar em conteúdo offline..." 
            className="w-full pl-10 pr-4 py-2 bg-gray-900 rounded-md border border-gray-800 focus:outline-none focus:ring-1 focus:ring-orange-500 text-white text-sm"
            disabled={loading}
          />
        </div>
      </div>

      {/* Conteúdo em cache */}
      <div className="p-6">
        <h2 className="text-xl font-semibold mb-4 text-white">Conteúdo disponível offline</h2>
        
        {loading ? (
          <div className="flex flex-col items-center justify-center p-6">
            <div className="w-10 h-10 rounded-full border-t-2 border-orange-500 animate-spin mb-4"></div>
            <p className="text-gray-400">Verificando conteúdo offline...</p>
          </div>
        ) : cachedPages.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
            {cachedPages.map((page, i) => (
              <a 
                key={i} 
                href={page.url} 
                className="flex items-center p-4 bg-gray-900 rounded-lg border border-gray-800 hover:bg-gray-800"
              >
                <div className="mr-4 bg-gray-800 p-2 rounded-md">
                  {page.icon}
                </div>
                <div>
                  <h3 className="font-medium text-white">{page.displayName}</h3>
                  <p className="text-sm text-gray-400">Disponível offline</p>
                </div>
              </a>
            ))}
          </div>
        ) : (
          <div className="bg-gray-900 rounded-lg p-6 mb-8 text-center border border-gray-800">
            <p className="text-gray-400 mb-2">
              Nenhum conteúdo disponível offline ainda. 
            </p>
            <p className="text-gray-500 text-sm">
              Visite páginas quando estiver online para acessá-las offline depois.
            </p>
          </div>
        )}

        {/* Seções de Recursos */}
        <h2 className="text-xl font-semibold mb-4 text-white">Áreas principais</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {resourceGroups.map((group, index) => (
            <div key={index} className="bg-gray-900 rounded-lg p-4 border border-gray-800">
              <div className="flex items-center mb-4">
                <div className="p-2 rounded-md bg-gray-800 mr-3">
                  {group.icon}
                </div>
                <h3 className="font-medium text-white">{group.title}</h3>
              </div>
              <div className="space-y-2">
                {group.links.map((link, linkIndex) => (
                  <Link
                    key={linkIndex}
                    href={link.path}
                    className="flex items-center justify-between p-2 rounded hover:bg-gray-800 text-gray-300 hover:text-white"
                  >
                    <span>{link.name}</span>
                    <ArrowRight className="h-4 w-4" />
                  </Link>
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* Dicas para uso offline */}
        <div className="mt-8 bg-gray-900 rounded-lg p-6 border border-gray-800">
          <h3 className="font-medium text-white mb-2">Dicas para uso offline</h3>
          <ul className="list-disc pl-5 space-y-1 text-gray-400 text-sm">
            <li>Os dados serão sincronizados automaticamente quando você voltar online</li>
            <li>Páginas visitadas anteriormente estarão disponíveis offline</li>
            <li>Você pode criar e editar projetos mesmo sem conexão</li>
            <li>Para forçar uma sincronização, use o botão "Reconectar" quando voltar online</li>
          </ul>
        </div>
      </div>

      {/* Rodapé */}
      <footer className="p-6 border-t border-gray-800 text-center">
        <p className="text-gray-500 text-sm">Plataforma Acadêmica - Versão Offline</p>
      </footer>
    </div>
  )
}
