/* ============================================
   👨‍💼 Admin Service - Lo Quiero YA CM
   Servicio de administración con listeners en tiempo real
   ============================================ */

/**
 * Servicio de Administración
 */
class AdminService {
  constructor() {
    this.db = null;
    this.unsubscribers = [];
    this.pedidosCache = [];
    this.estadisticas = {
      totalPedidos: 0,
      pendientes: 0,
      confirmados: 0,
      enPreparacion: 0,
      enCamino: 0,
      entregados: 0,
      cancelados: 0,
      totalVentas: 0,
      ventasHoy: 0,
      pedidosHoy: 0
    };
    this.listeners = [];
  }

  /**
   * Inicializa el servicio
   * @param {Object} firestore - Instancia de Firestore
   */
  initialize(firestore) {
    this.db = firestore;
    console.log('✅ AdminService inicializado');
  }

  /**
   * Carga pedidos en tiempo real con listener
   * @param {Object} filtros - Filtros opcionales
   * @returns {Function} Función para detener el listener
   */
  cargarPedidosEnTiempoReal(filtros = {}) {
    try {
      if (!this.db) {
        throw new Error('Firestore no inicializado');
      }

      // Detener listeners anteriores
      this.detenerListeners();

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

      console.log('🔄 Iniciando listener de pedidos en tiempo real...');

      // Crear listener
      const unsubscribe = query.onSnapshot(
        (snapshot) => {
          const pedidos = [];
          const cambios = snapshot.docChanges();

          snapshot.forEach((doc) => {
            pedidos.push({
              id: doc.id,
              firestoreId: doc.id,
              ...doc.data()
            });
          });

          // Actualizar cache
          this.pedidosCache = pedidos;

          // Calcular estadísticas automáticamente
          this.generarEstadisticas(pedidos);

          // Notificar cambios
          this.notifyListeners({
            type: 'pedidos_updated',
            pedidos,
            cambios: cambios.map(change => ({
              tipo: change.type,
              pedido: {
                id: change.doc.id,
                ...change.doc.data()
              }
            })),
            timestamp: new Date().toISOString()
          });

          console.log(`✅ ${pedidos.length} pedidos cargados en tiempo real`);
        },
        (error) => {
          console.error('❌ Error en listener de pedidos:', error);
          this.notifyListeners({
            type: 'error',
            error: error.message
          });
        }
      );

      // Guardar unsubscriber
      this.unsubscribers.push(unsubscribe);

      return unsubscribe;

    } catch (error) {
      console.error('❌ Error configurando listener:', error);
      throw error;
    }
  }

  /**
   * Filtra pedidos con múltiples criterios
   * @param {Object} filtros 
   * @returns {Array}
   */
  filtrarPedidos(filtros = {}) {
    let pedidos = [...this.pedidosCache];

    // Filtrar por estado
    if (filtros.estado && filtros.estado !== 'todos') {
      pedidos = pedidos.filter(p => p.estado === filtros.estado);
    }

    // Filtrar por fecha
    if (filtros.fechaDesde) {
      const fechaDesde = new Date(filtros.fechaDesde).getTime();
      pedidos = pedidos.filter(p => {
        const fechaPedido = new Date(p.createdAt).getTime();
        return fechaPedido >= fechaDesde;
      });
    }

    if (filtros.fechaHasta) {
      const fechaHasta = new Date(filtros.fechaHasta).getTime();
      pedidos = pedidos.filter(p => {
        const fechaPedido = new Date(p.createdAt).getTime();
        return fechaPedido <= fechaHasta;
      });
    }

    // Búsqueda por texto (cliente, ID, teléfono)
    if (filtros.busqueda && filtros.busqueda.trim().length > 0) {
      const busqueda = filtros.busqueda.toLowerCase().trim();
      pedidos = pedidos.filter(p => {
        const nombre = p.cliente?.nombre?.toLowerCase() || '';
        const telefono = p.cliente?.telefono || '';
        const id = p.id?.toString() || '';
        
        return nombre.includes(busqueda) || 
               telefono.includes(busqueda) || 
               id.includes(busqueda);
      });
    }

    // Ordenar
    if (filtros.ordenar) {
      switch (filtros.ordenar) {
        case 'fecha_desc':
          pedidos.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
          break;
        case 'fecha_asc':
          pedidos.sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt));
          break;
        case 'total_desc':
          pedidos.sort((a, b) => (b.total || 0) - (a.total || 0));
          break;
        case 'total_asc':
          pedidos.sort((a, b) => (a.total || 0) - (b.total || 0));
          break;
      }
    }

    console.log(`🔍 ${pedidos.length} pedidos filtrados`);
    
    return pedidos;
  }

  /**
   * Actualiza el estado de un pedido con validación
   * @param {string} id 
   * @param {string} nuevoEstado 
   * @param {string} observaciones - Observaciones opcionales
   * @returns {Promise<void>}
   */
  async actualizarEstadoPedido(id, nuevoEstado, observaciones = '') {
    try {
      if (!this.db) {
        throw new Error('Firestore no inicializado');
      }

      // Estados válidos
      const estadosValidos = {
        pendiente: { siguiente: ['confirmado', 'cancelado'] },
        confirmado: { siguiente: ['en_preparacion', 'cancelado'] },
        en_preparacion: { siguiente: ['en_camino', 'cancelado'] },
        en_camino: { siguiente: ['entregado', 'cancelado'] },
        entregado: { siguiente: [] },
        cancelado: { siguiente: [] }
      };

      // Validar estado
      if (!estadosValidos[nuevoEstado]) {
        throw new Error(`Estado inválido: ${nuevoEstado}`);
      }

      // Buscar pedido en cache primero
      const pedido = this.pedidosCache.find(p => p.id === id || p.firestoreId === id);
      
      // Si no está en cache, buscar en Firestore directamente
      let estadoActual = 'pendiente';
      if (pedido) {
        estadoActual = pedido.estado || 'pendiente';
        
        // Validar transición de estado
        const transicionesPermitidas = estadosValidos[estadoActual]?.siguiente || [];
        
        if (!transicionesPermitidas.includes(nuevoEstado) && estadoActual !== nuevoEstado) {
          console.warn(`⚠️ Transición no recomendada: ${estadoActual} → ${nuevoEstado}`);
        }
      } else {
        console.warn(`⚠️ Pedido ${id} no encontrado en cache, actualizando directamente`);
      }

      console.log(`🔄 Actualizando pedido ${id}: ${estadoActual} → ${nuevoEstado}`);

      // Actualizar en Firestore
      const updateData = {
        estado: nuevoEstado,
        updatedAt: new Date().toISOString(),
        [`historial.${nuevoEstado}`]: new Date().toISOString()
      };

      if (observaciones) {
        updateData[`observaciones_${nuevoEstado}`] = observaciones;
      }

      await this.db.collection('pedidos').doc(id).update(updateData);

      console.log(`✅ Estado actualizado: ${id} → ${nuevoEstado}`);

    } catch (error) {
      console.error('❌ Error actualizando estado:', error);
      throw error;
    }
  }

  /**
   * Genera estadísticas automáticas
   * @param {Array} pedidos - Array de pedidos
   * @returns {Object}
   */
  generarEstadisticas(pedidos = null) {
    const pedidosAAnalizar = pedidos || this.pedidosCache;
    
    const stats = {
      totalPedidos: pedidosAAnalizar.length,
      pendientes: 0,
      confirmados: 0,
      enPreparacion: 0,
      enCamino: 0,
      entregados: 0,
      cancelados: 0,
      totalVentas: 0,
      ventasHoy: 0,
      pedidosHoy: 0,
      promedioVenta: 0,
      ticketMasAlto: 0,
      ticketMasBajo: Infinity,
      clientesUnicos: new Set()
    };

    const hoy = new Date();
    hoy.setHours(0, 0, 0, 0);

    pedidosAAnalizar.forEach(pedido => {
      // Contar por estado
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

      // Calcular ventas
      const total = pedido.total || 0;
      stats.totalVentas += total;

      // Tickets
      if (total > stats.ticketMasAlto) {
        stats.ticketMasAlto = total;
      }
      if (total < stats.ticketMasBajo && total > 0) {
        stats.ticketMasBajo = total;
      }

      // Pedidos de hoy
      const fechaPedido = new Date(pedido.createdAt);
      if (fechaPedido >= hoy) {
        stats.pedidosHoy++;
        stats.ventasHoy += total;
      }

      // Clientes únicos
      if (pedido.cliente?.email) {
        stats.clientesUnicos.add(pedido.cliente.email);
      } else if (pedido.cliente?.telefono) {
        stats.clientesUnicos.add(pedido.cliente.telefono);
      }
    });

    // Promedios
    stats.promedioVenta = stats.totalPedidos > 0 
      ? Math.round(stats.totalVentas / stats.totalPedidos) 
      : 0;

    stats.clientesUnicos = stats.clientesUnicos.size;

    if (stats.ticketMasBajo === Infinity) {
      stats.ticketMasBajo = 0;
    }

    // Guardar en cache
    this.estadisticas = stats;

    console.log('📊 Estadísticas generadas:', stats);

    return stats;
  }

  /**
   * Exporta pedidos a CSV
   * @param {Array} pedidos - Array de pedidos a exportar
   * @param {string} nombreArchivo - Nombre del archivo
   */
  exportarCSV(pedidos = null, nombreArchivo = 'pedidos') {
    try {
      const pedidosAExportar = pedidos || this.pedidosCache;

      if (pedidosAExportar.length === 0) {
        throw new Error('No hay pedidos para exportar');
      }

      // Crear CSV
      const headers = [
        'ID',
        'Fecha',
        'Cliente',
        'Teléfono',
        'Dirección',
        'Estado',
        'Total',
        'Productos',
        'Observaciones'
      ];

      const rows = pedidosAExportar.map(p => {
        const productos = p.productos
          ?.map(prod => `${prod.nombre} (${prod.cantidad || 1})`)
          .join('; ') || '';

        return [
          p.id || '',
          new Date(p.createdAt).toLocaleString('es-CO'),
          p.cliente?.nombre || '',
          p.cliente?.telefono || '',
          p.cliente?.direccion || '',
          p.estado || '',
          p.total || 0,
          productos,
          p.observaciones || ''
        ];
      });

      // Construir CSV
      let csv = headers.join(',') + '\n';
      rows.forEach(row => {
        csv += row.map(cell => `"${cell}"`).join(',') + '\n';
      });

      // Descargar
      this.descargarArchivo(csv, `${nombreArchivo}_${Date.now()}.csv`, 'text/csv');

      console.log(`✅ CSV exportado: ${pedidosAExportar.length} pedidos`);

    } catch (error) {
      console.error('❌ Error exportando CSV:', error);
      throw error;
    }
  }

  /**
   * Exporta pedidos a Excel (formato HTML que Excel puede abrir)
   * @param {Array} pedidos 
   * @param {string} nombreArchivo 
   */
  exportarExcel(pedidos = null, nombreArchivo = 'pedidos') {
    try {
      const pedidosAExportar = pedidos || this.pedidosCache;

      if (pedidosAExportar.length === 0) {
        throw new Error('No hay pedidos para exportar');
      }

      // Crear tabla HTML
      let html = `
        <html xmlns:o="urn:schemas-microsoft-com:office:office" xmlns:x="urn:schemas-microsoft-com:office:excel">
        <head><meta charset="UTF-8"></head>
        <body>
        <table border="1">
          <thead>
            <tr style="background-color: #FF6B9D; color: white; font-weight: bold;">
              <th>ID</th>
              <th>Fecha</th>
              <th>Cliente</th>
              <th>Teléfono</th>
              <th>Dirección</th>
              <th>Estado</th>
              <th>Total</th>
              <th>Productos</th>
              <th>Observaciones</th>
            </tr>
          </thead>
          <tbody>
      `;

      pedidosAExportar.forEach(p => {
        const productos = p.productos
          ?.map(prod => `${prod.nombre} (${prod.cantidad || 1})`)
          .join(', ') || '';

        html += `
          <tr>
            <td>${p.id || ''}</td>
            <td>${new Date(p.createdAt).toLocaleString('es-CO')}</td>
            <td>${p.cliente?.nombre || ''}</td>
            <td>${p.cliente?.telefono || ''}</td>
            <td>${p.cliente?.direccion || ''}</td>
            <td>${p.estado || ''}</td>
            <td>$${(p.total || 0).toLocaleString('es-CO')}</td>
            <td>${productos}</td>
            <td>${p.observaciones || ''}</td>
          </tr>
        `;
      });

      html += `
          </tbody>
        </table>
        </body>
        </html>
      `;

      this.descargarArchivo(html, `${nombreArchivo}_${Date.now()}.xls`, 'application/vnd.ms-excel');

      console.log(`✅ Excel exportado: ${pedidosAExportar.length} pedidos`);

    } catch (error) {
      console.error('❌ Error exportando Excel:', error);
      throw error;
    }
  }

  /**
   * Descarga un archivo
   * @param {string} contenido 
   * @param {string} nombreArchivo 
   * @param {string} tipo 
   */
  descargarArchivo(contenido, nombreArchivo, tipo) {
    const blob = new Blob([contenido], { type: tipo });
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = nombreArchivo;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    window.URL.revokeObjectURL(url);
  }

  /**
   * Detiene todos los listeners activos
   */
  detenerListeners() {
    this.unsubscribers.forEach(unsubscribe => unsubscribe());
    this.unsubscribers = [];
    console.log('🛑 Listeners detenidos');
  }

  /**
   * Suscribirse a cambios
   * @param {Function} callback 
   * @returns {Function}
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
   * Limpia el servicio
   */
  cleanup() {
    this.detenerListeners();
    this.pedidosCache = [];
    this.estadisticas = {};
    this.listeners = [];
  }
}

// Crear instancia singleton
const adminService = new AdminService();

// Exportar
if (typeof module !== 'undefined' && module.exports) {
  module.exports = adminService;
}

