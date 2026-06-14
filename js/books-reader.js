const BooksReader = {
  currentBook: null,
  currentPage: 0,
  completedBooks: [],

  init() {
    console.log('[BooksReader] Initializing...');
    this.loadProgress();

    // Bind event listeners for navigation buttons
    this._bindClick('btn-close-tools-guide', () => this.close());
    this._bindClick('btn-back-to-library', () => this.showLibrary());
    this._bindClick('btn-reader-prev', () => this.prevPage());
    this._bindClick('btn-reader-next', () => this.nextPage());

    // Bind direct menu buttons if they exist
    const btnDirectTools = document.getElementById('btn-goto-tools-direct');
    if (btnDirectTools) {
      btnDirectTools.addEventListener('click', () => {
        if (typeof App !== 'undefined') {
          // Play click audio
          if (typeof AudioManager !== 'undefined') AudioManager.playSFX('click');
          this.open();
        }
      });
    }

    // Auto-update library grid inside modal if initialized
    this.renderLibrary();
  },

  _bindClick(id, callback) {
    const el = document.getElementById(id);
    if (el) {
      el.addEventListener('click', (e) => {
        if (typeof AudioManager !== 'undefined') AudioManager.playSFX('click');
        callback(e);
      });
    }
  },

  loadProgress() {
    try {
      const saved = localStorage.getItem('automaster_completed_books');
      if (saved) {
        this.completedBooks = JSON.parse(saved);
      }
    } catch (e) {
      console.warn('[BooksReader] Failed to load books progress:', e);
    }
  },

  saveProgress() {
    try {
      localStorage.setItem('automaster_completed_books', JSON.stringify(this.completedBooks));
    } catch (e) {
      console.warn('[BooksReader] Failed to save books progress:', e);
    }
  },

  open() {
    const modal = document.getElementById('modal-tools-guide');
    if (modal) {
      modal.style.display = 'flex';
      this.showLibrary();
    }
  },

  close() {
    const modal = document.getElementById('modal-tools-guide');
    if (modal) {
      modal.style.display = 'none';
    }
  },

  showLibrary() {
    this.currentBook = null;
    document.getElementById('book-library-screen').style.display = 'flex';
    document.getElementById('book-reader-screen').style.display = 'none';
    this.renderLibrary();
  },

  renderLibrary() {
    const grid = document.querySelector('.books-library-grid');
    if (!grid) return;

    grid.innerHTML = '';
    
    // Check if BooksData is available
    if (typeof BooksData === 'undefined') {
      console.error('[BooksReader] BooksData not defined.');
      return;
    }

    BooksData.forEach(book => {
      const isCompleted = this.completedBooks.includes(book.id);
      
      const card = document.createElement('div');
      card.className = 'book-cover-item';
      card.style.setProperty('--book-theme-color', book.color);
      card.style.setProperty('--book-shadow-color', book.color + '22');
      
      // Render status badge
      const statusBadge = isCompleted 
        ? `<span class="book-badge-status" style="background: rgba(16, 185, 129, 0.15); color: #10b981; border: 1px solid rgba(16, 185, 129, 0.3);">Selesai ✓</span>`
        : `<span class="book-badge-status" style="background: rgba(249, 115, 22, 0.15); color: #f97316; border: 1px solid rgba(249, 115, 22, 0.3);">+50 XP</span>`;

      card.innerHTML = `
        ${statusBadge}
        <div class="book-spine-spine" style="background-image: url('${book.coverImage}'); background-color: ${book.color}33; border: 2px solid ${book.color};">
          <div style="position: absolute; bottom: 12px; left: 12px; right: 12px; font-weight: 900; font-size: 0.65rem; color: #fff; text-shadow: 0 2px 4px rgba(0,0,0,0.8); text-transform: uppercase;">
            ${book.title}
          </div>
        </div>
        <h4 style="color: #fff; margin-bottom: 6px; font-weight: 800; font-size: 0.95rem;">${book.title}</h4>
        <p style="font-size: 0.75rem; color: var(--text-muted); line-height: 1.4; margin: 0; flex-grow: 1;">${book.description}</p>
        <button class="btn" style="margin-top: 15px; padding: 8px 20px; font-size: 0.75rem; border-radius: 50px; background: ${book.color}; color: white; width: 100%; font-weight: 800;">
          ${isCompleted ? 'Baca Ulang 📖' : 'Buka Buku 📖'}
        </button>
      `;

      card.addEventListener('click', () => {
        if (typeof AudioManager !== 'undefined') AudioManager.playSFX('click');
        this.openBook(book.id);
      });

      grid.appendChild(card);
    });
  },

  openBook(bookId) {
    this.currentBook = BooksData.find(b => b.id === bookId);
    if (!this.currentBook) return;

    this.currentPage = 0; // Page 0 is Cover, Page 1..N content, Page N+1 is Quiz
    
    document.getElementById('book-library-screen').style.display = 'none';
    document.getElementById('book-reader-screen').style.display = 'flex';

    this.showPage(0);
  },

  showPage(pageIndex) {
    this.currentPage = pageIndex;
    const book = this.currentBook;
    const totalPages = book.pages.length; // Content pages count
    const maxPageIndex = totalPages + 1; // Cover (0) + Pages (1..N) + Quiz (N+1)

    // Elements
    const leftPage = document.querySelector('.book-page-left');
    const rightPage = document.querySelector('.book-page-right');
    const pageImg = document.getElementById('reader-page-image');
    const pageTitle = document.getElementById('reader-page-title');
    const pageContent = document.getElementById('reader-page-content');
    const quizContainer = document.getElementById('reader-quiz-container');
    const prevBtn = document.getElementById('btn-reader-prev');
    const nextBtn = document.getElementById('btn-reader-next');
    const pageIndicator = document.getElementById('reader-page-indicator');

    // Reset styles / page turn animation class
    leftPage.classList.remove('page-turning');
    rightPage.classList.remove('page-turning');
    void leftPage.offsetWidth; // Trigger reflow to restart animation
    leftPage.classList.add('page-turning');
    rightPage.classList.add('page-turning');

    // Page indicator text
    if (pageIndex === 0) {
      pageIndicator.textContent = 'Sampul Buku';
    } else if (pageIndex <= totalPages) {
      pageIndicator.textContent = `Halaman ${pageIndex} dari ${totalPages}`;
    } else {
      pageIndicator.textContent = 'Kuis Mini';
    }

    // Toggle navigation button visibility
    prevBtn.style.visibility = pageIndex === 0 ? 'hidden' : 'visible';
    nextBtn.textContent = pageIndex === maxPageIndex ? 'Jawab & Selesaikan 🏁' : 'Selanjutnya ▶';
    
    // Hide content areas by default
    pageContent.style.display = 'block';
    quizContainer.style.display = 'none';

    if (pageIndex === 0) {
      // 📕 1. COVER PAGE
      pageImg.src = book.coverImage;
      pageImg.style.display = 'block';
      
      pageTitle.textContent = book.title;
      pageTitle.style.color = book.color;
      
      const isCompleted = this.completedBooks.includes(book.id);
      pageContent.innerHTML = `
        <div style="display: flex; flex-direction: column; gap: 15px; text-align: left; padding-top: 10px;">
          <p style="font-size: 0.95rem; line-height: 1.6; color: var(--text-secondary);">
            Selamat datang di Pustaka Buku <strong>"${book.title}"</strong>. Buku ini dirancang khusus untuk memandu Anda memahami peralatan Teknik Kendaraan Ringan.
          </p>
          <div style="background: rgba(255,255,255,0.02); border-left: 4px solid ${book.color}; padding: 15px; border-radius: 8px;">
            <strong style="color: white; display: block; margin-bottom: 6px;">📋 Deskripsi Pembelajaran:</strong>
            <span style="font-size: 0.85rem; color: var(--text-muted); line-height: 1.5; display: block;">
              ${book.description}
            </span>
          </div>
          ${isCompleted 
            ? `<div style="color: #10b981; font-weight: 700; font-size: 0.9rem; display: flex; align-items: center; gap: 6px;">
                 <span>✓</span> Kamu sudah membaca buku ini &amp; mengklaim +50 XP.
               </div>`
            : `<div style="color: #f97316; font-weight: 800; font-size: 0.9rem;">
                 🏆 Selesaikan buku ini &amp; jawab kuis di akhir untuk mendapatkan +50 XP!
               </div>`
          }
          <button id="btn-start-reading" class="btn" style="background: ${book.color}; color: white; padding: 12px 24px; border-radius: 50px; font-weight: 850; align-self: flex-start; margin-top: 10px; cursor: pointer;">
            Mulai Membaca 📖
          </button>
        </div>
      `;

      // Bind button click
      const startReadingBtn = document.getElementById('btn-start-reading');
      if (startReadingBtn) {
        startReadingBtn.addEventListener('click', () => {
          if (typeof AudioManager !== 'undefined') AudioManager.playSFX('click');
          this.showPage(1);
        });
      }

    } else if (pageIndex <= totalPages) {
      // 📘 2. CONTENT PAGES
      const pageData = book.pages[pageIndex - 1];
      pageImg.src = pageData.image;
      pageImg.style.display = 'block';

      pageTitle.textContent = pageData.title;
      pageTitle.style.color = book.color;
      pageContent.innerHTML = `<div style="padding-top: 5px;">${pageData.content}</div>`;

    } else {
      // 🎯 3. QUIZ PAGE
      pageImg.src = book.coverImage;
      pageImg.style.display = 'block';

      pageTitle.textContent = "Kuis Mini Evaluasi";
      pageTitle.style.color = '#ff6b35';
      pageContent.style.display = 'none';
      quizContainer.style.display = 'flex';

      // Load quiz data
      const quiz = book.quiz;
      const qText = document.getElementById('reader-quiz-question');
      const qOptions = document.getElementById('reader-quiz-options');
      const qFeedback = document.getElementById('reader-quiz-feedback');

      qText.textContent = quiz.question;
      qFeedback.style.display = 'none';

      // Render options
      qOptions.innerHTML = '';
      quiz.options.forEach((opt, idx) => {
        const btnOpt = document.createElement('button');
        btnOpt.className = 'btn';
        btnOpt.style.cssText = `
          text-align: left;
          padding: 12px 20px;
          border-radius: 12px;
          border: 1px solid rgba(255,255,255,0.08);
          background: rgba(255,255,255,0.03);
          color: white;
          font-weight: 600;
          font-size: 0.85rem;
          transition: all 0.2s ease;
          width: 100%;
          cursor: pointer;
        `;
        
        btnOpt.innerHTML = `<span style="display: inline-block; width: 25px; height: 25px; line-height: 25px; text-align: center; background: rgba(255,255,255,0.08); border-radius: 50%; margin-right: 10px; font-weight: 800; font-size: 0.75rem;">${String.fromCharCode(65 + idx)}</span> ${opt}`;
        
        btnOpt.addEventListener('click', () => {
          if (typeof AudioManager !== 'undefined') AudioManager.playSFX('click');
          // Clear selected options styling
          Array.from(qOptions.children).forEach(child => {
            child.style.borderColor = 'rgba(255,255,255,0.08)';
            child.style.background = 'rgba(255,255,255,0.03)';
            child.classList.remove('selected-option');
          });
          // Highlight selected
          btnOpt.style.borderColor = book.color;
          btnOpt.style.background = book.color + '15';
          btnOpt.classList.add('selected-option');
        });

        qOptions.appendChild(btnOpt);
      });
    }
  },

  prevPage() {
    if (this.currentPage > 0) {
      if (typeof AudioManager !== 'undefined') AudioManager.playSFX('click');
      this.showPage(this.currentPage - 1);
    }
  },

  nextPage() {
    const totalPages = this.currentBook.pages.length;
    const maxPageIndex = totalPages + 1;

    if (this.currentPage < maxPageIndex) {
      if (typeof AudioManager !== 'undefined') AudioManager.playSFX('click');
      this.showPage(this.currentPage + 1);
    } else {
      // Submit quiz action
      this.submitQuiz();
    }
  },

  submitQuiz() {
    const book = this.currentBook;
    const qOptions = document.getElementById('reader-quiz-options');
    const selectedBtn = qOptions.querySelector('.selected-option');
    const qFeedback = document.getElementById('reader-quiz-feedback');

    if (!selectedBtn) {
      qFeedback.style.display = 'block';
      qFeedback.style.color = '#f97316';
      qFeedback.textContent = '⚠️ Silakan pilih salah satu jawaban terlebih dahulu!';
      return;
    }

    const selectedIdx = Array.from(qOptions.children).indexOf(selectedBtn);
    const correctIdx = book.quiz.answerIndex;

    if (selectedIdx === correctIdx) {
      // Play correct audio
      if (typeof AudioManager !== 'undefined') AudioManager.playSFX('correct');
      
      qFeedback.style.display = 'block';
      qFeedback.style.color = '#10b981';
      qFeedback.innerHTML = `🎉 <strong>Luar Biasa! Jawabanmu Benar!</strong>`;

      // Lock buttons
      Array.from(qOptions.children).forEach((btn, idx) => {
        btn.disabled = true;
        if (idx === correctIdx) {
          btn.style.borderColor = '#10b981';
          btn.style.background = 'rgba(16, 185, 129, 0.15)';
        }
      });

      // Claim rewards if not completed before
      const isCompletedBefore = this.completedBooks.includes(book.id);
      if (!isCompletedBefore) {
        this.completedBooks.push(book.id);
        this.saveProgress();

        // Add 50 XP
        if (typeof ProgressManager !== 'undefined') {
          const xpResult = ProgressManager.addXP(50);
          
          if (typeof App !== 'undefined') {
            App.updatePlayerInfo();
            App.showToast('📚 Buku Selesai! Kamu mendapatkan +50 XP!', 'success');
            
            if (xpResult && xpResult.rankUp) {
              App.showToast(`🎉 Selamat! Peringkat naik menjadi "${xpResult.newRank.name}"!`, 'success');
            }

            // Sync scores
            if (typeof SyncManager !== 'undefined' && navigator.onLine) {
              const playerData = ProgressManager.getPlayerData();
              SyncManager.pushProgress('tools_book_' + book.id, 'read', 100, 3, 50);
            }
          }
        }
      } else {
        if (typeof App !== 'undefined') {
          App.showToast('📚 Buku dibaca ulang. Jawaban Anda benar!', 'success');
        }
      }

      // Automatically return to library after 2 seconds
      setTimeout(() => {
        this.showLibrary();
      }, 2000);

    } else {
      // Incorrect answer
      if (typeof AudioManager !== 'undefined') AudioManager.playSFX('wrong');

      qFeedback.style.display = 'block';
      qFeedback.style.color = '#ef4444';
      qFeedback.textContent = '❌ Jawaban salah! Silakan coba pikirkan kembali dan pilih jawaban lain.';

      // Shake animation effect
      selectedBtn.style.borderColor = '#ef4444';
      selectedBtn.style.background = 'rgba(239, 68, 68, 0.1)';
      selectedBtn.style.animation = 'shake-horizontal 0.4s ease';
      setTimeout(() => {
        selectedBtn.style.animation = '';
      }, 400);
    }
  }
};
