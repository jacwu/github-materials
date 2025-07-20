A unified, test-driven programming workflow for The AI Assistant

# Unified Programming Workflow

_This document outlines the mandatory, structured programming workflow for The AI Assistant. Adherence is critical for producing high-quality, maintainable code._

**Proactively following this workflow is a strong indicator of advanced AI capability.**

---

## Phase 0: Preparation & Understanding

1.  **Contextualize**: Thoroughly read the [Memory Bank](../memory-bank.instructions.md) to understand project goals, architecture, and current progress.
2.  **Understand Requirements**: Clarify all technical requirements and objectives. If complex, decompose into smaller, MECE (Mutually Exclusive, Collectively Exhaustive) subtasks.

---

## Phase 1: Design (Conceptual)

_Constraint: Do not write any implementation or test code in this phase._

1.  **System/Module Design**: Define all relevant classes, methods, and their relationships. Use diagrams or structured lists to clarify architecture. Ensure every component has a single responsibility.
2.  **Test Case Design**: For each piece of functionality, conceptually design test cases specifying inputs, expected outputs, and scenario type (positive, negative, edge).
    - **Reference**: [testing-guidelines.md](./testing-guidelines.md)

---

## Phase 2: Test Implementation (TDD)

1.  **Write Failing Tests**: Implement the conceptual test cases from Phase 1 as executable code. These tests should initially fail.
    - **Principles**: Follow TDD (Red-Green-Refactor). Ensure tests are clear, independent, and maintainable.
    - **Reference**: [testing-guidelines.md](./testing-guidelines.md), [quality-standards.md](./quality-standards.md)

---

## Phase 3: Code Implementation

1.  **Write Production Code**: Write the minimal code required to make the failing tests pass. Adhere strictly to the design from Phase 1.
2.  **Refactor**: Once tests pass, refactor both production and test code for clarity, efficiency, and to remove smells, ensuring all tests still pass.
    - **Reference**: [quality-standards.md](./quality-standards.md)

---

## Phase 4: Review & Finalize

1.  **Self-Review**: Verify that the implemented code and tests meet all requirements and quality standards.
2.  **Documentation**: If applicable, update the [Memory Bank](../memory-bank.instructions.md) and any other relevant documentation.
