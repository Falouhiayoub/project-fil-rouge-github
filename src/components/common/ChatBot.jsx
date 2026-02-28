import { useState, useRef, useEffect, useMemo } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Link } from 'react-router-dom';
import { getAIResponse } from '../../services/chatbotService';
import { addToCart } from '../../redux/slices/cartSlice';
import { useToast } from '../../context/ToastContext';
import { formatCurrency } from '../../utils/formatCurrency';
import '../../styles/ChatBot.css';

const ChatBot = () => {
    const dispatch = useDispatch();
    const { showToast } = useToast();
    const { items: products } = useSelector((state) => state.products);
    
    const [isOpen, setIsOpen] = useState(false);
    const [messages, setMessages] = useState([
        { role: 'ai', text: 'Welcome to Fashion Fuel 2.0! I am your personal style advisor. Need an outfit for a wedding, advice on the latest trends, or help with your budget? Just ask!' }
    ]);
    const [input, setInput] = useState('');
    const [isTyping, setIsTyping] = useState(false);
    const messagesEndRef = useRef(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    };

    useEffect(() => {
        if (isOpen) {
            scrollToBottom();
        }
    }, [messages, isTyping, isOpen]);

    const handleSend = async () => {
        if (!input.trim()) return;

        const userMessage = { role: 'user', text: input };
        setMessages(prev => [...prev, userMessage]);
        setInput('');
        setIsTyping(true);

        // Convert messages to history format for AI
        const history = messages.map(msg => ({
            sender: msg.role === 'ai' ? 'model' : 'user',
            text: msg.text
        }));

        try {
            const aiResText = await getAIResponse(input, products, history);
            setMessages(prev => [...prev, { role: 'ai', text: aiResText }]);
        } catch (error) {
            setMessages(prev => [...prev, { role: 'ai', text: "I'm having trouble thinking right now. Please try again later!" }]);
        } finally {
            setIsTyping(false);
        }
    };

    const handleKeyPress = (e) => {
        if (e.key === 'Enter') {
            handleSend();
        }
    };

    const MessageContent = ({ text }) => {
        // Regex to find [PRODUCT:ID]
        const parts = text.split(/(\[PRODUCT:\d+\])/g);
        
        return (
            <div className="message-text">
                {parts.map((part, i) => {
                    const match = part.match(/\[PRODUCT:(\d+)\]/);
                    if (match) {
                        const productId = match[1];
                        const product = products.find(p => p.id === productId);
                        if (!product) return null;

                        return (
                            <div key={i} className="chat-product-card">
                                <img src={product.image} alt={product.title} className="chat-product-img" />
                                <div className="chat-product-info">
                                    <h4 className="chat-product-title">{product.title}</h4>
                                    <p className="chat-product-price">{formatCurrency(product.price)}</p>
                                    <div className="chat-product-actions">
                                        <Link to={`/shop/${product.id}`} className="chat-view-btn" onClick={() => setIsOpen(false)}>
                                            View
                                        </Link>
                                        <button 
                                            className="chat-add-btn" 
                                            onClick={() => {
                                                dispatch(addToCart({ ...product, quantity: 1 }));
                                                showToast(`${product.title} added from chat!`);
                                            }}
                                        >
                                            Add
                                        </button>
                                    </div>
                                </div>
                            </div>
                        );
                    }
                    return <span key={i}>{part}</span>;
                })}
            </div>
        );
    };

    return (
        <div className="chatbot-container">
            <button
                className={`chatbot-toggle ${isOpen ? 'open' : ''}`}
                onClick={() => setIsOpen(!isOpen)}
                aria-label={isOpen ? 'Close Chat' : 'Open Chat'}
            >
                <div className="bot-icon">
                    {isOpen ? '✕' : (
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/>
                        </svg>
                    )}
                </div>
            </button>

            {isOpen && (
                <div className="chatbot-window">
                    <div className="chatbot-header">
                        <div className="header-info">
                            <div className="status-dot"></div>
                            <h3>Fashion Fuel</h3>
                        </div>
                    </div>

                    <div className="chatbot-messages">
                        {messages.map((msg, index) => (
                            <div key={index} className={`message ${msg.role}`}>
                                <div className="message-avatar">
                                    {msg.role === 'ai' ? '✨' : '👤'}
                                </div>
                                <div className="message-bubble">
                                    <MessageContent text={msg.text} />
                                </div>
                            </div>
                        ))}
                        {isTyping && (
                            <div className="message ai">
                                <div className="message-avatar">✨</div>
                                <div className="message-bubble typing">
                                    <div className="dot"></div>
                                    <div className="dot"></div>
                                    <div className="dot"></div>
                                </div>
                            </div>
                        )}
                        <div ref={messagesEndRef} />
                    </div>

                    <div className="chatbot-input-area">
                        <input
                            type="text"
                            placeholder="Ask for style tips, weather fits, or event advice..."
                            value={input}
                            onChange={(e) => setInput(e.target.value)}
                            onKeyPress={handleKeyPress}
                            disabled={isTyping}
                        />
                        <button 
                            className="send-btn"
                            onClick={handleSend} 
                            disabled={isTyping || !input.trim()}
                        >
                            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                <line x1="22" y1="2" x2="11" y2="13"/><polygon points="22 2 15 22 11 13 2 9 22 2"/>
                            </svg>
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default ChatBot;
