# 🚀 Configuración Completa para Render

## ✅ Código Subido a GitHub

Tu proyecto ya está en: **https://github.com/AnnyDiaz/loquieroya-cm**

---

## 📊 Base de Datos Creada

Ya tienes PostgreSQL en Render:
```
postgresql://loquieroya_db_user:pRPWJLfIjdhxTPBPqOGn60CJ3J91YtIx@dpg-d43vcd8dl3ps73aau2rg-a/loquieroya_db
```

---

## 🎯 Pasos para Desplegar el Backend

### 1️⃣ Ir a Render Dashboard

Ve a: https://dashboard.render.com/

### 2️⃣ Crear Web Service

1. Click en **"New +"** → **"Web Service"**
2. Click en **"Connect a repository"** 
3. Busca y selecciona: **`AnnyDiaz/loquieroya-cm`**
4. Click en **"Connect"**

### 3️⃣ Configurar el Servicio

Completa el formulario:

```
Name: loquieroya-api
Region: Oregon (US West) - o el mismo que tu BD
Branch: main
Root Directory: backend         ← IMPORTANTE
Runtime: Python 3
Build Command: pip install -r requirements.txt
Start Command: uvicorn main:app --host 0.0.0.0 --port $PORT
Instance Type: Free
```

### 4️⃣ Variables de Entorno

En la sección **"Environment Variables"**, click en **"Add Environment Variable"** y agrega cada una:

```
Key: DATABASE_URL
Value: postgresql://loquieroya_db_user:pRPWJLfIjdhxTPBPqOGn60CJ3J91YtIx@dpg-d43vcd8dl3ps73aau2rg-a/loquieroya_db

Key: SECRET_KEY
Value: loquieroya_2025_super_secret_key_cambiar_en_produccion

Key: ALGORITHM
Value: HS256

Key: ACCESS_TOKEN_EXPIRE_MINUTES
Value: 480

Key: MEDIA_PATH
Value: ./media

Key: MAX_IMAGE_SIZE_MB
Value: 5

Key: ALLOWED_IMAGE_EXTENSIONS
Value: jpg,jpeg,png,webp

Key: ALLOWED_ORIGINS
Value: https://loquieroya-cm.web.app,http://localhost:5500
```

### 5️⃣ Desplegar

1. Revisa que todo esté correcto
2. Click en **"Create Web Service"**
3. Espera 5-10 minutos mientras Render construye tu app

---

## 🌐 Tu API Estará en:

```
https://loquieroya-api.onrender.com
```

### Endpoints disponibles:
- `https://loquieroya-api.onrender.com/` - Información
- `https://loquieroya-api.onrender.com/docs` - Documentación Swagger
- `https://loquieroya-api.onrender.com/health` - Health check
- `https://loquieroya-api.onrender.com/productos` - Lista de productos
- `https://loquieroya-api.onrender.com/auth/login` - Login admin

---

## 📱 Frontend ya Configurado

✅ El frontend ya está configurado para cambiar automáticamente entre:

**Desarrollo** (localhost):
- Usa: `http://localhost:8000`

**Producción** (Firebase Hosting):
- Usa: `https://loquieroya-api.onrender.com`

### Cómo funciona:

El archivo `api-config.js` detecta automáticamente:
- Si estás en `localhost` → usa backend local
- Si estás en `loquieroya-cm.web.app` → usa backend de Render

---

## 🔄 Desplegar Frontend a Firebase

Después de que el backend esté funcionando en Render:

```bash
cd C:\Users\ANNY\loquieroya_cm
firebase deploy --only hosting
```

Espera 1-2 minutos y tus cambios estarán en:
```
https://loquieroya-cm.web.app
```

---

## ⚠️ Importante: Primera Carga en Render

**El plan gratuito de Render "duerme" la app después de 15 minutos sin uso.**

Cuando alguien acceda por primera vez (o después de 15 min):
- ⏳ La primera carga tomará **30-60 segundos**
- ✅ Cargas posteriores serán **rápidas** (mientras esté despierta)

### Solución:

El frontend ya está configurado con timeout de 30 segundos para Render.

---

## 🧪 Probar la Integración

### Opción A: Localmente (Desarrollo)

1. Inicia el backend local (si funciona):
   ```bash
   cd backend
   python start.py
   ```

2. Abre: `http://localhost:5500/admin.html`
3. Debería conectar a `http://localhost:8000`

### Opción B: En Producción (Render + Firebase)

1. Espera a que Render termine de desplegar
2. Abre: `https://loquieroya-api.onrender.com/docs`
3. Si ves Swagger UI = ✅ Backend funcionando
4. Despliega frontend: `firebase deploy --only hosting`
5. Abre: `https://loquieroya-cm.web.app/admin.html`
6. Debería conectar a Render automáticamente

---

## 📋 Checklist de Despliegue

- [ ] ✅ Código en GitHub (listo)
- [ ] ✅ Base de datos PostgreSQL creada (listo)
- [ ] ⏳ Web Service en Render (pendiente - sigue los pasos de arriba)
- [ ] ⏳ Variables de entorno configuradas (paso 4)
- [ ] ⏳ Esperar que Render despliegue (5-10 min)
- [ ] ⏳ Verificar API: https://loquieroya-api.onrender.com/docs
- [ ] ⏳ Desplegar frontend: `firebase deploy --only hosting`
- [ ] ⏳ Probar en: https://loquieroya-cm.web.app/

---

## 🎉 Resultado Final

Cuando todo esté desplegado:

```
Frontend (Firebase):  https://loquieroya-cm.web.app/
Panel Admin:          https://loquieroya-cm.web.app/admin.html
Backend (Render):     https://loquieroya-api.onrender.com
API Docs:             https://loquieroya-api.onrender.com/docs
```

---

## ✨ ¿Siguiente Paso?

Sigue los pasos 1-5 de arriba para crear el Web Service en Render.

**¡Ya está todo listo en el código!** Solo falta configurarlo en Render. 🚀

