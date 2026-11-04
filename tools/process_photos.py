#!/usr/bin/env python3
"""Prepare car photos for the website and rebuild data/car-photos.json.

Usage (from anywhere, requires Pillow: pip install pillow):

    python tools/process_photos.py

To add photos, copy them into assets/images/cars/<CAR NAME>/ and run this script.
It will:

  * shrink each photo to at most 1920 px and save it as a .jpg
  * create a small version in that car's thumbs/ folder
  * correct rotation and remove camera metadata, such as GPS location
  * add new photos to data/car-photos.json

Photos already in car-photos.json keep their order, so you can reorder a car's
list by hand. The first photo is the car's main image. Deleted photos are removed
from the list. Animated GIFs are not resized, because that would lose the
animation; they only get a still thumbnail. Running the script again is safe.
"""
import json
import re
from pathlib import Path

from PIL import Image, ImageOps

ROOT = Path(__file__).resolve().parent.parent
CARS_DIR = ROOT / "assets" / "images" / "cars"
MANIFEST = ROOT / "data" / "car-photos.json"

FULL_SIZE = 1920
THUMB_SIZE = 640
FULL_QUALITY = 82
THUMB_QUALITY = 76
# A photo under this size and within FULL_SIZE is left alone, so re-running the
# script never re-compresses (and slowly degrades) a finished photo.
MAX_FINISHED_BYTES = 900_000

EXTENSIONS = {".jpg", ".jpeg", ".png", ".avif", ".webp", ".gif"}


def natural_key(path):
    return [int(part) if part.isdigit() else part.lower() for part in re.split(r"(\d+)", path.name)]


def flatten(image):
    """Return an RGB copy with correct rotation and any transparency on white."""
    image = ImageOps.exif_transpose(image)
    if image.mode in ("RGBA", "LA", "PA") or "transparency" in image.info:
        rgba = image.convert("RGBA")
        background = Image.new("RGB", rgba.size, "white")
        background.paste(rgba, mask=rgba.getchannel("A"))
        return background
    return image.convert("RGB")


def save_jpeg(image, path, size, quality):
    copy = image.copy()
    copy.thumbnail((size, size), Image.LANCZOS)
    copy.save(path, "JPEG", quality=quality, optimize=True, progressive=True)


def available_jpg_path(source):
    """Pick the .jpg name for a photo without overwriting a different photo."""
    target = source.with_suffix(".jpg")
    # Compare ignoring case: on Windows, photo.JPG and photo.jpg are the same file.
    if target.name.lower() == source.name.lower() or not target.exists():
        return target
    number = 2
    while True:
        target = source.with_name(f"{source.stem}-{number}.jpg")
        if not target.exists():
            return target
        number += 1


def process(source):
    """Make one photo web-ready and return its final path."""
    thumbs = source.parent / "thumbs"
    thumbs.mkdir(exist_ok=True)

    with Image.open(source) as image:
        if source.suffix.lower() == ".gif" and getattr(image, "is_animated", False):
            thumb = thumbs / f"{source.stem}.jpg"
            if not thumb.exists():
                save_jpeg(flatten(image), thumb, THUMB_SIZE, THUMB_QUALITY)
            return source

        finished = (
            source.suffix == ".jpg"
            and max(image.size) <= FULL_SIZE
            and source.stat().st_size <= MAX_FINISHED_BYTES
        )
        if finished and (thumbs / f"{source.stem}.jpg").exists():
            return source

        picture = flatten(image)

    target = source if finished else available_jpg_path(source)
    if not finished:
        # Write beside the original first, so a failure can't destroy a photo.
        temporary = target.with_name(target.name + ".tmp")
        save_jpeg(picture, temporary, FULL_SIZE, FULL_QUALITY)
        source.unlink()
        temporary.replace(target)
        print(f"  {source.name} -> {target.name}")
    save_jpeg(picture, thumbs / f"{target.stem}.jpg", THUMB_SIZE, THUMB_QUALITY)
    return target


def relative(path):
    return path.relative_to(ROOT).as_posix()


def sort_key(path):
    # GIFs go last so a large animation is never a car's main image by default.
    return (path.suffix.lower() == ".gif", natural_key(path))


def main():
    previous = json.loads(MANIFEST.read_text(encoding="utf-8")) if MANIFEST.exists() else {}
    manifest = {}

    for folder in sorted(CARS_DIR.iterdir(), key=lambda p: p.name):
        if not folder.is_dir():
            continue
        print(folder.name)
        photos = [p for p in folder.iterdir() if p.is_file() and p.suffix.lower() in EXTENSIONS]
        final = [relative(process(photo)) for photo in sorted(photos, key=sort_key)]

        car = folder.name.lower()
        if final:
            kept = [path for path in previous.get(car, []) if path in final]
            manifest[car] = kept + [path for path in final if path not in kept]

        # Remove thumbnails whose photo no longer exists.
        thumbs = folder / "thumbs"
        if thumbs.exists():
            stems = {Path(path).stem for path in final}
            for thumb in thumbs.iterdir():
                if thumb.stem not in stems:
                    thumb.unlink()

    text = json.dumps(dict(sorted(manifest.items())), indent=2) + "\n"
    MANIFEST.write_text(text, encoding="utf-8")
    print(f"Wrote {relative(MANIFEST)}: {sum(map(len, manifest.values()))} photos, {len(manifest)} cars")


if __name__ == "__main__":
    main()
