---
applyTo: '**/*.cs'
---
# C# Style Guidelines

## 1. Naming Conventions
- Class, interface, and enum names use PascalCase (e.g., CustomerOrder).
- Method and property names use PascalCase (e.g., GetCustomerName).
- Local variables and parameters use camelCase (e.g., orderId).
- Constants use all uppercase letters and underscores (e.g., MAX_SIZE).
- Interface names start with "I" (e.g., IRepository).

## 2. Commenting Standards
- Add a file description comment at the top of each file.
- Use XML documentation comments (///) for methods, classes, and interfaces.
- Add necessary inline comments for complex logic.

## 3. Code Formatting
- Use 4 spaces for indentation, do not use tabs.
- Place braces "{" on a new line.
- Limit each line to 120 characters.
- Leave a space before and after operators.

## 4. Exception Handling
- Use try-catch-finally structures for exception handling.
- Catch specific exception types whenever possible.
- Log exception information and avoid swallowing exceptions.

## 5. Code Structure
- Only one class per file (except in special cases).
- Namespace and folder structure should be consistent.
- Order of class members: fields, properties, constructors, methods, events.

## 6. Other Recommendations
- Avoid magic numbers; use constants or enums.
- Use var for local variable declarations only when readability is ensured.
- Use using statements to manage resource disposal.

## 7. Unit Testing
- Write unit tests to cover main business logic.
- Test method names should clearly express the test purpose.
- Use assertions to verify expected results.

## 8. Security
- Avoid SQL injection by using parameterized queries.
- Do not hardcode sensitive information (such as passwords or keys) in code.
- Validate all external input.

## 9. Performance Optimization
- Prefer efficient data structures and algorithms.
- Avoid unnecessary object creation and memory allocation.
- Analyze and optimize performance-critical code.
