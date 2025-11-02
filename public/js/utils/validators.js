/* ============================================
   ✅ Validation Schemas & Validators
   Lo Quiero YA CM
   ============================================ */

/**
 * Clase para manejar errores de validación
 */
class ValidationError extends Error {
  constructor(message, field = null) {
    super(message);
    this.name = 'ValidationError';
    this.field = field;
  }
}

/**
 * Validadores de datos
 */
const Validators = {
  /**
   * Valida un email
   * @param {string} email 
   * @returns {boolean}
   */
  isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  },

  /**
   * Valida un teléfono colombiano
   * @param {string} telefono 
   * @returns {boolean}
   */
  isValidPhone(telefono) {
    const phoneRegex = /^(\+?57)?[0-9]{10}$/;
    return phoneRegex.test(telefono.replace(/\s/g, ''));
  },

  /**
   * Valida que un string no esté vacío
   * @param {string} str 
   * @returns {boolean}
   */
  isNotEmpty(str) {
    return typeof str === 'string' && str.trim().length > 0;
  },

  /**
   * Valida que un número sea positivo
   * @param {number} num 
   * @returns {boolean}
   */
  isPositive(num) {
    return typeof num === 'number' && num > 0;
  },

  /**
   * Valida un archivo de imagen
   * @param {File} file 
   * @param {Object} config 
   * @returns {boolean}
   */
  isValidImage(file, config = {}) {
    const maxSize = config.maxFileSize || 5 * 1024 * 1024; // 5MB
    const allowedTypes = config.allowedTypes || ['image/jpeg', 'image/png', 'image/webp'];
    
    if (!file || !(file instanceof File)) {
      return false;
    }
    
    if (file.size > maxSize) {
      throw new ValidationError(`El archivo es muy grande. Máximo ${maxSize / 1024 / 1024}MB`);
    }
    
    if (!allowedTypes.includes(file.type)) {
      throw new ValidationError(`Tipo de archivo no permitido. Use: ${allowedTypes.join(', ')}`);
    }
    
    return true;
  }
};

/**
 * Schemas de validación
 */
const Schemas = {
  /**
   * Schema para cliente
   */
  cliente: {
    nombre: {
      required: true,
      type: 'string',
      minLength: 2,
      maxLength: 100,
      validate: (value) => Validators.isNotEmpty(value)
    },
    telefono: {
      required: true,
      type: 'string',
      validate: (value) => Validators.isValidPhone(value)
    },
    direccion: {
      required: true,
      type: 'string',
      minLength: 5,
      maxLength: 200
    },
    email: {
      required: false,
      type: 'string',
      validate: (value) => !value || Validators.isValidEmail(value)
    }
  },

  /**
   * Schema para producto en pedido
   */
  productoPedido: {
    id: {
      required: true,
      type: ['string', 'number']
    },
    nombre: {
      required: true,
      type: 'string'
    },
    precio: {
      required: true,
      type: 'number',
      validate: (value) => Validators.isPositive(value)
    },
    cantidad: {
      required: false,
      type: 'number',
      default: 1,
      validate: (value) => value >= 1
    }
  },

  /**
   * Schema para pedido
   */
  pedido: {
    cliente: {
      required: true,
      type: 'object',
      schema: 'cliente'
    },
    productos: {
      required: true,
      type: 'array',
      minLength: 1,
      schema: 'productoPedido'
    },
    total: {
      required: true,
      type: 'number',
      validate: (value) => Validators.isPositive(value)
    },
    observaciones: {
      required: false,
      type: 'string',
      maxLength: 500
    }
  },

  /**
   * Schema para producto
   */
  producto: {
    nombre: {
      required: true,
      type: 'string',
      minLength: 2,
      maxLength: 100
    },
    descripcion: {
      required: false,
      type: 'string',
      maxLength: 500
    },
    precio: {
      required: true,
      type: 'number',
      validate: (value) => Validators.isPositive(value)
    },
    categoria: {
      required: true,
      type: 'string',
      enum: ['anchetas', 'mini-donas', 'personalizado']
    },
    imagen: {
      required: false,
      type: 'string'
    },
    disponible: {
      required: false,
      type: 'boolean',
      default: true
    },
    opciones: {
      required: false,
      type: 'object'
    }
  }
};

/**
 * Valida datos contra un schema
 * @param {Object} data - Datos a validar
 * @param {string} schemaName - Nombre del schema
 * @returns {Object} - Datos validados
 * @throws {ValidationError}
 */
function validateData(data, schemaName) {
  const schema = Schemas[schemaName];
  
  if (!schema) {
    throw new ValidationError(`Schema "${schemaName}" no encontrado`);
  }
  
  const validated = {};
  const errors = [];
  
  // Validar cada campo del schema
  for (const [field, rules] of Object.entries(schema)) {
    const value = data[field];
    
    // Campo requerido
    if (rules.required && (value === undefined || value === null || value === '')) {
      errors.push(`El campo "${field}" es requerido`);
      continue;
    }
    
    // Campo opcional vacío
    if (!rules.required && (value === undefined || value === null || value === '')) {
      if (rules.default !== undefined) {
        validated[field] = rules.default;
      }
      continue;
    }
    
    // Validar tipo
    const types = Array.isArray(rules.type) ? rules.type : [rules.type];
    const valueType = Array.isArray(value) ? 'array' : typeof value;
    
    if (!types.includes(valueType)) {
      errors.push(`El campo "${field}" debe ser de tipo ${types.join(' o ')}`);
      continue;
    }
    
    // Validar longitud de string
    if (typeof value === 'string') {
      if (rules.minLength && value.length < rules.minLength) {
        errors.push(`El campo "${field}" debe tener al menos ${rules.minLength} caracteres`);
        continue;
      }
      if (rules.maxLength && value.length > rules.maxLength) {
        errors.push(`El campo "${field}" no puede tener más de ${rules.maxLength} caracteres`);
        continue;
      }
    }
    
    // Validar longitud de array
    if (Array.isArray(value)) {
      if (rules.minLength && value.length < rules.minLength) {
        errors.push(`El campo "${field}" debe tener al menos ${rules.minLength} elementos`);
        continue;
      }
      
      // Validar elementos del array si tiene schema
      if (rules.schema) {
        const validatedArray = [];
        for (let i = 0; i < value.length; i++) {
          try {
            validatedArray.push(validateData(value[i], rules.schema));
          } catch (error) {
            if (error instanceof ValidationError) {
              errors.push(`${field}[${i}]: ${error.message}`);
            }
          }
        }
        if (errors.length === 0) {
          validated[field] = validatedArray;
        }
        continue;
      }
    }
    
    // Validar enum
    if (rules.enum && !rules.enum.includes(value)) {
      errors.push(`El campo "${field}" debe ser uno de: ${rules.enum.join(', ')}`);
      continue;
    }
    
    // Validar con función personalizada
    if (rules.validate) {
      try {
        if (!rules.validate(value)) {
          errors.push(`El campo "${field}" no es válido`);
          continue;
        }
      } catch (error) {
        errors.push(`Error validando "${field}": ${error.message}`);
        continue;
      }
    }
    
    // Validar objeto anidado
    if (rules.type === 'object' && rules.schema) {
      try {
        validated[field] = validateData(value, rules.schema);
      } catch (error) {
        if (error instanceof ValidationError) {
          errors.push(`${field}: ${error.message}`);
        }
        continue;
      }
    } else {
      validated[field] = value;
    }
  }
  
  // Si hay errores, lanzar excepción
  if (errors.length > 0) {
    throw new ValidationError(errors.join('; '));
  }
  
  return validated;
}

/**
 * Sanitiza un string para prevenir XSS
 * @param {string} str 
 * @returns {string}
 */
function sanitizeString(str) {
  if (typeof str !== 'string') return str;
  
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#x27;')
    .replace(/\//g, '&#x2F;');
}

// Exportar
if (typeof module !== 'undefined' && module.exports) {
  module.exports = {
    Validators,
    Schemas,
    validateData,
    sanitizeString,
    ValidationError
  };
}

