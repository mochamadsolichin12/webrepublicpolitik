import React, { useState } from 'react';
import { useGame } from '../context/GameContext';
import { sounds } from '../utils/soundEffects';
import { 
  ShoppingCart, 
  Tag, 
  TrendingUp, 
  Check, 
  Wallet, 
  Swords,
  Coffee,
  HeartPulse,
  Zap,
  Shield,
  Plane,
  Anchor,
  Crosshair,
  Newspaper,
  Pickaxe,
  Award,
  Sparkles,
  Store
} from 'lucide-react';

// ==============================================================================
// 1. DATA 3 KATEGORI UTAMA PASAR RIVAL REGIONS
// ==============================================================================

// Kategori A: Sumber Daya (7 Komoditas Inti)
const RESOURCES_LIST = [
  {
    id: 'batu',
    name: 'Batu',
    unit: 'Unit',
    basePrice: 34.3,
    iconSvg: (
      <svg viewBox="0 0 48 48" className="rr-resource-svg">
        <path d="M12 28 L20 14 L30 18 L36 30 L26 40 L14 36 Z" fill="#64748b" stroke="#94a3b8" strokeWidth="2" />
        <path d="M18 24 L28 20 L32 30 L24 34 Z" fill="#475569" />
        <path d="M8 32 L16 22 L22 36 Z" fill="#94a3b8" opacity="0.6" />
      </svg>
    )
  },
  {
    id: 'kayu',
    name: 'Kayu',
    unit: 'Unit',
    basePrice: 32.9,
    iconSvg: (
      <svg viewBox="0 0 48 48" className="rr-resource-svg">
        <g stroke="#78350f" strokeWidth="2">
          <circle cx="18" cy="28" r="9" fill="#b45309" />
          <circle cx="18" cy="28" r="4" fill="#92400e" stroke="#78350f" strokeWidth="1.5" />
          <rect x="18" y="19" width="22" height="18" rx="2" fill="#d97706" />
          <circle cx="30" cy="28" r="9" fill="#b45309" />
          <circle cx="30" cy="28" r="4" fill="#92400e" stroke="#78350f" strokeWidth="1.5" />
          <rect x="30" y="19" width="12" height="18" rx="2" fill="#d97706" />
          <circle cx="24" cy="17" r="8" fill="#b45309" />
          <circle cx="24" cy="17" r="3.5" fill="#92400e" stroke="#78350f" strokeWidth="1.5" />
          <rect x="24" y="9" width="18" height="16" rx="2" fill="#f59e0b" />
        </g>
      </svg>
    )
  },
  {
    id: 'minyak',
    name: 'Minyak',
    unit: 'Barel',
    basePrice: 25.0,
    iconSvg: (
      <svg viewBox="0 0 48 48" className="rr-resource-svg">
        <rect x="14" y="10" width="20" height="28" rx="3" fill="#1e293b" stroke="#475569" strokeWidth="2" />
        <ellipse cx="24" cy="11" rx="10" ry="3.5" fill="#334155" stroke="#475569" strokeWidth="1.5" />
        <line x1="14" y1="20" x2="34" y2="20" stroke="#f59e0b" strokeWidth="2" />
        <line x1="14" y1="28" x2="34" y2="28" stroke="#f59e0b" strokeWidth="2" />
        <path d="M24 22 C23 24, 21.5 25, 21.5 26.5 C21.5 27.8 22.6 29 24 29 C25.4 29 26.5 27.8 26.5 26.5 C26.5 25, 25 24, 24 22 Z" fill="#f59e0b" />
      </svg>
    )
  },
  {
    id: 'uranium',
    name: 'Uranium',
    unit: 'Kg',
    basePrice: 21.6,
    iconSvg: (
      <svg viewBox="0 0 48 48" className="rr-resource-svg">
        <rect x="14" y="12" width="20" height="26" rx="4" fill="#0f172a" stroke="#22c55e" strokeWidth="2" />
        <circle cx="24" cy="25" r="4" fill="#22c55e" />
        <path d="M24 16 L27 21 L21 21 Z" fill="#22c55e" />
        <path d="M16 29 L21 26 L19 32 Z" fill="#22c55e" />
        <path d="M32 29 L27 26 L29 32 Z" fill="#22c55e" />
      </svg>
    )
  },
  {
    id: 'besi',
    name: 'Besi',
    unit: 'Batang',
    basePrice: 36.6,
    iconSvg: (
      <svg viewBox="0 0 48 48" className="rr-resource-svg">
        <polygon points="12,28 20,20 36,20 28,28" fill="#94a3b8" stroke="#cbd5e1" strokeWidth="1.5" />
        <polygon points="12,28 28,28 28,34 12,34" fill="#475569" stroke="#334155" strokeWidth="1.5" />
        <polygon points="28,28 36,20 36,26 28,34" fill="#64748b" stroke="#475569" strokeWidth="1.5" />
        <polygon points="16,20 23,13 38,13 31,20" fill="#cbd5e1" stroke="#f1f5f9" strokeWidth="1.2" opacity="0.8" />
      </svg>
    )
  },
  {
    id: 'tembaga',
    name: 'Tembaga',
    unit: 'Gulung',
    basePrice: 20.0,
    iconSvg: (
      <svg viewBox="0 0 48 48" className="rr-resource-svg">
        <ellipse cx="24" cy="24" rx="14" ry="9" fill="none" stroke="#ea580c" strokeWidth="4" />
        <ellipse cx="24" cy="21" rx="14" ry="9" fill="none" stroke="#c2410c" strokeWidth="3" />
        <ellipse cx="24" cy="27" rx="14" ry="9" fill="none" stroke="#f97316" strokeWidth="3" />
      </svg>
    )
  },
  {
    id: 'gas',
    name: 'Gas',
    unit: 'Tabung',
    basePrice: 25.8,
    iconSvg: (
      <svg viewBox="0 0 48 48" className="rr-resource-svg">
        <rect x="15" y="14" width="18" height="24" rx="5" fill="#0284c7" stroke="#38bdf8" strokeWidth="2" />
        <rect x="20" y="8" width="8" height="6" rx="2" fill="#0369a1" stroke="#38bdf8" strokeWidth="1.5" />
        <path d="M24 20 C22.5 22.5, 20.5 24, 20.5 26 C20.5 28 22 29.5 24 29.5 C26 29.5 27.5 28 27.5 26 C27.5 24, 25.5 22.5, 24 20 Z" fill="#e0f2fe" />
      </svg>
    )
  }
];

// Kategori B: Senjata / Alutsista Militer
const WEAPONS_LIST = [
  {
    id: 'infantry',
    name: 'Pasukan Infanteri',
    unit: 'Prajurit',
    basePrice: 15.0,
    iconSvg: (
      <svg viewBox="0 0 48 48" className="rr-resource-svg">
        <circle cx="24" cy="14" r="6" fill="#10b981" stroke="#059669" strokeWidth="1.5" />
        <path d="M16 40 L20 24 L28 24 L32 40 Z" fill="#047857" stroke="#059669" strokeWidth="1.5" />
        <line x1="28" y1="20" x2="38" y2="10" stroke="#f87171" strokeWidth="3" strokeLinecap="round" />
      </svg>
    )
  },
  {
    id: 'tanks',
    name: 'Kavaleri MBT Tank',
    unit: 'Unit',
    basePrice: 50.0,
    iconSvg: (
      <svg viewBox="0 0 48 48" className="rr-resource-svg">
        <rect x="10" y="24" width="28" height="12" rx="4" fill="#f59e0b" stroke="#b45309" strokeWidth="1.5" />
        <rect x="18" y="18" width="14" height="8" rx="2" fill="#d97706" />
        <line x1="30" y1="20" x2="42" y2="16" stroke="#92400e" strokeWidth="3" strokeLinecap="round" />
        <circle cx="16" cy="30" r="3" fill="#1e293b" />
        <circle cx="24" cy="30" r="3" fill="#1e293b" />
        <circle cx="32" cy="30" r="3" fill="#1e293b" />
      </svg>
    )
  },
  {
    id: 'jets',
    name: 'Skadron Jet Tempur',
    unit: 'Pesawat',
    basePrice: 120.0,
    iconSvg: (
      <svg viewBox="0 0 48 48" className="rr-resource-svg">
        <path d="M24 8 L28 20 L42 28 L28 32 L26 40 L22 40 L20 32 L6 28 L20 20 Z" fill="#38bdf8" stroke="#0284c7" strokeWidth="1.5" />
      </svg>
    )
  },
  {
    id: 'warships',
    name: 'Kapal Frigat Siluman',
    unit: 'Armada',
    basePrice: 95.0,
    iconSvg: (
      <svg viewBox="0 0 48 48" className="rr-resource-svg">
        <path d="M8 28 L40 28 L36 38 L14 38 Z" fill="#06b6d4" stroke="#0891b2" strokeWidth="1.5" />
        <polygon points="20,16 28,16 32,28 16,28" fill="#0e7490" />
        <line x1="24" y1="10" x2="24" y2="16" stroke="#e0f2fe" strokeWidth="2" />
      </svg>
    )
  },
  {
    id: 'missiles',
    name: 'Rudal Balistik Taktis',
    unit: 'Hulu Ledak',
    basePrice: 250.0,
    iconSvg: (
      <svg viewBox="0 0 48 48" className="rr-resource-svg">
        <path d="M24 6 C28 10, 30 18, 30 36 L18 36 C18 18, 20 10, 24 6 Z" fill="#ef4444" stroke="#b91c1c" strokeWidth="1.5" />
        <polygon points="18,32 12,38 18,38" fill="#7f1d1d" />
        <polygon points="30,32 36,38 30,38" fill="#7f1d1d" />
      </svg>
    )
  }
];

// Kategori C: Pasar Lokal (Suplemen, Medis, Logistik Warga)
const LOCAL_SHOP_LIST = [
  {
    id: 'energy_coffee',
    name: 'Kopi Robusta Super',
    unit: 'Gelas',
    basePrice: 5.0,
    iconSvg: (
      <svg viewBox="0 0 48 48" className="rr-resource-svg">
        <rect x="14" y="16" width="18" height="20" rx="3" fill="#d97706" stroke="#92400e" strokeWidth="1.5" />
        <path d="M32 20 C36 20, 38 24, 38 27 C38 30, 36 32, 32 32" fill="none" stroke="#92400e" strokeWidth="2" />
        <path d="M18 12 Q20 8 22 12" stroke="#fbbf24" strokeWidth="2" fill="none" strokeLinecap="round" />
        <path d="M24 12 Q26 8 28 12" stroke="#fbbf24" strokeWidth="2" fill="none" strokeLinecap="round" />
      </svg>
    )
  },
  {
    id: 'energy_tonic',
    name: 'Tonik Ginseng Istana',
    unit: 'Botol',
    basePrice: 15.0,
    iconSvg: (
      <svg viewBox="0 0 48 48" className="rr-resource-svg">
        <rect x="18" y="18" width="12" height="20" rx="3" fill="#eab308" stroke="#ca8a04" strokeWidth="1.5" />
        <rect x="22" y="12" width="4" height="6" fill="#a16207" />
        <circle cx="24" cy="28" r="3" fill="#fef08a" />
      </svg>
    )
  },
  {
    id: 'medical_kit',
    name: 'Paket Medis Parlemen',
    unit: 'Kotak',
    basePrice: 30.0,
    iconSvg: (
      <svg viewBox="0 0 48 48" className="rr-resource-svg">
        <rect x="12" y="16" width="24" height="20" rx="4" fill="#ef4444" stroke="#dc2626" strokeWidth="1.5" />
        <rect x="22" y="21" width="4" height="10" fill="#ffffff" />
        <rect x="19" y="24" width="10" height="4" fill="#ffffff" />
      </svg>
    )
  },
  {
    id: 'mining_permit',
    name: 'Izin Tambang Daerah',
    unit: 'Lisensi',
    basePrice: 75.0,
    iconSvg: (
      <svg viewBox="0 0 48 48" className="rr-resource-svg">
        <rect x="14" y="12" width="20" height="26" rx="2" fill="#3b82f6" stroke="#1d4ed8" strokeWidth="1.5" />
        <line x1="18" y1="20" x2="30" y2="20" stroke="#bfdbfe" strokeWidth="2" />
        <line x1="18" y1="26" x2="30" y2="26" stroke="#bfdbfe" strokeWidth="2" />
        <circle cx="24" cy="32" r="2.5" fill="#fbbf24" />
      </svg>
    )
  },
  {
    id: 'gold_bundle',
    name: 'Batang Emas Antam',
    unit: 'Batang',
    basePrice: 100.0,
    iconSvg: (
      <svg viewBox="0 0 48 48" className="rr-resource-svg">
        <polygon points="12,28 20,18 36,18 28,28" fill="#fbbf24" stroke="#f59e0b" strokeWidth="1.5" />
        <polygon points="12,28 28,28 28,34 12,34" fill="#d97706" />
        <polygon points="28,28 36,18 36,24 28,34" fill="#b45309" />
      </svg>
    )
  }
];

export default function ShopView({ initialSubPage }) {
  const { 
    player, 
    playerInventory, 
    marketListings, 
    createMarketListing, 
    buyMarketListing 
  } = useGame();

  // 1. Tiga Kategori Atas: 'sumber_daya' | 'senjata' | 'pasar_lokal'
  const getInitialTopCategory = () => {
    if (initialSubPage === 'senjata' || initialSubPage === 'militer') return 'senjata';
    if (initialSubPage === 'perbekalan' || initialSubPage === 'pasar_lokal') return 'pasar_lokal';
    if (typeof window !== 'undefined' && window.location.hash) {
      const hash = window.location.hash.replace('#', '');
      if (hash === 'senjata' || hash === 'militer') return 'senjata';
      if (hash === 'perbekalan' || hash === 'pasar_lokal') return 'pasar_lokal';
    }
    return 'sumber_daya';
  };

  const [topCategory, setTopCategory] = useState(getInitialTopCategory);

  // 2. Tab Mode: 'beli' vs 'jual'
  const [marketMode, setMarketMode] = useState('beli');

  // Input jumlah per item
  const [quantities, setQuantities] = useState({});
  // Form input harga custom saat mode 'jual' (P2P listing)
  const [customPrices, setCustomPrices] = useState({});

  const handleQtyChange = (itemId, val) => {
    const clean = val === '' ? '' : Math.max(0, parseInt(val, 10) || 0);
    setQuantities((prev) => ({ ...prev, [itemId]: clean }));
  };

  const handlePriceChange = (itemId, val) => {
    const clean = val === '' ? '' : Math.max(0.1, parseFloat(val) || 0.1);
    setCustomPrices((prev) => ({ ...prev, [itemId]: clean }));
  };

  // Format angka Rupiah / Stock
  const formatNumber = (num) => {
    if (num === undefined || num === null) return '0';
    return Number(num).toLocaleString('id-ID');
  };

  // Tentukan daftar item aktif berdasarkan kategori atas
  const getActiveItemList = () => {
    if (topCategory === 'senjata') return WEAPONS_LIST;
    if (topCategory === 'pasar_lokal') return LOCAL_SHOP_LIST;
    return RESOURCES_LIST;
  };

  const activeItems = getActiveItemList();

  // Eksekusi Beli (Murni P2P dari pemain lain yang listing)
  const handleBuy = async (item) => {
    const inputQty = parseInt(quantities[item.id], 10);
    if (!inputQty || inputQty <= 0) {
      alert(`Masukkan jumlah ${item.name} yang ingin dibeli terlebih dahulu.`);
      return;
    }

    const myId = player?.id || player?.username;
    // Cari penawaran aktif di pasar yang dibuat oleh pemain LAIN
    const activeListings = (marketListings || []).filter(
      (l) => l.item_id === item.id && l.status === 'active' && l.seller_id !== myId
    );

    if (activeListings.length === 0) {
      alert(`Belum ada pemain yang menjual ${item.name} saat ini! Tunggu pemain lain memasang penawaran, atau buka tab "Jual" untuk menjual barang dari inventaris Anda.`);
      return;
    }

    // Beli dari listing pemain yang termurah
    const targetListing = activeListings[0];
    const ok = await buyMarketListing(targetListing.id);
    if (ok) {
      setQuantities((prev) => ({ ...prev, [item.id]: '' }));
    }
  };

  // Eksekusi Jual (Pemain memasang barang ke pasar)
  const handleSell = async (item) => {
    const inputQty = parseInt(quantities[item.id], 10);
    if (!inputQty || inputQty <= 0) {
      alert(`Masukkan jumlah unit ${item.name} yang ingin dijual ke pasar.`);
      return;
    }

    const currentStock = playerInventory ? (playerInventory[item.id] || 0) : 0;
    if (currentStock < inputQty) {
      alert(`Stok ${item.name} di gudang Anda tidak cukup! (Milik Anda: ${currentStock} ${item.unit})`);
      return;
    }

    const sellPrice = customPrices[item.id] !== undefined ? parseFloat(customPrices[item.id]) : item.basePrice;
    if (isNaN(sellPrice) || sellPrice <= 0) {
      alert(`Masukkan harga per unit yang valid untuk ${item.name}.`);
      return;
    }

    const ok = await createMarketListing(item.id, inputQty, sellPrice, {
      id: item.id,
      name: item.name,
      unit: item.unit
    });
    if (ok) {
      setQuantities((prev) => ({ ...prev, [item.id]: '' }));
    }
  };

  return (
    <div className="rr-market-container">
      {/* ==================== 1. TOP HEADER CARDS (SESUAI SCREENSHOT) ==================== */}
      <div className="rr-top-header-row">
        {/* Kotak Saldo Kas: 'Your Uang' */}
        <div className="rr-wallet-box">
          <div className="rr-wallet-icon-wrap">
            <div className="rr-money-bill">
              <span className="rr-money-mark">$</span>
            </div>
            <div className="rr-wallet-badge">
              <Wallet size={10} />
            </div>
          </div>
          <div className="rr-wallet-info">
            <span className="rr-wallet-label">Your Uang</span>
            <strong className="rr-wallet-val">{formatNumber(player?.money || 50000)}</strong>
          </div>
        </div>

        {/* Tab 1: 'Sumber daya' */}
        <button 
          className={`rr-category-btn ${topCategory === 'sumber_daya' ? 'active' : ''}`}
          onClick={() => { sounds.playClick(); setTopCategory('sumber_daya'); }}
        >
          <div className="rr-cat-icon-circle cat-wood">
            <svg viewBox="0 0 32 32" className="rr-wood-svg">
              <circle cx="12" cy="18" r="6" fill="#b45309" stroke="#78350f" strokeWidth="1.5" />
              <circle cx="20" cy="18" r="6" fill="#b45309" stroke="#78350f" strokeWidth="1.5" />
              <circle cx="16" cy="11" r="5" fill="#d97706" stroke="#78350f" strokeWidth="1.5" />
            </svg>
          </div>
          <span className="rr-cat-title">Sumber daya</span>
          {topCategory === 'sumber_daya' && (
            <div className="rr-cat-check-badge">
              <Check size={14} strokeWidth={3} />
            </div>
          )}
        </button>

        {/* Tab 2: 'Senjata' (Militer) */}
        <button 
          className={`rr-category-btn ${topCategory === 'senjata' ? 'active' : ''}`}
          onClick={() => { sounds.playClick(); setTopCategory('senjata'); }}
        >
          <div className="rr-cat-icon-circle cat-cannon">
            <svg viewBox="0 0 32 32" className="rr-cannon-svg">
              <circle cx="16" cy="18" r="5" fill="#475569" stroke="#94a3b8" strokeWidth="1.5" />
              <line x1="16" y1="18" x2="26" y2="10" stroke="#cbd5e1" strokeWidth="2.5" strokeLinecap="round" />
            </svg>
          </div>
          <span className="rr-cat-title">Senjata</span>
          {topCategory === 'senjata' && (
            <div className="rr-cat-check-badge">
              <Check size={14} strokeWidth={3} />
            </div>
          )}
        </button>

        {/* Tab 3: 'Pasar Lokal' (Suplemen & Logistik Warga) */}
        <button 
          className={`rr-category-btn ${topCategory === 'pasar_lokal' ? 'active' : ''}`}
          onClick={() => { sounds.playClick(); setTopCategory('pasar_lokal'); }}
        >
          <div className="rr-cat-icon-circle cat-shop">
            <Store size={22} className="text-gold" />
          </div>
          <span className="rr-cat-title">Pasar Lokal</span>
          {topCategory === 'pasar_lokal' && (
            <div className="rr-cat-check-badge">
              <Check size={14} strokeWidth={3} />
            </div>
          )}
        </button>
      </div>

      {/* ==================== 2. SUB-BAR: BELI & JUAL TABS ==================== */}
      <div className="rr-subtabs-row">
        <button 
          className={`rr-subtab-btn btn-beli ${marketMode === 'beli' ? 'active' : ''}`}
          onClick={() => { sounds.playClick(); setMarketMode('beli'); }}
        >
          <ShoppingCart size={18} />
          <span>Beli</span>
        </button>

        <button 
          className={`rr-subtab-btn btn-jual ${marketMode === 'jual' ? 'active' : ''}`}
          onClick={() => { sounds.playClick(); setMarketMode('jual'); }}
        >
          <Tag size={18} />
          <span>Jual</span>
        </button>
      </div>

      {/* ==================== 3. TABEL PASAR LENGKAP ==================== */}
      <div className="rr-table-wrapper">
        <div className="rr-table-header">
          <div className="rr-col-resource">RESOURCE</div>
          <div className="rr-col-quantity">
            {marketMode === 'beli' ? 'SALE QUANTITY (DARI PLAYER)' : 'STOK GUDANG ANDA'}
          </div>
          <div className="rr-col-price">
            {marketMode === 'beli' ? 'PRICE/UNIT' : 'HARGA JUAL ANDA'}
          </div>
          <div className="rr-col-input">JUMLAH</div>
          <div className="rr-col-action">
            {marketMode === 'beli' ? 'BELI' : 'JUAL'}
          </div>
        </div>

        <div className="rr-table-body">
          {activeItems.map((item) => {
            // Ambil penawaran murni dari data P2P yang dipasang oleh pemain
            const matchingListings = (marketListings || []).filter(
              (l) => l.item_id === item.id && l.status === 'active'
            );
            // Kuantitas yang sedang dijual oleh pemain (0 jika belum ada pemain yang jualan)
            const saleQuantity = matchingListings.reduce((sum, l) => sum + Number(l.quantity), 0);
            // Harga terbaik yang ditawarkan pemain, atau harga patokan dasar
            const unitPrice = matchingListings.length > 0 ? matchingListings[0].price_per_unit : item.basePrice;
            const ownedStock = playerInventory ? (playerInventory[item.id] || 0) : 0;
            const currentPriceInput = customPrices[item.id] !== undefined ? customPrices[item.id] : item.basePrice;

            return (
              <div key={item.id} className="rr-table-row">
                {/* Kolom 1: Ikon + Nama Resource */}
                <div className="rr-cell rr-col-resource">
                  <div className="rr-resource-pill">
                    <div className="rr-resource-icon-box">
                      {item.iconSvg}
                    </div>
                    <span className="rr-resource-name">{item.name}</span>
                  </div>
                </div>

                {/* Kolom 2: Sale Quantity (0 jika belum ada player yang jual) atau Stok Gudang */}
                <div className="rr-cell rr-col-quantity">
                  <strong className={`rr-qty-text ${marketMode === 'beli' && saleQuantity === 0 ? 'text-dim' : ''}`}>
                    {marketMode === 'beli' ? formatNumber(saleQuantity) : formatNumber(ownedStock)}
                  </strong>
                  {marketMode === 'beli' && saleQuantity === 0 && (
                    <span className="rr-empty-label">(Belum Ada Penjual)</span>
                  )}
                </div>

                {/* Kolom 3: Price/Unit + Ikon Koin Hijau */}
                <div className="rr-cell rr-col-price">
                  {marketMode === 'beli' ? (
                    <div className="rr-price-box">
                      <div className="rr-chart-icon-box">
                        <TrendingUp size={16} />
                      </div>
                      <span className="rr-price-value">
                        {unitPrice}
                      </span>
                      <div className="rr-green-coin">
                        <div className="rr-coin-inner"></div>
                      </div>
                    </div>
                  ) : (
                    /* Mode Jual: Pemain dapat mengatur harga satuan sendiri */
                    <div className="rr-price-input-box" title="Klik untuk mengubah harga per unit yang ingin Anda jual">
                      <input 
                        type="number"
                        step="0.1"
                        min="0.1"
                        className="rr-price-input"
                        placeholder={item.basePrice}
                        value={currentPriceInput}
                        onChange={(e) => handlePriceChange(item.id, e.target.value)}
                      />
                      <div className="rr-green-coin">
                        <div className="rr-coin-inner"></div>
                      </div>
                    </div>
                  )}
                </div>

                {/* Kolom 4: Input Jumlah (Unit yang mau dijual atau dibeli) */}
                <div className="rr-cell rr-col-input">
                  <input 
                    type="number"
                    min="1"
                    max={marketMode === 'jual' ? ownedStock : undefined}
                    className="rr-amount-input"
                    placeholder="0"
                    value={quantities[item.id] || ''}
                    onChange={(e) => handleQtyChange(item.id, e.target.value)}
                    title={marketMode === 'jual' ? `Maksimal: ${ownedStock} ${item.unit}` : 'Jumlah yang ingin dibeli'}
                  />
                </div>

                {/* Kolom 5: Tombol Beli / Jual Hijau */}
                <div className="rr-cell rr-col-action">
                  {marketMode === 'beli' ? (
                    <button 
                      className={`rr-action-green-btn ${saleQuantity === 0 ? 'disabled' : ''}`}
                      onClick={() => handleBuy(item)}
                      disabled={saleQuantity === 0}
                      title={saleQuantity === 0 ? 'Belum ada pemain yang menjual barang ini' : 'Beli dari penawaran pemain'}
                    >
                      Beli
                    </button>
                  ) : (
                    <button 
                      className={`rr-action-green-btn btn-sell-action ${ownedStock <= 0 ? 'disabled' : ''}`}
                      onClick={() => handleSell(item)}
                      disabled={ownedStock <= 0}
                      title={ownedStock <= 0 ? 'Stok gudang Anda kosong' : `Jual ${quantities[item.id] || 0}x ${item.name} seharga @${currentPriceInput}`}
                    >
                      Jual
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
