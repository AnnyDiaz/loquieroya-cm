@echo off
echo ========================================
echo   Lo Quiero YA CM - Sistema de Productos
echo ========================================
echo.

REM Verificar si existe el entorno virtual
if not exist "backend\venv" (
    echo [!] No se encontro el entorno virtual
    echo [+] Creando entorno virtual...
    cd backend
    python -m venv venv
    echo [+] Instalando dependencias...
    call venv\Scripts\activate
    pip install -r requirements.txt
    cd ..
    echo [OK] Entorno virtual creado e instalado
    echo.
)

echo [+] Iniciando backend FastAPI...
start cmd /k "cd backend && venv\Scripts\activate && python main.py"

timeout /t 3 /nobreak >nul

echo [+] Iniciando frontend...
start cmd /k "cd public && python -m http.server 5500"

timeout /t 2 /nobreak >nul

echo.
echo ========================================
echo   Sistema iniciado correctamente!
echo ========================================
echo.
echo Backend API:  http://localhost:8000
echo API Docs:     http://localhost:8000/docs
echo Frontend:     http://localhost:5500
echo Admin Panel:  http://localhost:5500/admin.html
echo.
echo Credenciales Admin:
echo Email:    admin@loquieroyacm.com
echo Password: admin123
echo.
echo ========================================
echo.
echo Presiona Ctrl+C en cada ventana para detener los servidores
pause

