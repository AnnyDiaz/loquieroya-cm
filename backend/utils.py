"""
Utilidades para manejo de archivos y otros
"""
import os
import uuid
from pathlib import Path
from typing import List
from fastapi import UploadFile, HTTPException
from PIL import Image
import shutil

# Configuración
MEDIA_PATH = os.getenv("MEDIA_PATH", "./media")
MAX_IMAGE_SIZE_MB = int(os.getenv("MAX_IMAGE_SIZE_MB", "5"))
ALLOWED_EXTENSIONS = os.getenv("ALLOWED_IMAGE_EXTENSIONS", "jpg,jpeg,png,webp").split(",")


def ensure_media_dir(producto_id: int) -> Path:
    """
    Asegura que existe el directorio para las imágenes del producto
    """
    path = Path(MEDIA_PATH) / "productos" / str(producto_id)
    path.mkdir(parents=True, exist_ok=True)
    return path


def validate_image(file: UploadFile) -> None:
    """
    Valida que el archivo sea una imagen válida
    """
    # Validar extensión
    ext = file.filename.split(".")[-1].lower()
    if ext not in ALLOWED_EXTENSIONS:
        raise HTTPException(
            status_code=400,
            detail=f"Extensión no permitida. Usa: {', '.join(ALLOWED_EXTENSIONS)}"
        )
    
    # Validar tamaño (aproximado)
    if hasattr(file, 'size') and file.size:
        max_size = MAX_IMAGE_SIZE_MB * 1024 * 1024
        if file.size > max_size:
            raise HTTPException(
                status_code=400,
                detail=f"La imagen excede el tamaño máximo de {MAX_IMAGE_SIZE_MB}MB"
            )


async def save_image(file: UploadFile, producto_id: int) -> str:
    """
    Guarda una imagen y retorna la URL relativa
    """
    validate_image(file)
    
    # Generar nombre único
    ext = file.filename.split(".")[-1].lower()
    filename = f"{uuid.uuid4()}.{ext}"
    
    # Crear directorio si no existe
    dir_path = ensure_media_dir(producto_id)
    file_path = dir_path / filename
    
    # Guardar archivo
    try:
        with open(file_path, "wb") as buffer:
            shutil.copyfileobj(file.file, buffer)
        
        # Optimizar imagen
        optimize_image(file_path)
        
        # Retornar URL relativa
        return f"/media/productos/{producto_id}/{filename}"
    
    except Exception as e:
        # Limpiar archivo si hay error
        if file_path.exists():
            file_path.unlink()
        raise HTTPException(status_code=500, detail=f"Error guardando imagen: {str(e)}")
    
    finally:
        file.file.close()


def optimize_image(image_path: Path, max_width: int = 1200):
    """
    Optimiza una imagen reduciendo su tamaño si es necesario
    """
    try:
        with Image.open(image_path) as img:
            # Convertir a RGB si es necesario
            if img.mode in ('RGBA', 'LA', 'P'):
                background = Image.new('RGB', img.size, (255, 255, 255))
                if img.mode == 'P':
                    img = img.convert('RGBA')
                background.paste(img, mask=img.split()[-1] if img.mode == 'RGBA' else None)
                img = background
            
            # Redimensionar si es muy grande
            if img.width > max_width:
                ratio = max_width / img.width
                new_size = (max_width, int(img.height * ratio))
                img = img.resize(new_size, Image.Resampling.LANCZOS)
            
            # Guardar optimizado
            img.save(image_path, optimize=True, quality=85)
    
    except Exception as e:
        print(f"Error optimizando imagen: {e}")


def delete_product_images(producto_id: int):
    """
    Elimina todas las imágenes de un producto
    """
    dir_path = Path(MEDIA_PATH) / "productos" / str(producto_id)
    if dir_path.exists():
        shutil.rmtree(dir_path)


def delete_image(image_url: str):
    """
    Elimina una imagen específica
    """
    try:
        # Convertir URL a path
        image_path = Path(MEDIA_PATH) / image_url.replace("/media/", "")
        if image_path.exists():
            image_path.unlink()
    except Exception as e:
        print(f"Error eliminando imagen: {e}")

