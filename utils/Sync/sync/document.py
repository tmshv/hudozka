import os
from glob import glob

from tempfile import mkstemp

from shutil import copyfile

import settings
from db import db
from sync.image import sync_image
from utils.fn import combine, lmap, lprint, key_mapper
from utils.image import create_image
from utils.image.resize import image_magick_pdf_to_img
from utils.io import read_yaml
from utils.text.transform import url_encode_text, url_encode_file

# Adds specified category to each file in files list
unwrap_file_list = lambda files, title: map(
    lambda profile: {'category': title, **profile},
    files
)


def sync_document(record):
    if isinstance(record, list):
        return lmap(
            sync_document,
            record
        )

    q = {'url': record['url']}
    try:
        documents = db().documents
        update_result = documents.update_one(q, {'$set': record}, upsert=True)
        i = documents.find_one({'url': record['url']})
        return i
    except ValueError:
        pass

    return None


def pdf_to_jpg(pdf):
    cwd = os.getcwd()
    abspdf = os.path.join(cwd, pdf)
    _, temp = mkstemp('.jpg')
    image_magick_pdf_to_img(abspdf, temp)
    return temp


def create_preview(pdf, sizes, preview_dir):
    temp_preview_path = pdf_to_jpg(pdf)

    id = url_encode_text(pdf)
    url_base = 'https://static.shburg.org/art/images/document-{id}-{size}{ext}'
    url = lambda size, ext: url_base.format(id=id, size=size, ext=ext)

    img = create_image(temp_preview_path, sizes, url, preview_dir)
    os.remove(temp_preview_path)
    return img


def create_document(doc):
    sizes = settings.image_sizes
    preview_dir = '/Users/tmshv/Dropbox/Dev/Hud School/Static/images'
    file = doc['file']

    doc['type'] = 'document'
    doc['url'] = 'https://static.shburg.org/art/uploads/' + url_encode_file(file)
    doc['preview'] = create_preview(file, sizes=sizes, preview_dir=preview_dir)
    doc['file'] = {
        'name': file,
        'size': os.path.getsize((file))
    }

    return doc


def unwrap_manifest(param):
    if isinstance(param, list):
        return combine(map(
            unwrap_manifest,
            param
        ))

    if 'files' in param:
        return lmap(
            unwrap_manifest,
            unwrap_file_list(param['files'], param['title'])
        )

    if 'file' not in param:
        return None

    return param


if __name__ == '__main__':
    dir = '/Users/tmshv/Dropbox/Dev/Hud school/Documents'

    os.chdir(dir)

    # GET DOCUMENT YAML_MANIFEST FILES
    files = glob(dir + '/*.yaml')

    # READ YAML_MANIFEST FILES
    files_data = lmap(
        read_yaml,
        files
    )

    # GET FLAT LIST OF DOCUMENTS
    documents = unwrap_manifest(files_data)

    # MAP DOCUMENT PROFILE FROM MANIFEST TO DOCUMENT_OBJECT
    documents = lmap(
        create_document,
        documents
    )

    # REPLACE PREVIEW_OBJECT WITH IT _ID IN MONGODB
    sync_preview = lambda i: sync_image(i)['_id']
    documents = lmap(
        key_mapper('preview', sync_preview),
        documents
    )

    # COPY FILE -> STATIC_DIR/URL_FILENAME
    out_path = lambda doc: os.path.join('/Users/tmshv/Dropbox/Dev/Hud school/Static/uploads', os.path.basename(doc['url']))
    lmap(
        lambda doc : copyfile(
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

    lprint(documents)
    print('SYNC DOCUMENTS DONE')

    # DOCUMENT_OBJECT SAMPLE
    # {
    #     "_id": ObjectId("56d08411ace9573958e5e490"),
    #     "url": "https://static.shburg.org/art/uploads/egryul.pdf",
    #     "title": "Свидетельство о внесении в «ЕГРЮЛ»",
    #     "preview": ObjectId("56d07d87ace9573958e5e488"),
    #     "file": "ЕГРЮЛ.pdf",
    #     "category": "Основные документы"
    # }