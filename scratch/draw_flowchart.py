from PIL import Image, ImageDraw, ImageFont
import os

def draw_flowchart():
    # Create image canvas
    width, height = 1100, 380
    img = Image.new("RGB", (width, height), "#0a0f1e")
    draw = ImageDraw.Draw(img)
    
    # Fonts
    try:
        # Try to use standard windows fonts
        font_title = ImageFont.truetype("arialbd.ttf", 16)
        font_text = ImageFont.truetype("arial.ttf", 12)
        font_header = ImageFont.truetype("arialbd.ttf", 11)
    except IOError:
        font_title = ImageFont.load_default()
        font_text = ImageFont.load_default()
        font_header = ImageFont.load_default()

    # Draw border around the entire flowchart
    draw.rectangle([10, 10, width-10, height-10], outline="#00d4ff", width=2)
    
    # Helper to draw glowing box
    def draw_box(x, y, w, h, text, header=None, border_color="#00d4ff", bg_color="#0d1527"):
        # Draw background
        draw.rectangle([x, y, x+w, y+h], fill=bg_color, outline=border_color, width=2)
        # Draw text
        if header:
            draw.text((x + 8, y + 8), header, fill="#ff6b35", font=font_header)
            draw.text((x + 8, y + 26), text, fill="#ffffff", font=font_text)
        else:
            draw.text((x + 12, y + 20), text, fill="#ffffff", font=font_title)

    # Draw Boxes
    draw_box(30, 150, 160, 60, "Landing Page", "STAGE 01")
    draw_box(230, 150, 160, 60, "Registrasi / Login", "STAGE 02")
    draw_box(430, 150, 160, 60, "Dashboard HUD", "STAGE 03")
    
    # Draw vertical stack for Level Hub / 3 Phases
    draw_box(630, 50, 200, 50, "Fase 1: Belajar (SWF)", "LEARNING")
    draw_box(630, 150, 200, 50, "Fase 2: Praktik (Drag-Drop)", "PRACTICE")
    draw_box(630, 250, 200, 50, "Fase 3: Kuis (Anti-Curang)", "EVALUATION")
    
    draw_box(870, 150, 200, 60, "DB LAN & Google Sheets", "SERVER INTEGRATION")

    # Helper to draw arrows
    def draw_arrow(x1, y1, x2, y2, color="#ffc300"):
        draw.line([x1, y1, x2, y2], fill=color, width=2)
        # Arrow head
        if x1 == x2: # Vertical
            if y2 > y1:
                draw.polygon([x2, y2, x2-5, y2-8, x2+5, y2-8], fill=color)
            else:
                draw.polygon([x2, y2, x2-5, y2+8, x2+5, y2+8], fill=color)
        else: # Horizontal
            if x2 > x1:
                draw.polygon([x2, y2, x2-8, y2-5, x2-8, y2+5], fill=color)
            else:
                draw.polygon([x2, y2, x2+8, y2-5, x2+8, y2+5], fill=color)

    # Draw connections
    draw_arrow(190, 180, 230, 180)
    draw_arrow(390, 180, 430, 180)
    
    # Branching arrows from Dashboard to the 3 phases
    draw.line([590, 180, 610, 180], fill="#ffc300", width=2)
    draw.line([610, 75, 610, 275], fill="#ffc300", width=2)
    draw_arrow(610, 75, 630, 75)
    draw_arrow(610, 180, 630, 180)
    draw_arrow(610, 275, 630, 275)

    # Merging arrows from the 3 phases to server sync
    draw.line([830, 75, 850, 75], fill="#ffc300", width=2)
    draw.line([830, 180, 850, 180], fill="#ffc300", width=2)
    draw.line([830, 275, 850, 275], fill="#ffc300", width=2)
    draw.line([850, 75, 850, 275], fill="#ffc300", width=2)
    draw_arrow(850, 180, 870, 180)
    
    # Save image
    output_dir = r"c:\Users\MyBook Hype\OneDrive\Documents\AGEN INFODESK 234\GIM\assets"
    os.makedirs(output_dir, exist_ok=True)
    img.save(os.path.join(output_dir, "flowchart_interaksi.png"))
    print("Flowchart image generated successfully.")

if __name__ == "__main__":
    draw_flowchart()
