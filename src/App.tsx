import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

// Import Pages
import Dashboard from './pages/dashboard';
import About from './pages/about';
import Speakers from './pages/speakers'; 

// Import Components
import Header from './components/Header';
// import Transaction from './components/transaction'; // Pastikan file ini sudah dibuat

const App: React.FC = () => {
  // 1. State Modal
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);

  // 2. Data Tiket (Ganti ID sesuai yang ada di Supabase kamu)
  const ticketData = {
    id: "503a5798-2495-4263-9d9b-d65274f8151d",
    name: "Early Bird Ticket",
    price: 75000
  };

  return (
    <Router>
      <div className="bg-black min-h-screen text-white font-sans overflow-x-hidden selection:bg-[#e62b1e] selection:text-white">
        
        {/* 3. Oper fungsi onOpenModal ke Header */}
        <Header onOpenModal={() => setIsModalOpen(true)} />

        <main className="pt-[80px]"> {/* Tambah padding-top supaya konten nggak ketutup Header fixed */}
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/about" element={<About />} />
            <Route path="/speakers" element={<Speakers />} />
          </Routes>
        </main>

        {/* 4. Pasang Modal Transaction secara Global */}
        {/* <Transaction 
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          categoryId={ticketData.id}
          categoryName={ticketData.name}
          price={ticketData.price}
        /> */}
        
      </div>
    </Router>
  );
};

export default App;