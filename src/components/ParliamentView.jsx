import React, { useState } from 'react';
import { useGame } from '../context/GameContext';
import { sounds } from '../utils/soundEffects';
import { LAW_TEMPLATES } from '../data/legislationData';
import { 
  Landmark, 
  FileText, 
  CheckCircle2, 
  XCircle, 
  MinusCircle, 
  PlusCircle, 
  Clock, 
  Award, 
  Scale, 
  TrendingUp,
  Sparkles,
  Users,
  Filter,
  ShieldAlert,
  ThumbsUp,
  Coins,
  Check,
  Flame,
  Shield,
  HeartHandshake
} from 'lucide-react';

export default function ParliamentView() {
  const { 
    bills, 
    passedLaws, 
    parties, 
    player, 
    voteOnBill, 
    proposeBill,
    nationalState,
    showToast
  } = useGame();

  const [activeTab, setActiveTab] = useState('active'); // 'active', 'passed', 'propose'
  const [selectedFilter, setSelectedFilter] = useState('Semua'); // 'Semua' or Category string
  const [selectedSeat, setSelectedSeat] = useState(null); // info kursi yang diklik

  const [newBillForm, setNewBillForm] = useState({
    title: '',
    category: 'Ekonomi, Perpajakan & Perbankan',
    description: '',
    impactText: '',
    treasuryDelta: 25000000000,
    stabilityDelta: 3,
    supportDelta: 4,
  });

  const playerParty = parties?.find((p) => p.id === player?.partyId) || null;

  const handleProposeSubmit = (e) => {
    e.preventDefault();
    if (!newBillForm.title || !newBillForm.description) {
      if (showToast) showToast('Judul dan naskah penjelasan RUU wajib diisi!', 'error');
      return;
    }
    proposeBill(newBillForm);
    setNewBillForm({
      title: '',
      category: 'Ekonomi, Perpajakan & Perbankan',
      description: '',
      impactText: '',
      treasuryDelta: 25000000000,
      stabilityDelta: 3,
      supportDelta: 4,
    });
    setActiveTab('active');
  };

  const handleApplyTemplate = (tpl) => {
    sounds.playClick();
    setNewBillForm({
      title: tpl.title,
      category: tpl.category,
      description: tpl.description,
      impactText: tpl.impactText,
      treasuryDelta: tpl.treasuryDelta,
      stabilityDelta: tpl.stabilityDelta,
      supportDelta: tpl.supportDelta,
    });
    if (showToast) showToast('Draf RUU akademik berhasil disalin ke formulir!', 'info');
  };

  // Parliamentary Chamber seats rendering (100 dots arranged in semicircular arcs)
  const generateChamberSeats = () => {
    const seats = [];

    // Distribute 100 seats across parties
    parties.forEach((party) => {
      for (let i = 0; i < party.seats; i++) {
        seats.push({
          id: `${party.id}-${i}`,
          color: party.color,
          partyName: party.shortName,
          partyFullName: party.name,
          ideology: party.ideology,
          leader: party.leader,
          seatNo: seats.length + 1
        });
      }
    });

    const rows = [
      { radius: 110, count: 18 },
      { radius: 140, count: 24 },
      { radius: 170, count: 28 },
      { radius: 200, count: 30 },
    ];

    let seatPointer = 0;
    const positionedSeats = [];

    rows.forEach((row, rowIdx) => {
      const angleStep = Math.PI / (row.count + 1);
      for (let i = 1; i <= row.count; i++) {
        const angle = Math.PI - angleStep * i;
        const x = 250 + row.radius * Math.cos(angle);
        const y = 230 - row.radius * Math.sin(angle);
        const seatData = seats[seatPointer] || { 
          color: '#64748b', 
          partyName: 'Independen', 
          partyFullName: 'Kursi Independen Non-Fraksi', 
          ideology: 'Mandat Rakyat',
          leader: 'Aspirasi Daerah',
          seatNo: seatPointer + 1 
        };
        positionedSeats.push({ ...seatData, x, y, key: `${rowIdx}-${i}` });
        seatPointer++;
      }
    });

    return positionedSeats;
  };

  const chamberSeats = generateChamberSeats();

  const filteredBills = bills
    .filter((b) => b.status === 'voting')
    .filter((b) => selectedFilter === 'Semua' || (b.category && b.category.toLowerCase().includes(selectedFilter.toLowerCase())));

  const categoriesList = ['Semua', 'Ekonomi', 'Pertahanan', 'Kesejahteraan', 'Energi', 'Hukum'];

  return (
    <div className="parliament-view-container">
      {/* Top Header Banner */}
      <div className="parliament-hero glass-panel">
        <div className="hero-left">
          <div className="hero-badge">
            <Landmark size={18} /> GEDUNG NUSANTARA PARLEMEN • SENAYAN
          </div>
          <h2 className="hero-title">Sidang Paripurna & Pengesahan Undang-Undang</h2>
          <p className="hero-desc">
            Kekuasaan legislatif tertinggi Republik. Setiap anggota dewan memegang 1 hak suara paripurna
            atas arah APBN negara, regulasi perizinan tambang, dan traktat pertahanan nasional.
          </p>
        </div>

        <div className="hero-status-pills">
          <div className="parliament-pill">
            <span className="pill-sub">Total Kursi Dewan</span>
            <span className="pill-val">100 Kursi Sah</span>
          </div>
          <div className="parliament-pill">
            <span className="pill-sub">Ambang Batas Kuorum</span>
            <span className="pill-val font-gold">51 Suara Setuju</span>
          </div>
          <div className="parliament-pill">
            <span className="pill-sub">Fraksi Anda</span>
            <span className="pill-val font-highlight">
              {playerParty ? `${playerParty.shortName} (${playerParty.seats || 0} Kursi)` : 'Independen / Non-Fraksi'}
            </span>
          </div>
          <div className="parliament-pill">
            <span className="pill-sub">Status Keanggotaan</span>
            <span className="pill-val font-emerald">
              {player?.role === 'superadmin' ? 'Pimpinan Sidang (DPR)' : player?.role === 'moderator' ? 'Panja Kehormatan' : 'Anggota Fraksi'}
            </span>
          </div>
        </div>
      </div>

      {/* Hemicycle Chamber Visualization */}
      <div className="chamber-visual-card glass-panel">
        <div className="chamber-header">
          <h3 className="chamber-title">
            <Users size={16} /> Denah Sidang Paripurna (100 Kursi Fraksi Parlemen)
          </h3>
          <div className="party-legend-row">
            {parties.length === 0 ? (
              <span className="text-muted" style={{ fontSize: '0.85rem' }}>Belum ada fraksi partai terdaftar (100 Kursi Independen Rakyat)</span>
            ) : (
              parties.map((p) => (
                <div key={p.id} className="legend-item" title={`${p.name} - ${p.seats} Kursi (${p.ideology})`}>
                  <span className="legend-dot" style={{ backgroundColor: p.color }} />
                  <span className="legend-name">{p.shortName} ({p.seats} Kursi)</span>
                </div>
              ))
            )}
          </div>
        </div>

        <div className="chamber-svg-container">
          <svg viewBox="0 0 500 260" className="chamber-svg">
            {/* Speaker Podium */}
            <rect x="215" y="215" width="70" height="30" rx="6" fill="#f59e0b" opacity="0.85" />
            <text x="250" y="234" textAnchor="middle" fill="#000" fontSize="9" fontWeight="800" letterSpacing="0.05em">
              MEJA PIMPINAN
            </text>
            <circle cx="250" cy="204" r="5" fill="#fbbf24" stroke="#78350f" strokeWidth="1" />

            {/* Individual Seats */}
            {chamberSeats.map((seat) => (
              <circle
                key={seat.key}
                cx={seat.x}
                cy={seat.y}
                r="6"
                fill={seat.color}
                stroke={selectedSeat?.seatNo === seat.seatNo ? '#ffffff' : '#0f172a'}
                strokeWidth={selectedSeat?.seatNo === seat.seatNo ? '2.5' : '1.5'}
                className="chamber-seat"
                onClick={() => {
                  sounds.playClick();
                  setSelectedSeat(seat);
                }}
                style={{ cursor: 'pointer' }}
              >
                <title>{`Kursi #${seat.seatNo}: Fraksi ${seat.partyName} - ${seat.partyFullName}`}</title>
              </circle>
            ))}
          </svg>
        </div>

        {/* Selected Seat Inspector */}
        {selectedSeat && (
          <div style={{ marginTop: '12px', padding: '10px 14px', background: 'rgba(255,255,255,0.04)', borderRadius: '8px', borderLeft: `4px solid ${selectedSeat.color}`, display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '8px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <span style={{ width: '12px', height: '12px', borderRadius: '50%', backgroundColor: selectedSeat.color, display: 'inline-block' }}></span>
              <span style={{ fontSize: '0.85rem', color: '#f8fafc', fontWeight: 'bold' }}>
                Kursi #{selectedSeat.seatNo} • Fraksi {selectedSeat.partyName} ({selectedSeat.partyFullName})
              </span>
              <span style={{ fontSize: '0.78rem', color: '#94a3b8' }}>
                Ideologi: <em>{selectedSeat.ideology}</em> | Pimpinan: {selectedSeat.leader}
              </span>
            </div>
            <button 
              className="btn-secondary" 
              style={{ padding: '4px 10px', fontSize: '0.75rem' }}
              onClick={() => setSelectedSeat(null)}
            >
              Tutup Info
            </button>
          </div>
        )}
      </div>

      {/* Sub Tabs for Parliament */}
      <div className="parliament-subtabs-nav">
        <button
          className={`subtab-btn ${activeTab === 'active' ? 'active' : ''}`}
          onClick={() => { setActiveTab('active'); sounds.playClick(); }}
        >
          <FileText size={16} /> RUU Dalam Pembahasan ({bills.filter((b) => b.status === 'voting').length})
        </button>
        <button
          className={`subtab-btn ${activeTab === 'passed' ? 'active' : ''}`}
          onClick={() => { setActiveTab('passed'); sounds.playClick(); }}
        >
          <CheckCircle2 size={16} /> Undang-Undang Sah ({passedLaws.length})
        </button>
        <button
          className={`subtab-btn ${activeTab === 'propose' ? 'active' : ''}`}
          onClick={() => { setActiveTab('propose'); sounds.playClick(); }}
        >
          <PlusCircle size={16} /> Ajukan Naskah RUU Baru
        </button>
      </div>

      {/* Tab 1: Active Bills List */}
      {activeTab === 'active' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          {/* Filter Bar */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap', padding: '10px 16px', background: 'rgba(15,23,42,0.6)', borderRadius: '8px', border: '1px solid rgba(255,255,255,0.06)' }}>
            <span style={{ fontSize: '0.8rem', fontWeight: 700, color: '#fbbf24', display: 'flex', alignItems: 'center', gap: '6px' }}>
              <Filter size={14} /> Filter Bidang Komisi:
            </span>
            {categoriesList.map((cat) => (
              <button
                key={cat}
                onClick={() => { setSelectedFilter(cat); sounds.playClick(); }}
                className={selectedFilter === cat ? 'btn-gold' : 'btn-secondary'}
                style={{ fontSize: '0.78rem', padding: '4px 12px', borderRadius: '6px' }}
              >
                {cat}
              </button>
            ))}
          </div>

          <div className="bills-grid">
            {filteredBills.length === 0 ? (
              <div className="empty-state glass-panel">
                <Scale size={36} color="#94a3b8" />
                <h3>Tidak Ada RUU yang Sedang Di-voting untuk Kategori Ini</h3>
                <p>Silakan ajukan naskah RUU baru melalui formulir Badan Legislasi atau pilih filter komisi lain.</p>
                <button className="btn-gold" onClick={() => setActiveTab('propose')}>
                  + Ajukan RUU Baru
                </button>
              </div>
            ) : (
              filteredBills.map((bill) => {
                const totalVotes = (bill.votes?.agree || 0) + (bill.votes?.reject || 0) + (bill.votes?.abstain || 0);
                const percentAgree = Math.min(100, Math.round(((bill.votes?.agree || 0) / 100) * 100));
                const percentReject = Math.min(100, Math.round(((bill.votes?.reject || 0) / 100) * 100));
                const playerVote = player?.votedBills ? player.votedBills[bill.id] : null;

                return (
                  <div key={bill.id} className="bill-card glass-panel">
                    <div className="bill-top">
                      <div className="bill-badges">
                        <span className="badge badge-gold">{bill.category || 'Umum'}</span>
                        <span className="badge badge-cyan">Inisiator: {bill.proposedBy}</span>
                        {bill.komisi && <span className="badge badge-emerald">{bill.komisi}</span>}
                      </div>
                      <div className="bill-timer">
                        <Clock size={14} /> Sisa Sidang: <strong>{bill.timeRemainingSeconds || 0}s</strong>
                      </div>
                    </div>

                    <h3 className="bill-title">{bill.title}</h3>
                    <p className="bill-desc">{bill.description}</p>

                    {/* Impact preview */}
                    <div className="bill-impact-box">
                      <span className="impact-title"><Sparkles size={14} /> Proyeksi Efek Nasional Jika Sah:</span>
                      <p className="impact-text">{bill.impactText}</p>
                    </div>

                    {/* Party Stances Support Map */}
                    {bill.partySupport && Object.keys(bill.partySupport).length > 0 && (
                      <div style={{ marginTop: '8px', padding: '10px 14px', background: 'rgba(0,0,0,0.2)', borderRadius: '8px' }}>
                        <span style={{ fontSize: '0.75rem', fontWeight: 'bold', color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                          Peta Sikap Fraksi Parlemen:
                        </span>
                        <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', marginTop: '6px' }}>
                          {Object.entries(bill.partySupport).map(([partyId, stance]) => {
                            const pObj = parties.find((p) => p.id === partyId);
                            const pName = pObj?.shortName || partyId.toUpperCase();
                            const isAgree = stance === 'agree';
                            const isReject = stance === 'reject';
                            return (
                              <span 
                                key={partyId}
                                style={{
                                  fontSize: '0.75rem',
                                  padding: '2px 8px',
                                  borderRadius: '4px',
                                  border: `1px solid ${isAgree ? '#10b981' : isReject ? '#ef4444' : '#64748b'}`,
                                  background: isAgree ? 'rgba(16,185,129,0.1)' : isReject ? 'rgba(239,68,68,0.1)' : 'rgba(100,116,139,0.1)',
                                  color: isAgree ? '#34d399' : isReject ? '#f87171' : '#94a3b8'
                                }}
                              >
                                {pName}: <strong>{isAgree ? 'SETUJU' : isReject ? 'MENOLAK' : 'ABSTAIN'}</strong>
                              </span>
                            );
                          })}
                        </div>
                      </div>
                    )}

                    {/* Vote Progress Bar */}
                    <div className="voting-tally-container">
                      <div className="tally-labels">
                        <span className="tally-agree font-emerald">
                          Setuju: {bill.votes?.agree || 0} Suara ({percentAgree}%)
                        </span>
                        <span className="tally-target font-gold">
                          Kuorum Minimal: 51 Suara
                        </span>
                        <span className="tally-reject font-crimson">
                          Tolak: {bill.votes?.reject || 0} Suara ({percentReject}%)
                        </span>
                      </div>
                      <div className="tally-track">
                        <div className="tally-fill-agree" style={{ width: `${percentAgree}%` }} />
                        <div className="tally-fill-reject" style={{ width: `${percentReject}%` }} />
                        <div className="quorum-marker" style={{ left: '51%' }} title="Batas Kuorum Sah (51 Kursi)" />
                      </div>
                    </div>

                    {/* Player Voting Actions */}
                    <div className="player-vote-actions">
                      {playerVote ? (
                        <div className="vote-registered-notice">
                          <CheckCircle2 size={16} className="font-emerald" />
                          <span>
                            Hak Pilih Anda: <strong>{playerVote.toUpperCase()}</strong> (Telah Tercatat Sah di Risalah Paripurna)
                          </span>
                        </div>
                      ) : (
                        <div className="action-buttons-row">
                          <span className="cast-prompt">Berikan Suara Parlemen Anda (1 Kursi):</span>
                          <button
                            className="btn-emerald vote-btn"
                            onClick={() => voteOnBill(bill.id, 'agree')}
                          >
                            <CheckCircle2 size={16} /> SETUJU
                          </button>
                          <button
                            className="btn-crimson vote-btn"
                            onClick={() => voteOnBill(bill.id, 'reject')}
                          >
                            <XCircle size={16} /> TOLAK
                          </button>
                          <button
                            className="btn-secondary vote-btn"
                            onClick={() => voteOnBill(bill.id, 'abstain')}
                          >
                            <MinusCircle size={16} /> ABSTAIN
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>
      )}

      {/* Tab 2: Passed Laws Archive */}
      {activeTab === 'passed' && (
        <div className="laws-archive-list">
          {passedLaws.length === 0 ? (
            <div className="empty-state glass-panel">
              <Award size={36} color="#94a3b8" />
              <h3>Belum Ada UU yang Disahkan</h3>
              <p>RUU yang berhasil mencapai kuorum 51 suara sah akan diundangkan dan masuk ke dalam Lembaran Negara Republik.</p>
            </div>
          ) : (
            passedLaws.map((law) => (
              <div key={law.id} className="passed-law-card glass-panel">
                <div className="law-status-seal">
                  <Award size={22} color="#f59e0b" />
                  <span>BERLAKU</span>
                </div>
                <div className="law-content">
                  <div className="law-meta">
                    <span className="badge badge-emerald">{law.category}</span>
                    <span className="law-year">Tahun Pengesahan: {law.passedYear}</span>
                    <span className="law-sponsor">Inisiator: {law.sponsor}</span>
                  </div>
                  <h4 className="law-title">{law.title}</h4>
                  <p className="law-summary">{law.summary}</p>
                  <div className="law-buff-tag">
                    <strong>Efek Positif Aktif Nasional:</strong> {law.activeBuff}
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      )}

      {/* Tab 3: Propose Bill Form */}
      {activeTab === 'propose' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          {/* Template Quick Select (Jika tersedia) */}
          {LAW_TEMPLATES.length > 0 && (
            <div className="glass-panel" style={{ padding: '20px' }}>
              <h4 style={{ margin: '0 0 10px 0', color: '#fbbf24', display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.95rem' }}>
                <Sparkles size={16} /> Rekomendasi Naskah Akademik RUU (Template Cepat):
              </h4>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '12px' }}>
                {LAW_TEMPLATES.map((tpl, idx) => (
                  <div 
                    key={idx} 
                    style={{
                      padding: '12px 14px',
                      borderRadius: '8px',
                      border: '1px solid rgba(255,255,255,0.08)',
                      background: 'rgba(15,23,42,0.6)',
                      cursor: 'pointer',
                      display: 'flex',
                      flexDirection: 'column',
                      justifyContent: 'space-between',
                      gap: '8px',
                      transition: 'border-color 0.2s'
                    }}
                    onClick={() => handleApplyTemplate(tpl)}
                    onMouseEnter={(e) => e.currentTarget.style.borderColor = '#fbbf24'}
                    onMouseLeave={(e) => e.currentTarget.style.borderColor = 'rgba(255,255,255,0.08)'}
                  >
                    <div>
                      <span style={{ fontSize: '0.72rem', color: '#38bdf8', fontWeight: 'bold' }}>{tpl.komisi}</span>
                      <h5 style={{ margin: '4px 0', fontSize: '0.85rem', color: '#f8fafc' }}>{tpl.title}</h5>
                      <p style={{ margin: 0, fontSize: '0.75rem', color: '#94a3b8', lineHeight: 1.4 }}>
                        {tpl.description.substring(0, 85)}...
                      </p>
                    </div>
                    <button className="btn-secondary" style={{ padding: '4px 8px', fontSize: '0.72rem', alignSelf: 'flex-start' }}>
                      + Gunakan Draf Ini
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Form */}
          <div className="propose-form-container glass-panel">
            <div className="form-header">
              <h3><FileText size={18} /> Pendaftaran Naskah Rancangan Undang-Undang</h3>
              <p>
                Setiap anggota dewan berhak mendaftarkan draf RUU. Diperlukan stat Intelektual minimal 15 
                dan biaya administrasi penelitian riset akademik sebesar Rp 20.000.000 dari kas pribadi.
              </p>
            </div>

            <form onSubmit={handleProposeSubmit} className="bill-propose-form">
              <div className="form-group">
                <label>Judul Naskah RUU:</label>
                <input
                  type="text"
                  placeholder="Contoh: RUU Penguatan Ekosistem Semikonduktor & Riset Kecerdasan Buatan"
                  value={newBillForm.title}
                  onChange={(e) => setNewBillForm({ ...newBillForm, title: e.target.value })}
                  required
                  className="form-input"
                />
              </div>

              <div className="form-grid-2">
                <div className="form-group">
                  <label>Bidang Komisi Terkait:</label>
                  <select
                    value={newBillForm.category}
                    onChange={(e) => setNewBillForm({ ...newBillForm, category: e.target.value })}
                    className="form-select"
                  >
                    <option value="Ekonomi, Perpajakan & Perbankan">Komisi XI - Ekonomi, Fiskal & Perbankan</option>
                    <option value="Pertahanan, ZEE & Hubungan Internasional">Komisi I - Pertahanan & Diplomasi Maritim</option>
                    <option value="Energi, Pertambangan & Hilirisasi">Komisi VII - Energi, Tambang & Hilirisasi</option>
                    <option value="Kesejahteraan Sosial, Pertanian & Pangan">Komisi IV - Pangan, Pertanian & Kesejahteraan</option>
                    <option value="Hukum, Keadilan & Tata Negara">Komisi III - Penegakan Hukum & Konstitusi</option>
                  </select>
                </div>

                <div className="form-group">
                  <label>Proyeksi Perubahan Kas Negara (APBN):</label>
                  <select
                    value={newBillForm.treasuryDelta}
                    onChange={(e) => setNewBillForm({ ...newBillForm, treasuryDelta: parseInt(e.target.value) })}
                    className="form-select"
                  >
                    <option value={28000000000}>+ $RP 28 Triliun (Pajak Ekspor / Efisiensi BUMN)</option>
                    <option value={15000000000}>+ $RP 15 Triliun (Dividen Sumber Daya)</option>
                    <option value={-12000000000}>- $RP 12 Triliun (Alokasi Subsidi Petani & Pangan)</option>
                    <option value={-22000000000}>- $RP 22 Triliun (Alutsista Pertahanan & Satelit)</option>
                  </select>
                </div>
              </div>

              <div className="form-group">
                <label>Naskah Akademik & Pokok-Pokok Kebijakan:</label>
                <textarea
                  rows={4}
                  placeholder="Uraikan latar belakang urgensi, pasal-pasal kunci, dan jaminan konstitusional yang diatur dalam regulasi ini..."
                  value={newBillForm.description}
                  onChange={(e) => setNewBillForm({ ...newBillForm, description: e.target.value })}
                  required
                  className="form-textarea"
                />
              </div>

              <div className="form-group">
                <label>Proyeksi Dampak Publik:</label>
                <input
                  type="text"
                  placeholder="Contoh: +10% Kemandirian Riset, +7% Lapangan Kerja Domestik, +5% Stabilitas Pasar"
                  value={newBillForm.impactText}
                  onChange={(e) => setNewBillForm({ ...newBillForm, impactText: e.target.value })}
                  className="form-input"
                />
              </div>

              <div className="form-actions">
                <button type="submit" className="btn-gold" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <Scale size={16} /> Daftarkan ke Pimpinan Sidang (Biaya Rp 20 Jt)
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
