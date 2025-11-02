# 💻 Comandos para Windows PowerShell

## Lo Quiero YA CM - Guía para Windows

Esta guía está diseñada específicamente para Windows PowerShell.

---

## 🚀 Instalación Inicial

### Verificar Node.js

```powershell
node --version
npm --version
```

Si no tienes Node.js, descárgalo de: https://nodejs.org/

### Instalar Firebase Tools

```powershell
npm install -g firebase-tools
```

### Verificar Instalación

```powershell
firebase --version
```

---

## 🔑 Login y Configuración

### Login en Firebase

```powershell
firebase login
```

### Ver usuario actual

```powershell
firebase login:list
```

### Logout

```powershell
firebase logout
```

---

## 📁 Navegación en el Proyecto

### Ir al directorio del proyecto

```powershell
cd C:\Users\ANNY\loquieroya_cm
```

### Ver contenido del directorio

```powershell
Get-ChildItem
# O simplemente:
dir
```

### Ver contenido de un archivo

```powershell
Get-Content firebase-config.js
# O:
cat firebase-config.js
```

---

## 🔥 Comandos Firebase

### Ver proyectos disponibles

```powershell
firebase projects:list
```

### Seleccionar proyecto

```powershell
firebase use loquieroya-cm
```

### Ver proyecto actual

```powershell
firebase use
```

### Desplegar todo

```powershell
firebase deploy
```

### Desplegar solo hosting

```powershell
firebase deploy --only hosting
```

### Desplegar solo reglas de Firestore

```powershell
firebase deploy --only firestore:rules
```

### Desplegar solo índices

```powershell
firebase deploy --only firestore:indexes
```

---

## 💻 Servidor Local

### Iniciar servidor Firebase

```powershell
firebase serve
```

### Iniciar solo hosting

```powershell
firebase serve --only hosting
```

### Servidor en puerto específico

```powershell
firebase serve --port 8080
```

### Detener servidor

Presiona: `Ctrl + C`

---

## 📝 Editar Archivos

### Abrir archivo en VS Code

```powershell
code firebase-config.js
```

### Abrir proyecto completo en VS Code

```powershell
code .
```

### Abrir en Notepad

```powershell
notepad firebase-config.js
```

---

## 🔍 Verificación

### Ver logs de Firebase

```powershell
firebase functions:log
```

### Abrir Firebase Console en navegador

```powershell
firebase open
```

### Ver información del proyecto

```powershell
firebase projects:list
```

---

## 📦 Git (Control de Versiones)

### Inicializar repositorio

```powershell
git init
```

### Ver estado

```powershell
git status
```

### Agregar archivos

```powershell
git add .
```

### Hacer commit

```powershell
git commit -m "Primer commit - Configuración inicial"
```

### Ver historial

```powershell
git log
```

### Agregar repositorio remoto

```powershell
git remote add origin https://github.com/tu-usuario/loquieroya_cm.git
```

### Subir a GitHub

```powershell
git push -u origin main
```

---

## 🛠️ Solución de Problemas en Windows

### Error: "no se reconoce como comando"

Si ves este error con `firebase` o `npm`:

```powershell
# Reinicia PowerShell como Administrador
# O agrega al PATH manualmente
$env:Path += ";C:\Users\ANNY\AppData\Roaming\npm"
```

### Error: "scripts están deshabilitados"

```powershell
# Ejecuta como Administrador:
Set-ExecutionPolicy -ExecutionPolicy RemoteSigned -Scope CurrentUser
```

### Limpiar caché de npm

```powershell
npm cache clean --force
```

### Reinstalar Firebase Tools

```powershell
npm uninstall -g firebase-tools
npm install -g firebase-tools
```

---

## 📋 Atajos de Teclado en PowerShell

- `Ctrl + C` - Detener proceso
- `Tab` - Autocompletar
- `↑` / `↓` - Navegar historial de comandos
- `Ctrl + L` - Limpiar pantalla
- `Ctrl + V` - Pegar
- `Ctrl + R` - Buscar en historial

---

## 🎯 Script de Verificación Rápida

Guarda esto como `verificar.ps1`:

```powershell
Write-Host "🔍 Verificando configuración..." -ForegroundColor Cyan

# Verificar Node.js
Write-Host "`n📦 Node.js:" -ForegroundColor Yellow
node --version

# Verificar npm
Write-Host "`n📦 npm:" -ForegroundColor Yellow
npm --version

# Verificar Firebase
Write-Host "`n🔥 Firebase:" -ForegroundColor Yellow
firebase --version

# Verificar login
Write-Host "`n🔑 Firebase Login:" -ForegroundColor Yellow
firebase login:list

# Verificar proyecto
Write-Host "`n📁 Proyecto actual:" -ForegroundColor Yellow
firebase use

# Verificar archivos
Write-Host "`n📄 Archivos principales:" -ForegroundColor Yellow
$archivos = @(
    "index.html",
    "admin.html",
    "firebase-config.js",
    "package.json"
)

foreach ($archivo in $archivos) {
    if (Test-Path $archivo) {
        Write-Host "✅ $archivo" -ForegroundColor Green
    } else {
        Write-Host "❌ $archivo (no encontrado)" -ForegroundColor Red
    }
}

Write-Host "`n✨ Verificación completa!" -ForegroundColor Cyan
```

Ejecuta con:

```powershell
.\verificar.ps1
```

---

## 🚀 Script de Despliegue Rápido

Guarda esto como `desplegar.ps1`:

```powershell
Write-Host "🚀 Desplegando Lo Quiero YA CM..." -ForegroundColor Cyan

# Verificar cambios
Write-Host "`n📋 Estado de Git:" -ForegroundColor Yellow
git status

# Confirmar despliegue
$respuesta = Read-Host "`n¿Continuar con el despliegue? (S/N)"

if ($respuesta -eq "S" -or $respuesta -eq "s") {
    Write-Host "`n🔥 Desplegando a Firebase..." -ForegroundColor Green
    firebase deploy
    
    Write-Host "`n✅ ¡Despliegue completado!" -ForegroundColor Green
    Write-Host "🌐 Tu sitio está en línea" -ForegroundColor Cyan
    
    # Abrir en navegador
    $abrir = Read-Host "`n¿Abrir sitio en navegador? (S/N)"
    if ($abrir -eq "S" -or $abrir -eq "s") {
        firebase open hosting:site
    }
} else {
    Write-Host "`n❌ Despliegue cancelado" -ForegroundColor Red
}
```

Ejecuta con:

```powershell
.\desplegar.ps1
```

---

## 🎨 Personalizar PowerShell (Opcional)

### Agregar alias útiles

Abre tu perfil de PowerShell:

```powershell
notepad $PROFILE
```

Agrega estos alias:

```powershell
# Alias para Firebase
function fb { firebase $args }
function fbd { firebase deploy }
function fbs { firebase serve }

# Alias para Git
function gs { git status }
function ga { git add . }
function gc { param($m) git commit -m $m }
function gp { git push }

# Alias para navegación
function ll { Get-ChildItem }

Write-Host "🍩 Lo Quiero YA CM - PowerShell personalizado cargado" -ForegroundColor Magenta
```

Recarga el perfil:

```powershell
. $PROFILE
```

Ahora puedes usar:

```powershell
fb use loquieroya-cm
fbs           # En lugar de firebase serve
fbd           # En lugar de firebase deploy
gs            # En lugar de git status
```

---

## 📊 Monitoreo en Tiempo Real

### Ver logs de Firestore

```powershell
# En PowerShell, abre Firebase Console
firebase open firestore
```

### Ver usuarios de Authentication

```powershell
firebase open auth
```

### Ver estadísticas de Hosting

```powershell
firebase open hosting
```

---

## 🔄 Actualización y Mantenimiento

### Actualizar Firebase Tools

```powershell
npm update -g firebase-tools
```

### Ver versión instalada vs. disponible

```powershell
npm outdated -g firebase-tools
```

### Limpiar y reinstalar todo

```powershell
# Eliminar node_modules (si existe)
Remove-Item -Recurse -Force node_modules

# Limpiar caché
npm cache clean --force

# Reinstalar
npm install
```

---

## 🎯 Comandos Combinados Útiles

### Verificar, hacer commit y desplegar

```powershell
git status; git add .; git commit -m "Update"; git push; firebase deploy
```

### Abrir múltiples cosas

```powershell
code .; firebase open; firebase serve
```

### Ver logs mientras sirves localmente

```powershell
# En una ventana:
firebase serve

# En otra ventana PowerShell:
firebase functions:log
```

---

## 🆘 Comandos de Emergencia

### Si algo no funciona, reinicia todo

```powershell
# Cerrar todos los procesos de Node
Stop-Process -Name node -Force

# Limpiar caché
npm cache clean --force

# Logout y login de nuevo
firebase logout
firebase login

# Reinstalar Firebase Tools
npm uninstall -g firebase-tools
npm install -g firebase-tools
```

### Resetear Firebase local

```powershell
# Eliminar carpeta .firebase (si existe)
Remove-Item -Recurse -Force .firebase

# Volver a inicializar
firebase init
```

---

## 📱 Abrir Sitio en Navegador

### Sitio local

```powershell
Start-Process "http://localhost:5000"
```

### Sitio en producción

```powershell
Start-Process "https://tu-proyecto.web.app"
```

### Panel de admin

```powershell
Start-Process "http://localhost:5000/admin.html"
```

---

## 💡 Tips para Windows

1. **Usa Tab** para autocompletar nombres de archivos y carpetas
2. **Ctrl + R** para buscar comandos anteriores
3. **Ejecuta como Administrador** si tienes problemas de permisos
4. **Windows Terminal** es mejor que PowerShell normal (descárgalo de Microsoft Store)
5. **Git Bash** es una alternativa si prefieres comandos tipo Linux

---

## 🔗 Enlaces Útiles

- [Windows Terminal](https://aka.ms/terminal)
- [Git para Windows](https://git-scm.com/download/win)
- [Node.js para Windows](https://nodejs.org/)
- [VS Code](https://code.visualstudio.com/)

---

## ✅ Checklist Post-Instalación

Ejecuta estos comandos para verificar que todo funcione:

```powershell
# 1. Verificar herramientas
node --version
npm --version
firebase --version
git --version

# 2. Verificar login
firebase login:list

# 3. Verificar proyecto
cd C:\Users\ANNY\loquieroya_cm
firebase use

# 4. Ver archivos
dir

# 5. Probar localmente
firebase serve
```

Si todos estos comandos funcionan, ¡estás listo! 🎉

---

<div align="center">
  <h3>🍩 #AntójateDeFelicidad 🍩</h3>
  <p>© 2025 Lo Quiero YA CM</p>
</div>

