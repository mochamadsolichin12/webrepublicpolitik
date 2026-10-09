import { resolve, dirname } from 'path';
import { fileURLToPath } from 'url';
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  build: {
    chunkSizeWarningLimit: 600,
    rollupOptions: {
      input: {
        main: resolve(__dirname, 'index.html'),
        map: resolve(__dirname, 'map.html'),
        parliament: resolve(__dirname, 'parliament.html'),
        elections: resolve(__dirname, 'elections.html'),
        parties: resolve(__dirname, 'parties.html'),
        career: resolve(__dirname, 'career.html'),
        media: resolve(__dirname, 'media.html'),
        budget: resolve(__dirname, 'budget.html'),
        database: resolve(__dirname, 'database.html'),
        admin: resolve(__dirname, 'admin.html'),
        moderator: resolve(__dirname, 'moderator.html'),
        profile: resolve(__dirname, 'profile.html'),
        wars: resolve(__dirname, 'wars.html'),
        legislation: resolve(__dirname, 'legislation.html'),
        economy: resolve(__dirname, 'economy.html'),
        jobs: resolve(__dirname, 'jobs.html'),
        settings: resolve(__dirname, 'settings.html'),
        shop: resolve(__dirname, 'shop.html'),
      },
      output: {
        manualChunks: (id) => {
          if (id.includes('node_modules/leaflet')) {
            return 'vendor-leaflet';
          }
          if (id.includes('node_modules/lucide-react')) {
            return 'vendor-icons';
          }
          if (id.includes('node_modules/react') || id.includes('node_modules/react-dom')) {
            return 'vendor-react';
          }
        },
      },
    },
  },
});
