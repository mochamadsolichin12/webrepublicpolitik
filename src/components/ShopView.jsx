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

export default function ShopView() {
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
  const [activeMarketPage, setActiveMarketPage] = useState('perbekalan');
  
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

  return (
    <div className="shop-viewport">
      {/* 1. HERO HEADER PASAR LOKAL */}
      <div className="shop-hero-card glass-panel-gold">
        <div className="sh-left">
          <div className="sh-badge">
            <Store size={16} />
            <span>Sentra Niaga Nusantara</span>
          </div>
          <h2 className="sh-title">Pasar Lokal Republik</h2>
          <p className="sh-desc">
            Pusat bursa perdagangan nasional berdaulat. Akses pasar perbekalan logistik, 
            jual beli komoditas sumber daya strategis rakyat, serta pengadaan alutsista pertahanan negara.
          </p>
        </div>

        {/* Player Financial Balance Widget */}
        <div className="sh-balance-box glass-panel">
          <div className="sbb-header">
            <span className="sbb-label">Saldo Keuangan Warga</span>
            <Sparkles size={16} className="text-gold" />
          </div>
          <div className="sbb-stats">
            <div className="sbb-stat-item">
              <span className="sbb-item-title">Kas Tunai (Rupiah)</span>
              <strong className="text-emerald">{formatRupiah(player?.money || 0)}</strong>
            </div>
            <div className="sbb-stat-item">
              <span className="sbb-item-title">Cadangan Devisa Emas</span>
              <strong className="text-gold">{player?.gold || 0} Batang Emas</strong>
            </div>
            <div className="sbb-stat-item">
              <span className="sbb-item-title">Stamina Fisik</span>
              <strong className="text-cyan">{player?.energy ?? 100} / {player?.maxEnergy ?? 100} ⚡</strong>
            </div>
          </div>
        </div>
      </div>

      {/* 2. 4 TAB UTAMA PASAR LOKAL */}
      <div className="market-main-tabs">
        <button
          className={`market-tab-btn ${activeMarketPage === 'perbekalan' ? 'active' : ''}`}
          onClick={() => { sounds.playClick(); setActiveMarketPage('perbekalan'); }}
        >
          <ShoppingBag size={17} />
          <span>1. Perbekalan & Suplemen</span>
        </button>

        <button
          className={`market-tab-btn ${activeMarketPage === 'komoditas_beli' ? 'active' : ''}`}
          onClick={() => { sounds.playClick(); setActiveMarketPage('komoditas_beli'); }}
        >
          <Boxes size={17} />
          <span>2. Beli Sumber Daya</span>
        </button>

        <button
          className={`market-tab-btn ${activeMarketPage === 'komoditas_jual' ? 'active' : ''}`}
          onClick={() => { sounds.playClick(); setActiveMarketPage('komoditas_jual'); }}
        >
          <DollarSign size={17} />
          <span>3. Jual Sumber Daya</span>
        </button>

        <button
          className={`market-tab-btn ${activeMarketPage === 'militer' ? 'active' : ''}`}
          onClick={() => { sounds.playClick(); setActiveMarketPage('militer'); }}
        >
          <Swords size={17} />
          <span>4. Jual Beli Militer</span>
        </button>
      </div>

      {/* ==================== HALAMAN 1: PERBEKALAN & SUPLEMEN ==================== */}
      {activeMarketPage === 'perbekalan' && (
        <div className="market-page-section">
          <div className="mps-header">
            <h3 className="mps-title"><ShoppingBag size={20} className="text-gold" /> Logistik, Suplemen & Aset Kenegaraan</h3>
            <p className="mps-sub">Dapatkan makanan penambah stamina, perlengkapan intelijen, lisensi usaha, dan konversi devisa batangan emas.</p>
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
          <div className="mps-header">
            <h3 className="mps-title"><Boxes size={20} className="text-cyan" /> Pengadaan & Pembelian Sumber Daya Alam</h3>
            <p className="mps-sub">Beli bahan baku strategis (Minyak Mentah, Nikel, CPO, Batubara, Emas, Beras) langsung dari bursa komoditas nasional.</p>
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
          <div className="mps-header">
            <h3 className="mps-title"><DollarSign size={20} className="text-emerald" /> Penjualan Hasil Tambang & Komoditas</h3>
            <p className="mps-sub">Jual stok hasil kerja pabrik dan tambang Anda ke pasar terbuka untuk mencairkan keuntungan kas Rupiah instan.</p>
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
          <div className="mps-header">
            <h3 className="mps-title"><Swords size={20} className="text-crimson" /> Pengadaan & Penjualan Alutsista Militer</h3>
            <p className="mps-sub">Beli batalyon infantri, tank Leopard, jet tempur, kapal perang frigat, dan rudal taktis untuk pertahanan front perang regional.</p>
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
