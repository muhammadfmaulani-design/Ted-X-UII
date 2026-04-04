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

// --- KOMPONEN KHUSUS FOTO (AUTO-COLOR IN/OUT SCROLL) ---
const SpeakerPhoto: React.FC<{ src: string; alt: string }> = ({ src, alt }) => {
  const [inView, setInView] = useState(false);
  const imgRef = useRef<HTMLImageElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        // Otomatis true saat masuk layar, false saat keluar layar
        setInView(entry.isIntersecting);
      },
      // threshold 0.3 artinya efek jalan saat 30% foto terlihat
      { threshold: 0.3 } 
    );

    if (imgRef.current) observer.observe(imgRef.current);
    
    // Jangan letakkan observer.disconnect() di atas, cukup di clean-up saja
    return () => observer.disconnect();
  }, []);

  return (
    <img
      ref={imgRef}
      src={src}
      alt={alt}
      className={`w-full h-full object-cover transition-all duration-[1500ms] ease-out scale-105 group-hover:scale-100 ${
        inView ? 'grayscale-0' : 'grayscale'
      }`}
      onError={(e) => {
        (e.target as HTMLImageElement).style.display = 'none';
        ((e.target as HTMLImageElement).nextSibling as HTMLElement).style.display = 'flex';
      }}
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
    <div className="pt-[80px] min-h-screen bg-black overflow-hidden">
      
      {/* --- HEADER SECTION --- */}
      <div className="pt-16 md:pt-20 px-6 md:px-8 max-w-[1200px] mx-auto pb-8 md:pb-12">
        <RevealOnScroll animation="fade-up">
          <div className="relative w-full my-4 md:my-8 py-12 md:py-16 px-6 border-y border-[rgba(255,255,255,0.05)] bg-[radial-gradient(ellipse_at_center,rgba(230,43,30,0.15)_0%,rgba(0,0,0,0)_70%)] text-center">
            {/* Ukuran heading header disesuaikan untuk mobile */}
            <h2 className="text-[2.5rem] md:text-[5rem] uppercase font-black tracking-tighter mb-0 leading-none text-white">
              MEET THE <span className="text-[#e62b1e]">SPEAKERS</span>
            </h2>
            <p className="mt-4 md:mt-6 text-[#a3a3a3] max-w-[600px] mx-auto text-base md:text-xl font-light">
              Visionaries who challenge our perspectives. 
              Coming from diverse backgrounds to share ideas worth spreading.
            </p>
          </div>
        </RevealOnScroll>
      </div>

      {/* --- SPEAKERS LIST --- */}
      <div className="w-full pb-24">
        {loading ? (
          <div className="flex flex-col items-center justify-center py-32 space-y-4">
            <div className="w-12 h-12 border-4 border-[#333] border-t-[#e62b1e] rounded-full animate-spin"></div>
            <p className="text-[#888] text-base md:text-lg font-bold uppercase tracking-widest animate-pulse">Loading Lineup...</p>
          </div>
        ) : speakersData.length === 0 ? (
          <div className="text-center py-32 text-[#666]">
            <p className="text-lg md:text-xl font-bold uppercase tracking-widest">Lineup is kept secret for now.</p>
          </div>
        ) : (
          speakersData.map((speaker, index) => {
            const isEven = index % 2 === 0;
            
            return (
              <section 
                key={speaker.id} 
                className={`py-16 md:py-32 px-6 md:px-8 border-b border-[#111] relative ${!isEven ? 'bg-[#050505]' : 'bg-black'}`}
              >
                <div className={`max-w-[1200px] w-full mx-auto flex flex-col md:flex-row items-center justify-between gap-10 md:gap-24 ${!isEven ? 'md:flex-row-reverse' : ''}`}>
                  
                  {/* --- VISUAL SIDE (FOTO BESAR) --- */}
                  <div className="flex-1 flex justify-center relative z-10 w-full">
                    <RevealOnScroll animation={isEven ? "slide-left" : "slide-right"}>
                      
                      {/* max-w diturunkan agar lebih proporsional di mobile maupun desktop */}
                      <div className="relative group cursor-pointer w-full max-w-[260px] sm:max-w-[320px] md:max-w-[400px]">
                        
                        <div className="absolute -inset-4 bg-[#e62b1e]/20 rounded-2xl blur-2xl opacity-0 group-hover:opacity-100 transition-all duration-700"></div>
                        
                        {/* Aspect Ratio diubah ke 4/5 agar tidak terlalu jangkung */}
                        <div className="w-full aspect-[4/5] bg-[#0a0a0a] rounded-2xl flex items-center justify-center border border-white/5 shadow-2xl overflow-hidden relative transition-transform duration-700 group-hover:scale-[1.02]">
                          
                          {speaker.photo_url ? (
                            <SpeakerPhoto src={speaker.photo_url} alt={speaker.name} />
                          ) : null}
                          
                          <div className="absolute inset-0 flex items-center justify-center bg-[#111]" style={{ display: speaker.photo_url ? 'none' : 'flex' }}>
                            <User size={100} className="text-[#333] md:w-[150px] md:h-[150px]" />
                          </div>
                          
                          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-60 group-hover:opacity-80 transition-all duration-500 pointer-events-none"></div>
                          
                          {/* Ukuran tulisan watermark dikecilkan di mobile */}
                          <div className="absolute bottom-4 left-6 md:bottom-6 md:left-8 translate-y-4 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-500 delay-100 pointer-events-none">
                             <span className="text-white font-black text-xl md:text-2xl uppercase tracking-tighter">TEDx<span className="text-[#e62b1e]">UII</span></span>
                          </div>
                        </div>
                        
                        {/* Dekorasi bingkai ikut disesuaikan */}
                        <div 
                          className={`absolute -bottom-4 md:-bottom-6 w-24 h-24 md:w-32 md:h-32 border-b-4 border-[#e62b1e] transition-all duration-500 pointer-events-none -z-10
                            ${isEven 
                              ? '-right-4 md:-right-6 border-r-4 rounded-br-2xl group-hover:translate-x-2 group-hover:translate-y-2' 
                              : '-left-4 md:-left-6 border-l-4 rounded-bl-2xl group-hover:-translate-x-2 group-hover:translate-y-2'
                            }
                          `}
                        ></div>
                      </div>
                    </RevealOnScroll>
                  </div>
                  
                  {/* --- TEXT SIDE (INFO SPEAKER) --- */}
                  <div className="flex-1 text-center md:text-left z-20 mt-8 md:mt-0">
                    <RevealOnScroll animation={isEven ? "slide-right" : "slide-left"} delay="delay-200">
                      
                      <div className="inline-block bg-[#e62b1e] px-3 py-1 md:px-4 md:py-1.5 rounded text-[0.65rem] md:text-[0.75rem] font-black mb-4 md:mb-6 text-white tracking-[2px] md:tracking-[3px] uppercase shadow-[0_0_15px_rgba(230,43,30,0.4)]">
                        {speaker.role || "Featured Speaker"}
                      </div>

                      {/* Ukuran Nama jauh lebih ramah mobile (2.5rem vs 5.5rem) */}
                     <h2 className="text-[2.5rem] sm:text-[3rem] md:text-[5.5rem] font-black mb-4 md:mb-6 leading-[0.9] text-white tracking-tighter uppercase">
                        {(() => {
                          // 1. Pisahkan Nama Utama dan Gelar berdasarkan tanda koma (,)
                          const [mainName, ...titleArray] = speaker.name.split(',');
                          const titles = titleArray.join(',').trim(); // "S. H., M. Kn." (jadi 1 kesatuan)

                          // 2. Pisahkan Nama Utama jadi 2 baris (Kata pertama & Sisa kata)
                          const nameWords = mainName.trim().split(' ');
                          const firstName = nameWords[0];
                          const lastName = nameWords.slice(1).join(' '); // Semua sisa nama digabung biar gak turun baris lagi

                          return (
                            <>
                              {/* Baris 1: Nama Pertama (Putih) */}
                              <span className="block">{firstName}</span>
                              
                              {/* Baris 2: Sisa Nama (Merah) - Hanya render jika ada nama belakang */}
                              {lastName && <span className="block text-[#e62b1e]">{lastName}</span>}
                              
                              {/* Baris 3: Gelar - Ukuran font dikecilkan agar tidak menyaingi nama utama */}
                              {titles && (
                                <span className="block text-[1.2rem] sm:text-[1.5rem] md:text-[2rem] text-[#888] font-bold tracking-widest mt-2 md:mt-4 leading-normal">
                                  {titles}
                                </span>
                              )}
                            </>
                          );
                        })()}
                      </h2>
                      
                      {/* Topik juga dikecilkan di mobile */}
                      <p className="text-lg sm:text-xl md:text-2xl text-white font-medium mb-6 md:mb-8 italic opacity-90 border-l-4 border-[#e62b1e] pl-4 md:pl-6 text-left">
                        "{speaker.topic || "Topic to be announced soon"}"
                      </p>
                      
                      <div className="w-12 md:w-16 h-1 bg-gradient-to-r from-[#e62b1e] to-transparent mb-6 md:mb-8 mx-auto md:mx-0"></div>
                      
                      {/* Teks deskripsi lebih ringan dibaca di HP */}
                      <div className="text-base md:text-lg text-[#999] leading-relaxed max-w-[500px] text-left mx-auto md:mx-0 font-light">
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