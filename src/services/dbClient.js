// Client Service to interact with Supabase Cloud DB (or local Node server / local data fallback)
import { supabase, isSupabaseConfigured } from './supabaseClient';
import { INITIAL_REGIONS } from '../data/regionsData';
import { INITIAL_PARTIES } from '../data/partiesData';
import { INITIAL_BILLS, INITIAL_PASSED_LAWS } from '../data/lawsData';
import { INITIAL_ARTICLES, INITIAL_PRESIDENTIAL_CANDIDATES } from '../data/mediaAndElections';
import { WORLD_REGIONS } from '../data/worldRegionsData';

const API_BASE = 'http://localhost:3001/api';

const TABLES_LIST = [
  'users',
  'regions',
  'parties',
  'bills',
  'passed_laws',
  'candidates',
  'elections',
  'articles',
  'world_regions',
  'diplomatic_treaties',
  'bill_votes',
  'election_votes',
  'article_upvotes',
  'game_logs',
];

// Fetch table statistics (live from Supabase, or backend, or fallback)
export async function fetchDatabaseStats() {
  // 1. Coba ambil langsung dari Supabase jika env Vercel sudah terkonfigurasi
  if (isSupabaseConfigured && supabase) {
    try {
      const stats = await Promise.all(
        TABLES_LIST.map(async (table) => {
          const { count, error } = await supabase
            .from(table)
            .select('*', { count: 'exact', head: true });
          return {
            table,
            rowCount: error ? 0 : (count ?? 0),
            source: 'supabase'
          };
        })
      );
      return stats;
    } catch {
      // lanjut ke opsi berikutnya
    }
  }

  // 2. Coba ambil dari Local Backend API jika jalan
  try {
    const res = await fetch(`${API_BASE}/database/stats`, { signal: AbortSignal.timeout(1200) });
    if (res.ok) {
      return await res.json();
    }
  } catch {
    // fallback to local computed stats
  }

  // 3. Fallback data statis
  return [
    { table: 'users', rowCount: 1 },
    { table: 'regions', rowCount: INITIAL_REGIONS.length },
    { table: 'parties', rowCount: INITIAL_PARTIES.length },
    { table: 'bills', rowCount: INITIAL_BILLS.length },
    { table: 'passed_laws', rowCount: INITIAL_PASSED_LAWS.length },
    { table: 'candidates', rowCount: INITIAL_PRESIDENTIAL_CANDIDATES.length },
    { table: 'elections', rowCount: 1 },
    { table: 'articles', rowCount: INITIAL_ARTICLES.length },
    { table: 'world_regions', rowCount: WORLD_REGIONS.length },
    { table: 'diplomatic_treaties', rowCount: 3 },
    { table: 'bill_votes', rowCount: 0 },
    { table: 'election_votes', rowCount: 0 },
    { table: 'article_upvotes', rowCount: 0 },
    { table: 'game_logs', rowCount: 0 },
  ];
}

// Fetch table rows
export async function fetchTableRows(tableName) {
  // 1. Dari Supabase
  if (isSupabaseConfigured && supabase) {
    try {
      const { data, error } = await supabase
        .from(tableName)
        .select('*')
        .limit(100);
      if (!error && data && data.length > 0) {
        return data;
      }
    } catch {
      // fallback
    }
  }

  // 2. Dari Local Backend Server
  try {
    const res = await fetch(`${API_BASE}/database/query`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ sql: `SELECT * FROM ${tableName} LIMIT 100` }),
      signal: AbortSignal.timeout(1200)
    });
    if (res.ok) {
      const data = await res.json();
      if (data.success && data.rows?.length) return data.rows;
    }
  } catch {
    // fallback
  }

  // 3. Client-side fallback data
  if (tableName === 'regions') return INITIAL_REGIONS;
  if (tableName === 'parties') return INITIAL_PARTIES;
  if (tableName === 'bills') return INITIAL_BILLS;
  if (tableName === 'passed_laws') return INITIAL_PASSED_LAWS;
  if (tableName === 'candidates') return INITIAL_PRESIDENTIAL_CANDIDATES;
  if (tableName === 'articles') return INITIAL_ARTICLES;
  if (tableName === 'world_regions') return WORLD_REGIONS;
  if (tableName === 'users') {
    return [{
      id: 'usr-superadmin',
      username: 'superadmin',
      full_name: 'Sultan Agung Hanyokrokusumo',
      level: 1,
      money: 0,
      gold: 0,
      party_id: null,
      residence_region_id: 'dki',
      role: 'superadmin',
      status: 'active'
    }];
  }

  return [];
}

// Execute arbitrary SELECT query (atau fallback info)
export async function executeSqlQuery(sql) {
  // Jika lewat local node server
  try {
    const res = await fetch(`${API_BASE}/database/query`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ sql }),
      signal: AbortSignal.timeout(2000)
    });
    const data = await res.json();
    return data;
  } catch {
    if (isSupabaseConfigured) {
      return {
        success: false,
        error: 'Untuk keamanan Supabase, kueri SQL manual bebas (raw string) dijalankan melalui Supabase Dashboard > SQL Editor.'
      };
    }
    return {
      success: false,
      error: "Koneksi API server lokal tidak aktif. Untuk mode live Vercel, pastikan konfigurasi VITE_SUPABASE_URL dan VITE_SUPABASE_ANON_KEY telah diatur di Environment Variables Vercel."
    };
  }
}
