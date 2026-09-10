import { safeStorage } from './storage';

export interface GitHubSyncConfig {
  token: string;
  repo: string;
  branch: string;
  autoSyncOnUpload: boolean;
  lastSyncTime: string | null;
}

export const getGitHubSyncConfig = (): GitHubSyncConfig => {
  return {
    token: safeStorage.getItem('velorix_github_token') || '',
    repo: safeStorage.getItem('velorix_github_repo') || '',
    branch: safeStorage.getItem('velorix_github_branch') || 'main',
    autoSyncOnUpload: safeStorage.getItem('velorix_github_auto_sync') === 'true',
    lastSyncTime: safeStorage.getItem('velorix_github_last_sync') || null,
  };
};

export const setGitHubSyncConfig = (config: Partial<GitHubSyncConfig>): void => {
  if (config.token !== undefined) safeStorage.setItem('velorix_github_token', config.token.trim());
  if (config.repo !== undefined) safeStorage.setItem('velorix_github_repo', config.repo.trim());
  if (config.branch !== undefined) safeStorage.setItem('velorix_github_branch', config.branch.trim() || 'main');
  if (config.autoSyncOnUpload !== undefined) safeStorage.setItem('velorix_github_auto_sync', config.autoSyncOnUpload ? 'true' : 'false');
  if (config.lastSyncTime !== undefined && config.lastSyncTime !== null) {
    safeStorage.setItem('velorix_github_last_sync', config.lastSyncTime);
  }
};

export const pushVaultToGitHub = async (
  vaultFiles: Array<{
    id: string;
    name: string;
    size: number;
    downloadUrl: string;
    createdAt: string;
    isPublic: boolean;
    folderId?: string | null;
  }>,
  customCommitMessage?: string
): Promise<{ success: boolean; message: string; sha?: string }> => {
  const { token, repo, branch } = getGitHubSyncConfig();

  if (!token.trim() || !repo.trim()) {
    return {
      success: false,
      message: 'GitHub Token and Target Repository must be configured first.'
    };
  }

  try {
    const repoClean = repo.trim().replace(/^https:\/\/github\.com\//, '').replace(/\.git$/, '');
    const path = 'velorix-vault-backup.json';
    const targetBranch = branch.trim() || 'main';

    // 1. Get current file SHA if exists
    let existingSha: string | null = null;
    try {
      const getRes = await fetch(`https://api.github.com/repos/${repoClean}/contents/${path}?ref=${targetBranch}`, {
        headers: {
          Authorization: `Bearer ${token.trim()}`,
          Accept: 'application/vnd.github.v3+json'
        }
      });
      if (getRes.ok) {
        const getData = await getRes.json();
        existingSha = getData.sha;
      }
    } catch {
      // File doesn't exist yet
    }

    // 2. Prepare payload
    const backupPayload = {
      app: 'Velorix Cloud Vault',
      version: '2.2.0',
      exportedAt: new Date().toISOString(),
      totalFiles: vaultFiles.length,
      totalBytes: vaultFiles.reduce((acc, f) => acc + (f.size || 0), 0),
      files: vaultFiles.map(f => ({
        id: f.id,
        name: f.name,
        size: f.size,
        downloadUrl: f.downloadUrl,
        createdAt: f.createdAt,
        isPublic: f.isPublic,
        folderId: f.folderId || null
      }))
    };

    const contentBase64 = btoa(unescape(encodeURIComponent(JSON.stringify(backupPayload, null, 2))));

    // 3. Commit to GitHub
    const defaultMsg = `🔄 Velorix Auto-Sync: ${vaultFiles.length} Vault Files (${new Date().toLocaleDateString()})`;
    const commitRes = await fetch(`https://api.github.com/repos/${repoClean}/contents/${path}`, {
      method: 'PUT',
      headers: {
        Authorization: `Bearer ${token.trim()}`,
        Accept: 'application/vnd.github.v3+json',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        message: customCommitMessage || defaultMsg,
        content: contentBase64,
        branch: targetBranch,
        ...(existingSha ? { sha: existingSha } : {})
      })
    });

    if (commitRes.ok) {
      const result = await commitRes.json();
      const nowStr = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' });
      setGitHubSyncConfig({ lastSyncTime: nowStr });
      return {
        success: true,
        message: `Successfully synced ${vaultFiles.length} files to ${repoClean}@${targetBranch}`,
        sha: result.commit.sha.substring(0, 7)
      };
    } else {
      const errData = await commitRes.json();
      return {
        success: false,
        message: errData.message || 'Failed to commit to GitHub'
      };
    }
  } catch (err: any) {
    return {
      success: false,
      message: `Network/API Error: ${err.message}`
    };
  }
};

let autoSyncDebounceTimer: any = null;

export const triggerAutoSyncIfEnabled = (
  allFiles: Array<any>,
  uploadedFileName?: string
) => {
  const config = getGitHubSyncConfig();
  if (!config.autoSyncOnUpload || !config.token || !config.repo) {
    return;
  }

  if (autoSyncDebounceTimer) {
    clearTimeout(autoSyncDebounceTimer);
  }

  // Debounce sync slightly to batch multiple uploads into 1 single commit
  autoSyncDebounceTimer = setTimeout(async () => {
    try {
      const msg = uploadedFileName 
        ? `⚡ Velorix Auto-Upload: Added "${uploadedFileName}" (${allFiles.length} total files)`
        : `⚡ Velorix Auto-Upload: Synced ${allFiles.length} files`;
      
      console.log('[Velorix GitHub Auto-Sync]: Triggering automatic vault push to GitHub...');
      const res = await pushVaultToGitHub(allFiles, msg);
      if (res.success) {
        console.log('[Velorix GitHub Auto-Sync Success]:', res.message, 'Commit:', res.sha);
      } else {
        console.warn('[Velorix GitHub Auto-Sync Notice]:', res.message);
      }
    } catch (e) {
      console.error('[Velorix GitHub Auto-Sync Error]:', e);
    }
  }, 1500);
};
