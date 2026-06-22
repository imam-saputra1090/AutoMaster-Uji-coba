with open("css/style.css", "r", encoding="utf-8") as f:
    lines = f.readlines()

for i, line in enumerate(lines):
    if "max-width" in line.lower() and i < 500: # check first 500 lines for global layout rules
        print(f"Line {i+1}: {line.strip()}")
