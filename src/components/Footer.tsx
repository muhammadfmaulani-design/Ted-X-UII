// components/Footer.tsx
import { 
  Mail, 
  MapPin, 
  Phone, 
} from 'lucide-react';

const Footer = () => {
  return (
    <footer className="bg-[#0a0a0a] text-zinc-300 pt-16 pb-8 px-6 md:px-12 border-t border-zinc-800 font-sans">
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 lg:gap-8">
        
        {/* Kolom 1: Branding & Newsletter */}
        <div className="space-y-6">
          <h2 className="text-3xl font-extrabold tracking-tighter text-white">
            TEDx<span className="text-[#eb0028]">UII</span>
          </h2>
          <p className="text-sm leading-relaxed text-zinc-400">
            Platform for sharing brilliant ideas. Independently organized from the heart of the Islamic University of Indonesia to inspire positive change.
          </p>
          
        </div>

        {/* Kolom 2: Explore */}
        <div>
          <h3 className="text-lg font-bold text-white mb-6 uppercase tracking-wider">Explore</h3>
          <ul className="space-y-3 text-sm text-zinc-400">
            <li><a href="/" className="hover:text-[#eb0028] hover:translate-x-1 transition-all inline-block">Home</a></li>
            <li><a href="/about" className="hover:text-[#eb0028] hover:translate-x-1 transition-all inline-block">About TEDxUII</a></li>
            <li><a href="/speakers" className="hover:text-[#eb0028] hover:translate-x-1 transition-all inline-block">Our Speakers</a></li>
            <li><a href="/schedule" className="hover:text-[#eb0028] hover:translate-x-1 transition-all inline-block">Event Schedule</a></li>
            <li><a href="/tickets" className="hover:text-[#eb0028] hover:translate-x-1 transition-all inline-block">Buy Tickets</a></li>
          </ul>
        </div>

        {/* Event Info */}
        <div>
          <h3 className="text-lg font-bold text-white mb-6 uppercase tracking-wider">Event Info</h3>
          <ul className="space-y-3 text-sm text-zinc-400 font-medium">
            <li><a href="#tickets" className="hover:text-[#e62b1e] hover:translate-x-1 transition-all inline-block">Ticket Categories</a></li>
            <li><a href="#about" className="hover:text-[#e62b1e] hover:translate-x-1 transition-all inline-block">Venue Location</a></li>
            <li><a href="/" className="hover:text-[#e62b1e] hover:translate-x-1 transition-all inline-block">Event Schedule</a></li>
            <li><a href="/" className="hover:text-[#e62b1e] hover:translate-x-1 transition-all inline-block">Theme Breakdown</a></li>
            <li><a href="/" className="hover:text-[#e62b1e] hover:translate-x-1 transition-all inline-block">Our Mission</a></li>
          </ul>
        </div>

        {/* Kolom 4: Contact & Venue */}
        <div>
          <h3 className="text-lg font-bold text-white mb-6 uppercase tracking-wider">Contact & Venue</h3>
          <ul className="space-y-4 text-sm text-zinc-400">
            {/* Lokasi */}
            <li className="flex items-start">
              <MapPin size={18} className="text-[#e62b1e] mr-3 mt-1 flex-shrink-0" />
              <span>
                Theatrical 2nd Floor<br />
                GKU Sardjito UII
              </span>
            </li>
            
            {/* WhatsApp / Phone */}
            <li className="flex items-center">
              <Phone size={18} className="text-[#e62b1e] mr-3 flex-shrink-0" />
              <a href="https://wa.me/6282186810788" target="_blank" className="hover:text-white transition-colors">
                +62 821 8681 0788
              </a>
            </li>
            
            {/* Email */}
            <li className="flex items-center">
              <Mail size={18} className="text-[#e62b1e] mr-3 flex-shrink-0" />
              <a href="mailto:tedxuiiyogyakarta@gmail.com" className="hover:text-white transition-colors">
                tedxuiiyogyakarta@gmail.com
              </a>
            </li>

            {/* Instagram - Sekarang formatnya sama dengan di atas */}
            <li className="flex items-center">
              <div className="text-[#e62b1e] mr-3 flex-shrink-0">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect>
                  <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path>
                  <line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line>
                </svg>
              </div>
              <a href="https://instagram.com/tedxuii" target="_blank" className="hover:text-white transition-colors">
                @tedxuii
              </a>
            </li>
          </ul>
        </div>

      </div>

      {/* Bottom Bar: Mandatory TED Disclaimer & Copyright */}
      <div className="max-w-7xl mx-auto mt-16 pt-8 border-t border-zinc-800">
        <div className="flex flex-col md:flex-row justify-between items-center gap-4 text-center md:text-left">
          <p className="text-zinc-500 text-xs leading-relaxed max-w-2xl">
            This independent TEDx event is operated under license from TED. 
            TEDx is a grassroots initiative, created in the spirit of TED’s overall mission to research and discover "ideas worth spreading."
          </p>
          <div className="text-zinc-500 text-xs">
            <p>© {new Date().getFullYear()} TEDxUII. Built with React.</p>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;