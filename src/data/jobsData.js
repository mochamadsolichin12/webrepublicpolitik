// Data Pasar Tenaga Kerja, Lowongan Profesi & Sektor Pekerjaan Kenegaraan
// Sistem Karir Profesi: Gaji Riil, Jam Kerja/Shift, Energi yang Dikonsumsi, Syarat Level/Atribut, dan Hasil Komoditas

export const JOB_SECTORS = [
  {
    id: 'esdm_mining',
    name: 'Sektor ESDM & Hilirisasi Tambang',
    icon: 'Pickaxe',
    color: '#f59e0b',
    description: 'Pengeboran lepas pantai, pengolahan nikel laterit, penambangan emas, dan pengawasan smelter.'
  },
  {
    id: 'government_civil',
    name: 'Birokrasi & Pemerintahan Sipil (ASN/PNS)',
    icon: 'Building2',
    color: '#38bdf8',
    description: 'Staf ahli fraksi Parlemen, auditor BPK, diplomat perwakilan luar negeri, dan kementerian strategis.'
  },
  {
    id: 'agriculture_maritime',
    name: 'Perkebunan, Pangan & Maritim',
    icon: 'Wheat',
    color: '#10b981',
    description: 'Inspeksi perkebunan sawit, nahkoda kapal logistik tol laut, dan sentra penggilingan beras modern.'
  },
  {
    id: 'defense_security',
    name: 'Pertahanan & Keamanan Teritorial',
    icon: 'Shield',
    color: '#ef4444',
    description: 'Teknisi radar perbatasan ZEE Natuna, marinir pengawal kargo laut, dan operator drone intai maritim.'
  }
];

export const AVAILABLE_JOBS = [
  // 1. ESDM & Pertambangan
  {
    id: 'job_nickel_supervisor',
    sectorId: 'esdm_mining',
    title: 'Inspektur Pengawas Smelter Nikel HPAL',
    company: 'PT Industri Hilirisasi Nusantara',
    location: 'Morowali, Sulawesi Tengah',
    wageRp: 18500000, // Rp 18.5 Juta per shift dinas
    energyCost: 20,
    requiredLevel: 2,
    requiredPerk: { name: 'endurance', min: 12, label: 'Ketahanan' },
    rewardExp: 80,
    resourceProduced: 'nickel',
    resourceQty: 1,
    description: 'Mengawasi keselamatan kerja reaktor autoclave tekanan tinggi dan kepatuhan standar amdal buangan tailing smelter.'
  },
  {
    id: 'job_oil_engineer',
    sectorId: 'esdm_mining',
    title: 'Operator Kepala Anjungan Pengeboran Minyak',
    company: 'Pertamina Hulu Energi Samudera',
    location: 'Blok Rokan & Selat Madura',
    wageRp: 28000000, // Rp 28 Juta
    energyCost: 25,
    requiredLevel: 4,
    requiredPerk: { name: 'intellect', min: 15, label: 'Intelektualitas' },
    rewardExp: 110,
    resourceProduced: 'oil',
    resourceQty: 2,
    description: 'Memimpin operasi pengeboran sumur migas lepas pantai untuk memompa lifting minyak mentah nasional.'
  },
  {
    id: 'job_gold_surveyor',
    sectorId: 'esdm_mining',
    title: 'Surveyor Geologi & Eksplorasi Emas Murni',
    company: 'PT Tambang Emas Papua Berdaulat',
    location: 'Grasberg, Mimika, Papua Tengah',
    wageRp: 35000000,
    energyCost: 30,
    requiredLevel: 6,
    requiredPerk: { name: 'endurance', min: 18, label: 'Ketahanan' },
    rewardExp: 140,
    resourceProduced: 'gold_bullion',
    resourceQty: 5,
    description: 'Menganalisis singkapan bijih berkadar tembaga dan batangan emas tinggi di dataran tinggi pegunungan salju.'
  },

  // 2. Birokrasi & Pemerintahan Sipil
  {
    id: 'job_expert_staff',
    sectorId: 'government_civil',
    title: 'Tenaga Ahli Madya Fraksi Parlemen',
    company: 'Sekretariat Jenderal Parlemen RI',
    location: 'Gedung Nusantara, Jakarta Pusat',
    wageRp: 22000000,
    energyCost: 15,
    requiredLevel: 3,
    requiredPerk: { name: 'intellect', min: 16, label: 'Intelektualitas' },
    rewardExp: 90,
    resourceProduced: null,
    resourceQty: 0,
    description: 'Menyusun analisis hukum komparatif dan naskah argumen politik untuk anggota parlemen saat rapat kerja komisi.'
  },
  {
    id: 'job_state_auditor',
    sectorId: 'government_civil',
    title: 'Auditor Utama Investigasi Anggaran (BPK)',
    company: 'Badan Pemeriksa Keuangan Negara',
    location: 'Kantor BPK Perwakilan Daerah',
    wageRp: 32000000,
    energyCost: 22,
    requiredLevel: 5,
    requiredPerk: { name: 'connections', min: 16, label: 'Koneksi' },
    rewardExp: 125,
    resourceProduced: null,
    resourceQty: 0,
    description: 'Memeriksa aliran belanja APBD provinsi dan mendeteksi penyimpangan dana transfer otonomi khusus.'
  },

  // 3. Perkebunan, Pangan & Maritim
  {
    id: 'job_cpo_manager',
    sectorId: 'agriculture_maritime',
    title: 'Supervisi Mutu Pabrik Kelapa Sawit (PKS)',
    company: 'Holding Perkebunan Nusantara',
    location: 'Labuhanbatu, Sumatera Utara',
    wageRp: 16000000,
    energyCost: 18,
    requiredLevel: 1,
    requiredPerk: { name: 'connections', min: 10, label: 'Koneksi' },
    rewardExp: 70,
    resourceProduced: 'cpo',
    resourceQty: 2,
    description: 'Memastikan standar rendemen minyak sawit mentah (CPO) dan penyaluran TBS perkebunan swadaya petani rakyat.'
  },
  {
    id: 'job_rice_logistics',
    sectorId: 'agriculture_maritime',
    title: 'Koordinator Distribusi Lumbung Beras Nasional',
    company: 'Perum BULOG Sentra Nusantara',
    location: 'Karawang, Jawa Barat',
    wageRp: 14500000,
    energyCost: 15,
    requiredLevel: 1,
    requiredPerk: { name: 'charisma', min: 10, label: 'Karisma' },
    rewardExp: 65,
    resourceProduced: 'rice',
    resourceQty: 80,
    description: 'Menyalurkan cadangan beras pemerintah untuk operasi pasar stabilisasi harga pangan kebutuhan pokok rakyat.'
  },

  // 4. Pertahanan & Keamanan Teritorial
  {
    id: 'job_radar_technician',
    sectorId: 'defense_security',
    title: 'Teknisi Radar Pengawas ZEE Laut Natuna',
    company: 'Komando Armada I TNI AL',
    location: 'Ranai, Kepulauan Riau',
    wageRp: 25000000,
    energyCost: 24,
    requiredLevel: 4,
    requiredPerk: { name: 'intellect', min: 14, label: 'Intelektualitas' },
    rewardExp: 105,
    resourceProduced: null,
    resourceQty: 0,
    description: 'Mengoperasikan stasiun radar pantai 3D guna mendeteksi kapal survei asing tanpa izin di koridor ZEE Indonesia.'
  }
];

export const WORK_HISTORY_RECORDS = [];

