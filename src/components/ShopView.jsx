import React, { useState } from 'react';
import { useGame } from '../context/GameContext';
import { sounds } from '../utils/soundEffects';
import { SHOP_ITEMS, SHOP_CATEGORIES } from '../data/shopData';
import { 
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
  Check, 
  Sparkles,
  Package,
  Layers,
  ArrowRight
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
  Building
};

export default function ShopView() {
  const { player, playerInventory, buyShopItem, showToast } = useGame();
  const [activeCategory, setActiveCategory] = useState('all');
  const [purchasingId, setPurchasingId] = useState(null);

  const formatRupiah = (val) => {
    if (!val || val === 0) return 'Gratis';
    if (val >= 1e9) return `Rp ${(val / 1e9).toFixed(1)} Miliar`;
    if (val >= 1e6) return `Rp ${(val / 1e6).toFixed(1)} Juta`;
    return `Rp ${Number(val).toLocaleString('id-ID')}`;
  };

  const filteredItems = SHOP_ITEMS.filter((item) => {
    if (activeCategory === 'all') return true;
    return item.category === activeCategory;
  });

  const handlePurchase = async (item) => {
    setPurchasingId(item.id);
    const success = buyShopItem(item);
    setTimeout(() => {
      setPurchasingId(null);
    }, 400);
  };

  return (
    <div className="shop-viewport">
      {/* 1. HERO HEADER */}
      <div className="shop-hero-card glass-panel-gold">
        <div className="sh-left">
          <div className="sh-badge">
            <ShoppingBag size={16} />
            <span>Toko Logistik & Lisensi Negara</span>
          </div>
          <h2 className="sh-title">Pasar Perlengkapan & Aset Strategis</h2>
          <p className="sh-desc">
            Pusat perbekalan politisi, armada tempur militer, lisensi konsesi tambang, serta konversi devisa batangan emas. 
            Tingkatkan kesiapan fisik dan dominasi geopolitik Anda di seluruh nusantara.
          </p>
        </div>

        {/* Player Financial Balance Widget */}
        <div className="sh-balance-box glass-panel">
          <div className="sbb-header">
            <span className="sbb-label">Saldo Keuangan Anda</span>
            <Sparkles size={16} className="text-gold" />
          </div>
          <div className="sbb-stats">
            <div className="sbb-stat-item">
              <span className="sbb-item-title">Kas Pribadi (Rupiah)</span>
              <strong className="text-emerald">{formatRupiah(player?.money || 0)}</strong>
            </div>
            <div className="sbb-stat-item">
              <span className="sbb-item-title">Devisa Batangan Emas</span>
              <strong className="text-gold">{player?.gold || 0} Batang Emas</strong>
            </div>
            <div className="sbb-stat-item">
              <span className="sbb-item-title">Stamina Saat Ini</span>
              <strong className="text-cyan">{player?.energy ?? 100} / {player?.maxEnergy ?? 100} ⚡</strong>
            </div>
          </div>
        </div>
      </div>

      {/* 2. CATEGORY FILTER TABS */}
      <div className="shop-category-tabs">
        {SHOP_CATEGORIES.map((cat) => (
          <button
            key={cat.id}
            className={`shop-cat-btn ${activeCategory === cat.id ? 'active' : ''}`}
            onClick={() => {
              sounds.playClick();
              setActiveCategory(cat.id);
            }}
          >
            {cat.label}
          </button>
        ))}
      </div>

      {/* 3. ITEMS CATALOG GRID */}
      <div className="shop-items-grid">
        {filteredItems.map((item) => {
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
                  {item.priceRp === 0 && item.priceGold === 0 && (
                    <span className="sic-free-tag">Gratis</span>
                  )}
                </div>
              </div>

              <button
                className={`sic-buy-btn ${!canAfford || (isEnergyFull && item.type.includes('energy')) ? 'disabled' : ''}`}
                onClick={() => handlePurchase(item)}
                disabled={!canAfford || isBuying || (isEnergyFull && item.type.includes('energy'))}
              >
                {isBuying ? (
                  <span>Memproses...</span>
                ) : isEnergyFull && item.type.includes('energy') ? (
                  <span>Stamina Sudah Penuh</span>
                ) : !canAfford ? (
                  <span>Saldo Kurang</span>
                ) : (
                  <>
                    <ShoppingBag size={15} />
                    <span>Beli Sekarang</span>
                  </>
                )}
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );
}
