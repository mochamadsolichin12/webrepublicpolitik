import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import PageLayout from '../components/PageLayout';
import DatabaseStudioView from '../components/DatabaseStudioView';
import '../index.css';

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <PageLayout defaultTab="database">
      <DatabaseStudioView />
    </PageLayout>
  </StrictMode>
);
