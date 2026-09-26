# -*- coding: utf-8 -*-
"""Draws the target-language sites' icons (site_profiles.TARGET_BRANDS) into brand/<target>/.

Every mark is built from simple geometric shapes on a 512-unit grid -- no font and no third-party
logo -- so the SVG and the PNGs look the same on every platform and the output is reproducible:

    python brand_icons.py          # rewrite brand/*/ (run after changing TARGET_BRANDS)

One visual system for all targets: a rounded square in the target's colour, the white mark, and a
short underline. The marks stay inside the maskable safe zone (the central 80%).
"""
from pathlib import Path

from PIL import Image, ImageDraw

from site_profiles import TARGET_BRANDS, BRAND_ICON_FILES

ROOT = Path(__file__).resolve().parent
GRID = 512
CORNER = 112
S = 44  # stroke width of the Latin/CJK marks

# Shapes: ("rect", x, y, w, h), ("poly", [(x, y), ...]), ("ring", cx, cy, r_outer, r_inner),
# ("halfring", cx, cy, r_outer, r_inner) -- the right half of a ring (the bowl of "D").
MARKS = {
    "EN": [
        ("rect", 112, 130, S, 220), ("rect", 112, 130, 118, S), ("rect", 112, 218, 104, S), ("rect", 112, 306, 118, S),
        ("rect", 268, 130, S, 220), ("rect", 356, 130, S, 220),
        ("poly", [(268, 130), (318, 130), (400, 350), (350, 350)]),
    ],
    "ID": [
        ("rect", 128, 130, S, 220),
        ("rect", 210, 130, S, 220), ("rect", 210, 130, 84, S), ("rect", 210, 306, 84, S),
        ("halfring", 294, 240, 110, 66),
    ],
    "中": [
        ("rect", 134, 172, 244, S), ("rect", 134, 276, 244, S), ("rect", 134, 172, S, 148), ("rect", 334, 172, S, 148),
        ("rect", 234, 100, S, 290),
    ],
    "日": [
        ("rect", 164, 104, S, 300), ("rect", 304, 104, S, 300),
        ("rect", 164, 104, 184, S), ("rect", 164, 232, 184, S), ("rect", 164, 360, 184, S),
    ],
    "한": [
        ("rect", 150, 100, 64, 34), ("rect", 112, 150, 140, 36), ("ring", 182, 250, 62, 28),
        ("rect", 282, 96, 40, 226), ("rect", 322, 190, 64, 38),
        ("rect", 132, 334, 40, 74), ("rect", 132, 370, 262, 38),
    ],
}
UNDERLINE = ("rect", 206, 438, 100, 18)


def _svg_shape(shape):
    kind = shape[0]
    if kind == "rect":
        _, x, y, w, h = shape
        return '<rect x="%d" y="%d" width="%d" height="%d"/>' % (x, y, w, h)
    if kind == "poly":
        return '<polygon points="%s"/>' % " ".join("%d,%d" % p for p in shape[1])
    _, cx, cy, ro, ri = shape
    if kind == "ring":
        return ('<path fill-rule="evenodd" d="M%d %dA%d %d 0 1 0 %d %dA%d %d 0 1 0 %d %dZM%d %dA%d %d 0 1 0 %d %dA%d %d 0 1 0 %d %dZ"/>'
                % (cx - ro, cy, ro, ro, cx + ro, cy, ro, ro, cx - ro, cy, cx - ri, cy, ri, ri, cx + ri, cy, ri, ri, cx - ri, cy))
    # right half ring: outer arc top->bottom, inner arc bottom->top
    return ('<path d="M%d %dA%d %d 0 0 1 %d %dL%d %dA%d %d 0 0 0 %d %dZ"/>'
            % (cx, cy - ro, ro, ro, cx, cy + ro, cx, cy + ri, ri, ri, cx, cy - ri))


def icon_svg(brand):
    shapes = MARKS[brand["mark"]] + [UNDERLINE]
    return ('<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 %d %d">'
            '<rect width="%d" height="%d" rx="%d" fill="%s"/>'
            '<g fill="#FFFFFF">%s</g></svg>\n'
            % (GRID, GRID, GRID, GRID, CORNER, brand["color"], "".join(_svg_shape(s) for s in shapes)))


def icon_png(brand, size):
    scale = 4  # draw large, then downsample for smooth edges
    big = GRID * scale
    img = Image.new("RGBA", (big, big), (0, 0, 0, 0))
    d = ImageDraw.Draw(img)
    d.rounded_rectangle([0, 0, big - 1, big - 1], radius=CORNER * scale, fill=brand["color"])
    white = (255, 255, 255, 255)
    for shape in MARKS[brand["mark"]] + [UNDERLINE]:
        kind = shape[0]
        if kind == "rect":
            _, x, y, w, h = shape
            d.rectangle([x * scale, y * scale, (x + w) * scale - 1, (y + h) * scale - 1], fill=white)
        elif kind == "poly":
            d.polygon([(x * scale, y * scale) for x, y in shape[1]], fill=white)
        else:
            _, cx, cy, ro, ri = shape
            box_o = [(cx - ro) * scale, (cy - ro) * scale, (cx + ro) * scale, (cy + ro) * scale]
            box_i = [(cx - ri) * scale, (cy - ri) * scale, (cx + ri) * scale, (cy + ri) * scale]
            if kind == "ring":
                d.ellipse(box_o, fill=white)
                d.ellipse(box_i, fill=brand["color"])
            else:
                d.pieslice(box_o, -90, 90, fill=white)
                d.pieslice(box_i, -90, 90, fill=brand["color"])
    return img.resize((size, size), Image.LANCZOS)


def write_all():
    for target, brand in TARGET_BRANDS.items():
        out = ROOT / "brand" / target
        out.mkdir(parents=True, exist_ok=True)
        with open(out / BRAND_ICON_FILES["svg"], "w", encoding="utf-8", newline="\n") as f:
            f.write(icon_svg(brand))
        for key, size in (("png32", 32), ("apple", 180), ("png192", 192), ("png512", 512)):
            icon_png(brand, size).save(out / BRAND_ICON_FILES[key], optimize=True)
        print("brand/%s: %s" % (target, ", ".join(sorted(p.name for p in out.iterdir()))))


if __name__ == "__main__":
    write_all()
