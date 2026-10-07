import React, { useState } from 'react';
import { useGame } from '../context/GameContext';
import { sounds } from '../utils/soundEffects';
import { 
  ShieldCheck, 
  Mail, 
  Key, 
  User, 
  ArrowRight, 
  Sparkles, 
  AlertCircle, 
  Eye, 
  EyeOff, 
  Database, 
  Lock, 
  CheckCircle2, 
  Globe,
  Award,
  MapPin,
  Flag
} from 'lucide-react';

export default function AuthModal() {
  const { 
    login, 
    register, 
    loginWithGoogle, 
    parties, 
    regions,
    isDbConnected 
  } = useGame();

  const [activeTab, setActiveTab] = useState('login'); // 'login' | 'register'
  
  // Login Form State
  const [loginIdentifier, setLoginIdentifier] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  const [showLoginPassword, setShowLoginPassword] = useState(false);

  // Register Form State
  const [regFullName, setRegFullName] = useState('');
  const [regEmail, setRegEmail] = useState('');
  const [regUsername, setRegUsername] = useState('');
  const [regPassword, setRegPassword] = useState('');
  const [regConfirmPassword, setRegConfirmPassword] = useState('');
  const [showRegPassword, setShowRegPassword] = useState(false);
  const [showRegConfirmPassword, setShowRegConfirmPassword] = useState(false);
  const [regPartyId, setRegPartyId] = useState('');
  const [regRegionId, setRegRegionId] = useState('dki');

  // Google SSO Input State
  const [showGoogleInput, setShowGoogleInput] = useState(false);
  const [googleEmail, setGoogleEmail] = useState('');

  // Status & Feedback State
  const [errorMessage, setErrorMessage] = useState('');
  const [isVerifying, setIsVerifying] = useState(false);
  const [verificationStage, setVerificationStage] = useState('');

  // 1. Handle Login Submit (Role is resolved automatically from SQLite database)
  const handleLoginSubmit = async (e) => {
    if (e) e.preventDefault();
    setErrorMessage('');
    if (!loginIdentifier.trim()) {
      setErrorMessage('Silakan masukkan Alamat Email atau Username Anda.');
      return;
    }

    setIsVerifying(true);
    setVerificationStage('Menghubungkan ke basis data kependudukan SQLite...');
    sounds.playClick();

    setTimeout(async () => {
      setVerificationStage('Mengecek email & memverifikasi otoritas role di database...');
      const res = await login(loginIdentifier.trim(), loginPassword);

      if (!res.success) {
        setIsVerifying(false);
        setErrorMessage(res.error || 'Email/Username atau kata sandi tidak cocok.');
      } else {
        setVerificationStage(`Otoritas Terverifikasi: ${(res.user?.role || 'player').toUpperCase()}`);
        setTimeout(() => {
          setIsVerifying(false);
        }, 500);
      }
    }, 400);
  };

  // 2. Handle Register Submit (Account & Role saved directly into SQLite database)
  const handleRegisterSubmit = async (e) => {
    if (e) e.preventDefault();
    setErrorMessage('');

    if (!regFullName.trim() || !regEmail.trim() || !regPassword) {
      setErrorMessage('Semua kolom bertanda bintang (*) wajib diisi.');
      return;
    }

    if (regPassword.length < 6) {
      setErrorMessage('Kata sandi harus minimal 6 karakter demi keamanan akun.');
      return;
    }

    if (regPassword !== regConfirmPassword) {
      setErrorMessage('Konfirmasi kata sandi tidak cocok. Harap periksa kembali.');
      return;
    }

    setIsVerifying(true);
    setVerificationStage('Mendaftarkan akun ke basis data resmi Republik...');
    sounds.playClick();

    setTimeout(async () => {
      const res = await register({
        fullName: regFullName.trim(),
        email: regEmail.trim(),
        username: regUsername.trim() || regEmail.trim().split('@')[0],
        password: regPassword,
        partyId: regPartyId || null,
        residenceRegionId: regRegionId
      });

      if (!res.success) {
        setIsVerifying(false);
        setErrorMessage(res.error || 'Pendaftaran gagal.');
      } else {
        setVerificationStage(`Pendaftaran Sukses! Role (${(res.user?.role || 'player').toUpperCase()}) ditetapkan dari database.`);
        setTimeout(() => {
          setIsVerifying(false);
        }, 600);
      }
    }, 450);
  };

  // 3. Handle Google SSO (Role resolved automatically from Database)
  const handleGoogleSubmit = async (e) => {
    if (e) e.preventDefault();
    setErrorMessage('');
    if (!googleEmail.trim()) {
      setErrorMessage('Silakan ketikkan alamat email Google/Gmail Anda.');
      return;
    }

    let finalEmail = googleEmail.trim().toLowerCase();
    if (!finalEmail.includes('@')) {
      finalEmail = `${finalEmail}@gmail.com`;
    }

    setIsVerifying(true);
    setVerificationStage('Menghubungkan Single Sign-On ke Database...');
    sounds.playClick();

    setTimeout(async () => {
      const res = await loginWithGoogle(finalEmail, null);
      if (!res.success) {
        setIsVerifying(false);
        setErrorMessage(res.error || 'Gagal masuk akun Google.');
      } else {
        setVerificationStage(`Otoritas Terverifikasi: ${(res.user?.role || 'player').toUpperCase()}`);
        setTimeout(() => {
          setIsVerifying(false);
        }, 500);
      }
    }, 400);
  };

  // Google SVG Icon
  const GoogleIcon = () => (
    <svg width="18" height="18" viewBox="0 0 24 24" className="google-svg">
      <path
        fill="#4285F4"
        d="M23.745 12.27c0-.7-.06-1.4-.19-2.07H12v4.51h6.6c-.29 1.52-1.14 2.82-2.4 3.68v3.05h3.88c2.27-2.09 3.665-5.17 3.665-9.17z"
      />
      <path
        fill="#34A853"
        d="M12 24c3.24 0 5.95-1.08 7.93-2.91l-3.88-3.05c-1.08.72-2.45 1.16-4.05 1.16-3.12 0-5.77-2.1-6.72-4.93H1.24v3.15C3.26 21.36 7.33 24 12 24z"
      />
      <path
        fill="#FBBC05"
        d="M5.28 14.27c-.25-.72-.38-1.49-.38-2.27s.13-1.55.38-2.27V6.58H1.24C.45 8.14 0 9.9 0 12s.45 3.86 1.24 5.42l4.04-3.15z"
      />
      <path
        fill="#EA4335"
        d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C17.95 1.19 15.24 0 12 0 7.33 0 3.26 2.64 1.24 6.58l4.04 3.15c.95-2.83 3.6-4.98 6.72-4.98z"
      />
    </svg>
  );

  return (
    <div className="auth-portal-overlay">
      <div className="auth-portal-card glass-panel-gold">
        
        {/* Brand Header */}
        <div className="auth-brand-header">
          <img 
            src="/emblem.jpg" 
            alt="Lambang Republik Nusantara" 
            className="auth-emblem-img"
          />
          <div className="auth-brand-titles">
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
              <span className="auth-kemenkumham-tag">
                <ShieldCheck size={14} color="#fbbf24" /> PORTAL LOGIN RESMI NEGARA
              </span>
              <span className={`db-live-indicator ${isDbConnected ? 'connected' : 'offline'}`} style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '6px',
                fontSize: '11px',
                padding: '3px 8px',
                borderRadius: '999px',
                background: isDbConnected ? 'rgba(16, 185, 129, 0.15)' : 'rgba(239, 68, 68, 0.15)',
                color: isDbConnected ? '#34d399' : '#f87171',
                border: `1px solid ${isDbConnected ? 'rgba(16, 185, 129, 0.3)' : 'rgba(239, 68, 68, 0.3)'}`
              }}>
                <span className="db-pulsing-dot" style={{
                  width: '6px',
                  height: '6px',
                  borderRadius: '50%',
                  background: isDbConnected ? '#10b981' : '#ef4444'
                }} />
                {isDbConnected ? 'Server Database Terhubung' : 'Mode Offline / Local Storage'}
              </span>
            </div>
            <h1 className="auth-title">REPUBLIC POLITIC</h1>
            <p className="auth-subtitle">
              Sistem Otentikasi Sipil & Parlemen. Hak akses & otoritas role ditentukan langsung dari basis data.
            </p>
          </div>
        </div>

        {/* Error Alert */}
        {errorMessage && (
          <div className="auth-error-banner" style={{ marginBottom: '16px' }}>
            <AlertCircle size={16} />
            <span>{errorMessage}</span>
          </div>
        )}

        {/* Verification Progress Banner */}
        {isVerifying && (
          <div className="auth-verif-box" style={{ marginBottom: '18px' }}>
            <Database size={18} className="spin-slow" />
            <span>{verificationStage}</span>
          </div>
        )}

        {/* Main Tab Navigation: Masuk vs Daftar (Hanya 2 Tab Standar, Tanpa Pemilihan Role!) */}
        <div className="auth-nav-tabs">
          <button
            type="button"
            className={`auth-nav-tab-btn ${activeTab === 'login' ? 'active' : ''}`}
            onClick={() => { sounds.playClick(); setActiveTab('login'); setErrorMessage(''); }}
          >
            <Key size={15} />
            <span>Masuk ke Akun</span>
          </button>
          <button
            type="button"
            className={`auth-nav-tab-btn ${activeTab === 'register' ? 'active' : ''}`}
            onClick={() => { sounds.playClick(); setActiveTab('register'); setErrorMessage(''); }}
          >
            <User size={15} />
            <span>Daftar Warga Baru</span>
          </button>
        </div>

        {/* ==================== FORM 1: MASUK (LOGIN) ==================== */}
        {activeTab === 'login' && (
          <form onSubmit={handleLoginSubmit} className="auth-form-content">
            <div className="auth-form-group">
              <label><Mail size={14} /> Alamat Email atau Username:</label>
              <div className="auth-input-wrapper">
                <input
                  type="text"
                  placeholder="nama.anda@email.com atau username"
                  value={loginIdentifier}
                  onChange={(e) => setLoginIdentifier(e.target.value)}
                  required
                  className="auth-input"
                  autoFocus
                />
              </div>
              <span className="input-hint">Role (Super Admin / Moderator / Player) otomatis dikenali dari basis data sesuai email.</span>
            </div>

            <div className="auth-form-group">
              <label><Lock size={14} /> Kata Sandi:</label>
              <div className="auth-input-wrapper" style={{ position: 'relative' }}>
                <input
                  type={showLoginPassword ? 'text' : 'password'}
                  placeholder="Masukkan kata sandi akun"
                  value={loginPassword}
                  onChange={(e) => setLoginPassword(e.target.value)}
                  className="auth-input"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowLoginPassword(!showLoginPassword)}
                  className="auth-toggle-pwd"
                  tabIndex={-1}
                  aria-label="Tampilkan sandi"
                >
                  {showLoginPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              className="btn-gold auth-submit-btn"
              disabled={isVerifying}
              style={{ width: '100%', marginTop: '6px' }}
            >
              <ShieldCheck size={18} />
              <span>{isVerifying ? 'Memverifikasi di Database...' : 'Masuk Langsung ke Sistem'}</span>
            </button>

            {/* Quick Test Accounts for instant access */}
            <div style={{ marginTop: '12px', display: 'flex', flexDirection: 'column', gap: '6px' }}>
              <span style={{ fontSize: '0.72rem', color: '#94a3b8' }}>Akun Uji Langsung (Klik untuk isi cepat):</span>
              <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
                <button
                  type="button"
                  className="btn-mini-chip"
                  onClick={() => {
                    setLoginIdentifier('satria');
                    setLoginPassword('password123');
                  }}
                >
                  👤 Satria (Player)
                </button>
                <button
                  type="button"
                  className="btn-mini-chip"
                  onClick={() => {
                    setLoginIdentifier('superadmin');
                    setLoginPassword('adminpassword');
                  }}
                >
                  👑 Super Admin
                </button>
                <button
                  type="button"
                  className="btn-mini-chip"
                  onClick={() => {
                    setLoginIdentifier('moderator');
                    setLoginPassword('modpassword');
                  }}
                >
                  🛡️ Moderator
                </button>
              </div>
            </div>

            {/* Single Sign-On Google Option */}
            <div style={{ marginTop: '16px', borderTop: '1px solid rgba(255,255,255,0.08)', paddingTop: '14px' }}>
              {!showGoogleInput ? (
                <button
                  type="button"
                  className="google-account-tile"
                  style={{ width: '100%', justifyContent: 'center' }}
                  onClick={() => setShowGoogleInput(true)}
                >
                  <GoogleIcon />
                  <span style={{ fontWeight: 700, fontSize: '0.82rem', color: '#f8fafc' }}>
                    Masuk Cepat dengan Akun Google / Gmail
                  </span>
                </button>
              ) : (
                <div className="custom-gmail-form" style={{ marginTop: '6px' }}>
                  <label style={{ fontSize: '0.74rem', color: '#cbd5e1', fontWeight: 700 }}>
                    Masukkan Email Google Anda:
                  </label>
                  <div style={{ display: 'flex', gap: '8px' }}>
                    <input
                      type="text"
                      placeholder="nama@gmail.com"
                      value={googleEmail}
                      onChange={(e) => setGoogleEmail(e.target.value)}
                      className="auth-input"
                      style={{ flex: 1 }}
                    />
                    <button
                      type="button"
                      onClick={handleGoogleSubmit}
                      disabled={isVerifying}
                      className="btn-gold"
                      style={{ padding: '0 16px', fontSize: '0.78rem', whiteSpace: 'nowrap' }}
                    >
                      Masuk
                    </button>
                  </div>
                  <span className="input-hint">Role ditentukan secara otomatis berdasarkan database kenegaraan.</span>
                </div>
              )}
            </div>
          </form>
        )}

        {/* ==================== FORM 2: DAFTAR BARU (REGISTER) ==================== */}
        {activeTab === 'register' && (
          <form onSubmit={handleRegisterSubmit} className="auth-form-content">
            <div className="auth-form-group">
              <label><Award size={14} /> Nama Lengkap Tokoh Kenegaraan (*):</label>
              <div className="auth-input-wrapper">
                <input
                  type="text"
                  placeholder="Contoh: Raden Satria Nusantara, S.H."
                  value={regFullName}
                  onChange={(e) => setRegFullName(e.target.value)}
                  required
                  className="auth-input"
                  autoFocus
                />
              </div>
            </div>

            <div className="auth-form-group">
              <label><Mail size={14} /> Alamat Email Resmi (*):</label>
              <div className="auth-input-wrapper">
                <input
                  type="email"
                  placeholder="contoh: nama.anda@gmail.com"
                  value={regEmail}
                  onChange={(e) => setRegEmail(e.target.value)}
                  required
                  className="auth-input"
                />
              </div>
              <span className="input-hint">Hak otoritas akun Anda akan dicatat dan dihubungkan permanen ke email ini.</span>
            </div>

            <div className="auth-form-group">
              <label><User size={14} /> Username (Opsional):</label>
              <div className="auth-input-wrapper">
                <input
                  type="text"
                  placeholder="nama_pengguna (opsional, default: nama depan)"
                  value={regUsername}
                  onChange={(e) => setRegUsername(e.target.value)}
                  className="auth-input"
                />
              </div>
            </div>

            <div className="auth-form-row-2">
              <div className="auth-form-group">
                <label><Lock size={14} /> Kata Sandi (*):</label>
                <div className="auth-input-wrapper" style={{ position: 'relative' }}>
                  <input
                    type={showRegPassword ? 'text' : 'password'}
                    placeholder="Minimal 6 karakter"
                    value={regPassword}
                    onChange={(e) => setRegPassword(e.target.value)}
                    required
                    className="auth-input"
                  />
                  <button
                    type="button"
                    onClick={() => setShowRegPassword(!showRegPassword)}
                    className="auth-toggle-pwd"
                    tabIndex={-1}
                  >
                    {showRegPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>
              </div>

              <div className="auth-form-group">
                <label><Lock size={14} /> Ulangi Kata Sandi (*):</label>
                <div className="auth-input-wrapper" style={{ position: 'relative' }}>
                  <input
                    type={showRegConfirmPassword ? 'text' : 'password'}
                    placeholder="Ketik ulang kata sandi"
                    value={regConfirmPassword}
                    onChange={(e) => setRegConfirmPassword(e.target.value)}
                    required
                    className="auth-input"
                  />
                  <button
                    type="button"
                    onClick={() => setShowRegConfirmPassword(!showRegConfirmPassword)}
                    className="auth-toggle-pwd"
                    tabIndex={-1}
                  >
                    {showRegConfirmPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>
              </div>
            </div>

            <button
              type="submit"
              className="btn-gold auth-submit-btn"
              disabled={isVerifying}
              style={{ width: '100%', marginTop: '8px' }}
            >
              <CheckCircle2 size={18} />
              <span>{isVerifying ? 'Mendaftarkan ke Database...' : 'Daftarkan Akun & Dapatkan Kewarganegaraan'}</span>
            </button>
          </form>
        )}

        {/* Package Welcome Banner */}
        <div className="auth-perk-grant-notice" style={{ marginTop: '16px' }}>
          <Sparkles size={16} color="#34d399" />
          <span>
            Otoritas akun (<strong>Super Admin</strong>, <strong>Moderator</strong>, atau <strong>Player</strong>) ditentukan secara otomatis oleh <strong>Basis Data Resmi</strong> berdasarkan email yang terdaftar.
          </span>
        </div>

        {/* Teaser tags */}
        <div className="auth-features-teaser">
          <div className="teaser-pill">🔒 Verifikasi Database MySQL</div>
          <div className="teaser-pill">⚡ Role Sesuai Email Terdaftar</div>
          <div className="teaser-pill">🏛️ Parlemen</div>
          <div className="teaser-pill">🗺️ 38 Provinsi</div>
        </div>

      </div>
    </div>
  );
}
