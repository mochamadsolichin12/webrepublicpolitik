import React, { useState } from 'react';
import { useGame } from '../context/GameContext';
import { sounds } from '../utils/soundEffects';
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
  Users
} from 'lucide-react';

export default function ParliamentView() {
  const { 
    bills, 
    passedLaws, 
    parties, 
    player, 
    voteOnBill, 
    proposeBill,
    nationalState
  } = useGame();

  const [activeTab, setActiveTab] = useState('active'); // 'active', 'passed', 'propose'
  const [newBillForm, setNewBillForm] = useState({
    title: '',
    category: 'Ekonomi & Investasi',
    description: '',
    impactText: '',
    treasuryDelta: 15000000000,
    stabilityDelta: 3,
    supportDelta: 4,
  });

  const playerParty = parties?.find((p) => p.id === player?.partyId) || null;

  const handleProposeSubmit = (e) => {
    e.preventDefault();
    if (!newBillForm.title || !newBillForm.description) return;
    proposeBill(newBillForm);
    setNewBillForm({
      title: '',
      category: 'Ekonomi & Investasi',
      description: '',
      impactText: '',
      treasuryDelta: 15000000000,
      stabilityDelta: 3,
      supportDelta: 4,
    });
    setActiveTab('active');
  };

  // Parliamentary Chamber seats rendering (100 dots arranged in semicircular arcs)
  const generateChamberSeats = () => {
    const seats = [];
    let partyIdx = 0;
    let seatsAllocated = 0;

    // Distribute 100 seats across parties
    parties.forEach((party) => {
      for (let i = 0; i < party.seats; i++) {
        seats.push({
          id: `${party.id}-${i}`,
          color: party.color,
          partyName: party.shortName,
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
        const seatData = seats[seatPointer] || { color: '#64748b', partyName: 'Independen' };
        positionedSeats.push({ ...seatData, x, y, key: `${rowIdx}-${i}` });
        seatPointer++;
      }
    });

    return positionedSeats;
  };

  const chamberSeats = generateChamberSeats();

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
            Kekuasaan legislatif tertinggi Republik. Setiap anggota dewan memegang hak voting 
            atas pengeluaran kas negara, regulasi pertambangan, dan kebijakan publik.
          </p>
        </div>

        <div className="hero-status-pills">
          <div className="parliament-pill">
            <span className="pill-sub">Total Kursi Dewan</span>
            <span className="pill-val">100 Kursi</span>
          </div>
          <div className="parliament-pill">
            <span className="pill-sub">Ambang Batas Kuorum</span>
            <span className="pill-val font-gold">51 Suara Sah</span>
          </div>
          <div className="parliament-pill">
            <span className="pill-sub">Fraksi Anda</span>
            <span className="pill-val font-highlight">
              {playerParty ? `${playerParty.shortName} (${playerParty.seats || 0} Kursi)` : 'Independen / Non-Fraksi'}
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
                <div key={p.id} className="legend-item">
                  <span className="legend-dot" style={{ backgroundColor: p.color }} />
                  <span className="legend-name">{p.shortName} ({p.seats})</span>
                </div>
              ))
            )}
          </div>
        </div>

        <div className="chamber-svg-container">
          <svg viewBox="0 0 500 260" className="chamber-svg">
            {/* Speaker Podium */}
            <rect x="220" y="220" width="60" height="25" rx="5" fill="#f59e0b" opacity="0.8" />
            <text x="250" y="237" textAnchor="middle" fill="#000" fontSize="10" fontWeight="bold">
              PODIUM
            </text>
            <circle cx="250" cy="210" r="4" fill="#fbbf24" />

            {/* Individual Seats */}
            {chamberSeats.map((seat) => (
              <circle
                key={seat.key}
                cx={seat.x}
                cy={seat.y}
                r="5.5"
                fill={seat.color}
                stroke="#0f172a"
                strokeWidth="1.5"
                className="chamber-seat"
              >
                <title>{seat.partyName}</title>
              </circle>
            ))}
          </svg>
        </div>
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
        <div className="bills-grid">
          {bills.filter((b) => b.status === 'voting').length === 0 ? (
            <div className="empty-state glass-panel">
              <Scale size={36} color="#94a3b8" />
              <h3>Tidak Ada RUU yang Sedang Di-voting Saat Ini</h3>
              <p>Ajukan naskah RUU baru melalui Badan Legislasi Parlemen untuk dibahas di sidang paripurna.</p>
              <button className="btn-gold" onClick={() => setActiveTab('propose')}>
                + Ajukan RUU Baru
              </button>
            </div>
          ) : (
            bills
              .filter((b) => b.status === 'voting')
              .map((bill) => {
                const totalVotesCast = bill.votes.agree + bill.votes.reject + bill.votes.abstain;
                const percentAgree = Math.round((bill.votes.agree / 100) * 100);
                const percentReject = Math.round((bill.votes.reject / 100) * 100);
                const playerVote = player?.votedBills ? player.votedBills[bill.id] : null;

                return (
                  <div key={bill.id} className="bill-card glass-panel">
                    <div className="bill-top">
                      <div className="bill-badges">
                        <span className="badge badge-gold">{bill.category}</span>
                        <span className="badge badge-cyan">Inisiator: {bill.proposedBy}</span>
                      </div>
                      <div className="bill-timer">
                        <Clock size={14} /> Sisa Waktu Sidang: <strong>{bill.timeRemainingSeconds}s</strong>
                      </div>
                    </div>

                    <h3 className="bill-title">{bill.title}</h3>
                    <p className="bill-desc">{bill.description}</p>

                    {/* Impact preview */}
                    <div className="bill-impact-box">
                      <span className="impact-title"><Sparkles size={14} /> Proyeksi Dampak Nasional:</span>
                      <p className="impact-text">{bill.impactText}</p>
                    </div>

                    {/* Vote Progress Bar */}
                    <div className="voting-tally-container">
                      <div className="tally-labels">
                        <span className="tally-agree font-emerald">
                          Setuju: {bill.votes.agree} ({percentAgree}%)
                        </span>
                        <span className="tally-target font-gold">
                          Ambang Batas Sah: 51 Suara
                        </span>
                        <span className="tally-reject font-crimson">
                          Tolak: {bill.votes.reject} ({percentReject}%)
                        </span>
                      </div>
                      <div className="tally-track">
                        <div className="tally-fill-agree" style={{ width: `${bill.votes.agree}%` }} />
                        <div className="tally-fill-reject" style={{ width: `${bill.votes.reject}%` }} />
                        <div className="quorum-marker" style={{ left: '51%' }} title="Batas Kuorum (51 Suara)" />
                      </div>
                    </div>

                    {/* Player Voting Actions */}
                    <div className="player-vote-actions">
                      {playerVote ? (
                        <div className="vote-registered-notice">
                          <CheckCircle2 size={16} className="font-emerald" />
                          <span>
                            Suara Anda: <strong>{playerVote.toUpperCase()}</strong> (Telah Terdaftar di Risalah)
                          </span>
                        </div>
                      ) : (
                        <div className="action-buttons-row">
                          <span className="cast-prompt">Tentukan Sikap Politik Anda:</span>
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
      )}

      {/* Tab 2: Passed Laws Archive */}
      {activeTab === 'passed' && (
        <div className="laws-archive-list">
          {passedLaws.map((law) => (
            <div key={law.id} className="passed-law-card glass-panel">
              <div className="law-status-seal">
                <Award size={20} color="#f59e0b" />
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
                  <strong>Efek UU Aktif:</strong> {law.activeBuff}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Tab 3: Propose Bill Form */}
      {activeTab === 'propose' && (
        <div className="propose-form-container glass-panel">
          <div className="form-header">
            <h3><FileText size={18} /> Pendaftaran Naskah Rancangan Undang-Undang</h3>
            <p>
              Setiap anggota Parlemen berhak mengajukan RUU inisiatif. Dibutuhkan stat Intelektual 
              minimal 15 dan biaya naskah akademik Rp 20.000.000.
            </p>
          </div>

          <form onSubmit={handleProposeSubmit} className="bill-propose-form">
            <div className="form-group">
              <label>Judul RUU:</label>
              <input
                type="text"
                placeholder="Contoh: RUU Penguatan BUMN Pertambangan dan Hilirisasi Daerah"
                value={newBillForm.title}
                onChange={(e) => setNewBillForm({ ...newBillForm, title: e.target.value })}
                required
                className="form-input"
              />
            </div>

            <div className="form-grid-2">
              <div className="form-group">
                <label>Komisi / Kategori:</label>
                <select
                  value={newBillForm.category}
                  onChange={(e) => setNewBillForm({ ...newBillForm, category: e.target.value })}
                  className="form-select"
                >
                  <option value="Ekonomi & Investasi">Komisi XI - Ekonomi & Fiskal</option>
                  <option value="Pertahanan & Keamanan">Komisi I - Pertahanan & Hubungan Luar Negeri</option>
                  <option value="Energi & Sumber Daya Alam">Komisi VII - Energi, Mineral & Hilirisasi</option>
                  <option value="Kesejahteraan Sosial & Pangan">Komisi IV - Pertanian, Kelautan & Pangan</option>
                  <option value="Hukum & Tata Negara">Komisi III - Penegakan Hukum & HAM</option>
                </select>
              </div>

              <div className="form-group">
                <label>Proyeksi Perubahan Kas Negara (APBN):</label>
                <select
                  value={newBillForm.treasuryDelta}
                  onChange={(e) => setNewBillForm({ ...newBillForm, treasuryDelta: parseInt(e.target.value) })}
                  className="form-select"
                >
                  <option value={25000000000}>+ $RP 25 Triliun (Pajak Ekspor / Efisiensi)</option>
                  <option value={10000000000}>+ $RP 10 Triliun (Dividen BUMN)</option>
                  <option value={-15000000000}>- $RP 15 Triliun (Alokasi Belanja Publik / Subsidi)</option>
                  <option value={-30000000000}>- $RP 30 Triliun (Mega Proyek Infrastruktur)</option>
                </select>
              </div>
            </div>

            <div className="form-group">
              <label>Naskah Akademik & Uraian Substansi Kebijakan:</label>
              <textarea
                rows={4}
                placeholder="Jelaskan pasal-pasal utama, latar belakang, dan signifikansi strategis bagi kemajuan Republik..."
                value={newBillForm.description}
                onChange={(e) => setNewBillForm({ ...newBillForm, description: e.target.value })}
                required
                className="form-textarea"
              />
            </div>

            <div className="form-group">
              <label>Dampak Utama Terhadap Publik & Stabilitas:</label>
              <input
                type="text"
                placeholder="Contoh: +8% Kepuasan Rakyat Daerah, +5% Kemandirian Industri Nasional"
                value={newBillForm.impactText}
                onChange={(e) => setNewBillForm({ ...newBillForm, impactText: e.target.value })}
                className="form-input"
              />
            </div>

            <div className="form-actions">
              <button type="submit" className="btn-gold">
                <Scale size={16} /> Daftarkan ke Badan Legislasi (Rp 20 Jt)
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}
