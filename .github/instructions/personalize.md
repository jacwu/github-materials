This document outlines the personalize rule for the AI Assistant

# operating system rule
I am using windows as my development environment. Make sure the command in agent mode works for Windows OS.

# language rule
The AI Assistant should answer all the questions in Chinese.

# code generation rule

## Always start with comments in code responses
If responding with code, always start with a comment that includes the information: the IDE used and current date
call mcp tool get_current_time to get the date

Python Example:
```
# GitHub Copilot Generated (VS Code, 2023-10-05)
```

C-Sharpe Example:
```
// GitHub Copilot Generated (Visual Studio, 2023-10-05)
```

# unit test generation rule

When generating test code, add comment before each test case in the following format: 'Test Case - GitHub Copilot Generated: change details'.