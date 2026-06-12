#!/usr/bin/env python3
"""
Convert polaroid frame PNGs from RGB (solid black centers) to RGBA (transparent centers).

Makes all near-black pixels (R < 10 AND G < 10 AND B < 10) fully transparent.
Border pixels are safe — analysis confirms minimum border values of R≥25, G≥23, B≥14.

Idempotent: running on already-converted RGBA images is a no-op,
since transparent-center pixels already have alpha=0.
"""

import sys
from pathlib import Path
from PIL import Image

IMAGES = [
    Path("public/images/carousel/polaroid1.png"),
    Path("public/images/carousel/polaroid2.png"),
    Path("public/images/carousel/polaroid3.png"),
    Path("public/images/carousel/polaroid4.png"),
]

THRESHOLD = 10  # pixels with R,G,B all below this become transparent


def convert_image(path: Path) -> None:
    img = Image.open(path)
    input_mode = img.mode
    img = img.convert("RGBA")
    pixels = img.load()
    width, height = img.size

    transparent = 0
    opaque = 0

    for y in range(height):
        for x in range(width):
            r, g, b, a = pixels[x, y]
            if r < THRESHOLD and g < THRESHOLD and b < THRESHOLD:
                pixels[x, y] = (r, g, b, 0)
                transparent += 1
            else:
                # Ensure border pixels are fully opaque
                if a != 255:
                    pixels[x, y] = (r, g, b, 255)
                opaque += 1

    img.save(path)
    print(
        f"{path}: input={input_mode}, output=RGBA, "
        f"transparent={transparent}, opaque={opaque}"
    )


def main() -> None:
    missing = [p for p in IMAGES if not p.exists()]
    if missing:
        print(f"Error: missing files: {missing}", file=sys.stderr)
        sys.exit(1)

    for path in IMAGES:
        convert_image(path)

    print("\nDone. All four polaroid frames converted.")


if __name__ == "__main__":
    main()
