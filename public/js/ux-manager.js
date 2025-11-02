/* ============================================
   🎨 UX Manager - Lo Quiero YA CM
   Sistema completo de experiencia de usuario
   ============================================ */

/**
 * Toast Notification System
 */
class ToastManager {
  constructor() {
    this.container = null;
    this.toasts = [];
    this.init();
  }

  init() {
    // Crear contenedor si no existe
    if (!document.getElementById('toast-container')) {
      this.container = document.createElement('div');
      this.container.id = 'toast-container';
      this.container.className = 'toast-container';
      this.container.setAttribute('role', 'region');
      this.container.setAttribute('aria-label', 'Notificaciones');
      this.container.setAttribute('aria-live', 'polite');
      document.body.appendChild(this.container);
    } else {
      this.container = document.getElementById('toast-container');
    }
  }

  show(message, type = 'info', duration = 3000) {
    const toast = this.createToast(message, type);
    this.container.appendChild(toast);
    this.toasts.push(toast);

    // Auto-remove
    setTimeout(() => {
      this.remove(toast);
    }, duration);

    return toast;
  }

  createToast(message, type) {
    const toast = document.createElement('div');
    toast.className = `toast toast-${type}`;
    toast.setAttribute('role', 'alert');

    const icons = {
      success: '✅',
      error: '❌',
      warning: '⚠️',
      info: 'ℹ️'
    };

    const titles = {
      success: 'Éxito',
      error: 'Error',
      warning: 'Advertencia',
      info: 'Información'
    };

    toast.innerHTML = `
      <span class="toast-icon">${icons[type]}</span>
      <div class="toast-content">
        <p class="toast-title">${titles[type]}</p>
        <p class="toast-message">${message}</p>
      </div>
      <button class="toast-close" aria-label="Cerrar notificación">✕</button>
      <div class="toast-progress"></div>
    `;

    // Close button
    const closeBtn = toast.querySelector('.toast-close');
    closeBtn.addEventListener('click', () => this.remove(toast));

    return toast;
  }

  remove(toast) {
    toast.classList.add('toast-exit');
    setTimeout(() => {
      if (toast.parentNode) {
        toast.parentNode.removeChild(toast);
      }
      this.toasts = this.toasts.filter(t => t !== toast);
    }, 300);
  }

  success(message, duration) {
    return this.show(message, 'success', duration);
  }

  error(message, duration) {
    return this.show(message, 'error', duration);
  }

  warning(message, duration) {
    return this.show(message, 'warning', duration);
  }

  info(message, duration) {
    return this.show(message, 'info', duration);
  }
}

/**
 * Confirmation Modal System
 */
class ConfirmModal {
  constructor() {
    this.modal = null;
    this.init();
  }

  init() {
    if (!document.getElementById('confirm-modal')) {
      this.modal = document.createElement('div');
      this.modal.id = 'confirm-modal';
      this.modal.className = 'modal-confirm';
      this.modal.setAttribute('role', 'dialog');
      this.modal.setAttribute('aria-modal', 'true');
      this.modal.setAttribute('aria-labelledby', 'confirm-modal-title');
      document.body.appendChild(this.modal);
    } else {
      this.modal = document.getElementById('confirm-modal');
    }

    // Close on backdrop click
    this.modal.addEventListener('click', (e) => {
      if (e.target === this.modal) {
        this.close();
      }
    });

    // Close on ESC key
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && this.modal.classList.contains('active')) {
        this.close();
      }
    });
  }

  show(options = {}) {
    const {
      title = '¿Estás seguro?',
      message = '¿Deseas continuar con esta acción?',
      type = 'warning',
      confirmText = 'Confirmar',
      cancelText = 'Cancelar',
      onConfirm = () => {},
      onCancel = () => {}
    } = options;

    const icons = {
      danger: '⚠️',
      warning: '❓',
      info: 'ℹ️'
    };

    this.modal.innerHTML = `
      <div class="modal-confirm-content">
        <div class="modal-confirm-header">
          <span class="modal-confirm-icon ${type}">${icons[type] || icons.warning}</span>
          <h3 class="modal-confirm-title" id="confirm-modal-title">${title}</h3>
        </div>
        <div class="modal-confirm-body">
          <p class="modal-confirm-message">${message}</p>
        </div>
        <div class="modal-confirm-footer">
          <button class="modal-confirm-btn modal-confirm-btn-cancel" id="confirm-modal-cancel">
            ${cancelText}
          </button>
          <button class="modal-confirm-btn modal-confirm-btn-confirm ${type}" id="confirm-modal-confirm">
            ${confirmText}
          </button>
        </div>
      </div>
    `;

    // Event listeners
    const confirmBtn = this.modal.querySelector('#confirm-modal-confirm');
    const cancelBtn = this.modal.querySelector('#confirm-modal-cancel');

    confirmBtn.addEventListener('click', () => {
      onConfirm();
      this.close();
    });

    cancelBtn.addEventListener('click', () => {
      onCancel();
      this.close();
    });

    // Show modal
    this.modal.classList.add('active');
    
    // Focus on confirm button
    setTimeout(() => {
      confirmBtn.focus();
    }, 100);

    // Trap focus
    this.trapFocus(this.modal);
  }

  close() {
    this.modal.classList.remove('active');
  }

  trapFocus(element) {
    const focusableElements = element.querySelectorAll(
      'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
    );
    const firstFocusable = focusableElements[0];
    const lastFocusable = focusableElements[focusableElements.length - 1];

    const handler = (e) => {
      if (e.key !== 'Tab') return;

      if (e.shiftKey) {
        if (document.activeElement === firstFocusable) {
          lastFocusable.focus();
          e.preventDefault();
        }
      } else {
        if (document.activeElement === lastFocusable) {
          firstFocusable.focus();
          e.preventDefault();
        }
      }
    };

    element.addEventListener('keydown', handler);
  }
}

/**
 * Form Validator
 */
class FormValidator {
  constructor(formElement) {
    this.form = formElement;
    this.fields = {};
    this.init();
  }

  init() {
    // Find all form fields
    const inputs = this.form.querySelectorAll('input, textarea, select');
    inputs.forEach(input => {
      const field = input.closest('.form-field') || this.createFieldWrapper(input);
      this.fields[input.name || input.id] = {
        input,
        field,
        rules: this.getRules(input)
      };

      // Real-time validation
      input.addEventListener('blur', () => this.validateField(input.name || input.id));
      input.addEventListener('input', () => {
        // Clear error on input
        if (field.classList.contains('error')) {
          this.clearFieldError(input.name || input.id);
        }
      });
    });
  }

  createFieldWrapper(input) {
    const wrapper = document.createElement('div');
    wrapper.className = 'form-field';
    input.parentNode.insertBefore(wrapper, input);
    wrapper.appendChild(input);

    const message = document.createElement('span');
    message.className = 'form-field-message';
    wrapper.appendChild(message);

    const icon = document.createElement('span');
    icon.className = 'form-field-icon';
    wrapper.appendChild(icon);

    return wrapper;
  }

  getRules(input) {
    const rules = [];

    if (input.required) {
      rules.push({ type: 'required', message: 'Este campo es requerido' });
    }

    if (input.type === 'email') {
      rules.push({ type: 'email', message: 'Email inválido' });
    }

    if (input.type === 'tel') {
      rules.push({ type: 'phone', message: 'Teléfono inválido' });
    }

    if (input.minLength) {
      rules.push({ 
        type: 'minLength', 
        value: input.minLength, 
        message: `Mínimo ${input.minLength} caracteres` 
      });
    }

    if (input.pattern) {
      rules.push({ 
        type: 'pattern', 
        value: input.pattern, 
        message: 'Formato inválido' 
      });
    }

    return rules;
  }

  validateField(fieldName) {
    const { input, field, rules } = this.fields[fieldName];
    const value = input.value.trim();

    for (const rule of rules) {
      let isValid = true;
      let message = rule.message;

      switch (rule.type) {
        case 'required':
          isValid = value.length > 0;
          break;
        case 'email':
          isValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
          break;
        case 'phone':
          isValid = /^[0-9]{7,15}$/.test(value.replace(/\s/g, ''));
          break;
        case 'minLength':
          isValid = value.length >= rule.value;
          break;
        case 'pattern':
          isValid = new RegExp(rule.value).test(value);
          break;
      }

      if (!isValid) {
        this.setFieldError(fieldName, message);
        return false;
      }
    }

    this.setFieldSuccess(fieldName);
    return true;
  }

  setFieldError(fieldName, message) {
    const { field } = this.fields[fieldName];
    field.classList.remove('success');
    field.classList.add('error');

    const messageEl = field.querySelector('.form-field-message');
    if (messageEl) {
      messageEl.textContent = message;
    }

    const icon = field.querySelector('.form-field-icon');
    if (icon) {
      icon.textContent = '❌';
    }
  }

  setFieldSuccess(fieldName) {
    const { field } = this.fields[fieldName];
    field.classList.remove('error');
    field.classList.add('success');

    const messageEl = field.querySelector('.form-field-message');
    if (messageEl) {
      messageEl.textContent = '';
    }

    const icon = field.querySelector('.form-field-icon');
    if (icon) {
      icon.textContent = '✅';
    }
  }

  clearFieldError(fieldName) {
    const { field } = this.fields[fieldName];
    field.classList.remove('error', 'success');

    const messageEl = field.querySelector('.form-field-message');
    if (messageEl) {
      messageEl.textContent = '';
    }

    const icon = field.querySelector('.form-field-icon');
    if (icon) {
      icon.textContent = '';
    }
  }

  validateForm() {
    let isValid = true;

    for (const fieldName in this.fields) {
      if (!this.validateField(fieldName)) {
        isValid = false;
      }
    }

    return isValid;
  }

  reset() {
    for (const fieldName in this.fields) {
      this.clearFieldError(fieldName);
    }
  }
}

/**
 * Skeleton Loader
 */
class SkeletonLoader {
  static createProductSkeleton() {
    const skeleton = document.createElement('div');
    skeleton.className = 'skeleton-product-card fade-in';

    skeleton.innerHTML = `
      <div class="skeleton skeleton-product-image"></div>
      <div class="skeleton skeleton-product-title"></div>
      <div class="skeleton skeleton-product-description"></div>
      <div class="skeleton skeleton-product-description"></div>
      <div class="skeleton skeleton-product-price"></div>
      <div class="skeleton skeleton-product-button"></div>
    `;

    return skeleton;
  }

  static showProductSkeletons(container, count = 4) {
    container.innerHTML = '';
    for (let i = 0; i < count; i++) {
      container.appendChild(this.createProductSkeleton());
    }
  }

  static hideSkeletons(container) {
    const skeletons = container.querySelectorAll('.skeleton-product-card');
    skeletons.forEach(skeleton => {
      skeleton.style.opacity = '0';
      setTimeout(() => {
        skeleton.remove();
      }, 300);
    });
  }
}

/**
 * Offline Detector
 */
class OfflineDetector {
  constructor() {
    this.indicator = null;
    this.init();
  }

  init() {
    // Create indicator
    this.indicator = document.createElement('div');
    this.indicator.className = 'offline-indicator';
    this.indicator.innerHTML = '📡 Sin conexión a internet';
    this.indicator.setAttribute('role', 'alert');
    document.body.appendChild(this.indicator);

    // Listen to online/offline events
    window.addEventListener('online', () => this.setOnline());
    window.addEventListener('offline', () => this.setOffline());

    // Initial check
    if (!navigator.onLine) {
      this.setOffline();
    }
  }

  setOnline() {
    this.indicator.classList.remove('active');
    if (typeof toastManager !== 'undefined') {
      toastManager.success('Conexión restaurada');
    }
  }

  setOffline() {
    this.indicator.classList.add('active');
    if (typeof toastManager !== 'undefined') {
      toastManager.warning('Sin conexión a internet', 5000);
    }
  }
}

/**
 * Loading Button State
 */
function setButtonLoading(button, isLoading = true) {
  if (isLoading) {
    button.classList.add('btn-loading');
    button.disabled = true;
    button.dataset.originalText = button.textContent;
    button.innerHTML = '<span class="loading-spinner"></span>';
  } else {
    button.classList.remove('btn-loading');
    button.disabled = false;
    button.textContent = button.dataset.originalText || button.textContent;
  }
}

/**
 * Scroll to Top with Animation
 */
function scrollToTop(duration = 300) {
  const start = window.pageYOffset;
  const startTime = performance.now();

  function scroll(currentTime) {
    const elapsed = currentTime - startTime;
    const progress = Math.min(elapsed / duration, 1);
    const ease = progress * (2 - progress); // easeOutQuad

    window.scrollTo(0, start * (1 - ease));

    if (progress < 1) {
      requestAnimationFrame(scroll);
    }
  }

  requestAnimationFrame(scroll);
}

/**
 * Lazy Load Images
 */
function initLazyLoading() {
  const images = document.querySelectorAll('img[data-src]');

  const imageObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const img = entry.target;
        img.src = img.dataset.src;
        img.removeAttribute('data-src');
        img.classList.add('fade-in');
        observer.unobserve(img);
      }
    });
  });

  images.forEach(img => imageObserver.observe(img));
}

/**
 * Initialize UX Enhancements
 */
function initializeUXEnhancements() {
  console.log('🎨 Inicializando mejoras de UX...');

  // Create global instances
  window.toastManager = new ToastManager();
  window.confirmModal = new ConfirmModal();
  window.offlineDetector = new OfflineDetector();

  // Initialize lazy loading
  initLazyLoading();

  // Add smooth scroll
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
      const href = this.getAttribute('href');
      // Validar que el href no esté vacío
      if (!href || href === '#') {
        e.preventDefault();
        return;
      }
      
      e.preventDefault();
      const target = document.querySelector(href);
      if (target) {
        target.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    });
  });

  console.log('✅ UX Enhancements cargadas');
}

// Auto-initialize when DOM is ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initializeUXEnhancements);
} else {
  initializeUXEnhancements();
}

// Export for use in other scripts
if (typeof module !== 'undefined' && module.exports) {
  module.exports = {
    ToastManager,
    ConfirmModal,
    FormValidator,
    SkeletonLoader,
    OfflineDetector,
    setButtonLoading,
    scrollToTop,
    initLazyLoading
  };
}

