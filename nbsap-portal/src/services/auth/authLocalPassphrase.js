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
// To change: compute SHA-256 of your desired passphrase and replace this value
const DEFAULT_HASH = 'fcc1682b158fe80d089f1627dd31cf5fa6bf2162058ac3e688d24fe03cc538f8';

let isAuthenticated = false;
let currentUser = null;

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

  const hash = await sha256(passphrase);
  const storedHash = getPassphraseHash();

  if (hash === storedHash) {
    isAuthenticated = true;
    currentUser = 'admin';
    return { success: true };
  }

  return { success: false, error: 'Invalid passphrase' };
}

/**
 * Logs out — clears session authentication.
 */
export function logout() {
  isAuthenticated = false;
  currentUser = null;
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
