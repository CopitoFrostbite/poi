import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';

import Chat from './pages/chat/chat2';
import Login from './pages/login/login'; // Importa el componente de inicio de sesión
import Registro from './pages/register/registro';

function Ruta() {
  return (
    <Router>
      <Routes>
      <Route path="/" element={<Login />} />
        <Route path="/chat" element={<Chat />} />
        <Route path="/register" element={<Registro />} />
      </Routes>
    </Router>
  );
}

export default Ruta;
