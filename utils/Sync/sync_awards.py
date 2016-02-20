import os
from glob import glob

from pymongo import MongoClient

import img
import settings


def generate_image_filename(image, size_name, ext):
    """
    Example: 2015-history-competition-1-small.jpg
    :param image:
    :param size_name:
    :param ext:
    :return:
    """
    return '{image}-{size}{ext}'.format(
            image=image,
            size=size_name,
            ext=ext
    )


def process_file(file):
    sizes = settings.image_sizes
    image = img.read_image(file)
    images_dir = '/Users/tmshv/Desktop/Hudozka Awards'
    public_base_url = 'https://static.shlisselburg.org/art/awards/'

    basename = os.path.basename(file)
    uri, ext = os.path.splitext(basename)

    award = {
        'uri': uri,
        'thumbs': {}
    }

    for size in sizes:
        size_name, width, height = size

        image_filename = generate_image_filename(uri, size_name, ext)
        d = os.path.join(images_dir, image_filename)
        image_url = os.path.join(public_base_url, image_filename)

        thumb = img.optimize(image, d, quality=90) if size_name == 'original' else img.thumbnail(image, d, (width, height))

        width, height = thumb.size
        award['thumbs'][size_name] = {
            'url': image_url,
            'size': size_name,
            'width': width,
            'height': height
        }

    return award


def get_db():
    client = MongoClient(settings.database_uri)
    return client.hudozka


def sync(awards):
    clear_db()
    db = get_db()
    for a in awards:
        db.awards.insert(a)


def clear_db():
    db = get_db()
    db.awards.drop()


if __name__ == '__main__':
    dir = '/Users/tmshv/Dropbox/Dev/Hud school/Awards'
    files = glob(dir + '/*')

    awards = list(map(
            process_file,
            files
            # map(
            #     lambda f : os.path.join(dir, f),
            #     files
            # )
    ))

    print(awards)
    sync(awards)
