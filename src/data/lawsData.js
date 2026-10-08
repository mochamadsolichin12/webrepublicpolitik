// RUU (Rancangan Undang-Undang) & UU Berlaku di Parlemen DPR RI
// Default naskah perundang-undangan dan arsip ketatanegaraan Republik Nusantara

export const INITIAL_BILLS = [
  {
    id: 'bill-tax-reform',
    title: 'RUU Pajak Karbon Industri & Bea Ekspor Nikel Hilir',
    category: 'Ekonomi, Perpajakan & Perbankan',
    komisi: 'Komisi XI Parlemen',
    proposedBy: 'Fraksi PTP (Partai Teknokrat Pembangunan)',
    sponsorPartyId: 'ptp',
    description: 'Mengenakan pajak karbon progresif 15% pada smelter batu bara asing dan memberikan tax holiday 20% bagi pabrik baterai EV dan semikonduktor di koridor industri Kendari, Morowali, dan Weda Bay.',
    impactText: '+$RP 28.5T Kas Perbendaharaan Negara, +8% Pertumbuhan Industri Hijau, -3% Polusi Karbon',
    votesRequired: 51,
    timeRemainingSeconds: 420,
    status: 'voting',
    votes: {
      agree: 42,
      reject: 18,
      abstain: 6
    },
    partySupport: {
      ptp: 'agree',
      pgr: 'agree',
      pdin: 'abstain',
      psim: 'agree',
      pksn: 'reject',
      pkbr: 'reject'
    },
    nationalEffect: {
      treasuryDelta: 28500000000,
      stabilityDelta: 4,
      supportDelta: 6
    }
  },
  {
    id: 'bill-military-radar',
    title: 'RUU Modernisasi Radar ZEE Maritim Natuna & Satelit Angkasa',
    category: 'Pertahanan, ZEE & Hubungan Internasional',
    komisi: 'Komisi I Parlemen',
    proposedBy: 'Fraksi PGR (Partai Gerakan Republik)',
    sponsorPartyId: 'pgr',
    description: 'Pengadaan sistem radar over-the-horizon 3D dan pangkalan kapal selam otonom di Laut Natuna Utara serta Selat Sunda untuk mendeteksi pelanggaran batas wilayah laut dan penangkapan ikan ilegal.',
    impactText: '+18 Poin Pertahanan Wilayah RI, +9% Kepercayaan Diplomatik, -$RP 22T Kas Negara',
    votesRequired: 51,
    timeRemainingSeconds: 580,
    status: 'voting',
    votes: {
      agree: 48,
      reject: 14,
      abstain: 8
    },
    partySupport: {
      pgr: 'agree',
      pdin: 'agree',
      ptp: 'agree',
      pkbr: 'agree',
      pksn: 'reject',
      psim: 'abstain'
    },
    nationalEffect: {
      treasuryDelta: -22000000000,
      stabilityDelta: 8,
      supportDelta: 5
    }
  },
  {
    id: 'bill-pangan-nusantara',
    title: 'RUU Jaminan Harga Gabah & Lumbung Pangan Nusantara',
    category: 'Kesejahteraan Sosial, Pertanian & Pangan',
    komisi: 'Komisi IV Parlemen',
    proposedBy: 'Fraksi PKB-R (Partai Kebangkitan Bangsa Rakyat)',
    sponsorPartyId: 'pkbr',
    description: 'Menjamin harga beli batas bawah gabah dan jagung panen raya petani lokal oleh Bulog sebesar minimal Rp 6.800/kg serta membangun 100 silo lumbung modern di Jawa Tengah, Jawa Timur, dan Sulawesi Selatan.',
    impactText: '+12% Kemakmuran Petani Daerah, +7% Ketahanan Pangan Nasional, -$RP 14T Alokasi APBN',
    votesRequired: 51,
    timeRemainingSeconds: 310,
    status: 'voting',
    votes: {
      agree: 38,
      reject: 22,
      abstain: 7
    },
    partySupport: {
      pkbr: 'agree',
      pdin: 'agree',
      pksn: 'agree',
      pgr: 'abstain',
      ptp: 'reject',
      psim: 'agree'
    },
    nationalEffect: {
      treasuryDelta: -14000000000,
      stabilityDelta: 6,
      supportDelta: 9
    }
  }
];

export const INITIAL_PASSED_LAWS = [
  {
    id: 'law-ikn-transfer',
    title: 'UU Pemindahan Ibu Kota Negara ke IKN Nusantara',
    category: 'Hukum, Keadilan & Tata Negara',
    passedYear: '2024',
    sponsor: 'Pemerintah Pusat & Koalisi DPR RI',
    summary: 'Memindahkan pusat pemerintahan lembaga tinggi negara ke Penajam Paser Utara, Kalimantan Timur sebagai simbol pemerataan ekonomi luar pulau Jawa.',
    activeBuff: '+15% Pertumbuhan Ekonomi Regional Timur, +10 Stabilitas Nasional'
  },
  {
    id: 'law-bpjs-universal',
    title: 'UU Jaminan Kesehatan & Rawat Inap Universal Semesta',
    category: 'Kesejahteraan Sosial, Pertanian & Pangan',
    passedYear: '2025',
    sponsor: 'Fraksi PDI-N & Komisi IX',
    summary: 'Mewajibkan cakupan perlindungan jaminan rawat inap kelas standar 100% tanpa diskriminasi bagi seluruh pemegang KTP Republik.',
    activeBuff: '+12% Indeks Kesejahteraan Rakyat, +8% Kepuasan Publik Nasional'
  },
  {
    id: 'law-hilirisasi-tambang',
    title: 'UU Kedaulatan Bahan Tambang & Larangan Ekspor Bijih Mentah',
    category: 'Energi, Pertambangan & Hilirisasi',
    passedYear: '2025',
    sponsor: 'Fraksi PGR & Fraksi PTP',
    summary: 'Melarang pengapalan bijih mentah bauksit, tembaga, nikel, dan timah tanpa proses pengolahan smelter dalam negeri bernilai tambah tinggi.',
    activeBuff: '+$RP 45 Triliun Pendapatan Ekspor Manufaktur per Tahun'
  }
];
