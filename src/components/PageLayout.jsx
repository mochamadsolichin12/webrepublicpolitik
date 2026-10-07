import React from 'react';
import { GameProvider, useGame } from '../context/GameContext';
import Navbar from './Navbar';
import Sidebar from './Sidebar';
import AuthModal from './AuthModal';
import { CheckCircle2, AlertCircle, RotateCcw } from 'lucide-react';
import '../App.css';

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error('Page Caught Error:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="auth-portal-overlay">
          <div className="auth-portal-card glass-panel-gold" style={{ textAlign: 'center' }}>
            <AlertCircle size={44} color="#ef4444" style={{ margin: '0 auto 12px auto' }} />
            <h2 style={{ color: '#f8fafc', marginBottom: '8px' }}>Terjadi Penyesuaian Sistem</h2>
            <p style={{ color: '#94a3b8', fontSize: '0.85rem', marginBottom: '12px' }}>
              Data tampilan sedang diperbarui atau terdapat ketidaksesuaian data.
            </p>
            {this.state.error && (
              <pre style={{ color: '#ef4444', backgroundColor: 'rgba(0,0,0,0.4)', padding: '8px', borderRadius: '6px', fontSize: '0.75rem', marginBottom: '16px', textAlign: 'left', overflowX: 'auto', maxHeight: '120px' }}>
                {this.state.error.toString()}
              </pre>
            )}
            <div style={{ display: 'flex', gap: '10px', justifyContent: 'center' }}>
              <button 
                className="btn-gold" 
                onClick={() => window.location.reload()}
              >
                <RotateCcw size={16} /> Segarkan Halaman
              </button>
              <button 
                className="btn-secondary" 
                onClick={() => {
                  localStorage.clear();
                  window.location.reload();
                }}
              >
                Reset Data & Mulai Ulang
              </button>
            </div>
          </div>
        </div>
      );
    }
    return this.props.children;
  }
}

function PageShell({ children, defaultTab }) {
  const { notification, currentUser, isSuperAdmin, isModerator } = useGame();

  // 1. Guard Wajib Login: Jika belum login, tampilkan portal login modal penuh
  if (!currentUser) {
    return (
      <div className="game-root-container">
        {notification && (
          <div className={`floating-toast toast-${notification.type}`}>
            {notification.type === 'success' ? (
              <CheckCircle2 size={18} className="toast-icon font-emerald" />
            ) : (
              <AlertCircle size={18} className="toast-icon font-crimson" />
            )}
            <span className="toast-text">{notification.message}</span>
          </div>
        )}
        <AuthModal />
      </div>
    );
  }

  // 2. Guard Akses Otoritas Khusus (Halaman Super Admin & Moderator)
  // Jika pengguna biasa melompat ke /admin atau /moderator, lempar kembali ke Beranda atau tampilkan pesan terlarang
  if (defaultTab === 'admin' && !isSuperAdmin) {
    return (
      <div className="game-root-container">
        <div className="auth-portal-overlay">
          <div className="auth-portal-card glass-panel-gold" style={{ textAlign: 'center', maxWidth: '440px' }}>
            <AlertCircle size={48} color="#ef4444" style={{ margin: '0 auto 12px auto' }} />
            <h2 style={{ color: '#f8fafc', marginBottom: '8px' }}>Akses Terbatas: Khusus Super Admin</h2>
            <p style={{ color: '#94a3b8', fontSize: '0.9rem', marginBottom: '18px' }}>
              Akun Anda ({currentUser.fullName || currentUser.username}) memiliki role <strong>{currentUser.role?.toUpperCase()}</strong> dan tidak diizinkan mengakses panel ini.
            </p>
            <button 
              className="btn-gold" 
              style={{ width: '100%', justifyContent: 'center' }}
              onClick={() => { window.location.href = '/'; }}
            >
              Kembali ke Beranda
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (defaultTab === 'moderator' && !isModerator) {
    return (
      <div className="game-root-container">
        <div className="auth-portal-overlay">
          <div className="auth-portal-card glass-panel-gold" style={{ textAlign: 'center', maxWidth: '440px' }}>
            <AlertCircle size={48} color="#a855f7" style={{ margin: '0 auto 12px auto' }} />
            <h2 style={{ color: '#f8fafc', marginBottom: '8px' }}>Akses Terbatas: Khusus Moderator</h2>
            <p style={{ color: '#94a3b8', fontSize: '0.9rem', marginBottom: '18px' }}>
              Halaman ini diperuntukkan bagi Dewan Kehormatan dan Moderator Negara.
            </p>
            <button 
              className="btn-gold" 
              style={{ width: '100%', justifyContent: 'center' }}
              onClick={() => { window.location.href = '/'; }}
            >
              Kembali ke Beranda
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="game-root-container">
      {/* Top Navigation */}
      <Navbar />

      {/* Global Toast */}
      {notification && (
        <div className={`floating-toast toast-${notification.type}`}>
          {notification.type === 'success' ? (
            <CheckCircle2 size={18} className="toast-icon font-emerald" />
          ) : (
            <AlertCircle size={18} className="toast-icon font-crimson" />
          )}
          <span className="toast-text">{notification.message}</span>
        </div>
      )}

      {/* Main Layout */}
      <div className="game-body-layout">
        <Sidebar />
        <main className="main-content-viewport">
          {children}
        </main>
      </div>

      {/* Statecraft Footer */}
      <footer className="game-footer">
        <div className="footer-inner">
          <div className="footer-motto">
            <span className="motto-tag">REPUBLIC POLITIC</span>
            <span className="dot">•</span>
            <span>Kedaulatan Berada di Tangan Rakyat • Bhinneka Tunggal Ika</span>
          </div>
          <div className="footer-credits">
            <span>Geopolitical Statecraft Simulator v1.0 • Halaman Terpisah Mandiri</span>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default function PageLayout({ children, defaultTab }) {
  return (
    <ErrorBoundary>
      <GameProvider defaultTab={defaultTab}>
        <PageShell defaultTab={defaultTab}>
          {children}
        </PageShell>
      </GameProvider>
    </ErrorBoundary>
  );
}
