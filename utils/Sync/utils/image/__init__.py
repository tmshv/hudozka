import os

from PIL import Image

from utils.hash import file_hash
from utils.image import resize
from utils.image.resize import optimize, thumbnail


def read_image(src):
    try:
        return Image.open(src)
    except FileNotFoundError:
        return None


def create_image(file, sizes, url_fn, output_dir, skip_processing=False):
    """

    :param file: Image path to process
    :param sizes: list of sizes to generate image (<size_name>, <width>, <height>)
    :param url_fn: function (size_name, ext) for creating image url
    :param output_dir: path to local folder for thumbs storing
    :param skip_processing: True/False to skip thumbs generation
    :return:
    """
    image = read_image(file)
    if not image:
        return None

    result = {}
    _, ext = os.path.splitext(file)
    for size in sizes:
        size_name, width, height = size

        image_url = url_fn(size_name, ext)
        image_filename = os.path.basename(image_url)
        d = os.path.join(output_dir, image_filename)

        if not skip_processing:
            thumb = optimize(image, d, quality=90) if size_name == 'original' else thumbnail(image, d, (width, height))
            width, height = thumb.size

        result[size_name] = {
            'url': image_url,
            'size': size_name,
            'width': width,
            'height': height
        }

    return {
        'file': os.path.basename(file),
        'hash': file_hash(file),
        'data': result
    }
