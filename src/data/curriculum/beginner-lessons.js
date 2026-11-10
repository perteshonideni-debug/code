import { unit } from './lesson-unit.js';

export const beginnerLessons = [
  unit({
    id: 'interpreter-and-scripts', title: 'The interpreter and Python scripts', duration: '12 min',
    lede: 'Understand the two common ways Python receives and runs instructions.', objectives: ['Distinguish interactive mode from script mode.', 'Explain why saved scripts are useful.'],
    term: 'Interpreter', definition: 'A program that reads Python source and executes its instructions.', detail: 'In interactive mode, the interpreter evaluates one entry at a time and shows its result immediately. In script mode, it executes a saved `.py` file from top to bottom. Both modes use the same Python language; they differ in how you provide the code and inspect its output.', syntax: 'python hello.py',
    example: 'message = "Hello from a script"\nprint(message)', explanations: ['Store a string in a named variable.', 'Send the value to standard output.'],
    mistake: 'A Python file is not run by merely saving it. The interpreter must be asked to execute that file.',
    check: ['What is the useful distinction between interactive mode and script mode?', 'Interactive mode evaluates entries as you type; script mode runs saved source.', 'Interactive mode uses a different Python language.', 'Scripts can contain only one instruction.'],
    interactivePrompt: 'Change the message and run it. Notice how print turns the stored value into visible output.',
    exercise: { instructions: 'Write a small script that stores a course name in `course` and a lesson number in `lesson_number`. Create `summary` with an f-string such as `Lesson 2: Python`, then print it.', starterCode: 'course = "Python"\nlesson_number = 2\n\n# Build and print the summary below\n', hints: ['Use `f"Lesson {lesson_number}: {course}"`.', 'Assign the formatted string before calling print.'], tests: [
      ['The script creates the requested summary.', 'assert summary == "Lesson 2: Python"', 'Check the spelling, spaces, and punctuation in the formatted result.'],
      ['The summary is a string.', 'assert isinstance(summary, str)', 'Use an f-string to create text from the stored values.']
    ] },
    review: ['Where do you usually see the result of a script’s print call?', 'In the program output or terminal.', 'Inside the Python file automatically.', 'Only in interactive mode.']
  }),
  unit({
    id: 'built-in-types', title: 'Numbers, text, and Boolean values', duration: '14 min',
    lede: 'Choose built-in value types that match the meaning of your data.', objectives: ['Recognize int, float, str, and bool values.', 'Use type conversion deliberately.'],
    term: 'Data type', definition: 'A classification that describes the kind of value and the operations that value supports.', detail: 'Python’s common built-in types include `int` for whole numbers, `float` for decimal numbers, `str` for text, and `bool` for truth values. Type matters: adding two numbers calculates, while adding two strings joins text.', syntax: 'count = int("3")\nprice = float("2.5")',
    example: 'guests = 3\nprice_each = 2.5\npaid = True\nprint(type(guests).__name__, type(price_each).__name__)', explanations: ['An integer stores a whole-number count.', 'A float represents a fractional measurement.', 'A Boolean records a true-or-false state.', 'The type built-in returns the value’s type.'],
    mistake: 'Input from a form or file often arrives as text. Convert it before using it in arithmetic.',
    check: ['Which type should represent whether a message has been read?', 'bool', 'str', 'float'],
    interactivePrompt: 'Change the values and try `type(value).__name__` to inspect each one.',
    exercise: { instructions: 'Convert the text `"18"` into an integer named `age`, then create a Boolean named `is_adult` that is true when age is at least 18.', starterCode: 'age_text = "18"\n# Convert the text, then decide whether the person is an adult\n', hints: ['Use `int(age_text)`.', 'Compare the resulting integer with 18.'], tests: [
      ['Text was converted to an integer.', 'assert age == 18 and isinstance(age, int)', 'Use int() to convert the digits in age_text.'],
      ['The adult check is a Boolean and includes age 18.', 'assert is_adult is True and isinstance(is_adult, bool)', 'Use a comparison such as age >= 18.']
    ] },
    review: ['What does int("18") do?', 'Converts the text digits into the integer 18.', 'Converts 18 into the text "18".', 'Rounds 18 to a float.']
  }),
  unit({
    id: 'arithmetic-and-operators', title: 'Arithmetic and operator precedence', duration: '14 min',
    lede: 'Calculate with Python’s numeric operators and make the order of operations visible.', objectives: ['Use arithmetic operators.', 'Use parentheses to communicate calculation order.'],
    term: 'Operator precedence', definition: 'Rules that determine which operation Python evaluates first in an expression.', detail: 'Multiplication and division are evaluated before addition and subtraction. Parentheses make a different order explicit. Python also provides `//` for floor division, `%` for a remainder, and `**` for exponentiation.', syntax: 'total = (unit_price * quantity) + delivery',
    example: 'subtotal = 4 * 3\nremainder = 17 % 5\nprint(subtotal, remainder)', explanations: ['Multiply before assigning the result.', 'The modulo operator returns the remainder after division.', 'Print both calculated values separated by a space.'],
    mistake: 'Do not rely on memory when an expression is hard to scan. Parentheses make intent clear even when precedence would already produce the same result.',
    check: ['What is the value of 2 + 3 * 4?', '14, because multiplication happens before addition.', '20, because addition happens first.', '24, because expressions run right to left.'],
    interactivePrompt: 'Change quantity and price, then compare a grouped expression with one that uses parentheses differently.',
    exercise: { instructions: 'Complete a small checkout calculation. Set `subtotal` to price times quantity, then set `total` to subtotal plus a fixed delivery fee. Do not round the calculation.', starterCode: 'price = 3.5\nquantity = 4\ndelivery = 2\n\n# Calculate subtotal and total\n', hints: ['Multiply price by quantity first.', 'Add delivery to the subtotal.'], tests: [
      ['Subtotal multiplies price by quantity.', 'assert subtotal == 14.0', 'Use the * operator with both named values.'],
      ['Delivery is included once.', 'assert total == 16.0', 'Add the delivery amount to subtotal.']
    ] },
    review: ['Which operator calculates a remainder?', '%', '//', '**']
  }),
  unit({
    id: 'strings-and-formatting', title: 'Strings and readable formatting', duration: '16 min',
    lede: 'Build clear text from values with string methods and f-strings.', objectives: ['Recognize strings as immutable text.', 'Format values into readable messages.'],
    term: 'String', definition: 'An ordered sequence of text characters, written between matching quotes.', detail: 'String methods such as `.strip()` and `.lower()` return transformed strings. They do not modify the original string in place. An f-string evaluates expressions inside braces and inserts their values into the surrounding text.', syntax: 'message = f"Welcome, {name.strip()}!"',
    example: 'name = "  Mira  "\nclean_name = name.strip()\nprint(f"Hello, {clean_name}!")', explanations: ['Keep the original value with its surrounding spaces.', 'Create a new string without leading or trailing whitespace.', 'Insert the cleaned value into an f-string.'],
    mistake: 'Calling a string method without storing or using its returned value does not change the original variable.',
    check: ['What does an f-string do?', 'Inserts evaluated values into a text template.', 'Runs a Python file faster.', 'Changes every string into a number.'],
    interactivePrompt: 'Edit the name and the greeting. Try adding `.upper()` inside the braces.',
    exercise: { instructions: 'Write `make_greeting(name)` that removes extra whitespace from name and returns `Welcome, NAME!` using the cleaned name.', starterCode: 'def make_greeting(name):\n    # Clean the name and return a formatted greeting\n    pass\n', hints: ['Use `name.strip()` and save the result.', 'Return an f-string; do not print it.'], tests: [
      ['Whitespace is removed before formatting.', 'assert make_greeting("  Mira  ") == "Welcome, Mira!"', 'Strip the input before placing it in the returned message.'],
      ['The function returns a string for another input.', 'assert make_greeting("Ada") == "Welcome, Ada!"', 'Return a value rather than printing it.']
    ] },
    review: ['Why save the result of name.strip()?', 'String methods return a new string; they do not edit the original.', 'strip() converts a string into a list.', 'Python variables cannot contain spaces.']
  }),
  unit({
    id: 'input-and-output', title: 'Input, output, and simple programs', duration: '16 min',
    lede: 'Connect values from a user to the output a program produces.', objectives: ['Use print for visible output.', 'Convert input text before numeric calculations.'],
    term: 'Input', definition: 'Information supplied to a program by a person, another program, or a data source.', detail: '`input()` displays an optional prompt and returns the entered characters as a string. `print()` writes values to standard output. Separating input, processing, and output makes a small program easier to reason about and test.', syntax: 'quantity = int(input("How many? "))',
    example: 'label = "Python"\nunits = 3\nprint(f"{units} lessons in {label}")', explanations: ['Keep the input data in a descriptive variable.', 'Store the numeric value separately.', 'Format both values into one user-facing line.'],
    mistake: 'input() always returns text, even when the user types digits. Convert it before adding or comparing numbers.',
    check: ['What type does input() return?', 'str', 'int', 'bool'],
    interactivePrompt: 'Change the label and count. Run the code and observe the complete output line.',
    exercise: { instructions: 'Write `format_receipt(item, quantity, unit_price)` that returns a line like `3 notebooks: $6.0`. Keep calculation and presentation in the returned value.', starterCode: 'def format_receipt(item, quantity, unit_price):\n    # Calculate the total and return a readable line\n    pass\n', hints: ['Calculate quantity * unit_price.', 'Use an f-string to include the item and total.'], tests: [
      ['The receipt includes the quantity and item name.', 'assert "3 notebooks" in format_receipt("notebooks", 3, 2.0)', 'Include both quantity and item in the returned text.'],
      ['The receipt calculates the extended price.', 'assert "$6.0" in format_receipt("notebooks", 3, 2.0)', 'Multiply the unit price by quantity.']
    ] },
    review: ['Why convert a numeric input before using it in a calculation?', 'The value returned by input() is text.', 'Python only calculates inside print().', 'input() always rounds values.']
  })
];
