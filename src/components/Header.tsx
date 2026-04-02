// src/components/Header.tsx
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Menu, X, Ticket } from 'lucide-react';

const Header: React.FC = () => {
  const [isOpen, setIsOpen] = useState<boolean>(false);

  const toggleMenu = () => setIsOpen(!isOpen);

  return (
    <header className="flex justify-between items-center px-6 md:px-8 h-[80px] bg-black/95 fixed top-0 w-full z-50 border-b border-[#222] backdrop-blur-md">
      
      {/* Bagian Logo */}
      <Link to="/" className="font-sans text-2xl md:text-3xl font-black tracking-[-2px] text-[#e62b1e] no-underline flex items-baseline">
        TED<span className="text-[#e62b1e] font-black ml-[1px]">x</span>
        <span className="font-light text-white ml-2 text-[1.5rem] md:text-[1.8rem] tracking-[-1px]">UII</span>
      </Link>

      {/* Navigasi Desktop */}
      <nav className="hidden md:flex gap-8 items-center">
        <Link to="/" className="text-white no-underline font-semibold uppercase text-sm transition-colors duration-300 hover:text-[#e62b1e]">Home</Link>
        <Link to="/about" className="text-white no-underline font-semibold uppercase text-sm transition-colors duration-300 hover:text-[#e62b1e]">About</Link>
        
        {/* Ini Tambahan Menu Speakers-nya */}
        <Link to="/speakers" className="text-white no-underline font-semibold uppercase text-sm transition-colors duration-300 hover:text-[#e62b1e]">Speakers</Link>
        
        <a 
          href="#ticket" 
          className="bg-[#e62b1e] text-white px-6 py-2.5 rounded font-extrabold tracking-[0.5px] transition-all duration-300 border border-[#e62b1e] no-underline uppercase text-sm hover:bg-transparent hover:text-[#e62b1e] hover:shadow-[0_0_15px_rgba(230,43,30,0.5)] hover:-translate-y-0.5 flex items-center gap-2"
        >
          Buy Ticket <Ticket size={16} />
        </a>
      </nav>

      {/* Tombol Toggle Mobile (Hamburger Menu) */}
      <button 
        className="md:hidden text-white cursor-pointer" 
        onClick={toggleMenu} 
        aria-label="Toggle Menu"
      >
        {isOpen ? <X size={28} /> : <Menu size={28} />}
      </button>

      {/* Navigasi Layar Mobile */}
      <div 
        className={`fixed top-[80px] left-0 right-0 bottom-0 bg-black flex flex-col items-center justify-center gap-8 border-t border-[#222] transition-transform duration-300 ease-in-out md:hidden ${isOpen ? 'translate-x-0' : 'translate-x-full'}`}
      >
        <Link to="/" onClick={toggleMenu} className="text-white text-2xl font-semibold uppercase transition-colors hover:text-[#e62b1e]">Home</Link>
        <Link to="/about" onClick={toggleMenu} className="text-white text-2xl font-semibold uppercase transition-colors hover:text-[#e62b1e]">About</Link>
        
        {/* Ini Tambahan Menu Speakers untuk Mobile */}
        <Link to="/speakers" onClick={toggleMenu} className="text-white text-2xl font-semibold uppercase transition-colors hover:text-[#e62b1e]">Speakers</Link>
        
        <a 
          href="#ticket" 
          onClick={toggleMenu} 
          className="mt-4 bg-[#e62b1e] text-white px-8 py-4 w-4/5 text-center rounded font-extrabold tracking-[0.5px] transition-all duration-300 border border-[#e62b1e] uppercase text-lg hover:bg-transparent hover:text-[#e62b1e]"
        >
          Buy Ticket
        </a>
      </div>
    </header>
  );
};

export default Header;