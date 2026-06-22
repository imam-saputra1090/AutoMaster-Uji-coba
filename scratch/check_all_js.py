import os
import sys
sys.stdout.reconfigure(encoding='utf-8')

def check_brackets(filepath):
    try:
        with open(filepath, 'r', encoding='utf-8') as f:
            content = f.read()
    except Exception as e:
        print(f"Error reading file {filepath}: {e}")
        return False

    stack = []
    in_string = False
    string_char = None
    in_comment = False
    in_multiline_comment = False
    
    i = 0
    length = len(content)
    
    while i < length:
        char = content[i]
        
        if in_multiline_comment:
            if char == '*' and i + 1 < length and content[i+1] == '/':
                in_multiline_comment = False
                i += 2
                continue
            i += 1
            continue
            
        if in_comment:
            if char == '\n':
                in_comment = False
            i += 1
            continue
            
        if in_string:
            if char == '\\':
                i += 2
                continue
            if char == string_char:
                in_string = False
                string_char = None
            i += 1
            continue
            
        if char == '/' and i + 1 < length:
            if content[i+1] == '/':
                in_comment = True
                i += 2
                continue
            elif content[i+1] == '*':
                in_multiline_comment = True
                i += 2
                continue
                
        if char in ["'", '"', '`']:
            in_string = True
            string_char = char
            i += 1
            continue
            
        if char in ['(', '{', '[']:
            stack.append((char, i))
        elif char in [')', '}', ']']:
            if not stack:
                print(f"[{filepath}] Extra closing bracket '{char}' at character index {i}")
                line_no = content[:i].count('\n') + 1
                print(f"Around line {line_no}: ...{content[max(0, i-40):i]}>>> {char} <<< {content[i+1:min(length, i+40)]}...")
                return False
            open_char, open_idx = stack.pop()
            if (char == ')' and open_char != '(') or \
               (char == '}' and open_char != '{') or \
               (char == ']' and open_char != '['):
                print(f"[{filepath}] Mismatched brackets: opened '{open_char}' at {open_idx}, closed with '{char}' at {i}")
                line_no = content[:i].count('\n') + 1
                print(f"Around line {line_no}: ...{content[max(0, i-40):i]}>>> {char} <<< {content[i+1:min(length, i+40)]}...")
                return False
        i += 1
        
    if stack:
        print(f"[{filepath}] Unclosed brackets left: {len(stack)}")
        for open_char, open_idx in stack[:5]:
            line_no = content[:open_idx].count('\n') + 1
            print(f"Unclosed '{open_char}' opened at index {open_idx} (around line {line_no})")
        return False
        
    if in_string:
        print(f"[{filepath}] Unclosed string of type '{string_char}'")
        return False
        
    return True

js_dir = "js"
for file in os.listdir(js_dir):
    if file.endswith(".js"):
        filepath = os.path.join(js_dir, file)
        res = check_brackets(filepath)
        if not res:
            print(f"❌ SYNTAX ERROR FOUND IN: {filepath}")
        else:
            print(f"✅ {filepath} is OK")
