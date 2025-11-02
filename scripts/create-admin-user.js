#!/usr/bin/env node

/* ============================================
   🔐 Crear Usuario Admin - Lo Quiero YA CM
   Script para crear usuario administrador
   ============================================ */

const readline = require('readline');

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

function question(query) {
  return new Promise(resolve => rl.question(query, resolve));
}

async function main() {
  console.log('╔════════════════════════════════════════════╗');
  console.log('║   🔐 Crear Usuario Administrador          ║');
  console.log('║   Lo Quiero YA CM                         ║');
  console.log('╚════════════════════════════════════════════╝\n');

  console.log('⚠️  IMPORTANTE:');
  console.log('Este script genera las instrucciones para crear un usuario admin.');
  console.log('Debes ejecutar estos pasos en Firebase Console.\n');

  const email = await question('📧 Email del administrador: ');
  const password = await question('🔑 Contraseña (mínimo 6 caracteres): ');

  if (password.length < 6) {
    console.log('\n❌ Error: La contraseña debe tener al menos 6 caracteres');
    rl.close();
    return;
  }

  console.log('\n✅ Credenciales configuradas:\n');
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
  console.log(`📧 Email:    ${email}`);
  console.log(`🔑 Password: ${password}`);
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');

  console.log('📝 PASOS PARA CREAR EL USUARIO:\n');
  console.log('1. Abre Firebase Console:');
  console.log('   🔗 https://console.firebase.google.com/project/loquieroya-cm/authentication/users\n');

  console.log('2. Habilita Email/Password (si no está habilitado):');
  console.log('   - Ve a la pestaña "Sign-in method"');
  console.log('   - Habilita "Email/Password"');
  console.log('   - Guarda los cambios\n');

  console.log('3. Agrega el usuario:');
  console.log('   - Ve a la pestaña "Users"');
  console.log('   - Haz clic en "Add user"');
  console.log(`   - Email: ${email}`);
  console.log(`   - Password: ${password}`);
  console.log('   - Haz clic en "Add user"\n');

  console.log('4. Inicia sesión en el panel admin:');
  console.log('   🔗 https://loquieroya-cm.web.app/admin.html');
  console.log(`   📧 Email: ${email}`);
  console.log(`   🔑 Password: ${password}\n`);

  console.log('✅ ¡Listo! Después de seguir estos pasos podrás acceder.\n');

  // Guardar credenciales
  const fs = require('fs');
  const credentials = {
    email,
    password,
    createdAt: new Date().toISOString(),
    note: 'Credenciales de administrador - Mantener seguras'
  };

  try {
    fs.writeFileSync(
      'admin-credentials.json',
      JSON.stringify(credentials, null, 2)
    );
    console.log('💾 Credenciales guardadas en: admin-credentials.json');
    console.log('⚠️  IMPORTANTE: Agrega este archivo a .gitignore\n');
  } catch (error) {
    console.log('⚠️  No se pudieron guardar las credenciales automáticamente');
  }

  rl.close();
}

main().catch(error => {
  console.error('❌ Error:', error);
  rl.close();
  process.exit(1);
});

