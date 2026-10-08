-- ==============================================================================
-- 🏛️ DATABASE EXPORT: REPUBLIC POLITIC (MYSQL / MARIADB / XAMPP)
-- Engine: MySQL 8.x / MariaDB 10.x Compatible
-- Skema Tabel Relasional Lengkap & Seed Data Game Geopolitik
-- ==============================================================================

CREATE DATABASE IF NOT EXISTS `republic_politik` CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE `republic_politik`;

-- ==============================================================================
-- DATABASE SCHEMA: WEB REPUBLIC POLITIK (REPUBLIK NUSANTARA)
-- Engine: MySQL 8.x / MariaDB 10.x Compatible
-- ==============================================================================




-- 1. TABEL PENGGUNA & KARAKTER POLITIK (USERS)
CREATE TABLE IF NOT EXISTS users (
    id VARCHAR(64) PRIMARY KEY,
    username VARCHAR(64) UNIQUE NOT NULL,
    email VARCHAR(128) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    full_name VARCHAR(128) NOT NULL,
    title VARCHAR(128) DEFAULT 'Kader Muda Pergerakan',
    position VARCHAR(128) DEFAULT 'Warga Negara Berdaulat',
    level INT DEFAULT 1,
    exp INT DEFAULT 0,
    max_exp INT DEFAULT 1000,
    energy INT DEFAULT 100,
    max_energy INT DEFAULT 100,
    money DOUBLE DEFAULT 75000000.0,
    gold INT DEFAULT 45,
    party_id VARCHAR(64),
    residence_region_id VARCHAR(64) DEFAULT 'dki',
    perk_charisma INT DEFAULT 10,
    perk_intellect INT DEFAULT 10,
    perk_endurance INT DEFAULT 10,
    perk_connections INT DEFAULT 10,
    voted_president_id VARCHAR(64),
    role VARCHAR(32) DEFAULT 'player',
    status VARCHAR(32) DEFAULT 'active',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- 2. TABEL PARTAI POLITIK (PARTIES)
CREATE TABLE IF NOT EXISTS parties (
    id VARCHAR(64) PRIMARY KEY,
    name VARCHAR(128) NOT NULL,
    short_name VARCHAR(32) NOT NULL,
    leader VARCHAR(128) NOT NULL,
    ideology VARCHAR(128) NOT NULL,
    color VARCHAR(32) NOT NULL,
    seats INT DEFAULT 0,
    funds DOUBLE DEFAULT 500000000.0,
    members_count INT DEFAULT 1,
    description TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- 3. TABEL 38 PROVINSI REPUBLIK INDONESIA (REGIONS)
CREATE TABLE IF NOT EXISTS regions (
    id VARCHAR(64) PRIMARY KEY,
    name VARCHAR(128) NOT NULL,
    capital VARCHAR(128) NOT NULL,
    island VARCHAR(64) NOT NULL,
    population BIGINT NOT NULL,
    budget DOUBLE NOT NULL,
    dominant_party_id VARCHAR(64),
    support_rate INT DEFAULT 75,
    resource VARCHAR(128) NOT NULL,
    tax_rate DOUBLE DEFAULT 10.0,
    infrastructure_level INT DEFAULT 1,
    defense_power INT DEFAULT 60,
    lat DOUBLE NOT NULL,
    lng DOUBLE NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- 4. TABEL RANCANGAN UNDANG-UNDANG PARLEMEN (BILLS)
CREATE TABLE IF NOT EXISTS bills (
    id VARCHAR(64) PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    description TEXT NOT NULL,
    category VARCHAR(64) NOT NULL,
    author_id VARCHAR(64) NOT NULL,
    author_name VARCHAR(128) NOT NULL,
    party_id VARCHAR(64),
    yes_votes INT DEFAULT 0,
    no_votes INT DEFAULT 0,
    status VARCHAR(32) DEFAULT 'voting',
    impact_summary TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- 5. TABEL PENGAMBILAN SUARA RUU (BILL_VOTES)
CREATE TABLE IF NOT EXISTS bill_votes (
    id INT AUTO_INCREMENT PRIMARY KEY,
    bill_id VARCHAR(64) NOT NULL,
    user_id VARCHAR(64) NOT NULL,
    vote VARCHAR(16) NOT NULL,
    voted_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE KEY uq_bill_user (bill_id, user_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- 6. TABEL UNDANG-UNDANG NASIONAL YANG TELAH DISAHKAN (PASSED_LAWS)
CREATE TABLE IF NOT EXISTS passed_laws (
    id VARCHAR(64) PRIMARY KEY,
    bill_id VARCHAR(64),
    title VARCHAR(255) NOT NULL,
    category VARCHAR(64) NOT NULL,
    description TEXT NOT NULL,
    national_effects LONGTEXT,
    passed_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- 7. TABEL PEMILU RAYA NASIONAL (ELECTIONS)
CREATE TABLE IF NOT EXISTS elections (
    id VARCHAR(64) PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    type VARCHAR(64) NOT NULL,
    term VARCHAR(64) NOT NULL,
    status VARCHAR(32) DEFAULT 'active',
    start_time TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    end_time DATETIME NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- 8. TABEL KANDIDAT CALON PRESIDEN & WAPRES (CANDIDATES)
CREATE TABLE IF NOT EXISTS candidates (
    id VARCHAR(64) PRIMARY KEY,
    election_id VARCHAR(64) NOT NULL,
    name VARCHAR(128) NOT NULL,
    running_mate VARCHAR(128),
    party_id VARCHAR(64),
    votes INT DEFAULT 0,
    vision TEXT,
    promises LONGTEXT,
    color VARCHAR(32) DEFAULT '#fbbf24'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- 9. TABEL SURAT SUARA PEMILU (ELECTION_VOTES)
CREATE TABLE IF NOT EXISTS election_votes (
    id INT AUTO_INCREMENT PRIMARY KEY,
    election_id VARCHAR(64) NOT NULL,
    candidate_id VARCHAR(64) NOT NULL,
    user_id VARCHAR(64) NOT NULL,
    voted_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE KEY uq_election_user (election_id, user_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- 10. TABEL KORAN & ARTIKEL MEDIA PERS (ARTICLES)
CREATE TABLE IF NOT EXISTS articles (
    id VARCHAR(64) PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    content LONGTEXT NOT NULL,
    category VARCHAR(64) NOT NULL,
    author_id VARCHAR(64) NOT NULL,
    author_name VARCHAR(128) NOT NULL,
    author_title VARCHAR(128),
    newspaper_name VARCHAR(128) DEFAULT 'Harian Nusantara',
    views INT DEFAULT 0,
    upvotes INT DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- 11. TABEL APRESIASI / DUKUNGAN ARTIKEL (ARTICLE_UPVOTES)
CREATE TABLE IF NOT EXISTS article_upvotes (
    id INT AUTO_INCREMENT PRIMARY KEY,
    article_id VARCHAR(64) NOT NULL,
    user_id VARCHAR(64) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE KEY uq_article_user (article_id, user_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- 12. TABEL KAWASAN GEOPOLITIK DUNIA (WORLD_REGIONS)
CREATE TABLE IF NOT EXISTS world_regions (
    id VARCHAR(64) PRIMARY KEY,
    iso2 VARCHAR(8),
    iso3 VARCHAR(8),
    name VARCHAR(128) NOT NULL,
    capital VARCHAR(128) NOT NULL,
    flag VARCHAR(16) NOT NULL,
    sector VARCHAR(64) NOT NULL,
    population DOUBLE NOT NULL,
    bloc VARCHAR(128) NOT NULL,
    diplomatic_status VARCHAR(128) NOT NULL,
    dominant_resource VARCHAR(128) NOT NULL,
    military_power INT NOT NULL,
    government_type VARCHAR(128) NOT NULL,
    relations_with_ri VARCHAR(128) NOT NULL,
    description TEXT
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- 13. TABEL PERJANJIAN DIPLOMASI INTERNASIONAL (DIPLOMATIC_TREATIES)
CREATE TABLE IF NOT EXISTS diplomatic_treaties (
    id VARCHAR(64) PRIMARY KEY,
    world_region_id VARCHAR(64) NOT NULL,
    treaty_type VARCHAR(64) NOT NULL,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    status VARCHAR(32) DEFAULT 'active',
    signed_by_user_id VARCHAR(64),
    signed_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- 14. TABEL AUDIT & CATATAN LOG AKTIVITAS (GAME_LOGS)
CREATE TABLE IF NOT EXISTS game_logs (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id VARCHAR(64),
    action_type VARCHAR(64) NOT NULL,
    details TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- ==============================================================================
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
('aceh', 'Aceh', 'Banda Aceh', 'sumatera', 5000000, 20000000000, 'pdin', 75, 'Gas Alam & Kopi Gayo', 10.0, 1, 60, 5.5483, 95.3238),
('sumut', 'Sumatera Utara', 'Medan', 'sumatera', 5000000, 20000000000, 'pdin', 75, 'Kelapa Sawit & Perdagangan', 10.0, 1, 60, 3.5952, 98.6722),
('sumbar', 'Sumatera Barat', 'Padang', 'sumatera', 5000000, 20000000000, 'pdin', 75, 'Semen, Pertanian & UMKM', 10.0, 1, 60, -0.9471, 100.4172),
('riau', 'Riau', 'Pekanbaru', 'sumatera', 5000000, 20000000000, 'pdin', 75, 'Minyak Bumi & Sawit', 10.0, 1, 60, 0.5071, 101.4478),
('kepri', 'Kepulauan Riau', 'Tanjungpinang / Batam', 'sumatera', 5000000, 20000000000, 'pdin', 75, 'Manufaktur Elektronik & Maritim Malaka', 10.0, 1, 60, 0.9167, 104.45),
('jambi', 'Jambi', 'Kota Jambi', 'sumatera', 5000000, 20000000000, 'pdin', 75, 'Minyak Bumi, Batubara & Karet', 10.0, 1, 60, -1.6101, 103.6131),
('bengkulu', 'Bengkulu', 'Kota Bengkulu', 'sumatera', 5000000, 20000000000, 'pdin', 75, 'Batubara & Perikanan Samudera', 10.0, 1, 60, -3.8004, 102.2655),
('sumsel', 'Sumatera Selatan', 'Palembang', 'sumatera', 5000000, 20000000000, 'pdin', 75, 'Batubara, Karet & Gas', 10.0, 1, 60, -2.9909, 104.7565),
('babel', 'Kep. Bangka Belitung', 'Pangkalpinang', 'sumatera', 5000000, 20000000000, 'pdin', 75, 'Timah Terbesar Dunia & Lada Putih', 10.0, 1, 60, -2.1333, 106.1167),
('lampung', 'Lampung', 'Bandar Lampung', 'sumatera', 5000000, 20000000000, 'pdin', 75, 'Pangan, Tebu & Pelabuhan Bakauheni', 10.0, 1, 60, -5.45, 105.2667),
('banten', 'Banten', 'Serang', 'jawa', 5000000, 20000000000, 'pdin', 75, 'Baja Krakatau & Pelabuhan Merak', 10.0, 1, 60, -6.1104, 106.164),
('dki', 'DKI Jakarta', 'Jakarta Pusat', 'jawa', 5000000, 20000000000, 'pdin', 75, 'Finansial & Korporasi Global', 10.0, 1, 60, -6.2088, 106.8456),
('jabar', 'Jawa Barat', 'Bandung', 'jawa', 5000000, 20000000000, 'pdin', 75, 'Manufaktur, Otomotif & Tekstil', 10.0, 1, 60, -6.9175, 107.6191),
('jateng', 'Jawa Tengah', 'Semarang', 'jawa', 5000000, 20000000000, 'pdin', 75, 'Pangan Nasional & Kawasan Industri', 10.0, 1, 60, -7.0051, 110.4381),
('diy', 'DI Yogyakarta', 'Yogyakarta', 'jawa', 5000000, 20000000000, 'pdin', 75, 'Pendidikan Tinggi, Budaya & Wisata', 10.0, 1, 60, -7.7956, 110.3695),
('jatim', 'Jawa Timur', 'Surabaya', 'jawa', 5000000, 20000000000, 'pdin', 75, 'Industri Berat, Galangan Kapal & Pangan', 10.0, 1, 60, -7.2575, 112.7521),
('bali', 'Bali', 'Denpasar', 'nusa_tenggara', 5000000, 20000000000, 'pdin', 75, 'Pariwisata Internasional & Seni Budaya', 10.0, 1, 60, -8.6705, 115.2126),
('ntb', 'Nusa Tenggara Barat', 'Mataram', 'nusa_tenggara', 5000000, 20000000000, 'pdin', 75, 'Tambang Tembaga & Mandalika Sport Tourism', 10.0, 1, 60, -8.5833, 116.1167),
('ntt', 'Nusa Tenggara Timur', 'Kupang', 'nusa_tenggara', 5000000, 20000000000, 'pdin', 75, 'Peternakan, Labuan Bajo & Energi Terbarukan', 10.0, 1, 60, -10.1772, 123.607),
('kalbar', 'Kalimantan Barat', 'Pontianak', 'kalimantan', 5000000, 20000000000, 'pdin', 75, 'Bauksit, Smelter & Perbatasan Serawak', 10.0, 1, 60, -0.0263, 109.3425),
('kalteng', 'Kalimantan Tengah', 'Palangka Raya', 'kalimantan', 5000000, 20000000000, 'pdin', 75, 'Hutan Konservasi & Sawit', 10.0, 1, 60, -2.2161, 113.9139),
('kalsel', 'Kalimantan Selatan', 'Banjarbaru / Banjarmasin', 'kalimantan', 5000000, 20000000000, 'pdin', 75, 'Batubara, Intan & Pelabuhan Logistik', 10.0, 1, 60, -3.3194, 114.5908),
('kaltim', 'Kalimantan Timur (IKN)', 'IKN Nusantara / Samarinda', 'kalimantan', 5000000, 20000000000, 'pdin', 75, 'Ibu Kota Nusantara (IKN), Gas & Batubara', 10.0, 1, 60, -0.5022, 117.1536),
('kaltara', 'Kalimantan Utara', 'Tanjung Selor', 'kalimantan', 5000000, 20000000000, 'pdin', 75, 'Kawasan Industri Hijau (KIPI) & Hidroelektrik', 10.0, 1, 60, 2.8427, 117.3644),
('sulut', 'Sulawesi Utara', 'Manado', 'sulawesi', 5000000, 20000000000, 'pdin', 75, 'Pintu Gerbang Pasifik & Perikanan Tuna', 10.0, 1, 60, 1.4748, 124.8421),
('gorontalo', 'Gorontalo', 'Kota Gorontalo', 'sulawesi', 5000000, 20000000000, 'pdin', 75, 'Jagung Nasional & Perikanan Teluk Tomini', 10.0, 1, 60, 0.5435, 123.0568),
('sulteng', 'Sulawesi Tengah', 'Palu / Morowali', 'sulawesi', 5000000, 20000000000, 'pdin', 75, 'Hilirisasi Nikel & Smelter Morowali', 10.0, 1, 60, -0.9003, 119.878),
('sulbar', 'Sulawesi Barat', 'Mamuju', 'sulawesi', 5000000, 20000000000, 'pdin', 75, 'Kakao, Kelapa Sawit & Selat Makassar', 10.0, 1, 60, -2.677, 118.887),
('sulsel', 'Sulawesi Selatan', 'Makassar', 'sulawesi', 5000000, 20000000000, 'pdin', 75, 'Hub Maritim Timur, Nikel Soroako & Pangan', 10.0, 1, 60, -5.1477, 119.4327),
('sultra', 'Sulawesi Tenggara', 'Kendari', 'sulawesi', 5000000, 20000000000, 'pdin', 75, 'Cadangan Bijih Nikel Terbesar Dunia', 10.0, 1, 60, -3.9985, 122.5126),
('maluku', 'Maluku', 'Ambon', 'maluku', 5000000, 20000000000, 'pdin', 75, 'Lumbung Ikan Nasional & Blok Masela', 10.0, 1, 60, -3.6547, 128.1906),
('malut', 'Maluku Utara', 'Sofifi / Weda Bay', 'maluku', 5000000, 20000000000, 'pdin', 75, 'Kawasan Industri Nikel Weda Bay & Rempah', 10.0, 1, 60, 0.73, 127.56),
('papua', 'Papua (Induk)', 'Jayapura', 'papua', 5000000, 20000000000, 'pdin', 75, 'Pusat Maritim Pasifik & Perbatasan PNG', 10.0, 1, 60, -2.5916, 140.669),
('papua_barat_induk', 'Papua Barat', 'Manokwari', 'papua', 5000000, 20000000000, 'pdin', 75, 'Gas Alam Cair Tangguh & Konservasi Hayati', 10.0, 1, 60, -0.8615, 134.062),
('papua_barat', 'Papua Barat Daya', 'Sorong / Raja Ampat', 'papua', 5000000, 20000000000, 'pdin', 75, 'Minyak Kasim & Pariwisata Bahari Raja Ampat', 10.0, 1, 60, -0.8762, 131.2558),
('papua_tengah', 'Papua Tengah', 'Nabire / Grasberg', 'papua', 5000000, 20000000000, 'pdin', 75, 'Tambang Emas & Tembaga Terbesar Grasberg', 10.0, 1, 60, -3.3667, 135.4833),
('papua_selatan', 'Papua Selatan', 'Merauke', 'papua', 5000000, 20000000000, 'pdin', 75, 'Kawasan Pangan Nasional (Food Estate) & Perbatasan', 10.0, 1, 60, -8.4991, 140.4011),
('papua_pegunungan', 'Papua Pegunungan', 'Wamena', 'papua', 5000000, 20000000000, 'pdin', 75, 'Kopi Arabika Wamena & Hasil Bumi Lembah Baliem', 10.0, 1, 60, -4.0984, 138.9439)
ON DUPLICATE KEY UPDATE name=VALUES(name);

-- 4. DATA RANCANGAN UNDANG-UNDANG DPR RI (KOSONG - MURNI DIAJUKAN OLEH PEMAIN DI PARLEMEN)


-- 5. DATA UNDANG-UNDANG NASIONAL YANG TELAH DISAHKAN
INSERT INTO passed_laws (id, title, category, description, national_effects) VALUES
('law-ikn-transfer', 'UU Pemindahan Ibu Kota Negara ke Nusantara (IKN)', 'Tata Negara', 'Menetapkan IKN Nusantara di Penajam Paser Utara sebagai Pusat Pemerintahan Politik dan DKI Jakarta sebagai Pusat Finansial Global.', '{}'),
('law-bpjs-universal', 'UU Jaminan Pelayanan Medis Semesta (BPJS Rakyat)', 'Kesehatan', 'Mewajibkan negara menanggung seluruh biaya rawat inap dan obat esensial untuk seluruh warga negara Republik.', '{}'),
('law-threshold-parliament', 'UU Ambang Batas Parlemen (Parliamentary Threshold 4%)', 'Pemilu & Parlemen', 'Partai politik harus memperoleh minimal 4.0% suara nasional untuk memperoleh kursi di Parlemen.', '{}')
ON DUPLICATE KEY UPDATE title=VALUES(title);

-- 6. DATA PEMILU & KANDIDAT PRESIDEN
INSERT INTO elections (id, title, type, term, status, end_time) VALUES
('pemilu-2026', 'Pemilihan Presiden & Wakil Presiden Republik Nusantara', 'presidential', '2026-2031', 'active', DATE_ADD(NOW(), INTERVAL 3 DAY))
ON DUPLICATE KEY UPDATE title=VALUES(title);

INSERT INTO candidates (id, election_id, name, running_mate, party_id, votes, vision, promises, color) VALUES
('cand-1', 'pemilu-2026', 'Jend. (Purn) Prabowo Kusumo & Gibran Rakabumi', '', 'pdin', 0, '', '[]', '#f59e0b'),
('cand-2', 'pemilu-2026', 'Ganjar Pranowo & Mahfud M.D.', '', 'pdin', 0, '', '[]', '#dc2626'),
('cand-3', 'pemilu-2026', 'Anies Baswedan & Muhaimin Iskandar', '', 'pdin', 0, '', '[]', '#f97316')
ON DUPLICATE KEY UPDATE name=VALUES(name);

-- 7. DATA KORAN PERS NASIONAL
INSERT INTO articles (id, title, content, category, author_id, author_name, author_title, newspaper_name, views, upvotes) VALUES
('art-1', 'Warta Parlemen', 'Gedung Nusantara Parlemen bergemuruh saat fraksi oposisi mempertanyakan lonjakan anggaran belanja radar pertahanan. Sementara itu, kubu pemerintah menegaskan bahwa kedaulatan laut nusantara tidak dapat dikompromikan.', 'Parlemen', 'usr-satria', 'Redaksi Harian Garuda', '', 'Harian Nusantara', 100, 840),
('art-2', 'Warta Parlemen', 'Kementerian Perindustrian mengumumkan surplus perdagangan kuartal ini didorong oleh 14 smelter baru yang beroperasi penuh di Morowali dan Weda Bay. Partai Teknokrat mendorong dividen diarahkan untuk beasiswa riset.', 'Ekonomi', 'usr-satria', 'Warta Ekonomi Republik', '', 'Harian Nusantara', 100, 840),
('art-3', 'Warta Parlemen', 'Simulasi Pilpres terbaru menunjukkan elektabilitas tiga poros utama masih berada di rentang 28% - 35%. Suara pemilih di Jawa Tengah, Jawa Barat, dan Jawa Timur diprediksi menjadi medan tempur penentu kemenangan mutlak.', 'Pemilu', 'usr-satria', 'Lembaga Indikator Politik Nusantara', '', 'Harian Nusantara', 100, 840)
ON DUPLICATE KEY UPDATE content=VALUES(content);

-- 8. DATA KAWASAN GEOPOLITIK DUNIA
INSERT INTO world_regions (id, iso2, iso3, name, capital, flag, sector, population, bloc, diplomatic_status, dominant_resource, military_power, government_type, relations_with_ri, description) VALUES
('malaysia', 'MY', 'MYS', 'Federasi Malaysia', 'Kuala Lumpur', '🇲🇾', 'asean', 0, 'ASEAN • Non-Blok', 'Mitra Serumpun & Sekutu', 'Minyak Mentah, Sawit & Semikonduktor', 76, 'Monarki Konstitusional Federal', '+88% (Sangat Harmonis)', 'Negara tetangga terdekat di Selat Malaka & Kalimantan Utara. Mitra kunci perdagangan maritim Nusantara.'),
('singapore', 'SG', 'SGP', 'Republik Singapura', 'Singapura', '🇸🇬', 'asean', 0, 'ASEAN • Global Hub', 'Mitra Finansial Utama', 'Pusat Keuangan Global & Kilang Maritim', 84, 'Republik Parlementer', '+85% (Kemitraan Strategis)', 'Pusat logistik dan keuangan terbesar di Asia Tenggara dengan armada pertahanan modern canggih.'),
('philippines', 'PH', 'PHL', 'Republik Filipina', 'Manila', '🇵🇭', 'asean', 0, 'ASEAN • Pasifik', 'Mitra Keamanan Maritim', 'Nikel, Tembaga & Jasa Teknologi', 72, 'Republik Presidensial', '+80% (Bilateral Stabil)', 'Kepulauan tetangga di utara Sulawesi. Bekerja sama dalam patroli perairan Laut Sulawesi & Sulu.'),
('thailand', 'TH', 'THA', 'Kerajaan Thailand', 'Bangkok', '🇹🇭', 'asean', 0, 'ASEAN • Lumbung Pangan', 'Mitra Perdagangan Pangan', 'Beras, Otomotif & Karet Alam', 78, 'Monarki Konstitusional', '+82% (Mitra Dagang Aktif)', 'Kekuatan ekonomi daratan Asia Tenggara, lumbung pangan dan pusat manufaktur otomotif regional.'),
('vietnam', 'VN', 'VNM', 'Republik Sosialis Vietnam', 'Hanoi', '🇻🇳', 'asean', 0, 'ASEAN • Industri Manufaktur', 'Mitra Strategis Komprehensif', 'Elektronika, Tekstil & Minyak Bumi', 83, 'Republik Sosialis Satu Partai', '+84% (Sangat Erat)', 'Kekuatan militer darat teruji dan pusat manufaktur yang berkembang sangat pesat di Laut Cina Selatan.'),
('brunei', 'BN', 'BRN', 'Negara Brunei Darussalam', 'Bandar Seri Begawan', '🇧🇳', 'asean', 0, 'ASEAN • Petrodolar Serumpun', 'Sahabat Serumpun', 'Minyak Bumi & Gas Alam Cair (LNG)', 65, 'Monarki Absolut Islam Melayu', '+90% (Sangat Harmonis)', 'Kesultanan kaya minyak di pantai barat laut pulau Kalimantan yang bertetangga erat dengan Indonesia.'),
('timor_leste', 'TL', 'TLS', 'Republik Demokratik Timor Leste', 'Dili', '🇹🇱', 'asean', 0, 'Calon Anggota ASEAN • Pasifik', 'Tetangga Perbatasan Darat', 'Minyak Lepas Pantai & Kopi Organik', 55, 'Republik Semi-Presidensial', '+94% (Persaudaraan & Rekonsiliasi Erat)', 'Berbatasan darat langsung dengan Nusa Tenggara Timur (NTT). Indonesia adalah pendukung utama keanggotaan penuh ASEAN.'),
('papua_new_guinea', 'PG', 'PNG', 'Negara Independen Papua Nugini', 'Port Moresby', '🇵🇬', 'africa_oceania', 0, 'Pasifik • Melanesian Spearhead Group', 'Mitra Perbatasan Darat Timur', 'Emas, Gas Alam & Hasil Hutan', 62, 'Monarki Konstitusional Parlementer', '+86% (Stabilitas Perbatasan)', 'Berbatasan darat langsung sepanjang 820 km di Pulau Papua dari Jayapura hingga Merauke.'),
('australia', 'AU', 'AUS', 'Persemakmuran Australia', 'Canberra', '🇦🇺', 'africa_oceania', 0, 'AUKUS • Pasifik Selatan', 'Tetangga Strategis Selatan', 'Uranium, Gas Alam, Batubara & Gandum', 88, 'Monarki Konstitusional Parlementer', '+78% (Dinamis & Konstruktif)', 'Kekuatan benua selatan yang berbatasan laut langsung dengan perairan Nusa Tenggara, Bali, dan Papua Selatan.'),
('new_zealand', 'NZ', 'NZL', 'Selandia Baru', 'Wellington', '🇳🇿', 'africa_oceania', 0, 'Five Eyes • Pasifik', 'Mitra Peternakan & Energi Hijau', 'Susu, Daging, Panas Bumi & Pariwisata', 70, 'Monarki Konstitusional Parlementer', '+80% (Bilateral Erat)', 'Negara kepulauan modern di Pasifik Barat Daya, penyuplai utama produk susu olahan ke pasar Indonesia.'),
('china', 'CN', 'CHN', 'Republik Rakyat Tiongkok', 'Beijing', '🇨🇳', 'east_asia', 0, 'BRICS • Superpower', 'Mitra Dagang & Investasi Terbesar', 'Manufaktur Raksasa, Rare Earth & Baja', 98, 'Republik Sosialis', '+81% (Investasi Tinggi)', 'Kekuatan ekonomi dan manufaktur global. Investor infrastruktur dan pengolah nikel terbesar di Nusantara.'),
('japan', 'JP', 'JPN', 'Negara Jepang', 'Tokyo', '🇯🇵', 'east_asia', 0, 'G7 • Aliansi Pasifik', 'Mitra Teknologi & Pembangunan', 'Robotika, Otomotif & Teknologi Maritim', 91, 'Monarki Konstitusional Parlementer', '+86% (Kemitraan Erat)', 'Pionir industri teknologi presisi dan armada maritim modern di kawasan Pasifik Utara.'),
('south_korea', 'KR', 'KOR', 'Republik Korea (Korea Selatan)', 'Seoul', '🇰🇷', 'east_asia', 0, 'G20 • Aliansi Industri', 'Mitra Dirgantara & Baterai EV', 'Baterai Listrik, Semikonduktor & Alutsista', 93, 'Republik Presidensial', '+85% (Proyek Jet Tempur KFX/IFX)', 'Mitra bersama dalam pengembangan pesawat tempur generasi 4.5 dan ekosistem rantai pasok EV nasional.'),
('north_korea', 'KP', 'PRK', 'Republik Demokratik Rakyat Korea', 'Pyongyang', '🇰🇵', 'east_asia', 0, 'Non-Blok Historis • Kekuatan Nuklir', 'Hubungan Diplomatik Sejarah (Soekarno)', 'Batubara, Mineral & Teknologi Rudal', 86, 'Republik Sosialis Juche', '+75% (Hubungan Sejarah Bunga Kimilsungia)', 'Memiliki hubungan diplomatik unik bersejarah dengan Indonesia sejak era Presiden Soekarno.'),
('saudi_arabia', 'SA', 'SAU', 'Kerajaan Arab Saudi', 'Riyadh', '🇸🇦', 'mid_east_south', 0, 'OPEC • BRICS • Liga Arab', 'Mitra Energi & Spiritual Global', 'Minyak Mentah Cadangan Dunia & Petrokimia', 82, 'Monarki Absolut', '+92% (Hubungan Istimewa Haji & Energi)', 'Raksasa energi global pemegang kendali pasar minyak dunia serta pusat ziarah spiritual umat Islam dunia.'),
('uae', 'AE', 'ARE', 'Uni Emirat Arab', 'Abu Dhabi', '🇦🇪', 'mid_east_south', 0, 'OPEC • Sovereign Wealth Hub', 'Investor Strategis Ibu Kota Baru', 'Finansial Global, Penerbangan & Energi Hijau', 79, 'Federasi Monarki', '+90% (Investor Kunci IKN Nusantara)', 'Pusat perdagangan dan investasi multinasional di Teluk Persia dengan sovereign wealth fund raksasa.'),
('india', 'IN', 'IND', 'Republik India', 'New Delhi', '🇮🇳', 'mid_east_south', 0, 'BRICS • Samudra Hindia', 'Mitra Maritim Samudra Hindia', 'Teknologi Informasi, Farmasi & Baja', 95, 'Republik Parlementer Federal', '+83% (Perjanjian Sabang-Andaman)', 'Kekuatan demografi terbesar di dunia, berbatasan laut di ujung barat Sabang via Kepulauan Andaman & Nikobar.'),
('turkey', 'TR', 'TUR', 'Republik Türkiye', 'Ankara', '🇹🇷', 'mid_east_south', 0, 'NATO • Eurasia Bridge', 'Mitra Industri Pertahanan', 'Drone Tempur (UAV), Baja & Pertanian', 89, 'Republik Presidensial', '+88% (Mitra Alutsista & Kapal Perang)', 'Jembatan geopolitik antara Eropa dan Asia dengan teknologi drone tempur dan alutsista terdepan.'),
('iran', 'IR', 'IRN', 'Republik Islam Iran', 'Tehran', '🇮🇷', 'mid_east_south', 0, 'BRICS • Selat Hormuz', 'Mitra Energi & Gerakan Non-Blok', 'Minyak, Gas, Drone & Teknologi Nuklir', 85, 'Teokrasi Republik Islam', '+79% (Hubungan Perdagangan Netral)', 'Penguasa perairan strategis Selat Hormuz dengan pengaruh geopolitik kuat di Timur Tengah.'),
('russia', 'RU', 'RUS', 'Federasi Rusia', 'Moskow', '🇷🇺', 'europe', 0, 'BRICS • Superpower Eurasia', 'Mitra Strategis Alutsista & Nuklir', 'Gas Bumi, Minyak, Uranium & Gandum', 97, 'Republik Semi-Presidensial Federal', '+83% (Hubungan Bersejarah Kuat)', 'Negara dengan daratan terluas di dunia, memiliki cadangan energi fosil dan persenjataan nuklir terbesar.'),
('united_kingdom', 'GB', 'GBR', 'Kerajaan Bersatu (Inggris / UK)', 'London', '🇬🇧', 'europe', 0, 'NATO • G7 • Dewan Keamanan PBB', 'Mitra Finansial & Maritim Global', 'Jasa Keuangan, Teknologi Kedirgantaraan', 90, 'Monarki Konstitusional Parlementer', '+78% (Mitra Maritim & Pendidikan)', 'Pusat moneter global City of London dan kekuatan diplomasi internasional pemegang hak veto PBB.'),
('germany', 'DE', 'DEU', 'Republik Federal Jerman', 'Berlin', '🇩🇪', 'europe', 0, 'Uni Eropa • G7 • Pemimpin Ekonomi', 'Mitra Industri Mesin & Riset', 'Teknik Presisi, Otomotif & Energi Terbarukan', 85, 'Republik Federal Parlementer', '+82% (Kemitraan Teknologi Hijau)', 'Motor ekonomi terkuat di Benua Eropa dengan standar keunggulan manufaktur presisi industri 4.0.'),
('france', 'FR', 'FRA', 'Republik Prancis', 'Paris', '🇫🇷', 'europe', 0, 'Uni Eropa • NATO • Veto PBB', 'Pemasok Jet Tempur Rafale & Kapal Selam', 'Dirgantara (Airbus/Dassault), Nuklir & Mewah', 92, 'Republik Semi-Presidensial', '+87% (Kerjasama Strategis Pertahanan RI)', 'Kekuatan diplomasi dan industri alutsista terkemuka Eropa, mitra pengadaan jet tempur generasi 4.5 Rafale RI.'),
('netherlands', 'NL', 'NLD', 'Kerajaan Belanda', 'Amsterdam', '🇳🇱', 'europe', 0, 'Uni Eropa • NATO • Gerbang Eropa', 'Pintu Gerbang Ekspor Sawit ke Eropa', 'Pelabuhan Rotterdam, Semikonduktor (ASML) & Maritim', 79, 'Monarki Konstitusional Parlementer', '+83% (Hubungan Sejarah & Kerjasama Hukum)', 'Pusat logistik pelabuhan terbesar di Eropa (Rotterdam) dan produsen mesin semikonduktor paling canggih di dunia.'),
('usa', 'US', 'USA', 'Amerika Serikat (USA)', 'Washington D.C.', '🇺🇸', 'americas', 0, 'NATO • G7 • Superpower Ekonomi', 'Mitra Strategis Komprehensif', 'Dolar AS, Teknologi Digital (Silicon Valley) & Alutsista', 100, 'Republik Presidensial Federal Konstitusional', '+80% (Kemitraan Bebas Aktif)', 'Kekuatan ekonomi dan pertahanan global terbesar di dunia dengan jangkauan militer lintas samudra.'),
('canada', 'CA', 'CAN', 'Kanada', 'Ottawa', '🇨🇦', 'americas', 0, 'G7 • NATO • Persemakmuran', 'Mitra Perjanjian Dagang CEPA', 'Nikel, Gandum, Minyak & Potasium', 80, 'Monarki Konstitusional Parlementer Federal', '+81% (Perdagangan Komoditas)', 'Negara terluas kedua di dunia dengan cadangan mineral kritis dan hasil hutan berlimpah.'),
('brazil', 'BR', 'BRA', 'Republik Federatif Brasil', 'Brasilia', '🇧🇷', 'americas', 0, 'BRICS • Pemimpin Amerika Latin', 'Mitra Hutan Hujan & Agrikultur', 'Kedelai, Daging, Bijih Besi & Biofuel', 81, 'Republik Presidensial Federal', '+83% (Aliansi Negara Hutan Hujan Tropis)', 'Pemegang paru-paru dunia Amazon, bersekutu dengan Indonesia dalam diplomasi iklim dan pasar komoditas.'),
('argentina', 'AR', 'ARG', 'Republik Argentina', 'Buenos Aires', '🇦🇷', 'americas', 0, 'G20 • Segitiga Litium', 'Mitra Pangan & Cadangan Litium', 'Litium, Kedelai, Gandum & Daging Sapi', 73, 'Republik Presidensial Federal', '+80% (Mitra Litium Baterai EV)', 'Bagian dari Segitiga Litium dunia di Amerika Selatan, mitra strategis pengembangan bahan baku baterai.'),
('south_africa', 'ZA', 'ZAF', 'Republik Afrika Selatan', 'Pretoria', '🇿🇦', 'africa_oceania', 0, 'BRICS • G20 • Samudra Atlantik-Hindia', 'Mitra Gerakan Non-Blok', 'Platinum, Emas, Berlian & Batubara', 74, 'Republik Parlementer', '+84% (Diplomasi Konferensi Asia Afrika)', 'Raksasa tambang mineral berharga Afrika, memiliki keterikatan sejarah diplomasi kuat dengan Indonesia sejak KAA 1955.'),
('egypt', 'EG', 'EGY', 'Republik Arab Mesir', 'Kairo', '🇪🇬', 'africa_oceania', 0, 'BRICS • Terusan Suez • Liga Arab', 'Negara Pertama Pengakui Kemerdekaan RI', 'Terusan Suez, Gas Alam & Pariwisata Kuno', 87, 'Republik Presidensial', '+95% (Sekutu Historis Sejati)', 'Penguasa Terusan Suez rute pelayaran maritim dunia, dan negara pertama di dunia yang mengakui de jure kemerdekaan RI 1945.')
ON DUPLICATE KEY UPDATE name=VALUES(name);

-- 9. DATA TRAKTAT & PERJANJIAN INTERNASIONAL
INSERT INTO diplomatic_treaties (id, world_region_id, treaty_type, title, description, status) VALUES
('trt-mys-1', 'malaysia', 'defense', 'Pakta Kerjasama Patroli Perbatasan Selat Malaka & Selat Karimata', 'Perjanjian patroli angkatan laut bersama untuk menjaga stabilitas jalur pelayaran tersibuk di dunia.', 'active'),
('trt-sgp-1', 'singapore', 'trade', 'Pusat Kliring Finansial & Logistik Pelabuhan Maritim Nusantara', 'Kemudahan bebas bea transit komoditas nikel dan bauksit olahan ke hub logistik Singapura.', 'active'),
('trt-sau-1', 'saudi_arabia', 'cultural', 'Perjanjian Kuota Ziarah Haji & Pasokan Minyak Mentah Strategis', 'Pengamanan pasokan energi minyak fosil cadangan nasional dan fasilitas khusus jamaah RI.', 'active')
ON DUPLICATE KEY UPDATE title=VALUES(title);
