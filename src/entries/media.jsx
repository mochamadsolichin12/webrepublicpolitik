import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import PageLayout from '../components/PageLayout';
import NewspaperView from '../components/NewspaperView';
import '../index.css';

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <PageLayout defaultTab="media">
      <NewspaperView />
    </PageLayout>
  </StrictMode>
);
