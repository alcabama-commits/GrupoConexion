
import React, { useState, useRef, useEffect } from 'react';
import { Slot, ChatMessage } from '../types';
import { getGeminiResponse } from '../services/geminiService';

interface ChatAssistantProps {
  availableSlots: Slot[];
  onBook: (slotId: string, userName: string, reason: string) => void;
}

const ChatAssistant: React.FC<ChatAssistantProps> = ({ availableSlots, onBook }) => {
  const [messages, setMessages] = useState<ChatMessage[]>([
    { role: 'model', content: '¡Hola! Soy el asistente del Grupo Conexión. ¿Te ayudo a buscar un espacio para tu ministración este lunes o martes?' }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isLoading) return;

    const userMsg = input;
    setInput('');
    setMessages(prev => [...prev, { role: 'user', content: userMsg }]);
    setIsLoading(true);

    const response = await getGeminiResponse(userMsg, availableSlots);
    
    setMessages(prev => [...prev, { role: 'model', content: response || 'Lo siento, hubo un error.' }]);
    setIsLoading(false);
  };

  return (
    <div className="bg-white text-slate-800 rounded-2xl shadow-xl flex flex-col h-[600px] border border-slate-200 overflow-hidden">
      <div className="p-4 bg-red-700 text-white flex items-center space-x-3">
        <div className="w-10 h-10 bg-white p-1 rounded-full flex items-center justify-center">
          <img src="https://i.postimg.cc/657ybw3F/Logo-G-conexion-2023.png" alt="C" className="h-6" />
        </div>
        <div>
          <h3 className="font-bold text-sm">Asistente Conexión</h3>
          <div className="flex items-center text-[10px] text-red-100">
            <span className="w-2 h-2 bg-green-400 rounded-full mr-1.5 animate-pulse"></span>
            Activo ahora
          </div>
        </div>
      </div>

      <div ref={scrollRef} className="flex-grow overflow-y-auto p-4 space-y-4 bg-slate-50">
        {messages.map((msg, idx) => (
          <div key={idx} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
            <div className={`max-w-[85%] p-3 rounded-2xl text-sm shadow-sm ${
              msg.role === 'user' 
                ? 'bg-red-600 text-white rounded-tr-none' 
                : 'bg-white border border-slate-200 rounded-tl-none text-slate-700'
            }`}>
              {msg.content}
            </div>
          </div>
        ))}
        {isLoading && (
          <div className="flex justify-start">
            <div className="bg-white border border-slate-200 p-3 rounded-2xl rounded-tl-none">
              <div className="flex space-x-1.5">
                <div className="w-1.5 h-1.5 bg-red-400 rounded-full animate-bounce"></div>
                <div className="w-1.5 h-1.5 bg-red-400 rounded-full animate-bounce delay-100"></div>
                <div className="w-1.5 h-1.5 bg-red-400 rounded-full animate-bounce delay-200"></div>
              </div>
            </div>
          </div>
        )}
      </div>

      <form onSubmit={handleSend} className="p-4 bg-white border-t border-slate-200">
        <div className="relative">
          <input 
            type="text" 
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="¿Qué horarios hay el lunes?..."
            className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 pr-12 text-sm focus:outline-none focus:ring-2 focus:ring-red-500 transition-all shadow-inner"
          />
          <button 
            type="submit"
            disabled={isLoading || !input.trim()}
            className="absolute right-2 top-1/2 -translate-y-1/2 text-red-600 hover:text-red-700 disabled:opacity-30 p-2 transition-colors"
          >
            <i className="fas fa-paper-plane text-lg"></i>
          </button>
        </div>
      </form>
    </div>
  );
};

export default ChatAssistant;
