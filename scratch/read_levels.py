import re

with open(r"c:\Users\MyBook Hype\OneDrive\Documents\AGEN INFODESK 234\GIM\js\data.js", "r", encoding="utf-8") as f:
    content = f.read()

# Let's find levels (e.g. level 1, 2, 3...)
# Typically stored as a constant like const GAME_LEVELS = [...] or levels: [...]
print("--- GAME LEVELS IN DATA.JS ---")
for line in content.split("\n"):
    if "subtitle:" in line or "title:" in line:
        if "title:" in line and ("Rem" in line or "Mesin" in line or "Kelistrikan" in line or "Alat" in line or "Transmisi" in line or "Chassis" in line):
            print(line.strip())
