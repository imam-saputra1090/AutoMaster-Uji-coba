from PIL import Image

try:
    img = Image.open("assets/workshop.jpg")
    print(f"Dimensions of assets/workshop.jpg: {img.width}x{img.height}")
except Exception as e:
    print(f"Error checking dimensions: {e}")
