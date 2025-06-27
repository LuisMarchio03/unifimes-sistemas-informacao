/**
 * Utilitários para verificação e gerenciamento de recursos do PWA
 */

// Verifica se a aplicação está em execução como PWA
export function isPWA(): boolean {
  if (typeof window === 'undefined') return false;
  
  return (
    window.matchMedia('(display-mode: standalone)').matches ||
    (window.navigator as any).standalone === true ||
    document.referrer.includes('android-app://')
  );
}

// Verifica se o navegador suporta PWA
export function supportsPWA(): boolean {
  if (typeof window === 'undefined') return false;
  
  return (
    'serviceWorker' in navigator &&
    window.matchMedia('(display-mode: standalone)').media !== 'not all'
  );
}

// Verifica disponibilidade offline
export function canWorkOffline(): boolean {
  if (typeof window === 'undefined') return false;
  
  return (
    'serviceWorker' in navigator && 
    'caches' in window
  );
}

// Verificar se a versão do service worker está atualizada
export async function isServiceWorkerUpdated(): Promise<boolean> {
  if (typeof window === 'undefined') return false;
  
  if (!('serviceWorker' in navigator)) return false;
  
  try {
    const registrations = await navigator.serviceWorker.getRegistrations();
    for (const registration of registrations) {
      if (registration.waiting) {
        // Existe uma nova versão aguardando ativação
        return false;
      }
    }
    // Não há atualizações pendentes
    return true;
  } catch {
    return false;
  }
}

// Forçar atualização de service worker
export async function updateServiceWorker(): Promise<boolean> {
  if (typeof window === 'undefined') return false;
  
  if (!('serviceWorker' in navigator)) return false;
  
  try {
    const registrations = await navigator.serviceWorker.getRegistrations();
    let updated = false;
    
    for (const registration of registrations) {
      await registration.update();
      
      if (registration.waiting) {
        // Enviar mensagem para atualizar
        registration.waiting.postMessage({ type: 'SKIP_WAITING' });
        updated = true;
      }
    }
    
    if (updated) {
      // Recarregar a página para usar o novo service worker
      window.location.reload();
    }
    
    return updated;
  } catch {
    return false;
  }
}

// Salvar dados para sincronização quando offline
export function saveForOfflineSync(action: string, data: any): boolean {
  if (typeof window === 'undefined') return false;
  
  try {
    const offlineChanges = JSON.parse(localStorage.getItem('offlineChanges') || '[]');
    
    offlineChanges.push({
      id: `${Date.now()}-${Math.random().toString(36).substring(2, 9)}`,
      timestamp: new Date().toISOString(),
      action,
      data,
      synced: false
    });
    
    localStorage.setItem('offlineChanges', JSON.stringify(offlineChanges));
    
    // Disparar evento customizado
    window.dispatchEvent(new CustomEvent('offline-change-saved'));
    
    return true;
  } catch (error) {
    console.error('Falha ao salvar dados offline:', error);
    return false;
  }
}
