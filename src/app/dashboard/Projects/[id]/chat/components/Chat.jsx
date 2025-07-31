import { useState, useRef, useEffect } from 'react';

export default function Chat({ stoneId, user }) {
  const [messages, setMessages] = useState([
    { sender: 'Alice', text: 'Welcome to the stone chat!' },
    { sender: 'Bob', text: "Let's track our progress here." },
  ]);
  const [input, setInput] = useState('');
  const messagesEndRef = useRef(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSend = () => {
    if (!input.trim()) return;
    setMessages([
      ...messages,
      {
        sender: user?.fullName || 'You',
        text: input,
      },
    ]);
    setInput('');
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') handleSend();
  };

  return (
    <div className="flex flex-col h-[70vh] bg-white rounded-xl shadow-lg p-4">
      <div className="flex-shrink-0 mb-2 text-lg font-semibold text-teal-700">Stone Chat: {stoneId}</div>
      <div className="flex-1 overflow-y-auto space-y-3 px-1 py-2 border rounded bg-gray-50">
        {messages.map((msg, idx) => (
          <div key={idx} className={`flex ${msg.sender === (user?.fullName || 'You') ? 'justify-end' : 'justify-start'}`}>
            <div className={`max-w-xs px-4 py-2 rounded-lg shadow text-sm ${msg.sender === (user?.fullName || 'You') ? 'bg-teal-500 text-white' : 'bg-gray-200 text-gray-800'}`}>
              <span className="block font-bold mb-1">{msg.sender}</span>
              <span>{msg.text}</span>
            </div>
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>
      <div className="mt-4 flex gap-2">
        <input
          type="text"
          className="flex-1 border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-teal-400"
          placeholder="Type your message..."
          value={input}
          onChange={e => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
        />
        <button
          onClick={handleSend}
          className="px-4 py-2 bg-teal-600 text-white rounded hover:bg-teal-700 transition"
        >
          Send
        </button>
      </div>
    </div>
  );
}
