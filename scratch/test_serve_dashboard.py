import sys
import traceback

sys.path.append(r"c:\Users\MyBook Hype\OneDrive\Documents\AGEN INFODESK 234\GIM")

from local_server import LocalServerHandler

# Mock handler class
class MockHandler(LocalServerHandler):
    def __init__(self):
        self.wfile = MockWfile()
        self.headers = {}
        
    def send_response(self, code, message=None):
        print(f"send_response: {code}")
        
    def send_header(self, keyword, value):
        print(f"send_header: {keyword}: {value}")
        
    def end_headers(self):
        print("end_headers")

class MockWfile:
    def write(self, data):
        print(f"MockWfile write: {len(data)} bytes")

try:
    print("Creating mock handler and calling serve_dashboard...")
    handler = MockHandler()
    handler.serve_dashboard()
    print("serve_dashboard executed successfully without errors!")
except Exception as e:
    print("Error during serve_dashboard execution:")
    traceback.print_exc()
