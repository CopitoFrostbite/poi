import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import { BrowserRouter } from 'react-router-dom';
import io from 'socket.io-client';
import Ruta from './routes'; 
const socket = io('http://localhost:3001'); 
// Importa el componente Routes

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
     <Ruta /> {/* Usa el componente Routes en lugar de App */}
  </React.StrictMode>
);

