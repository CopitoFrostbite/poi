import React, { useEffect } from 'react';
import moment from 'moment';
import './messagelist.css';

const MessageList = ({ messages, decoded, getUsernameForUserId }) => {
  useEffect(() => {
    // Scroll automático hacia el final de la lista de mensajes al recibir una nueva actualización
    const messageList = document.getElementById('message-list');
    messageList.scrollTop = messageList.scrollHeight;
  }, [messages]);

  return (
    <div className="chat-card">
      <div className="chat-card-body" id="message-list">
        <ul className="list-unstyled">
          {messages.map((message) => {
            const senderUsername = message.sender === decoded._id ? 'Yo' : getUsernameForUserId(message.sender);
            return (
              <li key={message._id}>
                <p className={`chat-message ${message.sender === decoded._id ? 'chat-message-right' : 'chat-message-left'}`}>
                  <strong>{senderUsername}:</strong> {message.text}
                </p>
              </li>
            );
          })}
        </ul>
      </div>
    </div>
  );
};

export default MessageList;


