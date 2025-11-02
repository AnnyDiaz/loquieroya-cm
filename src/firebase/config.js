/* ============================================
   🔥 Firebase Configuration Module
   Lo Quiero YA CM
   ============================================ */

/**
 * Configuración de Firebase
 * @type {Object}
 */
const firebaseConfig = {
  apiKey: "AIzaSyBRG3qIBSDgX5oVNF0ebcuXPWTHKna-844",
  authDomain: "loquieroya-cm.firebaseapp.com",
  projectId: "loquieroya-cm",
  storageBucket: "loquieroya-cm.firebasestorage.app",
  messagingSenderId: "623540108241",
  appId: "1:623540108241:web:7230ee60930ac258753ef0",
  measurementId: "G-TSS9LD7GXT"
};

/**
 * Configuración de n8n para notificaciones
 * @type {Object}
 */
const n8nConfig = {
  webhookUrl: "http://localhost:5678/webhook/nuevo-pedido",
  enabled: true
};

/**
 * Configuración de la aplicación
 * @type {Object}
 */
const appConfig = {
  // Nombres de colecciones
  collections: {
    PRODUCTOS: 'productos',
    PEDIDOS: 'pedidos',
    USUARIOS: 'usuarios',
    CATEGORIAS: 'categorias'
  },
  
  // Configuración de cache
  cache: {
    PRODUCTOS_TTL: 5 * 60 * 1000, // 5 minutos
    enabled: true
  },
  
  // Estados de pedidos
  estadosPedido: {
    PENDIENTE: 'pendiente',
    CONFIRMADO: 'confirmado',
    EN_PREPARACION: 'en_preparacion',
    EN_CAMINO: 'en_camino',
    ENTREGADO: 'entregado',
    CANCELADO: 'cancelado'
  },
  
  // Configuración de storage
  storage: {
    maxFileSize: 5 * 1024 * 1024, // 5MB
    allowedTypes: ['image/jpeg', 'image/png', 'image/webp'],
    productosPath: 'productos/'
  }
};

// Exportar configuraciones
if (typeof module !== 'undefined' && module.exports) {
  module.exports = { firebaseConfig, n8nConfig, appConfig };
}
