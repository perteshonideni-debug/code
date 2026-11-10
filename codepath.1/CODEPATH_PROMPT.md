# MASTER PROJECT PROMPT — CODEPATH
## Build a World-Class Interactive Coding Education Platform

Act as a world-class team consisting of:
- Senior Full-Stack Engineer
- Principal Frontend Architect
- Senior UI/UX Designer
- Educational Platform Engineer
- Python Runtime Engineer
- Database Architect
- Accessibility Specialist
- QA and Testing Engineer

Your mission is to design and build **CodePath**, a premium, highly interactive programming education platform inspired by the learning experiences of PyGnosis, freeCodeCamp, Codecademy, and Exercism.

IMPORTANT: Build an original product. Do not copy their branding, source code, proprietary content, images, or exact visual designs. Use them only as functional references.

The result must look and feel like a serious commercial education product, not a basic student project or generic template.

---

# 1. PRODUCT VISION

CodePath is an interactive coding academy where students learn programming by reading lessons, writing actual code, solving challenges, completing guided workshops, and passing automated tests.

The platform must support a complete learning journey:

- Courses
- Modules
- Chapters
- Lessons
- Interactive examples
- Guided coding workshops
- Step-by-step challenges
- Automated code evaluation
- Python execution in the browser
- Progress tracking
- Achievements
- Student accounts
- Admin course management

The first supported programming language is Python.

Architect the application so JavaScript, HTML/CSS, SQL, and additional languages can be introduced later.

Primary target audience: beginner and intermediate programmers.

Primary language: English initially, but design the architecture for Albanian and other translations.

---

# 2. TECHNOLOGY STACK

Use the following stack:

FRONTEND:
- HTML5
- CSS3
- Vanilla JavaScript (ES modules)
- CSS Grid and Flexbox
- Responsive design
- Accessible semantic HTML

CODE EDITOR:
- CodeMirror 6
- Python syntax highlighting
- Line numbers
- Auto indentation
- Code completion where practical
- Keyboard shortcuts
- Editable code regions

PYTHON EXECUTION:
- Pyodide (Python running through WebAssembly)
- Web Workers for execution isolation
- Execution timeout
- Capture stdout and stderr
- Display runtime errors
- Support multiple execution attempts
- Reset interpreter when necessary

BACKEND:
- Supabase
- PostgreSQL
- Supabase Authentication
- Supabase Row Level Security
- Supabase Storage when needed

DEPLOYMENT:
- Git
- GitHub
- Vercel or another suitable static frontend hosting service

Do not introduce React, Next.js, Vue, or Angular. The initial application must use vanilla HTML, CSS, and JavaScript.

Use modern JavaScript modules and a clean modular architecture.

---

# 3. PREMIUM UI/UX DESIGN SYSTEM

The interface must have a world-class visual identity.

Design direction:
- Premium SaaS
- Minimalist
- Elegant
- Professional
- Editorial typography
- Excellent spacing
- Subtle animations
- Sophisticated colors
- Clean information hierarchy

Create a consistent design system.

COLOR SYSTEM:
- Primary background: warm white / sophisticated dark navy
- Secondary background: subtle gray
- Accent: refined violet or electric blue
- Success: accessible green
- Error: sophisticated red
- Borders: subtle neutral tones
- Text: high contrast

TYPOGRAPHY:
- Inter for interface typography
- A sophisticated serif font for selected editorial headings
- Consistent typography scale
- Excellent readability for long lessons

COMPONENT DESIGN:
- Premium navigation
- Beautiful cards
- Subtle shadows
- Consistent border radius
- Carefully designed buttons
- Professional forms
- Elegant modal windows
- Toast notifications
- Loading skeletons
- Empty states
- Error states

ANIMATIONS:
- Smooth transitions
- Subtle hover interactions
- Sidebar animations
- Progress animations
- Lesson completion feedback
- Respect prefers-reduced-motion

Do not overuse gradients, glassmorphism, glowing effects, or excessive animation.

The result must feel sophisticated and intentional.

---

# 4. MAIN APPLICATION PAGES

Build the following pages:

## A. Landing Page

Create a premium marketing homepage.

Include:
- Navigation
- Hero section
- Strong headline
- Supporting description
- Primary CTA: Start Learning
- Secondary CTA: Explore Courses
- Featured courses
- Learning process section
- Platform features
- Student progress showcase
- Testimonials using clearly labeled sample content
- Pricing section prepared for future monetization
- Footer

The homepage should communicate trust, quality, and educational value.

## B. Authentication

Create:
- Sign up
- Login
- Logout
- Password recovery
- Protected student pages

Use Supabase Authentication when configured.

Never expose private API keys or service-role credentials in frontend code.

## C. Student Dashboard

Display:
- Welcome message
- Current learning streak
- Total XP
- Courses in progress
- Completed lessons
- Overall progress
- Recent activity
- Recommended next lesson
- Achievements

All progress must come from actual saved data, not fake hardcoded values.

## D. Course Catalogue

Display:
- Available courses
- Course descriptions
- Difficulty levels
- Estimated completion time
- Number of modules
- Student progress
- Search and filtering

## E. Course Learning Page

Use a professional learning layout.

LEFT SIDEBAR:
- Course title
- Module list
- Chapter list
- Lesson list
- Completion indicators
- Collapsible sections

MAIN CONTENT:
- Lesson title
- Lesson description
- Rich educational content
- Code examples
- Interactive examples
- Previous and Next navigation
- Lesson completion status

The sidebar must preserve the student's current location.

## F. Lesson Page

Create a flexible lesson renderer supporting:
- Headings
- Paragraphs
- Lists
- Code blocks
- Inline code
- Tables
- Callouts
- Examples
- Images
- Interactive quizzes
- Practice exercises

Use structured content rather than hardcoding every lesson page.

---

# 5. INTERACTIVE WORKSHOP ENGINE — THE MOST IMPORTANT FEATURE

This is the heart of CodePath.

Build an advanced workshop engine inspired by the step-based learning experience of freeCodeCamp.

Example workshop:

"Build an Email Simulator with Python"

The workshop must teach students how to build a real Python project progressively.

The project should include concepts such as:
- Classes
- Objects
- Constructors
- Instance attributes
- Methods
- Object composition
- Lists
- Encapsulation
- Special methods
- Validation
- Error handling

## WORKSHOP INTERFACE

Create a professional three-panel learning workspace.

LEFT PANEL — INSTRUCTIONS:
- Current step number
- Step title
- Clear instructions
- Educational explanation
- Hints
- Previous step
- Next step
- Workshop progress

CENTER PANEL — CODE EDITOR:
- CodeMirror 6
- Python syntax highlighting
- Line numbers
- Editable code
- Multiple file support
- Auto indentation
- Reset functionality
- Keyboard shortcuts

BOTTOM PANEL — OUTPUT AND TESTS:
- Console output
- Runtime errors
- Test results
- Execution status
- Passed / failed indicators

Allow panels to resize where practical.

On smaller screens, use a responsive tabbed interface.

## STEP ENGINE

Each workshop consists of sequential steps.

Every step must contain:

- Unique ID
- Step number
- Title
- Instructions
- Explanation
- Starter code
- Expected behavior
- Test definitions
- Hints
- Completion requirements

Example:

Workshop: Build an Email Simulator

Step 1:
Create the Email class.

Step 2:
Add the constructor.

Step 3:
Store sender information.

Step 4:
Store receiver information.

Step 5:
Add the subject and body.

Step 6:
Add the read attribute.

Continue progressively through the complete project.

The actual workshop should have enough steps to teach the complete project properly.

## SEED CODE CONTINUITY

This is a critical requirement.

When a student completes one step:
- Preserve their code.
- Load the next step's instructions.
- Provide the appropriate next-step starter code.
- Preserve all previously completed functionality.
- Highlight the code area relevant to the current task.
- Never accidentally overwrite student work.

Support editable regions inside starter code.

## AUTOMATED TESTING ENGINE

Tests must evaluate actual Python behavior.

Examples:
- Does the required class exist?
- Does the constructor accept the correct parameters?
- Does the attribute contain the correct value?
- Does the method return the expected result?
- Does the function behave correctly with edge cases?

Support both:
1. Behavioral tests.
2. Structural checks when a step explicitly requires a particular construct.

Use meaningful error messages.

Example:

TEST FAILED

Expected:
The read attribute should initially be False.

Actual:
The read attribute was not initialized correctly.

Give students useful feedback explaining what requirement they need to revisit.

Do not simply display "Wrong answer."

Allow unlimited attempts unless a course explicitly defines otherwise.

## STEP VALIDATION

A student must not be marked as having completed a step just because they clicked Next.

A step is completed only after its required tests pass.

Provide:
- Run Code
- Run Tests
- Submit Solution
- Reset Code
- Get Hint
- Next Step

Persist completed steps.

---

# 6. PYTHON PLAYGROUND

Build a dedicated Python playground.

Features:
- Code editor
- Run button
- Output terminal
- Clear output
- Reset code
- Multiple execution attempts
- Python syntax highlighting
- Error reporting

Use Pyodide.

Execute Python code in a Web Worker rather than blocking the main UI thread.

Implement:
- Execution timeout
- Output capture
- Runtime error capture
- Worker lifecycle management
- Safe communication between UI and worker

Do not use eval() or Function() to execute arbitrary JavaScript.

Do not claim that browser execution is a fully secure sandbox. Clearly separate execution from privileged application functionality.

---

# 7. COURSE CONTENT ARCHITECTURE

Create a reusable curriculum structure:

Course
  -> Module
      -> Chapter
          -> Lesson
          -> Workshop
          -> Quiz
          -> Challenge

Create the first Python course:

PYTHON FUNDAMENTALS

Module 1: Programming Fundamentals
- What is programming?
- What is Python?
- Python interpreter
- Interactive mode
- Script mode
- Variables
- Data types
- Arithmetic
- Strings
- Input and output

Module 2: Control Flow
- Boolean values
- Comparisons
- Conditional statements
- For loops
- While loops
- Break and continue

Module 3: Data Structures
- Lists
- Tuples
- Dictionaries
- Sets
- Slicing
- Iteration
- List comprehensions

Module 4: Functions
- Defining functions
- Parameters
- Arguments
- Return values
- Scope
- Lambda functions

Module 5: Object-Oriented Programming
- Classes
- Objects
- Constructors
- Attributes
- Methods
- Encapsulation
- Inheritance
- Polymorphism
- Special methods

Module 6: Practical Workshops
- PIN Extractor
- Medical Data Validator
- Musical Instrument Inventory
- Email Simulator
- Salary Tracker
- Media Catalogue

Each lesson must have original educational content, examples, exercises, and learning objectives.

Do not create fake course completion statistics.

---

# 8. DATABASE ARCHITECTURE

Design a scalable PostgreSQL schema.

Include tables for:

- profiles
- courses
- modules
- chapters
- lessons
- workshops
- workshop_steps
- challenges
- challenge_tests
- enrollments
- lesson_progress
- workshop_progress
- step_submissions
- achievements
- user_achievements

Use:
- UUID primary keys
- Foreign keys
- Timestamps
- Appropriate indexes
- Unique constraints
- Row Level Security

Students must only be able to modify their own progress and submissions.

Course content should be readable according to publication status.

Create SQL migrations and explain how to configure Supabase.

Do not invent credentials.

---

# 9. ADMIN DASHBOARD

Create an admin area for managing educational content.

Administrators should be able to:
- Create courses
- Create modules
- Create chapters
- Create lessons
- Create workshops
- Add workshop steps
- Edit instructions
- Configure starter code
- Add test definitions
- Add hints
- Publish or unpublish content
- Reorder lessons and steps

Use proper role-based authorization.

Do not rely on frontend-only role checks.

---

# 10. STUDENT ENGAGEMENT

Implement:

- XP points
- Learning streaks
- Achievement badges
- Course completion certificates (prepared for later)
- Learning progress
- Challenge history
- Completion animations

Avoid manipulative gamification.

Reward genuine learning activity, not simply clicking buttons.

---

# 11. RESPONSIVE DESIGN AND ACCESSIBILITY

The platform must work beautifully on:

- Desktop
- Laptop
- Tablet
- Mobile

Requirements:
- Mobile navigation
- Responsive lesson layouts
- Responsive editor panels
- Keyboard navigation
- Accessible buttons
- Proper labels
- Focus indicators
- Color contrast
- Screen reader support
- Reduced motion support

Aim for WCAG 2.2 AA accessibility.

---

# 12. CODE QUALITY AND ARCHITECTURE

Keep the application maintainable.

Requirements:
- Modular JavaScript
- Reusable components
- Separation of concerns
- Centralized configuration
- Consistent naming conventions
- Error handling
- Input validation
- No duplicated application logic
- No unnecessary dependencies

Create a clear folder structure.

Separate:
- UI components
- Services
- Authentication
- Database access
- Workshop engine
- Python runtime
- Curriculum data
- Utilities
- Styles

Use ES modules.

Do not place the entire application in one giant JavaScript file.

---

# 13. TESTING AND QUALITY ASSURANCE

Create tests for:

- Authentication
- Navigation
- Course loading
- Lesson rendering
- Workshop navigation
- Code persistence
- Python execution
- Test evaluation
- Progress tracking
- Database permissions

Test empty states, loading states, errors, invalid inputs, and edge cases.

Use appropriate automated testing tools.

Fix console errors and broken navigation.

Do not claim features are complete if they have not been implemented and tested.

---

# 14. IMPLEMENTATION STRATEGY

Do not attempt to generate the entire application as one unstructured code dump.

Work in phases.

PHASE 1:
- Inspect the existing VS Code workspace.
- Understand the existing files.
- Establish the architecture.
- Create the design system.
- Build the landing page.
- Build the course catalogue.
- Build the learning interface.

PHASE 2:
- Implement the curriculum data model.
- Build lesson rendering.
- Build chapter navigation.
- Implement quizzes.

PHASE 3:
- Build the CodeMirror editor.
- Integrate Pyodide.
- Implement the Python execution worker.
- Build the output panel.

PHASE 4:
- Implement the workshop engine.
- Implement step navigation.
- Implement starter code continuity.
- Implement automated Python tests.
- Implement hints and feedback.
- Build the Email Simulator workshop.

PHASE 5:
- Integrate Supabase.
- Implement authentication.
- Save student progress.
- Implement student dashboard.

PHASE 6:
- Build the admin dashboard.
- Add achievements.
- Improve mobile experience.
- Add accessibility refinements.

PHASE 7:
- Run tests.
- Fix bugs.
- Optimize performance.
- Prepare production deployment.

After each phase:
1. Explain what was implemented.
2. List the files created or modified.
3. Run available checks.
4. Fix errors before proceeding.
5. Identify what remains incomplete.

Do not overwrite existing user files without inspecting them first.

Do not delete working code unnecessarily.

Do not use fake buttons or placeholder interactions in completed features.

If a third-party service requires credentials, create a clear setup guide and an environment variable template.

If the project is too large for one session, prioritize a fully working vertical slice before expanding the platform.

---

# 15. FINAL QUALITY STANDARD

The final platform must feel like a professional commercial product.

Evaluate it against these criteria:

- Is the design visually exceptional?
- Is the learning experience intuitive?
- Can a student complete an entire workshop?
- Does the Python code actually execute?
- Do automated tests evaluate actual behavior?
- Is student progress persisted?
- Does the platform work on mobile?
- Is the architecture maintainable?
- Are errors handled properly?
- Is the application accessible?

Do not prioritize visual appearance at the expense of working functionality.

Do not prioritize quantity of features at the expense of quality.

The goal is to create a real, scalable, interactive programming education platform.

Start by inspecting the current workspace, then implement Phase 1.

Make sensible engineering decisions independently. Ask questions only when an important decision cannot safely be made from the available project context.

**Build CodePath as if it were a serious commercial product preparing for its first public launch.**