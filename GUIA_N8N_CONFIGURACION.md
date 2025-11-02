# 🚀 Guía de Configuración n8n - Lo Quiero YA CM

## 📋 Pasos para Configurar Notificaciones

### 1. Acceder a n8n
- **URL:** http://localhost:5679
- **Usuario:** admin
- **Password:** admin123

### 2. Importar Workflow
1. Ve a **Workflows** → **Import from file**
2. Selecciona el archivo `n8n-workflow-pedidos.json`
3. Haz clic en **Import**

### 3. Configurar Email (SMTP)
1. Ve a **Settings** → **Credentials**
2. Crea una nueva credencial **SMTP**
3. Configura:
   - **Host:** smtp.gmail.com
   - **Port:** 587
   - **User:** tu-email@gmail.com
   - **Password:** tu-password-de-aplicacion

### 4. Configurar Telegram (Opcional)
1. Crea un bot en @BotFather
2. Obtén el token del bot
3. Obtén tu chat ID
4. Configura las variables:
   - `TELEGRAM_BOT_TOKEN`
   - `TELEGRAM_CHAT_ID`

### 5. Activar el Workflow
1. Ve al workflow importado
2. Haz clic en **Activate**
3. Copia la URL del webhook

### 6. Probar el Sistema
1. Ve a tu sitio web: https://loquieroya-cm.web.app
2. Haz un pedido de prueba
3. Verifica que llegue la notificación

## 🔧 URLs Importantes

- **n8n:** http://localhost:5679
- **Webhook:** http://localhost:5679/webhook/nuevo-pedido
- **Sitio Web:** https://loquieroya-cm.web.app
- **Panel Admin:** https://loquieroya-cm.web.app/admin.html

## 📱 Notificaciones Configuradas

✅ **Email:** Notificación por correo electrónico
✅ **Telegram:** Notificación por Telegram (opcional)
✅ **Webhook Response:** Confirmación al sitio web

## 🎯 Próximos Pasos

1. Configurar WhatsApp Business API (opcional)
2. Agregar más tipos de notificaciones
3. Configurar alertas por estado de pedido
4. Integrar con sistemas de inventario

## 🆘 Solución de Problemas

### Error 401 en Login
- Verifica que n8n esté ejecutándose
- Usa las credenciales: admin / admin123

### Puerto Ocupado
- Usa un puerto diferente: `n8n start --port 5679`
- O termina procesos: `taskkill /f /im node.exe`

### Webhook No Funciona
- Verifica que el workflow esté activo
- Revisa la URL del webhook
- Comprueba los logs de n8n
