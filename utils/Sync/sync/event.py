import os
from datetime import datetime
from glob import glob

import lxml.html

import settings
from db import db
from sync import create_date_and_title_from_folder_name, create_post_from_image_list
from sync.image import sync_image
from utils.fn import combine, lmap, lprint, first, map_cases, key_mapper
from utils.image import create_image
from utils.io import read_yaml_md
from utils.text.transform import url_encode_text


def sync_event(record):
    if isinstance(record, list):
        return lmap(
            sync_event,
            record
        )

    q = {'id': record['id']}
    try:
        collection = db().events
        update_result = collection.update_one(q, {'$set': record}, upsert=True)
        i = collection.find_one({'id': record['id']})
        return i
    except ValueError:
        pass

    return None


def create_event(doc):
    if 'date' not in doc or not doc['date']:
        return None

    if 'title' not in doc or not doc['title']:
        return None

    doc['id'] = doc['id'] if 'id' in doc else url_encode_text(doc['title'])

    url_base = 'https://static.shburg.org/art/images/event-{id}-{img}-{size}{ext}'
    images_dir = '/Users/tmshv/Dropbox/Dev/Hud School/Static/images'
    sizes = settings.event_image_sizes

    post_html = lxml.html.fromstring(doc['post'])

    images = []
    for img in post_html.cssselect('img'):
        src = img.get('src')
        img_path = os.path.join(doc['folder'], src)

        if os.path.exists(img_path):
            img_id = url_encode_text(os.path.splitext(src)[0])
            url_fn = lambda size, ext: url_base.format(id=doc['id'], img=img_id, size=size, ext=ext.lower())

            image = create_image(img_path, sizes, url_fn, images_dir)
            if image:
                images.append(image)
                img.set('src', image['data']['big']['url'])
            else:
                print('fail: ', doc['folder'], src)

    doc['post'] = lxml.html.tostring(post_html).decode('utf-8')
    doc['images'] = images

    return doc


def get_md_manifest(md_path):
    y, m = read_yaml_md(md_path)

    y['date'] = datetime.strptime(y['date'], '%d.%m.%Y')
    y['id'] = str(y['id'])

    return {
        **y,
        'post': m
    }


if __name__ == '__main__':
    dir = '/Users/tmshv/Dropbox/Dev/Hud school/Events'

    os.chdir(dir)

    # GET EVENT FOLDERS
    events = lmap(
        lambda i: i.path,
        filter(
            lambda i: i.is_dir(),
            os.scandir('.')
        )
    )

    # PARSE FOLDER NAME -> GET OPTIONAL DATE/TITLE
    events = lmap(
        lambda i: (i,) + create_date_and_title_from_folder_name(
            os.path.basename(i), ['%Y.%m.%d']
        ),
        events
    )

    # CREATE BASIC_MANIFEST BASED ON FOLDER NAME AND IMAGE CONTENT
    image_types = ['*.jpg', '*.JPG', '*.png', '*.PNG']
    glob_in = lambda dir: combine(map(
        lambda type: glob(os.path.join(dir, type)),
        image_types
    ))
    events = lmap(
        lambda i: {
            'folder': i[0],
            'date': i[1],
            'title': i[2],
            'post': create_post_from_image_list(lmap(
                lambda path: os.path.relpath(path, i[0]),
                glob_in(i[0])
            ))
        },
        events
    )

    # TRY TO FILL UP BASIC_MANIFEST WITH MD_MANIFEST
    md_glob = lambda i : first(glob(i + '/*.md'))
    events = lmap(
        lambda i: {
            **i,
            **map_cases(
                i,
                [(
                    lambda i: md_glob(i['folder']),
                    lambda i: get_md_manifest(md_glob(i['folder'])),
                )],

                lambda i: {}
            )
        },
        events
    )

    # MAP EVENT MANIFEST -> EVENT_OBJECT
    events = lmap(
        create_event,
        events
    )

    # FILTER INCORRECT EVENTS
    events = list(filter(None, events))

    # REPLACE IMAGES OBJECTS WITH IT _ID IN MONGODB
    sync_images = lambda i: lmap(
        lambda image: image['_id'],
        sync_image(i)
    )
    events = lmap(
        key_mapper('images', sync_images),
        events
    )

    # SYNC EVENT_OBJECT WITH DB
    events = lmap(
        sync_event,
        events
    )

    lprint(events)
    print('SYNC EVENTS DONE')
