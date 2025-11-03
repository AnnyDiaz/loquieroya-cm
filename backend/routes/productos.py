"""
Rutas para gestión de productos
"""
from fastapi import APIRouter, Depends, HTTPException, UploadFile, File, Form
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select, func
from typing import List, Optional
from database import get_db
from models import Producto, ImagenProducto
from schemas import (
    ProductoCreate, 
    ProductoUpdate, 
    ProductoResponse, 
    ProductoListResponse,
    MessageResponse
)
from auth import require_admin
from utils import save_image, delete_product_images, delete_image

router = APIRouter(prefix="/productos", tags=["Productos"])


@router.post("/", response_model=ProductoResponse, status_code=201)
async def crear_producto(
    nombre: str = Form(...),
    descripcion: Optional[str] = Form(None),
    precio: float = Form(...),
    categoria: str = Form(...),
    disponible: int = Form(1),
    db: AsyncSession = Depends(get_db),
    current_user: dict = Depends(require_admin)
):
    """
    Crea un nuevo producto (solo administradores)
    """
    try:
        # Crear producto
        nuevo_producto = Producto(
            nombre=nombre,
            descripcion=descripcion,
            precio=precio,
            categoria=categoria,
            disponible=disponible,
            creado_por=current_user.get("email")
        )
        
        db.add(nuevo_producto)
        await db.commit()
        await db.refresh(nuevo_producto, ["imagenes"])  # Refresh con relaciones
        
        return nuevo_producto
    
    except Exception as e:
        await db.rollback()
        print(f"❌ Error creando producto: {str(e)}")  # Log para debug
        import traceback
        traceback.print_exc()
        raise HTTPException(status_code=500, detail=f"Error creando producto: {str(e)}")


@router.post("/{producto_id}/imagenes", response_model=MessageResponse)
async def subir_imagenes(
    producto_id: int,
    imagenes: List[UploadFile] = File(...),
    db: AsyncSession = Depends(get_db),
    current_user: dict = Depends(require_admin)
):
    """
    Sube una o varias imágenes para un producto (solo administradores)
    """
    # Verificar que el producto existe
    result = await db.execute(select(Producto).where(Producto.id == producto_id))
    producto = result.scalar_one_or_none()
    
    if not producto:
        raise HTTPException(status_code=404, detail="Producto no encontrado")
    
    imagenes_guardadas = []
    
    try:
        # Obtener el orden máximo actual
        result = await db.execute(
            select(func.max(ImagenProducto.orden))
            .where(ImagenProducto.producto_id == producto_id)
        )
        max_orden = result.scalar() or 0
        
        # Guardar cada imagen
        for idx, imagen in enumerate(imagenes):
            # Guardar archivo
            url_imagen = await save_image(imagen, producto_id)
            
            # Crear registro en BD
            nueva_imagen = ImagenProducto(
                producto_id=producto_id,
                url_imagen=url_imagen,
                orden=max_orden + idx + 1
            )
            db.add(nueva_imagen)
            imagenes_guardadas.append(url_imagen)
        
        await db.commit()
        
        return MessageResponse(
            message=f"{len(imagenes_guardadas)} imagen(es) subida(s) correctamente",
            detail={"urls": imagenes_guardadas}
        )
    
    except Exception as e:
        await db.rollback()
        # Limpiar imágenes guardadas en caso de error
        for url in imagenes_guardadas:
            delete_image(url)
        raise HTTPException(status_code=500, detail=f"Error subiendo imágenes: {str(e)}")


@router.get("/", response_model=ProductoListResponse)
async def listar_productos(
    categoria: Optional[str] = None,
    disponible: Optional[int] = None,
    skip: int = 0,
    limit: int = 100,
    db: AsyncSession = Depends(get_db)
):
    """
    Lista todos los productos con sus imágenes (público)
    """
    try:
        # Construir query
        query = select(Producto)
        
        # Aplicar filtros
        if categoria:
            query = query.where(Producto.categoria == categoria)
        if disponible is not None:
            query = query.where(Producto.disponible == disponible)
        
        # Contar total
        count_query = select(func.count()).select_from(query.subquery())
        result = await db.execute(count_query)
        total = result.scalar()
        
        # Obtener productos con paginación
        query = query.offset(skip).limit(limit)
        result = await db.execute(query)
        productos = result.scalars().all()
        
        return ProductoListResponse(
            total=total,
            productos=productos
        )
    
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error listando productos: {str(e)}")


@router.get("/{producto_id}", response_model=ProductoResponse)
async def obtener_producto(
    producto_id: int,
    db: AsyncSession = Depends(get_db)
):
    """
    Obtiene los detalles de un producto específico (público)
    """
    result = await db.execute(select(Producto).where(Producto.id == producto_id))
    producto = result.scalar_one_or_none()
    
    if not producto:
        raise HTTPException(status_code=404, detail="Producto no encontrado")
    
    return producto


@router.put("/{producto_id}", response_model=ProductoResponse)
async def actualizar_producto(
    producto_id: int,
    nombre: Optional[str] = Form(None),
    descripcion: Optional[str] = Form(None),
    precio: Optional[float] = Form(None),
    categoria: Optional[str] = Form(None),
    disponible: Optional[int] = Form(None),
    db: AsyncSession = Depends(get_db),
    current_user: dict = Depends(require_admin)
):
    """
    Actualiza la información de un producto (solo administradores)
    """
    # Buscar producto
    result = await db.execute(select(Producto).where(Producto.id == producto_id))
    producto = result.scalar_one_or_none()
    
    if not producto:
        raise HTTPException(status_code=404, detail="Producto no encontrado")
    
    try:
        # Actualizar campos
        if nombre is not None:
            producto.nombre = nombre
        if descripcion is not None:
            producto.descripcion = descripcion
        if precio is not None:
            producto.precio = precio
        if categoria is not None:
            producto.categoria = categoria
        if disponible is not None:
            producto.disponible = disponible
        
        await db.commit()
        await db.refresh(producto)
        
        return producto
    
    except Exception as e:
        await db.rollback()
        raise HTTPException(status_code=500, detail=f"Error actualizando producto: {str(e)}")


@router.delete("/{producto_id}", response_model=MessageResponse)
async def eliminar_producto(
    producto_id: int,
    db: AsyncSession = Depends(get_db),
    current_user: dict = Depends(require_admin)
):
    """
    Elimina un producto y todas sus imágenes (solo administradores)
    """
    # Buscar producto
    result = await db.execute(select(Producto).where(Producto.id == producto_id))
    producto = result.scalar_one_or_none()
    
    if not producto:
        raise HTTPException(status_code=404, detail="Producto no encontrado")
    
    try:
        # Eliminar imágenes del filesystem
        delete_product_images(producto_id)
        
        # Eliminar producto (las imágenes en BD se eliminan por CASCADE)
        await db.delete(producto)
        await db.commit()
        
        return MessageResponse(
            message="Producto eliminado correctamente",
            detail={"producto_id": producto_id}
        )
    
    except Exception as e:
        await db.rollback()
        raise HTTPException(status_code=500, detail=f"Error eliminando producto: {str(e)}")


@router.delete("/{producto_id}/imagenes/{imagen_id}", response_model=MessageResponse)
async def eliminar_imagen(
    producto_id: int,
    imagen_id: int,
    db: AsyncSession = Depends(get_db),
    current_user: dict = Depends(require_admin)
):
    """
    Elimina una imagen específica de un producto (solo administradores)
    """
    # Buscar imagen
    result = await db.execute(
        select(ImagenProducto).where(
            ImagenProducto.id == imagen_id,
            ImagenProducto.producto_id == producto_id
        )
    )
    imagen = result.scalar_one_or_none()
    
    if not imagen:
        raise HTTPException(status_code=404, detail="Imagen no encontrada")
    
    try:
        # Eliminar archivo
        delete_image(imagen.url_imagen)
        
        # Eliminar registro
        await db.delete(imagen)
        await db.commit()
        
        return MessageResponse(
            message="Imagen eliminada correctamente",
            detail={"imagen_id": imagen_id}
        )
    
    except Exception as e:
        await db.rollback()
        raise HTTPException(status_code=500, detail=f"Error eliminando imagen: {str(e)}")

