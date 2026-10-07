// Data Peperangan, Pertahanan Militer & Perebutan Wilayah (Wars & Geopolitical Conflicts)
// Terinspirasi dari Rival Regions: Front Peperangan Aktif, Kerusakan Taktis, Unit Militer, dan Perebutan Wilayah

export const MILITARY_UNITS = [
  {
    id: 'infantry',
    name: 'Pasukan Infanteri & Raider',
    type: 'Darat',
    attack: 15,
    defense: 25,
    energyCost: 10,
    moneyCost: 1500000,
    icon: 'Sword',
    color: '#10b981',
    description: 'Batalyon tempur garis depan untuk pertahanan parit dan pendudukan teritorial.'
  },
  {
    id: 'tanks',
    name: 'Divisi Kavaleri Lapis Baja (MBT)',
    type: 'Lapis Baja',
    attack: 45,
    defense: 35,
    energyCost: 18,
    moneyCost: 5000000,
    icon: 'Shield',
    color: '#f59e0b',
    description: 'Armada tank tempur utama Leopard & Harimau untuk menerobos pertahanan musuh.'
  },
  {
    id: 'jets',
    name: 'Skadron Udara Tempur (Air Superiority)',
    type: 'Udara',
    attack: 80,
    defense: 20,
    energyCost: 25,
    moneyCost: 12000000,
    icon: 'Plane',
    color: '#38bdf8',
    description: 'Jet tempur Rafale & F-16 untuk serangan udara presisi dan mematikan sistem radar.'
  },
  {
    id: 'warships',
    name: 'Armada Kapal Frigat & Selam Siluman',
    type: 'Laut',
    attack: 65,
    defense: 55,
    energyCost: 22,
    moneyCost: 9500000,
    icon: 'Anchor',
    color: '#06b6d4',
    description: 'Gugus tempur laut pengawas selat strategis dan blokade logistik maritim.'
  },
  {
    id: 'missiles',
    name: 'Sistem Rudal Balistik Taktis & Drone Kamikaze',
    type: 'Artileri Berat',
    attack: 120,
    defense: 10,
    energyCost: 35,
    moneyCost: 25000000,
    icon: 'Crosshair',
    color: '#ef4444',
    description: 'Hulu ledak presisi jarak jauh untuk melumpuhkan pangkalan komando lawan.'
  }
];

export const INITIAL_ACTIVE_WARS = [];

export const WAR_HISTORY_ARCHIVE = [];

