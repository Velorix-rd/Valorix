import React, { useState } from 'react';
import { 
  Zap, 
  WifiOff, 
  Lock, 
  Sparkles, 
  Cloud, 
  ChevronDown, 
  ChevronUp, 
  Smartphone,
  Flame,
  CheckCircle2,
  X
} from 'lucide-react';

interface FeatureItem {
  id: string;
  title: string;
  tag: string;
  shortSnippet: string;
  fullDescription: string;
  icon: React.ElementType;
  badgeColor: string;
}

export const FeaturesShowcase: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedFeature, setSelectedFeature] = useState<string | null>(null);

  const features: FeatureItem[] = [
    {
      id: 'p2p-direct',
      title: 'P2P Direct Transfer',
      tag: 'Zero-Cloud Speed',
      shortSnippet: 'Direct device-to-device streaming with unlimited speed & zero file size limits.',
      fullDescription: 'Connect directly to nearby peers using WebRTC and local Wi-Fi hotspots. Files fly device-to-device without passing through third-party servers, ensuring instant speeds with zero data consumption.',
      icon: Zap,
      badgeColor: 'text-emerald-400 bg-emerald-500/10 border-emerald-500/30'
    },
    {
      id: 'aes-encryption',
      title: 'AES-GCM Encryption',
      tag: 'Military-Grade',
      shortSnippet: '256-bit client-side encryption keeps files safe before leaving your browser.',
      fullDescription: 'Every single file is encrypted on your machine with 256-bit AES-GCM before uploading. Only you and the people you share the cryptographic keys with can unlock and decrypt your content.',
      icon: Lock,
      badgeColor: 'text-cyan-400 bg-cyan-500/10 border-cyan-500/30'
    },
    {
      id: 'offline-dock',
      title: 'Offline File Dock',
      tag: 'No Internet Needed',
      shortSnippet: 'Share videos, photos, and apps without an active cellular or internet connection.',
      fullDescription: 'Experience true Velorix Direct Share / Quick Share freedom on the web. Create a local hotspot link or scan a QR code to transfer large movies and APK packages in seconds without cellular data.',
      icon: WifiOff,
      badgeColor: 'text-emerald-400 bg-emerald-500/10 border-emerald-500/30'
    },
    {
      id: 'cloud-vault',
      title: 'Velorix Cloud Vault',
      tag: 'Persistent Storage',
      shortSnippet: 'Save files securely to Firebase & Cloud Storage with password and expiry control.',
      fullDescription: 'Organize files into custom folders, set auto-expiring links, and lock files with customized passwords. Easily preview images, play video streams, and manage backups anytime.',
      icon: Cloud,
      badgeColor: 'text-cyan-400 bg-cyan-500/10 border-cyan-500/30'
    },
    {
      id: 'instant-guest',
      title: 'Instant Guest Access',
      tag: 'Zero Friction',
      shortSnippet: 'Share files immediately in 1-click without mandatory registration or passwords.',
      fullDescription: 'Don\'t let sign-up walls slow you down. Start as a guest instantly to upload, share, or download files right away, with seamless 1-click upgrades to Google or Email accounts when ready.',
      icon: Sparkles,
      badgeColor: 'text-emerald-400 bg-emerald-500/10 border-emerald-500/30'
    },
    {
      id: 'cross-device',
      title: 'Cross-Device UI',
      tag: 'Fluid Design',
      shortSnippet: 'Crafted for mobile, tablet, and desktop with drag-and-drop & QR sync.',
      fullDescription: 'Engineered with responsive precision. Touch targets scale fluidly, QR codes allow instant camera scanning from PC to phone, and drag-and-drop handles batch file queues seamlessly.',
      icon: Smartphone,
      badgeColor: 'text-cyan-400 bg-cyan-500/10 border-cyan-500/30'
    }
  ];

  return (
    <div className="w-full text-center">
      {/* Compact, Zero-Overflow Trigger Pill */}
      <button
        type="button"
        onClick={() => setIsOpen(true)}
        className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/[0.04] hover:bg-white/[0.08] border border-white/10 hover:border-emerald-400/30 text-[10px] sm:text-[11px] font-semibold text-zinc-400 hover:text-emerald-300 transition-all active:scale-95"
      >
        <Flame className="w-3 h-3 text-emerald-400 animate-pulse" />
        <span>View Features & UI Highlights</span>
        <ChevronDown className="w-3 h-3 text-cyan-400" />
      </button>

      {/* Clean Bottom Sheet / Modal for Complete Descriptions */}
      {isOpen && (
        <div className="fixed inset-0 z-[999] flex items-end sm:items-center justify-center p-0 sm:p-4 bg-black/80 backdrop-blur-md animate-fade-in">
          <div 
            className="w-full max-w-lg bg-[#0b0f19] border border-white/15 rounded-t-[28px] sm:rounded-[28px] p-5 max-h-[85vh] flex flex-col shadow-2xl overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div className="flex items-center justify-between pb-3 border-b border-white/10 shrink-0">
              <div className="flex items-center gap-2">
                <div className="w-7 h-7 rounded-xl bg-emerald-500/20 border border-emerald-400/30 flex items-center justify-center">
                  <Flame className="w-4 h-4 text-emerald-400" />
                </div>
                <div>
                  <h3 className="text-xs font-bold text-white uppercase tracking-wider text-left">
                    Velorix Features & Architecture
                  </h3>
                  <p className="text-[10px] text-zinc-400 text-left">Tap any feature to view full details</p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => {
                  setIsOpen(false);
                  setSelectedFeature(null);
                }}
                className="w-7 h-7 rounded-full bg-white/5 hover:bg-white/10 flex items-center justify-center text-zinc-400 hover:text-white transition-all"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Scrollable Features List */}
            <div className="overflow-y-auto space-y-2.5 pt-3 pr-1">
              {features.map((f) => {
                const Icon = f.icon;
                const isSelected = selectedFeature === f.id;

                return (
                  <div
                    key={f.id}
                    onClick={() => setSelectedFeature(isSelected ? null : f.id)}
                    className={`group p-3 rounded-2xl border transition-all cursor-pointer text-left ${
                      isSelected
                        ? 'bg-white/[0.08] border-emerald-400/40 shadow-lg shadow-emerald-500/10'
                        : 'bg-white/[0.03] border-white/10 hover:border-cyan-400/30 hover:bg-white/[0.05]'
                    }`}
                  >
                    <div className="flex items-start justify-between gap-2.5">
                      <div className="flex items-start gap-2.5">
                        <div className="w-7 h-7 rounded-xl bg-gradient-to-br from-emerald-400/20 to-cyan-400/20 border border-emerald-400/30 flex items-center justify-center shrink-0 mt-0.5">
                          <Icon className="w-4 h-4 text-emerald-300" />
                        </div>
                        <div>
                          <div className="flex items-center gap-2 flex-wrap">
                            <h4 className="text-xs font-bold text-white group-hover:text-emerald-300 transition-colors">
                              {f.title}
                            </h4>
                            <span className={`text-[9px] px-1.5 py-0.2 rounded-md font-semibold border ${f.badgeColor}`}>
                              {f.tag}
                            </span>
                          </div>
                          <p className="text-[11px] text-zinc-400 leading-snug mt-1">
                            {f.shortSnippet}
                          </p>
                        </div>
                      </div>
                      <div className="text-zinc-500 group-hover:text-cyan-400 shrink-0 mt-1">
                        {isSelected ? (
                          <ChevronUp className="w-3.5 h-3.5 text-cyan-400" />
                        ) : (
                          <ChevronDown className="w-3.5 h-3.5" />
                        )}
                      </div>
                    </div>

                    {/* Detailed Description on Tap */}
                    {isSelected && (
                      <div className="mt-2.5 pt-2.5 border-t border-white/10 text-[11px] text-zinc-300 leading-relaxed pl-9 animate-fade-in">
                        <p>{f.fullDescription}</p>
                        <div className="mt-2 flex items-center gap-1.5 text-[10px] text-emerald-400 font-semibold">
                          <CheckCircle2 className="w-3 h-3 text-emerald-400" />
                          <span>Included in Velorix Free Tier</span>
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>

            {/* Modal Footer */}
            <div className="pt-3 border-t border-white/10 shrink-0 mt-2">
              <button
                type="button"
                onClick={() => setIsOpen(false)}
                className="w-full py-2.5 bg-white/10 hover:bg-white/15 text-white font-bold text-xs rounded-xl transition-all"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default FeaturesShowcase;
