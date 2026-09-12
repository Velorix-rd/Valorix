import React, { useState } from 'react';
import { Send, MessageSquare, CheckCircle, Sparkles, AlertCircle, Shield, User, MessageCircle } from 'lucide-react';
import { addDoc, collection, serverTimestamp } from 'firebase/firestore';
import { db } from '../lib/firebase';

interface ContactSectionProps {
  currentUserEmail?: string | null;
  currentUserName?: string | null;
}

export const ContactSection: React.FC<ContactSectionProps> = ({
  currentUserEmail,
  currentUserName
}) => {
  const [name, setName] = useState(currentUserName || '');
  const [topic, setTopic] = useState('Feedback & Suggestions');
  const [message, setMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const adminAccount = 'rd8538689@gmail.com';

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!message.trim()) {
      setError('Please write your comment or question before submitting.');
      return;
    }

    setIsSubmitting(true);
    setError(null);

    try {
      // Direct in-website message storage in Firestore (Zero Email Redirection)
      await addDoc(collection(db, 'contact_messages'), {
        senderName: name.trim() || 'Anonymous User',
        userAccount: currentUserEmail || 'Guest / Unauthenticated',
        category: topic,
        commentText: message.trim(),
        submittedAt: new Date().toISOString(),
        timestamp: serverTimestamp(),
        status: 'new',
        targetAdmin: adminAccount,
        appSource: 'Velorix Web'
      });

      setSubmitted(true);
      setMessage('');
    } catch (err: any) {
      console.error('In-website comment submission error:', err);
      setError('Unable to submit your comment. Please check your connection and try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div id="contact-us-section" className="w-full max-w-5xl mx-auto px-4 sm:px-6 my-12">
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-b from-zinc-900/90 via-zinc-950 to-black border border-white/10 shadow-2xl p-6 sm:p-10">
        {/* Glow ambient decoration */}
        <div className="absolute top-0 right-1/4 w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none -z-10" />
        <div className="absolute bottom-0 left-1/4 w-96 h-96 bg-teal-500/10 rounded-full blur-3xl pointer-events-none -z-10" />

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          {/* Left Column: Direct In-Website Contact Details */}
          <div className="lg:col-span-5 space-y-5">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-bold tracking-wide uppercase">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Direct In-App Contact</span>
            </div>

            <div className="space-y-2">
              <h2 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
                Contact <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-teal-300">Us</span>
              </h2>
              <p className="text-xs sm:text-sm text-zinc-400 leading-relaxed">
                Contact us directly inside the website! No need to open your email app. Post your comment, feedback, or inquiry right here and it reaches the admin immediately.
              </p>
            </div>

            {/* In-Website Channel Features */}
            <div className="space-y-3 pt-1">
              <div className="flex items-center gap-3 p-3 rounded-2xl bg-white/[0.03] border border-white/5">
                <div className="w-8 h-8 rounded-xl bg-emerald-500/10 text-emerald-400 flex items-center justify-center shrink-0">
                  <MessageCircle className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-white">100% In-Website Messaging</h4>
                  <p className="text-[11px] text-zinc-400">Post comments without leaving this tab</p>
                </div>
              </div>

              <div className="flex items-center gap-3 p-3 rounded-2xl bg-white/[0.03] border border-white/5">
                <div className="w-8 h-8 rounded-xl bg-emerald-500/10 text-emerald-400 flex items-center justify-center shrink-0">
                  <Shield className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-white">Direct Admin Notification</h4>
                  <p className="text-[11px] text-zinc-400">Delivered directly to admin ({adminAccount})</p>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column: In-Website Comment / Chat Box */}
          <div className="lg:col-span-7 rounded-2xl bg-zinc-900/60 border border-white/10 p-5 sm:p-7 relative backdrop-blur-sm">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <MessageSquare className="w-4 h-4 text-emerald-400" />
                <h3 className="text-sm sm:text-base font-bold text-white">
                  Direct In-Website Comment Box
                </h3>
              </div>
              <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-md border border-emerald-500/20">
                Instant Delivery
              </span>
            </div>

            {submitted ? (
              <div className="p-6 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 text-center space-y-3">
                <div className="w-12 h-12 rounded-full bg-emerald-500/20 border border-emerald-500/40 text-emerald-400 flex items-center justify-center mx-auto">
                  <CheckCircle className="w-6 h-6" />
                </div>
                <h4 className="text-base font-bold text-white">Comment Submitted!</h4>
                <p className="text-xs text-zinc-300 max-w-md mx-auto leading-relaxed">
                  Your message has been sent directly through the website to the admin (<span className="text-emerald-400 font-semibold">{adminAccount}</span>).
                </p>
                <button
                  type="button"
                  onClick={() => setSubmitted(false)}
                  className="mt-2 px-4 py-2 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-xs font-bold text-white transition-colors cursor-pointer"
                >
                  Write Another Comment
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                {error && (
                  <div className="p-3.5 rounded-xl bg-red-500/10 border border-red-500/30 text-red-300 text-xs flex items-start gap-2">
                    <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
                    <span>{error}</span>
                  </div>
                )}

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                  <div>
                    <label className="block text-[11px] font-bold text-zinc-400 uppercase tracking-wider mb-1.5 flex items-center gap-1">
                      <User className="w-3 h-3 text-emerald-400" />
                      <span>Your Name</span>
                    </label>
                    <input
                      type="text"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="e.g. Alex"
                      className="w-full px-3.5 py-2.5 rounded-xl bg-black/60 border border-white/10 text-white placeholder-zinc-600 text-xs sm:text-sm focus:outline-none focus:border-emerald-400 transition-colors"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-bold text-zinc-400 uppercase tracking-wider mb-1.5">
                      Category
                    </label>
                    <select
                      value={topic}
                      onChange={(e) => setTopic(e.target.value)}
                      className="w-full px-3.5 py-2.5 rounded-xl bg-black/60 border border-white/10 text-white text-xs sm:text-sm focus:outline-none focus:border-emerald-400 transition-colors cursor-pointer"
                    >
                      <option value="Feedback & Suggestions">💡 Feedback & Suggestions</option>
                      <option value="Question / Help">❓ Question / Help</option>
                      <option value="Report an Issue">🐞 Report an Issue</option>
                      <option value="General Comment">💬 General Comment</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-zinc-400 uppercase tracking-wider mb-1.5">
                    Write Comment / Message <span className="text-emerald-400">*</span>
                  </label>
                  <textarea
                    rows={4}
                    required
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    placeholder="Write your comment, question or feedback directly here..."
                    className="w-full px-3.5 py-2.5 rounded-xl bg-black/60 border border-white/10 text-white placeholder-zinc-600 text-xs sm:text-sm focus:outline-none focus:border-emerald-400 transition-colors resize-none"
                  />
                </div>

                <div className="flex items-center justify-between pt-1">
                  <span className="text-[11px] text-zinc-500">
                    Direct in-website transmission
                  </span>

                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-400 hover:from-emerald-400 hover:to-teal-300 text-black font-extrabold text-xs sm:text-sm shadow-lg shadow-emerald-500/20 flex items-center gap-2 transition-all active:scale-95 disabled:opacity-50 cursor-pointer"
                  >
                    <Send className={`w-4 h-4 ${isSubmitting ? 'animate-spin' : ''}`} />
                    <span>{isSubmitting ? 'Posting...' : 'Post Comment'}</span>
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
