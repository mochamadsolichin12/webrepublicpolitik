import React, { useState, useEffect, useRef } from 'react';
import { useGame } from '../context/GameContext';
import { ISLAND_GROUPS } from '../data/regionsData';
import { 
  WORLD_SECTORS, 
  WORLD_REGIONS, 
  getWorldCountryData, 
  getWorldRegionById 
} from '../data/worldRegionsData';
import { INDONESIA_SILHOUETTES_GEOJSON } from '../data/indonesiaSilhouettesGeoJSON';
import { sounds } from '../utils/soundEffects';
import { 
  Compass, 
  Layers, 
  Users, 
  Smile, 
  Building2, 
  RotateCcw,
  Sparkles, 
  ChevronRight, 
  Eye, 
  EyeOff, 
  Globe, 
  Satellite, 
  Map as MapIcon, 
  Search, 
  MapPin, 
  Crosshair, 
  Shield, 
  Waves
} from 'lucide-react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import RegionDrawer from './RegionDrawer';
import WorldRegionDrawer from './WorldRegionDrawer';

// Batas Geografis Resmi Negara Kesatuan Republik Indonesia (Sabang sampai Merauke)
const INDONESIA_BOUNDS = [
  [-11.2, 94.8],
  [6.2, 141.1],
];

// Batas Standar Peta Geografis Dunia (Web Mercator Projection EPSG:3857)
const WORLD_STABLE_BOUNDS = [
  [-85.05112878, -180.0], // Ujung Selatan Dunia
  [85.05112878, 180.0],   // Ujung Utara Dunia
];

// Pemetaan Nama Provinsi Resmi GeoJSON ke Region Game (38 Provinsi Indonesia)
const STATE_TO_REGION_ID = {
  'Aceh': 'aceh',
  'Sumatera Utara': 'sumut',
  'Sumatera Barat': 'sumbar',
  'Riau': 'riau',
  'Kepulauan Riau': 'kepri',
  'Jambi': 'jambi',
  'Sumatera Selatan': 'sumsel',
  'Bengkulu': 'bengkulu',
  'Lampung': 'lampung',
  'Bangka-Belitung': 'babel',
  'Jakarta Raya': 'dki',
  'Banten': 'banten',
  'Jawa Barat': 'jabar',
  'Jawa Tengah': 'jateng',
  'Yogyakarta': 'diy',
  'Jawa Timur': 'jatim',
  'Bali': 'bali',
  'Nusa Tenggara Barat': 'ntb',
  'Nusa Tenggara Timur': 'ntt',
  'Kalimantan Barat': 'kalbar',
  'Kalimantan Tengah': 'kalteng',
  'Kalimantan Selatan': 'kalsel',
  'Kalimantan Timur': 'kaltim',
  'Kalimantan Utara': 'kaltara',
  'Sulawesi Utara': 'sulut',
  'Gorontalo': 'gorontalo',
  'Sulawesi Tengah': 'sulteng',
  'Sulawesi Barat': 'sulbar',
  'Sulawesi Selatan': 'sulsel',
  'Sulawesi Tenggara': 'sultra',
  'Maluku': 'maluku',
  'Maluku Utara': 'malut',
  'Papua Barat': 'papua_barat_induk',
  'Papua': 'papua',
};

export default function IndonesiaMap() {
  const { 
    regions, 
    parties, 
    selectedRegionId, 
    setSelectedRegionId,
    player,
  } = useGame();

  const mapContainerRef = useRef(null);
  const mapInstanceRef = useRef(null);
  const silhouettesLayerRef = useRef(null);
  const worldLayerRef = useRef(null);
  const tileLayerRef = useRef(null);

  const [mapReady, setMapReady] = useState(false);
  // Default to Rival Regions Geopolitik World Map
  const [mapStyle, setMapStyle] = useState('rr_tactical'); // 'rr_tactical', 'dark_tactical', 'satellite', 'osm_hot'
  const [mapMode, setMapMode] = useState('wilayah'); // 'wilayah', 'party', 'satisfaction', 'resource'
  const [selectedSector, setSelectedSector] = useState('indonesia');
  const [selectedIslandFilter, setSelectedIslandFilter] = useState('all');
  const [selectedWorldRegionId, setSelectedWorldRegionId] = useState(null);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false); // Drawer panel tertutup secara default sampai diklik
  const [mobileTab, setMobileTab] = useState('map'); // 'map' or 'drawer'
  const [showLabels, setShowLabels] = useState(true);
  const [showSilhouettes, setShowSilhouettes] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [coastlineData, setCoastlineData] = useState(null);
  const [worldCountriesData, setWorldCountriesData] = useState(null);

  // Region tempat player spawn atau saat ini berada (residence/current region)
  const playerRegionId = player?.currentRegionId || player?.residenceRegionId || 'dki';
  const playerRegion = regions.find((r) => r.id === playerRegionId) || regions.find((r) => r.id === 'dki') || regions[0];
  const spawnLat = playerRegion?.lat || -6.2088;
  const spawnLng = playerRegion?.lng || 106.8456;

  const selectedRegion = regions.find((r) => r.id === selectedRegionId) || playerRegion;
  const selectedWorldRegion = selectedWorldRegionId 
    ? getWorldRegionById(selectedWorldRegionId, worldCountriesData) 
    : null;

  // Helper color getter based on mode
  const getRegionColor = (region) => {
    if (mapMode === 'wilayah') {
      const island = ISLAND_GROUPS.find((i) => i.id === region.island);
      return island ? island.color : '#06b6d4';
    }
    if (mapMode === 'party') {
      const party = parties.find((p) => p.id === region.dominantPartyId);
      return party ? party.color : '#64748b';
    }
    if (mapMode === 'satisfaction') {
      if (region.supportRate >= 80) return '#10b981';
      if (region.supportRate >= 70) return '#3b82f6';
      if (region.supportRate >= 60) return '#f59e0b';
      return '#ef4444';
    }
    // Resource mode
    if (region.resource.includes('Minyak') || region.resource.includes('Gas')) return '#f59e0b';
    if (region.resource.includes('Nikel') || region.resource.includes('Baja')) return '#06b6d4';
    if (region.resource.includes('Emas') || region.resource.includes('Tembaga')) return '#eab308';
    if (region.resource.includes('Pangan') || region.resource.includes('Pertanian')) return '#10b981';
    return '#a855f7';
  };

  // Tile Providers: 100% Bebas API Key & Tanpa Watermark & Tanpa Garis Kotak-Kotak
  const TILE_PROVIDERS = {
    rr_tactical: {
      name: 'Rival Regions Geopolitik',
      url: 'https://server.arcgisonline.com/ArcGIS/rest/services/World_Street_Map/MapServer/tile/{z}/{y}/{x}',
      attribution: '&copy; Esri &mdash; Rival Regions Geopolitics',
      maxZoom: 18,
    },
    dark_tactical: {
      name: 'Cyber Dark Taktis',
      url: 'https://server.arcgisonline.com/ArcGIS/rest/services/Canvas/World_Dark_Gray_Base/MapServer/tile/{z}/{y}/{x}',
      attribution: '&copy; Esri &mdash; Dark Tactical',
      maxZoom: 16,
    },
    satellite: {
      name: 'Recon Satelit Global',
      url: 'https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}',
      attribution: '&copy; Esri World Recon',
      maxZoom: 18,
    },
    osm_hot: {
      name: 'Teritorial Terbuka',
      url: 'https://{s}.tile.openstreetmap.fr/hot/{z}/{x}/{y}.png',
      attribution: '&copy; OpenStreetMap contributors',
      maxZoom: 18,
    },
  };

  // Initialize Leaflet World Map (Terkunci Stabil, Tidak Bergeser-Geser & Langsung Tertuju ke Region Spawn)
  useEffect(() => {
    if (!mapContainerRef.current) return;

    if (mapContainerRef.current._leaflet_id) {
      delete mapContainerRef.current._leaflet_id;
    }

    let t1 = null;
    let t2 = null;

    if (!mapInstanceRef.current) {
      try {
        const map = L.map(mapContainerRef.current, {
          center: [spawnLat, spawnLng], // Langsung tertuju pada region tempat player spawn / berada sekarang
          zoom: 7, // Zoom dekat taktis fokus wilayah player
          minZoom: 2, // Minimal zoom untuk melihat peta dunia penuh
          maxZoom: 18,
          maxBounds: [
            [-85.05112878, -360.0], // Batas lintang selatan ke batas bujur luas
            [85.05112878, 360.0],   // Batas lintang utara ke batas bujur luas
          ],
          maxBoundsViscosity: 0.2, // Sangat lentur dan responsif, tidak membatasi/menyetop geseran tangan pemain
          worldCopyJump: true, // Memungkinkan geser horizontal ke seluruh penjuru dunia (seamless global wrapping)
          bounceAtZoomLimits: true,
          zoomSnap: 0.25,
          zoomDelta: 0.5,
          wheelPxPerZoomLevel: 80,
          preferCanvas: true,
          zoomControl: false,
          attributionControl: false,
          dragging: true, // Peta bebas digeser dengan mouse click-and-drag atau touch swipe
          touchZoom: true,
          doubleClickZoom: true,
          scrollWheelZoom: true,
          boxZoom: true,
          keyboard: true,
          inertia: true, // Efek inersia/kinetic momentum saat peta digeser dan dilepaskan
          inertiaDeceleration: 3000,
          inertiaMaxSpeed: 2000,
          easeLinearity: 0.2,
          tap: true,
        });

        // Set initial view centered directly on player's spawn region
        map.setView([spawnLat, spawnLng], 7);

        // Add Zoom Control at bottom right
        L.control.zoom({ position: 'bottomright' }).addTo(map);

        // Base Tile Layer (Rival Regions World Map)
        const provider = TILE_PROVIDERS[mapStyle] || TILE_PROVIDERS.rr_tactical;
        const baseTile = L.tileLayer(provider.url, {
          maxZoom: provider.maxZoom || 18,
          subdomains: ['a', 'b', 'c'],
          noWrap: false, // Menampilkan peta dunia secara utuh dan berkelanjutan saat digeser ke barat atau timur
        }).addTo(map);
        tileLayerRef.current = baseTile;

        // Layer 1: Wilayah Geopolitik Internasional / Negara Lain Sesuai Peta Nyata
        const worldLayer = L.layerGroup().addTo(map);
        worldLayerRef.current = worldLayer;

        // Layer 2: Garis Bibir Pantai Nyata & Batas Wilayah Administrasi 38 Provinsi Indonesia (on top)
        const silhouettesLayer = L.layerGroup().addTo(map);
        silhouettesLayerRef.current = silhouettesLayer;

        mapInstanceRef.current = map;
        setMapReady(true);

        // Safely guarded invalidates to guarantee tiles and vectors render immediately
        t1 = setTimeout(() => {
          if (mapInstanceRef.current && mapInstanceRef.current._mapPane) {
            try {
              mapInstanceRef.current.invalidateSize();
            } catch {
              // ignore
            }
          }
        }, 150);

        t2 = setTimeout(() => {
          if (mapInstanceRef.current && mapInstanceRef.current._mapPane) {
            try {
              mapInstanceRef.current.invalidateSize();
            } catch {
              // ignore
            }
          }
        }, 500);
      } catch (err) {
        console.warn('Leaflet map initialization notice:', err);
      }
    }

    const handleResize = () => {
      if (mapInstanceRef.current && mapInstanceRef.current._mapPane) {
        try {
          mapInstanceRef.current.invalidateSize();
        } catch {
          // ignore
        }
      }
    };
    window.addEventListener('resize', handleResize);

    return () => {
      if (t1) clearTimeout(t1);
      if (t2) clearTimeout(t2);
      window.removeEventListener('resize', handleResize);
      setMapReady(false);
      if (mapInstanceRef.current) {
        try {
          mapInstanceRef.current.remove();
        } catch {
          // ignore
        }
        mapInstanceRef.current = null;
      }
      silhouettesLayerRef.current = null;
      worldLayerRef.current = null;
      if (tileLayerRef.current) {
        try { mapInstanceRef.current?.removeLayer(tileLayerRef.current); } catch {}
        tileLayerRef.current = null;
      }
      if (mapContainerRef.current) {
        delete mapContainerRef.current._leaflet_id;
      }
    };
  }, []);

  // Update Tile Style
  useEffect(() => {
    if (!mapInstanceRef.current || !mapInstanceRef.current._mapPane) return;
    try {
      const map = mapInstanceRef.current;
      const provider = TILE_PROVIDERS[mapStyle] || TILE_PROVIDERS.rr_tactical;

      if (tileLayerRef.current) {
        map.removeLayer(tileLayerRef.current);
        tileLayerRef.current = null;
      }

      const newBase = L.tileLayer(provider.url, {
        maxZoom: provider.maxZoom || 18,
        subdomains: ['a', 'b', 'c'],
        noWrap: false,
      }).addTo(map);
      tileLayerRef.current = newBase;
    } catch (err) {
      console.warn('Leaflet layer switch notice:', err);
    }
  }, [mapStyle]);

  // Fetch Official Indonesian Coastline GeoJSON (Bibir Pantai Nyata & Batas 38 Provinsi)
  useEffect(() => {
    fetch('/indonesia-coastline.geojson')
      .then((res) => {
        if (!res.ok) throw new Error('Failed to load coastline geojson');
        return res.json();
      })
      .then((data) => {
        setCoastlineData(data);
      })
      .catch((err) => {
        console.warn('Coastline GeoJSON load notice:', err);
      });
  }, []);

  // Fetch Real-World World Countries GeoJSON (Batas Wilayah & Bibir Pantai Nyata Seluruh Negara Dunia)
  useEffect(() => {
    fetch('/world-countries.geojson')
      .then((res) => {
        if (!res.ok) throw new Error('Failed to load world countries');
        return res.json();
      })
      .then((data) => {
        setWorldCountriesData(data);
      })
      .catch((err) => {
        console.warn('World countries load error:', err);
      });
  }, []);

  // Render Indonesian Coastline & Territorial Polygons Layer (Presisi Bibir Pantai & Batas 38 Provinsi)
  useEffect(() => {
    if (!mapReady || !mapInstanceRef.current || !silhouettesLayerRef.current) return;
    const silhouettesLayer = silhouettesLayerRef.current;
    silhouettesLayer.clearLayers();

    if (!showSilhouettes) return;

    const activeGeoData = coastlineData || INDONESIA_SILHOUETTES_GEOJSON;

    try {
      const geoLayer = L.geoJSON(activeGeoData, {
        style: (feature) => {
          const stateName = feature.properties.state || feature.properties.name || '';
          const regId = STATE_TO_REGION_ID[stateName];
          const region = regions.find((r) => r.id === regId || r.name.toLowerCase().includes(stateName.toLowerCase()));
          const isSelected = region && region.id === selectedRegionId && !selectedWorldRegionId;
          const isSpawn = region && region.id === playerRegion.id;
          const isIslandMatch = selectedIslandFilter === 'all' || (region && region.island === selectedIslandFilter) || (feature.properties.island === selectedIslandFilter);

          let baseColor = '#06b6d4';
          if (region) {
            baseColor = getRegionColor(region);
          } else if (feature.properties.color) {
            baseColor = feature.properties.color;
          }

          if (!isIslandMatch) {
            return {
              color: '#1e293b',
              weight: 0.8,
              opacity: 0.35,
              fillColor: '#070b14',
              fillOpacity: 0.12,
              className: 'indonesia-coastline-path inactive',
            };
          }

          return {
            color: isSelected ? '#fbbf24' : (isSpawn ? '#34d399' : baseColor),
            weight: isSelected ? 3.5 : (isSpawn ? 2.8 : 2.0), // Presisi tajam garis pantai & batas wilayah 38 provinsi
            opacity: 1.0,
            fillColor: isSelected ? '#fbbf24' : (isSpawn ? '#10b981' : baseColor),
            fillOpacity: isSelected ? 0.72 : (isSpawn ? 0.60 : 0.48), // Desain taktis non-realistis
            lineJoin: 'round',
            lineCap: 'round',
            className: `indonesia-coastline-path ${isSpawn ? 'player-spawn-region' : ''}`,
          };
        },
        onEachFeature: (feature, layer) => {
          const stateName = feature.properties.state || feature.properties.name || '';
          const regId = STATE_TO_REGION_ID[stateName];
          const region = regions.find((r) => r.id === regId || r.name.toLowerCase().includes(stateName.toLowerCase()));
          const party = region ? parties.find((p) => p.id === region.dominantPartyId) : null;
          const islandGroup = region ? ISLAND_GROUPS.find((i) => i.id === region.island) : null;
          const isSpawn = region && region.id === playerRegion.id;

          layer.on({
            mouseover: (e) => {
              const l = e.target;
              l.setStyle({
                weight: 3.8,
                color: '#fbbf24',
                fillOpacity: 0.76,
              });
              if (!L.Browser.ie && !L.Browser.opera && !L.Browser.edge) {
                l.bringToFront();
              }
            },
            mouseout: (e) => {
              geoLayer.resetStyle(e.target);
            },
            click: () => {
              setSelectedWorldRegionId(null);
              if (region) {
                setSelectedRegionId(region.id);
                setIsDrawerOpen(true);
                setMobileTab('drawer');
                sounds.playClick();
              } else if (feature.properties.island) {
                focusOnIsland(feature.properties.island);
              }
            }
          });

          // Tactical Geopolitical Tooltip showing Province Details
          layer.bindTooltip(`
            <div class="coastline-tooltip-card tactical-card">
              <div class="cl-top">
                <span class="cl-flag">🇮🇩</span>
                <strong class="cl-title">${region ? region.name : stateName}</strong>
                ${isSpawn ? '<span class="cl-spawn-tag">📍 LOKASI ANDA</span>' : ''}
                ${islandGroup ? `<span class="cl-island-badge" style="background: ${islandGroup.color}25; color: ${islandGroup.color}; border: 1px solid ${islandGroup.color}66">${islandGroup.name}</span>` : ''}
              </div>
              <p class="cl-sub">Ibu Kota: <strong>${region ? region.capital : 'Nusantara'}</strong></p>
              ${region ? `
                <div class="cl-stats">
                  <div class="cl-stat"><span>Partai Mayoritas:</span> <strong style="color: ${party?.color || '#fbbf24'}">${party?.name || 'Independen'} (${party?.shortName || 'INDEP'})</strong></div>
                  <div class="cl-stat"><span>Kepuasan Publik:</span> <strong style="color: #10b981">${region.supportRate}%</strong></div>
                  <div class="cl-stat"><span>Komoditas Unggulan:</span> <strong>${region.resource}</strong></div>
                  <div class="cl-stat"><span>Kas Wilayah:</span> <strong style="color: #fbbf24">Rp ${(region.budget / 1e9).toFixed(1)} Miliar</strong></div>
                </div>
              ` : `
                <div class="cl-stats">
                  <div class="cl-stat"><span>Kawasan:</span> <strong>${feature.properties.name || stateName}</strong></div>
                </div>
              `}
              <div class="cl-hint">⚡ Ketuk Wilayah untuk Membuka Detail & Rincian Provinsi</div>
            </div>
          `, {
            sticky: true,
            className: 'geopolitical-coastline-tooltip tactical-tooltip',
            direction: 'top',
            offset: [0, -10]
          });
        }
      });

      silhouettesLayer.addLayer(geoLayer);
    } catch (err) {
      console.warn('Coastline layer rendering error:', err);
    }
  }, [mapReady, coastlineData, showSilhouettes, selectedIslandFilter, selectedRegionId, selectedWorldRegionId, mapMode, regions, parties, playerRegion.id]);

  // Render Real-World Country Polygons Layer (Negara-Negara Lain Sesuai Peta Nyata ala Rival Regions)
  useEffect(() => {
    if (!mapReady || !mapInstanceRef.current || !worldLayerRef.current) return;
    const worldLayer = worldLayerRef.current;
    worldLayer.clearLayers();

    if (!worldCountriesData) {
      return;
    }

    try {
      const worldGeoLayer = L.geoJSON(worldCountriesData, {
        filter: (feature) => {
          // Lewatkan Indonesia karena sudah di-render secara detail 38 provinsi di layer silhouettesLayer
          const name = feature.properties.name || feature.properties.admin || '';
          const iso = feature.properties.iso_a3 || '';
          return name !== 'Indonesia' && iso !== 'IDN' && name !== 'Antarctica';
        },
        style: (feature) => {
          const country = getWorldCountryData(feature);
          const isSelected = selectedWorldRegionId === country.id;
          const sector = WORLD_SECTORS.find((s) => s.id === country.sector);
          const sectorColor = sector ? sector.color : '#38bdf8';

          return {
            color: isSelected ? '#fbbf24' : sectorColor,
            weight: isSelected ? 2.8 : 1.2, // Garis batas negara nyata sesuai peta nyata dunia
            opacity: isSelected ? 1.0 : 0.75,
            fillColor: isSelected ? '#fbbf24' : sectorColor,
            fillOpacity: isSelected ? 0.45 : 0.16, // Desain taktis non-realistis tapi presisi batas negara
            lineJoin: 'round',
            lineCap: 'round',
            className: 'world-country-polygon',
          };
        },
        onEachFeature: (feature, layer) => {
          const country = getWorldCountryData(feature);

          layer.on({
            mouseover: (e) => {
              const l = e.target;
              l.setStyle({
                weight: 2.8,
                color: '#fbbf24',
                fillOpacity: 0.55,
              });
              if (!L.Browser.ie && !L.Browser.opera && !L.Browser.edge) {
                l.bringToFront();
              }
            },
            mouseout: (e) => {
              worldGeoLayer.resetStyle(e.target);
            },
            click: () => {
              sounds.playClick();
              setSelectedRegionId(null);
              setSelectedWorldRegionId(country.id);
              setSelectedSector(country.sector);
              setIsDrawerOpen(true);
              setMobileTab('drawer');

              // Fly to exact real country bounds
              if (mapInstanceRef.current && mapInstanceRef.current._mapPane) {
                try {
                  const bounds = layer.getBounds();
                  mapInstanceRef.current.flyToBounds(bounds, {
                    padding: [40, 40],
                    maxZoom: 6,
                    duration: 1.2,
                  });
                } catch {
                  // ignore
                }
              }
            },
          });

          // Rich Rival Regions World Intelligence Tooltip
          layer.bindTooltip(`
            <div class="coastline-tooltip-card tactical-card world-tactical-tooltip">
              <div class="cl-top">
                <span class="cl-flag">${country.flag}</span>
                <strong class="cl-title">${country.name}</strong>
                <span class="cl-island-badge" style="background: rgba(56, 189, 248, 0.2); color: #38bdf8; border: 1px solid rgba(56, 189, 248, 0.4)">${country.sector.toUpperCase()}</span>
              </div>
              <p class="cl-sub">Ibu Kota: <strong>${country.capital}</strong> • Blok: <strong>${country.bloc}</strong></p>
              <div class="cl-stats">
                <div class="cl-stat"><span>Status Diplomasi RI:</span> <strong style="color: #10b981">${country.diplomaticStatus}</strong></div>
                <div class="cl-stat"><span>Kekuatan Militer:</span> <strong style="color: #fbbf24">${country.militaryPower}/100</strong></div>
                <div class="cl-stat"><span>Estimasi Populasi:</span> <strong>${country.population} Juta Jiwa</strong></div>
                <div class="cl-stat"><span>Komoditas / Industri:</span> <strong>${country.dominantResource}</strong></div>
              </div>
              <div class="cl-hint">⚡ Ketuk Negara untuk Buka Diplomasi Internasional (Rival Regions Hub)</div>
            </div>
          `, {
            sticky: true,
            className: 'geopolitical-coastline-tooltip tactical-tooltip',
            direction: 'top',
            offset: [0, -10],
          });
        },
      });

      worldLayer.addLayer(worldGeoLayer);
    } catch (err) {
      console.warn('World countries layer rendering error:', err);
    }
  }, [mapReady, worldCountriesData, selectedWorldRegionId]);

  // Kembali dan pusatkan pandangan langsung ke wilayah spawn/domisili pemain
  const focusOnMySpawnRegion = () => {
    sounds.playClick();
    setSelectedWorldRegionId(null);
    setSelectedRegionId(playerRegion.id);
    if (playerRegion.island) {
      setSelectedIslandFilter(playerRegion.island);
    }
    if (mapInstanceRef.current && mapInstanceRef.current._mapPane) {
      mapInstanceRef.current.flyTo([spawnLat, spawnLng], 7.5, { duration: 1.0 });
    }
  };

  // Cinematic Sector Camera Jump (Dunia, Indonesia, ASEAN, Asia, Eropa, Amerika, dll)
  const focusOnSector = (sectorId) => {
    sounds.playClick();
    setSelectedSector(sectorId);
    if (!mapInstanceRef.current || !mapInstanceRef.current._mapPane) return;

    if (sectorId === 'all') {
      mapInstanceRef.current.flyTo([20.0, 10.0], 2.5, {
        duration: 1.4,
      });
      return;
    }

    const sector = WORLD_SECTORS.find((s) => s.id === sectorId);
    if (sector) {
      mapInstanceRef.current.flyTo(sector.center, sector.zoom, { duration: 1.4 });
    }
  };

  // Cinematic Island Camera Focus for Indonesia
  const focusOnIsland = (islandId) => {
    sounds.playClick();
    setSelectedIslandFilter(islandId);
    if (!mapInstanceRef.current || !mapInstanceRef.current._mapPane) return;

    if (islandId === 'all') {
      mapInstanceRef.current.flyToBounds(INDONESIA_BOUNDS, { 
        duration: 1.2,
        padding: [15, 15] 
      });
    } else {
      const island = ISLAND_GROUPS.find((i) => i.id === islandId);
      if (island) {
        mapInstanceRef.current.flyTo(island.center, island.zoom, { duration: 1.2 });
      }
    }
  };

  // Re-calculate size when mobile view toggles or drawer opens/closes
  useEffect(() => {
    let t = null;
    if (mapInstanceRef.current && mapInstanceRef.current._mapPane) {
      t = setTimeout(() => {
        if (mapInstanceRef.current && mapInstanceRef.current._mapPane) {
          try {
            mapInstanceRef.current.invalidateSize({ animate: false });
          } catch {
            // ignore
          }
        }
      }, 150);
    }
    return () => {
      if (t) clearTimeout(t);
    };
  }, [mobileTab, isDrawerOpen]);

  // FlyTo Specific Region or Country from Quick Search
  const handleSelectItem = (item) => {
    sounds.playClick();
    setSearchQuery(item.name);

    setIsDrawerOpen(true);
    setMobileTab('drawer');

    if (item.isWorld) {
      setSelectedRegionId(null);
      setSelectedWorldRegionId(item.id);
      setSelectedSector(item.sector || 'all');
      if (mapInstanceRef.current && mapInstanceRef.current._mapPane) {
        if (item.lat && item.lng && (item.lat !== 0 || item.lng !== 0)) {
          mapInstanceRef.current.flyTo([item.lat, item.lng], 5.5, { duration: 1.2 });
        } else {
          const feat = worldCountriesData?.features?.find(
            (f) => (f.properties.iso_a3 || f.properties.name || '').toLowerCase() === item.id.toLowerCase()
          );
          if (feat) {
            try {
              const bounds = L.geoJSON(feat).getBounds();
              mapInstanceRef.current.flyToBounds(bounds, { padding: [40, 40], maxZoom: 6, duration: 1.2 });
            } catch {
              // fallback
            }
          }
        }
      }
    } else {
      setSelectedWorldRegionId(null);
      setSelectedRegionId(item.id);
      if (mapInstanceRef.current && mapInstanceRef.current._mapPane && item.lat && item.lng) {
        mapInstanceRef.current.flyTo([item.lat, item.lng], 7, { duration: 1.2 });
      }
    }
  };

  // Aggregated Numbers
  const totalPop = regions.reduce((acc, r) => acc + r.population, 0);
  const avgSupport = Math.round(regions.reduce((acc, r) => acc + r.supportRate, 0) / regions.length);
  const totalLocalBudget = regions.reduce((acc, r) => acc + r.budget, 0);

  // Search results across both 38 Indonesian Provinces AND All World Countries
  const searchWorldList = worldCountriesData && worldCountriesData.features
    ? worldCountriesData.features
        .filter((f) => f.properties.name !== 'Indonesia' && f.properties.name !== 'Antarctica')
        .map((f) => getWorldCountryData(f))
    : WORLD_REGIONS;

  const searchedItems = searchQuery.trim() === ''
    ? []
    : [
        ...regions.map((r) => ({ ...r, isWorld: false, typeLabel: 'Provinsi NKRI' })),
        ...searchWorldList.map((w) => ({ ...w, isWorld: true, typeLabel: 'Negara Dunia' }))
      ].filter((item) => {
        const q = searchQuery.toLowerCase();
        return (
          item.name.toLowerCase().includes(q) ||
          (item.capital && item.capital.toLowerCase().includes(q)) ||
          (item.bloc && item.bloc.toLowerCase().includes(q)) ||
          (item.sector && item.sector.toLowerCase().includes(q)) ||
          (item.island && item.island.toLowerCase().includes(q))
        );
      }).slice(0, 10);

  return (
    <div className="map-view-layout">
      {/* Mobile Top View Switcher */}
      <div className="mobile-map-toggle-bar">
        <button
          className={`mobile-view-toggle-btn ${mobileTab === 'map' ? 'active' : ''}`}
          onClick={() => { setMobileTab('map'); sounds.playClick(); }}
        >
          <Compass size={16} /> Peta Geopolitik Dunia
        </button>
        <button
          className={`mobile-view-toggle-btn ${mobileTab === 'drawer' ? 'active' : ''}`}
          onClick={() => { setMobileTab('drawer'); sounds.playClick(); }}
        >
          <Building2 size={16} /> {selectedWorldRegion ? selectedWorldRegion.name : selectedRegion.name}
        </button>
      </div>

      {/* Top Map Toolbar & Aggregates */}
      <div className="map-header-bar glass-panel">
        <div className="map-stats-summary">
          {/* Tombol Pintas Wilayah Pemain / Domisili Spawn */}
          <div 
            className="summary-item highlight-spawn-location"
            onClick={focusOnMySpawnRegion}
            title="Klik untuk langsung pusatkan kamera ke wilayah spawn/domisili Anda"
            style={{ cursor: 'pointer' }}
          >
            <span className="summary-label"><MapPin size={14} className="font-emerald pulse-icon" /> Wilayah Anda (Spawn)</span>
            <span className="summary-val font-emerald">{playerRegion.name}</span>
          </div>

          <div className="summary-item">
            <span className="summary-label"><Users size={14} /> Total Penduduk NKRI</span>
            <span className="summary-val">{(totalPop / 1e6).toFixed(1)} Juta</span>
          </div>
          <div className="summary-item">
            <span className="summary-label"><Smile size={14} /> Rata-Rata Kepuasan</span>
            <span className="summary-val font-emerald">{avgSupport}%</span>
          </div>
          <div className="summary-item highlight-city-count">
            <span className="summary-label"><Globe size={14} /> Skala Geopolitik</span>
            <span className="summary-val font-cyan">Rival Regions Global Earth</span>
          </div>
        </div>

        {/* View Mode & Layer Controls */}
        <div className="map-mode-selector">
          {/* Map Layer Style: Rival Regions Geopolitik vs Dark Taktis vs Satelit HD vs Teritorial */}
          <div className="map-layer-selector">
            <button
              className={`mode-btn ${mapStyle === 'rr_tactical' ? 'active' : ''}`}
              onClick={() => { setMapStyle('rr_tactical'); sounds.playClick(); }}
              title="Tampilan Peta Geopolitik Dunia ala Rival Regions (Bebas Garis Kotak & Watermark)"
            >
              <Globe size={14} /> Rival Regions
            </button>
            <button
              className={`mode-btn ${mapStyle === 'dark_tactical' ? 'active' : ''}`}
              onClick={() => { setMapStyle('dark_tactical'); sounds.playClick(); }}
              title="Tampilan Cyber Dark Taktis Geopolitik"
            >
              <MapIcon size={14} /> Dark Taktis
            </button>
            <button
              className={`mode-btn ${mapStyle === 'satellite' ? 'active' : ''}`}
              onClick={() => { setMapStyle('satellite'); sounds.playClick(); }}
              title="Tampilan Citra Satelit Global HD"
            >
              <Satellite size={14} /> Satelit HD
            </button>
            <button
              className={`mode-btn ${mapStyle === 'osm_hot' ? 'active' : ''}`}
              onClick={() => { setMapStyle('osm_hot'); sounds.playClick(); }}
              title="Tampilan Peta Teritorial Terbuka"
            >
              <Layers size={14} /> Teritorial
            </button>
          </div>

          {/* Layer toggles: 38 Provinsi */}
          <div className="map-marker-toggles">
            <button
              className={`mode-btn silhouette-toggle-btn ${showSilhouettes ? 'active' : ''}`}
              onClick={() => { setShowSilhouettes(!showSilhouettes); sounds.playClick(); }}
              title="Aktifkan / Nonaktifkan Garis Bibir Pantai & Batas 38 Provinsi"
            >
              <Waves size={14} /> 38 Provinsi
            </button>
          </div>

          {/* Color Mode Switcher */}
          <button
            className={`mode-btn ${mapMode === 'wilayah' ? 'active' : ''}`}
            onClick={() => { setMapMode('wilayah'); sounds.playClick(); }}
            title="Tampilkan Pembagian 7 Wilayah Geopolitik Nusantara"
          >
            Wilayah (7)
          </button>
          <button
            className={`mode-btn ${mapMode === 'party' ? 'active' : ''}`}
            onClick={() => { setMapMode('party'); sounds.playClick(); }}
          >
            Partai
          </button>
          <button
            className={`mode-btn ${mapMode === 'satisfaction' ? 'active' : ''}`}
            onClick={() => { setMapMode('satisfaction'); sounds.playClick(); }}
          >
            Stabilitas
          </button>
          <button
            className={`mode-btn ${mapMode === 'resource' ? 'active' : ''}`}
            onClick={() => { setMapMode('resource'); sounds.playClick(); }}
          >
            Komoditas
          </button>
        </div>
      </div>

      {/* World Sectors Navigation Bar ala Rival Regions (Buka Semua Maps Dunia) */}
      <div className="world-sector-selector-bar glass-panel">
        {WORLD_SECTORS.map((sector) => (
          <button
            key={sector.id}
            className={`sector-chip-btn ${selectedSector === sector.id ? 'active' : ''}`}
            onClick={() => focusOnSector(sector.id)}
          >
            <span>{sector.icon}</span>
            <span>{sector.name}</span>
          </button>
        ))}
      </div>

      {/* Global Quick Search Bar: Searches both Indonesia Provinces AND All World Countries */}
      <div className="city-search-control-bar glass-panel">
        <div className="city-search-box">
          <Search size={16} className="city-search-icon" />
          <input
            type="text"
            className="city-search-input"
            placeholder="🔍 Cari Negara Dunia atau Provinsi RI (e.g. Malaysia, Singapura, Tiongkok, Amerika Serikat, Prancis, Jerman, Jawa Barat, Aceh, Papua)..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          {searchQuery && (
            <button 
              className="city-search-clear" 
              onClick={() => setSearchQuery('')}
            >
              ✕
            </button>
          )}
        </div>

        {/* Quick Dropdown Suggestions */}
        {searchedItems.length > 0 && (
          <div className="city-search-dropdown glass-panel">
            {searchedItems.map((item) => (
              <div
                key={item.id}
                className="city-search-item"
                onClick={() => handleSelectItem(item)}
              >
                <div className="cs-left">
                  <span className="cs-flag-icon">{item.flag || '🇮🇩'}</span>
                  <div>
                    <strong className="cs-name">{item.name}</strong>
                    <span className="cs-specialty"> • Ibu Kota: {item.capital}</span>
                  </div>
                </div>
                <div 
                  className="cs-badge" 
                  style={{ 
                    color: item.isWorld ? '#38bdf8' : '#fbbf24', 
                    borderColor: item.isWorld ? '#38bdf8' : '#fbbf24' 
                  }}
                >
                  {item.typeLabel}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Main Map Canvas Layout */}
      <div className={`map-canvas-container glass-panel ${isDrawerOpen ? 'has-drawer' : ''} ${mobileTab === 'drawer' ? 'show-drawer-mobile' : 'show-map-mobile'}`}>
        <div className="map-leaflet-wrapper">
          {/* Leaflet Real Geographic Map Element */}
          <div 
            ref={mapContainerRef} 
            className="leaflet-real-map" 
          />

          {/* Island Filter Tabs Bar: Pembagian Sesuai 7 Wilayah Resmi Indonesia */}
          <div className="island-filters-bar">
            {/* Tombol Pintas: Lokasi Saya / Tempat Spawn */}
            <button
              className="island-btn my-spawn-pill-btn"
              onClick={focusOnMySpawnRegion}
              title={`Kembali ke wilayah spawn/domisili Anda: ${playerRegion.name}`}
            >
              <MapPin size={14} className="font-emerald pulse-icon" />
              <span>Wilayah Anda: <strong>{playerRegion.name}</strong></span>
            </button>

            <button
              className={`island-btn ${selectedIslandFilter === 'all' ? 'active' : ''}`}
              onClick={() => focusOnIsland('all')}
            >
              🇮🇩 Seluruh Indonesia ({regions.length} Prov)
            </button>
            {ISLAND_GROUPS.map((isl) => {
              const provsInIsland = regions.filter((r) => r.island === isl.id);
              return (
                <button
                  key={isl.id}
                  className={`island-btn ${selectedIslandFilter === isl.id ? 'active' : ''}`}
                  onClick={() => focusOnIsland(isl.id)}
                  style={{
                    borderColor: selectedIslandFilter === isl.id ? isl.color : 'transparent',
                    color: selectedIslandFilter === isl.id ? isl.color : undefined
                  }}
                >
                  <span className="island-dot" style={{ backgroundColor: isl.color }} />
                  {isl.name} ({provsInIsland.length} Prov)
                </button>
              );
            })}
          </div>

          {/* Quick Province Navigation Pills */}
          <div className="wilayah-provinces-pills-bar">
            <div className="pills-scroll-container">
              {(selectedIslandFilter === 'all' ? regions : regions.filter((r) => r.island === selectedIslandFilter)).map((prov) => {
                const isSelected = prov.id === selectedRegionId && !selectedWorldRegionId;
                const isSpawn = prov.id === playerRegion.id;
                const isl = ISLAND_GROUPS.find((i) => i.id === prov.island);
                return (
                  <button
                    key={prov.id}
                    className={`prov-pill-btn ${isSelected ? 'selected' : ''} ${isSpawn ? 'my-spawn-pill' : ''}`}
                    onClick={() => {
                      setSelectedWorldRegionId(null);
                      setSelectedRegionId(prov.id);
                      setIsDrawerOpen(true);
                      setMobileTab('drawer');
                      sounds.playClick();
                      if (mapInstanceRef.current && mapInstanceRef.current._mapPane && prov.lat && prov.lng) {
                        mapInstanceRef.current.flyTo([prov.lat, prov.lng], 7.5, { duration: 1.0 });
                      }
                    }}
                    style={{
                      borderColor: isSelected ? (isl?.color || '#fbbf24') : (isSpawn ? '#10b981' : 'rgba(255,255,255,0.1)'),
                    }}
                  >
                    <span className="prov-pill-dot" style={{ backgroundColor: isSpawn ? '#34d399' : (isl?.color || '#38bdf8') }} />
                    <span className="prov-pill-name">{prov.name} {isSpawn ? '📍' : ''}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Mobile Bottom Quick Action Bar to Jump to Drawer */}
          <div className="mobile-region-quick-preview">
            <div className="quick-preview-info">
              <span className="qp-sub">{selectedWorldRegion ? 'Kawasan Dunia:' : 'Provinsi Terpilih:'}</span>
              <strong className="qp-name">
                {selectedWorldRegion ? `${selectedWorldRegion.flag} ${selectedWorldRegion.name}` : `${selectedRegion.name} (${selectedRegion.capital})`}
              </strong>
            </div>
            <button
              className="btn-gold qp-btn"
              onClick={() => { 
                setIsDrawerOpen(true); 
                setMobileTab('drawer'); 
                sounds.playClick(); 
              }}
            >
              <span>{selectedWorldRegion ? 'Diplomasi Dunia' : 'Kelola Wilayah'}</span>
              <ChevronRight size={16} />
            </button>
          </div>
        </div>

        {/* Selected Region Detailed Panel (Right Drawer on Desktop, Tabbed on Mobile) */}
        {isDrawerOpen && (
          <div className="region-drawer-container">
            {selectedWorldRegion ? (
              <WorldRegionDrawer 
                worldRegion={selectedWorldRegion} 
                onBackToIndonesia={() => {
                  setSelectedWorldRegionId(null);
                  setIsDrawerOpen(false);
                  setMobileTab('map');
                  setSelectedSector('indonesia');
                  focusOnSector('indonesia');
                }}
              />
            ) : (
              <RegionDrawer 
                region={selectedRegion} 
                onBackToMap={() => {
                  setIsDrawerOpen(false);
                  setMobileTab('map');
                }} 
              />
            )}
          </div>
        )}
      </div>
    </div>
  );
}
