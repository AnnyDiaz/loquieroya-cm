"""
Schemas de Pydantic para validación
"""
from pydantic import BaseModel, Field, ConfigDict
from typing import List, Optional
from datetime import datetime


class ImagenProductoBase(BaseModel):
    """Schema base para Imagen de Producto"""
    url_imagen: str
    orden: Optional[int] = 0


class ImagenProductoCreate(ImagenProductoBase):
    """Schema para crear Imagen de Producto"""
    pass


class ImagenProductoResponse(ImagenProductoBase):
    """Schema para respuesta de Imagen de Producto"""
    id: int
    producto_id: int
    fecha_subida: Optional[datetime] = None
    
    model_config = ConfigDict(from_attributes=True, arbitrary_types_allowed=True)


class ProductoBase(BaseModel):
    """Schema base para Producto"""
    nombre: str = Field(..., min_length=1, max_length=200)
    descripcion: Optional[str] = None
    precio: float = Field(..., gt=0)
    categoria: str = Field(..., min_length=1, max_length=100)
    disponible: Optional[int] = 1


class ProductoCreate(ProductoBase):
    """Schema para crear Producto"""
    creado_por: Optional[str] = None


class ProductoUpdate(BaseModel):
    """Schema para actualizar Producto"""
    nombre: Optional[str] = Field(None, min_length=1, max_length=200)
    descripcion: Optional[str] = None
    precio: Optional[float] = Field(None, gt=0)
    categoria: Optional[str] = Field(None, min_length=1, max_length=100)
    disponible: Optional[int] = None


class ProductoResponse(ProductoBase):
    """Schema para respuesta de Producto"""
    id: int
    creado_por: Optional[str] = None
    fecha_creacion: Optional[datetime] = None
    fecha_actualizacion: Optional[datetime] = None
    imagenes: Optional[List[ImagenProductoResponse]] = []
    
    model_config = ConfigDict(from_attributes=True, arbitrary_types_allowed=True)


class ProductoListResponse(BaseModel):
    """Schema para lista de productos"""
    total: int
    productos: List[ProductoResponse]


class MessageResponse(BaseModel):
    """Schema para mensajes de respuesta"""
    message: str
    detail: Optional[dict] = None

