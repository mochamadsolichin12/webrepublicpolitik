import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import PageLayout from '../components/PageLayout';
import ShopView from '../components/ShopView';
import '../index.css';

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <PageLayout defaultTab="shop">
      <ShopView />
    </PageLayout>
  </StrictMode>
);
