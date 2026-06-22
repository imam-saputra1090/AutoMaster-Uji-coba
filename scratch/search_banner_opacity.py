with open("css/style.css", "r", encoding="utf-8") as f:
    lines = f.readlines()

for i, line in enumerate(lines):
    if "banner-slide" in line.lower() and ("opacity" in line.lower() or "display" in line.lower() or "active" in line.lower()):
        print(f"Line {i+1}: {line.strip()}")
        # print context
        for j in range(max(0, i-2), min(len(lines), i+5)):
            print(f"  {j+1}: {lines[j].strip()}")
        print("-" * 40)
