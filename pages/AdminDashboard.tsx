
import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Shield, Users, Box, Plus, Trash2, LogOut, Terminal, Save, X, Eye, PenTool, Loader2, Database } from 'lucide-react';
import { useGames } from '../context/GameContext';

const AdminDashboard: React.FC = () => {
  const { isAdmin, students, games, deleteGame, deleteStudent, registerStudent, logoutAdmin, loading, seedDatabase } = useGames();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<'students' | 'games'>('students');
  const [isProcessing, setIsProcessing] = useState(false);
  
  // Add Student Form State
  const [showAddStudent, setShowAddStudent] = useState(false);
  const [newStudentName, setNewStudentName] = useState('');
  const [newStudentUser, setNewStudentUser] = useState('');
  const [newStudentPass, setNewStudentPass] = useState('');
  const [newStudentRole, setNewStudentRole] = useState('Programador');

  useEffect(() => {
    if (!isAdmin) {
      navigate('/admin');
    }
  }, [isAdmin, navigate]);

  const handleLogout = async () => {
    await logoutAdmin();
    navigate('/');
  };

  const handleAddStudent = async (e: React.FormEvent) => {
    e.preventDefault();
    if(newStudentName && newStudentUser && newStudentPass) {
        setIsProcessing(true);
        await registerStudent({
            name: newStudentName,
            username: newStudentUser,
            password: newStudentPass,
            role: newStudentRole,
            avatarUrl: `https://api.dicebear.com/7.x/avataaars/svg?seed=${newStudentName}`
        });
        setShowAddStudent(false);
        setNewStudentName('');
        setNewStudentUser('');
        setNewStudentPass('');
        setIsProcessing(false);
    }
  };

  const handleDeleteStudent = async (studentId: string) => {
    if (confirm('Tem certeza que deseja remover este aluno?')) {
      setIsProcessing(true);
      await deleteStudent(studentId);
      setIsProcessing(false);
    }
  };

  const handleDeleteGame = async (gameId: string) => {
    if (confirm('Tem certeza que deseja remover este projeto?')) {
      setIsProcessing(true);
      await deleteGame(gameId);
      setIsProcessing(false);
    }
  };

  const handleSeedDatabase = async () => {
    if (confirm('Isso irá popular o banco de dados com dados de demonstração. Continuar?')) {
      setIsProcessing(true);
      await seedDatabase();
      setIsProcessing(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#050b14] font-sans pb-20">
      
      {/* Admin Header */}
      <header className="bg-red-900/10 border-b border-red-500/20 pt-8 pb-6 px-4">
         <div className="max-w-7xl mx-auto flex justify-between items-center">
            <div className="flex items-center gap-4">
               <div className="w-12 h-12 bg-red-600 rounded flex items-center justify-center text-white shadow-lg shadow-red-600/30">
                  <Shield size={24} />
               </div>
               <div>
                  <h1 className="text-2xl font-display font-bold text-white uppercase tracking-widest">Torre de Controle</h1>
                  <p className="text-red-400 text-xs font-mono flex items-center gap-2">
                     <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span> SISTEMA ONLINE
                  </p>
               </div>
            </div>
            <button onClick={handleLogout} className="text-xs bg-gray-800 hover:bg-red-900 text-gray-300 hover:text-white px-4 py-2 rounded flex items-center gap-2 transition-colors">
               <LogOut size={14} /> Logoff
            </button>
         </div>
      </header>

      {/* Loading overlay */}
      {(loading || isProcessing) && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-[#121824] p-6 rounded-lg flex items-center gap-3">
            <Loader2 className="animate-spin text-senai-blue" size={24} />
            <span className="text-white">Processando...</span>
          </div>
        </div>
      )}

      <main className="max-w-7xl mx-auto px-4 py-8">
         
         {/* Tabs */}
         <div className="flex gap-4 mb-8 border-b border-gray-800">
            <button 
               onClick={() => setActiveTab('students')}
               className={`pb-3 px-4 text-sm font-bold uppercase tracking-wider flex items-center gap-2 transition-all ${activeTab === 'students' ? 'text-white border-b-2 border-senai-blue' : 'text-gray-500 hover:text-gray-300'}`}
            >
               <Users size={16} /> Gerenciar Tripulação (Alunos)
            </button>
            <button 
               onClick={() => setActiveTab('games')}
               className={`pb-3 px-4 text-sm font-bold uppercase tracking-wider flex items-center gap-2 transition-all ${activeTab === 'games' ? 'text-white border-b-2 border-senai-blue' : 'text-gray-500 hover:text-gray-300'}`}
            >
               <Box size={16} /> Gerenciar Carga (Projetos)
            </button>
         </div>

         {/* STUDENTS TAB */}
         {activeTab === 'students' && (
            <div>
               <div className="flex justify-between items-center mb-6">
                  <h2 className="text-white text-lg font-bold">Cadastros Ativos: {students.length}</h2>
                  <div className="flex gap-2">
                     <button 
                        onClick={handleSeedDatabase}
                        className="bg-purple-600 hover:bg-purple-500 text-white px-4 py-2 rounded text-xs font-bold uppercase flex items-center gap-2"
                     >
                        <Database size={14} /> Popular DB
                     </button>
                     <button 
                        onClick={() => setShowAddStudent(true)}
                        className="bg-green-600 hover:bg-green-500 text-white px-4 py-2 rounded text-xs font-bold uppercase flex items-center gap-2"
                     >
                        <Plus size={14} /> Novo Aluno
                     </button>
                  </div>
               </div>

               {/* ADD STUDENT MODAL/FORM */}
               {showAddStudent && (
                  <div className="bg-[#121824] border border-gray-700 p-6 rounded-lg mb-8 animate-fade-in relative">
                     <button onClick={() => setShowAddStudent(false)} className="absolute top-4 right-4 text-gray-500 hover:text-white"><X size={16}/></button>
                     <h3 className="text-white font-bold uppercase mb-4 flex items-center gap-2"><Terminal size={16} /> Cadastrar Novo Recruta</h3>
                     <form onSubmit={handleAddStudent} className="grid grid-cols-1 md:grid-cols-4 gap-4 items-end">
                        <div>
                           <label className="block text-[10px] uppercase text-gray-500 mb-1">Nome Completo</label>
                           <input required type="text" value={newStudentName} onChange={e => setNewStudentName(e.target.value)} className="w-full bg-black/30 border border-gray-600 p-2 text-white text-sm rounded focus:border-senai-blue outline-none" />
                        </div>
                        <div>
                           <label className="block text-[10px] uppercase text-gray-500 mb-1">Usuário (Login)</label>
                           <input required type="text" value={newStudentUser} onChange={e => setNewStudentUser(e.target.value)} className="w-full bg-black/30 border border-gray-600 p-2 text-white text-sm rounded focus:border-senai-blue outline-none" />
                        </div>
                        <div>
                           <label className="block text-[10px] uppercase text-gray-500 mb-1">Senha</label>
                           <input required type="text" value={newStudentPass} onChange={e => setNewStudentPass(e.target.value)} className="w-full bg-black/30 border border-gray-600 p-2 text-white text-sm rounded focus:border-senai-blue outline-none" />
                        </div>
                        <div>
                           <label className="block text-[10px] uppercase text-gray-500 mb-1">Função</label>
                           <select value={newStudentRole} onChange={e => setNewStudentRole(e.target.value)} className="w-full bg-black/30 border border-gray-600 p-2 text-white text-sm rounded focus:border-senai-blue outline-none">
                              <option>Programador</option>
                              <option>Artista 2D</option>
                              <option>Artista 3D</option>
                              <option>Game Designer</option>
                              <option>Sound Designer</option>
                           </select>
                        </div>
                        <button type="submit" className="bg-senai-blue text-white font-bold uppercase py-2 px-4 rounded text-sm hover:bg-white hover:text-senai-blue transition-colors flex items-center gap-2 justify-center">
                           <Save size={14} /> Salvar
                        </button>
                     </form>
                  </div>
               )}

               <div className="bg-[#121824] border border-gray-800 rounded overflow-hidden">
                  <table className="w-full text-left text-sm text-gray-400">
                     <thead className="bg-gray-800 text-gray-200 uppercase text-xs font-bold">
                        <tr>
                           <th className="p-4">Nome</th>
                           <th className="p-4">Usuário</th>
                           <th className="p-4">Senha</th>
                           <th className="p-4">Função</th>
                           <th className="p-4 text-right">Ações</th>
                        </tr>
                     </thead>
                     <tbody className="divide-y divide-gray-800">
                        {students.map(student => (
                           <tr key={student.id} className="hover:bg-gray-800/50 transition-colors">
                              <td className="p-4 font-bold text-white">{student.name}</td>
                              <td className="p-4 font-mono text-senai-blue">{student.username}</td>
                              <td className="p-4 font-mono bg-black/20">{student.password}</td>
                              <td className="p-4">{student.role}</td>
                              <td className="p-4 text-right">
                                 <button onClick={() => handleDeleteStudent(student.id)} className="text-red-500 hover:text-red-400 p-2 hover:bg-red-900/20 rounded">
                                    <Trash2 size={16} />
                                 </button>
                              </td>
                           </tr>
                        ))}
                     </tbody>
                  </table>
               </div>
            </div>
         )}

         {/* GAMES TAB */}
         {activeTab === 'games' && (
            <div>
               <div className="flex justify-between items-center mb-6">
                  <h2 className="text-white text-lg font-bold">Projetos Publicados: {games.length}</h2>
               </div>

               <div className="grid grid-cols-1 gap-4">
                  {games.map(game => (
                     <div key={game.id} className="bg-[#121824] border border-gray-800 p-4 rounded flex justify-between items-center hover:border-senai-blue/50 transition-colors">
                        <div className="flex items-center gap-4">
                           <img src={game.coverImage} alt={game.title} className="w-12 h-16 object-cover rounded" />
                           <div>
                              <h3 className="font-bold text-white">{game.title}</h3>
                              <p className="text-xs text-gray-500">{game.cohortId} • {game.tags.join(', ')}</p>
                           </div>
                        </div>
                        <div className="flex items-center gap-2">
                           <div className="text-right mr-4 hidden md:block">
                              <div className="text-xs text-gray-500">Reviews</div>
                              <div className="text-sm font-bold text-white">{game.reviewsList.length}</div>
                           </div>
                           
                           {/* Inspect Button */}
                           <Link 
                              to={`/game/${game.id}`}
                              className="bg-senai-blue/10 text-senai-blue hover:bg-senai-blue hover:text-white px-3 py-2 rounded text-xs font-bold uppercase transition-colors border border-senai-blue/50 flex items-center gap-2 mr-2"
                           >
                              <Eye size={14} /> Inspecionar
                           </Link>

                           {/* Edit Button */}
                           <Link 
                              to={`/edit/${game.id}`}
                              className="bg-yellow-500/10 text-yellow-500 hover:bg-yellow-500 hover:text-black px-3 py-2 rounded text-xs font-bold uppercase transition-colors border border-yellow-500/50 flex items-center gap-2 mr-2"
                           >
                              <PenTool size={14} /> Editar
                           </Link>

                           <button onClick={() => handleDeleteGame(game.id)} className="bg-red-900/20 text-red-500 hover:bg-red-600 hover:text-white px-3 py-2 rounded text-xs font-bold uppercase transition-colors border border-red-900/50 flex items-center gap-2">
                              <Trash2 size={14} /> Deletar
                           </button>
                        </div>
                     </div>
                  ))}
               </div>
            </div>
         )}

      </main>
    </div>
  );
};

export default AdminDashboard;
