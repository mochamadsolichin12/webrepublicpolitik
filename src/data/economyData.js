// Model Ekonomi Realistis Dunia Nyata (Real-World Macroeconomics & Commodity Markets)
// Komoditas Pasar Bebas, Nilai Tukar Rupiah/USD/Emas, Suku Bunga BI-Rate, Inflasi, dan Pabrik Industri

export const COMMODITIES_MARKET = [
  {
    id: 'oil',
    name: 'Minyak Mentah (Crude Oil)',
    unit: 'Barel (bbl)',
    category: 'Energi Fosil',
    basePriceRp: 1250000, // Rp 1.250.000 / barel (~$78/bbl)
    currentPriceRp: 1285000,
    change24h: 2.8,
    volatility: 0.05,
    worldDemand: 'Sangat Tinggi',
    provinces: ['Riau', 'Jawa Timur', 'Papua Barat'],
    icon: 'Fuel',
    color: '#f59e0b',
    description: 'Bahan bakar industri transportasi dan pembangkit listrik. Mengontrol biaya logistik nasional.'
  },
  {
    id: 'nickel',
    name: 'Bijih Nikel & Ferronickel (Hilirisasi)',
    unit: 'Metrik Ton',
    category: 'Mineral Strategis',
    basePriceRp: 265000000, // Rp 265 Juta / ton
    currentPriceRp: 278000000,
    change24h: 4.9,
    volatility: 0.06,
    worldDemand: 'Ekstrem (Baterai EV Dunia)',
    provinces: ['Sulawesi Tengah', 'Maluku Utara', 'Sulawesi Tenggara'],
    icon: 'Layers',
    color: '#06b6d4',
    description: 'Komoditas primadona transisi energi dunia. Kunci pembuatan baterai mobil listrik & stainless steel.'
  },
  {
    id: 'cpo',
    name: 'Minyak Kelapa Sawit Mentah (CPO)',
    unit: 'Metrik Ton',
    category: 'Agrikultur & Pangan',
    basePriceRp: 14200000, // Rp 14.2 Juta / ton
    currentPriceRp: 14500000,
    change24h: 1.2,
    volatility: 0.03,
    worldDemand: 'Tinggi',
    provinces: ['Riau', 'Sumatera Utara', 'Kalimantan Barat'],
    icon: 'Sprout',
    color: '#10b981',
    description: 'Bahan baku minyak goreng rakyat, oleokimia, dan program mandiri energi Biodiesel B35/B40.'
  },
  {
    id: 'coal',
    name: 'Batubara Kalori Tinggi (Thermal Coal)',
    unit: 'Metrik Ton',
    category: 'Energi Fosil',
    basePriceRp: 2150000, // Rp 2.15 Juta / ton (~$135)
    currentPriceRp: 2090000,
    change24h: -1.8,
    volatility: 0.04,
    worldDemand: 'Moderat',
    provinces: ['Kalimantan Timur', 'Sumatera Selatan', 'Kalimantan Selatan'],
    icon: 'Boxes',
    color: '#64748b',
    description: 'Penyumbang royalti terbesar kas APBN dan sumber listrik PLTU jaringan Jawa-Bali & Sumatera.'
  },
  {
    id: 'gold_bullion',
    name: 'Emas Batangan Antam 99.99%',
    unit: 'Gram (g)',
    category: 'Logam Mulia (Safe Haven)',
    basePriceRp: 1480000, // Rp 1.480.000 / gram
    currentPriceRp: 1520000,
    change24h: 3.4,
    volatility: 0.02,
    worldDemand: 'Tinggi (Lindung Nilai)',
    provinces: ['Papua Tengah (Grasberg)', 'Nusa Tenggara Barat'],
    icon: 'Sparkles',
    color: '#fbbf24',
    description: 'Aset lindung nilai inflasi dan cadangan devisa terkuat moneter Bank Sentral.'
  },
  {
    id: 'rice',
    name: 'Beras Premium Petani Nusantara',
    unit: 'Kilogram (kg)',
    category: 'Pangan Pokok Rakyat',
    basePriceRp: 15500, // Rp 15.500 / kg
    currentPriceRp: 15200,
    change24h: -0.6,
    volatility: 0.015,
    worldDemand: 'Domestik Utama',
    provinces: ['Jawa Barat', 'Jawa Tengah', 'Sulawesi Selatan'],
    icon: 'Wheat',
    color: '#ec4899',
    description: 'Jantung ketahanan pangan bangsa. Menentukan angka inflasi bahan makanan (volatile foods).'
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
