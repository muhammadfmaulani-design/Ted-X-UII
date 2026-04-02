// src/pages/Dashboard.tsx
import React, { useEffect, useRef, useState } from 'react';
import { Calendar, MapPin, Ticket, ArrowRight, ChevronLeft, ChevronRight, User } from 'lucide-react';
import { Link } from 'react-router-dom';
import RevealOnScroll from '../components/RevealOnScroll';

// Import Supabase client yang baru saja dibuat
import { supabase } from '../supabase';

// Definisikan Interface untuk TypeScript
interface Speaker {
  id: string | number; // Supabase biasanya pakai UUID (string) atau auto-increment (number)
  nama?: string;
  name?: string;
  role: string;
  topic: string;
  photoUrl?: string;
}

const Dashboard: React.FC = () => {
  const sliderRef = useRef<HTMLDivElement>(null);
  const [speakersTeaser, setSpeakersTeaser] = useState<Speaker[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  
  // Logic Scroll Slider
  const scroll = (direction: 'left' | 'right') => {
    if (sliderRef.current) {
      const { current } = sliderRef;
      const scrollAmount = 300; 
      if (direction === 'left') {
        current.scrollBy({ left: -scrollAmount, behavior: 'smooth' });
      } else {
        current.scrollBy({ left: scrollAmount, behavior: 'smooth' });
      }
    }
  };

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  // FETCH DATA DARI SUPABASE
  useEffect(() => {
    // Fungsi untuk mengambil data awal
    const fetchSpeakers = async () => {
      try {
        const { data, error } = await supabase
          .from('speakers')
          .select('*')
          .limit(6); // Ambil 6 data pertama untuk teaser

        if (error) throw error;
        
        if (data) {
          setSpeakersTeaser(data as Speaker[]);
        }
      } catch (error) {
        console.error("Supabase Fetch Error:", error);
      } finally {
        setLoading(false);
      }
    };

    // Panggil fungsi fetch pertama kali
    fetchSpeakers();

    // (Opsional tapi direkomendasikan) 
    // Setup Realtime Subscription untuk meniru "onSnapshot" Firebase
    const subscription = supabase
      .channel('public:speakers')
      .on(
        'postgres_changes', 
        { event: '*', schema: 'public', table: 'speakers' }, 
        (payload) => {
          console.log('Perubahan data terdeteksi!', payload);
          fetchSpeakers(); // Render ulang data jika ada perubahan di database
        }
      )
      .subscribe();

    // Cleanup subscription saat komponen unmount
    return () => {
      supabase.removeChannel(subscription);
    };
  }, []);

  return (
    <>
      {/* --- HERO SECTION --- */}
      <section 
        id="home" 
        className="min-h-screen flex items-center justify-center text-center relative pt-20 bg-[radial-gradient(circle_at_center,#330000_0%,#000000_80%)]"
      >
        <div className="z-10 px-4 w-full">
          <RevealOnScroll animation="fade-up" delay="delay-100">
            <h2 className="text-base tracking-[2px] mb-6 text-[#e62b1e] uppercase font-bold">
              A resilient and sustainable future begins with the current project
            </h2>
          </RevealOnScroll>
          
          <RevealOnScroll animation="fade-up" delay="delay-200">
            <h1 className="glitch-text text-5xl md:text-[4.5rem] font-extrabold mb-8 uppercase leading-[1.1] tracking-tight" data-text="LETS GO TO THE FUTURE">
              LETS GO TO THE FUTURE
            </h1>
          </RevealOnScroll>
          
          <RevealOnScroll animation="fade-up" delay="delay-300">
            <div className="flex justify-center gap-8 mb-12 flex-wrap">
              <div className="flex items-center gap-2 font-bold">
                <Calendar className="text-[#e62b1e]" /> 
                <span>DECEMBER 20, 2025</span>
              </div>
              <div className="flex items-center gap-2 font-bold">
                <MapPin className="text-[#e62b1e]" /> 
                <span>AUDITORIUM UII, YOGYAKARTA</span>
              </div>
            </div>
          </RevealOnScroll>

          <RevealOnScroll animation="pop-in" delay="delay-500">
            <a 
              href="#" 
              className="inline-flex items-center gap-2 bg-[#e62b1e] text-white px-10 py-4 font-bold rounded-full transition-all duration-300 border-2 border-[#e62b1e] hover:bg-transparent hover:text-white uppercase"
            >
              BUY TICKET <Ticket size={18} />
            </a>
          </RevealOnScroll>
        </div>
      </section>

      {/* --- SPEAKERS SLIDER SECTION --- */}
      <section className="relative my-16 py-0">
        <RevealOnScroll animation="fade-up">
          <div className="py-20 px-8 max-w-[1200px] w-full mx-auto pb-0">
            <div className="text-center mb-8">
              <h2 className="text-[2.5rem] uppercase font-extrabold tracking-tight">
                MEET THE <span className="text-[#e62b1e]">SPEAKERS</span>
              </h2>
              <p className="text-[#ccc] text-sm mt-2">Use arrows or swipe to explore</p>
            </div>
          </div>
        </RevealOnScroll>

        <RevealOnScroll animation="fade-up" delay="delay-200">
          <div className="relative w-full group">
            
            {/* Tombol Kiri */}
            <button 
              className="hidden md:flex absolute top-1/2 left-5 -translate-y-1/2 z-20 w-12 h-12 rounded-full bg-black/70 border border-[#333] text-white items-center justify-center cursor-pointer transition-all duration-300 backdrop-blur-sm hover:bg-[#e62b1e] hover:border-[#e62b1e] hover:shadow-[0_0_15px_rgba(220,38,38,0.8)] hover:scale-110" 
              onClick={() => scroll('left')} 
              aria-label="Prev"
            >
              <ChevronLeft size={32} />
            </button>
            
            {/* Track Slider */}
            <div 
              className="flex overflow-x-auto gap-6 w-full py-12 px-6 md:px-[max(1.5rem,calc((100%-1200px)/2))] snap-x snap-mandatory scroll-smooth items-stretch [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]" 
              ref={sliderRef}
            >
              {loading ? (
                 <div className="text-[#666] p-8 w-full text-center">Loading speakers...</div>
              ) : speakersTeaser.length === 0 ? (
                 <div className="text-[#666] p-8 w-full text-center">No speakers yet.</div>
              ) : (
                speakersTeaser.map((speaker) => (
                  <div 
                    key={speaker.id} 
                    className="flex-none w-[280px] bg-[#050505] border border-[#222] rounded-lg p-8 flex flex-col justify-between items-center text-center snap-start transition-all duration-300 relative z-10 hover:-translate-y-2.5 hover:border-[#0088ff] hover:shadow-[0_15px_40px_rgba(0,100,255,0.25)] hover:z-20"
                  >
                    <div className="w-[120px] h-[120px] bg-[#111] rounded-full flex items-center justify-center overflow-hidden">
                      {speaker.photoUrl ? (
                        <img 
                          src={speaker.photoUrl} 
                          alt={speaker.nama || speaker.name} 
                          className="w-full h-full object-cover"
                          onError={(e) => { 
                            (e.target as HTMLImageElement).style.display = 'none'; 
                            ((e.target as HTMLImageElement).nextSibling as HTMLElement).style.display = 'block'; 
                          }}
                        />
                      ) : null}
                      {/* Fallback Icon */}
                      <User 
                        size={50} 
                        className="text-[#444]" 
                        style={{ display: speaker.photoUrl ? 'none' : 'block' }} 
                      />
                    </div>
                    
                    <h3 className="mt-4 mb-2 text-[1.2rem] text-white">
                      {speaker.nama || speaker.name}
                    </h3>
                    <p className="text-[#888] text-[0.9rem] mb-4">{speaker.role}</p>
                    <div className="w-10 h-0.5 bg-[#333] mx-auto mb-4"></div>
                    <p className="font-bold text-white uppercase text-[0.85rem]">{speaker.topic}</p>
                  </div>
                ))
              )}
              
              {/* Kartu View All */}
              <Link 
                to="/speakers" 
                className="flex-none w-[280px] rounded-lg p-8 flex flex-col justify-center items-center text-center snap-start transition-all duration-300 relative z-10 hover:-translate-y-2.5 hover:z-20 cursor-pointer no-underline bg-[#003cff]/5 border border-dashed border-[#0064ff]/30 hover:border-[#0088ff] hover:shadow-[0_15px_40px_rgba(0,100,255,0.25)]"
              >
                <div className="flex flex-col items-center gap-4 text-white font-bold">
                  <span>View All Speakers</span>
                  <ArrowRight size={32} className="text-[#e62b1e]" />
                </div>
              </Link>
            </div>

            {/* Tombol Kanan */}
            <button 
              className="hidden md:flex absolute top-1/2 right-5 -translate-y-1/2 z-20 w-12 h-12 rounded-full bg-black/70 border border-[#333] text-white items-center justify-center cursor-pointer transition-all duration-300 backdrop-blur-sm hover:bg-[#e62b1e] hover:border-[#e62b1e] hover:shadow-[0_0_15px_rgba(220,38,38,0.8)] hover:scale-110" 
              onClick={() => scroll('right')} 
              aria-label="Next"
            >
              <ChevronRight size={32} />
            </button>

          </div>
        </RevealOnScroll>
      </section>
      
      {/* --- ABOUT SECTION --- */}
      <section 
        id="about" 
        className="py-20 px-8 max-w-[1200px] w-full mx-auto bg-[#0a0a0a] my-16 border-y border-[rgba(220,38,38,0.5)] bg-[radial-gradient(ellipse_at_center,rgba(220,38,38,0.25)_0%,rgba(220,38,38,0.1)_40%,rgba(50,0,0,0.05)_85%,transparent_100%)] shadow-[0_0_60px_-20px_rgba(220,38,38,0.3),inset_0_10px_40px_-10px_rgba(220,38,38,0.1),inset_0_-10px_40px_-10px_rgba(220,38,38,0.1)]"
      >
        <RevealOnScroll animation="fade-up">
          <div className="text-center mb-16">
            <h2 className="text-[2.5rem] uppercase font-extrabold tracking-tight">
              THE <span className="text-[#e62b1e]">THEME</span>
            </h2>
          </div>
        </RevealOnScroll>
        
        <RevealOnScroll animation="fade-up" delay="delay-200">
          <div>
            <p className="max-w-[800px] mx-auto text-center text-[1.2rem] leading-[1.8]">
              This year's theme is <strong>"Current Project: LetsGoToTheFuture!"</strong>. 
              TEDxUII invites us to move together towards a stronger and more sustainable world, 
              because the future is not shaped by time, but by those who choose to act now.
            </p>
          </div>
        </RevealOnScroll>
      </section>
    </>
  );
};

export default Dashboard;