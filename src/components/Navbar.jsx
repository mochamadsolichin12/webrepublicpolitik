import React, { useState } from 'react';
import { useGame } from '../context/GameContext';
import { sounds } from '../utils/soundEffects';
import { navigateToPage } from '../utils/navigation';
import { 
  Map, 
  Landmark, 
  Vote, 
  Flag, 
  Briefcase, 
  Newspaper, 
  Coins, 
  Zap, 
  Volume2, 
  VolumeX, 
  RotateCcw,
  ShieldCheck,
  TrendingUp,
  Award,
  LogOut,
  Database,
  Menu,
  Crown,
  User,
  Swords,
  Settings,
  Home,
  ArrowLeft,
  ShoppingBag
} from 'lucide-react';

export default function Navbar() {
  const { 
    player, 
    parties, 
    nationalState, 
    activeTab, 
    setActiveTab, 
    resetGameData,
    logout,
    toggleSidebar,
    sidebarOpen,
    userRole,
    isSuperAdmin,
    isModerator,
    switchActiveRole
  } = useGame();

  const [soundOn, setSoundOn] = useState(true);

  const playerParty = parties.find((p) => p.id === player?.partyId);

  const formatRupiah = (val) => {
    if (!val || val === 0) return '$RP 0';
    if (val >= 1e12) return `$RP ${(val / 1e12).toFixed(2)} Triliun`;
    if (val >= 1e9) return `$RP ${(val / 1e9).toFixed(2)} Miliar`;
    if (val >= 1e6) return `$RP ${(val / 1e6).toFixed(1)} Juta`;
    return `$RP ${Number(val).toLocaleString('id-ID')}`;
  };

  const toggleSound = () => {
    const newState = sounds.toggle();
    setSoundOn(newState);
    if (newState) sounds.playClick();
  };

  const navItems = [
    { id: 'home', label: 'Beranda', icon: Home, badge: 'Utama' },
    { id: 'map', label: 'Peta Nusantara', icon: Map, badge: null },
    { id: 'wars', label: 'Perang & Militer', icon: Swords, badge: 'Tempur' },
    { id: 'parliament', label: 'Parlemen', icon: Landmark, badge: 'Sidang' },
    { id: 'elections', label: 'Pemilu & Pilpres', icon: Vote, badge: 'Aktif' },
    { id: 'parties', label: 'Partai Politik', icon: Flag, badge: null },
    { id: 'career', label: 'Karir & Markas', icon: Briefcase, badge: `Lv.${player?.level || 1}` },
    { id: 'shop', label: 'Toko & Logistik', icon: ShoppingBag, badge: 'Toko' },
    { id: 'media', label: 'Koran Nasional', icon: Newspaper, badge: null },
    { id: 'budget', label: 'Kas Negara & APBN', icon: Coins, badge: null },
    { id: 'database', label: 'Database SQL', icon: Database, badge: 'MySQL' },
  ];

  return (
    <header className="navbar-container">
      {/* Top Geopolitical Marquee / Breaking News */}
      <div className="ticker-banner">
        <div className="ticker-label">
          <span className="live-dot"></span> BREAKING NEWS:
        </div>
        <div className="ticker-scroll">
          <span>{nationalState.breakingTicker}</span>
        </div>
        <div className="ticker-countdown">
          <span>Pemilu Parlemen Berikutnya: <strong>{nationalState.nextElectionSeconds}s</strong></span>
        </div>
      </div>

      {/* Main Command Bar */}
      <div className="main-command-bar">
        {/* State Seal & Title */}
        <div className="brand-section">
          <button 
            className={`sidebar-hamburger-btn ${sidebarOpen ? 'active' : ''}`}
            onClick={() => { sounds.playClick(); toggleSidebar(); }}
            title={sidebarOpen ? "Perkecil Panel Sidebar" : "Buka Panel Sidebar"}
          >
            <Menu size={18} />
            <span className="shb-label">Panel</span>
          </button>

          {/* Quick Back & Home Button */}
          {activeTab !== 'home' && (
            <button
              className="nav-home-return-btn"
              onClick={() => {
                sounds.playClick();
                navigateToPage('home', setActiveTab);
              }}
              title="Kembali ke Beranda Utama"
            >
              <ArrowLeft size={15} />
              <Home size={15} />
              <span className="nhr-text">Beranda</span>
            </button>
          )}

          <img 
            src="/emblem.jpg" 
            alt="Lambang Republik Nusantara" 
            className="brand-logo"
            onClick={() => { sounds.playClick(); navigateToPage('home', setActiveTab); }}
            style={{ cursor: 'pointer' }}
            title="Klik Lambang untuk Kembali ke Beranda Republik"
          />
          <div 
            className="brand-info"
            onClick={() => { sounds.playClick(); navigateToPage('home', setActiveTab); }}
            style={{ cursor: 'pointer' }}
            title="Klik untuk Kembali ke Beranda"
          >
            <h1 className="brand-title">REPUBLIC POLITIC</h1>
            <div className="brand-sub">
              <span className="brand-status">Pemerintahan Berdaulat</span>
              <span className="dot-divider">•</span>
              <span className="brand-regime">Demokrasi Presidensial</span>
            </div>
          </div>
        </div>

        {/* Player State Status Pills */}
        <div className="player-stats-bar">
          {/* Energy Pill */}
          <div className="stat-pill" title="Stamina/Energi: Pulih +1 setiap 2.5 detik">
            <div className="stat-icon energy-icon">
              <Zap size={16} />
            </div>
            <div className="stat-data">
              <div className="stat-header">
                <span className="stat-name">ENERGI</span>
                <span className="stat-value">{player?.energy ?? 100}/{player?.maxEnergy ?? 100}</span>
              </div>
              <div className="progress-track">
                <div 
                  className="progress-fill energy-fill" 
                  style={{ width: `${((player?.energy ?? 100) / (player?.maxEnergy ?? 100)) * 100}%` }}
                />
              </div>
            </div>
          </div>

          {/* Money Pill */}
          <div className="stat-pill" title="Saldo Rekening Pribadi / Dana Taktis Politik">
            <div className="stat-icon money-icon">
              <Coins size={16} />
            </div>
            <div className="stat-data">
              <span className="stat-name">KAS PRIBADI</span>
              <span className="stat-value font-highlight">{formatRupiah(player?.money || 0)}</span>
            </div>
          </div>

          {/* Gold Reserve Pill */}
          <div className="stat-pill" title="Cadangan Emas Murni untuk Diplomasi Tingkat Tinggi">
            <div className="stat-icon gold-icon">
              <Award size={16} />
            </div>
            <div className="stat-data">
              <span className="stat-name">BATANGAN EMAS</span>
              <span className="stat-value gold-text">{player?.gold ?? 0} Gold</span>
            </div>
          </div>

          {/* Player Role & Account Badge Pill */}
          <div className="stat-pill role-pill-nav" title={`Akun Aktif: ${player?.fullName || player?.username || 'Warga'} (${userRole.toUpperCase()})`}>
            <div className={`role-dot-icon ${userRole}`}>
              {userRole === 'superadmin' ? <Crown size={15} /> : userRole === 'moderator' ? <ShieldCheck size={15} /> : <Award size={15} />}
            </div>
            <div className="stat-data">
              <span className="stat-name">AKUN RESMI</span>
              <span className={`role-badge-text role-${userRole}`}>
                {userRole === 'superadmin' ? '👑 Super Admin' : userRole === 'moderator' ? '🛡️ Moderator' : '👤 Player Warga'}
              </span>
            </div>
          </div>
        </div>

        {/* Quick Utilities: Sound, Reset & Logout */}
        <div className="util-actions">
          <button 
            className={`icon-btn ${activeTab === 'profile' ? 'active-profile-btn' : ''}`}
            onClick={() => { sounds.playClick(); navigateToPage('profile', setActiveTab); }}
            title={`Profil ${player?.fullName || player?.username || 'Warga'} (KTP & Status)`}
          >
            <User size={18} />
          </button>
          <button 
            className={`icon-btn ${activeTab === 'settings' ? 'active-profile-btn' : ''}`}
            onClick={() => { sounds.playClick(); navigateToPage('settings', setActiveTab); }}
            title="Pengaturan & Konfigurasi Sistem"
          >
            <Settings size={18} />
          </button>
          <button 
            className="icon-btn" 
            onClick={toggleSound} 
            title={soundOn ? 'Matikan Efek Suara' : 'Nyalakan Efek Suara'}
          >
            {soundOn ? <Volume2 size={18} /> : <VolumeX size={18} color="#ef4444" />}
          </button>
          <button 
            className="icon-btn" 
            onClick={resetGameData} 
            title="Reset Data Game ke Awal"
          >
            <RotateCcw size={17} />
          </button>
          <button
            className="icon-btn logout-btn"
            onClick={logout}
            title="Keluar dari Akun (Logout)"
          >
            <LogOut size={16} color="#ef4444" />
          </button>
        </div>
      </div>

      {/* Primary Navigation Tabs (Desktop & Tablet) */}
      <nav className="nav-tabs-wrapper desktop-only-nav">
        <div className="nav-tabs">
          {navItems.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                className={`nav-tab-btn ${isActive ? 'active' : ''}`}
                onClick={() => {
                  sounds.playClick();
                  navigateToPage(tab.id, setActiveTab);
                }}
              >
                <Icon size={17} className="tab-icon" />
                <span>{tab.label}</span>
                {tab.badge && (
                  <span className={`tab-tag ${isActive ? 'tag-active' : ''}`}>
                    {tab.badge}
                  </span>
                )}
              </button>
            );
          })}
        </div>
      </nav>

      {/* Mobile Bottom App Bar (Sticky for Smartphone Browsers) */}
      <nav className="mobile-bottom-app-bar">
        <button
          className={`mobile-bar-btn ${activeTab === 'home' ? 'active' : ''}`}
          onClick={() => { sounds.playClick(); navigateToPage('home', setActiveTab); }}
        >
          <Home size={19} />
          <span>Beranda</span>
        </button>

        <button
          className={`mobile-bar-btn ${activeTab === 'map' ? 'active' : ''}`}
          onClick={() => { sounds.playClick(); navigateToPage('map', setActiveTab); }}
        >
          <Map size={19} />
          <span>Peta</span>
        </button>

        <button
          className={`mobile-bar-btn ${activeTab === 'parliament' ? 'active' : ''}`}
          onClick={() => { sounds.playClick(); navigateToPage('parliament', setActiveTab); }}
        >
          <Landmark size={19} />
          <span>Parlemen</span>
          <span className="mobile-badge-dot" />
        </button>

        <button
          className={`mobile-bar-btn ${activeTab === 'elections' ? 'active' : ''}`}
          onClick={() => { sounds.playClick(); navigateToPage('elections', setActiveTab); }}
        >
          <Vote size={19} />
          <span>Pemilu</span>
        </button>

        <button
          className={`mobile-bar-btn ${activeTab === 'parties' ? 'active' : ''}`}
          onClick={() => { sounds.playClick(); navigateToPage('parties', setActiveTab); }}
        >
          <Flag size={19} />
          <span>Partai</span>
        </button>

        <button
          className={`mobile-bar-btn ${activeTab === 'career' ? 'active' : ''}`}
          onClick={() => { sounds.playClick(); navigateToPage('career', setActiveTab); }}
        >
          <Briefcase size={19} />
          <span>Karir</span>
        </button>

        <button
          className={`mobile-bar-btn ${activeTab === 'budget' ? 'active' : ''}`}
          onClick={() => {
            sounds.playClick();
            navigateToPage('budget', setActiveTab);
          }}
        >
          <Coins size={19} />
          <span>APBN</span>
        </button>
      </nav>
    </header>
  );
}
