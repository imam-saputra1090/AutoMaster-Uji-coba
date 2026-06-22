with open("css/style.css", "r", encoding="utf-8") as f:
    lines = f.readlines()

output_lines = []
for i, line in enumerate(lines):
    if ".banner-slide" in line.lower() or ".ranking-banner-container" in line.lower():
        # print the block (find the closing brace)
        block = []
        for j in range(max(0, i-2), min(len(lines), i+15)):
            block.append(f"  {j+1}: {lines[j].strip()}")
        output_lines.append(f"Line {i+1}:")
        output_lines.extend(block)
        output_lines.append("-" * 45)

with open("C:/Users/MyBook Hype/.gemini/antigravity/brain/87d7785b-c86a-4f40-842f-1ac1b5ef2f03/scratch/banner_slide_blocks.txt", "w", encoding="utf-8") as out:
    out.write("\n".join(output_lines))

print("Done")
