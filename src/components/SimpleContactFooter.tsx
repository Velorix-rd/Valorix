import React, { useState } from 'react';
import { Mail, Copy, Check, Sparkles } from 'lucide-react';
import { APP_VERSION_LABEL } from '../config/version';
import { copyToClipboard } from '../utils/clipboard';

export const SimpleContactFooter: React.FC = () => {
  const [copied, setCopied] = useState(false);
  const email = 'rd8538689@gmail.com';

  const handleCopy = async () => {
    try {
      const ok = await copyToClipboard(email);
      if (ok) {
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
      }
    } catch (e) {
      console.warn('Copy action failed safely', e);
    }
  };

  return (
    <div id="contact-us-section" className="w-full max-w-7xl mx-auto px-4 sm:px-6 my-8">
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 p-4 sm:p-5 rounded-2xl bg-zinc-900/80 border border-white/10 backdrop-blur-md">
        <div className="flex items-center gap-3 text-center sm:text-left">
          <div className="w-10 h-10 rounded-xl bg-emerald-500/10 text-emerald-400 flex items-center justify-center shrink-0">
            <Mail className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center justify-center sm:justify-start gap-2">
              <span className="text-xs font-bold text-zinc-400 uppercase tracking-wider block">Contact Us</span>
              <span className="px-2 py-0.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 font-mono text-[10px] font-bold">
                {APP_VERSION_LABEL}
              </span>
            </div>
            <span className="text-sm font-semibold text-white">Direct Developer & Support Inquiries</span>
          </div>
        </div>

        <div className="flex items-center gap-2 bg-black/60 px-3.5 py-2 rounded-xl border border-white/10">
          <span className="text-xs sm:text-sm font-mono text-emerald-400 font-semibold">{email}</span>
          <button
            type="button"
            onClick={handleCopy}
            className="p-1.5 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-zinc-300 hover:text-white transition-all text-xs font-medium flex items-center gap-1 cursor-pointer"
            title="Copy Email"
          >
            {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
            <span className="text-[11px]">{copied ? 'Copied' : 'Copy'}</span>
          </button>
        </div>
      </div>
    </div>
  );
};
