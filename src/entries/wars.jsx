import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import PageLayout from '../components/PageLayout';
import MilitaryWarsView from '../components/MilitaryWarsView';
import '../index.css';

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <PageLayout defaultTab="wars">
      <MilitaryWarsView />
    </PageLayout>
  </StrictMode>
);
