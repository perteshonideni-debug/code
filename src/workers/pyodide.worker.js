import { loadPyodide } from 'https://cdn.jsdelivr.net/pyodide/v314.0.7/full/pyodide.mjs';

const PYODIDE_INDEX_URL = 'https://cdn.jsdelivr.net/pyodide/v314.0.7/full/';
let pyodidePromise;

self.postMessage({ type: 'status', status: 'loading' });
pyodidePromise = loadPyodide({ indexURL: PYODIDE_INDEX_URL });

function formatResult(result) {
  if (result === undefined || result === null) return null;
  let value = result;
  if (typeof result === 'object' && typeof result.toJs === 'function') {
    try {
      value = result.toJs({ depth: 2 });
    } finally {
      result.destroy();
    }
  }
  if (typeof value === 'string') return JSON.stringify(value);
  if (typeof value === 'object') {
    try { return JSON.stringify(value, null, 2); }
    catch { return String(value); }
  }
  return String(value);
}

function pythonExceptionName(error) {
  const traceback = String(error?.message || '');
  const matches = [...traceback.matchAll(/\b([A-Za-z_][\w]*(?:Error|Exception|Interrupt|Exit)):\s*[^\n]*/g)];
  return matches.at(-1)?.[1] || error?.name || 'PythonError';
}

self.addEventListener('message', async event => {
  const { type, id, code } = event.data ?? {};
  if (type !== 'run' || typeof id !== 'number' || typeof code !== 'string') return;

  try {
    const pyodide = await pyodidePromise;
    pyodide.setStdout({ batched: text => self.postMessage({ type: 'stdout', id, text }) });
    pyodide.setStderr({ batched: text => self.postMessage({ type: 'stderr', id, text }) });
    pyodide.setStdin({ error: true });
    await pyodide.loadPackagesFromImports(code);
    const result = await pyodide.runPythonAsync(code, { filename: 'codepath.py' });
    const formatted = formatResult(result);
    self.postMessage({ type: 'result', id, value: formatted });
  } catch (error) {
    self.postMessage({
      type: 'exception',
      id,
      name: pythonExceptionName(error),
      message: error?.message || String(error)
    });
  } finally {
    self.postMessage({ type: 'complete', id });
  }
});

pyodidePromise.then(
  () => self.postMessage({ type: 'status', status: 'ready' }),
  error => self.postMessage({ type: 'runtime-error', message: error?.message || String(error) })
);
