
import React, { useState, useEffect, useCallback } from 'react';
import { Slot, AppMode } from './types';
import CalendarView from './components/CalendarView';
import Navbar from './components/Navbar';
import AdminDashboard from './components/AdminDashboard';
import { v4 as uuidv4 } from 'uuid';
import AdminAccessModal from './components/AdminAccessModal';
import { api } from './api';

const App: React.FC = () => {
  const [slots, setSlots] = useState<Slot[]>([]);
  const [mode, setMode] = useState<AppMode>(AppMode.USER);
  const [isLoading, setIsLoading] = useState(false);
  const [showAccess, setShowAccess] = useState(false);

  const loadSlots = useCallback(async () => {
    setIsLoading(true);
    const data = await api.getSlots();
    setSlots(data);
    setIsLoading(false);
  }, []);

  useEffect(() => {
    loadSlots();
  }, []);

  const handleBookSlot = useCallback(async (slotId: string, userName: string, reason: string) => {
    // Actualización optimista para respuesta inmediata en la UI
    setSlots(prev => prev.map(slot => 
      slot.id === slotId 
        ? { ...slot, isBooked: true, bookedBy: userName, reason: reason } 
        : slot
    ));
    await api.bookSlot(slotId, userName, reason);
    await loadSlots(); // Recargar para confirmar datos del servidor
  }, [loadSlots]);

  const handleAddSlot = useCallback(async (newSlot: Omit<Slot, 'id' | 'isBooked'>) => {
    const slot: Slot = {
      ...newSlot,
      id: uuidv4(),
      isBooked: false
    };
    
    // Actualización optimista
    setSlots(prev => [...prev, slot]);
    
    await api.addSlot(slot);
    await loadSlots();
  }, [loadSlots]);

  const handleDeleteSlot = useCallback(async (slotId: string) => {
    // Actualización optimista
    setSlots(prev => prev.filter(s => s.id !== slotId));
    
    await api.deleteSlot(slotId);
    await loadSlots();
  }, [loadSlots]);

  const handleRequestAdmin = useCallback(() => {
    const ok = sessionStorage.getItem('adminAuthorized') === 'true';
    if (ok) {
      setMode(AppMode.ADMIN);
    } else {
      setShowAccess(true);
    }
  }, []);

  return (
    <div className="min-h-screen bg-white flex flex-col">
      <Navbar mode={mode} setMode={setMode} onRequestAdmin={handleRequestAdmin} />
      
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
          {isLoading ? (
            <div className="text-center py-12">
              <i className="fas fa-circle-notch fa-spin text-red-600 text-3xl"></i>
              <p className="mt-4 text-slate-500">Cargando disponibilidad...</p>
            </div>
          ) : mode === AppMode.USER ? (
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
      <AdminAccessModal
        isOpen={showAccess}
        onSuccess={() => {
          setShowAccess(false);
          setMode(AppMode.ADMIN);
        }}
        onClose={() => setShowAccess(false)}
      />
    </div>
  );
};

export default App;
