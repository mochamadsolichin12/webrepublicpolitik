// Model Ekonomi Realistis Dunia Nyata (Real-World Macroeconomics & Commodity Markets)
// Komoditas Pasar Bebas, Nilai Tukar Rupiah/USD/Emas, Suku Bunga BI-Rate, Inflasi, dan Pabrik Industri

export const COMMODITIES_MARKET = [
  {
    id: 'batu',
    name: 'Batu',
    unit: 'Unit',
    category: 'Material Alam',
    basePriceRp: 34.3,
    currentPriceRp: 34.3,
    change24h: 1.2,
    volatility: 0.02,
    worldDemand: 'Tinggi',
    provinces: ['Jawa Barat', 'Sumatera Barat'],
    icon: 'Pickaxe',
    color: '#94a3b8',
    description: 'Bahan galian batuan pondasi untuk konstruksi infrastruktur dan benteng pertahanan.'
  },
  {
    id: 'kayu',
    name: 'Kayu',
    unit: 'Unit',
    category: 'Material Alam',
    basePriceRp: 32.9,
    currentPriceRp: 32.9,
    change24h: -0.8,
    volatility: 0.02,
    worldDemand: 'Tinggi',
    provinces: ['Kalimantan Timur', 'Papua'],
    icon: 'Boxes',
    color: '#d97706',
    description: 'Bahan baku kayu glondongan untuk perumahan, galangan kapal, dan furnitur.'
  },
  {
    id: 'minyak',
    name: 'Minyak',
    unit: 'Barel',
    category: 'Energi Fosil',
    basePriceRp: 25.0,
    currentPriceRp: 25.0,
    change24h: 2.5,
    volatility: 0.05,
    worldDemand: 'Sangat Tinggi',
    provinces: ['Riau', 'Jawa Timur'],
    icon: 'Fuel',
    color: '#f59e0b',
    description: 'Bahan bakar minyak mentah untuk kilang industri, logistik transportasi, dan militer.'
  },
  {
    id: 'uranium',
    name: 'Uranium',
    unit: 'Kg',
    category: 'Mineral Strategis',
    basePriceRp: 21.6,
    currentPriceRp: 21.6,
    change24h: 4.1,
    volatility: 0.08,
    worldDemand: 'Ekstrem (Nuklir & Energi)',
    provinces: ['Kalimantan Barat', 'Bangka Belitung'],
    icon: 'Zap',
    color: '#10b981',
    description: 'Bahan bakar reaktor nuklir pembangkit listrik dan hulu ledak strategis berdaya hancur tinggi.'
  },
  {
    id: 'besi',
    name: 'Besi',
    unit: 'Batang',
    category: 'Logam Industri',
    basePriceRp: 36.6,
    currentPriceRp: 36.6,
    change24h: -1.2,
    volatility: 0.03,
    worldDemand: 'Tinggi',
    provinces: ['Sulawesi Tengah', 'Kalimantan Selatan'],
    icon: 'Layers',
    color: '#64748b',
    description: 'Logam besi mentah olahan smelter untuk rangka konstruksi, tank tempur, dan persenjataan.'
  },
  {
    id: 'tembaga',
    name: 'Tembaga',
    unit: 'Gulung',
    category: 'Logam Mulia Industri',
    basePriceRp: 20.0,
    currentPriceRp: 20.0,
    change24h: 0.5,
    volatility: 0.04,
    worldDemand: 'Tinggi (Kelistrikan Dunia)',
    provinces: ['Papua Tengah', 'Nusa Tenggara Barat'],
    icon: 'Coins',
    color: '#ea580c',
    description: 'Konduktor tembaga murni untuk instalasi kelistrikan nasional, drone, dan sirkuit mikrocip.'
  },
  {
    id: 'gas',
    name: 'Gas',
    unit: 'Tabung',
    category: 'Energi Gas',
    basePriceRp: 25.8,
    currentPriceRp: 25.8,
    change24h: 1.8,
    volatility: 0.03,
    worldDemand: 'Tinggi',
    provinces: ['Aceh (Arun)', 'Kepulauan Riau (Natuna)'],
    icon: 'Fuel',
    color: '#06b6d4',
    description: 'Gas alam cair LNG untuk pasokan industri pupuk kimia dan energi rumah tangga.'
  }
];

export const INITIAL_MACRO_INDICATORS = {
  gdpNominalRp: 0, // Rp 0 (Mulai dari Nol)
  gdpGrowthRate: 0.0, // 0%
  inflationRate: 0.0, // 0%
  biRate: 0.0, // 0%
  exchangeRateUsd: 15850, // Nilai tukar standar Rp 15.850 per 1 USD
  tradeBalanceUsd: 0, // $0
  fxReservesUsd: 0, // $0
  unemploymentRate: 0.0, // 0%
};

export const INDUSTRIAL_FACILITIES = [
  {
    id: 'smelter_nikel',
    name: 'Pabrik Smelter Nikel High-Pressure Acid Leach (HPAL)',
    costRp: 150000000,
    dailyProfitRp: 18000000,
    resourceProduced: 'nickel',
    yieldUnits: 3,
    description: 'Mengolah bijih nikel laterit menjadi endapan presipitat hidroksida campuran untuk rantai pasok baterai global.'
  },
  {
    id: 'pabrik_sawit',
    name: 'Pabrik Kelapa Sawit (PKS) & Biodiesel Rafinasi',
    costRp: 85000000,
    dailyProfitRp: 9500000,
    resourceProduced: 'cpo',
    yieldUnits: 8,
    description: 'Mengolah Tandan Buah Segar (TBS) petani menjadi minyak sawit mentah CPO dan bahan bakar hayati B40.'
  },
  {
    id: 'rig_migas',
    name: 'Anjungan Pengeboran Lepas Pantai (Offshore Oil Rig)',
    costRp: 250000000,
    dailyProfitRp: 32000000,
    resourceProduced: 'oil',
    yieldUnits: 25,
    description: 'Menyedot cadangan minyak dan kondensat laut dalam di selat perbatasan maritim nusantara.'
  },
  {
    id: 'lumbung_modern',
    name: 'Sentra Penggilingan Beras Modern (Rice Milling Plant)',
    costRp: 45000000,
    dailyProfitRp: 5200000,
    resourceProduced: 'rice',
    yieldUnits: 450,
    description: 'Menyerap panen gabah petani lokal dengan mesin pengering modern untuk menstabilkan pasokan beras daerah.'
  }
];
