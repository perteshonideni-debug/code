import { unit } from './lesson-unit.js';

export const advancedLessons = [
  unit({
    id: 'recursion-and-base-cases', title: 'Recursion and base cases', duration: '20 min',
    lede: 'Solve a problem by reducing it to a smaller version and stopping at a clear base case.',
    objectives: ['Identify recursive and base cases.', 'Trace a recursive call stack.', 'Prevent recursion that does not make progress.'],
    term: 'Recursion', definition: 'A technique in which a function solves a problem by calling itself on a smaller input.',
    detail: 'A recursive function needs a base case that returns without another call, plus a recursive case that moves closer to that base case. Each call gets its own local variables. Python limits recursion depth, so use a loop for simple repetition over very large inputs.',
    syntax: 'def solve(value):\n    if base_case(value):\n        return answer\n    return solve(smaller(value))',
    example: 'def factorial(number):\n    if number <= 1:\n        return 1\n    return number * factorial(number - 1)\n\nprint(factorial(5))',
    explanations: ['Receive a problem size.', 'Stop once the input reaches the base case.', 'Otherwise combine the current value with a smaller recursive result.', 'Five factorial is 5 × 4 × 3 × 2 × 1.'],
    mistake: 'A recursive call with unchanged or larger input never approaches the base case. Trace how each argument changes and verify the stopping condition first.',
    check: ['What must every useful recursive function include?', 'A base case and a recursive step that moves toward it.', 'A global variable shared by every call.', 'A loop that calls the function exactly once.'],
    interactivePrompt: 'Change the input to factorial and trace how the argument shrinks until the base case.',
    exercise: { instructions: 'Write `sum_to(n)` recursively. Return the sum from 1 through n; define `sum_to(0)` as 0.', starterCode: 'def sum_to(n):\n    # Return 0 at the base case\n    # Add n to the recursive result for n - 1\n    pass\n', hints: ['The base case is n == 0.', 'The recursive case is n + sum_to(n - 1).'], tests: [
      ['Base case returns zero', 'assert sum_to(0) == 0', 'Return zero before making another call.'], ['Adds a sequence', 'assert sum_to(5) == 15', 'Combine n with the sum of the smaller problem.'], ['Handles one', 'assert sum_to(1) == 1', 'Check that the recursive path reaches the base case.']
    ] },
    review: ['Why does sum_to need a base case?', 'It stops recursive calls and provides the simplest known result.', 'It stores every recursive result globally.', 'It makes Python ignore integer limits.']
  }),
  unit({
    id: 'iterators-and-generators', title: 'Iterators and generators', duration: '19 min',
    lede: 'Produce values one at a time so callers can process sequences without building them all at once.',
    objectives: ['Explain how `yield` differs from `return`.', 'Create a generator function.', 'Consume values with iteration.'],
    term: 'Generator', definition: 'An iterator produced by a function that yields values over time and resumes where it paused.',
    detail: 'Calling a generator function returns a generator object; its body runs as values are requested. Each `yield` produces one value and pauses the function. This lazy approach can save memory when processing large or unbounded sequences. A normal return ends the generator.',
    syntax: 'def values():\n    yield first_value\n    yield next_value',
    example: 'def countdown(start):\n    while start > 0:\n        yield start\n        start -= 1\n\nfor value in countdown(3):\n    print(value)',
    explanations: ['Define the generator and its starting state.', 'Continue while a positive value remains.', 'Yield the current value and pause execution.', 'Move toward the stopping condition after resumption.', 'A for loop requests each value in order.', 'Each yielded value is displayed.'],
    mistake: 'Printing inside a generator does not yield data to its caller. Use `yield` when the caller should receive each produced value.',
    check: ['What happens when a generator reaches yield?', 'It provides a value and pauses until the next value is requested.', 'It closes every file in the program.', 'It returns a list containing all future values.'],
    interactivePrompt: 'Change the countdown start and trace which values are yielded.',
    exercise: { instructions: 'Implement `even_numbers(limit)` as a generator that yields every even integer from 0 up to, but not including, limit.', starterCode: 'def even_numbers(limit):\n    # Yield each even value below limit\n    pass\n', hints: ['A range with a step of 2 visits even numbers.', 'Yield values one at a time instead of returning a list.'], tests: [
      ['Produces even values below the limit', 'assert list(even_numbers(8)) == [0, 2, 4, 6]', 'Yield each value in order and stop before the limit.'], ['Handles a small limit', 'assert list(even_numbers(1)) == [0]', 'The sequence begins at zero when zero is below the limit.'], ['Returns an iterator', 'assert iter(even_numbers(6)) is not None', 'Keep this a generator function by using yield.']
    ] },
    review: ['What is an advantage of yielding values lazily?', 'The caller can process values one at a time without storing the whole sequence.', 'The generator runs every line immediately when called.', 'The result is always a tuple.']
  }),
  unit({
    id: 'decorators-and-wrappers', title: 'Decorators and wrappers', duration: '22 min',
    lede: 'Add reusable behavior around a function while preserving its input and result.',
    objectives: ['Recognize a decorator as a callable transformation.', 'Write a wrapper function.', 'Preserve wrapped function metadata with `functools.wraps`.'],
    term: 'Decorator', definition: 'A callable that receives a function and returns a function with added or changed behavior.',
    detail: 'The `@decorator` syntax is shorthand for rebinding a function to the result of a decorator call. A wrapper can perform work before and after calling the original function. `functools.wraps` copies useful metadata such as the function name and docstring onto the wrapper.',
    syntax: '@decorate\ndef operation(value):\n    return value',
    example: 'from functools import wraps\n\ndef announce(function):\n    @wraps(function)\n    def wrapper(*args, **kwargs):\n        print("Starting")\n        return function(*args, **kwargs)\n    return wrapper',
    explanations: ['Import the metadata-preserving helper.', 'Define a decorator that accepts a function.', 'Apply wraps to preserve the original function identity metadata.', 'Accept arbitrary positional and named arguments.', 'Run the additional behavior before delegation.', 'Return the original function result.', 'Return the wrapper that replaces the decorated name.'],
    mistake: 'Forgetting to return the wrapper replaces the decorated function with None. Also return the original call’s value when callers depend on it.',
    check: ['What does a function decorator return?', 'Usually a replacement callable, often a wrapper around the original.', 'The output of the function call immediately.', 'A Python class attribute.'],
    interactivePrompt: 'Add a print before and after the wrapped call, then notice that the returned value still comes from the original function.',
    exercise: { instructions: 'Implement `repeat_twice`, a decorator whose wrapper calls the decorated function two times and returns the second call’s result.', starterCode: 'from functools import wraps\n\ndef repeat_twice(function):\n    # Return a wrapper that calls function two times\n    pass\n\n@repeat_twice\ndef add_one(value):\n    return value + 1\n', hints: ['The wrapper should accept *args and **kwargs.', 'Call the original function twice and return the second result.', 'Use @wraps(function) on the wrapper.'], tests: [
      ['Returns the wrapped result', 'assert add_one(4) == 5', 'Return the result from a call to the original function.'], ['Calls twice', 'calls = []\n@repeat_twice\ndef track(value):\n    calls.append(value)\n    return len(calls)\nassert track("x") == 2 and len(calls) == 2', 'Invoke the original function two times per wrapper call.'], ['Preserves the wrapped name', 'assert add_one.__name__ == "add_one"', 'Apply functools.wraps to the wrapper.']
    ] },
    review: ['Why is functools.wraps helpful?', 'It preserves useful metadata from the decorated function on its wrapper.', 'It makes a function run asynchronously.', 'It turns a function into a class.']
  }),
  unit({
    id: 'context-managers', title: 'Context managers and cleanup', duration: '21 min',
    lede: 'Pair resource setup with guaranteed cleanup, even when the work raises an exception.',
    objectives: ['Explain the roles of `__enter__` and `__exit__`.', 'Use `with` to manage a resource.', 'Ensure cleanup is tied to a block boundary.'],
    term: 'Context manager', definition: 'An object that manages setup and cleanup around a `with` block.',
    detail: 'A context manager’s `__enter__` method prepares a resource and supplies the value after `as`. Python calls `__exit__` when the block ends, including when an exception is raised. Returning True from `__exit__` suppresses that exception; most managers should let unexpected errors continue.',
    syntax: 'with resource_manager() as resource:\n    use(resource)',
    example: 'class Session:\n    def __enter__(self):\n        print("open")\n        return self\n\n    def __exit__(self, error_type, error, traceback):\n        print("close")\n        return False\n\nwith Session() as session:\n    print("work")',
    explanations: ['Define the resource manager.', 'Set up the resource when entering the block.', 'Expose the manager as the block value.', 'Run cleanup when leaving the block.', 'Accept exception details so the manager can react if needed.', 'Return False so unexpected exceptions are not suppressed.', 'Python calls __enter__ before entering the body.', 'The body uses the prepared resource.', 'Python calls __exit__ when the body completes.'],
    mistake: 'Cleanup code placed after a with block is skipped if an exception escapes the block. Put release logic in `__exit__` or use a standard library context manager.',
    check: ['When does Python call __exit__?', 'When execution leaves the with block, including after an exception.', 'Only after the program exits.', 'Before __enter__ runs.'],
    interactivePrompt: 'Raise an exception inside the Session block and observe that cleanup still runs.',
    exercise: { instructions: 'Create `CounterContext` whose `__enter__` increments `entered` and returns itself. Its `__exit__` increments `exited` and does not suppress exceptions.', starterCode: 'class CounterContext:\n    def __init__(self):\n        self.entered = 0\n        self.exited = 0\n\n    def __enter__(self):\n        # Record entry and return self\n        pass\n\n    def __exit__(self, error_type, error, traceback):\n        # Record cleanup; do not suppress errors\n        pass\n', hints: ['Increment entered in __enter__.', 'Increment exited in __exit__ and return False.'], tests: [
      ['Enters and exits the block', 'manager = CounterContext()\nwith manager as resource:\n    assert resource is manager\nassert (manager.entered, manager.exited) == (1, 1)', 'Return self from __enter__ and run cleanup in __exit__.'], ['Does not suppress exceptions', 'manager = CounterContext()\ntry:\n    with manager:\n        raise ValueError("expected")\nexcept ValueError:\n    pass\nelse:\n    raise AssertionError("The context manager should not suppress ValueError")\nassert manager.exited == 1', 'Return False from __exit__ so the exception continues outward.']
    ] },
    review: ['Why is cleanup in __exit__ more reliable than code after the with block?', 'The context protocol calls cleanup even when an exception interrupts the block.', 'It prevents exceptions from being raised.', 'It makes the managed object global.']
  })
];
