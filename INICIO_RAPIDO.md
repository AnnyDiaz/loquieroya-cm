# ⚡ Inicio Rápido - Lo Quiero YA CM

## Configuración Firebase en 10 Minutos

Esta es la versión rápida. Para la guía completa, lee: `GUIA_CONFIGURACION_FIREBASE.md`

---

## 📦 1. Instalar Firebase CLI

```bash
npm install -g firebase-tools
```

---

## 🔑 2. Login

```bash
firebase login
```

---

## 🔥 3. Crear Proyecto en Firebase Console

1. Ve a: https://console.firebase.google.com/
2. Crea proyecto: `loquieroya-cm`
3. Habilita **Firestore Database** (modo prueba)
4. Habilita **Authentication** (Email/Password)
5. Habilita **Hosting**

---

## 👤 4. Crear Usuario Admin

En Firebase Console:
- **Authentication** > **Users** > **Add user**
- Email: `admin@loquieroyacm.com`
- Password: [tu contraseña segura]

En Firestore:
- Colección: `usuarios`
- Documento ID: [UID del usuario]
- Campos:
  - `email`: `admin@loquieroyacm.com`
  - `role`: `admin`
  - `nombre`: `Administrador`

---

## ⚙️ 5. Obtener Configuración

En Firebase Console:
- Click en ícono **Web** `</>`
- Copia el `firebaseConfig`
- Pégalo en `firebase-config.js`

```javascript
// firebase-config.js
const firebaseConfig = {
  apiKey: "TU_API_KEY",
  authDomain: "tu-proyecto.firebaseapp.com",
  projectId: "tu-proyecto-id",
  storageBucket: "tu-proyecto.appspot.com",
  messagingSenderId: "123456789",
  appId: "1:123456789:web:xxxxx"
};
```

---

## 📝 6. Actualizar ID del Proyecto

Edita `.firebaserc`:

```json
{
  "projects": {
    "default": "tu-proyecto-id"
  }
}
```

---

## 🚀 7. Desplegar Reglas

```bash
firebase deploy --only firestore:rules
firebase deploy --only firestore:indexes
```

---

## 💻 8. Probar Localmente

```bash
firebase serve
```

O usa **Live Server** en VS Code.

Abre: http://localhost:5000

---

## 🌐 9. Desplegar a Producción

```bash
firebase deploy
```

Tu sitio estará en: `https://tu-proyecto.web.app`

---

## ✅ 10. Verificar

- [ ] Sitio carga correctamente
- [ ] Puedes personalizar mini donas
- [ ] Puedes agregar al carrito
- [ ] Puedes hacer un pedido
- [ ] Pedido aparece en Firestore
- [ ] Panel admin funciona (`/admin.html`)
- [ ] Puedes ver pedidos en el panel

---

## 🆘 Problemas Comunes

### No se conecta a Firebase
```bash
# Verifica tu configuración
cat firebase-config.js

# Verifica que estés logueado
firebase login:list
```

### Errores de permisos
```bash
# Redespliega las reglas
firebase deploy --only firestore:rules
```

### Sitio no actualiza
```bash
# Limpia caché y redespliega
firebase deploy --only hosting
```

---

## 📚 Comandos Útiles

```bash
# Ver proyectos
firebase projects:list

# Cambiar proyecto
firebase use tu-proyecto-id

# Ver logs
firebase functions:log

# Abrir consola
firebase open

# Solo hosting
firebase deploy --only hosting

# Solo reglas
firebase deploy --only firestore:rules
```

---

## 🎯 Próximos Pasos

1. ✅ **Personaliza** tus productos en `js/app.js`
2. ✅ **Agrega** tus datos de contacto en `index.html`
3. ✅ **Sube** imágenes a `/assets`
4. ✅ **Configura** n8n para notificaciones
5. ✅ **Comparte** tu sitio con clientes

---

## 📖 Documentación Completa

- `GUIA_CONFIGURACION_FIREBASE.md` - Guía detallada
- `GUIA_N8N_NOTIFICACIONES.md` - Automatización
- `README.md` - Documentación del proyecto

---

<div align="center">
  <h3>🍩 #AntójateDeFelicidad 🍩</h3>
  <p>© 2025 Lo Quiero YA CM</p>
</div>

