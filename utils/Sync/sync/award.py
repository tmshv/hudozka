import os
from glob import glob
from shutil import copyfile
from tempfile import mkstemp

import settings
from db import db
from sync.image import sync_image
from utils.fn import lmap, lprint_json, key_mapper, lprint
from utils.hash import hash_file, hash_str
from utils.image import create_image
from utils.image.resize import image_magick_pdf_to_img
from utils.text.transform import url_encode_text, url_encode_file

prefix = 'award'
dir_documents = '/Users/tmshv/Dropbox/Dev/Hud school/Awards'
dir_static_uploads = '/Users/tmshv/Desktop/Hudozka Static/uploads'
dir_static_previews = '/Users/tmshv/Desktop/Hudozka Static/images'
url_base_preview = 'https://static.shburg.org/art/images/{id}-{size}{ext}'
url_base_document = 'https://static.shburg.org/art/uploads/{file}'


def collection():
    return db().awards


def pdf_to_jpg(pdf):
    cwd = os.getcwd()
    abspdf = os.path.join(cwd, pdf)
    _, temp = mkstemp('.jpg')
    image_magick_pdf_to_img(abspdf, temp)
    return temp


def sync_document(record):
    if isinstance(record, list):
        return lmap(
            sync_document,
            record
        )

    q = {'id': record['id']}
    try:
        collection().update_one(q, {'$set': record}, upsert=True)
        return collection().find_one(q)
    except ValueError:
        pass

    return None


def read_document(i, query_fn=None):
    q = query_fn(i) if query_fn else {'id': i['id']}
    try:
        return collection().find_one(q)
    except ValueError:
        pass

    return None


def query_documents(q):
    return collection().find(q)


def delete_document(q):
    return collection().find_one_and_delete(q)


def create_preview(pdf, sizes, preview_dir):
    temp_preview_path = pdf_to_jpg(pdf)

    id = url_encode_text(pdf)
    url = lambda size, ext: url_base_preview.format(id=id, size=size, ext=ext)

    img = create_image(temp_preview_path, sizes, url, preview_dir)
    os.remove(temp_preview_path)
    return img


def create_document(doc):
    sizes = settings.awards_image_sizes
    file = doc['file']

    doc['type'] = prefix
    doc['url'] = url_base_document.format(file=url_encode_file(file))
    doc['preview'] = create_preview(file, sizes=sizes, preview_dir=dir_static_previews)
    doc['file'] = {
        'name': file,
        'size': os.path.getsize((file))
    }

    return doc


def create_id(doc):
    return url_encode_text('{type}-{file}'.format(
        type=prefix,
        file=doc['file']
    ))


if __name__ == '__main__':
    # ALL DOCUMENTS IDS FOUNDED
    scope_documents_ids = []

    # GET DOCUMENT YAML_MANIFEST FILES
    os.chdir(dir_documents)
    documents = glob('*.pdf')

    # READ YAML_MANIFEST FILES
    documents = lmap(
        lambda i: {
            'file': i
        },
        documents
    )

    # CREATE DOCUMENT IDENTITY
    documents = lmap(
        lambda i: {**i, 'id': create_id(i)},
        documents
    )

    # CREATE HASH OF DOCUMENT FILE
    documents = lmap(
        lambda i: {**i, 'hash': hash_str(i) + hash_file(i['file'])},
        documents
    )

    # CREATE SCOPE OF CURRENT SESSION
    scope_documents_ids = lmap(
        lambda i: i['id'],
        documents
    )

    # SKIP UNTOUCHED DOCUMENTS
    documents = lmap(
        lambda i: i[0],
        filter(
            lambda i: i[1] is None or (i[0]['hash'] != i[1]['hash']),
            lmap(
                lambda document: (document, read_document(document)),
                documents
            )
        ))

    # MAP DOCUMENT PROFILE FROM MANIFEST TO DOCUMENT_OBJECT
    documents = lmap(
        create_document,
        documents
    )

    # REPLACE PREVIEW_OBJECT WITH IT _ID IN MONGODB
    documents = lmap(
        key_mapper('preview', lambda i: sync_image(i)['_id']),
        documents
    )

    # COPY FILE -> STATIC_DIR/URL_FILENAME
    out_path = lambda doc: os.path.join(dir_static_uploads, os.path.basename(doc['url']))
    lmap(
        lambda doc: copyfile(
            doc['file']['name'],
            out_path(doc)
        ),
        documents
    )

    # SYNC DOCUMENT_OBJECT WITH DB
    documents = lmap(
        sync_document,
        documents
    )

    documents_to_remove = query_documents({'id': {'$nin': scope_documents_ids}})
    documents_to_remove = lmap(
        delete_document,
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
    lprint_json(documents_to_remove)

    # DELETE
    print('UPDATE DOCUMENTS:')
    lprint_json(documents)
    print('[SYNC DOCUMENTS DONE]')
