import { 
  collection, 
  doc, 
  getDocs, 
  getDoc, 
  addDoc, 
  updateDoc, 
  deleteDoc, 
  query, 
  orderBy,
  writeBatch,
  Timestamp 
} from 'firebase/firestore';
import { db } from './config';
import { Game, Student, Review, Devlog, Cohort } from '../types';

// ==================== COLLECTIONS ====================
const GAMES_COLLECTION = 'games';
const STUDENTS_COLLECTION = 'students';
const COHORTS_COLLECTION = 'cohorts';

// ==================== GAMES ====================
export const getGames = async (): Promise<Game[]> => {
  try {
    const gamesRef = collection(db, GAMES_COLLECTION);
    const snapshot = await getDocs(gamesRef);
    const games = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Game));
    // Ordenar por data no cliente
    return games.sort((a, b) => {
      const dateA = new Date(a.releaseDate || 0);
      const dateB = new Date(b.releaseDate || 0);
      return dateB.getTime() - dateA.getTime();
    });
  } catch (error) {
    console.error('Erro ao buscar jogos:', error);
    return [];
  }
};

export const getGameById = async (id: string): Promise<Game | null> => {
  const docRef = doc(db, GAMES_COLLECTION, id);
  const snapshot = await getDoc(docRef);
  if (snapshot.exists()) {
    return { id: snapshot.id, ...snapshot.data() } as Game;
  }
  return null;
};

export const addGameToDb = async (game: Omit<Game, 'id'>): Promise<string> => {
  const gamesRef = collection(db, GAMES_COLLECTION);
  const docRef = await addDoc(gamesRef, {
    ...game,
    createdAt: Timestamp.now(),
    updatedAt: Timestamp.now()
  });
  return docRef.id;
};

export const updateGameInDb = async (id: string, game: Partial<Game>): Promise<void> => {
  const docRef = doc(db, GAMES_COLLECTION, id);
  await updateDoc(docRef, {
    ...game,
    updatedAt: Timestamp.now()
  });
};

export const deleteGameFromDb = async (id: string): Promise<void> => {
  const docRef = doc(db, GAMES_COLLECTION, id);
  await deleteDoc(docRef);
};

// ==================== REVIEWS (Subcollection) ====================
export const addReviewToGame = async (gameId: string, review: Omit<Review, 'id' | 'date'>): Promise<void> => {
  const game = await getGameById(gameId);
  if (game) {
    const newReview: Review = {
      id: Date.now().toString(),
      date: new Date().toLocaleDateString('pt-BR', { day: '2-digit', month: 'short', year: 'numeric' }),
      ...review
    };
    await updateGameInDb(gameId, {
      reviewsList: [newReview, ...game.reviewsList]
    });
  }
};

// ==================== DEVLOGS ====================
export const addDevlogToGame = async (gameId: string, devlog: Omit<Devlog, 'id'>): Promise<void> => {
  const game = await getGameById(gameId);
  if (game) {
    const newDevlog: Devlog = {
      id: Date.now().toString(),
      ...devlog
    };
    await updateGameInDb(gameId, {
      devlogs: [newDevlog, ...game.devlogs]
    });
  }
};

// ==================== STUDENTS ====================
export const getStudents = async (): Promise<Student[]> => {
  try {
    const studentsRef = collection(db, STUDENTS_COLLECTION);
    const snapshot = await getDocs(studentsRef);
    return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Student));
  } catch (error) {
    console.error('Erro ao buscar alunos:', error);
    return [];
  }
};

export const getStudentById = async (id: string): Promise<Student | null> => {
  const docRef = doc(db, STUDENTS_COLLECTION, id);
  const snapshot = await getDoc(docRef);
  if (snapshot.exists()) {
    return { id: snapshot.id, ...snapshot.data() } as Student;
  }
  return null;
};

export const addStudentToDb = async (student: Omit<Student, 'id'>): Promise<string> => {
  const studentsRef = collection(db, STUDENTS_COLLECTION);
  const docRef = await addDoc(studentsRef, student);
  return docRef.id;
};

export const updateStudentInDb = async (id: string, student: Partial<Student>): Promise<void> => {
  const docRef = doc(db, STUDENTS_COLLECTION, id);
  await updateDoc(docRef, student);
};

export const deleteStudentFromDb = async (id: string): Promise<void> => {
  const docRef = doc(db, STUDENTS_COLLECTION, id);
  await deleteDoc(docRef);
};

export const loginStudentWithCredentials = async (username: string, password: string, students: Student[]): Promise<Student | null> => {
  // Busca o aluno com as credenciais (login local, não Firebase Auth)
  const student = students.find(s => s.username === username && s.password === password);
  return student || null;
};

// ==================== COHORTS ====================
export const getCohorts = async (): Promise<Cohort[]> => {
  const cohortsRef = collection(db, COHORTS_COLLECTION);
  const snapshot = await getDocs(cohortsRef);
  return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Cohort));
};

// ==================== SEED DATA ====================
export const seedInitialData = async (games: Game[], students: Student[], cohorts: Cohort[]): Promise<void> => {
  const batch = writeBatch(db);
  
  // Seed students
  for (const student of students) {
    const studentRef = doc(db, STUDENTS_COLLECTION, student.id);
    batch.set(studentRef, student);
  }
  
  // Seed games
  for (const game of games) {
    const gameRef = doc(db, GAMES_COLLECTION, game.id);
    batch.set(gameRef, game);
  }
  
  // Seed cohorts
  for (const cohort of cohorts) {
    const cohortRef = doc(db, COHORTS_COLLECTION, cohort.id);
    batch.set(cohortRef, cohort);
  }
  
  await batch.commit();
  console.log('✅ Dados iniciais inseridos no Firebase!');
};
