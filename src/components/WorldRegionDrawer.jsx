import React from 'react';
import { useGame } from '../context/GameContext';
import { sounds } from '../utils/soundEffects';
import { 
  Globe, 
  ShieldAlert, 
  TrendingUp, 
  Coins, 
  Users, 
  Award, 
  Sparkles, 
  Flag,
  Handshake,
  Briefcase,
  Crosshair,
  Shield,
  ArrowLeft
} from 'lucide-react';

export default function WorldRegionDrawer({ worldRegion, onBackToIndonesia }) {
  const { notify } = useGame();

  if (!worldRegion) return null;

  const handleDiplomaticAction = (actionTitle) => {
    sounds.playClick();
    if (notify) {
      notify(`Diplomasi Sukses: ${actionTitle} dengan ${worldRegion.name} telah dikirim ke Kementerian Luar Negeri RI.`, 'success');
    }
  };

  return (
    <aside className="region-drawer world-region-drawer">
      {/* Back to Indonesia View */}
      <button 
        className="mobile-back-to-map-btn world-back-btn" 
        onClick={() => {
          sounds.playClick();
          onBackToIndonesia();
        }}
      >
        <ArrowLeft size={16} /> Kembali ke Wilayah RI (38 Provinsi)
      </button>

      {/* World Region Header */}
      <div className="drawer-header world-header">
        <div className="drawer-title-area">
          <div className="drawer-badge-group">
            <span className="badge badge-world">{worldRegion.flag} {worldRegion.sector.toUpperCase()}</span>
            <span className="badge badge-bloc">{worldRegion.bloc}</span>
          </div>
          <h2 className="drawer-region-name">{worldRegion.name}</h2>
          <p className="drawer-capital">
            <Globe size={13} /> Ibu Kota: <strong>{worldRegion.capital}</strong>
          </p>
        </div>
      </div>

      {/* Diplomatic Status Banner */}
      <div className="world-diplomacy-banner glass-panel">
        <div className="wdb-top">
          <span className="wdb-label">Status Diplomasi RI:</span>
          <span className="wdb-status font-emerald">{worldRegion.diplomaticStatus}</span>
        </div>
        <div className="wdb-meter">
          <span>Relasi Bilateral:</span>
          <strong className="font-cyan">{worldRegion.relationsWithIndonesia}</strong>
        </div>
      </div>

      {/* Core Intelligence Stats */}
      <div className="drawer-stats-grid">
        <div className="stat-card">
          <div className="stat-icon-wrap bg-blue-subtle">
            <Users size={16} className="font-blue" />
          </div>
          <div className="stat-content">
            <span className="stat-label">Populasi</span>
            <strong className="stat-value">{worldRegion.population === 0 ? '0 Jiwa (Tanpa Penghuni)' : `${worldRegion.population} Juta`}</strong>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon-wrap bg-emerald-subtle">
            <Shield size={16} className="font-emerald" />
          </div>
          <div className="stat-content">
            <span className="stat-label">Kekuatan Militer</span>
            <strong className="stat-value font-gold">{worldRegion.militaryPower}/100</strong>
          </div>
        </div>

        <div className="stat-card full-width">
          <div className="stat-icon-wrap bg-purple-subtle">
            <Coins size={16} className="font-purple" />
          </div>
          <div className="stat-content">
            <span className="stat-label">Komoditas & Industri Unggulan</span>
            <strong className="stat-value">{worldRegion.dominantResource}</strong>
          </div>
        </div>

        <div className="stat-card full-width">
          <div className="stat-icon-wrap bg-cyan-subtle">
            <Award size={16} className="font-cyan" />
          </div>
          <div className="stat-content">
            <span className="stat-label">Sistem Pemerintahan</span>
            <strong className="stat-value">{worldRegion.governmentType}</strong>
          </div>
        </div>
      </div>

      {/* Geopolitical Intel Summary */}
      <div className="world-intel-summary glass-panel">
        <h4 className="wis-title"><Sparkles size={14} className="font-gold" /> Analisis Intelijen Geopolitik</h4>
        <p className="wis-desc">{worldRegion.description}</p>
      </div>

      {/* Strategic Diplomatic Actions ala Rival Regions */}
      <div className="drawer-actions-section">
        <h4 className="actions-section-title">Opsi Hubungan Luar Negeri (Rival Regions Hub)</h4>
        
        <button 
          className="btn-action btn-gold-action"
          onClick={() => handleDiplomaticAction('Perjanjian Ekspor-Impor Komoditas')}
        >
          <Briefcase size={16} />
          <div>
            <strong>Perjanjian Perdagangan Bilateral</strong>
            <span>Amankan pasokan {worldRegion.dominantResource.split(',')[0]}</span>
          </div>
        </button>

        <button 
          className="btn-action btn-primary-action"
          onClick={() => handleDiplomaticAction('Misi Diplomatik Tingkat Tinggi')}
        >
          <Handshake size={16} />
          <div>
            <strong>Kirim Duta Besar & Utusan Khusus</strong>
            <span>Tingkatkan pengaruh diplomatik Republik Indonesia</span>
          </div>
        </button>

        <button 
          className="btn-action btn-defense-action"
          onClick={() => handleDiplomaticAction('Pakta Keamanan & Patroli Bersama')}
        >
          <Crosshair size={16} />
          <div>
            <strong>Pakta Pertahanan & Latihan Militer Bersama</strong>
            <span>Perkuat pertahanan kedaulatan laut dan udara</span>
          </div>
        </button>
      </div>
    </aside>
  );
}
