import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import PageLayout from '../components/PageLayout';
import CareerHQView from '../components/CareerHQView';
import '../index.css';

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <PageLayout defaultTab="career">
      <CareerHQView />
    </PageLayout>
  </StrictMode>
);
