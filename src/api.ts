// Minimal API helper for CIS KKU endpoints with async storage helpers and a simple fetch wrapper
const BASE = 'https://cis.kku.ac.th/api';

let AUTH_TOKEN: string | null = null;
let API_KEY: string | null = null;

// storage helpers are async. Default implementation uses browser localStorage.
export let storageSet: (key: string, value: string) => Promise<void> = async (key, value) => {
  try {
    localStorage.setItem(key, value);
  } catch (e) {
    // ignore
  }
};

export let storageGet: (key: string) => Promise<string | null> = async (key) => {
  try {
    return localStorage.getItem(key);
  } catch (e) {
    return null;
  }
};

export let storageRemove: (key: string) => Promise<void> = async (key) => {
  try {
    localStorage.removeItem(key);
  } catch (e) {
    // ignore
  }
};

export const setAuthToken = (token: string | null) => {
  AUTH_TOKEN = token;
  if (token) storageSet('token', token);
};

export const setApiKey = (key: string | null) => {
  API_KEY = key;
  if (key) storageSet('apiKey', key);
};

async function request(path: string, opts: RequestInit = {}) {
  const url = path.startsWith('http') ? path : `${BASE}${path}`;
  // attach default headers
  const headers = {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
    ...(opts.headers as Record<string, string> || {}),
    ...(AUTH_TOKEN ? { Authorization: `Bearer ${AUTH_TOKEN}` } : {}),
    // include API key under several common header names to match server requirements
    ...(API_KEY ? { 'x-api-key': API_KEY, 'X-API-Key': API_KEY, 'X_API_KEY': API_KEY } : {}),
  } as Record<string, string>;

  // timeout support with AbortController. Caller can pass opts.signal or opts['_timeout'] (ms)
  const timeoutMs = (opts as any)._timeout || 15000; // default 15s
  const controller = new AbortController();
  const signal = opts.signal || controller.signal;
  const timer = setTimeout(() => controller.abort(), timeoutMs);

  try {
    // debug: log URL and headers so we can confirm API key/header presence in dev console
    try {
      console.debug('[api] request:', url, headers);
    } catch (_) {}
    const res = await fetch(url, { ...opts, headers, signal });
    clearTimeout(timer);
    const contentType = res.headers.get('content-type') || '';
    if (contentType.includes('application/json')) {
      const json = await res.json();
      if (!res.ok) throw json;
      return json;
    }
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    return res.text();
  } catch (err: any) {
    clearTimeout(timer);
    if (err && err.name === 'AbortError') {
      throw new Error(`Request timeout after ${timeoutMs}ms to ${url}`);
    }
    throw err;
  }
}

// quick ping helper to check connectivity (small timeout)
export async function ping(path = '/') {
  try {
    return await request(path.startsWith('http') ? path : `${BASE}${path}`, { method: 'GET', _timeout: 5000 } as any);
  } catch (err) {
    throw err;
  }
}

export async function signIn(email: string, password: string) {
  try {
    const body = { email, password };
    // use classroom signin endpoint (per provided Request URL)
    const data = await request('/classroom/signin', {
      method: 'POST',
      body: JSON.stringify(body),
    });
    // If the API returns { data: { ...user..., token } } shape, prefer returning the inner data object
    if (data && typeof data === 'object' && (data as any).data && typeof (data as any).data === 'object') {
      const inner = (data as any).data;
      const token = inner.token || inner.accessToken;
      if (token) setAuthToken(token);
      return inner;
    }
    const token = data && (data.token || data.accessToken);
    if (token) setAuthToken(token);
    return data;
  } catch (err) {
    throw err;
  }
}

export async function getClassMembers(year: string) {
  return request(`/classroom/class/${year}`);
}

export async function postStatus(token: string | null, content: string) {
  return request('/classroom/status', {
    method: 'POST',
    body: JSON.stringify({ content }),
  });
}

export async function postComment(token: string | null, statusId: string, content: string) {
  return request('/classroom/comment', {
    method: 'POST',
    body: JSON.stringify({ content, statusId }),
  });
}

export async function toggleLike(token: string | null, statusId: string) {
  return request('/classroom/like', {
    method: 'POST',
    body: JSON.stringify({ statusId }),
  });
}

export async function unlikeStatus(token: string | null, statusId: string) {
  return request('/classroom/like', {
    method: 'DELETE',
    body: JSON.stringify({ statusId }),
  });
}

export async function getStatuses() {
  return request('/classroom/status');
}

export async function deleteStatus(statusId: string) {
  return request(`/classroom/status/${statusId}`, {
    method: 'DELETE',
  });
}

export async function getProfile() {
  return request('/classroom/profile');
}

// initStorage: if running in React Native (Expo) we try to use AsyncStorage for persistence.
export async function initStorage() {
  try {
    // dynamic import to avoid bundling issues on web
    const mod = await import('@react-native-async-storage/async-storage');
    const AsyncStorage = mod.default;
    // override storage helpers with AsyncStorage wrappers
    storageGet = async (k: string) => {
      try { return await AsyncStorage.getItem(k); } catch { return null; }
    };
    storageSet = async (k: string, v: string) => { try { await AsyncStorage.setItem(k, v); } catch {} };
    storageRemove = async (k: string) => { try { await AsyncStorage.removeItem(k); } catch {} };
    const token = await storageGet('token');
    const email = await storageGet('email');
    const apiKey = await storageGet('apiKey');
    if (token) setAuthToken(token);
    if (apiKey) setApiKey(apiKey);
    return { token, email, apiKey };
  } catch (e) {
    // fallback to browser localStorage-based getters
    const token = await storageGet('token');
    const email = await storageGet('email');
    const apiKey = await storageGet('apiKey');
    if (token) setAuthToken(token as string);
    if (apiKey) setApiKey(apiKey as string);
    return { token, email, apiKey };
  }
}

export default {
  storageGet,
  storageSet,
  storageRemove,
  setAuthToken,
  setApiKey,
  initStorage,
};
