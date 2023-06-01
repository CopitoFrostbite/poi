import React, { useEffect, useRef } from 'react';
import CryptoJS from 'crypto-js';
import moment from 'moment';
import './messagelist.css';

const MessageList = ({ messages, decoded, getUsernameForUserId }) => {
  const messageListRef = useRef(null);
  const encryptionKey = 'clave1234567890'; // Clave única compartida

  useEffect(() => {
    // Scroll automático hacia el final de la lista de mensajes al recibir una nueva actualización
    const messageList = messageListRef.current;
    messageList.scrollTop = messageList.scrollHeight;
  }, [messages]);

  const decryptMessage = (message, key) => {
    if (!message.encrypted) {
      return message.text; // Devolver el texto del mensaje si no está encriptado
    }

    const decryptedBytes = CryptoJS.AES.decrypt(message.text, key);
    const decryptedMessage = decryptedBytes.toString(CryptoJS.enc.Utf8);

    return decryptedMessage;
  };

  const getImageUrl = (media) => {
    if (!media) {
      return null;
    }

    if (media.contentType === 'image/jpeg' || media.contentType === 'image/png') {
      return `http://localhost:3001/uploads/${media.data}`; 
    }

    return null;
  };

  return (
    <div className="chat-card">
      <div className="chat-card-body" ref={messageListRef}>
        <ul className="list-unstyled">
          {messages.map((message) => {
            const senderUsername = message.sender === decoded._id ? 'Yo' : getUsernameForUserId(message.sender);
            const messageClassName = message.sender === decoded._id ? 'chat-message-right' : 'chat-message-left';
            const displayedMessage = decryptMessage(message, encryptionKey);
            const imageUrl = getImageUrl(message.media);

            return (
              <li key={message._id} className="d-flex justify-content-start">
                <p className={`chat-message ${messageClassName}`}>
                  <strong>{senderUsername}:</strong> {displayedMessage}
                </p>
                {imageUrl && (
                  <div className="message-media">
                    <img src={imageUrl} alt="Imagen" className="message-media-image" />
                  </div>
                )}
              </li>
            );
          })}
        </ul>
      </div>
    </div>
  );
};

export default MessageList;



