
import React from 'react';
import { Link } from 'react-router-dom';
import { Lock } from 'lucide-react';

const Footer: React.FC = () => {
  return (
    <footer className="bg-senai-darker border-t border-white/10 py-8 mt-12 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <p className="text-gray-400 text-sm">
          &copy; {new Date().getFullYear()} Curso Técnico em Jogos Digitais - SENAI Vitória.
        </p>
        <p className="text-gray-500 text-xs mt-2">
          Desenvolvido por alunos para alunos.
        </p>
      </div>
      <Link to="/admin" className="absolute bottom-4 right-4 text-gray-700 hover:text-senai-blue transition-colors">
        <Lock size={12} />
      </Link>
    </footer>
  );
};

export default Footer;
