import os
from datetime import datetime
from glob import glob

import lxml.html

import settings
from db import db
from sync import create_date_and_title_from_folder_name, create_post_from_image_list, Sync, create_date, \
    images_from_html, list_images, synced_images_ids
from sync.image import sync_image
from utils.fn import combine, lmap, map_cases, first, lprint, key_mapper, lprint_json, lmapfn
from utils.hash import hash_file, hash_str
from utils.image import create_image
from utils.io import read_yaml_md
from utils.text.transform import url_encode_text


class SyncPost(Sync):
    def __init__(self, collection_name, document_type, image_url_base, dir_local_images, sizes):
        super().__init__()
        self.collection = db()[collection_name]
        self.sizes = sizes
        self.type = document_type
        self.image_url_base = image_url_base
        self.dir_local_images = dir_local_images

    def create_id(self, document):
        document['id'] = document['id'] if 'id' in document else url_encode_text(document['title'])
        return document

    def create_hash(self, document):
        hash_images = lmap(
            hash_file,
            lmap(
                lambda i: os.path.join(document['folder'], i),
                document['images']
            )
        )

        document['hash'] = hash_str(
            combine([hash_str(document)] + hash_images)
        )

        return document

    def create(self, document):
        if 'date' not in document or not document['date']:
            return None

        if 'title' not in document or not document['title']:
            return None

        if self.type:
            document['type'] = self.type

        post_html = lxml.html.fromstring(document['post'])
        images = []
        for img in post_html.cssselect('img'):
            src = img.get('src')
            img_path = os.path.abspath(
                os.path.join(document['folder'], src)
            )

            if os.path.exists(img_path):
                img_id = url_encode_text(os.path.splitext(src)[0])
                url_fn = lambda size, ext: self.image_url_base.format(id=document['id'], img=img_id, size=size,
                                                                      ext=ext.lower())

                image = create_image(img_path, self.sizes, url_fn, self.dir_local_images)
                if image:
                    images.append(image)
                    img.set('src', image['data']['big']['url'])
                else:
                    print('fail: ', document['folder'], src)

        document['post'] = lxml.html.tostring(post_html).decode('utf-8')
        document['images'] = images
        return document


def get_manifest(path):
    y, m = read_yaml_md(path)
    y = y if y else {}

    if 'date' in y:
        y['date'] = create_date(y['date'], settings.date_formats)

    if 'until' in y:
        y['until'] = create_date(y['until'], settings.date_formats)

    if 'id' in y:
        y['id'] = str(y['id'])

    return {
        **y,
        'post': m,
        'images': images_from_html(m)
    }


def md_from_folder(i):
    return first(glob(i + '/*.md'))


def get_folder_documents(sync, file_time_formats):
    # GET EVENT FOLDERS
    documents = lmap(
        lambda i: i.path,
        filter(
            lambda i: i.is_dir(),
            os.scandir('.')
        )
    )

    # PARSE FOLDER NAME -> GET OPTIONAL DATE/TITLE
    documents = lmap(
        lambda i: (i,) + create_date_and_title_from_folder_name(
            os.path.basename(i), file_time_formats
        ),
        documents
    )
    documents = lmap(
        lambda i: {
            'folder': i[0],
            'date': i[1],
            'title': i[2],
        },
        documents
    )

    # CREATE BASIC_MANIFEST BASED ON FOLDER NAME AND IMAGE CONTENT
    documents = lmap(
        lambda i: {
            **i,
            'images': lmap(
                lambda path: os.path.relpath(path, i['folder']),
                list_images(i['folder'])
            )
        },
        documents
    )
    documents = lmap(
        lambda i: {
            **i,
            'post': create_post_from_image_list(i['images'])
        },
        documents
    )

    # TRY TO FILL UP BASIC_MANIFEST WITH MD_MANIFEST
    documents = lmap(
        lambda i: {
            **i,
            **map_cases(
                i,
                [(
                    lambda i: md_from_folder(i['folder']),
                    lambda i: get_manifest(md_from_folder(i['folder'])),
                )],
                lambda i: {}
            )
        },
        documents
    )

    # CREATE DOCUMENT IDENTITY
    documents = lmap(sync.create_id, documents)

    # CREATE HASH OF DOCUMENT FILE
    documents = lmap(sync.create_hash, documents)

    return documents


# GET EVENT FILES
def get_file_documents(sync, file_time_formats):
    documents = glob('*.md')
    documents = lmap(
        lambda i: (i,) + create_date_and_title_from_folder_name(
            os.path.basename(i), file_time_formats
        ),
        documents
    )

    documents = lmap(
        lambda i: {
            'file': i[0],
            'date': i[1],
            'title': i[2],
        },
        documents
    )

    # OVERWRITE BASIC_MANIFEST WITH MD_MANIFEST
    documents = lmap(
        lambda i: {
            **i,
            **get_manifest(i['file'])
        },
        documents
    )

    # CREATE DOCUMENT IDENTITY
    documents = lmap(sync.create_id, documents)

    # CREATE HASH OF DOCUMENT FILE
    documents = lmap(sync.create_hash, documents)

    return documents


def main(dir_documents, sync, file_time_formats):
    # INIT
    os.chdir(dir_documents)

    documents = get_folder_documents(sync, file_time_formats)
    documents += get_file_documents(sync, file_time_formats)

    # CREATE SCOPE OF CURRENT SESSION
    scope_documents_ids = lmapfn(documents)(
        lambda i: i['id']
    )

    # SKIP UNTOUCHED DOCUMENTS
    documents = lmap(
        lambda i: i[0],
        filter(
            lambda i: (i[1] is None) or ('hash' not in i[1]) or (i[0]['hash'] != i[1]['hash']),
            lmap(
                lambda document: (document, sync.read(document)),
                documents
            )
        ))

    # MAP EVENT MANIFEST -> EVENT_OBJECT
    documents = lmap(
        sync.create,
        documents
    )

    # FILTER INCORRECT EVENTS
    documents = list(filter(None, documents))

    # REPLACE IMAGES OBJECTS WITH IT _ID IN MONGODB
    documents = lmap(
        key_mapper('images', synced_images_ids),
        documents
    )

    # SYNC EVENT_OBJECT WITH DB
    documents = lmap(
        sync.update,
        documents
    )

    documents_to_remove = sync.query({'id': {'$nin': scope_documents_ids}})
    documents_to_remove = lmap(
        sync.delete,
        map(
            lambda i: {'_id': i['_id']},
            documents_to_remove
        )
    )

    # SCOPE
    print('SCOPE:')
    lprint(scope_documents_ids)

    # DELETE
    print('DELETE DOCUMENTS:')
    lprint_json(lmap(
        lambda i: i['id'],
        documents_to_remove
    ))

    # DELETE
    print('UPDATE DOCUMENTS:')
    lprint_json(lmap(
        lambda i: i['id'],
        documents
    ))
    lprint_json(documents)
    print('[SYNC DOCUMENTS DONE]')


if __name__ == '__main__':
    image_url_base = settings.image_base_url + 'post-{id}-{img}-{size}{ext}'
    main(
        '/Users/tmshv/Dropbox/Dev/Hud school/Events',
        SyncPost(
            'events',
            None,
            image_url_base,
            settings.image_output,
            settings.event_image_sizes
        ),
        file_time_formats=['%Y.%m.%d']
    )

    image_url_base = settings.image_base_url + 'post-{id}-{img}-{size}{ext}'
    main(
        '/Users/tmshv/Dropbox/Dev/Hud school/News',
        SyncPost(
            'timeline',
            'post',
            image_url_base,
            settings.image_output,
            settings.event_image_sizes
        ),
        file_time_formats=settings.date_formats_reverse
    )
