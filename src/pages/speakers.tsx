import React, { useEffect, useState } from 'react';
import { User } from 'lucide-react';
import RevealOnScroll from '../components/RevealOnScroll';
import { supabase } from '../supabase';

// Definisikan Interface untuk TypeScript (Sesuai kolom database kamu)
interface Speaker {
  id: string;
  name: string;
  role?: string;
  topic?: string;
  desc?: string;
  photo_url?: string;
}

const Speakers: React.FC = () => {
  const [speakersData, setSpeakersData] = useState<Speaker[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  // Scroll ke paling atas saat halaman dibuka
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  // Fetch Data & Setup Realtime Supabase
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

    // Setup Realtime Subscription biar kalau ada data baru, UI otomatis update
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
      <div className="pt-20 px-6 md:px-8 max-w-[1200px] mx-auto pb-12">
        <RevealOnScroll animation="fade-up">
          <div className="relative w-full my-8 py-16 px-6 border-y border-[rgba(255,255,255,0.05)] bg-[radial-gradient(ellipse_at_center,rgba(230,43,30,0.15)_0%,rgba(0,0,0,0)_70%)] text-center">
            <h2 className="text-[3rem] md:text-[5rem] uppercase font-black tracking-tighter mb-0 leading-none text-white">
              MEET THE <span className="text-[#e62b1e]">SPEAKERS</span>
            </h2>
            <p className="mt-6 text-[#a3a3a3] max-w-[600px] mx-auto text-lg md:text-xl font-light">
              Visionaries who challenge our perspectives. 
              Coming from diverse backgrounds to share ideas worth spreading.
            </p>
          </div>
        </RevealOnScroll>
      </div>

      {/* --- SPEAKERS LIST (ZIG-ZAG MEGAH LAYOUT) --- */}
      <div className="w-full pb-24">
        {loading ? (
          <div className="flex flex-col items-center justify-center py-32 space-y-4">
            <div className="w-12 h-12 border-4 border-[#333] border-t-[#e62b1e] rounded-full animate-spin"></div>
            <p className="text-[#888] text-lg font-bold uppercase tracking-widest animate-pulse">Loading Lineup...</p>
          </div>
        ) : speakersData.length === 0 ? (
          <div className="text-center py-32 text-[#666]">
            <p className="text-xl font-bold uppercase tracking-widest">Lineup is kept secret for now.</p>
          </div>
        ) : (
          speakersData.map((speaker, index) => {
            // Tentukan Layout Zig-Zag
            const isEven = index % 2 === 0;
            
            return (
              <section 
                key={speaker.id} 
                className={`py-24 md:py-32 px-6 md:px-8 border-b border-[#111] relative ${!isEven ? 'bg-[#050505]' : 'bg-black'}`}
              >
                <div className={`max-w-[1200px] w-full mx-auto flex flex-col md:flex-row items-center justify-between gap-16 md:gap-24 ${!isEven ? 'md:flex-row-reverse' : ''}`}>
                  
                  {/* --- VISUAL SIDE (FOTO BESAR) --- */}
                  <div className="flex-1 flex justify-center relative z-10 w-full">
                    <RevealOnScroll animation={isEven ? "slide-left" : "slide-right"}>
                      <div className="relative group cursor-pointer">
                        {/* Glow Merah di belakang foto saat hover */}
                        <div className="absolute -inset-4 bg-[#e62b1e]/20 rounded-2xl blur-2xl opacity-0 group-hover:opacity-100 transition-all duration-700"></div>
                        
                        {/* Frame Foto Rectangular */}
                        <div className="w-[320px] h-[400px] md:w-[450px] md:h-[550px] bg-[#0a0a0a] rounded-2xl flex items-center justify-center border border-white/5 shadow-2xl overflow-hidden relative transition-transform duration-700 group-hover:scale-[1.02]">
                          {speaker.photo_url ? (
                            <img 
                              src={speaker.photo_url} 
                              alt={speaker.name} 
                              className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-700 scale-105 group-hover:scale-100"
                              onError={(e) => { 
                                (e.target as HTMLImageElement).style.display = 'none'; 
                                ((e.target as HTMLImageElement).nextSibling as HTMLElement).style.display = 'flex'; 
                              }}
                            />
                          ) : null}
                          
                          {/* Fallback Icon jika tidak ada foto / link mati */}
                          <div className="absolute inset-0 flex items-center justify-center bg-[#111]" style={{ display: speaker.photo_url ? 'none' : 'flex' }}>
                            <User size={150} className="text-[#333]" />
                          </div>
                          
                          {/* Overlay Gradient Tipis dari Bawah */}
                          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-60 group-hover:opacity-80 transition-all duration-500"></div>
                          
                          {/* Watermark Keren di dalam foto */}
                          <div className="absolute bottom-6 left-8 translate-y-4 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-500 delay-100">
                             <span className="text-white font-black text-2xl uppercase tracking-tighter">TEDx<span className="text-[#e62b1e]">UII</span></span>
                          </div>
                        </div>
                        
                        {/* Dekorasi Bingkai Akses Merah */}
                        <div className={`absolute -bottom-6 ${isEven ? '-right-6' : '-left-6'} w-32 h-32 border-b-4 border-r-4 border-[#e62b1e] rounded-br-2xl transition-all duration-500 group-hover:translate-x-2 group-hover:translate-y-2`}></div>
                      </div>
                    </RevealOnScroll>
                  </div>
                  
                  {/* --- TEXT SIDE (INFO SPEAKER) --- */}
                  <div className="flex-1 text-center md:text-left z-20">
                    <RevealOnScroll animation={isEven ? "slide-right" : "slide-left"} delay="delay-200">
                      
                      {/* Role Badge */}
                      <div className="inline-block bg-[#e62b1e] px-4 py-1.5 rounded text-[0.75rem] font-black mb-6 text-white tracking-[3px] uppercase shadow-[0_0_15px_rgba(230,43,30,0.4)]">
                        {speaker.role || "Featured Speaker"}
                      </div>

                      {/* Nama Super Besar (Kata ke-2 warnanya merah) */}
                      <h2 className="text-[3.5rem] md:text-[5.5rem] font-black mb-6 leading-[0.9] text-white tracking-tighter uppercase">
                        {speaker.name.split(' ').map((word, i) => (
                          <span key={i} className={i === 1 ? "text-[#e62b1e] block" : "block"}>{word}</span>
                        ))}
                      </h2>
                      
                      {/* Topik Bicara */}
                      <p className="text-xl md:text-2xl text-white font-medium mb-8 italic opacity-90 border-l-4 border-[#e62b1e] pl-4 md:pl-6 text-left">
                        "{speaker.topic || "Topic to be announced soon"}"
                      </p>
                      
                      {/* Garis Pemisah Elegan */}
                      <div className="w-16 h-1 bg-gradient-to-r from-[#e62b1e] to-transparent mb-8 mx-auto md:mx-0"></div>
                      
                      {/* Deskripsi */}
                      <div className="text-lg text-[#999] leading-relaxed max-w-[500px] text-left mx-auto md:mx-0 font-light">
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