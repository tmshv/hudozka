import os

import settings
from sync.core import Sync
from sync.data import list_images, Provider
from sync import create_date_and_title_from_folder_name, create_post_from_image_list, create_date, images_from_html, \
    synced_images_ids, untouched, title_from_html, create_post
from sync.core.post import SyncPost
from utils.fn import lmap, map_cases, first, key_mapper, lmapfn, constant
from utils.hash import hash_str
from utils.image import create_image
from utils.io import read_yaml_md
from utils.text.transform import url_encode_text


class ImageCreator:
    def __init__(self, provider: Provider, sizes: list, output_dir: str, cache: dict):
        super().__init__()
        self.provider = provider
        self.sizes = sizes
        self.output_dir = output_dir
        self.cache = cache if cache else set()

    def create(self, file, name_fn):
        filehash = self.provider.hash(file)
        cached = self.cached(filehash)
        if cached:
            return cached
        return create_image(self.provider.get_abs(file), self.sizes, name_fn, self.output_dir, skip_processing=False)

    def cached(self, name):
        return self.cache[name] if name in self.cache else None


def create_document_from_folder(provider, path):
    document = {
        'file': os.path.basename(path),
        'folder': os.path.dirname(path),
        'title': os.path.basename(path),
    }

    manifest = get_manifest(provider, path)
    document = {
        **document,
        **manifest,
    }

    if 'url' not in document:
        return None

    document = create_id(document)
    document = create_hash(provider, document)
    return document


def get_manifest(provider, path):
    dirname = os.path.dirname(path)
    data = provider.read(path).read().decode('utf-8')
    manifest, body = read_yaml_md(data)
    manifest = manifest if manifest else {}

    if 'date' in manifest:
        manifest['date'] = create_date(manifest['date'], settings.date_formats)

    if 'until' in manifest:
        manifest['until'] = create_date(manifest['until'], settings.date_formats)

    if 'id' in manifest:
        manifest['id'] = str(manifest['id'])

    if 'content' in manifest:
        body = provider.read(os.path.join(dirname, manifest['content'])).read().decode('utf-8')
        del manifest['content']

    return {
        **manifest,
        'data': body,
        'title': title_from_html(body),
        'images': images_from_html(body)
    }


def create_id(document):
    new_id = url_encode_text(document['url'])
    return {
        **document,
        'id': document['id'] if 'id' in document else new_id
    }


def create_hash(provider, document):
    files = sorted([document['file']] + document['images'])
    hashes = lmap(
        provider.hash,
        lmap(
            lambda x: os.path.join(document['folder'], x),
            files
        )
    )

    return {
        **document,
        'hash': hash_str(''.join(hashes))
    }


def create_page(provider: Provider, img: ImageCreator, document):
    image_path = lambda x: os.path.join(document['folder'], x)
    image_id = lambda filename: url_encode_text(
        os.path.splitext(filename)[0]
    )

    def process_image(src: str):
        path = image_path(src)

        if provider.exists(path):
            url = lambda s, e: settings.url_page_base_preview.format(
                page=document['id'],
                id=image_id(src),
                size=s,
                ext=e
            )

            image = img.create(path, url)
            if image:
                images.append(image)
                return image['data']['big']['url']
        return None

    images = []
    post_html = create_post(document['data'], process_image)

    document['data'] = post_html
    document['images'] = images
    return document


def check_url(documents):
    urls = list(map(
        lambda i: i['url'],
        documents
    ))

    unique_urls = set(urls)
    if len(urls) != len(unique_urls):
        raise Exception('URL of pages should be unique')


def sync_pages(provider, collection, update=True, delete=True, skip_unchanged=True):
    img_sizes = settings.album_image_sizes
    output_dir = settings.dir_static_images

    sync = Sync()
    sync.collection = collection
    image_creator = ImageCreator(provider, img_sizes, output_dir, {})

    documents = list(filter(
        lambda x: provider.is_dir(x),
        provider.scan('.')
    ))

    documents = lmap(
        lambda x: provider.type_filter(x, '.md'),
        documents
    )

    documents = list(filter(
        lambda x: len(x),
        documents
    ))

    documents = lmap(
        lambda x: create_document_from_folder(provider, x[0]),
        documents
    )

    documents = list(filter(None, documents))

    # CREATE SCOPE OF CURRENT SESSION
    documents_ids = lmapfn(documents)(
        lambda i: i['id']
    )

    check_url(documents)

    # SKIP UNTOUCHED DOCUMENTS
    if skip_unchanged:
        documents = untouched(documents, sync)

    # # MAP EVENT MANIFEST -> EVENT_OBJECT
    # documents = lmap(
    #     sync.create,
    #     documents
    # )

    documents = lmap(
        lambda document: create_page(provider, image_creator, document),
        documents
    )

    # REPLACE IMAGES OBJECTS WITH IT _ID IN MONGODB
    documents = lmap(
        key_mapper('images', synced_images_ids),
        documents
    )

    # SYNC EVENT_OBJECT WITH DB
    if update:
        documents = lmap(
            sync.update,
            documents
        )

    documents_to_delete = []
    if delete:
        remove_query = sync.create_remove_query({'id': {'$nin': documents_ids}})
        documents_to_delete = sync.query(remove_query)
        documents_to_delete = lmap(
            sync.delete,
            map(
                lambda i: {'_id': i['_id']},
                documents_to_delete
            )
        )

    return documents, documents_to_delete
