import React, { useEffect, useMemo, useState } from 'react';
import { CheckCircle, ExternalLink, Clock, AlertCircle, RefreshCw, XCircle, Mail, Ticket } from 'lucide-react';
import { supabase } from '../supabase';

type OrderStatus = 'pending' | 'success' | 'rejected';

interface Order {
  id: string;
  full_name: string;
  email: string;
  whatsapp_no: string;
  quantity: number;
  total_price: number;
  payment_proof_url: string;
  created_at: string;
  status: OrderStatus;
  assigned_seats?: string;
  rejected_reason?: string;
  ticket_categories?: {
    name: string;
  };
}

const statusConfig: Record<OrderStatus, { label: string; emptyTitle: string; emptyDescription: string }> = {
  pending: {
    label: 'Pending',
    emptyTitle: 'Tidak Ada Order Pending',
    emptyDescription: 'Semua order pending sudah diproses.',
  },
  success: {
    label: 'Approved',
    emptyTitle: 'Belum Ada Order Approved',
    emptyDescription: 'Order yang disetujui akan tampil di tab ini.',
  },
  rejected: {
    label: 'Rejected',
    emptyTitle: 'Belum Ada Order Rejected',
    emptyDescription: 'Order yang ditolak akan tampil di tab ini.',
  },
};

const AdminDashboard: React.FC = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [processingId, setProcessingId] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<OrderStatus>('pending');
  const apiUrl = import.meta.env.VITE_API_URL;

  const fetchOrders = async (status: OrderStatus) => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('orders')
        .select('*, ticket_categories(name)')
        .eq('status', status)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setOrders((data || []) as Order[]);
    } catch (error: any) {
      console.error('Error fetching orders:', error.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders(activeTab);
  }, [activeTab]);

  const tabList = useMemo(
    () => (['pending', 'success', 'rejected'] as OrderStatus[]),
    []
  );

  const removeOrderFromList = (orderId: string) => {
    setOrders(currentOrders => currentOrders.filter(order => order.id !== orderId));
  };

  const promptRejectReason = (buyerName: string) => {
    return window.prompt(
      `Masukkan alasan reject untuk ${buyerName}.\n\nAlasan ini akan dikirim ke email pembeli.`
    );
  };

  const handleApprove = async (orderId: string, buyerName: string) => {
    const confirmApprove = window.confirm(
      `Verifikasi pembayaran dari ${buyerName}?\n\nPastikan uang benar-benar sudah masuk ke rekening sebelum menekan OK. Tiket akan langsung digenerate dan dikirim ke email peserta.`
    );

    if (!confirmApprove) return;

    setProcessingId(orderId);

    try {
      const response = await fetch(`${apiUrl}/orders/approve/${orderId}`, {
        method: 'POST',
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.detail || 'Gagal memproses persetujuan');
      }

      alert('Approve berhasil: ' + result.message);
      removeOrderFromList(orderId);
    } catch (error: any) {
      alert('Error: ' + error.message);
    } finally {
      setProcessingId(null);
    }
  };

  const handleReject = async (orderId: string, buyerName: string) => {
    const rejectReason = promptRejectReason(buyerName);

    if (rejectReason === null) return;
    if (!rejectReason.trim()) {
      alert('Alasan reject wajib diisi.');
      return;
    }

    const confirmReject = window.confirm(
      `Tolak pesanan dari ${buyerName}?\n\nKursi akan dilepas kembali dan email penolakan akan dikirim ke pembeli.`
    );

    if (!confirmReject) return;

    setProcessingId(orderId);

    try {
      const response = await fetch(`${apiUrl}/orders/reject/${orderId}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ reason: rejectReason.trim() }),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.detail || 'Gagal menolak pesanan');
      }

      alert('Reject berhasil: ' + result.message);
      removeOrderFromList(orderId);
    } catch (error: any) {
      alert('Error: ' + error.message);
    } finally {
      setProcessingId(null);
    }
  };

  const renderStatusBadge = (order: Order) => {
    if (order.status === 'success') {
      return (
        <div className="flex items-center gap-1 mt-2 text-xs font-medium text-green-700 bg-green-50 w-fit px-2 py-1 rounded">
          <CheckCircle size={14} /> Approved
        </div>
      );
    }

    if (order.status === 'rejected') {
      return (
        <div className="flex items-center gap-1 mt-2 text-xs font-medium text-rose-700 bg-rose-50 w-fit px-2 py-1 rounded">
          <XCircle size={14} /> Rejected
        </div>
      );
    }

    return (
      <div className="flex items-center gap-1 mt-2 text-xs font-medium text-amber-600 bg-amber-50 w-fit px-2 py-1 rounded">
        <Clock size={14} /> Pending Verification
      </div>
    );
  };

  const emptyState = statusConfig[activeTab];

  return (
    <div className="min-h-screen bg-gray-50 pt-24 pb-12 px-6">
      <div className="max-w-6xl mx-auto">
        <div className="flex flex-col md:flex-row justify-between items-center mb-8 gap-4">
          <div>
            <h1 className="text-3xl font-black text-gray-900 tracking-tight">TEDxUII Finance Dashboard</h1>
            <p className="text-gray-500 mt-1">Verifikasi Bukti Transfer Manual dan status order peserta</p>
          </div>
          <button
            onClick={() => fetchOrders(activeTab)}
            className="flex items-center gap-2 bg-white border border-gray-200 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-50 transition-colors shadow-sm font-medium"
          >
            <RefreshCw size={18} className={loading ? 'animate-spin' : ''} />
            Refresh Data
          </button>
        </div>

        <div className="flex flex-wrap gap-3 mb-8">
          {tabList.map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-4 py-2 rounded-full text-sm font-bold transition-colors border ${
                activeTab === tab
                  ? 'bg-gray-900 text-white border-gray-900'
                  : 'bg-white text-gray-600 border-gray-200 hover:bg-gray-100'
              }`}
            >
              {statusConfig[tab].label}
            </button>
          ))}
        </div>

        {loading ? (
          <div className="text-center py-20">
            <div className="w-10 h-10 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin mx-auto mb-4"></div>
            <p className="text-gray-500 font-medium animate-pulse">Mengambil data transaksi...</p>
          </div>
        ) : orders.length === 0 ? (
          <div className="bg-white border border-gray-200 rounded-2xl p-16 text-center shadow-sm">
            <div className="w-20 h-20 bg-gray-100 text-gray-500 rounded-full flex items-center justify-center mx-auto mb-4">
              <Ticket size={40} />
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-2">{emptyState.emptyTitle}</h3>
            <p className="text-gray-500">{emptyState.emptyDescription}</p>
          </div>
        ) : (
          <div className="grid gap-6">
            {orders.map((order) => (
              <div key={order.id} className="bg-white border border-gray-200 rounded-2xl p-6 shadow-sm flex flex-col xl:flex-row justify-between gap-6 transition-all hover:shadow-md">
                <div className="flex-1 grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div>
                    <p className="text-xs text-gray-400 font-bold uppercase tracking-wider mb-1">Pembeli</p>
                    <p className="font-bold text-gray-900 text-lg">{order.full_name}</p>
                    <p className="text-sm text-gray-600">{order.email}</p>
                    <p className="text-sm text-gray-600">{order.whatsapp_no}</p>
                  </div>

                  <div>
                    <p className="text-xs text-gray-400 font-bold uppercase tracking-wider mb-1">Pesanan</p>
                    <p className="font-bold text-blue-700 bg-blue-50 px-2 py-0.5 rounded inline-block mb-1">
                      {order.ticket_categories?.name || 'Tiket'}
                    </p>
                    <p className="text-sm text-gray-900 font-medium">{order.quantity}x Tiket</p>
                    <p className="text-xs text-gray-400 mt-1 font-mono">ID: {order.id.split('-')[0].toUpperCase()}</p>
                    {order.assigned_seats && (
                      <p className="text-xs text-gray-500 mt-2">Kursi: {order.assigned_seats}</p>
                    )}
                    {order.status === 'rejected' && order.rejected_reason && (
                      <p className="text-xs text-rose-700 mt-2 bg-rose-50 border border-rose-100 rounded-lg p-2">
                        Alasan reject: {order.rejected_reason}
                      </p>
                    )}
                  </div>

                  <div>
                    <p className="text-xs text-gray-400 font-bold uppercase tracking-wider mb-1">Total Tagihan</p>
                    <p className="font-black text-red-600 text-xl">Rp {order.total_price.toLocaleString('id-ID')}</p>
                    {renderStatusBadge(order)}
                  </div>
                </div>

                <div className="flex flex-col sm:flex-row xl:flex-col gap-3 min-w-[220px] justify-center border-t xl:border-t-0 xl:border-l border-gray-100 pt-6 xl:pt-0 xl:pl-6">
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

                  {order.status === 'pending' && (
                    <>
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

                      <button
                        onClick={() => handleReject(order.id, order.full_name)}
                        disabled={processingId === order.id}
                        className="flex items-center justify-center gap-2 bg-rose-600 text-white px-4 py-3 rounded-xl font-bold hover:bg-rose-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all w-full text-sm shadow-[0_4px_14px_0_rgba(225,29,72,0.3)]"
                      >
                        {processingId === order.id ? (
                          <>
                            <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                            Memproses...
                          </>
                        ) : (
                          <>
                            <XCircle size={18} /> Reject Pesanan
                          </>
                        )}
                      </button>
                    </>
                  )}

                  {order.status !== 'pending' && (
                    <div className="flex items-center justify-center gap-2 bg-slate-100 text-slate-600 px-4 py-3 rounded-xl font-bold w-full text-sm">
                      <Mail size={18} /> {order.status === 'success' ? 'Tiket sudah dikirim' : 'Notifikasi reject terkirim'}
                    </div>
                  )}
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
