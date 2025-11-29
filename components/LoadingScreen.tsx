import React from 'react';
import { Anchor, Loader2 } from 'lucide-react';

interface LoadingScreenProps {
  message?: string;
}

const LoadingScreen: React.FC<LoadingScreenProps> = ({ message = 'Carregando...' }) => {
  return (
    <div className="min-h-screen bg-[#050b14] flex flex-col items-center justify-center">
      <div className="relative">
        {/* Rotating anchor */}
        <div className="animate-pulse">
          <Anchor className="w-16 h-16 text-senai-blue" />
        </div>
        
        {/* Loading spinner */}
        <div className="absolute -bottom-2 left-1/2 transform -translate-x-1/2">
          <Loader2 className="w-6 h-6 text-gray-400 animate-spin" />
        </div>
      </div>
      
      <p className="text-gray-400 mt-6 font-mono text-sm uppercase tracking-widest">
        {message}
      </p>
      
      <div className="mt-4 flex gap-1">
        <div className="w-2 h-2 bg-senai-blue rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
        <div className="w-2 h-2 bg-senai-blue rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
        <div className="w-2 h-2 bg-senai-blue rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
      </div>
    </div>
  );
};

export default LoadingScreen;
