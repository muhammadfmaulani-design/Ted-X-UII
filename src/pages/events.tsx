import { useEffect, useState } from 'react';
import { supabase } from '../supabase'; // Sesuaikan path jika perlu
import { Calendar, MapPin, ArrowRight, Clock } from 'lucide-react';

interface Event {
  id: string;
  title: string;
  description: string;
  date: string;
  location: string;
  image_url: string;
}

const Events = () => {
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchEvents();
  }, []);

  const fetchEvents = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('events')
        .select('*')
        .eq('is_active', true)
        .order('date', { ascending: false }); // Mengurutkan dari yang terbaru/mendatang

      if (error) throw error;
      setEvents(data || []);
    } catch (error) {
      console.error('Error fetching events:', error);
    } finally {
      setLoading(false);
    }
  };

  // Memisahkan data: Event index ke-0 jadi Main Event, sisanya jadi Other Events
  const mainEvent = events.length > 0 ? events[0] : null;
  const otherEvents = events.length > 1 ? events.slice(1) : [];

  return (
    // PERUBAHAN: Mengganti bg-black menjadi bg-[#000814] dan menambahkan relative overflow-hidden
    <div className="bg-[#000814] min-h-screen text-white pt-24 pb-20 px-6 font-sans relative overflow-hidden">
      
      {/* --- BACKGROUND ORNAMENTS (Grid & Neon Glow) --- */}
      {/* 1. Global Grid Pattern */}
      <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.03)_1px,transparent_1px)] bg-[size:40px_40px] pointer-events-none z-0"></div>

      {/* 2. Global Ambient Neon */}
      {/* Glow Merah di Kanan Atas */}
      <div className="absolute top-[-10%] right-[-20%] w-[70vw] h-[70vw] bg-[#eb0028] rounded-full blur-[200px] opacity-[0.18] pointer-events-none z-0"></div>
      
      {/* Glow Biru Gelap di Kiri */}
      <div className="absolute top-[30%] left-[-20%] w-[60vw] h-[60vw] bg-[#003cff] rounded-full blur-[250px] opacity-[0.08] pointer-events-none z-0"></div>
      
      {/* Glow Merah di Kanan Bawah */}
      <div className="absolute bottom-[-10%] right-[-10%] w-[60vw] h-[60vw] bg-[#eb0028] rounded-full blur-[250px] opacity-[0.12] pointer-events-none z-0"></div>


      {/* PERUBAHAN: Menambahkan relative z-10 agar konten utama berada di atas background glow */}
      <div className="max-w-7xl mx-auto relative z-10">
        
        {/* Header Section */}
        <header className="mb-12 text-center md:text-left">
          <h1 className="text-5xl md:text-7xl font-black tracking-tighter mb-6 drop-shadow-lg">
            TEDx<span className="text-[#eb0028]">UII</span> EVENTS
          </h1>
          <p className="text-[#8ba2c9] max-w-2xl text-lg md:text-xl leading-relaxed mx-auto md:mx-0">
            Temukan rangkaian acara kami yang dirancang untuk memicu diskusi mendalam, 
            menghubungkan pikiran-pikiran brilian, dan menciptakan ide-ide yang layak disebarkan.
          </p>
        </header>

        {loading ? (
          <div className="flex flex-col items-center justify-center py-32 space-y-4">
            <div className="w-12 h-12 border-[2px] border-[#1a2b4c]/30 border-t-[#eb0028] rounded-full animate-spin shadow-[0_0_20px_rgba(235,0,40,0.6)]"></div>
            <p className="text-[#8ba2c9] text-base md:text-lg font-bold uppercase tracking-widest animate-pulse opacity-70">Memuat Acara...</p>
          </div>
        ) : (
          <>
            {/* --- MAIN EVENT SECTION --- */}
            {mainEvent && (
              <section className="mb-24">
                <div className="flex items-center gap-4 mb-8">
                  <div className="h-1 w-12 bg-[#eb0028]"></div>
                  <h2 className="text-2xl font-bold tracking-widest uppercase text-white">Main Event</h2>
                </div>

                <div className="group relative bg-[#020d24]/80 backdrop-blur-md border border-[#1a2b4c] rounded-3xl overflow-hidden hover:border-[#eb0028] hover:shadow-[0_0_30px_rgba(235,0,40,0.2)] transition-all duration-500">
                  <div className="flex flex-col lg:flex-row">
                    
                    {/* Gambar Main Event */}
                    <div className="lg:w-3/5 aspect-video lg:aspect-auto overflow-hidden relative">
                      <div className="absolute inset-0 bg-gradient-to-t lg:bg-gradient-to-r from-[#020d24]/90 to-transparent z-10"></div>
                      <img 
                        src={mainEvent.image_url || 'https://via.placeholder.com/1200x800?text=TEDxUII+Main+Event'} 
                        alt={mainEvent.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                      />
                      {/* Badge status (Opsional) */}
                      <div className="absolute top-6 left-6 z-20 bg-[#eb0028] text-white text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider shadow-[0_0_10px_rgba(235,0,40,0.5)]">
                        Featured
                      </div>
                    </div>
                    
                    {/* Detail Main Event */}
                    <div className="lg:w-2/5 p-8 md:p-12 flex flex-col justify-center relative z-20">
                      <h3 className="text-3xl md:text-4xl font-extrabold mb-6 leading-tight group-hover:text-[#eb0028] transition-colors drop-shadow-md">
                        {mainEvent.title}
                      </h3>
                      <p className="text-[#8ba2c9] text-base md:text-lg mb-8 line-clamp-4">
                        {mainEvent.description}
                      </p>
                      
                      <div className="space-y-4 mb-10 bg-[#000b18]/60 p-6 rounded-xl border border-[#1a2b4c]">
                        <div className="flex items-center text-zinc-200">
                          <Calendar size={20} className="text-[#eb0028] mr-4 flex-shrink-0" />
                          <span className="font-medium">
                            {new Date(mainEvent.date).toLocaleDateString('id-ID', { 
                              weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' 
                            })}
                          </span>
                        </div>
                        <div className="flex items-center text-zinc-200">
                          <Clock size={20} className="text-[#eb0028] mr-4 flex-shrink-0" />
                          <span className="font-medium">
                            {new Date(mainEvent.date).toLocaleTimeString('id-ID', { 
                              hour: '2-digit', minute: '2-digit' 
                            })} WIB
                          </span>
                        </div>
                        <div className="flex items-start text-zinc-200">
                          <MapPin size={20} className="text-[#eb0028] mr-4 mt-1 flex-shrink-0" />
                          <span className="font-medium leading-relaxed">
                            {mainEvent.location}
                          </span>
                        </div>
                      </div>

                      <div className="flex flex-col sm:flex-row gap-4">
                        <a 
                          href="/tickets" 
                          className="bg-[#eb0028] hover:bg-red-700 text-white font-bold py-4 px-8 rounded-full text-center transition-all transform hover:scale-105 shadow-[0_0_15px_rgba(235,0,40,0.4)]"
                        >
                          Get Tickets
                        </a>
                        <a 
                          href="https://www.instagram.com/p/DUvNSEWjxRf/?utm_source=ig_web_copy_link&igsh=MzRlODBiNWFlZA==" 
                          target="_blank"
                          rel="noopener noreferrer"
                          className="bg-[#1a2b4c]/40 hover:bg-[#1a2b4c]/80 border border-[#2a4374] text-white font-bold py-4 px-8 rounded-full text-center transition-all inline-flex justify-center items-center"
                        >
                          Learn More <ArrowRight size={18} className="ml-2" />
                        </a>
                      </div>
                    </div>
                  </div>
                </div>
              </section>
            )}

            {/* --- OTHER EVENTS SECTION --- */}
            {otherEvents.length > 0 && (
              <section>
                <div className="flex items-center gap-4 mb-8">
                  <div className="h-1 w-12 bg-[#1a2b4c]"></div>
                  <h2 className="text-xl font-bold tracking-widest uppercase text-[#8ba2c9]">Past & Pre-Events</h2>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                  {otherEvents.map((event) => (
                    <div 
                      key={event.id} 
                      className="group bg-[#020d24]/50 backdrop-blur-sm border border-[#1a2b4c] rounded-2xl overflow-hidden hover:bg-[#020d24]/80 hover:border-[#eb0028]/50 transition-all duration-300"
                    >
                      <div className="aspect-[4/3] overflow-hidden relative border-b border-[#1a2b4c]">
                        <div className="absolute inset-0 bg-black/30 group-hover:bg-transparent transition-all z-10"></div>
                        <img 
                          src={event.image_url || 'https://via.placeholder.com/800x600?text=TEDxUII+Event'} 
                          alt={event.title}
                          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                        />
                      </div>
                      
                      <div className="p-6">
                        <div className="flex items-center text-xs text-[#eb0028] font-bold tracking-wider mb-3 uppercase drop-shadow-sm">
                          <Calendar size={14} className="mr-2" />
                          {new Date(event.date).toLocaleDateString('id-ID', { 
                            month: 'short', day: 'numeric', year: 'numeric' 
                          })}
                        </div>
                        
                        <h3 className="text-xl font-bold mb-3 group-hover:text-[#eb0028] transition-colors line-clamp-2 text-white">
                          {event.title}
                        </h3>
                        
                        <div className="flex items-start text-sm text-[#8ba2c9] mb-6">
                          <MapPin size={16} className="mr-2 mt-0.5 flex-shrink-0" />
                          <span className="line-clamp-1">{event.location}</span>
                        </div>

                        <a 
                          href="https://www.instagram.com/p/DUvNSEWjxRf/?utm_source=ig_web_copy_link&igsh=MzRlODBiNWFlZA==" 
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center text-sm font-bold text-white group-hover:text-[#eb0028] transition-colors"
                        >
                          View Gallery <ArrowRight size={16} className="ml-2 transform group-hover:translate-x-1 transition-transform" />
                        </a>
                      </div>
                    </div>
                  ))}
                </div>
              </section>
            )}

            {/* Empty State */}
            {!loading && events.length === 0 && (
              <div className="text-center py-32 bg-[#020d24]/40 backdrop-blur-sm rounded-3xl border border-dashed border-[#1a2b4c]">
                <p className="text-[#8ba2c9] text-lg font-light tracking-wide">Acara sedang dalam tahap perencanaan. Cek kembali nanti!</p>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default Events;