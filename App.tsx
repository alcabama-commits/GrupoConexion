
import React, { useState, useEffect, useCallback } from 'react';
import { Slot, AppMode } from './types';
import CalendarView from './components/CalendarView';
import Navbar from './components/Navbar';
import AdminDashboard from './components/AdminDashboard';
import { v4 as uuidv4 } from 'uuid';

// Updated for 2026 - Monday/Tuesday slots at 9:00 PM as initial baseline
const INITIAL_SLOTS: Slot[] = [
  { id: '1', startTime: new Date(2026, 0, 12, 21, 0).toISOString(), endTime: new Date(2026, 0, 12, 22, 0).toISOString(), isBooked: false, ministerName: 'Camilo y Diana' },
  { id: '2', startTime: new Date(2026, 0, 13, 21, 0).toISOString(), endTime: new Date(2026, 0, 13, 22, 0).toISOString(), isBooked: false, ministerName: 'Camilo y Diana' },
  { id: '3', startTime: new Date(2026, 0, 19, 21, 0).toISOString(), endTime: new Date(2026, 0, 19, 22, 0).toISOString(), isBooked: false, ministerName: 'Camilo y Diana' },
  { id: '4', startTime: new Date(2026, 0, 20, 21, 0).toISOString(), endTime: new Date(2026, 0, 20, 22, 0).toISOString(), isBooked: false, ministerName: 'Camilo y Diana' },
  { id: '5', startTime: new Date(2026, 0, 26, 21, 0).toISOString(), endTime: new Date(2026, 0, 26, 22, 0).toISOString(), isBooked: false, ministerName: 'Camilo y Diana' },
  { id: '6', startTime: new Date(2026, 0, 27, 21, 0).toISOString(), endTime: new Date(2026, 0, 27, 22, 0).toISOString(), isBooked: false, ministerName: 'Camilo y Diana' },
];

const App: React.FC = () => {
  const [slots, setSlots] = useState<Slot[]>([]);
  const [mode, setMode] = useState<AppMode>(AppMode.USER);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    const savedSlots = localStorage.getItem('conexion_camilo_diana_slots_2026');
    if (savedSlots) {
      setSlots(JSON.parse(savedSlots));
    } else {
      setSlots(INITIAL_SLOTS);
    }
    setIsLoaded(true);
  }, []);

  useEffect(() => {
    if (isLoaded) {
      localStorage.setItem('conexion_camilo_diana_slots_2026', JSON.stringify(slots));
    }
  }, [slots, isLoaded]);

  const handleBookSlot = useCallback((slotId: string, userName: string, reason: string) => {
    setSlots(prev => prev.map(slot => 
      slot.id === slotId 
        ? { ...slot, isBooked: true, bookedBy: userName, reason: reason } 
        : slot
    ));
  }, []);

  const handleAddSlot = useCallback((newSlot: Omit<Slot, 'id' | 'isBooked'>) => {
    const slot: Slot = {
      ...newSlot,
      id: uuidv4(),
      isBooked: false
    };
    setSlots(prev => [...prev, slot]);
  }, []);

  const handleDeleteSlot = useCallback((slotId: string) => {
    setSlots(prev => prev.filter(s => s.id !== slotId));
  }, []);

  return (
    <div className="min-h-screen bg-white flex flex-col">
      <Navbar mode={mode} setMode={setMode} />
      
      <main className="flex-grow container mx-auto px-4 py-12 max-w-4xl">
        <header className="mb-12 text-center animate-in fade-in slide-in-from-top duration-700">
          <div className="flex justify-center mb-6">
            <img 
              src="https://i.postimg.cc/63ny6hs7/Logo-G-conexion-2023PNG.png" 
              alt="Logo Conexión" 
              className="h-32 md:h-40 w-auto drop-shadow-xl hover:scale-105 transition-transform"
            />
          </div>
          <h1 className="text-4xl font-extrabold text-slate-900 tracking-tight">
            {mode === AppMode.USER ? 'Agenda de Ministración' : 'Panel Administrativo'}
          </h1>
          <div className="h-1 w-24 bg-red-600 mx-auto mt-6 rounded-full opacity-50"></div>
        </header>

        <div className="animate-in fade-in slide-in-from-bottom duration-700 delay-200">
          {mode === AppMode.USER ? (
            <div className="max-w-3xl mx-auto">
              {/* El banner informativo ha sido eliminado para permitir flexibilidad de horarios según se definan en el panel admin */}
              <CalendarView slots={slots} onBook={handleBookSlot} />
            </div>
          ) : (
            <AdminDashboard slots={slots} onAdd={handleAddSlot} onDelete={handleDeleteSlot} />
          )}
        </div>
      </main>

      <footer className="bg-slate-50 border-t border-slate-200 py-16 text-center text-slate-600">
        <div className="container mx-auto px-4">
          <img 
            src="https://i.postimg.cc/63ny6hs7/Logo-G-conexion-2023PNG.png" 
            alt="Logo Conexión" 
            className="h-20 mx-auto mb-6 opacity-40 hover:opacity-100 transition-all duration-300" 
          />
          <p className="font-bold text-lg text-slate-800">Grupo de Conexión Camilo y Diana</p>
          <p className="text-xs mt-3 tracking-[0.2em] font-medium uppercase opacity-50">2026</p>
        </div>
      </footer>
    </div>
  );
};

export default App;
