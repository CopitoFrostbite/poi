import React, { useState } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import './Centrado.css';
import { useNavigate } from 'react-router-dom';

function Register() {
  const [username, setUsername] = useState('');
  const [correo, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [registerError, setRegisterError] = useState('');
  const navigate = useNavigate();

  const handleUsernameChange = (event) => {
    setUsername(event.target.value);
  };

  const handleEmailChange = (event) => {
    setEmail(event.target.value);
  };

  const handlePasswordChange = (event) => {
    setPassword(event.target.value);
  };

  const handleConfirmPasswordChange = (event) => {
    setConfirmPassword(event.target.value);
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    
    // Enviar una solicitud POST al servidor con los valores de nombre de usuario, correo electrónico y contraseña
    fetch('http://localhost:3001/api/auth/register', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ username, correo, password })
    })
      .then(response => response.json())
      
      .then(data => {
        console.log(data);
        // Verificar si el registro fue exitoso
        
        if (data.success) {
          // Redirigir al usuario a la página de inicio de sesión
          setRegisterError("");
          setUsername("");
          setEmail("");
          setPassword("");
          setSuccessMessage("Cuenta creada con éxito");
          setTimeout(() => {
            navigate('/');
          }, 3000);
          
        } else {
          // Mostrar un mensaje de error en la página de registro
         
            setRegisterError(data.message);
            setUsername('');
            setEmail('');
            setPassword('');
            setConfirmPassword('');
          
        }
      })
      .catch(error => {
        // Mostrar un mensaje de error en la página de registro
        setSuccessMessage("");
        setRegisterError("");
        setUsername("");
        setEmail("");
        setPassword("");  
        setRegisterError('Hubo un error al registrar el usuario. Por favor, inténtelo de nuevo más tarde.');
      });
  };

  const handleLoginClick = () => {
    navigate('/');
  };

  return (
    <div className="register-container bg-gradient-primary">
      <form id="registerForm" onSubmit={handleSubmit} className="text-light">
        <h1 className="text-center mb-4">Registro</h1>
        <div className="form-group">
          <label htmlFor="inputName">Nombre de usuario:</label>
          <input type="text" className="form-control" id="inputName" value={username} onChange={handleUsernameChange} required />
        </div>
        <div className="form-group">
          <label htmlFor="inputEmail">Correo electrónico:</label>
          <input type="email" className="form-control" id="inputEmail" value={correo} onChange={handleEmailChange} required />
        </div>
        <div className="form-group">
          <label htmlFor="inputPassword">Contraseña:</label>
          <input type="password" className="form-control" id="inputPassword" value={password} onChange={handlePasswordChange} required />
        </div>
        <div className="form-group">
          <label htmlFor="inputConfirmPassword">Confirmar contraseña:</label>
          <input type="password" className="form-control" id="inputConfirmPassword" value={confirmPassword} onChange={handleConfirmPasswordChange} required />
        </div>
        {errorMessage && <div className="alert alert-danger">{errorMessage}</div>}
        {registerError && <div className="alert alert-danger">{registerError}</div>}
        {successMessage && (  <div className="alert alert-success">{successMessage}</div>)}
        <button type="submit" className="btn btn-lg btn-block btn-outline-light mt-4">Registrarse</button>
      </form>
      <p className="text-light mt-3">¿Ya tienes cuenta? <a href="#" onClick={handleLoginClick}>Inicia sesión aquí</a>.</p>
    </div>
  );
}

export default Register;
