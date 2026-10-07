import React from 'react';
import { useGame } from '../context/GameContext';
import { sounds } from '../utils/soundEffects';
import { 
  Coins, 
  TrendingUp, 
  PieChart, 
  ShieldCheck, 
  HeartHandshake, 
  Landmark, 
  Award, 
  CheckCircle,
  AlertTriangle
} from 'lucide-react';

export default function BudgetView() {
  const { nationalState, regions, passedLaws } = useGame();

  const formatTriliun = (val) => {
    return `$RP ${(val / 1e12).toFixed(2)} Triliun`;
  };

  const revenueItems = [
    { name: 'Pajak Penghasilan (PPh) & Korporasi', amount: 1450000000000, pct: 42, color: '#38bdf8' },
    { name: 'Royalti Nikel, Emas & Tambang Strategis', amount: 890000000000, pct: 26, color: '#f59e0b' },
    { name: 'Pajak Pertambahan Nilai (PPN 11%)', amount: 620000000000, pct: 18, color: '#10b981' },
    { name: 'Dividen BUMN & Devisa Ekspor Energi', amount: 460000000000, pct: 14, color: '#a855f7' },
  ];

  const expenditureItems = [
    { name: 'Pendidikan 20% & Beasiswa Riset Nasional', amount: 684000000000, pct: 20, color: '#06b6d4' },
    { name: 'Kesehatan Semesta & Subsidi BPJS', amount: 513000000000, pct: 15, color: '#10b981' },
    { name: 'Pertahanan, Radar Maritim & Alutsista', amount: 478000000000, pct: 14, color: '#ef4444' },
    { name: 'Transfer Dana Otonomi Daerah & Desa', amount: 855000000000, pct: 25, color: '#f59e0b' },
    { name: 'Infrastruktur Jalan, Pelabuhan & IKN', amount: 547000000000, pct: 16, color: '#8b5cf6' },
    { name: 'Cadangan Fiskal & Darurat Bencana', amount: 343000000000, pct: 10, color: '#64748b' },
  ];

  return (
    <div className="budget-view-container">
      {/* Header Banner */}
      <div className="budget-hero glass-panel">
        <div className="hero-left">
          <div className="hero-badge">
            <Coins size={18} /> KEMENTERIAN KEUANGAN & BADAN ANGGARAN PARLEMEN
          </div>
          <h2 className="hero-title">APBN & Neraca Fiskal Republik</h2>
          <p className="hero-desc">
            Pusat pengelolaan kas kedaulatan negara. Pendapatan dihimpun dari 38 provinsi dan dialokasikan 
            sesuai undang-undang yang disahkan parlemen.
          </p>
        </div>

        <div className="apbn-card-gold glass-panel-gold">
          <span className="apbn-sub">Total Saldo Kas Negara (APBN)</span>
          <h2 className="apbn-total">{formatTriliun(nationalState.treasury)}</h2>
          <div className="apbn-indicators">
            <span className="ind-pill">
              Stabilitas Nasional: <strong>{nationalState.stability}%</strong>
            </span>
            <span className="ind-pill">
              Kepuasan Publik: <strong>{nationalState.publicApproval}%</strong>
            </span>
          </div>
        </div>
      </div>

      {/* 2-Column Grid: Revenue vs Expenditure */}
      <div className="fiscal-breakdown-grid">
        {/* Revenue Column */}
        <div className="fiscal-column glass-panel">
          <div className="column-header">
            <h3><TrendingUp size={18} className="font-emerald" /> Struktur Penerimaan Negara</h3>
            <span className="badge badge-emerald">Surplus Produktif</span>
          </div>

          <div className="fiscal-items-list">
            {revenueItems.map((item, idx) => (
              <div key={idx} className="fiscal-item">
                <div className="item-row-top">
                  <span className="item-name">{item.name}</span>
                  <strong className="item-amount font-emerald">{formatTriliun(item.amount)} ({item.pct}%)</strong>
                </div>
                <div className="item-bar-track">
                  <div className="item-bar-fill" style={{ width: `${item.pct * 2}%`, backgroundColor: item.color }} />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Expenditure Column */}
        <div className="fiscal-column glass-panel">
          <div className="column-header">
            <h3><PieChart size={18} className="font-gold" /> Alokasi Belanja & Subsidi Negara</h3>
            <span className="badge badge-gold">Distribusi Pro-Rakyat</span>
          </div>

          <div className="fiscal-items-list">
            {expenditureItems.map((item, idx) => (
              <div key={idx} className="fiscal-item">
                <div className="item-row-top">
                  <span className="item-name">{item.name}</span>
                  <strong className="item-amount font-highlight">{formatTriliun(item.amount)} ({item.pct}%)</strong>
                </div>
                <div className="item-bar-track">
                  <div className="item-bar-fill" style={{ width: `${item.pct * 2.5}%`, backgroundColor: item.color }} />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Stability & Reserve Status Card */}
      <div className="stability-summary-card glass-panel">
        <div className="summary-col">
          <ShieldCheck size={28} color="#10b981" />
          <div>
            <h4>Kedaulatan Fiskal Kuat</h4>
            <p>Cadangan devisa batangan emas dan surplus ekspor nikel menjaga ketahanan rupiah terhadap inflasi global.</p>
          </div>
        </div>
        <div className="summary-col">
          <CheckCircle size={28} color="#f59e0b" />
          <div>
            <h4>Efek Undang-Undang Parlemen</h4>
            <p>{passedLaws.length} Undang-Undang aktif saat ini memberikan imbal hasil positif terhadap stabilitas fiskal.</p>
          </div>
        </div>
      </div>
    </div>
  );
}
