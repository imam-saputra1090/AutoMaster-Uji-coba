/**
 * VrWorkshop — Virtual Workshop 2.5D Mode
 * AutoMaster v2.0
 * 
 * Maps hotspots onto the real workshop image, providing interactive tooltip cards
 * and navigation to the corresponding module levels.
 */
const VrWorkshop = {
  isActive: false,
  isDragging: false,
  startX: 0,
  currentTranslateX: 0,
  hotspots: [
    {
      id: 'k3',
      name: '🛠️ Papan Perkakas',
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
      name: '🔴 Stasiun Rem & Spooring',
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
      name: '⚙️ Stasiun Mesin',
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
      name: '⚡ Stasiun Kelistrikan Bodi',
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
      // Determine if locked
      let isUnlocked = true;
      let reqLevelId = 1;
      
      if (hs.id === 'rem') {
        reqLevelId = 1;
        isUnlocked = typeof ProgressManager !== 'undefined' ? ProgressManager.isLevelUnlocked(1) : true;
      } else if (hs.id === 'listrik') {
        reqLevelId = 3;
        isUnlocked = typeof ProgressManager !== 'undefined' ? ProgressManager.isLevelUnlocked(3) : false;
      } else if (hs.id === 'mesin') {
        reqLevelId = 4;
        isUnlocked = typeof ProgressManager !== 'undefined' ? ProgressManager.isLevelUnlocked(4) : false;
      } else if (hs.id === 'k3') {
        reqLevelId = 1;
        isUnlocked = true; // K3 is always available
      }

      const pin = document.createElement('button');
      pin.className = 'vr-hotspot-pin';
      if (!isUnlocked) {
        pin.classList.add('locked');
      }
      pin.style.left = `${hs.left}%`;
      pin.style.top = `${hs.top}%`;
      pin.setAttribute('data-id', hs.id);
      pin.setAttribute('aria-label', hs.name + (isUnlocked ? '' : ' (Terkunci)'));
      
      if (isUnlocked) {
        pin.innerHTML = '<span class="pin-pulse"></span><span class="pin-icon">📍</span>';
      } else {
        pin.innerHTML = '<span class="pin-icon">🔒</span>';
      }

      const tooltip = document.createElement('div');
      tooltip.className = 'vr-hotspot-tooltip';
      if (hs.left < 25) {
        tooltip.classList.add('tooltip-left');
      } else if (hs.left > 75) {
        tooltip.classList.add('tooltip-right');
      }
      
      if (isUnlocked) {
        tooltip.innerHTML = `
          <div class="tooltip-title">${hs.name}</div>
          <div class="tooltip-desc">${hs.description}</div>
          <div class="tooltip-footer">Klik untuk Memulai 🏁</div>
        `;
      } else {
        tooltip.innerHTML = `
          <div class="tooltip-title" style="color: #ef4444; font-weight: 800;">🔒 ${hs.name} (Terkunci)</div>
          <div class="tooltip-desc" style="color: #94a3b8; font-size: 11px; line-height: 1.5; margin-bottom: 10px;">Selesaikan level sebelumnya di Mode Petualangan untuk membuka stasiun ini!</div>
          <div class="tooltip-footer" style="color: #ef4444; background: rgba(239, 68, 68, 0.1); border-radius: 6px; padding: 4px 8px; font-weight: 700; font-size: 10px; display: inline-block;">Level ${reqLevelId} Belum Dibuka</div>
        `;
      }
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
        if (pin.classList.contains('locked')) {
          if (typeof App !== 'undefined') {
            App.showToast('🔒 Stasiun ini masih terkunci! Selesaikan level sebelumnya di Peta Petualangan.', 'warning');
          }
          return;
        }
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

    // Desktop mousemove panning
    window.addEventListener('mousemove', (e) => {
      if (!this.isActive) return;
      if (window.innerWidth < 768) return; // Skip on mobile

      const scene = document.getElementById('vr-scene');
      if (!scene) return;

      const mouseX = e.clientX;
      const pct = mouseX / window.innerWidth; // 0 to 1

      const sceneWidth = scene.getBoundingClientRect().width;
      const viewportWidth = window.innerWidth;
      const maxTrans = sceneWidth - viewportWidth;

      if (maxTrans > 0) {
        const targetX = -pct * maxTrans;
        scene.style.transform = `translateX(${targetX}px) scale(1.05)`;
      }
    });

    // Mobile touch swipe panning
    const screenVr = document.getElementById('screen-vr');
    if (screenVr) {
      screenVr.addEventListener('touchstart', (e) => {
        if (!this.isActive) return;
        this.isDragging = true;
        this.startX = e.touches[0].clientX;
        const scene = document.getElementById('vr-scene');
        if (scene) {
          const transform = window.getComputedStyle(scene).transform;
          let currentX = 0;
          if (transform && transform !== 'none') {
            const matrix = transform.replace(/[^0-9\-.,]/g, '').split(',');
            currentX = parseFloat(matrix[4]) || 0;
          }
          this.currentTranslateX = currentX;
        }
      }, { passive: true });

      screenVr.addEventListener('touchmove', (e) => {
        if (!this.isActive || !this.isDragging) return;
        const scene = document.getElementById('vr-scene');
        if (!scene) return;

        const currentX = e.touches[0].clientX;
        const diffX = currentX - this.startX;
        let newX = this.currentTranslateX + diffX;

        const sceneWidth = scene.getBoundingClientRect().width;
        const viewportWidth = window.innerWidth;
        const maxTrans = sceneWidth - viewportWidth;

        if (newX > 0) newX = 0;
        if (newX < -maxTrans) newX = -maxTrans;

        scene.style.transition = 'none';
        scene.style.transform = `translateX(${newX}px) scale(1.05)`;
      }, { passive: true });

      screenVr.addEventListener('touchend', () => {
        this.isDragging = false;
        const scene = document.getElementById('vr-scene');
        if (scene) {
          scene.style.transition = 'transform 0.15s ease-out';
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

    // Rebuild DOM to check for updated level progress
    this._createDom();

    // Centering and intro zoom effect
    const scene = document.getElementById('vr-scene');
    if (scene) {
      scene.style.transition = 'none';
      const sceneWidth = scene.getBoundingClientRect().width;
      const viewportWidth = window.innerWidth;
      const maxTrans = sceneWidth - viewportWidth;
      const startX = maxTrans > 0 ? -maxTrans / 2 : 0;

      // Start zoomed in slightly
      scene.style.transform = `translateX(${startX}px) scale(1.15)`;

      // Animate to normal scale (camera walk-in effect)
      setTimeout(() => {
        scene.style.transition = 'transform 1.8s cubic-bezier(0.25, 1, 0.5, 1)';
        scene.style.transform = `translateX(${startX}px) scale(1.05)`;
      }, 50);
    }
  },

  /**
   * Deactivate VR Mode.
   */
  deactivate() {
    this.isActive = false;
    this.isDragging = false;
    console.log('[VR] Bengkel Virtual dinonaktifkan.');
  }
};
