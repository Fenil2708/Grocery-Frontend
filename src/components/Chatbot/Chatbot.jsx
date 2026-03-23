"use client"

import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import { IoChatbubbleEllipsesSharp, IoSendSharp, IoCloseSharp } from "react-icons/io5";
import { FaRobot, FaUser } from "react-icons/fa";
import './Chatbot.css';

const Chatbot = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [message, setMessage] = useState('');
    const [chatHistory, setChatHistory] = useState([
        { role: 'bot', text: 'Hello! I am your AI assistant. How can I help you today?' }
    ]);
    const [isLoading, setIsLoading] = useState(false);
    const scrollRef = useRef(null);

    useEffect(() => {
        if (scrollRef.current) {
            scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
        }
    }, [chatHistory, isOpen]);

    const handleSendMessage = async (e) => {
        e.preventDefault();
        if (!message.trim()) return;

        const userMessage = message.trim();
        setChatHistory(prev => [...prev, { role: 'user', text: userMessage }]);
        setMessage('');
        setIsLoading(true);

        try {
            const response = await axios.post(`${process.env.NEXT_PUBLIC_APP_API_URL}/api/chat/response`, {
                message: userMessage
            });

            if (response.data.success) {
                setChatHistory(prev => [...prev, { role: 'bot', text: response.data.message }]);
            } else {
                setChatHistory(prev => [...prev, { role: 'bot', text: "Sorry, I'm having trouble responding right now." }]);
            }
        } catch (error) {
            console.error("Chat Error:", error);
            setChatHistory(prev => [...prev, { role: 'bot', text: "Unable to connect to service. Please try again later." }]);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className={`chatbot-wrapper ${isOpen ? 'active' : ''}`}>
            {/* Chat Bubble Toggle */}
            <button 
                className="chatbot-toggle shadow-premium" 
                onClick={() => setIsOpen(!isOpen)}
                aria-label="Toggle Chatbot"
            >
                {isOpen ? <IoCloseSharp size={28} /> : <IoChatbubbleEllipsesSharp size={28} />}
                {!isOpen && <span className="notification-dot"></span>}
            </button>

            {/* Chat Window */}
            <div className={`chat-window glass shadow-premium-lg ${isOpen ? 'show' : ''}`}>
                <div className="chat-header">
                    <div className="bot-info">
                        <div className="bot-icon">
                            <FaRobot />
                        </div>
                        <div className="bot-details">
                            <h3>Grocery AI</h3>
                            <div className="status">
                                <span className="status-dot"></span>
                                <span>Online</span>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="chat-messages custom-scrollbar-premium" ref={scrollRef}>
                    {chatHistory.map((chat, index) => (
                        <div key={index} className={`message-container ${chat.role}`}>
                            <div className="message-icon">
                                {chat.role === 'bot' ? <FaRobot /> : <FaUser />}
                            </div>
                            <div className="message-bubble">
                                <p>{chat.text}</p>
                            </div>
                        </div>
                    ))}
                    {isLoading && (
                        <div className="message-container bot">
                            <div className="message-icon">
                                <FaRobot />
                            </div>
                            <div className="message-bubble typing">
                                <div className="dot"></div>
                                <div className="dot"></div>
                                <div className="dot"></div>
                            </div>
                        </div>
                    )}
                </div>

                <form className="chat-input" onSubmit={handleSendMessage}>
                    <input 
                        type="text" 
                        placeholder="Type your message..." 
                        value={message}
                        onChange={(e) => setMessage(e.target.value)}
                        disabled={isLoading}
                    />
                    <button type="submit" disabled={!message.trim() || isLoading}>
                        <IoSendSharp />
                    </button>
                </form>
            </div>
        </div>
    );
};

export default Chatbot;
