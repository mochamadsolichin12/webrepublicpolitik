// Data Default Partai Politik & Fraksi Parlemen (100 Kursi Parlemen RI)
// Digunakan sebagai data fondasi awal sidang paripurna dan sinkronisasi fraksi partai
export const INITIAL_PARTIES = [
  {
    id: 'pdin',
    name: 'Partai Demokrasi Indonesia Nusantara',
    shortName: 'PDI-N',
    color: '#dc2626',
    badgeBg: 'rgba(220, 38, 38, 0.15)',
    border: '#ef4444',
    ideology: 'Nasionalis Marhaenis',
    leader: 'Hj. Megawati Soekarno Putri (Ketum Kehormatan)',
    slogan: 'Berjuang untuk Kedaulatan Wong Cilik',
    seats: 26,
    treasury: 1450000000,
    membersCount: 42800,
    stances: {
      taxes: 'Tinggi (Subsidi Sosial)',
      defense: 'Moderat',
      mining: 'Nasionalisasi Aset',
      pressFreedom: 'Tinggi'
    },
    isCoalitionWithGov: true
  },
  {
    id: 'pgr',
    name: 'Partai Gerakan Republik',
    shortName: 'PGR',
    color: '#f59e0b',
    badgeBg: 'rgba(245, 158, 11, 0.15)',
    border: '#fbbf24',
    ideology: 'Nasionalis Patriotik & Militer Terorganisir',
    leader: 'Jenderal (Purn) Prabowo Kusumo',
    slogan: 'Nusantara Berdaulat, Militer Tangguh, Pangan Mandiri',
    seats: 24,
    treasury: 1890000000,
    membersCount: 39500,
    stances: {
      taxes: 'Moderat',
      defense: 'Sangat Tinggi (Modernisasi Alutsista)',
      mining: 'Kedaulatan & Hilirisasi Dalam Negeri',
      pressFreedom: 'Moderat'
    },
    isCoalitionWithGov: true
  },
  {
    id: 'ptp',
    name: 'Partai Teknokrat Pembangunan',
    shortName: 'PTP',
    color: '#06b6d4',
    badgeBg: 'rgba(6, 182, 212, 0.15)',
    border: '#22d3ee',
    ideology: 'Teknokrasi, Investasi & Digitalisasi',
    leader: 'Dr. Ilham Habibie, M.Sc',
    slogan: 'Inovasi, Industri Hijau & Sains Masa Depan',
    seats: 18,
    treasury: 2150000000,
    membersCount: 28400,
    stances: {
      taxes: 'Rendah (Insentif Korporasi & Startup)',
      defense: 'Fokus Cyber Security & AI',
      mining: 'Hilirisasi Teknologi Tinggi',
      pressFreedom: 'Tinggi'
    },
    isCoalitionWithGov: true
  },
  {
    id: 'pkbr',
    name: 'Partai Kebangkitan Bangsa Rakyat',
    shortName: 'PKB-R',
    color: '#10b981',
    badgeBg: 'rgba(16, 185, 129, 0.15)',
    border: '#34d399',
    ideology: 'Moderat Tradisionalis & Ekonomi Kerakyatan',
    leader: 'K.H. Muhaimin Iskandar',
    slogan: 'Bela Kesejahteraan Umat & Desa Nusantara',
    seats: 15,
    treasury: 1100000000,
    membersCount: 34100,
    stances: {
      taxes: 'Moderat (Fokus Dana Desa)',
      defense: 'Moderat',
      mining: 'Keadilan Agraria',
      pressFreedom: 'Tinggi'
    },
    isCoalitionWithGov: false
  },
  {
    id: 'pksn',
    name: 'Partai Keadilan Sejahtera Nusantara',
    shortName: 'PKS-N',
    color: '#f97316',
    badgeBg: 'rgba(249, 115, 22, 0.15)',
    border: '#fb923c',
    ideology: 'Sosial Religius & Oposisi Kritis',
    leader: 'Dr. Ahmad Syaikhu',
    slogan: 'Keadilan, Integritas, & Pelayan Rakyat',
    seats: 11,
    treasury: 950000000,
    membersCount: 22000,
    stances: {
      taxes: 'Tolak Kenaikan Pajak Rakyat',
      defense: 'Pertahanan Maritim',
      mining: 'Audit Total Pertambangan Asing',
      pressFreedom: 'Sangat Tinggi'
    },
    isCoalitionWithGov: false
  },
  {
    id: 'psim',
    name: 'Partai Solidaritas Maju',
    shortName: 'PSI-M',
    color: '#a855f7',
    badgeBg: 'rgba(168, 85, 247, 0.15)',
    border: '#c084fc',
    ideology: 'Reformis Progresif Pemuda & Transparansi',
    leader: 'Kaesang Pangarep, B.Sc',
    slogan: 'Politik Baru, Anti-Korupsi & Transparansi Total',
    seats: 6,
    treasury: 820000000,
    membersCount: 16700,
    stances: {
      taxes: 'Pajak Karbon & Pajak Kekayaan',
      defense: 'Cyber Defense & Transparansi Anggaran',
      mining: 'Ketatkan Regulasi Lingkungan',
      pressFreedom: 'Maksimal'
    },
    isCoalitionWithGov: false
  }
];
