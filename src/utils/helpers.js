/* ============================================
   🛠️ Utilidades
   Lo Quiero YA CM - Funciones de Utilidad
   Versión: 3.0 - Estructura Profesional
   ============================================ */

import { VALIDATION_RULES, PRICING_CONFIG } from '../firebase/config.js';

// ============ VALIDACIÓN ============

/**
 * Valida un campo según las reglas definidas
 * @param {string} field - Nombre del campo
 * @param {string} value - Valor a validar
 * @returns {Object} - Resultado de la validación
 */
export function validateField(field, value) {
  const rules = VALIDATION_RULES[field];
  if (!rules) {
    return { valid: true, message: '' };
  }

  const errors = [];

  // Validar campo requerido
  if (rules.required && (!value || value.trim() === '')) {
    errors.push(`${field} es obligatorio`);
  }

  // Validar longitud mínima
  if (value && rules.minLength && value.length < rules.minLength) {
    errors.push(`${field} debe tener al menos ${rules.minLength} caracteres`);
  }

  // Validar longitud máxima
  if (value && rules.maxLength && value.length > rules.maxLength) {
    errors.push(`${field} no puede tener más de ${rules.maxLength} caracteres`);
  }

  // Validar patrón
  if (value && rules.pattern && !rules.pattern.test(value)) {
    errors.push(`${field} tiene un formato inválido`);
  }

  return {
    valid: errors.length === 0,
    message: errors.join(', ')
  };
}

/**
 * Valida todos los campos de un formulario
 * @param {Object} formData - Datos del formulario
 * @returns {Object} - Resultado de la validación
 */
export function validateForm(formData) {
  const errors = {};
  let isValid = true;

  Object.keys(formData).forEach(field => {
    const validation = validateField(field, formData[field]);
    if (!validation.valid) {
      errors[field] = validation.message;
      isValid = false;
    }
  });

  return {
    valid: isValid,
    errors
  };
}

// ============ FORMATEO ============

/**
 * Formatea un precio con separadores de miles
 * @param {number} precio - Precio a formatear
 * @returns {string} - Precio formateado
 */
export function formatearPrecio(precio) {
  return new Intl.NumberFormat('es-CO', {
    minimumFractionDigits: 0,
    maximumFractionDigits: 0
  }).format(precio);
}

/**
 * Formatea una fecha para mostrar
 * @param {string|Date} fecha - Fecha a formatear
 * @returns {string} - Fecha formateada
 */
export function formatearFecha(fecha) {
  const date = new Date(fecha);
  return new Intl.DateTimeFormat('es-CO', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  }).format(date);
}

/**
 * Formatea un número de teléfono
 * @param {string} telefono - Teléfono a formatear
 * @returns {string} - Teléfono formateado
 */
export function formatearTelefono(telefono) {
  // Remover caracteres no numéricos
  const numeros = telefono.replace(/\D/g, '');
  
  // Formatear según longitud
  if (numeros.length === 10) {
    return `${numeros.slice(0, 3)} ${numeros.slice(3, 6)} ${numeros.slice(6)}`;
  } else if (numeros.length === 11) {
    return `${numeros.slice(0, 3)} ${numeros.slice(3, 7)} ${numeros.slice(7)}`;
  }
  
  return telefono;
}

// ============ CÁLCULOS ============

/**
 * Calcula el precio de mini donas personalizadas
 * @param {Object} personalizacion - Opciones de personalización
 * @returns {number} - Precio total
 */
export function calcularPrecioMiniDonas(personalizacion) {
  const config = PRICING_CONFIG.miniDonas;
  let precio = config.basePrice;

  // Aplicar multiplicador por cantidad
  precio *= personalizacion.cantidad || 1;

  // Agregar costo de topping
  if (personalizacion.topping) {
    precio += config.toppingIncrement;
  }

  return precio;
}

/**
 * Calcula el total de un carrito
 * @param {Array} carrito - Array de productos en el carrito
 * @returns {number} - Total del carrito
 */
export function calcularTotalCarrito(carrito) {
  return carrito.reduce((total, item) => {
    return total + (item.precio * (item.cantidad || 1));
  }, 0);
}

// ============ MANEJO DE DATOS ============

/**
 * Genera un ID único
 * @returns {string} - ID único
 */
export function generarId() {
  return Date.now().toString(36) + Math.random().toString(36).substr(2);
}

/**
 * Limpia y normaliza texto
 * @param {string} texto - Texto a limpiar
 * @returns {string} - Texto limpio
 */
export function limpiarTexto(texto) {
  return texto.trim().replace(/\s+/g, ' ');
}

/**
 * Convierte texto a slug
 * @param {string} texto - Texto a convertir
 * @returns {string} - Slug
 */
export function crearSlug(texto) {
  return texto
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .trim('-');
}

// ============ MANEJO DE ERRORES ============

/**
 * Maneja errores de forma consistente
 * @param {Error} error - Error a manejar
 * @param {string} contexto - Contexto del error
 * @returns {Object} - Información del error
 */
export function manejarError(error, contexto = '') {
  const errorInfo = {
    mensaje: error.message || 'Error desconocido',
    codigo: error.code || 'UNKNOWN',
    contexto,
    timestamp: new Date().toISOString()
  };

  console.error(`❌ Error en ${contexto}:`, errorInfo);
  return errorInfo;
}

// ============ LOCAL STORAGE ============

/**
 * Guarda datos en localStorage de forma segura
 * @param {string} key - Clave
 * @param {any} data - Datos a guardar
 */
export function guardarEnStorage(key, data) {
  try {
    localStorage.setItem(key, JSON.stringify(data));
    return true;
  } catch (error) {
    console.error('❌ Error guardando en localStorage:', error);
    return false;
  }
}

/**
 * Obtiene datos de localStorage de forma segura
 * @param {string} key - Clave
 * @param {any} defaultValue - Valor por defecto
 * @returns {any} - Datos obtenidos
 */
export function obtenerDeStorage(key, defaultValue = null) {
  try {
    const data = localStorage.getItem(key);
    return data ? JSON.parse(data) : defaultValue;
  } catch (error) {
    console.error('❌ Error obteniendo de localStorage:', error);
    return defaultValue;
  }
}

// ============ DEBOUNCE ============

/**
 * Crea una función con debounce
 * @param {Function} func - Función a ejecutar
 * @param {number} delay - Retraso en ms
 * @returns {Function} - Función con debounce
 */
export function debounce(func, delay) {
  let timeoutId;
  return function (...args) {
    clearTimeout(timeoutId);
    timeoutId = setTimeout(() => func.apply(this, args), delay);
  };
}

// ============ THROTTLE ============

/**
 * Crea una función con throttle
 * @param {Function} func - Función a ejecutar
 * @param {number} limit - Límite en ms
 * @returns {Function} - Función con throttle
 */
export function throttle(func, limit) {
  let inThrottle;
  return function (...args) {
    if (!inThrottle) {
      func.apply(this, args);
      inThrottle = true;
      setTimeout(() => inThrottle = false, limit);
    }
  };
}

// ============ CONSTANTES ============

export const STORAGE_KEYS = {
  CARRITO: 'lqy_cart',
  PEDIDOS: 'lqy_orders',
  USUARIO: 'lqy_user',
  CONFIGURACION: 'lqy_config'
};

export const EVENTOS = {
  CARRITO_ACTUALIZADO: 'carritoActualizado',
  PEDIDO_CREADO: 'pedidoCreado',
  USUARIO_LOGIN: 'usuarioLogin',
  USUARIO_LOGOUT: 'usuarioLogout'
};
