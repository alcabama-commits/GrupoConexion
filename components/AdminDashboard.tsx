
import React, { useMemo, useState } from 'react';
import { Slot, MINISTERS } from '../types';
import AddSupportModal from './AddSupportModal';
import FollowUpPanel from './FollowUpPanel';

interface AdminDashboardProps {
  slots: Slot[];
  onAdd: (slot: Omit<Slot, 'id' | 'isBooked'>) => void;
  onDelete: (slotId: string) => void;
  onAddSupport?: (slotId: string, supportLeader: string) => boolean;
  onUpdateFollowUp?: (slotId: string, patch: Partial<Slot>) => void;
}

const AdminDashboard: React.FC<AdminDashboardProps> = ({ slots, onAdd, onDelete, onAddSupport, onUpdateFollowUp }) => {
  const [showAddForm, setShowAddForm] = useState(false);
  const [newDate, setNewDate] = useState('');
  const [newTime, setNewTime] = useState('');
  const [newMinister, setNewMinister] = useState<string>(MINISTERS[0]);
  const [filterMinister, setFilterMinister] = useState<string>(MINISTERS[0]);
  const [error, setError] = useState<string>('');
  const [supportFor, setSupportFor] = useState<Slot | null>(null);
  const [showAddManyForm, setShowAddManyForm] = useState(false);
  const [batchLeader, setBatchLeader] = useState<string>(MINISTERS[0]);
  const [batch, setBatch] = useState<Array<{ date: string; time: string }>>([
    { date: '', time: '' },
  ]);
  const [tab, setTab] = useState<'control' | 'seguimiento'>('control');

  const viewSlots = useMemo(
    () => slots
      .filter(s => s.ministerName === filterMinister)
      .sort((a, b) => new Date(a.startTime).getTime() - new Date(b.startTime).getTime()),
    [slots, filterMinister]
  );

  const isSupportBooking = (s: Slot) => {
    const reasonTag = (s.reason ?? '').toLowerCase().trim();
    const byTag = (s.bookedBy ?? '').toLowerCase().trim();
    return reasonTag === 'apoyo' || byTag.startsWith('apoyo');
  };

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
        <div className="p-6 border-b border-slate-100 bg-slate-50">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-center gap-2">
              <h2 className="text-xl font-bold text-slate-800">Panel</h2>
              <div className="ml-4 bg-white rounded-lg border border-slate-200 p-1 text-xs font-bold">
                <button
                  className={`px-3 py-1 rounded ${tab === 'control' ? 'bg-red-600 text-white' : 'text-slate-700'}`}
                  onClick={() => setTab('control')}
                  type="button"
                >
                  Control
                </button>
                <button
                  className={`px-3 py-1 rounded ${tab === 'seguimiento' ? 'bg-red-600 text-white' : 'text-slate-700'}`}
                  onClick={() => setTab('seguimiento')}
                  type="button"
                >
                  Seguimiento
                </button>
              </div>
            </div>
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
              className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg text-sm font-bold flex items-center transition-all shadow-sm w-full sm:w-auto"
            >
              <i className={`fas ${showAddForm ? 'fa-times' : 'fa-plus'} mr-2`}></i>
              {showAddForm ? 'Cerrar' : 'Crear Horario'}
            </button>
            <button 
              onClick={() => {
                setShowAddManyForm(!showAddManyForm);
                setBatchLeader(filterMinister);
              }}
              className="bg-slate-900 hover:bg-slate-800 text-white px-4 py-2 rounded-lg text-sm font-bold flex items-center transition-all shadow-sm w-full sm:w-auto"
            >
              <i className={`fas ${showAddManyForm ? 'fa-times' : 'fa-layer-group'} mr-2`}></i>
              {showAddManyForm ? 'Cerrar' : 'Crear Múltiples'}
            </button>
          </div>
        </div>

        {tab === 'seguimiento' && (
          <div className="p-6">
            <FollowUpPanel
              slots={slots}
              onUpdate={(id, patch) => onUpdateFollowUp && onUpdateFollowUp(id, patch)}
            />
          </div>
        )}

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

        {showAddManyForm && (
          <div className="p-6 bg-slate-50 border-b border-slate-200 animate-in slide-in-from-top duration-300">
            <form
              onSubmit={async (e) => {
                e.preventDefault();
                setError('');
                let created = 0;
                const used: Array<{ start: number; end: number }> = [];
                for (const item of batch) {
                  if (!item.date || !item.time) continue;
                  const start = new Date(`${item.date}T${item.time}`);
                  const end = new Date(start.getTime() + 60 * 60 * 1000);
                  const overlapExisting = slots.some(s =>
                    s.ministerName === batchLeader &&
                    new Date(s.startTime).getTime() < end.getTime() &&
                    new Date(s.endTime).getTime() > start.getTime()
                  );
                  const overlapBatch = used.some(u => u.start < end.getTime() && u.end > start.getTime());
                  if (overlapExisting || overlapBatch) {
                    continue;
                  }
                  onAdd({
                    startTime: start.toISOString(),
                    endTime: end.toISOString(),
                    ministerName: batchLeader,
                  });
                  used.push({ start: start.getTime(), end: end.getTime() });
                  created++;
                }
                if (created === 0) {
                  setError('No se crearon horarios. Revisa solapes o datos incompletos.');
                }
                setBatch([{ date: '', time: '' }]);
                setShowAddManyForm(false);
              }}
              className="space-y-4"
            >
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-end">
                <div className="md:col-span-1">
                  <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Líder</label>
                  <select
                    value={batchLeader}
                    onChange={e => setBatchLeader(e.target.value)}
                    className="w-full px-3 py-2 rounded-lg border border-slate-300 text-sm bg-white"
                  >
                    {MINISTERS.map(m => (<option key={m} value={m}>{m}</option>))}
                  </select>
                </div>
                <div className="md:col-span-2 text-xs text-slate-500">
                  Ingresa varias fechas y horas; cada espacio dura 60 minutos. Se omitirán solapes del mismo líder.
                </div>
              </div>
              <div className="grid grid-cols-1 gap-3">
                {batch.map((row, idx) => (
                  <div key={idx} className="grid grid-cols-1 md:grid-cols-3 gap-3 items-end">
                    <div>
                      <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Fecha</label>
                      <input
                        required
                        type="date"
                        value={row.date}
                        onChange={e => {
                          const v = e.target.value;
                          setBatch(b => b.map((r, i) => i === idx ? { ...r, date: v } : r));
                        }}
                        className="w-full px-3 py-2 rounded-lg border border-slate-300 text-sm"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Hora</label>
                      <input
                        required
                        type="time"
                        value={row.time}
                        onChange={e => {
                          const v = e.target.value;
                          setBatch(b => b.map((r, i) => i === idx ? { ...r, time: v } : r));
                        }}
                        className="w-full px-3 py-2 rounded-lg border border-slate-300 text-sm"
                      />
                    </div>
                    <div className="flex gap-2">
                      <button
                        type="button"
                        onClick={() => setBatch(b => [...b, { date: '', time: '' }])}
                        className="flex-1 bg-slate-900 text-white font-bold py-2.5 rounded-lg text-sm hover:bg-slate-800 transition-all"
                      >
                        Añadir
                      </button>
                      <button
                        type="button"
                        onClick={() => setBatch(b => b.length > 1 ? b.filter((_, i) => i !== idx) : b)}
                        className="px-4 py-2 rounded-lg border border-slate-300 text-slate-600 text-sm hover:bg-slate-100"
                        disabled={batch.length <= 1}
                      >
                        Quitar
                      </button>
                    </div>
                  </div>
                ))}
              </div>
              <div className="md:col-span-4">
                <button type="submit" className="w-full bg-red-600 text-white font-bold py-2.5 rounded-lg text-sm hover:bg-red-700 transition-all shadow-md uppercase tracking-wider">
                  Crear horarios
                </button>
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
                      {slot.isBooked && !slot.supportLeader && onAddSupport && !isSupportBooking(slot) && (
                        <button
                          onClick={() => setSupportFor(slot)}
                          className="inline-flex items-center px-3 py-1.5 rounded-md bg-slate-800 text-white text-xs font-bold hover:bg-slate-900"
                          title="Agregar apoyo"
                        >
                          <i className="fas fa-user-plus mr-2"></i> Apoyo
                        </button>
                      )}
                      {slot.isBooked && isSupportBooking(slot) && (
                        <button
                          disabled
                          className="inline-flex items-center px-3 py-1.5 rounded-md bg-slate-300 text-white text-xs font-bold cursor-not-allowed"
                          title="Este espacio es de apoyo, no admite apoyo adicional"
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
export default AdminDashboard;

