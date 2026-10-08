import React, { useState } from 'react';
import { useGame } from '../context/GameContext';
import { sounds } from '../utils/soundEffects';
import { 
  ShieldCheck, 
  Newspaper, 
  Scale, 
  UserCheck, 
  AlertTriangle, 
  Trash2, 
  Flag, 
  Ban, 
  History, 
  CheckCircle2,
  Crown,
  FileText
} from 'lucide-react';

export default function ModeratorPanel() {
  const { 
    currentUser, 
    userRole, 
    isModerator, 
    switchActiveRole, 
    articles, 
    moderateArticle, 
    bills, 
    vetoBill, 
    usersList, 
    updateUserStatus, 
    showToast 
  } = useGame();

  const [activeTab, setActiveTab] = useState('media'); // 'media', 'parliament', 'users', 'logs'
  const [moderationLogs, setModerationLogs] = useState([
    { id: 1, action: 'Verifikasi Artikel', target: 'Pemerintah Sahkan UU IKN Baru', time: '10 menit lalu', by: 'Baharudin Lopa' },
    { id: 2, action: 'Peringatan Akun', target: 'Pengguna @satria (Ketertiban Forum)', time: '1 jam lalu', by: 'Dewan Kehormatan' },
  ]);

  const addLog = (action, target) => {
    setModerationLogs(prev => [
      { id: Date.now(), action, target, time: 'Baru saja', by: currentUser?.fullName || 'Moderator' },
      ...prev
    ]);
  };

  // If accessed by non-moderator, show gate
  if (!isModerator) {
    return (
      <div className="restricted-access-panel glass-panel-gold">
        <Scale size={56} className="text-purple animate-pulse" />
        <h2 className="restricted-title">Akses Khusus Dewan Kehormatan & Moderator</h2>
        <p className="restricted-desc">
          Panel ini hanya diperuntukkan bagi <strong>Moderator & Dewan Kehormatan Nasional</strong> untuk menegakkan konstitusi, etika pers, dan ketertiban sipil.
          Role Akun Anda saat ini: <span className="role-tag-curr">{userRole.toUpperCase()}</span>.
        </p>
      </div>
    );
  }

  return (
    <div className="admin-dashboard-container">
      {/* Moderator Hero Header */}
      <div className="admin-hero-banner glass-panel-gold">
        <div className="admin-hero-left">
          <div className="admin-badge-row">
            <span className="badge-role-mod">
              <ShieldCheck size={14} /> DEWAN KEHORMATAN & MODERATOR
            </span>
            <span className="badge-sys-online">PENGAWASAN AKTIF</span>
          </div>
          <h1 className="admin-title">Sidang Etika & Pengawasan Nasional</h1>
          <p className="admin-subtitle">
            Pusat pengawasan kebebasan pers, penegakan konstitusi parlemen, dan disiplin warga negara berdaulat.
          </p>
        </div>
      </div>

      {/* Moderator Tabs */}
      <div className="admin-tabs-bar">
        <button 
          className={`admin-tab-btn ${activeTab === 'media' ? 'active' : ''}`}
          onClick={() => { sounds.playClick(); setActiveTab('media'); }}
        >
          <Newspaper size={17} />
          <span>Moderasi Berita Pers ({articles.length})</span>
        </button>
        <button 
          className={`admin-tab-btn ${activeTab === 'parliament' ? 'active' : ''}`}
          onClick={() => { sounds.playClick(); setActiveTab('parliament'); }}
        >
          <Scale size={17} />
          <span>Veto RUU Parlemen ({bills.length})</span>
        </button>
        <button 
          className={`admin-tab-btn ${activeTab === 'users' ? 'active' : ''}`}
          onClick={() => { sounds.playClick(); setActiveTab('users'); }}
        >
          <UserCheck size={17} />
          <span>Disiplin Warga Negara</span>
        </button>
        <button 
          className={`admin-tab-btn ${activeTab === 'logs' ? 'active' : ''}`}
          onClick={() => { sounds.playClick(); setActiveTab('logs'); }}
        >
          <History size={17} />
          <span>Log Moderasi</span>
        </button>
      </div>

      {/* TAB 1: MEDIA MODERATION */}
      {activeTab === 'media' && (
        <div className="admin-section-content">
          <div className="admin-table-card glass-panel-gold">
            <div className="card-top-row">
              <h3 className="card-title">Pemeriksaan Berita & Opini Pers</h3>
              <span className="card-hint">Hapus berita hoaks atau tandai peringatan etika jurnalistik</span>
            </div>

            <div className="moderator-articles-grid">
              {articles.map((art) => (
                <div key={art.id} className={`mod-article-card ${art.isFlagged ? 'flagged-border' : ''}`}>
                  <div className="mac-header">
                    <span className="mac-category">{art.category}</span>
                    <span className="mac-author">Oleh: <strong>{art.author}</strong></span>
                  </div>
                  <h4 className="mac-title">{art.title}</h4>
                  <p className="mac-content">{art.content.slice(0, 140)}...</p>

                  {art.isFlagged && (
                    <div className="mac-flag-warning">
                      <AlertTriangle size={14} /> Berita ini telah ditandai hoaks / provokatif
                    </div>
                  )}

                  <div className="mac-footer">
                    <button 
                      className="btn-mod-flag"
                      onClick={() => {
                        moderateArticle(art.id, 'flag', 'Melanggar kode etik pers');
                        addLog('Tandai Hoaks', art.title);
                      }}
                    >
                      <Flag size={14} /> {art.isFlagged ? 'Sudah Ditandai' : 'Tandai Hoaks'}
                    </button>
                    <button 
                      className="btn-mod-delete"
                      onClick={() => {
                        moderateArticle(art.id, 'delete');
                        addLog('Hapus Artikel', art.title);
                      }}
                    >
                      <Trash2 size={14} /> Hapus Artikel
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: PARLIAMENT VETO */}
      {activeTab === 'parliament' && (
        <div className="admin-section-content">
          <div className="admin-table-card glass-panel-gold">
            <div className="card-top-row">
              <h3 className="card-title">Pengawasan Konstitusional RUU Parlemen</h3>
              <span className="card-hint">Moderator memiliki hak veto terhadap RUU yang melanggar UUD</span>
            </div>

            <div className="moderator-bills-list">
              {bills.map((bill) => {
                const isVetoed = bill.status === 'vetoed';

                return (
                  <div key={bill.id} className={`mod-bill-item ${isVetoed ? 'bill-vetoed' : ''}`}>
                    <div className="mbi-info">
                      <div className="mbi-top">
                        <span className="mbi-tag">RUU #{bill.id}</span>
                        <span className={`mbi-status status-${bill.status}`}>
                          {isVetoed ? '⛔ DIVETO DEWAN KEHORMATAN' : bill.status.toUpperCase()}
                        </span>
                      </div>
                      <h4 className="mbi-title">{bill.title}</h4>
                      <p className="mbi-desc">{bill.description}</p>
                      {isVetoed && (
                        <p className="veto-reason-text">
                          Alasan Veto: {bill.vetoReason || 'Bertentangan dengan Konstitusi'}
                        </p>
                      )}
                    </div>
                    <div className="mbi-actions">
                      {!isVetoed ? (
                        <button 
                          className="btn-danger btn-veto"
                          onClick={() => {
                            vetoBill(bill.id, 'Pelanggaran Konstitusi & Etika Parlemen');
                            addLog('Veto RUU', bill.title);
                          }}
                        >
                          <Ban size={15} /> Veto RUU Ini
                        </button>
                      ) : (
                        <span className="text-muted-tag">Telah Dibatalkan</span>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* TAB 3: USER DISCIPLINE */}
      {activeTab === 'users' && (
        <div className="admin-section-content">
          <div className="admin-table-card glass-panel-gold">
            <div className="card-top-row">
              <h3 className="card-title">Penegakan Disiplin & Etika Warga</h3>
              <span className="card-hint">Berikan sanksi etik kepada akun provokatif atau melanggar aturan</span>
            </div>

            <div className="admin-table-wrapper">
              <table className="admin-data-table">
                <thead>
                  <tr>
                    <th>Warga / Politisi</th>
                    <th>Role Saat Ini</th>
                    <th>Status Ketertiban</th>
                    <th>Tindakan Etika Moderator</th>
                  </tr>
                </thead>
                <tbody>
                  {usersList.map((u) => {
                    const uStatus = u.status || 'active';
                    return (
                      <tr key={u.id}>
                        <td>
                          <div className="user-profile-cell">
                            <div className="up-avatar">{u.fullName?.charAt(0) || 'U'}</div>
                            <div className="up-text">
                              <span className="up-name">{u.fullName}</span>
                              <span className="up-uname">@{u.username}</span>
                            </div>
                          </div>
                        </td>
                        <td>
                          <span className={`role-badge role-${u.role || 'player'}`}>
                            {(u.role || 'player').toUpperCase()}
                          </span>
                        </td>
                        <td>
                          <span className={`status-badge status-${uStatus}`}>
                            {uStatus === 'active' && '✅ Tertib'}
                            {uStatus === 'warned' && '⚠️ Peringatan Etik'}
                            {uStatus === 'banned' && '🚫 Pembekuan Hak'}
                          </span>
                        </td>
                        <td>
                          <div className="admin-actions-cell">
                            {uStatus === 'active' ? (
                              <button 
                                className="btn-action-warn"
                                onClick={() => {
                                  updateUserStatus(u.id, 'warned', 'Peringatan Ketertiban');
                                  addLog('Peringatan Akun', `@${u.username}`);
                                }}
                              >
                                Peringatan Etik
                              </button>
                            ) : (
                              <button 
                                className="btn-action-restore"
                                onClick={() => {
                                  updateUserStatus(u.id, 'active');
                                  addLog('Pemulihan Akun', `@${u.username}`);
                                }}
                              >
                                Pulihkan Hak
                              </button>
                            )}

                            {uStatus !== 'banned' && (
                              <button 
                                className="btn-action-ban"
                                onClick={() => {
                                  updateUserStatus(u.id, 'banned', 'Pelanggaran Ketertiban Umum');
                                  addLog('Bekukan Akun', `@${u.username}`);
                                }}
                              >
                                Bekukan
                              </button>
                            )}
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* TAB 4: AUDIT LOGS */}
      {activeTab === 'logs' && (
        <div className="admin-section-content">
          <div className="admin-table-card glass-panel-gold">
            <h3 className="card-title">Buku Log Aktivitas Pengawasan & Penegakan</h3>
            <div className="moderator-logs-list">
              {moderationLogs.map((log) => (
                <div key={log.id} className="mod-log-row">
                  <div className="ml-icon">
                    <CheckCircle2 size={16} className="text-cyan" />
                  </div>
                  <div className="ml-details">
                    <span className="ml-action">{log.action}: <strong>{log.target}</strong></span>
                    <span className="ml-meta">Oleh: {log.by} • {log.time}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
