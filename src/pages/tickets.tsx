import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Ticket, Plus, Minus, X, ArrowRight, Clock } from 'lucide-react';
import RevealOnScroll from '../components/RevealOnScroll';
import { supabase } from '../supabase';

// 1. Interface disesuaikan SAMA PERSIS dengan struktur tabel kamu
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
          .order('price', { ascending: true });

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
    <div className="pt-[80px] min-h-screen bg-[#000b18] overflow-hidden relative">
      <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(ellipse_at_top,rgba(230,43,30,0.15)_0%,transparent_50%)] pointer-events-none"></div>

      <div className="max-w-[1000px] mx-auto px-6 md:px-8 py-16 relative z-10">
        <RevealOnScroll animation="fade-up">
          <div className="text-center mb-16">
            <h1 className="text-[3rem] md:text-[4.5rem] font-black uppercase tracking-tighter text-white leading-none">
              Get Your <span className="text-[#e62b1e]">Tickets</span>
            </h1>
            <p className="text-[#8ba2c9] mt-4 text-lg">Select your preferred ticket category to join TEDxUII 2026.</p>
          </div>
        </RevealOnScroll>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {loading ? (
            <div className="col-span-full flex flex-col items-center justify-center py-20">
              <div className="w-10 h-10 border-4 border-[#1a2b4c] border-t-[#e62b1e] rounded-full animate-spin mb-4"></div>
              <p className="text-[#8ba2c9] font-bold uppercase tracking-widest animate-pulse">Loading Tickets...</p>
            </div>
          ) : ticketCategories.length === 0 ? (
            <div className="col-span-full text-center py-20 text-[#8ba2c9]">
              <p className="text-xl font-bold uppercase tracking-widest">No tickets available at the moment.</p>
            </div>
          ) : (
            ticketCategories.map((ticket, index) => {
              // 2. Logika Ketersediaan Pintar (Active & Quota belum habis)
              const remainingTickets = ticket.quota - ticket.sold;
              const isAvailable = ticket.is_active && remainingTickets > 0;
              const isSoldOut = ticket.is_active && remainingTickets <= 0;
              
              // Penentuan Label Status
              let statusText = "Coming Soon";
              if (isSoldOut) statusText = "Sold Out";
              else if (isAvailable) statusText = "Available";

              return (
                <RevealOnScroll key={ticket.id} animation="fade-up" delay={`delay-${(index % 3) * 100}`}>
                  <div 
                    onClick={() => handleOpenModal(ticket, isAvailable)}
                    className={`relative p-8 rounded-2xl border transition-all duration-300 flex flex-col h-full
                      ${isAvailable 
                        ? 'bg-[#020d24] border-[#2a4374] cursor-pointer hover:border-[#e62b1e] hover:shadow-[0_10px_30px_rgba(230,43,30,0.15)] hover:-translate-y-2' 
                        : 'bg-black/40 border-white/5 cursor-not-allowed opacity-60 grayscale'
                      }
                    `}
                  >
                    <div className="flex justify-between items-start mb-6">
                      <div className="flex flex-col gap-2">
                        <div className={`px-3 py-1 text-xs font-bold uppercase tracking-widest rounded-full w-fit
                          ${isAvailable ? 'bg-[#e62b1e]/10 text-[#e62b1e] border border-[#e62b1e]/20' 
                          : isSoldOut ? 'bg-red-900/50 text-red-300 border border-red-800' 
                          : 'bg-gray-800 text-gray-400 border border-gray-700'}`}>
                          {statusText}
                        </div>
                        
                        {/* 3. Fitur FOMO: Tampilkan sisa tiket jika kurang dari 10 */}
                        {isAvailable && remainingTickets <= 10 && (
                          <div className="flex items-center gap-1 text-[#e62b1e] text-xs font-bold animate-pulse">
                            <Clock size={12} /> Almost Full! ({remainingTickets} left)
                          </div>
                        )}
                      </div>

                      <Ticket size={24} className={isAvailable ? "text-[#e62b1e]" : "text-gray-600"} />
                    </div>
                    
                    <h3 className="text-2xl font-black text-white uppercase tracking-tight mb-2">{ticket.name}</h3>
                    <p className="text-3xl font-black text-[#e62b1e] mt-auto">
                      Rp {ticket.price.toLocaleString('id-ID')}
                    </p>
                  </div>
                </RevealOnScroll>
              );
            })
          )}
        </div>
      </div>

      {/* --- POP-UP QUANTITY MODAL --- */}
      {selectedTicket && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-[#020d24] border border-[#2a4374] rounded-3xl p-8 max-w-sm w-full shadow-2xl relative transform transition-all">
            <button 
              onClick={() => setSelectedTicket(null)}
              className="absolute top-4 right-4 text-gray-400 hover:text-white transition"
            >
              <X size={24} />
            </button>

            <h3 className="text-xl font-bold text-white mb-1">Berapa tiket?</h3>
            <p className="text-[#8ba2c9] text-sm mb-6">{selectedTicket.name} • Rp {selectedTicket.price.toLocaleString('id-ID')}</p>

            <div className="flex items-center justify-between bg-[#000b18] border border-white/10 rounded-2xl p-2 mb-8">
              <button 
                onClick={() => setQuantity(q => Math.max(1, q - 1))}
                className="w-12 h-12 flex items-center justify-center bg-white/5 text-white hover:bg-white/10 rounded-xl transition"
              >
                <Minus size={20} />
              </button>
              <span className="text-3xl font-black text-white w-16 text-center">{quantity}</span>
              <button 
                // 4. Mencegah user beli lebih dari sisa kuota tiket
                onClick={() => setQuantity(q => Math.min(5, selectedTicket.quota - selectedTicket.sold, q + 1))} 
                className="w-12 h-12 flex items-center justify-center bg-white/5 text-white hover:bg-white/10 rounded-xl transition"
              >
                <Plus size={20} />
              </button>
            </div>

            <button 
              onClick={handleProceedToCheckout}
              className="w-full bg-[#e62b1e] text-white font-black uppercase tracking-widest py-4 rounded-xl hover:bg-red-700 transition-all flex justify-center items-center gap-2 shadow-[0_0_20px_rgba(230,43,30,0.3)]"
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