import logging

import os

import kazimir
import settings
from db import collection
from sync import create_date_and_title_from_folder_name, create_post_from_image_list, create_date, \
    create_post
from sync.data import list_images
from sync.models import Model
from sync.models.Image import Image

from utils.fn import first, combine
from utils.hash import hash_str
from utils.io import parse_yaml_front_matter
from utils.text.transform import url_encode_text

logger = logging.getLogger(settings.name + '.Article')
store = collection(settings.collection_articles)


class Article(Model):
    @staticmethod
    async def find(query):
        return store.find(query)

    @staticmethod
    async def delete(query):
        return store.find_one_and_delete(query)

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

        # TRY TO FILL UP BASIC_MANIFEST WITH MD_MANIFEST
        manifest_file = md_from_folder(provider, path)
        if manifest_file:
            manifest = read_manifest(provider, manifest_file)
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
        self.hash_salt = settings.hash_salt_articles
        self.origin = settings.origin
        self.version = '2'
        self.post = None
        self.preview = None
        self.images = None
        super().__init__(provider, store, file, params=params)

    def init(self):
        if self.has_param('content'):
            images = kazimir.get_images_src(self.get_param('content'))
        else:
            images = list_images(self.provider, self.file)
            images = [os.path.relpath(i, self.file) for i in images]
        self.params['images'] = images

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

        if self.has_param('content'):
            markdown_post = self.get_param('content')
        else:
            markdown_post = create_post_from_image_list(self.get_param('images'))

        post, images = await create_post(self.provider, self.get_param('folder'), markdown_post, sizes)
        self.post = post
        self.images = images

        if self.has_param('preview'):
            preview = self.get_param('preview')
            preview = self._get_relpath(preview)
            preview = await Image.new(self.provider, preview, sizes)
            self.preview = preview

    def bake(self):
        return {
            **self.params,
            'images': [i.ref for i in self.images],
            'post': self.post,
            'id': self.id,
            'hash': self.hash,
            'file': self.file,
            'origin': self.origin,
            'version': self.version,
            'preview': self.preview.ref if self.preview else None,
        }

    def __set_id(self):
        if 'id' in self.params:
            self.id = self.params['id']
        else:
            self.id = url_encode_text(self.params['title'])

    def __set_hash(self):
        f = self.params['folder']
        images = sorted(self.params['images'])
        if self.has_param('preview'):
            images.append(self.get_param('preview'))
        images = [os.path.join(f, i) for i in images]
        images = [self.provider.hash(i) for i in images]

        self.hash = hash_str(
            combine([self.hash_salt] + [hash_str(self.params)] + images)
        )

    def __str__(self):
        return '<Article file={} id={}>'.format(self.file, self.id)


def md_from_folder(provider, i):
    return first(provider.type_filter(i, '.md'))


def read_manifest(provider, path):
    data = provider.read(path).read().decode('utf-8')
    manifest = parse_yaml_front_matter(data)

    if 'date' in manifest:
        manifest['date'] = create_date(manifest['date'], settings.date_formats)

    if 'until' in manifest:
        manifest['until'] = create_date(manifest['until'], settings.date_formats)

    if 'id' in manifest:
        manifest['id'] = str(manifest['id'])

    return {
        **manifest,
    }
