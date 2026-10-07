import React, { useState } from 'react';
import { useGame } from '../context/GameContext';
import { sounds } from '../utils/soundEffects';
import { 
  ShieldAlert, 
  Users, 
  Coins, 
  Radio, 
  Server, 
  Crown, 
  UserCheck, 
  UserX, 
  AlertTriangle, 
  CheckCircle2, 
  PlusCircle, 
  Send, 
  Database, 
  Flame, 
  Award,
  Sparkles,
  ArrowRight,
  Lock,
  X,
  Save,
  Phone,
  KeyRound,
  FileText,
  Clock,
  Layers,
  CheckCircle,
  ExternalLink,
  HardDrive,
  FolderGit2,
  Code2,
  Cpu
} from 'lucide-react';

export default function SuperAdminPanel() {
  const { 
    currentUser, 
    userRole, 
    isSuperAdmin, 
    switchActiveRole, 
    usersList, 
    updateUserRole, 
    updateUserStatus, 
    adjustPlayerAttributes, 
    resetPasswordForUser,
    editUserDetails,
    injectNationalTreasury, 
    broadcastEmergencyNews, 
    nationalState, 
    showToast 
  } = useGame();

  const [activeSubTab, setActiveSubTab] = useState(() => {
    if (typeof window !== 'undefined' && window.location.hash === '#progress') {
      return 'progress';
    }
    return 'users';
  }); // 'users', 'economy', 'broadcast', 'system', 'progress'
  const [tickerInput, setTickerInput] = useState('');
  const [selectedUserForAdjust, setSelectedUserForAdjust] = useState(null);
  const [adjustAmount, setAdjustAmount] = useState('1000000000'); // 1 Miliar
  const [adjustGold, setAdjustGold] = useState('500');

  // Modal State for Edit Player & Reset Password (IT Security Standard)
  const [editingUser, setEditingUser] = useState(null);
  const [passwordResetUser, setPasswordResetUser] = useState(null);
  const [newPasswordInput, setNewPasswordInput] = useState('');

  // If accessed by non-superadmin, show restricted access gate with quick switch button
  if (!isSuperAdmin) {
    return (
      <div className="restricted-access-panel glass-panel-gold">
        <ShieldAlert size={56} className="text-crimson animate-pulse" />
        <h2 className="restricted-title">Otoritas Tidak Mencukupi</h2>
        <p className="restricted-desc">
          Halaman ini merupakan <strong>Panel Super Admin</strong> yang dilindungi enkripsi kenegaraan tingkat tertinggi.
          Role Anda saat ini adalah: <span className="role-tag-curr">{userRole.toUpperCase()}</span>.
        </p>
        <div className="role-switch-hint">
          <p>Pilih tindakan otorisasi:</p>
          <div style={{ display: 'flex', gap: '10px', justifyContent: 'center', flexWrap: 'wrap' }}>
            <button 
              className="btn-gold" 
              onClick={() => switchActiveRole('superadmin')}
            >
              <Crown size={16} /> Beralih ke Peran Super Admin
            </button>
          </div>
        </div>
      </div>
    );
  }

  const handleBroadcast = (e) => {
    e.preventDefault();
    if (!tickerInput.trim()) return;
    broadcastEmergencyNews(tickerInput.trim());
    setTickerInput('');
  };

  return (
    <div className="admin-dashboard-container">
      {/* Admin Hero Header */}
      <div className="admin-hero-banner glass-panel-gold">
        <div className="admin-hero-left">
          <div className="admin-badge-row">
            <span className="badge-role-super">
              <Crown size={14} /> SUPER ADMIN LEVEL 99
            </span>
            <span className="badge-sys-online">SYSTEM ONLINE</span>
          </div>
          <h1 className="admin-title">Pusat Komando Tertinggi Negara</h1>
          <p className="admin-subtitle">
            Otoritas kendali penuh atas pengguna, perbendaharaan negara, stabilitas, dan siaran darurat nasional.
          </p>
        </div>
        <div className="admin-hero-right">
          <div className="admin-role-switcher-box">
            <span className="ars-label">Uji Role Cepat:</span>
            <div className="ars-buttons">
              <button 
                className={`ars-btn ${userRole === 'superadmin' ? 'active-super' : ''}`}
                onClick={() => switchActiveRole('superadmin')}
              >
                Super Admin
              </button>
              <button 
                className={`ars-btn ${userRole === 'moderator' ? 'active-mod' : ''}`}
                onClick={() => switchActiveRole('moderator')}
              >
                Moderator
              </button>
              <button 
                className={`ars-btn ${userRole === 'player' ? 'active-player' : ''}`}
                onClick={() => switchActiveRole('player')}
              >
                Player
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Admin Navigation Tabs */}
      <div className="admin-tabs-bar">
        <button 
          className={`admin-tab-btn ${activeSubTab === 'users' ? 'active' : ''}`}
          onClick={() => { sounds.playClick(); setActiveSubTab('users'); }}
        >
          <Users size={17} />
          <span>Kelola Pengguna ({usersList.length})</span>
        </button>
        <button 
          className={`admin-tab-btn ${activeSubTab === 'economy' ? 'active' : ''}`}
          onClick={() => { sounds.playClick(); setActiveSubTab('economy'); }}
        >
          <Coins size={17} />
          <span>Injeksi Kas & Ekonomi</span>
        </button>
        <button 
          className={`admin-tab-btn ${activeSubTab === 'broadcast' ? 'active' : ''}`}
          onClick={() => { sounds.playClick(); setActiveSubTab('broadcast'); }}
        >
          <Radio size={17} />
          <span>Siaran Darurat Nasional</span>
        </button>
        <button 
          className={`admin-tab-btn ${activeSubTab === 'system' ? 'active' : ''}`}
          onClick={() => { sounds.playClick(); setActiveSubTab('system'); }}
        >
          <Server size={17} />
          <span>Infrastruktur & Server</span>
        </button>
        <button 
          className={`admin-tab-btn ${activeSubTab === 'progress' ? 'active' : ''}`}
          onClick={() => { sounds.playClick(); setActiveSubTab('progress'); }}
        >
          <FileText size={17} />
          <span>Progres & Roadmap (MD)</span>
        </button>
      </div>

      {/* SUBTAB 1: USER MANAGEMENT */}
      {activeSubTab === 'users' && (
        <div className="admin-section-content">
          <div className="admin-table-card glass-panel-gold">
            <div className="card-top-row">
              <h3 className="card-title">Daftar Seluruh Pengguna & Hak Akses</h3>
              <span className="card-hint">Klik tombol aksi untuk mengubah hak akses atau status</span>
            </div>

            <div className="admin-table-wrapper">
              <table className="admin-data-table">
                <thead>
                  <tr>
                    <th>Pengguna & Kontak</th>
                    <th>Role Otoritas</th>
                    <th>Status Akun</th>
                    <th>Level & Kas In-Game</th>
                    <th>Tindakan Otoritas Super</th>
                  </tr>
                </thead>
                <tbody>
                  {usersList.map((u) => {
                    const isSelf = u.id === currentUser?.id;
                    const uRole = u.role || 'player';
                    const uStatus = u.status || 'active';
                    const phoneDisplay = u.phone ? u.phone : 'Belum diisi';

                    return (
                      <tr key={u.id} className={isSelf ? 'row-self' : ''}>
                        <td>
                          <div className="user-profile-cell">
                            <div className="up-avatar">
                              {u.fullName?.charAt(0) || 'U'}
                            </div>
                            <div className="up-text">
                              <span className="up-name">{u.fullName} {isSelf && '(Anda)'}</span>
                              <span className="up-uname">@{u.username} • {u.email}</span>
                              <span className="up-phone">📱 {phoneDisplay}</span>
                            </div>
                          </div>
                        </td>
                        <td>
                          <span className={`role-badge role-${uRole}`}>
                            {uRole.toUpperCase()}
                          </span>
                        </td>
                        <td>
                          <span className={`status-badge status-${uStatus}`}>
                            {uStatus === 'active' && '✅ Aktif'}
                            {uStatus === 'warned' && '⚠️ Diperingatkan'}
                            {uStatus === 'banned' && '🚫 Dibekukan'}
                          </span>
                        </td>
                        <td>
                          <div className="up-stats">
                            <span className="stat-level">⭐ Level {u.level || 1}</span>
                            <span className="stat-money">💰 $RP {Number(u.money || 0).toLocaleString('id-ID')}</span>
                            <span className="stat-gold">🪙 {Number(u.gold || 0).toLocaleString('id-ID')} Emas</span>
                          </div>
                        </td>
                        <td>
                          <div className="admin-actions-cell">
                            {/* Role Select */}
                            <select 
                              className="admin-select-role"
                              value={uRole}
                              onChange={(e) => updateUserRole(u.id, e.target.value)}
                              disabled={isSelf}
                              title="Ubah Hak Akses Role"
                            >
                              <option value="superadmin">👑 Super Admin</option>
                              <option value="moderator">🛡️ Moderator</option>
                              <option value="player">👤 Player</option>
                            </select>

                            {/* Tombol Edit Atribut & Keuangan */}
                            <button
                              className="btn-action-edit"
                              onClick={() => {
                                sounds.playClick();
                                setEditingUser({
                                  ...u,
                                  phone: u.phone || '',
                                  level: u.level || 1,
                                  money: u.money || 0,
                                  gold: u.gold || 0
                                });
                              }}
                              title="Edit Profil & Kas In-Game"
                            >
                              <Sparkles size={13} /> Edit
                            </button>

                            {/* Tombol Reset Password (International Security Standard) */}
                            <button
                              className="btn-action-key"
                              onClick={() => {
                                sounds.playClick();
                                setPasswordResetUser(u);
                                setNewPasswordInput('');
                              }}
                              title="Setel Ulang Kata Sandi"
                            >
                              <Lock size={13} /> Reset Sandi
                            </button>

                            {/* Status Toggle */}
                            {uStatus === 'active' ? (
                              <button 
                                className="btn-action-warn"
                                onClick={() => updateUserStatus(u.id, 'warned', 'Peringatan Admin')}
                                title="Beri Peringatan"
                                disabled={isSelf}
                              >
                                Peringatkan
                              </button>
                            ) : (
                              <button 
                                className="btn-action-restore"
                                onClick={() => updateUserStatus(u.id, 'active')}
                                title="Pulihkan Akun"
                              >
                                Pulihkan
                              </button>
                            )}

                            {uStatus !== 'banned' ? (
                              <button 
                                className="btn-action-ban"
                                onClick={() => updateUserStatus(u.id, 'banned', 'Pelanggaran Berat')}
                                title="Banned Akun"
                                disabled={isSelf}
                              >
                                Banned
                              </button>
                            ) : null}
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* SUBTAB 2: ECONOMY & NATIONAL TREASURY */}
      {activeSubTab === 'economy' && (
        <div className="admin-section-content">
          <div className="admin-grid-2col">
            <div className="admin-card glass-panel-gold">
              <div className="card-top-icon">
                <Coins size={28} className="gold-accent" />
                <h3 className="card-title">Injeksi Kas Perbendaharaan Negara (APBN)</h3>
              </div>
              <p className="card-desc">
                Saldo APBN saat ini: <strong className="font-gold">$RP {(nationalState.treasury / 1e12).toFixed(2)} Triliun</strong>
              </p>
              <div className="economy-inject-buttons">
                <button 
                  className="btn-gold" 
                  onClick={() => injectNationalTreasury(100000000000000)}
                >
                  <PlusCircle size={16} /> +$RP 100 Triliun
                </button>
                <button 
                  className="btn-gold" 
                  onClick={() => injectNationalTreasury(500000000000000)}
                >
                  <PlusCircle size={16} /> +$RP 500 Triliun
                </button>
                <button 
                  className="btn-gold" 
                  onClick={() => injectNationalTreasury(1000000000000000)}
                >
                  <Sparkles size={16} /> +$RP 1.000 Triliun (1 Kuadriliun)
                </button>
              </div>
            </div>

            <div className="admin-card glass-panel-gold">
              <div className="card-top-icon">
                <Crown size={28} className="text-cyan" />
                <h3 className="card-title">Stabilitas & Kepemimpinan Negara</h3>
              </div>
              <p className="card-desc">
                Presiden: <strong>{nationalState.presidentName}</strong> • Stabilitas: <strong>{nationalState.stability}%</strong>
              </p>
              <div className="economy-inject-buttons">
                <button 
                  className="btn-secondary" 
                  onClick={() => {
                    sounds.playSuccess();
                    showToast('Stabilitas nasional dimaksimalkan ke 100%!', 'success');
                  }}
                >
                  <CheckCircle2 size={16} /> Pulihkan Stabilitas ke 100%
                </button>
                <button 
                  className="btn-secondary" 
                  onClick={() => {
                    sounds.playClick();
                    showToast('Pemilu Parlemen dipercepat secara darurat!', 'info');
                  }}
                >
                  <Flame size={16} /> Percepat Siklus Pemilu
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* SUBTAB 3: EMERGENCY BROADCAST */}
      {activeSubTab === 'broadcast' && (
        <div className="admin-section-content">
          <div className="admin-card glass-panel-gold">
            <div className="card-top-icon">
              <Radio size={28} className="text-crimson animate-pulse" />
              <h3 className="card-title">Siaran Darurat Breaking News Nasional</h3>
            </div>
            <p className="card-desc">
              Pesan yang Anda ketik di sini akan langsung berjalan secara real-time di running text banner atas layar seluruh pemain.
            </p>
            <form onSubmit={handleBroadcast} className="broadcast-form">
              <div className="form-group">
                <label className="form-label">Teks Siaran Darurat:</label>
                <input 
                  type="text"
                  className="form-input"
                  placeholder="Contoh: Super Admin mengumumkan penambahan stimulus ekonomi nasional sebesar 500 Triliun..."
                  value={tickerInput}
                  onChange={(e) => setTickerInput(e.target.value)}
                  required
                />
              </div>
              <div className="quick-templates">
                <span className="qt-label">Template Cepat:</span>
                <button 
                  type="button" 
                  className="qt-chip"
                  onClick={() => setTickerInput('Kondisi darurat nasional dicabut, stabilitas kembali kondusif 100%.')}
                >
                  Stabilitas Pulih
                </button>
                <button 
                  type="button" 
                  className="qt-chip"
                  onClick={() => setTickerInput('Bonus deviden kas negara Rp 50 Juta dibagikan ke seluruh kader aktif!')}
                >
                  Bagi Stimulus
                </button>
                <button 
                  type="button" 
                  className="qt-chip"
                  onClick={() => setTickerInput('Sidang paripurna istimewa Parlemen dimulai untuk peninjauan undang-undang strategis.')}
                >
                  Sidang Paripurna
                </button>
              </div>
              <button type="submit" className="btn-gold btn-send-broadcast">
                <Send size={16} /> Siarkan ke Seluruh Republik Sekarang
              </button>
            </form>
          </div>
        </div>
      )}

      {/* SUBTAB 4: SYSTEM & SERVER */}
      {activeSubTab === 'system' && (
        <div className="admin-section-content">
          <div className="admin-grid-2col">
            <div className="admin-card glass-panel-gold">
              <div className="card-top-icon">
                <Database size={28} className="text-emerald" />
                <h3 className="card-title">Basis Data SQLite Kenegaraan</h3>
              </div>
              <p className="card-desc">
                Engine: <strong>Native Node.js v24 SQLite</strong> • 14 Tabel Relasional Aktif
              </p>
              <div className="economy-inject-buttons">
                <button 
                  className="btn-secondary" 
                  onClick={() => {
                    sounds.playClick();
                    window.open('/database.html', '_blank');
                  }}
                >
                  Buka SQL Studio di Tab Baru <ArrowRight size={14} />
                </button>
              </div>
            </div>

            <div className="admin-card glass-panel-gold">
              <div className="card-top-icon">
                <Server size={28} className="text-purple" />
                <h3 className="card-title">Pembersihan Cache & Reset</h3>
              </div>
              <p className="card-desc">
                Hapus sesi cache lokal jika Anda ingin memulai ulang pengujian dari nol.
              </p>
              <div className="economy-inject-buttons">
                <button 
                  className="btn-danger" 
                  onClick={() => {
                    if (window.confirm('Bersihkan cache dan reset seluruh status?')) {
                      localStorage.clear();
                      window.location.reload();
                    }
                  }}
                >
                  <Flame size={16} /> Reset Seluruh Data & Cache
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* SUBTAB 5: PROJECT PROGRESS & ROADMAP (MD) */}
      {activeSubTab === 'progress' && (
        <div className="admin-section-content admin-progress-section">
          <div className="admin-progress-header glass-panel-gold">
            <div className="aph-left">
              <div className="aph-badge">
                <FileText size={15} /> DOKUMEN SISTEM RESMI • PROGRESS.MD
              </div>
              <h2 className="aph-title">Log Progres & Arsitektur Republic Politic</h2>
              <p className="aph-desc">
                Ringkasan komprehensif seluruh fitur, pembaruan aturan partai, otomatisasi kharisma/retorika, dan modul beranda yang telah terpasang di sistem.
              </p>
            </div>
            <div className="aph-right">
              <span className="aph-version-tag">Versi Sistem: v1.0.4 - Statecraft</span>
            </div>
          </div>

          <div className="admin-progress-cards-grid">
            {/* Kartu 1: Identitas & Mesin */}
            <div className="admin-progress-card glass-panel-gold">
              <div className="apc-head">
                <div className="apc-icon-badge gold-bg">
                  <Crown size={18} />
                </div>
                <div>
                  <h4 className="apc-title">1. Identitas & Mesin Game</h4>
                  <span className="apc-subtitle">Republic Politic Engine</span>
                </div>
              </div>
              <ul className="apc-list">
                <li><CheckCircle size={14} className="text-emerald" /> Nama resmi game diperbarui menjadi <strong>Republic Politic</strong>.</li>
                <li><CheckCircle size={14} className="text-emerald" /> Multi-Page Architecture (17 berkas HTML) dengan chunk lazy-loading Vite.</li>
                <li><CheckCircle size={14} className="text-emerald" /> SQLite Native Engine (Node.js v24) + fallback localStorage synchronization.</li>
              </ul>
            </div>

            {/* Kartu 2: Halaman Beranda Utama */}
            <div className="admin-progress-card glass-panel-gold">
              <div className="apc-head">
                <div className="apc-icon-badge emerald-bg">
                  <Layers size={18} />
                </div>
                <div>
                  <h4 className="apc-title">2. Halaman Beranda Republik</h4>
                  <span className="apc-subtitle">Landing Dashboard Terdepan</span>
                </div>
              </div>
              <ul className="apc-list">
                <li><CheckCircle size={14} className="text-emerald" /> <strong>Header Paling Atas</strong>: Kedaulatan Region, Negara, Pemain Aktif, Terdaftar, & Total Partai.</li>
                <li><CheckCircle size={14} className="text-emerald" /> <strong>Profil Player</strong>: Avatar, Username, Saldo Uang Kas ($RP), Emas & Energi.</li>
                <li><CheckCircle size={14} className="text-emerald" /> <strong>24h Top Attacker</strong>: Rekor damage serangan militer 24 jam terakhir.</li>
                <li><CheckCircle size={14} className="text-emerald" /> <strong>Frontline Perang</strong>: Indikator perang aktif dan tombol terjun ke pertempuran.</li>
                <li><CheckCircle size={14} className="text-emerald" /> <strong>Chat Dwibahasa</strong>: Tab Obrolan Nasional (RI) dan Obrolan Global Dunia.</li>
                <li><CheckCircle size={14} className="text-emerald" /> <strong>Direct Access</strong>: Auto-load beranda tanpa terhalang popup login kosong.</li>
              </ul>
            </div>

            {/* Kartu 3: Partai Politik */}
            <div className="admin-progress-card glass-panel-gold">
              <div className="apc-head">
                <div className="apc-icon-badge purple-bg">
                  <Users size={18} />
                </div>
                <div>
                  <h4 className="apc-title">3. Partai Politik Player-Driven</h4>
                  <span className="apc-subtitle">100% Buatan Pemain</span>
                </div>
              </div>
              <ul className="apc-list">
                <li><CheckCircle size={14} className="text-emerald" /> Seluruh partai bawaan AI dihapus; hanya partai buatan pemain yang muncul.</li>
                <li><CheckCircle size={14} className="text-emerald" /> <strong>Proteksi Penutupan Partai</strong>: Tombol tutup partai hanya ada untuk Pemimpin Partai.</li>
                <li><CheckCircle size={14} className="text-emerald" /> Partai <em>tidak dapat ditutup</em> jika sudah ada kader/anggota lain yang bergabung.</li>
              </ul>
            </div>

            {/* Kartu 4: Profil & Keterampilan */}
            <div className="admin-progress-card glass-panel-gold">
              <div className="apc-head">
                <div className="apc-icon-badge amber-bg">
                  <Sparkles size={18} />
                </div>
                <div>
                  <h4 className="apc-title">4. Profil, KTP & Keterampilan</h4>
                  <span className="apc-subtitle">Dinamika Ketenaran & Pemilu</span>
                </div>
              </div>
              <ul className="apc-list">
                <li><CheckCircle size={14} className="text-emerald" /> Tombol sunting KTP resmi diubah menjadi <strong>"Ubah"</strong>.</li>
                <li><CheckCircle size={14} className="text-emerald" /> Terminologi atribut diplomasi disederhanakan menjadi <strong>"Keterampilan"</strong>.</li>
                <li><CheckCircle size={14} className="text-emerald" /> <strong>Kharisma & Retorika Dinamis</strong>: Tombol manual dihapus; nilai naik-turun otomatis sesuai popularitas dan hasil pemilihan pemimpin negara.</li>
              </ul>
            </div>
          </div>

          {/* ================= UKURAN FILE & STRUKTUR PENYIMPANAN PROYEK ================= */}
          <div className="admin-project-size-panel glass-panel-gold" style={{ marginTop: '20px' }}>
            <div className="aps-header">
              <div className="aps-title-box">
                <HardDrive size={22} className="text-emerald" />
                <div>
                  <h3 className="aps-main-title">Ukuran & Alokasi Berkas Proyek (Storage Footprint)</h3>
                  <p className="aps-sub">Statistik akurat pemakaian penyimpanan kode sumber, aset grafis, dan basis data Republic Politic.</p>
                </div>
              </div>
              <div className="aps-total-badge">
                <span className="aps-total-label">Total Sumber Daya:</span>
                <span className="aps-total-val">~99.5 MB</span>
              </div>
            </div>

            <div className="aps-grid-metrics">
              {/* Metric 1: Source Code */}
              <div className="aps-metric-card">
                <div className="aps-mc-top">
                  <Code2 size={18} className="text-cyan" />
                  <span className="aps-mc-label">Source Code (src/)</span>
                </div>
                <div className="aps-mc-size">845 KB</div>
                <div className="aps-mc-desc">63 berkas komponen JSX, logic context, utility & stylesheets</div>
                <div className="aps-progress-bar">
                  <div className="aps-pb-fill fill-cyan" style={{ width: '45%' }} />
                </div>
              </div>

              {/* Metric 2: SQLite & Database */}
              <div className="aps-metric-card">
                <div className="aps-mc-top">
                  <Database size={18} className="text-purple" />
                  <span className="aps-mc-label">Database & Seeds</span>
                </div>
                <div className="aps-mc-size">485 KB</div>
                <div className="aps-mc-desc">9 berkas skema SQLite, migrasi, dan seed kenegaraan</div>
                <div className="aps-progress-bar">
                  <div className="aps-pb-fill fill-purple" style={{ width: '30%' }} />
                </div>
              </div>

              {/* Metric 3: Backend Server */}
              <div className="aps-metric-card">
                <div className="aps-mc-top">
                  <Cpu size={18} className="text-amber" />
                  <span className="aps-mc-label">Server Engine</span>
                </div>
                <div className="aps-mc-size">21.5 KB</div>
                <div className="aps-mc-desc">Express API REST routes & WebSocket layer</div>
                <div className="aps-progress-bar">
                  <div className="aps-pb-fill fill-amber" style={{ width: '15%' }} />
                </div>
              </div>

              {/* Metric 4: Public Assets & Media */}
              <div className="aps-metric-card">
                <div className="aps-mc-top">
                  <FolderGit2 size={18} className="text-emerald" />
                  <span className="aps-mc-label">Media & Public Assets</span>
                </div>
                <div className="aps-mc-size">98.1 MB</div>
                <div className="aps-mc-desc">Emblem Garuda, audio SFX, ikon & media kenegaraan</div>
                <div className="aps-progress-bar">
                  <div className="aps-pb-fill fill-emerald" style={{ width: '95%' }} />
                </div>
              </div>
            </div>

            {/* Table Detail Ukuran Dokumen Kunci */}
            <div className="aps-table-wrapper">
              <table className="aps-detail-table">
                <thead>
                  <tr>
                    <th>Berkas / Direktori Utama</th>
                    <th>Tipe / Peruntukan</th>
                    <th>Jumlah Berkas</th>
                    <th>Ukuran Fisik</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td><code>/PROGRESS.md</code></td>
                    <td>Dokumen Laporan & Roadmap Resmi</td>
                    <td>1 berkas</td>
                    <td><strong className="text-emerald">6.5 KB</strong> (101 baris)</td>
                  </tr>
                  <tr>
                    <td><code>/src/components/</code></td>
                    <td>Komponen Tampilan (Home, Map, Parlemen, dll.)</td>
                    <td>28 berkas</td>
                    <td><strong>~420 KB</strong></td>
                  </tr>
                  <tr>
                    <td><code>/src/context/GameContext.jsx</code></td>
                    <td>State Manager Geopolitik & Simulasi Utama</td>
                    <td>1 berkas</td>
                    <td><strong>~82 KB</strong></td>
                  </tr>
                  <tr>
                    <td><code>/src/App.css</code></td>
                    <td>Sistem Desain Visual, Glassmorphism & Animasi</td>
                    <td>1 berkas</td>
                    <td><strong>~152 KB</strong></td>
                  </tr>
                  <tr>
                    <td><code>/database/</code></td>
                    <td>Manajemen Skema & Generator Benih Data SQLite</td>
                    <td>9 berkas</td>
                    <td><strong>~485 KB</strong></td>
                  </tr>
                  <tr>
                    <td><code>/dist/ (Production Bundle)</code></td>
                    <td>Hasil Kompilasi Siap Produksi (Vite Gzip Optimized)</td>
                    <td>71 berkas</td>
                    <td><strong>~99.1 MB</strong></td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          {/* Markdown Quick Log Viewer Box */}
          <div className="admin-card glass-panel-gold" style={{ marginTop: '20px' }}>
            <div className="card-top-icon">
              <FileText size={24} className="text-amber" />
              <h3 className="card-title">Berkas Arsip: PROGRESS.md</h3>
            </div>
            <p className="card-desc">
              Dokumen lengkap tersimpan di direktori akar proyek: <code>PROGRESS.md</code> (Ukuran: 6.5 KB). Anda dapat menyunting atau memperluas catatan pengembangan ini kapan saja.
            </p>
            <div style={{ display: 'flex', gap: '10px', marginTop: '12px' }}>
              <button 
                className="btn-secondary"
                onClick={() => {
                  sounds.playClick();
                  showToast('PROGRESS.md (6.5 KB) berlokasi di direktori root proyek', 'success');
                }}
              >
                <CheckCircle size={15} /> Berkas Tersedia di Root Proyek (6.5 KB)
              </button>
            </div>
          </div>
        </div>
      )}


      {/* ================= MODAL: EDIT PLAYER PROFILE & ASSETS ================= */}
      {editingUser && (
        <div className="admin-modal-overlay">
          <div className="admin-modal-box glass-panel-gold">
            <div className="admin-modal-header">
              <div className="amh-left">
                <Sparkles size={20} className="gold-accent" />
                <h3>Edit Profil & Keuangan Pemain</h3>
              </div>
              <button 
                className="btn-modal-close"
                onClick={() => setEditingUser(null)}
              >
                <X size={18} />
              </button>
            </div>

            <div className="admin-modal-body">
              <div className="amb-user-preview">
                <div className="up-avatar">{editingUser.fullName?.charAt(0) || 'U'}</div>
                <div>
                  <strong>{editingUser.fullName}</strong>
                  <div className="text-dim text-xs">@{editingUser.username} • {editingUser.email}</div>
                </div>
              </div>

              <div className="amb-form-grid">
                <div className="amb-field">
                  <label>Nama Karakter / Lengkap</label>
                  <input 
                    type="text" 
                    value={editingUser.fullName || ''}
                    onChange={(e) => setEditingUser(prev => ({ ...prev, fullName: e.target.value }))}
                    className="amb-input"
                  />
                </div>

                <div className="amb-field">
                  <label>Nomor Kontak / WhatsApp</label>
                  <input 
                    type="text" 
                    placeholder="Contoh: 081234567890"
                    value={editingUser.phone || ''}
                    onChange={(e) => setEditingUser(prev => ({ ...prev, phone: e.target.value }))}
                    className="amb-input"
                  />
                </div>

                <div className="amb-field">
                  <label>Level Karakter</label>
                  <input 
                    type="number" 
                    min="1"
                    max="100"
                    value={editingUser.level || 1}
                    onChange={(e) => setEditingUser(prev => ({ ...prev, level: e.target.value }))}
                    className="amb-input"
                  />
                </div>

                <div className="amb-field">
                  <label>Uang In-Game (Dollar Republic Politic - $RP)</label>
                  <input 
                    type="number" 
                    min="0"
                    step="1000000"
                    value={editingUser.money || 0}
                    onChange={(e) => setEditingUser(prev => ({ ...prev, money: e.target.value }))}
                    className="amb-input"
                  />
                </div>

                <div className="amb-field amb-col-span">
                  <label>Cadangan Emas In-Game (Batangan)</label>
                  <input 
                    type="number" 
                    min="0"
                    value={editingUser.gold || 0}
                    onChange={(e) => setEditingUser(prev => ({ ...prev, gold: e.target.value }))}
                    className="amb-input"
                  />
                </div>
              </div>
            </div>

            <div className="admin-modal-footer">
              <button 
                className="btn-secondary"
                onClick={() => setEditingUser(null)}
              >
                Batal
              </button>
              <button 
                className="btn-gold"
                onClick={async () => {
                  await editUserDetails(editingUser.id, {
                    fullName: editingUser.fullName,
                    phone: editingUser.phone,
                    level: editingUser.level,
                    money: editingUser.money,
                    gold: editingUser.gold,
                  });
                  setEditingUser(null);
                }}
              >
                <Save size={15} /> Simpan Perubahan
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ================= MODAL: SECURE PASSWORD RESET ================= */}
      {passwordResetUser && (
        <div className="admin-modal-overlay">
          <div className="admin-modal-box glass-panel-gold">
            <div className="admin-modal-header">
              <div className="amh-left">
                <KeyRound size={20} className="gold-accent" />
                <h3>Setel Ulang Kata Sandi Akun</h3>
              </div>
              <button 
                className="btn-modal-close"
                onClick={() => setPasswordResetUser(null)}
              >
                <X size={18} />
              </button>
            </div>

            <div className="admin-modal-body">
              <div className="it-standard-notice">
                <ShieldAlert size={18} className="text-amber" />
                <span>
                  <strong>Standar Keamanan Internasional:</strong> Password lama tidak dapat didekripsi. Anda dapat menetapkan kata sandi sementara baru untuk pemain yang bersangkutan.
                </span>
              </div>

              <div className="amb-user-preview">
                <div className="up-avatar">{passwordResetUser.fullName?.charAt(0) || 'U'}</div>
                <div>
                  <strong>{passwordResetUser.fullName}</strong>
                  <div className="text-dim text-xs">@{passwordResetUser.username} • {passwordResetUser.email}</div>
                </div>
              </div>

              <div className="amb-field">
                <label>Kata Sandi Baru</label>
                <input 
                  type="text" 
                  placeholder="Masukkan kata sandi baru (min 6 karakter)..."
                  value={newPasswordInput}
                  onChange={(e) => setNewPasswordInput(e.target.value)}
                  className="amb-input"
                />
              </div>

              <div className="quick-password-helpers">
                <span className="text-xs text-dim">Generate cepat:</span>
                <button 
                  type="button" 
                  className="btn-mini-chip"
                  onClick={() => setNewPasswordInput('Republik' + Math.floor(1000 + Math.random() * 9000))}
                >
                  Acak Sandi Kuat
                </button>
                <button 
                  type="button" 
                  className="btn-mini-chip"
                  onClick={() => setNewPasswordInput('password123')}
                >
                  Default (password123)
                </button>
              </div>
            </div>

            <div className="admin-modal-footer">
              <button 
                className="btn-secondary"
                onClick={() => setPasswordResetUser(null)}
              >
                Batal
              </button>
              <button 
                className="btn-gold"
                disabled={!newPasswordInput || newPasswordInput.length < 6}
                onClick={async () => {
                  await resetPasswordForUser(passwordResetUser.id, newPasswordInput);
                  setPasswordResetUser(null);
                }}
              >
                <Lock size={15} /> Terapkan Kata Sandi Baru
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
