
import { useState, useEffect, useRef } from 'react';

import {
  MessageList,
  Message,
  TypingIndicator,
} from '@chatscope/chat-ui-kit-react';

import axios from 'axios';

const API_KEY = import.meta.env.VITE_OPENAI_KEY;

const ChatComponent = () => {
  const [messages, setMessages] = useState([
    {
      message: "Hello, I'm Omni! Ask me anything!",
      sentTime: "just now",
      sender: "ChatGPT",
    },
  ]);
  const [isTyping, setIsTyping] = useState(false);
  const [inputValue, setInputValue] = useState('');
  const [isSpeaking, setIsSpeaking] = useState(false); // New state
  const messageListRef = useRef(null);

  useEffect(() => {
    // Scroll to the bottom of the message list whenever a new message is added
    if (messageListRef.current) {
      setTimeout(() => {
        messageListRef.current.scrollTop = messageListRef.current.scrollHeight;
      }, 0);
    }
  }, [messages]);

  const handleSendRequest = async (e) => {
    e.preventDefault();
    if (inputValue.trim() === '') {
      return; // Don't send empty messages
    }

    const newMessage = {
      message: inputValue,
      direction: 'outgoing',
      sender: "user",
    };

    setMessages((prevMessages) => [...prevMessages, newMessage]);
    setIsTyping(true);

    try {
      const response = await processMessageToChatGPT([...messages, newMessage]);
      const content = response.choices[0]?.message?.content;
      if (content) {
        const chatGPTResponse = {
          message: content,
          sender: "ChatGPT",
        };
        setMessages((prevMessages) => [...prevMessages, chatGPTResponse]);
        /////
        // Set speaking indicator to true
        setIsSpeaking(true);
        speakText(content);
      }
    } catch (error) {
      console.error("Error processing message:", error);
    } finally {
      setIsTyping(false);
      setIsSpeaking(false); // Reset speaking 
      setInputValue(''); // Clear input after sending
    }
  };

  async function processMessageToChatGPT(chatMessages) {
    const apiMessages = chatMessages.map((messageObject) => {
        const role = messageObject.sender === "ChatGPT" ? "assistant" : "user";
        return { role, content: messageObject.message };
      });
  
      const apiRequestBody = {
        "model": "gpt-3.5-turbo",
        "messages": [
          { role: "system", content: "I'm a Student using ChatGPT for learning" },
          ...apiMessages,
        ],
      };
  
      const response = await fetch("https://api.openai.com/v1/chat/completions", {
        method: "POST",
        headers: {
          "Authorization": "Bearer " + API_KEY,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(apiRequestBody),
      });
  
      return response.json();
  }

  const speakText = async (text) => {
    const apiKey = import.meta.env.VITE_API_KEY;
    const voiceId = 'HqwE5jJMybfLvDiyr0es';
  
    const apiRequestOptions = {
      method: 'POST',
      url: `https://api.elevenlabs.io/v1/text-to-speech/${voiceId}`,
      headers: {
        accept: 'audio/mpeg',
        'content-type': 'application/json',
        'xi-api-key': apiKey,
      },
      data: {
        text: text,
      },
      responseType: 'arraybuffer',
    };
  
    try {
      const apiResponse = await axios.request(apiRequestOptions);
  
      // Create a Blob from the array buffer
      const blob = new Blob([apiResponse.data], { type: 'audio/mpeg' });
  
      // Create an Audio element
      const audio = new Audio();
      audio.src = URL.createObjectURL(blob);
  
      // Play the audio
      audio.play();
  
      // Return the audio element (optional)
      return audio;
    } catch (error) {
      console.error('Error while fetching audio:', error);
      return null;
    }
  };
  

  return (
    <div className="app-container" style={{ backgroundColor: "rgba(0, 0, 0, 0)", color: "#ccc", minHeight: "50vh", display: "flex", alignItems: "center", justifyContent: "center", zIndex: "3" }}>
  <div style={{ width: "50%", maxWidth: "700px", borderRadius: "10px", overflow: "hidden", padding: "20px" }}>
        <MessageList
          ref={messageListRef}
          style={{ maxHeight: "400px", overflowY: "auto" }}
          scrollBehavior="smooth"
          typingIndicator={isTyping ? <TypingIndicator content="Omni is thinking" /> : null}
        >
          {messages.map((message, i) => (
            <Message
              key={i}
              model={message}
              style={{
                marginBottom: "10px",
                background: message.sender === "user" ? "#007BFF" : "#6C757D", // Different background for user and AI messages
                color: "#fff", // Text color
                borderRadius: "8px",
                padding: "8px",
                alignSelf: message.sender === "user" ? "flex-end" : "flex-start", // Align user messages to the right, AI messages to the left
              }}
            />
          ))}
        </MessageList>
        <form onSubmit={handleSendRequest}>
          <div style={{ display: "flex", marginTop: "10px" }}>
            <input
              type="text"
              style={{ flex: "1", marginRight: "10px", padding: "8px", borderRadius: "8px", border: "1px solid #ccc" }}
              placeholder="Type a message"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
            />
            <button
              type="submit"
              style={{
                backgroundColor: "#28a745", // Button color
                color: "#fff", // Text color
                border: "none",
                padding: "10px",
                borderRadius: "8px",
                cursor: "pointer",
              }}
            >
              Send
            </button>
          </div>
          {isSpeaking && <div style={{ marginTop: '10px' }}>🔊 Preparing Voice...</div>}
        </form>
      </div>
    </div>
  )
}

export default ChatComponent;
