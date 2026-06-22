import re

filepath = "GIM/js/data.js"
with open(filepath, "r", encoding="utf-8") as f:
    code = f.read()

# Define component mappings
# Each entry maps (id, old_image_string) to the new image path
mappings = {
    # Level 1: Rem
    ("brake-pad", "🔲"): "assets/komponen_rem/PAD REM.jpg",
    ("caliper", "🔧"): "assets/komponen_rem/CALIPER.jpg",
    ("rotor-disc", "💿"): "assets/komponen_rem/PIRINGAN CAKRAM.jpg",
    ("master-cylinder", "🔩"): "assets/komponen_rem/MASTER REM.jpg",
    ("brake-booster", "⭕"): "assets/komponen_rem/BOOSTER REM.jpg",
    ("brake-line", "〰️"): "assets/komponen_rem/PIPA SELANG REM.jpg",
    ("wheel-cylinder", "🔘"): "assets/komponen_rem/SILINDER RODA.jpg",
    ("brake-shoe", "👟"): "assets/komponen_rem/SEPATU REM TROMOL.jpg",

    # Level 2: Mesin
    ("piston", "🔵"): "assets/komponen_mesin/PISTON.jpg",
    ("connecting-rod", "📏"): "assets/komponen_mesin/BATANG PENGHUBUNG.jpg",
    ("crankshaft", "⚙️"): "assets/komponen_mesin/POROS ENGKOL.jpg",
    ("camshaft", "🔄"): "assets/komponen_mesin/POROS NOK.jpg",
    ("valve-intake", "🔽"): "assets/komponen_mesin/KATUP MASUK.jpg",
    ("valve-exhaust", "🔼"): "assets/komponen_mesin/KATUP BUANG.jpg",
    ("cylinder-head", "🏗️"): "assets/komponen_mesin/KEPALA SILINDER.jpg",
    ("spark-plug", "⚡"): "assets/komponen_mesin/BUSI.jpg",

    # Level 3: Kelistrikan
    ("battery", "🔋"): "assets/komponen_kelistrikan/BATERAI.jpg",
    ("alternator", "🔌"): "assets/komponen_kelistrikan/ALTERNATOR.jpg",
    ("starter-motor", "🔄"): "assets/komponen_kelistrikan/MOTOR STARTER.jpg",
    ("relay", "🔲"): "assets/komponen_kelistrikan/RELAY.jpg",
    ("fuse", "⚡"): "assets/komponen_kelistrikan/SEKERING.jpg",
    ("body-ground", "➖"): "assets/komponen_kelistrikan/KABEL BODY GROUND.jpg",
    ("ignition-switch", "🔑"): "assets/komponen_kelistrikan/KUNCI KONTAK.jpg",
    ("headlamp", "💡"): "assets/komponen_kelistrikan/LAMPU UTAMA.jpg",

    # Level 5: BBM & Pendingin
    ("fuel-tank", "⛽"): "assets/komponen_bbm_pendingin/TANGKI BAHAN BAKAR.jpg",
    ("fuel-pump", "🔌"): "assets/komponen_bbm_pendingin/POMPA BAHAN BAKAR.jpg",
    ("fuel-filter", "🔲"): "assets/komponen_bbm_pendingin/FILTER BAHAN BAKAR.jpg",
    ("injector", "💉"): "assets/komponen_bbm_pendingin/INJEKTOR.jpg",
    ("radiator", "🌡️"): "assets/komponen_bbm_pendingin/RADIATOR.jpg",
    ("thermostat", "🌡️"): "assets/komponen_bbm_pendingin/THERMOSTAT.jpg",
    ("water-pump", "🔄"): "assets/komponen_bbm_pendingin/POMPA AIR RADIATOR.jpg",
    ("fan-belt", "➰"): "assets/komponen_bbm_pendingin/DRIVE BELT.jpg"
}

# We will use a regex to find each component object block:
# { id: "...", ... image: "..." }
# And if the (id, image) matches our mapping, we replace it.
pattern = r'\{\s*id:\s*"([^"]+)",[^}]+image:\s*"([^"]+)"[^}]*\}'

def replacer(match):
    block = match.group(0)
    comp_id = match.group(1)
    comp_image = match.group(2)
    
    key = (comp_id, comp_image)
    if key in mappings:
        new_path = mappings[key]
        # Replace the image: "..." part
        new_block = re.sub(r'image:\s*"[^"]+"', f'image: "{new_path}"', block)
        print(f"Replaced {comp_id} image with {new_path}")
        return new_block
    return block

updated_code = re.sub(pattern, replacer, code)

with open(filepath, "w", encoding="utf-8") as f:
    f.write(updated_code)

print("Finished updating data.js")
