import { unit } from './lesson-unit.js';

export const functionsOopLessons = [
  unit({
    id: 'function-parameters', title: 'Parameters, arguments, and defaults', duration: '17 min',
    lede: 'Design functions with clear inputs and useful optional values.', objectives: ['Distinguish parameters from arguments.', 'Use keyword and default arguments intentionally.'],
    term: 'Parameter and argument', definition: 'A parameter is a name in a function definition; an argument is the value supplied when calling that function.', detail: 'Positional arguments bind by order. Keyword arguments bind by name and improve clarity when a function has several options. A default value makes an argument optional. Avoid mutable default values such as `[]`, since that same object is reused between calls.', syntax: 'def greet(name, punctuation="!"):',
    example: 'def greet(name, punctuation="!"):\n    return f"Hello, {name}{punctuation}"\n\nprint(greet("Ada"))\nprint(greet(name="Lin", punctuation="."))', explanations: ['Define a required parameter and an optional default.', 'Return a formatted message.', 'Call with the required argument and use the default.', 'Pass values by keyword for clarity.'],
    mistake: 'Do not use a list or dictionary as a default parameter. Use None and create a fresh collection inside the function.',
    check: ['What does a default parameter value allow?', 'A caller may omit that argument and use the default.', 'Python skips the function body.', 'The argument is converted to a string.'],
    interactivePrompt: 'Change the default punctuation and compare positional and keyword calls.',
    exercise: { instructions: 'Implement `make_title(name, prefix="Dr.")` that returns the prefix and name separated by one space. A caller may provide another prefix.', starterCode: 'def make_title(name, prefix="Dr."):\n    # Return the prefix and name together\n    pass\n', hints: ['The default belongs in the function definition.', 'Return an f-string; keyword calls should work too.'], tests: [
      ['The default prefix is used when omitted.', 'assert make_title("Ada") == "Dr. Ada"', 'Keep the default parameter in the signature.'],
      ['A caller can override the default by keyword.', 'assert make_title("Lin", prefix="Professor") == "Professor Lin"', 'Use the supplied prefix inside the returned string.']
    ] },
    review: ['Why can a keyword argument improve readability?', 'Its name makes the value’s purpose explicit at the call site.', 'It makes Python ignore the function signature.', 'It always runs faster than a positional argument.']
  }),
  unit({
    id: 'function-scope', title: 'Return values and scope', duration: '16 min',
    lede: 'Keep data flow explicit with return values and local names.', objectives: ['Explain local scope.', 'Return results instead of relying on hidden global state.'],
    term: 'Scope', definition: 'The region of a program where a name can be accessed.', detail: 'Names assigned inside a function are local to that call unless declared otherwise. A return value carries a result back to the caller, where it can be stored or combined. Explicit inputs and outputs make functions easier to reuse and test.', syntax: 'def area(width, height):\n    return width * height',
    example: 'def area(width, height):\n    result = width * height\n    return result\n\nroom_area = area(4, 5)\nprint(room_area)', explanations: ['Accept the values needed for the task.', 'Store an intermediate calculation locally.', 'Send the result back to the caller.', 'Capture the returned result in another scope.', 'Display the stored value.'],
    mistake: 'A function that prints a value does not automatically return it. The caller receives None unless a value is returned.',
    check: ['What does return do?', 'Sends a value back to the caller and ends that function call.', 'Displays a value on screen.', 'Creates a global variable.'],
    interactivePrompt: 'Change the dimensions. Remove return and observe what the caller receives.',
    exercise: { instructions: 'Write `average(values)` that returns the arithmetic mean. The input will contain at least one number.', starterCode: 'def average(values):\n    # Calculate and return the mean\n    pass\n', hints: ['Use sum(values) for the total.', 'Divide by len(values).'], tests: [
      ['The mean is returned for a list of integers.', 'assert average([2, 4, 6]) == 4', 'Divide the sum by the number of values.'],
      ['The function supports fractional results.', 'assert average([1, 2]) == 1.5', 'Do not round unless the instructions ask you to.']
    ] },
    review: ['Where is a variable assigned inside a function normally available?', 'Inside that function call’s local scope.', 'Everywhere in the program forever.', 'Only in the module that imports the function.']
  }),
  unit({
    id: 'lambda-functions', title: 'Lambda functions and sorting keys', duration: '14 min',
    lede: 'Use small anonymous functions where a named function would add little clarity.', objectives: ['Read a lambda expression.', 'Sort records using a key function.'],
    term: 'Lambda expression', definition: 'A compact expression that creates a small anonymous function.', detail: 'A lambda contains one expression whose value is returned. It is useful for short callbacks, such as a sorting key. If the transformation needs several statements or a descriptive name, define a regular function instead.', syntax: 'sorted(words, key=lambda word: len(word))',
    example: 'names = ["Lin", "Alexander", "Ada"]\nordered = sorted(names, key=lambda name: len(name))\nprint(ordered)', explanations: ['Start with names of different lengths.', 'Create a new sorted list using each name’s length as its key.', 'Display the reordered list.'],
    mistake: 'A lambda is not a place to put multiple statements. Use def when the logic deserves a name or explanation.',
    check: ['What does the lambda return?', 'The value of its single expression.', 'The result of every statement in the file.', 'A generator that sorts automatically.'],
    interactivePrompt: 'Change the key expression to sort alphabetically or by the last character.',
    exercise: { instructions: 'Implement `sort_by_second(records)` that returns a new list sorted by each tuple’s second value. Do not mutate the input list.', starterCode: 'def sort_by_second(records):\n    # Return a sorted copy using a key function\n    pass\n', hints: ['Use sorted(records, key=...).', 'The key function can select record[1].'], tests: [
      ['Records are ordered by their second field.', 'assert sort_by_second([("a", 3), ("b", 1), ("c", 2)]) == [("b", 1), ("c", 2), ("a", 3)]', 'Use the second tuple item as the sort key.'],
      ['The input remains unchanged.', 'records = [("x", 2), ("y", 1)]\nsort_by_second(records)\nassert records == [("x", 2), ("y", 1)]', 'sorted() returns a new list.']
    ] },
    review: ['When is lambda most useful?', 'For a short, single-expression callback such as a sort key.', 'For a long algorithm with several branches.', 'For defining a class constructor.']
  }),
  unit({
    id: 'constructors-and-attributes', title: 'Constructors and instance attributes', duration: '20 min',
    lede: 'Initialize each object with the state that belongs to that instance.', objectives: ['Define __init__.', 'Store constructor values as instance attributes.'],
    term: 'Instance attribute', definition: 'A value stored on one particular object, usually through self.attribute.', detail: '`__init__` runs after Python creates an instance. It receives that instance as `self` and can assign its initial state. Each call to the class produces a separate object whose attributes can hold different values.', syntax: 'self.title = title',
    example: 'class Book:\n    def __init__(self, title, pages):\n        self.title = title\n        self.pages = pages\n\nbook = Book("Python", 240)\nprint(book.title)', explanations: ['Declare a class that models a book.', 'Accept the state needed to initialize each object.', 'Store the title on this instance.', 'Store the page count on this instance.', 'Create one object with concrete values.', 'Read its title attribute.'],
    mistake: 'Assigning `title = title` only creates or updates a local name. Use `self.title = title` to store it on the object.',
    check: ['What is the purpose of self.title = title inside __init__?', 'Store the passed value on this particular instance.', 'Create a new class named title.', 'Make title a global constant.'],
    interactivePrompt: 'Change the constructor values and create a second Book. Compare their attributes.',
    exercise: { instructions: 'Create a `Badge` class whose constructor accepts `name` and `level` and stores both as instance attributes.', starterCode: 'class Badge:\n    def __init__(self, name, level):\n        # Store the values on this instance\n        pass\n', hints: ['Assign `self.name = name`.', 'Add the corresponding assignment for level.'], tests: [
      ['Badge stores its name and level.', 'badge = Badge("Python", 2)\nassert badge.name == "Python" and badge.level == 2', 'Save both constructor arguments on self.'],
      ['Two Badge instances keep separate values.', 'first = Badge("Python", 1)\nsecond = Badge("SQL", 3)\nassert first.name == "Python" and second.level == 3', 'Use instance attributes, not one shared class value.']
    ] },
    review: ['Where should data that differs for each object be stored?', 'On that object as an instance attribute.', 'In one shared class variable only.', 'In a print statement.']
  }),
  unit({
    id: 'instance-methods', title: 'Instance methods and object behavior', duration: '18 min',
    lede: 'Give objects behavior that operates on their own state.', objectives: ['Define an instance method.', 'Call methods through an object.'],
    term: 'Instance method', definition: 'A function defined on a class that receives the current instance as its first argument.', detail: 'The conventional first parameter name is `self`. When a method is called as `account.deposit(5)`, Python supplies account as self. A method can inspect or update that object’s attributes and may return a useful result.', syntax: 'def deposit(self, amount):',
    example: 'class Counter:\n    def __init__(self):\n        self.value = 0\n\n    def increment(self):\n        self.value += 1\n        return self.value\n\ncount = Counter()\nprint(count.increment())', explanations: ['Create a class for a counter.', 'Initialize each instance with a starting value.', 'Define behavior that belongs to an instance.', 'Update this counter’s own value.', 'Return the updated value to the caller.', 'Create an independent counter object.', 'Call its method and display the result.'],
    mistake: 'Call an instance method on an object. Calling the underlying function directly usually means you must supply self yourself.',
    check: ['What does self refer to during an instance method call?', 'The object that received the method call.', 'The class source code as text.', 'The method’s return value.'],
    interactivePrompt: 'Call increment several times and create a second Counter to compare independent state.',
    exercise: { instructions: 'Create a `Counter` class. It starts at zero and has an `increment(amount=1)` method that updates and returns the new count.', starterCode: 'class Counter:\n    def __init__(self):\n        self.value = 0\n\n    def increment(self, amount=1):\n        # Update and return this counter\n        pass\n', hints: ['Add amount to self.value.', 'Return self.value after the update.'], tests: [
      ['The default increment adds one.', 'counter = Counter()\nassert counter.increment() == 1', 'Keep the default amount at one.'],
      ['A custom increment amount works.', 'assert counter.increment(4) == 5', 'Update the existing value, then return it.'],
      ['Another counter starts independently.', 'other = Counter()\nassert other.value == 0', 'Initialize state inside __init__.']
    ] },
    review: ['How does Python supply self when calling object.method()?', 'It binds the object as the method’s first argument.', 'It looks up a global object named self.', 'It copies the class into the object.']
  }),
  unit({
    id: 'composition-and-relationships', title: 'Composition and object relationships', duration: '20 min',
    lede: 'Build larger models by letting one object contain and coordinate other objects.', objectives: ['Explain a has-a relationship.', 'Store and use related objects in another object.'],
    term: 'Composition', definition: 'A design relationship where an object owns or uses other objects to do its work.', detail: 'A Playlist has Tracks; a Mailbox has Email messages. The containing object manages a collection, while each contained object keeps the state and behavior that belong to it. This division keeps responsibilities focused.', syntax: 'self.tracks = []',
    example: 'class Track:\n    def __init__(self, title):\n        self.title = title\n\nclass Playlist:\n    def __init__(self):\n        self.tracks = []\n\n    def add(self, track):\n        self.tracks.append(track)', explanations: ['Model one track with its own title.', 'Initialize the Track instance.', 'Create a separate class for a playlist.', 'Each playlist owns a fresh list.', 'Add a Track object to that playlist.'],
    extra: [{ type: 'diagram', title: 'A playlist has tracks', nodes: ['Playlist', 'Track A', 'Track B'], description: 'One Playlist owns a list containing Track objects.' }],
    mistake: 'Do not put mutable collections on the class when each instance needs its own. Create them inside __init__.',
    check: ['Which describes composition?', 'A playlist contains Track objects.', 'A Playlist is always a kind of Track.', 'Two classes share the same constructor.'],
    interactivePrompt: 'Add two Track objects to one Playlist and create another empty playlist to compare their contents.',
    exercise: { instructions: 'Create `Notebook` with an `entries` list and an `add(entry)` method. Each notebook must have its own list.', starterCode: 'class Notebook:\n    def __init__(self):\n        # Create a fresh list for this notebook\n        pass\n\n    def add(self, entry):\n        # Store the entry in this notebook\n        pass\n', hints: ['Initialize self.entries to an empty list.', 'Append the given entry to that list.'], tests: [
      ['The notebook stores added entries.', 'book = Notebook()\nbook.add("composition")\nassert book.entries == ["composition"]', 'Append the entry to the instance’s entries list.'],
      ['Notebook instances do not share their lists.', 'first = Notebook()\nsecond = Notebook()\nfirst.add("one")\nassert second.entries == []', 'Create a new list inside each constructor call.']
    ] },
    review: ['What does the containing object do in a composition relationship?', 'Coordinates objects it contains while each object keeps its own responsibility.', 'Copies all other classes into itself.', 'Turns every contained object into a string.']
  }),
  unit({
    id: 'encapsulation-and-class-attributes', title: 'Encapsulation and shared class attributes', duration: '19 min',
    lede: 'Keep an object’s state valid and distinguish instance state from shared class data.', objectives: ['Use methods to protect invariants.', 'Recognize class attributes and mutable shared-state risks.'],
    term: 'Encapsulation', definition: 'A design practice that groups data with the operations that manage it and protects important invariants.', detail: 'Python uses naming conventions such as `_balance` to signal an implementation detail. A method can validate a change before updating the state. Class attributes are shared by instances; immutable constants suit them better than mutable per-instance lists.', syntax: 'self._balance += amount',
    example: 'class Wallet:\n    def __init__(self):\n        self._balance = 0\n\n    def add(self, amount):\n        if amount > 0:\n            self._balance += amount', explanations: ['Define an object that owns a balance.', 'Initialize private-by-convention state per wallet.', 'Expose a controlled operation for changes.', 'Reject non-positive deposits.', 'Update state only after validation.'],
    mistake: 'A leading underscore is a convention, not strict privacy. Keep callers on the documented methods so invariants stay consistent.',
    check: ['What does the underscore in _balance communicate?', 'A convention that the attribute is an implementation detail.', 'The value cannot be accessed by Python.', 'The value is shared by every instance.'],
    interactivePrompt: 'Try valid and invalid deposits, then compare the wallet state.',
    exercise: { instructions: 'Implement `Wallet` with a zero balance and `deposit(amount)`. Positive amounts are added; zero or negative amounts are ignored. Expose the value through `balance()`.', starterCode: 'class Wallet:\n    def __init__(self):\n        self._balance = 0\n\n    def deposit(self, amount):\n        # Accept only positive deposits\n        pass\n\n    def balance(self):\n        # Return the current balance\n        pass\n', hints: ['Check amount > 0 before changing state.', 'Return _balance from balance().'], tests: [
      ['A positive deposit changes the balance.', 'wallet = Wallet()\nwallet.deposit(12)\nassert wallet.balance() == 12', 'Update the internal value for a positive amount.'],
      ['An invalid deposit leaves the balance unchanged.', 'wallet = Wallet()\nwallet.deposit(-5)\nassert wallet.balance() == 0', 'Validate before modifying the object’s state.']
    ] },
    review: ['What is an invariant?', 'A condition an object’s methods preserve as its state changes.', 'A Python keyword for private variables.', 'A class that cannot be instantiated.']
  }),
  unit({
    id: 'inheritance-and-polymorphism', title: 'Inheritance and polymorphism', duration: '22 min',
    lede: 'Share a common interface while allowing related objects to provide different behavior.', objectives: ['Recognize an is-a relationship.', 'Call the same method on different implementations.'],
    term: 'Polymorphism', definition: 'The ability to use different object types through a shared operation or interface.', detail: 'Inheritance lets a subclass specialize a base class. A subclass can override a method. Polymorphism comes from relying on the behavior an object provides rather than scattering type-specific conditionals through calling code.', syntax: 'class EmailAlert(Alert):',
    example: 'class Alert:\n    def message(self):\n        return "Something happened"\n\nclass EmailAlert(Alert):\n    def message(self):\n        return "Check your inbox"\n\nfor alert in [Alert(), EmailAlert()]:\n    print(alert.message())', explanations: ['Define a shared alert interface.', 'Provide a default behavior.', 'Specialize the base class.', 'Override the shared method.', 'Place different implementations in one collection.', 'Call the same operation on each object.'],
    mistake: 'Inheritance should represent a genuine is-a relationship. Use composition when one object simply contains or uses another.',
    check: ['What makes the alert loop polymorphic?', 'It calls the same method on objects with different implementations.', 'It checks every object’s exact type before printing.', 'It creates a subclass during each iteration.'],
    interactivePrompt: 'Add another alert class that overrides message(), then run the same loop.',
    exercise: { instructions: 'Create a `Shape` base class with `area()` returning 0. Add `Rectangle(width, height)` that inherits from Shape and overrides area() to return its area.', starterCode: 'class Shape:\n    def area(self):\n        return 0\n\nclass Rectangle(Shape):\n    def __init__(self, width, height):\n        self.width = width\n        self.height = height\n\n    def area(self):\n        # Override the base behavior\n        pass\n', hints: ['Multiply the two instance attributes.', 'Keep the method name the same so callers share an interface.'], tests: [
      ['Rectangle overrides the area behavior.', 'rectangle = Rectangle(3, 4)\nassert rectangle.area() == 12', 'Return width multiplied by height.'],
      ['Rectangle remains usable as a Shape.', 'assert isinstance(Rectangle(2, 5), Shape)', 'Inherit from Shape in the class definition.']
    ] },
    review: ['When should a class inherit from another class?', 'When it is a specialized kind of the base type and shares its interface.', 'Whenever one object stores another object.', 'Whenever two methods have different names.']
  }),
  unit({
    id: 'special-methods', title: 'Special methods and object protocols', duration: '20 min',
    lede: 'Teach Python’s built-in operations how to work with your objects.', objectives: ['Implement __str__ for readable display.', 'Implement a special method such as __len__.'],
    term: 'Special method', definition: 'A method with a double-underscore name that Python calls to support a language operation or built-in protocol.', detail: '`__str__` provides a user-facing text representation for `str()` and `print()`. `__len__` supports `len(object)`. Implement only the protocols that fit the object, and return the documented type from each method.', syntax: 'def __str__(self):\n    return self.title',
    example: 'class Shelf:\n    def __init__(self, books):\n        self.books = books\n\n    def __len__(self):\n        return len(self.books)\n\nshelf = Shelf(["Python", "Design"])\nprint(len(shelf))', explanations: ['Define an object that owns a collection.', 'Keep the supplied books on this shelf.', 'Implement the protocol for len().', 'Delegate the count to the contained list.', 'Create one shelf with two values.', 'Python calls __len__ for this built-in operation.'],
    mistake: '__str__ must return a string. Printing inside __str__ and returning None breaks str(object).',
    check: ['Which operation uses __len__?', 'Calling len(object).', 'Creating the object.', 'Comparing two class names.'],
    interactivePrompt: 'Change the book list and call len(shelf). Add a __str__ method and print the object.',
    exercise: { instructions: 'Create `ReadingList(titles)` that stores a copy of titles, implements `__len__`, and returns `Reading list: N titles` from `__str__`.', starterCode: 'class ReadingList:\n    def __init__(self, titles):\n        self.titles = list(titles)\n\n    def __len__(self):\n        # Return the number of titles\n        pass\n\n    def __str__(self):\n        # Return a useful summary\n        pass\n', hints: ['Use len(self.titles).', 'Return an f-string that includes the count.'], tests: [
      ['len() reports the number of titles.', 'reading = ReadingList(["Python", "OOP"])\nassert len(reading) == 2', 'Return the length of the stored list.'],
      ['str() returns a readable summary.', 'assert str(ReadingList(["Python"])) == "Reading list: 1 titles"', 'Return a string with the count and required wording.'],
      ['The source list is copied.', 'titles = ["Python"]\nreading = ReadingList(titles)\ntitles.append("OOP")\nassert len(reading) == 1', 'Make a copy of the incoming collection.']
    ] },
    review: ['Why does __str__ need to return a value?', 'Python uses the returned string as the object’s readable representation.', 'Python automatically prints any local variable.', 'The method is called only during class definition.']
  })
];
