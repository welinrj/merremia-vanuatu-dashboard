/**
 * Auth provider facade.
 * All UI code imports auth from here.
 * Uses local passphrase by default; switch to API token via env.js.
 */
import * as localAuth from './authLocalPassphrase.js';

// To use API token auth:
// 1. Change import above to: import * as apiAuth from './authApiTokenStub.js';
// 2. Set ENV.authProvider = 'api-token' and ENV.apiBaseUrl in config/env.js
// 3. Replace localAuth references below with apiAuth

export const { login, logout, getAuthState, isAdmin } = localAuth;
export default localAuth;
