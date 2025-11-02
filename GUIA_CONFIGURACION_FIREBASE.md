# 🔥 Guía Paso a Paso - Configuración de Firebase

## Lo Quiero YA CM - Configuración Completa

Esta guía te llevará desde cero hasta tener Firebase completamente configurado para tu proyecto.

---

## 📋 Requisitos Previos

Antes de comenzar, asegúrate de tener:

- [ ] Cuenta de Google (Gmail)
- [ ] Node.js instalado (v14 o superior)
- [ ] Editor de código (VS Code recomendado)
- [ ] Conexión a Internet

---

## 🚀 PARTE 1: Crear Proyecto en Firebase

### Paso 1: Acceder a Firebase Console

1. Abre tu navegador
2. Ve a: **https://console.firebase.google.com/**
3. Haz clic en **"Iniciar sesión"** con tu cuenta de Google

### Paso 2: Crear Nuevo Proyecto

1. Haz clic en **"Agregar proyecto"** o **"Create a project"**

2. **Nombre del proyecto**:
   ```
   loquieroya-cm
   ```
   - Puedes usar otro nombre, pero será tu ID de proyecto
   - Haz clic en **"Continuar"**

3. **Google Analytics** (opcional):
   - Puedes desactivarlo por ahora
   - O activarlo si quieres estadísticas
   - Haz clic en **"Crear proyecto"**

4. **Espera** mientras Firebase crea tu proyecto (30-60 segundos)

5. Haz clic en **"Continuar"** cuando esté listo

---

## 🗄️ PARTE 2: Configurar Firestore Database

### Paso 1: Crear Base de Datos

1. En el menú lateral, busca **"Compilación"** (Build)
2. Haz clic en **"Firestore Database"**
3. Haz clic en **"Crear base de datos"** (Create database)

### Paso 2: Elegir Ubicación

1. **Modo**: Selecciona **"Modo de prueba"** (Test mode) por ahora
   - Podrás cambiar las reglas después
2. Haz clic en **"Siguiente"**

### Paso 3: Ubicación del Servidor

1. Selecciona la ubicación más cercana a tus clientes:
   - **us-central1** (Iowa) - Recomendado para Latinoamérica
   - **southamerica-east1** (São Paulo) - Mejor para Sudamérica
   - **us-east1** (Carolina del Sur)

2. Haz clic en **"Habilitar"**

3. **Espera** mientras se crea la base de datos

### Paso 4: Crear Colecciones Iniciales (Opcional)

Puedes crear las colecciones ahora o dejarlas que se creen automáticamente:

1. Haz clic en **"Iniciar colección"**
2. **ID de colección**: `pedidos`
3. Haz clic en **"Siguiente"**
4. Agrega un documento de prueba:
   - **ID del documento**: `test`
   - **Campo**: `prueba` | **Valor**: `true`
5. Haz clic en **"Guardar"**

Repite para crear colecciones:
- `usuarios`
- `productos`
- `config`

---

## 🔐 PARTE 3: Configurar Authentication

### Paso 1: Activar Authentication

1. En el menú lateral, haz clic en **"Authentication"**
2. Haz clic en **"Comenzar"** (Get started)

### Paso 2: Habilitar Método de Acceso

1. Haz clic en la pestaña **"Sign-in method"**
2. Busca **"Correo electrónico/contraseña"** (Email/Password)
3. Haz clic en él
4. **Activa** el interruptor superior (Email/Password)
5. Deja desactivado "Vínculo de correo electrónico"
6. Haz clic en **"Guardar"**

### Paso 3: Crear Usuario Administrador

1. Ve a la pestaña **"Users"**
2. Haz clic en **"Agregar usuario"** (Add user)
3. **Email**: `admin@loquieroyacm.com` (o tu email)
4. **Contraseña**: Crea una contraseña segura (mínimo 6 caracteres)
5. Haz clic en **"Agregar usuario"**

### Paso 4: Configurar Rol de Administrador

1. Ve a **Firestore Database**
2. Crea una colección llamada `usuarios` (si no existe)
3. Crea un documento con el UID del usuario que acabas de crear:
   - **ID del documento**: [Copia el UID del usuario de Authentication]
   - Agrega campos:
     - `email`: `admin@loquieroyacm.com` (string)
     - `role`: `admin` (string)
     - `nombre`: `Administrador` (string)
4. Haz clic en **"Guardar"**

---

## 🌐 PARTE 4: Configurar Hosting

### Paso 1: Activar Hosting

1. En el menú lateral, haz clic en **"Hosting"**
2. Haz clic en **"Comenzar"** (Get started)

### Paso 2: Instalación (lo haremos desde la terminal)

Firebase te mostrará instrucciones. Por ahora solo haz clic en **"Siguiente"** hasta llegar a **"Finalizar"**.

---

## 💻 PARTE 5: Configurar Firebase CLI en tu Computadora

### Paso 1: Instalar Firebase Tools

Abre tu terminal (PowerShell en Windows) y ejecuta:

```bash
npm install -g firebase-tools
```

**Espera** a que se instale (puede tomar 1-2 minutos).

### Paso 2: Verificar Instalación

```bash
firebase --version
```

Deberías ver algo como: `13.0.0` o superior

### Paso 3: Iniciar Sesión

```bash
firebase login
```

- Se abrirá tu navegador
- Inicia sesión con tu cuenta de Google
- Autoriza Firebase CLI
- Regresa a la terminal

Deberías ver: `✔ Success! Logged in as tu-email@gmail.com`

---

## ⚙️ PARTE 6: Obtener Configuración de Firebase

### Paso 1: Registrar App Web

1. En Firebase Console, ve a la página principal del proyecto
2. En el centro, verás: **"Comienza agregando Firebase a tu app"**
3. Haz clic en el ícono **Web** `</>`
4. **Nombre de la app**: `Lo Quiero YA CM`
5. **Marca** la casilla de Firebase Hosting
6. Haz clic en **"Registrar app"**

### Paso 2: Copiar Configuración

Verás un código JavaScript como este:

```javascript
const firebaseConfig = {
  apiKey: "AIzaSyXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX",
  authDomain: "loquieroya-cm.firebaseapp.com",
  projectId: "loquieroya-cm",
  storageBucket: "loquieroya-cm.appspot.com",
  messagingSenderId: "123456789012",
  appId: "1:123456789012:web:xxxxxxxxxxxxxxxxxxxx"
};
```

**¡IMPORTANTE! Copia estos valores, los necesitarás en el siguiente paso.**

### Paso 3: Configurar el Proyecto

1. Abre el archivo `firebase-config.js` en tu proyecto
2. Reemplaza los valores de ejemplo con los tuyos:

```javascript
const firebaseConfig = {
  apiKey: "TU_API_KEY_AQUI",
  authDomain: "tu-proyecto.firebaseapp.com",
  projectId: "tu-proyecto-id",
  storageBucket: "tu-proyecto.appspot.com",
  messagingSenderId: "TU_SENDER_ID",
  appId: "TU_APP_ID"
};
```

3. **Guarda el archivo** (Ctrl + S)

---

## 📝 PARTE 7: Configurar Reglas de Seguridad

### Paso 1: Actualizar .firebaserc

Abre el archivo `.firebaserc` y actualiza el ID del proyecto:

```json
{
  "projects": {
    "default": "loquieroya-cm"
  }
}
```

Reemplaza `loquieroya-cm` con tu ID de proyecto real.

### Paso 2: Desplegar Reglas de Firestore

En la terminal, dentro de tu proyecto, ejecuta:

```bash
firebase deploy --only firestore:rules
```

Deberías ver:
```
✔ Deploy complete!
```

### Paso 3: Desplegar Índices de Firestore

```bash
firebase deploy --only firestore:indexes
```

---

## 🚀 PARTE 8: Probar Localmente

### Paso 1: Iniciar Servidor Local

```bash
firebase serve
```

O puedes usar Live Server de VS Code:
- Click derecho en `index.html`
- Selecciona **"Open with Live Server"**

### Paso 2: Abrir en el Navegador

Ve a: **http://localhost:5000** (si usas Firebase)
O: **http://127.0.0.1:5500** (si usas Live Server)

### Paso 3: Verificar Conexión

1. Abre la **Consola del Navegador** (F12)
2. Busca estos mensajes:
   ```
   ✅ Firebase inicializado correctamente
   🍩 Lo Quiero YA CM - Sistema cargado
   ```

3. Si ves errores, revisa que:
   - La configuración en `firebase-config.js` sea correcta
   - Firebase Tools esté instalado
   - Estés conectado a Internet

---

## 🛒 PARTE 9: Probar el Sistema

### Paso 1: Probar Catálogo

1. Ve a la página principal
2. Deberías ver los productos
3. Haz clic en **"🎨 Personalizar"** en Mini Donas
4. Personaliza un producto
5. Agrégalo al carrito

### Paso 2: Probar Pedido

1. Haz clic en **"Finalizar Pedido"**
2. Ingresa datos de prueba:
   - Nombre: `Test User`
   - Teléfono: `3001234567`
   - Dirección: `Calle Test 123`
3. Confirma el pedido

### Paso 3: Verificar en Firestore

1. Ve a Firebase Console
2. Abre **Firestore Database**
3. Busca la colección `pedidos`
4. Deberías ver tu pedido de prueba

### Paso 4: Probar Panel de Administración

1. Ve a: `http://localhost:5000/admin.html`
2. Inicia sesión con tu usuario admin:
   - Email: `admin@loquieroyacm.com`
   - Contraseña: [la que creaste]
3. Deberías ver el panel con tu pedido de prueba

---

## 🌐 PARTE 10: Desplegar a Producción

### Paso 1: Desplegar el Sitio

```bash
firebase deploy
```

Este comando desplegará:
- ✅ Hosting (tu sitio web)
- ✅ Reglas de Firestore
- ✅ Índices de Firestore

**Espera** mientras Firebase despliega (1-2 minutos).

### Paso 2: Ver tu Sitio en Vivo

Cuando termine, verás algo como:

```
✔ Deploy complete!

Project Console: https://console.firebase.google.com/project/loquieroya-cm/overview
Hosting URL: https://loquieroya-cm.web.app
```

**¡Tu sitio está en vivo!** 🎉

### Paso 3: Probar en Producción

1. Visita tu URL: `https://tu-proyecto.web.app`
2. Prueba todo el flujo:
   - Catálogo ✅
   - Personalización ✅
   - Carrito ✅
   - Pedido ✅
   - Panel Admin ✅

---

## 🔧 PARTE 11: Configuración Adicional (Opcional)

### Activar Modo Producción en Firestore

1. Ve a Firebase Console > Firestore Database
2. Haz clic en la pestaña **"Reglas"**
3. Las reglas ya están configuradas con el archivo `firestore.rules`
4. Verifica que se hayan aplicado correctamente

### Configurar Dominio Personalizado

1. En Firebase Console, ve a **Hosting**
2. Haz clic en **"Agregar dominio personalizado"**
3. Ingresa tu dominio (ej: `loquieroyacm.com`)
4. Sigue las instrucciones para configurar DNS

### Habilitar CORS (si usas API externa)

En `firebase.json`:

```json
{
  "hosting": {
    "headers": [
      {
        "source": "**",
        "headers": [
          {
            "key": "Access-Control-Allow-Origin",
            "value": "*"
          }
        ]
      }
    ]
  }
}
```

---

## ✅ Checklist Final

Marca cada item cuando lo completes:

### Configuración Básica
- [ ] Proyecto de Firebase creado
- [ ] Firestore Database activado y configurado
- [ ] Authentication habilitado (email/password)
- [ ] Usuario administrador creado
- [ ] Hosting activado
- [ ] Firebase CLI instalado
- [ ] Login en Firebase CLI exitoso

### Configuración del Código
- [ ] `firebase-config.js` actualizado con tus credenciales
- [ ] `.firebaserc` actualizado con tu project ID
- [ ] Reglas de Firestore desplegadas
- [ ] Índices de Firestore desplegados

### Pruebas
- [ ] Sitio funciona localmente
- [ ] Puedes personalizar mini donas
- [ ] Puedes agregar al carrito
- [ ] Puedes finalizar pedido
- [ ] Pedido se guarda en Firestore
- [ ] Panel admin funciona
- [ ] Puedes ver pedidos en el panel

### Producción
- [ ] Sitio desplegado en Firebase Hosting
- [ ] URL de producción funciona
- [ ] Todas las funcionalidades probadas en producción

---

## 🆘 Solución de Problemas Comunes

### Error: "Firebase config not found"

**Solución**: Verifica que `firebase-config.js` esté en la raíz del proyecto y tenga los valores correctos.

### Error: "Missing or insufficient permissions"

**Solución**: 
1. Despliega las reglas: `firebase deploy --only firestore:rules`
2. Verifica que el usuario tenga rol "admin" en Firestore

### Error: "Failed to get document because the client is offline"

**Solución**: 
1. Verifica tu conexión a Internet
2. Revisa la configuración de Firebase
3. Asegúrate de que Firestore esté habilitado

### Error en Login: "User not found"

**Solución**: Verifica que el usuario exista en Authentication y tenga el email correcto.

### El sitio no carga después de desplegar

**Solución**:
1. Espera 5-10 minutos (propagación de CDN)
2. Limpia caché del navegador (Ctrl + Shift + Delete)
3. Prueba en modo incógnito

---

## 📞 Comandos Útiles

```bash
# Ver estado de login
firebase login:list

# Cambiar de proyecto
firebase use loquieroya-cm

# Ver proyectos disponibles
firebase projects:list

# Ver URL de hosting
firebase hosting:sites:list

# Ver logs de funciones (si las usas)
firebase functions:log

# Desplegar solo hosting
firebase deploy --only hosting

# Desplegar solo reglas
firebase deploy --only firestore:rules

# Abrir Firebase Console
firebase open

# Probar localmente
firebase serve

# Probar solo hosting
firebase serve --only hosting
```

---

## 🎓 Siguiente Nivel

Una vez que tengas Firebase funcionando, puedes:

1. **Configurar n8n** para notificaciones automáticas
   - Lee: `GUIA_N8N_NOTIFICACIONES.md`

2. **Agregar más productos** al catálogo
   - Edita `js/app.js`

3. **Personalizar diseño**
   - Edita `css/style.css`

4. **Agregar imágenes de productos**
   - Sube a `/assets` y actualiza el código

5. **Configurar WhatsApp**
   - Usa WhatsApp Business API

---

## 💡 Tips Finales

1. **Backup de Firestore**: Configura copias de seguridad automáticas
2. **Monitoreo**: Revisa Firebase Console regularmente
3. **Presupuesto**: Configura alertas de costos (Firebase es gratis hasta cierto límite)
4. **Seguridad**: Cambia las reglas de Firestore a producción después de probar
5. **Performance**: Usa Firebase Performance Monitoring

---

## 📚 Recursos Adicionales

- [Documentación de Firebase](https://firebase.google.com/docs)
- [Firebase Console](https://console.firebase.google.com/)
- [Límites del Plan Gratuito](https://firebase.google.com/pricing)
- [Comunidad de Firebase](https://firebase.google.com/community)
- [Stack Overflow - Firebase](https://stackoverflow.com/questions/tagged/firebase)

---

<div align="center">
  <h2>🎉 ¡Felicitaciones!</h2>
  <p>Has configurado Firebase exitosamente para Lo Quiero YA CM</p>
  <h3>🍩 #AntójateDeFelicidad 🍩</h3>
  <p>© 2025 Lo Quiero YA CM</p>
</div>

---

## ¿Necesitas Ayuda?

Si encuentras algún problema durante la configuración, revisa:

1. Esta guía completa
2. Los logs en la consola del navegador (F12)
3. Los logs de la terminal
4. La documentación oficial de Firebase

O contáctame para ayuda adicional! 😊

