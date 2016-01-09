import os

__author__ = 'Roman Timashev'

from PIL import Image


def read_image(src):
    return Image.open(src)


def minify(image, dest, size, ext=None):
    image.thumbnail(size)
    image.save(override_extension(dest, ext))


def optimize(image, dest, quality=85, ext=None):
    image.save(override_extension(dest, ext), quality=quality)


def override_extension(dest, ext=None):
    if ext is not None:
        dest = os.path.splitext(dest)[0] + ext

    return dest