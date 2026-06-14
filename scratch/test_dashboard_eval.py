import sys
import traceback

sys.path.append(r"c:\Users\MyBook Hype\OneDrive\Documents\AGEN INFODESK 234\GIM")

try:
    print("Testing importing local_server...")
    import local_server
    print("Successfully imported local_server.")
except Exception as e:
    print("Error during import:")
    traceback.print_exc()
