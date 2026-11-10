const py = value => JSON.stringify(String(value));

function testBody(check) {
  if (check.kind === 'structure') {
    const method = check.method ? `\nif not any(isinstance(item, (ast.FunctionDef, ast.AsyncFunctionDef)) and item.name == ${py(check.method)} for item in cls.body):\n    raise AssertionError('Add the required method ${check.method} to ${check.name}.')` : '';
    return `tree = ast.parse(source)\nclasses = [node for node in tree.body if isinstance(node, ast.ClassDef) and node.name == ${py(check.name)}]\nif not classes:\n    raise AssertionError('Define class ${check.name}.')\ncls = classes[0]${method}`;
  }
  return check.code;
}

export function buildWorkshopTestProgram(source, checks) {
  const definitions = checks.map((check, index) => ({ id: `test-${index + 1}`, label: check.label, feedback: check.feedback, code: testBody(check) }));
  return `import ast, json\nsource = ${py(source)}\nchecks = json.loads(${py(JSON.stringify(definitions))})\nresults = []\nnamespace = {'__name__': 'codepath_student', 'ast': ast, 'source': source}\nprogram_error = None\ntry:\n    exec(compile(source, '<student-code>', 'exec'), namespace, namespace)\nexcept BaseException as error:\n    program_error = f'{type(error).__name__}: {error}'\nfor check in checks:\n    if program_error:\n        results.append({'id': check['id'], 'label': check['label'], 'feedback': check['feedback'], 'passed': False, 'detail': 'Your program stopped before tests could run: ' + program_error})\n        continue\n    try:\n        exec(compile(check['code'], '<workshop-test>', 'exec'), namespace, namespace)\n        results.append({'id': check['id'], 'label': check['label'], 'feedback': check['feedback'], 'passed': True, 'detail': 'Requirement satisfied.'})\n    except BaseException as error:\n        results.append({'id': check['id'], 'label': check['label'], 'feedback': check['feedback'], 'passed': False, 'detail': f'{type(error).__name__}: {error}' or check['feedback']})\njson.dumps(results)`;
}

export function parseWorkshopResults(result) {
  if (typeof result !== 'string') return null;
  try {
    let parsed = JSON.parse(result);
    if (typeof parsed === 'string') parsed = JSON.parse(parsed);
    return Array.isArray(parsed) ? parsed : null;
  } catch {
    return null;
  }
}

export function summarizeWorkshopResults(results) {
  const passed = results.filter(result => result.passed).length;
  return { passed, total: results.length, complete: passed === results.length };
}
