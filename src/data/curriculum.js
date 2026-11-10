import { beginnerLessons } from './curriculum/beginner-lessons.js';
import { controlDataLessons } from './curriculum/control-data-lessons.js';
import { functionsOopLessons } from './curriculum/functions-oop-lessons.js';
import { reliableLessons } from './curriculum/reliable-lessons.js';
import { advancedLessons } from './curriculum/advanced-lessons.js';
import { addLegacyActivities } from './curriculum/legacy-activities.js';
import { chapterOneExample, chapterOneGame, chapterOneLab, chapterOneLessons, chapterOneModules, chapterOneProject, chapterOneQuestions, chapterOneBlockTypes, chapterOneWorkshop } from './curriculum/chapter-one.js';
import { chapterTwoExample, chapterTwoGame, chapterTwoLab, chapterTwoLessons, chapterTwoModules, chapterTwoProject, chapterTwoQuestions, chapterTwoWorkshop } from './curriculum/chapter-two.js';
import { chapterThreeExample, chapterThreeGame, chapterThreeLab, chapterThreeLessons, chapterThreeModules, chapterThreeProject, chapterThreeQuestions, chapterThreeWorkshop } from './curriculum/chapter-three.js';
import { chapterFourExample, chapterFourGame, chapterFourLab, chapterFourLessons, chapterFourModules, chapterFourProject, chapterFourQuestions, chapterFourWorkshop } from './curriculum/chapter-four.js';
import { chapterFiveExample, chapterFiveGame, chapterFiveLab, chapterFiveLessons, chapterFiveModules, chapterFiveProject, chapterFiveWorkshop } from './curriculum/chapter-five.js';
import { chapterSixExample, chapterSixGame, chapterSixLab, chapterSixLessons, chapterSixModules, chapterSixProject, chapterSixQuestions, chapterSixWorkshop } from './curriculum/chapter-six.js';
import { chapterSevenExample, chapterSevenGame, chapterSevenLab, chapterSevenLessons, chapterSevenModules, chapterSevenProject, chapterSevenQuestions, chapterSevenWorkshop } from './curriculum/chapter-seven.js';

const paragraph = text => ({ type: 'paragraph', text });
const heading = text => ({ type: 'heading', level: 2, text });
const code = (codeText, caption = 'Python example') => ({ type: 'code', language: 'python', code: codeText, caption });
const callout = (title, text, tone = 'note') => ({ type: 'callout', title, text, tone });
const list = (items, ordered = false) => ({ type: 'list', items, ordered });
const exercise = (title, prompt, hint) => ({ type: 'exercise', title, prompt, hint });

const lessons = [
  {
    id: 'what-is-programming', title: 'What is programming?', duration: '8 min', type: 'lesson',
    lede: 'Turn a fuzzy problem into a sequence of precise, testable instructions.',
    objectives: ['Describe input, process, and output.', 'Explain why programs need precise instructions.'],
    content: [
      heading('A language for solving problems'),
      paragraph('Programming is the practice of describing a solution clearly enough that a computer can carry it out. A computer follows instructions in order, so a useful program starts with a clear problem and a small plan.'),
      heading('The three questions'),
      paragraph('Before writing code, identify the information you have, the transformation you need, and the useful result you want.'),
      list(['Input: the values a program receives', 'Process: the rules and decisions it applies', 'Output: the result it produces']),
      code('print("Hello, CodePath")', 'A first Python instruction'),
      callout('A useful habit', 'Read code as instructions. Ask what each line receives, changes, or produces.'),
      exercise('Try it yourself', 'Change the message so it introduces a topic you want to learn.', 'Keep the quotation marks around your text.')
    ]
  },
  {
    id: 'what-is-python', title: 'What is Python?', duration: '10 min', type: 'lesson',
    lede: 'See how Python balances readable syntax with tools for real work.',
    objectives: ['Recognize Python as an interpreted programming language.', 'Run a simple expression and inspect its output.'],
    content: [
      heading('Readable by design'),
      paragraph('Python is a general-purpose language used for automation, web services, data work, and scientific computing. Its syntax favors readable code, which makes it a good place to practice turning an idea into clear instructions.'),
      paragraph('A Python interpreter reads your source code and runs it. You can give it one expression at a time or ask it to run a saved script.'),
      code('language = "Python"\nprint(language)', 'Store a value, then display it'),
      callout('Remember', 'The interpreter runs the code you provide. A syntax error means the code does not match Python’s grammar yet.', 'tip'),
      exercise('Predict the output', 'What text will the print call display?', 'Trace the value assigned to language.')
    ]
  },
  {
    id: 'variables', title: 'Variables and values', duration: '12 min', type: 'lesson',
    lede: 'Give information useful names so your program can work with it.',
    objectives: ['Assign values to descriptive variable names.', 'Choose names that communicate a value’s purpose.'],
    content: [
      heading('Names make ideas visible'),
      paragraph('A variable is a name bound to a value. Names let you reuse information and explain what a calculation represents.'),
      code('student_name = "Mira"\nlessons_completed = 3\nprint(student_name, lessons_completed)'),
      { type: 'table', caption: 'A quick naming guide', headers: ['Prefer', 'Avoid', 'Why'], rows: [['lesson_count', 'lc', 'The first name explains the value'], ['total_minutes', 'x', 'A clear name is easier to maintain']] },
      callout('Python convention', 'Use lowercase words separated by underscores for variable names, such as reading_list.'),
      exercise('Name the data', 'Create variables for a book title and its page count, then print both.', 'Use a string for the title and an integer for the count.')
    ]
  },
  {
    id: 'conditionals', title: 'Conditional statements', duration: '14 min', type: 'lesson',
    lede: 'Use a condition to choose which instructions should run.',
    objectives: ['Write an if/else statement.', 'Predict which branch runs for a given condition.'],
    content: [
      heading('Programs can make decisions'),
      paragraph('An if statement runs its indented block when a condition is true. An else block gives the program a path when that condition is false.'),
      code('score = 82\n\nif score >= 60:\n    print("Ready for the next lesson")\nelse:\n    print("Keep practicing")'),
      callout('Indentation matters', 'Python uses indentation to mark the statements that belong to each branch.', 'tip'),
      exercise('Change the threshold', 'Update the condition so a score of 70 is needed to continue.', 'The comparison operator >= includes the threshold itself.')
    ]
  },
  {
    id: 'for-loops', title: 'For loops', duration: '15 min', type: 'lesson',
    lede: 'Repeat an action once for each item in a collection.',
    objectives: ['Read a for loop and describe its iteration variable.', 'Use a loop to process every item in a list.'],
    content: [
      heading('Repeat with intention'),
      paragraph('A for loop takes one item at a time from an iterable collection. The indented body runs once for each item.'),
      code('topics = ["strings", "lists", "functions"]\n\nfor topic in topics:\n    print(topic)', 'Visit each topic in order'),
      callout('One item at a time', 'On each pass, topic refers to the current item. When there are no more items, the loop ends.'),
      exercise('Add a topic', 'Add "testing" to the list and run the loop mentally.', 'The new item will appear where you place it in the list.')
    ]
  },
  {
    id: 'lists', title: 'Lists', duration: '18 min', type: 'lesson',
    lede: 'Keep an ordered collection of values and work with it confidently.',
    objectives: ['Create a list of related values.', 'Add an item with append and access an item by index.'],
    content: [
      heading('Collections of related values'),
      paragraph('Lists preserve order and can grow or shrink. They are useful for representing a set of related values, such as reading material or tasks.'),
      code('reading_list = ["Python", "Design", "Systems"]\nreading_list.append("Testing")\nprint(reading_list[0])'),
      callout('Indexes start at zero', 'The first item has index 0, the second has index 1, and so on.', 'tip'),
      exercise('Update the reading list', 'Append one more book and print the list length with len(reading_list).', 'Call len with the list as its argument.')
    ]
  },
  {
    id: 'functions', title: 'Functions and return values', duration: '16 min', type: 'lesson',
    lede: 'Package a useful operation into a named, reusable function.',
    objectives: ['Define and call a function.', 'Use a parameter for input and return a result.'],
    content: [
      heading('Give a task a name'),
      paragraph('A function groups instructions under a name. Parameters describe the information it needs, while return sends a result back to the caller.'),
      code('def minutes_to_seconds(minutes):\n    return minutes * 60\n\nlesson_seconds = minutes_to_seconds(12)\nprint(lesson_seconds)'),
      { type: 'example', title: 'Return versus print', text: 'Returning a value lets another part of the program use it. Printing only displays it to the user.' },
      exercise('Add a second conversion', 'Write a function that converts hours to minutes and call it with 2.', 'Multiply the number of hours by 60.')
    ]
  },
  {
    id: 'classes-and-objects', title: 'Classes and objects', duration: '20 min', type: 'lesson',
    lede: 'Model a useful concept by grouping its data and behavior together.',
    objectives: ['Distinguish a class from an instance.', 'Use a constructor to initialize instance attributes.'],
    content: [
      heading('A blueprint and its instances'),
      paragraph('A class describes a kind of object. Each object, also called an instance, carries its own attribute values and can use the methods defined by its class.'),
      code('class Book:\n    def __init__(self, title):\n        self.title = title\n\nfirst_book = Book("Python in Practice")\nprint(first_book.title)'),
      callout('What self means', 'Python passes the current instance to an instance method as its first argument. The name self is the common convention.'),
      exercise('Create a second instance', 'Make another Book with a different title and display both titles.', 'Each call to Book creates a separate instance.')
    ]
  },
  {
    id: 'project-planning', title: 'Plan a small Python project', duration: '12 min', type: 'lesson',
    lede: 'Turn a practical idea into data, operations, and observable outcomes.',
    objectives: ['Identify a project’s inputs and outputs.', 'Break a feature into small functions or objects.'],
    content: [
      heading('Start with the user’s task'),
      paragraph('A small project becomes easier to build when you describe what a user needs to do. For an email simulator, a user might create a message, view it, and mark it as read.'),
      list(['Data: sender, recipient, subject, and body', 'Operations: create, display, and mark as read', 'Checks: verify required fields and default state']),
      code('message = {"subject": "Lesson notes", "is_read": False}\n\nif not message["is_read"]:\n    print(message["subject"])'),
      callout('Build in slices', 'Implement one behavior, check that it works, and then add the next behavior.', 'tip'),
      exercise('Sketch one feature', 'Write down the inputs, operation, and expected output for adding a contact to an address book.', 'Keep the first version focused on one contact at a time.')
    ]
  }
];

const quizzes = [
  {
    id: 'programming-foundations-check', type: 'quiz', title: 'Programming foundations check', duration: '3 questions',
    lede: 'Check your understanding of instructions, interpreters, and variables.',
    questions: [
      { id: 'input-process-output', prompt: 'Which sequence best describes a simple program?', selection: 'single', options: ['Input, process, output', 'Output, input, repeat', 'Variable, screen, keyboard'], answer: ['Input, process, output'], explanation: 'A program receives information, applies rules, and produces a result.' },
      { id: 'python-interpreter', prompt: 'What does a Python interpreter do?', selection: 'single', options: ['Runs Python instructions', 'Designs a user interface', 'Stores every variable forever'], answer: ['Runs Python instructions'], explanation: 'The interpreter reads and executes Python code.' },
      { id: 'good-variable-name', prompt: 'Select the most descriptive variable name for the number of finished lessons.', selection: 'single', options: ['lesson_count', 'x', 'finished'], answer: ['lesson_count'], explanation: 'A descriptive name makes the value’s role clear.' }
    ]
  },
  {
    id: 'control-flow-check', type: 'quiz', title: 'Control flow check', duration: '2 questions',
    lede: 'Review conditions and repetition before continuing.',
    questions: [
      { id: 'if-branch', prompt: 'When does the body of an if statement run?', selection: 'single', options: ['When its condition is true', 'Only after a loop', 'Whenever the program starts'], answer: ['When its condition is true'], explanation: 'The condition controls whether the indented block executes.' },
      { id: 'loop-items', prompt: 'What happens in a for topic in topics loop?', selection: 'single', options: ['The body runs once per item', 'The body runs exactly twice', 'The list is sorted automatically'], answer: ['The body runs once per item'], explanation: 'A for loop visits each item in the iterable.' }
    ]
  },
  {
    id: 'functions-check', type: 'quiz', title: 'Functions check', duration: '2 questions',
    lede: 'Check your understanding of function inputs and returned values.',
    questions: [
      { id: 'function-parameter', prompt: 'What does a parameter describe?', selection: 'single', options: ['An input a function can receive', 'The value printed by every function', 'A comment above a function'], answer: ['An input a function can receive'], explanation: 'Parameters let a function work with values supplied by its caller.' },
      { id: 'function-return', prompt: 'Why return a value from a function?', selection: 'single', options: ['So the caller can use the result', 'To repeat the function forever', 'To rename the function'], answer: ['So the caller can use the result'], explanation: 'The caller can store, combine, or display a returned result.' }
    ]
  },
  {
    id: 'objects-check', type: 'quiz', title: 'Objects check', duration: '2 questions',
    lede: 'Review classes, instances, and constructor responsibilities.',
    questions: [
      { id: 'class-instance', prompt: 'Which statement describes a class and an instance?', selection: 'single', options: ['A class describes a type; an instance is one object of that type', 'An instance defines every class', 'They are unrelated terms'], answer: ['A class describes a type; an instance is one object of that type'], explanation: 'A class is the blueprint; instances are concrete objects created from it.' },
      { id: 'constructor-purpose', prompt: 'What is the usual purpose of __init__?', selection: 'single', options: ['Initialize an instance when it is created', 'Delete the class', 'Print every class attribute'], answer: ['Initialize an instance when it is created'], explanation: 'The constructor sets up the initial state of a new instance.' }
    ]
  }
];

function makeChapter(id, title, items, learning = {}) { return { id, title, items, ...learning }; }
function makeModule(id, title, chapterItems) {
  const chapters = chapterItems.map(chapter => makeChapter(chapter.id, chapter.title, chapter.items, chapter.learning ?? {}));
  return { id, title, chapters, lessons: chapters.flatMap(chapter => chapter.items.filter(item => item.type === 'lesson')) };
}

const [interpreter, builtins, arithmetic, strings, input] = beginnerLessons;
const [booleans, whileLoops, tuples, dictionaries, sets, slicing, comprehensions] = controlDataLessons;
const [parameters, scope, lambda, constructors, methods, composition, encapsulation, inheritance, specialMethods] = functionsOopLessons;
const [exceptions, files] = reliableLessons;
const enriched = lessons.map(addLegacyActivities);
const workshop = { id: 'email-simulator', type: 'workshop', title: 'Email Simulator workshop', duration: '12 guided steps', lede: 'Bring OOP fundamentals together by modelling messages, mailboxes, and an inbox as working Python objects.', href: '#/workshop/email-simulator' };
const chapterReview = (id, title, questions) => ({ id, type: 'quiz', title, duration: `${questions.length} questions`, lede: 'Review the key ideas from this chapter.', questions });

export const curriculum = {
  id: 'python-fundamentals', title: 'Python Fundamentals',
  description: 'Build a durable programming foundation by learning Python through clear explanations and small, useful programs.',
  level: 'Beginner', duration: '6–8 weeks', accent: 'PY', language: 'python',
  modules: [
    makeModule('programming-fundamentals', 'Bazat e Python-it', [
      { id: 'getting-started', title: 'Hapat e parë', items: [...chapterOneLessons, { id: 'bazat-quiz', type: 'quiz', title: 'Kuiz: Bazat e Python-it', questions: chapterOneQuestions }], learning: { learningVersion: 2, learningModules: chapterOneModules, learningBlocks: chapterOneBlockTypes, example: chapterOneExample, workshop: chapterOneWorkshop, lab: chapterOneLab, game: chapterOneGame, project: chapterOneProject } }
    ]),
    makeModule('control-flow', 'Vendimet dhe përsëritja', [
      { id: 'decisions-and-repetition', title: 'Vendime dhe cikle', items: [...chapterTwoLessons, { id: 'chapter-two-quiz', type: 'quiz', title: 'Kuiz: Vendimet dhe ciklet', questions: chapterTwoQuestions }], learning: { learningVersion: 2, learningModules: chapterTwoModules, example: chapterTwoExample, workshop: chapterTwoWorkshop, lab: chapterTwoLab, game: chapterTwoGame, project: chapterTwoProject, prerequisiteChapter: 'getting-started' } }
    ]),
    makeModule('data-structures', 'Koleksionet e Python-it', [
      { id: 'working-with-collections', title: 'Listat, fjalorët dhe set-et', items: [...chapterThreeLessons, { id: 'chapter-three-quiz', type: 'quiz', title: 'Kuiz: Koleksionet', questions: chapterThreeQuestions }], learning: { learningVersion: 2, learningModules: chapterThreeModules, example: chapterThreeExample, workshop: chapterThreeWorkshop, lab: chapterThreeLab, game: chapterThreeGame, project: chapterThreeProject, prerequisiteChapter: 'decisions-and-repetition' } }
    ]),
    makeModule('functions', 'Funksionet', [
      { id: 'reusable-behavior', title: 'Funksionet dhe rezultatet', items: [...chapterFourLessons, { id: 'chapter-four-quiz', type: 'quiz', title: 'Kuiz: Funksionet', questions: chapterFourQuestions }], learning: { learningVersion: 2, learningModules: chapterFourModules, example: chapterFourExample, workshop: chapterFourWorkshop, lab: chapterFourLab, game: chapterFourGame, project: chapterFourProject, prerequisiteChapter: 'working-with-collections' } }
    ]),
    makeModule('object-oriented-programming', 'Programimi i orientuar në objekte', [
      { id: 'objects-and-state', title: 'Objektet, gjendja dhe sjellja', items: [...chapterFiveLessons, { id: 'chapter-five-quiz', type: 'quiz', title: 'Kuiz: Objektet', questions: chapterFiveLessons.flatMap(item => [item.knowledgeCheck, item.predictionQuestion]) }], learning: { learningVersion: 2, learningModules: chapterFiveModules, example: chapterFiveExample, workshop: chapterFiveWorkshop, lab: chapterFiveLab, game: chapterFiveGame, project: chapterFiveProject, prerequisiteChapter: 'reusable-behavior' } }
    ]),
    makeModule('advanced-python', 'Abstraksione dhe algoritme në Python', [
      { id: 'advanced-language-tools', title: 'Rekursioni, gjeneratorët dhe kërkimi', items: [...chapterSixLessons, { id: 'chapter-six-quiz', type: 'quiz', title: 'Kuiz: Abstraksionet dhe algoritmet', questions: chapterSixQuestions }], learning: { learningVersion: 2, learningModules: chapterSixModules, example: chapterSixExample, workshop: chapterSixWorkshop, lab: chapterSixLab, game: chapterSixGame, project: chapterSixProject, prerequisiteChapter: 'objects-and-state' } }
    ]),
    makeModule('practical-workshops', 'Programet e besueshme dhe projektet', [
      { id: 'project-foundations', title: 'Të dhëna të sigurta dhe aplikacione', items: [...chapterSevenLessons, { id: 'chapter-seven-quiz', type: 'quiz', title: 'Kuiz: Programet e besueshme', questions: chapterSevenQuestions }], learning: { learningVersion: 2, learningModules: chapterSevenModules, example: chapterSevenExample, workshop: chapterSevenWorkshop, lab: chapterSevenLab, game: chapterSevenGame, project: chapterSevenProject, prerequisiteChapter: 'advanced-language-tools' } }
    ])
  ]
};

export const featuredCourses = [curriculum];

export function allItems(course = curriculum) {
  return course.modules.flatMap(module => module.chapters.flatMap(chapter => chapter.items.map(item => ({
    ...item, moduleId: module.id, moduleTitle: module.title, chapterId: chapter.id, chapterTitle: chapter.title
  }))));
}

export function allLessons(course = curriculum) { return allItems(course).filter(item => item.type === 'lesson'); }
export function allQuizzes(course = curriculum) { return allItems(course).filter(item => item.type === 'quiz'); }
export function findItem(id, course = curriculum) { return allItems(course).find(item => item.id === id) ?? allItems(course)[0]; }
export function findLesson(id, course = curriculum) { return allLessons(course).find(item => item.id === id) ?? allLessons(course)[0]; }

