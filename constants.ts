
import { Cohort, Game, Student } from './types';

export const COHORTS: Cohort[] = [
  { id: '2024-1-A', year: '2024', name: '1º Semestre - Turma A' },
  { id: '2024-1-B', year: '2024', name: '1º Semestre - Turma B' },
  { id: '2023-2', year: '2023', name: '2º Semestre - Turma Única' },
  { id: '2023-1', year: '2023', name: '1º Semestre - Turma Única' },
];

export const MOCK_STUDENTS: Student[] = [
  { id: 's1', name: 'João Silva', role: 'Programador', avatarUrl: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Felix', username: 'joao', password: '123' },
  { id: 's2', name: 'Maria Souza', role: 'Artista 2D', avatarUrl: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Aneka', username: 'maria', password: '123' },
  { id: 's3', name: 'Carlos Oliveira', role: 'Game Designer', avatarUrl: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Bob', username: 'carlos', password: '123' },
  { id: 's4', name: 'Ana Costa', role: 'Sound Designer', avatarUrl: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Milo', username: 'ana', password: '123' },
];

export const MOCK_GAMES: Game[] = [
  {
    id: 'cyber-port-vix',
    title: 'Cyber Port VIX',
    shortDescription: 'Explore uma versão futurista do Porto de Vitória, onde hackers tentam controlar os guindastes automatizados.',
    fullDescription: `
      <p>Em <strong>Cyber Port VIX</strong>, você assume o papel de um engenheiro de segurança cibernética encarregado de proteger a infraestrutura crítica do Porto de Vitória no ano de 2077.</p>
      <br/>
      <p>O jogo combina mecânicas de <em>Tower Defense</em> com puzzles de hacking em tempo real. Utilize drones, firewalls e contra-medidas digitais para impedir que o sindicato do crime "Black Tide" assuma o controle das operações logísticas.</p>
      <br/>
      <h3>Principais Características:</h3>
      <ul class="list-disc pl-5">
        <li>Mapa fielmente recriado da Baía de Vitória com estética Cyberpunk.</li>
        <li>15 níveis de dificuldade crescente.</li>
        <li>Trilha sonora original Synthwave produzida pelos alunos de Sound Design.</li>
      </ul>
    `,
    coverImage: 'https://picsum.photos/300/400?random=1',
    headerImage: 'https://picsum.photos/600/300?random=2',
    backgroundImage: 'https://images.unsplash.com/photo-1555547432-84157a977119?q=80&w=2070&auto=format&fit=crop',
    screenshots: [
      'https://picsum.photos/1280/720?random=3',
      'https://picsum.photos/1280/720?random=4',
      'https://picsum.photos/1280/720?random=5',
      'https://picsum.photos/1280/720?random=6',
    ],
    videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ?autoplay=0', 
    webBuildUrl: 'mock-build',
    presentationUrl: 'https://docs.google.com/presentation/d/e/2PACX-1vR6y2maA-3nC4QyR4sQJ7M3o3-sQ2wR3r4t5u6v7w8x9y0z1/embed?start=false&loop=false&delayms=3000',
    downloadLinks: {
      windows: '#',
      android: '#'
    },
    teamIds: ['s1', 's2'],
    devlogs: [
        { id: 'd1', date: '10 Jun, 2024', authorId: 's1', title: 'Implementação de Física', content: 'Corrigimos a gravidade dos drones nos níveis noturnos.', tags: ['Code', 'Fix'] },
        { id: 'd2', date: '05 Jun, 2024', authorId: 's2', title: 'Novos Sprites', content: 'Adicionados sprites para os contêineres neon.', tags: ['Art'] }
    ],
    releaseDate: '15 Jun, 2024',
    tags: ['Estratégia', 'Cyberpunk', 'Tower Defense', 'Indie'],
    reviewSummary: 'Extremamente Positivas',
    reviewsList: [
      { id: '1', author: 'GameMaster2020', content: 'A ambientação no porto é incrível! Muito fiel a Vitória.', isRecommended: true, date: '16 Jun, 2024' },
      { id: '2', author: 'CyberFan', content: 'Um pouco difícil no nível 5, mas adorei os visuais.', isRecommended: true, date: '18 Jun, 2024' }
    ],
    systemRequirements: {
      os: 'Windows 10/11',
      processor: 'Intel Core i5 ou equivalente',
      memory: '8 GB RAM',
      graphics: 'NVIDIA GTX 1050 ou superior',
      storage: '2 GB de espaço disponível'
    },
    cohortId: '2024-1-A'
  },
  {
    id: 'eco-convento',
    title: 'Mistério no Convento',
    shortDescription: 'Uma aventura narrativa de terror 2D ambientada no Convento da Penha.',
    fullDescription: `
      <p>Uma excursão escolar dá errado quando um grupo de alunos fica trancado no histórico Convento da Penha após o pôr do sol. <strong>Mistério no Convento</strong> é um jogo de exploração e terror psicológico.</p>
      <p>Resolva enigmas baseados na história real do Espírito Santo para encontrar a saída, mas cuidado: as lendas locais ganharam vida.</p>
    `,
    coverImage: 'https://picsum.photos/300/400?random=7',
    headerImage: 'https://picsum.photos/600/300?random=8',
    backgroundImage: 'https://images.unsplash.com/photo-1518770660439-4636190af475?q=80&w=2070&auto=format&fit=crop',
    screenshots: [
      'https://picsum.photos/1280/720?random=9',
      'https://picsum.photos/1280/720?random=10'
    ],
    webBuildUrl: 'mock-build',
    downloadLinks: {
      windows: '#'
    },
    teamIds: ['s3', 's4'],
    devlogs: [
        { id: 'd3', date: '15 Nov, 2023', authorId: 's3', title: 'Ajuste de Iluminação', content: 'O shader de lanterna foi otimizado para rodar em PCs mais fracos.', tags: ['Tech Art'] }
    ],
    releaseDate: '20 Nov, 2023',
    tags: ['Terror', 'Puzzle', 'Narrativo', '2D'],
    reviewSummary: 'Muito Positivas',
    reviewsList: [
        { id: '3', author: 'ScaredPlayer', content: 'Tomei muitos sustos! A história é muito boa.', isRecommended: true, date: '21 Nov, 2023' }
    ],
    systemRequirements: {
      os: 'Windows 10',
      processor: 'Dual Core',
      memory: '4 GB RAM',
      graphics: 'Integrada',
      storage: '500 MB'
    },
    cohortId: '2023-2'
  },
  {
    id: 'moqueca-madness',
    title: 'Moqueca Madness',
    shortDescription: 'Um jogo de culinária frenético cooperativo. É capixaba, o resto é peixada!',
    fullDescription: 'Prepare as melhores moquecas antes que o tempo acabe. Jogue com até 4 amigos localmente.',
    coverImage: 'https://picsum.photos/300/400?random=11',
    headerImage: 'https://picsum.photos/600/300?random=12',
    screenshots: ['https://picsum.photos/1280/720?random=13'],
    downloadLinks: {
      windows: '#',
      linux: '#'
    },
    teamIds: ['s1', 's3'],
    devlogs: [],
    releaseDate: '05 Dez, 2023',
    tags: ['Casual', 'Co-op', 'Culinária'],
    reviewSummary: 'Positivas',
    reviewsList: [],
    systemRequirements: {
      os: 'Qualquer',
      processor: 'Batata',
      memory: '2 GB',
      graphics: 'Qualquer',
      storage: '200 MB'
    },
    cohortId: '2023-1'
  }
];
