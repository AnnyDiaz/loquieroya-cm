/* ============================================
   🔌 API Service - Lo Quiero YA CM
   Servicio para comunicarse con FastAPI backend
   ============================================ */

class ApiService {
  constructor() {
    // Usar configuración dinámica si está disponible
    if (typeof window !== 'undefined' && window.API_CONFIG) {
      this.baseURL = window.API_CONFIG.baseURL;
      this.timeout = window.API_CONFIG.timeout || 5000;
      console.log(`🔌 API Service configurado: ${this.baseURL}`);
    } else {
      // Fallback a localhost
      this.baseURL = 'http://localhost:8000';
      this.timeout = 5000;
      console.warn('⚠️ Usando configuración por defecto (localhost)');
    }
    this.token = localStorage.getItem('api_token');
  }

  /**
   * Obtiene el token de autenticación
   */
  getToken() {
    return localStorage.getItem('api_token');
  }

  /**
   * Guarda el token de autenticación
   */
  setToken(token) {
    localStorage.setItem('api_token', token);
    this.token = token;
  }

  /**
   * Elimina el token de autenticación
   */
  clearToken() {
    localStorage.removeItem('api_token');
    this.token = null;
  }

  /**
   * Headers por defecto
   */
  getHeaders(includeAuth = true) {
    const headers = {};
    
    if (includeAuth && this.token) {
      headers['Authorization'] = `Bearer ${this.token}`;
    }
    
    return headers;
  }

  /**
   * Maneja errores de la API
   */
  handleError(error, response) {
    console.error('❌ Error en API:', error);
    
    if (response) {
      if (response.status === 401) {
        this.clearToken();
        throw new Error('Sesión expirada. Por favor, inicia sesión nuevamente.');
      } else if (response.status === 403) {
        throw new Error('No tienes permisos para realizar esta acción.');
      } else if (response.status === 404) {
        throw new Error('Recurso no encontrado.');
      }
    }
    
    throw error;
  }

  // ==================== AUTENTICACIÓN ====================

  /**
   * Inicia sesión
   */
  async login(email, password) {
    try {
      const response = await fetch(`${this.baseURL}/auth/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ email, password })
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.detail || 'Error al iniciar sesión');
      }

      const data = await response.json();
      this.setToken(data.access_token);
      
      console.log('✅ Login exitoso');
      return data;
    } catch (error) {
      this.handleError(error);
    }
  }

  /**
   * Obtiene información del usuario actual
   */
  async getMe() {
    try {
      const response = await fetch(`${this.baseURL}/auth/me`, {
        headers: this.getHeaders()
      });

      if (!response.ok) {
        this.handleError(new Error('Error obteniendo usuario'), response);
      }

      return await response.json();
    } catch (error) {
      this.handleError(error);
    }
  }

  // ==================== PRODUCTOS ====================

  /**
   * Lista productos
   */
  async getProductos(params = {}) {
    try {
      const queryParams = new URLSearchParams();
      
      if (params.categoria) queryParams.append('categoria', params.categoria);
      if (params.disponible !== undefined) queryParams.append('disponible', params.disponible);
      if (params.skip) queryParams.append('skip', params.skip);
      if (params.limit) queryParams.append('limit', params.limit);

      const url = `${this.baseURL}/productos/?${queryParams}`;
      const response = await fetch(url, {
        headers: this.getHeaders(false) // Público
      });

      if (!response.ok) {
        this.handleError(new Error('Error obteniendo productos'), response);
      }

      return await response.json();
    } catch (error) {
      this.handleError(error);
    }
  }

  /**
   * Obtiene un producto por ID
   */
  async getProducto(id) {
    try {
      const response = await fetch(`${this.baseURL}/productos/${id}`, {
        headers: this.getHeaders(false) // Público
      });

      if (!response.ok) {
        this.handleError(new Error('Error obteniendo producto'), response);
      }

      return await response.json();
    } catch (error) {
      this.handleError(error);
    }
  }

  /**
   * Crea un nuevo producto
   */
  async crearProducto(producto) {
    try {
      const formData = new FormData();
      formData.append('nombre', producto.nombre);
      formData.append('descripcion', producto.descripcion || '');
      formData.append('precio', producto.precio);
      formData.append('categoria', producto.categoria);
      formData.append('disponible', producto.disponible || 1);

      const response = await fetch(`${this.baseURL}/productos/`, {
        method: 'POST',
        headers: this.getHeaders(),
        body: formData
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.detail || 'Error creando producto');
      }

      const data = await response.json();
      console.log('✅ Producto creado:', data);
      return data;
    } catch (error) {
      this.handleError(error);
    }
  }

  /**
   * Actualiza un producto
   */
  async actualizarProducto(id, updates) {
    try {
      const formData = new FormData();
      
      if (updates.nombre !== undefined) formData.append('nombre', updates.nombre);
      if (updates.descripcion !== undefined) formData.append('descripcion', updates.descripcion);
      if (updates.precio !== undefined) formData.append('precio', updates.precio);
      if (updates.categoria !== undefined) formData.append('categoria', updates.categoria);
      if (updates.disponible !== undefined) formData.append('disponible', updates.disponible);

      const response = await fetch(`${this.baseURL}/productos/${id}`, {
        method: 'PUT',
        headers: this.getHeaders(),
        body: formData
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.detail || 'Error actualizando producto');
      }

      const data = await response.json();
      console.log('✅ Producto actualizado:', data);
      return data;
    } catch (error) {
      this.handleError(error);
    }
  }

  /**
   * Elimina un producto
   */
  async eliminarProducto(id) {
    try {
      const response = await fetch(`${this.baseURL}/productos/${id}`, {
        method: 'DELETE',
        headers: this.getHeaders()
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.detail || 'Error eliminando producto');
      }

      const data = await response.json();
      console.log('✅ Producto eliminado:', data);
      return data;
    } catch (error) {
      this.handleError(error);
    }
  }

  /**
   * Sube imágenes para un producto
   */
  async subirImagenes(productoId, imagenes) {
    try {
      const formData = new FormData();
      
      // Agregar todas las imágenes
      imagenes.forEach(imagen => {
        formData.append('imagenes', imagen);
      });

      const response = await fetch(`${this.baseURL}/productos/${productoId}/imagenes`, {
        method: 'POST',
        headers: this.getHeaders(),
        body: formData
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.detail || 'Error subiendo imágenes');
      }

      const data = await response.json();
      console.log('✅ Imágenes subidas:', data);
      return data;
    } catch (error) {
      this.handleError(error);
    }
  }

  /**
   * Elimina una imagen específica
   */
  async eliminarImagen(productoId, imagenId) {
    try {
      const response = await fetch(`${this.baseURL}/productos/${productoId}/imagenes/${imagenId}`, {
        method: 'DELETE',
        headers: this.getHeaders()
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.detail || 'Error eliminando imagen');
      }

      const data = await response.json();
      console.log('✅ Imagen eliminada:', data);
      return data;
    } catch (error) {
      this.handleError(error);
    }
  }

  /**
   * Obtiene la URL completa de una imagen
   */
  getImageUrl(urlRelativa) {
    if (!urlRelativa) return null;
    if (urlRelativa.startsWith('http')) return urlRelativa;
    return `${this.baseURL}${urlRelativa}`;
  }
}

// Crear instancia singleton
const apiService = new ApiService();

// Exportar
if (typeof module !== 'undefined' && module.exports) {
  module.exports = apiService;
}

