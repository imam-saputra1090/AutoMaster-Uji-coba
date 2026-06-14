/**
 * VrWorkshop — Virtual Workshop 2.5D Mode
 * AutoMaster v2.0
 * 
 * Maps hotspots onto the real workshop image, providing interactive tooltip cards
 * and navigation to the corresponding module levels.
 */
const VrWorkshop = {
  isActive: false,
  hotspots: [
    {
      id: 'k3',
      name: '🛠️ Papan Perkakas (K3 & Alat)',
      description: 'Budaya kerja industri 5S/5R, keselamatan kerja (APD), dan ensiklopedia perkakas tangan mekanik TKR.',
      left: 10,
      top: 45,
      action() {
        if (typeof K3Interactive !== 'undefined') {
          K3Interactive.open();
        } else if (typeof App !== 'undefined') {
          App.showToast('🛠️ Membuka Panduan K3 & Alat TKR...', 'info');
          App.currentLevel = 1;
          App.learningSource = 'map';
          App.startLearn(1);
        }
      }
    },
    {
      id: 'rem',
      name: '🔴 Stasiun Rem & Spooring (Lift)',
      description: 'Materi teori dan simulasi 3D perakitan kampas rem cakram/tromol, serta evaluasi kuis kelulusan.',
      left: 40,
      top: 70,
      action() {
        if (typeof App !== 'undefined') {
          App.openLevel(1);
        }
      }
    },
    {
      id: 'mesin',
      name: '⚙️ Stasiun Mesin (Kap Terbuka)',
      description: 'Siklus motor 4-tak, blok silinder, kepala silinder, piston, camshaft, dan perlengkapan mesin otomotif (Materi IV).',
      left: 70,
      top: 50,
      action() {
        if (typeof App !== 'undefined') {
          App.openLevel(4); // Open automotive components module directly!
        }
      }
    },
    {
      id: 'listrik',
      name: '⚡ Stasiun Kelistrikan Bodi (Kabinet)',
      description: 'Rangkaian dasar kelistrikan bodi bensin/diesel, relay pengaman, flasher lampu sein, dan klakson.',
      left: 88,
      top: 45,
      action() {
        if (typeof App !== 'undefined') {
          App.openLevel(3);
        }
      }
    }
  ],

  /**
   * Initialize VrWorkshop DOM and event listeners.
   */
  init() {
    this._createDom();
    this._bindEvents();
  },

  /**
   * Render hotspot nodes dynamically.
   */
  _createDom() {
    const container = document.getElementById('vr-hotspots-container');
    if (!container) return;

    container.innerHTML = '';
    this.hotspots.forEach(hs => {
      const pin = document.createElement('button');
      pin.className = 'vr-hotspot-pin';
      pin.style.left = `${hs.left}%`;
      pin.style.top = `${hs.top}%`;
      pin.setAttribute('data-id', hs.id);
      pin.setAttribute('aria-label', hs.name);
      pin.innerHTML = '<span class="pin-pulse"></span><span class="pin-icon">📍</span>';

      const tooltip = document.createElement('div');
      tooltip.className = 'vr-hotspot-tooltip';
      tooltip.innerHTML = `
        <div class="tooltip-title">${hs.name}</div>
        <div class="tooltip-desc">${hs.description}</div>
        <div class="tooltip-footer">Klik untuk Memulai 🏁</div>
      `;
      pin.appendChild(tooltip);

      container.appendChild(pin);
    });
  },

  /**
   * Bind interaction event listeners.
   */
  _bindEvents() {
    const container = document.getElementById('vr-hotspots-container');
    if (!container) return;

    // Hotspot click delegation
    container.addEventListener('click', (e) => {
      const pin = e.target.closest('.vr-hotspot-pin');
      if (pin) {
        const id = pin.getAttribute('data-id');
        const hs = this.hotspots.find(h => h.id === id);
        if (hs && typeof hs.action === 'function') {
          if (typeof AudioManager !== 'undefined') {
            AudioManager.playSFX('click');
          }
          hs.action();
        }
      }
    });

    // Back button
    const backBtn = document.getElementById('btn-back-from-vr');
    if (backBtn) {
      backBtn.addEventListener('click', () => {
        if (typeof App !== 'undefined') {
          App.showScreen('menu');
        }
      });
    }
  },

  /**
   * Activate VR Mode.
   */
  activate() {
    this.isActive = true;
    console.log('[VR] Bengkel Virtual diaktifkan.');
  },

  /**
   * Deactivate VR Mode.
   */
  deactivate() {
    this.isActive = false;
    console.log('[VR] Bengkel Virtual dinonaktifkan.');
  }
};
