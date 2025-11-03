/* ============================================
   🎨 MODAL DE DETALLES DEL PRODUCTO - MEJORADO
   Lo Quiero YA CM - Sistema de Modal con Carrusel
   ============================================ */

   class ProductoDetalleModal {
    constructor() {
      this.overlay = null;
      this.modal = null;
      this.swiper = null;
      this.productoActual = null;
      this._isOpen = false;
      this._eventListeners = new Map();
      this.init();
    }
  
    /**
     * Inicializa el modal
     */
    init() {
      if (this.modal) return; // Evitar inicialización múltiple
      
      this.crearModalHTML();
      this.setupEventListeners();
      this.setupGestures();
    }
  
    /**
     * Crea la estructura HTML del modal de manera más eficiente
     */
    crearModalHTML() {
      // Verificar si ya existe el modal
      if (document.getElementById('producto-detalle-overlay')) {
        this.overlay = document.getElementById('producto-detalle-overlay');
        this.modal = document.getElementById('producto-detalle-modal');
        return;
      }
  
      const modalHTML = this.generarModalHTML();
      document.body.insertAdjacentHTML('beforeend', modalHTML);
      
      this.overlay = document.getElementById('producto-detalle-overlay');
      this.modal = document.getElementById('producto-detalle-modal');
    }
  
    /**
     * Genera el HTML del modal de forma más mantenible
     */
    generarModalHTML() {
      return `
        <div class="producto-detalle-overlay" id="producto-detalle-overlay" role="dialog" aria-modal="true" aria-labelledby="modal-nombre" aria-hidden="true">
          <div class="producto-detalle-modal" id="producto-detalle-modal">
            <button class="modal-cerrar" id="modal-cerrar" aria-label="Cerrar modal">
              <i class="fas fa-times" aria-hidden="true"></i>
            </button>
            
            <div class="modal-contenido">
              ${this.generarSeccionImagenes()}
              ${this.generarSeccionInformacion()}
            </div>
  
            <!-- Loading state -->
            <div class="modal-loading" id="modal-loading">
              <div class="loading-spinner"></div>
              <p>Cargando producto...</p>
            </div>
          </div>
        </div>
      `;
    }
  
    generarSeccionImagenes() {
      return `
        <div class="modal-imagenes">
          <div class="producto-carrusel swiper" id="producto-carrusel">
            <div class="swiper-wrapper" id="carrusel-imagenes" aria-live="polite">
              <!-- Las imágenes se cargarán dinámicamente -->
            </div>
            
            <div class="swiper-button-next" aria-label="Siguiente imagen"></div>
            <div class="swiper-button-prev" aria-label="Imagen anterior"></div>
            <div class="swiper-pagination" aria-label="Navegación de imágenes"></div>
          </div>
          
          <div class="producto-thumbnails" id="producto-thumbnails" role="tablist" aria-label="Miniaturas de imágenes">
            <!-- Las miniaturas se cargarán dinámicamente -->
          </div>
        </div>
      `;
    }
  
    generarSeccionInformacion() {
      return `
        <div class="modal-info">
          <div class="modal-header">
            <div class="modal-categoria" id="modal-categoria">
              <i class="fas fa-tag" aria-hidden="true"></i>
              <span id="modal-categoria-text"></span>
            </div>
            
            <h2 class="modal-nombre" id="modal-nombre"></h2>
          </div>
          
          <div class="modal-body">
            <p class="modal-descripcion" id="modal-descripcion"></p>
            
            <div class="modal-precio-wrapper">
              <span class="modal-precio-label">Precio</span>
              <div class="modal-precio" id="modal-precio">
                <span class="modal-precio-moneda">$</span>
                <span id="modal-precio-valor"></span>
              </div>
            </div>
            
            <div class="modal-info-extra" aria-label="Características del producto">
              ${this.generarInfoExtra()}
            </div>
          </div>
          
          <div class="modal-acciones">
            <button class="btn-modal btn-agregar-modal" id="btn-agregar-modal" aria-label="Agregar al carrito">
              <i class="fas fa-cart-plus" aria-hidden="true"></i>
              Agregar al Carrito
            </button>
            <button class="btn-modal btn-volver-modal" id="btn-volver-modal">
              <i class="fas fa-arrow-left" aria-hidden="true"></i>
              Volver
            </button>
          </div>
        </div>
      `;
    }
  
    generarInfoExtra() {
      const items = [
        { icon: 'truck-fast', text: 'Entrega rápida' },
        { icon: 'hand-sparkles', text: 'Hecho a mano' },
        { icon: 'award', text: 'Calidad premium' },
        { icon: 'heart', text: 'Con amor' }
      ];
  
      return items.map(item => `
        <div class="info-item" aria-label="${item.text}">
          <i class="fas fa-${item.icon}" aria-hidden="true"></i>
          <span>${item.text}</span>
        </div>
      `).join('');
    }
  
    /**
     * Configura los event listeners de manera más robusta
     */
    setupEventListeners() {
      const events = [
        [this.overlay, 'click', (e) => e.target === this.overlay && this.cerrar()],
        [document.getElementById('modal-cerrar'), 'click', () => this.cerrar()],
        [document.getElementById('btn-volver-modal'), 'click', () => this.cerrar()],
        [document.getElementById('btn-agregar-modal'), 'click', () => this.agregarAlCarrito()],
        [document, 'keydown', (e) => this.handleKeydown(e)]
      ];
  
      events.forEach(([element, event, handler]) => {
        if (element) {
          element.addEventListener(event, handler);
          this._eventListeners.set(element, { event, handler });
        }
      });
    }
  
    /**
     * Configura gestos táctiles
     */
    setupGestures() {
      let startY = 0;
      
      this.modal?.addEventListener('touchstart', (e) => {
        startY = e.touches[0].clientY;
      }, { passive: true });
  
      this.modal?.addEventListener('touchmove', (e) => {
        const currentY = e.touches[0].clientY;
        // Cerrar al deslizar hacia abajo
        if (currentY - startY > 100) {
          this.cerrar();
        }
      }, { passive: true });
    }
  
    /**
     * Maneja eventos de teclado
     */
    handleKeydown(e) {
      if (!this._isOpen) return;
  
      switch(e.key) {
        case 'Escape':
          e.preventDefault();
          this.cerrar();
          break;
        case 'ArrowLeft':
          if (this.swiper) {
            e.preventDefault();
            this.swiper.slidePrev();
          }
          break;
        case 'ArrowRight':
          if (this.swiper) {
            e.preventDefault();
            this.swiper.slideNext();
          }
          break;
      }
    }
  
    /**
     * Abre el modal con la información del producto
     */
    async abrir(producto) {
      if (this._isOpen) return;
  
      this.mostrarLoading(true);
      this.productoActual = producto;
      
      try {
        await Promise.all([
          this.cargarInformacion(producto),
          this.cargarImagenes(producto)
        ]);
  
        this.mostrarLoading(false);
        this.mostrarModal();
        
        // Analytics
        this.trackModalView(producto);
        
      } catch (error) {
        console.error('Error al abrir modal:', error);
        this.mostrarError();
      }
    }
  
    /**
     * Muestra el modal con animación
     */
    mostrarModal() {
      this.overlay.classList.add('active');
      this.modal.setAttribute('aria-hidden', 'false');
      document.body.style.overflow = 'hidden';
      this._isOpen = true;
  
      // Focus management
      this.modal.focus();
      
      // Animar entrada
      requestAnimationFrame(() => {
        this.modal.style.transform = 'translateY(0)';
        this.modal.style.opacity = '1';
      });
    }
  
    /**
     * Cierra el modal
     */
    cerrar() {
      if (!this._isOpen) return;
  
      // Animación de salida
      this.modal.style.transform = 'translateY(20px)';
      this.modal.style.opacity = '0';
  
      setTimeout(() => {
        this.overlay.classList.remove('active');
        this.modal.setAttribute('aria-hidden', 'true');
        document.body.style.overflow = '';
        this._isOpen = false;
        
        this.limpiarRecursos();
      }, 300);
    }
  
    /**
     * Limpia recursos del modal
     */
    limpiarRecursos() {
      // Destruir swiper
      if (this.swiper) {
        this.swiper.destroy(true, true);
        this.swiper = null;
      }
  
      // Limpiar datos
      this.productoActual = null;
      
      // Limpiar miniaturas e imágenes
      const containers = ['carrusel-imagenes', 'producto-thumbnails'];
      containers.forEach(id => {
        const container = document.getElementById(id);
        if (container) container.innerHTML = '';
      });
    }
  
    /**
     * Muestra/oculta estado de loading
     */
    mostrarLoading(mostrar = true) {
      const loading = document.getElementById('modal-loading');
      if (loading) {
        loading.style.display = mostrar ? 'flex' : 'none';
      }
    }
  
    /**
     * Muestra estado de error
     */
    mostrarError() {
      const contenido = this.modal.querySelector('.modal-contenido');
      if (contenido) {
        contenido.innerHTML = `
          <div class="modal-error">
            <i class="fas fa-exclamation-triangle"></i>
            <h3>Error al cargar el producto</h3>
            <p>Intenta nuevamente en unos momentos.</p>
            <button class="btn-modal" onclick="productoDetalleModal.cerrar()">Cerrar</button>
          </div>
        `;
      }
    }
  
    /**
     * Carga la información del producto
     */
    async cargarInformacion(producto) {
      return new Promise((resolve) => {
        requestAnimationFrame(() => {
          // Categoría
          const categoriaNombre = this.obtenerNombreCategoria(producto.tipo || producto.categoria);
          this.setElementText('modal-categoria-text', categoriaNombre);
          
          // Nombre
          this.setElementText('modal-nombre', producto.nombre);
          
          // Descripción
          const descripcion = producto.descripcion || 'Producto artesanal hecho con amor y dedicación.';
          this.setElementText('modal-descripcion', descripcion);
          
          // Precio
          const precio = producto.precio || producto.precioBase || 0;
          this.setElementText('modal-precio-valor', this.formatearPrecio(precio));
          
          // Badge
          if (producto.badge) {
            this.mostrarBadge(producto.badge);
          }
  
          // Stock
          if (typeof producto.stock !== 'undefined') {
            this.mostrarStock(producto.stock);
          }
  
          resolve();
        });
      });
    }
  
    /**
     * Carga las imágenes del producto
     */
    async cargarImagenes(producto) {
      return new Promise((resolve) => {
        requestAnimationFrame(() => {
          const wrapper = document.getElementById('carrusel-imagenes');
          const thumbnailsContainer = document.getElementById('producto-thumbnails');
          
          wrapper.innerHTML = '';
          thumbnailsContainer.innerHTML = '';
          
          const imagenes = this.obtenerImagenesProducto(producto);
          
          if (imagenes.length === 0) {
            wrapper.innerHTML = this.crearPlaceholder(producto);
            resolve();
            return;
          }
  
          // Precargar imágenes
          this.precargarImagenes(imagenes).then(() => {
            // Agregar imágenes al carrusel
            imagenes.forEach((imagen, index) => {
              this.agregarSlideImagen(wrapper, imagen, producto.nombre, index);
              this.agregarMiniatura(thumbnailsContainer, imagen, index);
            });
  
            // Configurar interacción miniaturas
            this.configurarMiniaturas();
            
            // Inicializar Swiper
            this.inicializarSwiper(imagenes.length > 1);
            resolve();
          });
        });
      });
    }
  
    /**
     * Obtiene array de imágenes del producto
     */
    obtenerImagenesProducto(producto) {
      const imagenes = [];
      
      if (producto.imagen) {
        imagenes.push(producto.imagen);
      }
      
      if (producto.imagenesExtra?.length > 0) {
        imagenes.push(...producto.imagenesExtra);
      }
      
      return imagenes;
    }
  
    /**
     * Precarga imágenes para mejor UX
     */
    precargarImagenes(imagenes) {
      return Promise.all(
        imagenes.map(src => 
          new Promise((resolve) => {
            const img = new Image();
            img.src = src;
            img.onload = resolve;
            img.onerror = resolve; // Continuar incluso si falla
          })
        )
      );
    }
  
    /**
     * Agrega slide de imagen al carrusel
     */
    agregarSlideImagen(container, imagen, nombre, index) {
      const slide = document.createElement('div');
      slide.className = 'swiper-slide';
      slide.innerHTML = `
        <img 
          src="${imagen}" 
          alt="${nombre} - Imagen ${index + 1}" 
          loading="${index === 0 ? 'eager' : 'lazy'}"
          onerror="this.replaceWith(this.parentNode.querySelector('.producto-placeholder-modal') || document.createElement('div'))"
        >
      `;
      container.appendChild(slide);
    }
  
    /**
     * Agrega miniatura
     */
    agregarMiniatura(container, imagen, index) {
      const thumbnail = document.createElement('div');
      thumbnail.className = `thumbnail ${index === 0 ? 'active' : ''}`;
      thumbnail.setAttribute('data-index', index);
      thumbnail.setAttribute('role', 'tab');
      thumbnail.setAttribute('aria-label', `Ver imagen ${index + 1}`);
      thumbnail.innerHTML = `<img src="${imagen}" alt="Miniatura ${index + 1}">`;
      container.appendChild(thumbnail);
    }
  
    /**
     * Configura interacción de miniaturas
     */
    configurarMiniaturas() {
      const thumbnails = document.querySelectorAll('.thumbnail');
      thumbnails.forEach((thumb, index) => {
        thumb.addEventListener('click', () => {
          if (this.swiper) {
            this.swiper.slideTo(index);
          }
        });
      });
    }
  
    /**
     * Crea placeholder para cuando no hay imágenes
     */
    crearPlaceholder(producto) {
      return `
        <div class="swiper-slide">
          <div class="producto-placeholder-modal" aria-hidden="true">
            ${producto.emoji || '<i class="fas fa-image"></i>'}
          </div>
        </div>
      `;
    }
  
    /**
     * Inicializa Swiper con configuración optimizada
     */
    inicializarSwiper(multipleSlides) {
      if (typeof Swiper === 'undefined') {
        console.warn('⚠️ Swiper no está cargado');
        return;
      }
  
      const config = {
        loop: multipleSlides && multipleSlides > 1,
        navigation: multipleSlides ? {
          nextEl: '.swiper-button-next',
          prevEl: '.swiper-button-prev',
        } : false,
        pagination: multipleSlides ? {
          el: '.swiper-pagination',
          clickable: true,
          dynamicBullets: true,
        } : false,
        keyboard: {
          enabled: true,
          onlyInViewport: true,
        },
        effect: 'fade',
        fadeEffect: {
          crossFade: true
        },
        speed: 400,
        preloadImages: false,
        lazy: {
          loadPrevNext: true,
          loadOnTransitionStart: true,
        },
        watchSlidesProgress: true,
        breakpoints: {
          768: {
            effect: 'slide',
            fadeEffect: null
          }
        }
      };
  
      this.swiper = new Swiper('#producto-carrusel', config);
      
      // Actualizar miniaturas activas y ARIA
      this.swiper.on('slideChange', () => {
        const activeIndex = this.swiper.realIndex;
        const thumbnails = document.querySelectorAll('.thumbnail');
        
        thumbnails.forEach((thumb, index) => {
          const isActive = index === activeIndex;
          thumb.classList.toggle('active', isActive);
          thumb.setAttribute('aria-selected', isActive);
        });
      });
    }
  
    /**
     * Maneja agregar al carrito
     */
    agregarAlCarrito() {
      if (!this.productoActual) return;
  
      // Animación del botón
      const btn = document.getElementById('btn-agregar-modal');
      btn.classList.add('loading');
      btn.disabled = true;
  
      try {
        if (typeof agregarAlCarrito === 'function') {
          agregarAlCarrito(this.productoActual.id);
          
          // Feedback visual
          this.mostrarFeedbackAgregado();
          
          // Cerrar después de un tiempo
          setTimeout(() => {
            this.cerrar();
          }, 1500);
        }
      } catch (error) {
        console.error('Error al agregar al carrito:', error);
        btn.classList.remove('loading');
        btn.disabled = false;
      }
    }
  
    /**
     * Muestra feedback cuando se agrega al carrito
     */
    mostrarFeedbackAgregado() {
      const btn = document.getElementById('btn-agregar-modal');
      const originalHTML = btn.innerHTML;
      
      btn.innerHTML = `
        <i class="fas fa-check"></i>
        ¡Agregado!
      `;
      btn.classList.add('success');
      
      setTimeout(() => {
        btn.innerHTML = originalHTML;
        btn.classList.remove('success', 'loading');
        btn.disabled = false;
      }, 1400);
    }
  
    /**
     * Muestra información de stock
     */
    mostrarStock(stock) {
      const precioWrapper = document.getElementById('modal-precio');
      const existingStock = precioWrapper.querySelector('.stock-info');
      
      if (existingStock) {
        existingStock.remove();
      }
  
      if (stock <= 5 && stock > 0) {
        const stockHTML = `
          <div class="stock-info low-stock">
            <i class="fas fa-exclamation-triangle"></i>
            Últimas ${stock} unidades
          </div>
        `;
        precioWrapper.insertAdjacentHTML('afterend', stockHTML);
      } else if (stock === 0) {
        const stockHTML = `
          <div class="stock-info no-stock">
            <i class="fas fa-times-circle"></i>
            Agotado
          </div>
        `;
        precioWrapper.insertAdjacentHTML('afterend', stockHTML);
        
        // Deshabilitar botón de agregar
        const btn = document.getElementById('btn-agregar-modal');
        btn.disabled = true;
        btn.classList.add('disabled');
      }
    }
  
    /**
     * Muestra badge en el modal
     */
    mostrarBadge(badge) {
      const existingBadge = this.modal.querySelector('.modal-badge');
      if (existingBadge) {
        existingBadge.remove();
      }
  
      const badgeText = {
        'popular': '🔥 Popular',
        'nuevo': '🆕 Nuevo',
        'oferta': '💫 Oferta',
        'agotado': '⏳ Agotado'
      };
  
      const badgeHTML = `
        <div class="modal-badge ${badge}" aria-label="${badgeText[badge] || badge}">
          ${badgeText[badge] || badge}
        </div>
      `;
  
      document.querySelector('.modal-imagenes').insertAdjacentHTML('afterbegin', badgeHTML);
    }
  
    /**
     * Track para analytics
     */
    trackModalView(producto) {
      if (typeof gtag !== 'undefined') {
        gtag('event', 'view_item', {
          'items': [{
            'id': producto.id,
            'name': producto.nombre,
            'category': producto.categoria,
            'price': producto.precio
          }]
        });
      }
    }
  
    /**
     * Helper para establecer texto en elementos
     */
    setElementText(id, text) {
      const element = document.getElementById(id);
      if (element) element.textContent = text;
    }
  
    /**
     * Obtiene nombre legible de categoría
     */
    obtenerNombreCategoria(categoria) {
      const nombres = {
        'mini-donas': 'Mini Donas',
        'anchetas': 'Anchetas',
        'ancheta': 'Anchetas',
        'postres': 'Postres',
        'dulces': 'Dulces',
        'chocolates': 'Chocolates',
        'otros': 'Otros'
      };
      
      return nombres[categoria] || categoria;
    }
  
    /**
     * Formatea el precio
     */
    formatearPrecio(precio) {
      return new Intl.NumberFormat('es-CO').format(precio);
    }
  
    /**
     * Destructor para limpiar event listeners
     */
    destroy() {
      this._eventListeners.forEach(({ event, handler }, element) => {
        element.removeEventListener(event, handler);
      });
      this._eventListeners.clear();
      
      this.limpiarRecursos();
      
      if (this.overlay) {
        this.overlay.remove();
      }
    }
  }
  
  // Inicialización optimizada
  let productoDetalleModal;
  
  const initProductoDetalleModal = () => {
    if (!productoDetalleModal) {
      productoDetalleModal = new ProductoDetalleModal();
      console.log('✅ Modal de producto detalle inicializado');
    }
    return productoDetalleModal;
  };
  
  // Carga diferida si es necesario
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initProductoDetalleModal);
  } else {
    initProductoDetalleModal();
  }
  
  /**
   * Función global mejorada para abrir modal
   */
  function abrirDetalleProducto(productoId) {
    if (!productoDetalleModal) {
      initProductoDetalleModal();
    }
  
    // Buscar producto de forma más robusta
    const producto = window.productos?.find(p => p.id === productoId) || 
                     window.catalogoProductos?.find(p => p.id === productoId);
  
    if (!producto) {
      console.error('❌ Producto no encontrado:', productoId);
      return false;
    }
  
    productoDetalleModal.abrir(producto);
    return true;
  }
  
  // Exportar para uso global
  if (typeof window !== 'undefined') {
    window.abrirDetalleProducto = abrirDetalleProducto;
    window.productoDetalleModal = productoDetalleModal;
    window.initProductoDetalleModal = initProductoDetalleModal;
  }
  
  export { ProductoDetalleModal, abrirDetalleProducto };