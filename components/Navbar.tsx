
import React from 'react';
import { AppMode } from '../types';

interface NavbarProps {
  mode: AppMode;
  setMode: (mode: AppMode) => void;
  onRequestAdmin?: () => void;
}

const Navbar: React.FC<NavbarProps> = ({ mode, setMode, onRequestAdmin }) => {
  return (
    <nav className="bg-white/80 backdrop-blur-md border-b border-slate-100 sticky top-0 z-50">
      <div className="container mx-auto px-4 py-3 flex justify-between items-center">
        <div className="flex items-center space-x-3 group cursor-pointer" onClick={() => window.scrollTo({top: 0, behavior: 'smooth'})}>
          <img 
            src="https://i.postimg.cc/63ny6hs7/Logo-G-conexion-2023PNG.png" 
            alt="Logo Conexión" 
            className="h-12 w-auto transition-transform group-hover:scale-110" 
          />
        </div>
        
        <div className="flex bg-slate-100/80 rounded-full p-1 border border-slate-200 shadow-inner">
          <button 
            onClick={() => setMode(AppMode.USER)}
            className={`px-6 py-2 rounded-full text-xs font-black transition-all uppercase tracking-widest ${mode === AppMode.USER ? 'bg-red-600 text-white shadow-lg scale-105' : 'text-slate-500 hover:text-red-600'}`}
          >
            Reservar
          </button>
          <button 
            onClick={() => {
              if (onRequestAdmin) {
                onRequestAdmin();
              } else {
                setMode(AppMode.ADMIN);
              }
            }}
            className={`px-6 py-2 rounded-full text-xs font-black transition-all uppercase tracking-widest ${mode === AppMode.ADMIN ? 'bg-red-600 text-white shadow-lg scale-105' : 'text-slate-500 hover:text-red-600'}`}
          >
            Admin
          </button>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
