/* ============================================
   🍰 Gestión de Productos - Panel Admin
   ============================================ */

class AdminProductos {
  constructor() {
    this.productos = [];
    this.productoEditando = null;
    this.imagenesSeleccionadas = [];
    this.imagenesParaEliminar = [];
    this.categorias = [
      'anchetas',
      'mini-donas',
      'postres',
      'dulces',
      'chocolates',
      'otros'
    ];
  }

  /**
   * Inicializa el módulo
   */
  async init() {
    console.log('🍰 Inicializando gestión de productos...');
    
    // Autenticarse en el backend si no hay token
    await this.autenticarBackend();
    
    this.setupEventListeners();
    await this.cargarProductos();
  }

  /**
   * Autentica en el backend FastAPI
   */
  async autenticarBackend() {
    try {
      // Verificar si ya hay token
      if (apiService.getToken()) {
        console.log('✅ Ya hay token de API guardado');
        return;
      }

      // Hacer login automático con credenciales admin
      console.log('🔐 Autenticando en backend FastAPI...');
      await apiService.login('admin@loquieroyacm.com', 'admin123');
      console.log('✅ Autenticado en backend');
    } catch (error) {
      console.error('❌ Error autenticando en backend:', error);
      this.mostrarError('Error de autenticación. Por favor recarga la página.');
    }
  }

  /**
   * Configura event listeners
   */
  setupEventListeners() {
    // Botón nuevo producto
    const btnNuevo = document.getElementById('btn-nuevo-producto');
    if (btnNuevo) {
      btnNuevo.addEventListener('click', () => this.mostrarFormulario());
    }

    // Formulario
    const form = document.getElementById('form-producto');
    if (form) {
      form.addEventListener('submit', (e) => this.guardarProducto(e));
    }

    // Selector de imágenes
    const inputImagenes = document.getElementById('producto-imagenes');
    if (inputImagenes) {
      inputImagenes.addEventListener('change', (e) => this.previsualizarImagenes(e));
    }

    // Botón cancelar
    const btnCancelar = document.getElementById('btn-cancelar-producto');
    if (btnCancelar) {
      btnCancelar.addEventListener('click', () => this.ocultarFormulario());
    }
  }

  /**
   * Carga productos desde la API
   */
  async cargarProductos() {
    try {
      this.mostrarLoading(true);
      
      const response = await apiService.getProductos({
        limit: 1000
      });

      this.productos = response.productos || [];
      this.renderizarProductos();
      
      console.log(`✅ ${this.productos.length} productos cargados`);
    } catch (error) {
      console.error('❌ Error cargando productos:', error);
      this.mostrarError('Error cargando productos: ' + error.message);
    } finally {
      this.mostrarLoading(false);
    }
  }

  /**
   * Renderiza la tabla de productos
   */
  renderizarProductos() {
    const tbody = document.getElementById('tabla-productos-body');
    if (!tbody) return;

    if (this.productos.length === 0) {
      tbody.innerHTML = `
        <tr>
          <td colspan="7" style="text-align: center; padding: 40px;">
            <div style="color: var(--color-text-secondary);">
              <p style="font-size: 3rem; margin: 0;">🍰</p>
              <p style="margin: 10px 0 0 0;">No hay productos todavía</p>
              <button class="btn-primary" onclick="adminProductos.mostrarFormulario()" style="margin-top: 20px;">
                ➕ Crear Primer Producto
              </button>
            </div>
          </td>
        </tr>
      `;
      return;
    }

    tbody.innerHTML = this.productos.map(producto => `
      <tr>
        <td>${producto.id}</td>
        <td>
          <div style="display: flex; align-items: center; gap: 10px;">
            ${producto.imagenes && producto.imagenes.length > 0 ? `
              <img src="${apiService.getImageUrl(producto.imagenes[0].url_imagen)}" 
                   alt="${producto.nombre}"
                   style="width: 50px; height: 50px; object-fit: cover; border-radius: 5px;">
            ` : `
              <div style="width: 50px; height: 50px; background: var(--color-bg-secondary); border-radius: 5px; display: flex; align-items: center; justify-content: center;">
                🖼️
              </div>
            `}
            <strong>${this.escapeHtml(producto.nombre)}</strong>
          </div>
        </td>
        <td>${this.truncar(producto.descripcion, 50)}</td>
        <td><strong>$${this.formatearPrecio(producto.precio)}</strong></td>
        <td>
          <span class="badge badge-${producto.categoria}">
            ${this.getCategoriaEmoji(producto.categoria)} ${producto.categoria}
          </span>
        </td>
        <td>
          <span class="badge ${producto.disponible ? 'badge-success' : 'badge-error'}">
            ${producto.disponible ? '✅ Disponible' : '❌ No disponible'}
          </span>
        </td>
        <td>
          <div style="display: flex; gap: 5px;">
            <button class="btn-icon" onclick="adminProductos.editarProducto(${producto.id})" title="Editar">
              ✏️
            </button>
            <button class="btn-icon btn-danger" onclick="adminProductos.eliminarProducto(${producto.id})" title="Eliminar">
              🗑️
            </button>
          </div>
        </td>
      </tr>
    `).join('');
  }

  /**
   * Muestra el formulario para crear/editar producto
   */
  mostrarFormulario(producto = null) {
    this.productoEditando = producto;
    this.imagenesSeleccionadas = [];
    this.imagenesParaEliminar = [];

    const modal = document.getElementById('modal-producto');
    const titulo = document.getElementById('modal-producto-titulo');
    const form = document.getElementById('form-producto');

    if (producto) {
      // Modo edición
      titulo.textContent = '✏️ Editar Producto';
      form.elements['nombre'].value = producto.nombre || '';
      form.elements['descripcion'].value = producto.descripcion || '';
      form.elements['precio'].value = producto.precio || '';
      form.elements['categoria'].value = producto.categoria || '';
      form.elements['disponible'].value = producto.disponible || 1;

      // Mostrar imágenes existentes
      this.renderizarImagenesExistentes(producto.imagenes || []);
    } else {
      // Modo creación
      titulo.textContent = '➕ Nuevo Producto';
      form.reset();
      document.getElementById('imagenes-existentes').innerHTML = '';
      document.getElementById('preview-imagenes').innerHTML = '';
    }

    modal.style.display = 'flex';
  }

  /**
   * Oculta el formulario
   */
  ocultarFormulario() {
    const modal = document.getElementById('modal-producto');
    modal.style.display = 'none';
    this.productoEditando = null;
    this.imagenesSeleccionadas = [];
    this.imagenesParaEliminar = [];
  }

  /**
   * Renderiza imágenes existentes (modo edición)
   */
  renderizarImagenesExistentes(imagenes) {
    const container = document.getElementById('imagenes-existentes');
    if (!container) return;

    if (imagenes.length === 0) {
      container.innerHTML = '<p style="color: var(--color-text-secondary);">Sin imágenes</p>';
      return;
    }

    container.innerHTML = `
      <div class="imagenes-grid">
        ${imagenes.map(img => `
          <div class="imagen-item" data-imagen-id="${img.id}">
            <img src="${apiService.getImageUrl(img.url_imagen)}" alt="Producto">
            <button type="button" class="btn-eliminar-imagen" 
                    onclick="adminProductos.marcarImagenParaEliminar(${img.id})">
              ✕
            </button>
          </div>
        `).join('')}
      </div>
    `;
  }

  /**
   * Marca una imagen para eliminar
   */
  marcarImagenParaEliminar(imagenId) {
    if (!confirm('¿Eliminar esta imagen?')) return;

    this.imagenesParaEliminar.push(imagenId);
    const item = document.querySelector(`[data-imagen-id="${imagenId}"]`);
    if (item) {
      item.style.opacity = '0.3';
      item.querySelector('.btn-eliminar-imagen').textContent = '↻';
      item.querySelector('.btn-eliminar-imagen').onclick = () => this.desmarcarImagenParaEliminar(imagenId);
    }
  }

  /**
   * Desmarca una imagen para eliminar
   */
  desmarcarImagenParaEliminar(imagenId) {
    this.imagenesParaEliminar = this.imagenesParaEliminar.filter(id => id !== imagenId);
    const item = document.querySelector(`[data-imagen-id="${imagenId}"]`);
    if (item) {
      item.style.opacity = '1';
      item.querySelector('.btn-eliminar-imagen').textContent = '✕';
      item.querySelector('.btn-eliminar-imagen').onclick = () => this.marcarImagenParaEliminar(imagenId);
    }
  }

  /**
   * Previsualiza imágenes seleccionadas
   */
  previsualizarImagenes(event) {
    const files = Array.from(event.target.files);
    const preview = document.getElementById('preview-imagenes');
    
    // Guardar archivos
    this.imagenesSeleccionadas = files;

    // Limpiar preview
    preview.innerHTML = '';

    if (files.length === 0) {
      preview.innerHTML = '<p style="color: var(--color-text-secondary);">Selecciona imágenes para previsualizar</p>';
      return;
    }

    // Mostrar previews
    files.forEach((file, index) => {
      const reader = new FileReader();
      
      reader.onload = (e) => {
        const div = document.createElement('div');
        div.className = 'imagen-preview';
        div.innerHTML = `
          <img src="${e.target.result}" alt="Preview ${index + 1}">
          <div class="imagen-info">
            <p>${file.name}</p>
            <p>${this.formatearTamano(file.size)}</p>
          </div>
          <button type="button" class="btn-eliminar-preview" 
                  onclick="adminProductos.eliminarImagenPreview(${index})">
            ✕
          </button>
        `;
        preview.appendChild(div);
      };
      
      reader.readAsDataURL(file);
    });
  }

  /**
   * Elimina una imagen del preview
   */
  eliminarImagenPreview(index) {
    this.imagenesSeleccionadas.splice(index, 1);
    
    // Actualizar input file
    const input = document.getElementById('producto-imagenes');
    const dt = new DataTransfer();
    this.imagenesSeleccionadas.forEach(file => dt.items.add(file));
    input.files = dt.files;
    
    // Re-renderizar preview
    this.previsualizarImagenes({ target: input });
  }

  /**
   * Guarda el producto (crear o actualizar)
   */
  async guardarProducto(event) {
    event.preventDefault();

    const form = event.target;
    const formData = {
      nombre: form.elements['nombre'].value.trim(),
      descripcion: form.elements['descripcion'].value.trim(),
      precio: parseFloat(form.elements['precio'].value),
      categoria: form.elements['categoria'].value,
      disponible: parseInt(form.elements['disponible'].value)
    };

    // Validar
    if (!formData.nombre) {
      this.mostrarError('El nombre es requerido');
      return;
    }

    if (formData.precio <= 0) {
      this.mostrarError('El precio debe ser mayor a 0');
      return;
    }

    try {
      this.mostrarLoading(true);

      let producto;

      if (this.productoEditando) {
        // Actualizar producto
        producto = await apiService.actualizarProducto(this.productoEditando.id, formData);

        // Eliminar imágenes marcadas
        for (const imagenId of this.imagenesParaEliminar) {
          await apiService.eliminarImagen(this.productoEditando.id, imagenId);
        }

        // Subir nuevas imágenes si hay
        if (this.imagenesSeleccionadas.length > 0) {
          await apiService.subirImagenes(this.productoEditando.id, this.imagenesSeleccionadas);
        }

        this.mostrarExito('Producto actualizado correctamente');
      } else {
        // Crear producto
        producto = await apiService.crearProducto(formData);

        // Subir imágenes si hay
        if (this.imagenesSeleccionadas.length > 0) {
          await apiService.subirImagenes(producto.id, this.imagenesSeleccionadas);
        }

        this.mostrarExito('Producto creado correctamente');
      }

      // Recargar lista
      await this.cargarProductos();
      
      // Cerrar modal
      this.ocultarFormulario();

    } catch (error) {
      console.error('❌ Error guardando producto:', error);
      this.mostrarError('Error guardando producto: ' + error.message);
    } finally {
      this.mostrarLoading(false);
    }
  }

  /**
   * Edita un producto
   */
  async editarProducto(id) {
    try {
      const producto = await apiService.getProducto(id);
      this.mostrarFormulario(producto);
    } catch (error) {
      console.error('❌ Error cargando producto:', error);
      this.mostrarError('Error cargando producto: ' + error.message);
    }
  }

  /**
   * Elimina un producto
   */
  async eliminarProducto(id) {
    const producto = this.productos.find(p => p.id === id);
    if (!producto) return;

    if (!confirm(`¿Estás seguro de eliminar "${producto.nombre}"?\n\nEsta acción eliminará el producto y todas sus imágenes.`)) {
      return;
    }

    try {
      this.mostrarLoading(true);
      await apiService.eliminarProducto(id);
      this.mostrarExito('Producto eliminado correctamente');
      await this.cargarProductos();
    } catch (error) {
      console.error('❌ Error eliminando producto:', error);
      this.mostrarError('Error eliminando producto: ' + error.message);
    } finally {
      this.mostrarLoading(false);
    }
  }

  // ==================== UTILIDADES ====================

  getCategoriaEmoji(categoria) {
    const emojis = {
      'anchetas': '🎁',
      'mini-donas': '🍩',
      'postres': '🍰',
      'dulces': '🍬',
      'chocolates': '🍫',
      'otros': '🛍️'
    };
    return emojis[categoria] || '📦';
  }

  formatearPrecio(precio) {
    return new Intl.NumberFormat('es-CO').format(precio);
  }

  formatearTamano(bytes) {
    if (bytes < 1024) return bytes + ' B';
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB';
    return (bytes / (1024 * 1024)).toFixed(1) + ' MB';
  }

  truncar(texto, max) {
    if (!texto) return '-';
    if (texto.length <= max) return texto;
    return texto.substring(0, max) + '...';
  }

  escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
  }

  mostrarLoading(show) {
    const overlay = document.getElementById('loading-overlay');
    if (overlay) {
      overlay.style.display = show ? 'flex' : 'none';
    }
  }

  mostrarExito(mensaje) {
    alert('✅ ' + mensaje);
  }

  mostrarError(mensaje) {
    alert('❌ ' + mensaje);
  }
}

// Crear instancia global
const adminProductos = new AdminProductos();

