// src/App.tsx
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

// Import Pages
import Dashboard from './pages/dashboard';
import About from './pages/about';
import Speakers from './pages/speakers'; 
// import Speakers from './pages/Speakers'; // Siapkan untuk nanti

// Import Components
import Header from './components/Header';
// import Footer from './components/Footer'; // Uncomment kalau file Footer.tsx sudah ada

const App: React.FC = () => {
  return (
    <Router>
      <div className="bg-black min-h-screen text-white font-sans overflow-x-hidden selection:bg-[#e62b1e] selection:text-white">
        
        {/* Header Global sekarang aktif dan akan muncul di semua halaman */}
        <Header />

        <main>
          <Routes>
            {/* Route utama mengarah ke Dashboard (Home) */}
            <Route path="/" element={<Dashboard />} />
            
            {/* Route mengarah ke halaman About */}
            <Route path="/about" element={<About />} />
            
            {/* Siapkan route lain di sini jika dibutuhkan */}
            <Route path="/speakers" element={<Speakers />} />
          </Routes>
        </main>

        {/* <Footer /> */}
        
      </div>
    </Router>
  );
};

export default App;