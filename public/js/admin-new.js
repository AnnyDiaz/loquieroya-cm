/* ============================================
   👨‍💼 Panel de Administración - Lo Quiero YA CM
   Sistema completo con tiempo real y estadísticas
   ============================================ */

// ============ VARIABLES GLOBALES ============
let pedidosActuales = [];
let pedidosFiltrados = [];
let estadisticasActuales = {};
let listenerActivo = null;

// ============ ELEMENTOS DEL DOM ============
const loginForm = document.getElementById('login-form');
const loginSection = document.getElementById('login-section');
const panelSection = document.getElementById('panel-section');
const tablaPedidos = document.getElementById('tabla-pedidos');
const emptyState = document.getElementById('empty-pedidos');

// ============ INICIALIZACIÓN ============

document.addEventListener('DOMContentLoaded', () => {
  console.log(' Panel Admin - Lo Quiero YA CM iniciado');
  
  // Verificar autenticación
  verificarAutenticacion();
  
  // Inicializar event listeners
  inicializarEventListeners();
});

// ============ AUTENTICACIÓN ============

/**
 * Verifica si hay un usuario autenticado
 */
function verificarAutenticacion() {
  if (typeof authService === 'undefined') {
    console.error('❌ AuthService no disponible');
    mostrarLogin();
    return;
  }

  // Suscribirse a cambios de autenticación
  authService.subscribe((data) => {
    if (data.user) {
      mostrarPanel();
      iniciarSistemaAdmin();
    } else {
      mostrarLogin();
      detenerSistemaAdmin();
    }
  });

  // Verificar usuario actual
  const user = authService.getCurrentUser();
  if (user) {
    mostrarPanel();
    iniciarSistemaAdmin();
  } else {
    mostrarLogin();
  }
}

function mostrarLogin() {
  loginSection.style.display = 'flex';
  panelSection.style.display = 'none';
}

function mostrarPanel() {
  loginSection.style.display = 'none';
  panelSection.style.display = 'block';
  
  // Actualizar info del usuario
  const user = authService.getCurrentUser();
  if (user) {
    document.getElementById('admin-email').textContent = user.email;
  }
}

/**
 * Inicia sesión del administrador
 */
async function loginAdmin() {
  const email = document.getElementById('email').value.trim();
  const password = document.getElementById('password').value;
  const errorMsg = document.getElementById('login-error');
  const submitBtn = document.querySelector('#login-form button[type="submit"]');

  try {
    // Limpiar errores previos
    errorMsg.style.display = 'none';
    submitBtn.disabled = true;
    submitBtn.textContent = 'Iniciando sesión...';

    // Mostrar loading
    if (typeof loadingState !== 'undefined') {
      loadingState.start('login', { message: 'Iniciando sesión...' });
    }

    // Iniciar sesión
    if (typeof authService === 'undefined') {
      throw new Error('AuthService no disponible');
    }

    await authService.loginAdmin(email, password);

    // Guardar sesión
    authService.saveSession({ email });

    // Éxito
    if (typeof ErrorHandler !== 'undefined') {
      ErrorHandler.showUserMessage('Sesión iniciada correctamente', 'success');
    }

  } catch (error) {
    console.error('❌ Error en login:', error);
    
    errorMsg.textContent = error.message;
    errorMsg.style.display = 'block';
    
    if (typeof errorHandler !== 'undefined') {
      errorHandler.show(error, { showUI: false });
    }
  } finally {
    submitBtn.disabled = false;
    submitBtn.textContent = 'Iniciar Sesión';
    
    if (typeof loadingState !== 'undefined') {
      loadingState.stop('login');
    }
  }
}

/**
 * Cierra sesión de forma segura
 */
async function cerrarSesionSegura() {
  if (!confirm('¿Estás seguro de que deseas cerrar sesión?')) {
    return;
  }

  try {
    if (typeof loadingState !== 'undefined') {
      loadingState.start('logout', { message: 'Cerrando sesión...' });
    }

    // Detener sistema admin
    detenerSistemaAdmin();

    // Cerrar sesión
    if (typeof authService !== 'undefined') {
      await authService.cerrarSesionSegura();
    }

    if (typeof ErrorHandler !== 'undefined') {
      ErrorHandler.showUserMessage('Sesión cerrada correctamente', 'success');
    }

  } catch (error) {
    console.error('❌ Error cerrando sesión:', error);
    
    if (typeof errorHandler !== 'undefined') {
      errorHandler.show(error);
    }
  } finally {
    if (typeof loadingState !== 'undefined') {
      loadingState.stop('logout');
    }
  }
}

// ============ SISTEMA ADMIN ============

/**
 * Inicia el sistema de administración
 */
function iniciarSistemaAdmin() {
  console.log('🚀 Iniciando sistema admin...');
  
  if (typeof adminService === 'undefined') {
    console.error('❌ AdminService no disponible');
    return;
  }

  // Suscribirse a cambios del admin service
  adminService.subscribe((data) => {
    if (data.type === 'pedidos_updated') {
      pedidosActuales = data.pedidos;
      aplicarFiltros();
      actualizarEstadisticas();
      mostrarNotificacionCambios(data.cambios);
    } else if (data.type === 'error') {
      console.error('Error en admin service:', data.error);
    }
  });

  // Iniciar listener en tiempo real
  cargarPedidosEnTiempoReal();
}

/**
 * Detiene el sistema de administración
 */
function detenerSistemaAdmin() {
  console.log('🛑 Deteniendo sistema admin...');
  
  if (typeof adminService !== 'undefined') {
    adminService.detenerListeners();
    adminService.cleanup();
  }
  
  pedidosActuales = [];
  pedidosFiltrados = [];
  estadisticasActuales = {};
}

/**
 * Carga pedidos en tiempo real
 */
function cargarPedidosEnTiempoReal() {
  try {
    if (typeof adminService === 'undefined') {
      throw new Error('AdminService no disponible');
    }

    // Mostrar loading inicial
    tablaPedidos.innerHTML = '<tr><td colspan="8" class="loading-cell">🔄 Cargando pedidos en tiempo real...</td></tr>';
    emptyState.style.display = 'none';

    // Iniciar listener
    listenerActivo = adminService.cargarPedidosEnTiempoReal({
      limite: 100 // Últimos 100 pedidos
    });

    console.log('✅ Listener de pedidos en tiempo real activado');

  } catch (error) {
    console.error('❌ Error cargando pedidos:', error);
    tablaPedidos.innerHTML = '<tr><td colspan="8" class="loading-cell" style="color: #D32F2F;">❌ Error cargando pedidos</td></tr>';
    
    if (typeof errorHandler !== 'undefined') {
      errorHandler.show(error);
    }
  }
}

/**
 * Aplica filtros a los pedidos
 */
function aplicarFiltros() {
  const estado = document.getElementById('filtro-estado')?.value || 'todos';
  const fechaDesde = document.getElementById('filtro-fecha-desde')?.value || '';
  const fechaHasta = document.getElementById('filtro-fecha-hasta')?.value || '';
  const busqueda = document.getElementById('busqueda')?.value || '';
  const ordenar = document.getElementById('filtro-ordenar')?.value || 'fecha_desc';

  const filtros = {
    estado: estado !== 'todos' ? estado : null,
    fechaDesde: fechaDesde ? new Date(fechaDesde).toISOString() : null,
    fechaHasta: fechaHasta ? new Date(fechaHasta + 'T23:59:59').toISOString() : null,
    busqueda,
    ordenar
  };

  if (typeof adminService !== 'undefined') {
    pedidosFiltrados = adminService.filtrarPedidos(filtros);
  } else {
    pedidosFiltrados = pedidosActuales;
  }

  renderizarPedidos(pedidosFiltrados);
}

/**
 * Renderiza los pedidos en la tabla
 */
function renderizarPedidos(pedidos) {
  tablaPedidos.innerHTML = '';

  if (pedidos.length === 0) {
    emptyState.style.display = 'block';
    return;
  }

  emptyState.style.display = 'none';

  pedidos.forEach(pedido => {
    const tr = crearFilaPedido(pedido);
    tablaPedidos.appendChild(tr);
  });

  // Actualizar contador
  document.getElementById('total-resultados').textContent = `${pedidos.length} pedidos`;
}

/**
 * Crea una fila de pedido
 */
function crearFilaPedido(pedido) {
  const tr = document.createElement('tr');
  tr.className = 'pedido-row';
  
  // Clases de estado
  const estadoClasses = {
    pendiente: 'estado-pendiente',
    confirmado: 'estado-confirmado',
    en_preparacion: 'estado-preparacion',
    en_camino: 'estado-camino',
    entregado: 'estado-entregado',
    cancelado: 'estado-cancelado'
  };

  const estadoClass = estadoClasses[pedido.estado] || '';
  
  // Formatear fecha
  const fecha = new Date(pedido.createdAt);
  const fechaFormateada = fecha.toLocaleDateString('es-CO', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });

  // ID corto
  const idCorto = String(pedido.id).slice(-6);

  tr.innerHTML = `
    <td><strong>#${idCorto}</strong></td>
    <td>${fechaFormateada}</td>
    <td>
      <strong>${pedido.cliente?.nombre || 'N/A'}</strong><br>
      <small style="color: var(--color-text-secondary);">${pedido.cliente?.telefono || ''}</small>
    </td>
    <td style="max-width: 200px; overflow: hidden; text-overflow: ellipsis; white-space: nowrap;">
      ${pedido.cliente?.direccion || 'N/A'}
    </td>
    <td>
      <span class="estado-badge ${estadoClass}">
        ${formatearEstado(pedido.estado)}
      </span>
    </td>
    <td><strong>$${formatearPrecio(pedido.total || 0)}</strong></td>
    <td>${pedido.productos?.length || 0} items</td>
    <td>
      <button class="btn-accion btn-ver" onclick="verDetallePedido('${pedido.id}')" title="Ver Detalle">
        👁️
      </button>
      <button class="btn-accion btn-cambiar-estado" onclick="cambiarEstadoPedido('${pedido.id}')" title="Cambiar Estado">
        🔄
      </button>
    </td>
  `;

  return tr;
}

/**
 * Formatea el estado del pedido
 */
function formatearEstado(estado) {
  const estados = {
    pendiente: 'Pendiente',
    confirmado: 'Confirmado',
    en_preparacion: 'En Preparación',
    en_camino: 'En Camino',
    entregado: 'Entregado',
    cancelado: 'Cancelado'
  };
  return estados[estado] || estado;
}

/**
 * Formatea un precio
 */
function formatearPrecio(precio) {
  return precio.toLocaleString('es-CO');
}

/**
 * Actualiza las estadísticas
 */
function actualizarEstadisticas() {
  if (typeof adminService === 'undefined') return;

  estadisticasActuales = adminService.generarEstadisticas();

  document.getElementById('stat-total-pedidos').textContent = estadisticasActuales.totalPedidos;
  document.getElementById('stat-pendientes').textContent = estadisticasActuales.pendientes;
  document.getElementById('stat-entregados').textContent = estadisticasActuales.entregados;
  document.getElementById('stat-ventas').textContent = '$' + formatearPrecio(estadisticasActuales.totalVentas);
  
  // Estadísticas adicionales si existen
  if (document.getElementById('stat-ventas-hoy')) {
    document.getElementById('stat-ventas-hoy').textContent = '$' + formatearPrecio(estadisticasActuales.ventasHoy);
  }
  if (document.getElementById('stat-pedidos-hoy')) {
    document.getElementById('stat-pedidos-hoy').textContent = estadisticasActuales.pedidosHoy;
  }
  if (document.getElementById('stat-promedio-venta')) {
    document.getElementById('stat-promedio-venta').textContent = '$' + formatearPrecio(estadisticasActuales.promedioVenta);
  }
}

/**
 * Muestra notificación de cambios
 */
function mostrarNotificacionCambios(cambios) {
  if (!cambios || cambios.length === 0) return;

  cambios.forEach(cambio => {
    let mensaje = '';
    let tipo = 'info';

    switch (cambio.tipo) {
      case 'added':
        mensaje = `Nuevo pedido recibido: #${String(cambio.pedido.id).slice(-6)}`;
        tipo = 'success';
        // Reproducir sonido (opcional)
        reproducirSonidoNotificacion();
        break;
      case 'modified':
        mensaje = `Pedido actualizado: #${String(cambio.pedido.id).slice(-6)}`;
        tipo = 'info';
        break;
      case 'removed':
        mensaje = `Pedido eliminado: #${String(cambio.pedido.id).slice(-6)}`;
        tipo = 'warning';
        break;
    }

    if (mensaje && typeof ErrorHandler !== 'undefined') {
      ErrorHandler.showUserMessage(mensaje, tipo);
    }
  });
}

/**
 * Reproduce sonido de notificación
 */
function reproducirSonidoNotificacion() {
  try {
    const audio = new Audio('data:audio/wav;base64,UklGRnoGAABXQVZFZm10IBAAAAABAAEAQB8AAEAfAAABAAgAZGF0YQoGAACBhYqFbF1fdJivrJBhNjVgodDbq2EcBj+a2/LDciUFLIHO8tiJNwgZaLvt559NEAxQp+PwtmMcBjiR1/LMeSwFJHfH8N2QQAoUXrTp66hVFApGn+DyvmwhBjiR1/LMeSwFJHfH8N2QQAoUXrTp66hVFApGn+DyvmwhBjiR1/LMeSwFJHfH8N2QQAoUXrTp66hVFA==');
    audio.volume = 0.3;
    audio.play().catch(() => {});
  } catch (error) {
    // Ignorar errores de audio
  }
}

/**
 * Ver detalle de un pedido
 */
function verDetallePedido(pedidoId) {
  const pedido = pedidosActuales.find(p => p.id === pedidoId);
  if (!pedido) {
    alert('Pedido no encontrado');
    return;
  }

  const modal = document.getElementById('modal-detalle');
  const content = document.getElementById('modal-detalle-content');

  let html = `
    <div style="padding: 20px;">
      <h3 style="margin-top: 0; color: var(--color-primary);">
        📋 Detalle del Pedido #${String(pedido.id).slice(-6)}
      </h3>

      <div style="margin: 20px 0;">
        <h4>👤 Información del Cliente</h4>
        <p><strong>Nombre:</strong> ${pedido.cliente?.nombre || 'N/A'}</p>
        <p><strong>Teléfono:</strong> ${pedido.cliente?.telefono || 'N/A'}</p>
        <p><strong>Dirección:</strong> ${pedido.cliente?.direccion || 'N/A'}</p>
        ${pedido.cliente?.email ? `<p><strong>Email:</strong> ${pedido.cliente.email}</p>` : ''}
      </div>

      <div style="margin: 20px 0;">
        <h4>📦 Estado del Pedido</h4>
        <p><span class="estado-badge estado-${pedido.estado}">${formatearEstado(pedido.estado)}</span></p>
        <p><strong>Fecha:</strong> ${new Date(pedido.createdAt).toLocaleString('es-CO')}</p>
      </div>

      <div style="margin: 20px 0;">
        <h4>🛍️ Productos (${pedido.productos?.length || 0})</h4>
  `;

  pedido.productos?.forEach(producto => {
    html += `
      <div style="padding: 10px; margin: 10px 0; background: #f9f9f9; border-radius: 8px;">
        <strong>${producto.emoji || '🛍️'} ${producto.nombre}</strong><br>
        ${producto.descripcion ? `<small style="color: var(--color-text-secondary);">${producto.descripcion}</small><br>` : ''}
        <span style="color: var(--color-primary-dark); font-weight: 600;">$${formatearPrecio(producto.precio)}</span>
        ${producto.cantidad ? ` x ${producto.cantidad}` : ''}
      </div>
    `;
  });

  html += `
      </div>

      ${pedido.observaciones ? `
        <div style="margin: 20px 0;">
          <h4>💬 Observaciones</h4>
          <p>${pedido.observaciones}</p>
        </div>
      ` : ''}

      <div style="margin: 20px 0; padding-top: 20px; border-top: 2px solid var(--color-primary);">
        <h3 style="text-align: right; color: var(--color-primary);">
          💰 Total: $${formatearPrecio(pedido.total || 0)}
        </h3>
      </div>
    </div>
  `;

  content.innerHTML = html;
  modal.style.display = 'flex';
}

function cerrarModalDetalle() {
  document.getElementById('modal-detalle').style.display = 'none';
}

/**
 * Cambiar estado de un pedido
 */
async function cambiarEstadoPedido(pedidoId) {
  const nuevoEstado = prompt('Ingresa el nuevo estado:\n- pendiente\n- confirmado\n- en_preparacion\n- en_camino\n- entregado\n- cancelado');
  
  if (!nuevoEstado) return;

  const estadosValidos = ['pendiente', 'confirmado', 'en_preparacion', 'en_camino', 'entregado', 'cancelado'];
  
  if (!estadosValidos.includes(nuevoEstado.toLowerCase())) {
    alert('❌ Estado inválido');
    return;
  }

  try {
    if (typeof loadingState !== 'undefined') {
      loadingState.start('cambiar-estado', { message: 'Actualizando estado...' });
    }

    if (typeof adminService !== 'undefined') {
      await adminService.actualizarEstadoPedido(pedidoId, nuevoEstado.toLowerCase());
      
      if (typeof ErrorHandler !== 'undefined') {
        ErrorHandler.showUserMessage('Estado actualizado correctamente', 'success');
      } else {
        alert('✅ Estado actualizado correctamente');
      }
    } else {
      throw new Error('AdminService no disponible');
    }
  } catch (error) {
    console.error('❌ Error actualizando estado:', error);
    
    if (typeof errorHandler !== 'undefined') {
      errorHandler.show(error);
    } else {
      alert(`❌ Error: ${error.message}`);
    }
  } finally {
    if (typeof loadingState !== 'undefined') {
      loadingState.stop('cambiar-estado');
    }
  }
}

/**
 * Exportar pedidos a CSV
 */
function exportarCSV() {
  try {
    if (typeof adminService === 'undefined') {
      throw new Error('AdminService no disponible');
    }

    const pedidosAExportar = pedidosFiltrados.length > 0 ? pedidosFiltrados : pedidosActuales;
    adminService.exportarCSV(pedidosAExportar, 'pedidos_loquieroya');

    if (typeof ErrorHandler !== 'undefined') {
      ErrorHandler.showUserMessage('CSV exportado correctamente', 'success');
    }
  } catch (error) {
    console.error('❌ Error exportando CSV:', error);
    if (typeof errorHandler !== 'undefined') {
      errorHandler.show(error);
    }
  }
}

/**
 * Exportar pedidos a Excel
 */
function exportarExcel() {
  try {
    if (typeof adminService === 'undefined') {
      throw new Error('AdminService no disponible');
    }

    const pedidosAExportar = pedidosFiltrados.length > 0 ? pedidosFiltrados : pedidosActuales;
    adminService.exportarExcel(pedidosAExportar, 'pedidos_loquieroya');

    if (typeof ErrorHandler !== 'undefined') {
      ErrorHandler.showUserMessage('Excel exportado correctamente', 'success');
    }
  } catch (error) {
    console.error('❌ Error exportando Excel:', error);
    if (typeof errorHandler !== 'undefined') {
      errorHandler.show(error);
    }
  }
}

// ============ EVENT LISTENERS ============

function inicializarEventListeners() {
  // Login
  if (loginForm) {
    loginForm.addEventListener('submit', (e) => {
      e.preventDefault();
      loginAdmin();
    });
  }

  // Filtros
  document.getElementById('filtro-estado')?.addEventListener('change', aplicarFiltros);
  document.getElementById('filtro-fecha-desde')?.addEventListener('change', aplicarFiltros);
  document.getElementById('filtro-fecha-hasta')?.addEventListener('change', aplicarFiltros);
  document.getElementById('filtro-ordenar')?.addEventListener('change', aplicarFiltros);
  
  // Búsqueda con debounce
  let busquedaTimeout;
  document.getElementById('busqueda')?.addEventListener('input', () => {
    clearTimeout(busquedaTimeout);
    busquedaTimeout = setTimeout(aplicarFiltros, 300);
  });

  // Limpiar filtros
  document.getElementById('btn-limpiar-filtros')?.addEventListener('click', () => {
    document.getElementById('filtro-estado').value = 'todos';
    document.getElementById('filtro-fecha-desde').value = '';
    document.getElementById('filtro-fecha-hasta').value = '';
    document.getElementById('busqueda').value = '';
    document.getElementById('filtro-ordenar').value = 'fecha_desc';
    aplicarFiltros();
  });

  // Exportar
  document.getElementById('btn-exportar-csv')?.addEventListener('click', exportarCSV);
  document.getElementById('btn-exportar-excel')?.addEventListener('click', exportarExcel);

  // Cerrar sesión
  document.getElementById('btn-logout')?.addEventListener('click', cerrarSesionSegura);

  console.log('✅ Event listeners inicializados');
}

// ============ FUNCIONES GLOBALES ============

window.verDetallePedido = verDetallePedido;
window.cerrarModalDetalle = cerrarModalDetalle;
window.cambiarEstadoPedido = cambiarEstadoPedido;
window.loginAdmin = loginAdmin;
window.cerrarSesionSegura = cerrarSesionSegura;
window.exportarCSV = exportarCSV;
window.exportarExcel = exportarExcel;

console.log('✅ Admin system loaded');

