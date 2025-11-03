/* ============================================
   🔌 Configuración de API
   Lo Quiero YA CM - Backend FastAPI
   ============================================ */

/**
 * Configuración de la URL del backend
 * Cambia entre desarrollo y producción
 */
const API_CONFIG = {
  // Producción (Render)
  production: {
    baseURL: 'https://loquieroya-api.onrender.com',
    timeout: 30000, // 30 segundos (Render puede tardar en "despertar")
    name: 'Render (Producción)'
  },
  
  // Desarrollo (Local)
  development: {
    baseURL: 'http://localhost:8000',
    timeout: 5000,
    name: 'Local (Desarrollo)'
  }
};

/**
 * Detecta automáticamente el entorno
 */
function getEnvironment() {
  // Si estamos en localhost o 127.0.0.1, es desarrollo
  const isLocal = window.location.hostname === 'localhost' || 
                  window.location.hostname === '127.0.0.1' ||
                  window.location.hostname === '';
  
  return isLocal ? 'development' : 'production';
}

/**
 * Obtiene la configuración actual
 */
function getAPIConfig() {
  const env = getEnvironment();
  const config = API_CONFIG[env];
  
  console.log(`🔌 API Config: ${config.name} (${config.baseURL})`);
  
  return config;
}

// Exportar configuración
const currentAPIConfig = getAPIConfig();

// Para uso global
if (typeof window !== 'undefined') {
  window.API_CONFIG = currentAPIConfig;
}

