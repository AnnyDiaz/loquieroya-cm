"""
Script simple para iniciar el servidor
"""
import uvicorn

if __name__ == "__main__":
    print("🚀 Iniciando servidor FastAPI...")
    print("📍 URL: http://localhost:8000")
    print("📚 Docs: http://localhost:8000/docs")
    print("\n" + "="*50)
    
    uvicorn.run(
        "main:app",
        host="0.0.0.0",
        port=8000,
        reload=False,
        log_level="info"
    )

