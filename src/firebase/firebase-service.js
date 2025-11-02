/* ============================================
   🔥 Firebase Service - Refactorizado
   Lo Quiero YA CM - Servicio Centralizado
   Versión: 3.0 - Estructura Profesional
   ============================================ */

import { firebaseConfig, FIRESTORE_COLLECTIONS, PEDIDO_ESTADOS } from '../firebase/config.js';

class FirebaseService {
  constructor() {
    this.db = null;
    this.auth = null;
    this.initialized = false;
  }

  /**
   * Inicializa Firebase con la configuración centralizada
   */
  async initialize() {
    if (this.initialized) {
      return true;
    }

    try {
      // Inicializar Firebase si no está inicializado
      if (!firebase.apps.length) {
        firebase.initializeApp(firebaseConfig);
      }

      this.db = firebase.firestore();
      this.auth = firebase.auth();

      // Configurar persistencia offline
      await this.db.enablePersistence().catch((err) => {
        if (err.code === 'failed-precondition') {
          console.warn('⚠️ Persistencia offline no disponible en este navegador');
        } else if (err.code === 'unimplemented') {
          console.warn('⚠️ Navegador no soporta persistencia offline');
        }
      });

      this.initialized = true;
      console.log('✅ Firebase inicializado correctamente');
      return true;
    } catch (error) {
      console.error('❌ Error inicializando Firebase:', error);
      return false;
    }
  }

  /**
   * Verifica si Firebase está inicializado
   */
  isInitialized() {
    return this.initialized;
  }

  // ============ PEDIDOS ============

  /**
   * Guarda un pedido en Firestore
   * @param {Object} pedido - Datos del pedido
   * @returns {Promise<string>} - ID del documento creado
   */
  async guardarPedido(pedido) {
    if (!this.initialized) {
      throw new Error('Firebase no está inicializado');
    }

    try {
      const docRef = await this.db.collection(FIRESTORE_COLLECTIONS.PEDIDOS).add({
        ...pedido,
        createdAt: firebase.firestore.FieldValue.serverTimestamp(),
        updatedAt: firebase.firestore.FieldValue.serverTimestamp()
      });

      console.log(`✅ Pedido guardado en Firebase: ${docRef.id}`);
      return docRef.id;
    } catch (error) {
      console.error('❌ Error guardando pedido:', error);
      throw error;
    }
  }

  /**
   * Obtiene todos los pedidos
   * @param {string} userId - ID del usuario (opcional)
   * @returns {Promise<Array>} - Array de pedidos
   */
  async obtenerPedidos(userId = null) {
    if (!this.initialized) {
      throw new Error('Firebase no está inicializado');
    }

    try {
      let query = this.db.collection(FIRESTORE_COLLECTIONS.PEDIDOS);

      if (userId) {
        query = query.where('userId', '==', userId);
      }

      query = query.orderBy('createdAt', 'desc').limit(50);

      const snapshot = await query.get();
      const pedidos = [];

      snapshot.forEach(doc => {
        const data = doc.data();
        const pedido = {
          ...data,
          id: doc.id, // ID del documento de Firestore
          firestoreId: doc.id
        };
        
        console.log(`🔍 Pedido cargado: ID Firestore=${doc.id}, Cliente=${data.cliente?.nombre}`);
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

    // Validar estado
    if (!Object.values(PEDIDO_ESTADOS).includes(nuevoEstado)) {
      throw new Error(`Estado inválido: ${nuevoEstado}`);
    }

    try {
      await this.db.collection(FIRESTORE_COLLECTIONS.PEDIDOS).doc(pedidoId).update({
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
      await this.db.collection(FIRESTORE_COLLECTIONS.PEDIDOS).doc(pedidoId).delete();
      console.log(`✅ Pedido ${pedidoId} eliminado`);
    } catch (error) {
      console.error('❌ Error eliminando pedido:', error);
      throw error;
    }
  }

  // ============ AUTENTICACIÓN ============

  /**
   * Registra un nuevo usuario
   * @param {string} email - Email del usuario
   * @param {string} password - Contraseña
   * @param {Object} userData - Datos adicionales del usuario
   */
  async registrarUsuario(email, password, userData = {}) {
    if (!this.initialized) {
      throw new Error('Firebase no está inicializado');
    }

    try {
      const userCredential = await this.auth.createUserWithEmailAndPassword(email, password);
      const user = userCredential.user;

      // Guardar datos adicionales en Firestore
      await this.db.collection(FIRESTORE_COLLECTIONS.USUARIOS).doc(user.uid).set({
        email: user.email,
        createdAt: firebase.firestore.FieldValue.serverTimestamp(),
        ...userData
      });

      console.log('✅ Usuario registrado correctamente');
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
      console.log('✅ Login exitoso');
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
      console.log('✅ Sesión cerrada correctamente');
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
    return this.auth?.currentUser || null;
  }

  // ============ NOTIFICACIONES ============

  /**
   * Envía notificación a n8n
   * @param {Object} pedido - Datos del pedido
   */
  async enviarNotificacionN8N(pedido) {
    // Implementar cuando se configure n8n
    console.log('⚠️ n8n webhook no configurado');
  }

  /**
   * Envía notificación por WhatsApp
   * @param {string} telefono - Número de teléfono
   * @param {string} mensaje - Mensaje a enviar
   */
  async enviarNotificacionWhatsApp(telefono, mensaje) {
    // Implementar cuando se configure WhatsApp Cloud API
    console.log('⚠️ WhatsApp Cloud API no configurado');
  }
}

// Crear instancia singleton
const firebaseService = new FirebaseService();

// Exportar instancia y clase
export { FirebaseService };
export default firebaseService;
