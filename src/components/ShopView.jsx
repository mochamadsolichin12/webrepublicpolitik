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
  DollarSign
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
    commodities 
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
      badge: 'Bursa Komoditas Nasional',
      title: 'Pengadaan & Pembelian Sumber Daya',
      desc: 'Akses langsung ke cadangan komoditas strategis negara. Beli Minyak Mentah, Nikel HPAL, CPO Sawit, Batubara, Emas, dan Beras untuk bahan baku industri Anda.',
      icon: Boxes,
      color: '#38bdf8',
      accentClass: 'theme-cyan',
      statLabel: 'Komoditas Terdaftar',
      statVal: `${commodities.length} Bahan Mentah`,
    },
    komoditas_jual: {
      badge: 'Sentra Likuidasi Komoditas',
      title: 'Penjualan Hasil Tambang & Panen',
      desc: 'Cairkan stok hasil kerja shift dinas tambang, perkebunan, dan pabrik Anda langsung ke kas kasir negara untuk mendongkrak saldo Rupiah tunai Anda.',
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
            <span className="mtb-title">2. Beli Sumber Daya</span>
            <span className="mtb-sub">Minyak, Nikel, CPO & Batubara</span>
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
            <span className="mtb-title">3. Jual Hasil Tambang</span>
            <span className="mtb-sub">Cairkan Stok ke Saldo Kas</span>
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

      {/* ==================== HALAMAN 2: BELI SUMBER DAYA ALAM ==================== */}
      {activeMarketPage === 'komoditas_beli' && (
        <div className="market-page-section">
          <div className="mps-header banner-cyan">
            <div className="mps-icon-badge">
              <Boxes size={22} />
            </div>
            <div className="mps-text-block">
              <h3 className="mps-title">Bursa Pembelian Sumber Daya & Komoditas Strategis</h3>
              <p className="mps-sub">Pengadaan bahan baku industri (Minyak Mentah, Nikel HPAL, CPO Sawit, Batubara, Emas Murni & Beras) langsung dari bursa komoditas nasional.</p>
            </div>
          </div>

          <div className="shop-items-grid">
            {commodities.map((comm) => {
              const qty = tradeQuantities[comm.id] || 1;
              const totalCost = comm.currentPriceRp * qty;
              const canAfford = (player?.money || 0) >= totalCost;
              const stockOwned = playerInventory ? (playerInventory[comm.id] || 0) : 0;

              return (
                <div key={comm.id} className="shop-item-card glass-panel trade-card-buy">
                  <div className="sic-top">
                    <div className="sic-icon-wrap" style={{ backgroundColor: `${comm.color}20`, color: comm.color }}>
                      <Boxes size={24} />
                    </div>
                    <span className="sic-owned-badge">
                      Stok Anda: <strong>{stockOwned} {comm.unit}</strong>
                    </span>
                  </div>

                  <h4 className="sic-title">{comm.name}</h4>
                  <p className="sic-desc">{comm.description}</p>

                  <div className="market-price-stat-box">
                    <div className="mpsb-row">
                      <span>Harga Pasar:</span>
                      <strong className="text-emerald">{formatRupiah(comm.currentPriceRp)} / {comm.unit}</strong>
                    </div>
                    <div className="mpsb-row">
                      <span>Tren 24 Jam:</span>
                      <strong className={comm.change24h >= 0 ? 'text-emerald' : 'text-crimson'}>
                        {comm.change24h >= 0 ? `+${comm.change24h}%` : `${comm.change24h}%`}
                      </strong>
                    </div>
                  </div>

                  {/* Quantity Stepper */}
                  <div className="trade-stepper-box">
                    <span className="tsb-label">Jumlah Pembelian:</span>
                    <div className="tsb-controls">
                      <button className="tsb-btn" onClick={() => handleQtyChange(comm.id, -10)}>-10</button>
                      <button className="tsb-btn" onClick={() => handleQtyChange(comm.id, -1)}>-1</button>
                      <span className="tsb-val">{qty} {comm.unit}</span>
                      <button className="tsb-btn" onClick={() => handleQtyChange(comm.id, 1)}>+1</button>
                      <button className="tsb-btn" onClick={() => handleQtyChange(comm.id, 10)}>+10</button>
                    </div>
                  </div>

                  <div className="sic-price-row">
                    <span>Total Pembayaran:</span>
                    <span className="sic-rp-tag">{formatRupiah(totalCost)}</span>
                  </div>

                  <button
                    className={`sic-buy-btn ${!canAfford ? 'disabled' : ''}`}
                    onClick={() => tradeCommodity(comm.id, 'buy', qty)}
                    disabled={!canAfford}
                  >
                    {!canAfford ? (
                      <span>Kas Tidak Cukup</span>
                    ) : (
                      <>
                        <ShoppingCart size={15} />
                        <span>Beli {qty}x {comm.name.split(' ')[0]}</span>
                      </>
                    )}
                  </button>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* ==================== HALAMAN 3: JUAL SUMBER DAYA ALAM ==================== */}
      {activeMarketPage === 'komoditas_jual' && (
        <div className="market-page-section">
          <div className="mps-header banner-emerald">
            <div className="mps-icon-badge">
              <DollarSign size={22} />
            </div>
            <div className="mps-text-block">
              <h3 className="mps-title">Sentra Penjualan & Likuidasi Hasil Tambang Rakyat</h3>
              <p className="mps-sub">Jual stok cadangan hasil kerja pabrik dan tambang Anda ke pasar terbuka untuk mencairkan keuntungan kas Rupiah instan.</p>
            </div>
          </div>

          <div className="shop-items-grid">
            {commodities.map((comm) => {
              const stockOwned = playerInventory ? (playerInventory[comm.id] || 0) : 0;
              const maxQty = Math.max(1, stockOwned);
              const qty = Math.min(stockOwned > 0 ? stockOwned : 1, tradeQuantities[`sell_${comm.id}`] || 1);
              const totalProceeds = comm.currentPriceRp * qty;
              const hasStock = stockOwned > 0;

              return (
                <div key={comm.id} className="shop-item-card glass-panel trade-card-sell">
                  <div className="sic-top">
                    <div className="sic-icon-wrap" style={{ backgroundColor: `${comm.color}20`, color: comm.color }}>
                      <Boxes size={24} />
                    </div>
                    <span className={`sic-owned-badge ${hasStock ? 'bg-emerald-dim' : ''}`}>
                      Stok di Gudang: <strong className={hasStock ? 'text-emerald' : 'text-slate'}>{stockOwned} {comm.unit}</strong>
                    </span>
                  </div>

                  <h4 className="sic-title">{comm.name}</h4>
                  <p className="sic-desc">{comm.description}</p>

                  <div className="market-price-stat-box">
                    <div className="mpsb-row">
                      <span>Harga Tebus Pasar:</span>
                      <strong className="text-emerald">{formatRupiah(comm.currentPriceRp)} / {comm.unit}</strong>
                    </div>
                    <div className="mpsb-row">
                      <span>Permintaan Dunia:</span>
                      <strong className="text-gold">{comm.worldDemand}</strong>
                    </div>
                  </div>

                  {/* Quantity Stepper */}
                  <div className="trade-stepper-box">
                    <span className="tsb-label">Jumlah Dijual:</span>
                    <div className="tsb-controls">
                      <button 
                        className="tsb-btn" 
                        onClick={() => handleQtyChange(`sell_${comm.id}`, -5)}
                        disabled={!hasStock}
                      >
                        -5
                      </button>
                      <button 
                        className="tsb-btn" 
                        onClick={() => handleQtyChange(`sell_${comm.id}`, -1)}
                        disabled={!hasStock}
                      >
                        -1
                      </button>
                      <span className="tsb-val">{hasStock ? qty : 0} {comm.unit}</span>
                      <button 
                        className="tsb-btn" 
                        onClick={() => {
                          if (qty < stockOwned) handleQtyChange(`sell_${comm.id}`, 1);
                        }}
                        disabled={!hasStock || qty >= stockOwned}
                      >
                        +1
                      </button>
                      <button 
                        className="tsb-btn" 
                        onClick={() => setTradeQuantities((prev) => ({ ...prev, [`sell_${comm.id}`]: stockOwned }))}
                        disabled={!hasStock}
                      >
                        Semua
                      </button>
                    </div>
                  </div>

                  <div className="sic-price-row">
                    <span>Hasil Penjualan:</span>
                    <span className="sic-rp-tag text-emerald">+{formatRupiah(hasStock ? totalProceeds : 0)}</span>
                  </div>

                  <button
                    className={`sic-sell-btn ${!hasStock ? 'disabled' : ''}`}
                    onClick={() => tradeCommodity(comm.id, 'sell', qty)}
                    disabled={!hasStock}
                  >
                    {!hasStock ? (
                      <span>Stok Gudang Kosong</span>
                    ) : (
                      <>
                        <DollarSign size={15} />
                        <span>Jual {qty} {comm.unit} ke Pasar</span>
                      </>
                    )}
                  </button>
                </div>
              );
            })}
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
