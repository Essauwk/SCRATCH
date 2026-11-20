from PIL import Image, ImageDraw, ImageFont
import os

os.makedirs('images', exist_ok=True)

def create_banknote(amount, color_bg, color_border, color_accent, output_path):
    width = 600
    height = 320
    img = Image.new('RGB', (width, height), color_bg)
    draw = ImageDraw.Draw(img)

    # Outer ornate borders
    draw.rectangle([10, 10, width-10, height-10], outline=color_border, width=4)
    draw.rectangle([18, 18, width-18, height-18], outline=color_accent, width=2)

    # Decorative inner corner boxes
    box_size = 35
    for (x, y) in [(25, 25), (width-25-box_size, 25), (25, height-25-box_size), (width-25-box_size, height-25-box_size)]:
        draw.rectangle([x, y, x+box_size, y+box_size], outline=color_accent, width=2)

    # Header
    draw.text((width//2, 55), "مسابقة بطل العالمية إكسبريس", fill='#FFFFFF', anchor="mm")
    draw.text((width//2, 90), "★ كارت مكافأة نقدية فورية ★", fill=color_accent, anchor="mm")

    # Center Big Amount Box
    draw.rounded_rectangle([120, 120, width-120, 225], radius=20, fill='#111827', outline=color_accent, width=3)
    draw.text((width//2, 160), f"{amount} جـنـيـه", fill='#FBBF24', anchor="mm")
    draw.text((width//2, 198), "مكافأة كاش فورية معتمدة 💵", fill='#34D399', anchor="mm")

    # Footer note
    draw.text((width//2, 255), "تُصرف مباشرة عبر فودافون كاش أو انستاباي InstaPay", fill='#E5E7EB', anchor="mm")
    draw.text((width//2, 285), "العالمية إكسبريس - بطل الأبطال", fill=color_border, anchor="mm")

    img.save(output_path, 'PNG')
    print(f"Created {output_path}")

# 100 EGP - Violet/Emerald banknote theme
create_banknote("100", (26, 46, 53), (52, 211, 153), (251, 191, 36), "images/prize_100.png")

# 200 EGP - Luxury Gold/Bronze banknote theme
create_banknote("200", (45, 30, 20), (245, 158, 11), (252, 211, 77), "images/prize_200.png")
