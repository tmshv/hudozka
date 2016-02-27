import os

from PIL import Image

from utils.hash import file_hash
from utils.image import resize
from utils.image.resize import optimize, thumbnail, orient


def read_image(src):
    try:
        i = Image.open(src)
        return i
        # return orient(i)
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
    image = read_image(file)
    if not image:
        return None

    result = {}
    _, ext = os.path.splitext(file)
    for size in sizes:
        size_name, width, height = size

        image_width, image_height = image.size
        if image_height > image_width:
            width, height = height, width

        image_url = url_fn(size_name, ext)
        image_filename = os.path.basename(image_url)
        local_image_path = os.path.join(output_dir, image_filename)

        if not skip_processing:
            if size_name == 'original':
                thumb = optimize(file, local_image_path, quality=90)
            else:
                thumb = thumbnail(file, local_image_path, (width, height))
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
