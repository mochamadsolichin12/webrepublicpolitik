import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import PageLayout from '../components/PageLayout';
import ModeratorPanel from '../components/ModeratorPanel';
import '../index.css';

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <PageLayout defaultTab="moderator">
      <ModeratorPanel />
    </PageLayout>
  </StrictMode>
);
