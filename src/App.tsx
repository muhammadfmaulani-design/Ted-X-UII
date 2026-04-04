import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

// Import Pages
import Dashboard from './pages/dashboard'; // Pastikan nama file sesuai (huruf besar/kecil)
import About from './pages/about';
import Speakers from './pages/speakers'; 
import Tickets from './pages/tickets';   // Import halaman Tickets
import Checkout from './pages/checkout'; // Import halaman Checkout

// Import Components
import Header from './components/Header';

const App: React.FC = () => {
  return (
    <Router>
      <div className="bg-[#000b18] min-h-screen text-white font-sans overflow-x-hidden selection:bg-[#e62b1e] selection:text-white">
        
        {/* Header sekarang murni untuk navigasi, sudah tidak butuh props modal lagi */}
        <Header />

        {/* Konten Utama */}
        <main> 
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/about" element={<About />} />
            <Route path="/speakers" element={<Speakers />} />
            
            {/* Rute baru untuk sistem E-Commerce TEDx */}
            <Route path="/tickets" element={<Tickets />} />
            <Route path="/checkout" element={<Checkout />} />
          </Routes>
        </main>
        
      </div>
    </Router>
  );
};

export default App;