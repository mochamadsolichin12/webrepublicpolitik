import React, { useState } from 'react';
import { useGame } from '../context/GameContext';
import { sounds } from '../utils/soundEffects';
import { 
  Vote, 
  Award, 
  Users, 
  CheckCircle, 
  Flame, 
  Clock, 
  ShieldCheck, 
  Sparkles,
  BarChart3,
  Check,
  UserCheck,
  PlusCircle,
  Flag
} from 'lucide-react';
import confetti from 'canvas-confetti';

export default function ElectionsView() {
  const { 
    candidates, 
    parties, 
    player, 
    votePresident, 
    nominatePresidentialCandidate,
    nationalState, 
    regions 
  } = useGame();

  const [activeTab, setActiveTab] = useState('presidential'); // 'presidential', 'legislative'
  const [showNominateModal, setShowNominateModal] = useState(false);
  const [taglineInput, setTaglineInput] = useState('');
  const [ideologyInput, setIdeologyInput] = useState('');
  const [prog1, setProg1] = useState('');
  const [prog2, setProg2] = useState('');
  const [prog3, setProg3] = useState('');

  const myId = player?.id || player?.username;
  const isAlreadyCandidate = candidates.some((c) => c.playerId === myId || c.id === `cand-player-${myId}`);

  const handlePresidentVote = (candidateId) => {
    votePresident(candidateId);
    try {
      confetti({
        particleCount: 70,
        spread: 60,
        origin: { y: 0.7 },
      });
    } catch {
      // ignore
    }
  };

  // Parliamentary threshold calculation (Party total popular support)
  const partyNationalScores = parties.map((party) => {
    const controlledRegions = regions.filter((r) => r.dominantPartyId === party.id);
    const totalPopInControlled = controlledRegions.reduce((sum, r) => sum + r.population, 0);
    const totalNationalPop = regions.reduce((sum, r) => sum + r.population, 0);
    const projectedVoteShare = totalNationalPop > 0 
      ? parseFloat(((totalPopInControlled / totalNationalPop) * 100).toFixed(1)) 
      : 0.0;
    const passesThreshold = projectedVoteShare >= 4.0;

    return {
      ...party,
      projectedVoteShare,
      passesThreshold,
      controlledCount: controlledRegions.length,
    };
  }).sort((a, b) => b.projectedVoteShare - a.projectedVoteShare);

  return (
    <div className="elections-view-container">
      {/* Header Banner */}
      <div className="elections-hero glass-panel">
        <div className="hero-left">
          <div className="hero-badge">
            <Vote size={18} /> KOMISI PEMILIHAN UMUM REPUBLIK NUSANTARA (KPU)
          </div>
          <h2 className="hero-title">Pesta Demokrasi Rakyat & Pemilu Raya</h2>
          <p className="hero-desc">
            Panggung kedaulatan tertinggi rakyat. Tentukan pemimpin tertinggi eksekutif 
            serta perwakilan partai di parlemen nasional.
          </p>
        </div>

        <div className="election-countdown-card">
          <div className="countdown-title">
            <Clock size={16} /> Penghitungan Suara Pileg
          </div>
          <div className="countdown-number">
            {nationalState.nextElectionSeconds}s
          </div>
          <span className="countdown-sub">Siklus Pemilu Parlemen</span>
        </div>
      </div>

      {/* Tabs */}
      <div className="election-tabs-bar">
        <button
          className={`elec-tab-btn ${activeTab === 'presidential' ? 'active' : ''}`}
          onClick={() => { setActiveTab('presidential'); sounds.playClick(); }}
        >
          <Award size={16} /> Pemilihan Presiden & Wakil Presiden (Pilpres)
        </button>
        <button
          className={`elec-tab-btn ${activeTab === 'legislative' ? 'active' : ''}`}
          onClick={() => { setActiveTab('legislative'); sounds.playClick(); }}
        >
          <BarChart3 size={16} /> Pemilu Legislatif Parlemen & Ambang Batas 4%
        </button>
      </div>

      {/* 1. PRESIDENTIAL ELECTION */}
      {activeTab === 'presidential' && (
        <div className="presidential-section">
          {/* Banner Pendaftaran / Status Kandidasi Pemimpin Negara */}
          <div className="candidate-nomination-bar glass-panel">
            <div className="cnb-left">
              <div className="cnb-icon-wrap">
                <Award size={24} color="#f59e0b" />
              </div>
              <div>
                <h4 className="cnb-title">Pencalonan Pemimpin Tertinggi Negara (Capres-Cawapres)</h4>
                <p className="cnb-sub">
                  Kharisma & Retorika tokoh politik Anda dihitung otomatis dari tingkat ketenaran & hasil dukungan suara pemilih lain.
                  {isAlreadyCandidate 
                    ? ' Anda saat ini resmi terdaftar di KPU sebagai Calon Pemimpin Negara!' 
                    : ' Anda dapat mendaftarkan diri secara resmi untuk maju sebagai kandidat Presiden.'}
                </p>
              </div>
            </div>

            <div className="cnb-right">
              {isAlreadyCandidate ? (
                <div className="candidate-badge-verified">
                  <UserCheck size={16} /> Terdaftar di Surat Suara KPU
                </div>
              ) : (
                <button 
                  className="btn-gold cnb-btn"
                  onClick={() => { setShowNominateModal(true); sounds.playClick(); }}
                >
                  <PlusCircle size={16} /> Maju Sebagai Calon Presiden (Rp 25 Jt)
                </button>
              )}
            </div>
          </div>

          <div className="presidential-grid">
            {candidates.map((cand) => {
              const isVoted = player?.votedPresidentId === cand.id;

              return (
                <div 
                  key={cand.id} 
                  className={`candidate-card glass-panel ${isVoted ? 'voted-active' : ''}`}
                  style={{ borderTop: `4px solid ${cand.color}` }}
                >
                  <div className="candidate-top">
                    <div className="ballot-badge" style={{ backgroundColor: cand.color }}>
                      Nomor Urut {cand.ballotNumber}
                    </div>
                    <div className="polling-badge">
                      <Flame size={14} color="#f59e0b" />
                      <span>Elektabilitas: <strong>{cand.currentPolling}%</strong></span>
                    </div>
                  </div>

                  <h3 className="candidate-name">{cand.name}</h3>
                  <div className="coalition-row">
                    <span className="coalition-label">Partai Pengusung:</span>
                    <div className="coalition-badges">
                      {cand.parties.map((p) => (
                        <span key={p} className="badge badge-gold">{p}</span>
                      ))}
                    </div>
                  </div>

                  <p className="candidate-slogan">"{cand.tagline}"</p>

                  <div className="manifesto-box">
                    <span className="manifesto-title">Program Kerja Unggulan:</span>
                    <ul className="manifesto-list">
                      {cand.keyPrograms.map((prog, idx) => (
                        <li key={idx}><Sparkles size={12} className="bullet-icon" /> {prog}</li>
                      ))}
                    </ul>
                  </div>

                  <div className="polling-bar-track">
                    <div 
                      className="polling-bar-fill" 
                      style={{ width: `${cand.currentPolling * 2}%`, backgroundColor: cand.color }} 
                    />
                  </div>

                  {/* Vote Button */}
                  <div className="vote-action-footer">
                    {isVoted ? (
                      <div className="vote-confirmed-badge">
                        <Check size={16} /> Coblosan Anda Telah Terdaftar
                      </div>
                    ) : (
                      <button
                        className="btn-gold coblos-btn"
                        onClick={() => handlePresidentVote(cand.id)}
                        disabled={!!player?.votedPresidentId}
                      >
                        <Vote size={16} /> Coblos Paslon No. {cand.ballotNumber}
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>

          {/* Current Incumbent info */}
          <div className="incumbent-card glass-panel-gold">
            <div className="incumbent-info">
              <span className="badge badge-gold">PRESIDEN PETAHANA</span>
              <h4 className="incumbent-name">{nationalState.presidentName}</h4>
              <p className="incumbent-sub">
                Wakil Presiden: <strong>{nationalState.vicePresidentName}</strong> • Masa Jabatan Konstitusional
              </p>
            </div>
            <div className="incumbent-approval">
              <span className="approval-title">Approval Rating Nasional</span>
              <span className="approval-val font-emerald">{nationalState.publicApproval}%</span>
            </div>
          </div>
        </div>
      )}

      {/* 2. LEGISLATIVE ELECTION (PILEg) */}
      {activeTab === 'legislative' && (
        <div className="legislative-section">
          <div className="threshold-info-card glass-panel">
            <div className="threshold-header">
              <ShieldCheck size={20} color="#f59e0b" />
              <div>
                <h4>Ambang Batas Parlemen (Parliamentary Threshold) 4.0%</h4>
                <p>
                  Partai yang tidak mencapai minimal 4% proyeksi suara nasional didiskualifikasi dari 
                  perolehan kursi di Parlemen.
                </p>
              </div>
            </div>
          </div>

          <div className="party-election-table glass-panel">
            <table className="custom-table">
              <thead>
                <tr>
                  <th>No</th>
                  <th>Partai Politik</th>
                  <th>Ideologi</th>
                  <th>Provinsi Dikuasai</th>
                  <th>Proyeksi Suara</th>
                  <th>Status Ambang Batas</th>
                  <th>Kursi DPR Saat Ini</th>
                </tr>
              </thead>
              <tbody>
                {partyNationalScores.length === 0 ? (
                  <tr>
                    <td colSpan="7" style={{ textAlign: 'center', padding: '36px 16px', color: '#94a3b8' }}>
                      <Flag size={28} style={{ margin: '0 auto 8px auto', opacity: 0.6, display: 'block' }} />
                      Belum ada partai politik yang terdaftar. Partai yang didirikan oleh pemain akan otomatis muncul dalam proyeksi Pemilu & Pileg di sini.
                    </td>
                  </tr>
                ) : (
                  partyNationalScores.map((p, idx) => (
                    <tr key={p.id}>
                      <td>{idx + 1}</td>
                      <td>
                        <div className="party-cell">
                          <span className="party-color-pip" style={{ backgroundColor: p.color }} />
                          <strong>{p.name}</strong> ({p.shortName})
                        </div>
                      </td>
                      <td><span className="text-muted">{p.ideology}</span></td>
                      <td>
                        <span className="badge badge-cyan">{p.controlledCount} Provinsi</span>
                      </td>
                      <td>
                        <div className="vote-pct-cell">
                          <span className="font-highlight">{p.projectedVoteShare}%</span>
                          <div className="mini-track">
                            <div 
                              className="mini-fill" 
                              style={{ width: `${Math.min(100, p.projectedVoteShare * 2.5)}%`, backgroundColor: p.color }} 
                            />
                          </div>
                        </div>
                      </td>
                      <td>
                        {p.passesThreshold ? (
                          <span className="badge badge-emerald">Lolos PT 4%</span>
                        ) : (
                          <span className="badge badge-crimson">Terancam Gugur</span>
                        )}
                      </td>
                      <td>
                        <strong className="seats-count">{p.seats} Kursi</strong>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* MODAL PENDAFTARAN CALON PRESIDEN */}
      {showNominateModal && (
        <div className="modal-overlay" onClick={() => setShowNominateModal(false)}>
          <div className="modal-content glass-panel-gold animate-slide-up" onClick={(e) => e.stopPropagation()} style={{ maxWidth: '540px' }}>
            <div className="modal-header">
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <Award size={22} color="#f59e0b" />
                <h3 className="modal-title">Daftar Sebagai Calon Presiden RI</h3>
              </div>
              <button 
                className="btn-icon" 
                onClick={() => setShowNominateModal(false)}
                style={{ background: 'none', border: 'none', color: '#94a3b8', fontSize: '1.2rem', cursor: 'pointer' }}
              >
                ✕
              </button>
            </div>

            <div className="modal-body" style={{ display: 'flex', flexDirection: 'column', gap: '14px', marginTop: '12px' }}>
              <div className="info-box-gold" style={{ padding: '12px', background: 'rgba(245, 158, 11, 0.1)', border: '1px solid rgba(245, 158, 11, 0.3)', borderRadius: '8px', fontSize: '0.82rem', color: '#fef3c7' }}>
                ⭐ <strong>Ketentuan Konstitusi & Sistem Pemilu:</strong>
                <p style={{ margin: '4px 0 0 0', lineHeight: '1.4' }}>
                  Setelah terdaftar, nama Anda akan muncul di surat suara nasional agar dapat dicoblos oleh seluruh pemain lain. 
                  <strong>Kharisma & Retorika</strong> karakter Anda akan naik turun secara langsung mengikuti hasil persentase suara dan elektabilitas Anda!
                </p>
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 600, color: '#cbd5e1', marginBottom: '4px' }}>
                  Slogan & Tagline Kampanye
                </label>
                <input
                  type="text"
                  className="input-field"
                  placeholder="Contoh: Bersama Mewujudkan Kedaulatan & Kemakmuran Rakyat"
                  value={taglineInput}
                  onChange={(e) => setTaglineInput(e.target.value)}
                  style={{ width: '100%', padding: '10px 12px', background: '#0f172a', border: '1px solid #334155', borderRadius: '8px', color: '#fff' }}
                />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 600, color: '#cbd5e1', marginBottom: '4px' }}>
                  Fokus Ideologi / Arah Visi
                </label>
                <input
                  type="text"
                  className="input-field"
                  placeholder="Contoh: Kedaulatan Rakyat, Maritim & Keadilan Sosial"
                  value={ideologyInput}
                  onChange={(e) => setIdeologyInput(e.target.value)}
                  style={{ width: '100%', padding: '10px 12px', background: '#0f172a', border: '1px solid #334155', borderRadius: '8px', color: '#fff' }}
                />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 600, color: '#cbd5e1', marginBottom: '4px' }}>
                  3 Program Kerja Utama
                </label>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                  <input
                    type="text"
                    className="input-field"
                    placeholder="Program 1: Hilirisasi Industri & Lapangan Kerja"
                    value={prog1}
                    onChange={(e) => setProg1(e.target.value)}
                    style={{ width: '100%', padding: '8px 12px', background: '#0f172a', border: '1px solid #334155', borderRadius: '8px', color: '#fff' }}
                  />
                  <input
                    type="text"
                    className="input-field"
                    placeholder="Program 2: Pendidikan & Layanan Kesehatan Gratis"
                    value={prog2}
                    onChange={(e) => setProg2(e.target.value)}
                    style={{ width: '100%', padding: '8px 12px', background: '#0f172a', border: '1px solid #334155', borderRadius: '8px', color: '#fff' }}
                  />
                  <input
                    type="text"
                    className="input-field"
                    placeholder="Program 3: Transformasi Digital Birokrasi Anti-Korupsi"
                    value={prog3}
                    onChange={(e) => setProg3(e.target.value)}
                    style={{ width: '100%', padding: '8px 12px', background: '#0f172a', border: '1px solid #334155', borderRadius: '8px', color: '#fff' }}
                  />
                </div>
              </div>

              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '12px', borderTop: '1px solid rgba(255,255,255,0.1)', paddingTop: '14px' }}>
                <span style={{ fontSize: '0.82rem', color: '#94a3b8' }}>
                  Biaya Verifikasi KPU: <strong style={{ color: '#f59e0b' }}>Rp 25.000.000</strong>
                </span>

                <div style={{ display: 'flex', gap: '10px' }}>
                  <button 
                    className="btn-secondary" 
                    onClick={() => setShowNominateModal(false)}
                    style={{ padding: '8px 16px', borderRadius: '8px', background: '#334155', border: 'none', color: '#fff', cursor: 'pointer' }}
                  >
                    Batal
                  </button>
                  <button 
                    className="btn-gold"
                    onClick={() => {
                      const res = nominatePresidentialCandidate({
                        tagline: taglineInput,
                        ideology: ideologyInput,
                        keyPrograms: [prog1, prog2, prog3].filter(Boolean),
                      });
                      if (res?.success) {
                        setShowNominateModal(false);
                      }
                    }}
                    style={{ padding: '8px 20px', borderRadius: '8px', background: '#f59e0b', border: 'none', color: '#0f172a', fontWeight: 700, cursor: 'pointer' }}
                  >
                    Daftar KPU Sekarang
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
