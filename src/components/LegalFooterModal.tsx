import React, { useState, useEffect, useRef } from 'react';
import { FileText, Lock, AlertTriangle, Check, X, ShieldAlert, EyeOff, ArrowRight, ArrowLeft, Share2, Tag } from 'lucide-react';
import { APP_VERSION_LABEL } from '../config/version';

export interface LegalFooterModalProps {
  externalModal?: 'terms' | 'privacy' | 'combined' | null;
  onCloseExternal?: () => void;
  logoUrl?: string | null;
}

const VelorixBrand: React.FC<{
  logoUrl?: string | null;
  subtitle?: string;
  size?: 'sm' | 'md';
}> = ({ logoUrl, subtitle, size = 'sm' }) => {
  const [hasError, setHasError] = useState(false);
  const effectiveSrc = logoUrl || '/logo-512.png';

  const logoDims = size === 'sm' ? 'w-6 h-6 sm:w-7 sm:h-7' : 'w-9 h-9 sm:w-10 sm:h-10';
  const iconDims = size === 'sm' ? 'w-3.5 h-3.5 sm:w-4 sm:h-4' : 'w-5 h-5';
  const textClass = size === 'sm' ? 'text-xs sm:text-sm' : 'text-sm sm:text-base';

  return (
    <div className="flex items-center gap-2.5">
      <div className={`${logoDims} bg-accent rounded-xl flex items-center justify-center shadow-md shadow-accent/25 overflow-hidden shrink-0`}>
        {!hasError ? (
          <img
            src={effectiveSrc}
            alt="Velorix Logo"
            className="w-full h-full object-cover"
            onError={() => setHasError(true)}
            referrerPolicy="no-referrer"
          />
        ) : (
          <Share2 className={`${iconDims} text-black stroke-[2.5]`} />
        )}
      </div>
      <div className="flex flex-col">
        <span className={`font-display font-black ${textClass} tracking-tight text-white uppercase`}>
          VELOR<span className="text-accent">IX</span>
        </span>
        {subtitle && (
          <span className="text-[10px] text-zinc-400 font-medium line-clamp-1">
            {subtitle}
          </span>
        )}
      </div>
    </div>
  );
};

export const LegalFooterModal: React.FC<LegalFooterModalProps> = ({
  externalModal = null,
  onCloseExternal,
  logoUrl = null,
}) => {
  const [activeModal, setActiveModal] = useState<'terms' | 'privacy' | 'combined' | null>(null);
  const [combinedStep, setCombinedStep] = useState<'terms' | 'privacy'>('terms');
  const [termsAccepted, setTermsAccepted] = useState(true);
  const [privacyAccepted, setPrivacyAccepted] = useState(true);
  const contentRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (externalModal) {
      setActiveModal(externalModal);
      if (externalModal === 'combined') {
        setCombinedStep('terms');
        if (contentRef.current) {
          contentRef.current.scrollTop = 0;
        }
      }
    }
  }, [externalModal]);

  const handleClose = () => {
    setActiveModal(null);
    if (onCloseExternal) {
      onCloseExternal();
    }
  };

  const handleNextToPrivacy = () => {
    setCombinedStep('privacy');
    if (contentRef.current) {
      contentRef.current.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const handleBackToTerms = () => {
    setCombinedStep('terms');
    if (contentRef.current) {
      contentRef.current.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  return (
    <>
      {/* Bottom Footer Section */}
      <footer id="app-legal-footer" className="w-full mt-16 pt-8 pb-32 border-t border-white/10 text-zinc-400">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 flex flex-col md:flex-row items-center justify-between gap-4 text-xs">
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-300 font-medium">
              <ShieldAlert className="w-3.5 h-3.5" />
              <span>100% Anti-Leak & Hack-Proof Architecture</span>
            </div>
            <span>AES-256 Military Encryption • Zero-Knowledge Private Vault</span>
          </div>

          <div className="flex flex-wrap items-center gap-4 text-zinc-300">
            <button
              id="btn-scroll-contact"
              type="button"
              onClick={() => {
                const el = document.getElementById('contact-us-section');
                if (el) {
                  el.scrollIntoView({ behavior: 'smooth' });
                }
              }}
              className="hover:text-emerald-400 transition-colors flex items-center gap-1 font-semibold text-emerald-400 cursor-pointer"
            >
              <span>Contact Us</span>
            </button>
            <span className="text-zinc-600">•</span>
            <button
              id="btn-open-terms"
              type="button"
              onClick={() => setActiveModal('terms')}
              className="hover:text-emerald-400 transition-colors flex items-center gap-1 underline underline-offset-4 cursor-pointer"
            >
              <FileText className="w-3.5 h-3.5" />
              <span>Terms & Conditions</span>
            </button>
            <span className="text-zinc-600">•</span>
            <button
              id="btn-open-privacy"
              type="button"
              onClick={() => setActiveModal('privacy')}
              className="hover:text-emerald-400 transition-colors flex items-center gap-1 underline underline-offset-4 cursor-pointer"
            >
              <Lock className="w-3.5 h-3.5" />
              <span>Privacy Policy</span>
            </button>
            <span className="text-zinc-600">•</span>
            <span className="text-zinc-500">© 2026 VELORIX. All rights reserved.</span>
            <span className="text-zinc-600">•</span>
            <div className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 font-mono text-[10px] font-bold">
              <Tag className="w-3 h-3 text-emerald-400" />
              <span>{APP_VERSION_LABEL}</span>
            </div>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 mt-3 text-[11px] text-zinc-400 text-center md:text-left">
          Security Guarantee: Velorix is engineered with bank-grade AES-256 GCM client-side encryption and direct P2P data isolation. Your files never pass unencrypted over any network, preventing all forms of data leaks, hacking, unauthorized snooping, malware distribution, or third-party tracking. You retain 100% full sovereignty over your confidential files.
        </div>
      </footer>

      {/* Spacious Post-Login Multi-Step Legal Agreement Modal */}
      {activeModal === 'combined' && (
        <div 
          id="modal-post-login-legal" 
          className="fixed inset-0 z-[130] flex items-center justify-center p-0 sm:p-4 md:p-6 bg-black/90 backdrop-blur-md animate-in fade-in duration-200"
          onClick={handleClose}
        >
          <div 
            className="relative w-full max-w-5xl h-full sm:h-[92vh] sm:max-h-[92vh] flex flex-col bg-zinc-900 border-0 sm:border border-white/15 rounded-none sm:rounded-3xl shadow-2xl overflow-hidden text-zinc-200"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Slim Header & Stepper */}
            <div className="px-4 sm:px-6 py-2.5 sm:py-3 border-b border-white/10 bg-zinc-950/95 shrink-0">
              {/* Velorix Logo & Branding Header */}
              <div className="flex items-center justify-between pb-2 mb-2 border-b border-white/10">
                <VelorixBrand 
                  logoUrl={logoUrl} 
                  subtitle="Zero-Knowledge Secure File Sharing Protocol" 
                  size="sm" 
                />
                <button
                  id="btn-close-combined-legal"
                  onClick={handleClose}
                  className="p-1.5 sm:p-2 rounded-xl hover:bg-white/10 text-zinc-400 hover:text-white transition-colors cursor-pointer"
                  title="Close"
                >
                  <X className="w-4 h-4 sm:w-5 sm:h-5" />
                </button>
              </div>

              {/* Current Document Step Indicator */}
              <div className="flex items-center justify-between gap-3">
                <div className="flex items-center gap-2.5">
                  <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-xl flex items-center justify-center border shrink-0 transition-colors bg-emerald-500/20 text-emerald-400 border-emerald-500/40">
                    {combinedStep === 'terms' ? (
                      <FileText className="w-4 h-4" />
                    ) : (
                      <Lock className="w-4 h-4" />
                    )}
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <h2 className="text-sm sm:text-base font-bold text-white tracking-tight">
                        {combinedStep === 'terms' ? 'Terms & Security Guarantee' : 'Privacy & Anti-Hack Shield'}
                      </h2>
                      <span className="text-[10px] px-2 py-0.5 rounded-full font-bold border bg-emerald-500/20 text-emerald-300 border-emerald-500/30">
                        Step {combinedStep === 'terms' ? '1 of 2' : '2 of 2'}
                      </span>
                    </div>
                    <p className="text-[11px] text-zinc-400 line-clamp-1 hidden sm:block">
                      {combinedStep === 'terms' 
                        ? '100% Anti-Leak, Anti-Scam & Zero-Knowledge Architecture' 
                        : 'AES-256 Military Encryption & Direct P2P Isolation'}
                    </p>
                  </div>
                </div>
              </div>

              {/* Slim 2-Step Segmented Bar */}
              <div className="mt-2 sm:mt-2.5 flex items-center gap-2">
                <button
                  type="button"
                  onClick={handleBackToTerms}
                  className={`flex-1 py-1.5 px-3 rounded-lg text-xs font-bold flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
                    combinedStep === 'terms'
                      ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/50 shadow-sm'
                      : 'bg-white/5 text-zinc-400 hover:bg-white/10 hover:text-zinc-200 border border-white/5'
                  }`}
                >
                  <span>1. Terms & Security Guarantee</span>
                  {combinedStep === 'privacy' && <Check className="w-3.5 h-3.5 text-emerald-400 stroke-[3]" />}
                </button>

                <button
                  type="button"
                  onClick={handleNextToPrivacy}
                  className={`flex-1 py-1.5 px-3 rounded-lg text-xs font-bold flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
                    combinedStep === 'privacy'
                      ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/50 shadow-sm'
                      : 'bg-white/5 text-zinc-400 hover:bg-white/10 hover:text-zinc-200 border border-white/5'
                  }`}
                >
                  <span>2. Privacy Policy</span>
                </button>
              </div>
            </div>

            {/* Giant, Comfortable Scrollable Reading Content Body */}
            <div 
              ref={contentRef}
              className="flex-1 overflow-y-auto px-4 sm:px-8 py-5 sm:py-6 space-y-4 sm:space-y-6 text-zinc-200 leading-relaxed scroll-smooth"
            >
              {combinedStep === 'terms' ? (
                <div className="space-y-4 sm:space-y-5 max-w-4xl mx-auto">
                  {/* Velorix Brand Header above Terms */}
                  <div className="p-3 sm:p-4 rounded-2xl bg-zinc-950/80 border border-white/10 flex items-center justify-between gap-3 shadow-md">
                    <VelorixBrand 
                      logoUrl={logoUrl} 
                      subtitle="Official Terms & Security Guarantee • Anti-Leak & Anti-Hack Shield" 
                      size="md" 
                    />
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-500/15 text-emerald-300 border border-emerald-500/30 shrink-0">
                      100% Protected
                    </span>
                  </div>

                  {/* Highlight Box */}
                  <div className="p-4 sm:p-6 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 flex items-start gap-3 sm:gap-4 shadow-lg shadow-emerald-500/5">
                    <div className="w-9 h-9 rounded-xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center shrink-0">
                      <Lock className="w-5 h-5 text-emerald-400" />
                    </div>
                    <div className="space-y-1">
                      <h4 className="font-bold text-emerald-300 text-sm sm:text-base">COMPLETE DATA SECURITY & ZERO LEAK GUARANTEE</h4>
                      <p className="text-xs sm:text-sm text-emerald-200/90 leading-relaxed">
                        Velorix is architected on a <strong>Zero-Knowledge Decentralized Vault Framework</strong>. Your files are automatically encrypted before leaving your browser with military-grade AES-256 GCM encryption. No hacker, scammer, man-in-the-middle, or rogue node can inspect, intercept, alter, or steal your confidential transfers.
                      </p>
                    </div>
                  </div>

                  {/* Clause 1 */}
                  <div className="p-4 sm:p-5 rounded-2xl bg-white/[0.03] border border-white/10 space-y-2">
                    <h3 className="font-bold text-white flex items-center gap-2.5 text-sm sm:text-base">
                      <span className="w-6 h-6 rounded-lg bg-emerald-500/20 text-emerald-300 text-xs flex items-center justify-center font-mono font-bold shrink-0">1</span>
                      Why Your Data Cannot Leak (Direct Peer-to-Peer Isolation)
                    </h3>
                    <p className="text-xs sm:text-sm text-zinc-300 leading-relaxed">
                      In P2P mode, binary file chunks stream directly device-to-device across authenticated DTLS/SCTP WebRTC tunnels. Because files are never stored on central relay servers, server-side data breaches and mass database leaks are physically and architecturally impossible.
                    </p>
                  </div>

                  {/* Clause 2 */}
                  <div className="p-4 sm:p-5 rounded-2xl bg-white/[0.03] border border-white/10 space-y-2">
                    <h3 className="font-bold text-white flex items-center gap-2.5 text-sm sm:text-base">
                      <span className="w-6 h-6 rounded-lg bg-emerald-500/20 text-emerald-300 text-xs flex items-center justify-center font-mono font-bold shrink-0">2</span>
                      Anti-Hacking & Anti-Sniffing Shield (AES-256 + TLS 1.3)
                    </h3>
                    <p className="text-xs sm:text-sm text-zinc-300 leading-relaxed">
                      Even if an unauthorized attacker or hacker monitors public Wi-Fi networks or intercepts network packets, all payload content remains cryptographically locked with 256-bit Advanced Encryption. Attempting brute-force decryption would take billions of years, guaranteeing total immunity against eavesdropping and packet spoofing.
                    </p>
                  </div>

                  {/* Clause 3 */}
                  <div className="p-4 sm:p-5 rounded-2xl bg-white/[0.03] border border-white/10 space-y-2">
                    <h3 className="font-bold text-white flex items-center gap-2.5 text-sm sm:text-base">
                      <span className="w-6 h-6 rounded-lg bg-emerald-500/20 text-emerald-300 text-xs flex items-center justify-center font-mono font-bold shrink-0">3</span>
                      Anti-Scam & Unauthorized Access Prevention
                    </h3>
                    <p className="text-xs sm:text-sm text-zinc-300 leading-relaxed">
                      Transfers are guarded by cryptographic room seeds and ephemeral dynamic pairing keys. Third parties cannot guess, infiltrate, or hijack active rooms. You have full granular control to terminate room connections, expire links, or require password authorization.
                    </p>
                  </div>

                  {/* Clause 4 */}
                  <div className="p-4 sm:p-5 rounded-2xl bg-white/[0.03] border border-white/10 space-y-2">
                    <h3 className="font-bold text-white flex items-center gap-2.5 text-sm sm:text-base">
                      <span className="w-6 h-6 rounded-lg bg-emerald-500/20 text-emerald-300 text-xs flex items-center justify-center font-mono font-bold shrink-0">4</span>
                      Zero-Knowledge Architecture & Absolute User Privacy
                    </h3>
                    <p className="text-xs sm:text-sm text-zinc-300 leading-relaxed">
                      The platform developer and infrastructure administrators hold zero access to your file contents, private passwords, or decryption keys. What you send and receive remains strictly confidential between you and your intended recipient.
                    </p>
                  </div>

                  {/* Clause 5 */}
                  <div className="p-4 sm:p-5 rounded-2xl bg-white/[0.03] border border-white/10 space-y-2">
                    <h3 className="font-bold text-white flex items-center gap-2.5 text-sm sm:text-base">
                      <span className="w-6 h-6 rounded-lg bg-emerald-500/20 text-emerald-300 text-xs flex items-center justify-center font-mono font-bold shrink-0">5</span>
                      Full User Sovereignty & Instant Permanent Wipe
                    </h3>
                    <p className="text-xs sm:text-sm text-zinc-300 leading-relaxed">
                      You retain 100% full ownership over your files. You can delete or purge files at any time with instant memory wipe. No ghost copies, hidden tracking logs, or background backups are ever retained.
                    </p>
                  </div>
                </div>
              ) : (
                <div className="space-y-4 sm:space-y-5 max-w-4xl mx-auto">
                  {/* Velorix Brand Header above Privacy Policy */}
                  <div className="p-3 sm:p-4 rounded-2xl bg-zinc-950/80 border border-white/10 flex items-center justify-between gap-3 shadow-md">
                    <VelorixBrand 
                      logoUrl={logoUrl} 
                      subtitle="Official Privacy Policy & Data Minimization Protocol" 
                      size="md" 
                    />
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-500/15 text-emerald-300 border border-emerald-500/30 shrink-0">
                      Encrypted P2P
                    </span>
                  </div>

                  {/* Privacy Highlight Box */}
                  <div className="p-4 sm:p-6 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 flex items-start gap-3 sm:gap-4 shadow-lg shadow-emerald-500/5">
                    <div className="w-9 h-9 rounded-xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center shrink-0">
                      <EyeOff className="w-5 h-5 text-emerald-400" />
                    </div>
                    <div className="space-y-1">
                      <h4 className="font-bold text-emerald-300 text-sm sm:text-base">100% SECURE & ANTI-HACK PRIVACY POLICY</h4>
                      <p className="text-xs sm:text-sm text-emerald-200/90 leading-relaxed">
                        Velorix guarantees zero data leaks, zero scam risks, and zero hacker vulnerabilities. Your data is encrypted locally on your device with military-grade AES-256 before transmission.
                      </p>
                    </div>
                  </div>

                  {/* Clause 1 */}
                  <div className="p-4 sm:p-5 rounded-2xl bg-white/[0.03] border border-white/10 space-y-2">
                    <h3 className="font-bold text-white flex items-center gap-2.5 text-sm sm:text-base">
                      <span className="w-6 h-6 rounded-lg bg-emerald-500/20 text-emerald-300 text-xs flex items-center justify-center font-mono font-bold shrink-0">1</span>
                      Zero Data Leak Guarantee (No Central Relay Storage)
                    </h3>
                    <div className="space-y-2 text-xs sm:text-sm text-zinc-300 leading-relaxed">
                      <p>• <strong>Why leaks cannot happen:</strong> In Direct P2P Mode, your files are never uploaded to or stored on any central server database. Data streams directly from sender to receiver, making mass data leaks and database hacks impossible.</p>
                      <p>• <strong>Zero Profile Tracking:</strong> We never collect, monitor, sell, or profile your private file contents, contacts, or network data.</p>
                    </div>
                  </div>

                  {/* Clause 2 */}
                  <div className="p-4 sm:p-5 rounded-2xl bg-white/[0.03] border border-white/10 space-y-2">
                    <h3 className="font-bold text-white flex items-center gap-2.5 text-sm sm:text-base">
                      <span className="w-6 h-6 rounded-lg bg-emerald-500/20 text-emerald-300 text-xs flex items-center justify-center font-mono font-bold shrink-0">2</span>
                      Anti-Hacker & Anti-Sniffer Shield (AES-256 GCM + DTLS/TLS 1.3)
                    </h3>
                    <p className="text-xs sm:text-sm text-zinc-300 leading-relaxed">
                      Every byte transmitted across the network is protected by AES-256 GCM encryption and authenticated DTLS tunnels. Even if a hacker or malicious actor intercepts your Wi-Fi or internet connection, they only receive unreadable encrypted cipher blocks that cannot be decrypted without the recipient's private key.
                    </p>
                  </div>

                  {/* Clause 3 */}
                  <div className="p-4 sm:p-5 rounded-2xl bg-white/[0.03] border border-white/10 space-y-2">
                    <h3 className="font-bold text-white flex items-center gap-2.5 text-sm sm:text-base">
                      <span className="w-6 h-6 rounded-lg bg-emerald-500/20 text-emerald-300 text-xs flex items-center justify-center font-mono font-bold shrink-0">3</span>
                      Anti-Scam & Room Infiltration Prevention
                    </h3>
                    <p className="text-xs sm:text-sm text-zinc-300 leading-relaxed">
                      Each sharing session generates high-entropy ephemeral cryptographic room keys. Scammers cannot guess, brute-force, or hijack active rooms. Session tokens expire automatically when transfers complete.
                    </p>
                  </div>

                  {/* Clause 4 */}
                  <div className="p-4 sm:p-5 rounded-2xl bg-white/[0.03] border border-white/10 space-y-2">
                    <h3 className="font-bold text-white flex items-center gap-2.5 text-sm sm:text-base">
                      <span className="w-6 h-6 rounded-lg bg-emerald-500/20 text-emerald-300 text-xs flex items-center justify-center font-mono font-bold shrink-0">4</span>
                      Zero-Knowledge Privacy Guarantee
                    </h3>
                    <p className="text-xs sm:text-sm text-zinc-300 leading-relaxed">
                      Neither the platform developer nor third-party service providers have the keys or technical ability to read your transmitted files. Your privacy is mathematically protected by end-to-end cryptography.
                    </p>
                  </div>

                  {/* Clause 5 */}
                  <div className="p-4 sm:p-5 rounded-2xl bg-white/[0.03] border border-white/10 space-y-2">
                    <h3 className="font-bold text-white flex items-center gap-2.5 text-sm sm:text-base">
                      <span className="w-6 h-6 rounded-lg bg-emerald-500/20 text-emerald-300 text-xs flex items-center justify-center font-mono font-bold shrink-0">5</span>
                      Total User Control & Instant Permanent Wipe
                    </h3>
                    <p className="text-xs sm:text-sm text-zinc-300 leading-relaxed">
                      You maintain 100% control over all data. When you delete files or end a session, all transient cache data is instantly wiped from memory with zero ghost copies or residual backups.
                    </p>
                  </div>
                </div>
              )}
            </div>

            {/* Compact Action Footer: Sequential Automatic Next Flow */}
            <div className="px-4 sm:px-6 py-3 sm:py-3.5 border-t border-white/10 bg-zinc-950/95 shrink-0 flex flex-col sm:flex-row items-center justify-between gap-3">
              {combinedStep === 'terms' ? (
                <>
                  <label className="flex items-center gap-2.5 cursor-pointer select-none w-full sm:w-auto">
                    <input
                      type="checkbox"
                      checked={termsAccepted}
                      onChange={(e) => setTermsAccepted(e.target.checked)}
                      className="w-4 h-4 rounded bg-white/10 border-white/20 text-emerald-500 focus:ring-emerald-400 focus:ring-offset-zinc-900"
                    />
                    <span className="text-xs text-zinc-300 font-medium">
                      I agree to the <strong className="text-emerald-300">Terms & Security Guarantee</strong> (Anti-Leak & Hack-Proof Framework)
                    </span>
                  </label>

                  <button
                    id="btn-accept-terms-next"
                    disabled={!termsAccepted}
                    onClick={handleNextToPrivacy}
                    className="w-full sm:w-auto px-6 py-2.5 sm:py-3 rounded-xl bg-emerald-500 hover:bg-emerald-400 disabled:opacity-50 disabled:cursor-not-allowed text-black font-extrabold text-xs sm:text-sm transition-all flex items-center justify-center gap-2 shadow-lg shadow-emerald-500/20 cursor-pointer active:scale-95 shrink-0"
                  >
                    <span>Accept & Continue to Privacy Policy</span>
                    <ArrowRight className="w-4 h-4 stroke-[3]" />
                  </button>
                </>
              ) : (
                <>
                  <div className="flex items-center justify-between sm:justify-start gap-3 w-full sm:w-auto">
                    <button
                      type="button"
                      onClick={handleBackToTerms}
                      className="px-3 py-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-zinc-300 hover:text-white text-xs font-semibold transition-colors flex items-center gap-1.5 cursor-pointer shrink-0"
                    >
                      <ArrowLeft className="w-3.5 h-3.5" />
                      <span>Review Terms</span>
                    </button>

                    <label className="flex items-center gap-2.5 cursor-pointer select-none">
                      <input
                        type="checkbox"
                        checked={privacyAccepted}
                        onChange={(e) => setPrivacyAccepted(e.target.checked)}
                        className="w-4 h-4 rounded bg-white/10 border-white/20 text-emerald-500 focus:ring-emerald-400 focus:ring-offset-zinc-900"
                      />
                      <span className="text-xs text-zinc-300 font-medium">
                        I accept the <strong className="text-emerald-300">Privacy Policy</strong> (Zero Tracking & Encrypted P2P)
                      </span>
                    </label>
                  </div>

                  <button
                    id="btn-accept-privacy-finish"
                    disabled={!privacyAccepted}
                    onClick={handleClose}
                    className="w-full sm:w-auto px-6 py-2.5 sm:py-3 rounded-xl bg-emerald-500 hover:bg-emerald-400 disabled:opacity-50 disabled:cursor-not-allowed text-black font-extrabold text-xs sm:text-sm transition-all flex items-center justify-center gap-2 shadow-lg shadow-emerald-500/20 cursor-pointer active:scale-95 shrink-0"
                  >
                    <Check className="w-4 h-4 stroke-[3]" />
                    <span>I Understand & Enter Vault</span>
                  </button>
                </>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Standalone Terms and Conditions Modal (From Footer Link) */}
      {activeModal === 'terms' && (
        <div 
          id="modal-terms-conditions" 
          className="fixed inset-0 z-[130] flex items-center justify-center p-0 sm:p-4 md:p-6 bg-black/90 backdrop-blur-md animate-in fade-in duration-200"
          onClick={handleClose}
        >
          <div 
            className="relative w-full max-w-5xl h-full sm:h-[92vh] sm:max-h-[92vh] flex flex-col bg-zinc-900 border-0 sm:border border-white/15 rounded-none sm:rounded-3xl shadow-2xl overflow-hidden text-zinc-200"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Slim Header with Velorix Branding */}
            <div className="px-4 sm:px-6 py-2.5 sm:py-3 border-b border-white/10 bg-zinc-950/90 shrink-0">
              {/* Top Brand Bar */}
              <div className="flex items-center justify-between pb-2 mb-2 border-b border-white/10">
                <VelorixBrand 
                  logoUrl={logoUrl} 
                  subtitle="Zero-Knowledge Secure File Sharing Protocol" 
                  size="sm" 
                />
                <button
                  id="btn-close-terms"
                  onClick={handleClose}
                  className="p-1.5 sm:p-2 rounded-xl hover:bg-white/10 text-zinc-400 hover:text-white transition-colors cursor-pointer"
                  title="Close"
                >
                  <X className="w-4 h-4 sm:w-5 sm:h-5" />
                </button>
              </div>

              {/* Title */}
              <div className="flex items-center gap-2.5">
                <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center border border-emerald-500/30 shrink-0">
                  <FileText className="w-4 h-4" />
                </div>
                <div>
                  <h2 className="text-sm sm:text-base font-bold text-white tracking-wide">Terms & Security Guarantee</h2>
                  <p className="text-[11px] text-zinc-400 hidden sm:block">100% Anti-Leak, Anti-Scam & Zero-Knowledge Architecture</p>
                </div>
              </div>
            </div>

            {/* Content Body */}
            <div className="flex-1 overflow-y-auto px-4 sm:px-8 py-5 sm:py-6 space-y-4 sm:space-y-6 text-zinc-200 leading-relaxed max-w-4xl mx-auto w-full">
              {/* Velorix Brand Header above Terms */}
              <div className="p-3 sm:p-4 rounded-2xl bg-zinc-950/80 border border-white/10 flex items-center justify-between gap-3 shadow-md">
                <VelorixBrand 
                  logoUrl={logoUrl} 
                  subtitle="Official Terms & Security Guarantee • Anti-Leak & Anti-Hack Shield" 
                  size="md" 
                />
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-500/15 text-emerald-300 border border-emerald-500/30 shrink-0">
                  100% Protected
                </span>
              </div>

              {/* Highlight Box */}
              <div className="p-4 sm:p-6 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 flex items-start gap-3 sm:gap-4">
                <div className="w-9 h-9 rounded-xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center shrink-0">
                  <Lock className="w-5 h-5 text-emerald-400" />
                </div>
                <div className="space-y-1">
                  <h4 className="font-bold text-emerald-300 text-sm sm:text-base">COMPLETE DATA SECURITY & ZERO LEAK GUARANTEE</h4>
                  <p className="text-xs sm:text-sm text-emerald-200/90 leading-relaxed">
                    Velorix operates on an immutable <strong>Zero-Knowledge Peer-to-Peer & Client-Side AES-256 GCM Encryption Framework</strong>. Your files, transfers, and metadata are cryptographically sealed before transmission. No hacker, scammer, man-in-the-middle attacker, or rogue entity can intercept, decode, or leak your data.
                  </p>
                </div>
              </div>

              {/* Clause 1 */}
              <div className="p-4 sm:p-5 rounded-2xl bg-white/[0.03] border border-white/10 space-y-2">
                <h3 className="font-bold text-white flex items-center gap-2.5 text-sm sm:text-base">
                  <span className="w-6 h-6 rounded-lg bg-emerald-500/20 text-emerald-300 text-xs flex items-center justify-center font-mono font-bold shrink-0">1</span>
                  Why Your Data Cannot Leak (Direct Peer-to-Peer Isolation)
                </h3>
                <p className="text-xs sm:text-sm text-zinc-300 leading-relaxed">
                  During direct P2P transfers, raw data streams point-to-point directly between sending and receiving browser instances via authenticated WebRTC DTLS tunnels. The payload is never cached, stored, or indexed on central servers, making central data breaches and massive database leaks physically impossible.
                </p>
              </div>

              {/* Clause 2 */}
              <div className="p-4 sm:p-5 rounded-2xl bg-white/[0.03] border border-white/10 space-y-2">
                <h3 className="font-bold text-white flex items-center gap-2.5 text-sm sm:text-base">
                  <span className="w-6 h-6 rounded-lg bg-emerald-500/20 text-emerald-300 text-xs flex items-center justify-center font-mono font-bold shrink-0">2</span>
                  Anti-Hacking & Anti-Sniffing Defense (AES-256 + End-to-End Cryptography)
                </h3>
                <p className="text-xs sm:text-sm text-zinc-300 leading-relaxed">
                  Even on insecure public Wi-Fi or compromised internet providers, network eavesdroppers only see encrypted noise. AES-256 GCM guarantees cryptographic integrity—any tampered or injected packets are immediately rejected by the browser client.
                </p>
              </div>

              {/* Clause 3 */}
              <div className="p-4 sm:p-5 rounded-2xl bg-white/[0.03] border border-white/10 space-y-2">
                <h3 className="font-bold text-white flex items-center gap-2.5 text-sm sm:text-base">
                  <span className="w-6 h-6 rounded-lg bg-emerald-500/20 text-emerald-300 text-xs flex items-center justify-center font-mono font-bold shrink-0">3</span>
                  Anti-Scam & Unauthorized Infiltration Protection
                </h3>
                <p className="text-xs sm:text-sm text-zinc-300 leading-relaxed">
                  Transfers are protected by unique cryptographic room identifiers and dynamic key negotiations. Unauthorized third parties cannot hijack sessions or guess active transmission channels.
                </p>
              </div>

              {/* Clause 4 */}
              <div className="p-4 sm:p-5 rounded-2xl bg-white/[0.03] border border-white/10 space-y-2">
                <h3 className="font-bold text-white flex items-center gap-2.5 text-sm sm:text-base">
                  <span className="w-6 h-6 rounded-lg bg-emerald-500/20 text-emerald-300 text-xs flex items-center justify-center font-mono font-bold shrink-0">4</span>
                  Zero-Knowledge & Zero Operator Access
                </h3>
                <p className="text-xs sm:text-sm text-zinc-300 leading-relaxed">
                  Neither platform administrators nor automated server processes possess encryption keys or viewing capabilities for your stored or shared files. Your content remains strictly private between participating peers.
                </p>
              </div>

              {/* Clause 5 */}
              <div className="p-4 sm:p-5 rounded-2xl bg-white/[0.03] border border-white/10 space-y-2">
                <h3 className="font-bold text-white flex items-center gap-2.5 text-sm sm:text-base">
                  <span className="w-6 h-6 rounded-lg bg-emerald-500/20 text-emerald-300 text-xs flex items-center justify-center font-mono font-bold shrink-0">5</span>
                  User Control & Instant Permanent Erase
                </h3>
                <p className="text-xs sm:text-sm text-zinc-300 leading-relaxed">
                  You maintain 100% ownership over your files. Deletion is instantaneous and permanent with zero retention or hidden archival traces.
                </p>
              </div>
            </div>

            {/* Footer */}
            <div className="px-4 sm:px-6 py-3 border-t border-white/10 bg-zinc-950/90 shrink-0 flex items-center justify-between">
              <span className="text-xs text-zinc-500">Effective Date: September 2026</span>
              <button
                id="btn-agree-terms"
                onClick={handleClose}
                className="px-5 py-2 sm:py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-black font-bold text-xs sm:text-sm transition-colors flex items-center gap-1.5 cursor-pointer"
              >
                <Check className="w-4 h-4 stroke-[3]" />
                <span>I Understand & Accept Terms</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Standalone Privacy Policy Modal (From Footer Link) */}
      {activeModal === 'privacy' && (
        <div 
          id="modal-privacy-policy" 
          className="fixed inset-0 z-[130] flex items-center justify-center p-0 sm:p-4 md:p-6 bg-black/90 backdrop-blur-md animate-in fade-in duration-200"
          onClick={handleClose}
        >
          <div 
            className="relative w-full max-w-5xl h-full sm:h-[92vh] sm:max-h-[92vh] flex flex-col bg-zinc-900 border-0 sm:border border-white/15 rounded-none sm:rounded-3xl shadow-2xl overflow-hidden text-zinc-200"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Slim Header with Velorix Branding */}
            <div className="px-4 sm:px-6 py-2.5 sm:py-3 border-b border-white/10 bg-zinc-950/90 shrink-0">
              {/* Top Brand Bar */}
              <div className="flex items-center justify-between pb-2 mb-2 border-b border-white/10">
                <VelorixBrand 
                  logoUrl={logoUrl} 
                  subtitle="Zero-Knowledge Secure File Sharing Protocol" 
                  size="sm" 
                />
                <button
                  id="btn-close-privacy"
                  onClick={handleClose}
                  className="p-1.5 sm:p-2 rounded-xl hover:bg-white/10 text-zinc-400 hover:text-white transition-colors cursor-pointer"
                  title="Close"
                >
                  <X className="w-4 h-4 sm:w-5 sm:h-5" />
                </button>
              </div>

              {/* Title */}
              <div className="flex items-center gap-2.5">
                <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center border border-emerald-500/30 shrink-0">
                  <Lock className="w-4 h-4" />
                </div>
                <div>
                  <h2 className="text-sm sm:text-base font-bold text-white tracking-wide">Privacy Policy</h2>
                  <p className="text-[11px] text-zinc-400 hidden sm:block">Zero Data Tracking & P2P Architecture</p>
                </div>
              </div>
            </div>

            {/* Content Body */}
            <div className="flex-1 overflow-y-auto px-4 sm:px-8 py-5 sm:py-6 space-y-4 sm:space-y-6 text-zinc-200 leading-relaxed max-w-4xl mx-auto w-full">
              {/* Velorix Brand Header above Privacy Policy */}
              <div className="p-3 sm:p-4 rounded-2xl bg-zinc-950/80 border border-white/10 flex items-center justify-between gap-3 shadow-md">
                <VelorixBrand 
                  logoUrl={logoUrl} 
                  subtitle="Official Privacy Policy & Data Minimization Protocol" 
                  size="md" 
                />
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-500/15 text-emerald-300 border border-emerald-500/30 shrink-0">
                  Encrypted P2P
                </span>
              </div>

              {/* Highlight Box */}
              <div className="p-4 sm:p-6 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 flex items-start gap-3 sm:gap-4">
                <div className="w-9 h-9 rounded-xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center shrink-0">
                  <EyeOff className="w-5 h-5 text-emerald-400" />
                </div>
                <div className="space-y-1">
                  <h4 className="font-bold text-emerald-300 text-sm sm:text-base">100% SECURE & ANTI-HACK PRIVACY POLICY</h4>
                  <p className="text-xs sm:text-sm text-emerald-200/90 leading-relaxed">
                    Velorix ensures zero data leaks, zero scam risks, and zero hacker vulnerabilities. Your data is encrypted locally on your device with military-grade AES-256 before any transmission.
                  </p>
                </div>
              </div>

              {/* Clause 1 */}
              <div className="p-4 sm:p-5 rounded-2xl bg-white/[0.03] border border-white/10 space-y-2">
                <h3 className="font-bold text-white flex items-center gap-2.5 text-sm sm:text-base">
                  <span className="w-6 h-6 rounded-lg bg-emerald-500/20 text-emerald-300 text-xs flex items-center justify-center font-mono font-bold shrink-0">1</span>
                  Zero Data Leak Guarantee (No Central Relay Storage)
                </h3>
                <div className="space-y-2 text-xs sm:text-sm text-zinc-300 leading-relaxed">
                  <p>• <strong>Why leaks cannot happen:</strong> In Direct P2P Mode, your files are never uploaded to or stored on any central server database. Data streams directly from sender to receiver, making mass data leaks and database hacks impossible.</p>
                  <p>• <strong>Zero Profile Tracking:</strong> We never collect, monitor, sell, or profile your private file contents, contacts, or network data.</p>
                </div>
              </div>

              {/* Clause 2 */}
              <div className="p-4 sm:p-5 rounded-2xl bg-white/[0.03] border border-white/10 space-y-2">
                <h3 className="font-bold text-white flex items-center gap-2.5 text-sm sm:text-base">
                  <span className="w-6 h-6 rounded-lg bg-emerald-500/20 text-emerald-300 text-xs flex items-center justify-center font-mono font-bold shrink-0">2</span>
                  Anti-Hacker & Anti-Sniffer Shield (AES-256 GCM + DTLS/TLS 1.3)
                </h3>
                <p className="text-xs sm:text-sm text-zinc-300 leading-relaxed">
                  Every byte transmitted across the network is protected by AES-256 GCM encryption and authenticated DTLS tunnels. Even if a hacker or malicious actor intercepts your Wi-Fi or internet connection, they only receive unreadable encrypted cipher blocks that cannot be decrypted without the recipient's private key.
                </p>
              </div>

              {/* Clause 3 */}
              <div className="p-4 sm:p-5 rounded-2xl bg-white/[0.03] border border-white/10 space-y-2">
                <h3 className="font-bold text-white flex items-center gap-2.5 text-sm sm:text-base">
                  <span className="w-6 h-6 rounded-lg bg-emerald-500/20 text-emerald-300 text-xs flex items-center justify-center font-mono font-bold shrink-0">3</span>
                  Anti-Scam & Room Infiltration Prevention
                </h3>
                <p className="text-xs sm:text-sm text-zinc-300 leading-relaxed">
                  Each sharing session generates high-entropy ephemeral cryptographic room keys. Scammers cannot guess, brute-force, or hijack active rooms. Session tokens expire automatically when transfers complete.
                </p>
              </div>

              {/* Clause 4 */}
              <div className="p-4 sm:p-5 rounded-2xl bg-white/[0.03] border border-white/10 space-y-2">
                <h3 className="font-bold text-white flex items-center gap-2.5 text-sm sm:text-base">
                  <span className="w-6 h-6 rounded-lg bg-emerald-500/20 text-emerald-300 text-xs flex items-center justify-center font-mono font-bold shrink-0">4</span>
                  Zero-Knowledge Privacy Guarantee
                </h3>
                <p className="text-xs sm:text-sm text-zinc-300 leading-relaxed">
                  Neither the platform developer nor third-party service providers have the keys or technical ability to read your transmitted files. Your privacy is mathematically protected by end-to-end cryptography.
                </p>
              </div>

              {/* Clause 5 */}
              <div className="p-4 sm:p-5 rounded-2xl bg-white/[0.03] border border-white/10 space-y-2">
                <h3 className="font-bold text-white flex items-center gap-2.5 text-sm sm:text-base">
                  <span className="w-6 h-6 rounded-lg bg-emerald-500/20 text-emerald-300 text-xs flex items-center justify-center font-mono font-bold shrink-0">5</span>
                  Total User Control & Instant Permanent Wipe
                </h3>
                <p className="text-xs sm:text-sm text-zinc-300 leading-relaxed">
                  You maintain 100% control over all data. When you delete files or end a session, all transient cache data is instantly wiped from memory with zero ghost copies or residual backups.
                </p>
              </div>
            </div>

            {/* Footer */}
            <div className="px-4 sm:px-6 py-3 border-t border-white/10 bg-zinc-950/90 shrink-0 flex items-center justify-between">
              <span className="text-xs text-zinc-500">Last Revised: September 2026</span>
              <button
                id="btn-close-privacy-ack"
                onClick={handleClose}
                className="px-5 py-2 sm:py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-black font-bold text-xs sm:text-sm transition-colors flex items-center gap-1.5 cursor-pointer"
              >
                <Check className="w-4 h-4 stroke-[3]" />
                <span>Understood & Accept Policy</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
