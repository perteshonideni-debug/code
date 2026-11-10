import { unit } from './lesson-unit.js';

export const controlDataLessons = [
  unit({
    id: 'boolean-comparisons', title: 'Booleans and comparisons', duration: '14 min',
    lede: 'Combine comparisons and logical operators to express precise conditions.', objectives: ['Read comparison expressions.', 'Combine conditions with and, or, and not.'],
    term: 'Boolean', definition: 'A value that is either True or False.', detail: 'Comparison operators such as `==`, `!=`, `<`, and `>=` produce Boolean values. `and` requires both sides to be true, `or` requires at least one, and `not` reverses a truth value. Use parentheses when they make a compound condition easier to read.', syntax: 'is_open = stock > 0 and store_is_open',
    example: 'score = 84\npassed = score >= 60\nneeds_review = score < 60 or score > 100\nprint(passed, needs_review)', explanations: ['Store one score value.', 'Compare the score with a minimum.', 'Combine boundary checks into one Boolean.', 'Display both results.'],
    mistake: 'Use `==` to compare values. A single `=` assigns a value to a name.',
    check: ['When is `A and B` true?', 'Only when both A and B are true.', 'Whenever either one is true.', 'Only when both are false.'],
    interactivePrompt: 'Change the score and boundaries. Try a score exactly on the pass threshold.',
    exercise: { instructions: 'Implement `can_enter(age, has_ticket)`. Return True only when the visitor is at least 18 and has a ticket.', starterCode: 'def can_enter(age, has_ticket):\n    # Combine the age and ticket conditions\n    pass\n', hints: ['Use `age >= 18`.', 'Both the age and ticket checks must be true.'], tests: [
      ['An eligible visitor can enter.', 'assert can_enter(18, True) is True', 'Use an inclusive age comparison and check the ticket.'],
      ['A missing ticket blocks entry.', 'assert can_enter(30, False) is False', 'The ticket condition must also be true.'],
      ['A visitor below the age threshold is blocked.', 'assert can_enter(17, True) is False', 'The age and ticket requirements are both required.']
    ] },
    review: ['Which comparison checks whether two values are equal?', '==', '=', '!=']
  }),
  unit({
    id: 'while-loops', title: 'While loops and loop control', duration: '17 min',
    lede: 'Repeat while a condition remains true, and stop when the task is complete.', objectives: ['Write a loop with a changing condition.', 'Use break and continue deliberately.'],
    term: 'Iteration', definition: 'One repeated pass through a loop body.', detail: 'A `while` loop checks its condition before each pass. Something in the body must eventually make the condition false, unless a deliberate `break` exits it. `continue` skips to the next condition check. For known collections, a `for` loop is usually simpler.', syntax: 'while remaining > 0:\n    remaining -= 1',
    example: 'remaining = 3\nwhile remaining > 0:\n    print(remaining)\n    remaining -= 1\nprint("Ready")', explanations: ['Start with a positive number of repetitions.', 'Check the condition before each pass.', 'Display the current value.', 'Move toward the stopping condition.', 'This line runs after the loop ends.'],
    mistake: 'If the loop condition never changes and no break runs, the program may loop forever.',
    check: ['What prevents the sample loop from running forever?', 'remaining decreases on each pass until the condition becomes false.', 'print changes the value automatically.', 'while loops run exactly three times by definition.'],
    interactivePrompt: 'Change the starting value and run the loop. Add a continue to skip one value and observe the output.',
    exercise: { instructions: 'Implement `countdown(start)` that returns a list of integers from start down to 1. Return an empty list when start is below 1.', starterCode: 'def countdown(start):\n    values = []\n    # Use a while loop to add each remaining value\n    return values\n', hints: ['Continue while the current value is greater than zero.', 'Append the current number, then subtract one.'], tests: [
      ['Countdown contains every value in descending order.', 'assert countdown(4) == [4, 3, 2, 1]', 'Append before decreasing the current value.'],
      ['A non-positive start returns an empty list.', 'assert countdown(0) == [] and countdown(-2) == []', 'The loop should not run when the starting value is below one.']
    ] },
    review: ['When does a while loop evaluate its condition?', 'Before each iteration.', 'Only after the loop ends.', 'Only once when the function is defined.']
  }),
  unit({
    id: 'tuples', title: 'Tuples and fixed records', duration: '13 min',
    lede: 'Use tuples for ordered groups of values that should stay together.', objectives: ['Create and unpack tuples.', 'Choose a tuple when a fixed record fits the data.'],
    term: 'Tuple', definition: 'An ordered collection that cannot be changed after it is created.', detail: 'Tuples use commas to separate their values; parentheses are commonly used for readability. They support indexing and iteration like lists, but do not provide methods such as append. A tuple is useful for a fixed coordinate or a function result with a known shape.', syntax: 'point = (4, 7)\nx, y = point',
    example: 'location = (52.5, 13.4)\nlatitude, longitude = location\nprint(latitude, longitude)', explanations: ['Keep two related coordinate values together.', 'Unpack each position into a clearly named variable.', 'Use the unpacked values independently.'],
    mistake: 'A one-item tuple needs a trailing comma: `(value,)`. Without it, parentheses only group the value.',
    check: ['Which feature distinguishes a tuple from a list?', 'A tuple is immutable after creation.', 'A tuple cannot contain numbers.', 'A tuple has no item order.'],
    interactivePrompt: 'Change the coordinate values and unpack them into different names.',
    exercise: { instructions: 'Write `split_name(full_name)` that returns a two-item tuple containing the first and last word. Ignore extra spaces around the full name.', starterCode: 'def split_name(full_name):\n    # Clean, split, and return the first and last names\n    pass\n', hints: ['Use `.split()` to separate words after whitespace is normalized.', 'Return `(first, last)`.'], tests: [
      ['The function returns the first and last name as a tuple.', 'assert split_name("Ada Lovelace") == ("Ada", "Lovelace")', 'Return two values inside parentheses separated by a comma.'],
      ['Extra spaces are handled.', 'assert split_name("  Grace   Hopper ") == ("Grace", "Hopper")', 'The no-argument split method handles repeated whitespace.']
    ] },
    review: ['What does tuple unpacking do?', 'Assigns tuple positions to separate names.', 'Sorts the tuple.', 'Changes a tuple into a dictionary.']
  }),
  unit({
    id: 'dictionaries', title: 'Dictionaries and key-value data', duration: '18 min',
    lede: 'Represent named fields and look up information by meaningful keys.', objectives: ['Create and read dictionary values.', 'Use get and update patterns safely.'],
    term: 'Dictionary', definition: 'A mutable mapping from unique keys to values.', detail: 'A dictionary makes fields explicit: `person["name"]` communicates more than remembering that a person’s name lives at position zero. Keys must be hashable, while values may be any Python objects. Use `.get()` when a key may be absent.', syntax: 'person = {"name": "Ada", "active": True}',
    example: 'profile = {"name": "Ada", "lessons": 4}\nprofile["lessons"] += 1\nprint(profile.get("name", "Guest"))', explanations: ['Create fields with keys and their associated values.', 'Update the count stored under the lessons key.', 'Look up a possibly missing name with a fallback.'],
    mistake: 'Use square brackets for a required key. If it may not exist, `.get()` avoids a KeyError.',
    check: ['How do you retrieve a dictionary value when its key may be missing?', 'Use dict.get(key, default).', 'Use dict.append(key).', 'Use dict[0] regardless of its keys.'],
    interactivePrompt: 'Change the profile data. Try reading a key that is absent with and without a default.',
    exercise: { instructions: 'Implement `safe_score(scores, student)` that returns the student’s score, or 0 when the name is missing.', starterCode: 'def safe_score(scores, student):\n    # Look up a score with a useful fallback\n    pass\n', hints: ['Use the dictionary get method.', 'Pass zero as the default value.'], tests: [
      ['An existing student receives their score.', 'assert safe_score({"Mira": 92}, "Mira") == 92', 'Look up the requested student key.'],
      ['A missing student receives the default score.', 'assert safe_score({}, "Noor") == 0', 'Use zero as the fallback for a missing key.']
    ] },
    review: ['Why is a dictionary a good fit for named fields?', 'Keys describe the meaning of each associated value.', 'Values must always be strings.', 'Dictionaries store values only by numeric position.']
  }),
  unit({
    id: 'sets', title: 'Sets and unique values', duration: '14 min',
    lede: 'Remove duplicates and ask membership questions efficiently with sets.', objectives: ['Create a set from values.', 'Use membership and set operations.'],
    term: 'Set', definition: 'An unordered collection of distinct hashable values.', detail: 'Creating a set removes duplicate values. The `in` operator checks membership; union combines values, intersection keeps shared values, and difference keeps values found only on one side. Sets are useful for uniqueness, not for preserving sequence order.', syntax: 'unique_tags = set(tags)',
    example: 'morning = {"tea", "walk", "read"}\nevening = {"read", "music"}\nprint(morning & evening)', explanations: ['Create the first collection of unique activities.', 'Create a second set with one shared value.', 'The ampersand returns their intersection.'],
    mistake: 'An empty set is written `set()`. `{}` creates an empty dictionary.',
    check: ['What happens when a list is converted to a set?', 'Duplicate values are removed.', 'The values are sorted permanently.', 'The list becomes a tuple.'],
    interactivePrompt: 'Add repeated values to a list and print set(values) to observe which values remain.',
    exercise: { instructions: 'Implement `shared_tags(first, second)` that returns the set of tags appearing in both inputs.', starterCode: 'def shared_tags(first, second):\n    # Return the intersection as a set\n    pass\n', hints: ['Convert each input to a set if needed.', 'Use the `&` operator or `.intersection()`.'], tests: [
      ['Only shared values are returned.', 'assert shared_tags(["python", "oop"], ["oop", "testing"]) == {"oop"}', 'Return the set intersection.'],
      ['Duplicates do not appear in the result.', 'assert shared_tags(["a", "a", "b"], ["a"]) == {"a"}', 'Set values are unique by definition.']
    ] },
    review: ['Which collection is designed to keep only unique values?', 'set', 'list', 'str']
  }),
  unit({
    id: 'slicing-and-indexing', title: 'Indexing, slicing, and sequence boundaries', duration: '16 min',
    lede: 'Select one value or a range without losing track of sequence boundaries.', objectives: ['Use zero-based indexing.', 'Use half-open slices and handle edge positions.'],
    term: 'Slice', definition: 'A selection of a sequence written with a start index and an end boundary.', detail: 'A slice `values[start:stop]` includes the start position but excludes stop. This half-open rule makes the slice length easy to calculate: `stop - start`. Omitting a boundary uses the beginning or end of the sequence.', syntax: 'first_three = values[:3]',
    example: 'letters = ["a", "b", "c", "d"]\nprint(letters[1])\nprint(letters[1:3])\nprint(letters[-1])', explanations: ['The first item is at index zero.', 'Index one selects the second item.', 'The slice stops before index three.', 'A negative index counts backward from the end.'],
    mistake: 'The stop index is not included. A slice ending at 3 contains positions 0, 1, and 2 at most.',
    check: ['What does items[1:3] contain?', 'Items at positions 1 and 2.', 'Items at positions 1, 2, and 3.', 'Only the item at position 3.'],
    interactivePrompt: 'Change the start and stop indexes. Try a negative index and a slice without a stop value.',
    exercise: { instructions: 'Write `middle_items(items)` that returns all items except the first and last. For lists shorter than three items, return an empty list.', starterCode: 'def middle_items(items):\n    # Return the inner slice, with a short-list guard\n    pass\n', hints: ['Check the list length before slicing.', 'The inner slice starts at 1 and stops at -1.'], tests: [
      ['The first and last items are excluded.', 'assert middle_items(["a", "b", "c", "d"]) == ["b", "c"]', 'Slice from index one up to but not including the last item.'],
      ['Short lists return an empty list.', 'assert middle_items([1, 2]) == [] and middle_items([]) == []', 'Check length before returning the slice.']
    ] },
    review: ['Why does a slice stop before its end index?', 'A half-open range makes lengths and adjacent slices straightforward.', 'Python cannot calculate the final index.', 'The last value is always removed from a sequence.']
  }),
  unit({
    id: 'iteration-and-comprehensions', title: 'Iteration and comprehensions', duration: '18 min',
    lede: 'Transform collections clearly, choosing between a loop and a concise comprehension.', objectives: ['Iterate over values and key-value pairs.', 'Write a readable list comprehension.'],
    term: 'List comprehension', definition: 'A compact expression that builds a list by transforming each item from an iterable.', detail: 'A comprehension follows the order “output expression, for clause, optional filter.” A regular loop is often clearer when the task has several steps or side effects. For dictionaries, use `.items()` to iterate through keys and values together.', syntax: '[expression for item in items if condition]',
    example: 'temperatures = [18, 22, 16, 25]\nwarm = [value for value in temperatures if value >= 20]\nprint(warm)', explanations: ['Start with a collection of readings.', 'Keep values meeting the threshold and build a new list.', 'Display the transformed collection.'],
    mistake: 'Do not use a comprehension only to call print or mutate unrelated state. Use a loop for side effects.',
    check: ['What does the optional if clause do in a list comprehension?', 'Filters which source items produce output values.', 'Sorts the result automatically.', 'Changes the original list.'],
    interactivePrompt: 'Change the threshold and source numbers. Compare the comprehension with an equivalent for loop.',
    exercise: { instructions: 'Implement `long_words(words, minimum)` with a list comprehension that returns words whose length is at least minimum, preserving order.', starterCode: 'def long_words(words, minimum):\n    # Build and return a filtered list\n    pass\n', hints: ['Use `len(word) >= minimum` as the filter.', 'The expression before `for` should be the original word.'], tests: [
      ['Words meeting the threshold are kept in their original order.', 'assert long_words(["map", "dictionary", "set"], 4) == ["dictionary"]', 'Filter by length while keeping source order.'],
      ['The threshold is inclusive.', 'assert long_words(["code", "path"], 4) == ["code", "path"]', 'Use greater than or equal to.']
    ] },
    review: ['When is a regular for loop often clearer than a comprehension?', 'When multiple steps or side effects make the expression hard to read.', 'Whenever a list has more than one item.', 'When the values are strings.']
  })
];
