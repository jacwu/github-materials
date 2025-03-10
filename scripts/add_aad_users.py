import msal
import requests

def get_access_token(client_id, client_secret, tenant_id):
    authority = f"https://login.microsoftonline.com/{tenant_id}"
    app = msal.ConfidentialClientApplication(client_id, authority=authority, client_credential=client_secret)
    scope = ["https://graph.microsoft.com/.default"]
    result = app.acquire_token_for_client(scopes=scope)
    return result['access_token']

# add_user function to create a new user in Azure AD
# headers: The headers containing the access token for the request.
# user_data: the user data which is used to describe the new user.
# based on https://learn.microsoft.com/en-us/graph/api/user-post-users?view=graph-rest-1.0&tabs=http User.ReadWrite.All, Directory.ReadWrite.All is required to get the token
def add_user(headers, user_data):
    response = requests.post('https://graph.microsoft.com/v1.0/users', headers=headers, json=user_data)

    if response.status_code == 201:
        print("User created successfully.")
    else:
        print(f"Error: {response.status_code}")
        print(response.json())

# access_token: The access token for the request.
# user_list: The list of users to add.
# password_list: The list of passwords for the user.
def add_users(access_token, user_list, password_list):
    headers = {
        'Authorization': 'Bearer ' + access_token,
        'Content-Type': 'application/json'
    }

    for user, password in zip(user_list, password_list):
        # user's format is like aaa@bbb.onmicrosoft.com
        username = user.split('@')[0]
        user_data = {
            "accountEnabled": True,
            "displayName": username,
            "mailNickname": username,
            "userPrincipalName": user,
            "passwordProfile": {
                "forceChangePasswordNextSignIn": False,
                "password": password
            }
        }
        add_user(headers, user_data)

# function to create a group in Azure AD
# access_token: The access token for the request.
# group_name: The name of the group to create.
# based on https://learn.microsoft.com/en-us/graph/api/group-post-groups?view=graph-rest-1.0&tabs=http , Group.ReadWrite.All is required to get the token
def add_group(access_token, group_name):
    headers = {
        'Authorization': 'Bearer ' + access_token,
        'Content-Type': 'application/json'
    }

    group_data = {
        "displayName": group_name,
        "mailEnabled": False,
        "mailNickname": group_name,
        "securityEnabled": True
    }

    response = requests.post('https://graph.microsoft.com/v1.0/groups', headers=headers, json=group_data)

    if response.status_code == 201:
        print("Group created successfully.")
    else:
        print(f"Error: {response.status_code}")
        print(response.json())

# read user list from file
# each line is a user and password pair separated by tab key
def read_user_list():
    with open('users.txt', 'r') as f:
        lines = f.read().splitlines()
    
    # userlist is the first part of each line before tab key
    userlist = [line.split('\t')[0] for line in lines]
    return userlist

# read password list from file
# each line is a user and password pair separated by tab key
def read_password_list():
    with open('users.txt', 'r') as f:
        lines = f.read().splitlines()
    
    # passwordlist is the second part of each line after tab key
    passwordlist = [line.split('\t')[1] for line in lines]
    return passwordlist

# Example usage
CLIENT_ID = '<client_id>'
CLIENT_SECRET = '<client_secret>'
TENANT_ID = '<tenant_id>'



users = read_user_list()
passwords = read_password_list()
access_token = get_access_token(CLIENT_ID, CLIENT_SECRET, TENANT_ID)
add_users(access_token, users, passwords)