with open("css/style.css", "r", encoding="utf-8") as f:
    lines = f.readlines()

output_lines = []
for i, line in enumerate(lines):
    if "max-width" in line.lower():
        output_lines.append(f"Line {i+1}: {line.strip()}")

with open("C:/Users/MyBook Hype/.gemini/antigravity/brain/87d7785b-c86a-4f40-842f-1ac1b5ef2f03/scratch/max_width_rules.txt", "w", encoding="utf-8") as out:
    out.write("\n".join(output_lines))

print(f"Found {len(output_lines)} max-width rules")
