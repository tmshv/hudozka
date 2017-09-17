from subprocess import call

import utils.image


def thumbnail(src, dest, size):
    image_magick_resize(src, dest, size, quality=85)
    return utils.image.read_image(dest)


def optimize(src, dest, quality=85):
    image = utils.image.read_image(src)
    if image:
        image.save(dest, quality=quality)
    return image


def image_magick_resize(input_file, output_file, size, quality=85):
    s = '%dx%d' % size
    call([
        '/usr/local/bin/convert', input_file,
        '-strip',
        '-auto-orient',
        '-resize', s,
        '-quality', str(quality),
        output_file,
    ])


def image_magick_pdf_to_img(input_file, output_file):
    call([
        '/usr/local/bin/gs',
        '-q',
        '-sDEVICE=jpeg',
        '-dLastPage=1',
        '-o', output_file,
        input_file,
    ])
