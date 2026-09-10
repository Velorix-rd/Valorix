import React, { useState, useEffect } from 'react';
import { 
  Github, 
  RefreshCw, 
  Check, 
  Copy, 
  ExternalLink, 
  UploadCloud, 
  DownloadCloud, 
  Terminal, 
  AlertCircle, 
  ShieldCheck, 
  FolderGit2, 
  Key, 
  X,
  Zap,
  Clock,
  ToggleLeft,
  ToggleRight,
  Sparkles
} from 'lucide-react';
import { 
  getGitHubSyncConfig, 
  setGitHubSyncConfig, 
  pushVaultToGitHub 
} from '../lib/githubSync';

interface GitHubSyncModalProps {
  isOpen: boolean;
  onClose: () => void;
  vaultFiles: Array<{
    id: string;
    name: string;
    size: number;
    downloadUrl: string;
    createdAt: string;
    isPublic: boolean;
    folderId?: string | null;
  }>;
}

export const GitHubSyncModal: React.FC<GitHubSyncModalProps> = ({ isOpen, onClose, vaultFiles }) => {
  const [activeTab, setActiveTab] = useState<'sync' | 'webhook' | 'settings'>('sync');
  
  const [githubToken, setGithubToken] = useState(() => getGitHubSyncConfig().token);
  const [githubRepo, setGithubRepo] = useState(() => getGitHubSyncConfig().repo);
  const [githubBranch, setGithubBranch] = useState(() => getGitHubSyncConfig().branch);
  const [autoSyncOnUpload, setAutoSyncOnUpload] = useState(() => getGitHubSyncConfig().autoSyncOnUpload);
  
  const [isVerifying, setIsVerifying] = useState(false);
  const [isSyncing, setIsSyncing] = useState(false);
  const [syncStatus, setSyncStatus] = useState<string | null>(null);
  const [syncSuccess, setSyncSuccess] = useState<boolean | null>(null);
  const [userInfo, setUserInfo] = useState<{ login: string; avatar_url: string; name?: string } | null>(null);
  const [copiedKey, setCopiedKey] = useState<string | null>(null);
  const [lastSyncTime, setLastSyncTime] = useState(() => getGitHubSyncConfig().lastSyncTime);

  useEffect(() => {
    const config = getGitHubSyncConfig();
    setGithubToken(config.token);
    setGithubRepo(config.repo);
    setGithubBranch(config.branch);
    setAutoSyncOnUpload(config.autoSyncOnUpload);
    setLastSyncTime(config.lastSyncTime);

    if (config.token) {
      verifyGitHubToken(config.token);
    }
  }, [isOpen]);

  const copyToClipboard = (text: string, key: string) => {
    navigator.clipboard.writeText(text);
    setCopiedKey(key);
    setTimeout(() => setCopiedKey(null), 2000);
  };

  const verifyGitHubToken = async (token: string) => {
    if (!token.trim()) {
      setUserInfo(null);
      return;
    }
    setIsVerifying(true);
    setSyncStatus(null);
    try {
      const res = await fetch('https://api.github.com/user', {
        headers: {
          Authorization: `Bearer ${token.trim()}`,
          Accept: 'application/vnd.github.v3+json'
        }
      });
      if (res.ok) {
        const data = await res.json();
        setUserInfo({
          login: data.login,
          avatar_url: data.avatar_url,
          name: data.name || data.login
        });
        setGitHubSyncConfig({ token: token.trim() });
      } else {
        setUserInfo(null);
        setSyncStatus('Invalid token or insufficient scopes (repo scope required).');
        setSyncSuccess(false);
      }
    } catch (err: any) {
      setUserInfo(null);
      setSyncStatus(`Network error: ${err.message}`);
      setSyncSuccess(false);
    } finally {
      setIsVerifying(false);
    }
  };

  const handleToggleAutoSync = (nextVal: boolean) => {
    setAutoSyncOnUpload(nextVal);
    setGitHubSyncConfig({ autoSyncOnUpload: nextVal });
    if (nextVal && (!githubToken.trim() || !githubRepo.trim())) {
      setSyncStatus('Note: Auto-sync requires a valid GitHub Token & Repository to be saved.');
      setSyncSuccess(null);
    }
  };

  const handleSaveSettings = () => {
    setGitHubSyncConfig({
      token: githubToken.trim(),
      repo: githubRepo.trim(),
      branch: githubBranch.trim() || 'main',
      autoSyncOnUpload
    });
    verifyGitHubToken(githubToken);
    setActiveTab('sync');
  };

  const handleManualSync = async () => {
    if (!githubToken.trim() || !githubRepo.trim()) {
      setActiveTab('settings');
      setSyncStatus('Please configure your GitHub Token and Target Repository first.');
      setSyncSuccess(false);
      return;
    }

    setIsSyncing(true);
    setSyncStatus('Preparing vault manifest and encrypted file records...');
    setSyncSuccess(null);

    const result = await pushVaultToGitHub(vaultFiles);
    setIsSyncing(false);
    setSyncSuccess(result.success);
    if (result.success) {
      const nowStr = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' });
      setLastSyncTime(nowStr);
      setSyncStatus(`${result.message} (Commit: ${result.sha || 'latest'})`);
    } else {
      setSyncStatus(`Sync Failed: ${result.message}`);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[120] flex items-center justify-center p-4 sm:p-6">
      {/* Backdrop */}
      <div 
        onClick={onClose}
        className="absolute inset-0 bg-black/80 backdrop-blur-md transition-opacity"
      />

      {/* Modal Box */}
      <div className="relative w-full max-w-2xl bg-zinc-950 border border-emerald-500/20 rounded-[28px] shadow-2xl overflow-hidden text-white z-10 flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="p-6 border-b border-white/5 bg-gradient-to-r from-emerald-950/30 via-zinc-900 to-zinc-950 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400 shadow-lg shadow-emerald-500/10">
              <FolderGit2 className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-lg font-black tracking-tight font-display text-white">GitHub Sync & Auto-Deploy</h3>
                <span className="text-[9px] font-extrabold uppercase px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                  Cloud Sync
                </span>
                {autoSyncOnUpload && (
                  <span className="text-[9px] font-extrabold uppercase px-2 py-0.5 rounded-full bg-teal-500/20 text-teal-300 border border-teal-500/40 flex items-center gap-1">
                    <Zap className="w-2.5 h-2.5" /> Auto-Sync Active
                  </span>
                )}
              </div>
              <p className="text-xs text-zinc-400">Sync vault backups, repository branches & automate DuckDNS self-host</p>
            </div>
          </div>
          <button 
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-white/5 hover:bg-white/10 flex items-center justify-center text-zinc-400 hover:text-white transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Tab Navigation */}
        <div className="flex border-b border-white/5 bg-zinc-900/50 px-6 pt-2 gap-2">
          <button
            onClick={() => setActiveTab('sync')}
            className={`pb-3 px-3 text-xs font-bold transition-all border-b-2 flex items-center gap-2 ${
              activeTab === 'sync'
                ? 'border-emerald-400 text-emerald-400'
                : 'border-transparent text-zinc-400 hover:text-white'
            }`}
          >
            <UploadCloud className="w-4 h-4" />
            Vault Sync
          </button>
          <button
            onClick={() => setActiveTab('webhook')}
            className={`pb-3 px-3 text-xs font-bold transition-all border-b-2 flex items-center gap-2 ${
              activeTab === 'webhook'
                ? 'border-emerald-400 text-emerald-400'
                : 'border-transparent text-zinc-400 hover:text-white'
            }`}
          >
            <Terminal className="w-4 h-4" />
            Auto-Sync Script (DuckDNS)
          </button>
          <button
            onClick={() => setActiveTab('settings')}
            className={`pb-3 px-3 text-xs font-bold transition-all border-b-2 flex items-center gap-2 ${
              activeTab === 'settings'
                ? 'border-emerald-400 text-emerald-400'
                : 'border-transparent text-zinc-400 hover:text-white'
            }`}
          >
            <Key className="w-4 h-4" />
            GitHub Config
          </button>
        </div>

        {/* Body Content */}
        <div className="p-6 overflow-y-auto space-y-6 flex-1 custom-scrollbar">
          {/* TAB 1: VAULT SYNC */}
          {activeTab === 'sync' && (
            <div className="space-y-5">
              {/* Account Status Card */}
              {userInfo ? (
                <div className="p-4 rounded-2xl bg-emerald-500/5 border border-emerald-500/20 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <img 
                      src={userInfo.avatar_url} 
                      alt={userInfo.login} 
                      className="w-10 h-10 rounded-full border border-emerald-500/40"
                    />
                    <div>
                      <div className="flex items-center gap-2">
                        <p className="text-sm font-bold text-white">{userInfo.name || userInfo.login}</p>
                        <span className="text-[10px] text-zinc-400">(@{userInfo.login})</span>
                      </div>
                      <p className="text-xs text-emerald-400 flex items-center gap-1">
                        <ShieldCheck className="w-3.5 h-3.5" /> Connected to GitHub API
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <span className="text-[11px] text-zinc-400 block">Target Repo</span>
                    <span className="text-xs font-mono font-bold text-zinc-200">{githubRepo || 'Not configured'}</span>
                  </div>
                </div>
              ) : (
                <div className="p-4 rounded-2xl bg-zinc-900 border border-white/5 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-zinc-800 flex items-center justify-center text-zinc-400">
                      <Github className="w-5 h-5" />
                    </div>
                    <div>
                      <p className="text-xs font-bold text-white">GitHub Account Not Connected</p>
                      <p className="text-[11px] text-zinc-400">Add a GitHub Personal Access Token to sync directly</p>
                    </div>
                  </div>
                  <button
                    onClick={() => setActiveTab('settings')}
                    className="px-3 py-1.5 bg-emerald-500 text-black text-xs font-bold rounded-xl hover:bg-emerald-400 transition-colors"
                  >
                    Setup Token
                  </button>
                </div>
              )}

              {/* AUTO-SYNC ON UPLOAD TOGGLE */}
              <div className="p-4 rounded-2xl bg-gradient-to-r from-emerald-950/20 via-zinc-900 to-zinc-900 border border-emerald-500/20 flex items-center justify-between">
                <div className="flex items-start gap-3">
                  <div className="w-9 h-9 rounded-xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400 shrink-0 mt-0.5">
                    <Zap className="w-5 h-5" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <h4 className="text-xs font-bold text-white">Auto-sync on upload</h4>
                      <span className={`text-[9px] font-extrabold uppercase px-1.5 py-0.5 rounded-md ${
                        autoSyncOnUpload 
                          ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30' 
                          : 'bg-zinc-800 text-zinc-400'
                      }`}>
                        {autoSyncOnUpload ? 'ENABLED' : 'DISABLED'}
                      </span>
                    </div>
                    <p className="text-[11px] text-zinc-400 mt-0.5">
                      Automatically commit and push file metadata to GitHub whenever you upload a file to the vault.
                    </p>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => handleToggleAutoSync(!autoSyncOnUpload)}
                  className={`p-1 transition-all rounded-full focus:outline-none ${
                    autoSyncOnUpload ? 'text-emerald-400' : 'text-zinc-600'
                  }`}
                  title={autoSyncOnUpload ? "Disable Auto-sync" : "Enable Auto-sync"}
                >
                  {autoSyncOnUpload ? (
                    <ToggleRight className="w-8 h-8" />
                  ) : (
                    <ToggleLeft className="w-8 h-8" />
                  )}
                </button>
              </div>

              {/* Stats Overview */}
              <div className="grid grid-cols-3 gap-3">
                <div className="p-3.5 rounded-2xl bg-zinc-900/80 border border-white/5 text-center">
                  <span className="text-[10px] font-bold text-zinc-400 uppercase tracking-wider block mb-1">Vault Files</span>
                  <span className="text-lg font-black text-white">{vaultFiles.length}</span>
                </div>
                <div className="p-3.5 rounded-2xl bg-zinc-900/80 border border-white/5 text-center">
                  <span className="text-[10px] font-bold text-zinc-400 uppercase tracking-wider block mb-1">Target Branch</span>
                  <span className="text-lg font-black text-emerald-400 font-mono">{githubBranch}</span>
                </div>
                <div className="p-3.5 rounded-2xl bg-zinc-900/80 border border-white/5 text-center">
                  <span className="text-[10px] font-bold text-zinc-400 uppercase tracking-wider block mb-1">Last Sync</span>
                  <span className="text-xs font-bold text-zinc-300 flex items-center justify-center gap-1 mt-1.5">
                    <Clock className="w-3 h-3 text-zinc-400" />
                    {lastSyncTime || 'Never'}
                  </span>
                </div>
              </div>

              {/* Status Banner */}
              {syncStatus && (
                <div className={`p-4 rounded-2xl border text-xs leading-relaxed flex items-start gap-3 ${
                  syncSuccess 
                    ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-300'
                    : syncSuccess === false
                    ? 'bg-red-500/10 border-red-500/30 text-red-300'
                    : 'bg-blue-500/10 border-blue-500/30 text-blue-300'
                }`}>
                  {syncSuccess ? (
                    <Check className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                  ) : syncSuccess === false ? (
                    <AlertCircle className="w-4 h-4 text-red-400 shrink-0 mt-0.5" />
                  ) : (
                    <RefreshCw className="w-4 h-4 text-blue-400 animate-spin shrink-0 mt-0.5" />
                  )}
                  <div>{syncStatus}</div>
                </div>
              )}

              {/* Action Buttons */}
              <div className="space-y-3 pt-2">
                <button
                  onClick={handleManualSync}
                  disabled={isSyncing}
                  className="w-full py-4 bg-gradient-to-r from-emerald-500 to-teal-400 hover:from-emerald-400 hover:to-teal-300 text-black font-extrabold text-sm rounded-2xl shadow-lg shadow-emerald-500/20 flex items-center justify-center gap-2.5 transition-all active:scale-[0.98] disabled:opacity-50 cursor-pointer"
                >
                  <RefreshCw className={`w-4 h-4 ${isSyncing ? 'animate-spin' : ''}`} />
                  {isSyncing ? 'Syncing to GitHub Repository...' : 'Push & Sync Vault to GitHub Now'}
                </button>

                <div className="flex gap-2">
                  <button
                    onClick={() => {
                      const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(vaultFiles, null, 2));
                      const downloadAnchor = document.createElement('a');
                      downloadAnchor.setAttribute("href", dataStr);
                      downloadAnchor.setAttribute("download", `velorix-vault-backup-${new Date().toISOString().slice(0, 10)}.json`);
                      document.body.appendChild(downloadAnchor);
                      downloadAnchor.click();
                      downloadAnchor.remove();
                    }}
                    className="flex-1 py-3 bg-zinc-900 hover:bg-zinc-800 border border-white/5 text-zinc-300 text-xs font-bold rounded-xl flex items-center justify-center gap-2 transition-colors cursor-pointer"
                  >
                    <DownloadCloud className="w-3.5 h-3.5" />
                    Download JSON Backup
                  </button>

                  {githubRepo && (
                    <a
                      href={`https://github.com/${githubRepo.replace(/^https:\/\/github\.com\//, '').replace(/\.git$/, '')}/blob/${githubBranch}/velorix-vault-backup.json`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="py-3 px-4 bg-zinc-900 hover:bg-zinc-800 border border-white/5 text-zinc-300 text-xs font-bold rounded-xl flex items-center gap-1.5 transition-colors"
                    >
                      <ExternalLink className="w-3.5 h-3.5" />
                      View on GitHub
                    </a>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: DUCKDNS AUTO-SYNC HELPER */}
          {activeTab === 'webhook' && (
            <div className="space-y-4">
              <div className="p-4 rounded-2xl bg-zinc-900 border border-white/5 space-y-2">
                <div className="flex items-center gap-2 text-emerald-400 text-xs font-bold">
                  <Zap className="w-4 h-4" />
                  <span>DuckDNS / Server 1-Line Auto-Sync Command</span>
                </div>
                <p className="text-xs text-zinc-400">
                  Run this single command on your PC / Linux VPS to automatically sync new code from GitHub and restart the server without downtime:
                </p>
                <div className="relative mt-2">
                  <pre className="p-3 bg-black/80 rounded-xl font-mono text-[11px] text-emerald-300 border border-white/10 overflow-x-auto">
                    {`git pull origin main && npm install && npm run build && npm start`}
                  </pre>
                  <button
                    onClick={() => copyToClipboard(`git pull origin main && npm install && npm run build && npm start`, 'cmd1')}
                    className="absolute right-2 top-2 px-2 py-1 bg-zinc-800 hover:bg-zinc-700 text-xs font-bold text-white rounded-lg flex items-center gap-1 transition-colors"
                  >
                    {copiedKey === 'cmd1' ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                    {copiedKey === 'cmd1' ? 'Copied' : 'Copy'}
                  </button>
                </div>
              </div>

              {/* Auto Cron / Watcher Script */}
              <div className="p-4 rounded-2xl bg-zinc-900 border border-white/5 space-y-2">
                <div className="flex items-center gap-2 text-white text-xs font-bold">
                  <Terminal className="w-4 h-4 text-emerald-400" />
                  <span>Background Auto-Sync Watcher Script (`auto-sync.sh`)</span>
                </div>
                <p className="text-xs text-zinc-400">
                  Save this script on your server and run it with `pm2` or `bash auto-sync.sh &` to auto-check GitHub every 2 minutes:
                </p>
                <div className="relative mt-2">
                  <pre className="p-3 bg-black/80 rounded-xl font-mono text-[10px] text-zinc-300 border border-white/10 overflow-x-auto max-h-40">
{`#!/bin/bash
while true; do
  git fetch
  LOCAL=$(git rev-parse HEAD)
  REMOTE=$(git rev-parse @{u})
  if [ $LOCAL != $REMOTE ]; then
    echo "⚡ New update detected on GitHub! Syncing..."
    git pull
    npm run build
    pm2 restart all || npm start
    echo "✅ Server updated successfully!"
  fi
  sleep 120
done`}
                  </pre>
                  <button
                    onClick={() => copyToClipboard(`#!/bin/bash\nwhile true; do\n  git fetch\n  LOCAL=$(git rev-parse HEAD)\n  REMOTE=$(git rev-parse @{u})\n  if [ $LOCAL != $REMOTE ]; then\n    echo "⚡ New update detected on GitHub! Syncing..."\n    git pull\n    npm run build\n    pm2 restart all || npm start\n    echo "✅ Server updated successfully!"\n  fi\n  sleep 120\ndone`, 'cmd2')}
                    className="absolute right-2 top-2 px-2 py-1 bg-zinc-800 hover:bg-zinc-700 text-xs font-bold text-white rounded-lg flex items-center gap-1 transition-colors"
                  >
                    {copiedKey === 'cmd2' ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                    {copiedKey === 'cmd2' ? 'Copied' : 'Copy'}
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* TAB 3: SETTINGS */}
          {activeTab === 'settings' && (
            <div className="space-y-4">
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-zinc-300 flex items-center gap-1.5">
                  <Key className="w-3.5 h-3.5 text-emerald-400" />
                  GitHub Personal Access Token (classic or fine-grained)
                </label>
                <input
                  type="password"
                  placeholder="ghp_xxxxxxxxxxxxxxxxxxxx"
                  value={githubToken}
                  onChange={(e) => setGithubToken(e.target.value)}
                  className="w-full bg-zinc-900 border border-white/10 rounded-xl px-3.5 py-2.5 text-xs text-white placeholder:text-zinc-600 focus:outline-none focus:border-emerald-400 font-mono"
                />
                <p className="text-[11px] text-zinc-500">
                  Requires <code>repo</code> scope for private repos or <code>public_repo</code> for public repos.{' '}
                  <a 
                    href="https://github.com/settings/tokens/new?scopes=repo&description=Velorix%20Vault%20Sync" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="text-emerald-400 hover:underline"
                  >
                    Generate token on GitHub &rarr;
                  </a>
                </p>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-zinc-300 flex items-center gap-1.5">
                  <FolderGit2 className="w-3.5 h-3.5 text-emerald-400" />
                  Target Repository (owner/repo)
                </label>
                <input
                  type="text"
                  placeholder="your-username/velorix-vault"
                  value={githubRepo}
                  onChange={(e) => setGithubRepo(e.target.value)}
                  className="w-full bg-zinc-900 border border-white/10 rounded-xl px-3.5 py-2.5 text-xs text-white placeholder:text-zinc-600 focus:outline-none focus:border-emerald-400 font-mono"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-zinc-300">
                  Target Branch
                </label>
                <input
                  type="text"
                  placeholder="main"
                  value={githubBranch}
                  onChange={(e) => setGithubBranch(e.target.value)}
                  className="w-full bg-zinc-900 border border-white/10 rounded-xl px-3.5 py-2.5 text-xs text-white placeholder:text-zinc-600 focus:outline-none focus:border-emerald-400 font-mono"
                />
              </div>

              {/* Auto-sync on Upload Toggle in Settings */}
              <div className="p-3 rounded-xl bg-zinc-900 border border-white/5 flex items-center justify-between">
                <div>
                  <span className="text-xs font-bold text-white block">Auto-sync on upload</span>
                  <span className="text-[10px] text-zinc-400">Push to GitHub immediately when any file is uploaded</span>
                </div>
                <button
                  type="button"
                  onClick={() => setAutoSyncOnUpload(!autoSyncOnUpload)}
                  className={`p-1 transition-all rounded-full focus:outline-none ${
                    autoSyncOnUpload ? 'text-emerald-400' : 'text-zinc-600'
                  }`}
                >
                  {autoSyncOnUpload ? (
                    <ToggleRight className="w-7 h-7" />
                  ) : (
                    <ToggleLeft className="w-7 h-7" />
                  )}
                </button>
              </div>

              <button
                onClick={handleSaveSettings}
                disabled={isVerifying}
                className="w-full py-3.5 bg-emerald-500 hover:bg-emerald-400 text-black font-extrabold text-xs rounded-xl transition-all shadow-lg shadow-emerald-500/20 flex items-center justify-center gap-2 cursor-pointer"
              >
                {isVerifying ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Check className="w-4 h-4" />}
                {isVerifying ? 'Verifying GitHub Token...' : 'Save & Verify GitHub Config'}
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
