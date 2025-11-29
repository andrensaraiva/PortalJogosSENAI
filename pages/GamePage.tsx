
import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Play, Monitor, Share2, Flag, ThumbsUp, ThumbsDown, MessageSquare, Box, Container, Presentation, Smartphone, PenTool, User, PlusCircle, Settings } from 'lucide-react';
import { useGames } from '../context/GameContext';
import { Game, Student } from '../types';

const GamePage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { games, submitReview, getStudentById, addDevlog, isAdmin } = useGames();
  const [game, setGame] = useState<Game | undefined>(undefined);
  const [activeMedia, setActiveMedia] = useState<string | null>(null);
  const [isPlayingWebBuild, setIsPlayingWebBuild] = useState(false);
  const [teamMembers, setTeamMembers] = useState<Student[]>([]);
  
  // Review Form State
  const [reviewAuthor, setReviewAuthor] = useState('');
  const [reviewContent, setReviewContent] = useState('');
  const [reviewRecommended, setReviewRecommended] = useState<boolean | null>(null);
  const [showReviewForm, setShowReviewForm] = useState(false);

  // Devlog Form State
  const [showAddDevlog, setShowAddDevlog] = useState(false);
  const [newDevlogTitle, setNewDevlogTitle] = useState('');
  const [newDevlogContent, setNewDevlogContent] = useState('');
  const [newDevlogTags, setNewDevlogTags] = useState('');

  useEffect(() => {
    const foundGame = games.find((g) => g.id === id);
    if (foundGame) {
      setGame(foundGame);
      // Resolve team IDs to Student Objects
      const members = foundGame.teamIds.map(id => getStudentById(id)).filter(Boolean) as Student[];
      setTeamMembers(members);

      if (!activeMedia) {
        setActiveMedia(foundGame.videoUrl || foundGame.screenshots[0] || foundGame.headerImage);
      }
    }
  }, [id, games, getStudentById]);

  if (!game) {
    return <div className="min-h-screen flex items-center justify-center text-white">Carga não encontrada.</div>;
  }

  const handleLaunchWebBuild = () => {
    setIsPlayingWebBuild(true);
  };

  const handleSubmitReview = (e: React.FormEvent) => {
    e.preventDefault();
    if (reviewRecommended === null) return;
    
    submitReview(game.id, {
      author: reviewAuthor || 'Anônimo',
      content: reviewContent,
      isRecommended: reviewRecommended
    });

    setReviewAuthor('');
    setReviewContent('');
    setReviewRecommended(null);
    setShowReviewForm(false);
  };

  const handleAddDevlog = (e: React.FormEvent) => {
      e.preventDefault();
      if(!newDevlogTitle || !newDevlogContent) return;

      // In a real app, authorId would come from auth context. Using first team member for now.
      const authorId = game.teamIds[0] || 's1'; 

      addDevlog(game.id, {
          title: newDevlogTitle,
          content: newDevlogContent,
          authorId: authorId,
          tags: newDevlogTags.split(',').map(t => t.trim()).filter(t => t),
          date: new Date().toLocaleDateString('pt-BR', { day: '2-digit', month: 'short', year: 'numeric' })
      });

      setNewDevlogTitle('');
      setNewDevlogContent('');
      setNewDevlogTags('');
      setShowAddDevlog(false);
  };

  // Calculate positive %
  const totalReviews = game.reviewsList.length;
  const positiveReviews = game.reviewsList.filter(r => r.isRecommended).length;
  const positivePercent = totalReviews > 0 ? Math.round((positiveReviews / totalReviews) * 100) : 0;

  return (
    <div className="min-h-screen font-sans bg-[#050b14] relative overflow-x-hidden">
      
      {/* 1. DYNAMIC BACKGROUND LAYER */}
      <div className="fixed inset-0 z-0">
        <div className="absolute inset-0 bg-gradient-to-t from-[#050b14] via-[#050b14]/90 to-[#050b14]/60 z-10"></div>
        <img 
            src={game.backgroundImage || game.headerImage} 
            alt="Background" 
            className="w-full h-full object-cover opacity-40 blur-[2px]"
        />
        {/* Grid Overlay */}
        <div className="absolute inset-0 z-10 opacity-10 bg-[url('https://transparenttextures.com/patterns/diagmonds-light.png')]"></div>
      </div>

      {/* Main Content Container - Z-Index raised above background */}
      <div className="relative z-10">
        
        {/* Breadcrumb Header */}
        <div className="max-w-7xl mx-auto px-4 pt-8 pb-4">
           <div className="text-xs font-mono text-senai-blue/80 mb-2 flex items-center gap-2">
              <Container size={12} />
              <Link to="/" className="hover:text-white uppercase tracking-widest hover:underline">MANIFESTO</Link> / 
              <span className="uppercase tracking-widest text-white">{game.cohortId}</span>
           </div>
           
           <div className="flex justify-between items-start">
               <h1 className="text-5xl md:text-6xl font-display font-bold text-white mb-2 drop-shadow-2xl">{game.title}</h1>
               
               {/* ADMIN EDIT BUTTON */}
               {isAdmin && (
                   <Link to={`/edit/${game.id}`} className="bg-yellow-500 hover:bg-yellow-400 text-black px-4 py-2 font-bold uppercase tracking-widest rounded shadow-lg flex items-center gap-2 transform hover:scale-105 transition-all">
                       <Settings size={18} /> ADMIN: EDITAR PROJETO
                   </Link>
               )}
           </div>

           <div className="flex items-center gap-4">
               <span className="bg-yellow-500/20 text-yellow-500 border border-yellow-500/50 px-2 py-0.5 text-xs font-bold uppercase tracking-wider rounded-sm">
                 PROJETO ACADÊMICO
               </span>
           </div>
        </div>

        <div className="max-w-7xl mx-auto px-4 grid grid-cols-1 lg:grid-cols-3 gap-8 pb-12">
          
          {/* LEFT COLUMN: Media & Description */}
          <div className="lg:col-span-2 space-y-6">
            
            {/* Main Media Player Frame */}
            <div className="bg-[#10151f] p-1 rounded-sm border-2 border-gray-700 shadow-2xl relative">
              {/* Decorative Bolts */}
              <div className="absolute -top-1 -left-1 w-2 h-2 bg-gray-500 rounded-full border border-black"></div>
              <div className="absolute -top-1 -right-1 w-2 h-2 bg-gray-500 rounded-full border border-black"></div>
              
              {isPlayingWebBuild ? (
                <div className="aspect-video w-full relative bg-black flex flex-col items-center justify-center border-4 border-[#0f172a]">
                   <div className="absolute inset-0 bg-gray-900/90 flex items-center justify-center text-center p-8 backdrop-blur-sm">
                      <div className="space-y-4 animate-pulse">
                          <Monitor className="w-16 h-16 text-senai-blue mx-auto opacity-80" />
                          <h3 className="text-2xl font-display font-bold text-white uppercase">Terminal de Execução</h3>
                          <p className="text-sm font-mono text-senai-blue">Inicializando protocolo de simulação...</p>
                          <button 
                              onClick={() => setIsPlayingWebBuild(false)}
                              className="mt-6 text-xs uppercase font-bold tracking-widest text-red-500 hover:text-red-400 border border-red-500/30 hover:border-red-500 px-4 py-2"
                          >
                              [ Abortar Execução ]
                          </button>
                      </div>
                   </div>
                </div>
              ) : (
                <div className="aspect-video w-full flex items-center justify-center bg-black overflow-hidden relative">
                   {activeMedia === game.videoUrl && game.videoUrl ? (
                     <iframe
                        src={game.videoUrl}
                        title="Trailer"
                        className="w-full h-full"
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                        allowFullScreen
                     ></iframe>
                   ) : (
                      <img src={activeMedia || ''} alt="Screenshot" className="w-full h-full object-contain" />
                   )}
                   
                   {/* Overlay Scanlines (only for image) */}
                   {activeMedia !== game.videoUrl && (
                        <div className="absolute inset-0 pointer-events-none bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.25)_50%),linear-gradient(90deg,rgba(255,0,0,0.06),rgba(0,255,0,0.02),rgba(0,0,255,0.06))] z-10 bg-[length:100%_2px,3px_100%]"></div>
                   )}
                </div>
              )}

              {/* Thumbnail Strip */}
              {!isPlayingWebBuild && (
                  <div className="flex gap-2 overflow-x-auto p-2 bg-[#0a0f18] border-t border-gray-800">
                      {game.videoUrl && (
                          <button 
                              onClick={() => setActiveMedia(game.videoUrl!)}
                              className={`w-28 h-16 flex-shrink-0 bg-black flex items-center justify-center border-2 transition-all ${activeMedia === game.videoUrl ? 'border-senai-blue shadow-[0_0_10px_rgba(0,169,255,0.3)]' : 'border-gray-700 grayscale hover:grayscale-0'}`}
                          >
                              <Play className="w-6 h-6 text-white" />
                          </button>
                      )}
                      {game.screenshots.map((shot, idx) => (
                          <button
                              key={idx}
                              onClick={() => setActiveMedia(shot)}
                              className={`w-28 h-16 flex-shrink-0 bg-black border-2 transition-all ${activeMedia === shot ? 'border-senai-blue shadow-[0_0_10px_rgba(0,169,255,0.3)]' : 'border-gray-700 grayscale hover:grayscale-0'}`}
                          >
                              <img src={shot} alt={`Thumb ${idx}`} className="w-full h-full object-cover" />
                          </button>
                      ))}
                  </div>
              )}
            </div>

            {/* About Section - Cargo Manifest Style */}
            <div className="bg-[#121824]/90 backdrop-blur-md border-l-4 border-senai-blue p-6 rounded-r-lg">
              <h2 className="text-xl font-display font-bold text-white uppercase tracking-wider mb-4 flex items-center gap-2">
                 <div className="w-2 h-2 bg-senai-blue"></div> Detalhes da Carga
              </h2>
              <div 
                  className="prose prose-invert prose-sm max-w-none text-gray-300 font-sans"
                  dangerouslySetInnerHTML={{ __html: game.fullDescription }}
              />
            </div>

            {/* DEVLOG SECTION */}
            <div className="bg-[#121824]/90 backdrop-blur-md border border-gray-700/50 p-6 rounded-lg">
                <div className="flex justify-between items-center mb-6">
                    <h2 className="text-xl font-display font-bold text-white uppercase tracking-wider flex items-center gap-2">
                        <PenTool size={20} className="text-senai-blue" /> Diário de Bordo (Devlogs)
                    </h2>
                    {!showAddDevlog && (
                        <button 
                            onClick={() => setShowAddDevlog(true)}
                            className="text-xs bg-gray-800 hover:bg-gray-700 text-white px-3 py-1.5 rounded uppercase font-bold flex items-center gap-2 border border-gray-600 transition-colors"
                        >
                            <PlusCircle size={14} /> Nova Atualização
                        </button>
                    )}
                </div>

                {showAddDevlog && (
                    <div className="mb-8 bg-gray-800/50 p-4 rounded border border-dashed border-gray-600 animate-fade-in">
                        <h3 className="text-sm text-white font-bold mb-3 uppercase">Registrar Progresso</h3>
                        <form onSubmit={handleAddDevlog} className="space-y-3">
                            <input 
                                type="text" 
                                placeholder="Título da Atualização" 
                                value={newDevlogTitle}
                                onChange={(e) => setNewDevlogTitle(e.target.value)}
                                className="w-full bg-black/40 border border-gray-600 p-2 text-white text-xs focus:border-senai-blue outline-none"
                            />
                            <textarea 
                                placeholder="Detalhes do que foi feito..." 
                                rows={3}
                                value={newDevlogContent}
                                onChange={(e) => setNewDevlogContent(e.target.value)}
                                className="w-full bg-black/40 border border-gray-600 p-2 text-white text-xs focus:border-senai-blue outline-none"
                            />
                            <input 
                                type="text" 
                                placeholder="Tags (separadas por vírgula): #Arte, #BugFix" 
                                value={newDevlogTags}
                                onChange={(e) => setNewDevlogTags(e.target.value)}
                                className="w-full bg-black/40 border border-gray-600 p-2 text-white text-xs focus:border-senai-blue outline-none"
                            />
                            <div className="flex justify-end gap-2">
                                <button type="button" onClick={() => setShowAddDevlog(false)} className="text-xs text-gray-400 hover:text-white px-3 py-2">Cancelar</button>
                                <button type="submit" className="text-xs bg-senai-blue text-white px-4 py-2 font-bold uppercase rounded">Publicar</button>
                            </div>
                        </form>
                    </div>
                )}

                <div className="space-y-6 relative border-l border-gray-700 ml-3 pl-6">
                    {game.devlogs && game.devlogs.length > 0 ? (
                        game.devlogs.map((log) => (
                            <div key={log.id} className="relative group">
                                <div className="absolute -left-[29px] top-1 w-3 h-3 bg-senai-blue rounded-full border-2 border-[#121824] group-hover:scale-125 transition-transform"></div>
                                <div className="flex justify-between items-start mb-1">
                                    <h3 className="font-bold text-white text-sm">{log.title}</h3>
                                    <span className="text-[10px] text-gray-500 font-mono bg-gray-800 px-2 py-0.5 rounded">{log.date}</span>
                                </div>
                                <p className="text-gray-400 text-sm mb-2">{log.content}</p>
                                <div className="flex gap-2">
                                    {log.tags.map(tag => (
                                        <span key={tag} className="text-[10px] text-gray-600 font-bold uppercase tracking-wider">#{tag.trim()}</span>
                                    ))}
                                </div>
                            </div>
                        ))
                    ) : (
                        <p className="text-gray-500 text-sm italic">Nenhum registro de desenvolvimento encontrado.</p>
                    )}
                </div>
            </div>

            {/* PRESENTATION */}
            {game.presentationUrl && (
              <div className="bg-[#121824]/90 backdrop-blur-md border border-purple-500/30 p-1 relative shadow-[0_0_30px_rgba(168,85,247,0.1)]">
                 <div className="absolute -top-3 left-4 bg-[#121824] px-2 text-purple-400 text-xs font-bold uppercase tracking-widest flex items-center gap-2 border border-purple-500/30">
                    <Presentation size={14} /> Documentação & Pesquisa
                 </div>
                 <div className="aspect-video w-full bg-black relative overflow-hidden">
                    <iframe 
                      src={game.presentationUrl} 
                      className="w-full h-full border-0"
                      allowFullScreen={true}
                      title="Project Presentation"
                    ></iframe>
                 </div>
              </div>
            )}

            {/* REVIEW SYSTEM */}
            <div className="bg-[#0f141e]/90 backdrop-blur-md p-6 border border-gray-700/50 rounded-lg">
               <div className="flex items-center justify-between border-b border-gray-700 pb-4 mb-6">
                  <h2 className="text-xl font-display font-bold text-white uppercase tracking-widest flex items-center gap-2">
                     <div className="bg-yellow-500 w-6 h-6 flex items-center justify-center text-black font-bold text-sm">!</div>
                     Inspeção Portuária
                  </h2>
                  <div className="text-right">
                     <div className="text-sm text-gray-400 font-mono">ÍNDICE DE APROVAÇÃO</div>
                     <div className={`text-2xl font-bold ${positivePercent > 70 ? 'text-senai-blue' : positivePercent > 40 ? 'text-yellow-500' : 'text-red-500'}`}>
                        {totalReviews > 0 ? `${positivePercent}%` : '--'}
                     </div>
                  </div>
               </div>

               <div className="space-y-4 mb-8 max-h-96 overflow-y-auto pr-2 custom-scrollbar">
                  {game.reviewsList.length === 0 ? (
                      <div className="text-gray-500 text-center py-8 italic border border-dashed border-gray-700 rounded">
                         Nenhum registro de inspeção encontrado. Seja o primeiro a avaliar.
                      </div>
                  ) : (
                      game.reviewsList.map(review => (
                          <div key={review.id} className="bg-[#1a202c] p-4 rounded border-l-2 border-gray-600 flex gap-4">
                             <div className="flex-shrink-0">
                                <div className={`w-10 h-10 rounded flex items-center justify-center ${review.isRecommended ? 'bg-senai-blue/10 text-senai-blue' : 'bg-red-500/10 text-red-500'}`}>
                                    {review.isRecommended ? <ThumbsUp size={20} /> : <ThumbsDown size={20} />}
                                </div>
                             </div>
                             <div className="flex-grow">
                                <div className="flex justify-between items-baseline mb-1">
                                   <span className="font-bold text-gray-200 text-sm">{review.author}</span>
                                   <span className="text-xs text-gray-500 font-mono">{review.date}</span>
                                </div>
                                <p className="text-gray-300 text-sm">{review.content}</p>
                             </div>
                          </div>
                      ))
                  )}
               </div>

               {!showReviewForm ? (
                   <button 
                     onClick={() => setShowReviewForm(true)}
                     className="w-full py-3 bg-gray-800 hover:bg-gray-700 text-white font-bold uppercase tracking-wider border border-gray-600 transition-colors flex items-center justify-center gap-2"
                   >
                      <MessageSquare size={16} /> Adicionar Relatório de Inspeção
                   </button>
               ) : (
                   <form onSubmit={handleSubmitReview} className="bg-[#1a202c] p-4 rounded border border-gray-600 space-y-4 animate-fade-in">
                      <div className="flex gap-4">
                         <button 
                            type="button"
                            onClick={() => setReviewRecommended(true)}
                            className={`flex-1 py-3 flex items-center justify-center gap-2 border transition-all ${reviewRecommended === true ? 'bg-senai-blue text-white border-senai-blue' : 'bg-gray-800 text-gray-400 border-gray-600 hover:bg-gray-700'}`}
                         >
                            <ThumbsUp size={18} /> Recomendado
                         </button>
                         <button 
                            type="button"
                            onClick={() => setReviewRecommended(false)}
                            className={`flex-1 py-3 flex items-center justify-center gap-2 border transition-all ${reviewRecommended === false ? 'bg-red-600 text-white border-red-600' : 'bg-gray-800 text-gray-400 border-gray-600 hover:bg-gray-700'}`}
                         >
                            <ThumbsDown size={18} /> Não Recomendado
                         </button>
                      </div>
                      
                      <input 
                        type="text" 
                        placeholder="Nome do Inspetor (Opcional)"
                        value={reviewAuthor}
                        onChange={e => setReviewAuthor(e.target.value)}
                        className="w-full bg-black/40 border border-gray-600 p-2 text-white text-sm focus:border-senai-blue outline-none"
                      />
                      
                      <textarea 
                        placeholder="Descreva sua experiência com a carga..."
                        required
                        value={reviewContent}
                        onChange={e => setReviewContent(e.target.value)}
                        rows={3}
                        className="w-full bg-black/40 border border-gray-600 p-2 text-white text-sm focus:border-senai-blue outline-none"
                      />

                      <div className="flex justify-end gap-2">
                         <button 
                            type="button" 
                            onClick={() => setShowReviewForm(false)}
                            className="px-4 py-2 text-gray-400 hover:text-white text-sm"
                         >
                            Cancelar
                         </button>
                         <button 
                            type="submit"
                            disabled={reviewRecommended === null}
                            className={`px-6 py-2 bg-white text-black font-bold uppercase text-sm hover:bg-gray-200 ${reviewRecommended === null ? 'opacity-50 cursor-not-allowed' : ''}`}
                         >
                            Registrar
                         </button>
                      </div>
                   </form>
               )}
            </div>

          </div>

          {/* RIGHT COLUMN: Sidebar Info */}
          <div className="space-y-6">
              
              {/* Game Card Header */}
              <div className="bg-[#10151f]/90 backdrop-blur border border-gray-700 rounded-sm shadow-xl p-1">
                  <img src={game.headerImage} alt="Cover" className="w-full border-b border-senai-blue/30" />
                  <div className="p-4">
                      <p className="text-sm text-gray-400 leading-relaxed font-mono">
                          {game.shortDescription}
                      </p>
                  </div>
              </div>

               {/* Action Buttons */}
               <div className="space-y-3">
                   {game.webBuildUrl && (
                        <button 
                            onClick={handleLaunchWebBuild}
                            className="w-full relative overflow-hidden group bg-green-600 hover:bg-green-500 text-white p-4 font-bold uppercase tracking-wider flex items-center justify-between shadow-[0_4px_0_rgb(21,128,61)] active:shadow-none active:translate-y-[4px] transition-all"
                        >
                            <span className="flex items-center gap-2 z-10"><Play fill="currentColor" size={20} /> Rodar no Navegador</span>
                            <div className="absolute inset-0 bg-[repeating-linear-gradient(45deg,transparent,transparent_10px,rgba(0,0,0,0.1)_10px,rgba(0,0,0,0.1)_20px)] opacity-30"></div>
                        </button>
                   )}
                   
                   <div className="grid grid-cols-2 gap-2">
                        <a href={game.downloadLinks.windows || '#'} className={`flex items-center justify-center gap-2 py-3 bg-[#2a3b55] hover:bg-[#3b4f6e] text-white text-sm font-bold uppercase transition-colors border border-transparent hover:border-senai-blue ${!game.downloadLinks.windows && 'opacity-50 cursor-not-allowed'}`}>
                           <Monitor size={16} /> Windows
                        </a>
                        <a href={game.downloadLinks.android || '#'} className={`flex items-center justify-center gap-2 py-3 bg-[#2a3b55] hover:bg-[#3b4f6e] text-white text-sm font-bold uppercase transition-colors border border-transparent hover:border-senai-blue ${!game.downloadLinks.android && 'opacity-50 cursor-not-allowed'}`}>
                           <Smartphone size={16} /> Android
                        </a>
                   </div>
               </div>

              {/* TEAM ROSTER */}
              <div className="bg-[#0f141e]/90 backdrop-blur border-2 border-gray-800 p-4 relative">
                  <div className="absolute top-0 right-0 bg-gray-800 text-gray-400 px-2 py-1 text-[10px] font-bold">TRIPULAÇÃO</div>
                  <div className="space-y-3 mt-4">
                      {teamMembers.length > 0 ? teamMembers.map(member => (
                          <div key={member.id} className="flex items-center gap-3 border-b border-gray-800 pb-2 last:border-0 last:pb-0">
                              <div className="w-8 h-8 rounded-full overflow-hidden bg-gray-700">
                                  <img src={member.avatarUrl || `https://api.dicebear.com/7.x/avataaars/svg?seed=${member.name}`} alt={member.name} />
                              </div>
                              <div>
                                  <p className="text-white text-xs font-bold">{member.name}</p>
                                  <p className="text-[10px] text-senai-blue uppercase">{member.role}</p>
                              </div>
                          </div>
                      )) : (
                          <span className="text-gray-500 text-xs">Informação confidencial.</span>
                      )}
                  </div>
              </div>

              {/* Metadata Manifest */}
              <div className="bg-[#0f141e]/90 backdrop-blur border-2 border-gray-800 p-4 text-xs font-mono space-y-3 relative">
                  <div className="absolute top-0 right-0 bg-gray-800 text-gray-400 px-2 py-1 text-[10px] font-bold">METADADOS</div>
                  
                  <div className="flex justify-between border-b border-dashed border-gray-700 pb-2">
                      <span className="text-gray-500 uppercase">Status</span>
                      <span className="text-senai-blue font-bold">{game.reviewSummary}</span>
                  </div>
                  <div className="flex justify-between border-b border-dashed border-gray-700 pb-2">
                      <span className="text-gray-500 uppercase">Data Entrada</span>
                      <span className="text-gray-300">{game.releaseDate}</span>
                  </div>
                  <div className="flex justify-between">
                      <span className="text-gray-500 uppercase">Terminal</span>
                      <span className="text-gray-300">SENAI Vitória</span>
                  </div>
              </div>

              {/* Tags */}
              <div>
                  <h3 className="text-gray-500 text-[10px] font-bold uppercase mb-2 tracking-widest">Etiquetas de Carga</h3>
                  <div className="flex flex-wrap gap-2">
                      {game.tags.map(tag => (
                          <span key={tag} className="px-3 py-1 bg-[#e2e8f0] text-black text-xs font-bold uppercase tracking-tight shadow-[2px_2px_0px_rgba(0,0,0,0.5)] transform hover:-translate-y-0.5 transition-transform cursor-help">
                              {tag}
                          </span>
                      ))}
                  </div>
              </div>

              {/* System Specs */}
              <div className="bg-[#0f141e]/90 backdrop-blur p-4 border border-gray-800">
                <h3 className="text-senai-blue text-xs font-bold uppercase mb-3 border-b border-senai-blue/30 pb-1">Requisitos Operacionais</h3>
                <ul className="space-y-2 text-xs font-mono text-gray-400">
                    <li className="flex justify-between"><span>SO:</span> <span className="text-gray-200">{game.systemRequirements.os}</span></li>
                    <li className="flex justify-between"><span>CPU:</span> <span className="text-gray-200">{game.systemRequirements.processor}</span></li>
                    <li className="flex justify-between"><span>RAM:</span> <span className="text-gray-200">{game.systemRequirements.memory}</span></li>
                    <li className="flex justify-between"><span>GPU:</span> <span className="text-gray-200">{game.systemRequirements.graphics}</span></li>
                </ul>
              </div>

              {/* Share/Report */}
              <div className="flex justify-between bg-[#10151f] p-2 rounded border border-gray-800">
                  <button className="flex-1 flex items-center justify-center gap-2 py-1 hover:bg-gray-800 rounded text-gray-500 hover:text-white text-xs transition-colors">
                      <Share2 size={14} /> COMPARTILHAR
                  </button>
                  <div className="w-px bg-gray-800"></div>
                  <button className="flex-1 flex items-center justify-center gap-2 py-1 hover:bg-gray-800 rounded text-gray-500 hover:text-white text-xs transition-colors">
                      <Flag size={14} /> REPORTAR
                  </button>
              </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default GamePage;
