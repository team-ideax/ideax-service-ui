import React, { useState, useEffect } from 'react';
import {
  Save,
  KeyRound,
  Download,
  RotateCcw,
  UploadCloud,
  CheckCircle2,
  ShieldAlert,
  Globe,
  Mail,
  Phone,
  MessageSquare,
  Sparkles,
  Github,
  Linkedin,
  Twitter,
  Instagram,
  FileCode,
} from 'lucide-react';
import AdminLayout from '../components/AdminLayout';
import { settingsService } from '../services/settingsService';
import { projectService } from '../services/projectService';
import { reviewService } from '../services/reviewService';
import { authService } from '../services/authService';
import { githubPublishService } from '../services/githubPublishService';
import { useToast } from '../components/Toast';

export default function SettingsPage() {
  const [settings, setSettings] = useState(settingsService.getSettings());
  const [githubConfig, setGithubConfig] = useState(githubPublishService.getConfig());
  const { addToast } = useToast();

  // Password change states
  const [currentPassword, setCurrentPassword] = useState('');
  const [newUsername, setNewUsername] = useState('admin');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [passwordMsg, setPasswordMsg] = useState({ text: '', type: '' });

  useEffect(() => {
    setSettings(settingsService.getSettings());
    setGithubConfig(githubPublishService.getConfig());
  }, []);

  const handleSaveSettings = (e) => {
    e.preventDefault();
    const res = settingsService.updateSettings(settings);
    if (res.success) {
      addToast('Website settings saved successfully!', 'success');
    }
  };

  const handleSaveGithubConfig = (e) => {
    e.preventDefault();
    githubPublishService.saveConfig(githubConfig);
    addToast('GitHub publishing configuration saved!', 'success');
  };

  const handleChangePassword = async (e) => {
    e.preventDefault();
    setPasswordMsg({ text: '', type: '' });

    if (newPassword !== confirmPassword) {
      setPasswordMsg({ text: 'New passwords do not match.', type: 'error' });
      return;
    }

    if (newPassword.length < 6) {
      setPasswordMsg({ text: 'Password must be at least 6 characters.', type: 'error' });
      return;
    }

    const res = await authService.updateCredentials(currentPassword, newUsername, newPassword);
    if (res.success) {
      setPasswordMsg({ text: res.message, type: 'success' });
      addToast('Admin credentials updated successfully!', 'success');
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
    } else {
      setPasswordMsg({ text: res.message, type: 'error' });
    }
  };

  const handleExportAllJSON = () => {
    projectService.exportJSON();
    reviewService.exportJSON();
    settingsService.exportJSON();
    addToast('All JSON data files exported!', 'success');
  };

  const handleResetToDefaults = () => {
    if (
      window.confirm(
        'Warning: This will reset all website settings to original default values. Continue?'
      )
    ) {
      settingsService.resetToDefault();
      setSettings(settingsService.getSettings());
      addToast('Settings reset to default configuration.', 'info');
    }
  };

  return (
    <AdminLayout
      title="Website Content & System Settings"
      subtitle="Manage global brand information, contact endpoints, admin credentials, and GitHub sync."
      actions={
        <button
          onClick={handleExportAllJSON}
          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#202020] text-xs font-semibold text-gray-200 hover:text-white border border-brand-border transition-colors"
        >
          <Download className="w-3.5 h-3.5" />
          <span>Export All Data</span>
        </button>
      }
    >
      <div className="space-y-10 max-w-5xl">
        {/* ======================================================== */}
        {/* 1. GENERAL BUSINESS & CONTACT SETTINGS                   */}
        {/* ======================================================== */}
        <section className="bg-[#141414] border border-brand-border rounded-3xl p-6 sm:p-8 space-y-6">
          <div className="flex items-center justify-between border-b border-brand-border/60 pb-4">
            <div>
              <h3 className="text-lg font-bold text-white flex items-center gap-2">
                <Globe className="w-5 h-5 text-brand-yellow" />
                <span>Business Identity & Contact Details</span>
              </h3>
              <p className="text-xs text-brand-muted mt-0.5">
                These values are dynamically used across the website hero, contact sections, and footer.
              </p>
            </div>
            <button
              onClick={handleResetToDefaults}
              className="text-xs text-gray-400 hover:text-rose-400 flex items-center gap-1"
              title="Reset Settings"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Reset</span>
            </button>
          </div>

          <form onSubmit={handleSaveSettings} className="space-y-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-gray-300 uppercase tracking-wider mb-1.5">
                  Business Name
                </label>
                <input
                  type="text"
                  required
                  value={settings.businessName || 'ideaX'}
                  onChange={(e) => setSettings({ ...settings, businessName: e.target.value })}
                  className="w-full px-4 py-2.5 rounded-xl bg-[#1e1e1e] border border-brand-border text-white text-sm focus:outline-none focus:border-brand-yellow"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-300 uppercase tracking-wider mb-1.5">
                  Brand Tagline
                </label>
                <input
                  type="text"
                  required
                  value={settings.tagline || 'Turning Ideas Into Software'}
                  onChange={(e) => setSettings({ ...settings, tagline: e.target.value })}
                  className="w-full px-4 py-2.5 rounded-xl bg-[#1e1e1e] border border-brand-border text-white text-sm focus:outline-none focus:border-brand-yellow"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-gray-300 uppercase tracking-wider mb-1.5">
                  Official Email Address
                </label>
                <input
                  type="email"
                  required
                  value={settings.email || 'team.ideax@gmail.com'}
                  onChange={(e) => setSettings({ ...settings, email: e.target.value })}
                  className="w-full px-4 py-2.5 rounded-xl bg-[#1e1e1e] border border-brand-border text-white text-sm focus:outline-none focus:border-brand-yellow"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-300 uppercase tracking-wider mb-1.5">
                  Contact Number
                </label>
                <input
                  type="text"
                  required
                  value={settings.phone || '+91 9345746981'}
                  onChange={(e) => setSettings({ ...settings, phone: e.target.value, phoneRaw: e.target.value.replace(/\s+/g, '') })}
                  className="w-full px-4 py-2.5 rounded-xl bg-[#1e1e1e] border border-brand-border text-white text-sm focus:outline-none focus:border-brand-yellow"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-gray-300 uppercase tracking-wider mb-1.5">
                  Google Form Project Enquiry URL
                </label>
                <input
                  type="url"
                  required
                  value={settings.enquiryForm || 'https://forms.gle/8RsBqNQtjr6ToifQ7'}
                  onChange={(e) => setSettings({ ...settings, enquiryForm: e.target.value })}
                  className="w-full px-4 py-2.5 rounded-xl bg-[#1e1e1e] border border-brand-border text-white text-sm focus:outline-none focus:border-brand-yellow"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-300 uppercase tracking-wider mb-1.5">
                  WhatsApp Direct URL
                </label>
                <input
                  type="url"
                  value={settings.whatsappUrl || 'https://wa.me/919345746981'}
                  onChange={(e) => setSettings({ ...settings, whatsappUrl: e.target.value })}
                  className="w-full px-4 py-2.5 rounded-xl bg-[#1e1e1e] border border-brand-border text-white text-sm focus:outline-none focus:border-brand-yellow"
                />
              </div>
            </div>

            {/* About Us Content */}
            <div className="space-y-4 pt-2">
              <h4 className="text-xs font-bold text-brand-yellow uppercase tracking-wider">
                About Us Content
              </h4>

              <div>
                <label className="block text-xs font-semibold text-gray-300 uppercase tracking-wider mb-1.5">
                  Business Introduction (Hero & About)
                </label>
                <textarea
                  rows={2}
                  value={settings.about?.introduction || ''}
                  onChange={(e) =>
                    setSettings({
                      ...settings,
                      about: { ...settings.about, introduction: e.target.value },
                    })
                  }
                  className="w-full px-4 py-2.5 rounded-xl bg-[#1e1e1e] border border-brand-border text-white text-sm focus:outline-none focus:border-brand-yellow resize-none"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-300 uppercase tracking-wider mb-1.5">
                  Mission Statement
                </label>
                <textarea
                  rows={2}
                  value={settings.about?.mission || ''}
                  onChange={(e) =>
                    setSettings({
                      ...settings,
                      about: { ...settings.about, mission: e.target.value },
                    })
                  }
                  className="w-full px-4 py-2.5 rounded-xl bg-[#1e1e1e] border border-brand-border text-white text-sm focus:outline-none focus:border-brand-yellow resize-none"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-300 uppercase tracking-wider mb-1.5">
                  Development Approach
                </label>
                <textarea
                  rows={2}
                  value={settings.about?.approach || ''}
                  onChange={(e) =>
                    setSettings({
                      ...settings,
                      about: { ...settings.about, approach: e.target.value },
                    })
                  }
                  className="w-full px-4 py-2.5 rounded-xl bg-[#1e1e1e] border border-brand-border text-white text-sm focus:outline-none focus:border-brand-yellow resize-none"
                />
              </div>
            </div>

            {/* Social Links */}
            <div className="space-y-4 pt-2">
              <h4 className="text-xs font-bold text-brand-yellow uppercase tracking-wider">
                Social Media Links
              </h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-gray-300 uppercase tracking-wider mb-1.5">
                    GitHub URL
                  </label>
                  <input
                    type="url"
                    value={settings.socialLinks?.github || ''}
                    onChange={(e) =>
                      setSettings({
                        ...settings,
                        socialLinks: { ...settings.socialLinks, github: e.target.value },
                      })
                    }
                    className="w-full px-4 py-2.5 rounded-xl bg-[#1e1e1e] border border-brand-border text-white text-sm focus:outline-none focus:border-brand-yellow"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-gray-300 uppercase tracking-wider mb-1.5">
                    LinkedIn URL
                  </label>
                  <input
                    type="url"
                    value={settings.socialLinks?.linkedin || ''}
                    onChange={(e) =>
                      setSettings({
                        ...settings,
                        socialLinks: { ...settings.socialLinks, linkedin: e.target.value },
                      })
                    }
                    className="w-full px-4 py-2.5 rounded-xl bg-[#1e1e1e] border border-brand-border text-white text-sm focus:outline-none focus:border-brand-yellow"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-gray-300 uppercase tracking-wider mb-1.5">
                    Twitter / X URL
                  </label>
                  <input
                    type="url"
                    value={settings.socialLinks?.twitter || ''}
                    onChange={(e) =>
                      setSettings({
                        ...settings,
                        socialLinks: { ...settings.socialLinks, twitter: e.target.value },
                      })
                    }
                    className="w-full px-4 py-2.5 rounded-xl bg-[#1e1e1e] border border-brand-border text-white text-sm focus:outline-none focus:border-brand-yellow"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-gray-300 uppercase tracking-wider mb-1.5">
                    Instagram URL
                  </label>
                  <input
                    type="url"
                    value={settings.socialLinks?.instagram || ''}
                    onChange={(e) =>
                      setSettings({
                        ...settings,
                        socialLinks: { ...settings.socialLinks, instagram: e.target.value },
                      })
                    }
                    className="w-full px-4 py-2.5 rounded-xl bg-[#1e1e1e] border border-brand-border text-white text-sm focus:outline-none focus:border-brand-yellow"
                  />
                </div>
              </div>
            </div>

            {/* Footer Text */}
            <div>
              <label className="block text-xs font-semibold text-gray-300 uppercase tracking-wider mb-1.5">
                Footer Copyright Text
              </label>
              <input
                type="text"
                value={settings.footerText || ''}
                onChange={(e) => setSettings({ ...settings, footerText: e.target.value })}
                className="w-full px-4 py-2.5 rounded-xl bg-[#1e1e1e] border border-brand-border text-white text-sm focus:outline-none focus:border-brand-yellow"
              />
            </div>

            <div className="pt-2">
              <button
                type="submit"
                className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl text-xs font-bold bg-brand-yellow text-black hover:bg-brand-yellowHover shadow-glow-yellow-sm transition-all"
              >
                <Save className="w-4 h-4" />
                <span>Save Website Settings</span>
              </button>
            </div>
          </form>
        </section>

        {/* ======================================================== */}
        {/* 2. ADMIN CREDENTIALS & SECURITY                          */}
        {/* ======================================================== */}
        <section className="bg-[#141414] border border-brand-border rounded-3xl p-6 sm:p-8 space-y-6">
          <div className="border-b border-brand-border/60 pb-4">
            <h3 className="text-lg font-bold text-white flex items-center gap-2">
              <KeyRound className="w-5 h-5 text-brand-yellow" />
              <span>Administrator Security & Credentials</span>
            </h3>
            <p className="text-xs text-brand-muted mt-0.5">
              Change the default credentials (admin / admin) to protect the admin management interface.
            </p>
          </div>

          {passwordMsg.text && (
            <div
              className={`p-4 rounded-xl text-xs font-medium ${
                passwordMsg.type === 'success'
                  ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/30'
                  : 'bg-rose-500/10 text-rose-400 border border-rose-500/30'
              }`}
            >
              {passwordMsg.text}
            </div>
          )}

          <form onSubmit={handleChangePassword} className="space-y-4 max-w-lg">
            <div>
              <label className="block text-xs font-semibold text-gray-300 uppercase tracking-wider mb-1.5">
                Current Password *
              </label>
              <input
                type="password"
                required
                value={currentPassword}
                onChange={(e) => setCurrentPassword(e.target.value)}
                placeholder="Enter current password"
                className="w-full px-4 py-2.5 rounded-xl bg-[#1e1e1e] border border-brand-border text-white text-sm focus:outline-none focus:border-brand-yellow"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-300 uppercase tracking-wider mb-1.5">
                New Admin Username
              </label>
              <input
                type="text"
                required
                value={newUsername}
                onChange={(e) => setNewUsername(e.target.value)}
                placeholder="admin"
                className="w-full px-4 py-2.5 rounded-xl bg-[#1e1e1e] border border-brand-border text-white text-sm focus:outline-none focus:border-brand-yellow"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-300 uppercase tracking-wider mb-1.5">
                New Password * (min 6 characters)
              </label>
              <input
                type="password"
                required
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                placeholder="Enter new strong password"
                className="w-full px-4 py-2.5 rounded-xl bg-[#1e1e1e] border border-brand-border text-white text-sm focus:outline-none focus:border-brand-yellow"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-300 uppercase tracking-wider mb-1.5">
                Confirm New Password *
              </label>
              <input
                type="password"
                required
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="Re-enter new password"
                className="w-full px-4 py-2.5 rounded-xl bg-[#1e1e1e] border border-brand-border text-white text-sm focus:outline-none focus:border-brand-yellow"
              />
            </div>

            <div className="pt-2">
              <button
                type="submit"
                className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl text-xs font-bold bg-[#242424] text-white hover:bg-[#303030] border border-brand-border transition-colors"
              >
                <span>Update Admin Credentials</span>
              </button>
            </div>
          </form>
        </section>

        {/* ======================================================== */}
        {/* 3. GITHUB REPOSITORY PUBLISHING CONFIGURATION            */}
        {/* ======================================================== */}
        <section className="bg-[#141414] border border-brand-border rounded-3xl p-6 sm:p-8 space-y-6">
          <div className="border-b border-brand-border/60 pb-4">
            <h3 className="text-lg font-bold text-white flex items-center gap-2">
              <UploadCloud className="w-5 h-5 text-brand-yellow" />
              <span>Production Publishing & GitHub Sync</span>
            </h3>
            <p className="text-xs text-brand-muted mt-0.5">
              BRD Section 6.4: Static hosting files are read-only at runtime. Configure your GitHub repository details to enable one-click publishing directly to your repository via the GitHub REST API!
            </p>
          </div>

          <form onSubmit={handleSaveGithubConfig} className="space-y-4 max-w-xl">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-gray-300 uppercase tracking-wider mb-1.5">
                  GitHub Owner / Organization
                </label>
                <input
                  type="text"
                  placeholder="e.g. ideax-dev or username"
                  value={githubConfig.owner}
                  onChange={(e) => setGithubConfig({ ...githubConfig, owner: e.target.value })}
                  className="w-full px-4 py-2.5 rounded-xl bg-[#1e1e1e] border border-brand-border text-white text-sm focus:outline-none focus:border-brand-yellow"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-300 uppercase tracking-wider mb-1.5">
                  Repository Name
                </label>
                <input
                  type="text"
                  placeholder="e.g. ideax"
                  value={githubConfig.repo}
                  onChange={(e) => setGithubConfig({ ...githubConfig, repo: e.target.value })}
                  className="w-full px-4 py-2.5 rounded-xl bg-[#1e1e1e] border border-brand-border text-white text-sm focus:outline-none focus:border-brand-yellow"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-gray-300 uppercase tracking-wider mb-1.5">
                  Target Branch
                </label>
                <input
                  type="text"
                  placeholder="main"
                  value={githubConfig.branch || 'main'}
                  onChange={(e) => setGithubConfig({ ...githubConfig, branch: e.target.value })}
                  className="w-full px-4 py-2.5 rounded-xl bg-[#1e1e1e] border border-brand-border text-white text-sm focus:outline-none focus:border-brand-yellow"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-300 uppercase tracking-wider mb-1.5">
                  GitHub Personal Access Token (PAT)
                </label>
                <input
                  type="password"
                  placeholder="ghp_••••••••••••••••"
                  value={githubConfig.token}
                  onChange={(e) => setGithubConfig({ ...githubConfig, token: e.target.value })}
                  className="w-full px-4 py-2.5 rounded-xl bg-[#1e1e1e] border border-brand-border text-white text-sm focus:outline-none focus:border-brand-yellow"
                />
              </div>
            </div>

            <p className="text-[11px] text-gray-400">
              Token needs <code className="text-brand-yellow font-mono">repo</code> / <code className="text-brand-yellow font-mono">contents:write</code> permission to commit updated JSON files to your repository.
            </p>

            <div className="pt-2 flex items-center gap-3">
              <button
                type="submit"
                className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl text-xs font-bold bg-[#242424] text-white hover:bg-[#303030] border border-brand-border transition-colors"
              >
                <Save className="w-4 h-4" />
                <span>Save GitHub Sync Config</span>
              </button>
            </div>
          </form>
        </section>
      </div>
    </AdminLayout>
  );
}
