Defines a structured workflow for transforming ideas into actionable implementation plans

# Idea to Implementation Plan

This document defines a workflow for transforming vague ideas into a clear implementation plan by iteratively refining a single Markdown document.

## Core Principles

- **Iterative Refinement**: Progress through stages, updating one section at a time.
- **User Collaboration**: Each stage requires explicit user review and confirmation before proceeding.
- **Structured Output**: All work is captured in a single, well-structured Markdown file.

## Markdown File Structure

Manage a single `.md` file with these H2 headings:

- `## Idea`: The initial concept.
- `## Requirements`: Functional and non-functional requirements with acceptance criteria.
- `## Tasks`: A detailed, actionable breakdown of the work.
- `## Design`: High-level technical design and component structure.
- `## Test Cases`: Scenarios to verify the implementation.
- `## Next Steps`: Summary of immediate actions.

## Workflow Stages

### 1. Idea → Requirements

- **Goal**: Translate the initial idea into clear, verifiable requirements.
- **Process**:
  1.  Capture the user's idea in the `## Idea` section.
  2.  Ask clarifying questions to resolve ambiguities.
  3.  Draft specific requirements with Given-When-Then acceptance criteria under `## Requirements`.
  4.  Request user review and confirmation.

### 2. Requirements → Tasks

- **Goal**: Break down requirements into a granular, actionable task list.
- **Process**:
  1.  Analyze the approved requirements.
  2.  Decompose them into tasks under the `## Tasks` section, following these principles:
      - **MECE**: Tasks must be Mutually Exclusive and Collectively Exhaustive.
      - **Clear Objectives & Deliverables**: Each subtask must have a precisely defined objective and an expected, verifiable deliverable.
      - **Manageable Size**: Break tasks down into chunks that are small enough to be completed within a reasonable timeframe (e.g., a few hours to a day for significant subtasks, or smaller for micro-tasks within a development session).
      - **Prioritization**: Consider business value (address high-value items earlier), dependencies and logical order (implement foundational tasks before those that depend on them), and risk (tackle high-risk or uncertain tasks earlier to uncover potential issues sooner).
      - **Independence**: Aim for subtasks that can be worked on and tested independently to allow for parallel work or focused effort.
      - **Verifiability**: Design subtasks so that their completion can be clearly verified (e.g., through specific tests, demonstrations, or a checklist of criteria).
  3.  Request user review and confirmation.

### 3. Tasks → Design

- **Goal**: Create a technical design specification.
- **Process**:
  1.  Analyze the approved tasks.
  2.  Propose a design under the `## Design` section, including classes, methods, and relationships (Mermaid diagrams are encouraged).
  3.  Ensure the design considers existing architecture and quality standards.
  4.  Request user review and confirmation.
- **Reference**: [quality-standards.md](./quality-standards.md)

### 4. Design → Test Cases

- **Goal**: Define a comprehensive set of test cases.
- **Process**:
  1.  Analyze the approved design.
  2.  Define test cases (positive, negative, edge) under `## Test Cases`.
  3.  Ensure complete coverage for the requirements.
  4.  Add implementation recommendations to `## Next Steps`.
  5.  Request user review and confirmation.
- **Reference**: [testing-guidelines.md](./testing-guidelines.md)
