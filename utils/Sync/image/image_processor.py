import os

from image.image import read_image
from image.resize import optimize, thumbnail


def image_processor(images_dir, public_base_url, sizes, name_generator):
    def process(file):
        image = read_image(file)
        if not image:
            return None

        basename = os.path.basename(file)
        uri, ext = os.path.splitext(basename)

        image_dict = {}
        for size in sizes:
            size_name, width, height = size

            image_filename = name_generator(uri, size_name, ext)
            d = os.path.join(images_dir, image_filename)
            image_url = os.path.join(public_base_url, image_filename)

            do_optimize = size_name == 'original'
            thumb = optimize(image, d, quality=90) if do_optimize else thumbnail(image, d, (width, height))
            width, height = thumb.size
            image_dict[size_name] = {
                'url': image_url,
                'size': size_name,
                'width': width,
                'height': height
            }

        return image_dict
    return process