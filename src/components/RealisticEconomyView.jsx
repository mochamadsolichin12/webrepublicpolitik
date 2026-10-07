import React, { useState } from 'react';
import { useGame } from '../context/GameContext';
import { sounds } from '../utils/soundEffects';
import { navigateToPage } from '../utils/navigation';
import { INDUSTRIAL_FACILITIES } from '../data/economyData';
import { 
  TrendingUp, 
  TrendingDown, 
  Coins, 
  Fuel, 
  Layers, 
  Sprout, 
  Boxes, 
  Sparkles, 
  Wheat, 
  Building2, 
  Factory, 
  ArrowUpRight, 
  ArrowDownRight, 
  DollarSign, 
  Percent, 
  Package, 
  BarChart3, 
  ShoppingBag, 
  Send, 
  RefreshCw,
  Globe,
  PieChart,
  HelpCircle,
  Plus
} from 'lucide-react';

export default function RealisticEconomyView() {
  const { 
    player, 
    commodities, 
    macroEconomy, 
    playerInventory, 
    playerFactories, 
    tradeCommodity, 
    buildIndustrialFacility, 
    collectFactoryYield, 
    nationalState,
    setActiveTab, 
    showToast 
  } = useGame();

  const [activeSubTab, setActiveSubTab] = useState('commodities'); // 'commodities' | 'factories' | 'macro' | 'inventory'
  const [selectedCommodityId, setSelectedCommodityId] = useState(commodities[0]?.id || 'oil');
  const [tradeAction, setTradeAction] = useState('buy'); // 'buy' | 'sell'
  const [tradeQuantity, setTradeQuantity] = useState(1);

  const selectedComm = commodities.find((c) => c.id === selectedCommodityId) || commodities[0];
  const userStock = playerInventory[selectedComm.id] || 0;

  const formatRupiah = (val) => {
    if (val >= 1e12) return `$RP ${(val / 1e12).toFixed(2)} Triliun`;
    if (val >= 1e9) return `$RP ${(val / 1e9).toFixed(2)} Miliar`;
    if (val >= 1e6) return `$RP ${(val / 1e6).toFixed(1)} Juta`;
    return `$RP ${(val || 0).toLocaleString('id-ID')}`;
  };

  const formatUsd = (val) => {
    if (val >= 1e9) return `$${(val / 1e9).toFixed(2)} Miliar`;
    return `$${(val || 0).toLocaleString('en-US')}`;
  };

  const getCommodityIcon = (id) => {
    switch (id) {
      case 'oil': return Fuel;
      case 'nickel': return Layers;
      case 'cpo': return Sprout;
      case 'coal': return Boxes;
      case 'gold_bullion': return Sparkles;
      case 'rice': return Wheat;
      default: return Coins;
    }
  };

  const handleExecuteTrade = () => {
    tradeCommodity(selectedComm.id, tradeAction, tradeQuantity);
  };

  return (
    <div className="realistic-economy-viewport">
      {/* 1. HERO BANNER MAKROEKONOMI NASIONAL */}
      <div className="economy-hero glass-panel-gold">
        <div className="eh-left">
          <div className="eh-badge">
            <Coins size={18} className="font-gold" />
            <span>SISTEM EKONOMI MAKRO, KOMODITAS & PASAR BEBAS REALISTIS</span>
          </div>
          <h2 className="eh-title">Bursa Komoditas & Industri Nasional</h2>
          <p className="eh-desc">
            Perdagangan komoditas dunia nyata (Minyak Mentah, Nikel Baterai EV, Sawit CPO, Batubara & Emas), indikator moneter Bank Indonesia (BI-Rate, Inflasi, Kurs USD), serta investasi pabrik hilirisasi.
          </p>
        </div>

        {/* Real-world Live Ticker Board */}
        <div className="macro-ticker-board glass-panel">
          <div className="mtb-item">
            <span className="mtb-label">BI-Rate Acuan:</span>
            <strong className="mtb-val text-cyan">{macroEconomy.biRate.toFixed(2)}%</strong>
          </div>
          <div className="mtb-item">
            <span className="mtb-label">Inflasi Tahunan:</span>
            <strong className="mtb-val text-emerald">{macroEconomy.inflationRate.toFixed(2)}%</strong>
          </div>
          <div className="mtb-item">
            <span className="mtb-label">Kurs USD / IDR:</span>
            <strong className="mtb-val text-gold">Rp {macroEconomy.exchangeRateUsd.toLocaleString('id-ID')}</strong>
          </div>
          <div className="mtb-item">
            <span className="mtb-label">Pertumbuhan PDB:</span>
            <strong className="mtb-val text-emerald">+{macroEconomy.gdpGrowthRate.toFixed(2)}%</strong>
          </div>
        </div>
      </div>

      {/* 2. SUBTABS NAVIGASI EKONOMI */}
      <div className="economy-subtabs-bar">
        <button 
          className={`eco-subtab-btn ${activeSubTab === 'commodities' ? 'active' : ''}`}
          onClick={() => { sounds.playClick(); setActiveSubTab('commodities'); }}
        >
          <BarChart3 size={16} />
          <span>Bursa Perdagangan Komoditas ({commodities.length})</span>
        </button>
        <button 
          className={`eco-subtab-btn ${activeSubTab === 'factories' ? 'active' : ''}`}
          onClick={() => { sounds.playClick(); setActiveSubTab('factories'); }}
        >
          <Factory size={16} />
          <span>Pabrik & Hilirisasi Industri ({playerFactories.length})</span>
        </button>
        <button 
          className={`eco-subtab-btn ${activeSubTab === 'inventory' ? 'active' : ''}`}
          onClick={() => { sounds.playClick(); setActiveSubTab('inventory'); }}
        >
          <Package size={16} />
          <span>Gudang Logistik Pribadi</span>
        </button>
        <button 
          className={`eco-subtab-btn ${activeSubTab === 'macro' ? 'active' : ''}`}
          onClick={() => { sounds.playClick(); setActiveSubTab('macro'); }}
        >
          <PieChart size={16} />
          <span>Indikator Makroekonomi Bank Sentral</span>
        </button>
      </div>

      {/* TAB 1: BURSA PERDAGANGAN KOMODITAS REALISTIS */}
      {activeSubTab === 'commodities' && (
        <div className="commodities-trading-grid">
          {/* Sisi Kiri: Daftar Harga Pasar Komoditas */}
          <div className="commodities-market-col">
            <h3 className="cmc-title">Harga Acuan Pasar Bebas (Real-Time)</h3>
            <div className="commodity-cards-list">
              {commodities.map((comm) => {
                const Icon = getCommodityIcon(comm.id);
                const isSelected = comm.id === selectedComm.id;
                const isPositive = comm.change24h >= 0;

                return (
                  <div 
                    key={comm.id}
                    className={`commodity-market-card ${isSelected ? 'selected' : ''}`}
                    onClick={() => { sounds.playClick(); setSelectedCommodityId(comm.id); }}
                  >
                    <div className="cmc-top">
                      <div className="cmc-icon-wrap" style={{ backgroundColor: `${comm.color}20`, color: comm.color }}>
                        <Icon size={20} />
                      </div>
                      <div className="cmc-head-info">
                        <strong className="cmc-name">{comm.name}</strong>
                        <span className="cmc-category">{comm.category} • Satuan: {comm.unit}</span>
                      </div>
                    </div>

                    <div className="cmc-price-row">
                      <div className="cmc-price-box">
                        <span className="cpb-label">HARGA SAAT INI:</span>
                        <strong className="cpb-val text-white">{formatRupiah(comm.currentPriceRp)}</strong>
                      </div>
                      <div className={`cmc-change-badge ${isPositive ? 'positive' : 'negative'}`}>
                        {isPositive ? <ArrowUpRight size={14} /> : <ArrowDownRight size={14} />}
                        <span>{isPositive ? `+${comm.change24h}%` : `${comm.change24h}%`}</span>
                      </div>
                    </div>

                    <div className="cmc-meta-row">
                      <span>Permintaan: <strong className="text-gold">{comm.worldDemand}</strong></span>
                      <span>Stok Anda: <strong className="text-cyan">{playerInventory[comm.id] || 0} {comm.unit}</strong></span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Sisi Kanan: Terminal Eksekusi Transaksi (Beli / Jual) */}
          <div className="trading-terminal-col glass-panel-gold">
            <div className="tt-header">
              <span className="tt-badge">TERMINAL BURSA PERDAGANGAN</span>
              <h3 className="tt-title">{selectedComm.name}</h3>
              <p className="tt-desc">{selectedComm.description}</p>
              <div className="tt-provinces-tag">
                <span>Provinsi Penghasil Utama:</span>
                <strong>{selectedComm.provinces.join(', ')}</strong>
              </div>
            </div>

            {/* Buy / Sell Tab Switches */}
            <div className="trade-action-switch">
              <button 
                className={`tas-btn ${tradeAction === 'buy' ? 'active-buy' : ''}`}
                onClick={() => { sounds.playClick(); setTradeAction('buy'); }}
              >
                Beli dari Pasar
              </button>
              <button 
                className={`tas-btn ${tradeAction === 'sell' ? 'active-sell' : ''}`}
                onClick={() => { sounds.playClick(); setTradeAction('sell'); }}
              >
                Jual dari Gudang
              </button>
            </div>

            {/* Trade Calculation Form */}
            <div className="trade-form-box">
              <div className="form-group">
                <label className="form-label">
                  <span>Jumlah ({selectedComm.unit}):</span>
                  <span className="text-muted">Tersedia di Gudang: {userStock} {selectedComm.unit}</span>
                </label>
                <div className="qty-input-row">
                  <input 
                    type="number" 
                    min="1"
                    max="1000"
                    className="form-input" 
                    value={tradeQuantity}
                    onChange={(e) => setTradeQuantity(Math.max(1, parseInt(e.target.value) || 1))}
                  />
                  <div className="qty-quick-buttons">
                    {[1, 5, 10, 50].map((qty) => (
                      <button 
                        key={qty} 
                        type="button"
                        className={`qqb-btn ${tradeQuantity === qty ? 'active' : ''}`}
                        onClick={() => { sounds.playClick(); setTradeQuantity(qty); }}
                      >
                        {qty}x
                      </button>
                    ))}
                    {tradeAction === 'sell' && userStock > 0 && (
                      <button 
                        type="button"
                        className="qqb-btn"
                        onClick={() => { sounds.playClick(); setTradeQuantity(userStock); }}
                      >
                        Semua ({userStock})
                      </button>
                    )}
                  </div>
                </div>
              </div>

              {/* Total Calculation Display */}
              <div className="trade-calc-summary">
                <div className="tcs-line">
                  <span>Harga Satuan:</span>
                  <strong>{formatRupiah(selectedComm.currentPriceRp)} / {selectedComm.unit}</strong>
                </div>
                <div className="tcs-line">
                  <span>Kuantitas Transaksi:</span>
                  <strong>{tradeQuantity} {selectedComm.unit}</strong>
                </div>
                <div className="tcs-line total-highlight">
                  <span>{tradeAction === 'buy' ? 'Total Pembayaran:' : 'Total Penerimaan Kas:'}</span>
                  <strong className={tradeAction === 'buy' ? 'text-cyan' : 'text-emerald'}>
                    {formatRupiah(selectedComm.currentPriceRp * tradeQuantity)}
                  </strong>
                </div>
              </div>

              <button 
                type="button"
                className={`btn-trade-submit ${tradeAction === 'buy' ? 'btn-buy' : 'btn-sell'}`}
                onClick={handleExecuteTrade}
              >
                <ShoppingBag size={18} />
                <span>
                  {tradeAction === 'buy' 
                    ? `Beli ${tradeQuantity}x ${selectedComm.name}` 
                    : `Jual ${tradeQuantity}x ${selectedComm.name}`}
                </span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: PABRIK & HILIRISASI INDUSTRI */}
      {activeSubTab === 'factories' && (
        <div className="factories-section-layout">
          <div className="fsl-header">
            <div>
              <h3 className="fsl-title">Pusat Investasi Fasilitas Hilirisasi & Industri</h3>
              <p className="fsl-sub">
                Bangun fasilitas pengolahan komoditas mentah untuk menghasilkan pendapatan harian pasif dan stok sumber daya strategis secara kontinu.
              </p>
            </div>
          </div>

          {/* Owned Factories List */}
          {playerFactories.length > 0 && (
            <div className="owned-factories-box">
              <h4 className="ofb-title font-gold">Pabrik & Fasilitas Aktif Milik Anda ({playerFactories.length})</h4>
              <div className="owned-factories-grid">
                {playerFactories.map((fac) => {
                  return (
                    <div key={fac.instanceId} className="owned-factory-card glass-panel-gold">
                      <div className="ofc-top">
                        <Factory size={22} className="text-gold" />
                        <div>
                          <strong className="ofc-name">{fac.name}</strong>
                          <span className="ofc-status">Status: Beroperasi Normal</span>
                        </div>
                      </div>
                      <div className="ofc-metrics">
                        <span>Hasil Produksi Siap Panen: <strong>+{fac.accumulatedYield} Unit</strong></span>
                        <span>Estimasi Pendapatan: <strong className="text-emerald">{formatRupiah(fac.profitAccumulatedRp)}</strong></span>
                      </div>
                      <button 
                        className="btn-gold btn-collect"
                        onClick={() => collectFactoryYield(fac.instanceId)}
                      >
                        <Coins size={14} /> Ambil Hasil Produksi & Kas
                      </button>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* Catalog of Industrial Facilities to Build */}
          <h4 className="catalog-heading font-white">Katalog Pembangunan Industri Baru</h4>
          <div className="factories-catalog-grid">
            {INDUSTRIAL_FACILITIES.map((facility) => {
              return (
                <div key={facility.id} className="facility-catalog-card glass-panel">
                  <div className="fcc-top">
                    <Building2 size={24} className="text-cyan" />
                    <h4 className="fcc-name">{facility.name}</h4>
                  </div>
                  <p className="fcc-desc">{facility.description}</p>
                  <div className="fcc-stats-grid">
                    <div className="fcc-stat">
                      <span>PROYEKSI LABA:</span>
                      <strong className="text-emerald">+{formatRupiah(facility.dailyProfitRp)}/siklus</strong>
                    </div>
                    <div className="fcc-stat">
                      <span>OUTPUT KOMODITAS:</span>
                      <strong className="text-cyan">+{facility.yieldUnits} {facility.resourceProduced.toUpperCase()}</strong>
                    </div>
                  </div>
                  <button 
                    className="btn-gold btn-build"
                    onClick={() => buildIndustrialFacility(facility.id)}
                  >
                    <Plus size={16} /> Bangun Fasilitas ({formatRupiah(facility.costRp)})
                  </button>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* TAB 3: GUDANG LOGISTIK PRIBADI */}
      {activeSubTab === 'inventory' && (
        <div className="warehouse-inventory-container glass-panel-gold">
          <div className="wic-header">
            <Package size={24} className="font-gold" />
            <div>
              <h3 className="wic-title">Gudang Logistik & Cadangan Komoditas Strategis</h3>
              <p className="wic-sub">Stok komoditas riil yang tersimpan di gudang pribadi Anda. Dapat dijual kapan saja di bursa atau dialokasikan untuk kebutuhan militer dan diplomasi.</p>
            </div>
          </div>

          <div className="inventory-cards-grid">
            {commodities.map((c) => {
              const Icon = getCommodityIcon(c.id);
              const qty = playerInventory[c.id] || 0;
              const valuation = qty * c.currentPriceRp;

              return (
                <div key={c.id} className="inventory-item-card glass-panel">
                  <div className="iic-top">
                    <div className="iic-icon" style={{ backgroundColor: `${c.color}20`, color: c.color }}>
                      <Icon size={24} />
                    </div>
                    <div>
                      <strong className="iic-name">{c.name}</strong>
                      <span className="iic-unit">{c.category}</span>
                    </div>
                  </div>
                  <div className="iic-qty-row">
                    <span className="iic-qty-val">{qty.toLocaleString()}</span>
                    <span className="iic-qty-unit">{c.unit}</span>
                  </div>
                  <div className="iic-valuation">
                    <span>Estimasi Nilai Pasar:</span>
                    <strong className="text-gold">{formatRupiah(valuation)}</strong>
                  </div>
                  <button 
                    className="btn-secondary btn-quick-sell"
                    disabled={qty <= 0}
                    onClick={() => {
                      setSelectedCommodityId(c.id);
                      setTradeAction('sell');
                      setTradeQuantity(Math.min(qty, 10));
                      setActiveSubTab('commodities');
                    }}
                  >
                    Jual di Bursa Pasar Bebas
                  </button>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* TAB 4: INDIKATOR MAKROEKONOMI BANK SENTRAL */}
      {activeSubTab === 'macro' && (
        <div className="macro-dashboard-grid">
          <div className="macro-stat-card glass-panel-gold">
            <div className="msc-top">
              <Globe size={22} className="text-cyan" />
              <span>PRODUK DOMESTIK BRUTO (PDB)</span>
            </div>
            <h3 className="msc-val text-white">{formatRupiah(macroEconomy.gdpNominalRp)}</h3>
            <p className="msc-sub">Perekonomian terbesar di Asia Tenggara dan peringkat ke-16 dunia.</p>
          </div>

          <div className="macro-stat-card glass-panel-gold">
            <div className="msc-top">
              <Percent size={22} className="text-emerald" />
              <span>SUKU BUNGA BI-RATE (MONETER)</span>
            </div>
            <h3 className="msc-val text-emerald">{macroEconomy.biRate.toFixed(2)}%</h3>
            <p className="msc-sub">Instrumen Bank Indonesia untuk menjaga kestabilan nilai tukar Rupiah.</p>
          </div>

          <div className="macro-stat-card glass-panel-gold">
            <div className="msc-top">
              <Coins size={22} className="text-gold" />
              <span>CADANGAN DEVISA NASIONAL</span>
            </div>
            <h3 className="msc-val text-gold">{formatUsd(macroEconomy.fxReservesUsd)}</h3>
            <p className="msc-sub">Cukup untuk membiayai 6.8 bulan impor dan pembayaran utang luar negeri.</p>
          </div>

          <div className="macro-stat-card glass-panel-gold">
            <div className="msc-top">
              <TrendingUp size={22} className="text-emerald" />
              <span>SURPLUS NERACA PERDAGANGAN</span>
            </div>
            <h3 className="msc-val text-emerald">+{formatUsd(macroEconomy.tradeBalanceUsd)}</h3>
            <p className="msc-sub">Didukung surplus ekspor hilirisasi nikel, batu bara, dan CPO kelapa sawit.</p>
          </div>
        </div>
      )}
    </div>
  );
}
