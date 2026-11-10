const WORKER_START_TIMEOUT_MS = 120_000;
export const DEFAULT_EXECUTION_TIMEOUT_MS = 5_000;

export class PythonRuntimeError extends Error {
  constructor(message, code = 'runtime') {
    super(message);
    this.name = 'PythonRuntimeError';
    this.code = code;
  }
}

export class PythonRuntime {
  #worker = null;
  #state = 'stopped';
  #readyPromise = null;
  #resolveReady = null;
  #rejectReady = null;
  #pending = null;
  #nextId = 1;
  #onEvent = () => {};

  #emit(event) {
    this.#onEvent(event);
  }

  #startWorker() {
    this.#state = 'loading';
    this.#readyPromise = new Promise((resolve, reject) => {
      this.#resolveReady = resolve;
      this.#rejectReady = reject;
    });
    const worker = new Worker(new URL('../workers/pyodide.worker.js', import.meta.url), { type: 'module' });
    this.#worker = worker;
    worker.addEventListener('message', event => this.#handleMessage(event.data));
    worker.addEventListener('error', event => {
      event.preventDefault();
      this.#fail(new PythonRuntimeError(event.message || 'The Python worker stopped unexpectedly.'));
    });
    worker.addEventListener('messageerror', () => this.#fail(new PythonRuntimeError('The Python worker sent a message the page could not read.')));
    this.#emit({ type: 'status', status: 'loading' });
  }

  #handleMessage(message) {
    if (message?.type === 'status') {
      if (message.status === 'ready') {
        this.#state = 'ready';
        this.#resolveReady?.();
        this.#resolveReady = null;
        this.#rejectReady = null;
      }
      this.#emit(message);
      return;
    }
    if (message?.type === 'runtime-error') {
      this.#fail(new PythonRuntimeError(message.message || 'Pyodide could not load.', 'load'));
      return;
    }
    const pending = this.#pending;
    if (!pending || message?.id !== pending.id) return;
    if (message.type === 'stdout' || message.type === 'stderr') {
      this.#emit(message);
      return;
    }
    if (message.type === 'result') {
      pending.result = message.value;
      return;
    }
    if (message.type === 'exception') {
      pending.exception = message;
      this.#emit(message);
      return;
    }
    if (message.type === 'complete') {
      clearTimeout(pending.timer);
      this.#pending = null;
      this.#emit({ type: 'complete' });
      pending.resolve({ result: pending.result, exception: pending.exception });
    }
  }

  #fail(error) {
    this.#state = 'stopped';
    this.#worker?.terminate();
    this.#worker = null;
    this.#rejectReady?.(error);
    this.#resolveReady = null;
    this.#rejectReady = null;
    if (this.#pending) {
      clearTimeout(this.#pending.timer);
      this.#pending.reject(error);
      this.#pending = null;
    }
    this.#readyPromise = null;
    this.#emit({ type: 'runtime-error', message: error.message });
  }

  async #ensureReady() {
    if (!this.#worker) this.#startWorker();
    if (this.#state === 'ready') return;
    let timer;
    try {
      await Promise.race([
        this.#readyPromise,
        new Promise((_, reject) => {
          timer = setTimeout(() => reject(new PythonRuntimeError('Pyodide took too long to start.', 'load-timeout')), WORKER_START_TIMEOUT_MS);
        })
      ]);
    } catch (error) {
      this.terminate();
      throw error;
    } finally {
      clearTimeout(timer);
    }
  }

  async run(code, { timeoutMs = DEFAULT_EXECUTION_TIMEOUT_MS, onEvent = () => {} } = {}) {
    if (this.#pending) throw new PythonRuntimeError('A Python run is already in progress.', 'busy');
    if (!String(code).trim()) throw new PythonRuntimeError('Add some Python code before running it.', 'empty');
    this.#onEvent = onEvent;
    await this.#ensureReady();
    const id = this.#nextId++;
    this.#emit({ type: 'status', status: 'running' });
    return new Promise((resolve, reject) => {
      const timer = setTimeout(() => {
        const error = new PythonRuntimeError(`Execution exceeded the ${timeoutMs / 1000} second time limit. The worker was stopped and will restart on the next run.`, 'timeout');
        const pending = this.#pending;
        this.#pending = null;
        this.terminate();
        this.#emit({ type: 'timeout', message: error.message });
        pending?.reject(error);
      }, timeoutMs);
      this.#pending = { id, timer, resolve, reject, result: null, exception: null };
      try {
        this.#worker.postMessage({ type: 'run', id, code });
      } catch (error) {
        clearTimeout(timer);
        this.#pending = null;
        this.terminate();
        reject(new PythonRuntimeError(error.message || 'Could not send code to the Python worker.'));
      }
    });
  }

  terminate() {
    const pending = this.#pending;
    this.#pending = null;
    if (pending) {
      clearTimeout(pending.timer);
      pending.reject(new PythonRuntimeError('The Python worker was stopped.', 'terminated'));
    }
    this.#worker?.terminate();
    this.#worker = null;
    this.#state = 'stopped';
    this.#readyPromise = null;
    this.#resolveReady = null;
    this.#rejectReady = null;
  }
}

export const pythonRuntime = new PythonRuntime();
