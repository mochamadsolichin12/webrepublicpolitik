import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import PageLayout from '../components/PageLayout';
import LegislationView from '../components/LegislationView';
import '../index.css';

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <PageLayout defaultTab="legislation">
      <LegislationView />
    </PageLayout>
  </StrictMode>
);
