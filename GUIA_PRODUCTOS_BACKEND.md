# 🍰 Guía de Gestión de Productos con Backend FastAPI

## 📋 Descripción

Sistema completo de gestión de productos con múltiples imágenes que integra:
- Backend FastAPI con base de datos SQLite/PostgreSQL
- Panel de administración web con subida de múltiples imágenes
- Vista previa de imágenes antes de subir
- Catálogo público que muestra productos desde la API

---

## 🚀 Inicio Rápido

### 1. Iniciar el Backend (FastAPI)

#### Instalación (primera vez)

```bash
# Ir a la carpeta backend
cd backend

# Crear entorno virtual
python -m venv venv

# Activar entorno virtual (Windows)
venv\Scripts\activate

# Instalar dependencias
pip install -r requirements.txt
```

#### Ejecutar el servidor

```bash
# Asegúrate de estar en la carpeta backend con el entorno activado
cd backend
venv\Scripts\activate

# Iniciar servidor
python main.py
```

El servidor estará disponible en: **http://localhost:8000**

- **Documentación API**: http://localhost:8000/docs
- **Documentación alternativa**: http://localhost:8000/redoc

### 2. Iniciar el Frontend

Puedes usar cualquiera de estos métodos:

#### Opción A: Live Server (VS Code)
1. Abre el proyecto en VS Code
2. Instala la extensión "Live Server"
3. Click derecho en `public/index.html` → "Open with Live Server"

#### Opción B: Python HTTP Server
```bash
cd public
python -m http.server 5500
```

Luego abre: http://localhost:5500

#### Opción C: Firebase Hosting (si está configurado)
```bash
firebase serve
```

---

## 🔐 Credenciales de Administrador

Para acceder al panel de administración:

- **Email**: `admin@loquieroyacm.com`
- **Contraseña**: `admin123`

⚠️ **IMPORTANTE**: Cambia estas credenciales en producción editando el archivo `backend/auth.py`

---

## 📦 Gestión de Productos

### Crear un Producto

1. Accede al panel de administración: `http://localhost:5500/admin.html`
2. Inicia sesión con las credenciales
3. Ve a la sección "🍰 Productos"
4. Haz clic en "➕ Nuevo Producto"
5. Completa el formulario:
   - **Nombre**: Nombre del producto
   - **Descripción**: Descripción detallada
   - **Precio**: Precio en pesos colombianos
   - **Categoría**: Selecciona una categoría
   - **Estado**: Disponible o No disponible
6. **Agregar Imágenes**:
   - Haz clic en el área de subida
   - Selecciona una o varias imágenes (máx 5MB cada una)
   - Verás una vista previa de las imágenes seleccionadas
   - Puedes eliminar imágenes antes de guardar
7. Haz clic en "💾 Guardar Producto"

### Editar un Producto

1. En la tabla de productos, haz clic en el botón ✏️ del producto
2. Modifica los campos que necesites
3. **Imágenes existentes**:
   - Verás las imágenes actuales del producto
   - Puedes marcar imágenes para eliminar (haz clic en ✕)
   - Puedes agregar nuevas imágenes
4. Guarda los cambios

### Eliminar un Producto

1. Haz clic en el botón 🗑️ del producto
2. Confirma la eliminación
3. Se eliminarán el producto y **todas sus imágenes**

---

## 🖼️ Gestión de Imágenes

### Formatos Soportados
- JPG / JPEG
- PNG
- WEBP

### Límites
- Tamaño máximo por imagen: **5MB**
- Las imágenes se optimizan automáticamente
- Se pueden subir múltiples imágenes por producto

### Almacenamiento
Las imágenes se guardan en:
```
backend/media/productos/{producto_id}/
```

Cada imagen tiene un nombre único (UUID) para evitar colisiones.

### URLs de Imágenes
Las imágenes son accesibles vía:
```
http://localhost:8000/media/productos/{producto_id}/{nombre_imagen}
```

---

## 🌐 Catálogo Público

Los productos creados en el panel admin aparecerán automáticamente en el catálogo público:

**URL**: `http://localhost:5500/index.html#catalogo`

### Cómo Funciona

1. Al cargar la página, se consulta la API de FastAPI
2. Los productos se filtran por disponibilidad (`disponible = 1`)
3. Se combinan con los productos hardcodeados (mini donas personalizables)
4. Se muestran en el catálogo con sus imágenes

### Integración con Carrito

Los productos de la API se integran completamente con el sistema de carrito:
- Se pueden agregar al carrito
- Se calculan precios
- Se pueden realizar pedidos

---

## 🔧 API Endpoints

### Públicos (sin autenticación)

#### Listar Productos
```http
GET /productos/
```

Query params:
- `categoria`: Filtrar por categoría
- `disponible`: 0 o 1
- `skip`: Para paginación
- `limit`: Límite de resultados

**Ejemplo**:
```bash
curl http://localhost:8000/productos/?categoria=anchetas&disponible=1
```

#### Obtener Producto por ID
```http
GET /productos/{id}
```

**Ejemplo**:
```bash
curl http://localhost:8000/productos/1
```

### Protegidos (requieren autenticación)

#### Iniciar Sesión
```http
POST /auth/login
Content-Type: application/json

{
  "email": "admin@loquieroyacm.com",
  "password": "admin123"
}
```

**Respuesta**:
```json
{
  "access_token": "eyJ0eXAiOiJKV1...",
  "token_type": "bearer",
  "user": {
    "email": "admin@loquieroyacm.com",
    "role": "admin"
  }
}
```

#### Crear Producto
```http
POST /productos/
Authorization: Bearer {token}
Content-Type: multipart/form-data

nombre=Ancheta Especial
descripcion=Ancheta con dulces colombianos
precio=45000
categoria=anchetas
disponible=1
```

#### Subir Imágenes
```http
POST /productos/{id}/imagenes
Authorization: Bearer {token}
Content-Type: multipart/form-data

imagenes=@imagen1.jpg
imagenes=@imagen2.jpg
imagenes=@imagen3.jpg
```

#### Actualizar Producto
```http
PUT /productos/{id}
Authorization: Bearer {token}
Content-Type: multipart/form-data

nombre=Nuevo Nombre
precio=50000
```

#### Eliminar Producto
```http
DELETE /productos/{id}
Authorization: Bearer {token}
```

#### Eliminar Imagen Específica
```http
DELETE /productos/{producto_id}/imagenes/{imagen_id}
Authorization: Bearer {token}
```

---

## 📊 Base de Datos

### Esquema de Tablas

#### Tabla `productos`
```sql
CREATE TABLE productos (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    nombre VARCHAR(200) NOT NULL,
    descripcion TEXT,
    precio FLOAT NOT NULL,
    categoria VARCHAR(100) NOT NULL,
    creado_por VARCHAR(200),
    fecha_creacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    fecha_actualizacion TIMESTAMP,
    disponible INTEGER DEFAULT 1
);
```

#### Tabla `imagenes_productos`
```sql
CREATE TABLE imagenes_productos (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    producto_id INTEGER NOT NULL,
    url_imagen VARCHAR(500) NOT NULL,
    orden INTEGER DEFAULT 0,
    fecha_subida TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (producto_id) REFERENCES productos(id) ON DELETE CASCADE
);
```

### Relación
- Un producto puede tener **muchas** imágenes (relación 1:N)
- Al eliminar un producto, se eliminan automáticamente sus imágenes (CASCADE)

---

## 🛠️ Solución de Problemas

### El backend no inicia

**Error**: `ModuleNotFoundError: No module named 'fastapi'`

**Solución**:
```bash
cd backend
venv\Scripts\activate
pip install -r requirements.txt
```

### Las imágenes no se muestran

1. Verifica que el backend esté corriendo
2. Revisa la consola del navegador (F12)
3. Verifica que la URL del backend sea correcta en `api.service.js`:
   ```javascript
   this.baseURL = 'http://localhost:8000';
   ```

### Error de CORS

Si ves errores de CORS en la consola:

1. Verifica que tu origen esté en `backend/.env`:
   ```
   ALLOWED_ORIGINS=http://localhost:5500
   ```

2. Reinicia el servidor backend

### Token expirado

Los tokens expiran en 8 horas (480 minutos). Si ves "Sesión expirada":

1. Cierra sesión
2. Vuelve a iniciar sesión

---

## 🚀 Despliegue en Producción

### Backend

1. **Cambiar a PostgreSQL**:
   ```bash
   pip install psycopg2-binary
   ```
   
   Edita `backend/.env`:
   ```
   DATABASE_URL=postgresql://usuario:password@localhost/loquieroya
   ```

2. **Cambiar SECRET_KEY**:
   ```python
   import secrets
   print(secrets.token_urlsafe(32))
   ```
   
   Copia el resultado a `.env`

3. **Ejecutar con Gunicorn**:
   ```bash
   pip install gunicorn
   gunicorn main:app -w 4 -k uvicorn.workers.UvicornWorker --bind 0.0.0.0:8000
   ```

### Frontend

1. **Actualizar URL de API**:
   Edita `public/js/api.service.js`:
   ```javascript
   this.baseURL = 'https://tu-dominio.com/api';
   ```

2. **Desplegar con Firebase**:
   ```bash
   firebase deploy --only hosting
   ```

---

## 📝 Notas Adicionales

### Características Implementadas

✅ Backend FastAPI completo con CRUD  
✅ Base de datos con relaciones  
✅ Autenticación JWT  
✅ Subida de múltiples imágenes  
✅ Optimización automática de imágenes  
✅ Vista previa de imágenes  
✅ Panel de administración  
✅ Integración con catálogo público  
✅ Protección por roles  
✅ Manejo de errores  
✅ Validación de datos  

### Próximas Mejoras (Opcionales)

- [ ] Integración con Firebase Storage en lugar de almacenamiento local
- [ ] Sistema de categorías dinámico
- [ ] Ordenamiento de imágenes con drag & drop
- [ ] Compresión adicional de imágenes
- [ ] Caché de productos en el frontend
- [ ] Búsqueda y filtros avanzados
- [ ] Estadísticas de productos más vendidos

---

## 📞 Soporte

Si tienes problemas o preguntas, revisa:

1. La documentación de la API: http://localhost:8000/docs
2. Los logs del servidor backend
3. La consola del navegador (F12 → Console)

---

**¡Listo!** 🎉 Ya tienes un sistema completo de gestión de productos con múltiples imágenes funcionando.

