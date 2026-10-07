import React from 'react';
import { Loader2, Shield } from 'lucide-react';

const MODULE_LABELS = {
  map: 'Peta Geopolitik Dunia & NKRI',
  parliament: 'Sidang Parlemen',
  elections: 'Pusat Pemilu & Komisi Pemilihan',
  parties: 'Direktori Partai Politik',
  career: 'Markas Karir & Birokrasi',
  media: 'Percetakan & Dewan Pers Nasional',
  budget: 'Perbendaharaan & Kas Negara',
  database: 'Studio Basis Data SQLite',
  wars: 'Komando Front Militer & Perang Wilayah',
  legislation: 'Badan Legislasi & Pengajuan RUU',
  economy: 'Bursa Pasar Bebas & Makroekonomi',
  jobs: 'Bursa Tenaga Kerja & Dinas Negara',
  settings: 'Pengaturan & Konfigurasi Sistem'
};

export default function ViewLoader({ tab = 'map' }) {
  const label = MODULE_LABELS[tab] || 'Modul Kenegaraan';

  return (
    <div className="view-module-loader">
      <div className="loader-inner-card glass-panel-gold">
        <div className="loader-radar-wrapper">
          <div className="loader-radar-sweep"></div>
          <div className="loader-center-icon">
            <Shield size={28} className="gold-accent-icon animate-pulse" />
          </div>
        </div>
        <div className="loader-text-group">
          <div className="loader-heading">
            <Loader2 size={16} className="spin-fast gold-accent" />
            <span>Memuat {label}</span>
          </div>
          <p className="loader-subtext">Mengunduh bundle modul dan sinkronisasi status negara...</p>
        </div>
        <div className="loader-progress-track">
          <div className="loader-progress-bar"></div>
        </div>
      </div>
    </div>
  );
}
