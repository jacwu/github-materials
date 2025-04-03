import requests
import json

subscription_key = "<key>"
search_term = "car"
search_url = "https://api.bing.microsoft.com/v7.0/news/search"

headers = {"Ocp-Apim-Subscription-Key" : subscription_key}
params  = {"q": search_term, "textDecorations": True, "textFormat": "HTML"}

response = requests.get(search_url, headers=headers, params=params)
response.raise_for_status()
search_results = json.dumps(response.json())

print(search_results)