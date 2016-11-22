import os

import settings
from sync import create_date_and_title_from_folder_name, create_post_from_image_list, create_date, untouched, \
    synced_images_ids, synced_image_id
from sync.core.album import SyncAlbum
from sync.data import list_images
from utils.fn import lmap, lmapfn, key_mapper
from utils.image import create_image
from utils.io import read_yaml_md


class ImageCreator:
    def __init__(self, provider, cache):
        super().__init__()
        self.provider = provider
        self.cache = cache if cache else set()

    def create_image(self, file, sizes, url_fn, output_dir, skip_processing=False):
        filehash = self.provider.hash(file)
        cached = self.cached(filehash)
        return create_image(self.provider.get_abs(file), sizes, url_fn, output_dir,
                            skip_processing=skip_processing) if not cached else cached

    def cached(self, name):
        return self.cache[name] if name in self.cache else None


def get_manifest(provider, filepath):
    data = provider.read(filepath).read().decode('utf-8')
    y, m = read_yaml_md(data)

    data = {**y} if y else {}
    _ = lambda key, d=None: data[key] if key in data else d

    date = create_date(str(_('date')), settings.date_formats_direct)
    if date:
        data['date'] = date

    album_id = _('id')
    if album_id:
        data['id'] = str(album_id)

    post = {'post': m} if m else {}
    return {**data, **post}


def album_from_folder(sync, path):
    # PARSE FOLDER NAME -> GET OPTIONAL DATE/TITLE
    date, title = create_date_and_title_from_folder_name(
        os.path.basename(path)
    )

    images = lmap(
        lambda i: os.path.relpath(i, path),
        list_images(sync.provider, path)
    )

    # CREATE BASIC_MANIFEST BASED ON FOLDER NAME AND IMAGE CONTENT
    document = {
        'folder': path,
        'date': date,
        'title': title,
        'post': create_post_from_image_list(images),
        'images': images
    }

    # TRY TO FILL UP BASIC_MANIFEST WITH MD_MANIFEST
    manifest = sync.provider.type_filter(path, '.md')
    manifest = manifest[0] if len(manifest) else None
    manifest = get_manifest(sync.provider, manifest) if manifest else {}
    manifest = manifest if manifest else {}

    document = {
        **document,
        **manifest
    }

    # CREATE DOCUMENT IDENTITY
    document = sync.create_id(document)

    # CREATE HASH OF DOCUMENT FILE
    document = sync.create_hash(document)

    return document


def main(sync, do_update, do_delete):
    # GET ALBUMS FOLDERS
    documents = lmap(
        lambda i: i,
        filter(
            lambda i: sync.provider.is_dir(i),
            sync.provider.scan('.')
        )
    )

    documents = lmap(
        lambda folder: album_from_folder(sync, folder),
        documents
    )

    # CREATE SCOPE OF CURRENT SESSION
    scope_documents_ids = lmapfn(documents)(
        lambda i: i['id']
    )

    # SKIP UNTOUCHED DOCUMENTS
    documents = untouched(documents, sync)

    # MAP EVENT MANIFEST -> EVENT_OBJECT
    documents = lmap(
        sync.create_album,
        documents
    )

    # # FILTER INCORRECT EVENTS
    documents = list(filter(None, documents))

    # REPLACE IMAGES OBJECTS WITH IT _ID IN MONGODB
    documents = lmap(
        key_mapper('images', synced_images_ids),
        documents
    )
    documents = lmap(
        key_mapper('preview', synced_image_id),
        documents
    )

    # SYNC OBJECT WITH DB
    if do_update:
        documents = lmap(
            sync.update,
            documents
        )

    documents_to_remove = sync.query({'id': {'$nin': scope_documents_ids}})

    if do_delete:
        documents_to_remove = lmap(
            sync.delete,
            map(
                lambda i: {'_id': i['_id']},
                documents_to_remove
            )
        )

    return documents, documents_to_remove


def sync_albums(provider, collection, update=True, delete=True):
    """
    :param collection:
    :param provider:
    :param update:
    :param delete:
    :return:
    """

    return main(
        SyncAlbum(
            collection,
            provider,
            image_creator=ImageCreator(provider, cache=None),
            images_dir=settings.dir_static_images
        ),
        do_update=update,
        do_delete=delete
    )
