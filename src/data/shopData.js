// Data Katalog Toko & Perlengkapan Negara (Shop Items & National Armory)
// Kategori: Minuman Energi & Medis, Perlengkapan Militer, Aset & Lisensi Politik, Emas Batangan

export const SHOP_CATEGORIES = [
  { id: 'all', label: 'Semua Barang' },
  { id: 'consumables', label: 'Suplemen & Energi' },
  { id: 'military', label: 'Gudang Senjata & Tempur' },
  { id: 'privileges', label: 'Lisensi & Hak Istimewa' },
  { id: 'prestige', label: 'Kemewahan & Investasi' }
];

export const SHOP_ITEMS = [
  // 1. Suplemen & Energi
  {
    id: 'energy_coffee',
    name: 'Kopi Robusta Lampung Super',
    category: 'consumables',
    iconName: 'Coffee',
    color: '#d97706',
    priceRp: 500000,
    priceGold: 0,
    type: 'energy',
    effectAmount: 25,
    effectText: '+25 Energi Seketika',
    description: 'Kopi hitam murni pekat untuk menyegarkan stamina fisik sebelum dinas politik maraton.'
  },
  {
    id: 'energy_tonic',
    name: 'Tonik Ginseng Istana',
    category: 'consumables',
    iconName: 'Zap',
    color: '#eab308',
    priceRp: 1500000,
    priceGold: 0,
    type: 'energy',
    effectAmount: 60,
    effectText: '+60 Energi Seketika',
    description: 'Ramuan herbal eksklusif pejabat tinggi untuk memulihkan stamina secara drastis.'
  },
  {
    id: 'medical_kit',
    name: 'Paket Medis & Vitamin Parlemen',
    category: 'consumables',
    iconName: 'HeartPulse',
    color: '#ef4444',
    priceRp: 3000000,
    priceGold: 0,
    type: 'max_energy',
    effectAmount: 100,
    effectText: 'Pulihkan 100% Energi Maksimal',
    description: 'Pelayanan kesehatan VVIP standar kepresidenan untuk memastikan kondisi tubuh 100% prima.'
  },

  // 2. Perlengkapan Tempur & Militer
  {
    id: 'body_armor',
    name: 'Rompi Balistik Taktis Kevlar-IV',
    category: 'military',
    iconName: 'Shield',
    color: '#10b981',
    priceRp: 12000000,
    priceGold: 1,
    type: 'military_boost',
    effectText: '+15% Pertahanan di Front Tempur',
    description: 'Proteksi militer berstandar milisi elite untuk meningkatkan pertahanan di garis depan.'
  },
  {
    id: 'drone_recon',
    name: 'Drone Intai Elang Hitam',
    category: 'military',
    iconName: 'Plane',
    color: '#06b6d4',
    priceRp: 35000000,
    priceGold: 2,
    type: 'military_boost',
    effectText: '+25% Damage Serangan Udara',
    description: 'Wahana nirawak intai malam hari berkamera termal untuk memetakan koordinat benteng musuh.'
  },
  {
    id: 'tactical_jammer',
    name: 'Perangkat Jammer Radar Militer',
    category: 'military',
    iconName: 'Radio',
    color: '#8b5cf6',
    priceRp: 50000000,
    priceGold: 3,
    type: 'military_boost',
    effectText: '+35% Efektivitas Taktis Pasukan',
    description: 'Pemancar gelombang pengacau komunikasi untuk membutakan transmisi koordinat musuh.'
  },

  // 3. Lisensi & Hak Istimewa Politik
  {
    id: 'media_permit',
    name: 'Izin Pers & Lisensi Kantor Berita',
    category: 'privileges',
    iconName: 'Newspaper',
    color: '#3b82f6',
    priceRp: 25000000,
    priceGold: 1,
    type: 'privilege',
    effectText: '+50% Kredibilitas Artikel & Opini',
    description: 'Surat keputusan kementerian komunikasi untuk menerbitkan artikel editorial berbobot tinggi.'
  },
  {
    id: 'mining_concession',
    name: 'Surat Izin Usaha Pertambangan (IUP)',
    category: 'privileges',
    iconName: 'Pickaxe',
    color: '#f97316',
    priceRp: 75000000,
    priceGold: 5,
    type: 'privilege',
    effectText: '+20% Hasil Komoditas Dinas Tambang',
    description: 'Konsesi wilayah tambang resmi yang melipatgandakan perolehan hasil galian saat bekerja.'
  },
  {
    id: 'diplomatic_passport',
    name: 'Paspor Diplomatik Garuda Emas',
    category: 'privileges',
    iconName: 'Award',
    color: '#eab308',
    priceRp: 120000000,
    priceGold: 8,
    type: 'privilege',
    effectText: 'Bebas Visa & +15% Pengaruh Fraksi',
    description: 'Dokumen kenegaraan tingkat duta besar yang memberi kekebalan politik dan wibawa di panggung global.'
  },

  // 4. Kemewahan & Investasi
  {
    id: 'gold_bundle_small',
    name: 'Paket 5 Batangan Emas Murni Antam',
    category: 'prestige',
    iconName: 'Coins',
    color: '#f59e0b',
    priceRp: 100000000,
    priceGold: 0,
    yieldGold: 5,
    type: 'buy_gold',
    effectText: 'Dapatkan +5 Batang Emas Murni',
    description: 'Konversi dana rupiah tunai menjadi cadangan emas fisik 24 karat berdaya tahan inflasi.'
  },
  {
    id: 'gold_bundle_large',
    name: 'Brankas 20 Batangan Emas Devisa',
    category: 'prestige',
    iconName: 'Crown',
    color: '#eab308',
    priceRp: 380000000,
    priceGold: 0,
    yieldGold: 20,
    type: 'buy_gold',
    effectText: 'Dapatkan +20 Batang Emas Murni (Hemat 5%)',
    description: 'Investasi devisa berskala konglomerat untuk memperkuat status finansial dan kekayaan pribadi.'
  },
  {
    id: 'presidential_suite',
    name: 'Rumah Aspirasi & Penthouse Diplomat',
    category: 'prestige',
    iconName: 'Building',
    color: '#ec4899',
    priceRp: 250000000,
    priceGold: 10,
    type: 'prestige_asset',
    effectText: '+500 EXP Karir & Lambang Status VIP',
    description: 'Gedung pertemuan privat berpanorama kota untuk menjamu para menteri dan ketua umum partai.'
  }
];
