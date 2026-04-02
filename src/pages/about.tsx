// src/pages/About.tsx
import React, { useEffect } from 'react';
import { Target, MapPin } from 'lucide-react';
import RevealOnScroll from '../components/RevealOnScroll';

const About: React.FC = () => {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="w-full bg-[#000b18] text-[#e5e5e5]">
      
      {/* --- HERO --- */}
      <section className="relative pt-[100px] md:pt-32 pb-24 px-6 md:px-8 min-h-[80vh] flex items-center justify-center overflow-hidden">
        {/* Pattern Grid & Glow */}
        <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.05)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.05)_1px,transparent_1px)] bg-[size:40px_40px] opacity-70"></div>
        <div className="absolute top-[-10%] right-[-5%] w-[40vw] h-[40vw] bg-[#e62b1e] rounded-full blur-[120px] opacity-30 pointer-events-none"></div>
        <div className="absolute bottom-[-10%] left-[-10%] w-[50vw] h-[50vw] bg-[#003cff] rounded-full blur-[150px] opacity-20 pointer-events-none"></div>

        <div className="max-w-[1200px] w-full mx-auto text-center relative z-10">
          <RevealOnScroll animation="pop-in" delay="delay-100">
            {/* Badge Glassmorphism */}
            <div className="inline-flex items-center gap-2 bg-[#020d24]/80 backdrop-blur-sm border border-[#1a2b4c] text-[#e62b1e] px-6 py-2 rounded-full font-bold tracking-[2px] mb-8 uppercase text-sm md:text-base shadow-[0_0_15px_rgba(230,43,30,0.2)]">
              <Target size={16} /> OUR GOAL
            </div>
          </RevealOnScroll>
          <RevealOnScroll animation="fade-up" delay="delay-200">
            <h1 className="text-[2.5rem] md:text-[3.5rem] font-black leading-[1.1] tracking-tight drop-shadow-[0_0_20px_rgba(255,255,255,0.1)] text-white">
              TO SPARK <br />
              <span className="text-[#e62b1e]">CONVERSATION</span>, <br />
              CONNECTION, AND <br />
              <span className="[-webkit-text-stroke:2px_white] text-transparent drop-shadow-[0_0_15px_rgba(255,255,255,0.3)]">COMMUNITY</span>.
            </h1>
          </RevealOnScroll>
        </div>
      </section>

      {/* --- SECTION 2: TED (Kanan Teks, Kiri Visual) --- */}
      <section className="relative py-24 px-6 md:px-8 flex items-center justify-center min-h-[70vh] bg-[#000b18] border-y border-[#1a2b4c] overflow-hidden">
        {/* Glow Radial Merah Halus dari Kanan */}
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_right,rgba(230,43,30,0.15)_0%,transparent_60%)]"></div>

        <div className="max-w-[1200px] w-full mx-auto flex flex-col md:flex-row-reverse items-center justify-between gap-12 md:gap-16 relative z-10">
          <div className="flex-1 flex justify-center">
            <RevealOnScroll animation="slide-left">
              <span className="text-[6rem] md:text-[10rem] font-black leading-none drop-shadow-[0_0_50px_rgba(230,43,30,0.4)] text-white">TED</span>
            </RevealOnScroll>
          </div>
          
          <div className="flex-1 text-center md:text-left">
            <RevealOnScroll animation="slide-left" delay="delay-200">
              <h2 className="text-3xl md:text-4xl font-bold mb-2 text-white">ABOUT <span className="text-[#e62b1e]">TED</span></h2>
              <p className="text-sm md:text-base text-[#8ba2c9] uppercase tracking-[2px] mb-8 inline-block border-b-2 border-[#e62b1e] pb-2">Technology, Entertainment, Design</p>
              <div className="text-base md:text-lg leading-relaxed space-y-4 text-[#e5e5e5]">
                <p>TED (Technology, Entertainment, Design) is a <strong>non-profit</strong> devoted to spreading ideas, in the form of short powerful talks around 18 minutes or less.</p>
                <p>The talks cover almost all topics in more than 100 languages.</p>
              </div>
            </RevealOnScroll>
          </div>
        </div>
      </section>

      {/* --- SECTION 1: TEDx (Kiri Teks, Kanan Visual) --- */}
      <section className="relative py-24 px-6 md:px-8 flex items-center justify-center min-h-[70vh] bg-[#020d24] border-b border-[#1a2b4c] overflow-hidden">
        {/* Glow Radial Biru Halus dari Kiri */}
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_left,rgba(0,60,255,0.15)_0%,transparent_60%)]"></div>

        <div className="max-w-[1200px] w-full mx-auto flex flex-col md:flex-row items-center justify-between gap-12 md:gap-16 relative z-10">
          <div className="flex-1 flex justify-center">
            <RevealOnScroll animation="slide-left">
              <span className="text-[6rem] md:text-[10rem] font-black leading-none drop-shadow-[0_0_50px_rgba(230,43,30,0.4)] text-[#e62b1e]">TEDx</span>
            </RevealOnScroll>
          </div>
          
          <div className="flex-1 text-center md:text-left">
            <RevealOnScroll animation="slide-right" delay="delay-200">
              <h2 className="text-3xl md:text-4xl font-bold mb-2 text-white">ABOUT <span className="text-[#e62b1e]">TEDx</span></h2>
              <p className="text-sm md:text-base text-[#8ba2c9] uppercase tracking-[2px] mb-8 inline-block border-b-2 border-[#e62b1e] pb-2">x = independently organized TED event</p>
              <div className="text-base md:text-lg leading-relaxed space-y-4 text-[#e5e5e5]">
                <p>TEDx is a local program that is <strong>independently organized</strong>, aiming to bring together and inspire the community under the mission statement <em>“Ideas Worth Spreading”</em>.</p>
                <p>TEDx events fuse TED Talk videos and live speakers to set off deep discussion and connection.</p>
              </div>
            </RevealOnScroll>
          </div>
        </div>
      </section>

      {/* --- SECTION 3: TEDxUII --- */}
      <section className="relative py-24 px-6 md:px-8 flex items-center justify-center bg-[#000b18] overflow-hidden">
        {/* Grid pattern & Bottom Glow */}
        <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:40px_40px]"></div>
        <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[60vw] h-[30vw] bg-[#e62b1e] rounded-full blur-[150px] opacity-20 pointer-events-none"></div>
        
        <div className="max-w-[1200px] w-full mx-auto text-center relative z-10">
          <RevealOnScroll animation="fade-up">
            <div className="flex justify-center mb-6">
              <MapPin size={48} className="text-[#e62b1e] drop-shadow-[0_0_15px_rgba(230,43,30,0.5)]" />
            </div>
            <h2 className="text-3xl md:text-4xl font-bold mb-2 text-white">ABOUT <span className="text-[#e62b1e]">TEDx</span><span className="text-white">UII</span></h2>
            <p className="text-sm md:text-base text-[#8ba2c9] uppercase tracking-[2px] mb-8 inline-block border-b-2 border-[#e62b1e] pb-2">Universitas Islam Indonesia</p>
            
            {/* Box Glassmorphism (Mirip The Theme di Dashboard) */}
            <div className="max-w-[800px] mx-auto bg-[#020d24]/80 backdrop-blur-md border border-[#1a2b4c] p-8 md:p-12 rounded-2xl shadow-[0_0_30px_rgba(0,0,0,0.5)]">
              <p className="text-base md:text-lg leading-relaxed space-y-6 text-[#e5e5e5]">
                TEDxUII is an independently arranged TEDx event, built on concern, to 
                <strong className="text-white"> unleash new ideas</strong>, inspire, and inform by creating a unique 
                gathering in our community; 
              </p>
              <h3 className="text-xl md:text-2xl font-black mt-6 text-[#e62b1e] tracking-wide drop-shadow-md">UNIVERSITAS ISLAM INDONESIA</h3>
            </div>
          </RevealOnScroll>
        </div>
      </section>

    </div>
  );
};

export default About;