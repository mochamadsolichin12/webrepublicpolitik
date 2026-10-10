import React, { lazy, Suspense } from 'react';
import { GameProvider, useGame } from './context/GameContext';
import Navbar from './components/Navbar';
import Sidebar from './components/Sidebar';
import ViewLoader from './components/ViewLoader';
import { CheckCircle2, AlertCircle, RotateCcw } from 'lucide-react';
import './App.css';

// ==================== CODE-SPLIT LAZY LOADED VIEWS ====================
// Modul-modul dipisahkan menjadi chunk mandiri agar akses awal sangat ringan & cepat
const HomeDashboardView = lazy(() => import('./components/HomeDashboardView'));
const IndonesiaMap = lazy(() => import('./components/IndonesiaMap'));
const ParliamentView = lazy(() => import('./components/ParliamentView'));
const ElectionsView = lazy(() => import('./components/ElectionsView'));
const PartiesView = lazy(() => import('./components/PartiesView'));
const CareerHQView = lazy(() => import('./components/CareerHQView'));
const NewspaperView = lazy(() => import('./components/NewspaperView'));
const BudgetView = lazy(() => import('./components/BudgetView'));
const DatabaseStudioView = lazy(() => import('./components/DatabaseStudioView'));
const SuperAdminPanel = lazy(() => import('./components/SuperAdminPanel'));
const ModeratorPanel = lazy(() => import('./components/ModeratorPanel'));
const PlayerProfileView = lazy(() => import('./components/PlayerProfileView'));
const MilitaryWarsView = lazy(() => import('./components/MilitaryWarsView'));
const LegislationView = lazy(() => import('./components/LegislationView'));
const RealisticEconomyView = lazy(() => import('./components/RealisticEconomyView'));
const JobsWorkView = lazy(() => import('./components/JobsWorkView'));
const SettingsView = lazy(() => import('./components/SettingsView'));
const ShopView = lazy(() => import('./components/ShopView'));
const GrandMarketView = lazy(() => import('./components/GrandMarketView'));
import AuthModal from './components/AuthModal';

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error('App Caught Error:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="auth-portal-overlay">
          <div className="auth-portal-card glass-panel-gold" style={{ textAlign: 'center' }}>
            <AlertCircle size={44} color="#ef4444" style={{ margin: '0 auto 12px auto' }} />
            <h2 style={{ color: '#f8fafc', marginBottom: '8px' }}>Terjadi Penyesuaian Sistem</h2>
            <p style={{ color: '#94a3b8', fontSize: '0.85rem', marginBottom: '12px' }}>
              Data tampilan sedang diperbarui ke format terbaru. Klik tombol di bawah untuk menyegarkan tampilan.
            </p>
            {this.state.error && (
              <pre style={{ color: '#ef4444', backgroundColor: 'rgba(0,0,0,0.5)', padding: '10px', borderRadius: '6px', fontSize: '0.78rem', marginBottom: '16px', textAlign: 'left', overflowX: 'auto', maxHeight: '140px', border: '1px solid rgba(239,68,68,0.3)' }}>
                {this.state.error?.stack || this.state.error?.toString()}
              </pre>
            )}
            <div style={{ display: 'flex', gap: '10px', justifyContent: 'center' }}>
              <button 
                className="btn-gold" 
                onClick={() => {
                  window.location.reload();
                }}
              >
                <RotateCcw size={16} /> Segarkan Tampilan
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

function MainApp() {
  const { activeTab, notification, currentUser } = useGame();

  // If user is not logged in, enforce the authentication portal (lazy loaded)
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

  return (
    <div className="game-root-container">
      {/* Top Navigation & Status */}
      <Navbar />

      {/* Floating Global Toast Notification */}
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

      {/* Main Game Layout with Categorized Sidebar */}
      <div className="game-body-layout">
        <Sidebar />
        <main className="main-content-viewport">
          <Suspense fallback={<ViewLoader tab={activeTab} />}>
            {(activeTab === 'home' || !activeTab) && <HomeDashboardView />}
            {activeTab === 'map' && <IndonesiaMap />}
            {activeTab === 'parliament' && <ParliamentView />}
            {activeTab === 'elections' && <ElectionsView />}
            {activeTab === 'parties' && <PartiesView />}
            {activeTab === 'career' && <CareerHQView />}
            {activeTab === 'media' && <NewspaperView />}
            {activeTab === 'budget' && <BudgetView />}
            {activeTab === 'database' && <DatabaseStudioView />}
            {activeTab === 'admin' && <SuperAdminPanel />}
            {activeTab === 'moderator' && <ModeratorPanel />}
            {activeTab === 'profile' && <PlayerProfileView />}
            {activeTab === 'wars' && <MilitaryWarsView />}
            {activeTab === 'legislation' && <LegislationView />}
            {activeTab === 'economy' && <RealisticEconomyView />}
            {activeTab === 'jobs' && <JobsWorkView />}
            {activeTab === 'settings' && <SettingsView />}
            {activeTab === 'shop' && <ShopView initialSubPage="perbekalan" />}
            {activeTab === 'grand-market' && <GrandMarketView />}
            {activeTab === 'market-resources' && <ShopView initialSubPage="komoditas_beli" />}
            {activeTab === 'market-military' && <ShopView initialSubPage="militer" />}
          </Suspense>
        </main>
      </div>

      {/* Subtle Statecraft Footer */}
      <footer className="game-footer">
        <div className="footer-inner">
          <div className="footer-motto">
            <span className="motto-tag">REPUBLIC POLITIC</span>
            <span className="dot">•</span>
            <span>Kedaulatan Berada di Tangan Rakyat • Bhinneka Tunggal Ika</span>
          </div>
          <div className="footer-credits">
            <span>Geopolitical Statecraft Simulator v1.0 • Terinspirasi dari Rival Regions</span>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default function App() {
  return (
    <ErrorBoundary>
      <GameProvider>
        <MainApp />
      </GameProvider>
    </ErrorBoundary>
  );
}
