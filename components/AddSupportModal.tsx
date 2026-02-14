import React, { useState, useMemo } from 'react';
import { Slot } from '../types';

interface AddSupportModalProps {
  slot: Slot;
  slots: Slot[];
  candidates: string[];
  onConfirm: (leader: string) => void;
  onClose: () => void;
}

const AddSupportModal: React.FC<AddSupportModalProps> = ({ slot, slots, candidates, onConfirm, onClose }) => {
  const [leader, setLeader] = useState<string>('');
  const [error, setError] = useState<string>('');

  const availabilityMap = useMemo(() => {
    const map = new Map<string, boolean>();
    candidates.forEach(name => {
      const eq = slots.find(
        s =>
          s.ministerName === name &&
          s.startTime === slot.startTime &&
          s.endTime === slot.endTime &&
          !s.isBooked
      );
      map.set(name, Boolean(eq));
    });
    return map;
  }, [candidates, slots, slot.startTime, slot.endTime]);

  const handleConfirm = () => {
    if (!leader) {
      setError('Selecciona un líder de apoyo disponible');
      return;
    }
    onConfirm(leader);
  };

  return (
    <div className="fixed inset-0 z-[110] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm" onClick={onClose}></div>
      <div className="bg-white w-full max-w-md rounded-2xl shadow-2xl relative animate-in fade-in zoom-in duration-200 border border-slate-200">
        <div className="p-6 border-b border-slate-100 flex justify-between items-center">
          <h3 className="text-xl font-bold text-slate-800">Agregar apoyo</h3>
          <button onClick={onClose} className="text-slate-400 hover:text-red-500 p-1 transition-colors">
            <i className="fas fa-times text-lg"></i>
          </button>
        </div>
        <div className="p-6 space-y-4">
          <div className="text-sm text-slate-700">
            Selecciona un líder con un espacio libre equivalente:
          </div>
          <select
            className="w-full px-3 py-2 rounded-lg border border-slate-200 text-sm bg-white"
            value={leader}
            onChange={e => setLeader(e.target.value)}
          >
            <option value="">Seleccionar líder de apoyo</option>
            {candidates.map(name => {
              const available = availabilityMap.get(name) === true;
              return (
                <option key={name} value={name} disabled={!available}>
                  {name}{!available ? ' — no disponible' : ''}
                </option>
              );
            })}
          </select>
          <div className="text-xs text-slate-500">
            Si aparece “no disponible”, primero crea un espacio con la misma fecha y hora para ese líder.
          </div>
          {error && <div className="text-red-700 text-sm">{error}</div>}
          <button
            onClick={handleConfirm}
            className="w-full bg-red-600 hover:bg-red-700 text-white font-bold py-3 rounded-lg text-sm transition-all"
          >
            Confirmar apoyo
          </button>
        </div>
      </div>
    </div>
  );
};

export default AddSupportModal;
