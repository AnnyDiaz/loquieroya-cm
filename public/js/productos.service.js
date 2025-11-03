/* ============================================
   🛍️ Productos Service - Lo Quiero YA CM
   Servicio para gestión de productos con cache
   ============================================ */

/**
 * Servicio de Productos con cache inteligente
 */
class ProductosService {
  constructor() {
    this.cache = {
      productos: null,
      timestamp: null,
      ttl: 5 * 60 * 1000 // 5 minutos
    };
    this.db = null;
    this.loading = false;
    this.listeners = [];
  }

  /**
   * Inicializa el servicio
   * @param {Object} firestore - Instancia de Firestore
   */
  initialize(firestore) {
    this.db = firestore;
    console.log('✅ ProductosService inicializado');
  }

  /**
   * Verifica si el cache es válido
   * @returns {boolean}
   */
  isCacheValid() {
    if (!this.cache.productos || !this.cache.timestamp) {
      return false;
    }
    
    const now = Date.now();
    const elapsed = now - this.cache.timestamp;
    
    return elapsed < this.cache.ttl;
  }

  /**
   * Invalida el cache
   */
  invalidateCache() {
    this.cache.productos = null;
    this.cache.timestamp = null;
    console.log('🗑️ Cache de productos invalidado');
  }

  /**
   * Obtiene todos los productos con filtros opcionales
   * @param {Object} opciones - Opciones de filtrado
   * @param {string} opciones.categoria - Filtrar por categoría
   * @param {boolean} opciones.disponible - Filtrar por disponibilidad
   * @param {boolean} opciones.forceRefresh - Forzar recarga desde BD
   * @returns {Promise<Array>}
   */
  async obtenerProductos(opciones = {}) {
    const {
      categoria = null,
      disponible = null,
      forceRefresh = false
    } = opciones;

    try {
      // Si hay cache válido y no se fuerza refresh, retornar cache
      if (!forceRefresh && this.isCacheValid()) {
        console.log('📦 Productos obtenidos desde cache');
        return this.filtrarProductos(this.cache.productos, { categoria, disponible });
      }

      // Marcar como cargando
      this.setLoading(true);

      // Si no hay Firestore, retornar productos de ejemplo
      if (!this.db) {
        console.warn('⚠️ Firestore no inicializado, usando productos de ejemplo');
        const productosEjemplo = this.getProductosEjemplo();
        this.cache.productos = productosEjemplo;
        this.cache.timestamp = Date.now();
        this.setLoading(false);
        return this.filtrarProductos(productosEjemplo, { categoria, disponible });
      }

      // Obtener de Firestore
      const querySnapshot = await this.db.collection('productos').get();
      
      const productos = [];
      querySnapshot.forEach((doc) => {
        productos.push({
          id: doc.id,
          ...doc.data()
        });
      });

      // Actualizar cache
      this.cache.productos = productos;
      this.cache.timestamp = Date.now();
      
      console.log(`✅ ${productos.length} productos obtenidos de Firestore`);
      
      this.setLoading(false);
      
      return this.filtrarProductos(productos, { categoria, disponible });

    } catch (error) {
      console.error('❌ Error obteniendo productos:', error);
      this.setLoading(false);
      
      // Si hay cache, retornarlo aunque esté expirado
      if (this.cache.productos) {
        console.warn('⚠️ Usando cache expirado debido a error');
        return this.filtrarProductos(this.cache.productos, { categoria, disponible });
      }
      
      throw error;
    }
  }

  /**
   * Filtra productos según criterios
   * @param {Array} productos 
   * @param {Object} filtros 
   * @returns {Array}
   */
  filtrarProductos(productos, filtros) {
    let resultado = [...productos];

    if (filtros.categoria) {
      resultado = resultado.filter(p => p.categoria === filtros.categoria);
    }

    if (filtros.disponible !== null) {
      resultado = resultado.filter(p => p.disponible === filtros.disponible);
    }

    return resultado;
  }

  /**
   * Obtiene un producto por ID
   * @param {string} id 
   * @returns {Promise<Object|null>}
   */
  async obtenerProductoPorId(id) {
    try {
      // Buscar en cache primero
      if (this.isCacheValid()) {
        const producto = this.cache.productos.find(p => p.id === id);
        if (producto) {
          console.log('📦 Producto obtenido desde cache');
          return producto;
        }
      }

      // Buscar en Firestore
      if (!this.db) {
        console.warn('⚠️ Firestore no inicializado');
        return null;
      }

      const doc = await this.db.collection('productos').doc(id).get();
      
      if (!doc.exists) {
        console.warn(`⚠️ Producto ${id} no encontrado`);
        return null;
      }

      return {
        id: doc.id,
        ...doc.data()
      };

    } catch (error) {
      console.error('❌ Error obteniendo producto:', error);
      throw error;
    }
  }

  /**
   * Crea un nuevo producto
   * @param {Object} productoData 
   * @returns {Promise<string>} ID del producto creado
   */
  async crearProducto(productoData) {
    try {
      if (!this.db) {
        throw new Error('Firestore no inicializado');
      }

      // Agregar timestamps
      const producto = {
        ...productoData,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };

      const docRef = await this.db.collection('productos').add(producto);
      
      console.log('✅ Producto creado:', docRef.id);
      
      // Invalidar cache
      this.invalidateCache();
      
      return docRef.id;

    } catch (error) {
      console.error('❌ Error creando producto:', error);
      throw error;
    }
  }

  /**
   * Actualiza un producto existente
   * @param {string} id 
   * @param {Object} updates 
   * @returns {Promise<void>}
   */
  async actualizarProducto(id, updates) {
    try {
      if (!this.db) {
        throw new Error('Firestore no inicializado');
      }

      const updateData = {
        ...updates,
        updatedAt: new Date().toISOString()
      };

      await this.db.collection('productos').doc(id).update(updateData);
      
      console.log('✅ Producto actualizado:', id);
      
      // Invalidar cache
      this.invalidateCache();

    } catch (error) {
      console.error('❌ Error actualizando producto:', error);
      throw error;
    }
  }

  /**
   * Elimina un producto (soft delete)
   * @param {string} id 
   * @returns {Promise<void>}
   */
  async eliminarProducto(id) {
    try {
      if (!this.db) {
        throw new Error('Firestore no inicializado');
      }

      // Soft delete
      await this.db.collection('productos').doc(id).update({
        disponible: false,
        deletedAt: new Date().toISOString()
      });
      
      console.log('✅ Producto eliminado (soft delete):', id);
      
      // Invalidar cache
      this.invalidateCache();

    } catch (error) {
      console.error('❌ Error eliminando producto:', error);
      throw error;
    }
  }

  /**
   * Obtiene productos de ejemplo (fallback)
   * @returns {Array}
   */
  getProductosEjemplo() {
    // Retornar array vacío - usar solo productos de la API
    return [];
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
const productosService = new ProductosService();

// Exportar
if (typeof module !== 'undefined' && module.exports) {
  module.exports = productosService;
}

