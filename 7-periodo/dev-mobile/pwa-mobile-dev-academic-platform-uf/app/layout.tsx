import type React from "react"
import { Inter } from "next/font/google"
import "./globals.css"
import { ThemeProvider } from "@/components/theme-provider"
import { Toaster } from "sonner"
import { RealtimeNotifications } from "@/components/realtime/realtime-notifications"
import { AppProvider } from "@/lib/hooks/use-app-context"
import { AuthProvider } from "@/lib/hooks/use-auth"
import Script from "next/script"
import { ConnectionStatusWrapper } from "@/components/pwa/connection-status-wrapper"
import { PWAPromptContainer } from "@/components/pwa/pwa-prompt-container"

const inter = Inter({ subsets: ["latin"] })

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="pt-BR" suppressHydrationWarning>
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no" />
        <meta name="theme-color" content="#000000" />
        <meta name="description" content="Plataforma para gerenciamento de projetos acadêmicos" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />
        <meta name="apple-mobile-web-app-title" content="Acadêmica" />
        <meta name="application-name" content="Acadêmica" />
        <meta name="format-detection" content="telephone=no" />
        <meta name="mobile-web-app-capable" content="yes" />
        <link rel="manifest" href="/manifest.webmanifest" />
        <link rel="icon" href="/favicon.ico" />
        <link rel="icon" type="image/svg+xml" href="/icon-192x192.svg" />
        <link rel="apple-touch-icon" href="/icon-192x192.svg" />
        <link rel="mask-icon" href="/icon-512x512.svg" color="#000000" />
      </head>
      <body className={`${inter.className} bg-black text-white antialiased`}>
        <ThemeProvider attribute="class" defaultTheme="dark" enableSystem={false} disableTransitionOnChange>
          <AuthProvider>
            <AppProvider>
              <main className="min-h-screen">{children}</main>
              <Toaster theme="dark" />
              <RealtimeNotifications />
              {/* Importamos dinamicamente o componente de status de conexão para evitar problemas SSR */}
              {typeof window !== 'undefined' && (
                <>
                  <ConnectionStatusWrapper />
                  <PWAPromptContainer />
                </>
              )}
            </AppProvider>
          </AuthProvider>
        </ThemeProvider>
        <Script id="register-service-worker" strategy="afterInteractive">
          {`
            // Registrar o Service Worker
            if ('serviceWorker' in navigator) {
              window.addEventListener('load', async function () {
                try {
                  const registration = await navigator.serviceWorker.register('/sw.js', { scope: '/' });
                  console.log('Service Worker registrado com sucesso:', registration.scope);
                  
                  // Verificar por atualizações do Service Worker
                  registration.addEventListener('updatefound', () => {
                    const newWorker = registration.installing;
                    console.log('Nova versão do Service Worker encontrada!');
                    
                    // Notificar o usuário sobre a atualização
                    if (newWorker) {
                      newWorker.addEventListener('statechange', () => {
                        if (newWorker.state === 'installed' && navigator.serviceWorker.controller) {
                          // Há uma nova versão pronta para usar
                          if (window.confirm('Uma nova versão está disponível! Deseja atualizar agora?')) {
                            window.location.reload();
                          }
                        }
                      });
                    }
                  });
                  
                  // Solicitar permissão para notificações
                  if ('Notification' in window) {
                    const permission = await Notification.requestPermission();
                    console.log('Permissão de notificação:', permission);
                  }
                  
                  // Registrar para sincronização em segundo plano
                  if ('sync' in registration) {
                    try {
                      await registration.sync.register('sync-updates');
                      console.log('Sincronização em segundo plano registrada');
                    } catch (error) {
                      console.error('Erro ao registrar sincronização:', error);
                    }
                  }
                  
                } catch (error) {
                  console.error('Falha ao registrar Service Worker:', error);
                }
              });
              
              // Detectar mudanças de conectividade
              window.addEventListener('online', () => {
                console.log('Online');
                document.dispatchEvent(new CustomEvent('app-online'));
                // Mostra notificação
                if ('Notification' in window && Notification.permission === 'granted') {
                  new Notification('Conexão restaurada', {
                    body: 'Você está online novamente. Seus dados estão sendo sincronizados.',
                    icon: '/icon-192x192.svg'
                  });
                }
              });
              
              window.addEventListener('offline', () => {
                console.log('Offline');
                document.dispatchEvent(new CustomEvent('app-offline'));
                // Mostra notificação
                if ('Notification' in window && Notification.permission === 'granted') {
                  new Notification('Sem conexão', {
                    body: 'Você está trabalhando offline. Suas mudanças serão sincronizadas quando a conexão for restaurada.',
                    icon: '/icon-192x192.svg'
                  });
                }
              });
            }
          `}
        </Script>
      </body>
    </html>
  )
}

export const metadata = {
  generator: 'v0.dev'
};
