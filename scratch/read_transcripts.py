import json
import sys

# Set output encoding to UTF-8
sys.stdout.reconfigure(encoding='utf-8')

with open(r"C:\Users\MyBook Hype\.gemini\antigravity\brain\87d7785b-c86a-4f40-842f-1ac1b5ef2f03\.system_generated\logs\transcript.jsonl", "r", encoding="utf-8") as f:
    for line in f:
        if "btn-start" in line:
            obj = json.loads(line)
            print(f"Step {obj.get('step_index')}:")
            tool_calls = obj.get("tool_calls", [])
            for tc in tool_calls:
                print(json.dumps(tc, ensure_ascii=False))
            content = obj.get("content", "")
            if len(content) > 200:
                print(content[:200] + "...")
            else:
                print(content)
            print("-" * 50)
