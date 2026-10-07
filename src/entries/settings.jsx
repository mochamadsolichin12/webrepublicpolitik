import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import PageLayout from '../components/PageLayout';
import SettingsView from '../components/SettingsView';
import '../index.css';

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <PageLayout defaultTab="settings">
      <SettingsView />
    </PageLayout>
  </StrictMode>
);
