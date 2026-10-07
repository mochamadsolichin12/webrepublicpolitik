import React, { useState } from 'react';
import { useGame } from '../context/GameContext';
import { sounds } from '../utils/soundEffects';
import { 
  Flag, 
  Users, 
  Coins, 
  Landmark, 
  PlusCircle, 
  Check, 
  ShieldCheck, 
  Award, 
  Sparkles,
  HeartHandshake,
  Trash2,
  XCircle,
  AlertTriangle
} from 'lucide-react';

export default function PartiesView() {
  const { 
    parties, 
    player, 
    usersList,
    joinParty, 
    createNewParty,
    closeParty 
  } = useGame();

  const [showCreateModal, setShowCreateModal] = useState(false);
  const [form, setForm] = useState({
    name: '',
    shortName: '',
    color: '#3b82f6',
    ideology: 'Demokrat Kerakyatan',
    slogan: '',
  });

  const formatRupiah = (val) => {
    if (val >= 1e12) return `$RP ${(val / 1e12).toFixed(2)} Triliun`;
    if (val >= 1e9) return `$RP ${(val / 1e9).toFixed(2)} Miliar`;
    if (val >= 1e6) return `$RP ${(val / 1e6).toFixed(0)} Juta`;
    return `$RP ${Number(val).toLocaleString('id-ID')}`;
  };

  const handleCreateSubmit = (e) => {
    e.preventDefault();
    if (!form.name || !form.shortName) return;
    createNewParty(form);
    setShowCreateModal(false);
    setForm({
      name: '',
      shortName: '',
      color: '#3b82f6',
      ideology: 'Demokrat Kerakyatan',
      slogan: '',
    });
  };

  return (
    <div className="parties-view-container">
      {/* Header Banner */}
      <div className="parties-hero glass-panel">
        <div className="hero-left">
          <div className="hero-badge">
            <Flag size={18} /> DEWAN PARTAI POLITIK NASIONAL
          </div>
          <h2 className="hero-title">Partai Politik & Fraksi Parlemen</h2>
          <p className="hero-desc">
            Organisasi pergerakan massa dan pemegang kedaulatan legislasi. Bergabunglah dengan partai 
            berpengaruh atau dirikan partai baru untuk mengusung cita-cita politik Anda.
          </p>
        </div>

        <button 
          className="btn-gold" 
          onClick={() => { setShowCreateModal(true); sounds.playClick(); }}
        >
          <PlusCircle size={18} /> Daftarkan Partai Baru (Rp 50 Jt)
        </button>
      </div>

      {/* Parties Directory Grid */}
      {parties.length === 0 ? (
        <div className="empty-parties-card glass-panel" style={{ textAlign: 'center', padding: '60px 24px', margin: '20px 0', border: '1px dashed rgba(251, 191, 36, 0.4)', borderRadius: '14px' }}>
          <div style={{ width: '64px', height: '64px', borderRadius: '50%', background: 'rgba(251, 191, 36, 0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 16px auto', color: '#fbbf24' }}>
            <Flag size={32} />
          </div>
          <h3 style={{ fontSize: '1.25rem', color: '#f8fafc', marginBottom: '8px', fontFamily: 'Cinzel, serif' }}>Belum Ada Partai Politik Terdaftar</h3>
          <p style={{ color: '#94a3b8', maxWidth: '520px', margin: '0 auto 24px auto', fontSize: '0.92rem', lineHeight: '1.6' }}>
            Saat ini seluruh partai bawaan telah dikosongkan. Sistem politik Republic Politic kini sepenuhnya digerakkan oleh pemain. Jadilah tokoh bangsa pertama yang mendirikan partai politik berdaulat!
          </p>
          <button 
            className="btn-gold" 
            onClick={() => { setShowCreateModal(true); sounds.playClick(); }}
            style={{ padding: '12px 24px', fontSize: '0.95rem' }}
          >
            <PlusCircle size={18} /> Deklarasikan & Buat Partai Pertama Anda
          </button>
        </div>
      ) : (
        <div className="parties-grid">
          {parties.map((party) => {
            const isPlayerParty = player?.partyId === party.id;

            return (
              <div 
                key={party.id} 
                className={`party-card glass-panel ${isPlayerParty ? 'party-active-card' : ''}`}
                style={{ borderTop: `4px solid ${party.color}` }}
              >
                <div className="party-card-top">
                  <div className="party-acronym-badge" style={{ backgroundColor: party.color }}>
                    {party.shortName}
                  </div>
                  <div className="party-status-badges">
                    {party.isCoalitionWithGov ? (
                      <span className="badge badge-emerald">Koalisi Pemerintah</span>
                    ) : (
                      <span className="badge badge-gold">Oposisi Kritis</span>
                    )}
                    {isPlayerParty && <span className="badge badge-cyan">Partai Anda</span>}
                  </div>
                </div>

                <h3 className="party-full-name">{party.name}</h3>
                <p className="party-leader-text">
                  <Users size={14} /> Ketua Umum: <strong>{party.leader}</strong>
                </p>
                <p className="party-slogan-quote">"{party.slogan}"</p>

                {/* Stats Matrix */}
                <div className="party-metrics-row">
                  <div className="party-metric">
                    <span className="p-metric-label"><Landmark size={13} /> Kursi DPR</span>
                    <span className="p-metric-val">{party.seats} Kursi</span>
                  </div>
                  <div className="party-metric">
                    <span className="p-metric-label"><Coins size={13} /> Kas Partai</span>
                    <span className="p-metric-val font-gold">{formatRupiah(party.treasury)}</span>
                  </div>
                  <div className="party-metric">
                    <span className="p-metric-label"><Users size={13} /> Kader Aktif</span>
                    <span className="p-metric-val">{(party.membersCount).toLocaleString('id-ID')}</span>
                  </div>
                </div>

                {/* Stances on issues */}
                <div className="party-stances-box">
                  <span className="stances-heading">Sikap Kebijakan Partai:</span>
                  <div className="stances-list">
                    <div className="stance-item">
                      <span className="stance-k">Perpajakan:</span>
                      <span className="stance-v">{party.stances.taxes}</span>
                    </div>
                    <div className="stance-item">
                      <span className="stance-k">Pertahanan:</span>
                      <span className="stance-v">{party.stances.defense}</span>
                    </div>
                    <div className="stance-item">
                      <span className="stance-k">Hilirisasi Tambang:</span>
                      <span className="stance-v">{party.stances.mining}</span>
                    </div>
                  </div>
                </div>

                {/* Action Button & Close Party Controls */}
                <div className="party-action-footer">
                  <div className="paf-left">
                    {isPlayerParty ? (
                      <div className="joined-confirm-badge">
                        <Check size={16} /> Anda Adalah Kader Partai Ini
                      </div>
                    ) : (
                      <button
                        className="btn-secondary join-btn"
                        onClick={() => joinParty(party.id)}
                      >
                        <HeartHandshake size={16} /> Pindah & Bergabung ke Partai Ini
                      </button>
                    )}
                  </div>

                  {/* Tombol Tutup / Bubarkan Partai */}
                  {(() => {
                    const myId = player?.id || player?.username;
                    const isLeader = (party.creatorId && party.creatorId === myId) || 
                      (party.leader && party.leader.includes(player?.fullName || player?.username)) ||
                      (isPlayerParty && player?.position === 'Ketua Umum Partai Politik');

                    if (!isLeader) return null;

                    // Hitung apakah ada player lain yang bergabung
                    const otherUsersCount = (usersList || []).filter((u) => {
                      const uId = u.id || u.username;
                      return uId !== myId && u.partyId === party.id;
                    }).length;
                    const otherMembersCount = (Array.isArray(party.members) ? party.members.filter((mId) => mId !== myId).length : 0);
                    const totalOtherMembers = Math.max(otherUsersCount, otherMembersCount);

                    const canClose = totalOtherMembers === 0;

                    return (
                      <div className="close-party-action-wrap" style={{ marginTop: '10px', paddingTop: '10px', borderTop: '1px solid rgba(255, 255, 255, 0.08)' }}>
                        {canClose ? (
                          <button
                            className="btn-danger-outline"
                            style={{ 
                              width: '100%', 
                              display: 'flex', 
                              alignItems: 'center', 
                              justifyContent: 'center', 
                              gap: '6px', 
                              padding: '8px 12px', 
                              fontSize: '0.85rem',
                              color: '#f87171',
                              backgroundColor: 'rgba(239, 68, 68, 0.1)',
                              border: '1px solid rgba(239, 68, 68, 0.3)',
                              borderRadius: '8px',
                              cursor: 'pointer',
                              transition: 'all 0.2s ease'
                            }}
                            onClick={() => {
                              if (window.confirm(`PERINGATAN KENEGARAAN:\nApakah Anda yakin ingin membubarkan dan menutup partai politik "${party.name} (${party.shortName})"?\n\nTindakan ini permanen.`)) {
                                closeParty(party.id);
                              }
                            }}
                            title="Tutup & bubarkan partai politik ini (hanya dapat dilakukan karena belum ada anggota lain yang bergabung)"
                          >
                            <Trash2 size={14} />
                            <span>Tutup & Bubarkan Partai</span>
                          </button>
                        ) : (
                          <div 
                            className="cannot-close-banner"
                            style={{ 
                              display: 'flex', 
                              alignItems: 'center', 
                              gap: '8px', 
                              padding: '8px 10px', 
                              borderRadius: '6px', 
                              backgroundColor: 'rgba(245, 158, 11, 0.1)', 
                              border: '1px solid rgba(245, 158, 11, 0.25)',
                              fontSize: '0.78rem',
                              color: '#fbbf24'
                            }}
                            title={`Partai memiliki ${totalOtherMembers} anggota lain`}
                          >
                            <AlertTriangle size={14} style={{ flexShrink: 0 }} />
                            <span>Tidak bisa ditutup: Ada {totalOtherMembers} pemain lain yang bergabung</span>
                          </div>
                        )}
                      </div>
                    );
                  })()}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Modal Form: Create Party */}
      {showCreateModal && (
        <div className="modal-overlay">
          <div className="modal-content glass-panel-gold">
            <div className="modal-header">
              <h3><PlusCircle size={20} /> Pendaftaran Pendirian Partai Politik Baru</h3>
              <button className="modal-close-btn" onClick={() => setShowCreateModal(false)}>✕</button>
            </div>

            <form onSubmit={handleCreateSubmit} className="modal-form">
              <div className="form-group">
                <label>Nama Lengkap Partai:</label>
                <input
                  type="text"
                  placeholder="Contoh: Partai Kedaulatan Maritim Nusantara"
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  required
                  className="form-input"
                />
              </div>

              <div className="form-grid-2">
                <div className="form-group">
                  <label>Singkatan Partai:</label>
                  <input
                    type="text"
                    placeholder="Contoh: PKMN"
                    value={form.shortName}
                    onChange={(e) => setForm({ ...form, shortName: e.target.value })}
                    required
                    className="form-input"
                  />
                </div>

                <div className="form-group">
                  <label>Warna Lambang / Bendera:</label>
                  <input
                    type="color"
                    value={form.color}
                    onChange={(e) => setForm({ ...form, color: e.target.value })}
                    className="form-color-picker"
                  />
                </div>
              </div>

              <div className="form-group">
                <label>Haluan & Ideologi Utama:</label>
                <select
                  value={form.ideology}
                  onChange={(e) => setForm({ ...form, ideology: e.target.value })}
                  className="form-select"
                >
                  <option value="Nasionalis Demokrat">Nasionalis Demokrat</option>
                  <option value="Teknokrasi & Modernisasi Hijau">Teknokrasi & Modernisasi Hijau</option>
                  <option value="Ekonomi Kerakyatan & Sosialisme">Ekonomi Kerakyatan & Sosialisme</option>
                  <option value="Konservatif Religius Berkeadilan">Konservatif Religius Berkeadilan</option>
                  <option value="Liberal Reformis & Anti-Korupsi">Liberal Reformis & Anti-Korupsi</option>
                </select>
              </div>

              <div className="form-group">
                <label>Slogan Perjuangan:</label>
                <input
                  type="text"
                  placeholder="Contoh: Bangkit Bersama Menuju Kesejahteraan Rakyat"
                  value={form.slogan}
                  onChange={(e) => setForm({ ...form, slogan: e.target.value })}
                  required
                  className="form-input"
                />
              </div>

              <div className="modal-footer">
                <button type="button" className="btn-secondary" onClick={() => setShowCreateModal(false)}>
                  Batal
                </button>
                <button type="submit" className="btn-gold">
                  Deklarasikan Partai (Rp 50 Juta)
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
