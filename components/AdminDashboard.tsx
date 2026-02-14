
import React, { useMemo, useState } from 'react';
import { Slot, MINISTERS } from '../types';
import AddSupportModal from './AddSupportModal';

interface AdminDashboardProps {
  slots: Slot[];
  onAdd: (slot: Omit<Slot, 'id' | 'isBooked'>) => void;
  onDelete: (slotId: string) => void;
  onAddSupport?: (slotId: string, supportLeader: string) => boolean;
}

const AdminDashboard: React.FC<AdminDashboardProps> = ({ slots, onAdd, onDelete, onAddSupport }) => {
  const [showAddForm, setShowAddForm] = useState(false);
  const [newDate, setNewDate] = useState('');
  const [newTime, setNewTime] = useState('');
  const [newMinister, setNewMinister] = useState<string>(MINISTERS[0]);
  const [filterMinister, setFilterMinister] = useState<string>(MINISTERS[0]);
  const [error, setError] = useState<string>('');
  const [supportFor, setSupportFor] = useState<Slot | null>(null);

  const viewSlots = useMemo(
    () => slots
      .filter(s => s.ministerName === filterMinister)
      .sort((a, b) => new Date(a.startTime).getTime() - new Date(b.startTime).getTime()),
    [slots, filterMinister]
  );

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const start = new Date(`${newDate}T${newTime}`);
    const end = new Date(start.getTime() + 60 * 60 * 1000); 
    setError('');

    // Evitar solapamientos para el mismo líder
    const overlap = slots.some(s => 
      s.ministerName === newMinister &&
      new Date(s.startTime).getTime() < end.getTime() &&
      new Date(s.endTime).getTime() > start.getTime()
    );
    if (overlap) {
      setError('Ya existe un espacio asignado al mismo líder en ese horario.');
      return;
    }
    
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
          <div className="flex items-center gap-3">
            <label className="text-xs font-bold text-slate-600 uppercase">Líder</label>
            <select
              value={filterMinister}
              onChange={(e) => setFilterMinister(e.target.value)}
              className="px-3 py-2 rounded-lg border border-slate-200 text-sm bg-white"
            >
              {MINISTERS.map(m => (
                <option key={m} value={m}>{m}</option>
              ))}
            </select>
          </div>
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
                <label className="block text-xs font-bold text-red-800 uppercase mb-1">Líder</label>
                <select
                  required
                  value={newMinister}
                  onChange={e => setNewMinister(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg border border-slate-200 text-sm focus:ring-2 focus:ring-red-500 outline-none bg-white"
                >
                  {MINISTERS.map(m => (
                    <option key={m} value={m}>{m}</option>
                  ))}
                </select>
              </div>
              <div className="md:col-span-3">
                <button type="submit" className="w-full bg-red-600 text-white font-bold py-2.5 rounded-lg text-sm hover:bg-red-700 transition-all shadow-md uppercase tracking-wider">Habilitar Espacio</button>
              </div>
            </form>
            {error && (
              <div className="text-red-700 text-sm mt-3 font-semibold">
                {error}
              </div>
            )}
          </div>
        )}

        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-slate-50 border-b border-slate-100">
              <tr>
                <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Fecha / Hora</th>
                <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Líder</th>
                <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Usuario / Motivo</th>
                <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider text-right">Acciones</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {viewSlots.length === 0 ? (
                <tr>
                  <td colSpan={3} className="px-6 py-12 text-center text-slate-400 font-medium">No hay horarios registrados en el sistema.</td>
                </tr>
              ) : (
                viewSlots.map(slot => (
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
                      <div className="space-y-1">
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-bold bg-slate-100 text-slate-700">
                          {slot.ministerName}
                        </span>
                        {slot.supportLeader && (
                          <div className="text-xs text-slate-500">
                            Apoyo: <span className="font-semibold">{slot.supportLeader}</span>
                          </div>
                        )}
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
                    <td className="px-6 py-4 text-right space-x-2">
                      {slot.isBooked && !slot.supportLeader && onAddSupport && (
                        <button
                          onClick={() => setSupportFor(slot)}
                          className="inline-flex items-center px-3 py-1.5 rounded-md bg-slate-800 text-white text-xs font-bold hover:bg-slate-900"
                          title="Agregar apoyo"
                        >
                          <i className="fas fa-user-plus mr-2"></i> Apoyo
                        </button>
                      )}
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
      {supportFor && onAddSupport && (
        <AddSupportModal
          slot={supportFor}
          slots={slots}
          candidates={MINISTERS.filter(m => m !== supportFor.ministerName)}
          onConfirm={(leader) => {
            const ok = onAddSupport(supportFor.id, leader);
            if (!ok) {
              setError('El líder seleccionado no tiene un espacio libre equivalente.');
            } else {
              setSupportFor(null);
            }
          }}
          onClose={() => setSupportFor(null)}
        />
      )}
      </div>
    </div>
  );
};

