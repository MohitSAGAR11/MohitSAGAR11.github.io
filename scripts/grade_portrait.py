"""Grade a photo into the site's warm-monochrome portrait.

Usage:
  python scripts/grade_portrait.py assets/mohit.png public/mohit-portrait.jpg [public/mohit-color.jpg]

Crops to a centred 4:5 portrait, sinks a blue backdrop into the page colour,
and maps tones onto the palette in src/app/globals.css. The optional third path
gets the same crop in original colour for the hover cross-fade, so the two line
up exactly. Both are pre-sized because GitHub Pages can't optimise images.
"""

import sys

import numpy as np
from PIL import Image, ImageFilter, ImageOps

CANVAS = np.array([15, 14, 12], float)  # --color-canvas
DIM = np.array([107, 102, 92], float)  # --color-dim
BONE = np.array([236, 232, 223], float)  # --color-bone
SIZE = (800, 1000)


def curve(x: np.ndarray, lo: float, hi: float, gamma: float) -> np.ndarray:
    return np.clip((x - lo) / (hi - lo), 0, 1) ** gamma


def tritone(t: np.ndarray) -> np.ndarray:
    stops = [(0.0, CANVAS), (0.45, DIM), (1.0001, BONE)]
    t = t[..., None]
    out = np.zeros(t.shape[:2] + (3,))
    for (a, ca), (b, cb) in zip(stops, stops[1:]):
        inside = ((t >= a) & (t <= b)).astype(float)
        out += inside * (ca + (cb - ca) * (t - a) / (b - a))
    return np.clip(out, 0, 255)


def grade(src: str, dst: str, colour_dst: str | None = None) -> None:
    img = Image.open(src).convert("RGB")
    w, h = img.size
    if w / h > 0.8:
        cw = int(h * 0.8)
        img = img.crop(((w - cw) // 2, 0, (w - cw) // 2 + cw, h))
    else:
        ch = int(w / 0.8)
        img = img.crop((0, (h - ch) // 2, w, (h - ch) // 2 + ch))
    img = img.resize(SIZE, Image.LANCZOS)
    width, height = img.size
    if colour_dst:
        img.save(colour_dst, quality=82, optimize=True, progressive=True)

    lum = np.asarray(ImageOps.grayscale(img), float) / 255.0
    # Blue-dominant pixels are backdrop: drop them toward the page colour.
    rgb = np.asarray(img.filter(ImageFilter.GaussianBlur(6)), float)
    backdrop = np.clip((rgb[..., 2] - rgb[..., 0] - 10) / 45.0, 0, 1)
    lum = lum * (1 - 0.72 * backdrop)

    yy, xx = np.mgrid[0:height, 0:width]
    r = np.sqrt(((xx - width * 0.5) / (width * 0.62)) ** 2 + ((yy - height * 0.42) / (height * 0.62)) ** 2)
    vignette = np.clip(1.15 - r**1.6, 0, 1)

    graded = tritone(curve(lum, 0.08, 0.92, 1.25) * vignette)
    Image.fromarray(graded.astype(np.uint8)).save(dst, quality=88, optimize=True, progressive=True)


if __name__ == "__main__":
    if len(sys.argv) not in (3, 4):
        sys.exit(__doc__)
    grade(sys.argv[1], sys.argv[2], sys.argv[3] if len(sys.argv) == 4 else None)
