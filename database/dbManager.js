import mysql from 'mysql2/promise';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

// Initial game seed data
import { INITIAL_REGIONS } from '../src/data/regionsData.js';
import { INITIAL_PARTIES } from '../src/data/partiesData.js';
import { INITIAL_BILLS, INITIAL_PASSED_LAWS } from '../src/data/lawsData.js';
import { INITIAL_ARTICLES, INITIAL_PRESIDENTIAL_CANDIDATES } from '../src/data/mediaAndElections.js';
import { WORLD_REGIONS } from '../src/data/worldRegionsData.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const MYSQL_CONFIG = {
  host: process.env.DB_HOST || '127.0.0.1',
  port: parseInt(process.env.DB_PORT || '3306', 10),
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || '',
  database: process.env.DB_NAME || 'republic_politik',
  waitForConnections: true,
  connectionLimit: 15,
  queueLimit: 0,
  enableKeepAlive: true,
  keepAliveInitialDelay: 0,
  multipleStatements: true,
};

let pool = null;
let isInitialized = false;

// 1. Initialize MySQL Database & Tables
export async function initDatabase() {
  if (isInitialized && pool) return pool;

  try {
    // A. Connect to MySQL server without DB first to ensure republic_politik database exists
    const adminConn = await mysql.createConnection({
      host: MYSQL_CONFIG.host,
      port: MYSQL_CONFIG.port,
      user: MYSQL_CONFIG.user,
      password: MYSQL_CONFIG.password,
    });

    await adminConn.query(
      `CREATE DATABASE IF NOT EXISTS \`${MYSQL_CONFIG.database}\` CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;`
    );
    await adminConn.end();

    // B. Create connection pool to the republic_politik database
    pool = mysql.createPool(MYSQL_CONFIG);

    // C. Execute MySQL Schema with multipleStatements
    const schemaPath = path.join(__dirname, 'mysql_schema.sql');
    if (fs.existsSync(schemaPath)) {
      const schemaSql = fs.readFileSync(schemaPath, 'utf8');
      try {
        await pool.query(schemaSql);
      } catch (err) {
        console.warn('MySQL schema setup notice:', err.message);
      }
    }

    // D. Seed Core Users if empty
    await seedDefaultUsers();

    // E. Seed Core Entities
    const [regRows] = await pool.query('SELECT COUNT(*) AS count FROM world_regions');
    if (regRows[0].count === 0) {
      console.log('Seeding initial game entities into MySQL...');
      await seedGameEntities();
      console.log('MySQL game entities seeded successfully!');
    }

    isInitialized = true;
    console.log(`MySQL Database initialized successfully: [${MYSQL_CONFIG.database}] on ${MYSQL_CONFIG.host}:${MYSQL_CONFIG.port}`);
    return pool;
  } catch (err) {
    console.error('MySQL connection error:', err.message);
    throw err;
  }
}

// Ensure Core Accounts exist with their specific roles in MySQL
async function seedDefaultUsers() {
  const defaultAccounts = [
    {
      id: 'usr-superadmin',
      username: 'superadmin',
      email: 'admin@nusantara.gov.id',
      password_hash: 'adminpassword',
      full_name: 'Sultan Agung Hanyokrokusumo',
      title: 'Super Administrator Negara',
      position: 'Dewan Pengawas Tertinggi RI',
      level: 1,
      exp: 0,
      max_exp: 1000,
      energy: 100,
      max_energy: 100,
      money: 0.0,
      gold: 0,
      party_id: 'pdin',
      residence_region_id: 'dki',
      perk_charisma: 10,
      perk_intellect: 10,
      perk_endurance: 10,
      perk_connections: 10,
      role: 'superadmin',
      status: 'active',
    },
    {
      id: 'usr-mochamad',
      username: 'mochamad',
      email: 'mochamad.solichin@gmail.com',
      password_hash: 'password123',
      full_name: 'Mochamad Solichin',
      title: 'Dewan Pembina Arsitektur Sistem',
      position: 'Super Administrator Utama',
      level: 1,
      exp: 0,
      max_exp: 1000,
      energy: 100,
      max_energy: 100,
      money: 0.0,
      gold: 0,
      party_id: 'ptp',
      residence_region_id: 'dki',
      perk_charisma: 10,
      perk_intellect: 10,
      perk_endurance: 10,
      perk_connections: 10,
      role: 'superadmin',
      status: 'active',
    }
  ];

  for (const acc of defaultAccounts) {
    await pool.query(
      `INSERT INTO users (
        id, username, email, password_hash, full_name, title, position, 
        level, exp, max_exp, energy, max_energy, money, gold, party_id, 
        residence_region_id, perk_charisma, perk_intellect, perk_endurance, perk_connections,
        role, status
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
      ON DUPLICATE KEY UPDATE 
        role = VALUES(role),
        full_name = VALUES(full_name),
        title = VALUES(title),
        position = VALUES(position),
        money = VALUES(money),
        gold = VALUES(gold),
        level = VALUES(level),
        exp = VALUES(exp);`,
      [
        acc.id, acc.username, acc.email, acc.password_hash, acc.full_name, acc.title, acc.position,
        acc.level, acc.exp, acc.max_exp, acc.energy, acc.max_energy, acc.money, acc.gold, acc.party_id,
        acc.residence_region_id, acc.perk_charisma, acc.perk_intellect, acc.perk_endurance, acc.perk_connections,
        acc.role, acc.status,
      ]
    );
  }
}

// Seed initial game data into MySQL
async function seedGameEntities() {
  // 1. Parties
  for (const p of INITIAL_PARTIES) {
    await pool.query(
      `INSERT INTO parties (id, name, short_name, leader, ideology, color, seats, funds, members_count, description) 
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
       ON DUPLICATE KEY UPDATE 
         name=VALUES(name),
         seats=VALUES(seats),
         funds=VALUES(funds),
         members_count=VALUES(members_count);`,
      [p.id, p.name, p.shortName, p.leader, p.ideology, p.color, p.seats, p.treasury, p.membersCount, p.slogan]
    );
  }

  // 2. Regions (38 Provinsi)
  for (const r of INITIAL_REGIONS) {
    await pool.query(
      `INSERT INTO regions (id, name, capital, island, population, budget, dominant_party_id, support_rate, resource, tax_rate, infrastructure_level, defense_power, lat, lng)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, 10.0, 0, 0, ?, ?)
       ON DUPLICATE KEY UPDATE 
         name=VALUES(name),
         population=VALUES(population),
         budget=VALUES(budget),
         dominant_party_id=VALUES(dominant_party_id),
         support_rate=VALUES(support_rate),
         infrastructure_level=VALUES(infrastructure_level),
         defense_power=VALUES(defense_power);`,
      [r.id, r.name, r.capital, r.island, r.population, r.budget, r.dominantPartyId, r.supportRate, r.resource, r.lat, r.lng]
    );
  }

  // 3. Bills
  for (const b of INITIAL_BILLS) {
    await pool.query(
      `INSERT INTO bills (id, title, description, category, author_id, author_name, party_id, yes_votes, no_votes, status, impact_summary)
       VALUES (?, ?, ?, ?, 'usr-satria', ?, ?, ?, ?, ?, ?)
       ON DUPLICATE KEY UPDATE title=VALUES(title);`,
      [b.id, b.title, b.description || '', b.category, b.proposedBy || b.authorName || 'Komisi DPR RI', b.sponsorPartyId || 'pdin', b.votes?.agree || 0, b.votes?.reject || 0, b.status || 'voting', b.impactText || '']
    );
  }

  // 4. Passed Laws
  for (const l of INITIAL_PASSED_LAWS) {
    await pool.query(
      `INSERT INTO passed_laws (id, title, category, description, national_effects)
       VALUES (?, ?, ?, ?, ?)
       ON DUPLICATE KEY UPDATE title=VALUES(title);`,
      [l.id, l.title, l.category, l.description || l.summary || l.title || '', JSON.stringify(l.effects || {})]
    );
  }

  // 5. Elections & Candidates
  await pool.query(
    `INSERT INTO elections (id, title, type, term, status, end_time) 
     VALUES ('pemilu-2026', 'Pemilihan Presiden & Wakil Presiden Republik Nusantara', 'presidential', '2026-2031', 'active', DATE_ADD(NOW(), INTERVAL 3 DAY))
     ON DUPLICATE KEY UPDATE title=VALUES(title);`
  );

  for (const c of INITIAL_PRESIDENTIAL_CANDIDATES) {
    await pool.query(
      `INSERT INTO candidates (id, election_id, name, running_mate, party_id, votes, vision, promises, color)
       VALUES (?, 'pemilu-2026', ?, ?, ?, ?, ?, ?, ?)
       ON DUPLICATE KEY UPDATE name=VALUES(name);`,
      [c.id, c.name, c.runningMate || '', c.partyId || 'pdin', c.votes || 0, c.vision || '', JSON.stringify(c.promises || []), c.color || '#fbbf24']
    );
  }

  // 6. Articles
  for (const a of INITIAL_ARTICLES) {
    await pool.query(
      `INSERT INTO articles (id, title, content, category, author_id, author_name, author_title, newspaper_name, views, upvotes)
       VALUES (?, ?, ?, ?, 'usr-satria', ?, '', 'Harian Nusantara', 100, 840)
       ON DUPLICATE KEY UPDATE content=VALUES(content);`,
      [a.id, a.title || 'Kabar Parlemen', a.content || '', a.category, a.authorName || a.author || 'Redaksi Harian Garuda']
    );
  }

  // 7. World Regions
  for (const w of WORLD_REGIONS) {
    await pool.query(
      `INSERT INTO world_regions (id, iso2, iso3, name, capital, flag, sector, population, bloc, diplomatic_status, dominant_resource, military_power, government_type, relations_with_ri, description)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
       ON DUPLICATE KEY UPDATE 
         name=VALUES(name),
         population=VALUES(population);`,
      [
        w.id, 
        w.iso2 || '', 
        w.iso3 || '', 
        w.name, 
        w.capital || '', 
        w.flag || '🌐', 
        w.sector || 'asean', 
        w.population || 0, 
        w.bloc || 'Non-Blok', 
        w.diplomaticStatus || 'Bilateral', 
        w.dominantResource || 'Mineral', 
        w.militaryPower || 50, 
        w.governmentType || 'Republik', 
        w.relationsWithIndonesia || w.relations_with_ri || '+80% (Harmonis)', 
        w.description || ''
      ]
    );
  }
}

// 2. Query returning array of rows
export async function query(sql, params = []) {
  if (!pool) await initDatabase();
  const [rows] = await pool.query(sql, params);
  return rows;
}

// 3. Query returning single row or null
export async function queryOne(sql, params = []) {
  if (!pool) await initDatabase();
  const [rows] = await pool.query(sql, params);
  return rows.length > 0 ? rows[0] : null;
}

// 4. Execute INSERT/UPDATE/DELETE query
export async function execute(sql, params = []) {
  if (!pool) await initDatabase();
  const [result] = await pool.query(sql, params);
  return result;
}

// 5. Get overview of all tables and record counts in MySQL
export async function getTableStats() {
  if (!pool) await initDatabase();
  const [tables] = await pool.query(
    "SELECT table_name AS name FROM information_schema.tables WHERE table_schema = ? ORDER BY table_name;",
    [MYSQL_CONFIG.database]
  );

  const stats = [];
  for (const t of tables) {
    const [countRows] = await pool.query(`SELECT COUNT(*) AS count FROM \`${t.name}\`;`);
    stats.push({
      table: t.name,
      rowCount: countRows[0].count,
    });
  }
  return stats;
}

// 6. Get table schema definition
export async function getTableSchema(tableName) {
  if (!pool) await initDatabase();
  const [columns] = await pool.query(
    `SELECT column_name, data_type, is_nullable, column_default, column_key, extra 
     FROM information_schema.columns 
     WHERE table_schema = ? AND table_name = ? 
     ORDER BY ordinal_position;`,
    [MYSQL_CONFIG.database, tableName]
  );
  return {
    table: tableName,
    columns,
  };
}

// 7. Get Database Info
export function getDatabaseInfo() {
  return {
    engine: 'MySQL 8.x / MariaDB (XAMPP)',
    database: MYSQL_CONFIG.database,
    host: MYSQL_CONFIG.host,
    port: MYSQL_CONFIG.port,
    status: isInitialized ? 'connected' : 'connecting',
  };
}
