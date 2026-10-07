import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import PageLayout from '../components/PageLayout';
import SuperAdminPanel from '../components/SuperAdminPanel';
import '../index.css';

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <PageLayout defaultTab="admin">
      <SuperAdminPanel />
    </PageLayout>
  </StrictMode>
);
