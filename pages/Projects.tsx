import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Search, Filter, Box, Play, Users, FolderOpen } from 'lucide-react';
import { useGames } from '../context/GameContext';
import { COHORTS } from '../constants';

const Projects: React.FC = () => {
  const { games } = useGames();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCohort, setSelectedCohort] = useState<string>('all');

  // Filter Logic
  const filteredGames = games.filter(game => {
    const matchesSearch = game.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          game.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()));
    const matchesCohort = selectedCohort === 'all' || game.cohortId === selectedCohort;
    
    return matchesSearch && matchesCohort;
  });

  return (
    <div className="min-h-screen bg-[#050b14] font-sans pb-20">
      
      {/* HEADER: WAREHOUSE MANIFEST */}
      <div className="bg-[#0f172a] border-b border-gray-800 pt-12 pb-8">
        <div className="max-w-7xl mx-auto px-4">
           <h1 className="text-4xl font-display font-bold text-white uppercase tracking-widest mb-2 flex items-center gap-3">
              <FolderOpen className="text-senai-blue" size={40} />
              Arquivo Geral
           </h1>
           <p className="text-gray-400 font-mono text-sm">
              Base de dados completa de projetos desenvolvidos.
           </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-8 grid grid-cols-1 lg:grid-cols-4 gap-8">
        
        {/* SIDEBAR: CONTROLS */}
        <aside className="lg:col-span-1 space-y-8">
           
           {/* Search Box */}
           <div className="bg-[#121824] p-4 border border-gray-700 rounded-lg">
              <label className="text-xs font-bold text-senai-blue uppercase tracking-widest mb-2 block">
                 Buscar Carga
              </label>
              <div className="relative">
                 <input 
                    type="text" 
                    placeholder="Título ou Tag..." 
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full bg-black/50 border border-gray-600 rounded p-3 pl-10 text-white text-sm focus:border-senai-blue outline-none transition-colors"
                 />
                 <Search className="absolute left-3 top-3 text-gray-500 w-4 h-4" />
              </div>
           </div>

           {/* Sector Filter (Cohorts) */}
           <div className="bg-[#121824] p-4 border border-gray-700 rounded-lg">
              <label className="text-xs font-bold text-senai-blue uppercase tracking-widest mb-4 block flex items-center gap-2">
                 <Filter size={14} /> Filtro de Setor
              </label>
              
              <div className="space-y-2">
                 <button 
                    onClick={() => setSelectedCohort('all')}
                    className={`w-full text-left px-3 py-2 text-sm rounded font-mono transition-all border-l-2 ${selectedCohort === 'all' ? 'bg-senai-blue/10 text-white border-senai-blue' : 'text-gray-400 border-transparent hover:bg-gray-800'}`}
                 >
                    [ TODOS OS SETORES ]
                 </button>
                 
                 {COHORTS.map(cohort => (
                    <button 
                       key={cohort.id}
                       onClick={() => setSelectedCohort(cohort.id)}
                       className={`w-full text-left px-3 py-2 text-sm rounded font-mono transition-all border-l-2 ${selectedCohort === cohort.id ? 'bg-senai-blue/10 text-white border-senai-blue' : 'text-gray-400 border-transparent hover:bg-gray-800'}`}
                    >
                       {cohort.name}
                    </button>
                 ))}
              </div>
           </div>

           {/* Stats */}
           <div className="bg-senai-blue/10 p-4 border border-senai-blue/30 rounded-lg text-center">
              <div className="text-3xl font-display font-bold text-white">{filteredGames.length}</div>
              <div className="text-xs font-mono text-senai-blue uppercase">Projetos Encontrados</div>
           </div>

        </aside>

        {/* MAIN CONTENT: GRID */}
        <div className="lg:col-span-3">
           
           {filteredGames.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                 {filteredGames.map(game => (
                    <Link 
                       key={game.id}
                       to={`/game/${game.id}`}
                       className="group bg-[#121824] border border-gray-700 hover:border-senai-blue transition-all duration-300 rounded-lg overflow-hidden flex flex-col hover:-translate-y-1 hover:shadow-lg hover:shadow-senai-blue/20"
                    >
                       {/* Image */}
                       <div className="relative aspect-video bg-black overflow-hidden">
                          <img 
                             src={game.headerImage} 
                             alt={game.title} 
                             className="w-full h-full object-cover opacity-80 group-hover:opacity-100 transition-opacity"
                          />
                          <div className="absolute inset-0 bg-gradient-to-t from-[#121824] to-transparent opacity-60"></div>
                          
                          {/* Floating Badge */}
                          <div className="absolute top-2 right-2 bg-black/60 backdrop-blur border border-gray-600 px-2 py-1 rounded text-[10px] font-bold uppercase text-white">
                             {game.cohortId.split('-')[0]}
                          </div>
                       </div>

                       {/* Info */}
                       <div className="p-4 flex flex-col flex-grow">
                          <h3 className="text-lg font-bold text-white uppercase tracking-wide group-hover:text-senai-blue transition-colors mb-2 line-clamp-1">
                             {game.title}
                          </h3>
                          
                          <div className="flex flex-wrap gap-1 mb-4">
                             {game.tags.slice(0, 3).map(tag => (
                                <span key={tag} className="text-[10px] bg-gray-800 text-gray-400 px-1.5 py-0.5 rounded border border-gray-700 uppercase">
                                   {tag}
                                </span>
                             ))}
                          </div>

                          <div className="mt-auto pt-3 border-t border-gray-800 flex items-center justify-between text-xs text-gray-500">
                             <span className="flex items-center gap-1">
                                <Users size={12} /> {game.developer}
                             </span>
                             <span className="group-hover:translate-x-1 transition-transform text-senai-blue">
                                <Play size={14} fill="currentColor" />
                             </span>
                          </div>
                       </div>
                    </Link>
                 ))}
              </div>
           ) : (
              <div className="h-96 flex flex-col items-center justify-center text-gray-500 border-2 border-dashed border-gray-800 rounded-lg">
                 <Box size={48} className="mb-4 opacity-50" />
                 <h3 className="text-xl font-bold uppercase mb-1">Nenhum projeto localizado</h3>
                 <p className="text-sm">Tente ajustar os filtros de busca.</p>
              </div>
           )}

        </div>

      </div>
    </div>
  );
};

export default Projects;