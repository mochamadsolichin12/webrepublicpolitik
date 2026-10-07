import React, { useState } from 'react';
import { useGame } from '../context/GameContext';
import { sounds } from '../utils/soundEffects';
import { formatRP } from '../utils/currency';
import { navigateToPage } from '../utils/navigation';
import { WORLD_REGIONS, COUNTRY_NAMES_ID } from '../data/worldRegionsData';
import { 
  MapPin, 
  Globe, 
  Users, 
  UserCheck, 
  Flag, 
  Swords, 
  MessageSquare, 
  Send, 
  Flame, 
  Newspaper, 
  TrendingUp, 
  Award, 
  Zap, 
  Shield, 
  Coins, 
  ArrowRight,
  Sparkles,
  Radio,
  Eye,
  HeartHandshake
} from 'lucide-react';

export default function HomeDashboardView() {
  const { 
    player, 
    regions, 
    parties, 
    activeWars, 
    articles, 
    usersList, 
    chatMessages, 
    sendChatMessage, 
    topAttackers, 
    setActiveTab,
    nationalState
  } = useGame();

  // Chat tab & input state
  const [activeChatChannel, setActiveChatChannel] = useState('national'); // 'national' | 'global'
  const [chatInput, setChatInput] = useState('');

  // 1. Identify Player's Current Region & Country
  const playerRegionId = player?.currentRegionId || player?.residenceRegionId || 'dki';
  const currentRegion = regions.find((r) => r.id === playerRegionId) || regions[0] || {
    id: 'dki',
    name: 'DKI Jakarta',
    island: 'jawa',
    population: 10600000,
    dominantPartyId: null,
  };

  // Negara asal pemain (default: Republik Indonesia)
  const playerCountryName = player?.residenceCountry || 'Indonesia';
  const playerCountryFlag = playerCountryName === 'Indonesia' ? '🇮🇩' : '🌐';

  // 2. Statistics for Current Country & System
  // Registered players & Active players
  const totalRegisteredPlayers = Math.max((usersList || []).length, 3); // realistic dynamic user count
  // Active players (users with online status or active in last 24h, minimum 1)
  const totalActivePlayers = Math.max(
    (usersList || []).filter((u) => u.status === 'active').length,
    1
  );

  // Total political parties in this country
  const totalPartiesInCountry = parties.length;

  // 3. Top Article in Player's Country
  const topArticle = (articles && articles.length > 0)
    ? [...articles].sort((a, b) => ((b.reads || 0) + (b.upvotes || 0) * 10) - ((a.reads || 0) + (a.upvotes || 0) * 10))[0]
    : {
        headline: 'Sidang Paripurna Memanas: Pembahasan Anggaran Wilayah & Kedaulatan Nasional',
        author: 'Redaksi Pers Nasional',
        partyTag: 'Netral',
        timeAgo: 'Baru saja',
        reads: 1450,
        upvotes: 120,
        content: 'Pemerintah dan seluruh fraksi mempercepat penyusunan undang-undang strategis demi stabilitas geopolitik dan pembangunan ekonomi rakyat di seluruh penjuru kepulauan.'
      };

  // 4. Ongoing Active Wars (Frontier Conflicts)
  const primaryWar = activeWars && activeWars.length > 0 ? activeWars[0] : null;

  // 5. Player with Largest Attack in Last 24 Hours
  const topAttackerPlayer = (topAttackers && topAttackers.length > 0)
    ? topAttackers[0]
    : {
        name: player?.fullName || player?.username || 'Panglima Nusantara',
        username: player?.username || 'satria',
        country: 'Indonesia',
        region: currentRegion.name,
        damage24h: 345000,
        lastActive: 'Baru saja'
      };

  // 6. Filter chat messages by channel
  const filteredChat = (chatMessages || []).filter((msg) => {
    if (activeChatChannel === 'national') {
      return msg.channel === 'national' || msg.country === playerCountryName;
    }
    return msg.channel === 'global';
  });

  const handleSendMessage = (e) => {
    e.preventDefault();
    if (!chatInput.trim()) return;
    sendChatMessage(chatInput.trim(), activeChatChannel);
    setChatInput('');
  };

  return (
    <div className="home-dashboard-container">
      {/* =========================================================================
          BAGIAN PALING ATAS (PALING PENTING): 
          Status Wilayah & Negara yang Sedang Ditempati Player, 
          Total Pemain Aktif, Total Terdaftar, & Jumlah Partai Politik
      ========================================================================= */}
      <section className="home-region-master-header glass-panel-gold">
        <div className="hrmh-glow-backdrop" />
        
        <div className="hrmh-main-row">
          <div className="hrmh-location-info">
            <div className="hrmh-location-badge">
              <span className="hrmh-flag">{playerCountryFlag}</span>
              <span className="hrmh-country">{playerCountryName.toUpperCase()}</span>
              <span className="dot-sep">•</span>
              <span className="hrmh-status-tag">Kedaulatan Berdaulat</span>
            </div>

            <h1 className="hrmh-region-name">
              <MapPin size={28} className="hrmh-pin-icon" />
              <span>Provinsi {currentRegion.name}</span>
            </h1>

            <p className="hrmh-region-sub">
              Wilayah Kepulauan: <strong>{currentRegion.island ? currentRegion.island.toUpperCase() : 'NUSANTARA'}</strong> • 
              Status: <strong>Pusat Domisili & Operasi Politik Aktif</strong>
            </p>
          </div>

          <div className="hrmh-actions-group">
            <button 
              className="btn-gold hrmh-map-btn"
              onClick={() => { sounds.playClick(); navigateToPage('map', setActiveTab); }}
            >
              <Globe size={18} />
              <span>Buka Peta Geopolitik Taktis</span>
            </button>
          </div>
        </div>

        {/* 4 Kartu Metrik Utama Negara & Wilayah */}
        <div className="hrmh-metrics-grid">
          <div className="hrmh-metric-card glass-panel">
            <div className="hmc-icon-wrap font-emerald">
              <Users size={22} />
            </div>
            <div className="hmc-data">
              <span className="hmc-label">TOTAL PEMAIN AKTIF</span>
              <strong className="hmc-value font-emerald">
                {totalActivePlayers.toLocaleString('id-ID')} <span className="hmc-unit">Warga</span>
              </strong>
              <span className="hmc-sub">Online & bertugas dalam 24 jam</span>
            </div>
          </div>

          <div className="hrmh-metric-card glass-panel">
            <div className="hmc-icon-wrap font-cyan">
              <UserCheck size={22} />
            </div>
            <div className="hmc-data">
              <span className="hmc-label">TOTAL WARGA TERDAFTAR</span>
              <strong className="hmc-value font-cyan">
                {totalRegisteredPlayers.toLocaleString('id-ID')} <span className="hmc-unit">Warga</span>
              </strong>
              <span className="hmc-sub">Basis populasi di Republic Politic</span>
            </div>
          </div>

          <div className="hrmh-metric-card glass-panel">
            <div className="hmc-icon-wrap font-purple">
              <Flag size={22} />
            </div>
            <div className="hmc-data">
              <span className="hmc-label">PARTAI POLITIK RESMI</span>
              <strong className="hmc-value font-purple">
                {totalPartiesInCountry} <span className="hmc-unit">Partai</span>
              </strong>
              <span className="hmc-sub">
                {totalPartiesInCountry === 0 ? 'Belum ada partai didirikan' : 'Fraksi aktif di panggung politik'}
              </span>
            </div>
          </div>

          <div className="hrmh-metric-card glass-panel">
            <div className="hmc-icon-wrap font-gold">
              <Award size={22} />
            </div>
            <div className="hmc-data">
              <span className="hmc-label">STATUS KENDALI WILAYAH</span>
              <strong className="hmc-value font-gold">
                {currentRegion.dominantPartyId ? 'Dikuasai Partai' : 'Pemerintahan Netral'}
              </strong>
              <span className="hmc-sub">
                Pajak daerah: {currentRegion.regionalTax || 5}% • Stabilitas 100%
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* =========================================================================
          GRID UTAMA: PROFIL PEMAIN, PERANG AKTIF, SERANGAN TERBESAR & ARTIKEL
      ========================================================================= */}
      <div className="home-dashboard-main-grid">
        {/* KOLOM KIRI (7 Kolom): Profil Player & Perang Aktif & Serangan Terbesar */}
        <div className="home-left-column">
          {/* 1. INFORMASI PROFIL PEMAIN LENGKAP */}
          <div className="home-profile-card glass-panel">
            <div className="hpc-top-bar">
              <span className="hpc-badge">IDENTITAS WARGA NEGARA</span>
              <button 
                className="btn-secondary hpc-edit-btn"
                onClick={() => { sounds.playClick(); navigateToPage('profile', setActiveTab); }}
              >
                <span>Buka KTP & Profil</span>
                <ArrowRight size={14} />
              </button>
            </div>

            <div className="hpc-body">
              <div className="hpc-avatar-wrapper">
                {player?.avatar ? (
                  <img src={player.avatar} alt="Foto Profil" className="hpc-avatar-img" />
                ) : (
                  <div className="hpc-avatar-placeholder">
                    <span>{(player?.fullName || player?.username || 'W')[0].toUpperCase()}</span>
                  </div>
                )}
                <div className="hpc-status-dot" title="Warga Negara Aktif" />
              </div>

              <div className="hpc-info">
                <div className="hpc-title-row">
                  <h2 className="hpc-fullname">{player?.fullName || player?.username || 'Raden Satria'}</h2>
                  <span className="hpc-username">@{player?.username || 'satria'}</span>
                </div>
                <div className="hpc-meta-row">
                  <span className="badge badge-gold">Tingkat Karir Lv. {player?.level || 1}</span>
                  <span className="badge badge-cyan">{player?.position || 'Warga & Kader Politik'}</span>
                  <span className="badge badge-emerald">{player?.role ? player.role.toUpperCase() : 'WARGA'}</span>
                </div>

                {/* Kas dan Energi */}
                <div className="hpc-resources-grid">
                  <div className="hpc-res-box">
                    <div className="hpc-res-icon font-emerald">
                      <Coins size={18} />
                    </div>
                    <div>
                      <span className="hpc-res-label">KAS PRIBADI</span>
                      <strong className="hpc-res-val font-emerald">
                        {formatRP(player?.money || 0)}
                      </strong>
                    </div>
                  </div>

                  <div className="hpc-res-box">
                    <div className="hpc-res-icon font-gold">
                      <Sparkles size={18} />
                    </div>
                    <div>
                      <span className="hpc-res-label">CADANGAN EMAS</span>
                      <strong className="hpc-res-val font-gold">
                        {(player?.gold || 0).toLocaleString('id-ID')} Batang
                      </strong>
                    </div>
                  </div>

                  <div className="hpc-res-box">
                    <div className="hpc-res-icon font-cyan">
                      <Zap size={18} />
                    </div>
                    <div>
                      <span className="hpc-res-label">STAMINA & ENERGI</span>
                      <strong className="hpc-res-val font-cyan">
                        {player?.energy ?? 100} / {player?.maxEnergy ?? 100} ⚡
                      </strong>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* 2. PLAYER DENGAN SERANGAN TERBESAR DALAM 24 JAM TERAKHIR */}
          <div className="home-top-attacker-card glass-panel">
            <div className="section-head-badge font-crimson">
              <Flame size={16} />
              <span>REKOR TEMPUR MILITER 24 JAM TERAKHIR</span>
            </div>

            <div className="hta-content">
              <div className="hta-hero-attacker">
                <div className="hta-rank-badge">#1</div>
                <div className="hta-avatar-box">
                  <Swords size={22} className="font-crimson" />
                </div>
                <div className="hta-meta">
                  <span className="hta-subtitle">Prajurit / Panglima Terkuat Hari Ini</span>
                  <h3 className="hta-name">{topAttackerPlayer.name}</h3>
                  <div className="hta-tags">
                    <span className="badge badge-crimson">@{topAttackerPlayer.username}</span>
                    <span className="badge badge-cyan">{topAttackerPlayer.country}</span>
                    <span className="badge badge-gold">{topAttackerPlayer.region}</span>
                  </div>
                </div>
                <div className="hta-damage-score">
                  <span className="hta-score-label">TOTAL KERUSAKAN / DAMAGE</span>
                  <strong className="hta-score-val font-crimson">
                    +{topAttackerPlayer.damage24h.toLocaleString('id-ID')} PTS
                  </strong>
                  <span className="hta-active-tag">Keaktifan: {topAttackerPlayer.lastActive}</span>
                </div>
              </div>

              {/* Runner-ups list */}
              {topAttackers && topAttackers.length > 1 && (
                <div className="hta-runners-list">
                  <span className="hta-runners-title">Pejuang Tangguh Lainnya (Top Ranking):</span>
                  <div className="hta-runners-chips">
                    {topAttackers.slice(1, 4).map((att, idx) => (
                      <div key={att.id || idx} className="hta-runner-chip">
                        <span className="hta-runner-rank">#{idx + 2}</span>
                        <span className="hta-runner-name">{att.name}</span>
                        <span className="hta-runner-val">+{att.damage24h.toLocaleString('id-ID')} DMG</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* 3. PERANG YANG SEDANG TERJADI (ACTIVE WARS) */}
          <div className="home-wars-card glass-panel">
            <div className="section-head-row">
              <div className="section-head-badge font-crimson">
                <Swords size={16} />
                <span>FRONT PERTEMPURAN & PERANG YANG SEDANG TERJADI</span>
              </div>
              <button 
                className="btn-secondary hpc-edit-btn"
                onClick={() => { sounds.playClick(); navigateToPage('wars', setActiveTab); }}
              >
                <span>Lihat Medan Tempur</span>
                <ArrowRight size={14} />
              </button>
            </div>

            {primaryWar ? (
              <div className="hw-active-skirmish">
                <div className="hw-header">
                  <h3 className="hw-title">{primaryWar.title}</h3>
                  <span className="badge badge-crimson">
                    <Radio size={12} className="pulse-radio-icon" /> Ronde {primaryWar.currentRound} / {primaryWar.totalRounds}
                  </span>
                </div>
                <p className="hw-desc">{primaryWar.description}</p>

                {/* Clash Bar (Defender vs Attacker) */}
                <div className="hw-combatants-row">
                  <div className="hw-combatant defender">
                    <div className="hw-c-info">
                      <span className="hw-c-flag">{primaryWar.defender.flag}</span>
                      <div>
                        <strong className="hw-c-name">{primaryWar.defender.name}</strong>
                        <span className="hw-c-commander">{primaryWar.defender.commander}</span>
                      </div>
                    </div>
                    <span className="hw-c-dmg font-emerald">
                      🛡️ {primaryWar.defender.damage.toLocaleString('id-ID')} PTS
                    </span>
                  </div>

                  <div className="hw-vs-badge">VS</div>

                  <div className="hw-combatant attacker">
                    <div className="hw-c-info" style={{ flexDirection: 'row-reverse', textAlign: 'right' }}>
                      <span className="hw-c-flag">{primaryWar.attacker.flag}</span>
                      <div>
                        <strong className="hw-c-name">{primaryWar.attacker.name}</strong>
                        <span className="hw-c-commander">{primaryWar.attacker.commander}</span>
                      </div>
                    </div>
                    <span className="hw-c-dmg font-crimson">
                      ⚔️ {primaryWar.attacker.damage.toLocaleString('id-ID')} PTS
                    </span>
                  </div>
                </div>

                {/* Tug of war bar */}
                <div className="hw-progress-track">
                  {(() => {
                    const total = (primaryWar.defender.damage || 1) + (primaryWar.attacker.damage || 1);
                    const defPct = Math.round(((primaryWar.defender.damage || 0) / total) * 100);
                    return (
                      <>
                        <div className="hw-progress-def" style={{ width: `${defPct}%` }} title={`Pertahanan: ${defPct}%`} />
                        <div className="hw-progress-att" style={{ width: `${100 - defPct}%` }} title={`Penyerang: ${100 - defPct}%`} />
                      </>
                    );
                  })()}
                </div>

                <div className="hw-footer">
                  <span className="hw-region-tag">
                    <MapPin size={13} /> Target Wilayah: <strong>{primaryWar.targetRegionName}</strong>
                  </span>
                  <button 
                    className="btn-gold hw-deploy-btn"
                    onClick={() => { sounds.playClick(); navigateToPage('wars', setActiveTab); }}
                  >
                    <Shield size={14} /> Bantu Pertahanan Sekarang
                  </button>
                </div>
              </div>
            ) : (
              <div className="hw-empty-box">
                <Shield size={28} className="font-emerald" />
                <p>Saat ini tidak ada eskalasi perang terbuka. Kedaulatan wilayah berada dalam kondisi damai.</p>
              </div>
            )}
          </div>

          {/* 4. ARTIKEL & KORAN TERATAS DI NEGARA TERSEBUT */}
          <div className="home-top-article-card glass-panel">
            <div className="section-head-row">
              <div className="section-head-badge font-cyan">
                <Newspaper size={16} />
                <span>ARTIKEL TERATAS & KORAN NASIONAL DI {playerCountryName.toUpperCase()}</span>
              </div>
              <button 
                className="btn-secondary hpc-edit-btn"
                onClick={() => { sounds.playClick(); navigateToPage('media', setActiveTab); }}
              >
                <span>Semua Koran</span>
                <ArrowRight size={14} />
              </button>
            </div>

            <div className="hta-article-box">
              <div className="hta-art-meta">
                <span className="badge badge-purple">{topArticle.category || 'Berita Utama'}</span>
                <span className="hta-art-author">Oleh: <strong>{topArticle.author}</strong></span>
                <span className="dot-sep">•</span>
                <span className="hta-art-time">{topArticle.timeAgo || 'Baru saja'}</span>
              </div>

              <h3 className="hta-art-headline">{topArticle.headline}</h3>
              <p className="hta-art-snippet">
                {topArticle.content ? topArticle.content.slice(0, 190) + '...' : ''}
              </p>

              <div className="hta-art-footer">
                <div className="hta-art-stats">
                  <span title="Jumlah pembaca"><Eye size={14} /> {(topArticle.reads || 1200).toLocaleString('id-ID')} Dibaca</span>
                  <span title="Dukungan aspirasi"><HeartHandshake size={14} /> {(topArticle.upvotes || 84).toLocaleString('id-ID')} Dukungan</span>
                </div>
                <button 
                  className="btn-secondary"
                  onClick={() => { sounds.playClick(); navigateToPage('media', setActiveTab); }}
                  style={{ padding: '6px 12px', fontSize: '0.78rem' }}
                >
                  Baca Selengkapnya
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* KOLOM KANAN (5 Kolom): CHAT GLOBAL & CHAT BAHASA NEGARA ASLI */}
        <div className="home-right-column">
          <div className="home-chat-widget glass-panel">
            <div className="hcw-header">
              <div className="hcw-title">
                <MessageSquare size={18} className="font-gold" />
                <h3>Kanal Komunikasi & Diplomasi</h3>
              </div>
              <span className="hcw-live-indicator">
                <span className="pulse-dot" /> LIVE
              </span>
            </div>

            {/* TAB SELECTOR: Chat Nasional (Bahasa Asli) vs Chat Global */}
            <div className="hcw-tabs-bar">
              <button
                className={`hcw-tab-btn ${activeChatChannel === 'national' ? 'active' : ''}`}
                onClick={() => { setActiveChatChannel('national'); sounds.playClick(); }}
              >
                <Flag size={14} />
                <span>Chat {playerCountryName} (Bahasa Asli)</span>
              </button>
              <button
                className={`hcw-tab-btn ${activeChatChannel === 'global' ? 'active' : ''}`}
                onClick={() => { setActiveChatChannel('global'); sounds.playClick(); }}
              >
                <Globe size={14} />
                <span>Chat Global Dunia</span>
              </button>
            </div>

            {/* Chat Messages Feed */}
            <div className="hcw-messages-feed">
              {filteredChat.length === 0 ? (
                <div className="hcw-empty-msg">
                  <MessageSquare size={24} style={{ opacity: 0.5, marginBottom: '6px' }} />
                  <p>Belum ada pesan di kanal ini. Mulai percakapan pertama Anda!</p>
                </div>
              ) : (
                filteredChat.map((msg) => {
                  const isMe = msg.senderId === player?.id || msg.senderId === player?.username;

                  return (
                    <div key={msg.id} className={`hcw-message-bubble ${isMe ? 'outgoing' : 'incoming'}`}>
                      <div className="hcw-msg-head">
                        <strong className="hcw-sender-name">{msg.senderName}</strong>
                        <span className="hcw-sender-badge">{msg.badge || 'Warga'}</span>
                        <span className="hcw-msg-time">{msg.timestamp}</span>
                      </div>
                      <div className="hcw-msg-text">{msg.text}</div>
                    </div>
                  );
                })
              )}
            </div>

            {/* Input Form */}
            <form className="hcw-input-form" onSubmit={handleSendMessage}>
              <input 
                type="text" 
                className="hcw-input-field"
                placeholder={
                  activeChatChannel === 'national' 
                    ? `Ketik pesan dalam Bahasa ${playerCountryName}...`
                    : 'Ketik pesan diplomasi global dunia...'
                }
                value={chatInput}
                onChange={(e) => setChatInput(e.target.value)}
              />
              <button type="submit" className="btn-gold hcw-send-btn" title="Kirim Pesan">
                <Send size={16} />
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
