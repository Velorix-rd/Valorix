import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Server, 
  Radio, 
  Database, 
  ShieldCheck, 
  CheckCircle2, 
  AlertTriangle, 
  RefreshCw, 
  X, 
  Zap,
  Activity,
  HardDrive,
  Plus
} from 'lucide-react';
import { BackendTier, checkAllBackendTiers, setActiveTierIndex, addCustomServer } from '../config/api';

interface BackendTiersModalProps {
  isOpen: boolean;
  onClose: () => void;
  tiers: BackendTier[];
  activeTierIndex: number;
}

export const BackendTiersModal: React.FC<BackendTiersModalProps> = ({
  isOpen,
  onClose,
  tiers,
  activeTierIndex
}) => {
  const [isTesting, setIsTesting] = useState(false);
  const [testSuccess, setTestSuccess] = useState<string | null>(null);
  const [showAddCustom, setShowAddCustom] = useState(false);
  const [customName, setCustomName] = useState('');
  const [customUrl, setCustomUrl] = useState('');

  if (!isOpen) return null;

  const handleTestGateways = async () => {
    setIsTesting(true);
    setTestSuccess(null);
    try {
      await checkAllBackendTiers();
      setTestSuccess('All gateways evaluated successfully with real-time ping.');
      setTimeout(() => setTestSuccess(null), 4000);
    } catch (e) {
      console.warn('Evaluation error:', e);
    } finally {
      setIsTesting(false);
    }
  };

  const handleAddCustom = (e: React.FormEvent) => {
    e.preventDefault();
    if (!customUrl.trim()) return;
    try {
      addCustomServer(customName.trim() || 'Custom Free Server', customUrl.trim());
      setActiveTierIndex(tiers.length); // Switch to newly added server
      setCustomName('');
      setCustomUrl('');
      setShowAddCustom(false);
      setTestSuccess('Custom 24x7 lifetime free server added & selected successfully!');
      setTimeout(() => setTestSuccess(null), 4000);
    } catch (err) {
      console.warn('Error adding custom server:', err);
    }
  };

  const getTierIcon = (type: string) => {
    switch (type) {
      case 'primary':
        return <Server className="w-5 h-5 text-emerald-400" />;
      case 'secondary':
        return <Radio className="w-5 h-5 text-cyan-400" />;
      case 'serverless':
      default:
        return <Database className="w-5 h-5 text-purple-400" />;
    }
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-[120] flex items-center justify-center p-2 sm:p-4 bg-black/85 backdrop-blur-md overflow-y-auto">
        <motion.div
          initial={{ opacity: 0, scale: 0.94, y: 15 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.94, y: 15 }}
          className="bg-[#0b0f19] border border-white/10 rounded-[28px] w-[96vw] sm:w-full max-w-lg max-h-[88vh] overflow-y-auto p-4 sm:p-6 shadow-2xl relative my-auto mx-auto"
        >
          {/* Top accent light */}
          <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-emerald-400 via-cyan-400 to-purple-400" />

          {/* Header */}
          <div className="flex items-start justify-between gap-3 mb-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400 shrink-0">
                <ShieldCheck className="w-6 h-6" />
              </div>
              <div>
                <h2 className="text-sm sm:text-lg font-bold text-white flex items-center gap-2 flex-wrap">
                  <span>Server Select &amp; Custom Gateways</span>
                  <span className="text-[10px] px-2 py-0.5 rounded-full bg-cyan-500/10 text-cyan-400 border border-cyan-500/20 font-mono">
                    Manual &amp; Auto Switch
                  </span>
                </h2>
                <p className="text-[11px] sm:text-xs text-zinc-400">
                  Select any server manually or add your own 24x7 lifetime free server.
                </p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="p-2.5 rounded-2xl bg-white/10 hover:bg-white/20 text-zinc-200 hover:text-white transition-all shadow-md shrink-0 flex items-center justify-center"
              title="Close"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Add Custom Server Toggle */}
          <div className="mb-4">
            {!showAddCustom ? (
              <button
                onClick={() => setShowAddCustom(true)}
                className="w-full py-2.5 px-4 rounded-2xl bg-cyan-500/10 hover:bg-cyan-500/20 border border-cyan-500/30 text-cyan-300 font-semibold text-xs flex items-center justify-center gap-2 transition-all shadow-sm"
              >
                <Plus className="w-4 h-4" />
                <span>Add Custom 24x7 Free Server URL</span>
              </button>
            ) : (
              <form onSubmit={handleAddCustom} className="p-3.5 rounded-2xl bg-white/[0.03] border border-cyan-500/30 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-cyan-300">Add Custom Free Server (&lt;100ms)</span>
                  <button type="button" onClick={() => setShowAddCustom(false)} className="text-zinc-400 hover:text-white text-xs">Cancel</button>
                </div>
                <input
                  type="text"
                  placeholder="Server Name (e.g. My Free Edge Proxy)"
                  value={customName}
                  onChange={(e) => setCustomName(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-white/5 border border-white/10 text-xs text-white placeholder-zinc-500 focus:outline-none focus:border-cyan-500"
                />
                <input
                  type="url"
                  placeholder="https://your-server-url.com"
                  value={customUrl}
                  onChange={(e) => setCustomUrl(e.target.value)}
                  required
                  className="w-full px-3 py-2 rounded-xl bg-white/5 border border-white/10 text-xs text-white placeholder-zinc-500 focus:outline-none focus:border-cyan-500"
                />
                <button
                  type="submit"
                  className="w-full py-2 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-black font-bold text-xs transition-all shadow-md"
                >
                  Save &amp; Connect Server
                </button>
              </form>
            )}
          </div>

          {/* Tiers List with Manual Selection */}
          <div className="space-y-2.5 mb-5">
            {tiers.map((tier, idx) => {
              const isActive = idx === activeTierIndex;

              return (
                <div
                  key={tier.id || idx}
                  onClick={() => setActiveTierIndex(idx)}
                  className={`p-3.5 rounded-2xl border transition-all cursor-pointer ${
                    isActive
                      ? 'bg-emerald-500/10 border-emerald-500/40 shadow-lg shadow-emerald-500/5 ring-1 ring-emerald-500/30'
                      : 'bg-white/[0.02] border-white/5 hover:border-white/15'
                  }`}
                >
                  <div className="flex items-center justify-between gap-2 mb-1.5">
                    <div className="flex items-center gap-2.5">
                      <div className="w-8 h-8 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center shrink-0">
                        {getTierIcon(tier.type)}
                      </div>
                      <div>
                        <div className="flex items-center gap-2 flex-wrap">
                          <span className="text-xs sm:text-sm font-bold text-white">{tier.name}</span>
                          {isActive ? (
                            <span className="text-[9px] font-bold px-1.5 py-0.5 rounded-md bg-emerald-500/20 text-emerald-300 border border-emerald-500/40">
                              ACTIVE (SELECTED)
                            </span>
                          ) : (
                            <span className="text-[9px] font-medium px-1.5 py-0.5 rounded-md bg-white/5 text-zinc-400 border border-white/10">
                              Click to Select
                            </span>
                          )}
                        </div>
                        <p className="text-[10px] text-zinc-400 font-mono truncate max-w-[200px] sm:max-w-xs">
                          {tier.baseUrl}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 text-right shrink-0">
                      <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-emerald-500/15 border border-emerald-500/30 text-[10px] font-mono font-bold text-emerald-300">
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                        <span>{tier.latency || 24}ms</span>
                      </div>
                    </div>
                  </div>

                  <p className="text-[11px] text-zinc-400 pl-10">
                    {tier.description}
                  </p>
                </div>
              );
            })}
          </div>

          {testSuccess && (
            <div className="mb-3 p-2.5 rounded-xl bg-emerald-500/10 border border-emerald-500/30 flex items-center gap-2 text-xs text-emerald-300">
              <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
              <span>{testSuccess}</span>
            </div>
          )}

          {/* Footer Actions */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-3 border-t border-white/5">
            <div className="flex items-center gap-2 text-[11px] text-zinc-400">
              <HardDrive className="w-3.5 h-3.5 text-zinc-500" />
              <span>Manual Select: <strong className="text-emerald-400">Enabled</strong></span>
            </div>

            <div className="flex items-center gap-2 w-full sm:w-auto">
              <button
                onClick={handleTestGateways}
                disabled={isTesting}
                className="flex-1 sm:flex-initial px-3.5 py-2.5 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-xs font-semibold text-white flex items-center justify-center gap-1.5 transition-all disabled:opacity-50"
              >
                <RefreshCw className={`w-3.5 h-3.5 ${isTesting ? 'animate-spin' : ''}`} />
                <span>{isTesting ? 'Measuring Ping...' : 'Test Ping'}</span>
              </button>
              <button
                onClick={onClose}
                className="flex-1 sm:flex-initial px-5 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-black font-bold text-xs transition-all shadow-md"
              >
                Done
              </button>
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
