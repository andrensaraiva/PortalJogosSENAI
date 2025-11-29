import React, { useEffect } from 'react';
import { HashRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import LoadingScreen from './components/LoadingScreen';
import Home from './pages/Home';
import GamePage from './pages/GamePage';
import SubmitProject from './pages/SubmitProject';
import AboutCourse from './pages/AboutCourse';
import Projects from './pages/Projects';
import AdminLogin from './pages/AdminLogin';
import AdminDashboard from './pages/AdminDashboard';
import { GameProvider, useGames } from './context/GameContext';

// Componente que rola para o topo quando muda de página
const ScrollToTop: React.FC = () => {
  const { pathname } = useLocation();
  
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);
  
  return null;
};

const AppContent: React.FC = () => {
  const { theme, loading } = useGames();
  
  if (loading) {
    return <LoadingScreen message="Carregando dados do porto..." />;
  }
  
  return (
    <div className={`flex flex-col min-h-screen transition-colors duration-500 ${theme === 'retro' ? 'theme-retro' : 'theme-porto'}`}>
      <ScrollToTop />
      <Navbar />
      <div className="flex-grow">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/projects" element={<Projects />} />
          <Route path="/game/:id" element={<GamePage />} />
          <Route path="/submit" element={<SubmitProject />} />
          <Route path="/edit/:id" element={<SubmitProject />} />
          <Route path="/about" element={<AboutCourse />} />
          <Route path="/admin" element={<AdminLogin />} />
          <Route path="/admin/dashboard" element={<AdminDashboard />} />
        </Routes>
      </div>
      <Footer />
    </div>
  );
};

const App: React.FC = () => {
  return (
    <GameProvider>
      <Router>
        <AppContent />
      </Router>
    </GameProvider>
  );
};

export default App;