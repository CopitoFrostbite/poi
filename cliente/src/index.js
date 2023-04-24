import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';

import Ruta from './routes'; // Importa el componente Routes

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
     <Ruta /> {/* Usa el componente Routes en lugar de App */}
  </React.StrictMode>
);

