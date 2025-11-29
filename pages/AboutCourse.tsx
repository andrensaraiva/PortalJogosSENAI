
import React from 'react';
import { 
  Cpu, 
  Code, 
  Palette, 
  Rocket, 
  Target, 
  Briefcase, 
  GraduationCap, 
  MapPin,
  Clock,
  Zap,
  Monitor,
  Box,
  Layers,
  Terminal
} from 'lucide-react';

const AboutCourse: React.FC = () => {
  return (
    <div className="min-h-screen bg-[#050b14] font-sans text-gray-300 pb-20">
      
      {/* 1. HERO SECTION: ACADEMY ENTRANCE */}
      <div className="relative h-[600px] w-full overflow-hidden flex items-center justify-center border-b border-senai-blue/30">
        {/* Background Image */}
        <div className="absolute inset-0 z-0">
           <img 
             src="https://images.unsplash.com/photo-1550751827-4bd374c3f58b?q=80&w=2070&auto=format&fit=crop" 
             alt="Cyberpunk Lab" 
             className="w-full h-full object-cover opacity-30"
           />
           <div className="absolute inset-0 bg-gradient-to-t from-[#050b14] via-[#050b14]/80 to-transparent"></div>
           <div className="absolute inset-0 bg-[url('https://transparenttextures.com/patterns/carbon-fibre.png')] opacity-20"></div>
        </div>

        <div className="relative z-10 text-center max-w-4xl px-4">
           <div className="inline-flex items-center gap-2 bg-senai-blue/20 border border-senai-blue/50 px-4 py-1 rounded-full mb-6 backdrop-blur-sm">
              <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
              <span className="text-senai-blue font-mono font-bold text-xs uppercase tracking-widest">Matrículas Abertas</span>
           </div>
           
           <h1 className="text-5xl md:text-7xl font-display font-bold text-white mb-6 uppercase leading-tight drop-shadow-[0_0_15px_rgba(0,169,255,0.5)]">
             <span className="text-transparent bg-clip-text bg-gradient-to-r from-white to-gray-400">Técnico em</span> <br/>
             <span className="text-senai-blue">Jogos Digitais</span>
           </h1>
           
           <p className="text-xl text-gray-400 max-w-2xl mx-auto mb-10 leading-relaxed font-light">
             Transforme sua paixão em profissão. Do conceito à publicação, aprenda a criar os universos que você ama jogar.
           </p>

           <div className="flex flex-wrap justify-center gap-4 text-sm font-bold uppercase tracking-widest">
              <div className="bg-[#0f172a]/80 border border-gray-700 px-6 py-3 rounded flex items-center gap-3">
                 <Clock className="text-senai-blue" size={20} /> 1200 Horas de XP
              </div>
              <div className="bg-[#0f172a]/80 border border-gray-700 px-6 py-3 rounded flex items-center gap-3">
                 <MapPin className="text-senai-blue" size={20} /> SENAI Vitória
              </div>
              <div className="bg-[#0f172a]/80 border border-gray-700 px-6 py-3 rounded flex items-center gap-3">
                 <Zap className="text-senai-blue" size={20} /> Presencial + EaD
              </div>
           </div>
        </div>
      </div>

      {/* 2. MAIN QUEST: OBJECTIVE */}
      <section className="max-w-7xl mx-auto px-4 py-20">
         <div className="grid grid-cols-1 md:grid-cols-2 gap-16 items-center">
            <div className="relative">
               {/* Cyber Frame */}
               <div className="absolute -inset-4 border-2 border-dashed border-gray-800 rounded-lg"></div>
               <div className="absolute top-0 right-0 w-20 h-20 bg-senai-blue/10 rounded-full blur-2xl"></div>
               
               <h2 className="text-3xl font-display font-bold text-white mb-6 uppercase flex items-center gap-3">
                  <Target className="text-senai-blue" size={32} />
                  Missão Principal
               </h2>
               <div className="space-y-4 text-gray-400 leading-relaxed">
                  <p>
                     O objetivo do curso é claro: <strong>capacitar você para dominar a indústria</strong>. Aqui, você não apenas joga; você entende como a mágica acontece.
                  </p>
                  <p>
                     Durante a jornada, você vai desenvolver a capacidade de produzir elementos multimídia (arte 2D, 3D, áudio) e codificar sistemas complexos (gameplay, física, IA), utilizando metodologias ágeis que simulam o ambiente real de estúdios profissionais.
                  </p>
                  <div className="p-4 bg-senai-blue/5 border-l-4 border-senai-blue mt-6">
                     <p className="text-sm font-mono text-senai-blue">
                        "Produzir elementos multimídia e sistemas de jogos digitais, de acordo com metodologia e padrões de qualidade."
                        <br/>
                        <span className="opacity-50 text-xs">- Plano Pedagógico de Curso SENAI</span>
                     </p>
                  </div>
               </div>
            </div>
            
            <div className="grid grid-cols-2 gap-4">
               <div className="space-y-4 translate-y-8">
                  <div className="bg-[#1e293b] p-6 rounded-lg border border-gray-700 hover:border-senai-blue transition-colors group">
                     <Code size={32} className="text-purple-500 mb-4 group-hover:scale-110 transition-transform" />
                     <h3 className="text-white font-bold mb-2">Programação</h3>
                     <p className="text-xs text-gray-500">Domine a lógica e as linguagens que dão vida aos jogos.</p>
                  </div>
                  <div className="bg-[#1e293b] p-6 rounded-lg border border-gray-700 hover:border-senai-blue transition-colors group">
                     <Palette size={32} className="text-pink-500 mb-4 group-hover:scale-110 transition-transform" />
                     <h3 className="text-white font-bold mb-2">Arte & Design</h3>
                     <p className="text-xs text-gray-500">Crie assets 2D/3D e interfaces incríveis (UI/UX).</p>
                  </div>
               </div>
               <div className="space-y-4">
                  <div className="bg-[#1e293b] p-6 rounded-lg border border-gray-700 hover:border-senai-blue transition-colors group">
                     <Box size={32} className="text-yellow-500 mb-4 group-hover:scale-110 transition-transform" />
                     <h3 className="text-white font-bold mb-2">Game Design</h3>
                     <p className="text-xs text-gray-500">Balanceamento, mecânicas e documentação (GDD).</p>
                  </div>
                  <div className="bg-[#1e293b] p-6 rounded-lg border border-gray-700 hover:border-senai-blue transition-colors group">
                     <Rocket size={32} className="text-green-500 mb-4 group-hover:scale-110 transition-transform" />
                     <h3 className="text-white font-bold mb-2">Publicação</h3>
                     <p className="text-xs text-gray-500">Testes, QA e lançamento em plataformas reais.</p>
                  </div>
               </div>
            </div>
         </div>
      </section>

      {/* 3. SKILL TREE: CURRICULUM */}
      <section className="bg-[#0f141e] border-y border-gray-800 py-20 relative overflow-hidden">
         {/* Background Grid */}
         <div className="absolute inset-0 bg-[url('https://transparenttextures.com/patterns/diagmonds-light.png')] opacity-5"></div>
         
         <div className="max-w-7xl mx-auto px-4 relative z-10">
            <div className="text-center mb-16">
               <h2 className="text-3xl font-display font-bold text-white uppercase tracking-widest mb-4">
                  Árvore de Habilidades
               </h2>
               <p className="text-gray-400 font-mono text-sm">
                  Desbloqueie conhecimentos progressivamente em 4 fases principais
               </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
               {/* Phase 1 */}
               <div className="relative group">
                  <div className="absolute -inset-0.5 bg-gradient-to-b from-blue-500 to-transparent opacity-20 group-hover:opacity-50 rounded-lg blur transition duration-500"></div>
                  <div className="relative bg-[#050b14] p-6 rounded-lg border border-gray-800 h-full">
                     <div className="text-4xl font-bold text-gray-800 mb-4 select-none">01</div>
                     <h3 className="text-lg font-bold text-blue-400 mb-4 uppercase">Tutorial & Base</h3>
                     <ul className="space-y-3 text-sm text-gray-400 font-mono">
                        <li className="flex items-start gap-2"><div className="w-1.5 h-1.5 mt-1.5 bg-blue-500 rounded-full"></div> Lógica de Programação</li>
                        <li className="flex items-start gap-2"><div className="w-1.5 h-1.5 mt-1.5 bg-blue-500 rounded-full"></div> Hardware & Software</li>
                        <li className="flex items-start gap-2"><div className="w-1.5 h-1.5 mt-1.5 bg-blue-500 rounded-full"></div> Fundamentos de UI/UX</li>
                        <li className="flex items-start gap-2"><div className="w-1.5 h-1.5 mt-1.5 bg-blue-500 rounded-full"></div> Introdução a Projetos</li>
                     </ul>
                  </div>
               </div>

               {/* Phase 2 */}
               <div className="relative group">
                  <div className="absolute -inset-0.5 bg-gradient-to-b from-purple-500 to-transparent opacity-20 group-hover:opacity-50 rounded-lg blur transition duration-500"></div>
                  <div className="relative bg-[#050b14] p-6 rounded-lg border border-gray-800 h-full">
                     <div className="text-4xl font-bold text-gray-800 mb-4 select-none">02</div>
                     <h3 className="text-lg font-bold text-purple-400 mb-4 uppercase">Asset Forge</h3>
                     <ul className="space-y-3 text-sm text-gray-400 font-mono">
                        <li className="flex items-start gap-2"><div className="w-1.5 h-1.5 mt-1.5 bg-purple-500 rounded-full"></div> Design de Elementos 2D</li>
                        <li className="flex items-start gap-2"><div className="w-1.5 h-1.5 mt-1.5 bg-purple-500 rounded-full"></div> Game Design (GDD)</li>
                        <li className="flex items-start gap-2"><div className="w-1.5 h-1.5 mt-1.5 bg-purple-500 rounded-full"></div> Multimídia para Jogos</li>
                        <li className="flex items-start gap-2"><div className="w-1.5 h-1.5 mt-1.5 bg-purple-500 rounded-full"></div> Planejamento Visual</li>
                     </ul>
                  </div>
               </div>

               {/* Phase 3 */}
               <div className="relative group">
                  <div className="absolute -inset-0.5 bg-gradient-to-b from-yellow-500 to-transparent opacity-20 group-hover:opacity-50 rounded-lg blur transition duration-500"></div>
                  <div className="relative bg-[#050b14] p-6 rounded-lg border border-gray-800 h-full">
                     <div className="text-4xl font-bold text-gray-800 mb-4 select-none">03</div>
                     <h3 className="text-lg font-bold text-yellow-400 mb-4 uppercase">Core Systems</h3>
                     <ul className="space-y-3 text-sm text-gray-400 font-mono">
                        <li className="flex items-start gap-2"><div className="w-1.5 h-1.5 mt-1.5 bg-yellow-500 rounded-full"></div> Codificação Avançada</li>
                        <li className="flex items-start gap-2"><div className="w-1.5 h-1.5 mt-1.5 bg-yellow-500 rounded-full"></div> Versionamento (Git)</li>
                        <li className="flex items-start gap-2"><div className="w-1.5 h-1.5 mt-1.5 bg-yellow-500 rounded-full"></div> Metodologias Ágeis (Scrum)</li>
                        <li className="flex items-start gap-2"><div className="w-1.5 h-1.5 mt-1.5 bg-yellow-500 rounded-full"></div> Produção 3D</li>
                     </ul>
                  </div>
               </div>

               {/* Phase 4 */}
               <div className="relative group">
                  <div className="absolute -inset-0.5 bg-gradient-to-b from-green-500 to-transparent opacity-20 group-hover:opacity-50 rounded-lg blur transition duration-500"></div>
                  <div className="relative bg-[#050b14] p-6 rounded-lg border border-gray-800 h-full">
                     <div className="text-4xl font-bold text-gray-800 mb-4 select-none">04</div>
                     <h3 className="text-lg font-bold text-green-400 mb-4 uppercase">Final Boss</h3>
                     <ul className="space-y-3 text-sm text-gray-400 font-mono">
                        <li className="flex items-start gap-2"><div className="w-1.5 h-1.5 mt-1.5 bg-green-500 rounded-full"></div> Testes (QA)</li>
                        <li className="flex items-start gap-2"><div className="w-1.5 h-1.5 mt-1.5 bg-green-500 rounded-full"></div> Manutenção de Sistemas</li>
                        <li className="flex items-start gap-2"><div className="w-1.5 h-1.5 mt-1.5 bg-green-500 rounded-full"></div> Empreendedorismo</li>
                        <li className="flex items-start gap-2"><div className="w-1.5 h-1.5 mt-1.5 bg-green-500 rounded-full"></div> Projeto Final (TCC)</li>
                     </ul>
                  </div>
               </div>
            </div>
         </div>
      </section>

      {/* 4. THE ARMORY: INFRASTRUCTURE */}
      <section className="max-w-7xl mx-auto px-4 py-20">
         <div className="bg-[#121824] border border-gray-700 p-8 md:p-12 rounded-lg relative overflow-hidden">
            <div className="absolute top-0 right-0 w-64 h-64 bg-senai-blue/10 blur-[100px] rounded-full"></div>
            
            <div className="flex flex-col md:flex-row gap-12">
               <div className="md:w-1/3">
                  <h2 className="text-3xl font-display font-bold text-white uppercase mb-4">
                     O Arsenal <br/> <span className="text-senai-blue">Tecnológico</span>
                  </h2>
                  <p className="text-gray-400 text-sm mb-6">
                     Nossa base de operações (Unidade Jones dos Santos Neves) conta com laboratórios equipados para rodar as engines mais pesadas do mercado.
                  </p>
                  <ul className="space-y-2 text-xs font-mono text-gray-500 uppercase tracking-widest">
                     <li>// Laboratórios de Alta Performance</li>
                     <li>// Estúdios Maker & IoT</li>
                     <li>// Espaço de Criação 3D</li>
                  </ul>
               </div>

               <div className="md:w-2/3 grid grid-cols-2 gap-4">
                  <div className="bg-black/30 p-4 border border-gray-700 flex items-center gap-4">
                     <Monitor className="text-senai-blue w-8 h-8" />
                     <div>
                        <h4 className="text-white font-bold text-sm">PCs High-End</h4>
                        <p className="text-xs text-gray-500">i5/i7, 16GB+, Placas Gráficas Dedicadas</p>
                     </div>
                  </div>
                  <div className="bg-black/30 p-4 border border-gray-700 flex items-center gap-4">
                     <Layers className="text-purple-500 w-8 h-8" />
                     <div>
                        <h4 className="text-white font-bold text-sm">Kits Multimídia</h4>
                        <p className="text-xs text-gray-500">Projetores, Mesas Digitalizadoras, Som</p>
                     </div>
                  </div>
                  <div className="bg-black/30 p-4 border border-gray-700 flex items-center gap-4">
                     <Cpu className="text-green-500 w-8 h-8" />
                     <div>
                        <h4 className="text-white font-bold text-sm">Maker Lab</h4>
                        <p className="text-xs text-gray-500">Impressoras 3D, Arduino, IoT</p>
                     </div>
                  </div>
                  <div className="bg-black/30 p-4 border border-gray-700 flex items-center gap-4">
                     <Terminal className="text-yellow-500 w-8 h-8" />
                     <div>
                        <h4 className="text-white font-bold text-sm">Software Livre & Pro</h4>
                        <p className="text-xs text-gray-500">Unity, Unreal, Blender, VS Code</p>
                     </div>
                  </div>
               </div>
            </div>
         </div>
      </section>

      {/* 5. CAREER CLASSES */}
      <section className="max-w-7xl mx-auto px-4 pb-20">
         <h2 className="text-2xl font-display font-bold text-white text-center mb-12 uppercase tracking-widest">
            Classes Desbloqueadas (Mercado de Trabalho)
         </h2>
         <div className="flex flex-wrap justify-center gap-6">
            {['Desenvolvedor de Jogos', 'Game Designer', 'Level Designer', 'Tester (QA)', 'Artista Técnico', 'Programador Web'].map((job, idx) => (
               <span key={idx} className="bg-[#1e293b] hover:bg-senai-blue hover:text-white transition-colors px-6 py-3 rounded-full text-sm font-bold text-gray-300 border border-gray-700 cursor-default shadow-lg">
                  {job}
               </span>
            ))}
         </div>
      </section>

      {/* 6. CALL TO ACTION */}
      <section className="bg-senai-blue text-white py-16 relative overflow-hidden">
         <div className="absolute inset-0 bg-[url('https://transparenttextures.com/patterns/carbon-fibre.png')] opacity-20"></div>
         <div className="max-w-4xl mx-auto px-4 text-center relative z-10">
            <GraduationCap className="mx-auto w-16 h-16 mb-6 opacity-90" />
            <h2 className="text-4xl font-display font-bold mb-4 uppercase">Pronto para iniciar o jogo?</h2>
            <p className="text-blue-100 mb-8 max-w-2xl mx-auto">
               Garanta seu diploma de Técnico em Programação de Jogos Digitais e entre para o ranking dos melhores profissionais do ES.
            </p>
            <a href="https://loja.senaies.com.br/curso/tecnico-em-programacao-de-jogos-digitais/21425288-vitoria-porto-3-20-620-HTC-PJD-1-01" target="_blank" rel="noopener noreferrer" className="inline-block bg-white text-senai-blue hover:bg-gray-100 px-10 py-4 font-bold uppercase tracking-widest rounded shadow-[0_10px_20px_rgba(0,0,0,0.2)] transition-transform hover:-translate-y-1">
               Acessar Portal de Matrículas
            </a>
         </div>
      </section>

    </div>
  );
};

export default AboutCourse;
