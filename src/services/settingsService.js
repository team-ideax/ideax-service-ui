import initialSettings from '../data/settings.json';
import { downloadJsonFile } from './projectService';

const STORAGE_KEY = 'ideax_settings_data';

class SettingsService {
  constructor() {
    this.listeners = [];
  }

  subscribe(fn) {
    this.listeners.push(fn);
    return () => {
      this.listeners = this.listeners.filter(l => l !== fn);
    };
  }

  notify() {
    this.listeners.forEach(fn => fn());
  }

  getSettings() {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(initialSettings));
      return initialSettings;
    }
    try {
      return { ...initialSettings, ...JSON.parse(raw) };
    } catch {
      return initialSettings;
    }
  }

  saveSettings(settings) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(settings));
    this.notify();
  }

  updateSettings(updatedSettings) {
    const current = this.getSettings();
    const merged = {
      ...current,
      ...updatedSettings,
      about: {
        ...current.about,
        ...(updatedSettings.about || {})
      },
      socialLinks: {
        ...current.socialLinks,
        ...(updatedSettings.socialLinks || {})
      },
      theme: {
        ...current.theme,
        ...(updatedSettings.theme || {})
      }
    };
    this.saveSettings(merged);
    return { success: true, settings: merged };
  }

  exportJSON() {
    const data = this.getSettings();
    downloadJsonFile('settings.json', data);
  }

  resetToDefault() {
    this.saveSettings(initialSettings);
  }
}

export const settingsService = new SettingsService();
