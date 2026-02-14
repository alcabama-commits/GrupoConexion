
import React, { useMemo, useState } from 'react';
import { Slot, MINISTERS } from '../types';
import BookingModal from './BookingModal';

interface CalendarViewProps {
  slots: Slot[];
  onBook: (slotId: string, userName: string, reason: string) => void;
}

const CalendarView: React.FC<CalendarViewProps> = ({ slots, onBook }) => {
  const [selectedSlot, setSelectedSlot] = useState<Slot | null>(null);
  const [minister, setMinister] = useState<string>(MINISTERS[0]);

  const availableSlots = useMemo(() => {
    return slots
      .filter(s => !s.isBooked && s.ministerName === minister)
      .sort((a, b) => new Date(a.startTime).getTime() - new Date(b.startTime).getTime());
  }, [slots, minister]);

  const formatTime = (isoString: string) => {
    return new Date(isoString).toLocaleTimeString('es-ES', { 
      hour: '2-digit', 
      minute: '2-digit' 
    });
  };

  const formatDate = (isoString: string) => {
    return new Date(isoString).toLocaleDateString('es-ES', { 
      weekday: 'long', 
      day: 'numeric', 
      month: 'long' 
    });
  };

  return (
    <div className="bg-white rounded-3xl shadow-xl border border-slate-100 overflow-hidden">
      <div className="p-8 border-b border-slate-50 flex flex-col md:flex-row md:items-center md:justify-between gap-4 bg-white">
        <div>
          <h2 className="text-2xl font-black text-slate-900 tracking-tight">Espacios Libres</h2>
          <p className="text-slate-400 text-sm mt-1">Selecciona el horario que más te convenga.</p>
        </div>
        <div className="flex items-center gap-4">
          <select
            value={minister}
            onChange={(e) => setMinister(e.target.value)}
            className="px-3 py-2 rounded-lg border border-slate-200 text-sm bg-white"
            aria-label="Seleccionar ministro"
          >
            {MINISTERS.map(m => (
              <option key={m} value={m}>{m}</option>
            ))}
          </select>
          <span className="bg-red-600 text-white text-[10px] font-black px-4 py-1.5 rounded-full uppercase tracking-tighter shadow-md shadow-red-200">
            {availableSlots.length} Disponibles
          </span>
        </div>
      </div>

      <div className="p-8">
        {availableSlots.length === 0 ? (
          <div className="text-center py-16">
            <div className="bg-slate-50 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6">
              <i className="fas fa-heart-broken text-slate-200 text-3xl"></i>
            </div>
            <p className="text-slate-800 font-bold text-lg">No hay espacios por ahora.</p>
            <p className="text-slate-400 text-sm mt-2">Vuelve pronto o contacta a Camilo y Diana.</p>
          </div>
        ) : (
          <div className="grid gap-4">
            {availableSlots.map((slot) => (
              <div 
                key={slot.id} 
                className="group flex flex-col sm:flex-row items-center justify-between p-6 rounded-2xl border border-slate-100 hover:border-red-600 hover:shadow-2xl hover:shadow-red-50 transition-all duration-300 cursor-pointer bg-slate-50/50 hover:bg-white"
                onClick={() => setSelectedSlot(slot)}
              >
                <div className="flex items-center space-x-6 mb-4 sm:mb-0 w-full sm:w-auto">
                  <div className="bg-white w-14 h-14 rounded-2xl border border-slate-100 flex flex-col items-center justify-center shadow-sm group-hover:bg-red-600 transition-colors">
                    <span className="text-[10px] font-black text-red-600 group-hover:text-white uppercase leading-none mb-1">{new Date(slot.startTime).toLocaleString('es-ES', { month: 'short' })}</span>
                    <span className="text-2xl font-black text-slate-800 group-hover:text-white leading-none">{new Date(slot.startTime).getDate()}</span>
                  </div>
                  <div className="flex-grow">
                    <h3 className="font-black text-xl text-slate-900 flex items-center">
                      <i className="fas fa-clock text-red-600 mr-2 text-sm"></i>
                      {formatTime(slot.startTime)} - {formatTime(slot.endTime)}
                    </h3>
                    <p className="text-sm text-slate-500 font-medium capitalize mt-1">
                      {formatDate(slot.startTime)}
                    </p>
                    <p className="text-xs text-slate-500 mt-1">
                      Responsable: <span className="font-semibold">{slot.ministerName}</span>
                    </p>
                  </div>
                </div>
                <button 
                  className="w-full sm:w-auto px-8 py-3 bg-red-600 hover:bg-slate-900 text-white rounded-xl font-black text-sm transition-all shadow-lg active:scale-95 uppercase tracking-widest"
                >
                  Separar
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

      {selectedSlot && (
        <BookingModal 
          slot={selectedSlot} 
          onClose={() => setSelectedSlot(null)} 
          onConfirm={(name, reason) => {
            onBook(selectedSlot.id, name, reason);
            setSelectedSlot(null);
          }}
        />
      )}
    </div>
  );
};

export default CalendarView;
