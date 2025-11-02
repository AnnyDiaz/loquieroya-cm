/* ============================================
   🔥 Firebase Configuration
   Lo Quiero YA CM
   ============================================ */

// INSTRUCCIONES:
// 1. Ve a https://console.firebase.google.com/
// 2. Crea un nuevo proyecto o selecciona uno existente
// 3. En la configuración del proyecto, copia tu configuración
// 4. Reemplaza los valores de "YOUR_XXX" con tus datos reales

const firebaseConfig = {
  apiKey: "AIzaSyBRG3qIBSDgX5oVNF0ebcuXPWTHKna-844",
  authDomain: "loquieroya-cm.firebaseapp.com",
  projectId: "loquieroya-cm",
  storageBucket: "loquieroya-cm.firebasestorage.app",
  messagingSenderId: "623540108241",
  appId: "1:623540108241:web:7230ee60930ac258753ef0",
  measurementId: "G-TSS9LD7GXT"
};

// URL del webhook de n8n para notificaciones
// Configura tu flujo en n8n y copia el webhook URL aquí
const N8N_WEBHOOK_URL = "http://localhost:5678/webhook/nuevo-pedido";

// Configuración de WhatsApp Cloud API (opcional)
const WHATSAPP_CONFIG = {
  phoneNumberId: "YOUR_PHONE_NUMBER_ID",
  accessToken: "YOUR_ACCESS_TOKEN",
  businessPhoneNumber: "+57XXXXXXXXXX" // Tu número de WhatsApp Business
};

// Exportar configuraciones
if (typeof module !== 'undefined' && module.exports) {
  module.exports = { firebaseConfig, N8N_WEBHOOK_URL, WHATSAPP_CONFIG };
}

