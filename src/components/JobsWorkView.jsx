import React, { useState } from 'react';
import { useGame } from '../context/GameContext';
import { sounds } from '../utils/soundEffects';
import { navigateToPage } from '../utils/navigation';
import { JOB_SECTORS, AVAILABLE_JOBS } from '../data/jobsData';
import { 
  Briefcase, 
  Coins, 
  Zap, 
  Award, 
  MapPin, 
  TrendingUp, 
  Clock, 
  CheckCircle2, 
  Building2, 
  Pickaxe, 
  Wheat, 
  Shield, 
  ArrowRight,
  Sparkles,
  History,
  Send,
  Package,
  Layers,
  Fuel,
  Users,
  Sprout
} from 'lucide-react';

export default function JobsWorkView() {
  const { 
    player, 
    parties, 
    performJobDuty, 
    workHistory, 
    playerInventory, 
    boostEnergy, 
    setActiveTab, 
    showToast 
  } = useGame();

  const [selectedSectorId, setSelectedSectorId] = useState('all');
  const [activeSubTab, setActiveSubTab] = useState('vacancies'); // 'vacancies' | 'history' | 'sectors'

  const formatRupiah = (val) => {
    if (val >= 1e12) return `$RP ${(val / 1e12).toFixed(2)} Triliun`;
    if (val >= 1e9) return `$RP ${(val / 1e9).toFixed(2)} Miliar`;
    if (val >= 1e6) return `$RP ${(val / 1e6).toFixed(1)} Juta`;
    return `$RP ${(val || 0).toLocaleString('id-ID')}`;
  };

  const filteredJobs = selectedSectorId === 'all'
    ? AVAILABLE_JOBS
    : AVAILABLE_JOBS.filter((j) => j.sectorId === selectedSectorId);

  const getSectorIcon = (sectorId) => {
    switch(sectorId) {
      case 'esdm_mining': return Pickaxe;
      case 'government_civil': return Building2;
      case 'agriculture_maritime': return Wheat;
      case 'defense_security': return Shield;
      default: return Briefcase;
    }
  };

  const getResourceIcon = (res) => {
    switch(res) {
      case 'oil': return Fuel;
      case 'nickel': return Layers;
      case 'cpo': return Sprout;
      case 'gold_bullion': return Sparkles;
      case 'rice': return Wheat;
      default: return Package;
    }
  };

  // Aggregate stats
  const totalShiftsDone = workHistory.length;
  const totalEarnedRp = workHistory.reduce((acc, h) => acc + (h.earnedRp || 0), 0);
  const totalTaxContributed = Math.round(totalEarnedRp * 0.10);

  return (
    <div className="jobs-work-viewport">
      {/* 1. HERO BANNER BURSA TENAGA KERJA & DINAS NEGARA */}
      <div className="jobs-hero glass-panel-gold">
        <div className="jh-left">
          <div className="jh-badge">
            <Briefcase size={16} className="font-gold" />
            <span>KEMENTERIAN KETENAGAKERJAAN & SEKTOR RIIL NASIONAL</span>
          </div>
          <h2 className="jh-title">Bursa Kerja & Dinas Profesi Kenegaraan</h2>
          <p className="jh-desc">
            Ambil shift kerja produktif di berbagai sektor strategis (ESDM/Hilirisasi, Birokrasi ASN, Perkebunan/Tol Laut, dan Radar Maritim) untuk mengumpulkan gaji kas Rupiah, EXP pangkat karir, serta pasokan komoditas langsung ke gudang logistik Anda.
          </p>

          {/* Mini Macro Performance Pills */}
          <div className="jh-stats-row">
            <div className="jh-stat-pill">
              <span className="jsp-label">Total Shift Selesai:</span>
              <strong className="jsp-val text-white">{totalShiftsDone} Shift</strong>
            </div>
            <div className="jh-stat-pill">
              <span className="jsp-label">Total Upah Masuk:</span>
              <strong className="jsp-val font-emerald">{formatRupiah(totalEarnedRp)}</strong>
            </div>
            <div className="jh-stat-pill">
              <span className="jsp-label">Kontribusi PPh ke APBN:</span>
              <strong className="jsp-val text-gold">{formatRupiah(totalTaxContributed)}</strong>
            </div>
          </div>
        </div>

        {/* Worker Status Overview */}
        <div className="worker-status-card glass-panel">
          <div className="wsc-top">
            <Zap size={18} className="text-cyan" />
            <span className="wsc-label">Stamina Dinas Saat Ini:</span>
          </div>
          <div className="wsc-stamina-row">
            <strong className="wsc-energy-val text-white">{player?.energy ?? 100} / {player?.maxEnergy ?? 100} ⚡</strong>
            <button 
              className="btn-coffee-mini"
              onClick={() => boostEnergy(25)}
              title="Pulihkan +25 Energi secara instan"
            >
              +25 Kopi
            </button>
          </div>
          <div className="wsc-track">
            <div className="wsc-fill" style={{ width: `${Math.min(100, ((player?.energy ?? 100) / (player?.maxEnergy ?? 100)) * 100)}%` }} />
          </div>
          <div className="wsc-bottom">
            <span>Pangkat: <strong>Lv.{player?.level || 1}</strong></span>
            <span>Bonus Daya Tahan: <strong className="font-emerald">+{((player?.perks?.connections || 10) * 2)}% Upah</strong></span>
          </div>
        </div>
      </div>

      {/* 2. SUBTABS NAVIGASI KERJA */}
      <div className="jobs-subtabs-bar">
        <button 
          className={`job-subtab-btn ${activeSubTab === 'vacancies' ? 'active' : ''}`}
          onClick={() => { sounds.playClick(); setActiveSubTab('vacancies'); }}
        >
          <Briefcase size={16} />
          <span>Lowongan Dinas & Profesi</span>
          <span className="job-badge-pill">{AVAILABLE_JOBS.length}</span>
        </button>
        <button 
          className={`job-subtab-btn ${activeSubTab === 'history' ? 'active' : ''}`}
          onClick={() => { sounds.playClick(); setActiveSubTab('history'); }}
        >
          <History size={16} />
          <span>Riwayat Shift Kerja</span>
          <span className="job-badge-pill">{workHistory.length}</span>
        </button>
        <button 
          className={`job-subtab-btn ${activeSubTab === 'sectors' ? 'active' : ''}`}
          onClick={() => { sounds.playClick(); setActiveSubTab('sectors'); }}
        >
          <Building2 size={16} />
          <span>Direktori Sektor Ketenagakerjaan</span>
          <span className="job-badge-pill">{JOB_SECTORS.length}</span>
        </button>
      </div>

      {/* TAB 1: LOWONGAN DINAS PROFESI AKTIF */}
      {activeSubTab === 'vacancies' && (
        <div className="jobs-vacancies-layout">
          {/* Filter Sektor Pills */}
          <div className="sector-pills-row">
            <button 
              className={`sector-filter-btn ${selectedSectorId === 'all' ? 'active' : ''}`}
              onClick={() => { sounds.playClick(); setSelectedSectorId('all'); }}
            >
              <Briefcase size={14} />
              <span>Semua Sektor ({AVAILABLE_JOBS.length})</span>
            </button>
            {JOB_SECTORS.map((s) => {
              const Icon = getSectorIcon(s.id);
              const countInSector = AVAILABLE_JOBS.filter((j) => j.sectorId === s.id).length;
              return (
                <button 
                  key={s.id}
                  className={`sector-filter-btn ${selectedSectorId === s.id ? 'active' : ''}`}
                  onClick={() => { sounds.playClick(); setSelectedSectorId(s.id); }}
                >
                  <Icon size={14} style={{ color: s.color }} />
                  <span>{s.name} ({countInSector})</span>
                </button>
              );
            })}
          </div>

          {/* Jobs Cards Grid */}
          <div className="jobs-grid">
            {filteredJobs.map((job) => {
              const Icon = getSectorIcon(job.sectorId);
              const isLevelMet = (player?.level || 1) >= job.requiredLevel;
              const hasEnergy = (player?.energy ?? 100) >= job.energyCost;
              const userPerkVal = job.requiredPerk ? (player?.perks?.[job.requiredPerk.name] || 0) : 999;
              const isPerkMet = job.requiredPerk ? userPerkVal >= job.requiredPerk.min : true;
              const isEligible = isLevelMet && hasEnergy && isPerkMet;

              // Bonus connection calculation
              const connBonus = 1 + ((player?.perks?.connections || 10) * 0.02);
              const calculatedWage = Math.round(job.wageRp * connBonus);
              const taxAmount = Math.round(calculatedWage * 0.10);
              const netWage = calculatedWage - taxAmount;

              const ResIcon = getResourceIcon(job.resourceProduced);

              return (
                <div key={job.id} className={`job-card ${!isEligible ? 'locked' : ''}`}>
                  {/* Card Header */}
                  <div className="jc-header">
                    <div className="jc-icon-box" style={{ borderColor: 'rgba(234, 179, 8, 0.25)' }}>
                      <Icon size={22} className="text-gold" />
                    </div>
                    <div className="jc-title-area">
                      <span className="jc-category-tag" style={{ color: '#38bdf8' }}>{job.company}</span>
                      <h3 className="jc-title">{job.title}</h3>
                      <div className="jc-location">
                        <MapPin size={12} className="text-cyan" />
                        <span>{job.location}</span>
                      </div>
                    </div>
                    <span className="jc-badge-quota">Shift Tersedia</span>
                  </div>

                  {/* Card Description */}
                  <p className="jc-desc">{job.description}</p>

                  {/* Reward & Wage Box */}
                  <div className="jc-rewards-box">
                    <div className="jc-reward-item">
                      <Coins size={18} className="font-emerald" />
                      <div className="ri-info">
                        <span className="ri-label">Upah Bersih (+Netto):</span>
                        <strong className="ri-val font-emerald">{formatRupiah(netWage)}</strong>
                      </div>
                    </div>
                    <div className="jc-reward-item">
                      <Award size={18} className="text-gold" />
                      <div className="ri-info">
                        <span className="ri-label">Bonus Pengalaman:</span>
                        <strong className="ri-val text-gold">+{job.rewardExp} EXP</strong>
                      </div>
                    </div>
                    {job.resourceProduced && (
                      <div className="jc-reward-item full-width">
                        <ResIcon size={18} className="text-cyan" />
                        <div className="ri-info">
                          <span className="ri-label">Hasil Produksi Gudang Logistik:</span>
                          <strong className="ri-val text-cyan">
                            +{job.resourceQty} {job.resourceProduced.toUpperCase()} (Langsung Masuk Inventaris)
                          </strong>
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Requirements Row */}
                  <div className="jc-reqs-row">
                    <span>
                      Pangkat: <strong className={isLevelMet ? 'text-white' : 'font-crimson'}>Min. Lv.{job.requiredLevel}</strong> {isLevelMet ? '✓' : `(Anda Lv.${player?.level || 1})`}
                    </span>
                    {job.requiredPerk && (
                      <span>
                        {job.requiredPerk.label}: <strong className={isPerkMet ? 'text-white' : 'font-crimson'}>{userPerkVal}/{job.requiredPerk.min}</strong> {isPerkMet ? '✓' : '✗'}
                      </span>
                    )}
                  </div>

                  {/* Execute Work Button */}
                  <button 
                    className={`btn-work-duty ${!isEligible ? 'disabled' : ''}`}
                    disabled={!isEligible}
                    onClick={() => performJobDuty(job.id)}
                  >
                    <Zap size={16} />
                    <span>
                      {!hasEnergy 
                        ? `Stamina Kurang (Butuh ${job.energyCost} ⚡)` 
                        : !isLevelMet 
                        ? `Terkunci (Butuh Lv.${job.requiredLevel})` 
                        : !isPerkMet 
                        ? `Syarat Stat Belum Cukup` 
                        : `Ambil Shift Kerja (-${job.energyCost} ⚡)`}
                    </span>
                  </button>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* TAB 2: RIWAYAT SHIFT KERJA */}
      {activeSubTab === 'history' && (
        <div className="work-history-view">
          <div className="career-guidance-card">
            <div className="cgc-left">
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '6px' }}>
                <History size={20} className="font-gold" />
                <h4 style={{ margin: 0 }}>Arsip Rekam Jejak Shift & Penggajian Resmi</h4>
              </div>
              <p>
                Seluruh aktivitas pekerjaan produktif Anda diawasi oleh Kementerian Ketenagakerjaan. Pajak penghasilan sebesar 10% langsung dikontribusikan ke Kas Negara APBN untuk mendanai pembangunan nasional.
              </p>
            </div>
            <button 
              className="btn-career-link"
              onClick={() => navigateToPage('budget', setActiveTab)}
            >
              <Coins size={15} />
              <span>Cek Kas Negara / APBN</span>
            </button>
          </div>

          <div className="wh-table-wrapper">
            <table className="wh-table">
              <thead>
                <tr>
                  <th>STATUS</th>
                  <th>PROFESI & DINAS</th>
                  <th>LOKASI & SEKTOR</th>
                  <th>UPAH DITERIMA</th>
                  <th>EXP KARIR</th>
                  <th>PRODUKSI LOGISTIK</th>
                  <th>WAKTU</th>
                </tr>
              </thead>
              <tbody>
                {workHistory.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="wh-empty">
                      Belum ada riwayat shift kerja. Ambil lowongan kerja di tab "Lowongan Dinas & Profesi" untuk mulai mendapatkan penghasilan!
                    </td>
                  </tr>
                ) : (
                  workHistory.map((item) => (
                    <tr key={item.id}>
                      <td>
                        <span className="jc-badge-quota">
                          <CheckCircle2 size={12} style={{ display: 'inline', marginRight: '4px' }} />
                          SELESAI
                        </span>
                      </td>
                      <td>
                        <strong className="text-white">{item.jobTitle}</strong>
                        <div style={{ fontSize: '0.72rem', color: '#94a3b8' }}>{item.company}</div>
                      </td>
                      <td style={{ color: '#94a3b8' }}>{item.location || 'Wilayah Nasional'}</td>
                      <td>
                        <strong className="font-emerald">+{formatRupiah(item.earnedRp)}</strong>
                      </td>
                      <td>
                        <strong className="text-gold">+{item.earnedExp} EXP</strong>
                      </td>
                      <td>
                        {item.resourceBonus ? (
                          <span className="text-cyan font-semibold">{item.resourceBonus}</span>
                        ) : (
                          <span style={{ color: '#64748b' }}>-</span>
                        )}
                      </td>
                      <td style={{ color: '#94a3b8', fontSize: '0.76rem' }}>{item.timeAgo}</td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* TAB 3: DIREKTORI SEKTOR KETENAGAKERJAAN */}
      {activeSubTab === 'sectors' && (
        <div className="jobs-work-viewport">
          <div className="jobs-grid">
            {JOB_SECTORS.map((sec) => {
              const Icon = getSectorIcon(sec.id);
              const count = AVAILABLE_JOBS.filter((j) => j.sectorId === sec.id).length;

              return (
                <div key={sec.id} className="job-card" style={{ borderTop: `3px solid ${sec.color}` }}>
                  <div className="jc-header">
                    <div className="jc-icon-box" style={{ background: `${sec.color}15`, borderColor: sec.color }}>
                      <Icon size={24} style={{ color: sec.color }} />
                    </div>
                    <div className="jc-title-area">
                      <span className="jc-category-tag" style={{ color: sec.color }}>SEKTOR STRATEGIS</span>
                      <h3 className="jc-title">{sec.name}</h3>
                      <div className="jc-location">
                        <Users size={12} className="text-cyan" />
                        <span>{count} Posisi Terbuka Nasional</span>
                      </div>
                    </div>
                  </div>
                  <p className="jc-desc">{sec.description}</p>

                  <button 
                    className="btn-work-duty"
                    onClick={() => {
                      sounds.playClick();
                      setSelectedSectorId(sec.id);
                      setActiveSubTab('vacancies');
                    }}
                  >
                    <span>Jelajahi Lowongan {sec.name}</span>
                    <ArrowRight size={14} />
                  </button>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
