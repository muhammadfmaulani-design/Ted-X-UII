import React, { useEffect, useState } from 'react';
import { CheckCircle, ExternalLink, Clock, AlertCircle, RefreshCw } from 'lucide-react';
import { supabase } from '../supabase'; // Sesuaikan path dengan file supabase client kamu

interface Order {
  id: string;
  full_name: string;
  email: string;
  whatsapp_no: string;
  quantity: number;
  total_price: number;
  payment_proof_url: string;
  created_at: string;
  ticket_categories: {
    name: string;
  };
}

const AdminDashboard: React.FC = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [processingId, setProcessingId] = useState<string | null>(null);

  // 1. Ambil Data Pesanan "Pending" dari Supabase
  const fetchPendingOrders = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('orders')
        .select('*, ticket_categories(name)')
        .eq('status', 'pending')
        .order('created_at', { ascending: false });

      if (error) throw error;
      if (data) setOrders(data as Order[]);
    } catch (error: any) {
      console.error("Error fetching orders:", error.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPendingOrders();
  }, []);

  // 2. Fungsi Eksekusi Approve (Memicu Generator & Email)
  const handleApprove = async (orderId: string, buyerName: string) => {
    const confirmApprove = window.confirm(`Verifikasi pembayaran dari ${buyerName}?\n\nPastikan uang benar-benar sudah masuk ke rekening sebelum menekan OK. Tiket akan langsung digenerate dan dikirim ke email peserta.`);
    
    if (!confirmApprove) return;

    setProcessingId(orderId); // Set loading state khusus tombol yang diklik

    try {
      const apiUrl = import.meta.env.VITE_API_URL;
      
      // Tembak Endpoint FastApi kita
      const response = await fetch(`${apiUrl}/orders/approve/${orderId}`, {
        method: 'POST',
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.detail || "Gagal memproses persetujuan");
      }

      alert("✅ " + result.message);
      
      // Hapus data dari daftar layar tanpa perlu refresh page
      setOrders(orders.filter(o => o.id !== orderId));

    } catch (error: any) {
      alert("❌ Error: " + error.message);
    } finally {
      setProcessingId(null);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 pt-24 pb-12 px-6">
      <div className="max-w-6xl mx-auto">
        
        {/* HEADER */}
        <div className="flex flex-col md:flex-row justify-between items-center mb-8 gap-4">
          <div>
            <h1 className="text-3xl font-black text-gray-900 tracking-tight">TEDxUII Finance Dashboard</h1>
            <p className="text-gray-500 mt-1">Verifikasi Bukti Transfer Manual</p>
          </div>
          <button 
            onClick={fetchPendingOrders}
            className="flex items-center gap-2 bg-white border border-gray-200 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-50 transition-colors shadow-sm font-medium"
          >
            <RefreshCw size={18} className={loading ? "animate-spin" : ""} />
            Refresh Data
          </button>
        </div>

        {/* CONTENT */}
        {loading ? (
          <div className="text-center py-20">
            <div className="w-10 h-10 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin mx-auto mb-4"></div>
            <p className="text-gray-500 font-medium animate-pulse">Mengambil data transaksi...</p>
          </div>
        ) : orders.length === 0 ? (
          <div className="bg-white border border-gray-200 rounded-2xl p-16 text-center shadow-sm">
            <div className="w-20 h-20 bg-green-50 text-green-500 rounded-full flex items-center justify-center mx-auto mb-4">
              <CheckCircle size={40} />
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-2">Semua Bersih!</h3>
            <p className="text-gray-500">Tidak ada pesanan pending saat ini. Semua tiket sudah terverifikasi.</p>
          </div>
        ) : (
          <div className="grid gap-6">
            {orders.map((order) => (
              <div key={order.id} className="bg-white border border-gray-200 rounded-2xl p-6 shadow-sm flex flex-col xl:flex-row justify-between gap-6 transition-all hover:shadow-md">
                
                {/* Info Box */}
                <div className="flex-1 grid grid-cols-1 md:grid-cols-3 gap-6">
                  
                  {/* Kolom 1: User Info */}
                  <div>
                    <p className="text-xs text-gray-400 font-bold uppercase tracking-wider mb-1">Pembeli</p>
                    <p className="font-bold text-gray-900 text-lg">{order.full_name}</p>
                    <p className="text-sm text-gray-600">{order.email}</p>
                    <p className="text-sm text-gray-600">{order.whatsapp_no}</p>
                  </div>

                  {/* Kolom 2: Ticket Info */}
                  <div>
                    <p className="text-xs text-gray-400 font-bold uppercase tracking-wider mb-1">Pesanan</p>
                    <p className="font-bold text-blue-700 bg-blue-50 px-2 py-0.5 rounded inline-block mb-1">
                      {order.ticket_categories?.name || "Tiket"}
                    </p>
                    <p className="text-sm text-gray-900 font-medium">{order.quantity}x Tiket</p>
                    <p className="text-xs text-gray-400 mt-1 font-mono">ID: {order.id.split('-')[0].toUpperCase()}</p>
                  </div>

                  {/* Kolom 3: Payment Info */}
                  <div>
                    <p className="text-xs text-gray-400 font-bold uppercase tracking-wider mb-1">Total Tagihan</p>
                    <p className="font-black text-red-600 text-xl">Rp {order.total_price.toLocaleString('id-ID')}</p>
                    <div className="flex items-center gap-1 mt-2 text-xs font-medium text-amber-600 bg-amber-50 w-fit px-2 py-1 rounded">
                      <Clock size={14} /> Pending Verification
                    </div>
                  </div>
                </div>

                {/* Action Box */}
                <div className="flex flex-col sm:flex-row xl:flex-col gap-3 min-w-[200px] justify-center border-t xl:border-t-0 xl:border-l border-gray-100 pt-6 xl:pt-0 xl:pl-6">
                  
                  {order.payment_proof_url ? (
                    <a 
                      href={order.payment_proof_url} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="flex items-center justify-center gap-2 bg-gray-100 text-gray-700 px-4 py-3 rounded-xl font-bold hover:bg-gray-200 transition-colors w-full text-sm"
                    >
                      <ExternalLink size={18} /> Cek Bukti Transfer
                    </a>
                  ) : (
                    <div className="flex items-center justify-center gap-2 bg-red-50 text-red-600 px-4 py-3 rounded-xl font-bold w-full text-sm">
                      <AlertCircle size={18} /> Bukti Belum Diupload
                    </div>
                  )}

                  <button 
                    onClick={() => handleApprove(order.id, order.full_name)}
                    disabled={processingId === order.id || !order.payment_proof_url}
                    className="flex items-center justify-center gap-2 bg-green-600 text-white px-4 py-3 rounded-xl font-bold hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all w-full text-sm shadow-[0_4px_14px_0_rgba(22,163,74,0.39)]"
                  >
                    {processingId === order.id ? (
                      <>
                        <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                        Memproses...
                      </>
                    ) : (
                      <>
                        <CheckCircle size={18} /> Approve & Kirim Tiket
                      </>
                    )}
                  </button>
                </div>

              </div>
            ))}
          </div>
        )}

      </div>
    </div>
  );
};

export default AdminDashboard;