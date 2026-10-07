# 📜 Progress & Log Pengembangan Proyek: Republic Politic

Dokumen ini mencatat seluruh rekam jejak, arsitektur sistem, dan kemajuan implementasi fitur pada proyek **Republic Politic** (Geopolitical & Political Statecraft Simulator).

---

## 📌 1. Identitas & Branding Proyek
- **Nama Game**: Republic Politic *(diperbarui dari Republic Politik / nama sebelumnya)*
- **Deskripsi**: Simulator geopolitik, partai politik, peperangan militer, diplomasi regional, dan ketatanegaraan berbasis web interaktif.
- **Teknologi**: 
  - **Frontend**: React (Vite), Vanilla CSS design system, Lucide React Icons, Leaflet Maps.
  - **Backend / Database**: Express.js API, SQLite Database Studio, In-memory & LocalStorage Fallback Persistence.
  - **Arsitektur Halaman**: Multi-page HTML entry points + SPA Modular Lazy-Loaded Views.

---

## 🚀 2. Ringkasan Progres & Fitur yang Telah Diimplementasikan

### A. Halaman Beranda (Landing & Dashboard Utama)
Halaman pertama yang langsung dilihat pengguna saat membuka web (`http://localhost:5173` atau `index.html`), mencakup:
1. **Header Kedaulatan Wilayah (Posisi Paling Atas)**:
   - Menampilkan wilayah yang sedang ditempati pemain (misal: *DKI Jakarta*).
   - Menampilkan nama negara (*Republik Indonesia*).
   - Metrik statistik: **Pemain Aktif**, **Total Pemain Terdaftar**, dan **Jumlah Partai Politik Aktif**.
2. **Profil Pemain (Kartu Ringkasan)**:
   - Foto profil / avatar pemain, nama lengkap & username, saldo kas pribadi (Rupiah), tabungan emas, dan sisa energi kerja.
3. **Pemain dengan Serangan Terbesar (24h Top Attacker)**:
   - Menampilkan pemain pemegang rekor damage militer tertinggi dalam 24 jam terakhir beserta badge capaian.
4. **Frontline Perang Aktif**:
   - Status perang kedaulatan real-time dengan bar dominasi penyerang vs bertahan serta tombol aksi cepat untuk terjun ke medan tempur.
5. **Artikel Teratas Negara**:
   - Menampilkan berita/koran terpopuler, metrik pembaca (*views*), dan jumlah dukungan suara (*upvotes*).
6. **Widget Obrolan Publik Dwibahasa**:
   - Tab **Obrolan Nasional**: Ruang obrolan bahasa Indonesia untuk warga sesama negara.
   - Tab **Obrolan Global**: Ruang diplomasi dunia lintas negara.
   - Dilengkapi form kirim pesan langsung yang tersinkronisasi ke sistem state.
7. **Pembaruan Akses Langsung**:
   - Sistem login default langsung mengarahkan ke akun pemain (*Raden Satria Nusantara*), memastikan pengguna langsung disajikan tampilan Beranda tanpa terhalang form otentikasi kosong.

---

### B. Sistem Partai Politik Player-Driven
1. **Pembersihan Partai Bawaan (Default Seed Clean)**:
   - Semua partai bawaan/AI awal telah dihapus.
   - Hanya partai yang **dibuat oleh pemain** yang akan muncul dan eksis di negara.
2. **Aturan Penutupan / Pembubaran Partai**:
   - Tombol **Tutup / Bubarkan Partai** hanya aktif untuk **Pemimpin Partai**.
   - **Proteksi Anggota**: Partai **hanya bisa ditutup jika belum ada pemain lain yang bergabung** (hanya ada pemimpin tunggal). Jika sudah ada anggota lain, sistem menolak pembubaran demi melindungi hak kader.

---

### C. Profil Pemain & Identitas KTP
1. **Penyuntingan Data KTP**:
   - Label tombol dan formulir telah disesuaikan menjadi **"Ubah"** (menggantikan "Sunting Data KTP").
2. **Pembaruan Istilah Diplomasi**:
   - Bagian atribut diplomatik resmi diganti namanya menjadi **"Keterampilan"**.
3. **Mekanisme Otomatis Kharisma & Retorika (Fame-Driven Dynamics)**:
   - Tombol manual *"Tingkatkan"* pada Kharisma dan Retorika telah **dihapus**.
   - Nilai Kharisma dan Retorika sekarang **bergerak dinamis (naik/turun)** berdasarkan tingkat ketenaran (*popularity/fame*) dan hasil pemilihan suara saat pemain maju mencalonkan diri sebagai pemimpin negara atau anggota parlemen.

---

### D. Sistem Navigasi & Struktur Rute Multi-Halaman
Setiap modul dapat diakses langsung secara mandiri melalui URL atau menu navigasi:
- `index.html` → **Beranda Republik** (`activeTab: 'home'`)
- `map.html` → **Peta Geopolitik Dunia & Indonesia** (`activeTab: 'map'`)
- `parties.html` → **Partai Politik & Koalisi** (`activeTab: 'parties'`)
- `elections.html` → **Pemilu Presiden & Parlemen** (`activeTab: 'elections'`)
- `parliament.html` → **Gedung Parlemen DPR** (`activeTab: 'parliament'`)
- `wars.html` → **Operasi Militer & Front Perang** (`activeTab: 'wars'`)
- `economy.html` → **Ekonomi Nasional & Perdagangan** (`activeTab: 'economy'`)
- `jobs.html` → **Bursa Tenaga Kerja & Industri** (`activeTab: 'jobs'`)
- `media.html` → **Percetakan Koran & Media Publik** (`activeTab: 'media'`)
- `budget.html` → **APBN & Kas Negara** (`activeTab: 'budget'`)
- `profile.html` → **Profil & KTP Warga Negara** (`activeTab: 'profile'`)
- `admin.html` / `moderator.html` → **Panel Administrasi & Pengawas**

---

## 🛠️ 3. Perubahan File Penting (Changelog)

| Berkas | Jenis Perubahan | Deskripsi Singkat |
|---|---|---|
| `src/components/HomeDashboardView.jsx` | File Baru | Komponen Beranda utama dengan metrik region, negara, perang, chat, artikel, dan top attacker. |
| `src/context/GameContext.jsx` | Modifikasi | Menambahkan state chat dwibahasa, top attackers 24 jam, fallback default user ke Satria, dan logika partai player-only. |
| `src/App.jsx` | Modifikasi | Mengarahkan root landing view ke `HomeDashboardView` dan routing tab `home`. |
| `src/components/Sidebar.jsx` | Modifikasi | Menambahkan menu "Beranda Republik" di posisi paling atas bilah navigasi. |
| `src/components/Navbar.jsx` | Modifikasi | Mengarahkan klik emblem/logo ke Beranda. |
| `src/utils/navigation.js` | Modifikasi | Sinkronisasi rute `home` (`index.html`) dan memindahkan peta ke `map.html`. |
| `src/components/PartiesView.jsx` | Modifikasi | Validasi penutupan partai khusus pemimpin tunggal dan pemfilteran partai buatan player. |
| `src/components/PlayerProfileView.jsx` | Modifikasi | Pengubahan label KTP menjadi "Ubah", penamaan "Keterampilan", dan otomatisasi Kharisma/Retorika tanpa tombol tingkatkan manual. |
| `src/App.css` | Modifikasi | Styling modular untuk layout Beranda, widget chat, kartu profil, dan banner region. |

---

## 📋 4. Rencana Pengembangan Selanjutnya (Next Milestones)
- [ ] Penambahan filter waktu (24 jam / mingguan / all-time) untuk damage leaderboard militer.
- [ ] Integrasi WebSocket / Server-Sent Events (SSE) untuk realtime chat publik nasional & global.
- [ ] Fitur pembuatan koalisi antar partai politik buatan player.
- [ ] Sistem notifikasi pemilihan umum saat masa voting kepemimpinan negara dibuka.
