# 🎨 Hero Section & Carrusel Asimétrico - Lo Quiero YA CM

## 🎉 ¡HERO ESPECTACULAR Y CARRUSEL IMPLEMENTADOS!

**URL:** https://loquieroya-cm.web.app

---

## 📋 Resumen de Implementación

Se han creado **dos secciones impactantes**:

1. ✅ **Hero Section Moderno** - Genera antojo inmediato
2. ✅ **Carrusel Asimétrico** - Productos destacados con efecto de profundidad

---

## 🎨 Hero Section Espectacular

### **Características:**

#### **Diseño Visual:**

- ✅ **Gradient Background** - Rosa #FF6B9D a Amarillo #FFD166
- ✅ **Patrón decorativo animado** - Círculos flotantes
- ✅ **Emojis flotantes** - 🍩🧁🍰 con animación
- ✅ **Layout Grid 2 columnas** - Texto + Imagen
- ✅ **Bordes redondeados** - Border-radius 30px

#### **Contenido:**

```html
✅ Pretitle: "Bienvenido a"
✅ Título: "🍰 Lo Quiero YA CM" (4.5rem)
✅ Slogan: "#AntójateDeFelicidad" (destacado con fondo blanco)
✅ Descripción: Texto persuasivo
✅ CTA Button: "Ver Catálogo" → scroll a #catalogo
✅ Imagen: Placeholder 12rem emoji o imagen real
✅ Badge: "¡Nuevos Productos!" flotante
```

#### **Animaciones:**

- **fadeInLeft** - Texto (staggered 0.2s)
- **fadeInRight** - Imagen
- **bounce-rotate** - Emoji del título
- **shimmer** - Brillo en slogan
- **float-pattern** - Patrón de fondo
- **float-element** - Decoraciones flotantes
- **float-badge** - Badge flotante

#### **Efectos Hover:**

```css
.hero-cta:hover {
  transform: translateY(-8px) scale(1.05);
  box-shadow: 0 20px 60px rgba(0,0,0,0.3);
}

.hero-image:hover .hero-image-main {
  transform: rotate(0deg) scale(1.05);
}
```

---

## 🎠 Carrusel Asimétrico de Productos

### **Estructura Visual:**

```
┌─────────────────────────────────────────────┐
│  [Lateral]  [CENTRAL GRANDE]  [Lateral]     │
│    20%           60%             20%         │
│   Small        Large           Small        │
│  Opaco       Destacado         Opaco        │
└─────────────────────────────────────────────┘
```

### **Características:**

#### **Producto Central (80% del espacio):**

- ✅ Imagen grande (400px altura)
- ✅ Nombre destacado (2rem)
- ✅ Descripción completa
- ✅ Rating con estrellas (⭐️⭐️⭐️⭐️⭐️)
- ✅ Precio grande con gradiente
- ✅ Precio anterior tachado (si aplica)
- ✅ Badge de promoción
- ✅ Botón "Agregar al Carrito" prominente
- ✅ Sombra destacada
- ✅ Opacity: 1, Scale: 1, Filter: blur(0)

#### **Productos Laterales (20% cada uno):**

- ✅ Imagen pequeña (200px altura)
- ✅ Nombre más pequeño (1.2rem)
- ✅ Sin descripción
- ✅ Sin rating
- ✅ Precio reducido
- ✅ Sin botón
- ✅ Cursor pointer
- ✅ Opacity: 0.7, Scale: 0.75, Filter: blur(2px)
- ✅ Click para activar

---

## 🎯 Funcionalidades del Carrusel

### **1. Auto-Rotate (5 segundos)**

```javascript
autoRotateDelay: 5000 // 5 segundos

// Se activa automáticamente
startAutoRotate()

// Pausa en hover
wrapper.addEventListener('mouseenter', () => pause())
wrapper.addEventListener('mouseleave', () => resume())
```

### **2. Navegación por Flechas**

```html
<button class="carousel-nav-btn prev">←</button>
<button class="carousel-nav-btn next">→</button>
```

**Características:**

- Botones circulares blancos
- Hover: Fondo rosa + escala 1.15
- Posición absoluta fixed
- Keyboard navigation (Arrow Left/Right)

### **3. Navegación por Dots**

```html
<div class="carousel-indicators">
  <button class="carousel-dot active"></button>
  <button class="carousel-dot"></button>
  ...
</div>
```

**Características:**

- Dots circulares 12px
- Dot activo: 40px width + color rosa
- Animación al cambiar
- Click para ir a producto

### **4. Click en Productos Laterales**

```javascript
document.querySelectorAll('.carousel-item.side').forEach(item => {
  item.addEventListener('click', () => {
    goToSlide(index);
  });
});
```

### **5. Transiciones Suaves**

```css
transition: transform 0.6s cubic-bezier(0.68, -0.55, 0.265, 1.55);
```

**Efectos:**

- Transform para movimiento
- Opacity para fade
- Scale para tamaño
- Filter blur para profundidad

---

## 🎨 Contenido por Producto

### **Producto Central Muestra:**

```
┌─────────────────────────────────┐
│  [BADGE: ⭐ Popular]            │
│  ┌─────────────────────────┐   │
│  │                         │   │
│  │    Imagen Grande        │   │
│  │       (400px)           │   │
│  │                         │   │
│  └─────────────────────────┘   │
│                                 │
│  Mini Donas Personalizadas      │
│  Deliciosas mini donas...       │
│                                 │
│  ⭐️⭐️⭐️⭐️⭐️ (127 reseñas)        │
│                                 │
│  $2,500                         │
│  Desde                          │
│                                 │
│  [🎨 Personalizar]              │
└─────────────────────────────────┘
```

### **Producto Lateral Muestra:**

```
┌──────────────┐
│  [Badge]     │
│  ┌────────┐  │
│  │ Imagen │  │
│  │ (200px)│  │
│  └────────┘  │
│              │
│  Ancheta     │
│  $35,000     │
└──────────────┘
```

---

## 📱 Responsive Design

### **Desktop (>992px):**

```
Hero: Grid 2 columnas (texto + imagen)
Carrusel: 1 central + 2 laterales
Flechas: Visibles a los lados
```

### **Tablet (768px-992px):**

```
Hero: Grid 2 columnas ajustadas
Carrusel: 1 central + 2 laterales pequeños
Texto reducido
```

### **Mobile (<768px):**

```
Hero: 1 columna (stack vertical)
Título: 2.5rem
Slogan: 1.5rem
Carrusel: Solo producto central
Laterales: display: none
Flechas: Más pequeñas (45px)
```

---

## ♿ Accesibilidad ARIA

### **Hero Section:**

```html
<section role="banner" aria-label="Sección principal">
  <a class="hero-cta" aria-label="Ver catálogo de productos">
  <span aria-hidden="true">🍩</span> <!-- Decoración -->
</section>
```

### **Carrusel:**

```html
<div 
  role="region" 
  aria-label="Carrusel de productos destacados"
  aria-live="polite"
>
  <div role="tabpanel" aria-label="Mini Donas">
  
  <div role="tablist" aria-label="Indicadores">
    <button 
      role="tab" 
      aria-label="Ir a producto 1"
      aria-selected="true"
    >
  </div>
  
  <button aria-label="Producto anterior">←</button>
  <button aria-label="Producto siguiente">→</button>
</div>
```

### **Keyboard Navigation:**

- ⬅️ **Arrow Left** → Producto anterior
- ➡️ **Arrow Right** → Producto siguiente
- ⭐ **Tab** → Navegar por controles
- ↩️ **Enter/Space** → Activar botón

---

## 🎯 API del Carrusel

### **Inicialización:**

```javascript
const productos = [
  {
    id: 100,
    nombre: 'Mini Donas',
    descripcion: 'Deliciosas...',
    precio: 2500,
    emoji: '🍩',
    badge: 'popular',
    rating: 5,
    reviews: 127,
    destacado: true
  }
];

const carousel = new ProductCarousel(productos, 'carousel-productos');
```

### **Métodos:**

```javascript
// Navegar
carousel.next()          // Siguiente
carousel.prev()          // Anterior
carousel.goToSlide(2)    // Ir a índice específico

// Control
carousel.pause()         // Pausar auto-rotate
carousel.resume()        // Reanudar auto-rotate
carousel.startAutoRotate() // Iniciar auto-rotate
carousel.stopAutoRotate()  // Detener auto-rotate

// Limpiar
carousel.destroy()       // Destruir carrusel
```

### **Propiedades:**

```javascript
carousel.currentIndex      // Índice actual
carousel.productos         // Array de productos
carousel.autoRotateDelay   // Delay en ms (default: 5000)
carousel.isPaused          // Estado de pausa
```

---

## 🎨 Personalización

### **Cambiar Delay de Auto-Rotate:**

```javascript
carousel.autoRotateDelay = 3000; // 3 segundos
carousel.resetAutoRotate();
```

### **Cambiar Colores:**

En `hero-carousel.css`:

```css
:root {
  --carousel-primary: #FF6B9D;
  --carousel-secondary: #FFD166;
}

.carousel-nav-btn:hover {
  background: var(--carousel-primary);
}
```

### **Agregar Productos al Carrusel:**

```javascript
const producto = {
  id: 300,
  nombre: 'Cupcakes Especiales',
  descripcion: 'Cupcakes decorados a mano',
  precio: 8000,
  emoji: '🧁',
  badge: 'nuevo',
  rating: 5,
  reviews: 45,
  destacado: true,  // ← IMPORTANTE para aparecer en carrusel
  imagen: '/assets/cupcakes.jpg' // Opcional
};

productos.push(producto);
```

---

## ✨ Efectos Especiales

### **Hero:**

1. **Patrón flotante** - Gradientes radiales animados
2. **Shimmer** - Brillo deslizante en slogan
3. **Bounce-rotate** - Emoji del título
4. **Float** - Badge y decoraciones
5. **Scale en hover** - CTA button
6. **Rotate** - Imagen principal

### **Carrusel:**

1. **Scale transition** - 0.75 → 1 → 0.75
2. **Opacity fade** - 0.5 → 1 → 0.5
3. **Blur depth** - blur(2px) → blur(0)
4. **Pulse badge** - Escala 1 → 1.08
5. **Zoom imagen** - Scale 1.1 en hover
6. **Smooth slide** - cubic-bezier easing

---

## 📊 Performance

### **Optimizaciones:**

1. ✅ **CSS Transforms** - Hardware accelerated
2. ✅ **RequestAnimationFrame** - Para centrado
3. ✅ **Debounced Resize** - 100ms delay
4. ✅ **Lazy Init** - Espera 500ms para productos
5. ✅ **Cleanup** - destroy() libera recursos
6. ✅ **Auto-pause** - En hover para UX

---

## 🔧 Troubleshooting

### **El carrusel no aparece:**

```javascript
// Verificar en consola
console.log(typeof productos); // Debe ser 'object'
console.log(window.productCarousel); // Debe existir
```

**Solución:**

- Asegúrate de que `productos` esté definido antes de `carousel.js`
- Verifica el orden de carga de scripts

### **Auto-rotate no funciona:**

```javascript
// Verificar estado
console.log(carousel.autoRotateInterval); // Debe tener un ID
console.log(carousel.isPaused); // Debe ser false
```

**Solución:**

- Llama a `carousel.startAutoRotate()`
- Verifica que no esté en hover

### **Productos laterales no son clickeables:**

**Solución:**

- Verifica que tengan la clase `.side`
- Asegúrate de que el event listener esté attached

---

## 📱 Casos de Uso

### **Desktop Experience:**

1. Usuario llega al sitio
2. Ve hero impactante con gradient animado
3. Lee slogan "#AntójateDeFelicidad"
4. Click en "Ver Catálogo" → scroll suave
5. Ve carrusel con 3 productos (1 grande + 2 laterales)
6. Carrusel rota cada 5 segundos
7. Puede navegar con flechas o dots
8. Hover pausa el auto-rotate
9. Click en lateral cambia a ese producto

### **Mobile Experience:**

1. Hero ocupa pantalla completa
2. Layout stack vertical
3. Texto centrado
4. CTA prominente
5. Carrusel muestra solo producto central
6. Navegación por flechas o swipe (futuro)
7. Dots indican posición

---

## 🎯 Métricas de Éxito

### **Hero Section:**

- ⚡ **LCP** < 2.5s (Largest Contentful Paint)
- 🎯 **CTR** del botón "Ver Catálogo" > 60%
- 👁️ **Tiempo en sección** > 5 segundos

### **Carrusel:**

- 🔄 **Interacciones** (clicks, navegación) > 30%
- 📊 **Productos vistos** promedio > 3
- 🛒 **Conversión** desde carrusel > 15%

---

## 📁 Archivos Creados

```
✅ public/css/hero-carousel.css     # 700+ líneas CSS
✅ public/js/carousel.js            # 400+ líneas JS
✅ public/index.html                # Hero + Carrusel
✅ public/js/app.js                 # Productos actualizados
✅ HERO_CAROUSEL_README.md          # Documentación
```

**Total desplegado:** 27 archivos

---

## ✅ Checklist de Implementación

- [X] Hero con gradient rosa-amarillo
- [X] Slogan #AntójateDeFelicidad destacado
- [X] CTA "Ver Catálogo" prominente
- [X] Imagen atractiva (placeholder)
- [X] Responsive completo
- [X] Carrusel asimétrico (1 grande + 2 pequeños)
- [X] Auto-rotate cada 5 segundos
- [X] Pausa en hover
- [X] Navegación por flechas
- [X] Navegación por dots
- [X] Click en laterales
- [X] Transiciones suaves
- [X] Estado activo claro
- [X] Rating con estrellas
- [X] Badges de promoción
- [X] Botón solo en central
- [X] Mobile: solo central
- [X] ARIA labels completos
- [X] Keyboard navigation

---

## 🚀 Próximas Mejoras (Opcional)

1. **Touch Swipe** - Gestos táctiles
2. **Infinite Loop** - Carrusel infinito
3. **Parallax Effect** - En hero image
4. **Video Background** - En hero
5. **Product Quick View** - Modal rápido
6. **Lazy Loading** - Imágenes diferidas
7. **Intersection Observer** - Animaciones en scroll

---

## 🎉 Resultado Final

```
✅ Hero impactante que genera antojo
✅ Gradient animado rosa-amarillo
✅ Slogan destacado profesionalmente
✅ CTA con scroll suave
✅ Carrusel asimétrico funcional
✅ Auto-rotate inteligente
✅ Navegación múltiple
✅ Efectos de profundidad
✅ 100% Responsive
✅ Totalmente accesible
```

---

**URL para probar:** https://loquieroya-cm.web.app

**Refresca con Ctrl+Shift+R y disfruta el nuevo hero + carrusel** 🎨✨

---

**Creado:** 2025-10-17
**Versión:** 1.0
**Proyecto:** Lo Quiero YA CM - #AntójateDeFelicidad
