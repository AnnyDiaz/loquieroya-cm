/* ============================================
   📱 PWA Installer - Lo Quiero YA CM
   Service Worker registration y PWA install prompt
   ============================================ */

/**
 * PWA Installer Class
 */
class PWAInstaller {
  constructor() {
    this.deferredPrompt = null;
    this.isInstalled = false;
    this.init();
  }

  async init() {
    // Check if already installed
    if (window.matchMedia('(display-mode: standalone)').matches || 
        window.navigator.standalone === true) {
      this.isInstalled = true;
      console.log('✅ PWA: App ya está instalada');
      return;
    }

    // Register service worker
    await this.registerServiceWorker();

    // Setup install prompt
    this.setupInstallPrompt();

    // Check for updates
    this.checkForUpdates();
  }

  async registerServiceWorker() {
    if ('serviceWorker' in navigator) {
      try {
        const registration = await navigator.serviceWorker.register('/service-worker.js', {
          scope: '/'
        });

        console.log('✅ Service Worker registrado:', registration.scope);

        // Check for updates
        registration.addEventListener('updatefound', () => {
          const newWorker = registration.installing;
          console.log('🔄 Service Worker: Nueva versión encontrada');

          newWorker.addEventListener('statechange', () => {
            if (newWorker.state === 'installed' && navigator.serviceWorker.controller) {
              console.log('✨ Service Worker: Nueva versión disponible');
              this.showUpdatePrompt();
            }
          });
        });

        return registration;
      } catch (error) {
        console.error('❌ Service Worker: Error en registro:', error);
      }
    } else {
      console.warn('⚠️ Service Worker no soportado en este navegador');
    }
  }

  setupInstallPrompt() {
    // Capture the install prompt event
    window.addEventListener('beforeinstallprompt', (e) => {
      e.preventDefault();
      this.deferredPrompt = e;
      console.log('📱 PWA: Install prompt disponible');
      this.showInstallBanner();
    });

    // Detect when app is installed
    window.addEventListener('appinstalled', () => {
      console.log('✅ PWA: App instalada');
      this.isInstalled = true;
      this.hideInstallBanner();
      
      if (typeof toastManager !== 'undefined') {
        toastManager.success('¡App instalada correctamente!');
      }
    });
  }

  showInstallBanner() {
    // Don't show if already dismissed or installed
    if (localStorage.getItem('pwa_install_dismissed') === 'true' || this.isInstalled) {
      return;
    }

    // Create banner
    const banner = document.createElement('div');
    banner.id = 'pwa-install-prompt';
    banner.className = 'pwa-install-prompt active';
    banner.innerHTML = `
      <div class="pwa-install-content">
        <span class="pwa-install-icon">📱</span>
        <div class="pwa-install-text">
          <h3>Instalar App</h3>
          <p>Agrega Lo Quiero YA CM a tu pantalla de inicio para un acceso más rápido</p>
        </div>
        <div class="pwa-install-actions">
          <button class="pwa-install-btn pwa-install-btn-secondary" id="pwa-dismiss">
            Ahora no
          </button>
          <button class="pwa-install-btn pwa-install-btn-primary" id="pwa-install">
            Instalar
          </button>
        </div>
      </div>
    `;

    document.body.appendChild(banner);

    // Event listeners
    document.getElementById('pwa-install').addEventListener('click', () => {
      this.installApp();
    });

    document.getElementById('pwa-dismiss').addEventListener('click', () => {
      this.dismissInstallBanner();
    });

    // Auto-dismiss after 10 seconds
    setTimeout(() => {
      if (document.getElementById('pwa-install-prompt')) {
        this.dismissInstallBanner();
      }
    }, 10000);
  }

  hideInstallBanner() {
    const banner = document.getElementById('pwa-install-prompt');
    if (banner) {
      banner.classList.remove('active');
      setTimeout(() => {
        banner.remove();
      }, 300);
    }
  }

  dismissInstallBanner() {
    localStorage.setItem('pwa_install_dismissed', 'true');
    this.hideInstallBanner();
  }

  async installApp() {
    if (!this.deferredPrompt) {
      console.warn('⚠️ PWA: No hay prompt disponible');
      return;
    }

    // Show the install prompt
    this.deferredPrompt.prompt();

    // Wait for the user's response
    const { outcome } = await this.deferredPrompt.userChoice;
    
    console.log(`PWA: User response: ${outcome}`);

    if (outcome === 'accepted') {
      console.log('✅ PWA: Usuario aceptó la instalación');
    } else {
      console.log('❌ PWA: Usuario rechazó la instalación');
    }

    // Clear the deferredPrompt
    this.deferredPrompt = null;
    this.hideInstallBanner();
  }

  showUpdatePrompt() {
    if (typeof confirmModal !== 'undefined') {
      confirmModal.show({
        title: 'Actualización Disponible',
        message: 'Hay una nueva versión de la aplicación disponible. ¿Deseas actualizarla ahora?',
        type: 'info',
        confirmText: 'Actualizar',
        cancelText: 'Después',
        onConfirm: () => {
          this.updateApp();
        }
      });
    } else {
      if (confirm('Hay una nueva versión disponible. ¿Actualizar ahora?')) {
        this.updateApp();
      }
    }
  }

  async updateApp() {
    const registration = await navigator.serviceWorker.getRegistration();
    if (registration && registration.waiting) {
      // Tell the waiting service worker to skip waiting
      registration.waiting.postMessage({ action: 'skipWaiting' });

      // Reload the page
      window.location.reload();
    }
  }

  async checkForUpdates() {
    if ('serviceWorker' in navigator) {
      const registration = await navigator.serviceWorker.getRegistration();
      if (registration) {
        // Check for updates every hour
        setInterval(() => {
          console.log('🔄 PWA: Checking for updates...');
          registration.update();
        }, 60 * 60 * 1000);
      }
    }
  }

  /**
   * Request notification permission
   */
  async requestNotificationPermission() {
    if (!('Notification' in window)) {
      console.warn('⚠️ Notifications no soportadas');
      return false;
    }

    if (Notification.permission === 'granted') {
      console.log('✅ Notifications: Permiso ya otorgado');
      return true;
    }

    if (Notification.permission !== 'denied') {
      const permission = await Notification.requestPermission();
      
      if (permission === 'granted') {
        console.log('✅ Notifications: Permiso otorgado');
        return true;
      }
    }

    console.warn('❌ Notifications: Permiso denegado');
    return false;
  }

  /**
   * Show a notification
   */
  async showNotification(title, options = {}) {
    const hasPermission = await this.requestNotificationPermission();
    
    if (!hasPermission) {
      return;
    }

    const registration = await navigator.serviceWorker.getRegistration();
    if (registration) {
      registration.showNotification(title, {
        body: options.body || '',
        icon: options.icon || '/assets/icon-192.png',
        badge: options.badge || '/assets/icon-192.png',
        vibrate: options.vibrate || [200, 100, 200],
        data: options.data || {},
        actions: options.actions || [],
        ...options
      });
    }
  }
}

/**
 * iOS Add to Home Screen Helper
 */
function showIOSInstallInstructions() {
  if (isIOS() && !isInStandaloneMode()) {
    if (typeof toastManager !== 'undefined') {
      toastManager.info(
        'Para instalar: Toca el botón "Compartir" y luego "Agregar a pantalla de inicio"',
        8000
      );
    }
  }
}

function isIOS() {
  return /iPad|iPhone|iPod/.test(navigator.userAgent) && !window.MSStream;
}

function isInStandaloneMode() {
  return window.matchMedia('(display-mode: standalone)').matches || 
         window.navigator.standalone === true;
}

// Initialize PWA
let pwaInstaller;

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', () => {
    pwaInstaller = new PWAInstaller();
    window.pwaInstaller = pwaInstaller;

    // Show iOS instructions if applicable
    setTimeout(() => {
      showIOSInstallInstructions();
    }, 5000);
  });
} else {
  pwaInstaller = new PWAInstaller();
  window.pwaInstaller = pwaInstaller;

  setTimeout(() => {
    showIOSInstallInstructions();
  }, 5000);
}

// Export
if (typeof module !== 'undefined' && module.exports) {
  module.exports = { PWAInstaller };
}

console.log('✅ PWA Installer loaded');

