
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Shield, Lock, Loader2 } from 'lucide-react';
import { useGames } from '../context/GameContext';

const AdminLogin: React.FC = () => {
  const [user, setUser] = useState('');
  const [pass, setPass] = useState('');
  const [error, setError] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const { loginAdmin } = useGames();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(false);
    setIsLoading(true);
    
    try {
      const success = await loginAdmin(user, pass);
      if (success) {
        navigate('/admin/dashboard');
      } else {
        setError(true);
      }
    } catch (err) {
      setError(true);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#050b14] flex items-center justify-center p-4">
      <div className="bg-[#0f172a] border border-red-900/30 p-8 rounded-lg max-w-sm w-full shadow-[0_0_50px_rgba(220,38,38,0.1)] relative overflow-hidden">
        
        {/* Decorative Scifi Elements */}
        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-red-600 to-transparent"></div>
        <div className="absolute -left-4 top-10 w-20 h-[1px] bg-red-600 rotate-45"></div>
        
        <div className="text-center mb-8 relative z-10">
          <div className="w-16 h-16 bg-red-900/20 rounded-full flex items-center justify-center mx-auto mb-4 border border-red-500/20">
             <Shield className="text-red-500" size={32} />
          </div>
          <h2 className="text-xl font-display font-bold text-white uppercase tracking-widest">Acesso Restrito</h2>
          <p className="text-red-400 text-xs font-mono mt-1">APENAS PESSOAL AUTORIZADO</p>
        </div>

        <form onSubmit={handleLogin} className="space-y-4 relative z-10">
          <div>
            <label className="block text-[10px] font-bold text-gray-500 uppercase mb-1">Credencial</label>
            <input 
              type="text" 
              value={user}
              onChange={(e) => setUser(e.target.value)}
              className="w-full bg-black/40 border border-gray-700 p-3 text-white text-sm focus:border-red-500 focus:outline-none transition-colors rounded"
              placeholder="Identificação"
            />
          </div>
          <div>
            <label className="block text-[10px] font-bold text-gray-500 uppercase mb-1">Chave de Segurança</label>
            <input 
              type="password" 
              value={pass}
              onChange={(e) => setPass(e.target.value)}
              className="w-full bg-black/40 border border-gray-700 p-3 text-white text-sm focus:border-red-500 focus:outline-none transition-colors rounded"
              placeholder="Senha"
            />
          </div>

          {error && (
            <div className="bg-red-500/10 border border-red-500/50 p-2 rounded flex items-center gap-2 text-red-400 text-xs">
               <Lock size={12} /> Acesso Negado. Credenciais inválidas.
            </div>
          )}

          <button 
            type="submit"
            disabled={isLoading}
            className="w-full bg-red-600 hover:bg-red-500 disabled:bg-red-800 disabled:cursor-not-allowed text-white font-bold uppercase py-3 rounded tracking-wider text-xs transition-colors shadow-lg shadow-red-900/20 flex items-center justify-center gap-2"
          >
            {isLoading ? (
              <>
                <Loader2 size={14} className="animate-spin" />
                Autenticando...
              </>
            ) : (
              'Autenticar'
            )}
          </button>
        </form>
      </div>
    </div>
  );
};

export default AdminLogin;
