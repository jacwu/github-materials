---
name: teams_notification
description: Send a notification card to Microsoft Teams via Webhook.
---

# Teams Notification

Send a notification card to a Microsoft Teams channel using an Incoming Webhook.

### Parameters

- Required: 
    - `--message` (The message content, supports Markdown)
- Optional:
    - `--webhook-url` (The Teams Webhook URL. Defaults to `TEAMS_WEBHOOK_URL` env var)
    - `--title` (The title of the card. Defaults to "Notification")
    - `--color` (Hex color code for the card stripe. Defaults to "0076D7")

### Example

```bash
.venv/Scripts/python .github/skills/teams_notification/scripts/send_teams_notification.py --message "Hello **World**!" --title "Test Message"
```
