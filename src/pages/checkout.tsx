import React, { useState, useEffect } from 'react';
import { Mail, User, Phone, ShieldCheck, Ticket, ArrowLeft, CheckCircle, Info } from 'lucide-react'; // Ditambahkan CheckCircle & Info
import { Link, useNavigate, useLocation } from 'react-router-dom';

declare global {
  interface Window {
    snap: any;
  }
}

const Checkout: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [loading, setLoading] = useState<boolean>(false);
  
  // State baru untuk mengontrol pop-up sukses
  const [showSuccessPopup, setShowSuccessPopup] = useState<boolean>(false);
  
  // Tangkap data yang dilempar dari halaman Tickets
  const { ticket, quantity } = location.state || {};

  // Kalau user iseng buka /checkout langsung tanpa milih tiket, tendang balik ke /tickets
  useEffect(() => {
    if (!ticket) {
      navigate('/tickets');
    }
    window.scrollTo(0, 0);
  }, [ticket, navigate]);

  const [formData, setFormData] = useState({
    full_name: '',
    email: '',
    whatsapp_no: '',
  });

  if (!ticket) return null; // Mencegah error render sebelum di-redirect

  const totalDue = ticket.price * quantity;

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handlePayment = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const apiUrl = import.meta.env.VITE_API_URL;

      const response = await fetch(`${apiUrl}/orders`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...formData,
          category_id: ticket.id,
          quantity: quantity
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.detail || 'Gagal membuat pesanan');
      }

      const data = await response.json();
      const snapToken = data.message; 

      if (window.snap) {
        window.snap.pay(snapToken, {
          onSuccess: () => {
            // Ubah dari alert menjadi memunculkan pop-up cantik kita
            setShowSuccessPopup(true);
          },
          onPending: () => { alert("Silakan selesaikan pembayaranmu."); },
          onError: () => { alert("Pembayaran Gagal. Silakan coba lagi."); }
        });
      } else {
        alert("Sistem pembayaran belum siap. Coba refresh halaman.");
      }
    } catch (err: any) {
      alert(err.message || "Terjadi kesalahan sistem.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#f8f9fa] flex flex-col md:flex-row font-sans text-gray-900 pt-[80px] md:pt-0 relative">
      
      {/* --- KIRI: ORDER SUMMARY (Deep Blue/Red Accent) --- */}
      <div className="w-full md:w-5/12 bg-[#000b18] text-white p-8 md:p-16 flex flex-col relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(ellipse_at_top_left,rgba(230,43,30,0.2)_0%,transparent_70%)]"></div>
        <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:40px_40px] z-0"></div>

        <div className="relative z-10 flex flex-col h-full">
          <Link to="/tickets" className="inline-flex items-center gap-2 text-[#8ba2c9] hover:text-white transition-colors mb-12 w-fit">
            <ArrowLeft size={20} /> Ganti Tiket
          </Link>

          <div className="mt-auto md:mt-0 md:flex-1 flex flex-col justify-center">
            <div className="inline-block bg-[#e62b1e]/10 border border-[#e62b1e]/30 px-4 py-1.5 rounded-full text-xs font-bold mb-6 text-[#e62b1e] tracking-widest uppercase w-fit">
              Order Summary
            </div>
            
            <h1 className="text-4xl md:text-5xl font-black uppercase tracking-tighter mb-2 leading-none">
              {ticket.name}
            </h1>
            <p className="text-[#8ba2c9] mb-8 text-lg">TEDxUII 2026: Let's Go To The Future</p>

            <div className="bg-white/5 border border-white/10 rounded-2xl p-6 mb-6">
              <div className="flex justify-between items-center mb-4 text-sm font-medium">
                <span className="text-gray-400">Harga per tiket</span>
                <span className="text-white">Rp {ticket.price.toLocaleString('id-ID')}</span>
              </div>
              <div className="flex justify-between items-center text-sm font-medium">
                <span className="text-gray-400">Jumlah tiket</span>
                <span className="text-white">x {quantity}</span>
              </div>
            </div>

            <div className="border-t border-white/10 pt-6 flex justify-between items-end">
              <div>
                <p className="text-sm text-[#8ba2c9] uppercase tracking-widest mb-1">Total Pembayaran</p>
                <p className="text-4xl font-black text-[#e62b1e]">Rp {totalDue.toLocaleString('id-ID')}</p>
              </div>
              <Ticket size={48} className="text-white/10" />
            </div>
          </div>
        </div>
      </div>

      {/* --- KANAN: FORM PEMESANAN (Light Theme / Putih Bersih) --- */}
      <div className="w-full md:w-7/12 bg-white p-8 md:p-16 xl:p-24 flex items-center justify-center relative">
        <div className="w-full max-w-lg">
          
          <div className="mb-10">
            <h2 className="text-3xl font-black text-gray-900 tracking-tight mb-2">Detail Pembeli</h2>
            <p className="text-gray-500">Silakan isi data diri kamu. E-Ticket akan dikirimkan ke alamat email ini.</p>
          </div>

          <form onSubmit={handlePayment} className="space-y-6">
            <div className="space-y-2">
              <label className="text-xs font-bold text-gray-500 uppercase tracking-wider">Nama Lengkap</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <User size={20} className="text-gray-400" />
                </div>
                <input required name="full_name" onChange={handleChange} placeholder="Nama Lengkap Kamu" className="w-full bg-gray-50 border border-gray-200 text-gray-900 rounded-xl pl-12 pr-4 py-4 focus:bg-white focus:ring-2 focus:ring-[#e62b1e]/20 focus:border-[#e62b1e] outline-none transition-all font-medium" />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-xs font-bold text-gray-500 uppercase tracking-wider flex items-center gap-2">
                Alamat Email <span className="text-[#e62b1e]">*</span>
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <Mail size={20} className="text-[#e62b1e]" />
                </div>
                <input required type="email" name="email" onChange={handleChange} placeholder="Fulan@gmail.com" className="w-full bg-white border-2 border-gray-200 text-gray-900 rounded-xl pl-12 pr-4 py-4 focus:ring-4 focus:ring-[#e62b1e]/10 focus:border-[#e62b1e] outline-none transition-all font-medium" />
              </div>
              <p className="text-xs text-gray-400 mt-1">E-Ticket dan instruksi penukaran akan dikirim ke sini.</p>
            </div>

            <div className="space-y-2">
              <label className="text-xs font-bold text-gray-500 uppercase tracking-wider">Nomor WhatsApp</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <Phone size={20} className="text-gray-400" />
                </div>
                <input required name="whatsapp_no" onChange={handleChange} placeholder="08xxxxxxxxx" className="w-full bg-gray-50 border border-gray-200 text-gray-900 rounded-xl pl-12 pr-4 py-4 focus:bg-white focus:ring-2 focus:ring-[#e62b1e]/20 focus:border-[#e62b1e] outline-none transition-all font-medium" />
              </div>
            </div>

            <div className="pt-6">
              <button type="submit" disabled={loading} className="w-full bg-[#e62b1e] text-white font-black uppercase tracking-widest py-5 rounded-xl hover:bg-black transition-all transform hover:-translate-y-1 disabled:bg-gray-300 disabled:text-gray-500 disabled:transform-none shadow-xl shadow-red-500/20 flex justify-center items-center gap-3">
                {loading ? "Menghubungkan ke Midtrans..." : `Bayar Rp ${totalDue.toLocaleString('id-ID')}`}
              </button>
            </div>
            
            <div className="flex items-center justify-center gap-2 text-xs font-medium text-gray-400 mt-6">
              <ShieldCheck size={16} className="text-green-500" /> Secure encrypted payment by Midtrans
            </div>
          </form>

        </div>
      </div>

      {/* --- POP-UP PEMBAYARAN BERHASIL --- */}
      {showSuccessPopup && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-md z-[100] flex items-center justify-center p-4">
          <div className="bg-[#020d24] border border-[#2a4374] rounded-3xl p-8 max-w-sm w-full shadow-[0_0_40px_rgba(0,0,0,0.8)] relative transform transition-all text-center flex flex-col items-center">
            
            {/* Ikon Centang Hijau */}
            <div className="w-20 h-20 bg-green-500/10 border-2 border-green-500/50 text-green-500 rounded-full flex items-center justify-center mb-6 shadow-[0_0_20px_rgba(34,197,94,0.3)]">
              <CheckCircle size={40} />
            </div>

            {/* Judul */}
            <h3 className="text-2xl font-black text-white uppercase tracking-tight mb-3">
              Pembayaran Berhasil
            </h3>
            
            {/* Garis Pemisah */}
            <div className="w-12 h-1 bg-green-500 rounded-full mb-5"></div>

            {/* Note */}
            <div className="bg-[#000b18] border border-[#1a2b4c] rounded-xl p-4 w-full mb-8 text-left flex items-start gap-3">
              <Info size={20} className="text-[#8ba2c9] shrink-0 mt-0.5" />
              <p className="text-[#8ba2c9] text-sm font-light leading-relaxed">
                <strong className="text-white">Note:</strong> Silakan scan tiket anda sebelum masuk venue.
              </p>
            </div>

            {/* Tombol Tutup -> Kembali ke Home */}
            <button 
              onClick={() => {
                setShowSuccessPopup(false);
                navigate('/');
              }}
              className="w-full bg-[#1a2b4c] text-white font-bold uppercase tracking-widest py-4 rounded-xl hover:bg-[#2a4374] transition-all flex justify-center items-center gap-2"
            >
              Tutup
            </button>
          </div>
        </div>
      )}

    </div>
  );
};

export default Checkout;