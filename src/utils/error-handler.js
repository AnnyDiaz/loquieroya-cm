/* ============================================
   ⚠️ Error Handler & Loading States
   Lo Quiero YA CM
   ============================================ */

/**
 * Tipos de errores personalizados
 */
const ErrorTypes = {
  NETWORK: 'network',
  VALIDATION: 'validation',
  AUTHENTICATION: 'authentication',
  PERMISSION: 'permission',
  NOT_FOUND: 'not_found',
  SERVER: 'server',
  UNKNOWN: 'unknown'
};

/**
 * Clase para errores personalizados de la aplicación
 */
class AppError extends Error {
  constructor(message, type = ErrorTypes.UNKNOWN, originalError = null) {
    super(message);
    this.name = 'AppError';
    this.type = type;
    this.originalError = originalError;
    this.timestamp = new Date().toISOString();
  }
}

/**
 * Manejador de errores
 */
class ErrorHandler {
  /**
   * Procesa un error y lo convierte en AppError
   * @param {Error} error 
   * @returns {AppError}
   */
  static handle(error) {
    if (error instanceof AppError) {
      return error;
    }

    // Errores de Firebase
    if (error.code) {
      return this.handleFirebaseError(error);
    }

    // Errores de red
    if (error instanceof TypeError && error.message.includes('fetch')) {
      return new AppError(
        'Error de conexión. Verifica tu internet.',
        ErrorTypes.NETWORK,
        error
      );
    }

    // Error genérico
    return new AppError(
      error.message || 'Ha ocurrido un error inesperado',
      ErrorTypes.UNKNOWN,
      error
    );
  }

  /**
   * Maneja errores específicos de Firebase
   * @param {Error} error 
   * @returns {AppError}
   */
  static handleFirebaseError(error) {
    const errorMessages = {
      // Auth errors
      'auth/user-not-found': 'Usuario no encontrado',
      'auth/wrong-password': 'Contraseña incorrecta',
      'auth/email-already-in-use': 'El email ya está registrado',
      'auth/weak-password': 'La contraseña es muy débil',
      'auth/invalid-email': 'Email inválido',
      'auth/network-request-failed': 'Error de conexión',
      
      // Firestore errors
      'permission-denied': 'No tienes permisos para esta acción',
      'not-found': 'Documento no encontrado',
      'already-exists': 'El documento ya existe',
      'resource-exhausted': 'Cuota de Firestore excedida',
      'unavailable': 'Servicio no disponible temporalmente',
      
      // Storage errors
      'storage/unauthorized': 'No autorizado para subir archivos',
      'storage/canceled': 'Subida cancelada',
      'storage/unknown': 'Error desconocido en Storage'
    };

    const message = errorMessages[error.code] || error.message;
    
    let type = ErrorTypes.SERVER;
    if (error.code?.startsWith('auth/')) {
      type = ErrorTypes.AUTHENTICATION;
    } else if (error.code === 'permission-denied') {
      type = ErrorTypes.PERMISSION;
    } else if (error.code === 'not-found') {
      type = ErrorTypes.NOT_FOUND;
    }

    return new AppError(message, type, error);
  }

  /**
   * Muestra un error al usuario
   * @param {Error} error 
   * @param {Object} options 
   */
  static show(error, options = {}) {
    const appError = this.handle(error);
    
    console.error('❌ Error:', {
      message: appError.message,
      type: appError.type,
      timestamp: appError.timestamp,
      original: appError.originalError
    });

    // Mostrar en UI
    if (options.showUI !== false) {
      this.showUserMessage(appError.message, 'error');
    }

    // Registrar en analytics (si está disponible)
    if (options.logAnalytics && typeof gtag !== 'undefined') {
      gtag('event', 'exception', {
        description: appError.message,
        fatal: false
      });
    }

    return appError;
  }

  /**
   * Muestra un mensaje al usuario
   * @param {string} message 
   * @param {string} type - 'success', 'error', 'warning', 'info'
   */
  static showUserMessage(message, type = 'info') {
    // Buscar contenedor de mensajes
    let container = document.getElementById('mensajes-container');
    
    if (!container) {
      // Crear contenedor si no existe
      container = document.createElement('div');
      container.id = 'mensajes-container';
      container.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        z-index: 10000;
        max-width: 400px;
      `;
      document.body.appendChild(container);
    }

    // Crear mensaje
    const mensaje = document.createElement('div');
    mensaje.className = `mensaje mensaje-${type}`;
    mensaje.style.cssText = `
      background: ${type === 'error' ? '#fee' : type === 'success' ? '#efe' : type === 'warning' ? '#ffe' : '#eef'};
      border-left: 4px solid ${type === 'error' ? '#c33' : type === 'success' ? '#3c3' : type === 'warning' ? '#cc3' : '#33c'};
      padding: 15px 20px;
      margin-bottom: 10px;
      border-radius: 4px;
      box-shadow: 0 2px 8px rgba(0,0,0,0.1);
      animation: slideIn 0.3s ease;
    `;

    const icon = type === 'error' ? '❌' : type === 'success' ? '✅' : type === 'warning' ? '⚠️' : 'ℹ️';
    mensaje.innerHTML = `<strong>${icon} ${message}</strong>`;

    container.appendChild(mensaje);

    // Auto-remover después de 5 segundos
    setTimeout(() => {
      mensaje.style.animation = 'slideOut 0.3s ease';
      setTimeout(() => {
        if (mensaje.parentNode) {
          mensaje.parentNode.removeChild(mensaje);
        }
      }, 300);
    }, 5000);
  }
}

/**
 * Manejador de estados de carga
 */
class LoadingState {
  constructor() {
    this.activeLoaders = new Set();
  }

  /**
   * Inicia un estado de carga
   * @param {string} id - Identificador único del loader
   * @param {Object} options 
   */
  start(id, options = {}) {
    this.activeLoaders.add(id);
    
    if (options.showUI !== false) {
      this.showLoader(id, options);
    }

    console.log(`🔄 Loading iniciado: ${id}`);
  }

  /**
   * Detiene un estado de carga
   * @param {string} id 
   */
  stop(id) {
    this.activeLoaders.delete(id);
    this.hideLoader(id);
    
    console.log(`✅ Loading completado: ${id}`);
  }

  /**
   * Verifica si hay algún loader activo
   * @returns {boolean}
   */
  isLoading() {
    return this.activeLoaders.size > 0;
  }

  /**
   * Detiene todos los loaders
   */
  stopAll() {
    this.activeLoaders.forEach(id => this.stop(id));
    this.activeLoaders.clear();
  }

  /**
   * Muestra un loader en la UI
   * @param {string} id 
   * @param {Object} options 
   */
  showLoader(id, options = {}) {
    const targetElement = options.target || document.body;
    
    // Buscar o crear contenedor de loader
    let loader = document.getElementById(`loader-${id}`);
    
    if (!loader) {
      loader = document.createElement('div');
      loader.id = `loader-${id}`;
      loader.className = 'loader';
      loader.style.cssText = `
        position: ${options.target ? 'absolute' : 'fixed'};
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        z-index: 9999;
        text-align: center;
      `;
      
      loader.innerHTML = `
        <div style="
          border: 4px solid #f3f3f3;
          border-top: 4px solid #FF6B9D;
          border-radius: 50%;
          width: 40px;
          height: 40px;
          animation: spin 1s linear infinite;
          margin: 0 auto;
        "></div>
        <p style="margin-top: 10px; color: #666;">${options.message || 'Cargando...'}</p>
      `;
      
      targetElement.appendChild(loader);
    }
  }

  /**
   * Oculta un loader
   * @param {string} id 
   */
  hideLoader(id) {
    const loader = document.getElementById(`loader-${id}`);
    if (loader && loader.parentNode) {
      loader.parentNode.removeChild(loader);
    }
  }
}

// Crear instancias globales
const errorHandler = new ErrorHandler();
const loadingState = new LoadingState();

// Agregar estilos de animación
if (typeof document !== 'undefined') {
  const style = document.createElement('style');
  style.textContent = `
    @keyframes slideIn {
      from { transform: translateX(100%); opacity: 0; }
      to { transform: translateX(0); opacity: 1; }
    }
    
    @keyframes slideOut {
      from { transform: translateX(0); opacity: 1; }
      to { transform: translateX(100%); opacity: 0; }
    }
    
    @keyframes spin {
      0% { transform: rotate(0deg); }
      100% { transform: rotate(360deg); }
    }
  `;
  document.head.appendChild(style);
}

// Exportar
if (typeof module !== 'undefined' && module.exports) {
  module.exports = {
    ErrorHandler,
    LoadingState,
    ErrorTypes,
    AppError,
    errorHandler,
    loadingState
  };
}

// Hacer disponible globalmente
if (typeof window !== 'undefined') {
  window.errorHandler = errorHandler;
  window.loadingState = loadingState;
  window.ErrorHandler = ErrorHandler;
  window.AppError = AppError;
}

