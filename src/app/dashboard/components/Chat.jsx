'use client';
import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useUser } from '@clerk/nextjs';
import { PaperAirplaneIcon } from '@heroicons/react/24/outline';
import Navbar from './navbar';

export default function Chat() {
  const { user } = useUser();
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [selectedChat, setSelectedChat] = useState(null);
  const messagesEndRef = useRef(null);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [chats, setChats] = useState([
    { id: 1, name: 'Project Team', type: 'group', lastMessage: 'Let\'s discuss the new features', unread: 2 },
    { id: 2, name: 'John Doe', type: 'direct', lastMessage: 'Can you review my PR?', unread: 0 },
    { id: 3, name: 'Sarah Smith', type: 'direct', lastMessage: 'Meeting at 3 PM', unread: 1 },
  ]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSendMessage = (e) => {
    e.preventDefault();
    if (!newMessage.trim()) return;

    const message = {
      id: Date.now(),
      content: newMessage,
      sender: user?.fullName || 'You',
      timestamp: new Date().toISOString(),
      isOwn: true,
    };

    setMessages([...messages, message]);
    setNewMessage('');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-200">
      <Navbar
        user={user}
        isSidebarOpen={isSidebarOpen}
        setIsSidebarOpen={setIsSidebarOpen}
      />
      <div className="flex h-[calc(100vh-4rem)] mt-16">
        {/* Chat List */}
        <div className="w-80 border-r bg-white shadow-md">
          <div className="p-4 border-b sticky top-0 bg-white z-10">
            <h2 className="text-lg font-semibold text-gray-800">Messages</h2>
          </div>
          <div className="overflow-y-auto h-[calc(100vh-8rem)] scrollbar-thin scrollbar-thumb-gray-300 hover:scrollbar-thumb-teal-400">
            {chats.map((chat) => (
              <motion.button
                key={chat.id}
                whileHover={{ scale: 1.01 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => setSelectedChat(chat)}
                className={`w-full p-4 border-b transition-colors duration-150 text-left ${
                  selectedChat?.id === chat.id ? 'bg-teal-100' : 'hover:bg-gray-100'
                }`}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 rounded-full bg-teal-200 flex items-center justify-center text-white font-bold text-lg shadow-inner">
                      {chat.name.charAt(0)}
                    </div>
                    <div>
                      <h3 className="font-medium text-gray-800">{chat.name}</h3>
                      <p className="text-sm text-gray-500 truncate w-40">{chat.lastMessage}</p>
                    </div>
                  </div>
                  {chat.unread > 0 && (
                    <span className="bg-teal-500 text-white text-xs px-2 py-1 rounded-full shadow-sm">
                      {chat.unread}
                    </span>
                  )}
                </div>
              </motion.button>
            ))}
          </div>
        </div>

        {/* Chat Area */}
        <div className="flex-1 flex flex-col bg-white shadow-inner">
          {selectedChat ? (
            <>
              {/* Chat Header */}
              <div className="p-4 border-b bg-white sticky top-0 z-10 shadow-sm">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 rounded-full bg-teal-200 flex items-center justify-center text-white font-bold text-lg">
                    {selectedChat.name.charAt(0)}
                  </div>
                  <div>
                    <h3 className="font-medium text-gray-800">{selectedChat.name}</h3>
                    <p className="text-sm text-gray-500">
                      {selectedChat.type === 'group' ? 'Group Chat' : 'Direct Message'}
                    </p>
                  </div>
                </div>
              </div>

              {/* Messages */}
              <div className="flex-1 overflow-y-auto p-6 space-y-4 scrollbar-thin scrollbar-thumb-gray-300 hover:scrollbar-thumb-teal-400 bg-gray-50">
                <AnimatePresence>
                  {messages.map((message) => (
                    <motion.div
                      key={message.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -20 }}
                      className={`flex ${message.isOwn ? 'justify-end' : 'justify-start'}`}
                    >
                      <div
                        className={`max-w-[70%] rounded-lg px-4 py-2 text-sm shadow-sm ${
                          message.isOwn
                            ? 'bg-teal-500 text-white'
                            : 'bg-white border text-gray-800'
                        }`}
                      >
                        <p>{message.content}</p>
                        <p className="text-xs mt-1 opacity-70 text-right">
                          {new Date(message.timestamp).toLocaleTimeString([], {
                            hour: '2-digit',
                            minute: '2-digit',
                          })}
                        </p>
                      </div>
                    </motion.div>
                  ))}
                </AnimatePresence>
                <div ref={messagesEndRef} />
              </div>

              {/* Message Input */}
              <form
                onSubmit={handleSendMessage}
                className="p-4 border-t bg-white sticky bottom-0 z-10"
              >
                <div className="flex items-center gap-2">
                  <input
                    type="text"
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    placeholder="Type a message..."
                    className="flex-1 p-2 border rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-teal-500 bg-gray-50"
                  />
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    type="submit"
                    className="p-2 bg-teal-500 text-white rounded-lg hover:bg-teal-600 transition-colors shadow"
                  >
                    <PaperAirplaneIcon className="h-5 w-5 transform rotate-45" />
                  </motion.button>
                </div>
              </form>
            </>
          ) : (
            <div className="flex-1 flex items-center justify-center text-gray-400 text-lg font-medium">
              Select a chat to start messaging
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
