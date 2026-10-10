import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import PageLayout from '../components/PageLayout';
import GrandMarketView from '../components/GrandMarketView';
import '../index.css';

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <PageLayout defaultTab="grand-market">
      <GrandMarketView />
    </PageLayout>
  </StrictMode>
);
