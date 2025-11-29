
import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { UploadCloud, Image as ImageIcon, CheckCircle, Video, UserPlus, Users, Monitor, Smartphone, PenTool, AlertTriangle, Container, Presentation, Lock, FileCode, Save } from 'lucide-react';
import { COHORTS } from '../constants';
import { useGames } from '../context/GameContext';
import { Game, Student, Devlog } from '../types';

const SubmitProject: React.FC = () => {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>(); // Check if editing
  const { addGame, updateGame, games, students, loginStudent, isAdmin } = useGames();
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const isEditMode = !!id;

  // Login State
  const [currentUser, setCurrentUser] = useState<Student | null>(null);
  const [showLoginModal, setShowLoginModal] = useState(!isAdmin && !id); // Don't show login if admin editing
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [loginError, setLoginError] = useState(false);

  // Form State
  const [formData, setFormData] = useState({
    title: '',
    shortDescription: '',
    fullDescription: '',
    teamIds: [] as string[], // Selected Student IDs
    cohortId: COHORTS[0].id,
    tags: '',
    webBuildUrl: '',
    videoUrl: '',
    presentationUrl: '',
    downloadWin: '',
    downloadAndroid: '',
    downloadLinux: '',
    reqOs: 'Windows 10',
    reqProc: 'Intel i5',
    reqMem: '8GB',
    reqGpu: 'GTX 1050',
    reqStore: '1GB'
  });

  // Initial Devlog State (Only for new projects)
  const [initialDevlogTitle, setInitialDevlogTitle] = useState('Anúncio do Projeto');
  const [initialDevlogContent, setInitialDevlogContent] = useState('Estamos felizes em anunciar o início do desenvolvimento! Nosso objetivo é criar uma experiência única.');

  // Media State (for previews)
  const [coverFile, setCoverFile] = useState<File | null>(null);
  const [coverPreview, setCoverPreview] = useState<string>('');
  const [headerFile, setHeaderFile] = useState<File | null>(null);
  const [headerPreview, setHeaderPreview] = useState<string>('');
  const [bgFile, setBgFile] = useState<File | null>(null);
  const [bgPreview, setBgPreview] = useState<string>('');

  // Load existing game data if in Edit Mode
  useEffect(() => {
    if (isEditMode && id) {
        const gameToEdit = games.find(g => g.id === id);
        if (gameToEdit) {
            setFormData({
                title: gameToEdit.title,
                shortDescription: gameToEdit.shortDescription,
                fullDescription: gameToEdit.fullDescription.replace(/<br\/>/g, '\n').replace(/<p>/g, '').replace(/<\/p>/g, ''), // Simple strip
                teamIds: gameToEdit.teamIds,
                cohortId: gameToEdit.cohortId,
                tags: gameToEdit.tags.join(', '),
                webBuildUrl: gameToEdit.webBuildUrl || '',
                videoUrl: gameToEdit.videoUrl || '',
                presentationUrl: gameToEdit.presentationUrl || '',
                downloadWin: gameToEdit.downloadLinks.windows || '',
                downloadAndroid: gameToEdit.downloadLinks.android || '',
                downloadLinux: gameToEdit.downloadLinks.linux || '',
                reqOs: gameToEdit.systemRequirements.os,
                reqProc: gameToEdit.systemRequirements.processor,
                reqMem: gameToEdit.systemRequirements.memory,
                reqGpu: gameToEdit.systemRequirements.graphics,
                reqStore: gameToEdit.systemRequirements.storage
            });
            setCoverPreview(gameToEdit.coverImage);
            setHeaderPreview(gameToEdit.headerImage);
            setBgPreview(gameToEdit.backgroundImage || '');
            
            // If admin is editing, we skip the login modal
            if (isAdmin) {
                setShowLoginModal(false);
            }
        }
    }
  }, [isEditMode, id, games, isAdmin]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleTeamSelection = (studentId: string) => {
    setFormData(prev => {
        const isSelected = prev.teamIds.includes(studentId);
        if (isSelected) {
            return { ...prev, teamIds: prev.teamIds.filter(id => id !== studentId) };
        } else {
            return { ...prev, teamIds: [...prev.teamIds, studentId] };
        }
    });
  };

  const handleLogin = () => {
      const student = loginStudent(username, password);
      if (student) {
          setCurrentUser(student);
          // Auto-select current user for the team
          setFormData(prev => ({ ...prev, teamIds: [student.id] }));
          setShowLoginModal(false);
          setLoginError(false);
      } else {
          setLoginError(true);
      }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>, type: 'cover' | 'header' | 'bg') => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      const url = URL.createObjectURL(file);
      
      if (type === 'cover') {
        setCoverFile(file);
        setCoverPreview(url);
      } else if (type === 'header') {
        setHeaderFile(file);
        setHeaderPreview(url);
      } else {
        setBgFile(file);
        setBgPreview(url);
      }
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentUser && !isAdmin && !isEditMode) return; // Strict check for new submissions
    setIsSubmitting(true);

    try {
      const currentDevlogs = isEditMode && id 
        ? games.find(g => g.id === id)?.devlogs || []
        : [];

      // Create Initial Devlog if content exists and it's a new project
      if (!isEditMode && initialDevlogTitle && initialDevlogContent) {
          currentDevlogs.push({
              id: `log-${Date.now()}`,
              date: new Date().toLocaleDateString('pt-BR', { day: '2-digit', month: 'short', year: 'numeric' }),
              authorId: currentUser?.id || 'admin',
              title: initialDevlogTitle,
              content: initialDevlogContent,
              tags: ['Anúncio', 'Início']
          });
      }

      // Prepare images for upload
      const images: { cover?: File; header?: File; background?: File; screenshots?: File[] } = {};
      if (coverFile) images.cover = coverFile;
      if (headerFile) images.header = headerFile;
      if (bgFile) images.background = bgFile;

      const gamePayload = {
        title: formData.title,
        shortDescription: formData.shortDescription,
        // Simple HTML wrap
        fullDescription: formData.fullDescription.includes('<p>') ? formData.fullDescription : `<p>${formData.fullDescription.replace(/\n/g, '<br/>')}</p>`,
        teamIds: formData.teamIds.length > 0 ? formData.teamIds : (currentUser ? [currentUser.id] : []),
        cohortId: formData.cohortId,
        releaseDate: isEditMode ? (games.find(g => g.id === id)?.releaseDate || '') : new Date().toLocaleDateString('pt-BR', { day: '2-digit', month: 'short', year: 'numeric' }),
        reviewSummary: isEditMode ? (games.find(g => g.id === id)?.reviewSummary || 'Em Análise') : 'Em Análise',
        reviewsList: isEditMode ? (games.find(g => g.id === id)?.reviewsList || []) : [],
        devlogs: currentDevlogs, 
        tags: formData.tags.split(',').map(t => t.trim()).filter(t => t.length > 0),
        
        coverImage: coverPreview || 'https://picsum.photos/300/400',
        headerImage: headerPreview || 'https://picsum.photos/600/300',
        backgroundImage: bgPreview || undefined, 
        screenshots: isEditMode ? (games.find(g => g.id === id)?.screenshots || []) : [], 
        
        webBuildUrl: formData.webBuildUrl || undefined,
        videoUrl: formData.videoUrl || undefined,
        presentationUrl: formData.presentationUrl || undefined,
        downloadLinks: {
          windows: formData.downloadWin || undefined,
          android: formData.downloadAndroid || undefined, 
          linux: formData.downloadLinux || undefined,
        },
        
        systemRequirements: {
          os: formData.reqOs,
          processor: formData.reqProc,
          memory: formData.reqMem,
          graphics: formData.reqGpu,
          storage: formData.reqStore
        }
      };

      if (isEditMode && id) {
          await updateGame({ id, ...gamePayload }, Object.keys(images).length > 0 ? images : undefined);
          navigate(`/game/${id}`);
      } else {
          const newGameId = await addGame(gamePayload, Object.keys(images).length > 0 ? images : undefined);
          if (newGameId) {
            navigate(`/game/${newGameId}`);
          } else {
            // Fallback usando ID gerado
            const generatedId = formData.title.toLowerCase().replace(/\s+/g, '-') + '-' + Date.now();
            navigate(`/game/${generatedId}`);
          }
      }
    } catch (error) {
      console.error('Erro ao salvar projeto:', error);
      alert('Erro ao salvar projeto. Tente novamente.');
    } finally {
      setIsSubmitting(false);
    }
  };

  // LOGIN MODAL
  if (showLoginModal) {
      return (
          <div className="min-h-screen bg-[#050b14] flex items-center justify-center p-4">
              <div className="bg-[#121824] border border-senai-blue/30 p-8 rounded-lg max-w-md w-full shadow-[0_0_50px_rgba(0,169,255,0.1)]">
                  <div className="text-center mb-6">
                      <Lock className="mx-auto text-senai-blue w-12 h-12 mb-2" />
                      <h2 className="text-2xl font-display font-bold text-white uppercase">Acesso do Aluno</h2>
                      <p className="text-gray-400 text-sm">Insira suas credenciais para enviar projetos.</p>
                  </div>
                  <div className="space-y-4">
                      <div>
                          <label className="text-xs uppercase font-bold text-gray-500 block mb-1">Usuário</label>
                          <input 
                            type="text" 
                            className="w-full bg-black/40 border border-gray-700 p-3 text-white focus:border-senai-blue outline-none rounded"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            placeholder="Ex: joao"
                          />
                      </div>
                      <div>
                          <label className="text-xs uppercase font-bold text-gray-500 block mb-1">Senha</label>
                          <input 
                            type="password" 
                            className="w-full bg-black/40 border border-gray-700 p-3 text-white focus:border-senai-blue outline-none rounded"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            placeholder="**** (Padrão: 123)"
                          />
                      </div>
                      
                      {loginError && (
                          <div className="text-red-500 text-xs text-center border border-red-500/20 bg-red-500/10 p-2 rounded">
                              Usuário ou senha incorretos. Contate o administrador.
                          </div>
                      )}

                      <button 
                        onClick={handleLogin}
                        disabled={!username || !password}
                        className={`w-full py-3 font-bold uppercase tracking-widest rounded ${!username || !password ? 'bg-gray-700 text-gray-500 cursor-not-allowed' : 'bg-senai-blue text-white hover:bg-white hover:text-senai-blue transition-colors'}`}
                      >
                          Entrar
                      </button>
                  </div>
              </div>
          </div>
      )
  }

  return (
    <div className="min-h-screen pb-12 bg-[#050b14] font-sans">
      <div className="max-w-5xl mx-auto px-4 py-8">
        
        <div className="mb-8 border-b-2 border-senai-blue pb-4 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-display font-bold text-white flex items-center gap-3 uppercase tracking-widest">
              <Container className="text-senai-blue" size={32} />
              {isEditMode ? 'Editar Manifesto (Projeto)' : 'Registro de Carga (Novo Projeto)'}
            </h1>
            {!isEditMode && currentUser && (
                <p className="text-gray-400 mt-2 font-mono text-xs flex items-center gap-2">
                <span className="w-2 h-2 bg-green-500 rounded-full"></span>
                LOGADO COMO: <span className="text-white font-bold">{currentUser.name}</span> ({currentUser.role})
                </p>
            )}
            {isEditMode && isAdmin && (
                <p className="text-red-400 mt-2 font-mono text-xs flex items-center gap-2">
                <span className="w-2 h-2 bg-red-500 rounded-full animate-pulse"></span>
                MODO DE EDIÇÃO ADMINISTRATIVA
                </p>
            )}
          </div>
          <div className="bg-yellow-500/10 border border-yellow-500/30 p-2 rounded">
             <div className="flex items-center gap-2 text-yellow-500 text-xs font-bold uppercase">
                <AlertTriangle size={14} /> Área de Desenvolvimento
             </div>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-8">
          
          {/* 1. DADOS DO PROJETO & EQUIPE */}
          <section className="bg-[#0f141e] p-6 rounded-sm border border-gray-700 relative overflow-hidden">
            <div className="absolute top-0 left-0 w-full h-1 bg-[repeating-linear-gradient(45deg,#fbbf24,#fbbf24_10px,#000_10px,#000_20px)]"></div>
            
            <h2 className="text-xl font-display font-bold text-white mb-6 flex items-center gap-2 uppercase tracking-wider">
              <span className="bg-senai-blue text-white w-6 h-6 flex items-center justify-center text-sm font-bold rounded-sm">1</span>
              Dados do Manifesto
            </h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="col-span-2 md:col-span-1">
                <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Título do Jogo *</label>
                <input 
                  type="text" required name="title" value={formData.title} onChange={handleInputChange}
                  className="w-full bg-black/40 border border-gray-700 p-3 text-white focus:border-senai-blue focus:outline-none transition-colors font-mono"
                  placeholder="Ex: CYBER PORT VIX"
                />
              </div>

              <div className="col-span-2 md:col-span-1">
                <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Setor (Turma) *</label>
                <select 
                  name="cohortId" value={formData.cohortId} onChange={handleInputChange}
                  className="w-full bg-black/40 border border-gray-700 p-3 text-white focus:border-senai-blue focus:outline-none transition-colors font-mono"
                >
                  {COHORTS.map(c => (
                    <option key={c.id} value={c.id} className="bg-gray-900">{c.name} ({c.year})</option>
                  ))}
                </select>
              </div>

              <div className="col-span-2">
                <label className="block text-xs font-bold text-gray-500 uppercase mb-2 flex items-center gap-2">
                    <Users size={14} /> Montar Tripulação (Equipe)
                </label>
                <div className="bg-black/30 border border-gray-700 p-4 rounded max-h-48 overflow-y-auto custom-scrollbar">
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2">
                        {students.map(student => (
                            <label key={student.id} className={`flex items-center gap-2 p-2 rounded cursor-pointer border transition-all ${formData.teamIds.includes(student.id) ? 'bg-senai-blue/20 border-senai-blue' : 'bg-gray-800 border-transparent hover:bg-gray-700'}`}>
                                <input 
                                    type="checkbox" 
                                    className="hidden" 
                                    checked={formData.teamIds.includes(student.id)}
                                    onChange={() => handleTeamSelection(student.id)}
                                />
                                <div className={`w-3 h-3 rounded-full ${formData.teamIds.includes(student.id) ? 'bg-senai-blue' : 'bg-gray-600'}`}></div>
                                <span className="text-sm text-gray-300 truncate">{student.name}</span>
                            </label>
                        ))}
                    </div>
                </div>
                {!isEditMode && <p className="text-[10px] text-gray-500 mt-2">* Você foi selecionado automaticamente. Selecione seus colegas para que eles apareçam nos créditos.</p>}
              </div>

              <div className="col-span-2">
                <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Descrição Breve (Resumo) *</label>
                <input 
                  type="text" required name="shortDescription" maxLength={150} value={formData.shortDescription} onChange={handleInputChange}
                  className="w-full bg-black/40 border border-gray-700 p-3 text-white focus:border-senai-blue focus:outline-none transition-colors font-mono"
                  placeholder="Resumo em uma frase para o card (máx 150 caracteres)"
                />
              </div>

              <div className="col-span-2">
                <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Descrição Técnica Completa</label>
                <textarea 
                  name="fullDescription" rows={5} value={formData.fullDescription} onChange={handleInputChange}
                  className="w-full bg-black/40 border border-gray-700 p-3 text-white focus:border-senai-blue focus:outline-none transition-colors font-mono text-sm"
                  placeholder="Conte a história do jogo, mecânicas, e detalhes interessantes..."
                />
              </div>
            </div>
          </section>

          {/* 2. ARQUIVOS E HOSPEDAGEM (Web/Embed vs Download) */}
          <section className="bg-[#0f141e] p-6 rounded-sm border border-gray-700 relative">
             <div className="absolute top-0 left-0 w-1 h-full bg-senai-blue"></div>
            <h2 className="text-xl font-display font-bold text-white mb-6 flex items-center gap-2 uppercase tracking-wider">
              <span className="bg-senai-blue text-white w-6 h-6 flex items-center justify-center text-sm font-bold rounded-sm">2</span>
              Arquivos & Hospedagem
            </h2>
            
            <div className="space-y-6">
               
               {/* WEB BUILD GUIDANCE */}
               <div className="bg-[#121824] p-4 rounded border border-green-900/50">
                  <div className="flex items-start gap-3 mb-4">
                      <FileCode className="text-green-500 mt-1" size={20}/>
                      <div>
                          <h3 className="text-white font-bold text-sm uppercase">Versão Web (Jogável no Navegador)</h3>
                          <p className="text-xs text-gray-400 mt-1 leading-relaxed">
                              Para que o jogo rode direto no portal, ele precisa ser exportado para <strong>WebGL</strong> e hospedado externamente.
                              Recomendamos: <a href="https://itch.io" target="_blank" className="text-green-400 hover:underline">itch.io</a> (copiar link embed), 
                              <a href="https://pages.github.com/" target="_blank" className="text-green-400 hover:underline ml-1">GitHub Pages</a>, ou 
                              <a href="https://vercel.com" target="_blank" className="text-green-400 hover:underline ml-1">Vercel</a>.
                          </p>
                      </div>
                  </div>
                  <label className="block text-xs font-bold text-green-500 uppercase mb-1">Link do Index.html / Embed URL</label>
                  <input 
                    type="text" name="webBuildUrl" value={formData.webBuildUrl} onChange={handleInputChange}
                    className="w-full bg-black/40 border border-green-900/50 p-3 text-white focus:border-green-500 focus:outline-none transition-colors font-mono text-sm"
                    placeholder="https://usuario.github.io/meu-jogo/index.html"
                  />
               </div>

               {/* DOWNLOADS GUIDANCE */}
               <div className="bg-[#121824] p-4 rounded border border-blue-900/50">
                  <div className="flex items-start gap-3 mb-4">
                      <UploadCloud className="text-blue-500 mt-1" size={20}/>
                      <div>
                          <h3 className="text-white font-bold text-sm uppercase">Versões para Download (Windows / Android)</h3>
                          <p className="text-xs text-gray-400 mt-1 leading-relaxed">
                              Arquivos pesados (.exe, .apk, .zip) devem ser hospedados em serviços de nuvem. 
                              Use o <strong>Google Drive, OneDrive, Dropbox</strong> ou <strong>itch.io</strong> e cole o link de compartilhamento público abaixo.
                          </p>
                      </div>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs font-bold text-gray-500 uppercase mb-1 flex items-center gap-1"><Monitor size={12}/> Windows (Link)</label>
                        <input type="text" name="downloadWin" value={formData.downloadWin} onChange={handleInputChange} className="w-full bg-black/40 border border-gray-700 p-2 text-white focus:border-senai-blue focus:outline-none text-sm" placeholder="https://drive.google.com/..." />
                      </div>
                      <div>
                        <label className="block text-xs font-bold text-gray-500 uppercase mb-1 flex items-center gap-1"><Smartphone size={12}/> Android .APK (Link)</label>
                        <input type="text" name="downloadAndroid" value={formData.downloadAndroid} onChange={handleInputChange} className="w-full bg-black/40 border border-gray-700 p-2 text-white focus:border-senai-blue focus:outline-none text-sm" placeholder="https://drive.google.com/..." />
                      </div>
                  </div>
               </div>

               {/* MEDIA LINKS */}
               <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-red-400 uppercase mb-1 flex items-center gap-2">
                      <Video size={14}/> Link do Trailer (YouTube)
                    </label>
                    <input 
                      type="text" name="videoUrl" value={formData.videoUrl} onChange={handleInputChange}
                      className="w-full bg-black/40 border border-red-900/50 p-3 text-white focus:border-red-500 focus:outline-none transition-colors font-mono text-sm"
                      placeholder="https://youtube.com/embed/..."
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-purple-400 uppercase mb-1 flex items-center gap-2">
                      <Presentation size={14}/> Slides (Canva/Google)
                    </label>
                    <input 
                      type="text" name="presentationUrl" value={formData.presentationUrl} onChange={handleInputChange}
                      className="w-full bg-black/40 border border-purple-900/50 p-3 text-white focus:border-purple-500 focus:outline-none transition-colors font-mono text-sm"
                      placeholder="Link de incorporação (Embed)"
                    />
                  </div>
               </div>
            </div>
          </section>

          {/* 3. MÍDIA VISUAL (UPLOADS) */}
          <section className="bg-[#0f141e] p-6 rounded-sm border border-gray-700 relative">
             <div className="absolute top-0 left-0 w-1 h-full bg-senai-blue"></div>
            <h2 className="text-xl font-display font-bold text-white mb-6 flex items-center gap-2 uppercase tracking-wider">
              <span className="bg-senai-blue text-white w-6 h-6 flex items-center justify-center text-sm font-bold rounded-sm">3</span>
              Mídia Visual (Imagens)
            </h2>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* Cover Upload */}
              <div>
                <div className="flex justify-between mb-2">
                    <label className="text-xs font-bold text-gray-500 uppercase">Capa Vertical *</label>
                    <span className="text-[10px] text-gray-600">300x400px (Max 2MB)</span>
                </div>
                <div className="relative group cursor-pointer border-2 border-dashed border-gray-700 hover:border-senai-blue rounded overflow-hidden h-48 flex flex-col items-center justify-center bg-black/20 transition-all">
                  <input type="file" accept="image/*" onChange={(e) => handleFileChange(e, 'cover')} className="absolute inset-0 opacity-0 cursor-pointer z-10" />
                  {coverPreview ? (
                    <img src={coverPreview} alt="Preview" className="w-full h-full object-cover" />
                  ) : (
                    <>
                      <ImageIcon className="text-gray-600 group-hover:text-senai-blue mb-2" size={24} />
                      <span className="text-[10px] text-gray-500 uppercase">Selecionar Arquivo</span>
                    </>
                  )}
                </div>
              </div>

              {/* Header Upload */}
              <div>
                <div className="flex justify-between mb-2">
                    <label className="text-xs font-bold text-gray-500 uppercase">Banner Horizontal *</label>
                    <span className="text-[10px] text-gray-600">600x300px (Max 2MB)</span>
                </div>
                <div className="relative group cursor-pointer border-2 border-dashed border-gray-700 hover:border-senai-blue rounded overflow-hidden h-48 flex flex-col items-center justify-center bg-black/20 transition-all">
                  <input type="file" accept="image/*" onChange={(e) => handleFileChange(e, 'header')} className="absolute inset-0 opacity-0 cursor-pointer z-10" />
                  {headerPreview ? (
                    <img src={headerPreview} alt="Preview" className="w-full h-full object-cover" />
                  ) : (
                    <>
                      <ImageIcon className="text-gray-600 group-hover:text-senai-blue mb-2" size={24} />
                      <span className="text-[10px] text-gray-500 uppercase">Selecionar Arquivo</span>
                    </>
                  )}
                </div>
              </div>

              {/* Background Upload */}
              <div>
                <div className="flex justify-between mb-2">
                    <label className="text-xs font-bold text-senai-blue uppercase">Background (Wallpaper)</label>
                    <span className="text-[10px] text-gray-600">1920x1080px (Recomendado)</span>
                </div>
                <div className="relative group cursor-pointer border-2 border-dashed border-gray-700 hover:border-white rounded overflow-hidden h-48 flex flex-col items-center justify-center bg-black/20 transition-all">
                  <input type="file" accept="image/*" onChange={(e) => handleFileChange(e, 'bg')} className="absolute inset-0 opacity-0 cursor-pointer z-10" />
                  {bgPreview ? (
                    <img src={bgPreview} alt="Preview" className="w-full h-full object-cover opacity-70" />
                  ) : (
                    <>
                      <ImageIcon className="text-gray-600 group-hover:text-white mb-2" size={24} />
                      <span className="text-[10px] text-gray-500 uppercase group-hover:text-white">Selecionar Arquivo</span>
                    </>
                  )}
                </div>
              </div>
            </div>
          </section>

           {/* 4. SPECS */}
           <section className="bg-[#0f141e] p-6 rounded-sm border border-gray-700 relative">
             <div className="absolute top-0 left-0 w-1 h-full bg-senai-blue"></div>
            <h2 className="text-xl font-display font-bold text-white mb-6 flex items-center gap-2 uppercase tracking-wider">
              <span className="bg-senai-blue text-white w-6 h-6 flex items-center justify-center text-sm font-bold rounded-sm">4</span>
              Especificações & Tags
            </h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="col-span-2">
                    <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Tags / Gêneros</label>
                    <input 
                    type="text" name="tags" value={formData.tags} onChange={handleInputChange}
                    className="w-full bg-black/40 border border-gray-700 p-3 text-white focus:border-senai-blue focus:outline-none transition-colors font-mono"
                    placeholder="Ex: AÇÃO, PUZZLE, 2D"
                    />
                </div>
                
                <div>
                   <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Requisito Processador</label>
                   <input type="text" name="reqProc" value={formData.reqProc} onChange={handleInputChange} className="w-full bg-black/40 border border-gray-700 p-2 text-white text-sm" />
                </div>
                <div>
                   <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Requisito Memória RAM</label>
                   <input type="text" name="reqMem" value={formData.reqMem} onChange={handleInputChange} className="w-full bg-black/40 border border-gray-700 p-2 text-white text-sm" />
                </div>
            </div>
          </section>

          {/* 5. INITIAL DEVLOG (ONLY FOR NEW PROJECTS) */}
          {!isEditMode && (
            <section className="bg-[#0f141e] p-6 rounded-sm border border-gray-700 relative">
               <div className="absolute top-0 left-0 w-1 h-full bg-senai-blue"></div>
              <h2 className="text-xl font-display font-bold text-white mb-6 flex items-center gap-2 uppercase tracking-wider">
                <span className="bg-senai-blue text-white w-6 h-6 flex items-center justify-center text-sm font-bold rounded-sm">5</span>
                Primeira Entrada no Diário (Devlog)
              </h2>
              
              <div className="bg-[#121824] p-4 rounded border border-gray-700 mb-4 flex gap-4">
                  <PenTool className="text-senai-blue flex-shrink-0" size={24} />
                  <div className="text-xs text-gray-400 leading-relaxed">
                      <strong className="text-white uppercase block mb-1">Inicie o registro de desenvolvimento</strong>
                      O "Devlog" é onde você compartilhará atualizações, novas artes, correções de bugs e progresso do projeto com a comunidade. Crie sua primeira postagem anunciando o projeto!
                  </div>
              </div>

              <div className="space-y-4">
                  <div>
                      <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Título do Anúncio</label>
                      <input 
                          type="text" 
                          value={initialDevlogTitle} 
                          onChange={(e) => setInitialDevlogTitle(e.target.value)}
                          className="w-full bg-black/40 border border-gray-700 p-3 text-white focus:border-senai-blue focus:outline-none transition-colors font-mono"
                          placeholder="Ex: Anúncio do Projeto"
                      />
                  </div>
                  <div>
                      <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Conteúdo</label>
                      <textarea 
                          rows={3} 
                          value={initialDevlogContent} 
                          onChange={(e) => setInitialDevlogContent(e.target.value)}
                          className="w-full bg-black/40 border border-gray-700 p-3 text-white focus:border-senai-blue focus:outline-none transition-colors font-mono text-sm"
                          placeholder="Escreva uma breve introdução..."
                      />
                  </div>
              </div>
            </section>
          )}

          <div className="flex justify-end pt-4">
             <button 
                type="submit" 
                disabled={isSubmitting}
                className={`
                    px-10 py-4 font-bold text-black uppercase tracking-widest shadow-lg transition-all flex items-center gap-2 clip-path-polygon
                    ${isSubmitting ? 'bg-gray-600 cursor-not-allowed' : 'bg-senai-blue hover:bg-white hover:scale-105 hover:shadow-senai-blue/50'}
                `}
                style={{ clipPath: 'polygon(10px 0, 100% 0, 100% calc(100% - 10px), calc(100% - 10px) 100%, 0 100%, 0 10px)' }}
             >
                {isSubmitting ? (isEditMode ? 'Salvando...' : 'Enviando...') : (isEditMode ? 'Salvar Alterações' : 'Finalizar Submissão')} 
                {!isSubmitting && (isEditMode ? <Save size={20} /> : <CheckCircle size={20} />)}
             </button>
          </div>

        </form>
      </div>
    </div>
  );
};

export default SubmitProject;
