import React from 'react';
import moment from 'moment';
import './conversationlist.css';

const ConversationList = ({ conversations, selectedConversation, onConversationClick, getUsernameForUserId, decoded }) => {
 
  const groupConversations = conversations.filter(conversation => conversation.group === true);
  const oneOnOneConversations = conversations.filter(conversation => conversation.group === false);
  
  return (
    <div className="conversation-list">
      
      {groupConversations.length > 0 &&
        <div>
          <h3 className="conversation-list-heading">Conversaciones Grupales</h3>
          <ul className="list-group">
            {groupConversations.map(conversation => {
              const selected = conversation._id === selectedConversation ? 'active' : '';
              const lastUpdatedAt = moment(conversation.lastUpdatedAt);
              const now = moment();

              let displayText = lastUpdatedAt.format('h:mm A');

              if (now.diff(lastUpdatedAt, 'days') < 1) {
                displayText = 'Ayer';
              } else if (now.diff(lastUpdatedAt, 'days') >= 1) {
                displayText = lastUpdatedAt.format('MMM D');
              }

              return (
                <li
                  key={conversation._id}
                  className={`list-group-item ${selected}`}
                  onClick={() => onConversationClick(conversation._id)}
                >
                  <div className="d-flex justify-content-between align-items-center">
                    <i className="fas fa-users mr-2"></i>
                    <span>{conversation.subgroup}</span>
                    <span className="last-updated-at">{displayText}</span>
                  </div>
                </li>
              )
            })}
          </ul>
        </div>
      }

      
      {oneOnOneConversations.length > 0 &&
        <div>
          <h3 className="conversation-list-heading">Conversaciones Uno a Uno</h3>
          <ul className="list-group">
            {oneOnOneConversations.map(conversation => {
              const otherUserId = conversation.members.find(memberId => memberId !== decoded._id);
              const otherUsername = getUsernameForUserId(otherUserId);
              const selected = conversation._id === selectedConversation ? 'active' : '';
              const lastUpdatedAt = moment(conversation.lastUpdatedAt);
              const now = moment();

              let displayText = lastUpdatedAt.format('h:mm A');

              if (now.diff(lastUpdatedAt, 'days') < 1) {
                displayText = 'Ayer';
              } else if (now.diff(lastUpdatedAt, 'days') >= 1) {
                displayText = lastUpdatedAt.format('MMM D');
              }

              return (
                <li
                  key={conversation._id}
                  className={`list-group-item ${selected}`}
                  onClick={() => onConversationClick(conversation._id)}
                >
                  <div className="d-flex justify-content-between align-items-center">
                    <span className="other-username">{otherUsername}</span>
                    <span className="last-updated-at">{displayText}</span>
                  </div>
                </li>
              )
            })}
          </ul>
        </div>
      }
    </div>
  );
};

export default ConversationList;
