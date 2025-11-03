"""
Sistema de autenticación y autorización
"""
from datetime import datetime, timedelta
from typing import Optional
from jose import JWTError, jwt
from passlib.context import CryptContext
from fastapi import Depends, HTTPException, status
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
import os
from dotenv import load_dotenv

load_dotenv()

SECRET_KEY = os.getenv("SECRET_KEY", "tu_clave_secreta_muy_segura")
ALGORITHM = os.getenv("ALGORITHM", "HS256")
ACCESS_TOKEN_EXPIRE_MINUTES = int(os.getenv("ACCESS_TOKEN_EXPIRE_MINUTES", "30"))

pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")
security = HTTPBearer()

# Usuarios admin - estructura base
ADMIN_USERS = {
    "admin@loquieroyacm.com": {
        "email": "admin@loquieroyacm.com",
        "password_plain": "admin123",  # Solo para comparación simple
        "hashed_password": None,  # Se generará en la primera autenticación
        "role": "admin"
    }
}

def init_admin_users():
    """
    Inicializa usuarios admin con hash de contraseñas
    Se llama desde el startup de FastAPI
    """
    global ADMIN_USERS
    try:
        # Intentar hashear las contraseñas
        for email, user in ADMIN_USERS.items():
            if user.get("password_plain") and not user.get("hashed_password"):
                user["hashed_password"] = pwd_context.hash(user["password_plain"])
        print("✅ Usuarios admin inicializados con bcrypt")
    except Exception as e:
        print(f"⚠️ No se pudo usar bcrypt: {e}")
        print("ℹ️ Usando comparación simple de contraseñas")


def verify_password(plain_password: str, hashed_password: str) -> bool:
    """Verifica contraseña"""
    try:
        return pwd_context.verify(plain_password, hashed_password)
    except Exception as e:
        print(f"⚠️ Error verificando password con bcrypt: {e}")
        return False


def get_password_hash(password: str) -> str:
    """Genera hash de contraseña"""
    return pwd_context.hash(password)


def create_access_token(data: dict, expires_delta: Optional[timedelta] = None):
    """Crea token JWT"""
    to_encode = data.copy()
    if expires_delta:
        expire = datetime.utcnow() + expires_delta
    else:
        expire = datetime.utcnow() + timedelta(minutes=15)
    to_encode.update({"exp": expire})
    encoded_jwt = jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)
    return encoded_jwt


def authenticate_user(email: str, password: str):
    """Autentica usuario"""
    user = ADMIN_USERS.get(email)
    if not user:
        return False
    
    # Intentar verificar con hash bcrypt si existe
    if user.get("hashed_password"):
        if not verify_password(password, user["hashed_password"]):
            return False
    # Fallback: comparación simple si no hay hash
    elif user.get("password_plain"):
        if password != user["password_plain"]:
            return False
    else:
        return False
    
    return user


async def get_current_user(credentials: HTTPAuthorizationCredentials = Depends(security)):
    """Obtiene usuario actual desde token"""
    credentials_exception = HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="No se pudo validar las credenciales",
        headers={"WWW-Authenticate": "Bearer"},
    )
    try:
        token = credentials.credentials
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        email: str = payload.get("sub")
        if email is None:
            raise credentials_exception
    except JWTError:
        raise credentials_exception
    
    user = ADMIN_USERS.get(email)
    if user is None:
        raise credentials_exception
    return user


async def require_admin(current_user: dict = Depends(get_current_user)):
    """Requiere que el usuario sea administrador"""
    if current_user.get("role") != "admin":
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="No tienes permisos de administrador"
        )
    return current_user

