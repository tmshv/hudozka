import os
from glob import glob

import settings
from db import db
from sync import Sync
from sync.image import sync_image
from utils.fn import lmap, lprint, key_mapper, lprint_json, ext, lmapfn
from utils.hash import hash_str, hash_file
from utils.image import create_image
from utils.io import read_yaml_md
from utils.text.transform import url_encode_text

dir_teachers = '/Users/tmshv/Dropbox/Dev/Hud school/Collective'
url_base = settings.teacher_image_url_base
dir_local_images = settings.teacher_image_output
sizes = settings.teacher_image_sizes


class Teacher(Sync):
    def __init__(self):
        super().__init__()
        self.collection = db().collective

    def compile(self, profile):
        profile['picture'] = create_image(
            profile['picture'],
            sizes,
            lambda size, ext: url_base.format(id=profile['id'], size=size, ext=ext),
            dir_local_images
        )
        return profile

    def create_id(self, document):
        if 'id' in document and document['id']:
            return document

        document['id'] = url_encode_text(document['name'])
        return document

    def create_hash(self, document):
        document['hash'] = hash_str(
            hash_file(document['file']) + hash_file(document['picture'])
        )
        return document


def main(dir_teachers, sync):
    os.chdir(dir_teachers)

    # GET TEACHER YAML/MD MANIFEST FILES
    documents = glob('*.md')

    # READ TEACHER YAML/MD MANIFEST
    documents = lmap(
        lambda i: (i,) + read_yaml_md(i),
        documents
    )

    # COMBINE MD DATA WITH YAML MANIFEST AS BIOGRAPHY
    documents = lmap(
        lambda i: {
            **i[1],
            'file': i[0],
            'biography': i[2]
        },
        documents
    )

    # DEFINE PROFILE PICTURE
    documents = lmap(
        lambda i: {
            **i,
            'picture': i['picture'] if 'picture' in i else ext('.jpg')(i['file']),
        },
        documents
    )

    # CREATE DOCUMENT IDENTITY
    documents = lmapfn(documents)(sync.create_id)

    # CREATE HASH OF DOCUMENT FILES
    documents = lmapfn(documents)(sync.create_hash)

    # CREATE SCOPE OF CURRENT SESSION
    scope_documents_ids = lmap(
        lambda i: i['id'],
        documents
    )

    # SKIP UNTOUCHED DOCUMENTS
    documents = lmap(
        lambda i: i[0],
        filter(
            lambda i: (i[1] is None) or ('hash' not in i[1]) or (i[0]['hash'] != i[1]['hash']),
            lmap(
                lambda document: (document, sync.open(document)),
                documents
            )
        ))

    # DO HEAVY PROCESS WITH DOCUMENTS
    documents = lmap(
        sync.compile,
        documents
    )

    # REPLACE PICTURE_OBJECT WITH IT _ID IN MONGODB
    sync_picture = lambda i: None if i is None else sync_image(i)['_id']
    documents = lmap(
        key_mapper('picture', sync_picture),
        documents
    )

    # SYNC TEACHER_PROFILE
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
    lprint_json(documents_to_remove)

    # DELETE
    print('UPDATE DOCUMENTS:')
    lprint_json(documents)
    print('[SYNC DOCUMENTS DONE]')


if __name__ == '__main__':
    main(dir_teachers, Teacher())
