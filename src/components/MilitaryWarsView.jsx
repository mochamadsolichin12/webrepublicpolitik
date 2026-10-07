import React, { useState } from 'react';
import { useGame } from '../context/GameContext';
import { sounds } from '../utils/soundEffects';
import { navigateToPage } from '../utils/navigation';
import { MILITARY_UNITS } from '../data/militaryWarsData';
import { 
  ShieldAlert, 
  Swords, 
  Crosshair, 
  Flame, 
  Shield, 
  Flag, 
  Zap, 
  Coins, 
  MapPin, 
  Timer, 
  AlertTriangle, 
  Award, 
  Users, 
  ChevronRight,
  Plane,
  Anchor,
  Clock,
  Send,
  PlusCircle,
  HelpCircle,
  History
} from 'lucide-react';

export default function MilitaryWarsView() {
  const { 
    player, 
    activeWars, 
    warHistory, 
    regions, 
    deployMilitaryTroops, 
    declareWar, 
    setSelectedRegionId,
    setActiveTab,
    showToast 
  } = useGame();

  const [selectedWarId, setSelectedWarId] = useState(activeWars[0]?.id || null);
  const [selectedSide, setSelectedSide] = useState('defender'); // 'defender' | 'attacker'
  const [selectedUnitId, setSelectedUnitId] = useState(MILITARY_UNITS[0].id);
  const [deployCount, setDeployCount] = useState(1);
  const [isDeclaringWar, setIsDeclaringWar] = useState(false);
  const [targetRegionId, setTargetRegionId] = useState(regions[0]?.id || 'dki');
  const [customWarTitle, setCustomWarTitle] = useState('');
  const [warSubTab, setWarSubTab] = useState('active'); // 'active' | 'history' | 'armory'

  const activeWar = activeWars.find((w) => w.id === selectedWarId) || activeWars[0];
  const selectedUnit = MILITARY_UNITS.find((u) => u.id === selectedUnitId) || MILITARY_UNITS[0];

  const formatRupiah = (val) => {
    if (val >= 1e12) return `$RP ${(val / 1e12).toFixed(2)} Triliun`;
    if (val >= 1e9) return `$RP ${(val / 1e9).toFixed(2)} Miliar`;
    if (val >= 1e6) return `$RP ${(val / 1e6).toFixed(1)} Juta`;
    return `$RP ${(val || 0).toLocaleString('id-ID')}`;
  };

  const handleDeploy = () => {
    if (!activeWar) return;
    deployMilitaryTroops(activeWar.id, selectedSide, selectedUnit, deployCount);
  };

  const handleDeclareWarSubmit = (e) => {
    e.preventDefault();
    declareWar(targetRegionId, customWarTitle);
    setIsDeclaringWar(false);
    setCustomWarTitle('');
  };

  const handleFlyToRegion = (regionId) => {
    sounds.playClick();
    setSelectedRegionId(regionId);
    navigateToPage('map', setActiveTab);
  };

  // Unit icon helper
  const getUnitIcon = (unitId) => {
    switch(unitId) {
      case 'infantry': return Swords;
      case 'tanks': return Shield;
      case 'jets': return Plane;
      case 'warships': return Anchor;
      case 'missiles': return Crosshair;
      default: return Swords;
    }
  };

  return (
    <div className="military-wars-viewport">
      {/* 1. HERO BANNER MILITER & KOMANDO PERANG */}
      <div className="wars-hero glass-panel-gold">
        <div className="wh-left">
          <div className="wh-badge">
            <ShieldAlert size={18} className="font-crimson animate-pulse" />
            <span>KOMANDO PERTAHANAN & OPERASI PERANG GEOPOLITIK</span>
          </div>
          <h2 className="wh-title">Front Peperangan & Perebutan Wilayah</h2>
          <p className="wh-desc">
            Pertahankan integritas kedaulatan kepulauan NKRI dari manuver separatis dan armada asing, atau kerahkan gugus tempur untuk memperluas hegemoni perbatasan (Border Wars ala Rival Regions).
          </p>
        </div>

        <div className="wh-right-actions">
          <button 
            className="btn-gold btn-declare-war"
            onClick={() => { sounds.playClick(); setIsDeclaringWar(!isDeclaringWar); }}
          >
            <PlusCircle size={16} />
            <span>{isDeclaringWar ? 'Batal Deklarasi' : 'Buka Front Perang Baru'}</span>
          </button>
        </div>
      </div>

      {/* 2. FORM DEKLARASI PERANG BARU (JIKA DIKLIK) */}
      {isDeclaringWar && (
        <form onSubmit={handleDeclareWarSubmit} className="declare-war-card glass-panel-crimson animate-slideDown">
          <div className="dw-header">
            <AlertTriangle size={20} className="font-crimson" />
            <h3 className="dw-title">Deklarasi Operasi Militer Khusus</h3>
          </div>
          <p className="dw-desc">
            Membuka front pertempuran membutuhkan biaya logistik <strong>Rp 50.000.000</strong> dan akan memicu darurat militer di provinsi sasaran.
          </p>
          <div className="dw-grid">
            <div className="form-group">
              <label className="form-label">Wilayah / Provinsi Sasaran:</label>
              <select 
                className="form-input form-select"
                value={targetRegionId}
                onChange={(e) => setTargetRegionId(e.target.value)}
              >
                {regions.map((r) => (
                  <option key={r.id} value={r.id}>
                    {r.name} ({r.island.toUpperCase()}) - Dominan: {r.dominantPartyId ? r.dominantPartyId.toUpperCase() : 'INDEP'}
                  </option>
                ))}
              </select>
            </div>
            <div className="form-group">
              <label className="form-label">Nama Operasi Sandi Perang:</label>
              <input 
                type="text" 
                className="form-input" 
                value={customWarTitle}
                onChange={(e) => setCustomWarTitle(e.target.value)}
                placeholder="Contoh: Operasi Seroja II / Perebutan Selat Sunda"
                required
              />
            </div>
          </div>
          <div className="form-actions-row">
            <button type="submit" className="btn-crimson">
              <Swords size={16} /> Kerahkan Armada & Buka Front
            </button>
            <button 
              type="button" 
              className="btn-secondary" 
              onClick={() => setIsDeclaringWar(false)}
            >
              Batal
            </button>
          </div>
        </form>
      )}

      {/* 3. TABS NAVIGASI SUB-MODUL PERANG */}
      <div className="wars-subtabs-bar">
        <button 
          className={`wars-subtab-btn ${warSubTab === 'active' ? 'active' : ''}`}
          onClick={() => { sounds.playClick(); setWarSubTab('active'); }}
        >
          <Flame size={16} className="text-crimson" />
          <span>Front Pertempuran Aktif ({activeWars.length})</span>
        </button>
        <button 
          className={`wars-subtab-btn ${warSubTab === 'armory' ? 'active' : ''}`}
          onClick={() => { sounds.playClick(); setWarSubTab('armory'); }}
        >
          <Shield size={16} className="text-cyan" />
          <span>Pusat Arsenal & Doktrin Senjata</span>
        </button>
        <button 
          className={`wars-subtab-btn ${warSubTab === 'history' ? 'active' : ''}`}
          onClick={() => { sounds.playClick(); setWarSubTab('history'); }}
        >
          <History size={16} className="text-gold" />
          <span>Arsip Kemenangan Militer</span>
        </button>
      </div>

      {/* TAB 1: FRONT PERTEMPURAN AKTIF */}
      {warSubTab === 'active' && activeWar && (
        <div className="active-war-room-grid">
          {/* Sisi Kiri: Daftar Front Perang Aktif */}
          <div className="wars-list-col">
            <h3 className="col-heading">Peta Front Konflik</h3>
            <div className="wars-selector-list">
              {activeWars.map((war) => {
                const isSelected = war.id === activeWar.id;
                const totalDmg = war.attacker.damage + war.defender.damage;
                const defPercent = Math.round((war.defender.damage / totalDmg) * 100);

                return (
                  <div 
                    key={war.id} 
                    className={`war-card-item ${isSelected ? 'selected' : ''}`}
                    onClick={() => { sounds.playClick(); setSelectedWarId(war.id); }}
                  >
                    <div className="wci-top">
                      <span className="wci-title">{war.title}</span>
                      <span className="wci-timer">
                        <Clock size={12} /> {Math.floor(war.timeRemainingSeconds / 60)}m {war.timeRemainingSeconds % 60}s
                      </span>
                    </div>
                    <div className="wci-region-tag">
                      <MapPin size={12} className="text-cyan" />
                      <span>{war.targetRegionName}</span>
                    </div>
                    {/* Frontline balance bar */}
                    <div className="wci-progress-track">
                      <div 
                        className="wci-progress-fill fill-defender" 
                        style={{ width: `${defPercent}%` }}
                        title={`Pertahanan NKRI: ${defPercent}%`}
                      />
                      <div 
                        className="wci-progress-fill fill-attacker" 
                        style={{ width: `${100 - defPercent}%` }}
                        title={`Pasukan Penyerang: ${100 - defPercent}%`}
                      />
                    </div>
                    <div className="wci-bottom">
                      <span className="text-emerald">🛡️ {war.defender.damage.toLocaleString()}</span>
                      <span className="wci-round">Ronde #{war.currentRound}</span>
                      <span className="text-crimson">⚔️ {war.attacker.damage.toLocaleString()}</span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Sisi Kanan: Arena Medan Pertempuran & Deployment Tempur */}
          <div className="war-arena-col glass-panel-gold">
            <div className="arena-header">
              <div className="ah-meta">
                <span className="ah-tag">STATUS: DARURAT MILITER AKTIF</span>
                <h3 className="ah-title">{activeWar.title}</h3>
                <p className="ah-desc">{activeWar.description}</p>
              </div>
              <button 
                className="btn-fly-loc"
                onClick={() => handleFlyToRegion(activeWar.targetRegionId)}
                title="Buka peta dan lihat lokasi wilayah sengketa"
              >
                <MapPin size={14} /> Lihat di Peta
              </button>
            </div>

            {/* Duel Frontline Cards */}
            <div className="frontline-duel-grid">
              {/* Sisi Defender (NKRI) */}
              <div className={`duel-side-card card-defender ${selectedSide === 'defender' ? 'side-active' : ''}`} onClick={() => setSelectedSide('defender')}>
                <div className="dsc-badge-side">GARIS PERTAHANAN</div>
                <div className="dsc-commander-row">
                  <span className="dsc-flag">{activeWar.defender.flag}</span>
                  <div>
                    <h4 className="dsc-name">{activeWar.defender.name}</h4>
                    <span className="dsc-com">Panglima: {activeWar.defender.commander}</span>
                  </div>
                </div>
                <div className="dsc-score-box">
                  <span className="dsb-label">TOTAL KERUSAKAN PERTAHANAN:</span>
                  <strong className="dsb-val text-emerald">{activeWar.defender.damage.toLocaleString()} PTS</strong>
                </div>
                <div className="dsc-troopers">
                  <Users size={14} />
                  <span>{activeWar.defender.participants} Patriot Bergabung</span>
                </div>
                <button 
                  className={`btn-side-select ${selectedSide === 'defender' ? 'active' : ''}`}
                  onClick={() => setSelectedSide('defender')}
                >
                  {selectedSide === 'defender' ? '✓ Membela Pertahanan' : 'Pilih Sisi Pertahanan'}
                </button>
              </div>

              {/* VS BADGE */}
              <div className="duel-vs-badge">
                <div className="vs-circle">VS</div>
                <span className="vs-time">Ronde {activeWar.currentRound}</span>
              </div>

              {/* Sisi Attacker */}
              <div className={`duel-side-card card-attacker ${selectedSide === 'attacker' ? 'side-active' : ''}`} onClick={() => setSelectedSide('attacker')}>
                <div className="dsc-badge-side attacker">GARIS PENYERANG</div>
                <div className="dsc-commander-row">
                  <span className="dsc-flag">{activeWar.attacker.flag}</span>
                  <div>
                    <h4 className="dsc-name">{activeWar.attacker.name}</h4>
                    <span className="dsc-com">Komandan: {activeWar.attacker.commander}</span>
                  </div>
                </div>
                <div className="dsc-score-box">
                  <span className="dsb-label">TOTAL KERUSAKAN PENYERANG:</span>
                  <strong className="dsb-val text-crimson">{activeWar.attacker.damage.toLocaleString()} PTS</strong>
                </div>
                <div className="dsc-troopers">
                  <Users size={14} />
                  <span>{activeWar.attacker.participants} Pasukan Bergabung</span>
                </div>
                <button 
                  className={`btn-side-select ${selectedSide === 'attacker' ? 'active' : ''}`}
                  onClick={() => setSelectedSide('attacker')}
                >
                  {selectedSide === 'attacker' ? '✓ Membela Penyerang' : 'Pilih Sisi Penyerang'}
                </button>
              </div>
            </div>

            {/* Tactical Deployment Box */}
            <div className="tactical-deploy-box">
              <h4 className="tdb-title">
                <Crosshair size={18} className="text-cyan" />
                <span>Mobilisasi & Penyerangan Taktis (Kirim Batalyon)</span>
              </h4>
              <p className="tdb-sub">
                Pilih unit militer Anda dan kerahkan ke front pertempuran untuk menorehkan damage dan mendapatkan EXP serta Emas.
              </p>

              {/* Units Picker */}
              <div className="units-picker-grid">
                {MILITARY_UNITS.map((unit) => {
                  const isUnitSelected = unit.id === selectedUnit.id;
                  const Icon = getUnitIcon(unit.id);

                  return (
                    <div 
                      key={unit.id}
                      className={`unit-pick-card ${isUnitSelected ? 'active' : ''}`}
                      onClick={() => { sounds.playClick(); setSelectedUnitId(unit.id); }}
                    >
                      <div className="upc-icon" style={{ backgroundColor: `${unit.color}20`, color: unit.color }}>
                        <Icon size={22} />
                      </div>
                      <strong className="upc-name">{unit.name}</strong>
                      <span className="upc-type">{unit.type}</span>
                      <div className="upc-stats">
                        <span className="text-emerald">ATK: +{unit.attack}</span>
                        <span className="text-cyan">DEF: +{unit.defense}</span>
                      </div>
                      <div className="upc-cost">
                        <span><Zap size={11} /> {unit.energyCost} Nrg</span>
                        <span><Coins size={11} /> {(unit.moneyCost / 1e6).toFixed(1)}Jt</span>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Deployment Bar Controls */}
              <div className="deploy-controls-bar">
                <div className="dcb-multipliers">
                  <span className="dcb-label">Jumlah Unit:</span>
                  {[1, 5, 10, 25].map((multiplier) => (
                    <button
                      key={multiplier}
                      className={`multiplier-btn ${deployCount === multiplier ? 'active' : ''}`}
                      onClick={() => { sounds.playClick(); setDeployCount(multiplier); }}
                    >
                      {multiplier}x
                    </button>
                  ))}
                </div>

                <div className="dcb-totals-info">
                  <div className="total-item">
                    <span>Biaya Energi:</span>
                    <strong className="text-cyan"><Zap size={13} /> {selectedUnit.energyCost * deployCount} / {player?.energy ?? 100}</strong>
                  </div>
                  <div className="total-item">
                    <span>Biaya Logistik:</span>
                    <strong className="text-emerald"><Coins size={13} /> {formatRupiah(selectedUnit.moneyCost * deployCount)}</strong>
                  </div>
                </div>

                <button 
                  className={`btn-launch-attack ${selectedSide === 'defender' ? 'btn-defend' : 'btn-attack'}`}
                  onClick={handleDeploy}
                >
                  <Send size={16} />
                  <span>
                    Serang Sisi {selectedSide === 'defender' ? 'Pertahanan' : 'Penyerang'} ({deployCount}x)
                  </span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: ARSENAL & DOKTRIN SENJATA */}
      {warSubTab === 'armory' && (
        <div className="armory-showcase-grid">
          {MILITARY_UNITS.map((u) => {
            const Icon = getUnitIcon(u.id);
            return (
              <div key={u.id} className="armory-detail-card glass-panel-gold">
                <div className="adc-top">
                  <div className="adc-icon-box" style={{ backgroundColor: `${u.color}25`, color: u.color }}>
                    <Icon size={32} />
                  </div>
                  <div className="adc-title-wrap">
                    <span className="adc-badge" style={{ borderColor: u.color, color: u.color }}>{u.type}</span>
                    <h3 className="adc-name">{u.name}</h3>
                  </div>
                </div>
                <p className="adc-desc">{u.description}</p>
                <div className="adc-metrics-row">
                  <div className="adc-metric">
                    <span>DAYA GUGUR (ATK):</span>
                    <strong className="text-crimson">+{u.attack} Poin</strong>
                  </div>
                  <div className="adc-metric">
                    <span>KETAHANAN (DEF):</span>
                    <strong className="text-emerald">+{u.defense} Poin</strong>
                  </div>
                  <div className="adc-metric">
                    <span>KONSUMSI STAMINA:</span>
                    <strong className="text-cyan">{u.energyCost} Energi</strong>
                  </div>
                  <div className="adc-metric">
                    <span>ANGGARAN HARGA:</span>
                    <strong className="text-gold">{formatRupiah(u.moneyCost)}</strong>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* TAB 3: ARSIP KEMENANGAN MILITER */}
      {warSubTab === 'history' && (
        <div className="history-archive-container glass-panel-gold">
          <div className="hac-header">
            <Award size={22} className="font-gold" />
            <div>
              <h3 className="hac-title">Risalah Kemenangan & Sejarah Operasi Militer</h3>
              <p className="hac-subtitle">Catatan historis operasi gabungan TNI dan koalisi rakyat dalam menjaga integritas wilayah kedaulatan.</p>
            </div>
          </div>
          <div className="hac-list">
            {warHistory.map((hist) => (
              <div key={hist.id} className="hac-row">
                <div className="hac-badge">MENANG</div>
                <div className="hac-info">
                  <h4 className="hac-war-name">{hist.warTitle}</h4>
                  <span className="hac-score">Hasil Akhir: {hist.finalScore} • Waktu: {hist.date}</span>
                </div>
                <div className="hac-impact">
                  <span className="hac-impact-label">Dampak Strategis:</span>
                  <span className="hac-impact-val font-emerald">{hist.impact}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
