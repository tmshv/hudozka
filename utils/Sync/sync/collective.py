import os
from glob import glob

import settings
from db import db
from sync.image import sync_image
from utils.fn import lmap, lprint, key_mapper
from utils.image import create_image
from utils.io import read_yaml_md


def read_teacher_by_id(record):
    if isinstance(record, list):
        return lmap(
            read_teacher_by_id,
            record
        )

    q = {'id': record}
    try:
        return db().collective.find_one(q)
    except ValueError:
        pass

    return None


def sync_collective(record):
    if isinstance(record, list):
        return lmap(
            sync_collective,
            record
        )

    q = {'id': record['id']}
    try:
        collection = db().collective
        update_result = collection.update_one(q, {'$set': record}, upsert=True)
        i = collection.find_one({'id': record['id']})
        return i
    except ValueError:
        pass

    return None


def create_profile(profile):
    sizes = settings.image_sizes
    images_dir = settings.collective_image_output

    url_base = 'https://static.shburg.org/art/image/teacher-{id}-{size}{ext}'
    url_fn = lambda size, ext: url_base.format(id=profile['id'], size=size, ext=ext)

    profile['picture'] = create_image(profile['picture'], sizes, url_fn, images_dir)
    return profile


if __name__ == '__main__':
    dir = '/Users/tmshv/Dropbox/Dev/Hud school/Collective'
    os.chdir(dir)

    # GET TEACHER YAML/MD MANIFEST FILES
    files = glob('*.md')

    # READ TEACHER YAML/MD MANIFEST
    collective = lmap(
        read_yaml_md,
        files
    )

    # COMBINE MD DATA WITH YAML MANIFEST AS BIOGRAPHY
    collective = lmap(
        lambda i: {'biography': i[1], **i[0]},
        collective
    )

    # MAP TEACHER_MANIFEST -> TEACHER_PROFILE
    collective = lmap(
        create_profile,
        collective
    )

    # REPLACE PICTURE_OBJECT WITH IT _ID IN MONGODB
    sync_picture = lambda i: None if i is None else sync_image(i)['_id']
    collective = lmap(
        key_mapper('picture', sync_picture),
        collective
    )

    lprint(collective)
    print('SYNC COLLECTIVE DONE')
