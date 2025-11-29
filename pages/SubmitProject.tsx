
import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Link2, Image as ImageIcon, CheckCircle, Video, UserPlus, Users, Monitor, Smartphone, PenTool, AlertTriangle, Container, Presentation, Lock, FileCode, Save, HelpCircle, X, Plus, Trash2, ExternalLink, Film, ImagePlay, Key, Loader2 } from 'lucide-react';
import { COHORTS } from '../constants';
import { useGames } from '../context/GameContext';
import { Game, Student, Devlog, DevlogMedia } from '../types';

const SubmitProject: React.FC = () => {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>(); // Check if editing
  const { addGame, updateGame, games, students, loginStudent, isAdmin, changeStudentPassword } = useGames();
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const isEditMode = !!id;

  // Login State
  const [currentUser, setCurrentUser] = useState<Student | null>(null);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [loginError, setLoginError] = useState(false);

  // Modal de Ajuda
  const [showHelpModal, setShowHelpModal] = useState<'images' | 'files' | null>(null);

  // Modal de Alteração de Senha
  const [showChangePasswordModal, setShowChangePasswordModal] = useState(false);
  const [passwordForm, setPasswordForm] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });
  const [passwordError, setPasswordError] = useState<string | null>(null);
  const [passwordSuccess, setPasswordSuccess] = useState(false);
  const [isChangingPassword, setIsChangingPassword] = useState(false);

  // Determina se precisa mostrar o login
  // Admin não precisa, quem está editando não precisa, quem já logou não precisa
  const showLoginModal = !isAdmin && !isEditMode && !currentUser;

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
    reqStore: '1GB',
    // URLs das imagens (em vez de upload)
    coverImageUrl: '',
    headerImageUrl: '',
    backgroundImageUrl: '',
    screenshotsUrls: ''
  });

  // Devlog State (Only for edit mode)
  const [devlogs, setDevlogs] = useState<Devlog[]>([]);
  const [showDevlogEditor, setShowDevlogEditor] = useState(false);
  const [editingDevlog, setEditingDevlog] = useState<Devlog | null>(null);
  const [newDevlog, setNewDevlog] = useState<{
    title: string;
    content: string;
    tags: string;
    media: DevlogMedia[];
  }>({
    title: '',
    content: '',
    tags: '',
    media: []
  });

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
                reqStore: gameToEdit.systemRequirements.storage,
                coverImageUrl: gameToEdit.coverImage || '',
                headerImageUrl: gameToEdit.headerImage || '',
                backgroundImageUrl: gameToEdit.backgroundImage || '',
                screenshotsUrls: gameToEdit.screenshots?.join(', ') || ''
            });
            // Carregar devlogs existentes
            setDevlogs(gameToEdit.devlogs || []);
        }
    }
  }, [isEditMode, id, games]);

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

  // Funções para gerenciar devlogs
  const addMediaToDevlog = () => {
    setNewDevlog(prev => ({
      ...prev,
      media: [...prev.media, { type: 'image', url: '', caption: '' }]
    }));
  };

  const updateMediaItem = (index: number, field: keyof DevlogMedia, value: string) => {
    setNewDevlog(prev => ({
      ...prev,
      media: prev.media.map((m, i) => i === index ? { ...m, [field]: value } : m)
    }));
  };

  const removeMediaItem = (index: number) => {
    setNewDevlog(prev => ({
      ...prev,
      media: prev.media.filter((_, i) => i !== index)
    }));
  };

  const saveDevlog = () => {
    if (!newDevlog.title.trim() || !newDevlog.content.trim()) {
      alert('Preencha o título e o conteúdo do devlog.');
      return;
    }

    const devlogEntry: Devlog = {
      id: editingDevlog?.id || `log-${Date.now()}`,
      date: editingDevlog?.date || new Date().toLocaleDateString('pt-BR', { day: '2-digit', month: 'short', year: 'numeric' }),
      authorId: currentUser?.id || 'admin',
      title: newDevlog.title,
      content: newDevlog.content,
      tags: newDevlog.tags.split(',').map(t => t.trim()).filter(t => t.length > 0),
      media: newDevlog.media.filter(m => m.url.trim().length > 0)
    };

    if (editingDevlog) {
      setDevlogs(prev => prev.map(d => d.id === editingDevlog.id ? devlogEntry : d));
    } else {
      setDevlogs(prev => [devlogEntry, ...prev]);
    }

    // Reset form
    setNewDevlog({ title: '', content: '', tags: '', media: [] });
    setEditingDevlog(null);
    setShowDevlogEditor(false);
  };

  const editDevlog = (devlog: Devlog) => {
    setEditingDevlog(devlog);
    setNewDevlog({
      title: devlog.title,
      content: devlog.content,
      tags: devlog.tags.join(', '),
      media: devlog.media || []
    });
    setShowDevlogEditor(true);
  };

  const deleteDevlog = (devlogId: string) => {
    if (confirm('Tem certeza que deseja excluir este devlog?')) {
      setDevlogs(prev => prev.filter(d => d.id !== devlogId));
    }
  };

  const handleLogin = () => {
      const student = loginStudent(username, password);
      if (student) {
          setCurrentUser(student);
          // Auto-select current user for the team
          setFormData(prev => ({ ...prev, teamIds: [student.id] }));
          setLoginError(false);
      } else {
          setLoginError(true);
      }
  };

  // Função para alterar senha
  const handleChangePassword = async () => {
    setPasswordError(null);
    setPasswordSuccess(false);
    
    // Validações
    if (!passwordForm.currentPassword) {
      setPasswordError('Digite sua senha atual.');
      return;
    }
    
    if (!passwordForm.newPassword) {
      setPasswordError('Digite a nova senha.');
      return;
    }
    
    if (passwordForm.newPassword.length < 3) {
      setPasswordError('A nova senha deve ter pelo menos 3 caracteres.');
      return;
    }
    
    if (passwordForm.newPassword !== passwordForm.confirmPassword) {
      setPasswordError('As senhas não coincidem.');
      return;
    }
    
    if (!currentUser) {
      setPasswordError('Você precisa estar logado.');
      return;
    }
    
    setIsChangingPassword(true);
    
    const result = await changeStudentPassword(
      currentUser.id,
      passwordForm.currentPassword,
      passwordForm.newPassword
    );
    
    setIsChangingPassword(false);
    
    if (result.success) {
      setPasswordSuccess(true);
      setPasswordForm({ currentPassword: '', newPassword: '', confirmPassword: '' });
      // Atualiza o currentUser com a nova senha
      setCurrentUser(prev => prev ? { ...prev, password: passwordForm.newPassword } : null);
      // Fecha o modal após 2 segundos
      setTimeout(() => {
        setShowChangePasswordModal(false);
        setPasswordSuccess(false);
      }, 2000);
    } else {
      setPasswordError(result.error || 'Erro ao alterar senha.');
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    // Precisa estar logado como admin OU como aluno para enviar
    if (!currentUser && !isAdmin) {
      alert('Você precisa fazer login para enviar um projeto.');
      return;
    }
    setIsSubmitting(true);

    try {
      // Parse screenshots URLs (separados por vírgula)
      const screenshotsList = formData.screenshotsUrls
        ? formData.screenshotsUrls.split(',').map(url => url.trim()).filter(url => url.length > 0)
        : (isEditMode ? (games.find(g => g.id === id)?.screenshots || []) : []);

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
        // No modo de edição, usar os devlogs gerenciados; em novo projeto, começa vazio
        devlogs: isEditMode ? devlogs : [], 
        tags: formData.tags.split(',').map(t => t.trim()).filter(t => t.length > 0),
        
        // URLs das imagens (links diretos)
        coverImage: formData.coverImageUrl || 'https://picsum.photos/300/400',
        headerImage: formData.headerImageUrl || 'https://picsum.photos/600/300',
        backgroundImage: formData.backgroundImageUrl || undefined, 
        screenshots: screenshotsList, 
        
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
          await updateGame({ id, ...gamePayload });
          navigate(`/game/${id}`);
      } else {
          const newGameId = await addGame(gamePayload);
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
      
      {/* MODAL DE ALTERAÇÃO DE SENHA */}
      {showChangePasswordModal && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4">
          <div className="bg-[#121824] border border-senai-blue/30 p-6 rounded-lg max-w-md w-full shadow-2xl">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-display font-bold text-white uppercase flex items-center gap-2">
                <Key className="text-senai-blue" size={20} />
                Alterar Senha
              </h3>
              <button 
                onClick={() => {
                  setShowChangePasswordModal(false);
                  setPasswordError(null);
                  setPasswordSuccess(false);
                  setPasswordForm({ currentPassword: '', newPassword: '', confirmPassword: '' });
                }}
                className="text-gray-400 hover:text-white"
              >
                <X size={20} />
              </button>
            </div>
            
            {passwordSuccess ? (
              <div className="text-center py-8">
                <CheckCircle className="mx-auto text-green-500 w-16 h-16 mb-4" />
                <p className="text-green-400 text-lg font-bold">Senha alterada com sucesso!</p>
              </div>
            ) : (
              <div className="space-y-4">
                <div>
                  <label className="text-xs uppercase font-bold text-gray-500 block mb-1">Senha Atual</label>
                  <input 
                    type="password" 
                    className="w-full bg-black/40 border border-gray-700 p-3 text-white focus:border-senai-blue outline-none rounded"
                    value={passwordForm.currentPassword}
                    onChange={(e) => setPasswordForm(prev => ({ ...prev, currentPassword: e.target.value }))}
                    placeholder="Digite sua senha atual"
                  />
                </div>
                <div>
                  <label className="text-xs uppercase font-bold text-gray-500 block mb-1">Nova Senha</label>
                  <input 
                    type="password" 
                    className="w-full bg-black/40 border border-gray-700 p-3 text-white focus:border-senai-blue outline-none rounded"
                    value={passwordForm.newPassword}
                    onChange={(e) => setPasswordForm(prev => ({ ...prev, newPassword: e.target.value }))}
                    placeholder="Digite a nova senha (mín. 3 caracteres)"
                  />
                </div>
                <div>
                  <label className="text-xs uppercase font-bold text-gray-500 block mb-1">Confirmar Nova Senha</label>
                  <input 
                    type="password" 
                    className="w-full bg-black/40 border border-gray-700 p-3 text-white focus:border-senai-blue outline-none rounded"
                    value={passwordForm.confirmPassword}
                    onChange={(e) => setPasswordForm(prev => ({ ...prev, confirmPassword: e.target.value }))}
                    placeholder="Confirme a nova senha"
                  />
                </div>
                
                {passwordError && (
                  <div className="text-red-500 text-xs text-center border border-red-500/20 bg-red-500/10 p-2 rounded">
                    {passwordError}
                  </div>
                )}
                
                <div className="flex gap-3 pt-2">
                  <button 
                    onClick={() => {
                      setShowChangePasswordModal(false);
                      setPasswordError(null);
                      setPasswordForm({ currentPassword: '', newPassword: '', confirmPassword: '' });
                    }}
                    className="flex-1 py-3 bg-gray-700 hover:bg-gray-600 text-white font-bold uppercase rounded text-sm transition-colors"
                  >
                    Cancelar
                  </button>
                  <button 
                    onClick={handleChangePassword}
                    disabled={isChangingPassword}
                    className="flex-1 py-3 bg-senai-blue hover:bg-white hover:text-senai-blue text-white font-bold uppercase rounded text-sm transition-colors flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {isChangingPassword ? (
                      <>
                        <Loader2 size={14} className="animate-spin" />
                        Salvando...
                      </>
                    ) : (
                      <>
                        <Save size={14} />
                        Salvar
                      </>
                    )}
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
      
      <div className="max-w-5xl mx-auto px-4 py-8">
        
        <div className="mb-8 border-b-2 border-senai-blue pb-4 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-display font-bold text-white flex items-center gap-3 uppercase tracking-widest">
              <Container className="text-senai-blue" size={32} />
              {isEditMode ? 'Editar Manifesto (Projeto)' : 'Registro de Carga (Novo Projeto)'}
            </h1>
            {!isEditMode && currentUser && (
                <div className="flex items-center gap-4">
                  <p className="text-gray-400 mt-2 font-mono text-xs flex items-center gap-2">
                    <span className="w-2 h-2 bg-green-500 rounded-full"></span>
                    LOGADO COMO: <span className="text-white font-bold">{currentUser.name}</span> ({currentUser.role})
                  </p>
                  <button
                    onClick={() => setShowChangePasswordModal(true)}
                    className="mt-2 text-xs bg-gray-700 hover:bg-gray-600 text-gray-300 px-3 py-1 rounded flex items-center gap-1 transition-colors"
                    title="Alterar senha"
                  >
                    <Key size={12} /> Alterar Senha
                  </button>
                </div>
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
                <div className="bg-black/30 border border-gray-700 p-4 rounded max-h-80 overflow-y-auto custom-scrollbar">
                    {COHORTS.map(cohort => {
                        const cohortStudents = students.filter(s => s.cohortId === cohort.id);
                        if (cohortStudents.length === 0) return null;
                        return (
                            <div key={cohort.id} className="mb-4 last:mb-0">
                                <h4 className="text-xs font-bold text-senai-blue uppercase mb-2 border-b border-gray-700 pb-1 flex items-center gap-2">
                                    <span className="bg-senai-blue/20 px-2 py-0.5 rounded">{cohort.name}</span>
                                    <span className="text-gray-500">({cohort.year})</span>
                                    <span className="text-gray-600 text-[10px] ml-auto">{cohortStudents.length} alunos</span>
                                </h4>
                                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2">
                                    {cohortStudents.map(student => (
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
                        );
                    })}
                    {/* Alunos sem turma definida */}
                    {students.filter(s => !s.cohortId).length > 0 && (
                        <div className="mb-4 last:mb-0">
                            <h4 className="text-xs font-bold text-gray-400 uppercase mb-2 border-b border-gray-700 pb-1 flex items-center gap-2">
                                <span className="bg-gray-700/50 px-2 py-0.5 rounded">Sem Turma Definida</span>
                                <span className="text-gray-600 text-[10px] ml-auto">{students.filter(s => !s.cohortId).length} alunos</span>
                            </h4>
                            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2">
                                {students.filter(s => !s.cohortId).map(student => (
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
                    )}
                    {students.length === 0 && (
                        <p className="text-gray-500 text-sm text-center py-4">Nenhum aluno cadastrado ainda.</p>
                    )}
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
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-display font-bold text-white flex items-center gap-2 uppercase tracking-wider">
                <span className="bg-senai-blue text-white w-6 h-6 flex items-center justify-center text-sm font-bold rounded-sm">2</span>
                Arquivos & Hospedagem
              </h2>
              <button 
                type="button"
                onClick={() => setShowHelpModal('files')}
                className="flex items-center gap-1 text-xs text-senai-blue hover:text-white bg-senai-blue/10 hover:bg-senai-blue px-3 py-1.5 rounded transition-colors"
              >
                <HelpCircle size={14} /> Como fazer?
              </button>
            </div>
            
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
                      <Link2 className="text-blue-500 mt-1" size={20}/>
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

          {/* 3. MÍDIA VISUAL (URLs) */}
          <section className="bg-[#0f141e] p-6 rounded-sm border border-gray-700 relative">
             <div className="absolute top-0 left-0 w-1 h-full bg-senai-blue"></div>
            <h2 className="text-xl font-display font-bold text-white mb-6 flex items-center justify-between">
              <div className="flex items-center gap-2 uppercase tracking-wider">
                <span className="bg-senai-blue text-white w-6 h-6 flex items-center justify-center text-sm font-bold rounded-sm">3</span>
                Mídia Visual (Links das Imagens)
              </div>
              <button
                type="button"
                onClick={() => setShowHelpModal('images')}
                className="flex items-center gap-1 text-xs text-senai-blue hover:text-white transition-colors bg-senai-blue/10 hover:bg-senai-blue/30 px-3 py-1.5 rounded"
              >
                <HelpCircle size={14}/> Como fazer?
              </button>
            </h2>

            <div className="bg-[#121824] p-4 rounded border border-gray-700 mb-6">
              <div className="flex items-start gap-3">
                <Link2 className="text-senai-blue flex-shrink-0 mt-1" size={20}/>
                <div className="text-xs text-gray-400 leading-relaxed">
                  <strong className="text-white uppercase block mb-1">Como hospedar imagens gratuitamente</strong>
                  Use serviços como <a href="https://imgur.com" target="_blank" className="text-senai-blue hover:underline">Imgur</a>, 
                  <a href="https://imgbb.com" target="_blank" className="text-senai-blue hover:underline ml-1">ImgBB</a>, ou 
                  <a href="https://postimages.org" target="_blank" className="text-senai-blue hover:underline ml-1">PostImages</a> para fazer upload e copiar o link direto da imagem.
                </div>
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Cover URL */}
              <div>
                <label className="block text-xs font-bold text-gray-500 uppercase mb-1 flex items-center gap-2">
                  <ImageIcon size={14}/> URL da Capa Vertical *
                </label>
                <input 
                  type="text" name="coverImageUrl" value={formData.coverImageUrl} onChange={handleInputChange}
                  className="w-full bg-black/40 border border-gray-700 p-3 text-white focus:border-senai-blue focus:outline-none transition-colors font-mono text-sm"
                  placeholder="https://i.imgur.com/exemplo.png"
                />
                <span className="text-[10px] text-gray-600">Recomendado: 300x400px</span>
                {formData.coverImageUrl && (
                  <div className="mt-2 h-24 w-16 overflow-hidden rounded border border-gray-700">
                    <img src={formData.coverImageUrl} alt="Preview" className="w-full h-full object-cover" onError={(e) => (e.currentTarget.style.display = 'none')} />
                  </div>
                )}
              </div>

              {/* Header URL */}
              <div>
                <label className="block text-xs font-bold text-gray-500 uppercase mb-1 flex items-center gap-2">
                  <ImageIcon size={14}/> URL do Banner Horizontal *
                </label>
                <input 
                  type="text" name="headerImageUrl" value={formData.headerImageUrl} onChange={handleInputChange}
                  className="w-full bg-black/40 border border-gray-700 p-3 text-white focus:border-senai-blue focus:outline-none transition-colors font-mono text-sm"
                  placeholder="https://i.imgur.com/exemplo.png"
                />
                <span className="text-[10px] text-gray-600">Recomendado: 600x300px</span>
                {formData.headerImageUrl && (
                  <div className="mt-2 h-16 w-32 overflow-hidden rounded border border-gray-700">
                    <img src={formData.headerImageUrl} alt="Preview" className="w-full h-full object-cover" onError={(e) => (e.currentTarget.style.display = 'none')} />
                  </div>
                )}
              </div>

              {/* Background URL */}
              <div>
                <label className="block text-xs font-bold text-senai-blue uppercase mb-1 flex items-center gap-2">
                  <ImageIcon size={14}/> URL do Background (Opcional)
                </label>
                <input 
                  type="text" name="backgroundImageUrl" value={formData.backgroundImageUrl} onChange={handleInputChange}
                  className="w-full bg-black/40 border border-gray-700 p-3 text-white focus:border-senai-blue focus:outline-none transition-colors font-mono text-sm"
                  placeholder="https://i.imgur.com/exemplo.png"
                />
                <span className="text-[10px] text-gray-600">Recomendado: 1920x1080px</span>
              </div>

              {/* Screenshots URLs */}
              <div>
                <label className="block text-xs font-bold text-gray-500 uppercase mb-1 flex items-center gap-2">
                  <ImageIcon size={14}/> URLs das Screenshots (Opcional)
                </label>
                <input 
                  type="text" name="screenshotsUrls" value={formData.screenshotsUrls} onChange={handleInputChange}
                  className="w-full bg-black/40 border border-gray-700 p-3 text-white focus:border-senai-blue focus:outline-none transition-colors font-mono text-sm"
                  placeholder="url1, url2, url3 (separadas por vírgula)"
                />
                <span className="text-[10px] text-gray-600">Separe múltiplos links com vírgula</span>
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

          {/* 5. DEVLOGS (ONLY FOR EDIT MODE) */}
          {isEditMode && (
            <section className="bg-[#0f141e] p-6 rounded-sm border border-gray-700 relative">
               <div className="absolute top-0 left-0 w-1 h-full bg-purple-500"></div>
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-display font-bold text-white flex items-center gap-2 uppercase tracking-wider">
                  <span className="bg-purple-500 text-white w-6 h-6 flex items-center justify-center text-sm font-bold rounded-sm">5</span>
                  Diário de Desenvolvimento (Devlogs)
                </h2>
                <button
                  type="button"
                  onClick={() => {
                    setEditingDevlog(null);
                    setNewDevlog({ title: '', content: '', tags: '', media: [] });
                    setShowDevlogEditor(true);
                  }}
                  className="flex items-center gap-2 text-sm text-purple-400 hover:text-white bg-purple-500/20 hover:bg-purple-500 px-4 py-2 rounded transition-colors"
                >
                  <Plus size={16}/> Novo Devlog
                </button>
              </div>
              
              <div className="bg-[#121824] p-4 rounded border border-gray-700 mb-4 flex gap-4">
                  <PenTool className="text-purple-400 flex-shrink-0" size={24} />
                  <div className="text-xs text-gray-400 leading-relaxed">
                      <strong className="text-white uppercase block mb-1">Mantenha a comunidade atualizada</strong>
                      Adicione devlogs com atualizações, novidades, correções de bugs e progresso do desenvolvimento. 
                      Você pode incluir imagens, GIFs, vídeos do YouTube e links externos.
                  </div>
              </div>

              {/* Lista de Devlogs existentes */}
              <div className="space-y-3">
                {devlogs.length === 0 ? (
                  <div className="text-center py-8 text-gray-500">
                    <PenTool size={32} className="mx-auto mb-2 opacity-50"/>
                    <p className="text-sm">Nenhum devlog ainda. Clique em "Novo Devlog" para criar o primeiro!</p>
                  </div>
                ) : (
                  devlogs.map(devlog => (
                    <div key={devlog.id} className="bg-black/30 border border-gray-700 rounded p-4 hover:border-purple-500/50 transition-colors">
                      <div className="flex items-start justify-between gap-4">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-1">
                            <span className="text-xs text-gray-500">{devlog.date}</span>
                            {devlog.tags.map(tag => (
                              <span key={tag} className="text-[10px] bg-purple-500/20 text-purple-400 px-1.5 py-0.5 rounded">{tag}</span>
                            ))}
                          </div>
                          <h4 className="text-white font-bold">{devlog.title}</h4>
                          <p className="text-gray-400 text-sm mt-1 line-clamp-2">{devlog.content}</p>
                          {devlog.media && devlog.media.length > 0 && (
                            <div className="flex items-center gap-2 mt-2">
                              <span className="text-xs text-gray-500 flex items-center gap-1">
                                <ImageIcon size={12}/> {devlog.media.filter(m => m.type === 'image' || m.type === 'gif').length} mídia(s)
                              </span>
                              {devlog.media.some(m => m.type === 'video') && (
                                <span className="text-xs text-red-400 flex items-center gap-1">
                                  <Video size={12}/> Vídeo
                                </span>
                              )}
                              {devlog.media.some(m => m.type === 'link') && (
                                <span className="text-xs text-blue-400 flex items-center gap-1">
                                  <ExternalLink size={12}/> Links
                                </span>
                              )}
                            </div>
                          )}
                        </div>
                        <div className="flex items-center gap-2">
                          <button
                            type="button"
                            onClick={() => editDevlog(devlog)}
                            className="text-gray-400 hover:text-white p-1.5 hover:bg-white/10 rounded transition-colors"
                            title="Editar"
                          >
                            <PenTool size={16}/>
                          </button>
                          <button
                            type="button"
                            onClick={() => deleteDevlog(devlog.id)}
                            className="text-gray-400 hover:text-red-400 p-1.5 hover:bg-red-500/10 rounded transition-colors"
                            title="Excluir"
                          >
                            <Trash2 size={16}/>
                          </button>
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>

              {/* Editor de Devlog (Modal inline) */}
              {showDevlogEditor && (
                <div className="mt-6 bg-purple-900/10 border border-purple-500/30 rounded-lg p-6">
                  <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
                    <PenTool className="text-purple-400" size={20}/>
                    {editingDevlog ? 'Editar Devlog' : 'Novo Devlog'}
                  </h3>
                  
                  <div className="space-y-4">
                    <div>
                      <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Título *</label>
                      <input 
                        type="text"
                        value={newDevlog.title}
                        onChange={(e) => setNewDevlog(prev => ({ ...prev, title: e.target.value }))}
                        className="w-full bg-black/40 border border-gray-700 p-3 text-white focus:border-purple-500 focus:outline-none transition-colors"
                        placeholder="Ex: Nova atualização v1.2"
                      />
                    </div>
                    
                    <div>
                      <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Conteúdo *</label>
                      <textarea 
                        rows={5}
                        value={newDevlog.content}
                        onChange={(e) => setNewDevlog(prev => ({ ...prev, content: e.target.value }))}
                        className="w-full bg-black/40 border border-gray-700 p-3 text-white focus:border-purple-500 focus:outline-none transition-colors text-sm"
                        placeholder="Descreva as novidades, mudanças, correções..."
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Tags (separadas por vírgula)</label>
                      <input 
                        type="text"
                        value={newDevlog.tags}
                        onChange={(e) => setNewDevlog(prev => ({ ...prev, tags: e.target.value }))}
                        className="w-full bg-black/40 border border-gray-700 p-2 text-white focus:border-purple-500 focus:outline-none transition-colors text-sm"
                        placeholder="Ex: Update, Arte, Bug Fix"
                      />
                    </div>

                    {/* Seção de Mídia */}
                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <label className="block text-xs font-bold text-gray-500 uppercase">Mídia (Imagens, GIFs, Vídeos, Links)</label>
                        <button
                          type="button"
                          onClick={addMediaToDevlog}
                          className="text-xs text-purple-400 hover:text-white flex items-center gap-1"
                        >
                          <Plus size={14}/> Adicionar Mídia
                        </button>
                      </div>
                      
                      <div className="space-y-3">
                        {newDevlog.media.map((media, index) => (
                          <div key={index} className="bg-black/30 p-3 rounded border border-gray-700 flex items-start gap-3">
                            <select
                              value={media.type}
                              onChange={(e) => updateMediaItem(index, 'type', e.target.value)}
                              className="bg-gray-800 border border-gray-600 text-white text-xs p-2 rounded"
                            >
                              <option value="image">🖼️ Imagem</option>
                              <option value="gif">🎞️ GIF</option>
                              <option value="video">🎬 Vídeo (YouTube)</option>
                              <option value="link">🔗 Link</option>
                            </select>
                            <div className="flex-1 space-y-2">
                              <input 
                                type="text"
                                value={media.url}
                                onChange={(e) => updateMediaItem(index, 'url', e.target.value)}
                                className="w-full bg-black/50 border border-gray-600 p-2 text-white text-sm rounded"
                                placeholder={
                                  media.type === 'video' 
                                    ? 'https://youtube.com/embed/...' 
                                    : media.type === 'link'
                                    ? 'https://exemplo.com'
                                    : 'https://i.imgur.com/exemplo.png'
                                }
                              />
                              <input 
                                type="text"
                                value={media.caption || ''}
                                onChange={(e) => updateMediaItem(index, 'caption', e.target.value)}
                                className="w-full bg-black/50 border border-gray-600 p-2 text-white text-xs rounded"
                                placeholder="Legenda (opcional)"
                              />
                            </div>
                            <button
                              type="button"
                              onClick={() => removeMediaItem(index)}
                              className="text-red-400 hover:text-red-300 p-1"
                            >
                              <Trash2 size={16}/>
                            </button>
                          </div>
                        ))}
                        
                        {newDevlog.media.length === 0 && (
                          <div className="text-center py-4 text-gray-500 text-xs border border-dashed border-gray-700 rounded">
                            Clique em "Adicionar Mídia" para incluir imagens, GIFs, vídeos ou links
                          </div>
                        )}
                      </div>
                    </div>

                    <div className="flex items-center justify-end gap-3 pt-4 border-t border-gray-700">
                      <button
                        type="button"
                        onClick={() => {
                          setShowDevlogEditor(false);
                          setEditingDevlog(null);
                          setNewDevlog({ title: '', content: '', tags: '', media: [] });
                        }}
                        className="px-4 py-2 text-gray-400 hover:text-white transition-colors"
                      >
                        Cancelar
                      </button>
                      <button
                        type="button"
                        onClick={saveDevlog}
                        className="px-6 py-2 bg-purple-500 hover:bg-purple-400 text-white font-bold rounded transition-colors flex items-center gap-2"
                      >
                        <Save size={16}/> {editingDevlog ? 'Salvar Alterações' : 'Adicionar Devlog'}
                      </button>
                    </div>
                  </div>
                </div>
              )}
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

      {/* Modal de Ajuda */}
      {showHelpModal && (
        <div className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-4" onClick={() => setShowHelpModal(null)}>
          <div 
            className="bg-[#0f141e] border border-gray-700 rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="sticky top-0 bg-[#0f141e] border-b border-gray-700 p-4 flex items-center justify-between">
              <h3 className="text-xl font-bold text-white flex items-center gap-2">
                <HelpCircle className="text-senai-blue" size={24}/>
                {showHelpModal === 'files' ? 'Como hospedar seu jogo' : 'Como hospedar imagens'}
              </h3>
              <button 
                onClick={() => setShowHelpModal(null)}
                className="text-gray-400 hover:text-white transition-colors"
              >
                <X size={24}/>
              </button>
            </div>
            
            <div className="p-6">
              {showHelpModal === 'files' ? (
                <div className="space-y-6">
                  <div className="bg-gradient-to-r from-green-900/30 to-transparent p-4 rounded border-l-4 border-green-500">
                    <h4 className="font-bold text-green-400 uppercase text-sm mb-2">🎮 Opção 1: Itch.io (Recomendado para jogos WebGL)</h4>
                    <ol className="text-sm text-gray-300 space-y-2 list-decimal list-inside">
                      <li>Acesse <a href="https://itch.io" target="_blank" className="text-senai-blue hover:underline">itch.io</a> e crie uma conta gratuita</li>
                      <li>Clique em <strong className="text-white">"Dashboard"</strong> → <strong className="text-white">"Create new project"</strong></li>
                      <li>Preencha o título do jogo e selecione <strong className="text-white">"HTML"</strong> como tipo</li>
                      <li>Faça upload do arquivo <strong className="text-white">.zip</strong> contendo seu jogo (pasta Build do Unity WebGL)</li>
                      <li>Marque <strong className="text-white">"This file will be played in the browser"</strong></li>
                      <li>Defina as dimensões (ex: 960x600) e clique em <strong className="text-white">"Save"</strong></li>
                      <li>Copie a URL do jogo (ex: <code className="bg-black/50 px-1 rounded">https://seuuser.itch.io/nomedojogo</code>)</li>
                    </ol>
                  </div>

                  <div className="bg-gradient-to-r from-purple-900/30 to-transparent p-4 rounded border-l-4 border-purple-500">
                    <h4 className="font-bold text-purple-400 uppercase text-sm mb-2">🔗 Opção 2: GitHub Pages (Gratuito)</h4>
                    <ol className="text-sm text-gray-300 space-y-2 list-decimal list-inside">
                      <li>Crie um repositório no <a href="https://github.com" target="_blank" className="text-senai-blue hover:underline">GitHub</a></li>
                      <li>Faça upload dos arquivos do build WebGL</li>
                      <li>Vá em <strong className="text-white">"Settings"</strong> → <strong className="text-white">"Pages"</strong></li>
                      <li>Selecione a branch <strong className="text-white">"main"</strong> e clique em <strong className="text-white">"Save"</strong></li>
                      <li>Seu jogo estará em <code className="bg-black/50 px-1 rounded">https://seuuser.github.io/repositorio</code></li>
                    </ol>
                  </div>

                  <div className="bg-gradient-to-r from-orange-900/30 to-transparent p-4 rounded border-l-4 border-orange-500">
                    <h4 className="font-bold text-orange-400 uppercase text-sm mb-2">📦 Opção 3: Google Drive (Para Download)</h4>
                    <ol className="text-sm text-gray-300 space-y-2 list-decimal list-inside">
                      <li>Compacte seu jogo em um arquivo <strong className="text-white">.zip</strong></li>
                      <li>Faça upload para o <a href="https://drive.google.com" target="_blank" className="text-senai-blue hover:underline">Google Drive</a></li>
                      <li>Clique com botão direito → <strong className="text-white">"Compartilhar"</strong></li>
                      <li>Mude para <strong className="text-white">"Qualquer pessoa com o link"</strong></li>
                      <li>Copie o link e cole no campo <strong className="text-white">"Link do Download"</strong></li>
                    </ol>
                  </div>

                  <div className="bg-blue-900/20 p-4 rounded border border-blue-800">
                    <p className="text-sm text-blue-300">
                      <strong>💡 Dica:</strong> Para jogos Unity WebGL, exporte com <strong className="text-white">Compression: Disabled</strong> para melhor compatibilidade.
                    </p>
                  </div>
                </div>
              ) : (
                <div className="space-y-6">
                  <div className="bg-gradient-to-r from-green-900/30 to-transparent p-4 rounded border-l-4 border-green-500">
                    <h4 className="font-bold text-green-400 uppercase text-sm mb-2">📷 Opção 1: Imgur (Mais fácil)</h4>
                    <ol className="text-sm text-gray-300 space-y-2 list-decimal list-inside">
                      <li>Acesse <a href="https://imgur.com/upload" target="_blank" className="text-senai-blue hover:underline">imgur.com/upload</a></li>
                      <li>Arraste sua imagem ou clique para selecionar</li>
                      <li>Aguarde o upload completar</li>
                      <li>Clique com <strong className="text-white">botão direito na imagem</strong> → <strong className="text-white">"Copiar endereço da imagem"</strong></li>
                      <li>O link deve terminar em <code className="bg-black/50 px-1 rounded">.png</code>, <code className="bg-black/50 px-1 rounded">.jpg</code> ou <code className="bg-black/50 px-1 rounded">.gif</code></li>
                    </ol>
                    <div className="mt-3 p-2 bg-black/30 rounded">
                      <span className="text-xs text-gray-500">Exemplo de link correto:</span>
                      <code className="block text-green-400 text-sm mt-1">https://i.imgur.com/ABC123x.png</code>
                    </div>
                  </div>

                  <div className="bg-gradient-to-r from-purple-900/30 to-transparent p-4 rounded border-l-4 border-purple-500">
                    <h4 className="font-bold text-purple-400 uppercase text-sm mb-2">🖼️ Opção 2: ImgBB</h4>
                    <ol className="text-sm text-gray-300 space-y-2 list-decimal list-inside">
                      <li>Acesse <a href="https://imgbb.com" target="_blank" className="text-senai-blue hover:underline">imgbb.com</a></li>
                      <li>Clique em <strong className="text-white">"Start uploading"</strong></li>
                      <li>Selecione sua imagem</li>
                      <li>Após o upload, clique em <strong className="text-white">"Direct link"</strong> para copiar</li>
                    </ol>
                  </div>

                  <div className="bg-gradient-to-r from-orange-900/30 to-transparent p-4 rounded border-l-4 border-orange-500">
                    <h4 className="font-bold text-orange-400 uppercase text-sm mb-2">☁️ Opção 3: PostImages</h4>
                    <ol className="text-sm text-gray-300 space-y-2 list-decimal list-inside">
                      <li>Acesse <a href="https://postimages.org" target="_blank" className="text-senai-blue hover:underline">postimages.org</a></li>
                      <li>Selecione sua imagem e faça o upload</li>
                      <li>Copie o <strong className="text-white">"Direct link"</strong></li>
                    </ol>
                  </div>

                  <div className="bg-yellow-900/20 p-4 rounded border border-yellow-800">
                    <p className="text-sm text-yellow-300">
                      <strong>⚠️ Importante:</strong> O link deve ser uma <strong className="text-white">URL direta da imagem</strong>, não a página do site. 
                      Teste colando o link no navegador - deve abrir apenas a imagem.
                    </p>
                  </div>

                  <div className="bg-blue-900/20 p-4 rounded border border-blue-800">
                    <h5 className="font-bold text-blue-400 text-sm mb-2">📐 Tamanhos recomendados:</h5>
                    <ul className="text-sm text-gray-300 space-y-1">
                      <li>• <strong className="text-white">Capa Vertical:</strong> 300 x 400 pixels</li>
                      <li>• <strong className="text-white">Banner Horizontal:</strong> 1200 x 400 pixels</li>
                      <li>• <strong className="text-white">Screenshots:</strong> 1920 x 1080 pixels (16:9)</li>
                    </ul>
                  </div>
                </div>
              )}
            </div>

            <div className="sticky bottom-0 bg-[#0f141e] border-t border-gray-700 p-4">
              <button
                onClick={() => setShowHelpModal(null)}
                className="w-full bg-senai-blue hover:bg-senai-blue/80 text-black font-bold py-3 rounded transition-colors"
              >
                Entendi!
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default SubmitProject;
