/**
 * Frontend Chat Component with Proper Cleanup
 * File: frontend/app/src/components/chat/ChatWindow.jsx (partial)
 */

import React, { useEffect, useCallback, useRef } from 'react';
import { socketService } from '../../lib/socket';
import DOMPurify from 'isomorphic-dompurify';

const ChatWindow = ({ conversationId }) => {
  const [messages, setMessages] = React.useState([]);
  const messagesEndRef = useRef(null);

  // Handle new message with sanitization
  const handleNewMessage = useCallback((data) => {
    const { message } = data;
    
    // Sanitize message content before displaying
    const sanitizedMessage = {
      ...message,
      content: DOMPurify.sanitize(message.content, {
        ALLOWED_TAGS: [],
        KEEP_CONTENT: true,
      }),
    };

    setMessages(prev => [...prev, sanitizedMessage]);
    
    // Scroll to bottom
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, []);

  // Setup socket listeners
  useEffect(() => {
    if (!conversationId) return;

    // Join conversation
    socketService.joinConversation(conversationId);

    // Listen for new messages
    socketService.onNewMessage(handleNewMessage);

    // Cleanup function - CRITICAL to prevent memory leaks
    return () => {
      socketService.offNewMessage(handleNewMessage);
    };
  }, [conversationId, handleNewMessage]);

  // Send message handler
  const handleSendMessage = useCallback((content) => {
    if (!content.trim()) return;

    // Client-side validation
    if (content.length > 2000) {
      alert('Message is too long (max 2000 characters)');
      return;
    }

    socketService.sendMessage(conversationId, content.trim());
  }, [conversationId]);

  return (
    <div className="chat-window">
      <div className="messages">
        {messages.map((msg, index) => (
          <div key={msg._id || index} className="message">
            <span>{msg.sender.fullName}:</span>
            <span dangerouslySetInnerHTML={{ 
              __html: DOMPurify.sanitize(msg.content, { 
                ALLOWED_TAGS: [],
                KEEP_CONTENT: true 
              })
            }} />
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>
      
      {/* Message input would go here */}
    </div>
  );
};

export default React.memo(ChatWindow);
