import os
from glob import glob

from db import db
from sync import Sync, untouched
from utils.fn import lprint, lprint_json, lmap
from utils.hash import hash_file
from utils.io import read_yaml

dir_documents = '/Users/tmshv/Dropbox/Dev/Hud school/Schedules'


class SyncSchedule(Sync):
    def __init__(self):
        super().__init__()
        self.collection = db().schedules

    def create_id(self, document):
        id = document['id'] if 'id' in document and document['id'] else None
        if not id:
            id = 'schedule-{period}-{semester}'.format(**document)
        document['id'] = id
        return document

    def create_hash(self, document):
        return {
            **document,
            'hash': hash_file(document['file'])
        }


if __name__ == '__main__':
    # ALL DOCUMENTS IDS FOUNDED
    scope_documents_ids = []

    # INIT
    os.chdir(dir_documents)
    sync = SyncSchedule()

    # COLLECT YAML/MD/JPG/PDF MANIFEST FILES
    documents = glob('*.yaml')

    # READ MANIFEST
    documents = lmap(
        lambda i: {
            'file': i,
            **read_yaml(i)
        },
        documents
    )

    # # CREATE DOCUMENT IDENTITY
    documents = lmap(sync.create_id, documents)

    # CREATE DOCUMENT HASH
    documents = lmap(sync.create_hash, documents)

    # # CREATE SCOPE OF CURRENT SESSION
    scope_documents_ids = lmap(
        lambda i: i['id'],
        documents
    )

    # # SKIP UNTOUCHED DOCUMENTS
    documents = untouched(documents, sync)

    # DO HEAVY PROCESS WITH DOCUMENTS

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

    # # DELETE
    print('DELETE DOCUMENTS:')
    lprint_json(documents_to_remove)

    # DELETE
    print('UPDATE DOCUMENTS:')
    lprint_json(documents)
    print('[SYNC DOCUMENTS DONE]')
