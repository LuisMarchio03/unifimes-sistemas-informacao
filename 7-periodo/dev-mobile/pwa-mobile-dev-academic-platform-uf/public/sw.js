// Service worker avançado para a Plataforma Acadêmica PWA

const CACHE_NAME = 'plataforma-academica-v3';
// Versão atualizada para controle de cache
const DATA_CACHE_NAME = 'plataforma-academica-data-v1';
const STATIC_CACHE_NAME = 'plataforma-academica-static-v1';

const urlsToCache = [
  '/',
  '/home',
  '/pwa-landing',
  '/login',
  '/offline',
  '/offline.html',
  '/icon-192x192.svg',
  '/icon-512x512.svg',
  '/manifest.webmanifest',
  '/favicon.ico',
  '/images/screenshots/screenshot1.jpg',
  '/screenshot1.svg',
  '/images/icons/',
  '/_next/static/', // Importante para os arquivos do Next.js
];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => {
        return cache.addAll(urlsToCache);
      })
  );
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  const cacheWhitelist = [CACHE_NAME];
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          if (cacheWhitelist.indexOf(cacheName) === -1) {
            return caches.delete(cacheName);
          }
          return null;
        })
      );
    })
  );
  self.clients.claim();
});

// Sincronização em segundo plano quando voltar a ficar online
self.addEventListener('sync', function(event) {
  if (event.tag === 'sync-updates') {
    event.waitUntil(syncData());
  }
});

// Função para sincronizar dados quando ficar online novamente
async function syncData() {
  // Recuperar dados armazenados localmente durante o período offline
  const offlineData = await getOfflineData();
  
  // Tentar enviar para o servidor
  if (offlineData && offlineData.length > 0) {
    for (const item of offlineData) {
      try {
        // Enviar para o servidor
        await fetch('/api/sync', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(item)
        });
        // Remover do armazenamento local após sucesso
        await removeOfflineData(item.id);
      } catch (error) {
        console.error('Falha ao sincronizar item:', error);
      }
    }
  }
}

// Função auxiliar para buscar dados offline
async function getOfflineData() {
  if ('indexedDB' in self) {
    // Implementação simples usando localStorage para exemplo
    return JSON.parse(localStorage.getItem('offlineChanges') || '[]');
  }
  return [];
}

// Função auxiliar para remover dados offline
async function removeOfflineData(id) {
  if ('indexedDB' in self) {
    const offlineData = JSON.parse(localStorage.getItem('offlineChanges') || '[]');
    const updatedData = offlineData.filter(item => item.id !== id);
    localStorage.setItem('offlineChanges', JSON.stringify(updatedData));
  }
}

self.addEventListener('fetch', (event) => {
  const url = new URL(event.request.url);
  
  // Estratégia diferente para requisições API vs. recursos estáticos
  if (url.pathname.startsWith('/api/')) {
    // Para APIs, usar estratégia de network-first com fallback para offline
    event.respondWith(
      fetch(event.request)
        .then(response => {
          // Clone e armazena a resposta no cache
          const clonedResponse = response.clone();
          caches.open(DATA_CACHE_NAME).then(cache => {
            cache.put(event.request, clonedResponse);
          });
          return response;
        })
        .catch(() => {
          // Se offline, tenta buscar do cache
          return caches.match(event.request)
            .then(cachedResponse => {
              if (cachedResponse) {
                return cachedResponse;
              }
              // Se não tiver em cache, retorna erro amigável
              return new Response(
                JSON.stringify({ error: 'Você está offline. Os dados serão sincronizados quando sua conexão for restaurada.' }),
                { headers: { 'Content-Type': 'application/json' } }
              );
            });
        })
    );
  } else {
    // Para recursos estáticos e páginas, usar estratégia de cache-first
    event.respondWith(
      caches.match(event.request)
        .then((response) => {
          // Cache hit - return response
          if (response) {
            return response;
          }

        // Clonar a requisição para evitar erros de stream
        const fetchRequest = event.request.clone();
        
        return fetch(fetchRequest)
          .then((response) => {
            // Verificar se a resposta é válida
            if (!response || response.status !== 200 || response.type !== 'basic') {
              return response;
            }

            // Clonar a resposta para o cache
            const responseToCache = response.clone();

            // Armazenar no cache se for um recurso estático
            const url = new URL(event.request.url);
            if (
              url.pathname.startsWith('/_next/static/') || 
              url.pathname.endsWith('.js') || 
              url.pathname.endsWith('.css') || 
              url.pathname.endsWith('.svg') || 
              url.pathname.endsWith('.png') || 
              url.pathname.endsWith('.jpg') || 
              url.pathname.endsWith('.jpeg') || 
              url.pathname.endsWith('.webp')
            ) {
              caches.open(CACHE_NAME)
                .then((cache) => {
                  cache.put(event.request, responseToCache);
                });
            }

            return response;
          })          .catch(() => {
            // Se não conseguir conectar à internet, tentar retornar página offline
            if (event.request.mode === 'navigate') {
              return caches.match('/offline').then(response => {
                if (response) return response;
                
                return caches.match('/offline.html').then(offlineHtml => {
                  if (offlineHtml) return offlineHtml;
                  
                  return caches.match('/pwa-landing');
                });
              });
            }
            
            // Para APIs, retornar erro no formato JSON
            if (event.request.url.includes('/api/')) {
              return new Response(JSON.stringify({
                error: 'offline',
                message: 'Você está offline. Os dados serão sincronizados quando sua conexão for restaurada.'
              }), {
                status: 503,
                headers: { 'Content-Type': 'application/json' }
              });
            }
            
            // Para outros recursos
            return new Response('Você está offline. Por favor, verifique sua conexão.', {
              headers: { 'Content-Type': 'text/plain' }
            });
          });
      })
    );
  }
});
