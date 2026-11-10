// Achievements and Student Engagement Engine for CodePath (Phase 5 & 10)

export const ACHIEVEMENTS = [
  {
    id: 'first_steps',
    title: 'Hapat e Parë',
    titleEn: 'First Steps',
    description: 'Përfundo mësimin tënd të parë në CodePath.',
    icon: '🚀',
    category: 'learning',
    xpReward: 50,
    check: state => (state.completedLessons?.length ?? 0) >= 1
  },
  {
    id: 'curious_mind',
    title: 'Mendje Kurioze',
    titleEn: 'Curious Mind',
    description: 'Përfundo me sukses 5 mësime të plota.',
    icon: '💡',
    category: 'learning',
    xpReward: 100,
    check: state => (state.completedLessons?.length ?? 0) >= 5
  },
  {
    id: 'python_practitioner',
    title: 'Praktikant i Python-it',
    titleEn: 'Python Practitioner',
    description: 'Përfundo 10 mësime në kurrikulë.',
    icon: '🐍',
    category: 'learning',
    xpReward: 150,
    check: state => (state.completedLessons?.length ?? 0) >= 10
  },
  {
    id: 'quiz_ace',
    title: 'Mjeshtër i Kuizeve',
    titleEn: 'Quiz Ace',
    description: 'Kalo një kuiz me rezultat të plotë 100%.',
    icon: '🎯',
    category: 'assessment',
    xpReward: 75,
    check: state => Object.values(state.quizzes ?? {}).some(q => q.passed)
  },
  {
    id: 'email_architect',
    title: 'Arkitekt i Programeve',
    titleEn: 'Workshop Architect',
    description: 'Përfundo të gjithë hapat e workshop-it Email Simulator.',
    icon: '📧',
    category: 'workshop',
    xpReward: 200,
    check: state => (state.workshops?.['email-simulator']?.completedSteps?.length ?? 0) >= 12
  },
  {
    id: 'chapter_champion',
    title: 'Kampion i Kapitullit',
    titleEn: 'Chapter Champion',
    description: 'Kalo provimin e plotë praktik të një kapitulli.',
    icon: '🥇',
    category: 'assessment',
    xpReward: 150,
    check: state => Object.values(state.chapterProgress ?? {}).some(cp => cp.exam?.passed)
  },
  {
    id: 'game_conqueror',
    title: 'Misionar i Lojërave',
    titleEn: 'Game Pathfinder',
    description: 'Zgjidh të gjitha misionet e një loje kapitulli.',
    icon: '🎮',
    category: 'practice',
    xpReward: 100,
    check: state => Object.values(state.chapterProgress ?? {}).some(cp => Array.isArray(cp.gameMissions) && cp.gameMissions.length >= 3)
  },
  {
    id: 'streak_3',
    title: 'Momentum 3-Ditor',
    titleEn: '3-Day Momentum',
    description: 'Mëso për 3 ditë të njëpasnjëshme.',
    icon: '🔥',
    category: 'streak',
    xpReward: 100,
    check: (state, meta) => (meta?.streak ?? 0) >= 3
  },
  {
    id: 'streak_7',
    title: 'Përkushtim i Plotë',
    titleEn: '7-Day Dedication',
    description: 'Mbaj serinë aktive për 7 ditë radhazi.',
    icon: '🏆',
    category: 'streak',
    xpReward: 250,
    check: (state, meta) => (meta?.streak ?? 0) >= 7
  },
  {
    id: 'full_mastery',
    title: 'Diplomant i Kursit',
    titleEn: 'Course Graduate',
    description: 'Përfundo të gjithë 7 kapitujt e Python Fundamentals.',
    icon: '🎓',
    category: 'mastery',
    xpReward: 500,
    check: state => {
      const chapters = ['getting-started', 'decisions-and-repetition', 'working-with-collections', 'reusable-behavior', 'objects-and-state', 'advanced-language-tools', 'project-foundations'];
      return chapters.every(id => state.chapterProgress?.[id]?.exam?.passed);
    }
  }
];

export function calculateTotalXp(state) {
  let xp = 0;
  // 50 XP per completed lesson
  xp += (state.completedLessons?.length ?? 0) * 50;
  // 25 XP per passed exercise across lesson activities
  Object.values(state.lessonActivities ?? {}).forEach(act => {
    if (act.comprehensionPassed) xp += 15;
    if (act.exampleCompleted) xp += 10;
    if (act.exercisePassed) xp += 25;
    if (act.reviewPassed) xp += 20;
  });
  // 40 XP per passed quiz
  Object.values(state.quizzes ?? {}).forEach(q => {
    if (q.passed) xp += 40;
  });
  // 25 XP per completed workshop step
  Object.values(state.workshops ?? {}).forEach(ws => {
    xp += (ws.completedSteps?.length ?? 0) * 25;
  });
  // Chapter progress rewards
  Object.values(state.chapterProgress ?? {}).forEach(cp => {
    if (cp.projectPassed) xp += 75;
    if (cp.labPassed) xp += 50;
    if (cp.gameMissions?.length) xp += cp.gameMissions.length * 20;
    if (cp.exam?.passed) xp += 120;
  });
  return xp;
}

export function calculateStreak(activityDates = []) {
  if (!activityDates.length) return 0;
  const uniqueDates = Array.from(new Set(activityDates.map(d => String(d).slice(0, 10)))).sort().reverse();
  if (!uniqueDates.length) return 0;

  const today = new Date().toISOString().slice(0, 10);
  const yesterday = new Date(Date.now() - 86400000).toISOString().slice(0, 10);

  const mostRecent = uniqueDates[0];
  if (mostRecent !== today && mostRecent !== yesterday) {
    return 0; // Streak broken
  }

  let streak = 0;
  let expectedDate = new Date(mostRecent);

  for (const dateStr of uniqueDates) {
    const currentDate = new Date(dateStr);
    const diffDays = Math.round((expectedDate - currentDate) / (1000 * 60 * 60 * 24));
    if (diffDays === 0) {
      streak += 1;
      expectedDate = new Date(currentDate.getTime() - 86400000);
    } else {
      break;
    }
  }
  return streak;
}

export function calculateLevel(xp) {
  const levels = [
    { level: 1, title: 'Fillestar', minXp: 0, maxXp: 200 },
    { level: 2, title: 'Praktikant', minXp: 200, maxXp: 500 },
    { level: 3, title: 'Zhvillues', minXp: 500, maxXp: 1000 },
    { level: 4, title: 'Inxhinier', minXp: 1000, maxXp: 2000 },
    { level: 5, title: 'Mjeshtër', minXp: 2000, maxXp: 5000 }
  ];
  const current = levels.find(l => xp >= l.minXp && xp < l.maxXp) || levels[levels.length - 1];
  const progressInLevel = Math.min(100, Math.max(0, Math.round(((xp - current.minXp) / (current.maxXp - current.minXp)) * 100)));
  return {
    level: current.level,
    title: current.title,
    xp,
    nextLevelXp: current.maxXp,
    percent: progressInLevel
  };
}

export function evaluateAchievements(state, streak = 0) {
  const meta = { streak };
  return ACHIEVEMENTS.map(badge => ({
    ...badge,
    isUnlocked: Boolean(badge.check(state, meta))
  }));
}
