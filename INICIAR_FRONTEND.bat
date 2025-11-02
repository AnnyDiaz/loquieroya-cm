@echo off
title Frontend - Lo Quiero YA CM
color 0B
echo ========================================
echo   FRONTEND
echo   Lo Quiero YA CM
echo ========================================
echo.
echo [+] Iniciando servidor en puerto 5500...
echo.

cd public
python -m http.server 5500

echo.
echo ========================================
echo   Servidor detenido
echo ========================================
pause

