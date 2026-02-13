
import React, { useState } from 'react';
import { Slot } from '../types';

interface AdminDashboardProps {
  slots: Slot[];
  onAdd: (slot: Omit<Slot, 'id' | 'isBooked'>) => void;
  onDelete: (slotId: string) => void;
}

const AdminDashboard: React.FC<AdminDashboardProps> = ({ slots, onAdd, onDelete }) => {
  const [showAddForm, setShowAddForm] = useState(false);
  const [newDate, setNewDate] = useState('');
  const [newTime, setNewTime] = useState('');
  const [newMinister, setNewMinister] = useState('Líder Conexión');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const start = new Date(`${newDate}T${newTime}`);
    const end = new Date(start.getTime() + 60 * 60 * 1000); 
    
    onAdd({
      startTime: start.toISOString(),
      endTime: end.toISOString(),
      ministerName: newMinister
    });
    
    setNewDate('');
    setNewTime('');
    setShowAddForm(false);
  };

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
        <div className="p-6 border-b border-slate-100 flex justify-between items-center bg-slate-50">
          <h2 className="text-xl font-bold text-slate-800">Control de Espacios</h2>
          <button 
            onClick={() => setShowAddForm(!showAddForm)}
            className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg text-sm font-bold flex items-center transition-all shadow-sm"
          >
            <i className={`fas ${showAddForm ? 'fa-times' : 'fa-plus'} mr-2`}></i>
            {showAddForm ? 'Cerrar' : 'Crear Horario'}
          </button>
        </div>

        {showAddForm && (
          <div className="p-6 bg-red-50/50 border-b border-red-100 animate-in slide-in-from-top duration-300">
            <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-xs font-bold text-red-800 uppercase mb-1">Fecha</label>
                <input required type="date" value={newDate} onChange={e => setNewDate(e.target.value)} className="w-full px-3 py-2 rounded-lg border border-slate-200 text-sm focus:ring-2 focus:ring-red-500 outline-none" />
              </div>
              <div>
                <label className="block text-xs font-bold text-red-800 uppercase mb-1">Hora Inicio</label>
                <input required type="time" value={newTime} onChange={e => setNewTime(e.target.value)} className="w-full px-3 py-2 rounded-lg border border-slate-200 text-sm focus:ring-2 focus:ring-red-500 outline-none" />
              </div>
              <div>
                <label className="block text-xs font-bold text-red-800 uppercase mb-1">Responsable</label>
                <input required type="text" value={newMinister} onChange={e => setNewMinister(e.target.value)} className="w-full px-3 py-2 rounded-lg border border-slate-200 text-sm focus:ring-2 focus:ring-red-500 outline-none" />
              </div>
              <div className="md:col-span-3">
                <button type="submit" className="w-full bg-red-600 text-white font-bold py-2.5 rounded-lg text-sm hover:bg-red-700 transition-all shadow-md uppercase tracking-wider">Habilitar Espacio</button>
              </div>
            </form>
          </div>
        )}

        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-slate-50 border-b border-slate-100">
              <tr>
                <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Fecha / Hora</th>
                <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Usuario / Motivo</th>
                <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider text-right">Acciones</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {slots.length === 0 ? (
                <tr>
                  <td colSpan={3} className="px-6 py-12 text-center text-slate-400 font-medium">No hay horarios registrados en el sistema.</td>
                </tr>
              ) : (
                slots.map(slot => (
                  <tr key={slot.id} className="hover:bg-slate-50/50 transition-colors">
                    <td className="px-6 py-4">
                      <div className="font-bold text-slate-800">
                        {new Date(slot.startTime).toLocaleDateString('es-ES', { day: '2-digit', month: '2-digit' })}
                      </div>
                      <div className="text-xs text-red-600 font-semibold">
                        {new Date(slot.startTime).toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit' })}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      {slot.isBooked ? (
                        <div className="max-w-[300px]">
                          <div className="font-bold text-slate-800">{slot.bookedBy}</div>
                          <div className="text-xs text-slate-500 truncate" title={slot.reason}>{slot.reason}</div>
                        </div>
                      ) : (
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-bold bg-green-100 text-green-700 uppercase">
                          Libre
                        </span>
                      )}
                    </td>
                    <td className="px-6 py-4 text-right">
                      <button 
                        onClick={() => onDelete(slot.id)}
                        className="text-slate-300 hover:text-red-600 p-2 transition-colors"
                      >
                        <i className="fas fa-trash-alt"></i>
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
