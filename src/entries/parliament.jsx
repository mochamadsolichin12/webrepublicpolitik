import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import PageLayout from '../components/PageLayout';
import ParliamentView from '../components/ParliamentView';
import '../index.css';

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <PageLayout defaultTab="parliament">
      <ParliamentView />
    </PageLayout>
  </StrictMode>
);
