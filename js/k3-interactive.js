const K3Interactive = {
  currentApd: 'goggles',
  current5rIdx: 0,
  
  apdData: {
    goggles: {
      name: "Safety Goggles (Kacamata K3)",
      icon: "🥽",
      color: "#3b82f6", // Blue
      desc: "Melindungi mata secara rapat dari bahaya serpihan gram logam bubut, debu kampas rem, percikan api las, serta percikan zat kimia baterai/aki.",
      rules: "Wajib digunakan saat mengelas, membubut, membersihkan rem dengan udara kompresor, atau menuangkan air aki korosif."
    },
    earmuffs: {
      name: "Ear Muffs (Pelindung Telinga)",
      icon: "🎧",
      color: "#a855f7", // Purple
      desc: "Menurunkan intensitas kebisingan suara kompresor udara, mesin bubut, atau mesin uji dyno agar berada di ambang batas aman telinga manusia (< 85 desibel).",
      rules: "Gunakan saat menghidupkan mesin tune-up jangka panjang, dekat tangki kompresor, atau saat melakukan pemotongan pelat logam."
    },
    wearpack: {
      name: "Wearpack (Baju Kerja Bengkel)",
      icon: "🦺",
      color: "#10b981", // Green
      desc: "Melindungi seluruh badan dari minyak pelumas, cairan korosif, panas knalpot, serta bahaya goresan benda kerja tajam.",
      rules: "Baju wearpack harus pas di badan dan dikancingkan penuh. Tidak boleh longgar atau memiliki tali menjuntai agar tidak tergulung ke mesin/belt berputar."
    },
    gloves: {
      name: "Protective Gloves (Sarung Tangan)",
      icon: "🧤",
      color: "#eab308", // Yellow
      desc: "Melindungi kulit tangan dari luka sayatan benda tajam, kejutan listrik ringan, suhu panas pengelasan, dan iritasi cairan kimia.",
      rules: "Gunakan sarung tangan katun untuk bongkar pasang umum, sarung tangan kulit untuk las/panas, dan sarung tangan karet/nitril untuk oli/cairan aki."
    },
    boots: {
      name: "Safety Shoes (Sepatu Keselamatan)",
      icon: "🥾",
      color: "#f97316", // Orange
      desc: "Melindungi kaki dari kejatuhan benda berat (seperti komponen kepala silinder atau roda), bahaya terpaku, dan bahaya ceceran zat kimia/baterai di lantai.",
      rules: "Wajib memiliki besi pelindung jemari kaki (steel toe cap), sol karet anti-slip agar tidak terpeleset oli, serta memiliki sifat isolasi listrik."
    }
  },

  r5Data: [
    {
      title: "Seiri (Ringkas)",
      desc: "🤖 <strong>1. Seiri (Ringkas):</strong> Pilah barang kerja! Bedakan barang yang masih berguna dan barang rusak. Singkirkan benda tak terpakai atau kunci pecah dari area meja kerja agar bengkel tidak penuh sesak."
    },
    {
      title: "Seiton (Rapi)",
      desc: "🤖 <strong>2. Seiton (Rapi):</strong> Tata peralatan! Susun kunci pas, ring, dan soket di papan bay-tooling sesuai bayangan siluet ukuran dan posisinya agar cepat ditemukan saat darurat."
    },
    {
      title: "Seiso (Resik)",
      desc: "🤖 <strong>3. Seiso (Resik):</strong> Bersihkan bengkel! Sapu debu logam, bersihkan ceceran oli di lantai agar tidak membuat mekanik terpeleset, dan lap bersih sisa gemuk/gemuk dari perkakas."
    },
    {
      title: "Seiketsu (Rawat)",
      desc: "🤖 <strong>4. Seiketsu (Rawat):</strong> Pertahankan standar! Pertahankan kebiasaan ringkas, rapi, dan resik secara konsisten setiap hari dengan membuat jadwal piket bengkel yang teratur."
    },
    {
      title: "Shitsuke (Rajin)",
      desc: "🤖 <strong>5. Shitsuke (Rajin):</strong> Budayakan disiplin! Latih kepatuhan APD keselamatan kerja dan pemeliharaan alat secara sadar tanpa perlu diawasi oleh guru atau instruktur industri."
    }
  ],

  init() {
    console.log('[K3Interactive] Initializing K3 module...');
    
    // Bind modal close buttons
    const btnClose = document.getElementById('btn-close-k3-guide');
    if (btnClose) {
      btnClose.addEventListener('click', () => {
        if (typeof AudioManager !== 'undefined') AudioManager.playSFX('click');
        this.close();
      });
    }

    // Bind robot speech bubble toggle
    const robotTrigger = document.getElementById('robot-trigger-avatar');
    if (robotTrigger) {
      robotTrigger.addEventListener('click', () => {
        if (typeof AudioManager !== 'undefined') AudioManager.playSFX('click');
        this.toggleSpeechBubble();
      });
    }

    // Close speech bubble button
    const btnCloseSpeech = document.getElementById('btn-close-robot-speech');
    if (btnCloseSpeech) {
      btnCloseSpeech.addEventListener('click', (e) => {
        e.stopPropagation(); // Prevent trigger click
        if (typeof AudioManager !== 'undefined') AudioManager.playSFX('click');
        this.hideSpeechBubble();
      });
    }

    // Bind robot helper button click for 5R slides
    const btnRobotNext = document.getElementById('btn-robot-next-5r');
    if (btnRobotNext) {
      btnRobotNext.addEventListener('click', (e) => {
        e.stopPropagation();
        if (typeof AudioManager !== 'undefined') AudioManager.playSFX('click');
        this.next5R();
      });
    }

    // Bind Direct menu button if it exists
    const btnDirectK3 = document.getElementById('btn-goto-k3-direct');
    if (btnDirectK3) {
      btnDirectK3.addEventListener('click', () => {
        if (typeof App !== 'undefined') {
          if (typeof AudioManager !== 'undefined') AudioManager.playSFX('click');
          this.open();
        }
      });
    }

    // Bind Hotspot Pins Click/Hover
    this.bindPins();
  },

  bindPins() {
    const pins = document.querySelectorAll('.apd-hotspot-pin');
    pins.forEach(pin => {
      const apdId = pin.getAttribute('data-apd');
      
      pin.addEventListener('click', () => {
        if (typeof AudioManager !== 'undefined') AudioManager.playSFX('click');
        this.selectAPD(apdId);
      });

      pin.addEventListener('mouseover', () => {
        this.selectAPD(apdId);
      });
    });
  },

  open() {
    const modal = document.getElementById('modal-k3-guide');
    if (modal) {
      modal.style.display = 'flex';
      this.selectAPD('goggles');
      this.current5rIdx = 0;
      this.update5R();
      this.hideSpeechBubble(); // start collapsed
    }
  },

  close() {
    const modal = document.getElementById('modal-k3-guide');
    if (modal) {
      modal.style.display = 'none';
    }
  },

  toggleSpeechBubble() {
    const bubble = document.getElementById('robot-speech-bubble-container');
    if (bubble) {
      if (bubble.style.display === 'none' || bubble.style.display === '') {
        bubble.style.display = 'flex';
      } else {
        bubble.style.display = 'none';
      }
    }
  },

  hideSpeechBubble() {
    const bubble = document.getElementById('robot-speech-bubble-container');
    if (bubble) {
      bubble.style.display = 'none';
    }
  },

  selectAPD(apdId) {
    this.currentApd = apdId;
    const data = this.apdData[apdId];
    if (!data) return;

    // Elements
    const titleEl = document.getElementById('k3-apd-title');
    const descEl = document.getElementById('k3-apd-desc');
    const ruleEl = document.getElementById('k3-apd-rules');
    const detailPanel = document.getElementById('k3-apd-detail-panel');

    // Highlight selected hotspot pin
    const pins = document.querySelectorAll('.apd-hotspot-pin');
    pins.forEach(pin => {
      if (pin.getAttribute('data-apd') === apdId) {
        pin.classList.add('active');
        pin.style.boxShadow = `0 0 20px ${data.color}`;
      } else {
        pin.classList.remove('active');
        pin.style.boxShadow = '';
      }
    });

    if (titleEl && descEl && ruleEl && detailPanel) {
      // Apply fade transition
      detailPanel.style.opacity = '0';
      detailPanel.style.transform = 'translateX(10px)';
      
      setTimeout(() => {
        titleEl.innerHTML = `<span style="margin-right: 8px;">${data.icon}</span> ${data.name}`;
        titleEl.style.color = data.color;
        descEl.innerHTML = data.desc;
        ruleEl.innerHTML = `<strong>⚠️ Standar SOP Bengkel TKR:</strong><br>${data.rules}`;
        
        detailPanel.style.opacity = '1';
        detailPanel.style.transform = 'translateX(0)';
      }, 150);
    }
  },

  next5R() {
    this.current5rIdx = (this.current5rIdx + 1) % this.r5Data.length;
    this.update5R();

    // Trigger bounce effect on robot helper
    const robotImg = document.getElementById('k3-robot-helper-img');
    if (robotImg) {
      robotImg.style.animation = 'robot-float 1.5s infinite, robot-bounce-sentinel 0.5s ease';
      setTimeout(() => {
        robotImg.style.animation = 'robot-float 1.5s infinite';
      }, 500);
    }
  },

  update5R() {
    const data = this.r5Data[this.current5rIdx];
    const bubbleText = document.getElementById('robot-speech-text');
    const bubbleTitle = document.getElementById('robot-speech-title');
    
    if (bubbleText && bubbleTitle) {
      bubbleTitle.textContent = data.title;
      bubbleText.innerHTML = data.desc;
    }
  }
};
