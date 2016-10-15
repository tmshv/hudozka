import os
from glob import glob

import settings
from sync import untouched
from sync.core.person import SyncPerson
from sync.image import sync_image
from utils.fn import lmap, lprint, key_mapper, lprint_json, ext, lmapfn
from utils.io import read_yaml_md

url_base = settings.teacher_image_url_base
dir_local_images = settings.teacher_image_output
sizes = settings.teacher_image_sizes


def sync_persons(provider, collection, update=True, delete=True):
    """
    :param collection:
    :param provider:
    :param update:
    :param delete:
    :return:
    """

    return main(
        SyncPerson(
            collection,
            provider,
            dir_local_images
        ),
        update_documents=update,
        delete_documents=delete
    )


def main(sync, update_documents=False, delete_documents=False):
    # GET TEACHER YAML/MD MANIFEST FILES
    documents = sync.provider.type_filter('', '.md')

    # READ TEACHER YAML/MD MANIFEST
    documents = lmap(
        lambda i: (i,) + get_manifest(sync.provider, i),
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
    documents = untouched(documents, sync)

    # documents = lmap(
    #     lambda i: i[0],
    #     filter(
    #         lambda i: (i[1] is None) or ('hash' not in i[1]) or (i[0]['hash'] != i[1]['hash']),
    #         lmap(
    #             lambda document: (document, sync.open(document)),
    #             documents
    #         )
    #     ))

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
    if update_documents:
        documents = lmap(
            sync.update,
            documents
        )

    documents_to_delete = sync.query({'id': {'$nin': scope_documents_ids}})
    if delete_documents:
        documents_to_delete = lmap(
            sync.delete,
            map(
                lambda i: {'_id': i['_id']},
                documents_to_delete
            )
        )

    return documents, documents_to_delete


def get_manifest(provider, path):
    data = provider.read(path).read().decode('utf-8')
    return read_yaml_md(data)