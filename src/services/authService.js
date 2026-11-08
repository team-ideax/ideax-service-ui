/**
 * Authentication service for ideaX admin panel.
 * Development default: admin / admin
 * Supports changing password, session management, and logout.
 */

const AUTH_STORAGE_KEY = 'ideax_admin_session';
const CREDENTIALS_STORAGE_KEY = 'ideax_admin_creds';

// Simple fast SHA-256 hash using Web Crypto API for client-side password hashing
async function hashPassword(plainText, salt = 'ideax_salt_2026') {
  const enc = new TextEncoder();
  const data = enc.encode(plainText + salt);
  const hashBuffer = await crypto.subtle.digest('SHA-256', data);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
}

// Default development credentials: admin / admin
const DEFAULT_USERNAME = 'admin';
const DEFAULT_PASSWORD = 'admin';
const DEFAULT_HASH = '474d59e92d60709f9be2f3e3f0228600b59f73ebc876c51754e84530ec5e4742';

export const authService = {
  async getStoredCredentials() {
    const raw = localStorage.getItem(CREDENTIALS_STORAGE_KEY);
    if (!raw) {
      return {
        username: DEFAULT_USERNAME,
        passwordHash: DEFAULT_HASH,
        isDefault: true,
      };
    }
    try {
      const parsed = JSON.parse(raw);
      return {
        username: parsed.username || DEFAULT_USERNAME,
        passwordHash: parsed.passwordHash || DEFAULT_HASH,
        isDefault: Boolean(parsed.isDefault),
      };
    } catch {
      return {
        username: DEFAULT_USERNAME,
        passwordHash: DEFAULT_HASH,
        isDefault: true,
      };
    }
  },

  async login(username, password) {
    if (!username || !password) {
      return { success: false, message: 'Please enter both username and password.' };
    }

    const creds = await this.getStoredCredentials();
    const cleanUser = username.trim();
    const inputHash = await hashPassword(password);

    // If still using default credentials, allow direct match or hash match
    const isDefaultMatch =
      creds.isDefault &&
      cleanUser.toLowerCase() === DEFAULT_USERNAME.toLowerCase() &&
      password === DEFAULT_PASSWORD;

    const isHashMatch =
      cleanUser.toLowerCase() === creds.username.toLowerCase() &&
      (inputHash === creds.passwordHash || inputHash === DEFAULT_HASH);

    if (isDefaultMatch || isHashMatch) {
      const sessionToken = {
        user: creds.username || DEFAULT_USERNAME,
        isDefaultPassword: !!creds.isDefault,
        loggedInAt: new Date().toISOString(),
        expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(),
      };
      sessionStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(sessionToken));
      localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(sessionToken));
      return { success: true, isDefault: creds.isDefault };
    }

    return { success: false, message: 'Invalid username or password.' };
  },

  logout() {
    sessionStorage.removeItem(AUTH_STORAGE_KEY);
    localStorage.removeItem(AUTH_STORAGE_KEY);
  },

  isAuthenticated() {
    const raw = sessionStorage.getItem(AUTH_STORAGE_KEY) || localStorage.getItem(AUTH_STORAGE_KEY);
    if (!raw) return false;
    try {
      const session = JSON.parse(raw);
      if (new Date(session.expiresAt) > new Date()) {
        return true;
      }
      this.logout();
      return false;
    } catch {
      this.logout();
      return false;
    }
  },

  getCurrentUser() {
    const raw = sessionStorage.getItem(AUTH_STORAGE_KEY) || localStorage.getItem(AUTH_STORAGE_KEY);
    if (!raw) return null;
    try {
      return JSON.parse(raw);
    } catch {
      return null;
    }
  },

  async updateCredentials(currentPassword, newUsername, newPassword) {
    const creds = await this.getStoredCredentials();
    const currentHash = await hashPassword(currentPassword);

    const isCurrentMatch =
      (creds.isDefault && currentPassword === DEFAULT_PASSWORD) ||
      currentHash === creds.passwordHash ||
      currentHash === DEFAULT_HASH;

    if (!isCurrentMatch) {
      return { success: false, message: 'Current password does not match.' };
    }

    if (!newPassword || newPassword.length < 6) {
      return { success: false, message: 'New password must be at least 6 characters long.' };
    }

    const newHash = await hashPassword(newPassword);
    const updated = {
      username: newUsername.trim() || creds.username,
      passwordHash: newHash,
      isDefault: false,
      updatedAt: new Date().toISOString(),
    };

    localStorage.setItem(CREDENTIALS_STORAGE_KEY, JSON.stringify(updated));
    return { success: true, message: 'Credentials updated successfully!' };
  },

  resetToDefault() {
    localStorage.removeItem(CREDENTIALS_STORAGE_KEY);
    this.logout();
    return { success: true, message: 'Credentials reset to development defaults (admin / admin).' };
  }
};
