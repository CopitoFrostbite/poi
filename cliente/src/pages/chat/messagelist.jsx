import React, { useEffect, useRef } from 'react';
import moment from 'moment';
import './messagelist.css';

const MessageList = ({ messages, decoded, getUsernameForUserId }) => {
  const messageListRef = useRef(null);

  useEffect(() => {
    // Scroll automático hacia el final de la lista de mensajes al recibir una nueva actualización
    const messageList = messageListRef.current;
    messageList.scrollTop = messageList.scrollHeight;
  }, [messages]);

  return (
    <div className="chat-card">
      <div className="chat-card-body" ref={messageListRef}>
        <ul className="list-unstyled">
          {messages.map((message) => {
            const senderUsername = message.sender === decoded._id ? 'Yo' : getUsernameForUserId(message.sender);
            const messageClassName = message.sender === decoded._id ? 'chat-message-right' : 'chat-message-left';
            return (
              <li key={message._id} className="d-flex justify-content-start">
                <p className={`chat-message ${messageClassName}`}>
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



