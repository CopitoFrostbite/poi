import React, { useState } from 'react';
import axios from 'axios';

const MessageInput = ({ conversation, decoded, socket, onInputChange, onSubmit }) => {
  const [message, setMessage] = useState('');

  const handleSubmit = async (event) => {
    event.preventDefault();
    const newMessage = {
      conversationId: conversation._id,
      sender: decoded._id,
      text: message
    };
    try {
      const response = await axios.post('http://localhost:3001/api/messages', newMessage);
      setMessage('');
      socket.emit('message', response.data);
      console.log("Message sent through socket:", response.data);
      onSubmit();
    } catch (error) {
      console.log(error);
    }
  };

  const handleInputChange = (event) => {
    setMessage(event.target.value);
    onInputChange();
  };

  const handleKeyDown = (event) => {
    if (event.key === 'Enter') {
      event.preventDefault();
      handleSubmit(event);
    }
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
      <button type="submit" className="btn btn-primary">
        Enviar
      </button>
    </form>
  );
};

export default MessageInput;
