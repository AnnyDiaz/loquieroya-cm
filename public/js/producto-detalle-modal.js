/* ============================================
   🎨 MODAL DE DETALLES DEL PRODUCTO
   Lo Quiero YA CM - Sistema de Modal con Carrusel
   ============================================ */

class ProductoDetalleModal {
  constructor() {
    this.overlay = null;
    this.modal = null;
    this.swiper = null;
    this.productoActual = null;
    this.init();
  }

  /**
   * Inicializa el modal
   */
  init() {
    this.crearModalHTML();
    this.setupEventListeners();
  }

  /**
   * Crea la estructura HTML del modal
   */
  crearModalHTML() {
    const modalHTML = `
      <div class="producto-detalle-overlay" id="producto-detalle-overlay">
        <div class="producto-detalle-modal" id="producto-detalle-modal">
          <button class="modal-cerrar" id="modal-cerrar" aria-label="Cerrar modal">
            <i class="fas fa-times"></i>
          </button>
          
          <div class="modal-contenido">
            <!-- Sección de imágenes con carrusel -->
            <div class="modal-imagenes">
              <div class="producto-carrusel swiper" id="producto-carrusel">
                <div class="swiper-wrapper" id="carrusel-imagenes">
                  <!-- Las imágenes se cargarán dinámicamente -->
                </div>
                
                <!-- Botones de navegación -->
                <div class="swiper-button-next"></div>
                <div class="swiper-button-prev"></div>
                
                <!-- Paginación -->
                <div class="swiper-pagination"></div>
              </div>
              
              <!-- Miniaturas (thumbnails) -->
              <div class="producto-thumbnails" id="producto-thumbnails">
                <!-- Las miniaturas se cargarán dinámicamente -->
              </div>
            </div>
            
            <!-- Sección de información -->
            <div class="modal-info">
              <div class="modal-categoria" id="modal-categoria">
                <i class="fas fa-tag"></i>
                <span id="modal-categoria-text"></span>
              </div>
              
              <h2 class="modal-nombre" id="modal-nombre"></h2>
              
              <p class="modal-descripcion" id="modal-descripcion"></p>
              
              <div class="modal-precio-wrapper">
                <span class="modal-precio-label">Precio</span>
                <div class="modal-precio">
                  <span class="modal-precio-moneda">$</span>
                  <span id="modal-precio-valor"></span>
                </div>
              </div>
              
              <div class="modal-info-extra">
                <div class="info-item">
                  <i class="fas fa-truck-fast"></i>
                  <span>Entrega rápida</span>
                </div>
                <div class="info-item">
                  <i class="fas fa-hand-sparkles"></i>
                  <span>Hecho a mano</span>
                </div>
                <div class="info-item">
                  <i class="fas fa-award"></i>
                  <span>Calidad premium</span>
                </div>
                <div class="info-item">
                  <i class="fas fa-heart"></i>
                  <span>Con amor</span>
                </div>
              </div>
              
              <div class="modal-acciones">
                <button class="btn-modal btn-agregar-modal" id="btn-agregar-modal">
                  <i class="fas fa-cart-plus"></i>
                  Agregar al Carrito
                </button>
                <button class="btn-modal btn-volver-modal" id="btn-volver-modal">
                  <i class="fas fa-arrow-left"></i>
                  Volver
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    `;
    
    document.body.insertAdjacentHTML('beforeend', modalHTML);
    
    this.overlay = document.getElementById('producto-detalle-overlay');
    this.modal = document.getElementById('producto-detalle-modal');
  }

  /**
   * Configura los event listeners
   */
  setupEventListeners() {
    // Cerrar modal al hacer clic en el overlay
    this.overlay.addEventListener('click', (e) => {
      if (e.target === this.overlay) {
        this.cerrar();
      }
    });
    
    // Cerrar con botón X
    document.getElementById('modal-cerrar').addEventListener('click', () => {
      this.cerrar();
    });
    
    // Botón volver
    document.getElementById('btn-volver-modal').addEventListener('click', () => {
      this.cerrar();
    });
    
    // Botón agregar al carrito
    document.getElementById('btn-agregar-modal').addEventListener('click', () => {
      if (this.productoActual) {
        // Usar la función global del app.js
        if (typeof agregarAlCarrito === 'function') {
          agregarAlCarrito(this.productoActual.id);
          this.cerrar();
        }
      }
    });
    
    // Cerrar con ESC
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && this.overlay.classList.contains('active')) {
        this.cerrar();
      }
    });
  }

  /**
   * Abre el modal con la información del producto
   */
  abrir(producto) {
    this.productoActual = producto;
    this.cargarInformacion(producto);
    this.cargarImagenes(producto);
    
    // Mostrar modal con animación
    this.overlay.classList.add('active');
    document.body.style.overflow = 'hidden';
  }

  /**
   * Cierra el modal
   */
  cerrar() {
    this.overlay.classList.remove('active');
    document.body.style.overflow = '';
    
    // Destruir swiper si existe
    if (this.swiper) {
      this.swiper.destroy(true, true);
      this.swiper = null;
    }
    
    this.productoActual = null;
  }

  /**
   * Carga la información del producto en el modal
   */
  cargarInformacion(producto) {
    // Categoría
    const categoriaNombre = this.obtenerNombreCategoria(producto.tipo || producto.categoria);
    document.getElementById('modal-categoria-text').textContent = categoriaNombre;
    
    // Nombre
    document.getElementById('modal-nombre').textContent = producto.nombre;
    
    // Descripción
    document.getElementById('modal-descripcion').textContent = 
      producto.descripcion || 'Producto artesanal hecho con amor y dedicación.';
    
    // Precio
    const precio = producto.precio || producto.precioBase || 0;
    document.getElementById('modal-precio-valor').textContent = this.formatearPrecio(precio);
    
    // Badge si existe
    if (producto.badge) {
      this.mostrarBadge(producto.badge);
    }
  }

  /**
   * Carga las imágenes del producto en el carrusel
   */
  cargarImagenes(producto) {
    const wrapper = document.getElementById('carrusel-imagenes');
    const thumbnailsContainer = document.getElementById('producto-thumbnails');
    
    wrapper.innerHTML = '';
    thumbnailsContainer.innerHTML = '';
    
    // Array de imágenes
    let imagenes = [];
    
    if (producto.imagen) {
      imagenes.push(producto.imagen);
    }
    
    if (producto.imagenesExtra && producto.imagenesExtra.length > 0) {
      imagenes = imagenes.concat(producto.imagenesExtra);
    }
    
    // Si no hay imágenes, mostrar placeholder
    if (imagenes.length === 0) {
      const placeholder = `
        <div class="swiper-slide">
          <div class="producto-placeholder-modal">
            ${producto.emoji || '<i class="fas fa-image"></i>'}
          </div>
        </div>
      `;
      wrapper.innerHTML = placeholder;
    } else {
      // Agregar imágenes al carrusel
      imagenes.forEach((imagen, index) => {
        const slide = `
          <div class="swiper-slide">
            <img src="${imagen}" alt="${producto.nombre} - Imagen ${index + 1}" loading="lazy">
          </div>
        `;
        wrapper.insertAdjacentHTML('beforeend', slide);
        
        // Agregar miniatura
        const thumbnail = `
          <div class="thumbnail ${index === 0 ? 'active' : ''}" data-index="${index}">
            <img src="${imagen}" alt="Miniatura ${index + 1}">
          </div>
        `;
        thumbnailsContainer.insertAdjacentHTML('beforeend', thumbnail);
      });
      
      // Event listeners para las miniaturas
      thumbnailsContainer.querySelectorAll('.thumbnail').forEach((thumb, index) => {
        thumb.addEventListener('click', () => {
          if (this.swiper) {
            this.swiper.slideTo(index);
          }
        });
      });
    }
    
    // Inicializar Swiper después de cargar imágenes
    this.inicializarSwiper(imagenes.length > 1);
  }

  /**
   * Inicializa el carrusel Swiper
   */
  inicializarSwiper(multipleSlides) {
    // Verificar si Swiper está disponible
    if (typeof Swiper === 'undefined') {
      console.warn('⚠️ Swiper no está cargado');
      return;
    }
    
    const config = {
      loop: multipleSlides,
      navigation: {
        nextEl: '.swiper-button-next',
        prevEl: '.swiper-button-prev',
      },
      pagination: {
        el: '.swiper-pagination',
        clickable: true,
      },
      keyboard: {
        enabled: true,
      },
      effect: 'fade',
      fadeEffect: {
        crossFade: true
      },
      speed: 400,
    };
    
    // Solo habilitar loop y navegación si hay múltiples slides
    if (!multipleSlides) {
      config.loop = false;
      config.navigation = false;
      config.pagination = false;
    }
    
    this.swiper = new Swiper('#producto-carrusel', config);
    
    // Actualizar miniaturas activas
    this.swiper.on('slideChange', () => {
      const thumbnails = document.querySelectorAll('.thumbnail');
      thumbnails.forEach((thumb, index) => {
        thumb.classList.toggle('active', index === this.swiper.realIndex);
      });
    });
  }

  /**
   * Muestra un badge en el modal
   */
  mostrarBadge(badge) {
    const badgeText = {
      'popular': 'Popular',
      'nuevo': 'Nuevo',
      'oferta': 'Oferta'
    };
    
    const existingBadge = this.modal.querySelector('.modal-badge');
    if (existingBadge) {
      existingBadge.remove();
    }
    
    const badgeHTML = `
      <div class="modal-badge ${badge}">
        ${badgeText[badge] || badge}
      </div>
    `;
    
    document.querySelector('.modal-imagenes').insertAdjacentHTML('afterbegin', badgeHTML);
  }

  /**
   * Obtiene el nombre legible de una categoría
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
   * Formatea el precio con separadores de miles
   */
  formatearPrecio(precio) {
    return precio.toString().replace(/\B(?=(\d{3})+(?!\d))/g, '.');
  }
}

// Inicializar el modal cuando el DOM esté listo
let productoDetalleModal;

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', () => {
    productoDetalleModal = new ProductoDetalleModal();
    console.log('✅ Modal de producto detalle inicializado');
  });
} else {
  productoDetalleModal = new ProductoDetalleModal();
  console.log('✅ Modal de producto detalle inicializado');
}

/**
 * Función global para abrir el modal de producto
 */
function abrirDetalleProducto(productoId) {
  // Buscar el producto en el array global
  const producto = productos.find(p => p.id === productoId);
  
  if (!producto) {
    console.error('❌ Producto no encontrado:', productoId);
    return;
  }
  
  if (productoDetalleModal) {
    productoDetalleModal.abrir(producto);
  }
}

// Exportar para uso global
if (typeof window !== 'undefined') {
  window.abrirDetalleProducto = abrirDetalleProducto;
  window.productoDetalleModal = productoDetalleModal;
}

