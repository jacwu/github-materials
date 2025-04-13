import requests

def add_user_to_team(username, token, org, team):
    url = f"https://api.github.com/orgs/{org}/teams/{team}/memberships/{username}"
    headers = {
        "Accept": "application/vnd.github+json",
        "Authorization": f"Bearer {token}",
        "X-GitHub-Api-Version": "2022-11-28"
    }
    data = {
        "role": "member"
    }

    response = requests.put(url, headers=headers, json=data)
    print(response.json())  
    return response.status_code, response.json()

def add_user_to_organization(username, token, org):
    url = f"https://api.github.com/orgs/{org}/memberships/{username}"
    headers = {
        "Accept": "application/vnd.github+json",
        "Authorization": f"Bearer {token}",
        "X-GitHub-Api-Version": "2022-11-28"
    }
    data = {
        "role": "member"
    }

    response = requests.put(url, headers=headers, json=data)
    return response.status_code, response.json()

# function add team to organization
def add_team_to_organization(token, org, team):
    url = f"https://api.github.com/orgs/{org}/teams"
    headers = {
        "Accept": "application/vnd.github+json",
        "Authorization": f"Bearer {token}",
        "X-GitHub-Api-Version": "2022-11-28"
    }
    data = {
        "name": team,
        "description": "team description here",
        "permission": "pull",
        "notification_setting": "notifications_disabled",
        "privacy": "closed"
    } 
    response_json = requests.post(url, headers=headers, json=data)
    print(response_json)



token = "<token>"
org = "<org-slug>"
team = "<team-name>"
file_path = "<file-path>"


# a function to read txt line by line
# each line is a github handle
# then call add_user_to_organization for each github handle
def add_users_from_file(filename, token, org):
    with open(filename, 'r') as file:
        for line in file:
            username = line.strip()
            status_code, response = add_user_to_organization(username, token, org)
            print(f"Added {username} to {org}: {status_code} - {response}")

add_users_from_file(file_path, token, org)
