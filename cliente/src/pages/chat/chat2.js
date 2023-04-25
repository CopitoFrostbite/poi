import React, { useState, useEffect } from 'react';
import io from 'socket.io-client';
import { useNavigate } from 'react-router-dom';
import jwtDecode from "jwt-decode";
import axios from 'axios';
import './chat.css';
import ConversationList from './conversationlist.jsx';
import 'bootstrap/dist/css/bootstrap.min.css';

const secret = process.env.TOKEN_SECRET;

const Chat = ({ user, conversation }) => {
  const [conversations, setConversations] = useState([]);
  const [selectedConversation, setSelectedConversation] = useState(null);
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState([]);
  const [decoded, setDecoded] = useState(null);
  const [otherUsernames, setOtherUsernames] = useState({});
  const socket = io('http://localhost:3001');
  const navigate = useNavigate();

  useEffect(() => {
    const token = sessionStorage.getItem('token');
    if (token) {
      const decodedToken = jwtDecode(token, secret);
      console.log(decodedToken);
      console.log(decodedToken._id);
      setDecoded(decodedToken);
    } else {
      navigate('/');
    }
  }, [navigate]);

  useEffect(() => {
    if (decoded) {
      const fetchConversations = async () => {
        console.log(decoded);
        try {
          const response = await axios.get(`http://localhost:3001/api/conversations/${decoded._id}`);
          console.log(response);
          setConversations(response.data);
          
          const otherIds = response.data.map(conversation => conversation.members.find(member => member !== decoded._id));
          console.log(otherIds);
          const promises = otherIds.map(id => axios.get(`http://localhost:3001/api/user/${id}`));
          console.log(promises);
          const responses = await Promise.all(promises);
          const usernames = {};
          responses.forEach(response => {
            const username = response.data.username;
            
            const userId = response.data._id;
            
            usernames[userId] = username;
          });
          
          setOtherUsernames(usernames);
          console.log(otherUsernames);
        } catch (error) {
          console.log(error);
        }
      };
      fetchConversations();
      console.log("Fetching conversations");
  
      const username = decoded.username;
      console.log("Username:", username);
    }
  
    socket.on('message', (newMessage) => {
      if (newMessage.conversationId === selectedConversation) {
        setMessages([...messages, newMessage]);
      }
      console.log("New message received from socket:", newMessage);
    });
  
    return () => {
      socket.disconnect();
    };
  }, [decoded, selectedConversation]);

  const handleSubmit = async (event) => {
    event.preventDefault();
    const newMessage = {
      conversationId: conversation._id,
      senderId: decoded._id,
      text: message
    };
    try {
      const response = await axios.post('http://localhost:3001/api/messages', newMessage);
      setMessages([...messages, response.data]);
      setMessage('');
      socket.emit('message', response.data);
      console.log("Message sent through socket:", response.data);
    } catch (error) {
      console.log(error);
    }
  };

  const handleConversationClick = async (conversationId) => {
    try {
      const response = await axios.get(`http://localhost:3001/api/messages/${conversationId}`);
      setMessages(response.data);
      setSelectedConversation(conversationId);
    } catch (error) {
      console.log(error);
    }
  };

  const handleInputChange = (event) => {
    setMessage(event.target.value);
  };

  
  const getUsernameForUserId = (userId) => {
    return otherUsernames[userId];
  };
  

  // Render the chat interface
  return (
    <div className="container">
      <h1>Chat</h1>
      <div className="row">
        <div className="col-sm-4">
          <ConversationList
            conversations={conversations}
            selectedConversation={selectedConversation}
            onConversationClick={handleConversationClick}
            getUsernameForUserId={getUsernameForUserId}
          />
        </div>
        <div className="col-sm-8">
          <div className="card mb-3">
            <div className="card-body">
              <ul className="list-unstyled">
                {messages.map((message) => (
                  <li key={message._id}>
                    <strong>{message.senderId}: </strong>
                    {message.text}
                  </li>
                ))}
              </ul>
            </div>
          </div>
          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <textarea
                className="form-control"
                placeholder="Enter message"
                value={message}
                onChange={handleInputChange}
              ></textarea>
            </div>
            <button type="submit" className="btn btn-primary">
              Send
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Chat;
