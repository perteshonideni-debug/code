import { createPythonEditor, resetDraft } from '../editor/python-editor.js';
import { pythonRuntime } from '../services/python-runtime.js';
import { buildWorkshopTestProgram, parseWorkshopResults } from '../services/workshop-engine.js';
import { progressStore } from '../state/store.js';

let activeEditor = null;
let requestRender = () => {};
const escapeHtml = value => String(value).replace(/[&<>"']/g, char => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#039;' }[char]));
const exampleCode = lesson => lesson.interactiveExample?.starterCode ?? lesson.content?.find(block => block.type === 'code')?.code ?? 'print("Hello, CodePath")';
const exerciseCode = lesson => lesson.exercise?.starterCode ?? 'print("Write your solution here")';

export function pythonLabMarkup(lesson) {
  const saved = progressStore.getLessonActivity(lesson.id);
  const checks = lesson.exercise?.checks ?? [];
  return `<section class="python-lab" aria-labelledby="python-lab-title" data-lesson="${escapeHtml(lesson.id)}">
    <div class="python-lab-heading"><div><p class="eyebrow">Practice · real Python</p><h2 id="python-lab-title">${escapeHtml(lesson.exercise?.title ?? 'Lesson workspace')}</h2><p>${escapeHtml(lesson.interactiveExample?.prompt ?? '')}</p></div><span class="language-badge">● Python</span></div>
    <div class="lab-mode-tabs" role="tablist" aria-label="Python activity"><button type="button" role="tab" data-mode="example" aria-selected="true">1 · Explore example</button><button type="button" role="tab" data-mode="exercise" aria-selected="false" ${saved.comprehensionPassed && saved.exampleCompleted ? '' : 'disabled'}>2 · Independent exercise</button></div>
    <p class="lab-guidance" data-lab-guidance>${escapeHtml(lesson.exercise?.instructions ?? 'Edit the example, then run it to see Python respond.')}</p>
    <details class="lab-hints"><summary>Hints for this exercise</summary><ol>${(lesson.exercise?.hints ?? []).map(hint => `<li>${escapeHtml(hint)}</li>`).join('')}</ol></details>
    <div class="python-lab-toolbar"><span class="editor-label" data-editor-label>WORKING EXAMPLE</span><span class="shortcut-hint"><kbd>Ctrl</kbd> / <kbd>⌘</kbd> + <kbd>Enter</kbd> to run</span></div>
    <div class="python-editor-shell"><div class="python-editor-mount" id="python-editor-${escapeHtml(lesson.id)}"></div></div>
    <div class="python-lab-actions"><div class="python-primary-actions"><button class="button button-primary" type="button" data-python-run>▶ Run example</button><button class="button button-secondary" type="button" data-python-tests hidden>Run tests</button><button class="button button-primary" type="button" data-python-submit hidden>Submit exercise</button><button class="button button-secondary" type="button" data-python-reset>Reset this editor</button></div><div class="python-output-actions"><span class="runtime-status" data-runtime-status role="status"><span class="status-dot" aria-hidden="true"></span>Ready to run</span><button class="button button-quiet" type="button" data-python-clear>Clear output</button></div></div>
    <section class="python-output-panel"><div class="output-heading"><h3>Output and test results</h3><span class="output-runtime-label">Pyodide · Web Worker</span></div><pre class="python-terminal" data-python-output aria-live="polite">Run your code to see output here.</pre><div class="lesson-test-results" data-test-results aria-live="polite"></div></section>
    <p class="runtime-disclosure">Python runs in this browser with Pyodide. The runtime downloads on the first run and stops execution that exceeds its time limit.</p>
  </section>`;
}

function setStatus(status, text, state = 'idle') { status.dataset.state = state; status.lastChild.textContent = text; }
function append(output, text, error = false) { if (output.dataset.started !== 'true') { output.textContent = ''; output.dataset.started = 'true'; } const line = document.createElement('span'); line.className = `terminal-line${error ? ' terminal-error' : ''}`; line.textContent = text; output.append(line); }

export function unmountPythonLab() { activeEditor?.destroy(); activeEditor = null; }

export function mountPythonLab({ lesson, host, onProgress = () => {} }) {
  unmountPythonLab();
  requestRender = onProgress;
  const output = host.querySelector('[data-python-output]');
  const status = host.querySelector('[data-runtime-status]');
  const runButton = host.querySelector('[data-python-run]');
  const testsButton = host.querySelector('[data-python-tests]');
  const resetButton = host.querySelector('[data-python-reset]');
  const editorMount = host.querySelector('.python-editor-mount');
  const guidance = host.querySelector('[data-lab-guidance]');
  const results = host.querySelector('[data-test-results]');
  let mode = 'example';
  let running = false;
  const starter = () => mode === 'example' ? exampleCode(lesson) : exerciseCode(lesson);
  const draftId = () => mode === 'example' ? `${lesson.id}:example` : lesson.id;
  const initializeEditor = () => { activeEditor?.destroy(); activeEditor = createPythonEditor({ parent: editorMount, lessonId: draftId(), starterCode: starter(), onRun: () => mode === 'example' ? runExample() : runTests(false) }); };
  const switchMode = next => {
    if (next === 'exercise' && !(progressStore.getLessonActivity(lesson.id).comprehensionPassed && progressStore.getLessonActivity(lesson.id).exampleCompleted)) return;
    mode = next;
    host.querySelectorAll('[data-mode]').forEach(tab => tab.setAttribute('aria-selected', String(tab.dataset.mode === mode)));
    host.querySelector('[data-editor-label]').textContent = mode === 'example' ? 'WORKING EXAMPLE' : 'YOUR SOLUTION';
    guidance.textContent = mode === 'example' ? lesson.interactiveExample.prompt : lesson.exercise.instructions;
    testsButton.hidden = mode !== 'exercise';
    host.querySelector('[data-python-submit]').hidden = mode !== 'exercise' || Boolean(progressStore.getLessonActivity(lesson.id).exercisePassed);
    runButton.textContent = mode === 'example' ? '▶ Run example' : '▶ Run code';
    initializeEditor();
  };
  const run = async source => {
    if (running) return null;
    running = true; runButton.disabled = true; testsButton.disabled = true; setStatus(status, 'Loading / running Python…', 'loading');
    let runtimeException = false;
    try {
      const response = await pythonRuntime.run(source, { onEvent: event => {
        if (!host.isConnected) return;
        if (event.type === 'stdout') append(output, event.text);
        if (event.type === 'stderr') append(output, event.text, true);
        if (event.type === 'exception') { runtimeException = true; append(output, `${event.name}: ${event.message}`, true); }
        if (event.type === 'timeout') { runtimeException = true; append(output, event.message, true); setStatus(status, 'Timed out · worker restarted', 'error'); }
        if (event.type === 'runtime-error') { runtimeException = true; append(output, event.message, true); setStatus(status, 'Python runtime unavailable', 'error'); }
        if (event.type === 'status') setStatus(status, event.status === 'loading' ? 'Loading Python…' : 'Running…', event.status);
      } });
      if (response.result !== null && response.result !== undefined) append(output, `↳ ${response.result}`);
      if (response.exception) runtimeException = true;
      if (!runtimeException) setStatus(status, 'Finished successfully', 'success');
      return { ...response, runtimeException };
    } catch (error) { runtimeException = true; append(output, error.message, true); setStatus(status, error.code?.includes('timeout') ? 'Timed out · worker restarted' : 'Could not run code', 'error'); return { exception: error.message, runtimeException: true }; }
    finally { running = false; if (host.isConnected) { runButton.disabled = false; testsButton.disabled = false; } }
  };
  const runExample = async () => {
    output.replaceChildren(); output.dataset.started = 'false'; results.replaceChildren();
    const source = activeEditor.getValue();
    const response = await run(source);
    if (!response?.runtimeException && source.trim() && source !== exampleCode(lesson)) {
      progressStore.saveLessonActivity(lesson.id, { exampleCompleted: true });
      host.querySelector('[data-mode="exercise"]').disabled = false;
      requestRender();
    }
  };
  const runTests = async submit => {
    output.replaceChildren(); output.dataset.started = 'false'; results.replaceChildren();
    const source = activeEditor.getValue();
    const testProgram = buildWorkshopTestProgram(source, lesson.exercise?.checks ?? []);
    const response = await run(testProgram);
    if (response?.runtimeException) return;
    const parsed = parseWorkshopResults(response.result);
    if (!parsed) { append(output, 'Could not read the test report. Please run the tests again.', true); return; }
    const passed = parsed.filter(test => test.passed).length;
    results.innerHTML = `<p class="test-summary ${passed === parsed.length ? 'is-passing' : 'is-failing'}">${passed} of ${parsed.length} tests passed</p><ul>${parsed.map(test => `<li class="${test.passed ? 'test-passed' : 'test-failed'}"><strong>${test.passed ? '✓' : '×'} ${escapeHtml(test.label)}</strong>${test.passed ? '' : `<span>${escapeHtml(test.detail)}</span>`}</li>`).join('')}</ul>`;
    if (submit && parsed.length > 0 && passed === parsed.length) {
      progressStore.saveLessonActivity(lesson.id, { exercisePassed: true });
      requestRender();
    }
  };
  initializeEditor();
  host.querySelectorAll('[data-mode]').forEach(tab => tab.addEventListener('click', () => switchMode(tab.dataset.mode)));
  runButton.addEventListener('click', () => mode === 'example' ? runExample() : run(activeEditor.getValue()));
  testsButton.addEventListener('click', () => runTests(false));
  host.querySelector('[data-python-submit]')?.addEventListener('click', () => runTests(true));
  resetButton.addEventListener('click', () => { resetDraft(draftId()); activeEditor.setValue(starter()); activeEditor.focus(); setStatus(status, 'Editor reset', 'idle'); });
  host.querySelector('[data-python-clear]').addEventListener('click', () => { output.textContent = 'Run your code to see output here.'; output.dataset.started = 'false'; results.replaceChildren(); setStatus(status, 'Output cleared', 'idle'); });
}
