/* ============================================
   📦 Pedidos Service - Lo Quiero YA CM
   Servicio para gestión de pedidos con validación
   ============================================ */

/**
 * Servicio de Pedidos con validación y notificaciones
 */
class PedidosService {
  constructor() {
    this.db = null;
    this.loading = false;
    this.listeners = [];
    this.n8nConfig = null;
  }

  /**
   * Inicializa el servicio
   * @param {Object} firestore - Instancia de Firestore
   * @param {Object} n8nConfig - Configuración de n8n
   */
  initialize(firestore, n8nConfig = null) {
    this.db = firestore;
    this.n8nConfig = n8nConfig;
    console.log('✅ PedidosService inicializado');
  }

  /**
   * Valida los datos del pedido
   * @param {Object} pedidoData 
   * @returns {Object} Pedido validado
   */
  validarPedido(pedidoData) {
    const errores = [];

    // Validar cliente
    if (!pedidoData.cliente) {
      errores.push('Datos del cliente requeridos');
    } else {
      if (!pedidoData.cliente.nombre || pedidoData.cliente.nombre.trim().length < 2) {
        errores.push('Nombre del cliente debe tener al menos 2 caracteres');
      }
      if (!pedidoData.cliente.telefono || pedidoData.cliente.telefono.length < 7) {
        errores.push('Teléfono inválido');
      }
      if (!pedidoData.cliente.direccion || pedidoData.cliente.direccion.trim().length < 5) {
        errores.push('Dirección debe tener al menos 5 caracteres');
      }
    }

    // Validar productos
    if (!pedidoData.productos || !Array.isArray(pedidoData.productos)) {
      errores.push('Productos requeridos');
    } else if (pedidoData.productos.length === 0) {
      errores.push('El pedido debe tener al menos un producto');
    } else {
      pedidoData.productos.forEach((prod, index) => {
        if (!prod.nombre) {
          errores.push(`Producto ${index + 1}: nombre requerido`);
        }
        if (!prod.precio || prod.precio <= 0) {
          errores.push(`Producto ${index + 1}: precio inválido`);
        }
      });
    }

    // Validar total
    if (!pedidoData.total || pedidoData.total <= 0) {
      errores.push('Total del pedido inválido');
    }

    if (errores.length > 0) {
      throw new Error(`Validación fallida: ${errores.join(', ')}`);
    }

    // Retornar pedido validado y sanitizado
    return {
      cliente: {
        nombre: pedidoData.cliente.nombre.trim(),
        telefono: pedidoData.cliente.telefono.trim(),
        direccion: pedidoData.cliente.direccion.trim(),
        email: pedidoData.cliente.email?.trim() || null
      },
      productos: pedidoData.productos.map(p => ({
        id: p.id,
        nombre: p.nombre,
        precio: Number(p.precio),
        cantidad: p.cantidad || 1,
        descripcion: p.descripcion || '',
        tipo: p.tipo || 'producto',
        emoji: p.emoji || '🛍️',
        personalizacion: p.personalizacion || null
      })),
      total: Number(pedidoData.total),
      observaciones: pedidoData.observaciones?.trim() || '',
      estado: 'pendiente',
      fecha: new Date().toISOString(),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
  }

  /**
   * Crea un nuevo pedido
   * @param {Object} pedidoData 
   * @returns {Promise<string>} ID del pedido creado
   */
  async crearPedido(pedidoData) {
    try {
      this.setLoading(true);

      // Validar datos
      const pedidoValidado = this.validarPedido(pedidoData);

      // Guardar en Firestore
      if (!this.db) {
        throw new Error('Firestore no inicializado');
      }

      const docRef = await this.db.collection('pedidos').add(pedidoValidado);
      
      console.log('✅ Pedido creado en Firestore:', docRef.id);

      // Enviar notificación a n8n
      await this.enviarNotificacion({
        ...pedidoValidado,
        id: docRef.id
      });

      this.setLoading(false);
      
      return docRef.id;

    } catch (error) {
      console.error('❌ Error creando pedido:', error);
      this.setLoading(false);
      throw error;
    }
  }

  /**
   * Obtiene pedidos con filtros para el admin
   * @param {Object} filtros 
   * @returns {Promise<Array>}
   */
  async obtenerPedidosAdmin(filtros = {}) {
    try {
      this.setLoading(true);

      if (!this.db) {
        throw new Error('Firestore no inicializado');
      }

      let query = this.db.collection('pedidos');

      // Aplicar filtros
      if (filtros.estado) {
        query = query.where('estado', '==', filtros.estado);
      }

      if (filtros.fechaDesde) {
        query = query.where('createdAt', '>=', filtros.fechaDesde);
      }

      if (filtros.fechaHasta) {
        query = query.where('createdAt', '<=', filtros.fechaHasta);
      }

      // Ordenar por fecha (más recientes primero)
      query = query.orderBy('createdAt', 'desc');

      // Limitar resultados
      if (filtros.limite) {
        query = query.limit(filtros.limite);
      }

      const querySnapshot = await query.get();
      
      const pedidos = [];
      querySnapshot.forEach((doc) => {
        pedidos.push({
          id: doc.id, // IMPORTANTE: Usar el ID del documento de Firestore
          firestoreId: doc.id,
          ...doc.data()
        });
      });

      console.log(`✅ ${pedidos.length} pedidos obtenidos de Firestore`);
      
      this.setLoading(false);
      
      return pedidos;

    } catch (error) {
      console.error('❌ Error obteniendo pedidos:', error);
      this.setLoading(false);
      throw error;
    }
  }

  /**
   * Obtiene un pedido por ID
   * @param {string} id 
   * @returns {Promise<Object|null>}
   */
  async obtenerPedidoPorId(id) {
    try {
      if (!this.db) {
        throw new Error('Firestore no inicializado');
      }

      const doc = await this.db.collection('pedidos').doc(id).get();
      
      if (!doc.exists) {
        console.warn(`⚠️ Pedido ${id} no encontrado`);
        return null;
      }

      return {
        id: doc.id,
        firestoreId: doc.id,
        ...doc.data()
      };

    } catch (error) {
      console.error('❌ Error obteniendo pedido:', error);
      throw error;
    }
  }

  /**
   * Actualiza el estado de un pedido
   * @param {string} id - ID del documento en Firestore
   * @param {string} nuevoEstado 
   * @returns {Promise<void>}
   */
  async actualizarEstadoPedido(id, nuevoEstado) {
    try {
      if (!this.db) {
        throw new Error('Firestore no inicializado');
      }

      // Validar estado
      const estadosValidos = [
        'pendiente',
        'confirmado',
        'en_preparacion',
        'en_camino',
        'entregado',
        'cancelado'
      ];

      if (!estadosValidos.includes(nuevoEstado)) {
        throw new Error(`Estado inválido: ${nuevoEstado}`);
      }

      console.log(`🔄 Actualizando pedido ${id} a estado: ${nuevoEstado}`);

      // Actualizar en Firestore usando el ID del documento
      await this.db.collection('pedidos').doc(id).update({
        estado: nuevoEstado,
        updatedAt: new Date().toISOString(),
        [`historial.${nuevoEstado}`]: new Date().toISOString()
      });

      console.log(`✅ Estado del pedido ${id} actualizado a: ${nuevoEstado}`);

    } catch (error) {
      console.error('❌ Error actualizando estado del pedido:', error);
      throw error;
    }
  }

  /**
   * Obtiene estadísticas de pedidos
   * @returns {Promise<Object>}
   */
  async obtenerEstadisticas() {
    try {
      if (!this.db) {
        throw new Error('Firestore no inicializado');
      }

      const querySnapshot = await this.db.collection('pedidos').get();
      
      const stats = {
        total: 0,
        pendientes: 0,
        confirmados: 0,
        enPreparacion: 0,
        enCamino: 0,
        entregados: 0,
        cancelados: 0,
        totalVentas: 0
      };

      querySnapshot.forEach((doc) => {
        const pedido = doc.data();
        stats.total++;
        stats.totalVentas += pedido.total || 0;

        switch (pedido.estado) {
          case 'pendiente':
            stats.pendientes++;
            break;
          case 'confirmado':
            stats.confirmados++;
            break;
          case 'en_preparacion':
            stats.enPreparacion++;
            break;
          case 'en_camino':
            stats.enCamino++;
            break;
          case 'entregado':
            stats.entregados++;
            break;
          case 'cancelado':
            stats.cancelados++;
            break;
        }
      });

      console.log('📊 Estadísticas calculadas:', stats);
      
      return stats;

    } catch (error) {
      console.error('❌ Error obteniendo estadísticas:', error);
      throw error;
    }
  }

  /**
   * Envía notificación a n8n
   * @param {Object} pedido 
   */
  async enviarNotificacion(pedido) {
    if (!this.n8nConfig || !this.n8nConfig.enabled || !this.n8nConfig.webhookUrl) {
      console.warn('⚠️ n8n no configurado, omitiendo notificación');
      return;
    }

    try {
      const response = await fetch(this.n8nConfig.webhookUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(pedido)
      });

      if (response.ok) {
        console.log('✅ Notificación enviada a n8n');
      } else {
        console.warn('⚠️ Error enviando notificación a n8n:', response.status);
      }
    } catch (error) {
      console.warn('⚠️ Error enviando notificación a n8n:', error.message);
      // No lanzar error para no interrumpir el flujo del pedido
    }
  }

  /**
   * Estado de carga
   * @param {boolean} isLoading 
   */
  setLoading(isLoading) {
    this.loading = isLoading;
    this.notifyListeners({ loading: isLoading });
  }

  /**
   * Suscribirse a cambios
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
}

// Crear instancia singleton
const pedidosService = new PedidosService();

// Exportar
if (typeof module !== 'undefined' && module.exports) {
  module.exports = pedidosService;
}

