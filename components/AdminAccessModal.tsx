import React, { useState, useEffect } from 'react';

interface AdminAccessModalProps {
  isOpen: boolean;
  onSuccess: () => void;
  onClose: () => void;
}

const ACCESS_CODE_HASH =
  '9f2d45d63cc00693f3c71eaf0f4d9a14a4e37d2f3d9d2a6f6b2c0b9d1c0a7b5e'; // sha256 of "CONEXION2026"

async function sha256(text: string): Promise<string> {
  const enc = new TextEncoder().encode(text);
  const hashBuffer = await crypto.subtle.digest('SHA-256', enc);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
}

const AdminAccessModal: React.FC<AdminAccessModalProps> = ({ isOpen, onSuccess, onClose }) => {
  const [code, setCode] = useState('');
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (!isOpen) {
      setCode('');
      setError('');
      setSubmitting(false);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setError('');
    try {
      const hash = await sha256(code.trim());
      const ok = hash === ACCESS_CODE_HASH;
      if (ok) {
        sessionStorage.setItem('adminAuthorized', 'true');
        onSuccess();
      } else {
        setError('Código incorrecto');
      }
    } catch {
      setError('Error validando el código');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-sm">
        <div className="p-6 border-b border-slate-200">
          <h2 className="text-lg font-extrabold text-slate-900 tracking-tight">Acceso Administrador</h2>
          <p className="text-xs text-slate-500 mt-1">Ingresa el código para continuar</p>
        </div>
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <input
            type="password"
            value={code}
            onChange={(e) => setCode(e.target.value)}
            placeholder="Código de acceso"
            className="w-full px-4 py-3 rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-red-600"
            autoFocus
          />
          {error && <p className="text-red-600 text-sm">{error}</p>}
          <div className="flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-md text-slate-600 hover:text-slate-800"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={submitting || code.trim().length === 0}
              className="px-5 py-2 rounded-md bg-red-600 text-white font-bold disabled:opacity-50"
            >
              Entrar
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AdminAccessModal;

