"use client"

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'

export default function HomePage() {
  const router = useRouter()

  useEffect(() => {
    // Função para detectar se estamos rodando como PWA
    const detectPWA = () => {
      if (typeof window === 'undefined') return false;
      
      // Métodos de detecção:
      // 1. API matchMedia para display-mode: standalone
      const displayModeStandalone = window.matchMedia('(display-mode: standalone)').matches;
      
      // 2. Propriedade específica do Safari iOS
      const iOSStandalone = Boolean((window.navigator as any).standalone);
      
      // 3. Verificação de referrer para Android TWA
      const androidTWA = document.referrer.includes('android-app://');
      
      // 4. Verificar parâmetros de URL que indicam instalação
      const urlParams = new URLSearchParams(window.location.search);
      const fromInstall = urlParams.has('mode') && urlParams.get('mode') === 'pwa';
      
      // 5. Verificar localStorage para usuários que já usaram como PWA
      let storedPWAStatus = false;
      try {
        storedPWAStatus = localStorage.getItem('isPWA') === 'true';
      } catch (e) {
        console.error('Erro ao acessar localStorage:', e);
      }
      
      // Se qualquer método indicar PWA, armazenar no localStorage para persistência
      const isPWA = displayModeStandalone || iOSStandalone || androidTWA || fromInstall || storedPWAStatus;
      
      if (isPWA) {
        try {
          localStorage.setItem('isPWA', 'true');
        } catch (e) {
          console.error('Erro ao definir localStorage:', e);
        }
      }
      
      return isPWA;
    };
    
    // Verificar status de conexão
    const isOffline = typeof navigator !== 'undefined' && !navigator.onLine;
    
    // Verificar se já está autenticado
    const checkAuthAndRedirect = () => {
      const isPWA = detectPWA();
      
      // Verificar autenticação (simplificado - adapte conforme seu sistema de autenticação)
      let isAuthenticated = false;
      try {
        isAuthenticated = localStorage.getItem('isLoggedIn') === 'true';
      } catch (e) {
        console.error('Erro ao verificar autenticação:', e);
      }
      
      // Decidir para onde redirecionar
      if (isOffline) {
        // Se estiver offline, vá para a página offline
        router.replace('/offline');
      } else if (isPWA && isAuthenticated) {
        // Se for PWA e estiver autenticado, vá direto para home
        router.replace('/home');
      } else if (isPWA) {
        // Se for PWA mas não estiver autenticado, vá para login
        router.replace('/login');
      } else {
        // Se for navegador normal, vá para a landing do PWA
        router.replace('/pwa-landing');
      }
    };
    
    // Pequeno delay para garantir que a detecção funcione corretamente
    const timeoutId = setTimeout(checkAuthAndRedirect, 100);
    
    return () => clearTimeout(timeoutId);
  }, [router])

  // Tela de carregamento enquanto o redirecionamento acontece
  return (
    <div className="min-h-screen bg-black flex flex-col items-center justify-center">
      <div className="w-24 h-24 rounded-full bg-gradient-to-r from-red-500 to-orange-500 flex items-center justify-center">
        <span className="text-2xl font-bold text-white">UF</span>
      </div>
      <h1 className="text-2xl font-bold mt-6 mb-2 text-white">Plataforma Acadêmica</h1>
      <p className="text-gray-400">Carregando...</p>
    </div>
  )
}
