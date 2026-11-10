const paragraph = text => ({ type: 'paragraph', text });
const code = (codeText, caption, explanations) => ({ type: 'code', language: 'python', code: codeText, caption, explanations });

export function createLesson({
  id, title, duration = '15 min', lede, objectives, term, definition, detail, syntax, example, explanations, mistake,
  knowledgeCheck, interactiveExample, exercise, review, extra = []
}) {
  return {
    id, type: 'lesson', title, duration, lede, objectives, term, definition, syntax,
    content: [
      { type: 'definition', term, text: definition },
      paragraph(detail),
      ...(syntax ? [{ type: 'syntax', code: syntax }] : []),
      code(example, `${title}: a worked example`, explanations),
      ...extra,
      { type: 'mistake', title: 'A common mistake', text: mistake }
    ],
    knowledgeCheck,
    interactiveExample,
    exercise,
    review
  };
}

export const check = (id, prompt, answer, explanation, options = []) => ({
  id, prompt, options: options.length ? options : [answer, 'It changes the way Python stores every value', 'It is only a comment'], answer, explanation
});

export const behavior = (label, code, feedback) => ({ kind: 'behavior', label, code, feedback });
export const structure = (name, method, label, feedback) => ({ kind: 'structure', name, method, label, feedback });
