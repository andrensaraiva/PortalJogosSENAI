import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Gamepad2, Anchor, Menu, UploadCloud, Joystick, Monitor } from 'lucide-react';
import { useGames } from '../context/GameContext';

const Navbar: React.FC = () => {
  const location = useLocation();
  const { theme, toggleTheme } = useGames();
  const isSubmitPage = location.pathname === '/submit';

  return (
    <nav className="sticky top-0 z-50 glass-panel border-b border-white/5 shadow-lg shadow-black/20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          <div className="flex items-center gap-4">
            <Link to="/" className="flex items-center gap-3 group">
              <div className="relative p-2 bg-senai-blue/10 rounded-lg border border-senai-blue/20 group-hover:border-senai-blue/50 transition-colors">
                {theme === 'retro' ? (
                   <Joystick className="h-8 w-8 text-senai-blue" />
                ) : (
                   <Anchor className="h-8 w-8 text-senai-blue transition-transform group-hover:rotate-12" />
                )}
                {theme === 'porto' && <Gamepad2 className="h-4 w-4 text-white absolute bottom-1 right-1 drop-shadow-md" />}
              </div>
              <div className="flex flex-col">
                <span className="font-display font-bold text-xl text-white leading-none tracking-wide group-hover:text-senai-blue transition-colors">
                    {theme === 'retro' ? 'ARCADE ZONE' : 'PORTAL DE JOGOS'}
                </span>
                <span className="text-xs text-senai-blue/80 font-medium tracking-[0.2em] uppercase">SENAI Vitória</span>
              </div>
            </Link>

            {/* THEME TOGGLE BUTTON */}
            <button 
                onClick={toggleTheme}
                className="ml-4 p-2 rounded-md border border-gray-700 bg-black/20 hover:bg-senai-blue/20 hover:border-senai-blue text-gray-400 hover:text-white transition-all flex items-center gap-2 group/theme"
                title={theme === 'retro' ? "Mudar para Tema Porto" : "Mudar para Tema Retro"}
            >
                {theme === 'retro' ? (
                    <>
                        <Monitor size={16} />
                        <span className="text-[10px] font-bold uppercase hidden md:inline">MODO: 8-BIT</span>
                    </>
                ) : (
                    <>
                        <Joystick size={16} />
                        <span className="text-[10px] font-bold uppercase hidden md:inline">MODO: PORTO</span>
                    </>
                )}
            </button>
          </div>
          
          <div className="hidden md:flex items-center gap-6">
            <div className="flex items-baseline space-x-2">
              <Link to="/" className="text-gray-300 hover:text-white hover:text-glow px-3 py-2 rounded-md text-sm font-semibold transition-all">
                INÍCIO
              </Link>
              <Link to="/projects" className="text-gray-300 hover:text-white hover:text-glow px-3 py-2 rounded-md text-sm font-semibold transition-all">
                PROJETOS
              </Link>
              <Link to="/about" className="text-gray-300 hover:text-white hover:text-glow px-3 py-2 rounded-md text-sm font-semibold transition-all">
                SOBRE O CURSO
              </Link>
            </div>

            {!isSubmitPage && (
              <Link 
                to="/submit" 
                className="flex items-center gap-2 bg-senai-blue/10 hover:bg-senai-blue/20 text-senai-blue hover:text-white border border-senai-blue/50 px-4 py-2 rounded-lg transition-all shadow-[0_0_10px_rgba(0,169,255,0.1)] hover:shadow-[0_0_20px_rgba(0,169,255,0.3)] font-bold text-sm uppercase tracking-wider"
              >
                <UploadCloud size={16} />
                {theme === 'retro' ? 'INSERT COIN' : 'Enviar Jogo'}
              </Link>
            )}
          </div>

          <div className="md:hidden">
            <button className="text-gray-400 hover:text-white p-2">
              <Menu className="h-8 w-8" />
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;