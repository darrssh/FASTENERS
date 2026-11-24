import React from 'react';
import ReactDOM from 'react-dom/client';
import { App } from './App';
import { AuthProvider } from './hooks/useAuth';
import { CatalogProvider } from './hooks/useCatalog';
import { CartProvider } from './hooks/useCart';
import './styles/globals.css';

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <CatalogProvider>
      <AuthProvider>
        <CartProvider>
          <App />
        </CartProvider>
      </AuthProvider>
    </CatalogProvider>
  </React.StrictMode>,
);
