import urllib.request
import json

url = "http://localhost:5000/api/analyze"
data = {
    "script": "Hello world test script",
    "niche": "Tech",
    "duration": "1-5 min"
}
params = json.dumps(data).encode('utf8')
req = urllib.request.Request(url, data=params, headers={'content-type': 'application/json'})

try:
    with urllib.request.urlopen(req) as response:
        status_code = response.getcode()
        res_body = response.read().decode('utf8')
        print(f"Status Code: {status_code}")
        print(f"Response: {res_body}")
except Exception as e:
    print(f"Error: {e}")
