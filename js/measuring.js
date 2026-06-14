/**
 * ============================================================
 * AutoMaster — Bengkel Virtual
 * measuring.js — Modul Simulasi & Latihan Alat Ukur Presisi
 * ============================================================
 * Mengelola interaktivitas alat ukur otomotif (Kurikulum Merdeka):
 * - Jangka Sorong (Vernier Caliper 0.05mm)
 * - Mikrometer Luar (Outside Micrometer 0.01mm)
 * - Multimeter Analog (AVO Meter V/A/Ohm)
 * - Dial Indicator (Dial Gauge 0.01mm)
 * ============================================================
 */

const MeasuringTools = {
  currentTool: 'caliper',
  practiceMode: false,
  practiceValue: 0.0,
  quizMode: false,
  quizIndex: 0,
  quizScore: 0,

  toolsData: {
    caliper: {
      name: "Jangka Sorong (Vernier Caliper)",
      image: "assets/measuring_caliper.png",
      desc: "Digunakan untuk mengukur diameter luar, diameter dalam, dan kedalaman suatu benda kerja secara presisi.",
      usage: "1. Bersihkan rahang jangka sorong dan benda kerja dari debu/oli.<br>2. Rapatkan rahang, pastikan posisi nol skala nonius sejajar dengan nol skala utama (kalibrasi).<br>3. Jepit benda kerja di antara rahang luar (untuk diameter luar) atau rahang dalam (untuk diameter dalam).<br>4. Kencangkan baut pengunci agar skala tidak bergeser saat dibaca.",
      reading: "1. Baca angka nol skala nonius pada skala utama (dalam satuan mm). Ini menunjukkan nilai bilangan bulat.<br>2. Cari garis skala nonius (nonius scale) yang paling lurus sejajar dengan garis pada skala utama.<br>3. Kalikan garis nonius tersebut dengan tingkat ketelitian alat (0,05 mm), lalu tambahkan dengan nilai skala utama."
    },
    micrometer: {
      name: "Mikrometer Luar (Outside Micrometer)",
      image: "assets/measuring_micrometer.png",
      desc: "Alat ukur dengan presisi sangat tinggi (hingga 0,01 mm) untuk mengukur diameter luar poros, ketebalan pelat, dan diameter benda bulat kecil.",
      usage: "1. Bersihkan anvil, spindle, dan permukaan benda kerja.<br>2. Putar thimble hingga anvil dan spindle bersentuhan ringan dengan benda kerja, lalu putar ratchet stopper 2-3 kali hingga berbunyi 'klik' untuk tekanan konstan.<br>3. Kunci spindel menggunakan tuas pengunci sebelum melakukan pembacaan skala.",
      reading: "1. Baca skala utama pada sleeve (skala atas menunjukkan kelipatan 1 mm, skala bawah menunjukkan kelipatan 0,5 mm).<br>2. Baca skala thimble (putar) yang sejajar dengan garis horizontal sleeve (0-50, kalikan dengan ketebalan 0,01 mm).<br>3. Jumlahkan kedua nilai tersebut untuk mendapatkan ukuran akhir."
    },
    multimeter: {
      name: "Multimeter Analog (AVO Meter)",
      image: "assets/measuring_multimeter.png",
      desc: "Digunakan untuk mengukur Arus listrik (mA), Tegangan (ACV/DCV), dan Hambatan (Ohm) pada sistem kelistrikan otomotif.",
      usage: "1. Setel jarum ke angka nol (zero-adjuster) sebelum digunakan.<br>2. Putar sakelar pemilih (selector switch) ke posisi range yang sesuai (misal: DCV 50 untuk mengukur aki 12V).<br>3. Hubungkan test lead merah ke positif dan hitam ke negatif secara paralel (tegangan) atau seri (arus).",
      reading: "1. Skala Ohm (Tahanan) dibaca pada busur teratas (non-linear, dari kanan 0 ke kiri tak terhingga), lalu kalikan dengan range selector (x1, x10, x1k).<br>2. Skala DCV/ACV dibaca pada busur tengah (linear, dari kiri 0 ke kanan 10, 50, atau 250), pilih skala yang sesuai dengan posisi sakelar pemilih, lalu baca nilainya secara proporsional."
    },
    dial: {
      name: "Dial Indicator (Dial Gauge)",
      image: "assets/measuring_dialindicator.png",
      desc: "Digunakan untuk mengukur kebengkokan poros (run-out), keovalan, serta kerataan permukaan bidang logam.",
      usage: "1. Pasang dial indicator pada stand magnetik secara kokoh.<br>2. Posisikan sensor plunger tegak lurus dengan permukaan poros yang diukur.<br>3. Sentuhkan plunger hingga jarum besar bergerak sedikit (pre-load), lalu putar bezel luar agar jarum besar menunjuk tepat ke angka nol.<br>4. Putar poros perlahan dan amati penyimpangan maksimum jarum.",
      reading: "1. Skala utama (jarum besar) memiliki tingkat ketelitian 0,01 mm per garis. Satu putaran penuh jarum besar setara dengan 1,00 mm.<br>2. Jarum kecil (revolution counter) membaca kelipatan 1,00 mm.<br>3. Gabungkan pembacaan jarum kecil dan jarum besar (misal: jarum kecil di angka 2, jarum besar di garis 45, maka pembacaannya adalah 2,45 mm)."
    }
  },

  quizQuestions: {
    caliper: [
      {
        q: "Berapakah tingkat ketelitian jangka sorong jika pada skala nonius terdapat 20 skala pembagian?",
        a: ["0,05 mm", "0,02 mm", "0,1 mm", "0,01 mm"],
        correct: 0
      },
      {
        q: "Bagian jangka sorong yang digunakan untuk mengukur diameter dalam sebuah silinder adalah...",
        a: ["Rahang Luar (Lower Jaws)", "Rahang Dalam (Upper Jaws)", "Pengukur Kedalaman (Depth Bar)", "Baut Pengunci"],
        correct: 1
      },
      {
        q: "Jika skala utama menunjukkan 15 mm dan garis nonius ke-7 sejajar dengan skala utama (ketelitian 0,05 mm), berapakah hasil pengukurannya?",
        a: ["15,70 mm", "15,35 mm", "15,07 mm", "15,50 mm"],
        correct: 1
      }
    ],
    micrometer: [
      {
        q: "Bagian mikrometer luar yang berfungsi untuk memastikan tekanan pengukuran konstan dan berbunyi klik adalah...",
        a: ["Ratchet Stopper", "Thimble", "Sleeve", "Anvil & Spindle"],
        correct: 0
      },
      {
        q: "Satu putaran penuh thimble pada mikrometer luar setara dengan pergeseran spindle sebesar...",
        a: ["1,00 mm", "0,10 mm", "0,50 mm", "0,01 mm"],
        correct: 2
      },
      {
        q: "Jika pada sleeve terbaca 8,5 mm dan thimble menunjukkan angka 32, berapakah hasil pengukurannya?",
        a: ["8,32 mm", "8,532 mm", "8,82 mm", "9,12 mm"],
        correct: 2
      }
    ],
    multimeter: [
      {
        q: "Saat ingin mengukur tegangan baterai aki mobil (12V) menggunakan multimeter analog, posisi sakelar pemilih (selector) yang paling aman dan tepat adalah...",
        a: ["ACV 250", "DCV 10", "DCV 50", "Ohm x10"],
        correct: 2
      },
      {
        q: "Skala manakah pada multimeter analog yang dibaca dari kanan (0) ke kiri (tak terhingga / ∞)?",
        a: ["Skala ACV", "Skala DCV", "Skala Ohm (Resistance)", "Skala DCmA"],
        correct: 2
      },
      {
        q: "Jika sakelar pemilih diatur pada DCV 10 dan jarum menunjuk angka 42 pada deret skala 0-50, berapakah tegangannya?",
        a: ["4,2 Volt", "8,4 Volt", "42 Volt", "0,84 Volt"],
        correct: 1
      }
    ],
    dial: [
      {
        q: "Satu divisi kecil pada dial indicator umumnya menunjukkan tingkat ketelitian sebesar...",
        a: ["0,1 mm", "0,05 mm", "0,01 mm", "0,02 mm"],
        correct: 2
      },
      {
        q: "Jarum kecil (revolution counter) pada dial indicator berfungsi untuk menghitung...",
        a: ["Jumlah putaran jarum besar (tiap 1 mm)", "Penyimpangan maksimum dalam desimal", "Sudut kemiringan poros", "Ketebalan bidang secara kasar"],
        correct: 0
      },
      {
        q: "Jarum kecil dial gauge menunjuk angka 3, dan jarum besar menunjuk garis 68. Berapakah nilai pengukurannya?",
        a: ["3,68 mm", "36,8 mm", "0,368 mm", "3,068 mm"],
        correct: 0
      }
    ]
  },

  init() {
    console.log('[MeasuringTools] Initializing measuring tools module...');

    // Bind back button
    const btnBack = document.getElementById('btn-back-from-measuring');
    if (btnBack) {
      btnBack.addEventListener('click', () => {
        if (typeof AudioManager !== 'undefined') AudioManager.playSFX('click');
        if (typeof App !== 'undefined') App.showScreen('menu');
      });
    }

    // Bind tool selector tabs
    const tabs = document.querySelectorAll('.measuring-tab-btn');
    tabs.forEach(tab => {
      tab.addEventListener('click', () => {
        const toolId = tab.getAttribute('data-tool');
        if (typeof AudioManager !== 'undefined') AudioManager.playSFX('click');
        this.selectTool(toolId);
      });
    });

    // Bind Mode Buttons
    const btnLearnMode = document.getElementById('btn-measuring-mode-learn');
    const btnPracticeMode = document.getElementById('btn-measuring-mode-practice');
    
    if (btnLearnMode) {
      btnLearnMode.addEventListener('click', () => {
        if (typeof AudioManager !== 'undefined') AudioManager.playSFX('click');
        this.setMode(false);
      });
    }
    if (btnPracticeMode) {
      btnPracticeMode.addEventListener('click', () => {
        if (typeof AudioManager !== 'undefined') AudioManager.playSFX('click');
        this.setMode(true);
      });
    }

    // Bind Answer Check
    const btnCheckAnswer = document.getElementById('btn-measuring-check');
    if (btnCheckAnswer) {
      btnCheckAnswer.addEventListener('click', () => {
        if (typeof AudioManager !== 'undefined') AudioManager.playSFX('click');
        this.checkAnswer();
      });
    }

    // Bind New Practice Value
    const btnNewPractice = document.getElementById('btn-measuring-new-val');
    if (btnNewPractice) {
      btnNewPractice.addEventListener('click', () => {
        if (typeof AudioManager !== 'undefined') AudioManager.playSFX('click');
        this.generateNewPracticeValue();
      });
    }

    // Bind Start Quiz
    const btnStartQuiz = document.getElementById('btn-measuring-start-quiz');
    if (btnStartQuiz) {
      btnStartQuiz.addEventListener('click', () => {
        if (typeof AudioManager !== 'undefined') AudioManager.playSFX('click');
        this.startQuiz();
      });
    }

    // Bind simulator input sliders
    const caliperSlider = document.getElementById('caliper-range-input');
    if (caliperSlider) {
      caliperSlider.addEventListener('input', (e) => {
        this.updateCaliperSimulator(parseFloat(e.target.value));
      });
    }

    const micrometerSlider = document.getElementById('micrometer-range-input');
    if (micrometerSlider) {
      micrometerSlider.addEventListener('input', (e) => {
        this.updateMicrometerSimulator(parseFloat(e.target.value));
      });
    }

    const dialSlider = document.getElementById('dial-range-input');
    if (dialSlider) {
      dialSlider.addEventListener('input', (e) => {
        this.updateDialSimulator(parseFloat(e.target.value));
      });
    }

    // Multimeter actions
    const selectMultimeter = document.getElementById('multimeter-selector');
    if (selectMultimeter) {
      selectMultimeter.addEventListener('change', () => {
        this.updateMultimeterSimulator();
      });
    }

    const probes = document.querySelectorAll('.multimeter-probe-target');
    probes.forEach(p => {
      p.addEventListener('click', () => {
        const value = parseFloat(p.getAttribute('data-value'));
        const type = p.getAttribute('data-type');
        if (typeof AudioManager !== 'undefined') AudioManager.playSFX('click');
        this.connectMultimeterProbes(type, value);
      });
    });
  },

  open() {
    this.quizMode = false;
    document.getElementById('measuring-quiz-workspace').style.display = 'none';
    document.getElementById('measuring-simulator-workspace').style.display = 'flex';
    this.selectTool('caliper');
    this.setMode(false);
  },

  selectTool(toolId) {
    this.currentTool = toolId;
    this.quizMode = false;
    document.getElementById('measuring-quiz-workspace').style.display = 'none';
    document.getElementById('measuring-simulator-workspace').style.display = 'flex';

    // Tabs active class
    const tabs = document.querySelectorAll('.measuring-tab-btn');
    tabs.forEach(tab => {
      if (tab.getAttribute('data-tool') === toolId) {
        tab.classList.add('active');
      } else {
        tab.classList.remove('active');
      }
    });

    const data = this.toolsData[toolId];
    if (!data) return;

    // Load static data
    document.getElementById('measuring-tool-title').textContent = data.name;
    document.getElementById('measuring-tool-img').src = data.image;
    document.getElementById('measuring-tool-desc').textContent = data.desc;
    document.getElementById('measuring-tool-usage').innerHTML = data.usage;
    document.getElementById('measuring-tool-reading').innerHTML = data.reading;

    // Toggle simulator screens
    document.getElementById('sim-caliper-box').style.display = toolId === 'caliper' ? 'block' : 'none';
    document.getElementById('sim-micrometer-box').style.display = toolId === 'micrometer' ? 'block' : 'none';
    document.getElementById('sim-multimeter-box').style.display = toolId === 'multimeter' ? 'block' : 'none';
    document.getElementById('sim-dial-box').style.display = toolId === 'dial' ? 'block' : 'none';

    // Reset simulator inputs
    if (toolId === 'caliper') {
      const caliperSlider = document.getElementById('caliper-range-input');
      if (caliperSlider) {
        caliperSlider.value = 0;
        this.updateCaliperSimulator(0);
      }
    } else if (toolId === 'micrometer') {
      const micrometerSlider = document.getElementById('micrometer-range-input');
      if (micrometerSlider) {
        micrometerSlider.value = 0;
        this.updateMicrometerSimulator(0);
      }
    } else if (toolId === 'dial') {
      const dialSlider = document.getElementById('dial-range-input');
      if (dialSlider) {
        dialSlider.value = 0;
        this.updateDialSimulator(0);
      }
    } else if (toolId === 'multimeter') {
      const selectMultimeter = document.getElementById('multimeter-selector');
      if (selectMultimeter) selectMultimeter.value = 'DCV10';
      this.connectMultimeterProbes('none', 0);
    }

    // Apply practice mode settings
    this.setMode(this.practiceMode);
  },

  setMode(isPractice) {
    this.practiceMode = isPractice;
    const btnLearn = document.getElementById('btn-measuring-mode-learn');
    const btnPractice = document.getElementById('btn-measuring-mode-practice');
    const practiceBox = document.getElementById('measuring-practice-controls');
    
    if (isPractice) {
      btnPractice.classList.add('active');
      btnLearn.classList.remove('active');
      practiceBox.style.display = 'block';
      this.generateNewPracticeValue();
    } else {
      btnLearn.classList.add('active');
      btnPractice.classList.remove('active');
      practiceBox.style.display = 'none';

      // Show the manual input control
      document.getElementById('caliper-manual-control').style.display = 'block';
      document.getElementById('micrometer-manual-control').style.display = 'block';
      document.getElementById('dial-manual-control').style.display = 'block';
      document.getElementById('multimeter-manual-control').style.display = 'block';

      // Re-read current values
      if (this.currentTool === 'caliper') {
        this.updateCaliperSimulator(parseFloat(document.getElementById('caliper-range-input').value));
      } else if (this.currentTool === 'micrometer') {
        this.updateMicrometerSimulator(parseFloat(document.getElementById('micrometer-range-input').value));
      } else if (this.currentTool === 'dial') {
        this.updateDialSimulator(parseFloat(document.getElementById('dial-range-input').value));
      } else if (this.currentTool === 'multimeter') {
        this.updateMultimeterSimulator();
      }
    }
  },

  generateNewPracticeValue() {
    document.getElementById('measuring-practice-feedback').style.display = 'none';
    document.getElementById('measuring-practice-ans').value = '';

    if (this.currentTool === 'caliper') {
      // 0.00 to 35.00 mm with 0.05 step
      const steps = Math.floor(Math.random() * 700); // 0 to 700
      this.practiceValue = (steps * 0.05).toFixed(2);
      
      // Hide manual slider, update simulator directly
      document.getElementById('caliper-manual-control').style.display = 'none';
      this.updateCaliperSimulator(parseFloat(this.practiceValue));
    } else if (this.currentTool === 'micrometer') {
      // 0.00 to 20.00 mm with 0.01 step
      const steps = Math.floor(Math.random() * 2000); // 0 to 2000
      this.practiceValue = (steps * 0.01).toFixed(2);
      
      document.getElementById('micrometer-manual-control').style.display = 'none';
      this.updateMicrometerSimulator(parseFloat(this.practiceValue));
    } else if (this.currentTool === 'dial') {
      // 0.00 to 5.00 mm with 0.01 step
      const steps = Math.floor(Math.random() * 500); // 0 to 500
      this.practiceValue = (steps * 0.01).toFixed(2);
      
      document.getElementById('dial-manual-control').style.display = 'none';
      this.updateDialSimulator(parseFloat(this.practiceValue));
    } else if (this.currentTool === 'multimeter') {
      document.getElementById('multimeter-manual-control').style.display = 'none';
      
      // Select random probe targets and random selector range
      const ranges = ['DCV10', 'DCV50', 'ACV250', 'Ohm10'];
      const randRange = ranges[Math.floor(Math.random() * ranges.length)];
      
      const selectMultimeter = document.getElementById('multimeter-selector');
      if (selectMultimeter) selectMultimeter.value = randRange;

      let type = 'none';
      let value = 0;

      if (randRange.startsWith('DCV')) {
        type = 'battery';
        // random battery voltage: 1.5, 3.0, 4.5, 6.0, 9.0, 12.0
        const batteryVals = [1.5, 3.0, 4.5, 9.0, 12.0];
        value = batteryVals[Math.floor(Math.random() * batteryVals.length)];
      } else if (randRange.startsWith('ACV')) {
        type = 'pln';
        value = 220;
      } else {
        type = 'resistor';
        // ohm: 10, 22, 100, 220, 470
        const resistorVals = [10, 22, 100, 220, 470];
        value = resistorVals[Math.floor(Math.random() * resistorVals.length)];
      }

      this.connectMultimeterProbes(type, value);
    }
  },

  checkAnswer() {
    const userAnsStr = document.getElementById('measuring-practice-ans').value.trim().replace(',', '.');
    const userAns = parseFloat(userAnsStr);
    const feedback = document.getElementById('measuring-practice-feedback');

    if (isNaN(userAns)) {
      feedback.style.display = 'block';
      feedback.style.color = '#ef4444';
      feedback.textContent = '❌ Masukkan jawaban berupa angka!';
      return;
    }

    const targetVal = parseFloat(this.practiceValue);
    let isCorrect = false;

    // Tolerance values
    if (this.currentTool === 'caliper') {
      // Tolerance 0.05 mm
      isCorrect = Math.abs(userAns - targetVal) < 0.051;
    } else if (this.currentTool === 'micrometer') {
      // Tolerance 0.01 mm
      isCorrect = Math.abs(userAns - targetVal) < 0.011;
    } else if (this.currentTool === 'dial') {
      // Tolerance 0.01 mm
      isCorrect = Math.abs(userAns - targetVal) < 0.011;
    } else if (this.currentTool === 'multimeter') {
      // Multimeter reading is exact
      isCorrect = Math.abs(userAns - targetVal) < 0.1;
    }

    feedback.style.display = 'block';
    if (isCorrect) {
      if (typeof AudioManager !== 'undefined') AudioManager.playSFX('correct');
      feedback.style.color = '#10b981';
      feedback.innerHTML = `✅ <strong>Hebat!</strong> Jawaban Anda benar: <strong>${targetVal}</strong>. Anda mendapatkan <strong>+50 XP</strong>!`;
      
      // Award XP
      if (typeof ProgressManager !== 'undefined') {
        ProgressManager.addXP(50);
        this.showScreenXpToast();
      }
      
      setTimeout(() => this.generateNewPracticeValue(), 3000);
    } else {
      if (typeof AudioManager !== 'undefined') AudioManager.playSFX('wrong');
      feedback.style.color = '#ef4444';
      feedback.innerHTML = `❌ <strong>Kurang Tepat!</strong> Hasil pengukuran asli: <strong>${targetVal}</strong>. Coba lagi!`;
    }
  },

  showScreenXpToast() {
    if (typeof App !== 'undefined' && App.showToast) {
      App.showToast('🎉 +50 XP Tersinkronisasi ke Akun Anda!', 'success');
    }
  },

  // ════════════════════════════════════════════════════════════
  //  CALIPER SIMULATOR LOGIC
  // ════════════════════════════════════════════════════════════
  updateCaliperSimulator(val) {
    // Save state for learn mode
    if (!this.practiceMode) {
      this.practiceValue = val.toFixed(2);
      document.getElementById('caliper-hud-readout').textContent = `${this.practiceValue} mm`;
    }

    // SVG elements
    const vernierGroup = document.getElementById('caliper-svg-vernier');
    const jawsGap = document.getElementById('caliper-svg-jaws-gap');

    if (vernierGroup) {
      // Scale translation: 1 mm = 5.2px in SVG workspace
      const translation = val * 5.2;
      vernierGroup.setAttribute('transform', `translate(${translation}, 0)`);
    }

    if (jawsGap) {
      // Update gap width
      jawsGap.setAttribute('width', Math.max(0, val * 5.2));
    }
  },

  // ════════════════════════════════════════════════════════════
  //  MICROMETER SIMULATOR LOGIC
  // ════════════════════════════════════════════════════════════
  updateMicrometerSimulator(val) {
    if (!this.practiceMode) {
      this.practiceValue = val.toFixed(2);
      document.getElementById('micrometer-hud-readout').textContent = `${this.practiceValue} mm`;
    }

    // SVG thimble translation: 1 mm = 12px horizontal translation
    const thimble = document.getElementById('micrometer-svg-thimble');
    if (thimble) {
      const translation = val * 12;
      thimble.setAttribute('transform', `translate(${translation}, 0)`);
    }

    // Scroll thimble ticks vertical scale based on thimble rotation
    // 0.50 mm is 1 full rotation of 50 thimble ticks.
    // 1 tick = 0.01 mm = 6.4px vertical scroll spacing
    const thimbleTicks = document.getElementById('micrometer-svg-thimble-ticks');
    if (thimbleTicks) {
      // Fractional part relative to 0.50 mm rotation cycle
      const rotationCycleVal = val % 0.50;
      const ticksIndex = Math.round(rotationCycleVal / 0.01) % 50;
      
      // Translate thimble ticks vertically so that ticksIndex lines up with sleeve baseline (y=75)
      // Base thimble ticks position has mark 0 aligned at y=75.
      // Scrolling up is negative translation.
      const scrollY = -ticksIndex * 6.4;
      thimbleTicks.setAttribute('transform', `translate(0, ${scrollY})`);
    }
  },

  // ════════════════════════════════════════════════════════════
  //  DIAL SIMULATOR LOGIC
  // ════════════════════════════════════════════════════════════
  updateDialSimulator(val) {
    if (!this.practiceMode) {
      this.practiceValue = val.toFixed(2);
      document.getElementById('dial-hud-readout').textContent = `${this.practiceValue} mm`;
    }

    // Main needle pointer: rotates 360 degrees for every 1.00 mm
    const mainNeedle = document.getElementById('dial-svg-main-needle');
    if (mainNeedle) {
      // Rotation angle: 360 degrees * val
      const angle = val * 360;
      mainNeedle.setAttribute('transform', `rotate(${angle}, 110, 110)`);
    }

    // Sub counter needle: rotates 36 degrees for every 1.00 mm (0-10 mm scale)
    const subNeedle = document.getElementById('dial-svg-sub-needle');
    if (subNeedle) {
      const angle = val * 36;
      subNeedle.setAttribute('transform', `rotate(${angle}, 80, 110)`);
    }

    // Animate plunger vertical displacement
    const plunger = document.getElementById('dial-svg-plunger');
    if (plunger) {
      // Spindle goes up as value increases
      const displacement = -val * 16;
      plunger.setAttribute('transform', `translate(0, ${displacement})`);
    }
  },

  // ════════════════════════════════════════════════════════════
  //  MULTIMETER SIMULATOR LOGIC
  // ════════════════════════════════════════════════════════════
  updateMultimeterSimulator() {
    const range = document.getElementById('multimeter-selector').value;
    const readout = document.getElementById('multimeter-hud-readout');

    if (!this.practiceMode) {
      readout.textContent = `Range: ${range} | Probe Terlepas`;
      this.connectMultimeterProbes('none', 0);
    }
  },

  connectMultimeterProbes(type, val) {
    const range = document.getElementById('multimeter-selector').value;
    const needle = document.getElementById('multimeter-svg-needle');
    const readout = document.getElementById('multimeter-hud-readout');
    
    // Scale properties: Needle pivot is at (150, 200).
    // Angle starts at left (-60 degrees for 0 value, or ∞ for Ohm)
    // to right (+60 degrees for full scale).
    let angle = -60; // default rest position
    let displayedVal = 0;

    if (type !== 'none') {
      if (range === 'DCV10' && type === 'battery') {
        // DCV 10 scale: DC 0 to 10 V
        displayedVal = Math.min(10, val);
        const fraction = displayedVal / 10;
        angle = -60 + fraction * 120;
      } else if (range === 'DCV50' && type === 'battery') {
        // DCV 50 scale: DC 0 to 50 V
        displayedVal = Math.min(50, val);
        const fraction = displayedVal / 50;
        angle = -60 + fraction * 120;
      } else if (range === 'ACV250' && type === 'pln') {
        // ACV 250 scale: AC 0 to 250 V
        displayedVal = Math.min(250, val);
        const fraction = displayedVal / 250;
        angle = -60 + fraction * 120;
      } else if (range === 'Ohm10' && type === 'resistor') {
        // Ohm x10 range: non-linear scale.
        // Base resistance scales:
        // Needle at -60 is ∞, 0 is at +60.
        // Approx Ohm scale ticks angles:
        // R=0 -> +60 deg
        // R=10 Ohm -> +30 deg
        // R=22 Ohm -> 0 deg (center)
        // R=100 Ohm -> -30 deg
        // R=220 Ohm -> -45 deg
        // R=470 Ohm -> -52 deg
        // R=∞ -> -60 deg
        const ohmValue = val;
        displayedVal = ohmValue; // in Ohm

        if (ohmValue <= 10) {
          angle = 60 - (ohmValue / 10) * 30; // 60 to 30
        } else if (ohmValue <= 22) {
          angle = 30 - ((ohmValue - 10) / 12) * 30; // 30 to 0
        } else if (ohmValue <= 100) {
          angle = 0 - ((ohmValue - 22) / 78) * 30; // 0 to -30
        } else if (ohmValue <= 220) {
          angle = -30 - ((ohmValue - 100) / 120) * 15; // -30 to -45
        } else if (ohmValue <= 470) {
          angle = -45 - ((ohmValue - 220) / 250) * 7; // -45 to -52
        } else {
          angle = -52 - 8; // near infinity
        }
      } else {
        // Mismatch range selection (e.g. DCV 10 measuring 220V AC, or measuring resistor with DCV)
        // Needle behaves incorrectly or stays at 0 (rest) to simulate real multimeter protection!
        angle = -60;
        displayedVal = 0;
        if (typeof App !== 'undefined' && App.showToast) {
          App.showToast('⚠️ Range selector multimeter salah/mismatch!', 'warning');
        }
      }
    }

    // Set needle angle
    if (needle) {
      needle.style.transition = 'transform 0.6s cubic-bezier(0.25, 0.46, 0.45, 0.94)';
      needle.setAttribute('transform', `rotate(${angle}, 150, 200)`);
    }

    // Update state
    this.practiceValue = displayedVal.toFixed(1);

    if (this.practiceMode) {
      readout.textContent = `Status: Terhubung ke beban. Silakan baca Multimeter analog!`;
    } else {
      if (type === 'none') {
        readout.textContent = `Probe Terlepas | Jarum di posisi Rest (0)`;
      } else {
        readout.textContent = `Terhubung | Hasil Pembacaan Jarum: ${this.practiceValue} ${range.startsWith('Ohm') ? 'Ohm' : 'Volt'}`;
      }
    }
  },

  // ════════════════════════════════════════════════════════════
  //  MINI QUIZ ENGINE
  // ════════════════════════════════════════════════════════════
  startQuiz() {
    this.quizMode = true;
    this.quizIndex = 0;
    this.quizScore = 0;

    document.getElementById('measuring-simulator-workspace').style.display = 'none';
    document.getElementById('measuring-quiz-workspace').style.display = 'flex';

    this.showQuizQuestion();
  },

  showQuizQuestion() {
    const questions = this.quizQuestions[this.currentTool];
    const data = questions[this.quizIndex];
    
    // Header title
    document.getElementById('measuring-quiz-header-title').textContent = `Kuis Evaluasi — Pertanyaan ${this.quizIndex + 1} dari 3`;
    document.getElementById('measuring-quiz-question-text').textContent = data.q;
    
    const optionsContainer = document.getElementById('measuring-quiz-options-box');
    optionsContainer.innerHTML = '';

    data.a.forEach((opt, idx) => {
      const btn = document.createElement('button');
      btn.className = 'measuring-quiz-opt-btn';
      btn.textContent = opt;
      btn.addEventListener('click', () => this.submitQuizAnswer(idx));
      optionsContainer.appendChild(btn);
    });

    // Reset status box
    const statusBox = document.getElementById('measuring-quiz-status-box');
    statusBox.style.display = 'none';
  },

  submitQuizAnswer(userIdx) {
    const questions = this.quizQuestions[this.currentTool];
    const data = questions[this.quizIndex];
    const isCorrect = userIdx === data.correct;

    // Highlight correct/incorrect buttons
    const btns = document.querySelectorAll('.measuring-quiz-opt-btn');
    btns.forEach((btn, idx) => {
      btn.disabled = true; // disable all
      if (idx === data.correct) {
        btn.classList.add('correct');
      } else if (idx === userIdx) {
        btn.classList.add('wrong');
      }
    });

    const statusBox = document.getElementById('measuring-quiz-status-box');
    statusBox.style.display = 'block';

    if (isCorrect) {
      if (typeof AudioManager !== 'undefined') AudioManager.playSFX('correct');
      this.quizScore++;
      statusBox.style.color = '#10b981';
      statusBox.innerHTML = '✅ <strong>Benar!</strong> Jawaban Anda tepat sekali.';
    } else {
      if (typeof AudioManager !== 'undefined') AudioManager.playSFX('wrong');
      statusBox.style.color = '#ef4444';
      statusBox.innerHTML = `❌ <strong>Salah!</strong> Jawaban yang benar adalah: <strong>${data.a[data.correct]}</strong>`;
    }

    // Auto proceed to next question
    setTimeout(() => {
      this.quizIndex++;
      if (this.quizIndex < questions.length) {
        this.showQuizQuestion();
      } else {
        this.showQuizResult();
      }
    }, 2000);
  },

  showQuizResult() {
    document.getElementById('measuring-quiz-header-title').textContent = `Kuis Selesai!`;
    const optionsContainer = document.getElementById('measuring-quiz-options-box');
    
    const xpEarned = this.quizScore * 50; // +50 XP per correct answer
    
    let html = `
      <div style="text-align: center; display: flex; flex-direction: column; gap: 15px; width: 100%;">
        <div style="font-size: 3rem;">🏆</div>
        <h3 style="font-size: 1.3rem; font-weight: 850; color: var(--clr-primary); margin: 0;">Skor Akhir Kuis: ${this.quizScore} / 3</h3>
        <p style="font-size: 0.95rem; color: var(--text-secondary); line-height: 1.5; margin: 0;">
          Anda menjawab <strong>${this.quizScore}</strong> pertanyaan secara benar dan mendapatkan total <strong>+${xpEarned} XP</strong>!
        </p>
    `;

    if (xpEarned > 0) {
      html += `
        <div style="background: rgba(16,185,129,0.1); border: 1px solid rgba(16,185,129,0.3); border-radius: 12px; padding: 12px; font-size: 0.85rem; color: #10b981; font-weight: 700;">
          🎉 XP Anda telah ditambahkan dan disinkronkan ke database cloud!
        </div>
      `;
      // Award XP
      if (typeof ProgressManager !== 'undefined') {
        ProgressManager.addXP(xpEarned);
        this.showScreenXpToast();
      }
    }

    html += `
        <button id="btn-measuring-finish-quiz" class="btn btn-primary" style="margin-top: 15px; padding: 10px 24px; font-weight: 850; border-radius: 50px; cursor: pointer; align-self: center;">
          Kembali ke Simulator ⚙️
        </button>
      </div>
    `;

    optionsContainer.innerHTML = html;
    document.getElementById('measuring-quiz-question-text').textContent = '';
    document.getElementById('measuring-quiz-status-box').style.display = 'none';

    // Bind finish button
    document.getElementById('btn-measuring-finish-quiz').addEventListener('click', () => {
      if (typeof AudioManager !== 'undefined') AudioManager.playSFX('click');
      this.quizMode = false;
      document.getElementById('measuring-quiz-workspace').style.display = 'none';
      document.getElementById('measuring-simulator-workspace').style.display = 'flex';
      this.selectTool(this.currentTool);
    });
  }
};
