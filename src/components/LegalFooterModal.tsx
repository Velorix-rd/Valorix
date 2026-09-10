import React, { useState, useEffect, useRef } from 'react';
import { FileText, Lock, AlertTriangle, Check, X, ShieldAlert, EyeOff, ArrowRight, ArrowLeft, Share2 } from 'lucide-react';

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
            <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-amber-500/10 border border-amber-500/20 text-amber-300 font-medium">
              <ShieldAlert className="w-3.5 h-3.5" />
              <span>Zero-Liability Platform</span>
            </div>
            <span>End-to-End P2P & Ephemeral Transfer Protocol</span>
          </div>

          <div className="flex flex-wrap items-center gap-4 text-zinc-300">
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
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 mt-3 text-[11px] text-zinc-500 text-center md:text-left">
          Disclaimer: This application provides encrypted peer-to-peer data transport. Users are solely responsible for all transmitted files, content, and local retention. The developer holds ZERO liability for any malware, viruses, illegal sharing, confidential data leaks, or data compromise. By using this platform, you agree that the developer is not responsible or liable for any damages.
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
                  <div className={`w-7 h-7 sm:w-8 sm:h-8 rounded-xl flex items-center justify-center border shrink-0 transition-colors ${
                    combinedStep === 'terms' 
                      ? 'bg-amber-500/20 text-amber-400 border-amber-500/40' 
                      : 'bg-emerald-500/20 text-emerald-400 border-emerald-500/40'
                  }`}>
                    {combinedStep === 'terms' ? (
                      <FileText className="w-4 h-4" />
                    ) : (
                      <Lock className="w-4 h-4" />
                    )}
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <h2 className="text-sm sm:text-base font-bold text-white tracking-tight">
                        {combinedStep === 'terms' ? 'Terms & Conditions' : 'Privacy Policy'}
                      </h2>
                      <span className={`text-[10px] px-2 py-0.5 rounded-full font-bold border ${
                        combinedStep === 'terms' 
                          ? 'bg-amber-500/20 text-amber-300 border-amber-500/30' 
                          : 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30'
                      }`}>
                        Step {combinedStep === 'terms' ? '1 of 2' : '2 of 2'}
                      </span>
                    </div>
                    <p className="text-[11px] text-zinc-400 line-clamp-1 hidden sm:block">
                      {combinedStep === 'terms' 
                        ? 'Zero-liability platform disclaimer & user accountability rules' 
                        : 'Zero data tracking & encrypted peer-to-peer transport'}
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
                      ? 'bg-amber-500/20 text-amber-300 border border-amber-500/50 shadow-sm'
                      : 'bg-white/5 text-zinc-400 hover:bg-white/10 hover:text-zinc-200 border border-white/5'
                  }`}
                >
                  <span>1. Terms & Conditions</span>
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
                      subtitle="Official Terms & Conditions Agreement • Zero-Liability Policy" 
                      size="md" 
                    />
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-amber-500/15 text-amber-300 border border-amber-500/30 shrink-0">
                      Zero Liability
                    </span>
                  </div>

                  {/* Highlight Box */}
                  <div className="p-4 sm:p-6 rounded-2xl bg-amber-500/10 border border-amber-500/30 flex items-start gap-3 sm:gap-4 shadow-lg shadow-amber-500/5">
                    <div className="w-9 h-9 rounded-xl bg-amber-500/20 text-amber-400 flex items-center justify-center shrink-0">
                      <AlertTriangle className="w-5 h-5 text-amber-400" />
                    </div>
                    <div className="space-y-1">
                      <h4 className="font-bold text-amber-300 text-sm sm:text-base">CRITICAL DISCLAIMER: ZERO LIABILITY POLICY</h4>
                      <p className="text-xs sm:text-sm text-amber-200/90 leading-relaxed">
                        By using this platform, you explicitly acknowledge and agree that the developer assumes <strong>ZERO legal, financial, or technical liability</strong> for any data loss, confidential file leak, unauthorized interception, data corruption, or unintended exposure of your files. The developer is NOT responsible if any malware, virus, or illegal content is shared using this platform.
                      </p>
                    </div>
                  </div>

                  {/* Clause 1 */}
                  <div className="p-4 sm:p-5 rounded-2xl bg-white/[0.03] border border-white/10 space-y-2">
                    <h3 className="font-bold text-white flex items-center gap-2.5 text-sm sm:text-base">
                      <span className="w-6 h-6 rounded-lg bg-amber-500/20 text-amber-300 text-xs flex items-center justify-center font-mono font-bold shrink-0">1</span>
                      Zero Responsibility for Data Leaks, Exposures, or Interceptions
                    </h3>
                    <p className="text-xs sm:text-sm text-zinc-300 leading-relaxed">
                      Any file sent, shared, or received via this platform that is leaked, disclosed, intercepted, or accessed by unintended third parties—whether due to shared room links, dynamic PIN codes, public local networks, user misconfiguration, or external interference—is entirely at the user's sole discretion and risk. We maintain an absolute zero-liability stance regarding content confidentiality, transfer privacy, and dissemination.
                    </p>
                  </div>

                  {/* Clause 2 */}
                  <div className="p-4 sm:p-5 rounded-2xl bg-white/[0.03] border border-white/10 space-y-2">
                    <h3 className="font-bold text-white flex items-center gap-2.5 text-sm sm:text-base">
                      <span className="w-6 h-6 rounded-lg bg-amber-500/20 text-amber-300 text-xs flex items-center justify-center font-mono font-bold shrink-0">2</span>
                      User Conduct & Prohibited Content
                    </h3>
                    <p className="text-xs sm:text-sm text-zinc-300 leading-relaxed">
                      Users strictly agree not to transmit, store, or share any unlawful, copyright-infringing, defamatory, malicious, or harmful files, including malware, ransomware, computer viruses, Trojan horses, or illegal materials. Both the sending and receiving parties bear sole legal accountability and criminal liability for the files they transport.
                    </p>
                  </div>

                  {/* Clause 3 */}
                  <div className="p-4 sm:p-5 rounded-2xl bg-white/[0.03] border border-white/10 space-y-2">
                    <h3 className="font-bold text-white flex items-center gap-2.5 text-sm sm:text-base">
                      <span className="w-6 h-6 rounded-lg bg-amber-500/20 text-amber-300 text-xs flex items-center justify-center font-mono font-bold shrink-0">3</span>
                      Peer-to-Peer (P2P) Direct Transport Architecture
                    </h3>
                    <p className="text-xs sm:text-sm text-zinc-300 leading-relaxed">
                      In offline and direct transfer modes, files are transmitted directly between peers using browser WebRTC data channels. Binary data streams directly between devices without permanent retention on central relay servers. Once a session is closed or disrupted, uncompleted or terminated data transfers cannot be restored, recovered, or retrieved from the platform.
                    </p>
                  </div>

                  {/* Clause 4 */}
                  <div className="p-4 sm:p-5 rounded-2xl bg-white/[0.03] border border-white/10 space-y-2">
                    <h3 className="font-bold text-white flex items-center gap-2.5 text-sm sm:text-base">
                      <span className="w-6 h-6 rounded-lg bg-amber-500/20 text-amber-300 text-xs flex items-center justify-center font-mono font-bold shrink-0">4</span>
                      No Permanent Storage Guarantee
                    </h3>
                    <p className="text-xs sm:text-sm text-zinc-300 leading-relaxed">
                      Maintaining independent local backups of all important files is the sole responsibility of the user. Any temporary cloud staging, cache buffers, or transient logs may be expunged, rotated, or purged at any time during routine server maintenance or capacity management without prior notice.
                    </p>
                  </div>

                  {/* Clause 5 */}
                  <div className="p-4 sm:p-5 rounded-2xl bg-white/[0.03] border border-white/10 space-y-2">
                    <h3 className="font-bold text-white flex items-center gap-2.5 text-sm sm:text-base">
                      <span className="w-6 h-6 rounded-lg bg-amber-500/20 text-amber-300 text-xs flex items-center justify-center font-mono font-bold shrink-0">5</span>
                      Unconditional Acceptance of Terms
                    </h3>
                    <p className="text-xs sm:text-sm text-zinc-300 leading-relaxed">
                      Whether accessing the platform through a Guest session or via a registered authenticated account (Google, Email, Social), your continued use of any feature constitutes unconditional, legally binding acceptance of all stated terms and zero-liability limitations.
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
                      <h4 className="font-bold text-emerald-300 text-sm sm:text-base">PRIVACY FIRST & ZERO DATA TRACKING ARCHITECTURE</h4>
                      <p className="text-xs sm:text-sm text-emerald-200/90 leading-relaxed">
                        We do not monitor, profile, sell, or disclose your personal browsing data, network traffic, or transmitted file contents to any third-party advertisers, data aggregators, or external brokers.
                      </p>
                    </div>
                  </div>

                  {/* Clause 1 */}
                  <div className="p-4 sm:p-5 rounded-2xl bg-white/[0.03] border border-white/10 space-y-2">
                    <h3 className="font-bold text-white flex items-center gap-2.5 text-sm sm:text-base">
                      <span className="w-6 h-6 rounded-lg bg-emerald-500/20 text-emerald-300 text-xs flex items-center justify-center font-mono font-bold shrink-0">1</span>
                      Information We Collect & Process
                    </h3>
                    <div className="space-y-2 text-xs sm:text-sm text-zinc-300 leading-relaxed">
                      <p>• <strong>Guest Mode:</strong> We never collect your real name, phone number, physical address, or email address. Connections use randomized ephemeral session room identifiers that are expunged once the transfer session concludes.</p>
                      <p>• <strong>Authenticated Accounts:</strong> Only your verified email address and Firebase Authentication user ID (UID) are stored to authorize your account and manage your allocated 20GB cloud storage capacity.</p>
                    </div>
                  </div>

                  {/* Clause 2 */}
                  <div className="p-4 sm:p-5 rounded-2xl bg-white/[0.03] border border-white/10 space-y-2">
                    <h3 className="font-bold text-white flex items-center gap-2.5 text-sm sm:text-base">
                      <span className="w-6 h-6 rounded-lg bg-emerald-500/20 text-emerald-300 text-xs flex items-center justify-center font-mono font-bold shrink-0">2</span>
                      Peer-to-Peer Encrypted Data Transport
                    </h3>
                    <p className="text-xs sm:text-sm text-zinc-300 leading-relaxed">
                      When utilizing Offline P2P Share mode, file data streams directly between peer browsers via authenticated DTLS/SCTP WebRTC channels. The binary content of your files never passes through or gets saved to our backend servers.
                    </p>
                  </div>

                  {/* Clause 3 */}
                  <div className="p-4 sm:p-5 rounded-2xl bg-white/[0.03] border border-white/10 space-y-2">
                    <h3 className="font-bold text-white flex items-center gap-2.5 text-sm sm:text-base">
                      <span className="w-6 h-6 rounded-lg bg-emerald-500/20 text-emerald-300 text-xs flex items-center justify-center font-mono font-bold shrink-0">3</span>
                      Cookies & Local Browser Storage
                    </h3>
                    <p className="text-xs sm:text-sm text-zinc-300 leading-relaxed">
                      This application does not deploy cross-site tracking cookies or advertising beacons. Local and session storage in your browser are strictly utilized for operational state, interface theme preferences, and active signaling room codes.
                    </p>
                  </div>

                  {/* Clause 4 */}
                  <div className="p-4 sm:p-5 rounded-2xl bg-white/[0.03] border border-white/10 space-y-2">
                    <h3 className="font-bold text-white flex items-center gap-2.5 text-sm sm:text-base">
                      <span className="w-6 h-6 rounded-lg bg-emerald-500/20 text-emerald-300 text-xs flex items-center justify-center font-mono font-bold shrink-0">4</span>
                      Infrastructure & Security Framework
                    </h3>
                    <p className="text-xs sm:text-sm text-zinc-300 leading-relaxed">
                      User authentication is securely managed via Google Firebase Authentication. Network NAT traversal relies on standard Google Public STUN servers to assist peer devices in establishing direct peer connections across firewalls without proxying payload contents.
                    </p>
                  </div>

                  {/* Clause 5 */}
                  <div className="p-4 sm:p-5 rounded-2xl bg-white/[0.03] border border-white/10 space-y-2">
                    <h3 className="font-bold text-white flex items-center gap-2.5 text-sm sm:text-base">
                      <span className="w-6 h-6 rounded-lg bg-emerald-500/20 text-emerald-300 text-xs flex items-center justify-center font-mono font-bold shrink-0">5</span>
                      User Rights & Immediate Permanent Deletion
                    </h3>
                    <p className="text-xs sm:text-sm text-zinc-300 leading-relaxed">
                      You maintain full sovereignty over your files. At any time, you can permanently delete your uploaded files directly from the dashboard; corresponding metadata and server-stored file assets are purged immediately without retention.
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
                      className="w-4 h-4 rounded bg-white/10 border-white/20 text-amber-500 focus:ring-amber-400 focus:ring-offset-zinc-900"
                    />
                    <span className="text-xs text-zinc-300 font-medium">
                      I agree to the <strong className="text-amber-300">Terms & Conditions</strong> (Zero-Liability Platform Agreement)
                    </span>
                  </label>

                  <button
                    id="btn-accept-terms-next"
                    disabled={!termsAccepted}
                    onClick={handleNextToPrivacy}
                    className="w-full sm:w-auto px-6 py-2.5 sm:py-3 rounded-xl bg-amber-500 hover:bg-amber-400 disabled:opacity-50 disabled:cursor-not-allowed text-black font-extrabold text-xs sm:text-sm transition-all flex items-center justify-center gap-2 shadow-lg shadow-amber-500/20 cursor-pointer active:scale-95 shrink-0"
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
                <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-xl bg-amber-500/20 text-amber-400 flex items-center justify-center border border-amber-500/30 shrink-0">
                  <FileText className="w-4 h-4" />
                </div>
                <div>
                  <h2 className="text-sm sm:text-base font-bold text-white tracking-wide">Terms & Conditions</h2>
                  <p className="text-[11px] text-zinc-400 hidden sm:block">Zero-Liability & User Accountability Agreement</p>
                </div>
              </div>
            </div>

            {/* Content Body */}
            <div className="flex-1 overflow-y-auto px-4 sm:px-8 py-5 sm:py-6 space-y-4 sm:space-y-6 text-zinc-200 leading-relaxed max-w-4xl mx-auto w-full">
              {/* Velorix Brand Header above Terms */}
              <div className="p-3 sm:p-4 rounded-2xl bg-zinc-950/80 border border-white/10 flex items-center justify-between gap-3 shadow-md">
                <VelorixBrand 
                  logoUrl={logoUrl} 
                  subtitle="Official Terms & Conditions Agreement • Zero-Liability Policy" 
                  size="md" 
                />
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-amber-500/15 text-amber-300 border border-amber-500/30 shrink-0">
                  Zero Liability
                </span>
              </div>

              {/* Highlight Box */}
              <div className="p-4 sm:p-6 rounded-2xl bg-amber-500/10 border border-amber-500/30 flex items-start gap-3 sm:gap-4">
                <div className="w-9 h-9 rounded-xl bg-amber-500/20 text-amber-400 flex items-center justify-center shrink-0">
                  <AlertTriangle className="w-5 h-5 text-amber-400" />
                </div>
                <div className="space-y-1">
                  <h4 className="font-bold text-amber-300 text-sm sm:text-base">CRITICAL DISCLAIMER: ZERO LIABILITY</h4>
                  <p className="text-xs sm:text-sm text-amber-200/90 leading-relaxed">
                    By using this platform, you explicitly acknowledge and agree that the developer assumes <strong>ZERO</strong> legal, financial, or technical liability for any data loss, confidential file leak, interception, corruption, or unintended exposure. The developer takes no responsibility for any malware, virus, or illegal file sharing activities.
                  </p>
                </div>
              </div>

              {/* Clause 1 */}
              <div className="p-4 sm:p-5 rounded-2xl bg-white/[0.03] border border-white/10 space-y-2">
                <h3 className="font-bold text-white flex items-center gap-2.5 text-sm sm:text-base">
                  <span className="w-6 h-6 rounded-lg bg-amber-500/20 text-amber-300 text-xs flex items-center justify-center font-mono font-bold shrink-0">1</span>
                  Zero Responsibility for Data Leaks or Compromise
                </h3>
                <p className="text-xs sm:text-sm text-zinc-300 leading-relaxed">
                  Any file sent or received via this service that is leaked, disclosed, intercepted, or accessed by unintended third parties—whether due to public room links, shared access codes, unencrypted local networks, or third-party interference—is entirely at the user's sole discretion and risk. We maintain an absolute zero-liability stance regarding content confidentiality and dissemination.
                </p>
              </div>

              {/* Clause 2 */}
              <div className="p-4 sm:p-5 rounded-2xl bg-white/[0.03] border border-white/10 space-y-2">
                <h3 className="font-bold text-white flex items-center gap-2.5 text-sm sm:text-base">
                  <span className="w-6 h-6 rounded-lg bg-amber-500/20 text-amber-300 text-xs flex items-center justify-center font-mono font-bold shrink-0">2</span>
                  User Conduct & Prohibited Content
                </h3>
                <p className="text-xs sm:text-sm text-zinc-300 leading-relaxed">
                  Users strictly agree not to transmit any unlawful, copyright-infringing, defamatory, malicious, or harmful files, including malware, ransomware, viruses, or illegal materials. Both the sending and receiving parties bear sole legal accountability for the content they choose to transport.
                </p>
              </div>

              {/* Clause 3 */}
              <div className="p-4 sm:p-5 rounded-2xl bg-white/[0.03] border border-white/10 space-y-2">
                <h3 className="font-bold text-white flex items-center gap-2.5 text-sm sm:text-base">
                  <span className="w-6 h-6 rounded-lg bg-amber-500/20 text-amber-300 text-xs flex items-center justify-center font-mono font-bold shrink-0">3</span>
                  Peer-to-Peer (P2P) Direct Transport Architecture
                </h3>
                <p className="text-xs sm:text-sm text-zinc-300 leading-relaxed">
                  In offline and direct transfer modes, files are transmitted directly between peers using standard WebRTC data channels. Data streams directly from device to device without persistent storage on central relay servers. Once a session is closed or disrupted, uncompleted or terminated data transfers cannot be restored or recovered from the platform.
                </p>
              </div>

              {/* Clause 4 */}
              <div className="p-4 sm:p-5 rounded-2xl bg-white/[0.03] border border-white/10 space-y-2">
                <h3 className="font-bold text-white flex items-center gap-2.5 text-sm sm:text-base">
                  <span className="w-6 h-6 rounded-lg bg-amber-500/20 text-amber-300 text-xs flex items-center justify-center font-mono font-bold shrink-0">4</span>
                  No Permanent Storage Guarantee
                </h3>
                <p className="text-xs sm:text-sm text-zinc-300 leading-relaxed">
                  Maintaining regular, independent local backups of all important files is the sole responsibility of the user. Any temporary cloud staging, cache buffers, or transient logs may be expunged, rotated, or purged at any time during routine server maintenance or capacity management without prior notice.
                </p>
              </div>

              {/* Clause 5 */}
              <div className="p-4 sm:p-5 rounded-2xl bg-white/[0.03] border border-white/10 space-y-2">
                <h3 className="font-bold text-white flex items-center gap-2.5 text-sm sm:text-base">
                  <span className="w-6 h-6 rounded-lg bg-amber-500/20 text-amber-300 text-xs flex items-center justify-center font-mono font-bold shrink-0">5</span>
                  Unconditional Acceptance of Terms
                </h3>
                <p className="text-xs sm:text-sm text-zinc-300 leading-relaxed">
                  Whether accessing the platform as a Guest session or via a registered authenticated account, your continued use of any feature constitutes unconditional, legally binding acceptance of all stated terms and liability limitations.
                </p>
              </div>
            </div>

            {/* Footer */}
            <div className="px-4 sm:px-6 py-3 border-t border-white/10 bg-zinc-950/90 shrink-0 flex items-center justify-between">
              <span className="text-xs text-zinc-500">Effective Date: September 2026</span>
              <button
                id="btn-agree-terms"
                onClick={handleClose}
                className="px-5 py-2 sm:py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-black font-bold text-xs sm:text-sm transition-colors flex items-center gap-1.5 cursor-pointer"
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
                  <h4 className="font-bold text-emerald-300 text-sm sm:text-base">PRIVACY FIRST & ZERO DATA TRACKING</h4>
                  <p className="text-xs sm:text-sm text-emerald-200/90 leading-relaxed">
                    We do not monitor, profile, sell, or disclose your personal browsing data, network traffic, or transmitted file contents to any third-party advertisers or external brokers.
                  </p>
                </div>
              </div>

              {/* Clause 1 */}
              <div className="p-4 sm:p-5 rounded-2xl bg-white/[0.03] border border-white/10 space-y-2">
                <h3 className="font-bold text-white flex items-center gap-2.5 text-sm sm:text-base">
                  <span className="w-6 h-6 rounded-lg bg-emerald-500/20 text-emerald-300 text-xs flex items-center justify-center font-mono font-bold shrink-0">1</span>
                  Information We Collect
                </h3>
                <div className="space-y-2 text-xs sm:text-sm text-zinc-300 leading-relaxed">
                  <p>• <strong>Guest Mode:</strong> We never collect your name, phone number, or email address. Connections use randomized ephemeral room identifiers that are expunged once the transfer session concludes.</p>
                  <p>• <strong>Authenticated Accounts:</strong> Only your verified email address and Firebase Authentication user ID (UID) are stored to authorize your account and manage your allocated 20GB cloud storage capacity.</p>
                </div>
              </div>

              {/* Clause 2 */}
              <div className="p-4 sm:p-5 rounded-2xl bg-white/[0.03] border border-white/10 space-y-2">
                <h3 className="font-bold text-white flex items-center gap-2.5 text-sm sm:text-base">
                  <span className="w-6 h-6 rounded-lg bg-emerald-500/20 text-emerald-300 text-xs flex items-center justify-center font-mono font-bold shrink-0">2</span>
                  Peer-to-Peer Encrypted Data Transport
                </h3>
                <p className="text-xs sm:text-sm text-zinc-300 leading-relaxed">
                  When utilizing Offline P2P Share mode, file data streams directly between peer browsers via authenticated DTLS/SCTP channels. The binary content of your files never passes through or gets saved to our backend storage servers.
                </p>
              </div>

              {/* Clause 3 */}
              <div className="p-4 sm:p-5 rounded-2xl bg-white/[0.03] border border-white/10 space-y-2">
                <h3 className="font-bold text-white flex items-center gap-2.5 text-sm sm:text-base">
                  <span className="w-6 h-6 rounded-lg bg-emerald-500/20 text-emerald-300 text-xs flex items-center justify-center font-mono font-bold shrink-0">3</span>
                  Cookies & Local Browser Storage
                </h3>
                <p className="text-xs sm:text-sm text-zinc-300 leading-relaxed">
                  This application does not deploy cross-site tracking cookies or intrusive analytics beacons. Local and session storage in your browser are strictly utilized for operational state, interface theme preferences, and active signaling room codes.
                </p>
              </div>

              {/* Clause 4 */}
              <div className="p-4 sm:p-5 rounded-2xl bg-white/[0.03] border border-white/10 space-y-2">
                <h3 className="font-bold text-white flex items-center gap-2.5 text-sm sm:text-base">
                  <span className="w-6 h-6 rounded-lg bg-emerald-500/20 text-emerald-300 text-xs flex items-center justify-center font-mono font-bold shrink-0">4</span>
                  Third-Party Infrastructure
                </h3>
                <p className="text-xs sm:text-sm text-zinc-300 leading-relaxed">
                  Authentication is managed via Google Firebase Authentication. Network NAT traversal relies on standard Google Public STUN servers to assist peer devices in establishing direct connections across firewalls without proxying payload contents.
                </p>
              </div>

              {/* Clause 5 */}
              <div className="p-4 sm:p-5 rounded-2xl bg-white/[0.03] border border-white/10 space-y-2">
                <h3 className="font-bold text-white flex items-center gap-2.5 text-sm sm:text-base">
                  <span className="w-6 h-6 rounded-lg bg-emerald-500/20 text-emerald-300 text-xs flex items-center justify-center font-mono font-bold shrink-0">5</span>
                  User Rights & Immediate Deletion
                </h3>
                <p className="text-xs sm:text-sm text-zinc-300 leading-relaxed">
                  You maintain full sovereignty over your files. At any time, you can permanently delete your uploaded files directly from the dashboard; corresponding metadata and server-stored file assets are purged immediately without retention.
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
