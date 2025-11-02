/* ============================================
   🔥 Firebase Main Service
   Lo Quiero YA CM - Servicio Principal
   ============================================ */

/**
 * Clase principal de Firebase Service
 * Orquesta todos los servicios de Firebase
 */
class FirebaseService {
  constructor() {
    this.app = null;
    this.db = null;
    this.auth = null;
    this.storage = null;
    this.initialized = false;
    this.config = null;
  }

  /**
   * Inicializa Firebase y todos los servicios
   * @returns {Promise<void>}
   */
  async initialize() {
    try {
      if (this.initialized) {
        console.log('⚠️ Firebase ya está inicializado');
        return;
      }

      // Verificar que Firebase esté disponible
      if (typeof firebase === 'undefined') {
        throw new Error('Firebase SDK no está cargado');
      }

      // Verificar configuración
      if (typeof firebaseConfig === 'undefined') {
        throw new Error('firebaseConfig no encontrado');
      }

      // Inicializar Firebase
      this.app = firebase.initializeApp(firebaseConfig);
      this.db = firebase.firestore();
      this.auth = firebase.auth();
      this.storage = firebase.storage();

      // Configurar Firestore
      this.db.settings({
        cacheSizeBytes: firebase.firestore.CACHE_SIZE_UNLIMITED
      });

      this.db.enablePersistence({ synchronizeTabs: true })
        .catch((err) => {
          if (err.code === 'failed-precondition') {
            console.warn('⚠️ Persistencia: Múltiples tabs abiertas');
          } else if (err.code === 'unimplemented') {
            console.warn('⚠️ Persistencia no soportada en este navegador');
          }
        });

      // Obtener configuraciones
      const n8nCfg = typeof n8nConfig !== 'undefined' ? n8nConfig : null;
      const appCfg = typeof appConfig !== 'undefined' ? appConfig : {};

      // Inicializar servicios
      if (typeof productosService !== 'undefined') {
        productosService.initialize(this.db);
      }

      if (typeof pedidosService !== 'undefined') {
        pedidosService.initialize(this.db, n8nCfg);
      }

      if (typeof storageService !== 'undefined') {
        storageService.initialize(this.storage, appCfg.storage);
      }

      if (typeof authService !== 'undefined') {
        authService.initialize(this.auth);
      }

      if (typeof adminService !== 'undefined') {
        adminService.initialize(this.db);
      }

      this.initialized = true;
      console.log('✅ Firebase inicializado correctamente');
      console.log('📊 Servicios disponibles:', {
        productos: typeof productosService !== 'undefined',
        pedidos: typeof pedidosService !== 'undefined',
        storage: typeof storageService !== 'undefined',
        auth: typeof authService !== 'undefined',
        admin: typeof adminService !== 'undefined'
      });

    } catch (error) {
      console.error('❌ Error inicializando Firebase:', error);
      throw error;
    }
  }

  /**
   * Cierra la sesión del usuario
   */
  async cerrarSesion() {
    try {
      if (this.auth) {
        await this.auth.signOut();
        console.log('✅ Sesión cerrada');
      }
    } catch (error) {
      console.error('❌ Error cerrando sesión:', error);
      throw error;
    }
  }

  /**
   * Verifica si el usuario está autenticado
   * @returns {Promise<Object|null>}
   */
  async obtenerUsuarioActual() {
    return new Promise((resolve) => {
      if (!this.auth) {
        resolve(null);
        return;
      }

      this.auth.onAuthStateChanged((user) => {
        resolve(user);
      });
    });
  }

  /**
   * Inicia sesión con email y contraseña
   * @param {string} email 
   * @param {string} password 
   * @returns {Promise<Object>}
   */
  async iniciarSesion(email, password) {
    try {
      if (!this.auth) {
        throw new Error('Auth no inicializado');
      }

      const userCredential = await this.auth.signInWithEmailAndPassword(email, password);
      console.log('✅ Sesión iniciada:', userCredential.user.email);
      
      return userCredential.user;
    } catch (error) {
      console.error('❌ Error iniciando sesión:', error);
      throw error;
    }
  }

  /**
   * Verifica el estado de salud del servicio
   * @returns {Object}
   */
  healthCheck() {
    return {
      initialized: this.initialized,
      firebase: this.app !== null,
      firestore: this.db !== null,
      auth: this.auth !== null,
      storage: this.storage !== null,
      timestamp: new Date().toISOString()
    };
  }
}

// Crear instancia singleton
const firebaseService = new FirebaseService();

// Auto-inicializar cuando el DOM esté listo
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', () => {
    firebaseService.initialize().catch(console.error);
  });
} else {
  firebaseService.initialize().catch(console.error);
}

// Exportar
if (typeof module !== 'undefined' && module.exports) {
  module.exports = firebaseService;
}

// Hacer disponible globalmente para debugging
if (typeof window !== 'undefined') {
  window.firebaseService = firebaseService;
}

