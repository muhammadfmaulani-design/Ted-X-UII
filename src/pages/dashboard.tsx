// src/pages/Dashboard.tsx
import React, { useEffect, useRef, useState } from 'react';
import { Calendar, MapPin, Ticket, ArrowRight, ChevronLeft, ChevronRight, User, CheckCircle, Star } from 'lucide-react';
import { Link } from 'react-router-dom';
import RevealOnScroll from '../components/RevealOnScroll';
import { supabase } from '../supabase';

// --- INTERFACES ---
interface Speaker {
  id: string | number;
  nama?: string;
  name?: string;
  role: string;
  topic: string;
  photoUrl?: string;
  photo_url?: string;
}

interface PastEvent {
  id: string;
  title: string;
  description: string;
  date: string;
  location: string;
  image_url: string;
}

const Dashboard: React.FC = () => {
  const sliderRef = useRef<HTMLDivElement>(null);
  
  // STATES
  const [speakersTeaser, setSpeakersTeaser] = useState<Speaker[]>([]);
  const [loadingSpeakers, setLoadingSpeakers] = useState<boolean>(true);
  
  const [pastEvents, setPastEvents] = useState<PastEvent[]>([]);
  const [loadingEvents, setLoadingEvents] = useState<boolean>(true);
  
  // LOGIC SCROLL SLIDER
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

  // FETCH DATA SPEAKERS & EVENTS
  useEffect(() => {
    // 1. Fetch Speakers
    const fetchSpeakers = async () => {
      try {
        const { data, error } = await supabase
          .from('speakers')
          .select('*')
          .limit(6);

        if (error) throw error;
        if (data) setSpeakersTeaser(data as Speaker[]);
      } catch (error) {
        console.error("Supabase Fetch Error (Speakers):", error);
      } finally {
        setLoadingSpeakers(false);
      }
    };

    // 2. Fetch Past Events
    const fetchPastEvents = async () => {
      try {
        const now = new Date().toISOString();
        const { data, error } = await supabase
          .from('events')
          .select('*')
          .lt('date', now) // Hanya ambil yang tanggalnya sudah lewat
          .order('date', { ascending: false })
          .limit(3);

        if (error) throw error;
        if (data) setPastEvents(data as PastEvent[]);
      } catch (error) {
        console.error("Supabase Fetch Error (Events):", error);
      } finally {
        setLoadingEvents(false);
      }
    };

    fetchSpeakers();
    fetchPastEvents();

    // Realtime Subscription untuk Speakers
    const subscription = supabase
      .channel('public:speakers')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'speakers' }, () => {
        fetchSpeakers(); 
      })
      .subscribe();

    return () => {
      supabase.removeChannel(subscription);
    };
  }, []);

  return (
    // WRAPPER GLOBAL: Background dan Grid ditaruh di sini agar nyambung (tidak beda kamar)
    <div className="bg-[#000b18] min-h-screen w-full relative overflow-hidden font-sans text-white">
      
      {/* --- GLOBAL BACKGROUND ORNAMENTS --- */}
      {/* Fixed Grid agar saat di scroll patternnya menyatu */}
      <div className="fixed inset-0 bg-[linear-gradient(rgba(255,255,255,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.03)_1px,transparent_1px)] bg-[size:40px_40px] pointer-events-none z-0"></div>
      
      {/* Ambient Glow tersebar di halaman */}
      <div className="absolute top-[5%] right-[-10%] w-[50vw] h-[50vw] bg-[#e62b1e] rounded-full blur-[200px] opacity-[0.15] pointer-events-none z-0"></div>
      <div className="absolute top-[30%] left-[-15%] w-[60vw] h-[60vw] bg-[#003cff] rounded-full blur-[250px] opacity-[0.1] pointer-events-none z-0"></div>
      <div className="absolute top-[60%] right-[-5%] w-[45vw] h-[45vw] bg-[#e62b1e] rounded-full blur-[200px] opacity-[0.1] pointer-events-none z-0"></div>
      <div className="absolute bottom-[-5%] left-[10%] w-[50vw] h-[50vw] bg-[#003cff] rounded-full blur-[250px] opacity-[0.15] pointer-events-none z-0"></div>

      
      {/* --- 1. HERO SECTION --- */}
      <section id="home" className="min-h-screen flex items-center justify-center text-center relative pt-20 z-10 overflow-hidden">
        
        {/* NEON GLOW KHUSUS HERO (Dikembalikan & Dipertegas) */}
        {/* Neon Merah Kanan (Sangat menyala seperti di gambar) */}
        <div className="absolute top-1/2 right-[-15%] -translate-y-1/2 w-[70vw] h-[70vw] max-w-[800px] max-h-[800px] bg-[#e62b1e] rounded-full blur-[120px] md:blur-[180px] opacity-[0.35] pointer-events-none z-0"></div>
        
        {/* Neon Biru Kiri */}
        <div className="absolute top-1/2 left-[-20%] -translate-y-1/2 w-[70vw] h-[70vw] max-w-[800px] max-h-[800px] bg-[#003cff] rounded-full blur-[150px] md:blur-[200px] opacity-[0.20] pointer-events-none z-0"></div>

        <div className="px-4 w-full relative z-10">
          <RevealOnScroll animation="fade-up" delay="delay-100">
            <h2 className="text-xs md:text-sm tracking-[3px] mb-6 text-[#e62b1e] uppercase font-bold drop-shadow-md">
              A resilient and sustainable future begins with the current project
            </h2>
          </RevealOnScroll>
          
          <RevealOnScroll animation="fade-up" delay="delay-200">
            <h1 className="text-5xl md:text-[5.5rem] font-extrabold mb-10 uppercase leading-[1.1] tracking-tight text-white drop-shadow-[0_0_20px_rgba(255,255,255,0.2)]">
              CURRENT PROJECT: <br /> LETS GO TO THE FUTURE
            </h1>
          </RevealOnScroll>
          
          <RevealOnScroll animation="fade-up" delay="delay-300">
            <div className="flex justify-center gap-4 md:gap-8 mb-12 flex-wrap">
              <div className="flex items-center gap-3 font-bold bg-[#020d24]/60 backdrop-blur-lg px-6 py-4 rounded-full border border-white/10 text-white shadow-lg">
                <Calendar className="text-[#e62b1e]" size={20} /> 
                <span className="tracking-widest text-sm md:text-base">April 18, 2026</span>
              </div>
              <div className="flex items-center gap-3 font-bold bg-[#020d24]/60 backdrop-blur-lg px-6 py-4 rounded-full border border-white/10 text-left text-white shadow-lg">
                <MapPin className="text-[#e62b1e] flex-shrink-0" size={20} /> 
                <span className="tracking-widest text-xs md:text-sm">
                  Ruang Teatrikal Gedung Kuliah Umum (GKU) <br />
                  Dr. Sardjito, Universitas Islam Indonesia.
                </span>
              </div>
            </div>
          </RevealOnScroll>

          <RevealOnScroll animation="pop-in" delay="delay-500">
            <a 
              href="#tickets" 
              className="inline-flex items-center gap-3 bg-[#e62b1e] text-white px-10 py-4 font-bold rounded-full transition-all duration-300 hover:bg-[#000b18] hover:text-[#e62b1e] border-2 border-[#e62b1e] hover:shadow-[0_0_30px_rgba(230,43,30,0.6)] uppercase tracking-wider"
            >
              BUY TICKET <Ticket size={18} />
            </a>
          </RevealOnScroll>
        </div>
      </section>
      

      {/* --- 2. ABOUT SECTION --- */}
      {/* Dihapus border-y dan inset shadownya agar menyatu */}
      <section id="about" className="py-24 px-8 w-full relative z-10">
        <div className="max-w-[1200px] mx-auto">
          <RevealOnScroll animation="fade-up">
            <div className="text-center mb-12">
              <h2 className="text-[2.5rem] uppercase font-extrabold tracking-tight drop-shadow-md">
                THE <span className="text-[#e62b1e]">THEME</span>
              </h2>
            </div>
          </RevealOnScroll>
          
          <RevealOnScroll animation="fade-up" delay="delay-200">
            <div className="bg-[#020d24]/60 backdrop-blur-xl border border-[#1a2b4c] p-8 md:p-12 rounded-3xl shadow-[0_20px_50px_rgba(0,0,0,0.5)]">
              <p className="max-w-[900px] mx-auto text-center text-[1.2rem] md:text-[1.4rem] leading-[1.8] text-[#8ba2c9]">
                This year's theme is <strong className="text-white tracking-wide">"Current Project: LetsGoToTheFuture!"</strong>. 
                TEDxUII invites us to move together towards a stronger and more sustainable world, 
                because the future is not shaped by time, but by those who choose to act now.
              </p>
            </div>
          </RevealOnScroll>
        </div>
      </section>


      {/* --- 3. PAST EVENTS SECTION --- */}
      {!loadingEvents && pastEvents.length > 0 && (
        <section id="past-events" className="py-24 px-8 w-full relative z-10">
          <div className="max-w-[1200px] mx-auto">
            <RevealOnScroll animation="fade-up">
              <div className="flex flex-col md:flex-row justify-between items-end mb-12 gap-6">
                <div className="text-left">
                  <div className="flex items-center gap-4 mb-4">
                    <div className="h-1 w-10 bg-[#e62b1e]"></div>
                    <h3 className="text-sm font-bold tracking-[0.2em] uppercase text-[#8ba2c9]">Our Legacy</h3>
                  </div>
                  <h2 className="text-[2.5rem] md:text-[4rem] uppercase font-black tracking-tighter leading-none text-white drop-shadow-md">
                    PAST <span className="text-[#e62b1e]">EVENTS</span>
                  </h2>
                </div>
                
                <Link to="/events" className="group flex items-center gap-2 text-sm font-bold tracking-widest uppercase text-[#8ba2c9] hover:text-white transition-colors pb-2">
                  Explore All History <ArrowRight size={18} className="transform group-hover:translate-x-2 transition-transform text-[#e62b1e]" />
                </Link>
              </div>
            </RevealOnScroll>

            <RevealOnScroll animation="fade-up" delay="delay-200">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {pastEvents.map((event) => (
                  <div key={event.id} className="group flex flex-col bg-[#020d24]/60 backdrop-blur-md border border-[#1a2b4c] rounded-2xl overflow-hidden hover:border-[#e62b1e]/50 hover:shadow-[0_10px_30px_rgba(230,43,30,0.15)] transition-all duration-500 hover:-translate-y-2">
                    <div className="aspect-[4/3] overflow-hidden relative border-b border-[#1a2b4c]">
                      <div className="absolute inset-0 bg-gradient-to-t from-[#020d24] via-transparent to-transparent z-10 opacity-80"></div>
                      <img 
                        src={event.image_url || 'https://via.placeholder.com/800x600'} 
                        alt={event.title}
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700 grayscale-[40%] group-hover:grayscale-0"
                      />
                      <div className="absolute top-4 right-4 z-20 bg-[#000b18]/80 backdrop-blur-sm border border-[#2a4374] text-white text-xs font-bold px-3 py-1.5 rounded-full tracking-wider">
                        {new Date(event.date).getFullYear()}
                      </div>
                    </div>
                    
                    <div className="p-8 flex-grow flex flex-col justify-between relative z-20 -mt-6">
                      <div>
                        <h3 className="text-xl font-bold mb-3 group-hover:text-[#e62b1e] transition-colors line-clamp-2 text-white">
                          {event.title}
                        </h3>
                        <div className="flex items-start text-sm text-[#8ba2c9] mb-4">
                          <MapPin size={16} className="mr-2 mt-0.5 flex-shrink-0" />
                          <span className="line-clamp-2">{event.location}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </RevealOnScroll>
          </div>
        </section>
      )}


      {/* --- 4. SPEAKERS SLIDER SECTION --- */}
      <section id="speakers" className="py-24 relative z-10">
        <RevealOnScroll animation="fade-up">
          <div className="px-8 max-w-[1200px] w-full mx-auto mb-8">
            <div className="text-center">
              <h2 className="text-[2.5rem] uppercase font-extrabold tracking-tight text-white drop-shadow-md">
                MEET THE <span className="text-[#e62b1e]">SPEAKERS</span>
              </h2>
              <p className="text-[#8ba2c9] text-sm mt-2 tracking-wide font-light">Use arrows or swipe to explore our lineup</p>
            </div>
          </div>
        </RevealOnScroll>

        <RevealOnScroll animation="fade-up" delay="delay-200">
          <div className="relative w-full group">
            
            <button 
              className="hidden md:flex absolute top-1/2 left-5 -translate-y-1/2 z-20 w-12 h-12 rounded-full bg-[#001c49]/80 border border-[#2a4374] text-white items-center justify-center cursor-pointer transition-all duration-300 backdrop-blur-md hover:bg-[#e62b1e] hover:border-[#e62b1e] hover:shadow-[0_0_20px_rgba(230,43,30,0.8)] hover:scale-110" 
              onClick={() => scroll('left')} 
              aria-label="Prev"
            >
              <ChevronLeft size={32} />
            </button>
            
            <div 
              className="flex justify-start overflow-x-auto gap-6 w-full py-8 px-6 md:px-[max(1.5rem,calc((100%-1200px)/2))] snap-x snap-mandatory scroll-smooth items-stretch [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]" 
              ref={sliderRef}
            >
              {loadingSpeakers ? (
                 <div className="text-[#8ba2c9] p-8 w-full text-center font-medium animate-pulse">Loading amazing speakers...</div>
              ) : speakersTeaser.length === 0 ? (
                 <div className="text-[#8ba2c9] p-8 w-full text-center">No speakers announced yet.</div>
              ) : (
                speakersTeaser.map((speaker) => (
                  <Link 
                    key={speaker.id} 
                    to={`/speakers#${speaker.id}`}
                    className="flex-none w-[280px] bg-[#020d24]/80 border border-[#1a2b4c] rounded-2xl p-8 flex flex-col justify-between items-center text-center snap-start transition-all duration-500 relative hover:-translate-y-3 hover:border-[#e62b1e] hover:shadow-[0_20px_50px_rgba(230,43,30,0.2)] hover:z-20 backdrop-blur-md no-underline cursor-pointer group/speaker"
                  >
                    <div className="w-[120px] h-[120px] bg-[#000b18] rounded-full flex items-center justify-center overflow-hidden border-2 border-[#2a4374] transition-colors group-hover/speaker:border-[#e62b1e]/50">
                      {(speaker.photo_url || speaker.photoUrl) ? (
                        <img 
                          src={speaker.photo_url || speaker.photoUrl} 
                          alt={speaker.nama || speaker.name} 
                          className="w-full h-full object-cover transition-transform duration-700 group-hover/speaker:scale-110"
                          onError={(e: React.SyntheticEvent<HTMLImageElement, Event>) => { 
                            const target = e.currentTarget;
                            target.style.display = 'none'; 
                            const nextElement = target.nextElementSibling as HTMLElement | null;
                            if (nextElement) nextElement.style.display = 'block';
                          }}
                        />
                      ) : null}
                      <User size={50} className="text-[#4a6394]" style={{ display: (speaker.photo_url || speaker.photoUrl) ? 'none' : 'block' }} />
                    </div>
                    
                    <div className="mt-5">
                      <h3 className="mb-2 text-[1.2rem] font-bold text-white tracking-wide transition-colors group-hover/speaker:text-[#e62b1e]">
                        {speaker.nama || speaker.name}
                      </h3>
                      <p className="text-[#8ba2c9] text-[0.85rem] mb-4 uppercase tracking-widest font-medium">{speaker.role}</p>
                      <div className="w-12 h-[2px] bg-[#e62b1e] mx-auto mb-4 opacity-70 group-hover/speaker:w-16 transition-all"></div>
                      <p className="font-semibold text-[#e5e5e5] uppercase text-[0.85rem] leading-snug line-clamp-2">{speaker.topic}</p>
                    </div>
                  </Link>
                ))
              )}
              
              <Link 
                to="/speakers" 
                className="flex-none w-[200px] rounded-2xl p-8 flex flex-col justify-center items-center text-center snap-start transition-all duration-500 relative hover:-translate-y-3 hover:z-20 cursor-pointer no-underline bg-transparent border border-transparent hover:bg-[#e62b1e]/5 hover:border-[#e62b1e] hover:shadow-[0_20px_50px_rgba(230,43,30,0.1)] backdrop-blur-sm group/viewall"
              >
                <div className="flex flex-col items-center gap-4 transition-all duration-300">
                  <div className="w-12 h-12 rounded-full border border-[#2a4374] flex items-center justify-center group-hover/viewall:bg-[#e62b1e] group-hover/viewall:border-[#e62b1e] transition-colors">
                    <ArrowRight size={24} className="text-[#8ba2c9] group-hover/viewall:text-white transition-colors" />
                  </div>
                  <span className="text-[#8ba2c9] group-hover/viewall:text-white font-bold tracking-wider uppercase text-sm">
                    View All <br /> Speakers
                  </span>
                </div>
              </Link>
            </div>

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


      {/* --- 5. TICKET FACILITIES SECTION --- */}
      <section id="tickets" className="py-24 px-6 md:px-8 w-full relative z-10 mb-20">
        <div className="max-w-[1000px] mx-auto">
          <RevealOnScroll animation="fade-up">
            <div className="text-center mb-16">
              <h2 className="text-[2.5rem] md:text-[3.5rem] uppercase font-black tracking-tighter drop-shadow-md">
                SECURE YOUR <span className="text-[#e62b1e]">SEAT</span>
              </h2>
              <p className="text-[#8ba2c9] text-lg mt-4 max-w-2xl mx-auto font-light">
                Choose the experience that suits you best. Join the community of changemakers.
              </p>
            </div>
          </RevealOnScroll>

          <RevealOnScroll animation="fade-up" delay="delay-200">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12 items-center">
              
              {/* Ticket Type 1: Single Session */}
              <div className="bg-[#020d24]/60 backdrop-blur-xl border border-[#1a2b4c] rounded-3xl p-8 md:p-10 transition-all duration-300 hover:border-[#4a6394] hover:-translate-y-2">
                <h3 className="text-2xl font-bold uppercase tracking-wider text-white mb-2">Single Session</h3>
                <p className="text-[#8ba2c9] text-sm mb-8 h-10">Perfect for attendees who only want to experience the first session.</p>
                
                <ul className="space-y-4 mb-10">
                  <li className="flex items-start gap-3 text-[#e5e5e5]">
                    <CheckCircle size={20} className="text-[#4a6394] shrink-0 mt-0.5" />
                    <span>Access to Session 1 only</span>
                  </li>
                  {/* Fasilitas yang dicoret untuk Single Session */}
                  <li className="flex items-start gap-3 text-zinc-600">
                    <CheckCircle size={20} className="shrink-0 mt-0.5" />
                    <span className="line-through decoration-zinc-600">Access to All Sessions</span>
                  </li>
                  <li className="flex items-start gap-3 text-zinc-600">
                    <CheckCircle size={20} className="shrink-0 mt-0.5" />
                    <span className="line-through decoration-zinc-600">Food & Beverages (Konsumsi)</span>
                  </li>
                  <li className="flex items-start gap-3 text-zinc-600">
                    <CheckCircle size={20} className="shrink-0 mt-0.5" />
                    <span className="line-through decoration-zinc-600">E-Certificate of Attendance</span>
                  </li>
                  <li className="flex items-start gap-3 text-zinc-600">
                    <CheckCircle size={20} className="shrink-0 mt-0.5" />
                    <span className="line-through decoration-zinc-600">TEDxUII Merchandise</span>
                  </li>
                </ul>

                <button className="w-full py-4 rounded-xl font-bold tracking-wider uppercase border border-[#2a4374] text-white hover:bg-[#1a2b4c] transition-colors">
                  Select Single
                </button>
              </div>

              {/* Ticket Type 2: Full Session (Highlighted) */}
              <div className="bg-gradient-to-b from-[#e62b1e]/10 to-[#020d24]/80 backdrop-blur-xl border-2 border-[#e62b1e] rounded-3xl p-8 md:p-10 relative transform md:-translate-y-4 shadow-[0_20px_50px_rgba(230,43,30,0.2)]">
                
                <div className="absolute -top-5 left-1/2 -translate-x-1/2 bg-[#e62b1e] text-white px-6 py-2 rounded-full text-sm font-bold tracking-widest uppercase flex items-center gap-2 shadow-lg">
                  <Star size={16} fill="white" /> Most Popular
                </div>

                <h3 className="text-2xl font-bold uppercase tracking-wider text-white mb-2 mt-2">Full Session</h3>
                <p className="text-[#8ba2c9] text-sm mb-8 h-10">The ultimate TEDxUII experience with all exclusive perks.</p>
                
                <ul className="space-y-4 mb-10">
                  <li className="flex items-start gap-3 text-white font-medium">
                    <CheckCircle size={20} className="text-[#e62b1e] shrink-0 mt-0.5" />
                    <span>Access to All Sessions (Full Day)</span>
                  </li>
                  <li className="flex items-start gap-3 text-white font-medium">
                    <CheckCircle size={20} className="text-[#e62b1e] shrink-0 mt-0.5" />
                    <span>Food & Beverages Included</span>
                  </li>
                  <li className="flex items-start gap-3 text-white font-medium">
                    <CheckCircle size={20} className="text-[#e62b1e] shrink-0 mt-0.5" />
                    <span>E-Certificate of Attendance</span>
                  </li>
                  <li className="flex items-start gap-3 text-white font-medium">
                    <CheckCircle size={20} className="text-[#e62b1e] shrink-0 mt-0.5" />
                    <span>Exclusive TEDxUII Merchandise</span>
                  </li>
                </ul>

                <a href="/checkout" className="block w-full py-4 rounded-xl font-bold tracking-wider uppercase bg-[#e62b1e] text-white text-center hover:bg-red-700 hover:shadow-[0_0_20px_rgba(230,43,30,0.6)] transition-all">
                  Get Full Session
                </a>
              </div>

            </div>
          </RevealOnScroll>
        </div>
      </section>

    </div>
  );
};

export default Dashboard;