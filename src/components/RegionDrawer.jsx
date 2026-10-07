import React from 'react';
import { useGame } from '../context/GameContext';
import { sounds } from '../utils/soundEffects';
import { 
  Building, 
  HeartPulse, 
  ShieldAlert, 
  Coins, 
  Users, 
  MapPin, 
  Megaphone, 
  Vote, 
  TrendingUp,
  Award,
  Sparkles,
  ArrowUpRight
} from 'lucide-react';

export default function RegionDrawer({ region, onBackToMap }) {
  const { 
    parties, 
    player, 
    nationalState,
    campaignInRegion, 
    investInRegion 
  } = useGame();

  if (!region) return null;

  const dominantParty = parties?.find((p) => p.id === region.dominantPartyId);
  const playerParty = parties?.find((p) => p.id === player?.partyId);
  const isPlayerPartyDominant = !!(player?.partyId && player.partyId === region.dominantPartyId);

  const formatRupiah = (val) => {
    if (val >= 1e12) return `$RP ${(val / 1e12).toFixed(2)} Triliun`;
    if (val >= 1e9) return `$RP ${(val / 1e9).toFixed(1)} Miliar`;
    return `$RP ${(val / 1e6).toFixed(0)} Juta`;
  };

  return (
    <aside className="region-drawer">
      {/* Mobile Back Button */}
      {onBackToMap && (
        <button className="mobile-back-to-map-btn" onClick={onBackToMap}>
          ← Kembali ke Peta Nusantara
        </button>
      )}

      {/* Region Banner Header */}
      <div className="drawer-header">
        <div className="drawer-title-area">
          <div className="drawer-badge-group">
            <span className="badge badge-cyan">{region.island.toUpperCase()}</span>
            <span className="badge" style={{ backgroundColor: dominantParty?.badgeBg, color: dominantParty?.color, border: `1px solid ${dominantParty?.border}` }}>
              {dominantParty?.shortName || 'INDEP'}
            </span>
          </div>
          <h2 className="drawer-region-name">{region.name}</h2>
          <p className="drawer-capital">
            <MapPin size={13} /> Ibu Kota: <strong>{region.capital}</strong>
          </p>
        </div>
      </div>

      <div className="drawer-body">
        {/* Key Indicators Matrix */}
        <div className="metrics-grid">
          <div className="metric-card">
            <span className="metric-title"><Users size={14} /> Penduduk</span>
            <span className="metric-val">{region.population === 0 ? '0 Jiwa (Kosong)' : `${(region.population / 1e6).toFixed(2)} Juta`}</span>
          </div>
          <div className="metric-card">
            <span className="metric-title"><TrendingUp size={14} /> Kepuasan Publik</span>
            <span className={`metric-val ${region.supportRate >= 75 ? 'font-emerald' : 'font-gold'}`}>
              {region.supportRate}%
            </span>
          </div>
          <div className="metric-card">
            <span className="metric-title"><Coins size={14} /> APBD Daerah</span>
            <span className="metric-val font-gold">{formatRupiah(region.budget)}</span>
          </div>
          <div className="metric-card">
            <span className="metric-title"><Award size={14} /> Komoditas Utama</span>
            <span className="metric-val font-highlight text-sm">{region.resource}</span>
          </div>
        </div>

        {/* Info Anggaran APBN & Kas Otonomi Wilayah */}
        <div className="region-apbn-detail-box glass-panel-gold" style={{ padding: '12px 14px', borderRadius: '10px', marginBottom: '14px', border: '1px solid rgba(245, 158, 11, 0.35)' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '8px' }}>
            <span style={{ fontSize: '0.74rem', color: '#fbbf24', fontWeight: 800, textTransform: 'uppercase', display: 'flex', alignItems: 'center', gap: '6px' }}>
              <Coins size={14} /> Neraca Fiskal & APBN Nasional
            </span>
            <span className="badge badge-emerald" style={{ fontSize: '0.68rem' }}>Terhubung Fiskal</span>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
            <div>
              <span style={{ fontSize: '0.68rem', color: 'var(--text-dim)', display: 'block' }}>Total Saldo APBN:</span>
              <strong style={{ fontSize: '0.88rem', color: '#f8fafc' }}>
                $RP {((nationalState?.treasury || 0) / 1e12).toFixed(2)} Triliun
              </strong>
            </div>
            <div>
              <span style={{ fontSize: '0.68rem', color: 'var(--text-dim)', display: 'block' }}>Alokasi Transfer Daerah:</span>
              <strong style={{ fontSize: '0.88rem', color: '#10b981' }}>
                {formatRupiah(region.budget)}
              </strong>
            </div>
          </div>
        </div>

        {/* Dominant Party Info */}
        <div className="party-dominance-card" style={{ borderColor: dominantParty?.border || 'rgba(255,255,255,0.1)' }}>
          <div className="party-row">
            <div>
              <span className="card-sub-label">Penguasa / Fraksi Mayoritas</span>
              <h4 className="party-row-name" style={{ color: dominantParty?.color || '#94a3b8' }}>
                {dominantParty ? `${dominantParty.name} (${dominantParty.shortName})` : 'Belum Ada (Wilayah Tak Bertuan)'}
              </h4>
            </div>
            {isPlayerPartyDominant && player.partyId ? (
              <span className="badge badge-emerald">Basis Partai Anda</span>
            ) : (
              <span className="badge badge-gold">{dominantParty ? 'Wilayah Perebutan' : 'Terbuka Untuk Diklaim'}</span>
            )}
          </div>
          <p className="party-slogan-text">{dominantParty ? `"${dominantParty.slogan}"` : 'Belum ada partai politik yang mendominasi wilayah ini.'}</p>
        </div>

        {/* Political Campaign Actions Section */}
        <div className="drawer-action-section">
          <h3 className="section-title">
            <Megaphone size={16} /> Operasi Kampanye & Penggalangan Suara
          </h3>
          <p className="section-desc">
            Tingkatkan pengaruh politik partai Anda (<strong>{playerParty?.shortName || 'Independen'}</strong>) di wilayah {region.name}:
          </p>

          <div className="campaign-buttons-grid">
            <button
              className="campaign-btn"
              onClick={() => campaignInRegion(region.id, 'baliho')}
              title="Pasang baliho di jalan protokol dan pelosok daerah"
            >
              <div className="btn-left">
                <span className="btn-action-name">Pasang Baliho & Spanduk</span>
                <span className="btn-cost-tag">-10 ⚡ | -Rp 8 Juta</span>
              </div>
              <span className="btn-gain-tag">+2% Suara</span>
            </button>

            <button
              className="campaign-btn highlight"
              onClick={() => campaignInRegion(region.id, 'blusukan')}
              title="Kunjungi pasar tradisional, sentra nelayan, dan pondok pesantren"
            >
              <div className="btn-left">
                <span className="btn-action-name">Blusukan & Temu Warga</span>
                <span className="btn-cost-tag">-25 ⚡ | -Rp 15 Juta</span>
              </div>
              <span className="btn-gain-tag font-emerald">+5% Suara</span>
            </button>

            <button
              className="campaign-btn supreme"
              onClick={() => campaignInRegion(region.id, 'pidato')}
              title="Gelar rapat akbar di stadion utama dengan massa simpatisan"
            >
              <div className="btn-left">
                <span className="btn-action-name">Pidato Akbar Stadion</span>
                <span className="btn-cost-tag">-35 ⚡ | -Rp 30 Juta</span>
              </div>
              <span className="btn-gain-tag font-gold">+9% Suara</span>
            </button>
          </div>
        </div>

        {/* Regional Infrastructure & Facilities */}
        <div className="drawer-facilities-section">
          <h3 className="section-title">
            <Building size={16} /> Fasilitas Pembangunan Wilayah
          </h3>

          <div className="facility-item">
            <div className="facility-header">
              <div className="facility-info">
                <span className="facility-name"><Building size={14} /> Infrastruktur & Logistik</span>
                <span className="facility-level">Level {region.infrastructure}/10</span>
              </div>
              <button 
                className="btn-mini-upgrade" 
                onClick={() => investInRegion(region.id, 'infrastructure')}
                title="Bangun jalan tol, dermaga kontainer & jembatan"
              >
                + Upgrade (Rp 25 Jt)
              </button>
            </div>
            <div className="bar-track">
              <div className="bar-fill cyan" style={{ width: `${region.infrastructure * 10}%` }} />
            </div>
          </div>

          <div className="facility-item">
            <div className="facility-header">
              <div className="facility-info">
                <span className="facility-name"><HeartPulse size={14} /> Rumah Sakit & Kesehatan</span>
                <span className="facility-level">Level {region.hospitals}/10</span>
              </div>
              <button 
                className="btn-mini-upgrade" 
                onClick={() => investInRegion(region.id, 'hospitals')}
                title="Bantu faskes dan obat-obatan gratis daerah"
              >
                + Upgrade (Rp 25 Jt)
              </button>
            </div>
            <div className="bar-track">
              <div className="bar-fill emerald" style={{ width: `${region.hospitals * 10}%` }} />
            </div>
          </div>

          <div className="facility-item">
            <div className="facility-header">
              <div className="facility-info">
                <span className="facility-name"><ShieldAlert size={14} /> Pangkalan Pertahanan & Kodam</span>
                <span className="facility-level">Level {region.militaryBase}/10</span>
              </div>
              <button 
                className="btn-mini-upgrade" 
                onClick={() => investInRegion(region.id, 'militaryBase')}
                title="Perkuat garnisun pertahanan dan radar wilayah"
              >
                + Upgrade (Rp 25 Jt)
              </button>
            </div>
            <div className="bar-track">
              <div className="bar-fill crimson" style={{ width: `${region.militaryBase * 10}%` }} />
            </div>
          </div>
        </div>
      </div>
    </aside>
  );
}
