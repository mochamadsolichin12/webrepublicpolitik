import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import PageLayout from '../components/PageLayout';
import ElectionsView from '../components/ElectionsView';
import '../index.css';

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <PageLayout defaultTab="elections">
      <ElectionsView />
    </PageLayout>
  </StrictMode>
);
