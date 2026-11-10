// Supabase integration service for CodePath (Phase 5)
// Operates with real Supabase instance when VITE_SUPABASE_URL & VITE_SUPABASE_ANON_KEY are provided.
// Fails gracefully to local-first mode when unconfigured.

const SUPABASE_URL = (import.meta.env?.VITE_SUPABASE_URL || '').replace(/\/$/, '');
const SUPABASE_KEY = import.meta.env?.VITE_SUPABASE_ANON_KEY || '';

export const isSupabaseConfigured = () => Boolean(SUPABASE_URL && SUPABASE_KEY);

async function request(endpoint, options = {}, token = null) {
  if (!isSupabaseConfigured()) throw new Error('Supabase is not configured.');
  const url = `${SUPABASE_URL}${endpoint}`;
  const headers = {
    'Content-Type': 'application/json',
    apikey: SUPABASE_KEY,
    Authorization: `Bearer ${token || SUPABASE_KEY}`,
    ...(options.headers || {})
  };
  const response = await fetch(url, { ...options, headers });
  const data = await response.json().catch(() => null);
  if (!response.ok) {
    const errorMsg = data?.error_description || data?.msg || data?.message || `Request failed (${response.status})`;
    throw new Error(errorMsg);
  }
  return data;
}

export const supabaseClient = {
  auth: {
    async signUp(email, password, data = {}) {
      return request('/auth/v1/signup', {
        method: 'POST',
        body: JSON.stringify({ email, password, data })
      });
    },
    async signInWithPassword(email, password) {
      return request('/auth/v1/token?grant_type=password', {
        method: 'POST',
        body: JSON.stringify({ email, password })
      });
    },
    async signOut(accessToken) {
      return request('/auth/v1/logout', { method: 'POST' }, accessToken);
    },
    async resetPasswordForEmail(email) {
      return request('/auth/v1/recover', {
        method: 'POST',
        body: JSON.stringify({ email })
      });
    },
    async getUser(accessToken) {
      return request('/auth/v1/user', { method: 'GET' }, accessToken);
    }
  },
  db: {
    async getProfile(userId, accessToken) {
      const data = await request(`/rest/v1/profiles?id=eq.${userId}&select=*`, { method: 'GET' }, accessToken);
      return data?.[0] || null;
    },
    async upsertProfile(profile, accessToken) {
      return request('/rest/v1/profiles', {
        method: 'POST',
        headers: { Prefer: 'resolution=merge-duplicates,return=representation' },
        body: JSON.stringify(profile)
      }, accessToken);
    },
    async getLessonProgress(userId, accessToken) {
      return request(`/rest/v1/lesson_progress?user_id=eq.${userId}&select=*`, { method: 'GET' }, accessToken);
    },
    async saveLessonProgress(progressRecord, accessToken) {
      return request('/rest/v1/lesson_progress', {
        method: 'POST',
        headers: { Prefer: 'resolution=merge-duplicates,return=representation' },
        body: JSON.stringify(progressRecord)
      }, accessToken);
    },
    async getUserAchievements(userId, accessToken) {
      return request(`/rest/v1/user_achievements?user_id=eq.${userId}&select=*`, { method: 'GET' }, accessToken);
    },
    async awardAchievement(userId, achievementId, accessToken) {
      return request('/rest/v1/user_achievements', {
        method: 'POST',
        headers: { Prefer: 'resolution=ignore-duplicates,return=representation' },
        body: JSON.stringify({ user_id: userId, achievement_id: achievementId })
      }, accessToken);
    }
  }
};
