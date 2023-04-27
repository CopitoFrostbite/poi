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
     
      console.log(decodedToken._id);
      setDecoded(decodedToken);
    } else {
      navigate('/');
    }
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
    console.log(  conversation._id);
    console.log(  decoded._id);
    console.log(  message);
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
  
  const handleConversationSelect = (conversationId) => {
    setSelectedConversation(conversationId);
  };

  // Render the chat interface
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
        <MessageList messages={messages} decoded={decoded} getUsernameForUserId={getUsernameForUserId} />
          <MessageInput
           conversation={conversations.find(conversation => conversation._id === selectedConversation)}
           decoded={decoded}
           socket={socket}
           onInputChange={() => { }}
           onSubmit={() => setSelectedConversation(null)}
          />
        </div>
      </div>
    </div>
  );
};

export default Chat;
