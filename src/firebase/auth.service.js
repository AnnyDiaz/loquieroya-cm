/* ============================================
   🔐 Auth Service - Lo Quiero YA CM
   Servicio de autenticación con Firebase Auth
   ============================================ */

/**
 * Servicio de Autenticación
 */
class AuthService {
  constructor() {
    this.auth = null;
    this.currentUser = null;
    this.listeners = [];
  }

  /**
   * Inicializa el servicio
   * @param {Object} auth - Instancia de Firebase Auth
   */
  initialize(auth) {
    this.auth = auth;
    
    // Escuchar cambios en el estado de autenticación
    this.auth.onAuthStateChanged((user) => {
      this.currentUser = user;
      this.notifyListeners({ user });
      
      if (user) {
        console.log('✅ Usuario autenticado:', user.email);
      } else {
        console.log('❌ Usuario no autenticado');
      }
    });
    
    console.log('✅ AuthService inicializado');
  }

  /**
   * Inicia sesión con email y contraseña
   * @param {string} email 
   * @param {string} password 
   * @returns {Promise<Object>}
   */
  async loginAdmin(email, password) {
    try {
      if (!this.auth) {
        throw new Error('Firebase Auth no inicializado');
      }

      // Validar campos
      if (!email || !password) {
        throw new Error('Email y contraseña son requeridos');
      }

      if (password.length < 6) {
        throw new Error('La contraseña debe tener al menos 6 caracteres');
      }

      console.log('🔐 Intentando iniciar sesión...');

      const userCredential = await this.auth.signInWithEmailAndPassword(email, password);
      const user = userCredential.user;

      // Obtener token de autenticación
      const token = await user.getIdToken();

      console.log('✅ Inicio de sesión exitoso:', user.email);

      return {
        user: {
          uid: user.uid,
          email: user.email,
          displayName: user.displayName,
          photoURL: user.photoURL
        },
        token
      };

    } catch (error) {
      console.error('❌ Error en inicio de sesión:', error);
      
      // Errores personalizados
      const errorMessages = {
        'auth/user-not-found': 'Usuario no encontrado',
        'auth/wrong-password': 'Contraseña incorrecta',
        'auth/invalid-email': 'Email inválido',
        'auth/user-disabled': 'Usuario deshabilitado',
        'auth/too-many-requests': 'Demasiados intentos. Intenta más tarde',
        'auth/network-request-failed': 'Error de conexión'
      };

      const message = errorMessages[error.code] || error.message;
      throw new Error(message);
    }
  }

  /**
   * Cierra sesión de forma segura
   * @returns {Promise<void>}
   */
  async cerrarSesionSegura() {
    try {
      if (!this.auth) {
        throw new Error('Firebase Auth no inicializado');
      }

      // Limpiar datos sensibles
      this.currentUser = null;
      
      // Limpiar localStorage
      localStorage.removeItem('admin_session');
      sessionStorage.clear();

      // Cerrar sesión en Firebase
      await this.auth.signOut();

      console.log('✅ Sesión cerrada correctamente');
      
      // Notificar a listeners
      this.notifyListeners({ user: null, sessionClosed: true });

    } catch (error) {
      console.error('❌ Error cerrando sesión:', error);
      throw error;
    }
  }

  /**
   * Verifica si el usuario está autenticado
   * @returns {boolean}
   */
  isAuthenticated() {
    return this.currentUser !== null;
  }

  /**
   * Obtiene el usuario actual
   * @returns {Object|null}
   */
  getCurrentUser() {
    return this.currentUser;
  }

  /**
   * Obtiene el token de autenticación actual
   * @returns {Promise<string|null>}
   */
  async getAuthToken() {
    try {
      if (!this.currentUser) {
        return null;
      }

      const token = await this.currentUser.getIdToken();
      return token;

    } catch (error) {
      console.error('❌ Error obteniendo token:', error);
      return null;
    }
  }

  /**
   * Refresca el token de autenticación
   * @returns {Promise<string>}
   */
  async refreshToken() {
    try {
      if (!this.currentUser) {
        throw new Error('No hay usuario autenticado');
      }

      const token = await this.currentUser.getIdToken(true);
      console.log('✅ Token refrescado');
      return token;

    } catch (error) {
      console.error('❌ Error refrescando token:', error);
      throw error;
    }
  }

  /**
   * Verifica si el usuario es admin
   * @returns {Promise<boolean>}
   */
  async isAdmin() {
    try {
      if (!this.currentUser) {
        return false;
      }

      const token = await this.currentUser.getIdTokenResult();
      return token.claims.admin === true;

    } catch (error) {
      console.error('❌ Error verificando permisos:', error);
      return false;
    }
  }

  /**
   * Cambia la contraseña del usuario
   * @param {string} newPassword 
   * @returns {Promise<void>}
   */
  async cambiarContrasena(newPassword) {
    try {
      if (!this.currentUser) {
        throw new Error('No hay usuario autenticado');
      }

      if (newPassword.length < 6) {
        throw new Error('La contraseña debe tener al menos 6 caracteres');
      }

      await this.currentUser.updatePassword(newPassword);
      console.log('✅ Contraseña actualizada');

    } catch (error) {
      console.error('❌ Error cambiando contraseña:', error);
      throw error;
    }
  }

  /**
   * Envía email de recuperación de contraseña
   * @param {string} email 
   * @returns {Promise<void>}
   */
  async recuperarContrasena(email) {
    try {
      if (!this.auth) {
        throw new Error('Firebase Auth no inicializado');
      }

      if (!email) {
        throw new Error('Email es requerido');
      }

      await this.auth.sendPasswordResetEmail(email);
      console.log('✅ Email de recuperación enviado');

    } catch (error) {
      console.error('❌ Error enviando email de recuperación:', error);
      throw error;
    }
  }

  /**
   * Suscribirse a cambios de autenticación
   * @param {Function} callback 
   * @returns {Function} Función para desuscribirse
   */
  subscribe(callback) {
    this.listeners.push(callback);
    return () => {
      this.listeners = this.listeners.filter(cb => cb !== callback);
    };
  }

  /**
   * Notifica a los listeners
   * @param {Object} data 
   */
  notifyListeners(data) {
    this.listeners.forEach(callback => callback(data));
  }

  /**
   * Guarda la sesión en localStorage (opcional)
   * @param {Object} userData 
   */
  saveSession(userData) {
    try {
      const session = {
        email: userData.email,
        uid: userData.uid,
        timestamp: new Date().toISOString()
      };
      localStorage.setItem('admin_session', JSON.stringify(session));
    } catch (error) {
      console.error('Error guardando sesión:', error);
    }
  }

  /**
   * Recupera la sesión guardada
   * @returns {Object|null}
   */
  getSavedSession() {
    try {
      const sessionData = localStorage.getItem('admin_session');
      if (!sessionData) return null;
      
      return JSON.parse(sessionData);
    } catch (error) {
      console.error('Error recuperando sesión:', error);
      return null;
    }
  }
}

// Crear instancia singleton
const authService = new AuthService();

// Exportar
if (typeof module !== 'undefined' && module.exports) {
  module.exports = authService;
}

