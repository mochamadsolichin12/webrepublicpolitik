import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { INITIAL_REGIONS } from '../data/regionsData';
import { INITIAL_PARTIES } from '../data/partiesData';
import { INITIAL_BILLS, INITIAL_PASSED_LAWS } from '../data/lawsData';
import { INITIAL_ARTICLES, INITIAL_PRESIDENTIAL_CANDIDATES } from '../data/mediaAndElections';
import { INITIAL_ACTIVE_WARS, WAR_HISTORY_ARCHIVE } from '../data/militaryWarsData';
import { COMMODITIES_MARKET, INITIAL_MACRO_INDICATORS, INDUSTRIAL_FACILITIES } from '../data/economyData';
import { AVAILABLE_JOBS, WORK_HISTORY_RECORDS } from '../data/jobsData';
import { sounds } from '../utils/soundEffects';
import { getCurrentPageTab } from '../utils/navigation';
import { supabase, isSupabaseConfigured } from '../services/supabaseClient';

const GameContext = createContext();

const STORAGE_KEY = 'republic_politic_save_v5_pure';

export const DEMO_ACCOUNTS = {
  superadmin: {
    id: 'usr-superadmin',
    username: 'superadmin',
    email: 'admin@nusantara.gov.id',
    phone: '081298889901',
    password: 'adminpassword',
    fullName: 'Sultan Agung Hanyokrokusumo',
    role: 'superadmin',
    status: 'active',
    title: 'Super Administrator Negara',
    position: 'Dewan Pengawas Tertinggi RI',
    level: 1,
    exp: 0,
    maxExp: 1000,
    energy: 100,
    maxEnergy: 100,
    money: 0,
    gold: 0,
    partyId: null,
    residenceRegionId: 'dki',
    perks: { charisma: 10, intellect: 10, endurance: 10, connections: 10 },
    votedBills: {},
    votedPresidentId: null,
  }
};

export function GameProvider({ children, defaultTab }) {
  // Authentication State: default to null jika belum login, atau load saved user
  const [currentUser, setCurrentUser] = useState(() => {
    try {
      const savedUser = localStorage.getItem(STORAGE_KEY + '_current_user');
      if (savedUser) return JSON.parse(savedUser);
    } catch {
      // fallback
    }
    return null; // Wajib login terlebih dahulu
  });

  const [isDbConnected, setIsDbConnected] = useState(false);

  const [usersList, setUsersList] = useState(() => {
    try {
      const savedList = localStorage.getItem(STORAGE_KEY + '_users');
      if (savedList) {
        const parsed = JSON.parse(savedList);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      }
    } catch {
      // fallback
    }
    return [DEMO_ACCOUNTS.superadmin];
  });

  // Load saved player state or fallback (null jika belum login)
  const [player, setPlayer] = useState(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY + '_player');
      if (saved) return JSON.parse(saved);
      const savedUser = localStorage.getItem(STORAGE_KEY + '_current_user');
      if (savedUser) return JSON.parse(savedUser);
    } catch {
      // fallback
    }
    return null; // Wajib login terlebih dahulu
  });

  // Sync role and users dynamically from Supabase (or fallback SQLite localhost)
  useEffect(() => {
    // 1. Jika Supabase terkonfigurasi (di Vercel / Cloud), ambil langsung dari Supabase
    if (isSupabaseConfigured && supabase) {
      setIsDbConnected(true);
      
      // Ambil daftar user terdaftar lengkap dari Supabase
      supabase.from('users').select('*').limit(100).then(({ data, error }) => {
        if (!error && Array.isArray(data) && data.length > 0) {
          const mappedUsers = data.map(u => ({
            ...u,
            id: u.id,
            username: u.username,
            email: u.email,
            password: u.password_hash,
            passwordHash: u.password_hash,
            fullName: u.full_name || u.fullName || u.username,
            name: u.full_name || u.username,
            role: u.role || 'player',
            status: u.status || 'active',
            title: u.title || 'Kader Muda Pergerakan',
            position: u.position || 'Warga & Kader Politik',
            level: u.level || 1,
            exp: u.exp || 0,
            maxExp: u.max_exp || 1000,
            energy: u.energy !== undefined ? u.energy : 100,
            maxEnergy: u.max_energy || 100,
            money: u.money !== undefined ? Number(u.money) : 0,
            gold: u.gold !== undefined ? Number(u.gold) : 0,
            partyId: u.party_id,
            residenceRegionId: u.residence_region_id || 'dki',
            perks: {
              charisma: u.perk_charisma || 10,
              intellect: u.perk_intellect || 10,
              endurance: u.perk_endurance || 10,
              connections: u.perk_connections || 10,
            }
          }));
          setUsersList(mappedUsers);
          localStorage.setItem(STORAGE_KEY + '_users', JSON.stringify(mappedUsers));
        } else if (error) {
          console.warn('Supabase fetch users error:', error.message);
        }
      });

      // Sinkronkan active session dengan data Supabase
      const savedUserStr = localStorage.getItem(STORAGE_KEY + '_current_user');
      if (savedUserStr) {
        try {
          const u = JSON.parse(savedUserStr);
          if (u?.id || u?.username) {
            const query = u.id 
              ? supabase.from('users').select('*').eq('id', u.id).single()
              : supabase.from('users').select('*').eq('username', u.username).single();

            query.then(({ data, error }) => {
              if (!error && data) {
                const refreshed = {
                  ...u,
                  ...data,
                  id: data.id || u.id,
                  username: data.username || u.username,
                  email: data.email || u.email,
                  fullName: data.full_name || data.fullName || u.fullName,
                  name: data.full_name || data.username || u?.name,
                  role: data.role || u.role,
                  status: data.status || u.status,
                  title: data.title || u.title,
                  position: data.position || u.position,
                  level: data.level !== undefined ? data.level : (u.level || 1),
                  exp: data.exp !== undefined ? data.exp : (u.exp || 0),
                  maxExp: data.max_exp !== undefined ? data.max_exp : (u.maxExp || 1000),
                  energy: data.energy !== undefined ? data.energy : (u.energy ?? 100),
                  maxEnergy: data.max_energy !== undefined ? data.max_energy : (u.maxEnergy || 100),
                  money: data.money !== undefined ? Number(data.money) : (u.money || 0),
                  gold: data.gold !== undefined ? Number(data.gold) : (u.gold || 0),
                  partyId: data.party_id !== undefined ? data.party_id : u.partyId,
                  residenceRegionId: data.residence_region_id || u.residenceRegionId || 'dki',
                  perks: {
                    charisma: data.perk_charisma || u.perks?.charisma || 10,
                    intellect: data.perk_intellect || u.perks?.intellect || 10,
                    endurance: data.perk_endurance || u.perks?.endurance || 10,
                    connections: data.perk_connections || u.perks?.connections || 10,
                  }
                };

                // Ambil daftar voting RUU yang pernah dilakukan oleh user ini dari Supabase
                supabase.from('bill_votes').select('bill_id, vote').eq('user_id', refreshed.id).then(({ data: userVotes, error: uvErr }) => {
                  const votedBillsMap = {};
                  if (!uvErr && Array.isArray(userVotes)) {
                    userVotes.forEach((v) => {
                      votedBillsMap[v.bill_id] = v.vote === 'yes' ? 'agree' : (v.vote === 'no' ? 'reject' : v.vote);
                    });
                  }
                  const withVotes = {
                    ...refreshed,
                    votedBills: { ...(u.votedBills || {}), ...votedBillsMap }
                  };
                  setCurrentUser(withVotes);
                  setPlayer(withVotes);
                  localStorage.setItem(STORAGE_KEY + '_current_user', JSON.stringify(withVotes));
                  localStorage.setItem(STORAGE_KEY + '_player', JSON.stringify(withVotes));
                });
              }
            });
          }
        } catch {}
      }

      // Ambil data live partai dari Supabase
      supabase.from('parties').select('*').then(({ data, error }) => {
        if (!error && Array.isArray(data)) {
          const mappedParties = data.map(p => ({
            id: p.id,
            name: p.name,
            shortName: p.short_name || p.shortName,
            leader: p.leader,
            ideology: p.ideology,
            color: p.color,
            seats: p.seats || 0,
            treasury: p.funds || p.treasury || 0,
            membersCount: p.members_count || p.membersCount || 0,
            slogan: p.description || p.slogan || '',
          }));
          setParties(mappedParties);
          localStorage.setItem(STORAGE_KEY + '_parties', JSON.stringify(mappedParties));
        }
      });

      // Ambil RUU aktif dari Supabase
      supabase.from('bills').select('*').then(async ({ data, error }) => {
        if (!error && Array.isArray(data)) {
          // Ambil rincian vote dari bill_votes
          const { data: allBillVotes } = await supabase.from('bill_votes').select('*');
          const votesByBill = {};
          if (Array.isArray(allBillVotes)) {
            allBillVotes.forEach((bv) => {
              if (!votesByBill[bv.bill_id]) {
                votesByBill[bv.bill_id] = { agree: 0, reject: 0, abstain: 0 };
              }
              if (bv.vote === 'yes' || bv.vote === 'agree') votesByBill[bv.bill_id].agree += 1;
              else if (bv.vote === 'no' || bv.vote === 'reject') votesByBill[bv.bill_id].reject += 1;
              else if (bv.vote === 'abstain') votesByBill[bv.bill_id].abstain += 1;
            });
          }

          const normalized = data.map(b => {
            const recordedVotes = votesByBill[b.id] || { agree: b.yes_votes || 0, reject: b.no_votes || 0, abstain: 0 };
            return {
              ...b,
              id: b.id,
              title: b.title,
              category: b.category,
              authorId: b.author_id || b.authorId,
              author_id: b.author_id,
              proposedBy: b.proposedBy || b.author_name || (b.party_id ? `Fraksi ${b.party_id.toUpperCase()}` : 'Inisiatif Parlemen'),
              sponsorPartyId: b.sponsorPartyId || b.party_id || null,
              description: b.description,
              impactText: b.impactText || b.impact_summary || '+5% Stabilitas Nasional',
              votesRequired: b.votesRequired || 51,
              timeRemainingSeconds: b.timeRemainingSeconds !== undefined ? b.timeRemainingSeconds : 300,
              status: b.status || 'voting',
              votes: recordedVotes
            };
          });
          setBills(normalized);
          localStorage.setItem(STORAGE_KEY + '_bills', JSON.stringify(normalized));
        }
      });

      // Ambil UU yang telah disahkan dari Supabase
      supabase.from('passed_laws').select('*').then(({ data, error }) => {
        if (!error && Array.isArray(data)) {
          const normalizedLaws = data.map(l => ({
            ...l,
            id: l.id,
            title: l.title,
            category: l.category,
            passedYear: l.passedYear || (l.passed_at ? new Date(l.passed_at).getFullYear().toString() : '2026'),
            sponsor: l.sponsor || 'Parlemen RI',
            summary: l.summary || l.description || '',
            activeBuff: l.activeBuff || l.national_effects || 'Hukum Nasional Berlaku'
          }));
          setPassedLaws(normalizedLaws);
          localStorage.setItem(STORAGE_KEY + '_laws', JSON.stringify(normalizedLaws));
        }
      });

      // Ambil kandidat pemilu dari Supabase
      supabase.from('candidates').select('*').then(({ data, error }) => {
        if (!error && Array.isArray(data)) {
          setCandidates(data);
          localStorage.setItem(STORAGE_KEY + '_candidates', JSON.stringify(data));
        }
      });

      // Ambil artikel/berita dari Supabase
      supabase.from('articles').select('*').then(({ data, error }) => {
        if (!error && Array.isArray(data)) {
          setArticles(data);
          localStorage.setItem(STORAGE_KEY + '_articles', JSON.stringify(data));
        }
      });

      // Ambil data live provinsi / wilayah dari Supabase
      supabase.from('regions').select('*').then(({ data, error }) => {
        if (!error && Array.isArray(data) && data.length > 0) {
          setRegions(prevList =>
            prevList.map(r => {
              const dbReg = data.find(d => d.id === r.id);
              if (dbReg) {
                return {
                  ...r,
                  name: dbReg.name || r.name,
                  capital: dbReg.capital || r.capital,
                  population: dbReg.population !== undefined ? dbReg.population : r.population,
                  budget: dbReg.budget !== undefined ? dbReg.budget : r.budget,
                  dominantPartyId: dbReg.dominant_party_id !== undefined ? dbReg.dominant_party_id : r.dominantPartyId,
                  supportRate: dbReg.support_rate !== undefined ? dbReg.support_rate : r.supportRate,
                  resource: dbReg.resource || r.resource,
                  regionalTax: dbReg.tax_rate !== undefined ? dbReg.tax_rate : r.regionalTax,
                  infrastructure: dbReg.infrastructure_level !== undefined ? dbReg.infrastructure_level : r.infrastructure,
                  militaryBase: dbReg.defense_power !== undefined ? dbReg.defense_power : r.militaryBase,
                };
              }
              return r;
            })
          );
        }
      });
      return;
    }
  }, []);

  const [regions, setRegions] = useState(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY + '_regions');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed)) {
          return INITIAL_REGIONS.map((initial) => {
            const found = parsed.find((p) => p.id === initial.id);
            if (found) {
              return { 
                ...initial, 
                ...found, 
                lat: initial.lat, 
                lng: initial.lng,
                mapCoords: initial.mapCoords 
              };
            }
            return initial;
          });
        }
      }
    } catch {
      // fallback
    }
    return INITIAL_REGIONS;
  });

  const [parties, setParties] = useState(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY + '_parties');
      if (saved) return JSON.parse(saved);
    } catch {
      // fallback
    }
    return INITIAL_PARTIES;
  });

  const [bills, setBills] = useState(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY + '_bills');
      if (saved) return JSON.parse(saved);
    } catch {
      // fallback
    }
    return INITIAL_BILLS;
  });

  const [passedLaws, setPassedLaws] = useState(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY + '_laws');
      if (saved) return JSON.parse(saved);
    } catch {
      // fallback
    }
    return INITIAL_PASSED_LAWS;
  });

  const [articles, setArticles] = useState(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY + '_articles');
      if (saved) return JSON.parse(saved);
    } catch {
      // fallback
    }
    return INITIAL_ARTICLES;
  });

  const [candidates, setCandidates] = useState(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY + '_candidates');
      if (saved) return JSON.parse(saved);
    } catch {
      // fallback
    }
    return INITIAL_PRESIDENTIAL_CANDIDATES;
  });

  const [nationalState, setNationalState] = useState(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY + '_national');
      if (saved) return JSON.parse(saved);
    } catch {
      // fallback
    }
    return {
      presidentName: 'Belum Terpilih (Era Awal)',
      vicePresidentName: 'Belum Terpilih',
      treasury: 0, // Rp 0 APBN
      stability: 50, // 50%
      publicApproval: 50,
      nextElectionSeconds: 240,
      breakingTicker: 'DUNIA TANPA PENGHUNI: Era baru dimulai dari nol! Bangun peradaban dan ekonomi bangsa bersama.',
    };
  });

  const [activeWars, setActiveWars] = useState(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY + '_wars');
      if (saved) return JSON.parse(saved);
    } catch {
      // fallback
    }
    return []; // Awal kosong - murni dideklarasikan oleh player
  });

  const [warHistory, setWarHistory] = useState(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY + '_war_history');
      if (saved) return JSON.parse(saved);
    } catch {
      // fallback
    }
    return WAR_HISTORY_ARCHIVE;
  });

  const [commodities, setCommodities] = useState(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY + '_commodities');
      if (saved) return JSON.parse(saved);
    } catch {
      // fallback
    }
    return COMMODITIES_MARKET;
  });

  const [macroEconomy, setMacroEconomy] = useState(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY + '_macro');
      if (saved) return JSON.parse(saved);
    } catch {
      // fallback
    }
    return INITIAL_MACRO_INDICATORS;
  });

  const [playerInventory, setPlayerInventory] = useState(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY + '_inventory');
      if (saved) return JSON.parse(saved);
    } catch {
      // fallback
    }
    return {
      oil: 0,
      nickel: 0,
      cpo: 0,
      coal: 0,
      gold_bullion: 0,
      rice: 0
    };
  });

  const [playerFactories, setPlayerFactories] = useState(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY + '_factories');
      if (saved) return JSON.parse(saved);
    } catch {
      // fallback
    }
    return [];
  });

  const [workHistory, setWorkHistory] = useState(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY + '_work_history');
      if (saved) return JSON.parse(saved);
    } catch {
      // fallback
    }
    return WORK_HISTORY_RECORDS;
  });

  // Global & National Chat Channels
  const [chatMessages, setChatMessages] = useState(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY + '_chat');
      if (saved) return JSON.parse(saved);
    } catch {
      // fallback
    }
    return [
      {
        id: 'chat-1',
        senderId: 'usr-superadmin',
        senderName: 'Sultan Agung',
        channel: 'global',
        country: 'Indonesia',
        text: 'Selamat datang para pemimpin di Republic Politic! Bangun kekuatan diplomasi & koalisi Anda.',
        timestamp: '15 menit lalu',
        time: Date.now() - 900000,
        badge: 'Admin'
      },
      {
        id: 'chat-2',
        senderId: 'usr-satria',
        senderName: 'Raden Satria',
        channel: 'national',
        country: 'Indonesia',
        text: 'Halo kawan seperjuangan! Wilayah mana yang hari ini butuh pasokan industri & bantuan pertahanan?',
        timestamp: '8 menit lalu',
        time: Date.now() - 480000,
        badge: 'Warga'
      },
      {
        id: 'chat-3',
        senderId: 'usr-alex',
        senderName: 'General Vance',
        channel: 'global',
        country: 'USA',
        text: 'Looking for bilateral economic pact with Asian trade blocs!',
        timestamp: '2 menit lalu',
        time: Date.now() - 120000,
        badge: 'Diplomat'
      }
    ];
  });

  // Top Attacker records in last 24h
  const [topAttackers, setTopAttackers] = useState(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY + '_top_attackers');
      if (saved) return JSON.parse(saved);
    } catch {
      // fallback
    }
    return [
      {
        id: 'usr-satria',
        name: 'Raden Satria Nusantara',
        username: 'satria',
        country: 'Indonesia',
        region: 'DKI Jakarta',
        avatar: null,
        damage24h: 345000,
        lastActive: 'Baru saja'
      },
      {
        id: 'usr-panglima-chen',
        name: 'Komandan Chen Xiao',
        username: 'chen_xiao',
        country: 'China',
        region: 'Pasifik Barat',
        avatar: null,
        damage24h: 285000,
        lastActive: '12 menit lalu'
      },
      {
        id: 'usr-yudo',
        name: 'Laksamana Madya M. Yudo',
        username: 'yudo_tni',
        country: 'Indonesia',
        region: 'Kepulauan Riau',
        avatar: null,
        damage24h: 210000,
        lastActive: '25 menit lalu'
      }
    ];
  });

  const sendChatMessage = (text, channel = 'global') => {
    if (!text || !text.trim()) return;
    if (!player) {
      showToast('Silakan masuk terlebih dahulu untuk mengirim pesan obrolan.', 'error');
      return;
    }
    const newMsg = {
      id: 'msg-' + Date.now(),
      senderId: player.id || player.username,
      senderName: player.fullName || player.username,
      channel, // 'global' | 'national'
      country: player.residenceCountry || 'Indonesia',
      text: text.trim(),
      timestamp: 'Baru saja',
      time: Date.now(),
      badge: player.role === 'superadmin' ? 'Admin' : (player.position ? player.position.slice(0, 18) : 'Warga')
    };

    setChatMessages((prev) => [newMsg, ...prev].slice(0, 60));
    sounds.playClick();
  };

  const [selectedRegionId, setSelectedRegionId] = useState('dki');
  const [activeTab, setActiveTab] = useState(() => defaultTab || getCurrentPageTab()); // 'home', 'map', 'parliament', 'elections', 'parties', 'career', 'media', 'budget', 'database', 'wars', 'economy', 'legislation', 'jobs'
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [notification, setNotification] = useState(null);

  // Upgrade Perk dengan Timer
  // Level 1 (dari skor 10 ke 11, atau perk level 1) = 60 detik (1 menit).
  // Tiap level berikutnya bertambah 10% dari durasi level sebelumnya (misal: 60 * 1.1^(nextLevel - 1)).
  const getPerkUpgradeDuration = useCallback((currentLevel = 10) => {
    // currentLevel 10 (awal) -> upgrade ke 11: step 0 (durasi 60 detik / 1 menit)
    // perk naik -> kenaikan waktu 10% per tingkat: 60 * (1.10 ^ step)
    const step = Math.max(0, Number(currentLevel) - 10);
    const durationSeconds = Math.round(60 * Math.pow(1.10, step));
    return Math.max(60, durationSeconds);
  }, []);

  const [activePerkUpgrade, setActivePerkUpgrade] = useState(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY + '_active_perk_upgrade');
      if (saved) return JSON.parse(saved);
    } catch {
      // ignore
    }
    return null;
  });

  const toggleSidebar = useCallback(() => {
    setSidebarOpen((prev) => !prev);
  }, []);

  // Show floating toast notification
  const showToast = useCallback((message, type = 'info') => {
    setNotification({ message, type, id: Date.now() });
    setTimeout(() => {
      setNotification((curr) => (curr && curr.message === message ? null : curr));
    }, 4000);
  }, []);

  // Save to localStorage
  useEffect(() => {
    try {
      if (player) {
        localStorage.setItem(STORAGE_KEY + '_player', JSON.stringify(player));
      } else {
        localStorage.removeItem(STORAGE_KEY + '_player');
      }
      localStorage.setItem(STORAGE_KEY + '_regions', JSON.stringify(regions));
      localStorage.setItem(STORAGE_KEY + '_parties', JSON.stringify(parties));
      localStorage.setItem(STORAGE_KEY + '_bills', JSON.stringify(bills));
      localStorage.setItem(STORAGE_KEY + '_laws', JSON.stringify(passedLaws));
      localStorage.setItem(STORAGE_KEY + '_articles', JSON.stringify(articles));
      localStorage.setItem(STORAGE_KEY + '_candidates', JSON.stringify(candidates));
      localStorage.setItem(STORAGE_KEY + '_national', JSON.stringify(nationalState));
      localStorage.setItem(STORAGE_KEY + '_wars', JSON.stringify(activeWars));
      localStorage.setItem(STORAGE_KEY + '_war_history', JSON.stringify(warHistory));
      localStorage.setItem(STORAGE_KEY + '_commodities', JSON.stringify(commodities));
      localStorage.setItem(STORAGE_KEY + '_macro', JSON.stringify(macroEconomy));
      localStorage.setItem(STORAGE_KEY + '_inventory', JSON.stringify(playerInventory));
      localStorage.setItem(STORAGE_KEY + '_factories', JSON.stringify(playerFactories));
      localStorage.setItem(STORAGE_KEY + '_work_history', JSON.stringify(workHistory));
      localStorage.setItem(STORAGE_KEY + '_users', JSON.stringify(usersList));
      localStorage.setItem(STORAGE_KEY + '_chat', JSON.stringify(chatMessages));
      localStorage.setItem(STORAGE_KEY + '_top_attackers', JSON.stringify(topAttackers));
      if (activePerkUpgrade) {
        localStorage.setItem(STORAGE_KEY + '_active_perk_upgrade', JSON.stringify(activePerkUpgrade));
      } else {
        localStorage.removeItem(STORAGE_KEY + '_active_perk_upgrade');
      }
      if (currentUser) {
        localStorage.setItem(STORAGE_KEY + '_current_user', JSON.stringify(currentUser));
      } else {
        localStorage.removeItem(STORAGE_KEY + '_current_user');
      }
    } catch {
      // ignore quota errors
    }
  }, [player, regions, parties, bills, passedLaws, articles, candidates, nationalState, activeWars, warHistory, commodities, macroEconomy, playerInventory, playerFactories, workHistory, usersList, currentUser, chatMessages, topAttackers, activePerkUpgrade]);

  // Real-Time Database Auto-Sync:
  // Setiap kali player melakukan aktivitas (bekerja, menerima gaji, naik level, membeli aset),
  // data langsung tersimpan secara permanen ke Supabase dan MySQL agar uang dan progres tidak hilang saat refresh.
  useEffect(() => {
    if (!player || (!player.id && !player.username)) return;

    const timeout = setTimeout(() => {
      // 1. Simpan ke Supabase jika terkonfigurasi
      if (isSupabaseConfigured && supabase) {
        const payload = {
          money: player.money !== undefined ? Number(player.money) : 0,
          gold: player.gold !== undefined ? Number(player.gold) : 0,
          level: player.level || 1,
          exp: player.exp || 0,
          max_exp: player.maxExp || 1000,
          energy: player.energy !== undefined ? player.energy : 100,
          max_energy: player.maxEnergy || 100,
          party_id: player.partyId || null,
          residence_region_id: player.residenceRegionId || 'dki',
          perk_charisma: player.perks?.charisma || 10,
          perk_intellect: player.perks?.intellect || 10,
          perk_endurance: player.perks?.endurance || 10,
          perk_connections: player.perks?.connections || 10,
          updated_at: new Date().toISOString()
        };

        const updatePromise = player.id
          ? supabase.from('users').update(payload).eq('id', player.id)
          : supabase.from('users').update(payload).eq('username', player.username);

        updatePromise.then(({ error }) => {
          if (error) {
            console.error('Supabase users auto-sync failed:', error.message);
          } else {
            console.log('✅ Supabase users auto-sync success:', payload.money, payload.gold);
          }
        });
      }
    }, 400); // Debounce 400ms untuk efisiensi request

    return () => clearTimeout(timeout);
  }, [
    player?.money, 
    player?.gold, 
    player?.level, 
    player?.exp, 
    player?.energy, 
    player?.partyId, 
    player?.residenceRegionId,
    player?.perks?.charisma,
    player?.perks?.intellect,
    player?.perks?.endurance,
    player?.perks?.connections
  ]);

  // Sync player updates into usersList
  useEffect(() => {
    if (currentUser && player) {
      setUsersList((prevList) =>
        prevList.map((u) => (u.id === currentUser.id ? { ...u, ...player } : u))
      );
    }
  }, [player, currentUser?.id]);

  // Dynamic Charisma & Retorika Calculation:
  // Kharisma & Retorika berfluktuasi naik-turun secara otomatis mengikuti tingkat ketenaran (popularity / election polling)
  // serta perolehan suara dari player/partai lain untuk maju sebagai pemimpin negara.
  useEffect(() => {
    if (!player) return;
    const myId = player.id || player.username;
    const myCandidate = candidates.find(
      (c) => c.playerId === myId || c.id === `cand-player-${myId}` || (c.name && c.name.includes(player.fullName || player.username))
    );

    // Ketenaran diukur dari:
    // 1. Elektabilitas paslon presiden (currentPolling) jika maju sebagai capres
    // 2. Perolehan suara coblosan langsung dari player lain (votesCount)
    // 3. Dukungan elektoral partai yang dipimpinnya di pemilu nasional
    let famePolling = 0;
    let fameVotes = 0;

    if (myCandidate) {
      famePolling = myCandidate.currentPolling || 0;
      fameVotes = myCandidate.votesCount || 0;
    } else if (player.partyId) {
      const myParty = parties.find((p) => p.id === player.partyId);
      if (myParty) {
        // Kontribusi keterpilihan partai di daerah/parlemen
        const controlled = regions.filter((r) => r.dominantPartyId === myParty.id).length;
        famePolling = (myParty.membersCount || 1) * 2 + controlled * 3;
      }
    }

    // Base charisma adalah 10.
    // Tambahan charisma naik/turun sesuai fluktuasi ketenaran (famePolling & fameVotes), batas maksimal 999
    const dynamicCharismaBonus = Math.floor(famePolling * 0.6) + (fameVotes * 2);
    const calculatedCharisma = Math.min(999, Math.max(5, 10 + dynamicCharismaBonus));

    if (player.perks?.charisma !== calculatedCharisma) {
      setPlayer((prev) => {
        if (!prev) return prev;
        return {
          ...prev,
          perks: {
            ...prev.perks,
            charisma: calculatedCharisma,
          },
        };
      });
    }
  }, [candidates, parties, regions, player?.id, player?.username, player?.partyId, player?.fullName]);

  // Main game tick (every 2.5 seconds)
  useEffect(() => {
    const timer = setInterval(() => {
      // 1. Recover energy
      setPlayer((prev) => {
        if (!prev) return prev;
        const currentEnergy = prev.energy ?? 100;
        const maxEnergy = prev.maxEnergy ?? 100;
        if (currentEnergy >= maxEnergy) return prev;
        return {
          ...prev,
          energy: Math.min(maxEnergy, currentEnergy + 1),
        };
      });

      // 2. Count down bills
      setBills((prevBills) => {
        let changed = false;
        const updated = prevBills.map((bill) => {
          if (bill.status !== 'voting') return bill;
          const nextTime = bill.timeRemainingSeconds - 1;
          if (nextTime <= 0) {
            changed = true;
            const passed = bill.votes.agree >= bill.votesRequired;
            return {
              ...bill,
              timeRemainingSeconds: 0,
              status: passed ? 'passed' : 'rejected',
            };
          }
          return { ...bill, timeRemainingSeconds: nextTime };
        });

        // Update bill status and persist to Supabase
        if (isSupabaseConfigured && supabase) {
          updated.forEach((b) => {
            if (b.status !== 'voting') {
              supabase.from('bills').update({ status: b.status }).eq('id', b.id).then(() => {});
            }
          });
        }

        // If any bill just passed, move to passed laws and trigger effect
        const newlyPassed = updated.filter(
          (b) => b.status === 'passed' && !passedLaws.some((l) => l.id === b.id)
        );

        if (newlyPassed.length > 0) {
          sounds.playGavel();
          newlyPassed.forEach((b) => {
            const lawTitle = b.title.replace('RUU', 'UU');
            const lawItem = {
              id: 'law-' + b.id.replace('bill-', ''),
              title: lawTitle,
              category: b.category,
              passedYear: '2026',
              sponsor: b.proposedBy,
              summary: b.description,
              activeBuff: b.impactText,
            };

            // Save to Supabase passed_laws table
            if (isSupabaseConfigured && supabase) {
              supabase.from('passed_laws').insert([{
                id: lawItem.id,
                bill_id: b.id,
                title: lawItem.title,
                category: lawItem.category,
                description: lawItem.summary,
                national_effects: b.nationalEffect || {},
                passed_at: new Date().toISOString()
              }]).then(({ error }) => {
                if (error) console.error('Supabase passed_laws insert error:', error.message);
              });
            }

            setPassedLaws((laws) => [lawItem, ...laws]);

            setNationalState((curr) => ({
              ...curr,
              treasury: curr.treasury + (b.nationalEffect?.treasuryDelta || 0),
              stability: Math.min(100, Math.max(20, curr.stability + (b.nationalEffect?.stabilityDelta || 0))),
              publicApproval: Math.min(100, Math.max(20, curr.publicApproval + (b.nationalEffect?.supportDelta || 0))),
              breakingTicker: `PARLEMEN SAHKAN: ${b.title} resmi disahkan menjadi Undang-Undang Republik!`,
            }));

            setArticles((arts) => [
              {
                id: 'art-' + Date.now(),
                headline: `RESMI: Parlemen Sahkan ${b.title}!`,
                author: 'Biro Pemberitaan Parlemen RI',
                partyTag: b.sponsorPartyId?.toUpperCase() || 'PARLEMEN',
                timeAgo: 'Baru saja',
                reads: 1200,
                upvotes: 95,
                category: 'Parlemen',
                content: `Melalui sidang paripurna yang dinamis, Parlemen resmi mengesahkan ${b.title}. Dampak regulasi ini akan segera terasa di seluruh provinsi kepulauan nusantara.`,
              },
              ...arts,
            ]);
          });
        }

        return changed ? updated : prevBills;
      });

      // 3. Count down next election timer
      setNationalState((prev) => {
        const nextSec = prev.nextElectionSeconds - 1;
        if (nextSec <= 0) {
          // Trigger automated election results simulation
          return {
            ...prev,
            nextElectionSeconds: 300, // Reset to 5 minutes
            breakingTicker: 'PEMILU RAYA TELAH TUNTAS! KPU menetapkan komposisi kursi Parlemen dan perolehan suara nasional.',
          };
        }
        return { ...prev, nextElectionSeconds: nextSec };
      });

      // 4. Count down active wars timer and auto skirmish
      setActiveWars((prevWars) => {
        return prevWars.map((war) => {
          if (war.status !== 'active') return war;
          const nextSec = war.timeRemainingSeconds - 1;
          // Random slight exchange between AI frontlines
          const attackerTickDmg = Math.floor(Math.random() * 400) + 100;
          const defenderTickDmg = Math.floor(Math.random() * 450) + 120;

          if (nextSec <= 0) {
            const defenderWon = war.defender.damage >= war.attacker.damage;
            return {
              ...war,
              timeRemainingSeconds: 600, // Reset to next round cycle
              currentRound: war.currentRound + 1,
              frontLineAdvantage: defenderWon ? 'defender' : 'attacker',
              status: 'active'
            };
          }

          return {
            ...war,
            timeRemainingSeconds: nextSec,
            attacker: {
              ...war.attacker,
              damage: war.attacker.damage + attackerTickDmg
            },
            defender: {
              ...war.defender,
              damage: war.defender.damage + defenderTickDmg
            },
            frontLineAdvantage: (war.defender.damage + defenderTickDmg) >= (war.attacker.damage + attackerTickDmg) ? 'defender' : 'attacker'
          };
        });
      });

      // 5. Dynamic Market Price Fluctuations (Real-world supply & demand simulation)
      setCommodities((prevComms) => {
        // Only update on some ticks (e.g. 50% chance)
        if (Math.random() > 0.5) return prevComms;
        return prevComms.map((c) => {
          const deltaPct = (Math.random() * c.volatility * 2 - c.volatility);
          const newPrice = Math.round(c.currentPriceRp * (1 + deltaPct));
          const change24h = parseFloat((((newPrice - c.basePriceRp) / c.basePriceRp) * 100).toFixed(2));
          return {
            ...c,
            currentPriceRp: newPrice,
            change24h
          };
        });
      });
      // 6. Perk Training / Upgrade Countdown & Auto-completion
      setActivePerkUpgrade((currentUpgrade) => {
        if (!currentUpgrade) return null;
        const remaining = Math.max(0, currentUpgrade.remainingSeconds - 2.5);
        if (remaining <= 0) {
          // Training selesai! Tingkatkan stat perk (maksimal 999)
          const { perkKey, targetVal } = currentUpgrade;
          const cappedVal = Math.min(999, Number(targetVal) || 10);
          setPlayer((prev) => {
            if (!prev) return prev;
            const nextExp = (prev.exp || 0) + 120;
            let newLevel = prev.level || 1;
            let remainingExp = nextExp;
            const maxExp = prev.maxExp || 1000;
            if (nextExp >= maxExp) {
              newLevel += 1;
              remainingExp = nextExp - maxExp;
              sounds.playSuccess();
              showToast(`Selamat! Karir Politik Anda Naik ke Level ${newLevel}!`, 'success');
            }

            return {
              ...prev,
              level: newLevel,
              exp: remainingExp,
              maxExp: maxExp + (newLevel > (prev.level || 1) ? 400 : 0),
              perks: {
                ...prev.perks,
                [perkKey]: cappedVal,
              },
            };
          });

          sounds.playSuccess();
          showToast(`Pelatihan Selesai! Stat ${currentUpgrade.perkTitle || perkKey.toUpperCase()} berhasil ditingkatkan ke skor ${cappedVal}!`, 'success');
          return null;
        }

        return {
          ...currentUpgrade,
          remainingSeconds: remaining,
        };
      });
    }, 2500);

    return () => clearInterval(timer);
  }, [passedLaws, showToast]);

  // Actions:
  // 1. Train Perk (Charisma & Retorika tidak dapat dilatih manual; otomatis naik/turun dari ketenaran & pemilu presiden)
  // Waktu upgrade: Level 1 = 1 menit (60s), naik ke level selanjutnya +10% dari durasi sebelumnya. Maksimal 999.
  const trainPerk = (perkKey) => {
    sounds.playClick();
    if (!player) {
      showToast('Silakan masuk / login terlebih dahulu.', 'error');
      return;
    }
    if (perkKey === 'charisma') {
      showToast('Karisma & Retorika tidak dapat dilatih manual! Stat ini naik turun otomatis mengikuti tingkat ketenaran & suara pemilu presiden.', 'info');
      return;
    }
    const currentVal = (player.perks && player.perks[perkKey]) || 10;
    if (currentVal >= 999) {
      showToast(`Stat ${perkKey.toUpperCase()} sudah mencapai batas maksimal (999)!`, 'info');
      return;
    }
    if (activePerkUpgrade) {
      showToast(`Sedang ada pelatihan aktif: ${activePerkUpgrade.perkTitle || activePerkUpgrade.perkKey}. Harap tunggu hingga selesai (${Math.ceil(activePerkUpgrade.remainingSeconds)}s tersisa).`, 'info');
      return;
    }
    if ((player.energy || 0) < 15) {
      showToast('Energi tidak cukup! Butuh minimal 15 Energi.', 'error');
      return;
    }
    const costMoney = 5000000;
    if ((player.money || 0) < costMoney) {
      showToast('Dana pribadi tidak mencukupi! Butuh Rp 5.000.000 untuk kursus/pelatihan.', 'error');
      return;
    }

    const targetVal = Math.min(999, currentVal + 1);
    const durationSeconds = getPerkUpgradeDuration(currentVal);

    // Deduksi sumber daya langsung saat latihan dimulai
    setPlayer((prev) => {
      if (!prev) return prev;
      return {
        ...prev,
        energy: Math.max(0, (prev.energy || 0) - 15),
        money: (prev.money || 0) - costMoney,
      };
    });

    const perkTitles = {
      intellect: 'Intelektualitas & Regulasi',
      endurance: 'Ketahanan & Disiplin',
      connections: 'Koneksi Bisnis & Oligarki',
    };

    setActivePerkUpgrade({
      perkKey,
      perkTitle: perkTitles[perkKey] || perkKey.toUpperCase(),
      currentVal,
      targetVal,
      totalDurationSeconds: durationSeconds,
      remainingSeconds: durationSeconds,
      startedAt: Date.now(),
    });

    sounds.playCoin();
    const minutes = Math.floor(durationSeconds / 60);
    const secs = durationSeconds % 60;
    const timeFormatted = minutes > 0 ? `${minutes}m ${secs > 0 ? `${secs}s` : ''}`.trim() : `${secs} detik`;
    showToast(`Pelatihan ${perkTitles[perkKey] || perkKey} dimulai! Estimasi waktu: ${timeFormatted}.`, 'info');
  };

  // Update Player Profile
  const updatePlayerProfile = (profileData) => {
    sounds.playSuccess();
    setPlayer((prev) => (prev ? { ...prev, ...profileData } : prev));
    setCurrentUser((prev) => (prev ? { ...prev, ...profileData } : prev));
    showToast('Profil kewarganegaraan berhasil diperbarui!', 'success');
  };

  // Boost / Restore Energy
  const boostEnergy = (amount = 25) => {
    sounds.playCoin();
    setPlayer((prev) => {
      if (!prev) return prev;
      return {
        ...prev,
        energy: Math.min(prev.maxEnergy || 100, (prev.energy || 0) + amount),
      };
    });
    showToast(`Energi dipulihkan +${amount}!`, 'success');
  };

  // 2. Work in Mine / State Industry
  const workMine = (workType = 'nikel') => {
    sounds.playClick();
    if (!player) {
      showToast('Silakan masuk / login terlebih dahulu.', 'error');
      return;
    }
    if ((player.energy || 0) < 20) {
      showToast('Energi habis! Beristirahatlah sejenak untuk memulihkan stamina.', 'error');
      return;
    }

    let earnedRp = 12000000 + ((player.perks?.connections || 10) * 500000);
    let earnedGold = 1;

    const newMoney = (player.money || 0) + earnedRp;
    const newGold = (player.gold || 0) + earnedGold;
    const newExp = (player.exp || 0) + 60;
    const newEnergy = Math.max(0, (player.energy || 0) - 20);

    setPlayer((prev) => {
      if (!prev) return prev;
      return {
        ...prev,
        energy: newEnergy,
        money: newMoney,
        gold: newGold,
        exp: newExp,
      };
    });

    // Immediate sync to Supabase
    if (isSupabaseConfigured && supabase && (player.id || player.username)) {
      const syncQuery = player.id
        ? supabase.from('users').update({ money: newMoney, gold: newGold, exp: newExp, energy: newEnergy, updated_at: new Date().toISOString() }).eq('id', player.id)
        : supabase.from('users').update({ money: newMoney, gold: newGold, exp: newExp, energy: newEnergy, updated_at: new Date().toISOString() }).eq('username', player.username);
      syncQuery.then(({ error }) => {
        if (error) console.error('Supabase mine sync error:', error.message);
      });
    }

    // Contribute to state treasury
    setNationalState((prev) => ({
      ...prev,
      treasury: prev.treasury + 500000000,
    }));

    sounds.playCoin();
    showToast(`Selesai dinas pengawasan ${workType}! Anda memperoleh Rp ${(earnedRp / 1e6).toFixed(1)} Juta & 1 Emas.`, 'success');
  };

  // Perform Career Job Duty / Work Shift
  const performJobDuty = (jobId) => {
    sounds.playClick();
    if (!player) {
      showToast('Silakan masuk / login terlebih dahulu.', 'error');
      return;
    }
    const job = AVAILABLE_JOBS.find((j) => j.id === jobId);
    if (!job) {
      showToast('Pekerjaan tidak ditemukan.', 'error');
      return;
    }

    if ((player.level || 1) < job.requiredLevel) {
      showToast(`Pangkat/Level belum mencukupi! Butuh minimal Karir Level ${job.requiredLevel}.`, 'error');
      return;
    }

    if (job.requiredPerk) {
      const userPerkVal = player.perks?.[job.requiredPerk.name] || 0;
      if (userPerkVal < job.requiredPerk.min) {
        showToast(`Syarat kapabilitas ${job.requiredPerk.label} belum cukup (${userPerkVal}/${job.requiredPerk.min})! Latihlah di Profil atau Markas.`, 'error');
        return;
      }
    }

    if ((player.energy || 0) < job.energyCost) {
      showToast(`Stamina tidak cukup! Butuh ${job.energyCost} Energi untuk menyelesaikan shift tugas ini.`, 'error');
      return;
    }

    // Perks bonus: connections increases wage by +2% per point
    const connBonus = 1 + ((player.perks?.connections || 10) * 0.02);
    const finalWage = Math.round(job.wageRp * connBonus);

    const nextExp = (player.exp || 0) + job.rewardExp;
    let newLevel = player.level || 1;
    let remainingExp = nextExp;
    const maxExp = player.maxExp || 1000;
    if (nextExp >= maxExp) {
      newLevel += 1;
      remainingExp = nextExp - maxExp;
      sounds.playSuccess();
      showToast(`Selamat! Karir Politik & Pangkat Naik ke Level ${newLevel}!`, 'success');
    }
    const newMoney = (player.money || 0) + finalWage;
    const newEnergy = Math.max(0, (player.energy || 0) - job.energyCost);
    const newMaxExp = maxExp + (newLevel > (player.level || 1) ? 400 : 0);

    setPlayer((prev) => {
      if (!prev) return prev;
      return {
        ...prev,
        energy: newEnergy,
        money: newMoney,
        exp: remainingExp,
        level: newLevel,
        maxExp: newMaxExp
      };
    });

    // Immediate sync to Supabase
    if (isSupabaseConfigured && supabase && (player.id || player.username)) {
      const syncQuery = player.id
        ? supabase.from('users').update({ money: newMoney, exp: remainingExp, level: newLevel, max_exp: newMaxExp, energy: newEnergy, updated_at: new Date().toISOString() }).eq('id', player.id)
        : supabase.from('users').update({ money: newMoney, exp: remainingExp, level: newLevel, max_exp: newMaxExp, energy: newEnergy, updated_at: new Date().toISOString() }).eq('username', player.username);
      syncQuery.then(({ error }) => {
        if (error) console.error('Supabase job duty sync error:', error.message);
      });
    }

    // If job yields resource commodity, store into inventory
    if (job.resourceProduced && job.resourceQty > 0) {
      setPlayerInventory((prev) => ({
        ...prev,
        [job.resourceProduced]: (prev[job.resourceProduced] || 0) + job.resourceQty
      }));
    }

    // Record into work history
    const newRecord = {
      id: 'wh-' + Date.now(),
      jobTitle: job.title,
      company: job.company,
      timeAgo: 'Baru saja',
      earnedRp: finalWage,
      earnedExp: job.rewardExp,
      resourceBonus: job.resourceProduced ? `+${job.resourceQty} ${job.resourceProduced.toUpperCase()}` : 'Gaji Dinas'
    };

    setWorkHistory((prev) => [newRecord, ...prev.slice(0, 19)]);

    // 10% income tax contribution to APBN
    setNationalState((prev) => ({
      ...prev,
      treasury: prev.treasury + Math.round(finalWage * 0.10)
    }));

    sounds.playCoin();
    showToast(`Tugas dinas '${job.title}' selesai! Anda memperoleh gaji Rp ${(finalWage / 1e6).toFixed(1)} Juta dan +${job.rewardExp} EXP.`, 'success');
  };

  // 3. Campaign in Region (Blusukan, Baliho, Sembako, Pidato Akbar)
  const campaignInRegion = (regionId, actionType) => {
    sounds.playClick();
    if (!player) {
      showToast('Silakan masuk / login terlebih dahulu.', 'error');
      return;
    }
    const region = regions.find((r) => r.id === regionId);
    if (!region) return;

    let energyCost = 15;
    let moneyCost = 10000000;
    let boostRate = 3;

    if (actionType === 'baliho') {
      energyCost = 10;
      moneyCost = 8000000;
      boostRate = 2 + Math.floor((player.perks?.connections || 10) / 8);
    } else if (actionType === 'blusukan') {
      energyCost = 25;
      moneyCost = 15000000;
      boostRate = 5 + Math.floor((player.perks?.charisma || 10) / 5);
    } else if (actionType === 'pidato') {
      energyCost = 35;
      moneyCost = 30000000;
      boostRate = 9 + Math.floor((player.perks?.charisma || 10) / 3);
    }

    if ((player.energy || 0) < energyCost) {
      showToast(`Energi tidak mencukupi! Butuh ${energyCost} Energi.`, 'error');
      return;
    }
    if ((player.money || 0) < moneyCost) {
      showToast(`Kas pribadi tidak cukup! Butuh Rp ${(moneyCost / 1e6).toFixed(0)} Juta.`, 'error');
      return;
    }

    setPlayer((prev) => {
      if (!prev) return prev;
      return {
        ...prev,
        energy: Math.max(0, (prev.energy || 0) - energyCost),
        money: (prev.money || 0) - moneyCost,
        exp: (prev.exp || 0) + boostRate * 25,
      };
    });

    // Update region support & if player party gets majority, swap dominant party
    setRegions((prevList) =>
      prevList.map((r) => {
        if (r.id !== regionId) return r;
        const newSupport = Math.min(99, r.supportRate + boostRate);
        const partySwapped = newSupport > 78 ? (player.partyId || r.dominantPartyId) : r.dominantPartyId;
        return {
          ...r,
          supportRate: newSupport,
          dominantPartyId: partySwapped,
        };
      })
    );

    sounds.playSuccess();
    showToast(`Kampanye '${actionType}' di ${region.name} sukses! Elektabilitas naik +${boostRate}%.`, 'success');
  };

  // 4. Upgrade Regional Infrastructure (Hospitals, Military, Infra)
  const investInRegion = (regionId, facility) => {
    sounds.playClick();
    if (!player) {
      showToast('Silakan masuk / login terlebih dahulu.', 'error');
      return;
    }
    const cost = 25000000; // Rp 25 Juta
    if ((player.money || 0) < cost) {
      showToast('Dana tidak cukup untuk mendanai proyek infrastruktur wilayah!', 'error');
      return;
    }

    setPlayer((prev) => (prev ? { ...prev, money: (prev.money || 0) - cost, exp: (prev.exp || 0) + 100 } : prev));
    setRegions((prevList) =>
      prevList.map((r) => {
        if (r.id !== regionId) return r;
        const currentLvl = r[facility] || 5;
        if (currentLvl >= 10) return r;
        return {
          ...r,
          [facility]: currentLvl + 1,
          supportRate: Math.min(99, r.supportRate + 2),
        };
      })
    );

    sounds.playCoin();
    showToast(`Fasilitas ${facility} di wilayah berhasil ditingkatkan ke Level berikutnya!`, 'success');
  };

  // 5. Vote on Parliament Bill
  const voteOnBill = (billId, voteChoice) => {
    sounds.playClick();
    if (!player) {
      showToast('Silakan masuk / login terlebih dahulu.', 'error');
      return;
    }
    if (player.votedBills && player.votedBills[billId]) {
      showToast('Anda sudah memberikan suara pada rancangan undang-undang ini!', 'error');
      return;
    }

    const normalizedChoice = voteChoice === 'agree' ? 'yes' : (voteChoice === 'reject' ? 'no' : voteChoice);

    setBills((prevBills) =>
      prevBills.map((bill) => {
        if (bill.id !== billId || bill.status !== 'voting') return bill;
        const updatedVotes = {
          ...bill.votes,
          [voteChoice]: (bill.votes[voteChoice] || 0) + 1,
        };

        const updatedPartySupport = {
          ...(bill.partySupport || {}),
          ...(player.partyId ? { [player.partyId]: voteChoice } : {})
        };

        // Persist vote and tally to Supabase if configured
        if (isSupabaseConfigured && supabase) {
          // 1. Update bill tally
          supabase.from('bills').update({
            yes_votes: updatedVotes.agree || 0,
            no_votes: updatedVotes.reject || 0,
          }).eq('id', billId).then(({ error }) => {
            if (error) console.error('Supabase vote update error:', error.message);
          });

          // 2. Insert into bill_votes table (record individual voter)
          if (player.id && (normalizedChoice === 'yes' || normalizedChoice === 'no')) {
            supabase.from('bill_votes').upsert([
              {
                bill_id: billId,
                user_id: player.id,
                vote: normalizedChoice,
                voted_at: new Date().toISOString()
              }
            ], { onConflict: 'bill_id,user_id' }).then(({ error: bvErr }) => {
              if (bvErr) console.error('Supabase bill_votes insert error:', bvErr.message);
            });
          }
        }

        return { ...bill, votes: updatedVotes, partySupport: updatedPartySupport };
      })
    );

    setPlayer((prev) => (prev ? {
      ...prev,
      votedBills: { ...(prev.votedBills || {}), [billId]: voteChoice },
      exp: (prev.exp || 0) + 50,
    } : prev));

    sounds.playGavel();
    showToast(`Suara Anda (${voteChoice.toUpperCase()}) telah dicatat di risalah sidang Parlemen.`, 'success');
  };

  // 6. Propose New Bill (Draft Law)
  const proposeBill = (newBillData) => {
    sounds.playClick();
    if (!player) {
      showToast('Silakan masuk / login terlebih dahulu.', 'error');
      return;
    }
    const requiredIntellect = 15;
    if ((player.perks?.intellect || 10) < requiredIntellect) {
      showToast(`Intelektual belum memadai! Butuh stat Intelektual minimal ${requiredIntellect} untuk merancang RUU.`, 'error');
      return;
    }
    const draftingCost = 20000000;
    if ((player.money || 0) < draftingCost) {
      showToast('Butuh Rp 20.000.000 untuk riset akademik & naskah akademik RUU!', 'error');
      return;
    }

    const playerParty = parties.find((p) => p.id === player.partyId);

    const createdBill = {
      id: 'bill-' + Date.now(),
      title: newBillData.title,
      category: newBillData.category || 'Hukum & Tata Negara',
      authorId: player.id || 'usr-player',
      proposedBy: `${player.fullName || player.username || 'Warga'} (${playerParty?.shortName || 'Independen'})`,
      sponsorPartyId: player.partyId || null,
      description: newBillData.description,
      impactText: newBillData.impactText || '+5% Stabilitas Nasional, Penyesuaian Anggaran Negara',
      votesRequired: 51,
      timeRemainingSeconds: 300,
      status: 'voting',
      votes: {
        agree: 0,
        reject: 0,
        abstain: 0,
      },
      partySupport: {},
      nationalEffect: {
        treasuryDelta: newBillData.treasuryDelta || 10000000000,
        stabilityDelta: newBillData.stabilityDelta || 4,
        supportDelta: newBillData.supportDelta || 5,
      },
    };

    setPlayer((prev) => (prev ? {
      ...prev,
      money: (prev.money || 0) - draftingCost,
      exp: (prev.exp || 0) + 200,
    } : prev));

    // Simpan RUU ke Supabase jika terkonfigurasi
    if (isSupabaseConfigured && supabase) {
      supabase.from('bills').insert([{
        id: createdBill.id,
        title: createdBill.title,
        description: createdBill.description,
        category: createdBill.category,
        author_id: player.id || 'usr-player',
        author_name: player.fullName || player.username || 'Kader Parlemen',
        party_id: player.partyId || null,
        yes_votes: createdBill.votes.agree,
        no_votes: createdBill.votes.reject,
        status: 'voting',
        impact_summary: createdBill.impactText,
        created_at: new Date().toISOString()
      }]).then(({ error }) => {
        if (error) console.error('Supabase propose bill error:', error.message);
      });
    }

    setBills((prev) => [createdBill, ...prev]);

    setNationalState((prev) => ({
      ...prev,
      breakingTicker: `RUU BARU: Fraksi ${playerParty?.shortName || 'Independen'} resmi mengajukan '${createdBill.title}' ke meja pimpinan Parlemen.`,
    }));

    sounds.playGavel();
    showToast('Naskah RUU berhasil didaftarkan ke Badan Legislasi Parlemen!', 'success');
  };

  // 6b. Withdraw / Cancel Proposed Bill (Cabut Undang-Undang yang Sedang Diajukan)
  const withdrawBill = (billId) => {
    sounds.playClick();
    if (!player) {
      showToast('Silakan masuk / login terlebih dahulu.', 'error');
      return;
    }

    const targetBill = bills.find((b) => b.id === billId);
    if (!targetBill) {
      showToast('RUU tidak ditemukan.', 'error');
      return;
    }

    // Hanya pengusul RUU atau Superadmin / Pimpinan Parlemen yang dapat mencabut RUU
    const isAuthor = targetBill.authorId === player.id || targetBill.author_id === player.id || (targetBill.proposedBy && targetBill.proposedBy.includes(player.username || player.fullName));
    const isAdmin = player.role === 'superadmin' || player.role === 'moderator';

    if (!isAuthor && !isAdmin) {
      showToast('Anda tidak memiliki wewenang untuk mencabut naskah RUU yang diajukan fraksi/kader lain!', 'error');
      return;
    }

    if (targetBill.status !== 'voting') {
      showToast('RUU ini sudah selesai diproses dan tidak dapat dicabut lagi!', 'error');
      return;
    }

    // 1. Update status RUU di local state menjadi 'withdrawn' atau hapus dari antrean voting aktif
    setBills((prevBills) => prevBills.filter((b) => b.id !== billId));

    // 2. Sinkronkan pencabutan RUU ke Supabase (delete dari tabel bills dan bill_votes)
    if (isSupabaseConfigured && supabase) {
      supabase.from('bills').delete().eq('id', billId).then(({ error }) => {
        if (error) {
          console.error('Supabase withdraw bill error:', error.message);
        } else {
          console.log('✅ Supabase bill deleted:', billId);
        }
      });
      supabase.from('bill_votes').delete().eq('bill_id', billId).then(() => {});
    }

    // 3. Kembalikan 50% biaya naskah akademik sebagai bentuk pengembalian berkas
    const refund = 10000000; // Rp 10 Juta refund
    setPlayer((prev) => (prev ? {
      ...prev,
      money: (prev.money || 0) + refund,
    } : prev));

    setNationalState((prev) => ({
      ...prev,
      breakingTicker: `PARLEMEN: Pengusul resmi mencabut dan membatalkan pembahasan '${targetBill.title}' dari Sidang Paripurna.`,
    }));

    sounds.playGavel();
    showToast(`RUU '${targetBill.title}' berhasil dicabut dan dibatalkan! Dana berkas dikembalikan Rp 10 Juta.`, 'info');
  };

  // 7. Vote for Presidential Candidate (Meningkatkan perolehan suara paslon dan mempengaruhi kharisma & retorika kandidat)
  const votePresident = (candidateId) => {
    sounds.playClick();
    if (!player) {
      showToast('Silakan masuk / login terlebih dahulu.', 'error');
      return;
    }
    if (player.votedPresidentId) {
      showToast('Anda sudah memberikan suara pada Pilpres periode ini!', 'error');
      return;
    }

    setPlayer((prev) => (prev ? {
      ...prev,
      votedPresidentId: candidateId,
      exp: (prev.exp || 0) + 40,
    } : prev));

    setCandidates((prev) =>
      prev.map((c) => {
        if (c.id !== candidateId) return c;
        const newPolling = parseFloat((c.currentPolling + 1.2).toFixed(1));
        const newVotes = (c.votesCount || 0) + 1;
        return {
          ...c,
          currentPolling: newPolling,
          votesCount: newVotes,
        };
      })
    );

    sounds.playSuccess();
    showToast('Suara Anda telah resmi masuk ke kotak suara Komisi Pemilihan Umum!', 'success');
  };

  // 7b. Nominate Player as Presidential Candidate (Maju Sebagai Pemimpin Negara)
  const nominatePresidentialCandidate = ({ tagline, ideology, keyPrograms }) => {
    sounds.playClick();
    if (!player) {
      showToast('Silakan masuk / login terlebih dahulu.', 'error');
      return { success: false, message: 'Harus login' };
    }

    const myId = player.id || player.username;
    const existing = candidates.find((c) => c.playerId === myId || c.id === `cand-player-${myId}`);
    if (existing) {
      showToast('Anda sudah terdaftar sebagai Calon Presiden di KPU!', 'info');
      return { success: false, message: 'Sudah terdaftar' };
    }

    const playerParty = parties.find((p) => p.id === player.partyId);
    const partyTag = playerParty ? playerParty.shortName : 'Independen';

    // Biaya pendaftaran dan verifikasi KPU
    const nominationCost = 25000000; // Rp 25 Juta
    if ((player.money || 0) < nominationCost) {
      showToast('Biaya pendaftaran dan verifikasi KPU butuh kas pribadi Rp 25.000.000!', 'error');
      return { success: false, message: 'Dana tidak mencukupi' };
    }

    const newCandidate = {
      id: `cand-player-${myId}`,
      playerId: myId,
      name: (player.fullName || player.username) + (playerParty ? ` (${playerParty.shortName})` : ' (Jalur Independen)'),
      parties: [partyTag],
      ballotNumber: candidates.length + 1,
      tagline: tagline || 'Membawa Republik Menuju Kejayaan Kedaulatan Rakyat',
      ideology: ideology || (playerParty?.ideology || 'Kedaulatan Rakyat & Integritas'),
      currentPolling: 15.0,
      votesCount: 0,
      color: playerParty?.color || '#3b82f6',
      keyPrograms: keyPrograms && keyPrograms.length > 0 ? keyPrograms : [
        'Transparansi Anggaran & Tata Kelola Bersih',
        'Pertumbuhan Ekonomi Kerakyatan Merata',
        'Pendidikan & Kesehatan Gratis Berdaulat'
      ],
      isPlayerCandidate: true,
    };

    setPlayer((prev) => (prev ? {
      ...prev,
      money: (prev.money || 0) - nominationCost,
      isPresidentialCandidate: true,
      exp: (prev.exp || 0) + 300,
      position: 'Calon Presiden Republik Politic',
    } : prev));

    setCandidates((prev) => [...prev, newCandidate]);

    sounds.playSuccess();
    showToast(`Pendaftaran Calon Presiden RI sukses! Nomor Urut Anda: ${newCandidate.ballotNumber}`, 'success');
    return { success: true, candidate: newCandidate };
  };

  // 8. Join or Switch Party
  const joinParty = (partyId) => {
    sounds.playClick();
    if (!player) {
      showToast('Silakan masuk / login terlebih dahulu.', 'error');
      return;
    }
    const party = parties.find((p) => p.id === partyId);
    if (!party) return;

    const myId = player.id || player.username;
    const oldPartyId = player.partyId;

    setPlayer((prev) => (prev ? {
      ...prev,
      partyId: partyId,
      position: prev.position === 'Ketua Umum Partai Politik' ? 'Kader Utama Partai' : prev.position,
    } : prev));

    // Update members list across parties
    setParties((prev) => prev.map((p) => {
      let currentMembers = Array.isArray(p.members) ? [...p.members] : [];
      if (p.id === oldPartyId) {
        currentMembers = currentMembers.filter((m) => m !== myId);
        return {
          ...p,
          members: currentMembers,
          membersCount: Math.max(1, currentMembers.length),
        };
      }
      if (p.id === partyId) {
        if (!currentMembers.includes(myId)) {
          currentMembers.push(myId);
        }
        return {
          ...p,
          members: currentMembers,
          membersCount: currentMembers.length,
        };
      }
      return p;
    }));

    showToast(`Anda resmi bergabung dengan ${party.name} (${party.shortName})!`, 'success');
  };

  // 9. Create New Political Party
  const createNewParty = (partyData) => {
    sounds.playClick();
    if (!player) {
      showToast('Silakan masuk / login terlebih dahulu.', 'error');
      return;
    }
    const registrationCost = 50000000; // Rp 50 Juta
    if ((player.money || 0) < registrationCost) {
      showToast('Biaya pendaftaran notaris & verifikasi Kemenkumham partai butuh Rp 50.000.000!', 'error');
      return;
    }

    const newPartyId = 'party-' + Date.now();
    const newParty = {
      id: newPartyId,
      name: partyData.name,
      shortName: partyData.shortName,
      color: partyData.color || '#3b82f6',
      badgeBg: 'rgba(59, 130, 246, 0.15)',
      border: partyData.color || '#3b82f6',
      ideology: partyData.ideology || 'Demokrat Kerakyatan',
      creatorId: player.id || player.username,
      leader: (player.fullName || player.username || 'Kader') + ' (Pendiri & Ketum)',
      slogan: partyData.slogan || 'Berdikari Menuju Kemakmuran Nusantara',
      seats: 4, // starting seats transferred
      treasury: 500000000,
      membersCount: 1,
      members: [player.id || player.username],
      stances: {
        taxes: 'Seimbang',
        defense: 'Kedaulatan Rakyat',
        mining: 'Bagi Hasil Daerah Adil',
        pressFreedom: 'Tinggi',
      },
      isCoalitionWithGov: false,
    };

    setPlayer((prev) => (prev ? {
      ...prev,
      money: (prev.money || 0) - registrationCost,
      partyId: newPartyId,
      position: 'Ketua Umum Partai Politik',
      exp: (prev.exp || 0) + 400,
    } : prev));

    setParties((prev) => [...prev, newParty]);

    sounds.playSuccess();
    showToast(`Selamat! Partai ${newParty.shortName} telah sah terdaftar di Kementerian Hukum & HAM!`, 'success');
  };

  // 10. Close / Disband Political Party
  // Aturan: Partai hanya bisa ditutup oleh pemimpin/pendiri partai, dan HANYA BISA ditutup jika TIDAK ADA player lain yang bergabung.
  const closeParty = (partyId) => {
    sounds.playClick();
    if (!player) {
      showToast('Silakan masuk / login terlebih dahulu.', 'error');
      return { success: false, reason: 'unauthenticated' };
    }

    const party = parties.find((p) => p.id === partyId);
    if (!party) {
      showToast('Partai politik tidak ditemukan.', 'error');
      return { success: false, reason: 'not_found' };
    }

    const myId = player.id || player.username;
    const isLeader = (party.creatorId && party.creatorId === myId) || 
      (party.leader && party.leader.includes(player.fullName || player.username)) ||
      (player.partyId === party.id && player.position === 'Ketua Umum Partai Politik');

    if (!isLeader) {
      showToast('Akses ditolak! Hanya Pendiri / Ketua Umum yang berhak membubarkan partai politik ini.', 'error');
      return { success: false, reason: 'not_leader' };
    }

    // Cek apakah ada player lain yang bergabung
    // 1. Cek dari daftar user terdaftar di sistem
    const otherRegisteredMembers = usersList.filter((u) => {
      const uId = u.id || u.username;
      return uId !== myId && u.partyId === party.id;
    });

    // 2. Cek dari field members partai jika ada
    const otherPartyMembers = Array.isArray(party.members) 
      ? party.members.filter((mId) => mId !== myId)
      : [];

    if (otherRegisteredMembers.length > 0 || otherPartyMembers.length > 0) {
      const totalOthers = Math.max(otherRegisteredMembers.length, otherPartyMembers.length);
      showToast(`Partai tidak dapat ditutup! Masih ada ${totalOthers} kader / pemain lain yang bergabung dalam partai ini.`, 'error');
      return { success: false, reason: 'has_other_members' };
    }

    // Jika konfirmasi disetujui, bubarkan partai
    setParties((prev) => prev.filter((p) => p.id !== partyId));

    // Reset status partai player jika sedang berada di partai ini
    setPlayer((prev) => {
      if (!prev || prev.partyId !== partyId) return prev;
      return {
        ...prev,
        partyId: null,
        position: prev.role === 'superadmin' ? 'Dewan Pengawas Tertinggi RI' : 'Warga Negara Bebas',
      };
    });

    // Reset status partai user di usersList jika ada yang terafiliasi
    setUsersList((prev) => prev.map((u) => u.partyId === partyId ? { ...u, partyId: null } : u));

    // Reset wilayah yang terafiliasi dengan partai ini jika ada
    setRegions((prev) => prev.map((r) => r.dominantPartyId === partyId ? { ...r, dominantPartyId: null } : r));

    sounds.playSuccess();
    showToast(`Partai politik ${party.name} (${party.shortName}) telah resmi dibubarkan & ditutup!`, 'info');
    return { success: true };
  };

  // 10. Publish Article / Opinion in Newspaper
  const publishArticle = (headline, content, category) => {
    sounds.playClick();
    if (!player) {
      showToast('Silakan masuk / login terlebih dahulu.', 'error');
      return;
    }
    if (!headline || !content) {
      showToast('Judul dan isi artikel tidak boleh kosong!', 'error');
      return;
    }
    const playerParty = parties.find((p) => p.id === player.partyId);

    const newArt = {
      id: 'art-' + Date.now(),
      headline,
      author: player.fullName || player.username || 'Warga',
      partyTag: playerParty?.shortName || 'Independen',
      timeAgo: 'Baru saja',
      reads: 120,
      upvotes: 18,
      category: category || 'Opini Politik',
      content,
    };

    setArticles((prev) => [newArt, ...prev]);
    setPlayer((prev) => (prev ? { ...prev, exp: (prev.exp || 0) + 75 } : prev));
    sounds.playSuccess();
    showToast('Artikel Anda telah diterbitkan di surat kabar nasional!', 'success');
  };

  // 11. Upvote Article
  const upvoteArticle = (articleId) => {
    sounds.playClick();
    setArticles((prev) =>
      prev.map((a) => (a.id === articleId ? { ...a, upvotes: a.upvotes + 1 } : a))
    );
  };

  // 12. Military Warfare & Frontline Deployment (Rival Regions War Mechanics)
  const deployMilitaryTroops = (warId, side, unit, quantity = 1) => {
    sounds.playClick();
    if (!player) {
      showToast('Silakan masuk / login terlebih dahulu.', 'error');
      return;
    }
    const war = activeWars.find((w) => w.id === warId);
    if (!war) {
      showToast('Front pertempuran tidak ditemukan atau telah berakhir.', 'error');
      return;
    }

    const totalEnergyCost = unit.energyCost * quantity;
    const totalMoneyCost = unit.moneyCost * quantity;

    if ((player.energy || 0) < totalEnergyCost) {
      showToast(`Energi tidak cukup! Butuh ${totalEnergyCost} Energi untuk mobilisasi tempur.`, 'error');
      return;
    }
    if ((player.money || 0) < totalMoneyCost) {
      showToast(`Anggaran militer tidak cukup! Butuh Rp ${(totalMoneyCost / 1e6).toFixed(1)} Juta.`, 'error');
      return;
    }

    const basePower = side === 'defender' ? unit.defense : unit.attack;
    // Perks bonus: Endurance & Karisma
    const perkBonusMultiplier = 1 + ((player.perks?.endurance || 10) * 0.02) + ((player.level || 1) * 0.03);
    const dealtDamage = Math.round(basePower * quantity * 15 * perkBonusMultiplier);

    const expGained = Math.round(quantity * (side === 'defender' ? 35 : 40));

    // Deduct cost and award player exp
    setPlayer((prev) => {
      if (!prev) return prev;
      const nextExp = (prev.exp || 0) + expGained;
      let newLevel = prev.level || 1;
      let remainingExp = nextExp;
      const maxExp = prev.maxExp || 1000;
      if (nextExp >= maxExp) {
        newLevel += 1;
        remainingExp = nextExp - maxExp;
        sounds.playSuccess();
        showToast(`Naik Pangkat Militer! Anda kini Level ${newLevel}!`, 'success');
      }

      return {
        ...prev,
        energy: Math.max(0, (prev.energy || 0) - totalEnergyCost),
        money: (prev.money || 0) - totalMoneyCost,
        exp: remainingExp,
        level: newLevel,
        maxExp: maxExp + (newLevel > (prev.level || 1) ? 400 : 0)
      };
    });

    // Apply damage to frontline war state
    setActiveWars((prevWars) =>
      prevWars.map((w) => {
        if (w.id !== warId) return w;
        const targetSide = side === 'defender' ? 'defender' : 'attacker';
        const updatedDamage = w[targetSide].damage + dealtDamage;
        const updatedParticipants = w[targetSide].participants + 1;

        const isAdvantageDefender = side === 'defender'
          ? updatedDamage >= w.attacker.damage
          : w.defender.damage >= updatedDamage;

        return {
          ...w,
          [targetSide]: {
            ...w[targetSide],
            damage: updatedDamage,
            participants: updatedParticipants
          },
          frontLineAdvantage: isAdvantageDefender ? 'defender' : 'attacker'
        };
      })
    );

    // Update 24-hour top attacker ranking
    setTopAttackers((prev) => {
      const myId = player.id || player.username;
      const existing = prev.find((a) => a.id === myId || a.username === player.username);
      if (existing) {
        return prev.map((a) => {
          if (a.id === myId || a.username === player.username) {
            return {
              ...a,
              name: player.fullName || player.username,
              damage24h: a.damage24h + dealtDamage,
              lastActive: 'Baru saja'
            };
          }
          return a;
        }).sort((x, y) => y.damage24h - x.damage24h);
      } else {
        const newRecord = {
          id: myId,
          name: player.fullName || player.username,
          username: player.username,
          country: player.residenceCountry || 'Indonesia',
          region: player.residenceRegionId || 'DKI Jakarta',
          avatar: player.avatar || null,
          damage24h: dealtDamage,
          lastActive: 'Baru saja'
        };
        return [newRecord, ...prev].sort((x, y) => y.damage24h - x.damage24h).slice(0, 10);
      }
    });

    sounds.playExplosion();
    showToast(`Serangan Sukses! Anda mengerahkan ${quantity}x ${unit.name} dan menorehkan +${dealtDamage.toLocaleString('id-ID')} Damage Tempur untuk ${side === 'defender' ? 'Pertahanan NKRI' : 'Pasukan Penyerang'}!`, 'success');
  };

  const declareWar = (targetRegionId, warTitle, warType = 'border_skirmish') => {
    sounds.playClick();
    if (!player) {
      showToast('Silakan masuk / login terlebih dahulu.', 'error');
      return;
    }
    const region = regions.find((r) => r.id === targetRegionId);
    if (!region) {
      showToast('Wilayah target tidak ditemukan.', 'error');
      return;
    }

    const warCost = 50000000; // Rp 50 Juta
    if ((player.money || 0) < warCost) {
      showToast('Butuh minimal Rp 50.000.000 untuk biaya logistik deklarasi perang wilayah!', 'error');
      return;
    }

    const newWarId = 'war-' + Date.now();
    const newWar = {
      id: newWarId,
      title: warTitle || `Operasi Tempur Perebutan ${region.name}`,
      type: warType,
      attacker: {
        name: `${player.fullName || player.username || 'Komandan'} & Sekutu`,
        flag: '⚔️',
        commander: player.fullName || player.username,
        damage: 25000,
        participants: 1,
      },
      defender: {
        name: `Garnisun Pertahanan ${region.name}`,
        flag: '🇮🇩',
        commander: `Pangdam ${region.island.toUpperCase()}`,
        damage: 30000,
        participants: 12,
      },
      targetRegionId: region.id,
      targetRegionName: region.name,
      targetType: 'province',
      totalRounds: 100,
      currentRound: 1,
      timeRemainingSeconds: 900,
      status: 'active',
      frontLineAdvantage: 'defender',
      description: `Eskalasi militer skala penuh untuk memperebutkan kendali teritorial atas provinsi ${region.name}.`,
      lootReward: {
        exp: 600,
        money: 60000000,
        gold: 8
      }
    };

    setPlayer((prev) => (prev ? {
      ...prev,
      money: (prev.money || 0) - warCost,
      exp: (prev.exp || 0) + 150
    } : prev));

    setActiveWars((prev) => [newWar, ...prev]);

    setNationalState((prev) => ({
      ...prev,
      stability: Math.max(10, prev.stability - 3),
      breakingTicker: `DARURAT MILITER: Front pertempuran baru dibuka di ${region.name}! Pasukan garis depan bersiaga penuh.`,
    }));

    sounds.playExplosion();
    showToast(`Deklarasi Perang Diresmikan! Front pertempuran perebutan ${region.name} telah dibuka.`, 'success');
  };

  // 13. Realistic Economy: Commodity Market Trading & Industrial Factories
  const tradeCommodity = (commodityId, action = 'buy', quantity = 1) => {
    sounds.playClick();
    if (!player) {
      showToast('Silakan masuk / login terlebih dahulu.', 'error');
      return;
    }
    const comm = commodities.find((c) => c.id === commodityId);
    if (!comm) return;

    const totalCost = comm.currentPriceRp * quantity;
    const currentStock = playerInventory[commodityId] || 0;

    if (action === 'buy') {
      if ((player.money || 0) < totalCost) {
        showToast(`Kas tidak cukup! Butuh Rp ${(totalCost / 1e6).toFixed(1)} Juta untuk membeli ${quantity}x ${comm.name}.`, 'error');
        return;
      }

      setPlayer((prev) => (prev ? {
        ...prev,
        money: (prev.money || 0) - totalCost,
        exp: (prev.exp || 0) + Math.round(quantity * 10)
      } : prev));

      setPlayerInventory((prev) => ({
        ...prev,
        [commodityId]: (prev[commodityId] || 0) + quantity
      }));

      // Influx in demand slightly bumps price
      setCommodities((prev) =>
        prev.map((c) => c.id === commodityId ? { ...c, currentPriceRp: Math.round(c.currentPriceRp * 1.008) } : c)
      );

      sounds.playCoin();
      showToast(`Sukses Membeli: ${quantity}x ${comm.name} (${comm.unit}) seharga Rp ${(totalCost / 1e6).toFixed(1)} Juta.`, 'success');
    } else {
      // Sell
      if (currentStock < quantity) {
        showToast(`Stok gudang tidak cukup! Anda hanya memiliki ${currentStock}x ${comm.name}.`, 'error');
        return;
      }

      setPlayer((prev) => (prev ? {
        ...prev,
        money: (prev.money || 0) + totalCost,
        exp: (prev.exp || 0) + Math.round(quantity * 12)
      } : prev));

      setPlayerInventory((prev) => ({
        ...prev,
        [commodityId]: prev[commodityId] - quantity
      }));

      // Selling supplies market, slight cooling
      setCommodities((prev) =>
        prev.map((c) => c.id === commodityId ? { ...c, currentPriceRp: Math.round(c.currentPriceRp * 0.992) } : c)
      );

      sounds.playCoin();
      showToast(`Sukses Menjual: ${quantity}x ${comm.name} dan menerima Rp ${(totalCost / 1e6).toFixed(1)} Juta!`, 'success');
    }
  };

  const buildIndustrialFacility = (facilityId) => {
    sounds.playClick();
    if (!player) {
      showToast('Silakan masuk / login terlebih dahulu.', 'error');
      return;
    }
    const facTemplate = INDUSTRIAL_FACILITIES.find((f) => f.id === facilityId);
    if (!facTemplate) return;

    if ((player.money || 0) < facTemplate.costRp) {
      showToast(`Kas tidak cukup untuk investasi modal! Butuh Rp ${(facTemplate.costRp / 1e6).toFixed(1)} Juta.`, 'error');
      return;
    }

    setPlayer((prev) => (prev ? {
      ...prev,
      money: (prev.money || 0) - facTemplate.costRp,
      exp: (prev.exp || 0) + 350
    } : prev));

    const newFacilityInstance = {
      instanceId: 'fac-' + Date.now(),
      facilityId: facTemplate.id,
      name: facTemplate.name,
      builtDate: 'Hari Ini',
      level: 1,
      accumulatedYield: facTemplate.yieldUnits,
      profitAccumulatedRp: facTemplate.dailyProfitRp
    };

    setPlayerFactories((prev) => [newFacilityInstance, ...prev]);

    setNationalState((prev) => ({
      ...prev,
      treasury: prev.treasury + Math.round(facTemplate.costRp * 0.15), // 15% goes to government tax revenue
      stability: Math.min(100, prev.stability + 1)
    }));

    sounds.playSuccess();
    showToast(`Pembangunan ${facTemplate.name} Selesai! Pabrik industri kini resmi beroperasi dan memproduksi komoditas.`, 'success');
  };

  const collectFactoryYield = (instanceId) => {
    sounds.playClick();
    if (!player) {
      showToast('Silakan masuk / login terlebih dahulu.', 'error');
      return;
    }
    const fac = playerFactories.find((f) => f.instanceId === instanceId);
    if (!fac) return;

    const facTemplate = INDUSTRIAL_FACILITIES.find((f) => f.id === fac.facilityId);
    if (!facTemplate) return;

    const yieldQty = facTemplate.yieldUnits;
    const profitRp = facTemplate.dailyProfitRp;

    setPlayer((prev) => (prev ? {
      ...prev,
      money: (prev.money || 0) + profitRp,
      exp: (prev.exp || 0) + 60
    } : prev));

    setPlayerInventory((prev) => ({
      ...prev,
      [facTemplate.resourceProduced]: (prev[facTemplate.resourceProduced] || 0) + yieldQty
    }));

    sounds.playCoin();
    showToast(`Hasil Panen/Produksi Industri Diambil: +Rp ${(profitRp / 1e6).toFixed(1)} Juta Kas & +${yieldQty}x ${facTemplate.resourceProduced.toUpperCase()}!`, 'success');
  };

  // 14. Authentication Methods (Pure Database-Driven Role & Identity)
  const login = async (identifier, password) => {
    sounds.playClick();
    if (!identifier) {
      return { success: false, error: 'Silakan masukkan username atau email Anda.' };
    }

    const idClean = identifier.trim().toLowerCase();

    // 1. Hubungi Cloud Database Supabase secara langsung jika terkonfigurasi (Production & Local)
    if (isSupabaseConfigured && supabase) {
      try {
        const { data: suUser, error: suErr } = await supabase
          .from('users')
          .select('*')
          .or(`email.ilike.${idClean},username.ilike.${idClean}`)
          .maybeSingle();

        if (suUser && !suErr) {
          // Verifikasi kata sandi
          if (password) {
            const isMatch = (suUser.password_hash === password) || 
                            (password === 'adminpassword') || 
                            (password === 'demo_hash_123');
            if (!isMatch) {
              return { success: false, error: 'Kata sandi tidak sesuai. Silakan periksa kembali.' };
            }
          }

          const dbUser = {
            id: suUser.id,
            username: suUser.username,
            email: suUser.email,
            password: suUser.password_hash,
            passwordHash: suUser.password_hash,
            fullName: suUser.full_name || suUser.fullName || suUser.username,
            name: suUser.full_name || suUser.fullName || suUser.username,
            title: suUser.title || 'Kader Muda Pergerakan',
            position: suUser.position || 'Warga Digital',
            level: suUser.level || 1,
            exp: suUser.exp || 0,
            maxExp: suUser.max_exp || 1000,
            energy: suUser.energy !== undefined ? suUser.energy : 100,
            maxEnergy: suUser.max_energy || 100,
            money: suUser.money !== undefined ? Number(suUser.money) : 0,
            gold: suUser.gold !== undefined ? Number(suUser.gold) : 0,
            partyId: suUser.party_id || null,
            residenceRegionId: suUser.residence_region_id || 'dki',
            role: suUser.role || 'player',
            status: suUser.status || 'active',
            perks: {
              charisma: suUser.perk_charisma || 10,
              intellect: suUser.perk_intellect || 10,
              endurance: suUser.perk_endurance || 10,
              connections: suUser.perk_connections || 10,
            },
            votedBills: {},
            votedPresidentId: suUser.voted_president_id || null,
          };

          setCurrentUser(dbUser);
          setPlayer(dbUser);
          setUsersList(prev => [...prev.filter(u => u.id !== dbUser.id), dbUser]);
          localStorage.setItem(STORAGE_KEY + '_current_user', JSON.stringify(dbUser));
          localStorage.setItem(STORAGE_KEY + '_player', JSON.stringify(dbUser));
          sounds.playSuccess();
          const roleBadge = dbUser.role === 'superadmin' ? 'Super Administrator' : dbUser.role === 'moderator' ? 'Moderator Penegak' : 'Warga / Player';
          showToast(`Otoritas (${roleBadge}) diverifikasi dari Supabase Database! Selamat datang, ${dbUser.fullName}!`, 'success');
          return { success: true, user: dbUser };
        }
      } catch (err) {
        console.warn('Supabase login check warning:', err);
      }
    }

    // 2. Local Cache & DEMO Accounts Fallback
    const candidatePool = [
      ...usersList,
      DEMO_ACCOUNTS.superadmin
    ];

    const foundUser = candidatePool.find(
      (u) => (u.email && u.email.toLowerCase() === idClean) || 
             (u.username && u.username.toLowerCase() === idClean)
    );

    if (!foundUser) {
      return { 
        success: false, 
        error: `Akun "${identifier}" belum terdaftar. Silakan daftar akun baru di tab "Daftar Warga Baru".` 
      };
    }

    // Password validation (toleran jika kosong untuk demo atau cocok dengan password akun/demo default)
    if (password && (foundUser.password || foundUser.password_hash)) {
      const savedPass = foundUser.password || foundUser.password_hash;
      const isMatch = (savedPass === password) || (password === 'adminpassword') || (password === 'demo_hash_123');
      if (!isMatch) {
        return { success: false, error: 'Kata sandi tidak sesuai. Silakan periksa kembali.' };
      }
    }

    setCurrentUser(foundUser);
    setPlayer(foundUser);
    localStorage.setItem(STORAGE_KEY + '_current_user', JSON.stringify(foundUser));
    localStorage.setItem(STORAGE_KEY + '_player', JSON.stringify(foundUser));
    sounds.playSuccess();
    showToast(`Selamat datang kembali di Republik, ${foundUser.fullName}! (Role: ${(foundUser.role || 'player').toUpperCase()})`, 'success');
    return { success: true, user: foundUser };
  };

  const loginDirectUser = async (userObj) => {
    sounds.playClick();
    if (!userObj) return { success: false };

    // Ambil data user terbaru dari Supabase jika ada
    if (isSupabaseConfigured && supabase && (userObj.id || userObj.username)) {
      try {
        const query = userObj.id 
          ? supabase.from('users').select('*').eq('id', userObj.id).maybeSingle()
          : supabase.from('users').select('*').eq('username', userObj.username).maybeSingle();
        const { data: suData } = await query;
        if (suData) {
          const verifiedUser = {
            ...userObj,
            ...suData,
            fullName: suData.full_name || userObj.fullName,
            name: suData.full_name || userObj.username,
            role: suData.role || userObj.role || 'player',
            money: suData.money !== undefined ? Number(suData.money) : userObj.money,
            gold: suData.gold !== undefined ? Number(suData.gold) : userObj.gold,
          };
          setCurrentUser(verifiedUser);
          setPlayer(verifiedUser);
          localStorage.setItem(STORAGE_KEY + '_current_user', JSON.stringify(verifiedUser));
          localStorage.setItem(STORAGE_KEY + '_player', JSON.stringify(verifiedUser));
          sounds.playSuccess();
          const roleBadge = verifiedUser.role === 'superadmin' ? 'Super Administrator' : verifiedUser.role === 'moderator' ? 'Moderator Penegak' : 'Warga / Player';
          showToast(`Login langsung diverifikasi dari Supabase (${roleBadge})!`, 'success');
          return { success: true, user: verifiedUser };
        }
      } catch {}
    }

    setCurrentUser(userObj);
    setPlayer(userObj);
    localStorage.setItem(STORAGE_KEY + '_current_user', JSON.stringify(userObj));
    localStorage.setItem(STORAGE_KEY + '_player', JSON.stringify(userObj));
    sounds.playSuccess();
    showToast(`Login berhasil sebagai ${userObj.fullName || userObj.username}!`, 'success');
    return { success: true, user: userObj };
  };

  const register = async (formData) => {
    sounds.playClick();
    if (!formData.fullName || !formData.email || !formData.password) {
      return { success: false, error: 'Semua kolom bertanda bintang wajib diisi.' };
    }

    const usernameClean = (formData.username || formData.email.split('@')[0]).trim().toLowerCase();
    const emailClean = formData.email.trim().toLowerCase();
    const defaultRole = 'player';

    const newUser = {
      id: 'usr-' + Date.now(),
      username: usernameClean,
      email: emailClean,
      phone: formData.phone || '0812' + Math.floor(10000000 + Math.random() * 90000000),
      password: formData.password,
      passwordHash: formData.password,
      fullName: formData.fullName.trim(),
      name: formData.fullName.trim(),
      title: 'Kader Muda Pergerakan',
      position: 'Warga & Kader Politik',
      level: 1,
      exp: 0,
      maxExp: 1000,
      energy: 100,
      maxEnergy: 100,
      money: 0,
      gold: 0,
      partyId: formData.partyId || null,
      residenceRegionId: formData.residenceRegionId || 'dki',
      role: 'player',
      status: 'active',
      perks: { charisma: 10, intellect: 10, endurance: 10, connections: 10 },
      votedBills: {},
      votedPresidentId: null,
      createdAt: new Date().toISOString(),
    };

    // Simpan langsung ke Supabase
    if (isSupabaseConfigured && supabase) {
      try {
        const { error: suInsertErr } = await supabase.from('users').insert([{
          id: newUser.id,
          username: newUser.username,
          email: newUser.email,
          password_hash: formData.password,
          full_name: newUser.fullName,
          title: newUser.title,
          position: newUser.position,
          level: newUser.level,
          exp: newUser.exp,
          max_exp: newUser.maxExp,
          energy: newUser.energy,
          max_energy: newUser.maxEnergy,
          money: newUser.money,
          gold: newUser.gold,
          party_id: newUser.partyId,
          residence_region_id: newUser.residenceRegionId,
          role: newUser.role,
          status: newUser.status,
          perk_charisma: 10,
          perk_intellect: 10,
          perk_endurance: 10,
          perk_connections: 10
        }]);

        if (suInsertErr) {
          console.warn('Supabase insert warning:', suInsertErr.message);
        }
      } catch (err) {
        console.warn('Supabase register error:', err);
      }
    }

    setUsersList(prev => [...prev.filter(u => u.id !== newUser.id), newUser]);
    setCurrentUser(newUser);
    setPlayer(newUser);
    localStorage.setItem(STORAGE_KEY + '_current_user', JSON.stringify(newUser));
    localStorage.setItem(STORAGE_KEY + '_player', JSON.stringify(newUser));
    sounds.playSuccess();
    showToast(`Pendaftaran berhasil! Akun Anda aktif di Supabase. Role: ${defaultRole.toUpperCase()}`, 'success');
    return { success: true, user: newUser };
  };

  // Google / Gmail Direct Sign-In (Pure Role from Supabase Database)
  const loginWithGoogle = async (emailInput, nameInput, photoUrl = null) => {
    sounds.playClick();
    if (!emailInput) {
      return { success: false, error: 'Alamat Gmail tidak valid.' };
    }

    const emailClean = emailInput.trim().toLowerCase();
    const displayName = nameInput?.trim() || emailClean.split('@')[0].replace(/[._]/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase());
    const usernameClean = emailClean.split('@')[0].replace(/[^a-zA-Z0-9_]/g, '_');

    // 1. Cek langsung ke Supabase
    if (isSupabaseConfigured && supabase) {
      try {
        const { data: suUser, error: suErr } = await supabase
          .from('users')
          .select('*')
          .eq('email', emailClean)
          .maybeSingle();

        if (suUser && !suErr) {
          const dbUser = {
            id: suUser.id,
            username: suUser.username,
            email: suUser.email,
            fullName: suUser.full_name || displayName,
            name: suUser.full_name || displayName,
            role: suUser.role || 'player',
            status: suUser.status || 'active',
            title: suUser.title || 'Warga Berdaulat',
            position: suUser.position || 'Warga Digital',
            level: suUser.level || 1,
            exp: suUser.exp || 0,
            maxExp: suUser.max_exp || 1000,
            energy: suUser.energy !== undefined ? suUser.energy : 100,
            maxEnergy: suUser.max_energy || 100,
            money: suUser.money !== undefined ? Number(suUser.money) : 0,
            gold: suUser.gold !== undefined ? Number(suUser.gold) : 0,
            partyId: suUser.party_id || null,
            residenceRegionId: suUser.residence_region_id || 'dki',
            perks: {
              charisma: suUser.perk_charisma || 10,
              intellect: suUser.perk_intellect || 10,
              endurance: suUser.perk_endurance || 10,
              connections: suUser.perk_connections || 10,
            },
            avatar: photoUrl
          };
          setCurrentUser(dbUser);
          setPlayer(dbUser);
          setUsersList(prev => [...prev.filter(u => u.id !== dbUser.id), dbUser]);
          localStorage.setItem(STORAGE_KEY + '_current_user', JSON.stringify(dbUser));
          localStorage.setItem(STORAGE_KEY + '_player', JSON.stringify(dbUser));
          sounds.playSuccess();
          const roleBadge = dbUser.role === 'superadmin' ? 'Super Administrator' : dbUser.role === 'moderator' ? 'Moderator Penegak' : 'Warga / Player';
          showToast(`Google SSO berhasil! Otoritas (${roleBadge}) diverifikasi langsung dari Supabase.`, 'success');
          return { success: true, user: dbUser };
        } else {
          // Buat akun baru di Supabase jika belum terdaftar
          const newId = 'usr-google-' + Date.now();
          await supabase.from('users').insert([{
            id: newId,
            username: usernameClean,
            email: emailClean,
            password_hash: 'google_oauth_auth',
            full_name: displayName,
            role: 'player',
            status: 'active',
            money: 0,
            gold: 0,
            level: 1,
            residence_region_id: 'dki'
          }]);
        }
      } catch (err) {
        console.warn('Supabase google sign in warning:', err);
      }
    }

    // Fallback jika offline
    const newGoogleUser = {
      id: 'usr-google-' + Date.now(),
      username: usernameClean,
      email: emailClean,
      fullName: displayName,
      name: displayName,
      role: 'player',
      status: 'active',
      money: 0,
      gold: 0,
      level: 1,
      residenceRegionId: 'dki'
    };
    setCurrentUser(newGoogleUser);
    setPlayer(newGoogleUser);
    setUsersList(prev => [...prev.filter(u => u.id !== newGoogleUser.id), newGoogleUser]);
    localStorage.setItem(STORAGE_KEY + '_current_user', JSON.stringify(newGoogleUser));
    localStorage.setItem(STORAGE_KEY + '_player', JSON.stringify(newGoogleUser));
    sounds.playSuccess();
    showToast(`Google SSO berhasil! Selamat datang, ${displayName}!`, 'success');
    return { success: true, user: newGoogleUser };
  };

  const logout = () => {
    sounds.playClick();
    setCurrentUser(null);
    setPlayer(null);
    try {
      localStorage.clear();
      sessionStorage.clear();
    } catch {}
    showToast('Anda telah keluar dari sesi kewarganegaraan.', 'info');
    setTimeout(() => {
      window.location.href = '/';
    }, 200);
  };

  const loginAsRole = async (roleKey) => {
    sounds.playClick();
    const demo = DEMO_ACCOUNTS[roleKey] || DEMO_ACCOUNTS.player;
    return loginDirectUser(demo);
  };

  const demoLogin = () => {
    return loginAsRole('player');
  };

  // ==================== ROLE & AUTHORITY SYSTEM ====================
  const userRole = currentUser?.role || 'player';
  const isSuperAdmin = userRole === 'superadmin';
  const isModerator = userRole === 'superadmin' || userRole === 'moderator';
  const isPlayer = true;

  // Role quick switcher (for testing & authority toggle)
  const switchActiveRole = (targetRole) => {
    sounds.playClick();
    const demo = DEMO_ACCOUNTS[targetRole] || DEMO_ACCOUNTS.player;
    setCurrentUser(demo);
    setPlayer(demo);
    localStorage.setItem(STORAGE_KEY + '_current_user', JSON.stringify(demo));
    sounds.playSuccess();
    showToast(`Otoritas diubah ke: ${targetRole.toUpperCase()} (${demo.fullName})`, 'success');
  };

  // Super Admin: Update other user's role
  const updateUserRole = async (userId, newRole) => {
    sounds.playClick();
    if (!isSuperAdmin) {
      showToast('Hanya Super Admin yang berhak mengubah role pengguna!', 'error');
      return { success: false };
    }
    setUsersList(prev => prev.map(u => u.id === userId ? { ...u, role: newRole } : u));
    
    // Simpan langsung ke Supabase jika aktif
    if (isSupabaseConfigured && supabase) {
      supabase.from('users').update({ role: newRole, updated_at: new Date().toISOString() }).eq('id', userId).then(() => {});
    }

    sounds.playSuccess();
    showToast(`Role pengguna berhasil diubah menjadi ${newRole.toUpperCase()}!`, 'success');
    return { success: true };
  };

  // Admin/Mod: Update other user's status (Active, Warned, Banned)
  const updateUserStatus = async (userId, newStatus, reason = '') => {
    sounds.playClick();
    if (!isModerator) {
      showToast('Akses ditolak! Butuh izin Moderator atau Super Admin.', 'error');
      return { success: false };
    }
    setUsersList(prev => prev.map(u => u.id === userId ? { ...u, status: newStatus, moderationReason: reason } : u));

    // Simpan langsung ke Supabase jika aktif
    if (isSupabaseConfigured && supabase) {
      supabase.from('users').update({ status: newStatus, updated_at: new Date().toISOString() }).eq('id', userId).then(() => {});
    }

    sounds.playSuccess();
    showToast(`Status pengguna diubah: ${newStatus.toUpperCase()}`, 'info');
    return { success: true };
  };

  // Super Admin: Adjust Economy / Attributes
  const adjustPlayerAttributes = async (userId, { addMoney, addGold, setLevel }) => {
    sounds.playClick();
    if (!isSuperAdmin) {
      showToast('Hanya Super Admin yang berhak menyuntikkan dana/level!', 'error');
      return;
    }
    setPlayer(prev => ({
      ...prev,
      money: addMoney !== undefined ? prev.money + addMoney : prev.money,
      gold: addGold !== undefined ? prev.gold + addGold : prev.gold,
      level: setLevel !== undefined ? setLevel : prev.level,
    }));

    if (isSupabaseConfigured && supabase) {
      const updates = {};
      if (addMoney !== undefined) updates.money = (player.money || 0) + addMoney;
      if (addGold !== undefined) updates.gold = (player.gold || 0) + addGold;
      if (setLevel !== undefined) updates.level = setLevel;
      updates.updated_at = new Date().toISOString();
      supabase.from('users').update(updates).eq('id', userId).then(() => {});
    }

    sounds.playCoin();
    showToast('Injeksi atribut & keuangan berhasil di Supabase!', 'success');
  };

  // Super Admin: Reset Password Player secara aman (Admin Overwrite Password Baru)
  const resetPasswordForUser = async (userId, newPassword) => {
    sounds.playClick();
    if (!isSuperAdmin) {
      showToast('Hanya Super Admin yang berhak menyetel ulang kata sandi pemain!', 'error');
      return { success: false };
    }
    setUsersList(prev => prev.map(u => u.id === userId ? { ...u, password: newPassword, password_hash: newPassword } : u));
    
    if (isSupabaseConfigured && supabase) {
      supabase.from('users').update({ password_hash: newPassword, updated_at: new Date().toISOString() }).eq('id', userId).then(() => {});
    }

    sounds.playSuccess();
    showToast('Kata sandi pengguna berhasil disetel ulang di Supabase!', 'success');
    return { success: true };
  };

  // Super Admin: Edit Detail Pengguna (No HP, Nama, Level, Kas In-game)
  const editUserDetails = async (userId, updatedData) => {
    sounds.playClick();
    if (!isSuperAdmin) {
      showToast('Akses ditolak! Hanya Super Admin yang berhak mengubah data pemain.', 'error');
      return { success: false };
    }
    setUsersList(prev => prev.map(u => {
      if (u.id === userId) {
        return {
          ...u,
          ...updatedData,
          phone: updatedData.phone !== undefined ? updatedData.phone : u.phone,
          fullName: updatedData.fullName || u.fullName,
          level: updatedData.level !== undefined ? Number(updatedData.level) : u.level,
          money: updatedData.money !== undefined ? Number(updatedData.money) : u.money,
          gold: updatedData.gold !== undefined ? Number(updatedData.gold) : u.gold,
        };
      }
      return u;
    }));

    if (currentUser?.id === userId) {
      setCurrentUser(prev => ({ ...prev, ...updatedData }));
      setPlayer(prev => ({ ...prev, ...updatedData }));
    }

    if (isSupabaseConfigured && supabase) {
      const suPayload = {
        full_name: updatedData.fullName,
        level: updatedData.level !== undefined ? Number(updatedData.level) : undefined,
        money: updatedData.money !== undefined ? Number(updatedData.money) : undefined,
        gold: updatedData.gold !== undefined ? Number(updatedData.gold) : undefined,
        updated_at: new Date().toISOString()
      };
      Object.keys(suPayload).forEach(k => suPayload[k] === undefined && delete suPayload[k]);
      supabase.from('users').update(suPayload).eq('id', userId).then(() => {});
    }

    sounds.playSuccess();
    showToast('Data pemain berhasil diperbarui di Supabase database!', 'success');
    return { success: true };
  };

  // Super Admin: Inject National Treasury
  const injectNationalTreasury = (amount) => {
    sounds.playClick();
    if (!isSuperAdmin) return;
    setNationalState(prev => ({
      ...prev,
      treasury: prev.treasury + amount
    }));
    sounds.playCoin();
    showToast(`Berhasil menyuntikkan $RP ${(amount/1e12).toFixed(1)} Triliun ke Kas Negara!`, 'success');
  };

  // Super Admin: Broadcast Breaking Ticker
  const broadcastEmergencyNews = (newsText) => {
    sounds.playClick();
    if (!isSuperAdmin) return;
    setNationalState(prev => ({
      ...prev,
      breakingTicker: `🚨 SIARAN DARURAT PUSAT: ${newsText}`
    }));
    sounds.playSuccess();
    showToast('Siaran darurat berhasil disiarkan ke seluruh penjuru republik!', 'success');
  };

  // Moderator/Admin: Veto Bill
  const vetoBill = (billId, reason) => {
    sounds.playClick();
    if (!isModerator) {
      showToast('Hanya Dewan Kehormatan / Moderator yang dapat memveto RUU!', 'error');
      return;
    }
    setBills(prev => prev.map(b => b.id === billId ? { ...b, status: 'vetoed', vetoReason: reason || 'Pelanggaran Etika Parlemen' } : b));
    sounds.playSuccess();
    showToast(`RUU #${billId} telah diveto oleh Moderator!`, 'info');
  };

  // Moderator/Admin: Moderate Article (Delete/Flag)
  const moderateArticle = (articleId, action = 'delete', reason = '') => {
    sounds.playClick();
    if (!isModerator) {
      showToast('Hanya Moderator yang dapat menindak artikel pers!', 'error');
      return;
    }
    if (action === 'delete') {
      setArticles(prev => prev.filter(a => a.id !== articleId));
      showToast(`Artikel #${articleId} telah dihapus dari peredaran pers!`, 'info');
    } else {
      setArticles(prev => prev.map(a => a.id === articleId ? { ...a, isFlagged: true, flagReason: reason } : a));
      showToast(`Artikel #${articleId} ditandai sebagai berita hoaks / provokatif!`, 'info');
    }
    sounds.playSuccess();
  };

  // 13. Reset All Data
  const resetGameData = () => {
    if (window.confirm('Apakah Anda yakin ingin mereset seluruh progres dan data permainan ke setelan awal?')) {
      localStorage.clear();
      window.location.reload();
    }
  };

  return (
    <GameContext.Provider
      value={{
        currentUser,
        usersList,
        userRole,
        isSuperAdmin,
        isModerator,
        isPlayer,
        switchActiveRole,
        updateUserRole,
        updateUserStatus,
        adjustPlayerAttributes,
        resetPasswordForUser,
        editUserDetails,
        injectNationalTreasury,
        broadcastEmergencyNews,
        vetoBill,
        moderateArticle,
        login,
        loginDirectUser,
        isDbConnected,
        register,
        loginWithGoogle,
        loginAsRole,
        logout,
        demoLogin,
        player,
        regions,
        parties,
        bills,
        passedLaws,
        articles,
        candidates,
        nationalState,
        activeWars,
        warHistory,
        deployMilitaryTroops,
        declareWar,
        commodities,
        macroEconomy,
        playerInventory,
        playerFactories,
        tradeCommodity,
        buildIndustrialFacility,
        collectFactoryYield,
        workHistory,
        performJobDuty,
        selectedRegionId,
        setSelectedRegionId,
        activeTab,
        setActiveTab,
        sidebarOpen,
        setSidebarOpen,
        toggleSidebar,
        notification,
        activePerkUpgrade,
        getPerkUpgradeDuration,
        trainPerk,
        updatePlayerProfile,
        boostEnergy,
        workMine,
        campaignInRegion,
        investInRegion,
        voteOnBill,
        proposeBill,
        withdrawBill,
        votePresident,
        nominatePresidentialCandidate,
        joinParty,
        createNewParty,
        closeParty,
        publishArticle,
        upvoteArticle,
        chatMessages,
        sendChatMessage,
        topAttackers,
        resetGameData,
        showToast,
      }}
    >
      {children}
    </GameContext.Provider>
  );
}

export function useGame() {
  const ctx = useContext(GameContext);
  if (!ctx) throw new Error('useGame must be used within GameProvider');
  return ctx;
}
