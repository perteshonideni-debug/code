import { closeBracketsKeymap } from '@codemirror/autocomplete';
import { indentWithTab } from '@codemirror/commands';
import { indentUnit } from '@codemirror/language';
import { python } from '@codemirror/lang-python';
import { Prec } from '@codemirror/state';
import { oneDark } from '@codemirror/theme-one-dark';
import { EditorView, keymap } from '@codemirror/view';
import { basicSetup } from 'codemirror';

const DRAFT_PREFIX = 'codepath-python-draft-v1:';
let activeEditor = null;

function storageKey(lessonId) {
  return `${DRAFT_PREFIX}${lessonId}`;
}

export function readDraft(lessonId, starterCode) {
  try {
    return localStorage.getItem(storageKey(lessonId)) ?? starterCode;
  } catch {
    return starterCode;
  }
}

function saveDraft(lessonId, code) {
  try {
    localStorage.setItem(storageKey(lessonId), code);
  } catch {
    // Editing remains available when browser storage is full or disabled.
  }
}

export function resetDraft(lessonId) {
  try {
    localStorage.removeItem(storageKey(lessonId));
  } catch {
    // The editor still resets in memory even when storage is unavailable.
  }
}

export function createPythonEditor({ parent, lessonId, starterCode, onRun }) {
  activeEditor?.destroy();
  const initialCode = readDraft(lessonId, starterCode);
  const view = new EditorView({
    doc: initialCode,
    parent,
    extensions: [
      basicSetup,
      python(),
      oneDark,
      indentUnit.of('    '),
      EditorView.lineWrapping,
      Prec.highest(keymap.of([
        { key: 'Ctrl-Enter', run: () => { onRun(); return true; } },
        { key: 'Meta-Enter', run: () => { onRun(); return true; } }
      ])),
      keymap.of([...closeBracketsKeymap, indentWithTab]),
      EditorView.contentAttributes.of({
        'aria-label': 'Python code editor',
        spellcheck: 'false',
        autocapitalize: 'off',
        autocomplete: 'off',
        autocorrect: 'off'
      }),
      EditorView.updateListener.of(update => {
        if (update.docChanged) saveDraft(lessonId, update.state.doc.toString());
      })
    ]
  });
  activeEditor = view;
  return {
    view,
    getValue: () => view.state.doc.toString(),
    setValue: value => view.dispatch({ changes: { from: 0, to: view.state.doc.length, insert: value } }),
    focus: () => view.focus(),
    destroy: () => {
      view.destroy();
      if (activeEditor === view) activeEditor = null;
    }
  };
}
