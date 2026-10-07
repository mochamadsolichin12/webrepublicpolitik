// Data GeoJSON Siluet Geografis & Garis Teritorial Negara Kesatuan Republik Indonesia
// Membentuk siluet kedaulatan pulau-pulau besar dan kepulauan strategis Nusantara

export const INDONESIA_SILHOUETTES_GEOJSON = {
  type: "FeatureCollection",
  features: [
    // ==================== 1. SILUET SUMATERA ====================
    {
      type: "Feature",
      properties: {
        id: "sumatera",
        name: "Kepulauan Sumatera",
        island: "sumatera",
        title: "Kawasan Siluet Sumatera",
        color: "#10b981",
        description: "Benteng Barat NKRI - Lumbung Energi Migas, Sawit & Kopi Nusantara",
        provincesCount: 10,
        strategicImportance: "Selat Malaka & Samudra Hindia"
      },
      geometry: {
        type: "Polygon",
        coordinates: [
          [
            [95.32, 5.58],    // Banda Aceh
            [95.33, 5.89],    // Ujung Sabang
            [96.15, 5.25],    // Pidie / Sigli
            [97.14, 5.18],    // Lhokseumawe
            [97.98, 4.48],    // Langsa
            [98.42, 4.02],    // Pangkalan Brandan
            [98.67, 3.60],    // Medan / Deli
            [99.07, 3.35],    // Tebing Tinggi
            [99.64, 3.15],    // Asahan / Tanjungbalai
            [100.35, 2.50],   // Labuhanbatu
            [101.45, 1.67],   // Dumai
            [102.15, 1.48],   // Bengkalis
            [102.72, 0.95],   // Siak Sri Indrapura
            [103.20, 0.32],   // Kuala Enok
            [103.62, -0.80],  // Tanjung Jabung Barat
            [103.85, -1.25],  // Muara Sabak
            [104.55, -2.15],  // Banyuasin
            [105.10, -2.60],  // Sungsang
            [105.80, -3.85],  // Tulang Bawang Pantai
            [105.90, -4.50],  // Menggala
            [105.82, -5.20],  // Lampung Timur
            [105.75, -5.87],  // Bakauheni (Ujung Selatan)
            [105.26, -5.45],  // Teluk Lampung / Bandar Lampung
            [104.60, -5.50],  // Kota Agung / Teluk Semangka
            [103.95, -5.18],  // Krui / Pesisir Barat
            [103.35, -4.82],  // Kaur
            [102.90, -4.47],  // Manna
            [102.26, -3.80],  // Bengkulu City
            [101.80, -3.20],  // Lais
            [101.10, -2.58],  // Mukomuko
            [100.58, -1.35],  // Painan
            [100.35, -0.95],  // Padang / Teluk Bayur
            [100.12, -0.62],  // Pariaman
            [99.80, -0.15],   // Pasaman Barat
            [99.05, 0.85],    // Mandailing Natal
            [98.78, 1.74],    // Sibolga
            [98.60, 2.05],    // Barus
            [97.80, 2.33],    // Singkil
            [97.18, 3.25],    // Tapaktuan
            [96.80, 3.75],    // Blangpidie
            [96.13, 4.15],    // Meulaboh
            [95.58, 4.60],    // Calang
            [95.25, 5.20],    // Lhoong
            [95.32, 5.58]     // Kembali ke Banda Aceh
          ]
        ]
      }
    },

    // ==================== 2. SILUET JAWA & MADURA ====================
    {
      type: "Feature",
      properties: {
        id: "jawa",
        name: "Pulau Jawa & Madura",
        island: "jawa",
        title: "Kawasan Siluet Jawa",
        color: "#3b82f6",
        description: "Pusat Gravitasi Politik, Ekonomi & Demografi Terbesar Republik",
        provincesCount: 6,
        strategicImportance: "Pusat Pemerintahan, Industri & Jalur Pantura"
      },
      geometry: {
        type: "Polygon",
        coordinates: [
          [
            [105.95, -6.02],  // Merak / Cilegon (Ujung Barat)
            [106.20, -5.98],  // Bojonegara
            [106.83, -6.12],  // Tanjung Priok / Teluk Jakarta
            [107.05, -6.00],  // Muara Gembong
            [107.50, -6.20],  // Pamanukan
            [108.30, -6.35],  // Indramayu
            [108.57, -6.72],  // Cirebon
            [109.13, -6.86],  // Brebes / Tegal
            [109.67, -6.88],  // Pekalongan
            [110.42, -6.97],  // Semarang
            [110.68, -6.58],  // Jepara / Semenanjung Muria
            [111.05, -6.45],  // Pati Utara
            [111.35, -6.70],  // Rembang
            [112.05, -6.88],  // Tuban
            [112.60, -7.05],  // Gresik
            [112.75, -7.20],  // Surabaya
            [112.90, -7.10],  // Kamal / Selat Madura
            [113.60, -6.85],  // Madura Utara
            [114.05, -7.02],  // Sumenep / Kalianget (Ujung Timur Madura)
            [113.25, -7.22],  // Sampang Selatan
            [113.20, -7.75],  // Probolinggo
            [113.98, -7.70],  // Situbondo
            [114.38, -7.85],  // Baluran
            [114.40, -8.15],  // Ketapang / Banyuwangi (Ujung Timur Jawa)
            [114.35, -8.65],  // Grajagan / Semenanjung Blambangan
            [113.45, -8.35],  // Puger / Jember Selatan
            [112.60, -8.30],  // Malang Selatan / Sendang Biru
            [111.85, -8.25],  // Tulungagung / Prigi
            [111.10, -8.22],  // Pacitan / Teluk Teleng
            [110.60, -8.15],  // Wonosari
            [110.35, -8.02],  // Parangtritis / Yogyakarta
            [110.05, -7.90],  // Congot / Kulon Progo
            [109.02, -7.72],  // Teluk Penyu / Cilacap
            [108.65, -7.70],  // Pangandaran
            [108.00, -7.65],  // Tasikmalaya Selatan
            [107.45, -7.45],  // Garut Selatan / Pameungpeuk
            [106.90, -7.20],  // Sukabumi Selatan / Tegal Buleud
            [106.40, -7.35],  // Ujung Genteng
            [106.55, -6.98],  // Pelabuhan Ratu
            [106.00, -6.90],  // Malingping
            [105.60, -6.82],  // Binuangeun
            [105.25, -6.75],  // Semenanjung Ujung Kulon
            [105.65, -6.35],  // Labuan
            [105.82, -6.15],  // Anyer
            [105.95, -6.02]   // Kembali ke Merak
          ]
        ]
      }
    },

    // ==================== 3. SILUET BALI & NUSA TENGGARA ====================
    {
      type: "Feature",
      properties: {
        id: "nusa_tenggara",
        name: "Kepulauan Bali & Nusa Tenggara",
        island: "nusa_tenggara",
        title: "Kawasan Siluet Sunda Kecil",
        color: "#ec4899",
        description: "Pusat Pariwisata Dunia, Koridor Maritim ALKI II & Cagar Biosfer Komodo",
        provincesCount: 3,
        strategicImportance: "Pariwisata Internasional, Peternakan & Selat Lombok"
      },
      geometry: {
        type: "MultiPolygon",
        coordinates: [
          // BALI
          [
            [
              [114.43, -8.16],  // Gilimanuk
              [115.08, -8.10],  // Singaraja
              [115.35, -8.12],  // Kubutambahan
              [115.70, -8.35],  // Amed / Karangasem
              [115.50, -8.53],  // Padangbai
              [115.26, -8.68],  // Sanur / Denpasar
              [115.22, -8.85],  // Nusa Dua
              [115.08, -8.83],  // Uluwatu
              [115.16, -8.70],  // Kuta
              [115.08, -8.62],  // Tanah Lot
              [114.70, -8.40],  // Negara
              [114.43, -8.16]   // Gilimanuk
            ]
          ],
          // LOMBOK
          [
            [
              [116.05, -8.73],  // Lembar
              [116.07, -8.57],  // Mataram
              [116.15, -8.35],  // Bangsal
              [116.42, -8.25],  // Bayan
              [116.65, -8.50],  // Labuhan Lombok
              [116.45, -8.85],  // Praya Selatan
              [116.28, -8.92],  // Kuta Mandalika
              [116.05, -8.73]   // Lembar
            ]
          ],
          // SUMBAWA
          [
            [
              [116.85, -8.50],  // Poto Tano
              [117.40, -8.45],  // Sumbawa Besar
              [118.00, -8.30],  // Teluk Saleh
              [118.50, -8.25],  // Dompu Utara
              [119.00, -8.45],  // Bima / Sape
              [118.70, -8.90],  // Parado
              [117.80, -9.00],  // Lunyuk
              [116.85, -8.90],  // Sekongkang
              [116.85, -8.50]   // Poto Tano
            ]
          ],
          // FLORES
          [
            [
              [119.88, -8.50],  // Labuan Bajo
              [120.45, -8.30],  // Reo
              [121.25, -8.45],  // Riung
              [122.20, -8.60],  // Maumere
              [123.00, -8.35],  // Larantuka
              [122.80, -8.70],  // Flores Timur Selatan
              [121.65, -8.85],  // Ende
              [120.85, -8.80],  // Aimere / Bajawa
              [120.00, -8.75],  // Lembor
              [119.88, -8.50]   // Labuan Bajo
            ]
          ],
          // TIMOR BARAT
          [
            [
              [123.50, -10.20], // Kupang
              [124.00, -9.85],  // Soe
              [124.50, -9.50],  // Kefa
              [124.95, -9.10],  // Atambua (Batas RDTL)
              [125.05, -9.35],  // Perbatasan Selatan
              [124.20, -10.05], // Rote Strait
              [123.50, -10.20]  // Kupang
            ]
          ]
        ]
      }
    },

    // ==================== 4. SILUET KALIMANTAN (BORNEO INDONESIA) ====================
    {
      type: "Feature",
      properties: {
        id: "kalimantan",
        name: "Pulau Kalimantan (IKN Nusantara)",
        island: "kalimantan",
        title: "Kawasan Siluet Kalimantan",
        color: "#f59e0b",
        description: "Jantung Khatulistiwa, Paru-paru Dunia & Ibu Kota Nusantara (IKN)",
        provincesCount: 5,
        strategicImportance: "IKN Nusantara, Batubara, Hutan Tropis & ALKI II"
      },
      geometry: {
        type: "Polygon",
        coordinates: [
          [
            [109.30, 1.82],   // Paloh (Batas Sarawak Barat)
            [108.95, 0.90],   // Singkawang
            [109.15, 0.35],   // Mempawah
            [109.32, -0.02],  // Pontianak
            [109.80, -1.20],  // Teluk Batang
            [109.95, -1.85],  // Sukadana
            [110.20, -2.60],  // Kendawangan (Ujung Barat Daya)
            [111.15, -3.05],  // Sukamara
            [111.70, -3.20],  // Kumai / Pangkalan Bun
            [112.90, -3.30],  // Sampit / Teluk Sampit
            [113.60, -3.40],  // Pegatan
            [114.50, -3.55],  // Muara Barito / Banjarmasin
            [114.80, -4.15],  // Pleihari (Ujung Selatan Kalimantan)
            [115.80, -3.80],  // Pagatan
            [116.20, -3.50],  // Kotabaru / Selat Laut
            [116.00, -2.85],  // Tanah Grogot Pantai
            [116.85, -1.25],  // Balikpapan
            [117.02, -0.92],  // Samboja / Pintu Masuk IKN
            [117.25, -0.50],  // Samarinda / Muara Mahakam
            [117.48, 0.15],   // Bontang
            [117.60, 0.50],   // Sangatta
            [118.98, 0.98],   // Tanjung Mangkalihat (Ujung Timur)
            [118.50, 1.80],   // Maratua / Berau Pantai
            [117.50, 2.15],   // Tanjung Redeb
            [117.40, 2.90],   // Tanjung Selor / Bulungan
            [117.60, 3.35],   // Tarakan
            [117.65, 4.15],   // Nunukan / Pulau Sebatik (Batas Sabah)
            // Garis Batas Darat NKRI - Malaysia (Pegunungan Schwaner & Muller):
            [116.80, 4.25],   // Perbatasan Nunukan
            [115.80, 3.80],   // Krayan Dataran Tinggi
            [115.00, 2.60],   // Malinau Pedalaman
            [114.50, 1.80],   // Mahakam Ulu
            [113.60, 1.25],   // Murung Raya Batas
            [112.50, 0.95],   // Kapuas Hulu Batas
            [111.80, 1.05],   // Badau
            [110.50, 1.10],   // Entikong / Sanggau
            [109.80, 1.35],   // Jagoi Babang
            [109.50, 1.65],   // Aruk Sambas
            [109.30, 1.82]    // Kembali ke Paloh
          ]
        ]
      }
    },

    // ==================== 5. SILUET SULAWESI ====================
    {
      type: "Feature",
      properties: {
        id: "sulawesi",
        name: "Pulau Sulawesi",
        island: "sulawesi",
        title: "Kawasan Siluet Sulawesi",
        color: "#8b5cf6",
        description: "Poros Maritim Timur, Pusat Hilirisasi Nikel & Kekayaan Bahari Tropis",
        provincesCount: 6,
        strategicImportance: "Hilirisasi Nikel Global, Selat Makassar & Perikanan Pasifik"
      },
      geometry: {
        type: "MultiPolygon",
        coordinates: [
          // DARATAN UTAMA SULAWESI (BENTUK K)
          [
            [
              [119.85, -0.90],  // Palu
              [119.70, -0.60],  // Donggala
              [120.30, 0.50],   // Dampelas
              [120.80, 1.05],   // Tolitoli
              [121.40, 1.10],   // Buol
              [122.20, 0.90],   // Gorontalo Utara
              [123.50, 0.95],   // Bolaang Mongondow Utara
              [124.30, 1.15],   // Amurang
              [124.84, 1.48],   // Manado
              [125.18, 1.45],   // Bitung (Ujung Utara Timur)
              [124.90, 0.85],   // Kotamobagu Pantai
              [123.05, 0.55],   // Teluk Tomini / Gorontalo
              [121.50, -0.30],  // Ampana
              [122.80, -0.95],  // Luwuk Banggai (Ujung Semenanjung Timur)
              [122.50, -1.25],  // Batui
              [121.35, -2.00],  // Kolonodale / Morowali (Pusat Baterai)
              [122.20, -2.85],  // Konawe Utara
              [122.55, -3.95],  // Kendari
              [123.00, -4.50],  // Teluk Staring
              [122.60, -5.45],  // Baubau / Buton
              [121.80, -4.80],  // Bombana
              [121.60, -4.05],  // Kolaka / Pomalaa
              [121.10, -3.20],  // Siwa
              [120.35, -4.50],  // Watampone / Bone
              [120.45, -5.60],  // Tanjung Bira (Ujung Selatan Sulawesi)
              [119.50, -5.50],  // Jeneponto / Takalar
              [119.42, -5.15],  // Makassar
              [119.62, -4.01],  // Parepare
              [119.20, -3.55],  // Polewali Mandar
              [118.80, -2.70],  // Majene / Mamuju
              [119.25, -1.80],  // Karossa
              [119.40, -1.35],  // Pasangkayu
              [119.85, -0.90]   // Kembali ke Palu
            ]
          ]
        ]
      }
    },

    // ==================== 6. SILUET KEPULAUAN MALUKU ====================
    {
      type: "Feature",
      properties: {
        id: "maluku",
        name: "Kepulauan Maluku & Maluku Utara",
        island: "maluku",
        title: "Kawasan Siluet Maluku",
        color: "#06b6d4",
        description: "Kepulauan Rempah Legendaris, Hub Maritim Laut Banda & Smelter Halmahera",
        provincesCount: 2,
        strategicImportance: "Pala, Cengkih, Smelter Weda Bay & Perikanan Banda"
      },
      geometry: {
        type: "MultiPolygon",
        coordinates: [
          // HALMAHERA & TERNATE/TIDORE
          [
            [
              [127.40, 0.75],   // Sofifi / Ternate Strait
              [127.80, 1.70],   // Tobelo
              [128.50, 1.85],   // Galela
              [128.75, 1.25],   // Halmahera Timur
              [128.50, 0.80],   // Teluk Buli
              [128.00, 0.35],   // Weda Bay
              [128.30, -0.50],  // Patani
              [127.80, -0.80],  // Gane Timur
              [127.40, -0.40],  // Labuha / Bacan
              [127.40, 0.75]    // Sofifi
            ]
          ],
          // PULAU SERAM & AMBON
          [
            [
              [128.18, -3.70],  // Teluk Ambon
              [128.90, -3.30],  // Masohi
              [129.50, -3.00],  // Wahai (Utara Seram)
              [130.50, -3.10],  // Bula (Minyak Seram)
              [130.80, -3.80],  // Ujung Timur Seram
              [129.80, -3.60],  // Tehoru
              [128.80, -3.50],  // Hitu
              [128.18, -3.70]   // Ambon
            ]
          ]
        ]
      }
    },

    // ==================== 7. SILUET TANAH PAPUA ====================
    {
      type: "Feature",
      properties: {
        id: "papua",
        name: "Tanah Papua",
        island: "papua",
        title: "Kawasan Siluet Papua",
        color: "#ef4444",
        description: "Matahari Terbit Nusantara, Puncak Salju Abadi & Cadangan Emas Terbesar",
        provincesCount: 6,
        strategicImportance: "Emas Grasberg, Gas Tangguh, Hutan Primer & Perbatasan Pasifik"
      },
      geometry: {
        type: "Polygon",
        coordinates: [
          [
            [131.25, -0.87],  // Sorong (Kepala Burung)
            [132.00, -0.50],  // Tambrauw Pantai
            [134.07, -0.86],  // Manokwari
            [134.30, -1.45],  // Ransiki
            [135.50, -3.35],  // Nabire
            [136.50, -2.50],  // Teluk Cenderawasih
            [138.70, -1.85],  // Sarmi
            [140.70, -2.53],  // Jayapura (Batas Utara PNG)
            // Garis Batas Internasional NKRI - Papua Nugini (Meridian 141° Bujur Timur):
            [141.00, -2.60],  // Batas Utara
            [141.00, -4.50],  // Batas Pegunungan Jayawijaya
            [141.00, -6.00],  // Batas Sungai Fly
            [141.00, -7.50],  // Batas Boven Digoel
            [141.00, -8.50],  // Batas Sota / Merauke
            [140.40, -8.50],  // Kota Merauke
            [138.50, -7.50],  // Muara Digul
            [138.10, -5.50],  // Agats / Asmat
            [136.90, -4.55],  // Mimika / Pelabuhan Amamapare
            [135.00, -4.00],  // Teluk Etna
            [133.75, -3.65],  // Kaimana
            [132.30, -2.90],  // Fakfak
            [133.00, -2.30],  // Bintuni / Kilang Tangguh LNG
            [131.80, -1.80],  // Teminabuan
            [131.25, -0.87]   // Kembali ke Sorong
          ]
        ]
      }
    },

    // ==================== 8. SILUET KEPULAUAN BANGKA & BELITUNG ====================
    {
      type: "Feature",
      properties: {
        id: "babel",
        name: "Kepulauan Bangka Belitung",
        island: "sumatera",
        title: "Kawasan Siluet Bangka Belitung",
        color: "#10b981",
        description: "Sentra Timah Nasional & Gerbang Bahari Laskar Pelangi",
        provincesCount: 1,
        strategicImportance: "Tambang Timah Dunia & Geopark Bahari"
      },
      geometry: {
        type: "MultiPolygon",
        coordinates: [
          // BANGKA
          [
            [
              [105.15, -1.90],
              [105.75, -1.60],
              [106.10, -2.10],
              [106.50, -3.00],
              [105.75, -2.85],
              [105.15, -1.90]
            ]
          ],
          // BELITUNG
          [
            [
              [107.60, -2.60],
              [108.20, -2.70],
              [108.25, -3.15],
              [107.75, -3.20],
              [107.60, -2.60]
            ]
          ]
        ]
      }
    }
  ]
};
