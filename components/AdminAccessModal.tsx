import React, { useState, useEffect } from 'react';

interface AdminAccessModalProps {
  isOpen: boolean;
  onSuccess: () => void;
  onClose: () => void;
}

const ACCESS_CODE = 'CONEXION2026';

const AdminAccessModal: React.FC<AdminAccessModalProps> = ({ isOpen, onSuccess, onClose }) => {
  const [code, setCode] = useState('');
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [show, setShow] = useState(false);

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
      const ok = code.trim() === ACCESS_CODE;
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
          <div className="relative">
            <input
              type={show ? 'text' : 'password'}
              value={code}
              onChange={(e) => setCode(e.target.value)}
              placeholder="Código de acceso"
              className="w-full pr-12 px-4 py-3 rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-red-600"
              autoFocus
            />
            <button
              type="button"
              aria-label={show ? 'Ocultar código' : 'Mostrar código'}
              onClick={() => setShow(s => !s)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-700"
            >
              <i className={`fa-solid ${show ? 'fa-eye-slash' : 'fa-eye'}`}></i>
            </button>
          </div>
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
