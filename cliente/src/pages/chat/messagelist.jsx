import React from 'react';
import './messagelist.css';


const MessageList = ({ messages, decoded,getUsernameForUserId }) => {

    return (
        <div className="chat-card">
            <div className="chat-card-body">
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
