// src/pages/Speakers.tsx
import React, { useEffect, useState } from 'react';
import { User } from 'lucide-react';
import RevealOnScroll from '../components/RevealOnScroll';

// Import Supabase client
import { supabase } from '../supabase';

// 1. Definisikan Interface untuk TypeScript
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

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  // --- FETCH DATA DARI SUPABASE ---
  useEffect(() => {
    const fetchSpeakers = async () => {
      try {
        const { data, error } = await supabase
          .from('speakers')
          .select('*')
          .order('created_at', { ascending: true }); // Mengurutkan berdasarkan waktu dibuat

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

    // Setup Realtime Subscription
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
    <div className="pt-[80px] min-h-screen bg-black">
      
      {/* --- HEADER SECTION --- */}
      <div className="pt-20 px-6 md:px-8 max-w-[1200px] mx-auto pb-0">
        <RevealOnScroll animation="fade-up">
          <div className="relative w-full my-8 py-12 px-6 border-y border-[rgba(255,255,255,0.1)] bg-[radial-gradient(ellipse_at_center,rgba(0,60,255,0.25)_0%,rgba(0,60,255,0.1)_40%,rgba(0,20,50,0.05)_85%,transparent_100%)] border-x-0 !border-t-[rgba(0,100,255,0.5)] !border-b-[rgba(0,100,255,0.5)] shadow-[0_0_60px_-20px_rgba(0,60,255,0.3),inset_0_10px_40px_-10px_rgba(0,60,255,0.1),inset_0_-10px_40px_-10px_rgba(0,60,255,0.1)]">
            <div className="text-center">
              <h2 className="text-[2.5rem] uppercase font-extrabold tracking-tight mb-0">
                MEET THE <span className="text-[#e62b1e]">SPEAKERS</span>
              </h2>
              <p className="mt-4 text-[#a3a3a3] max-w-[600px] mx-auto text-base md:text-lg">
                Visionaries who challenge our perspectives. 
                Coming from diverse backgrounds to share ideas worth spreading.
              </p>
            </div>
          </div>
        </RevealOnScroll>
      </div>

      {/* --- SPEAKERS LIST (SECTION ZIG-ZAG) --- */}
      <div className="w-full">
        {loading ? (
          <div className="text-center p-16 text-white">
            <p className="animate-pulse text-lg">Loading speakers profile...</p>
          </div>
        ) : speakersData.length === 0 ? (
          <div className="text-center p-16 text-[#666]">
            <p className="text-lg">No speakers found.</p>
          </div>
        ) : (
          speakersData.map((speaker, index) => {
            // Tentukan Layout: Genap (Foto Kiri, Teks Kanan), Ganjil (Teks Kiri, Foto Kanan)
            const isEven = index % 2 === 0;
            
            return (
              <section 
                key={speaker.id} 
                // Ganti background selang-seling
                className={`min-h-[60vh] py-24 px-6 md:px-8 flex items-center justify-center border-b border-[#222] ${!isEven ? 'bg-[#0a0a0a]' : 'bg-black'}`}
              >
                {/* md:flex-row-reverse memutar layout untuk index ganjil */}
                <div className={`max-w-[1200px] w-full mx-auto flex flex-col md:flex-row items-center justify-between gap-12 md:gap-16 ${!isEven ? 'md:flex-row-reverse' : ''}`}>
                  
                  {/* --- VISUAL SIDE (FOTO) --- */}
                  <div className="flex-1 flex justify-center relative z-10">
                    <RevealOnScroll animation={isEven ? "slide-left" : "slide-right"}>
                      <div className="w-[280px] h-[280px] bg-[#111] rounded-full flex items-center justify-center border-2 border-[#333] shadow-[0_0_40px_rgba(220,38,38,0.15)] overflow-hidden relative">
                        {/* Foto Speaker */}
                        {speaker.photo_url ? (
                          <img 
                            src={speaker.photo_url} 
                            alt={speaker.name} 
                            className="w-full h-full object-cover"
                            onError={(e) => { 
                              (e.target as HTMLImageElement).style.display = 'none'; 
                              ((e.target as HTMLImageElement).nextSibling as HTMLElement).style.display = 'block'; 
                            }}
                          />
                        ) : null}
                        
                        {/* Fallback Icon jika tidak ada foto */}
                        <User 
                          size={120} 
                          className="text-[#444]" 
                          style={{ display: speaker.photo_url ? 'none' : 'block' }} 
                        />
                      </div>
                    </RevealOnScroll>
                  </div>
                  
                  {/* --- TEXT SIDE (INFO) --- */}
                  <div className="flex-1 text-center md:text-left">
                    <RevealOnScroll animation={isEven ? "slide-right" : "slide-left"} delay="delay-200">
                      
                      {/* Role Badge */}
                      <div className="inline-block bg-white/10 px-5 py-1.5 rounded-full text-[0.85rem] font-bold mb-6 text-[#ccc] tracking-[1px] uppercase">
                        {speaker.role || "SPEAKER"}
                      </div>

                      {/* Nama Speaker */}
                      <h2 className="text-[2.5rem] md:text-[3rem] font-black mb-2 leading-[1.1] text-white">
                        {speaker.name}
                      </h2>
                      
                      {/* Topik Bicara */}
                      <p className="text-[#e62b1e] font-bold uppercase tracking-[2px] mb-6 inline-block border-b-2 border-[#e62b1e] pb-1">
                        {speaker.topic || "Topic TBA"}
                      </p>
                      
                      {/* Deskripsi */}
                      <div className="text-base md:text-lg text-[#aaa] leading-[1.8]">
                        <p>
                          {speaker.desc || "No description available yet."}
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