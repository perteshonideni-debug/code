import { createPythonEditor, resetDraft } from '../editor/python-editor.js';
import { pythonRuntime } from '../services/python-runtime.js';
import { buildWorkshopTestProgram, parseWorkshopResults, summarizeWorkshopResults } from '../services/workshop-engine.js';
import { progressStore } from '../state/store.js';
import { mountAiTutor, unmountAiTutor } from './ai-tutor.js';
import { chapterFlows } from '../data/chapter-flows.js';

const app = document.querySelector('#app');
const esc = value => String(value ?? '').replace(/[&<>"']/g, char => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#039;' }[char]));
let editor = null;
let activeRun = 0;
const legacyStageNames = ['Literature', 'Knowledge questions', 'Worked example', 'Guided coding task', 'Five progressive exercises', 'Chapter game', 'Chapter exam'];
const legacyStageKeys = ['literature', 'knowledge', 'example', 'practice', 'practice', 'game', 'exam'];
const structuredStageNames = ['Literaturë', 'Pyetje të kuptimit', 'Shembull praktik', 'Workshop i udhëzuar', 'Ushtrime sipas temës', 'Laborator i pavarur', 'Lojë e kapitullit', 'Projekt praktik', 'Provimi i kapitullit'];
const structuredStageKeys = ['literature', 'knowledge', 'example', 'workshop', 'practice', 'lab', 'game', 'project', 'exam'];
const localize = (chapter, english, albanian) => chapter.learningVersion === 2 ? albanian : english;

export function unmountChapterFlow() { activeRun += 1; editor?.destroy(); editor = null; unmountAiTutor(); }

function header() {
  return `<header class="site-header"><div class="container nav"><a class="brand" href="#/"><span class="brand-mark">&lt;/&gt;</span>CodePath</a><nav class="nav-links" aria-label="Primary"><a href="#/courses">Courses</a><a href="#/learn/python-fundamentals">Learning path</a><a href="#/workshop/email-simulator">Email Simulator</a></nav><div class="nav-actions"><button class="button button-quiet theme-toggle" type="button" data-theme-toggle>◐ Theme</button></div></div></header>`;
}

function renderLiterature(chapter, state) {
  const prerequisiteNotice = chapter.prerequisiteChapter && !progressStore.getChapterProgress(chapter.prerequisiteChapter).exam?.passed
    ? `<aside class="callout"><strong>Parakusht për këtë kapitull</strong><p>Përfundo mësimet, ushtrimet, lojën dhe provimin e kapitullit paraprak për të zhbllokuar vazhdimin.</p></aside>`
    : '';
  return `<section class="flow-literature">${prerequisiteNotice}<header class="flow-heading"><p class="eyebrow">${esc(chapter.moduleTitle)} · ${localize(chapter, 'Chapter literature', 'Mësimet e kapitullit')}</p><h1>${esc(chapter.title)}</h1><p>${localize(chapter, 'Read the explanations, definitions, syntax notes, examples, and debugging guidance before you test your understanding.', 'Lexo shpjegimet, përkufizimet, sintaksën, shembujt dhe këshillat e debugging-ut para se të kontrollosh kuptimin.')}</p></header>${chapter.learningModules?.length ? `<div class="flow-module-map">${chapter.learningModules.map(module => `<section><p class="eyebrow">${esc(module.title)}</p><ul>${module.topics.map(topic => `<li>${esc(topic.title)} · 5 nivele</li>`).join('')}</ul></section>`).join('')}</div>` : ''}${chapter.lessons.map((lesson, index) => `<article class="flow-lesson" id="lesson-${esc(lesson.id)}"><div class="flow-lesson-index">${String(index + 1).padStart(2, '0')}</div><div><p class="eyebrow">${esc(lesson.duration)} · ${esc(lesson.title)}</p><h2>${esc(lesson.title)}</h2><p class="flow-lede">${esc(lesson.lede)}</p>${lesson.objectives?.length ? `<h3>${localize(chapter, 'What you will learn', 'Çfarë do të mësosh')}</h3><ul>${lesson.objectives.map(value => `<li>${esc(value)}</li>`).join('')}</ul>` : ''}<div class="lesson-content">${lesson.content.map(block => renderBlock(block, chapter)).join('')}</div><label class="flow-read-check"><input type="checkbox" data-literature-read="${esc(lesson.id)}" ${state.literatureRead.includes(lesson.id) ? 'checked' : ''}> ${localize(chapter, 'I have read and understood this lesson', 'E lexova dhe e kuptova këtë mësim')}</label></div></article>`).join('')}<button class="button button-primary" type="button" data-literature-complete>${localize(chapter, 'Continue to knowledge questions', 'Vazhdo te pyetjet e kuptimit')}</button></section>`;
}

function renderBlock(block, chapter = null) {
  if (block.type === 'heading') return `<h3>${esc(block.text)}</h3>`;
  if (block.type === 'paragraph') return `<p>${esc(block.text)}</p>`;
  if (block.type === 'definition') return `<aside class="lesson-definition"><span>${localize(chapter, 'KEY TERM', 'TERMI KYÇ')}</span><strong>${esc(block.term)}</strong><p>${esc(block.text)}</p></aside>`;
  if (block.type === 'syntax') return `<aside class="syntax-card"><span>${localize(chapter, 'SYNTAX', 'SINTAKSA')}</span><pre><code>${esc(block.code)}</code></pre></aside>`;
  if (block.type === 'code') return `<figure class="lesson-example"><figcaption>${esc(block.caption || localize(chapter, 'Python example', 'Shembull Python'))}</figcaption><pre class="code-block"><code>${esc(block.code)}</code></pre>${block.explanations?.length ? `<ol class="line-explanations">${block.explanations.map((line, index) => `<li><span>${index + 1}</span>${esc(line)}</li>`).join('')}</ol>` : ''}</figure>`;
  if (block.type === 'list') return `<ul>${block.items.map(value => `<li>${esc(value)}</li>`).join('')}</ul>`;
  if (block.type === 'callout' || block.type === 'mistake') return `<aside class="callout"><strong>${esc(block.title || localize(chapter, 'Common mistake', 'Gabim i zakonshëm'))}</strong><p>${esc(block.text)}</p></aside>`;
  if (block.type === 'table') return `<div class="table-scroll"><table><thead><tr>${block.headers.map(value => `<th>${esc(value)}</th>`).join('')}</tr></thead><tbody>${block.rows.map(row => `<tr>${row.map(value => `<td>${esc(value)}</td>`).join('')}</tr>`).join('')}</tbody></table></div>`;
  if (block.type === 'example') return `<aside class="example-card"><h3>${esc(block.title)}</h3><p>${esc(block.text)}</p></aside>`;
  return '';
}

function questionMarkup(question, index, saved) {
  const options = Array.isArray(question.options) ? question.options : [question.answer, 'The code runs without following Python syntax.', 'Python guesses the intended result.'];
  const correctAnswer = Array.isArray(question.answer) ? question.answer : [question.answer];
  const previous = saved[question.id];
  return `<fieldset class="quiz-question" data-flow-question="${esc(question.id)}"><legend><span class="question-number">${String(index + 1).padStart(2, '0')}</span><span class="flow-question-type">${esc(question.type ?? 'Multiple choice')}</span>${esc(question.prompt)}</legend><div class="quiz-options">${options.map(option => `<label class="quiz-option"><input type="radio" name="${esc(question.id)}" value="${esc(option)}" ${previous?.answer === option ? 'checked' : ''}><span>${esc(option)}</span></label>`).join('')}</div><button type="button" class="button button-secondary" data-check-question="${esc(question.id)}">Check answer</button><p class="flow-answer-feedback" data-question-feedback="${esc(question.id)}" aria-live="polite">${previous ? `${previous.correct ? 'Correct.' : 'Try again.'} ${esc(question.explanation)}` : ''}</p></fieldset>`;
}

function renderKnowledge(chapter, state) {
  return `<section class="flow-narrow"><p class="eyebrow">${localize(chapter, 'Stage 2 · Check understanding', 'Hapi 2 · Kontrollo kuptimin')}</p><h1>${localize(chapter, 'Questions from the literature', 'Pyetje nga mësimet')}</h1><p>${localize(chapter, 'Answer each question. You can retry; feedback explains the reasoning either way.', 'Përgjigju çdo pyetjeje. Mund të provosh përsëri; shpjegimi të ndihmon të kuptosh arsyen.')}</p><div class="flow-question-list">${chapter.questions.map((question, index) => questionMarkup(question, index, state.knowledge)).join('')}</div><button class="button button-primary" data-knowledge-complete ${chapter.questions.every(question => questionPassed(state, question.id)) ? '' : 'disabled'}>${localize(chapter, 'Continue to the worked example', 'Vazhdo te shembulli praktik')}</button></section>`;
}

function editorMarkup(id, title, description, code, hints, checks, kind, chapter = null) {
  const tr = (en, sq) => localize(chapter, en, sq);
  return `<section class="flow-workspace" data-flow-workspace data-flow-kind="${kind}" data-mobile-view="instructions"><div class="flow-mobile-tabs" role="tablist" aria-label="${tr('Workspace panels', 'Panelet e punës')}"><button type="button" role="tab" aria-selected="true" data-flow-mobile-tab="instructions">${tr('Instructions', 'Udhëzime')}</button><button type="button" role="tab" aria-selected="false" data-flow-mobile-tab="code">${tr('Code', 'Kodi')}</button></div><div class="flow-task-instructions"><p class="eyebrow">${kind === 'example' ? tr('Stage 3 · Explore', 'Hapi 3 · Eksploro') : kind === 'game' ? tr('Stage 6 · Mission', 'Hapi 6 · Misioni') : kind === 'exam' ? tr('Practical exam', 'Provimi praktik') : kind === 'project' ? tr('Applied project', 'Projekt praktik') : tr('Practice workspace', 'Hapësira e ushtrimit')}</p><h2>${esc(title)}</h2><p>${esc(description)}</p>${checks?.length ? `<h3>${tr('Requirements', 'Kërkesat')}</h3><ul>${checks.map(check => `<li>${esc(check.label)}</li>`).join('')}</ul>` : ''}${hints?.length ? `<details class="lab-hints"><summary>${tr('Hints and approach', 'Hints dhe qasje')}</summary><ol>${hints.map(hint => `<li>${esc(hint)}</li>`).join('')}</ol></details>` : ''}<p class="flow-related"><strong>${tr('From the literature', 'Nga mësimi')}</strong><br>${tr('Revisit the definitions and examples in this chapter while solving.', 'Rikthehu te përkufizimet dhe shembujt gjatë zgjidhjes.')}</p></div><div class="flow-code-panel"><div class="python-lab-toolbar"><span class="editor-label">${tr('PYTHON EDITOR', 'EDITORI PYTHON')}</span><span class="shortcut-hint">Ctrl / ⌘ + Enter ${tr('to run', 'për ekzekutim')}</span></div><div class="python-editor-shell"><div class="python-editor-mount"></div></div><div class="python-lab-actions"><div class="python-primary-actions"><button class="button button-primary" data-flow-run>▶ ${tr('Run', 'Ekzekuto')}</button><button class="button button-secondary" data-flow-tests ${kind === 'example' ? 'hidden' : ''}>${tr('Run tests', 'Ekzekuto testet')}</button><button class="button button-primary" data-flow-submit ${kind === 'example' ? 'hidden' : ''}>${tr('Submit', 'Dërgo për testim')}</button><button class="button button-secondary" data-flow-reset>${tr('Reset', 'Rivendos')}</button></div><div class="python-output-actions"><span class="runtime-status" data-flow-status role="status">● ${tr('Ready', 'Gati')}</span><button class="button button-quiet" data-flow-clear>${tr('Clear output', 'Pastro daljen')}</button></div></div><section class="python-output-panel"><div class="output-heading"><h3>${tr('Output and test results', 'Dalja dhe rezultatet e testeve')}</h3><span class="output-runtime-label">Pyodide · Web Worker</span></div><pre class="python-terminal" data-flow-output aria-live="polite">${tr('Run your code to see output here.', 'Ekzekuto kodin për të parë daljen.')}</pre><div class="lesson-test-results" data-flow-results aria-live="polite"></div></section></div></section>`;
}

function renderExample(chapter) {
  const tr = (en, sq) => localize(chapter, en, sq);
  return `<section class="flow-example"><p class="eyebrow">${tr('Stage 3 · Complete practical example', 'Hapi 3 · Shembull i plotë praktik')}</p><h1>${esc(chapter.example.title)}</h1><p>${esc(chapter.example.prompt)}</p>${chapter.example.explanations.length ? `<ol class="line-explanations">${chapter.example.explanations.map((line, index) => `<li><span>${index + 1}</span>${esc(line)}</li>`).join('')}</ol>` : ''}${chapter.example.output ? `<aside class="flow-expected-output"><strong>${tr('Expected output', 'Dalja e pritshme')}</strong><pre>${esc(chapter.example.output)}</pre><span>${tr('Run the code to see and compare the actual result.', 'Ekzekuto kodin për ta krahasuar me rezultatin e pritur.')}</span></aside>` : ''}${editorMarkup('example', tr('Experiment with this example', 'Eksperimento me këtë shembull'), tr('Run the complete example, then change values and run it again to see how behavior changes.', 'Ekzekuto shembullin, ndrysho vlerat dhe provo përsëri për të vëzhguar ndryshimin.'), chapter.example.code, [], [], 'example', chapter)}<button class="button button-primary" data-example-complete disabled>${tr('Continue to guided coding', 'Vazhdo te ushtrimi i udhëzuar')}</button></section>`;
}

function renderPractice(chapter, state, taskIndex) {
  const task = chapter.tasks[taskIndex];
  const related = chapter.tasks.map((item, index) => ({ item, index })).filter(({ item }) => item.topicId === task.topicId && item.levelId === task.levelId);
  const within = related.findIndex(({ index }) => index === taskIndex);
  const level = localize(chapter, `Level · ${task.levelTitle}`, `Niveli ${['beginner','basic','intermediate','advanced','independent'].indexOf(task.levelId) + 1} nga 5 · ${task.levelTitle}`);
  const title = localize(chapter, `Exercise ${taskIndex + 1} of ${chapter.tasks.length}`, `${task.topicTitle} · ushtrimi ${within + 1} nga ${related.length}`);
  const tabs = related.map(({ item, index }, localIndex) => `<button type="button" role="tab" data-task-index="${index}" aria-selected="${index === taskIndex}" ${index > 0 && !state.exercises[chapter.tasks[index - 1].id]?.passed ? 'disabled' : ''}>${localize(chapter, `Exercise ${localIndex + 1}`, `Ushtrimi ${localIndex + 1}`)} ${state.exercises[item.id]?.passed ? '✓' : ''}</button>`).join('');
  return `<section class="flow-practice"><div class="flow-heading"><p class="eyebrow">${level} · ${esc(task.topicTitle)}</p><h1>${esc(title)}</h1><p>${esc(task.levelTitle)}: ${esc(task.independence ?? '')}</p><div class="flow-exercise-tabs" role="tablist" aria-label="${localize(chapter, 'Coding exercises', 'Ushtrimet e nivelit')}">${tabs}</div></div>${editorMarkup(task.id, task.title, task.description, task.starterCode, task.hints, task.checks, 'practice', chapter)}<div class="flow-advance"><button class="button button-primary" data-practice-next ${state.exercises[task.id]?.passed ? '' : 'disabled'}>${taskIndex === chapter.tasks.length - 1 ? localize(chapter, 'Unlock chapter game', 'Hap lojën e kapitullit') : localize(chapter, `Continue to exercise ${taskIndex + 2}`, `Vazhdo te ushtrimi ${taskIndex + 2}`)}</button></div></section>`;
}

function renderWorkshop(chapter, stepIndex) {
  const workshop = chapter.workshop;
  const progress = progressStore.getWorkshop(workshop.id);
  const step = workshop.steps[stepIndex];
  const checks = step.checks.map(check => ({ label: Array.isArray(check) ? check[0] : check.label }));
  return `<section class="flow-workshop"><p class="eyebrow">Workshop · ${esc(workshop.title)}</p><h1>${esc(workshop.description)}</h1><div class="flow-exercise-tabs" role="tablist" aria-label="Hapat e workshop-it">${workshop.steps.map((item, index) => `<button type="button" role="tab" data-workshop-index="${index}" aria-selected="${index === stepIndex}" ${index > 0 && !progressStore.isWorkshopStepComplete(workshop.id, workshop.steps[index - 1].id) ? 'disabled' : ''}>${esc(item.title)} ${progressStore.isWorkshopStepComplete(workshop.id, item.id) ? '✓' : ''}</button>`).join('')}</div>${editorMarkup(step.id, step.title, step.instructions, step.starterCode, step.hints, checks, 'workshop', chapter)}<div class="flow-advance"><button class="button button-primary" data-workshop-next ${progressStore.isWorkshopStepComplete(workshop.id, step.id) ? '' : 'disabled'}>${stepIndex === workshop.steps.length - 1 ? 'Vazhdo te ushtrimet e temave' : 'Vazhdo te hapi tjetër'}</button></div></section>`;
}

function renderProject(chapter, state) {
  const project = chapter.project;
  return `<section class="flow-project"><p class="eyebrow">Projekt i integruar · Bazat</p><h1>${esc(project.title)}</h1><p>${esc(project.description)}</p>${editorMarkup('course-planner-project', project.title, project.description, project.starterCode, project.hints, project.checks, 'project', chapter)}<button class="button button-primary" data-project-next ${state.projectPassed ? '' : 'disabled'}>Vazhdo te provimi i kapitullit</button></section>`;
}

function renderLab(chapter, state) {
  const lab = chapter.lab;
  return `<section class="flow-project"><p class="eyebrow">Laborator i pavarur · Përdor konceptet e kapitullit</p><h1>${esc(lab.title)}</h1><p>${esc(lab.description)}</p>${editorMarkup(lab.id, lab.title, lab.description, lab.starterCode, lab.hints, lab.checks, 'lab', chapter)}<button class="button button-primary" data-lab-next ${state.labPassed ? '' : 'disabled'}>Vazhdo te loja e kapitullit</button></section>`;
}

function renderGame(chapter, state, missionIndex) {
  const game = chapter.game;
  const mission = game.missions[missionIndex];
  const tr = (en, sq) => localize(chapter, en, sq);
  const hints = chapter.learningVersion === 2 ? ['Gjurmoi vlerat para dhe pas çdo përpunimi.', 'Provo të ekzekutosh kodin; pastaj kalo testet për të kontrolluar kushtet.'] : ['Trace the mission state before changing it.', 'Test a normal input and the edge case described by the checks.'];
  return `<section class="flow-game"><div class="game-scene"><div class="game-scene-copy"><p class="eyebrow">${tr('Chapter game', 'Loja e kapitullit')} · ${esc(game.name)}</p><h1>${esc(game.setting)}</h1><p>${tr('Mission', 'Misioni')} ${missionIndex + 1} ${tr('of', 'nga')} ${game.missions.length}: ${esc(mission.title)}</p></div><div class="game-map" aria-label="${tr('Mission map', 'Harta e misioneve')}">${game.missions.map((item, index) => `<div class="game-node ${index === missionIndex ? 'is-current' : ''} ${state.gameMissions.includes(index) ? 'is-cleared' : ''}"><span>${state.gameMissions.includes(index) ? '✓' : index + 1}</span><b>${esc(item.title)}</b></div>`).join('')}</div></div><p class="game-description">${esc(mission.description)}</p>${editorMarkup(`mission-${missionIndex + 1}`, mission.title, mission.description, mission.starterCode, hints, mission.checks.map(([label]) => ({ label })), 'game', chapter)}<button class="button button-primary" data-game-next ${state.gameMissions.includes(missionIndex) ? '' : 'disabled'}>${missionIndex === game.missions.length - 1 ? tr('Continue to project', 'Vazhdo te projekti') : tr('Next mission', 'Misioni tjetër')}</button></section>`;
}

function renderExam(chapter, state) {
  const practical = chapter.tasks[chapter.learningVersion === 2 ? chapter.tasks.length - 1 : 5];
  return `<section class="flow-narrow"><p class="eyebrow">${localize(chapter, 'Chapter exam', 'Provimi i kapitullit')}</p><h1>${localize(chapter, 'Show what you have learned', 'Trego çfarë ke mësuar')}</h1><p>${localize(chapter, 'Answer the theory questions, then complete the short practical challenge. A score of 80% and a passing practical solution complete the chapter.', 'Përgjigju pyetjeve teorike dhe pastaj zgjidh detyrën praktike. Duhet të marrësh të paktën 80% dhe të kalosh testet praktike për ta përfunduar kapitullin.')}</p>${chapter.exam.map((question, index) => questionMarkup(question, index, state.exam?.answers ?? {})).join('')}<button class="button button-secondary" data-exam-grade>${localize(chapter, 'Grade theory answers', 'Vlerëso përgjigjet')}</button><div data-exam-result role="status">${state.exam ? `<p>${localize(chapter, 'Latest score', 'Rezultati i fundit')}: ${state.exam.score} / ${chapter.exam.length}; ${localize(chapter, 'practical', 'praktika')} ${state.exam.practicalPassed ? localize(chapter, 'passed', 'u kalua') : localize(chapter, 'not passed', 'nuk u kalua')}.</p>` : ''}</div>${editorMarkup('exam', localize(chapter, 'Practical challenge', 'Detyrë praktike'), `${localize(chapter, 'Apply', 'Zbato')} ${chapter.title.toLowerCase()}.`, practical.starterCode, [localize(chapter, 'Read each test as an acceptance criterion.', 'Lexo çdo test si kriter që duhet përmbushur.')], practical.checks, 'exam')}<button class="button button-primary" data-exam-complete ${state.exam?.passed ? '' : 'disabled'}>${localize(chapter, 'Complete chapter', 'Përfundo kapitullin')}</button><p data-chapter-completion aria-live="polite">${state.exam?.passed ? localize(chapter, 'Chapter completed. You can revisit every stage.', 'Kapitulli u përfundua. Mund t’i rishikosh të gjitha fazat.') : localize(chapter, 'Pass theory with at least 80% and pass the practical tests to complete this chapter.', 'Merr të paktën 80% në teori dhe kalo testet praktike për ta përfunduar kapitullin.')}</p></section>`;
}

function getState(chapter) { return progressStore.getChapterProgress(chapter.id); }
const questionPassed = (state, id) => Boolean(state.knowledge[id]?.passed ?? state.knowledge[id]?.correct);
function stageUnlocked(chapter, state, stage) {
  const prerequisitesMet = !chapter.prerequisiteChapter || Boolean(progressStore.getChapterProgress(chapter.prerequisiteChapter).exam?.passed);
  if (stage === 0) return prerequisitesMet;
  if (!prerequisitesMet) return false;
  if (stage === 1) return chapter.lessons.every(lesson => state.literatureRead.includes(lesson.id));
  if (stage === 2) return chapter.questions.length > 0 && chapter.questions.every(question => questionPassed(state, question.id));
  if (stage === 3) return state.exampleCompleted;
  if (chapter.learningVersion === 2 && stage === 4) return chapter.workshop.steps.every(step => progressStore.isWorkshopStepComplete(chapter.workshop.id, step.id));
  if (chapter.learningVersion !== 2 && stage === 4) return state.exercises[chapter.tasks[0].id]?.passed;
  if (stage === 5 && chapter.learningVersion === 2) return chapter.tasks.every(task => state.exercises[task.id]?.passed);
  if (stage === 5) return chapter.tasks.every(task => state.exercises[task.id]?.passed);
  if (chapter.learningVersion === 2) {
    if (stage === 6) return Boolean(state.labPassed);
    if (stage === 7) return state.gameMissions.length === chapter.game.missions.length;
    if (stage === 8) return Boolean(state.projectPassed);
  }
  return state.gameMissions.length === chapter.game.missions.length;
}

export function renderChapterFlow(chapter, lessonId = null) {
  unmountChapterFlow();
  const stageNames = chapter.learningVersion === 2 ? structuredStageNames : legacyStageNames;
  const stageKeys = chapter.learningVersion === 2 ? structuredStageKeys : legacyStageKeys;
  const lastStage = stageNames.length - 1;
  let stage = lessonId ? 0 : Math.max(0, stageKeys.indexOf(getState(chapter).stage));
  let taskIndex = Math.min(chapter.tasks.length - 1, Math.max(0, Number(getState(chapter).taskIndex) || 0));
  let workshopStepIndex = Math.max(0, Number(progressStore.getWorkshop(chapter.workshop?.id ?? 'chapter-workshop')?.currentStep) || 0);
  if (!lessonId && getState(chapter).stage === 'practice' && (taskIndex > 0 || chapter.learningVersion === 2)) stage = chapter.learningVersion === 2 ? 4 : 4;
  let missionIndex = Math.min(chapter.game.missions.length - 1, Math.max(0, Number(getState(chapter).missionIndex) || 0));
  app.innerHTML = `${header()}<main class="chapter-flow"><aside class="flow-sidebar"><a href="#/learn/${esc('python-fundamentals')}">← Python Fundamentals</a><p class="eyebrow">${esc(chapter.moduleTitle)}</p><h2>${esc(chapter.title)}</h2><div class="flow-overall"><span data-flow-overall>0 / 7 stages</span><div><i data-flow-progress></i></div></div><nav class="flow-stage-list" aria-label="Chapter learning sequence">${stageNames.map((name, index) => `<button type="button" data-flow-stage="${index}" ${stageUnlocked(chapter, getState(chapter), index) ? '' : 'disabled'}><span>${String(index + 1).padStart(2, '0')}</span><b>${name}</b><i>${index === stage ? 'Current' : stageUnlocked(chapter, getState(chapter), index) ? 'Available' : 'Locked'}</i></button>`).join('')}</nav><button type="button" class="ai-tutor-launch" data-ai-tutor-open><img src="/assets/ai-tutor-mascot.png" alt=""><span><strong>CodePath AI Tutor</strong><small>Ask about this chapter</small></span><span aria-hidden="true">↗</span></button>${chapter.id === 'objects-and-state' ? '<a class="flow-workshop-link" href="#/workshop/email-simulator">OOP capstone · Email Simulator workshop ↗</a>' : ''}</aside><article class="flow-main"><div data-flow-content></div><nav class="flow-bottom-nav"><button class="button button-secondary" data-flow-previous>← Previous stage</button><button class="button button-secondary" data-flow-next>Next stage →</button></nav></article></main><div id="ai-tutor-root"></div>`;
  const main = document.querySelector('[data-flow-content]');
  let lastExecution = { output: '', results: [] };
  const progressSummary = () => {
    const state = getState(chapter);
    const done = chapter.learningVersion === 2
      ? [chapter.lessons.every(lesson => state.literatureRead.includes(lesson.id)), chapter.questions.length > 0 && chapter.questions.every(question => questionPassed(state, question.id)), state.exampleCompleted, chapter.workshop.steps.every(step => progressStore.isWorkshopStepComplete(chapter.workshop.id, step.id)), chapter.tasks.every(task => state.exercises[task.id]?.passed), Boolean(state.labPassed), state.gameMissions.length === chapter.game.missions.length, Boolean(state.projectPassed), Boolean(state.exam?.passed)]
      : [chapter.lessons.every(lesson => state.literatureRead.includes(lesson.id)), chapter.questions.length > 0 && chapter.questions.every(question => questionPassed(state, question.id)), state.exampleCompleted, chapter.tasks.every(task => state.exercises[task.id]?.passed), state.gameMissions.length === chapter.game.missions.length, Boolean(state.exam?.passed)];
    const count = done.filter(Boolean).length;
    document.querySelector('[data-flow-overall]').textContent = `${count} / ${done.length} ${localize(chapter, 'milestones', 'pika progresi')}`;
    document.querySelector('[data-flow-progress]').style.width = `${count / done.length * 100}%`;
    document.querySelectorAll('[data-flow-stage]').forEach(button => { const index = Number(button.dataset.flowStage); button.disabled = !stageUnlocked(chapter, state, index); button.classList.toggle('is-current', index === stage); button.querySelector('i').textContent = chapter.learningVersion === 2 ? (button.disabled ? 'E kyçur' : index === stage ? 'Tani' : 'E hapur') : (index === stage ? 'Current' : button.disabled ? 'Locked' : 'Available'); });
    document.querySelector('[data-flow-previous]').disabled = stage === 0;
    document.querySelector('[data-flow-next]').hidden = stage === lastStage;
    document.querySelector('[data-flow-next]').disabled = !stageUnlocked(chapter, state, stage + 1);
  };
  const changeStage = next => {
    if (next < 0 || next > lastStage || (next > stage && !stageUnlocked(chapter, getState(chapter), next))) return;
    if (chapter.learningVersion !== 2 && next === 4 && taskIndex === 0) taskIndex = 1;
    editor?.destroy(); editor = null; stage = next;
    progressStore.saveChapterProgress(chapter.id, { stage: stageKeys[stage], taskIndex, missionIndex });
    renderStage();
  };
  const mountLab = ({ id, code, checks = [], example = false }) => {
    const host = main.querySelector('[data-flow-workspace]');
    const output = host.querySelector('[data-flow-output]');
    const results = host.querySelector('[data-flow-results]');
    const runButton = host.querySelector('[data-flow-run]');
    const status = host.querySelector('[data-flow-status]');
    lastExecution = { output: '', results: [] };
    editor = createPythonEditor({ parent: host.querySelector('.python-editor-mount'), lessonId: `chapter:${chapter.id}:${id}`, starterCode: code, onRun: () => run(false) });
    host.querySelectorAll('[data-flow-mobile-tab]').forEach(tab => tab.addEventListener('click', () => {
      host.dataset.mobileView = tab.dataset.flowMobileTab;
      host.querySelectorAll('[data-flow-mobile-tab]').forEach(button => button.setAttribute('aria-selected', String(button === tab)));
      if (tab.dataset.flowMobileTab === 'code') editor?.view.requestMeasure();
    }));
    let running = false;
    const run = async evaluate => {
      if (running) return null;
      running = true; runButton.disabled = true; host.querySelector('[data-flow-tests]').disabled = true; host.querySelector('[data-flow-submit]').disabled = true;
      output.textContent = ''; results.replaceChildren(); status.textContent = 'Loading Python…';
      const requestId = ++activeRun; let failed = false;
      try {
        const source = evaluate ? buildWorkshopTestProgram(editor.getValue(), checks) : editor.getValue();
        const response = await pythonRuntime.run(source, { onEvent: event => {
          if (!host.isConnected || requestId !== activeRun) return;
          if (event.type === 'stdout' || event.type === 'stderr') output.textContent += `${event.type === 'stderr' ? 'Error: ' : ''}${event.text}\n`;
          if (event.type === 'exception' || event.type === 'timeout' || event.type === 'runtime-error') { failed = true; output.textContent += `${event.name ? `${event.name}: ` : ''}${event.message}\n`; }
          if (event.type === 'status') status.textContent = event.status === 'loading' ? 'Loading Python…' : 'Running Python…';
        } });
        if (!evaluate) {
          if (response.result != null) output.textContent += `↳ ${response.result}\n`;
          lastExecution.output = output.textContent;
          if (!failed && !response.exception && host.dataset.flowKind === 'example') main.querySelector('[data-example-complete]').disabled = false;
          status.textContent = failed || response.exception ? localize(chapter, 'Python error', 'Gabim në Python') : localize(chapter, 'Finished successfully', 'Ekzekutimi përfundoi me sukses');
          if (!failed && !response.exception && host.dataset.flowKind === 'example') {
            progressStore.saveChapterProgress(chapter.id, { exampleCompleted: true });
            main.querySelector('[data-example-complete]').disabled = false;
            progressSummary();
          }
          return { passed: !failed && !response.exception };
        }
        const parsed = failed || response.exception ? null : parseWorkshopResults(response.result);
        const report = parsed ?? checks.map((check, index) => ({ id: `test-${index + 1}`, label: check.label, passed: false, detail: 'Python execution failed before tests could run.' }));
        const summary = summarizeWorkshopResults(report);
        lastExecution = { output: output.textContent, results: report.map(({ label, passed, detail, feedback }) => ({ label, passed, detail, feedback })) };
        results.innerHTML = `<p class="test-summary ${summary.complete ? 'is-passing' : 'is-failing'}">${localize(chapter, `${summary.passed} of ${summary.total} tests passed`, `${summary.passed} nga ${summary.total} teste kaluan`)}</p><ul>${report.map(test => `<li class="${test.passed ? 'test-passed' : 'test-failed'}"><strong>${test.passed ? '✓' : '×'} ${esc(test.label)}</strong>${test.passed ? '' : `<span>${esc(test.feedback || test.detail)}</span>${test.feedback && test.detail ? `<small>${esc(test.detail)}</small>` : ''}`}</li>`).join('')}</ul>`;
        status.textContent = summary.complete ? localize(chapter, 'All tests passed', 'Të gjitha testet kaluan') : localize(chapter, 'Review the failed checks', 'Rishiko kërkesat e paplotësuara');
        return { passed: summary.complete, results: report };
      } catch (error) {
        output.textContent += `${error.message}\n`; status.textContent = error.code === 'timeout' ? localize(chapter, 'Timed out · worker restarted', 'Koha mbaroi · mjedisi Python u rinis') : localize(chapter, 'Could not run Python', 'Ekzekutimi i Python-it dështoi');
        lastExecution = { output: output.textContent, results: [{ label: 'Python execution', passed: false, detail: error.message }] };
        results.innerHTML = `<p class="test-summary is-failing">${esc(error.message)}</p>`;
        return { passed: false, error };
      } finally {
        running = false;
        if (host.isConnected && requestId === activeRun) { runButton.disabled = false; host.querySelector('[data-flow-tests]').disabled = false; host.querySelector('[data-flow-submit]').disabled = false; }
      }
    };
    host.querySelector('[data-flow-run]').addEventListener('click', () => run(false));
    host.querySelector('[data-flow-tests]').addEventListener('click', () => run(true));
    host.querySelector('[data-flow-submit]').addEventListener('click', async () => {
      const result = await run(true); if (!result) return;
      const kind = host.dataset.flowKind;
      if (kind === 'practice') {
        const task = chapter.tasks[taskIndex]; const previous = getState(chapter).exercises[task.id] ?? {};
        progressStore.saveChapterProgress(chapter.id, { exercises: { ...getState(chapter).exercises, [task.id]: { ...previous, passed: Boolean(previous.passed || result.passed), attempts: (previous.attempts ?? 0) + 1, latestResults: result.results } } });
      } else if (kind === 'game') {
        progressStore.saveChapterProgress(chapter.id, { gameAttempts: { ...(getState(chapter).gameAttempts ?? {}), [missionIndex]: (getState(chapter).gameAttempts?.[missionIndex] ?? 0) + 1 } });
      } else if (kind === 'workshop') {
        const step = chapter.workshop.steps[workshopStepIndex];
        progressStore.saveWorkshopAttempt(chapter.workshop.id, step.id, { passed: result.passed, results: result.results });
        if (result.passed) {
          const nextStep = Math.min(workshopStepIndex + 1, chapter.workshop.steps.length - 1);
          progressStore.setWorkshopStep(chapter.workshop.id, nextStep);
        }
      } else if (kind === 'project') {
        const state = getState(chapter);
        progressStore.saveChapterProgress(chapter.id, { projectPassed: Boolean(state.projectPassed || result.passed), projectAttempts: (state.projectAttempts ?? 0) + 1, projectResults: result.results });
      } else if (kind === 'lab') {
        const state = getState(chapter);
        progressStore.saveChapterProgress(chapter.id, { labPassed: Boolean(state.labPassed || result.passed), labAttempts: (state.labAttempts ?? 0) + 1, labResults: result.results });
      }
      if (!result.passed) { progressSummary(); return; }
      if (kind === 'practice') {
        const task = chapter.tasks[taskIndex];
      } else if (kind === 'game') {
        const gameMissions = new Set(getState(chapter).gameMissions); gameMissions.add(missionIndex);
        progressStore.saveChapterProgress(chapter.id, { gameMissions: [...gameMissions] });
      } else if (kind === 'exam') {
        progressStore.saveChapterProgress(chapter.id, { exam: { ...(getState(chapter).exam ?? {}), practicalPassed: true } });
        updateExamButton();
      }
      progressSummary();
      if (host.isConnected) host.querySelector('[data-flow-submit]').textContent = localize(chapter, 'Passed · saved', 'Kaluar · u ruajt');
      const advanceSelector = host.dataset.flowKind === 'game' ? '[data-game-next]' : host.dataset.flowKind === 'workshop' ? '[data-workshop-next]' : host.dataset.flowKind === 'project' ? '[data-project-next]' : host.dataset.flowKind === 'lab' ? '[data-lab-next]' : '[data-practice-next]';
      const advance = document.querySelector(advanceSelector);
      if (advance) advance.disabled = false;
    });
    host.querySelector('[data-flow-reset]').addEventListener('click', () => { resetDraft(`chapter:${chapter.id}:${id}`); editor.setValue(code); editor.focus(); output.textContent = 'Run your code to see output here.'; results.replaceChildren(); lastExecution = { output: '', results: [] }; status.textContent = 'Editor reset'; });
    host.querySelector('[data-flow-clear]').addEventListener('click', () => { output.textContent = 'Run your code to see output here.'; results.replaceChildren(); lastExecution = { output: '', results: [] }; status.textContent = 'Output cleared'; });
  };
  const updateExamButton = () => {
    const exam = getState(chapter).exam;
    const button = main.querySelector('[data-exam-complete]');
    if (button) button.disabled = !(exam?.passed || (exam?.score >= Math.ceil(chapter.exam.length * 0.8) && exam?.practicalPassed));
  };
  const renderStage = () => {
    editor?.destroy(); editor = null;
    const state = getState(chapter);
    if (stage === 0) main.innerHTML = renderLiterature(chapter, state);
    if (stage === 1) main.innerHTML = renderKnowledge(chapter, state);
    if (stage === 2) main.innerHTML = renderExample(chapter);
    if (chapter.learningVersion === 2 && stage === 3) main.innerHTML = renderWorkshop(chapter, workshopStepIndex);
    if (chapter.learningVersion === 2 ? stage === 4 : stage === 3 || stage === 4) main.innerHTML = renderPractice(chapter, state, taskIndex);
    if (chapter.learningVersion === 2 && stage === 5) main.innerHTML = renderLab(chapter, state);
    if (stage === (chapter.learningVersion === 2 ? 6 : 5)) main.innerHTML = renderGame(chapter, state, missionIndex);
    if (chapter.learningVersion === 2 && stage === 7) main.innerHTML = renderProject(chapter, state);
    if (stage === lastStage) main.innerHTML = renderExam(chapter, state);
    progressSummary();
    if (stage === 0) {
      main.querySelectorAll('[data-literature-read]').forEach(input => input.addEventListener('change', () => {
        const read = new Set(getState(chapter).literatureRead); input.checked ? read.add(input.dataset.literatureRead) : read.delete(input.dataset.literatureRead);
        progressStore.saveChapterProgress(chapter.id, { literatureRead: [...read] });
        main.querySelector('[data-literature-complete]').disabled = !chapter.lessons.every(lesson => getState(chapter).literatureRead.includes(lesson.id));
        progressSummary();
      }));
      main.querySelector('[data-literature-complete]').disabled = !chapter.lessons.every(lesson => state.literatureRead.includes(lesson.id));
      main.querySelector('[data-literature-complete]').addEventListener('click', () => changeStage(1));
    }
    if (stage === 1) {
      main.querySelectorAll('[data-check-question]').forEach(button => button.addEventListener('click', () => {
        const question = chapter.questions.find(item => item.id === button.dataset.checkQuestion);
        const answer = main.querySelector(`input[name="${CSS.escape(question.id)}"]:checked`)?.value;
        const feedback = main.querySelector(`[data-question-feedback="${CSS.escape(question.id)}"]`);
        if (!answer) { feedback.textContent = localize(chapter, 'Choose an answer before checking.', 'Zgjidh një përgjigje para kontrollit.'); return; }
        const correct = (Array.isArray(question.answer) ? question.answer : [question.answer]).includes(answer);
        const saved = getState(chapter).knowledge;
        progressStore.saveChapterProgress(chapter.id, { knowledge: { ...saved, [question.id]: { answer, correct, passed: Boolean(saved[question.id]?.passed || saved[question.id]?.correct || correct), attempts: (saved[question.id]?.attempts ?? 0) + 1 } } });
        feedback.textContent = `${correct ? localize(chapter, 'Correct.', 'Saktë.') : localize(chapter, 'Not quite.', 'Jo ende.')} ${question.explanation}`;
        feedback.className = `flow-answer-feedback ${correct ? 'check-correct' : 'check-incorrect'}`;
        main.querySelector('[data-knowledge-complete]').disabled = !chapter.questions.every(item => questionPassed(getState(chapter), item.id));
        progressSummary();
      }));
      main.querySelector('[data-knowledge-complete]').addEventListener('click', () => changeStage(2));
    }
    if (stage === 2) {
      const task = { id: 'worked-example', title: chapter.example.title, description: chapter.example.prompt, starterCode: chapter.example.code };
      mountLab({ id: task.id, code: task.starterCode, example: true });
      main.querySelector('[data-example-complete]').addEventListener('click', () => changeStage(3));
    }
    if (chapter.learningVersion === 2 && stage === 3) {
      const step = chapter.workshop.steps[workshopStepIndex];
      mountLab({ id: step.id, code: step.starterCode, checks: step.checks.map(check => Array.isArray(check) ? ({ label: check[0], code: check[1], feedback: check[2] }) : check) });
      main.querySelectorAll('[data-workshop-index]').forEach(button => button.addEventListener('click', () => {
        const next = Number(button.dataset.workshopIndex);
        if (next === 0 || progressStore.isWorkshopStepComplete(chapter.workshop.id, chapter.workshop.steps[next - 1].id)) {
          workshopStepIndex = next;
          progressStore.setWorkshopStep(chapter.workshop.id, workshopStepIndex);
          renderStage();
        }
      }));
      main.querySelector('[data-workshop-next]').addEventListener('click', () => {
        if (!progressStore.isWorkshopStepComplete(chapter.workshop.id, step.id)) return;
        if (workshopStepIndex < chapter.workshop.steps.length - 1) {
          workshopStepIndex += 1;
          progressStore.setWorkshopStep(chapter.workshop.id, workshopStepIndex);
          renderStage();
        } else changeStage(4);
      });
    }
    if ((chapter.learningVersion !== 2 && (stage === 3 || stage === 4)) || (chapter.learningVersion === 2 && stage === 4)) {
      const task = chapter.tasks[taskIndex]; mountLab({ id: task.id, code: task.starterCode, checks: task.checks });
      main.querySelectorAll('[data-task-index]').forEach(button => button.addEventListener('click', () => {
        const next = Number(button.dataset.taskIndex); if (next === 0 || getState(chapter).exercises[chapter.tasks[next - 1].id]?.passed) { taskIndex = next; stage = next === 0 ? 3 : 4; progressStore.saveChapterProgress(chapter.id, { stage: 'practice', taskIndex }); renderStage(); }
      }));
      main.querySelector('[data-practice-next]').addEventListener('click', () => {
        if (!getState(chapter).exercises[task.id]?.passed) return;
        if (taskIndex < chapter.tasks.length - 1) { taskIndex += 1; stage = taskIndex === 0 ? 3 : 4; progressStore.saveChapterProgress(chapter.id, { stage: 'practice', taskIndex }); renderStage(); }
        else changeStage(5);
      });
    }
    if (chapter.learningVersion === 2 && stage === 5) {
      mountLab({ id: chapter.lab.id, code: chapter.lab.starterCode, checks: chapter.lab.checks });
      main.querySelector('[data-lab-next]').addEventListener('click', () => {
        if (getState(chapter).labPassed) changeStage(6);
      });
    }
    if (stage === (chapter.learningVersion === 2 ? 6 : 5)) {
      const mission = chapter.game.missions[missionIndex]; mountLab({ id: `mission-${missionIndex + 1}`, code: mission.starterCode, checks: mission.checks.map(([label, code]) => ({ label, code, feedback: `Review ${label.toLowerCase()}.` })) });
      main.querySelector('[data-game-next]').addEventListener('click', () => {
        if (!getState(chapter).gameMissions.includes(missionIndex)) return;
        if (missionIndex < chapter.game.missions.length - 1) { missionIndex += 1; progressStore.saveChapterProgress(chapter.id, { stage: 'game', missionIndex }); renderStage(); }
        else changeStage(chapter.learningVersion === 2 ? 7 : lastStage);
      });
    }
    if (chapter.learningVersion === 2 && stage === 7) {
      const project = chapter.project;
      mountLab({ id: 'course-planner-project', code: project.starterCode, checks: project.checks });
      main.querySelector('[data-project-next]').addEventListener('click', () => {
        if (!getState(chapter).projectPassed) return;
        changeStage(lastStage);
      });
    }
    if (stage === lastStage) {
      const checks = main.querySelectorAll('[data-check-question]');
      checks.forEach(button => button.addEventListener('click', () => {
        const question = chapter.exam.find(item => item.id === button.dataset.checkQuestion);
        const answer = main.querySelector(`input[name="${CSS.escape(question.id)}"]:checked`)?.value;
        const feedback = main.querySelector(`[data-question-feedback="${CSS.escape(question.id)}"]`);
        if (!answer) { feedback.textContent = 'Choose an answer before checking.'; return; }
        const correct = (Array.isArray(question.answer) ? question.answer : [question.answer]).includes(answer);
        const exam = getState(chapter).exam ?? { answers: {} };
        const answers = { ...(exam.answers ?? {}), [question.id]: { answer, correct } };
        progressStore.saveChapterProgress(chapter.id, { exam: { ...exam, answers } });
        feedback.textContent = `${correct ? 'Correct.' : 'Review this idea.'} ${question.explanation}`;
        feedback.className = `flow-answer-feedback ${correct ? 'check-correct' : 'check-incorrect'}`;
      }));
      main.querySelector('[data-exam-grade]').addEventListener('click', () => {
        const answers = getState(chapter).exam?.answers ?? {};
        const score = chapter.exam.filter(question => answers[question.id]?.correct).length;
        progressStore.saveChapterProgress(chapter.id, { exam: { ...(getState(chapter).exam ?? {}), score, passed: score >= Math.ceil(chapter.exam.length * 0.8) && Boolean(getState(chapter).exam?.practicalPassed) } });
        const focus = chapter.exam.filter(question => !answers[question.id]?.correct).map(question => question.lessonTitle).filter(Boolean);
        main.querySelector('[data-exam-result]').innerHTML = `<p>Latest score: ${score} of ${chapter.exam.length}. ${score < Math.ceil(chapter.exam.length * 0.8) ? 'Review the explanations and retry.' : 'Theory threshold met.'}</p>${focus.length ? `<p><strong>Concepts to revisit:</strong> ${focus.map(esc).join(', ')}</p>` : ''}${chapter.exam.map(question => `<p><b>${answers[question.id]?.correct ? 'Correct' : 'Review'}:</b> ${esc(question.explanation)}</p>`).join('')}`;
        updateExamButton(); progressSummary();
      });
      const examTask = chapter.tasks[chapter.learningVersion === 2 ? chapter.tasks.length - 1 : 5];
      mountLab({ id: 'exam-practical', code: examTask.starterCode, checks: examTask.checks });
      main.querySelector('[data-exam-complete]').addEventListener('click', () => {
        const exam = getState(chapter).exam;
        if (!exam || exam.score < Math.ceil(chapter.exam.length * 0.8) || !exam.practicalPassed) return;
        progressStore.saveChapterProgress(chapter.id, { exam: { ...exam, passed: true } });
        main.querySelector('[data-chapter-completion]').textContent = 'Chapter complete. Your work and score are saved.';
      });
      updateExamButton();
    }
    progressSummary();
  };
  document.querySelectorAll('[data-flow-stage]').forEach(button => button.addEventListener('click', () => changeStage(Number(button.dataset.flowStage))));
  document.querySelector('[data-flow-previous]').addEventListener('click', () => changeStage(stage - 1));
  document.querySelector('[data-flow-next]').addEventListener('click', () => changeStage(stage + 1));
  renderStage();
  mountAiTutor({ root: document.querySelector('#ai-tutor-root'), chapterId: chapter.id, chapterTitle: chapter.title, getContext: () => {
    const currentTask = chapter.learningVersion === 2
      ? stage === 3 ? chapter.workshop.steps[workshopStepIndex] : stage === 4 ? chapter.tasks[taskIndex] : stage === 5 ? chapter.lab : stage === 6 ? chapter.game.missions[missionIndex] : stage === 7 ? chapter.project : null
      : stage === 3 || stage === 4 ? chapter.tasks[taskIndex] : stage === 5 ? chapter.game.missions[missionIndex] : null;
    const currentLessons = chapter.lessons.map(lesson => ({ title: lesson.title, lede: lesson.lede, objectives: lesson.objectives, content: lesson.content }));
    const knowledge = getState(chapter).knowledge;
    const chapterPosition = chapterFlows.findIndex(item => item.id === chapter.id);
    const previouslyStudied = chapterFlows.slice(0, Math.max(0, chapterPosition)).flatMap(item => item.lessons.map(lesson => `${item.title}: ${lesson.title}`)).slice(-24);
    return {
      course: 'Python Fundamentals', module: chapter.moduleTitle, chapter: chapter.title,
      stage: stageNames[stage], stageNumber: stage + 1,
      learningObjectives: chapter.lessons.flatMap(lesson => lesson.objectives ?? []), literature: currentLessons,
      questions: chapter.questions.map(question => ({ prompt: question.prompt, studentAnswer: knowledge[question.id]?.answer, correct: knowledge[question.id]?.correct })),
      workedExample: stage >= 2 ? { title: chapter.example.title, code: chapter.example.code, explanations: chapter.example.explanations, output: chapter.example.output } : undefined,
      exercise: currentTask ? { title: currentTask.title, instructions: currentTask.description, requirements: currentTask.checks?.map(check => Array.isArray(check) ? check[0] : check.label), hints: currentTask.hints } : undefined,
      studentCode: editor?.getValue() ?? '', execution: lastExecution,
      progress: { stage, completedLessons: progressStore.completedLessons.length, completedExercises: Object.values(getState(chapter).exercises).filter(item => item.passed).length, totalExercises: chapter.tasks.length, completedGameMissions: getState(chapter).gameMissions.length },
      priorConcepts: previouslyStudied
    };
  } });
  if (lessonId) document.getElementById(`lesson-${CSS.escape(lessonId)}`)?.scrollIntoView({ behavior: 'smooth', block: 'start' });
}
