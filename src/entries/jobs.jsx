import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import PageLayout from '../components/PageLayout';
import JobsWorkView from '../components/JobsWorkView';
import '../index.css';

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <PageLayout defaultTab="jobs">
      <JobsWorkView />
    </PageLayout>
  </StrictMode>
);
