from pathlib import Path
from PIL import Image, ImageDraw, ImageFont

social = Path(__file__).resolve().parents[1] / "assets" / "social"
url = "saaniya-software.nasneeraj.com"
email = "saaniyasoftware@nasneeraj.com"

# file, band_top_frac, font_size_frac, color, url_y_frac, email_y_frac
jobs = [
    ("ig-post-brand.png", 0.86, 0.024, (30, 58, 138), 0.90, 0.95),
    ("ig-story-security.png", 0.88, 0.024, (30, 58, 138), 0.915, 0.96),
    ("fb-cover-saaniya.png", 0.86, 0.024, (30, 58, 138), 0.905, 0.955),
    # taller band to cover leftover mid-line URL from generation
    ("ig-post-guruvidyazen.png", 0.78, 0.022, (76, 29, 149), 0.86, 0.92),
    ("ig-post-sislms.png", 0.88, 0.022, (76, 29, 149), 0.915, 0.96),
    ("ig-post-riyaz.png", 0.88, 0.022, (76, 29, 149), 0.915, 0.96),
    ("ig-post-coplanner.png", 0.88, 0.020, (30, 58, 138), 0.915, 0.96),
    ("ig-post-fleet.png", 0.88, 0.020, (30, 58, 138), 0.915, 0.96),
    ("ig-post-astrology.png", 0.88, 0.020, (212, 175, 55), 0.915, 0.96),
]

font_candidates = [
    r"C:\Windows\Fonts\segoeui.ttf",
    r"C:\Windows\Fonts\arial.ttf",
    r"C:\Windows\Fonts\calibri.ttf",
]


def load_font(size: int) -> ImageFont.ImageFont:
    for path in font_candidates:
        try:
            return ImageFont.truetype(path, size)
        except OSError:
            continue
    return ImageFont.load_default()


def centered_text(draw: ImageDraw.ImageDraw, text: str, y: int, w: int, font, color) -> None:
    bbox = draw.textbbox((0, 0), text, font=font)
    tw = bbox[2] - bbox[0]
    th = bbox[3] - bbox[1]
    x = (w - tw) // 2
    draw.text((x, y - th // 2), text, fill=color, font=font)


def main() -> None:
    for name, band_top, size_frac, color, url_y, email_y in jobs:
        path = social / name
        im = Image.open(path).convert("RGB")
        w, h = im.size
        # sample near bottom for band fill
        sample = im.getpixel((w // 2, min(h - 2, int(h * 0.93))))
        draw = ImageDraw.Draw(im)
        top = int(h * band_top)
        draw.rectangle([0, top, w, h], fill=sample)
        font = load_font(max(14, int(h * size_frac)))
        # for GVZ, restore attribution line above contact
        if name == "ig-post-guruvidyazen.png":
            byline = "by Saaniya Software LLC"
            by_font = load_font(max(14, int(h * 0.024)))
            centered_text(draw, byline, int(h * 0.82), w, by_font, color)
        centered_text(draw, url, int(h * url_y), w, font, color)
        centered_text(draw, email, int(h * email_y), w, font, color)
        im.save(path, optimize=True)
        print(f"fixed {name} ({w}x{h})")


if __name__ == "__main__":
    main()
