import React, { useState } from 'react';

// 1. Definisikan tipe data untuk props agar TS tidak error
interface TransactionProps {
  isOpen: boolean;
  onClose: () => void;
  categoryId: string;
  categoryName: string;
  price: number;
}

// 2. Beritahu TypeScript bahwa window.snap itu ada (karena kita pasang di index.html)
declare global {
  interface Window {
    snap: {
      pay: (token: string, options: any) => void;
    };
  }
}

const Transaction: React.FC<TransactionProps> = ({ 
  isOpen, 
  onClose, 
  categoryId, 
  categoryName, 
  price 
}) => {
  const [loading, setLoading] = useState<boolean>(false);
  const [formData, setFormData] = useState({
    full_name: '',
    email: '',
    whatsapp_no: '',
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handlePayment = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      // Menggunakan import.meta.env sesuai standar Vite yang kita bahas
      const apiUrl = import.meta.env.VITE_API_URL;

      // 1. Hit Backend Vercel untuk dapatkan Snap Token
      const response = await fetch(`${apiUrl}/orders/`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...formData,
          category_id: categoryId,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.detail || 'Gagal membuat pesanan');
      }

      const data = await response.json();
      const snapToken = data.message; // 'message' berisi snap_token

      // 2. Eksekusi Pop-up Midtrans Snap
      if (window.snap) {
        window.snap.pay(snapToken, {
          onSuccess: (result: any) => {
            console.log('Payment Success:', result);
            alert("Pembayaran Berhasil! Tiket akan dikirim ke email.");
            onClose();
          },
          onPending: (result: any) => {
            console.log('Payment Pending:', result);
            alert("Segera selesaikan pembayaranmu ya!");
            onClose();
          },
          onError: (result: any) => {
            console.error('Payment Error:', result);
            alert("Waduh, pembayaran gagal. Coba lagi deh.");
          },
          onClose: () => {
            console.log('User closed the snap pop-up');
          },
        });
      } else {
        alert("Script Midtrans belum muat. Coba refresh halaman.");
      }
    } catch (err: any) {
      console.error("Transaction Error:", err);
      alert(err.message || "Terjadi kesalahan sistem.");
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-[9999] p-4">
      <div className="bg-white rounded-3xl p-8 max-w-md w-full shadow-2xl relative overflow-hidden">
        {/* Dekorasi ala TEDx */}
        <div className="absolute top-0 left-0 w-full h-2 bg-red-600"></div>
        
        <button 
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-black transition-colors"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>

        <h2 className="text-3xl font-black text-gray-900 mb-1">Checkout</h2>
        <p className="text-gray-500 mb-6 font-medium">
          Ticket: <span className="text-red-600 uppercase">{categoryName}</span> • Rp{price.toLocaleString('id-ID')}
        </p>

        <form onSubmit={handlePayment} className="space-y-4">
          <div className="space-y-1">
            <label className="text-xs font-bold text-gray-400 uppercase tracking-wider">Nama Lengkap</label>
            <input
              required
              name="full_name"
              onChange={handleChange}
              placeholder="Masukkan nama sesuai KTP"
              className="w-full border-2 border-gray-100 rounded-xl p-3 focus:border-red-600 outline-none transition-all"
            />
          </div>

          <div className="space-y-1">
            <label className="text-xs font-bold text-gray-400 uppercase tracking-wider">Alamat Email</label>
            <input
              required
              type="email"
              name="email"
              onChange={handleChange}
              placeholder="tiket@emailkamu.com"
              className="w-full border-2 border-gray-100 rounded-xl p-3 focus:border-red-600 outline-none transition-all"
            />
          </div>

          <div className="space-y-1">
            <label className="text-xs font-bold text-gray-400 uppercase tracking-wider">Nomor WhatsApp</label>
            <input
              required
              name="whatsapp_no"
              onChange={handleChange}
              placeholder="0812xxxxxxxx"
              className="w-full border-2 border-gray-100 rounded-xl p-3 focus:border-red-600 outline-none transition-all"
            />
          </div>

          <div className="pt-6">
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-red-600 text-white font-black py-4 rounded-2xl hover:bg-black transition-all transform hover:-translate-y-1 disabled:bg-gray-300 disabled:transform-none shadow-xl shadow-red-100"
            >
              {loading ? (
                <span className="flex items-center justify-center gap-2">
                  <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Processing...
                </span>
              ) : `Konfirmasi & Bayar Rp${price.toLocaleString('id-ID')}`}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Transaction;