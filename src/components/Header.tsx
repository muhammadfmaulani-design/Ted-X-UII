import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X, Ticket } from 'lucide-react';

interface HeaderProps {
  onOpenModal: () => void;
}

const Header: React.FC<HeaderProps> = ({ onOpenModal }) => {
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const location = useLocation(); // Untuk mendeteksi perubahan URL halaman

  const toggleMenu = () => setIsOpen(!isOpen);

  // Efek pintar: Otomatis tutup menu mobile setiap kali pindah halaman
  useEffect(() => {
    setIsOpen(false);
  }, [location.pathname]);

  const handleBuyTicketMobile = () => {
    toggleMenu();
    onOpenModal();
  };

  return (
    <header className="flex justify-between items-center px-6 md:px-8 h-[80px] bg-black/90 fixed top-0 w-full z-50 border-b border-white/5 backdrop-blur-xl">
      
      {/* Bagian Logo */}
      <Link to="/" className="font-sans text-2xl md:text-3xl font-black tracking-[-2px] text-[#e62b1e] no-underline flex items-baseline z-50">
        TED<span className="text-[#e62b1e] font-black ml-[1px]">x</span>
        <span className="font-light text-white ml-2 text-[1.5rem] md:text-[1.8rem] tracking-[-1px]">UII</span>
      </Link>

      {/* Navigasi Desktop */}
      <nav className="hidden md:flex gap-8 items-center">
        <Link to="/" className="text-white no-underline font-semibold uppercase text-sm transition-colors duration-300 hover:text-[#e62b1e]">Home</Link>
        <Link to="/about" className="text-white no-underline font-semibold uppercase text-sm transition-colors duration-300 hover:text-[#e62b1e]">About</Link>
        <Link to="/speakers" className="text-white no-underline font-semibold uppercase text-sm transition-colors duration-300 hover:text-[#e62b1e]">Speakers</Link>
        
        {/* Tombol Desktop - DISABLED STATE */}
        <button
          disabled 
          onClick={onOpenModal} 
          className="bg-[#1a1a1a] text-[#666] px-6 py-2.5 rounded font-extrabold tracking-[1px] border border-[#333] uppercase text-sm cursor-not-allowed flex items-center gap-2 transition-all opacity-80"
        >
          Coming Soon <Ticket size={16} className="opacity-50" />
        </button>
      </nav>

      {/* Tombol Toggle Mobile */}
      <button 
        className="md:hidden text-white cursor-pointer z-50 p-2 hover:bg-white/10 rounded-full transition-colors" 
        onClick={toggleMenu} 
        aria-label="Toggle Menu"
      >
        {isOpen ? <X size={28} /> : <Menu size={28} />}
      </button>

      {/* Navigasi Layar Mobile (Premium UI) */}
      <div 
        className={`fixed top-0 left-0 right-0 bottom-0 bg-black/95 backdrop-blur-2xl flex flex-col items-center justify-center gap-10 transition-all duration-500 ease-in-out md:hidden ${isOpen ? 'opacity-100 visible translate-y-0' : 'opacity-0 invisible -translate-y-full'}`}
      >
        <div className="flex flex-col items-center gap-8 w-full px-8">
          <Link to="/" className="text-white text-3xl font-black uppercase tracking-widest transition-colors hover:text-[#e62b1e]">Home</Link>
          <Link to="/about" className="text-white text-3xl font-black uppercase tracking-widest transition-colors hover:text-[#e62b1e]">About</Link>
          <Link to="/speakers" className="text-white text-3xl font-black uppercase tracking-widest transition-colors hover:text-[#e62b1e]">Speakers</Link>
          
          <div className="w-16 h-[1px] bg-white/20 my-4"></div> {/* Garis pemisah estetik */}

          {/* Tombol Mobile - DISABLED STATE */}
          <button 
            disabled
            onClick={handleBuyTicketMobile} 
            className="w-full max-w-[280px] bg-[#1a1a1a] text-[#666] px-8 py-5 text-center rounded-xl font-black tracking-[2px] border border-[#333] uppercase text-lg cursor-not-allowed flex justify-center items-center gap-3 transition-all"
          >
            Coming Soon <Ticket size={20} className="opacity-50" />
          </button>
        </div>
      </div>
    </header>
  );
};

export default Header;