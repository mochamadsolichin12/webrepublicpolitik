// Client Service to interact with Supabase Cloud DB
import { supabase, isSupabaseConfigured } from './supabaseClient';
import { INITIAL_REGIONS } from '../data/regionsData';
import { INITIAL_PARTIES } from '../data/partiesData';
import { INITIAL_BILLS, INITIAL_PASSED_LAWS } from '../data/lawsData';
import { INITIAL_ARTICLES, INITIAL_PRESIDENTIAL_CANDIDATES } from '../data/mediaAndElections';
import { WORLD_REGIONS } from '../data/worldRegionsData';

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

// Fetch table statistics live from Supabase
export async function fetchDatabaseStats() {
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
    } catch (err) {
      console.warn('Supabase stats error:', err);
    }
  }

  // Fallback default
  return [
    { table: 'users', rowCount: 1, source: 'offline' },
    { table: 'regions', rowCount: INITIAL_REGIONS.length, source: 'offline' },
    { table: 'parties', rowCount: 0, source: 'offline' },
    { table: 'bills', rowCount: INITIAL_BILLS.length, source: 'offline' },
    { table: 'passed_laws', rowCount: INITIAL_PASSED_LAWS.length, source: 'offline' },
    { table: 'candidates', rowCount: INITIAL_PRESIDENTIAL_CANDIDATES.length, source: 'offline' },
    { table: 'elections', rowCount: 1, source: 'offline' },
    { table: 'articles', rowCount: INITIAL_ARTICLES.length, source: 'offline' },
    { table: 'world_regions', rowCount: WORLD_REGIONS.length, source: 'offline' },
    { table: 'diplomatic_treaties', rowCount: 3, source: 'offline' },
    { table: 'bill_votes', rowCount: 0, source: 'offline' },
    { table: 'election_votes', rowCount: 0, source: 'offline' },
    { table: 'article_upvotes', rowCount: 0, source: 'offline' },
    { table: 'game_logs', rowCount: 0, source: 'offline' },
  ];
}

// Fetch table rows live from Supabase
export async function fetchTableRows(tableName) {
  if (isSupabaseConfigured && supabase) {
    try {
      const { data, error } = await supabase
        .from(tableName)
        .select('*')
        .limit(100);
      if (!error && data) {
        return data;
      }
    } catch (err) {
      console.warn(`Supabase fetch ${tableName} error:`, err);
    }
  }

  // Client-side fallback data jika database belum selesai di-seed
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

// Execute arbitrary SELECT query
export async function executeSqlQuery(sql) {
  if (isSupabaseConfigured) {
    return {
      success: false,
      error: 'Aplikasi sekarang sepenuhnya terhubung ke Supabase Cloud. Jalankan kueri SQL administratif melalui Supabase Dashboard > SQL Editor.'
    };
  }
  return {
    success: false,
    error: 'Koneksi database langsung dialihkan ke Supabase Cloud.'
  };
}
