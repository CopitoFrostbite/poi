import React, { useState } from 'react';
import axios from 'axios';
import CryptoJS from 'crypto-js';

const MessageInput = ({ conversation, decoded, socket }) => {
  const [message, setMessage] = useState('');
  const [encryptMessages, setEncryptMessages] = useState(false);
  const [image, setImage] = useState(null);
  const [isSending, setIsSending] = useState(false);

  const key = 'clave1234567890'; // Clave única compartida

  const encryptMessage = (message, key) => {
    const encrypted = CryptoJS.AES.encrypt(message, key).toString();
    return encrypted;
  };

  const handleImageChange = (event) => {
    const selectedImage = event.target.files[0];
    setImage(selectedImage);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (isSending) {
      return;
    }

    if (message.trim() === '' && !image) {
      return;
    }

    setIsSending(true);

    let newMessage = {
      conversationId: conversation._id,
      sender: decoded._id,
      text: message,
      encrypted: encryptMessages,
      media: null,
    };

    if (encryptMessages) {
      const encryptedText = encryptMessage(message, key);
      newMessage.text = encryptedText;
      console.log('Mensaje encriptado enviado:', encryptedText);
    }

    if (image) {
      const formData = new FormData();
      formData.append('image', image);

      try {
        const response = await axios.post('http://localhost:3001/api/upload', formData);
        newMessage.media = {
          contentType: image.type, // Agrega el tipo de contenido de la imagen
          data: response.data.imageUrl, // Agrega la URL de la imagen
        };
      } catch (error) {
        console.log(error);
      }
    }

    try {
      const response = await axios.post('http://localhost:3001/api/messages', newMessage);
      setMessage('');
      setImage(null);
      socket.emit('message', response.data);
      console.log('Mensaje enviado a través del socket:', response.data);
    } catch (error) {
      console.log(error);
    }

    setIsSending(false);
  };

  const handleInputChange = (event) => {
    setMessage(event.target.value);
  };

  const handleKeyDown = (event) => {
    if (event.key === 'Enter') {
      event.preventDefault();
      handleSubmit(event);
    }
  };

  const handleShareLocation = () => {
    if (!navigator.geolocation) {
      console.log('Geolocalización no soportada en este navegador');
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords;
        const locationMessage = `Ubicación compartida: Latitud ${latitude}, Longitud ${longitude}`;
        setMessage(locationMessage);
        handleSubmit(); // Remove 'event' parameter since it's not used
      },
      (error) => {
        console.log('Error al obtener la ubicación:', error);
      }
    );
  };
  return (
    <form onSubmit={handleSubmit}>
      <div className="form-group">
        <textarea
          className="form-control"
          placeholder="Mensaje"
          value={message}
          onChange={handleInputChange}
          onKeyDown={handleKeyDown}
        ></textarea>
      </div>
      <div className="form-group">
        <input type="file" accept="image/*" onChange={handleImageChange} />
      </div>
      <div className="form-check">
        <input
          className="form-check-input"
          type="checkbox"
          checked={encryptMessages}
          onChange={(event) => setEncryptMessages(event.target.checked)}
          id="encryptCheckbox"
        />
        <label className="form-check-label" htmlFor="encryptCheckbox">
          Encriptar mensaje
        </label>
      </div>
      <button type="submit" className="btn btn-primary" disabled={isSending}>
        {isSending ? 'Enviando...' : 'Enviar'}
      </button>
      <button type="button" className="btn btn-primary" onClick={handleShareLocation}>
        Compartir ubicación
      </button>
    </form>
  );
};

export default MessageInput;


