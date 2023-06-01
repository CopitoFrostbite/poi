import React, { useState, useEffect } from 'react';
import io from 'socket.io-client';
import { useNavigate } from 'react-router-dom';

import jwtDecode from "jwt-decode";
import axios from 'axios';
import './chat.css';
import MessageList from './messagelist.jsx';
import ConversationList from './conversationlist.jsx';
import CreateConversationForm from './conversationform';
import MessageInput from './messageinput.jsx';
import 'bootstrap/dist/css/bootstrap.min.css';

const secret = process.env.TOKEN_SECRET;

const Chat = ({ user, conversation }) => {
  const [conversations, setConversations] = useState([]);
  const [connectedUsers, setConnectedUsers] = useState([]);
  const [selectedConversation, setSelectedConversation] = useState(null);
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState([]);
  const [decoded, setDecoded] = useState(null);
  const [otherUsernames, setOtherUsernames] = useState({});
  const [showCreateForm, setShowCreateForm] = useState(false);
  const socket = io('http://localhost:3001');
  const navigate = useNavigate();

  useEffect(() => {
    const token = sessionStorage.getItem('token');
    if (token) {
      const decodedToken = jwtDecode(token, secret);    
      setDecoded(decodedToken);
      socket.emit('addUser', decodedToken._id);
    } else {
      navigate('/');
    }

    socket.on('userConnected', (userId) => {
      console.log('Usuario conectado:', userId);
      // Actualizar la lista de usuarios conectados
      setConnectedUsers((prevUsers) => [...prevUsers, userId]);
    });

    socket.on('userDisconnected', (userId) => {
      console.log('Usuario desconectado:', userId);
      // Actualizar la lista de usuarios conectados
      setConnectedUsers((prevUsers) => prevUsers.filter((user) => user !== userId));
    });

    return () => {
      // Limpiar los listeners del socket al desmontar el componente
      socket.off('userConnected');
      socket.off('userDisconnected');
    };
  }, [navigate]);

  useEffect(() => {
    if (decoded) {
      const fetchConversations = async () => {
        try {
          const response = await axios.get(`http://localhost:3001/api/conversations/${decoded._id}`);
          const conversations = response.data;
          setConversations(conversations);
          
          const userIds = conversations.reduce((acc, convo) => {
            return [...acc, ...convo.members.filter(memberId => memberId !== decoded._id)];
          }, []);
          const userPromises = userIds.map(userId => axios.get(`http://localhost:3001/api/user/${userId}`));
          const userResponses = await Promise.all(userPromises);
          const users = userResponses.reduce((acc, response) => {
            const { _id, username } = response.data;
            return {...acc, [_id]: username };
          }, {});
          setOtherUsernames(users);
        } catch (error) {
          console.log(error);
        }
      };
  
      fetchConversations();
      console.log("Fetching conversations");
    }

    socket.on('newMessage', (newMessage) => {
      if (newMessage.conversationId === selectedConversation) {
        setMessages((prevMessages) => [...prevMessages, newMessage]);
      }
    });

    socket.on('updateChat', (newMessage) => {
      setMessages((prevMessages) => [newMessage, ...prevMessages.filter((message) => message._id !== newMessage._id)]);
    });
  
    return () => {
      socket.disconnect();
    };
  }, [decoded, selectedConversation]);

  const handleConversationClick = async (conversationId) => {
    try {
      const response = await axios.get(`http://localhost:3001/api/messages/${conversationId}`);
      setMessages(response.data);
      setSelectedConversation(conversationId);
    } catch (error) {
      console.log(error);
    }
  };

  const getUsernameForUserId = (userId) => {
    return otherUsernames[userId];
  };

  
  

  return (
    <div className="container">
      <h1>Chat</h1>
      <div className="row">
        <div className="col-sm-4">
          <button className="create-conversation-button" onClick={() => setShowCreateForm(!showCreateForm)}>
            {showCreateForm ? 'Cerrar' : 'Crear nueva conversación'}
          </button>
          {showCreateForm && <CreateConversationForm onSubmit={() => setShowCreateForm(false)} decoded={decoded} />}
          <ConversationList
            conversations={conversations}
            selectedConversation={selectedConversation}
            onConversationClick={handleConversationClick}
            getUsernameForUserId={getUsernameForUserId}
            decoded={decoded}
            otherUsernames={otherUsernames}
          />
        </div>
        <div className="col-sm-8">
          <div className="message-container">
            <MessageList messages={messages} decoded={decoded} getUsernameForUserId={getUsernameForUserId} />
            <MessageInput
              conversation={conversations.find(conversation => conversation._id === selectedConversation)}
              decoded={decoded}
              socket={socket}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Chat;

