import os

from PIL import Image

from utils.hash import hash_file
# from utils.image import resize
from utils.image.resize import optimize, thumbnail, orient


def read_image(src):
    try:
        i = Image.open(src)
        return i
    except Exception as e:
        print(src, e)
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
    # image = read_image(file)
    # if not image:
    #     return None
    if not os.path.exists(file):
        return None

    result = {}
    _, ext = os.path.splitext(file)
    for size in sizes:
        size_name, width, height = size

        image_url = url_fn(size_name, ext)
        image_filename = os.path.basename(image_url)
        local_image_path = os.path.join(output_dir, image_filename)

        if not skip_processing:
            image = process_image(file, local_image_path, size)
            width, height = image.size

        result[size_name] = {
            'url': image_url,
            'size': size_name,
            'width': width,
            'height': height
        }

    return {
        'file': os.path.basename(file),
        'hash': hash_file(file),
        'data': result
    }


def process_image(input_file, output_file, size):
    size_name, width, height = size

    if size_name == 'original':
        return optimize(input_file, output_file, quality=90)
    else:
        image = read_image(input_file)
        image_width, image_height = image.size
        if image_height > image_width:
            width, height = height, width
        return thumbnail(input_file, output_file, (width, height))
