/* ============================================
   🔥 Firebase Service
   Servicio para interactuar con Firebase Firestore
   Lo Quiero YA CM
   Versión: 2.0 - Fix IDs de Firestore
   ============================================ */

class FirebaseService {
  constructor() {
    this.db = null;
    this.auth = null;
    this.initialized = false;
  }

  /**
   * Inicializa Firebase con la configuración
   */
  initialize() {
    try {
      // Verificar que firebaseConfig existe
      if (typeof firebaseConfig === 'undefined') {
        console.warn('⚠️ Firebase config no encontrada. Usando modo localStorage.');
        this.initialized = false;
        return false;
      }

      // Inicializar Firebase
      if (!firebase.apps.length) {
        firebase.initializeApp(firebaseConfig);
      }

      // Obtener referencias
      this.db = firebase.firestore();
      this.auth = firebase.auth();
      this.initialized = true;

      console.log('✅ Firebase inicializado correctamente');
      return true;
    } catch (error) {
      console.error('❌ Error inicializando Firebase:', error);
      console.warn('⚠️ Usando modo localStorage como fallback');
      this.initialized = false;
      return false;
    }
  }

  /**
   * Verifica si Firebase está inicializado
   */
  isInitialized() {
    return this.initialized;
  }

  // ============ MÉTODOS DE PEDIDOS ============

  /**
   * Guarda un nuevo pedido en Firestore
   * @param {Object} pedido - Datos del pedido
   * @returns {Promise} - Promesa con el ID del pedido
   */
  async guardarPedido(pedido) {
    if (!this.initialized) {
      throw new Error('Firebase no está inicializado');
    }

    try {
      const pedidoData = {
        ...pedido,
        fecha: firebase.firestore.FieldValue.serverTimestamp(),
        estado: 'pendiente',
        createdAt: new Date().toISOString()
      };

      const docRef = await this.db.collection('pedidos').add(pedidoData);
      console.log('✅ Pedido guardado en Firebase:', docRef.id);

      // Enviar notificación a n8n
      await this.enviarNotificacionN8N(pedido, docRef.id);

      return docRef.id;
    } catch (error) {
      console.error('❌ Error guardando pedido:', error);
      throw error;
    }
  }

  /**
   * Obtiene todos los pedidos del usuario actual o todos si es admin
   * @param {string} userId - ID del usuario (opcional)
   * @returns {Promise<Array>} - Array de pedidos
   */
  async obtenerPedidos(userId = null) {
    if (!this.initialized) {
      throw new Error('Firebase no está inicializado');
    }

    try {
      let query = this.db.collection('pedidos');

      if (userId) {
        query = query.where('userId', '==', userId);
      }

      query = query.orderBy('fecha', 'desc').limit(50);

      const snapshot = await query.get();
      const pedidos = [];

      snapshot.forEach(doc => {
        const data = doc.data();
        // Asegurar que usamos el ID del documento de Firestore, no el ID interno
        const pedido = {
          ...data,
          id: doc.id,  // ID del documento de Firestore (más importante)
          firestoreId: doc.id  // Backup del ID real
        };
        
        console.log(`🔍 Pedido cargado: ID Firestore=${doc.id}, ID interno=${data.id}, Cliente=${data.cliente?.nombre}`);
        pedidos.push(pedido);
      });

      console.log(`✅ ${pedidos.length} pedidos obtenidos de Firebase`);
      return pedidos;
    } catch (error) {
      console.error('❌ Error obteniendo pedidos:', error);
      throw error;
    }
  }

  /**
   * Actualiza el estado de un pedido
   * @param {string} pedidoId - ID del pedido
   * @param {string} nuevoEstado - Nuevo estado del pedido
   */
  async actualizarEstadoPedido(pedidoId, nuevoEstado) {
    if (!this.initialized) {
      throw new Error('Firebase no está inicializado');
    }

    try {
      await this.db.collection('pedidos').doc(pedidoId).update({
        estado: nuevoEstado,
        updatedAt: firebase.firestore.FieldValue.serverTimestamp()
      });

      console.log(`✅ Estado del pedido ${pedidoId} actualizado a: ${nuevoEstado}`);
    } catch (error) {
      console.error('❌ Error actualizando estado:', error);
      throw error;
    }
  }

  /**
   * Elimina un pedido
   * @param {string} pedidoId - ID del pedido
   */
  async eliminarPedido(pedidoId) {
    if (!this.initialized) {
      throw new Error('Firebase no está inicializado');
    }

    try {
      await this.db.collection('pedidos').doc(pedidoId).delete();
      console.log(`✅ Pedido ${pedidoId} eliminado`);
    } catch (error) {
      console.error('❌ Error eliminando pedido:', error);
      throw error;
    }
  }

  // ============ MÉTODOS DE AUTENTICACIÓN ============

  /**
   * Registra un nuevo usuario
   * @param {string} email - Email del usuario
   * @param {string} password - Contraseña
   * @param {Object} userData - Datos adicionales del usuario
   */
  async registrarUsuario(email, password, userData) {
    if (!this.initialized) {
      throw new Error('Firebase no está inicializado');
    }

    try {
      const userCredential = await this.auth.createUserWithEmailAndPassword(email, password);
      const user = userCredential.user;

      // Guardar datos adicionales en Firestore
      await this.db.collection('usuarios').doc(user.uid).set({
        email: email,
        nombre: userData.nombre || '',
        telefono: userData.telefono || '',
        direccion: userData.direccion || '',
        role: 'cliente',
        createdAt: firebase.firestore.FieldValue.serverTimestamp()
      });

      console.log('✅ Usuario registrado:', user.uid);
      return user;
    } catch (error) {
      console.error('❌ Error registrando usuario:', error);
      throw error;
    }
  }

  /**
   * Inicia sesión con email y contraseña
   * @param {string} email - Email del usuario
   * @param {string} password - Contraseña
   */
  async iniciarSesion(email, password) {
    if (!this.initialized) {
      throw new Error('Firebase no está inicializado');
    }

    try {
      const userCredential = await this.auth.signInWithEmailAndPassword(email, password);
      console.log('✅ Sesión iniciada:', userCredential.user.uid);
      return userCredential.user;
    } catch (error) {
      console.error('❌ Error iniciando sesión:', error);
      throw error;
    }
  }

  /**
   * Cierra la sesión del usuario actual
   */
  async cerrarSesion() {
    if (!this.initialized) {
      throw new Error('Firebase no está inicializado');
    }

    try {
      await this.auth.signOut();
      console.log('✅ Sesión cerrada');
    } catch (error) {
      console.error('❌ Error cerrando sesión:', error);
      throw error;
    }
  }

  /**
   * Obtiene el usuario actual
   * @returns {Object|null} - Usuario actual o null
   */
  obtenerUsuarioActual() {
    if (!this.initialized) {
      return null;
    }

    return this.auth.currentUser;
  }

  /**
   * Escucha cambios en el estado de autenticación
   * @param {Function} callback - Función a ejecutar cuando cambia el estado
   */
  onAuthStateChanged(callback) {
    if (!this.initialized) {
      callback(null);
      return;
    }

    this.auth.onAuthStateChanged(callback);
  }

  // ============ NOTIFICACIONES ============

  /**
   * Envía notificación a n8n webhook
   * @param {Object} pedido - Datos del pedido
   * @param {string} pedidoId - ID del pedido
   */
  async enviarNotificacionN8N(pedido, pedidoId) {
    if (typeof N8N_WEBHOOK_URL === 'undefined' || !N8N_WEBHOOK_URL || N8N_WEBHOOK_URL.includes('your-n8n')) {
      console.warn('⚠️ n8n webhook no configurado');
      return;
    }

    try {
      const payload = {
        pedidoId: pedidoId,
        fecha: new Date().toISOString(),
        cliente: pedido.cliente,
        productos: pedido.productos,
        total: pedido.total,
        evento: 'nuevo_pedido'
      };

      const response = await fetch(N8N_WEBHOOK_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(payload)
      });

      if (response.ok) {
        console.log('✅ Notificación enviada a n8n');
      } else {
        console.warn('⚠️ Error enviando notificación a n8n:', response.statusText);
      }
    } catch (error) {
      console.error('❌ Error enviando notificación a n8n:', error);
    }
  }

  // ============ MÉTODOS DE PRODUCTOS ============

  /**
   * Obtiene todos los productos del catálogo
   * @returns {Promise<Array>} - Array de productos
   */
  async obtenerProductos() {
    if (!this.initialized) {
      throw new Error('Firebase no está inicializado');
    }

    try {
      const snapshot = await this.db.collection('productos').get();
      const productos = [];

      snapshot.forEach(doc => {
        productos.push({
          id: doc.id,
          ...doc.data()
        });
      });

      return productos;
    } catch (error) {
      console.error('❌ Error obteniendo productos:', error);
      throw error;
    }
  }

  /**
   * Guarda o actualiza un producto
   * @param {Object} producto - Datos del producto
   * @param {string} productoId - ID del producto (opcional para nuevo)
   */
  async guardarProducto(producto, productoId = null) {
    if (!this.initialized) {
      throw new Error('Firebase no está inicializado');
    }

    try {
      if (productoId) {
        await this.db.collection('productos').doc(productoId).update(producto);
        console.log(`✅ Producto ${productoId} actualizado`);
      } else {
        const docRef = await this.db.collection('productos').add(producto);
        console.log(`✅ Producto creado:`, docRef.id);
        return docRef.id;
      }
    } catch (error) {
      console.error('❌ Error guardando producto:', error);
      throw error;
    }
  }
}

// Crear instancia global del servicio
const firebaseService = new FirebaseService();

// Intentar inicializar Firebase automáticamente
document.addEventListener('DOMContentLoaded', () => {
  firebaseService.initialize();
});

// Exportar para uso en otros archivos
if (typeof window !== 'undefined') {
  window.firebaseService = firebaseService;
}

