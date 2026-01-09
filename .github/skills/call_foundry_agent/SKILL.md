---
name: call-foundry-agent
description: Call Foundry agent with a prompt and get the response.
---

# Call Azure Foundry Agent

Send a prompt to an Azure Foundry Agent and retrieve the response.

### Parameters

- Required: `prompt` (The input text to send to the agent)
- Optional: 
    - `--agent-name` (The name of the agent to call. Defaults to `AZURE_AI_AGENT_NAME` env var)
    - `--endpoint` (The Azure AI Project Endpoint. Defaults to `AZURE_AI_PROJECT_ENDPOINT` env var)

### Example

```bash
.venv/Scripts/python .claude/skills/call_foundry_agent/scripts/call_foundry.py "search the latest news in 2026"
```
