import React, { useState, useEffect } from 'react';
import { useGame } from '../context/GameContext';
import { sounds } from '../utils/soundEffects';
import { 
  Settings, 
  Volume2, 
  VolumeX, 
  Moon, 
  Sun, 
  Monitor, 
  Bell, 
  BellOff, 
  Shield, 
  Database, 
  RotateCcw, 
  Save, 
  CheckCircle2, 
  Globe, 
  Sliders, 
  Cpu, 
  Sparkles, 
  Download, 
  Upload, 
  RefreshCw,
  Eye,
  Zap,
  Info
} from 'lucide-react';

const SETTINGS_STORAGE_KEY = 'rn_user_settings_v1';

export default function SettingsView() {
  const { 
    currentUser, 
    userRole, 
    isDbConnected, 
    resetGameData, 
    showToast 
  } = useGame();

  // Local settings state with persistence
  const [settings, setSettings] = useState(() => {
    const defaults = {
      soundEnabled: true,
      soundVolume: 80,
      soundTheme: 'orchestral', // orchestral | modern | retro
      themeMode: 'dark', // dark | midnight | warm
      ambientParticles: true,
      performanceMode: false,
      mapRenderQuality: 'high', // high | balanced | low
      autoRefreshInterval: 2500, // ms
      notificationsEnabled: true,
      breakingNewsTicker: true,
      hapticFeedback: true,
      streamerMode: false,
      language: 'id',
      confirmBeforeActions: true,
    };

    try {
      const saved = localStorage.getItem(SETTINGS_STORAGE_KEY);
      if (saved) {
        return { ...defaults, ...JSON.parse(saved) };
      }
    } catch {
      // fallback
    }
    return defaults;
  });

  const [activeCategory, setActiveCategory] = useState('general'); // general | audio | display | gameplay | system
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);
  const [exportJson, setExportJson] = useState('');
  const [showExportModal, setShowExportModal] = useState(false);

  // Sync sound manager enabled state
  useEffect(() => {
    sounds.enabled = settings.soundEnabled;
  }, [settings.soundEnabled]);

  const updateSetting = (key, value) => {
    sounds.playClick();
    setSettings((prev) => {
      const updated = { ...prev, [key]: value };
      try {
        localStorage.setItem(SETTINGS_STORAGE_KEY, JSON.stringify(updated));
      } catch {
        // storage quota
      }
      return updated;
    });
    setHasUnsavedChanges(true);
  };

  const handleSaveAll = () => {
    sounds.playSuccess();
    try {
      localStorage.setItem(SETTINGS_STORAGE_KEY, JSON.stringify(settings));
      showToast('Seluruh preferensi pengaturan berhasil disimpan!', 'success');
      setHasUnsavedChanges(false);
    } catch {
      showToast('Gagal menyimpan ke penyimpanan lokal browser.', 'error');
    }
  };

  const handleResetSettings = () => {
    sounds.playClick();
    if (window.confirm('Kembalikan semua preferensi ke setelan standar bawaan pabrik?')) {
      localStorage.removeItem(SETTINGS_STORAGE_KEY);
      setSettings({
        soundEnabled: true,
        soundVolume: 80,
        soundTheme: 'orchestral',
        themeMode: 'dark',
        ambientParticles: true,
        performanceMode: false,
        mapRenderQuality: 'high',
        autoRefreshInterval: 2500,
        notificationsEnabled: true,
        breakingNewsTicker: true,
        hapticFeedback: true,
        streamerMode: false,
        language: 'id',
        confirmBeforeActions: true,
      });
      sounds.playSuccess();
      showToast('Pengaturan telah direset ke setelan standar.', 'info');
      setHasUnsavedChanges(false);
    }
  };

  const handleExportData = () => {
    sounds.playClick();
    try {
      const allSaveData = {};
      for (let i = 0; i < localStorage.length; i++) {
        const k = localStorage.key(i);
        if (k && (k.startsWith('republik_nusantara') || k.startsWith('rn_'))) {
          allSaveData[k] = localStorage.getItem(k);
        }
      }
      setExportJson(JSON.stringify(allSaveData, null, 2));
      setShowExportModal(true);
    } catch {
      showToast('Gagal mengekspor data simpanan.', 'error');
    }
  };

  const copyToClipboard = () => {
    sounds.playClick();
    navigator.clipboard?.writeText(exportJson);
    showToast('Teks backup game berhasil disalin ke papan klip!', 'success');
  };

  return (
    <div className="settings-page-viewport animate-fadeIn">
      {/* Header Banner */}
      <div className="settings-header-card glass-panel-gold">
        <div className="shc-left">
          <div className="shc-icon-badge">
            <Settings size={28} className="gold-accent" />
          </div>
          <div>
            <div className="shc-badge-row">
              <span className="badge badge-gold">Pusat Konfigurasi Sistem</span>
              <span className="badge badge-cyan">Versi 1.0.4-LTS</span>
            </div>
            <h2 className="shc-title">Pengaturan & Preferensi Permainan</h2>
            <p className="shc-desc">
              Kustomisasi pengalaman audio-visual, laju simulasi real-time geopolitik, privasi, serta manajemen data simpanan negara.
            </p>
          </div>
        </div>

        <div className="shc-actions">
          {hasUnsavedChanges && (
            <button className="btn-gold animate-pulse" onClick={handleSaveAll}>
              <Save size={16} /> Simpan Perubahan
            </button>
          )}
          <button className="btn-secondary" onClick={handleResetSettings}>
            <RotateCcw size={16} /> Reset Default
          </button>
        </div>
      </div>

      {/* Main Container: Sidebar + Content */}
      <div className="settings-grid-layout">
        {/* Nav Tabs */}
        <aside className="settings-nav-card glass-panel">
          <button
            className={`settings-nav-btn ${activeCategory === 'general' ? 'active' : ''}`}
            onClick={() => { sounds.playClick(); setActiveCategory('general'); }}
          >
            <Sliders size={18} />
            <div className="snb-text">
              <strong>Umum & Antarmuka</strong>
              <span>Bahasa, ticker & privasi</span>
            </div>
          </button>

          <button
            className={`settings-nav-btn ${activeCategory === 'audio' ? 'active' : ''}`}
            onClick={() => { sounds.playClick(); setActiveCategory('audio'); }}
          >
            <Volume2 size={18} />
            <div className="snb-text">
              <strong>Efek Suara & Audio</strong>
              <span>Ketukan palu, koin & ledakan</span>
            </div>
          </button>

          <button
            className={`settings-nav-btn ${activeCategory === 'display' ? 'active' : ''}`}
            onClick={() => { sounds.playClick(); setActiveCategory('display'); }}
          >
            <Monitor size={18} />
            <div className="snb-text">
              <strong>Tampilan Grafis & Peta</strong>
              <span>Resolusi peta & tema visual</span>
            </div>
          </button>

          <button
            className={`settings-nav-btn ${activeCategory === 'gameplay' ? 'active' : ''}`}
            onClick={() => { sounds.playClick(); setActiveCategory('gameplay'); }}
          >
            <Zap size={18} />
            <div className="snb-text">
              <strong>Simulasi & Gameplay</strong>
              <span>Laju tick politik & notifikasi</span>
            </div>
          </button>

          <button
            className={`settings-nav-btn ${activeCategory === 'system' ? 'active' : ''}`}
            onClick={() => { sounds.playClick(); setActiveCategory('system'); }}
          >
            <Database size={18} />
            <div className="snb-text">
              <strong>Data & Penyimpanan</strong>
              <span>Backup, restore & reset game</span>
            </div>
          </button>
        </aside>

        {/* Setting Panels */}
        <section className="settings-content-card glass-panel">
          {/* 1. UMUM & ANTARMUKA */}
          {activeCategory === 'general' && (
            <div className="settings-panel-section animate-slideDown">
              <div className="sps-header">
                <Sliders size={22} className="gold-accent" />
                <div>
                  <h3>Pengaturan Umum & Aksesibilitas</h3>
                  <p>Sesuaikan bahasa, tampilan peringatan dialog, dan mode privasi siaran.</p>
                </div>
              </div>

              <div className="setting-items-list">
                <div className="setting-row">
                  <div className="setting-info">
                    <Globe size={18} className="text-cyan" />
                    <div>
                      <strong>Bahasa Sistem Kenegaraan</strong>
                      <p>Bahasa tampilan legislasi, risalah sidang, dan instrumen militer.</p>
                    </div>
                  </div>
                  <div className="setting-control">
                    <select 
                      className="form-select settings-select"
                      value={settings.language}
                      onChange={(e) => updateSetting('language', e.target.value)}
                    >
                      <option value="id">Bahasa Indonesia (Resmi NKRI)</option>
                      <option value="en">English (International)</option>
                    </select>
                  </div>
                </div>

                <div className="setting-row">
                  <div className="setting-info">
                    <Sparkles size={18} className="gold-accent" />
                    <div>
                      <strong>Running Text Breaking News</strong>
                      <p>Tampilkan siaran darurat geopolitik dan hasil pemilu di bilah atas.</p>
                    </div>
                  </div>
                  <div className="setting-control">
                    <label className="toggle-switch">
                      <input 
                        type="checkbox"
                        checked={settings.breakingNewsTicker}
                        onChange={(e) => updateSetting('breakingNewsTicker', e.target.checked)}
                      />
                      <span className="toggle-slider"></span>
                    </label>
                  </div>
                </div>

                <div className="setting-row">
                  <div className="setting-info">
                    <Eye size={18} className="text-purple" />
                    <div>
                      <strong>Mode Sensor Akun (Streamer Mode)</strong>
                      <p>Menyamarkan NIK KTP, alamat email, dan informasi login sensitif.</p>
                    </div>
                  </div>
                  <div className="setting-control">
                    <label className="toggle-switch">
                      <input 
                        type="checkbox"
                        checked={settings.streamerMode}
                        onChange={(e) => updateSetting('streamerMode', e.target.checked)}
                      />
                      <span className="toggle-slider"></span>
                    </label>
                  </div>
                </div>

                <div className="setting-row">
                  <div className="setting-info">
                    <Shield size={18} className="font-emerald" />
                    <div>
                      <strong>Konfirmasi Tindakan Krusial</strong>
                      <p>Minta persetujuan sebelum mendeklarasikan perang atau membelanjakan kas besar.</p>
                    </div>
                  </div>
                  <div className="setting-control">
                    <label className="toggle-switch">
                      <input 
                        type="checkbox"
                        checked={settings.confirmBeforeActions}
                        onChange={(e) => updateSetting('confirmBeforeActions', e.target.checked)}
                      />
                      <span className="toggle-slider"></span>
                    </label>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* 2. AUDIO & EFEK SUARA */}
          {activeCategory === 'audio' && (
            <div className="settings-panel-section animate-slideDown">
              <div className="sps-header">
                <Volume2 size={22} className="gold-accent" />
                <div>
                  <h3>Tata Suara Geopolitik & Audio Synthesizer</h3>
                  <p>Web Audio API synthesizer bawaan untuk efek taktil ketukan palu, koin, dan dentuman perang.</p>
                </div>
              </div>

              <div className="setting-items-list">
                <div className="setting-row">
                  <div className="setting-info">
                    {settings.soundEnabled ? <Volume2 size={18} className="text-cyan" /> : <VolumeX size={18} className="font-crimson" />}
                    <div>
                      <strong>Master Audio Permainan</strong>
                      <p>Nyalakan atau heningkan seluruh efek suara antarmuka.</p>
                    </div>
                  </div>
                  <div className="setting-control">
                    <label className="toggle-switch">
                      <input 
                        type="checkbox"
                        checked={settings.soundEnabled}
                        onChange={(e) => updateSetting('soundEnabled', e.target.checked)}
                      />
                      <span className="toggle-slider"></span>
                    </label>
                  </div>
                </div>

                <div className="setting-row">
                  <div className="setting-info">
                    <Zap size={18} className="gold-accent" />
                    <div>
                      <strong>Volume Master ({settings.soundVolume}%)</strong>
                      <p>Tingkat intensitas desibel efek audio synthesizer.</p>
                    </div>
                  </div>
                  <div className="setting-control">
                    <input 
                      type="range" 
                      min="0" 
                      max="100" 
                      value={settings.soundVolume}
                      onChange={(e) => updateSetting('soundVolume', Number(e.target.value))}
                      className="settings-range"
                      disabled={!settings.soundEnabled}
                    />
                  </div>
                </div>

                <div className="setting-row">
                  <div className="setting-info">
                    <Sparkles size={18} className="text-purple" />
                    <div>
                      <strong>Gaya & Karakter Suara</strong>
                      <p>Pilih aransemen palu sidang dan notifikasi kenegaraan.</p>
                    </div>
                  </div>
                  <div className="setting-control">
                    <select 
                      className="form-select settings-select"
                      value={settings.soundTheme}
                      onChange={(e) => updateSetting('soundTheme', e.target.value)}
                      disabled={!settings.soundEnabled}
                    >
                      <option value="orchestral">Simfoni Kenegaraan (Resmi DPR)</option>
                      <option value="modern">Futuristik Minimalis</option>
                      <option value="retro">Arcade Militer Klasik</option>
                    </select>
                  </div>
                </div>

                <div className="setting-audio-test-box glass-panel-gold">
                  <div className="sat-title">
                    <Info size={16} /> Uji Coba Efek Suara Langsung
                  </div>
                  <div className="sat-buttons">
                    <button className="btn-secondary btn-sm" onClick={() => sounds.playClick()}>
                      Uji Suara Klik
                    </button>
                    <button className="btn-secondary btn-sm" onClick={() => sounds.playCoin()}>
                      Uji Denting Koin APBN
                    </button>
                    <button className="btn-gold btn-sm" onClick={() => sounds.playGavel()}>
                      Uji Palu Parlemen
                    </button>
                    <button className="btn-secondary btn-sm" onClick={() => sounds.playExplosion()}>
                      Uji Ledakan Perang
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* 3. TAMPILAN GRAFIS & PETA */}
          {activeCategory === 'display' && (
            <div className="settings-panel-section animate-slideDown">
              <div className="sps-header">
                <Monitor size={22} className="gold-accent" />
                <div>
                  <h3>Konfigurasi Grafis & Peta Interaktif</h3>
                  <p>Sesuaikan tema warna panel kaca, performa rendering Leaflet, dan partikel animasi.</p>
                </div>
              </div>

              <div className="setting-items-list">
                <div className="setting-row">
                  <div className="setting-info">
                    <Moon size={18} className="gold-accent" />
                    <div>
                      <strong>Tema Nuansa Geopolitik</strong>
                      <p>Palet warna dominan antarmuka dan panel parlemen.</p>
                    </div>
                  </div>
                  <div className="setting-control">
                    <select 
                      className="form-select settings-select"
                      value={settings.themeMode}
                      onChange={(e) => updateSetting('themeMode', e.target.value)}
                    >
                      <option value="dark">Garuda Obsidian Emas (Default)</option>
                      <option value="midnight">Biru Bahari Nusantara (Midnight)</option>
                      <option value="warm">Merah Putih Kedaulatan (Warm)</option>
                    </select>
                  </div>
                </div>

                <div className="setting-row">
                  <div className="setting-info">
                    <Cpu size={18} className="text-cyan" />
                    <div>
                      <strong>Kualitas Rendering Peta 38 Provinsi</strong>
                      <p>Resolusi render layer Leaflet GIS dan transisi batas wilayah.</p>
                    </div>
                  </div>
                  <div className="setting-control">
                    <select 
                      className="form-select settings-select"
                      value={settings.mapRenderQuality}
                      onChange={(e) => updateSetting('mapRenderQuality', e.target.value)}
                    >
                      <option value="high">Kualitas Tinggi (GPU Hardware Accelerated)</option>
                      <option value="balanced">Seimbang (Rekomendasi Laptop/HP)</option>
                      <option value="low">Mode Hemat Daya (Ringan & Cepat)</option>
                    </select>
                  </div>
                </div>

                <div className="setting-row">
                  <div className="setting-info">
                    <Sparkles size={18} className="text-purple" />
                    <div>
                      <strong>Efek Partikel Kemenangan (Confetti)</strong>
                      <p>Tampilkan animasi taburan confetti saat RUU disahkan atau naik level.</p>
                    </div>
                  </div>
                  <div className="setting-control">
                    <label className="toggle-switch">
                      <input 
                        type="checkbox"
                        checked={settings.ambientParticles}
                        onChange={(e) => updateSetting('ambientParticles', e.target.checked)}
                      />
                      <span className="toggle-slider"></span>
                    </label>
                  </div>
                </div>

                <div className="setting-row">
                  <div className="setting-info">
                    <Cpu size={18} className="font-crimson" />
                    <div>
                      <strong>Mode Kinerja Tinggi (Kurangi Animasi)</strong>
                      <p>Nonaktifkan blur glassmorphism untuk menghemat baterai & memori RAM.</p>
                    </div>
                  </div>
                  <div className="setting-control">
                    <label className="toggle-switch">
                      <input 
                        type="checkbox"
                        checked={settings.performanceMode}
                        onChange={(e) => updateSetting('performanceMode', e.target.checked)}
                      />
                      <span className="toggle-slider"></span>
                    </label>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* 4. SIMULASI & GAMEPLAY */}
          {activeCategory === 'gameplay' && (
            <div className="settings-panel-section animate-slideDown">
              <div className="sps-header">
                <Zap size={22} className="gold-accent" />
                <div>
                  <h3>Parameter Simulasi Dinamis & Notifikasi</h3>
                  <p>Kontrol frekuensi pergerakan harga komoditas pasar, fluktuasi perang, dan voting DPR.</p>
                </div>
              </div>

              <div className="setting-items-list">
                <div className="setting-row">
                  <div className="setting-info">
                    <RefreshCw size={18} className="text-cyan" />
                    <div>
                      <strong>Interval Detak Permainan (Game Tick)</strong>
                      <p>Frekuensi pemulihan energi dan pergerakan garis depan tempur.</p>
                    </div>
                  </div>
                  <div className="setting-control">
                    <select 
                      className="form-select settings-select"
                      value={settings.autoRefreshInterval}
                      onChange={(e) => updateSetting('autoRefreshInterval', Number(e.target.value))}
                    >
                      <option value="1500">Cepat (1.5 detik - Sangat Responsif)</option>
                      <option value="2500">Standar (2.5 detik - Seimbang)</option>
                      <option value="5000">Santai (5.0 detik - Hemat Data)</option>
                    </select>
                  </div>
                </div>

                <div className="setting-row">
                  <div className="setting-info">
                    <Bell size={18} className="gold-accent" />
                    <div>
                      <strong>Pemberitahuan Mengambang (Floating Toast)</strong>
                      <p>Tampilkan pop-up hasil dinas kerja, transaksi komoditas, dan perolehan suara.</p>
                    </div>
                  </div>
                  <div className="setting-control">
                    <label className="toggle-switch">
                      <input 
                        type="checkbox"
                        checked={settings.notificationsEnabled}
                        onChange={(e) => updateSetting('notificationsEnabled', e.target.checked)}
                      />
                      <span className="toggle-slider"></span>
                    </label>
                  </div>
                </div>

                <div className="stat-overview-card glass-panel-gold" style={{ marginTop: '16px' }}>
                  <div className="soc-top">
                    <div className="soc-title-wrap">
                      <Shield size={18} className="gold-accent" />
                      <strong>Status Sesi Warga Negara</strong>
                    </div>
                    <span className="badge badge-emerald">Aktif Terverifikasi</span>
                  </div>
                  <div className="session-status-content" style={{ fontSize: '0.85rem', color: '#94a3b8', lineHeight: 1.6 }}>
                    <div>ID Pengguna: <strong className="text-white">{currentUser?.id || 'Tamu'}</strong></div>
                    <div>Nama Akun: <strong className="text-white">{currentUser?.fullName || currentUser?.username || 'Warga'}</strong></div>
                    <div>Otoritas Sistem: <strong className="font-gold">{(userRole || 'player').toUpperCase()}</strong></div>
                    <div>Status Database: <strong className={isDbConnected ? 'font-emerald' : 'text-amber'}>{isDbConnected ? 'MySQL Terhubung (Online)' : 'Local Storage Fallback'}</strong></div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* 5. DATA & PENYIMPANAN */}
          {activeCategory === 'system' && (
            <div className="settings-panel-section animate-slideDown">
              <div className="sps-header">
                <Database size={22} className="gold-accent" />
                <div>
                  <h3>Manajemen Basis Data & Cadangan (Backup)</h3>
                  <p>Ekspor dan amankan progres kewarganegaraan, atau setel ulang seluruh data permainan.</p>
                </div>
              </div>

              <div className="setting-items-list">
                <div className="backup-actions-grid">
                  <div className="backup-card glass-panel-gold">
                    <div className="bc-top">
                      <Download size={22} className="font-emerald" />
                      <div>
                        <strong>Cadangkan Data (Export JSON)</strong>
                        <p>Simpan salinan progres partai, uang, emas, dan wilayah ke file teks.</p>
                      </div>
                    </div>
                    <button className="btn-gold btn-sm" onClick={handleExportData}>
                      <Download size={14} /> Buat Cadangan Data
                    </button>
                  </div>

                  <div className="backup-card glass-panel-gold">
                    <div className="bc-top">
                      <RotateCcw size={22} className="font-crimson" />
                      <div>
                        <strong>Reset Progres Total</strong>
                        <p>Hapus seluruh data di browser dan mulai kembali dari warga baru.</p>
                      </div>
                    </div>
                    <button className="btn-crimson btn-sm" onClick={resetGameData}>
                      <RotateCcw size={14} /> Reset Seluruh Data
                    </button>
                  </div>
                </div>

                <div className="system-specs-summary glass-panel">
                  <h4>Informasi Arsitektur Perangkat Lunak</h4>
                  <ul className="specs-list">
                    <li><span>Frontend Framework:</span> <strong>React 19.2 + Vite 8.3</strong></li>
                    <li><span>Visual Styling:</span> <strong>Vanilla Glassmorphism UI Engine</strong></li>
                    <li><span>Geospatial Map:</span> <strong>Leaflet 1.9 (Vector GeoJSON 38 Provinsi)</strong></li>
                    <li><span>Audio Synthesizer:</span> <strong>Web Audio API Hardware Synths</strong></li>
                    <li><span>Database Persistence:</span> <strong>MySQL 8.x + Client LocalStorage</strong></li>
                  </ul>
                </div>
              </div>
            </div>
          )}
        </section>
      </div>

      {/* Export Modal */}
      {showExportModal && (
        <div className="auth-portal-overlay">
          <div className="auth-portal-card glass-panel-gold" style={{ maxWidth: '640px' }}>
            <div className="apc-header">
              <Download size={24} className="gold-accent" />
              <div>
                <h3>Data Cadangan Permainan (JSON)</h3>
                <p>Salin teks ini dan simpan di tempat aman untuk memulihkan progres di masa mendatang.</p>
              </div>
            </div>

            <textarea 
              readOnly 
              value={exportJson} 
              className="export-json-textarea"
              rows={12}
            />

            <div className="modal-actions-row">
              <button className="btn-gold" onClick={copyToClipboard}>
                Salin ke Clipboard
              </button>
              <button className="btn-secondary" onClick={() => setShowExportModal(false)}>
                Tutup
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
