const MASCOT = '/assets/ai-tutor-mascot.png';
const MODES = ['tutor', 'debug', 'challenge'];
const LABELS = { tutor: 'Tutor', debug: 'Debug', challenge: 'Challenge' };
const esc = value => String(value ?? '').replace(/[&<>"']/g, character => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#039;' }[character]));
let activeUnmount = null;

function storageKey(id) { return `codepath-ai-chat-v1:${id}`; }
function readHistory(id) {
  try { const history = JSON.parse(localStorage.getItem(storageKey(id)) ?? '[]'); return Array.isArray(history) ? history.slice(-24) : []; }
  catch { return []; }
}
function saveHistory(id, history) {
  try { localStorage.setItem(storageKey(id), JSON.stringify(history.slice(-24))); } catch { /* Chat remains usable for this visit. */ }
}
function renderMessageText(text) {
  const blocks = [];
  const source = String(text ?? '');
  const html = esc(source).replace(/```([\w+-]*)\n?([\s\S]*?)```/g, (_match, language, code) => {
    const index = blocks.push(`<pre class="ai-code-block"><div><span>${esc(language || 'code')}</span><button type="button" data-ai-copy="${blocks.length}">Copy code</button></div><code>${code.replace(/\n$/, '')}</code></pre>`) - 1;
    return `\u0000CODE${index}\u0000`;
  }).replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>').replace(/`([^`]+)`/g, '<code>$1</code>').split(/\n{2,}/).map(paragraph => `<p>${paragraph.replace(/\n/g, '<br>')}</p>`).join('');
  return html.replace(/\u0000CODE(\d+)\u0000/g, (_match, index) => blocks[Number(index)]);
}
function makeMessage(role, text, extra = {}) { return { role, text, ...extra }; }

export function unmountAiTutor() { activeUnmount?.(); activeUnmount = null; }

export function mountAiTutor({ root, chapterId, chapterTitle, getContext }) {
  unmountAiTutor();
  if (!root) return;
  let history = readHistory(chapterId);
  let mode = 'tutor';
  let hintLevel = 1;
  let pending = false;
  let lastRequest = null;
  root.innerHTML = `<section class="ai-tutor" data-ai-tutor aria-label="CodePath AI Tutor"><div class="ai-tutor-panel" data-ai-panel aria-hidden="true"><header class="ai-tutor-header"><img src="${MASCOT}" alt="CodePath AI Tutor mascot"><div><p class="eyebrow">YOUR PYTHON LEARNING PARTNER</p><h2>CodePath AI Tutor</h2><span data-ai-context-label>Chapter-aware · ${esc(chapterTitle)}</span></div><button type="button" class="ai-close" data-ai-close aria-label="Close tutor">×</button></header><nav class="ai-mode-tabs" aria-label="Tutor mode">${MODES.map(key => `<button type="button" data-ai-mode="${key}" aria-pressed="${key === mode}">${LABELS[key]}</button>`).join('')}</nav><div class="ai-welcome" data-ai-welcome><img src="${MASCOT}" alt="Friendly Python tutor robot"><h3>Let’s figure it out together.</h3><p>I’m here to help you understand <strong>${esc(chapterTitle)}</strong>. Ask a question, share a bug, or get a fresh challenge.</p><div><button type="button" data-ai-suggest="Explain the main idea of this chapter in simple steps.">Explain this chapter</button><button type="button" data-ai-review>Review my code</button><button type="button" data-ai-new-challenge>New challenge</button></div></div><div class="ai-chat-history" data-ai-history aria-live="polite" aria-label="Conversation"></div><div class="ai-quick-actions"><button type="button" data-ai-hint>Next hint · 1 of 4</button><button type="button" data-ai-new-challenge>New challenge</button><button type="button" data-ai-review>Review my code</button><button type="button" data-ai-clear>Clear chat</button></div><form class="ai-composer" data-ai-form><label class="sr-only" for="ai-prompt">Ask the AI Tutor</label><textarea id="ai-prompt" rows="2" maxlength="3000" placeholder="Ask about this lesson…" required></textarea><button class="button button-primary" type="submit" aria-label="Send message">Send <span aria-hidden="true">↑</span></button><small>Your messages and code go to the configured AI provider. Verify advice by running Python in the workspace.</small></form></div><button type="button" class="ai-tutor-fab" data-ai-open aria-expanded="false"><img src="${MASCOT}" alt=""><span>AI Tutor</span></button></section>`;
  const panel = root.querySelector('[data-ai-panel]');
  const historyNode = root.querySelector('[data-ai-history]');
  const welcome = root.querySelector('[data-ai-welcome]');
  const composer = root.querySelector('[data-ai-form]');
  const promptInput = root.querySelector('#ai-prompt');
  const sendButton = composer.querySelector('[type="submit"]');
  const fab = root.querySelector('[data-ai-open]');
  const render = () => {
    welcome.hidden = history.length > 0;
    historyNode.innerHTML = history.map((message, index) => `<article class="ai-message ${message.role === 'assistant' ? 'is-assistant' : 'is-user'}">${message.role === 'assistant' ? `<img class="ai-message-avatar" src="${MASCOT}" alt="Tutor">` : '<span class="ai-user-avatar" aria-hidden="true">You</span>'}<div class="ai-message-body"><span class="ai-message-name">${message.role === 'assistant' ? 'CodePath Tutor' : 'You'}</span>${renderMessageText(message.text)}${message.error ? `<div class="ai-error-actions"><span>${esc(message.error)}</span><button type="button" data-ai-retry="${index}">Retry</button></div>` : ''}</div></article>`).join('') + (pending ? `<article class="ai-message is-assistant ai-thinking"><img class="ai-message-avatar" src="${MASCOT}" alt="Tutor is thinking"><div class="ai-message-body"><span class="ai-message-name">CodePath Tutor</span><p><span class="ai-dots"><i></i><i></i><i></i></span> Thinking through your chapter…</p></div></article>` : '');
    historyNode.scrollTop = historyNode.scrollHeight;
    root.querySelector('[data-ai-hint]').textContent = `Next hint · ${hintLevel} of 4`;
    promptInput.disabled = pending; sendButton.disabled = pending;
    root.querySelectorAll('[data-ai-mode],[data-ai-hint],[data-ai-review],[data-ai-suggest],[data-ai-new-challenge],[data-ai-clear]').forEach(button => { button.disabled = pending; });
    saveHistory(chapterId, history);
  };
  const open = value => {
    panel.classList.toggle('is-open', value); panel.setAttribute('aria-hidden', String(!value)); fab.setAttribute('aria-expanded', String(value));
    if (value) { setTimeout(() => promptInput.focus(), 60); render(); }
  };
  const ask = async (text, options = {}) => {
    if (pending) return;
    const clean = String(text ?? '').trim();
    if (!clean) return;
    const request = { mode, message: clean, hintLevel: options.hintLevel, context: getContext() };
    lastRequest = request;
    history.push(makeMessage('user', clean));
    pending = true; render();
    try {
      const recentMessages = history.slice(-9).map(({ role, text }) => ({ role, text }));
      const response = await fetch('/api/tutor', { method: 'POST', headers: { 'content-type': 'application/json' }, body: JSON.stringify({ ...request, messages: recentMessages }) });
      const data = await response.json().catch(() => ({}));
      if (!response.ok) throw new Error(data.error || `Tutor request failed (${response.status}).`);
      if (typeof data.reply !== 'string' || !data.reply.trim()) throw new Error('The tutor returned an empty response. Try again.');
      history.push(makeMessage('assistant', data.reply));
      hintLevel = mode === 'challenge' && options.hintLevel ? Math.min(4, options.hintLevel + 1) : 1;
    } catch (error) {
      history.push(makeMessage('assistant', 'I couldn’t reach the tutor just now. Your question is saved here; try again when the tutor service is available.', { error: error.message, retry: request }));
    } finally { pending = false; render(); }
  };
  const retry = async index => {
    const failed = history[index]; const request = failed?.retry ?? lastRequest;
    if (!request || pending) return;
    history.splice(index, 1); history.pop(); pending = true; render();
    try {
      const response = await fetch('/api/tutor', { method: 'POST', headers: { 'content-type': 'application/json' }, body: JSON.stringify({ ...request, messages: history.slice(-8).map(({ role, text }) => ({ role, text })) }) });
      const data = await response.json().catch(() => ({}));
      if (!response.ok) throw new Error(data.error || `Tutor request failed (${response.status}).`);
      history.push(makeMessage('assistant', data.reply));
    } catch (error) { history.push(makeMessage('assistant', 'The request still failed. Please retry later.', { error: error.message, retry: request })); }
    finally { pending = false; render(); }
  };
  root.addEventListener('click', event => {
    const target = event.target.closest('button'); if (!target) return;
    if (target.matches('[data-ai-open]')) open(true);
    if (target.matches('[data-ai-close]')) open(false);
    if (target.matches('[data-ai-mode]')) { mode = target.dataset.aiMode; root.querySelectorAll('[data-ai-mode]').forEach(button => button.setAttribute('aria-pressed', String(button === target))); promptInput.placeholder = mode === 'debug' ? 'Describe what went wrong…' : mode === 'challenge' ? 'Ask for a new challenge…' : 'Ask about this lesson…'; }
    if (target.matches('[data-ai-suggest]')) { open(true); ask(target.dataset.aiSuggest); }
    if (target.matches('[data-ai-review]')) { mode = 'debug'; root.querySelectorAll('[data-ai-mode]').forEach(button => button.setAttribute('aria-pressed', String(button.dataset.aiMode === mode))); open(true); ask('Please review my current code for correctness, readability, structure, Python concepts, improvements, and beginner mistakes. Explain feedback without changing my code.'); }
    if (target.matches('[data-ai-new-challenge]')) { mode = 'challenge'; root.querySelectorAll('[data-ai-mode]').forEach(button => button.setAttribute('aria-pressed', String(button.dataset.aiMode === mode))); open(true); hintLevel = 1; ask('Create one additional coding exercise connected to this chapter and my progress. Include a clear goal, requirements, one edge case, and a short starter-code block. End with only progressive hint 1 of 4; do not reveal the solution.', { hintLevel: 1 }); }
    if (target.matches('[data-ai-hint]')) { mode = 'challenge'; root.querySelectorAll('[data-ai-mode]').forEach(button => button.setAttribute('aria-pressed', String(button.dataset.aiMode === mode))); open(true); ask(`Give only progressive hint ${hintLevel} of 4 for my current task. Do not reveal a complete solution before level 4.`, { hintLevel }); }
    if (target.matches('[data-ai-clear]')) { history = []; hintLevel = 1; render(); }
    if (target.matches('[data-ai-retry]')) retry(Number(target.dataset.aiRetry));
    if (target.matches('[data-ai-copy]')) { const block = target.closest('.ai-code-block')?.querySelector('code')?.textContent ?? ''; navigator.clipboard?.writeText(block).then(() => { target.textContent = 'Copied'; setTimeout(() => { if (target.isConnected) target.textContent = 'Copy code'; }, 1200); }).catch(() => { target.textContent = 'Clipboard unavailable'; }); }
  });
  composer.addEventListener('submit', event => { event.preventDefault(); const message = promptInput.value; promptInput.value = ''; ask(message); });
  render();
  activeUnmount = () => { root.replaceChildren(); };
}
