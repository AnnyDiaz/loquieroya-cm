/* ============================================
   🎛️ Catalogo Layout Manager - Lo Quiero YA CM
   Controlador de layout del catálogo
   ============================================ */

class CatalogoLayoutManager {
  constructor() {
    this.catalogoElement = document.getElementById('catalogo-productos');
    this.currentLayout = 'auto';
    this.currentView = 'grid';
    this.init();
  }

  init() {
    this.attachEventListeners();
    this.loadSavedSettings();
  }

  attachEventListeners() {
    // Layout buttons
    document.querySelectorAll('.layout-btn').forEach(btn => {
      btn.addEventListener('click', (e) => {
        const layout = e.target.getAttribute('data-layout');
        this.setLayout(layout);
      });
    });

    // View buttons
    document.querySelectorAll('.view-btn').forEach(btn => {
      btn.addEventListener('click', (e) => {
        const view = e.target.getAttribute('data-view');
        this.setView(view);
      });
    });

    // Responsive adjustments
    window.addEventListener('resize', () => {
      this.handleResponsive();
    });
  }

  setLayout(layout) {
    // Remove all layout classes
    this.catalogoElement.classList.remove(
      'col-1', 'col-2', 'col-3', 'col-4', 'col-5', 'col-6', 'compact'
    );

    // Add new layout class
    if (layout !== 'auto') {
      this.catalogoElement.classList.add(layout);
    }

    // Update active button
    document.querySelectorAll('.layout-btn').forEach(btn => {
      btn.classList.remove('active');
    });
    document.querySelector(`[data-layout="${layout}"]`).classList.add('active');

    this.currentLayout = layout;
    this.saveSettings();
    this.handleResponsive();
  }

  setView(view) {
    // Remove view classes
    this.catalogoElement.classList.remove('list-view');

    // Add new view class
    if (view === 'list') {
      this.catalogoElement.classList.add('list-view');
    }

    // Update active button
    document.querySelectorAll('.view-btn').forEach(btn => {
      btn.classList.remove('active');
    });
    document.querySelector(`[data-view="${view}"]`).classList.add('active');

    this.currentView = view;
    this.saveSettings();
  }

  handleResponsive() {
    const width = window.innerWidth;
    
    // Auto-adjust for mobile
    if (width < 768) {
      if (this.currentLayout === 'col-4' || this.currentLayout === 'col-5' || this.currentLayout === 'col-6') {
        this.catalogoElement.classList.remove(this.currentLayout);
        this.catalogoElement.classList.add('col-1');
      }
    }
    // Auto-adjust for tablet
    else if (width < 992) {
      if (this.currentLayout === 'col-5' || this.currentLayout === 'col-6') {
        this.catalogoElement.classList.remove(this.currentLayout);
        this.catalogoElement.classList.add('col-2');
      }
    }
    // Restore original layout for desktop
    else {
      if (this.currentLayout !== 'auto') {
        this.catalogoElement.classList.remove('col-1', 'col-2');
        this.catalogoElement.classList.add(this.currentLayout);
      }
    }
  }

  saveSettings() {
    localStorage.setItem('catalogoLayout', this.currentLayout);
    localStorage.setItem('catalogoView', this.currentView);
  }

  loadSavedSettings() {
    const savedLayout = localStorage.getItem('catalogoLayout');
    const savedView = localStorage.getItem('catalogoView');

    if (savedLayout) {
      this.setLayout(savedLayout);
    }

    if (savedView) {
      this.setView(savedView);
    }
  }

  // Public methods for external use
  getCurrentLayout() {
    return this.currentLayout;
  }

  getCurrentView() {
    return this.currentView;
  }

  resetToDefault() {
    this.setLayout('auto');
    this.setView('grid');
  }
}

// Auto-initialize when DOM is ready
let catalogoLayoutManager;

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', () => {
    catalogoLayoutManager = new CatalogoLayoutManager();
  });
} else {
  catalogoLayoutManager = new CatalogoLayoutManager();
}

// Export for global access
window.catalogoLayoutManager = catalogoLayoutManager;

// Keyboard shortcuts
document.addEventListener('keydown', (e) => {
  // Ctrl + 1-6 for column layouts
  if (e.ctrlKey && e.key >= '1' && e.key <= '6') {
    e.preventDefault();
    const layout = e.key === '1' ? 'auto' : `col-${e.key}`;
    catalogoLayoutManager.setLayout(layout);
  }
  
  // Ctrl + G for grid view
  if (e.ctrlKey && e.key === 'g') {
    e.preventDefault();
    catalogoLayoutManager.setView('grid');
  }
  
  // Ctrl + L for list view
  if (e.ctrlKey && e.key === 'l') {
    e.preventDefault();
    catalogoLayoutManager.setView('list');
  }
});

// Export
if (typeof module !== 'undefined' && module.exports) {
  module.exports = { CatalogoLayoutManager };
}
