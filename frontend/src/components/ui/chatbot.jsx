import React, { useState, useRef, useEffect } from 'react';
import { Send, MessageCircle, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { motion, AnimatePresence } from 'framer-motion'; // Animation library
import { TypeAnimation } from 'react-type-animation';  // Typing animation
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar"; //For User and bot avatars


const Chatbot = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [messages, setMessages] = useState([
        { text: "Hello! How can I assist you today?", sender: "bot" }
    ]);
    const [input, setInput] = useState('');
    const [loading, setLoading] = useState(false);
    const chatWindowRef = useRef(null); // Ref for scrolling

    useEffect(() => {
        if (chatWindowRef.current) {
            chatWindowRef.current.scrollTop = chatWindowRef.current.scrollHeight;
        }
    }, [messages]); // Scroll when messages change

    const sendMessage = async () => {
        if (!input.trim()) return;

        const userMessage = { text: input, sender: 'user' };
        setMessages((prev) => [...prev, userMessage]);
        setInput('');
        setLoading(true);

        try {
            const response = await fetch('http://127.0.0.1:5000/chat', { // Adjust the port if needed
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ message: input })
            });

            if (!response.ok) {
                throw new Error(`HTTP error! Status: ${response.status}, ${response.statusText}`);
            }

            const data = await response.json();
            const botResponse = { text: data.reply || "Sorry, I couldn't understand that.", sender: 'bot' };
            setMessages((prev) => [...prev, botResponse]);
        } catch (error) {
            console.error("Error connecting to chatbot:", error);
            setMessages((prev) => [...prev, { text: `Error: Unable to reach chatbot.  Please check your internet connection or try again later. ${error.message}`, sender: "bot" }]); //User-friendly error
        } finally {
            setLoading(false);
        }
    };

    const handleKeyDown = (e) => {
        if (e.key === 'Enter' && !e.shiftKey) { // Submit on Enter, but not Shift+Enter (newline)
            e.preventDefault();  // Prevent form submission/newline
            sendMessage();
        }
    };

    const chatbotVariants = {
        open: { scale: 1, opacity: 1, transition: { duration: 0.3, ease: "easeInOut" } },
        closed: { scale: 0, opacity: 0, transition: { duration: 0.2, ease: "easeInOut" } }
    };

    const messageVariants = {
        initial: { opacity: 0, y: 20 },
        animate: { opacity: 1, y: 0, transition: { duration: 0.3, ease: "easeInOut" } },
        exit: { opacity: 0, y: -20, transition: { duration: 0.2, ease: "easeInOut" } }
    };


    return (
        <div className="fixed bottom-5 right-5 z-50">  {/*Ensures it's on top of other content*/}
            {/* Chatbot Icon */}
            <AnimatePresence>
                {!isOpen && (
                    <motion.button
                        key="openButton"
                        onClick={() => setIsOpen(true)}
                        className="bg-blue-600 text-white p-3 rounded-full shadow-md hover:bg-blue-700 transition-colors duration-200"
                        aria-label="Open Chatbot"
                        initial={{ scale: 0, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        exit={{ scale: 0, opacity: 0 }}
                        transition={{ duration: 0.2 }}
                    >
                        <MessageCircle size={24} />
                    </motion.button>
                )}
            </AnimatePresence>

            {/* Chat Window */}
            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        key="chatWindow"
                        className="w-96 bg-white shadow-2xl rounded-2xl overflow-hidden border border-gray-200 dark:bg-gray-800 dark:border-gray-700"
                        variants={chatbotVariants}
                        initial="closed"
                        animate="open"
                        exit="closed"
                    >
                        <div className="flex justify-between items-center bg-gray-50 dark:bg-gray-700 border-b border-gray-200 dark:border-gray-700 p-4">
                            <h2 className="text-lg font-semibold text-gray-800 dark:text-gray-100">Job Seeker Assistant</h2>
                            <button onClick={() => setIsOpen(false)} className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300" aria-label="Close Chatbot">
                                <X size={20} />
                            </button>
                        </div>

                        <div className="h-96 overflow-y-auto p-3 flex flex-col space-y-2" ref={chatWindowRef}>
                            <AnimatePresence initial={false}>
                                {messages.map((msg, index) => (
                                    <motion.div
                                        key={index}
                                        className={`flex items-start space-x-3 py-2 ${msg.sender === 'user' ? 'self-end text-right' : 'text-left'}`}
                                        variants={messageVariants}
                                        initial="initial"
                                        animate="animate"
                                        exit="exit"
                                    >
                                        {msg.sender === 'bot' && (
                                            <Avatar className="w-8 h-8">
                                                <AvatarImage src="https://i.pravatar.cc/150?img=7" alt="Bot Avatar" /> {/*Replace with bot avatar*/}
                                                <AvatarFallback>AI</AvatarFallback>
                                            </Avatar>
                                        )}

                                        <div className={`text-sm rounded-xl p-3 w-fit max-w-[70%] break-words  ${msg.sender === 'user' ? 'bg-blue-100 dark:bg-blue-900 text-gray-800 dark:text-gray-200' : 'bg-gray-100 dark:bg-gray-900 text-gray-700 dark:text-gray-300'}`}>
                                            {msg.text}
                                        </div>

                                        {msg.sender === 'user' && (
                                            <Avatar className="w-8 h-8">
                                                <AvatarImage src="https://i.pravatar.cc/150?img=5" alt="User Avatar" /> {/*Replace with user avatar or profile image*/}
                                                <AvatarFallback>US</AvatarFallback>
                                            </Avatar>
                                        )}
                                    </motion.div>
                                ))}
                            </AnimatePresence>
                            {loading && (
                                <div className="text-gray-500 text-sm self-start flex items-center space-x-2">
                                    <Avatar className="w-8 h-8">
                                        <AvatarImage src="https://i.pravatar.cc/150?img=7" alt="Bot Avatar" /> {/*Replace with bot avatar*/}
                                        <AvatarFallback>AI</AvatarFallback>
                                    </Avatar>
                                    <span>
                                        <TypeAnimation
                                            sequence={['Thinking...', 1000]} // Types 'Thinking...' every 1s
                                            repeat={Infinity}
                                            wrapper="span"
                                            cursor={true}
                                        />
                                    </span>
                                </div>
                            )}
                        </div>

                        <form onSubmit={(e) => { e.preventDefault(); sendMessage(); }} className="p-3 border-t border-gray-200 dark:border-gray-700">
                            <div className="flex items-center space-x-2">
                                <input
                                    type="text"
                                    value={input}
                                    onChange={(e) => setInput(e.target.value)}
                                    onKeyDown={handleKeyDown}
                                    placeholder="Type a message..."
                                    className="flex-1 border border-gray-300 dark:border-gray-600 rounded-md p-2 outline-none text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-700"
                                    aria-label="Enter your message"
                                />
                                <Button type="submit" className="bg-blue-600 text-white p-2 rounded-md hover:bg-blue-700 transition-colors duration-200" aria-label="Send message">
                                    <Send size={16} />
                                </Button>
                            </div>
                        </form>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default Chatbot;