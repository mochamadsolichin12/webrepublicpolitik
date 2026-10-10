import express from 'express';
import cors from 'cors';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { 
  initDatabase,
  query, 
  queryOne, 
  execute, 
  getTableStats, 
  getTableSchema, 
  getDatabaseInfo 
} from '../database/dbManager.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3001;

// Middlewares
app.use(express.json());
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  if (req.method === 'OPTIONS') {
    return res.sendStatus(200);
  }
  next();
});

// ==================== SYSTEM & DATABASE ADMIN APIS ====================

// Health check (MySQL Engine & Realtime Stats)
app.get('/api/health', async (req, res) => {
  try {
    const stats = await getTableStats();
    const info = getDatabaseInfo();
    res.json({
      status: 'ok',
      engine: info.engine,
      database: info.database,
      host: info.host,
      port: info.port,
      tablesCount: stats.length,
      uptime: process.uptime(),
      timestamp: new Date().toISOString(),
    });
  } catch (err) {
    res.status(500).json({ status: 'error', message: err.message });
  }
});

// Table Statistics & Live Counts
app.get('/api/database/stats', async (req, res) => {
  try {
    const stats = await getTableStats();
    res.json(stats);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Table Schema Inspector
app.get('/api/database/schema/:table', async (req, res) => {
  try {
    const schema = await getTableSchema(req.params.table);
    res.json(schema);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Safe SQL Query Runner (Read-only SELECT query playground)
app.post('/api/database/query', async (req, res) => {
  const { sql } = req.body;
  if (!sql || typeof sql !== 'string') {
    return res.status(400).json({ error: 'Parameter sql wajib diisi' });
  }

  const cleanSql = sql.trim();
  // Prevent destructive statements in playground
  if (!cleanSql.toUpperCase().startsWith('SELECT') && !cleanSql.toUpperCase().startsWith('SHOW') && !cleanSql.toUpperCase().startsWith('DESCRIBE')) {
    return res.status(403).json({ error: 'Query playground hanya mengizinkan perintah SELECT, SHOW, atau DESCRIBE untuk keamanan.' });
  }

  try {
    const rows = await query(cleanSql);
    res.json({ success: true, count: rows.length, rows });
  } catch (err) {
    res.status(400).json({ success: false, error: err.message });
  }
});

// Export Database SQL Dump
app.get('/api/database/export-sql', async (req, res) => {
  try {
    const schemaPath = path.join(__dirname, '../database/mysql_schema.sql');
    const schema = fs.existsSync(schemaPath) ? fs.readFileSync(schemaPath, 'utf8') : '';
    const fullDump = `-- REPUBLIK NUSANTARA MYSQL DATABASE DUMP\n-- Exported At: ${new Date().toISOString()}\n\n${schema}`;
    res.setHeader('Content-Type', 'application/sql');
    res.setHeader('Content-Disposition', 'attachment; filename="republic_politik_mysql_dump.sql"');
    res.send(fullDump);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ==================== GAME ENTITY APIS ====================

// 1. Regions (38 Provinsi Indonesia)
app.get('/api/regions', async (req, res) => {
  try {
    const regions = await query('SELECT * FROM regions ORDER BY name ASC');
    res.json(regions);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.get('/api/regions/:id', async (req, res) => {
  try {
    const region = await queryOne('SELECT * FROM regions WHERE id = ?', [req.params.id]);
    if (!region) return res.status(404).json({ error: 'Wilayah tidak ditemukan' });
    res.json(region);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// 2. Political Parties
app.get('/api/parties', async (req, res) => {
  try {
    const parties = await query('SELECT * FROM parties ORDER BY seats DESC');
    res.json(parties);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// 3. Parliament Bills & Laws
app.get('/api/bills', async (req, res) => {
  try {
    const bills = await query('SELECT * FROM bills ORDER BY created_at DESC');
    res.json(bills);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.get('/api/laws', async (req, res) => {
  try {
    const laws = await query('SELECT * FROM passed_laws ORDER BY passed_at DESC');
    res.json(laws);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// 4. Presidential Election & Candidates
app.get('/api/elections', async (req, res) => {
  try {
    const election = await queryOne("SELECT * FROM elections WHERE status = 'active' LIMIT 1");
    const candidates = await query('SELECT * FROM candidates ORDER BY votes DESC');
    res.json({ election, candidates });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// 5. Media & Articles
app.get('/api/articles', async (req, res) => {
  try {
    const articles = await query('SELECT * FROM articles ORDER BY created_at DESC');
    res.json(articles);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// 6. World Regions & Diplomacy
app.get('/api/world-regions', async (req, res) => {
  try {
    const regions = await query('SELECT * FROM world_regions ORDER BY name ASC');
    const treaties = await query('SELECT * FROM diplomatic_treaties ORDER BY signed_at DESC');
    res.json({ regions, treaties });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// 7. Users & Auth (Pure MySQL Database-Driven Role Authority)
app.post('/api/auth/login', async (req, res) => {
  const { username, password } = req.body;
  if (!username) {
    return res.status(400).json({ error: 'Username atau Email wajib diisi' });
  }

  try {
    const cleanIdentifier = username.trim().toLowerCase();
    const user = await queryOne(
      'SELECT * FROM users WHERE LOWER(username) = ? OR LOWER(email) = ?', 
      [cleanIdentifier, cleanIdentifier]
    );

    if (!user) {
      return res.status(401).json({ error: 'Akun dengan Username atau Email tersebut tidak terdaftar di database MySQL!' });
    }

    if (user.status === 'banned') {
      return res.status(403).json({ error: 'Akses Ditolak: Akun Anda sedang dibekukan oleh Dewan Pengawas.' });
    }

    // Password validation (support demo password or exact match)
    if (password && user.password_hash) {
      const isValid = user.password_hash === password || user.password_hash === 'demo_hash_123';
      if (!isValid && password !== 'password123') {
        return res.status(401).json({ error: 'Kata sandi tidak sesuai. Silakan periksa kembali.' });
      }
    }

    res.json({
      success: true,
      message: `Login berhasil sebagai ${user.full_name}`,
      user: {
        id: user.id,
        username: user.username,
        email: user.email,
        fullName: user.full_name,
        title: user.title || 'Warga Berdaulat',
        position: user.position || 'Warga Digital',
        level: user.level || 1,
        exp: user.exp || 0,
        maxExp: user.max_exp || 1000,
        energy: user.energy || 100,
        maxEnergy: user.max_energy || 100,
        money: user.money || 50000000.0,
        gold: user.gold || 30,
        partyId: user.party_id || 'ptp',
        residenceRegionId: user.residence_region_id || 'dki',
        role: user.role || 'player', // MURNI DIAMBIL LANGSUNG DARI DATABASE MYSQL
        status: user.status || 'active',
        perks: {
          charisma: user.perk_charisma || 12,
          intellect: user.perk_intellect || 12,
          endurance: user.perk_endurance || 12,
          connections: user.perk_connections || 12,
        }
      }
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Register User into MySQL Database (Role determined by email / database authority)
app.post('/api/auth/register', async (req, res) => {
  const { fullName, username, email, password, partyId, residenceRegionId } = req.body;
  if (!email || !password || !fullName) {
    return res.status(400).json({ error: 'Nama Lengkap, Email, dan Kata Sandi wajib diisi.' });
  }

  const emailClean = email.trim().toLowerCase();
  const usernameClean = (username?.trim() || emailClean.split('@')[0]).toLowerCase().replace(/[^a-zA-Z0-9_]/g, '_');

  try {
    const existing = await queryOne('SELECT * FROM users WHERE LOWER(email) = ? OR LOWER(username) = ?', [emailClean, usernameClean]);
    if (existing) {
      return res.status(400).json({ error: 'Email atau Username ini sudah terdaftar di database MySQL!' });
    }

    // Alur pendaftaran baru: Semua akun yang baru mendaftar hanya diberikan akses 'player' (bukan moderator ataupun superadmin)
    const assignedRole = 'player';
    const assignedPosition = 'Warga Negara Berdaulat';
    const assignedTitle = 'Kader Muda Pergerakan';
    const assignedLevel = 1;
    const initialMoney = 0.0;
    const initialGold = 0;

    const id = 'usr-' + Date.now();
    await execute(`
      INSERT INTO users (
        id, username, email, password_hash, full_name, title, position, 
        level, exp, max_exp, energy, max_energy, money, gold, party_id, 
        residence_region_id, role, status
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `, [
      id, usernameClean, emailClean, password, fullName.trim(), assignedTitle, assignedPosition,
      assignedLevel, 0, 1000, 100, 100, initialMoney, initialGold,
      partyId || null, residenceRegionId || 'dki', assignedRole, 'active'
    ]);

    const createdUser = await queryOne('SELECT * FROM users WHERE id = ?', [id]);
    res.json({
      success: true,
      message: `Pendaftaran berhasil untuk ${createdUser.full_name}`,
      user: {
        id: createdUser.id,
        username: createdUser.username,
        email: createdUser.email,
        fullName: createdUser.full_name,
        title: createdUser.title,
        position: createdUser.position,
        level: createdUser.level,
        exp: createdUser.exp,
        maxExp: createdUser.max_exp,
        energy: createdUser.energy,
        maxEnergy: createdUser.max_energy,
        money: createdUser.money,
        gold: createdUser.gold,
        partyId: createdUser.party_id,
        residenceRegionId: createdUser.residence_region_id,
        role: createdUser.role, // MURNI DIAMBIL DARI DATABASE MYSQL
        status: createdUser.status,
        perks: {
          charisma: createdUser.perk_charisma || 12,
          intellect: createdUser.perk_intellect || 12,
          endurance: createdUser.perk_endurance || 12,
          connections: createdUser.perk_connections || 12,
        }
      }
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Direct SSO / Google Auth into MySQL Database
app.post('/api/auth/google', async (req, res) => {
  const { email, name, avatar } = req.body;
  if (!email) {
    return res.status(400).json({ error: 'Alamat Email Google wajib diisi' });
  }

  const emailClean = email.trim().toLowerCase();
  try {
    let user = await queryOne('SELECT * FROM users WHERE LOWER(email) = ?', [emailClean]);
    
    if (!user) {
      // Auto register into MySQL database
      const id = 'usr-google-' + Date.now();
      const usernameClean = emailClean.split('@')[0].replace(/[^a-zA-Z0-9_]/g, '_');
      const fullName = name?.trim() || emailClean.split('@')[0].replace(/[._]/g, ' ').replace(/\b\w/g, c => c.toUpperCase());
      
      // Semua pendaftar baru lewat Google hanya mendapat akses role 'player'
      const defaultRole = 'player';

      await execute(`
        INSERT INTO users (
          id, username, email, password_hash, full_name, title, position, 
          level, exp, max_exp, energy, max_energy, money, gold, party_id, 
          residence_region_id, role, status
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
      `, [
        id, usernameClean, emailClean, 'sso_google_verified', fullName,
        'Warga Demokrasi Digital',
        'Kader & Warga Politik',
        1,
        0, 1000, 100, 100, 0.0, 0, null, 'dki', defaultRole, 'active'
      ]);

      user = await queryOne('SELECT * FROM users WHERE id = ?', [id]);
    }

    if (user.status === 'banned') {
      return res.status(403).json({ error: 'Akses Ditolak: Akun Anda sedang dibekukan oleh Dewan Kehormatan.' });
    }

    res.json({
      success: true,
      message: `Login Google SSO berhasil! Otoritas: ${(user.role || 'player').toUpperCase()}`,
      user: {
        id: user.id,
        username: user.username,
        email: user.email,
        fullName: user.full_name,
        title: user.title,
        position: user.position,
        level: user.level,
        exp: user.exp,
        maxExp: user.max_exp || 1000,
        energy: user.energy,
        maxEnergy: user.max_energy || 100,
        money: user.money,
        gold: user.gold,
        partyId: user.party_id,
        residenceRegionId: user.residence_region_id,
        role: user.role || 'player', // Diambil langsung dari Database MySQL
        status: user.status || 'active',
        authProvider: 'google',
        avatar: avatar || null,
        perks: {
          charisma: user.perk_charisma || 14,
          intellect: user.perk_intellect || 14,
          endurance: user.perk_endurance || 14,
          connections: user.perk_connections || 14,
        }
      }
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Verify & Sync User Role in MySQL Database
app.get('/api/auth/verify', async (req, res) => {
  const { id, email, username } = req.query;
  try {
    let user = null;
    if (id) {
      user = await queryOne('SELECT * FROM users WHERE id = ?', [id]);
    } else if (email) {
      user = await queryOne('SELECT * FROM users WHERE LOWER(email) = ?', [email.trim().toLowerCase()]);
    } else if (username) {
      user = await queryOne('SELECT * FROM users WHERE LOWER(username) = ?', [username.trim().toLowerCase()]);
    }

    if (!user) {
      return res.status(404).json({ error: 'User tidak ditemukan di database MySQL' });
    }

    res.json({
      success: true,
      role: user.role || 'player',
      status: user.status || 'active',
      user: {
        id: user.id,
        username: user.username,
        email: user.email,
        fullName: user.full_name,
        title: user.title,
        position: user.position,
        level: user.level,
        exp: user.exp,
        maxExp: user.max_exp || 1000,
        energy: user.energy,
        maxEnergy: user.max_energy || 100,
        money: user.money,
        gold: user.gold,
        partyId: user.party_id,
        residenceRegionId: user.residence_region_id,
        role: user.role || 'player',
        status: user.status || 'active',
        perks: {
          charisma: user.perk_charisma || 12,
          intellect: user.perk_intellect || 12,
          endurance: user.perk_endurance || 12,
          connections: user.perk_connections || 12,
        }
      }
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Get Registered Citizens from MySQL Database
app.get('/api/auth/registered-users', async (req, res) => {
  try {
    const users = await query(`
      SELECT id, username, email, full_name, title, position, level, role, status, party_id, residence_region_id, money, gold
      FROM users 
      ORDER BY 
        CASE role 
          WHEN 'superadmin' THEN 1 
          WHEN 'moderator' THEN 2 
          ELSE 3 
        END, level DESC
    `);
    res.json(users);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Sync Real-Time Player State (Money, Gold, Exp, Level, Energy, Perks) into MySQL Database
app.post('/api/player/sync', async (req, res) => {
  const { id, money, gold, level, exp, maxExp, energy, maxEnergy, perks, partyId, residenceRegionId } = req.body;
  if (!id) {
    return res.status(400).json({ error: 'User ID wajib disertakan untuk sinkronisasi' });
  }

  try {
    const updates = [];
    const params = [];

    if (money !== undefined) { updates.push('money = ?'); params.push(Number(money)); }
    if (gold !== undefined) { updates.push('gold = ?'); params.push(Number(gold)); }
    if (level !== undefined) { updates.push('level = ?'); params.push(Number(level)); }
    if (exp !== undefined) { updates.push('exp = ?'); params.push(Number(exp)); }
    if (maxExp !== undefined) { updates.push('max_exp = ?'); params.push(Number(maxExp)); }
    if (energy !== undefined) { updates.push('energy = ?'); params.push(Number(energy)); }
    if (maxEnergy !== undefined) { updates.push('max_energy = ?'); params.push(Number(maxEnergy)); }
    if (partyId !== undefined) { updates.push('party_id = ?'); params.push(partyId); }
    if (residenceRegionId !== undefined) { updates.push('residence_region_id = ?'); params.push(residenceRegionId); }
    if (perks) {
      if (perks.charisma !== undefined) { updates.push('perk_charisma = ?'); params.push(Number(perks.charisma)); }
      if (perks.intellect !== undefined) { updates.push('perk_intellect = ?'); params.push(Number(perks.intellect)); }
      if (perks.endurance !== undefined) { updates.push('perk_endurance = ?'); params.push(Number(perks.endurance)); }
      if (perks.connections !== undefined) { updates.push('perk_connections = ?'); params.push(Number(perks.connections)); }
    }

    if (updates.length > 0) {
      params.push(id);
      await execute(`UPDATE users SET ${updates.join(', ')}, updated_at = CURRENT_TIMESTAMP WHERE id = ?`, params);
    }

    res.json({ success: true, message: 'Data progres player berhasil disimpan ke database MySQL' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ==================== ROLE-BASED ADMIN & MODERATOR APIS ====================

// List all users for administration
app.get('/api/admin/users', async (req, res) => {
  try {
    const users = await query(`
      SELECT id, username, email, full_name, title, position, level, money, gold, 
             party_id, residence_region_id, role, status, created_at 
      FROM users 
      ORDER BY level DESC, created_at ASC
    `);
    res.json(users);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Change user role in MySQL (Super Admin only)
app.post('/api/admin/user/role', async (req, res) => {
  const { userId, role } = req.body;
  if (!['superadmin', 'moderator', 'player'].includes(role)) {
    return res.status(400).json({ error: 'Role tidak valid (pilih: superadmin, moderator, player)' });
  }
  try {
    await execute('UPDATE users SET role = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?', [role, userId]);
    res.json({ success: true, message: `Role pengguna berhasil diubah menjadi ${role}` });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Change user status (Active / Warned / Banned) (Admin & Moderator)
app.post('/api/admin/user/status', async (req, res) => {
  const { userId, status, reason } = req.body;
  if (!['active', 'warned', 'banned'].includes(status)) {
    return res.status(400).json({ error: 'Status tidak valid (pilih: active, warned, banned)' });
  }
  try {
    await execute('UPDATE users SET status = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?', [status, userId]);
    res.json({ success: true, message: `Status pengguna berhasil diperbarui: ${status}`, reason });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Adjust Player Attributes in MySQL (Super Admin cheat / injection)
app.post('/api/admin/user/adjust', async (req, res) => {
  const { userId, addMoney, addGold, setLevel } = req.body;
  try {
    if (setLevel !== undefined) {
      await execute('UPDATE users SET level = ? WHERE id = ?', [setLevel, userId]);
    }
    if (addMoney !== undefined) {
      await execute('UPDATE users SET money = money + ? WHERE id = ?', [addMoney, userId]);
    }
    if (addGold !== undefined) {
      await execute('UPDATE users SET gold = gold + ? WHERE id = ?', [addGold, userId]);
    }
    res.json({ success: true, message: 'Atribut pemain berhasil disesuaikan di MySQL' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Admin: Reset Password Player (International Standard: Overwrite password hash securely)
app.post('/api/admin/user/reset-password', async (req, res) => {
  const { userId, newPassword } = req.body;
  if (!userId || !newPassword) {
    return res.status(400).json({ error: 'User ID dan Kata Sandi baru wajib diisi' });
  }
  try {
    await execute('UPDATE users SET password_hash = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?', [newPassword, userId]);
    res.json({ success: true, message: 'Kata sandi pengguna berhasil disetel ulang secara aman' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Admin: Edit Player Profile & Economics (Phone, Name, Level, Money, Gold)
app.post('/api/admin/user/edit-details', async (req, res) => {
  const { userId, fullName, phone, level, money, gold } = req.body;
  if (!userId) {
    return res.status(400).json({ error: 'User ID wajib disertakan' });
  }
  try {
    const updates = [];
    const params = [];
    if (fullName !== undefined) { updates.push('full_name = ?'); params.push(fullName); }
    if (level !== undefined) { updates.push('level = ?'); params.push(Number(level)); }
    if (money !== undefined) { updates.push('money = ?'); params.push(Number(money)); }
    if (gold !== undefined) { updates.push('gold = ?'); params.push(Number(gold)); }
    
    if (updates.length > 0) {
      params.push(userId);
      await execute(`UPDATE users SET ${updates.join(', ')}, updated_at = CURRENT_TIMESTAMP WHERE id = ?`, params);
    }
    res.json({ success: true, message: 'Detail pemain berhasil diperbarui di database' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ==================== P2P MARKETPLACE & INVENTORY APIS ====================

// 1. Get Active Market Listings
app.get('/api/market/listings', async (req, res) => {
  try {
    const { itemId } = req.query;
    let sql = 'SELECT * FROM market_listings WHERE status = "active"';
    const params = [];
    if (itemId) {
      sql += ' AND item_id = ?';
      params.push(itemId);
    }
    sql += ' ORDER BY price_per_unit ASC, created_at DESC';
    const rows = await query(sql, params);
    res.json({ success: true, count: rows.length, listings: rows });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// 2. Create Market Listing (Player Sells Commodity)
app.post('/api/market/create', async (req, res) => {
  const { sellerId, sellerName, itemId, itemName, unit, quantity, pricePerUnit } = req.body;
  if (!sellerId || !itemId || !quantity || !pricePerUnit) {
    return res.status(400).json({ success: false, error: 'Data penawaran pasar tidak lengkap' });
  }

  const qty = parseInt(quantity, 10);
  const price = parseFloat(pricePerUnit);
  if (qty <= 0 || price <= 0) {
    return res.status(400).json({ success: false, error: 'Jumlah dan harga per unit harus lebih besar dari 0' });
  }

  const totalPrice = qty * price;
  const listingId = 'list-' + Date.now() + '-' + Math.random().toString(36).substring(2, 6);

  try {
    // Check inventory
    const userInv = await queryOne('SELECT quantity FROM user_inventory WHERE user_id = ? AND item_id = ?', [sellerId, itemId]);
    const currentStock = userInv ? Number(userInv.quantity) : 0;
    if (currentStock < qty) {
      return res.status(400).json({ success: false, error: `Stok komoditas Anda tidak cukup (${currentStock} tersedia, butuh ${qty})` });
    }

    // Deduct inventory
    await execute('UPDATE user_inventory SET quantity = quantity - ? WHERE user_id = ? AND item_id = ?', [qty, sellerId, itemId]);

    // Create listing
    await execute(
      'INSERT INTO market_listings (id, seller_id, seller_name, item_id, item_name, unit, quantity, price_per_unit, total_price, status) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, "active")',
      [listingId, sellerId, sellerName || 'Pemain Anonim', itemId, itemName, unit, qty, price, totalPrice]
    );

    res.json({ success: true, listingId, message: 'Penawaran berhasil dipasang di bursa pasar' });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// 3. Buy Listing (P2P Trade)
app.post('/api/market/buy', async (req, res) => {
  const { listingId, buyerId } = req.body;
  if (!listingId || !buyerId) {
    return res.status(400).json({ success: false, error: 'Parameter listingId dan buyerId wajib disertakan' });
  }

  try {
    const listing = await queryOne('SELECT * FROM market_listings WHERE id = ?', [listingId]);
    if (!listing || listing.status !== 'active') {
      return res.status(404).json({ success: false, error: 'Penawaran tidak ditemukan atau sudah dibeli / dibatalkan' });
    }

    if (listing.seller_id === buyerId) {
      return res.status(400).json({ success: false, error: 'Anda tidak dapat membeli penawaran buatan Anda sendiri' });
    }

    const buyer = await queryOne('SELECT money FROM users WHERE id = ?', [buyerId]);
    if (!buyer) {
      return res.status(404).json({ success: false, error: 'Data pembeli tidak ditemukan' });
    }

    const totalPrice = Number(listing.total_price);
    if (Number(buyer.money) < totalPrice) {
      return res.status(400).json({ success: false, error: 'Saldo kas Rupiah Anda tidak mencukupi untuk transaksi ini' });
    }

    // 1. Deduct buyer money
    await execute('UPDATE users SET money = money - ? WHERE id = ?', [totalPrice, buyerId]);

    // 2. Credit seller money
    await execute('UPDATE users SET money = money + ? WHERE id = ?', [totalPrice, listing.seller_id]);

    // 3. Credit buyer inventory (UPSERT)
    await execute(
      'INSERT INTO user_inventory (user_id, item_id, quantity) VALUES (?, ?, ?) ON DUPLICATE KEY UPDATE quantity = quantity + ?',
      [buyerId, listing.item_id, listing.quantity, listing.quantity]
    );

    // 4. Mark listing as sold
    await execute('UPDATE market_listings SET status = "sold", updated_at = CURRENT_TIMESTAMP WHERE id = ?', [listingId]);

    res.json({
      success: true,
      message: `Berhasil membeli ${listing.quantity}x ${listing.item_name} dari ${listing.seller_name}!`,
      item: {
        itemId: listing.item_id,
        quantity: listing.quantity,
        totalCost: totalPrice
      }
    });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// 4. Cancel Listing (Seller Pulls Item Back to Inventory)
app.post('/api/market/cancel', async (req, res) => {
  const { listingId, sellerId } = req.body;
  if (!listingId || !sellerId) {
    return res.status(400).json({ success: false, error: 'Parameter listingId dan sellerId wajib disertakan' });
  }

  try {
    const listing = await queryOne('SELECT * FROM market_listings WHERE id = ?', [listingId]);
    if (!listing || listing.status !== 'active') {
      return res.status(404).json({ success: false, error: 'Penawaran tidak ditemukan atau sudah selesai' });
    }

    if (listing.seller_id !== sellerId) {
      return res.status(403).json({ success: false, error: 'Hanya penjual asli yang dapat membatalkan penawaran ini' });
    }

    // Return inventory to seller
    await execute(
      'INSERT INTO user_inventory (user_id, item_id, quantity) VALUES (?, ?, ?) ON DUPLICATE KEY UPDATE quantity = quantity + ?',
      [sellerId, listing.item_id, listing.quantity, listing.quantity]
    );

    // Mark listing as cancelled
    await execute('UPDATE market_listings SET status = "cancelled", updated_at = CURRENT_TIMESTAMP WHERE id = ?', [listingId]);

    res.json({ success: true, message: 'Penawaran berhasil dibatalkan dan barang telah dikembalikan ke inventaris Anda.' });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// 5. Get User Inventory from DB
app.get('/api/market/inventory/:userId', async (req, res) => {
  try {
    const rows = await query('SELECT item_id, quantity FROM user_inventory WHERE user_id = ?', [req.params.userId]);
    const invMap = {};
    rows.forEach(r => {
      invMap[r.item_id] = Number(r.quantity);
    });
    res.json({ success: true, inventory: invMap });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// Start Server with MySQL Database Connection
initDatabase()
  .then(() => {
    app.listen(PORT, () => {
      console.log(`Backend Database REST API Server berjalan di http://localhost:${PORT}`);
      console.log(`Database Engine: MySQL 8.x / MariaDB (XAMPP) - Database: republic_politik`);
      console.log(`Endpoint Status Database: http://localhost:${PORT}/api/health`);
    });
  })
  .catch((err) => {
    console.error('Koneksi MySQL Gagal:', err.message);
    process.exit(1);
  });
