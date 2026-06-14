import os
import sys
import json
import sqlite3
import hashlib
from datetime import datetime
from urllib.parse import urlparse, parse_qs
from http.server import ThreadingHTTPServer, SimpleHTTPRequestHandler

PORT = 8000
TEACHER_SECRET = "AutoMaster2024!Guru"
DB_FILE = "automaster.db"

def init_db():
    """Initializes SQLite database and tables with WAL mode for concurrency."""
    conn = sqlite3.connect(DB_FILE)
    conn.execute("PRAGMA journal_mode=WAL;")
    cursor = conn.cursor()
    
    # Table users
    cursor.execute('''
        CREATE TABLE IF NOT EXISTS users (
            nis TEXT PRIMARY KEY,
            nama TEXT NOT NULL,
            kelas TEXT NOT NULL,
            wa TEXT,
            password_hash TEXT NOT NULL,
            registered_at TEXT NOT NULL
        )
    ''')
    
    # Table scores
    cursor.execute('''
        CREATE TABLE IF NOT EXISTS scores (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            nis TEXT NOT NULL,
            nama TEXT NOT NULL,
            level INTEGER NOT NULL,
            phase TEXT NOT NULL,
            score INTEGER NOT NULL,
            stars INTEGER NOT NULL,
            xp INTEGER NOT NULL,
            timestamp TEXT NOT NULL,
            FOREIGN KEY (nis) REFERENCES users(nis)
        )
    ''')
    
    # Table sessions
    cursor.execute('''
        CREATE TABLE IF NOT EXISTS sessions (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            nis TEXT NOT NULL,
            login_time TEXT NOT NULL,
            device TEXT,
            user_agent TEXT,
            FOREIGN KEY (nis) REFERENCES users(nis)
        )
    ''')
    
    conn.commit()
    conn.close()
    print(f"[*] Database '{DB_FILE}' initialized and ready.")

def hash_sha256(input_str):
    return hashlib.sha256(input_str.encode('utf-8')).hexdigest()

class LocalServerHandler(SimpleHTTPRequestHandler):
    def end_headers(self):
        # Always inject CORS headers to allow cross-origin requests from other LAN PCs
        self.send_header('Access-Control-Allow-Origin', '*')
        self.send_header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS')
        self.send_header('Access-Control-Allow-Headers', 'Content-Type, X-Requested-With')
        super().end_headers()

    def do_OPTIONS(self):
        # Handle preflight CORS requests
        self.send_response(204)
        self.end_headers()

    def do_GET(self):
        parsed_url = urlparse(self.path)
        path = parsed_url.path

        if path == '/api' or path == '/api/':
            self.handle_api_get(parsed_url.query)
        elif path == '/dashboard' or path == '/dashboard/':
            self.serve_dashboard()
        else:
            # Fall back to serving static files (index.html, js, css, etc.)
            super().do_GET()

    def do_POST(self):
        parsed_url = urlparse(self.path)
        path = parsed_url.path

        if path == '/api' or path == '/api/':
            # Read POST body
            content_length = int(self.headers.get('Content-Length', 0))
            body_bytes = self.rfile.read(content_length)
            try:
                body_str = body_bytes.decode('utf-8')
                body_data = json.loads(body_str) if body_str else {}
            except Exception as e:
                self.send_json_response(200, {"success": False, "message": f"Invalid JSON body: {str(e)}"})
                return

            self.handle_api_post(body_data)
        else:
            self.send_error(404, "Not Found")

    # ════════════════════════════════════════════════════════════
    #  API HANDLERS
    # ════════════════════════════════════════════════════════════

    def handle_api_get(self, query_str):
        params = parse_qs(query_str)
        # Flatten parse_qs lists
        params = {k: v[0] for k, v in params.items() if v}
        action = params.get('action', '').lower().strip()

        if action == 'getprogress':
            self.api_get_progress(params)
        elif action == 'leaderboard':
            self.api_get_leaderboard(params)
        elif action == 'getstudents':
            self.api_get_students(params)
        elif action == 'ping':
            self.send_json_response(200, {
                "success": True, 
                "message": "AutoMaster Local API is running",
                "timestamp": datetime.now().isoformat()
            })
        else:
            self.send_json_response(200, {
                "success": False, 
                "message": f"Unknown action: {action}. Valid GET actions: getProgress, leaderboard, getStudents, ping"
            })

    def handle_api_post(self, data):
        action = data.get('action', '').lower().strip()

        if action == 'register':
            self.api_post_register(data)
        elif action == 'login':
            self.api_post_login(data)
        elif action == 'syncprogress':
            self.api_post_sync_progress(data)
        elif action == 'updateprofile':
            self.api_post_update_profile(data)
        elif action == 'resetprogress':
            self.api_post_reset_progress(data)
        else:
            self.send_json_response(200, {
                "success": False, 
                "message": f"Unknown action: {action}. Valid POST actions: register, login, syncProgress, updateProfile, resetProgress"
            })

    # ── GET API Implementations ──

    def api_get_progress(self, params):
        nis = params.get('nis', '').strip()
        if not nis:
            self.send_json_response(200, {"success": False, "message": "Parameter nis wajib diisi."})
            return

        conn = sqlite3.connect(DB_FILE)
        cursor = conn.cursor()
        
        # Verify user
        cursor.execute("SELECT nama, kelas FROM users WHERE nis = ?", (nis,))
        user = cursor.fetchone()
        if not user:
            conn.close()
            self.send_json_response(200, {"success": False, "message": "NIS tidak ditemukan."})
            return
        
        nama, kelas = user
        
        # Fetch scores
        cursor.execute("SELECT level, phase, score, stars, xp, timestamp FROM scores WHERE nis = ?", (nis,))
        rows = cursor.fetchall()
        conn.close()

        scores = []
        total_xp = 0
        total_stars = 0
        total_score = 0
        levels_completed = set()

        for r in rows:
            entry = {
                "level": str(r[0]),
                "phase": str(r[1]),
                "score": int(r[2]),
                "stars": int(r[3]),
                "xp": int(r[4]),
                "timestamp": str(r[5])
            }
            scores.append(entry)
            total_xp += entry["xp"]
            total_stars += entry["stars"]
            total_score += entry["score"]
            levels_completed.add(entry["level"])

        self.send_json_response(200, {
            "success": True,
            "message": "Progress ditemukan",
            "data": {
                "nis": nis,
                "nama": nama,
                "kelas": kelas,
                "scores": scores,
                "summary": {
                    "totalScore": total_score,
                    "totalStars": total_stars,
                    "totalXP": total_xp,
                    "levelsCompleted": len(levels_completed),
                    "totalEntries": len(scores)
                }
            }
        })

    def api_get_leaderboard(self, params):
        level_filter = params.get('level', '').strip()
        limit = params.get('limit', '50')
        try:
            limit = int(limit)
        except:
            limit = 50

        conn = sqlite3.connect(DB_FILE)
        cursor = conn.cursor()

        # Fetch scores
        if level_filter and level_filter != 'all':
            cursor.execute("SELECT nis, nama, score, stars, xp FROM scores WHERE level = ?", (level_filter,))
        else:
            cursor.execute("SELECT nis, nama, score, stars, xp FROM scores")
        rows = cursor.fetchall()
        conn.close()

        # Aggregate best scores per student
        best_scores = {}
        for r in rows:
            nis, nama, score, stars, xp = r
            if nis not in best_scores:
                best_scores[nis] = {
                    "nis": nis,
                    "nama": nama,
                    "totalScore": 0,
                    "totalStars": 0,
                    "totalXP": 0,
                    "entries": 0
                }
            best_scores[nis]["totalScore"] += score
            best_scores[nis]["totalStars"] += stars
            best_scores[nis]["totalXP"] += xp
            best_scores[nis]["entries"] += 1

        leaderboard = list(best_scores.values())
        # Sort by totalScore DESC, totalStars DESC, totalXP DESC
        leaderboard.sort(key=lambda x: (x["totalScore"], x["totalStars"], x["totalXP"]), reverse=True)

        # Add ranks
        for idx, entry in enumerate(leaderboard):
            entry["rank"] = idx + 1

        leaderboard = leaderboard[:limit]

        self.send_json_response(200, {
            "success": True,
            "message": "Leaderboard loaded",
            "data": {
                "level": level_filter or "all",
                "totalPlayers": len(leaderboard),
                "entries": leaderboard
            }
        })

    def api_get_students(self, params):
        secret = params.get('secret', '').strip()
        if secret != TEACHER_SECRET:
            self.send_json_response(200, {"success": False, "message": "Akses ditolak. Secret key tidak valid."})
            return

        conn = sqlite3.connect(DB_FILE)
        cursor = conn.cursor()

        # Get all users
        cursor.execute("SELECT nis, nama, kelas, wa, registered_at FROM users")
        user_rows = cursor.fetchall()

        # Get all scores grouped by NIS
        cursor.execute("SELECT nis, level, phase, score, stars, xp, timestamp FROM scores")
        score_rows = cursor.fetchall()

        # Get all sessions grouped by NIS
        cursor.execute("SELECT nis, login_time FROM sessions")
        session_rows = cursor.fetchall()
        conn.close()

        # Map sessions
        last_active = {}
        for s in session_rows:
            nis, login_time = s
            if nis not in last_active or login_time > last_active[nis]:
                last_active[nis] = login_time

        # Map scores
        student_scores = {}
        for sc in score_rows:
            nis, level, phase, score, stars, xp, timestamp = sc
            if nis not in student_scores:
                student_scores[nis] = []
            student_scores[nis].append({
                "level": level, "phase": phase, "score": score, "stars": stars, "xp": xp, "timestamp": timestamp
            })

        students = []
        for u in user_rows:
            nis, nama, kelas, wa, registered_at = u
            scores = student_scores.get(nis, [])
            
            total_xp = sum(s["xp"] for s in scores)
            total_stars = sum(s["stars"] for s in scores)
            total_score = sum(s["score"] for s in scores)
            levels_completed = len(set(s["level"] for s in scores))

            students.append({
                "nis": nis,
                "nama": nama,
                "kelas": kelas,
                "wa": wa,
                "registeredAt": registered_at,
                "totalXP": total_xp,
                "totalStars": total_stars,
                "totalScore": total_score,
                "levelsCompleted": levels_completed,
                "lastActive": last_active.get(nis, registered_at)
            })

        self.send_json_response(200, {
            "success": True,
            "message": "Siswa loaded",
            "data": students
        })

    # ── POST API Implementations ──

    def api_post_register(self, data):
        nis = data.get('nis', '').strip()
        nama = data.get('nama', '').strip()
        kelas = data.get('kelas', '').strip()
        wa = data.get('wa', '').strip()
        password = data.get('password', '').strip()

        if not (nis and nama and kelas and password):
            self.send_json_response(200, {"success": False, "message": "Parameter NIS, Nama, Kelas, dan Password wajib diisi."})
            return

        conn = sqlite3.connect(DB_FILE)
        cursor = conn.cursor()

        # Check existing
        cursor.execute("SELECT nis FROM users WHERE nis = ?", (nis,))
        if cursor.fetchone():
            conn.close()
            self.send_json_response(200, {"success": False, "message": "NIS sudah terdaftar! Gunakan NIS lain."})
            return

        # Insert user
        password_hash = hash_sha256(password)
        registered_at = datetime.now().isoformat()
        try:
            cursor.execute(
                "INSERT INTO users (nis, nama, kelas, wa, password_hash, registered_at) VALUES (?, ?, ?, ?, ?, ?)",
                (nis, nama, kelas, wa, password_hash, registered_at)
            )
            conn.commit()
            success = True
            msg = "Registrasi berhasil! Silakan login."
        except Exception as e:
            success = False
            msg = f"Gagal mendaftarkan user: {str(e)}"
        
        conn.close()
        self.send_json_response(200, {"success": success, "message": msg})

    def api_post_login(self, data):
        nis = data.get('nis', '').strip()
        password = data.get('password', '').strip()
        device = data.get('device', 'Desktop').strip()
        user_agent = data.get('userAgent', '').strip()

        if not (nis and password):
            self.send_json_response(200, {"success": False, "message": "Parameter NIS dan Password wajib diisi."})
            return

        conn = sqlite3.connect(DB_FILE)
        cursor = conn.cursor()

        # Check user
        password_hash = hash_sha256(password)
        cursor.execute("SELECT nis, nama, kelas FROM users WHERE nis = ? AND password_hash = ?", (nis, password_hash))
        user = cursor.fetchone()

        if user:
            nis, nama, kelas = user
            login_time = datetime.now().isoformat()
            
            # Log session
            cursor.execute(
                "INSERT INTO sessions (nis, login_time, device, user_agent) VALUES (?, ?, ?, ?)",
                (nis, login_time, device, user_agent)
            )
            conn.commit()

            # Generate local token
            token = hash_sha256(f"{nis}-{login_time}")
            
            self.send_json_response(200, {
                "success": True,
                "message": f"Login berhasil! Selamat datang, {nama}.",
                "data": {
                    "nis": nis,
                    "nama": nama,
                    "kelas": kelas,
                    "token": token
                }
            })
        else:
            self.send_json_response(200, {"success": False, "message": "NIS atau password salah."})

        conn.close()

    def api_post_sync_progress(self, data):
        nis = data.get('nis', '').strip()
        level = data.get('level', 1)
        phase = data.get('phase', '').strip()
        score = data.get('score', 0)
        stars = data.get('stars', 0)
        xp = data.get('xp', 0)
        timestamp = data.get('timestamp') or datetime.now().isoformat()

        if not (nis and phase):
            self.send_json_response(200, {"success": False, "message": "Parameter NIS dan Phase wajib diisi."})
            return

        conn = sqlite3.connect(DB_FILE)
        cursor = conn.cursor()

        # Check user name
        cursor.execute("SELECT nama FROM users WHERE nis = ?", (nis,))
        user = cursor.fetchone()

        if not user:
            conn.close()
            self.send_json_response(200, {"success": False, "message": "NIS tidak ditemukan."})
            return

        nama = user[0]

        # Insert score log (keeps history of all attempts)
        try:
            cursor.execute(
                "INSERT INTO scores (nis, nama, level, phase, score, stars, xp, timestamp) VALUES (?, ?, ?, ?, ?, ?, ?, ?)",
                (nis, nama, level, phase, score, stars, xp, timestamp)
            )
            conn.commit()
            success = True
            msg = "Progress berhasil disinkronkan."
        except Exception as e:
            success = False
            msg = f"Gagal sinkronisasi data: {str(e)}"

        conn.close()
        self.send_json_response(200, {"success": success, "message": msg})

    def api_post_update_profile(self, data):
        nis = data.get('nis', '').strip()
        nama = data.get('nama', '').strip()

        if not (nis and nama):
            self.send_json_response(200, {"success": False, "message": "Parameter NIS dan Nama wajib diisi."})
            return

        conn = sqlite3.connect(DB_FILE)
        cursor = conn.cursor()

        # Update user name
        cursor.execute("SELECT nis FROM users WHERE nis = ?", (nis,))
        if not cursor.fetchone():
            conn.close()
            self.send_json_response(200, {"success": False, "message": "NIS tidak ditemukan."})
            return

        try:
            cursor.execute("UPDATE users SET nama = ? WHERE nis = ?", (nama, nis))
            cursor.execute("UPDATE scores SET nama = ? WHERE nis = ?", (nama, nis))
            conn.commit()
            success = True
            msg = "Profil berhasil diperbarui."
        except Exception as e:
            success = False
            msg = f"Gagal memperbarui profil: {str(e)}"

        conn.close()
        self.send_json_response(200, {"success": success, "message": msg})

    def api_post_reset_progress(self, data):
        nis = data.get('nis', '').strip()
        secret = data.get('secret', '').strip()

        if secret != TEACHER_SECRET:
            self.send_json_response(200, {"success": False, "message": "Akses ditolak. Secret key tidak valid."})
            return

        if not nis:
            self.send_json_response(200, {"success": False, "message": "Parameter NIS wajib diisi."})
            return

        conn = sqlite3.connect(DB_FILE)
        cursor = conn.cursor()

        try:
            cursor.execute("DELETE FROM scores WHERE nis = ?", (nis,))
            cursor.execute("DELETE FROM sessions WHERE nis = ?", (nis,))
            conn.commit()
            success = True
            msg = f"Progres siswa dengan NIS {nis} berhasil direset."
        except Exception as e:
            success = False
            msg = f"Gagal mereset progres: {str(e)}"

        conn.close()
        self.send_json_response(200, {"success": success, "message": msg})

    # ── Utility Responses ──

    def send_json_response(self, status, payload):
        self.send_response(status)
        self.send_header('Content-Type', 'application/json')
        self.end_headers()
        self.wfile.write(json.dumps(payload).encode('utf-8'))

    # ════════════════════════════════════════════════════════════
    #  TEACHER DASHBOARD PAGE
    # ════════════════════════════════════════════════════════════

    def serve_dashboard(self):
        self.send_response(200)
        self.send_header('Content-Type', 'text/html; charset=utf-8')
        self.end_headers()
        
        # Dashboard HTML Page using local files (like js/chart.min.js) and futuristic styling
        dashboard_html = f"""<!DOCTYPE html>
<html lang="id">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Dasbor Pemantauan Guru - Bengkel Virtual AutoMaster</title>
  <link rel="stylesheet" href="/css/fonts.css">
  <style>
    :root {{
      --bg-deep: #0a0e17;
      --bg-surface: rgba(15, 23, 42, 0.75);
      --border-glow: rgba(0, 245, 255, 0.2);
      --clr-primary: #ff6b35;
      --clr-secondary: #eab308;
      --clr-accent: #00f5ff;
      --clr-success: #10b981;
      --text-primary: #f1f5f9;
      --text-secondary: #94a3b8;
    }}
    * {{
      box-sizing: border-box;
      margin: 0;
      padding: 0;
    }}
    body {{
      font-family: 'Inter', system-ui, -apple-system, sans-serif;
      background: linear-gradient(rgba(0, 245, 255, 0.012) 1px, transparent 1px),
                  linear-gradient(90deg, rgba(0, 245, 255, 0.012) 1px, transparent 1px),
                  radial-gradient(circle at 50% 30%, #0d1e36 0%, #030712 100%);
      background-size: 30px 30px, 30px 30px, 100% 100%;
      background-attachment: fixed;
      color: var(--text-primary);
      min-height: 100vh;
      padding: 24px;
      line-height: 1.6;
    }}
    header {{
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 24px;
      border-bottom: 1px solid var(--border-glow);
      padding-bottom: 16px;
    }}
    .header-logo {{
      display: flex;
      align-items: center;
      gap: 12px;
    }}
    .header-logo h1 {{
      font-size: 1.5rem;
      font-weight: 800;
      letter-spacing: 0.5px;
      background: linear-gradient(135deg, var(--clr-primary), var(--clr-accent));
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
    }}
    .server-status {{
      font-size: 0.8rem;
      background: rgba(16, 185, 129, 0.1);
      border: 1px solid var(--clr-success);
      color: var(--clr-success);
      padding: 6px 14px;
      border-radius: 50px;
      font-weight: 600;
      box-shadow: 0 0 10px rgba(16, 185, 129, 0.2);
    }}
    .grid-kpis {{
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
      gap: 20px;
      margin-bottom: 24px;
    }}
    .card-kpi {{
      background: var(--bg-surface);
      backdrop-filter: blur(10px);
      -webkit-backdrop-filter: blur(10px);
      border: 1px solid var(--border-glow);
      border-radius: 12px;
      padding: 20px;
      display: flex;
      flex-direction: column;
      position: relative;
      overflow: hidden;
      box-shadow: 0 8px 32px rgba(0, 0, 0, 0.3);
    }}
    .card-kpi::before {{
      content: '';
      position: absolute;
      left: 0; top: 0; bottom: 0;
      width: 4px;
      background: var(--clr-accent);
    }}
    .card-kpi.orange::before {{ background: var(--clr-primary); }}
    .card-kpi.gold::before {{ background: var(--clr-secondary); }}
    .card-kpi.green::before {{ background: var(--clr-success); }}
    .kpi-title {{
      font-size: 0.85rem;
      color: var(--text-secondary);
      font-weight: 600;
      text-transform: uppercase;
      margin-bottom: 6px;
    }}
    .kpi-value {{
      font-size: 2rem;
      font-weight: 850;
      color: #fff;
    }}
    .grid-charts {{
      display: grid;
      grid-template-columns: 2fr 1fr;
      gap: 20px;
      margin-bottom: 24px;
    }}
    @media (max-width: 992px) {{
      .grid-charts {{
        grid-template-columns: 1fr;
      }}
    }}
    .card-chart {{
      background: var(--bg-surface);
      backdrop-filter: blur(10px);
      border: 1px solid var(--border-glow);
      border-radius: 16px;
      padding: 20px;
      box-shadow: 0 8px 32px rgba(0,0,0,0.3);
    }}
    .chart-header {{
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 15px;
    }}
    .chart-title {{
      font-size: 1.05rem;
      font-weight: 700;
      color: #fff;
    }}
    .grid-data {{
      background: var(--bg-surface);
      backdrop-filter: blur(10px);
      border: 1px solid var(--border-glow);
      border-radius: 16px;
      padding: 20px;
      box-shadow: 0 8px 32px rgba(0,0,0,0.3);
      margin-bottom: 24px;
    }}
    .data-header {{
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 20px;
      flex-wrap: wrap;
      gap: 15px;
    }}
    .search-filter {{
      display: flex;
      gap: 10px;
      flex: 1;
      max-width: 500px;
    }}
    input, select, button {{
      background: rgba(30, 41, 59, 0.8);
      border: 1px solid var(--border-glow);
      color: #fff;
      padding: 8px 16px;
      border-radius: 8px;
      font-size: 0.88rem;
      outline: none;
      transition: all 0.25s ease;
    }}
    input:focus, select:focus {{
      border-color: var(--clr-accent);
      box-shadow: 0 0 8px rgba(0, 245, 255, 0.25);
    }}
    button.btn-primary {{
      background: var(--clr-primary);
      border: none;
      font-weight: 700;
      cursor: pointer;
    }}
    button.btn-primary:hover {{
      opacity: 0.9;
      transform: translateY(-1px);
    }}
    button.btn-secondary {{
      background: rgba(255, 255, 255, 0.05);
      cursor: pointer;
    }}
    button.btn-secondary:hover {{
      background: rgba(255, 255, 255, 0.1);
    }}
    button.btn-danger {{
      background: rgba(239, 68, 68, 0.1);
      border-color: rgba(239, 68, 68, 0.3);
      color: #ef4444;
      cursor: pointer;
      padding: 4px 10px;
      font-size: 0.75rem;
    }}
    button.btn-danger:hover {{
      background: #ef4444;
      color: #fff;
    }}
    table {{
      width: 100%;
      border-collapse: collapse;
      text-align: left;
      font-size: 0.88rem;
    }}
    th, td {{
      padding: 12px 16px;
      border-bottom: 1px solid rgba(255, 255, 255, 0.05);
    }}
    th {{
      color: var(--text-secondary);
      font-weight: 600;
      text-transform: uppercase;
      font-size: 0.75rem;
      letter-spacing: 0.5px;
    }}
    tbody tr:hover {{
      background: rgba(255, 255, 255, 0.02);
    }}
    .badge-class {{
      background: rgba(0, 245, 255, 0.08);
      border: 1px solid rgba(0, 245, 255, 0.2);
      color: var(--clr-accent);
      padding: 2px 8px;
      border-radius: 4px;
      font-size: 0.75rem;
      font-weight: 600;
    }}
  </style>
  <script src="/js/chart.min.js"></script>
</head>
<body>
  <header>
    <div class="header-logo">
      <span style="font-size: 1.8rem;">🖥️</span>
      <div>
        <h1>Dashboard Pemantauan Guru</h1>
        <p style="font-size: 0.8rem; color: var(--text-secondary);">Pemantauan data prestasi belajar siswa secara lokal (50 PC)</p>
      </div>
    </div>
    <div style="display: flex; gap: 10px; align-items: center;">
      <button class="btn-secondary" onclick="fetchData()">🔄 Segarkan Data</button>
      <button class="btn-primary" onclick="window.location.href='/'">🚪 Keluar</button>
      <div class="server-status">SERVER LAN: AKTIF</div>
    </div>
  </header>

  <div class="grid-kpis">
    <div class="card-kpi green">
      <div class="kpi-title">Total Siswa Terdaftar</div>
      <div class="kpi-value" id="kpi-total-students">0</div>
    </div>
    <div class="card-kpi">
      <div class="kpi-title">Total XP Terkumpul</div>
      <div class="kpi-value" id="kpi-total-xp">0</div>
    </div>
    <div class="card-kpi orange">
      <div class="kpi-title">Rata-rata XP per Siswa</div>
      <div class="kpi-value" id="kpi-avg-xp">0</div>
    </div>
    <div class="card-kpi gold">
      <div class="kpi-title">Lencana (Stars) Diperoleh</div>
      <div class="kpi-value" id="kpi-total-stars">0</div>
    </div>
  </div>

  <div class="grid-charts">
    <div class="card-chart">
      <div class="chart-header">
        <div class="chart-title">Peringkat 10 Siswa Teratas (XP)</div>
      </div>
      <div style="position: relative; height: 320px; width: 100%;">
        <canvas id="chart-rankings"></canvas>
      </div>
    </div>
    <div class="card-chart">
      <div class="chart-header">
        <div class="chart-title">Distribusi Kelas</div>
      </div>
      <div style="position: relative; height: 320px; width: 100%; display: flex; align-items: center; justify-content: center;">
        <canvas id="chart-classes"></canvas>
      </div>
    </div>
  </div>

  <div class="grid-data">
    <div class="data-header">
      <div class="search-filter">
        <input type="text" id="search-name" placeholder="Cari Nama atau NIS..." oninput="filterTable()">
        <select id="filter-class" onchange="filterTable()">
          <option value="">Semua Kelas</option>
        </select>
      </div>
      <button class="btn-primary" onclick="exportCSV()">📥 Unduh Laporan Excel (CSV)</button>
    </div>

    <div style="overflow-x: auto;">
      <table>
        <thead>
          <tr>
            <th>NIS</th>
            <th>Nama Lengkap</th>
            <th>Kelas</th>
            <th>No. WA</th>
            <th style="text-align: right;">Total XP</th>
            <th style="text-align: right;">Total Lencana (⭐)</th>
            <th style="text-align: right;">Skor Kumulatif</th>
            <th>Modul Selesai</th>
            <th>Aktif Terakhir</th>
            <th>Aksi</th>
          </tr>
        </thead>
        <tbody id="students-table-body">
          <tr>
            <td colspan="10" style="text-align: center; color: var(--text-secondary);">Memuat data siswa...</td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>

  <script>
    let allStudents = [];
    let barChart = null;
    let pieChart = null;

    async function fetchData() {{
      try {{
        const response = await fetch('/api?action=getStudents&secret={TEACHER_SECRET}');
        const result = await response.json();
        
        if (result.success && result.data) {{
          allStudents = result.data;
          updateDashboard();
        }}
      }} catch (err) {{
        console.error("Gagal memuat data dari server lokal:", err);
      }}
    }}

    function updateDashboard() {{
      // Update KPIs
      document.getElementById('kpi-total-students').textContent = allStudents.length;
      
      const totalXp = allStudents.reduce((sum, s) => sum + s.totalXP, 0);
      document.getElementById('kpi-total-xp').textContent = totalXp.toLocaleString('id-ID');
      
      const avgXp = allStudents.length > 0 ? Math.round(totalXp / allStudents.length) : 0;
      document.getElementById('kpi-avg-xp').textContent = avgXp.toLocaleString('id-ID');

      const totalStars = allStudents.reduce((sum, s) => sum + s.totalStars, 0);
      document.getElementById('kpi-total-stars').textContent = totalStars;

      // Populate class filter dropdown
      const classSelect = document.getElementById('filter-class');
      const currentSelection = classSelect.value;
      classSelect.innerHTML = '<option value="">Semua Kelas</option>';
      const classes = [...new Set(allStudents.map(s => s.kelas))].sort();
      classes.forEach(c => {{
        if (c) {{
          const opt = document.createElement('option');
          opt.value = c;
          opt.textContent = c;
          classSelect.appendChild(opt);
        }}
      }});
      classSelect.value = currentSelection;

      populateTable(allStudents);
      buildCharts();
    }}

    function populateTable(students) {{
      const tbody = document.getElementById('students-table-body');
      tbody.innerHTML = '';

      if (students.length === 0) {{
        tbody.innerHTML = '<tr><td colspan="10" style="text-align: center; color: var(--text-secondary);">Tidak ada data siswa ditemukan.</td></tr>';
        return;
      }}

      students.forEach(s => {{
        const row = document.createElement('tr');
        
        // Format timestamp
        let lastActiveStr = '-';
        if (s.lastActive) {{
          try {{
            const date = new Date(s.lastActive);
            lastActiveStr = date.toLocaleDateString('id-ID') + ' ' + date.toLocaleTimeString('id-ID', {{hour: '2-digit', minute:'2-digit'}});
          }} catch(e) {{
            lastActiveStr = s.lastActive;
          }}
        }}

        row.innerHTML = `
          <td style="font-family: monospace; font-weight: bold;">\\${{s.nis}}</td>
          <td style="font-weight: 600;">\\${{s.nama}}</td>
          <td><span class="badge-class">\\${{s.kelas}}</td>
          <td style="color: var(--text-secondary);">\\${{s.wa || '-'}}</td>
          <td style="text-align: right; color: var(--clr-accent); font-weight: 700;">\\${{s.totalXP}} XP</td>
          <td style="text-align: right; color: var(--clr-secondary); font-weight: 700;">⭐ \\${{s.totalStars}}</td>
          <td style="text-align: right; font-weight: 600;">\\${{s.totalScore}}</td>
          <td style="text-align: right; font-weight: bold; color: var(--clr-success);">\\${{s.levelsCompleted}} / 6</td>
          <td style="font-size: 0.8rem; color: var(--text-secondary);">\\${{lastActiveStr}}</td>
          <td>
            <button class="btn-danger" onclick="resetStudentProgress('\\${{s.nis}}')">Reset</button>
          </td>
        `;
        tbody.appendChild(row);
      }});
    }}

    function filterTable() {{
      const query = document.getElementById('search-name').value.toLowerCase().trim();
      const classFilter = document.getElementById('filter-class').value;

      const filtered = allStudents.filter(s => {{
        const matchQuery = s.nama.toLowerCase().includes(query) || s.nis.includes(query);
        const matchClass = !classFilter || s.kelas === classFilter;
        return matchQuery && matchClass;
      }});

      populateTable(filtered);
    }}

    async function resetStudentProgress(nis) {{
      if (confirm(`Yakin ingin meriset semua progres siswa dengan NIS \\${{nis}}? Tindakan ini akan menghapus semua nilai dan XP mereka.`)) {{
        try {{
          const response = await fetch('/api', {{
            method: 'POST',
            headers: {{ 'Content-Type': 'application/json' }},
            body: JSON.stringify({{
              action: 'resetProgress',
              nis: nis,
              secret: '{TEACHER_SECRET}'
            }})
          }});
          const result = await response.json();
          alert(result.message);
          fetchData();
        }} catch(e) {{
          alert("Gagal mereset progress.");
        }}
      }}
    }}

    function buildCharts() {{
      // 1. Rankings Chart
      const topStudents = [...allStudents]
        .sort((a,b) => b.totalXP - a.totalXP)
        .slice(0, 10);

      const barLabels = topStudents.map(s => s.nama);
      const barData = topStudents.map(s => s.totalXP);

      if (barChart) barChart.destroy();
      const ctxBar = document.getElementById('chart-rankings').getContext('2d');
      barChart = new Chart(ctxBar, {{
        type: 'bar',
        data: {{
          labels: barLabels,
          datasets: [{{
            label: 'Total XP',
            data: barData,
            backgroundColor: 'rgba(0, 245, 255, 0.4)',
            borderColor: '#00f5ff',
            borderWidth: 2,
            borderRadius: 6,
          }}]
        }},
        options: {{
          responsive: true,
          maintainAspectRatio: false,
          plugins: {{
            legend: {{ display: false }},
            tooltip: {{ mode: 'index', intersect: false }}
          }},
          scales: {{
            y: {{
              grid: {{ color: 'rgba(255,255,255,0.05)' }},
              ticks: {{ color: '#94a3b8' }}
            }},
            x: {{
              grid: {{ display: false }},
              ticks: {{ color: '#94a3b8', maxRotation: 45, minRotation: 45 }}
            }}
          }}
        }}
      }});

      // 2. Class Distribution Chart
      const classCounts = {{}};
      allStudents.forEach(s => {{
        if (s.kelas) {{
          classCounts[s.kelas] = (classCounts[s.kelas] || 0) + 1;
        }}
      }});

      const pieLabels = Object.keys(classCounts);
      const pieData = Object.values(classCounts);
      const pieColors = [
        '#ff6b35', '#0d9488', '#eab308', '#6366f1', '#ef4444', '#10b981', '#a855f7'
      ];

      if (pieChart) pieChart.destroy();
      const ctxPie = document.getElementById('chart-classes').getContext('2d');
      pieChart = new Chart(ctxPie, {{
        type: 'doughnut',
        data: {{
          labels: pieLabels,
          datasets: [{{
            data: pieData,
            backgroundColor: pieColors.slice(0, pieLabels.length),
            borderWidth: 1,
            borderColor: '#0a0e17'
          }}]
        }},
        options: {{
          responsive: true,
          maintainAspectRatio: false,
          plugins: {{
            legend: {{
              position: 'bottom',
              labels: {{ color: '#94a3b8' }}
            }}
          }}
        }}
      }});
    }}

    function exportCSV() {{
      if (allStudents.length === 0) {{
        alert("Tidak ada data untuk diunduh.");
        return;
      }}

      let csv = 'NIS,Nama Lengkap,Kelas,No WA,Total XP,Total Stars,Total Skor,Modul Selesai,Terakhir Aktif\\n';
      allStudents.forEach(s => {{
        csv += `\\"\\${{s.nis}}\\",\\"\\${{s.nama}}\\",\\"\\${{s.kelas}}\\",\\"\\${{s.wa || ''}}\\",\\${{s.totalXP}},\\${{s.totalStars}},\\${{s.totalScore}},\\${{s.levelsCompleted}},\\"\\${{s.lastActive || ''}}\\"\\n`;
      }});

      const blob = new Blob([csv], {{ type: 'text/csv;charset=utf-8;' }});
      const link = document.createElement("a");
      const url = URL.createObjectURL(blob);
      link.setAttribute("href", url);
      link.setAttribute("download", `Laporan_Prestasi_AutoMaster_\\${{new Date().toISOString().slice(0,10)}}.csv`);
      link.style.visibility = 'hidden';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }}

    // Initial load
    fetchData();
    // Auto refresh every 10 seconds
    setInterval(fetchData, 10000);
  </script>
</body>
</html>"""
        self.wfile.write(dashboard_html.encode('utf-8'))

def run(server_class=ThreadingHTTPServer, handler_class=LocalServerHandler):
    # Initialize DB
    init_db()
    
    server_address = ('', PORT)
    server_class.allow_reuse_address = False  # Prevent port reuse (zombie processes)
    httpd = server_class(server_address, handler_class)
    
    # Get local IP
    import socket
    local_ip = "127.0.0.1"
    try:
        s = socket.socket(socket.AF_INET, socket.SOCK_DGRAM)
        s.connect(("8.8.8.8", 80))
        local_ip = s.getsockname()[0]
        s.close()
    except Exception:
        pass

    print("=========================================================================")
    print("      AUTOMASTER LOCAL SERVER LAN - RUNNING")
    print("=========================================================================")
    print(f"[*] Game Client URL  : http://localhost:{PORT}")
    print(f"[*] LAN Network URL  : http://{local_ip}:{PORT}   <-- Buka dari 50 PC Siswa")
    print(f"[*] Teacher Dashboard: http://localhost:{PORT}/dashboard <-- Pemantauan Guru")
    print("=========================================================================")
    print("[*] Menunggu koneksi... Tekan Ctrl+C untuk menghentikan server.")
    
    try:
        httpd.serve_forever()
    except KeyboardInterrupt:
        print("\n[*] Menutup server...")
        httpd.server_close()
        sys.exit(0)

if __name__ == '__main__':
    run()
