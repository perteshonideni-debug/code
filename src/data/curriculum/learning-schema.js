export const DIFFICULTY_LEVELS = Object.freeze([
  { id: 'beginner', number: 1, title: 'Fillestar', independence: 'Shembuj të plotë dhe udhëzime të drejtpërdrejta.' },
  { id: 'basic', number: 2, title: 'Bazë', independence: 'Kod fillestar i pjesshëm dhe kërkesa të qarta.' },
  { id: 'intermediate', number: 3, title: 'Ndërmjetëm', independence: 'Skelet i shkurtër; nxënësi zgjedh hapat.' },
  { id: 'advanced', number: 4, title: 'I avancuar', independence: 'Pak orientim; përfshihen raste kufitare.' },
  { id: 'independent', number: 5, title: 'Praktikë e pavarur', independence: 'Pa zgjidhje të nisur; kërkohen vendime të pavarura.' }
]);

export const LEARNING_BLOCK_TYPES = Object.freeze(['lecture', 'workshop', 'lab', 'review', 'quiz', 'game', 'project']);

export function createTopic({ id, title, prerequisites = [], lessons = [], levels = [] }) {
  if (!id || !title || levels.length !== DIFFICULTY_LEVELS.length) throw new Error(`Tema ${id ?? '(pa id)'} duhet të ketë pesë nivele.`);
  const normalizedLevels = levels.map((level, index) => {
    const metadata = DIFFICULTY_LEVELS[index];
    if ((level.exercises?.length ?? 0) < 2) throw new Error(`Tema ${id}, niveli ${metadata.title}: duhen të paktën dy ushtrime të pavarura.`);
    return { ...metadata, ...level, id: metadata.id, number: metadata.number, title: metadata.title, exercises: level.exercises };
  });
  return { id, title, prerequisites, lessons, levels: normalizedLevels };
}

export function createLearningModule({ id, title, prerequisites = [], topics = [], blocks = [] }) {
  return { id, title, prerequisites, topics, blocks };
}

export function validateLearningChapter(chapter, externalTopicIds = []) {
  const errors = [];
  const topicIds = new Set();
  const knownTopicIds = new Set(externalTopicIds);
  const moduleIds = new Set();
  for (const module of chapter.learningModules ?? []) {
    for (const prerequisite of module.prerequisites ?? []) if (!moduleIds.has(prerequisite)) errors.push(`Parakushti i modulit ${module.id} nuk është mësuar më parë: ${prerequisite}`);
    for (const topic of module.topics ?? []) {
      if (topicIds.has(topic.id)) errors.push(`ID teme e përsëritur: ${topic.id}`);
      for (const prerequisite of topic.prerequisites ?? []) if (!knownTopicIds.has(prerequisite)) errors.push(`Parakushti i temës ${topic.id} nuk është mësuar më parë: ${prerequisite}`);
      topicIds.add(topic.id);
      knownTopicIds.add(topic.id);
      if (topic.levels?.length !== DIFFICULTY_LEVELS.length) errors.push(`${topic.title}: priten pesë nivele.`);
      for (const level of topic.levels ?? []) {
        if (level.exercises?.length < 2) errors.push(`${topic.title}/${level.title}: duhen të paktën dy ushtrime.`);
        for (const exercise of level.exercises ?? []) {
          if (!exercise.id || !exercise.instructions || !exercise.checks?.length) errors.push(`${topic.title}/${level.title}: ushtrim i paplotë.`);
        }
      }
    }
    for (const block of module.blocks ?? []) if (!LEARNING_BLOCK_TYPES.includes(block.type)) errors.push(`Lloj blloku i panjohur: ${block.type}`);
    moduleIds.add(module.id);
  }
  return errors;
}
