-- ==============================================================================
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

-- ==================== INDEKS QUERY SUPABASE ====================
CREATE INDEX IF NOT EXISTS idx_users_username ON users(username);
CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);
CREATE INDEX IF NOT EXISTS idx_users_residence ON users(residence_region_id);
CREATE INDEX IF NOT EXISTS idx_regions_island ON regions(island);
CREATE INDEX IF NOT EXISTS idx_bills_status ON bills(status);
CREATE INDEX IF NOT EXISTS idx_articles_created ON articles(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_world_regions_sector ON world_regions(sector);

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
END
$$;


-- ==============================================================================
-- 🚀 DATA AWAL (SEED DATA UNTUK SUPABASE)
-- ==============================================================================


-- USER DEMO TAMBAHAN (Super Admin & Moderator)
INSERT INTO users (id, username, email, password_hash, full_name, title, position, level, exp, max_exp, energy, max_energy, money, gold, role, status)
VALUES 
  ('usr-superadmin', 'superadmin', 'admin@nusantara.gov.id', 'demo_hash_123', 'Sultan Agung Hanyokrokusumo', 'Super Administrator Negara', 'Dewan Pengawas Tertinggi RI', 99, 1000, 1000, 100, 100, 1000000000000.0, 1000, 'superadmin', 'active')
ON CONFLICT (id) DO NOTHING;

INSERT INTO users (id, username, email, password_hash, full_name, title, position, level, exp, max_exp, energy, max_energy, money, gold, role, status)
VALUES 
  ('usr-moderator', 'moderator', 'moderator@nusantara.gov.id', 'demo_hash_123', 'Baharudin Lopa SH', 'Komisioner Pengawas Etik & Media', 'Dewan Kehormatan Penegak Tertib', 50, 500, 1000, 100, 100, 50000000000.0, 500, 'moderator', 'active')
ON CONFLICT (id) DO NOTHING;


-- ==============================================================================
-- SEED DATA: WEB REPUBLIC POLITIK (REPUBLIK NUSANTARA)
-- Generated automatically from initial game data
-- ==============================================================================

-- 1. DATA PENGGUNA DEMO
INSERT INTO users (
  id, username, email, password_hash, full_name, title, position, 
  level, exp, max_exp, energy, max_energy, money, gold, party_id, 
  residence_region_id, perk_charisma, perk_intellect, perk_endurance, perk_connections
) VALUES (
  'usr-satria', 'satria', 'satria@nusantara.id', 'demo_hash_123', 
  'Raden Satria Nusantara', 'Kader Muda Pergerakan', 'Anggota Fraksi DPR RI', 
  4, 340, 1000, 85, 100, 75000000.0, 45, NULL, 
  'dki', 18, 22, 15, 16
) ON CONFLICT (id) DO UPDATE SET updated_at = NOW();

-- 2. DATA PARTAI POLITIK (Murni Dibuat oleh Player)
-- Dikosongkan agar murni dibuat oleh pemain

-- 3. DATA 38 PROVINSI REPUBLIK INDONESIA
INSERT INTO regions (id, name, capital, island, population, budget, dominant_party_id, support_rate, resource, tax_rate, infrastructure_level, defense_power, lat, lng) VALUES ('aceh', 'Aceh', 'Banda Aceh', 'sumatera', 5400000, 18500000000, NULL, 74, 'Gas Alam & Kopi Gayo', 10.0, 1, 60, 5.5483, 95.3238) ON CONFLICT (id) DO NOTHING;

INSERT INTO regions (id, name, capital, island, population, budget, dominant_party_id, support_rate, resource, tax_rate, infrastructure_level, defense_power, lat, lng) VALUES ('sumut', 'Sumatera Utara', 'Medan', 'sumatera', 15300000, 34200000000, NULL, 68, 'Kelapa Sawit & Perdagangan', 10.0, 1, 60, 3.5952, 98.6722) ON CONFLICT (id) DO NOTHING;

INSERT INTO regions (id, name, capital, island, population, budget, dominant_party_id, support_rate, resource, tax_rate, infrastructure_level, defense_power, lat, lng) VALUES ('sumbar', 'Sumatera Barat', 'Padang', 'sumatera', 5600000, 16000000000, NULL, 71, 'Semen, Pertanian & UMKM', 10.0, 1, 60, -0.9471, 100.4172) ON CONFLICT (id) DO NOTHING;

INSERT INTO regions (id, name, capital, island, population, budget, dominant_party_id, support_rate, resource, tax_rate, infrastructure_level, defense_power, lat, lng) VALUES ('riau', 'Riau', 'Pekanbaru', 'sumatera', 6800000, 42000000000, NULL, 79, 'Minyak Bumi & Sawit', 10.0, 1, 60, 0.5071, 101.4478) ON CONFLICT (id) DO NOTHING;

INSERT INTO regions (id, name, capital, island, population, budget, dominant_party_id, support_rate, resource, tax_rate, infrastructure_level, defense_power, lat, lng) VALUES ('kepri', 'Kepulauan Riau', 'Tanjungpinang / Batam', 'sumatera', 2150000, 31000000000, NULL, 78, 'Manufaktur Elektronik & Maritim Malaka', 10.0, 1, 60, 0.9167, 104.45) ON CONFLICT (id) DO NOTHING;

INSERT INTO regions (id, name, capital, island, population, budget, dominant_party_id, support_rate, resource, tax_rate, infrastructure_level, defense_power, lat, lng) VALUES ('jambi', 'Jambi', 'Kota Jambi', 'sumatera', 3650000, 21000000000, NULL, 75, 'Minyak Bumi, Batubara & Karet', 10.0, 1, 60, -1.6101, 103.6131) ON CONFLICT (id) DO NOTHING;

INSERT INTO regions (id, name, capital, island, population, budget, dominant_party_id, support_rate, resource, tax_rate, infrastructure_level, defense_power, lat, lng) VALUES ('bengkulu', 'Bengkulu', 'Kota Bengkulu', 'sumatera', 2080000, 15000000000, NULL, 72, 'Batubara & Perikanan Samudera', 10.0, 1, 60, -3.8004, 102.2655) ON CONFLICT (id) DO NOTHING;

INSERT INTO regions (id, name, capital, island, population, budget, dominant_party_id, support_rate, resource, tax_rate, infrastructure_level, defense_power, lat, lng) VALUES ('sumsel', 'Sumatera Selatan', 'Palembang', 'sumatera', 8750000, 29000000000, NULL, 76, 'Batubara, Karet & Gas', 10.0, 1, 60, -2.9909, 104.7565) ON CONFLICT (id) DO NOTHING;

INSERT INTO regions (id, name, capital, island, population, budget, dominant_party_id, support_rate, resource, tax_rate, infrastructure_level, defense_power, lat, lng) VALUES ('babel', 'Kep. Bangka Belitung', 'Pangkalpinang', 'sumatera', 1520000, 19000000000, NULL, 76, 'Timah Terbesar Dunia & Lada Putih', 10.0, 1, 60, -2.1333, 106.1167) ON CONFLICT (id) DO NOTHING;

INSERT INTO regions (id, name, capital, island, population, budget, dominant_party_id, support_rate, resource, tax_rate, infrastructure_level, defense_power, lat, lng) VALUES ('lampung', 'Lampung', 'Bandar Lampung', 'sumatera', 9150000, 22000000000, NULL, 70, 'Pangan, Tebu & Pelabuhan Bakauheni', 10.0, 1, 60, -5.45, 105.2667) ON CONFLICT (id) DO NOTHING;

INSERT INTO regions (id, name, capital, island, population, budget, dominant_party_id, support_rate, resource, tax_rate, infrastructure_level, defense_power, lat, lng) VALUES ('banten', 'Banten', 'Serang', 'jawa', 12300000, 36000000000, NULL, 76, 'Baja Krakatau & Pelabuhan Merak', 10.0, 1, 60, -6.1104, 106.164) ON CONFLICT (id) DO NOTHING;

INSERT INTO regions (id, name, capital, island, population, budget, dominant_party_id, support_rate, resource, tax_rate, infrastructure_level, defense_power, lat, lng) VALUES ('dki', 'DKI Jakarta', 'Jakarta Pusat', 'jawa', 10700000, 85000000000, NULL, 65, 'Finansial & Korporasi Global', 10.0, 1, 60, -6.2088, 106.8456) ON CONFLICT (id) DO NOTHING;

INSERT INTO regions (id, name, capital, island, population, budget, dominant_party_id, support_rate, resource, tax_rate, infrastructure_level, defense_power, lat, lng) VALUES ('jabar', 'Jawa Barat', 'Bandung', 'jawa', 49800000, 62000000000, NULL, 72, 'Manufaktur, Otomotif & Tekstil', 10.0, 1, 60, -6.9175, 107.6191) ON CONFLICT (id) DO NOTHING;

INSERT INTO regions (id, name, capital, island, population, budget, dominant_party_id, support_rate, resource, tax_rate, infrastructure_level, defense_power, lat, lng) VALUES ('jateng', 'Jawa Tengah', 'Semarang', 'jawa', 37200000, 48000000000, NULL, 83, 'Pangan Nasional & Kawasan Industri', 10.0, 1, 60, -7.0051, 110.4381) ON CONFLICT (id) DO NOTHING;

INSERT INTO regions (id, name, capital, island, population, budget, dominant_party_id, support_rate, resource, tax_rate, infrastructure_level, defense_power, lat, lng) VALUES ('diy', 'DI Yogyakarta', 'Yogyakarta', 'jawa', 3900000, 15000000000, NULL, 88, 'Pendidikan Tinggi, Budaya & Wisata', 10.0, 1, 60, -7.7956, 110.3695) ON CONFLICT (id) DO NOTHING;

INSERT INTO regions (id, name, capital, island, population, budget, dominant_party_id, support_rate, resource, tax_rate, infrastructure_level, defense_power, lat, lng) VALUES ('jatim', 'Jawa Timur', 'Surabaya', 'jawa', 41100000, 58000000000, NULL, 80, 'Industri Berat, Galangan Kapal & Pangan', 10.0, 1, 60, -7.2575, 112.7521) ON CONFLICT (id) DO NOTHING;

INSERT INTO regions (id, name, capital, island, population, budget, dominant_party_id, support_rate, resource, tax_rate, infrastructure_level, defense_power, lat, lng) VALUES ('bali', 'Bali', 'Denpasar', 'nusa_tenggara', 4400000, 28000000000, NULL, 86, 'Pariwisata Internasional & Seni Budaya', 10.0, 1, 60, -8.6705, 115.2126) ON CONFLICT (id) DO NOTHING;

INSERT INTO regions (id, name, capital, island, population, budget, dominant_party_id, support_rate, resource, tax_rate, infrastructure_level, defense_power, lat, lng) VALUES ('ntb', 'Nusa Tenggara Barat', 'Mataram', 'nusa_tenggara', 5450000, 19000000000, NULL, 73, 'Tambang Tembaga & Mandalika Sport Tourism', 10.0, 1, 60, -8.5833, 116.1167) ON CONFLICT (id) DO NOTHING;

INSERT INTO regions (id, name, capital, island, population, budget, dominant_party_id, support_rate, resource, tax_rate, infrastructure_level, defense_power, lat, lng) VALUES ('ntt', 'Nusa Tenggara Timur', 'Kupang', 'nusa_tenggara', 5520000, 16000000000, NULL, 72, 'Peternakan, Labuan Bajo & Energi Terbarukan', 10.0, 1, 60, -10.1772, 123.607) ON CONFLICT (id) DO NOTHING;

INSERT INTO regions (id, name, capital, island, population, budget, dominant_party_id, support_rate, resource, tax_rate, infrastructure_level, defense_power, lat, lng) VALUES ('kalbar', 'Kalimantan Barat', 'Pontianak', 'kalimantan', 5450000, 28000000000, NULL, 75, 'Bauksit, Smelter & Perbatasan Serawak', 10.0, 1, 60, -0.0263, 109.3425) ON CONFLICT (id) DO NOTHING;

INSERT INTO regions (id, name, capital, island, population, budget, dominant_party_id, support_rate, resource, tax_rate, infrastructure_level, defense_power, lat, lng) VALUES ('kalteng', 'Kalimantan Tengah', 'Palangka Raya', 'kalimantan', 2750000, 23000000000, NULL, 78, 'Hutan Konservasi & Sawit', 10.0, 1, 60, -2.2161, 113.9139) ON CONFLICT (id) DO NOTHING;

INSERT INTO regions (id, name, capital, island, population, budget, dominant_party_id, support_rate, resource, tax_rate, infrastructure_level, defense_power, lat, lng) VALUES ('kalsel', 'Kalimantan Selatan', 'Banjarbaru / Banjarmasin', 'kalimantan', 4180000, 27000000000, NULL, 79, 'Batubara, Intan & Pelabuhan Logistik', 10.0, 1, 60, -3.3194, 114.5908) ON CONFLICT (id) DO NOTHING;

INSERT INTO regions (id, name, capital, island, population, budget, dominant_party_id, support_rate, resource, tax_rate, infrastructure_level, defense_power, lat, lng) VALUES ('kaltim', 'Kalimantan Timur (IKN)', 'IKN Nusantara / Samarinda', 'kalimantan', 3950000, 55000000000, NULL, 85, 'Ibu Kota Nusantara (IKN), Gas & Batubara', 10.0, 1, 60, -0.5022, 117.1536) ON CONFLICT (id) DO NOTHING;

INSERT INTO regions (id, name, capital, island, population, budget, dominant_party_id, support_rate, resource, tax_rate, infrastructure_level, defense_power, lat, lng) VALUES ('kaltara', 'Kalimantan Utara', 'Tanjung Selor', 'kalimantan', 740000, 17000000000, NULL, 77, 'Kawasan Industri Hijau (KIPI) & Hidroelektrik', 10.0, 1, 60, 2.8427, 117.3644) ON CONFLICT (id) DO NOTHING;

INSERT INTO regions (id, name, capital, island, population, budget, dominant_party_id, support_rate, resource, tax_rate, infrastructure_level, defense_power, lat, lng) VALUES ('sulut', 'Sulawesi Utara', 'Manado', 'sulawesi', 2680000, 20000000000, NULL, 80, 'Pintu Gerbang Pasifik & Perikanan Tuna', 10.0, 1, 60, 1.4748, 124.8421) ON CONFLICT (id) DO NOTHING;

INSERT INTO regions (id, name, capital, island, population, budget, dominant_party_id, support_rate, resource, tax_rate, infrastructure_level, defense_power, lat, lng) VALUES ('gorontalo', 'Gorontalo', 'Kota Gorontalo', 'sulawesi', 1220000, 14000000000, NULL, 74, 'Jagung Nasional & Perikanan Teluk Tomini', 10.0, 1, 60, 0.5435, 123.0568) ON CONFLICT (id) DO NOTHING;

INSERT INTO regions (id, name, capital, island, population, budget, dominant_party_id, support_rate, resource, tax_rate, infrastructure_level, defense_power, lat, lng) VALUES ('sulteng', 'Sulawesi Tengah', 'Palu / Morowali', 'sulawesi', 3120000, 38000000000, NULL, 82, 'Hilirisasi Nikel & Smelter Morowali', 10.0, 1, 60, -0.9003, 119.878) ON CONFLICT (id) DO NOTHING;

INSERT INTO regions (id, name, capital, island, population, budget, dominant_party_id, support_rate, resource, tax_rate, infrastructure_level, defense_power, lat, lng) VALUES ('sulbar', 'Sulawesi Barat', 'Mamuju', 'sulawesi', 1460000, 15500000000, NULL, 74, 'Kakao, Kelapa Sawit & Selat Makassar', 10.0, 1, 60, -2.677, 118.887) ON CONFLICT (id) DO NOTHING;

INSERT INTO regions (id, name, capital, island, population, budget, dominant_party_id, support_rate, resource, tax_rate, infrastructure_level, defense_power, lat, lng) VALUES ('sulsel', 'Sulawesi Selatan', 'Makassar', 'sulawesi', 9350000, 34000000000, NULL, 81, 'Hub Maritim Timur, Nikel Soroako & Pangan', 10.0, 1, 60, -5.1477, 119.4327) ON CONFLICT (id) DO NOTHING;

INSERT INTO regions (id, name, capital, island, population, budget, dominant_party_id, support_rate, resource, tax_rate, infrastructure_level, defense_power, lat, lng) VALUES ('sultra', 'Sulawesi Tenggara', 'Kendari', 'sulawesi', 2780000, 25000000000, NULL, 76, 'Cadangan Bijih Nikel Terbesar Dunia', 10.0, 1, 60, -3.9985, 122.5126) ON CONFLICT (id) DO NOTHING;

INSERT INTO regions (id, name, capital, island, population, budget, dominant_party_id, support_rate, resource, tax_rate, infrastructure_level, defense_power, lat, lng) VALUES ('maluku', 'Maluku', 'Ambon', 'maluku', 1920000, 16500000000, NULL, 77, 'Lumbung Ikan Nasional & Blok Masela', 10.0, 1, 60, -3.6547, 128.1906) ON CONFLICT (id) DO NOTHING;

INSERT INTO regions (id, name, capital, island, population, budget, dominant_party_id, support_rate, resource, tax_rate, infrastructure_level, defense_power, lat, lng) VALUES ('malut', 'Maluku Utara', 'Sofifi / Weda Bay', 'maluku', 1360000, 27000000000, NULL, 84, 'Kawasan Industri Nikel Weda Bay & Rempah', 10.0, 1, 60, 0.73, 127.56) ON CONFLICT (id) DO NOTHING;

INSERT INTO regions (id, name, capital, island, population, budget, dominant_party_id, support_rate, resource, tax_rate, infrastructure_level, defense_power, lat, lng) VALUES ('papua', 'Papua (Induk)', 'Jayapura', 'papua', 1120000, 23000000000, NULL, 70, 'Pusat Maritim Pasifik & Perbatasan PNG', 10.0, 1, 60, -2.5916, 140.669) ON CONFLICT (id) DO NOTHING;

INSERT INTO regions (id, name, capital, island, population, budget, dominant_party_id, support_rate, resource, tax_rate, infrastructure_level, defense_power, lat, lng) VALUES ('papua_barat_induk', 'Papua Barat', 'Manokwari', 'papua', 570000, 20000000000, NULL, 76, 'Gas Alam Cair Tangguh & Konservasi Hayati', 10.0, 1, 60, -0.8615, 134.062) ON CONFLICT (id) DO NOTHING;

INSERT INTO regions (id, name, capital, island, population, budget, dominant_party_id, support_rate, resource, tax_rate, infrastructure_level, defense_power, lat, lng) VALUES ('papua_barat', 'Papua Barat Daya', 'Sorong / Raja Ampat', 'papua', 630000, 18500000000, NULL, 77, 'Minyak Kasim & Pariwisata Bahari Raja Ampat', 10.0, 1, 60, -0.8762, 131.2558) ON CONFLICT (id) DO NOTHING;

INSERT INTO regions (id, name, capital, island, population, budget, dominant_party_id, support_rate, resource, tax_rate, infrastructure_level, defense_power, lat, lng) VALUES ('papua_tengah', 'Papua Tengah', 'Nabire / Grasberg', 'papua', 1460000, 45000000000, NULL, 75, 'Tambang Emas & Tembaga Terbesar Grasberg', 10.0, 1, 60, -3.3667, 135.4833) ON CONFLICT (id) DO NOTHING;

INSERT INTO regions (id, name, capital, island, population, budget, dominant_party_id, support_rate, resource, tax_rate, infrastructure_level, defense_power, lat, lng) VALUES ('papua_selatan', 'Papua Selatan', 'Merauke', 'papua', 530000, 22000000000, NULL, 78, 'Kawasan Pangan Nasional (Food Estate) & Perbatasan', 10.0, 1, 60, -8.4991, 140.4011) ON CONFLICT (id) DO NOTHING;

INSERT INTO regions (id, name, capital, island, population, budget, dominant_party_id, support_rate, resource, tax_rate, infrastructure_level, defense_power, lat, lng) VALUES ('papua_pegunungan', 'Papua Pegunungan', 'Wamena', 'papua', 1430000, 17500000000, NULL, 71, 'Kopi Arabika Wamena & Hasil Bumi Lembah Baliem', 10.0, 1, 60, -4.0984, 138.9439) ON CONFLICT (id) DO NOTHING;

-- 4. DATA RANCANGAN UNDANG-UNDANG DPR RI (KOSONG - MURNI DIAJUKAN OLEH PEMAIN DI PARLEMEN)


-- 5. DATA UNDANG-UNDANG NASIONAL YANG TELAH DISAHKAN

INSERT INTO passed_laws (id, title, category, description, national_effects) VALUES ('law-ikn-transfer', 'UU Pemindahan Ibu Kota Negara ke Nusantara (IKN)', 'Tata Negara', '', '{}') ON CONFLICT (id) DO NOTHING;

INSERT INTO passed_laws (id, title, category, description, national_effects) VALUES ('law-bpjs-universal', 'UU Jaminan Pelayanan Medis Semesta (BPJS Rakyat)', 'Kesehatan', '', '{}') ON CONFLICT (id) DO NOTHING;

INSERT INTO passed_laws (id, title, category, description, national_effects) VALUES ('law-threshold-parliament', 'UU Ambang Batas Parlemen (Parliamentary Threshold 4%)', 'Pemilu & Parlemen', '', '{}') ON CONFLICT (id) DO NOTHING;

-- 6. DATA PEMILU & KANDIDAT PRESIDEN

INSERT INTO elections (id, title, type, term, status, end_time) VALUES ('pemilu-2026', 'Pemilihan Presiden & Wakil Presiden Republik Nusantara', 'presidential', '2026-2031', 'active', (NOW() + INTERVAL '3 days')) ON CONFLICT (id) DO NOTHING;

INSERT INTO candidates (id, election_id, name, running_mate, party_id, votes, vision, promises, color) VALUES ('cand-1', 'pemilu-2026', 'Jend. (Purn) Prabowo Kusumo & Gibran Rakabumi', '', NULL, 0, '', '[]', '#f59e0b') ON CONFLICT (id) DO NOTHING;

INSERT INTO candidates (id, election_id, name, running_mate, party_id, votes, vision, promises, color) VALUES ('cand-2', 'pemilu-2026', 'Ganjar Pranowo & Mahfud M.D.', '', NULL, 0, '', '[]', '#dc2626') ON CONFLICT (id) DO NOTHING;

INSERT INTO candidates (id, election_id, name, running_mate, party_id, votes, vision, promises, color) VALUES ('cand-3', 'pemilu-2026', 'Anies Baswedan & Muhaimin Iskandar', '', NULL, 0, '', '[]', '#f97316') ON CONFLICT (id) DO NOTHING;

-- 7. DATA KORAN PERS NASIONAL

INSERT INTO articles (id, title, content, category, author_id, author_name, author_title, newspaper_name, views, upvotes) VALUES ('art-1', '', 'Gedung Nusantara DPR RI bergemuruh saat fraksi oposisi mempertanyakan lonjakan anggaran belanja radar pertahanan. Sementara itu, kubu pemerintah menegaskan bahwa kedaulatan laut nusantara tidak dapat dikompromikan.', 'Parlemen', 'usr-satria', 'Redaksi Harian Garuda', '', 'Harian Nusantara', 100, 840) ON CONFLICT (id) DO NOTHING;

INSERT INTO articles (id, title, content, category, author_id, author_name, author_title, newspaper_name, views, upvotes) VALUES ('art-2', '', 'Kementerian Perindustrian mengumumkan surplus perdagangan kuartal ini didorong oleh 14 smelter baru yang beroperasi penuh di Morowali dan Weda Bay. Partai Teknokrat mendorong dividen diarahkan untuk beasiswa riset.', 'Ekonomi', 'usr-satria', 'Warta Ekonomi Republik', '', 'Harian Nusantara', 100, 620) ON CONFLICT (id) DO NOTHING;

INSERT INTO articles (id, title, content, category, author_id, author_name, author_title, newspaper_name, views, upvotes) VALUES ('art-3', '', 'Simulasi Pilpres terbaru menunjukkan elektabilitas tiga poros utama masih berada di rentang 28% - 35%. Suara pemilih di Jawa Tengah, Jawa Barat, dan Jawa Timur diprediksi menjadi medan tempur penentu kemenangan mutlak.', 'Pemilu', 'usr-satria', 'Lembaga Indikator Politik Nusantara', '', 'Harian Nusantara', 100, 1950) ON CONFLICT (id) DO NOTHING;

-- 8. DATA KAWASAN GEOPOLITIK DUNIA

INSERT INTO world_regions (id, iso2, iso3, name, capital, flag, sector, population, bloc, diplomatic_status, dominant_resource, military_power, government_type, relations_with_ri, description) VALUES ('malaysia', 'MY', 'MYS', 'Federasi Malaysia', 'Kuala Lumpur', '🇲🇾', 'asean', 34.3, 'ASEAN • Non-Blok', 'Mitra Serumpun & Sekutu', 'Minyak Mentah, Sawit & Semikonduktor', 76, 'Monarki Konstitusional Federal', '+88% (Sangat Harmonis)', 'Negara tetangga terdekat di Selat Malaka & Kalimantan Utara. Mitra kunci perdagangan maritim Nusantara.') ON CONFLICT (id) DO NOTHING;

INSERT INTO world_regions (id, iso2, iso3, name, capital, flag, sector, population, bloc, diplomatic_status, dominant_resource, military_power, government_type, relations_with_ri, description) VALUES ('singapore', 'SG', 'SGP', 'Republik Singapura', 'Singapura', '🇸🇬', 'asean', 5.9, 'ASEAN • Global Hub', 'Mitra Finansial Utama', 'Pusat Keuangan Global & Kilang Maritim', 84, 'Republik Parlementer', '+85% (Kemitraan Strategis)', 'Pusat logistik dan keuangan terbesar di Asia Tenggara dengan armada pertahanan modern canggih.') ON CONFLICT (id) DO NOTHING;

INSERT INTO world_regions (id, iso2, iso3, name, capital, flag, sector, population, bloc, diplomatic_status, dominant_resource, military_power, government_type, relations_with_ri, description) VALUES ('philippines', 'PH', 'PHL', 'Republik Filipina', 'Manila', '🇵🇭', 'asean', 115.6, 'ASEAN • Pasifik', 'Mitra Keamanan Maritim', 'Nikel, Tembaga & Jasa Teknologi', 72, 'Republik Presidensial', '+80% (Bilateral Stabil)', 'Kepulauan tetangga di utara Sulawesi. Bekerja sama dalam patroli perairan Laut Sulawesi & Sulu.') ON CONFLICT (id) DO NOTHING;

INSERT INTO world_regions (id, iso2, iso3, name, capital, flag, sector, population, bloc, diplomatic_status, dominant_resource, military_power, government_type, relations_with_ri, description) VALUES ('thailand', 'TH', 'THA', 'Kerajaan Thailand', 'Bangkok', '🇹🇭', 'asean', 71.8, 'ASEAN • Lumbung Pangan', 'Mitra Perdagangan Pangan', 'Beras, Otomotif & Karet Alam', 78, 'Monarki Konstitusional', '+82% (Mitra Dagang Aktif)', 'Kekuatan ekonomi daratan Asia Tenggara, lumbung pangan dan pusat manufaktur otomotif regional.') ON CONFLICT (id) DO NOTHING;

INSERT INTO world_regions (id, iso2, iso3, name, capital, flag, sector, population, bloc, diplomatic_status, dominant_resource, military_power, government_type, relations_with_ri, description) VALUES ('vietnam', 'VN', 'VNM', 'Republik Sosialis Vietnam', 'Hanoi', '🇻🇳', 'asean', 98.2, 'ASEAN • Industri Manufaktur', 'Mitra Strategis Komprehensif', 'Elektronika, Tekstil & Minyak Bumi', 83, 'Republik Sosialis Satu Partai', '+84% (Sangat Erat)', 'Kekuatan militer darat teruji dan pusat manufaktur yang berkembang sangat pesat di Laut Cina Selatan.') ON CONFLICT (id) DO NOTHING;

INSERT INTO world_regions (id, iso2, iso3, name, capital, flag, sector, population, bloc, diplomatic_status, dominant_resource, military_power, government_type, relations_with_ri, description) VALUES ('brunei', 'BN', 'BRN', 'Negara Brunei Darussalam', 'Bandar Seri Begawan', '🇧🇳', 'asean', 0.5, 'ASEAN • Petrodolar Serumpun', 'Sahabat Serumpun', 'Minyak Bumi & Gas Alam Cair (LNG)', 65, 'Monarki Absolut Islam Melayu', '+90% (Sangat Harmonis)', 'Kesultanan kaya minyak di pantai barat laut pulau Kalimantan yang bertetangga erat dengan Indonesia.') ON CONFLICT (id) DO NOTHING;

INSERT INTO world_regions (id, iso2, iso3, name, capital, flag, sector, population, bloc, diplomatic_status, dominant_resource, military_power, government_type, relations_with_ri, description) VALUES ('timor_leste', 'TL', 'TLS', 'Republik Demokratik Timor Leste', 'Dili', '🇹🇱', 'asean', 1.3, 'Calon Anggota ASEAN • Pasifik', 'Tetangga Perbatasan Darat', 'Minyak Lepas Pantai & Kopi Organik', 55, 'Republik Semi-Presidensial', '+94% (Persaudaraan & Rekonsiliasi Erat)', 'Berbatasan darat langsung dengan Nusa Tenggara Timur (NTT). Indonesia adalah pendukung utama keanggotaan penuh ASEAN.') ON CONFLICT (id) DO NOTHING;

INSERT INTO world_regions (id, iso2, iso3, name, capital, flag, sector, population, bloc, diplomatic_status, dominant_resource, military_power, government_type, relations_with_ri, description) VALUES ('papua_new_guinea', 'PG', 'PNG', 'Negara Independen Papua Nugini', 'Port Moresby', '🇵🇬', 'africa_oceania', 10.1, 'Pasifik • Melanesian Spearhead Group', 'Mitra Perbatasan Darat Timur', 'Emas, Gas Alam & Hasil Hutan', 62, 'Monarki Konstitusional Parlementer', '+86% (Stabilitas Perbatasan)', 'Berbatasan darat langsung sepanjang 820 km di Pulau Papua dari Jayapura hingga Merauke.') ON CONFLICT (id) DO NOTHING;

INSERT INTO world_regions (id, iso2, iso3, name, capital, flag, sector, population, bloc, diplomatic_status, dominant_resource, military_power, government_type, relations_with_ri, description) VALUES ('australia', 'AU', 'AUS', 'Persemakmuran Australia', 'Canberra', '🇦🇺', 'africa_oceania', 26.5, 'AUKUS • Pasifik Selatan', 'Tetangga Strategis Selatan', 'Uranium, Gas Alam, Batubara & Gandum', 88, 'Monarki Konstitusional Parlementer', '+78% (Dinamis & Konstruktif)', 'Kekuatan benua selatan yang berbatasan laut langsung dengan perairan Nusa Tenggara, Bali, dan Papua Selatan.') ON CONFLICT (id) DO NOTHING;

INSERT INTO world_regions (id, iso2, iso3, name, capital, flag, sector, population, bloc, diplomatic_status, dominant_resource, military_power, government_type, relations_with_ri, description) VALUES ('new_zealand', 'NZ', 'NZL', 'Selandia Baru', 'Wellington', '🇳🇿', 'africa_oceania', 5.2, 'Five Eyes • Pasifik', 'Mitra Peternakan & Energi Hijau', 'Susu, Daging, Panas Bumi & Pariwisata', 70, 'Monarki Konstitusional Parlementer', '+80% (Bilateral Erat)', 'Negara kepulauan modern di Pasifik Barat Daya, penyuplai utama produk susu olahan ke pasar Indonesia.') ON CONFLICT (id) DO NOTHING;

INSERT INTO world_regions (id, iso2, iso3, name, capital, flag, sector, population, bloc, diplomatic_status, dominant_resource, military_power, government_type, relations_with_ri, description) VALUES ('china', 'CN', 'CHN', 'Republik Rakyat Tiongkok', 'Beijing', '🇨🇳', 'east_asia', 1412, 'BRICS • Superpower', 'Mitra Dagang & Investasi Terbesar', 'Manufaktur Raksasa, Rare Earth & Baja', 98, 'Republik Sosialis', '+81% (Investasi Tinggi)', 'Kekuatan ekonomi dan manufaktur global. Investor infrastruktur dan pengolah nikel terbesar di Nusantara.') ON CONFLICT (id) DO NOTHING;

INSERT INTO world_regions (id, iso2, iso3, name, capital, flag, sector, population, bloc, diplomatic_status, dominant_resource, military_power, government_type, relations_with_ri, description) VALUES ('japan', 'JP', 'JPN', 'Negara Jepang', 'Tokyo', '🇯🇵', 'east_asia', 124.5, 'G7 • Aliansi Pasifik', 'Mitra Teknologi & Pembangunan', 'Robotika, Otomotif & Teknologi Maritim', 91, 'Monarki Konstitusional Parlementer', '+86% (Kemitraan Erat)', 'Pionir industri teknologi presisi dan armada maritim modern di kawasan Pasifik Utara.') ON CONFLICT (id) DO NOTHING;

INSERT INTO world_regions (id, iso2, iso3, name, capital, flag, sector, population, bloc, diplomatic_status, dominant_resource, military_power, government_type, relations_with_ri, description) VALUES ('south_korea', 'KR', 'KOR', 'Republik Korea (Korea Selatan)', 'Seoul', '🇰🇷', 'east_asia', 51.7, 'G20 • Aliansi Industri', 'Mitra Dirgantara & Baterai EV', 'Baterai Listrik, Semikonduktor & Alutsista', 93, 'Republik Presidensial', '+85% (Proyek Jet Tempur KFX/IFX)', 'Mitra bersama dalam pengembangan pesawat tempur generasi 4.5 dan ekosistem rantai pasok EV nasional.') ON CONFLICT (id) DO NOTHING;

INSERT INTO world_regions (id, iso2, iso3, name, capital, flag, sector, population, bloc, diplomatic_status, dominant_resource, military_power, government_type, relations_with_ri, description) VALUES ('north_korea', 'KP', 'PRK', 'Republik Demokratik Rakyat Korea', 'Pyongyang', '🇰🇵', 'east_asia', 26, 'Non-Blok Historis • Kekuatan Nuklir', 'Hubungan Diplomatik Sejarah (Soekarno)', 'Batubara, Mineral & Teknologi Rudal', 86, 'Republik Sosialis Juche', '+75% (Hubungan Sejarah Bunga Kimilsungia)', 'Memiliki hubungan diplomatik unik bersejarah dengan Indonesia sejak era Presiden Soekarno.') ON CONFLICT (id) DO NOTHING;

INSERT INTO world_regions (id, iso2, iso3, name, capital, flag, sector, population, bloc, diplomatic_status, dominant_resource, military_power, government_type, relations_with_ri, description) VALUES ('saudi_arabia', 'SA', 'SAU', 'Kerajaan Arab Saudi', 'Riyadh', '🇸🇦', 'mid_east_south', 36.4, 'OPEC • BRICS • Liga Arab', 'Mitra Energi & Spiritual Global', 'Minyak Mentah Cadangan Dunia & Petrokimia', 82, 'Monarki Absolut', '+92% (Hubungan Istimewa Haji & Energi)', 'Raksasa energi global pemegang kendali pasar minyak dunia serta pusat ziarah spiritual umat Islam dunia.') ON CONFLICT (id) DO NOTHING;

INSERT INTO world_regions (id, iso2, iso3, name, capital, flag, sector, population, bloc, diplomatic_status, dominant_resource, military_power, government_type, relations_with_ri, description) VALUES ('uae', 'AE', 'ARE', 'Uni Emirat Arab', 'Abu Dhabi', '🇦🇪', 'mid_east_south', 9.5, 'OPEC • Sovereign Wealth Hub', 'Investor Strategis Ibu Kota Baru', 'Finansial Global, Penerbangan & Energi Hijau', 79, 'Federasi Monarki', '+90% (Investor Kunci IKN Nusantara)', 'Pusat perdagangan dan investasi multinasional di Teluk Persia dengan sovereign wealth fund raksasa.') ON CONFLICT (id) DO NOTHING;

INSERT INTO world_regions (id, iso2, iso3, name, capital, flag, sector, population, bloc, diplomatic_status, dominant_resource, military_power, government_type, relations_with_ri, description) VALUES ('india', 'IN', 'IND', 'Republik India', 'New Delhi', '🇮🇳', 'mid_east_south', 1428, 'BRICS • Samudra Hindia', 'Mitra Maritim Samudra Hindia', 'Teknologi Informasi, Farmasi & Baja', 95, 'Republik Parlementer Federal', '+83% (Perjanjian Sabang-Andaman)', 'Kekuatan demografi terbesar di dunia, berbatasan laut di ujung barat Sabang via Kepulauan Andaman & Nikobar.') ON CONFLICT (id) DO NOTHING;

INSERT INTO world_regions (id, iso2, iso3, name, capital, flag, sector, population, bloc, diplomatic_status, dominant_resource, military_power, government_type, relations_with_ri, description) VALUES ('turkey', 'TR', 'TUR', 'Republik Türkiye', 'Ankara', '🇹🇷', 'mid_east_south', 85.3, 'NATO • Eurasia Bridge', 'Mitra Industri Pertahanan', 'Drone Tempur (UAV), Baja & Pertanian', 89, 'Republik Presidensial', '+88% (Mitra Alutsista & Kapal Perang)', 'Jembatan geopolitik antara Eropa dan Asia dengan teknologi drone tempur dan alutsista terdepan.') ON CONFLICT (id) DO NOTHING;

INSERT INTO world_regions (id, iso2, iso3, name, capital, flag, sector, population, bloc, diplomatic_status, dominant_resource, military_power, government_type, relations_with_ri, description) VALUES ('iran', 'IR', 'IRN', 'Republik Islam Iran', 'Tehran', '🇮🇷', 'mid_east_south', 88.5, 'BRICS • Selat Hormuz', 'Mitra Energi & Gerakan Non-Blok', 'Minyak, Gas, Drone & Teknologi Nuklir', 85, 'Teokrasi Republik Islam', '+79% (Hubungan Perdagangan Netral)', 'Penguasa perairan strategis Selat Hormuz dengan pengaruh geopolitik kuat di Timur Tengah.') ON CONFLICT (id) DO NOTHING;

INSERT INTO world_regions (id, iso2, iso3, name, capital, flag, sector, population, bloc, diplomatic_status, dominant_resource, military_power, government_type, relations_with_ri, description) VALUES ('russia', 'RU', 'RUS', 'Federasi Rusia', 'Moskow', '🇷🇺', 'europe', 144.2, 'BRICS • Superpower Eurasia', 'Mitra Strategis Alutsista & Nuklir', 'Gas Bumi, Minyak, Uranium & Gandum', 97, 'Republik Semi-Presidensial Federal', '+83% (Hubungan Bersejarah Kuat)', 'Negara dengan daratan terluas di dunia, memiliki cadangan energi fosil dan persenjataan nuklir terbesar.') ON CONFLICT (id) DO NOTHING;

INSERT INTO world_regions (id, iso2, iso3, name, capital, flag, sector, population, bloc, diplomatic_status, dominant_resource, military_power, government_type, relations_with_ri, description) VALUES ('united_kingdom', 'GB', 'GBR', 'Kerajaan Bersatu (Inggris / UK)', 'London', '🇬🇧', 'europe', 67.7, 'NATO • G7 • Dewan Keamanan PBB', 'Mitra Finansial & Maritim Global', 'Jasa Keuangan, Teknologi Kedirgantaraan', 90, 'Monarki Konstitusional Parlementer', '+78% (Mitra Maritim & Pendidikan)', 'Pusat moneter global City of London dan kekuatan diplomasi internasional pemegang hak veto PBB.') ON CONFLICT (id) DO NOTHING;

INSERT INTO world_regions (id, iso2, iso3, name, capital, flag, sector, population, bloc, diplomatic_status, dominant_resource, military_power, government_type, relations_with_ri, description) VALUES ('germany', 'DE', 'DEU', 'Republik Federal Jerman', 'Berlin', '🇩🇪', 'europe', 84.4, 'Uni Eropa • G7 • Pemimpin Ekonomi', 'Mitra Industri Mesin & Riset', 'Teknik Presisi, Otomotif & Energi Terbarukan', 85, 'Republik Federal Parlementer', '+82% (Kemitraan Teknologi Hijau)', 'Motor ekonomi terkuat di Benua Eropa dengan standar keunggulan manufaktur presisi industri 4.0.') ON CONFLICT (id) DO NOTHING;

INSERT INTO world_regions (id, iso2, iso3, name, capital, flag, sector, population, bloc, diplomatic_status, dominant_resource, military_power, government_type, relations_with_ri, description) VALUES ('france', 'FR', 'FRA', 'Republik Prancis', 'Paris', '🇫🇷', 'europe', 68, 'Uni Eropa • NATO • Veto PBB', 'Pemasok Jet Tempur Rafale & Kapal Selam', 'Dirgantara (Airbus/Dassault), Nuklir & Mewah', 92, 'Republik Semi-Presidensial', '+87% (Kerjasama Strategis Pertahanan RI)', 'Kekuatan diplomasi dan industri alutsista terkemuka Eropa, mitra pengadaan jet tempur generasi 4.5 Rafale RI.') ON CONFLICT (id) DO NOTHING;

INSERT INTO world_regions (id, iso2, iso3, name, capital, flag, sector, population, bloc, diplomatic_status, dominant_resource, military_power, government_type, relations_with_ri, description) VALUES ('netherlands', 'NL', 'NLD', 'Kerajaan Belanda', 'Amsterdam', '🇳🇱', 'europe', 17.8, 'Uni Eropa • NATO • Gerbang Eropa', 'Pintu Gerbang Ekspor Sawit ke Eropa', 'Pelabuhan Rotterdam, Semikonduktor (ASML) & Maritim', 79, 'Monarki Konstitusional Parlementer', '+83% (Hubungan Sejarah & Kerjasama Hukum)', 'Pusat logistik pelabuhan terbesar di Eropa (Rotterdam) dan produsen mesin semikonduktor paling canggih di dunia.') ON CONFLICT (id) DO NOTHING;

INSERT INTO world_regions (id, iso2, iso3, name, capital, flag, sector, population, bloc, diplomatic_status, dominant_resource, military_power, government_type, relations_with_ri, description) VALUES ('usa', 'US', 'USA', 'Amerika Serikat (USA)', 'Washington D.C.', '🇺🇸', 'americas', 334.9, 'NATO • G7 • Superpower Ekonomi', 'Mitra Strategis Komprehensif', 'Dolar AS, Teknologi Digital (Silicon Valley) & Alutsista', 100, 'Republik Presidensial Federal Konstitusional', '+80% (Kemitraan Bebas Aktif)', 'Kekuatan ekonomi dan pertahanan global terbesar di dunia dengan jangkauan militer lintas samudra.') ON CONFLICT (id) DO NOTHING;

INSERT INTO world_regions (id, iso2, iso3, name, capital, flag, sector, population, bloc, diplomatic_status, dominant_resource, military_power, government_type, relations_with_ri, description) VALUES ('canada', 'CA', 'CAN', 'Kanada', 'Ottawa', '🇨🇦', 'americas', 39.5, 'G7 • NATO • Persemakmuran', 'Mitra Perjanjian Dagang CEPA', 'Nikel, Gandum, Minyak & Potasium', 80, 'Monarki Konstitusional Parlementer Federal', '+81% (Perdagangan Komoditas)', 'Negara terluas kedua di dunia dengan cadangan mineral kritis dan hasil hutan berlimpah.') ON CONFLICT (id) DO NOTHING;

INSERT INTO world_regions (id, iso2, iso3, name, capital, flag, sector, population, bloc, diplomatic_status, dominant_resource, military_power, government_type, relations_with_ri, description) VALUES ('brazil', 'BR', 'BRA', 'Republik Federatif Brasil', 'Brasilia', '🇧🇷', 'americas', 215.3, 'BRICS • Pemimpin Amerika Latin', 'Mitra Hutan Hujan & Agrikultur', 'Kedelai, Daging, Bijih Besi & Biofuel', 81, 'Republik Presidensial Federal', '+83% (Aliansi Negara Hutan Hujan Tropis)', 'Pemegang paru-paru dunia Amazon, bersekutu dengan Indonesia dalam diplomasi iklim dan pasar komoditas.') ON CONFLICT (id) DO NOTHING;

INSERT INTO world_regions (id, iso2, iso3, name, capital, flag, sector, population, bloc, diplomatic_status, dominant_resource, military_power, government_type, relations_with_ri, description) VALUES ('argentina', 'AR', 'ARG', 'Republik Argentina', 'Buenos Aires', '🇦🇷', 'americas', 46.2, 'G20 • Segitiga Litium', 'Mitra Pangan & Cadangan Litium', 'Litium, Kedelai, Gandum & Daging Sapi', 73, 'Republik Presidensial Federal', '+80% (Mitra Litium Baterai EV)', 'Bagian dari Segitiga Litium dunia di Amerika Selatan, mitra strategis pengembangan bahan baku baterai.') ON CONFLICT (id) DO NOTHING;

INSERT INTO world_regions (id, iso2, iso3, name, capital, flag, sector, population, bloc, diplomatic_status, dominant_resource, military_power, government_type, relations_with_ri, description) VALUES ('south_africa', 'ZA', 'ZAF', 'Republik Afrika Selatan', 'Pretoria', '🇿🇦', 'africa_oceania', 60.4, 'BRICS • G20 • Samudra Atlantik-Hindia', 'Mitra Gerakan Non-Blok', 'Platinum, Emas, Berlian & Batubara', 74, 'Republik Parlementer', '+84% (Diplomasi Konferensi Asia Afrika)', 'Raksasa tambang mineral berharga Afrika, memiliki keterikatan sejarah diplomasi kuat dengan Indonesia sejak KAA 1955.') ON CONFLICT (id) DO NOTHING;

INSERT INTO world_regions (id, iso2, iso3, name, capital, flag, sector, population, bloc, diplomatic_status, dominant_resource, military_power, government_type, relations_with_ri, description) VALUES ('egypt', 'EG', 'EGY', 'Republik Arab Mesir', 'Kairo', '🇪🇬', 'africa_oceania', 110.9, 'BRICS • Terusan Suez • Liga Arab', 'Negara Pertama Pengakui Kemerdekaan RI', 'Terusan Suez, Gas Alam & Pariwisata Kuno', 87, 'Republik Presidensial', '+95% (Sekutu Historis Sejati)', 'Penguasa Terusan Suez rute pelayaran maritim dunia, dan negara pertama di dunia yang mengakui de jure kemerdekaan RI 1945.') ON CONFLICT (id) DO NOTHING;

-- 9. DATA TRAKTAT & PERJANJIAN INTERNASIONAL AWAL

INSERT INTO diplomatic_treaties (id, world_region_id, treaty_type, title, description, status) VALUES ('trt-mys-1', 'malaysia', 'defense', 'Pakta Kerjasama Patroli Perbatasan Selat Malaka & Selat Karimata', 'Perjanjian patroli angkatan laut bersama untuk menjaga stabilitas jalur pelayaran tersibuk di dunia.', 'active') ON CONFLICT (id) DO NOTHING;

INSERT INTO diplomatic_treaties (id, world_region_id, treaty_type, title, description, status) VALUES ('trt-sgp-1', 'singapore', 'trade', 'Pusat Kliring Finansial & Logistik Pelabuhan Maritim Nusantara', 'Kemudahan bebas bea transit komoditas nikel dan bauksit olahan ke hub logistik Singapura.', 'active') ON CONFLICT (id) DO NOTHING;

INSERT INTO diplomatic_treaties (id, world_region_id, treaty_type, title, description, status) VALUES ('trt-sau-1', 'saudi_arabia', 'cultural', 'Perjanjian Kuota Ziarah Haji & Pasokan Minyak Mentah Strategis', 'Pengamanan pasokan energi minyak fosil cadangan nasional dan fasilitas khusus jamaah RI.', 'active') ON CONFLICT (id) DO NOTHING;
