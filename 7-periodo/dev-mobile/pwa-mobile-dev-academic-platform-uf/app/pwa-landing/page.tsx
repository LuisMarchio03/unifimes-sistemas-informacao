"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import {
  Download,
  Smartphone,
  Zap,
  Wifi,
  Bell,
  Users,
  BookOpen,
  Target,
  CheckCircle,
  ArrowRight,
  Monitor,
  Tablet,
} from "lucide-react"
import Link from "next/link"

interface BeforeInstallPromptEvent extends Event {
  prompt(): Promise<void>
  userChoice: Promise<{ outcome: "accepted" | "dismissed" }>
}

export default function PWALandingPage() {  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null)
  const [isInstallable, setIsInstallable] = useState(false)
  const [isInstalled, setIsInstalled] = useState(false)
  const [installInstructions, setInstallInstructions] = useState("")
  const [browser, setBrowser] = useState("")
  const [platform, setPlatform] = useState("")

  useEffect(() => {
    // Detectar se o app está instalado
    if (typeof window !== 'undefined' && window.matchMedia("(display-mode: standalone)").matches) {
      setIsInstalled(true)
    }

    // Detectar navegador e plataforma
    const detectBrowser = () => {
      const userAgent = navigator.userAgent.toLowerCase();
      if (userAgent.includes('chrome') || userAgent.includes('chromium')) return 'Chrome';
      if (userAgent.includes('firefox')) return 'Firefox';
      if (userAgent.includes('safari') && !userAgent.includes('chrome')) return 'Safari';
      if (userAgent.includes('edge') || userAgent.includes('edg')) return 'Edge';
      if (userAgent.includes('opera') || userAgent.includes('opr')) return 'Opera';
      return 'Desconhecido';
    };

    const detectPlatform = () => {
      if (/iPhone|iPad|iPod/i.test(navigator.userAgent)) return 'iOS';
      if (/Android/i.test(navigator.userAgent)) return 'Android';
      return 'Desktop';
    };

    const browser = detectBrowser();
    const platform = detectPlatform();
    
    setBrowser(browser);
    setPlatform(platform);

    // Ajustar instruções de instalação com base no navegador e plataforma
    if (platform === 'iOS' && browser === 'Safari') {
      setInstallInstructions("Toque no ícone de compartilhamento e selecione 'Adicionar à Tela de Início'");
    } else if (platform === 'Android') {
      setInstallInstructions("Toque no menu (três pontos) e selecione 'Adicionar à tela inicial'");
    } else {
      setInstallInstructions("Clique no botão de instalação quando disponível");
    }

    // Escutar o evento de instalação
    const handleBeforeInstallPrompt = (e: Event) => {
      e.preventDefault()
      setDeferredPrompt(e as BeforeInstallPromptEvent)
      setIsInstallable(true)
      console.log("App pode ser instalado!")
    }

    window.addEventListener("beforeinstallprompt", handleBeforeInstallPrompt)

    return () => {
      window.removeEventListener("beforeinstallprompt", handleBeforeInstallPrompt)
    }
  }, [])

  const handleInstallClick = async () => {
    if (!deferredPrompt) {
      // Se o deferredPrompt não estiver disponível, mostrar instruções manuais
      const message = `Para instalar manualmente no ${browser} (${platform}):\n${installInstructions}`;
      alert(message);
      return;
    }

    // Se o deferredPrompt estiver disponível, mostrar prompt de instalação
    deferredPrompt.prompt()
    const { outcome } = await deferredPrompt.userChoice

    if (outcome === "accepted") {
      setIsInstalled(true)
      console.log("App instalado com sucesso!")
    } else {
      console.log("Instalação recusada pelo usuário")
    }

    setDeferredPrompt(null)
    setIsInstallable(false)
  }

  const features = [
    {
      icon: <Zap className="h-6 w-6" />,
      title: "Acesso Instantâneo",
      description: "Abra a plataforma diretamente da sua tela inicial, sem navegador",
    },
    // {
    //   icon: <Wifi className="h-6 w-6" />,
    //   title: "Funciona Offline",
    //   description: "Continue trabalhando mesmo sem conexão com a internet",
    // },
    {
      icon: <Bell className="h-6 w-6" />,
      title: "Notificações Push",
      description: "Receba alertas importantes sobre projetos e prazos",
    },
    {
      icon: <Users className="h-6 w-6" />,
      title: "Colaboração em Tempo Real",
      description: "Trabalhe em equipe com sincronização instantânea",
    },
    {
      icon: <BookOpen className="h-6 w-6" />,
      title: "Gestão de Projetos",
      description: "Organize e acompanhe todos os seus projetos acadêmicos",
    },
    {
      icon: <Target className="h-6 w-6" />,
      title: "Metas e Objetivos",
      description: "Defina e monitore suas metas de aprendizado",
    },
  ]

  const installSteps = [
    {
      icon: <Download className="h-5 w-5" />,
      title: "Clique em Instalar",
      description: "Use o botão abaixo ou o ícone na barra do navegador",
    },
    {
      icon: <CheckCircle className="h-5 w-5" />,
      title: "Confirme a Instalação",
      description: "Aceite a instalação quando solicitado pelo navegador",
    },
    {
      icon: <Smartphone className="h-5 w-5" />,
      title: "Acesse da Tela Inicial",
      description: "Encontre o ícone na sua área de trabalho ou tela inicial",
    },
  ]

  if (isInstalled) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-900 flex items-center justify-center p-4">
        <Card className="w-full max-w-md bg-white/5 border-white/10">
          <CardContent className="p-8 text-center">
            <div className="mb-6">
              <div className="mx-auto h-16 w-16 rounded-full bg-gradient-to-r from-green-500 to-emerald-500 flex items-center justify-center mb-4">
                <CheckCircle className="h-8 w-8 text-white" />
              </div>
              <h1 className="text-2xl font-bold text-white mb-2">App Instalado!</h1>
              <p className="text-gray-400">A Plataforma Acadêmica foi instalada com sucesso</p>
            </div>

            <Link href="/home">
              <Button size="lg" className="w-full">
                Abrir Aplicativo
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-900">
      {/* Hero Section */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-red-500/20 to-orange-500/20" />
        <div className="relative container mx-auto px-4 py-16 lg:py-24">
          <div className="text-center max-w-4xl mx-auto">
            <div className="mb-8">
              <div className="mx-auto h-20 w-20 rounded-full bg-gradient-to-r from-red-500 to-orange-500 flex items-center justify-center mb-6">
                <span className="text-2xl font-bold text-white">UF</span>
              </div>
            </div>

            <h1 className="text-4xl lg:text-6xl font-bold text-white mb-6">
              Plataforma Acadêmica
              <span className="block text-transparent bg-clip-text bg-gradient-to-r from-red-400 to-orange-400">
                Sempre ao Seu Alcance
              </span>
            </h1>

            <p className="text-xl text-gray-300 mb-8 max-w-2xl mx-auto">
              Instale nossa plataforma como um aplicativo e tenha acesso instantâneo a todos os seus projetos, equipes e
              metas acadêmicas, mesmo offline.
            </p>            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-6">
              <Button 
                size="lg" 
                onClick={handleInstallClick} 
                className="px-8 py-4 text-lg bg-gradient-to-r from-red-500 to-orange-500 hover:from-red-600 hover:to-orange-600"
              >
                <Download className="mr-2 h-5 w-5" />
                Instalar Aplicativo
              </Button>

              <Link href="/login">
                <Button variant="outline" size="lg" className="px-8 py-4 text-lg">
                  Continuar no Navegador
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </Link>
            </div>
            
            <div className="mb-12 text-center max-w-lg mx-auto">
              {!isInstallable && (
                <div className="bg-white/10 border border-white/20 rounded-lg p-4 text-left">
                  <p className="text-sm text-gray-300 mb-2">
                    <strong>Dica de instalação para {browser} em {platform}:</strong>
                  </p>
                  <p className="text-sm text-gray-300">{installInstructions}</p>
                </div>
              )}
            </div>

            {/* Device Preview */}
            <div className="flex justify-center items-center gap-8 mb-16">
              {/* <div className="hidden sm:flex items-center gap-2 text-gray-400">
                <Monitor className="h-5 w-5" />
                <span className="text-sm">Desktop</span>
              </div> */}
              <div className="flex items-center gap-2 text-gray-400">
                <Tablet className="h-5 w-5" />
                <span className="text-sm">Tablet</span>
              </div>
              <div className="flex items-center gap-2 text-gray-400">
                <Smartphone className="h-5 w-5" />
                <span className="text-sm">Mobile</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 lg:py-24">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl lg:text-4xl font-bold text-white mb-4">Por que instalar como aplicativo?</h2>
            <p className="text-xl text-gray-400 max-w-2xl mx-auto">
              Desfrute de uma experiência nativa com recursos avançados
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <Card key={index} className="bg-white/5 border-white/10 hover:bg-white/10 transition-colors">
                <CardContent className="p-6">
                  <div className="flex items-center gap-4 mb-4">
                    <div className="p-2 rounded-lg bg-gradient-to-r from-red-500/20 to-orange-500/20 text-red-400">
                      {feature.icon}
                    </div>
                    <h3 className="text-lg font-semibold text-white">{feature.title}</h3>
                  </div>
                  <p className="text-gray-400">{feature.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Installation Steps */}
      <section className="py-16 lg:py-24 bg-white/5">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl lg:text-4xl font-bold text-white mb-4">Como instalar?</h2>
            <p className="text-xl text-gray-400">Processo simples em apenas 3 passos</p>
          </div>

          <div className="max-w-4xl mx-auto">
            <div className="grid md:grid-cols-3 gap-8">
              {installSteps.map((step, index) => (
                <div key={index} className="text-center">
                  <div className="relative mb-6">
                    <div className="mx-auto w-16 h-16 rounded-full bg-gradient-to-r from-red-500 to-orange-500 flex items-center justify-center text-white font-bold text-xl">
                      {index + 1}
                    </div>
                    {index < installSteps.length - 1 && (
                      <div className="hidden md:block absolute top-8 left-full w-full h-0.5 bg-gradient-to-r from-red-500/50 to-orange-500/50 transform -translate-x-8" />
                    )}
                  </div>
                  <div className="mb-4 flex justify-center text-red-400">{step.icon}</div>
                  <h3 className="text-lg font-semibold text-white mb-2">{step.title}</h3>
                  <p className="text-gray-400">{step.description}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 lg:py-24">
        <div className="container mx-auto px-4 text-center">
          <div className="max-w-2xl mx-auto">
            <h2 className="text-3xl lg:text-4xl font-bold text-white mb-6">Pronto para começar?</h2>
            <p className="text-xl text-gray-400 mb-8">Instale agora e tenha a melhor experiência acadêmica</p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              {isInstallable ? (
                <Button size="lg" onClick={handleInstallClick} className="px-8 py-4 text-lg">
                  <Download className="mr-2 h-5 w-5" />
                  Instalar Agora
                </Button>
              ) : (
                <Link href="/home">
                  <Button size="lg" className="px-8 py-4 text-lg">
                    Acessar Plataforma
                    <ArrowRight className="ml-2 h-5 w-5" />
                  </Button>
                </Link>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-white/10 py-8">
        <div className="container mx-auto px-4 text-center">
          <p className="text-gray-400">© 2024 Plataforma Acadêmica. Desenvolvido para estudantes e educadores.</p>
        </div>
      </footer>
    </div>
  )
}
