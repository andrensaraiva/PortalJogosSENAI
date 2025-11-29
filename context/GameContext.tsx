import React, { createContext, useState, useContext, ReactNode, useEffect, useCallback } from 'react';
import { Game, Review, Student, Devlog, Cohort } from '../types';
import { MOCK_GAMES, MOCK_STUDENTS, COHORTS } from '../constants';
import {
  getGames,
  getStudents,
  addGameToDb,
  updateGameInDb,
  deleteGameFromDb,
  addStudentToDb,
  updateStudentInDb,
  deleteStudentFromDb,
  addReviewToGame,
  addDevlogToGame,
  seedInitialData
} from '../firebase/services';

type Theme = 'porto' | 'retro';

interface GameContextType {
  games: Game[];
  students: Student[];
  cohorts: Cohort[];
  isAdmin: boolean;
  theme: Theme;
  loading: boolean;
  error: string | null;
  toggleTheme: () => void;
  loginAdmin: (username: string, password: string) => boolean;
  logoutAdmin: () => void;
  loginStudent: (username: string, password: string) => Student | null;
  addGame: (game: Omit<Game, 'id'>) => Promise<string | null>;
  updateGame: (game: Game) => Promise<boolean>;
  deleteGame: (gameId: string) => Promise<boolean>;
  registerStudent: (student: Omit<Student, 'id'>) => Promise<string | null>;
  updateStudent: (student: Student) => Promise<boolean>;
  deleteStudent: (studentId: string) => Promise<boolean>;
  changeStudentPassword: (studentId: string, currentPassword: string, newPassword: string) => Promise<{ success: boolean; error?: string }>;
  submitReview: (gameId: string, review: Omit<Review, 'id' | 'date'>) => Promise<boolean>;
  addDevlog: (gameId: string, devlog: Omit<Devlog, 'id'>) => Promise<boolean>;
  getStudentById: (id: string) => Student | undefined;
  allDevlogs: (Devlog & { gameTitle: string, gameId: string, authorName: string })[];
  refreshData: () => Promise<void>;
  seedDatabase: () => Promise<void>;
}

const GameContext = createContext<GameContextType | undefined>(undefined);

// Checa se está usando Firebase (configuração válida)
const isFirebaseConfigured = (): boolean => {
  const apiKey = import.meta.env.VITE_FIREBASE_API_KEY;
  return apiKey && apiKey !== 'YOUR_API_KEY' && apiKey.length > 10;
};

export const GameProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [games, setGames] = useState<Game[]>([]);
  const [students, setStudents] = useState<Student[]>([]);
  const [cohorts] = useState<Cohort[]>(COHORTS);
  const [isAdmin, setIsAdmin] = useState(() => {
    // Recupera estado do admin do localStorage
    return localStorage.getItem('senai-admin') === 'true';
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [useFirebase] = useState(isFirebaseConfigured());
  
  const [theme, setTheme] = useState<Theme>(() => {
    const saved = localStorage.getItem('senai-game-port-theme');
    return (saved === 'porto' || saved === 'retro') ? saved : 'porto';
  });

  // Carrega dados iniciais
  const loadData = useCallback(async () => {
    setLoading(true);
    setError(null);
    
    try {
      if (useFirebase) {
        const [gamesData, studentsData] = await Promise.all([
          getGames(),
          getStudents()
        ]);
        
        if (gamesData.length === 0) {
          setGames(MOCK_GAMES);
          setStudents(MOCK_STUDENTS);
          console.log('⚠️ Firebase vazio, usando dados de demonstração.');
        } else {
          setGames(gamesData);
          setStudents(studentsData);
          console.log('✅ Dados carregados do Firebase');
        }
      } else {
        setGames(MOCK_GAMES);
        setStudents(MOCK_STUDENTS);
        console.log('ℹ️ Firebase não configurado, usando dados de demonstração.');
      }
    } catch (err) {
      console.error('Erro ao carregar dados:', err);
      setError('Erro ao carregar dados. Usando modo offline.');
      setGames(MOCK_GAMES);
      setStudents(MOCK_STUDENTS);
    } finally {
      setLoading(false);
    }
  }, [useFirebase]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  useEffect(() => {
    localStorage.setItem('senai-game-port-theme', theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme(prev => prev === 'porto' ? 'retro' : 'porto');
  };

  // ==================== ADMIN AUTH (Simples - sem Firebase Auth) ====================
  const loginAdmin = (username: string, password: string): boolean => {
    // Credenciais do admin - você pode alterar aqui
    if (username === 'admin' && password === 'senai123') {
      setIsAdmin(true);
      localStorage.setItem('senai-admin', 'true');
      return true;
    }
    return false;
  };

  const logoutAdmin = (): void => {
    setIsAdmin(false);
    localStorage.removeItem('senai-admin');
  };

  const loginStudent = (username: string, pass: string): Student | null => {
    const student = students.find(s => s.username === username && s.password === pass);
    return student || null;
  };

  // ==================== GAMES CRUD ====================
  const addGame = async (gameData: Omit<Game, 'id'>): Promise<string | null> => {
    try {
      if (useFirebase) {
        const gameId = await addGameToDb(gameData);
        await loadData();
        return gameId;
      } else {
        const newGame: Game = {
          ...gameData,
          id: `game-${Date.now()}`
        };
        setGames(prev => [newGame, ...prev]);
        return newGame.id;
      }
    } catch (err) {
      console.error('Erro ao adicionar jogo:', err);
      setError('Erro ao adicionar jogo.');
      return null;
    }
  };

  const updateGame = async (updatedGame: Game): Promise<boolean> => {
    try {
      if (useFirebase) {
        await updateGameInDb(updatedGame.id, updatedGame);
        await loadData();
        return true;
      } else {
        setGames(prev => prev.map(g => g.id === updatedGame.id ? updatedGame : g));
        return true;
      }
    } catch (err) {
      console.error('Erro ao atualizar jogo:', err);
      setError('Erro ao atualizar jogo.');
      return false;
    }
  };

  const deleteGame = async (gameId: string): Promise<boolean> => {
    try {
      if (useFirebase) {
        await deleteGameFromDb(gameId);
        await loadData();
      } else {
        setGames(prev => prev.filter(g => g.id !== gameId));
      }
      return true;
    } catch (err) {
      console.error('Erro ao deletar jogo:', err);
      setError('Erro ao deletar jogo.');
      return false;
    }
  };

  // ==================== STUDENTS CRUD ====================
  const registerStudent = async (studentData: Omit<Student, 'id'>): Promise<string | null> => {
    try {
      if (useFirebase) {
        const id = await addStudentToDb(studentData);
        await loadData();
        return id;
      } else {
        const student: Student = {
          ...studentData,
          id: `s-${Date.now()}`
        };
        setStudents(prev => [...prev, student]);
        return student.id;
      }
    } catch (err) {
      console.error('Erro ao registrar aluno:', err);
      setError('Erro ao registrar aluno.');
      return null;
    }
  };

  const updateStudent = async (updatedStudent: Student): Promise<boolean> => {
    try {
      if (useFirebase) {
        await updateStudentInDb(updatedStudent.id, updatedStudent);
        await loadData();
      } else {
        setStudents(prev => prev.map(s => s.id === updatedStudent.id ? updatedStudent : s));
      }
      return true;
    } catch (err) {
      console.error('Erro ao atualizar aluno:', err);
      setError('Erro ao atualizar aluno.');
      return false;
    }
  };

  const deleteStudent = async (studentId: string): Promise<boolean> => {
    try {
      if (useFirebase) {
        await deleteStudentFromDb(studentId);
        await loadData();
      } else {
        setStudents(prev => prev.filter(s => s.id !== studentId));
      }
      return true;
    } catch (err) {
      console.error('Erro ao deletar aluno:', err);
      setError('Erro ao deletar aluno.');
      return false;
    }
  };

  // ==================== ALTERAR SENHA DO ALUNO ====================
  const changeStudentPassword = async (
    studentId: string, 
    currentPassword: string, 
    newPassword: string
  ): Promise<{ success: boolean; error?: string }> => {
    try {
      // Encontrar o aluno
      const student = students.find(s => s.id === studentId);
      
      if (!student) {
        return { success: false, error: 'Aluno não encontrado.' };
      }
      
      // Verificar senha atual
      if (student.password !== currentPassword) {
        return { success: false, error: 'Senha atual incorreta.' };
      }
      
      // Validar nova senha
      if (newPassword.length < 3) {
        return { success: false, error: 'A nova senha deve ter pelo menos 3 caracteres.' };
      }
      
      // Atualizar senha
      const updatedStudent = { ...student, password: newPassword };
      
      if (useFirebase) {
        await updateStudentInDb(studentId, { password: newPassword });
        await loadData();
      } else {
        setStudents(prev => prev.map(s => s.id === studentId ? updatedStudent : s));
      }
      
      return { success: true };
    } catch (err) {
      console.error('Erro ao alterar senha:', err);
      return { success: false, error: 'Erro ao alterar senha. Tente novamente.' };
    }
  };

  // ==================== REVIEWS & DEVLOGS ====================
  const submitReview = async (gameId: string, reviewData: Omit<Review, 'id' | 'date'>): Promise<boolean> => {
    try {
      if (useFirebase) {
        await addReviewToGame(gameId, reviewData);
        await loadData();
      } else {
        setGames(prevGames => prevGames.map(game => {
          if (game.id === gameId) {
            const newReview: Review = {
              id: Date.now().toString(),
              date: new Date().toLocaleDateString('pt-BR', { day: '2-digit', month: 'short', year: 'numeric' }),
              ...reviewData
            };
            return {
              ...game,
              reviewsList: [newReview, ...game.reviewsList]
            };
          }
          return game;
        }));
      }
      return true;
    } catch (err) {
      console.error('Erro ao enviar review:', err);
      return false;
    }
  };

  const addDevlog = async (gameId: string, devlogData: Omit<Devlog, 'id'>): Promise<boolean> => {
    try {
      if (useFirebase) {
        await addDevlogToGame(gameId, devlogData);
        await loadData();
      } else {
        setGames(prevGames => prevGames.map(game => {
          if (game.id === gameId) {
            const newDevlog: Devlog = {
              id: Date.now().toString(),
              ...devlogData
            };
            return {
              ...game,
              devlogs: [newDevlog, ...game.devlogs]
            };
          }
          return game;
        }));
      }
      return true;
    } catch (err) {
      console.error('Erro ao adicionar devlog:', err);
      return false;
    }
  };

  const getStudentById = (id: string) => students.find(s => s.id === id);

  const allDevlogs = games.flatMap(game => 
    game.devlogs.map(log => {
      const author = students.find(s => s.id === log.authorId);
      return {
        ...log,
        gameTitle: game.title,
        gameId: game.id,
        authorName: author ? author.name : 'Membro da Equipe'
      };
    })
  ).sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()); 

  const refreshData = async () => {
    await loadData();
  };

  const seedDatabase = async () => {
    if (useFirebase) {
      await seedInitialData(MOCK_GAMES, MOCK_STUDENTS, COHORTS);
      await loadData();
    }
  };

  return (
    <GameContext.Provider value={{ 
      games, 
      students, 
      cohorts,
      isAdmin, 
      theme, 
      loading,
      error,
      toggleTheme, 
      loginAdmin, 
      logoutAdmin, 
      loginStudent,
      addGame, 
      updateGame, 
      deleteGame, 
      registerStudent, 
      updateStudent, 
      deleteStudent,
      changeStudentPassword,
      submitReview, 
      addDevlog, 
      getStudentById, 
      allDevlogs,
      refreshData,
      seedDatabase
    }}>
      {children}
    </GameContext.Provider>
  );
};

export const useGames = () => {
  const context = useContext(GameContext);
  if (context === undefined) {
    throw new Error('useGames must be used within a GameProvider');
  }
  return context;
};