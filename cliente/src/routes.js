import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';

import Chat from './pages/chat/chat';
import Login from './pages/login/login'; // Importa el componente de inicio de sesión

function Ruta() {
  return (
    <Router>
      <Routes>
        <Route exact path="/chat" element={<Chat />} /> {/* Ruta para el inicio de sesión */}
        <Route exact path="/" element={<Login />} /> {/* Usa el componente Chat en la ruta raíz */}
      </Routes>
    </Router>
  );
}

export default Ruta;
