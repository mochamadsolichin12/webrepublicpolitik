import React, { useState } from 'react';
import { 
  Crown, 
  Sparkles, 
  Coins, 
  CalendarCheck, 
  ShieldCheck, 
  Zap, 
  Flame, 
  CheckCircle2, 
  Star, 
  Award,
  Wallet
} from 'lucide-react';
import { useGame } from '../context/GameContext';
import { sounds } from '../utils/soundEffects';

export default function GrandMarketView() {
  const { player, buyGrandMarketItem } = useGame();
  const [activeTab, setActiveTab] = useState('all'); // 'all' | 'membership' | 'gold' | 'subscription'

  // Format Angka Rupiah
  const formatRp = (num) => {
    if (!num) return '0';
    return Number(num).toLocaleString('id-ID');
  };

  const handlePurchase = async (item) => {
    await buyGrandMarketItem(item);
  };

  // Data Katalog Pasar Agung Kerajaan
  const GRAND_PRODUCTS = [
    {
      id: 'prod-prem-30',
      name: 'Akun Premium (30 Hari)',
      subtitle: 'Akses Keistimewaan Warga Kehormatan',
      category: 'membership',
      type: 'premium',
      durationDays: 30,
      priceRp: 150000000, // Rp 150 Juta
      priceGold: 0,
      badge: 'POPULAR',
      badgeClass: 'badge-gold',
      gradient: 'linear-gradient(135deg, #1e293b, #0f172a)',
      borderColor: '#f59e0b',
      icon: Crown,
      iconColor: '#fbbf24',
      features: [
        'Kapasitas Energi 2x Lipat (200 Energi Maksimal)',
        'Kecepatan Upgrade Skill/Perk 1,5% Lebih Cepat',
        'Bebas Kuota Batas Voting RUU Parlemen',
        'Prioritas Antrean Kerja di Pabrik Strategis',
        'Badge Khusus Mahkota Emas pada Profil & Obrolan',
        '+1.000 EXP Karir Politik Langsung'
      ],
      benefitText: 'Status Premium Aktif! Energi Maksimal kini 200 & Upgrade Perk 1,5% Lebih Cepat!'
    },
    {
      id: 'prod-prem-plus-30',
      name: 'Akun Premium Plus (30 Hari)',
      subtitle: 'Kasta Elit Tertinggi Para Negarawan',
      category: 'membership',
      type: 'premium_plus',
      durationDays: 30,
      priceRp: 350000000, // Rp 350 Juta
      priceGold: 0,
      badge: 'ELITE VIP',
      badgeClass: 'badge-purple',
      gradient: 'linear-gradient(135deg, #2e1065, #0f172a)',
      borderColor: '#a855f7',
      icon: Sparkles,
      iconColor: '#c084fc',
      features: [
        'Semua Benefit Akun Premium Standar',
        'Regenerasi Energi Instan Maksimal +100%',
        'Diskon Pajak Transaksi Bursa Pasar sebesar 50%',
        'Hak Veto Suara Bobot 2x Lipat pada Pemilu Partai',
        'Bingkai Avatar Eksklusif Ungu Berkilau',
        '+2.500 EXP Karir Politik Langsung'
      ],
      benefitText: 'Status VIP Premium Plus Aktif selama 30 Hari!'
    },
    {
      id: 'prod-sub-monthly',
      name: 'Paket Langganan Bulanan',
      subtitle: 'Paket Langganan Otomatis Bulanan',
      category: 'subscription',
      type: 'subscription_monthly',
      durationDays: 30,
      monthlyGoldBonus: 50,
      priceRp: 250000000, // Rp 250 Juta
      priceGold: 0,
      badge: 'BEST VALUE',
      badgeClass: 'badge-emerald',
      gradient: 'linear-gradient(135deg, #064e3b, #0f172a)',
      borderColor: '#10b981',
      icon: CalendarCheck,
      iconColor: '#34d399',
      features: [
        'Langganan Status Premium Aktif Setiap Bulan',
        'Bonus Pasokan Bulanan: +50 Batang Cadangan Emas',
        'Gaji Kerja Harian Tambahan +25% Otomatis',
        'Dukungan Fasilitas Rumah Dinas Kepresidenan',
        '+1.500 EXP Karir Politik'
      ],
      benefitText: 'Langganan Bulanan Aktif & Menerima +50 Batang Emas!'
    },
    {
      id: 'prod-gold-small',
      name: 'Peti Emas Devisa (25 Batang)',
      subtitle: 'Likuiditas Cadangan Moneter Negara',
      category: 'gold',
      type: 'gold_pack',
      goldAmount: 25,
      priceRp: 75000000, // Rp 75 Juta
      priceGold: 0,
      badge: 'MONETER',
      badgeClass: 'badge-amber',
      gradient: 'linear-gradient(135deg, #451a03, #0f172a)',
      borderColor: '#d97706',
      icon: Coins,
      iconColor: '#f59e0b',
      features: [
        '+25 Batang Emas Murni 24K ke Brankas Pribadi',
        'Dapat Digunakan untuk Mendirikan Partai Politik Baru',
        'Dapat Digunakan untuk Membeli Alutsista Tingkat Tinggi',
        'Kebal Terhadap Inflasi Rupiah'
      ],
      benefitText: '+25 Batang Emas Masuk ke Brankas Anda!'
    },
    {
      id: 'prod-gold-medium',
      name: 'Gudang Emas Sentral (100 Batang)',
      subtitle: 'Kekayaan Fiskal Skala Konglomerat',
      category: 'gold',
      type: 'gold_pack',
      goldAmount: 100,
      priceRp: 250000000, // Rp 250 Juta
      priceGold: 0,
      badge: 'HEMAT 20%',
      badgeClass: 'badge-gold',
      gradient: 'linear-gradient(135deg, #78350f, #0f172a)',
      borderColor: '#fbbf24',
      icon: Coins,
      iconColor: '#fde047',
      features: [
        '+100 Batang Emas Murni ke Brankas Pribadi',
        'Dapat Mendanai Kampanye Pemilu Presiden Nasional',
        'Investasi Aset Paling Likuid di Seluruh Provinsi',
        '+500 EXP Negarawan'
      ],
      benefitText: '+100 Batang Emas Masuk ke Brankas Anda!'
    },
    {
      id: 'prod-gold-large',
      name: 'Cadangan Emas Kerajaan (250 Batang)',
      subtitle: 'Pondasi Moneter Penguasa Negara',
      category: 'gold',
      type: 'gold_pack',
      goldAmount: 250,
      priceRp: 550000000, // Rp 550 Juta
      priceGold: 0,
      badge: 'SULTAN PACK',
      badgeClass: 'badge-purple',
      gradient: 'linear-gradient(135deg, #581c87, #0f172a)',
      borderColor: '#c084fc',
      icon: Flame,
      iconColor: '#e879f9',
      features: [
        '+250 Batang Emas Murni ke Brankas Pribadi',
        'Mampu Membangun Pangkalan Militer Megah',
        'Membeli Skadron Tempur & Kapal Frigat Terbesar',
        '+1.000 EXP Negarawan'
      ],
      benefitText: '+250 Batang Emas Masuk ke Brankas Anda!'
    }
  ];

  const filteredProducts = activeTab === 'all' 
    ? GRAND_PRODUCTS 
    : GRAND_PRODUCTS.filter((p) => p.category === activeTab);

  // Status Keanggotaan Pemain Saat Ini
  const currentTier = player?.premiumTier || 'none';
  const hasActiveSub = currentTier !== 'none';
  const formattedUntil = player?.premiumUntil 
    ? new Date(player.premiumUntil).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' }) 
    : 'Tidak Aktif';

  return (
    <div className="grand-market-container">
      {/* ==================== 1. HERO HEADER: PASAR AGUNG ==================== */}
      <div className="grand-market-hero">
        <div className="gm-hero-glow"></div>
        <div className="gm-hero-content">
          <div className="gm-badge-top">
            <Crown size={16} className="text-amber-400" />
            <span>KHAZANAH KERAJAAN & KEHORMATAN</span>
          </div>
          <h1 className="gm-hero-title">PASAR AGUNG REPUBLIK</h1>
          <p className="gm-hero-desc">
            Bursa kehormatan nasional untuk peningkatan status kedaulatan: Akun Premium, Akun Premium Plus, cadangan devisa Emas Batangan, dan Langganan Bulanan para Negarawan.
          </p>

          {/* Kartu Status Pemain Saat Ini */}
          <div className="gm-status-bar">
            <div className="gm-stat-pill">
              <span className="gm-pill-label">Status Anggota</span>
              <div className="gm-pill-val">
                {currentTier === 'premium_plus' && <span className="tier-badge tier-plus">👑 Premium Plus</span>}
                {currentTier === 'premium' && <span className="tier-badge tier-reg">⭐ Premium</span>}
                {currentTier === 'none' && <span className="tier-badge tier-none">Warga Biasa</span>}
              </div>
            </div>

            <div className="gm-stat-pill">
              <span className="gm-pill-label">Masa Berlaku</span>
              <span className="gm-pill-val-text">{hasActiveSub ? formattedUntil : 'Belum Berlangganan'}</span>
            </div>

            <div className="gm-stat-pill">
              <span className="gm-pill-label">Kas Uang Anda</span>
              <div className="gm-pill-money">
                <Wallet size={15} className="text-emerald-400" />
                <span>Rp {formatRp(player?.money || 0)}</span>
              </div>
            </div>

            <div className="gm-stat-pill">
              <span className="gm-pill-label">Cadangan Emas Anda</span>
              <div className="gm-pill-gold">
                <Coins size={15} className="text-amber-400" />
                <span>{player?.gold || 0} Batang</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ==================== 2. FILTER TABS ==================== */}
      <div className="gm-filter-nav">
        <button 
          className={`gm-filter-btn ${activeTab === 'all' ? 'active' : ''}`}
          onClick={() => { sounds.playClick(); setActiveTab('all'); }}
        >
          <Award size={16} />
          <span>Semua Penawaran</span>
        </button>
        <button 
          className={`gm-filter-btn ${activeTab === 'membership' ? 'active' : ''}`}
          onClick={() => { sounds.playClick(); setActiveTab('membership'); }}
        >
          <Crown size={16} />
          <span>Keanggotaan Premium</span>
        </button>
        <button 
          className={`gm-filter-btn ${activeTab === 'subscription' ? 'active' : ''}`}
          onClick={() => { sounds.playClick(); setActiveTab('subscription'); }}
        >
          <CalendarCheck size={16} />
          <span>Langganan Bulanan</span>
        </button>
        <button 
          className={`gm-filter-btn ${activeTab === 'gold' ? 'active' : ''}`}
          onClick={() => { sounds.playClick(); setActiveTab('gold'); }}
        >
          <Coins size={16} />
          <span>Cadangan Emas</span>
        </button>
      </div>

      {/* ==================== 3. PRODUCT CARDS GRID ==================== */}
      <div className="gm-products-grid">
        {filteredProducts.map((prod) => {
          const IconComp = prod.icon;
          const isAffordable = (player?.money || 0) >= prod.priceRp;

          return (
            <div 
              key={prod.id} 
              className="gm-product-card"
              style={{
                background: prod.gradient,
                borderColor: prod.borderColor
              }}
            >
              <div className="gm-card-header">
                <div className="gm-card-icon-box" style={{ borderColor: prod.borderColor }}>
                  <IconComp size={28} color={prod.iconColor} />
                </div>
                <div className="gm-card-badge-wrap">
                  <span className={`gm-card-badge ${prod.badgeClass}`}>{prod.badge}</span>
                </div>
              </div>

              <div className="gm-card-body">
                <h3 className="gm-card-title">{prod.name}</h3>
                <p className="gm-card-subtitle">{prod.subtitle}</p>

                {/* Harga Produk */}
                <div className="gm-price-tag">
                  <span className="gm-price-currency">Rp</span>
                  <span className="gm-price-amount">{formatRp(prod.priceRp)}</span>
                </div>

                {/* Daftar Keunggulan & Benefit */}
                <ul className="gm-features-list">
                  {prod.features.map((feat, idx) => (
                    <li key={idx} className="gm-feature-item">
                      <CheckCircle2 size={16} className="text-emerald-400 shrink-0" />
                      <span>{feat}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="gm-card-footer">
                <button 
                  className={`gm-buy-btn ${!isAffordable ? 'disabled' : ''}`}
                  onClick={() => handlePurchase(prod)}
                  disabled={!isAffordable}
                >
                  {isAffordable ? (
                    <>
                      <Zap size={16} />
                      <span>Aktivasi Sekarang</span>
                    </>
                  ) : (
                    <span>Kas Tidak Cukup</span>
                  )}
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Info Tambahan Jaminan */}
      <div className="gm-assurance-box">
        <div className="gm-assure-item">
          <ShieldCheck size={24} className="text-emerald-400" />
          <div>
            <h4>Kedaulatan & Keamanan Transaksi</h4>
            <p>Seluruh aset tersimpan aman di database PostgreSQL Supabase dengan perlindungan enkripsi.</p>
          </div>
        </div>
        <div className="gm-assure-item">
          <Coins size={24} className="text-amber-400" />
          <div>
            <h4>Cadangan Emas Bebas Likuidasi</h4>
            <p>Emas batangan dapat digunakan kapan saja untuk pembentukan aliansi, partai politik, atau pembelian komoditas.</p>
          </div>
        </div>
      </div>
    </div>
  );
}
