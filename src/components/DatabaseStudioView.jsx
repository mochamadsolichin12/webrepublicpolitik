import React, { useState, useEffect } from 'react';
import { sounds } from '../utils/soundEffects';
import { 
  Database, 
  Table, 
  Terminal, 
  FileCode, 
  Download, 
  RefreshCw, 
  CheckCircle2, 
  AlertCircle, 
  Search, 
  ArrowRight, 
  Server, 
  Layers, 
  Code, 
  Play, 
  Copy, 
  Check, 
  Users, 
  Map, 
  Flag, 
  FileText, 
  Award, 
  Vote, 
  Globe, 
  Briefcase 
} from 'lucide-react';
import { fetchDatabaseStats, fetchTableRows, executeSqlQuery } from '../services/dbClient';

const TABLE_METADATA = {
  users: { icon: Users, label: 'Karakter & Pengguna', desc: 'Akun, jabatan, level, saldo kas pribadi, emas, partai, dan wilayah spawn.' },
  regions: { icon: Map, label: '38 Provinsi Indonesia', desc: 'Data otonomi 38 provinsi, APBD, populasi, komoditas, dan tingkat kepuasan.' },
  parties: { icon: Flag, label: 'Partai Politik', desc: 'Partai politik nasional, kursi Parlemen, ideologi, ketua umum, dan kas partai.' },
  bills: { icon: FileText, label: 'RUU Parlemen', desc: 'Draf undang-undang Parlemen, status pembahasan, dan hasil pemungutan suara.' },
  bill_votes: { icon: Vote, label: 'Suara Parlemen', desc: 'Catatan hak suara perorangan anggota fraksi pada setiap draf RUU.' },
  passed_laws: { icon: Award, label: 'Undang-Undang Resmi', desc: 'Undang-undang NKRI yang telah disahkan dan berlaku secara nasional.' },
  elections: { icon: Vote, label: 'Pemilu & Pilpres', desc: 'Periode dan agenda pemilu raya presiden serta wakil presiden.' },
  candidates: { icon: Users, label: 'Kandidat Capres-Cawapres', desc: 'Pasangan calon presiden, perolehan suara nasional, visi misi, dan janji kampanye.' },
  election_votes: { icon: Vote, label: 'Surat Suara Pemilu', desc: 'Rekapitulasi hak pilih digital warga negara dalam pemilihan presiden.' },
  articles: { icon: FileText, label: 'Koran & Media Pers', desc: 'Artikel berita opini, jurnalisme investigasi, pembaca, dan apresiasi upvote.' },
  article_upvotes: { icon: Award, label: 'Apresiasi Koran', desc: 'Riwayat dukungan warga pembaca terhadap penerbitan pers nasional.' },
  world_regions: { icon: Globe, label: 'Kawasan Geopolitik Dunia', desc: 'Kedaulatan 177 negara dunia, hubungan diplomasi dengan RI, dan militer.' },
  diplomatic_treaties: { icon: Briefcase, label: 'Traktat Bilateral RI', desc: 'Perjanjian ekspor-impor komoditas, kedutaan besar, dan pakta pertahanan laut.' },
  game_logs: { icon: Terminal, label: 'Audit Trail & Log Aksi', desc: 'Catatan rekam jejak aktivitas tata negara dan transaksi ekonomi pemain.' },
};

const SAMPLE_QUERIES = [
  {
    title: 'Top 5 Provinsi APBD Terbesar',
    sql: 'SELECT id, name, capital, population, budget FROM regions ORDER BY budget DESC LIMIT 5;',
  },
  {
    title: 'Perolehan Kursi Fraksi Parlemen',
    sql: 'SELECT id, name, leader, seats, funds FROM parties ORDER BY seats DESC;',
  },
  {
    title: 'Daftar RUU Parlemen',
    sql: 'SELECT id, title, category, author_name, status, yes_votes, no_votes FROM bills;',
  },
  {
    title: 'Kekuatan Geopolitik Kawasan ASEAN',
    sql: 'SELECT name, capital, flag, bloc, military_power, diplomatic_status FROM world_regions WHERE sector = \'asean\';',
  },
  {
    title: 'Profil Karakter Pemain',
    sql: 'SELECT id, username, full_name, level, money, gold, residence_region_id FROM users LIMIT 5;',
  },
];

export default function DatabaseStudioView() {
  const [activeSubTab, setActiveSubTab] = useState('tables'); // 'tables', 'query', 'erd', 'integration'
  const [tableStats, setTableStats] = useState([]);
  const [selectedTable, setSelectedTable] = useState('regions');
  const [tableData, setTableData] = useState([]);
  const [tableSearch, setTableSearch] = useState('');
  const [loading, setLoading] = useState(false);
  const [copied, setCopied] = useState(false);

  // Query Playground state
  const [queryInput, setQueryInput] = useState(SAMPLE_QUERIES[0].sql);
  const [queryResult, setQueryResult] = useState(null);
  const [queryError, setQueryError] = useState(null);
  const [queryExecuting, setQueryExecuting] = useState(false);

  // Load initial table stats
  const loadStats = async () => {
    setLoading(true);
    const stats = await fetchDatabaseStats();
    setTableStats(stats);
    setLoading(false);
  };

  useEffect(() => {
    loadStats();
  }, []);

  // Load rows when selected table changes
  useEffect(() => {
    if (selectedTable) {
      loadTableRows(selectedTable);
    }
  }, [selectedTable]);

  const loadTableRows = async (tableName) => {
    setLoading(true);
    const rows = await fetchTableRows(tableName);
    setTableData(rows);
    setLoading(false);
  };

  const handleRunQuery = async () => {
    sounds.playClick();
    setQueryExecuting(true);
    setQueryError(null);
    setQueryResult(null);

    const res = await executeSqlQuery(queryInput);
    if (res.success) {
      setQueryResult(res.rows);
    } else {
      setQueryError(res.error || 'Gagal mengeksekusi query.');
    }
    setQueryExecuting(false);
  };

  const handleDownloadFile = (type) => {
    sounds.playClick();
    let filename = '';
    let url = '';

    if (type === 'schema') {
      filename = 'schema.sql';
      url = '/database/schema.sql';
    } else if (type === 'seed') {
      filename = 'seed.sql';
      url = '/database/seed.sql';
    } else if (type === 'json') {
      filename = 'seedData.json';
      url = '/database/seedData.json';
    }

    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };

  const totalRecords = tableStats.reduce((acc, curr) => acc + (curr.rowCount || 0), 0);

  // Filter table data
  const filteredRows = tableData.filter((row) => {
    if (!tableSearch.trim()) return true;
    const term = tableSearch.toLowerCase();
    return Object.values(row).some((val) => 
      String(val).toLowerCase().includes(term)
    );
  });

  return (
    <div className="database-studio-container">
      {/* Studio Top Header */}
      <div className="db-hero-header glass-panel">
        <div className="db-hero-left">
          <div className="db-badge-online">
            <span className="live-dot" style={{ background: '#10b981', boxShadow: '0 0 8px #10b981' }} />
            <span>MySQL Database Engine • Live & Connected</span>
          </div>
          <h2 className="db-title">
            <Database size={24} className="font-cyan" /> Basis Data Relasional MySQL Republik Nusantara
          </h2>
          <p className="db-subtitle">
            Basis data MySQL / MariaDB dengan 14 tabel relasional terstruktur untuk mengelola tata kelola 38 provinsi, partai politik, parlemen, pemilu nasional, koran pers, dan diplomasi internasional.
          </p>
        </div>

        {/* Quick Action Buttons */}
        <div className="db-hero-actions">
          <button className="btn-secondary db-btn" onClick={() => handleDownloadFile('schema')}>
            <Download size={14} /> Unduh mysql_schema.sql
          </button>
          <button className="btn-secondary db-btn" onClick={() => handleDownloadFile('seed')}>
            <Download size={14} /> Unduh seed.sql
          </button>
          <button className="btn-gold db-btn" onClick={() => handleDownloadFile('json')}>
            <Download size={14} /> Ekspor JSON Backup
          </button>
        </div>
      </div>

      {/* Metrics Summary Strip */}
      <div className="db-metrics-strip glass-panel">
        <div className="db-metric-item">
          <span className="db-metric-label"><Table size={14} /> Total Tabel</span>
          <strong className="db-metric-val font-cyan">{tableStats.length || 14} Tabel</strong>
        </div>
        <div className="db-metric-item">
          <span className="db-metric-label"><Layers size={14} /> Total Data Record</span>
          <strong className="db-metric-val font-gold">{totalRecords.toLocaleString('id-ID')} Baris</strong>
        </div>
        <div className="db-metric-item">
          <span className="db-metric-label"><Server size={14} /> Database Engine</span>
          <strong className="db-metric-val font-emerald">MySQL 8.x / MariaDB (XAMPP)</strong>
        </div>
        <div className="db-metric-item">
          <span className="db-metric-label"><Code size={14} /> Database Name</span>
          <strong className="db-metric-val">republic_politik (Port 3306)</strong>
        </div>
        <button 
          className="btn-icon-refresh" 
          onClick={() => { sounds.playClick(); loadStats(); if (selectedTable) loadTableRows(selectedTable); }}
          title="Segarkan Data Tabel"
        >
          <RefreshCw size={15} className={loading ? 'spin-anim' : ''} />
        </button>
      </div>

      {/* Studio Nav Tabs */}
      <div className="db-tab-bar">
        <button 
          className={`db-tab-btn ${activeSubTab === 'tables' ? 'active' : ''}`}
          onClick={() => { sounds.playClick(); setActiveSubTab('tables'); }}
        >
          <Table size={16} /> 14 Tabel Data Relasional
        </button>
        <button 
          className={`db-tab-btn ${activeSubTab === 'query' ? 'active' : ''}`}
          onClick={() => { sounds.playClick(); setActiveSubTab('query'); }}
        >
          <Terminal size={16} /> SQL Query Playground
        </button>
        <button 
          className={`db-tab-btn ${activeSubTab === 'erd' ? 'active' : ''}`}
          onClick={() => { sounds.playClick(); setActiveSubTab('erd'); }}
        >
          <Layers size={16} /> Skema Relasional (ERD)
        </button>
        <button 
          className={`db-tab-btn ${activeSubTab === 'integration' ? 'active' : ''}`}
          onClick={() => { sounds.playClick(); setActiveSubTab('integration'); }}
        >
          <Server size={16} /> Panduan Backend & Migrasi
        </button>
      </div>

      {/* ==================== TAB 1: 14 TABEL BASIS DATA ==================== */}
      {activeSubTab === 'tables' && (
        <div className="db-tab-content">
          {/* Table Cards Grid */}
          <div className="db-tables-grid">
            {tableStats.map((item) => {
              const meta = TABLE_METADATA[item.table] || { icon: Table, label: item.table, desc: 'Tabel data sistem.' };
              const Icon = meta.icon;
              const isSelected = selectedTable === item.table;

              return (
                <div 
                  key={item.table}
                  className={`db-table-card glass-panel ${isSelected ? 'active' : ''}`}
                  onClick={() => {
                    sounds.playClick();
                    setSelectedTable(item.table);
                  }}
                >
                  <div className="dtc-header">
                    <div className="dtc-title-box">
                      <Icon size={16} className="font-cyan" />
                      <strong className="dtc-name">{item.table}</strong>
                    </div>
                    <span className="dtc-count-badge font-gold">{item.rowCount} baris</span>
                  </div>
                  <h4 className="dtc-label">{meta.label}</h4>
                  <p className="dtc-desc">{meta.desc}</p>
                </div>
              );
            })}
          </div>

          {/* Table Data Viewer */}
          <div className="db-data-viewer glass-panel">
            <div className="ddv-header">
              <div className="ddv-left">
                <Table size={18} className="font-cyan" />
                <h3 className="ddv-title">Isi Tabel: <span className="font-gold">{selectedTable}</span> ({filteredRows.length} dari {tableData.length} baris)</h3>
              </div>
              <div className="ddv-search">
                <Search size={15} />
                <input 
                  type="text"
                  placeholder={`Cari dalam tabel ${selectedTable}...`}
                  value={tableSearch}
                  onChange={(e) => setTableSearch(e.target.value)}
                  className="ddv-search-input"
                />
              </div>
            </div>

            {/* Render Data Table */}
            <div className="ddv-table-wrapper">
              {filteredRows.length === 0 ? (
                <div className="ddv-empty">
                  <span>Tidak ada data baris yang ditemukan.</span>
                </div>
              ) : (
                <table className="sql-data-table">
                  <thead>
                    <tr>
                      {Object.keys(filteredRows[0] || {}).map((col) => (
                        <th key={col}>{col}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {filteredRows.slice(0, 50).map((row, idx) => (
                      <tr key={idx}>
                        {Object.entries(row).map(([k, val], cIdx) => (
                          <td key={cIdx} title={String(val)}>
                            {typeof val === 'number' && k.includes('budget') 
                              ? `Rp ${(val / 1e12).toFixed(2)} Triliun`
                              : typeof val === 'number' && k.includes('money')
                              ? `Rp ${val.toLocaleString('id-ID')}`
                              : typeof val === 'object'
                              ? JSON.stringify(val)
                              : String(val)}
                          </td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </div>
          </div>
        </div>
      )}

      {/* ==================== TAB 2: SQL QUERY PLAYGROUND ==================== */}
      {activeSubTab === 'query' && (
        <div className="db-tab-content">
          <div className="sql-editor-card glass-panel">
            <div className="sec-header">
              <div className="sec-left">
                <Terminal size={18} className="font-cyan" />
                <h3 className="sec-title">SQL Query Runner (Interaktif)</h3>
              </div>
              <button 
                className="btn-gold sec-run-btn" 
                onClick={handleRunQuery}
                disabled={queryExecuting}
              >
                <Play size={14} /> {queryExecuting ? 'Mengeksekusi...' : 'Jalankan Query (Execute)'}
              </button>
            </div>

            {/* Quick Templates */}
            <div className="sec-templates-bar">
              <span className="stb-label">Contoh Query Siap Pakai:</span>
              {SAMPLE_QUERIES.map((sample, idx) => (
                <button
                  key={idx}
                  className="stb-chip"
                  onClick={() => { sounds.playClick(); setQueryInput(sample.sql); }}
                >
                  {sample.title}
                </button>
              ))}
            </div>

            {/* SQL Input Textarea */}
            <textarea
              className="sql-input-area"
              rows={4}
              value={queryInput}
              onChange={(e) => setQueryInput(e.target.value)}
              placeholder="Ketik query SQL di sini (contoh: SELECT * FROM regions WHERE island = 'jawa';)"
            />

            {/* Query Error */}
            {queryError && (
              <div className="sql-error-box">
                <AlertCircle size={16} />
                <span>{queryError}</span>
              </div>
            )}

            {/* Query Results */}
            {queryResult && (
              <div className="sql-results-container">
                <div className="src-header">
                  <CheckCircle2 size={16} className="font-emerald" />
                  <strong>Query Sukses: Mengembalikan {queryResult.length} baris data.</strong>
                </div>

                {queryResult.length > 0 ? (
                  <div className="ddv-table-wrapper">
                    <table className="sql-data-table">
                      <thead>
                        <tr>
                          {Object.keys(queryResult[0]).map((col) => (
                            <th key={col}>{col}</th>
                          ))}
                        </tr>
                      </thead>
                      <tbody>
                        {queryResult.map((row, idx) => (
                          <tr key={idx}>
                            {Object.values(row).map((val, cIdx) => (
                              <td key={cIdx}>{typeof val === 'object' ? JSON.stringify(val) : String(val)}</td>
                            ))}
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                ) : (
                  <p className="sql-no-rows">Query berhasil dieksekusi tanpa baris hasil.</p>
                )}
              </div>
            )}
          </div>
        </div>
      )}

      {/* ==================== TAB 3: SKEMA RELASIONAL (ERD) ==================== */}
      {activeSubTab === 'erd' && (
        <div className="db-tab-content">
          <div className="erd-overview-card glass-panel">
            <h3 className="erd-title"><Layers size={18} className="font-cyan" /> Struktur Relasi Entitas (Entity Relationship Model)</h3>
            <p className="erd-desc">
              Basis data dirancang dengan normalisasi relasional tinggi menghubungkan warga negara, otonomi 38 provinsi, partai politik, legislatif, dan diplomasi luar negeri:
            </p>

            <div className="erd-diagram-grid">
              <div className="erd-node glass-panel">
                <h4 className="en-title font-cyan">users (Pemain & Kader)</h4>
                <ul>
                  <li><strong>id</strong>: PK Text</li>
                  <li><strong>username</strong>: Unique</li>
                  <li><strong>party_id</strong>: FK &rarr; parties(id)</li>
                  <li><strong>residence_region_id</strong>: FK &rarr; regions(id)</li>
                  <li>money, gold, level, perks</li>
                </ul>
              </div>

              <div className="erd-node glass-panel">
                <h4 className="en-title font-gold">regions (38 Provinsi)</h4>
                <ul>
                  <li><strong>id</strong>: PK Text</li>
                  <li><strong>name, capital, island</strong></li>
                  <li><strong>dominant_party_id</strong>: FK &rarr; parties(id)</li>
                  <li>budget, population, resource, tax_rate</li>
                </ul>
              </div>

              <div className="erd-node glass-panel">
                <h4 className="en-title font-emerald">parties (Partai Politik)</h4>
                <ul>
                  <li><strong>id</strong>: PK Text</li>
                  <li><strong>name, short_name, leader</strong></li>
                  <li>seats, funds, ideology, color</li>
                </ul>
              </div>

              <div className="erd-node glass-panel">
                <h4 className="en-title font-purple">bills & laws (Parlemen)</h4>
                <ul>
                  <li><strong>id</strong>: PK Text</li>
                  <li><strong>author_id</strong>: FK &rarr; users(id)</li>
                  <li><strong>party_id</strong>: FK &rarr; parties(id)</li>
                  <li>yes_votes, no_votes, status</li>
                </ul>
              </div>

              <div className="erd-node glass-panel">
                <h4 className="en-title font-blue">world_regions (Geopolitik)</h4>
                <ul>
                  <li><strong>id</strong>: PK Text</li>
                  <li><strong>iso2, iso3, name, capital</strong></li>
                  <li>bloc, sector, military_power</li>
                  <li>&rarr; diplomatic_treaties</li>
                </ul>
              </div>
            </div>

            {/* DDL Code Box */}
            <div className="ddl-preview-box">
              <div className="dpb-header">
                <span>File Skema Asli: <strong>database/schema.sql</strong></span>
                <button 
                  className="btn-secondary"
                  onClick={() => {
                    handleDownloadFile('schema');
                    setCopied(true);
                    setTimeout(() => setCopied(false), 2000);
                  }}
                >
                  <Download size={14} /> Unduh schema.sql
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ==================== TAB 4: PANDUAN INTEGRASI BACKEND ==================== */}
      {activeSubTab === 'integration' && (
        <div className="db-tab-content">
          <div className="integration-guide-card glass-panel">
            <h3 className="ig-title"><Server size={18} className="font-cyan" /> Panduan Menjalankan & Menghubungkan Backend</h3>
            
            <div className="ig-steps">
              <div className="ig-step-box">
                <h4>1. Menjalankan REST API Server Database</h4>
                <p>Jalankan perintah berikut di terminal untuk mengaktifkan API backend Express & SQLite:</p>
                <pre className="code-block">node server/server.js</pre>
                <p className="ig-subtext">Server akan berjalan di <code>http://localhost:3001</code> dan otomatis menghubungkan <code>database/republic_politik.db</code>.</p>
              </div>

              <div className="ig-step-box">
                <h4>2. Struktur Direktori Database</h4>
                <ul className="ig-dir-list">
                  <li><code>database/schema.sql</code>: Definisi DDL tabel lengkap (ANSI SQL / Postgres / MySQL compatible).</li>
                  <li><code>database/seed.sql</code>: Data awal 38 provinsi, partai, draf RUU, capres, dan negara dunia.</li>
                  <li><code>database/republic_politik.db</code>: Berkas basis data SQLite native berkecepatan tinggi.</li>
                  <li><code>database/dbManager.js</code>: Modul koneksi basis data menggunakan <code>node:sqlite</code>.</li>
                  <li><code>server/server.js</code>: Server Express REST API dengan endpoint lengkap.</li>
                </ul>
              </div>

              <div className="ig-step-box">
                <h4>3. Migrasi ke PostgreSQL / Supabase / MySQL</h4>
                <p>
                  Jika Anda ingin menggunakan database cloud seperti Supabase, Neon, atau MySQL phpMyAdmin:
                </p>
                <ol className="ig-steps-list">
                  <li>Unduh berkas <code>schema.sql</code> dan <code>seed.sql</code> menggunakan tombol di atas.</li>
                  <li>Buka <strong>SQL Editor</strong> di dashboard Supabase / phpMyAdmin Anda.</li>
                  <li>Tempelkan dan jalankan isi <code>schema.sql</code>, kemudian <code>seed.sql</code>.</li>
                  <li>Semua tabel dan 38 provinsi akan langsung terisi secara instan!</li>
                </ol>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
