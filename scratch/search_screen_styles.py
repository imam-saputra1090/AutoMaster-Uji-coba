with open("css/style.css", "r", encoding="utf-8") as f:
    lines = f.readlines()

output_lines = []

for i, line in enumerate(lines):
    if "screen" in line.lower() or "vr" in line.lower():
        context = lines[max(0, i-2):min(len(lines), i+8)]
        context_str = "".join(context).lower()
        if "max-width" in context_str or "margin" in context_str or "width" in context_str or "padding" in context_str:
            output_lines.append(f"Line {i+1}: {''.join(lines[i:i+1]).strip()}")
            output_lines.append("Context:")
            for j, cl in enumerate(context):
                output_lines.append(f"  {max(0, i-2)+j+1}: {cl.strip()}")
            output_lines.append("-" * 40)

with open("C:\\Users\\MyBook Hype\\.gemini\\antigravity\\brain\\87d7785b-c86a-4f40-842f-1ac1b5ef2f03\\scratch\\screen_styles.txt", "w", encoding="utf-8") as out:
    out.write("\n".join(output_lines))
