import argparse
import requests
import json
import sys
import datetime
import os
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

def send_teams_notification(webhook_url, title, message, color="0076D7"):
    headers = {'Content-Type': 'application/json'}
    current_time = datetime.datetime.now().strftime("%Y-%m-%d %H:%M:%S")
    
    # MessageCard format
    payload = {
        "@type": "MessageCard",
        "@context": "http://schema.org/extensions",
        "themeColor": color,
        "summary": title,
        "sections": [{
            "activityTitle": title,
            "activitySubtitle": "Notification from GitHub Copilot",
            "activityImage": "https://upload.wikimedia.org/wikipedia/commons/thumb/c/c3/Python-logo-notext.svg/1200px-Python-logo-notext.svg.png",
            "facts": [
                {"name": "Environment:", "value": "GitHub Copilot in VSCode"},
                {"name": "Time:", "value": current_time}
            ],
            "markdown": True,
            "text": message
        }]
    }

    try:
        response = requests.post(
            webhook_url, 
            data=json.dumps(payload), 
            headers=headers,
            timeout=10
        )
        
        if response.status_code == 200 and response.text == '1':
            print("Successfully sent Teams notification.")
        else:
            print(f"Failed to send notification. Status: {response.status_code}, Response: {response.text}", file=sys.stderr)
            sys.exit(1)
            
    except requests.exceptions.MissingSchema:
        print("Error: Invalid URL format. Check if it starts with http:// or https://", file=sys.stderr)
        sys.exit(1)
    except Exception as e:
        print(f"Error sending notification: {str(e)}", file=sys.stderr)
        sys.exit(1)

def main():
    parser = argparse.ArgumentParser(description="Send a notification to Microsoft Teams via Webhook.")
    parser.add_argument("--webhook-url", help="The Teams Webhook URL. Defaults to TEAMS_WEBHOOK_URL or WEBHOOK_URL environment variable.", default=os.environ.get("TEAMS_WEBHOOK_URL"))
    parser.add_argument("--title", help="Notification title", default="Notification")
    parser.add_argument("--message", help="Notification message (markdown supported)", required=True)
    parser.add_argument("--color", help="Theme color (hex)", default="0076D7")
    
    args = parser.parse_args()
    
    if not args.webhook_url:
        print("Error: Webhook URL is required. Provide --webhook-url or set TEAMS_WEBHOOK_URL env var.", file=sys.stderr)
        sys.exit(1)
        
    send_teams_notification(args.webhook_url, args.title, args.message, args.color)

if __name__ == "__main__":
    main()
