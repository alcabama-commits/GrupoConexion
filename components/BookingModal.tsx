
import React, { useState } from 'react';
import { Slot } from '../types';

interface BookingModalProps {
  slot: Slot;
  onClose: () => void;
  onConfirm: (name: string, reason: string) => void;
}

const BookingModal: React.FC<BookingModalProps> = ({ slot, onClose, onConfirm }) => {
  const [name, setName] = useState('');
  const [reason, setReason] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (name.trim() && reason.trim()) {
      onConfirm(name, reason);
    }
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm" onClick={onClose}></div>
      <div className="bg-white w-full max-w-md rounded-2xl shadow-2xl relative animate-in fade-in zoom-in duration-200 border border-slate-200">
        <div className="p-6 border-b border-slate-100 flex justify-between items-center">
          <h3 className="text-xl font-bold text-slate-800">Separar mi espacio</h3>
          <button onClick={onClose} className="text-slate-400 hover:text-red-500 p-1 transition-colors">
            <i className="fas fa-times text-lg"></i>
          </button>
        </div>
        
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div className="bg-red-50 p-4 rounded-xl border border-red-100 mb-6">
            <div className="flex items-center text-red-700 mb-1">
              <i className="fas fa-calendar-check mr-2"></i>
              <span className="font-bold text-sm uppercase tracking-wide">Fecha Seleccionada</span>
            </div>
            <p className="text-sm text-red-900/80 font-medium capitalize">
              {new Date(slot.startTime).toLocaleString('es-ES', { 
                weekday: 'long', day: 'numeric', month: 'long', 
                hour: '2-digit', minute: '2-digit' 
              })}
            </p>
          </div>

          <div>
            <label className="block text-sm font-bold text-slate-700 mb-1">Nombre Completo</label>
            <input 
              type="text" 
              required
              autoFocus
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-red-500 focus:border-red-500 outline-none transition-all bg-slate-50"
              placeholder="Escribe tu nombre..."
            />
          </div>

          <div>
            <label className="block text-sm font-bold text-slate-700 mb-1">Propósito de la cita</label>
            <textarea 
              required
              rows={3}
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-red-500 focus:border-red-500 outline-none transition-all resize-none bg-slate-50"
              placeholder="Ayúdanos a saber ¿por qué consideras que necesitas una cita? Aporta todos los detalles que puedas"
            ></textarea>
          </div>

          <button 
            type="submit"
            className="w-full bg-red-600 hover:bg-red-700 text-white font-bold py-4 rounded-xl shadow-lg transition-all active:scale-[0.98] mt-2 uppercase tracking-widest text-sm"
          >
            Confirmar Ministración
          </button>
        </form>
      </div>
    </div>
  );
};

export default BookingModal;
