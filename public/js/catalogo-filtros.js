/* ============================================
   🎯 Filtros de Catálogo - Lo Quiero YA CM
   Sistema de filtrado por categorías
   ============================================ */

(function() {
  'use strict';

  let todosLosProductos = [];
  let categoriaActual = 'todos';

  /**
   * Inicializa los filtros de categorías
   */
  function inicializarFiltros() {
    const filtros = document.querySelectorAll('.filtro-btn');
    
    filtros.forEach(filtro => {
      filtro.addEventListener('click', function() {
        // Remover active de todos
        filtros.forEach(f => f.classList.remove('active'));
        
        // Agregar active al clickeado
        this.classList.add('active');
        
        // Obtener categoría
        const categoria = this.dataset.categoria;
        categoriaActual = categoria;
        
        // Filtrar productos
        filtrarProductos(categoria);
      });
    });

    console.log('✅ Filtros de categorías inicializados');
  }

  /**
   * Filtra productos por categoría
   */
  function filtrarProductos(categoria) {
    const catalogoContainer = document.getElementById('catalogo-productos');
    
    if (!catalogoContainer) return;

    // Mostrar loading
    catalogoContainer.innerHTML = '<div class="loading">Filtrando productos...</div>';

    // Simular delay para animación
    setTimeout(() => {
      let productosFiltrados;

      if (categoria === 'todos') {
        productosFiltrados = todosLosProductos;
      } else {
        productosFiltrados = todosLosProductos.filter(producto => {
          return producto.tipo === categoria || producto.categoria === categoria;
        });
      }

      // Renderizar productos filtrados
      if (typeof renderizarCatalogo === 'function') {
        renderizarCatalogo(productosFiltrados);
      } else {
        console.warn('⚠️ Función renderizarCatalogo no disponible');
      }

      console.log(`✅ Mostrando ${productosFiltrados.length} productos de categoría: ${categoria}`);
    }, 200);
  }

  /**
   * Guarda referencia de todos los productos
   */
  window.setProductosParaFiltros = function(productos) {
    todosLosProductos = productos;
    console.log(`📦 ${productos.length} productos cargados para filtros`);
  };

  /**
   * Header sticky en scroll
   */
  function inicializarHeaderSticky() {
    const header = document.getElementById('main-header');
    
    if (!header) return;

    let lastScroll = 0;

    window.addEventListener('scroll', () => {
      const currentScroll = window.pageYOffset;

      if (currentScroll > 100) {
        header.classList.add('scrolled');
      } else {
        header.classList.remove('scrolled');
      }

      lastScroll = currentScroll;
    });

    console.log('✅ Header sticky inicializado');
  }

  /**
   * Smooth scroll para los enlaces
   */
  function inicializarSmoothScroll() {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
      anchor.addEventListener('click', function (e) {
        const href = this.getAttribute('href');
        
        // Ignorar # solo
        if (href === '#') return;
        
        e.preventDefault();

        const target = document.querySelector(href);
        if (target) {
          const offset = 100; // Espacio para el header sticky
          const targetPosition = target.offsetTop - offset;

          window.scrollTo({
            top: targetPosition,
            behavior: 'smooth'
          });
        }
      });
    });

    console.log('✅ Smooth scroll inicializado');
  }

  /**
   * Animación de entrada para productos
   */
  function animarEntradaProductos() {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.style.animationPlayState = 'running';
        }
      });
    }, {
      threshold: 0.1
    });

    // Observar productos cuando se agregan
    const catalogoObserver = new MutationObserver((mutations) => {
      mutations.forEach(mutation => {
        mutation.addedNodes.forEach(node => {
          if (node.classList && node.classList.contains('producto-card')) {
            observer.observe(node);
          }
        });
      });
    });

    const catalogoContainer = document.getElementById('catalogo-productos');
    if (catalogoContainer) {
      catalogoObserver.observe(catalogoContainer, {
        childList: true
      });
    }
  }

  // Inicializar cuando el DOM esté listo
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
      inicializarFiltros();
      inicializarHeaderSticky();
      inicializarSmoothScroll();
    });
  } else {
    inicializarFiltros();
    inicializarHeaderSticky();
    inicializarSmoothScroll();
  }

})();

