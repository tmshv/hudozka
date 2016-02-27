import os
from glob import glob

import lxml.html

import settings
from db import db
from models.product import create_product
from sync import create_date_and_title_from_folder_name, create_post_from_image_list, create_date
from sync.image import sync_image
from utils.fn import lmap, first, map_cases, dir_globber, lprint_json, key_mapper, iterate_iter_over_fns
from utils.image import create_image
from utils.io import read_yaml_md
from utils.text.transform import url_encode_text, interpolate, interpolate_swift


def sync_album(record):
    if isinstance(record, list):
        return lmap(
            sync_album,
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


def create_album(doc):
    sizes = settings.event_image_sizes
    # url_base = 'https://static.shburg.org/art/image/product-{album}-{id}-{size}{ext}'
    images_dir = '/Users/tmshv/Dropbox/Dev/Hud School/Static/images'
    url = lambda a, i, s, e: 'https://static.shburg.org/art/image/product-{album}-{id}-{size}{ext}'.format(
        album=a,
        id=i,
        size=s,
        ext=e
    )
    create_url = lambda aid, pid: lambda size, ext: url(aid, pid, size, ext.lower())
    image_id = lambda i: url_encode_text(
        os.path.splitext(i)[0]
    )
    image_path = lambda i: os.path.join(doc['folder'], i)

    if 'title' not in doc or not doc['title']:
        return None

    create_album_id = lambda date, title: '{date}-{title}'.format(
        date=date.strftime('%Y'),
        title=url_encode_text(title)
    )

    images = []

    doc['id'] = doc['id'] if 'id' in doc else create_album_id(doc['date'], doc['title'])

    if 'album' in doc:
        # album_context =
        iter_album = iterate_iter_over_fns([
            lambda product: {
                **product,
                'image': create_image(
                    image_path(product['file']),
                    sizes,
                    create_url(
                        doc['id'],
                        image_id(product['file'])
                    ),
                    images_dir,
                    skip_processing=True
                )
            },
            lambda product: {
                **product,
                'awards': lmap(
                    lambda award: {
                        **award,
                        'file': os.path.join(doc['folder'], award['file']),
                        'assigned': interpolate(award['assigned'], product, interpolate_swift),
                        # 'awardFor': product
                    },
                    product['awards']
                )
            }
        ])

        doc['album'] = lmap(
            create_product,
            iter_album(doc['album'])
        )

    post_html = lxml.html.fromstring(doc['post'])

    for img in post_html.cssselect('img'):
        src = img.get('src')
        img_path = image_path(src)

        if os.path.exists(img_path):
            image = create_image(
                img_path,
                sizes,
                create_url(
                    doc['id'],
                    image_id(src)
                ),
                images_dir,
                skip_processing=True
            )
            images.append(image)

            img.set('src', image['data']['big']['url'])
            img.set('class', settings.album_html_img_class)
            img.set('data-file', src)

    doc['post'] = lxml.html.tostring(post_html).decode('utf-8')
    doc['images'] = images
    return doc


def get_manifest(filepath):
    y, m = read_yaml_md(filepath)

    data = {**y} if y else {}
    _ = lambda key, d=None: data[key] if key in data else d
    date = create_date(_('date'), settings.date_formats_direct)
    if date:
        data['date'] = date

    id = _('id')
    if id:
        data['id'] = str(id)

    post = {'post': m} if m else {}
    return {**data, **post}


if __name__ == '__main__':
    albums_dir = '/Users/tmshv/Dropbox/Dev/Hud school/Gallery'
    os.chdir(albums_dir)

    # GET ALBUMS FOLDERS
    albums = lmap(
        lambda i: i.path,
        filter(
            lambda i: i.is_dir(),
            os.scandir('.')
        )
    )

    # print(get_md_manifest('./2012 Техника мокрого валяния/WET FELTING 2012.md'))
    # print(get_manifest('./2016.02.17 Путешествие вокруг света/AROUND THE WORLD.md'))
    # exit()

    # PARSE FOLDER NAME -> GET OPTIONAL DATE/TITLE
    albums = lmap(
        lambda i: (i,) + create_date_and_title_from_folder_name(
            os.path.basename(i)
        ),
        albums
    )

    # CREATE BASIC_MANIFEST BASED ON FOLDER NAME AND IMAGE CONTENT
    glob_in = dir_globber(['*.jpg', '*.JPG', '*.png', '*.PNG'])
    albums = lmap(
        lambda i: {
            'folder': i[0],
            'date': i[1],
            'title': i[2],
            'post': create_post_from_image_list(lmap(
                lambda path: os.path.relpath(path, i[0]),
                glob_in(i[0])
            ))
        },
        albums
    )

    # TRY TO FILL UP BASIC_MANIFEST WITH MD_MANIFEST
    md_glob = lambda i: first(glob(i + '/*.md'))
    albums = lmap(
        lambda album: {
            **album,
            **map_cases(
                album,
                [(
                    lambda album: md_glob(album['folder']),
                    lambda album: get_manifest(md_glob(album['folder'])),
                )],
                lambda i: {}
            )
        },
        albums
    )

    # MAP EVENT MANIFEST -> EVENT_OBJECT
    albums = lmap(
        create_album,
        albums
    )

    # FILTER INCORRECT EVENTS
    albums = list(filter(None, albums))

    # REPLACE IMAGES OBJECTS WITH IT _ID IN MONGODB
    def sync_images(i):
        return lmap(
            lambda image: image['_id'],
            sync_image(i)
        )


    albums = lmap(
        key_mapper('images', sync_images),
        albums
    )

    # SYNC EVENT_OBJECT WITH DB
    # albums = lmap(
    #     sync_album,
    #     albums
    # )

    lprint_json(albums)
    print('SYNC ALBUMS DONE')
