import React, { useMemo, useState } from 'react';
import { Slot, MINISTERS } from '../types';

interface FollowUpPanelProps {
  slots: Slot[];
  onUpdate: (slotId: string, patch: Partial<Slot>) => void;
  onPersist?: (slot: Slot) => Promise<void>;
}

const FollowUpPanel: React.FC<FollowUpPanelProps> = ({ slots, onUpdate, onPersist }) => {
  const [leader, setLeader] = useState<string>(MINISTERS[0]);
  const [saving, setSaving] = useState<Record<string, boolean>>({});
  const [open, setOpen] = useState(true);
  const [query, setQuery] = useState('');
  const STEPS = [
    'Paso 1',
    'Paso 2',
    'Paso 3 y 4',
    'Paso 5',
    'Paso 6 y 7',
    'Paso 8',
    'Paso 9',
    'Paso 10',
    'Paso 11',
    'Paso 12',
  ];
  const list = useMemo(
    () => slots
      .filter(s => s.ministerName === leader && s.isBooked)
      .filter(s => {
        const q = query.trim().toLowerCase();
        if (!q) return true;
        return (s.bookedBy ?? '').toLowerCase().includes(q) ||
               (s.reason ?? '').toLowerCase().includes(q) ||
               (s.followUpStep ?? '').toLowerCase().includes(q);
      })
      .sort((a, b) => new Date(a.startTime).getTime() - new Date(b.startTime).getTime()),
    [slots, leader, query]
  );

  const formatDateTime = (iso: string) =>
    new Date(iso).toLocaleString('es-ES', { day: '2-digit', month: '2-digit', hour: '2-digit', minute: '2-digit' });

  return (
    <div className="space-y-4">
      <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
        <div className="flex items-center gap-3">
          <label className="text-xs font-bold text-slate-600 uppercase">Líder</label>
          <select
            value={leader}
            onChange={(e) => setLeader(e.target.value)}
            className="px-3 py-2 rounded-lg border border-slate-200 text-sm bg-white"
          >
            {MINISTERS.map(m => (<option key={m} value={m}>{m}</option>))}
          </select>
        </div>
        <div className="flex items-center gap-2 w-full md:w-auto">
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Buscar por nombre, motivo o paso"
            className="flex-1 md:w-72 px-3 py-2 rounded-lg border border-slate-200 text-sm"
            type="text"
          />
          <button
            onClick={() => setOpen(o => !o)}
            className="px-4 py-2 rounded-lg text-sm font-bold bg-slate-900 text-white hover:bg-slate-800"
            type="button"
          >
            {open ? 'Ocultar' : 'Mostrar'}
          </button>
        </div>
      </div>

      {open && (
      <div className="overflow-x-auto">
        <table className="w-full text-left">
          <thead className="bg-slate-50 border-b border-slate-100">
            <tr>
              <th className="px-4 py-3 text-xs font-bold text-slate-500 uppercase tracking-wider">Fecha / Hora</th>
              <th className="px-4 py-3 text-xs font-bold text-slate-500 uppercase tracking-wider">Usuario / Motivo</th>
              <th className="px-4 py-3 text-xs font-bold text-slate-500 uppercase tracking-wider">Seguimiento</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {list.length === 0 ? (
              <tr>
                <td colSpan={3} className="px-4 py-8 text-center text-slate-400">No hay ministraciones reservadas para este líder.</td>
              </tr>
            ) : list.map(s => (
              <tr key={s.id} className="align-top">
                <td className="px-4 py-4">
                  <div className="font-bold text-slate-800">{formatDateTime(s.startTime)}</div>
                  <div className="text-xs text-slate-500">{s.ministerName}</div>
                </td>
                <td className="px-4 py-4">
                  <div className="font-bold text-slate-800">{s.bookedBy}</div>
                  <div className="text-xs text-slate-500">{s.reason}</div>
                </td>
                <td className="px-4 py-4">
                  <div className="grid grid-cols-1 md:grid-cols-4 gap-3 items-start">
                    <label className="inline-flex items-center gap-2 text-sm text-slate-700">
                      <input
                        type="checkbox"
                        checked={!!s.followUpDone}
                        onChange={(e) => onUpdate(s.id, { followUpDone: e.target.checked })}
                      />
                      Realizada
                    </label>
                    <div>
                      <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Ministración realizada</label>
                      <select
                        value={s.followUpStep ?? ''}
                        onChange={(e) => {
                          const value = e.target.value || undefined;
                          onUpdate(s.id, { followUpStep: value, followUpDone: value ? true : s.followUpDone });
                        }}
                        className="w-full px-3 py-2 rounded-lg border border-slate-300 text-sm bg-white"
                      >
                        <option value="">Seleccionar paso</option>
                        {STEPS.map(st => (<option key={st} value={st}>{st}</option>))}
                      </select>
                    </div>
                    <label className="inline-flex items-center gap-2 text-sm text-slate-700">
                      <input
                        type="checkbox"
                        checked={!!s.needsReinforcement}
                        onChange={(e) => onUpdate(s.id, { needsReinforcement: e.target.checked })}
                      />
                      Requiere refuerzo
                    </label>
                    <div className="flex items-center gap-2">
                      <button
                        disabled={!onPersist || saving[s.id] === true}
                        onClick={async () => {
                          if (!onPersist) return;
                          setSaving(prev => ({ ...prev, [s.id]: true }));
                          try {
                            await onPersist(s);
                          } finally {
                            setSaving(prev => ({ ...prev, [s.id]: false }));
                          }
                        }}
                        className={`px-4 py-2 rounded-lg text-sm font-bold transition-all ${
                          saving[s.id]
                            ? 'bg-slate-300 text-white cursor-not-allowed'
                            : 'bg-red-600 hover:bg-red-700 text-white'
                        }`}
                        title="Enviar a la hoja de cálculo"
                      >
                        {saving[s.id] ? 'Guardando...' : 'Aceptar'}
                      </button>
                    </div>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      )}
    </div>
  );
};

export default FollowUpPanel;
