// Data Klasifikasi RUU, Komisi Parlemen, dan Template Hukum Kenegaraan
// Sistem Legislasi Terintegrasi: Pengajuan RUU Inisiatif Rakyat, Fraksi Parlemen, dan Kepresidenan

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

export const LAW_TEMPLATES = [
  {
    title: 'RUU Penguatan Lumbung Pangan Nusantara & Kedaulatan Gabah Petani',
    category: 'Kesejahteraan Sosial, Pertanian & Pangan',
    komisi: 'Komisi IV Parlemen',
    treasuryDelta: -12000000000,
    stabilityDelta: 6,
    supportDelta: 9,
    description: 'Mewajibkan pemerintah pusat membeli 100% surplus beras dan jagung petani domestik dengan harga batas atas yang layak, serta membatasi kuota impor komoditas pangan pokok.',
    impactText: '+12% Kemakmuran Petani Daerah, +6% Ketahanan Pangan Nasional, -$RP 12T APBN'
  },
  {
    title: 'RUU Royalti Progresif Smelter & Bagi Hasil Tambang Kepulauan',
    category: 'Energi, Pertambangan & Hilirisasi',
    komisi: 'Komisi VII Parlemen',
    treasuryDelta: 32000000000,
    stabilityDelta: 4,
    supportDelta: 7,
    description: 'Mewajibkan kenaikan bagi hasil penerimaan negara bukan pajak (PNBP) sebesar 30% ditransfer langsung ke kas daerah penghasil tambang di Maluku, Sulawesi, dan Papua.',
    impactText: '+$RP 32T Kas Negara, +15% Pembangunan Daerah Tambang, +7% Stabilitas Daerah'
  },
  {
    title: 'RUU Modernisasi Armada Tempur Laut ZEE & Perisai Antariksa',
    category: 'Pertahanan, ZEE & Hubungan Internasional',
    komisi: 'Komisi I Parlemen',
    treasuryDelta: -22000000000,
    stabilityDelta: 8,
    supportDelta: 5,
    description: 'Mengadakan 4 unit kapal selam siluman baru dan satelit militer pengintai untuk memperkuat kendali mutlak teritorial atas Selat Malaka, Laut Natuna Utara, dan Laut Arafura.',
    impactText: '+20 Poin Pertahanan Nasional, -$RP 22T Kas Negara, +10% Pengaruh Diplomasi'
  },
  {
    title: 'RUU Insentif Pajak Startup Digital & Keringanan Usaha Mikro UMKM',
    category: 'Ekonomi, Perpajakan & Perbankan',
    komisi: 'Komisi XI Parlemen',
    treasuryDelta: 18000000000,
    stabilityDelta: 5,
    supportDelta: 8,
    description: 'Memberikan pembebasan pajak PPh final selama 3 tahun bagi usaha rintisan teknologi dan UMKM lokal dengan omzet di bawah $RP 2 Miliar per tahun.',
    impactText: '+15.000 Lapangan Kerja Baru, +8% Pertumbuhan Ekonomi, +5% Stabilitas Pasar'
  }
];
