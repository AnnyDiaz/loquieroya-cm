/* ============================================
   🍩 Lo Quiero YA CM - JavaScript
   Sistema de Catálogo y Carrito de Compras
   ============================================ */

// ============ DATOS DE CONFIGURACIÓN ============

// Sabores de Mini Donas
const saboresDonas = [
  { id: 'vainilla', nombre: 'Vainilla', emoji: '🤍' },
  { id: 'frutos-rojos', nombre: 'Frutos Rojos', emoji: '❤️' }
];

// Cantidades disponibles
const cantidadesDonas = [
  { id: 1, cantidad: 1, nombre: '1 unidad', precio: 2500, emoji: '🍩' },
  { id: 2, cantidad: 2, nombre: '2 unidades en caja', precio: 4500, emoji: '📦' },
  { id: 3, cantidad: 3, nombre: '3 unidades en caja', precio: 6500, emoji: '📦' },
  { id: 4, cantidad: 4, nombre: '4 unidades en caja', precio: 8500, emoji: '📦' },
  { id: 5, cantidad: 9, nombre: '9 unidades en caja', precio: 18000, emoji: '🎁' }
];

// Glaseados disponibles
const glaseados = [
  { id: 'chocolate-blanco', nombre: 'Chocolate Blanco', emoji: '🤍' },
  { id: 'chocolate-negro', nombre: 'Chocolate Negro', emoji: '🖤' },
  { id: 'arequipe', nombre: 'Arequipe', emoji: '🤎' },
  { id: 'leche-condensada', nombre: 'Leche Condensada', emoji: '🥛' },
  { id: 'azucar-glass', nombre: 'Azúcar Glass', emoji: '✨' }
];

// Toppings disponibles
const toppings = [
  { id: 'mym', nombre: 'M&M', emoji: '🔴' },
  { id: 'mini-rosas', nombre: 'Mini Rosas de Colores', emoji: '🌹' },
  { id: 'lluvia-colores', nombre: 'Lluvia de Colores', emoji: '🌈' },
  { id: 'perlas-doradas', nombre: 'Perlas Doradas', emoji: '🟡' },
  { id: 'perlas-negras', nombre: 'Perlas Negras', emoji: '⚫' },
  { id: 'mini-chips', nombre: 'Mini Chips', emoji: '🍫' },
  { id: 'figuras-chocolate', nombre: 'Figuras de Chocolate', emoji: '🦄' },
  { id: 'perlas-comestibles', nombre: 'Perlas Comestibles', emoji: '💎' },
  { id: 'escarchadas-doradas', nombre: 'Escarchadas Doradas', emoji: '✨' },
  { id: 'escarchadas-plateadas', nombre: 'Escarchadas Plateadas', emoji: '⭐' },
  { id: 'escarchadas-rojas', nombre: 'Escarchadas Rojas', emoji: '❤️' }
];

// ============ CATÁLOGO DE PRODUCTOS ============
const productos = [
  // Mini Donas - Producto base para personalizar
  {
    id: 100,
    tipo: 'mini-donas',
    nombre: 'Mini Donas Personalizadas',
    descripcion: 'Deliciosas mini donas artesanales. ¡Personalízalas a tu gusto!',
    emoji: '🍩',
    precioBase: 2500,
    personalizable: true,
    badge: 'popular',
    imagen: null,
    rating: 5,
    reviews: 127,
    destacado: true
  },
  
  // Anchetas (productos de ejemplo - puedes agregar más)
  {
    id: 200,
    tipo: 'ancheta',
    nombre: 'Ancheta Dulce Especial',
    precio: 35000,
    descripcion: 'Ancheta con variedad de dulces y postres artesanales',
    emoji: '🎁',
    personalizable: false,
    badge: null,
    imagen: null,
    rating: 4,
    reviews: 89,
    destacado: true
  },
  {
    id: 201,
    tipo: 'ancheta',
    nombre: 'Ancheta Premium',
    precio: 50000,
    descripcion: 'Ancheta premium con los mejores productos gourmet',
    emoji: '🎀',
    personalizable: false,
    badge: 'popular',
    imagen: null,
    rating: 5,
    reviews: 156,
    destacado: true,
    precioAnterior: 65000
  },
  {
    id: 202,
    tipo: 'ancheta',
    nombre: 'Ancheta Romántica',
    precio: 45000,
    descripcion: 'Ancheta perfecta para sorprender a esa persona especial',
    emoji: '💝',
    personalizable: false,
    badge: 'nuevo',
    imagen: null,
    rating: 5,
    reviews: 203,
    destacado: true
  }
];

// ============ VARIABLES GLOBALES ============
let carrito = [];
const STORAGE_KEY = 'lqy_carrito';
const ORDERS_KEY = 'lqy_orders';

// ============ ELEMENTOS DEL DOM ============
const catalogoContainer = document.getElementById('catalogo-productos');
const carritoModal = document.getElementById('carrito-modal');
const listaCarrito = document.getElementById('lista-carrito');
const carritoVacio = document.getElementById('carrito-vacio');
const carritoFooter = document.getElementById('carrito-footer');
const totalPrecio = document.getElementById('total-precio');
const carritoContador = document.getElementById('carrito-contador');
const btnCarrito = document.getElementById('btn-carrito');
const btnCerrarCarrito = document.getElementById('btn-cerrar-carrito');
const btnCheckout = document.getElementById('btn-checkout');
const btnVaciarCarrito = document.getElementById('btn-vaciar-carrito');

// ============ INICIALIZACIÓN ============
document.addEventListener('DOMContentLoaded', async () => {
  console.log('🍩 Lo Quiero YA CM - Sistema cargado');
  
  // Cargar carrito desde localStorage
  cargarCarritoDesdeStorage();
  
  // Cargar productos de la API y renderizar catálogo
  await cargarProductosAPI();
  
  // Guardar productos para filtros
  if (typeof setProductosParaFiltros === 'function') {
    setProductosParaFiltros(productos);
  }
  
  // Renderizar carrito
  renderizarCarrito();
  
  // Inicializar carrusel
  if (typeof initCarousel === 'function') {
    initCarousel();
  }
  
  // Event Listeners
  inicializarEventListeners();
  
  // Crear modal de personalización
  crearModalPersonalizacion();
});

// ============ FUNCIONES DE RENDERIZADO ============

/**
 * Carga productos desde la API de FastAPI
 */
async function cargarProductosAPI() {
  try {
    catalogoContainer.innerHTML = '<div class="loading">Cargando productos deliciosos...</div>';
    
    // Cargar productos desde la API
    if (typeof apiService !== 'undefined') {
      const response = await apiService.getProductos({
        disponible: 1,
        limit: 100
      });
      
      // Convertir productos de la API al formato esperado
      const productosAPI = response.productos.map(p => {
        // Mapear categoría a emoji
        const emojiMap = {
          'anchetas': '🎁',
          'mini-donas': '🍩',
          'postres': '🍰',
          'dulces': '🍬',
          'chocolates': '🍫',
          'otros': '🛍️'
        };
        
        return {
          id: p.id + 1000, // Offset para no chocar con productos hardcodeados
          tipo: p.categoria,
          nombre: p.nombre,
          precio: p.precio,
          descripcion: p.descripcion || '',
          emoji: emojiMap[p.categoria] || '🛍️',
          personalizable: false,
          badge: null,
          imagen: p.imagenes && p.imagenes.length > 0 ? apiService.getImageUrl(p.imagenes[0].url_imagen) : null,
          imagenesExtra: p.imagenes ? p.imagenes.slice(1).map(img => apiService.getImageUrl(img.url_imagen)) : [],
          rating: 5,
          reviews: 0,
          destacado: false,
          fromAPI: true
        };
      });
      
      // Combinar productos hardcodeados con productos de la API
      // Los productos hardcodeados van primero (especialmente mini donas personalizables)
      const todosProductos = [...productos, ...productosAPI];
      
      // Renderizar todos los productos
      renderizarCatalogo(todosProductos);
      
      console.log(`✅ ${productosAPI.length} productos cargados desde la API`);
      console.log(`✅ ${todosProductos.length} productos totales en el catálogo`);
      
      // Guardar productos para filtros
      if (typeof setProductosParaFiltros === 'function') {
        setProductosParaFiltros(todosProductos);
      }
      
    } else {
      // Si no hay API disponible, usar solo productos hardcodeados
      console.warn('⚠️ API Service no disponible, usando solo productos hardcodeados');
      renderizarCatalogo(productos);
    }
    
  } catch (error) {
    console.error('❌ Error cargando productos desde API:', error);
    // En caso de error, usar productos hardcodeados
    renderizarCatalogo(productos);
  }
}

/**
 * Renderiza todos los productos del catálogo en el DOM
 */
function renderizarCatalogo(productosParaRenderizar = productos) {
  catalogoContainer.innerHTML = '';
  
  productosParaRenderizar.forEach(producto => {
    const productoCard = crearTarjetaProducto(producto);
    catalogoContainer.appendChild(productoCard);
  });
  
  console.log(`✅ ${productosParaRenderizar.length} productos renderizados en el catálogo`);
}

/**
 * Crea una tarjeta HTML para un producto con diseño delicioso
 */
function crearTarjetaProducto(producto) {
  const div = document.createElement('div');
  div.classList.add('producto-card');
  div.setAttribute('data-id', producto.id);
  
  const precioMostrar = producto.precio || producto.precioBase;
  const textoBoton = producto.personalizable ? '🎨 Personalizar' : '🛒 Agregar al Carrito';
  const badgeText = {
    'popular': '⭐ Popular',
    'nuevo': '🆕 Nuevo',
    'oferta': '🔥 Oferta'
  };
  
  div.innerHTML = `
    ${producto.badge ? `<span class="producto-badge ${producto.badge}">${badgeText[producto.badge] || producto.badge}</span>` : ''}
    
    <div class="producto-image-wrapper">
      ${producto.imagen ? 
        `<img src="${producto.imagen}" alt="${producto.nombre}" class="producto-image">` :
        `<div class="producto-placeholder">${producto.emoji}</div>`
      }
    </div>
    
    <div class="producto-content">
      <span class="producto-emoji">${producto.emoji}</span>
      <h3 class="producto-nombre">${producto.nombre}</h3>
      <p class="producto-descripcion">${producto.descripcion}</p>
      
      <div class="producto-precio-wrapper">
        <div class="producto-precio">
          <span class="precio-moneda">$</span>
          ${formatearPrecio(precioMostrar)}
        </div>
        <span class="precio-etiqueta">${producto.personalizable ? 'Desde' : 'Precio'}</span>
      </div>
      
      <button class="btn-agregar" onclick="${producto.personalizable ? 'abrirPersonalizacion(' + producto.id + ')' : 'agregarAlCarrito(' + producto.id + ')'}">
        <span class="btn-icon">${producto.personalizable ? '🎨' : '🛒'}</span>
        ${textoBoton}
      </button>
    </div>
  `;
  
  return div;
}

// ============ MODAL DE PERSONALIZACIÓN ============

/**
 * Crea el modal de personalización de Mini Donas
 */
function crearModalPersonalizacion() {
  const modal = document.createElement('div');
  modal.id = 'modal-personalizacion';
  modal.className = 'modal-personalizacion';
  modal.innerHTML = `
    <div class="modal-contenido">
      <div class="modal-header">
        <h2>🍩 Personaliza tus Mini Donas</h2>
        <button class="btn-cerrar-modal" onclick="cerrarPersonalizacion()">✕</button>
      </div>
      
      <div class="modal-body">
        <!-- Paso 1: Sabor -->
        <div class="personalizacion-seccion">
          <h3>1️⃣ Elige el Sabor</h3>
          <div class="opciones-grid" id="opciones-sabor"></div>
        </div>
        
        <!-- Paso 2: Cantidad -->
        <div class="personalizacion-seccion">
          <h3>2️⃣ Cantidad</h3>
          <div class="opciones-grid" id="opciones-cantidad"></div>
        </div>
        
        <!-- Paso 3: Glaseado -->
        <div class="personalizacion-seccion">
          <h3>3️⃣ Tipo de Glaseado</h3>
          <div class="opciones-grid" id="opciones-glaseado"></div>
        </div>
        
        <!-- Paso 4: Topping -->
        <div class="personalizacion-seccion">
          <h3>4️⃣ Topping Favorito</h3>
          <div class="opciones-grid opciones-grid-small" id="opciones-topping"></div>
        </div>
        
        <!-- Resumen -->
        <div class="personalizacion-resumen">
          <h3>📋 Tu Pedido:</h3>
          <div id="resumen-personalizacion" class="resumen-texto"></div>
          <div class="precio-total-modal">
            <span>Total:</span>
            <span id="precio-modal">$0</span>
          </div>
        </div>
      </div>
      
      <div class="modal-footer">
        <button class="btn-cancelar" onclick="cerrarPersonalizacion()">Cancelar</button>
        <button class="btn-agregar-personalizado" onclick="agregarDonaPersonalizada()">
          Agregar al Carrito 🛒
        </button>
      </div>
    </div>
  `;
  
  document.body.appendChild(modal);
  
  // Renderizar opciones
  renderizarOpcionesSabor();
  renderizarOpcionesCantidad();
  renderizarOpcionesGlaseado();
  renderizarOpcionesTopping();
}

let seleccionActual = {
  productoId: null,
  sabor: null,
  cantidad: null,
  glaseado: null,
  topping: null,
  precio: 0
};

function abrirPersonalizacion(productoId) {
  seleccionActual = {
    productoId: productoId,
    sabor: null,
    cantidad: null,
    glaseado: null,
    topping: null,
    precio: 0
  };
  
  document.getElementById('modal-personalizacion').classList.add('active');
  actualizarResumenPersonalizacion();
}

function cerrarPersonalizacion() {
  document.getElementById('modal-personalizacion').classList.remove('active');
}

function renderizarOpcionesSabor() {
  const container = document.getElementById('opciones-sabor');
  container.innerHTML = '';
  
  saboresDonas.forEach(sabor => {
    const btn = document.createElement('button');
    btn.className = 'opcion-btn';
    btn.innerHTML = `${sabor.emoji} ${sabor.nombre}`;
    btn.onclick = () => seleccionarSabor(sabor.id);
    container.appendChild(btn);
  });
}

function renderizarOpcionesCantidad() {
  const container = document.getElementById('opciones-cantidad');
  container.innerHTML = '';
  
  cantidadesDonas.forEach(opcion => {
    const btn = document.createElement('button');
    btn.className = 'opcion-btn';
    btn.innerHTML = `
      <span>${opcion.emoji}</span>
      <span>${opcion.nombre}</span>
      <span class="opcion-precio">$${formatearPrecio(opcion.precio)}</span>
    `;
    btn.onclick = () => seleccionarCantidad(opcion.id);
    container.appendChild(btn);
  });
}

function renderizarOpcionesGlaseado() {
  const container = document.getElementById('opciones-glaseado');
  container.innerHTML = '';
  
  glaseados.forEach(glaseado => {
    const btn = document.createElement('button');
    btn.className = 'opcion-btn';
    btn.innerHTML = `${glaseado.emoji} ${glaseado.nombre}`;
    btn.onclick = () => seleccionarGlaseado(glaseado.id);
    container.appendChild(btn);
  });
}

function renderizarOpcionesTopping() {
  const container = document.getElementById('opciones-topping');
  container.innerHTML = '';
  
  toppings.forEach(topping => {
    const btn = document.createElement('button');
    btn.className = 'opcion-btn opcion-btn-small';
    btn.innerHTML = `${topping.emoji} ${topping.nombre}`;
    btn.onclick = () => seleccionarTopping(topping.id);
    container.appendChild(btn);
  });
}

function seleccionarSabor(saborId) {
  seleccionActual.sabor = saborId;
  actualizarEstadoBotones('opciones-sabor', saborId);
  actualizarResumenPersonalizacion();
}

function seleccionarCantidad(cantidadId) {
  seleccionActual.cantidad = cantidadId;
  const opcion = cantidadesDonas.find(c => c.id === cantidadId);
  seleccionActual.precio = opcion ? opcion.precio : 0;
  actualizarEstadoBotones('opciones-cantidad', cantidadId);
  actualizarResumenPersonalizacion();
}

function seleccionarGlaseado(glaseadoId) {
  seleccionActual.glaseado = glaseadoId;
  actualizarEstadoBotones('opciones-glaseado', glaseadoId);
  actualizarResumenPersonalizacion();
}

function seleccionarTopping(toppingId) {
  seleccionActual.topping = toppingId;
  actualizarEstadoBotones('opciones-topping', toppingId);
  actualizarResumenPersonalizacion();
}

function actualizarEstadoBotones(containerId, selectedId) {
  const container = document.getElementById(containerId);
  const buttons = container.querySelectorAll('.opcion-btn');
  buttons.forEach(btn => btn.classList.remove('selected'));
  
  const selectedBtn = Array.from(buttons).find(btn => {
    const text = btn.textContent.toLowerCase();
    return text.includes(selectedId);
  });
  
  if (selectedBtn) selectedBtn.classList.add('selected');
}

function actualizarResumenPersonalizacion() {
  const resumen = document.getElementById('resumen-personalizacion');
  const precioModal = document.getElementById('precio-modal');
  
  let texto = '';
  
  if (seleccionActual.sabor) {
    const sabor = saboresDonas.find(s => s.id === seleccionActual.sabor);
    texto += `<div>✓ Sabor: ${sabor.nombre}</div>`;
  }
  
  if (seleccionActual.cantidad) {
    const cantidad = cantidadesDonas.find(c => c.id === seleccionActual.cantidad);
    texto += `<div>✓ Cantidad: ${cantidad.nombre}</div>`;
  }
  
  if (seleccionActual.glaseado) {
    const glaseado = glaseados.find(g => g.id === seleccionActual.glaseado);
    texto += `<div>✓ Glaseado: ${glaseado.nombre}</div>`;
  }
  
  if (seleccionActual.topping) {
    const topping = toppings.find(t => t.id === seleccionActual.topping);
    texto += `<div>✓ Topping: ${topping.nombre}</div>`;
  }
  
  resumen.innerHTML = texto || '<div class="texto-muted">Selecciona tus opciones...</div>';
  precioModal.textContent = '$' + formatearPrecio(seleccionActual.precio);
}

function agregarDonaPersonalizada() {
  // Validar que todas las opciones estén seleccionadas
  if (!seleccionActual.sabor || !seleccionActual.cantidad || 
      !seleccionActual.glaseado || !seleccionActual.topping) {
    alert('⚠️ Por favor completa todas las opciones de personalización');
    return;
  }
  
  // Obtener nombres de las opciones seleccionadas
  const sabor = saboresDonas.find(s => s.id === seleccionActual.sabor);
  const cantidad = cantidadesDonas.find(c => c.id === seleccionActual.cantidad);
  const glaseado = glaseados.find(g => g.id === seleccionActual.glaseado);
  const topping = toppings.find(t => t.id === seleccionActual.topping);
  
  // Crear producto personalizado
  const productoPersonalizado = {
    id: Date.now(), // ID único
    nombre: `Mini Donas ${sabor.nombre}`,
    descripcion: `${cantidad.nombre} | Glaseado: ${glaseado.nombre} | Topping: ${topping.nombre}`,
    precio: seleccionActual.precio,
    emoji: '🍩',
    tipo: 'mini-donas-personalizado',
    personalizacion: {
      sabor: sabor.nombre,
      cantidad: cantidad.cantidad,
      glaseado: glaseado.nombre,
      topping: topping.nombre
    }
  };
  
  // Agregar al carrito
  carrito.push(productoPersonalizado);
  guardarCarritoEnStorage();
  renderizarCarrito();
  
  // Cerrar modal
  cerrarPersonalizacion();
  
  // Feedback
  mostrarNotificacion(`✅ ¡Mini Donas agregadas al carrito!`);
  
  console.log('✅ Mini Donas personalizadas agregadas:', productoPersonalizado);
}

// ============ FUNCIONES DEL CARRITO ============

/**
 * Agrega un producto normal al carrito por su ID
 */
function agregarAlCarrito(id) {
  const producto = productos.find(p => p.id === id);
  
  if (!producto) {
    console.error(`❌ Producto con ID ${id} no encontrado`);
    return;
  }
  
  if (producto.personalizable) {
    abrirPersonalizacion(id);
    return;
  }
  
  carrito.push({ ...producto });
  guardarCarritoEnStorage();
  renderizarCarrito();
  mostrarNotificacion(`✅ ${producto.nombre} agregado al carrito`);
  
  console.log(`✅ Producto agregado: ${producto.nombre}`);
}

/**
 * Renderiza el carrito de compras en el panel lateral
 */
function renderizarCarrito() {
  actualizarContadorCarrito();
  
  if (carrito.length === 0) {
    carritoVacio.classList.remove('hidden');
    carritoFooter.classList.add('hidden');
    listaCarrito.innerHTML = '';
    return;
  }
  
  carritoVacio.classList.add('hidden');
  carritoFooter.classList.remove('hidden');
  
  listaCarrito.innerHTML = '';
  
  carrito.forEach((item, index) => {
    const li = crearItemCarritoSimple(item, index);
    listaCarrito.appendChild(li);
  });
  
  actualizarTotal();
  console.log(`🛒 Carrito renderizado: ${carrito.length} items`);
}

/**
 * Crea un elemento de lista para un item del carrito
 */
function crearItemCarritoSimple(item, index) {
  const li = document.createElement('li');
  li.classList.add('carrito-item');
  
  li.innerHTML = `
    <div class="carrito-item-info">
      <div class="carrito-item-nombre">${item.emoji} ${item.nombre}</div>
      ${item.descripcion ? `<div class="carrito-item-descripcion">${item.descripcion}</div>` : ''}
      <div class="carrito-item-precio">$${formatearPrecio(item.precio)}</div>
    </div>
    <button class="btn-eliminar" onclick="eliminarItemCarrito(${index})" aria-label="Eliminar producto">🗑️</button>
  `;
  
  return li;
}

/**
 * Elimina un item específico del carrito por índice
 */
function eliminarItemCarrito(index) {
  const productoNombre = carrito[index]?.nombre;
  carrito.splice(index, 1);
  guardarCarritoEnStorage();
  renderizarCarrito();
  
  if (productoNombre) {
    mostrarNotificacion(`🗑️ ${productoNombre} eliminado del carrito`);
  }
}

/**
 * Vacía completamente el carrito
 */
function vaciarCarrito() {
  if (carrito.length === 0) return;
  
  const confirmar = confirm('¿Estás seguro de que quieres vaciar el carrito?');
  
  if (confirmar) {
    carrito = [];
    guardarCarritoEnStorage();
    renderizarCarrito();
    mostrarNotificacion('🗑️ Carrito vaciado');
    console.log('🗑️ Carrito vaciado completamente');
  }
}

/**
 * Calcula el total del carrito
 */
function calcularTotal() {
  return carrito.reduce((total, item) => total + item.precio, 0);
}

/**
 * Actualiza el precio total en el DOM
 */
function actualizarTotal() {
  const total = calcularTotal();
  totalPrecio.textContent = `$${formatearPrecio(total)}`;
}

/**
 * Actualiza el contador de items en el botón del carrito
 */
function actualizarContadorCarrito() {
  const cantidad = carrito.length;
  carritoContador.textContent = cantidad;
}

// ============ FINALIZAR PEDIDO ============

/**
 * Procesa el checkout del pedido
 */
async function finalizarPedido() {
  if (carrito.length === 0) {
    alert('🛒 Tu carrito está vacío. Agrega productos antes de finalizar el pedido.');
    return;
  }
  
  // Mostrar modal en lugar de prompts
  mostrarModalCliente();
}

function mostrarModalCliente() {
  const modal = document.getElementById('modal-cliente');
  modal.style.display = 'flex';
  
  // Limpiar campos
  document.getElementById('nombre-cliente').value = '';
  document.getElementById('telefono-cliente').value = '';
  document.getElementById('direccion-cliente').value = '';
  document.getElementById('observaciones-cliente').value = '';
  
  // Enfocar el primer campo
  setTimeout(() => {
    document.getElementById('nombre-cliente').focus();
  }, 100);
}

function cerrarModalCliente() {
  const modal = document.getElementById('modal-cliente');
  modal.style.display = 'none';
}

async function confirmarPedido() {
  // Obtener valores del modal
  const nombre = document.getElementById('nombre-cliente').value.trim();
  const telefono = document.getElementById('telefono-cliente').value.trim();
  const direccion = document.getElementById('direccion-cliente').value.trim();
  const observaciones = document.getElementById('observaciones-cliente').value.trim();
  
  // Validar campos obligatorios
  if (!nombre) {
    alert('❌ El nombre es obligatorio');
    document.getElementById('nombre-cliente').focus();
    return;
  }
  
  if (!telefono) {
    alert('❌ El teléfono es obligatorio');
    document.getElementById('telefono-cliente').focus();
    return;
  }
  
  if (!direccion) {
    alert('❌ La dirección es obligatoria');
    document.getElementById('direccion-cliente').focus();
    return;
  }
  
  const pedido = {
    id: Date.now(),
    fecha: new Date().toISOString(),
    cliente: {
      nombre: nombre,
      telefono: telefono,
      direccion: direccion
    },
    productos: [...carrito],
    total: calcularTotal(),
    estado: 'pendiente',
    observaciones: observaciones || '',
    userId: firebaseService?.obtenerUsuarioActual()?.uid || null
  };
  
  // Cerrar modal inmediatamente
  cerrarModalCliente();
  
  // Mostrar mensaje de procesamiento
  const procesando = confirm('📦 Procesando tu pedido...\n\nPresiona OK para continuar.');
  if (!procesando) return;
  
  try {
    await guardarPedido(pedido);
    mostrarResumenPedido(pedido);
    
    carrito = [];
    guardarCarritoEnStorage();
    renderizarCarrito();
    
    console.log('✅ Pedido finalizado:', pedido);
  } catch (error) {
    console.error('Error finalizando pedido:', error);
    alert('❌ Hubo un error procesando tu pedido. Por favor intenta nuevamente.');
  }
}

/**
 * Guarda un pedido en Firebase o localStorage (fallback)
 */
async function guardarPedido(pedido) {
  try {
    // Mostrar loading
    if (typeof loadingState !== 'undefined') {
      loadingState.start('guardar-pedido', { message: 'Guardando pedido...' });
    }

    // Usar el nuevo PedidosService
    if (typeof pedidosService !== 'undefined') {
      const pedidoId = await pedidosService.crearPedido(pedido);
      console.log(`✅ Pedido guardado exitosamente: ${pedidoId}`);
      
      if (typeof loadingState !== 'undefined') {
        loadingState.stop('guardar-pedido');
      }
      
      return pedidoId;
    }
    
    // Fallback a localStorage si no hay servicio disponible
    let pedidos = [];
    const pedidosGuardados = localStorage.getItem(ORDERS_KEY);
    
    if (pedidosGuardados) {
      try {
        pedidos = JSON.parse(pedidosGuardados);
      } catch (error) {
        console.error('Error al parsear pedidos:', error);
        pedidos = [];
      }
    }
    
    pedidos.push(pedido);
    localStorage.setItem(ORDERS_KEY, JSON.stringify(pedidos));
    console.log(`💾 Pedido guardado en localStorage. Total de pedidos: ${pedidos.length}`);
    
    if (typeof loadingState !== 'undefined') {
      loadingState.stop('guardar-pedido');
    }
    
    return pedido.id;
    
  } catch (error) {
    console.error('❌ Error guardando pedido:', error);
    
    if (typeof loadingState !== 'undefined') {
      loadingState.stop('guardar-pedido');
    }
    
    if (typeof ErrorHandler !== 'undefined') {
      ErrorHandler.show(error, { showUI: true });
    } else if (typeof toastManager !== 'undefined') {
      toastManager.error(error.message || 'Error guardando pedido');
    }
    
    throw error;
  }
}

/**
 * Muestra un resumen del pedido realizado
 */
function mostrarResumenPedido(pedido) {
  let resumen = `
🎉 ¡PEDIDO REALIZADO CON ÉXITO! 🎉

📋 Número de pedido: #${pedido.id}

👤 Cliente: ${pedido.cliente.nombre}
📱 Teléfono: ${pedido.cliente.telefono}
📍 Dirección: ${pedido.cliente.direccion}

🛒 Productos:
`;
  
  pedido.productos.forEach(item => {
    resumen += `\n  ${item.emoji} ${item.nombre} - $${formatearPrecio(item.precio)}`;
    if (item.descripcion && item.tipo === 'mini-donas-personalizado') {
      resumen += `\n     ${item.descripcion}`;
    }
  });
  
  resumen += `\n\n💰 TOTAL: $${formatearPrecio(pedido.total)}`;
  resumen += `\n\n✨ Tu pedido será procesado pronto.`;
  resumen += `\nGracias por tu compra! 🍩`;
  
  alert(resumen);
}

// ============ LOCALSTORAGE ============

function guardarCarritoEnStorage() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(carrito));
  console.log('💾 Carrito guardado en localStorage');
}

function cargarCarritoDesdeStorage() {
  const carritoGuardado = localStorage.getItem(STORAGE_KEY);
  
  if (carritoGuardado) {
    try {
      carrito = JSON.parse(carritoGuardado);
      console.log(`📦 Carrito cargado desde localStorage: ${carrito.length} items`);
    } catch (error) {
      console.error('Error al parsear carrito:', error);
      carrito = [];
    }
  }
}

async function obtenerPedidos() {
  // Intentar obtener de Firebase
  if (firebaseService && firebaseService.isInitialized()) {
    try {
      const userId = firebaseService.obtenerUsuarioActual()?.uid;
      return await firebaseService.obtenerPedidos(userId);
    } catch (error) {
      console.error('Error obteniendo de Firebase, usando localStorage:', error);
    }
  }
  
  // Fallback a localStorage
  const pedidosGuardados = localStorage.getItem(ORDERS_KEY);
  
  if (pedidosGuardados) {
    try {
      return JSON.parse(pedidosGuardados);
    } catch (error) {
      console.error('Error al parsear pedidos:', error);
      return [];
    }
  }
  
  return [];
}

// ============ EVENT LISTENERS ============

function inicializarEventListeners() {
  if (btnCarrito) {
    btnCarrito.addEventListener('click', abrirCarritoModal);
  }
  
  if (btnCerrarCarrito) {
    btnCerrarCarrito.addEventListener('click', cerrarCarritoModal);
  }
  
  if (btnCheckout) {
    btnCheckout.addEventListener('click', finalizarPedido);
  }
  
  if (btnVaciarCarrito) {
    btnVaciarCarrito.addEventListener('click', vaciarCarrito);
  }
  
  // Cerrar modal al hacer clic fuera
  if (carritoModal) {
    carritoModal.addEventListener('click', (e) => {
      if (e.target === carritoModal) {
        cerrarCarritoModal();
      }
    });
  }
  
  console.log('✅ Event listeners inicializados');
}

function abrirCarritoModal() {
  if (carritoModal) {
    carritoModal.classList.add('active');
    document.body.style.overflow = 'hidden'; // Prevenir scroll del body
  }
}

function cerrarCarritoModal() {
  if (carritoModal) {
    carritoModal.classList.remove('active');
    document.body.style.overflow = 'auto'; // Restaurar scroll del body
  }
}

// ============ UTILIDADES ============

function formatearPrecio(precio) {
  return precio.toLocaleString('es-CO');
}

function mostrarNotificacion(mensaje) {
  console.log(`📢 ${mensaje}`);
}

function verPedidos() {
  const pedidos = obtenerPedidos();
  console.table(pedidos);
  return pedidos;
}

function limpiarPedidos() {
  if (confirm('¿Estás seguro de que quieres eliminar todos los pedidos?')) {
    localStorage.removeItem(ORDERS_KEY);
    console.log('🗑️ Todos los pedidos han sido eliminados');
  }
}

// ============ EXPOSICIÓN GLOBAL (para debugging) ============
window.loquieroyaCM = {
  carrito,
  productos,
  verPedidos,
  limpiarPedidos,
  agregarAlCarrito,
  vaciarCarrito
};

console.log('✅ Sistema Lo Quiero YA CM cargado correctamente');
console.log('💡 Tip: Usa window.loquieroyaCM para acceder a funciones de debug');
