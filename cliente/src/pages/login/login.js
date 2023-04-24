import React, { useState } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import './Centrado.css';
import { useNavigate } from 'react-router-dom';
import Cookies from 'universal-cookie';

function Login() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const navigate = useNavigate();
  const cookies = new Cookies();

  const handleUsernameChange = (event) => {
    setUsername(event.target.value);
  };

  const handlePasswordChange = (event) => {
    setPassword(event.target.value);
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    
    // Enviar una solicitud POST al servidor con los valores de nombre de usuario y contraseña
    fetch('http://localhost:3001/api/auth/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ username, password })
    })
      .then(response => response.json())
      .then(data => {
        console.log(data);
        // Verificar si el inicio de sesión fue exitoso
        if (data.data.token) {
          // Guardar el token en el localStorage para usarlo posteriormente
          
          cookies.set('token', data.data.token, { path: '/' });
          console.log(cookies.get('token'));

          // Redirigir al usuario a la página deseada
          navigate('/chat');
        } else {
          // Mostrar un mensaje de error en la página de inicio de sesión
          setErrorMessage('El nombre de usuariasdasdasdo o la contraseña son incorrectos.');
        }
      })
      .catch(error => {
        // Mostrar un mensaje de error en la página de inicio de sesión
        setErrorMessage('Hubo un error al iniciar sesión. Por favor, inténtelo de nuevo más tarde.');
      });
  };

  return (
    <div className="login-container bg-gradient-primary">
      <form id="loginForm" onSubmit={handleSubmit} className="text-light">
        <h1 className="text-center mb-4">Iniciar sesión</h1>
        <div className="form-group">
          <label htmlFor="inputName">Nombre de usuario:</label>
          <input type="text" className="form-control" id="inputName" value={username} onChange={handleUsernameChange} required />
        </div>
        <div className="form-group">
          <label htmlFor="inputPassword">Contraseña:</label>
          <input type="password" className="form-control" id="inputPassword" value={password} onChange={handlePasswordChange} required />
        </div>
        {errorMessage && <div className="alert alert-danger">{errorMessage}</div>}
        <button type="submit" className="btn btn-lg btn-block btn-outline-light mt-4">Iniciar sesión</button>
      </form>
      <p className="text-light mt-3">¿No tienes cuenta?</p>
    </div>
  );
}

export default Login;
