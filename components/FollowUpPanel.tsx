import React, { useMemo, useState } from 'react';
import { Slot, MINISTERS } from '../types';

interface FollowUpPanelProps {
  slots: Slot[];
  onUpdate: (slotId: string, patch: Partial<Slot>) => void;
}

const FollowUpPanel: React.FC<FollowUpPanelProps> = ({ slots, onUpdate }) => {
  const [leader, setLeader] = useState<string>(MINISTERS[0]);
  const list = useMemo(
    () => slots
      .filter(s => s.ministerName === leader && s.isBooked)
      .sort((a, b) => new Date(a.startTime).getTime() - new Date(b.startTime).getTime()),
    [slots, leader]
  );

  const formatDateTime = (iso: string) =>
    new Date(iso).toLocaleString('es-ES', { day: '2-digit', month: '2-digit', hour: '2-digit', minute: '2-digit' });

  return (
    <div className="space-y-4">
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
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    <label className="inline-flex items-center gap-2 text-sm text-slate-700">
                      <input
                        type="checkbox"
                        checked={!!s.followUpDone}
                        onChange={(e) => onUpdate(s.id, { followUpDone: e.target.checked })}
                      />
                      Realizada
                    </label>
                    <label className="inline-flex items-center gap-2 text-sm text-slate-700">
                      <input
                        type="checkbox"
                        checked={!!s.needsReinforcement}
                        onChange={(e) => onUpdate(s.id, { needsReinforcement: e.target.checked })}
                      />
                      Requiere refuerzo
                    </label>
                    <label className="inline-flex items-center gap-2 text-sm text-slate-700">
                      <input
                        type="checkbox"
                        checked={!!s.taskAssigned}
                        onChange={(e) => onUpdate(s.id, { taskAssigned: e.target.checked })}
                      />
                      Se dejó tarea
                    </label>
                    <input
                      type="text"
                      placeholder="¿Cuál tarea?"
                      value={s.taskText ?? ''}
                      onChange={(e) => onUpdate(s.id, { taskText: e.target.value })}
                      className="px-3 py-2 rounded-lg border border-slate-300 text-sm"
                    />
                    <textarea
                      rows={2}
                      placeholder="Notas internas..."
                      value={s.followUpNotes ?? ''}
                      onChange={(e) => onUpdate(s.id, { followUpNotes: e.target.value })}
                      className="md:col-span-2 px-3 py-2 rounded-lg border border-slate-300 text-sm resize-y"
                    />
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default FollowUpPanel;

