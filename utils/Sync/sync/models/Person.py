import logging

import os

import settings
from db import collection
from sync import create_post
from sync.data import Provider
from sync.models import Model
from sync.models.Image import Image

from utils.fn import swap_ext
from utils.hash import hash_str
from utils.io import read_yaml_md, parse_yaml_front_matter
from utils.text.transform import url_encode_text

logger = logging.getLogger(settings.name + '.Person')
store = collection(settings.collection_collective)


class Person(Model):
    @staticmethod
    async def find(query):
        return store.find(query)

    @staticmethod
    async def delete(query):
        return store.find_one_and_delete(query)

    @staticmethod
    async def scan(provider):
        scan_dir = settings.dir_persons
        documents = provider.type_filter(scan_dir, '.md')
        documents = [Person.read(provider, i) for i in documents]
        return documents

    @staticmethod
    def read(provider, path):
        params = get_manifest(provider, path)

        return Person(
            provider,
            path,
            params=params,
        )

    def __init__(self, provider, file, params=None):
        self.__hash_salt = settings.hash_salt_person
        self.__hash_keys = ['id', 'url']

        self.__id_template: str = '{category}-{file}'
        self.__url_template: str = settings.document_url_template
        self.__url_preview_template: str = settings.document_url_preview_template

        self.picture = None
        self.preview = None
        self.post = None
        self.images = None
        self.documents = None

        super().__init__(provider, store, file, params)

    def init(self):
        pass
        self.__set_id()
        self.__set_hash()

    async def build(self, **kwargs):
        sizes = kwargs['sizes']
        image_path = self._get_relpath(self.get_param('picture'))

        self.picture = await Image.new(self.provider, image_path, sizes)

        markdown_post = self.get_param('content')
        post, images, documents = await create_post(self.provider, self.get_param('folder'), markdown_post, sizes)
        self.post = post
        self.images = images
        self.documents = documents

        if self.has_param('preview'):
            preview = self.get_param('preview')
            preview = self._get_relpath(preview)
            self.preview = await Image.new(self.provider, preview, sizes)

    def bake(self):
        return {
            **self.params,
            'post': self.post,
            'images': [x.ref for x in self.images],
            'documents': [x.ref for x in self.documents],
            'id': self.id,
            'hash': self.hash,
            'file': self.file,
            'picture': self.picture.ref,
            'preview': self.preview.ref if self.preview else None,
        }

    def __set_id(self):
        if 'id' in self.params:
            self.id = self.params['id']
        else:
            self.id = url_encode_text(self.params['name'])

    def __set_hash(self):
        files = [self.file]
        files.append(self._get_relpath(self.get_param('picture')))

        if self.has_param('preview'):
            files.append(self._get_relpath(self.get_param('preview')))

        hashes = [self.provider.hash(x) for x in files]
        self.hash = hash_str(
            self.__hash_salt + ''.join(hashes)
        )

    def __str__(self):
        return f'<Person file={self.file} id={self.id}>'


def get_manifest(provider: Provider, path: str) -> dict:
    data = provider.read(path).read().decode('utf-8')

    manifest = parse_yaml_front_matter(data)
    return {
        **manifest,
        'picture': manifest['picture'] if 'picture' in manifest else os.path.basename(swap_ext('.jpg')(path)),
        'preview': manifest['preview'] if 'preview' in manifest else os.path.basename(swap_ext('.jpg')(path)),
        'folder': os.path.dirname(path),
        'hidden': manifest['hidden'] if 'hidden' in manifest else False,
    }
