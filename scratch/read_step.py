import json
import sys

# Set output encoding to UTF-8
sys.stdout.reconfigure(encoding='utf-8')

# We can search in transcript.jsonl first, then transcript_full.jsonl if truncated
with open(r"C:\Users\MyBook Hype\.gemini\antigravity\brain\87d7785b-c86a-4f40-842f-1ac1b5ef2f03\.system_generated\logs\transcript_full.jsonl", "r", encoding="utf-8") as f:
    for line in f:
        obj = json.loads(line)
        if obj.get('step_index') == 2486:
            print("=== Step 2486 content ===")
            print(obj.get('content'))
            print("=========================")
            break
