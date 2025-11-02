# 🔐 Crear Usuario Administrador - Firebase

## Problema
No puedes iniciar sesión en el panel admin porque no existe un usuario en Firebase Authentication.

---

## ✅ Solución: Crear Usuario Admin

### **Método 1: Desde Firebase Console (MÁS FÁCIL)**

#### **Paso 1: Ir a Firebase Console**
1. Abre: https://console.firebase.google.com/
2. Selecciona tu proyecto: **loquieroya-cm**

#### **Paso 2: Habilitar Authentication**
1. En el menú lateral, haz clic en **"Authentication"**
2. Si aparece "Comenzar", haz clic en ese botón
3. Verás la pestaña **"Users"**

#### **Paso 3: Agregar Usuario Manualmente**
1. Haz clic en **"Add user"** (Agregar usuario)
2. Completa los campos:
   ```
   Email: admin@loquieroyacm.com
   (o el email que prefieras)
   
   Password: TuContraseñaSegura123!
   (mínimo 6 caracteres)
   ```
3. Haz clic en **"Add user"**

#### **Paso 4: Iniciar Sesión en Admin**
1. Ve a: https://loquieroya-cm.web.app/admin.html
2. Ingresa las credenciales que creaste:
   - **Email:** admin@loquieroyacm.com
   - **Password:** TuContraseñaSegura123!
3. ¡Listo! Deberías poder acceder

---

### **Método 2: Habilitar Email/Password en Authentication**

Si ves un error de "método de inicio de sesión no habilitado":

#### **Paso 1: Ir a Sign-in Methods**
1. En Firebase Console → Authentication
2. Haz clic en la pestaña **"Sign-in method"**

#### **Paso 2: Habilitar Email/Password**
1. Busca **"Email/Password"** en la lista
2. Haz clic en el ícono de lápiz (editar)
3. Activa el toggle **"Enable"**
4. Haz clic en **"Save"**

#### **Paso 3: Crear Usuario**
1. Vuelve a la pestaña **"Users"**
2. Haz clic en **"Add user"**
3. Ingresa email y contraseña
4. Guarda

---

### **Método 3: Usar Firebase CLI (AVANZADO)**

Si prefieres crear el usuario desde la línea de comandos:

```bash
# Iniciar sesión en Firebase
firebase login

# Crear usuario con el SDK Admin (requiere Node.js)
# Crear archivo create-admin.js:
```

```javascript
// create-admin.js
const admin = require('firebase-admin');
const serviceAccount = require('./serviceAccountKey.json');

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount)
});

admin.auth().createUser({
  email: 'admin@loquieroyacm.com',
  password: 'TuContraseñaSegura123!',
  displayName: 'Administrador'
})
.then((userRecord) => {
  console.log('✅ Usuario creado:', userRecord.uid);
  process.exit(0);
})
.catch((error) => {
  console.error('❌ Error:', error);
  process.exit(1);
});
```

```bash
# Ejecutar script
node create-admin.js
```

---

## 🔍 Verificar que Todo Funcione

### **1. Verificar en Firebase Console:**
- Ve a Authentication → Users
- Deberías ver tu usuario listado

### **2. Probar Inicio de Sesión:**
```
URL: https://loquieroya-cm.web.app/admin.html

Credenciales:
Email: admin@loquieroyacm.com
Password: [tu contraseña]
```

### **3. Si Sigue Sin Funcionar:**

Abre la consola del navegador (F12) y busca errores:

**Errores comunes:**

```javascript
// Error 1: Method not enabled
❌ "auth/operation-not-allowed"
Solución: Habilitar Email/Password en Sign-in methods

// Error 2: Invalid email
❌ "auth/invalid-email"
Solución: Verificar formato del email

// Error 3: User not found
❌ "auth/user-not-found"
Solución: Crear el usuario en Firebase Console

// Error 4: Wrong password
❌ "auth/wrong-password"
Solución: Verificar la contraseña o resetearla
```

---

## 🔒 Seguridad Adicional (Opcional)

### **Agregar Claims de Admin:**

Si quieres marcar el usuario como admin con permisos especiales:

1. **Desde Firebase Console:**
   - No hay UI directa, necesitas usar Firebase CLI

2. **Desde Firebase CLI:**
```bash
firebase functions:shell

# En el shell:
admin.auth().setCustomUserClaims('UID_DEL_USUARIO', { admin: true })
```

3. **Verificar en el código:**
```javascript
// En admin.js
const isAdmin = await authService.isAdmin();
if (!isAdmin) {
  alert('No tienes permisos de administrador');
}
```

---

## 📝 Credenciales Recomendadas

Para desarrollo:
```
Email: admin@loquieroyacm.com
Password: Admin123!
```

Para producción:
```
Email: tu_email_real@gmail.com
Password: [contraseña fuerte con 12+ caracteres]
```

**Tip de Seguridad:** 
- Usa un email real para recuperación
- Contraseña de al menos 12 caracteres
- Combina mayúsculas, minúsculas, números y símbolos
- Activa 2FA si está disponible

---

## ✅ Checklist

- [ ] Firebase Authentication habilitado
- [ ] Email/Password habilitado en Sign-in methods
- [ ] Usuario admin creado
- [ ] Credenciales guardadas de forma segura
- [ ] Inicio de sesión probado y funcionando
- [ ] Acceso al panel admin confirmado

---

## 🆘 ¿Sigue sin funcionar?

**Revisa estos puntos:**

1. **¿Firebase está inicializado?**
   - Abre la consola (F12) en admin.html
   - Debes ver: `✅ Firebase inicializado correctamente`
   - Si no aparece, hay problema con firebase-config.js

2. **¿AuthService está disponible?**
   - En consola ejecuta: `console.log(authService)`
   - Debe mostrar el objeto del servicio
   - Si es `undefined`, falta cargar auth.service.js

3. **¿Hay errores en consola?**
   - Busca mensajes en rojo
   - Copia el error completo para diagnosticar

4. **¿La conexión a Firebase funciona?**
   - Verifica tu conexión a internet
   - Comprueba que firebase-config.js tiene las credenciales correctas

---

**Creado:** 2025-10-17
**Para:** Lo Quiero YA CM Admin Panel

