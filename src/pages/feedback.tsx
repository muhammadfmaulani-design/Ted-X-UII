// src/pages/feedback.tsx
import React, { useState } from 'react';
import { CheckCircle, Send, Mail, User, AlertTriangle, X } from 'lucide-react';
import { supabase } from '../supabase';

const Feedback: React.FC = () => {
  const [score, setScore] = useState<number | null>(null);
  const [comment, setComment] = useState<string>('');
  const [submitted, setSubmitted] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>('');

  // Dialog state
  const [showDialog, setShowDialog] = useState<boolean>(false);
  const [fullName, setFullName] = useState<string>('');
  const [email, setEmail] = useState<string>('');
  const [dialogError, setDialogError] = useState<string>('');

  const getScoreLabel = (s: number) => {
    if (s <= 3) return 'Not likely';
    if (s <= 6) return 'Neutral';
    if (s <= 8) return 'Likely';
    return 'Very likely';
  };

  const getScoreColor = (s: number, selected: number | null) => {
    const isSelected = selected === s;
    if (isSelected) return 'bg-[#e62b1e] border-[#e62b1e] text-white scale-110';
    if (selected !== null) {
      if (s <= 3) return 'border-[#ff4444] text-[#ff4444] hover:bg-[#ff4444]/10';
      if (s <= 6) return 'border-[#ffaa00] text-[#ffaa00] hover:bg-[#ffaa00]/10';
      return 'border-[#22c55e] text-[#22c55e] hover:bg-[#22c55e]/10';
    }
    return 'border-[#333] text-white hover:border-[#e62b1e] hover:text-[#e62b1e]';
  };

  const isValidEmail = (val: string) =>
    /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(val);

  // Step 1: validate score, then open dialog
  const handleSubmitClick = () => {
    if (score === null) {
      setError('Please select a score first!');
      return;
    }
    setError('');
    setShowDialog(true);
  };

  // Step 2: validate dialog fields, then submit to Supabase
  const handleDialogConfirm = async () => {
    if (!fullName.trim()) {
      setDialogError('Please enter your full name.');
      return;
    }
    if (!isValidEmail(email)) {
      setDialogError('Please enter a valid email address.');
      return;
    }
    setDialogError('');
    setLoading(true);

    const { error: supaErr } = await supabase.from('feedback').insert([
      {
        score,
        comment: comment.trim() || null,
        full_name: fullName.trim(),
        email: email.trim().toLowerCase(),
      },
    ]);

    setLoading(false);

    if (supaErr) {
      console.error(supaErr);
      setDialogError('Failed to submit. Please try again!');
      return;
    }

    setShowDialog(false);
    setSubmitted(true);
  };

  // Thank you screen
  if (submitted) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center px-6 pt-[80px]">
        <div className="text-center max-w-lg">
          <div className="flex justify-center mb-6">
            <div className="w-24 h-24 rounded-full bg-[#e62b1e]/10 border border-[#e62b1e]/30 flex items-center justify-center">
              <CheckCircle size={48} className="text-[#e62b1e]" />
            </div>
          </div>
          <h1 className="text-4xl md:text-5xl font-black mb-4 tracking-tight">
            Thank you!
          </h1>
          <p className="text-[#aaa] text-lg mb-2">
            Your feedback has been received.
          </p>
          <p className="text-[#666] text-base">
            Your certificate will be sent to <span className="text-white font-medium">{email}</span>. Make sure to check your inbox!
          </p>
          <div className="mt-10 h-px w-32 mx-auto bg-[#e62b1e]/40"></div>
          <p className="mt-6 text-sm text-[#555] italic">"Ideas worth spreading."</p>
        </div>
      </div>
    );
  }

  return (
    <>
      <div className="min-h-screen flex flex-col items-center justify-center px-6 pt-[80px] pb-16">
        <div className="w-full max-w-2xl">

          {/* Header */}
          <div className="text-center mb-12">
            <div className="flex items-baseline justify-center gap-1 mb-6">
              <span className="font-black text-4xl text-[#e62b1e] tracking-[-2px]">TED</span>
              <span className="font-black text-2xl text-[#e62b1e]">x</span>
              <span className="font-light text-4xl text-white tracking-[-1px] ml-1">UII</span>
            </div>
            <p className="text-[#aaa] text-base max-w-md mx-auto leading-relaxed">
              We hope you enjoyed your experience at TEDxUII. We value your feedback and would like you to answer one question below.
            </p>
          </div>

          {/* NPS Card */}
          <div className="bg-[#0d1a2a] border border-[#1a2a3a] rounded-2xl p-8 md:p-12 mb-6">
            <h2 className="text-xl md:text-2xl font-bold text-center mb-8 leading-snug">
              How likely are you to recommend{' '}
              <span className="text-[#e62b1e]">TEDxUII</span> to a friend or colleague?
            </h2>

            {/* Score buttons */}
            <div className="grid grid-cols-11 gap-1.5 mb-4">
              {Array.from({ length: 11 }, (_, i) => i).map((n) => (
                <button
                  key={n}
                  onClick={() => setScore(n)}
                  className={`aspect-square w-full rounded-lg border-2 font-bold text-xs sm:text-sm transition-all duration-200 cursor-pointer ${getScoreColor(n, score)}`}
                >
                  {n}
                </button>
              ))}
            </div>

            {/* Labels */}
            <div className="flex justify-between text-xs text-[#666] px-1 mb-8">
              <span>Not likely</span>
              <span>Very likely</span>
            </div>

            {/* Score indicator */}
            {score !== null && (
              <div className="text-center mb-6">
                <span className="inline-block px-4 py-1.5 rounded-full bg-[#e62b1e]/10 border border-[#e62b1e]/30 text-[#e62b1e] text-sm font-semibold">
                  Score {score} — {getScoreLabel(score)}
                </span>
              </div>
            )}

            {/* Optional comment */}
            <div className="mb-2">
              <label className="block text-sm text-[#888] mb-2 font-medium">
                Anything you'd like to share? (optional)
              </label>
              <textarea
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                placeholder="Tell us about your experience at TEDxUII..."
                rows={4}
                className="w-full bg-[#0a1520] border border-[#1a2a3a] rounded-xl px-4 py-3 text-white text-sm placeholder-[#444] focus:outline-none focus:border-[#e62b1e]/50 resize-none transition-colors"
              />
            </div>
          </div>

          {/* Error */}
          {error && (
            <p className="text-center text-[#e62b1e] text-sm mb-4">{error}</p>
          )}

          {/* Submit Button */}
          <button
            onClick={handleSubmitClick}
            className={`w-full py-4 rounded-xl font-extrabold uppercase tracking-[2px] text-sm flex items-center justify-center gap-2 transition-all duration-300 cursor-pointer ${
              score !== null
                ? 'bg-[#e62b1e] text-white hover:bg-[#c01e13] hover:scale-[1.01]'
                : 'bg-[#1a1a1a] text-[#444] border border-[#333] cursor-not-allowed'
            }`}
          >
            Submit Feedback <Send size={16} />
          </button>

          <p className="text-center text-[#444] text-xs mt-6">
            Your feedback is used to improve the quality of our event and to process your certificate.
          </p>
        </div>
      </div>

      {/* ── DIALOG MODAL ── */}
      {showDialog && (
        <div className="fixed inset-0 z-50 flex items-center justify-center px-4">
          {/* Backdrop */}
          <div
            className="absolute inset-0 bg-black/70 backdrop-blur-sm"
            onClick={() => setShowDialog(false)}
          />

          {/* Modal */}
          <div className="relative z-10 w-full max-w-md bg-[#0d1a2a] border border-[#1a2a3a] rounded-2xl p-8 shadow-2xl">

            {/* Close button */}
            <button
              onClick={() => setShowDialog(false)}
              className="absolute top-4 right-4 text-[#555] hover:text-white transition-colors cursor-pointer"
            >
              <X size={20} />
            </button>

            {/* Icon */}
            <div className="flex justify-center mb-5">
              <div className="w-14 h-14 rounded-full bg-[#e62b1e]/10 border border-[#e62b1e]/30 flex items-center justify-center">
                <Mail size={26} className="text-[#e62b1e]" />
              </div>
            </div>

            <h3 className="text-xl font-black text-center mb-1">
              One more step!
            </h3>
            <p className="text-[#888] text-sm text-center mb-6">
              We'll use this info to send your <span className="text-white font-semibold">participation certificate</span>.
            </p>

            {/* Full Name */}
            <div className="mb-4">
              <label className="block text-xs text-[#888] uppercase tracking-wider mb-2 font-semibold">
                Full Name
              </label>
              <div className="relative">
                <User size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#555]" />
                <input
                  type="text"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  placeholder="e.g. Muhammad Fajar Maulani"
                  className="w-full bg-[#0a1520] border border-[#1a2a3a] rounded-xl pl-9 pr-4 py-3 text-white text-sm placeholder-[#444] focus:outline-none focus:border-[#e62b1e]/50 transition-colors"
                />
              </div>
            </div>

            {/* Email */}
            <div className="mb-4">
              <label className="block text-xs text-[#888] uppercase tracking-wider mb-2 font-semibold">
                Email Address
              </label>
              <div className="relative">
                <Mail size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#555]" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="e.g. yourname@email.com"
                  className="w-full bg-[#0a1520] border border-[#1a2a3a] rounded-xl pl-9 pr-4 py-3 text-white text-sm placeholder-[#444] focus:outline-none focus:border-[#e62b1e]/50 transition-colors"
                />
              </div>
            </div>

            {/* Email reminder */}
            <div className="flex items-start gap-2.5 bg-[#ffaa00]/5 border border-[#ffaa00]/20 rounded-xl px-4 py-3 mb-6">
              <AlertTriangle size={15} className="text-[#ffaa00] mt-0.5 flex-none" />
              <p className="text-xs text-[#ffaa00]/90 leading-relaxed">
                <span className="font-bold">Please double-check your email.</span> Your certificate will be sent directly to this address. We are unable to resend it if the email is incorrect.
              </p>
            </div>

            {/* Dialog error */}
            {dialogError && (
              <p className="text-[#e62b1e] text-xs text-center mb-4">{dialogError}</p>
            )}

            {/* Confirm button */}
            <button
              onClick={handleDialogConfirm}
              disabled={loading}
              className="w-full py-3.5 bg-[#e62b1e] hover:bg-[#c01e13] text-white rounded-xl font-extrabold uppercase tracking-[2px] text-sm flex items-center justify-center gap-2 transition-all duration-200 cursor-pointer"
            >
              {loading ? (
                <span className="animate-pulse">Submitting...</span>
              ) : (
                <>
                  Confirm & Submit <Send size={15} />
                </>
              )}
            </button>

            <p className="text-center text-[#444] text-xs mt-4">
              Your data is kept private and used solely for certificate delivery.
            </p>
          </div>
        </div>
      )}
    </>
  );
};

export default Feedback;
