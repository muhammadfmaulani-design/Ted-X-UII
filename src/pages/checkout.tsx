import React, { useState, useEffect } from 'react';
import { Mail, User, Phone, Ticket, ArrowLeft, CheckCircle, Info, UploadCloud, Building } from 'lucide-react';
import { Link, useNavigate, useLocation } from 'react-router-dom';

const Checkout: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [loading, setLoading] = useState<boolean>(false);
  
  const [showSuccessPopup, setShowSuccessPopup] = useState<boolean>(false);
  
  const { ticket, quantity } = location.state || {};

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

  // State khusus untuk file bukti bayar
  const [file, setFile] = useState<File | null>(null);

  if (!ticket) return null;

  const totalDue = ticket.price * quantity;

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const selectedFile = e.target.files[0];
      // Validasi ukuran max 5MB
      if (selectedFile.size > 5 * 1024 * 1024) {
        alert("Ukuran file bukti transfer maksimal 5MB bos!");
        e.target.value = '';
        return;
      }
      setFile(selectedFile);
    }
  };

  const handlePayment = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!file) {
      alert("Tolong upload foto bukti transfer terlebih dahulu.");
      return;
    }

    setLoading(true);

    try {
      const apiUrl = import.meta.env.VITE_API_URL;

      // Wajib pakai FormData untuk kirim file
      const submitData = new FormData();
      submitData.append("full_name", formData.full_name);
      submitData.append("email", formData.email);
      submitData.append("whatsapp_no", formData.whatsapp_no);
      submitData.append("category_id", ticket.id);
      submitData.append("quantity", quantity.toString());
      submitData.append("payment_proof", file);

      // PENTING: Jangan set Content-Type header secara manual jika pakai fetch + FormData.
      // Browser akan otomatis men-set boundary-nya.
      const response = await fetch(`${apiUrl}/orders/`, {
        method: 'POST',
        body: submitData,
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.detail || 'Order creation failed');
      }

      // Jika API sukses, langsung tampilkan popup sukses
      setShowSuccessPopup(true);
      
    } catch (err: any) {
      alert(err.message || "A system error occurred.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#f8f9fa] flex flex-col md:flex-row font-sans text-gray-900 pt-[80px] relative">
      
      {/* --- LEFT: ORDER SUMMARY --- */}
      <div className="w-full md:w-5/12 bg-[#000b18] text-white p-8 md:p-16 flex flex-col relative overflow-hidden min-h-[400px] md:min-h-0">
        <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(ellipse_at_top_left,rgba(230,43,30,0.2)_0%,transparent_70%)]"></div>
        <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:40px_40px] z-0"></div>

        <div className="relative z-10 flex flex-col h-full pt-4 md:pt-0">
          <Link to="/tickets" className="inline-flex items-center gap-2 text-[#8ba2c9] hover:text-white transition-colors mb-12 w-fit font-semibold uppercase tracking-wider text-sm">
            <ArrowLeft size={18} /> Change Ticket
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
                <span className="text-gray-400">Price per ticket</span>
                <span className="text-white">Rp {ticket.price.toLocaleString('id-ID')}</span>
              </div>
              <div className="flex justify-between items-center text-sm font-medium">
                <span className="text-gray-400">Quantity</span>
                <span className="text-white">x {quantity}</span>
              </div>
            </div>

            <div className="border-t border-white/10 pt-6 flex justify-between items-end">
              <div>
                <p className="text-sm text-[#8ba2c9] uppercase tracking-widest mb-1">Total Payment</p>
                <p className="text-4xl font-black text-[#e62b1e]">Rp {totalDue.toLocaleString('id-ID')}</p>
              </div>
              <Ticket size={48} className="text-white/10" />
            </div>
          </div>
        </div>
      </div>

      {/* --- RIGHT: ORDER FORM --- */}
      <div className="w-full md:w-7/12 bg-white p-8 md:p-16 xl:p-24 flex items-center justify-center relative overflow-y-auto">
        <div className="w-full max-w-lg">
          
          <div className="mb-8">
            <h2 className="text-3xl font-black text-gray-900 tracking-tight mb-2">Checkout Details</h2>
            <p className="text-gray-500">Please complete your payment and fill in the details below.</p>
          </div>

          {/* BOX INSTRUKSI TRANSFER */}
          <div className="bg-[#f0f4f8] border border-[#d1e0f0] p-5 rounded-2xl mb-8">
            <div className="flex items-center gap-3 mb-2">
              <Building size={20} className="text-[#2a4374]" />
              <h3 className="font-bold text-[#1a2b4c]">Bank Transfer</h3>
            </div>
            <p className="text-sm text-gray-600 mb-3">Please transfer exactly <strong>Rp {totalDue.toLocaleString('id-ID')}</strong> to the following account:</p>
            <div className="bg-white p-4 rounded-xl border border-gray-200">
              <p className="text-xs text-gray-500 font-bold uppercase tracking-wider mb-1">Bank Mandiri</p>
              <p className="text-xl font-black tracking-widest text-gray-900">1120022370774</p>
              <p className="text-sm font-medium text-gray-600 mt-1">a.n. Panitia TEDxUII</p>
            </div>
          </div>

          <form onSubmit={handlePayment} className="space-y-6">
            <div className="space-y-2">
              <label className="text-xs font-bold text-gray-500 uppercase tracking-wider">Full Name</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <User size={20} className="text-gray-400" />
                </div>
                <input required name="full_name" onChange={handleChange} placeholder="John Doe" className="w-full bg-gray-50 border border-gray-200 text-gray-900 rounded-xl pl-12 pr-4 py-4 focus:bg-white focus:ring-2 focus:ring-[#e62b1e]/20 focus:border-[#e62b1e] outline-none transition-all font-medium" />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-xs font-bold text-gray-500 uppercase tracking-wider flex items-center gap-2">
                Email Address <span className="text-[#e62b1e]">*</span>
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <Mail size={20} className="text-[#e62b1e]" />
                </div>
                <input required type="email" name="email" onChange={handleChange} placeholder="johndoe@email.com" className="w-full bg-white border-2 border-gray-200 text-gray-900 rounded-xl pl-12 pr-4 py-4 focus:ring-4 focus:ring-[#e62b1e]/10 focus:border-[#e62b1e] outline-none transition-all font-medium" />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-xs font-bold text-gray-500 uppercase tracking-wider">WhatsApp Number</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <Phone size={20} className="text-gray-400" />
                </div>
                <input required name="whatsapp_no" onChange={handleChange} placeholder="08xxxxxxxxxx" className="w-full bg-gray-50 border border-gray-200 text-gray-900 rounded-xl pl-12 pr-4 py-4 focus:bg-white focus:ring-2 focus:ring-[#e62b1e]/20 focus:border-[#e62b1e] outline-none transition-all font-medium" />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-xs font-bold text-gray-500 uppercase tracking-wider">Upload Payment Proof</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <UploadCloud size={20} className="text-gray-400" />
                </div>
                <input 
                  required 
                  type="file" 
                  accept="image/*" 
                  onChange={handleFileChange} 
                  className="w-full bg-gray-50 border border-gray-200 text-gray-900 rounded-xl pl-12 pr-4 py-3.5 focus:bg-white focus:ring-2 focus:ring-[#e62b1e]/20 focus:border-[#e62b1e] outline-none transition-all font-medium file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-xs file:font-bold file:bg-[#1a2b4c] file:text-white hover:file:bg-[#2a4374] file:cursor-pointer cursor-pointer" 
                />
              </div>
            </div>

            <div className="pt-6">
              <button type="submit" disabled={loading} className="w-full bg-[#e62b1e] text-white font-black uppercase tracking-widest py-5 rounded-xl hover:bg-black transition-all transform hover:-translate-y-1 disabled:bg-gray-300 disabled:text-gray-500 disabled:transform-none shadow-xl shadow-red-500/20 flex justify-center items-center gap-3">
                {loading ? "Uploading Data..." : "Confirm"}
              </button>
            </div>
          </form>

        </div>
      </div>

      {/* --- POP-UP ORDER SUBMITTED --- */}
      {showSuccessPopup && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-md z-[100] flex items-center justify-center p-4">
          <div className="bg-[#020d24] border border-[#2a4374] rounded-3xl p-8 max-w-sm w-full shadow-[0_0_40px_rgba(0,0,0,0.8)] relative transform transition-all text-center flex flex-col items-center">
            
            <div className="w-20 h-20 bg-blue-500/10 border-2 border-blue-500/50 text-blue-500 rounded-full flex items-center justify-center mb-6 shadow-[0_0_20px_rgba(59,130,246,0.3)]">
              <CheckCircle size={40} />
            </div>

            <h3 className="text-2xl font-black text-white uppercase tracking-tight mb-3">
              Order Received
            </h3>
            
            <div className="w-12 h-1 bg-blue-500 rounded-full mb-5"></div>

            <div className="bg-[#000b18] border border-[#1a2b4c] rounded-xl p-4 w-full mb-8 text-left flex items-start gap-3">
              <Info size={20} className="text-[#8ba2c9] shrink-0 mt-0.5" />
              <p className="text-[#8ba2c9] text-sm font-light leading-relaxed">
                <strong className="text-white">What's Next?</strong><br/>
                Your payment proof has been successfully uploaded. Our team will verify your transfer shortly. Once approved, your E-Ticket will be sent directly to your email.
              </p>
            </div>

            <button 
              onClick={() => {
                setShowSuccessPopup(false);
                navigate('/');
              }}
              className="w-full bg-[#1a2b4c] text-white font-bold uppercase tracking-widest py-4 rounded-xl hover:bg-[#2a4374] transition-all flex justify-center items-center gap-2"
            >
              Back to Home
            </button>
          </div>
        </div>
      )}

    </div>
  );
};

export default Checkout;