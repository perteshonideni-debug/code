import { emailSimulator } from '../data/workshops/email-simulator.js';
import { createPythonEditor, resetDraft } from '../editor/python-editor.js';
import { pythonRuntime } from '../services/python-runtime.js';
import { buildWorkshopTestProgram, parseWorkshopResults, summarizeWorkshopResults } from '../services/workshop-engine.js';
import { progressStore } from '../state/store.js';

let editor = null;
const app = document.querySelector('#app');
const esc = value => String(value).replace(/[&<>"']/g, char => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#039;' }[char]));


function safeCurrentIndex(workshop, progress) {
  const firstIncomplete = workshop.steps.findIndex(item => !progress.completedSteps?.includes(item.id));
  const maxIndex = firstIncomplete < 0 ? workshop.steps.length - 1 : firstIncomplete;
  return Math.min(Math.max(Number(progress.currentStep) || 0, 0), maxIndex);
}

export function unmountWorkshop() {
  editor?.destroy();
  editor = null;
}

export function renderWorkshop(workshop = emailSimulator) {
  unmountWorkshop();
  const stepKey = `${workshop.id}:project`;
  const progress = progressStore.getWorkshop(workshop.id);
  let currentIndex = safeCurrentIndex(workshop, progress);
  const currentStep = () => workshop.steps[currentIndex];
  const completed = () => progressStore.getWorkshop(workshop.id).completedSteps ?? [];
  const unlockedIndex = () => {
    const next = workshop.steps.findIndex(item => !completed().includes(item.id));
    return next < 0 ? workshop.steps.length - 1 : next;
  };
  const stepMarkup = () => {
    const item = currentStep();
    const done = completed().includes(item.id);
    return `<div class="workshop-step-head"><div><p class="workshop-eyebrow">Step ${String(currentIndex + 1).padStart(2, '0')} of ${workshop.steps.length}</p><h1>${esc(item.title)}</h1></div><span class="workshop-step-state ${done ? 'is-done' : ''}" data-step-state>${done ? 'Completed' : 'In progress'}</span></div>
      <div class="workshop-instruction-copy"><p>${esc(item.instructions)}</p><aside class="workshop-explanation"><b>Why this matters</b><p>${esc(item.explanation)}</p></aside><p class="workshop-expected"><b>Expected:</b> ${esc(item.expectedBehavior)}</p></div>
      <details class="workshop-hints"><summary>Need a hint? <span>Show a nudge</span></summary><ol>${item.hints.map(hint => `<li>${esc(hint)}</li>`).join('')}</ol></details>
      <div class="workshop-step-nav"><button class="button button-quiet" type="button" data-previous ${currentIndex === 0 ? 'disabled' : ''}>â† Previous</button><button class="button button-secondary" type="button" data-next ${completed().includes(item.id) && currentIndex < workshop.steps.length - 1 ? '' : 'disabled'}>${currentIndex === workshop.steps.length - 1 ? 'Workshop complete' : 'Next step â†’'}</button></div>`;
  };
  const renderCurrent = () => {
    const panel = document.querySelector('[data-workshop-current]');
    if (!panel) return;
    panel.innerHTML = stepMarkup();
    document.querySelectorAll('[data-step-index]').forEach(button => {
      const index = Number(button.dataset.stepIndex);
      button.classList.toggle('is-active', index === currentIndex);
      button.classList.toggle('is-completed', completed().includes(workshop.steps[index].id));
      button.disabled = index > unlockedIndex();
      button.setAttribute('aria-current', index === currentIndex ? 'step' : 'false');
    });
    const doneCount = completed().length;
    const percentage = Math.round(doneCount / workshop.steps.length * 100);
    document.querySelector('[data-workshop-progress]').style.width = `${percentage}%`;
    document.querySelector('[data-workshop-progress-label]').textContent = `${doneCount} of ${workshop.steps.length} steps complete`;
    document.querySelector('[data-previous]').addEventListener('click', () => goTo(currentIndex - 1));
    document.querySelector('[data-next]').addEventListener('click', () => {
      if (!completed().includes(currentStep().id)) return;
      goTo(currentIndex + 1);
    });
    document.querySelector('[data-get-hint]').addEventListener('click', () => {
      const details = document.querySelector('.workshop-hints');
      details.open = true;
      details.scrollIntoView({ block: 'nearest', behavior: 'smooth' });
    });
  };
  const goTo = index => {
    if (index < 0 || index >= workshop.steps.length || index > unlockedIndex()) return;
    currentIndex = index;
    progressStore.setWorkshopStep(workshop.id, index);
    renderCurrent();
    document.querySelector('[data-workshop-step-title]').textContent = currentStep().title;
    document.querySelector('[data-workshop-panel="instructions"]').click();
  };
  app.innerHTML = `<main class="workshop-page"><header class="workshop-topbar"><a href="#/" class="workshop-brand"><span>&lt;/&gt;</span> CodePath</a><a href="#/learn/python-fundamentals" class="workshop-back">â† Python Fundamentals</a><button type="button" class="workshop-theme-toggle" data-theme-toggle>◐ Theme</button><span class="workshop-language">Python Â· Workshop</span></header>
    <div class="workshop-titlebar"><div><p class="workshop-eyebrow">GUIDED PROJECT Â· OBJECT-ORIENTED PYTHON</p><h2>${esc(workshop.title)}</h2><p>${esc(workshop.description)}</p></div><div class="workshop-overall"><div class="workshop-progress-track"><span data-workshop-progress></span></div><span data-workshop-progress-label></span></div></div>
    <div class="workshop-tabs" role="tablist" aria-label="Workshop panels"><button type="button" role="tab" aria-selected="true" data-workshop-panel="instructions">Instructions</button><button type="button" role="tab" aria-selected="false" data-workshop-panel="editor">Editor</button><button type="button" role="tab" aria-selected="false" data-workshop-panel="tests">Tests & output</button></div>
    <div class="workshop-grid"><aside class="workshop-instructions-panel" data-workshop-instructions><nav class="workshop-step-list" aria-label="Workshop steps"><span class="workshop-list-label">PROJECT STEPS</span>${workshop.steps.map((item, index) => `<button class="workshop-step-link" data-step-index="${index}" type="button"><span class="workshop-step-number">${completed().includes(item.id) ? 'âœ“' : String(index + 1).padStart(2, '0')}</span><span>${esc(item.title)}</span></button>`).join('')}</nav><div data-workshop-current>${stepMarkup()}</div></aside>
    <section class="workshop-workspace"><section class="workshop-editor-panel" aria-label="Python code editor"><div class="workshop-panel-heading"><div><span class="workshop-panel-label">YOUR PROJECT</span><strong data-workshop-step-title>${esc(currentStep().title)}</strong></div><span class="workshop-file">email_simulator.py</span></div><div class="workshop-editor-mount" data-workshop-editor></div><div class="workshop-toolbar"><span>Python Â· Ctrl/âŒ˜ + Enter to run</span><button class="workshop-tool-button" type="button" data-get-hint>Get a hint</button></div><div class="workshop-actions"><button class="button button-primary" type="button" data-run-code>â–¶ Run code</button><button class="button button-secondary" type="button" data-run-tests>Run tests</button><button class="button button-secondary" type="button" data-submit>Submit solution</button><button class="button button-quiet" type="button" data-reset-code>Reset code</button></div></section>
      <section class="workshop-results-panel" aria-label="Test results and output"><div class="workshop-results-header"><div><span class="workshop-panel-label">WORKSPACE RESULTS</span><h2>Tests & output</h2></div><span class="workshop-runtime-badge">Pyodide Â· Web Worker</span></div><p class="workshop-run-status" data-workshop-status role="status">Ready when you are</p><div class="workshop-test-list" data-workshop-test-results aria-live="polite"><p class="workshop-empty-tests">Run the tests to check this stepâ€™s requirements.</p></div><div class="workshop-console"><div class="workshop-console-heading"><b>Console</b><button type="button" class="workshop-tool-button" data-clear-output>Clear</button></div><pre data-workshop-output>Run your code to see output here.</pre></div></section></section></div></main>`;
  editor = createPythonEditor({ parent: document.querySelector('[data-workshop-editor]'), lessonId: stepKey, starterCode: currentStep().starterCode, onRun: () => runCode() });
  document.querySelectorAll('[data-step-index]').forEach(button => button.addEventListener('click', () => goTo(Number(button.dataset.stepIndex))));
  document.querySelectorAll('[data-workshop-panel]').forEach(button => button.addEventListener('click', () => {
    document.querySelectorAll('[data-workshop-panel]').forEach(tab => tab.setAttribute('aria-selected', String(tab === button)));
    document.querySelector('.workshop-instructions-panel').classList.toggle('mobile-active', button.dataset.workshopPanel === 'instructions');
    document.querySelector('.workshop-editor-panel').classList.toggle('mobile-active', button.dataset.workshopPanel === 'editor');
    document.querySelector('.workshop-results-panel').classList.toggle('mobile-active', button.dataset.workshopPanel === 'tests');
  }));
  const output = document.querySelector('[data-workshop-output]');
  const status = document.querySelector('[data-workshop-status]');
  const tests = document.querySelector('[data-workshop-test-results]');
  let isRunning = false;
  const run = async (code, isEvaluation) => {
    if (isRunning) return null;
    isRunning = true;
    document.querySelectorAll('[data-run-code], [data-run-tests], [data-submit]').forEach(button => { button.disabled = true; button.setAttribute('aria-busy', 'true'); });
    output.textContent = '';
    tests.innerHTML = '<p class="workshop-empty-tests">Running Python in the workerâ€¦</p>';
    status.textContent = 'Loading Python runtimeâ€¦';
    let exception = null;
    try {
      const response = await pythonRuntime.run(code, { timeoutMs: 5000, onEvent: event => {
        if (!document.querySelector('.workshop-page')) return;
        if (event.type === 'status') status.textContent = event.status === 'loading' ? 'Loading Python runtimeâ€¦' : event.status === 'running' ? 'Running Pythonâ€¦' : 'Python ready';
        if (event.type === 'stdout' || event.type === 'stderr') output.textContent += `${event.type === 'stderr' ? 'Error: ' : ''}${event.text}\n`;
        if (event.type === 'exception') { exception = event; output.textContent += `${event.name}: ${event.message}\n`; }
        if (event.type === 'timeout') output.textContent += `${event.message}\n`;
        if (event.type === 'runtime-error') output.textContent += `${event.message}\n`;
      } });
      exception = response.exception;
      if (response.result != null && !isEvaluation) output.textContent += `â†³ ${response.result}\n`;
      if (!isEvaluation) {
        tests.innerHTML = '<p class="workshop-empty-tests">Code ran successfully. Run tests to validate this step.</p>';
        status.textContent = exception ? 'Python error' : 'Code finished';
        if (exception) tests.innerHTML = `<p class="workshop-evaluation-error">${esc(exception.name)}: ${esc(exception.message.split('\n').at(-1))}</p>`;
        return null;
      }
      const results = parseWorkshopResults(response.result);
      if (!results || exception) {
        const message = exception ? `${exception.name}: ${exception.message.split('\n').at(-1)}` : 'The Python test report could not be read.';
        const failed = currentStep().checks.map((check, index) => ({ id: `test-${index + 1}`, label: check.label, feedback: check.feedback, passed: false, detail: message }));
        displayResults(failed);
        return { passed: false, results: failed };
      }
      displayResults(results);
      return { passed: summarizeWorkshopResults(results).complete, results };
    } catch (error) {
      const isTimeout = error.code === 'timeout';
      output.textContent += `${error.message}\n`;
      status.textContent = isTimeout ? 'Timed out Â· worker restarted' : 'Could not run Python';
      if (isEvaluation) {
        const failed = currentStep().checks.map((check, index) => ({ id: `test-${index + 1}`, label: check.label, feedback: check.feedback, passed: false, detail: error.message }));
        displayResults(failed);
        return { passed: false, results: failed };
      }
      tests.innerHTML = `<p class="workshop-evaluation-error">${esc(error.message)}</p>`;
      return null;
    } finally {
      isRunning = false;
      document.querySelectorAll('[data-run-code], [data-run-tests], [data-submit]').forEach(button => { button.disabled = false; button.removeAttribute('aria-busy'); });
    }
  };
  function displayResults(results) {
    const summary = summarizeWorkshopResults(results);
    status.textContent = `${summary.passed} of ${summary.total} tests passed`;
    tests.innerHTML = results.map(result => `<article class="workshop-test ${result.passed ? 'is-passed' : 'is-failed'}"><span class="workshop-test-icon" aria-hidden="true">${result.passed ? 'âœ“' : '!'}</span><div><b>${esc(result.label)}</b><p>${result.passed ? 'Requirement satisfied.' : `${esc(result.feedback)}${result.detail ? ` (${esc(result.detail)})` : ''}`}</p></div><span class="workshop-test-state">${result.passed ? 'Passed' : 'Needs work'}</span></article>`).join('');
  }
  const evaluate = async shouldComplete => {
    const report = await run(buildWorkshopTestProgram(editor.getValue(), currentStep().checks), true);
    if (!report) return;
    progressStore.saveWorkshopAttempt(workshop.id, currentStep().id, { passed: shouldComplete && report.passed });
    if (shouldComplete && report.passed) {
      status.textContent = 'All tests passed Â· step saved';
      renderCurrent();
    } else if (report.passed) {
      status.textContent = completed().includes(currentStep().id) ? 'All tests passed Â· step already saved' : 'All tests passed Â· submit to save this step';
    }
    if (shouldComplete && !report.passed) status.textContent = 'Some tests need attention Â· review the feedback';
  };
  async function runCode() { await run(editor.getValue(), false); }
  document.querySelector('[data-run-code]').addEventListener('click', runCode);
  document.querySelector('[data-run-tests]').addEventListener('click', () => evaluate(false));
  document.querySelector('[data-submit]').addEventListener('click', () => evaluate(true));
  document.querySelector('[data-clear-output]').addEventListener('click', () => { output.textContent = 'Run your code to see output here.'; });
  document.querySelector('[data-reset-code]').addEventListener('click', () => {
    if (!window.confirm('Reset your Email Simulator code to this stepâ€™s starter? This clears the saved project draft.')) return;
    resetDraft(stepKey);
    editor.setValue(currentStep().starterCode);
    editor.focus();
    tests.innerHTML = '<p class="workshop-empty-tests">Run the tests to check this stepâ€™s requirements.</p>';
    status.textContent = 'Project code reset';
  });
  renderCurrent();
  document.querySelector('[data-workshop-panel="instructions"]').click();
}

