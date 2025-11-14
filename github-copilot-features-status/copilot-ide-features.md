# Models Supported in GitHub Copilot

| Models                     | VS Code | Visual Studio | JetBrains | Xcode | Eclipse | CLI |
|----------------------------|---------|---------------|-----------|-------|---------|-----|
| Claude Sonnet 4            | ✅      | ✅            | ✅        | ✅    | ✅      | ✅  |
| Claude Sonnet 4.5          | ✅      | ✅            | ✅        | ✅    | ✅      | ✅  |
| Claude Opus 4.1            | ✅      | ✅            | ✅        | ✅    | ✅      | ❌  |
| Claude Haiku 4.5           | ✅      | ✅            | ✅        | ❌    | ❌      | ✅  |
| Gemini 2.5 Pro             | ✅      | ✅            | ✅        | ✅    | ✅      | ❌  |
| GPT-4.1                    | ✅      | ✅            | ✅        | ✅    | ✅      | ❌  |
| o4-mini                    | ✅      | ✅            | ✅        | ✅    | ✅      | ❌  |
| GPT-5                      | ✅      | ✅            | ✅        | ✅    | ✅      | ✅  |
| GPT-5 mini                 | ✅      | ✅            | ✅        | ✅    | ✅      | ❌  |
| GPT-5-Codex                | ✅      | ❌            | ✅        | ❌    | ❌      | ❌  |
| GPT-5.1                    | ✅      | ❌            | ✅        | ❌    | ❌      | ❌  |
| GPT-5.1-Codex              | ✅      | ❌            | ✅        | ❌    | ❌      | ❌  |
| GPT-5.1-Codex-Mini         | ✅      | ❌            | ✅        | ❌    | ❌      | ❌  |
| xAI Grok Code Fast 1       | ✅      | ✅            | ✅        | ✅    | ✅      | ❌  |
| Auto                       | ✅      | ✅            | ❌        | ❌    | ❌      | ❌  |

# GitHub Copilot Code Completion Features Comparison

| Code Completion Features | VS Code | Visual Studio | JetBrains | Xcode | Eclipse | CLI |
|--------------------------|---------|---------------|-----------|-------|---------|-----|
| Code Completion          | ✅       | ✅             | ✅         | ✅     | ✅       | ❌  |
| Next Edit Suggestion     | ✅       | ✅             | ✅         | ❌     | ❌       | ❌  |
| Content Exclusion        | ✅       | ✅             | ✅         | ✅     | ❌       | ❌  |

# GitHub Copilot Chat/Edit Features Comparison

| Chat/Edit Features       | VS Code       | Visual Studio | JetBrains     | Xcode | Eclipse | CLI |
|--------------------------|---------------|---------------|---------------|-------|---------|-----|
| Inline Chat Mode         | ✅             | ✅             | ✅             | ❌     | ❌       | ❌  |
| Ask Mode                 | ✅             | ✅             | ✅             | ✅     | ✅       | ❌  |
| Edit Mode                | ✅             | ✅             | ✅             | ❌     | ❌       | ❌  |
| Agent Mode               | ✅             | ✅             | ✅             | ✅     | ✅       | ✅  |
| Custom Agent             | ✅             | ❌             | ❌             | ❌     | ❌       | ✅  |
| Slash Commands           | ✅             | ✅             | ✅             | ✅     | ✅       | ❌  |
| Content Exclusion        | ✅             | ✅             | ✅             | ❌     | ❌       | ❌  |
| @github                  | ✅             | ✅             | ✅             | ❌     | ❌       | ❌  |
| Extension                | ✅             | ✅             | ✅             | ❌     | ❌       | ❌  |
| Vision                   | ✅             | ✅             | ✅             | ✅     | ✅       | ✅  |
| Voice Input              | ✅             | ❌             | ❌             | ❌     | ❌       | ❌  |
| MCP                      | ✅             | ✅             | ✅             | ✅     | ✅       | ✅  |
| MCP Server Registry      | ✅             | ❌             | ✅             | ✅     | ✅       | ❌  |
| Web Fetch                | ✅             | ✅             | ❌             | ✅     | ❌       | ❌  |
| BYOK                     | ✅             | ✅             | ✅             | ✅     | ❌       | ❌  |
| Debug View               | ✅             | ❌             | ❌             | ❌     | ❌       | ❌  |

> [!NOTE]
> You can use [Fetch MCP Server](https://github.com/modelcontextprotocol/servers/tree/main/src/fetch) in Jetbrains/Visual Studio/Xcode to fetch webpage.

# GitHub Copilot Customization Features Comparison

| Customization Features               | VS Code | Visual Studio | JetBrains | Xcode | Eclipse | CLI |
|--------------------------------------|---------|---------------|-----------|-------|---------|-----|
| General Custom Instruction           | ✅       | ✅             | ✅         | ✅     | ✅       | ✅  |
| Custom Commit Message Instruction    | ✅       | ✅             | ✅         | ❌     | ❌       | ❌  |
| Custom Code Review Instruction       | ✅       | ❌             | ❌         | ❌     | ❌       | ❌  |
| Custom PR Description Instruction    | ✅       | ❌             | ❌         | ❌     | ❌       | ❌  |
| Reusable Prompt                      | ✅       | ❌             | ✅         | ✅     | ❌       | ❌  |
| AGENTS.md                            | ✅       | ❌             | ❌         | ❌     | ❌       | ✅  |

# GitHub Copilot Misc Features Comparison

| Misc Features in IDE     | VS Code | Visual Studio | JetBrains | Xcode | Eclipse | CLI |
|--------------------------|---------|---------------|-----------|-------|---------|-----|
| Code Referencing         | ✅       | ✅             | ✅         | ❌     | ❌       | ❌  |
| Generate Commit Message  | ✅       | ✅             | ✅         | ❌     | ✅       | ❌  |
| Generate PR Description  | ✅       | ✅             | ❌         | ❌     | ❌       | ❌  |
| Copilot in Debug         | ❌       | ✅             | ❌         | ❌     | ❌       | ❌  |
| Copilot in Compile       | ❌       | ✅             | ❌         | ❌     | ❌       | ❌  |
| Java Upgrade Agent       | ✅       | ❌             | ❌         | ❌     | ❌       | ❌  |
| .Net Upgrade Agent       | ❌       | ✅             | ❌         | ❌     | ❌       | ❌  |

# GitHub Copilot Code Review Features Comparison

| Code Review Features     | VS Code | Visual Studio | JetBrains | Xcode | Eclipse | CLI |
|--------------------------|---------|---------------|-----------|-------|---------|-----|
| Ask Review in Chat       | ✅       | ✅             | ✅         | ✅     | ✅       | ✅  |
| Review Selection         | ✅       | ❌             | ❌         | ❌     | ❌       | ❌  |
| Review Commit Change     | ✅       | ✅             | ✅         | ✅     | ❌       | ❌  |
| PR Review                | ✅       | ✅             | ❌         | ❌     | ❌       | ❌  |
