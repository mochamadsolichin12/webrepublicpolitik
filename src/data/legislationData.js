// Data Klasifikasi RUU & Komisi Parlemen
// LAW_TEMPLATES dikosongkan agar formulir RUU murni dibuat dan diinput oleh pemain/fraksi parlemen secara dinamis
export const LAW_CATEGORIES = [
  {
    id: 'fiskal_ekonomi',
    name: 'Ekonomi, Perpajakan & Perbankan',
    komisi: 'Komisi XI Parlemen',
    color: '#10b981',
    icon: 'Coins',
    description: 'Pajak karbon, insentif hilirisasi, devisa ekspor, stabilitas kurs rupiah, dan belanja modal.',
    defaultTreasury: 25000000000,
    defaultStability: 3,
    defaultSupport: 5
  },
  {
    id: 'pertahanan_kedaulatan',
    name: 'Pertahanan, ZEE & Hubungan Internasional',
    komisi: 'Komisi I Parlemen',
    color: '#ef4444',
    icon: 'Shield',
    description: 'Modernisasi alutsista TNI, pengadaan radar ZEE maritim, pangkalan militer, dan traktat perbatasan.',
    defaultTreasury: -20000000000,
    defaultStability: 6,
    defaultSupport: 4
  },
  {
    id: 'energi_sumberdaya',
    name: 'Energi, Pertambangan & Hilirisasi',
    komisi: 'Komisi VII Parlemen',
    color: '#f59e0b',
    icon: 'Flame',
    description: 'Bagi hasil migas & nikel ke daerah otonom, royalti batubara, transisi EBT listrik hijau.',
    defaultTreasury: 35000000000,
    defaultStability: 4,
    defaultSupport: 6
  },
  {
    id: 'kesejahteraan_pangan',
    name: 'Kesejahteraan Sosial, Pertanian & Pangan',
    komisi: 'Komisi IV Parlemen',
    color: '#06b6d4',
    icon: 'HeartHandshake',
    description: 'Subsidi pupuk 100%, jaminan harga gabah, lumbung pangan nasional, dan program jaring pengaman sosial.',
    defaultTreasury: -15000000000,
    defaultStability: 5,
    defaultSupport: 8
  },
  {
    id: 'hukum_tatanegara',
    name: 'Hukum, Keadilan & Tata Negara',
    komisi: 'Komisi III Parlemen',
    color: '#a855f7',
    icon: 'Scale',
    description: 'Reformasi KUHP, pemberantasan korupsi, hak otonomi provinsi baru, dan perlindungan privasi siber.',
    defaultTreasury: -5000000000,
    defaultStability: 7,
    defaultSupport: 6
  }
];

export const LAW_TEMPLATES = [];
