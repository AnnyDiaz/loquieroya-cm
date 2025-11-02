/* ============================================
   🔐 Panel de Administración
   Lo Quiero YA CM
   ============================================ */

let pedidosActuales = [];
let usuarioActual = null;

// ============ INICIALIZACIÓN ============

document.addEventListener('DOMContentLoaded', () => {
  console.log('🔐 Panel de administración cargado');
  
  // Esperar a que Firebase se inicialice
  setTimeout(() => {
    verificarAutenticacion();
  }, 500);
  
  // Event listeners
  inicializarEventListeners();
});

// ============ AUTENTICACIÓN ============

function verificarAutenticacion() {
  if (!firebaseService || !firebaseService.isInitialized()) {
    console.warn('⚠️ Firebase no está inicializado. Mostrando datos de localStorage.');
    // Cargar datos de localStorage en modo demo
    cargarPedidosLocalStorage();
    document.getElementById('admin-login').style.display = 'none';
    document.getElementById('admin-panel').style.display = 'grid';
    document.getElementById('user-email').textContent = 'Modo Local (sin Firebase)';
    return;
  }

  firebaseService.onAuthStateChanged((user) => {
    if (user) {
      usuarioActual = user;
      mostrarPanel();
      cargarPedidos();
    } else {
      mostrarLogin();
    }
  });
}

function mostrarLogin() {
  document.getElementById('admin-login').style.display = 'flex';
  document.getElementById('admin-panel').style.display = 'none';
}

function mostrarPanel() {
  document.getElementById('admin-login').style.display = 'none';
  document.getElementById('admin-panel').style.display = 'grid';
  
  if (usuarioActual) {
    document.getElementById('user-email').textContent = usuarioActual.email;
  }
}

// ============ EVENT LISTENERS ============

function inicializarEventListeners() {
  // Login form
  const formLogin = document.getElementById('form-login');
  if (formLogin) {
    formLogin.addEventListener('submit', (e) => {
      e.preventDefault();
      login();
    });
  }

  // Logout button
  const btnLogout = document.getElementById('btn-logout');
  if (btnLogout) {
    btnLogout.addEventListener('click', logout);
  }

  // Navigation
  const navLinks = document.querySelectorAll('.nav-link');
  navLinks.forEach(link => {
    link.addEventListener('click', (e) => {
      e.preventDefault();
      const section = link.dataset.section;
      cambiarSeccion(section);
    });
  });

  // Refresh button
  const btnRefresh = document.getElementById('btn-refresh');
  if (btnRefresh) {
    btnRefresh.addEventListener('click', cargarPedidos);
  }

  // Filters
  const filterEstado = document.getElementById('filter-estado');
  const filterFecha = document.getElementById('filter-fecha');
  const filterBuscar = document.getElementById('filter-buscar');

  if (filterEstado) filterEstado.addEventListener('change', filtrarPedidos);
  if (filterFecha) filterFecha.addEventListener('change', filtrarPedidos);
  if (filterBuscar) filterBuscar.addEventListener('input', filtrarPedidos);
}

// ============ LOGIN / LOGOUT ============

async function login() {
  const email = document.getElementById('email').value.trim();
  const password = document.getElementById('password').value;
  const errorDiv = document.getElementById('error-login');

  errorDiv.textContent = '';

  try {
    await firebaseService.iniciarSesion(email, password);
    console.log('✅ Login exitoso');
  } catch (error) {
    console.error('Error en login:', error);
    
    let mensaje = 'Error al iniciar sesión';
    
    if (error.code === 'auth/wrong-password') {
      mensaje = 'Contraseña incorrecta';
    } else if (error.code === 'auth/user-not-found') {
      mensaje = 'Usuario no encontrado';
    } else if (error.code === 'auth/invalid-email') {
      mensaje = 'Email inválido';
    } else if (error.code === 'auth/too-many-requests') {
      mensaje = 'Demasiados intentos. Espera un momento.';
    }
    
    errorDiv.textContent = mensaje;
  }
}

async function logout() {
  if (confirm('¿Estás seguro de que quieres cerrar sesión?')) {
    try {
      if (firebaseService && firebaseService.isInitialized()) {
        await firebaseService.cerrarSesion();
      }
      usuarioActual = null;
      mostrarLogin();
      console.log('✅ Logout exitoso');
    } catch (error) {
      console.error('Error en logout:', error);
      alert('Error cerrando sesión');
    }
  }
}

// ============ NAVEGACIÓN ============

function cambiarSeccion(seccion) {
  // Actualizar nav links
  document.querySelectorAll('.nav-link').forEach(link => {
    link.classList.remove('active');
    if (link.dataset.section === seccion) {
      link.classList.add('active');
    }
  });

  // Ocultar todas las secciones
  document.querySelectorAll('.admin-section').forEach(sec => {
    sec.style.display = 'none';
  });

  // Mostrar sección seleccionada
  const sectionElement = document.getElementById(`section-${seccion}`);
  if (sectionElement) {
    sectionElement.style.display = 'block';
  }

  // Actualizar título
  const titles = {
    'pedidos': '📦 Pedidos',
    'productos': '🍰 Productos',
    'estadisticas': '📊 Estadísticas',
    'configuracion': '⚙️ Configuración'
  };

  document.getElementById('section-title').textContent = titles[seccion] || seccion;

  // Cargar datos específicos de la sección
  if (seccion === 'estadisticas') {
    calcularEstadisticas();
  }
}

// ============ CARGAR PEDIDOS ============

async function cargarPedidos() {
  const tablaPedidos = document.getElementById('tabla-pedidos');
  const emptyState = document.getElementById('empty-pedidos');
  
  tablaPedidos.innerHTML = '<tr><td colspan="8" class="loading-cell">Cargando pedidos...</td></tr>';
  emptyState.style.display = 'none';

  try {
    let pedidos = [];

    // SIEMPRE usar Firebase - nunca localStorage
    if (firebaseService && firebaseService.isInitialized()) {
      pedidos = await firebaseService.obtenerPedidos();
    } else {
      throw new Error('Firebase no está inicializado. El panel admin requiere Firebase.');
    }

    pedidosActuales = pedidos;

    if (pedidos.length === 0) {
      tablaPedidos.innerHTML = '';
      emptyState.style.display = 'block';
    } else {
      renderizarPedidos(pedidos);
    }

    console.log(`✅ ${pedidos.length} pedidos cargados`);
  } catch (error) {
    console.error('Error cargando pedidos:', error);
    tablaPedidos.innerHTML = '<tr><td colspan="8" class="loading-cell" style="color: #D32F2F;">Error cargando pedidos</td></tr>';
  }
}

function cargarPedidosLocalStorage() {
  const pedidosGuardados = localStorage.getItem('lqy_orders');
  
  if (pedidosGuardados) {
    try {
      return JSON.parse(pedidosGuardados);
    } catch (error) {
      console.error('Error parseando pedidos:', error);
      return [];
    }
  }
  
  return [];
}

// ============ RENDERIZAR PEDIDOS ============

function renderizarPedidos(pedidos) {
  const tablaPedidos = document.getElementById('tabla-pedidos');
  tablaPedidos.innerHTML = '';

  pedidos.forEach(pedido => {
    const tr = crearFilaPedido(pedido);
    tablaPedidos.appendChild(tr);
  });
}

function crearFilaPedido(pedido) {
  const tr = document.createElement('tr');
  
  // Formatear fecha
  let fechaTexto = 'N/A';
  if (pedido.fecha) {
    try {
      const fecha = pedido.fecha.toDate ? pedido.fecha.toDate() : new Date(pedido.fecha);
      fechaTexto = fecha.toLocaleString('es-CO', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      });
    } catch (e) {
      console.error('Error formateando fecha:', e);
    }
  }

  // Contar productos
  const cantidadProductos = pedido.productos ? pedido.productos.length : 0;
  
  // Estado
  const estado = pedido.estado || 'pendiente';
  const estadoClass = `estado-${estado.toLowerCase()}`;

  tr.innerHTML = `
    <td>#${String(pedido.id).slice(-6)}</td>
    <td>${fechaTexto}</td>
    <td>${pedido.cliente?.nombre || 'N/A'}</td>
    <td>${pedido.cliente?.telefono || 'N/A'}</td>
    <td>${cantidadProductos} item${cantidadProductos !== 1 ? 's' : ''}</td>
    <td>$${formatearPrecio(pedido.total || 0)}</td>
    <td><span class="estado-badge ${estadoClass}">${estado}</span></td>
    <td>
      <div class="action-btns">
        <button class="btn-action btn-ver" onclick="verDetallePedido('${pedido.id}')">
          Ver
        </button>
        <button class="btn-action btn-cambiar-estado" onclick="cambiarEstadoPedido('${pedido.id}')">
          Estado
        </button>
      </div>
    </td>
  `;

  return tr;
}

// ============ FILTRAR PEDIDOS ============

function filtrarPedidos() {
  const filterEstado = document.getElementById('filter-estado').value;
  const filterFecha = document.getElementById('filter-fecha').value;
  const filterBuscar = document.getElementById('filter-buscar').value.toLowerCase();

  let pedidosFiltrados = [...pedidosActuales];

  // Filtrar por estado
  if (filterEstado !== 'todos') {
    pedidosFiltrados = pedidosFiltrados.filter(p => p.estado === filterEstado);
  }

  // Filtrar por fecha
  if (filterFecha) {
    pedidosFiltrados = pedidosFiltrados.filter(p => {
      if (!p.fecha) return false;
      const fechaPedido = p.fecha.toDate ? p.fecha.toDate() : new Date(p.fecha);
      const fechaFiltro = new Date(filterFecha);
      return fechaPedido.toDateString() === fechaFiltro.toDateString();
    });
  }

  // Filtrar por búsqueda
  if (filterBuscar) {
    pedidosFiltrados = pedidosFiltrados.filter(p => {
      const nombre = (p.cliente?.nombre || '').toLowerCase();
      const telefono = (p.cliente?.telefono || '').toLowerCase();
      return nombre.includes(filterBuscar) || telefono.includes(filterBuscar);
    });
  }

  renderizarPedidos(pedidosFiltrados);
}

// ============ DETALLE DEL PEDIDO ============

function verDetallePedido(pedidoId) {
  const pedido = pedidosActuales.find(p => p.id == pedidoId);
  
  if (!pedido) {
    alert('Pedido no encontrado');
    return;
  }

  const modal = document.getElementById('modal-detalle');
  const content = document.getElementById('detalle-pedido-content');

  let html = `
    <div style="margin-bottom: 20px;">
      <h3>📋 Información del Pedido</h3>
      <p><strong>ID:</strong> #${pedidoId}</p>
      <p><strong>Estado:</strong> <span class="estado-badge estado-${pedido.estado}">${pedido.estado}</span></p>
      <p><strong>Total:</strong> $${formatearPrecio(pedido.total)}</p>
    </div>

    <div style="margin-bottom: 20px;">
      <h3>👤 Información del Cliente</h3>
      <p><strong>Nombre:</strong> ${pedido.cliente?.nombre || 'N/A'}</p>
      <p><strong>Teléfono:</strong> ${pedido.cliente?.telefono || 'N/A'}</p>
      <p><strong>Dirección:</strong> ${pedido.cliente?.direccion || 'N/A'}</p>
    </div>

    <div>
      <h3>🛒 Productos</h3>
      <div style="background-color: var(--color-bg-secondary); padding: 15px; border-radius: 8px;">
  `;

  pedido.productos.forEach(producto => {
    html += `
      <div style="padding: 10px 0; border-bottom: 1px solid var(--color-border);">
        <strong>${producto.emoji} ${producto.nombre}</strong><br>
        ${producto.descripcion ? `<small style="color: var(--color-text-secondary);">${producto.descripcion}</small><br>` : ''}
        <span style="color: var(--color-primary-dark); font-weight: 600;">$${formatearPrecio(producto.precio)}</span>
      </div>
    `;
  });

  html += `
      </div>
    </div>
  `;

  content.innerHTML = html;
  modal.style.display = 'flex';
}

function cerrarModalDetalle() {
  document.getElementById('modal-detalle').style.display = 'none';
}

// ============ CAMBIAR ESTADO ============

async function cambiarEstadoPedido(pedidoId) {
  const nuevoEstado = prompt('Ingresa el nuevo estado:\n- pendiente\n- procesando\n- enviado\n- entregado\n- cancelado');
  
  if (!nuevoEstado) return;

  const estadosValidos = ['pendiente', 'procesando', 'enviado', 'entregado', 'cancelado'];
  
  if (!estadosValidos.includes(nuevoEstado.toLowerCase())) {
    alert('Estado inválido');
    return;
  }

  try {
    // SIEMPRE usar Firebase - nunca localStorage
    if (!firebaseService || !firebaseService.isInitialized()) {
      throw new Error('Firebase no está disponible');
    }
    
    await firebaseService.actualizarEstadoPedido(pedidoId, nuevoEstado.toLowerCase());
    alert('✅ Estado actualizado correctamente');
    cargarPedidos();
  } catch (error) {
    console.error('Error actualizando estado:', error);
    alert(`❌ Error actualizando el estado: ${error.message}`);
  }
}

// ============ ESTADÍSTICAS ============

function calcularEstadisticas() {
  const totalPedidos = pedidosActuales.length;
  const pendientes = pedidosActuales.filter(p => p.estado === 'pendiente').length;
  const entregados = pedidosActuales.filter(p => p.estado === 'entregado').length;
  const ventasTotales = pedidosActuales.reduce((sum, p) => sum + (p.total || 0), 0);

  document.getElementById('stat-total-pedidos').textContent = totalPedidos;
  document.getElementById('stat-pendientes').textContent = pendientes;
  document.getElementById('stat-entregados').textContent = entregados;
  document.getElementById('stat-ventas').textContent = '$' + formatearPrecio(ventasTotales);
}

// ============ UTILIDADES ============

function formatearPrecio(precio) {
  return precio.toLocaleString('es-CO');
}

// ============ GLOBAL ============

window.verDetallePedido = verDetallePedido;
window.cambiarEstadoPedido = cambiarEstadoPedido;
window.cerrarModalDetalle = cerrarModalDetalle;

console.log('✅ Admin.js cargado correctamente');

