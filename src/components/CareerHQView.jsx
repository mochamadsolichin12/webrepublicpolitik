import React from 'react';
import { useGame } from '../context/GameContext';
import { sounds } from '../utils/soundEffects';
import { 
  Briefcase, 
  Award, 
  Sparkles, 
  Zap, 
  TrendingUp, 
  Flame, 
  Brain, 
  Shield, 
  Users, 
  Pickaxe, 
  Coins, 
  Landmark,
  Building,
  Clock,
  Loader2,
  CheckCircle2
} from 'lucide-react';

export default function CareerHQView() {
  const { 
    player, 
    parties, 
    activePerkUpgrade,
    getPerkUpgradeDuration,
    trainPerk, 
    workMine 
  } = useGame();

  const playerParty = parties.find((p) => p.id === player?.partyId);

  const perksList = [
    {
      key: 'charisma',
      title: 'Karisma & Retorika',
      desc: 'Dihitung otomatis: Naik turun mengikuti tingkat ketenaran & perolehan suara pemilihan Presiden.',
      icon: Flame,
      color: '#f59e0b',
      val: player?.perks?.charisma || 10,
    },
    {
      key: 'intellect',
      title: 'Intelektualitas & Regulasi',
      desc: 'Membuka naskah RUU tingkat tinggi dan mempercepat kompromi di Badan Legislasi DPR.',
      icon: Brain,
      color: '#06b6d4',
      val: player?.perks?.intellect || 10,
    },
    {
      key: 'endurance',
      title: 'Ketahanan & Disiplin',
      desc: 'Memperkuat stamina fisik dan regenerasi energi menghadapi manuver maraton politik.',
      icon: Shield,
      color: '#10b981',
      val: player?.perks?.endurance || 10,
    },
    {
      key: 'connections',
      title: 'Koneksi Bisnis & Oligarki',
      desc: 'Meningkatkan gaji dinas pengawasan industri dan mendatangkan sponsor taktis.',
      icon: Users,
      color: '#a855f7',
      val: player?.perks?.connections || 10,
    },
  ];

  const workOptions = [
    {
      type: 'nikel',
      title: 'Supervisi Smelter Nikel & Baterai Listrik',
      location: 'Morowali / Weda Bay',
      icon: Pickaxe,
      rewardText: '+Rp 15-20 Jt & +1 Emas',
      energyCost: 20,
    },
    {
      type: 'minyak',
      title: 'Dinas Pengawasan Blok Minyak & Gas Riau',
      location: 'Rokan & Dumai, Sumatera',
      icon: Building,
      rewardText: '+Rp 18-24 Jt & +1 Emas',
      energyCost: 20,
    },
    {
      type: 'finansial',
      title: 'Konsultasi Kebijakan Finansial & Pasar Modal',
      location: 'SCBD Sudirman, Jakarta',
      icon: Landmark,
      rewardText: '+Rp 20-28 Jt & +1 Emas',
      energyCost: 20,
    },
  ];

  return (
    <div className="career-view-container">
      {/* Profile & Rank Banner */}
      <div className="career-profile-card glass-panel">
        <div className="profile-main">
          <div className="profile-avatar-circle">
            <span className="avatar-rank-badge">Lv.{player?.level || 1}</span>
            <div className="avatar-letters">
              {(player?.name || player?.fullName || player?.username || 'Warga')
                .split(' ')
                .filter(Boolean)
                .map((n) => n[0])
                .slice(0, 2)
                .join('')}
            </div>
          </div>

          <div className="profile-details">
            <div className="profile-tags">
              <span className="badge badge-gold">{player?.title || 'Kader Muda Pergerakan'}</span>
              <span className="badge" style={{ backgroundColor: playerParty?.badgeBg || '#1e293b', color: playerParty?.color || '#94a3b8' }}>
                {playerParty ? `${playerParty.name} (${playerParty.shortName})` : 'Independen'}
              </span>
            </div>
            <h2 className="profile-name">{player?.name || player?.fullName || player?.username || 'Warga Berdaulat'}</h2>
            <p className="profile-pos">
              Jabatan Publik Saat Ini: <strong>{player?.position || 'Warga Digital'}</strong>
            </p>

            {/* EXP Bar */}
            <div className="exp-bar-wrapper">
              <div className="exp-labels">
                <span>Pengalaman Politik (EXP): <strong>{player?.exp ?? 0} / {player?.maxExp ?? 1000}</strong></span>
                <span className="next-level-tag">Tingkat Karir Berikutnya: Lv.{(player?.level || 1) + 1}</span>
              </div>
              <div className="exp-track">
                <div 
                  className="exp-fill" 
                  style={{ width: `${Math.min(100, ((player?.exp || 0) / (player?.maxExp || 1000)) * 100)}%` }} 
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Perks / Stats Upgrade Grid */}
      <div className="perks-section">
        <div className="section-header-row">
          <div>
            <h3 className="section-title"><Sparkles size={18} /> Atribut & Kapabilitas Tokoh Politik</h3>
            <p className="section-sub">
              Tingkatkan kapasitas pribadi untuk membuka posisi strategis dan pengaruh legislasi yang lebih besar.
            </p>
          </div>
        </div>

        <div className="perks-grid">
          {perksList.map((p) => {
            const Icon = p.icon;
            const isCharisma = p.key === 'charisma';
            const isUpgrading = activePerkUpgrade && activePerkUpgrade.perkKey === p.key;
            const upgradeDurationSec = getPerkUpgradeDuration ? getPerkUpgradeDuration(p.val) : 60;
            const durationMin = Math.floor(upgradeDurationSec / 60);
            const durationSecRem = upgradeDurationSec % 60;
            const durationLabel = durationMin > 0 ? `${durationMin}m ${durationSecRem > 0 ? `${durationSecRem}s` : ''}`.trim() : `${durationSecRem}s`;

            return (
              <div key={p.key} className={`perk-card glass-panel ${isCharisma ? 'dynamic-perk-card' : ''} ${isUpgrading ? 'perk-training-active' : ''}`}>
                <div className="perk-top">
                  <div className="perk-icon-wrapper" style={{ backgroundColor: `${p.color}20`, color: p.color }}>
                    <Icon size={20} />
                  </div>
                  <div className="perk-val-pill" style={{ borderColor: p.color, color: p.color }}>
                    Nilai: <strong>{p.val}</strong> / 999
                  </div>
                </div>

                <h4 className="perk-title">{p.title}</h4>
                <p className="perk-desc">{p.desc}</p>

                {!isCharisma && p.val < 999 && (
                  <div className="perk-duration-tag">
                    <Clock size={12} />
                    <span>Waktu upgrade: <strong>{durationLabel}</strong></span>
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
                    <Flame size={14} className="flame-pulse-icon" />
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
                    className="btn-gold perk-train-btn btn-perk-maxed"
                    disabled
                  >
                    <CheckCircle2 size={15} /> Maksimal (999)
                  </button>
                ) : (
                  <button
                    className="btn-gold perk-train-btn"
                    onClick={() => trainPerk(p.key)}
                    disabled={Boolean(activePerkUpgrade)}
                    title={activePerkUpgrade ? 'Pelatihan lain sedang berjalan' : `Latih Atribut (${durationLabel})`}
                  >
                    <TrendingUp size={15} /> Latih Atribut ({durationLabel} | -15 ⚡ | Rp 5 Jt)
                  </button>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* State Work & Mining Sector */}
      <div className="work-section">
        <div className="section-header-row">
          <div>
            <h3 className="section-title"><Pickaxe size={18} /> Dinas Pengawasan & Sektor Pertambangan Negara</h3>
            <p className="section-sub">
              Lakukan dinas pengawasan proyek strategis nasional untuk mengumpulkan pendapatan pribadi dan devisa emas.
            </p>
          </div>
        </div>

        <div className="work-grid">
          {workOptions.map((w, idx) => {
            const Icon = w.icon;
            return (
              <div key={idx} className="work-card glass-panel">
                <div className="work-icon-box">
                  <Icon size={24} color="#f59e0b" />
                </div>
                <h4 className="work-title">{w.title}</h4>
                <p className="work-location">Lokasi: {w.location}</p>
                <div className="work-reward-tag font-emerald">
                  <Coins size={14} /> Imbalan: {w.rewardText}
                </div>

                <button
                  className="btn-emerald work-btn"
                  onClick={() => workMine(w.type)}
                >
                  <Zap size={15} /> Lakukan Tugas Dinas (-{w.energyCost} ⚡)
                </button>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
