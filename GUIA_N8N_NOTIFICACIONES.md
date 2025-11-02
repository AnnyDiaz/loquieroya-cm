# 🤖 Guía de Implementación n8n + Notificaciones

## Lo Quiero YA CM - Sistema de Notificaciones Automáticas

Esta guía te ayudará a configurar el sistema de automatización con n8n para recibir notificaciones automáticas cuando los clientes realicen pedidos.

---

## 📋 Índice

1. [Instalación de n8n](#instalación-de-n8n)
2. [Configuración del Webhook](#configuración-del-webhook)
3. [Integración con WhatsApp](#integración-con-whatsapp)
4. [Integración con Email](#integración-con-email)
5. [Flujo Completo](#flujo-completo)
6. [Ejemplos de Código](#ejemplos-de-código)

---

## 🚀 Instalación de n8n

### Opción 1: Instalación Local

```bash
# Con npm
npm install -g n8n

# Iniciar n8n
n8n start

# n8n estará disponible en http://localhost:5678
```

### Opción 2: Docker

```bash
docker run -it --rm \
  --name n8n \
  -p 5678:5678 \
  -v ~/.n8n:/home/node/.n8n \
  n8nio/n8n
```

### Opción 3: n8n Cloud

1. Visita: https://n8n.io/cloud
2. Crea una cuenta gratuita
3. No requiere instalación

---

## 🔗 Configuración del Webhook

### Paso 1: Crear Flujo de Trabajo (Workflow)

1. Abre n8n (http://localhost:5678)
2. Haz clic en "New Workflow"
3. Nombra el flujo: "Notificaciones Pedidos Lo Quiero YA"

### Paso 2: Agregar Nodo Webhook

1. Haz clic en el botón "+" para agregar un nodo
2. Busca "Webhook"
3. Selecciona "Webhook"
4. Configuración:
   - **HTTP Method**: POST
   - **Path**: `nuevo-pedido`
   - **Respond**: Immediately
   - **Response Code**: 200

5. Copia la URL del webhook. Se verá así:
```
http://localhost:5678/webhook/nuevo-pedido
# o en n8n Cloud:
https://tu-cuenta.app.n8n.cloud/webhook/nuevo-pedido
```

### Paso 3: Configurar en el Proyecto

Abre `firebase-config.js` y pega la URL:

```javascript
const N8N_WEBHOOK_URL = "https://tu-cuenta.app.n8n.cloud/webhook/nuevo-pedido";
```

---

## 📱 Integración con WhatsApp

### Opción A: WhatsApp Business Cloud API (Oficial)

#### 1. Crear App en Meta Developers

1. Ve a: https://developers.facebook.com/
2. Crea una nueva app
3. Selecciona "Business" como tipo
4. Agrega el producto "WhatsApp"

#### 2. Configurar WhatsApp Business

1. En el panel de WhatsApp:
   - Crea un número de teléfono de prueba
   - O conecta tu número de WhatsApp Business

2. Obtén las credenciales:
   - **Phone Number ID**
   - **Access Token**
   - **WhatsApp Business Account ID**

#### 3. Configurar en firebase-config.js

```javascript
const WHATSAPP_CONFIG = {
  phoneNumberId: "TU_PHONE_NUMBER_ID",
  accessToken: "TU_ACCESS_TOKEN",
  businessPhoneNumber: "+573XXXXXXXXX" // Tu número de WhatsApp Business
};
```

#### 4. Crear Nodo en n8n

1. Agrega un nodo "HTTP Request"
2. Configuración:
   - **Method**: POST
   - **URL**: `https://graph.facebook.com/v17.0/{{$json.phoneNumberId}}/messages`
   - **Authentication**: Generic Credential Type
   - **Send Headers**: ON
   - Headers:
     - `Authorization`: `Bearer TU_ACCESS_TOKEN`
     - `Content-Type`: `application/json`

3. Body (JSON):

```json
{
  "messaging_product": "whatsapp",
  "to": "573XXXXXXXXX",
  "type": "text",
  "text": {
    "body": "🍩 *NUEVO PEDIDO - Lo Quiero YA CM*\n\n📋 ID: #{{$json.pedidoId}}\n\n👤 Cliente: {{$json.cliente.nombre}}\n📱 Teléfono: {{$json.cliente.telefono}}\n📍 Dirección: {{$json.cliente.direccion}}\n\n💰 Total: ${{$json.total}}\n\n✨ #AntójateDeFelicidad"
  }
}
```

### Opción B: WhatsApp Web API (No Oficial - Más Fácil)

Usa bibliotecas como:
- **whatsapp-web.js**
- **Baileys**
- **WAHA (WhatsApp HTTP API)**

#### Ejemplo con WAHA:

1. Instala WAHA:
```bash
docker run -it --rm -p 3000:3000/tcp devlikeapro/waha
```

2. En n8n, agrega nodo "HTTP Request":
   - **URL**: `http://localhost:3000/api/sendText`
   - **Method**: POST
   - **Body**:

```json
{
  "session": "default",
  "chatId": "573XXXXXXXXX@c.us",
  "text": "🍩 *NUEVO PEDIDO*\n\n📋 ID: #{{$json.pedidoId}}\n👤 Cliente: {{$json.cliente.nombre}}\n💰 Total: ${{$json.total}}"
}
```

---

## 📧 Integración con Email

### Opción 1: Gmail (Recomendado)

#### 1. Configurar Gmail

1. Ve a tu cuenta de Google
2. Activa "Verificación en 2 pasos"
3. Genera una "Contraseña de aplicación":
   - Cuenta de Google > Seguridad > Contraseñas de aplicaciones
   - Selecciona "Correo" y "Otro dispositivo"
   - Copia la contraseña generada

#### 2. Configurar en n8n

1. Agrega nodo "Gmail"
2. Conecta tu cuenta (usa la contraseña de aplicación)
3. Configuración:
   - **To**: `tu-email@gmail.com`
   - **Subject**: `🍩 Nuevo Pedido #{{$json.pedidoId}} - Lo Quiero YA CM`
   - **Email Type**: Text
   - **Message**:

```
NUEVO PEDIDO RECIBIDO
━━━━━━━━━━━━━━━━━━━━━━

📋 INFORMACIÓN DEL PEDIDO
ID: #{{$json.pedidoId}}
Fecha: {{$json.fecha}}
Estado: Pendiente

👤 DATOS DEL CLIENTE
Nombre: {{$json.cliente.nombre}}
Teléfono: {{$json.cliente.telefono}}
Dirección: {{$json.cliente.direccion}}

🛒 PRODUCTOS
{{$json.productos}}

💰 TOTAL: ${{$json.total}}

━━━━━━━━━━━━━━━━━━━━━━
🍩 Lo Quiero YA CM
#AntójateDeFelicidad
```

### Opción 2: SendGrid / Mailgun

1. Crea cuenta en SendGrid (https://sendgrid.com/)
2. Obtén API Key
3. En n8n, usa nodo "HTTP Request":

```json
{
  "personalizations": [{
    "to": [{"email": "tu-email@ejemplo.com"}]
  }],
  "from": {"email": "pedidos@loquieroyacm.com"},
  "subject": "🍩 Nuevo Pedido #{{$json.pedidoId}}",
  "content": [{
    "type": "text/plain",
    "value": "Nuevo pedido recibido..."
  }]
}
```

---

## 🔄 Flujo Completo en n8n

### Diagrama del Flujo

```
[Webhook] → [Function: Procesar Datos] → [Split: Dual]
                                              ├── [WhatsApp]
                                              └── [Email]
```

### Paso a Paso

#### 1. Nodo Webhook (ya configurado)

#### 2. Nodo Function - Procesar Datos

```javascript
// Formatear datos del pedido
const pedido = items[0].json;

// Formatear productos
let productosTexto = '';
pedido.productos.forEach((producto, index) => {
  productosTexto += `${index + 1}. ${producto.emoji} ${producto.nombre}\n`;
  if (producto.descripcion) {
    productosTexto += `   ${producto.descripcion}\n`;
  }
  productosTexto += `   $${producto.precio.toLocaleString('es-CO')}\n\n`;
});

// Formatear fecha
const fecha = new Date(pedido.fecha);
const fechaFormateada = fecha.toLocaleString('es-CO', {
  year: 'numeric',
  month: 'long',
  day: 'numeric',
  hour: '2-digit',
  minute: '2-digit'
});

return {
  pedidoId: pedido.pedidoId,
  fecha: fechaFormateada,
  cliente: pedido.cliente,
  productos: pedido.productos,
  productosTexto: productosTexto,
  total: pedido.total,
  totalFormateado: pedido.total.toLocaleString('es-CO')
};
```

#### 3. Conectar a WhatsApp y Email en paralelo

Los nodos se ejecutarán simultáneamente.

---

## 📱 Ejemplo Completo de Mensaje WhatsApp

```
🍩 *¡NUEVO PEDIDO RECIBIDO!*
━━━━━━━━━━━━━━━━━━━━━━

📋 *Pedido* #1234567

📅 *Fecha*
15 de octubre de 2025, 10:30 AM

━━━━━━━━━━━━━━━━━━━━━━

👤 *CLIENTE*
• Nombre: Juan Pérez
• Tel: +57 300 123 4567
• Dir: Calle 123 #45-67, Bogotá

━━━━━━━━━━━━━━━━━━━━━━

🛒 *PRODUCTOS*

1. 🍩 Mini Donas Vainilla
   3 unidades en caja
   Glaseado: Chocolate Blanco
   Topping: M&M
   $6,500

2. 🎁 Ancheta Dulce Especial
   $35,000

━━━━━━━━━━━━━━━━━━━━━━

💰 *TOTAL: $41,500*

━━━━━━━━━━━━━━━━━━━━━━

✨ Recuerda confirmar el pedido con el cliente

🍩 *Lo Quiero YA CM*
#AntójateDeFelicidad
```

---

## 🎨 Personalización Avanzada

### Agregar Botones de Acción (WhatsApp)

```json
{
  "messaging_product": "whatsapp",
  "to": "573XXXXXXXXX",
  "type": "interactive",
  "interactive": {
    "type": "button",
    "body": {
      "text": "Nuevo pedido recibido..."
    },
    "action": {
      "buttons": [
        {
          "type": "reply",
          "reply": {
            "id": "btn_confirmar",
            "title": "✅ Confirmar"
          }
        },
        {
          "type": "reply",
          "reply": {
            "id": "btn_rechazar",
            "title": "❌ Rechazar"
          }
        }
      ]
    }
  }
}
```

### Enviar con Template (WhatsApp)

Para mensajes más profesionales, crea templates en Meta Business Manager.

---

## 🔍 Debugging

### Ver Logs en n8n

1. Haz clic en un nodo
2. Ve a "Executions"
3. Revisa los datos de entrada/salida

### Probar el Webhook Manualmente

```bash
curl -X POST https://tu-webhook-url.com/webhook/nuevo-pedido \
  -H "Content-Type: application/json" \
  -d '{
    "pedidoId": "1234567890",
    "fecha": "2025-10-15T10:30:00Z",
    "cliente": {
      "nombre": "Test User",
      "telefono": "+573001234567",
      "direccion": "Calle Test 123"
    },
    "productos": [
      {
        "nombre": "Mini Donas",
        "precio": 6500,
        "emoji": "🍩"
      }
    ],
    "total": 6500
  }'
```

---

## ⚙️ Configuración Avanzada

### Filtrar Pedidos por Monto

```javascript
// En nodo Function
if (items[0].json.total < 10000) {
  // Solo notificar pedidos mayores a $10,000
  return [];
}
return items;
```

### Notificar a Diferentes Números según la Zona

```javascript
// En nodo Function
const direccion = items[0].json.cliente.direccion.toLowerCase();
let telefono = "573001234567"; // Por defecto

if (direccion.includes("norte")) {
  telefono = "573111111111";
} else if (direccion.includes("sur")) {
  telefono = "573222222222";
}

items[0].json.telefonoNotificacion = telefono;
return items;
```

---

## 📊 Monitoreo

### Activar Notificaciones de Error en n8n

1. En el workflow, haz clic en el icono de configuración (⚙️)
2. Ve a "Error Workflow"
3. Selecciona un workflow que maneje errores

### Crear Dashboard de Pedidos

Integra con:
- **Google Sheets** para registro automático
- **Notion** para gestión de pedidos
- **Slack** para notificaciones al equipo

---

## 🎓 Recursos Adicionales

- [Documentación de n8n](https://docs.n8n.io/)
- [WhatsApp Business API Docs](https://developers.facebook.com/docs/whatsapp)
- [SendGrid API](https://docs.sendgrid.com/)
- [Comunidad de n8n](https://community.n8n.io/)

---

## 💡 Tips y Mejores Prácticas

1. **Backup de Workflows**: Exporta tus workflows regularmente
2. **Webhooks Seguros**: Usa autenticación en tus webhooks
3. **Rate Limiting**: Configura límites para evitar spam
4. **Logs**: Guarda logs de todas las notificaciones
5. **Fallback**: Ten un plan B si n8n falla (email directo)

---

## ✅ Checklist de Implementación

- [ ] n8n instalado y funcionando
- [ ] Webhook configurado y probado
- [ ] URL del webhook en `firebase-config.js`
- [ ] WhatsApp API configurada
- [ ] Email configurado (Gmail/SendGrid)
- [ ] Flujo de n8n funcionando
- [ ] Mensaje de prueba enviado exitosamente
- [ ] Notificaciones activadas en producción

---

<div align="center">
  <h3>🍩 #AntójateDeFelicidad 🍩</h3>
  <p>© 2025 Lo Quiero YA CM</p>
</div>

