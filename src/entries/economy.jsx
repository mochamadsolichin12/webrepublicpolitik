import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import PageLayout from '../components/PageLayout';
import RealisticEconomyView from '../components/RealisticEconomyView';
import '../index.css';

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <PageLayout defaultTab="economy">
      <RealisticEconomyView />
    </PageLayout>
  </StrictMode>
);
