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
    <div className="bg-black min-h-screen text-white pt-24 pb-20 px-6 font-sans">
      <div className="max-w-7xl mx-auto">
        
        {/* Header Section */}
        <header className="mb-12 text-center md:text-left">
          <h1 className="text-5xl md:text-7xl font-black tracking-tighter mb-6">
            TEDx<span className="text-[#eb0028]">UII</span> EVENTS
          </h1>
          <p className="text-zinc-400 max-w-2xl text-lg md:text-xl leading-relaxed mx-auto md:mx-0">
            Temukan rangkaian acara kami yang dirancang untuk memicu diskusi mendalam, 
            menghubungkan pikiran-pikiran brilian, dan menciptakan ide-ide yang layak disebarkan.
          </p>
        </header>

        {loading ? (
          <div className="flex justify-center py-32">
            <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-[#eb0028]"></div>
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

                <div className="group relative bg-zinc-900 border border-zinc-800 rounded-3xl overflow-hidden hover:border-[#eb0028] transition-all duration-500">
                  <div className="flex flex-col lg:flex-row">
                    
                    {/* Gambar Main Event */}
                    <div className="lg:w-3/5 aspect-video lg:aspect-auto overflow-hidden relative">
                      <div className="absolute inset-0 bg-gradient-to-t lg:bg-gradient-to-r from-zinc-900 to-transparent z-10"></div>
                      <img 
                        src={mainEvent.image_url || 'https://via.placeholder.com/1200x800?text=TEDxUII+Main+Event'} 
                        alt={mainEvent.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                      />
                      {/* Badge status (Opsional) */}
                      <div className="absolute top-6 left-6 z-20 bg-[#eb0028] text-white text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider">
                        Featured
                      </div>
                    </div>
                    
                    {/* Detail Main Event */}
                    <div className="lg:w-2/5 p-8 md:p-12 flex flex-col justify-center relative z-20">
                      <h3 className="text-3xl md:text-4xl font-extrabold mb-6 leading-tight group-hover:text-[#eb0028] transition-colors">
                        {mainEvent.title}
                      </h3>
                      <p className="text-zinc-400 text-base md:text-lg mb-8 line-clamp-4">
                        {mainEvent.description}
                      </p>
                      
                      <div className="space-y-4 mb-10 bg-black/30 p-6 rounded-xl border border-zinc-800">
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
                          className="bg-[#eb0028] hover:bg-red-700 text-white font-bold py-4 px-8 rounded-full text-center transition-all transform hover:scale-105"
                        >
                          Get Tickets
                        </a>
                        <a 
                          href="https://www.instagram.com/p/DUvNSEWjxRf/?utm_source=ig_web_copy_link&igsh=MzRlODBiNWFlZA==" 
                          target="_blank"
                          rel="noopener noreferrer"
                          className="bg-transparent border border-zinc-600 hover:border-white text-white font-bold py-4 px-8 rounded-full text-center transition-all inline-flex justify-center items-center"
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
                  <div className="h-1 w-12 bg-zinc-700"></div>
                  <h2 className="text-xl font-bold tracking-widest uppercase text-zinc-400">Past & Pre-Events</h2>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                  {otherEvents.map((event) => (
                    <div 
                      key={event.id} 
                      className="group bg-zinc-900/50 border border-zinc-800 rounded-2xl overflow-hidden hover:bg-zinc-900 transition-all duration-300"
                    >
                      <div className="aspect-[4/3] overflow-hidden relative">
                        <div className="absolute inset-0 bg-black/20 group-hover:bg-transparent transition-all z-10"></div>
                        <img 
                          src={event.image_url || 'https://via.placeholder.com/800x600?text=TEDxUII+Event'} 
                          alt={event.title}
                          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                        />
                      </div>
                      
                      <div className="p-6">
                        <div className="flex items-center text-xs text-[#eb0028] font-bold tracking-wider mb-3 uppercase">
                          <Calendar size={14} className="mr-2" />
                          {new Date(event.date).toLocaleDateString('id-ID', { 
                            month: 'short', day: 'numeric', year: 'numeric' 
                          })}
                        </div>
                        
                        <h3 className="text-xl font-bold mb-3 group-hover:text-[#eb0028] transition-colors line-clamp-2">
                          {event.title}
                        </h3>
                        
                        <div className="flex items-start text-sm text-zinc-400 mb-6">
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
              <div className="text-center py-32 bg-zinc-900/30 rounded-3xl border border-dashed border-zinc-800">
                <p className="text-zinc-500 text-lg">Acara sedang dalam tahap perencanaan. Cek kembali nanti!</p>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default Events;