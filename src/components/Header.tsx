import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Menu, X, Ticket } from 'lucide-react';

// Interface HeaderProps dihapus karena kita sudah tidak menggunakan modal pop-up

const Header: React.FC = () => {
  const [isOpen, setIsOpen] = useState<boolean>(false);

  const toggleMenu = () => setIsOpen(!isOpen);

  return (
    <>
      <header className="flex justify-between items-center px-6 md:px-8 h-[80px] bg-black/95 fixed top-0 w-full z-40 border-b border-[#222] backdrop-blur-md">
        
        {/* Bagian Logo */}
        <Link to="/" className="font-sans text-2xl md:text-3xl font-black tracking-[-2px] text-[#e62b1e] no-underline flex items-baseline">
          TED<span className="text-[#e62b1e] font-black ml-[1px]">x</span>
          <span className="font-light text-white ml-2 text-[1.5rem] md:text-[1.8rem] tracking-[-1px]">UII</span>
        </Link>

        {/* Navigasi Desktop */}
        <nav className="hidden md:flex gap-8 items-center">
          <Link to="/" className="text-white no-underline font-semibold uppercase text-sm transition-colors duration-300 hover:text-[#e62b1e]">Home</Link>
          <Link to="/events" className="text-white no-underline font-semibold uppercase text-sm transition-colors duration-300 hover:text-[#e62b1e]">Events</Link>
          <Link to="/about" className="text-white no-underline font-semibold uppercase text-sm transition-colors duration-300 hover:text-[#e62b1e]">About</Link>
          <Link to="/speakers" className="text-white no-underline font-semibold uppercase text-sm transition-colors duration-300 hover:text-[#e62b1e]">Speakers</Link>
          
          {/* Tombol Desktop - Mengarah ke halaman /tickets */}
          {/* <Link
            to="/tickets"
            className="bg-[#e62b1e] text-white px-6 py-2.5 rounded font-extrabold tracking-[1px] border border-[#e62b1e] uppercase text-sm transition-all flex items-center gap-2 hover:bg-transparent hover:text-[#e62b1e] no-underline"
          >
            Buy Ticket <Ticket size={16} />
          </Link> */}
        </nav>

        {/* Tombol Toggle Mobile */}
        <button 
          className="md:hidden text-white cursor-pointer hover:text-[#e62b1e] transition-colors" 
          onClick={toggleMenu} 
          aria-label="Toggle Menu"
        >
          <Menu size={28} />
        </button>
      </header>

      {/* --- BAGIAN SIDEBAR MOBILE --- */}
      
      {/* Overlay Gelap */}
      <div 
        className={`fixed inset-0 bg-black/60 z-40 transition-opacity duration-300 md:hidden ${isOpen ? 'opacity-100 visible' : 'opacity-0 invisible'}`}
        onClick={toggleMenu}
      ></div>

      {/* Sidebar Solid Hitam dari Kanan */}
      <div 
        className={`fixed top-0 right-0 bottom-0 w-[280px] sm:w-[320px] bg-[#050505] z-50 flex flex-col p-8 border-l border-[#222] shadow-[-10px_0_30px_rgba(0,0,0,0.8)] transition-transform duration-300 ease-in-out md:hidden ${isOpen ? 'translate-x-0' : 'translate-x-full'}`}
      >
        <div className="flex justify-between items-center mb-10">
          <span className="font-sans text-xl font-black tracking-[-1px] text-[#e62b1e]">
            TED<span className="text-white ml-[1px]">x</span><span className="font-light text-white ml-1 tracking-normal">UII</span>
          </span>
          <button onClick={toggleMenu} className="text-[#666] hover:text-white transition-colors">
            <X size={28} />
          </button>
        </div>

        <div className="flex flex-col gap-6">
          <Link to="/" onClick={toggleMenu} className="text-white text-xl font-semibold uppercase tracking-wider transition-colors hover:text-[#e62b1e] border-b border-[#222] pb-4">Home</Link>
          <Link to="/events" onClick={toggleMenu} className="text-white text-xl font-semibold uppercase tracking-wider transition-colors hover:text-[#e62b1e] border-b border-[#222] pb-4">Events</Link>
          <Link to="/about" onClick={toggleMenu} className="text-white text-xl font-semibold uppercase tracking-wider transition-colors hover:text-[#e62b1e] border-b border-[#222] pb-4">About</Link>
          <Link to="/speakers" onClick={toggleMenu} className="text-white text-xl font-semibold uppercase tracking-wider transition-colors hover:text-[#e62b1e] border-b border-[#222] pb-4">Speakers</Link>
        </div>
        
        {/* Tombol Mobile ditaruh paling bawah - Mengarah ke /tickets */}
        {/* <Link 
          to="/tickets"
          onClick={toggleMenu} 
          className="mt-auto bg-[#e62b1e] text-white px-6 py-4 w-full text-center rounded font-extrabold tracking-[1px] border border-[#e62b1e] uppercase text-sm flex justify-center items-center gap-2 hover:bg-transparent hover:text-[#e62b1e] transition-all no-underline"
        >
          Buy Ticket <Ticket size={18} />
        </Link> */}
      </div>
    </>
  );
};

export default Header;