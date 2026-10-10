import React, { useState } from 'react';
import { useGame } from '../context/GameContext';
import { sounds } from '../utils/soundEffects';
import { SHOP_ITEMS, SHOP_CATEGORIES } from '../data/shopData';
import { MILITARY_UNITS } from '../data/militaryWarsData';
import { 
  Store,
  ShoppingBag, 
  Coins, 
  Zap, 
  Shield, 
  Award, 
  Crown, 
  Coffee, 
  HeartPulse, 
  Plane, 
  Radio, 
  Newspaper, 
  Pickaxe, 
  Building, 
  Sparkles,
  Package,
  Layers,
  ArrowRight,
  Boxes,
  Swords,
  TrendingUp,
  TrendingDown,
  Fuel,
  Sprout,
  Crosshair,
  Anchor,
  Sword,
  ShoppingCart,
  DollarSign,
  Tag,
  Plus,
  CheckCircle2,
  User,
  Clock,
  AlertCircle,
  X
} from 'lucide-react';

const ICON_MAP = {
  Coffee,
  Zap,
  HeartPulse,
  Shield,
  Plane,
  Radio,
  Newspaper,
  Pickaxe,
  Award,
  Coins,
  Crown,
  Building,
  Sword,
  Anchor,
  Crosshair,
  Fuel,
  Layers,
  Sprout,
  Boxes,
  Sparkles
};

export default function ShopView({ initialSubPage }) {
  const { 
    player, 
    playerInventory, 
    buyShopItem, 
    tradeCommodity, 
    tradeMilitaryUnit, 
    commodities,
    marketListings,
    createMarketListing,
    buyMarketListing,
    cancelMarketListing
  } = useGame();

  // 4 Halaman Navigasi Pasar Lokal:
  // 1. 'perbekalan'  -> Suplemen Energi, Medis & Aset Prestise
  // 2. 'komoditas_beli' -> Beli Sumber Daya Alam & Komoditas Nasional
  // 3. 'komoditas_jual' -> Jual Sumber Daya Alam Hasil Tambang/Industri
  // 4. 'militer'     -> Jual Beli Alutsista & Perlengkapan Tempur
  const getInitialPage = () => {
    if (initialSubPage) return initialSubPage;
    if (typeof window !== 'undefined' && window.location.hash) {
      const hash = window.location.hash.replace('#', '');
      if (['perbekalan', 'komoditas_beli', 'komoditas_jual', 'militer', 'sumberdaya', 'senjata'].includes(hash)) {
        if (hash === 'sumberdaya') return 'komoditas_beli';
        if (hash === 'senjata') return 'militer';
        return hash;
      }
    }
    return 'perbekalan';
  };

  const [activeMarketPage, setActiveMarketPage] = useState(getInitialPage);

  // Sync state if initialSubPage prop changes or hash changes
  React.useEffect(() => {
    if (initialSubPage) {
      setActiveMarketPage(initialSubPage);
    }
  }, [initialSubPage]);

  React.useEffect(() => {
    const handleHash = () => {
      const hash = window.location.hash.replace('#', '');
      if (hash === 'sumberdaya' || hash === 'komoditas_beli') {
        setActiveMarketPage('komoditas_beli');
      } else if (hash === 'senjata' || hash === 'militer') {
        setActiveMarketPage('militer');
      } else if (hash === 'perbekalan') {
        setActiveMarketPage('perbekalan');
      } else if (hash === 'komoditas_jual') {
        setActiveMarketPage('komoditas_jual');
      }
    };
    window.addEventListener('hashchange', handleHash);
    return () => window.removeEventListener('hashchange', handleHash);
  }, []);
  
  // State for Commodity Trading
  const [tradeQuantities, setTradeQuantities] = useState({});
  // State for Military Trading
  const [militaryQuantities, setMilitaryQuantities] = useState({});

  // P2P Marketplace Form & Filter State
  const [p2pFilterItem, setP2pFilterItem] = useState('all');
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [sellForm, setSellForm] = useState({
    itemId: 'oil',
    quantity: 1,
    pricePerUnit: 1250000
  });
  const [isSubmittingListing, setIsSubmittingListing] = useState(false);
  const [activeListingTab, setActiveListingTab] = useState('browse'); // 'browse' | 'my_listings'

  const [purchasingId, setPurchasingId] = useState(null);

  const formatRupiah = (val) => {
    if (!val || val === 0) return 'Rp 0';
    if (val >= 1e12) return `Rp ${(val / 1e12).toFixed(2)} Triliun`;
    if (val >= 1e9) return `Rp ${(val / 1e9).toFixed(2)} Miliar`;
    if (val >= 1e6) return `Rp ${(val / 1e6).toFixed(1)} Juta`;
    return `Rp ${Number(val).toLocaleString('id-ID')}`;
  };

  const handlePurchaseShopItem = async (item) => {
    setPurchasingId(item.id);
    buyShopItem(item);
    setTimeout(() => {
      setPurchasingId(null);
    }, 400);
  };

  const handleQtyChange = (id, delta, isMilitary = false) => {
    sounds.playClick();
    if (isMilitary) {
      setMilitaryQuantities((prev) => {
        const cur = prev[id] || 1;
        const next = Math.max(1, cur + delta);
        return { ...prev, [id]: next };
      });
    } else {
      setTradeQuantities((prev) => {
        const cur = prev[id] || 1;
        const next = Math.max(1, cur + delta);
        return { ...prev, [id]: next };
      });
    }
  };

  // Config visual untuk masing-masing tab/panel
  const PAGE_CONFIGS = {
    perbekalan: {
      badge: 'Sentra Logistik Rakyat',
      title: 'Pasar Perbekalan & Suplemen Warga',
      desc: 'Pasar konsumsi stamina harian, obat-obatan fisik, lisensi usaha pertambangan daerah, serta konversi devisa batangan emas murni berstandar BI.',
      icon: ShoppingBag,
      color: '#f59e0b',
      accentClass: 'theme-gold',
      statLabel: 'Total Menu',
      statVal: `${SHOP_ITEMS.length} Varian`,
    },
    komoditas_beli: {
      badge: 'Pasar Bebas Antar-Pemain (P2P)',
      title: 'Bursa Penawaran Komoditas Rakyat',
      desc: 'Beli langsung sumber daya alam & komoditas (Minyak Mentah, Nikel, CPO, Batubara, Emas & Beras) yang dijual oleh pemain lain. Transaksi 100% dari sesama warga tanpa campur tangan toko sistem.',
      icon: Boxes,
      color: '#38bdf8',
      accentClass: 'theme-cyan',
      statLabel: 'Penawaran Aktif',
      statVal: `${(marketListings || []).filter(l => l.status === 'active').length} Penawaran Warga`,
    },
    komoditas_jual: {
      badge: 'Bursa Lapak Pemain (P2P)',
      title: 'Pasang Penawaran Jual ke Pemain Lain',
      desc: 'Pasang hasil panen tambang, perkebunan & pabrik Anda ke bursa pasar terbuka. Tentukan harga per unit dan kuantitas Anda sendiri agar dibeli oleh pemain lain.',
      icon: DollarSign,
      color: '#10b981',
      accentClass: 'theme-emerald',
      statLabel: 'Gudang Pribadi',
      statVal: `${Object.values(playerInventory || {}).reduce((a, b) => a + (typeof b === 'number' ? b : 0), 0)} Unit Simpanan`,
    },
    militer: {
      badge: 'Industri Pertahanan Negara (DEFENSE HQ)',
      title: 'Bursa Pengadaan & Alutsista Senjata Militer',
      desc: 'Pusat logistik persenjataan angkatan bersenjata. Beli infanteri, armada lapis baja MBT, jet tempur taktis, kapal frigat, dan rudal balistik untuk dominasi perang teritorial.',
      icon: Swords,
      color: '#ef4444',
      accentClass: 'theme-crimson',
      statLabel: 'Divisi Alutsista',
      statVal: `${MILITARY_UNITS.length} Alutsista Tempur`,
    },
  };

  const currentPageCfg = PAGE_CONFIGS[activeMarketPage] || PAGE_CONFIGS.perbekalan;
  const ActivePageIcon = currentPageCfg.icon;

  return (
    <div className="shop-viewport">
      {/* 1. HERO HEADER PASAR LOKAL ULTRA PREMIUM */}
      <div className={`shop-hero-card ${currentPageCfg.accentClass}`}>
        <div className="sh-left">
          <div className="sh-badge-row">
            <div className="sh-badge">
              <Store size={15} />
              <span>{currentPageCfg.badge}</span>
            </div>
            <div className="sh-quick-pulse">
              <span className="live-pulse-dot"></span>
              <span>Bursa Buka 24/7 Realtime</span>
            </div>
          </div>
          
          <h2 className="sh-title">{currentPageCfg.title}</h2>
          <p className="sh-desc">{currentPageCfg.desc}</p>

          <div className="sh-quick-metrics">
            <div className="sqm-item">
              <span className="sqm-k">{currentPageCfg.statLabel}:</span>
              <strong className="sqm-v">{currentPageCfg.statVal}</strong>
            </div>
            <div className="sqm-item">
              <span className="sqm-k">Wilayah Pasar:</span>
              <strong className="sqm-v text-gold">Seluruh 38 Provinsi</strong>
            </div>
            <div className="sqm-item">
              <span className="sqm-k">Pajak Transaksi:</span>
              <strong className="sqm-v text-emerald">0% (Bebas Bea)</strong>
            </div>
          </div>
        </div>

        {/* Player Financial Balance Widget */}
        <div className="sh-balance-box glass-panel-premium">
          <div className="sbb-header">
            <div className="sbb-title-wrap">
              <Sparkles size={16} className="text-gold" />
              <span className="sbb-label">Brankas & Saldo Warga</span>
            </div>
            <span className="sbb-status-badge">Aktif</span>
          </div>
          <div className="sbb-stats">
            <div className="sbb-stat-item sbb-glow-money">
              <span className="sbb-item-title">Kas Tunai (Rupiah)</span>
              <strong className="text-emerald sbb-number">{formatRupiah(player?.money || 0)}</strong>
            </div>
            <div className="sbb-stat-item sbb-glow-gold">
              <span className="sbb-item-title">Cadangan Devisa Emas</span>
              <strong className="text-gold sbb-number">{player?.gold || 0} Batang Antam</strong>
            </div>
            <div className="sbb-stat-item sbb-glow-energy">
              <div className="sbb-item-title-row">
                <span className="sbb-item-title">Stamina Fisik</span>
                <span className="sbb-energy-percent">{Math.round(((player?.energy ?? 100) / (player?.maxEnergy ?? 100)) * 100)}%</span>
              </div>
              <strong className="text-cyan sbb-number">{player?.energy ?? 100} / {player?.maxEnergy ?? 100} ⚡</strong>
            </div>
          </div>
        </div>
      </div>

      {/* 2. 4 TAB UTAMA PASAR LOKAL (PREMIUM TAB BAR) */}
      <div className="market-main-tabs">
        <button
          className={`market-tab-btn btn-tab-perbekalan ${activeMarketPage === 'perbekalan' ? 'active' : ''}`}
          onClick={() => { sounds.playClick(); setActiveMarketPage('perbekalan'); }}
        >
          <div className="mtb-icon-box">
            <ShoppingBag size={18} />
          </div>
          <div className="mtb-label-col">
            <span className="mtb-title">1. Suplemen & Logistik</span>
            <span className="mtb-sub">Stamina, Kopi & Devisa Emas</span>
          </div>
        </button>

        <button
          className={`market-tab-btn btn-tab-resources ${activeMarketPage === 'komoditas_beli' ? 'active' : ''}`}
          onClick={() => { sounds.playClick(); setActiveMarketPage('komoditas_beli'); }}
        >
          <div className="mtb-icon-box">
            <Boxes size={18} />
          </div>
          <div className="mtb-label-col">
            <span className="mtb-title">2. Beli Komoditas P2P</span>
            <span className="mtb-sub">Beli Penawaran Pemain Lain</span>
          </div>
        </button>

        <button
          className={`market-tab-btn btn-tab-sell ${activeMarketPage === 'komoditas_jual' ? 'active' : ''}`}
          onClick={() => { sounds.playClick(); setActiveMarketPage('komoditas_jual'); }}
        >
          <div className="mtb-icon-box">
            <DollarSign size={18} />
          </div>
          <div className="mtb-label-col">
            <span className="mtb-title">3. Pasang Penawaran P2P</span>
            <span className="mtb-sub">Jual Stok Milik Anda ke Pasar</span>
          </div>
        </button>

        <button
          className={`market-tab-btn btn-tab-military ${activeMarketPage === 'militer' ? 'active' : ''}`}
          onClick={() => { sounds.playClick(); setActiveMarketPage('militer'); }}
        >
          <div className="mtb-icon-box">
            <Swords size={18} />
          </div>
          <div className="mtb-label-col">
            <span className="mtb-title">4. Jual Beli Militer</span>
            <span className="mtb-sub">Alutsista, Tank, Jet & Rudal</span>
          </div>
        </button>
      </div>

      {/* ==================== HALAMAN 1: PERBEKALAN & SUPLEMEN ==================== */}
      {activeMarketPage === 'perbekalan' && (
        <div className="market-page-section">
          <div className="mps-header banner-gold">
            <div className="mps-icon-badge">
              <ShoppingBag size={22} />
            </div>
            <div className="mps-text-block">
              <h3 className="mps-title">Katalog Suplemen Energi & Instrumen Negara</h3>
              <p className="mps-sub">Dapatkan asupan nutrisi cepat pulihkan stamina kerja, perlengkapan intelijen negara, lisensi pertambangan, dan emas murni.</p>
            </div>
          </div>

          <div className="shop-items-grid">
            {SHOP_ITEMS.map((item) => {
              const IconComponent = ICON_MAP[item.iconName] || Package;
              const ownedCount = playerInventory ? (playerInventory[item.id] || 0) : 0;
              const isEnergyFull = (item.type === 'energy' || item.type === 'max_energy') && (player?.energy >= (player?.maxEnergy || 100));
              const canAffordMoney = (player?.money || 0) >= (item.priceRp || 0);
              const canAffordGold = (player?.gold || 0) >= (item.priceGold || 0);
              const canAfford = canAffordMoney && canAffordGold;
              const isBuying = purchasingId === item.id;

              return (
                <div key={item.id} className="shop-item-card glass-panel">
                  <div className="sic-top">
                    <div 
                      className="sic-icon-wrap" 
                      style={{ backgroundColor: `${item.color}20`, color: item.color }}
                    >
                      <IconComponent size={24} />
                    </div>
                    {ownedCount > 0 && (
                      <span className="sic-owned-badge">
                        Dimiliki: <strong>{ownedCount}</strong>
                      </span>
                    )}
                  </div>

                  <h4 className="sic-title">{item.name}</h4>
                  <p className="sic-desc">{item.description}</p>

                  <div className="sic-effect-box">
                    <span className="sic-effect-text" style={{ color: item.color }}>
                      ✨ {item.effectText}
                    </span>
                  </div>

                  <div className="sic-price-row">
                    <div className="sic-prices">
                      {item.priceRp > 0 && (
                        <span className="sic-rp-tag">{formatRupiah(item.priceRp)}</span>
                      )}
                      {item.priceGold > 0 && (
                        <span className="sic-gold-tag">+{item.priceGold} Emas</span>
                      )}
                    </div>
                  </div>

                  <button
                    className={`sic-buy-btn ${!canAfford || (isEnergyFull && item.type.includes('energy')) ? 'disabled' : ''}`}
                    onClick={() => handlePurchaseShopItem(item)}
                    disabled={!canAfford || isBuying || (isEnergyFull && item.type.includes('energy'))}
                  >
                    {isBuying ? (
                      <span>Memproses...</span>
                    ) : isEnergyFull && item.type.includes('energy') ? (
                      <span>Stamina Penuh</span>
                    ) : !canAfford ? (
                      <span>Saldo Kurang</span>
                    ) : (
                      <>
                        <ShoppingCart size={15} />
                        <span>Beli Sekarang</span>
                      </>
                    )}
                  </button>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* ==================== HALAMAN 2: BELI KOMODITAS P2P (ANTAR-PEMAIN) ==================== */}
      {activeMarketPage === 'komoditas_beli' && (
        <div className="market-page-section p2p-market-section">
          <div className="mps-header banner-cyan">
            <div className="mps-icon-badge">
              <Boxes size={22} />
            </div>
            <div className="mps-text-block">
              <h3 className="mps-title">Bursa Komoditas Terbuka Antar-Pemain (Player-to-Player)</h3>
              <p className="mps-sub">
                Seluruh barang di bursa ini 100% dipasok oleh pemain lain (bukan sistem/NPC). Beli langsung dari penawaran termurah para penambang, petani sawit, dan industrialis se-Indonesia.
              </p>
            </div>
          </div>

          {/* Filter Bar & Quick Stats */}
          <div className="p2p-filter-bar glass-panel">
            <div className="pfb-left">
              <span className="pfb-label">Filter Komoditas:</span>
              <div className="pfb-chips">
                <button 
                  className={`pfb-chip ${p2pFilterItem === 'all' ? 'active' : ''}`}
                  onClick={() => { sounds.playClick(); setP2pFilterItem('all'); }}
                >
                  Semua Komoditas
                </button>
                {commodities.map((c) => (
                  <button 
                    key={c.id}
                    className={`pfb-chip ${p2pFilterItem === c.id ? 'active' : ''}`}
                    onClick={() => { sounds.playClick(); setP2pFilterItem(c.id); }}
                  >
                    {c.name.split(' ')[0]}
                  </button>
                ))}
              </div>
            </div>

            <button 
              className="btn-gold p2p-post-btn"
              onClick={() => {
                sounds.playClick();
                setActiveMarketPage('komoditas_jual');
              }}
            >
              <Plus size={16} />
              <span>Buka Lapak Jual</span>
            </button>
          </div>

          {/* Active Listings Grid */}
          {(() => {
            const activeListings = (marketListings || []).filter(
              (l) => l.status === 'active' && (p2pFilterItem === 'all' || l.item_id === p2pFilterItem)
            );

            if (activeListings.length === 0) {
              return (
                <div className="p2p-empty-state glass-panel">
                  <div className="pes-icon">
                    <Boxes size={48} className="text-cyan" />
                  </div>
                  <h4 className="pes-title">Belum Ada Penawaran Komoditas dari Pemain</h4>
                  <p className="pes-desc">
                    Saat ini belum ada pemain yang menjual komoditas {p2pFilterItem !== 'all' ? 'ini' : ''}. Jadilah yang pertama memasang penawaran jual dari gudang hasil tambang Anda!
                  </p>
                  <button 
                    className="btn-gold"
                    onClick={() => {
                      sounds.playClick();
                      setActiveMarketPage('komoditas_jual');
                    }}
                  >
                    <Plus size={16} />
                    <span>Pasang Penawaran Jual Sekarang</span>
                  </button>
                </div>
              );
            }

            return (
              <div className="shop-items-grid">
                {activeListings.map((listing) => {
                  const comm = commodities.find((c) => c.id === listing.item_id) || { color: '#38bdf8' };
                  const isMyListing = (player?.id === listing.seller_id) || (player?.username === listing.seller_id);
                  const canAfford = (player?.money || 0) >= Number(listing.total_price);
                  const priceDiff = comm.currentPriceRp 
                    ? Math.round(((Number(listing.price_per_unit) - comm.currentPriceRp) / comm.currentPriceRp) * 100)
                    : 0;

                  return (
                    <div key={listing.id} className="shop-item-card glass-panel trade-card-buy p2p-card">
                      <div className="sic-top">
                        <div className="sic-icon-wrap" style={{ backgroundColor: `${comm.color}20`, color: comm.color }}>
                          <Boxes size={24} />
                        </div>
                        <span className="p2p-seller-badge">
                          <User size={12} />
                          <span>{listing.seller_name}</span>
                        </span>
                      </div>

                      <h4 className="sic-title">{listing.item_name}</h4>
                      
                      <div className="p2p-batch-info">
                        <div className="pbi-row">
                          <span className="pbi-k">Jumlah Dijual:</span>
                          <strong className="text-cyan pbi-qty">{listing.quantity} {listing.unit}</strong>
                        </div>
                        <div className="pbi-row">
                          <span className="pbi-k">Harga per Unit:</span>
                          <span className="pbi-unit-price">{formatRupiah(listing.price_per_unit)}</span>
                        </div>
                        <div className="pbi-row">
                          <span className="pbi-k">Status Harga:</span>
                          <span className={`pbi-diff ${priceDiff <= 0 ? 'text-emerald' : 'text-gold'}`}>
                            {priceDiff < 0 ? `${priceDiff}% lebih murah` : priceDiff === 0 ? 'Sesuai Pasar' : `+${priceDiff}% dari pasar`}
                          </span>
                        </div>
                      </div>

                      <div className="sic-price-row p2p-total-box">
                        <span className="ptb-label">Total Pembelian:</span>
                        <strong className="sic-rp-tag text-emerald ptb-val">{formatRupiah(listing.total_price)}</strong>
                      </div>

                      {isMyListing ? (
                        <button
                          className="btn-secondary sic-cancel-btn"
                          onClick={() => cancelMarketListing(listing.id)}
                          title="Tarik kembali barang ini ke inventaris Anda"
                        >
                          <X size={15} />
                          <span>Tarik / Batalkan Penawaran</span>
                        </button>
                      ) : (
                        <button
                          className={`sic-buy-btn ${!canAfford ? 'disabled' : ''}`}
                          onClick={() => buyMarketListing(listing.id)}
                          disabled={!canAfford}
                        >
                          {!canAfford ? (
                            <span>Kas Tidak Cukup</span>
                          ) : (
                            <>
                              <ShoppingCart size={15} />
                              <span>Beli Dari {listing.seller_name.split(' ')[0]}</span>
                            </>
                          )}
                        </button>
                      )}
                    </div>
                  );
                })}
              </div>
            );
          })()}
        </div>
      )}

      {/* ==================== HALAMAN 3: PASANG PENAWARAN P2P (JUAL KE PEMAIN LAIN) ==================== */}
      {activeMarketPage === 'komoditas_jual' && (
        <div className="market-page-section p2p-sell-section">
          <div className="mps-header banner-emerald">
            <div className="mps-icon-badge">
              <DollarSign size={22} />
            </div>
            <div className="mps-text-block">
              <h3 className="mps-title">Sentra Lapak & Penjualan Komoditas Antar-Pemain</h3>
              <p className="mps-sub">
                Bukan menjual ke sistem dengan harga kaku. Di sini Anda bebas menentukan harga dan kuantitas barang hasil tambang/pabrik Anda untuk dibeli oleh warga lain.
              </p>
            </div>
          </div>

          <div className="p2p-sell-layout">
            {/* Form Buat Penawaran Baru */}
            <div className="p2p-sell-form-card glass-panel-gold">
              <div className="psfc-header">
                <Tag size={20} className="text-gold" />
                <h4 className="psfc-title">Pasang Penawaran Jual Baru</h4>
              </div>
              <p className="psfc-subtitle">
                Barang yang dipasang akan langsung tampil di Bursa Komoditas P2P seluruh Indonesia. Uang hasil pembelian akan langsung ditransfer ke saldo kas Anda.
              </p>

              <div className="psfc-fields">
                {/* 1. Pilih Komoditas */}
                <div className="psfc-field-group">
                  <label className="psfc-label">Pilih Komoditas dari Gudang Anda:</label>
                  <select 
                    className="psfc-select"
                    value={sellForm.itemId}
                    onChange={(e) => {
                      const selectedId = e.target.value;
                      const comm = commodities.find(c => c.id === selectedId);
                      setSellForm(prev => ({
                        ...prev,
                        itemId: selectedId,
                        pricePerUnit: comm ? comm.currentPriceRp : 1000000
                      }));
                    }}
                  >
                    {commodities.map((c) => {
                      const stock = playerInventory ? (playerInventory[c.id] || 0) : 0;
                      return (
                        <option key={c.id} value={c.id}>
                          {c.name} — Stok Gudang: {stock} {c.unit}
                        </option>
                      );
                    })}
                  </select>
                </div>

                {/* 2. Jumlah yang Ingin Dijual */}
                {(() => {
                  const currentComm = commodities.find(c => c.id === sellForm.itemId) || commodities[0];
                  const currentStock = playerInventory ? (playerInventory[currentComm.id] || 0) : 0;
                  const estimatedTotal = (Number(sellForm.quantity) || 0) * (Number(sellForm.pricePerUnit) || 0);

                  return (
                    <>
                      <div className="psfc-field-group">
                        <div className="pfg-label-row">
                          <label className="psfc-label">Jumlah Dijual ({currentComm.unit}):</label>
                          <span className="pfg-stock-hint">
                            Stok Anda: <strong className={currentStock > 0 ? 'text-emerald' : 'text-crimson'}>{currentStock} {currentComm.unit}</strong>
                          </span>
                        </div>
                        <div className="psfc-input-stepper">
                          <input 
                            type="number"
                            min="1"
                            max={Math.max(1, currentStock)}
                            className="psfc-input"
                            value={sellForm.quantity}
                            onChange={(e) => {
                              const val = Math.max(1, parseInt(e.target.value, 10) || 1);
                              setSellForm(prev => ({ ...prev, quantity: val }));
                            }}
                          />
                          <button 
                            type="button"
                            className="btn-secondary btn-max"
                            onClick={() => {
                              if (currentStock > 0) setSellForm(prev => ({ ...prev, quantity: currentStock }));
                            }}
                            disabled={currentStock <= 0}
                          >
                            Maksimal ({currentStock})
                          </button>
                        </div>
                      </div>

                      {/* 3. Harga per Unit */}
                      <div className="psfc-field-group">
                        <div className="pfg-label-row">
                          <label className="psfc-label">Harga yang Anda Tawarkan (Rp / {currentComm.unit}):</label>
                          <span className="pfg-ref-hint">
                            Patokan Bursa: <strong className="text-cyan">{formatRupiah(currentComm.currentPriceRp)}</strong>
                          </span>
                        </div>
                        <input 
                          type="number"
                          step="10000"
                          min="1000"
                          className="psfc-input"
                          value={sellForm.pricePerUnit}
                          onChange={(e) => {
                            const val = Math.max(1000, parseFloat(e.target.value) || 0);
                            setSellForm(prev => ({ ...prev, pricePerUnit: val }));
                          }}
                        />
                        <div className="psfc-quick-presets">
                          <button 
                            type="button" 
                            className="btn-preset" 
                            onClick={() => setSellForm(prev => ({ ...prev, pricePerUnit: Math.round(currentComm.currentPriceRp * 0.95) }))}
                          >
                            -5% (Cepat Laku)
                          </button>
                          <button 
                            type="button" 
                            className="btn-preset" 
                            onClick={() => setSellForm(prev => ({ ...prev, pricePerUnit: currentComm.currentPriceRp }))}
                          >
                            Pasar
                          </button>
                          <button 
                            type="button" 
                            className="btn-preset" 
                            onClick={() => setSellForm(prev => ({ ...prev, pricePerUnit: Math.round(currentComm.currentPriceRp * 1.05) }))}
                          >
                            +5% (Untung Tinggi)
                          </button>
                        </div>
                      </div>

                      {/* Kalkulasi Ringkasan Pendapatan */}
                      <div className="psfc-summary-box">
                        <div className="psb-line">
                          <span>Total Kas yang Akan Anda Terima:</span>
                          <strong className="text-emerald psb-total">{formatRupiah(estimatedTotal)}</strong>
                        </div>
                        <div className="psb-line psb-subline">
                          <span>Potongan Biaya Admin Bursa:</span>
                          <strong className="text-cyan">Rp 0 (Bebas Biaya)</strong>
                        </div>
                      </div>

                      <button
                        className={`btn-gold psfc-submit-btn ${currentStock < sellForm.quantity || currentStock <= 0 ? 'disabled' : ''}`}
                        disabled={currentStock < sellForm.quantity || currentStock <= 0 || isSubmittingListing}
                        onClick={async () => {
                          setIsSubmittingListing(true);
                          const ok = await createMarketListing(sellForm.itemId, sellForm.quantity, sellForm.pricePerUnit);
                          setIsSubmittingListing(false);
                          if (ok) {
                            setActiveMarketPage('komoditas_beli');
                          }
                        }}
                      >
                        {currentStock <= 0 ? (
                          <span>Stok Gudang Kosong (Bekerja di Tambang Terlebih Dahulu)</span>
                        ) : currentStock < sellForm.quantity ? (
                          <span>Jumlah Melebihi Stok Gudang</span>
                        ) : isSubmittingListing ? (
                          <span>Menayangkan ke Pasar...</span>
                        ) : (
                          <>
                            <Tag size={16} />
                            <span>Tayangkan Penawaran ke Pasar P2P</span>
                          </>
                        )}
                      </button>
                    </>
                  );
                })()}
              </div>
            </div>

            {/* Riwayat Penawaran Aktif Milik Pemain Ini */}
            <div className="p2p-my-listings-panel glass-panel">
              <div className="pmlp-header">
                <Clock size={18} className="text-cyan" />
                <h4 className="pmlp-title">Lapak & Penawaran Aktif Milik Anda</h4>
              </div>

              {(() => {
                const myListings = (marketListings || []).filter(
                  (l) => ((l.seller_id === player?.id) || (l.seller_id === player?.username))
                );

                if (myListings.length === 0) {
                  return (
                    <div className="pmlp-empty">
                      <p>Anda belum memiliki penawaran yang sedang dijual di pasar.</p>
                      <span className="text-dim">Gunakan formulir di sebelah kiri untuk mulai menjual sumber daya Anda.</span>
                    </div>
                  );
                }

                return (
                  <div className="pmlp-list">
                    {myListings.map((l) => (
                      <div key={l.id} className={`pmlp-item ${l.status}`}>
                        <div className="pmi-left">
                          <strong className="pmi-name">{l.item_name}</strong>
                          <div className="pmi-meta">
                            <span>{l.quantity} {l.unit} @ {formatRupiah(l.price_per_unit)}</span>
                            <span className="pmi-dot">•</span>
                            <strong className="text-emerald">{formatRupiah(l.total_price)}</strong>
                          </div>
                        </div>

                        <div className="pmi-right">
                          <span className={`pmi-status-pill ${l.status}`}>
                            {l.status === 'active' ? 'Tayang di Bursa' : l.status === 'sold' ? 'Terjual' : 'Dibatalkan'}
                          </span>
                          {l.status === 'active' && (
                            <button
                              className="pmi-cancel-action"
                              onClick={() => cancelMarketListing(l.id)}
                              title="Tarik kembali barang ini ke gudang"
                            >
                              Tarik Barang
                            </button>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                );
              })()}
            </div>
          </div>
        </div>
      )}

      {/* ==================== HALAMAN 4: JUAL BELI MILITER ==================== */}
      {activeMarketPage === 'militer' && (
        <div className="market-page-section">
          <div className="mps-header banner-crimson">
            <div className="mps-icon-badge">
              <Swords size={22} />
            </div>
            <div className="mps-text-block">
              <h3 className="mps-title">Pabrik Pertahanan & Alutsista Angkatan Bersenjata</h3>
              <p className="mps-sub">Pengadaan dan peremajaan unit tempur: Infantri Raider, Kavaleri MBT, Jet Tempur Rafale, Frigat Siluman, dan Rudal Taktis.</p>
            </div>
          </div>

          <div className="shop-items-grid">
            {MILITARY_UNITS.map((unit) => {
              const qty = militaryQuantities[unit.id] || 1;
              const totalCost = unit.moneyCost * qty;
              const sellProceeds = Math.round(totalCost * 0.75);
              const canAfford = (player?.money || 0) >= totalCost;
              const ownedCount = playerInventory ? (playerInventory[unit.id] || 0) : 0;

              return (
                <div key={unit.id} className="shop-item-card glass-panel military-shop-card">
                  <div className="sic-top">
                    <div className="sic-icon-wrap" style={{ backgroundColor: `${unit.color}20`, color: unit.color }}>
                      <Swords size={24} />
                    </div>
                    <span className="sic-owned-badge">
                      Persediaan: <strong>{ownedCount} Unit</strong>
                    </span>
                  </div>

                  <h4 className="sic-title">{unit.name}</h4>
                  <p className="sic-desc">{unit.description}</p>

                  <div className="mil-stat-badge-row">
                    <div className="msb-item">
                      <span className="msb-k">Serangan (ATK):</span>
                      <strong className="text-crimson">+{unit.attack}</strong>
                    </div>
                    <div className="msb-item">
                      <span className="msb-k">Pertahanan (DEF):</span>
                      <strong className="text-emerald">+{unit.defense}</strong>
                    </div>
                    <div className="msb-item">
                      <span className="msb-k">Tipe:</span>
                      <strong className="text-cyan">{unit.type}</strong>
                    </div>
                  </div>

                  {/* Quantity Stepper */}
                  <div className="trade-stepper-box">
                    <span className="tsb-label">Jumlah Pembelian / Penjualan:</span>
                    <div className="tsb-controls">
                      <button className="tsb-btn" onClick={() => handleQtyChange(unit.id, -5, true)}>-5</button>
                      <button className="tsb-btn" onClick={() => handleQtyChange(unit.id, -1, true)}>-1</button>
                      <span className="tsb-val">{qty} Batalyon/Unit</span>
                      <button className="tsb-btn" onClick={() => handleQtyChange(unit.id, 1, true)}>+1</button>
                      <button className="tsb-btn" onClick={() => handleQtyChange(unit.id, 5, true)}>+5</button>
                    </div>
                  </div>

                  <div className="sic-price-row">
                    <span>Harga Unit:</span>
                    <span className="sic-rp-tag">{formatRupiah(unit.moneyCost)} / unit</span>
                  </div>

                  {/* Dual Action Buttons: Beli & Jual */}
                  <div className="mil-action-buttons-grid">
                    <button
                      className={`sic-buy-btn ${!canAfford ? 'disabled' : ''}`}
                      onClick={() => tradeMilitaryUnit(unit.id, 'buy', qty)}
                      disabled={!canAfford}
                    >
                      {!canAfford ? (
                        <span>Kas Kurang</span>
                      ) : (
                        <>
                          <ShoppingCart size={14} />
                          <span>Beli ({formatRupiah(totalCost)})</span>
                        </>
                      )}
                    </button>

                    <button
                      className={`sic-sell-btn ${ownedCount < qty ? 'disabled' : ''}`}
                      onClick={() => tradeMilitaryUnit(unit.id, 'sell', qty)}
                      disabled={ownedCount < qty}
                      title={ownedCount < qty ? 'Unit tidak mencukupi di inventaris' : `Jual ${qty} unit seharga ${formatRupiah(sellProceeds)}`}
                    >
                      {ownedCount < qty ? (
                        <span>Stok Kurang</span>
                      ) : (
                        <>
                          <DollarSign size={14} />
                          <span>Jual (+{formatRupiah(sellProceeds)})</span>
                        </>
                      )}
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
