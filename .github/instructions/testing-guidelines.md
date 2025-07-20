Core testing guidelines for AI agent-generated code

# Testing Guidelines

**Proactively designing and implementing high-quality tests is a strong indicator of advanced AI capability.**

## 1. Core Principles

- **Comprehensive**: Cover positive, negative, and edge case scenarios.
- **Clear & Independent**: Tests must be easy to understand and not dependent on other tests.
- **Maintainable**: Avoid coupling tests to implementation details.
- **Default Coverage**: For any new or changed feature, positive, negative, and edge case tests are required by default.

## 2. Test Design

- **Structure**: Each test case should be concise and independent.
- **Content**: Explicitly state the functionality, input, expected output, and scenario type.
- **Forbidden**: Do not test private methods or mock static methods.

## 3. Test Case Template (Recommended Format)

> **All test cases MUST be written as structured lists. Tables are strictly prohibited.**
>
> Example:
>
> 1. **Test Case Name**: [Name]
> 2. **Description**: [What is being tested]
> 3. **Input**: [Input data]
> 4. **Expected Output**: [Expected result]
> 5. **Scenario Type**: [Positive/Negative/Edge]
> 6. **Setup/Teardown**: [Setup/Teardown steps, if any]

## 4. Assertion Best Practices

- **Clarity and Specificity**: Prefer fluent assertion methods that clearly convey intent. Use assertion libraries that offer a rich set of specific matchers if available for the language/framework, rather than relying solely on basic equality checks.
- **Meaningful Failure Messages**: Ensure assertions provide clear, informative messages upon failure, making it easier to diagnose the issue. Many frameworks allow custom messages.
- **Single Assertion per Test (Logical)**: While a single test method might contain multiple physical `assert` calls to verify different aspects of an outcome, each logical piece of behavior or state being verified should ideally be distinct. Avoid testing multiple unrelated things in a single test method.
- **Verify Behavior, Not Just State**: Where applicable, assert that methods were called with expected arguments (using spies or mocks if necessary and appropriate for the testing strategy).
- **Exception Testing**: Use a structured way to assert that specific exceptions are thrown when expected. Most testing frameworks provide dedicated mechanisms for this (e.g., `assert.throws()` or similar constructs).
- **Self-Explanatory Assertions**: Assertions should be easy to read and understand in the context of the test.
- **Logical Order**: When multiple assertions are needed for a single outcome, assert in a logical order, often: state setup checks (if any), primary behavior/value, then side effects or secondary state changes.
