---
applyTo: '**/*.py'
---
# Python Style Guidelines

## Naming Conventions

- **Variables and Functions**: Use lowercase with underscores (`snake_case`)
- **Classes**: Use CamelCase (start with capital letter)
- **Constants**: Use uppercase with underscores
- **Private Methods/Variables**: Prefix with a single underscore
- **"Private" Class Members**: Prefix with double underscore (triggers name mangling)

## Code Layout

- Use 4 spaces per indentation level (no tabs)
- Limit lines to 79 characters (code) or 72 characters (comments/docstrings)
- Surround top-level functions and classes with two blank lines
- Use blank lines sparingly inside functions to indicate logical sections

## Documentation

- Write docstrings for all public modules, functions, classes, and methods
- Use triple double quotes (`"""`) for docstrings
- For one-line docstrings, keep the closing quotes on the same line
- For multi-line docstrings, put the closing quotes on a separate line

## Imports

- Imports should be on separate lines
- Imports are grouped in the following order:
  1. Standard library imports
  2. Related third-party imports
  3. Local application/library specific imports
- Use absolute imports when possible

## Error Handling

- Use specific exceptions instead of generic ones
- Use context managers (`with` statement) for resource management
- Avoid catching all exceptions with bare `except:`

## Testing

- Write unit tests for all functionality
- Use pytest for testing when possible
- Name test files with `test_` prefix
- Name test functions with `test_` prefix

## Tools

- Use type hints for function parameters and return values
- Use linters like flake8 or pylint
- Format code with black or yapf
- Use mypy for static type checking

## Best Practices

- Follow the DRY (Don't Repeat Yourself) principle
- Use list/dict/set comprehensions when appropriate
- Prefer f-strings for string formatting in Python 3.6+
- Use context managers for file operations
- Avoid global variables and side effects