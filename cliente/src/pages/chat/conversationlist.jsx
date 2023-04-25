import React from 'react';
import './conversationlist.css';

const ConversationList = ({ conversations, selectedConversation, onConversationClick, getUsernameForUserId }) => {
  
  return (
    <div className="conversation-list">
      {conversations.map((conversation) => {
        
        return (
          <div
            key={conversation._id}
            className={`conversation-list-item ${conversation._id === selectedConversation ? 'selected' : ''}`}
            onClick={() => onConversationClick(conversation._id)}
          >
            <div className="conversation-list-item-avatar">{getUsernameForUserId(conversation.members.find(member => member !== conversation.creator))?.charAt(0)}</div>
            <div className="conversation-list-item-content">
              <div className="conversation-list-item-header">
                <div className="conversation-list-item-name">{getUsernameForUserId(conversation.members.find(member => member !== conversation.creator))}</div>
                <div className="conversation-list-item-date">{new Date(conversation.updatedAt).toLocaleDateString()}</div>
              </div>
              <div className="conversation-list-item-text">{conversation.lastMessage}</div>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default ConversationList;
