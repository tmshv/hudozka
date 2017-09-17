import logging

import settings
from db import collection
from sync.data import Provider
from sync.models import Model
from sync.models.Image import Image

from utils.fn import swap_ext
from utils.hash import hash_str
from utils.io import read_yaml_md
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
        documents = provider.type_filter('', '.md')
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
        self.__hash_keys = ['id', 'url']

        self.__id_template: str = '{category}-{file}'
        self.__url_template: str = settings.document_url_template
        self.__url_preview_template: str = settings.document_url_preview_template

        self.picture = None

        super().__init__(provider, store, file, params)

    def init(self):
        pass
        self.__set_id()
        self.__set_hash()

    async def build(self, **kwargs):
        sizes = kwargs['sizes']
        image_path = self.provider.get_abs(self.get_param('picture'))

        self.picture = await Image.new(self.provider, image_path, sizes)

    def bake(self):
        return {
            **self.params,
            'id': self.id,
            'hash': self.hash,
            'file': self.file,
            'picture': self.picture.id,
        }

    def __set_id(self):
        if 'id' in self.params:
            self.id = self.params['id']
        else:
            self.id = url_encode_text(self.params['name'])

    def __set_hash(self):
        self.hash = hash_str(
            self.provider.hash(self.file) + self.provider.hash(self.params['picture'])
        )

    def __str__(self):
        return '<Person hash={} file={} id={}>'.format(self.hash, self.file, self.id)


def get_manifest(provider: Provider, path: str) -> dict:
    data = provider.read(path).read().decode('utf-8')

    manifest, body = read_yaml_md(data)
    manifest = {
        **manifest,
        'file': path,
        'biography': body,
        'picture': manifest['picture'] if 'picture' in manifest else swap_ext('.jpg')(path),
    }

    return manifest


def url_factory(id):
    def url(file, size, ext):
        return settings.person_image_url_template.format(id=id, size=size, ext=ext)

    return url
