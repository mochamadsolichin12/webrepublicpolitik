import fs from 'fs';
import { INITIAL_REGIONS } from '../src/data/regionsData.js';
import { INITIAL_BILLS, INITIAL_PASSED_LAWS } from '../src/data/lawsData.js';
import { INITIAL_ARTICLES, INITIAL_PRESIDENTIAL_CANDIDATES } from '../src/data/mediaAndElections.js';
import { WORLD_REGIONS } from '../src/data/worldRegionsData.js';

function esc(val) {
  if (val === null || val === undefined) return 'NULL';
  if (typeof val === 'number') return val;
  return "'" + String(val).replace(/\\/g, '\\\\').replace(/'/g, "''") + "'";
}

let out = `-- ==============================================================================
-- 🏛️ DATABASE EXPORT: REPUBLIC POLITIC (MYSQL / MARIADB / XAMPP)
-- Engine: MySQL 8.x / MariaDB 10.x Compatible
-- Skema Tabel Relasional Lengkap & Seed Data Game Geopolitik
-- ==============================================================================

CREATE DATABASE IF NOT EXISTS \`republic_politik\` CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE \`republic_politik\`;

`;

const schema = fs.readFileSync('database/mysql_schema.sql', 'utf8');
const cleanSchema = schema.replace(/CREATE DATABASE[^\n]+;/i, '').replace(/USE[^\n]+;/i, '');
out += cleanSchema.trim() + '\n\n';

out += `-- ==============================================================================
-- 🚀 DATA AWAL LENGKAP (SEED DATA UNTUK MYSQL)
-- ==============================================================================

-- 1. DATA PENGGUNA DEMO & AKUN OTORITAS (HANYA SUPER ADMIN)
INSERT INTO users (id, username, email, password_hash, full_name, title, position, level, exp, max_exp, energy, max_energy, money, gold, party_id, residence_region_id, role, status) VALUES
('usr-superadmin', 'superadmin', 'admin@nusantara.gov.id', 'adminpassword', 'Sultan Agung Hanyokrokusumo', 'Super Administrator Negara', 'Dewan Pengawas Tertinggi RI', 99, 1000, 1000, 100, 100, 1000000000000.0, 1000, 'pdin', 'dki', 'superadmin', 'active')
ON DUPLICATE KEY UPDATE full_name=VALUES(full_name);

-- 2. DATA PARTAI POLITIK
INSERT INTO parties (id, name, short_name, leader, ideology, color, seats, funds, members_count, description) VALUES
('pdin', 'Partai Demokrasi Indonesia Nusantara', 'PDI-N', 'Hj. Megawati Soekarno Putri (Ketum Kehormatan)', 'Nasionalis Marhaenis', '#dc2626', 26, 1450000000, 42800, 'Berjuang untuk Kedaulatan Wong Cilik'),
('pgr', 'Partai Gerakan Republik', 'PGR', 'Jenderal (Purn) Prabowo Kusumo', 'Nasionalis Patriotik & Militer Terorganisir', '#f59e0b', 24, 1890000000, 39500, 'Nusantara Berdaulat, Militer Tangguh, Pangan Mandiri'),
('ptp', 'Partai Teknokrat Pembangunan', 'PTP', 'Dr. Ilham Habibie, M.Sc', 'Teknokrasi, Investasi & Digitalisasi', '#06b6d4', 18, 2150000000, 28400, 'Inovasi, Industri Hijau & Sains Masa Depan'),
('pkbr', 'Partai Kebangkitan Bangsa Rakyat', 'PKB-R', 'K.H. Muhaimin Iskandar', 'Moderat Tradisionalis & Ekonomi Kerakyatan', '#10b981', 15, 1100000000, 34100, 'Bela Kesejahteraan Umat & Desa Nusantara'),
('pksn', 'Partai Keadilan Sejahtera Nusantara', 'PKS-N', 'Dr. Ahmad Syaikhu', 'Sosial Religius & Oposisi Kritis', '#f97316', 11, 950000000, 22000, 'Keadilan, Integritas, & Pelayan Rakyat'),
('psim', 'Partai Solidaritas Maju', 'PSI-M', 'Kaesang Pangarep, B.Sc', 'Reformis Progresif Pemuda & Transparansi', '#a855f7', 6, 820000000, 16700, 'Politik Baru, Anti-Korupsi & Transparansi Total')
ON DUPLICATE KEY UPDATE name=VALUES(name);

-- 3. DATA 38 PROVINSI REPUBLIK INDONESIA
INSERT INTO regions (id, name, capital, island, population, budget, dominant_party_id, support_rate, resource, tax_rate, infrastructure_level, defense_power, lat, lng) VALUES
` + INITIAL_REGIONS.map(r => `(${esc(r.id)}, ${esc(r.name)}, ${esc(r.capital)}, ${esc(r.island)}, ${r.population || 5000000}, ${r.budget || 20000000000}, ${esc(r.dominantPartyId || 'pdin')}, ${r.supportRate || 75}, ${esc(r.resource)}, 10.0, 1, 60, ${r.lat}, ${r.lng})`).join(',\n') + `
ON DUPLICATE KEY UPDATE name=VALUES(name);

-- 4. DATA RANCANGAN UNDANG-UNDANG DPR RI (KOSONG - MURNI DIAJUKAN OLEH PEMAIN DI PARLEMEN)
` + (INITIAL_BILLS.length > 0 ? `INSERT INTO bills (id, title, description, category, author_id, author_name, party_id, yes_votes, no_votes, status, impact_summary) VALUES
` + INITIAL_BILLS.map(b => `(${esc(b.id)}, ${esc(b.title)}, ${esc(b.description || '')}, ${esc(b.category)}, 'usr-satria', ${esc(b.author || 'Komisi DPR RI')}, 'pdin', ${b.yesVotes || 0}, ${b.noVotes || 0}, ${esc(b.status || 'voting')}, ${esc(b.impactText || '')})`).join(',\n') + `
ON DUPLICATE KEY UPDATE title=VALUES(title);` : `-- Belum ada RUU diajukan`) + `


-- 5. DATA UNDANG-UNDANG NASIONAL YANG TELAH DISAHKAN
INSERT INTO passed_laws (id, title, category, description, national_effects) VALUES
` + INITIAL_PASSED_LAWS.map(l => `(${esc(l.id)}, ${esc(l.title)}, ${esc(l.category)}, ${esc(l.description || l.summary || l.title || '')}, ${esc(JSON.stringify(l.effects || {}))})`).join(',\n') + `
ON DUPLICATE KEY UPDATE title=VALUES(title);

-- 6. DATA PEMILU & KANDIDAT PRESIDEN
INSERT INTO elections (id, title, type, term, status, end_time) VALUES
('pemilu-2026', 'Pemilihan Presiden & Wakil Presiden Republik Nusantara', 'presidential', '2026-2031', 'active', DATE_ADD(NOW(), INTERVAL 3 DAY))
ON DUPLICATE KEY UPDATE title=VALUES(title);

INSERT INTO candidates (id, election_id, name, running_mate, party_id, votes, vision, promises, color) VALUES
` + INITIAL_PRESIDENTIAL_CANDIDATES.map(c => `(${esc(c.id)}, 'pemilu-2026', ${esc(c.name)}, ${esc(c.runningMate || '')}, ${esc(c.partyId || 'pdin')}, ${c.votes || 0}, ${esc(c.vision || '')}, ${esc(JSON.stringify(c.promises || []))}, ${esc(c.color || '#fbbf24')})`).join(',\n') + `
ON DUPLICATE KEY UPDATE name=VALUES(name);

-- 7. DATA KORAN PERS NASIONAL
INSERT INTO articles (id, title, content, category, author_id, author_name, author_title, newspaper_name, views, upvotes) VALUES
` + INITIAL_ARTICLES.map(a => `(${esc(a.id)}, ${esc(a.title || 'Warta Parlemen')}, ${esc(a.content || '')}, ${esc(a.category)}, 'usr-satria', ${esc(a.author || 'Redaksi Garuda')}, '', 'Harian Nusantara', 100, 840)`).join(',\n') + `
ON DUPLICATE KEY UPDATE content=VALUES(content);

-- 8. DATA KAWASAN GEOPOLITIK DUNIA
INSERT INTO world_regions (id, iso2, iso3, name, capital, flag, sector, population, bloc, diplomatic_status, dominant_resource, military_power, government_type, relations_with_ri, description) VALUES
` + WORLD_REGIONS.map(w => `(${esc(w.id)}, ${esc(w.iso2 || '')}, ${esc(w.iso3 || '')}, ${esc(w.name)}, ${esc(w.capital || '')}, ${esc(w.flag || '🌐')}, ${esc(w.sector || 'asean')}, ${w.population || 0}, ${esc(w.bloc || 'Non-Blok')}, ${esc(w.diplomaticStatus || 'Bilateral')}, ${esc(w.dominantResource || 'Mineral')}, ${w.militaryPower || 50}, ${esc(w.governmentType || 'Republik')}, ${esc(w.relationsWithIndonesia || '+80% (Harmonis)')}, ${esc(w.description || '')})`).join(',\n') + `
ON DUPLICATE KEY UPDATE name=VALUES(name);

-- 9. DATA TRAKTAT & PERJANJIAN INTERNASIONAL
INSERT INTO diplomatic_treaties (id, world_region_id, treaty_type, title, description, status) VALUES
('trt-mys-1', 'malaysia', 'defense', 'Pakta Kerjasama Patroli Perbatasan Selat Malaka & Selat Karimata', 'Perjanjian patroli angkatan laut bersama untuk menjaga stabilitas jalur pelayaran tersibuk di dunia.', 'active'),
('trt-sgp-1', 'singapore', 'trade', 'Pusat Kliring Finansial & Logistik Pelabuhan Maritim Nusantara', 'Kemudahan bebas bea transit komoditas nikel dan bauksit olahan ke hub logistik Singapura.', 'active'),
('trt-sau-1', 'saudi_arabia', 'cultural', 'Perjanjian Kuota Ziarah Haji & Pasokan Minyak Mentah Strategis', 'Pengamanan pasokan energi minyak fosil cadangan nasional dan fasilitas khusus jamaah RI.', 'active')
ON DUPLICATE KEY UPDATE title=VALUES(title);
`;

fs.writeFileSync('database/mysql_setup.sql', out, 'utf8');
console.log('database/mysql_setup.sql successfully created! Length:', Buffer.byteLength(out), 'bytes');
