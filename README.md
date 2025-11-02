# 🍩 Lo Quiero YA CM – #AntójateDeFelicidad

![Estado del Proyecto](https://img.shields.io/badge/estado-activo-success.svg)
![Licencia](https://img.shields.io/badge/licencia-MIT-blue.svg)
![Versión](https://img.shields.io/badge/versión-1.0.0-brightgreen.svg)
![Firebase](https://img.shields.io/badge/Firebase-Firestore-orange.svg)

<div align="center">
  <h3>🧁 Endulza tu día con nosotros 🧁</h3>
  <p><em>Los mejores postres y antojos, hechos con amor y entregados en tu puerta</em></p>
</div>

---

## 📖 Descripción

**Lo Quiero YA CM** es un emprendimiento de postres y dulces artesanales que busca alegrar los días de nuestros clientes con productos deliciosos hechos con amor. Nuestro eslogan **#AntójateDeFelicidad** refleja nuestra misión: hacer que cada antojo se convierta en un momento especial.

Este proyecto es una **plataforma web completa** que permite a los clientes explorar nuestro catálogo de productos, agregar sus favoritos al carrito y realizar pedidos de forma sencilla y rápida, con gestión administrativa en tiempo real mediante Firebase y automatizaciones con n8n.

---

## 🎯 Objetivos del Proyecto

### General
Desarrollar una plataforma web funcional y atractiva que permita a los clientes realizar pedidos en línea de manera ágil, y que facilite al administrador la gestión de los mismos mediante la integración de herramientas como Firebase y n8n.

### Específicos

✅ Diseñar una interfaz web intuitiva y responsiva  
✅ Implementar carrito de compras con personalización de productos  
✅ Almacenar datos de pedidos y usuarios en Firebase Firestore  
✅ Configurar automatizaciones con n8n para notificaciones  
✅ Publicar y mantener el código en GitHub  
✅ Desplegar el sitio con Firebase Hosting  

---

## 🚀 Características Principales

### 🛍️ **Para Clientes**

✨ **Catálogo de Mini Donas Personalizables**
- 2 sabores: Vainilla y Frutos Rojos
- 5 opciones de cantidad (desde 1 hasta 9 unidades)
- 5 tipos de glaseado
- 11 toppings diferentes
- Sistema de personalización paso a paso

🎁 **Catálogo de Anchetas**
- Ancheta Dulce Especial ($35,000)
- Ancheta Premium ($50,000)
- Ancheta Romántica ($45,000)

🛒 **Carrito de Compras Inteligente**
- Agregar/eliminar productos
- Persistencia con localStorage + Firebase
- Cálculo automático del total
- Checkout simplificado

📱 **Experiencia Responsive**
- Diseño adaptable a móvil, tablet y desktop
- Colores pastel agradables
- Animaciones suaves

### 👨‍💼 **Para Administradores**

🔐 **Panel de Administración Seguro**
- Login con Firebase Authentication
- Gestión de pedidos en tiempo real
- Cambio de estados de pedidos
- Filtros por estado, fecha y búsqueda

📊 **Dashboard con Estadísticas**
- Total de pedidos
- Pedidos pendientes
- Pedidos entregados
- Ventas totales

🤖 **Automatización con n8n**
- Notificaciones automáticas de nuevos pedidos
- Integración con WhatsApp/Email
- Webhook configurableFlowchart TD
    A[Usuario] -->|Navega| B[Catálogo]
    B -->|Personaliza| C[Mini Donas]
    B -->|Selecciona| D[Anchetas]
    C -->|Agrega| E[Carrito]
    D -->|Agrega| E
    E -->|Finaliza| F[Formulario]
    F -->|Envía| G[Firebase Firestore]
    G -->|Notifica| H[n8n Webhook]
    H -->|Alerta| I[Administrador]
    I -->|Gestiona| J[Panel Admin]

---

## 🛠️ Tecnologías Utilizadas

| Categoría | Tecnología | Descripción |
|-----------|------------|-------------|
| **Frontend** | HTML5, CSS3, JavaScript | Interfaz de usuario moderna y responsiva |
| **Base de Datos** | Firebase Firestore | Base de datos NoSQL en tiempo real |
| **Autenticación** | Firebase Auth | Sistema de autenticación seguro |
| **Hosting** | Firebase Hosting | Hosting rápido y seguro con CDN |
| **Automatización** | n8n | Automatización de notificaciones |
| **Control de Versiones** | GitHub | Repositorio y control de código |
| **Notificaciones** | WhatsApp Cloud API / Email | Alertas automáticas |

---

## 📂 Estructura del Proyecto

```
loquieroya_cm/
├── 📄 index.html                  # Página principal del catálogo
├── 📄 admin.html                  # Panel de administración
├── 📄 firebase-config.js          # Configuración de Firebase
├── 📄 firebase.json               # Config de Firebase Hosting
├── 📄 firestore.rules             # Reglas de seguridad de Firestore
├── 📄 firestore.indexes.json      # Índices de Firestore
├── 📄 .firebaserc                 # Proyecto de Firebase
├── 📄 .gitignore                  # Archivos ignorados por Git
├── 📄 package.json                # Dependencias del proyecto
├── 📁 css/
│   ├── 📄 style.css              # Estilos principales
│   └── 📄 admin.css              # Estilos del panel admin
├── 📁 js/
│   ├── 📄 app.js                 # Lógica del catálogo y carrito
│   ├── 📄 firebase-service.js    # Servicio de Firebase
│   └── 📄 admin.js               # Lógica del panel admin
├── 📁 assets/                     # Recursos (imágenes, favicon)
└── 📄 README.md                   # Este archivo
```

---

## 💻 Instalación y Configuración

### Requisitos Previos

- Node.js (v14 o superior)
- Cuenta de Firebase
- Git
- Editor de código (VS Code recomendado)

### Paso 1: Clonar el Repositorio

```bash
git clone https://github.com/tu-usuario/loquieroya_cm.git
cd loquieroya_cm
```

### Paso 2: Instalar Firebase Tools

```bash
npm install -g firebase-tools
```

### Paso 3: Configurar Firebase

1. **Crear proyecto en Firebase Console**
   - Ve a https://console.firebase.google.com/
   - Haz clic en "Crear un proyecto"
   - Nombra tu proyecto: "loquieroya-cm"
   - Sigue los pasos de configuración

2. **Habilitar servicios de Firebase**
   - **Firestore Database**: Base de datos para pedidos
   - **Authentication**: Autenticación con email/contraseña
   - **Hosting**: Hosting del sitio web

3. **Obtener configuración**
   - En Configuración del proyecto > Apps
   - Registra una aplicación web
   - Copia la configuración de Firebase

4. **Configurar el proyecto**
   - Abre `firebase-config.js`
   - Reemplaza los valores con tu configuración:

```javascript
const firebaseConfig = {
  apiKey: "TU_API_KEY",
  authDomain: "tu-proyecto.firebaseapp.com",
  projectId: "tu-proyecto",
  storageBucket: "tu-proyecto.appspot.com",
  messagingSenderId: "TU_SENDER_ID",
  appId: "TU_APP_ID"
};
```

5. **Iniciar sesión en Firebase**

```bash
firebase login
```

6. **Desplegar reglas de Firestore**

```bash
firebase deploy --only firestore:rules
firebase deploy --only firestore:indexes
```

### Paso 4: Crear Usuario Administrador

```bash
# Opción 1: Desde Firebase Console
# Auth > Add user > Ingresa email y contraseña

# Opción 2: Registrarse desde la aplicación
# Luego actualiza el rol en Firestore:
# usuarios > {uid} > role: "admin"
```

### Paso 5: Configurar n8n (Opcional)

1. **Instalar n8n**

```bash
npm install -g n8n
```

2. **Crear flujo de trabajo**
   - Webhook Trigger → recibe pedidos
   - Function → formatea mensaje
   - WhatsApp/Email → envía notificación

3. **Copiar URL del webhook**
   - Pégala en `firebase-config.js`:

```javascript
const N8N_WEBHOOK_URL = "https://tu-n8n-instance.com/webhook/nuevo-pedido";
```

### Paso 6: Probar Localmente

```bash
# Iniciar servidor local
firebase serve

# O usar Live Server de VS Code
# Click derecho en index.html > Open with Live Server
```

Abre: `http://localhost:5000`

---

## 🌐 Desplegar a Producción

### Desplegar con Firebase Hosting

```bash
# Desplegar todo
firebase deploy

# O desplegar solo hosting
firebase deploy --only hosting
```

Tu sitio estará disponible en:
```
https://tu-proyecto.web.app
https://tu-proyecto.firebaseapp.com
```

### Configurar Dominio Personalizado (Opcional)

1. Ve a Firebase Console > Hosting
2. Haz clic en "Agregar dominio personalizado"
3. Sigue las instrucciones para configurar DNS

---

## 📱 Uso del Sistema

### Para Clientes

1. **Explorar el catálogo**
   - Navega por los productos disponibles
   - Haz clic en "🎨 Personalizar" en Mini Donas

2. **Personalizar Mini Donas**
   - Selecciona sabor (Vainilla / Frutos Rojos)
   - Elige cantidad (1, 2, 3, 4 o 9 unidades)
   - Escoge glaseado
   - Selecciona topping favorito
   - Haz clic en "Agregar al Carrito"

3. **Gestionar carrito**
   - Ver productos agregados
   - Eliminar productos individuales
   - Vaciar carrito completo

4. **Finalizar pedido**
   - Haz clic en "Finalizar Pedido"
   - Ingresa nombre, teléfono y dirección
   - Confirma el pedido
   - Recibe resumen de tu pedido

### Para Administradores

1. **Acceder al panel**
   - Visita: `https://tu-sitio.web.app/admin.html`
   - Inicia sesión con tu email y contraseña

2. **Gestionar pedidos**
   - Ver todos los pedidos en la tabla
   - Filtrar por estado, fecha o búsqueda
   - Ver detalle completo de cada pedido
   - Cambiar estado (pendiente, procesando, enviado, entregado, cancelado)

3. **Ver estadísticas**
   - Total de pedidos
   - Pedidos pendientes
   - Pedidos entregados
   - Ventas totales

---

## 🔧 Personalización

### Agregar Más Productos

Edita `js/app.js`:

```javascript
const productos = [
  {
    id: 203,
    tipo: 'ancheta',
    nombre: 'Nueva Ancheta',
    precio: 40000,
    descripcion: 'Descripción del producto',
    emoji: '🎁',
    personalizable: false
  },
  // ... más productos
];
```

### Modificar Precios de Mini Donas

En `js/app.js`, sección `cantidadesDonas`:

```javascript
const cantidadesDonas = [
  { id: 1, cantidad: 1, nombre: '1 unidad', precio: 3000, emoji: '🍩' },
  // Modifica los precios aquí
];
```

### Cambiar Colores del Diseño

Edita las variables CSS en `css/style.css`:

```css
:root {
  --color-primary: #TU_COLOR;
  --color-secondary: #TU_COLOR;
  /* ... más variables */
}
```

---

## 🤖 Configuración de n8n

### Flujo de Trabajo Sugerido

1. **Webhook** - Recibe pedidos desde la app
2. **Function** - Procesa y formatea datos
3. **WhatsApp Business Cloud API** - Envía notificación
4. **Email** - Envía copia por correo

### Ejemplo de Payload

```json
{
  "pedidoId": "1234567890",
  "fecha": "2025-10-15T10:30:00Z",
  "cliente": {
    "nombre": "Juan Pérez",
    "telefono": "+573001234567",
    "direccion": "Calle 123 #45-67"
  },
  "productos": [
    {
      "nombre": "Mini Donas Vainilla",
      "precio": 6500,
      "cantidad": 3
    }
  ],
  "total": 6500
}
```

---

## 📊 Reglas de Seguridad de Firestore

Las reglas configuradas permiten:

- ✅ Cualquiera puede crear pedidos (usuarios invitados)
- ✅ Usuarios autenticados pueden ver sus propios pedidos
- ✅ Solo admins pueden ver todos los pedidos
- ✅ Solo admins pueden actualizar/eliminar pedidos
- ✅ Todos pueden leer productos
- ✅ Solo admins pueden crear/editar productos

---

## 🚨 Solución de Problemas

### Firebase no se inicializa

```
⚠️ Firebase config no encontrada. Usando modo localStorage.
```

**Solución**: Verifica que `firebase-config.js` tenga la configuración correcta.

### Error de permisos en Firestore

```
Missing or insufficient permissions
```

**Solución**: Verifica que las reglas de Firestore estén desplegadas:
```bash
firebase deploy --only firestore:rules
```

### Panel de admin no carga pedidos

**Solución**: 
1. Verifica que estés autenticado
2. Comprueba que el usuario tenga rol "admin" en Firestore
3. Revisa la consola del navegador para errores

---

## 📈 Cronograma de Desarrollo

| Fase | Actividad | Duración | Estado |
|------|-----------|----------|--------|
| 1 | Diseño de interfaz y estructura | 1 semana | ✅ Completado |
| 2 | Configuración de Firebase y BD | 1 semana | ✅ Completado |
| 3 | Desarrollo del carrito y flujo | 2 semanas | ✅ Completado |
| 4 | Integración con n8n y notificaciones | 1 semana | ✅ Completado |
| 5 | Pruebas, ajustes y despliegue | 1 semana | ⏳ En progreso |

---

## 🔮 Próximas Mejoras

- [ ] Imágenes reales de productos
- [ ] Integración con pasarela de pagos
- [ ] Sistema de cupones y descuentos
- [ ] Chat en vivo con clientes
- [ ] App móvil (React Native / Flutter)
- [ ] Sistema de reseñas y calificaciones
- [ ] Programa de fidelización
- [ ] Multi-idioma (ES/EN)

---

## 🤝 Contribuir

¡Las contribuciones son bienvenidas!

1. Fork del repositorio
2. Crea una rama (`git checkout -b feature/nueva-funcionalidad`)
3. Commit de cambios (`git commit -m 'Agregar nueva funcionalidad'`)
4. Push a la rama (`git push origin feature/nueva-funcionalidad`)
5. Abre un Pull Request

---

## 📄 Licencia

Este proyecto está bajo la Licencia MIT. Consulta el archivo `LICENSE` para más detalles.

---

## 👥 Autor

**Emprendimiento "Lo Quiero YA CM"**

- 🌐 Sitio Web: [loquieroyacm.web.app](https://loquieroyacm.web.app/)
- 📧 Email: info@loquieroyacm.com
- 📱 WhatsApp: +57 XXX XXX XXXX
- 📷 Instagram: [@loquieroyacm](https://instagram.com/loquieroyacm)
- 📘 Facebook: [Lo Quiero YA CM](https://facebook.com/loquieroyacm)

---

## 💖 Agradecimientos

Gracias por elegir **Lo Quiero YA CM** para tus momentos dulces.

<div align="center">
  <h3>🍩 #AntójateDeFelicidad 🍩</h3>
  <p><em>Hecho con 💖 y mucha azúcar</em></p>
  <p>© 2025 Lo Quiero YA CM. Todos los derechos reservados.</p>
</div>

---

## 📞 Soporte

¿Tienes preguntas o problemas?

- 📧 Email: soporte@loquieroyacm.com
- 💬 WhatsApp: +57 XXX XXX XXXX
- 🐛 Reporta bugs en [Issues](https://github.com/tu-usuario/loquieroya_cm/issues)

---

### ⭐ Si te gusta el proyecto, ¡dale una estrella en GitHub!

```
⭐ Star this repository
```

---

## 📚 Documentación Adicional

- [Firebase Documentation](https://firebase.google.com/docs)
- [n8n Documentation](https://docs.n8n.io/)
- [Guía de Firestore Security Rules](https://firebase.google.com/docs/firestore/security/get-started)
- [WhatsApp Business Cloud API](https://developers.facebook.com/docs/whatsapp)
