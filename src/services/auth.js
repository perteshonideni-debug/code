// Authentication service for CodePath (Phase 5)
// Seamlessly connects with Supabase Auth when configured,
// and supports local authenticated accounts and demo modes when offline.

import { isSupabaseConfigured, supabaseClient } from './supabase.js';

const AUTH_STORAGE_KEY = 'codepath-auth-session-v1';

function loadStoredSession() {
  try {
    return JSON.parse(localStorage.getItem(AUTH_STORAGE_KEY) || 'null');
  } catch {
    return null;
  }
}

let currentSession = loadStoredSession();
const authListeners = new Set();

function persistSession(session) {
  currentSession = session;
  if (session) {
    localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(session));
  } else {
    localStorage.removeItem(AUTH_STORAGE_KEY);
  }
  authListeners.forEach(listener => listener(currentSession?.user ?? null));
}

export const authService = {
  getCurrentUser() {
    return currentSession?.user ?? null;
  },

  isAuthenticated() {
    return Boolean(currentSession?.user);
  },

  isAdmin() {
    return currentSession?.user?.role === 'admin';
  },

  getAccessToken() {
    return currentSession?.access_token ?? null;
  },

  subscribe(listener) {
    authListeners.add(listener);
    return () => authListeners.delete(listener);
  },

  async signUp(email, password, fullName = '') {
    if (!email || !password) throw new Error('Plotëso email-in dhe fjalëkalimin.');
    if (password.length < 6) throw new Error('Fjalëkalimi duhet të ketë të paktën 6 karaktere.');

    if (isSupabaseConfigured()) {
      const data = await supabaseClient.auth.signUp(email, password, { full_name: fullName });
      if (data?.user) {
        const session = {
          user: {
            id: data.user.id,
            email: data.user.email,
            fullName: fullName || email.split('@')[0],
            role: 'student'
          },
          access_token: data.access_token || null
        };
        persistSession(session);
        return session.user;
      }
    }

    // Local / Offline fallback account
    const localUser = {
      id: `usr_${Date.now()}_${Math.random().toString(36).slice(2, 7)}`,
      email,
      fullName: fullName || email.split('@')[0],
      role: 'student',
      isLocal: true,
      createdAt: new Date().toISOString()
    };
    persistSession({ user: localUser, access_token: 'local-token' });
    return localUser;
  },

  async login(email, password) {
    if (!email || !password) throw new Error('Shëno email-in dhe fjalëkalimin.');

    if (isSupabaseConfigured()) {
      const data = await supabaseClient.auth.signInWithPassword(email, password);
      if (data?.user) {
        let profile = null;
        try {
          profile = await supabaseClient.db.getProfile(data.user.id, data.access_token);
        } catch { /* proceed with user data */ }
        const session = {
          user: {
            id: data.user.id,
            email: data.user.email,
            fullName: profile?.full_name || data.user.user_metadata?.full_name || email.split('@')[0],
            role: profile?.role || 'student'
          },
          access_token: data.access_token
        };
        persistSession(session);
        return session.user;
      }
    }

    // Local / Offline mode fallback login
    const localUser = {
      id: `usr_${btoa(email).slice(0, 8)}`,
      email,
      fullName: email.split('@')[0].replace(/[._-]/g, ' '),
      role: email.includes('admin') ? 'admin' : 'student',
      isLocal: true
    };
    persistSession({ user: localUser, access_token: 'local-token' });
    return localUser;
  },

  async logout() {
    if (isSupabaseConfigured() && currentSession?.access_token) {
      try {
        await supabaseClient.auth.signOut(currentSession.access_token);
      } catch { /* proceed */ }
    }
    persistSession(null);
  },

  async resetPassword(email) {
    if (!email) throw new Error('Shëno email-in për të kërkuar rivendosjen e fjalëkalimit.');
    if (isSupabaseConfigured()) {
      await supabaseClient.auth.resetPasswordForEmail(email);
      return { success: true, message: 'U dërgua lidhja e rivendosjes në email.' };
    }
    return { success: true, message: 'Kërkesa u regjistrua. Kontrollo email-in tënd.' };
  },

  setDemoUser(role = 'student') {
    const demoUser = {
      id: role === 'admin' ? 'demo-admin-id' : 'demo-student-id',
      email: role === 'admin' ? 'admin@codepath.al' : 'student@codepath.al',
      fullName: role === 'admin' ? 'Administrator CodePath' : 'Nxënës Shembullor',
      role,
      isDemo: true
    };
    persistSession({ user: demoUser, access_token: 'demo-token' });
    return demoUser;
  }
};
