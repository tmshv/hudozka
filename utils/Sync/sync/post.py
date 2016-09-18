import os

import settings
from sync.data import list_images
from sync import create_date_and_title_from_folder_name, create_post_from_image_list, create_date, images_from_html, \
    synced_images_ids, untouched
from sync.core.post import SyncPost
from utils.fn import lmap, map_cases, first, key_mapper, lmapfn, constant
from utils.io import read_yaml_md


def create_document_from_folder(sync, path, file_time_formats):
    # PARSE FOLDER NAME -> GET OPTIONAL DATE/TITLE
    doc_date, doc_title = create_date_and_title_from_folder_name(path, file_time_formats)
    document = {
        'folder': path,
        'date': doc_date,
        'title': doc_title,
    }

    # CREATE BASIC_MANIFEST BASED ON FOLDER NAME AND IMAGE CONTENT
    images = lmap(
        lambda img: os.path.relpath(img, path),
        list_images(sync.provider, path)
    )
    post = create_post_from_image_list(images)

    # TRY TO FILL UP BASIC_MANIFEST WITH MD_MANIFEST
    params = map_cases(
        document,
        [(
            lambda doc: md_from_folder(sync.provider, path),
            lambda doc: get_manifest(sync.provider, md_from_folder(sync.provider, path)),
        )],
        constant({})
    )

    document = {
        **document,
        **params,
        'images': images,
        'post': post
    }

    document = sync.create_id(document)
    document = sync.create_hash(document)
    return document


def get_manifest(provider, path):
    data = provider.read(path).read().decode('utf-8')
    y, m = read_yaml_md(data)
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


def md_from_folder(provider, i):
    return first(provider.type_filter(i, '.md'))


def get_folder_documents(sync, file_time_formats):
    # GET EVENT FOLDERS
    documents = lmap(
        lambda i: i,
        filter(
            lambda i: sync.provider.is_dir(i),
            sync.provider.scan('.')
        )
    )

    return lmap(
        lambda doc: create_document_from_folder(sync, doc, file_time_formats),
        documents
    )


# GET EVENT FILES
def get_file_documents(sync, file_time_formats):
    documents = sync.provider.type_filter('.', '.md')
    documents = lmap(
        lambda i: (i,) + create_date_and_title_from_folder_name(i, file_time_formats),
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
            **get_manifest(sync.provider, i['file'])
        },
        documents
    )

    # CREATE DOCUMENT IDENTITY
    documents = lmap(sync.create_id, documents)

    # CREATE HASH OF DOCUMENT FILE
    documents = lmap(sync.create_hash, documents)

    return documents


def main(sync, file_time_formats, update_documents=True, delete_documents=True):
    documents = get_folder_documents(sync, file_time_formats)
    documents += get_file_documents(sync, file_time_formats)

    # # CREATE SCOPE OF CURRENT SESSION
    scope_documents_ids = lmapfn(documents)(
        lambda i: i['id']
    )

    # SKIP UNTOUCHED DOCUMENTS
    documents = untouched(documents, sync)

    # # MAP EVENT MANIFEST -> EVENT_OBJECT
    # documents = lmap(
    #     sync.create,
    #     documents
    # )

    # FILTER INCORRECT EVENTS
    documents = list(filter(None, documents))

    # # REPLACE IMAGES OBJECTS WITH IT _ID IN MONGODB
    # documents = lmap(
    #     key_mapper('images', synced_images_ids),
    #     documents
    # )

    # SYNC EVENT_OBJECT WITH DB
    if update_documents:
        documents = lmap(
            sync.update,
            documents
        )

    documents_to_delete = []
    if delete_documents:
        remove_query = sync.create_remove_query({'id': {'$nin': scope_documents_ids}})
        documents_to_delete = sync.query(remove_query)
        documents_to_delete = lmap(
            sync.delete,
            map(
                lambda i: {'_id': i['_id']},
                documents_to_delete
            )
        )

    return documents, documents_to_delete


def sync_posts(provider, collection, update=True, delete=True):
    image_url_base = settings.image_base_url + 'post-{id}-{img}-{size}{ext}'

    return main(
        SyncPost(
            collection,
            provider,
            None,
            image_url_base,
            settings.dir_static_images,
            settings.event_image_sizes
        ),
        file_time_formats=['%Y.%m.%d'],
        update_documents=update,
        delete_documents=delete
    )
