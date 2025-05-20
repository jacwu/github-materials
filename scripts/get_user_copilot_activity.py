import requests
from typing import Any, Dict

"""
    Query GitHub Copilot activity for a user in an organization.
    Args:
        org: GitHub organization name
        username: GitHub username
        token: Personal access token with required scopes: OAuth app tokens and personal access tokens (classic) need either the manage_billing:copilot or read:org scopes to use this endpoint.
    Returns:
        JSON response as a dictionary
"""
def get_copilot_activity(org: str, username: str, token: str) -> Dict[str, Any]:

    url = f"https://api.github.com/orgs/{org}/members/{username}/copilot"
    headers = {
        "Accept": "application/vnd.github+json",
        "Authorization": f"Bearer {token}",
        "X-GitHub-Api-Version": "2022-11-28"
    }
    response = requests.get(url, headers=headers)
    response.raise_for_status()
    return response.json()

if __name__ == "__main__":
    # Example usage:
    # Replace 'ORG', 'USERNAME', 'YOUR-TOKEN' with actual values
    org = 'ORG'
    username = 'USERNAME'
    token = 'YOUR-TOKEN'
    data = get_copilot_activity(org, username, token)
    print("last_activity_at:", data.get("last_activity_at"))
    print("last_activity_editor:", data.get("last_activity_editor"))