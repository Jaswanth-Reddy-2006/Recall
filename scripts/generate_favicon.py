import os
import numpy as np
from PIL import Image, ImageDraw

def cubic_bezier(p0, p1, p2, p3, n=150):
    t = np.linspace(0, 1, n).reshape(-1, 1)
    return (1 - t)**3 * p0 + 3 * (1 - t)**2 * t * p1 + 3 * (1 - t) * t**2 * p2 + t**3 * p3

def hex_to_rgb(hex_str):
    hex_str = hex_str.lstrip('#')
    return tuple(int(hex_str[i:i+2], 16) for i in (0, 2, 4))

def get_gradient_color(t):
    # t from 0 to 1
    # 0.0: #E6007A (230, 0, 122)
    # 0.48: #8B5CF6 (139, 92, 246)
    # 1.0: #3B5BDB (59, 91, 219)
    c1 = np.array([230, 0, 122])
    c2 = np.array([139, 92, 246])
    c3 = np.array([59, 91, 219])
    
    if t <= 0.48:
        factor = t / 0.48
        color = (1 - factor) * c1 + factor * c2
    else:
        factor = (t - 0.48) / 0.52
        color = (1 - factor) * c2 + factor * c3
    return tuple(int(c) for c in color)

def generate_recall_icon(size=512):
    # Canvas
    img = Image.new("RGBA", (size, size), (0, 0, 0, 0))
    draw = ImageDraw.Draw(img)
    
    # Original SVG coordinates in 46x30:
    # d="M13.5 6C8.8 6 5 9.8 5 14.5C5 19.2 8.8 23 13.5 23C19 23 23 14.5 23 14.5C23 14.5 27 6 32.5 6C37.2 6 41 9.8 41 14.5C41 19.2 37.2 23 32.5 23C27 23 23 14.5 23 14.5C23 14.5 19 6 13.5 6Z"
    
    segments = [
        # Segment 1
        (np.array([13.5, 6]), np.array([8.8, 6]), np.array([5, 9.8]), np.array([5, 14.5])),
        # Segment 2
        (np.array([5, 14.5]), np.array([5, 19.2]), np.array([8.8, 23]), np.array([13.5, 23])),
        # Segment 3
        (np.array([13.5, 23]), np.array([19, 23]), np.array([23, 14.5]), np.array([23, 14.5])),
        # Segment 4
        (np.array([23, 14.5]), np.array([27, 6]), np.array([32.5, 6]), np.array([32.5, 6])), # wait: 23, 14.5 -> 27, 6 -> 32.5, 6 is: C 27 6, 32.5 6
        # Let's check original SVG:
        # M13.5 6
        # C 8.8 6, 5 9.8, 5 14.5
        # C 5 19.2, 8.8 23, 13.5 23
        # C 19 23, 23 14.5, 23 14.5
        # C 23 14.5, 27 6, 32.5 6
        # C 37.2 6, 41 9.8, 41 14.5
        # C 41 19.2, 37.2 23, 32.5 23
        # C 27 23, 23 14.5, 23 14.5
        # C 23 14.5, 19 6, 13.5 6 Z
    ]
    
    seg_points = [
        cubic_bezier(np.array([13.5, 6]), np.array([8.8, 6]), np.array([5, 9.8]), np.array([5, 14.5])),
        cubic_bezier(np.array([5, 14.5]), np.array([5, 19.2]), np.array([8.8, 23]), np.array([13.5, 23])),
        cubic_bezier(np.array([13.5, 23]), np.array([19, 23]), np.array([21, 19]), np.array([23, 14.5])),
        cubic_bezier(np.array([23, 14.5]), np.array([25, 10]), np.array([27, 6]), np.array([32.5, 6])),
        cubic_bezier(np.array([32.5, 6]), np.array([37.2, 6]), np.array([41, 9.8]), np.array([41, 14.5])),
        cubic_bezier(np.array([41, 14.5]), np.array([41, 19.2]), np.array([37.2, 23]), np.array([32.5, 23])),
        cubic_bezier(np.array([32.5, 23]), np.array([27, 23]), np.array([25, 19]), np.array([23, 14.5])),
        cubic_bezier(np.array([23, 14.5]), np.array([21, 10]), np.array([19, 6]), np.array([13.5, 6])),
    ]
    
    all_pts = np.vstack(seg_points)
    
    # Scale & Center onto (size, size)
    # The symbol spans roughly x: [3, 43], y: [4, 25] -> width ~40, height ~21
    # We want it to occupy ~85% of width with aspect ratio preserved
    min_x, max_x = 4.0, 42.0
    min_y, max_y = 5.0, 24.0
    
    orig_w = max_x - min_x
    orig_h = max_y - min_y
    
    target_w = size * 0.88
    scale = target_w / orig_w
    
    scaled_h = orig_h * scale
    offset_x = (size - target_w) / 2 - min_x * scale
    offset_y = (size - scaled_h) / 2 - min_y * scale
    
    transformed_pts = all_pts * scale + np.array([offset_x, offset_y])
    
    stroke_radius = int(size * 0.065) # ~33px radius on 512x512
    
    # Draw colored circles along the path with gradient interpolation
    for pt in transformed_pts:
        x, y = pt[0], pt[1]
        # x fraction from 0 to 1
        t = np.clip((x - (offset_x + min_x * scale)) / target_w, 0.0, 1.0)
        color = get_gradient_color(t) + (255,)
        draw.ellipse([x - stroke_radius, y - stroke_radius, x + stroke_radius, y + stroke_radius], fill=color)
        
    return img

if __name__ == "__main__":
    icon_512 = generate_recall_icon(512)
    
    # Target paths
    public_dir = os.path.join(os.getcwd(), "recall-web", "public")
    app_dir = os.path.join(os.getcwd(), "recall-web", "app")
    
    # Save 512x512 PNG
    icon_512.save(os.path.join(public_dir, "icon.png"), "PNG")
    icon_512.save(os.path.join(app_dir, "icon.png"), "PNG")
    icon_512.save(os.path.join(public_dir, "apple-touch-icon.png"), "PNG")
    
    # Save multi-size ICO (16, 32, 48, 64)
    ico_sizes = [(16, 16), (32, 32), (48, 48), (64, 64)]
    ico_images = [icon_512.resize(s, Image.Resampling.LANCZOS) for s in ico_sizes]
    
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
    
    print("Favicon files generated successfully in public and app directories!")
