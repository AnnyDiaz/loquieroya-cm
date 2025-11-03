/* ============================================
   🎨 Icon Mapper - Lo Quiero YA CM
   Mapea categorías a iconos profesionales Font Awesome
   ============================================ */

/**
 * Iconos profesionales para categorías
 */
const CATEGORY_ICONS = {
  'mini-donas': '<i class="fas fa-ring"></i>',
  'anchetas': '<i class="fas fa-gift"></i>',
  'ancheta': '<i class="fas fa-gift"></i>',
  'postres': '<i class="fas fa-cake-candles"></i>',
  'dulces': '<i class="fas fa-candy-cane"></i>',
  'chocolates': '<i class="fas fa-cookie-bite"></i>',
  'otros': '<i class="fas fa-box-open"></i>',
  'todos': '<i class="fas fa-th-large"></i>'
};

/**
 * Iconos para badges
 */
const BADGE_ICONS = {
  'popular': '<i class="fas fa-star"></i>',
  'nuevo': '<i class="fas fa-sparkles"></i>',
  'oferta': '<i class="fas fa-fire"></i>'
};

/**
 * Iconos para acciones
 */
const ACTION_ICONS = {
  'carrito': '<i class="fas fa-shopping-cart"></i>',
  'agregar': '<i class="fas fa-cart-plus"></i>',
  'personalizar': '<i class="fas fa-palette"></i>',
  'ver': '<i class="fas fa-eye"></i>',
  'editar': '<i class="fas fa-edit"></i>',
  'eliminar': '<i class="fas fa-trash-alt"></i>',
  'whatsapp': '<i class="fab fa-whatsapp"></i>',
  'instagram': '<i class="fab fa-instagram"></i>',
  'facebook': '<i class="fab fa-facebook"></i>',
  'entrega': '<i class="fas fa-truck-fast"></i>',
  'artesanal': '<i class="fas fa-hand-sparkles"></i>',
  'calidad': '<i class="fas fa-award"></i>'
};

/**
 * Obtiene el icono HTML para una categoría
 */
function getCategoryIcon(categoria) {
  return CATEGORY_ICONS[categoria] || CATEGORY_ICONS['otros'];
}

/**
 * Obtiene el icono HTML para un badge
 */
function getBadgeIcon(badge) {
  return BADGE_ICONS[badge] || '';
}

/**
 * Obtiene el icono HTML para una acción
 */
function getActionIcon(action) {
  return ACTION_ICONS[action] || '';
}

/**
 * Reemplaza emoji con icono en un elemento
 */
function replaceEmojiWithIcon(emoji, categoria) {
  const icon = getCategoryIcon(categoria);
  return icon || emoji; // Fallback al emoji si no hay icono
}

// Exportar para uso global
if (typeof window !== 'undefined') {
  window.getCategoryIcon = getCategoryIcon;
  window.getBadgeIcon = getBadgeIcon;
  window.getActionIcon = getActionIcon;
  window.replaceEmojiWithIcon = replaceEmojiWithIcon;
}

