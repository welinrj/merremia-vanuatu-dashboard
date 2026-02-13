/**
 * API Token authentication provider (Stub for future backend).
 * Drop-in replacement for authLocalPassphrase.js when backend is available.
 */
import ENV from '../../config/env.js';

let authState = { isAuthenticated: false, user: null, token: null };

export async function login(credentials) {
  const resp = await fetch(`${ENV.apiBaseUrl}/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(credentials)
  });

  if (!resp.ok) {
    return { success: false, error: 'Authentication failed' };
  }

  const data = await resp.json();
  authState = { isAuthenticated: true, user: data.user, token: data.token };
  return { success: true };
}

export function logout() {
  authState = { isAuthenticated: false, user: null, token: null };
}

export function getAuthState() {
  return { ...authState, provider: 'api-token' };
}

export function isAdmin() {
  return authState.isAuthenticated && authState.user?.role === 'admin';
}

export function getToken() {
  return authState.token;
}
