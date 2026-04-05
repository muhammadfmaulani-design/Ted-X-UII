// components/Footer.tsx
import { 
  Mail, 
  MapPin, 
  Phone, 
  ArrowRight
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
            Sebuah wadah untuk menyebarkan gagasan-gagasan cemerlang. Diselenggarakan secara independen dari jantung Universitas Islam Indonesia untuk menginspirasi perubahan positif.
          </p>
          
          {/* Newsletter Form */}
          <div className="mt-4">
            <h4 className="text-sm font-semibold text-white mb-2">Subscribe to our newsletter</h4>
            <div className="flex">
              <input 
                type="email" 
                placeholder="Email address" 
                className="bg-zinc-900 border border-zinc-700 text-sm px-4 py-2 w-full focus:outline-none focus:border-[#eb0028] transition-colors rounded-l-md"
              />
              <button className="bg-[#eb0028] hover:bg-red-700 text-white px-4 py-2 rounded-r-md transition-colors flex items-center justify-center">
                <ArrowRight size={16} />
              </button>
            </div>
          </div>
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

        {/* Kolom 3: Resources & Legal */}
        <div>
          <h3 className="text-lg font-bold text-white mb-6 uppercase tracking-wider">Resources</h3>
          <ul className="space-y-3 text-sm text-zinc-400">
            <li><a href="/faq" className="hover:text-[#eb0028] hover:translate-x-1 transition-all inline-block">FAQ</a></li>
            <li><a href="/guidelines" className="hover:text-[#eb0028] hover:translate-x-1 transition-all inline-block">Attendee Guidelines</a></li>
            <li><a href="/terms" className="hover:text-[#eb0028] hover:translate-x-1 transition-all inline-block">Terms & Conditions</a></li>
            <li><a href="/privacy" className="hover:text-[#eb0028] hover:translate-x-1 transition-all inline-block">Privacy Policy</a></li>
            <li><a href="/code-of-conduct" className="hover:text-[#eb0028] hover:translate-x-1 transition-all inline-block">Code of Conduct</a></li>
          </ul>
        </div>

        {/* Kolom 4: Contact & Venue */}
        <div>
          <h3 className="text-lg font-bold text-white mb-6 uppercase tracking-wider">Contact & Venue</h3>
          <ul className="space-y-4 text-sm text-zinc-400">
            <li className="flex items-start">
              <MapPin size={18} className="text-[#eb0028] mr-3 mt-1 flex-shrink-0" />
              <span>
                Auditorium KH. Abdulkahar Muzakkir<br />
                Kampus Terpadu Universitas Islam Indonesia<br />
                Jl. Kaliurang Km. 14,5, Sleman, DIY
              </span>
            </li>
            <li className="flex items-center">
              <Phone size={18} className="text-[#eb0028] mr-3 flex-shrink-0" />
              <span>+62 821 8681 0788</span>
            </li>
            <li className="flex items-center">
              <Mail size={18} className="text-[#eb0028] mr-3 flex-shrink-0" />
              <a href="mailto:tedxuiiyogyakarta@gmail.com" className="hover:text-white transition-colors">tedxuiiyogyakarta@gmail.com</a>
            </li>
          </ul>

          {/* Social Media Icons (Menggunakan SVG Native agar tidak error di Lucide) */}
          <div className="flex space-x-4 mt-6">
            <a href="https://instagram.com/tedxuii" className="bg-zinc-800 p-2 rounded-full hover:bg-[#eb0028] hover:text-white transition-all text-zinc-400">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path><line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line></svg>
            </a>
            <a href="#" className="bg-zinc-800 p-2 rounded-full hover:bg-[#eb0028] hover:text-white transition-all text-zinc-400">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 4s-.7 2.1-2 3.4c1.6 10-9.4 17.3-18 11.6 2.2.1 4.4-.6 6-2C3 15.5.5 9.6 3 5c2.2 2.6 5.6 4.1 9 4-.9-4.2 4-6.6 7-3.8 1.1 0 3-1.2 3-1.2z"></path></svg>
            </a>
            <a href="#" className="bg-zinc-800 p-2 rounded-full hover:bg-[#eb0028] hover:text-white transition-all text-zinc-400">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22.54 6.42a2.78 2.78 0 0 0-1.94-2C18.88 4 12 4 12 4s-6.88 0-8.6.46a2.78 2.78 0 0 0-1.94 2A29 29 0 0 0 1 11.75a29 29 0 0 0 .46 5.33 2.78 2.78 0 0 0 1.94 2c1.72.46 8.6.46 8.6.46s6.88 0 8.6-.46a2.78 2.78 0 0 0 1.94-2 29 29 0 0 0 .46-5.33 29 29 0 0 0-.46-5.33z"></path><polygon points="9.75 15.02 15.5 11.75 9.75 8.48 9.75 15.02"></polygon></svg>
            </a>
            <a href="#" className="bg-zinc-800 p-2 rounded-full hover:bg-[#eb0028] hover:text-white transition-all text-zinc-400">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"></path><rect x="2" y="9" width="4" height="12"></rect><circle cx="4" cy="4" r="2"></circle></svg>
            </a>
          </div>
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