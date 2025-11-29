
export interface SystemRequirements {
  os: string;
  processor: string;
  memory: string;
  graphics: string;
  storage: string;
}

export interface Review {
  id: string;
  author: string;
  content: string;
  isRecommended: boolean;
  date: string;
}

export interface Student {
  id: string;
  name: string;
  role: string; // e.g., "Programador", "Artista", "Game Designer"
  avatarUrl?: string;
  username: string; // New: Login ID
  password?: string; // New: Login Password (optional in interface to avoid leaking in UI lists, but used in logic)
  cohortId?: string; // Turma do aluno
}

export interface DevlogMedia {
  type: 'image' | 'gif' | 'video' | 'link';
  url: string;
  caption?: string;
}

export interface Devlog {
  id: string;
  date: string;
  authorId: string;
  title: string;
  content: string;
  tags: string[]; // e.g., "Art", "Code", "Fix"
  media?: DevlogMedia[]; // Imagens, GIFs, vídeos e links
}

export interface Game {
  id: string;
  title: string;
  shortDescription: string;
  fullDescription: string;
  coverImage: string;
  headerImage: string;
  backgroundImage?: string;
  screenshots: string[];
  videoUrl?: string; 
  webBuildUrl?: string; 
  presentationUrl?: string;
  downloadLinks: {
    windows?: string;
    android?: string;
    linux?: string;
  };
  teamIds: string[]; // Replaces 'developer' string
  devlogs: Devlog[]; // New: Development updates
  releaseDate: string;
  tags: string[];
  reviewSummary: string;
  reviewsList: Review[];
  systemRequirements: SystemRequirements;
  cohortId: string;
}

export interface Cohort {
  id: string;
  year: string;
  name: string; 
  description?: string;
}
