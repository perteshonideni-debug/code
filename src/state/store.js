import { calculateLevel, calculateStreak, calculateTotalXp } from '../services/achievements.js';
import { isSupabaseConfigured, supabaseClient } from '../services/supabase.js';

const STORAGE_KEY = 'codepath-progress-v1';

function readProgress() {
  try {
    const saved = JSON.parse(localStorage.getItem(STORAGE_KEY) ?? '{}');
    return {
      completedLessons: Array.isArray(saved.completedLessons) ? saved.completedLessons : [],
      quizzes: saved.quizzes && typeof saved.quizzes === 'object' ? saved.quizzes : {},
      workshops: saved.workshops && typeof saved.workshops === 'object' ? saved.workshops : {},
      lessonActivities: saved.lessonActivities && typeof saved.lessonActivities === 'object' ? saved.lessonActivities : {},
      chapterProgress: saved.chapterProgress && typeof saved.chapterProgress === 'object' ? saved.chapterProgress : {},
      activityDates: Array.isArray(saved.activityDates) ? saved.activityDates : [],
      activityLog: Array.isArray(saved.activityLog) ? saved.activityLog : []
    };
  } catch {
    return {
      completedLessons: [],
      quizzes: {},
      workshops: {},
      lessonActivities: {},
      chapterProgress: {},
      activityDates: [],
      activityLog: []
    };
  }
}

let state = readProgress();
const listeners = new Set();

function recordActivity(title, xpEarned = 0) {
  const today = new Date().toISOString().slice(0, 10);
  const now = new Date().toISOString();
  const dates = Array.from(new Set([...(state.activityDates ?? []), today]));
  const logItem = { title, xpEarned, timestamp: now };
  const activityLog = [logItem, ...(state.activityLog ?? [])].slice(0, 30);
  state = { ...state, activityDates: dates, activityLog };
}

function persist() {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    listeners.forEach(listener => listener(state));
    return true;
  } catch {
    return false;
  }
}

export const progressStore = {
  get state() { return state; },
  get completedLessons() { return state.completedLessons; },
  get activityDates() { return state.activityDates ?? []; },
  get activityLog() { return state.activityLog ?? []; },

  isComplete(id) { return state.completedLessons.includes(id); },
  getLessonActivity(id) { return state.lessonActivities?.[id] ?? {}; },

  saveLessonActivity(id, patch) {
    const value = { ...(state.lessonActivities?.[id] ?? {}), ...patch, updatedAt: new Date().toISOString() };
    const lessonActivities = { ...(state.lessonActivities ?? {}), [id]: value };
    const completedLessons = new Set(state.completedLessons);
    const wasComplete = completedLessons.has(id);
    if (value.comprehensionPassed && value.exampleCompleted && value.exercisePassed && value.reviewPassed) {
      completedLessons.add(id);
      if (!wasComplete) recordActivity(`Përfundove mësimin ${id}`, 50);
    } else if (patch.exercisePassed) {
      recordActivity(`Kalove testet e ushtrimit në ${id}`, 25);
    }
    state = { ...state, lessonActivities, completedLessons: [...completedLessons] };
    return persist();
  },

  toggleLesson(id) {
    const completed = new Set(state.completedLessons);
    completed.has(id) ? completed.delete(id) : completed.add(id);
    state = { ...state, completedLessons: [...completed] };
    return persist();
  },

  isQuizComplete(id) { return Boolean(state.quizzes[id]?.passed); },
  getQuizResult(id) { return state.quizzes[id] ?? null; },

  saveQuizAttempt(id, result) {
    const previous = state.quizzes[id];
    const justPassed = !previous?.passed && result.passed;
    if (justPassed) recordActivity(`Kalove kuizin ${id}`, 40);
    state = {
      ...state,
      quizzes: {
        ...state.quizzes,
        [id]: {
          attempts: (previous?.attempts ?? 0) + 1,
          passed: Boolean(previous?.passed || result.passed),
          latestScore: result.score,
          latestAnswers: result.answers,
          latestScoreByQuestion: result.latestScoreByQuestion,
          updatedAt: new Date().toISOString()
        }
      }
    };
    return persist();
  },

  getWorkshop(id) { return state.workshops[id] ?? { currentStep: 0, completedSteps: [], attempts: {} }; },

  getChapterProgress(id) {
    return state.chapterProgress?.[id] ?? {
      stage: 'literature',
      literatureRead: [],
      knowledge: {},
      exercises: {},
      gameMissions: [],
      exam: null,
      projectPassed: false,
      projectAttempts: 0,
      taskIndex: 0,
      missionIndex: 0
    };
  },

  saveChapterProgress(id, patch) {
    const previous = this.getChapterProgress(id);
    if (!previous.exam?.passed && patch.exam?.passed) {
      recordActivity(`Kalove provimin e kapitullit ${id}`, 120);
    } else if (!previous.projectPassed && patch.projectPassed) {
      recordActivity(`Kalove projektin e kapitullit ${id}`, 75);
    }
    state = {
      ...state,
      chapterProgress: {
        ...(state.chapterProgress ?? {}),
        [id]: { ...previous, ...patch, updatedAt: new Date().toISOString() }
      }
    };
    return persist();
  },

  setWorkshopStep(id, currentStep) {
    const previous = this.getWorkshop(id);
    state = { ...state, workshops: { ...state.workshops, [id]: { ...previous, currentStep, updatedAt: new Date().toISOString() } } };
    return persist();
  },

  saveWorkshopAttempt(id, stepId, result) {
    const previous = this.getWorkshop(id);
    const completedSteps = new Set(previous.completedSteps ?? []);
    if (result.passed && !completedSteps.has(stepId)) {
      completedSteps.add(stepId);
      recordActivity(`Hapi ${stepId} i workshop-it ${id} u kalua`, 25);
    }
    state = {
      ...state,
      workshops: {
        ...state.workshops,
        [id]: {
          ...previous,
          completedSteps: [...completedSteps],
          attempts: { ...(previous.attempts ?? {}), [stepId]: (previous.attempts?.[stepId] ?? 0) + 1 },
          updatedAt: new Date().toISOString()
        }
      }
    };
    return persist();
  },

  isWorkshopStepComplete(id, stepId) {
    return this.getWorkshop(id).completedSteps?.includes(stepId) ?? false;
  },

  getStats() {
    const totalXp = calculateTotalXp(state);
    const streak = calculateStreak(state.activityDates ?? []);
    const levelInfo = calculateLevel(totalXp);
    return {
      totalXp,
      streak,
      levelInfo,
      completedLessonsCount: state.completedLessons.length,
      activityLog: state.activityLog ?? []
    };
  },

  async syncWithSupabase(userId, accessToken) {
    if (!isSupabaseConfigured() || !userId || !accessToken) return false;
    try {
      const stats = this.getStats();
      await supabaseClient.db.upsertProfile({
        id: userId,
        xp: stats.totalXp,
        streak_days: stats.streak,
        last_activity_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      }, accessToken);
      return true;
    } catch {
      return false;
    }
  },

  subscribe(listener) {
    listeners.add(listener);
    return () => listeners.delete(listener);
  }
};
