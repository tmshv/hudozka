import os

from subprocess import call

from PIL import Image

import utils.image


def thumbnail(src, dest, size, ext=None):
    image_magick_resize(src, dest, size, quality=85)
    return utils.image.read_image(dest)

    # image = read_image(src)
    # image.thumbnail(size)
    # image.save(override_extension(dest, ext))
    # return image


def optimize(src, dest, quality=85, ext=None):
    image = utils.image.read_image(src)
    image.save(override_extension(dest, ext), quality=quality)
    return image


def override_extension(dest, ext=None):
    if ext is not None:
        dest = os.path.splitext(dest)[0] + ext

    return dest


def orient(image):
    orientation = 0x0112
    rotations = {
        3: Image.ROTATE_180,
        6: Image.ROTATE_270,
        8: Image.ROTATE_90
    }

    if hasattr(image, '_getexif'):
        exif = image._getexif()
        if exif is not None:
            o = exif[orientation]
            if o in rotations:
                return image.transpose(rotations[o])
    return image


def image_magick_resize(input_file, output_file, size, quality=85):
    s = '%dx%d' % size
    call(['convert', input_file, '-strip', '-auto-orient', '-resize', s, '-quality', str(quality), output_file])


def image_magick_pdf_to_img(input_file, output_file):
    i = "{image}[0]".format(image=input_file)
    call(['convert', i, output_file])
