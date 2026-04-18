// src/pages/feedback.tsx
import React, { useState } from 'react';
import { CheckCircle, Send } from 'lucide-react';
import { supabase } from '../supabase';

const Feedback: React.FC = () => {
  const [score, setScore] = useState<number | null>(null);
  const [comment, setComment] = useState<string>('');
  const [submitted, setSubmitted] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>('');

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

  const handleSubmit = async () => {
    if (score === null) {
      setError('Please select a score first!');
      return;
    }
    setError('');
    setLoading(true);

    const { error: supaErr } = await supabase.from('feedback').insert([
      { score, comment: comment.trim() || null },
    ]);

    setLoading(false);

    if (supaErr) {
      console.error(supaErr);
      setError('Failed to submit feedback. Please try again!');
      return;
    }

    setSubmitted(true);
  };

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
            Your input means a lot to us and helps make TEDxUII even better in the future.
          </p>

          <div className="mt-10 h-px w-32 mx-auto bg-[#e62b1e]/40"></div>

          <p className="mt-6 text-sm text-[#555] italic">
            "Ideas worth spreading."
          </p>
        </div>
      </div>
    );
  }

  return (
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

          {/* Score buttons — responsive single row via grid */}
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
          onClick={handleSubmit}
          disabled={loading}
          className={`w-full py-4 rounded-xl font-extrabold uppercase tracking-[2px] text-sm flex items-center justify-center gap-2 transition-all duration-300 cursor-pointer ${
            score !== null
              ? 'bg-[#e62b1e] text-white hover:bg-[#c01e13] hover:scale-[1.01]'
              : 'bg-[#1a1a1a] text-[#444] border border-[#333] cursor-not-allowed'
          }`}
        >
          {loading ? (
            <span className="animate-pulse">Submitting...</span>
          ) : (
            <>
              Submit Feedback <Send size={16} />
            </>
          )}
        </button>

        <p className="text-center text-[#444] text-xs mt-6">
          Your feedback is anonymous and will only be used to improve the quality of our event.
        </p>
      </div>
    </div>
  );
};

export default Feedback;
