-- ==============================================================================
-- DATABASE SCHEMA: WEB REPUBLIC POLITIK (REPUBLIK NUSANTARA)
-- Engine: MySQL 8.x / MariaDB 10.x Compatible
-- ==============================================================================

CREATE DATABASE IF NOT EXISTS republic_politik CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE republic_politik;

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
