import os
from PIL import Image
import numpy as np

src_path = r"C:/Users/Jaswanth Reddy/.gemini/antigravity/brain/fbe2a72f-a10a-40f9-abe8-2ac351ef1b43/.user_uploaded/media_1790016011249.png"

# Load image
img = Image.open(src_path).convert("RGBA")
arr = np.array(img, dtype=np.float32)
rgb = arr[:, :, :3]
dist = np.sqrt(np.sum((255.0 - rgb)**2, axis=2))

# Alpha extraction with smooth anti-aliased edge
alpha = np.clip((dist - 12) / 35.0, 0.0, 1.0) * 255.0
a_norm = np.clip(alpha / 255.0, 0.001, 1.0)[:, :, np.newaxis]
rgb_clean = np.clip((rgb - (1.0 - a_norm) * 255.0) / a_norm, 0.0, 255.0)

arr_out = np.dstack((rgb_clean, alpha)).astype(np.uint8)
transparent_logo = Image.fromarray(arr_out, "RGBA")

# Crop bounding box of non-transparent pixels
bbox = transparent_logo.getbbox()
if bbox:
    cropped_logo = transparent_logo.crop(bbox)
else:
    cropped_logo = transparent_logo

public_dir = os.path.join(os.getcwd(), "recall-web", "public")
app_dir = os.path.join(os.getcwd(), "recall-web", "app")

# Save direct cropped transparent logo
cropped_logo.save(os.path.join(public_dir, "logo.png"))
cropped_logo.save(os.path.join(public_dir, "logo-transparent.png"))

# Create square canvas for favicons (512x512)
def make_square_icon(size=512, bg_type="transparent"):
    if bg_type == "transparent":
        canvas = Image.new("RGBA", (size, size), (0, 0, 0, 0))
    elif bg_type == "white_card":
        canvas = Image.new("RGBA", (size, size), (0, 0, 0, 0))
        # Draw rounded white rectangle
        from PIL import ImageDraw
        draw = ImageDraw.Draw(canvas)
        margin = int(size * 0.04)
        radius = int(size * 0.22)
        draw.rounded_rectangle([margin, margin, size - margin, size - margin], radius=radius, fill=(255, 255, 255, 255))
    
    # Scale cropped logo to fit inside with comfortable padding
    # Logo is wider than tall (ratio ~ 70:38)
    cw, ch = cropped_logo.size
    target_w = int(size * 0.88)
    target_h = int(ch * (target_w / cw))
    
    if target_h > int(size * 0.88):
        target_h = int(size * 0.88)
        target_w = int(cw * (target_h / ch))
        
    scaled = cropped_logo.resize((target_w, target_h), Image.Resampling.LANCZOS)
    pos = ((size - target_w) // 2, (size - target_h) // 2)
    canvas.paste(scaled, pos, scaled)
    return canvas

icon_transparent_512 = make_square_icon(512, "transparent")
icon_white_card_512 = make_square_icon(512, "white_card")

# Save 512x512 PNGs
icon_transparent_512.save(os.path.join(public_dir, "icon.png"))
icon_transparent_512.save(os.path.join(app_dir, "icon.png"))
icon_white_card_512.save(os.path.join(public_dir, "apple-touch-icon.png"))
icon_white_card_512.save(os.path.join(public_dir, "icon-card.png"))

# Generate multi-size ICO (16, 32, 48, 64)
# For the browser tab favicon, we provide the crisp transparent logo
ico_sizes = [(16, 16), (32, 32), (48, 48), (64, 64)]
ico_images = [icon_transparent_512.resize(s, Image.Resampling.LANCZOS) for s in ico_sizes]

ico_images[0].save(
    os.path.join(public_dir, "favicon.ico"),
    format="ICO",
    sizes=ico_sizes,
    append_images=ico_images[1:]
)

ico_images[0].save(
    os.path.join(app_dir, "favicon.ico"),
    format="ICO",
    sizes=ico_sizes,
    append_images=ico_images[1:]
)

print("Processed user logo successfully into all favicon and icon formats!")
