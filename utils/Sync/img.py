import os

from subprocess import call

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


def image_magick_resize(input_file, output_file, size, quality=85):
    s = '%dx%d' % size
    call(['convert', input_file, '-resize', s, '-quality', str(quality), output_file])
