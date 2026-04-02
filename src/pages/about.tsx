// src/pages/About.tsx
import React, { useEffect } from 'react';
import { Target, MapPin } from 'lucide-react';
import RevealOnScroll from '../components/RevealOnScroll';

const About: React.FC = () => {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="w-full">
      
      {/* --- HERO --- */}
      <section className="pt-[100px] md:pt-32 pb-24 px-6 md:px-8 min-h-[80vh] flex items-center justify-center bg-[radial-gradient(circle_at_center,#220505_0%,#000000_80%)]">
        <div className="max-w-[1200px] w-full mx-auto text-center">
          <RevealOnScroll animation="pop-in" delay="delay-100">
            <div className="inline-flex items-center gap-2 border border-[#e62b1e] text-[#e62b1e] px-6 py-2 rounded-full font-bold tracking-[2px] mb-8 uppercase text-sm md:text-base">
              <Target size={16} /> OUR GOAL
            </div>
          </RevealOnScroll>
          <RevealOnScroll animation="fade-up" delay="delay-200">
            <h1 className="text-[2.5rem] md:text-[3.5rem] font-black leading-[1.1] tracking-tight">
              TO SPARK <br />
              <span className="text-[#e62b1e]">CONVERSATION</span>, <br />
              CONNECTION, AND <br />
              {/* Ini adalah ganti dari class .text-outline */}
              <span className="[-webkit-text-stroke:2px_white] text-transparent">COMMUNITY</span>.
            </h1>
          </RevealOnScroll>
        </div>
      </section>

      {/* --- SECTION 2: TED (Kanan Teks, Kiri Visual) --- */}
      <section className="py-24 px-6 md:px-8 flex items-center justify-center min-h-[70vh] bg-[#0a0a0a] border-y border-[rgba(220,38,38,0.5)] bg-[radial-gradient(ellipse_at_center,rgba(220,38,38,0.25)_0%,rgba(220,38,38,0.1)_40%,rgba(50,0,0,0.05)_85%,transparent_100%)] shadow-[0_0_60px_-20px_rgba(220,38,38,0.3),inset_0_10px_40px_-10px_rgba(220,38,38,0.1),inset_0_-10px_40px_-10px_rgba(220,38,38,0.1)]">
        {/* flex-row-reverse membalik posisi text dan visual di desktop */}
        <div className="max-w-[1200px] w-full mx-auto flex flex-col md:flex-row-reverse items-center justify-between gap-12 md:gap-16">
          <div className="flex-1 flex justify-center">
            <RevealOnScroll animation="slide-left">
              <span className="text-[6rem] md:text-[10rem] font-black leading-none drop-shadow-[0_0_50px_rgba(220,38,38,0.3)] text-white">TED</span>
            </RevealOnScroll>
          </div>
          
          <div className="flex-1 text-center md:text-left">
            <RevealOnScroll animation="slide-left" delay="delay-200">
              <h2 className="text-3xl md:text-4xl font-bold mb-2">ABOUT <span className="text-white">TED</span></h2>
              <p className="text-sm md:text-base text-[#666] uppercase tracking-[2px] mb-8 inline-block border-b-2 border-[#e62b1e] pb-2">Technology, Entertainment, Design</p>
              <div className="text-base md:text-lg leading-relaxed space-y-4 text-[#e5e5e5]">
                <p>TED (Technology, Entertainment, Design) is a <strong>non-profit</strong> devoted to spreading ideas, in the form of short powerful talks around 18 minutes or less.</p>
                <p>The talks cover almost all topics in more than 100 languages.</p>
              </div>
            </RevealOnScroll>
          </div>
        </div>
      </section>

      {/* --- SECTION 1: TEDx (Kiri Teks, Kanan Visual) --- */}
      <section className="py-24 px-6 md:px-8 flex items-center justify-center min-h-[70vh] bg-[#0a0a0a] border-y border-[rgba(0,100,255,0.5)] bg-[radial-gradient(ellipse_at_center,rgba(0,60,255,0.25)_0%,rgba(0,60,255,0.1)_40%,rgba(0,20,50,0.05)_85%,transparent_100%)] shadow-[0_0_60px_-20px_rgba(0,60,255,0.3),inset_0_10px_40px_-10px_rgba(0,60,255,0.1),inset_0_-10px_40px_-10px_rgba(0,60,255,0.1)]">
        <div className="max-w-[1200px] w-full mx-auto flex flex-col md:flex-row items-center justify-between gap-12 md:gap-16">
          <div className="flex-1 flex justify-center">
            <RevealOnScroll animation="slide-left">
              <span className="text-[6rem] md:text-[10rem] font-black leading-none drop-shadow-[0_0_50px_rgba(220,38,38,0.3)] text-[#e62b1e]">TEDx</span>
            </RevealOnScroll>
          </div>
          
          <div className="flex-1 text-center md:text-left">
            <RevealOnScroll animation="slide-right" delay="delay-200">
              <h2 className="text-3xl md:text-4xl font-bold mb-2">ABOUT <span className="text-[#e62b1e]">TEDx</span></h2>
              <p className="text-sm md:text-base text-[#666] uppercase tracking-[2px] mb-8 inline-block border-b-2 border-[#e62b1e] pb-2">x = independently organized TED event</p>
              <div className="text-base md:text-lg leading-relaxed space-y-4 text-[#e5e5e5]">
                <p>TEDx is a local program that is <strong>independently organized</strong>, aiming to bring together and inspire the community under the mission statement <em>“Ideas Worth Spreading”</em>.</p>
                <p>TEDx events fuse TED Talk videos and live speakers to set off deep discussion and connection.</p>
              </div>
            </RevealOnScroll>
          </div>
        </div>
      </section>

      {/* --- SECTION 3: TEDxUII --- */}
      <section className="py-24 px-6 md:px-8 flex items-center justify-center bg-black relative overflow-hidden border-t border-[#222]">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_bottom,rgba(220,38,38,0.15)_0%,transparent_70%)]"></div>
        <div className="max-w-[1200px] w-full mx-auto text-center relative z-10">
          <RevealOnScroll animation="fade-up">
            <div className="flex justify-center mb-6">
              <MapPin size={48} className="text-[#e62b1e]" />
            </div>
            <h2 className="text-3xl md:text-4xl font-bold mb-2">ABOUT <span className="text-[#e62b1e]">TEDx</span><span className="text-white">UII</span></h2>
            <p className="text-sm md:text-base text-[#666] uppercase tracking-[2px] mb-8 inline-block border-b-2 border-[#e62b1e] pb-2">Universitas Islam Indonesia</p>
            
            <div className="max-w-[800px] mx-auto text-base md:text-lg leading-relaxed space-y-6 text-[#e5e5e5]">
              <p>
                TEDxUII is an independently arranged TEDx event, built on concern, to 
                <strong> unleash new ideas</strong>, inspire, and inform by creating a unique 
                gathering in our community; 
              </p>
              <h3 className="text-xl md:text-2xl font-black mt-4 text-white tracking-wide">UNIVERSITAS ISLAM INDONESIA</h3>
            </div>
          </RevealOnScroll>
        </div>
      </section>

    </div>
  );
};

export default About;