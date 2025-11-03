"""
Modelos de base de datos
"""
from sqlalchemy import Column, Integer, String, Float, DateTime, ForeignKey, Text
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
from database import Base

class Producto(Base):
    """
    Modelo de Producto
    """
    __tablename__ = "productos"
    
    id = Column(Integer, primary_key=True, index=True)
    nombre = Column(String(200), nullable=False, index=True)
    descripcion = Column(Text, nullable=True)
    precio = Column(Float, nullable=False)
    categoria = Column(String(100), nullable=False, index=True)
    creado_por = Column(String(200), nullable=True)
    fecha_creacion = Column(DateTime(timezone=True), server_default=func.now())
    fecha_actualizacion = Column(DateTime(timezone=True), onupdate=func.now())
    disponible = Column(Integer, default=1)  # 1 = disponible, 0 = no disponible
    
    # Relación con imágenes
    imagenes = relationship("ImagenProducto", back_populates="producto", cascade="all, delete-orphan", lazy="selectin")
    
    def __repr__(self):
        return f"<Producto {self.nombre}>"


class ImagenProducto(Base):
    """
    Modelo de Imagen de Producto
    """
    __tablename__ = "imagenes_productos"
    
    id = Column(Integer, primary_key=True, index=True)
    producto_id = Column(Integer, ForeignKey("productos.id", ondelete="CASCADE"), nullable=False)
    url_imagen = Column(String(500), nullable=False)
    orden = Column(Integer, default=0)  # Para ordenar las imágenes
    fecha_subida = Column(DateTime(timezone=True), server_default=func.now())
    
    # Relación con producto
    producto = relationship("Producto", back_populates="imagenes")
    
    def __repr__(self):
        return f"<ImagenProducto {self.url_imagen}>"

