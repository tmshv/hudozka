import os
from glob import glob

import yaml
from markdown import markdown
from pymongo import MongoClient

import settings
from image.image_processor import image_processor
from text.split import split


def get_db():
    client = MongoClient(settings.database_uri)
    return client.hudozka


def sync(collective):
    clear_db()
    db = get_db()
    for a in collective:
        db.collective.insert(a)


def clear_db():
    db = get_db()
    db.collective.drop()


def process_profile(md_path):
    sizes = settings.image_sizes
    images_dir = settings.collective_image_output
    public_base_url = settings.collective_image_base_url

    generate_image_filename = lambda image, size_name, ext: '{image}-{size}{ext}'.format(
        image=image,
        size=size_name,
        ext=ext
    )

    ip = image_processor(images_dir, public_base_url, sizes, generate_image_filename)

    with open(md_path, 'rb') as f:
        data = f.read().decode('utf-8')
        yaml_data, md_data = split(data)

        profile = yaml.load(yaml_data)
        text = markdown(md_data) if md_data else None

        img = os.path.join(
            os.path.dirname(md_path),
            profile['picture']
        )
        profile['picture'] = ip(img)
        profile['biography'] = text

        return profile


if __name__ == '__main__':
    dir = '/Users/tmshv/Dropbox/Dev/Hud school/Collective'
    files = glob(dir + '/*.md')

    collective = list(map(
        process_profile,
        files
    ))

    list(map(print, collective))
    sync(collective)
