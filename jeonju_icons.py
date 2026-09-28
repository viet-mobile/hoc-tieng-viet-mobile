# -*- coding: utf-8 -*-
"""JEONJU home-screen icons, made from the Vietnamese sites' own logo (assets/hoc-tieng-viet-logo.png, 1254x1254,
rounded square with transparent corners). The design is not redrawn -- only resized and placed:

  icon-192.png / icon-512.png        purpose "any": the logo itself, transparent corners kept.
  icon-maskable-192/512.png          purpose "maskable": the logo at 80% on the manifest background colour, so the
                                     text, hat, lotus and boat stay inside the maskable safe zone (the centre
                                     circle, 80% of the icon) and a launcher mask never shows transparency.
  icon-180.png                       apple-touch-icon: iOS fills transparency with black, so the logo is placed
                                     on the same opaque background (full size; iOS rounds the corners itself).

Run `python jeonju_icons.py` after changing the logo; assemble_app.py copies brand/jeonju/ into dist/jeonju/brand/.
"""
from pathlib import Path

from PIL import Image

from site_profiles import PWA_ICON_FILES as FILES

SOURCE = Path("assets/hoc-tieng-viet-logo.png")
OUT = Path("brand/jeonju")
BACKGROUND = "#F1F4EC"      # manifest.webmanifest background_color of the Vietnamese sites
MASKABLE_SCALE = 0.8


def _resized(logo, size):
    return logo.resize((size, size), Image.LANCZOS)


def _on_background(logo, size, scale):
    canvas = Image.new("RGBA", (size, size), BACKGROUND)
    inner = round(size * scale)
    offset = (size - inner) // 2
    canvas.alpha_composite(_resized(logo, inner), (offset, offset))
    return canvas.convert("RGB")


def build():
    logo = Image.open(SOURCE).convert("RGBA")
    OUT.mkdir(parents=True, exist_ok=True)
    images = {
        "any192": _resized(logo, 192),
        "any512": _resized(logo, 512),
        "maskable192": _on_background(logo, 192, MASKABLE_SCALE),
        "maskable512": _on_background(logo, 512, MASKABLE_SCALE),
        "apple": _on_background(logo, 180, 1.0),
    }
    for key, image in images.items():
        image.save(OUT / FILES[key], optimize=True)
    return {FILES[k]: v.size for k, v in images.items()}


if __name__ == "__main__":
    print(build())
