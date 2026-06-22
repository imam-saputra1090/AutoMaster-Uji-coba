from PIL import Image

try:
    img = Image.open("assets/workshop.jpg")
    print(f"Image format: {img.format}, size: {img.size}")
    
    # Check pixels at corners and edges
    # Left edge
    left_pixels = [img.getpixel((0, y)) for y in range(0, img.height, img.height // 10)]
    # Right edge
    right_pixels = [img.getpixel((img.width - 1, y)) for y in range(0, img.height, img.height // 10)]
    # Center pixel
    center_pixel = img.getpixel((img.width // 2, img.height // 2))
    
    print(f"Some left edge pixels: {left_pixels[:5]}")
    print(f"Some right edge pixels: {right_pixels[:5]}")
    print(f"Center pixel: {center_pixel}")
except Exception as e:
    print(f"Error: {e}")
