import React, { useState } from 'react';
import { useGame } from '../context/GameContext';
import { sounds } from '../utils/soundEffects';
import { navigateToPage } from '../utils/navigation';
import { LAW_CATEGORIES, LAW_TEMPLATES } from '../data/legislationData';
import { 
  Scale, 
  FileText, 
  Sparkles, 
  CheckCircle2, 
  XCircle, 
  MinusCircle, 
  Clock, 
  Award, 
  Building2, 
  Coins, 
  Shield, 
  Flame, 
  HeartHandshake, 
  Send, 
  BookOpen, 
  Brain, 
  AlertCircle,
  TrendingUp,
  Landmark,
  ArrowRight,
  Vote,
  Trash2
} from 'lucide-react';

export default function LegislationView() {
  const { 
    player, 
    parties, 
    bills, 
    passedLaws, 
    proposeBill, 
    withdrawBill,
    voteOnBill, 
    nationalState,
    setActiveTab, 
    showToast 
  } = useGame();

  const [activeSubTab, setActiveSubTab] = useState('propose'); // 'propose' | 'templates' | 'active' | 'passed'
  const [selectedCategory, setSelectedCategory] = useState(LAW_CATEGORIES[0]);
  
  // Custom Bill Proposal Form State
  const [billTitle, setBillTitle] = useState('');
  const [billDescription, setBillDescription] = useState('');
  const [billImpact, setBillImpact] = useState('');
  const [treasuryDelta, setTreasuryDelta] = useState(25000000000);
  const [stabilityDelta, setStabilityDelta] = useState(3);
  const [supportDelta, setSupportDelta] = useState(4);
  const [sponsorshipType, setSponsorshipType] = useState('inisiatif_kader'); // 'inisiatif_kader' | 'fraksi_partai' | 'petisi_rakyat'

  const playerParty = parties.find((p) => p.id === player?.partyId) || null;
  const requiredIntellect = 15;
  const proposalFee = 20000000; // Rp 20 Juta

  const formatRupiah = (val) => {
    if (val >= 1e12) return `$RP ${(val / 1e12).toFixed(2)} Triliun`;
    if (val >= 1e9) return `$RP ${(val / 1e9).toFixed(2)} Miliar`;
    if (val >= 1e6) return `$RP ${(val / 1e6).toFixed(1)} Juta`;
    return `$RP ${(val || 0).toLocaleString('id-ID')}`;
  };

  const handleSelectTemplate = (template) => {
    sounds.playClick();
    setBillTitle(template.title);
    setBillDescription(template.description);
    setBillImpact(template.impactText);
    setTreasuryDelta(template.treasuryDelta);
    setStabilityDelta(template.stabilityDelta);
    setSupportDelta(template.supportDelta);

    const cat = LAW_CATEGORIES.find((c) => c.name === template.category) || LAW_CATEGORIES[0];
    setSelectedCategory(cat);
    setActiveSubTab('propose');
    showToast('Template naskah RUU berhasil dimuat ke formulir pengajuan!', 'info');
  };

  const handleCategoryChange = (cat) => {
    sounds.playClick();
    setSelectedCategory(cat);
    setTreasuryDelta(cat.defaultTreasury);
    setStabilityDelta(cat.defaultStability);
    setSupportDelta(cat.defaultSupport);
  };

  const handleSubmitProposal = (e) => {
    e.preventDefault();
    if (!billTitle.trim()) {
      showToast('Judul naskah RUU wajib diisi!', 'error');
      return;
    }
    if (!billDescription.trim()) {
      showToast('Naskah akademik dan uraian pasal RUU tidak boleh kosong!', 'error');
      return;
    }

    if ((player.perks?.intellect || 10) < requiredIntellect) {
      showToast(`Stat Intelektual Anda (${player.perks?.intellect || 10}) belum mencukupi. Butuh minimal Intelektual ${requiredIntellect}. Latihlah di Profil atau Markas Karir.`, 'error');
      return;
    }

    if ((player.money || 0) < proposalFee) {
      showToast(`Kas pribadi tidak mencukupi! Butuh Rp 20.000.000 untuk riset akademik & verifikasi Badan Legislasi DPR RI.`, 'error');
      return;
    }

    const newBillData = {
      title: billTitle.trim(),
      category: selectedCategory.name,
      description: billDescription.trim(),
      impactText: billImpact.trim() || `+${stabilityDelta}% Stabilitas Nasional, +${supportDelta}% Dukungan Rakyat`,
      treasuryDelta,
      stabilityDelta,
      supportDelta,
    };

    proposeBill(newBillData);

    // Reset Form
    setBillTitle('');
    setBillDescription('');
    setBillImpact('');
    setActiveSubTab('active');
  };

  const getCategoryIcon = (catId) => {
    switch (catId) {
      case 'fiskal_ekonomi': return Coins;
      case 'pertahanan_kedaulatan': return Shield;
      case 'energi_sumberdaya': return Flame;
      case 'kesejahteraan_pangan': return HeartHandshake;
      case 'hukum_tatanegara': return Scale;
      default: return FileText;
    }
  };

  return (
    <div className="legislation-system-viewport">
      {/* 1. HERO BANNER SISTEM PENGAJUAN HUKUM & LEGISLASI */}
      <div className="legislation-hero glass-panel-gold">
        <div className="lh-left">
          <div className="lh-badge">
            <Scale size={18} className="font-gold" />
            <span>BADAN LEGISLASI PARLEMEN • PUSAT REGULASI NASIONAL</span>
          </div>
          <h2 className="lh-title">Sistem Pengajuan & Perancangan Undang-Undang</h2>
          <p className="lh-desc">
            Setiap kader berdaulat berhak merancang Naskah Akademik Rancangan Undang-Undang (RUU) inisiatif, mengarahkan kebijakan fiskal APBN, dan memperjuangkan pengesahan regulasi di meja Sidang Paripurna Parlemen.
          </p>
        </div>

        {/* Player Legislative Credentials Pill */}
        <div className="lh-credentials-card glass-panel">
          <div className="lcc-top">
            <Brain size={18} className="text-cyan" />
            <span className="lcc-label">Kredensial Legislator:</span>
          </div>
          <div className="lcc-stats">
            <div className="lcc-stat-item">
              <span className="csi-label">Stat Intelektual:</span>
              <strong className={player.perks?.intellect >= requiredIntellect ? 'text-emerald' : 'text-crimson'}>
                {player.perks?.intellect || 10} / {requiredIntellect}
              </strong>
            </div>
            <div className="lcc-stat-item">
              <span className="csi-label">Fraksi Pengusung:</span>
              <strong className="text-gold">{playerParty.shortName} ({playerParty.seats} Kursi)</strong>
            </div>
            <div className="lcc-stat-item">
              <span className="csi-label">Biaya Naskah Akademik:</span>
              <strong className="text-white">Rp 20 Juta</strong>
            </div>
          </div>
        </div>
      </div>

      {/* 2. SUBTABS NAVIGASI LEGISLASI */}
      <div className="legislation-subtabs-bar">
        <button 
          className={`leg-subtab-btn ${activeSubTab === 'propose' ? 'active' : ''}`}
          onClick={() => { sounds.playClick(); setActiveSubTab('propose'); }}
        >
          <FileText size={16} />
          <span>Formulir Pengajuan RUU</span>
        </button>
        <button 
          className={`leg-subtab-btn ${activeSubTab === 'templates' ? 'active' : ''}`}
          onClick={() => { sounds.playClick(); setActiveSubTab('templates'); }}
        >
          <Sparkles size={16} />
          <span>Template Naskah RUU Unggulan</span>
        </button>
        <button 
          className={`leg-subtab-btn ${activeSubTab === 'active' ? 'active' : ''}`}
          onClick={() => { sounds.playClick(); setActiveSubTab('active'); }}
        >
          <Clock size={16} />
          <span>Sidang Paripurna & Voting RUU ({bills.filter(b => b.status === 'voting').length})</span>
        </button>
        <button 
          className={`leg-subtab-btn ${activeSubTab === 'passed' ? 'active' : ''}`}
          onClick={() => { sounds.playClick(); setActiveSubTab('passed'); }}
        >
          <Award size={16} />
          <span>Lembaran Negara & UU Berlaku ({passedLaws.length})</span>
        </button>
      </div>

      {/* TAB 1: FORMULIR PENGAJUAN RUU */}
      {activeSubTab === 'propose' && (
        <div className="propose-law-main-grid">
          {/* Kolom Kiri: Pilihan Komisi & Kategori Regulasi */}
          <div className="law-categories-col">
            <h3 className="col-title font-gold">Pilih Komisi / Bidang Kebijakan</h3>
            <p className="col-sub">Pilih komisi DPR RI yang membidangi substansi naskah regulasi Anda:</p>
            <div className="categories-vertical-list">
              {LAW_CATEGORIES.map((cat) => {
                const Icon = getCategoryIcon(cat.id);
                const isCatSelected = cat.id === selectedCategory.id;

                return (
                  <div 
                    key={cat.id}
                    className={`law-category-card ${isCatSelected ? 'selected' : ''}`}
                    onClick={() => handleCategoryChange(cat)}
                  >
                    <div className="lcc-icon-wrap" style={{ backgroundColor: `${cat.color}20`, color: cat.color }}>
                      <Icon size={20} />
                    </div>
                    <div className="lcc-text">
                      <div className="lcc-head-row">
                        <strong className="lcc-name">{cat.name}</strong>
                        <span className="lcc-komisi" style={{ color: cat.color }}>{cat.komisi}</span>
                      </div>
                      <p className="lcc-desc">{cat.description}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Kolom Kanan: Formulir Detail Naskah RUU */}
          <form onSubmit={handleSubmitProposal} className="law-form-col glass-panel-gold">
            <div className="lfc-header">
              <div className="lfc-badge">KOMISI PENGAWAS: {selectedCategory.komisi.toUpperCase()}</div>
              <h3 className="lfc-title">Perancangan Naskah Akademik RUU</h3>
            </div>

            <div className="lfc-form-body">
              {/* Judul RUU */}
              <div className="form-group">
                <label className="form-label">
                  <span>Judul Lengkap RUU:</span>
                  <span className="required-star">*</span>
                </label>
                <input 
                  type="text" 
                  className="form-input" 
                  value={billTitle}
                  onChange={(e) => setBillTitle(e.target.value)}
                  placeholder="Contoh: RUU Penguatan BUMN Pertambangan dan Hilirisasi Industri Domestik"
                  required
                />
              </div>

              {/* Jenis Pengusul & Fraksi */}
              <div className="form-grid-2">
                <div className="form-group">
                  <label className="form-label">Jalur Pengusulan Regulasi:</label>
                  <select 
                    className="form-input form-select"
                    value={sponsorshipType}
                    onChange={(e) => setSponsorshipType(e.target.value)}
                  >
                    <option value="inisiatif_kader">Hak Inisiatif Anggota ({player?.fullName || player?.username || 'Warga'})</option>
                    {playerParty && (
                      <option value="fraksi_partai">Inisiatif Resmi Fraksi {playerParty.shortName}</option>
                    )}
                    <option value="petisi_rakyat">Petisi Kedaulatan Rakyat (38 Provinsi)</option>
                  </select>
                </div>

                <div className="form-group">
                  <label className="form-label">Proyeksi Anggaran Fiskal APBN:</label>
                  <select 
                    className="form-input form-select"
                    value={treasuryDelta}
                    onChange={(e) => setTreasuryDelta(parseInt(e.target.value))}
                  >
                    <option value={35000000000}>+ $RP 35 Triliun (Penerimaan Negara / Pajak)</option>
                    <option value={20000000000}>+ $RP 20 Triliun (Dividen BUMN & Hilirisasi)</option>
                    <option value={-15000000000}>- $RP 15 Triliun (Alokasi Belanja Subsidi Publik)</option>
                    <option value={-25000000000}>- $RP 25 Triliun (Modernisasi Alutsista & Infrastruktur)</option>
                  </select>
                </div>
              </div>

              {/* Naskah Akademik & Pokok Pikiran */}
              <div className="form-group">
                <label className="form-label">
                  <span>Substansi Naskah Akademik & Pokok Pikiran Regulasi:</span>
                  <span className="required-star">*</span>
                </label>
                <textarea 
                  rows={4}
                  className="form-input form-textarea" 
                  value={billDescription}
                  onChange={(e) => setBillDescription(e.target.value)}
                  placeholder="Uraikan pasal-pasal utama, latar belakang filosofis, dan keadilan sosial bagi kemakmuran kepulauan Republik..."
                  required
                />
              </div>

              {/* Dampak Efek Nasional */}
              <div className="form-group">
                <label className="form-label">Proyeksi Dampak Positif Utama bagi Rakyat:</label>
                <input 
                  type="text" 
                  className="form-input" 
                  value={billImpact}
                  onChange={(e) => setBillImpact(e.target.value)}
                  placeholder="Contoh: +10% Stabilitas Nasional, +15% Lapangan Kerja Daerah, -2% Beban Biaya Hidup"
                />
              </div>

              {/* Syarat & Tombol Submit */}
              <div className="lfc-submit-box">
                <div className="lfc-summary-fees">
                  <div className="fee-row">
                    <span>Biaya Pendaftaran & Verifikasi:</span>
                    <strong className="text-emerald">Rp 20.000.000</strong>
                  </div>
                  <div className="fee-row">
                    <span>Reward Keberhasilan:</span>
                    <strong className="text-gold">+200 EXP Karir Politik</strong>
                  </div>
                </div>

                <button type="submit" className="btn-gold btn-submit-bill">
                  <Send size={16} />
                  <span>Daftarkan Naskah RUU ke Sidang Paripurna Parlemen</span>
                </button>
              </div>
            </div>
          </form>
        </div>
      )}

      {/* TAB 2: TEMPLATE NASKAH RUU UNGGULAN */}
      {activeSubTab === 'templates' && (
        <div className="law-templates-grid">
          {LAW_TEMPLATES.length === 0 ? (
            <div className="empty-state glass-panel" style={{ gridColumn: '1 / -1', padding: '40px 20px', textAlign: 'center' }}>
              <Scale size={42} color="#fbbf24" style={{ margin: '0 auto 12px' }} />
              <h3 style={{ color: '#f8fafc', marginBottom: '8px' }}>Belum Ada Template RUU Bawaan</h3>
              <p style={{ color: '#94a3b8', maxWidth: '500px', margin: '0 auto 16px' }}>
                Seluruh rancangan undang-undang dirancang langsung secara orisinal oleh fraksi dan anggota dewan melalui formulir pendaftaran.
              </p>
              <button className="btn-gold" onClick={() => setActiveSubTab('propose')}>
                + Buat Naskah RUU Baru
              </button>
            </div>
          ) : (
            LAW_TEMPLATES.map((tpl, idx) => (
              <div key={idx} className="law-template-card glass-panel-gold">
                <div className="ltc-top">
                  <span className="badge badge-emerald">{tpl.komisi}</span>
                  <span className="badge badge-cyan">{tpl.category}</span>
                </div>
                <h3 className="ltc-title">{tpl.title}</h3>
                <p className="ltc-desc">{tpl.description}</p>
                <div className="ltc-impact-box">
                  <strong>Proyeksi Dampak:</strong>
                  <span>{tpl.impactText}</span>
                </div>
                <button 
                  className="btn-gold btn-use-template"
                  onClick={() => handleSelectTemplate(tpl)}
                >
                  <Sparkles size={15} />
                  <span>Gunakan & Ajukan Template Ini</span>
                </button>
              </div>
            ))
          )}
        </div>
      )}

      {/* TAB 3: SIDANG PARIPURNA & VOTING RUU AKTIF */}
      {activeSubTab === 'active' && (
        <div className="active-bills-section">
          <div className="abs-header">
            <div>
              <h3 className="abs-title">Daftar RUU dalam Sidang Paripurna Parlemen</h3>
              <p className="abs-sub">Gunakan hak suara fraksi Anda untuk menyetujui, menolak, atau abstain pada RUU yang sedang dibahas.</p>
            </div>
            <button 
              className="btn-secondary"
              onClick={() => navigateToPage('parliament', setActiveTab)}
            >
              <span>Lihat Ruang Sidang Paripurna</span>
              <ArrowRight size={15} />
            </button>
          </div>

          <div className="bills-cards-grid">
            {bills.filter(b => b.status === 'voting').map((bill) => {
              const totalVotes = bill.votes.agree + bill.votes.reject + bill.votes.abstain;
              const agreePercent = totalVotes > 0 ? Math.round((bill.votes.agree / totalVotes) * 100) : 50;
              const userVoted = player?.votedBills && player.votedBills[bill.id];

              return (
                <div key={bill.id} className="bill-decision-card glass-panel">
                  <div className="bdc-top">
                    <span className="badge badge-gold">{bill.category}</span>
                    <span className="bdc-timer">
                      <Clock size={12} /> {bill.timeRemainingSeconds}s Tersisa
                    </span>
                  </div>
                  <h4 className="bdc-title">{bill.title}</h4>
                  <p className="bdc-proposer">Diajukan oleh: <strong>{bill.proposedBy}</strong></p>
                  <p className="bdc-desc">{bill.description}</p>
                  <div className="bdc-impact-tag">
                    <strong>Dampak:</strong> {bill.impactText}
                  </div>

                  {/* Vote Progress Bar */}
                  <div className="vote-bar-wrap">
                    <div className="vote-bar-track">
                      <div className="vote-bar-fill fill-agree" style={{ width: `${agreePercent}%` }} />
                      <div className="vote-bar-fill fill-reject" style={{ width: `${100 - agreePercent}%` }} />
                    </div>
                    <div className="vote-bar-legend">
                      <span className="text-emerald">Setuju: {bill.votes.agree}</span>
                      <span className="text-crimson">Tolak: {bill.votes.reject}</span>
                    </div>
                  </div>

                  {/* Action Voting Buttons */}
                  <div className="bdc-vote-actions">
                    <button 
                      className={`btn-vote btn-agree ${userVoted === 'agree' ? 'voted' : ''}`}
                      onClick={() => voteOnBill(bill.id, 'agree')}
                      disabled={!!userVoted}
                    >
                      <CheckCircle2 size={16} /> Setuju
                    </button>
                    <button 
                      className={`btn-vote btn-reject ${userVoted === 'reject' ? 'voted' : ''}`}
                      onClick={() => voteOnBill(bill.id, 'reject')}
                      disabled={!!userVoted}
                    >
                      <XCircle size={16} /> Tolak
                    </button>
                    <button 
                      className={`btn-vote btn-abstain ${userVoted === 'abstain' ? 'voted' : ''}`}
                      onClick={() => voteOnBill(bill.id, 'abstain')}
                      disabled={!!userVoted}
                    >
                      <MinusCircle size={16} /> Abstain
                    </button>
                  </div>

                  {/* Tombol Cabut / Batalkan Pengajuan RUU */}
                  {(bill.authorId === player?.id || bill.author_id === player?.id || (bill.proposedBy && bill.proposedBy.includes(player?.username || player?.fullName)) || player?.role === 'superadmin') && (
                    <div style={{ marginTop: '12px', paddingTop: '8px', borderTop: '1px dashed rgba(239,68,68,0.25)', display: 'flex', justifyContent: 'flex-end' }}>
                      <button
                        className="btn-secondary"
                        style={{
                          color: '#f87171',
                          borderColor: 'rgba(239,68,68,0.4)',
                          background: 'rgba(239,68,68,0.08)',
                          fontSize: '0.75rem',
                          padding: '4px 10px',
                          display: 'flex',
                          alignItems: 'center',
                          gap: '6px'
                        }}
                        onClick={() => {
                          if (window.confirm(`Apakah Anda yakin ingin membatalkan dan mencabut pengajuan RUU '${bill.title}'? Dana riset berkas dikembalikan Rp 10 Juta.`)) {
                            withdrawBill(bill.id);
                          }
                        }}
                      >
                        <Trash2 size={13} /> Cabut / Batalkan RUU
                      </button>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* TAB 4: LEMBARAN NEGARA (UU BERLAKU) */}
      {activeSubTab === 'passed' && (
        <div className="passed-laws-container">
          <div className="plc-header">
            <Award size={24} className="font-gold" />
            <div>
              <h3 className="plc-title">Lembaran Negara Republik Nusantara (Undang-Undang Berlaku)</h3>
              <p className="plc-sub">Seluruh produk hukum berkekuatan hukum tetap yang memberikan buff pasif ekonomi, stabilitas, dan keamanan nasional.</p>
            </div>
          </div>

          <div className="passed-laws-list">
            {passedLaws.map((law) => (
              <div key={law.id} className="passed-law-row glass-panel-gold">
                <div className="plr-seal">
                  <BookOpen size={20} className="font-gold" />
                  <span>BERLAKU</span>
                </div>
                <div className="plr-info">
                  <div className="plr-meta">
                    <span className="badge badge-emerald">{law.category}</span>
                    <span className="plr-year">Tahun: {law.passedYear}</span>
                    <span className="plr-sponsor">Inisiator: {law.sponsor}</span>
                  </div>
                  <h4 className="plr-title">{law.title}</h4>
                  <p className="plr-summary">{law.summary}</p>
                  <div className="plr-buff">
                    <strong>Efek Pasif Kenegaraan:</strong> <span className="font-emerald">{law.activeBuff}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
