# 📖 Instrucciones de Uso - Sistema de Productos

## 🚀 Inicio Rápido para Windows

### Método 1: Script Automático (Recomendado)

1. Haz doble clic en `iniciar-sistema.bat`
2. Espera a que se abran dos ventanas de comandos
3. ¡Listo! El sistema está funcionando

### Método 2: Manual

#### Terminal 1 - Backend:
```cmd
cd backend
venv\Scripts\activate
python main.py
```

#### Terminal 2 - Frontend:
```cmd
cd public
python -m http.server 5500
```

---

## 📍 URLs del Sistema

| Servicio | URL |
|----------|-----|
| **Frontend** | http://localhost:5500 |
| **Panel Admin** | http://localhost:5500/admin.html |
| **Backend API** | http://localhost:8000 |
| **Docs API** | http://localhost:8000/docs |

---

## 👤 Credenciales

**Panel de Administración:**
- Email: `admin@loquieroyacm.com`
- Contraseña: `admin123`

---

## 📝 Uso del Panel de Administración

### 1. Iniciar Sesión
1. Ve a http://localhost:5500/admin.html
2. Ingresa las credenciales
3. Haz clic en "Iniciar Sesión"

### 2. Crear un Producto

1. Click en "🍰 Productos" en el menú lateral
2. Click en "➕ Nuevo Producto"
3. Completa el formulario:
   - **Nombre**: Ej: "Ancheta Romántica"
   - **Descripción**: Ej: "Ancheta perfecta para sorprender"
   - **Precio**: Ej: 45000
   - **Categoría**: Selecciona una opción
   - **Estado**: Disponible
4. **Agregar Imágenes**:
   - Click en el área de subida de imágenes
   - Selecciona 1 o más imágenes (JPG, PNG, WEBP)
   - Verás una vista previa
5. Click en "💾 Guardar Producto"

### 3. Ver Productos en el Catálogo

1. Ve a http://localhost:5500
2. Desplázate a la sección "Catálogo"
3. Verás tus productos con sus imágenes

### 4. Editar un Producto

1. En la tabla de productos, click en ✏️
2. Modifica los campos necesarios
3. Puedes:
   - Eliminar imágenes existentes (click en ✕)
   - Agregar nuevas imágenes
4. Guarda los cambios

### 5. Eliminar un Producto

1. Click en 🗑️ en la tabla
2. Confirma la eliminación
3. Se eliminarán el producto y sus imágenes

---

## 🎨 Características de las Imágenes

### ✅ Formatos Soportados
- JPG / JPEG
- PNG
- WEBP

### 📏 Límites
- Tamaño máximo: **5MB** por imagen
- Cantidad: Ilimitada (recomendado: 3-5 imágenes)

### 🔄 Procesamiento Automático
- Optimización de calidad
- Redimensionamiento si es muy grande (máx 1200px de ancho)
- Conversión a RGB si es necesario

### 📁 Ubicación
Las imágenes se guardan en:
```
backend/media/productos/{producto_id}/
```

---

## 🛒 Uso del Catálogo Público

### Ver Productos
1. Ve a http://localhost:5500
2. Desplázate a "🍰 Nuestro Catálogo"
3. Verás todos los productos disponibles

### Agregar al Carrito
1. Click en "🛒 Agregar al Carrito" en cualquier producto
2. El producto se agregará al carrito
3. Click en el ícono del carrito (arriba a la derecha) para ver

### Realizar Pedido
1. Revisa los productos en el carrito
2. Click en "Finalizar Pedido"
3. Completa tus datos
4. Envía el pedido

---

## 🔧 Solución de Problemas Comunes

### ❌ "No se puede conectar a la API"

**Solución:**
1. Verifica que el backend esté corriendo
2. Debería ver: `Uvicorn running on http://0.0.0.0:8000`
3. Si no está corriendo, ejecuta:
   ```cmd
   cd backend
   venv\Scripts\activate
   python main.py
   ```

### ❌ "Las imágenes no se muestran"

**Solución:**
1. Verifica que el backend esté corriendo
2. Abre http://localhost:8000/docs
3. Si no abre, reinicia el backend

### ❌ "Error al subir imágenes"

**Causas comunes:**
- Imagen muy grande (>5MB)
- Formato no soportado
- Backend no está corriendo

**Solución:**
1. Reduce el tamaño de la imagen
2. Convierte a JPG o PNG
3. Verifica que el backend esté activo

### ❌ "Sesión expirada"

**Solución:**
1. Cierra sesión
2. Vuelve a iniciar sesión
3. Los tokens duran 8 horas

---

## 📊 Estructura del Proyecto

```
loquieroya_cm/
├── backend/              # Backend FastAPI
│   ├── main.py          # Archivo principal
│   ├── models.py        # Modelos de BD
│   ├── routes/          # Rutas de la API
│   ├── media/           # Imágenes (se crea automáticamente)
│   └── loquieroya.db    # Base de datos SQLite
├── public/              # Frontend
│   ├── admin.html       # Panel de administración
│   ├── index.html       # Sitio público
│   ├── js/              # Scripts JavaScript
│   └── css/             # Estilos
└── iniciar-sistema.bat  # Script de inicio
```

---

## 📱 Funcionalidades del Sistema

### ✅ Backend (FastAPI)
- [x] API RESTful completa
- [x] Autenticación JWT
- [x] Gestión de productos (CRUD)
- [x] Subida de múltiples imágenes
- [x] Optimización automática de imágenes
- [x] Protección por roles
- [x] Validación de datos
- [x] Documentación automática (Swagger)

### ✅ Panel de Administración
- [x] Login seguro
- [x] Crear/Editar/Eliminar productos
- [x] Subir múltiples imágenes
- [x] Vista previa de imágenes
- [x] Gestión de imágenes existentes
- [x] Interfaz moderna y responsive

### ✅ Catálogo Público
- [x] Muestra productos de la API
- [x] Integración con carrito de compras
- [x] Responsive design
- [x] Carga automática de imágenes

---

## 🎯 Flujo de Trabajo Típico

1. **Iniciar el sistema** (doble click en `iniciar-sistema.bat`)
2. **Crear productos** en el panel admin
3. **Subir imágenes** para cada producto
4. **Ver productos** en el catálogo público
5. **Los clientes** pueden agregar al carrito y hacer pedidos

---

## 📞 Ayuda Adicional

### Documentación Completa
- [GUIA_PRODUCTOS_BACKEND.md](GUIA_PRODUCTOS_BACKEND.md) - Guía técnica detallada
- http://localhost:8000/docs - Documentación interactiva de la API

### Logs y Depuración
- **Backend**: Mira la terminal donde corre `python main.py`
- **Frontend**: Abre la consola del navegador (F12 → Console)

---

## 🎉 ¡Disfruta del Sistema!

Ya tienes todo configurado para gestionar productos con múltiples imágenes.

**Próximos pasos sugeridos:**
1. Crea algunos productos de prueba
2. Sube imágenes bonitas
3. Prueba el catálogo público
4. Personaliza los estilos según tu marca

---

**Desarrollado para Lo Quiero YA CM** 🍩
*#AntójateDeFelicidad*

