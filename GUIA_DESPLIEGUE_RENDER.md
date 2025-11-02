# 🚀 Guía para Desplegar en Render (GRATIS)

## ✅ Checklist Pre-Despliegue

### 1. Lo que YA TENEMOS ✅

- ✅ Estructura del backend correcta
- ✅ `requirements.txt` con todas las dependencias
- ✅ `main.py` configurado
- ✅ Rutas API funcionando
- ✅ Sistema de autenticación JWT
- ✅ Modelos de base de datos

### 2. Lo que AGREGAMOS para Render ✅

- ✅ `psycopg2-binary` (para PostgreSQL)
- ✅ `asyncpg` (driver async para PostgreSQL)
- ✅ `render.yaml` (configuración de Render)

---

## 📝 Pasos para Desplegar

### Paso 1: Subir el Código a GitHub

```bash
# Si aún no tienes git inicializado
cd C:\Users\ANNY\loquieroya_cm
git init
git add .
git commit -m "Preparando para despliegue en Render"

# Crear repo en GitHub y subir
git remote add origin https://github.com/TU_USUARIO/loquieroya-cm.git
git branch -M main
git push -u origin main
```

### Paso 2: Crear Cuenta en Render

1. Ve a: https://render.com/
2. Click en **"Get Started for Free"**
3. Regístrate con GitHub

### Paso 3: Crear Base de Datos PostgreSQL

1. En Render Dashboard, click **"New +"**
2. Selecciona **"PostgreSQL"**
3. Configuración:
   - **Name**: `loquieroya-db`
   - **Database**: `loquieroya`
   - **User**: `loquieroya_user`
   - **Region**: Elige el más cercano
   - **Plan**: **Free** (0$)
4. Click **"Create Database"**
5. **GUARDA** la **Internal Database URL** (la necesitarás)

### Paso 4: Crear Web Service

1. En Render Dashboard, click **"New +"**
2. Selecciona **"Web Service"**
3. Conecta tu repositorio de GitHub
4. Configuración:
   - **Name**: `loquieroya-api`
   - **Region**: El mismo que la BD
   - **Branch**: `main`
   - **Root Directory**: `backend`
   - **Runtime**: `Python 3`
   - **Build Command**: `pip install -r requirements.txt`
   - **Start Command**: `uvicorn main:app --host 0.0.0.0 --port $PORT`
   - **Plan**: **Free** (0$)

### Paso 5: Configurar Variables de Entorno

En la sección **"Environment Variables"**, agrega:

```
DATABASE_URL = [Pega aquí la Internal Database URL de PostgreSQL]
SECRET_KEY = [Genera una clave aleatoria larga]
ALGORITHM = HS256
ACCESS_TOKEN_EXPIRE_MINUTES = 480
MEDIA_PATH = ./media
ALLOWED_ORIGINS = *
```

Para generar SECRET_KEY, usa:
```python
import secrets
print(secrets.token_urlsafe(32))
```

### Paso 6: Deploy

1. Click **"Create Web Service"**
2. Render empezará a construir tu aplicación
3. Espera 5-10 minutos
4. ✅ ¡Listo! Tu API estará en: `https://loquieroya-api.onrender.com`

---

## 🔗 Conectar Frontend con Backend Desplegado

### Actualizar `api.service.js`

Cambia:
```javascript
this.baseURL = 'http://localhost:8000';
```

Por:
```javascript
this.baseURL = 'https://loquieroya-api.onrender.com';
```

### Desplegar Frontend en Firebase

```bash
cd C:\Users\ANNY\loquieroya_cm
firebase deploy --only hosting
```

---

## 📊 URLs Finales

Después del despliegue tendrás:

- 🌐 **API Backend**: `https://loquieroya-api.onrender.com`
- 📚 **API Docs**: `https://loquieroya-api.onrender.com/docs`
- 🏠 **Frontend**: `https://loquieroya-cm.web.app`
- 👨‍💼 **Panel Admin**: `https://loquieroya-cm.web.app/admin.html`

---

## ⚠️ Limitaciones del Plan Gratuito

- ✅ **500 horas/mes** de uso (más que suficiente)
- ⚠️ La app **se duerme** después de 15 min sin uso
- ⏳ **Primera carga** después de dormir: ~30 segundos
- 💾 **PostgreSQL**: 100MB de almacenamiento
- 🖼️ **Almacenamiento de imágenes**: Limitado

### Solución para Imágenes

En producción, usa **Cloudinary** o **AWS S3** para almacenar imágenes en lugar del filesystem.

---

## 🔧 Actualizar el Código

Cuando hagas cambios:

```bash
git add .
git commit -m "Descripción del cambio"
git push origin main
```

Render detectará el push y **redesplegarᄀ automáticamente**.

---

## 🐛 Solución de Problemas

### "Application failed to respond"

1. Revisa los logs en Render
2. Verifica que `DATABASE_URL` esté correcta
3. Asegúrate de que el comando de inicio sea correcto

### "Database connection failed"

1. Verifica que la base de datos esté creada
2. Revisa que `DATABASE_URL` incluya el protocolo correcto
3. Para async debe ser: `postgresql+asyncpg://...`

### Las imágenes no se guardan

En el plan gratuito, el filesystem es **efímero**. Usa Cloudinary:

```bash
pip install cloudinary
```

---

## 🎉 ¡Listo!

Tu backend estará disponible 24/7 en internet, completamente **GRATIS** con Render.

**Notas:**
- Primera carga lenta es normal (plan gratuito)
- Considera upgrade ($7/mes) si necesitas 0 downtime
- Render es perfecto para MVPs y proyectos personales

---

**Desarrollado para Lo Quiero YA CM** 🍩
*#AntójateDeFelicidad*

