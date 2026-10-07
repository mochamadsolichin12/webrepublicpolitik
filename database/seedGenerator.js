import fs from 'fs';
import { INITIAL_REGIONS } from '../src/data/regionsData.js';
import { INITIAL_PARTIES } from '../src/data/partiesData.js';
import { INITIAL_BILLS, INITIAL_PASSED_LAWS } from '../src/data/lawsData.js';
import { INITIAL_ARTICLES, INITIAL_PRESIDENTIAL_CANDIDATES } from '../src/data/mediaAndElections.js';
import { WORLD_REGIONS } from '../src/data/worldRegionsData.js';

function escapeSql(str) {
  if (typeof str !== 'string') return '';
  return str.replace(/'/g, "''");
}

let sql = `-- ==============================================================================
-- SEED DATA: WEB REPUBLIC POLITIK (REPUBLIK NUSANTARA)
-- Generated automatically from initial game data
-- ==============================================================================

-- 1. DATA PENGGUNA DEMO
INSERT OR REPLACE INTO users (
  id, username, email, password_hash, full_name, title, position, 
  level, exp, max_exp, energy, max_energy, money, gold, party_id, 
  residence_region_id, perk_charisma, perk_intellect, perk_endurance, perk_connections
) VALUES (
  'usr-satria', 'satria', 'satria@nusantara.id', 'demo_hash_123', 
  'Raden Satria Nusantara', 'Kader Muda Pergerakan', 'Anggota Fraksi DPR RI', 
  4, 340, 1000, 85, 100, 75000000.0, 45, 'pdin', 
  'dki', 18, 22, 15, 16
);

-- 2. DATA PARTAI POLITIK
`;

INITIAL_PARTIES.forEach((p) => {
  sql += `INSERT OR REPLACE INTO parties (id, name, short_name, leader, ideology, color, seats, funds, members_count, description) VALUES ('${p.id}', '${escapeSql(p.name)}', '${escapeSql(p.shortName)}', '${escapeSql(p.leader)}', '${escapeSql(p.ideology)}', '${p.color}', ${p.seats}, ${p.treasury}, ${p.membersCount}, '${escapeSql(p.slogan)}');\n`;
});

sql += `\n-- 3. DATA 38 PROVINSI REPUBLIK INDONESIA\n`;
INITIAL_REGIONS.forEach((r) => {
  sql += `INSERT OR REPLACE INTO regions (id, name, capital, island, population, budget, dominant_party_id, support_rate, resource, tax_rate, infrastructure_level, defense_power, lat, lng) VALUES ('${r.id}', '${escapeSql(r.name)}', '${escapeSql(r.capital)}', '${r.island}', ${r.population}, ${r.budget}, '${r.dominantPartyId}', ${r.supportRate}, '${escapeSql(r.resource)}', 10.0, 1, 60, ${r.lat}, ${r.lng});\n`;
});

sql += `\n-- 4. DATA RANCANGAN UNDANG-UNDANG DPR RI\n`;
INITIAL_BILLS.forEach((b) => {
  sql += `INSERT OR REPLACE INTO bills (id, title, description, category, author_id, author_name, party_id, yes_votes, no_votes, status, impact_summary) VALUES ('${b.id}', '${escapeSql(b.title)}', '${escapeSql(b.description)}', '${b.category}', 'usr-satria', '${escapeSql(b.author)}', 'pdin', ${b.yesVotes || 0}, ${b.noVotes || 0}, '${b.status}', '${escapeSql(b.impactSummary || '')}');\n`;
});

sql += `\n-- 5. DATA UNDANG-UNDANG NASIONAL YANG TELAH DISAHKAN\n`;
INITIAL_PASSED_LAWS.forEach((l) => {
  sql += `INSERT OR REPLACE INTO passed_laws (id, title, category, description, national_effects) VALUES ('${l.id}', '${escapeSql(l.title)}', '${l.category}', '${escapeSql(l.description)}', '${escapeSql(JSON.stringify(l.effects || {}))}');\n`;
});

sql += `\n-- 6. DATA PEMILU & KANDIDAT PRESIDEN\n`;
sql += `INSERT OR REPLACE INTO elections (id, title, type, term, status, end_time) VALUES ('pemilu-2026', 'Pemilihan Presiden & Wakil Presiden Republik Nusantara', 'presidential', '2026-2031', 'active', datetime('now', '+3 days'));\n`;

INITIAL_PRESIDENTIAL_CANDIDATES.forEach((c) => {
  sql += `INSERT OR REPLACE INTO candidates (id, election_id, name, running_mate, party_id, votes, vision, promises, color) VALUES ('${c.id}', 'pemilu-2026', '${escapeSql(c.name)}', '${escapeSql(c.runningMate || '')}', '${c.partyId || 'pdin'}', ${c.votes || 0}, '${escapeSql(c.vision || '')}', '${escapeSql(JSON.stringify(c.promises || []))}', '${c.color || '#fbbf24'}');\n`;
});

sql += `\n-- 7. DATA KORAN PERS NASIONAL\n`;
INITIAL_ARTICLES.forEach((a) => {
  sql += `INSERT OR REPLACE INTO articles (id, title, content, category, author_id, author_name, author_title, newspaper_name, views, upvotes) VALUES ('${a.id}', '${escapeSql(a.title)}', '${escapeSql(a.content)}', '${a.category}', 'usr-satria', '${escapeSql(a.author)}', '${escapeSql(a.authorTitle || '')}', '${escapeSql(a.newspaperName || 'Harian Nusantara')}', ${a.views || 100}, ${a.upvotes || 20});\n`;
});

sql += `\n-- 8. DATA KAWASAN GEOPOLITIK DUNIA\n`;
WORLD_REGIONS.forEach((w) => {
  sql += `INSERT OR REPLACE INTO world_regions (id, iso2, iso3, name, capital, flag, sector, population, bloc, diplomatic_status, dominant_resource, military_power, government_type, relations_with_ri, description) VALUES ('${w.id}', '${w.iso2 || ''}', '${w.iso3 || ''}', '${escapeSql(w.name)}', '${escapeSql(w.capital)}', '${w.flag}', '${w.sector}', ${w.population}, '${escapeSql(w.bloc)}', '${escapeSql(w.diplomaticStatus)}', '${escapeSql(w.dominantResource)}', ${w.militaryPower}, '${escapeSql(w.governmentType)}', '${escapeSql(w.relationsWithIndonesia)}', '${escapeSql(w.description || '')}');\n`;
});

sql += `\n-- 9. DATA TRAKTAT & PERJANJIAN INTERNASIONAL AWAL\n`;
sql += `INSERT OR REPLACE INTO diplomatic_treaties (id, world_region_id, treaty_type, title, description, status) VALUES ('trt-mys-1', 'malaysia', 'defense', 'Pakta Kerjasama Patroli Perbatasan Selat Malaka & Selat Karimata', 'Perjanjian patroli angkatan laut bersama untuk menjaga stabilitas jalur pelayaran tersibuk di dunia.', 'active');\n`;
sql += `INSERT OR REPLACE INTO diplomatic_treaties (id, world_region_id, treaty_type, title, description, status) VALUES ('trt-sgp-1', 'singapore', 'trade', 'Pusat Kliring Finansial & Logistik Pelabuhan Maritim Nusantara', 'Kemudahan bebas bea transit komoditas nikel dan bauksit olahan ke hub logistik Singapura.', 'active');\n`;
sql += `INSERT OR REPLACE INTO diplomatic_treaties (id, world_region_id, treaty_type, title, description, status) VALUES ('trt-sau-1', 'saudi_arabia', 'cultural', 'Perjanjian Kuota Ziarah Haji & Pasokan Minyak Mentah Strategis', 'Pengamanan pasokan energi minyak fosil cadangan nasional dan fasilitas khusus jamaah RI.', 'active');\n`;

fs.writeFileSync('database/seed.sql', sql, 'utf8');
console.log('database/seed.sql successfully created! Length:', sql.length, 'bytes');

const fullJson = {
  generatedAt: new Date().toISOString(),
  users: [{ id: 'usr-satria', username: 'satria', fullName: 'Raden Satria Nusantara', level: 4, money: 75000000, partyId: 'pdin', residenceRegionId: 'dki' }],
  partiesCount: INITIAL_PARTIES.length,
  parties: INITIAL_PARTIES,
  regionsCount: INITIAL_REGIONS.length,
  regions: INITIAL_REGIONS,
  billsCount: INITIAL_BILLS.length,
  bills: INITIAL_BILLS,
  passedLawsCount: INITIAL_PASSED_LAWS.length,
  passedLaws: INITIAL_PASSED_LAWS,
  electionsCount: 1,
  candidates: INITIAL_PRESIDENTIAL_CANDIDATES,
  articlesCount: INITIAL_ARTICLES.length,
  articles: INITIAL_ARTICLES,
  worldRegionsCount: WORLD_REGIONS.length,
  worldRegions: WORLD_REGIONS
};
fs.writeFileSync('database/seedData.json', JSON.stringify(fullJson, null, 2), 'utf8');
console.log('database/seedData.json successfully created!');
