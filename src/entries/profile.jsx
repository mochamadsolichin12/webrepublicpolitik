import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import PageLayout from '../components/PageLayout';
import PlayerProfileView from '../components/PlayerProfileView';
import '../index.css';

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <PageLayout defaultTab="profile">
      <PlayerProfileView />
    </PageLayout>
  </StrictMode>
);
