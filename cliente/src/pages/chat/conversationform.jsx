import React, { useState, useEffect } from 'react';
import './conversationform.css';
import axios from 'axios';

const CreateConversationForm = ({ onSubmit,decoded }) => {
  const [isGroup, setIsGroup] = useState(false);
  const [subgroup, setSubgroup] = useState('');
  const [members, setMembers] = useState([decoded._id]);

  const [users, setUsers] = useState([]);

  useEffect(() => {
    axios.get('http://localhost:3001/api/user')
      .then((response) => setUsers(response.data))
      .catch((error) => console.log(error));
  }, []);

  const handleSubmit = (event) => {
    event.preventDefault();
    let newMembers = members.slice(); 
  
    
    if (!newMembers.includes(decoded._id)) {
      newMembers.push(decoded._id);
    }
  
    let conversationData;
    if (isGroup) {
      conversationData = {
        members: newMembers,        
        subgroup,
      };
    } else {
      console.log();
      conversationData = {
        senderId: decoded._id,
        
        receiverId: members[0],
      };
    }

    
    const url = isGroup ? 'http://localhost:3001/api/conversations/group' : 'http://localhost:3001/api/conversations';
    console.log(url);
    console.log(conversationData);
    axios.post(url, conversationData)
      .then((response) => onSubmit(response.data))
      .catch((error) => console.log(error));
  };

  return (
    <div className="create-conversation-form">
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <div className="form-check">
            <input
              type="checkbox"
              className="form-check-input"
              checked={isGroup}
              onChange={(event) => setIsGroup(event.target.checked)}
            />
            <label className="form-check-label">Conversación grupal</label>
          </div>
        </div>

        {isGroup && (
          <div className="form-group">
            <label htmlFor="subgroup">Subgrupo:</label>
            <input
              type="text"
              id="subgroup"
              className="form-control"
              value={subgroup}
              onChange={(event) => setSubgroup(event.target.value)}
              required
            />
          </div>
        )}

        <div className="form-group">
          <label htmlFor="members">Participantes:</label>
          <select
            id="members"
            multiple
            className="form-control"
            value={members}
            onChange={(event) => setMembers(Array.from(event.target.selectedOptions, (option) => option.value))}
          >
            {users.map((user) => (
              <option key={user._id} value={user._id}>
                {user.username}
              </option>
            ))}
          </select>
        </div>

        <button type="submit" className="btn btn-primary">Crear conversación</button>
      </form>
    </div>
  );
};

export default CreateConversationForm;



