"use client"

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'

export default function PWARedirect() {
  const router = useRouter()
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Função para detectar se estamos em um PWA
    const detectEnvironment = () => {
      // Verificar se é um PWA já instalado
      const isPWA = window.matchMedia('(display-mode: standalone)').matches 
                  || (window.navigator as any).standalone 
                  || document.referrer.includes('android-app://');
      
      // Verificar se é uma sessão já autenticada
      let isAuthenticated = false;
      try {
        isAuthenticated = localStorage.getItem('isLoggedIn') === 'true';
        // Adicione aqui outras verificações relevantes para autenticação
      } catch (e) {
        console.error('Erro ao verificar autenticação:', e);
      }
      
      // Verificar status de conexão
      const isOffline = !navigator.onLine;
      
      // Lógica de redirecionamento
      if (isOffline) {
        router.replace('/offline');
      } else if (isPWA && isAuthenticated) {
        router.replace('/home');
      } else if (isPWA) {
        router.replace('/login');
      } else {
        router.replace('/pwa-landing');
      }
      
      // Marcar como carregado
      setLoading(false);
    };
    
    // Pequeno delay para garantir que todas as APIs estejam disponíveis
    const timeoutId = setTimeout(detectEnvironment, 300);
    
    return () => clearTimeout(timeoutId);
  }, [router])

  // Enquanto o redirecionamento ocorre, mostra uma tela de carregamento
  return (
    <div className="h-screen w-full flex flex-col items-center justify-center bg-black">
      <div className="w-24 h-24 rounded-full border-t-4 border-red-500 animate-spin"></div>
      <p className="mt-6 text-white text-lg">Carregando...</p>
    </div>
  )
}
