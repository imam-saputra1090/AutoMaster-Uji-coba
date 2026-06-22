with open('js/app.js', 'r', encoding='utf-8') as f:
    content = f.read()

idx = 7565
print(f"Char at {idx}: '{content[idx]}'")
print(f"Context: {content[idx-50:idx+50]}")
# Find line number
line_no = content[:idx].count('\n') + 1
print(f"Line number: {line_no}")
