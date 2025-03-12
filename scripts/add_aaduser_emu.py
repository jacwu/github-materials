import requests
import json
import msal


def get_access_token(client_id, client_secret, tenant_id):
    authority = f"https://login.microsoftonline.com/{tenant_id}"
    app = msal.ConfidentialClientApplication(client_id, authority=authority, client_credential=client_secret)
    scope = ["https://graph.microsoft.com/.default"]
    result = app.acquire_token_for_client(scopes=scope)
    return result['access_token']

def get_app_role_assignments(access_token, user_id):
    url = f'https://graph.microsoft.com/v1.0/users/{user_id}/appRoleAssignments'
    headers = {
        'Authorization': f'Bearer {access_token}',
        'Content-Type': 'application/json'
    }

    response = requests.get(url, headers=headers)

    if response.status_code == 200:
        app_role_assignments = response.json()
        print(json.dumps(app_role_assignments, indent=2))
    else:
        print(f'Error: {response.status_code}\n{response.text}')


# based on https://learn.microsoft.com/en-us/graph/api/user-post-approleassignments?view=graph-rest-1.0&tabs=http , AppRoleAssignment.ReadWrite.All is required
def post_app_role_assignments(access_token, user_id, app_role_id, resource_id):
    url = f'https://graph.microsoft.com/v1.0/users/{user_id}/appRoleAssignments'
    headers = {
    'Authorization': f'Bearer {access_token}',
    'Content-Type': 'application/json'
    }
    body = {
        "principalId": user_id,
        "resourceId": resource_id,
        "appRoleId": app_role_id
    }

    response = requests.post(url, headers=headers, json=body)
    if response.status_code == 201:
        print('App role assignment created successfully.')
    else:
        print(f'Error: {response.status_code}\n{response.text}')

def get_user_principalId(access_token, user_id):
    url = f'https://graph.microsoft.com/v1.0/users/{user_id}'
    headers = {
        'Authorization': f'Bearer {access_token}',
        'Content-Type': 'application/json'
    }

    response = requests.get(url, headers=headers)
    return response.json()['id']


# Example usage:
client_id = '<client_id>'
client_secret = '<client_secret>'
tenant_id = '<tenant_id>'
# user_id example: sample@dummy.onmicrosoft.com

# get resource_id and app_role_id from Azure AD
# resource_id is the id of the application in Azure AD
# app_role_id is the id of the role in Azure AD
# click a user which has been added to the emu
# overview -> applications -> GitHub Enterprise Managed User (OIDC) -> click the app
# resource_id: Service principal ID
# app_role_id: Role ID
resource_id = '<resource_id>'
app_role_id = '<app_role_id>'

access_token = get_access_token(client_id, client_secret, tenant_id)

# read user list from file
# each line is a user and password pair separated by tab key
def read_user_list():
    with open('users.txt', 'r') as f:
        lines = f.read().splitlines()
    
    # userlist is the first part of each line before tab key
    userlist = [line.split('\t')[0] for line in lines]
    return userlist

userlist = read_user_list()

for user in userlist:
    print(user.strip())
    user_principalId =  get_user_principalId(access_token, user.strip())
    post_app_role_assignments(access_token, user_principalId, app_role_id, resource_id)