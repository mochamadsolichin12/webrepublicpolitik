import React, { useState, useEffect } from 'react';
import { useGame } from '../context/GameContext';
import { sounds } from '../utils/soundEffects';
import { navigateToPage } from '../utils/navigation';
import { 
  Globe, 
  Map, 
  Landmark, 
  Vote, 
  Coins, 
  Flag, 
  Briefcase, 
  Newspaper, 
  Database, 
  ChevronLeft, 
  ChevronRight, 
  ChevronDown, 
  MapPin, 
  Sparkles, 
  ShieldCheck, 
  Award, 
  Menu, 
  Layers, 
  Compass, 
  Building2, 
  X,
  Crown,
  ShieldAlert,
  User,
  Swords,
  Scale,
  TrendingUp,
  Pickaxe,
  Settings,
  FileText,
  ShoppingBag,
  Boxes
} from 'lucide-react';

// Definition of all categories & items in the sidebar
const SIDEBAR_CATEGORIES = [
  {
    id: 'geopolitics',
    title: 'GEOPOLITIK & WILAYAH',
    icon: Globe,
    color: '#38bdf8',
    items: [
      {
        id: 'home',
        label: 'Beranda Republik',
        subtitle: 'Status Wilayah, Chat & Perang',
        icon: Compass,
        badge: 'Utama',
        badgeClass: 'badge-gold',
      },
      {
        id: 'map',
        label: 'Peta Dunia & NKRI',
        subtitle: '38 Provinsi & 177 Negara',
        icon: Globe,
        badge: 'Rival Regions',
        badgeClass: 'badge-cyan',
      },
      {
        id: 'wars',
        label: 'Perang & Wilayah',
        subtitle: 'Front Tempur & Sengketa',
        icon: Swords,
        badge: 'Tempur',
        badgeClass: 'badge-crimson',
      },
    ],
  },
  {
    id: 'governance',
    title: 'LEGISLATIF & KENEGARAAN',
    icon: Landmark,
    color: '#fbbf24',
    items: [
      {
        id: 'parliament',
        label: 'Parlemen',
        subtitle: 'Sidang Paripurna & RUU',
        icon: Landmark,
        badge: 'Sidang',
        badgeClass: 'badge-gold',
      },
      {
        id: 'legislation',
        label: 'Pengajuan Hukum',
        subtitle: 'Naskah Akademik & RUU',
        icon: Scale,
        badge: 'Legislasi',
        badgeClass: 'badge-gold',
      },
      {
        id: 'elections',
        label: 'Pemilu & Pilpres',
        subtitle: 'Pemilihan Presiden & Wapres',
        icon: Vote,
        badge: 'Aktif',
        badgeClass: 'badge-emerald',
      },
      {
        id: 'budget',
        label: 'Kas Negara & APBN',
        subtitle: 'Alokasi Dana & Perbendaharaan',
        icon: Coins,
        badge: 'Triliun',
        badgeClass: 'badge-gold',
      },
      {
        id: 'economy',
        label: 'Bursa & Ekonomi',
        subtitle: 'Komoditas, Kurs & Hilirisasi',
        icon: TrendingUp,
        badge: 'Bursa',
        badgeClass: 'badge-cyan',
      },
    ],
  },
  {
    id: 'politics',
    title: 'POLITIK & PERGERAKAN',
    icon: Flag,
    color: '#ec4899',
    items: [
      {
        id: 'profile',
        label: 'Profil Warga & KTP',
        subtitle: 'KTP-el & Identitas Politik',
        icon: User,
        badge: 'E-KTP',
        badgeClass: 'badge-gold',
      },
      {
        id: 'parties',
        label: 'Partai Politik',
        subtitle: 'Fraksi DPR & Koalisi',
        icon: Flag,
        badge: null,
        badgeClass: 'badge-purple',
      },
      {
        id: 'career',
        label: 'Karir & Markas',
        subtitle: 'Skill, Latihan & Jabatan',
        icon: Briefcase,
        badge: null,
        badgeClass: 'badge-blue',
      },
      {
        id: 'jobs',
        label: 'Bursa Kerja & Dinas',
        subtitle: 'Shift Kerja & Gaji Sektor Riil',
        icon: Pickaxe,
        badge: 'Kerja',
        badgeClass: 'badge-emerald',
      },
      {
        id: 'media',
        label: 'Koran & Media Pers',
        subtitle: 'Jurnalisme & Opini Publik',
        icon: Newspaper,
        badge: 'Pers',
        badgeClass: 'badge-cyan',
      },
    ],
  },
  {
    id: 'marketplace',
    title: 'PASAR & PERBEKALAN',
    icon: ShoppingBag,
    color: '#f59e0b',
    items: [
      {
        id: 'shop',
        label: 'Pasar & Bursa Nasional',
        subtitle: 'SDA, Senjata & Pasar Lokal',
        icon: ShoppingBag,
        badge: 'P2P',
        badgeClass: 'badge-gold',
      },
      {
        id: 'grand-market',
        label: 'Pasar Agung Kerajaan',
        subtitle: 'Premium, Emas & Langganan',
        icon: Crown,
        badge: 'VIP',
        badgeClass: 'badge-purple',
      },
    ],
  },
  {
    id: 'system',
    title: 'SISTEM & BASIS DATA',
    icon: Database,
    color: '#10b981',
    items: [
      {
        id: 'database',
        label: 'Database SQL Studio',
        subtitle: '14 Tabel Relasional & Query',
        icon: Database,
        badge: 'MySQL',
        badgeClass: 'badge-emerald',
      },
      {
        id: 'settings',
        label: 'Pengaturan Sistem',
        subtitle: 'Audio, Tema & Cadangan',
        icon: Settings,
        badge: 'Setting',
        badgeClass: 'badge-gold',
      },
    ],
  },
  {
    id: 'authority',
    title: 'OTORITAS & PANEL KENDALI',
    icon: Crown,
    color: '#ef4444',
    items: [
      {
        id: 'admin',
        label: 'Panel Super Admin',
        subtitle: 'Komando & Otoritas Penuh',
        icon: Crown,
        badge: 'SUPER',
        badgeClass: 'badge-gold',
      },
      {
        id: 'admin-progress',
        label: 'Progres Proyek (MD)',
        subtitle: 'Log Fitur & Roadmap',
        icon: FileText,
        badge: 'ROADMAP',
        badgeClass: 'badge-emerald',
      },
      {
        id: 'moderator',
        label: 'Panel Moderator',
        subtitle: 'Veto RUU & Ketertiban',
        icon: ShieldCheck,
        badge: 'MOD',
        badgeClass: 'badge-purple',
      },
    ],
  },
];

export default function Sidebar() {
  const { 
    activeTab, 
    setActiveTab, 
    sidebarOpen, 
    toggleSidebar, 
    setSidebarOpen, 
    player, 
    parties, 
    regions,
    setSelectedRegionId,
    selectedRegionId,
    userRole,
    isSuperAdmin,
    isModerator,
    switchActiveRole
  } = useGame();

  // Inisialisasi: Semua kategori tertutup secara default (hanya terbuka jika kategori memuat tab aktif atau jika diklik)
  const [collapsedCategories, setCollapsedCategories] = useState(() => {
    // Cari kategori yang memuat tab aktif saat ini agar tab aktif tetap terlihat
    const activeCat = SIDEBAR_CATEGORIES.find((cat) =>
      cat.items.some((item) => item.id === activeTab)
    );

    const initial = {
      geopolitics: true,
      governance: true,
      politics: true,
      marketplace: true,
      system: true,
      authority: true,
    };

    // Buka hanya kategori dari tab yang sedang aktif
    if (activeCat && activeCat.id) {
      initial[activeCat.id] = false;
    }

    return initial;
  });

  const toggleCategory = (catId) => {
    sounds.playClick();
    setCollapsedCategories((prev) => {
      const isCurrentlyOpen = !prev[catId];
      // Jika saat ini terbuka, klik akan menutupnya (semua tertutup)
      if (isCurrentlyOpen) {
        return {
          geopolitics: true,
          governance: true,
          politics: true,
          marketplace: true,
          system: true,
          authority: true,
          [catId]: true,
        };
      }
      // Jika saat ini tertutup, tutup SEMUA kategori lain dan hanya buka kategori yang diklik
      return {
        geopolitics: true,
        governance: true,
        politics: true,
        marketplace: true,
        system: true,
        authority: true,
        [catId]: false, // Hanya buka panel ini
      };
    });
  };

  const playerParty = parties.find((p) => p.id === player?.partyId);
  const playerRegionId = player?.currentRegionId || player?.residenceRegionId || 'dki';
  const playerRegion = regions.find((r) => r.id === playerRegionId) || regions[0];

  const handleSelectTab = (tabId) => {
    sounds.playClick();
    if (window.innerWidth < 1024) {
      setSidebarOpen(false);
    }
    navigateToPage(tabId, setActiveTab);
  };

  const handleFocusSpawn = (e) => {
    e.stopPropagation();
    sounds.playClick();
    setSelectedRegionId(playerRegion.id);
    navigateToPage('map', setActiveTab);
  };

  return (
    <>
      {/* Mobile Backdrop Overlay */}
      {sidebarOpen && (
        <div 
          className="sidebar-backdrop-mobile"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      <aside className={`statecraft-sidebar glass-panel ${sidebarOpen ? 'open' : 'collapsed'}`}>
        {/* Sidebar Header */}
        <div className="sidebar-header">
          <div className="sb-header-title">
            <Layers size={18} className="font-gold" />
            {sidebarOpen && <span>PANEL KENEGARAAN</span>}
          </div>
          <button 
            className="sb-toggle-btn"
            onClick={() => { sounds.playClick(); setSidebarOpen(false); }}
            title="Tutup Panel Sidebar"
          >
            <X size={16} />
          </button>
        </div>

        {/* Sidebar Scrollable Body */}
        <div className="sidebar-content-scroll">
          {SIDEBAR_CATEGORIES.filter((category) => {
            if (category.id === 'system') {
              return isSuperAdmin;
            }
            if (category.id === 'authority') {
              return isSuperAdmin || isModerator;
            }
            return true;
          }).map((category) => {
            const CatIcon = category.icon;
            const isCatCollapsed = collapsedCategories[category.id];

            // Filter specific authority items based on role
            const visibleItems = category.items.filter((item) => {
              if (item.id === 'admin') return isSuperAdmin;
              if (item.id === 'moderator') return isModerator;
              return true;
            });

            if (visibleItems.length === 0) return null;

            return (
              <div key={category.id} className="sidebar-category-group">
                {/* Category Header */}
                <div 
                  className="sidebar-category-header"
                  onClick={() => {
                    if (!sidebarOpen) {
                      setSidebarOpen(true);
                    }
                    toggleCategory(category.id);
                  }}
                  title={category.title}
                >
                  <div className="cat-title-left">
                    <CatIcon size={14} style={{ color: category.color }} />
                    {sidebarOpen && <span className="cat-label">{category.title}</span>}
                  </div>
                  {sidebarOpen && (
                    <ChevronDown 
                      size={14} 
                      className={`cat-arrow ${isCatCollapsed ? 'rotated' : ''}`}
                    />
                  )}
                </div>

                {/* Category Items */}
                {!isCatCollapsed && (
                  <div className="sidebar-items-list">
                    {visibleItems.map((item) => {
                      const ItemIcon = item.icon;
                      const isActive = activeTab === item.id;

                      return (
                        <button
                          key={item.id}
                          className={`sidebar-nav-item ${isActive ? 'active' : ''}`}
                          onClick={() => handleSelectTab(item.id)}
                          title={`${item.label} - ${item.subtitle}`}
                        >
                          <div className="sni-left">
                            <div className="sni-icon-wrap">
                              <ItemIcon size={17} />
                            </div>
                            {sidebarOpen && (
                              <div className="sni-text">
                                <span className="sni-title">{item.label}</span>
                                <span className="sni-subtitle">{item.subtitle}</span>
                              </div>
                            )}
                          </div>
                          {sidebarOpen && item.badge && (
                            <span className={`sni-badge ${item.badgeClass}`}>
                              {item.badge}
                            </span>
                          )}
                        </button>
                      );
                    })}
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Sidebar Footer: Player Quick Info & Spawn Region */}
        <div className="sidebar-footer">
          {sidebarOpen ? (
            <div className="sb-player-card glass-panel" onClick={() => handleSelectTab('profile')} title="Buka Halaman Profil Player & KTP">
              <div className="sb-player-top">
                <div 
                  className="sb-avatar-dot" 
                  style={{ backgroundColor: playerParty ? playerParty.color : '#fbbf24' }}
                >
                  {player?.level || 1}
                </div>
                <div className="sb-player-details">
                  <div className="sb-name-role-row">
                    <strong className="sb-player-name">{player?.fullName || player?.username || 'Warga'}</strong>
                    <span className={`sb-role-tag role-${userRole}`}>
                      {userRole === 'superadmin' ? 'SUPER' : userRole === 'moderator' ? 'MOD' : 'PLAYER'}
                    </span>
                  </div>
                  <span className="sb-player-role">{player?.position || player?.title || 'Warga Berdaulat'}</span>
                </div>
              </div>

              {/* Player Spawn Region Button */}
              <div className="sb-spawn-row" onClick={handleFocusSpawn} title="Klik untuk terbang ke wilayah domisili Anda di peta">
                <MapPin size={13} className="font-emerald" />
                <span className="sb-spawn-label">Domisili / Spawn:</span>
                <strong className="sb-spawn-val font-emerald">{playerRegion?.name || 'DKI Jakarta'}</strong>
              </div>
            </div>
          ) : (
            <div 
              className="sb-player-card-mini" 
              onClick={() => handleSelectTab('profile')}
              title={`Profil ${player?.fullName || player?.username || 'Warga'} (Level ${player?.level || 1}) - Klik untuk buka profil`}
            >
              <div 
                className="sb-avatar-dot" 
                style={{ backgroundColor: playerParty ? playerParty.color : '#fbbf24' }}
              >
                {player?.level || 1}
              </div>
            </div>
          )}
        </div>
      </aside>
    </>
  );
}
