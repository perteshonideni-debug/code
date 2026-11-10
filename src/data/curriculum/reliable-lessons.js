import { unit } from './lesson-unit.js';

export const reliableLessons = [
  unit({
    id: 'exceptions-and-debugging', title: 'Exceptions and debugging', duration: '18 min',
    lede: 'Read tracebacks as clues, handle expected failures, and debug one assumption at a time.',
    objectives: ['Distinguish syntax errors from runtime exceptions.', 'Handle a specific exception with try and except.', 'Use a traceback to locate a failure.'],
    term: 'Exception', definition: 'An object raised by Python to report an error or unusual condition during execution.',
    detail: 'A syntax error prevents Python from parsing the program. A runtime exception happens after execution begins. A traceback records the call path and ends with the exception type and message. Handle only failures your program can reasonably recover from; broad exception handling can hide defects.',
    syntax: 'try:\n    risky_operation()\nexcept ValueError as error:\n    recover(error)',
    example: 'def parse_count(text):\n    try:\n        return int(text)\n    except ValueError:\n        return None\n\nprint(parse_count("12"))\nprint(parse_count("many"))',
    explanations: ['Define one operation whose input may be invalid.', 'Attempt conversion in the protected block.', 'Handle only the conversion failure we expect.', 'Return a value the caller can recognize as invalid.', 'A valid integer becomes 12.', 'Invalid numeric text becomes None.'],
    mistake: 'Catching every exception with `except:` can conceal bugs unrelated to the input. Catch the narrow exception you expect and keep the error visible when you cannot recover.',
    check: ['What does a traceback help you find?', 'The call path and location associated with an exception.', 'Every variable currently in memory.', 'The exact output the user intended.'],
    interactivePrompt: 'Change the valid and invalid input values and observe how the same function handles each case.',
    exercise: { instructions: 'Complete `safe_divide`. Return the quotient for nonzero divisors, return `None` for division by zero, and do not catch unrelated exceptions.', starterCode: 'def safe_divide(numerator, denominator):\n    # Handle a zero denominator\n    return numerator / denominator\n', hints: ['Check denominator before performing division.', 'Return None for zero; otherwise return numerator / denominator.'], tests: [
      ['Returns a quotient', 'assert safe_divide(12, 3) == 4'], ['Handles zero', 'assert safe_divide(5, 0) is None'], ['Does not change valid signs', 'assert safe_divide(-8, 2) == -4']
    ] },
    review: ['Why is catching a specific exception usually preferable?', 'It handles the failure you expect while allowing unrelated defects to remain visible.', 'It makes every exception recoverable automatically.', 'It removes the need to test inputs.']
  }),
  unit({
    id: 'files-and-modules', title: 'Files and modules', duration: '20 min',
    lede: 'Work with persistent text safely and reuse code through Python modules.',
    objectives: ['Use a context manager to open a file.', 'Explain why `with` closes a file reliably.', 'Import a named operation from a module.'],
    term: 'Context manager', definition: 'An object that sets up and reliably cleans up a resource around a block of code.',
    detail: 'Files are external resources, so programs should close them when finished. The `with open(...) as file` form closes a file even if an exception occurs. Use UTF-8 explicitly for predictable text encoding. A module is a Python file whose definitions can be imported and reused.',
    syntax: 'with open("notes.txt", "w", encoding="utf-8") as file:\n    file.write("Study Python")',
    example: 'from pathlib import Path\n\npath = Path("notes.txt")\npath.write_text("Study Python", encoding="utf-8")\ntext = path.read_text(encoding="utf-8")\nprint(text)',
    explanations: ['Import the path helper from the standard library.', 'Represent a filesystem location with a Path.', 'Write UTF-8 text to the path.', 'Read the text back using the same encoding.', 'Display the stored text.'],
    mistake: 'Opening a file without a context manager can leave it open if an error interrupts the function. Use `with` or pathlib helpers for straightforward text operations.',
    check: ['What cleanup does a with statement provide for an opened file?', 'It closes the file when the block exits, including when an exception occurs.', 'It encrypts the file automatically.', 'It converts every value into JSON.'],
    interactivePrompt: 'Try changing the text written to the temporary in-memory Python filesystem and observe the read result.',
    exercise: { instructions: 'Implement `summarize_lines`. Return the number of lines and the stripped non-empty lines as a tuple. Do not modify the input list.', starterCode: 'def summarize_lines(lines):\n    # Return (count, non_empty_lines)\n    pass\n', hints: ['Use a list comprehension to strip lines and remove empty results.', 'Return a tuple with len of the filtered list and that list.'], tests: [
      ['Counts non-empty lines', 'assert summarize_lines([" hello ", "", "world\\n"]) == (2, ["hello", "world"])'], ['Handles empty input', 'assert summarize_lines([]) == (0, [])'], ['Leaves source unchanged', 'source = [" hi "]; summarize_lines(source); assert source == [" hi "]']
    ] },
    review: ['Why use UTF-8 explicitly when reading and writing text?', 'It makes the expected text encoding clear and consistent across systems.', 'It prevents every possible file error.', 'It converts a file into a Python module.']
  })
];
