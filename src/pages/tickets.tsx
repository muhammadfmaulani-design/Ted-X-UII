import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Ticket, Plus, Minus, X, ArrowRight, Clock, Star } from 'lucide-react';
import RevealOnScroll from '../components/RevealOnScroll';
import { supabase } from '../supabase';

interface TicketCategory {
  id: string;
  name: string;
  price: number;
  quota: number;
  sold: number;
  is_active: boolean;
  created_at: string;
}

const Tickets: React.FC = () => {
  const navigate = useNavigate();
  const [ticketCategories, setTicketCategories] = useState<TicketCategory[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  
  const [selectedTicket, setSelectedTicket] = useState<TicketCategory | null>(null);
  const [quantity, setQuantity] = useState<number>(1);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  // Fetch Data
  useEffect(() => {
    const fetchTickets = async () => {
      try {
        const { data, error } = await supabase
          .from('ticket_categories')
          .select('*')
          .order('price', { ascending: true }); // Mengurutkan dari harga termurah ke termahal

        if (error) throw error;
        
        if (data) {
          setTicketCategories(data as TicketCategory[]);
        }
      } catch (error) {
        console.error("Error fetching ticket categories:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchTickets();

    const subscription = supabase
      .channel('public:ticket_categories')
      .on(
        'postgres_changes', 
        { event: '*', schema: 'public', table: 'ticket_categories' }, 
        () => {
          fetchTickets();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(subscription);
    };
  }, []);

  const handleOpenModal = (ticket: TicketCategory, isAvailable: boolean) => {
    if (isAvailable) {
      setSelectedTicket(ticket);
      setQuantity(1);
    }
  };

  const handleProceedToCheckout = () => {
    if (selectedTicket && quantity > 0) {
      navigate('/checkout', { 
        state: { 
          ticket: selectedTicket, 
          quantity: quantity 
        } 
      });
    }
  };

  return (
    <div className="pt-[80px] min-h-screen bg-[#000b18] overflow-hidden relative font-sans text-white">
      
      {/* Background Ornaments (Konsisten dengan tema TEDx) */}
      <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:40px_40px] pointer-events-none z-0"></div>
      <div className="absolute top-[-10%] right-[-10%] w-[50vw] h-[50vw] bg-[#e62b1e] rounded-full blur-[200px] opacity-[0.15] pointer-events-none z-0"></div>
      <div className="absolute bottom-[-10%] left-[-10%] w-[50vw] h-[50vw] bg-[#003cff] rounded-full blur-[250px] opacity-[0.1] pointer-events-none z-0"></div>

      {/* PERUBAHAN 1: max-w diperlebar jadi 1200px */}
      <div className="max-w-[1200px] mx-auto px-6 md:px-8 py-16 relative z-10">
        <RevealOnScroll animation="fade-up">
          <div className="text-center mb-16 md:mb-20">
            <h1 className="text-[3rem] md:text-[4.5rem] font-black uppercase tracking-tighter text-white leading-none drop-shadow-md">
              SECURE YOUR <span className="text-[#e62b1e]">SEAT</span>
            </h1>
            <p className="text-[#8ba2c9] mt-6 text-lg font-light max-w-2xl mx-auto">
              Choose the experience that suits you best and join the community of changemakers at TEDxUII 2026.
            </p>
          </div>
        </RevealOnScroll>

        {/* PERUBAHAN 2: lg:grid-cols-3 agar sejajar 3 kolom di laptop, dan max-w-4xl dihapus */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 items-stretch">
          {loading ? (
            <div className="col-span-full flex flex-col items-center justify-center py-20">
              <div className="w-12 h-12 border-4 border-[#1a2b4c] border-t-[#e62b1e] rounded-full animate-spin mb-4 shadow-[0_0_15px_rgba(230,43,30,0.5)]"></div>
              <p className="text-[#8ba2c9] font-bold uppercase tracking-widest animate-pulse">Loading Tickets...</p>
            </div>
          ) : ticketCategories.length === 0 ? (
            <div className="col-span-full text-center py-20 bg-[#020d24]/50 border border-[#1a2b4c] rounded-3xl backdrop-blur-md">
              <p className="text-xl font-bold uppercase tracking-widest text-[#8ba2c9]">No tickets available at the moment.</p>
            </div>
          ) : (
            ticketCategories.map((ticket, index) => {
              const remainingTickets = ticket.quota - ticket.sold;
              const isAvailable = ticket.is_active && remainingTickets > 0;
              const isSoldOut = ticket.is_active && remainingTickets <= 0;
              
              let statusText = "Coming Soon";
              if (isSoldOut) statusText = "Sold Out";
              else if (isAvailable) statusText = "Available";

              // PERUBAHAN 3: Jika di database Full Session adalah tiket ke-3, maka indexnya 2 (0, 1, 2)
              // Kalau mau aman pakai nama, bisa: const isPremium = ticket.name.toLowerCase().includes("full");
              const isPremium = index === 2; 

              return (
                <RevealOnScroll key={ticket.id} animation="fade-up" delay={`delay-${index * 200}`}>
                  <div 
                    onClick={() => handleOpenModal(ticket, isAvailable)}
                    className={`relative p-8 md:p-10 rounded-3xl transition-all duration-500 flex flex-col h-full backdrop-blur-xl
                      ${!isAvailable 
                        ? 'bg-black/40 border-white/5 cursor-not-allowed opacity-60 grayscale'
                        : isPremium 
                          ? 'bg-gradient-to-b from-[#e62b1e]/10 to-[#020d24]/80 border-2 border-[#e62b1e] cursor-pointer hover:-translate-y-3 shadow-[0_20px_50px_rgba(230,43,30,0.15)] hover:shadow-[0_20px_50px_rgba(230,43,30,0.3)]' 
                          : 'bg-[#020d24]/60 border border-[#1a2b4c] cursor-pointer hover:-translate-y-3 hover:border-[#4a6394]'
                      }
                    `}
                  >
                    {/* Badge Most Popular otomatis untuk tiket Premium */}
                    {isPremium && isAvailable && (
                      <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-[#e62b1e] text-white px-5 py-1.5 rounded-full text-[0.7rem] font-bold tracking-widest uppercase flex items-center gap-1.5 shadow-lg whitespace-nowrap">
                        <Star size={14} fill="white" /> Most Popular
                      </div>
                    )}

                    <div className="flex justify-between items-start mb-8">
                      <div className="flex flex-col gap-3">
                        <div className={`px-4 py-1.5 text-[0.7rem] font-bold uppercase tracking-widest rounded-full w-fit
                          ${isAvailable 
                            ? isPremium ? 'bg-[#e62b1e] text-white' : 'bg-[#e62b1e]/10 text-[#e62b1e] border border-[#e62b1e]/20' 
                          : isSoldOut ? 'bg-red-900/50 text-red-300 border border-red-800' 
                          : 'bg-gray-800 text-gray-400 border border-gray-700'}`}>
                          {statusText}
                        </div>
                        
                        {/* Fitur FOMO */}
                        {isAvailable && remainingTickets <= 10 && (
                          <div className="flex items-center gap-1.5 text-[#e62b1e] text-xs font-bold animate-pulse mt-1">
                            <Clock size={14} /> Only {remainingTickets} left!
                          </div>
                        )}
                      </div>

                      <Ticket size={28} className={isAvailable ? (isPremium ? "text-white" : "text-[#e62b1e]") : "text-gray-600"} />
                    </div>
                    
                    <h3 className="text-[1.75rem] font-black text-white uppercase tracking-tight mb-2 leading-none">
                      {ticket.name}
                    </h3>
                    <div className="w-12 h-1 bg-[#e62b1e] rounded-full mb-6"></div>
                    
                    <p className={`text-[2.5rem] font-black mt-auto leading-none ${isAvailable ? "text-[#e62b1e]" : "text-gray-500"}`}>
                      <span className="text-xl font-bold align-top mr-1">Rp</span>
                      {ticket.price.toLocaleString('id-ID')}
                    </p>

                    <button 
                      disabled={!isAvailable}
                      className={`w-full py-4 mt-8 rounded-xl font-bold tracking-wider uppercase transition-all duration-300
                        ${!isAvailable 
                          ? 'bg-gray-800 text-gray-500' 
                          : isPremium 
                            ? 'bg-[#e62b1e] text-white hover:bg-red-700 shadow-[0_0_20px_rgba(230,43,30,0.4)]' 
                            : 'bg-transparent border border-[#2a4374] text-white hover:bg-[#1a2b4c]'
                        }
                      `}
                    >
                      {isAvailable ? 'Select Ticket' : 'Unavailable'}
                    </button>
                  </div>
                </RevealOnScroll>
              );
            })
          )}
        </div>
      </div>

      {/* --- POP-UP QUANTITY MODAL --- */}
      {selectedTicket && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-md z-50 flex items-center justify-center p-4">
          <div className="bg-[#020d24] border border-[#2a4374] rounded-3xl p-8 max-w-sm w-full shadow-2xl relative transform transition-all">
            <button 
              onClick={() => setSelectedTicket(null)}
              className="absolute top-5 right-5 text-[#8ba2c9] hover:text-white transition-colors bg-[#000b18] p-2 rounded-full"
            >
              <X size={20} />
            </button>

            <h3 className="text-2xl font-black text-white uppercase tracking-tight mb-2 mt-2">Berapa tiket?</h3>
            <p className="text-[#8ba2c9] text-sm mb-8 font-light">
              <strong className="text-white">{selectedTicket.name}</strong> • Rp {selectedTicket.price.toLocaleString('id-ID')}
            </p>

            <div className="flex items-center justify-between bg-[#000b18] border border-[#1a2b4c] rounded-2xl p-2 mb-8">
              <button 
                onClick={() => setQuantity(q => Math.max(1, q - 1))}
                className="w-12 h-12 flex items-center justify-center bg-[#020d24] text-white hover:bg-[#e62b1e] rounded-xl transition-colors border border-[#1a2b4c]"
              >
                <Minus size={20} />
              </button>
              <span className="text-4xl font-black text-white w-16 text-center">{quantity}</span>
              <button 
                onClick={() => setQuantity(q => Math.min(5, selectedTicket.quota - selectedTicket.sold, q + 1))} 
                className="w-12 h-12 flex items-center justify-center bg-[#020d24] text-white hover:bg-[#e62b1e] rounded-xl transition-colors border border-[#1a2b4c]"
              >
                <Plus size={20} />
              </button>
            </div>

            <button 
              onClick={handleProceedToCheckout}
              className="w-full bg-[#e62b1e] text-white font-black uppercase tracking-widest py-4 rounded-xl hover:bg-red-700 transition-all flex justify-center items-center gap-2 shadow-[0_0_20px_rgba(230,43,30,0.4)]"
            >
              Checkout <ArrowRight size={18} />
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Tickets;