import React, { useEffect, useState, useRef } from 'react';
import { User } from 'lucide-react';
import RevealOnScroll from '../components/RevealOnScroll';
import { supabase } from '../supabase';

interface Speaker {
  id: string;
  name: string;
  role?: string;
  topic?: string;
  desc?: string;
  photo_url?: string;
}

const SpeakerPhoto: React.FC<{ src: string; alt: string }> = ({ src, alt }) => {
  const [inView, setInView] = useState<boolean>(false);
  const imgRef = useRef<HTMLImageElement | null>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        setInView(entry.isIntersecting);
      },
      { threshold: 0.3 } 
    );

    if (imgRef.current) observer.observe(imgRef.current);
    return () => observer.disconnect();
  }, []);

  const handleError = (e: React.SyntheticEvent<HTMLImageElement, Event>) => {
    const target = e.currentTarget;
    target.style.display = 'none';
    const nextElement = target.nextElementSibling as HTMLElement | null;
    if (nextElement) {
      nextElement.style.display = 'flex';
    }
  };

  return (
    <img
      ref={imgRef}
      src={src}
      alt={alt}
      className={`w-full h-full object-cover transition-all duration-[1500ms] ease-out scale-105 group-hover:scale-100 ${
        inView ? 'grayscale-0' : 'grayscale'
      }`}
      onError={handleError}
    />
  );
};

const Speakers: React.FC = () => {
  const [speakersData, setSpeakersData] = useState<Speaker[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  useEffect(() => {
    const fetchSpeakers = async () => {
      try {
        const { data, error } = await supabase
          .from('speakers')
          .select('*')
          .order('created_at', { ascending: true });

        if (error) throw error;
        
        if (data) {
          setSpeakersData(data as Speaker[]);
        }
      } catch (error) {
        console.error("Error fetching speakers:", error);
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
    <div className="pt-[80px] min-h-screen bg-[#000814] overflow-hidden relative">
      
      {/* 1. GLOBAL GRID PATTERN (Opacity dinaikkan dari 0.015 ke 0.03 agar grid lebih tegas seperti di Home) */}
      <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.03)_1px,transparent_1px)] bg-[size:40px_40px] pointer-events-none z-0"></div>

      {/* 2. GLOBAL AMBIENT NEON (Warna merah dan biru DIPERKUAT agar matching dengan Home Page) */}
      {/* Glow Merah Kuat di Kanan (seperti gambar) */}
      <div className="absolute top-[-10%] right-[-20%] w-[70vw] h-[70vw] bg-[#e62b1e] rounded-full blur-[200px] opacity-[0.18] pointer-events-none z-0"></div>
      
      {/* Glow Biru Gelap di Kiri */}
      <div className="absolute top-[30%] left-[-20%] w-[60vw] h-[60vw] bg-[#003cff] rounded-full blur-[250px] opacity-[0.08] pointer-events-none z-0"></div>
      
      {/* Glow Merah Tambahan di Bawah agar merata saat di-scroll */}
      <div className="absolute bottom-[-10%] right-[-10%] w-[60vw] h-[60vw] bg-[#e62b1e] rounded-full blur-[250px] opacity-[0.12] pointer-events-none z-0"></div>

      {/* 3. HERO SECTION */}
      <div className="pt-16 md:pt-24 px-6 md:px-8 max-w-[1200px] mx-auto pb-12 relative z-10">
        <RevealOnScroll animation="fade-up">
          <div className="relative w-full py-16 md:py-24 px-6 text-center">
            
            {/* Glow khusus di belakang teks dipertahankan */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[300px] md:w-[600px] h-[150px] md:h-[300px] bg-[#e62b1e] opacity-15 blur-[120px] rounded-full pointer-events-none z-[-1]"></div>

            <div className="relative z-10">
              <h2 className="text-[3rem] md:text-[6rem] uppercase font-black tracking-tighter mb-0 leading-[0.9] text-white drop-shadow-2xl">
                MEET THE <br className="md:hidden" />
                <span className="text-[#e62b1e]">SPEAKERS</span>
              </h2>
              <p className="mt-6 md:mt-8 text-[#8ba2c9] max-w-[650px] mx-auto text-lg md:text-xl font-light leading-relaxed">
                Visionaries who challenge our perspectives. 
                Coming from diverse backgrounds to share ideas worth spreading.
              </p>
            </div>
          </div>
        </RevealOnScroll>
      </div>

      {/* --- SPEAKERS LIST --- */}
      <div className="w-full pb-32 relative z-10">
        {loading ? (
          <div className="flex flex-col items-center justify-center py-32 space-y-4">
            <div className="w-12 h-12 border-[2px] border-[#1a2b4c]/30 border-t-[#e62b1e] rounded-full animate-spin shadow-[0_0_20px_rgba(230,43,30,0.6)]"></div>
            <p className="text-[#8ba2c9] text-base md:text-lg font-bold uppercase tracking-widest animate-pulse opacity-70">Loading Lineup...</p>
          </div>
        ) : speakersData.length === 0 ? (
          <div className="text-center py-32 text-[#8ba2c9]">
            <p className="text-lg md:text-xl font-bold uppercase tracking-widest">Lineup is kept secret for now.</p>
          </div>
        ) : (
          speakersData.map((speaker, index) => {
            const isEven = index % 2 === 0;
            
            return (
              <section 
                key={speaker.id} 
                className="py-16 md:py-24 px-6 md:px-8 relative bg-transparent"
              >
                <div className={`max-w-[1200px] w-full mx-auto flex flex-col md:flex-row items-center justify-between gap-10 md:gap-24 ${!isEven ? 'md:flex-row-reverse' : ''}`}>
                  
                  {/* Photo Side */}
                  <div className="flex-1 flex justify-center relative z-10 w-full">
                    <RevealOnScroll animation={isEven ? "slide-left" : "slide-right"}>
                      <div className="relative group cursor-pointer w-full max-w-[260px] sm:max-w-[320px] md:max-w-[400px]">
                        
                        <div className="absolute -inset-4 bg-[#e62b1e]/20 rounded-2xl blur-2xl opacity-0 group-hover:opacity-100 transition-all duration-700"></div>
                        
                        <div className="w-full aspect-[4/5] bg-[#001c49]/30 rounded-2xl flex items-center justify-center border border-[#2a4374] shadow-2xl overflow-hidden relative transition-transform duration-700 group-hover:scale-[1.02]">
                          
                          {speaker.photo_url ? (
                            <SpeakerPhoto src={speaker.photo_url} alt={speaker.name} />
                          ) : null}
                          
                          <div className="absolute inset-0 flex items-center justify-center bg-[#020d24]" style={{ display: speaker.photo_url ? 'none' : 'flex' }}>
                            <User size={100} className="text-[#2a4374] md:w-[150px] md:h-[150px]" />
                          </div>
                          
                          <div className="absolute inset-0 bg-gradient-to-t from-[#000b18]/90 via-[#000b18]/20 to-transparent opacity-60 group-hover:opacity-80 transition-all duration-500 pointer-events-none"></div>
                          
                          <div className="absolute bottom-4 left-6 md:bottom-6 md:left-8 translate-y-4 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-500 delay-100 pointer-events-none">
                             <span className="text-white font-black text-xl md:text-2xl uppercase tracking-tighter">TEDx<span className="text-[#e62b1e]">UII</span></span>
                          </div>
                        </div>
                        
                        <div 
                          className={`absolute -bottom-4 md:-bottom-6 w-24 h-24 md:w-32 md:h-32 border-b-4 border-[#e62b1e] transition-all duration-500 pointer-events-none -z-10 shadow-[0_10px_20px_rgba(230,43,30,0.2)]
                            ${isEven 
                              ? '-right-4 md:-right-6 border-r-4 rounded-br-2xl group-hover:translate-x-2 group-hover:translate-y-2' 
                              : '-left-4 md:-left-6 border-l-4 rounded-bl-2xl group-hover:-translate-x-2 group-hover:translate-y-2'
                            }
                          `}
                        ></div>
                      </div>
                    </RevealOnScroll>
                  </div>
                  
                  {/* Text Side */}
                  <div className="flex-1 text-center md:text-left z-20 mt-8 md:mt-0">
                    <RevealOnScroll animation={isEven ? "slide-right" : "slide-left"} delay="delay-200">
                      
                      <div className="inline-block bg-[#e62b1e]/10 backdrop-blur-sm border border-[#e62b1e]/30 px-4 py-1.5 md:px-5 md:py-2 rounded-full text-[0.65rem] md:text-[0.75rem] font-bold mb-4 md:mb-6 text-[#e62b1e] tracking-[2px] md:tracking-[3px] uppercase shadow-[0_0_15px_rgba(230,43,30,0.15)]">
                        {speaker.role || "Featured Speaker"}
                      </div>

                      <h2 className="text-[2.5rem] sm:text-[3rem] md:text-[5.5rem] font-black mb-4 md:mb-6 leading-[0.9] text-white tracking-tighter uppercase drop-shadow-md">
                        {(() => {
                          const [mainName, ...titleArray] = speaker.name.split(',');
                          const titles = titleArray.join(',').trim();
                          const nameWords = mainName.trim().split(' ');
                          const firstName = nameWords[0];
                          const lastName = nameWords.slice(1).join(' ');

                          return (
                            <>
                              <span className="block">{firstName}</span>
                              {lastName && <span className="block text-[#e62b1e] drop-shadow-[0_0_10px_rgba(230,43,30,0.3)]">{lastName}</span>}
                              {titles && (
                                <span className="block text-[1.2rem] sm:text-[1.5rem] md:text-[2rem] text-[#8ba2c9] font-bold tracking-widest mt-2 md:mt-4 leading-normal">
                                  {titles}
                                </span>
                              )}
                            </>
                          );
                        })()}
                      </h2>
                      
                      <p className="text-lg sm:text-xl md:text-2xl text-[#e5e5e5] font-medium mb-6 md:mb-8 italic border-l-4 border-[#e62b1e] pl-4 md:pl-6 text-left shadow-[-10px_0_15px_-10px_rgba(230,43,30,0.4)]">
                        "{speaker.topic || "Topic to be announced soon"}"
                      </p>
                      
                      <div className="w-16 md:w-24 h-[2px] bg-gradient-to-r from-[#e62b1e] via-[#e62b1e]/50 to-transparent mb-6 md:mb-8 mx-auto md:mx-0"></div>
                      
                      <div className="text-base md:text-lg text-[#8ba2c9] leading-relaxed max-w-[500px] text-left mx-auto md:mx-0 font-light opacity-80">
                        <p>
                          {speaker.desc || "Information about this speaker is currently being curated. Check back later for updates."}
                        </p>
                      </div>

                    </RevealOnScroll>
                  </div>

                </div>
              </section>
            );
          })
        )}
      </div>

    </div>
  );
};

export default Speakers;