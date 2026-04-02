// src/pages/Dashboard.tsx
import React, { useEffect, useRef, useState } from 'react';
import { Calendar, MapPin, Ticket, ArrowRight, ChevronLeft, ChevronRight, User } from 'lucide-react';
import { Link } from 'react-router-dom';
import RevealOnScroll from '../components/RevealOnScroll';

// Import Supabase client
import { supabase } from '../supabase';

// Definisikan Interface untuk TypeScript
interface Speaker {
  id: string | number;
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
    const fetchSpeakers = async () => {
      try {
        const { data, error } = await supabase
          .from('speakers')
          .select('*')
          .limit(6);

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

    fetchSpeakers();

    const subscription = supabase
      .channel('public:speakers')
      .on(
        'postgres_changes', 
        { event: '*', schema: 'public', table: 'speakers' }, 
        () => {
          fetchSpeakers(); 
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(subscription);
    };
  }, []);

  return (
    <>
      {/* --- HERO SECTION --- */}
      {/* Background Deep Blue dipadu grid & glow, TAPI konten tetap yang awal */}
      <section 
        id="home" 
        className="min-h-screen flex items-center justify-center text-center relative pt-20 bg-[#000b18] overflow-hidden"
      >
        {/* Pattern Grid ala Poster */}
        <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.05)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.05)_1px,transparent_1px)] bg-[size:40px_40px] opacity-70"></div>
        
        {/* Glow Merah & Biru */}
        <div className="absolute top-[-10%] right-[-5%] w-[40vw] h-[40vw] bg-[#e62b1e] rounded-full blur-[120px] opacity-40 pointer-events-none"></div>
        <div className="absolute bottom-[-10%] left-[-10%] w-[50vw] h-[50vw] bg-[#003cff] rounded-full blur-[150px] opacity-20 pointer-events-none"></div>

        <div className="z-10 px-4 w-full relative">
          <RevealOnScroll animation="fade-up" delay="delay-100">
            <h2 className="text-base tracking-[2px] mb-6 text-[#e62b1e] uppercase font-bold drop-shadow-md">
              A resilient and sustainable future begins with the current project
            </h2>
          </RevealOnScroll>
          
          <RevealOnScroll animation="fade-up" delay="delay-200">
            <h1 className="glitch-text text-5xl md:text-[4.5rem] font-extrabold mb-8 uppercase leading-[1.1] tracking-tight drop-shadow-[0_0_20px_rgba(255,255,255,0.3)]" data-text="CURRENT PROJECT: LETS GO TO THE FUTURE">
              CURRENT PROJECT: <br /> LETS GO TO THE FUTURE
            </h1>
          </RevealOnScroll>
          
          <RevealOnScroll animation="fade-up" delay="delay-300">
            <div className="flex justify-center gap-6 md:gap-12 mb-12 flex-wrap">
              {/* Badge Glassmorphism */}
              <div className="flex items-center gap-2 font-bold bg-white/5 backdrop-blur-sm px-6 py-3 rounded-full border border-white/10">
                <Calendar className="text-[#e62b1e]" /> 
                <span className="tracking-widest">April 18, 2026</span>
              </div>
              <div className="flex items-center gap-2 font-bold bg-white/5 backdrop-blur-sm px-6 py-3 rounded-full border border-white/10">
                <MapPin className="text-[#e62b1e]" /> 
                <span className="tracking-widest">Ruang
Teatrikal Gedung Kuliah Umum (GKU) <br />
Dr. Sardjito, Universitas Islam Indonesia.</span>
              </div>
            </div>
          </RevealOnScroll>

          <RevealOnScroll animation="pop-in" delay="delay-500">
            <a 
              href="#" 
              className="inline-flex items-center gap-3 bg-[#e62b1e] text-white px-10 py-4 font-bold rounded-full transition-all duration-300 border-2 border-[#e62b1e] hover:bg-[#000b18] hover:text-[#e62b1e] hover:shadow-[0_0_30px_rgba(230,43,30,0.6)] uppercase tracking-wider"
            >
              BUY TICKET <Ticket size={18} />
            </a>
          </RevealOnScroll>
        </div>
      </section>

      {/* --- SPEAKERS SLIDER SECTION --- */}
      <section className="relative py-16 bg-[#000b18]">
        <RevealOnScroll animation="fade-up">
          <div className="py-10 px-8 max-w-[1200px] w-full mx-auto pb-0">
            <div className="text-center mb-8 relative z-10">
              <h2 className="text-[2.5rem] uppercase font-extrabold tracking-tight">
                MEET THE <span className="text-[#e62b1e]">SPEAKERS</span>
              </h2>
              <p className="text-[#8ba2c9] text-sm mt-2 tracking-wide">Use arrows or swipe to explore</p>
            </div>
          </div>
        </RevealOnScroll>

        <RevealOnScroll animation="fade-up" delay="delay-200">
          <div className="relative w-full group z-10">
            
            {/* Tombol Kiri */}
            <button 
              className="hidden md:flex absolute top-1/2 left-5 -translate-y-1/2 z-20 w-12 h-12 rounded-full bg-[#001c49]/80 border border-[#2a4374] text-white items-center justify-center cursor-pointer transition-all duration-300 backdrop-blur-md hover:bg-[#e62b1e] hover:border-[#e62b1e] hover:shadow-[0_0_20px_rgba(220,38,38,0.8)] hover:scale-110" 
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
                 <div className="text-[#8ba2c9] p-8 w-full text-center">Loading speakers...</div>
              ) : speakersTeaser.length === 0 ? (
                 <div className="text-[#8ba2c9] p-8 w-full text-center">No speakers yet.</div>
              ) : (
                speakersTeaser.map((speaker) => (
                  <div 
                    key={speaker.id} 
                    // Card Glassmorphism
                    className="flex-none w-[280px] bg-[#020d24] border border-[#1a2b4c] rounded-xl p-8 flex flex-col justify-between items-center text-center snap-start transition-all duration-500 relative z-10 hover:-translate-y-3 hover:border-[#e62b1e] hover:shadow-[0_20px_50px_rgba(230,43,30,0.2)] hover:z-20 backdrop-blur-sm"
                  >
                    <div className="w-[120px] h-[120px] bg-[#000b18] rounded-full flex items-center justify-center overflow-hidden border-2 border-[#2a4374]">
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
                      <User 
                        size={50} 
                        className="text-[#4a6394]" 
                        style={{ display: speaker.photoUrl ? 'none' : 'block' }} 
                      />
                    </div>
                    
                    <h3 className="mt-5 mb-2 text-[1.2rem] font-bold text-white tracking-wide">
                      {speaker.nama || speaker.name}
                    </h3>
                    <p className="text-[#8ba2c9] text-[0.85rem] mb-4 uppercase tracking-widest">{speaker.role}</p>
                    <div className="w-12 h-[2px] bg-[#e62b1e] mx-auto mb-4 opacity-70"></div>
                    <p className="font-semibold text-[#e5e5e5] uppercase text-[0.85rem] leading-snug">{speaker.topic}</p>
                  </div>
                ))
              )}
              
              {/* Kartu View All */}
              <Link 
                to="/speakers" 
                className="flex-none w-[280px] rounded-xl p-8 flex flex-col justify-center items-center text-center snap-start transition-all duration-500 relative z-10 hover:-translate-y-3 hover:z-20 cursor-pointer no-underline bg-[#e62b1e]/5 border border-dashed border-[#e62b1e]/40 hover:border-[#e62b1e] hover:shadow-[0_20px_50px_rgba(230,43,30,0.2)] backdrop-blur-sm"
              >
                <div className="flex flex-col items-center gap-4 text-white font-bold tracking-wider uppercase">
                  <span>View All Speakers</span>
                  <ArrowRight size={32} className="text-[#e62b1e]" />
                </div>
              </Link>
            </div>

            {/* Tombol Kanan */}
            <button 
              className="hidden md:flex absolute top-1/2 right-5 -translate-y-1/2 z-20 w-12 h-12 rounded-full bg-[#001c49]/80 border border-[#2a4374] text-white items-center justify-center cursor-pointer transition-all duration-300 backdrop-blur-md hover:bg-[#e62b1e] hover:border-[#e62b1e] hover:shadow-[0_0_20px_rgba(220,38,38,0.8)] hover:scale-110" 
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
        className="py-24 px-8 w-full bg-[#000b18] border-y border-[rgba(230,43,30,0.3)] bg-[radial-gradient(ellipse_at_center,rgba(230,43,30,0.15)_0%,rgba(0,28,73,0.5)_50%,transparent_100%)] shadow-[inset_0_10px_50px_-10px_rgba(0,11,24,1),inset_0_-10px_50px_-10px_rgba(0,11,24,1)] relative overflow-hidden"
      >
        {/* Grid pattern */}
        <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:40px_40px]"></div>

        <div className="max-w-[1200px] mx-auto relative z-10">
          <RevealOnScroll animation="fade-up">
            <div className="text-center mb-12">
              <h2 className="text-[2.5rem] uppercase font-extrabold tracking-tight drop-shadow-md">
                THE <span className="text-[#e62b1e]">THEME</span>
              </h2>
            </div>
          </RevealOnScroll>
          
          <RevealOnScroll animation="fade-up" delay="delay-200">
            {/* Box dengan efek kaca */}
            <div className="bg-[#020d24]/80 backdrop-blur-md border border-[#1a2b4c] p-8 md:p-12 rounded-2xl shadow-[0_0_30px_rgba(0,0,0,0.5)]">
              <p className="max-w-[800px] mx-auto text-center text-[1.2rem] leading-[1.8] text-[#e5e5e5]">
                This year's theme is <strong className="text-white tracking-wide">"Current Project: LetsGoToTheFuture!"</strong>. 
                TEDxUII invites us to move together towards a stronger and more sustainable world, 
                because the future is not shaped by time, but by those who choose to act now.
              </p>
            </div>
          </RevealOnScroll>
        </div>
      </section>
    </>
  );
};

export default Dashboard;