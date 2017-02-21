import os

from subprocess import call

import smartcrop
from PIL import Image
from smartcrop import SmartCrop

import utils.image


def thumbnail(src, dest, size, ext=None):
    image_magick_resize(src, dest, size, quality=85)
    return utils.image.read_image(dest)

    # image = utils.image.read_image(src)
    # image.thumbnail(size)
    # image.save(override_extension(dest, ext))
    # return image


def optimize(src, dest, quality=85, ext=None):
    image = utils.image.read_image(src)
    if image:
        image.save(override_extension(dest, ext), quality=quality)
    return image


def override_extension(dest, ext=None):
    if ext is not None:
        dest = os.path.splitext(dest)[0] + ext

    return dest


def crop(src, dest, size):
    width, height = size
    image = utils.image.read_image(src)
    crop_options = smartcrop.DEFAULTS
    crop_options['width'] = width
    crop_options['height'] = height

    crop_instance = SmartCrop()
    result = crop_instance.crop(image.copy(), crop_options)

    box = (result['topCrop']['x'],
           result['topCrop']['y'],
           result['topCrop']['x'] + result['topCrop']['width'],
           result['topCrop']['y'] + result['topCrop']['height'])

    i = utils.image.read_image(src).crop(box)
    i.thumbnail(size, Image.ANTIALIAS)
    i.save(dest)


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


def image_magick_resize(ifile, ofile, size, quality=85):
    s = '%dx%d' % size
    call(['/usr/local/bin/convert', ifile, '-strip', '-auto-orient', '-resize', s, '-quality', str(quality), ofile])


# def image_magick_resize(input_file, output_file, size, quality=85):
#     from wand.image import Image
#
#     w, h = size
#     s = '{w}x{h}>'.format(w=w, h=h)
#
#     with Image(filename=input_file) as img:
#         # print(img.size)
#         # print(list(img.metadata.items()))
#         with img.clone() as i:
#             i.transform(resize=s)
#             i.auto_orient()
#             i.strip()
#             i.save(filename=output_file)


def image_magick_pdf_to_img(input_file, output_file):
    call([
        '/usr/local/bin/gs',
        '-q',
        '-sDEVICE=jpeg',
        '-dLastPage=1',
        '-o',
        output_file,
        input_file
    ])
