import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import PageLayout from '../components/PageLayout';
import BudgetView from '../components/BudgetView';
import '../index.css';

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <PageLayout defaultTab="budget">
      <BudgetView />
    </PageLayout>
  </StrictMode>
);
