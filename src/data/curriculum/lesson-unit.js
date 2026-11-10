import { behavior, check, createLesson } from './lesson-builder.js';

export function unit(data) {
  const [question, answer, ...distractors] = data.check;
  const [reviewQuestion, reviewAnswer, ...reviewDistractors] = data.review;
  const checks = (data.exercise.tests ?? []).map(test => behavior(test[0], test[1], test[2] ?? 'Review the requirement and compare your result with the expected behavior.'));
  return createLesson({
    ...data,
    knowledgeCheck: check(`${data.id}-understand`, question, answer, data.checkExplanation ?? answer, [answer, ...distractors]),
    interactiveExample: {
      prompt: data.interactivePrompt,
      starterCode: data.interactiveCode ?? data.example,
      changedFromExample: data.interactiveCode ?? data.example
    },
    exercise: { ...data.exercise, checks },
    review: check(`${data.id}-review`, reviewQuestion, reviewAnswer, data.reviewExplanation ?? reviewAnswer, [reviewAnswer, ...reviewDistractors])
  });
}
