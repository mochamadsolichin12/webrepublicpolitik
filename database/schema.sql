-- ==============================================================================
-- DATABASE SCHEMA: WEB REPUBLIC POLITIK (REPUBLIK NUSANTARA)
-- Engine: SQLite / PostgreSQL / MySQL Compatible ANSI SQL
-- Description: Skema Lengkap Basis Data Geopolitik, Tata Negara & Otonomi Daerah
-- ==============================================================================

-- 1. TABEL PENGGUNA & KARAKTER POLITIK (USERS)
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
    money REAL DEFAULT 75000000.0, -- Saldo Rupiah (Kas Pribadi)
    gold INTEGER DEFAULT 45,       -- Cadangan Emas Batangan
    party_id TEXT,
    residence_region_id TEXT DEFAULT 'dki', -- Wilayah Domisili / Tempat Spawn
    perk_charisma INTEGER DEFAULT 10,
    perk_intellect INTEGER DEFAULT 10,
    perk_endurance INTEGER DEFAULT 10,
    perk_connections INTEGER DEFAULT 10,
    voted_president_id TEXT,
    role TEXT DEFAULT 'player', -- 'superadmin', 'moderator', 'player'
    status TEXT DEFAULT 'active', -- 'active', 'warned', 'banned'
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- 2. TABEL PARTAI POLITIK (PARTIES)
CREATE TABLE IF NOT EXISTS parties (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    short_name TEXT NOT NULL,
    leader TEXT NOT NULL,
    ideology TEXT NOT NULL,
    color TEXT NOT NULL,
    seats INTEGER DEFAULT 0,       -- Jumlah Kursi di DPR RI
    funds REAL DEFAULT 500000000.0, -- Kas Perbendaharaan Partai (Rp)
    members_count INTEGER DEFAULT 1,
    description TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- 3. TABEL 38 PROVINSI REPUBLIK INDONESIA (REGIONS)
CREATE TABLE IF NOT EXISTS regions (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    capital TEXT NOT NULL,
    island TEXT NOT NULL,         -- 'sumatera', 'jawa', 'kalimantan', 'sulawesi', 'bali_nusa', 'maluku', 'papua'
    population INTEGER NOT NULL,  -- Jiwa
    budget REAL NOT NULL,         -- APBD Daerah (Rupiah)
    dominant_party_id TEXT,
    support_rate INTEGER DEFAULT 75, -- Persentase Kepuasan Publik (%)
    resource TEXT NOT NULL,       -- Komoditas Unggulan Wilayah
    tax_rate REAL DEFAULT 10.0,   -- Pajak Penghasilan Daerah (%)
    infrastructure_level INTEGER DEFAULT 1,
    defense_power INTEGER DEFAULT 60,
    lat REAL NOT NULL,
    lng REAL NOT NULL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (dominant_party_id) REFERENCES parties(id) ON DELETE SET NULL
);

-- 4. TABEL RANCANGAN UNDANG-UNDANG PARLEMEN (BILLS)
CREATE TABLE IF NOT EXISTS bills (
    id TEXT PRIMARY KEY,
    title TEXT NOT NULL,
    description TEXT NOT NULL,
    category TEXT NOT NULL,       -- 'ekonomi', 'pertahanan', 'sosial', 'otonomi'
    author_id TEXT NOT NULL,
    author_name TEXT NOT NULL,
    party_id TEXT,
    yes_votes INTEGER DEFAULT 0,
    no_votes INTEGER DEFAULT 0,
    status TEXT DEFAULT 'voting', -- 'voting', 'passed', 'rejected'
    impact_summary TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (author_id) REFERENCES users(id),
    FOREIGN KEY (party_id) REFERENCES parties(id)
);

-- 5. TABEL PENGAMBILAN SUARA RUU (BILL_VOTES)
CREATE TABLE IF NOT EXISTS bill_votes (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    bill_id TEXT NOT NULL,
    user_id TEXT NOT NULL,
    vote TEXT NOT NULL CHECK(vote IN ('yes', 'no')),
    voted_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(bill_id, user_id),
    FOREIGN KEY (bill_id) REFERENCES bills(id) ON DELETE CASCADE,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- 6. TABEL UNDANG-UNDANG NASIONAL YANG TELAH DISAHKAN (PASSED_LAWS)
CREATE TABLE IF NOT EXISTS passed_laws (
    id TEXT PRIMARY KEY,
    bill_id TEXT,
    title TEXT NOT NULL,
    category TEXT NOT NULL,
    description TEXT NOT NULL,
    national_effects TEXT,        -- JSON string efek undang-undang terhadap ekonomi/sosial
    passed_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (bill_id) REFERENCES bills(id) ON DELETE SET NULL
);

-- 7. TABEL PEMILU RAYA NASIONAL (ELECTIONS)
CREATE TABLE IF NOT EXISTS elections (
    id TEXT PRIMARY KEY,
    title TEXT NOT NULL,
    type TEXT NOT NULL,           -- 'presidential', 'parliamentary', 'regional'
    term TEXT NOT NULL,
    status TEXT DEFAULT 'active', -- 'active', 'finished'
    start_time DATETIME DEFAULT CURRENT_TIMESTAMP,
    end_time DATETIME NOT NULL
);

-- 8. TABEL KANDIDAT CALON PRESIDEN & WAPRES (CANDIDATES)
CREATE TABLE IF NOT EXISTS candidates (
    id TEXT PRIMARY KEY,
    election_id TEXT NOT NULL,
    name TEXT NOT NULL,
    running_mate TEXT,
    party_id TEXT,
    votes INTEGER DEFAULT 0,
    vision TEXT,
    promises TEXT,                -- JSON string janji kampanye
    color TEXT DEFAULT '#fbbf24',
    FOREIGN KEY (election_id) REFERENCES elections(id) ON DELETE CASCADE,
    FOREIGN KEY (party_id) REFERENCES parties(id) ON DELETE SET NULL
);

-- 9. TABEL SURAT SUARA PEMILU (ELECTION_VOTES)
CREATE TABLE IF NOT EXISTS election_votes (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    election_id TEXT NOT NULL,
    candidate_id TEXT NOT NULL,
    user_id TEXT NOT NULL,
    voted_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(election_id, user_id),
    FOREIGN KEY (election_id) REFERENCES elections(id) ON DELETE CASCADE,
    FOREIGN KEY (candidate_id) REFERENCES candidates(id) ON DELETE CASCADE,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- 10. TABEL KORAN & ARTIKEL MEDIA PERS (ARTICLES)
CREATE TABLE IF NOT EXISTS articles (
    id TEXT PRIMARY KEY,
    title TEXT NOT NULL,
    content TEXT NOT NULL,
    category TEXT NOT NULL,       -- 'politik', 'ekonomi', 'opini', 'internasional'
    author_id TEXT NOT NULL,
    author_name TEXT NOT NULL,
    author_title TEXT,
    newspaper_name TEXT DEFAULT 'Harian Nusantara',
    views INTEGER DEFAULT 0,
    upvotes INTEGER DEFAULT 0,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (author_id) REFERENCES users(id) ON DELETE CASCADE
);

-- 11. TABEL APRESIASI / DUKUNGAN ARTIKEL (ARTICLE_UPVOTES)
CREATE TABLE IF NOT EXISTS article_upvotes (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    article_id TEXT NOT NULL,
    user_id TEXT NOT NULL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(article_id, user_id),
    FOREIGN KEY (article_id) REFERENCES articles(id) ON DELETE CASCADE,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- 12. TABEL KAWASAN GEOPOLITIK DUNIA (WORLD_REGIONS)
CREATE TABLE IF NOT EXISTS world_regions (
    id TEXT PRIMARY KEY,
    iso2 TEXT,
    iso3 TEXT,
    name TEXT NOT NULL,
    capital TEXT NOT NULL,
    flag TEXT NOT NULL,
    sector TEXT NOT NULL,         -- 'asean', 'east_asia', 'mid_east_south', 'europe', 'americas', 'africa_oceania'
    population REAL NOT NULL,     -- Juta Jiwa
    bloc TEXT NOT NULL,
    diplomatic_status TEXT NOT NULL,
    dominant_resource TEXT NOT NULL,
    military_power INTEGER NOT NULL,
    government_type TEXT NOT NULL,
    relations_with_ri TEXT NOT NULL,
    description TEXT
);

-- 13. TABEL PERJANJIAN DIPLOMASI INTERNASIONAL (DIPLOMATIC_TREATIES)
CREATE TABLE IF NOT EXISTS diplomatic_treaties (
    id TEXT PRIMARY KEY,
    world_region_id TEXT NOT NULL,
    treaty_type TEXT NOT NULL,    -- 'trade', 'embassy', 'defense', 'cultural'
    title TEXT NOT NULL,
    description TEXT,
    status TEXT DEFAULT 'active',
    signed_by_user_id TEXT,
    signed_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (world_region_id) REFERENCES world_regions(id) ON DELETE CASCADE,
    FOREIGN KEY (signed_by_user_id) REFERENCES users(id) ON DELETE SET NULL
);

-- 14. TABEL AUDIT & CATATAN LOG AKTIVITAS (GAME_LOGS)
CREATE TABLE IF NOT EXISTS game_logs (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id TEXT,
    action_type TEXT NOT NULL,    -- 'login', 'work', 'train', 'vote', 'bill_propose', 'diplomacy'
    details TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE SET NULL
);

-- 15. TABEL INVENTARIS SUMBER DAYA PEMAIN (USER_INVENTORY)
CREATE TABLE IF NOT EXISTS user_inventory (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id TEXT NOT NULL,
    item_id TEXT NOT NULL,
    quantity INTEGER DEFAULT 0,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(user_id, item_id),
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- 16. TABEL PASAR BURSA P2P ANTAR-PEMAIN (MARKET_LISTINGS)
CREATE TABLE IF NOT EXISTS market_listings (
    id TEXT PRIMARY KEY,
    seller_id TEXT NOT NULL,
    seller_name TEXT NOT NULL,
    item_id TEXT NOT NULL,
    item_name TEXT NOT NULL,
    unit TEXT NOT NULL,
    quantity INTEGER NOT NULL,
    price_per_unit REAL NOT NULL,
    total_price REAL NOT NULL,
    status TEXT DEFAULT 'active', -- 'active', 'sold', 'cancelled'
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (seller_id) REFERENCES users(id) ON DELETE CASCADE
);

-- ==================== INDEKS UNTUK PERFORMA QUERY CEPAT ====================
CREATE INDEX IF NOT EXISTS idx_users_username ON users(username);
CREATE INDEX IF NOT EXISTS idx_users_residence ON users(residence_region_id);
CREATE INDEX IF NOT EXISTS idx_regions_island ON regions(island);
CREATE INDEX IF NOT EXISTS idx_bills_status ON bills(status);
CREATE INDEX IF NOT EXISTS idx_articles_created ON articles(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_world_regions_sector ON world_regions(sector);
CREATE INDEX IF NOT EXISTS idx_market_listings_status ON market_listings(status, item_id);

