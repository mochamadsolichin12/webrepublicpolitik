import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import PageLayout from '../components/PageLayout';
import IndonesiaMap from '../components/IndonesiaMap';
import '../index.css';

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <PageLayout defaultTab="map">
      <IndonesiaMap />
    </PageLayout>
  </StrictMode>
);
