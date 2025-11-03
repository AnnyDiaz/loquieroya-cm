"""
Aplicación principal FastAPI
"""
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from contextlib import asynccontextmanager
import os
from dotenv import load_dotenv

from database import init_db
from routes import productos, auth

load_dotenv()


@asynccontextmanager
async def lifespan(app: FastAPI):
    """
    Ciclo de vida de la aplicación
    """
    # Startup
    print("🚀 Iniciando aplicación...")
    
    # Inicializar usuarios admin
    from auth import init_admin_users
    init_admin_users()
    
    await init_db()
    print("✅ Base de datos inicializada")
    
    # Crear directorio media si no existe
    media_path = os.getenv("MEDIA_PATH", "./media")
    os.makedirs(media_path, exist_ok=True)
    print(f"✅ Directorio media creado: {media_path}")
    
    yield
    
    # Shutdown
    print("👋 Cerrando aplicación...")


# Crear aplicación
app = FastAPI(
    title="Lo Quiero YA CM - API",
    description="API para gestión de productos con múltiples imágenes",
    version="1.0.0",
    lifespan=lifespan
)

# Configurar CORS - Permitir Firebase Hosting
allowed_origins = [
    "https://loquieroya-cm.web.app",
    "https://loquieroya-cm.firebaseapp.com",
    "http://localhost:5500",
    "http://localhost:5000",
    "http://127.0.0.1:5500"
]

# Agregar orígenes adicionales desde variable de entorno
allowed_origins_env = os.getenv("ALLOWED_ORIGINS", "")
if allowed_origins_env:
    extra_origins = [origin.strip() for origin in allowed_origins_env.split(",") if origin.strip()]
    allowed_origins.extend(extra_origins)

# Eliminar duplicados
allowed_origins = list(set(allowed_origins))

print(f"🔒 CORS configurado para: {allowed_origins}")

app.add_middleware(
    CORSMiddleware,
    allow_origins=allowed_origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
    expose_headers=["*"]
)

# Montar directorio de archivos estáticos (crear si no existe)
media_path = os.getenv("MEDIA_PATH", "./media")
os.makedirs(media_path, exist_ok=True)  # Crear directorio antes de montar
app.mount("/media", StaticFiles(directory=media_path), name="media")

# Registrar rutas
app.include_router(auth.router)
app.include_router(productos.router)


@app.get("/")
async def root():
    """
    Endpoint raíz
    """
    return {
        "message": "🍩 Lo Quiero YA CM - API",
        "version": "1.0.0",
        "docs": "/docs",
        "redoc": "/redoc"
    }


@app.get("/health")
async def health_check():
    """
    Health check
    """
    return {"status": "ok"}


if __name__ == "__main__":
    import uvicorn
    uvicorn.run(
        "main:app",
        host="0.0.0.0",
        port=8000,
        reload=True
    )

