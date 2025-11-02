# 🔥 Servicios Robustos de Firebase - Lo Quiero YA CM

## 📋 Resumen de Implementación

Se ha creado una arquitectura modular y robusta para Firebase con los siguientes servicios:

---

## 📁 Estructura de Archivos

```
src/
├── firebase/
│   ├── config.js                 # Configuración centralizada
│   ├── index.js                  # Servicio principal de Firebase
│   ├── productos.service.js      # CRUD de productos con cache
│   ├── pedidos.service.js        # CRUD de pedidos con validación
│   └── storage.service.js        # Gestión de imágenes
└── utils/
    ├── validators.js             # Validación de datos con schemas
    └── error-handler.js          # Manejo de errores y loading states

public/js/                        # Archivos desplegados
├── firebase-config.js
├── firebase.service.js
├── productos.service.js
├── pedidos.service.js
├── storage.service.js
├── utils/
│   ├── validators.js
│   └── error-handler.js
├── app.js                        # ✅ Actualizado
└── admin.js                      # ✅ Actualizado
```

---

## 🎯 Funcionalidades Implementadas

### 1️⃣ **ProductosService**

#### Métodos Disponibles:
- `obtenerProductos(opciones)` - Obtiene productos con filtros
- `obtenerProductoPorId(id)` - Obtiene un producto específico
- `crearProducto(productoData)` - Crea un nuevo producto
- `actualizarProducto(id, updates)` - Actualiza un producto
- `eliminarProducto(id)` - Eliminación lógica (soft delete)

#### Características:
- ✅ **Cache inteligente** con TTL de 5 minutos
- ✅ **Filtros**: Por categoría y disponibilidad
- ✅ **Fallback**: Productos de ejemplo si Firebase no está disponible
- ✅ **Optimización**: Reduce llamadas a Firestore

#### Ejemplo de Uso:
```javascript
// Obtener todos los productos
const productos = await productosService.obtenerProductos();

// Obtener solo anchetas disponibles
const anchetas = await productosService.obtenerProductos({
  categoria: 'anchetas',
  disponible: true
});

// Forzar recarga desde Firestore
const productosActualizados = await productosService.obtenerProductos({
  forceRefresh: true
});

// Crear nuevo producto
const nuevoId = await productosService.crearProducto({
  nombre: 'Ancheta Navideña',
  precio: 55000,
  categoria: 'anchetas',
  disponible: true
});
```

---

### 2️⃣ **PedidosService**

#### Métodos Disponibles:
- `crearPedido(pedidoData)` - Crea un pedido con validación
- `obtenerPedidosAdmin(filtros)` - Obtiene pedidos para el admin
- `obtenerPedidoPorId(id)` - Obtiene un pedido específico
- `actualizarEstadoPedido(id, estado)` - Actualiza el estado
- `obtenerEstadisticas()` - Calcula estadísticas de pedidos

#### Características:
- ✅ **Validación robusta** de todos los campos
- ✅ **Notificaciones automáticas** a n8n
- ✅ **Estados válidos**: pendiente, confirmado, en_preparacion, en_camino, entregado, cancelado
- ✅ **Filtros avanzados**: Por estado, fecha, límite
- ✅ **Historial**: Guarda timestamp de cada cambio de estado

#### Ejemplo de Uso:
```javascript
// Crear pedido
const pedido = {
  cliente: {
    nombre: 'Juan Pérez',
    telefono: '3001234567',
    direccion: 'Calle 123 #45-67',
    email: 'juan@email.com'
  },
  productos: [
    {
      id: 200,
      nombre: 'Ancheta Dulce',
      precio: 35000,
      cantidad: 1
    }
  ],
  total: 35000,
  observaciones: 'Entrega en la tarde'
};

const pedidoId = await pedidosService.crearPedido(pedido);

// Obtener pedidos filtrados
const pedidosPendientes = await pedidosService.obtenerPedidosAdmin({
  estado: 'pendiente',
  limite: 50
});

// Actualizar estado
await pedidosService.actualizarEstadoPedido(pedidoId, 'confirmado');

// Obtener estadísticas
const stats = await pedidosService.obtenerEstadisticas();
console.log(stats.totalVentas); // Total de ventas en COP
```

---

### 3️⃣ **StorageService**

#### Métodos Disponibles:
- `subirImagenProducto(file, opciones)` - Sube imagen de producto
- `eliminarImagen(filePath)` - Elimina una imagen
- `obtenerURLImagen(filePath)` - Obtiene URL de descarga
- `redimensionarImagen(file, maxWidth, maxHeight)` - Redimensiona imagen
- `subirMultiplesImagenes(files)` - Sube múltiples imágenes

#### Características:
- ✅ **Validación automática**: Tipo y tamaño de archivo
- ✅ **Progreso en tiempo real**: Seguimiento de subida
- ✅ **Límites configurables**: Máximo 5MB por defecto
- ✅ **Tipos permitidos**: JPEG, PNG, WebP
- ✅ **Nombres únicos**: Previene colisiones

#### Ejemplo de Uso:
```javascript
// Subir imagen desde input file
const fileInput = document.getElementById('imagen-producto');
const file = fileInput.files[0];

try {
  const resultado = await storageService.subirImagenProducto(file, {
    metadata: {
      productoId: '200',
      categoria: 'anchetas'
    }
  });
  
  console.log('URL de la imagen:', resultado.url);
  
  // Actualizar producto con la nueva imagen
  await productosService.actualizarProducto('200', {
    imagen: resultado.url
  });
  
} catch (error) {
  console.error('Error subiendo imagen:', error.message);
}

// Suscribirse al progreso
storageService.subscribe((data) => {
  if (data.uploadProgress !== undefined) {
    console.log(`Progreso: ${data.uploadProgress}%`);
  }
});
```

---

### 4️⃣ **Validators & Schemas**

#### Schemas Disponibles:
- `cliente` - Valida datos del cliente
- `producto` - Valida datos de productos
- `pedido` - Valida pedidos completos
- `productoPedido` - Valida productos dentro de un pedido

#### Ejemplo de Uso:
```javascript
// Validar datos del cliente
const clienteData = {
  nombre: 'María López',
  telefono: '3209876543',
  direccion: 'Carrera 50 #30-20',
  email: 'maria@email.com'
};

try {
  const clienteValidado = validateData(clienteData, 'cliente');
  console.log('✅ Cliente válido:', clienteValidado);
} catch (error) {
  console.error('❌ Error de validación:', error.message);
}

// Validar email
if (Validators.isValidEmail('test@example.com')) {
  console.log('✅ Email válido');
}

// Validar teléfono colombiano
if (Validators.isValidPhone('3001234567')) {
  console.log('✅ Teléfono válido');
}
```

---

### 5️⃣ **ErrorHandler & LoadingState**

#### ErrorHandler - Métodos:
- `ErrorHandler.handle(error)` - Procesa cualquier error
- `ErrorHandler.show(error, opciones)` - Muestra error al usuario
- `ErrorHandler.showUserMessage(mensaje, tipo)` - Notificación visual

#### LoadingState - Métodos:
- `loadingState.start(id, opciones)` - Inicia un loader
- `loadingState.stop(id)` - Detiene un loader
- `loadingState.isLoading()` - Verifica si hay loaders activos
- `loadingState.stopAll()` - Detiene todos los loaders

#### Ejemplo de Uso:
```javascript
// Manejo de errores
try {
  await algunaOperacion();
} catch (error) {
  errorHandler.show(error, {
    showUI: true,
    logAnalytics: true
  });
}

// Loading states
async function operacionLarga() {
  loadingState.start('operacion-1', {
    message: 'Procesando...',
    showUI: true
  });
  
  try {
    await fetch('/api/data');
    ErrorHandler.showUserMessage('Operación exitosa', 'success');
  } catch (error) {
    errorHandler.show(error);
  } finally {
    loadingState.stop('operacion-1');
  }
}
```

---

## 🚀 Despliegue

### Comandos:

```bash
# Desplegar solo hosting
firebase deploy --only hosting

# Desplegar todo (hosting + firestore rules)
firebase deploy

# Desplegar con debug
firebase deploy --debug
```

### Verificar despliegue:
1. Ve a: https://loquieroya-cm.web.app
2. Abre la consola del navegador (F12)
3. Verifica que aparezcan estos mensajes:
   ```
   ✅ Firebase inicializado correctamente
   ✅ ProductosService inicializado
   ✅ PedidosService inicializado
   ✅ StorageService inicializado
   ```

---

## 🔍 Debugging

### Comandos útiles en consola del navegador:

```javascript
// Verificar estado de Firebase
firebaseService.healthCheck()

// Ver cache de productos
productosService.cache

// Obtener estadísticas de pedidos
await pedidosService.obtenerEstadisticas()

// Ver servicios disponibles
console.log({
  firebase: typeof firebaseService !== 'undefined',
  productos: typeof productosService !== 'undefined',
  pedidos: typeof pedidosService !== 'undefined',
  storage: typeof storageService !== 'undefined'
})
```

---

## 📝 Notas Importantes

1. **Orden de carga de scripts** (crítico):
   ```html
   1. firebase-config.js
   2. validators.js
   3. error-handler.js
   4. productos.service.js
   5. pedidos.service.js
   6. storage.service.js
   7. firebase.service.js
   8. app.js o admin.js
   ```

2. **IDs de Pedidos**: Ahora se usan los IDs de documentos de Firestore, no timestamps.

3. **Estados de Pedido**: Se actualizaron los estados válidos:
   - `pendiente` → Pedido recibido
   - `confirmado` → Pedido confirmado por admin
   - `en_preparacion` → En proceso de preparación
   - `en_camino` → En camino de entrega
   - `entregado` → Pedido entregado
   - `cancelado` → Pedido cancelado

4. **Notificaciones n8n**: Se envían automáticamente al crear un pedido si el webhook está configurado.

---

## ✅ Checklist de Pruebas

- [ ] Los productos cargan correctamente en el catálogo
- [ ] Se puede agregar productos al carrito
- [ ] Se puede crear un pedido y se guarda en Firestore
- [ ] El pedido aparece en el panel de admin
- [ ] Se puede cambiar el estado de un pedido
- [ ] Las notificaciones visuales funcionan
- [ ] Los loading states se muestran correctamente
- [ ] La notificación a n8n se envía (revisar logs)

---

## 🆘 Soporte

Si encuentras errores:
1. Abre la consola del navegador (F12)
2. Revisa los mensajes de error
3. Verifica que Firebase esté inicializado
4. Confirma que los servicios estén disponibles
5. Limpia cache del navegador (Ctrl+Shift+R)

---

**Creado por:** Sistema de Servicios Firebase Robusto v1.0
**Fecha:** 2025-10-17
**Proyecto:** Lo Quiero YA CM - #AntójateDeFelicidad

