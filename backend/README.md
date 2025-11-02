# Backend FastAPI - Lo Quiero YA CM

API para gestión de productos con múltiples imágenes.

## 🚀 Instalación

### 1. Crear entorno virtual

```bash
# Windows
python -m venv venv
venv\Scripts\activate

# Linux/Mac
python3 -m venv venv
source venv/bin/activate
```

### 2. Instalar dependencias

```bash
pip install -r requirements.txt
```

### 3. Configurar variables de entorno

Copia el archivo `.env.example` a `.env` y ajusta las variables:

```bash
cp .env.example .env
```

### 4. Iniciar servidor

```bash
# Modo desarrollo (con auto-reload)
python main.py

# O con uvicorn directamente
uvicorn main:app --reload --port 8000
```

El servidor estará disponible en: http://localhost:8000

## 📚 Documentación API

- **Swagger UI**: http://localhost:8000/docs
- **ReDoc**: http://localhost:8000/redoc

## 🔐 Autenticación

### Credenciales por defecto:
- Email: `admin@loquieroyacm.com`
- Password: `admin123`

**⚠️ IMPORTANTE**: Cambia estas credenciales en producción editando el archivo `auth.py`

### Obtener token:

```bash
POST /auth/login
Content-Type: application/json

{
  "email": "admin@loquieroyacm.com",
  "password": "admin123"
}
```

### Usar token:

Incluye el token en el header Authorization:

```
Authorization: Bearer <tu_token>
```

## 📋 Endpoints

### Autenticación

- `POST /auth/login` - Iniciar sesión
- `GET /auth/me` - Obtener usuario actual (requiere autenticación)

### Productos

#### Públicos:
- `GET /productos/` - Listar productos (con filtros)
  - Query params: `categoria`, `disponible`, `skip`, `limit`
- `GET /productos/{id}` - Obtener detalles de un producto

#### Protegidos (requieren autenticación admin):
- `POST /productos/` - Crear producto
- `POST /productos/{id}/imagenes` - Subir imágenes
- `PUT /productos/{id}` - Actualizar producto
- `DELETE /productos/{id}` - Eliminar producto
- `DELETE /productos/{id}/imagenes/{imagen_id}` - Eliminar una imagen

## 💾 Base de Datos

### SQLite (por defecto)
Se crea automáticamente al iniciar el servidor.

### PostgreSQL (producción)
Modifica `DATABASE_URL` en `.env`:

```
DATABASE_URL=postgresql://usuario:password@localhost/loquieroya
```

## 📁 Estructura

```
backend/
├── main.py              # Aplicación principal
├── database.py          # Configuración de BD
├── models.py            # Modelos SQLAlchemy
├── schemas.py           # Schemas Pydantic
├── auth.py              # Autenticación y autorización
├── utils.py             # Utilidades
├── routes/
│   ├── __init__.py
│   ├── auth.py          # Rutas de autenticación
│   └── productos.py     # Rutas de productos
├── media/               # Imágenes (se crea automáticamente)
│   └── productos/
│       └── {id}/
├── requirements.txt     # Dependencias
├── .env                 # Variables de entorno
└── README.md
```

## 🖼️ Subir Imágenes

### Ejemplo con curl:

```bash
# 1. Obtener token
TOKEN=$(curl -X POST "http://localhost:8000/auth/login" \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@loquieroyacm.com","password":"admin123"}' \
  | jq -r '.access_token')

# 2. Crear producto
PRODUCTO_ID=$(curl -X POST "http://localhost:8000/productos/" \
  -H "Authorization: Bearer $TOKEN" \
  -F "nombre=Ancheta Especial" \
  -F "descripcion=Ancheta con dulces colombianos" \
  -F "precio=45000" \
  -F "categoria=anchetas" \
  | jq -r '.id')

# 3. Subir imágenes
curl -X POST "http://localhost:8000/productos/$PRODUCTO_ID/imagenes" \
  -H "Authorization: Bearer $TOKEN" \
  -F "imagenes=@imagen1.jpg" \
  -F "imagenes=@imagen2.jpg" \
  -F "imagenes=@imagen3.jpg"
```

## 🔧 Configuración

### Limites de imágenes:
- Tamaño máximo: 5MB (configurable en `.env`)
- Formatos permitidos: JPG, JPEG, PNG, WEBP
- Las imágenes se optimizan automáticamente

### CORS:
Configura los orígenes permitidos en `.env`:

```
ALLOWED_ORIGINS=http://localhost:3000,http://localhost:5173
```

## 🚀 Producción

### 1. Usar PostgreSQL

```bash
# Instalar driver
pip install psycopg2-binary

# Configurar en .env
DATABASE_URL=postgresql://usuario:password@localhost/loquieroya
```

### 2. Cambiar SECRET_KEY

Genera una clave segura:

```python
import secrets
print(secrets.token_urlsafe(32))
```

### 3. Ejecutar con Gunicorn

```bash
pip install gunicorn
gunicorn main:app -w 4 -k uvicorn.workers.UvicornWorker --bind 0.0.0.0:8000
```

## 📝 Notas

- Las imágenes se almacenan en `/media/productos/{producto_id}/`
- Los nombres de archivo son únicos (UUID)
- Las imágenes se optimizan automáticamente
- Al eliminar un producto, se eliminan todas sus imágenes
- La relación productos-imágenes es uno-a-muchos con CASCADE

