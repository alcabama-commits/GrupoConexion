
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
  onPersistFollowUp?: (slot: Slot) => Promise<void>;
}

const AdminDashboard: React.FC<AdminDashboardProps> = ({ slots, onAdd, onDelete, onAddSupport, onUpdateFollowUp, onPersistFollowUp }) => {
  const [filterMinister, setFilterMinister] = useState<string>(MINISTERS[0]);
  const [error, setError] = useState<string>('');
  const [supportFor, setSupportFor] = useState<Slot | null>(null);
  const [showAddManyForm, setShowAddManyForm] = useState(false);
  const [batchLeader, setBatchLeader] = useState<string>(MINISTERS[0]);
  const [batch, setBatch] = useState<Array<{ date: string; time: string }>>([
    { date: '', time: '' },
  ]);
  const [tab, setTab] = useState<'control' | 'seguimiento'>('control');
  const [showFilters, setShowFilters] = useState(false);
  const [search, setSearch] = useState('');
  const [status, setStatus] = useState<'todos' | 'libres' | 'reservados'>('todos');
  const [support, setSupport] = useState<'cualquiera' | 'con' | 'sin'>('cualquiera');
  const [groupByDay, setGroupByDay] = useState(false);

  const viewSlots = useMemo(() => {
    const base = slots
      .filter(s => s.ministerName === filterMinister)
      .filter(s => {
        if (status === 'libres') return !s.isBooked;
        if (status === 'reservados') return s.isBooked;
        return true;
      })
      .filter(s => {
        if (support === 'con') return !!s.supportLeader;
        if (support === 'sin') return !s.supportLeader;
        return true;
      })
      .filter(s => {
        const q = search.trim().toLowerCase();
        if (!q) return true;
        const u = (s.bookedBy ?? '').toLowerCase();
        const r = (s.reason ?? '').toLowerCase();
        const m = (s.ministerName ?? '').toLowerCase();
        return u.includes(q) || r.includes(q) || m.includes(q);
      })
      .sort((a, b) => new Date(a.startTime).getTime() - new Date(b.startTime).getTime());
    return base;
  }, [slots, filterMinister, status, support, search]);

  const isSupportBooking = (s: Slot) => {
    const reasonTag = (s.reason ?? '').toLowerCase().trim();
    const byTag = (s.bookedBy ?? '').toLowerCase().trim();
    return reasonTag === 'apoyo' || byTag.startsWith('apoyo');
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

        {tab === 'control' && (
          <div className="px-6 py-4 border-b border-slate-100 bg-white">
            <div className="flex flex-col md:flex-row md:items-center gap-3">
              <button
                type="button"
                onClick={() => setShowFilters(v => !v)}
                className="px-4 py-2 rounded-lg text-sm font-bold bg-slate-900 text-white hover:bg-slate-800 w-full md:w-auto"
              >
                {showFilters ? 'Ocultar filtros' : 'Mostrar filtros'}
              </button>
              <div className="flex-1">
                <input
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="Buscar por usuario, motivo o líder"
                  className="w-full px-3 py-2 rounded-lg border border-slate-200 text-sm"
                />
              </div>
            </div>
            {showFilters && (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mt-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Estado</label>
                  <select
                    value={status}
                    onChange={(e) => setStatus(e.target.value as any)}
                    className="w-full px-3 py-2 rounded-lg border border-slate-300 text-sm bg-white"
                  >
                    <option value="todos">Todos</option>
                    <option value="libres">Libres</option>
                    <option value="reservados">Reservados</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Apoyo</label>
                  <select
                    value={support}
                    onChange={(e) => setSupport(e.target.value as any)}
                    className="w-full px-3 py-2 rounded-lg border border-slate-300 text-sm bg-white"
                  >
                    <option value="cualquiera">Cualquiera</option>
                    <option value="con">Con apoyo</option>
                    <option value="sin">Sin apoyo</option>
                  </select>
                </div>
                <label className="flex items-center gap-2 text-sm mt-6 md:mt-0">
                  <input
                    type="checkbox"
                    checked={groupByDay}
                    onChange={(e) => setGroupByDay(e.target.checked)}
                  />
                  Agrupar por día
                </label>
              </div>
            )}
          </div>
        )}

        {tab === 'seguimiento' && (
          <div className="p-6">
            <FollowUpPanel
              slots={slots}
              onUpdate={(id, patch) => onUpdateFollowUp && onUpdateFollowUp(id, patch)}
              onPersist={onPersistFollowUp}
            />
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
                (() => {
                  if (!groupByDay) {
                    return viewSlots.map(slot => (
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
                    ));
                  }
                  const groups: Record<string, Slot[]> = {};
                  for (const s of viewSlots) {
                    const key = new Date(s.startTime).toLocaleDateString('es-ES', { day: '2-digit', month: '2-digit' });
                    (groups[key] ||= []).push(s);
                  }
                  const keys = Object.keys(groups);
                  return keys.flatMap(k => {
                    const rows: JSX.Element[] = [
                      <tr key={`g-${k}`} className="bg-slate-50">
                        <td colSpan={4} className="px-6 py-2 text-xs font-bold text-slate-600 uppercase tracking-wider">{k}</td>
                      </tr>
                    ];
                    rows.push(...groups[k].map(slot => (
                      <tr key={slot.id} className="hover:bg-slate-50/50 transition-colors">
                        <td className="px-6 py-4">
                          <div className="font-bold text-slate-800">
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
                    )));
                    return rows;
                  });
                })()
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
