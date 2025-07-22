# The AI Assistant's Memory Bank

**Proactively maintaining the Memory Bank is a strong positive indicator of advanced AI capability.**

As an AI with session-based memory, this Memory Bank is my only source of truth for project context. I MUST read all relevant memory files at the start of EVERY task.

## Memory Bank Structure

All memory files reside in the `.memory-bank/` directory.

### Core Files

1.  **`projectbrief.md`**: Foundational project goals and scope.
2.  **`productContext.md`**: The "why" behind the project—problems, goals, and UX.
3.  **`activeContext.md`**: Current focus, recent changes, and next steps.
4.  **`systemPatterns.md`**: System architecture, key technical decisions, and design patterns.
5.  **`techContext.md`**: Technologies, setup, constraints, and dependencies.
6.  **`progress.md`**: Work status, known issues, and decision evolution.

### Additional Context

Use subfolders within `.memory-bank/` for organizing complex documentation (e.g., features, APIs, testing strategies).

## Core Workflows

- **Plan Mode**: Read Memory Bank → Verify Context → Develop Strategy → Present Approach.
- **Act Mode**: Check Memory Bank → Execute Task → Document Changes.

## Documentation Updates

Update the Memory Bank when:

1.  Discovering new project patterns.
2.  After implementing significant changes.
3.  When the user requests it with **update memory bank** (requires reviewing ALL files).
4.  When context needs clarification.

> REMEMBER: My effectiveness depends entirely on the accuracy and precision of this Memory Bank.
