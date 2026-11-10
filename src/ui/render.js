import { allItems, allLessons, curriculum, featuredCourses } from '../data/curriculum.js';
import { progressStore } from '../state/store.js';
import { mountPythonLab, pythonLabMarkup, unmountPythonLab } from './python-lab.js';
import { authService } from '../services/auth.js';

const app = document.querySelector('#app');
const esc = value => String(value).replace(/[&<>"']/g, char => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#039;' }[char]));
const lessons = () => allLessons(curriculum);
const items = () => allItems(curriculum);
const isItemComplete = item => item.type === 'quiz' ? progressStore.isQuizComplete(item.id) : item.type === 'workshop' ? progressStore.getWorkshop(item.id).completedSteps.length >= 12 : progressStore.isComplete(item.id);
const completedCount = () => lessons().filter(lesson => progressStore.isComplete(lesson.id)).length;

function header() {
  const user = authService.getCurrentUser();
  const stats = progressStore.getStats();
  const userActions = user ? `
    <a href="#/dashboard" class="button button-quiet">Paneli Im</a>
    <div class="user-stats-pill" title="Seria dhe XP">
      <span>🔥 <b>${stats.streak}</b></span>
      <span>·</span>
      <span>⚡ <b>${stats.totalXp}</b></span>
    </div>
    <a href="#/logout" class="button button-quiet">Dil</a>
  ` : `
    <a class="button button-quiet" href="#/login">Hyr</a>
    <a class="button button-primary" href="#/courses">Fillo mësimin</a>
  `;

  return `<header class="site-header"><div class="container nav"><a class="brand" href="#/"><span class="brand-mark">&lt;/&gt;</span>CodePath</a><nav class="nav-links" aria-label="Primary"><a href="#/courses">Kurset</a><a href="#/learn/${curriculum.id}">Mësimet</a><a href="#/workshop/email-simulator">Workshop</a>${user ? '<a href="#/dashboard">Paneli</a>' : ''}${user?.role === 'admin' ? '<a href="#/admin" class="admin-badge-nav">Admin</a>' : ''}</nav><div class="nav-actions"><button class="button button-quiet theme-toggle" type="button" data-theme-toggle aria-label="Switch color theme">◐ Theme</button>${userActions}</div></div></header>`;
}

document.addEventListener('click', event => {
  if (!event.target.closest('[data-theme-toggle]')) return;
  const next = document.documentElement.dataset.theme === 'dark' ? 'light' : 'dark';
  document.documentElement.dataset.theme = next;
  try { localStorage.setItem('codepath-theme-v1', next); } catch { /* Theme still works for this page. */ }
});
try { document.documentElement.dataset.theme = localStorage.getItem('codepath-theme-v1') ?? 'light'; } catch { document.documentElement.dataset.theme = 'light'; }

function courseCard(course) {
  const courseLessons = allLessons(course);
  const completed = courseLessons.filter(lesson => progressStore.isComplete(lesson.id)).length;
  return `<article class="course-card"><div class="course-icon" aria-hidden="true">${esc(course.accent)}</div><h3>${esc(course.title)}</h3><p>${esc(course.description)}</p><div class="course-facts"><span>${esc(course.level)}</span><span>${course.modules.length} modules</span><span>${courseLessons.length} lessons</span></div>${completed ? `<p class="course-progress">${completed} of ${courseLessons.length} lessons complete</p>` : ''}<div class="course-card-footer"><span>${esc(course.duration)}</span><a class="button button-secondary" href="#/learn/${course.id}">View course</a></div></article>`;
}

function footer() {
  return `<footer class="footer"><div class="container footer-inner"><span>Â© 2026 CodePath</span><span>Learn with intention Â· Built for the long term</span></div></footer>`;
}

export function renderHome() {
  unmountPythonLab();
  app.innerHTML = `${header()}<main><section class="hero"><div class="container"><p class="eyebrow">A clearer way forward</p><h1>Learn to code with momentum.</h1><p class="hero-copy">CodePath turns intimidating concepts into practical lessons, thoughtful practice, and projects you can be proud of.</p><div class="hero-actions"><a class="button button-primary" href="#/learn/${curriculum.id}">Start learning <span aria-hidden="true">â†’</span></a><a class="button button-secondary" href="#/courses">Explore courses</a></div><div class="hero-note"><span class="avatar-stack" aria-hidden="true"><span class="avatar">CP</span><span class="avatar">PY</span><span class="avatar">01</span></span><span>Learn at your own pace, one clear step at a time.</span></div></div></section><section class="section"><div class="container"><div class="section-heading"><h2 class="editorial">Start with a strong foundation.</h2><p>Focused courses, real examples, and a learning rhythm that helps you keep going.</p></div><div class="course-grid">${featuredCourses.map(courseCard).join('')}</div></div></section><section class="section"><div class="container"><div class="feature-grid"><article class="feature"><span>01 / Learn</span><h3>Make ideas click.</h3><p>Clear explanations connect the syntax to the problems it solves.</p></article><article class="feature"><span>02 / Practice</span><h3>Build your fluency.</h3><p>Short, deliberate exercises make the next concept feel within reach.</p></article><article class="feature"><span>03 / Grow</span><h3>See your progress.</h3><p>A calm, visible path helps you build a habit that lasts.</p></article></div></div></section></main>${footer()}`;
}

export function renderCatalogue() {
  unmountPythonLab();
  app.innerHTML = `${header()}<main class="catalogue-shell"><div class="container"><p class="eyebrow">The library</p><div class="section-heading"><h1 class="editorial">Choose your next chapter.</h1><p>Every path is designed to be practical, approachable, and worth returning to.</p></div><div class="catalogue-toolbar"><label class="sr-only" for="course-search">Search courses</label><input id="course-search" class="search" type="search" placeholder="Search courses" autocomplete="off"><label class="sr-only" for="course-level">Filter by level</label><select id="course-level" class="filter"><option value="all">All levels</option><option value="Beginner">Beginner</option></select></div><p id="catalogue-result" class="catalogue-result" aria-live="polite"></p><div id="catalogue-grid" class="course-grid"></div></div></main>${footer()}`;
  const update = () => {
    const query = document.querySelector('#course-search').value.trim().toLowerCase();
    const level = document.querySelector('#course-level').value;
    const matches = featuredCourses.filter(course => (!query || `${course.title} ${course.description}`.toLowerCase().includes(query)) && (level === 'all' || course.level === level));
    document.querySelector('#catalogue-result').textContent = `${matches.length} course${matches.length === 1 ? '' : 's'} available`;
    document.querySelector('#catalogue-grid').innerHTML = matches.length ? matches.map(courseCard).join('') : '<div class="empty-state"><h3>No courses found</h3><p>Try a different search or level.</p></div>';
  };
  document.querySelector('#course-search').addEventListener('input', update);
  document.querySelector('#course-level').addEventListener('change', update);
  update();
}

function renderInline(text) {
  return esc(text).replace(/`([^`]+)`/g, '<code class="inline-code">$1</code>');
}

function renderBlock(block) {
  switch (block.type) {
    case 'heading': {
      const level = Math.min(4, Math.max(2, Number(block.level) || 2));
      return `<h${level}>${esc(block.text)}</h${level}>`;
    }
    case 'paragraph': return `<p>${renderInline(block.text)}</p>`;
    case 'definition': return `<aside class="lesson-definition"><span>KEY TERM</span><strong>${esc(block.term)}</strong><p>${renderInline(block.text)}</p></aside>`;
    case 'mistake': return `<aside class="lesson-mistake"><strong>${esc(block.title)}</strong><p>${renderInline(block.text)}</p></aside>`;
    case 'syntax': return `<aside class="syntax-card"><span>SYNTAX</span><pre><code>${esc(block.code)}</code></pre></aside>`;
    case 'diagram': return `<figure class="lesson-diagram"><figcaption>${esc(block.title)}</figcaption><div class="diagram-owner"><strong>${esc(block.nodes[0])}</strong><span>contains</span><div>${block.nodes.slice(1).map(node => `<span>${esc(node)}</span>`).join('')}</div></div><p>${esc(block.description)}</p></figure>`;
    case 'list': {
      const tag = block.ordered ? 'ol' : 'ul';
      return `<${tag}>${block.items.map(item => `<li>${renderInline(item)}</li>`).join('')}</${tag}>`;
    }
    case 'code': return `<figure class="lesson-example"><figcaption>${esc(block.caption || block.language || 'Code example')}</figcaption><pre class="code-block"><code>${esc(block.code)}</code></pre>${block.explanations?.length ? `<ol class="line-explanations">${block.explanations.map((line, index) => `<li><span>${index + 1}</span>${esc(line)}</li>`).join('')}</ol>` : ''}</figure>`;
    case 'callout': return `<aside class="callout callout-${esc(block.tone || 'note')}" role="note"><strong>${esc(block.title || 'Note')}</strong><p>${renderInline(block.text)}</p></aside>`;
    case 'table': return `<div class="table-scroll"><table><caption>${esc(block.caption || '')}</caption><thead><tr>${block.headers.map(cell => `<th scope="col">${esc(cell)}</th>`).join('')}</tr></thead><tbody>${block.rows.map(row => `<tr>${row.map(cell => `<td>${esc(cell)}</td>`).join('')}</tr>`).join('')}</tbody></table></div>`;
    case 'image': {
      const src = String(block.src || '');
      if (!/^(https:\/\/|\/)/i.test(src)) return '';
      return `<figure class="lesson-image"><img src="${esc(src)}" alt="${esc(block.alt || '')}" loading="lazy">${block.caption ? `<figcaption>${esc(block.caption)}</figcaption>` : ''}</figure>`;
    }
    case 'example': return `<aside class="example-card"><span class="example-label">Example</span><h3>${esc(block.title)}</h3><p>${renderInline(block.text)}</p>${block.code ? `<pre class="code-block"><code>${esc(block.code)}</code></pre>` : ''}</aside>`;
    case 'exercise': return `<aside class="exercise-card"><span class="exercise-label">Practice</span><h3>${esc(block.title)}</h3><p>${renderInline(block.prompt)}</p><details><summary>Show hint</summary><p>${renderInline(block.hint)}</p></details></aside>`;
    default: return '';
  }
}

function lessonContent(lesson) {
  const blocks = lesson.content ?? (lesson.sections ?? []).flatMap(section => [
    { type: 'heading', text: section.heading },
    ...(section.paragraphs ?? []).map(text => ({ type: 'paragraph', text })),
    ...(section.list ? [{ type: 'list', items: section.list }] : []),
    ...(section.code ? [{ type: 'code', code: section.code }] : []),
    ...(section.callout ? [{ type: 'callout', text: section.callout }] : [])
  ]);
  return blocks.map(renderBlock).join('');
}

function renderQuiz(quiz) {
  const saved = progressStore.getQuizResult(quiz.id);
  const savedAnswers = saved?.latestAnswers ?? {};
  const questions = quiz.questions.map((question, index) => {
    const control = question.selection === 'multiple' ? 'checkbox' : 'radio';
    return `<fieldset class="quiz-question"><legend><span class="question-number">${String(index + 1).padStart(2, '0')}</span>${esc(question.prompt)}</legend><div class="quiz-options">${question.options.map((option, optionIndex) => {
      const checked = (savedAnswers[question.id] ?? []).includes(option);
      return `<label class="quiz-option"><input type="${control}" name="${esc(question.id)}" value="${esc(option)}" ${checked ? 'checked' : ''}><span>${esc(option)}</span></label>`;
    }).join('')}</div></fieldset>`;
  }).join('');
  const feedback = saved ? `<div class="quiz-feedback ${saved.latestScore === quiz.questions.length ? 'is-correct' : 'is-review'}" role="status"><strong>${saved.passed ? 'Passed' : 'Review your answers'}</strong><span>Latest attempt: ${saved.latestScore} of ${quiz.questions.length} correct Â· ${saved.attempts} attempt${saved.attempts === 1 ? '' : 's'}</span>${quiz.questions.map((question, index) => `<p><b>${saved.latestScoreByQuestion?.[question.id] ? 'Correct' : 'Review'} Â· ${index + 1}.</b> ${esc(question.explanation)}</p>`).join('')}</div>` : '';
  return `<section class="quiz-panel"><div class="quiz-intro"><span class="eyebrow">Knowledge check</span><p>${esc(quiz.lede)}</p></div><form id="quiz-form" data-quiz="${esc(quiz.id)}">${questions}<div class="quiz-actions"><button type="submit" class="button button-primary">Check answers</button><span class="quiz-attempt-note">Try again whenever you need. Your best passing result is saved in this browser.</span></div></form><div id="quiz-status" aria-live="polite">${feedback}</div></section>`;
}

function renderSidebar(activeId) {
  return curriculum.modules.map(module => `<details class="curriculum-module" open><summary class="module-heading">${esc(module.title)}</summary>${module.chapters.map(chapter => `<details class="curriculum-chapter" open><summary>${esc(chapter.title)}</summary><a class="chapter-flow-link" href="#/chapter/${esc(chapter.id)}">Open chapter learning sequence <span aria-hidden="true">→</span></a><div class="chapter-items">${chapter.items.map(item => `<a class="lesson-link ${item.id === activeId ? 'active' : ''} ${isItemComplete(item) ? 'complete' : ''}" href="${item.href ?? (item.type === 'lesson' ? `#/chapter/${chapter.id}?lesson=${encodeURIComponent(item.id)}` : `#/chapter/${chapter.id}`)}" ${item.id === activeId ? 'aria-current="page"' : ''}><span class="lesson-check" aria-hidden="true">${isItemComplete(item) ? '✓' : item.type === 'quiz' ? '?' : item.type === 'workshop' ? '↗' : ''}</span><span>${esc(item.title)}</span><span class="sidebar-item-type">${item.type === 'quiz' ? 'Quiz' : item.type === 'workshop' ? 'Workshop' : esc(item.duration)}</span></a>`).join('')}</div></details>`).join('')}</details>`).join('');
}

function renderLesson(item) {
  const progress = progressStore.getLessonActivity(item.id);
  const choices = question => `<fieldset class="quiz-question"><legend>${esc(question.prompt)}</legend>${question.options.map(option => `<label class="quiz-option"><input type="radio" name="${esc(question.id)}" value="${esc(option)}"><span>${esc(option)}</span></label>`).join('')}</fieldset>`;
  const checkForm = (question, kind, passed, locked = false) => `<section class="lesson-check-section ${locked ? 'is-locked' : ''}" data-review-section><p class="eyebrow">${kind === 'knowledge' ? 'Understand' : 'Review'}</p><h2>${kind === 'knowledge' ? 'Check your understanding' : 'A quick lesson review'}</h2><p data-review-lock ${locked ? '' : 'hidden'}>Complete the exercise tests to unlock your review.</p><form data-lesson-check="${kind}" data-question="${esc(question.id)}" ${locked ? 'inert' : ''}>${choices(question)}<button class="button button-secondary" type="submit">${passed ? 'Check again' : 'Check answer'}</button><p data-check-feedback role="status">${passed ? 'Correct — your response is saved.' : ''}</p></form></section>`;
  const complete = progressStore.isComplete(item.id);
  const knowledge = checkForm(item.knowledgeCheck, 'knowledge', Boolean(progress.comprehensionPassed));
  const review = checkForm(item.review, 'review', Boolean(progress.reviewPassed), !progress.exercisePassed);
  return `<div class="lesson-two-panel"><section class="lesson-material"><div class="lesson-kicker"><span>${esc(item.moduleTitle)}</span><span aria-hidden="true">·</span><span>${esc(item.duration)}</span></div><p class="chapter-breadcrumb">${esc(item.chapterTitle)}</p><h1>${esc(item.title)}</h1><p class="lesson-lede">${esc(item.lede)}</p>${item.objectives?.length ? `<section class="objectives"><h2>Learning objectives</h2><ul>${item.objectives.map(objective => `<li>${esc(objective)}</li>`).join('')}</ul></section>` : ''}<div class="lesson-content">${lessonContent(item)}</div>${knowledge}${review}</section><aside class="lesson-practice"><div class="practice-sticky"><div class="practice-progress"><span class="eyebrow">Lesson sequence</span><ol><li class="${progress.comprehensionPassed ? 'is-done' : 'is-current'}">Read and understand</li><li class="${progress.exampleCompleted ? 'is-done' : ''}">Explore an example</li><li class="${progress.exercisePassed ? 'is-done' : ''}">Pass exercise tests</li><li class="${progress.reviewPassed ? 'is-done' : ''}">Review and continue</li></ol></div>${pythonLabMarkup(item)}<p class="completion-status" data-lesson-completion>${complete ? 'Lesson complete — nice work.' : 'Finish each activity to complete this lesson.'}</p></div></aside></div>`;
}

function renderLearning() {
  unmountPythonLab();
  const courseItems = items();
  const activeId = location.hash.split('/')[3] || courseItems[0]?.id;
  const active = courseItems.find(item => item.id === activeId) ?? courseItems[0];
  const completed = courseItems.filter(isItemComplete).length;
  const percent = Math.round(completed / courseItems.length * 100);
  const content = active.type === 'quiz' ? `<div class="lesson-kicker"><span>${esc(active.moduleTitle)}</span><span aria-hidden="true">·</span><span>${esc(active.duration)}</span></div><p class="chapter-breadcrumb">${esc(active.chapterTitle)}</p><h1>${esc(active.title)}</h1>${renderQuiz(active)}` : active.type === 'workshop' ? `<div class="lesson-kicker"><span>${esc(active.moduleTitle)}</span><span aria-hidden="true">·</span><span>${esc(active.duration)}</span></div><p class="chapter-breadcrumb">${esc(active.chapterTitle)}</p><h1>${esc(active.title)}</h1><p class="lesson-lede">${esc(active.lede)}</p><section class="workshop-launch-card"><h2>Ready to put the pieces together?</h2><p>This guided workshop combines constructors, methods, composition, lists, object relationships, and special methods in a complete email system.</p><a class="button button-primary" href="${active.href}">Start Email Simulator</a></section>` : renderLesson(active);
  const activeIndex = courseItems.indexOf(active);
  const nextItem = courseItems[activeIndex + 1];
  const nextControl = nextItem ? isItemComplete(active) ? `<a class="button button-primary" href="${nextItem.href ?? `#/learn/${curriculum.id}/${nextItem.id}`}">Next item →</a>` : '<span class="button button-primary is-disabled" aria-disabled="true" title="Complete this item to continue">Complete this item to continue</span>' : '';
  app.innerHTML = `${header()}<main class="learning-layout"><aside class="learning-sidebar"><a class="sidebar-back" href="#/courses">â† All courses</a><h2 class="sidebar-title">${esc(curriculum.title)}</h2><div class="progress-track" role="progressbar" aria-label="Course progress" aria-valuemin="0" aria-valuemax="100" aria-valuenow="${percent}"><div class="progress-fill" style="width:${percent}%"></div></div><div class="progress-label"><span>${completed} of ${courseItems.length} learning items</span><span>${percent}%</span></div><nav class="lesson-list" id="course-contents" aria-label="Course contents">${renderSidebar(active.id)}</nav><button class="button button-secondary mobile-only" id="toggle-lessons" aria-expanded="false" aria-controls="course-contents">Show course contents</button></aside><article class="lesson-main ${active.type !== 'quiz' ? 'lesson-main-wide' : ''}">${content}<nav class="item-navigation" aria-label="Lesson navigation">${activeIndex > 0 ? `<a class="button button-secondary" href="#/learn/${curriculum.id}/${courseItems[activeIndex - 1].id}">â† Previous</a>` : '<span></span>'}${nextControl}</nav></article></main>`;
  if (active?.type === 'lesson') mountPythonLab({ lesson: active, host: document.querySelector('.python-lab'), onProgress: () => refreshLessonStatus(active) });
  function refreshLessonStatus(lesson) {
    const state = progressStore.getLessonActivity(lesson.id);
    document.querySelector('[data-mode="exercise"]')?.toggleAttribute('disabled', !(state.comprehensionPassed && state.exampleCompleted));
    if (state.exercisePassed) {
      const reviewForm = document.querySelector('[data-lesson-check="review"]');
      reviewForm?.removeAttribute('inert');
      const lock = document.querySelector('[data-review-lock]');
      if (lock) lock.hidden = true;
      reviewForm?.closest('[data-review-section]')?.classList.remove('is-locked');
    }
    {
      const complete = state.comprehensionPassed && state.exampleCompleted && state.exercisePassed && state.reviewPassed;
      const status = document.querySelector('[data-lesson-completion]');
      if (status) status.textContent = complete ? 'Lesson complete — nice work.' : 'Finish each activity to complete this lesson.';
      const rows = document.querySelectorAll('.practice-progress li');
      [state.comprehensionPassed, state.exampleCompleted, state.exercisePassed, state.reviewPassed].forEach((done, index) => { rows[index]?.classList.toggle('is-done', Boolean(done)); rows[index]?.classList.toggle('is-current', !done && rows[index - 1]?.classList.contains('is-done')); });
    }
  }
  document.querySelectorAll('[data-lesson-check]').forEach(form => form.addEventListener('submit', event => {
    event.preventDefault();
    const kind = form.dataset.lessonCheck;
    const question = kind === 'knowledge' ? active.knowledgeCheck : active.review;
    const chosen = form.querySelector('input:checked')?.value;
    const correct = chosen === question.answer;
    const fieldset = form.querySelector('fieldset');
    const feedback = form.querySelector('[data-check-feedback]');
    if (!chosen) { feedback.textContent = 'Choose an answer before checking.'; return; }
    if (correct) progressStore.saveLessonActivity(active.id, { [kind === 'knowledge' ? 'comprehensionPassed' : 'reviewPassed']: true });
    feedback.textContent = correct ? `Correct. ${question.explanation}` : `Not quite. ${question.explanation}`;
    feedback.className = correct ? 'check-correct' : 'check-incorrect';
    if (correct && kind === 'knowledge') document.querySelector('[data-mode="exercise"]')?.removeAttribute('disabled');
    refreshLessonStatus(active);
    if (correct && kind === 'review') renderLearning();
  }));
  document.querySelector('#quiz-form')?.addEventListener('submit', event => {
    event.preventDefault();
    const form = event.currentTarget;
    const answers = {};
    for (const question of active.questions) {
      answers[question.id] = [...form.querySelectorAll(`input[name="${CSS.escape(question.id)}"]:checked`)].map(input => input.value);
    }
    if (Object.values(answers).some(answer => answer.length === 0)) {
      document.querySelector('#quiz-status').innerHTML = '<p class="form-error" role="alert">Answer each question before checking your work.</p>';
      return;
    }
    const questionResults = Object.fromEntries(active.questions.map(question => {
      const selected = [...answers[question.id]].sort();
      const expected = [...question.answer].sort();
      return [question.id, selected.length === expected.length && selected.every((answer, index) => answer === expected[index])];
    }));
    const score = Object.values(questionResults).filter(Boolean).length;
    const persisted = progressStore.saveQuizAttempt(active.id, { score, passed: score === active.questions.length, answers, latestScoreByQuestion: questionResults });
    renderLearning();
    if (!persisted) document.querySelector('#quiz-status').insertAdjacentHTML('beforeend', '<p class="form-error" role="alert">Your browser could not save this attempt. You can still review the result.</p>');
  });
  document.querySelector('#toggle-lessons')?.addEventListener('click', event => {
    const list = document.querySelector('.lesson-list');
    const isOpen = list.classList.toggle('is-open');
    event.currentTarget.setAttribute('aria-expanded', String(isOpen));
    event.currentTarget.textContent = isOpen ? 'Hide course contents' : 'Show course contents';
  });
}

export function renderPlaceholder(title, copy) {
  unmountPythonLab();
  app.innerHTML = `${header()}<main class="section"><div class="container"><p class="eyebrow">CodePath</p><h1 class="editorial">${esc(title)}</h1><p class="hero-copy">${esc(copy)}</p><a class="button button-primary" href="#/">Back home</a></div></main>${footer()}`;
}

export { renderLearning };

