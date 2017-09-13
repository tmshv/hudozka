import logging

import os

import lxml.html

import kazimir
import settings
from db import collection
from kazimir import kazimir_to_html
from sync import create_date_and_title_from_folder_name, images_from_html, create_post_from_image_list, create_date
from sync.data import Provider, list_images
from sync.models import Model
from sync.models.Image import Image

from utils.fn import swap_ext, first, map_cases, constant, combine
from utils.hash import hash_str
from utils.io import read_yaml_md, parse_yaml_front_matter
from utils.text.transform import url_encode_text

logger = logging.getLogger(settings.name + '.Person')
store = collection(settings.collection_articles)


def find(item_id: str):
    q = {'id': item_id}
    try:
        return store.find_one(q)
    except ValueError:
        pass
    return None


class Article(Model):
    @staticmethod
    async def scan(provider):
        documents = [i for i in provider.scan('.') if provider.is_dir(i)]
        documents = [Article.read(provider, i) for i in documents]
        return documents

    @staticmethod
    def read(provider, path):
        file_time_formats = ['%Y.%m.%d']

        # PARSE FOLDER NAME -> GET OPTIONAL DATE/TITLE
        doc_date, doc_title = create_date_and_title_from_folder_name(path, file_time_formats)
        document = {
            'folder': path,
            'date': doc_date,
            'title': doc_title,
        }

        # CREATE BASIC_MANIFEST BASED ON FOLDER NAME AND IMAGE CONTENT
        images = list_images(provider, path)
        images = [os.path.relpath(i, path) for i in images]
        document['images'] = images
        document['post'] = create_post_from_image_list(images)

        # TRY TO FILL UP BASIC_MANIFEST WITH MD_MANIFEST
        manifest_file = md_from_folder(provider, path)
        if manifest_file:
            manifest = get_manifest(provider, manifest_file)
        else:
            manifest = {}

        return Article(
            provider,
            path,
            params={
                **document,
                **manifest,
            },
        )

    def __init__(self, provider, file, params=None):
        # self.__id_template: str = '{category}-{file}'
        # self.__url_template: str = settings.document_url_template
        # self.__url_preview_template: str = settings.document_url_preview_template

        self.params = params if params else {}
        self.origin = settings.origin
        self.version = '2'
        self.post = None
        self.images = None
        super().__init__(provider, store, file)

    def init(self):
        self.__set_id()
        self.__set_hash()

    def validate(self):
        document = self.params
        if 'date' not in document or not document['date']:
            return None

        if 'title' not in document or not document['title']:
            return None

    async def build(self, **kwargs):
        sizes = kwargs['sizes']
        post, images = await create_post(self.provider, self.id, self.params, sizes)
        self.post = post
        self.images = images

        post, images = await create_post(self.provider, self.id, self.params, sizes)
        self.post = kazimir.html_from_tree(post)
        self.images = images

    def bake(self):
        return {
            **self.params,
            'images': [i.id for i in self.images],
            'post': self.post,
            'id': self.id,
            'hash': self.hash,
            'file': self.file,
            'origin': self.origin,
            'version': self.version,
        }

    def __set_id(self):
        if 'id' in self.params:
            self.id = self.params['id']
        else:
            self.id = url_encode_text(self.params['title'])

    def __set_hash(self):
        f = self.params['folder']
        images = sorted(self.params['images'])
        images = [os.path.join(f, i) for i in images]
        images = [self.provider.hash(i) for i in images]

        self.hash = hash_str(
            combine([hash_str(self.params)] + images)
        )

    def __str__(self):
        return '<Article hash={} file={} id={}>'.format(self.hash, self.file, self.id)


def md_from_folder(provider, i):
    return first(provider.type_filter(i, '.md'))


def get_manifest(provider, path):
    data = provider.read(path).read().decode('utf-8')
    manifest = parse_yaml_front_matter(data)

    if 'date' in manifest:
        manifest['date'] = create_date(manifest['date'], settings.date_formats)

    if 'until' in manifest:
        manifest['until'] = create_date(manifest['until'], settings.date_formats)

    if 'id' in manifest:
        manifest['id'] = str(manifest['id'])

    html = kazimir_to_html(manifest['content'])
    return {
        **manifest,
        'post': html,
        'images': images_from_html(html)  # Add images for hashing
    }


async def create_post(provider, doc_id, document, sizes):
    image_url_base = settings.image_url_base + 'post-{id}-{img}-{size}{ext}'

    post_html = lxml.html.fromstring(document['post'])
    images = []
    for img in post_html.cssselect('img'):
        src = img.get('src')
        relative_image_path = os.path.join(document['folder'], src)

        img_path = provider.get_local(relative_image_path)
        if os.path.exists(img_path):
            img_id = url_encode_text(os.path.splitext(src)[0])
            url_fn = lambda file, size, ext: image_url_base.format(
                id=doc_id,
                img=img_id,
                size=size,
                ext=ext.lower()
            )

            image = await Image.new(provider, img_path, sizes, url_fn)
            if image:
                url = image.get_size('big')['url']
                images.append(image)
                img.set('src', url)
            else:
                logger.error('Fail to get Image', document['folder'], src)
    return post_html, images
