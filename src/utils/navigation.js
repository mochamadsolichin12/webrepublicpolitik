/**
 * Helper navigasi multi-halaman HTML
 * Memungkinkan setiap halaman berjalan sebagai file HTML terpisah yang sangat ringan
 */

export const TAB_HTML_MAP = {
  home: '/index.html',
  map: '/map.html',
  parliament: '/parliament.html',
  elections: '/elections.html',
  parties: '/parties.html',
  career: '/career.html',
  media: '/media.html',
  budget: '/budget.html',
  database: '/database.html',
  admin: '/admin.html',
  'admin-progress': '/admin.html#progress',
  moderator: '/moderator.html',
  profile: '/profile.html',
  wars: '/wars.html',
  legislation: '/legislation.html',
  economy: '/economy.html',
  jobs: '/jobs.html',
  settings: '/settings.html',
  shop: '/shop.html',
  'market-resources': '/shop.html#sumberdaya',
  'market-military': '/shop.html#senjata',
};

export const getPageUrl = (tabId) => {
  return TAB_HTML_MAP[tabId] || '/index.html';
};

export const getCurrentPageTab = () => {
  if (typeof window === 'undefined') return 'home';
  const path = window.location.pathname.toLowerCase();
  if (path.includes('shop')) return 'shop';
  if (path.includes('settings')) return 'settings';
  if (path.includes('jobs')) return 'jobs';
  if (path.includes('economy')) return 'economy';
  if (path.includes('legislation')) return 'legislation';
  if (path.includes('wars')) return 'wars';
  if (path.includes('profile')) return 'profile';
  if (path.includes('admin')) return 'admin';
  if (path.includes('moderator')) return 'moderator';
  if (path.includes('parliament')) return 'parliament';
  if (path.includes('elections')) return 'elections';
  if (path.includes('parties')) return 'parties';
  if (path.includes('career')) return 'career';
  if (path.includes('media')) return 'media';
  if (path.includes('budget')) return 'budget';
  if (path.includes('database')) return 'database';
  if (path.includes('map')) return 'map';
  if (path.includes('home') || path === '/' || path.endsWith('/index.html')) return 'home';
  return 'home';
};

export const navigateToPage = (tabId, setActiveTab) => {
  if (setActiveTab) {
    setActiveTab(tabId);
  }
  if (typeof window === 'undefined') return;

  const targetUrl = getPageUrl(tabId);
  const targetPathOnly = targetUrl.split('#')[0];
  const targetHash = targetUrl.includes('#') ? targetUrl.split('#')[1] : '';
  const currentPath = window.location.pathname;

  const isAlreadyOnPage = 
    (tabId === 'home' && (currentPath === '/' || currentPath.endsWith('/index.html'))) ||
    currentPath.endsWith(targetPathOnly);

  if (!isAlreadyOnPage) {
    window.location.href = targetUrl;
  } else if (targetHash) {
    window.location.hash = targetHash;
  }
};
