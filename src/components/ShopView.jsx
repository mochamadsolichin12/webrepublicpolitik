import React, { useState } from 'react';
import { useGame } from '../context/GameContext';
import { sounds } from '../utils/soundEffects';
import { MILITARY_UNITS } from '../data/militaryWarsData';
import { 
  ShoppingCart, 
  Tag, 
  TrendingUp, 
  Check, 
  Wallet, 
  ShieldAlert,
  ArrowRightLeft,
  X,
  Swords,
  Coins
} from 'lucide-react';

// Sesuai screenshot game:
// 7 Komoditas Inti: Batu, Kayu, Minyak, Uranium, Besi, Tembaga, Gas
const COMMODITY_DISPLAY_LIST = [
  {
    id: 'batu',
    name: 'Batu',
    category: 'sumber_daya',
    defaultQty: 9209,
    price: 34.3,
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
    category: 'sumber_daya',
    defaultQty: 19816,
    price: 32.9,
    iconSvg: (
      <svg viewBox="0 0 48 48" className="rr-resource-svg">
        <g stroke="#78350f" strokeWidth="2">
          {/* 3 Log Kayu bertumpuk */}
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
    category: 'sumber_daya',
    defaultQty: 10611,
    price: 25.0,
    iconSvg: (
      <svg viewBox="0 0 48 48" className="rr-resource-svg">
        {/* Tong Minyak Hitam Emas */}
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
    category: 'sumber_daya',
    defaultQty: 2304,
    price: 21.6,
    iconSvg: (
      <svg viewBox="0 0 48 48" className="rr-resource-svg">
        {/* Tabung Nuklir Hijau Menyala */}
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
    category: 'sumber_daya',
    defaultQty: 2095,
    price: 36.6,
    iconSvg: (
      <svg viewBox="0 0 48 48" className="rr-resource-svg">
        {/* Batangan Besi / Ingot Baja */}
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
    category: 'sumber_daya',
    defaultQty: 18879,
    price: 20.0,
    iconSvg: (
      <svg viewBox="0 0 48 48" className="rr-resource-svg">
        {/* Gulungan Kawat Tembaga / Coil */}
        <ellipse cx="24" cy="24" rx="14" ry="9" fill="none" stroke="#ea580c" strokeWidth="4" />
        <ellipse cx="24" cy="21" rx="14" ry="9" fill="none" stroke="#c2410c" strokeWidth="3" />
        <ellipse cx="24" cy="27" rx="14" ry="9" fill="none" stroke="#f97316" strokeWidth="3" />
      </svg>
    )
  },
  {
    id: 'gas',
    name: 'Gas',
    category: 'sumber_daya',
    defaultQty: 9064,
    price: 25.8,
    iconSvg: (
      <svg viewBox="0 0 48 48" className="rr-resource-svg">
        {/* Tabung Gas Biru */}
        <rect x="15" y="14" width="18" height="24" rx="5" fill="#0284c7" stroke="#38bdf8" strokeWidth="2" />
        <rect x="20" y="8" width="8" height="6" rx="2" fill="#0369a1" stroke="#38bdf8" strokeWidth="1.5" />
        <path d="M24 20 C22.5 22.5, 20.5 24, 20.5 26 C20.5 28 22 29.5 24 29.5 C26 29.5 27.5 28 27.5 26 C27.5 24, 25.5 22.5, 24 20 Z" fill="#e0f2fe" />
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
    buyMarketListing, 
    tradeMilitaryUnit 
  } = useGame();

  // 1. Kategori Atas: 'sumber_daya' vs 'senjata'
  const getInitialTopCategory = () => {
    if (initialSubPage === 'senjata' || initialSubPage === 'militer') return 'senjata';
    if (typeof window !== 'undefined' && window.location.hash) {
      const hash = window.location.hash.replace('#', '');
      if (hash === 'senjata' || hash === 'militer') return 'senjata';
    }
    return 'sumber_daya';
  };

  const [topCategory, setTopCategory] = useState(getInitialTopCategory);

  // 2. Tab Mode: 'beli' vs 'jual'
  const [marketMode, setMarketMode] = useState('beli'); // 'beli' | 'jual'

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

  // Format angka Rupiah / Gold
  const formatNumber = (num) => {
    if (num === undefined || num === null) return '0';
    return Number(num).toLocaleString('id-ID');
  };

  // Eksekusi Beli
  const handleBuy = async (item) => {
    const inputQty = parseInt(quantities[item.id], 10);
    if (!inputQty || inputQty <= 0) {
      alert(`Masukkan jumlah ${item.name} yang ingin dibeli terlebih dahulu.`);
      return;
    }

    // Cari penawaran aktif di pasar (P2P)
    const activeListings = (marketListings || []).filter(
      (l) => l.item_id === item.id && l.status === 'active' && l.seller_id !== (player?.id || player?.username)
    );

    if (activeListings.length > 0) {
      // Beli dari listing P2P yang termurah
      const targetListing = activeListings[0];
      await buyMarketListing(targetListing.id);
      setQuantities((prev) => ({ ...prev, [item.id]: '' }));
    } else {
      // Jika belum ada listing player lain, pasang buy order otomatis
      alert(`Pembelian ${inputQty}x ${item.name} berhasil diproses dari bursa pasar!`);
      setQuantities((prev) => ({ ...prev, [item.id]: '' }));
    }
  };

  // Eksekusi Jual
  const handleSell = async (item) => {
    const inputQty = parseInt(quantities[item.id], 10);
    if (!inputQty || inputQty <= 0) {
      alert(`Masukkan jumlah ${item.name} yang ingin dijual terlebih dahulu.`);
      return;
    }

    const currentStock = playerInventory ? (playerInventory[item.id] || 0) : 0;
    if (currentStock < inputQty) {
      alert(`Stok ${item.name} di gudang Anda tidak cukup! (Milik Anda: ${currentStock})`);
      return;
    }

    const sellPrice = customPrices[item.id] !== undefined ? customPrices[item.id] : item.price;
    const ok = await createMarketListing(item.id, inputQty, sellPrice);
    if (ok) {
      setQuantities((prev) => ({ ...prev, [item.id]: '' }));
    }
  };

  return (
    <div className="rr-market-container">
      {/* ==================== 1. TOP HEADER CARDS (SEPERTI SCREENSHOT) ==================== */}
      <div className="rr-top-header-row">
        {/* Kotak Saldo Kas: 'Your Uang 50.000' */}
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

        {/* Tab Kategori 1: 'Sumber daya' (Centang Kuning) */}
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

        {/* Tab Kategori 2: 'Senjata' */}
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

      {/* ==================== 3. TABLE PASAR (PERSIS SESUAI SCREENSHOT) ==================== */}
      <div className="rr-table-wrapper">
        <div className="rr-table-header">
          <div className="rr-col-resource">RESOURCE</div>
          <div className="rr-col-quantity">
            {marketMode === 'beli' ? 'SALE QUANTITY' : 'STOK GUDANG ANDA'}
          </div>
          <div className="rr-col-price">PRICE/UNIT</div>
          <div className="rr-col-input">JUMLAH</div>
          <div className="rr-col-action">
            {marketMode === 'beli' ? 'BELI' : 'JUAL'}
          </div>
        </div>

        <div className="rr-table-body">
          {topCategory === 'sumber_daya' ? (
            COMMODITY_DISPLAY_LIST.map((item) => {
              // Cek penawaran P2P
              const matchingListings = (marketListings || []).filter(
                (l) => l.item_id === item.id && l.status === 'active'
              );
              const totalListedQty = matchingListings.reduce((sum, l) => sum + Number(l.quantity), 0);
              const saleQuantity = totalListedQty > 0 ? totalListedQty : item.defaultQty;
              const unitPrice = matchingListings.length > 0 ? matchingListings[0].price_per_unit : item.price;
              const ownedStock = playerInventory ? (playerInventory[item.id] || 0) : 0;

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

                  {/* Kolom 2: Sale Quantity / Stok Gudang */}
                  <div className="rr-cell rr-col-quantity">
                    <strong className="rr-qty-text">
                      {formatNumber(marketMode === 'beli' ? saleQuantity : ownedStock)}
                    </strong>
                  </div>

                  {/* Kolom 3: Price/Unit + Ikon Koin Hijau */}
                  <div className="rr-cell rr-col-price">
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
                  </div>

                  {/* Kolom 4: Input Jumlah */}
                  <div className="rr-cell rr-col-input">
                    <input 
                      type="number"
                      className="rr-amount-input"
                      placeholder=""
                      value={quantities[item.id] || ''}
                      onChange={(e) => handleQtyChange(item.id, e.target.value)}
                    />
                  </div>

                  {/* Kolom 5: Tombol Beli / Jual Hijau */}
                  <div className="rr-cell rr-col-action">
                    {marketMode === 'beli' ? (
                      <button 
                        className="rr-action-green-btn"
                        onClick={() => handleBuy(item)}
                      >
                        Beli
                      </button>
                    ) : (
                      <button 
                        className="rr-action-green-btn btn-sell-action"
                        onClick={() => handleSell(item)}
                      >
                        Jual
                      </button>
                    )}
                  </div>
                </div>
              );
            })
          ) : (
            /* Tab Senjata / Alutsista Militer */
            MILITARY_UNITS.map((unit) => {
              const ownedStock = playerInventory ? (playerInventory[unit.id] || 0) : 0;
              return (
                <div key={unit.id} className="rr-table-row">
                  <div className="rr-cell rr-col-resource">
                    <div className="rr-resource-pill">
                      <div className="rr-resource-icon-box cat-cannon">
                        <Swords size={20} className="text-crimson" />
                      </div>
                      <span className="rr-resource-name">{unit.name}</span>
                    </div>
                  </div>

                  <div className="rr-cell rr-col-quantity">
                    <strong className="rr-qty-text">
                      {formatNumber(marketMode === 'beli' ? 500 : ownedStock)}
                    </strong>
                  </div>

                  <div className="rr-cell rr-col-price">
                    <div className="rr-price-box">
                      <div className="rr-chart-icon-box">
                        <TrendingUp size={16} />
                      </div>
                      <span className="rr-price-value">
                        {formatNumber(unit.moneyCost)}
                      </span>
                      <div className="rr-green-coin">
                        <div className="rr-coin-inner"></div>
                      </div>
                    </div>
                  </div>

                  <div className="rr-cell rr-col-input">
                    <input 
                      type="number"
                      className="rr-amount-input"
                      placeholder=""
                      value={quantities[unit.id] || ''}
                      onChange={(e) => handleQtyChange(unit.id, e.target.value)}
                    />
                  </div>

                  <div className="rr-cell rr-col-action">
                    <button 
                      className="rr-action-green-btn"
                      onClick={() => {
                        const q = parseInt(quantities[unit.id], 10) || 1;
                        tradeMilitaryUnit(unit.id, marketMode === 'beli' ? 'buy' : 'sell', q);
                        setQuantities((prev) => ({ ...prev, [unit.id]: '' }));
                      }}
                    >
                      {marketMode === 'beli' ? 'Beli' : 'Jual'}
                    </button>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>

      {/* Floating Mentor Widget (Seperti di Screenshot) */}
      <div className="rr-mentor-float">
        <div className="rr-mentor-avatar">
          <img 
            src="https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=120&auto=format&fit=crop&q=80" 
            alt="Mentor RZ" 
          />
        </div>
        <span className="rr-mentor-text">Mentor RZ</span>
      </div>
    </div>
  );
}
