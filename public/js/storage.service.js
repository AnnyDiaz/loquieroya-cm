/* ============================================
   📸 Storage Service - Lo Quiero YA CM
   Servicio para gestión de imágenes en Firebase Storage
   ============================================ */

/**
 * Servicio de Storage para subida de imágenes
 */
class StorageService {
  constructor() {
    this.storage = null;
    this.uploading = false;
    this.uploadProgress = 0;
    this.listeners = [];
    this.config = {
      maxFileSize: 5 * 1024 * 1024, // 5MB
      allowedTypes: ['image/jpeg', 'image/png', 'image/webp'],
      productosPath: 'productos/'
    };
  }

  /**
   * Inicializa el servicio
   * @param {Object} storage - Instancia de Firebase Storage
   * @param {Object} config - Configuración personalizada
   */
  initialize(storage, config = {}) {
    this.storage = storage;
    this.config = { ...this.config, ...config };
    console.log('✅ StorageService inicializado');
  }

  /**
   * Valida un archivo de imagen
   * @param {File} file 
   * @throws {Error}
   */
  validarImagen(file) {
    if (!file || !(file instanceof File)) {
      throw new Error('Archivo inválido');
    }

    // Validar tamaño
    if (file.size > this.config.maxFileSize) {
      const maxSizeMB = this.config.maxFileSize / 1024 / 1024;
      throw new Error(`El archivo es muy grande. Máximo ${maxSizeMB}MB permitidos`);
    }

    // Validar tipo
    if (!this.config.allowedTypes.includes(file.type)) {
      throw new Error(`Tipo de archivo no permitido. Use: ${this.config.allowedTypes.join(', ')}`);
    }

    return true;
  }

  /**
   * Genera un nombre único para el archivo
   * @param {string} originalName 
   * @returns {string}
   */
  generarNombreUnico(originalName) {
    const timestamp = Date.now();
    const random = Math.random().toString(36).substring(2, 9);
    const extension = originalName.split('.').pop();
    return `${timestamp}_${random}.${extension}`;
  }

  /**
   * Sube una imagen de producto
   * @param {File} file - Archivo de imagen
   * @param {Object} opciones - Opciones de subida
   * @returns {Promise<Object>} URL de la imagen y metadata
   */
  async subirImagenProducto(file, opciones = {}) {
    try {
      // Validar imagen
      this.validarImagen(file);

      if (!this.storage) {
        throw new Error('Firebase Storage no inicializado');
      }

      this.setUploading(true);
      this.setUploadProgress(0);

      // Generar nombre único
      const fileName = this.generarNombreUnico(file.name);
      const filePath = `${this.config.productosPath}${fileName}`;

      // Crear referencia
      const storageRef = this.storage.ref(filePath);

      // Metadata
      const metadata = {
        contentType: file.type,
        customMetadata: {
          uploadedAt: new Date().toISOString(),
          originalName: file.name,
          ...opciones.metadata
        }
      };

      // Subir archivo
      const uploadTask = storageRef.put(file, metadata);

      // Monitorear progreso
      return new Promise((resolve, reject) => {
        uploadTask.on(
          'state_changed',
          (snapshot) => {
            // Progreso
            const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
            this.setUploadProgress(progress);
            console.log(`📤 Progreso de subida: ${progress.toFixed(2)}%`);
          },
          (error) => {
            // Error
            console.error('❌ Error subiendo imagen:', error);
            this.setUploading(false);
            this.setUploadProgress(0);
            reject(error);
          },
          async () => {
            // Completado
            try {
              const downloadURL = await uploadTask.snapshot.ref.getDownloadURL();
              
              const resultado = {
                url: downloadURL,
                path: filePath,
                name: fileName,
                size: file.size,
                type: file.type
              };

              console.log('✅ Imagen subida exitosamente:', resultado);
              
              this.setUploading(false);
              this.setUploadProgress(100);
              
              resolve(resultado);
            } catch (error) {
              console.error('❌ Error obteniendo URL:', error);
              this.setUploading(false);
              reject(error);
            }
          }
        );
      });

    } catch (error) {
      console.error('❌ Error en subirImagenProducto:', error);
      this.setUploading(false);
      this.setUploadProgress(0);
      throw error;
    }
  }

  /**
   * Elimina una imagen
   * @param {string} filePath - Ruta del archivo en Storage
   * @returns {Promise<void>}
   */
  async eliminarImagen(filePath) {
    try {
      if (!this.storage) {
        throw new Error('Firebase Storage no inicializado');
      }

      const storageRef = this.storage.ref(filePath);
      await storageRef.delete();
      
      console.log('✅ Imagen eliminada:', filePath);

    } catch (error) {
      console.error('❌ Error eliminando imagen:', error);
      throw error;
    }
  }

  /**
   * Obtiene la URL de una imagen
   * @param {string} filePath 
   * @returns {Promise<string>}
   */
  async obtenerURLImagen(filePath) {
    try {
      if (!this.storage) {
        throw new Error('Firebase Storage no inicializado');
      }

      const storageRef = this.storage.ref(filePath);
      const url = await storageRef.getDownloadURL();
      
      return url;

    } catch (error) {
      console.error('❌ Error obteniendo URL de imagen:', error);
      throw error;
    }
  }

  /**
   * Redimensiona una imagen antes de subirla (client-side)
   * @param {File} file 
   * @param {number} maxWidth 
   * @param {number} maxHeight 
   * @returns {Promise<Blob>}
   */
  async redimensionarImagen(file, maxWidth = 800, maxHeight = 800) {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      
      reader.onload = (e) => {
        const img = new Image();
        
        img.onload = () => {
          const canvas = document.createElement('canvas');
          let width = img.width;
          let height = img.height;

          // Calcular nuevas dimensiones
          if (width > height) {
            if (width > maxWidth) {
              height *= maxWidth / width;
              width = maxWidth;
            }
          } else {
            if (height > maxHeight) {
              width *= maxHeight / height;
              height = maxHeight;
            }
          }

          canvas.width = width;
          canvas.height = height;

          const ctx = canvas.getContext('2d');
          ctx.drawImage(img, 0, 0, width, height);

          canvas.toBlob(
            (blob) => {
              resolve(blob);
            },
            file.type,
            0.9 // Calidad 90%
          );
        };

        img.onerror = reject;
        img.src = e.target.result;
      };

      reader.onerror = reject;
      reader.readAsDataURL(file);
    });
  }

  /**
   * Sube múltiples imágenes
   * @param {FileList|Array} files 
   * @returns {Promise<Array>}
   */
  async subirMultiplesImagenes(files) {
    const promesas = Array.from(files).map(file => 
      this.subirImagenProducto(file)
    );

    try {
      const resultados = await Promise.all(promesas);
      console.log(`✅ ${resultados.length} imágenes subidas exitosamente`);
      return resultados;
    } catch (error) {
      console.error('❌ Error subiendo múltiples imágenes:', error);
      throw error;
    }
  }

  /**
   * Estado de subida
   * @param {boolean} isUploading 
   */
  setUploading(isUploading) {
    this.uploading = isUploading;
    this.notifyListeners({ uploading: isUploading });
  }

  /**
   * Progreso de subida
   * @param {number} progress 
   */
  setUploadProgress(progress) {
    this.uploadProgress = progress;
    this.notifyListeners({ uploadProgress: progress });
  }

  /**
   * Suscribirse a cambios
   * @param {Function} callback 
   * @returns {Function} Función para desuscribirse
   */
  subscribe(callback) {
    this.listeners.push(callback);
    return () => {
      this.listeners = this.listeners.filter(cb => cb !== callback);
    };
  }

  /**
   * Notifica a los listeners
   * @param {Object} data 
   */
  notifyListeners(data) {
    this.listeners.forEach(callback => callback(data));
  }
}

// Crear instancia singleton
const storageService = new StorageService();

// Exportar
if (typeof module !== 'undefined' && module.exports) {
  module.exports = storageService;
}

