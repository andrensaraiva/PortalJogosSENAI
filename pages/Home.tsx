
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Terminal, ArrowRight, FileCode, Star, Clock, ChevronRight, GraduationCap, PenTool } from 'lucide-react';
import { useGames } from '../context/GameContext';

const Home: React.FC = () => {
  const { games, allDevlogs } = useGames();
  const [currentSlide, setCurrentSlide] = useState(0);
  
  // Select top 5 random games for the carousel to keep it dynamic
  const featuredGames = games.slice(0, 5);

  // Auto-advance carousel
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % featuredGames.length);
    }, 6000);
    return () => clearInterval(timer);
  }, [featuredGames.length]);

  // CATEGORIES LOGIC
  const newArrivals = [...games].slice(0, 4); 
  
  const topRatedGames = games.filter(g => 
      g.reviewSummary.includes('Extremamente') || 
      g.reviewSummary.includes('Muito')
  ).slice(0, 4);

  // Get latest 5 devlogs
  const recentDevlogs = allDevlogs.slice(0, 5);

  return (
    <div className="min-h-screen font-sans bg-[#050b14]">
      
      {/* HERO SECTION - "DOCKING BAY" */}
      <section className="relative h-[500px] w-full overflow-hidden border-b border-senai-blue/30 group">
        {featuredGames.map((game, index) => (
          <div 
            key={game.id}
            className={`absolute inset-0 transition-opacity duration-1000 ${index === currentSlide ? 'opacity-100 z-10' : 'opacity-0 z-0'}`}
          >
            {/* Background Image with Overlay */}
            <div className="absolute inset-0 bg-gradient-to-r from-[#050b14] via-[#050b14]/80 to-transparent z-10"></div>
            <img 
              src={game.backgroundImage || game.headerImage} 
              alt={game.title} 
              className="w-full h-full object-cover object-center"
            />
            {/* Grid Pattern Overlay */}
            <div className="absolute inset-0 z-[5] bg-[url('https://transparenttextures.com/patterns/diagmonds-light.png')] opacity-10"></div>
          </div>
        ))}

        {/* Hero Content */}
        <div className="relative z-20 max-w-7xl mx-auto px-4 h-full flex flex-col justify-center">
            <div className="max-w-2xl">
               <div className="flex items-center gap-2 mb-4 animate-fade-in">
                  <span className="bg-senai-blue text-white text-[10px] font-bold uppercase px-2 py-0.5 tracking-widest rounded-sm">
                    Destaque do Porto
                  </span>
                  <span className="text-gray-400 font-mono text-xs uppercase flex items-center gap-1">
                     <Terminal size={12}/> Terminal 0{currentSlide + 1}
                  </span>
               </div>
               
               <h1 className="text-4xl md:text-6xl font-display font-bold text-white mb-4 leading-none drop-shadow-2xl uppercase">
                 {featuredGames[currentSlide]?.title}
               </h1>
               
               <p className="text-gray-300 text-sm md:text-base mb-8 line-clamp-2 max-w-lg font-sans leading-relaxed border-l-4 border-senai-blue pl-4">
                 {featuredGames[currentSlide]?.shortDescription}
               </p>
               
               <div className="flex items-center gap-4">
                  <Link 
                    to={`/game/${featuredGames[currentSlide]?.id}`}
                    className="bg-white text-black hover:bg-senai-blue hover:text-white px-6 py-3 font-bold uppercase tracking-widest transition-all clip-path-polygon flex items-center gap-2 group/btn text-sm"
                    style={{ clipPath: 'polygon(10px 0, 100% 0, 100% calc(100% - 10px), calc(100% - 10px) 100%, 0 100%, 0 10px)' }}
                  >
                     Inspecionar <ArrowRight size={16} className="group-hover/btn:translate-x-1 transition-transform" />
                  </Link>
               </div>
            </div>

            {/* Carousel Indicators */}
            <div className="absolute right-4 bottom-8 flex gap-2">
               {featuredGames.map((_, idx) => (
                  <button 
                    key={idx}
                    onClick={() => setCurrentSlide(idx)}
                    className={`h-1 rounded-sm transition-all duration-300 ${idx === currentSlide ? 'bg-senai-blue w-8' : 'bg-gray-700 w-4 hover:bg-gray-500'}`}
                  />
               ))}
            </div>
        </div>
      </section>

      <main className="max-w-7xl mx-auto px-4 py-12">
        
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-12 mb-16">
            {/* LEFT COLUMN: DEVLOGS (1 Col) */}
            <aside className="lg:col-span-1 space-y-8">
                <div className="bg-[#0f141e] border border-gray-800 rounded-lg overflow-hidden">
                    <div className="bg-gray-800 px-4 py-3 flex items-center justify-between border-b border-gray-700">
                        <h3 className="text-xs font-bold text-white uppercase tracking-widest flex items-center gap-2">
                            <PenTool size={14} className="text-senai-blue" /> Devlogs da Tripulação
                        </h3>
                    </div>
                    <div className="p-4 space-y-4">
                        {recentDevlogs.length > 0 ? recentDevlogs.map((log) => (
                            <Link to={`/game/${log.gameId}`} key={log.id} className="group cursor-pointer block">
                                <div className="flex justify-between items-center mb-1">
                                    <span className="text-[10px] font-mono text-senai-blue font-bold truncate max-w-[80px]">{log.authorName}</span>
                                    {log.tags[0] && <span className="text-[9px] bg-gray-700 text-gray-300 px-1.5 rounded uppercase">{log.tags[0]}</span>}
                                </div>
                                <div className="text-[10px] text-gray-500 font-bold uppercase mb-1">{log.gameTitle}</div>
                                <p className="text-sm text-gray-300 group-hover:text-white transition-colors leading-tight font-mono line-clamp-2">
                                    "{log.title}"
                                </p>
                                <span className="text-[10px] text-gray-600 block mt-1">{log.date}</span>
                                <div className="h-px bg-gray-800 mt-3 group-last:hidden"></div>
                            </Link>
                        )) : (
                            <p className="text-gray-500 text-xs italic text-center">Sem atualizações recentes no diário de bordo.</p>
                        )}
                    </div>
                </div>

                {/* Quick Stats */}
                <div className="bg-gradient-to-br from-senai-blue to-blue-900 p-6 rounded-lg text-white relative overflow-hidden">
                    <div className="relative z-10">
                        <h4 className="font-display font-bold text-2xl mb-1">{games.length}</h4>
                        <p className="text-xs font-bold uppercase tracking-wider opacity-80">Projetos no Manifesto</p>
                        <Link to="/projects" className="mt-4 inline-block text-xs bg-white/20 hover:bg-white/30 px-3 py-1.5 rounded transition-colors">
                            Acessar Arquivo
                        </Link>
                    </div>
                    <div className="absolute -right-4 -bottom-4 opacity-20">
                        <FileCode size={80} />
                    </div>
                </div>
            </aside>

            {/* RIGHT COLUMN: HIGHLIGHTS (3 Cols) */}
            <div className="lg:col-span-3 space-y-12">
                
                {/* SECTION: FRESH CARGO (New Releases) */}
                <section>
                    <div className="flex items-center justify-between mb-6 border-b border-gray-800 pb-2">
                        <h2 className="text-xl font-display font-bold text-white uppercase tracking-wider flex items-center gap-2">
                            <Clock className="text-green-500" size={20} /> Carga Recente
                        </h2>
                        <Link to="/projects" className="text-xs font-bold text-gray-500 hover:text-white uppercase tracking-widest flex items-center gap-1 transition-colors">
                            Ver Todos <ChevronRight size={12} />
                        </Link>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {newArrivals.map(game => (
                            <Link key={game.id} to={`/game/${game.id}`} className="flex bg-[#121824] hover:bg-[#1a2233] border border-gray-800 transition-colors rounded overflow-hidden group h-32">
                                <div className="w-48 relative overflow-hidden flex-shrink-0">
                                    <img src={game.headerImage} alt={game.title} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" />
                                </div>
                                <div className="p-3 flex flex-col justify-between flex-grow min-w-0">
                                    <div>
                                        <h3 className="font-bold text-white truncate text-sm mb-1 group-hover:text-green-400 transition-colors">{game.title}</h3>
                                        <p className="text-xs text-gray-500 line-clamp-2">{game.shortDescription}</p>
                                    </div>
                                    <div className="flex items-center gap-2 mt-2">
                                        {game.tags.slice(0, 2).map(tag => (
                                            <span key={tag} className="text-[9px] bg-black/40 text-gray-400 px-1.5 py-0.5 rounded border border-gray-700 uppercase">
                                                {tag}
                                            </span>
                                        ))}
                                    </div>
                                </div>
                            </Link>
                        ))}
                    </div>
                </section>

                {/* SECTION: HIGH VALUE ASSETS (Top Rated) */}
                <section>
                    <div className="flex items-center justify-between mb-6 border-b border-gray-800 pb-2">
                        <h2 className="text-xl font-display font-bold text-white uppercase tracking-wider flex items-center gap-2">
                            <Star className="text-yellow-500" size={20} /> Alto Valor
                        </h2>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                        {topRatedGames.map(game => (
                            <Link key={game.id} to={`/game/${game.id}`} className="bg-[#121824] border border-gray-800 hover:border-yellow-500/50 transition-all rounded-lg overflow-hidden group">
                                <div className="relative aspect-[4/3] overflow-hidden">
                                    <img src={game.coverImage} alt={game.title} className="w-full h-full object-cover" />
                                    <div className="absolute top-2 right-2 bg-yellow-500 text-black text-[10px] font-bold px-2 py-0.5 rounded shadow">
                                        TOP
                                    </div>
                                </div>
                                <div className="p-3">
                                    <h3 className="font-bold text-white text-sm mb-1 truncate">{game.title}</h3>
                                    <div className="flex items-center gap-1 text-xs text-gray-400">
                                        <Star size={12} className="text-yellow-500 fill-yellow-500" />
                                        <span>{game.reviewSummary}</span>
                                    </div>
                                </div>
                            </Link>
                        ))}
                    </div>
                </section>
            </div>
        </div>

        {/* COURSE RECRUITMENT BANNER (FULL WIDTH BOTTOM - BLUE STYLE) */}
        <section className="bg-senai-blue text-white rounded-xl relative overflow-hidden shadow-[0_20px_50px_-12px_rgba(0,169,255,0.3)]">
            <div className="absolute inset-0 bg-[url('https://transparenttextures.com/patterns/carbon-fibre.png')] opacity-20"></div>
            <div className="absolute top-0 right-0 w-96 h-96 bg-white/10 blur-[80px] rounded-full"></div>
            
            <div className="relative z-10 p-12 text-center flex flex-col items-center justify-center">
                <GraduationCap className="w-16 h-16 mb-4 opacity-90" />
                <h3 className="text-4xl font-display font-bold uppercase mb-4 tracking-wide">
                    Junte-se à Tripulação
                </h3>
                <p className="text-blue-100 text-lg max-w-2xl mx-auto mb-8 font-light leading-relaxed">
                    O Curso Técnico em Jogos Digitais do SENAI Vitória é a sua porta de entrada para a indústria. Aprenda programação, arte e design em laboratórios de alta performance.
                </p>
                <Link 
                    to="/about" 
                    className="inline-flex items-center gap-3 bg-white text-senai-blue hover:bg-gray-100 px-10 py-4 font-bold uppercase tracking-widest rounded transition-all transform hover:-translate-y-1 shadow-lg"
                >
                    <Terminal size={18} />
                    <span>Iniciar Treinamento</span>
                </Link>
            </div>
        </section>

      </main>
    </div>
  );
};

export default Home;
