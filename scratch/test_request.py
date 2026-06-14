import urllib.request
import urllib.error

url = "http://localhost:8000/dashboard"
print(f"Making request to {url}...")
try:
    with urllib.request.urlopen(url) as response:
        html = response.read()
        print(f"Response code: {response.status}")
        print(f"Response length: {len(html)} bytes")
        print(html[:500].decode('utf-8'))
except urllib.error.URLError as e:
    print(f"URLError: {e}")
except Exception as e:
    print(f"Exception: {e}")
