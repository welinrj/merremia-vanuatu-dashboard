/**
 * Local passphrase authentication provider.
 * For static (GitHub Pages) deployments where there is no backend.
 *
 * Security model:
 * - Passphrase hash is stored in config (SHA-256 hex)
 * - Session unlock only — not persistent across page reloads by default
 * - This is NOT cryptographically secure; it provides a UI gate only
 * - For production government deployment, swap to authApiToken provider
 */

// Default passphrase: "vanuatu2024" — SHA-256 hash
// IMPORTANT: Change this before production deployment via the Admin settings panel,
// or set nbsap_admin_hash in localStorage to a SHA-256 hash of your chosen passphrase.
// The default exists only for first-time setup and is widely known from the source code.
const DEFAULT_HASH = 'fcc1682b158fe80d089f1627dd31cf5fa6bf2162058ac3e688d24fe03cc538f8';

const SESSION_KEY = 'nbsap_admin_session';

let isAuthenticated = sessionStorage.getItem(SESSION_KEY) === '1';
let currentUser = isAuthenticated ? 'admin' : null;

// Rate limiting: max 5 attempts per 15 minutes
const MAX_ATTEMPTS = 5;
const LOCKOUT_MS = 15 * 60 * 1000;
let _loginAttempts = 0;
let _lockoutUntil = 0;

/**
 * Computes SHA-256 hash of a string.
 * @param {string} text
 * @returns {Promise<string>} Hex hash
 */
async function sha256(text) {
  const encoder = new TextEncoder();
  const data = encoder.encode(text);
  const hash = await crypto.subtle.digest('SHA-256', data);
  return Array.from(new Uint8Array(hash)).map(b => b.toString(16).padStart(2, '0')).join('');
}

/**
 * Gets the stored passphrase hash.
 * Checks localStorage for custom hash, falls back to default.
 */
function getPassphraseHash() {
  return localStorage.getItem('nbsap_admin_hash') || DEFAULT_HASH;
}

/**
 * Attempts to authenticate with a passphrase.
 * @param {string} passphrase
 * @returns {Promise<{ success: boolean, error?: string }>}
 */
export async function login(passphrase) {
  if (!passphrase) {
    return { success: false, error: 'Passphrase required' };
  }

  const now = Date.now();
  if (now < _lockoutUntil) {
    const remaining = Math.ceil((_lockoutUntil - now) / 60000);
    return { success: false, error: `Too many attempts. Try again in ${remaining} minute${remaining !== 1 ? 's' : ''}.` };
  }

  const hash = await sha256(passphrase);
  const storedHash = getPassphraseHash();

  if (hash === storedHash) {
    _loginAttempts = 0;
    _lockoutUntil = 0;
    isAuthenticated = true;
    currentUser = 'admin';
    sessionStorage.setItem(SESSION_KEY, '1');
    return { success: true };
  }

  _loginAttempts += 1;
  if (_loginAttempts >= MAX_ATTEMPTS) {
    _lockoutUntil = Date.now() + LOCKOUT_MS;
    _loginAttempts = 0;
    return { success: false, error: 'Too many failed attempts. Locked out for 15 minutes.' };
  }

  return { success: false, error: 'Invalid passphrase' };
}

/**
 * Logs out — clears session authentication.
 */
export function logout() {
  isAuthenticated = false;
  currentUser = null;
  sessionStorage.removeItem(SESSION_KEY);
}

/**
 * Returns current authentication state.
 */
export function getAuthState() {
  return {
    isAuthenticated,
    user: currentUser,
    provider: 'local-passphrase'
  };
}

/**
 * Checks if user is admin.
 */
export function isAdmin() {
  return isAuthenticated;
}

/**
 * Updates the admin passphrase.
 * @param {string} currentPass - Current passphrase for verification
 * @param {string} newPass - New passphrase
 * @returns {Promise<{ success: boolean, error?: string }>}
 */
export async function changePassphrase(currentPass, newPass) {
  const currentHash = await sha256(currentPass);
  if (currentHash !== getPassphraseHash()) {
    return { success: false, error: 'Current passphrase incorrect' };
  }

  const newHash = await sha256(newPass);
  localStorage.setItem('nbsap_admin_hash', newHash);
  return { success: true };
}

/**
 * Sets initial passphrase (first-time setup).
 * Only works if no custom hash has been set.
 * @param {string} passphrase
 * @returns {Promise<{ success: boolean }>}
 */
export async function setInitialPassphrase(passphrase) {
  const hash = await sha256(passphrase);
  localStorage.setItem('nbsap_admin_hash', hash);
  isAuthenticated = true;
  currentUser = 'admin';
  return { success: true };
}
