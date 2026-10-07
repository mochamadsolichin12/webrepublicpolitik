import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import PageLayout from '../components/PageLayout';
import PartiesView from '../components/PartiesView';
import '../index.css';

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <PageLayout defaultTab="parties">
      <PartiesView />
    </PageLayout>
  </StrictMode>
);
