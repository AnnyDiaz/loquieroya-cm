/* ============================================
   🎠 Carousel Manager - Lo Quiero YA CM
   Carrusel asimétrico con auto-rotate
   ============================================ */

class ProductCarousel {
  constructor(productos, containerId = 'carousel-container') {
    this.productos = productos;
    this.containerId = containerId;
    this.currentIndex = 0;
    this.autoRotateInterval = null;
    this.autoRotateDelay = 5000; // 5 segundos
    this.isPaused = false;
    this.init();
  }

  init() {
    this.render();
    this.attachEventListeners();
    this.startAutoRotate();
  }

  render() {
    const container = document.getElementById(this.containerId);
    if (!container) return;

    // Crear estructura del carrusel
    const carouselHTML = `
      <div class="carousel-wrapper" role="region" aria-label="Carrusel de productos destacados">
        <div class="carousel-track" id="carousel-track">
          ${this.renderProducts()}
        </div>
        
        <!-- Navegación -->
        <button 
          class="carousel-nav-btn prev" 
          id="carousel-prev"
          aria-label="Producto anterior"
        >
          ←
        </button>
        <button 
          class="carousel-nav-btn next" 
          id="carousel-next"
          aria-label="Producto siguiente"
        >
          →
        </button>
      </div>
      
      <!-- Indicadores -->
      <div class="carousel-indicators" role="tablist" aria-label="Indicadores de productos">
        ${this.renderIndicators()}
      </div>
    `;

    container.innerHTML = carouselHTML;
    this.updateCarousel();
  }

  renderProducts() {
    return this.productos.map((producto, index) => {
      const precio = producto.precio || producto.precioBase || 0;
      const rating = producto.rating || 5;
      const stars = '⭐️'.repeat(rating);
      
      return `
        <div 
          class="carousel-item ${index === this.currentIndex ? 'active' : 'side'}" 
          data-index="${index}"
          role="tabpanel"
          aria-label="${producto.nombre}"
        >
          <div class="carousel-card">
            ${producto.badge ? `<span class="carousel-badge">${this.getBadgeText(producto.badge)}</span>` : ''}
            
            <div class="carousel-image-wrapper">
              ${producto.imagen ? 
                `<img src="${producto.imagen}" alt="${producto.nombre}" class="carousel-image">` :
                `<div class="carousel-placeholder">${producto.emoji}</div>`
              }
            </div>
            
            <div class="carousel-content">
              <h3 class="carousel-product-name">${producto.nombre}</h3>
              <p class="carousel-product-description">${producto.descripcion}</p>
              
              <div class="carousel-rating">
                <span class="rating-stars" aria-label="${rating} de 5 estrellas">${stars}</span>
                <span class="rating-count">(${producto.reviews || 0} reseñas)</span>
              </div>
              
              <div class="carousel-price-wrapper">
                <div class="carousel-price">$${this.formatearPrecio(precio)}</div>
                ${producto.precioAnterior ? 
                  `<div class="carousel-price-label">$${this.formatearPrecio(producto.precioAnterior)}</div>` 
                  : ''}
              </div>
              
              <button 
                class="carousel-btn" 
                onclick="${producto.personalizable ? 'abrirPersonalizacion(' + producto.id + ')' : 'agregarAlCarrito(' + producto.id + ')'}"
                aria-label="Agregar ${producto.nombre} al carrito"
              >
                <span>${producto.personalizable ? '🎨' : '🛒'}</span>
                ${producto.personalizable ? 'Personalizar' : 'Agregar al Carrito'}
              </button>
            </div>
          </div>
        </div>
      `;
    }).join('');
  }

  renderIndicators() {
    return this.productos.map((_, index) => `
      <button 
        class="carousel-dot ${index === this.currentIndex ? 'active' : ''}" 
        data-index="${index}"
        role="tab"
        aria-label="Ir a producto ${index + 1}"
        aria-selected="${index === this.currentIndex}"
      ></button>
    `).join('');
  }

  getBadgeText(badge) {
    const badges = {
      'popular': '⭐ Popular',
      'nuevo': '🆕 Nuevo',
      'oferta': '🔥 Oferta',
      'recomendado': '💎 Recomendado'
    };
    return badges[badge] || badge;
  }

  formatearPrecio(precio) {
    return precio.toLocaleString('es-CO');
  }

  updateCarousel() {
    const items = document.querySelectorAll('.carousel-item');
    const dots = document.querySelectorAll('.carousel-dot');

    items.forEach((item, index) => {
      item.classList.remove('active', 'side');
      
      if (index === this.currentIndex) {
        item.classList.add('active');
      } else {
        item.classList.add('side');
      }
    });

    dots.forEach((dot, index) => {
      dot.classList.toggle('active', index === this.currentIndex);
      dot.setAttribute('aria-selected', index === this.currentIndex);
    });

    // Centrar el producto activo
    this.centerActiveItem();
  }

  centerActiveItem() {
    const track = document.getElementById('carousel-track');
    const items = document.querySelectorAll('.carousel-item');
    const activeItem = items[this.currentIndex];

    if (track && activeItem) {
      const trackWidth = track.offsetWidth;
      const itemWidth = activeItem.offsetWidth;
      const offset = (trackWidth / 2) - (itemWidth / 2) - (activeItem.offsetLeft);
      
      track.style.transform = `translateX(${offset}px)`;
    }
  }

  goToSlide(index) {
    if (index < 0 || index >= this.productos.length) return;
    
    this.currentIndex = index;
    this.updateCarousel();
    this.resetAutoRotate();
  }

  next() {
    const nextIndex = (this.currentIndex + 1) % this.productos.length;
    this.goToSlide(nextIndex);
  }

  prev() {
    const prevIndex = (this.currentIndex - 1 + this.productos.length) % this.productos.length;
    this.goToSlide(prevIndex);
  }

  startAutoRotate() {
    this.stopAutoRotate();
    this.autoRotateInterval = setInterval(() => {
      if (!this.isPaused) {
        this.next();
      }
    }, this.autoRotateDelay);
  }

  stopAutoRotate() {
    if (this.autoRotateInterval) {
      clearInterval(this.autoRotateInterval);
      this.autoRotateInterval = null;
    }
  }

  resetAutoRotate() {
    this.stopAutoRotate();
    this.startAutoRotate();
  }

  pause() {
    this.isPaused = true;
  }

  resume() {
    this.isPaused = false;
  }

  attachEventListeners() {
    // Navegación por flechas
    document.getElementById('carousel-prev')?.addEventListener('click', () => {
      this.prev();
    });

    document.getElementById('carousel-next')?.addEventListener('click', () => {
      this.next();
    });

    // Navegación por dots
    document.querySelectorAll('.carousel-dot').forEach(dot => {
      dot.addEventListener('click', (e) => {
        const index = parseInt(e.target.getAttribute('data-index'));
        this.goToSlide(index);
      });
    });

    // Click en productos laterales
    document.querySelectorAll('.carousel-item.side').forEach(item => {
      item.addEventListener('click', (e) => {
        // Evitar que el click en el botón active esto
        if (e.target.closest('.carousel-btn')) return;
        
        const index = parseInt(item.getAttribute('data-index'));
        this.goToSlide(index);
      });
    });

    // Pausar en hover
    const wrapper = document.querySelector('.carousel-wrapper');
    if (wrapper) {
      wrapper.addEventListener('mouseenter', () => {
        this.pause();
      });

      wrapper.addEventListener('mouseleave', () => {
        this.resume();
      });
    }

    // Navegación con teclado mejorada
    document.addEventListener('keydown', (e) => {
      // Solo si el carrusel está visible
      if (!this.isVisible()) return;
      
      if (e.key === 'ArrowLeft') {
        e.preventDefault();
        this.prev();
      } else if (e.key === 'ArrowRight') {
        e.preventDefault();
        this.next();
      } else if (e.key >= '1' && e.key <= '9') {
        e.preventDefault();
        const index = parseInt(e.key) - 1;
        if (index < this.productos.length) {
          this.goToSlide(index);
        }
      }
    });

    // Touch/swipe support para móviles
    this.addTouchSupport();

    // Responsive - recalcular en resize
    let resizeTimeout;
    window.addEventListener('resize', () => {
      clearTimeout(resizeTimeout);
      resizeTimeout = setTimeout(() => {
        this.centerActiveItem();
      }, 100);
    });

    // Intersection Observer para pausar cuando no es visible
    this.addVisibilityObserver();
  }

  isVisible() {
    const carouselSection = document.getElementById('carousel-section');
    if (!carouselSection) return false;
    
    const rect = carouselSection.getBoundingClientRect();
    return rect.top < window.innerHeight && rect.bottom > 0;
  }

  addTouchSupport() {
    const track = document.getElementById('carousel-track');
    if (!track) return;

    let startX = 0;
    let startY = 0;
    let isDragging = false;

    track.addEventListener('touchstart', (e) => {
      startX = e.touches[0].clientX;
      startY = e.touches[0].clientY;
      isDragging = true;
    });

    track.addEventListener('touchmove', (e) => {
      if (!isDragging) return;
      
      const currentX = e.touches[0].clientX;
      const currentY = e.touches[0].clientY;
      const diffX = startX - currentX;
      const diffY = startY - currentY;

      // Solo procesar si es un swipe horizontal
      if (Math.abs(diffX) > Math.abs(diffY) && Math.abs(diffX) > 50) {
        e.preventDefault();
      }
    });

    track.addEventListener('touchend', (e) => {
      if (!isDragging) return;
      
      const endX = e.changedTouches[0].clientX;
      const endY = e.changedTouches[0].clientY;
      const diffX = startX - endX;
      const diffY = startY - endY;

      // Swipe horizontal mínimo de 50px
      if (Math.abs(diffX) > Math.abs(diffY) && Math.abs(diffX) > 50) {
        if (diffX > 0) {
          this.next(); // Swipe izquierda = siguiente
        } else {
          this.prev(); // Swipe derecha = anterior
        }
      }

      isDragging = false;
    });
  }

  addVisibilityObserver() {
    const carouselSection = document.getElementById('carousel-section');
    if (!carouselSection) return;

    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          this.resume();
        } else {
          this.pause();
        }
      });
    }, {
      threshold: 0.3
    });

    observer.observe(carouselSection);
  }

  destroy() {
    this.stopAutoRotate();
  }
}

// Función para inicializar el carrusel
function initCarousel() {
  // Esperar a que productos esté disponible
  if (typeof productos === 'undefined') {
    console.warn('⚠️ Productos no disponibles para el carrusel');
    return;
  }

  // Filtrar productos destacados o usar los primeros
  const productosCarrusel = productos.filter(p => p.destacado || p.badge === 'popular' || p.badge === 'nuevo');
  const productosAMostrar = productosCarrusel.length > 0 ? productosCarrusel : productos.slice(0, 5);

  // Crear instancia del carrusel con el ID correcto
  const carousel = new ProductCarousel(productosAMostrar, 'carousel-container');
  window.productCarousel = carousel;

  console.log('✅ Carrusel inicializado con', productosAMostrar.length, 'productos');
}

// Auto-inicializar cuando el DOM esté listo
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initCarousel);
} else {
  // Si el DOM ya está listo, inicializar después de que productos esté disponible
  setTimeout(initCarousel, 500);
}

// Exportar
if (typeof module !== 'undefined' && module.exports) {
  module.exports = { ProductCarousel };
}

