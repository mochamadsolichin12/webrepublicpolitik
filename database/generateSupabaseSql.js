import fs from 'fs';

// 1. Skema Tabel PostgreSQL Supabase
const schemaDdl = `-- ==============================================================================
-- 🏛️ DATABASE SCHEMA: REPUBLIC POLITIC (SUPABASE / POSTGRESQL)
-- Engine: PostgreSQL 15+ (Supabase Native)
-- Description: Skema Lengkap Geopolitik, Tata Negara, Parlemen, Pemilu & Hubungan Internasional
-- ==============================================================================

-- Enable UUID extension jika dibutuhkan
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ==================== 1. TABEL PENGGUNA (USERS) ====================
CREATE TABLE IF NOT EXISTS users (
    id TEXT PRIMARY KEY,
    username TEXT UNIQUE NOT NULL,
    email TEXT UNIQUE NOT NULL,
    password_hash TEXT NOT NULL,
    full_name TEXT NOT NULL,
    title TEXT DEFAULT 'Kader Muda Pergerakan',
    position TEXT DEFAULT 'Warga Negara Berdaulat',
    level INTEGER DEFAULT 1,
    exp INTEGER DEFAULT 0,
    max_exp INTEGER DEFAULT 1000,
    energy INTEGER DEFAULT 100,
    max_energy INTEGER DEFAULT 100,
    money NUMERIC(18, 2) DEFAULT 0.00,       -- Saldo Rupiah Kas Pribadi
    gold INTEGER DEFAULT 0,                  -- Cadangan Emas Batangan
    party_id TEXT,
    residence_region_id TEXT DEFAULT 'dki',  -- Wilayah Domisili (38 Provinsi)
    perk_charisma INTEGER DEFAULT 10,
    perk_intellect INTEGER DEFAULT 10,
    perk_endurance INTEGER DEFAULT 10,
    perk_connections INTEGER DEFAULT 10,
    voted_president_id TEXT,
    role TEXT DEFAULT 'player',              -- 'superadmin', 'moderator', 'player'
    status TEXT DEFAULT 'active',            -- 'active', 'warned', 'banned'
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ==================== 2. TABEL PARTAI POLITIK (PARTIES) ====================
CREATE TABLE IF NOT EXISTS parties (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    short_name TEXT NOT NULL,
    leader TEXT NOT NULL,
    ideology TEXT NOT NULL,
    color TEXT NOT NULL,
    seats INTEGER DEFAULT 0,                 -- Kursi di DPR RI
    funds NUMERIC(18, 2) DEFAULT 500000000.00,
    members_count INTEGER DEFAULT 1,
    description TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ==================== 3. TABEL 38 PROVINSI REPUBLIK INDONESIA (REGIONS) ====================
CREATE TABLE IF NOT EXISTS regions (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    capital TEXT NOT NULL,
    island TEXT NOT NULL,                    -- 'sumatera', 'jawa', 'kalimantan', 'sulawesi', 'bali_nusa', 'maluku', 'papua'
    population BIGINT NOT NULL,              -- Jiwa
    budget NUMERIC(18, 2) NOT NULL,          -- APBD Provinsi
    dominant_party_id TEXT,
    support_rate INTEGER DEFAULT 75,
    resource TEXT NOT NULL,                  -- Komoditas Utama
    tax_rate NUMERIC(5, 2) DEFAULT 10.00,
    infrastructure_level INTEGER DEFAULT 1,
    defense_power INTEGER DEFAULT 60,
    lat NUMERIC(9, 6) NOT NULL,
    lng NUMERIC(9, 6) NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ==================== 4. TABEL RANCANGAN UNDANG-UNDANG (BILLS) ====================
CREATE TABLE IF NOT EXISTS bills (
    id TEXT PRIMARY KEY,
    title TEXT NOT NULL,
    description TEXT NOT NULL,
    category TEXT NOT NULL,                  -- 'ekonomi', 'pertahanan', 'sosial', 'otonomi'
    author_id TEXT NOT NULL,
    author_name TEXT NOT NULL,
    party_id TEXT,
    yes_votes INTEGER DEFAULT 0,
    no_votes INTEGER DEFAULT 0,
    status TEXT DEFAULT 'voting',            -- 'voting', 'passed', 'rejected'
    impact_summary TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ==================== 5. TABEL PENGAMBILAN SUARA RUU (BILL_VOTES) ====================
CREATE TABLE IF NOT EXISTS bill_votes (
    id BIGSERIAL PRIMARY KEY,
    bill_id TEXT NOT NULL REFERENCES bills(id) ON DELETE CASCADE,
    user_id TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    vote TEXT NOT NULL CHECK(vote IN ('yes', 'no')),
    voted_at TIMESTAMPTZ DEFAULT NOW(),
    CONSTRAINT uq_bill_user UNIQUE (bill_id, user_id)
);

-- ==================== 6. TABEL UNDANG-UNDANG DISAHKAN (PASSED_LAWS) ====================
CREATE TABLE IF NOT EXISTS passed_laws (
    id TEXT PRIMARY KEY,
    bill_id TEXT REFERENCES bills(id) ON DELETE SET NULL,
    title TEXT NOT NULL,
    category TEXT NOT NULL,
    description TEXT NOT NULL,
    national_effects JSONB DEFAULT '{}'::jsonb,
    passed_at TIMESTAMPTZ DEFAULT NOW()
);

-- ==================== 7. TABEL PEMILU RAYA NASIONAL (ELECTIONS) ====================
CREATE TABLE IF NOT EXISTS elections (
    id TEXT PRIMARY KEY,
    title TEXT NOT NULL,
    type TEXT NOT NULL,                      -- 'presidential', 'parliamentary', 'regional'
    term TEXT NOT NULL,
    status TEXT DEFAULT 'active',            -- 'active', 'finished'
    start_time TIMESTAMPTZ DEFAULT NOW(),
    end_time TIMESTAMPTZ NOT NULL
);

-- ==================== 8. TABEL KANDIDAT CAPRES & CAWAPRES (CANDIDATES) ====================
CREATE TABLE IF NOT EXISTS candidates (
    id TEXT PRIMARY KEY,
    election_id TEXT NOT NULL REFERENCES elections(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    running_mate TEXT,
    party_id TEXT REFERENCES parties(id) ON DELETE SET NULL,
    votes INTEGER DEFAULT 0,
    vision TEXT,
    promises JSONB DEFAULT '[]'::jsonb,
    color TEXT DEFAULT '#fbbf24'
);

-- ==================== 9. TABEL SURAT SUARA PEMILU (ELECTION_VOTES) ====================
CREATE TABLE IF NOT EXISTS election_votes (
    id BIGSERIAL PRIMARY KEY,
    election_id TEXT NOT NULL REFERENCES elections(id) ON DELETE CASCADE,
    candidate_id TEXT NOT NULL REFERENCES candidates(id) ON DELETE CASCADE,
    user_id TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    voted_at TIMESTAMPTZ DEFAULT NOW(),
    CONSTRAINT uq_election_user UNIQUE (election_id, user_id)
);

-- ==================== 10. TABEL KORAN & ARTIKEL PERS (ARTICLES) ====================
CREATE TABLE IF NOT EXISTS articles (
    id TEXT PRIMARY KEY,
    title TEXT NOT NULL,
    content TEXT NOT NULL,
    category TEXT NOT NULL,
    author_id TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    author_name TEXT NOT NULL,
    author_title TEXT,
    newspaper_name TEXT DEFAULT 'Harian Nusantara',
    views INTEGER DEFAULT 0,
    upvotes INTEGER DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ==================== 11. TABEL APRESIASI ARTIKEL (ARTICLE_UPVOTES) ====================
CREATE TABLE IF NOT EXISTS article_upvotes (
    id BIGSERIAL PRIMARY KEY,
    article_id TEXT NOT NULL REFERENCES articles(id) ON DELETE CASCADE,
    user_id TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    CONSTRAINT uq_article_user UNIQUE (article_id, user_id)
);

-- ==================== 12. TABEL WILAYAH GEOPOLITIK DUNIA (WORLD_REGIONS) ====================
CREATE TABLE IF NOT EXISTS world_regions (
    id TEXT PRIMARY KEY,
    iso2 TEXT,
    iso3 TEXT,
    name TEXT NOT NULL,
    capital TEXT NOT NULL,
    flag TEXT NOT NULL,
    sector TEXT NOT NULL,
    population NUMERIC(10, 2) NOT NULL,
    bloc TEXT NOT NULL,
    diplomatic_status TEXT NOT NULL,
    dominant_resource TEXT NOT NULL,
    military_power INTEGER NOT NULL,
    government_type TEXT NOT NULL,
    relations_with_ri TEXT NOT NULL,
    description TEXT
);

-- ==================== 13. TABEL PERJANJIAN INTERNASIONAL (DIPLOMATIC_TREATIES) ====================
CREATE TABLE IF NOT EXISTS diplomatic_treaties (
    id TEXT PRIMARY KEY,
    world_region_id TEXT NOT NULL REFERENCES world_regions(id) ON DELETE CASCADE,
    treaty_type TEXT NOT NULL,
    title TEXT NOT NULL,
    description TEXT,
    status TEXT DEFAULT 'active',
    signed_by_user_id TEXT REFERENCES users(id) ON DELETE SET NULL,
    signed_at TIMESTAMPTZ DEFAULT NOW()
);

-- ==================== 14. TABEL AUDIT & LOG AKTIVITAS (GAME_LOGS) ====================
CREATE TABLE IF NOT EXISTS game_logs (
    id BIGSERIAL PRIMARY KEY,
    user_id TEXT REFERENCES users(id) ON DELETE SET NULL,
    action_type TEXT NOT NULL,
    details TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ==================== 15. TABEL INVENTARIS SUMBER DAYA PEMAIN (USER_INVENTORY) ====================
CREATE TABLE IF NOT EXISTS user_inventory (
    id BIGSERIAL PRIMARY KEY,
    user_id TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    item_id TEXT NOT NULL,                -- 'oil', 'nickel', 'cpo', 'coal', 'gold_bullion', 'rice'
    quantity BIGINT DEFAULT 0 CHECK (quantity >= 0),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    CONSTRAINT uq_user_item UNIQUE (user_id, item_id)
);

-- ==================== 16. TABEL PASAR BURSA P2P ANTAR-PEMAIN (MARKET_LISTINGS) ====================
CREATE TABLE IF NOT EXISTS market_listings (
    id TEXT PRIMARY KEY,
    seller_id TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    seller_name TEXT NOT NULL,
    item_id TEXT NOT NULL,                -- 'oil', 'nickel', 'cpo', 'coal', 'gold_bullion', 'rice'
    item_name TEXT NOT NULL,
    unit TEXT NOT NULL,
    quantity BIGINT NOT NULL CHECK (quantity > 0),
    price_per_unit NUMERIC(18, 2) NOT NULL CHECK (price_per_unit > 0),
    total_price NUMERIC(18, 2) NOT NULL,
    status TEXT DEFAULT 'active' CHECK (status IN ('active', 'sold', 'cancelled')),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ==================== INDEKS QUERY SUPABASE ====================
CREATE INDEX IF NOT EXISTS idx_users_username ON users(username);
CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);
CREATE INDEX IF NOT EXISTS idx_users_residence ON users(residence_region_id);
CREATE INDEX IF NOT EXISTS idx_regions_island ON regions(island);
CREATE INDEX IF NOT EXISTS idx_bills_status ON bills(status);
CREATE INDEX IF NOT EXISTS idx_articles_created ON articles(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_world_regions_sector ON world_regions(sector);
CREATE INDEX IF NOT EXISTS idx_user_inventory_user ON user_inventory(user_id);
CREATE INDEX IF NOT EXISTS idx_market_listings_status ON market_listings(status, item_id);
CREATE INDEX IF NOT EXISTS idx_market_listings_seller ON market_listings(seller_id);

-- ==================== ROW LEVEL SECURITY (RLS) ====================
-- Aktifkan RLS untuk standar keamanan cloud Supabase
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE parties ENABLE ROW LEVEL SECURITY;
ALTER TABLE regions ENABLE ROW LEVEL SECURITY;
ALTER TABLE bills ENABLE ROW LEVEL SECURITY;
ALTER TABLE bill_votes ENABLE ROW LEVEL SECURITY;
ALTER TABLE passed_laws ENABLE ROW LEVEL SECURITY;
ALTER TABLE elections ENABLE ROW LEVEL SECURITY;
ALTER TABLE candidates ENABLE ROW LEVEL SECURITY;
ALTER TABLE election_votes ENABLE ROW LEVEL SECURITY;
ALTER TABLE articles ENABLE ROW LEVEL SECURITY;
ALTER TABLE article_upvotes ENABLE ROW LEVEL SECURITY;
ALTER TABLE world_regions ENABLE ROW LEVEL SECURITY;
ALTER TABLE diplomatic_treaties ENABLE ROW LEVEL SECURITY;
ALTER TABLE game_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_inventory ENABLE ROW LEVEL SECURITY;
ALTER TABLE market_listings ENABLE ROW LEVEL SECURITY;

-- Policy Akses Baca Publik (Semua user dan guest dapat melihat data simulasi)
DO $$
BEGIN
    DROP POLICY IF EXISTS "Public Read Users" ON users;
    CREATE POLICY "Public Read Users" ON users FOR SELECT USING (true);

    DROP POLICY IF EXISTS "Public Read Parties" ON parties;
    CREATE POLICY "Public Read Parties" ON parties FOR SELECT USING (true);

    DROP POLICY IF EXISTS "Public Read Regions" ON regions;
    CREATE POLICY "Public Read Regions" ON regions FOR SELECT USING (true);

    DROP POLICY IF EXISTS "Public Read Bills" ON bills;
    CREATE POLICY "Public Read Bills" ON bills FOR SELECT USING (true);

    DROP POLICY IF EXISTS "Public Read Laws" ON passed_laws;
    CREATE POLICY "Public Read Laws" ON passed_laws FOR SELECT USING (true);

    DROP POLICY IF EXISTS "Public Read Elections" ON elections;
    CREATE POLICY "Public Read Elections" ON elections FOR SELECT USING (true);

    DROP POLICY IF EXISTS "Public Read Candidates" ON candidates;
    CREATE POLICY "Public Read Candidates" ON candidates FOR SELECT USING (true);

    DROP POLICY IF EXISTS "Public Read Articles" ON articles;
    CREATE POLICY "Public Read Articles" ON articles FOR SELECT USING (true);

    DROP POLICY IF EXISTS "Public Read World Regions" ON world_regions;
    CREATE POLICY "Public Read World Regions" ON world_regions FOR SELECT USING (true);

    DROP POLICY IF EXISTS "Public Read Treaties" ON diplomatic_treaties;
    CREATE POLICY "Public Read Treaties" ON diplomatic_treaties FOR SELECT USING (true);

    -- Policy Insert / Update / Delete Publik untuk semua tabel gameplay
    DROP POLICY IF EXISTS "Public Insert Users" ON users;
    CREATE POLICY "Public Insert Users" ON users FOR ALL USING (true) WITH CHECK (true);

    DROP POLICY IF EXISTS "Public Insert Parties" ON parties;
    CREATE POLICY "Public Insert Parties" ON parties FOR ALL USING (true) WITH CHECK (true);

    DROP POLICY IF EXISTS "Public Manage Regions" ON regions;
    CREATE POLICY "Public Manage Regions" ON regions FOR ALL USING (true) WITH CHECK (true);

    DROP POLICY IF EXISTS "Public Manage Bills" ON bills;
    CREATE POLICY "Public Manage Bills" ON bills FOR ALL USING (true) WITH CHECK (true);

    DROP POLICY IF EXISTS "Public Manage Laws" ON passed_laws;
    CREATE POLICY "Public Manage Laws" ON passed_laws FOR ALL USING (true) WITH CHECK (true);

    DROP POLICY IF EXISTS "Public Manage Elections" ON elections;
    CREATE POLICY "Public Manage Elections" ON elections FOR ALL USING (true) WITH CHECK (true);

    DROP POLICY IF EXISTS "Public Manage Candidates" ON candidates;
    CREATE POLICY "Public Manage Candidates" ON candidates FOR ALL USING (true) WITH CHECK (true);

    DROP POLICY IF EXISTS "Public Insert Articles" ON articles;
    CREATE POLICY "Public Insert Articles" ON articles FOR ALL USING (true) WITH CHECK (true);

    DROP POLICY IF EXISTS "Public Insert Article Upvotes" ON article_upvotes;
    CREATE POLICY "Public Insert Article Upvotes" ON article_upvotes FOR ALL USING (true) WITH CHECK (true);

    DROP POLICY IF EXISTS "Public Insert Bill Votes" ON bill_votes;
    CREATE POLICY "Public Insert Bill Votes" ON bill_votes FOR ALL USING (true) WITH CHECK (true);

    DROP POLICY IF EXISTS "Public Insert Election Votes" ON election_votes;
    CREATE POLICY "Public Insert Election Votes" ON election_votes FOR ALL USING (true) WITH CHECK (true);

    DROP POLICY IF EXISTS "Public Manage World Regions" ON world_regions;
    CREATE POLICY "Public Manage World Regions" ON world_regions FOR ALL USING (true) WITH CHECK (true);

    DROP POLICY IF EXISTS "Public Manage Treaties" ON diplomatic_treaties;
    CREATE POLICY "Public Manage Treaties" ON diplomatic_treaties FOR ALL USING (true) WITH CHECK (true);

    DROP POLICY IF EXISTS "Public Manage Game Logs" ON game_logs;
    CREATE POLICY "Public Manage Game Logs" ON game_logs FOR ALL USING (true) WITH CHECK (true);

    DROP POLICY IF EXISTS "Public Read Inventory" ON user_inventory;
    CREATE POLICY "Public Read Inventory" ON user_inventory FOR SELECT USING (true);

    DROP POLICY IF EXISTS "Public Manage Inventory" ON user_inventory;
    CREATE POLICY "Public Manage Inventory" ON user_inventory FOR ALL USING (true) WITH CHECK (true);

    DROP POLICY IF EXISTS "Public Read Market Listings" ON market_listings;
    CREATE POLICY "Public Read Market Listings" ON market_listings FOR SELECT USING (true);

    DROP POLICY IF EXISTS "Public Manage Market Listings" ON market_listings;
    CREATE POLICY "Public Manage Market Listings" ON market_listings FOR ALL USING (true) WITH CHECK (true);
END
$$;
`;

// 2. Baca file seed.sql dan konversikan
let seedSqlRaw = fs.readFileSync('database/seed.sql', 'utf8');

// Bersihkan SQLite datetime ke PostgreSQL INTERVAL
seedSqlRaw = seedSqlRaw.replace(/datetime\('now',\s*'\+3 days'\)/g, "(NOW() + INTERVAL '3 days')");

// Ganti semua "INSERT OR REPLACE INTO" menjadi PostgreSQL "INSERT INTO ... ON CONFLICT"
const statements = seedSqlRaw.split(';').map(s => s.trim()).filter(Boolean);
const convertedStatements = [];

for (let stmt of statements) {
  // Pisahkan leading comments dari query sebenarnya
  const lines = stmt.split('\n');
  const commentLines = [];
  const queryLines = [];

  for (let l of lines) {
    if (queryLines.length === 0 && l.trim().startsWith('--')) {
      commentLines.push(l);
    } else {
      queryLines.push(l);
    }
  }

  const commentBlock = commentLines.join('\n').trim();
  let queryBlock = queryLines.join('\n').trim();

  if (commentBlock) {
    convertedStatements.push(commentBlock);
  }

  if (!queryBlock) continue;

  if (queryBlock.toUpperCase().includes('INSERT OR REPLACE INTO') || queryBlock.toUpperCase().includes('INSERT INTO')) {
    // Normalisasi: buang OR REPLACE
    let normalized = queryBlock.replace(/INSERT\s+OR\s+REPLACE\s+INTO/gi, 'INSERT INTO');
    
    // Cek nama tabel
    const match = normalized.match(/INSERT\s+INTO\s+([a-zA-Z0-9_]+)/i);
    const tableName = match ? match[1].toLowerCase() : '';

    // Pastikan ada ON CONFLICT
    if (!normalized.toUpperCase().includes('ON CONFLICT')) {
      if (tableName === 'users') {
        normalized += ' ON CONFLICT (id) DO UPDATE SET updated_at = NOW()';
      } else {
        normalized += ' ON CONFLICT (id) DO NOTHING';
      }
    }
    convertedStatements.push(normalized + ';');
  } else {
    convertedStatements.push(queryBlock + ';');
  }
}



// Tambahkan default demo user (superadmin & moderator)
const additionalDemoUsers = `
-- USER DEMO TAMBAHAN (Super Admin & Moderator)
INSERT INTO users (id, username, email, password_hash, full_name, title, position, level, exp, max_exp, energy, max_energy, money, gold, role, status)
VALUES 
  ('usr-superadmin', 'superadmin', 'admin@nusantara.gov.id', 'demo_hash_123', 'Sultan Agung Hanyokrokusumo', 'Super Administrator Negara', 'Dewan Pengawas Tertinggi RI', 99, 1000, 1000, 100, 100, 1000000000000.0, 1000, 'superadmin', 'active')
ON CONFLICT (id) DO NOTHING;

INSERT INTO users (id, username, email, password_hash, full_name, title, position, level, exp, max_exp, energy, max_energy, money, gold, role, status)
VALUES 
  ('usr-moderator', 'moderator', 'moderator@nusantara.gov.id', 'demo_hash_123', 'Baharudin Lopa SH', 'Komisioner Pengawas Etik & Media', 'Dewan Kehormatan Penegak Tertib', 50, 500, 1000, 100, 100, 50000000000.0, 500, 'moderator', 'active')
ON CONFLICT (id) DO NOTHING;
`;

const finalSql = `${schemaDdl}

-- ==============================================================================
-- 🚀 DATA AWAL (SEED DATA UNTUK SUPABASE)
-- ==============================================================================

${additionalDemoUsers}

${convertedStatements.join('\n\n')}
`;

fs.writeFileSync('database/supabase_setup.sql', finalSql);
console.log('File database/supabase_setup.sql berhasil dibuat!');
console.log('Ukuran file:', Buffer.byteLength(finalSql), 'bytes');
