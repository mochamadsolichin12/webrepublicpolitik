import React, { useState } from 'react';
import { useGame } from '../context/GameContext';
import { sounds } from '../utils/soundEffects';
import { navigateToPage } from '../utils/navigation';
import { 
  User, 
  Award, 
  MapPin, 
  Flame, 
  Brain, 
  Shield, 
  Users, 
  Coins, 
  Zap, 
  Edit3, 
  Save, 
  CheckCircle2, 
  Compass, 
  Flag, 
  Landmark, 
  Crown, 
  ShieldCheck, 
  Coffee,
  Sparkles,
  BookOpen,
  ArrowRight,
  Clock,
  Loader2
} from 'lucide-react';

export default function PlayerProfileView() {
  const { 
    player, 
    parties, 
    regions, 
    userRole, 
    isSuperAdmin, 
    isModerator, 
    switchActiveRole, 
    activePerkUpgrade,
    getPerkUpgradeDuration,
    trainPerk, 
    boostEnergy, 
    updatePlayerProfile, 
    setSelectedRegionId,
    setActiveTab,
    showToast 
  } = useGame();

  const playerParty = parties.find((p) => p.id === player?.partyId) || parties[0];
  const playerRegionId = player?.currentRegionId || player?.residenceRegionId || 'dki';
  const playerRegion = regions.find((r) => r.id === playerRegionId) || regions[0];

  // Edit mode state
  const [isEditing, setIsEditing] = useState(false);
  const [fullName, setFullName] = useState(player?.fullName || player?.name || '');
  const [title, setTitle] = useState(player?.title || 'Kader Muda Pergerakan');
  const [residenceRegionId, setResidenceRegionId] = useState(playerRegionId);
  const [bio, setBio] = useState(player?.bio || 'Warga negara berdaulat yang berjuang demi kedaulatan rakyat dan kemajuan Republik Nusantara.');

  const expPercentage = Math.min(100, Math.round(((player?.exp || 0) / (player?.maxExp || 1000)) * 100));
  const energyPercentage = Math.min(100, Math.round(((player?.energy || 0) / (player?.maxEnergy || 100)) * 100));

  const formatRupiah = (val) => {
    if (val >= 1e12) return `$RP ${(val / 1e12).toFixed(2)} Triliun`;
    if (val >= 1e9) return `$RP ${(val / 1e9).toFixed(2)} Miliar`;
    if (val >= 1e6) return `$RP ${(val / 1e6).toFixed(1)} Juta`;
    return `$RP ${(val || 0).toLocaleString('id-ID')}`;
  };

  const handleSaveProfile = (e) => {
    e.preventDefault();
    if (!fullName.trim()) {
      showToast('Nama lengkap tidak boleh kosong!', 'error');
      return;
    }
    updatePlayerProfile({
      fullName: fullName.trim(),
      title: title.trim(),
      residenceRegionId,
      bio: bio.trim(),
    });
    setIsEditing(false);
  };

  const handleFlyToRegion = () => {
    sounds.playClick();
    setSelectedRegionId(playerRegion.id);
    navigateToPage('map', setActiveTab);
  };

  const perks = [
    {
      key: 'charisma',
      title: 'Karisma & Retorika',
      desc: 'Dihitung otomatis: Naik turun mengikuti tingkat ketenaran & perolehan suara pemilihan Presiden.',
      val: player?.perks?.charisma || 10,
      icon: Flame,
      color: '#f59e0b',
    },
    {
      key: 'intellect',
      title: 'Intelektualitas & Regulasi',
      desc: 'Mempercepat pengesahan RUU dan kompromi fraksi parlemen.',
      val: player?.perks?.intellect || 10,
      icon: Brain,
      color: '#06b6d4',
    },
    {
      key: 'endurance',
      title: 'Ketahanan & Stamina',
      desc: 'Mempercepat regenerasi energi untuk manuver politik harian.',
      val: player?.perks?.endurance || 10,
      icon: Shield,
      color: '#10b981',
    },
    {
      key: 'connections',
      title: 'Koneksi & Jaringan Elit',
      desc: 'Meningkatkan hasil dinas pengawasan industri dan sponsor partai.',
      val: player?.perks?.connections || 10,
      icon: Users,
      color: '#a855f7',
    },
  ];

  return (
    <div className="player-profile-viewport">
      {/* 1. KTP DIGITAL ELEKTRONIK REPUBLIK NUSANTARA */}
      <div className="ktp-digital-card glass-panel-gold">
        <div className="ktp-watermark-overlay"></div>
        <div className="ktp-header-row">
          <div className="ktp-emblem-badge">
            <span className="ktp-flag">🇮🇩</span>
            <div className="ktp-header-text">
              <h3 className="ktp-country-title">REPUBLIC POLITIC</h3>
              <span className="ktp-card-sub">KARTU TANDA PENDUDUK & POLITIK DIGITAL (E-KTP)</span>
            </div>
          </div>
          <div className="ktp-role-badge-wrap">
            <span className={`role-badge role-${userRole}`}>
              {userRole === 'superadmin' ? <Crown size={14} /> : userRole === 'moderator' ? <ShieldCheck size={14} /> : <User size={14} />}
              {userRole.toUpperCase()}
            </span>
            <span className="ktp-status-chip">TERVERIFIKASI RESMI</span>
          </div>
        </div>

        <div className="ktp-body-grid">
          {/* Avatar & Photo Column */}
          <div className="ktp-avatar-col">
            <div 
              className="ktp-photo-frame"
              style={{ borderColor: playerParty?.color || '#fbbf24' }}
            >
              <div 
                className="ktp-avatar-circle"
                style={{ backgroundColor: playerParty?.color || '#fbbf24' }}
              >
                <span className="ktp-avatar-initials">
                  {(player?.fullName || player?.username || 'P').charAt(0).toUpperCase()}
                </span>
              </div>
              <div className="ktp-level-pill">
                <span>LV.{player?.level || 1}</span>
              </div>
            </div>
            <span className="ktp-nik-code">NIK: 3171-8890-{player?.id ? String(player.id).slice(-4) : '9901'}</span>
          </div>

          {/* Citizen Details */}
          <div className="ktp-info-col">
            <div className="ktp-detail-line">
              <span className="ktp-label">NAMA LENGKAP:</span>
              <strong className="ktp-val-name">{player?.fullName || player?.name || player?.username || 'Warga Berdaulat'}</strong>
            </div>
            <div className="ktp-detail-line">
              <span className="ktp-label">USERNAME SIPIL:</span>
              <span className="ktp-val">@{player?.username || 'warga'}</span>
            </div>
            <div className="ktp-detail-line">
              <span className="ktp-label">GELAR / JABATAN:</span>
              <strong className="ktp-val font-gold">{player?.title || 'Kader Muda Pergerakan'}</strong>
            </div>
            <div className="ktp-detail-line">
              <span className="ktp-label">DOMISILI / SPAWN:</span>
              <div className="ktp-region-wrap">
                <span className="ktp-val">{playerRegion?.name || 'DKI Jakarta'} ({playerRegion?.capital || 'Jakarta'})</span>
                <button 
                  className="ktp-btn-fly"
                  onClick={handleFlyToRegion}
                  title="Lihat wilayah domisili Anda di peta"
                >
                  <MapPin size={12} /> Terbang ke Lokasi
                </button>
              </div>
            </div>
            <div className="ktp-detail-line">
              <span className="ktp-label">PARTAI AFILIASI:</span>
              <div className="ktp-party-row">
                <span 
                  className="ktp-party-dot" 
                  style={{ backgroundColor: playerParty?.color || '#94a3b8' }}
                />
                <strong>{playerParty ? `${playerParty.name} (${playerParty.shortName})` : 'Independen (Tanpa Partai)'}</strong>
              </div>
            </div>
          </div>

          {/* Quick Edit Profile Button */}
          <div className="ktp-actions-col">
            <button 
              className={`btn-gold btn-edit-ktp ${isEditing ? 'active' : ''}`}
              onClick={() => { sounds.playClick(); setIsEditing(!isEditing); }}
            >
              <Edit3 size={15} />
              <span>{isEditing ? 'Batal' : 'Ubah'}</span>
            </button>
          </div>
        </div>

        {/* Citizen Bio / Manifesto */}
        <div className="ktp-manifesto-box">
          <BookOpen size={16} className="text-cyan flex-shrink-0" />
          <div className="km-text">
            <span className="km-label">Manifesto & Visi Politik:</span>
            <p className="km-quote">"{player?.bio || 'Warga negara berdaulat yang berjuang demi kedaulatan rakyat dan kemajuan Republik Nusantara.'}"</p>
          </div>
        </div>
      </div>

      {/* 2. FORM SUNTING DATA SIPIL (JIKA TOMBOL EDIT DIKLIK) */}
      {isEditing && (
        <form onSubmit={handleSaveProfile} className="profile-edit-card glass-panel-gold animate-slideDown">
          <h3 className="card-title font-gold">Perbarui Biodata & Pindah Wilayah Domisili (KTP)</h3>
          <div className="edit-form-grid">
            <div className="form-group">
              <label className="form-label">Nama Lengkap Resmi:</label>
              <input 
                type="text" 
                className="form-input" 
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                placeholder="Contoh: Raden Satria Nusantara"
                required
              />
            </div>
            <div className="form-group">
              <label className="form-label">Gelar Kehormatan Politik:</label>
              <input 
                type="text" 
                className="form-input" 
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Contoh: Tokoh Pemikir Demokrasi, dll."
              />
            </div>
            <div className="form-group">
              <label className="form-label">Pindah Domisili / Wilayah Spawn (38 Provinsi):</label>
              <select 
                className="form-input form-select"
                value={residenceRegionId}
                onChange={(e) => setResidenceRegionId(e.target.value)}
              >
                {regions.map((r) => (
                  <option key={r.id} value={r.id}>
                    {r.name} (Ibu Kota: {r.capital} • {r.island.toUpperCase()})
                  </option>
                ))}
              </select>
            </div>
            <div className="form-group full-width">
              <label className="form-label">Manifesto / Visi Perjuangan:</label>
              <textarea 
                className="form-input form-textarea" 
                rows="2"
                value={bio}
                onChange={(e) => setBio(e.target.value)}
                placeholder="Tuliskan komitmen politik dan visi kemajuan daerah..."
              />
            </div>
          </div>
          <div className="form-actions-row">
            <button type="submit" className="btn-gold">
              <Save size={16} /> Simpan Perubahan Profil
            </button>
            <button 
              type="button" 
              className="btn-secondary" 
              onClick={() => setIsEditing(false)}
            >
              Batal
            </button>
          </div>
        </form>
      )}

      {/* 3. STATUS VITAL & FINANSIAL */}
      <div className="profile-stats-grid">
        {/* EXP & Level Bar */}
        <div className="stat-overview-card glass-panel-gold">
          <div className="soc-top">
            <div className="soc-title-wrap">
              <Award size={20} className="gold-accent" />
              <strong>Level Karir Politik</strong>
            </div>
            <span className="soc-badge font-gold">Level {player?.level || 1}</span>
          </div>
          <div className="soc-bar-track">
            <div 
              className="soc-bar-fill fill-gold" 
              style={{ width: `${expPercentage}%` }}
            />
          </div>
          <div className="soc-bottom">
            <span>EXP: <strong>{player?.exp || 0} / {player?.maxExp || 1000}</strong></span>
            <span>{expPercentage}% Menuju Lv.{(player?.level || 1) + 1}</span>
          </div>
        </div>

        {/* Stamina & Energy Bar */}
        <div className="stat-overview-card glass-panel-gold">
          <div className="soc-top">
            <div className="soc-title-wrap">
              <Zap size={20} className="text-cyan" />
              <strong>Energi & Stamina</strong>
            </div>
            <button 
              className="btn-coffee"
              onClick={() => boostEnergy(25)}
              title="Pulihkan +25 Energi secara instan"
            >
              <Coffee size={14} /> Minum Kopi (+25)
            </button>
          </div>
          <div className="soc-bar-track">
            <div 
              className="soc-bar-fill fill-cyan" 
              style={{ width: `${energyPercentage}%` }}
            />
          </div>
          <div className="soc-bottom">
            <span>Stamina: <strong>{player?.energy ?? 100} / {player?.maxEnergy ?? 100}</strong></span>
            <span>{energyPercentage}% Siap Manuver</span>
          </div>
        </div>

        {/* Kekayaan Finansial */}
        <div className="stat-overview-card glass-panel-gold">
          <div className="soc-top">
            <div className="soc-title-wrap">
              <Coins size={20} className="text-emerald" />
              <strong>Perbendaharaan Pribadi</strong>
            </div>
            <span className="soc-badge font-emerald">Kas Aktif</span>
          </div>
          <div className="wealth-row">
            <div className="wealth-item">
              <span className="wi-label">SALDO RUPIAH:</span>
              <strong className="wi-val font-emerald">{formatRupiah(player?.money || 0)}</strong>
            </div>
            <div className="wealth-item">
              <span className="wi-label">CADANGAN EMAS:</span>
              <strong className="wi-val font-gold">{player?.gold ?? 0} Batang Emas</strong>
            </div>
          </div>
        </div>
      </div>

      {/* 4. ATRIBUT KEUNGGULAN POLITIK (PERKS & SKILLS) */}
      <div className="profile-perks-section glass-panel-gold">
        <div className="section-head-row">
          <div>
            <h3 className="section-title">Keterampilan</h3>
            <p className="section-subtitle">Tingkatkan atribut untuk memperkuat pengaruh saat berkampanye, menyusun UU, dan memimpin rapat parlemen.</p>
          </div>
          <button 
            className="btn-secondary"
            onClick={() => navigateToPage('career', setActiveTab)}
          >
            <span>Markas Latihan Lengkap</span>
            <ArrowRight size={15} />
          </button>
        </div>

        <div className="perks-overview-grid">
          {perks.map((p) => {
            const Icon = p.icon;
            const isCharisma = p.key === 'charisma';
            const isUpgrading = activePerkUpgrade && activePerkUpgrade.perkKey === p.key;
            const upgradeDurationSec = getPerkUpgradeDuration ? getPerkUpgradeDuration(p.val) : 60;
            const durationMin = Math.floor(upgradeDurationSec / 60);
            const durationSecRem = upgradeDurationSec % 60;
            const durationLabel = durationMin > 0 ? `${durationMin}m ${durationSecRem > 0 ? `${durationSecRem}s` : ''}`.trim() : `${durationSecRem}s`;

            return (
              <div key={p.key} className={`perk-overview-card ${isCharisma ? 'dynamic-perk-card' : ''} ${isUpgrading ? 'perk-training-active' : ''}`}>
                <div className="poc-top">
                  <div className="poc-icon-box" style={{ backgroundColor: `${p.color}20`, color: p.color }}>
                    <Icon size={20} />
                  </div>
                  <span className="poc-score" style={{ color: p.color }}>
                    Skor: <strong>{p.val}</strong> / 999
                  </span>
                </div>
                <h4 className="poc-title">{p.title}</h4>
                <p className="poc-desc">{p.desc}</p>

                {!isCharisma && p.val < 999 && (
                  <div className="perk-duration-tag">
                    <Clock size={12} />
                    <span>Waktu upgrade berikutnya: <strong>{durationLabel}</strong></span>
                  </div>
                )}
                {!isCharisma && p.val >= 999 && (
                  <div className="perk-duration-tag perk-max-tag">
                    <Award size={12} />
                    <span>Status: <strong>Tingkat Maksimal (MAX)</strong></span>
                  </div>
                )}

                {isCharisma ? (
                  <div className="perk-auto-status-pill" title="Otomatis naik/turun menyesuaikan ketenaran dan suara pemilihan presiden">
                    <Flame size={13} className="flame-pulse-icon" />
                    <span>Otomatis Naik/Turun dari Ketenaran & Suara Pemilu</span>
                  </div>
                ) : isUpgrading ? (
                  <div className="perk-upgrading-progress-box">
                    <div className="pup-header">
                      <span><Loader2 size={13} className="spin-fast" /> Sedang Ditingkatkan</span>
                      <strong>
                        {activePerkUpgrade.remainingSeconds >= 60 
                          ? `${Math.floor(activePerkUpgrade.remainingSeconds / 60)}m ${activePerkUpgrade.remainingSeconds % 60}s`
                          : `${activePerkUpgrade.remainingSeconds}s`}
                      </strong>
                    </div>
                    <div className="pup-track">
                      <div 
                        className="pup-fill" 
                        style={{ 
                          width: `${Math.max(5, Math.min(100, ((activePerkUpgrade.totalDurationSeconds - activePerkUpgrade.remainingSeconds) / activePerkUpgrade.totalDurationSeconds) * 100))}%` 
                        }}
                      />
                    </div>
                  </div>
                ) : p.val >= 999 ? (
                  <button 
                    className="btn-train-quick btn-perk-maxed"
                    disabled
                  >
                    <CheckCircle2 size={14} /> Maksimal (999)
                  </button>
                ) : (
                  <button 
                    className="btn-train-quick"
                    onClick={() => trainPerk(p.key)}
                    disabled={Boolean(activePerkUpgrade)}
                    title={activePerkUpgrade ? 'Pelatihan lain sedang berjalan' : `Tingkatkan ${p.title} (+1) - Durasi ${durationLabel}`}
                  >
                    <Sparkles size={14} /> Tingkatkan ({durationLabel})
                  </button>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
